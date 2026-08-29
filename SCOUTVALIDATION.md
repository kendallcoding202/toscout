# Scout — Validation Sweep

Idea under test: a subscription that listens to where a founder's *smallest viable audience*
actually talks — subreddits, forums, Q&A sites, review sites, comment sections — and keeps a
living **Narrative Card** of what those people say, fear, want, and are against, in their own
words with links to every quote. A free companion tool, **Red Pen**, grades the founder's
writing against that card and refuses to write anything for them.

Origin: Seth Godin's five steps of marketing (*This Is Marketing*). Step 3 — "tell a story
that matches the built-in narrative and dreams of that tiny group of people" — is the step
with no tooling behind it. You cannot do it from a chair, and nobody sells the listening.

## Verdict: GO on the service, HOLD on the SaaS

Two conditions, and the second one is new.

1. **Receipts.** Every claim in the card carries a verbatim quote and a link. A synthesis tool
   without receipts is a horoscope, and horoscopes churn. Build the evidence requirement into
   the schema on day one, or don't build this.
2. **Do not build a Reddit-backed SaaS.** That question is closed, not open — see Lane 3.
   Somebody better positioned ran the experiment, profitably, at 135,000 users, and Reddit's
   licensing terms killed it anyway. Sell the research as a service, where a human reading
   public pages incurs no API cost and needs no commercial licence, and automate only the
   sources whose economics are sane.

The market splits into four lanes. Two are taken, one just emptied out under circumstances
that should frighten us, and the fourth is where the work is.

### Lane 1: enterprise social listening (CROWDED — avoid)

Brandwatch, Sprout Social, Meltwater, Talkwalker, Mention. Brand-monitoring for companies
that already have a brand to monitor. Priced for marketing departments, sold to marketing
departments, built around share-of-voice and sentiment dashboards. Wrong buyer, wrong price,
wrong question — they answer "what are people saying about *us*," not "how do the people I
want to serve talk about *themselves*."

### Lane 2: keyword alerting (COMMODITY — don't compete)

F5Bot (free), Syften, Google Alerts, a dozen Reddit-keyword-alert tools. These are pipes:
you supply a keyword, they supply matches. Thin, cheap, several free. Do not build alerts.
Alerts are the feature everyone ships and nobody pays for twice.

### Lane 3: audience research (VACANT — and there's a body on the floor)

**This section was rewritten on 2026-08-29 after the closest competitor turned out to be
dead.** It is the most important finding in this document.

- **GummySearch** — Reddit audience research; browse subreddits, cluster pain-point posts,
  save audiences. Was the closest competitor by a wide margin. **Shut down.** Announced a
  wind-down beginning 1 Dec 2025, transition year for existing customers only, full shutdown
  and data deletion 1 Dec 2026. Reported reach at the end: ~135,000 founders, marketers and
  investors. Reportedly profitable, with no burn.
- **SparkToro** — where your audience pays attention: which podcasts, accounts, sites. Answers
  *where*, as a one-time report. Doesn't answer *what they yearn for*, and doesn't maintain.
  Still operating, still a different question.
- A directory-page land grab is underway — a dozen "best GummySearch alternative" pages from
  Reddit-tool vendors, all published against the vacancy.

**Why it died, which is the whole lesson:** Reddit's API policy forbids commercial use without
a commercial licence, and GummySearch could not secure one. At the widely-cited $0.24 per
1,000 calls from Reddit's June 2023 pricing change, covering API cost at a normal margin
reportedly meant charging north of **$400/month per customer** — which prices out the exact
indie/founder buyer the product was built for.

**Source caveat, and read this before acting on it.** The primary announcement is at
`gummysearch.com/final-chapter/`, which this sandbox's network policy blocked, so the above
was assembled from secondary reporting and competitor "alternatives" pages — sources with an
obvious incentive to declare a rival dead. The account is consistent across many of them and
consistent with Reddit's well-documented 2023 pricing change, but **read the primary URL
yourself before betting a weekend on it.** It takes thirty seconds. Same rule as the note
about the previous validation doc, applied to this one.

### Lane 4: the maintained narrative (OPEN)

Nobody found selling: a **cross-source, quote-backed portrait of one tiny audience that stays
current**, delivered on a cadence, and wired into the sentence you're about to write. The
distinction from Lane 3 is cadence and coupling — a card you consult while writing, updated
weekly, rather than a research session you do once and forget.

## Demand-side evidence

Marked honestly. This sweep was written from working knowledge, not a fresh crawl — the
"verify first" list below is not optional.

**Reasonably solid:**
- *This Is Marketing* is a bestseller and "smallest viable audience" is now common founder
  vocabulary. The framework has readership; the readership has no tools.
- **~135,000 people used GummySearch, and it was profitable.** By a wide margin the strongest
  demand evidence in this document. The market for "help me understand a group I'm not part
  of" is not hypothetical, not small, and not something we have to create. It was proven at
  scale by somebody else and then vacated for reasons that had nothing to do with demand.
- **That audience is being orphaned right now.** Full shutdown and data deletion is 1 Dec 2026
  — roughly three months from this writing — and those users need somewhere to go.
- "How do I do customer research without interviews / before I have users" is an evergreen
  question in indie communities. The honest answer today is "go read Reddit for six hours."

**Assumption, not evidence:**
- That founders will pay *recurring* for listening rather than doing one research sprint.
  This is the central bet and Phase 0 exists to test it.
- That the weekly digest gets opened in month four. Insurance-fatigue's cousin.

## Verify before spending a weekend

| Question | How to check | Status |
|---|---|---|
| Did GummySearch really shut down, and why? | Read `gummysearch.com/final-chapter/` yourself | **Answered from secondary sources — confirm the primary** |
| Where did its ~135k users go? | The "alternatives" pages; ask in founder communities | Open — this is the distribution question |
| Is a Reddit commercial licence obtainable at any price by a small operator? | Reddit developer terms; ask their team | Open, and probably "no" |
| Do the non-Reddit sources carry enough signal alone? | Build one card using zero Reddit; judge honestly whether it's thin | **Open — now the make-or-break test** |
| Does SparkToro now maintain audiences over time? | Their changelog | Open |
| Will forums tolerate quoted excerpts with attribution links? | Each source's ToS; Discourse and Stack Exchange are permissive | Open |

Note for whoever reads this next: the competitor names in this repo's **previous** validation
doc (ShiftGraph, SpecFlag, FlareCanary, PageCrawl, Verid) were never re-verified and at least
some may not exist. Do not inherit them as fact. The same rule applies to this document, including its
headline finding — verify the rows above before writing product code.

## Differentiators that make Lane 4 defensible

1. **Receipts, always.** Every line of the card is a quote plus a permalink. Competitors
   summarize; Scout cites. This is checkable by the customer, which makes trust cheap to earn
   and expensive to fake.
2. **Reddit-free by construction.** Everything automated runs on Hacker News, Stack Exchange,
   Discourse forums, review sites, YouTube and RSS. This started as a hedge and is now the
   product's reason to exist: the incumbent died precisely because it couldn't licence Reddit,
   so "the audience research tool that doesn't need Reddit" is both the differentiator and the
   survival condition. Note the irony — this repo's previous occupant existed to warn founders
   about platform dependency risk, and the market it moved into was just cleared by one.
3. **Coupled to the writing.** The card isn't a report you file; it's the thing Red Pen judges
   your landing page against. "You wrote *streamline your workflow*. Nobody in your audience
   has ever said that. Fourteen of them said *I lose a whole day to invoicing*."
4. **Red Pen refuses to write.** In a market full of generators, a tool that won't generate is
   a position competitors can't copy without abandoning their own product. It's also the only
   honest reading of the source material — the book is a rejection of shortcuts.
5. **Shared listening economics.** One source is fetched once and fanned out to everyone
   watching it. Marginal cost per customer approaches zero and the corpus of normalized
   utterances compounds. Carried from the ToScout plan, where it was the strongest idea in the
   document. Note this only holds for sources that permit it — which is the whole argument for
   staying off Reddit.
6. **A vacancy with a live mailing list.** ~135,000 orphaned users with a hard deadline of
   1 Dec 2026 is a distribution event, not just a market gap. Whoever is most visible on
   "what do I use instead" between now and then inherits a meaningful share of it.

## Risks, honestly weighted

| Risk | Weight | Mitigation |
|---|---|---|
| Reddit licensing kills automated access | **Demonstrated — it already killed the market leader** | Ship zero automated Reddit gathering. Reddit is a read-it-yourself source, never a pipeline input. Everything automated runs on HN, Stack Exchange, Discourse forums, review sites, YouTube and RSS |
| The non-Reddit sources turn out to be too thin | **High, and untested** | Build card #1 with no Reddit at all and look at it honestly. If it's thin, that is the answer |
| A funded competitor takes the vacated 135k | Medium | They need the same licence GummySearch could not get, unless they also go Reddit-light |
| Output reads generic → churn in month three | **High** | The receipts rule; a quiet week says "nothing shifted" in one line rather than inventing insight |
| Quoting real people from public forums | Medium | Short excerpts, always linked, no author names in digests, drop quotes whose source post disappears on refetch |
| Research is a sprint, not a subscription | Medium — **and largely defused** | Sell it as a per-project deliverable, where bursty demand is the normal shape rather than a defect |
| Wrong buyer (people who want the answer, not the practice) | Medium | Phase 0 copy sells the finished card, not the discipline; watch which CTA converts |
| LLM cost per audience | Low | Relevance gate before the model; extraction only on candidates that pass |

## Kill criteria

Written down now, while it's cheap to be honest:

- **Card #1, built with zero Reddit, is thin.** If the non-Reddit sources don't carry the
  signal, there is no automatable version of this and the rest is moot. Test this first; it
  costs one afternoon.
- Five hand-run cards and fewer than three people say "I'd have written it differently if I'd
  had this" → the artifact isn't valuable. Kill it.
- Nobody pays for a card as a one-off deliverable → if it won't sell as a service at $300–500,
  it will not sell as a $49 subscription. Kill it; don't build the pipeline to double-check.
- Phase 0 lands under 5% email capture on ~300 targeted visitors → the promise is wrong, not
  the execution. Pivot the promise, don't build harder.
- The hand-run cards can't be produced without ~4 hours of judgment each even with practice →
  the pipeline won't work either. Consultancy, not product. Reprice or kill.

## Scope discipline

Ship one audience at a time. The thesis is that you serve a tiny group; offering to "track 40
audiences" would contradict the pitch on the pricing page. Resist.

## What the Lane 3 finding changed

For anyone reading this cold, the delta from the first draft of this document:

| | Before | After |
|---|---|---|
| Closest competitor | GummySearch, alive, contested lane | Gone; lane vacant, ~135k users orphaned by 1 Dec 2026 |
| Reddit dependency | A risk to mitigate | A demonstrated cause of death. Zero automated Reddit |
| Primary business model | $49/mo SaaS | $300–500 per-project service; SaaS only if volume forces it |
| Biggest open question | "Will people pay recurring?" | "Do the non-Reddit sources carry the signal?" |
| Strongest demand evidence | An assumption | 135,000 users and a profitable P&L, proven by someone else |
