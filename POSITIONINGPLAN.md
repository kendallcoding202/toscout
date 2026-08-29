# The Positioning Room — Product Plan

**One-liner:** Software that runs a positioning session instead of recording one. **Pick One**
is free and makes you narrow to a single audience and write down what you're giving up. **The
Positioning Room** is paid and turns that decision into a finished document a consultant can
hand to a client.

**Tagline:** Decide who you're not for.

**Positioning:** A facilitator, not a canvas. NOT a niche-discovery tool (those find you a
market using someone else's data), NOT message testing (that's downstream), NOT a generator
(the day it writes your positioning for you it's worth nothing).

> Read `POSITIONINGVALIDATION.md` first. The short version: positioning workshops are a
> five-figure consulting service and the best tooling for them is a free Miro template. That
> gap is the whole opportunity, and beating a free canvas is the whole risk.

## The constraint this was chosen under

Three previous products in this repo died the same way — each depended on data owned by
someone who monetizes it. **Every input to this one comes from the person using it.** No
scraping, no corpus, no API that can reprice. If a feature needs somebody else's data, that's
the signal to stop, not to negotiate.

That constraint is also why `pickone.html` is a single static file that works offline and
sends nothing anywhere. It's not a limitation to route around later; it's the point.

## The five steps, and what this actually serves

| Step | Godin | This product |
|---|---|---|
| 1 | Invent a thing worth making | Indirectly — you can't tell if it's worth making until you know who for |
| 2 | **Build so a few people particularly benefit** | **Yes** — the exclusion is the whole mechanic |
| 3 | **A story matching their built-in narrative** | **Yes** — the worldview and before/after questions |
| 4 | Spread the word | No. Out of scope, and saying otherwise would be a lie |
| 5 | Show up for years | No — but the 90-day revisit stamp is a small nod at it |

Two of five, honestly. A tool that claimed all five would be a tool that did none of them.

## What ships

### Pick One — free, built, working

Five steps, ten minutes, no signup, nothing leaves the browser.

1. **The dump** — every audience you've told yourself you serve. Minimum three; you can't
   subtract from a short list.
2. **The reality check** — per candidate: have you spoken to five in 90 days, can you name one
   from memory right now, would they pay today or later. Scores 0–6 on evidence, not appeal.
3. **The cut** — keep one. For every other, type what you're giving up. You cannot advance
   until every cost is written down, because a decision with no stated cost doesn't survive
   three weeks.
4. **The gauntlet** — rewrite the survivor until the page stops arguing. Vague nouns, hedge
   words, two-audiences-in-one-sentence and missing situations are each flagged by name.
5. **The consequences** — who this is deliberately not for, what they believe that others
   don't, and the person before and after.

Out: a Position Card, copyable as Markdown, printable, dated, with a 90-day revisit stamp.

**The behavior that makes it a tool rather than a form:** it refuses vague answers, and it
refuses them *specifically*. Type "creative professionals and agencies" and it says there are
two audiences in the sentence, that "professionals" describes millions of people, and that
nothing in it describes a moment. No AI involved — vagueness is structural and detectable with
plain heuristics (`tools/vague.js`, unit-tested).

### The Positioning Room — paid, not built

The guided session that starts where Pick One ends. Competitive alternatives, what only you
do, why that matters to this audience, the category you're competing in, and the sales
narrative — each with the same refusal-to-accept-mush behavior, and an exportable, brandable
document at the end.

**Not built on purpose.** Pick One is the test: if consultants won't finish a free ten-minute
tool, they won't pay for a ninety-minute one.

## Product principles

1. **It never writes your positioning for you.** No "suggest a sentence," no autocomplete. The
   moment it generates the answer, the artifact is worthless — and the market will shortly be
   full of generated positioning statements that all say the same thing.
2. **Every rejection is specific.** Never a score alone, never "try being more specific."
   Quote the offending word back and say what's missing.
3. **No cost, no progress.** You eliminate an audience by writing what it costs you, not by
   deleting a row.
4. **Ten minutes, no signup.** Never ask for an email before the artifact exists. The card is
   the reason to give one, and it has to exist first.
5. **Nothing leaves the browser.** Local storage only. This is both a privacy promise and the
   architectural constraint that keeps the dependency count at zero.

## Pricing

| | Price | What |
|---|---|---|
| Pick One | Free | The whole exclusion flow, forever, no account |
| The Positioning Room | $99 one-off | Full session, exportable document |
| Practice | $299/yr | Unlimited sessions, branded client-ready export, saved past sessions |

Lead with the one-off. Consultants bill $5–15k for this work; the annual tier is priced against
the hours it saves formatting a deliverable, not against other software.

## Architecture

Deliberately almost nothing.

- **Pick One:** one static HTML file plus `tools/vague.js`. No build, no framework, no server,
  no dependencies. Deploys to GitHub Pages by existing.
- **The Positioning Room:** when built — Next.js on Vercel, Postgres for saved sessions, Stripe
  for billing. Nothing else. If a third-party data source ever appears in this list, re-read
  the constraint section.
- **Tests:** `tools/tests/test_vague.mjs` (unit, no deps) and `tools/tests/e2e_pickone.mjs`
  (browser, needs playwright).

## Distribution

1. **Pick One is the distribution.** A free tool that argues with you is shareable in a way a
   landing page never is. The thing people post is the screenshot of it rejecting their
   sentence — and every verdict has a **Copy this** button so that's one click, still entirely
   local. Full runbook in `OUTREACH.md`.
2. **Go to the consultants.** They run these sessions on Miro boards today. Show five of them
   the tool and watch whether they finish it — that's simultaneously the sales call and the
   test.
3. **Publish the rejections.** "Fifty positioning statements and why each one excludes nobody"
   writes itself from real usage, is useful on its own, and demonstrates the product.

## Risks

Full table in `POSITIONINGVALIDATION.md`. The three that matter:

| Risk | Mitigation |
|---|---|
| A free Miro template is good enough | Do the four things a canvas can't: ask follow-ups, reject vagueness, force stated costs, output a document |
| People quit halfway through the exclusion | Ten minutes, progress saved, no signup wall. Watch the completion rate — it's the single number that matters |
| Positioning is episodic → weak retention | The consultant tier is the business; they run it repeatedly with clients |

## Repo layout

```
toscout/
├── README.md
├── POSITIONINGPLAN.md            ← this file
├── POSITIONINGVALIDATION.md      ← the sweep, competitors, kill criteria
├── index.html                    ← landing page
├── pickone.html                  ← the working free tool
└── tools/
    ├── vague.js                  ← vagueness detection, no AI
    └── tests/
        ├── test_vague.mjs        ← unit tests, no dependencies
        └── e2e_pickone.mjs       ← browser test, needs playwright
```

## Immediate next actions

1. Open `pickone.html` and run it on your own product. If it doesn't argue with you, it isn't
   strict enough yet.
2. Send it to five consultants who run positioning sessions. Ask nothing except whether they
   finished it.
3. Count completions. Under three of five → fix the mechanic before building anything paid.
4. Point toscout.com at GitHub Pages, add `CNAME`, drop a form endpoint into `index.html`.
5. Only after step 3 passes: build The Positioning Room.
