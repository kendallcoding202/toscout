# Dependency Watchdog — Validation Sweep

Idea under test: a subscription service that watches the platforms a startup depends on
(Stripe, OpenAI, AWS, Twilio, app stores…) and sends plain-English alerts when their
pricing, terms of service, rate limits, or APIs change. Onboarding: connect your GitHub
repo, dependencies auto-detected.

## Verdict: qualified GO — but only in the "founder/business-change" lane

The market splits into two lanes. One is getting crowded; the other is still open.

### Lane 1: technical API-drift monitoring (CROWDED — avoid)

Dev-focused tools that diff API specs and catch breaking changes before production:

- **ShiftGraph** (shiftgraph.dev) — "dependency intelligence and early warning for
  third-party APIs." Real product, priced $149–499/mo, unlimited seats, aimed at funded
  teams. Heavy SEO content play.
- **SpecFlag** (specflag.dev) — continuous API-dependency checks, breaking-change alerts,
  free tier. Spec-diffing focus.
- **FlareCanary** — publishing comparison content on "API schema drift detection."
- Generic monitors (**PageCrawl** ~$80/yr, **Visualping**, **Webalert**) all publishing
  content marketing against these exact keywords.

Multiple funded/serious players plus an SEO land-grab in progress. Same pattern as the
changelog space. Do not build here.

### Lane 2: business-change watchdog for founders (OPEN)

Nobody found doing: cheap ($9–29/mo), zero-config, founder-facing alerts about the
**business side** of your dependencies — pricing changes, ToS changes, usage-limit and
policy changes, deprecation announcements — in plain English with "does this affect you"
analysis.

- ShiftGraph et al. are technical (spec diffs) and priced for teams, not indies.
- SaaS Price Pulse / Verid watch your **competitors'** pricing, not your **vendors'**.
- Visualping/PageCrawl can be hand-configured to do this, but per-page, DIY, aimed at
  legal/compliance teams — no productization, no repo auto-detect, no shared monitoring.

### Demand-side evidence (strong)

- Reddit's 2023 API pricing change killed Apollo (facing ~$20M/yr overnight), BaconReader,
  Boost, Sync — the canonical horror story every founder knows.
- Meta ended its Events API without notice, nearly killing PostMyParty.
- "Platform dependency risk" is an established anxiety topic in indie-hacker content.
- PageCrawl's own content claims a startup using 20–30 third-party services handles
  several deprecations per year.

## Differentiators that make Lane 2 defensible

1. **Shared monitoring economics** — thousands of customers share the same ~200 vendors;
   monitor each vendor once, fan alerts out to everyone affected. Marginal cost per
   customer ≈ zero; per-page tools (and each new clone) can't match the coverage without
   rebuilding the curated vendor corpus.
2. **Repo auto-detect onboarding** — connect GitHub → package.json/config parsed → "you
   depend on Stripe, OpenAI, Resend, Vercel; now watching 14 pages." Instant demo, PH gold.
3. **Plain-English impact framing** — not "page changed," but "Stripe raised international
   card fees 0.4%; based on your stack this likely affects you."

## Risks (from the sweep, honestly weighted)

1. **Insurance sells poorly to indies.** The pain is episodic; between incidents the tool
   feels like a cost. Mitigations: a monthly "state of your stack" digest so value is
   visible on quiet weeks; free tier watching 3 vendors so the tool is installed *before*
   the incident; lead marketing with money stories ("caught a pricing change worth
   $400/mo") not fear.
2. **The crowd is adjacent, not absent.** ShiftGraph could ship a cheap indie tier;
   generic monitors could productize. Speed and the vendor-corpus moat are the counters.
3. **Revenue ceiling at indie pricing.** $19/mo × indie churn means volume matters; the
   free-tier + PH + SEO (per-vendor "what changed at Stripe this month" pages — a strong
   programmatic-SEO angle) must do the acquisition work.
4. **Legal-ish surface** — summarizing ToS diffs is fine; avoid framing alerts as legal
   advice. Standard disclaimer handles it.

## Suggested scope shift vs. Lane 1 players

Monitor per vendor: pricing page, ToS/policy pages, changelog/deprecation feed, status of
the specific products detected in the customer's repo. Skip spec diffing entirely in v1 —
that's Lane 1's game and the hardest part to build.

## Name direction

Avoid "dep/dependency" naming (collides with Dependabot/Snyk mental space — package
versions, not business terms). Candidates to check when naming: Stackwatch-style
compounds, "vendor" compounds, invented words. Verify with registrar + "<name> app"
search, per the Changeloop process.
