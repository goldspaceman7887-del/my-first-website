# Mexican Spanish Immersion Tutor 🇲🇽 — Novice to ACTFL Advanced Low

A complete, single-page web app that acts as an elite Mexican Spanish tutor, ACTFL assessor, curriculum designer, conversation coach, and spaced-repetition system. Built entirely with vanilla HTML/CSS/JavaScript (ES modules) — no build step, no backend, no API keys. Everything runs locally in the browser and persists via `localStorage`.

> Target dialect: **modern, everyday Mexican Spanish** — carro (not coche), manejar, ¿qué onda?, ¿mande?, ahorita, órale, qué padre. Spain Spanish is never taught here except as an explicit comparison.

## Why this exists

The goal isn't to hand you random vocabulary lists — it's to systematically build speaking, listening, reading, writing, vocabulary acquisition, conversational fluency, storytelling, and long-term retention through spaced repetition, all tracked against the **ACTFL proficiency scale** (Novice Low → Novice Mid → Novice High → Intermediate Low → Intermediate Mid → Intermediate High → Advanced Low). Every lesson prioritizes communication over grammar memorization, and every grammar rule is taught **meaning → example → conversation → pattern → explanation**, never starting with theory.

## Feature map

| System | What it does |
|---|---|
| **Dashboard** | Current ACTFL level estimate, strengths/weaknesses, requirements for the next level, XP/streak, reviews due, and a study heatmap |
| **ACTFL Roadmap** | Browse all 7 levels' Can-Do statements and check them off yourself, plus a Duolingo-style path of 16 units (one per FREQUENCY PRIORITY topic: greetings → questions → family → food → shopping → directions → routines → work → friends → travel → opinions → storytelling → argumentation) with level-appropriate sentences |
| **Vocabulario** | ~100 high-frequency Mexican Spanish words/expressions, each with meaning, IPA pronunciation, register (formal/informal/slang), Mexican usage notes, common expressions, example sentences, a mini-dialogue, a speaking prompt, and a review question — SRS flashcards + a searchable/filterable browser |
| **Gramática (Sentences)** | 20 core grammar patterns from ser/estar through hypothetical subjunctives and paragraph-level connectors, each anchored to a real sentence: vocab breakdown, the rule in plain English, similar sentences, a conversation expansion, and a speaking replacement-drill |
| **Diálogos** | 16 realistic dialogues spanning every FREQUENCY PRIORITY topic and every ROLEPLAY MODE scenario (restaurant, airport, hotel, store, doctor, job interview, meeting new friends, dating, travel, family gathering) — listen, read along, check comprehension |
| **Daily Lesson** | The spec's 9-part structure end to end: Review → Recall Drills → New Vocabulary → Useful Sentences → Mini Dialogue → Listening Simulation → Speaking Practice → an ACTFL Task matched to your current level → a Progress Update |
| **Roleplay Mode** | An interactive role-play built from the Diálogos data — the bot plays one role aloud, you produce the other (typed or via the Web Speech API mic where supported), and every line is corrected with the native Mexican version, never just marked wrong |
| **Conversation Mode** | A free-flowing Mexican conversation partner — mostly Spanish, brief in-line corrections (never a lecture), always a follow-up question, difficulty adjustable via the immersion dial |
| **Immersion Mode** | Spanish only, start to finish. Typing "?" or "no entiendo" gets you a simplified line with an English hint, then it's straight back to Spanish |
| **Story Mode** | Graded mini-stories built almost entirely from taught vocabulary, shown paragraph by paragraph (Spanish/English) with vocab review, comprehension questions, speaking questions, and a full retelling exercise |
| **OPI Practice** | A simulated ACTFL Oral Proficiency Interview — warm-up, level checks, topic development, narration, description, opinion discussion, and an advanced task — scored by a rule-based heuristic (length, past-tense usage, connector complexity, common mistakes) into an estimated ACTFL level, strengths, weaknesses, and an improvement plan |
| **Writing Coach (Correction Mode)** | Write a sentence, get it checked against 13 of the most common English-speaker Mexican Spanish mistakes (ser/estar, por/para, personal a, gustar construction, reflexive verbs, subjunctive triggers, tú/usted mismatches, preterite/imperfect confusion, and more) — each with your version, the corrected version, a natural Mexican version, the rule, and examples |
| **Review** | Unified spaced-repetition queue across vocabulary and sentence patterns |
| **Achievements** | XP, streaks, and 19 unlockable badges |

## Spaced repetition engine

`js/core/srs.js` implements an SM-2-inspired algorithm on the interval ladder from the spec: **New → 1 → 3 → 7 → 14 → 30 → 60 days**, modulated by an ease factor that grows/shrinks with review quality (0–5 scale). Every gradeable interaction (vocabulary/sentence flashcards, review sessions) feeds the same engine.

## ACTFL tracking

`js/data/roadmap.js` defines the 7 ACTFL levels this app targets and their Can-Do statements verbatim from the spec. `js/core/gamification.js` computes a composite level estimate from XP earned plus Can-Do statements checked off. The Dashboard shows your current level, strengths, weaknesses, and exactly what's needed for the next level; OPI Practice periodically re-estimates it from live speaking/writing samples.

## Audio

No shipped audio files. All speech is synthesized live via the browser's `SpeechSynthesis` API, preferring `es-MX` voices (falling back to other Latin American Spanish, then any Spanish) with normal/slow playback and a shadowing-loop mode. Speaking assessment uses the `SpeechRecognition` API where the browser supports it (Chrome/Edge) and degrades gracefully to typed self-comparison elsewhere.

## Architecture / file structure

```
index.html                 App shell (topbar, sidebar nav, #view-root)
css/
  themes.css                Light/dark design tokens (CSS custom properties)
  main.css                    Layout, responsive breakpoints
  components.css                Cards, buttons, flashcards, chat bubbles, correction blocks, etc.
  animations.css                  Transitions, confetti, reduced-motion support
js/
  app.js                     Boot: theme, nav, routes, topbar stats
  core/
    storage.js                Single-blob localStorage store + subscribe API
    srs.js                      SM-2-inspired spaced repetition engine
    audio.js                      speechSynthesis (es-MX) + speechRecognition wrappers
    gamification.js                 XP, streaks, ACTFL level estimation, achievements
    router.js                         Minimal hash-based SPA router
    ui.js                               el()/toast()/modal()/progress-bar DOM helpers
    onboarding.js                        First-run flow that captures a self-reported ACTFL level
  data/
    roadmap.js                 ACTFL levels + Can-Do statements + 16-unit sentence path
    vocabulary.js                ~100 vocabulary entries across FREQUENCY PRIORITY categories
    sentences.js                   20 grammar patterns, beginner through Advanced Low
    dialogues.js                     16 dialogues covering every ROLEPLAY MODE scenario
    stories.js                         5 graded mini-stories
    mistakePatterns.js                   13 rule-based common-mistake detectors
  views/
    dashboard.js, roadmap.js, vocabulary.js, sentences.js, dialogues.js,
    review.js, achievements.js, settings.js,
    dailyLesson.js, roleplay.js, conversation.js, immersion.js, story.js,
    opi.js, correction.js
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

All progress (XP, streak, SRS state, Can-Do checklist, session logs) is stored only in the browser's `localStorage` under a single key. Nothing is sent to a server. Settings → "Export progress" / "Import progress" lets you back up or move your data as JSON.

## Extending the content

To add more vocabulary, sentence patterns, dialogues, or stories, append objects matching the existing shape in the relevant `data/*.js` file — the views are schema-driven and pick up new entries automatically. The mistake detector in `data/mistakePatterns.js` follows the same pattern: add a `{ id, test, mistakeExplained, correctVersion, natural, rule, examples }` object and it's live everywhere `checkText()` is called.
