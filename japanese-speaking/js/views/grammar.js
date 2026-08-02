import { GRAMMAR, LEVELS } from "../data/grammar.js";
import { getState, recordQuizAnswer, gradeSrsItem, saveSession, loadSession, clearSession } from "../core/storage.js";
import { grade, formatInterval, isDue, isNew } from "../core/srs.js";
import { el, toast, stripHighlightMarkup } from "../core/ui.js";
import { renderClickableJp } from "../core/wordLookup.js";
import { speak } from "../core/audio.js";

const SESSION_KEY = "grammar";

let activeLevel = "all";
let mode = "learn";

// Learn-tab flip queue state
let queue = null;
let qIndex = 0;
let flipped = false;
let restored = false;

function persistQueue() {
  if (!queue) {
    clearSession(SESSION_KEY);
    return;
  }
  saveSession(SESSION_KEY, { ids: queue.map((g) => g.id), index: qIndex, flipped, activeLevel, mode });
}

function restoreQueue() {
  restored = true;
  const saved = loadSession(SESSION_KEY);
  if (!saved) return;
  if (saved.mode) mode = saved.mode;
  const rebuilt = saved.ids.map((id) => GRAMMAR.find((g) => g.id === id)).filter(Boolean);
  if (rebuilt.length === 0) return;
  queue = rebuilt;
  qIndex = Math.min(saved.index ?? 0, queue.length);
  flipped = !!saved.flipped;
  activeLevel = saved.activeLevel || "all";
}

export function render(root) {
  if (!restored) restoreQueue();
  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "📚 Grammar Ladder"),
      el("p", { class: "subtitle" }, "Sentence-internal structures leveled to ACTFL sublevels — IH (consolidate), AL (next checkpoint), AM (nuance), AH (register control). This is what you layer on top of connectors."),
    ])
  );

  const tabs = el("div", { class: "tab-row" }, [
    el("button", { class: `tab ${mode === "learn" ? "active" : ""}`, onclick: () => { mode = "learn"; persistQueue(); render(root); } }, "📖 Learn"),
    el("button", { class: `tab ${mode === "quiz" ? "active" : ""}`, onclick: () => { mode = "quiz"; persistQueue(); render(root); } }, "❓ Quiz"),
  ]);
  container.appendChild(tabs);

  if (mode === "learn") container.appendChild(renderLearn(root));
  else container.appendChild(renderQuiz());

  root.innerHTML = "";
  root.appendChild(container);
}

function levelFilterRow(root, onChange) {
  const filterRow = el("div", { class: "chip-row" });
  filterRow.appendChild(el("button", { class: `chip ${activeLevel === "all" ? "active" : ""}`, onclick: () => { activeLevel = "all"; onChange(); render(root); } }, "All"));
  LEVELS.forEach((lvl) => {
    filterRow.appendChild(
      el(
        "button",
        {
          class: `chip ${activeLevel === lvl.id ? "active" : ""}`,
          style: activeLevel === lvl.id ? `background:${lvl.color};border-color:${lvl.color};color:#fff` : "",
          onclick: () => { activeLevel = lvl.id; onChange(); render(root); },
        },
        lvl.id
      )
    );
  });
  return filterRow;
}

function buildQueue(state) {
  return GRAMMAR.filter((g) => activeLevel === "all" || g.level === activeLevel).filter(
    (g) => isNew(state.srs[g.id]) || isDue(state.srs[g.id])
  );
}

// ================= Learn tab: one grammar point at a time, flip + self-grade =================
function renderLearn(root) {
  const wrap = el("div", {});
  wrap.appendChild(levelFilterRow(root, () => { queue = null; persistQueue(); }));

  if (activeLevel !== "all") {
    const lvl = LEVELS.find((l) => l.id === activeLevel);
    wrap.appendChild(el("p", { class: "muted small" }, `${lvl.label} — ${lvl.note}`));
  }

  const state = getState();
  if (queue === null) {
    queue = buildQueue(state);
    qIndex = 0;
    flipped = false;
    persistQueue();
  }

  if (qIndex >= queue.length) {
    wrap.appendChild(
      el("div", { class: "card celebration-card" }, [
        el("p", {}, queue.length === 0
          ? "🎉 Nothing due in this level right now — everything's ghosted into a future review. Try another level, or check back later."
          : "✅ Done with this batch — graded items will resurface here (or in Review Session) when they're due again."),
        el("button", { class: "btn primary", onclick: () => { queue = null; clearSession(SESSION_KEY); render(root); } }, "Check again"),
      ])
    );
    return wrap;
  }

  const g = queue[qIndex];
  const lvl = LEVELS.find((l) => l.id === g.level);
  const ex = g.examples[0];

  wrap.appendChild(el("div", { class: "review-progress muted small" }, `${qIndex + 1} / ${queue.length} in this level`));

  const card = el("div", { class: "card review-card" });
  card.appendChild(
    el("div", { class: "review-card-top" }, [
      el("span", { class: "cat-tag", style: `background:${lvl.color}22;color:${lvl.color}` }, lvl.id),
      el("button", { class: "icon-btn small", title: "Listen", onclick: (e) => { e.stopPropagation(); speak(stripHighlightMarkup(ex.jp), { rate: getState().settings.rate }); } }, "🔊"),
    ])
  );
  card.appendChild(el("p", { class: "review-front", lang: "ja" }, renderClickableJp(ex.jp)));

  if (!flipped) {
    card.appendChild(el("p", { class: "muted small review-tap-hint" }, "Tap the card (or press space) to reveal"));
    card.classList.add("review-card-clickable");
    card.addEventListener("click", () => { flipped = true; persistQueue(); render(root); });
  } else {
    const back = el("div", { class: "review-back" });
    back.appendChild(el("div", { class: "review-back-title" }, g.title));
    back.appendChild(el("div", { class: "muted small" }, `structure: ${g.structure}`));
    back.appendChild(el("div", {}, g.explanation));
    if (g.examples.length > 1) {
      g.examples.slice(1).forEach((extraEx) => {
        back.appendChild(el("p", { class: "muted small", lang: "ja" }, stripHighlightMarkup(extraEx.jp)));
      });
    }
    if (g.mistake) back.appendChild(el("p", { class: "grammar-mistake" }, [el("strong", {}, "Common mistake: "), g.mistake]));
    card.appendChild(back);

    const record = state.srs[g.id];
    const grades = [
      ["again", "Again", "danger"],
      ["hard", "Hard", "warn2"],
      ["good", "Good", "good2"],
      ["easy", "Easy", "accent2b"],
    ];
    const gradeRow = el("div", { class: "review-grade-row" });
    grades.forEach(([gr, label, cls]) => {
      const preview = formatInterval(grade(record, gr).interval);
      const btn = el(
        "button",
        {
          class: `review-grade-btn ${cls}`,
          onclick: (e) => {
            e.stopPropagation();
            gradeSrsItem(g.id, gr);
            qIndex += 1;
            flipped = false;
            persistQueue();
            render(root);
          },
        },
        [el("div", {}, label), el("div", { class: "review-grade-preview" }, preview)]
      );
      gradeRow.appendChild(btn);
    });
    card.appendChild(gradeRow);
    card.appendChild(el("p", { class: "muted small" }, "Grade honestly — Good/Easy ghost it into a future review; Again/Hard bring it back soon."));
  }

  wrap.appendChild(card);
  return wrap;
}

// ================= Quiz tab (unchanged: multiple choice) =================
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
