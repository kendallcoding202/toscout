# ToScout — Product Plan

**One-liner:** ToScout watches the platforms your startup depends on — Stripe, OpenAI, AWS,
Twilio, the app stores — and sends you plain-English alerts when their pricing, terms of
service, limits, or APIs change. Connect your repo; your vendors are detected automatically.

**Tagline:** Know before it breaks you.

**Wordmark:** **ToS**cout — bold the ToS.

**Positioning:** The founder-facing, business-change lane. NOT technical spec-diffing
(ShiftGraph/SpecFlag own that, at 10x the price, for funded teams). ToScout answers the
question every founder quietly worries about: *"what did my vendors change while I wasn't
looking?"*

---

## Sequence: smoke test → MVP → launch

### Phase 0 — Smoke test (week 1, before any product code)

Goal: prove founders will hand over an email (or $9) for this promise.

- Landing page on GitHub Pages at toscout.com (in this repo, `index.html`).
- Email capture wired to a form service (Formspree/Tally free tier) — see landing page notes.
- Optional stronger signal: $9/mo "founding member" Stripe payment link (refundable),
  50% off for life.
- Distribution: 3–5 posts where founders live — X, Indie Hackers, r/SaaS — framed as a
  question ("how do you keep up with vendor pricing/ToS changes?"), not an ad.
- **Go/no-go:** >5% of visitors leave an email, or ≥5 founding-member preorders → build.
  Crickets after ~300 visitors → pivot with evidence.

### Phase 1 — MVP (3–5 weekends)

**In scope:**
1. **Vendor corpus** — the moat. Start with the ~50 vendors indie SaaS actually uses
   (Stripe, OpenAI, Anthropic, AWS, Vercel, Netlify, Supabase, Firebase, Twilio, Resend,
   Postmark, SendGrid, Cloudflare, GitHub, Google Cloud/Maps/Play, Apple App Store, Paddle,
   Lemon Squeezy, PayPal, Shopify, Auth0/Clerk, Algolia, Sentry, PlanetScale, Neon, Railway,
   Render, Fly.io, DigitalOcean, Mailgun, Loops, Intercom, Crisp, Notion API, Slack API,
   Discord API, X API, Meta APIs, TikTok API, Reddit API…). For each: pricing page, ToS/AUP,
   changelog/deprecations feed. Prefer RSS/changelog feeds where they exist; scrape otherwise.
2. **Watcher pipeline** — scheduled daily checks per page; store snapshots; diff; when
   changed, AI (Claude) writes a plain-English summary + severity (FYI / heads-up / act now)
   + "who is affected" tags (e.g. "affects metered API users").
3. **Repo auto-detect onboarding** — GitHub sign-in, read package.json / requirements.txt /
   go.mod + a config-file sniff → map to vendor list → "We found 9 vendors in your stack.
   Watching 23 pages." Manual add/remove for the rest.
4. **Alerts** — email per incident + the **monthly "State of your stack" digest** (the
   retention mechanism: value visible even in quiet months — "3 changes at your vendors,
   none affect you. You're covered.").
5. **Stripe billing** — Free: 3 vendors, email alerts. Pro $19/mo: unlimited vendors,
   digest, Slack alerts, priority severity analysis.

**Out (v2+):** spec diffing, status-page/uptime monitoring (crowded), team seats, API,
Discord/webhook delivery, per-vendor public pages (see SEO below — v1.5 candidate).

**Shared-monitoring economics:** every page is monitored once globally, fanned out to all
subscribers of that vendor. Marginal cost per customer ≈ zero. Every vendor added compounds
the corpus moat.

### Phase 2 — Product Hunt launch

Follow the standard checklist (see CHANGELOG-PRODUCT-PLAN.md §launch — it transfers
directly). ToScout-specific angles:
- **Demo GIF:** connect repo → vendor list appears → sample alert. Under 30 seconds.
- **First-comment founder story:** the Apollo/Reddit API massacre + "I run Kovyr and
  realized I'd be the last to know if Stripe or OpenAI changed terms under me."
- **Tagline:** "Know before it breaks you."
- Launch-day offer: 40% off Pro for 12 months. No lifetime deals.

## Architecture (boring on purpose)

- **Frontend/app:** Next.js on Vercel (marketing + dashboard in one app).
- **Watchers:** scheduled jobs (cron on Railway worker or GitHub Actions initially) →
  fetch → normalize (strip nav/boilerplate) → hash-compare → on diff, Claude summarizes
  and classifies → store → notify affected subscribers via Resend.
- **DB:** Postgres (Neon/Supabase). Tables: vendors, watched_pages, snapshots, changes,
  users, user_vendors, notifications.
- **Repo detect:** GitHub OAuth (read-only, contents), parse manifests, map deps → vendors
  via a curated lookup (e.g. `stripe` npm → Stripe; `openai` → OpenAI).
- **Costs:** ~50 vendors × ~3 pages × daily = trivial; Claude summarization only on diffs.
  Under $30/mo until real scale.

## The SEO engine (the lasting channel)

Programmatic public pages per vendor: "What changed at Stripe — pricing & terms history."
Every diff ToScout catches becomes public content nobody else maintains. These pages rank
for "did [vendor] change pricing," build backlinks, and funnel into "watch your whole
stack." This is the compounding distribution the changelog idea's footer-link was — but
with content only ToScout's corpus can generate. Ship v1.5, after billing works.

## Risks & mitigations (carried from validation)

| Risk | Mitigation |
|---|---|
| Insurance-fatigue churn | Monthly digest makes quiet months visible; free tier keeps it installed pre-disaster |
| Scraper breakage | Curated corpus (~150 stable corporate pages), prefer feeds, alert-on-fetch-failure |
| Adjacent players move down-market | Speed + corpus depth + indie brand; they're anchored at $149+/mo |
| ToS summaries ≠ legal advice | Standard disclaimer on every alert |
| Alert fatigue / noise | Severity tiers; suppress boilerplate diffs (dates, typos) at the normalize step |

## Repo layout (this repo)

```
toscout/
├── TOSCOUT-PLAN.md              ← this file
├── DEPENDENCY-WATCHDOG-VALIDATION.md
├── index.html                   ← smoke-test landing page (GitHub Pages)
├── CNAME                        ← toscout.com (add when DNS is pointed)
└── app/                         ← Next.js app (Phase 1)
```

## Immediate next actions

1. ~~Buy toscout.com~~ (done — also consider toscout.app defensively)
2. Create the `toscout` repo, push this folder
3. Enable GitHub Pages, point toscout.com DNS at it
4. Create a Formspree (or Tally) form, drop its endpoint into index.html
5. Post the smoke-test question in 3 founder communities; watch the numbers for a week
