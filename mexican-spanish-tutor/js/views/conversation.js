// CONVERSATION — a Mexican conversation partner you answer by speaking or
// typing.
//
// Honest about what it is: this runs entirely in your browser with no server
// and no API key, so it is a rule-based partner, not a large language model.
// It cannot understand arbitrary Spanish. What it can do is hold a thread —
// react to what you said, follow up on the same subject instead of jumping
// around, remember a few concrete details and bring them back later, and scale
// its questions to your level. That covers the thing you actually need
// practice at: keeping a conversation going out loud.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive, toast } from "../core/ui.js";
import { audioEngine, speechRecognitionSupported, startDictation } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore, estimatedLevel } from "../core/gamification.js";
import { levelIndex } from "../data/roadmap.js";
import { correctionBlock } from "../core/feedback.js";
import { THREADS, REACTIONS, NEUTRAL_REACTIONS, PIVOTS, MEMORY_RULES, CALLBACKS } from "../data/conversationThreads.js";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Novice → 0, Intermediate → 1, Advanced → 2
function learnerTier() {
  const idx = levelIndex(estimatedLevel().code);
  return idx <= 2 ? 0 : idx <= 5 ? 1 : 2;
}

export function renderConversation(container) {
  const canSpeak = speechRecognitionSupported();

  // ---------- Conversation state ----------
  let thread = null;          // active THREAD
  let usedProbes = new Set(); // "threadId:es" already asked
  let turns = 0;
  let sinceCallback = 0;
  let greetedName = false;
  const memory = {};          // key -> remembered value
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

  // ---------- Conversation logic ----------
  function startThread(t, announce) {
    thread = t;
    picker.querySelectorAll("[data-thread]").forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-thread") === t.id);
    });
    if (announce) botSay(t.open);
  }

  function remember(text) {
    MEMORY_RULES.forEach((rule) => {
      const m = text.match(rule.re);
      if (m && m[1]) {
        const v = m[1].trim().replace(/\s+/g, " ");
        if (v.length >= 2 && v.length <= 28) memory[rule.key] = v;
      }
    });
  }

  // "cansada pero contenta" should get "qué bueno", not "ay, lo siento". In
  // Spanish the clause after `pero` carries the real point, so when several
  // sentiments match, the one appearing LAST in the sentence wins.
  function reaction(text) {
    let best = null;
    let bestAt = -1;
    REACTIONS.forEach((r) => {
      // Must be the LAST occurrence, not the first: in "bien, cansada pero
      // contenta" the positive pattern also hits "bien" at index 0, which
      // would lose to "cansada" and produce a condolence.
      const re = new RegExp(r.match.source, r.match.flags.includes("g") ? r.match.flags : r.match.flags + "g");
      let m;
      let last = -1;
      while ((m = re.exec(text)) !== null) {
        last = m.index;
        if (m.index === re.lastIndex) re.lastIndex++; // guard against zero-length matches
      }
      if (last > bestAt) { bestAt = last; best = r; }
    });
    return best ? pick(best.lines) : pick(NEUTRAL_REACTIONS);
  }

  // Switch threads if what they said clearly belongs to another topic — that's
  // the learner steering the conversation, and following is the natural move.
  function detectThread(text) {
    const matches = THREADS.filter((t) => t.match.test(text));
    if (!matches.length) return null;
    if (thread && matches.some((m) => m.id === thread.id)) return null; // already here
    return matches[0];
  }

  function nextProbe() {
    if (!thread) return null;
    const tier = learnerTier();
    const eligible = thread.probes.filter((p) => p.tier <= tier && !usedProbes.has(`${thread.id}:${p.es}`));
    if (!eligible.length) return null;
    // Prefer the hardest question the learner can actually handle.
    const best = Math.max(...eligible.map((p) => p.tier));
    const chosen = pick(eligible.filter((p) => p.tier === best));
    usedProbes.add(`${thread.id}:${chosen.es}`);
    return chosen;
  }

  function callback() {
    const keys = Object.keys(memory).filter((k) => CALLBACKS[k]);
    if (!keys.length) return null;
    const k = pick(keys);
    const tpl = pick(CALLBACKS[k]);
    return { es: tpl.es.replace("{v}", memory[k]), en: tpl.en.replace("{v}", memory[k]) };
  }

  function respond(text) {
    const react = reaction(text);
    sinceCallback++;

    // Someone who tells you their name expects you to use it.
    if (memory.nombre && !greetedName) {
      greetedName = true;
      const p = nextProbe() || thread.open;
      return { es: `¡Mucho gusto, ${memory.nombre}! ${p.es}`, en: `Nice to meet you, ${memory.nombre}! ${p.en}` };
    }

    // Every few turns, bring back something they told us earlier. This is the
    // single biggest thing that stops it feeling like a questionnaire.
    if (sinceCallback >= 3) {
      const cb = callback();
      if (cb) {
        sinceCallback = 0;
        return { es: `${react.es} ${cb.es}`, en: `${react.en} ${cb.en}` };
      }
    }

    const steered = detectThread(text);
    if (steered) {
      startThread(steered, false);
      const p = nextProbe() || steered.open;
      return { es: `${react.es} ${p.es}`, en: `${react.en} ${p.en}` };
    }

    const probe = nextProbe();
    if (probe) return { es: `${react.es} ${probe.es}`, en: `${react.en} ${probe.en}` };

    // Thread exhausted — move somewhere new rather than repeating ourselves.
    const fresh = THREADS.filter((t) => t.id !== (thread && thread.id) &&
      t.probes.some((p) => p.tier <= learnerTier() && !usedProbes.has(`${t.id}:${p.es}`)));
    if (fresh.length) {
      const next = pick(fresh);
      startThread(next, false);
      const pivot = pick(PIVOTS);
      const p = nextProbe() || next.open;
      return { es: `${pivot.es} ${p.es}`, en: `${pivot.en} ${p.en}` };
    }

    usedProbes = new Set(); // been all the way around; start over
    return { es: `${react.es} ${thread.open.es}`, en: `${react.en} ${thread.open.en}` };
  }

  function send() {
    if (dictation) return stopMic(true);
    const text = input.value.trim();
    if (!text) return;
    userSay(text);
    remember(text);
    briefCorrection(text);
    input.value = "";
    blurActive();
    turns++;
    updateSkillScore("speaking", 0.5);

    const reply = respond(text);
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
