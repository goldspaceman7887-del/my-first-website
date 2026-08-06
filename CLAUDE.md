# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

This is a **monorepo of independent, browser-based language-learning apps**, deployed together as one GitHub Pages site, plus one not-yet-built platform that exists only as a spec + scaffold:

| App | Path | Stack | Teaches |
|---|---|---|---|
| **Vamos** | `/` (repo root: `index.html`, `css/`, `js/`) | Vanilla JS | Peninsular (Spain) Spanish, A0 → Advanced Low |
| **Mandarin Tutor** | `/mandarin-tutor/` | Vanilla JS | Mandarin Chinese, beginner → conversational |
| **Mexican Spanish Tutor** | `/mexican-spanish-tutor/` | Vanilla JS + Playwright tests | Mexican Spanish, Novice → Advanced Low |
| **Japanese Speaking Lab** | `/japanese-speaking/` | Vanilla JS | Japanese speaking, Intermediate High → Advanced High |
| **Seed English Tokyo** | `/seed-english-tokyo/` | Next.js 14 + TS + Tailwind (`web/`), specs (`docs/`) | Not a language app — a funded English-practice community platform; front end only, mock data, no backend wired up |

The four language apps are **independent codebases with an identical, intentionally-duplicated internal architecture** (see below) — there is no shared package between them by design, so a fix or feature in one does not automatically apply to the others. Each has zero runtime dependencies, no build step, no backend, no API keys; all progress lives in the browser's `localStorage` and never leaves the device.

`PROJECT.md` at the repo root is a much longer reference covering business context, every feature, integrations, env vars, and full rationale for each architectural decision — read it when you need more depth than this file provides. Each app also has its own `README.md` with its feature map and file layout.

## Commands

### The four vanilla-JS apps (root, `mandarin-tutor/`, `mexican-spanish-tutor/`, `japanese-speaking/`)

No build step. Serve over HTTP — ES modules require `http(s)://`, not `file://`:

```bash
cd <app-dir>            # repo root for Vamos, or e.g. mandarin-tutor/
python3 -m http.server 8080
# open http://localhost:8080/index.html
```

There is no lint or build command for these; verification is manual in the browser (or the Playwright suite below, for Mexican Spanish Tutor only).

### Mexican Spanish Tutor tests (the only app with automated tests)

```bash
cd mexican-spanish-tutor
npm install
npx playwright install chromium
npm test              # full regression suite (tests/run.mjs)
npm test storage       # run one group only, e.g. "storage"
```

Groups: `routes`, `vocabulary`, `pronunciation`, `roadmap`, `stories`, `storage`, `mobile`, `offline` (see `mexican-spanish-tutor/tests/README.md`). This suite gates the *entire monorepo's* deploy via `.github/workflows/deploy-pages.yml` — a failure here blocks every app from shipping, not just this one. The `storage` group specifically guards against a past regression where `deepMerge` silently discarded a whole branch of a learner's spaced-repetition progress on reload; when adding a new persisted state key, declare it in `defaultState()` in `js/core/storage.js` and add coverage to the `storage` group.

`.github/workflows/test-spanish.yml` also syntax-checks every module (`node --check`) and verifies the service worker's precache list contains every file under `js/` — keep `service-worker.js`'s `PRECACHE_URLS` in sync when adding/removing/renaming JS files in this app. The other three apps have the same precache-list convention but no CI check enforcing it, so update it there by hand too.

### Seed English Tokyo (`seed-english-tokyo/web`)

```bash
cd seed-english-tokyo/web
npm install
npm run dev          # local dev server (localhost:3000)
npm run build         # production build — static export to out/
npm run start           # serve a production build
npm run lint             # next lint
npm run typecheck        # tsc --noEmit
```

## Architecture (the four vanilla-JS apps)

Each app repeats this exact layout independently:

```
<app>/
├── index.html            App shell: topbar, sidebar/bottom nav, #view-root mount point
├── manifest.webmanifest  PWA manifest
├── service-worker.js     Cache-first offline support; versioned CACHE_NAME + PRECACHE_URLS
├── icons/
├── css/{themes,main,components,animations}.css
└── js/
    ├── app.js            Boot: load state, apply theme, registerRoute(...) every view, wire nav, register service worker
    ├── core/
    │   ├── storage.js     Single-blob localStorage store: defaultState(), deepMerge migration, debounced save, subscribe() pub/sub
    │   ├── srs.js          SM-2-inspired spaced-repetition engine, app-specific interval ladder
    │   ├── audio.js         speechSynthesis + speechRecognition wrappers (locked to that app's target locale)
    │   ├── gamification.js   XP, streaks, levels/ACTFL estimation, achievements
    │   ├── router.js          Minimal hash-based SPA router (registerRoute/navigate/initRouter)
    │   └── ui.js               el()/toast()/modal()/progress-bar DOM helpers
    ├── data/               Content modules: `export const NAME = [...]` plain data, no imports
    └── views/              One module per route; each exports render(container, params)
```

Key flow: a view calls `srs.js` (`gradeItem`) on a graded interaction → updates that item's schedule → `gamification.js` awards XP/streak → `storage.js` persists, synchronously, all client-side. The Review view aggregates every due item across *all* content types from the one SRS store into a single queue — this is why every gradeable interaction in an app must feed the same engine rather than a per-feature one.

**Conventions to follow when extending any of the four apps:**
- New route: add a `views/<name>.js` exporting `render(container, params)`, then `registerRoute("path", renderFn)` in `app.js` (see the existing block there for the pattern, including `:id`-param routes like `"dialogues/:id"`).
- New content: append an object matching the existing shape to the relevant `data/*.js` file — views are schema-driven and pick up new entries automatically. Vamos documents every content shape explicitly in `js/data/SCHEMA.md`; use it as the source of truth for field names/types when adding vocabulary, grammar, dialogues, etc. there, and mirror existing entries' shape in the other three apps (no SCHEMA.md yet).
- New persisted state: add the field (with a default) to `defaultState()` in that app's `js/core/storage.js` so `deepMerge` backfills it for existing users on load.
- New JS file: add it to that app's `service-worker.js` `PRECACHE_URLS` and bump `CACHE_NAME`, or it silently won't be available offline (enforced by CI only for `mexican-spanish-tutor`).
- Hash-based routing (`#/route`), not the History API — deliberate, so the apps work from a plain static file server with no rewrite rules.
- No frameworks, no bundler, no runtime npm dependencies in these four apps — keep additions to vanilla ES modules.

`seed-english-tokyo/web` is the one exception: standard Next.js App Router conventions (`app/`, `components/`, `lib/mock-data.ts`), Tailwind + shadcn/ui-style components, no global store since there's no live backend yet.

## CI / deploy

`.github/workflows/deploy-pages.yml` builds the combined Pages site on push to `Root` or `main` (the checked-out **default branch is `Root`**, not `main` — treat it as the integration branch):
1. Runs the Mexican Spanish Tutor Playwright suite first; the whole deploy is gated on it passing.
2. Copies Vamos (root `index.html`/`css`/`js`) to the site root, and each of the other three static apps as-is into its subdirectory.
3. Builds `seed-english-tokyo/web` with `GH_PAGES_BASE_PATH=/my-first-website/seed-english-tokyo` and copies its static export in — with `continue-on-error`, so a broken Next.js build never takes down the other four apps; it's simply omitted from that deploy with a warning.

`.github/workflows/test-spanish.yml` runs the same Playwright suite (plus a syntax check and the precache-list check) on every push/PR touching `mexican-spanish-tutor/`.

## Working across apps

Because the four language apps are deliberately independent copies of the same architecture, a bug fix or feature you make in one (e.g. a `storage.js` migration-safety fix, a new exercise type in `exercises.js`) does **not** propagate automatically — check whether the same issue exists in the sibling apps and decide per-task whether to port the fix, rather than assuming a shared module was updated.
