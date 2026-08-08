// First-run flow: orients a new user before dropping them into the app —
// where they stand, what the roadmap/practice/conversation/immersion
// surfaces actually do, and how to get unstuck — then hands off straight
// into their first roadmap lesson instead of an empty dashboard.

import { store } from "./storage.js";
import { el } from "./ui.js";
import { navigate } from "./router.js";
import { ACTFL_LEVELS } from "../data/roadmap.js";

const STEPS = ["placement", "actfl", "roadmap", "practice", "conversation", "immersion", "ready"];

export function maybeShowOnboarding() {
  if (store.state.settings.onboardingSeen) return;
  showOnboarding();
}

function levelVariant(code) {
  if (code.startsWith("novice")) return "novice";
  if (code.startsWith("intermediate")) return "intermediate";
  return "advanced";
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

    if (step === "placement") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "📊"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "Where are you starting from?"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "Pick your best guess — this sets where your dashboard, roadmap, and review queue start from. You can retake this any time.")
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
      card.appendChild(
        el("p", { class: "text-muted", style: "margin-top:.75rem;font-size:.85rem" }, [
          "Rather not guess? ",
          (() => {
            const link = el("a", { href: "#", style: "color:var(--accent);font-weight:600" }, "Take the 2-minute Level Test instead →");
            link.addEventListener("click", (e) => { e.preventDefault(); finish({ toLevelTest: true }); });
            return link;
          })()
        ])
      );
    } else if (step === "actfl") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "🪜"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "The ACTFL scale") );
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "This app tracks your progress against ACTFL — the standard U.S. proficiency scale, not a made-up leveling system. Every unit, scenario, and report ties back to one of these seven levels."),
          el("div", { style: "margin-top:.75rem" },
            ACTFL_LEVELS.map((l) =>
              el("div", { class: "flex items-center gap-2", style: "padding:.3rem 0" }, [
                el("span", { class: `badge badge-${levelVariant(l.code)}`, style: "min-width:2.4rem;text-align:center" }, l.short),
                el("span", {}, [el("strong", {}, l.label), el("span", { class: "text-muted" }, ` — ${l.blurb}`)])
              ])
            )
          ),
          el("p", { class: "text-muted", style: "margin-top:.6rem" }, "The goal isn't finishing lessons — it's a verified Advanced Low: functioning in Spanish for everyday life, work, and problem-solving in Mexico.")
        ])
      );
    } else if (step === "roadmap") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "🗺️"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "The Roadmap"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "Your main path, one unit at a time. Every unit runs the same loop:"),
          el("ol", { style: "margin:.5rem 0 0;padding-left:1.3rem;line-height:1.7" }, [
            el("li", {}, "Learn 8 sentences — meaning first, never a bare grammar rule."),
            el("li", {}, "A short grammar note, built from those same sentences."),
            el("li", {}, "Use it now — say or type 3 of them back, ungraded."),
            el("li", {}, "A 10-question unit test, played with hearts — wrong answers cost a heart.")
          ]),
          el("p", { class: "text-muted", style: "margin-top:.6rem" }, "Passing unlocks the next unit and folds that material into spaced repetition, so it keeps coming back instead of being tested once and forgotten.")
        ])
      );
    } else if (step === "practice") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "🎯"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "Practice"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "Once you've learned material, Practice is where you actually use it:"),
          el("ul", { style: "margin:.5rem 0 0;padding-left:1.3rem;line-height:1.7" }, [
            el("li", {}, [el("strong", {}, "Scenarios"), " — complete a real task (order coffee, check into a hotel) against an NPC who won't let you fake it."]),
            el("li", {}, [el("strong", {}, "Conversation"), " and ", el("strong", {}, "Immersion"), " — open-ended chat that follows what you actually say."]),
            el("li", {}, [el("strong", {}, "Listening, Writing, Speaking Test"), " — focused drills for one skill at a time."]),
            el("li", {}, [el("strong", {}, "Weakness Review"), " — points at whatever's actually shakiest instead of guessing."])
          ]),
          el("p", { class: "text-muted", style: "margin-top:.6rem" }, "Daily Practice — the first tab — always shows what's worth doing right now.")
        ])
      );
    } else if (step === "conversation") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "💬"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "Conversation Mode"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "Type or speak your answer — the other side reacts to what you actually said, remembers details, and follows up, instead of running a fixed script:")
        ])
      );
      card.appendChild(
        el("div", { class: "chat-log", style: "margin-top:.5rem;max-height:none" }, [
          el("div", { class: "chat-bubble bot" }, [el("div", { class: "cb-es es-text" }, "¡Qué onda! ¿Cómo te ha ido hoy?")]),
          el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-es es-text" }, "Bien, trabajé mucho pero estoy contento.")]),
          el("div", { class: "chat-bubble bot" }, [el("div", { class: "cb-es es-text" }, "¡Qué bueno! ¿En qué trabajas?")])
        ])
      );
    } else if (step === "immersion") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "🌊"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "Immersion Mode & getting unstuck"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "Immersion Mode is Spanish only, start to finish — no English on screen unless you ask for it. The same escape hatch works in Immersion, Conversation, and every task Scenario:"),
          el("div", { class: "chat-bubble bot", style: "margin-top:.6rem" }, [
            el("span", { class: "badge badge-gold" }, "Más despacio + traducción"),
            el("div", { class: "cb-es es-text", style: "margin-top:.3rem" }, "¿A qué hora te levantaste?"),
            el("div", { class: "cb-en" }, "What time did you get up?")
          ]),
          el("p", { class: "text-muted", style: "margin-top:.6rem" }, "Type \"?\" or \"no entiendo\" any time and it replays the last line slower, with a translation — then it's straight back to Spanish. You'll never be stuck with no way forward.")
        ])
      );
    } else if (step === "ready") {
      const lvl = ACTFL_LEVELS.find((l) => l.code === selectedLevel);
      card.appendChild(el("div", { class: "onboarding-icon" }, "🚀"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "You're set up"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, `We've set your starting point to ${lvl.label}. Your dashboard, roadmap, and review queue all start from here.`),
          el("p", {}, "Straight into your first roadmap unit — meaning first, then grammar, then using it, then the test.")
        ])
      );
    }

    const nav = el("div", { class: "onboarding-nav" });
    if (stepIdx > 0) {
      nav.appendChild(el("button", { class: "btn", onclick: () => { stepIdx--; renderStep(); } }, "Back"));
    } else {
      nav.appendChild(el("button", { class: "btn btn-ghost", onclick: () => finish() }, "Skip"));
    }
    if (stepIdx < STEPS.length - 1) {
      nav.appendChild(el("button", { class: "btn btn-primary", onclick: () => { stepIdx++; renderStep(); } }, "Next"));
    } else {
      nav.appendChild(el("button", { class: "btn btn-primary", onclick: () => finish() }, "Start learning"));
    }
    card.appendChild(nav);
  }

  function finish({ toLevelTest = false } = {}) {
    store.state.profile.selfReportedLevel = selectedLevel;
    store.state.settings.onboardingSeen = true;
    // Spanish-only by default, but ONLY for a brand-new user completing
    // onboarding for the first time — maybeShowOnboarding() already
    // early-returns once onboardingSeen is true, so this line can never run
    // again and silently override an existing user's saved immersion
    // setting.
    store.state.settings.immersionLevel = 4;
    store.saveNow();
    close();
    if (toLevelTest) navigate("#/level-test");
    else navigate("#/roadmap?start=first");
  }

  renderStep();
}
