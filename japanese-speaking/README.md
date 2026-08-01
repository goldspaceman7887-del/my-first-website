# 上級への道 (The Road to Advanced) — Japanese Advanced Speaking Lab

A focused, single-page web app for taking your Japanese speaking from ACTFL **mid-Intermediate High** through **Advanced Mid** in an intensive 3-month (12-week) plan, then straight into **Advanced High**. Built around the specific gap most learners hit at this stage: connecting individual sentences into fluent, cohesive paragraphs, with real grammar precision underneath.

No build step, no backend, no API keys — vanilla HTML/CSS/JS (ES modules), progress stored in `localStorage`.

## Features

| Page | What it does |
|---|---|
| **Guide** | Explains what actually changes between ACTFL sublevels, why the 3-month plan is intense by design, and how to use this app to close the gap. |
| **Connector Lab** | ~40 discourse connectors (接続表現) across 10 categories (sequence, cause, result, contrast, condition, example, summary, opinion, emphasis) with example two-sentence chains, audio playback, and a quiz mode. This is the core toolkit for linking sentences into paragraphs. |
| **Grammar Ladder** | 44 sentence-internal grammar structures leveled IH (6, review) → AL (14) → AM (16) → AH (8), each with structure pattern, explanation, example sentences with audio, and common mistakes. Includes a quiz mode. |
| **Level Ladder** | 6 prompts, each answered at all 4 ACTFL sublevels side by side, annotated to show exactly what grammar/connector/structural change moves an answer up a level. |
| **Paragraph Practice** | 6 ACTFL Advanced-level speaking functions (narrate in the past, handle a complication, compare & contrast, support an opinion, hypothesize, describe in detail), each with topic prompts and a move-by-move scaffold. Uses the Web Speech Recognition API (Chrome/Edge) to transcribe your spoken paragraph live, then gives feedback on sentence count, connector variety, and duration. Falls back to a manual-transcript mode where recognition isn't supported. |
| **Shadowing** | Model paragraph-length monologues (with connectors highlighted) for each speaking function, played via `speechSynthesis` at adjustable speed for shadowing practice. |
| **12-Week Roadmap** | A dense, week-by-week plan (45-60 min/day) covering all IH/AL/AM grammar with 3 hard checkpoints (weeks 4, 8, 12), plus an Advanced High extension plan for month 4 and beyond. |
| **Self-Assessment** | A 7-dimension rubric adapted from ACTFL Advanced High speaking descriptors (paragraph-length discourse, time-frame control, handling complications, cohesion, vocabulary/circumlocution, accuracy, fluency), scored 1-4, tracked over time. |
| **Settings** | Voice selection, JSON export/import of progress, reset. |

## Running locally

```bash
cd japanese-speaking
python3 -m http.server 8080
# open http://localhost:8080/index.html
```

ES modules require `http(s)://`, not `file://`.

## Deployment

Static site — deploy as-is to GitHub Pages, Netlify, Vercel, or any static host. No build command needed.

## Data & privacy

All progress (XP, streak, recordings/transcripts, quiz stats, self-assessments, settings) is stored only in the browser's `localStorage`. Nothing is sent to a server. Use Settings → Export/Import to back up or move your data.
