# Scout

**Your people already told you what to say.**

Scout listens to where your smallest viable audience actually talks — forums, threads, Q&A
sites, comment sections — and keeps one living document of their exact words, with a real
quote and a link behind every line. **Red Pen**, the free half, holds your draft up against
that document and refuses to rewrite a word for you.

It's voice-of-customer research, automated and kept current. Built for freelance copywriters
and positioning consultants first; founders who write their own pages second.

## Status

Pre-product. This repo holds the thinking and the smoke test — no product code yet, on
purpose. The next step is ten hand-made cards, not a pipeline.

| File | What |
|---|---|
| `SCOUTVALIDATION.md` | Market sweep, competitors, what still needs verifying, kill criteria |
| `SCOUTPLAN.md` | Who buys it, what ships, architecture, pricing, the marketing engine |
| `index.html` | Smoke-test landing page (GitHub Pages → toscout.com) |

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

This repo previously held **ToScout**, a vendor-pricing-and-terms monitor. That idea is
parked, not deleted — its validation sweep and plan are in git history at `6d6cb01`. Two
things carried over: the scheduled-fetch-and-summarize architecture, and the toscout.com
domain, which still fits when the thing being scouted is your audience instead of your
vendors.
