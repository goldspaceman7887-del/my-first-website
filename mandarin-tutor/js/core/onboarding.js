// First-run flow: explains the system, then captures the learner's
// self-reported starting knowledge ("I currently know ~25 characters")
// so the dashboard and difficulty system start from an accurate baseline
// instead of zero.

import { store } from "./storage.js";
import { el } from "./ui.js";
import { CHARACTERS } from "../data/characters.js";
import { INTERVAL_STEPS } from "./srs.js";

const STEPS = ["welcome", "philosophy", "known-chars", "ready"];

export function maybeShowOnboarding() {
  if (store.state.settings.onboardingSeen) return;
  showOnboarding();
}

function seedKnownCharacter(char) {
  const id = `character_${char.id}`;
  const now = Date.now();
  store.state.srs[id] = {
    id,
    type: "character",
    repetition: 3,
    easeFactor: 2.5,
    interval: INTERVAL_STEPS[4],
    stepIndex: 4,
    nextReview: now + INTERVAL_STEPS[4] * 86400000,
    lastReview: now,
    correct: 1,
    incorrect: 0,
    history: [{ date: now, quality: 4 }]
  };
}

function showOnboarding() {
  let stepIdx = 0;
  const selected = new Set();

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
      card.appendChild(el("div", { class: "onboarding-icon" }, "🀄"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "Welcome to your Mandarin tutor"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "This app is built to make you conversationally fluent — not to hand you random vocab lists."),
          el("p", {}, "It systematically builds speaking, listening, character recognition, sentence comprehension, conversational fluency, and long-term retention through spaced repetition.")
        ])
      );
    } else if (step === "philosophy") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "🗣️"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "Meaning first, grammar last"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "Every lesson follows this order: meaning → sentence → conversation → vocabulary → characters → grammar explanation."),
          el("p", {}, "You'll always see language used in a real, useful example before any rule is explained.")
        ])
      );
    } else if (step === "known-chars") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "📝"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "What do you already know?"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "You said you know about 25 characters already. Tap the ones you actually recognize below (or use the quick-select) so we don't waste time re-teaching them."),
          el("p", { class: "text-faint" }, `${selected.size} selected`)
        ])
      );
      const grid = el(
        "div",
        { class: "known-char-grid" },
        CHARACTERS.slice(0, 40).map((c) => {
          const btn = el("button", { class: "known-char-pick", type: "button" }, c.char);
          btn.addEventListener("click", () => {
            if (selected.has(c.id)) selected.delete(c.id);
            else selected.add(c.id);
            btn.classList.toggle("selected", selected.has(c.id));
            card.querySelector(".text-faint").textContent = `${selected.size} selected`;
          });
          return btn;
        })
      );
      card.appendChild(grid);
      card.appendChild(
        el(
          "button",
          {
            class: "btn btn-sm",
            style: "margin-top:.6rem",
            onclick: () => {
              CHARACTERS.slice(0, 25).forEach((c) => selected.add(c.id));
              grid.querySelectorAll(".known-char-pick").forEach((btn, i) => {
                if (i < 25) btn.classList.add("selected");
              });
              card.querySelector(".text-faint").textContent = `${selected.size} selected`;
            }
          },
          "Quick-select the first 25 (recommended)"
        )
      );
    } else if (step === "ready") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "🚀"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "You're set up"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, `We've marked ${selected.size} character(s) as known. Your dashboard, review queue, and difficulty level all start from here.`),
          el("p", {}, "Try Daily Lesson first — it reviews what's due, then teaches new material in the right order.")
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
    const chosen = CHARACTERS.filter((c) => selected.has(c.id));
    store.state.profile.selfReportedKnownChars = chosen.map((c) => c.char);
    chosen.forEach(seedKnownCharacter);
    store.saveNow();
    close();
  }

  renderStep();
}
