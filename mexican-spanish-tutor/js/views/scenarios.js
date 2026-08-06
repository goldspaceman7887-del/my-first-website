// TASK SCENARIOS — real-life task completion, ACTFL-gated.
//
// Replaces the old exact-line-matching Roleplay mode. A scenario isn't
// "done" because you said some Spanish back — it's done when every required
// detail has actually been exchanged, the way it would go in Mexico, with
// an NPC that doesn't follow a fixed script. Higher tiers unlock only once
// you've demonstrated proficiency at the tier before them (see
// core/actflProfile.js's meetsGateForTier).

import { el } from "../core/ui.js";
import { store } from "../core/storage.js";
import { SCENARIOS } from "../data/scenarios.js";
import { ACTFL_LEVELS } from "../data/roadmap.js";
import { gateStatus } from "../core/actflProfile.js";
import { renderScenarioPlay } from "./scenarioPlay.js";

function levelBadgeClass(code) {
  return code.startsWith("novice") ? "badge-novice" : code.startsWith("intermediate") ? "badge-intermediate" : "badge-advanced";
}

export function renderScenarios(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎭 Task Scenarios"),
      el("p", {}, "Complete real-life tasks in Spanish — order coffee, check into a hotel, call a doctor. A task isn't done until every detail is handled; the person you're talking to doesn't follow a script, and things don't always go smoothly.")
    ])
  );

  const body = el("div", {});
  container.appendChild(body);
  let cleanup = null;

  function runCleanup() {
    if (typeof cleanup === "function") { try { cleanup(); } catch (e) { console.error(e); } }
    cleanup = null;
  }

  function showPicker() {
    runCleanup();
    body.innerHTML = "";
    const tiers = ACTFL_LEVELS.filter((l) => SCENARIOS.some((s) => s.actflTier === l.code));
    if (!tiers.length) {
      body.appendChild(el("div", { class: "card" }, "No scenarios yet — check back soon."));
      return;
    }
    tiers.forEach((level) => {
      const scenarios = SCENARIOS.filter((s) => s.actflTier === level.code);
      const status = gateStatus(level.code);

      body.appendChild(
        el("h3", { style: "margin:1.1rem 0 .4rem;display:flex;align-items:center;gap:.4rem" }, [
          level.label,
          el("span", { class: `badge ${levelBadgeClass(level.code)}` }, level.short)
        ])
      );

      if (!status.unlocked) {
        body.appendChild(
          el("div", { class: "card", style: "opacity:.6" }, [
            el("p", {}, `🔒 Complete ${status.needPasses} strong attempts across ${status.needDistinct} different scenarios at ${status.priorTier.label} to unlock.`),
            el("p", { class: "text-muted", style: "font-size:.85rem" }, `Progress: ${status.passes}/${status.needPasses} strong attempts · ${status.distinctScenarios}/${status.needDistinct} distinct scenarios.`)
          ])
        );
        return;
      }

      const grid = el("div", { class: "grid grid-auto" });
      scenarios.forEach((s) => {
        const best = store.state.progress.scenarioBest[s.id];
        grid.appendChild(
          el("div", { class: "card", style: "cursor:pointer", onclick: () => startScenario(s) }, [
            el("span", { style: "font-size:1.6rem" }, s.icon || "🎭"),
            el("h3", { style: "margin:.5rem 0 .2rem" }, s.title),
            el("p", { class: "text-muted" }, s.titleEs),
            best !== undefined ? el("p", { class: "text-faint", style: "font-size:.8rem" }, `Best: ${best}/100`) : null
          ].filter(Boolean))
        );
      });
      body.appendChild(grid);
    });
  }

  function startScenario(s) {
    runCleanup();
    body.innerHTML = "";
    cleanup = renderScenarioPlay(body, s, {
      onExit: showPicker,
      onRetry: () => startScenario(s)
    });
  }

  showPicker();
  return runCleanup;
}
