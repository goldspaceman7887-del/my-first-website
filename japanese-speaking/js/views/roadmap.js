import { ROADMAP, CHECKPOINTS, EXTENSION } from "../data/roadmap.js";
import { getState, toggleTask } from "../core/storage.js";
import { el, progressBar } from "../core/ui.js";

// Path geometry: a fixed internal coordinate space, scaled responsively via aspect-ratio + %-based
// node positions so the SVG line and the node buttons always line up regardless of viewport width.
const PATH_W = 420;
const ROW_H = 128;
const TOP_PAD = 64;
const BOTTOM_PAD = 64;
const AMPLITUDE = 92;
const NODE_SIZE = 64;
const CHECKPOINT_SIZE = 82;

let selectedWeek = null;

function daysSince(dateStr) {
  return Math.floor((new Date() - new Date(dateStr)) / 86400000);
}

function isWeekComplete(week, tasksLen, state) {
  for (let i = 0; i < tasksLen; i++) {
    if (!state.completedTasks[`${week}-${i}`]) return false;
  }
  return true;
}

function waveOffset(i, isCheckpoint) {
  if (isCheckpoint) return 0;
  return Math.round(Math.sin(i * (Math.PI / 3)) * AMPLITUDE);
}

function buildPathD(points) {
  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export function render(root) {
  const state = getState();
  const dateWeek = Math.max(1, Math.min(12, Math.floor(daysSince(state.startDate) / 7) + 1));

  const completionIndex = (() => {
    const i = ROADMAP.findIndex((w) => !isWeekComplete(w.week, w.tasks.length, state));
    return i === -1 ? ROADMAP.length : i;
  })();
  const pathComplete = completionIndex >= ROADMAP.length;

  if (selectedWeek === null) {
    selectedWeek = ROADMAP[Math.min(completionIndex, ROADMAP.length - 1)].week;
  }

  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "📅 12-Week Intensive Roadmap"),
      el("p", { class: "subtitle" }, "Mid-Intermediate High → full Advanced Mid grammar mastery in 3 months, via explicit Advanced Low and Advanced Mid checkpoints. 45-60 min/day. This plan is deliberately demanding, not gentle — Advanced High follows immediately after (see the bottom of this page)."),
    ])
  );

  const totalTasks = ROADMAP.reduce((s, w) => s + w.tasks.length, 0);
  const doneTasks = Object.values(state.completedTasks).filter(Boolean).length;
  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "muted small" }, `Overall progress: ${doneTasks}/${totalTasks} tasks · ${Math.min(completionIndex, 12)}/12 weeks complete`),
      progressBar(Math.round((doneTasks / totalTasks) * 100)),
    ])
  );

  // ---- the path ----
  const points = ROADMAP.map((w, i) => {
    const checkpoint = !!CHECKPOINTS.find((cp) => cp.week === w.week);
    return {
      week: w.week,
      x: PATH_W / 2 + waveOffset(i, checkpoint),
      y: TOP_PAD + i * ROW_H,
      checkpoint,
    };
  });
  const totalHeight = TOP_PAD + (ROADMAP.length - 1) * ROW_H + BOTTOM_PAD;

  const donePoints = points.slice(0, Math.min(completionIndex, points.length));
  const remainingPoints = points.slice(Math.max(completionIndex - 1, 0));

  const svg = `
    <svg viewBox="0 0 ${PATH_W} ${totalHeight}" class="roadmap-path-svg" preserveAspectRatio="none" aria-hidden="true">
      <path d="${buildPathD(points)}" class="path-line-base" />
      ${donePoints.length > 1 ? `<path d="${buildPathD(donePoints)}" class="path-line-done" />` : ""}
    </svg>
  `;

  const pathWrap = el("div", { class: "roadmap-path-wrap", style: `aspect-ratio:${PATH_W}/${totalHeight};` });
  pathWrap.appendChild(el("div", { class: "roadmap-path-svg-host", html: svg }));

  const nodeLayer = el("div", { class: "path-node-layer" });
  points.forEach((p, i) => {
    const w = ROADMAP[i];
    const completed = i < completionIndex;
    const current = i === completionIndex;
    const locked = i > completionIndex;
    const size = p.checkpoint ? CHECKPOINT_SIZE : NODE_SIZE;

    let icon = String(w.week);
    if (completed) icon = "✓";
    else if (locked) icon = p.checkpoint ? "☆" : "🔒";
    else if (p.checkpoint) icon = "⭐";

    const cls = [
      "path-node-btn",
      completed ? "completed" : current ? "current" : "locked",
      p.checkpoint ? "checkpoint" : "",
      w.week === selectedWeek ? "selected" : "",
      w.week === dateWeek ? "date-current" : "",
    ].filter(Boolean).join(" ");

    const btn = el(
      "button",
      {
        class: cls,
        style: `left:${((p.x / PATH_W) * 100).toFixed(2)}%; top:${((p.y / totalHeight) * 100).toFixed(2)}%; width:${size}px; height:${size}px;`,
        title: `Week ${w.week}: ${w.title}${w.week === dateWeek ? " (this week, by calendar)" : ""}`,
        "aria-label": `Week ${w.week}: ${w.title}`,
        onclick: () => {
          selectedWeek = w.week;
          render(root);
          document.getElementById("roadmap-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
        },
      },
      icon
    );
    nodeLayer.appendChild(btn);
  });
  pathWrap.appendChild(nodeLayer);
  container.appendChild(pathWrap);

  const legend = el("div", { class: "path-legend" }, [
    legendItem("completed", "✓", "Done"),
    legendItem("current", String(dateWeek), "Next up"),
    legendItem("locked", "🔒", "Not started"),
    legendItem("checkpoint", "⭐", "Checkpoint"),
  ]);
  container.appendChild(legend);

  if (pathComplete) {
    container.appendChild(
      el("div", { class: "card celebration-card" }, "🎉 All 12 weeks complete — full command of IH/AL/AM grammar and discourse. Time to start the Advanced High phase below.")
    );
  }

  // ---- detail panel for the selected week ----
  const w = ROADMAP.find((r) => r.week === selectedWeek);
  const wIndex = ROADMAP.findIndex((r) => r.week === selectedWeek);
  const checkpoint = CHECKPOINTS.find((cp) => cp.week === w.week);
  const detail = el("div", { class: "card week-card current-week", id: "roadmap-detail" });
  detail.appendChild(
    el("div", { class: "week-card-header" }, [
      el("h2", {}, `Week ${w.week}: ${w.title}`),
      w.week === dateWeek ? el("span", { class: "badge" }, "📅 This week") : null,
      checkpoint ? el("span", { class: "badge warn" }, "🎯 Checkpoint week") : null,
    ])
  );
  if (checkpoint) detail.appendChild(el("p", { class: "muted small" }, checkpoint.desc));
  detail.appendChild(el("p", { class: "muted" }, w.focus));
  detail.appendChild(el("p", { class: "muted small" }, `~${w.dailyMinutes} min/day`));
  const list = el("ul", { class: "task-list checklist" });
  w.tasks.forEach((t, i) => {
    const key = `${w.week}-${i}`;
    const done = !!state.completedTasks[key];
    const item = el("li", { class: done ? "done" : "" });
    const checkbox = el("input", { type: "checkbox", checked: done ? "checked" : null });
    checkbox.addEventListener("change", () => {
      toggleTask(w.week, i);
      render(root);
    });
    item.appendChild(checkbox);
    item.appendChild(el("span", {}, t));
    list.appendChild(item);
  });
  detail.appendChild(list);

  const nav = el("div", { class: "week-nav-row" }, [
    el(
      "button",
      {
        class: "btn",
        disabled: wIndex <= 0 ? "disabled" : null,
        onclick: () => { selectedWeek = ROADMAP[wIndex - 1].week; render(root); },
      },
      "← Previous week"
    ),
    el(
      "button",
      {
        class: "btn",
        disabled: wIndex >= ROADMAP.length - 1 ? "disabled" : null,
        onclick: () => { selectedWeek = ROADMAP[wIndex + 1].week; render(root); },
      },
      "Next week →"
    ),
  ]);
  detail.appendChild(nav);
  container.appendChild(detail);

  const extCard = el("div", { class: "card extension-card" });
  extCard.appendChild(el("h2", {}, `🚀 ${EXTENSION.title}`));
  extCard.appendChild(el("p", { class: "muted" }, EXTENSION.desc));
  const extList = el("ul", { class: "task-list" });
  EXTENSION.tasks.forEach((t) => extList.appendChild(el("li", {}, t)));
  extCard.appendChild(extList);
  extCard.appendChild(el("a", { class: "btn", href: "#/grammar" }, "Preview the 8 Advanced High grammar items →"));
  container.appendChild(extCard);

  root.innerHTML = "";
  root.appendChild(container);
}

function legendItem(stateClass, icon, label) {
  return el("div", { class: "path-legend-item" }, [
    el("span", { class: `path-legend-dot ${stateClass}` }, icon),
    el("span", { class: "muted small" }, label),
  ]);
}
