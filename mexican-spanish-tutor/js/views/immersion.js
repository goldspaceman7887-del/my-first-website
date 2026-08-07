// IMMERSION MODE — Mexican Spanish only, start to finish.
//
// Runs the same shared threaded engine as the conversation partner
// (core/conversationEngine.js): nine topics of level-tiered follow-ups that
// dig deeper into whatever you're actually talking about, occasional
// mishearings/interruptions/clarifying questions so it doesn't feel like a
// form, and it never repeats a question — not within a session, and not in
// the next one either, because what it has already asked is remembered
// between visits (progress.immersionAsked, via the engine's persist:true
// mode).
//
// What makes it Immersion rather than Conversation: no English on screen
// unless you ask for it, and typing "?" or "no entiendo" replays the last
// line slowly with a translation before handing the same question back to
// you.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive, toast } from "../core/ui.js";
import { audioEngine, speechRecognitionSupported, startDictation } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { createEngine } from "../core/conversationEngine.js";
import { THREADS } from "../data/conversationThreads.js";
import { tappable, initTapWords } from "../core/tapword.js";

const CONFUSION_TRIGGERS = /(^\?+$|no entiendo|no s[ée] qu[ée] decir|qu[ée] significa|help|english|ingl[ée]s|no comprendo|otra vez|m[áa]s despacio)/i;

// Openers vary so two sessions in a row don't start the same way.
const OPENERS = [
  { es: "¡Hola! Soy tu amigo mexicano de práctica. ¿Cómo te llamas?", en: "Hi! I'm your Mexican practice friend. What's your name?" },
  { es: "¡Qué onda! ¿Cómo va tu día?", en: "Hey! How's your day going?" },
  { es: "¡Buenas! Cuéntame algo de ti.", en: "Hey there! Tell me something about yourself." },
  { es: "¡Órale, llegaste! ¿Qué has hecho hoy?", en: "Hey, you made it! What have you been up to today?" },
  { es: "¡Hola otra vez! ¿De qué quieres platicar?", en: "Hi again! What do you want to talk about?" },
  { es: "¿Qué tal? ¿Todo bien por allá?", en: "How's it going? All good over there?" }
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function renderImmersion(container) {
  const canSpeak = speechRecognitionSupported();
  const engine = createEngine({ persist: true });
  const untap = initTapWords();
  let turns = 0;
  let lastBotLine = null;
  let dictation = null;

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🌊 Immersion Mode"),
      el("p", {}, "Spanish only, start to finish. Stuck? Type \"?\" or \"no entiendo\" and you'll get the last line again — slower, with a translation — then it's straight back to Spanish. Tap any word for its meaning.")
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
    const bubble = el("div", { class: "chat-bubble bot" }, [tappable(line.es, "cb-es")]);
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
    audioEngine.speak(line.es);
  }

  function userSay(text) {
    log.appendChild(el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-es es-text" }, text)]));
    log.scrollTop = log.scrollHeight;
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

    engine.remember(text);
    updateSkillScore("speaking", 0.5);
    const reply = engine.respond(text);
    setTimeout(() => botSay(reply), 350);

    if (turns >= 6 && turns % 6 === 0) {
      registerStudyToday();
      store.state.progress.immersionSessions.push({ date: todayISO(), turns });
      addXP(10, "Immersion");
      store.save();
      toast("¡Vas muy bien! +10 XP", { icon: "🌊" });
    }
  }

  engine.startThread(pick(THREADS));
  botSay(pick(OPENERS));

  // Leaving the page with the mic live would keep it recording; the tap-word
  // popover also lives on document.body and must be cleaned up the same way.
  return () => {
    if (dictation) { dictation.stop(); dictation = null; }
    untap();
  };
}
