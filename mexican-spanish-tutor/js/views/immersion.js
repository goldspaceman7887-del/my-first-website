// IMMERSION MODE — Mexican Spanish only, start to finish.
//
// Runs the same shared threaded engine as the conversation partner
// (core/conversationEngine.js): a wide set of topics with level-tiered
// follow-ups that dig deeper into whatever you're actually talking about,
// occasional mishearings/interruptions/clarifying questions so it doesn't
// feel like a form, and it never repeats a question — not within a session,
// and not in the next one either, because what it has already asked is
// remembered between visits (progress.immersionAsked, via the engine's
// persist:true mode).
//
// What makes it Immersion rather than Conversation: no English on screen
// unless you ask for it, and typing "?" or "no entiendo" replays the last
// line slowly with a translation before handing the same question back to
// you.
//
// Two things are Immersion-only, layered on top of the shared engine via its
// additive `adaptive`/`followups` options (Conversation Mode never sets
// either, so its behavior is untouched):
//   - Difficulty adapts within a session: a persisted bias (-1..+1),
//     nudged by how long/clean each reply was, can only ever soften probe
//     difficulty toward easier material already unlocked by the learner's
//     real ACTFL level — it never reaches past that ceiling.
//   - Sentence starters and 🐢 slow-replay / 🎧 shadow-practice buttons give
//     lighter-weight typing and speaking scaffolding than a blank chat box.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive, toast } from "../core/ui.js";
import { audioEngine, speechRecognitionSupported, startDictation } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { createEngine, learnerTier } from "../core/conversationEngine.js";
import { THREADS } from "../data/conversationThreads.js";
import { tappable, initTapWords } from "../core/tapword.js";
import { hasCorrections } from "../core/feedback.js";

const CONFUSION_TRIGGERS = /(^\?+$|no entiendo|no s[ée] qu[ée] decir|qu[ée] significa|help|english|ingl[ée]s|no comprendo|otra vez|m[áa]s despacio)/i;

// Openers vary so two sessions in a row don't start the same way.
const OPENERS = [
  { es: "¡Hola! Soy tu amigo mexicano de práctica. ¿Cómo te llamas?", en: "Hi! I'm your Mexican practice friend. What's your name?" },
  { es: "¡Qué onda! ¿Cómo va tu día?", en: "Hey! How's your day going?" },
  { es: "¡Buenas! Cuéntame algo de ti.", en: "Hey there! Tell me something about yourself." },
  { es: "¡Órale, llegaste! ¿Qué has hecho hoy?", en: "Hey, you made it! What have you been up to today?" },
  { es: "¡Hola otra vez! ¿De qué quieres platicar?", en: "Hi again! What do you want to talk about?" },
  { es: "¿Qué tal? ¿Todo bien por allá?", en: "How's it going? All good over there?" },
  { es: "¡Qué gusto verte! ¿Cómo has estado?", en: "Good to see you! How have you been?" },
  { es: "¡Ándale, aquí andamos! ¿Qué me cuentas?", en: "There you are! What's new with you?" },
  { es: "¡Hola! ¿Ya listo/a para platicar tantito?", en: "Hi! Ready to chat for a bit?" }
];

// Typed-response scaffolding, tiered like everything else in this engine —
// tapping one starts the sentence for you instead of staring at a blank box.
// Kept local to Immersion Mode: Conversation Mode already gives a topic
// picker as its "getting started" affordance, this is this mode's version.
const STARTER_PHRASES = {
  0: ["Pues...", "Sí, porque...", "No, la verdad...", "A mí me gusta..."],
  1: ["Bueno, la verdad es que...", "Antes sí, pero ahora...", "Casi siempre...", "Depende, porque..."],
  2: ["Yo creo que...", "Por un lado... pero por otro...", "Lo que pasa es que...", "Si te soy sincero/a,..."]
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

export function renderImmersion(container) {
  const canSpeak = speechRecognitionSupported();
  // adaptive: probe difficulty can back off (never exceed) the learner's real
  // ACTFL-gated ceiling based on how this session is going.
  // followups: occasional generic "tell me more"-style digs, on top of the
  // scripted thread probes. Both default off, so Conversation Mode — which
  // never passes them — is completely unaffected by either.
  const engine = createEngine({ persist: true, adaptive: true, followups: true });
  const untap = initTapWords();
  let turns = 0;
  let lastBotLine = null;
  let dictation = null;
  let shadowCtrl = null;
  // -1 (struggling) .. +1 (doing well), persisted so a session picks up
  // roughly where the last one left off rather than resetting every visit.
  let bias = clamp(store.state.progress.immersionSkillBias || 0, -1, 1);
  engine.setBias(bias);
  engine.setUnpredictability(clamp(0.15 + (learnerTier() === 2 ? 0.05 : 0), 0.05, 0.3));

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
        ? "Todo en español. Escribe \"?\" si te pierdes. Toca 🎤 para hablar, 🐢 para oír más despacio, 🎧 para practicar la pronunciación."
        : "Todo en español. Escribe \"?\" si te pierdes. Toca 🐢 para oír más despacio.")
  );

  const log = el("div", { class: "chat-log" });
  container.appendChild(log);

  const startersRow = el("div", { class: "search-row", style: "margin-bottom:.4rem" });
  container.appendChild(startersRow);

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
    const shadowBtn = el("button", { class: "btn btn-sm" }, "🎧 Practicar");
    shadowBtn.addEventListener("click", () => {
      if (shadowCtrl) { shadowCtrl.cancel(); shadowCtrl = null; shadowBtn.textContent = "🎧 Practicar"; return; }
      shadowBtn.textContent = "⏹ Practicando…";
      shadowCtrl = audioEngine.shadow(line.es, {
        repeats: 3,
        onDone: () => { shadowCtrl = null; shadowBtn.textContent = "🎧 Practicar"; }
      });
    });
    const bubble = el("div", { class: "chat-bubble bot" }, [tappable(line.es, "cb-es")]);
    const hint = el("div", { class: "cb-en hidden" }, line.en);
    bubble.appendChild(hint);
    bubble.appendChild(
      el("div", { class: "flex", style: "gap:.35rem;margin-top:.3rem;flex-wrap:wrap" }, [
        el("button", { class: "btn btn-sm", onclick: () => hint.classList.toggle("hidden") }, "💡 Hint"),
        el("button", { class: "btn btn-sm", onclick: () => audioEngine.speak(line.es) }, "🔊"),
        el("button", { class: "btn btn-sm", title: "Escuchar más despacio", onclick: () => audioEngine.speakSlow(line.es) }, "🐢"),
        shadowBtn
      ])
    );
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    audioEngine.speak(line.es);
    renderStarters();
  }

  function userSay(text) {
    log.appendChild(el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-es es-text" }, text)]));
    log.scrollTop = log.scrollHeight;
  }

  // Typing scaffolding: a few tappable sentence starters at the learner's
  // current tier, refreshed each turn so they don't go stale. Tapping one
  // fills the box rather than sending — the learner still finishes the
  // thought themselves.
  function renderStarters() {
    startersRow.innerHTML = "";
    const options = STARTER_PHRASES[learnerTier()] || STARTER_PHRASES[0];
    shuffle(options).slice(0, 3).forEach((phrase) => {
      startersRow.appendChild(
        el("button", { class: "chip-filter", type: "button", onclick: () => { input.value = phrase + " "; input.focus(); } }, phrase)
      );
    });
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
    updateBias(text);
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

  // Nudges difficulty from how this turn actually went: a longer, clean
  // reply pushes toward harder material; a very short or error-flagged one
  // eases off. hasCorrections() reuses the existing mistake checker purely as
  // a silent signal here — nothing is shown on screen, which stays true to
  // Immersion Mode's "no interruption" design.
  function updateBias(text) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const clean = !hasCorrections(text);
    let delta = 0;
    if (words >= 6 && clean) delta = 0.12;
    else if (words <= 2 || !clean) delta = -0.1;
    if (!delta) return;
    bias = clamp(bias + delta, -1, 1);
    store.state.progress.immersionSkillBias = bias;
    store.save();
    engine.setBias(bias);
    engine.setUnpredictability(clamp(
      0.15 + (learnerTier() === 2 ? 0.05 : 0) + (bias > 0.5 ? 0.05 : bias < -0.4 ? -0.05 : 0),
      0.05, 0.3
    ));
  }

  engine.startThread(pick(THREADS));
  botSay(pick(OPENERS));

  // Leaving the page with the mic live would keep it recording; an active
  // shadow loop and the tap-word popover (which lives on document.body) need
  // the same treatment.
  return () => {
    if (dictation) { dictation.stop(); dictation = null; }
    if (shadowCtrl) { shadowCtrl.cancel(); shadowCtrl = null; }
    untap();
  };
}
