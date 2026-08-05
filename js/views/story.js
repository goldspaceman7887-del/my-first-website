// STORY MODE — short graded-reading stories with tap-to-define words and a
// comprehension check at the end. Mirrors the list/detail pattern used by
// views/reading.js and views/dialogues.js: same tap-word wiring, same
// audio-read-aloud controls, same "mark complete → XP" flow, so it feels
// like a native part of the app rather than a bolt-on.

import { store } from "../core/storage.js";
import { el, toast, progressBar, confettiBurst } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { gradeItem, QUALITY } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { tappable, initTapWords } from "../core/tapword.js";
import { renderExercise } from "../core/exercises.js";
import { STORIES } from "../data/stories.js";

const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1"];

function parseQuery() {
  return new URLSearchParams((window.location.hash.split("?")[1]) || "");
}

function levelVariant(level) {
  if (level === "A1" || level === "A2") return "novice";
  if (level === "B1" || level === "B2") return "intermediate";
  return "advanced";
}

// ---------- List view: #/story ----------
export function renderStoryList(container) {
  const query = parseQuery();
  const levelFilter = query.get("level");
  const completed = new Set(store.state.progress.readingCompleted);

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "📚 Modo Historia · Story Mode"),
      el("p", {}, "Short graded-reading stories set in Spain, from A1 to C1. Tap any word for its meaning, listen to it read aloud, then answer a few questions."),
      el("p", { class: "text-faint" }, "Historias breves ambientadas en España, con palabras tocables y preguntas de comprensión al final.")
    ])
  );

  const levels = [...new Set(STORIES.map((s) => s.level))].sort(
    (a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b)
  );
  const pills = el(
    "div",
    { class: "level-pills" },
    [{ id: null, label: "Todos" }, ...levels.map((l) => ({ id: l, label: l }))].map((l) =>
      el(
        "button",
        {
          class: `level-pill ${levelFilter === l.id ? "active" : ""}`,
          onclick: () => (window.location.hash = l.id ? `#/story?level=${l.id}` : "#/story")
        },
        l.label
      )
    )
  );
  container.appendChild(pills);

  const progressLine = el(
    "p",
    { class: "text-muted" },
    `${completed.size} historias leídas de ${STORIES.length} · ${completed.size} of ${STORIES.length} stories read`
  );
  container.appendChild(progressLine);

  const grid = el("div", { class: "grid grid-3" });
  const shown = STORIES.filter((s) => !levelFilter || s.level === levelFilter).sort(
    (a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)
  );
  shown.forEach((s) => {
    grid.appendChild(
      el("a", { class: "card card-link", href: `#/story/${s.id}` }, [
        el("div", { class: "flex justify-between items-center" }, [
          el("span", { class: `badge badge-${levelVariant(s.level)}` }, s.level),
          completed.has(s.id)
            ? el("span", { class: "badge badge-success" }, "✓ Leída")
            : el("span", { class: "badge badge-default" }, `${s.paragraphs.length} párrafos`)
        ]),
        el("h3", { style: "margin:.5rem 0 .3rem" }, s.title),
        el("p", { class: "text-muted", style: "font-size:.85rem" }, s.summary)
      ])
    );
  });
  container.appendChild(grid);
  if (!shown.length) {
    container.appendChild(el("div", { class: "empty-state" }, "No hay historias en este nivel todavía."));
  }
}

// ---------- Detail view: #/story/:id ----------
export function renderStoryDetail(container, params) {
  const s = STORIES.find((x) => x.id === (params && params.id));
  if (!s) {
    container.appendChild(el("div", { class: "card" }, "Historia no encontrada."));
    return;
  }

  const alreadyDone = store.state.progress.readingCompleted.includes(s.id);

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("a", { href: "#/story", class: "text-muted" }, "← Modo Historia"),
      el("h1", { style: "margin-top:.5rem" }, s.title),
      el("div", { class: "flex gap-1" }, [
        el("span", { class: `badge badge-${levelVariant(s.level)}` }, s.level),
        alreadyDone ? el("span", { class: "badge badge-success" }, "✓ Leída") : null
      ].filter(Boolean)),
      el("p", { class: "text-muted" }, s.summary)
    ])
  );

  // Full-story audio controls, same pattern as reading.js.
  const fullText = s.paragraphs.join(" ");
  const textCard = el("div", { class: "card" });
  textCard.appendChild(
    el("div", { class: "audio-controls-row" }, [
      el("strong", {}, "🔊 Audio:"),
      el("button", { class: "btn btn-sm", onclick: () => audioEngine.speak(fullText, { rate: store.state.settings.slowVoiceRate }) }, "🐢 Escuchar lento"),
      el("button", { class: "btn btn-sm", onclick: () => audioEngine.speak(fullText) }, "🔊 Escuchar todo"),
      el("button", { class: "btn btn-sm btn-ghost", onclick: () => audioEngine.stop() }, "⏹ Parar")
    ])
  );

  // Paragraph by paragraph, each tappable and each individually replayable.
  const paraWrap = el("div", { style: "font-family:var(--font-es);font-size:1.08rem;line-height:1.8;margin-top:.5rem" });
  s.paragraphs.forEach((p) => {
    paraWrap.appendChild(
      el("div", { class: "flex justify-between items-start", style: "gap:.5rem;margin-bottom:.9rem" }, [
        el("p", { class: "tappable-line", style: "margin:0;flex:1" }, [tappable(p)]),
        el(
          "button",
          {
            class: "play-btn",
            style: "width:34px;height:34px;flex-shrink:0",
            onclick: async (e) => {
              e.currentTarget.classList.add("playing");
              await audioEngine.speak(p);
              e.currentTarget.classList.remove("playing");
            }
          },
          "🔊"
        )
      ])
    );
  });
  textCard.appendChild(paraWrap);
  container.appendChild(textCard);

  // Comprehension check.
  container.appendChild(el("h2", { style: "margin-top:1.25rem" }, "Preguntas de comprensión · Comprehension check"));
  const qCard = el("div", { class: "card" });
  const total = s.comprehensionQuestions.length;
  const answered = new Set();
  let correctCount = 0;

  const progressWrap = el("div", { style: "margin-bottom:1rem" });
  qCard.appendChild(progressWrap);
  function refreshProgress() {
    progressWrap.innerHTML = "";
    progressWrap.appendChild(
      progressBar(Math.round((answered.size / total) * 100), { label: `${answered.size} / ${total}` })
    );
  }
  refreshProgress();

  s.comprehensionQuestions.forEach((ex, i) => {
    const qWrap = el("div", { style: "margin-bottom:1.25rem" });
    qWrap.appendChild(
      renderExercise(ex, {
        onResult: (correct) => {
          if (!answered.has(i)) {
            answered.add(i);
            if (correct) correctCount++;
            refreshProgress();
            if (answered.size === total) finishStory();
          }
        }
      })
    );
    qCard.appendChild(qWrap);
  });
  container.appendChild(qCard);

  const doneNote = el("div", { class: "hidden" });
  container.appendChild(doneNote);

  let markedDone = false;
  function finishStory() {
    if (markedDone) return;
    markedDone = true;
    const wasNew = !store.state.progress.readingCompleted.includes(s.id);
    if (wasNew) {
      store.state.progress.readingCompleted.push(s.id);
      gradeItem(`story_${s.id}`, "reading", correctCount === total ? QUALITY.EASY : QUALITY.GOOD);
      addXP(12, `Historia: ${s.title}`);
      updateSkillScore("vocabulary", 1.5);
      store.save();
      confettiBurst();
      toast(`¡Historia completada! ${correctCount}/${total} correctas · +12 XP`, { type: "xp", icon: "⚡" });
    } else {
      toast(`Repaso completado: ${correctCount}/${total} correctas`, { icon: "📚" });
    }
    doneNote.classList.remove("hidden");
    doneNote.innerHTML = "";
    doneNote.appendChild(
      el("div", { class: "card", style: "margin-top:1rem;text-align:center" }, [
        el("p", { style: "font-weight:700;margin:0 0 .4rem" }, "✓ Historia completada"),
        el("a", { href: "#/story", class: "btn btn-primary" }, "← Volver a Modo Historia")
      ])
    );
  }

  return initTapWords();
}
