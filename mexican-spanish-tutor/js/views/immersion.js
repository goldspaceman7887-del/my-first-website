// IMMERSION MODE — Mexican Spanish only, start to finish.
//
// This used to hold ten canned replies and return the first one whose keyword
// matched, so the same input produced the same question forever and every
// session opened identically. It now runs the same threaded engine as the
// conversation partner: nine topics of level-tiered follow-ups that dig deeper
// into whatever you're actually talking about, and it never repeats a question
// — not within a session, and not in the next one either, because what it has
// already asked is remembered between visits.
//
// What makes it Immersion rather than Conversation: no English on screen
// unless you ask for it, and typing "?" or "no entiendo" replays the last line
// slowly with a translation before handing the same question back to you.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive, toast } from "../core/ui.js";
import { audioEngine, speechRecognitionSupported, startDictation } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { checkSpanish } from "../data/mistakePatterns.js";
import { recordPerformance, isRecentlyStruggling } from "../core/adaptive.js";
import { pick, learnerTier, remember, reaction, detectThread, createProbeSession } from "../core/conversationEngine.js";
import { CONFUSION_TRIGGERS, THREADS, PIVOTS } from "../data/conversationThreads.js";

export { CONFUSION_TRIGGERS };

// Openers vary so two sessions in a row don't start the same way.
const OPENERS = [
  { es: "¡Hola! Soy tu amigo mexicano de práctica. ¿Cómo te llamas?", en: "Hi! I'm your Mexican practice friend. What's your name?" },
  { es: "¡Qué onda! ¿Cómo va tu día?", en: "Hey! How's your day going?" },
  { es: "¡Buenas! Cuéntame algo de ti.", en: "Hey there! Tell me something about yourself." },
  { es: "¡Órale, llegaste! ¿Qué has hecho hoy?", en: "Hey, you made it! What have you been up to today?" },
  { es: "¡Hola otra vez! ¿De qué quieres platicar?", en: "Hi again! What do you want to talk about?" },
  { es: "¿Qué tal? ¿Todo bien por allá?", en: "How's it going? All good over there?" }
];

const probes = createProbeSession("immersionAsked");

export function renderImmersion(container) {
  const canSpeak = speechRecognitionSupported();
  let thread = null;
  let turns = 0;
  let sinceCallback = 0;
  let greetedName = false;
  let lastBotLine = null;
  let dictation = null;
  const memory = {};

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🌊 Immersion Mode"),
      el("p", {}, "Spanish only, start to finish. Stuck? Type \"?\" or \"no entiendo\" and you'll get the last line again — slower, with a translation — then it's straight back to Spanish.")
    ])
  );

  // Practice strips a sub-view's .page-header, so the key instruction repeats.
  container.appendChild(
    el("p", { class: "text-muted", style: "font-size:.85rem;margin:.2rem 0 .6rem" },
      canSpeak
        ? "Todo en español. Escribe \"?\" si te pierdes. Toca 🎤 para hablar."
        : "Todo en español. Escribe \"?\" si te pierdes.")
  );

  const log = el("div", { class: "chat-log" });
  container.appendChild(log);

  const input = el("input", { type: "text", placeholder: "Responde en español... (o escribe \"?\")" });
  input.style.cssText = "flex:1;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1.05rem;font-family:var(--font-es);";
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });

  const micBtn = el("button", {
    class: "btn btn-icon btn-primary",
    title: canSpeak ? "Habla en español" : "Speaking needs Chrome or Edge",
    "aria-label": "Speak your answer"
  }, "🎤");
  if (!canSpeak) micBtn.disabled = true;
  micBtn.addEventListener("click", () => (dictation ? stopMic(true) : startMic()));

  const sendBtn = el("button", { class: "btn btn-primary", onclick: () => send() }, "Enviar");
  container.appendChild(el("div", { class: "chat-input-row" }, [micBtn, input, sendBtn]));
  const micStatus = el("div", { class: "text-muted", style: "font-size:.8rem;min-height:1.2em;margin-top:.3rem" }, "");
  container.appendChild(micStatus);

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

  // ---------- rendering ----------
  function botSay(line) {
    lastBotLine = line;
    const bubble = el("div", { class: "chat-bubble bot" }, [el("div", { class: "cb-es es-text" }, line.es)]);
    const hint = el("div", { class: "cb-en hidden" }, line.en);
    bubble.appendChild(hint);
    bubble.appendChild(
      el("div", { class: "flex", style: "gap:.35rem;margin-top:.3rem" }, [
        el("button", { class: "btn btn-sm", onclick: () => hint.classList.toggle("hidden") }, "💡 Hint"),
        el("button", { class: "btn btn-sm", onclick: () => audioEngine.speak(line.es) }, "🔊")
      ])
    );
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    // On top of the manual "?" escape hatch below, auto-slow the default
    // pace when the learner's recent turns show they're struggling.
    if (isRecentlyStruggling()) audioEngine.speakSlow(line.es);
    else audioEngine.speak(line.es);
  }

  function userSay(text) {
    log.appendChild(el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-es es-text" }, text)]));
    log.scrollTop = log.scrollHeight;
  }

  // ---------- conversation logic ----------
  function respond(text) {
    const react = reaction(text);
    const tier = learnerTier();
    sinceCallback++;

    if (memory.nombre && !greetedName) {
      greetedName = true;
      const p = probes.nextProbe(thread, tier) || thread.open;
      return { es: `¡Mucho gusto, ${memory.nombre}! ${p.es}`, en: `Nice to meet you, ${memory.nombre}! ${p.en}` };
    }

    if (sinceCallback >= 3) {
      const cb = probes.callback(memory);
      if (cb) {
        sinceCallback = 0;
        return { es: `${react.es} ${cb.es}`, en: `${react.en} ${cb.en}` };
      }
    }

    const steered = detectThread(text, thread);
    if (steered) {
      thread = steered;
      const p = probes.nextProbe(thread, tier) || steered.open;
      return { es: `${react.es} ${p.es}`, en: `${react.en} ${p.en}` };
    }

    const probe = probes.nextProbe(thread, tier);
    if (probe) return { es: `${react.es} ${probe.es}`, en: `${react.en} ${probe.en}` };

    // This thread is used up — move to one that still has something to ask.
    const fresh = probes.freshThreads(thread && thread.id, tier);
    if (fresh.length) {
      thread = pick(fresh);
      const pivot = pick(PIVOTS);
      const p = probes.nextProbe(thread, tier) || thread.open;
      return { es: `${pivot.es} ${p.es}`, en: `${pivot.en} ${p.en}` };
    }
    return { es: `${react.es} ${thread.open.es}`, en: `${react.en} ${thread.open.en}` };
  }

  function send() {
    if (dictation) return stopMic(true);
    const text = input.value.trim();
    if (!text) return;
    userSay(text);
    input.value = "";
    blurActive();
    turns++;

    // Stuck: replay the last line slowly with a translation. The question still
    // stands, so no new one is stacked on top of it.
    if (CONFUSION_TRIGGERS.test(text)) {
      recordPerformance("immersion", "struggled", 1);
      if (lastBotLine) {
        log.appendChild(
          el("div", { class: "chat-bubble bot" }, [
            el("span", { class: "badge badge-gold" }, "Más despacio + traducción"),
            el("div", { class: "cb-es es-text", style: "margin-top:.3rem" }, lastBotLine.es),
            el("div", { class: "cb-en" }, lastBotLine.en)
          ])
        );
        log.scrollTop = log.scrollHeight;
        audioEngine.speakSlow(lastBotLine.es);
      }
      return;
    }

    remember(memory, text);
    updateSkillScore("speaking", 0.5);
    const hits = checkSpanish(text);
    const words = text.split(/\s+/).filter(Boolean).length;
    const density = words ? hits.length / words : 0;
    recordPerformance("immersion", hits.length === 0 ? "good" : density >= 0.4 ? "struggled" : "neutral", density);
    const reply = respond(text);
    setTimeout(() => botSay(reply), 350);

    if (turns >= 6 && turns % 6 === 0) {
      registerStudyToday();
      store.state.progress.immersionSessions.push({ date: todayISO(), turns });
      addXP(10, "Immersion");
      store.save();
      toast("¡Vas muy bien! +10 XP", { icon: "🌊" });
    }
  }

  thread = pick(THREADS);
  botSay(pick(OPENERS));

  // Leaving the page with the mic live would keep it recording.
  return () => { if (dictation) { dictation.stop(); dictation = null; } };
}
