// SCENARIO MODE — goal-directed real-life situations across 11 categories
// (food, shopping, transportation, travel, healthcare, social, workplace,
// housing, banking, emergencies, government). Each scenario has a concrete
// goal, one or more NPCs, a short turn sequence with line variants (so a
// replay doesn't feel identical), a scheduled "unexpected event" that can
// interrupt or complicate things, and three narrated outcomes depending on
// how much of the goal you actually got across — the consequence is real:
// the wrong order, the missed detail, the confused clerk.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive, toast, confettiBurst, clickableDiv } from "../core/ui.js";
import { audioEngine, speechRecognitionSupported, startDictation } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { correctionBlock } from "../core/feedback.js";
import { tappable, englishReveal, initTapWords } from "../core/tapword.js";
import { navigate } from "../core/router.js";
import { levelByCode } from "../data/roadmap.js";
import { SCENARIO_CATEGORIES, scenariosByCategory, scenarioById } from "../data/scenarios.js";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function levelVariant(code) {
  if (code.startsWith("novice")) return "novice";
  if (code.startsWith("intermediate")) return "intermediate";
  return "advanced";
}

// ---------- Browse: categories, then scenarios within a category ----------
export function renderScenarioList(container) {
  let activeCategory = null;

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎬 Scenario Mode"),
      el("p", {}, "Real-life situations across Mexico, each with a concrete goal — order the right thing, explain the right symptom, get the right room. What you communicate (or don't) changes how it turns out.")
    ])
  );

  const body = el("div", {});
  container.appendChild(body);
  render();

  function render() {
    body.innerHTML = "";
    if (!activeCategory) {
      const grid = el("div", { class: "grid grid-auto" });
      SCENARIO_CATEGORIES.forEach((cat) => {
        const scenarios = scenariosByCategory(cat.id);
        const done = scenarios.filter((s) => (store.state.progress.scenariosCompleted || []).includes(s.id)).length;
        grid.appendChild(
          clickableDiv({ class: "card card-link", style: "cursor:pointer", onclick: () => { activeCategory = cat.id; render(); } }, [
            el("div", { style: "font-size:2rem" }, cat.icon),
            el("h3", { style: "margin:.4rem 0 .2rem" }, cat.label),
            el("p", { class: "text-muted" }, `${done}/${scenarios.length} completed`)
          ])
        );
      });
      body.appendChild(grid);
    } else {
      const cat = SCENARIO_CATEGORIES.find((c) => c.id === activeCategory);
      body.appendChild(
        el("button", { class: "btn btn-sm", onclick: () => { activeCategory = null; render(); } }, "← All categories")
      );
      body.appendChild(el("h2", { style: "margin:.6rem 0 .4rem" }, `${cat.icon} ${cat.label}`));
      const grid = el("div", { class: "grid grid-auto" });
      scenariosByCategory(activeCategory).forEach((s) => {
        const done = (store.state.progress.scenariosCompleted || []).includes(s.id);
        const lvl = levelByCode(s.level);
        grid.appendChild(
          el("a", { class: "card card-link", href: `#/scenarios/${s.id}` }, [
            el("div", { class: "flex justify-between items-center", style: "gap:.5rem" }, [
              el("span", { class: `badge badge-${levelVariant(s.level)}` }, lvl ? lvl.short : s.level),
              done ? el("span", { class: "badge badge-success" }, "✓ Done") : null
            ].filter(Boolean)),
            el("h3", { style: "margin:.5rem 0 .2rem" }, s.title),
            el("p", { class: "text-muted" }, s.goal)
          ])
        );
      });
      body.appendChild(grid);
    }
  }
}

// ---------- Run a single scenario ----------
// opts.embedded + opts.onFinish let Daily Life Simulation Mode (dailySim.js)
// run a scenario inline as one part of a chained day instead of as its own
// standalone route: no back-link/page-header, and instead of the normal
// "try another / retry" outcome card, onFinish(outcomeKey) hands control
// back to the day orchestrator.
export function renderScenarioRun(container, params, opts = {}) {
  const { embedded = false, onFinish = null } = opts;
  const untap = initTapWords();
  const scenario = scenarioById(params.id);

  if (!scenario) {
    container.appendChild(
      el("div", { class: "card empty-state" }, [
        el("h3", {}, "Scenario not found"),
        el("a", { class: "btn", href: "#/scenarios" }, "← Back to Scenario Mode")
      ])
    );
    return untap;
  }

  const canSpeak = speechRecognitionSupported();
  const lvl = levelByCode(scenario.level);
  let dictation = null;
  let turns = 0;
  let finished = false;
  const satisfied = new Set(); // requiredInfo keys already communicated
  let allUserText = "";

  // The unexpected-event roll happens once per scenario load, not per
  // response, so it can't retry itself into firing more than scheduled.
  const script = [];
  scenario.turns.forEach((turn, i) => {
    script.push({ kind: "turn", turn });
    const ev = (scenario.unexpectedEvents || []).find((e) => e.afterTurn === i);
    if (ev && Math.random() < (ev.chance ?? 0.3)) script.push({ kind: "unexpected", ev, spk: turn.spk });
  });
  let stepIdx = 0;

  if (!embedded) {
    container.appendChild(
      el("div", { class: "page-header" }, [
        el("a", { class: "text-muted", href: "#/scenarios" }, "← All scenarios"),
        el("h1", {}, scenario.title)
      ])
    );
  } else {
    container.appendChild(el("h2", { style: "margin:0 0 .5rem" }, scenario.title));
  }

  container.appendChild(
    el("div", { class: "card", style: "border-left:3px solid var(--accent);margin-bottom:.75rem" }, [
      el("div", { class: "card-title" }, "🎯 Goal"),
      el("p", { style: "margin:.2rem 0 .5rem" }, scenario.goal),
      el("div", { class: "flex gap-2 flex-wrap", style: "margin-bottom:.3rem" }, [
        el("span", { class: `badge badge-${levelVariant(scenario.level)}` }, lvl ? lvl.short : scenario.level),
        ...scenario.speakers.map((sp) => el("span", { class: "badge badge-default" }, `${sp.name} — ${sp.role}`))
      ])
    ])
  );

  const log = el("div", { class: "chat-log" });
  container.appendChild(log);

  const controls = el("div", {});
  container.appendChild(controls);

  const input = el("input", { type: "text", placeholder: "Escribe tu respuesta en español..." });
  input.style.cssText = "flex:1;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1.05rem;";
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });

  const micBtn = el("button", {
    class: "btn btn-icon btn-primary",
    title: canSpeak ? "Answer out loud" : "Answering out loud needs Chrome or Edge",
    "aria-label": "Speak your answer"
  }, "🎤");
  if (!canSpeak) micBtn.disabled = true;
  micBtn.addEventListener("click", () => (dictation ? stopMic(true) : startMic()));

  const sendBtn = el("button", { class: "btn btn-primary", onclick: () => send() }, "Enviar");
  const inputRow = el("div", { class: "chat-input-row" }, [micBtn, input, sendBtn]);
  controls.appendChild(inputRow);
  const micStatus = el("div", { class: "text-muted", style: "font-size:.8rem;min-height:1.2em;margin-top:.3rem" }, "");
  controls.appendChild(micStatus);

  function startMic() {
    micBtn.textContent = "⏹";
    micBtn.classList.replace("btn-primary", "btn-danger");
    micStatus.textContent = "Escuchando…";
    input.value = "";
    dictation = startDictation({
      onInterim: (finalSoFar, interim) => { input.value = (finalSoFar + " " + interim).trim(); },
      onError: (err) => {
        if (err === "not-allowed" || err === "service-not-allowed") micStatus.textContent = "El micrófono está bloqueado. Puedes escribir.";
      },
      onStateChange: (s) => { if (s === "denied") stopMic(false); }
    });
    if (!dictation.supported) { dictation = null; resetMic(); }
  }
  function stopMic(thenSend) {
    if (!dictation) return;
    const text = dictation.stop();
    dictation = null;
    resetMic();
    micStatus.textContent = "";
    if (thenSend) {
      if (!input.value.trim() && text) input.value = text;
      if (input.value.trim()) send();
    }
  }
  function resetMic() {
    micBtn.textContent = "🎤";
    micBtn.classList.replace("btn-danger", "btn-primary");
  }

  function speakerLabel(spkId) {
    const sp = scenario.speakers.find((s) => s.id === spkId);
    return sp ? sp.name : spkId;
  }

  function botSay(spkId, line) {
    const bubble = el("div", { class: "chat-bubble bot" }, [
      scenario.speakers.length > 1 ? el("div", { class: "badge badge-default", style: "margin-bottom:.3rem" }, speakerLabel(spkId)) : null,
      tappable(line.es, "cb-es"),
      englishReveal(line.en, { className: "cb-en" })
    ].filter(Boolean));
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    audioEngine.speak(line.es);
  }

  function userSay(text) {
    log.appendChild(el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-es es-text" }, text)]));
    log.scrollTop = log.scrollHeight;
  }

  function checkRequiredInfo(text) {
    allUserText += " " + text;
    scenario.requiredInfo.forEach((req) => {
      if (satisfied.has(req.key)) return;
      if (req.patterns.some((p) => p.test(allUserText))) satisfied.add(req.key);
    });
  }

  function playNext() {
    if (stepIdx >= script.length) return finish();
    const step = script[stepIdx];
    stepIdx++;
    if (step.kind === "turn") {
      const variant = pick(step.turn.variants);
      setTimeout(() => botSay(step.turn.spk, variant), 350);
    } else {
      setTimeout(() => botSay(step.spk || scenario.speakers[0].id, step.ev), 350);
    }
  }

  function send() {
    if (finished) return;
    if (dictation) return stopMic(true);
    const text = input.value.trim();
    if (!text) return;
    userSay(text);
    checkRequiredInfo(text);
    const notes = correctionBlock(text, { compact: true });
    if (notes) log.appendChild(notes);
    input.value = "";
    blurActive();
    turns++;
    updateSkillScore("speaking", 0.5);
    updateSkillScore("listening", 0.3);
    playNext();
  }

  function finish() {
    finished = true;
    const ratio = scenario.requiredInfo.length ? satisfied.size / scenario.requiredInfo.length : 1;
    const outcomeKey = ratio >= 0.8 ? "success" : ratio >= 0.4 ? "partial" : "fail";
    const outcome = scenario.outcomes[outcomeKey];

    setTimeout(() => botSay(scenario.speakers[0].id, outcome), 350);

    registerStudyToday();
    const wasNew = !(store.state.progress.scenariosCompleted || []).includes(scenario.id);
    store.state.progress.scenarioSessions.push({ date: todayISO(), scenarioId: scenario.id, outcome: outcomeKey, turns });
    if (wasNew) store.state.progress.scenariosCompleted.push(scenario.id);
    const xp = outcomeKey === "success" ? 15 : outcomeKey === "partial" ? 9 : 5;
    addXP(xp, `Scenario: ${scenario.title}`);
    updateSkillScore("speaking", outcomeKey === "success" ? 3 : outcomeKey === "partial" ? 1 : -0.5);
    updateSkillScore("listening", outcomeKey === "success" ? 2 : 0.5);
    store.save();
    if (outcomeKey === "success") confettiBurst();

    controls.innerHTML = "";
    if (embedded) {
      // Daily Life Simulation Mode drives what happens next — just hand the
      // outcome back once the NPC's closing line has had time to play.
      if (onFinish) setTimeout(() => onFinish(outcomeKey), 1400);
      return;
    }
    setTimeout(() => {
      controls.appendChild(
        el("div", { class: "card pop-in", style: "text-align:center" }, [
          el("div", { style: "font-size:2rem" }, outcomeKey === "success" ? "✅" : outcomeKey === "partial" ? "🤔" : "😅"),
          el("h3", {}, outcomeKey === "success" ? "Goal accomplished" : outcomeKey === "partial" ? "Partially got your point across" : "Communication broke down"),
          el("p", { class: "text-muted" }, `You communicated ${satisfied.size}/${scenario.requiredInfo.length} of what this scenario needed.`),
          el("div", { class: "btn-row", style: "justify-content:center;margin-top:.6rem" }, [
            el("a", { class: "btn", href: "#/scenarios" }, "Try another scenario"),
            el("button", { class: "btn btn-primary", onclick: () => navigate(`#/scenarios/${scenario.id}`) }, "Retry this one")
          ])
        ])
      );
    }, 900);
  }

  botSay(scenario.speakers[0].id, pick(scenario.openingLines));

  return () => { if (dictation) { dictation.stop(); dictation = null; } untap(); };
}
