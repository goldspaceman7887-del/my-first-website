import { store } from "./core/storage.js";
import { registerRoute, setNotFound, initRouter, navigate } from "./core/router.js";
import { audioEngine } from "./core/audio.js";
import { reviewCounts } from "./core/srs.js";
import { el } from "./core/ui.js";
import { maybeShowOnboarding } from "./core/onboarding.js";
import { getHearts, MAX_HEARTS } from "./core/hearts.js";

import { renderDashboard } from "./views/dashboard.js";
import { renderVocabulary } from "./views/vocabulary.js";
import { renderGrammar } from "./views/grammar.js";
import { renderDialogueList, renderDialogueDetail } from "./views/dialogues.js";
import { renderListening } from "./views/listening.js";
import { renderSpeaking } from "./views/speaking.js";
import { renderReading } from "./views/reading.js";
import { renderWriting } from "./views/writing.js";
import { renderCulture } from "./views/culture.js";
import { renderReview } from "./views/review.js";
import { renderTutor } from "./views/tutor.js";
import { renderAchievements } from "./views/achievements.js";
import { renderSettings } from "./views/settings.js";

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
  document.getElementById("stat-streak").textContent = store.state.profile.streak || 0;
  document.getElementById("stat-xp").textContent = store.state.profile.xp || 0;
  document.getElementById("stat-level").textContent = store.state.profile.level || "A0";

  const hearts = getHearts();
  document.getElementById("stat-hearts").textContent = `${hearts.current}/${MAX_HEARTS}`;
  document.getElementById("stat-hearts-chip").classList.toggle("low-hearts", hearts.current <= 1);

  const counts = reviewCounts();
  const dueEl = document.getElementById("stat-due");
  const chip = document.getElementById("stat-due-chip");
  dueEl.textContent = counts.dueToday;
  chip.classList.toggle("has-due", counts.dueToday > 0);

  const goal = store.state.settings.dailyGoalXP || 50;
  const today = store.state.profile.studyDates.includes(new Date().toISOString().slice(0, 10));
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
registerRoute("vocabulary", renderVocabulary);
registerRoute("grammar", renderGrammar);
registerRoute("grammar/:id", renderGrammar);
registerRoute("dialogues", renderDialogueList);
registerRoute("dialogues/:id", renderDialogueDetail);
registerRoute("listening", renderListening);
registerRoute("speaking", renderSpeaking);
registerRoute("reading", renderReading);
registerRoute("reading/:id", renderReading);
registerRoute("writing", renderWriting);
registerRoute("culture", renderCulture);
registerRoute("culture/:id", renderCulture);
registerRoute("review", renderReview);
registerRoute("tutor", renderTutor);
registerRoute("achievements", renderAchievements);
registerRoute("settings", renderSettings);

setNotFound((container) => {
  container.appendChild(
    el("div", { class: "card empty-state" }, [
      el("div", { class: "empty-icon" }, "🧭"),
      el("h2", {}, "Página no encontrada"),
      el("p", {}, "Esa sección no existe todavía."),
      el("a", { class: "btn btn-primary", href: "#/dashboard" }, "Volver al panel")
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
