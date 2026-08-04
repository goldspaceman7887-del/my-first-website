import { store } from "../core/storage.js";
import { el, blurActive } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { gradeItem, dueItems, newItems, overdueItems, reviewCounts, QUALITY, stepLabel } from "../core/srs.js";
import { addXP } from "../core/gamification.js";
import { CHARACTERS } from "../data/characters.js";
import { VOCABULARY } from "../data/vocabulary.js";
import { SENTENCES } from "../data/sentences.js";
import { ROADMAP_UNITS } from "../data/roadmap.js";
import { toneNumbers } from "../core/pinyin.js";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function resolveItem(srsItem) {
  const [type, ...rest] = srsItem.id.split("_");
  const dataId = rest.join("_");
  if (type === "character") return { type, data: CHARACTERS.find((c) => c.id === dataId) };
  if (type === "word") return { type, data: VOCABULARY.find((v) => v.id === dataId) };
  if (type === "sentence") return { type, data: SENTENCES.find((s) => s.id === dataId) };
  if (type === "roadmap") return { type, data: ROADMAP_UNITS.find((u) => u.id === dataId) };
  return { type, data: null };
}

function frontText(type, data) {
  if (type === "character") return data.char;
  if (type === "word") return data.word;
  if (type === "roadmap") return data.grammar.examples[0].zh;
  return data.zh;
}
function backPinyin(type, data) {
  if (type === "character") return `${data.pinyin} · ${toneNumbers(data.pinyin)}`;
  if (type === "roadmap") return data.grammar.examples[0].py;
  return data.pinyin || data.py;
}
function backMeaning(type, data) {
  if (type === "roadmap") return `${data.grammar.examples[0].en} — pattern: ${data.grammar.title}`;
  return data.meaning || data.en;
}

export function renderReview(container) {
  const state = { mode: "due", size: 10 };
  const counts = reviewCounts();
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🔁 Review"),
      el("p", {}, "Spaced repetition across characters, words, and sentence patterns — New → 1 → 3 → 7 → 14 → 30 → 60 days.")
    ])
  );

  container.appendChild(
    el("div", { class: "grid grid-4" }, [
      statCard("🈶", counts.byType.character?.due || 0, "Characters due"),
      statCard("🗂️", counts.byType.word?.due || 0, "Words due"),
      statCard("🧩", counts.byType.sentence?.due || 0, "Sentences due"),
      statCard("⏰", counts.overdue, "Overdue")
    ])
  );

  const modeRow = el("div", { class: "level-pills", style: "margin-top:1.25rem" }, [
    modePill("due", "🎯 Reviewing due"),
    modePill("new", "🆕 Learning new"),
    modePill("mixed", "🔀 Mixed")
  ]);
  const sizeRow = el("div", { class: "level-pills", style: "margin-top:.5rem" }, [
    sizePill(5),
    sizePill(10),
    sizePill(20)
  ]);
  container.appendChild(el("p", { class: "text-faint", style: "margin-top:1rem" }, "How many at a time, and learning something new vs. reviewing what's already due:"));
  container.appendChild(modeRow);
  container.appendChild(sizeRow);

  function modePill(id, label) {
    return el("button", { class: `level-pill ${state.mode === id ? "active" : ""}`, onclick: () => { state.mode = id; refreshPills(); render(); } }, label);
  }
  function sizePill(n) {
    return el("button", { class: `level-pill ${state.size === n ? "active" : ""}`, onclick: () => { state.size = n; refreshPills(); render(); } }, String(n));
  }
  function refreshPills() {
    modeRow.querySelectorAll(".level-pill").forEach((b, i) => b.classList.toggle("active", ["due", "new", "mixed"][i] === state.mode));
    sizeRow.querySelectorAll(".level-pill").forEach((b, i) => b.classList.toggle("active", [5, 10, 20][i] === state.size));
  }

  const body = el("div", {});
  container.appendChild(body);

  function newQueue() {
    const charFresh = newItems(CHARACTERS.map((c) => `character_${c.id}`)).map((id) => ({ id, stepIndex: 0, nextReview: 0 }));
    const wordFresh = newItems(VOCABULARY.map((v) => `word_${v.id}`)).map((id) => ({ id, stepIndex: 0, nextReview: 0 }));
    return shuffle([...charFresh, ...wordFresh]);
  }
  function dueQueue() {
    return [...dueItems()].sort((a, b) => a.nextReview - b.nextReview);
  }
  function buildQueue() {
    if (state.mode === "new") return newQueue().slice(0, state.size);
    if (state.mode === "mixed") return shuffle([...dueQueue(), ...newQueue()]).slice(0, state.size);
    return dueQueue().slice(0, state.size);
  }

  function render() {
    body.innerHTML = "";
    const queue = buildQueue();
    if (queue.length === 0) {
      body.appendChild(
        el("div", { class: "card empty-state" }, [
          el("div", { class: "empty-icon" }, "🎉"),
          el("h3", {}, state.mode === "new" ? "Nothing new left to learn right now" : "Nothing due right now"),
          el("p", {}, "Great work staying on top of reviews. Learn something new in Characters, Vocabulary, or Sentence Patterns, or try a Daily Lesson."),
          el("a", { class: "btn btn-primary", href: "#/daily-lesson" }, "Daily Lesson")
        ])
      );
      return;
    }

    let idx = 0;
    const counter = el("p", { class: "text-muted", style: "margin-top:1rem" }, `Item 1 of ${queue.length}`);
    const stage = el("div", { class: "flashcard-stage" });
    body.appendChild(counter);
    body.appendChild(stage);
    showItem();

    function showItem() {
      stage.innerHTML = "";
      const srsItem = queue[idx];
      const { type, data } = resolveItem(srsItem);
      if (!data) {
        idx++;
        if (idx >= queue.length) return finish();
        return showItem();
      }
      const card = el("div", { class: "flashcard" });
      const inner = el("div", { class: "flashcard-inner" }, [
        el("div", { class: "flashcard-face front" }, [
          el("span", { class: "badge badge-default" }, `${type} · ${stepLabel(srsItem)}`),
          el("div", { class: "flashcard-word hanzi" }, frontText(type, data)),
          el("div", { class: "flashcard-hint" }, "Tap to reveal")
        ]),
        el("div", { class: "flashcard-face back" }, [
          el("div", { class: "pinyin-lg" }, backPinyin(type, data)),
          el("div", { class: "flashcard-sub", style: "font-weight:700" }, backMeaning(type, data))
        ])
      ]);
      card.appendChild(inner);
      card.addEventListener("click", () => card.classList.toggle("flipped"));
      stage.appendChild(card);

      stage.appendChild(
        el("button", { class: "btn btn-sm", onclick: (e) => { e.stopPropagation(); audioEngine.speak(frontText(type, data)); } }, "🔊 Listen")
      );

      stage.appendChild(
        el("div", { class: "srs-rating-row" }, [
          ratingBtn("Again", QUALITY.AGAIN, "btn-danger"),
          ratingBtn("Hard", QUALITY.HARD, "btn"),
          ratingBtn("Good", QUALITY.GOOD, "btn"),
          ratingBtn("Easy", QUALITY.EASY, "btn-success")
        ])
      );
      counter.textContent = `Item ${idx + 1} of ${queue.length}`;
      if (store.state.settings.autoplayAudio) audioEngine.speak(frontText(type, data));

      function ratingBtn(label, quality, cls) {
        return el(
          "button",
          {
            class: `btn ${cls}`,
            onclick: () => {
              blurActive();
              gradeItem(srsItem.id, type, quality);
              addXP(quality >= 3 ? 3 : 1, `Review: ${frontText(type, data)}`);
              store.save();
              idx++;
              if (idx >= queue.length) finish();
              else showItem();
            }
          },
          label
        );
      }
    }

    function finish() {
      stage.innerHTML = "";
      counter.textContent = "";
      stage.appendChild(
        el("div", { class: "card empty-state pop-in" }, [
          el("div", { class: "empty-icon" }, "✅"),
          el("h3", {}, "Review session complete!"),
          el("a", { class: "btn btn-primary", href: "#/dashboard" }, "Back to dashboard")
        ])
      );
    }
  }

  render();

  function statCard(icon, value, label) {
    return el("div", { class: "card stat-card" }, [
      el("div", { class: "stat-icon" }, icon),
      el("div", { class: "stat-value" }, String(value)),
      el("div", { class: "stat-label" }, label)
    ]);
  }
}
