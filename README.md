# Vamos 🇪🇸 — Español de España, de cero a Advanced Low

A complete, production-quality, single-page web app for learning **Peninsular (Spain) Spanish** from absolute beginner (A0) to **ACTFL Advanced Low**. Built entirely with vanilla HTML/CSS/JavaScript (ES modules) — no build step, no backend, no API keys. Everything runs locally in the browser and persists via `localStorage`.

> Target dialect: **Spain Spanish only** — vosotros, coche/móvil/ordenador/piso/zumo/coger/vale/bocadillo/patata, Castilian pronunciation. Latin American forms are only ever mentioned as explicit comparisons.

## Why this exists

The curriculum is built around evidence-based language acquisition principles: comprehensible input, active recall, spaced repetition (SM-2 inspired), deliberate practice, shadowing, listening-first learning, task-based learning, frequent speaking practice, interleaving, and progressively increasing immersion. The content ratio is weighted toward real communicative competence: dialogues and listening/speaking dominate over rote grammar drilling, because the goal is **fluency in Spain**, not textbook trivia.

## Feature map

| System | What it does |
|---|---|
| **Dashboard** | XP, streak, level (MCER A0–C1), reviews due, skill-score rings (speaking/listening/grammar/vocabulary/cultural), study heatmap, next-lesson nudge |
| **Grammar Lab** | 32 concepts across Beginner/Intermediate/Advanced tiers, each with a simple + detailed explanation, English comparison, common mistakes, Spain-specific examples, memory tricks, a visual/table explanation, and 4-6 mixed-type exercises (multiple-choice, fill-in-blank, error-correction, translation, sentence-building, dialogue-completion) |
| **Vocabulary Trainer** | ~300 high-frequency Spain-Spanish words/phrases; SRS flashcard mode + a searchable/filterable explorer with mastery bars |
| **Dialogue Academy** | ~28 realistic dialogues (beginner → ACTFL Advanced Low "challenge" scenarios like a missed train, a lost passport, a housing dispute). Every dialogue ships all 12 required parts: scenario, audio-enabled dialogue, vocabulary breakdown, grammar-in-context notes, comprehension questions, speaking tasks, a dictation exercise, an 8-field cultural-notes block, common foreigner mistakes, and an ACTFL Advanced Low extension task |
| **Listening System** | Slow / natural / fast playback of dialogue and reading content, comprehension mode and free-dictation mode |
| **Speaking System** | Pronunciation shadowing (single words/expressions), sentence-level shadowing loops, extended paragraph-speaking prompts, and role-play links into the Dialogue Academy. Uses the Web Speech Recognition API when available for live transcription/self-assessment, and degrades gracefully to voice-only practice otherwise |
| **Reading System** | 10 passages at progressive difficulty (A0 → C1), all Spain-set, with glossed vocabulary and comprehension questions |
| **Writing System** | 15 guided prompts (journal, opinion, storytelling, professional) with a checklist-driven heuristic feedback pass and a model answer |
| **Spain Cultural Immersion** | 33 topics across food, social life, work, university, housing, transport, healthcare, bureaucracy, festivals, and modern Spain — each with a Spain-vs-UK-vs-US comparison and a knowledge quiz |
| **Review Dashboard (SRS)** | Anki/SM-2-inspired spaced repetition across vocab, grammar, dialogues, listening, speaking, and reading, with due/overdue counts and a "weakest items first" forgetting-curve view |
| **AI Tutor** | Three rule-based tools that run entirely client-side: a grammar-question search over the Grammar Lab, a common-mistake sentence corrector (explains the error, gives the correct form, the rule, and 3 examples, then schedules an SRS review), and a scripted conversational role-play with live correction |
| **Achievements** | XP levels (A0→C1), streaks, and 18 unlockable badges |

## Spaced repetition engine

`js/core/srs.js` implements an SM-2-inspired algorithm on a fixed interval ladder matching the spec: **same day → 1 → 3 → 7 → 14 → 30 → 90 → 180 days**, modulated by an ease factor that grows/shrinks with review quality (0–5 scale). Every gradeable interaction in the app (flashcards, grammar exercises, dialogue completion, dictation, reading quizzes, culture quizzes, speaking drills) feeds the same engine, so the Review Dashboard reflects your *entire* learning surface, not just vocabulary.

## Audio

There are no shipped audio files. All speech is synthesized live via the browser's `SpeechSynthesis` API locked to `es-ES` voices (with male/female preference, adjustable speed, and a shadowing loop mode). This keeps the app fully offline-capable, avoids stale recordings, and works identically for all ~300 vocabulary items, all dialogue lines, and all reading passages. Speaking assessment uses the `SpeechRecognition` API where the browser supports it (Chrome/Edge) and falls back to guided self-practice elsewhere.

## Architecture / file structure

```
index.html                 App shell (topbar, sidebar nav, #view-root)
css/
  themes.css                Light/dark design tokens (CSS custom properties)
  main.css                   Layout, responsive breakpoints
  components.css             Cards, buttons, flashcards, exercises, modals, etc.
  animations.css              Transitions, confetti, reduced-motion support
js/
  app.js                     Boot: theme, nav, routes, topbar stats
  core/
    storage.js                Single-blob localStorage store + subscribe API
    srs.js                     SM-2-inspired spaced repetition engine
    audio.js                   speechSynthesis + speechRecognition wrappers
    gamification.js            XP, levels, streaks, achievements
    router.js                  Minimal hash-based SPA router
    ui.js                       el()/toast()/modal()/progress-bar DOM helpers
    exercises.js                Generic renderer+grader for the 6 exercise types
  data/
    SCHEMA.md                   Authoritative shape for every data file
    curriculum.js                A0→C1 lesson map (drives the dashboard nudge)
    vocabulary.js                 ~300 vocabulary entries
    grammar.js                     32 grammar concepts + exercises
    dialogues-beginner-intermediate.js   13 dialogues
    dialogues-advanced.js                15 dialogues (advanced + Advanced Low challenges)
    culture.js                      33 cultural topics + comparisons + quizzes
    reading.js                       10 reading passages
    expressions.js                    22 colloquial Spain expressions
    writing.js                         15 writing prompts
    mistakePatterns.js                 Rule-based common-mistake detector (AI Tutor)
  views/
    dashboard.js, vocabulary.js, grammar.js, dialogues.js, listening.js,
    speaking.js, reading.js, writing.js, culture.js, review.js, tutor.js,
    achievements.js, settings.js
```

Every view module exports a `render(container, params)` function registered with the router in `app.js`. There is no build step — open `index.html` through any static file server and it runs.

## Running locally

```bash
# from the project root
python3 -m http.server 8080
# then open http://localhost:8080/index.html
```

(ES modules require `http(s)://`, not `file://`.)

## Deployment

This is a fully static site — deploy the repository as-is to any static host:

- **GitHub Pages**: enable Pages on this repo (root, or a `gh-pages` branch), no build step required.
- **Netlify / Vercel / Cloudflare Pages**: publish directory = repository root, build command = none.
- **Any web server** (nginx, S3 + CloudFront, etc.): copy the files as-is; just ensure it serves `.js` with `Content-Type: application/javascript` (virtually all do by default) since the app loads ES modules.

## Data & privacy

All progress (XP, streak, SRS state, quiz scores, writing submissions, settings) is stored only in the browser's `localStorage` under a single key. Nothing is sent to a server. Settings → "Exportar progreso" / "Importar progreso" lets you back up or move your data as JSON.

## Extending the content

Every content type has a documented schema in `js/data/SCHEMA.md`. To add more vocabulary, grammar concepts, dialogues, readings, or cultural topics, append objects matching that shape to the relevant `data/*.js` file — the views are schema-driven and will pick up new entries automatically.
