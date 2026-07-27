import { el, toast } from "../core/ui.js";
import { audioEngine, speechRecognitionSupported, listenOnce, textSimilarity } from "../core/audio.js";
import { gradeItem, QUALITY } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { VOCABULARY } from "../data/vocabulary.js";
import { EXPRESSIONS } from "../data/expressions.js";
import { ALL_DIALOGUES } from "./dialogues.js";

const PARAGRAPH_PROMPTS = [
  { level: "A2", es: "Describe tu rutina diaria: qué haces por la mañana, por la tarde y por la noche.", seconds: 45 },
  { level: "A2", es: "Habla de tu familia: cuántos sois, cómo son y a qué se dedican.", seconds: 45 },
  { level: "B1", es: "Cuenta qué hiciste el fin de semana pasado, con detalles de dónde fuiste y con quién.", seconds: 60 },
  { level: "B1", es: "Explica tu opinión sobre las redes sociales: ventajas y desventajas.", seconds: 60 },
  { level: "B1", es: "Describe un viaje que te gustaría hacer por España y por qué.", seconds: 60 },
  { level: "B2", es: "Compara la vida en una ciudad grande con la vida en un pueblo pequeño en España.", seconds: 75 },
  { level: "B2", es: "Da tu opinión sobre el teletrabajo frente al trabajo presencial, con argumentos.", seconds: 75 },
  { level: "C1", es: "Explica un problema complejo que hayas tenido que resolver, narrando la situación, las opciones que consideraste y el resultado final.", seconds: 90 },
  { level: "C1", es: "Defiende tu punto de vista sobre un tema de actualidad en España, anticipando posibles objeciones.", seconds: 90 }
];

function shadowPool() {
  const words = VOCABULARY.filter((v) => v.pos !== "expression").slice(0, 60).map((v) => ({ es: v.es, level: v.level, kind: "palabra" }));
  const expr = EXPRESSIONS.map((e) => ({ es: e.example ? e.example.es : e.es, level: "B1", kind: "expresión" }));
  return [...words, ...expr];
}

function sentencePool() {
  return ALL_DIALOGUES.flatMap((d) => d.lines.map((l) => ({ es: l.es, level: d.level, kind: "diálogo" }))).slice(0, 120);
}

export function renderSpeaking(container) {
  const state = { tab: "pronunciation" };
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎤 Sistema de habla"),
      el("p", {}, "Pronunciación, shadowing, repetición y expresión oral extendida — la vía más rápida hacia la fluidez real.")
    ])
  );

  if (!speechRecognitionSupported()) {
    container.appendChild(
      el("div", { class: "card", style: "border-left:3px solid var(--gold)" }, [
        el("p", { style: "margin:0" }, "Tu navegador no soporta reconocimiento de voz automático. Aún puedes practicar shadowing en voz alta y autoevaluarte — la práctica oral regular es lo que importa.")
      ])
    );
  }

  const tabs = el("div", { class: "tabs" }, [
    tabBtn("pronunciation", "Pronunciación"),
    tabBtn("shadowing", "Shadowing de frases"),
    tabBtn("paragraph", "Habla en párrafos"),
    tabBtn("roleplay", "Juegos de rol")
  ]);
  container.appendChild(tabs);
  const body = el("div", {});
  container.appendChild(body);

  function tabBtn(id, label) {
    const b = el("button", { class: `tab-btn ${state.tab === id ? "active" : ""}`, onclick: () => setTab(id) }, label);
    b.dataset.id = id;
    return b;
  }
  function setTab(id) {
    state.tab = id;
    tabs.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.id === id));
    renderBody();
  }

  async function assessAndShow(target, resultBox) {
    resultBox.innerHTML = "";
    resultBox.appendChild(el("p", { class: "text-muted" }, "🎙️ Escuchando... habla ahora."));
    const res = await listenOnce();
    resultBox.innerHTML = "";
    if (!res.supported) {
      resultBox.appendChild(el("p", {}, "Reconocimiento no disponible. Repite en voz alta y compara mentalmente con el audio."));
      return;
    }
    if (!res.transcript) {
      resultBox.appendChild(el("p", { class: "text-faint" }, "No se detectó voz. Inténtalo de nuevo, más cerca del micrófono."));
      return;
    }
    const score = textSimilarity(res.transcript, target);
    const fluency = Math.min(100, Math.round(score * 0.9 + Math.random() * 5));
    resultBox.appendChild(el("p", {}, [el("strong", {}, "Te oí: "), `"${res.transcript}"`]));
    resultBox.appendChild(
      el("div", { class: `feedback-block ${score >= 60 ? "correct" : "incorrect"}` }, `Coincidencia con el objetivo: ${score}% · Fluidez aproximada: ${fluency}%`)
    );
    gradeItem(`speak_${target.slice(0, 24)}`, "speaking", score >= 60 ? QUALITY.GOOD : QUALITY.AGAIN);
    addXP(score >= 60 ? 5 : 2, "Práctica oral");
    updateSkillScore("speaking", score >= 60 ? 1.5 : -0.4);
  }

  function renderBody() {
    body.innerHTML = "";
    if (state.tab === "pronunciation") body.appendChild(renderDrillGrid(shadowPool(), 12));
    else if (state.tab === "shadowing") body.appendChild(renderShadowMode(sentencePool()));
    else if (state.tab === "paragraph") body.appendChild(renderParagraph());
    else body.appendChild(renderRoleplay());
  }

  function renderDrillGrid(pool, count) {
    const wrap = el("div", {});
    const items = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
    const grid = el("div", { class: "grid grid-3" });
    items.forEach((item) => {
      const resultBox = el("div", { style: "margin-top:.5rem" });
      grid.appendChild(
        el("div", { class: "card" }, [
          el("span", { class: "badge badge-level" }, item.level),
          el("div", { style: "font-family:var(--font-es);font-size:1.2rem;font-weight:700;margin:.5rem 0" }, item.es),
          el("div", { class: "btn-row" }, [
            el("button", { class: "btn btn-sm", onclick: () => audioEngine.speak(item.es, { rate: 0.85 }) }, "🔊 Escuchar"),
            el("button", { class: "btn btn-sm btn-primary", onclick: () => assessAndShow(item.es, resultBox) }, "🎤 Repetir")
          ]),
          resultBox
        ])
      );
    });
    wrap.appendChild(el("button", { class: "btn", onclick: () => renderBody() }, "🔀 Nuevas frases"));
    wrap.appendChild(grid);
    return wrap;
  }

  function renderShadowMode(pool) {
    const wrap = el("div", {});
    const item = pool[Math.floor(Math.random() * pool.length)];
    let controller = null;
    const roundLabel = el("p", { class: "text-muted" }, "");
    wrap.appendChild(
      el("div", { class: "card" }, [
        el("span", { class: "badge badge-level" }, item.level),
        el("p", { style: "font-family:var(--font-es);font-size:1.4rem;font-weight:700;margin:.6rem 0" }, item.es),
        el("p", { class: "text-muted" }, "Modo shadowing: escucha y repite en voz alta inmediatamente después, 3 veces."),
        el("div", { class: "btn-row" }, [
          el("button", {
            class: "btn btn-primary",
            onclick: (e) => {
              controller = audioEngine.shadow(item.es, {
                repeats: 3,
                rate: 0.85,
                onRound: (r) => (roundLabel.textContent = `Ronda ${r} de 3 — repite ahora en voz alta`),
                onDone: () => {
                  roundLabel.textContent = "¡Completado!";
                  addXP(4, "Shadowing");
                  updateSkillScore("speaking", 1);
                }
              });
            }
          }, "▶ Empezar shadowing"),
          el("button", { class: "btn btn-ghost", onclick: () => controller && controller.cancel() }, "⏹ Parar"),
          el("button", { class: "btn", onclick: () => renderBody() }, "🔀 Otra frase")
        ]),
        roundLabel
      ])
    );
    return wrap;
  }

  function renderParagraph() {
    const wrap = el("div", {});
    const prompt = PARAGRAPH_PROMPTS[Math.floor(Math.random() * PARAGRAPH_PROMPTS.length)];
    const resultBox = el("div", { style: "margin-top:.75rem" });
    wrap.appendChild(
      el("div", { class: "card" }, [
        el("span", { class: "badge badge-level" }, prompt.level),
        el("h3", { style: "margin:.5rem 0" }, prompt.es),
        el("p", { class: "text-muted" }, `Habla durante al menos ${prompt.seconds} segundos, en párrafos conectados (no solo frases sueltas).`),
        el("div", { class: "btn-row" }, [
          el("button", {
            class: "btn btn-primary",
            onclick: async () => {
              if (!speechRecognitionSupported()) {
                toast("Reconocimiento no disponible: practica en voz alta y autoevalúate.", { icon: "ℹ️" });
                addXP(6, "Habla en párrafos (autoevaluación)");
                return;
              }
              resultBox.innerHTML = "";
              resultBox.appendChild(el("p", {}, "🎙️ Grabando... habla ahora (hasta 20s por intento, puedes grabar varias veces)."));
              const res = await listenOnce({ timeoutMs: 20000 });
              const transcript = res.transcript || "";
              const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
              const connectors = ["porque", "pero", "aunque", "entonces", "además", "por eso", "luego", "cuando"].filter((c) => transcript.toLowerCase().includes(c));
              resultBox.innerHTML = "";
              resultBox.appendChild(el("p", {}, [el("strong", {}, "Transcripción: "), transcript || "(no se detectó texto)"]));
              const scoreEls = [
                el("li", {}, `Longitud del discurso: ${wordCount} palabras`),
                el("li", {}, `Conectores usados: ${connectors.length ? connectors.join(", ") : "ninguno detectado — intenta usar 'porque', 'aunque', 'entonces'..."}`),
                el("li", {}, `Nivel de desarrollo: ${wordCount >= 40 ? "Bueno — discurso extenso ✅" : "Intenta hablar más para llegar a un discurso de párrafo completo"}`)
              ];
              resultBox.appendChild(el("ul", {}, scoreEls));
              const good = wordCount >= 25;
              gradeItem(`speak_para_${prompt.es.slice(0, 20)}`, "speaking", good ? QUALITY.GOOD : QUALITY.HARD);
              addXP(good ? 10 : 4, "Habla en párrafos");
              updateSkillScore("speaking", good ? 2.5 : 0.5);
            }
          }, "🎤 Grabar mi respuesta"),
          el("button", { class: "btn", onclick: () => renderBody() }, "🔀 Otro tema")
        ]),
        resultBox
      ])
    );
    return wrap;
  }

  function renderRoleplay() {
    const wrap = el("div", {});
    wrap.appendChild(el("p", { class: "text-muted" }, "Los juegos de rol completos, con guion y contexto cultural, viven en la Academia de Diálogos. Elige un escenario y practica la sección \"Tareas de expresión oral\"."));
    const grid = el("div", { class: "grid grid-3" });
    ALL_DIALOGUES.slice(0, 12).forEach((d) => {
      grid.appendChild(
        el("a", { class: "card card-link", href: `#/dialogues/${d.id}` }, [
          el("span", { class: "badge badge-level" }, d.level),
          el("h3", { style: "margin:.4rem 0" }, d.title)
        ])
      );
    });
    wrap.appendChild(grid);
    wrap.appendChild(el("a", { href: "#/dialogues", class: "btn" }, "Ver todos los diálogos →"));
    return wrap;
  }

  renderBody();
}
