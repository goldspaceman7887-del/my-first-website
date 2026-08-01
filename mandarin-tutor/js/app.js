import { store } from "./core/storage.js";
import { registerRoute, setNotFound, initRouter, navigate } from "./core/router.js";
import { audioEngine } from "./core/audio.js";
import { reviewCounts } from "./core/srs.js";
import { el } from "./core/ui.js";
import { maybeShowOnboarding } from "./core/onboarding.js";
import { levelForCharCount } from "./core/gamification.js";
import { CHARACTERS } from "./data/characters.js";
import { isMastered } from "./core/srs.js";

import { renderDashboard } from "./views/dashboard.js";
import { renderRoadmap } from "./views/roadmap.js";
import { renderCharacters } from "./views/characters.js";
import { renderVocabulary } from "./views/vocabulary.js";
import { renderSentences } from "./views/sentences.js";
import { renderDialogueList, renderDialogueDetail } from "./views/dialogues.js";
import { renderReview } from "./views/review.js";
import { renderAchievements } from "./views/achievements.js";
import { renderSettings } from "./views/settings.js";
import { renderDailyLesson } from "./views/dailyLesson.js";
import { renderSpeaking } from "./views/speaking.js";
import { renderImmersion } from "./views/immersion.js";
import { renderStory } from "./views/story.js";
import { renderMining } from "./views/mining.js";
import { renderCorrection } from "./views/correction.js";

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

function knownCharCount() {
  const selfReported = new Set(store.state.profile.selfReportedKnownChars || []);
  const masteredCount = Object.keys(store.state.srs).filter((id) => id.startsWith("character_") && isMastered(id, 70)).length;
  return new Set([...selfReported]).size + masteredCount;
}

// ---------- Topbar stats ----------
function refreshTopbarStats() {
  document.getElementById("stat-streak").textContent = store.state.profile.streak || 0;
  document.getElementById("stat-xp").textContent = store.state.profile.xp || 0;
  document.getElementById("stat-level").textContent = `L${levelForCharCount(knownCharCount()).level}`;
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
  if (text) text.textContent = `${xpToday} / ${goal} XP today`;
}

document.getElementById("stat-due-chip").addEventListener("click", () => navigate("#/review"));

// ---------- Routes ----------
registerRoute("dashboard", renderDashboard);
registerRoute("roadmap", renderRoadmap);
registerRoute("characters", renderCharacters);
registerRoute("vocabulary", renderVocabulary);
registerRoute("sentences", renderSentences);
registerRoute("dialogues", renderDialogueList);
registerRoute("dialogues/:id", renderDialogueDetail);
registerRoute("review", renderReview);
registerRoute("daily-lesson", renderDailyLesson);
registerRoute("speaking", renderSpeaking);
registerRoute("immersion", renderImmersion);
registerRoute("story", renderStory);
registerRoute("mining", renderMining);
registerRoute("correction", renderCorrection);
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
