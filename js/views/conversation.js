// CONVERSATION — a free-topic Spanish conversation partner you answer by
// typing (or speaking, where the browser supports it).
//
// Honest about what it is: this runs entirely in your browser, with no
// server and no API key, so it's a rule-based partner rather than a large
// language model. What it CAN do is hold a thread — react to what you said,
// follow up on the same subject instead of jumping around, remember a few
// concrete details and bring them back later, and scale its questions to
// your level. That's the thing you actually need practice at: keeping a
// conversation going.
//
// Questions already asked are remembered in storage (per topic), so
// reopening this page — today or next week — never repeats a question a
// previous session already asked, until the whole pool has been used.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive, toast } from "../core/ui.js";
import { audioEngine, speechRecognitionSupported, listenOnce } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { inlineCorrection } from "../core/feedback.js";
import {
  CONVERSATION_TOPICS,
  pick,
  tierForLevel,
  detectTopic,
  reactionFor,
  extractMemory,
  pickNextQuestion,
  anyQuestionsRemain,
  pickCallback,
  pickPivot
} from "../data/conversationThreads.js";

export function renderConversation(container) {
  const canSpeak = speechRecognitionSupported();

  // ---------- conversation state ----------
  let topic = null;
  let turns = 0;
  let sinceCallback = 0;
  let greetedName = false;
  const memory = {};

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "💬 Conversación"),
      el(
        "p",
        {},
        canSpeak
          ? "Habla con un compañero/a de conversación español. Toca el micrófono y responde en voz alta, o escribe — lo que prefieras. Sigue lo que realmente dices en vez de cambiar de tema sin sentido."
          : "Habla con un compañero/a de conversación español escribiendo. Sigue lo que realmente dices en vez de cambiar de tema sin sentido. (Hablar en voz alta necesita Chrome o Edge.)"
      )
    ])
  );
  container.appendChild(
    el(
      "p",
      { class: "text-muted", style: "font-size:.85rem;margin:.2rem 0 .6rem" },
      canSpeak ? "Toca 🎤 para responder en voz alta, o simplemente escribe. Elige un tema, o deja que el compañero elija." : "Escribe tu respuesta abajo. Elige un tema, o deja que el compañero elija."
    )
  );

  // ---------- topic picker ----------
  const picker = el("div", { class: "search-row" });
  container.appendChild(picker);
  picker.appendChild(el("button", { class: "chip-filter", onclick: () => startTopic(pick(CONVERSATION_TOPICS), true) }, "🎲 Sorpréndeme"));
  CONVERSATION_TOPICS.forEach((t) => {
    picker.appendChild(el("button", { class: "chip-filter", "data-topic": t.id, onclick: () => startTopic(t, true) }, `${t.icon} ${t.label}`));
  });

  const log = el("div", { class: "chat-log" });
  container.appendChild(log);

  // ---------- input row ----------
  const input = el("input", { type: "text", placeholder: "Escribe tu respuesta..." });
  input.style.cssText = "flex:1;min-width:0";
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });

  const micBtn = canSpeak
    ? el(
        "button",
        {
          class: "btn btn-icon btn-primary",
          title: "Responder en voz alta",
          "aria-label": "Hablar tu respuesta",
          onclick: async () => {
            micBtn.disabled = true;
            micStatus.textContent = "Escuchando…";
            const r = await listenOnce();
            micBtn.disabled = false;
            micStatus.textContent = "";
            if (r.supported && r.transcript) input.value = r.transcript;
            else if (r.supported === false) micStatus.textContent = "El micrófono no está disponible en este navegador.";
          }
        },
        "🎤"
      )
    : null;

  const sendBtn = el("button", { class: "btn btn-primary", onclick: () => send() }, "Enviar");
  container.appendChild(el("div", { class: "chat-input-row" }, [micBtn, input, sendBtn].filter(Boolean)));
  const micStatus = el("div", { class: "text-muted", style: "font-size:.8rem;min-height:1.2em;margin-top:.3rem" }, "");
  container.appendChild(micStatus);

  // ---------- rendering ----------
  function botSay(line) {
    const bubble = el("div", { class: "chat-bubble bot" }, [el("div", { class: "cb-es es-text" }, line.es), el("div", { class: "cb-en" }, line.en)]);
    bubble.appendChild(el("button", { class: "btn btn-sm", style: "margin-top:.3rem", onclick: () => audioEngine.speak(line.es) }, "🔊 Otra vez"));
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    audioEngine.speak(line.es);
  }

  function userSay(text) {
    log.appendChild(el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-es es-text" }, text)]));
    log.scrollTop = log.scrollHeight;
  }

  function briefCorrection(text) {
    const node = inlineCorrection(text);
    if (!node) return;
    log.appendChild(node);
    log.scrollTop = log.scrollHeight;
    updateSkillScore("grammar", -0.3);
  }

  // ---------- persistence: questions already asked, never repeated ----------
  function askedIds() {
    store.state.progress.conversationAsked = store.state.progress.conversationAsked || [];
    return store.state.progress.conversationAsked;
  }
  function markAsked(key) {
    if (!key) return;
    const asked = askedIds();
    if (!asked.includes(key)) asked.push(key);
    store.save();
  }
  function tier() {
    return tierForLevel(store.state.profile.level);
  }

  function combine(a, b) {
    return { es: `${a.es} ${b.es}`, en: `${a.en} ${b.en}` };
  }

  // ---------- topic logic ----------
  function startTopic(t, announce) {
    topic = t;
    picker.querySelectorAll("[data-topic]").forEach((c) => c.classList.toggle("active", c.getAttribute("data-topic") === t.id));
    if (announce) botSay(t.open);
  }

  function nextBotLine(text) {
    const react = reactionFor(text);
    sinceCallback++;
    Object.assign(memory, extractMemory(text));
    const asked = askedIds();
    const lvl = tier();

    // Someone who tells you their name expects you to use it.
    if (memory.nombre && !greetedName) {
      greetedName = true;
      const q = pickNextQuestion(topic.id, asked, lvl);
      markAsked(q && q.key);
      const line = q || topic.open;
      return { es: `¡Encantado/a, ${memory.nombre}! ${line.es}`, en: `Nice to meet you, ${memory.nombre}! ${line.en}` };
    }

    // Every few turns, bring back something they told us earlier — the
    // single biggest thing that stops this feeling like a questionnaire.
    if (sinceCallback >= 3) {
      const cb = pickCallback(memory, asked);
      if (cb) {
        sinceCallback = 0;
        markAsked(cb.key);
        return combine(react, cb);
      }
    }

    // The learner steered the topic themselves — follow, don't fight it.
    const steered = detectTopic(text, topic && topic.id);
    if (steered) {
      startTopic(steered, false);
      const q = pickNextQuestion(steered.id, asked, lvl);
      markAsked(q && q.key);
      return combine(react, q || steered.open);
    }

    const probe = pickNextQuestion(topic.id, asked, lvl);
    if (probe) {
      markAsked(probe.key);
      return combine(react, probe);
    }

    // This topic is spent at this level — pivot to one that still has
    // something fresh to ask, rather than repeating ourselves.
    const candidates = CONVERSATION_TOPICS.filter(
      (t) => t.id !== (topic && topic.id) && t.followups.some((f) => f.tier <= lvl && !asked.includes(`${t.id}:${f.es}`))
    );
    if (candidates.length) {
      const next = pick(candidates);
      startTopic(next, false);
      const pivot = pickPivot();
      const q = pickNextQuestion(next.id, asked, lvl);
      markAsked(q && q.key);
      return combine(pivot, q || next.open);
    }

    // Been all the way around — start the pool over rather than dead-ending.
    if (!anyQuestionsRemain(asked, lvl)) {
      asked.length = 0;
      store.save();
    }
    return combine(react, topic.open);
  }

  function send() {
    const text = input.value.trim();
    if (!text) return;
    userSay(text);
    briefCorrection(text);
    input.value = "";
    blurActive();
    turns++;
    updateSkillScore("speaking", 0.5);

    const reply = nextBotLine(text);
    setTimeout(() => botSay(reply), 350);

    if (turns >= 6 && turns % 6 === 0) {
      registerStudyToday();
      store.state.progress.conversationSessions = store.state.progress.conversationSessions || [];
      store.state.progress.conversationSessions.push({ date: todayISO(), turns });
      addXP(10, "Conversación");
      store.save();
      toast("¡Vas bien! +10 XP", { icon: "💬" });
    }
  }

  startTopic(CONVERSATION_TOPICS[0], false);
  botSay({
    es: "¡Hola! Soy tu compañero/a de conversación. Podemos hablar de lo que quieras — elige un tema arriba o simplemente contéstame. ¿Qué tal tu día?",
    en: "Hi! I'm your conversation partner. We can talk about whatever you like — pick a topic above or just answer me. How's your day going?"
  });

  return () => audioEngine.stop();
}
