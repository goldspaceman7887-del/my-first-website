import { store } from "../core/storage.js";
import { el } from "../core/ui.js";
import { renderExercise } from "../core/exercises.js";
import { gradeItem, masteryLevel, QUALITY } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { GRAMMAR } from "../data/grammar.js";

function parseQuery() {
  return new URLSearchParams((window.location.hash.split("?")[1]) || "");
}

function recordAttempt(gramId, correct) {
  const g = store.state.progress.grammarAttempts;
  if (!g[gramId]) g[gramId] = { attempts: 0, correct: 0, lastReview: null };
  g[gramId].attempts += 1;
  if (correct) g[gramId].correct += 1;
  g[gramId].lastReview = Date.now();
  gradeItem(`gram_${gramId}`, "grammar", correct ? QUALITY.GOOD : QUALITY.AGAIN);
  addXP(correct ? 4 : 1, "Gramática");
  updateSkillScore("grammar", correct ? 1.2 : -0.6);
  store.save();
}

function accuracyFor(gramId) {
  const g = store.state.progress.grammarAttempts[gramId];
  if (!g || g.attempts === 0) return null;
  return Math.round((g.correct / g.attempts) * 100);
}

export function renderGrammar(container, params) {
  const query = parseQuery();
  const tierFilter = query.get("level"); // beginner | intermediate | advanced

  if (params && params.id) {
    return renderConceptDetail(container, params.id);
  }

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🧠 Laboratorio de gramática"),
      el("p", {}, "La gramática del español de España explicada con claridad: vosotros, leísmo, subjuntivo y todo lo que necesitas para hablar con precisión.")
    ])
  );

  const tiers = [
    { id: "beginner", label: "Principiante" },
    { id: "intermediate", label: "Intermedio" },
    { id: "advanced", label: "Avanzado" }
  ];

  const pills = el(
    "div",
    { class: "level-pills" },
    [{ id: null, label: "Todos" }, ...tiers].map((t) =>
      el(
        "button",
        {
          class: `level-pill ${tierFilter === t.id ? "active" : ""}`,
          onclick: () => {
            window.location.hash = t.id ? `#/grammar?level=${t.id}` : "#/grammar";
          }
        },
        t.label
      )
    )
  );
  container.appendChild(pills);

  tiers.forEach((tier) => {
    if (tierFilter && tierFilter !== tier.id) return;
    const concepts = GRAMMAR.filter((g) => g.tier === tier.id);
    if (!concepts.length) return;
    container.appendChild(el("h2", { style: "margin-top:1.5rem" }, tier.label));
    const grid = el("div", { class: "grid grid-3" });
    concepts.forEach((g) => {
      const acc = accuracyFor(g.id);
      const mastery = masteryLevel(`gram_${g.id}`);
      grid.appendChild(
        el("a", { class: "card card-link", href: `#/grammar/${g.id}` }, [
          el("div", { class: "flex justify-between items-center" }, [
            el("span", { class: "badge badge-level" }, g.level),
            acc !== null ? el("span", { class: "badge badge-success" }, `${acc}%`) : el("span", { class: "badge badge-default" }, "Nuevo")
          ]),
          el("h3", { style: "margin:.5rem 0 .3rem" }, g.title),
          el("p", { class: "text-muted", style: "font-size:.87rem" }, g.simpleExplanation),
          el("div", { class: "progress-bar", style: "margin-top:.5rem" }, [
            el("div", { class: "progress-bar-fill", style: `width:${mastery}%` })
          ])
        ])
      );
    });
    container.appendChild(grid);
  });
}

function renderConceptDetail(container, id) {
  const g = GRAMMAR.find((x) => x.id === id);
  if (!g) {
    container.appendChild(el("div", { class: "card" }, "No se encontró este concepto gramatical."));
    return;
  }
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("a", { href: "#/grammar", class: "text-muted" }, "← Volver a Gramática"),
      el("h1", { style: "margin-top:.5rem" }, g.title),
      el("span", { class: "badge badge-level" }, `Nivel ${g.level} · ${g.tier}`)
    ])
  );

  const tabs = el("div", { class: "tabs" }, [
    tabBtn("learn", "Aprender", true),
    tabBtn("practice", "Practicar", false)
  ]);
  const body = el("div", {});
  container.appendChild(tabs);
  container.appendChild(body);

  function tabBtn(id2, label, active) {
    const b = el("button", { class: `tab-btn ${active ? "active" : ""}`, onclick: () => setTab(id2) }, label);
    b.dataset.id = id2;
    return b;
  }
  function setTab(id2) {
    tabs.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.id === id2));
    body.innerHTML = "";
    body.appendChild(id2 === "learn" ? renderLearn() : renderPractice());
  }

  function renderLearn() {
    const wrap = el("div", { class: "flex-col gap-2" });
    wrap.appendChild(explainCard("Explicación sencilla", g.simpleExplanation));
    wrap.appendChild(explainCard("Explicación detallada", g.detailedExplanation));
    wrap.appendChild(explainCard("Comparación con el inglés", g.englishComparison));
    wrap.appendChild(
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "⚠️ Errores comunes"),
        el("ul", {}, g.commonMistakes.map((m) => el("li", {}, m)))
      ])
    );
    wrap.appendChild(
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "🇪🇸 Ejemplos de España"),
        el("ul", {}, g.spainExamples.map((m) => el("li", {}, m)))
      ])
    );
    wrap.appendChild(
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "Frases de ejemplo"),
        el(
          "table",
          { class: "data-table" },
          [
            el("thead", {}, el("tr", {}, [el("th", {}, "Español"), el("th", {}, "Inglés")])),
            el(
              "tbody",
              {},
              g.exampleSentences.map((s) => el("tr", {}, [el("td", {}, s.es), el("td", {}, s.en)]))
            )
          ]
        )
      ])
    );
    wrap.appendChild(explainCard("💡 Truco para recordarlo", g.memoryTricks));
    wrap.appendChild(
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "📊 Explicación visual"),
        el("pre", { style: "white-space:pre-wrap;font-family:var(--font-ui);background:var(--surface-2);padding:.8rem;border-radius:8px" }, g.visualExplanation)
      ])
    );
    wrap.appendChild(
      el("div", { class: "card" }, [
        el("button", { class: "btn btn-primary", onclick: () => setTab("practice") }, "Ir a practicar →")
      ])
    );
    return wrap;
  }

  function explainCard(title, text) {
    return el("div", { class: "card" }, [el("div", { class: "card-title" }, title), el("p", { style: "margin:0" }, text)]);
  }

  function renderPractice() {
    const wrap = el("div", { class: "flex-col gap-2" });
    let correctCount = 0;
    let total = 0;
    const summary = el("p", { class: "text-muted" }, `0 / ${g.exercises.length} completados`);
    wrap.appendChild(summary);
    g.exercises.forEach((ex, i) => {
      const card = el("div", { class: "card" }, [el("h4", {}, `Ejercicio ${i + 1}`)]);
      card.appendChild(
        renderExercise(ex, {
          onResult: (correct) => {
            total++;
            if (correct) correctCount++;
            summary.textContent = `${total} / ${g.exercises.length} completados · ${correctCount} correctos`;
            recordAttempt(g.id, correct);
          }
        })
      );
      wrap.appendChild(card);
    });
    return wrap;
  }

  setTab("learn");
}
