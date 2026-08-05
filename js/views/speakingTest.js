// SPEAKING TEST — a short, structured self-assessment (~10 prompts of rising
// difficulty, A0 → B2) separate from the free-practice Sistema de habla view.
//
// Flow: intro → for each prompt, listen to the target sentence (TTS), then
// either record yourself via live dictation (Chrome/Edge only) or, if speech
// recognition is unsupported or the microphone is denied, self-rate how
// confident you felt reading it aloud. Either path produces a 0-100 score
// that feeds the same supportive feedback, XP, SRS, and skill-score pipeline
// — so nobody is ever stuck without a way to finish the test.
//
// Prompts are real sentences pulled straight from the dialogue and
// vocabulary data files (nothing invented here).

import { el, toast, confettiBurst, progressBar } from "../core/ui.js";
import { audioEngine, speechRecognitionSupported, listenOnce, textSimilarity } from "../core/audio.js";
import { gradeItem, QUALITY } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { DIALOGUES_BEGINNER_INTERMEDIATE } from "../data/dialogues-beginner-intermediate.js";
import { DIALOGUES_ADVANCED } from "../data/dialogues-advanced.js";
import { VOCABULARY } from "../data/vocabulary.js";

// Pointers into the real dialogue data: dialogue id + line index + a level
// label for the progress ladder. Resolved to actual sentences at load time
// so the test always speaks genuine, in-context Spanish.
const PROMPT_SOURCES = [
  { dialogues: DIALOGUES_BEGINNER_INTERMEDIATE, id: "dlg_greetings_introductions", line: 1, level: "A0" },
  { dialogues: DIALOGUES_BEGINNER_INTERMEDIATE, id: "dlg_greetings_introductions", line: 3, level: "A0" },
  { dialogues: DIALOGUES_BEGINNER_INTERMEDIATE, id: "dlg_grocery_shopping_market", line: 1, level: "A1" },
  { dialogues: DIALOGUES_BEGINNER_INTERMEDIATE, id: "dlg_grocery_shopping_market", line: 7, level: "A1" },
  { dialogues: DIALOGUES_BEGINNER_INTERMEDIATE, id: "dlg_renting_piso", line: 0, level: "A2" },
  { dialogues: DIALOGUES_BEGINNER_INTERMEDIATE, id: "dlg_renting_piso", line: 6, level: "A2" },
  { dialogues: DIALOGUES_BEGINNER_INTERMEDIATE, id: "dlg_banking_account", line: 1, level: "B1" },
  { dialogues: DIALOGUES_BEGINNER_INTERMEDIATE, id: "dlg_workplace_interactions", line: 4, level: "B1" },
  { dialogues: DIALOGUES_ADVANCED, id: "dlg_adv_debate_teletrabajo", line: 2, level: "B2" },
  { dialogues: DIALOGUES_ADVANCED, id: "dlg_adv_logistica_evento", line: 1, level: "B2" }
];

const LEVEL_ORDER = ["A0", "A1", "A2", "B1", "B2", "C1"];

function buildPromptBank() {
  const bank = [];
  PROMPT_SOURCES.forEach((src) => {
    const dlg = src.dialogues.find((d) => d.id === src.id);
    const line = dlg && dlg.lines && dlg.lines[src.line];
    if (line && line.es) {
      bank.push({
        id: `spktest_${src.id}_${src.line}`,
        es: line.es,
        en: line.en || "",
        level: src.level
      });
    }
  });
  // Defensive fallback in the unlikely case the dialogue shape ever changes
  // underneath us — still real content, just sourced from vocabulary examples
  // instead, so the test never renders empty.
  if (bank.length < 6) {
    return VOCABULARY.filter((v) => v.exampleEs)
      .slice(0, 10)
      .map((v) => ({ id: `spktest_vocab_${v.id}`, es: v.exampleEs, en: v.exampleEn || "", level: v.level || "A1" }));
  }
  return bank;
}

function scoreToQuality(score) {
  if (score >= 90) return QUALITY.PERFECT;
  if (score >= 75) return QUALITY.EASY;
  if (score >= 60) return QUALITY.GOOD;
  if (score >= 45) return QUALITY.HARD;
  if (score >= 25) return QUALITY.HARD_FAIL;
  return QUALITY.AGAIN;
}

function feedbackFor(score) {
  if (score >= 85) return { emoji: "🌟", cls: "correct", title: "¡Excelente! · Excellent!", note: "Tu frase se acerca muchísimo al objetivo." };
  if (score >= 65) return { emoji: "👍", cls: "correct", title: "¡Muy bien! · Well done!", note: "Se entiende genial — sigue así." };
  if (score >= 40) return { emoji: "🙂", cls: "incorrect", title: "Vas por buen camino · Getting there", note: "Cerca del objetivo. Un poco más de práctica y lo tienes." };
  return { emoji: "💪", cls: "incorrect", title: "Sigue practicando · Keep practicing", note: "No pasa nada — cada intento cuenta para construir fluidez." };
}

function estimateLevel(results) {
  let best = 0;
  results.forEach((r) => {
    const idx = LEVEL_ORDER.indexOf(r.level);
    if (idx >= 0 && r.score >= 55 && idx > best) best = idx;
  });
  return LEVEL_ORDER[best];
}

const SELF_RATE_OPTIONS = [
  { label: "😄 Lo dije con confianza", sub: "I said it confidently", score: 92 },
  { label: "🙂 Más o menos, dudé un poco", sub: "So-so, I hesitated a bit", score: 62 },
  { label: "😕 Me costó bastante", sub: "It was pretty hard for me", score: 32 }
];

export function renderSpeakingTest(container) {
  const canSpeakBase = speechRecognitionSupported();
  const PROMPTS = buildPromptBank();
  const state = {
    started: false,
    idx: 0,
    results: [],
    fallbackForced: false, // set true if the mic is denied mid-test
    summaryShown: false
  };

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎓 Test de expresión oral"),
      el("p", {}, "Speaking Test — escucha cada frase, repítela en voz alta y comprueba tu progreso. Unas 10 frases, de más fácil a más difícil.")
    ])
  );

  const body = el("div", {});
  container.appendChild(body);

  if (!canSpeakBase) {
    body.appendChild(
      el("div", { class: "card", style: "border-left:3px solid var(--gold);margin-bottom:1rem" }, [
        el("p", { style: "margin:0" }, [
          el("strong", {}, "🎙️ Tu navegador no soporta el reconocimiento de voz automático. "),
          "No pasa nada: en cada frase podrás autoevaluarte leyendo el objetivo en voz alta. El test funciona igual de bien así. Para dictado en vivo, prueba con Chrome o Edge en ordenador."
        ])
      ])
    );
  }

  renderIntro();

  function renderIntro() {
    body.innerHTML = "";
    if (!canSpeakBase) {
      body.appendChild(
        el("div", { class: "card", style: "border-left:3px solid var(--gold);margin-bottom:1rem" }, [
          el("p", { style: "margin:0" }, [
            el("strong", {}, "🎙️ Reconocimiento de voz no disponible en este navegador. "),
            "Usarás la autoevaluación guiada en cada frase — funciona perfectamente y no te vas a quedar atascado/a."
          ])
        ])
      );
    }
    body.appendChild(
      el("div", { class: "card pop-in" }, [
        el("div", { class: "card-title" }, "¿Cómo funciona? · How it works"),
        el("ul", { style: "margin:.3rem 0 1rem;padding-left:1.2rem;line-height:1.7" }, [
          el("li", {}, `Vas a ver ${PROMPTS.length} frases en español, de nivel A0 a B2, cada vez un poco más difíciles.`),
          el("li", {}, "Para cada una: escucha el audio, y luego repítela en voz alta."),
          el("li", {}, canSpeakBase
            ? "Si tu navegador lo permite, grabaremos tu voz un momento y la compararemos con la frase objetivo."
            : "Como el dictado en vivo no está disponible, te autoevaluarás con tres botones sencillos después de repetir en voz alta."),
          el("li", {}, "No hay respuestas 'mal' — solo feedback para ayudarte a mejorar. Al final verás tu puntuación media y un nivel estimado.")
        ]),
        el("p", { class: "text-muted", style: "margin:0 0 1rem" }, "Si usas el micrófono, tu navegador puede pedirte permiso — acéptalo para el modo de dictado en vivo, o simplemente sigue con la autoevaluación si prefieres no usarlo."),
        el("div", { class: "btn-row" }, [
          el("button", {
            class: "btn btn-primary btn-lg",
            onclick: () => {
              state.started = true;
              renderPrompt();
            }
          }, "▶ Empezar el test"),
          el("a", { class: "btn btn-ghost", href: "#/dashboard" }, "← Volver al panel")
        ])
      ])
    );
  }

  function useFallbackFor(prompt, localForce) {
    return !canSpeakBase || state.fallbackForced || localForce;
  }

  function renderPrompt() {
    if (state.idx >= PROMPTS.length) {
      renderSummary();
      return;
    }
    const prompt = PROMPTS[state.idx];
    body.innerHTML = "";

    body.appendChild(progressBar(Math.round((state.idx / PROMPTS.length) * 100), { label: `Frase ${state.idx + 1} de ${PROMPTS.length}` }));

    let localSelfRate = false; // "prefiero autoevaluarme" for just this one sentence
    let listening = false;
    let attempts = 0;

    const card = el("div", { class: "card pop-in", style: "margin-top:1rem" });
    card.appendChild(el("span", { class: "badge badge-level" }, `Nivel ${prompt.level}`));
    card.appendChild(el("p", { class: "es-text-lg", style: "margin:.6rem 0 .2rem" }, prompt.es));
    if (prompt.en) card.appendChild(el("p", { class: "text-muted", style: "margin:0 0 .8rem" }, prompt.en));

    card.appendChild(
      el("div", { class: "btn-row" }, [
        el("button", { class: "btn", onclick: () => audioEngine.speak(prompt.es) }, "🔊 Escuchar"),
        el("button", { class: "btn", onclick: () => audioEngine.speakSlow(prompt.es) }, "🐢 Escuchar despacio")
      ])
    );

    const attemptArea = el("div", { style: "margin-top:1rem" });
    card.appendChild(attemptArea);
    body.appendChild(card);

    paintAttemptArea();

    function paintAttemptArea() {
      attemptArea.innerHTML = "";
      if (useFallbackFor(prompt, localSelfRate)) {
        paintSelfRate();
      } else {
        paintLiveMic();
      }
    }

    function paintLiveMic() {
      const status = el("p", { class: "text-muted", style: "margin:.4rem 0" }, "Cuando estés listo/a, repite la frase en voz alta y pulsa grabar.");
      const micBtn = el("button", { class: "btn btn-primary btn-lg", onclick: onMicClick }, "🎤 Grabar mi voz");
      const switchLink = el("button", {
        class: "btn btn-ghost btn-sm",
        onclick: () => { localSelfRate = true; paintAttemptArea(); }
      }, "✍️ Prefiero autoevaluarme en esta frase");

      attemptArea.appendChild(status);
      attemptArea.appendChild(el("div", { class: "btn-row" }, [micBtn, switchLink]));

      async function onMicClick() {
        if (listening) return;
        listening = true;
        micBtn.disabled = true;
        micBtn.textContent = "🎙️ Escuchando...";
        status.textContent = "Habla ahora, en español...";
        const timeoutMs = Math.min(12000, 5000 + prompt.es.split(/\s+/).length * 500);
        const res = await listenOnce({ timeoutMs });
        listening = false;

        if (!res.supported) {
          toast("El reconocimiento de voz no está disponible ahora mismo. Usaremos la autoevaluación.", { icon: "ℹ️" });
          state.fallbackForced = true;
          paintAttemptArea();
          return;
        }
        if (res.error === "not-allowed" || res.error === "service-not-allowed") {
          toast("Permiso de micrófono denegado. No pasa nada — sigues con la autoevaluación.", { icon: "🎙️" });
          state.fallbackForced = true;
          paintAttemptArea();
          return;
        }
        attempts++;
        if (!res.transcript) {
          micBtn.disabled = false;
          micBtn.textContent = "🎤 Grabar mi voz";
          status.textContent = attempts >= 2
            ? "No detectamos tu voz de nuevo. Puedes intentarlo una vez más o autoevaluarte."
            : "No se detectó voz. Acércate al micrófono e inténtalo otra vez.";
          if (attempts >= 2) {
            attemptArea.appendChild(el("button", { class: "btn btn-ghost btn-sm", onclick: () => { localSelfRate = true; paintAttemptArea(); } }, "✍️ Autoevaluarme en su lugar"));
          }
          return;
        }
        const score = textSimilarity(res.transcript, prompt.es);
        recordResult(prompt, score, res.transcript, "live");
      }
    }

    function paintSelfRate() {
      attemptArea.appendChild(el("p", { class: "text-muted", style: "margin:.4rem 0" }, "Repite la frase en voz alta y luego dinos cómo te ha ido:"));
      const row = el("div", { class: "btn-row", style: "flex-direction:column;align-items:stretch;gap:.5rem" });
      SELF_RATE_OPTIONS.forEach((opt) => {
        row.appendChild(
          el("button", {
            class: "btn",
            style: "text-align:left",
            onclick: () => recordResult(prompt, opt.score, null, "self")
          }, [el("div", {}, opt.label), el("div", { class: "text-faint", style: "font-size:.8rem" }, opt.sub)])
        );
      });
      attemptArea.appendChild(row);
    }

    function recordResult(promptRef, score, transcript, source) {
      state.results.push({ level: promptRef.level, es: promptRef.es, score, transcript, source });
      gradeItem(promptRef.id, "speaking", scoreToQuality(score));
      addXP(score >= 60 ? 5 : 3, "Test de expresión oral");
      updateSkillScore("speaking", score >= 70 ? 1.2 : score >= 40 ? 0.4 : -0.2);

      const fb = feedbackFor(score);
      attemptArea.innerHTML = "";
      if (transcript) {
        attemptArea.appendChild(el("p", {}, [el("strong", {}, "Te oí: "), `"${transcript}"`]));
      }
      attemptArea.appendChild(
        el("div", { class: `feedback-block ${fb.cls}` }, [
          el("div", { style: "font-weight:700" }, `${fb.emoji} ${fb.title}`),
          el("div", { style: "margin-top:.25rem" }, fb.note),
          el("div", { class: "text-faint", style: "margin-top:.4rem;font-size:.85rem" }, `Coincidencia con el objetivo: ${score}%`)
        ])
      );
      attemptArea.appendChild(
        el("button", {
          class: "btn btn-success btn-lg",
          style: "margin-top:.8rem",
          onclick: () => { state.idx++; renderPrompt(); }
        }, state.idx === PROMPTS.length - 1 ? "Ver mi resultado final →" : "Siguiente frase →")
      );
    }
  }

  function renderSummary() {
    if (state.summaryShown) return;
    state.summaryShown = true;
    body.innerHTML = "";

    const results = state.results;
    const avg = results.length ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length) : 0;
    const level = estimateLevel(results);
    const liveCount = results.filter((r) => r.source === "live").length;
    const selfCount = results.length - liveCount;

    const finalDelta = Math.max(1, Math.round((avg / 100) * 6));
    updateSkillScore("speaking", finalDelta);
    addXP(15 + (avg >= 80 ? 10 : avg >= 60 ? 5 : 0), "Test de expresión oral completado");
    if (avg >= 70) confettiBurst();

    body.appendChild(
      el("div", { class: "card pop-in", style: "text-align:center" }, [
        el("div", { style: "font-size:2.4rem" }, avg >= 70 ? "🎉" : "🌱"),
        el("p", { class: "text-muted", style: "margin:.2rem 0 0" }, "Puntuación media · Average accuracy"),
        el("h2", { style: "margin:.2rem 0;font-size:2.4rem" }, `${avg}%`),
        el("span", { class: "badge badge-gold" }, `Nivel estimado: ${level}`),
        el("p", { class: "text-muted", style: "margin-top:.6rem" },
          avg >= 70
            ? "¡Muy buen trabajo! Tu pronunciación y fluidez van muy bien encaminadas."
            : "Buen esfuerzo completando el test entero — la práctica constante es lo que marca la diferencia."),
        el("p", { class: "text-faint", style: "font-size:.85rem;margin-top:.4rem" }, `🎤 ${liveCount} grabadas en vivo · ✍️ ${selfCount} autoevaluadas`)
      ])
    );

    const detail = el("div", { class: "card", style: "margin-top:1rem" }, [el("div", { class: "card-title" }, "Tus frases · Your sentences")]);
    results.forEach((r) => {
      detail.appendChild(
        el("div", { style: "padding:.55rem 0;border-bottom:1px solid var(--border)" }, [
          el("div", { class: "flex justify-between items-center", style: "display:flex;justify-content:space-between;gap:.5rem" }, [
            el("span", { class: "badge badge-level" }, r.level),
            el("span", { class: "badge badge-default" }, `${r.score}% ${r.source === "self" ? "· autoevaluado" : ""}`)
          ]),
          el("p", { class: "es-text", style: "margin:.3rem 0 0" }, r.es),
          r.transcript ? el("p", { class: "text-faint", style: "margin:.15rem 0 0" }, `Te oí: "${r.transcript}"`) : null
        ].filter(Boolean))
      );
    });
    body.appendChild(detail);

    body.appendChild(
      el("div", { class: "btn-row", style: "margin-top:1rem" }, [
        el("button", {
          class: "btn btn-primary",
          onclick: () => {
            state.idx = 0;
            state.results = [];
            state.summaryShown = false;
            renderPrompt();
          }
        }, "🔁 Repetir el test"),
        el("a", { class: "btn btn-success", href: "#/dashboard" }, "Volver al panel →")
      ])
    );
  }
}
