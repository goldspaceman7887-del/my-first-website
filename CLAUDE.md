# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

This is a **monorepo of independent, browser-based language-learning apps**, deployed together as one GitHub Pages site, plus one not-yet-built community-platform product (spec + scaffold only).

| App | Path | What it teaches | Notes |
|---|---|---|---|
| **Vamos** | `/` (repo root) | Peninsular (Spain) Spanish, A0 → ACTFL Advanced Low | Most mature app; largest feature set |
| **Mandarin Tutor** | `mandarin-tutor/` | Mandarin Chinese, beginner → conversational | |
| **Mexican Spanish Tutor** | `mexican-spanish-tutor/` | Mexican Spanish, Novice → ACTFL Advanced Low | Only app with an automated test suite; gates the whole site's deploy |
| **Japanese Speaking Lab** | `japanese-speaking/` | Japanese speaking, ACTFL Intermediate High → Advanced High | |
| **Seed English Tokyo** | `seed-english-tokyo/` | N/A — spec + Next.js scaffold for a funded English-practice community platform | No real backend; renders mock data only |

The four language apps share one philosophy — **meaning before grammar** (meaning → example sentence → conversation → vocabulary → grammar rule, never starting from an abstract rule) — and an identical zero-dependency architecture: **vanilla ES modules, no build step, no backend, no API keys**, all state in `localStorage`. Each app is an independent codebase with its own copy of the core modules (not a shared package) so apps can evolve and deploy without cross-app coupling.

`PROJECT.md` at the repo root has a fuller writeup (business context, integrations, architectural decision rationale) if you need more background than this file provides.

## Commands

### Vamos (repo root), Mandarin Tutor, Japanese Speaking Lab — no build step

```bash
python3 -m http.server 8080   # from the app's own directory
# open http://localhost:8080/index.html
```

ES modules require `http(s)://`, not `file://`. There is no lint/build/test command for these three apps — verify changes by loading the app in a browser.

### Mexican Spanish Tutor — has a test suite

```bash
cd mexican-spanish-tutor
npm install
npx playwright install chromium
npm test              # full Playwright regression suite
npm test storage      # run one group only, e.g. the localStorage-persistence group
```

`tests/run.mjs` spins up its own static file server and drives a real Chromium instance. It checks: every route renders without JS errors, vocabulary data integrity, the pronunciation/IPA generator, roadmap unit/checkpoint structure, story coverage across ACTFL levels, `localStorage` persistence across reloads, mobile layout, and offline mode (service worker with network off). This suite is CI's only guardrail for the whole repo — **`deploy-pages.yml` blocks the entire site's deploy if it fails**, so treat changes to `mexican-spanish-tutor/` as needing this suite green before pushing.

CI also runs a cheap syntax/precache check on every push to this app (`.github/workflows/test-spanish.yml`): `node --check` on every `.js` file, and a check that every file under `mexican-spanish-tutor/js/` is listed in `service-worker.js`'s precache list. If you add a new module to this app, add it to the precache list or CI fails.

### Seed English Tokyo

```bash
cd seed-english-tokyo/web
npm install
npm run dev          # local dev server
npm run build          # production build; static export to out/
npm run start           # serve a production build
npm run lint              # next lint
npm run typecheck          # tsc --noEmit
```

## Architecture

### Shared internal layout (Vamos, Mandarin Tutor, Mexican Spanish Tutor, Japanese Speaking Lab)

```
<app>/
├── index.html            App shell: topbar, sidebar nav, #view-root mount point
├── manifest.webmanifest  PWA manifest (icons, name, theme color)
├── service-worker.js     Cache-first offline support; versioned CACHE_NAME + explicit precache list
├── icons/
├── css/
│   ├── themes.css        Light/dark design tokens (CSS custom properties)
│   ├── main.css          Layout, responsive breakpoints
│   ├── components.css    Cards, buttons, flashcards, exercises, modals, etc.
│   └── animations.css    Transitions, confetti, reduced-motion support
└── js/
    ├── app.js            Boot: load state, apply theme, register every route, wire nav/topbar, onboarding, register SW
    ├── core/              storage.js, srs.js, router.js, ui.js, audio.js, gamification.js, onboarding.js — plus app-specific extras
    ├── data/              Content only (vocabulary, grammar, dialogues, stories, etc.) — each app has a data/SCHEMA.md
    └── views/             One module per route; each exports a render(container, params) function
```

Vamos (repo root) is the most feature-complete of the four and has accumulated extra `core/` modules beyond the shared baseline (`backup.js`, `distractors.js`, `feedback.js`, `hearts.js`, `lessonPlayer.js`, `tapword.js`) and extra `views/` (`roadmap.js`, `levelTest.js`, `speakingTest.js`, `story.js`, `phrases.js`, `roleplay.js`, `conversation.js`, `immersion.js`) and `data/` (`roadmap.js`, `stories.js`, `conversationThreads.js`, `glossary.js`) beyond what's described for the other apps — check `js/app.js`'s import list for the current full route set rather than assuming symmetry across apps.

`seed-english-tokyo/web` instead follows standard Next.js App Router conventions (`app/`, `components/`, `lib/`), with `docs/` holding the full 18-document product/technical spec that the scaffold is built against (nothing there is implemented server-side yet).

### Core module responsibilities (per app)

- **`core/storage.js`** — single versioned JSON blob per app in one `localStorage` key. `deepMerge(defaultState(), savedState)` on load lets new schema fields get added without discarding existing user progress — a `Store` class exposes `get`/`set`/debounced `save()` and a `subscribe()` pub/sub. **This merge logic is load-bearing**: a past regression here silently discarded a learner's entire SRS history, which is why Mexican Spanish Tutor's test suite explicitly guards it.
- **`core/srs.js`** — SM-2-inspired spaced repetition engine, one per app, each with its own interval ladder tuned to that app's content (e.g. Vamos: same-day→1→3→7→14→30→90→180 days). Every gradeable interaction across every content type (flashcards, grammar exercises, dialogue completion, dictation, quizzes, speaking drills) feeds the same queue, so the app's Review view is comprehensive rather than per-feature.
- **`core/router.js`** — minimal hash-based (`#/route`) SPA router; `registerRoute(pattern, render)` + `initRouter()`. Hash routing (not the History API) is deliberate so the apps work from a plain static file server with no server-side rewrite rules.
- **`core/audio.js`** — wraps `SpeechSynthesis` (TTS, no shipped audio files) and `SpeechRecognition` (speaking assessment, effectively Chrome/Edge-only) with graceful degradation elsewhere.
- **`core/gamification.js`** — XP, streaks, levels, achievements.
- **`core/ui.js`** — `el()`/`toast()`/`modal()`/progress-bar DOM helpers (no framework, no virtual DOM — views build DOM directly).
- **`data/*.js`** — content only, each shaped per that app's `data/SCHEMA.md`. To add vocabulary/grammar/dialogues/etc., append objects matching the documented schema; views are schema-driven and pick up new entries automatically without code changes.
- **`views/*.js`** — one module per route, each exporting `render(container, params)`, registered in `app.js`.

### Request/study flow (all four language apps)

1. **Boot** (`app.js`): load persisted state → apply theme → register all routes → wire sidebar/topbar → show onboarding on first visit → register the service worker.
2. **Route render**: the hash router matches `location.hash` to a registered view and calls `render(container, params)`.
3. **Study loop**: a view renders content; grading an answer calls `srs.js` to update that item's schedule, `gamification.js` to award XP/streak credit, and `storage.js` to persist — all synchronous, all local, no network round-trip.
4. **Review**: a dedicated Review view aggregates every due item across content types from the single SRS store into one queue.

### CI / deploy (`.github/workflows/deploy-pages.yml`)

Single pipeline builds and deploys everything to one GitHub Pages site on push to `Root` or `main`:
1. `test-spanish` job runs Mexican Spanish Tutor's full suite first and **gates the entire deploy** — nothing else runs if it fails.
2. `build` job: copies Vamos to the site root, copies the three other static apps as-is into their subpaths, and attempts the Seed English Tokyo Next.js build with `continue-on-error: true` — a broken Next.js build/install ships the rest of the site anyway rather than blocking it (`GH_PAGES_BASE_PATH=/my-first-website/seed-english-tokyo` is set for that build only).
3. `deploy` job publishes the assembled `_site/` via `actions/deploy-pages`.

**Branch model**: apps are typically developed on dedicated feature branches (often one per Claude Code session) and merged into `Root`, the branch that `deploy-pages.yml` actually builds and deploys from.

### Testing gap to be aware of

Only Mexican Spanish Tutor has automated tests. Changes to Vamos, Mandarin Tutor, or Japanese Speaking Lab are currently verified manually (load the app, exercise the changed flow in a browser) — there's no CI safety net for those three apps beyond the fact that they have no build step to break.
