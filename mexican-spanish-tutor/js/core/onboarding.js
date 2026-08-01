// First-run flow: explains the system, then captures the learner's
// self-reported ACTFL starting level so the dashboard and roadmap start
// from an accurate baseline instead of assuming zero.

import { store } from "./storage.js";
import { el } from "./ui.js";
import { ACTFL_LEVELS } from "../data/roadmap.js";

const STEPS = ["welcome", "philosophy", "level", "ready"];

export function maybeShowOnboarding() {
  if (store.state.settings.onboardingSeen) return;
  showOnboarding();
}

function showOnboarding() {
  let stepIdx = 0;
  let selectedLevel = "novice-low";

  const overlay = el("div", { class: "onboarding-overlay" });
  const card = el("div", { class: "onboarding-card" });
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));

  function close() {
    store.set("settings.onboardingSeen", true);
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 250);
  }

  function renderStep() {
    card.innerHTML = "";
    card.appendChild(
      el(
        "div",
        { class: "onboarding-progress" },
        STEPS.map((_, i) => el("span", { class: `onboarding-dot ${i === stepIdx ? "active" : ""}` }))
      )
    );

    const step = STEPS[stepIdx];
    if (step === "welcome") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "🇲🇽"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "Bienvenido — your Mexican Spanish tutor"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "This app is built to take you from wherever you are now to ACTFL Advanced Low — real conversational fluency in modern, everyday Mexican Spanish."),
          el("p", {}, "It systematically builds speaking, listening, reading, writing, vocabulary, conversational fluency, storytelling, and long-term retention through spaced repetition, tracked against the official ACTFL proficiency scale.")
        ])
      );
    } else if (step === "philosophy") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "🗣️"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "Communication over memorization"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "Every lesson prioritizes real-world Mexican Spanish over textbook trivia — carro not coche, manejar, ¿qué onda?, ¿mande?, ahorita, órale."),
          el("p", {}, "Grammar is always taught through a real sentence and a conversation first, and the rule comes last — never the other way around.")
        ])
      );
    } else if (step === "level") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "📊"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "Where are you starting from?"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "Pick your best guess — you can retake an OPI Practice interview any time to refine this estimate.")
        ])
      );
      const grid = el(
        "div",
        { class: "onboarding-level-grid" },
        ACTFL_LEVELS.map((l) => {
          const btn = el("button", { class: `onboarding-level-pick ${l.code === selectedLevel ? "selected" : ""}`, type: "button" }, [
            el("div", { style: "font-weight:800" }, l.label),
            el("div", { style: "font-size:.78rem;color:var(--text-faint)" }, l.blurb)
          ]);
          btn.addEventListener("click", () => {
            selectedLevel = l.code;
            grid.querySelectorAll(".onboarding-level-pick").forEach((b) => b.classList.remove("selected"));
            btn.classList.add("selected");
          });
          return btn;
        })
      );
      card.appendChild(grid);
    } else if (step === "ready") {
      const lvl = ACTFL_LEVELS.find((l) => l.code === selectedLevel);
      card.appendChild(el("div", { class: "onboarding-icon" }, "🚀"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "You're set up"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, `We've set your starting point to ${lvl.label}. Your dashboard, roadmap, and review queue all start from here.`),
          el("p", {}, "Try Daily Lesson first — it reviews what's due, then teaches new material in the right order: meaning → sentence → conversation → vocabulary → grammar.")
        ])
      );
    }

    const nav = el("div", { class: "onboarding-nav" });
    if (stepIdx > 0) {
      nav.appendChild(el("button", { class: "btn", onclick: () => { stepIdx--; renderStep(); } }, "Back"));
    } else {
      nav.appendChild(el("button", { class: "btn btn-ghost", onclick: finish }, "Skip"));
    }
    if (stepIdx < STEPS.length - 1) {
      nav.appendChild(el("button", { class: "btn btn-primary", onclick: () => { stepIdx++; renderStep(); } }, "Next"));
    } else {
      nav.appendChild(el("button", { class: "btn btn-primary", onclick: finish }, "Start learning"));
    }
    card.appendChild(nav);
  }

  function finish() {
    store.state.profile.selfReportedLevel = selectedLevel;
    store.saveNow();
    close();
  }

  renderStep();
}
