import { ROADMAP } from "../data/roadmap.js";
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
      el("p", { class: "subtitle" }, "Intermediate High → Advanced High. ~20-30 min/day. Check off tasks as you go — consistency matters more than any single long session."),
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

  ROADMAP.forEach((w) => {
    const isCurrent = w.week === currentWeek;
    const card = el("div", { class: `card week-card ${isCurrent ? "current-week" : ""}` });
    card.appendChild(
      el("div", { class: "week-card-header" }, [
        el("h2", {}, `Week ${w.week}: ${w.title}`),
        isCurrent ? el("span", { class: "badge" }, "You are here") : null,
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
