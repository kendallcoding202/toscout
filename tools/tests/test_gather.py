"""Tests for the gatherer's parsing and filtering.

Network fetching is mocked: these verify that real API response shapes are parsed
correctly, that every utterance carries a permalink, and that nothing leaks an author
name. Run: python3 tools/tests/test_gather.py
"""
import json
import os
import sys
import unittest
from unittest import mock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import gather  # noqa: E402


HN_RESPONSE = {
    "hits": [
        {
            "objectID": "38112233",
            "comment_text": "I lose an entire day a month to invoicing and chasing people who "
                            "said yes in March.&#x27;s brutal.<p>Nobody warns you.",
            "author": "someuser",
            "created_at": "2026-03-14T09:21:00.000Z",
        },
        {"objectID": "38112234", "author": "b", "created_at": "2026-03-15T09:21:00.000Z"},
    ]
}

SE_RESPONSE = {
    "items": [
        {
            "title": "How do I raise rates without losing my best client?",
            "body": "<p>Every time I raise my rate I lose the client who referred me "
                    "everyone else.</p><script>bad()</script>",
            "link": "https://graphicdesign.stackexchange.com/questions/1234",
            "creation_date": 1773000000,
            "owner": {"display_name": "designer99"},
        }
    ]
}

DISCOURSE_RESPONSE = {
    "posts": [
        {
            "topic_id": 555,
            "post_number": 3,
            "blurb": "I feel like a fraud charging $80 an hour when I don't have an agency behind me.",
            "created_at": "2026-02-02T12:00:00.000Z",
            "username": "illustrator_jo",
        }
    ]
}

RSS_XML = b"""<?xml version="1.0"?><rss version="2.0"><channel>
<item><title>On pricing</title><link>https://example.com/a</link>
<description>&lt;p&gt;A number. Not a course. A &lt;b&gt;number&lt;/b&gt;.&lt;/p&gt;</description>
<pubDate>Mon, 03 Feb 2026 10:00:00 +0000</pubDate></item>
</channel></rss>"""


class TestClean(unittest.TestCase):
    def test_strips_tags_entities_and_scripts(self):
        out = gather.clean("<p>Hello &amp; <b>welcome</b></p><script>evil()</script>")
        self.assertNotIn("<", out)
        self.assertNotIn("evil", out)
        self.assertIn("Hello & welcome", out)

    def test_paragraph_breaks_survive(self):
        self.assertIn("\n\n", gather.clean("<p>one</p><p>two</p>"))

    def test_empty_input(self):
        self.assertEqual(gather.clean(None), "")


class TestAuthorHash(unittest.TestCase):
    def test_stable_and_case_insensitive(self):
        self.assertEqual(gather.author_hash("Jo"), gather.author_hash(" jo "))

    def test_does_not_contain_the_name(self):
        self.assertNotIn("jo", gather.author_hash("jo"))

    def test_none_stays_none(self):
        self.assertIsNone(gather.author_hash(None))


class TestISO(unittest.TestCase):
    def test_epoch_seconds(self):
        self.assertTrue(gather.iso(1773000000).startswith("2026-"))

    def test_rfc822(self):
        self.assertTrue(gather.iso("Mon, 03 Feb 2026 10:00:00 +0000").startswith("2026-02-03"))

    def test_unparseable_is_kept_not_dropped(self):
        self.assertEqual(gather.iso("sometime last spring"), "sometime last spring")


class TestAdapters(unittest.TestCase):
    def test_hackernews(self):
        with mock.patch.object(gather, "_get_json", return_value=HN_RESPONSE):
            out = list(gather.hackernews({"queries": ["freelance rates"]}))
        self.assertEqual(len(out), 1, "the hit with no body text should be skipped")
        u = out[0]
        self.assertEqual(u["permalink"], "https://news.ycombinator.com/item?id=38112233")
        self.assertIn("chasing people", u["text"])
        self.assertNotIn("<p>", u["text"])
        self.assertNotIn("&#x27;", u["text"])
        self.assertEqual(u["query"], "freelance rates")

    def test_stackexchange(self):
        with mock.patch.object(gather, "_get_json", return_value=SE_RESPONSE):
            out = list(gather.stackexchange({"site": "graphicdesign", "queries": ["pricing"]}))
        self.assertEqual(len(out), 1)
        self.assertIn("raise my rate", out[0]["text"])
        self.assertNotIn("bad()", out[0]["text"])
        self.assertTrue(out[0]["permalink"].startswith("https://"))

    def test_discourse(self):
        with mock.patch.object(gather, "_get_json", return_value=DISCOURSE_RESPONSE):
            out = list(gather.discourse({"base_url": "https://forum.test/",
                                         "queries": ["pricing"], "name": "Forum"}))
        self.assertEqual(out[0]["permalink"], "https://forum.test/t/555/3")
        self.assertIn("like a fraud", out[0]["text"])

    def test_rss(self):
        with mock.patch.object(gather, "_get", return_value=RSS_XML):
            out = list(gather.rss({"url": "https://example.com/feed.xml", "name": "Blog"}))
        self.assertEqual(out[0]["permalink"], "https://example.com/a")
        self.assertIn("Not a course", out[0]["text"])
        self.assertTrue(out[0]["posted_at"].startswith("2026-02-03"))

    def test_manual(self):
        out = list(gather.manual({"entries": [
            {"permalink": "https://reddit.com/r/x/1", "text": "read by hand"}]}))
        self.assertEqual(out[0]["source_type"], "manual")
        self.assertEqual(out[0]["permalink"], "https://reddit.com/r/x/1")

    def test_every_utterance_has_a_permalink(self):
        """The product's core promise. A quote you can't link to is not evidence."""
        with mock.patch.object(gather, "_get_json", return_value=HN_RESPONSE):
            hn = list(gather.hackernews({"queries": ["q"]}))
        with mock.patch.object(gather, "_get_json", return_value=SE_RESPONSE):
            se = list(gather.stackexchange({"site": "s", "queries": ["q"]}))
        for u in hn + se:
            self.assertTrue(u["permalink"], "utterance without a permalink: %r" % u)

    def test_no_adapter_named_reddit(self):
        """Guards the decision that killed the incumbent. See WHY_NO_REDDIT."""
        self.assertNotIn("reddit", gather.ADAPTERS)


class TestPipeline(unittest.TestCase):
    def test_dedupe_by_permalink_and_text(self):
        u = gather.utterance("s", "t", "https://x/1", "same text here", None)
        self.assertEqual(len(gather.dedupe([u, dict(u), u])), 1)

    def test_dedupe_keeps_distinct_permalinks(self):
        a = gather.utterance("s", "t", "https://x/1", "same text here", None)
        b = gather.utterance("s", "t", "https://x/2", "same text here", None)
        self.assertEqual(len(gather.dedupe([a, b])), 2)

    def test_relevance_gate_min_chars(self):
        short = gather.utterance("s", "t", "https://x/1", "too short", None)
        self.assertFalse(gather.keep(short, 80, []))

    def test_relevance_gate_pattern(self):
        u = gather.utterance("s", "t", "https://x/1", "x" * 100 + " invoicing", None)
        self.assertTrue(gather.keep(u, 80, ["invoic"]))
        self.assertFalse(gather.keep(u, 80, ["nonsense"]))

    def test_markdown_links_every_quote(self):
        us = [gather.utterance("Forum", "discourse", "https://x/1", "y" * 120, None)]
        md = gather.to_markdown(us, "test audience")
        self.assertIn("https://x/1", md)
        self.assertIn("test audience", md)

    def test_markdown_does_not_leak_author_names(self):
        us = [gather.utterance("Forum", "discourse", "https://x/1", "y" * 120, None,
                               author="illustrator_jo")]
        self.assertNotIn("illustrator_jo", gather.to_markdown(us, "a"))

    def test_one_dead_source_does_not_kill_the_run(self):
        cfg = {"sources": [{"type": "hackernews", "queries": ["q"]},
                           {"type": "nonexistent_type"}]}
        with mock.patch.object(gather, "_get_json", return_value=HN_RESPONSE):
            got, problems = gather.run(cfg)
        self.assertEqual(len(got), 1)
        self.assertEqual(len(problems), 1)
        self.assertIn("unknown source type", problems[0])

    def test_adapter_exception_is_collected_not_raised(self):
        cfg = {"sources": [{"type": "hackernews", "queries": ["q"]}]}
        with mock.patch.object(gather, "_get_json", side_effect=RuntimeError("502 upstream")):
            got, problems = gather.run(cfg)
        self.assertEqual(got, [])
        self.assertIn("502 upstream", problems[0])


class TestExampleConfig(unittest.TestCase):
    def test_ships_valid_and_uses_only_real_adapters(self):
        path = os.path.join(os.path.dirname(__file__), "..", "..", "cards",
                            "example.sources.json")
        with open(path) as fh:
            cfg = json.load(fh)
        self.assertIn("audience", cfg)
        for src in cfg["sources"]:
            self.assertIn(src["type"], gather.ADAPTERS)


if __name__ == "__main__":
    unittest.main(verbosity=2)
