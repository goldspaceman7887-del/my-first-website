# 10 · Development Roadmap

## Phase 0 — Foundations (weeks 1–3)
- Repo/monorepo setup, CI (lint/typecheck/test on PR), Vercel project.
- Provision Postgres (Neon/Supabase/RDS), run initial Prisma migration from
  `02-database-schema.md`.
- Wire Clerk (sign-up/sign-in/session, phone verification) end to end; sync
  `user.created`/`user.updated` webhooks into `users`.
- Design system in code: Tailwind theme tokens + shadcn base components restyled per
  `08-design-system.md`. Ship a `/style-guide` internal route for QA.
- Seed the 10 launch stations into `stations`.

**Exit criteria**: a user can sign up, verify phone, and land on an empty `/dashboard`.

## Phase 1 — Ask English + Profiles (weeks 3–6)
- Question/answer CRUD, categories, upvotes, best-answer, saved questions, Postgres
  full-text search.
- Public profile pages, badges (schema only — award logic can be manual/seeded initially).
- Bilingual (EN/JA) i18n scaffolding live from this phase, not retrofitted later.

**Exit criteria**: `/questions` is a usable, indexable public library; profiles are live.

## Phase 2 — Matching + Events (weeks 6–10)
- `/partners` search + filters, partner requests, matches, scheduling.
- Safety gating (verified email/phone required for in-person confirm), block, report.
- Events CRUD, RSVP, capacity/waitlist, check-in (geofenced + manual override).
- Reviews (match + event) feeding a first version of Trust Score.

**Exit criteria**: a full loop — find a partner or event, meet, check in, leave a review —
works end to end for a pilot group in Shibuya (see Phase 1 of
`09-growth-monetization-strategy.md`).

## Phase 3 — Seeds & Payments (weeks 10–14)
- Seed tiers, Stripe Checkout integration, PayPay integration, webhook-driven minting.
- `/seeds` dashboard, `/seeds/[id]` detail, certificate generation (`@vercel/og`).
- Nightly attribution job (`recompute-seed-impact`) implementing the model in
  `04-seed-tracking-system.md`; `station_metrics_daily` rollups.
- Tree/forest sponsorship flows.

**Exit criteria**: a real ¥500 payment mints a real, trackable Seed #, and its impact
numbers visibly move within 24 hours as station activity accrues.

## Phase 4 — Tokyo Impact Map (weeks 13–16, overlaps Phase 3)
- Mapbox custom style, station markers with growth-stage visuals, live-updating summary
  bar.
- Mobile carousel fallback, accessibility labels, no-JS/no-map degradation to
  `StationCard` grid.
- `/map/[slug]` detail pages with sparkline history from `station_metrics_daily`.

**Exit criteria**: `/map` visibly reflects real seed and event data from Phases 2–3.

## Phase 5 — Gamification, AI, Campus Program (weeks 16–20)
- Achievement evaluation job, streaks, XP, reputation score.
- AI features (grammar assistant, conversation coach, vocab suggestions, writing
  correction, pronunciation feedback, mentor chat) behind a shared moderation/rate-limit
  layer.
- Campus ambassador application, referral tracking, university leaderboard.

**Exit criteria**: achievements fire correctly off real actions; at least one AI tool is
in daily active use; first campus ambassador cohort onboarded.

## Phase 6 — Admin, Analytics, Launch Hardening (weeks 20–24)
- `/admin` dashboards (revenue, growth, community health, geography, university, unit
  economics), PostHog funnels/retention wired.
- Load testing on payment webhooks and the map's realtime channel.
- Security review: auth boundary tests, rate limiting, payment webhook signature
  verification, PII handling audit (especially phone verification data and event
  location precision).
- Legal/compliance pass: JP data handling (APPI), payment provider compliance (Stripe/
  PayPay merchant requirements), in-person-meeting liability language in Community
  Guidelines.

**Exit criteria**: public launch-ready — admin has real-time visibility into every metric
named in the product brief, and the platform has been through a security review.

## Post-launch — Phase 7+ (ongoing)
- Station-by-station map expansion (per Phase 3 of the growth strategy).
- Monthly recurring "seed subscription" tier.
- Corporate/CSR sponsorship product.
- Smart Match recommendations (V2 matching, still transparent/explainable).
- Expansion playbook packaged for a second city.

## Sequencing rationale

Community mechanics (Ask English, matching, events) ship *before* payments deliberately —
the seed-tracking system's entire value proposition is showing supporters real impact, so
there must be real activity to attribute before the first seed is ever sold. Selling seeds
against an empty platform would undermine the transparency promise that is the product's
core differentiator.
