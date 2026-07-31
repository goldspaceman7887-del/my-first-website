# 上級への道 (The Road to Advanced) — Japanese Advanced High Speaking Lab

A focused, single-page web app for taking your Japanese speaking from ACTFL **Intermediate High** to **Advanced High**, built around the specific gap most learners hit at this stage: connecting individual sentences into fluent, cohesive paragraphs.

No build step, no backend, no API keys — vanilla HTML/CSS/JS (ES modules), progress stored in `localStorage`.

## Features

| Page | What it does |
|---|---|
| **Guide** | Explains what actually changes between ACTFL Intermediate High and Advanced High, and how to use this app to close the gap. |
| **Connector Lab** | ~40 discourse connectors (接続表現) across 10 categories (sequence, cause, result, contrast, condition, example, summary, opinion, emphasis) with example two-sentence chains, audio playback, and a quiz mode. This is the core toolkit for linking sentences into paragraphs. |
| **Paragraph Practice** | 6 ACTFL Advanced-level speaking functions (narrate in the past, handle a complication, compare & contrast, support an opinion, hypothesize, describe in detail), each with topic prompts and a move-by-move scaffold. Uses the Web Speech Recognition API (Chrome/Edge) to transcribe your spoken paragraph live, then gives feedback on sentence count, connector variety, and duration. Falls back to a manual-transcript mode where recognition isn't supported. |
| **Shadowing** | Model paragraph-length monologues (with connectors highlighted) for each speaking function, played via `speechSynthesis` at adjustable speed for shadowing practice. |
| **8-Week Roadmap** | A structured week-by-week plan from connector drilling to full unscaffolded 2-minute turns, with a checklist that tracks completion and XP. |
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
