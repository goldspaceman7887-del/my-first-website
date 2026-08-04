import { store } from "../core/storage.js";
import { el, blurActive, toast, xpToast } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { tappable, initTapWords } from "../core/tapword.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { gradeItem, QUALITY } from "../core/srs.js";
import { DIALOGUES } from "../data/dialogues.js";

function isDone(id) {
  return store.state.progress.dialoguesCompleted.includes(id);
}

export function renderDialogueList(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "💬 Diálogos"),
      el("p", {}, "16 realistic Mexican Spanish conversations — greetings through Advanced Low argumentation. Listen, read along, and check comprehension. These same scenarios power Roleplay Mode.")
    ])
  );

  const list = el("div", { class: "grid grid-auto" });
  container.appendChild(list);
  DIALOGUES.forEach((d) => {
    list.appendChild(
      el("a", { class: "card card-link", href: `#/dialogues/${d.id}` }, [
        el("div", { class: "flex justify-between items-center" }, [
          el("span", { class: "badge badge-default" }, d.scenario),
          isDone(d.id) ? el("span", { class: "badge badge-success" }, "✓ Done") : null
        ].filter(Boolean)),
        el("h3", { style: "margin:.5rem 0 .2rem" }, d.title),
        el("p", { class: "text-muted" }, d.titleEs)
      ])
    );
  });
}

export function renderDialogueDetail(container, params) {
  const teardownTapWords = initTapWords();
  const d = DIALOGUES.find((x) => x.id === params.id);
  if (!d) {
    container.appendChild(el("div", { class: "card empty-state" }, [el("h3", {}, "Dialogue not found"), el("a", { class: "btn", href: "#/learn/dialogues" }, "Back to dialogues")]));
    return;
  }

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("a", { class: "text-muted", href: "#/learn/dialogues" }, "← All dialogues"),
      el("h1", {}, `${d.title} · ${d.titleEs}`)
    ])
  );

  container.appendChild(
    el("div", { class: "audio-controls-row" }, [
      el("button", { class: "btn btn-sm", onclick: () => playAll(1) }, "▶️ Play all"),
      el("button", { class: "btn btn-sm", onclick: () => playAll(0.6) }, "🐢 Play all (slow)"),
      el("a", { class: "btn btn-sm", href: "#/practice/roleplay" }, "🎭 Practice as roleplay")
    ])
  );

  const script = el("div", {});
  container.appendChild(script);
  d.lines.forEach((l) => {
    script.appendChild(
      el("div", { class: "dialogue-line" }, [
        el("span", { class: "speaker-tag" }, l.spk),
        el("div", { class: "line-content" }, [
          // Tap any word in a dialogue line for its meaning.
          el("div", { class: "line-es" }, [tappable(l.es)]),
          el("div", { class: "line-en" }, l.en)
        ]),
        el("div", { class: "line-controls" }, [el("button", { class: "play-btn", onclick: () => audioEngine.speak(l.es) }, "🔊")])
      ])
    );
  });

  function playAll(rate) {
    let i = 0;
    const step = () => {
      if (i >= d.lines.length) return;
      audioEngine.speak(d.lines[i].es, { rate, onend: () => { i++; setTimeout(step, 250); } });
    };
    step();
  }

  container.appendChild(el("h3", { style: "margin-top:1.5rem" }, "Key vocabulary"));
  container.appendChild(
    el("div", { class: "flex gap-2 flex-wrap" }, d.vocabHighlights.map((v) => el("span", { class: "badge badge-default" }, `${v.w} — ${v.en}`)))
  );

  if (d.culturalNote) {
    container.appendChild(
      el("div", { class: "culture-note-block", style: "margin-top:1rem" }, [el("h4", {}, "Mexican usage note"), el("p", {}, d.culturalNote)])
    );
  }

  container.appendChild(el("h3", { style: "margin-top:1.5rem" }, "Comprehension check"));
  const quiz = el("div", { class: "card exercise-card" });
  container.appendChild(quiz);

  let correctCount = 0;
  let answered = 0;
  d.comprehension.forEach((q, qi) => {
    const qWrap = el("div", {});
    qWrap.appendChild(el("p", { class: "exercise-prompt" }, q.q));
    const options = el(
      "div",
      { class: "option-list" },
      q.options.map((opt, oi) =>
        el(
          "button",
          {
            class: "option-btn",
            onclick: (e) => {
              const btn = e.currentTarget;
              options.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
              const correct = oi === q.answerIndex;
              btn.classList.add(correct ? "correct" : "incorrect");
              if (!correct) options.children[q.answerIndex].classList.add("correct");
              answered++;
              if (correct) correctCount++;
              if (answered === d.comprehension.length) finishQuiz();
            }
          },
          opt
        )
      )
    );
    qWrap.appendChild(options);
    quiz.appendChild(qWrap);
  });

  function finishQuiz() {
    // Feed the dialogue into spaced repetition so it comes back around
    // instead of being a one-and-done read.
    const ratio = correctCount / Math.max(1, d.comprehension.length);
    gradeItem(`dialogue_${d.id}`, "dialogue", ratio >= 1 ? QUALITY.EASY : ratio >= 0.5 ? QUALITY.GOOD : QUALITY.AGAIN);
    const wasNew = !isDone(d.id);
    if (wasNew) {
      store.state.progress.dialoguesCompleted.push(d.id);
      const xp = 5 + correctCount * 2;
      addXP(xp, `Diálogo: ${d.title}`);
      updateSkillScore("listening", 2);
      updateSkillScore("reading", 1);
      xpToast(xp, d.title);
      store.save();
    }
    toast(`Comprensión: ${correctCount}/${d.comprehension.length} correctas`, { icon: "✅" });
  }
  return teardownTapWords;
}
