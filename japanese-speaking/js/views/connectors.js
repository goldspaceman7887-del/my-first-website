import { CONNECTORS, CATEGORIES } from "../data/connectors.js";
import { getState, recordQuizAnswer, gradeSrsItem, saveSession, loadSession, clearSession } from "../core/storage.js";
import { grade, formatInterval, isDue, isNew } from "../core/srs.js";
import { el, toast } from "../core/ui.js";
import { renderClickableJp } from "../core/wordLookup.js";
import { speak } from "../core/audio.js";

const SESSION_KEY = "connectors";

let activeCategory = "all";
let mode = "learn"; // "learn" | "quiz"

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
  saveSession(SESSION_KEY, { ids: queue.map((c) => c.id), index: qIndex, flipped, activeCategory, mode });
}

function restoreQueue() {
  restored = true;
  const saved = loadSession(SESSION_KEY);
  if (!saved) return;
  if (saved.mode) mode = saved.mode;
  const rebuilt = saved.ids.map((id) => CONNECTORS.find((c) => c.id === id)).filter(Boolean);
  if (rebuilt.length === 0) return;
  queue = rebuilt;
  qIndex = Math.min(saved.index ?? 0, queue.length);
  flipped = !!saved.flipped;
  activeCategory = saved.activeCategory || "all";
}

export function render(root) {
  if (!restored) restoreQueue();
  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "🔗 Connector Lab"),
      el("p", { class: "subtitle" }, "接続表現 — the phrases that turn separate sentences into one connected paragraph. This is the #1 gap between Intermediate High and Advanced High."),
    ])
  );

  const tabs = el("div", { class: "tab-row" }, [
    el("button", { class: `tab ${mode === "learn" ? "active" : ""}`, onclick: () => { mode = "learn"; persistQueue(); render(root); root.scrollIntoView(); } }, "📖 Learn"),
    el("button", { class: `tab ${mode === "quiz" ? "active" : ""}`, onclick: () => { mode = "quiz"; persistQueue(); render(root); } }, "❓ Quiz"),
  ]);
  container.appendChild(tabs);

  if (mode === "learn") container.appendChild(renderLearn(root));
  else container.appendChild(renderQuiz());

  root.innerHTML = "";
  root.appendChild(container);
}

function categoryFilterRow(root, onChange) {
  const filterRow = el("div", { class: "chip-row" });
  filterRow.appendChild(
    el("button", { class: `chip ${activeCategory === "all" ? "active" : ""}`, onclick: () => { activeCategory = "all"; onChange(); render(root); } }, "All")
  );
  CATEGORIES.forEach((cat) => {
    filterRow.appendChild(
      el(
        "button",
        {
          class: `chip ${activeCategory === cat.id ? "active" : ""}`,
          style: activeCategory === cat.id ? `background:${cat.color};border-color:${cat.color}` : "",
          onclick: () => { activeCategory = cat.id; onChange(); render(root); },
        },
        `${cat.jp}`
      )
    );
  });
  return filterRow;
}

function markFirst(sentence, target) {
  if (!target) return sentence;
  const idx = sentence.indexOf(target);
  if (idx === -1) return sentence;
  return sentence.slice(0, idx) + "**" + target + "**" + sentence.slice(idx + target.length);
}

function buildQueue(state) {
  return CONNECTORS.filter((c) => activeCategory === "all" || c.category === activeCategory).filter(
    (c) => isNew(state.srs[c.id]) || isDue(state.srs[c.id])
  );
}

// ================= Learn tab: one connector at a time, flip + self-grade =================
function renderLearn(root) {
  const wrap = el("div", {});
  wrap.appendChild(categoryFilterRow(root, () => { queue = null; persistQueue(); }));

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
          ? "🎉 Nothing due in this category right now — everything's ghosted into a future review. Try another category, or check back later."
          : "✅ Done with this batch — graded items will resurface here (or in Review Session) when they're due again."),
        el("button", { class: "btn primary", onclick: () => { queue = null; clearSession(SESSION_KEY); render(root); } }, "Check again"),
      ])
    );
    return wrap;
  }

  const c = queue[qIndex];
  const cat = CATEGORIES.find((k) => k.id === c.category);
  const raw = c.b ? `${c.a} ${c.b}` : c.a;
  const frontJp = markFirst(raw, c.jp);

  wrap.appendChild(el("div", { class: "review-progress muted small" }, `${qIndex + 1} / ${queue.length} in this category`));

  const card = el("div", { class: "card review-card" });
  card.appendChild(
    el("div", { class: "review-card-top" }, [
      el("span", { class: "cat-tag", style: `background:${cat.color}22;color:${cat.color}` }, cat.jp),
      el("button", { class: "icon-btn small", title: "Listen", onclick: (e) => { e.stopPropagation(); speak(raw, { rate: getState().settings.rate }); } }, "🔊"),
    ])
  );
  card.appendChild(el("p", { class: "review-front", lang: "ja" }, renderClickableJp(frontJp)));

  if (!flipped) {
    card.appendChild(el("p", { class: "muted small review-tap-hint" }, "Tap the card (or press space) to reveal"));
    card.classList.add("review-card-clickable");
    card.addEventListener("click", () => { flipped = true; persistQueue(); render(root); });
  } else {
    const back = el("div", { class: "review-back" });
    back.appendChild(el("div", { class: "review-back-title" }, c.jp));
    back.appendChild(el("div", { class: "muted small" }, c.reading));
    back.appendChild(el("div", {}, c.en));
    back.appendChild(el("p", { class: "muted small" }, `register: ${c.register}`));
    card.appendChild(back);

    const record = state.srs[c.id];
    const grades = [
      ["again", "Again", "danger"],
      ["hard", "Hard", "warn2"],
      ["good", "Good", "good2"],
      ["easy", "Easy", "accent2b"],
    ];
    const gradeRow = el("div", { class: "review-grade-row" });
    grades.forEach(([g, label, cls]) => {
      const preview = formatInterval(grade(record, g).interval);
      const btn = el(
        "button",
        {
          class: `review-grade-btn ${cls}`,
          onclick: (e) => {
            e.stopPropagation();
            gradeSrsItem(c.id, g);
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
