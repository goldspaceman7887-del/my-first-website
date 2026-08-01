import { registerRoute, initRouter } from "./core/router.js";
import { touchDaily, getState, subscribe } from "./core/storage.js";
import { render as renderDashboard } from "./views/dashboard.js";
import { render as renderConnectors } from "./views/connectors.js";
import { render as renderGrammar } from "./views/grammar.js";
import { render as renderVocabulary } from "./views/vocabulary.js";
import { render as renderLevels } from "./views/levels.js";
import { render as renderPractice } from "./views/practice.js";
import { render as renderShadowing } from "./views/shadowing.js";
import { render as renderRoadmap } from "./views/roadmap.js";
import { render as renderRubric } from "./views/rubric.js";
import { render as renderGuide } from "./views/guide.js";
import { render as renderSettings } from "./views/settings.js";

touchDaily();

registerRoute("/dashboard", renderDashboard);
registerRoute("/connectors", renderConnectors);
registerRoute("/grammar", renderGrammar);
registerRoute("/vocabulary", renderVocabulary);
registerRoute("/levels", renderLevels);
registerRoute("/practice", renderPractice);
registerRoute("/shadowing", renderShadowing);
registerRoute("/roadmap", renderRoadmap);
registerRoute("/rubric", renderRubric);
registerRoute("/guide", renderGuide);
registerRoute("/settings", renderSettings);

function updateTopbar() {
  const state = getState();
  document.getElementById("stat-streak").textContent = state.streak;
  document.getElementById("stat-xp").textContent = state.xp;
}

subscribe(updateTopbar);

const root = document.getElementById("view-root");
const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
initRouter(root, navLinks);
updateTopbar();

const navToggle = document.getElementById("nav-toggle");
const sidebar = document.getElementById("sidebar");
const scrim = document.getElementById("sidebar-scrim");
function closeSidebar() {
  sidebar.classList.remove("open");
  scrim.classList.remove("show");
  navToggle.setAttribute("aria-expanded", "false");
}
navToggle.addEventListener("click", () => {
  const open = sidebar.classList.toggle("open");
  scrim.classList.toggle("show", open);
  navToggle.setAttribute("aria-expanded", String(open));
});
scrim.addEventListener("click", closeSidebar);
navLinks.forEach((a) => a.addEventListener("click", closeSidebar));

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("jpAdvSpeak_theme", theme);
}
const savedTheme = localStorage.getItem("jpAdvSpeak_theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(savedTheme);
themeToggle.addEventListener("click", () => {
  applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
});
