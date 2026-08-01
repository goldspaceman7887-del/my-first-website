# Mandarin Tutor 🀄 — a systematic path to conversational fluency

A complete, single-page web app that acts as an elite Mandarin Chinese tutor, curriculum designer, conversation coach, and spaced-repetition system. Built entirely with vanilla HTML/CSS/JavaScript (ES modules) — no build step, no backend, no API keys. Everything runs locally in the browser and persists via `localStorage`.

## Why this exists

The goal isn't to hand you random vocabulary lists — it's to systematically build speaking ability, listening ability, character recognition, sentence comprehension, conversational fluency, and long-term retention through spaced repetition. Every lesson follows the order **meaning → sentence → conversation → vocabulary → characters → grammar explanation**, never starting with a grammar rule.

## Feature map

| System | What it does |
|---|---|
| **Dashboard** | The memory system at a glance: known characters, characters currently learning, mastered words, active sentences, reviews due, streak/XP, and the Level 0–4 difficulty system (25 → 100 → 250 → 500 → 1000+ characters) |
| **Onboarding** | Captures your real starting point — pick which of the ~40 most common characters you already know (defaults to "I know ~25") so the app never re-teaches what you've got |
| **Characters** | 110 high-frequency characters, each with the full spec breakdown: pinyin, meaning, frequency, words that use it, example sentences, a mini conversation, a memory trick, and pronunciation coaching (tone number + common English-speaker tone mistakes) |
| **Vocabulary** | ~150 HSK1/2-level words across greetings, family, food, directions, time, shopping, work, travel, emotions, daily routines, opinions, questions, and common verbs — each with collocations, example sentences, a short dialogue, character breakdown, a speaking prompt, and a review question |
| **Sentence Patterns** | 22 core grammar patterns, each anchored to a real sentence with vocab breakdown, the grammar rule in plain English, similar sentences, a conversation expansion, and a speaking drill (swap the slot word) |
| **Dialogues** | 10 realistic beginner conversations (greetings, ordering food, directions, shopping, family, weekend plans, weather, taxis, first day of school, feeling sick) with full audio playback and comprehension checks |
| **Daily Lesson Mode** | The spec's 9-part structure end to end: review due material → recall drills → 3–5 new words → 3 new characters → 3 new sentences → conversation practice → shadowing → production practice → an SRS summary |
| **Speaking Mode** | A role-play conversation partner built from the Dialogues data — the bot plays one role aloud via speech synthesis, you produce the other (typed or via the Web Speech API mic where supported), and every line is corrected with the native version, never just marked wrong |
| **Immersion Mode** | Chinese only, start to finish. Typing "?" or "不懂" gets you a simplified line with pinyin and an English hint, then it's straight back to Chinese |
| **Story Mode** | Graded mini-stories built almost entirely from taught vocabulary, shown paragraph by paragraph (Chinese/pinyin/English) with vocab review, comprehension questions, and speaking questions |
| **Sentence Mining Mode** | Paste any Chinese text (dialogue, subtitles, an article) and it extracts sentences, matches curriculum vocabulary/characters, and lets you push flashcards straight into today's review queue |
| **Correction Mode** | Write a sentence, get it checked against 12 of the most common English-speaker Mandarin mistakes (missing 很, 不 vs 没, missing measure words, word order, redundant question markers, and more) — each with an explanation, the native version, the literal reading of your version, and a natural conversational version |
| **Review** | Unified spaced-repetition queue across characters, words, and sentence patterns |
| **Achievements** | XP, streaks, and 17 unlockable badges |

## Spaced repetition engine

`js/core/srs.js` implements an SM-2-inspired algorithm on the interval ladder from the spec: **New → 1 → 3 → 7 → 14 → 30 → 60 days**, modulated by an ease factor that grows/shrinks with review quality (0–5 scale). Every gradeable interaction (character/word/sentence flashcards, review sessions) feeds the same engine.

## Audio

No shipped audio files. All speech is synthesized live via the browser's `SpeechSynthesis` API locked to `zh-CN` voices, with normal/slow playback and a shadowing-loop mode. Speaking assessment uses the `SpeechRecognition` API where the browser supports it (Chrome/Edge) and degrades gracefully to typed self-comparison elsewhere.

## Architecture / file structure

```
index.html                 App shell (topbar, sidebar nav, #view-root)
css/
  themes.css                Light/dark design tokens (CSS custom properties)
  main.css                    Layout, responsive breakpoints
  components.css               Cards, buttons, flashcards, chat bubbles, correction blocks, etc.
  animations.css                Transitions, confetti, reduced-motion support
js/
  app.js                     Boot: theme, nav, routes, topbar stats
  core/
    storage.js                Single-blob localStorage store + subscribe API
    srs.js                      SM-2-inspired spaced repetition engine
    audio.js                     speechSynthesis (zh-CN) + speechRecognition wrappers
    gamification.js               XP, streaks, achievements, the Level 0-4 difficulty system
    router.js                     Minimal hash-based SPA router
    ui.js                          el()/toast()/modal()/progress-bar DOM helpers
    pinyin.js                      Diacritic pinyin → tone-number conversion
    lookup.js                      Character-by-hanzi lookup, word → character breakdown
    onboarding.js                  First-run flow that captures known characters
  data/
    characters.js               110 characters with full breakdowns
    vocabulary.js                 ~150 words across priority categories
    sentences.js                   22 grammar patterns
    dialogues.js                    10 dialogues
    stories.js                       4 graded mini-stories
    mistakePatterns.js                12 rule-based common-mistake detectors
  views/
    dashboard.js, characters.js, vocabulary.js, sentences.js, dialogues.js,
    review.js, achievements.js, settings.js,
    dailyLesson.js, speaking.js, immersion.js, story.js, mining.js, correction.js
```

Every view module exports a `render(container, params)` function registered with the router in `app.js`. There is no build step — open `index.html` through any static file server and it runs.

## Running locally

```bash
# from this directory
python3 -m http.server 8080
# then open http://localhost:8080/index.html
```

(ES modules require `http(s)://`, not `file://`.)

## Data & privacy

All progress (XP, streak, SRS state, known characters, session logs) is stored only in the browser's `localStorage` under a single key. Nothing is sent to a server. Settings → "Export progress" / "Import progress" lets you back up or move your data as JSON.

## Extending the content

To add more characters, vocabulary, sentence patterns, dialogues, or stories, append objects matching the existing shape in the relevant `data/*.js` file — the views are schema-driven and pick up new entries automatically. The correction detector in `data/mistakePatterns.js` follows the same pattern: add a `{ id, test, mistakeExplained, correctVersion, literal, conversational, rule, examples }` object and it's live everywhere `checkText()` is called.
