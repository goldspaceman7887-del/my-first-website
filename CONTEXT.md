# CONTEXT.md

## Repository Status

This repository is a monorepo that deploys five independent sub-projects to one GitHub Pages site (`my-first-website`):

| App | Path | Status |
|---|---|---|
| Vamos | `/` (repo root) | Live, feature-complete |
| Mandarin Tutor | `/mandarin-tutor/` | Live, feature-complete |
| Mexican Spanish Tutor | `/mexican-spanish-tutor/` | Live, feature-complete, only app with automated tests |
| Japanese Speaking Lab | `/japanese-speaking/` | Live, feature-complete |
| Seed English Tokyo (now "Seed Tokyo") | `/seed-english-tokyo/` | Spec + Next.js scaffold only, no real backend, mid-pivot |

The four language apps are zero-build, zero-dependency vanilla JS/HTML/CSS PWAs with no server and no accounts — all progress lives in a per-app `localStorage` blob. They share one deploy pipeline (`.github/workflows/deploy-pages.yml`) gated on Mexican Spanish Tutor's Playwright regression suite: if that suite fails, none of the five apps deploy. Seed English Tokyo is the only sub-project with a real build step (Next.js static export); its build is allowed to fail without blocking the other four (`continue-on-error`).

**The single most important fact for understanding this repo right now**: Seed English Tokyo underwent a full product pivot (commit `4de25be`, "Pivot Seed English Tokyo into Seed Tokyo, a gospel outreach platform") from a *free English-practice community platform* into *Seed Tokyo, a gospel outreach and discipleship platform*. `PROJECT.md` at the repo root was written after this pivot but still describes the old English-learning framing — it is stale on this one point. See **Notes For Future Claude Code Sessions** below before touching `seed-english-tokyo/`.

---

## App Status

### Vamos (`/`, Peninsular Spanish)

**Purpose**: Teaches Spain Spanish from A0 to ACTFL Advanced Low.

**Current state**: Live, feature-complete, recently restyled around a Duolingo-like path (hearts, chunky green UI) and given Mexican Spanish Tutor's roadmap infrastructure.

**Completed features**: Dashboard, Grammar Lab (32 concepts, mixed exercise types), Vocabulary Trainer (~300 words, taught inside example sentences), Dialogue Academy (~28 dialogues, 12-part structure), Listening (slow/natural/fast, dictation), Speaking (shadowing, role-play), Reading (10 passages), Writing (15 prompts, heuristic feedback), Cultural Immersion (33 topics), a unified SRS Review Dashboard, a rule-based AI Tutor (grammar Q&A, mistake correction, role-play), Achievements, a Phrases screen, audio in Grammar Lab, a fixed bottom nav bar, PWA offline support.

**Features in progress**: Its Duolingo-style Roadmap was ported over from Mexican Spanish Tutor recently and may not yet have the same depth (unit count, checkpoint tests) as the source app.

**Missing functionality**: No automated test suite. No accounts/cloud sync. No documented iOS-Safari-backgrounding data-loss protection (Mandarin Tutor's shadow-backup pattern isn't confirmed here).

### Mandarin Tutor (`/mandarin-tutor/`)

**Purpose**: Teaches Mandarin Chinese from beginner to conversational fluency.

**Current state**: Live, feature-complete, and the most feature-dense of the four apps by number of distinct study modes. Recently consolidated (Characters + Vocabulary merged into one Learn section) and had a real iOS data-loss bug fixed.

**Completed features**: Dashboard, Onboarding (self-reported starting knowledge), unified Learn (pick a batch size, learn new characters/words, practice in sentence context), Toolbox (mark known items so they stop being taught without leaving the SRS), Pinyin Lab (tones, initials, finals, listen-and-guess quiz), Sentence Patterns (22), Dialogues (10), Roadmap (skip-ahead, unit reviews, ACTFL/HSK tracks), Daily Lesson (9-part, chainable across multiple lessons in one sitting), Speaking Mode (role-play), Immersion Mode, Story Mode, Sentence Mining (paste-your-own-text extraction), Correction Mode (12 mistake patterns), unified Review, Achievements, PWA offline support, a shadow backup key that flushes on `visibilitychange`/`pagehide` to survive iOS Safari backgrounding, simplified-characters-only content (the last traditional character was removed).

**Features in progress**: Character bank (174 entries) and vocabulary bank (140+ entries) are both explicitly described in-repo as still growing toward full HSK 4 coverage.

**Missing functionality**: No automated test suite (manual verification only). No accounts/cloud sync. Content banks are much smaller than Japanese Speaking Lab's.

### Mexican Spanish Tutor (`/mexican-spanish-tutor/`)

**Purpose**: Teaches Mexican Spanish from Novice to ACTFL Advanced Low.

**Current state**: Live, feature-complete, and the only app in the repo with automated tests — its Playwright suite gates deploys for the entire site. Recently overhauled around assessment and immersion.

**Completed features**: Dashboard with an ACTFL level estimate, ACTFL Roadmap (Can-Do checklist + 16-unit Duolingo-style path), Vocabulario (~70–100+ words with register/slang notes), Gramática (20 patterns), Diálogos (16), Daily Lesson (9-part, chainable), Roleplay Mode, Conversation Mode (immersion dial), Immersion Mode, Story Mode (tap-any-word definitions, now available on every screen, not just stories), OPI Practice (simulated oral proficiency interview, heuristic ACTFL scoring), Writing/Correction Coach (13 mistake patterns, explains mistakes wherever you type), unified Review, Achievements, PWA offline support, an automated Playwright regression suite (routes, data integrity, pronunciation/IPA, roadmap structure, story coverage, storage persistence, mobile layout, offline mode).

**Features in progress**: Recently added Scenario Mode and an ACTFL self-assessment as part of an onboarding overhaul (PR #8); roadmap quizzes now explain grammar-drill mistakes instead of just showing the answer (PR #9) — both are recent enough that follow-on polish is plausible.

**Missing functionality**: No accounts/cloud sync. Vocabulary and dialogue banks are smaller than Mandarin Tutor's or Japanese Speaking Lab's.

### Japanese Speaking Lab (`/japanese-speaking/`)

**Purpose**: Japanese *speaking* practice for learners who already have ACTFL Intermediate High, pushing toward Advanced High (paragraph-level fluency) — not a beginner app.

**Current state**: Live, feature-complete, and holds by far the largest content bank in the repo (3,000+ vocabulary entries). Recently added exact session resume.

**Completed features**: Review Session (Anki-style SRS across connectors/grammar/vocabulary, always in full sentences), Guide, Connector Lab (~40 discourse connectors), Grammar Ladder (44 structures, IH→AH), Vocabulary in Sentences (3,000+ JLPT N3/N2 words, one-at-a-time SRS flip decks), Level Ladder (10 prompts × 4 ACTFL sublevels), Paragraph Practice (6 speaking functions, live transcription via Speech Recognition), Shadowing, a 12-Week Roadmap, Self-Assessment (7-dimension ACTFL rubric), Settings (voice selection, JSON export/import), click-any-word lookup with real furigana rendering (shared tokenizer/dictionary), exact resume (route/tab/in-progress queue survive a reload), full offline PWA support.

**Features in progress**: None documented as actively mid-build; the app reads as a stable, mature feature set relative to the other three.

**Missing functionality**: No automated test suite. No true beginner path (assumes Intermediate High already). No dialogue or story-mode content type — practice is sentence-level rather than conversational scenes. No accounts/cloud sync.

### Seed English Tokyo / Seed Tokyo (`/seed-english-tokyo/`)

**Purpose (as of the most recent pivot)**: No longer an English-learning platform. It is now **"Seed Tokyo,"** a gospel outreach and discipleship platform for Japanese people — prayer requests, human connection, Bible reading, church connection, testimonies, and a "Your Next Step" action center — funded transparently by supporters who buy trackable "Seeds" (the seed → sprout → tree → forest metaphor was kept unchanged and remapped onto the Parable of the Sower). `docs/17-gospel-pivot.md` and `docs/18-mission-and-community-expansion.md` are the authoritative record of this change; `PROJECT.md` and the top-level `seed-english-tokyo/README.md` still describe the pre-pivot English-learning framing and have not been updated.

**Current state**: A large product/technical specification (19 numbered docs) paired with a Next.js 14 + TypeScript + Tailwind front-end scaffold that renders entirely against mock data and `localStorage` — there is no database, authentication, or payment integration wired up anywhere.

**Completed features**: Rebrand throughout the app shell and page metadata ("Seed English Tokyo" → "Seed Tokyo"); a site-wide "Your Next Step" action center (homepage + persistent footer widget); `/prayer` Prayer Request Center (lite, localStorage-only, always shows real crisis-line resources — TELL Japan Lifeline, よりそいホットライン); `/partners` Human Connection Center (lite, pick chat/video/in-person, localStorage-only); `/explore` Explore Jesus Center (14 topic cards linking into `/questions`, plus a real outbound link to bible.com); `/churches` Local Church Connection directory (6 clearly-labeled example churches, filterable); `/stories` Stories & Testimony Engine (curated fictional testimonies + a local-only submission form); `/bible` a real 21-day Gospel-of-John reading plan with date-based progress/streaks and a rotating real KJV verse-of-the-day; `/mission` briefing, achievements, and live counters; `/team/*` triage views split by request type; the pre-pivot seed planting/funding flow, Tokyo impact map, Growth Simulator, and university/campus-ambassador pages (recopied to gospel-outreach language, data shapes unchanged); a target backend architecture doc (`docs/19`) scoped specifically to the pivot's new features.

**Features in progress**: `docs/19-mission-backend-architecture.md` is a completed *design*, explicitly "not yet built" — every `lib/*.ts` file backing the new features (`prayer-requests.ts`, `connection-requests.ts`, `volunteer-applications.ts`, `church-interest.ts`, `ambassador-applications.ts`, `testimonies.ts`, `bible-progress.ts`) was deliberately written with a narrow read/write interface so a real API can be swapped in later without touching page components.

**Missing functionality**: No real backend of any kind (no Postgres/Prisma, no Clerk auth, no Stripe/PayPay, no live Mapbox map, no Redis rate limiting). Three specific things are documented as **permanently** out of scope for a static/backend-less site, not merely unbuilt: real-time video calling to an actual volunteer/pastor, real multi-user auth with visitor/volunteer/leader/admin roles, and real routing of urgent prayer/connection requests to an actual on-call team — building convincing UI for any of these without real infrastructure behind them was explicitly judged too risky (someone in genuine crisis could mistake the demo for real support).

---

## Shared Systems

- **Per-app core modules**, deliberately duplicated rather than shared, under `<app>/js/core/`: `storage.js` (single-blob `localStorage` store with `deepMerge` migration and a `subscribe()` pub/sub), `srs.js` (SM-2-inspired spaced repetition, each app tuning its own interval ladder), `router.js` (minimal hash-based SPA router), `audio.js` (`speechSynthesis`/`speechRecognition` wrappers), `ui.js` (DOM helpers), and `gamification.js`/`onboarding.js` where present. The four apps' module sets aren't identical — e.g. Vamos and Mexican Spanish Tutor both have `hearts.js`, `feedback.js`, `distractors.js`, and `backup.js`; Mandarin Tutor has `lookup.js` and `pinyin.js` instead; Japanese Speaking Lab has `wordLookup.js` and `pathGeometry.js` instead — so "shared" here means shared *pattern*, not shared *code*. A bug fixed in one app's copy (e.g. Mandarin Tutor's iOS backgrounding fix) is not automatically fixed in the others.
- **Single-blob `localStorage` state** with `deepMerge(defaultState(), savedState)` on load is the state-management approach in all four language apps, letting new schema fields backfill for existing users without a migration script.
- **Web Speech API** (`SpeechSynthesis` + `SpeechRecognition`) is the only external integration any live app uses — no network calls, no API keys, best supported on Chrome/Edge, every app degrades gracefully elsewhere.
- **PWA offline support** (hand-written service worker + web app manifest) is present in all four language apps, each with its own versioned `CACHE_NAME` that must be bumped manually on deploys touching cached files.
- **One CI gate for the whole site**: `.github/workflows/deploy-pages.yml` runs Mexican Spanish Tutor's Playwright suite (`test-spanish` job) before anything is built, and blocks all five apps' deploy if it fails — the only automated verification protecting Vamos, Mandarin Tutor, and Japanese Speaking Lab in practice.
- **One combined static site**: the workflow assembles `_site/` by copying each static app's files as-is and, separately, copying Seed English Tokyo's Next.js static export in only if that build succeeds (`continue-on-error`).

---

## Known Issues

- **`PROJECT.md` is stale on Seed English Tokyo.** It still describes the app as an English-practice platform; the app was pivoted to "Seed Tokyo," a gospel outreach platform, before `PROJECT.md` was last committed. Anyone relying on `PROJECT.md` alone for that sub-project will get the wrong purpose.
- **No cloud sync or accounts** in any of the four language apps — a lost device/cleared browser means fully lost progress, with manual JSON export/import as the only recourse.
- **Speech recognition is effectively Chrome/Edge-only**; other browsers fall back to typed/audio-only practice, which is a materially different experience.
- **Service-worker staleness has caused real, shipped bugs**, not just a theoretical risk — both Mandarin Tutor and Vamos have dedicated fix commits for stale cached files surviving a deploy. Only Mexican Spanish Tutor has an automated check that its precache list matches the real file tree.
- **A past state-loss regression** in Mexican Spanish Tutor's `deepMerge` logic silently discarded a state branch on reload; it's now covered by a regression test, but the same merge pattern is duplicated, unguarded, in the other three apps.
- **A real iOS Safari backgrounding data-loss bug** was found and fixed in Mandarin Tutor specifically (shadow backup key + forced flush on `visibilitychange`/`pagehide`); it is not confirmed to be fixed the same way in Vamos, Mexican Spanish Tutor, or Japanese Speaking Lab, which share the same underlying storage pattern.
- **Seed English Tokyo/Seed Tokyo has no real backend anywhere**, and three specific features (real-time volunteer video calls, real multi-user role-based auth, real on-call request routing) are documented as permanently out of scope until real infrastructure exists — not simply unfinished.
- No GitHub issues are currently open in this repository.

---

## Recent Development

Most recent work first, across the whole monorepo:

1. `00b35a5` — Wrote the target backend architecture design doc for the mission/gospel-pivot features (`docs/19`); nothing in it is implemented yet.
2. `c7010a5` — Split the `/team` triage view into separate pages per request type.
3. `d53ab6a` — Built out churches, stories, Bible, mission, and volunteering routes (the bulk of `docs/18`'s scope).
4. `b2e8db3` — Moved seed buying/funding out of the "Your Next Step" grid onto its own page, per direct feedback.
5. `4de25be` — **Pivoted Seed English Tokyo into "Seed Tokyo," a gospel outreach platform** — the single biggest recent change in the repo.
6. `473872c` / PR #9 — Mexican Spanish Tutor's roadmap quizzes now explain grammar-drill mistakes instead of just revealing the answer.
7. `f9adb15` / PR #8 — Overhauled Mexican Spanish Tutor: new onboarding, ACTFL self-assessment, Immersion Mode, Scenario Mode.
8. `7d0a5e2` — Added `PROJECT.md` (now stale on the Seed English Tokyo pivot, see Known Issues).
9. Mandarin Tutor: Daily Lesson chaining, removal of the last traditional character, a new Pinyin Lab + Toolbox, and merging Characters/Vocabulary into one Learn section.
10. Japanese Speaking Lab: exact session resume (route/tab/queue), one-at-a-time SRS flip decks for Vocabulary/Connector Lab/Grammar Ladder, a 3,144-word N3/N2 vocabulary replacement, and full offline PWA support.
11. Vamos: audio in Grammar Lab, a new Phrases screen, a fixed bottom nav bar, and porting Mexican Spanish Tutor's roadmap infrastructure to build Vamos's own Duolingo-style path.

---

## Recommended Priorities

1. **Update `PROJECT.md` (and `seed-english-tokyo/README.md`) to reflect the Seed Tokyo pivot.** Right now the two top-level docs actively disagree about what that sub-project is; anyone (human or Claude session) reading `PROJECT.md` first will misunderstand the app.
2. **Extend automated test coverage beyond Mexican Spanish Tutor.** It alone gates deploys for all five sub-projects while Vamos, Mandarin Tutor, and Japanese Speaking Lab ship on manual verification.
3. **Add precache/file-tree sync checks to the other three service workers**, given stale-cache bugs have already shipped twice (Mandarin Tutor, Vamos) and only Mexican Spanish Tutor guards against it automatically.
4. **Audit Vamos, Mexican Spanish Tutor, and Japanese Speaking Lab for the same iOS-backgrounding data-loss class** that was found and fixed in Mandarin Tutor; they share the storage pattern that caused it there.
5. **Decide the real-backend path for Seed Tokyo.** `docs/19` is a completed design ready to implement (Postgres/Prisma, Clerk with an extended role model, Stripe/PayPay, Mapbox); either begin building against it or explicitly deprioritize the sub-project so effort stays on the four live language apps.
6. **Even out content depth across the three "tutor" apps** — Mexican Spanish Tutor's vocabulary/dialogue banks are notably smaller than Mandarin Tutor's, and both are far smaller than Japanese Speaking Lab's.
7. **Consider an account-free cloud backup option** for the four language apps, since `localStorage` plus manual JSON export/import is currently the only defense against data loss.

---

## Notes For Future Claude Code Sessions

- **Read `docs/17-gospel-pivot.md` and `docs/18-mission-and-community-expansion.md` before making any change to `seed-english-tokyo/`.** The app is mid-transformation from an English-learning platform to a gospel outreach platform; `PROJECT.md` and the sub-project's own `README.md` have not caught up and will mislead you about its purpose if you read only them.
- **Do not build real-time volunteer video calling, real multi-user role-based auth, or real on-call request routing for Seed Tokyo without the user explicitly asking for real backend infrastructure first.** This was a deliberate, discussed safety decision (see `docs/17`'s "A safety decision made before building" section) — convincing UI for any of these without a real person/backend behind it was judged actively deceptive to someone in a vulnerable moment. If asked to "finish" the Prayer/Connection Center, check whether that means more honest frontend (fine) or wiring up real response infrastructure (a bigger, separate decision).
- **The four language apps intentionally duplicate their core modules** (`storage.js`, `srs.js`, `router.js`, etc.) rather than sharing a package — this is a documented architectural choice, not an oversight. Don't "fix" the duplication by extracting a shared library unless asked; each app is meant to evolve and deploy independently.
- **Mexican Spanish Tutor's Playwright suite gates the whole site's deploy.** If you touch that app, run `npm test` in `mexican-spanish-tutor/` before considering the change done — a failure there blocks Vamos, Mandarin Tutor, and Japanese Speaking Lab from deploying too, even though your change had nothing to do with them.
- **Bumping a service worker's `CACHE_NAME`** is required whenever you change a cached file in Vamos, Mandarin Tutor, Mexican Spanish Tutor, or Japanese Speaking Lab — this has been the direct cause of at least two shipped bugs (stale JS served after deploy) in this repo's history.
- **When updating `CONTEXT.md` itself** in a future session, re-check `git log` and the `seed-english-tokyo/docs/` directory for anything numbered higher than what's referenced here — that sub-project in particular has a habit of large, doc-first pivots that this file needs to stay in sync with.
