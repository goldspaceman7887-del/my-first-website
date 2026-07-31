import { CONNECTORS, CATEGORIES } from "../data/connectors.js";
import { getState, recordQuizAnswer } from "../core/storage.js";
import { el, toast } from "../core/ui.js";
import { speak } from "../core/audio.js";

let activeCategory = "all";
let mode = "learn"; // "learn" | "quiz"

export function render(root) {
  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "🔗 Connector Lab"),
      el("p", { class: "subtitle" }, "接続表現 — the phrases that turn separate sentences into one connected paragraph. This is the #1 gap between Intermediate High and Advanced High."),
    ])
  );

  const tabs = el("div", { class: "tab-row" }, [
    el("button", { class: `tab ${mode === "learn" ? "active" : ""}`, onclick: () => { mode = "learn"; render(root); root.scrollIntoView(); } }, "📖 Learn"),
    el("button", { class: `tab ${mode === "quiz" ? "active" : ""}`, onclick: () => { mode = "quiz"; render(root); } }, "❓ Quiz"),
  ]);
  container.appendChild(tabs);

  if (mode === "learn") container.appendChild(renderLearn());
  else container.appendChild(renderQuiz());

  root.innerHTML = "";
  root.appendChild(container);
}

function renderLearn() {
  const wrap = el("div", {});
  const filterRow = el("div", { class: "chip-row" });
  filterRow.appendChild(
    el("button", { class: `chip ${activeCategory === "all" ? "active" : ""}`, onclick: () => { activeCategory = "all"; render(document.getElementById("view-root")); } }, "All")
  );
  CATEGORIES.forEach((cat) => {
    filterRow.appendChild(
      el(
        "button",
        {
          class: `chip ${activeCategory === cat.id ? "active" : ""}`,
          style: activeCategory === cat.id ? `background:${cat.color};border-color:${cat.color}` : "",
          onclick: () => { activeCategory = cat.id; render(document.getElementById("view-root")); },
        },
        `${cat.jp}`
      )
    );
  });
  wrap.appendChild(filterRow);

  const state = getState();
  const list = el("div", { class: "connector-grid" });
  CONNECTORS.filter((c) => activeCategory === "all" || c.category === activeCategory).forEach((c) => {
    const cat = CATEGORIES.find((k) => k.id === c.category);
    const mastered = state.connectorProgress[c.id]?.mastered;
    const card = el("div", { class: `connector-card ${mastered ? "mastered" : ""}` });
    card.appendChild(
      el("div", { class: "connector-card-top" }, [
        el("span", { class: "cat-tag", style: `background:${cat.color}22;color:${cat.color}` }, cat.jp),
        mastered ? el("span", { class: "mastered-badge" }, "✓ mastered") : null,
      ])
    );
    card.appendChild(
      el("div", { class: "connector-jp-row" }, [
        el("span", { class: "connector-jp" }, c.jp),
        el("button", { class: "icon-btn small", title: "Listen", onclick: () => speak(c.jp, { rate: getState().settings.rate }) }, "🔊"),
      ])
    );
    card.appendChild(el("div", { class: "connector-reading" }, c.reading));
    card.appendChild(el("div", { class: "connector-en" }, c.en));
    card.appendChild(el("div", { class: "connector-register muted small" }, `register: ${c.register}`));
    const ex = el("div", { class: "connector-example" });
    ex.appendChild(el("div", {}, c.a));
    if (c.b) ex.appendChild(el("div", {}, c.b));
    ex.appendChild(
      el("button", { class: "icon-btn small", title: "Listen to example", onclick: () => speak(`${c.a} ${c.b || ""}`, { rate: getState().settings.rate }) }, "🔊 example")
    );
    card.appendChild(ex);
    list.appendChild(card);
  });
  wrap.appendChild(list);
  return wrap;
}

function buildQuizItem() {
  const pool = CONNECTORS.filter((c) => c.b); // need two-sentence examples
  const target = pool[Math.floor(Math.random() * pool.length)];
  const sameCategory = CONNECTORS.filter((c) => c.category === target.category && c.id !== target.id && c.b);
  const others = CONNECTORS.filter((c) => c.category !== target.category && c.id !== target.id);
  const distractors = [];
  while (distractors.length < 3) {
    const pool2 = sameCategory.length > distractors.length ? sameCategory : others;
    const cand = pool2[Math.floor(Math.random() * pool2.length)];
    if (cand && cand.id !== target.id && !distractors.find((d) => d.id === cand.id)) distractors.push(cand);
  }
  const options = [target, ...distractors].sort(() => Math.random() - 0.5);
  return { target, options };
}

let currentQuiz = null;
let answered = false;

function renderQuiz() {
  if (!currentQuiz || answered === "advance") {
    currentQuiz = buildQuizItem();
    answered = false;
  }
  const wrap = el("div", { class: "quiz-wrap" });
  const { target, options } = currentQuiz;
  const state = getState();

  wrap.appendChild(
    el("div", { class: "quiz-stats muted small" }, `Score: ${state.quizStats.correct}/${state.quizStats.attempts}`)
  );

  const card = el("div", { class: "card quiz-card" });
  card.appendChild(el("p", { class: "muted" }, "Pick the connector that best joins these two ideas:"));
  card.appendChild(el("p", { class: "quiz-sentence" }, target.a));
  card.appendChild(el("p", { class: "quiz-sentence" }, ["＿＿＿＿、", target.b.replace(new RegExp(`^${escapeRe(target.jp)}、?`), "")]));

  const optRow = el("div", { class: "quiz-options" });
  options.forEach((opt) => {
    const btn = el("button", { class: "quiz-option" }, `${opt.jp} (${opt.en})`);
    btn.addEventListener("click", () => {
      if (answered) return;
      const correct = opt.id === target.id;
      recordQuizAnswer(target.id, correct);
      answered = true;
      btn.classList.add(correct ? "correct" : "incorrect");
      if (!correct) {
        [...optRow.children].find((b) => b.textContent.startsWith(target.jp))?.classList.add("correct");
      }
      toast(correct ? "正解！ (Correct!)" : `Not quite — the answer was ${target.jp} (${target.en})`, {
        type: correct ? "success" : "error",
      });
      optRow.appendChild(
        el(
          "button",
          {
            class: "btn primary next-btn",
            onclick: () => {
              answered = "advance";
              render(document.getElementById("view-root"));
            },
          },
          "Next →"
        )
      );
    });
    optRow.appendChild(btn);
  });
  card.appendChild(optRow);
  wrap.appendChild(card);
  return wrap;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
