// A plain-language, step-by-step welcome tour shown on first visit.
// Written primarily in English on purpose: a total beginner shouldn't have
// to decode Spanish UI chrome before they've learned any Spanish at all.

import { store } from "./storage.js";
import { el } from "./ui.js";
import { navigate } from "./router.js";

const STEPS = [
  {
    icon: "👋",
    title: "Welcome! Let's learn Spanish together.",
    body: [
      "This app teaches the Spanish spoken in Spain — the same Spanish you'll hear in Madrid, Sevilla, or Barcelona.",
      "There is no rush here. Go at your own pace, and don't worry about making mistakes — that's how everyone learns."
    ]
  },
  {
    icon: "🗂️",
    title: "Start with Vocabulary",
    body: [
      "Tap \"Vocabulary\" (Vocabulario) in the menu to learn your first words.",
      "At the beginning, you'll see mostly English with just a word or two of Spanish — like learning to swim in shallow water first.",
      "As you get more comfortable, more Spanish will appear automatically. You control how fast with the \"Immersion\" setting at the top of the screen."
    ]
  },
  {
    icon: "🔊",
    title: "Listen before you read",
    body: [
      "Every word and sentence has a speaker button 🔊 — tap it to hear it spoken aloud in a Spanish accent.",
      "Tip: listen first, try to repeat it out loud, and only then look at the written word. Your ears learn faster than your eyes."
    ]
  },
  {
    icon: "✅",
    title: "Little quizzes check your memory",
    body: [
      "Along the way you'll answer short questions. This isn't a test to fail — it's just a gentle nudge to help your brain hold onto new words.",
      "When you answer, you'll instantly see if you were right, plus a simple explanation. Just tap the next thing and keep going."
    ]
  },
  {
    icon: "🔁",
    title: "\"Review\" is your friend",
    body: [
      "The app quietly keeps track of what you've learned. When something is about to slip from your memory, it shows up again in \"Review\" (Repaso) — right when you need it.",
      "A few minutes of Review each day works better than one long study session."
    ]
  },
  {
    icon: "🎉",
    title: "You're ready — vamos!",
    body: [
      "Everything you do is saved automatically on this device, so you can always pick up where you left off.",
      "If you ever feel lost, just come back to the home screen (Panel) — it always shows you what to do next."
    ]
  }
];

export function maybeShowOnboarding() {
  if (store.state.settings.onboardingSeen) return;
  showOnboarding();
}

export function showOnboarding() {
  let stepIndex = 0;
  const overlay = el("div", { class: "onboarding-overlay" });
  const card = el("div", { class: "onboarding-card pop-in" });
  overlay.appendChild(card);

  function close(goToDashboard) {
    store.set("settings.onboardingSeen", true);
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 200);
    if (goToDashboard) navigate("#/dashboard");
  }

  function render() {
    const step = STEPS[stepIndex];
    card.innerHTML = "";
    card.appendChild(
      el("div", { class: "onboarding-progress" }, STEPS.map((_, i) => el("span", { class: `onboarding-dot ${i === stepIndex ? "active" : ""}` })))
    );
    card.appendChild(el("div", { class: "onboarding-icon" }, step.icon));
    card.appendChild(el("h2", { class: "onboarding-title" }, step.title));
    step.body.forEach((p) => card.appendChild(el("p", { class: "onboarding-body" }, p)));

    const nav = el("div", { class: "onboarding-nav" });
    if (stepIndex > 0) {
      nav.appendChild(el("button", { class: "btn btn-lg", onclick: () => { stepIndex--; render(); } }, "← Back"));
    } else {
      nav.appendChild(el("button", { class: "btn btn-ghost btn-lg", onclick: () => close(false) }, "Skip"));
    }
    if (stepIndex < STEPS.length - 1) {
      nav.appendChild(el("button", { class: "btn btn-primary btn-lg", onclick: () => { stepIndex++; render(); } }, "Next →"));
    } else {
      nav.appendChild(el("button", { class: "btn btn-primary btn-lg", onclick: () => close(true) }, "Let's start! 🚀"));
    }
    card.appendChild(nav);
  }

  render();
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));
}
