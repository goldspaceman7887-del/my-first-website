import { VOCABULARY, WORD_LEVELS } from "../data/vocabulary.js";
import { getState, recordQuizAnswer } from "../core/storage.js";
import { el, toast, stripHighlightMarkup, progressBar } from "../core/ui.js";
import { renderClickableJp } from "../core/wordLookup.js";
import { speak } from "../core/audio.js";
import { waveOffset, buildPathD } from "../core/pathGeometry.js";

const LESSON_SIZE = 15;
const PATH_W = 420;
const ROW_H = 118;
const TOP_PAD = 60;
const BOTTOM_PAD = 60;
const AMPLITUDE = 92;
const NODE_SIZE = 60;
const CHECKPOINT_SIZE = 78;

let activeLevel = "all";
let mode = "path";
let selectedLessonIndex = null;
let quizFilterIds = null; // set when quizzing a single lesson from the Path tab

export function render(root) {
  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "🈶 Vocabulary in Sentences"),
      el("p", { class: "subtitle" }, "Always learned through a full sentence, never as a bare word list — 284 words, using JLPT N3→N2 only as a rough difficulty scale. The goal is real conversational fluency, not the exam." ),
    ])
  );

  const tabs = el("div", { class: "tab-row" }, [
    el("button", { class: `tab ${mode === "path" ? "active" : ""}`, onclick: () => { mode = "path"; render(root); } }, "🛤 Path"),
    el("button", { class: `tab ${mode === "learn" ? "active" : ""}`, onclick: () => { mode = "learn"; render(root); } }, "📖 Learn"),
    el(
      "button",
      {
        class: `tab ${mode === "quiz" ? "active" : ""}`,
        onclick: () => { mode = "quiz"; quizFilterIds = null; currentQuiz = null; render(root); },
      },
      "❓ Quiz"
    ),
  ]);
  container.appendChild(tabs);

  if (mode === "path") container.appendChild(renderPath(root));
  else if (mode === "learn") container.appendChild(renderLearn(root));
  else container.appendChild(renderQuiz(root));

  root.innerHTML = "";
  root.appendChild(container);
}

// ================= shared card renderer =================
function renderVocabCard(w, state) {
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
  return card;
}

// ================= Path tab =================
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function buildLessons() {
  const byLevel = WORD_LEVELS.map((lvl) => ({
    level: lvl.id,
    chunks: chunk(VOCABULARY.filter((w) => w.level === lvl.id), LESSON_SIZE),
  }));
  const lessons = [];
  byLevel.forEach(({ level, chunks }) => {
    chunks.forEach((words, i) => lessons.push({ level, index: i, words, checkpoint: i === chunks.length - 1 }));
  });
  return lessons;
}

function isLessonComplete(lesson, state) {
  return lesson.words.every((w) => state.connectorProgress[w.id]?.mastered);
}

function pathLegendItem(stateClass, icon, label) {
  return el("div", { class: "path-legend-item" }, [
    el("span", { class: `path-legend-dot ${stateClass}` }, icon),
    el("span", { class: "muted small" }, label),
  ]);
}

function renderPath(root) {
  const state = getState();
  const lessons = buildLessons();
  const completionIndex = (() => {
    const i = lessons.findIndex((l) => !isLessonComplete(l, state));
    return i === -1 ? lessons.length : i;
  })();
  const pathComplete = completionIndex >= lessons.length;
  if (selectedLessonIndex === null || selectedLessonIndex >= lessons.length) {
    selectedLessonIndex = Math.min(completionIndex, lessons.length - 1);
  }

  const wrap = el("div", {});

  const totalWords = VOCABULARY.length;
  const masteredWords = VOCABULARY.filter((w) => state.connectorProgress[w.id]?.mastered).length;
  wrap.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "muted small" }, `Overall: ${masteredWords}/${totalWords} words mastered · ${Math.min(completionIndex, lessons.length)}/${lessons.length} lessons complete`),
      progressBar(Math.round((masteredWords / totalWords) * 100)),
    ])
  );

  const points = lessons.map((l, i) => ({
    x: PATH_W / 2 + waveOffset(i, AMPLITUDE, l.checkpoint),
    y: TOP_PAD + i * ROW_H,
    checkpoint: l.checkpoint,
  }));
  const totalHeight = TOP_PAD + (lessons.length - 1) * ROW_H + BOTTOM_PAD;
  const donePoints = points.slice(0, Math.min(completionIndex, points.length));

  const svg = `
    <svg viewBox="0 0 ${PATH_W} ${totalHeight}" class="roadmap-path-svg" preserveAspectRatio="none" aria-hidden="true">
      <path d="${buildPathD(points)}" class="path-line-base" />
      ${donePoints.length > 1 ? `<path d="${buildPathD(donePoints)}" class="path-line-done" />` : ""}
    </svg>
  `;

  const pathWrap = el("div", { class: "roadmap-path-wrap", style: `aspect-ratio:${PATH_W}/${totalHeight};` });
  pathWrap.appendChild(el("div", { class: "roadmap-path-svg-host", html: svg }));

  const nodeLayer = el("div", { class: "path-node-layer" });
  points.forEach((p, i) => {
    const lesson = lessons[i];
    const completed = i < completionIndex;
    const current = i === completionIndex;
    const locked = i > completionIndex;
    const size = p.checkpoint ? CHECKPOINT_SIZE : NODE_SIZE;

    let icon = String(i + 1);
    if (completed) icon = "✓";
    else if (locked) icon = p.checkpoint ? "☆" : "🔒";
    else if (p.checkpoint) icon = "⭐";

    const cls = [
      "path-node-btn",
      completed ? "completed" : current ? "current" : "locked",
      p.checkpoint ? "checkpoint" : "",
      i === selectedLessonIndex ? "selected" : "",
    ].filter(Boolean).join(" ");

    const label = `${lesson.level} Lesson ${lesson.index + 1}${lesson.checkpoint ? " (checkpoint)" : ""}`;
    const btn = el(
      "button",
      {
        class: cls,
        style: `left:${((p.x / PATH_W) * 100).toFixed(2)}%; top:${((p.y / totalHeight) * 100).toFixed(2)}%; width:${size}px; height:${size}px;`,
        title: label,
        "aria-label": label,
        onclick: () => {
          selectedLessonIndex = i;
          render(root);
          document.getElementById("vocab-lesson-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
        },
      },
      icon
    );
    nodeLayer.appendChild(btn);
  });
  pathWrap.appendChild(nodeLayer);
  wrap.appendChild(pathWrap);

  wrap.appendChild(
    el("div", { class: "path-legend" }, [
      pathLegendItem("completed", "✓", "Mastered"),
      pathLegendItem("current", "1", "Current lesson"),
      pathLegendItem("locked", "🔒", "Not started"),
      pathLegendItem("checkpoint", "⭐", "Level checkpoint"),
    ])
  );

  if (pathComplete) {
    wrap.appendChild(el("div", { class: "card celebration-card" }, "🎉 All 284 words mastered — ask for more vocabulary any time to keep going."));
  }

  const lesson = lessons[selectedLessonIndex];
  const doneInLesson = lesson.words.filter((w) => state.connectorProgress[w.id]?.mastered).length;
  const detail = el("div", { class: "card week-card current-week", id: "vocab-lesson-detail" });
  detail.appendChild(
    el("div", { class: "week-card-header" }, [
      el("h2", {}, `${lesson.level} · Lesson ${lesson.index + 1}`),
      lesson.checkpoint ? el("span", { class: "badge warn" }, "🎯 Checkpoint") : null,
    ])
  );
  detail.appendChild(el("p", { class: "muted small" }, `${doneInLesson}/${lesson.words.length} words mastered in this lesson`));
  detail.appendChild(progressBar(Math.round((doneInLesson / lesson.words.length) * 100)));

  const cardList = el("div", { class: "vocab-list" });
  lesson.words.forEach((w) => cardList.appendChild(renderVocabCard(w, state)));
  detail.appendChild(cardList);

  detail.appendChild(
    el(
      "button",
      {
        class: "btn primary",
        onclick: () => {
          quizFilterIds = lesson.words.map((w) => w.id);
          currentQuiz = null;
          mode = "quiz";
          render(root);
        },
      },
      "❓ Quiz this lesson"
    )
  );

  wrap.appendChild(detail);
  return wrap;
}

// ================= Learn tab =================
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
  words.forEach((w) => list.appendChild(renderVocabCard(w, state)));
  wrap.appendChild(list);
  return wrap;
}

// ================= Quiz tab =================
function buildQuizItem() {
  const pool = quizFilterIds ? VOCABULARY.filter((w) => quizFilterIds.includes(w.id)) : VOCABULARY;
  const target = pool[Math.floor(Math.random() * pool.length)];
  const sameLevel = VOCABULARY.filter((w) => w.level === target.level && w.id !== target.id);
  const others = VOCABULARY.filter((w) => w.level !== target.level && w.id !== target.id);
  const distractors = [];
  while (distractors.length < 3) {
    const dpool = sameLevel.length > distractors.length ? sameLevel : others;
    const cand = dpool[Math.floor(Math.random() * dpool.length)];
    if (cand && !distractors.find((d) => d.id === cand.id)) distractors.push(cand);
  }
  const options = [target, ...distractors].sort(() => Math.random() - 0.5);
  return { target, options };
}

let currentQuiz = null;
let answered = false;

function renderQuiz(root) {
  if (!currentQuiz || answered === "advance") {
    currentQuiz = buildQuizItem();
    answered = false;
  }
  const { target, options } = currentQuiz;
  const state = getState();
  const wrap = el("div", { class: "quiz-wrap" });

  if (quizFilterIds) {
    wrap.appendChild(
      el("div", { class: "quiz-stats muted small" }, [
        `Quizzing ${quizFilterIds.length} words from this lesson only. `,
        el(
          "a",
          {
            href: "#",
            onclick: (e) => { e.preventDefault(); quizFilterIds = null; currentQuiz = null; render(root); },
          },
          "Quiz all words instead →"
        ),
      ])
    );
  }
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
        el("button", { class: "btn primary next-btn", onclick: () => { answered = "advance"; render(root); } }, "Next →")
      );
    });
    optRow.appendChild(btn);
  });
  card.appendChild(optRow);
  wrap.appendChild(card);
  return wrap;
}
