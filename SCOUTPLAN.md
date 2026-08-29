# Scout — Product Plan

**One-liner:** Scout listens to where your smallest viable audience actually talks and keeps
one living document of their exact words — every line backed by a real quote and a link. Red
Pen, the free half, judges your writing against it and refuses to rewrite a word.

**Tagline:** Your people already told you what to say.

**Wordmark:** **Scout** — set in ink. The sibling tool, **Red Pen**, is set in red.

**Origin:** Seth Godin's five steps of marketing (*This Is Marketing*). Step 3 — tell a story
that matches the built-in narrative and dreams of that tiny group — is the step with no tool
behind it. Everyone sells step 4 (spread the word) and step 1 (make the thing). Nobody sells
the listening that step 3 requires.

**Positioning:** Voice-of-customer research, delivered as a document. NOT social listening
(enterprise, brand-monitoring, wrong buyer), NOT keyword alerts (commodity, free options
exist), NOT a content generator (the opposite of the thesis), and **NOT Reddit-dependent** —
see below, that last one is now the load-bearing decision.

> **Read `SCOUTVALIDATION.md` § Lane 3 before this document.** GummySearch — the closest
> competitor, ~135,000 users, profitable — shut down because it could not obtain a Reddit
> commercial licence. That finding rewrote this plan: the business is a **service first**,
> and nothing automated touches Reddit.

---

## Who this is for

**Primary buyer: freelance copywriters and positioning consultants.**

Voice-of-customer research is an existing, named, taught, billable craft — mine reviews and
forums for the customer's own language, build the page out of their phrases instead of yours.
Practitioners do it **entirely by hand**. It has no tool.

| | Copywriter / consultant | Solo founder |
|---|---|---|
| Frequency of need | New client monthly = new audience to learn cold | Once, then done |
| Deadline pressure | Yes, client is waiting | No |
| Can they expense $49? | Trivially, against a $5k project | A real decision |
| Already doing this work? | **Yes, manually, for hours** | Mostly skips it |
| Knows they need it? | Yes — it has a name | No, must be taught |

For this buyer the Narrative Card is not a dashboard, it's a **client deliverable** — a
research document they hand over and bill for. That reframing is what carries the price.

**Secondary: solo founders pre-launch.** The volume tier. They arrive later, through Red Pen,
and they churn more. Do not design for them first.

**Not for:** anyone without a deadline, anyone who says "I already know my audience," and
hobbyists. They will use the free tier forever and that's fine.

## The five steps, and which ones this actually serves

| Step | Godin | Scout's role |
|---|---|---|
| 1 | Invent a thing worth making | Partial — the *unmet asks* feed surfaces what people asked for and nobody built |
| 2 | Build so a few people particularly benefit | Partial — the card forces "who exactly," in their words |
| 3 | **A story matching their built-in narrative** | **This is the product.** The whole thing exists here |
| 4 | Spread the word | Partial — the card names where they already gather, which is the distribution list |
| 5 | Show up regularly, for years | Weakly, and honestly so — the weekly cadence is a heartbeat, not a practice |

Don't oversell 5. The product's *marketing* demonstrates step 5 (see the engine below); the
product itself doesn't do it for you.

---

## The two paths, and which one is live

| | Service (live now) | SaaS (conditional) |
|---|---|---|
| What sells | One research card, $300–500 | $49/mo maintained card |
| Reddit exposure | None — a human reads public pages | Fatal, unless Reddit-free |
| Demand shape | Bursty, which is normal for a deliverable | Needs recurring, which is unproven |
| Cost to test | Ten afternoons | Ten weekends |
| Status | **Start here** | Only if ≥3 of the first ten ask for a refresh |

The SaaS is not cancelled, it's gated. Phase −1 is the gate.

## Sequence: hand-run → smoke test → MVP → launch

### Phase −1 — Ten by hand (before any product code)

**Full runbook in `PHASEMINUS1.md`** — where the buyer is, the outreach message, the card
format, pricing, and how to score the results. Summary:

Produce ten Narrative Cards manually. You, reading forums for an afternoon each. Send them
free and unsolicited to people who post publicly about client work, then ask one question:
would you pay for this, and roughly what?

- Learns what belongs in the card, which no amount of planning will tell you
- Costs ten afternoons instead of ten weekends
- Produces the first ten pieces of public content (see the engine)
- **Go/no-go:** nobody pays $300–500 for a card → it will not sell at $49/mo either. Kill it.
  Three or more ask about a monthly refresh → there's a product under the service, build it.

### Phase 0 — Smoke test (week 1–2)

- Landing page on GitHub Pages at toscout.com (`index.html`, in this repo)
- Email capture wired to Formspree/Tally free tier
- Distribution: the hand-run cards, published, posted where copywriters gather — framed as
  "here's a free VoC card for freelance illustrators, take it," not as an ad
- **Go/no-go:** >5% of targeted visitors leave an email, or ≥5 preorders → build. Crickets
  after ~300 visitors → the promise is wrong, not the execution. Change the promise.

### Phase 1 — MVP (4–6 weekends)

**In scope:**

1. **Red Pen** (free tier, and the front door). Paste a draft → structured critique. No
   rewrite button, ever. Output: the hard questions (who is this for, what change do you
   seek, where's the tension), phrases flagged as absent from the audience's vocabulary, and
   the audience's own phrasing quoted beside them. Works with a self-written card, which is
   what makes it a viable free product.
2. **Audience setup.** One sentence in → proposed sources out (Discourse forums,
   Hacker News, Stack Exchange, YouTube comments, review sites, RSS). Human confirms and
   edits. Never auto-watch without confirmation; a bad source poisons the card.
3. **The listening pipeline.** Scheduled fetch → dedupe → relevance gate → extraction with
   mandatory quote + permalink → cluster into themes → update card.
4. **The Narrative Card.** One page, five sections: *their words, tensions, dreams, enemies,
   unmet asks.* Versioned, diffable, exportable to Markdown/PDF (the deliverable).
5. **Weekly digest** via Resend: what shifted, three new quotes, one unmet ask. A quiet week
   says "nothing shifted" in one line and stops.
6. **Stripe billing.**

**Out (v2+):** team seats, API, Slack delivery, podcast/video transcripts, sentiment scoring
(vanity), multi-audience comparison, anything resembling a dashboard.

**Shared listening economics:** each source is fetched once globally and fanned out to every
subscriber watching it. Marginal cost per customer approaches zero and the normalized
utterance corpus compounds — but only for sources whose terms permit it, which is the entire
argument for staying off Reddit.

### Phase 2 — Launch

- **Demo GIF, under 30 seconds:** type one sentence → sources appear → card fills with real
  linked quotes → paste your own homepage → Red Pen takes it apart.
- **First-comment story:** the five-steps page, and the honest version — a landing page full
  of words nobody being served had ever said.
- Launch offer: 40% off for 12 months. No lifetime deals.

---

## Product principles

Non-negotiable. Each one is load-bearing.

1. **Receipts or it doesn't ship.** Every line in a card carries a verbatim quote and a
   permalink. Scout is never permitted to write "your audience values authenticity." The
   moment it paraphrases without a source, it becomes a horoscope, and horoscopes churn.
2. **Their words, not ours.** If a phrase didn't come from the audience, it doesn't go in the
   card.
3. **Red Pen never writes.** No "suggest a rewrite," no "stronger version," no autocomplete.
   Questions and evidence only. This is the entire position; the first compromise makes it
   another generator.
4. **A quiet week is a real answer.** One line, no invented insight.
5. **One audience per subscription by default.** The thesis is that you serve a tiny group.
   Shipping "track 40 audiences" would contradict the pricing page.
6. **Quote real people carefully.** Short excerpts, always linked, no author names in
   digests, and any quote whose source post has disappeared on refetch is dropped.

## Pricing

**Now (service):**

| | Price | What |
|---|---|---|
| One card | $300–500 | A single research document, delivered in ~2 days |
| Card + Red Pen pass | $750 | Plus a critique of their draft against it |
| Monthly refresh | $150/mo | Only when they ask. Never lead with it |

**Later (SaaS), only if Phase −1 says so:**

| | Price | What |
|---|---|---|
| Red Pen | Free | Unlimited critiques against a card you write yourself |
| Scout | $49/mo | One audience, maintained card, weekly digest, export |
| Practice | $99/mo | Three audiences, faster cadence, Slack, branded export |

Priced for the consultant, not the hobbyist. A card that saves four hours on a $5k project is
not a $19 purchase.

## Architecture (boring on purpose)

Carried over from this repo's previous occupant, which had this part right.

- **App:** Next.js on Vercel — marketing and product in one.
- **Source adapters:** one per source type, each yielding a normalized
  `Utterance { source, source_type, permalink, author_hash, text, posted_at, query }`.
  Built and tested: Hacker News (Algolia, free, no key), Stack Exchange (free API),
  Discourse (public JSON — thousands of niche professional forums run on it), RSS, and a
  `manual` adapter for quotes you gathered by hand. Later: YouTube Data API, review sites.
  See `tools/gather.py`; run `--why-no-reddit` for the missing adapter.
- **No Reddit adapter, ever.** Not a hedge — a survival condition. Reddit is a source you read
  yourself in a browser and paste into a `manual` entry. Automating it requires a commercial
  licence the incumbent could not get at 135,000 users.
- **Pipeline:** fetch → dedupe → cheap relevance gate (keyword/embedding) → Claude extracts
  signals with a *required* quote and permalink per signal → cluster → card version → digest.
  The model only sees candidates that pass the gate, which is where the cost control lives.
- **DB:** Postgres (Neon/Supabase). `audiences, sources, utterances, signals, cards,
  card_versions, users, subscriptions, digests`.
- **Privacy:** store the permalink and a hashed author id, never a name. Digests link, they
  don't attribute.
- **Costs:** shared fetching plus a pre-model relevance gate keeps this under ~$50/mo until
  there's real scale.

## The marketing engine

**Publish free cards, forever.** One public audience per week: *"How freelance illustrators
actually talk about pricing — 214 quotes, every one linked."* Given away.

Why this is the whole channel and not a tactic:

- Directly stealable by the exact person who'd buy it — a copywriter can use it on a client
  project today, which is the strongest possible demonstration
- No competitor can produce it without building the same pipeline
- Programmatic SEO that isn't slop, because it's real quotes with links rather than generated
  filler
- **The marketing is the product running.** The page selling it is the thing it makes

Second channel: Red Pen as the free, shareable roast — people post their own critique in a way
nobody ever posts a research report.

Third, and time-limited: **the orphaned 135,000.** GummySearch's users lose their tool on
1 Dec 2026 and are searching for a replacement now. Being visibly useful on "what do I use
instead" between now and then is the cheapest distribution this project will ever get — and
the honest pitch writes itself, because the replacement they need is one that can't be killed
the same way.

And note what publishing weekly for years actually is: step 5. Godin's own answer to
distribution happens to be this product's output.

## Risks

Full weighting lives in `SCOUTVALIDATION.md`. The three that matter:

| Risk | Mitigation |
|---|---|
| The non-Reddit sources are too thin to carry a card | **Untested and now the make-or-break question.** Build card #1 with zero Reddit and look at it honestly |
| Research is a sprint, not a subscription | Largely defused by selling a per-project deliverable, where bursty demand is the normal shape |
| Reddit licensing | Settled: nothing automated touches Reddit |
| Output reads generic → churn | The receipts rule, enforced in the schema, not in the prompt |

## Repo layout

```
toscout/
├── README.md
├── SCOUTPLAN.md              ← this file
├── SCOUTVALIDATION.md        ← the sweep, competitors, kill criteria
├── PHASEMINUS1.md            ← the runbook: targets, outreach, card format, pricing
├── index.html                ← smoke-test landing page (GitHub Pages)
├── tools/
│   ├── gather.py             ← collects utterances; no Reddit adapter, on purpose
│   └── tests/test_gather.py  ← 25 tests, fixture-based, no network
├── cards/
│   └── example.sources.json  ← copy this per audience
├── CNAME                     ← toscout.com (add when DNS is pointed)
└── app/                      ← Next.js app (only if Phase −1 passes)
```

## Immediate next actions

1. Read `gummysearch.com/final-chapter/` — this plan rests on secondary reporting of it
2. `python3 tools/gather.py --config cards/example.sources.json --out out/test` — if the
   non-Reddit sources come back thin, stop here; that's the answer
3. Hand-produce card #1 and send it, per `PHASEMINUS1.md`
4. Drop a Formspree endpoint into `index.html` (replace `FORM_ENDPOINT_HERE`)
5. Point toscout.com DNS at GitHub Pages, add `CNAME`
6. Publish card #1 publicly, into the GummySearch-replacement conversation
7. Repeat 3 and 6 nine more times before writing a line of product code
