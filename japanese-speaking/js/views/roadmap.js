import { ROADMAP, CHECKPOINTS, EXTENSION } from "../data/roadmap.js";
import { getState, toggleTask } from "../core/storage.js";
import { el, progressBar } from "../core/ui.js";

function daysSince(dateStr) {
  return Math.floor((new Date() - new Date(dateStr)) / 86400000);
}

export function render(root) {
  const state = getState();
  const currentWeek = Math.max(1, Math.min(12, Math.floor(daysSince(state.startDate) / 7) + 1));

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
      el("div", { class: "muted small" }, `Overall progress: ${doneTasks}/${totalTasks} tasks`),
      progressBar(Math.round((doneTasks / totalTasks) * 100)),
    ])
  );

  const checkpointCard = el("div", { class: "card checkpoint-card" });
  checkpointCard.appendChild(el("h2", {}, "Checkpoints"));
  CHECKPOINTS.forEach((cp) => {
    checkpointCard.appendChild(
      el("div", { class: "checkpoint-row" }, [
        el("span", { class: "badge" }, `Week ${cp.week}`),
        el("div", {}, [el("strong", {}, cp.label), el("div", { class: "muted small" }, cp.desc)]),
      ])
    );
  });
  container.appendChild(checkpointCard);

  ROADMAP.forEach((w) => {
    const isCurrent = w.week === currentWeek;
    const checkpoint = CHECKPOINTS.find((cp) => cp.week === w.week);
    const card = el("div", { class: `card week-card ${isCurrent ? "current-week" : ""}` });
    card.appendChild(
      el("div", { class: "week-card-header" }, [
        el("h2", {}, `Week ${w.week}: ${w.title}`),
        isCurrent ? el("span", { class: "badge" }, "You are here") : null,
        checkpoint ? el("span", { class: "badge warn" }, "🎯 Checkpoint week") : null,
      ])
    );
    card.appendChild(el("p", { class: "muted" }, w.focus));
    card.appendChild(el("p", { class: "muted small" }, `~${w.dailyMinutes} min/day`));
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
    card.appendChild(list);
    container.appendChild(card);
  });

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
