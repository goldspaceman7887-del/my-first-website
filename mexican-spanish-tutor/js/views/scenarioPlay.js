// A single task-scenario session: chat with an NPC who won't let the task
// end until every required detail has actually been handled. No exact-line
// matching — free typed or spoken Spanish, extracted into slots, with the
// NPC's next line chosen from whatever's still unresolved.

import { el, blurActive, toast } from "../core/ui.js";
import { store, todayISO } from "../core/storage.js";
import { audioEngine, speechRecognitionSupported, startDictation, textSimilarity } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { correctionBlock } from "../core/feedback.js";
import { checkSpanish } from "../data/mistakePatterns.js";
import { recordPerformance, isRecentlyStruggling } from "../core/adaptive.js";
import { createSession, submitUserTurn, resolveSession, missingRequiredSlots } from "../core/taskEngine.js";
import { attemptFromSession } from "../core/actflAssess.js";
import { recordScenarioAttempt } from "../core/actflProfile.js";
import { tappable, initTapWords } from "../core/tapword.js";
import { spanishIPA } from "../data/spanishIPA.js";
import { CONFUSION_TRIGGERS } from "./immersion.js";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function showEnglishInline() {
  return (store.state.settings.immersionLevel || 1) <= 2;
}

const CHROME_STRINGS = {
  micTitle: { es: "Responde en voz alta", en: "Answer out loud" },
  micUnsupported: { es: "Necesitas Chrome o Edge para usar el micrófono", en: "Answering out loud needs Chrome or Edge" },
  micAria: { es: "Habla tu respuesta", en: "Speak your answer" }
};

function chrome(key) {
  const s = CHROME_STRINGS[key];
  return showEnglishInline() ? s.en : s.es;
}

const OUTCOME_COPY = {
  success: { icon: "✅", title: "¡Tarea completada!", desc: "Manejaste todo lo necesario — así habría ido en la vida real." },
  incomplete: { icon: "🤷", title: "Quedó incompleto", desc: "Faltó resolver información importante — el pedido/reserva no se pudo confirmar." },
  failed: { icon: "❌", title: "Hubo un malentendido", desc: "Algo se cruzó y no se corrigió a tiempo — así también pasa en la vida real. Inténtalo otra vez." }
};

export function renderScenarioPlay(container, scenario, { onExit, onRetry } = {}) {
  const canSpeak = speechRecognitionSupported();
  const session = createSession(scenario);
  let dictation = null;
  let finished = false;

  container.appendChild(
    el("div", { class: "card", style: "margin-bottom:.75rem" }, [
      el("p", { style: "font-weight:700" }, `${scenario.icon || "🎭"} ${scenario.title} — ${scenario.titleEs}`),
      el("p", { class: "text-muted" }, scenario.setting.es),
      el("p", { class: "text-faint", style: "font-size:.85rem" }, scenario.setting.en),
      el("button", { class: "btn btn-sm", onclick: () => exit() }, "← Elegir otro escenario")
    ])
  );

  const statusBar = el("div", { class: "text-muted", style: "font-size:.85rem;margin-bottom:.4rem" }, "");
  container.appendChild(statusBar);

  const log = el("div", { class: "chat-log" });
  container.appendChild(log);

  const input = el("input", { type: "text", placeholder: "Escribe tu respuesta en español..." });
  input.style.cssText = "flex:1;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1.05rem;";
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });

  const micBtn = el("button", {
    class: "btn btn-icon btn-primary",
    title: canSpeak ? chrome("micTitle") : chrome("micUnsupported"),
    "aria-label": chrome("micAria")
  }, "🎤");
  if (!canSpeak) micBtn.disabled = true;

  const sendBtn = el("button", { class: "btn btn-primary", onclick: () => send() }, "Enviar");
  container.appendChild(el("div", { class: "chat-input-row" }, [micBtn, input, sendBtn]));

  const micStatus = el("div", { class: "text-muted", style: "font-size:.8rem;min-height:1.2em;margin-top:.3rem" }, "");
  container.appendChild(micStatus);

  const finishRow = el("div", { style: "margin-top:.5rem" }, [
    el("button", { class: "btn btn-ghost btn-sm", onclick: () => forceFinish() }, "🏳️ Terminar ahora")
  ]);
  container.appendChild(finishRow);

  micBtn.addEventListener("click", () => {
    if (dictation) return stopMic(true);
    startMic();
  });

  function startMic() {
    micBtn.textContent = "⏹";
    micBtn.classList.remove("btn-primary");
    micBtn.classList.add("btn-danger");
    micStatus.textContent = "Escuchando… habla en español, luego toca ⏹";
    input.value = "";
    dictation = startDictation({
      onInterim: (finalSoFar, interim) => { input.value = (finalSoFar + " " + interim).trim(); },
      onError: (err) => {
        if (err === "not-allowed" || err === "service-not-allowed") {
          micStatus.textContent = "El micrófono está bloqueado. Puedes escribir tu respuesta.";
        } else if (err === "unsupported") {
          micStatus.textContent = "Este navegador no tiene micrófono. Usa Chrome o Edge, o escribe.";
        }
      },
      onStateChange: (s) => { if (s === "denied") stopMic(false); }
    });
    if (!dictation.supported) { dictation = null; resetMicButton(); }
  }

  function stopMic(thenSend) {
    if (!dictation) return;
    const text = dictation.stop();
    dictation = null;
    resetMicButton();
    micStatus.textContent = "";
    if (thenSend) {
      if (!input.value.trim() && text) input.value = text;
      if (input.value.trim()) { lastInputWasSpoken = true; send(); }
      else micStatus.textContent = "No te escuché. Inténtalo otra vez o escribe tu respuesta.";
    }
  }

  function resetMicButton() {
    micBtn.textContent = "🎤";
    micBtn.classList.add("btn-primary");
    micBtn.classList.remove("btn-danger");
  }

  let lastNpcLine = null;
  let lastInputWasSpoken = false;

  function npcBubble(turn) {
    const line = { es: turn.es, en: turn.en };
    lastNpcLine = line;
    const bubble = el("div", { class: "chat-bubble bot" }, [
      turn.isMistakeTrigger ? el("div", { style: "font-size:.75rem" }, "⚠️") : null,
      el("div", { class: "cb-es" }, [tappable(line.es)]),
      showEnglishInline() ? el("div", { class: "cb-en" }, line.en) : null
    ].filter(Boolean));
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    // Some turns (mistakes, follow-ups, combo-asks) can be flagged fast:true
    // — real people don't always slow down for you, and that unpredictability
    // is deliberate, so it wins even when the learner's been struggling.
    // Absent that, auto-slow the default pace on top of the manual "?"
    // escape hatch below when recent turns show they're struggling.
    if (turn.fast) audioEngine.speak(line.es, { rate: 1.2 });
    else if (isRecentlyStruggling()) audioEngine.speakSlow(line.es);
    else audioEngine.speak(line.es);
  }

  function userBubble(text) {
    log.appendChild(el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-es" }, [tappable(text)])]));
    log.scrollTop = log.scrollHeight;
  }

  // Not a pronunciation score — there's no acoustic analysis available
  // client-side without a paid API, which this app deliberately doesn't use.
  // This is a rough transcript-mismatch flag: did what the recognizer heard
  // diverge a lot from the slot value it just filled? If so, show the
  // target's IPA as a "here's roughly what to aim for" hint, honestly
  // labeled as a sanity check rather than a grade.
  function pronunciationGuidance(rawText, slotsBefore) {
    const ids = Object.keys(session.slots);
    const newlyFilledId = [...ids].reverse().find((id) => slotsBefore[id] === undefined);
    if (!newlyFilledId) return null;
    const slotDef = session.scenario.slots.find((s) => s.id === newlyFilledId);
    if (!slotDef || slotDef.type !== "enum") return null;
    const canonical = session.slots[newlyFilledId];
    if (typeof canonical !== "string") return null;
    const sim = textSimilarity(rawText, canonical);
    if (sim >= 70) return null;
    return { canonical, ipa: spanishIPA(canonical) };
  }

  function updateStatus() {
    if (finished) return;
    const missing = missingRequiredSlots(session);
    const names = missing.map((m) => (showEnglishInline() ? m.label : m.labelEs));
    statusBar.textContent = missing.length
      ? `Todavía falta: ${names.join(", ")}`
      : "Ya tienes todo lo necesario — sigue la conversación hasta que termine.";
  }

  function briefCorrection(text) {
    const block = correctionBlock(text, { compact: true });
    if (!block) return;
    log.appendChild(block);
    log.scrollTop = log.scrollHeight;
    updateSkillScore("writing", -0.3);
  }

  function send() {
    if (dictation) return stopMic(true);
    if (finished) return;
    const text = input.value.trim();
    if (!text) return;
    const wasSpoken = lastInputWasSpoken;
    lastInputWasSpoken = false;
    userBubble(text);
    input.value = "";
    blurActive();

    // Stuck: replay the last NPC line slowly with a translation instead of
    // treating "?" / "no entiendo" as an actual answer to whatever was
    // asked — same negotiate-meaning pattern as Immersion Mode. The
    // question still stands, so this doesn't consume a turn.
    if (CONFUSION_TRIGGERS.test(text) && lastNpcLine) {
      recordPerformance("scenario", "struggled", 1);
      log.appendChild(
        el("div", { class: "chat-bubble bot" }, [
          el("span", { class: "badge badge-gold" }, "Más despacio + traducción"),
          el("div", { class: "cb-es", style: "margin-top:.3rem" }, [tappable(lastNpcLine.es)]),
          el("div", { class: "cb-en" }, lastNpcLine.en)
        ])
      );
      log.scrollTop = log.scrollHeight;
      audioEngine.speakSlow(lastNpcLine.es);
      return;
    }

    briefCorrection(text);
    updateSkillScore("speaking", 0.5);
    const hits = checkSpanish(text);
    const words = text.split(/\s+/).filter(Boolean).length;
    const density = words ? hits.length / words : 0;
    recordPerformance("scenario", hits.length === 0 ? "good" : density >= 0.4 ? "struggled" : "neutral", density);

    const slotsBefore = { ...session.slots };
    const turn = submitUserTurn(session, text);

    if (wasSpoken) {
      const guidance = pronunciationGuidance(text, slotsBefore);
      if (guidance) {
        log.appendChild(
          el("div", { class: "text-faint", style: "font-size:.78rem;margin:.2rem 0" },
            `🎙️ Rough transcript check (not a pronunciation score): heard "${text}" — expected something close to "${guidance.canonical}" /${guidance.ipa}/. Speech recognition isn't perfect either, so take this as a sanity check, not a grade.`)
        );
      }
    }

    const shouldResolve = turn.kind === "close" || (scenario.failureStates || []).some((f) => f.when(session));

    // Whatever the NPC just said — including the mistake announcement itself,
    // if THIS is the turn that tips the session into failure — must be shown
    // before the debrief. Jumping straight to a verdict with no explanation
    // is confusing, not "realistic failure."
    setTimeout(() => {
      if (turn.kind !== "close") { npcBubble(turn); updateStatus(); }
      if (shouldResolve) setTimeout(() => finish(), turn.kind === "close" ? 0 : 700);
    }, 350);
  }

  function forceFinish() {
    if (finished || !session.turns) return;
    finish();
  }

  function finish() {
    if (finished) return;
    finished = true;
    resolveSession(session);
    statusBar.textContent = "";
    micBtn.disabled = true;
    sendBtn.disabled = true;
    input.disabled = true;
    finishRow.innerHTML = "";

    const attempt = attemptFromSession(session, todayISO());
    recordScenarioAttempt(attempt);
    registerStudyToday();

    const xp = attempt.outcome === "success" ? Math.round(20 + attempt.overallScore / 4)
      : attempt.outcome === "incomplete" ? 6 : 4;
    addXP(xp, `Scenario: ${scenario.title}`);
    updateSkillScore("speaking", attempt.outcome === "success" ? 3 : attempt.outcome === "incomplete" ? 0.5 : 0);
    store.save();

    const copy = OUTCOME_COPY[attempt.outcome] || OUTCOME_COPY.incomplete;
    container.appendChild(
      el("div", { class: "card empty-state pop-in" }, [
        el("div", { class: "empty-icon" }, copy.icon),
        el("h3", {}, copy.title),
        el("p", {}, copy.desc),
        el("p", { class: "text-muted" }, `+${xp} XP · puntaje ${attempt.overallScore}/100 · ${attempt.requiredSlotsFilled}/${attempt.requiredSlotsTotal} detalles resueltos`),
        el("div", { class: "flex", style: "gap:.5rem;margin-top:.5rem" }, [
          el("button", { class: "btn btn-primary", onclick: () => retry() }, "Intentar de nuevo"),
          el("button", { class: "btn", onclick: () => exit() }, "Elegir otro escenario")
        ])
      ])
    );
  }

  function retry() {
    if (dictation) { dictation.stop(); dictation = null; }
    if (typeof onRetry === "function") onRetry();
    else exit();
  }

  function exit() {
    if (dictation) { dictation.stop(); dictation = null; }
    if (typeof onExit === "function") onExit();
  }

  // ---------- kick off ----------
  const stopTapWords = initTapWords();
  const opening = pick(scenario.openings);
  npcBubble({ es: opening.es, en: opening.en });
  updateStatus();

  return () => {
    if (dictation) { dictation.stop(); dictation = null; }
    stopTapWords();
  };
}
