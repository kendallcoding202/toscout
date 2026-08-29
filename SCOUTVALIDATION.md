# Scout — Validation Sweep

Idea under test: a subscription that listens to where a founder's *smallest viable audience*
actually talks — subreddits, forums, Q&A sites, review sites, comment sections — and keeps a
living **Narrative Card** of what those people say, fear, want, and are against, in their own
words with links to every quote. A free companion tool, **Red Pen**, grades the founder's
writing against that card and refuses to write anything for them.

Origin: Seth Godin's five steps of marketing (*This Is Marketing*). Step 3 — "tell a story
that matches the built-in narrative and dreams of that tiny group of people" — is the step
with no tooling behind it. You cannot do it from a chair, and nobody sells the listening.

## Verdict: qualified GO — on one condition

The condition is **receipts**. Every claim in the card must carry a verbatim quote and a
link. A synthesis tool without receipts is a horoscope, and horoscopes churn. Build the
evidence requirement into the schema on day one, or don't build this.

The market splits into four lanes. Three are taken. The fourth is open, and it's narrow.

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

### Lane 3: audience research (CONTESTED — the real fight)

- **GummySearch** — Reddit audience research: browse subreddits, cluster pain-point posts,
  save audiences. Closest competitor by a wide margin. Reddit-only, and shaped as a *search
  tool* — you go to it with a question.
- **SparkToro** — where your audience pays attention: which podcasts, accounts, sites. Answers
  *where*, as a one-time report. Doesn't answer *what they yearn for*, and doesn't maintain.

This lane is where the argument has to be won. See differentiators below.

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
- GummySearch charging real money for hand-rolled Reddit audience research is direct evidence
  that founders will pay to understand a group they aren't part of.
- "How do I do customer research without interviews / before I have users" is an evergreen
  question in indie communities. The honest answer today is "go read Reddit for six hours."

**Assumption, not evidence:**
- That founders will pay *recurring* for listening rather than doing one research sprint.
  This is the central bet and Phase 0 exists to test it.
- That the weekly digest gets opened in month four. Insurance-fatigue's cousin.

## Verify before spending a weekend

| Question | How to check |
|---|---|
| Is GummySearch still Reddit-only, and what does it cost now? | Pricing page + free trial; run one real audience through it |
| Reddit API commercial terms and per-call cost today | Reddit developer terms; price a 12-subreddit daily poll |
| Does SparkToro now maintain audiences over time? | Their changelog |
| Anyone shipped a "Godin's five steps" tool since? | Search "smallest viable audience tool", Product Hunt, Indie Hackers |
| Will forums tolerate quoted excerpts with attribution links? | Each source's ToS; Discourse and Stack Exchange are permissive, Reddit is the constraint |

Note for whoever reads this next: the competitor names in this repo's **previous** validation
doc (ShiftGraph, SpecFlag, FlareCanary, PageCrawl, Verid) were never re-verified and at least
some may not exist. Do not inherit them as fact. Same rule applies here — verify the five rows
above before writing product code.

## Differentiators that make Lane 4 defensible

1. **Receipts, always.** Every line of the card is a quote plus a permalink. Competitors
   summarize; Scout cites. This is checkable by the customer, which makes trust cheap to earn
   and expensive to fake.
2. **Cross-source by construction.** Reddit is one adapter among Discourse forums, Hacker
   News, Stack Exchange, YouTube comments, review sites, RSS. A Reddit-only tool is one
   pricing announcement away from dead — the previous product in this repo existed to warn
   people about exactly that risk, which makes shipping a Reddit-only product here absurd.
3. **Coupled to the writing.** The card isn't a report you file; it's the thing Red Pen judges
   your landing page against. "You wrote *streamline your workflow*. Nobody in your audience
   has ever said that. Fourteen of them said *I lose a whole day to invoicing*."
4. **Red Pen refuses to write.** In a market full of generators, a tool that won't generate is
   a position competitors can't copy without abandoning their own product. It's also the only
   honest reading of the source material — the book is a rejection of shortcuts.
5. **Shared listening economics.** One subreddit is fetched once and fanned out to every
   subscriber watching it. Marginal cost per customer approaches zero; the corpus of
   normalized utterances compounds. Carried directly from the ToScout plan, where it was the
   strongest idea in the document.

## Risks, honestly weighted

| Risk | Weight | Mitigation |
|---|---|---|
| Source platform pricing/ToS changes (Reddit especially) | **High** | Source-agnostic adapters from day one; no single source above ~40% of any card; budget Reddit per-source, not per-customer |
| GummySearch or SparkToro ships a maintained card | **High** | Speed, cross-source breadth, and the Red Pen coupling they have no reason to build |
| Output reads generic → churn in month three | **High** | The receipts rule; a quiet week says "nothing shifted" in one line rather than inventing insight |
| Quoting real people from public forums | Medium | Short excerpts, always linked, no author names in digests, drop quotes whose source post disappears on refetch |
| Research is a sprint, not a subscription | Medium | Red Pen gives a weekly reason to open the tool between digests; the card is an asset you'd lose on cancel |
| Wrong buyer (people who want the answer, not the practice) | Medium | Phase 0 copy sells the finished card, not the discipline; watch which CTA converts |
| LLM cost per audience | Low | Relevance gate before the model; extraction only on candidates that pass |

## Kill criteria

Written down now, while it's cheap to be honest:

- Phase 0 lands under 5% email capture on ~300 targeted visitors → the promise is wrong, not
  the execution. Pivot the promise, don't build harder.
- Five hand-run cards (see Phase 0) and fewer than three founders say "I'd have written it
  differently if I'd had this" → the artifact isn't valuable, kill it.
- The hand-run cards can't be produced without ~4 hours of human judgment each → the pipeline
  won't work either. Consultancy, not product. Kill or reprice.

## Scope discipline

Ship one audience per subscription. The thesis is that you serve a tiny group; shipping
"track 40 audiences" would contradict the pitch on the pricing page. Resist.
