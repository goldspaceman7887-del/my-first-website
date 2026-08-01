import { GRAMMAR, LEVELS } from "../data/grammar.js";
import { getState, recordQuizAnswer } from "../core/storage.js";
import { el, toast, renderHighlighted, stripHighlightMarkup } from "../core/ui.js";
import { speak } from "../core/audio.js";

let activeLevel = "all";
let mode = "learn";

export function render(root) {
  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "📚 Grammar Ladder"),
      el("p", { class: "subtitle" }, "Sentence-internal structures leveled to ACTFL sublevels — IH (consolidate), AL (next checkpoint), AM (nuance), AH (register control). This is what you layer on top of connectors."),
    ])
  );

  const tabs = el("div", { class: "tab-row" }, [
    el("button", { class: `tab ${mode === "learn" ? "active" : ""}`, onclick: () => { mode = "learn"; render(root); } }, "📖 Learn"),
    el("button", { class: `tab ${mode === "quiz" ? "active" : ""}`, onclick: () => { mode = "quiz"; render(root); } }, "❓ Quiz"),
  ]);
  container.appendChild(tabs);

  if (mode === "learn") container.appendChild(renderLearn(root));
  else container.appendChild(renderQuiz());

  root.innerHTML = "";
  root.appendChild(container);
}

function renderLearn(root) {
  const wrap = el("div", {});
  const filterRow = el("div", { class: "chip-row" });
  filterRow.appendChild(el("button", { class: `chip ${activeLevel === "all" ? "active" : ""}`, onclick: () => { activeLevel = "all"; render(root); } }, "All"));
  LEVELS.forEach((lvl) => {
    filterRow.appendChild(
      el(
        "button",
        {
          class: `chip ${activeLevel === lvl.id ? "active" : ""}`,
          style: activeLevel === lvl.id ? `background:${lvl.color};border-color:${lvl.color};color:#fff` : "",
          onclick: () => { activeLevel = lvl.id; render(root); },
        },
        lvl.id
      )
    );
  });
  wrap.appendChild(filterRow);

  if (activeLevel !== "all") {
    const lvl = LEVELS.find((l) => l.id === activeLevel);
    wrap.appendChild(el("p", { class: "muted small" }, `${lvl.label} — ${lvl.note}`));
  }

  const state = getState();
  const list = el("div", { class: "grammar-list" });
  GRAMMAR.filter((g) => activeLevel === "all" || g.level === activeLevel).forEach((g) => {
    const lvl = LEVELS.find((l) => l.id === g.level);
    const mastered = state.connectorProgress[g.id]?.mastered;
    const card = el("div", { class: `card grammar-card ${mastered ? "mastered" : ""}` });
    card.appendChild(
      el("div", { class: "grammar-card-top" }, [
        el("span", { class: "cat-tag", style: `background:${lvl.color}22;color:${lvl.color}` }, lvl.id),
        el("h3", {}, g.title),
        mastered ? el("span", { class: "mastered-badge" }, "✓ mastered") : null,
      ])
    );
    card.appendChild(el("div", { class: "muted small" }, `structure: ${g.structure}`));
    card.appendChild(el("p", {}, g.explanation));
    const exBox = el("div", { class: "connector-example" });
    g.examples.forEach((ex) => {
      const row = el("div", { class: "grammar-example-row" }, [
        el("span", { lang: "ja" }, renderHighlighted(ex.jp)),
        el("button", { class: "icon-btn small", title: "Listen", onclick: () => speak(stripHighlightMarkup(ex.jp), { rate: getState().settings.rate }) }, "🔊"),
      ]);
      exBox.appendChild(row);
      exBox.appendChild(el("div", { class: "muted small" }, ex.en));
    });
    card.appendChild(exBox);
    if (g.mistake) {
      card.appendChild(el("p", { class: "grammar-mistake" }, [el("strong", {}, "Common mistake: "), g.mistake]));
    }
    list.appendChild(card);
  });
  wrap.appendChild(list);
  return wrap;
}

function buildQuizItem() {
  const target = GRAMMAR[Math.floor(Math.random() * GRAMMAR.length)];
  const distractors = [];
  const pool = GRAMMAR.filter((g) => g.id !== target.id);
  while (distractors.length < 3 && distractors.length < pool.length) {
    const cand = pool[Math.floor(Math.random() * pool.length)];
    if (!distractors.find((d) => d.id === cand.id)) distractors.push(cand);
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
  const { target, options } = currentQuiz;
  const state = getState();
  const wrap = el("div", { class: "quiz-wrap" });
  wrap.appendChild(el("div", { class: "quiz-stats muted small" }, `Score: ${state.quizStats.correct}/${state.quizStats.attempts}`));

  const card = el("div", { class: "card quiz-card" });
  card.appendChild(el("p", { class: "muted" }, "Which structure does this example sentence use?"));
  card.appendChild(el("p", { class: "quiz-sentence" }, stripHighlightMarkup(target.examples[0].jp)));
  card.appendChild(el("p", { class: "muted small" }, target.examples[0].en));

  const optRow = el("div", { class: "quiz-options" });
  options.forEach((opt) => {
    const btn = el("button", { class: "quiz-option" }, `${opt.title}`);
    btn.addEventListener("click", () => {
      if (answered) return;
      const correct = opt.id === target.id;
      recordQuizAnswer(target.id, correct);
      answered = true;
      btn.classList.add(correct ? "correct" : "incorrect");
      if (!correct) {
        [...optRow.children].find((b) => b.textContent === target.title)?.classList.add("correct");
      }
      toast(correct ? "正解！ (Correct!)" : `Not quite — it was ${target.title}`, { type: correct ? "success" : "error" });
      optRow.appendChild(
        el("button", { class: "btn primary next-btn", onclick: () => { answered = "advance"; render(document.getElementById("view-root")); } }, "Next →")
      );
    });
    optRow.appendChild(btn);
  });
  card.appendChild(optRow);
  wrap.appendChild(card);
  return wrap;
}
