// DAILY PRACTICE — a short, personalized "start here" queue: what's due,
// your next roadmap unit, and one real-life scenario. Assembled entirely
// from data that already exists (reviewCounts, roadmap progress, scenario
// completion) — no new grading logic of its own.

import { store } from "../core/storage.js";
import { el } from "../core/ui.js";
import { reviewCounts } from "../core/srs.js";
import { ROADMAP_UNITS } from "../data/roadmap.js";
import { SCENARIOS } from "../data/scenarios.js";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function renderDailyPractice(container) {
  const counts = reviewCounts();
  const doneUnits = new Set([
    ...(store.state.progress.roadmapUnitsCompleted || []),
    ...(store.state.progress.roadmapUnitsSkipped || [])
  ]);
  const nextUnit = ROADMAP_UNITS.find((u) => !doneUnits.has(u.id));
  const doneScenarios = new Set(store.state.progress.scenariosCompleted || []);
  const freshScenarios = SCENARIOS.filter((s) => !doneScenarios.has(s.id));
  const suggestedScenario = pick(freshScenarios.length ? freshScenarios : SCENARIOS);

  const grid = el("div", { class: "grid grid-auto" });

  if (counts.dueToday > 0) {
    grid.appendChild(
      el("a", { class: "card card-link", href: "#/review" }, [
        el("div", { style: "font-size:1.6rem" }, "🔁"),
        el("h3", { style: "margin:.4rem 0 .2rem" }, `${counts.dueToday} due for review`),
        el("p", { class: "text-muted" }, "Spaced repetition works best when this doesn't pile up.")
      ])
    );
  }

  if (nextUnit) {
    grid.appendChild(
      el("a", { class: "card card-link", href: "#/roadmap" }, [
        el("div", { style: "font-size:1.6rem" }, nextUnit.icon),
        el("h3", { style: "margin:.4rem 0 .2rem" }, `Next up: ${nextUnit.title}`),
        el("p", { class: "text-muted" }, "Learn 8 sentences, then a 10-question test to lock it in.")
      ])
    );
  }

  if (suggestedScenario) {
    grid.appendChild(
      el("a", { class: "card card-link", href: `#/scenarios/${suggestedScenario.id}` }, [
        el("div", { style: "font-size:1.6rem" }, "🎬"),
        el("h3", { style: "margin:.4rem 0 .2rem" }, suggestedScenario.title),
        el("p", { class: "text-muted" }, suggestedScenario.goal)
      ])
    );
  }

  if (!counts.dueToday && !nextUnit) {
    grid.appendChild(
      el("div", { class: "card empty-state" }, [
        el("div", { class: "empty-icon" }, "🎉"),
        el("h3", {}, "You're caught up on units and reviews"),
        el("p", {}, "Try Weakness Review or ACTFL Skill Practice to keep sharpening what's already strong.")
      ])
    );
  }

  container.appendChild(grid);
}
