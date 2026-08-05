import { el, blurActive } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { gradeItem, QUALITY } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { GRAMMAR } from "../data/grammar.js";
import { checkSpanish } from "../data/mistakePatterns.js";
import { correctionBlock, inlineCorrection } from "../core/feedback.js";

function scheduleReview(hits) {
  hits.forEach((hit) => {
    if (hit.relatedGrammarId) gradeItem(`gram_${hit.relatedGrammarId}`, "grammar", QUALITY.AGAIN);
  });
}

const SCENARIOS = [
  {
    id: "cafe",
    title: "En la cafetería",
    level: "A1-A2",
    lines: [
      "¡Hola! ¿Qué te pongo?",
      "Muy bien. ¿Para tomar aquí o para llevar?",
      "Perfecto, ahora mismo te lo traigo. ¿Algo más?",
      "Vale, son tres euros con veinte. ¿Cómo vas a pagar?"
    ]
  },
  {
    id: "meeting",
    title: "Conociendo a alguien nuevo",
    level: "A1-A2",
    lines: ["¡Hola! No nos conocemos, ¿verdad? ¿Cómo te llamas?", "Encantado/a. ¿De dónde eres?", "¡Qué interesante! ¿Y a qué te dedicas?", "Oye, ¿te apetece quedar para tomar algo un día de estos?"]
  },
  {
    id: "problem",
    title: "Explicando un problema",
    level: "B1-B2",
    lines: [
      "Buenos días, ¿en qué puedo ayudarle?",
      "Entiendo. ¿Puede explicarme exactamente qué ha pasado, con todos los detalles?",
      "Ya veo. ¿Y qué solución le gustaría encontrar?",
      "De acuerdo, voy a ver qué puedo hacer. ¿Algo más que deba saber?"
    ]
  }
];

export function renderTutor(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🤖 Tutor IA"),
      el(
        "p",
        {},
        "Tres herramientas para aprender de tus errores: un buscador de gramática, un corrector de frases, y práctica de conversación guiada. Funciona completamente en tu navegador — sin conexión externa."
      )
    ])
  );

  const tabs = el("div", { class: "tabs" }, [tabBtn("qa", "Pregunta de gramática"), tabBtn("checker", "Corrector de frases"), tabBtn("chat", "Conversación guiada")]);
  container.appendChild(tabs);
  const body = el("div", {});
  container.appendChild(body);
  let current = "qa";
  function tabBtn(id, label) {
    const b = el("button", { class: `tab-btn ${id === "qa" ? "active" : ""}`, onclick: () => setTab(id) }, label);
    b.dataset.id = id;
    return b;
  }
  function setTab(id) {
    current = id;
    tabs.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.id === id));
    body.innerHTML = "";
    if (id === "qa") body.appendChild(renderQA());
    else if (id === "checker") body.appendChild(renderChecker());
    else body.appendChild(renderChat());
  }

  function renderQA() {
    const wrap = el("div", {});
    const input = el("input", { type: "search", placeholder: "Escribe tu pregunta, p.ej. '¿cuándo uso el subjuntivo?'", style: "width:100%;padding:.7rem .9rem;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--text)" });
    const results = el("div", { class: "grid grid-2", style: "margin-top:1rem" });
    wrap.appendChild(input);
    wrap.appendChild(results);
    function search() {
      const q = input.value.trim().toLowerCase();
      results.innerHTML = "";
      if (!q) return;
      const terms = q.split(/\s+/).filter((t) => t.length > 2);
      const matches = GRAMMAR.map((g) => {
        const hay = `${g.title} ${g.simpleExplanation} ${g.detailedExplanation} ${g.englishComparison}`.toLowerCase();
        const score = terms.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
        return { g, score };
      })
        .filter((m) => m.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
      if (!matches.length) {
        results.appendChild(el("div", { class: "empty-state" }, "No encontré ningún concepto relacionado — prueba con otras palabras clave, o explora el Laboratorio de Gramática directamente."));
        return;
      }
      matches.forEach(({ g }) => {
        results.appendChild(
          el("div", { class: "card" }, [
            el("span", { class: "badge badge-level" }, g.level),
            el("h3", { style: "margin:.4rem 0" }, g.title),
            el("p", {}, g.simpleExplanation),
            el("a", { class: "btn btn-sm", href: `#/grammar/${g.id}` }, "Ver lección completa →")
          ])
        );
      });
    }
    input.addEventListener("input", search);
    wrap.appendChild(el("p", { class: "text-faint", style: "margin-top:1rem" }, "Prueba: \"ser estar\", \"pasado\", \"subjuntivo\", \"vosotros\", \"comparar\"..."));
    return wrap;
  }

  function renderChecker() {
    const wrap = el("div", {});
    wrap.appendChild(el("p", { class: "text-muted" }, "Escribe una frase en español (o pega algo que hayas escrito) y te señalaré errores frecuentes de anglohablantes, con la regla y ejemplos."));
    const textarea = el("textarea", { placeholder: "Ej: Yo soy cansado y tengo mucho gente en mi casa...", style: "width:100%;min-height:100px" });
    const resultsWrap = el("div", { style: "margin-top:1rem" });
    wrap.appendChild(textarea);
    wrap.appendChild(
      el(
        "button",
        {
          class: "btn btn-primary",
          style: "margin-top:.6rem",
          onclick: () => {
            blurActive();
            const hits = checkSpanish(textarea.value);
            resultsWrap.innerHTML = "";
            const block = correctionBlock(textarea.value);
            if (!block) {
              resultsWrap.appendChild(
                el("div", { class: "feedback-block correct" }, "No he detectado ninguno de los errores comunes que reconozco. ¡Sigue así! (Esto no garantiza que la frase sea 100% perfecta — es un corrector de patrones frecuentes, no una IA completa.)")
              );
              return;
            }
            resultsWrap.appendChild(block);
            resultsWrap.appendChild(el("p", { class: "text-faint", style: "margin-top:.5rem" }, "Estos puntos se han añadido a tu repetición espaciada (SRS) para reforzarlos automáticamente."));
            scheduleReview(hits);
            addXP(5, "Corrector de frases");
            updateSkillScore("grammar", 0.5);
          }
        },
        "Corregir mi frase"
      )
    );
    wrap.appendChild(resultsWrap);
    return wrap;
  }

  function renderChat() {
    const wrap = el("div", {});
    const scenarioPicker = el(
      "div",
      { class: "level-pills" },
      SCENARIOS.map((s) => el("button", { class: "level-pill", onclick: () => startScenario(s) }, `${s.title} (${s.level})`))
    );
    wrap.appendChild(el("p", { class: "text-muted" }, "Elige un escenario. El tutor hablará en español (con audio); tú escribes o dices tu respuesta, y te doy retroalimentación inmediata."));
    wrap.appendChild(scenarioPicker);
    const chatArea = el("div", { style: "margin-top:1rem" });
    wrap.appendChild(chatArea);

    function startScenario(s) {
      chatArea.innerHTML = "";
      let step = 0;
      const log = el("div", { class: "flex-col gap-1" });
      chatArea.appendChild(log);
      const inputRow = el("div", { class: "btn-row", style: "margin-top:.75rem" });
      const input = el("input", { type: "text", placeholder: "Escribe tu respuesta en español...", style: "flex:1;padding:.6rem .9rem;border-radius:8px;border:1px solid var(--border);background:var(--surface-2);color:var(--text)" });
      const sendBtn = el("button", { class: "btn btn-primary", onclick: sendReply }, "Enviar");
      inputRow.appendChild(input);
      inputRow.appendChild(sendBtn);
      chatArea.appendChild(inputRow);

      function botSay(text) {
        log.appendChild(el("div", { class: "dialogue-line" }, [el("div", { class: "speaker-tag" }, "Tutor"), el("div", { class: "line-content line-es" }, text)]));
        audioEngine.speak(text);
      }
      function userSay(text) {
        log.appendChild(el("div", { class: "dialogue-line me" }, [el("div", { class: "speaker-tag" }, "Tú"), el("div", { class: "line-content line-es" }, text)]));
      }
      function sendReply() {
        const text = input.value.trim();
        if (!text) return;
        userSay(text);
        input.value = "";
        const hits = checkSpanish(text);
        const inline = inlineCorrection(text);
        if (inline) log.appendChild(inline);
        scheduleReview(hits);
        addXP(4, "Conversación guiada");
        updateSkillScore("speaking", 1);
        step++;
        if (step < s.lines.length) {
          setTimeout(() => botSay(s.lines[step]), 400);
        } else {
          setTimeout(() => log.appendChild(el("div", { class: "feedback-block correct" }, "¡Buen trabajo! Has completado esta conversación. Elige otro escenario para seguir practicando.")), 400);
          inputRow.classList.add("hidden");
        }
      }
      input.addEventListener("keydown", (e) => e.key === "Enter" && sendReply());
      botSay(s.lines[0]);
    }
    return wrap;
  }

  setTab("qa");
}
