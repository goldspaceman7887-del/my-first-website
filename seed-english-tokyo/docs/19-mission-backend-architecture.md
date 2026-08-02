# 19 · Mission Backend Architecture (design doc, not yet built)

Request: design the real backend for everything the frontend currently fakes with
localStorage — prayer requests, connection requests, volunteer applications, the
`/team` triage views — so that what gets built later slots directly into the existing
pages instead of requiring a rewrite. **Nothing in this doc is implemented.** It's a
target architecture, following the same SQL-DDL-plus-endpoint-list format as
`02-database-schema.md` and `03-api-architecture.md`, scoped to the features added in
the gospel pivot (`17-gospel-pivot.md`, `18-mission-and-community-expansion.md`).

The frontend was deliberately built so this slots in cleanly: every `lib/*.ts` file
that currently does `localStorage.getItem`/`setItem` (`prayer-requests.ts`,
`connection-requests.ts`, `volunteer-applications.ts`, `church-interest.ts`,
`ambassador-applications.ts`, `testimonies.ts`, `bible-progress.ts`) already has a
narrow, typed read/write interface. Swapping the body of those functions for `fetch`
calls to the API below — without touching any page component — is the intended
migration path. The TypeScript interfaces already in the codebase are the source of
truth for field names in the schema below.

## 1. Roles

`02-database-schema.md`'s `users.role` enum (`learner|mentor|supporter|ambassador|admin`)
predates the pivot and doesn't cover it. Extend it rather than replace it — English
Learning-era roles still apply to that part of the platform:

```sql
ALTER TABLE users
  ADD COLUMN mission_role TEXT NOT NULL DEFAULT 'visitor';
  -- visitor | volunteer | leader | admin
```

- **visitor** — default for every signed-in user. Can submit prayer/connection
  requests, apply to volunteer, submit testimonies, track Bible reading.
- **volunteer** — approved from a `volunteer_applications` row. Can claim and respond
  to prayer/connection requests, see `/team/*` real data.
- **leader** — a volunteer with authority to reassign requests, manage escalations,
  and moderate testimonies before they appear publicly.
- **admin** — full access, including approving/rejecting volunteer applications and
  managing on-call rotation.

Anonymous submission (already supported client-side — the "stay anonymous" checkbox on
`/prayer`) stores `user_id NULL` rather than requiring an account; anonymous requests
can't be followed up with directly, which the escalation design below accounts for.

## 2. Data model

```sql
-- ==================== PRAYER REQUESTS ====================

CREATE TABLE prayer_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),      -- NULL if submitted anonymously
  text          TEXT NOT NULL,
  display_name  TEXT,                            -- NULL = shown as "Anonymous"
  urgency       TEXT NOT NULL DEFAULT 'normal',  -- normal|urgent
  status        TEXT NOT NULL DEFAULT 'new',     -- new|claimed|responded|closed
  claimed_by    UUID REFERENCES users(id),
  claimed_at    TIMESTAMPTZ,
  responded_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_prayer_requests_status ON prayer_requests(status, created_at);

-- ==================== CONNECTION REQUESTS ====================

CREATE TABLE connection_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  method        TEXT NOT NULL,   -- chat|video|in_person
  topic         TEXT,
  display_name  TEXT,
  contact_info  TEXT,            -- email/LINE/phone the requester left, encrypted at rest
  status        TEXT NOT NULL DEFAULT 'new', -- new|claimed|scheduled|completed|closed
  claimed_by    UUID REFERENCES users(id),
  claimed_at    TIMESTAMPTZ,
  scheduled_at  TIMESTAMPTZ,
  video_room_id TEXT,            -- set once a real video room is created, see §4
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_connection_requests_status ON connection_requests(status, created_at);

-- ==================== VOLUNTEERING ====================

CREATE TABLE volunteer_applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  display_name  TEXT,
  contact_info  TEXT,
  interests     TEXT[] NOT NULL,  -- prayer_team|connection_team|events|translation|tech
  availability  TEXT,
  status        TEXT NOT NULL DEFAULT 'pending', -- pending|approved|rejected
  reviewed_by   UUID REFERENCES users(id),
  reviewed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A volunteer's real, vetted capability — separate from the raw application so
-- "approved to help with prayer" and "approved for video calls with strangers" can be
-- granted independently (video/in-person carries more safety weight, see §5).
CREATE TABLE volunteer_capabilities (
  user_id           UUID NOT NULL REFERENCES users(id),
  capability        TEXT NOT NULL, -- prayer_team|connection_chat|connection_video|connection_in_person|events|translation|tech
  granted_by        UUID NOT NULL REFERENCES users(id),
  granted_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, capability)
);

-- ==================== ON-CALL / ESCALATION ====================

CREATE TABLE on_call_shifts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ NOT NULL,
  channel     TEXT NOT NULL  -- sms|push|call — how they're paged, see §5
);

CREATE TABLE escalations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_request_id UUID REFERENCES prayer_requests(id),
  paged_user_id     UUID NOT NULL REFERENCES users(id),
  paged_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  acknowledged_at   TIMESTAMPTZ,
  resolution        TEXT   -- free text, filled in once acknowledged
);

-- ==================== TESTIMONIES ====================

CREATE TABLE testimonies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  display_name  TEXT,
  station_id    UUID REFERENCES stations(id),
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending', -- pending|approved|rejected
  reviewed_by   UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Unlike prayer/connection requests, testimonies are the one thing meant to go
-- public — hence the moderation status. Nothing appears on /stories for other
-- visitors until a leader/admin approves it.

-- ==================== CHURCHES ====================

CREATE TABLE churches (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT UNIQUE NOT NULL,
  name           TEXT NOT NULL,
  name_ja        TEXT NOT NULL,
  station_id     UUID REFERENCES stations(id),
  denomination   TEXT NOT NULL,
  languages      TEXT[] NOT NULL,
  service_times  TEXT[] NOT NULL,
  size_description TEXT,
  description    TEXT,
  verified_by    UUID REFERENCES users(id),   -- who confirmed this is a real, current listing
  verified_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- verified_by/verified_at exist because /churches currently ships fictional example
-- listings (see 18-mission-and-community-expansion.md) — a real deployment must not
-- flip the disclaimer off until every row here has actually been verified.

CREATE TABLE church_interest (
  user_id     UUID NOT NULL REFERENCES users(id),
  church_id   UUID NOT NULL REFERENCES churches(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, church_id)
);

-- ==================== CAMPUS ====================

CREATE TABLE campus_groups (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id  UUID NOT NULL REFERENCES universities(id),
  name           TEXT NOT NULL,
  meeting_time   TEXT NOT NULL,
  location       TEXT NOT NULL,
  language       TEXT NOT NULL,
  verified_by    UUID REFERENCES users(id),
  verified_at    TIMESTAMPTZ
);

CREATE TABLE ambassador_applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  university_id UUID NOT NULL REFERENCES universities(id),
  display_name  TEXT,
  contact_info  TEXT,
  status        TEXT NOT NULL DEFAULT 'pending', -- pending|approved|rejected
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== BIBLE READING ====================

CREATE TABLE bible_reading_progress (
  user_id      UUID NOT NULL REFERENCES users(id),
  plan_key     TEXT NOT NULL DEFAULT 'gospel_of_john',
  day          SMALLINT NOT NULL,   -- 1-21, matches lib/bible-data.ts johnReadingPlan
  completed_on DATE NOT NULL,
  PRIMARY KEY (user_id, plan_key, day)
);
-- computeStreak() in lib/bible-progress.ts already does real calendar-day-streak math
-- client-side; server-side this becomes a query over completed_on rather than a
-- reimplementation — keep the same "consecutive calendar days" definition.

-- ==================== ACHIEVEMENTS ====================
-- Reuses the achievements/user_badges tables already defined in 02-database-schema.md.
-- New badge_key values match lib/badges.ts exactly:
-- first_seed | prayer_warrior | reaching_out | storyteller | week_streak |
-- gospel_of_john | grove_grower
```

## 3. API endpoint surface

Following `03-api-architecture.md`'s conventions (REST, `/api/v1`, cursor pagination,
`Idempotency-Key` on writes that matter).

```
### Prayer
POST   /api/v1/prayer-requests          { text, displayName?, anonymous }
GET    /api/v1/prayer-requests          (volunteer/leader/admin only; ?status=)
PATCH  /api/v1/prayer-requests/:id      { status: 'claimed'|'responded'|'closed' }
POST   /api/v1/prayer-requests/:id/escalate   (leader/admin only, see §5)

### Connection
POST   /api/v1/connection-requests      { method, topic?, displayName?, contactInfo? }
GET    /api/v1/connection-requests      (volunteer/leader/admin only; ?status=)
PATCH  /api/v1/connection-requests/:id  { status, scheduledAt? }
POST   /api/v1/connection-requests/:id/video-room   -> { roomUrl }  (see §4)

### Volunteering
POST   /api/v1/volunteer-applications   { interests[], availability?, displayName?, contactInfo? }
GET    /api/v1/volunteer-applications   (leader/admin only)
PATCH  /api/v1/volunteer-applications/:id  { status: 'approved'|'rejected' }
GET    /api/v1/me/volunteer-capabilities

### Testimonies
POST   /api/v1/testimonies              { title, body, displayName? }
GET    /api/v1/testimonies?status=approved   (public)
GET    /api/v1/testimonies?status=pending    (leader/admin only)
PATCH  /api/v1/testimonies/:id          { status: 'approved'|'rejected' }

### Churches
GET    /api/v1/churches?language=&denomination=&station=
POST   /api/v1/churches/:id/interest
GET    /api/v1/me/church-interest

### Campus
GET    /api/v1/campus-groups?university=
POST   /api/v1/ambassador-applications  { universityId, displayName?, contactInfo? }
GET    /api/v1/ambassador-applications  (leader/admin only)

### Bible
POST   /api/v1/bible-progress           { planKey, day }
DELETE /api/v1/bible-progress/:day
GET    /api/v1/me/bible-progress?planKey=gospel_of_john  -> { days: [...], streak }

### Team (real /team/* backing)
GET    /api/v1/team/overview            (volunteer/leader/admin — counts across all queues)
```

## 4. Video calling — a real, scoped integration

`/partners` currently offers "video call" as a method with no live connection behind
it, by design (see `17-gospel-pivot.md`'s safety section). Wiring this up for real:

- Use a hosted video API rather than building calling infrastructure —
  [Daily.co](https://www.daily.co) or Twilio Video both offer a "create a room, return
  a URL, anyone with the link can join" API that's a few hours of integration, not a
  new subsystem.
- `POST /api/v1/connection-requests/:id/video-room` is called **only after** a
  volunteer with the `connection_video` capability has claimed the request — never at
  request-creation time. This guarantees a room URL is never sent to a requester
  before a real person is actually committed to joining.
- The room URL is delivered to the requester's `contact_info` (email/LINE) rather than
  shown in-app, since anonymous requesters may not return to the page — this needs a
  transactional email/SMS provider (e.g. SendGrid, Twilio SMS), which doesn't exist
  yet either.
- `connection_requests.status` moves `claimed → scheduled` only once both the
  volunteer and requester have confirmed a time — the current frontend's honest "we'll
  follow up" framing on `/partners` should stay as-is until this whole chain exists,
  not be replaced with an in-app "join now" button prematurely.

## 5. Escalation — the safety-critical path

This is the part `17-gospel-pivot.md` flagged as unsafe to fake, and the reason
`/prayer` and `/partners` always show real crisis resources regardless of form state.
Building this for real:

- `prayer_requests.urgency` is set by the submitter (a checkbox: "this feels urgent"),
  never inferred automatically from text content — automatic crisis detection from
  free text is failure-prone in both directions and out of scope.
- An `urgency = 'urgent'` request past a short SLA (e.g. 15 minutes) with
  `status = 'new'` triggers `POST /api/v1/prayer-requests/:id/escalate`, which writes
  an `escalations` row and pages **every** on-call user for the current shift
  (`on_call_shifts`) via their real channel (SMS/push/call) — not just one person, so
  a single missed page doesn't leave a request unhandled.
- Paging itself needs a real provider (Twilio for SMS/voice, or a paging service like
  PagerDuty/Opsgenie if the volunteer pool grows past a few people) — this is
  infrastructure that has to be paid for and configured with real phone numbers before
  this table means anything.
- The crisis-resource box on `/prayer`/`/partners` **stays** even after this ships —
  it's not a stand-in for the real escalation path, it's a permanent fallback for the
  gap between "user submits" and "a real person acknowledges," which will never be
  zero seconds.
- `/team/prayer` becomes real once `GET /api/v1/prayer-requests` is live and gated by
  `mission_role IN ('volunteer','leader','admin')` — the page's current "not a real
  admin panel, no login" disclaimer is removed at that point, not before.

## 6. Migration path for the existing frontend

Each `lib/*.ts` file becomes a thin API client instead of a localStorage wrapper,
keeping its existing exported function names and TS interfaces so page components
don't change:

| File | Today | Becomes |
|---|---|---|
| `lib/prayer-requests.ts` | `localStorage` | `fetch('/api/v1/prayer-requests')` |
| `lib/connection-requests.ts` | `localStorage` | `fetch('/api/v1/connection-requests')` |
| `lib/volunteer-applications.ts` | `localStorage` | `fetch('/api/v1/volunteer-applications')` |
| `lib/testimonies.ts` | `localStorage` + hardcoded `seededTestimonies` | `fetch('/api/v1/testimonies?status=approved')`; seeded examples become real approved rows or get deleted |
| `lib/church-interest.ts` + `lib/churches-data.ts` | `localStorage` + hardcoded array | `fetch('/api/v1/churches')`; every row needs `verified_by` set before the "(example)" disclaimer comes off |
| `lib/ambassador-applications.ts` + `lib/campus-groups.ts` | `localStorage` + hardcoded array | `fetch('/api/v1/campus-groups')` / `fetch('/api/v1/ambassador-applications')` |
| `lib/bible-progress.ts` | `localStorage` | `fetch('/api/v1/me/bible-progress')`, same streak definition |
| `lib/badges.ts` | computed client-side from the above | stays computed client-side from the same API responses, or moves server-side into `GET /api/v1/me/achievements` once it needs to be tamper-proof |

This also requires the site to stop being a pure static export for these routes —
`output: "export"` in `next.config.js` has no server to run Route Handlers on. The
simplest path that keeps the rest of the site (the honest-demo pages that don't need
a backend) unchanged is deploying just these API routes as a small separate service
(e.g. a Cloudflare Worker or a minimal Node server) that the static site calls over
`fetch`, rather than converting the whole Next.js app off static export.

## What this doc does not cover

Payment processing for real seed purchases (`transactions`/webhook handling already
sketched in `02-database-schema.md`/`03-api-architecture.md`), content moderation
tooling beyond the single `status` field on testimonies, and rate limiting/abuse
prevention on public write endpoints (`03-api-architecture.md`'s existing conventions
apply here too, not repeated). None of this is built — this is the plan for when it
is.
