# CONTEXT.md

Session/continuity notes for this repository. Companion to `PROJECT.md` (architecture &
stack reference) — this file tracks *state*: what's done, what's in flight, what's next.

Last updated: 2026-08-06, from branch `Root` at commit `7d0a5e2`.

---

## Current Status

### Vamos (`/`, repo root)
- Recently rebuilt on top of Mexican Spanish Tutor's infrastructure (`63cb8a3`): gained
  `backup.js`, `distractors.js`, `feedback.js`, `tapword.js`, a full Duolingo-style
  Roadmap, Story Mode, Conversation Mode, and a rule-based mistake-correction Tutor —
  bringing it to feature parity with Mexican Spanish Tutor.
- Since then: a fixed bottom nav bar (`534259b`), audio in Grammar Lab plus a new
  Phrases screen (`3e52052`).
- **Complete**: dashboard, grammar (32 concepts), vocabulary (~300 words), dialogues,
  listening, speaking, reading, writing, cultural immersion, unified SRS review,
  achievements, PWA (manifest + service worker, `vamos-cache-v5`).
- **Partial**: no automated test suite (unlike Mexican Spanish Tutor, whose
  infrastructure it borrowed); the newly ported Roadmap/Story/Conversation/Tutor
  modules haven't had a dedicated regression pass the way Mexican Spanish Tutor's did.

### Mandarin Tutor (`/mandarin-tutor/`)
- Most recently touched app in the repo. Latest three commits: a Pinyin Lab + "Toolbox"
  for already-known words (`0f546bd`), removal of the app's one lingering traditional
  character (`f7b81fe`), and letting Daily Lesson chain multiple lessons in one sitting
  (`0c41a13`).
- **Complete**: dashboard, onboarding, unified Learn, Toolbox, Pinyin Lab, 22 sentence
  patterns, 10 dialogues, Roadmap, chainable Daily Lesson, Speaking/Immersion/Story
  modes, Sentence Mining, Correction Mode (12 patterns), unified Review, achievements,
  PWA (`mzh-cache-v18`, the highest cache-bump count of any app — reflects being the
  most actively iterated).
- **Partial**: no automated test suite; simplified-only content is a recent, deliberate
  correctness fix rather than a finished audit — worth spot-checking other data files
  for the same class of issue.

### Mexican Spanish Tutor (`/mexican-spanish-tutor/`)
- The most mature app: only one with an automated Playwright regression suite
  (`tests/run.mjs`, 8 groups — routes, vocabulary, pronunciation, roadmap, stories,
  storage, mobile, offline) and CI gating (`test-spanish.yml`) that blocks the whole
  monorepo's deploy on failure.
- Recent work: dedupe repeated Immersion questions (`c38fbf7`), inline mistake
  explanations wherever the user types (`7ada4d4`), tap-any-word everywhere (`9240970`),
  vocabulary expanded 70 → 1,000 words (`24022f1`).
- **Complete**: full curriculum (see PROJECT.md), PWA (`mxes-cache-v11`), test suite,
  CI gate.
- **Partial**: none identified — this app is the reference implementation the others
  are being ported toward (see Vamos's `63cb8a3`).
- `node_modules` not installed in this checkout — `npm install` + `npx playwright
  install chromium` needed before `npm test` will run here.

### Japanese Speaking Lab (`/japanese-speaking/`)
- Quietest app recently — last touched 2026-08-02 (routing/storage/view fixes across
  connectors, grammar, review, vocabulary in `65891eb`).
- **Complete**: Review Session (SM-2 SRS), Guide, Connector Lab (~40), Grammar Ladder
  (44), Vocabulary in Sentences (3,144 words), Level Ladder, Paragraph Practice (live
  transcription), Shadowing, 12-Week Roadmap, Self-Assessment, Settings, click-any-word
  lookup (`js/core/wordLookup.js`), PWA (`sw.js`, `jp-speaking-` + version).
- **Partial**: no automated test suite; assumes ACTFL Intermediate High as a starting
  point rather than teaching from zero, so it's structurally different from the other
  three (not a gap, but worth remembering when comparing feature parity).

### Seed English Tokyo (`/seed-english-tokyo/`)
- **This app has changed direction since `PROJECT.md` was written.** `PROJECT.md`
  describes it as a general English-practice donor/community platform for Tokyo. As of
  `4de25be` ("Pivot Seed English Tokyo into Seed Tokyo, a gospel outreach platform"),
  it has been repositioned as a Christian gospel-outreach and discipleship platform.
  The live nav (`components/nav.tsx`) now reads: Home, Explore Faith, Bible, Prayer,
  Ask a Question, Connect With Someone, Find A Church, Stories, Bible Studies, Tokyo
  Map, My Seeds, Campus Ministries, Volunteer, Team View, Mission, Outreach Ads,
  Simulate — with the tagline "東京に福音の種を" ("planting gospel seeds in Tokyo").
  New route groups exist for `bible/`, `churches/`, `mission/`, `prayer/`,
  `partners/`, `questions/`, `stories/`, `team/`, `universities/`, `volunteer/`,
  `advertise/`, `simulate/`.
- Three new spec docs were added to support the pivot: `17-gospel-pivot.md`,
  `18-mission-and-community-expansion.md`, `19-mission-backend-architecture.md`
  (design-only, explicitly marked "nothing in this doc is implemented").
- `17-gospel-pivot.md` records a **deliberate safety decision**: the spec's Prayer
  Request Center and Human Connection Center originally called for real-time
  "urgent need" escalation and volunteer routing; the team scoped that down for a
  pure-frontend/localStorage build rather than shipping something that looks like a
  live crisis-response system without a real backend or on-call team behind it. This
  reasoning should be preserved if that feature is ever built out for real.
- **Complete**: front-end scaffold across all the routes above, rendering realistic
  mock data (`lib/mock-data.ts`, `lib/prayer-requests.ts`, `lib/connection-requests.ts`,
  `lib/volunteer-applications.ts`, `lib/church-interest.ts`,
  `lib/ambassador-applications.ts`, `lib/testimonies.ts`, `lib/bible-progress.ts`,
  etc.), all built with narrow typed read/write interfaces specifically so a real
  backend can be swapped in later without a rewrite.
- **Partial**: 18-doc spec (now 19 docs) is comprehensive; only the frontend scaffold
  exists. No database, auth, payments, or map are wired up.
- `node_modules` not installed in this checkout — needed before `npm run build` /
  `lint` / `typecheck` will work here.
- **Not started**: everything in `19-mission-backend-architecture.md` (Postgres schema,
  API endpoints for prayer/connection/volunteer/church-interest data) — it exists only
  as a target design so the current `localStorage`-backed `lib/*.ts` functions can be
  swapped for `fetch` calls later without touching call sites.

---

## Major Features

**Vamos** — Dashboard · Grammar Lab (32) · Vocabulary (~300) · Dialogue Academy (~28) ·
Listening · Speaking · Reading · Writing · Phrases · Cultural Immersion (33) · Roadmap ·
Story Mode · Conversation Mode · rule-based Tutor · unified SRS Review · Achievements ·
bottom nav bar · PWA offline.

**Mandarin Tutor** — Dashboard · Onboarding · unified Learn · Toolbox · Pinyin Lab ·
Sentence Patterns (22) · Dialogues (10) · Roadmap · chainable Daily Lesson (9-part) ·
Speaking/Immersion/Story modes · Sentence Mining · Correction Mode (12 patterns) ·
unified Review · Achievements · PWA offline.

**Mexican Spanish Tutor** — Dashboard (ACTFL estimate) · ACTFL Roadmap (16-unit) ·
Vocabulario (1,000 words) · Gramática (20) · Diálogos (16) · Daily Lesson (9-part) ·
Roleplay · Conversation Mode (immersion dial) · Immersion Mode · Story Mode (all 7 ACTFL
levels) · OPI Practice · Writing/Correction Coach (13 patterns) · tap-any-word
everywhere · Review · Achievements · PWA offline + Playwright test suite gating deploy.

**Japanese Speaking Lab** — Review Session (SM-2 SRS) · Guide · Connector Lab (~40) ·
Grammar Ladder (44) · Vocabulary in Sentences (3,144, JLPT N3/N2) · Level Ladder ·
Paragraph Practice (live transcription, 6 speaking functions) · Shadowing · 12-Week
Roadmap · Self-Assessment (7-dimension rubric) · Settings · click-any-word lookup
(shared tokenizer/dictionary) · PWA offline.

**Seed Tokyo** (formerly Seed English Tokyo) — Landing/Explore Faith · Bible · Prayer
(request center, scoped down from the spec's real-time escalation design for safety) ·
Ask a Question · Connect With Someone · Find A Church · Stories · Bible Studies/Events ·
Tokyo Impact Map · My Seeds · Campus Ministries (Universities) · Volunteer · Team View
(internal triage) · Mission · Outreach Ads · Simulate — all against mock/localStorage
data, specified for a real Postgres/Clerk/Stripe-PayPay/Mapbox backend that is not yet
built.

---

## Known Issues

- **`PROJECT.md` is stale on Seed English Tokyo.** It still describes the app by its
  pre-pivot premise (general English-practice donor platform) and its "Target users" /
  "Main business purpose" sections don't reflect the gospel-outreach pivot (`4de25be`)
  or docs 17-19. Needs a rewrite pass next time PROJECT.md is touched.
- **Test coverage gap.** Vamos, Mandarin Tutor, and Japanese Speaking Lab have zero
  automated regression coverage; Mexican Spanish Tutor is the only CI-gated app. Vamos
  in particular just absorbed a large amount of ported code (`63cb8a3`) with no
  equivalent test suite to catch regressions the way Mexican Spanish Tutor's did for
  its own past bugs (e.g., the iOS state-loss bug fixed in `296cb9f`).
- **`node_modules` not installed** for either `mexican-spanish-tutor` or
  `seed-english-tokyo/web` in this checkout — `npm test`, `npm run build`, `lint`, and
  `typecheck` will all fail until `npm install` is run in each.
- **Duplicated core modules.** `storage.js`, `srs.js`, `router.js`, etc. are
  independently maintained per app by design (see PROJECT.md's Important Technical
  Decisions) — this is an intentional tradeoff, not a bug, but it means a fix to one
  app's storage/merge logic (e.g., the iOS backgrounding fix in Mandarin Tutor) does
  not automatically propagate to the others and should be checked for elsewhere when
  found.
- **Seed English Tokyo backend is entirely unbuilt.** No Postgres/Prisma, no Clerk
  auth, no Stripe/PayPay, no Mapbox, no live `/api/v1/...` routes — `19-mission-backend-
  architecture.md` is a target design only. All "Team View" triage pages currently read
  from `localStorage`, meaning submitted prayer/connection/volunteer requests are only
  visible on the submitting device, not to any real team.
- **Service worker cache versions differ widely across apps** (`vamos-cache-v5`,
  `mxes-cache-v11`, `mzh-cache-v18`, `jp-speaking-<version>`) — expected given
  independent iteration speed, but a reminder that *every* deploy touching cached files
  in an app must bump that app's own `CACHE_NAME` (documented in PROJECT.md; enforced
  only by discipline, not tooling, except indirectly via Mexican Spanish Tutor's
  `offline` test group).

---

## Recent Work

Most active in the last several days of history (2026-08-02 → 2026-08-06):

1. **Mandarin Tutor** (busiest app right now): Pinyin Lab + Toolbox, traditional-
   character cleanup, chainable Daily Lesson.
2. **Vamos**: ported Mexican Spanish Tutor's infrastructure wholesale (backup,
   distractors, feedback, tapword, Roadmap, Story, Conversation, Tutor), then added a
   bottom nav bar and Grammar Lab audio/Phrases.
3. **Mexican Spanish Tutor**: Immersion question-repeat fix, inline mistake
   explanations, tap-any-word everywhere — the app Vamos is now mirroring.
4. **Japanese Speaking Lab**: last touched 2026-08-02, smaller routing/storage/view
   fixes across connectors, grammar, review, and vocabulary.
5. **Seed English Tokyo**: last touched 2026-07-31 — the gospel pivot (nav rewrite,
   new `bible/`, `churches/`, `mission/`, `stories/`, `team/`, `universities/`,
   `volunteer/` routes) plus the backend architecture design doc.
6. **Repo root**: `PROJECT.md` added 2026-08-06 (`7d0a5e2`) as the first full
   monorepo-level documentation pass.

---

## Next Priorities

1. **Update `PROJECT.md`** to reflect the Seed Tokyo gospel pivot — target
   users, business purpose, and feature list are all currently describing the
   pre-pivot product.
2. **Give Vamos a regression suite**, ideally adapted from Mexican Spanish Tutor's
   `tests/run.mjs`, now that it carries the same amount of surface area (Roadmap,
   Story, Conversation, Tutor) but none of the safety net.
3. **Audit Vamos's ported code** for app-specific correctness (content leveling,
   glossary/mistake-pattern data actually matching Spain Spanish vs. the Mexican
   Spanish content it was copied from) — a straight infrastructure port risks
   leaving Mexican-Spanish-specific data or copy behind.
4. **Decide whether Japanese Speaking Lab and Mandarin Tutor get their own test
   suites**, or whether Mexican Spanish Tutor's CI gate should be generalized into a
   shared, parameterized suite runnable against any of the four apps.
5. **Seed Tokyo**: if the Team View triage pages are meant to be used for real before a
   backend exists, flag that submissions are currently device-local only (not visible
   to an actual team) — likely worth a banner in the UI rather than a silent gap.
6. **Spot-check other apps' data files** for the same class of issue Mandarin Tutor
   just fixed (`f7b81fe`, a stray traditional character) — e.g., confirm Mexican
   Spanish Tutor's vocabulary expansion (70 → 1,000 words, `24022f1`) didn't introduce
   similar one-off inconsistencies.

---

## Claude Session Summary

### Important decisions made across the project
- **Vamos was deliberately re-platformed onto Mexican Spanish Tutor's code**
  (`63cb8a3`, "port Mexican Spanish tutor infrastructure + full Duolingo-style
  Roadmap") rather than growing its own Roadmap/Story/Conversation/Tutor
  independently — Mexican Spanish Tutor is being treated as the reference
  implementation for the other three apps to converge toward, feature-wise.
- **Seed English Tokyo was intentionally pivoted** from a general English-practice
  donor platform into a gospel outreach and discipleship platform for Tokyo
  (`4de25be`), per explicit request captured in `17-gospel-pivot.md`. This was a
  product-direction decision, not a refactor — treat the pre-pivot description in
  `PROJECT.md` as superseded.
- **A safety-motivated scope-down was made on the gospel pivot's Prayer/Connection
  features**: the full spec describes real-time urgent-need escalation and volunteer
  routing; the team explicitly chose not to build that as a pure-frontend/localStorage
  feature since it would look like a live crisis-response system without one behind it.
  If a real backend is ever built (per `19-mission-backend-architecture.md`), this
  safety reasoning should be revisited deliberately, not silently dropped.
- **Mexican Spanish Tutor's regression suite is a whole-monorepo deploy gate** by
  design (`38b3b49`) — a single app's tests block all five apps' deploy. This was a
  conscious choice (see PROJECT.md's Important Technical Decisions) to give the
  backend-less apps *some* server-side quality gate, not an accident of CI wiring.
- **`19-mission-backend-architecture.md` was written specifically so the existing
  frontend wouldn't need a rewrite later** — every `lib/*.ts` file doing
  `localStorage.getItem`/`setItem` already exposes a narrow typed interface designed to
  have its internals swapped for `fetch` calls without touching call sites. Preserve
  that interface shape if/when the real backend is built.

### Architecture rules that should be preserved
- **Zero-build, zero-dependency, no-backend** for all four language apps — do not
  introduce a bundler, framework, or third-party runtime dependency into Vamos,
  Mandarin Tutor, Mexican Spanish Tutor, or Japanese Speaking Lab.
- **Independent core modules per app** (`storage.js`, `srs.js`, `router.js`, `audio.js`,
  `gamification.js`, `ui.js`, `onboarding.js`) — do not extract these into a shared
  package; each app evolves and deploys independently by design.
- **Single-blob `localStorage` state per app**, deep-merged on load via
  `deepMerge(defaultState(), savedState)` — new fields go into `defaultState()`, never
  as a separate storage key.
- **Bump each app's own `service-worker.js`/`sw.js` `CACHE_NAME`** on every deploy that
  touches that app's cached files — stale-cache bugs have happened before (see
  `74647fa`, `296cb9f`) and are the specific failure mode this guards against.
- **Hash-based routing** (`#/route`), not the History API — required for the apps to
  work from a plain static file server with no server-side rewrite rules.
- **Mexican Spanish Tutor's `tests/run.mjs` is the deploy gate for the entire site** —
  do not weaken or skip it without updating `test-spanish.yml`/`deploy-pages.yml`
  deliberately; it is intentionally load-bearing beyond its own app.
- **Seed English Tokyo stays docs-first, mock-data-first** — do not wire up a real
  database/auth/payments/map without an explicit decision to do so; the current scaffold
  is intentionally deferred until product direction is validated, per PROJECT.md's
  Important Technical Decisions.
- **Seed Tokyo's `lib/*.ts` narrow read/write interfaces are a deliberate seam** for a
  future backend swap — when touching `prayer-requests.ts`, `connection-requests.ts`,
  `volunteer-applications.ts`, `church-interest.ts`, `ambassador-applications.ts`,
  `testimonies.ts`, or `bible-progress.ts`, preserve the function signatures even if the
  internals change.
