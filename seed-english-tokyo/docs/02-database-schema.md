# 02 · Database Schema (PostgreSQL)

Accessed via Prisma; shown here as SQL DDL for portability. UUID primary keys throughout;
`created_at`/`updated_at` timestamps omitted from prose but present on every table.

```sql
-- ==================== IDENTITY ====================

CREATE TABLE users (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id      TEXT UNIQUE NOT NULL,
  username           TEXT UNIQUE NOT NULL,
  display_name       TEXT NOT NULL,
  email              TEXT UNIQUE NOT NULL,
  email_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  phone              TEXT,
  phone_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  role               TEXT NOT NULL DEFAULT 'learner', -- learner|mentor|supporter|ambassador|admin
  avatar_url         TEXT,
  age_range          TEXT,          -- '18-21' | '22-25' | '26-30'
  home_location      TEXT,          -- nearest station slug
  english_level      TEXT,          -- CEFR A1-C2
  japanese_level     TEXT,          -- for non-Japanese users teaching/mentoring
  interests          TEXT[] DEFAULT '{}',
  availability       JSONB,         -- {days:[...], timeOfDay:[...]}
  preferred_meeting_style TEXT[],   -- online|voice|video|in_person
  bio                TEXT,
  streak_days        INT NOT NULL DEFAULT 0,
  streak_last_active DATE,
  xp                 INT NOT NULL DEFAULT 0,
  reputation_score    INT NOT NULL DEFAULT 0,
  trust_score         NUMERIC(4,1) NOT NULL DEFAULT 50.0, -- 0-100
  university_id       UUID REFERENCES universities(id),
  ambassador_referral_code TEXT UNIQUE,
  is_banned          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_badges (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_key    TEXT NOT NULL,   -- 'first_question_asked' | 'forest_builder' | ...
  awarded_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_key)
);

CREATE TABLE user_blocks (
  blocker_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id)
);

CREATE TABLE reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id   UUID NOT NULL REFERENCES users(id),
  target_type   TEXT NOT NULL,  -- user|event|question|answer
  target_id     UUID NOT NULL,
  reason        TEXT NOT NULL,
  details       TEXT,
  status        TEXT NOT NULL DEFAULT 'open', -- open|reviewing|resolved|dismissed
  resolved_by   UUID REFERENCES users(id),
  resolved_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== LOCATIONS / MAP ====================

CREATE TABLE stations (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               TEXT UNIQUE NOT NULL,   -- 'shibuya', 'shinjuku', ...
  name               TEXT NOT NULL,
  name_ja            TEXT NOT NULL,
  lat                DOUBLE PRECISION NOT NULL,
  lng                DOUBLE PRECISION NOT NULL,
  funding_raised_yen BIGINT NOT NULL DEFAULT 0,
  active_seed_count  INT NOT NULL DEFAULT 0,
  visits             INT NOT NULL DEFAULT 0,
  registrations      INT NOT NULL DEFAULT 0,
  active_learners    INT NOT NULL DEFAULT 0,
  growth_score       NUMERIC(5,2) NOT NULL DEFAULT 0,  -- 0-100
  forest_health_score NUMERIC(5,2) NOT NULL DEFAULT 0, -- 0-100
  growth_stage       TEXT NOT NULL DEFAULT 'bare_soil'  -- bare_soil|seedling|tree|forest
);

-- Daily snapshots power sparkline charts on /map/[station] and /admin
CREATE TABLE station_metrics_daily (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id    UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  metric_date   DATE NOT NULL,
  visits        INT NOT NULL DEFAULT 0,
  registrations INT NOT NULL DEFAULT 0,
  meetups       INT NOT NULL DEFAULT 0,
  revenue_yen   BIGINT NOT NULL DEFAULT 0,
  UNIQUE(station_id, metric_date)
);

-- ==================== SEEDS / CROWDFUNDING ====================

CREATE TABLE seed_tiers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key           TEXT UNIQUE NOT NULL,   -- seed|growth_seed|community_seed|forest_seed
  name          TEXT NOT NULL,
  emoji         TEXT NOT NULL,
  price_yen     INT NOT NULL,
  impact_weight NUMERIC(6,2) NOT NULL   -- multiplier used in attribution model
);

CREATE TABLE seeds (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seed_number        BIGINT GENERATED ALWAYS AS IDENTITY, -- human-facing "Seed #78422"
  owner_id           UUID NOT NULL REFERENCES users(id),
  tier_id            UUID NOT NULL REFERENCES seed_tiers(id),
  station_id         UUID NOT NULL REFERENCES stations(id),
  contribution_yen   INT NOT NULL,
  transaction_id     UUID NOT NULL REFERENCES transactions(id),
  status             TEXT NOT NULL DEFAULT 'growing', -- growing|thriving|dormant
  tree_progress_pct     NUMERIC(5,2) NOT NULL DEFAULT 0,   -- 0-100
  forest_contribution_pct NUMERIC(6,3) NOT NULL DEFAULT 0, -- share of station's total forest
  planted_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  certificate_url    TEXT
);

-- Tree/forest sponsorships bundle many seeds' worth of funding under one pledge
CREATE TABLE sponsorships (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id    UUID NOT NULL REFERENCES users(id),
  scope         TEXT NOT NULL,  -- tree|forest
  station_id    UUID REFERENCES stations(id),  -- null = city-wide forest sponsorship
  amount_yen    BIGINT NOT NULL,
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Attribution ledger: links real events (a signup, a meetup attendance) back to the
-- seed(s) whose funding is credited with making it possible. See 04-seed-tracking-system.md
CREATE TABLE seed_impact_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seed_id      UUID NOT NULL REFERENCES seeds(id) ON DELETE CASCADE,
  event_type   TEXT NOT NULL,  -- visit|registration|meetup_attended|learner_active
  event_ref_id UUID,           -- e.g. the user_id or event_id this credits
  weight       NUMERIC(6,3) NOT NULL DEFAULT 1,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  provider        TEXT NOT NULL,   -- stripe|paypay
  provider_ref    TEXT NOT NULL,   -- external charge/session id
  amount_yen      INT NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'JPY',
  status          TEXT NOT NULL,   -- pending|succeeded|failed|refunded
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== ASK ENGLISH ====================

CREATE TABLE question_categories (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug  TEXT UNIQUE NOT NULL, -- grammar|pronunciation|vocabulary|business|travel|conversation
  name  TEXT NOT NULL
);

CREATE TABLE questions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id     UUID NOT NULL REFERENCES users(id),
  category_id   UUID NOT NULL REFERENCES question_categories(id),
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  best_answer_id UUID,  -- FK added after answers table exists
  upvote_count  INT NOT NULL DEFAULT 0,
  view_count    INT NOT NULL DEFAULT 0,
  search_vector TSVECTOR,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX questions_search_idx ON questions USING GIN(search_vector);

CREATE TABLE answers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id   UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  author_id     UUID NOT NULL REFERENCES users(id),
  body          TEXT NOT NULL,
  upvote_count  INT NOT NULL DEFAULT 0,
  is_best       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE questions ADD CONSTRAINT fk_best_answer
  FOREIGN KEY (best_answer_id) REFERENCES answers(id);

CREATE TABLE votes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  target_type TEXT NOT NULL,   -- question|answer
  target_id   UUID NOT NULL,
  value       SMALLINT NOT NULL, -- +1 only (upvote-only system)
  UNIQUE(user_id, target_type, target_id)
);

CREATE TABLE saved_questions (
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  saved_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, question_id)
);

-- ==================== MATCHING ====================

CREATE TABLE partner_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id  UUID NOT NULL REFERENCES users(id),
  recipient_id  UUID NOT NULL REFERENCES users(id),
  meeting_type  TEXT NOT NULL,  -- online|voice|video|in_person
  message       TEXT,
  status        TEXT NOT NULL DEFAULT 'pending', -- pending|accepted|declined|expired
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE matches (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_request_id UUID NOT NULL REFERENCES partner_requests(id),
  user_a_id         UUID NOT NULL REFERENCES users(id),
  user_b_id         UUID NOT NULL REFERENCES users(id),
  meeting_type      TEXT NOT NULL,
  scheduled_at      TIMESTAMPTZ,
  location_text     TEXT,
  station_id        UUID REFERENCES stations(id),
  checkin_a_at      TIMESTAMPTZ,  -- in-person safety check-in timestamps
  checkin_b_at      TIMESTAMPTZ,
  status            TEXT NOT NULL DEFAULT 'scheduled', -- scheduled|completed|cancelled|no_show
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE match_reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id    UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewee_id UUID NOT NULL REFERENCES users(id),
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== EVENTS ====================

CREATE TABLE events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id        UUID NOT NULL REFERENCES users(id),
  station_id     UUID NOT NULL REFERENCES stations(id),
  type           TEXT NOT NULL, -- english_cafe|conversation_night|exchange|business_workshop|
                                 -- university_meetup|language_picnic|interview_practice
  title          TEXT NOT NULL,
  description    TEXT NOT NULL,
  starts_at      TIMESTAMPTZ NOT NULL,
  ends_at        TIMESTAMPTZ,
  location_text  TEXT NOT NULL,
  lat            DOUBLE PRECISION,
  lng            DOUBLE PRECISION,
  capacity       INT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'published', -- draft|published|cancelled|completed
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE event_rsvps (
  event_id   UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status     TEXT NOT NULL DEFAULT 'going', -- going|waitlisted|cancelled
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);

CREATE TABLE event_photos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES users(id),
  url        TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE event_reviews (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id),
  rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== UNIVERSITY / AMBASSADORS ====================

CREATE TABLE universities (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug  TEXT UNIQUE NOT NULL,  -- waseda|sophia|keio|meiji|rikkyo|hosei|aoyama_gakuin
  name  TEXT NOT NULL
);

CREATE TABLE ambassador_referrals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambassador_id UUID NOT NULL REFERENCES users(id),
  referred_user_id UUID NOT NULL REFERENCES users(id),
  university_id UUID NOT NULL REFERENCES universities(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== GAMIFICATION ====================

CREATE TABLE achievements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT NOT NULL,
  xp_reward   INT NOT NULL DEFAULT 0
);

-- ==================== AI FEATURES ====================

CREATE TABLE ai_conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id),
  tool       TEXT NOT NULL, -- grammar_assistant|conversation_coach|vocab_suggest|
                              -- writing_correction|pronunciation_feedback|mentor_chat
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ai_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL, -- user|assistant
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== INDEXES ====================

CREATE INDEX idx_seeds_owner ON seeds(owner_id);
CREATE INDEX idx_seeds_station ON seeds(station_id);
CREATE INDEX idx_impact_events_seed ON seed_impact_events(seed_id);
CREATE INDEX idx_events_station_starts ON events(station_id, starts_at);
CREATE INDEX idx_questions_category ON questions(category_id);
CREATE INDEX idx_matches_users ON matches(user_a_id, user_b_id);
```

## Notes

- `seeds.seed_number` is the human-facing ID shown as "Seed #78422" — an `IDENTITY`
  column rather than the UUID `id`, so numbers are sequential and shareable.
- `seed_impact_events` is an append-only ledger; growth-stage and progress percentages on
  `seeds` and `stations` are materialized/recomputed from it on a schedule (see
  `04-seed-tracking-system.md` for the attribution formula), not written directly by user
  actions — this keeps the impact math auditable and re-runnable.
- All monetary values stored in integer yen (no fractional yen) to avoid float rounding
  bugs in financial data.
