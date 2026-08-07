// CONVERSATION — a Mexican conversation partner you answer by speaking or
// typing.
//
// Honest about what it is: this runs entirely in your browser with no server
// and no API key, so it is a rule-based partner, not a large language model.
// It cannot understand arbitrary Spanish. What it can do is hold a thread —
// react to what you said, follow up on the same subject instead of jumping
// around, remember a few concrete details and bring them back later, scale
// its questions to your level, and occasionally mishear you, interrupt, ask
// you to clarify, or stack two questions in one turn — the actual engine
// lives in core/conversationEngine.js, shared with Immersion Mode.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive, toast } from "../core/ui.js";
import { audioEngine, speechRecognitionSupported, startDictation } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { correctionBlock } from "../core/feedback.js";
import { createEngine } from "../core/conversationEngine.js";
import { THREADS } from "../data/conversationThreads.js";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function renderConversation(container) {
  const canSpeak = speechRecognitionSupported();
  const engine = createEngine({ persist: false });
  let turns = 0;
  let dictation = null;

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "💬 Conversación"),
      el("p", {}, canSpeak
        ? "Talk with a Mexican conversation partner. Tap the mic and answer out loud, or type — whichever you feel like. It follows up on what you actually say instead of jumping around."
        : "Talk with a Mexican conversation partner by typing. It follows up on what you actually say instead of jumping around. (Answering out loud needs Chrome or Edge — this browser doesn't offer the microphone API.)")
    ])
  );

  // Practice strips a sub-view's .page-header, so the one instruction people
  // actually need lives outside it.
  container.appendChild(
    el("p", { class: "text-muted", style: "font-size:.85rem;margin:.2rem 0 .6rem" },
      canSpeak
        ? "Tap 🎤 to answer out loud, or just type. Pick a topic, or let it choose."
        : "Type your answers below. (Answering out loud needs Chrome or Edge.)")
  );

  // ---------- Topic picker ----------
  const picker = el("div", { class: "search-row" });
  container.appendChild(picker);
  picker.appendChild(
    el("button", { class: "chip-filter", onclick: () => startThread(pick(THREADS), true) }, "🎲 Sorpréndeme")
  );
  THREADS.forEach((t) => {
    picker.appendChild(
      el("button", { class: "chip-filter", "data-thread": t.id, onclick: () => startThread(t, true) }, `${t.icon} ${t.label}`)
    );
  });

  const log = el("div", { class: "chat-log" });
  container.appendChild(log);

  // ---------- Input ----------
  const input = el("input", { type: "text", placeholder: "Escribe tu respuesta..." });
  input.style.cssText = "flex:1;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1.05rem;";
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });

  const micBtn = el("button", {
    class: "btn btn-icon btn-primary",
    title: canSpeak ? "Answer out loud" : "Answering out loud needs Chrome or Edge",
    "aria-label": "Speak your answer"
  }, "🎤");
  if (!canSpeak) micBtn.disabled = true;

  const sendBtn = el("button", { class: "btn btn-primary", onclick: () => send() }, "Enviar");
  container.appendChild(el("div", { class: "chat-input-row" }, [micBtn, input, sendBtn]));

  const micStatus = el("div", { class: "text-muted", style: "font-size:.8rem;min-height:1.2em;margin-top:.3rem" }, "");
  container.appendChild(micStatus);

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
      onInterim: (finalSoFar, interim) => {
        // Show the words landing as you speak, so you can see it's working.
        input.value = (finalSoFar + " " + interim).trim();
      },
      onError: (err) => {
        if (err === "not-allowed" || err === "service-not-allowed") {
          micStatus.textContent = "El micrófono está bloqueado. Puedes escribir tu respuesta.";
        } else if (err === "unsupported") {
          micStatus.textContent = "Este navegador no tiene micrófono. Usa Chrome o Edge, o escribe.";
        }
      },
      onStateChange: (s) => {
        if (s === "denied") stopMic(false);
      }
    });
    if (!dictation.supported) {
      dictation = null;
      resetMicButton();
    }
  }

  function stopMic(thenSend) {
    if (!dictation) return;
    const text = dictation.stop();
    dictation = null;
    resetMicButton();
    micStatus.textContent = "";
    if (thenSend) {
      // Prefer the box: you may have fixed a mis-hearing by hand before stopping.
      if (!input.value.trim() && text) input.value = text;
      if (input.value.trim()) send();
      else micStatus.textContent = "No te escuché. Inténtalo otra vez o escribe tu respuesta.";
    }
  }

  function resetMicButton() {
    micBtn.textContent = "🎤";
    micBtn.classList.add("btn-primary");
    micBtn.classList.remove("btn-danger");
  }

  // ---------- Rendering ----------
  function immersionLevel() {
    return store.state.settings.immersionLevel || 4;
  }

  function botSay(line) {
    const showEnglishInline = immersionLevel() <= 2;
    const bubble = el("div", { class: "chat-bubble bot" }, [
      el("div", { class: "cb-es es-text" }, line.es),
      showEnglishInline ? el("div", { class: "cb-en" }, line.en) : null
    ].filter(Boolean));
    if (!showEnglishInline) {
      const hint = el("div", { class: "cb-en hidden" }, line.en);
      bubble.appendChild(hint);
      bubble.appendChild(
        el("button", { class: "btn btn-sm", style: "margin-top:.3rem", onclick: () => hint.classList.toggle("hidden") }, "💡 Hint")
      );
    }
    bubble.appendChild(
      el("button", { class: "btn btn-sm", style: "margin-top:.3rem", onclick: () => audioEngine.speak(line.es) }, "🔊 Otra vez")
    );
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    audioEngine.speak(line.es);
  }

  function userSay(text) {
    log.appendChild(el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-es es-text" }, text)]));
    log.scrollTop = log.scrollHeight;
  }

  // Corrects what you actually wrote, rather than showing a canned "natural"
  // sentence and leaving you to spot the difference yourself.
  function briefCorrection(text) {
    const block = correctionBlock(text, { compact: true });
    if (!block) return;
    log.appendChild(block);
    log.scrollTop = log.scrollHeight;
    updateSkillScore("writing", -0.3);
  }

  function startThread(t, announce) {
    engine.startThread(t);
    picker.querySelectorAll("[data-thread]").forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-thread") === t.id);
    });
    if (announce) botSay(t.open);
  }

  function send() {
    if (dictation) return stopMic(true);
    const text = input.value.trim();
    if (!text) return;
    userSay(text);
    engine.remember(text);
    briefCorrection(text);
    input.value = "";
    blurActive();
    turns++;
    updateSkillScore("speaking", 0.5);

    const reply = engine.respond(text);
    setTimeout(() => botSay(reply), 350);

    if (turns >= 6 && turns % 6 === 0) {
      registerStudyToday();
      store.state.progress.conversationSessions.push({ date: todayISO(), turns });
      addXP(10, "Conversación");
      store.save();
      toast("¡Vas bien! +10 XP", { icon: "💬" });
    }
  }

  startThread(THREADS[0], false);
  botSay({
    es: "¡Qué onda! Soy tu compañero de conversación. Podemos hablar de lo que quieras — escoge un tema arriba o nada más contéstame. ¿Cómo te ha ido hoy?",
    en: "Hey! I'm your conversation partner. We can talk about whatever you like — pick a topic above or just answer me. How's your day been?"
  });

  // Leaving the page with the mic live would keep it recording.
  return () => { if (dictation) { dictation.stop(); dictation = null; } };
}
