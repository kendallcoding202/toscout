#!/usr/bin/env python3
"""Collect what a group of people actually said, in public, with a link to every line.

Stdlib only. No API keys. Deliberately no Reddit adapter — see WHY_NO_REDDIT below.

Usage:
    python3 tools/gather.py --config cards/example.sources.json --out out/illustrators
    python3 tools/gather.py --config cards/example.sources.json --out out/x --dry-run

Writes:
    <out>.jsonl   one normalized Utterance per line, for the extraction step
    <out>.md      the same thing, skimmable, so a human can read it in twenty minutes

The tool gathers. It does not decide what matters. That part is yours, on purpose:
until you have built ten cards by hand you do not yet know what belongs in one, and
automating that judgment now would just be automating a guess.
"""

WHY_NO_REDDIT = """
Reddit's API terms forbid commercial use without a commercial licence. GummySearch --
profitable, ~135k users, the leader in this exact niche -- shut down because it could
not get one; at the cited $0.24/1000 calls, covering the cost at a normal margin meant
charging north of $400/month per customer.

So: no Reddit adapter, not now and not later. Read Reddit yourself in a browser like
anyone else and paste anything good into a manual source file. Do not automate it.
""".strip()

import argparse
import hashlib
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from xml.etree import ElementTree

USER_AGENT = "scout-gather/0.1 (voice-of-customer research; +https://toscout.com)"
TIMEOUT = 30


# ---------------------------------------------------------------- utilities

def _get(url, retries=3):
    """GET a URL, returning bytes. Retries on transient failures with backoff."""
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                return resp.read()
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as exc:
            last = exc
            status = getattr(exc, "code", None)
            if status and 400 <= status < 500 and status not in (408, 429):
                break  # client error, retrying won't help
            time.sleep(2 ** attempt)
    raise RuntimeError("GET failed after %d attempts: %s (%s)" % (retries, url, last))


def _get_json(url):
    return json.loads(_get(url).decode("utf-8", "replace"))


TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"[ \t ]+")


def clean(text):
    """Strip markup and normalize whitespace, keeping paragraph breaks."""
    if not text:
        return ""
    text = re.sub(r"(?is)<(script|style).*?</\1>", " ", text)
    text = re.sub(r"(?i)<br\s*/?>", "\n", text)
    text = re.sub(r"(?i)</p>", "\n\n", text)
    text = TAG_RE.sub(" ", text)
    text = html.unescape(text)
    text = WS_RE.sub(" ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def author_hash(name):
    """Never store a name. A stable hash is enough to spot one person repeating themselves."""
    if not name:
        return None
    return hashlib.sha256(name.strip().lower().encode("utf-8")).hexdigest()[:12]


def iso(ts):
    """Coerce epoch seconds or an ISO-ish string into a UTC ISO-8601 string."""
    if ts is None:
        return None
    if isinstance(ts, (int, float)):
        return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()
    ts = str(ts).strip()
    for fmt in ("%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%dT%H:%M:%S.%fZ",
                "%a, %d %b %Y %H:%M:%S %z", "%Y-%m-%d %H:%M:%S"):
        try:
            dt = datetime.strptime(ts, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc).isoformat()
        except ValueError:
            continue
    return ts  # unparseable; keep the raw value rather than dropping it


def utterance(source, source_type, permalink, text, posted_at, author=None, query=None):
    return {
        "source": source,
        "source_type": source_type,
        "permalink": permalink,
        "text": clean(text),
        "posted_at": iso(posted_at),
        "author_hash": author_hash(author),
        "query": query,
    }


# ---------------------------------------------------------------- adapters
# Each adapter takes a source config dict and yields Utterance dicts.
# Every utterance MUST carry a working permalink. A quote you can't link to is
# not evidence, and the whole product rests on that distinction.

def hackernews(cfg):
    """Hacker News comments and stories via the free Algolia API. No key required."""
    per_page = min(int(cfg.get("limit", 50)), 100)
    tags = cfg.get("tags", "comment")
    for q in cfg["queries"]:
        url = ("https://hn.algolia.com/api/v1/search?query=%s&tags=%s&hitsPerPage=%d"
               % (urllib.parse.quote(q), urllib.parse.quote(tags), per_page))
        for hit in _get_json(url).get("hits", []):
            body = hit.get("comment_text") or hit.get("story_text") or hit.get("title")
            if not body:
                continue
            yield utterance(
                source="Hacker News",
                source_type="hackernews",
                permalink="https://news.ycombinator.com/item?id=%s" % hit.get("objectID"),
                text=body,
                posted_at=hit.get("created_at"),
                author=hit.get("author"),
                query=q,
            )


def stackexchange(cfg):
    """Stack Exchange questions via the public API. Free without a key at low volume."""
    site = cfg["site"]
    per_page = min(int(cfg.get("limit", 50)), 100)
    for q in cfg["queries"]:
        url = ("https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=votes"
               "&q=%s&site=%s&pagesize=%d&filter=withbody"
               % (urllib.parse.quote(q), urllib.parse.quote(site), per_page))
        for item in _get_json(url).get("items", []):
            yield utterance(
                source="Stack Exchange: %s" % site,
                source_type="stackexchange",
                permalink=item.get("link"),
                text="%s\n\n%s" % (item.get("title", ""), item.get("body", "")),
                posted_at=item.get("creation_date"),
                author=(item.get("owner") or {}).get("display_name"),
                query=q,
            )


def discourse(cfg):
    """Any public Discourse forum. Thousands of niche professional communities run on it,
    they expose JSON without a key, and none of them have Reddit's licensing problem."""
    base = cfg["base_url"].rstrip("/")
    limit = int(cfg.get("limit", 30))
    for q in cfg["queries"]:
        url = "%s/search.json?q=%s" % (base, urllib.parse.quote(q))
        data = _get_json(url)
        for post in (data.get("posts") or [])[:limit]:
            topic_id = post.get("topic_id")
            yield utterance(
                source=cfg.get("name", base),
                source_type="discourse",
                permalink="%s/t/%s/%s" % (base, topic_id, post.get("post_number", 1)),
                text=post.get("blurb") or post.get("cooked") or "",
                posted_at=post.get("created_at"),
                author=post.get("username"),
                query=q,
            )


def rss(cfg):
    """Any RSS or Atom feed: niche blogs, forum feeds, review-site exports."""
    root = ElementTree.fromstring(_get(cfg["url"]))
    items = root.findall(".//item") or root.findall("{http://www.w3.org/2005/Atom}entry")
    limit = int(cfg.get("limit", 50))
    for item in items[:limit]:
        def field(*names):
            for name in names:
                node = item.find(name)
                if node is not None:
                    return node.get("href") if node.get("href") else (node.text or "")
            return ""
        link = field("link", "{http://www.w3.org/2005/Atom}link")
        body = field("description", "content:encoded", "{http://www.w3.org/2005/Atom}content",
                     "{http://www.w3.org/2005/Atom}summary")
        title = field("title", "{http://www.w3.org/2005/Atom}title")
        if not link:
            continue
        yield utterance(
            source=cfg.get("name", cfg["url"]),
            source_type="rss",
            permalink=link.strip(),
            text="%s\n\n%s" % (title, body),
            posted_at=field("pubDate", "{http://www.w3.org/2005/Atom}published"),
            query=cfg.get("name"),
        )


def manual(cfg):
    """Quotes you gathered by hand — from Reddit, a Facebook group, a sales call, anywhere
    an automated fetch shouldn't or can't go. Same shape, same permalink requirement."""
    for entry in cfg["entries"]:
        yield utterance(
            source=cfg.get("name", "manual"),
            source_type="manual",
            permalink=entry["permalink"],
            text=entry["text"],
            posted_at=entry.get("posted_at"),
            author=entry.get("author"),
            query=entry.get("query"),
        )


ADAPTERS = {
    "hackernews": hackernews,
    "stackexchange": stackexchange,
    "discourse": discourse,
    "rss": rss,
    "manual": manual,
}


# ---------------------------------------------------------------- pipeline

def dedupe(utterances):
    """Drop exact repeats. Same text at the same permalink is one utterance."""
    seen, out = set(), []
    for u in utterances:
        key = (u["permalink"], u["text"][:200])
        if key in seen:
            continue
        seen.add(key)
        out.append(u)
    return out


def keep(u, min_chars, must_match):
    """Cheap relevance gate. Runs before any model sees anything, which is where the
    cost control lives. Deliberately dumb: better to over-include and skim."""
    text = u["text"]
    if len(text) < min_chars:
        return False
    if must_match and not any(re.search(p, text, re.I) for p in must_match):
        return False
    return True


def to_markdown(utterances, config_name):
    """A file a human can actually read. This is the point: you skim it, you mark the
    lines that made you feel something, and those become the card."""
    lines = [
        "# Gathered utterances — %s" % config_name,
        "",
        "%d quotes · gathered %s" % (len(utterances),
                                     datetime.now(timezone.utc).strftime("%Y-%m-%d")),
        "",
        "Read this with a highlighter. The lines that make you wince or nod are the card.",
        "",
    ]
    by_source = {}
    for u in utterances:
        by_source.setdefault(u["source"], []).append(u)
    for source, group in sorted(by_source.items(), key=lambda kv: -len(kv[1])):
        lines += ["## %s (%d)" % (source, len(group)), ""]
        for u in group:
            snippet = u["text"].replace("\n", " ").strip()
            if len(snippet) > 600:
                snippet = snippet[:600].rsplit(" ", 1)[0] + "…"
            date = (u["posted_at"] or "")[:10]
            lines += ["> %s" % snippet, "", "[source](%s) %s" % (u["permalink"], date), ""]
    return "\n".join(lines)


def run(config, dry_run=False):
    min_chars = int(config.get("min_chars", 80))
    must_match = config.get("must_match", [])
    collected, problems = [], []

    for src in config["sources"]:
        kind = src.get("type")
        adapter = ADAPTERS.get(kind)
        if adapter is None:
            problems.append("unknown source type: %r" % kind)
            continue
        label = (src.get("name") or src.get("site") or src.get("base_url")
                 or ", ".join(src.get("queries", []))[:40] or kind)
        if dry_run:
            print("  would fetch %-14s %s" % (kind, label))
            continue
        try:
            got = list(adapter(src))
            collected += got
            print("  %-14s %-42s %3d utterances" % (kind, label[:42], len(got)))
        except Exception as exc:                      # one dead source must not kill a run
            problems.append("%s (%s): %s" % (kind, label, exc))
            print("  %-14s %-42s FAILED: %s" % (kind, label[:42], exc), file=sys.stderr)

    if dry_run:
        return [], problems

    before = len(collected)
    collected = dedupe(collected)
    collected = [u for u in collected if keep(u, min_chars, must_match)]
    collected.sort(key=lambda u: u.get("posted_at") or "", reverse=True)
    print("\n  %d gathered → %d after dedupe and relevance gate" % (before, len(collected)))
    return collected, problems


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--config", help="JSON source list (see cards/example.sources.json)")
    ap.add_argument("--out", help="output path prefix; writes .jsonl and .md")
    ap.add_argument("--dry-run", action="store_true", help="list what would be fetched, fetch nothing")
    ap.add_argument("--why-no-reddit", action="store_true", help="explain the missing adapter")
    args = ap.parse_args(argv)

    if args.why_no_reddit:
        print(WHY_NO_REDDIT)
        return 0

    if not args.config or not args.out:
        ap.error("--config and --out are required")

    with open(args.config) as fh:
        config = json.load(fh)

    name = config.get("audience", os.path.basename(args.config))
    print('Gathering for: "%s"\n' % name)

    utterances, problems = run(config, dry_run=args.dry_run)
    if args.dry_run:
        return 0

    out_dir = os.path.dirname(os.path.abspath(args.out))
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    with open(args.out + ".jsonl", "w") as fh:
        for u in utterances:
            fh.write(json.dumps(u, ensure_ascii=False) + "\n")
    with open(args.out + ".md", "w") as fh:
        fh.write(to_markdown(utterances, name))

    print("\n  wrote %s.jsonl and %s.md" % (args.out, args.out))
    if problems:
        print("\n  %d source(s) had problems:" % len(problems))
        for p in problems:
            print("    - %s" % p)
    if not utterances:
        print("\n  Nothing came back. Widen the queries, or the sources are wrong for this group.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
