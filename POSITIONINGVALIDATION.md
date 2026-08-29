# The Positioning Room — Validation Sweep

Idea under test: software that runs a positioning session and produces the artifact. Two
pieces — **Pick One**, a free tool whose only job is to make you narrow and commit to one
audience, and **The Positioning Room**, a paid guided session that turns that commitment into
a finished positioning and messaging document a consultant can hand to a client.

Origin: Seth Godin's five steps of marketing. Steps 2 and 3 — build for a few people who
particularly benefit, and tell a story matching their built-in narrative — both require an act
most founders never actually perform: **deciding who they are not for.**

## The hard constraint this idea was chosen under

This repo has now been through three products in one session. All three died the same way:

| Idea | Depended on | Outcome |
|---|---|---|
| ToScout | Vendors' pricing and terms pages | Parked |
| Scout (Reddit) | Reddit's API | Killed the incumbent — see git history |
| Scout (reviews) | G2, Amazon, Trustpilot | Hostile terms, narrow legitimate paths |

The pattern isn't bad luck. It's the category: *a business built on data someone else owns and
monetizes.* So the filter for this idea is absolute — **every input comes from the person
using the tool.** No scraping, no third-party corpus, no API whose terms can change. If a
future feature needs someone else's data, that's the signal to stop.

## Verdict: qualified GO — the challenge is a free Miro template

The methodology is famous, taught, and billed at five figures. The tooling is a canvas. That
gap is the opportunity and the risk in the same sentence.

### Lane 1: human positioning consultants (NOT competitors — they're the buyer)

April Dunford is the reference point: *Obviously Awesome*, facilitated workshops, B2B advisory,
priced accordingly. Fletch PMM, Genesys Growth and others work the same territory. PitchKitchen
publishes comparison content against her approach.

These are not who we compete with. **They are who we sell to** — plus the much longer tail of
freelance consultants running the same kind of session with far less brand behind them.

### Lane 2: canvases and templates (THE ACTUAL INCUMBENT)

Miro ships a pre-built positioning template built on Dunford's five components. Notion and
Figma equivalents exist. They are free, familiar, and collaborative.

**This is what has to be beaten, and it deserves a straight answer.** A canvas is a grid of
empty boxes. It never asks a follow-up question, never pushes back on a vague answer, never
tells you the box you just filled in is meaningless, and never hands you a finished document.
It records a session; it doesn't run one. If the software doesn't do those four things, it is
a worse Miro board and should not exist.

### Lane 3: message testing (ADJACENT, downstream)

Wynter and similar run your message past a panel of your target audience and report back.
That's the step *after* this one — you can't test a message until you have one — and it
depends on panel supply, which is someone else's asset.

### Lane 4: niche discovery (DIFFERENT JOB, and it fails our filter)

GetAppNiche, Superframeworks' niche finder, NichesHunter and friends help you *find a
profitable market to enter*, using app-store, keyword and revenue data.

That is the opposite job. They help you **discover** a market you have no relationship with.
Pick One helps you **give up** markets you already have some claim to. And note they all run on
third-party data — the exact dependency this idea exists to avoid.

### Lane 5: the gap

Software that runs the session, refuses vague answers, forces the exclusion, and produces a
deliverable. Nobody found doing it.

## Demand-side evidence

**Reasonably solid:**
- Positioning workshops are an established, five-figure consulting service with a named
  gold-standard practitioner. The work is real and people pay for it.
- The best tooling for that work is a static template, which is a strong signal that the
  software hasn't been built rather than that it was tried and rejected.
- "Pick a niche" is the most repeated advice in founder communities and the least followed.
  The gap between advice and action is usually where a tool belongs.

**Assumption, not evidence:**
- That a consultant will pay for software to run a session they already run competently on a
  Miro board. **This is the central bet.** The answer is probably "only if the output is a
  deliverable they'd otherwise spend hours formatting."
- That founders will finish it alone. Exclusion is painful; most people quit halfway. If they
  quit halfway, there's no artifact and no product.

## Verify before spending a weekend

| Question | How to check | Status |
|---|---|---|
| Do consultants actually want this, or is Miro fine? | Show Pick One to five of them. Watch whether they finish it | **Open — the whole test** |
| What does a positioning deliverable look like today? | Ask two consultants for a redacted past one | Open |
| Is anyone shipping this already? | Product Hunt, "positioning tool", "messaging framework software" | Partially — nothing found, not exhaustive |
| Would they pay for the artifact or the process? | Ask which half they'd buy if only one were offered | Open |

Verified in this sweep: the Miro/Dunford template, the consultancies named above, and the
niche-discovery tools. Not verified: whether any of them has shipped session software since.
The same rule this repo has applied twice already applies here — check before you build.

## A care note on methodology and IP

The positioning frameworks in circulation belong to the people who developed and published
them. Building a product that walks someone through a named practitioner's framework, with
their component names, and charging for it, is not a thing to do casually.

The line to hold: build on the general practice — which is decades old and belongs to nobody —
develop the specific sequence and questions ourselves, credit influences openly, and never
present the tool as an authorized implementation of someone's method. If the product can only
be described as "April Dunford's workshop but software," it's the wrong product.

## Differentiators

1. **It refuses vague answers.** Type "small businesses" and it pushes back and won't advance.
   That single behavior is the difference between this and a canvas, and it needs no AI —
   vagueness is detectable with plain heuristics.
2. **It forces the cost of the choice to be written down.** You don't eliminate an audience by
   deleting a row; you eliminate it by typing what you're giving up. That's what makes the
   decision stick.
3. **It ends in an artifact, not a filled-in board.** A document a consultant can hand to a
   client, or a founder can put on a wall.
4. **Zero external dependencies, permanently.** Nothing to licence, nothing to scrape, no API
   that can reprice. After the last three ideas, this is a feature.
5. **It never writes your positioning for you.** Same rule that survived every previous
   version of this repo: the tool interrogates, the human decides. An LLM-generated positioning
   statement is worth exactly nothing, and the market will shortly be full of them.

## Risks

| Risk | Weight | Mitigation |
|---|---|---|
| A free Miro template is good enough | **High — this is the one** | Do the four things a canvas can't: ask follow-ups, reject vagueness, force stated costs, produce the document |
| People quit halfway through the exclusion | **High** | Make Pick One finishable in ten minutes; save progress; never ask for an email before the artifact exists |
| Positioning is episodic → weak retention | Medium | The consultant tier is the business; they run it repeatedly with clients |
| Becomes a generator under pressure | Medium | Written into the product principles. The day it writes the sentence for you, it's worthless |
| Framework/IP overreach | Medium | See the care note above |
| Nobody pays for software that produces a document | Medium | Test with a one-off price before building a subscription |

## Kill criteria

- Five consultants open Pick One and fewer than three finish it → the mechanic doesn't work.
  Fix the mechanic or kill it. This is testable in a week with a static file.
- The sentences people produce are still vague at the end → the pushback is the product, and
  it failed. Kill it.
- Consultants say "I'd just use Miro" and mean it → the artifact isn't worth enough. Kill it.
- Anyone asks to pay before you've asked them to → build the paid half immediately.
