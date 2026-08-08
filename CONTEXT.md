# CONTEXT.md

## Current Status

### Completed features
- **Vamos** (Spain Spanish, repo root), **Mandarin Tutor**, **Mexican Spanish Tutor**, and **Japanese Speaking Lab** are all live, feature-complete curricula: dashboards, content banks (vocabulary/characters/grammar/dialogues/stories as applicable), a unified spaced-repetition Review system, speaking practice via the browser's Web Speech API, gamification (XP/streaks/achievements), and JSON export/import for backup.
- All four apps are zero-build, zero-dependency vanilla JS/HTML/CSS with no backend, deployed together as one GitHub Pages site.
- The combined multi-app deploy pipeline (`deploy-pages.yml`) builds and packages all five sub-projects into one site, including graceful degradation when the one build-dependent app (Seed English Tokyo) fails to build.
- PWA offline support (manifest + service worker) ships in all four language apps.
- Mexican Spanish Tutor has an automated Playwright regression suite that gates the *entire monorepo's* deploy.

### Features in progress / partially complete
- **Automated testing**: only Mexican Spanish Tutor has a regression suite (routes, data integrity, pronunciation, roadmap, stories, storage persistence, mobile layout, offline mode). Vamos, Mandarin Tutor, and Japanese Speaking Lab are still verified manually.
- **Service worker precache validation**: only Mexican Spanish Tutor automatically checks that its precache list stays in sync with the actual file tree; the other three apps rely on manually bumping `CACHE_NAME`.
- **Seed English Tokyo**: a complete product/technical specification (18 docs) paired with a working Next.js + TypeScript + Tailwind front-end scaffold, but it renders entirely against mock data (`lib/mock-data.ts`) — no database, auth, payments, or map integration is wired up.

### Known issues
- **No cloud sync or accounts** in any of the four language apps — all progress lives in a single `localStorage` blob per app, with manual JSON export/import as the only backup path. Losing the device/browser data loses all progress.
- **Speech recognition is effectively Chrome/Edge-only.** Every app degrades to typed self-comparison or audio-only where `SpeechRecognition` isn't supported, but the speaking-practice experience is inconsistent across browsers.
- **Service-worker staleness has been a real, recurring bug**, not just a theoretical risk: Mandarin Tutor shipped a fix for the service worker serving stale cached files after a deploy, and Vamos shipped a fix to ensure returning users actually receive new deploys. Mitigated by versioned `CACHE_NAME` bumps, but there's no automated guardrail outside Mexican Spanish Tutor.
- **A past state-loss regression** in Mexican Spanish Tutor's `deepMerge` logic silently discarded a whole state branch on reload; it's now guarded by a regression test, but the same merge pattern is duplicated (unguarded) in the other three apps.
- **A real iOS progress-loss bug** was found and fixed in Mandarin Tutor (shadow backup key + flush on `visibilitychange`/`pagehide`); Vamos, Mexican Spanish Tutor, and Japanese Speaking Lab don't document the same iOS Safari backgrounding protection.
- **Seed English Tokyo has no real backend at all** — no Postgres/Prisma, no Clerk auth, no Stripe/PayPay, no Mapbox — everything specified in `docs/` beyond the visual scaffold is unbuilt.
- No GitHub issues are currently open in this repository.

### Recent work
- Merged: explain grammar-drill mistakes in Mexican Spanish Tutor's roadmap quizzes instead of just showing the answer (PR #9).
- Merged: overhaul of Mexican Spanish Tutor — reworked onboarding, ACTFL self-assessment, an immersion mode, and a new Scenario Mode (PR #8).
- Added `PROJECT.md`, a full monorepo-level architecture and status writeup.
- Mandarin Tutor: let Daily Lesson chain multiple lessons in one sitting; removed the app's last remaining traditional character (now simplified-only); added a Pinyin Lab and a "Toolbox" for marking already-known items; merged Characters and Vocabulary into one unified Learn section.
- Japanese Speaking Lab: added exact resume (route, tab, and in-progress queue survive a reload); converted Vocabulary, Connector Lab, and Grammar Ladder into one-at-a-time SRS flip decks; replaced the vocabulary set with a filtered 3,144-word N3/N2 deck; shipped full offline PWA support.
- Vamos: added audio to Grammar Lab and a new Phrases screen; added a fixed bottom nav bar for phone and desktop; ported Mexican Spanish Tutor's roadmap infrastructure to build out Vamos's own Duolingo-style Roadmap.

---

## Language Apps

### Mexican Spanish Tutor (`/mexican-spanish-tutor/`)

**Current state**: A complete, live curriculum targeting Novice through ACTFL Advanced Low, recently overhauled with a heavier assessment/immersion focus. It is the only one of the four apps with automated test coverage, and its Playwright suite is a deploy gate for the whole site.

**Major features**: Dashboard with an ACTFL level estimate · ACTFL Roadmap (Can-Do checklist + a 16-unit Duolingo-style path) · Vocabulario (~70–100+ words with register/slang notes) · Gramática (20 patterns) · Diálogos (16) · Daily Lesson (9-part, chainable) · Roleplay Mode · Conversation Mode (free-flowing partner with an immersion dial) · Immersion Mode · Story Mode (tap-any-word definitions) · OPI Practice (simulated oral proficiency interview with heuristic ACTFL scoring) · Writing/Correction Coach (13 common mistake patterns, explains mistakes wherever you type) · unified Review · Achievements · PWA offline support · an automated Playwright regression suite gating deploys.

**Missing features**: No accounts or cloud sync (device-local only). Vocabulary and dialogue banks are smaller than Mandarin Tutor's or Japanese Speaking Lab's, so content depth lags the other two apps proportionally. Speaking practice/dictation is best-effort outside Chrome/Edge. No dedicated listening-dictation content beyond what's noted in `listeningPractice.js`/`skillPractice.js` at the current scale.

### Japanese Speaking Lab (`/japanese-speaking/`)

**Current state**: A complete, live curriculum, but distinct in scope from the other three — it assumes the learner already has ACTFL Intermediate High and pushes toward Advanced High, so it has no true beginner onboarding path. It carries by far the largest content bank of any app in the repo (3,000+ vocabulary entries).

**Major features**: Review Session (Anki-style SRS across connectors/grammar/vocabulary, always shown in full sentences) · Guide · Connector Lab (~40 discourse connectors) · Grammar Ladder (44 structures, Intermediate High → Advanced High) · Vocabulary in Sentences (3,000+ JLPT N3/N2 words, each taught inside a sentence, one-at-a-time SRS flip decks) · Level Ladder (10 prompts × 4 ACTFL sublevels) · Paragraph Practice (6 speaking functions with live transcription via Speech Recognition) · Shadowing · a 12-Week Roadmap · Self-Assessment (7-dimension ACTFL rubric) · Settings (voice selection, JSON export/import) · click-any-word lookup with real furigana rendering, powered by a shared tokenizer/dictionary · exact-resume (route, tab, and in-progress queue persist across reloads) · full offline PWA support.

**Missing features**: No automated regression suite (manual verification only). No true beginner path — a learner below Intermediate High has nowhere to start. No dialogue or story-mode content type (unlike the other three apps); practice is built around sentence-level drills instead. No accounts or cloud sync.

### Mandarin Tutor (`/mandarin-tutor/`, Chinese)

**Current state**: A complete, live beginner → conversational-fluency curriculum and the most feature-dense of the four apps — it has the widest range of distinct study modes. Recently consolidated its content flow (merged Characters + Vocabulary into one Learn section) and fixed a real iOS data-loss bug.

**Major features**: Dashboard · Onboarding (self-reported starting knowledge) · unified Learn (Duolingo-style: pick a batch size, learn new characters/words, then practice them in sentence context) · Toolbox (mark known items so they stop being taught without leaving the SRS entirely) · Pinyin Lab (tones, initials, finals, listen-and-guess quiz) · Sentence Patterns (22) · Dialogues (10) · Roadmap (Duolingo-style path with skip-ahead, unit reviews, ACTFL/HSK level tracks) · Daily Lesson (9-part, chainable) · Speaking Mode (role-play) · Immersion Mode · Story Mode · Sentence Mining (paste any text, extract study material) · Correction Mode (12 common mistake patterns) · unified Review · Achievements · full offline PWA support with a shadow backup key that flushes on `visibilitychange`/`pagehide` to survive iOS Safari backgrounding.

**Missing features**: No automated regression suite (manual verification only). Character set (174, simplified-only) and vocabulary set (140+ core entries) are both still smaller than Japanese Speaking Lab's 3,000+ word bank, and are described in-repo as still growing toward HSK 4 coverage. No accounts or cloud sync.

---

## Next Priorities

1. **Extend automated test coverage beyond Mexican Spanish Tutor.** It's the only app with a regression suite even though it gates deploys for all five sub-projects; Vamos, Mandarin Tutor, and Japanese Speaking Lab currently ship on manual verification alone.
2. **Add precache/file-tree sync checks to the other three service workers.** Service-worker staleness has already caused real bugs in this repo (stale-cache fixes shipped for both Mandarin Tutor and Vamos); only Mexican Spanish Tutor automatically guards against it today.
3. **Audit the other apps for the iOS backgrounding bug class fixed in Mandarin Tutor.** Mandarin Tutor added a shadow backup key and forced flush on `visibilitychange`/`pagehide` after a real progress-loss bug; Vamos, Mexican Spanish Tutor, and Japanese Speaking Lab use the same single-blob `localStorage` pattern but don't document the same protection.
4. **Decide the path forward for Seed English Tokyo's backend.** The spec (18 docs) and mock-data scaffold have been stable for a while; either begin scoping real infrastructure (Postgres/Prisma, Clerk, Stripe/PayPay, Mapbox) or explicitly deprioritize it so effort stays on the four live language apps.
5. **Even out content depth across the three "tutor" apps.** Mexican Spanish Tutor's vocabulary and dialogue banks are notably smaller than Mandarin Tutor's, and both are far smaller than Japanese Speaking Lab's — worth either closing the gap or documenting it as an intentional difference in target proficiency range.
6. **Consider an account-free cloud backup option.** All four apps rely solely on `localStorage` plus manual JSON export/import; a lost device currently means fully lost progress with no automated recovery path.
