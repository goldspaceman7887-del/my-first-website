import { getState } from "../core/storage.js";
import { el, progressBar } from "../core/ui.js";
import { CONNECTORS, CATEGORIES } from "../data/connectors.js";
import { GRAMMAR } from "../data/grammar.js";
import { VOCABULARY, WORD_LEVELS } from "../data/vocabulary.js";
import { ROADMAP, CHECKPOINTS } from "../data/roadmap.js";
import { FUNCTIONS } from "../data/prompts.js";
import { getDueCount, getNewAvailableCount } from "../data/reviewPool.js";

function daysSince(dateStr) {
  const start = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - start) / 86400000);
}

function currentWeekNumber(state) {
  const w = Math.floor(daysSince(state.startDate) / 7) + 1;
  return Math.max(1, Math.min(12, w));
}

export function render(root) {
  const state = getState();
  const week = currentWeekNumber(state);
  const weekData = ROADMAP.find((w) => w.week === week);
  const mastered = Object.values(state.connectorProgress).filter((c) => c.mastered).length;
  const masteredPct = Math.round((mastered / CONNECTORS.length) * 100);
  const grammarMastered = GRAMMAR.filter((g) => state.connectorProgress[g.id]?.mastered).length;
  const grammarPct = Math.round((grammarMastered / GRAMMAR.length) * 100);
  const vocabMastered = VOCABULARY.filter((w) => state.connectorProgress[w.id]?.mastered).length;
  const vocabPct = Math.round((vocabMastered / VOCABULARY.length) * 100);
  const checkpoint = CHECKPOINTS.find((cp) => cp.week === week);
  const container = el("div", { class: "view" });

  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "こんにちは 👋 — Advanced High Speaking Lab"),
      el("p", { class: "subtitle" }, "12 intensive weeks: mid-Intermediate High → full Advanced Mid mastery, via Advanced Low and Advanced Mid checkpoints — then straight into Advanced High."),
    ])
  );

  const due = getDueCount(state);
  const freshAvailable = getNewAvailableCount(state);
  const reviewCta = el("section", { class: "card review-cta-card" }, [
    el("div", { class: "review-cta-numbers" }, [
      el("div", { class: "review-cta-num-wrap" }, [el("div", { class: "review-cta-num accent" }, String(due)), el("div", { class: "muted small" }, "due")]),
      el("div", { class: "review-cta-num-wrap" }, [el("div", { class: "review-cta-num accent2" }, String(Math.min(freshAvailable, state.reviewStats.newCardsPerSession))), el("div", { class: "muted small" }, "new ready")]),
    ]),
    el("a", { class: "btn primary review-start-btn", href: "#/review", style: "max-width:240px;" }, due + freshAvailable > 0 ? "⚡ Start Review" : "⚡ Review (all caught up)"),
  ]);
  container.appendChild(reviewCta);

  const statGrid = el("div", { class: "stat-grid" }, [
    statCard("🔥", state.streak, "day streak"),
    statCard("⚡", state.xp, "XP"),
    statCard("📅", `Week ${week} / 12`, "in your plan"),
    statCard("🔗", `${masteredPct}%`, "connectors mastered"),
    statCard("📚", `${grammarPct}%`, "grammar mastered"),
    statCard("🈶", `${vocabPct}%`, "vocab mastered"),
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
    el("a", { class: "btn primary", href: "#/roadmap" }, "Open full 12-week roadmap →")
  );
  container.appendChild(thisWeek);

  const quickGrid = el("div", { class: "quick-grid" }, [
    quickCard("⚡", "Review Session", "Fast spaced-repetition flip cards, mixing due reviews with new material.", "#/review"),
    quickCard("🔗", "Connector Lab", "Learn + quiz the phrases that link sentences into paragraphs.", "#/connectors"),
    quickCard("📚", "Grammar Ladder", "44 structures leveled IH → AL → AM → AH, with example sentences.", "#/grammar"),
    quickCard("🈶", "Vocabulary (N3→N2)", "84 words, always learned through a full example sentence.", "#/vocabulary"),
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

  const vocabCard = el("section", { class: "card" });
  vocabCard.appendChild(el("h2", {}, "Vocabulary mastery by JLPT level"));
  const vList = el("div", { class: "category-progress-list" });
  WORD_LEVELS.forEach((lvl) => {
    const items = VOCABULARY.filter((w) => w.level === lvl.id);
    const done = items.filter((w) => state.connectorProgress[w.id]?.mastered).length;
    const pct = Math.round((done / items.length) * 100);
    vList.appendChild(
      el("div", { class: "category-progress-row" }, [
        el("div", { class: "category-progress-label" }, [
          el("span", { class: "dot", style: `background:${lvl.color}` }),
          el("span", {}, lvl.label),
          el("span", { class: "muted small" }, ` ${done}/${items.length}`),
        ]),
        progressBar(pct),
      ])
    );
  });
  vocabCard.appendChild(vList);
  container.appendChild(vocabCard);

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
