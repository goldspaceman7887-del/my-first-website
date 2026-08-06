// ACTFL PROFICIENCY REPORT — the redesign's answer to "what's my level, and
// why." Reads the same canonicalLevelIndex()/proficiencyDetail() the rest of
// the app already uses (dashboard, tier gating), plus every recorded
// task-scenario attempt, to show: current level with a "why" breakdown,
// strongest/weakest ACTFL functions, situations mastered vs needing work,
// and readiness for the next tier.

import { store } from "../core/storage.js";
import { el, progressBar, badge } from "../core/ui.js";
import { proficiencyDetail, gateStatus } from "../core/actflProfile.js";
import { ACTFL_LEVELS, levelIndex } from "../data/roadmap.js";
import { SCENARIOS } from "../data/scenarios.js";

const DIMENSION_LABELS = {
  comprehensibility: "Comprehensibility",
  vocabularyRange: "Vocabulary range",
  sentenceFormation: "Sentence formation",
  repairStrategies: "Repair strategies",
  conversationManagement: "Conversation management",
  questionAsking: "Ability to ask questions",
  surpriseHandling: "Handling surprises"
};

function badgeVariantForLevel(code) {
  if (code.startsWith("novice")) return "novice";
  if (code.startsWith("intermediate")) return "intermediate";
  return "advanced";
}

function dimensionAverages(attempts) {
  const sums = {};
  const counts = {};
  attempts.forEach((a) => {
    Object.entries(a.dimensions || {}).forEach(([key, value]) => {
      sums[key] = (sums[key] || 0) + value;
      counts[key] = (counts[key] || 0) + 1;
    });
  });
  return Object.keys(DIMENSION_LABELS)
    .filter((key) => counts[key] > 0)
    .map((key) => ({ key, label: DIMENSION_LABELS[key], avg: Math.round(sums[key] / counts[key]) }));
}

function tiersWithScenarios() {
  return ACTFL_LEVELS.filter((l) => SCENARIOS.some((s) => s.actflTier === l.code));
}

export function renderProficiencyReport(container) {
  const attempts = store.state.progress.scenarioAttempts || [];
  const detail = proficiencyDetail();
  const level = detail.level;

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "📈 ACTFL Proficiency Report"),
      el("p", {}, "Where your Spanish actually stands, based on completed real-life tasks — not just study volume.")
    ])
  );

  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "flex justify-between items-center" }, [
        el("div", {}, [
          el("div", { class: "card-title" }, `${level.label} (${level.short})`),
          el("div", { class: "text-muted" }, level.blurb)
        ]),
        badge(level.short, badgeVariantForLevel(level.code))
      ]),
      el("div", { style: "margin-top:.7rem" }, [
        el("div", { class: "card-title", style: "font-size:.9rem" }, "Why this level"),
        el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" },
          detail.sources.map((src) => el("li", {}, `${src.label} → ${ACTFL_LEVELS[src.levelIdx]?.short || "?"}`))
        )
      ])
    ])
  );

  if (!attempts.length) {
    container.appendChild(
      el("div", { class: "card empty-state", style: "margin-top:1rem" }, [
        el("div", { class: "empty-icon" }, "🧭"),
        el("h3", {}, "No task scenarios completed yet"),
        el("p", {}, "Complete a few real-life task scenarios in Practice → Roleplay to build your proficiency profile — strongest/weakest functions and readiness for the next level will show up here."),
        el("a", { class: "btn btn-primary", href: "#/practice/roleplay" }, "🎭 Go to Task Scenarios")
      ])
    );
    return;
  }

  // ---------- strongest / weakest ACTFL functions ----------
  const dims = dimensionAverages(attempts).sort((a, b) => b.avg - a.avg);
  const strongest = dims.slice(0, 2);
  const weakest = dims.slice(-2).reverse();

  container.appendChild(
    el("div", { class: "grid grid-2", style: "margin-top:1rem" }, [
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "💪 Strongest functions"),
        el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" }, strongest.map((d) => el("li", {}, `${d.label} (${d.avg}/100)`)))
      ]),
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "🎯 Weakest functions"),
        el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" }, weakest.map((d) => el("li", {}, `${d.label} (${d.avg}/100)`)))
      ])
    ])
  );

  // ---------- situations mastered vs needing work ----------
  const best = store.state.progress.scenarioBest || {};
  const mastered = SCENARIOS.filter((s) => (best[s.id] || 0) >= 70);
  const needsWork = SCENARIOS.filter((s) => {
    const attempted = attempts.some((a) => a.scenarioId === s.id);
    return attempted && (best[s.id] || 0) < 70;
  });
  const notYetTried = SCENARIOS.filter((s) => !attempts.some((a) => a.scenarioId === s.id));

  container.appendChild(
    el("div", { class: "grid grid-2", style: "margin-top:1rem" }, [
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "✅ Situations mastered"),
        mastered.length
          ? el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" }, mastered.map((s) => el("li", {}, `${s.title} — ${best[s.id]}/100`)))
          : el("p", { class: "text-muted" }, "None yet — a scenario counts as mastered at a best score of 70+.")
      ]),
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "🔧 Situations needing work"),
        needsWork.length
          ? el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" }, needsWork.map((s) => el("li", {}, `${s.title} — best ${best[s.id]}/100`)))
          : el("p", { class: "text-muted" }, "Nothing attempted-but-struggling right now.")
      ])
    ])
  );

  if (notYetTried.length) {
    container.appendChild(
      el("div", { class: "card", style: "margin-top:1rem" }, [
        el("div", { class: "card-title" }, "🆕 Not tried yet"),
        el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" }, notYetTried.map((s) => el("li", {}, `${s.title} (${ACTFL_LEVELS.find((l) => l.code === s.actflTier)?.short})`))),
        el("a", { class: "btn btn-sm", href: "#/practice/roleplay", style: "margin-top:.5rem" }, "Try one now")
      ])
    );
  }

  // ---------- readiness for the next level ----------
  const tiers = tiersWithScenarios();
  const currentTierPos = tiers.findIndex((l) => l.code === level.code);
  const nextTier = tiers[currentTierPos + 1] || tiers.find((l) => levelIndex(l.code) > levelIndex(level.code));
  container.appendChild(
    el("div", { class: "card", style: "margin-top:1rem" }, [
      el("div", { class: "card-title" }, "🚦 Readiness for the next level"),
      nextTier
        ? renderReadiness(nextTier)
        : el("p", { class: "text-muted" }, "You've reached the highest ACTFL tier this app currently has task scenarios for.")
    ])
  );
}

function renderReadiness(nextTier) {
  const status = gateStatus(nextTier.code);
  if (status.unlocked) {
    return el("p", {}, `${nextTier.label}'s scenarios are already unlocked — keep completing them to raise your confirmed level.`);
  }
  const passPct = Math.min(100, Math.round((status.passes / status.needPasses) * 100));
  const distinctPct = Math.min(100, Math.round((status.distinctScenarios / status.needDistinct) * 100));
  return el("div", {}, [
    el("p", { class: "text-muted" }, `To unlock ${nextTier.label}: ${status.needPasses} strong attempts (score 70+, most details resolved) across ${status.needDistinct} distinct scenarios at ${status.priorTier.label}.`),
    el("div", { style: "margin-top:.4rem" }, [
      el("div", { class: "text-faint", style: "font-size:.8rem" }, `Strong attempts: ${status.passes}/${status.needPasses}`),
      progressBar(passPct)
    ]),
    el("div", { style: "margin-top:.4rem" }, [
      el("div", { class: "text-faint", style: "font-size:.8rem" }, `Distinct scenarios: ${status.distinctScenarios}/${status.needDistinct}`),
      progressBar(distinctPct)
    ])
  ]);
}
