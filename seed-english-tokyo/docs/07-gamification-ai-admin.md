# 07 · Gamification, AI Features, Admin Dashboard

## 1. Gamification

### Achievements (launch set)
| Key | Name | Trigger |
|---|---|---|
| `first_question_asked` | First Question Asked | Post your first question |
| `first_meetup_joined` | First Meetup Joined | Check in to any event or match |
| `first_friend_made` | First Friend Made | Complete a match with a mutual positive review |
| `first_event_hosted` | Event Host | Publish and complete your first event |
| `streak_100` | 100 Day Learning Streak | 100 consecutive active days |
| `forest_builder` | Forest Builder | Own 10+ seeds or sponsor a tree |
| `tokyo_champion` | Tokyo Champion | Top-10 trust score + activity at one station |
| `global_connector` | Global Connector | Complete matches with partners from 5+ different
  home stations |

Badges are illustrated in the forest/nature visual language (a sprout, a lantern, a torii
gate outline, etc. — see `08-design-system.md`) and are collectible on `/profile/[username]`
and `/achievements`.

### Streaks & XP
Daily streak increments on any qualifying action (practice session, question asked/
answered, event check-in). XP is awarded per action type and feeds a visible level
(unrelated to English proficiency level — this is an engagement level, kept explicitly
separate from `english_level` so learners never feel "graded" by it).

### Community Reputation Score
Separate from Trust Score (which is about safety) — Reputation reflects teaching/helping
value: upvoted answers, best-answer selections, positive match reviews as a mentor.
Displayed on profile as a simple numeric badge, used to surface top mentors in `/partners`
and in Ask English answer ordering.

## 2. AI features

All AI tools share one moderation + rate-limit layer and log to `ai_conversations` /
`ai_messages` for continuity and abuse monitoring.

| Tool | Input → Output |
|---|---|
| English Grammar Assistant | A sentence/paragraph → corrected version + rule explanation |
| English Conversation Coach | Chat turn → in-character reply + gentle inline corrections |
| Vocabulary Suggestions | A topic or a piece of writing → 5–10 relevant words with example
  sentences at the user's CEFR level |
| Writing Correction Tool | A paragraph → corrected version, error categories, and a
  before/after diff view |
| Pronunciation Feedback | Recorded audio clip → phoneme-level feedback (uses a
  speech-to-phoneme model) with a re-record loop |
| AI Mentor Chat | Open-ended chat → supportive, level-appropriate conversation partner,
  explicitly positioned as a *supplement* to human practice, not a replacement — every AI
  surface nudges toward "Try this with a real partner" once a user is warmed up |

Positioning: AI features close the gap between practice sessions (something to do at 11pm
when no human partner is online), they never gate or replace the human community, which
is the actual product.

## 3. Admin / analytics dashboard (`/admin`)

### Revenue & funding
Seed Revenue (by tier), Monthly Revenue (trend), Sponsorships, Refund rate.

### Growth
Registrations (daily/weekly/monthly, by channel), Active Learners (DAU/WAU/MAU),
Active Mentors, retention curves (D1/D7/D30).

### Community health
Events Created, Attendance Rate (RSVP → checked-in conversion), average event rating,
report volume + resolution time, average Trust Score.

### Geography
Top Locations (by registrations and by funding), Highest-Converting Stations (visits →
registrations rate), Growth Score / Forest Health Score leaderboard — mirrors `/map` but
with raw numbers and CSV export for investor/board reporting.

### University
Registrations per university, active-learner retention per university, ambassador
leaderboard, referral conversion rate.

### Unit economics
- **Cost Per Learner (CPL)** = total acquisition spend / new registered learners
- **Cost Per Signup (CPS)** = total acquisition spend / total signups (learners + supporters)
- **Cost Per Attendee (CPA)** = total acquisition + event spend / total event check-ins

All three trended over time and segmented by channel (organic, campus ambassador, paid,
referral) so the admin dashboard doubles as the investor reporting pack described in
`09-growth-monetization-strategy.md`.

### Access & tooling
Role-gated to `role = 'admin'`; built on PostHog for event-level analytics (funnels,
retention, session replay for UX debugging) with a Postgres-backed summary API
(`/api/v1/admin/*`) powering the custom dashboards above that PostHog's generic UI can't
express (e.g. the seed attribution and forest-health scores).
