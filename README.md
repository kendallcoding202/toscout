# Scout

**Your people already told you what to say.**

Scout listens to where your smallest viable audience actually talks — forums, threads, Q&A
sites, comment sections — and keeps one living document of their exact words, with a real
quote and a link behind every line. **Red Pen**, the free half, holds your draft up against
that document and refuses to rewrite a word for you.

It's voice-of-customer research, delivered as a document. Built for freelance copywriters and
positioning consultants first; founders who write their own pages second.

## Status

Pre-product, and **selling a service before building a SaaS.** The next step is ten hand-made
cards, not a pipeline.

| File | What |
|---|---|
| `SCOUTVALIDATION.md` | Market sweep, the GummySearch finding, what still needs verifying, kill criteria |
| `SCOUTPLAN.md` | Who buys it, the two paths, architecture, pricing, the marketing engine |
| `PHASEMINUS1.md` | The runbook: where the buyer is, the outreach message, the card format |
| `tools/gather.py` | Collects public utterances with a link on every one |
| `cards/example.sources.json` | Copy this per audience |
| `index.html` | Smoke-test landing page (GitHub Pages → toscout.com) |

## The finding that shaped this

GummySearch — the closest competitor, ~135,000 users, profitable — shut down because it could
not obtain a Reddit commercial licence. At the cited $0.24/1,000 API calls, covering cost at a
normal margin meant charging north of $400/month per customer, which prices out the exact
buyer it served.

Two consequences run through every document here:

1. **Nothing automated touches Reddit.** It's a source you read yourself in a browser and
   paste in by hand. `python3 tools/gather.py --why-no-reddit` says so in the code too.
2. **Sell the research as a service first.** A human reading public pages incurs no API cost
   and needs no licence. The SaaS is gated behind evidence that anyone wants a subscription.

The primary source is `gummysearch.com/final-chapter/`. The account above was assembled from
secondary reporting because the sandbox this was researched in couldn't reach that page — read
it yourself before betting on it.

## Gathering utterances

```bash
python3 tools/gather.py --config cards/example.sources.json --out out/illustrators
python3 tools/gather.py --config cards/example.sources.json --out out/x --dry-run
python3 tools/tests/test_gather.py     # 25 tests, no network needed
```

Stdlib only, no API keys, no dependencies. Adapters for Hacker News, Stack Exchange, any
public Discourse forum, RSS, and a `manual` type for quotes you gathered by hand. Writes a
`.jsonl` for later processing and a `.md` you can read with a highlighter.

The tool gathers; it doesn't decide what matters. That part stays manual on purpose — until
you've built ten cards by hand you don't yet know what belongs in one, and automating that
judgment now would just automate a guess.

## Running the landing page

It's one static file with no build step and no dependencies. Open `index.html`, or:

```
python3 -m http.server 8000
```

Before it goes live, replace both instances of `FORM_ENDPOINT_HERE` with a Formspree or Tally
endpoint, and add a `CNAME` file once toscout.com is pointed at GitHub Pages.

## The rule that makes this work

Every line in a Narrative Card carries a verbatim quote and a permalink. Scout is never
allowed to write "your audience values authenticity." It quotes the person who said something
better, and links to them. Without that rule this is a horoscope generator, and horoscope
generators churn.

## History

This repo previously held **ToScout**, a vendor-pricing-and-terms monitor — a tool to warn
founders when a platform they depended on changed the terms underneath them. That idea is
parked, not deleted; its validation sweep and plan are in git history at `6d6cb01`. Two things
carried over: the scheduled-fetch-and-summarize architecture, and the toscout.com domain,
which still fits when the thing being scouted is your audience instead of your vendors.

Worth noting what happened next: the market this repo moved into had just been cleared by
exactly the risk ToScout existed to warn people about.
