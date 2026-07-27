import { store } from "../core/storage.js";
import { el } from "../core/ui.js";
import { ACHIEVEMENTS, xpProgressToNextLevel } from "../core/gamification.js";

export function renderAchievements(container) {
  const unlocked = new Set(store.state.achievements.unlocked);
  const lvl = xpProgressToNextLevel();

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🏆 Logros"),
      el("p", {}, `${unlocked.size} de ${ACHIEVEMENTS.length} desbloqueados. Sigue estudiando para conseguir todas las insignias.`)
    ])
  );

  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "flex justify-between items-center" }, [
        el("strong", {}, `Nivel actual: ${store.state.profile.level}`),
        el("span", { class: "badge badge-default" }, `${store.state.profile.xp} XP`)
      ]),
      el("div", { class: "progress-bar", style: "margin-top:.5rem" }, [el("div", { class: "progress-bar-fill", style: `width:${lvl.pct}%` })]),
      el("p", { class: "text-muted", style: "margin-top:.4rem" }, lvl.isMax ? "¡Has alcanzado el nivel máximo del currículo!" : `${lvl.xpIntoLevel} / ${lvl.xpForLevel} XP hacia ${lvl.nextLevel}`)
    ])
  );

  const grid = el("div", { class: "grid grid-3" });
  ACHIEVEMENTS.forEach((a) => {
    const isUnlocked = unlocked.has(a.id);
    grid.appendChild(
      el("div", { class: "card", style: isUnlocked ? "" : "opacity:.5" }, [
        el("div", { style: "font-size:2rem" }, a.icon),
        el("h3", { style: "margin:.4rem 0" }, a.name),
        el("p", { class: "text-muted", style: "font-size:.85rem" }, a.desc),
        isUnlocked ? el("span", { class: "badge badge-success" }, "Desbloqueado") : el("span", { class: "badge badge-default" }, "Bloqueado")
      ])
    );
  });
  container.appendChild(grid);
}
