# 01 · Architecture & Sitemap

## 1. Product pillars

| Pillar | What it means |
|---|---|
| Free forever for learners | Core practice, questions, matching, and events cost ¥0 |
| Radical transparency | Every yen donated is traceable to a Seed ID and its downstream impact |
| Community, not content | The product is people finding people, not a course library |
| Visible growth | Every unit of progress (learner streak, seed, station, city) has a visual growth metaphor |
| Safety by design | In-person meetings require verification, ratings, and check-ins before they're allowed |

## 2. Sitemap

```
/                                   Landing (mission, live impact ticker, CTAs)
/how-it-works                       Explainer: seeds → sprouts → trees → forests
/pricing                            Seed tiers (¥500 / ¥1000 / ¥5000 / ¥10000) + sponsorships

/sign-up, /sign-in, /sso-callback   Clerk-hosted auth flows
/onboarding                         Role select (Learner / Mentor / Supporter / Ambassador),
                                     profile builder, English level placement, interests

/dashboard                          Personal home: streak, next lesson nudge, matches,
                                     upcoming meetups, unread answers, seed summary
/profile/[username]                 Public profile: badges, streak, reputation, level
/settings                           Account, notifications, privacy, verification, billing

--- LEARNING ---
/learn                              Daily practice hub (AI conversation coach, drills)
/learn/vocabulary
/learn/grammar
/learn/pronunciation
/learn/writing

--- ASK ENGLISH ---
/questions                          Searchable question library (filter by category)
/questions/ask                      New question composer
/questions/[id]                     Question detail: answers, upvotes, best-answer, comments
/questions/categories/[slug]        Grammar / Pronunciation / Vocabulary / Business /
                                     Travel / Conversation-practice

--- PEOPLE & MATCHING ---
/partners                           Find a practice partner (filters: location, availability,
                                     interests, goals, skill level, age group, meeting style)
/partners/requests                  Sent/received practice requests
/matches/[id]                       A specific match thread (chat + schedule + meeting type)

--- EVENTS ---
/events                             Browse/filter events (map + list view)
/events/create                      Host an event
/events/[id]                        Event detail: date, location, capacity, RSVP, reviews,
                                     photos, host info, safety check-in
/events/my                          Hosted + attending events

--- MAP ---
/map                                Tokyo Impact Map (Shibuya, Shinjuku, Ikebukuro, Tokyo
                                     Station, Ueno, Akihabara, Shinagawa, Kichijoji, Nakano,
                                     Yokohama) — growth-stage visualization per station
/map/[station-slug]                 Station detail: funding raised, active seeds, visits,
                                     registrations, active learners, upcoming events,
                                     growth score, forest-health score

--- SEEDS / SUPPORTING ---
/seeds                              "My Seeds" dashboard (every seed you've planted)
/seeds/[id]                         Single seed detail (impact timeline, growth %, forest %)
/seeds/plant                        Buy a seed / growth seed / community seed / forest seed
/seeds/certificate/[id]             Shareable digital certificate + social share card
/sponsor/tree, /sponsor/forest      Large-donation flows (tree/forest sponsorship)

--- UNIVERSITY / AMBASSADORS ---
/campus                             Campus ambassador program landing
/campus/apply
/campus/dashboard                   Ambassador dashboard: referral tracking, campus metrics
/campus/leaderboard                 University leaderboard (Waseda, Sophia, Keio, Meiji,
                                     Rikkyo, Hosei, Aoyama Gakuin, ...)

--- TRUST & SAFETY ---
/safety                             Community guidelines, verification explainer
/report/[targetType]/[targetId]     Report a user/event/question
/trust-score                        Explains how the community trust score is computed

--- ADMIN (role-gated) ---
/admin                              Revenue, registrations, active learners/mentors,
                                     events, attendance rate, top locations, CPL/CPS/CPA,
                                     university growth
/admin/seeds, /admin/events,
/admin/users, /admin/reports
```

## 3. Primary user flows

### 3.1 Learner onboarding → first practice
`/sign-up` → `/onboarding` (role=Learner, English level placement quiz, interests,
availability) → `/dashboard` (nudged toward: ask a question, find a partner, or join an
event) → first action fires the **"First Question Asked"** or **"First Meetup Joined"**
achievement → streak counter starts.

### 3.2 Supporter → seed purchase → impact tracking
`/pricing` or `/seeds/plant` → choose tier → Stripe/PayPay checkout → seed minted with a
unique ID and geo-tagged to a station (chosen or auto-assigned to the highest-need
station) → `/seeds/[id]` shows live impact (visits/registrations/meetups attributed to
that seed via the attribution model in `04-seed-tracking-system.md`) → optional social
share card.

### 3.3 Find a practice partner → meet safely
`/partners` (filter by location/availability/interests/goals/level/age) → send request →
`/matches/[id]` chat thread → agree on meeting type (online/voice/video/in-person) → if
in-person: both users must have verified email + phone before the "Confirm in-person
meetup" button unlocks → meetup includes a check-in flow (both parties confirm arrival
via app, unlocks a review + trust-score update afterward).

### 3.4 Ask an English question
`/questions/ask` → pick category → post → community answers (native speakers, advanced
learners, mentors flagged with a badge) → asker marks best answer → question is indexed
into the searchable library, upvotes drive ranking.

### 3.5 Host/attend an event
`/events/create` (English Cafe, Conversation Night, Exchange Event, Business Workshop,
University Meetup, Language Picnic) → capacity + location (Mapbox picker) → published →
attendees RSVP → event auto-appears on `/map` for that station → after the event: photos,
reviews, and attendance feed the station's Growth Score.

### 3.6 Campus ambassador loop
`/campus/apply` → approved → `/campus/dashboard` gets a unique referral link/QR →
referred signups attributed to that campus → `/campus/leaderboard` ranks universities by
registrations, active learners, and events hosted, driving inter-university competition.

## 4. Frontend architecture

- **Framework**: Next.js 14 App Router, React Server Components by default; interactive
  islands (map, forms, chat, question composer, seed animations) are Client Components.
- **Styling**: Tailwind CSS with a design-token theme (see `08-design-system.md`) +
  shadcn/ui primitives (Button, Card, Dialog, Tabs, Avatar, Progress, Badge, Toast) as the
  component base layer, customized to the forest/cream palette.
- **State**: Server state via React Query (TanStack Query) over REST; local/UI state via
  React state + Zustand only where cross-component (e.g. active map filters).
- **Data fetching**: Server Components fetch directly from the API layer at request time
  (or via `fetch` with Next.js caching) for SEO-critical pages (landing, questions,
  events, map, public profiles); Client Components use React Query for anything
  interactive/mutable (dashboards, matching, seed purchase).
- **Realtime**: PostHog for analytics; a lightweight WebSocket/SSE channel (or Pusher) for
  live seed-impact ticking on `/seeds/[id]` and `/map` so numbers visibly increment.
- **i18n**: next-intl with `en` and `ja` locales from day one — this is a bilingual
  product by definition.

## 5. Backend architecture

- **API**: Next.js Route Handlers under `/app/api/*` for MVP, structured so the resource
  layer (services + repositories) can be lifted into a standalone Node/Express (or
  Fastify) service once traffic justifies decoupling from the Vercel frontend.
- **Database**: PostgreSQL (see `02-database-schema.md`), accessed via Prisma ORM for
  type-safe queries and migrations.
- **Auth**: Clerk handles sign-up/sign-in/session/phone verification; webhooks sync
  `clerk_user_id` into our `users` table on `user.created`/`user.updated`.
- **Payments**: Stripe Checkout for card/international seeds; PayPay for JP-local
  payments via their merchant API; both write to a unified `transactions` table and emit
  a `seed.planted` domain event that the impact-attribution worker consumes.
- **Background jobs**: a queue (e.g. Vercel Cron + a lightweight job table, or upgrading
  to BullMQ/Redis at scale) handles: nightly growth-score recomputation, streak-expiry
  checks, achievement evaluation, digest emails, ambassador leaderboard refresh.
- **Storage**: object storage (S3-compatible, e.g. Vercel Blob or Cloudflare R2) for
  event photos, profile photos, and generated certificate/share-card images.
- **Search**: Postgres full-text search (tsvector) for the question library at MVP scale;
  revisit (Algolia/Meilisearch) once question volume grows.

## 6. Mobile responsive strategy

- Mobile-first Tailwind breakpoints; bottom tab bar (Home, Ask, Map, Events, Profile) on
  `<md` screens, replacing the sidebar nav used on desktop.
- The Tokyo Impact Map collapses to a swipeable station-card carousel under the map on
  mobile instead of a hover-driven desktop panel.
- Seed purchase and event RSVP flows are single-column, thumb-reachable, with sticky CTA
  buttons.
- All growth animations respect `prefers-reduced-motion`.

## 7. Component system (summary — full detail in `08-design-system.md`)

Base primitives (shadcn-style): `Button`, `Card`, `Badge`, `Avatar`, `Progress`, `Tabs`,
`Dialog`, `Sheet`, `Toast`, `Input`, `Textarea`, `Select`, `Skeleton`.

Domain components: `SeedCard`, `GrowthStageBadge` (bare-soil/seedling/tree/forest),
`StationCard`, `ImpactStat`, `QuestionCard`, `AnswerThread`, `EventCard`,
`PartnerMatchCard`, `TrustScoreMeter`, `StreakFlame`, `AchievementBadge`,
`CampusLeaderboardRow`, `AdminMetricTile`.
