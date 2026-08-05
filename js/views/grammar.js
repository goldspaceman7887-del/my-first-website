import { store } from "../core/storage.js";
import { el, blurActive } from "../core/ui.js";
import { renderExercise, normalize } from "../core/exercises.js";
import { gradeItem, masteryLevel, QUALITY } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { runLesson } from "../core/lessonPlayer.js";
import { getHearts, hasHearts, minutesUntilNextHeart } from "../core/hearts.js";
import { correctionBlock } from "../core/feedback.js";
import { tappable, initTapWords } from "../core/tapword.js";
import { GRAMMAR } from "../data/grammar.js";

const SPANISH_STOPWORDS = new Set([
  "de", "la", "el", "en", "y", "a", "que", "los", "las", "un", "una", "unos", "unas", "es", "se", "no", "por", "con",
  "para", "su", "sus", "lo", "le", "les", "mi", "mis", "tu", "tus", "te", "mas", "muy", "pero", "como", "del", "al",
  "si", "ya", "o", "u", "e", "este", "esta", "esto", "esos", "esas", "son", "fue", "era", "han", "ha", "he", "has",
  "yo", "tu", "el", "ella", "nosotros", "vosotros", "ellos", "ellas", "usted", "ustedes", "eso", "ese", "esa"
]);

// Pulls the most repeated content words out of a concept's example sentences
// so the free-writing check has something concrete (if imperfect) to look
// for — without needing per-concept authored keyword lists.
function extractKeyForms(g) {
  const text = [...(g.exampleSentences || []).map((s) => s.es), ...(g.spainExamples || [])].join(" ");
  const words = normalize(text).split(/\s+/).filter(Boolean);
  const freq = {};
  words.forEach((w) => {
    if (!SPANISH_STOPWORDS.has(w) && w.length > 2) freq[w] = (freq[w] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w);
}

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
      el("h1", {}, "🧠 Grammar Lab · Gramática"),
      el("p", {}, "Pick any topic below. Each one has a plain-English explanation first, then short practice questions — no pressure, go at your own pace."),
      el("p", { class: "text-faint" }, "La gramática del español de España explicada con claridad: vosotros, leísmo, subjuntivo y más.")
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
    tabBtn("learn", "1. Learn / Aprender", true),
    tabBtn("practice", "2. Practice / Practicar", false)
  ]);
  const body = el("div", {});
  container.appendChild(tabs);
  container.appendChild(body);
  let activeLessonDestroy = null;

  function tabBtn(id2, label, active) {
    const b = el("button", { class: `tab-btn ${active ? "active" : ""}`, onclick: () => setTab(id2) }, label);
    b.dataset.id = id2;
    return b;
  }
  function setTab(id2) {
    if (activeLessonDestroy) {
      activeLessonDestroy();
      activeLessonDestroy = null;
    }
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
              g.exampleSentences.map((s) => el("tr", {}, [el("td", { class: "tappable-line" }, [tappable(s.es)]), el("td", {}, s.en)]))
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

    if (!hasHearts()) {
      const mins = minutesUntilNextHeart();
      wrap.appendChild(
        el("div", { class: "card empty-state" }, [
          el("div", { class: "empty-icon" }, "💔"),
          el("h3", {}, "Out of hearts for now"),
          el("p", {}, `Your next heart comes back in about ${mins} minute${mins === 1 ? "" : "s"}. You can still write your own sentence below — that doesn't need hearts.`)
        ])
      );
    } else {
      const hearts = getHearts();
      wrap.appendChild(
        el("div", { class: "card", style: "text-align:center;padding:2rem 1.5rem" }, [
          el("div", { style: "font-size:2.5rem;margin-bottom:.5rem" }, "🎯"),
          el("h2", { style: "margin:0 0 .5rem" }, "Ready to practice?"),
          el("p", { class: "text-muted" }, `${g.exercises.length} question${g.exercises.length === 1 ? "" : "s"} · ${hearts.current} ❤️ available`),
          el(
            "button",
            {
              class: "btn btn-primary btn-lg btn-duo-cta",
              style: "margin-top:1rem",
              onclick: () => {
                body.innerHTML = "";
                const questions = g.exercises.map((ex) => ({
                  render(host, onResult) {
                    host.appendChild(
                      renderExercise(ex, {
                        onResult: (correct) => {
                          recordAttempt(g.id, correct);
                          onResult(correct);
                        }
                      })
                    );
                  }
                }));
                activeLessonDestroy = runLesson(body, {
                  title: g.title,
                  questions,
                  xpPerCorrect: 6,
                  onExit: () => {
                    activeLessonDestroy = null;
                    setTab("practice");
                  }
                });
              }
            },
            "Start Lesson"
          )
        ])
      );
    }

    wrap.appendChild(freeWriteCard(g));
    return wrap;
  }

  setTab("learn");

  const untapWords = initTapWords();
  return () => {
    if (activeLessonDestroy) activeLessonDestroy();
    untapWords();
  };
}

function freeWriteCard(g) {
  const keyForms = extractKeyForms(g);
  const card = el("div", { class: "card" }, [
    el("div", { class: "card-title" }, "✍️ Free practice: write your own sentence"),
    el(
      "p",
      { class: "text-muted" },
      `This one isn't strict — it's your chance to prove you really understand "${g.title}", not just recognize it. Write an original sentence using it. Look back at the example sentences above if you need a nudge.`
    )
  ]);
  const input = el("textarea", { placeholder: "Escribe tu propia frase en español...", style: "width:100%;min-height:80px;margin-top:.5rem" });
  const feedback = el("div", { class: "feedback-block hidden" });
  const checkBtn = el(
    "button",
    {
      class: "btn btn-primary",
      style: "margin-top:.5rem",
      onclick: () => {
        const text = input.value.trim();
        blurActive();
        const norm = normalize(text);
        const matched = keyForms.find((k) => norm.includes(k));
        const longEnough = text.split(/\s+/).filter(Boolean).length >= 4;
        feedback.classList.remove("hidden", "correct", "incorrect");
        if (!text) {
          feedback.classList.add("incorrect");
          feedback.textContent = "Write a full sentence first — a few words is fine!";
        } else if (!longEnough) {
          feedback.classList.add("incorrect");
          feedback.textContent = "Try a slightly longer sentence — subject + verb + a bit more.";
        } else if (matched || !keyForms.length) {
          feedback.classList.add("correct");
          feedback.textContent = "¡Muy bien! Nice work applying it in your own words. (+5 XP)";
          addXP(5, `Frase propia: ${g.title}`);
          gradeItem(`gram_${g.id}`, "grammar", QUALITY.GOOD);
        } else {
          feedback.classList.add("incorrect");
          feedback.textContent = `Good try — just double check you're actually using "${g.title}" in there. Take a look at the examples above for inspiration.`;
        }
        correction.innerHTML = "";
        const block = correctionBlock(text, { compact: true });
        if (block) correction.appendChild(block);
      }
    },
    "Check / Comprobar"
  );
  const correction = el("div", { style: "margin-top:.5rem" });
  card.appendChild(input);
  card.appendChild(el("div", { class: "btn-row" }, [checkBtn]));
  card.appendChild(feedback);
  card.appendChild(correction);
  return card;
}
