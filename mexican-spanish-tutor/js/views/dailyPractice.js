// DAILY PRACTICE — the Practice hub's landing tab. A condensed "what's
// worth doing right now" instead of an empty picker: what's due for review,
// the next roadmap unit, and one suggested scenario, plus quick links into
// every other practice mode. A thin wrapper — it pulls from existing SRS,
// roadmap, and scenario state and doesn't grade or store anything itself.

import { store } from "../core/storage.js";
import { el } from "../core/ui.js";
import { reviewCounts } from "../core/srs.js";
import { estimatedLevel } from "../core/gamification.js";
import { ROADMAP_UNITS, levelIndex } from "../data/roadmap.js";
import { SCENARIOS } from "../data/scenarios.js";
import { gateStatus } from "../core/actflProfile.js";

function nextRoadmapUnit() {
  const done = new Set([
    ...(store.state.progress.roadmapUnitsCompleted || []),
    ...(store.state.progress.roadmapUnitsSkipped || [])
  ]);
  return ROADMAP_UNITS.find((u) => !done.has(u.id)) || null;
}

// Prefers a scenario you haven't tried yet, at or below your current
// estimate, in a tier you've actually unlocked.
function suggestedScenario() {
  const tierIdx = levelIndex(estimatedLevel().code);
  const eligible = SCENARIOS.filter((s) => levelIndex(s.actflTier) <= tierIdx && gateStatus(s.actflTier).unlocked);
  if (!eligible.length) return null;
  const unattempted = eligible.filter((s) => store.state.progress.scenarioBest[s.id] === undefined);
  const pool = unattempted.length ? unattempted : eligible;
  return pool[Math.floor(Math.random() * pool.length)];
}

const OTHER_MODES = [
  { id: "conversation", icon: "💬", label: "Conversation" },
  { id: "scenarios", icon: "🎭", label: "Scenarios" },
  { id: "listening", icon: "👂", label: "Listening" },
  { id: "speaking-test", icon: "🎓", label: "Speaking Test" },
  { id: "writing", icon: "✍️", label: "Writing" },
  { id: "weakness", icon: "📉", label: "Weakness Review" },
  { id: "immersion", icon: "🌊", label: "Immersion" },
  { id: "story", icon: "📖", label: "Stories" }
];

export function renderDailyPractice(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎯 Daily Practice"),
      el("p", {}, "What's worth doing right now, pulled from your actual progress — not a fixed order.")
    ])
  );

  const counts = reviewCounts();
  const unit = nextRoadmapUnit();
  const scenario = suggestedScenario();

  const grid = el("div", { class: "grid grid-auto" });
  container.appendChild(grid);

  grid.appendChild(
    el("a", { class: "card card-link", href: "#/review" }, [
      el("span", { style: "font-size:1.6rem" }, "🔁"),
      el("h3", { style: "margin:.5rem 0 .2rem" }, "Review"),
      el("p", { class: "text-muted" }, counts.dueToday
        ? `${counts.dueToday} item${counts.dueToday === 1 ? "" : "s"} due${counts.overdue ? ` · ${counts.overdue} overdue` : ""}`
        : "Nothing due right now — browse what you already know instead.")
    ])
  );

  if (unit) {
    grid.appendChild(
      el("a", { class: "card card-link", href: "#/roadmap" }, [
        el("span", { style: "font-size:1.6rem" }, unit.icon || "🗺️"),
        el("h3", { style: "margin:.5rem 0 .2rem" }, "Next roadmap unit"),
        el("p", { class: "text-muted" }, unit.title)
      ])
    );
  }

  if (scenario) {
    grid.appendChild(
      el("a", { class: "card card-link", href: "#/practice/scenarios" }, [
        el("span", { style: "font-size:1.6rem" }, scenario.icon || "🎭"),
        el("h3", { style: "margin:.5rem 0 .2rem" }, "Suggested scenario"),
        el("p", { class: "text-muted" }, `${scenario.title} — ${scenario.titleEs}`)
      ])
    );
  }

  container.appendChild(el("h3", { style: "margin-top:1.5rem" }, "Or pick a mode"));
  const modeGrid = el("div", { class: "grid grid-auto" });
  container.appendChild(modeGrid);
  OTHER_MODES.forEach((m) => {
    modeGrid.appendChild(
      el("a", { class: "card card-link", style: "text-align:center", href: `#/practice/${m.id}` }, [
        el("span", { style: "font-size:1.6rem" }, m.icon),
        el("div", { style: "margin-top:.3rem;font-weight:600" }, m.label)
      ])
    );
  });
}
