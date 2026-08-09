# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory (`mandarin-tutor/`).

## What this is

Mandarin Tutor: a complete, single-page web app teaching Mandarin Chinese (beginner → conversational fluency), deployed at `/mandarin-tutor/` on the combined GitHub Pages site. It is one of five sibling projects in this monorepo — see the repo-root `CLAUDE.md` and `PROJECT.md` for how it fits alongside the others. This directory is a **fully independent codebase**: it does not import or share code with `mandarin-tutor`'s sibling apps, even though the module layout looks the same.

Built entirely with vanilla HTML/CSS/JavaScript (ES modules) — no build step, no backend, no API keys, no third-party runtime dependencies. Every lesson follows **meaning → sentence → conversation → vocabulary → characters → grammar explanation**, never starting from an abstract grammar rule.

## Running locally

No build step, no `npm install` needed. Serve over HTTP — ES modules require `http(s)://`, not `file://`:

```bash
# from this directory (mandarin-tutor/)
python3 -m http.server 8080
# open http://localhost:8080/index.html
```

There is no test suite for this app (unlike `mexican-spanish-tutor/`, which has an automated Playwright regression suite) — verify changes manually in the browser.

## Architecture

```
index.html                 App shell (topbar, sidebar nav, #view-root)
css/
  themes.css                Light/dark design tokens (CSS custom properties)
  main.css                  Layout, responsive breakpoints
  components.css            Cards, buttons, flashcards, chat bubbles, correction blocks, etc.
  animations.css            Transitions, confetti, reduced-motion support
js/
  app.js                    Boot: theme, nav, routes, topbar stats
  core/
    storage.js               Single-blob localStorage store + subscribe API + shadow backup
    srs.js                    SM-2-inspired spaced repetition engine
    audio.js                  speechSynthesis (zh-CN) + speechRecognition wrappers
    gamification.js           XP, streaks, achievements, the Level 0-4 difficulty system
    router.js                 Minimal hash-based (#/route) SPA router
    ui.js                     el()/toast()/modal()/progress-bar DOM helpers
    pinyin.js                 Diacritic pinyin -> tone-number conversion
    lookup.js                 Character-by-hanzi lookup, word -> character breakdown
    onboarding.js             First-run flow that captures known characters
  data/
    characters.js             110 characters with full breakdowns
    vocabulary.js              ~150 HSK1/2 words across priority categories
    sentences.js                22 core grammar patterns
    dialogues.js                 10 beginner dialogues
    stories.js                    4 graded mini-stories
    mistakePatterns.js             12 rule-based common-mistake detectors
  views/                     One module per route: dashboard, characters, vocabulary,
                              sentences, dialogues, review, achievements, settings,
                              dailyLesson, speaking, immersion, story, mining, correction
```

Every view module exports `render(container, params)` and is registered as a route in `app.js`.

## Key conventions

- **State**: one versioned JSON blob in `localStorage` (key `mzh_state_v1`), built from `defaultState()` in `js/core/storage.js` and loaded via `deepMerge(defaultState(), savedState)`. Add a new field to `defaultState()` and the merge backfills it for existing users — never introduce a second `localStorage` key or bypass the `Store` class.
- **Shadow backup**: this app additionally writes a mirrored `mzh_state_v1_backup` key on every save and flushes on `visibilitychange`/`pagehide`, restoring from it if the primary key is ever found empty — this exists to survive iOS Safari's aggressive background tab eviction. Keep both keys in sync if you touch the save path in `storage.js`; don't remove the backup write.
- **Routing**: hash-based (`#/route`), not the History API, so the app works from a plain static file server. Keep new routes hash-based.
- **SRS**: `js/core/srs.js` implements an SM-2-inspired algorithm on this app's interval ladder — **New → 1 → 3 → 7 → 14 → 30 → 60 days** — modulated by an ease factor from review quality (0–5). Every gradeable interaction (character/word/sentence flashcards, Daily Lesson, review sessions) must feed this same queue so the unified Review view stays comprehensive; don't build a one-off progress mechanism for a new content type.
- **Audio**: `js/core/audio.js` wraps `SpeechSynthesis` (locked to `zh-CN` voices, normal/slow playback, shadowing-loop mode) and `SpeechRecognition`. No shipped audio files, no third-party speech service, no API keys. New speaking features must degrade gracefully when `SpeechRecognition` is unavailable (effectively Chrome/Edge-only) — fall back to typed self-comparison.
- **Pinyin**: always go through `js/core/pinyin.js` for diacritic-pinyin <-> tone-number conversion rather than hand-rolling regex; character-by-hanzi lookups go through `js/core/lookup.js`.
- **Content data**: append objects matching the existing shape in the relevant `js/data/*.js` file — views are schema-driven and pick up new entries automatically. The mistake-correction detector (`data/mistakePatterns.js`) follows a fixed shape: `{ id, test, mistakeExplained, correctVersion, literal, conversational, rule, examples }`, live everywhere `checkText()` is called once added.
- **Onboarding**: `js/core/onboarding.js` drives the first-run flow that captures which of the ~40 most common characters the learner already knows, so the app never re-teaches known material. New content that assumes character/word prerequisites should respect this "known" state rather than assuming a blank slate.
- **Service worker**: `service-worker.js` does cache-first offline caching with a versioned `CACHE_NAME` and an explicit precache list (manifest at `manifest.webmanifest`). Bump `CACHE_NAME` and keep the precache list in sync whenever you add/rename/remove a cached file (any `js/`, `css/`, or root asset) — there's no CI check for this in this app (unlike `mexican-spanish-tutor/`), so it's on you to keep it correct manually.

## Content scope

Target: Mandarin Chinese, beginner (HSK1/2-level vocabulary, 110 high-frequency characters) through conversational fluency. Keep new vocabulary/sentence/dialogue content consistent with the existing level bands and the Level 0–4 difficulty system (25 → 100 → 250 → 500 → 1000+ characters known) used on the dashboard and in gamification.
