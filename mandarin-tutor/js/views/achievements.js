import { store } from "../core/storage.js";
import { el, progressBar } from "../core/ui.js";
import { ACHIEVEMENTS } from "../core/gamification.js";

export function renderAchievements(container) {
  const unlocked = new Set(store.state.achievements.unlocked);
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🏆 Achievements"),
      el("p", {}, `${unlocked.size} of ${ACHIEVEMENTS.length} unlocked. XP: ${store.state.profile.xp || 0} · Longest streak: ${store.state.profile.longestStreak || 0} days.`)
    ])
  );

  container.appendChild(progressBar(Math.round((unlocked.size / ACHIEVEMENTS.length) * 100)));

  const grid = el("div", { class: "grid grid-3", style: "margin-top:1rem" });
  container.appendChild(grid);
  ACHIEVEMENTS.forEach((a) => {
    const isUnlocked = unlocked.has(a.id);
    grid.appendChild(
      el("div", { class: `card ${isUnlocked ? "" : "text-faint"}`, style: isUnlocked ? "border-color:var(--gold)" : "opacity:.6" }, [
        el("div", { style: "font-size:2rem" }, isUnlocked ? a.icon : "🔒"),
        el("div", { class: "card-title", style: "margin-top:.4rem" }, a.name),
        el("p", { class: "text-muted" }, a.desc)
      ])
    );
  });
}
