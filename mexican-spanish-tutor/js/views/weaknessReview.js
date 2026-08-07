// WEAKNESS REVIEW — pulls together whatever the learner's own data says is
// weakest right now: the two lowest skill scores (which feed the ACTFL
// estimate — see core/assessment.js) and the spaced-repetition items with
// the lowest mastery. A composition view over existing signals, not a new
// scoring system.

import { store } from "../core/storage.js";
import { el } from "../core/ui.js";
import { dueItems, masteryLevel } from "../core/srs.js";

const SKILL_LABELS = {
  speaking: "🗣️ Speaking", listening: "👂 Listening", reading: "📖 Reading",
  writing: "✍️ Writing", vocabulary: "🗂️ Vocabulary", grammar: "🧩 Grammar"
};

function itemLabel(id) {
  return id.replace(/^\w+?_/, "").replace(/[_-]/g, " ");
}

export function renderWeaknessReview(container) {
  const scores = store.state.scores || {};
  const entries = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  const hasData = entries.some(([, v]) => v > 0);

  container.appendChild(
    el("p", { class: "text-muted" }, "Pulled straight from your own data: your two lowest skill scores, and the spaced-repetition items you're shakiest on.")
  );

  if (!hasData) {
    container.appendChild(
      el("div", { class: "card empty-state" }, [
        el("div", { class: "empty-icon" }, "🌱"),
        el("h3", {}, "Not enough data yet"),
        el("p", {}, "Do a few practice sessions — Conversation, Writing, a Speaking Test — and this fills in.")
      ])
    );
    return;
  }

  const weakest = entries.slice(0, 2);
  const grid = el("div", { class: "grid grid-auto" });
  weakest.forEach(([skill, val]) => {
    grid.appendChild(
      el("a", { class: "card card-link", href: `#/practice/skill?skill=${skill}` }, [
        el("h3", { style: "margin:0 0 .3rem" }, SKILL_LABELS[skill] || skill),
        el("div", { class: "progress-bar", style: "margin:.3rem 0" }, [el("div", { class: "progress-bar-fill", style: `width:${Math.round(val)}%` })]),
        el("p", { class: "text-muted", style: "margin:0" }, `${Math.round(val)}/100 — practice this to move it up.`)
      ])
    );
  });
  container.appendChild(grid);

  container.appendChild(el("h3", { style: "margin-top:1.25rem" }, "Weakest spaced-repetition items"));
  const weak = dueItems().slice().sort((a, b) => masteryLevel(a.id) - masteryLevel(b.id)).slice(0, 8);
  if (!weak.length) {
    container.appendChild(el("p", { class: "text-muted" }, "Nothing due right now — check back after your next study session."));
    return;
  }
  const list = el("div", { class: "card" });
  weak.forEach((item) => {
    list.appendChild(
      el("div", { class: "flex justify-between items-center", style: "padding:.4rem 0;border-bottom:1px solid var(--border)" }, [
        el("span", { class: "es-text" }, itemLabel(item.id)),
        el("span", { class: "badge badge-danger" }, `${masteryLevel(item.id)}%`)
      ])
    );
  });
  container.appendChild(list);
  container.appendChild(el("a", { class: "btn btn-primary", style: "margin-top:.7rem", href: "#/review" }, "Review these now →"));
}
