# PROJECT.md

## Project Overview

This repository is a **monorepo of independent, browser-based language-learning applications**, deployed together as a single GitHub Pages site (`my-first-website`), plus one larger, not-yet-built community-platform product that currently exists as a design specification and a front-end scaffold.

### What the application does

Five sub-projects live side by side and deploy to one Pages site under different paths:

| App | Path | What it teaches |
|---|---|---|
| **Vamos** | `/` (repo root) | Peninsular (Spain) Spanish, A0 → ACTFL Advanced Low |
| **Mandarin Tutor** | `/mandarin-tutor/` | Mandarin Chinese, beginner → conversational fluency |
| **Mexican Spanish Tutor** | `/mexican-spanish-tutor/` | Mexican Spanish, Novice → ACTFL Advanced Low |
| **Japanese Speaking Lab** | `/japanese-speaking/` | Japanese speaking, ACTFL Intermediate High → Advanced High (paragraph-level fluency) |
| **Seed English Tokyo** | `/seed-english-tokyo/` | Not a language-learning app itself — a specification + scaffold for a funded English-practice community platform for Tokyo |

The four language-learning apps share one philosophy: **meaning before grammar**. Every lesson goes meaning → example sentence → conversation → vocabulary/characters → grammar rule, never starting from an abstract rule. Each is a full curriculum — dashboard, vocabulary/character banks, grammar/sentence patterns, dialogues, a spaced-repetition review engine, speaking practice via the browser's speech APIs, and gamification (XP, streaks, achievements) — built independently, in vanilla JavaScript, with **no backend, no build step, and no API keys**. All progress is stored in the browser (`localStorage`) and never leaves the device.

Seed English Tokyo is different in kind: its `docs/` folder specifies a real multi-user platform (accounts, payments, a live map, events, moderation) intended to run on a real backend, but the `web/` directory currently ships only a Next.js front-end scaffold rendering realistic mock data — there is no database, authentication, or payment integration wired up yet.

### Target users

- **Vamos / Mandarin Tutor / Mexican Spanish Tutor / Japanese Speaking Lab**: self-directed adult language learners, from absolute beginners (the three "tutor" apps) to upper-intermediate speakers pushing toward advanced fluency (Japanese Speaking Lab assumes ACTFL Intermediate High already).
- **Seed English Tokyo** (per its docs): Japanese people aged 18–30 in Tokyo who want free English practice, plus a separate audience of "supporters" who fund the platform by purchasing trackable "Seeds."

### Main business purpose

The four language apps are free, offline-capable personal-use tools with no accounts, no payments, and no server — there is currently no monetization or business model implemented for them. Seed English Tokyo's documentation describes an intended business model (transparent, trackable donor funding of community programs), but that model is not implemented in code — only specified and mocked.

---

## Tech Stack

### Vamos, Mandarin Tutor, Mexican Spanish Tutor, Japanese Speaking Lab (identical stack, independent codebases)

- **Language**: Vanilla JavaScript (ES modules), HTML5, CSS3 (custom properties for theming)
- **Framework**: None — no React/Vue/etc. and no build tooling (no bundler, no transpiler)
- **Libraries**: None — zero third-party runtime dependencies
- **Database**: None — a single JSON blob per app in the browser's `localStorage`
- **Authentication**: None — no accounts, no login
- **Payments**: None
- **Audio**: Browser-native Web Speech API (`SpeechSynthesis` for text-to-speech, `SpeechRecognition` for speech-to-text where the browser supports it) — no shipped audio files, no third-party speech service
- **Offline support**: Hand-written Service Worker + Web App Manifest (PWA) in Vamos, Mandarin Tutor, and Mexican Spanish Tutor; Japanese Speaking Lab ships an `sw.js` + `manifest.json` as well
- **Testing**: Mexican Spanish Tutor only — Playwright-based regression suite (`mexican-spanish-tutor/tests/run.mjs`), no test framework, invoked via `node`
- **Deployment platform**: GitHub Pages (via GitHub Actions)

### Seed English Tokyo (`seed-english-tokyo/web`)

- **Framework**: Next.js 14 (App Router), React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS, `class-variance-authority`, `tailwind-merge`, `clsx`
- **Icons**: `lucide-react`
- **Build**: Next.js static export (`output: "export"`) for GitHub Pages compatibility
- **Data (current implementation)**: Static/mock data in `lib/mock-data.ts` and related `lib/*.ts` files — no live data source
- **Data (specified, not implemented)**: PostgreSQL accessed via Prisma (see `docs/02-database-schema.md`)
- **Auth (specified, not implemented)**: Clerk (session JWTs, `Authorization: Bearer` / cookie session)
- **Payments (specified, not implemented)**: Stripe and PayPay, behind a `provider: 'stripe' | 'paypay'` checkout parameter
- **Map (specified, not implemented)**: Mapbox, for the "Tokyo Impact Map"
- **Rate limiting (specified, not implemented)**: Redis via Vercel Edge Middleware
- **Deployment platform**: GitHub Pages via static export (the docs describe Vercel as the eventual target for the real API routes)

---

## Architecture

### Folder structure (repository root)

```
.
├── .github/workflows/
│   ├── deploy-pages.yml          Builds and deploys the combined multi-app Pages site
│   └── test-spanish.yml          Regression suite for mexican-spanish-tutor, runs on every push to it
├── index.html, css/, js/         Vamos (Spain Spanish) — deployed at the site root
├── mandarin-tutor/                Mandarin Tutor — own index.html/css/js, manifest, service worker, icons
├── mexican-spanish-tutor/        Mexican Spanish Tutor — same shape, plus tests/
├── japanese-speaking/            Japanese Speaking Lab — same shape, plus sw.js/manifest.json
├── seed-english-tokyo/
│   ├── docs/                     Full product & technical specification (18 numbered documents)
│   └── web/                      Next.js + TypeScript + Tailwind front-end scaffold
└── README.md                     Top-level readme (Vamos)
```

Each of the four static apps repeats the same internal layout:

```
<app>/
├── index.html            App shell: topbar, sidebar nav, #view-root mount point
├── manifest.webmanifest  PWA manifest (icons, name, theme color)
├── service-worker.js     Cache-first offline support, precache list, versioned CACHE_NAME
├── icons/                192/512/maskable PNG icons
├── css/
│   ├── themes.css        Light/dark design tokens (CSS custom properties)
│   ├── main.css          Layout, responsive breakpoints
│   ├── components.css    Cards, buttons, flashcards, chat bubbles, exercises, etc.
│   └── animations.css    Transitions, confetti, reduced-motion support
└── js/
    ├── app.js            Boot sequence: theme, nav, route registration, topbar stats
    ├── core/
    │   ├── storage.js     Single-blob localStorage store, deepMerge migration, subscribe API
    │   ├── srs.js         SM-2-inspired spaced-repetition engine (app-specific interval ladder)
    │   ├── audio.js       speechSynthesis + speechRecognition wrappers
    │   ├── gamification.js  XP, streaks, levels, achievements
    │   ├── router.js      Minimal hash-based SPA router
    │   ├── ui.js          el()/toast()/modal()/progress-bar DOM helpers
    │   └── onboarding.js  First-run flow capturing the learner's starting level
    ├── data/              Content: vocabulary, grammar, dialogues, sentences, stories, etc.
    └── views/             One module per route; each exports render(container, params)
```

`seed-english-tokyo/web` instead follows standard Next.js App Router conventions (`app/`, `components/`, `lib/`).

### Major application flows

For each of the four language apps:

1. **Boot** (`app.js`): load persisted state from `localStorage`, apply theme, register all routes, wire the sidebar/topbar, show onboarding if this is the first visit, register the service worker.
2. **Route render**: the hash router matches `location.hash` to a registered view module and calls its `render(container, params)`, which builds the DOM directly (no virtual DOM/templating).
3. **Study loop**: a view renders content (flashcard, dialogue, exercise, etc.); grading an answer calls into `srs.js` (`gradeItem`) to update that item's spaced-repetition schedule, into `gamification.js` to award XP/streak credit, and into `storage.js` to persist the change — all synchronous, all local.
4. **Review**: a dedicated Review view aggregates every due item across content types (vocabulary, characters, grammar, dialogues, etc.) from the single SRS store and presents them in one queue.

Seed English Tokyo's *specified* (not built) flow: a visitor lands on the marketing page, signs up via Clerk, browses/purchases a "Seed" (Stripe/PayPay checkout), and their contribution animates a station on the live Tokyo map as it accumulates funding, impressions, registrations, and meetups.

### API architecture

- **The four language apps**: no API. All logic runs client-side against `localStorage`.
- **Seed English Tokyo**: no live API. `docs/03-api-architecture.md` specifies a REST API (`/api/v1/...`, JSON, Clerk-authenticated, cursor-paginated, Next.js Route Handlers) covering users/profiles, seeds & payments, the impact map, events, Q&A, and admin — none of it is implemented; the current `web/` scaffold renders directly from mock data in `lib/`.

### State management approach

- **Language apps**: a single versioned JSON object per app (`defaultState()` in `storage.js`) persisted as one `localStorage` key. A `deepMerge(defaultState(), savedState)` on load lets new fields be added to the schema without discarding existing user data. A `Store` class exposes `get`/`set`/`save` (debounced) and a `subscribe()` pub/sub so any view can react to state changes (e.g., topbar stats). Mandarin Tutor additionally writes a shadow backup key and flushes on `visibilitychange`/`pagehide` to survive iOS Safari backgrounding.
- **Seed English Tokyo**: component-local React state over static mock data; no global store, no server state library, since there is no live backend yet.

---

## Features

### Vamos (Spain Spanish)
Dashboard · Grammar Lab (32 concepts, mixed exercise types) · Vocabulary Trainer (~300 words) · Dialogue Academy (~28 dialogues, 12-part structure each) · Listening (slow/natural/fast, dictation) · Speaking (shadowing, role-play) · Reading (10 passages) · Writing (15 prompts, heuristic feedback) · Cultural Immersion (33 topics) · unified SRS Review Dashboard · rule-based AI Tutor (grammar Q&A, mistake correction, role-play) · Achievements.

### Mandarin Tutor
Dashboard · Onboarding (self-reported starting knowledge) · Learn (unified, Duolingo-style: pick a batch size, learn new characters/words, then practice them in real sentence context) · Toolbox (check off known items so they stop being taught, without leaving the SRS entirely) · Pinyin Lab (tones, initials, finals, "listen & guess" quiz) · Sentence Patterns (22) · Dialogues (10) · Roadmap (Duolingo-style path with skip-ahead, unit reviews, ACTFL/HSK level tracks) · Daily Lesson (9-part structure, chainable — finish one and start another in the same sitting) · Speaking Mode (role-play) · Immersion Mode · Story Mode · Sentence Mining (paste any text, extract study material) · Correction Mode (12 common mistake patterns) · unified Review · Achievements. PWA offline support.

### Mexican Spanish Tutor
Dashboard (ACTFL level estimate) · ACTFL Roadmap (Can-Do checklist + 16-unit Duolingo-style path) · Vocabulario (~100+ words with register/slang notes) · Gramática (20 patterns) · Diálogos (16) · Daily Lesson (9-part) · Roleplay Mode · Conversation Mode (free-flowing partner with an immersion dial) · Immersion Mode · Story Mode · OPI Practice (simulated oral proficiency interview, heuristic ACTFL scoring) · Writing/Correction Coach (13 common mistake patterns) · Review · Achievements. PWA offline support + automated Playwright test suite gating deploys.

### Japanese Speaking Lab
Review Session (Anki-style SRS across connectors/grammar/vocabulary, all shown in full sentences) · Guide · Connector Lab (~40 discourse connectors) · Grammar Ladder (44 structures, IH→AH) · Vocabulary in Sentences (3,000+ JLPT N3/N2 words, every one taught inside a sentence) · Level Ladder (10 prompts answered at 4 ACTFL sublevels) · Paragraph Practice (6 speaking functions, live transcription via Speech Recognition) · Shadowing · 12-Week Roadmap · Self-Assessment (7-dimension ACTFL rubric) · Settings (voice selection, JSON export/import). Click-any-word lookup popover throughout, powered by a shared tokenizer/dictionary.

### Seed English Tokyo (specification + scaffold, not a finished product)
Landing page, My Seeds, Tokyo Impact Map, "Ask English" Q&A, Events — implemented as static pages/components rendering mock data. The docs additionally specify: seed tiers & checkout, growth-stage/impact-attribution math, partner/event matching with trust & safety, gamification & an AI tutor, and an admin/analytics dashboard — none of which exist in code yet.

### Major user workflows (shared pattern across the four apps)
1. First visit → onboarding captures a starting point.
2. Dashboard shows what's due for review vs. what's new.
3. Learner works through a content module (vocabulary/character/grammar/dialogue); every graded interaction feeds one shared spaced-repetition queue.
4. Review pulls everything due, across content types, into a single session.
5. Speaking-oriented features use the microphone (where supported) for live transcription/self-assessment; all apps degrade gracefully to audio-only or typed self-comparison when Speech Recognition isn't available.
6. Settings allow JSON export/import of all progress, since there is no cloud account.

---

## Integrations

### External APIs actually used
- **Web Speech API** (`SpeechSynthesis`, `SpeechRecognition`) — browser-native, no network call, no API key. This is the only "integration" any of the four live apps has. Voice availability/quality and recognition support vary by browser (best on Chrome/Edge); every app degrades gracefully where recognition is unsupported.

### Third-party services actually used
- None. No analytics, no crash reporting, no CDN-hosted fonts/libraries — everything is self-contained.

### Integrations specified but not implemented (Seed English Tokyo only)
- **Clerk** — authentication
- **Stripe** and **PayPay** — payments (seed purchases)
- **Mapbox** — the live Tokyo impact map
- **PostgreSQL (via Prisma)** — primary datastore
- **Redis (via Vercel Edge Middleware)** — API rate limiting

---

## Environment Variables

Only one environment variable exists anywhere in this codebase, and it carries no secret:

| Variable | Used in | Purpose |
|---|---|---|
| `GH_PAGES_BASE_PATH` | `seed-english-tokyo/web/next.config.js` | Build-time only. Set by the GitHub Actions deploy workflow to `/my-first-website/seed-english-tokyo` so Next.js's static export emits correct asset paths for its GitHub Pages subpath. Unset (defaults to `""`) for local `npm run dev` / `npm run build`, so local development is unaffected. |

No app in this repository requires API keys, database credentials, or auth secrets — the four language apps have no backend at all, and Seed English Tokyo's planned integrations (Clerk, Stripe, PayPay, Mapbox, Postgres, Redis) are not yet wired up, so no corresponding environment variables exist yet.

---

## Development Workflow

### Vamos (repo root), Mandarin Tutor, Mexican Spanish Tutor, Japanese Speaking Lab

No build step. Serve the app directory over HTTP (ES modules require `http(s)://`, not `file://`):

```bash
# from the app's own directory (repo root for Vamos, or e.g. mandarin-tutor/)
python3 -m http.server 8080
# open http://localhost:8080/index.html
```

There is no build command for these apps — deployment is "copy the files as-is."

**Tests** (Mexican Spanish Tutor only):

```bash
cd mexican-spanish-tutor
npm install
npx playwright install chromium
npm test              # full regression suite
npm test storage      # a single group, e.g. the localStorage-persistence group
```

The suite covers: every route renders without JS errors; vocabulary data integrity; the pronunciation/IPA generator; roadmap unit/checkpoint structure; story data coverage across all ACTFL levels; `localStorage` persistence across reloads; mobile layout (no horizontal scroll, correct nav); and offline mode (service worker caching with the network off). CI blocks the *entire monorepo's* deploy if this suite fails.

### Seed English Tokyo

```bash
cd seed-english-tokyo/web
npm install
npm run dev          # local dev server
npm run build         # production build (static export to out/)
npm run start          # serve a production build
npm run lint             # next lint
npm run typecheck         # tsc --noEmit, no emit
```

### Full-site build (CI only)

`.github/workflows/deploy-pages.yml` assembles all apps into one `_site/` directory and deploys it as one GitHub Pages site: Vamos at `/`, each static app copied as-is to its subdirectory, and Seed English Tokyo's static export copied to `/seed-english-tokyo/` if (and only if) its build succeeds — a failed Next.js build does not block the other four apps from deploying.

---

## Important Technical Decisions

- **Zero-build, zero-dependency architecture for the language apps.** Vanilla ES modules were chosen deliberately over any framework so each app has no build step, no npm install, no API keys, and works fully offline — a static file server is the entire deployment story. This trades some developer convenience for maximum simplicity, portability, and long-term maintainability of apps with no backend to break.
- **Independent, duplicated core modules per app**, rather than a shared package. Each app has its own `storage.js`/`srs.js`/`router.js`/etc., intentionally kept separate so each app can evolve, deploy, and (in Mexican Spanish Tutor's case) be tested independently without cross-app coupling or a monorepo build system.
- **Single-blob `localStorage` state**, versioned and deep-merged on load, rather than many discrete keys. This keeps saves atomic and schema migrations simple (add a field to `defaultState()`; `deepMerge` backfills it for existing users). Mexican Spanish Tutor's test suite explicitly guards against a past regression where this merge logic silently discarded a whole state branch on reload.
- **SM-2-inspired spaced repetition**, each app implementing its own interval ladder (e.g., Mandarin: New→1→3→7→14→30→60 days; Vamos: same-day→1→3→7→14→30→90→180 days) tuned to that app's spec, with every gradeable interaction across every content type feeding the same per-app queue so Review is comprehensive, not per-feature.
- **Hash-based routing** (`#/route`) instead of the History API, so the apps work correctly from a plain static file server or `file://`-adjacent hosting without any server-side rewrite rules.
- **Browser-native Web Speech API** for both text-to-speech and pronunciation assessment, instead of shipping audio files or calling a paid TTS/STT service. This keeps the apps free and fully offline-capable, at the cost of audio quality/voice availability depending on the user's browser and OS, and speech recognition being effectively Chrome/Edge-only — every app is built to degrade gracefully (typed self-comparison, audio-only) where recognition isn't available.
- **Service-worker offline caching** with an explicit, versioned `CACHE_NAME` and a full precache list; the version is bumped on every deploy touching cached files specifically to avoid a known failure mode (stale JS being served from an old, not-yet-evicted cache).
- **A shared CI gate protecting the whole site.** Because none of these apps have a backend to validate changes server-side, `test-spanish.yml`/the `deploy-pages.yml` `test-spanish` job runs Mexican Spanish Tutor's regression suite on every push and blocks the *entire monorepo's* Pages deploy if it fails — a deliberate choice to make one app's test suite a quality gate for all of them, since they ship from the same site.
- **Resilient multi-app packaging.** The only app with a real build step (Seed English Tokyo/Next.js) is allowed to fail its install/build without taking down the rest of the site (`continue-on-error` plus conditional packaging) — a broken Next.js dependency should never prevent learners from reaching the other four apps.
- **Branch model**: apps are developed on dedicated feature branches (often one per Claude Code session) and merged into a shared `Root` integration branch, which is what `deploy-pages.yml` actually builds and deploys from.
- **Docs-first, mock-data-first approach for Seed English Tokyo.** Rather than building against a real backend from day one, the full product/technical spec was written first (`docs/01`–`18`), and the front-end scaffold renders against realistic mock data matching that spec — deferring real infrastructure (Postgres, Clerk, Stripe/PayPay, Mapbox) until the product direction is validated.

---

## Current Status

### Complete
- **Vamos**, **Mandarin Tutor**, **Mexican Spanish Tutor**, and **Japanese Speaking Lab** are all full, live, feature-complete curricula: dashboards, content banks (vocabulary/characters/grammar/dialogues/stories/reading/writing as applicable), a unified spaced-repetition Review system, speaking practice via the Web Speech API, gamification, and JSON export/import for backup — all deployed and reachable on the live GitHub Pages site.
- The combined multi-app deploy pipeline (build, package, deploy) is working, including graceful degradation when the one build-dependent app fails.

### Partially complete
- **Offline/PWA support** exists for Vamos, Mandarin Tutor, Mexican Spanish Tutor, and Japanese Speaking Lab (manifest + service worker), but only Mexican Spanish Tutor has an automated check that the service worker's precache list stays in sync with the actual file tree.
- **Automated testing** exists only for Mexican Spanish Tutor (routes, data integrity, pronunciation, roadmap, stories, storage persistence, mobile layout, offline mode). Vamos, Mandarin Tutor, and Japanese Speaking Lab have no automated regression suite — changes are currently verified manually (e.g., ad hoc Playwright smoke scripts during development sessions) rather than via CI.
- **Seed English Tokyo** is a complete product/technical specification (18 docs covering architecture, database schema, API surface, seed-tracking mechanics, the impact map, events/safety, gamification/AI/admin, design system, and go-to-market) paired with a working Next.js front-end scaffold that demonstrates the visual language and page structure — but entirely against mock data.

### Remaining / not yet built
- Seed English Tokyo has **no real backend**: no PostgreSQL database, no Prisma schema applied anywhere, no Clerk authentication, no Stripe/PayPay payment integration, no Mapbox-powered live map, and none of its specified `/api/v1/...` routes are implemented — everything currently rendered is static mock data.
- No accounts or cloud sync exist in any of the four live language apps; all progress is device-local (`localStorage`) only, with manual JSON export/import as the sole backup path.
- No shared/automated test coverage for Vamos, Mandarin Tutor, or Japanese Speaking Lab, unlike Mexican Spanish Tutor.
- No monetization is implemented anywhere in the repository, including for Seed English Tokyo, whose funding model is currently spec-only.
