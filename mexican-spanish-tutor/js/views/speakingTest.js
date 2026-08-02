// SPEAKING TEST (OPI PRACTICE) — a simulated ACTFL Oral Proficiency
// Interview you answer OUT LOUD: warm-up, level checks, narration,
// description, opinion, and an advanced task.
//
// Speaking is the primary input. The mic streams a live Spanish transcript
// while you talk and keeps listening through pauses, so you can give full
// paragraph-length answers. Typing stays available as a fallback for
// browsers without the Web Speech API (Safari/Firefox) or a denied mic.
//
// Scoring is a rule-based heuristic — length, sentence count, past-tense
// use, connective complexity, and the same mistake detector the Writing
// Coach uses. It's not a human rater, but it's consistent and explainable.

import { store, todayISO } from "../core/storage.js";
import { el, toast, blurActive, confettiBurst } from "../core/ui.js";
import { audioEngine, speechRecognitionSupported, startDictation } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { checkText } from "../data/mistakePatterns.js";
import { ACTFL_LEVELS } from "../data/roadmap.js";

// Each stage holds several prompts. Which one you get rotates by the day, so
// daily practice isn't the same seven questions over and over — and retaking
// within a day shuffles again.
const STAGE_BANK = [
  { key: "warmup", title: "Warm-up", prompts: [
    { es: "Preséntate: ¿cómo te llamas, de dónde eres y a qué te dedicas?", en: "Introduce yourself: name, where you're from, what you do." },
    { es: "Cuéntame un poco de ti. ¿Qué te gusta hacer en tu tiempo libre?", en: "Tell me a bit about yourself. What do you like doing in your free time?" },
    { es: "¿Cómo ha estado tu día hasta ahora?", en: "How has your day been so far?" },
    { es: "¿Desde cuándo estudias español y por qué empezaste?", en: "How long have you studied Spanish, and why did you start?" },
    { es: "Descríbete en unas cuantas frases: ¿cómo eres?", en: "Describe yourself in a few sentences — what are you like?" }
  ] },
  { key: "levelcheck1", title: "Level check", prompts: [
    { es: "Cuéntame sobre tu familia: ¿cuántos son y qué hace cada quién?", en: "Tell me about your family: how many, and what each person does." },
    { es: "¿Con quién vives y cómo es la convivencia?", en: "Who do you live with, and what's it like?" },
    { es: "Háblame de un amigo cercano. ¿Cómo se conocieron?", en: "Tell me about a close friend. How did you meet?" },
    { es: "¿Cómo es tu barrio? ¿Te gusta vivir ahí?", en: "What's your neighborhood like? Do you like living there?" },
    { es: "¿Qué haces normalmente los fines de semana?", en: "What do you usually do on weekends?" }
  ] },
  { key: "levelcheck2", title: "Level check", prompts: [
    { es: "Describe tu rutina de un día típico, de principio a fin.", en: "Describe your typical day, start to finish." },
    { es: "¿Cómo es un día normal en tu trabajo o escuela?", en: "What's a normal day at work or school like?" },
    { es: "¿Qué comes normalmente en un día? Cuéntame con detalle.", en: "What do you normally eat in a day? Tell me in detail." },
    { es: "¿Cómo te transportas y cuánto tiempo te toma?", en: "How do you get around, and how long does it take?" },
    { es: "¿Qué haces para relajarte después de un día pesado?", en: "What do you do to relax after a hard day?" }
  ] },
  { key: "narration", title: "Narration", prompts: [
    { es: "Cuéntame sobre un viaje o un día memorable. ¿Qué pasó, paso por paso?", en: "Tell me about a memorable trip or day — what happened, step by step?" },
    { es: "Cuéntame de la última vez que algo no salió como esperabas.", en: "Tell me about the last time something didn't go as expected." },
    { es: "¿Cuál es el mejor recuerdo de tu infancia? Descríbelo.", en: "What's your best childhood memory? Describe it." },
    { es: "Cuéntame de una celebración o fiesta a la que fuiste.", en: "Tell me about a celebration or party you went to." },
    { es: "¿Qué hiciste el fin de semana pasado? Cuéntamelo todo.", en: "What did you do last weekend? Tell me everything." }
  ] },
  { key: "description", title: "Description", prompts: [
    { es: "Describe tu casa, tu barrio o tu ciudad con el mayor detalle posible.", en: "Describe your home, neighborhood, or city in as much detail as you can." },
    { es: "Describe a una persona importante en tu vida: ¿cómo es física y personalmente?", en: "Describe an important person in your life — how they look and what they're like." },
    { es: "Describe tu lugar favorito. ¿Por qué te gusta tanto?", en: "Describe your favorite place. Why do you like it so much?" },
    { es: "Si pudieras diseñar tu casa ideal, ¿cómo sería?", en: "If you could design your ideal home, what would it be like?" },
    { es: "Describe cómo era tu escuela cuando eras niño.", en: "Describe what your school was like when you were a kid." }
  ] },
  { key: "opinion", title: "Opinion", prompts: [
    { es: "¿Qué opinas de trabajar desde casa comparado con ir a una oficina? Da tus razones.", en: "What do you think about working from home vs. an office? Give your reasons." },
    { es: "¿Crees que las redes sociales nos acercan o nos alejan? ¿Por qué?", en: "Do social networks bring us closer or push us apart? Why?" },
    { es: "¿Vale la pena aprender otro idioma hoy en día? Defiende tu postura.", en: "Is learning another language worth it nowadays? Defend your position." },
    { es: "¿Prefieres vivir en una ciudad grande o en un pueblo? ¿Por qué?", en: "Would you rather live in a big city or a small town? Why?" },
    { es: "¿Qué opinas de que la gente use el celular durante la comida?", en: "What do you think about people using phones during meals?" }
  ] },
  { key: "advanced", title: "Advanced task", prompts: [
    { es: "Explica las causas y los efectos de un problema social que te importe, y defiende tu punto de vista.", en: "Explain the causes and effects of a social issue you care about, and defend your view." },
    { es: "Si pudieras cambiar una cosa de tu país, ¿qué cambiarías y qué consecuencias tendría?", en: "If you could change one thing about your country, what and what would follow?" },
    { es: "¿Cómo crees que será el trabajo dentro de veinte años? Justifica tu respuesta.", en: "How do you think work will look in twenty years? Justify your answer." },
    { es: "Alguien no está de acuerdo contigo sobre el cambio climático. Convéncelo.", en: "Someone disagrees with you about climate change. Convince them." },
    { es: "¿Qué responsabilidad tienen las empresas con el medio ambiente? Argumenta.", en: "What responsibility do companies have to the environment? Make your case." }
  ] }
];

// Emergent follow-ups: the interviewer reacts to what you actually said
// instead of reading the next line of a script. Only fires when something in
// the answer is worth pulling on, so the interview stays conversational.
const FOLLOW_UPS = [
  { re: /\b(famili|herman|mam|pap|hij|espos|abuel)/i, es: "¿Y cómo es tu relación con ellos?", en: "And what's your relationship with them like?" },
  { re: /\b(trabaj|oficina|jefe|empresa|chamba)/i, es: "¿Qué es lo que más te gusta y lo que menos te gusta de eso?", en: "What do you like most and least about that?" },
  { re: /\b(com[ií]|comida|taco|restaurante|cocin)/i, es: "¿Y cómo se prepara? Explícame los pasos.", en: "And how is it made? Walk me through the steps." },
  { re: /\b(viaj|playa|ciudad|pueblo|oaxaca|m[eé]xico)/i, es: "¿Y qué fue lo que más te sorprendió de ese lugar?", en: "What surprised you most about that place?" },
  { re: /\b(amig|novi|pareja|gente)/i, es: "Cuéntame más de esa persona. ¿Cómo la conociste?", en: "Tell me more about that person. How did you meet them?" },
  { re: /\b(estudi|escuela|universidad|clase|prepa)/i, es: "¿Y para qué te ha servido eso hasta ahora?", en: "And how has that been useful to you so far?" },
  { re: /\b(dif[ií]cil|problema|estres|complicad|mal)/i, es: "¿Y cómo lo resolviste al final?", en: "And how did you resolve it in the end?" },
  { re: /\b(gust|encant|prefier|amo)/i, es: "¿Por qué? Dame un ejemplo concreto.", en: "Why? Give me a concrete example." },
  { re: /\b(ayer|pasado|antes|ni[ñn]o|cuando era)/i, es: "¿Y en qué ha cambiado eso hoy en día?", en: "And how has that changed nowadays?" },
  { re: /\b(futuro|voy a|quiero|planeo|espero)/i, es: "¿Y qué necesitas para lograrlo?", en: "And what do you need to make that happen?" }
];

// Every rule that matches is a candidate, and ones already used this session
// are held back — otherwise a learner who mentions work in each answer gets
// the identical probe seven times, which kills the conversational illusion.
const GENERIC_PROBES = [
  { es: "Interesante. ¿Me puedes dar más detalles?", en: "Interesting. Can you give me more detail?" },
  { es: "¿Y por qué crees que es así?", en: "And why do you think that is?" },
  { es: "¿Cómo te hizo sentir eso?", en: "How did that make you feel?" }
];

function pickFollowUp(text, used = new Set()) {
  const matches = FOLLOW_UPS.filter((f) => f.re.test(text));
  const pool = matches.length ? matches : GENERIC_PROBES;
  let choices = pool.filter((f) => !used.has(f.es));
  if (!choices.length) {
    // Topical probes exhausted — reach for an unused generic one before
    // repeating something they've already been asked.
    choices = GENERIC_PROBES.filter((f) => !used.has(f.es));
    if (!choices.length) choices = pool;
  }
  const pick = choices[Math.floor(Math.random() * choices.length)];
  return pick ? { es: pick.es, en: pick.en } : null;
}

// Day-of-year seed so today's interview is stable, tomorrow's is different.
function todaysStages(offset = 0) {
  const now = new Date();
  const day = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  return STAGE_BANK.map((stage, i) => {
    const variant = stage.prompts[(day + offset + i) % stage.prompts.length];
    return { key: stage.key, title: stage.title, es: variant.es, en: variant.en };
  });
}

const PAST_TENSE_RE = /\b\w*(é|aste|ó|amos|aron|í|iste|ió|imos|ieron|aba|abas|ábamos|aban|ía|ías|íamos|ían)\b/i;
const CONNECTOR_RE = /\b(aunque|sin embargo|por un lado|por otro|además|mientras|ya que|porque|por lo tanto|en resumen|entonces|pero)\b/i;

function scoreResponse(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 2);
  const mistakes = checkText(text).length;
  const hasPast = PAST_TENSE_RE.test(text);
  const hasConnector = CONNECTOR_RE.test(text);
  let score = Math.min(60, words.length * 2.2);
  score += sentences.length >= 3 ? 15 : sentences.length * 5;
  score += hasPast ? 10 : 0;
  score += hasConnector ? 15 : 0;
  score -= mistakes * 8;
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    words: words.length, sentences: sentences.length, hasPast, hasConnector, mistakes
  };
}

export function renderSpeakingTest(container) {
  const canSpeak = speechRecognitionSupported();
  let attempt = 0;
  let STAGES = todaysStages(attempt);
  let idx = 0;
  let pendingFollowUp = null;   // emergent probe queued off the last answer
  const usedProbes = new Set();  // keeps follow-ups from repeating in a session
  const responses = [];

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎓 Speaking Test"),
      el("p", {}, "A mock ACTFL interview you answer out loud. Tap the mic, speak in Spanish as long as you like, then stop — your words appear as you talk. The questions rotate daily and the interviewer follows up on what you actually say.")
    ])
  );

  if (!canSpeak) {
    container.appendChild(
      el("div", { class: "feedback-block incorrect", style: "margin-bottom:1rem" }, [
        el("strong", {}, "Mic not available in this browser. "),
        "Speech recognition needs Chrome or Edge (Safari and Firefox don't support it). You can still take the test by typing your answers below."
      ])
    );
  }

  const progressLine = el("p", { class: "text-muted" });
  container.appendChild(progressLine);
  const body = el("div", {});
  container.appendChild(body);

  render();

  function render() {
    if (idx >= STAGES.length && !pendingFollowUp) return renderReport();
    const stage = pendingFollowUp || STAGES[idx];
    progressLine.textContent = pendingFollowUp
      ? `Follow-up · ${stage.title}`
      : `Question ${idx + 1} of ${STAGES.length} · ${stage.title}`;
    body.innerHTML = "";

    const card = el("div", { class: "card" }, [
      el("span", { class: `badge badge-${pendingFollowUp ? "gold" : "default"}` }, pendingFollowUp ? "Follow-up" : stage.title),
      el("div", { class: "flex justify-between items-center", style: "gap:.5rem;margin-top:.4rem" }, [
        el("p", { class: "es-text", style: "font-size:1.15rem;font-weight:700;margin:0" }, stage.es),
        el("button", { class: "play-btn", title: "Hear the question", onclick: () => audioEngine.speak(stage.es) }, "🔊")
      ]),
      el("p", { class: "text-muted", style: "margin:.25rem 0 0" }, stage.en)
    ]);

    // --- Live transcript area ---
    const transcript = el("div", {
      class: "es-text",
      style: "min-height:5.5rem;margin-top:.9rem;padding:.75rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);white-space:pre-wrap;line-height:1.55"
    });
    const placeholder = canSpeak ? "Your speech will appear here..." : "Type your answer here...";
    transcript.appendChild(el("span", { class: "text-faint" }, placeholder));

    let finalText = "";
    let dictation = null;
    let listening = false;

    function paint(fin, interim = "") {
      transcript.innerHTML = "";
      if (!fin && !interim) {
        transcript.appendChild(el("span", { class: "text-faint" }, placeholder));
        return;
      }
      if (fin) transcript.appendChild(document.createTextNode(fin));
      if (interim) transcript.appendChild(el("span", { class: "text-faint" }, (fin ? " " : "") + interim));
    }

    const status = el("span", { class: "text-faint", style: "font-size:.85rem" }, "");

    const micBtn = el("button", { class: "btn btn-primary btn-lg" }, canSpeak ? "🎤 Start speaking" : "🎤 Mic unavailable");
    if (!canSpeak) micBtn.disabled = true;

    micBtn.addEventListener("click", () => {
      if (!listening) {
        listening = true;
        micBtn.textContent = "⏹ Stop";
        micBtn.classList.remove("btn-primary");
        micBtn.classList.add("btn-danger");
        status.textContent = "Listening... speak in Spanish";
        dictation = startDictation({
          onInterim: (fin, interim) => { finalText = fin; paint(fin, interim); },
          onStateChange: (s) => {
            if (s === "denied") {
              status.textContent = "Mic permission denied — you can type your answer instead.";
              resetMic();
            }
          },
          onError: (e) => { status.textContent = `Mic error: ${e}. You can type instead.`; }
        });
      } else {
        const text = dictation ? dictation.stop() : finalText;
        finalText = text || finalText;
        paint(finalText);
        resetMic();
        status.textContent = finalText ? "Got it — edit below if needed, then submit." : "Didn't catch anything. Try again or type it.";
      }
    });

    function resetMic() {
      listening = false;
      micBtn.textContent = "🎤 Start speaking";
      micBtn.classList.add("btn-primary");
      micBtn.classList.remove("btn-danger");
    }

    // Editable fallback / correction box, always available.
    const ta = el("textarea", { placeholder: canSpeak ? "…or type / edit your answer here" : "Type your answer in Spanish..." });
    ta.style.marginTop = ".6rem";
    ta.addEventListener("input", () => { finalText = ta.value; });

    const submit = el("button", { class: "btn btn-success", onclick: () => {
      // Whichever has content wins; the textarea takes priority if edited.
      const answer = (ta.value.trim() || finalText || "").trim();
      if (answer.length < 3) {
        toast("Say or type an answer first.", { type: "error" });
        return;
      }
      if (dictation && listening) dictation.stop();
      blurActive();
      if (pendingFollowUp) {
        // Fold the follow-up into the stage it came from — it's the same turn.
        const parent = responses[responses.length - 1];
        parent.text += " " + answer;
        Object.assign(parent, scoreResponse(parent.text));
        pendingFollowUp = null;
      } else {
        responses.push({ stage: stage.key, text: answer, ...scoreResponse(answer) });
        idx++;
        // Only probe when they gave us something to pull on.
        if (answer.split(/\s+/).length >= 6) {
          const probe = pickFollowUp(answer, usedProbes);
          if (probe) {
            usedProbes.add(probe.es);
            pendingFollowUp = { key: stage.key, title: stage.title, es: probe.es, en: probe.en };
          }
        }
      }
      render();
    } }, idx === STAGES.length - 1 ? "Finish interview →" : "Submit & continue →");

    card.appendChild(transcript);
    card.appendChild(el("div", { class: "btn-row", style: "margin-top:.7rem;align-items:center" }, [micBtn, status]));
    card.appendChild(ta);
    card.appendChild(el("div", { class: "btn-row", style: "margin-top:.6rem" }, [
      submit,
      el("button", { class: "btn btn-ghost", onclick: () => { if (dictation && listening) dictation.stop(); paint(""); finalText = ""; ta.value = ""; status.textContent = ""; resetMic(); } }, "Clear")
    ]));

    body.appendChild(card);
  }

  function renderReport() {
    progressLine.textContent = "";
    body.innerHTML = "";

    // Highest stage answered well sets the ceiling, mapped onto the levels.
    let ceiling = 0;
    responses.forEach((r, i) => { if (r.score >= 55) ceiling = i; });
    const level = ACTFL_LEVELS[Math.min(ceiling, ACTFL_LEVELS.length - 1)];

    const sorted = [...responses].sort((a, b) => b.score - a.score);
    const strong = sorted.slice(0, 2);
    const weak = [...responses].sort((a, b) => a.score - b.score).slice(0, 2);
    const tips = weak.map((r) => {
      const s = STAGES.find((x) => x.key === r.stage);
      if (r.words < 25) return `${s.title}: aim for longer answers — 4–5 connected sentences, not one line.`;
      if (!r.hasPast) return `${s.title}: work past tenses in — mix preterite (what happened) with imperfect (background).`;
      if (!r.hasConnector) return `${s.title}: link your ideas with aunque, sin embargo, por un lado… to build real paragraphs.`;
      if (r.mistakes) return `${s.title}: ${r.mistakes} common mistake pattern(s) detected — run the answer through the Writing tab.`;
      return `${s.title}: solid — push for more detail and precision next time.`;
    });

    store.state.profile.selfReportedLevel = level.code;
    const log = store.state.progress.speakingTests || (store.state.progress.speakingTests = []);
    log.push({ date: todayISO(), level: level.code, avg: Math.round(responses.reduce((a, r) => a + r.score, 0) / responses.length) });
    if (log.length > 30) log.shift();
    registerStudyToday();
    updateSkillScore("speaking", 4);
    addXP(25, "Speaking Test completed");
    store.save();
    confettiBurst();

    body.appendChild(
      el("div", { class: "card pop-in", style: "text-align:center" }, [
        el("div", { style: "font-size:2.4rem" }, "🎓"),
        el("p", { class: "text-muted", style: "margin:.2rem 0 0" }, "Estimated speaking level"),
        el("h2", { style: "margin:.2rem 0" }, level.label),
        el("span", { class: `badge badge-${level.code.startsWith("novice") ? "novice" : level.code.startsWith("intermediate") ? "intermediate" : "advanced"}` }, level.short),
        el("p", { class: "text-muted", style: "margin-top:.6rem" }, level.blurb)
      ])
    );

    body.appendChild(
      el("div", { class: "grid grid-2", style: "margin-top:1rem" }, [
        el("div", { class: "card" }, [
          el("div", { class: "card-title" }, "💪 Strongest"),
          el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" }, strong.map((r) =>
            el("li", {}, `${STAGES.find((s) => s.key === r.stage).title} (${r.score}/100)`)))
        ]),
        el("div", { class: "card" }, [
          el("div", { class: "card-title" }, "🎯 Weakest"),
          el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" }, weak.map((r) =>
            el("li", {}, `${STAGES.find((s) => s.key === r.stage).title} (${r.score}/100)`)))
        ])
      ])
    );

    body.appendChild(
      el("div", { class: "card", style: "margin-top:1rem" }, [
        el("div", { class: "card-title" }, "📈 What to work on"),
        el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" }, tips.map((t) => el("li", {}, t)))
      ])
    );

    const detail = el("div", { class: "card", style: "margin-top:1rem" }, [el("div", { class: "card-title" }, "Your answers")]);
    responses.forEach((r) => {
      const s = STAGES.find((x) => x.key === r.stage);
      detail.appendChild(
        el("div", { style: "padding:.55rem 0;border-bottom:1px solid var(--border)" }, [
          el("div", { class: "flex justify-between items-center" }, [
            el("strong", {}, s.title),
            el("span", { class: "badge badge-default" }, `${r.score}/100 · ${r.words} words`)
          ]),
          el("p", { class: "es-text", style: "margin:.3rem 0 0" }, r.text)
        ])
      );
    });
    body.appendChild(detail);

    body.appendChild(
      el("div", { class: "btn-row", style: "margin-top:1rem" }, [
        el("button", { class: "btn btn-primary", onclick: () => { attempt++; STAGES = todaysStages(attempt); idx = 0; pendingFollowUp = null; usedProbes.clear(); responses.length = 0; render(); } }, "Take it again (new questions)"),
        el("a", { class: "btn", href: "#/roadmap" }, "Back to roadmap")
      ])
    );
  }
}
