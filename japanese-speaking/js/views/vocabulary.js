import { VOCABULARY, WORD_LEVELS } from "../data/vocabulary.js";
import { getState, recordQuizAnswer } from "../core/storage.js";
import { el, toast, stripHighlightMarkup } from "../core/ui.js";
import { renderClickableJp } from "../core/wordLookup.js";
import { speak } from "../core/audio.js";

let activeLevel = "all";
let mode = "learn";

export function render(root) {
  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "🈶 Vocabulary in Sentences"),
      el("p", { class: "subtitle" }, "Always learned through a full sentence, never as a bare word list — 84 words, using JLPT N3→N2 only as a rough difficulty scale. The goal is real conversational fluency, not the exam." ),
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
  WORD_LEVELS.forEach((lvl) => {
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
    const lvl = WORD_LEVELS.find((l) => l.id === activeLevel);
    wrap.appendChild(el("p", { class: "muted small" }, `${lvl.label} — ${lvl.note}`));
  }

  const state = getState();
  const words = VOCABULARY.filter((w) => activeLevel === "all" || w.level === activeLevel);
  const masteredCount = words.filter((w) => state.connectorProgress[w.id]?.mastered).length;
  wrap.appendChild(el("p", { class: "muted small" }, `${masteredCount}/${words.length} mastered in this view`));

  const list = el("div", { class: "vocab-list" });
  words.forEach((w) => {
    const lvl = WORD_LEVELS.find((l) => l.id === w.level);
    const mastered = state.connectorProgress[w.id]?.mastered;
    const card = el("div", { class: `card vocab-card ${mastered ? "mastered" : ""}` });
    card.appendChild(
      el("div", { class: "grammar-card-top" }, [
        el("span", { class: "cat-tag", style: `background:${lvl.color}22;color:${lvl.color}` }, lvl.id),
        el("h3", {}, [w.jp, el("span", { class: "muted small vocab-reading" }, ` 【${w.reading}】`)]),
        mastered ? el("span", { class: "mastered-badge" }, "✓ mastered") : null,
      ])
    );
    card.appendChild(el("div", { class: "muted small" }, `${w.pos} — ${w.en}`));
    const sentBox = el("div", { class: "connector-example" });
    const sentRow = el("div", { class: "grammar-example-row" }, [
      el("span", { lang: "ja" }, renderClickableJp(w.sentence)),
      el("button", { class: "icon-btn small", title: "Listen", onclick: () => speak(stripHighlightMarkup(w.sentence), { rate: getState().settings.rate }) }, "🔊"),
    ]);
    sentBox.appendChild(sentRow);
    sentBox.appendChild(el("div", { class: "muted small" }, w.sentenceEn));
    card.appendChild(sentBox);
    list.appendChild(card);
  });
  wrap.appendChild(list);
  return wrap;
}

function buildQuizItem() {
  const target = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
  const sameLevel = VOCABULARY.filter((w) => w.level === target.level && w.id !== target.id);
  const others = VOCABULARY.filter((w) => w.level !== target.level && w.id !== target.id);
  const distractors = [];
  while (distractors.length < 3) {
    const pool = sameLevel.length > distractors.length ? sameLevel : others;
    const cand = pool[Math.floor(Math.random() * pool.length)];
    if (cand && !distractors.find((d) => d.id === cand.id)) distractors.push(cand);
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
  card.appendChild(el("p", { class: "muted" }, "Which word fits the blank in this sentence?"));
  const blanked = target.sentence.replace(/\*\*(.+?)\*\*/, "（　　　　）");
  card.appendChild(el("p", { class: "quiz-sentence", lang: "ja" }, blanked));
  card.appendChild(el("p", { class: "muted small" }, target.sentenceEn));

  const optRow = el("div", { class: "quiz-options" });
  options.forEach((opt) => {
    const btn = el("button", { class: "quiz-option" }, `${opt.jp}【${opt.reading}】 — ${opt.en}`);
    btn.addEventListener("click", () => {
      if (answered) return;
      const correct = opt.id === target.id;
      recordQuizAnswer(target.id, correct);
      answered = true;
      btn.classList.add(correct ? "correct" : "incorrect");
      if (!correct) {
        [...optRow.children].find((b) => b.textContent.startsWith(target.jp))?.classList.add("correct");
      }
      toast(correct ? "正解！ (Correct!)" : `Not quite — it was ${target.jp} (${target.en})`, { type: correct ? "success" : "error" });
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
