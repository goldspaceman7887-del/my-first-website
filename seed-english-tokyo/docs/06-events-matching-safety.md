# 06 · Events, Partner Matching, Safety, University Outreach

## 1. Events system

### Event types
English Cafe · Conversation Night · International Exchange Event · Business English
Workshop · University Meetup · Language Exchange Picnic · Interview Practice.

### Event page contents
Date/time, location (Mapbox picker at creation, static map on the page), capacity vs.
current RSVPs, attendee list (avatars, respecting privacy settings), host info + trust
score, RSVP button (Going/Waitlist once full), reviews (post-event, rating + comment),
photo gallery (uploaded by host/attendees post-event).

### Lifecycle
`draft → published → (starts_at reached) → completed` or `cancelled`. On `completed`:
attendees who checked in are prompted for a review; host's `events_hosted` stat and the
station's `growth_score` recompute; photos unlock for upload for 72 hours.

### Check-in
QR code or in-app "I'm here" button at the venue (geofenced to within ~150m of the
event's lat/lng when GPS is available, soft-required — a manual host override exists for
indoor venues with poor GPS). Check-in is what makes the meetup count toward: seed impact
attribution, streaks, achievements, and trust score.

## 2. Partner matching

### Inputs considered
Location (home station / willing-to-travel radius), availability (day/time blocks),
interests, language goals (conversation fluency, business English, exam prep, travel),
skill level (CEFR), age group, preferred meeting style.

### Matching approach
- **MVP**: filterable/sortable search (`/partners`) — deterministic, explainable, no
  black box. Ranked by a simple weighted score: shared interests (40%), availability
  overlap (25%), location proximity (20%), complementary goals — e.g. a native-level
  mentor matched to a beginner learner (15%).
- **V2**: opt-in "Smart Match" daily suggestions (a small recommendation job, still using
  the same transparent scoring function, just proactively surfaced) — deliberately not a
  swipe/dating-style mechanic; framed as study-buddy matching, not romantic.

### Meeting types
Online (chat), voice call, video call, in-person. In-person unlocks the safety flow
below.

## 3. Safety system

Required before the "Confirm in-person meetup" action is available to a user:
- Verified email (Clerk)
- Verified phone (SMS OTP via Clerk)
- Accepted community guidelines (versioned acceptance, re-prompted on major revisions)

Ongoing safety mechanics:
- **Profile ratings** — 1–5 star reviews after every completed match/event, visible in
  aggregate on a profile (`match_reviews`, `event_reviews`).
- **Report system** — report any user/event/question (`reports` table) with a reason and
  free-text detail; triaged in `/admin/reports`.
- **Block** — mutual invisibility: blocked users can't message, match-request, or see
  each other's profile/RSVPs.
- **Meetup check-in** — both parties confirm arrival in-app; a no-show is logged and
  affects trust score without requiring the other party to file a formal report.
- **Community Trust Score** — 0–100, starts at 50, moves with: verified contact info
  (+), completed meetups with good reviews (+), no-shows (−), upheld reports against them
  (−), account age and streak consistency (+, small weight). Surfaced as a `TrustScoreMeter`
  on profiles above a minimum threshold of visible history (avoids shaming brand-new
  users) and used to soft-gate in-person visibility — very low trust scores drop a user's
  in-person requests into a manual review queue rather than auto-blocking, to keep the
  system fair and appealable.

First in-person meetings are nudged (not forced) toward public, well-lit, well-known spots
— the event system's own venues are suggested as a safer default over ad hoc 1:1 meetups
for first-time matches.

## 4. University outreach — Campus Ambassador Program

### Target universities
Waseda, Sophia, Keio, Meiji, Rikkyo, Hosei, Aoyama Gakuin (see `universities` table,
designed to add more without a migration).

### Ambassador flow
`/campus/apply` (short form: university, year, why) → manual/admin approval → issued a
unique `ambassador_referral_code` → dashboard at `/campus/dashboard` shows: referrals
sent, signups converted, meetups attended by referrals, and campus rank.

### Campus growth metrics tracked
Registrations per university, active-learner retention per university, events hosted on
or near campus, question-library engagement per university.

### University leaderboard (`/campus/leaderboard`)
Ranks universities by a blended score (registrations 40%, active learners 40%, events
hosted 20%) refreshed daily — designed to be screenshot-shareable and to drive
inter-university rivalry (a growth lever, detailed further in
`09-growth-monetization-strategy.md`).

### Ambassador incentives
Non-cash by default to keep the program compliant and mission-aligned: exclusive
ambassador badge, early access to new features, a standing invite to a quarterly
in-person ambassador meetup, and — at high referral volume — the ability to name/host a
flagship campus event with platform-funded budget (paid for by seeds tagged to that
university's home station).
