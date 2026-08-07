// First-run flow. Explains how the app actually works — lessons, ACTFL
// levels, practice, conversation, immersion, reviews — and starts with a
// short placement check so the dashboard and roadmap open from an accurate
// baseline instead of assuming zero. Nobody should reach the end of this not
// knowing what to do next.

import { store, todayISO } from "./storage.js";
import { el } from "./ui.js";
import { ACTFL_LEVELS, ROADMAP_UNITS, levelIndex } from "../data/roadmap.js";
import { scoreOpenResponse, levelIdxFromScore } from "./assessment.js";
import { spanishDistractors, englishDistractors } from "./distractors.js";
import { updateSkillScore } from "./gamification.js";

const STEPS = ["welcome", "placement", "actfl", "roadmap", "practice", "conversation", "ready"];

export function maybeShowOnboarding() {
  if (store.state.settings.onboardingSeen) return;
  showOnboarding();
}

// Two short free-typed prompts (scored the same way Speaking Test scores
// answers) plus three quick recognition questions spanning easy → hard,
// pulled straight from the roadmap so there's no separate question bank to
// maintain. Answering is never required to move on — this is a starting
// estimate, not a gate, and every question stays skippable.
function buildPlacementMC() {
  const picks = [
    ROADMAP_UNITS.find((u) => u.level === "novice-low"),
    ROADMAP_UNITS.find((u) => u.level === "intermediate-mid"),
    ROADMAP_UNITS.find((u) => u.level === "advanced-low")
  ].filter(Boolean);
  return picks.map((u) => {
    const s = u.sentences[0];
    const others = ROADMAP_UNITS.filter((x) => x.id !== u.id).flatMap((x) => x.sentences.map((sn) => sn.en));
    const wrong = englishDistractors(s.en, 3, others);
    return { es: s.es, correct: s.en, options: shuffle([s.en, ...wrong]) };
  });
}

function shuffle(a) {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function showOnboarding() {
  let stepIdx = 0;
  let selectedLevel = "novice-low";

  // Placement state
  const placementMC = buildPlacementMC();
  let mcCorrect = 0;
  let mcAnswered = 0;
  let openScores = []; // scoreOpenResponse() results from the 2 free-typed prompts
  let placementDone = false;
  let placementLevel = null; // ACTFL_LEVELS entry computed from the check

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

  function computePlacement() {
    if (placementDone) return;
    placementDone = true;
    const mcRatio = placementMC.length ? (mcCorrect / placementMC.length) * 100 : 50;
    const openAvg = openScores.length ? openScores.reduce((a, b) => a + b, 0) / openScores.length : 30;
    const combined = openScores.length ? openAvg * 0.6 + mcRatio * 0.4 : mcRatio;
    const idx = levelIdxFromScore(combined);
    placementLevel = ACTFL_LEVELS[idx];
    selectedLevel = placementLevel.code;
    store.state.progress.placementResult = {
      date: todayISO(), level: placementLevel.code,
      openAvg: Math.round(openAvg), mcRatio: Math.round(mcRatio)
    };
    // Seed day-one skill scores so the dashboard and the new ACTFL estimate
    // aren't blank on the very first screen — modest values, not a grade.
    if (openScores.length) {
      updateSkillScore("speaking", Math.round(openAvg / 6));
      updateSkillScore("writing", Math.round(openAvg / 6));
    }
    updateSkillScore("vocabulary", Math.round(mcRatio / 8));
    updateSkillScore("grammar", Math.round(mcRatio / 10));
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
          el("p", {}, "This app takes you from wherever you are now to ACTFL Advanced Low — real conversational fluency in modern, everyday Mexican Spanish, for actually living, traveling, working, and socializing in Mexico."),
          el("p", {}, "Six quick steps: a placement check, how ACTFL levels work, how the roadmap and practice sections work, a look at conversation and immersion, then straight into your first lesson.")
        ])
      );
    } else if (step === "placement") {
      renderPlacement();
    } else if (step === "actfl") {
      renderActfl();
    } else if (step === "roadmap") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "🗺️"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "How the roadmap works"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "Every unit runs the same loop: learn 8 sentences → a short grammar note → a 10-question unit test, played with hearts. Three of those ten questions come from units you already passed, so nothing you learn just gets tested once and forgotten."),
          el("p", {}, "Finish a section and you hit a checkpoint — 15 questions across everything in it — which confirms that ACTFL level and unlocks the next one."),
          el("p", {}, "Vocabulary never sits in isolation: every new word or pattern gets used in a real sentence, a grammar drill, and a written-production question in the same unit, before it comes back around in spaced review.")
        ])
      );
    } else if (step === "practice") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "🎯"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "How Practice works"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "Practice is organized around what you're training, not just a list of games:"),
          el("ul", { class: "onboarding-list" }, [
            el("li", {}, [el("strong", {}, "Daily Practice"), " — a short queue built for today: what's due, your next unit, one real-life scenario."]),
            el("li", {}, [el("strong", {}, "Vocabulary Review"), " — spaced-repetition flashcards for words you've been taught."]),
            el("li", {}, [el("strong", {}, "Listening Practice"), " — dialogues and stories played aloud, then comprehension questions."]),
            el("li", {}, [el("strong", {}, "Speaking Practice"), " — Conversation, Roleplay, and the Speaking Test in one place."]),
            el("li", {}, [el("strong", {}, "Writing Practice"), " — write freely, get every mistake explained, not just marked wrong."]),
            el("li", {}, [el("strong", {}, "Weakness Review"), " — pulls together whatever your data says is weakest right now."]),
            el("li", {}, [el("strong", {}, "ACTFL Skill Practice"), " — pick a skill and it directly moves the score behind your level estimate."])
          ])
        ])
      );
    } else if (step === "conversation") {
      card.appendChild(el("div", { class: "onboarding-icon" }, "💬"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "Conversation & Immersion Mode"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "Both are a rule-based Mexican conversation partner you answer by typing or speaking — no server, no API key, everything runs on your device. It follows up on what you actually said instead of asking a fixed list of questions, remembers a few details and brings them back later, and occasionally mishears you or interrupts, the way a real conversation does."),
          el("div", { class: "onboarding-chat-demo" }, [
            el("div", { class: "chat-bubble bot" }, [el("div", { class: "cb-es es-text" }, "¿Cómo te ha ido hoy?")]),
            el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-es es-text" }, "Bien, algo cansado.")]),
            el("div", { class: "chat-bubble bot" }, [el("div", { class: "cb-es es-text" }, "Ay, lo siento. ¿A qué hora te levantaste?")])
          ]),
          el("p", { class: "text-muted" }, "Conversation Mode shows English on request; Immersion Mode is Spanish only from the start — type \"?\" any time and it replays the last line slower, with a translation, then hands the same question right back to you."),
        ])
      );
    } else if (step === "ready") {
      const lvl = ACTFL_LEVELS.find((l) => l.code === selectedLevel);
      card.appendChild(el("div", { class: "onboarding-icon" }, "🚀"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "You're set up"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, `We've set your starting point to ${lvl.label}. Your dashboard, roadmap, and review queue all start from here — and it'll keep moving as you actually speak, listen, and write, not just as you finish units.`),
          el("p", {}, "Let's start with your first roadmap unit at that level.")
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
      nav.appendChild(el("button", { class: "btn btn-primary", onclick: () => {
        if (STEPS[stepIdx] === "placement") computePlacement();
        stepIdx++; renderStep();
      } }, "Next"));
    } else {
      nav.appendChild(el("button", { class: "btn btn-primary", onclick: finish }, "Start learning"));
    }
    card.appendChild(nav);

    function renderPlacement() {
      card.appendChild(el("div", { class: "onboarding-icon" }, "📊"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "Quick placement check"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "Answer what you can in Spanish — even one word is useful data. Nothing here is graded harshly, and skipping is fine; it just means we start you at Novice Low, which you can correct any time from the Speaking Test or the Level Test."),
        ])
      );

      const PROMPTS = ["¿Cómo te llamas y de dónde eres?", "Cuéntame algo de tu rutina diaria."];
      const openWrap = el("div", { class: "onboarding-placement-open" });
      PROMPTS.forEach((p, i) => {
        const ta = el("textarea", { placeholder: "Escribe tu respuesta en español (opcional)...", rows: "2" });
        ta.addEventListener("blur", () => {
          const text = ta.value.trim();
          if (!text) return;
          openScores[i] = scoreOpenResponse(text).score;
        });
        openWrap.appendChild(el("div", { class: "field" }, [el("label", {}, p), ta]));
      });
      card.appendChild(openWrap);

      card.appendChild(el("h4", { style: "margin-top:1rem" }, "And three quick ones — what does this mean?"));
      placementMC.forEach((q) => {
        const qCard = el("div", { class: "card exercise-card", style: "margin-top:.5rem" }, [
          el("p", { class: "exercise-prompt es-text", style: "margin:0" }, q.es)
        ]);
        const list = el("div", { class: "option-list", style: "margin-top:.5rem" });
        q.options.forEach((opt) => {
          const btn = el("button", { class: "option-btn" }, opt);
          btn.addEventListener("click", () => {
            if (btn.disabled) return;
            list.querySelectorAll(".option-btn").forEach((b) => { b.disabled = true; b.classList.add("disabled"); });
            const ok = opt === q.correct;
            btn.classList.add(ok ? "correct" : "incorrect");
            if (!ok) [...list.children].find((b) => b.textContent === q.correct)?.classList.add("correct");
            mcAnswered++;
            if (ok) mcCorrect++;
          });
          list.appendChild(btn);
        });
        qCard.appendChild(list);
        card.appendChild(qCard);
      });
    }

    function renderActfl() {
      card.appendChild(el("div", { class: "onboarding-icon" }, "📈"));
      card.appendChild(el("h2", { class: "onboarding-title" }, "How ACTFL levels work"));
      card.appendChild(
        el("div", { class: "onboarding-body" }, [
          el("p", {}, "ACTFL is the same 7-level scale real language proficiency is measured on: Novice Low → Novice Mid → Novice High → Intermediate Low → Intermediate Mid → Intermediate High → Advanced Low."),
          el("p", {}, "Your level here updates from real performance across speaking, listening, writing, reading, and vocabulary — not from finishing lessons or multiple-choice quizzes alone. A strong Speaking Test or Conversation session can move it up before your XP does."),
          el("p", {}, placementLevel
            ? `Based on your answers just now, we're starting you around ${placementLevel.label}. You can adjust this below.`
            : "You can pick a starting point below, or adjust it any time.")
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
    }
  }

  function finish() {
    computePlacement();
    store.state.profile.selfReportedLevel = selectedLevel;
    // Placement unlocks roadmap units up through that level immediately —
    // the same thing the Level Test does — so "first lesson" isn't stuck
    // behind Novice Low for someone who placed higher.
    const prevUnlocked = store.state.profile.unlockedThroughLevel;
    if (!prevUnlocked || levelIndex(prevUnlocked) < levelIndex(selectedLevel)) {
      store.state.profile.unlockedThroughLevel = selectedLevel;
    }
    store.saveNow();
    close();
    // First lesson: jump straight into the roadmap, now open through
    // whatever level the placement check landed on.
    window.location.hash = "#/roadmap";
  }

  renderStep();
}
