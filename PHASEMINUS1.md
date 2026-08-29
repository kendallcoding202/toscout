# Phase −1 — Ten cards by hand

Everything needed to run the cheap test, without writing product code. Work top to bottom.
The whole thing is designed to cost you ten afternoons and no money.

**The one question this phase answers:** will somebody pay for the *output*? Not "is the idea
good," not "would you use this" — will money change hands for a research document.

---

## Before anything: the twenty-minute pre-check

Do these three before card #1. Two of them can kill the project, which is the point.

1. **Read `gummysearch.com/final-chapter/`.** The whole strategy in `SCOUTPLAN.md` rests on
   secondary reporting of why it shut down. Confirm it yourself.
2. **Build one card's raw material with zero Reddit.** `python3 tools/gather.py --config
   cards/example.sources.json --out out/test`. If the non-Reddit sources come back thin, that
   is the answer and you've saved ten weekends.
3. **Search "voice of customer research" + "freelance"** on LinkedIn. If nobody is talking
   about doing this work, the buyer isn't where this plan says they are.

---

## 1. Where the buyer is

You don't need to know anyone. You need ten strangers who post publicly about their work.

| Where | What to search | Why they're there |
|---|---|---|
| LinkedIn | "voice of customer" · "VoC research" · "conversion copywriter" | The highest concentration, and they post client work publicly |
| r/copywriting, r/freelanceWriters | "research", "discovery call", "how do you find their words" | They discuss method openly |
| Indie Hackers | "positioning", "customer research" | Founders who write their own pages |
| Contra / Upwork public profiles | filter: conversion copywriter, messaging strategist | Public, filterable, and states their specialty |
| Superpath, Peak Freelance | any thread about research or discovery | Freelance content and copy communities |
| **GummySearch alternative threads** | "GummySearch alternative", "GummySearch shutting down" | **~135k orphaned users actively shopping right now** |

That last row is the most time-sensitive thing in this document. Full shutdown is 1 Dec 2026.
People are looking for a replacement *this quarter* and saying so in public.

**How to pick the ten:** somebody who posted in the last 30 days about a specific client
project, where you can tell who that client's customers are. That specificity is what lets you
build a card without talking to them first.

## 2. The move: give the finished thing

Do not ask for their time. You have no relationship and their time is the scarcest thing they
have. Send the finished card instead. It arrives complete, costs them nothing, and is usable
on billable work today.

**The message.** Keep it this short. Attach the card as a PDF or a link.

> Subject: made you something — 40 quotes from [their client's audience]
>
> Hi [name] — saw your post about the [client type] project.
>
> I spent an afternoon reading [source] and [source] and pulled 40 quotes of how those
> people actually describe the problem, in their own words, each one linked to the original
> post. It's attached. No strings, yours to use.
>
> I'm trying to work out whether this is worth building into a tool, so one question if you
> have ten seconds: would you pay for this, and roughly what?
>
> Either way the card's yours.
> [you]

**Why it works:** you're doing them a favour, not asking for one. The ask is one sentence and
it's optional. And it is, precisely, step 5 from the book — showing up generously, first,
before you've earned anything.

**What not to do:** don't offer a call, don't attach a deck, don't describe the product,
don't mention pricing tiers. One card, one question.

## 3. What a card contains

Five sections, nothing else. Every line carries a verbatim quote and a working link.

```markdown
# How [audience] actually talk about [topic]
Built from [n] sources · [n] quotes · [date]

## Their words
Phrases they use, verbatim. This is the section people actually use. Make it the longest.
> "I feel like a fraud charging $80 an hour when I don't have an agency behind me."
> — [source link] · 2026-08-12

## Tensions
What they keep getting stuck on. One quote minimum each.

## Dreams
Who they're trying to become. Status, not features.

## Enemies
What they're against. Often the sharpest section, and the one nobody else writes.

## Unmet asks
"Does anyone know a tool that…" — the step-1 feed. What they asked for and nobody built.

---
Quotes are from public discussions and link to their source. No author names.
```

**The rules that make it worth money**

- If a line has no quote behind it, delete the line. No exceptions, no "generally they feel."
- Their vocabulary, not yours. Never translate "I lose a day to invoicing" into "workflow
  inefficiency."
- Twenty sharp quotes beat two hundred mediocre ones. You are selecting, not collecting.
- No author names. Link to the post; that's attribution enough and it's kinder.
- Note what you *didn't* find. "Nobody mentioned X" is real information and builds trust.

## 4. How to build one in an afternoon

1. **Pick the audience** — your target's client's customers, in one sentence.
2. **Find the watering holes** — 20 minutes. Where do these people talk in public? Niche
   forums and review sites beat the big platforms. Read Reddit yourself in a browser.
3. **Gather** — copy `cards/example.sources.json`, change the queries (queries matter more
   than sources), then `python3 tools/gather.py --config yours.json --out out/name`.
4. **Read the `.md` with a highlighter** — 60–90 minutes. Mark every line that makes you wince
   or nod. That reaction is the product; don't outsource it.
5. **Write the card** — 45 minutes. Sort your highlights into the five sections. Cut anything
   without a link.
6. **Send it.**

Track your own time honestly. If card #6 still takes four hours, the pipeline won't work
either — that's a documented kill criterion, not a reason to try harder.

## 5. Pricing, when they ask

They will ask before you're ready. Have an answer.

| | Price | When |
|---|---|---|
| One card | **$300–500** | The default. A day of your time against their $5k project |
| Card + a Red Pen pass on their draft | **$750** | When they want the rewrite judged too |
| Monthly refresh | **$150/mo** | Only if *they* ask for it — never lead with this |

Lead with the one-off. Bursty demand is a defect for a subscription and completely fine for a
deliverable. If several people ask unprompted for the refresh, *that* is the signal there's a
product underneath — and it's the only honest way to find out.

## 6. Scoring it

After ten cards:

| Signal | Read |
|---|---|
| ≥3 ask for another one | Real. Keep going |
| Anybody pays without being asked | Strongest possible signal. Sell the service now |
| ≥3 ask about a monthly refresh | There's a product under the service. Build the pipeline |
| Polite thanks, no follow-up | The artifact isn't valuable. Kill it |
| Cards still take 4+ hours each | No automatable version exists. Reprice as consulting or kill |

## 7. Publish everything

Publish each card publicly once the recipient has had it — that's the entire marketing plan in
`SCOUTPLAN.md`, running before you have a product. It's stealable by exactly the person who'd
buy it, no competitor can produce it without the same pipeline, and it puts you in front of
135,000 people currently searching for what they used to have.

One card a week. Free. For years. That's step 5.
