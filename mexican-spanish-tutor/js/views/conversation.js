// CONVERSATION MODE — act as a Mexican conversation partner. Speaks mostly
// Spanish, adjusts difficulty to the Immersion setting, corrects naturally
// (briefly, never a lecture), keeps the conversation flowing with
// follow-up questions, and stays in character.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { checkText } from "../data/mistakePatterns.js";

const TOPICS = [
  { match: /trabajo|oficina|jefe/i, replies: [
    { es: "Qué bueno. ¿Y qué es lo que más te gusta de tu trabajo?", en: "Nice. And what do you like most about your job?" },
    { es: "Se oye pesado. ¿Cuántas horas trabajas al día?", en: "Sounds tough. How many hours do you work a day?" }
  ] },
  { match: /familia|papá|mamá|hermano/i, replies: [
    { es: "Qué padre. ¿Se ven seguido?", en: "That's nice. Do you all see each other often?" },
    { es: "La familia es todo. ¿A quién te pareces más?", en: "Family is everything. Who do you take after most?" }
  ] },
  { match: /comida|tacos|antojo|hambre/i, replies: [
    { es: "¡Ay, ahora se me antojó a mí también! ¿Cuál es tu platillo favorito?", en: "Oh, now I'm craving it too! What's your favorite dish?" },
    { es: "Se oye delicioso. ¿Sabes cocinarlo tú mismo?", en: "Sounds delicious. Do you know how to cook it yourself?" }
  ] },
  { match: /viaje|vacaciones|playa|viajar/i, replies: [
    { es: "Qué envidia. ¿A dónde te gustaría ir la próxima vez?", en: "I'm jealous. Where would you like to go next time?" },
    { es: "Suena increíble. ¿Qué fue lo que más te gustó?", en: "Sounds amazing. What did you like most?" }
  ] },
  { match: /triste|difícil|problema|preocup/i, replies: [
    { es: "Lo siento mucho. ¿Ya se solucionó, o sigues con eso?", en: "I'm really sorry. Has it worked out, or are you still dealing with it?" },
    { es: "Qué difícil. ¿Hay algo que te ayude a sentirte mejor?", en: "That's tough. Is there anything that helps you feel better?" }
  ] },
  { match: /opinión|pienso|creo que|me parece/i, replies: [
    { es: "Interesante punto de vista. ¿Por qué piensas así?", en: "Interesting point of view. Why do you think that?" },
    { es: "No lo había pensado así. ¿Siempre has opinado igual?", en: "I hadn't thought of it that way. Have you always thought that?" }
  ] }
];

const FALLBACKS = [
  { es: "Cuéntame más, se oye interesante.", en: "Tell me more, that sounds interesting." },
  { es: "¿Y luego qué pasó?", en: "And then what happened?" },
  { es: "Órale, ¿en serio? ¿Cómo te sentiste?", en: "Whoa, really? How did that make you feel?" },
  { es: "¿Y tú qué opinas de eso?", en: "And what do you think about that?" }
];

const STARTER = { es: "¡Qué onda! Soy tu compañero de conversación. ¿Cómo te ha ido hoy?", en: "Hey! I'm your conversation partner. How's your day been?" };

function pickReply(text) {
  for (const t of TOPICS) {
    if (t.match.test(text)) return t.replies[Math.floor(Math.random() * t.replies.length)];
  }
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

export function renderConversation(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🤖 Conversation Mode"),
      el("p", {}, "A Mexican conversation partner: mostly Spanish, gentle in-line corrections (never a lecture), and always a follow-up question to keep things flowing. Adjust the immersion dial in the top bar for more/less English support.")
    ])
  );

  const log = el("div", { class: "chat-log" });
  container.appendChild(log);

  const input = el("input", { type: "text", placeholder: "Escribe tu respuesta..." });
  input.style.cssText = "flex:1;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1.05rem;";
  const sendBtn = el("button", { class: "btn btn-primary", onclick: send }, "Enviar");
  container.appendChild(el("div", { class: "chat-input-row" }, [input, sendBtn]));
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });

  let turns = 0;
  botSay(STARTER);

  function immersionLevel() {
    return store.state.settings.immersionLevel || 1;
  }

  function botSay(line) {
    const showEnglishInline = immersionLevel() <= 2;
    const bubble = el("div", { class: "chat-bubble bot" }, [
      el("div", { class: "cb-es es-text" }, line.es),
      showEnglishInline ? el("div", { class: "cb-en" }, line.en) : null
    ].filter(Boolean));
    if (!showEnglishInline) {
      const hint = el("div", { class: "cb-en hidden" }, line.en);
      const hintBtn = el("button", { class: "btn btn-sm", style: "margin-top:.3rem", onclick: () => hint.classList.toggle("hidden") }, "💡 Hint");
      bubble.appendChild(hint);
      bubble.appendChild(hintBtn);
    }
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    audioEngine.speak(line.es);
  }

  function userSay(text) {
    log.appendChild(el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-es es-text" }, text)]));
    log.scrollTop = log.scrollHeight;
  }

  function briefCorrection(text) {
    const hits = checkText(text);
    if (!hits.length) return;
    const h = hits[0];
    log.appendChild(
      el("div", { class: "correction-block" }, [
        el("div", { class: "co-natural" }, `Más natural: ${h.natural}`),
        el("div", { class: "co-explain" }, h.mistakeExplained)
      ])
    );
    updateSkillScore("writing", -0.3);
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

    const reply = pickReply(text);
    setTimeout(() => botSay(reply), 350);

    if (turns >= 6 && turns % 6 === 0) {
      registerStudyToday();
      store.state.progress.conversationSessions.push({ date: todayISO(), turns });
      addXP(10, "Conversation Mode session");
      store.save();
    }
  }
}
