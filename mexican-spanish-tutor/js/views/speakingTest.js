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

const STAGES = [
  { key: "warmup", title: "Warm-up", es: "Preséntate: ¿cómo te llamas, de dónde eres y a qué te dedicas?", en: "Introduce yourself: your name, where you're from, what you do." },
  { key: "levelcheck1", title: "Level check", es: "Cuéntame sobre tu familia: ¿cuántos son y qué hace cada quién?", en: "Tell me about your family: how many, and what each person does." },
  { key: "levelcheck2", title: "Level check", es: "Describe tu rutina de un día típico, de principio a fin.", en: "Describe your typical day, start to finish." },
  { key: "narration", title: "Narration", es: "Cuéntame sobre un viaje o un día memorable. ¿Qué pasó, paso por paso?", en: "Tell me about a memorable trip or day — what happened, step by step?" },
  { key: "description", title: "Description", es: "Describe tu casa, tu barrio o tu ciudad con el mayor detalle posible.", en: "Describe your home, neighborhood, or city in as much detail as you can." },
  { key: "opinion", title: "Opinion", es: "¿Qué opinas de trabajar desde casa comparado con ir a una oficina? Da tus razones.", en: "What do you think about working from home vs. an office? Give your reasons." },
  { key: "advanced", title: "Advanced task", es: "Explica las causas y los efectos de un problema social que te importe, y defiende tu punto de vista.", en: "Explain the causes and effects of a social issue you care about, and defend your view." }
];

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
  let idx = 0;
  const responses = [];

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎓 Speaking Test"),
      el("p", {}, "A mock ACTFL interview you answer out loud. Tap the mic, speak in Spanish for as long as you like, then stop — your words appear as you talk.")
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
    if (idx >= STAGES.length) return renderReport();
    const stage = STAGES[idx];
    progressLine.textContent = `Question ${idx + 1} of ${STAGES.length} · ${stage.title}`;
    body.innerHTML = "";

    const card = el("div", { class: "card" }, [
      el("span", { class: "badge badge-default" }, stage.title),
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
      responses.push({ stage: stage.key, text: answer, ...scoreResponse(answer) });
      idx++;
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
        el("button", { class: "btn btn-primary", onclick: () => { idx = 0; responses.length = 0; render(); } }, "Take it again"),
        el("a", { class: "btn", href: "#/roadmap" }, "Back to roadmap")
      ])
    );
  }
}
