import { getState } from "../core/storage.js";
import { el, progressBar } from "../core/ui.js";
import { CONNECTORS, CATEGORIES } from "../data/connectors.js";
import { GRAMMAR } from "../data/grammar.js";
import { ROADMAP, CHECKPOINTS } from "../data/roadmap.js";
import { FUNCTIONS } from "../data/prompts.js";

function daysSince(dateStr) {
  const start = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - start) / 86400000);
}

function currentWeekNumber(state) {
  const w = Math.floor(daysSince(state.startDate) / 7) + 1;
  return Math.max(1, Math.min(8, w));
}

export function render(root) {
  const state = getState();
  const week = currentWeekNumber(state);
  const weekData = ROADMAP.find((w) => w.week === week);
  const mastered = Object.values(state.connectorProgress).filter((c) => c.mastered).length;
  const masteredPct = Math.round((mastered / CONNECTORS.length) * 100);
  const grammarMastered = GRAMMAR.filter((g) => state.connectorProgress[g.id]?.mastered).length;
  const grammarPct = Math.round((grammarMastered / GRAMMAR.length) * 100);
  const checkpoint = CHECKPOINTS.find((cp) => cp.week === week);
  const container = el("div", { class: "view" });

  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "こんにちは 👋 — Advanced High Speaking Lab"),
      el("p", { class: "subtitle" }, "Mid-Intermediate High → Advanced High, via Advanced Low and Advanced Mid checkpoints — one connected paragraph at a time."),
    ])
  );

  const statGrid = el("div", { class: "stat-grid" }, [
    statCard("🔥", state.streak, "day streak"),
    statCard("⚡", state.xp, "XP"),
    statCard("📅", `Week ${week} / 8`, "in your plan"),
    statCard("🔗", `${masteredPct}%`, "connectors mastered"),
    statCard("📚", `${grammarPct}%`, "grammar mastered"),
  ]);
  container.appendChild(statGrid);

  const thisWeek = el("section", { class: "card highlight-card" });
  thisWeek.appendChild(
    el("div", { class: "week-card-header" }, [
      el("h2", {}, `Week ${week}: ${weekData.title}`),
      checkpoint ? el("span", { class: "badge warn" }, "🎯 Checkpoint week") : null,
    ])
  );
  thisWeek.appendChild(el("p", { class: "muted" }, weekData.focus));
  const taskList = el("ul", { class: "task-list" });
  weekData.tasks.forEach((t, i) => {
    const key = `${week}-${i}`;
    const done = !!state.completedTasks[key];
    taskList.appendChild(el("li", { class: done ? "done" : "" }, `${done ? "✅" : "⬜"} ${t}`));
  });
  thisWeek.appendChild(taskList);
  thisWeek.appendChild(
    el("a", { class: "btn primary", href: "#/roadmap" }, "Open full 8-week roadmap →")
  );
  container.appendChild(thisWeek);

  const quickGrid = el("div", { class: "quick-grid" }, [
    quickCard("🔗", "Connector Lab", "Learn + quiz the phrases that link sentences into paragraphs.", "#/connectors"),
    quickCard("📚", "Grammar Ladder", "24 structures leveled IH → AL → AM → AH, with example sentences.", "#/grammar"),
    quickCard("🪜", "Level Ladder", "The same prompt answered at all 4 levels — hear exactly what changes.", "#/levels"),
    quickCard("🎤", "Paragraph Practice", "Scaffolded speaking prompts across 6 Advanced-level functions.", "#/practice"),
    quickCard("🔁", "Shadowing", "Listen and repeat model paragraph-length monologues.", "#/shadowing"),
    quickCard("📋", "Self-Assessment", "Score your recordings against the ACTFL Advanced High rubric.", "#/rubric"),
  ]);
  container.appendChild(quickGrid);

  const progressCard = el("section", { class: "card" });
  progressCard.appendChild(el("h2", {}, "Connector mastery by category"));
  const catList = el("div", { class: "category-progress-list" });
  CATEGORIES.forEach((cat) => {
    const items = CONNECTORS.filter((c) => c.category === cat.id);
    const done = items.filter((c) => state.connectorProgress[c.id]?.mastered).length;
    const pct = Math.round((done / items.length) * 100);
    const row = el("div", { class: "category-progress-row" }, [
      el("div", { class: "category-progress-label" }, [
        el("span", { class: "dot", style: `background:${cat.color}` }),
        el("span", {}, `${cat.jp} · ${cat.en}`),
        el("span", { class: "muted small" }, ` ${done}/${items.length}`),
      ]),
      progressBar(pct),
    ]);
    catList.appendChild(row);
  });
  progressCard.appendChild(catList);
  container.appendChild(progressCard);

  const grammarCard = el("section", { class: "card" });
  grammarCard.appendChild(el("h2", {}, "Grammar mastery by level"));
  const gLevels = [...new Set(GRAMMAR.map((g) => g.level))];
  const gList = el("div", { class: "category-progress-list" });
  gLevels.forEach((lvlId) => {
    const items = GRAMMAR.filter((g) => g.level === lvlId);
    const done = items.filter((g) => state.connectorProgress[g.id]?.mastered).length;
    const pct = Math.round((done / items.length) * 100);
    gList.appendChild(
      el("div", { class: "category-progress-row" }, [
        el("div", { class: "category-progress-label" }, [el("span", {}, lvlId), el("span", { class: "muted small" }, ` ${done}/${items.length}`)]),
        progressBar(pct),
      ])
    );
  });
  grammarCard.appendChild(gList);
  container.appendChild(grammarCard);

  const recCard = el("section", { class: "card" });
  recCard.appendChild(el("h2", {}, "Recent recordings"));
  if (state.recordings.length === 0) {
    recCard.appendChild(el("p", { class: "muted" }, "No recordings yet — head to Paragraph Practice to record your first paragraph."));
  } else {
    const list = el("div", { class: "recording-list" });
    state.recordings.slice(0, 5).forEach((r) => {
      const fn = FUNCTIONS.find((f) => f.id === r.functionId);
      list.appendChild(
        el("div", { class: "recording-row" }, [
          el("div", {}, [
            el("strong", {}, fn ? fn.title : r.functionId),
            el("div", { class: "muted small" }, r.topic || ""),
          ]),
          el("div", { class: "muted small" }, `${r.sentenceCount} sent · ${r.connectorHits.length} connectors · ${r.durationSec}s`),
        ])
      );
    });
    recCard.appendChild(list);
  }
  container.appendChild(recCard);

  root.appendChild(container);
}

function statCard(icon, value, label) {
  return el("div", { class: "stat-card" }, [
    el("div", { class: "stat-icon" }, icon),
    el("div", { class: "stat-value" }, String(value)),
    el("div", { class: "stat-label" }, label),
  ]);
}

function quickCard(icon, title, desc, href) {
  return el("a", { class: "quick-card", href }, [
    el("div", { class: "quick-icon" }, icon),
    el("h3", {}, title),
    el("p", {}, desc),
  ]);
}
