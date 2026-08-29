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

**Positioning:** Voice-of-customer research, automated and kept current. NOT social listening
(enterprise, brand-monitoring, wrong buyer), NOT keyword alerts (commodity, free options
exist), NOT a content generator (the opposite of the thesis).

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

## Sequence: hand-run → smoke test → MVP → launch

### Phase −1 — Ten by hand (before any product code)

Produce ten Narrative Cards manually. You, reading forums for an afternoon each. Free, for
real copywriters and founders. Then ask exactly one question: *"what would you pay for this
every month?"*

- Learns what actually belongs in the card, which no amount of planning will tell you
- Costs ten afternoons instead of ten weekends
- Produces the first ten pieces of public content (see the engine)
- **Go/no-go:** fewer than three people name a monthly number → this is a one-off product or
  a services business, not SaaS. Reprice or kill. Don't build the pipeline to find out.

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
2. **Audience setup.** One sentence in → proposed sources out (Reddit, Discourse forums,
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
subscriber watching it. If 200 customers all watch r/freelance, we fetch it once. Marginal
cost per customer approaches zero, and the normalized utterance corpus compounds.

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

| | Price | What |
|---|---|---|
| Red Pen | Free | Unlimited critiques against a card you write yourself |
| Scout | $49/mo | One audience, up to 12 sources, maintained card, weekly digest, export |
| Practice | $99/mo | Three audiences, faster cadence, Slack, client-ready branded export |

Priced for the consultant, not the hobbyist. $19 was the founder price and it undersells a
billable deliverable — a card that saves four hours on a $5k project is not a $19 purchase.

## Architecture (boring on purpose)

Carried over from this repo's previous occupant, which had this part right.

- **App:** Next.js on Vercel — marketing and product in one.
- **Source adapters:** one per source type, each yielding a normalized
  `Utterance { source, permalink, author_hash, text, posted_at }`. Reddit (official API),
  Discourse (public JSON), Hacker News (Algolia API, free), Stack Exchange (API, free),
  YouTube Data API, RSS. **No source may exceed ~40% of a card** — the previous product in
  this repo existed to warn people about platform dependency, so shipping a Reddit-only tool
  here would be self-parody.
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

And note what publishing weekly for years actually is: step 5. Godin's own answer to
distribution happens to be this product's output.

## Risks

Full weighting lives in `SCOUTVALIDATION.md`. The three that matter:

| Risk | Mitigation |
|---|---|
| Research is a sprint, not a subscription | Phase −1 answers this in two weeks for free; if true, reprice as one-off or services |
| Source platform pricing/ToS changes | Source-agnostic adapters, no source above ~40% of a card |
| Output reads generic → month-three churn | The receipts rule, enforced in the schema, not in the prompt |

## Repo layout

```
toscout/
├── README.md
├── SCOUTPLAN.md            ← this file
├── SCOUTVALIDATION.md      ← the sweep, competitors, kill criteria
├── index.html              ← smoke-test landing page (GitHub Pages)
├── CNAME                   ← toscout.com (add when DNS is pointed)
└── app/                    ← Next.js app (Phase 1)
```

## Immediate next actions

1. Verify the five rows in `SCOUTVALIDATION.md` § "Verify before spending a weekend"
2. Hand-produce card #1 for a real copywriter — an afternoon, no code
3. Drop a Formspree endpoint into `index.html` (replace `FORM_ENDPOINT_HERE`)
4. Point toscout.com DNS at GitHub Pages, add `CNAME`
5. Publish the first hand-run card publicly, then post it where copywriters gather
6. Repeat 2 and 5 nine more times before writing a line of product code
