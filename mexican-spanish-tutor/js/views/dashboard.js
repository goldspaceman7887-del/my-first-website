import { store } from "../core/storage.js";
import { el, progressBar, badge } from "../core/ui.js";
import { reviewCounts, masteryLevel } from "../core/srs.js";
import { estimatedLevel, xpProgressToNextLevel, currentStreak } from "../core/gamification.js";
import { ACTFL_LEVELS, levelIndex } from "../data/roadmap.js";
import { VOCABULARY } from "../data/vocabulary.js";

function srsEntriesByType(type) {
  return Object.values(store.state.srs).filter((i) => i.type === type);
}

function badgeVariantForLevel(code) {
  if (code.startsWith("novice")) return "novice";
  if (code.startsWith("intermediate")) return "intermediate";
  return "advanced";
}

function statCard(icon, value, label) {
  return el("div", { class: "card stat-card" }, [
    el("div", { class: "stat-icon" }, icon),
    el("div", { class: "stat-value" }, String(value)),
    el("div", { class: "stat-label" }, label)
  ]);
}

function heatmap() {
  const dates = new Set(store.state.profile.studyDates || []);
  const days = 84;
  const cells = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const level = dates.has(iso) ? "4" : "0";
    cells.push(el("div", { class: "heatmap-cell", "data-level": level, title: iso }));
  }
  return el("div", { class: "heatmap" }, cells);
}

function strengthsAndWeaknesses() {
  const scores = store.state.scores || {};
  const entries = Object.entries(scores);
  if (entries.every(([, v]) => v === 0)) {
    return { strengths: ["Not enough data yet — complete a few sessions across modes."], weaknesses: ["Try Daily Lesson, Roleplay, and Correction Mode to build a profile."] };
  }
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const strengths = sorted.slice(0, 2).map(([k, v]) => `${k} (${v}/100)`);
  const weaknesses = sorted.slice(-2).map(([k, v]) => `${k} (${v}/100)`);
  return { strengths, weaknesses };
}

export function renderDashboard(container) {
  const level = estimatedLevel();
  const progress = xpProgressToNextLevel();
  const counts = reviewCounts();
  const streak = currentStreak();
  const words = srsEntriesByType("word");
  const masteredWords = words.filter((w) => masteryLevel(w.id) >= 70);
  const { strengths, weaknesses } = strengthsAndWeaknesses();
  const canDoCount = (store.state.progress.canDoCompleted || []).length;

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🏠 Panel / Dashboard"),
      el("p", {}, "Your Mexican Spanish memory system, tracked against the ACTFL proficiency scale — review first, then new material.")
    ])
  );

  container.appendChild(
    el("div", { class: "grid grid-4" }, [
      statCard("🔥", streak, "Day streak"),
      statCard("⚡", store.state.profile.xp || 0, "Total XP"),
      statCard("🔁", counts.dueToday, "Reviews due"),
      statCard("📚", masteredWords.length, "Words mastered")
    ])
  );

  const levelCard = el("div", { class: "card", style: "margin-top:1rem" }, [
    el("div", { class: "flex justify-between items-center" }, [
      el("div", {}, [
        el("div", { class: "card-title" }, `${level.label} (${level.short})`),
        el("div", { class: "text-muted" }, level.blurb),
        el("div", { class: "text-faint", style: "margin-top:.3rem" }, progress.isMax ? "You've reached this app's target level!" : `Progress toward ${progress.next.label}`)
      ]),
      badge(level.short, badgeVariantForLevel(level.code))
    ]),
    el("div", { style: "margin-top:.6rem" }, [progressBar(progress.pct)])
  ]);
  container.appendChild(levelCard);

  container.appendChild(
    el("div", { class: "grid grid-2", style: "margin-top:1rem" }, [
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "💪 Strengths"),
        el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" }, strengths.map((s) => el("li", {}, s)))
      ]),
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "🎯 Areas to work on"),
        el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" }, weaknesses.map((s) => el("li", {}, s)))
      ])
    ])
  );

  container.appendChild(
    el("div", { class: "card", style: "margin-top:1rem" }, [
      el("div", { class: "card-title" }, "✅ Requirements for the next ACTFL level"),
      el("p", { class: "text-muted" }, progress.isMax ? "You've unlocked every level this app tracks toward — Advanced Low. Keep practicing OPI Practice and abstract-topic conversation to consolidate it." : `To reach ${progress.next.label}, you can typically:`),
      !progress.isMax ? el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" }, progress.next.canDo.map((c) => el("li", {}, c))) : null,
      el("p", { class: "text-faint", style: "margin-top:.5rem" }, `${canDoCount} Can-Do statement(s) checked off so far.`),
      el("a", { class: "btn btn-sm", href: "#/roadmap", style: "margin-top:.4rem" }, "Open ACTFL Roadmap")
    ].filter(Boolean))
  );

  const nudge = el("div", { class: "card", style: "margin-top:1rem;border-left:3px solid var(--accent)" }, [
    el("div", { class: "card-title" }, counts.dueToday > 0 ? `🔁 ${counts.dueToday} review(s) waiting` : "🆕 Ready for something new"),
    el("p", { class: "text-muted" }, counts.dueToday > 0
      ? "Reviewing due material first is the single best thing you can do for long-term retention."
      : "No reviews due right now — great time to start today's Daily Lesson."),
    el("div", { class: "btn-row", style: "margin-top:.5rem" }, [
      counts.dueToday > 0 ? el("a", { class: "btn btn-primary", href: "#/review" }, "Start review") : null,
      el("a", { class: "btn btn-primary", href: "#/daily-lesson" }, "Daily Lesson"),
      el("a", { class: "btn", href: "#/roleplay" }, "🎭 Roleplay"),
      el("a", { class: "btn", href: "#/immersion" }, "🌊 Immersion"),
      el("a", { class: "btn", href: "#/opi" }, "🎓 OPI Practice")
    ].filter(Boolean))
  ]);
  container.appendChild(nudge);

  container.appendChild(
    el("div", { class: "card", style: "margin-top:1rem" }, [
      el("div", { class: "card-title" }, "📅 Study activity"),
      heatmap()
    ])
  );
}
