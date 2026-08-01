import { ROADMAP, CHECKPOINTS } from "../data/roadmap.js";
import { getState, toggleTask } from "../core/storage.js";
import { el, progressBar } from "../core/ui.js";

function daysSince(dateStr) {
  return Math.floor((new Date() - new Date(dateStr)) / 86400000);
}

export function render(root) {
  const state = getState();
  const currentWeek = Math.max(1, Math.min(8, Math.floor(daysSince(state.startDate) / 7) + 1));

  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "📅 8-Week Roadmap"),
      el("p", { class: "subtitle" }, "Mid-Intermediate High → Advanced High, via explicit Advanced Low and Advanced Mid checkpoints. 30-40 min/day. This plan assumes daily practice — it's built to be demanding, not gentle."),
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

  root.innerHTML = "";
  root.appendChild(container);
}
