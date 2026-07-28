# 🌱 Seed English Tokyo

**"My English is growing. My seed is growing. Our forest is growing."**

Seed English Tokyo is a free English-practice community for Japanese people aged 18–30,
funded transparently by supporters who buy trackable "Seeds." Every seed funds real
growth (events, outreach, ads) and every supporter can watch the exact impact of their
seed — visitors, signups, learners, meetups — as it happens, on a live map of Tokyo that
grows from bare soil into a forest.

This directory contains the full product, design, and technical specification, plus a
working Next.js front-end scaffold that demonstrates the visual language, page structure,
and core interaction patterns described in the docs.

## What's here

```
seed-english-tokyo/
├── docs/                        Full product & technical specification
│   ├── 01-architecture-and-sitemap.md
│   ├── 02-database-schema.md
│   ├── 03-api-architecture.md
│   ├── 04-seed-tracking-system.md
│   ├── 05-tokyo-impact-map.md
│   ├── 06-events-matching-safety.md
│   ├── 07-gamification-ai-admin.md
│   ├── 08-design-system.md
│   ├── 09-growth-monetization-strategy.md
│   └── 10-roadmap.md
└── web/                         Next.js + TypeScript + Tailwind front-end scaffold
    ├── app/                     Landing, My Seeds, Tokyo Map, Ask English, Events
    ├── components/              Reusable UI (seed cards, station cards, nav, etc.)
    └── lib/mock-data.ts         Realistic mock data matching the docs (e.g. Seed #78422)
```

## Reading order

1. **`docs/01-architecture-and-sitemap.md`** — start here. Full sitemap, user flows,
   frontend/backend architecture, mobile responsive strategy.
2. **`docs/02-database-schema.md`** — PostgreSQL schema (tables, relationships, indexes).
3. **`docs/03-api-architecture.md`** — REST API surface, auth, webhooks.
4. **`docs/04-seed-tracking-system.md`** — the core mechanic: seeds, growth stages, impact
   attribution math.
5. **`docs/05-tokyo-impact-map.md`** — the Mapbox-powered living map of Tokyo.
6. **`docs/06-events-matching-safety.md`** — events, partner matching, trust & safety.
7. **`docs/07-gamification-ai-admin.md`** — achievements, AI tutor features, admin/analytics
   dashboard.
8. **`docs/08-design-system.md`** — color system, typography, components, wireframes,
   animation language.
9. **`docs/09-growth-monetization-strategy.md`** — go-to-market, campus ambassadors,
   revenue model, unit economics.
10. **`docs/10-roadmap.md`** — phased build plan from MVP to Series-A-ready platform.

## Running the front-end scaffold

```bash
cd seed-english-tokyo/web
npm install
npm run dev
# open http://localhost:3000
```

The scaffold renders against `lib/mock-data.ts` — no database, auth, or payment provider
is wired up yet. It exists to prove out the design system and page structure end to end
(see `docs/10-roadmap.md` for what "wiring up Clerk/Stripe/Mapbox/Postgres" actually
involves and in what order to do it).

## Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui conventions |
| Backend | Node.js (Next.js Route Handlers → extractable to a standalone API), PostgreSQL |
| Auth | Clerk |
| Payments | Stripe (cards/international) + PayPay (Japan-local) |
| Maps | Mapbox GL JS |
| Analytics | PostHog |
| Hosting | Vercel |
