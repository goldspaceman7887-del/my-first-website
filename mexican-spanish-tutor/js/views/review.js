import { store } from "../core/storage.js";
import { el, blurActive } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { gradeItem, dueItems, overdueItems, reviewCounts, QUALITY, stepLabel } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { VOCABULARY } from "../data/vocabulary.js";
import { SENTENCES } from "../data/sentences.js";

function resolveItem(srsItem) {
  const [type, ...rest] = srsItem.id.split("_");
  const dataId = rest.join("_");
  if (type === "word") return { type, data: VOCABULARY.find((v) => v.id === dataId) };
  if (type === "sentence") return { type, data: SENTENCES.find((s) => s.id === dataId) };
  return { type, data: null };
}

function frontText(type, data) {
  return type === "word" ? data.word : data.es;
}
function backSub(type, data) {
  return type === "word" ? `/${data.ipa}/` : "";
}
function backMeaning(type, data) {
  return data.meaning || data.en;
}

export function renderReview(container) {
  const counts = reviewCounts();
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🔁 Repaso / Review"),
      el("p", {}, "Spaced repetition across vocabulary and sentence patterns — New → 1 → 3 → 7 → 14 → 30 → 60 days.")
    ])
  );

  container.appendChild(
    el("div", { class: "grid grid-3" }, [
      statCard("🗂️", counts.byType.word?.due || 0, "Words due"),
      statCard("🧩", counts.byType.sentence?.due || 0, "Patterns due"),
      statCard("⏰", counts.overdue, "Overdue")
    ])
  );

  const due = dueItems();
  if (due.length === 0) {
    container.appendChild(
      el("div", { class: "card empty-state", style: "margin-top:1rem" }, [
        el("div", { class: "empty-icon" }, "🎉"),
        el("h3", {}, "Nothing due right now"),
        el("p", {}, "Great work staying on top of reviews. Learn something new in Vocabulario or Gramática, or try a Daily Lesson."),
        el("a", { class: "btn btn-primary", href: "#/daily-lesson" }, "Daily Lesson")
      ])
    );
    return;
  }

  let queue = [...due].sort((a, b) => a.nextReview - b.nextReview).slice(0, 30);
  let idx = 0;
  const counter = el("p", { class: "text-muted", style: "margin-top:1rem" }, `Item 1 of ${queue.length}`);
  const stage = el("div", { class: "flashcard-stage" });
  container.appendChild(counter);
  container.appendChild(stage);

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
        el("div", { class: "flashcard-word es-text" }, frontText(type, data)),
        el("div", { class: "flashcard-hint" }, "Tap to reveal")
      ]),
      el("div", { class: "flashcard-face back" }, [
        el("div", { class: "ipa-lg" }, backSub(type, data)),
        el("div", { class: "flashcard-sub", style: "font-weight:700" }, backMeaning(type, data))
      ])
    ]);
    card.appendChild(inner);
    card.addEventListener("click", () => card.classList.toggle("flipped"));
    stage.appendChild(card);

    stage.appendChild(
      el("button", { class: "btn btn-sm", onclick: (e) => { e.stopPropagation(); audioEngine.speak(frontText(type, data)); } }, "🔊 Escuchar")
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
            addXP(quality >= 3 ? 3 : 1, `Repaso: ${frontText(type, data)}`);
            updateSkillScore(type === "word" ? "vocabulary" : "grammar", quality >= 3 ? 1 : -0.5);
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

  showItem();

  function statCard(icon, value, label) {
    return el("div", { class: "card stat-card" }, [
      el("div", { class: "stat-icon" }, icon),
      el("div", { class: "stat-value" }, String(value)),
      el("div", { class: "stat-label" }, label)
    ]);
  }
}
