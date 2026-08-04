import { store } from "./core/storage.js";
import { registerRoute, setNotFound, initRouter, navigate } from "./core/router.js";
import { audioEngine } from "./core/audio.js";
import { reviewCounts } from "./core/srs.js";
import { el } from "./core/ui.js";
import { maybeShowOnboarding } from "./core/onboarding.js";
import { estimatedLevel } from "./core/gamification.js";
import { getHearts } from "./core/hearts.js";

import { renderDashboard } from "./views/dashboard.js";
import { renderRoadmap } from "./views/roadmap.js";
import { renderDialogueDetail } from "./views/dialogues.js";
import { renderLearn } from "./views/learn.js";
import { renderPractice } from "./views/practice.js";
import { renderLevelTest } from "./views/levelTest.js";
import { renderReview } from "./views/review.js";
import { renderAchievements } from "./views/achievements.js";
import { renderSettings } from "./views/settings.js";
import { renderSaveProgress } from "./views/saveProgress.js";

// ---------- Theme ----------
function applyTheme(theme) {
  if (theme === "auto") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
  const icon = document.getElementById("theme-icon");
  const effectiveDark =
    theme === "dark" || (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (icon) icon.textContent = effectiveDark ? "☀️" : "🌙";
}

function initTheme() {
  applyTheme(store.state.settings.theme || "auto");
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const cur = store.state.settings.theme || "auto";
    const effectiveDark = cur === "dark" || (cur === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const next = effectiveDark ? "light" : "dark";
    store.set("settings.theme", next);
    applyTheme(next);
  });
}

// ---------- Nav (mobile) ----------
function initNav() {
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("sidebar-scrim");
  const toggle = document.getElementById("nav-toggle");
  function close() {
    sidebar.classList.remove("open");
    scrim.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    scrim.classList.toggle("show", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  scrim.addEventListener("click", close);
  sidebar.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  window.addEventListener("hashchange", close);
}

// ---------- Immersion selector ----------
function initImmersion() {
  const sel = document.getElementById("immersion-select");
  sel.value = String(store.state.settings.immersionLevel || 1);
  sel.addEventListener("change", () => {
    store.set("settings.immersionLevel", Number(sel.value));
  });
}

// ---------- Topbar stats ----------
function refreshTopbarStats() {
  const hearts = getHearts();
  document.getElementById("stat-hearts").textContent = hearts.current;
  document.getElementById("stat-hearts-chip").classList.toggle("empty", hearts.current === 0);
  document.getElementById("stat-streak").textContent = store.state.profile.streak || 0;
  document.getElementById("stat-xp").textContent = store.state.profile.xp || 0;
  document.getElementById("stat-level").textContent = estimatedLevel().short;
  const counts = reviewCounts();
  const dueEl = document.getElementById("stat-due");
  const chip = document.getElementById("stat-due-chip");
  dueEl.textContent = counts.dueToday;
  chip.classList.toggle("has-due", counts.dueToday > 0);

  const goal = store.state.settings.dailyGoalXP || 40;
  const xpToday = store.state.xpLog
    .filter((l) => new Date(l.date).toDateString() === new Date().toDateString())
    .reduce((s, l) => s + l.amount, 0);
  const pct = Math.min(100, Math.round((xpToday / goal) * 100));
  const fill = document.getElementById("daily-goal-fill");
  const text = document.getElementById("daily-goal-text");
  if (fill) fill.style.width = pct + "%";
  if (text) text.textContent = `${xpToday} / ${goal} XP hoy`;
}

document.getElementById("stat-due-chip").addEventListener("click", () => navigate("#/review"));

// ---------- Routes ----------
registerRoute("dashboard", renderDashboard);
registerRoute("roadmap", renderRoadmap);
registerRoute("level-test", renderLevelTest);
registerRoute("learn", renderLearn);
registerRoute("learn/:tab", renderLearn);
registerRoute("dialogues/:id", renderDialogueDetail);
registerRoute("practice", renderPractice);
registerRoute("practice/:tab", renderPractice);
registerRoute("review", renderReview);
registerRoute("save", renderSaveProgress);
registerRoute("achievements", renderAchievements);
registerRoute("settings", renderSettings);

setNotFound((container) => {
  container.appendChild(
    el("div", { class: "card empty-state" }, [
      el("div", { class: "empty-icon" }, "🧭"),
      el("h2", {}, "Page not found"),
      el("p", {}, "That section doesn't exist yet."),
      el("a", { class: "btn btn-primary", href: "#/dashboard" }, "Back to dashboard")
    ])
  );
});

// ---------- Boot ----------
function boot() {
  initTheme();
  initNav();
  initImmersion();
  refreshTopbarStats();
  store.subscribe(refreshTopbarStats);
  audioEngine.onReady(() => {});
  initRouter();
  maybeShowOnboarding();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

window.addEventListener("beforeunload", () => store.saveNow());
