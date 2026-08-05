// IMMERSION MODE — Spanish only, start to finish.
//
// Runs the same threaded engine as the Conversation partner: nine topics of
// level-tiered follow-ups that dig deeper into whatever you're actually
// talking about, plus reactions, topic steering, and callbacks to details
// you mentioned earlier. It never repeats a question — not within a
// session, and not in the next one either, because what it has already
// asked is remembered in storage between visits.
//
// What makes it Immersion rather than Conversation: how much English shows
// on screen is controlled by settings.immersionLevel (1-4):
//   1 = bilingual — English shown right under every line
//   2 = light scaffolding — English shown, a little less prominent
//   3 = Spanish first — English only behind a "Pista" (hint) button
//   4 = Spanish only — no translation shown at all
// At any level, typing "?" or "no entiendo" replays the last line slowly
// with its translation, then hands the same question straight back to you —
// so getting unstuck never breaks the immersion for the rest of the chat.

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

const CONFUSION_TRIGGERS = /(^\?+$|no entiendo|no comprendo|no s[ée] qu[ée] decir|qu[ée] significa|help|ingl[ée]s|otra vez|m[áa]s despacio)/i;

// Openers vary so two sessions in a row don't start the same way.
const OPENERS = [
  { es: "¡Hola! Soy tu amigo/a español/a de práctica. ¿Cómo te llamas?", en: "Hi! I'm your Spanish practice friend. What's your name?" },
  { es: "¡Buenas! ¿Cómo va tu día?", en: "Hey! How's your day going?" },
  { es: "¡Hola! Cuéntame algo de ti.", en: "Hi there! Tell me something about yourself." },
  { es: "¡Vaya, ya estás aquí! ¿Qué has hecho hoy?", en: "There you are! What have you been up to today?" },
  { es: "¡Hola otra vez! ¿De qué te apetece hablar?", en: "Hi again! What do you feel like talking about?" },
  { es: "¿Qué tal? ¿Todo bien por ahí?", en: "How's it going? All good over there?" }
];

export function renderImmersion(container) {
  const canSpeak = speechRecognitionSupported();
  let topic = null;
  let turns = 0;
  let sinceCallback = 0;
  let greetedName = false;
  let lastBotLine = null;
  const memory = {};

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🌊 Modo inmersión · Immersion"),
      el("p", {}, "Todo en español, de principio a fin. ¿Te pierdes? Escribe \"?\" o \"no entiendo\" y verás la última frase otra vez, más despacio y con traducción — luego seguimos en español.")
    ])
  );
  container.appendChild(
    el(
      "p",
      { class: "text-muted", style: "font-size:.85rem;margin:.2rem 0 .6rem" },
      canSpeak ? "Todo en español. Escribe \"?\" si te pierdes. Toca 🎤 para hablar." : "Todo en español. Escribe \"?\" si te pierdes."
    )
  );

  const log = el("div", { class: "chat-log" });
  container.appendChild(log);

  const input = el("input", { type: "text", placeholder: "Responde en español... (o escribe \"?\")" });
  input.style.cssText = "flex:1;min-width:0";
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });

  const micBtn = canSpeak
    ? el(
        "button",
        {
          class: "btn btn-icon btn-primary",
          title: "Habla en español",
          "aria-label": "Hablar tu respuesta",
          onclick: async () => {
            micBtn.disabled = true;
            micStatus.textContent = "Escuchando…";
            const r = await listenOnce();
            micBtn.disabled = false;
            micStatus.textContent = "";
            if (r.supported && r.transcript) input.value = r.transcript;
          }
        },
        "🎤"
      )
    : null;

  const sendBtn = el("button", { class: "btn btn-primary", onclick: () => send() }, "Enviar");
  container.appendChild(el("div", { class: "chat-input-row" }, [micBtn, input, sendBtn].filter(Boolean)));
  const micStatus = el("div", { class: "text-muted", style: "font-size:.8rem;min-height:1.2em;margin-top:.3rem" }, "");
  container.appendChild(micStatus);

  // ---------- settings ----------
  function immersionLevel() {
    return store.state.settings.immersionLevel || 1;
  }
  function tier() {
    return tierForLevel(store.state.profile.level);
  }

  // ---------- rendering ----------
  function botSay(line) {
    lastBotLine = line;
    const lvl = immersionLevel();
    const bubble = el("div", { class: "chat-bubble bot" }, [el("div", { class: "cb-es es-text" }, line.es)]);
    if (lvl <= 2) {
      bubble.appendChild(el("div", { class: "cb-en" }, line.en));
    } else if (lvl === 3) {
      const hint = el("div", { class: "cb-en hidden" }, line.en);
      bubble.appendChild(hint);
      bubble.appendChild(el("button", { class: "btn btn-sm", style: "margin-top:.3rem", onclick: () => hint.classList.toggle("hidden") }, "💡 Pista"));
    }
    // lvl 4: Spanish only, no hint at all — that's the point of Immersion.
    bubble.appendChild(el("button", { class: "btn btn-sm", style: "margin-top:.3rem", onclick: () => audioEngine.speak(line.es) }, "🔊"));
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    audioEngine.speak(line.es);
  }

  function userSay(text) {
    log.appendChild(el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-es es-text" }, text)]));
    log.scrollTop = log.scrollHeight;
  }

  // Even in Immersion, a wrong form is worth flagging — but at the highest
  // immersion level the point is staying in Spanish, so the English-heavy
  // correction card stands down there.
  function briefCorrection(text) {
    if (immersionLevel() >= 4) return;
    const node = inlineCorrection(text);
    if (!node) return;
    log.appendChild(node);
    log.scrollTop = log.scrollHeight;
    updateSkillScore("grammar", -0.3);
  }

  // ---------- persistence: questions already asked, never repeated ----------
  function askedIds() {
    store.state.progress.immersionAsked = store.state.progress.immersionAsked || [];
    return store.state.progress.immersionAsked;
  }
  function markAsked(key) {
    if (!key) return;
    const asked = askedIds();
    if (!asked.includes(key)) asked.push(key);
    store.save();
  }
  function combine(a, b) {
    return { es: `${a.es} ${b.es}`, en: `${a.en} ${b.en}` };
  }

  function nextBotLine(text) {
    const react = reactionFor(text);
    sinceCallback++;
    Object.assign(memory, extractMemory(text));
    const asked = askedIds();
    const lvl = tier();

    if (memory.nombre && !greetedName) {
      greetedName = true;
      const q = pickNextQuestion(topic.id, asked, lvl);
      markAsked(q && q.key);
      const line = q || topic.open;
      return { es: `¡Encantado/a, ${memory.nombre}! ${line.es}`, en: `Nice to meet you, ${memory.nombre}! ${line.en}` };
    }

    if (sinceCallback >= 3) {
      const cb = pickCallback(memory, asked);
      if (cb) {
        sinceCallback = 0;
        markAsked(cb.key);
        return combine(react, cb);
      }
    }

    const steered = detectTopic(text, topic && topic.id);
    if (steered) {
      topic = steered;
      const q = pickNextQuestion(steered.id, asked, lvl);
      markAsked(q && q.key);
      return combine(react, q || steered.open);
    }

    const probe = pickNextQuestion(topic.id, asked, lvl);
    if (probe) {
      markAsked(probe.key);
      return combine(react, probe);
    }

    const candidates = CONVERSATION_TOPICS.filter(
      (t) => t.id !== (topic && topic.id) && t.followups.some((f) => f.tier <= lvl && !asked.includes(`${t.id}:${f.es}`))
    );
    if (candidates.length) {
      topic = pick(candidates);
      const pivot = pickPivot();
      const q = pickNextQuestion(topic.id, asked, lvl);
      markAsked(q && q.key);
      return combine(pivot, q || topic.open);
    }

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
    input.value = "";
    blurActive();
    turns++;

    // Stuck: replay the last line slowly with a translation. The question
    // still stands, so no new one gets stacked on top of it.
    if (CONFUSION_TRIGGERS.test(text)) {
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

    briefCorrection(text);
    updateSkillScore("speaking", 0.5);
    const reply = nextBotLine(text);
    setTimeout(() => botSay(reply), 350);

    if (turns >= 6 && turns % 6 === 0) {
      registerStudyToday();
      store.state.progress.immersionSessions = store.state.progress.immersionSessions || [];
      store.state.progress.immersionSessions.push({ date: todayISO(), turns });
      addXP(10, "Immersion");
      store.save();
      toast("¡Vas muy bien! +10 XP", { icon: "🌊" });
    }
  }

  topic = pick(CONVERSATION_TOPICS);
  botSay(pick(OPENERS));

  return () => audioEngine.stop();
}
