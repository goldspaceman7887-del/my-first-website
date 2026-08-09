# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

This is a **monorepo of five independent, sibling projects** deployed together as one GitHub Pages site. There is no shared root application — pick the sub-project directory relevant to your task and work within it. See `PROJECT.md` for the full write-up (tech stack, data flow, integrations, current status); this file focuses on what you need to develop correctly day to day.

| Project | Path | Deployed at | Stack |
|---|---|---|---|
| Vamos (Spain Spanish) | repo root (`index.html`, `css/`, `js/`) | `/` | Vanilla JS/HTML/CSS, no build |
| Mandarin Tutor | `mandarin-tutor/` | `/mandarin-tutor/` | Vanilla JS/HTML/CSS, no build |
| Mexican Spanish Tutor | `mexican-spanish-tutor/` | `/mexican-spanish-tutor/` | Vanilla JS/HTML/CSS, no build, **has tests** |
| Japanese Speaking Lab | `japanese-speaking/` | `/japanese-speaking/` | Vanilla JS/HTML/CSS, no build |
| Seed English Tokyo | `seed-english-tokyo/` | `/seed-english-tokyo/` | Next.js 14 + TypeScript + Tailwind (`web/`), docs-only spec (`docs/`) |

The four language apps are **independent codebases with duplicated core modules**, not a shared package — each has its own `js/core/storage.js`, `srs.js`, `router.js`, etc. That duplication is intentional (see PROJECT.md's "Important Technical Decisions"); do not try to unify them into a shared library unless explicitly asked.

## Commands

### The four vanilla-JS apps (Vamos, Mandarin Tutor, Mexican Spanish Tutor, Japanese Speaking Lab)

No build step, no `npm install` needed to run them. Serve over HTTP — ES modules require `http(s)://`, not `file://`:

```bash
# from the app's own directory (repo root for Vamos, mandarin-tutor/, etc.)
python3 -m http.server 8080
# open http://localhost:8080/index.html
```

### Mexican Spanish Tutor tests (the only app with automated tests)

```bash
cd mexican-spanish-tutor
npm install
npx playwright install chromium
npm test              # full regression suite
npm test storage      # a single group, e.g. "storage" — see tests/README.md for all group names
```

CI (`test-spanish.yml`) also syntax-checks every `.js` module (`node --check`) and verifies every file under `js/` is listed in `service-worker.js`'s precache list before running the suite. **This suite gates the deploy of the entire monorepo** — if you touch `mexican-spanish-tutor/`, run `npm test` before considering the work done. If you add a new `js/*.js` file to that app, add it to `service-worker.js`'s precache list or CI will fail.

If you add or change a `localStorage` key in `mexican-spanish-tutor/js/core/storage.js`'s `defaultState()`, also add coverage to the `storage` test group (`tests/run.mjs`) — a past regression silently discarded a whole state branch on reload, and that group exists specifically to catch it again.

### Seed English Tokyo (`seed-english-tokyo/web`)

```bash
cd seed-english-tokyo/web
npm install
npm run dev          # local dev server
npm run build         # production build (static export to out/)
npm run lint          # next lint
npm run typecheck     # tsc --noEmit, no emit
```

This is the only sub-project with a real build/lint/typecheck step — run `npm run lint` and `npm run typecheck` after changes here. Its own build failing does **not** block the rest of the site's deploy (see CI section below), but you should still keep it green.

## Architecture shared by the four vanilla-JS apps

Each of Vamos, Mandarin Tutor, Mexican Spanish Tutor, and Japanese Speaking Lab repeats the same internal layout:

```
<app>/
├── index.html            App shell: topbar, sidebar nav, #view-root mount point
├── manifest.webmanifest  PWA manifest
├── service-worker.js     Cache-first offline support; versioned CACHE_NAME + precache list
├── css/
│   ├── themes.css        Light/dark design tokens (CSS custom properties)
│   ├── main.css          Layout, responsive breakpoints
│   ├── components.css    Cards, buttons, flashcards, exercises, modals, etc.
│   └── animations.css    Transitions, confetti, reduced-motion support
└── js/
    ├── app.js            Boot: theme, nav, route registration, topbar stats
    ├── core/
    │   ├── storage.js     Single-blob localStorage store + deepMerge migration + subscribe API
    │   ├── srs.js          SM-2-inspired spaced-repetition engine (app-specific interval ladder)
    │   ├── audio.js         speechSynthesis + speechRecognition wrappers
    │   ├── gamification.js  XP, streaks, levels, achievements
    │   ├── router.js        Minimal hash-based (`#/route`) SPA router
    │   └── ui.js             el()/toast()/modal()/progress-bar DOM helpers
    ├── data/               Content: vocabulary/characters, grammar, dialogues, stories, etc.
    └── views/              One module per route
```

Key patterns to follow when editing any of these apps:

- **State**: one versioned JSON blob in `localStorage`, built from `defaultState()` in `js/core/storage.js` and loaded via `deepMerge(defaultState(), savedState)`. Adding a field just means adding it to `defaultState()` — the merge backfills it for existing users. Never introduce a second `localStorage` key or bypass the `Store` class.
- **Views**: every view module exports `render(container, params)` and is registered as a route in `app.js`. Views build DOM directly (no virtual DOM/templating library) and call into `srs.js`, `gamification.js`, and `storage.js` synchronously when grading an interaction.
- **Routing**: hash-based (`#/route`), not the History API — this lets the apps work from a plain static file server with no server-side rewrite rules. Keep new routes hash-based.
- **SRS**: every gradeable interaction (flashcards, exercises, dialogue completion, dictation, quizzes) should feed the same per-app SRS queue via `srs.js`'s grading function, so the unified Review view stays comprehensive. Don't build a one-off progress mechanism for a new content type.
- **Audio**: text-to-speech and speech recognition go through `js/core/audio.js`'s wrappers around the browser-native Web Speech API — no shipped audio files, no third-party speech service, no API keys. New speaking features must degrade gracefully when `SpeechRecognition` is unavailable (effectively Chrome/Edge-only).
- **Content data**: content lives in `js/data/*.js` as plain exported arrays/objects, schema-driven by the views. Vamos documents its authoritative shapes in `js/data/SCHEMA.md` — match that shape (stable, unique `id`s; Peninsular-Spain-only forms with Latin American forms only as explicit comparisons) when adding vocabulary/grammar/dialogues/reading/culture content there. The other apps follow the same "append an object matching the existing shape" pattern in their own `js/data/`.
- **Service worker**: `CACHE_NAME` must be bumped and the precache list kept in sync whenever cached files change, or users get stale JS served from an old cache. Mexican Spanish Tutor's CI enforces this for that app; do the same manually for the other three.

Seed English Tokyo does **not** follow this layout — it's a standard Next.js App Router project (`app/`, `components/`, `lib/`) currently rendering static mock data from `lib/mock-data.ts`; there is no live backend, database, auth, or payments wired up despite the extensive spec in `docs/`.

## CI / deployment

`.github/workflows/deploy-pages.yml` builds and deploys the combined site on push to `Root` or `main`:

1. `test-spanish` job runs the Mexican Spanish Tutor regression suite first — **the whole deploy is gated on this**.
2. `build` job then copies Vamos, Mandarin Tutor, Mexican Spanish Tutor, and Japanese Speaking Lab as-is into `_site/`, and separately attempts the Seed English Tokyo Next.js build with `continue-on-error: true` — if that build or its `npm ci` fails, the other four apps still deploy (Seed English Tokyo is just omitted, with a `::warning::`).
3. `deploy` job publishes `_site/` to GitHub Pages.

`.github/workflows/test-spanish.yml` separately runs the same regression suite (plus the module syntax-check and precache-sync check) on every push/PR touching `mexican-spanish-tutor/**`.

**Branch model**: `Root` is the integration branch that CI actually deploys from (in addition to `main`). Work happens on dedicated feature branches and merges into `Root`.

## Notes when adding content or features

- Respect each app's target dialect/level scope: Vamos is **Peninsular Spain Spanish only** (vosotros, coche/móvil/ordenador/piso/zumo/coger/vale/bocadillo/patata, Castilian pronunciation); Mexican Spanish Tutor is Mexican Spanish; Japanese Speaking Lab assumes the learner is already at ACTFL Intermediate High, targeting Advanced High. Don't blend dialects/forms into the primary content — cross-dialect forms belong only in explicit comparison notes.
- No app in this repo needs API keys, database credentials, or backend auth — the four language apps have no backend, and Seed English Tokyo's planned integrations (Clerk, Stripe, PayPay, Mapbox, Postgres, Redis) are spec-only, not implemented. Don't add real credentials or wire up a live backend without being asked.
- The only environment variable in the repo is `GH_PAGES_BASE_PATH`, set by CI for Seed English Tokyo's static export; it's unset (and unnecessary) for local dev.
