# 03 · API Architecture

REST over HTTPS, JSON bodies, versioned under `/api/v1`. Implemented as Next.js Route
Handlers at MVP; extractable to a standalone service later without changing the contract.

## Auth

- Clerk issues a session JWT; every request carries it as an `Authorization: Bearer`
  header (or Clerk's cookie session for same-origin browser calls).
- Route handlers verify the session via Clerk's server SDK, then resolve the internal
  `users.id` from `clerk_user_id`.
- Admin routes additionally require `role = 'admin'`.
- Public GET endpoints (landing stats, map, public questions/events) work unauthenticated;
  write endpoints require a session.

## Conventions

- Pagination: cursor-based, `?cursor=<opaque>&limit=20`, response includes `nextCursor`.
- Errors: `{ "error": { "code": "SEED_TIER_NOT_FOUND", "message": "..." } }` with matching
  HTTP status.
- Idempotency: payment-initiating endpoints accept an `Idempotency-Key` header.
- Rate limiting: per-user token bucket (via Vercel Edge Middleware + Redis) on
  write-heavy endpoints (`/questions`, `/answers`, `/reports`, `/partner-requests`).

## Endpoint surface

### Users & profiles
```
GET    /api/v1/me
PATCH  /api/v1/me
GET    /api/v1/users/:username
POST   /api/v1/users/:id/block
DELETE /api/v1/users/:id/block
POST   /api/v1/reports
```

### Seeds & payments
```
GET    /api/v1/seed-tiers
POST   /api/v1/seeds/checkout          { tierKey, stationId?, provider: 'stripe'|'paypay' }
                                        -> { checkoutUrl }
POST   /api/v1/webhooks/stripe          (Stripe signature verified; mints seed on success)
POST   /api/v1/webhooks/paypay          (PayPay signature verified; mints seed on success)
GET    /api/v1/seeds                    (current user's seeds)
GET    /api/v1/seeds/:id
GET    /api/v1/seeds/:id/impact-timeline
GET    /api/v1/seeds/:id/certificate    -> signed image URL
POST   /api/v1/sponsorships/checkout    { scope: 'tree'|'forest', stationId? }
```

### Tokyo Impact Map
```
GET    /api/v1/stations
GET    /api/v1/stations/:slug
GET    /api/v1/stations/:slug/metrics?range=30d
```

### Ask English
```
GET    /api/v1/questions?category=&sort=top|new&query=
POST   /api/v1/questions               { categoryId, title, body }
GET    /api/v1/questions/:id
POST   /api/v1/questions/:id/answers   { body }
POST   /api/v1/answers/:id/best        (author-only)
POST   /api/v1/votes                   { targetType, targetId }
POST   /api/v1/saved-questions/:id
DELETE /api/v1/saved-questions/:id
```

### Matching
```
GET    /api/v1/partners?location=&interests=&level=&ageRange=&availability=
POST   /api/v1/partner-requests        { recipientId, meetingType, message }
PATCH  /api/v1/partner-requests/:id    { status: 'accepted'|'declined' }
GET    /api/v1/matches
GET    /api/v1/matches/:id
POST   /api/v1/matches/:id/schedule    { scheduledAt, locationText, stationId }
POST   /api/v1/matches/:id/checkin
POST   /api/v1/matches/:id/review      { rating, comment }
```

### Events
```
GET    /api/v1/events?station=&type=&from=&to=
POST   /api/v1/events
GET    /api/v1/events/:id
POST   /api/v1/events/:id/rsvp
DELETE /api/v1/events/:id/rsvp
POST   /api/v1/events/:id/checkin
POST   /api/v1/events/:id/photos
POST   /api/v1/events/:id/reviews
```

### University / ambassadors
```
GET    /api/v1/universities/leaderboard
POST   /api/v1/campus/apply
GET    /api/v1/campus/dashboard         (ambassador-only)
```

### Gamification & AI
```
GET    /api/v1/achievements
GET    /api/v1/me/achievements
POST   /api/v1/ai/grammar-assistant     { text }
POST   /api/v1/ai/conversation-coach    { conversationId?, message }
POST   /api/v1/ai/writing-correction    { text }
POST   /api/v1/ai/pronunciation-feedback { audioUrl }
POST   /api/v1/ai/mentor-chat           { conversationId?, message }
```

### Admin
```
GET /api/v1/admin/overview              (revenue, registrations, active learners/mentors)
GET /api/v1/admin/stations/ranked
GET /api/v1/admin/universities/growth
GET /api/v1/admin/unit-economics         (CPL, CPS, CPA — see 09-growth-monetization)
GET /api/v1/admin/seeds
GET /api/v1/admin/reports
```

## Domain events (internal)

Emitted to a lightweight event bus (Postgres `outbox` table drained by a cron worker at
MVP; upgrade to SNS/EventBridge or a message broker at scale) and consumed by workers:

| Event | Consumers |
|---|---|
| `seed.planted` | station metrics recompute, achievement check, welcome email |
| `user.registered` | attribution linker (attaches to referring seed/ambassador), onboarding email |
| `meetup.attended` | trust score update, seed impact ledger entry, achievement check |
| `event.completed` | station growth-score recompute, review request notification |
| `question.answered` | notification to asker, reputation update for answerer |

## Webhooks we expose (for future partner integrations)

`POST /api/v1/webhooks/outbound` — not in MVP scope, documented here as a placeholder for
university partners who want signup notifications pushed to their own systems.
