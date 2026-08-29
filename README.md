# The Positioning Room

**Decide who you're not for.**

Everyone tells you to pick a niche. Nothing helps you actually do it, because the hard part
isn't choosing — it's giving the others up.

**[Pick One](pickone.html)** is free, built, and working. Ten minutes, no signup, nothing
leaves your browser. It walks you through the exclusion, makes you write down what each
audience costs you to abandon, and refuses to let you finish with a sentence that excludes
nobody.

**The Positioning Room** is the paid session that starts where Pick One ends. Not built on
purpose — if consultants won't finish a free ten-minute tool, they won't pay for a
ninety-minute one.

## Try it

```bash
python3 -m http.server 8000     # then open http://localhost:8000/pickone.html
```

Or just open `pickone.html` in a browser. No build step, no dependencies, no server needed.

| File | What |
|---|---|
| `POSITIONINGVALIDATION.md` | Market sweep, why a free Miro template is the real competitor, kill criteria |
| `POSITIONINGPLAN.md` | What ships, product principles, pricing, distribution |
| `pickone.html` | The working tool |
| `tools/vague.js` | Vagueness detection — no AI, just heuristics |
| `OUTREACH.md` | Who to talk to first, exactly, and the message to send |
| `index.html` | Landing page |

## Tests

```bash
node tools/tests/test_vague.mjs      # unit, no dependencies
node tools/tests/e2e_pickone.mjs     # browser flow, needs: npm install playwright
```

The e2e test covers the gates that make this a tool rather than a form: you can't advance past
a vague audience, an unstated cost, or an exclusion that excludes nobody.

## The one behavior that matters

Type `creative professionals and agencies` into step 4 and it will tell you there are two
audiences in the sentence, that "professionals" describes millions of people, and that nothing
in it describes a moment. Then it won't let you continue.

That's the product. A canvas records a session; this runs one. No AI is involved — vagueness is
structural, and you can just look for it.

## History

This repo has been through four products in one session. The first three are in git history,
and they all died the same way:

| Idea | Depended on | Outcome |
|---|---|---|
| ToScout | Vendors' pricing and terms pages | Parked |
| Scout (Reddit) | Reddit's API | The market leader was killed by it mid-research — see `SCOUTVALIDATION.md` at `6ef9a77` |
| Scout (reviews) | G2, Amazon, Trustpilot | Hostile terms, narrow legitimate paths |

Not bad luck three times — the category. Each was a business built on data someone else owns
and monetizes.

So this one has a hard constraint: **every input comes from the person using the tool.** No
scraping, no corpus, no API that can reprice. That's why Pick One is a single static file that
works offline. It isn't a limitation to route around later; it's the whole point.

The `toscout` repo name and domain are inherited from the first idea. Renaming is cosmetic and
can wait until something here is validated.
