// ACTFL SPEAKING TEST MODE — OPI PRACTICE. Simulates an ACTFL Oral
// Proficiency Interview: warm-up, level checks, topic development,
// narration, description, opinion discussion, advanced tasks. Afterward:
// estimated ACTFL level, strengths, weaknesses, and an improvement plan.
//
// This is a fully client-side, rule-based heuristic (word count, sentence
// count, past-tense usage, connector/subjunctive complexity, and the same
// mistake-pattern detector as Writing Coach) — not a live AI grader — but it
// gives a consistent, explainable estimate you can track over time.

import { store, todayISO } from "../core/storage.js";
import { el, toast, blurActive } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { checkText } from "../data/mistakePatterns.js";
import { ACTFL_LEVELS } from "../data/roadmap.js";

const STAGES = [
  { key: "warmup", title: "Warm-up", es: "Preséntate: ¿cómo te llamas, de dónde eres y a qué te dedicas?", en: "Introduce yourself: what's your name, where are you from, what do you do?" },
  { key: "levelcheck1", title: "Level check", es: "Cuéntame sobre tu familia: ¿cuántos son, y qué hace cada quién?", en: "Tell me about your family: how many are there, and what does each person do?" },
  { key: "levelcheck2", title: "Level check", es: "Describe tu rutina de un día típico entre semana, de principio a fin.", en: "Describe your typical weekday routine, start to finish." },
  { key: "narration", title: "Narration", es: "Cuéntame sobre un viaje, evento o día memorable — ¿qué pasó, paso por paso?", en: "Tell me about a memorable trip, event, or day — what happened, step by step?" },
  { key: "description", title: "Description", es: "Describe tu casa, tu barrio o tu ciudad con el mayor detalle posible.", en: "Describe your house, neighborhood, or city in as much detail as possible." },
  { key: "opinion", title: "Opinion discussion", es: "¿Qué opinas de trabajar desde casa comparado con ir a una oficina? Da tus razones.", en: "What's your opinion on working from home vs. going to an office? Give your reasons." },
  { key: "advanced", title: "Advanced task", es: "Explica las causas y los efectos de un problema social que te importe, y defiende tu punto de vista.", en: "Explain the causes and effects of a social issue you care about, and defend your point of view." }
];

const PAST_TENSE_RE = /\b\w*(é|aste|ó|amos|asteis|aron|í|iste|ió|imos|isteis|ieron|aba|abas|ábamos|abais|aban|ía|ías|íamos|íais|ían)\b/i;
const CONNECTOR_RE = /\b(aunque|sin embargo|por un lado|por otro|además|mientras que|ya que|porque|por lo tanto|en resumen|si\s+\w+(ra|se|ría))\b/i;

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
  return { score: Math.max(0, Math.min(100, Math.round(score))), words: words.length, sentences: sentences.length, hasPast, hasConnector, mistakes };
}

export function renderOpi(container) {
  let idx = 0;
  const responses = [];

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎓 OPI Practice"),
      el("p", {}, "A simulated ACTFL Oral Proficiency Interview: warm-up → level checks → topic development → narration → description → opinion discussion → advanced tasks. Type (or speak, then transcribe) full responses — the more you write, the more accurate the estimate.")
    ])
  );

  const progress = el("p", { class: "text-muted" });
  container.appendChild(progress);
  const body = el("div", {});
  container.appendChild(body);

  render();

  function render() {
    if (idx >= STAGES.length) return renderReport();
    progress.textContent = `Stage ${idx + 1} of ${STAGES.length}: ${STAGES[idx].title}`;
    body.innerHTML = "";
    const stage = STAGES[idx];
    const card = el("div", { class: "card" }, [
      el("span", { class: "badge badge-default" }, stage.title),
      el("div", { class: "flex justify-between items-center", style: "margin-top:.4rem" }, [
        el("p", { class: "es-text", style: "font-size:1.1rem;font-weight:700" }, stage.es),
        el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(stage.es) }, "🔊")
      ]),
      el("p", { class: "text-muted" }, stage.en)
    ]);
    const ta = el("textarea", { placeholder: "Responde en español, en un párrafo si puedes..." });
    card.appendChild(ta);
    card.appendChild(
      el("button", {
        class: "btn btn-primary",
        onclick: () => {
          const text = ta.value.trim();
          if (text.length < 3) { toast("Write a response before continuing.", { type: "error" }); return; }
          blurActive();
          responses.push({ stage: stage.key, text, ...scoreResponse(text) });
          idx++;
          render();
        }
      }, idx === STAGES.length - 1 ? "Finish interview" : "Next question →")
    );
    body.appendChild(card);
  }

  function renderReport() {
    progress.textContent = "";
    body.innerHTML = "";

    const stageLevels = ACTFL_LEVELS; // 7 stages, 7 levels, 1:1 mapping
    let ceilingIdx = 0;
    responses.forEach((r, i) => {
      if (r.score >= 55) ceilingIdx = i;
    });
    const estimated = stageLevels[ceilingIdx];

    const sorted = [...responses].sort((a, b) => b.score - a.score);
    const strong = sorted.slice(0, 2);
    const weak = [...responses].sort((a, b) => a.score - b.score).slice(0, 2);

    const tips = weak.map((r) => {
      const stage = STAGES.find((s) => s.key === r.stage);
      if (!r.hasPast) return `${stage.title}: practice narrating with a mix of preterite (single completed events) and imperfect (background/habits).`;
      if (!r.hasConnector) return `${stage.title}: add connectors like aunque, por un lado/por otro, sin embargo, en resumen to build paragraph-length discourse.`;
      if (r.words < 25) return `${stage.title}: try to answer in fuller paragraphs — aim for at least 4-5 connected sentences.`;
      return `${stage.title}: review the vocabulary and sentence patterns for this topic, then retry.`;
    });

    body.appendChild(
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "📊 Estimated ACTFL level"),
        el("p", { style: "font-size:1.3rem;font-weight:800" }, `${estimated.label} (${estimated.short})`),
        el("p", { class: "text-muted" }, estimated.blurb)
      ])
    );

    body.appendChild(
      el("div", { class: "grid grid-2", style: "margin-top:1rem" }, [
        el("div", { class: "card" }, [
          el("div", { class: "card-title" }, "💪 Strengths"),
          el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" }, strong.map((r) => {
            const stage = STAGES.find((s) => s.key === r.stage);
            return el("li", {}, `${stage.title} (score ${r.score}/100)`);
          }))
        ]),
        el("div", { class: "card" }, [
          el("div", { class: "card-title" }, "🎯 Weaknesses"),
          el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" }, weak.map((r) => {
            const stage = STAGES.find((s) => s.key === r.stage);
            return el("li", {}, `${stage.title} (score ${r.score}/100)`);
          }))
        ])
      ])
    );

    body.appendChild(
      el("div", { class: "card", style: "margin-top:1rem" }, [
        el("div", { class: "card-title" }, "📈 Improvement plan"),
        el("ul", { style: "margin:.3rem 0 0;padding-left:1.2rem" }, tips.map((t) => el("li", {}, t)))
      ])
    );

    body.appendChild(
      el("div", { class: "card", style: "margin-top:1rem" }, [
        el("div", { class: "card-title" }, "Stage-by-stage detail"),
        ...responses.map((r) => {
          const stage = STAGES.find((s) => s.key === r.stage);
          return el("div", { style: "padding:.5rem 0;border-bottom:1px solid var(--border)" }, [
            el("div", { class: "flex justify-between items-center" }, [
              el("strong", {}, stage.title),
              el("span", { class: "badge badge-default" }, `${r.score}/100`)
            ]),
            el("p", { class: "es-text", style: "margin:.3rem 0" }, r.text)
          ]);
        })
      ])
    );

    body.appendChild(el("button", { class: "btn btn-primary", style: "margin-top:1rem", onclick: retake }, "Take another OPI Practice"));

    registerStudyToday();
    store.state.progress.opiSessions.push({ date: todayISO(), estimatedLevel: estimated.code, strengths: strong.map((r) => r.stage), weaknesses: weak.map((r) => r.stage) });
    updateSkillScore("speaking", 3);
    addXP(25, "OPI Practice completed");
    store.save();
    toast("OPI Practice complete! +25 XP", { type: "xp", icon: "⚡" });

    function container_prepend() {}
  }

  function retake() {
    idx = 0;
    responses.length = 0;
    render();
  }
}
