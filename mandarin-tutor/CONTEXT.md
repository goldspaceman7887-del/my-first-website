# CONTEXT.md — Mandarin Tutor

> Scope note: this file covers **Mandarin Tutor only** (`mandarin-tutor/`), not the wider monorepo. This repo hosts several independent language-learning apps as siblings (Vamos at the repo root, Mexican Spanish Tutor, Japanese Speaking Lab, plus the Seed English Tokyo spec/scaffold) — see the repo-root `PROJECT.md` for that bird's-eye view. Each app is developed on its own branch by its own session, and Mandarin Tutor's development branch is `claude/mandarin-chinese-tutor-mqd2c3`. This file is written for whichever session picks that branch back up.

---

## Current Project State

Mandarin Tutor is a complete, single-page, offline-capable Mandarin Chinese learning app — vanilla JS (ES modules), no build step, no backend, no API keys, all progress in `localStorage`. It's deployed and live at `/mandarin-tutor/` on the shared GitHub Pages site. The app is feature-complete for its original spec and has since gone through several rounds of user-driven refinement (see **Recent Major Changes** below).

---

## Completed Features

- **Core infrastructure**: single-blob `localStorage` store with schema versioning + `deepMerge` migration (`core/storage.js`); SM-2-inspired SRS engine on a New→1→3→7→14→30→60-day ladder (`core/srs.js`); hash-based SPA router (`core/router.js`); DOM-builder + toast/modal helpers (`core/ui.js`); Web Speech API wrapper for TTS + recognition (`core/audio.js`); XP/streak/achievements (`core/gamification.js`); first-run onboarding that captures self-reported starting knowledge (`core/onboarding.js`).
- **Content**: ~174 characters, ~140 vocabulary words, 22 sentence patterns, 10 dialogues, a 24-unit Roadmap across 9 ACTFL tiers (with an HSK 1–6 track toggle and Can-Do statement checklists), 12 common-mistake patterns (Correction Mode), plus a full pinyin reference set (5 tones, 23 initials, 25 finals).
- **Learn** (`views/learn.js`) — the unified Characters+Vocabulary section: pick a batch size, learn new items one at a time, then practice each one by picking it out of a real example sentence (multiple-choice, with optional typing). Includes a merged Browse tab (search across characters and words together) and a **Toolbox** tab (see below).
- **Toolbox / "check it off"**: any character or word can be marked "already known" (from the Learn teach step or any Browse/Toolbox detail card), which drops it straight to the SRS ladder's 60-day step (`markKnown()`/`forgetItem()` in `core/srs.js`) so it stops being taught as new. The Toolbox tab lists everything mastered this way (or through normal review) and can send an item back into active study.
- **Pinyin Lab** (`views/pinyinLab.js` + `data/pinyinChart.js`) — Tones/Initials/Finals reference tabs (every entry has real audio via a genuine example character, not raw romanization) plus a "Listen & Guess" quiz (tone identification or typed-pinyin, both with lenient grading).
- **Roadmap** — Duolingo-style path UI with free navigation (no locked units), a dashed "skip ahead" node directly on the path, per-unit practice that's all multiple-choice with an optional typing alternative (never required), and unit-completion tracking (including a distinction between "completed" and "skipped").
- **Daily Lesson** (`views/dailyLesson.js`) — the 9-part structure (review → recall → new words → new characters → new sentences → conversation → shadowing → production → SRS summary), **chainable**: finishing a lesson commits its new content to the SRS and offers "Start next lesson" instead of forcing a dashboard redirect, so a learner can do as many lessons as they want in one sitting with no repeated content.
- **Speaking Mode, Immersion Mode, Story Mode, Sentence Mining, Correction Mode, Review (unified SRS queue), Achievements, Settings** — all present and were part of the original build-out; not touched in recent sessions.
- **PWA / offline support**: manifest + service worker with a versioned, fully-synced precache list (verified in sync as of this writing — see Technical Debt on why that's a manual, not automated, guarantee).
- **iOS/mobile polish**: safe-area-inset handling for notch/home-indicator, standalone-PWA meta tags, 16px-minimum input font-size (prevents iOS auto-zoom), responsive stat-card grid, verified at iPhone SE width with no horizontal overflow.
- **Data integrity**: every character/word/sentence in the app is Simplified Chinese — verified by running the entire codebase through an OpenCC traditional→simplified diff; the one traditional character found (in an explanatory mnemonic aside, not actual content) was rewritten.
- **Autosave hardening**: debounced saves now also flush synchronously on `visibilitychange`/`pagehide` (fixes iOS Safari silently dropping in-flight saves when backgrounded), plus a shadow backup `localStorage` key with automatic recovery if the primary key is ever empty/corrupted, plus a dismissible "back up your progress" nudge banner.

---

## Features In Progress

Nothing is mid-implementation right now — the app is in a stable, fully-working state. The closest things to "in progress":

- **Automated test coverage** — none exists for this app yet (see Technical Debt; this is the most important gap, not a half-built feature).
- **README.md** (in this directory) is out of date relative to the current feature set — see Important Files.

---

## Known Bugs

None currently open that I'm aware of. Two things worth flagging as edge cases rather than bugs:

- **Daily Lesson's tab strip is not clickable.** The 9 tab labels at the top of `views/dailyLesson.js` are visual progress indicators only (no `onclick`); navigation is exclusively via the Next/Back buttons at the bottom. This is longstanding (predates recent work) and may be intentional (forces linear progression through review→new→production→summary), but it's inconsistent with `learn.js`'s tabs, which *are* clickable. Confirm intent before "fixing."
- **Content exhaustion during heavy Daily Lesson chaining** is handled (a friendly "you've previewed everything" state with a link to Review) but has only been verified via a scripted Playwright test that pre-seeded the SRS to simulate exhaustion — not stress-tested through dozens of real consecutive lessons.

---

## Technical Debt

- **No automated regression suite.** The sibling app `mexican-spanish-tutor/` has a Playwright-based suite (`tests/run.mjs`, run via `npm test`) that gates the *entire monorepo's* deploy via `.github/workflows/test-spanish.yml`. Mandarin Tutor has nothing analogous — every change this session was verified with ad hoc, throwaway Playwright scripts in a scratch directory, never committed to the repo. Given this app already shipped one real user-facing data-loss bug (debounced-save-vs-iOS-backgrounding) and one stale-cache bug (service worker serving old JS after deploy) before being caught and fixed, a permanent test suite is the highest-leverage next investment.
- **Manual service-worker discipline.** `CACHE_NAME` in `service-worker.js` must be bumped by hand every time any precached file's contents change, or returning users can get served stale JS indefinitely (this exact bug happened once already — see Recent Major Changes). `PRECACHE_URLS` must also be kept in sync with the actual `js/**/*.js` file list by hand. Both are currently in sync (verified against disk while writing this file) but there's no CI check enforcing it, unlike `mexican-spanish-tutor`, which has an explicit CI step for this.
- **Small duplicated helpers across view files.** `shuffle()` and a lenient Chinese-text matcher (comparing typed answers against hanzi/pinyin, tone-optional) are each reimplemented locally in `roadmap.js`, `learn.js`, and now `pinyinLab.js` instead of living in one shared `core/` module. Fine at 3 copies; worth consolidating (e.g. into a new `core/text.js`) if a 4th shows up.
- **No formal data schema doc.** The sibling Vamos app has `js/data/SCHEMA.md` documenting the exact shape every content file must follow; Mandarin Tutor has no equivalent — the shape of `characters.js`/`vocabulary.js`/etc. entries is only discoverable by reading the views that consume them.
- **No dedicated CI workflow for this app.** Changes here ride on the shared `deploy-pages.yml` with zero gating tests specific to Mandarin Tutor (contrast with `mexican-spanish-tutor`'s dedicated `test-spanish.yml`).

---

## Recent Major Changes

Most recent first:

1. **Removed the app's one traditional character.** Ran every data/view file through an OpenCC t2s diff; found and rewrote a mnemonic note for 爱 that had referenced its traditional form 愛 for contrast. App is now verified 100% Simplified Chinese.
2. **Daily Lesson made chainable.** Finishing a lesson now actually commits its new words/characters/sentences into the SRS (previously it never did, so "new" content silently repeated forever); the finish screen offers "Start next lesson" or "Back to dashboard" instead of a forced redirect; a per-sitting session-seen set guarantees back-to-back lessons never repeat content; only the first lesson of the day gives the full +20 XP / counts toward the streak, extra lessons in the same sitting give +10 XP each.
3. **Added the Pinyin Lab** (`views/pinyinLab.js`, `data/pinyinChart.js`) — a dedicated section for tones/initials/finals with real audio, plus a Listen & Guess quiz.
4. **Added the Toolbox / "check it off" feature** — `markKnown()`/`forgetItem()` added to `core/srs.js`; wired into Learn's teach step and every Browse/Toolbox detail card.
5. **Merged Characters + Vocabulary into one unified "Learn" section** (`views/learn.js`), replacing three separate pages/routes. Old `characters.js`/`vocabulary.js`/`charVocab.js` view files were deleted; `#/characters`, `#/vocabulary`, `#/char-vocab` are still registered as routes (all pointing at `renderLearn`) purely so old links/bookmarks don't 404.
6. **Roadmap practice redesigned**: all exercises are multiple-choice by default now, with typing offered as a clearly optional alternative — was previously a mix that sometimes forced a typed answer.
7. **Fixed a real progress-loss bug**: iOS Safari's unreliable `beforeunload` combined with the 150ms debounced save could drop in-flight writes when the app was backgrounded. Fixed with `visibilitychange`/`pagehide` flush-on-hide plus a shadow backup `localStorage` key with auto-recovery.
8. **Fixed a stale-service-worker-cache bug**: the fetch handler used a global `caches.match()` that could serve content from an old, not-yet-evicted cache regardless of `CACHE_NAME` bumps. Now every cache read/write is explicitly scoped via `caches.open(CACHE_NAME)`, and the app auto-reloads once when a new service worker takes control.
9. **iPhone/desktop responsive polish** — safe-area insets, PWA standalone meta tags, zoom-prevention, responsive stat grid.
10. **Roadmap "skip this unit"** — a dashed skip-ahead node directly on the path (matching a Duolingo-style reference the user provided), with the confirmation popup removed per explicit user feedback ("I don't want this popup").

---

## Next Priorities

Recommended order:

1. **Add an automated regression suite**, modeled directly on `mexican-spanish-tutor/tests/run.mjs`: every route renders without console errors, character/vocabulary/sentence data integrity (required fields present, ids unique), `localStorage` persistence across reload (including the backup-key recovery path), a check that `service-worker.js`'s precache list matches the actual file tree, and a mobile-layout check (no horizontal overflow at iPhone SE width). This is the single highest-leverage next step.
2. **Add a dedicated CI workflow** (e.g. `test-mandarin.yml`) that runs that suite on every push touching `mandarin-tutor/`, and consider gating `deploy-pages.yml` on it the way `test-spanish.yml` gates the whole monorepo today.
3. **Update `mandarin-tutor/README.md`** — it still describes "Characters" and "Vocabulary" as two separate features and doesn't mention Learn, Toolbox, or Pinyin Lab at all. Whoever touches this app next should refresh it (or fold it into this file) before it drifts further.
4. **Consolidate duplicated helpers** (`shuffle()`, the lenient Chinese-answer matcher) into a shared `core/` module now that a third independent copy exists in `pinyinLab.js`.
5. **Audit Achievements and Settings** — neither has been touched or reviewed in any of the recent sessions; worth checking whether any achievement conditions reference the old Characters/Vocabulary structure in spirit (even though the routes themselves still resolve fine via the `renderLearn` redirect).
6. **Decide and document Daily Lesson's tab-click behavior** (see Known Bugs) — either make the tabs clickable for consistency with Learn, or leave it and note the linear-only design as intentional.
7. **Expand content further** (more HSK3+ characters/vocabulary, more dialogues) if the product direction calls for it — there's an established batch-expansion pattern already used once (a 64-character HSK1–4 batch) to follow.

---

## Important Files

- **`js/core/storage.js`** — the state store. `defaultState()` is the authoritative schema: any new persisted field *must* be declared here or `deepMerge` will silently drop it on load for existing users. Also home to the dual-key (`mzh_state_v1` / `mzh_state_v1_backup`) backup pattern and the debounced-vs-immediate (`save()` vs `saveNow()`) save split.
- **`js/core/srs.js`** — the spaced-repetition engine. `INTERVAL_STEPS` is the interval ladder; `gradeItem()` is the one true entry point for scheduling; `markKnown()`/`forgetItem()` back the Toolbox feature; `dueItems()`/`newItems()`/`masteryLevel()` are used throughout the views.
- **`js/app.js`** — route registration is the source of truth for what URLs exist (including the three legacy redirect routes to `renderLearn`), plus the service-worker registration/update/auto-reload logic.
- **`service-worker.js`** — offline cache. `CACHE_NAME` must be bumped whenever any precached file's *content* changes; `PRECACHE_URLS` must list every file under `js/**/*.js` plus every CSS/HTML/icon asset. No CI enforces this — check manually (a one-line Python `glob` diff against the precache list, as used while writing this file, takes seconds).
- **`js/views/learn.js`** — the largest, most complex view: the unified Learn/Browse/Toolbox flow. Good reference for the "batch → teach → practice-in-context" pattern and for the `markKnown`/`forgetItem` Toolbox wiring.
- **`js/views/roadmap.js`** — the main curriculum path; the other large, data-driven view. Reference for the skip-ahead path UI and the all-multiple-choice-with-optional-typing practice pattern (also used in `learn.js`'s practice phase).
- **`js/views/dailyLesson.js`** — recently reworked; good reference for the "commit newly-taught content to the SRS on completion, track what's been shown this sitting to avoid repeats" pattern, which could be reused if another chainable/session-based feature is ever built.
- **`js/data/*.js`** (`characters.js`, `vocabulary.js`, `sentences.js`, `dialogues.js`, `roadmap.js`, `canDo.js`, `pinyinChart.js`, `mistakePatterns.js`, `stories.js`) — all learning content. No formal schema doc exists; infer shape from the view(s) that import each file.
- **`README.md`** (this directory) — the original feature-map/architecture writeup. **Currently stale** (see Next Priorities #3).

---

## Current Architecture Notes

- **No build step, no bundler, no npm dependencies for the app itself.** Pure ES modules loaded directly by the browser via relative imports. Any new file added to `js/` must also be added to `service-worker.js`'s `PRECACHE_URLS`, or it won't be available offline.
- **One `localStorage` key is the entire persistence layer** (`mzh_state_v1`, shadowed by `mzh_state_v1_backup`). Don't introduce a second storage mechanism (IndexedDB, cookies, a different key) — every view imports the same `store` singleton and assumes synchronous, in-memory access to the whole state tree.
- **SRS ids follow a strict `type_dataId` convention**: `character_<id>`, `word_<id>`, `sentence_<id>`, `roadmap_<id>`. Any new gradeable content type must follow this convention, since `review.js`'s `resolveItem()` (and similar lookups elsewhere) parse the id prefix to route to the right data file.
- **Views are plain functions**, `render<Name>(container, params?)`, registered in `app.js` — no component framework, no JSX, no virtual DOM. DOM is built via the `el(tag, attrs, children)` helper in `core/ui.js`. Known gotcha: boolean HTML attributes (e.g. `disabled`) must be passed as `condition ? "true" : null`, never a raw JS boolean, because `el()` calls `setAttribute` for any non-null/undefined value.
- **Audio is always synthesized live** via `audioEngine.speak()` / `speakSlow()` (Web Speech API, `zh-CN` voice lock). There are no shipped audio files anywhere in this app — never add one; use the audio engine.
- **This app is one of several siblings in a shared monorepo.** It deploys to `/mandarin-tutor/` on a shared GitHub Pages site whose actual build source is the `Root` integration branch, not this feature branch directly. To deploy: work on `claude/mandarin-chinese-tutor-mqd2c3`, then separately fetch/merge into a worktree tracking `Root`, copy over just the changed files, and push — always diff `Root`'s latest commits for changes under `mandarin-tutor/` first, since other sibling-app sessions push to `Root` concurrently and could otherwise be clobbered.
- **Old routes `#/characters`, `#/vocabulary`, `#/char-vocab` are intentionally still registered** (all pointing at `renderLearn`) purely so pre-existing bookmarks/links don't break after the Learn merge — don't "clean these up" without confirming nothing external depends on them.

---

## Future Session Instructions

- Treat every feature listed under **Completed Features** as already done and working — verify by reading the relevant file(s) if you need specifics, but do not rebuild them from scratch.
- Preserve the existing architecture (single-blob localStorage store, hash router, plain-function views, `el()`-based DOM construction, live-synthesized audio, SM-2-style SRS on the app's own interval ladder) unless a change genuinely requires deviating from it — and if it does, explain why in an update to this file.
- Follow the design patterns already established in the codebase rather than introducing new ones: e.g., new batch/session flows should follow `dailyLesson.js`'s "commit to SRS on completion + track session-seen ids" pattern; new practice/quiz UI should reuse the `.exercise-card` / `.option-list` / `.option-btn` / `.feedback-block` CSS classes and the all-MC-with-optional-typing interaction pattern already used in `roadmap.js` and `learn.js`.
- Before deploying, bump `service-worker.js`'s `CACHE_NAME` if any cached file changed, and re-verify `PRECACHE_URLS` matches the file tree (see Important Files).
- Update this `CONTEXT.md` (particularly **Recent Major Changes**, **Next Priorities**, and **Known Bugs**) at the end of any substantial session, the same way it was written this time — so the next session starts from ground truth instead of re-deriving it.
