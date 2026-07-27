import { store } from "../core/storage.js";
import { el, toast } from "../core/ui.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { WRITING_PROMPTS } from "../data/writing.js";

const COMMON_ERROR_PATTERNS = [
  { re: /\bmuy bueno\b/i, note: "\"Muy bueno\" es correcto, pero en España a menudo se prefiere \"muy bien\" con verbos o \"buenísimo\" para énfasis." },
  { re: /\bhabemos\b/i, note: "\"Habemos\" no es estándar; usa \"somos\" o \"hay\" según el contexto." },
  { re: /\byo soy tener\b/i, note: "No combines \"ser\" + infinitivo de \"tener\" así — revisa la conjugación del verbo." },
  { re: /\bmucho gente\b/i, note: "\"Gente\" es femenino singular: di \"mucha gente\"." },
  { re: /\bun problema grande\b/i, note: "Con \"problema\" (masculino aunque termine en -a) el adjetivo va en masculino: \"un gran problema\" o \"un problema grande\" — ambas son válidas, pero \"gran\" antes del sustantivo suena más natural." }
];

function heuristicFeedback(text, prompt) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const notes = [];
  if (wordCount < prompt.minWords) {
    notes.push(`Tu texto tiene ${wordCount} palabras; el objetivo es al menos ${prompt.minWords}. Intenta desarrollar más tus ideas.`);
  } else {
    notes.push(`Buena extensión: ${wordCount} palabras (objetivo: ${prompt.minWords}+).`);
  }
  prompt.checklist.forEach((item) => {
    notes.push(`☐ Revisa: ${item}`);
  });
  COMMON_ERROR_PATTERNS.forEach((p) => {
    if (p.re.test(text)) notes.push(`⚠️ Posible error: ${p.note}`);
  });
  const hasPreterite = /\b(fui|hice|comí|hablé|vi|dijo|fueron|hicimos|salió|llegó)\b/i.test(text);
  const hasConnectors = /(porque|pero|aunque|además|por eso|sin embargo|entonces)/i.test(text);
  if (!hasConnectors) notes.push("💡 Sugerencia: usa conectores (porque, pero, sin embargo, además) para enlazar tus ideas y sonar más natural.");
  return { wordCount, notes, hasPreterite, hasConnectors };
}

export function renderWriting(container) {
  const state = { level: "all" };
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "✍️ Sistema de escritura"),
      el("p", {}, "Diarios, opiniones, narraciones y escritura guiada — con autocorrección orientativa basada en tu propio checklist.")
    ])
  );

  const levels = ["all", ...new Set(WRITING_PROMPTS.map((p) => p.level))];
  const pills = el(
    "div",
    { class: "level-pills" },
    levels.map((l) =>
      el("button", { class: `level-pill ${state.level === l ? "active" : ""}`, onclick: () => { state.level = l; renderList(); } }, l === "all" ? "Todos" : l)
    )
  );
  container.appendChild(pills);

  const list = el("div", { class: "grid grid-2" });
  container.appendChild(list);

  function renderList() {
    list.innerHTML = "";
    pills.querySelectorAll(".level-pill").forEach((b, i) => b.classList.toggle("active", levels[i] === state.level));
    WRITING_PROMPTS.filter((p) => state.level === "all" || p.level === state.level).forEach((p) => list.appendChild(promptCard(p)));
  }

  function promptCard(p) {
    const submitted = store.state.progress.writingSubmissions.some((s) => s.promptId === p.id);
    const card = el("div", { class: "card" }, [
      el("div", { class: "flex justify-between items-center" }, [
        el("span", { class: "badge badge-level" }, p.level),
        el("span", { class: "badge badge-default" }, p.type),
        submitted ? el("span", { class: "badge badge-success" }, "✓ Enviado") : null
      ].filter(Boolean)),
      el("h3", { style: "margin:.5rem 0" }, p.title),
      el("p", { class: "text-muted" }, p.prompt),
      el("p", { class: "text-faint", style: "font-size:.78rem" }, `Mínimo ${p.minWords} palabras`)
    ]);
    const textarea = el("textarea", { placeholder: "Escribe tu respuesta en español...", style: "width:100%;min-height:150px" });
    const feedbackWrap = el("div", { style: "margin-top:.75rem" });
    card.appendChild(textarea);
    card.appendChild(
      el("div", { class: "btn-row", style: "margin-top:.5rem" }, [
        el(
          "button",
          {
            class: "btn btn-primary",
            onclick: () => {
              const text = textarea.value.trim();
              if (!text) {
                toast("Escribe algo primero.", { icon: "✏️" });
                return;
              }
              const fb = heuristicFeedback(text, p);
              feedbackWrap.innerHTML = "";
              feedbackWrap.appendChild(el("div", { class: "card-title", style: "font-size:.9rem" }, "Retroalimentación"));
              feedbackWrap.appendChild(el("ul", {}, fb.notes.map((n) => el("li", {}, n))));
              const good = fb.wordCount >= p.minWords;
              store.state.progress.writingSubmissions.push({
                id: `ws_${Date.now()}`,
                promptId: p.id,
                text,
                wordCount: fb.wordCount,
                date: Date.now()
              });
              addXP(good ? 12 : 5, "Escritura");
              updateSkillScore("vocabulary", good ? 1.5 : 0.3);
              store.save();
              toast(good ? "¡Buen trabajo! Redacción enviada." : "Redacción registrada — sigue practicando.", { icon: "✍️" });
            }
          },
          "Enviar y recibir retroalimentación"
        ),
        el(
          "button",
          {
            class: "btn btn-ghost",
            onclick: () => {
              feedbackWrap.innerHTML = "";
              feedbackWrap.appendChild(el("div", { class: "card-title", style: "font-size:.9rem" }, "Respuesta modelo"));
              feedbackWrap.appendChild(el("p", { style: "font-family:var(--font-es)" }, p.modelAnswer));
            }
          },
          "Ver respuesta modelo"
        )
      ])
    );
    card.appendChild(feedbackWrap);
    return card;
  }

  renderList();
}
