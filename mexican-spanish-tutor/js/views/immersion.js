// IMMERSION MODE — Mexican Spanish only. If you seem confused (you type
// "?", "no entiendo", or ask for help/English), the bot gives a simpler
// line + an English hint, then returns immediately to Spanish-only.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday } from "../core/gamification.js";

const CONFUSION_TRIGGERS = /(\?|no entiendo|no sé qué decir|qué significa|help|english|inglés|no comprendo)/i;

const RULES = [
  { match: /hola|qué onda|buenas/i, reply: "¡Qué onda! ¿Cómo te llamas?", en: "Hey! What's your name?" },
  { match: /me llamo|soy /i, reply: "Mucho gusto. ¿De dónde eres?", en: "Nice to meet you. Where are you from?" },
  { match: /estados unidos|méxico|canadá|españa|argentina/i, reply: "¡Qué padre! ¿Te gusta aprender español?", en: "Cool! Do you like learning Spanish?" },
  { match: /me gusta/i, reply: "¡Qué bien! ¿Qué más te gusta hacer?", en: "Nice! What else do you like to do?" },
  { match: /clima|calor|frío|lluvia|hace sol/i, reply: "Sí, aquí el clima cambia mucho. ¿Cuál es tu estación favorita?", en: "Yeah, the weather here changes a lot. What's your favorite season?" },
  { match: /hambre|comer|tacos|comida/i, reply: "¡A mí también se me antoja! ¿Qué comida mexicana te gusta más?", en: "I'm craving something too! What Mexican food do you like most?" },
  { match: /trabajo|ocupado|cansado/i, reply: "Ánimo. ¿Qué haces para relajarte?", en: "Hang in there. What do you do to relax?" },
  { match: /familia|papá|mamá|hermano|hermana/i, reply: "La familia es muy importante. ¿Cuántos son en tu familia?", en: "Family is very important. How many are in your family?" },
  { match: /nos vemos|adiós|bye/i, reply: "¡Nos vemos! Cuídate mucho.", en: "See you! Take care." },
  { match: /gracias/i, reply: "¡De nada! Con gusto.", en: "You're welcome! Happy to." }
];

const FALLBACKS = [
  { reply: "Qué interesante, ¿me puedes contar un poco más?", en: "Interesting, can you tell me a bit more?" },
  { reply: "Entiendo. ¿Y tú qué opinas de eso?", en: "I see. And what do you think about that?" },
  { reply: "¿De verdad? ¿Por qué?", en: "Really? Why?" }
];

const STARTER = { reply: "¡Hola! Soy tu amigo mexicano de práctica. ¿Cómo te llamas?", en: "Hi! I'm your Mexican practice friend. What's your name?" };

function pickReply(userText) {
  for (const r of RULES) {
    if (r.match.test(userText)) return r;
  }
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

export function renderImmersion(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🌊 Immersion Mode"),
      el("p", {}, "Spanish only, start to finish. If you get stuck, type \"?\" or \"no entiendo\" for a simpler line with an English hint — then it's straight back to Spanish.")
    ])
  );

  const log = el("div", { class: "chat-log" });
  container.appendChild(log);

  const input = el("input", { type: "text", placeholder: "Responde en español... (o escribe \"?\" para ayuda)" });
  input.style.cssText = "flex:1;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1.05rem;";
  const sendBtn = el("button", { class: "btn btn-primary", onclick: send }, "Enviar");
  container.appendChild(el("div", { class: "chat-input-row" }, [input, sendBtn]));
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });

  let turns = 0;
  let lastBotLine = STARTER;
  botSay(STARTER);

  function botSay(line) {
    const bubble = el("div", { class: "chat-bubble bot" }, [el("div", { class: "cb-es es-text" }, line.reply)]);
    const hint = el("div", { class: "cb-en hidden" }, line.en);
    const hintBtn = el("button", { class: "btn btn-sm", style: "margin-top:.3rem", onclick: () => hint.classList.toggle("hidden") }, "💡 Hint");
    bubble.appendChild(hint);
    bubble.appendChild(hintBtn);
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    audioEngine.speak(line.reply);
    lastBotLine = line;
  }

  function userSay(text) {
    log.appendChild(el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-es es-text" }, text)]));
    log.scrollTop = log.scrollHeight;
  }

  function send() {
    const text = input.value.trim();
    if (!text) return;
    userSay(text);
    input.value = "";
    blurActive();
    turns++;

    if (CONFUSION_TRIGGERS.test(text)) {
      const simplerBubble = el("div", { class: "chat-bubble bot" }, [
        el("div", { class: "badge badge-gold" }, "Simplified + hint"),
        el("div", { class: "cb-es es-text", style: "margin-top:.3rem" }, lastBotLine.reply),
        el("div", { class: "cb-en" }, lastBotLine.en)
      ]);
      log.appendChild(simplerBubble);
      log.scrollTop = log.scrollHeight;
      audioEngine.speakSlow(lastBotLine.reply);
      setTimeout(() => botSay(pickReply("")), 900);
      return;
    }

    const reply = pickReply(text);
    setTimeout(() => botSay(reply), 350);

    if (turns >= 6 && turns % 6 === 0) {
      registerStudyToday();
      store.state.progress.immersionSessions.push({ date: todayISO(), turns });
      addXP(10, "Immersion Mode session");
      store.save();
    }
  }
}
