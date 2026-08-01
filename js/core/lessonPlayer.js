// Duolingo-style lesson runner: one question at a time, a top progress bar,
// a hearts counter, and a bottom feedback bar that slides up after every
// answer with a big Continue button. Ends in a celebration screen (or a
// gentle "out of hearts" screen).
//
// Each question is `{ render: (host, onResult) => void }` — the SAME
// contract as core/exercises.js's renderExercise(ex, {onResult}), so
// existing exercise renderers can be dropped straight in.

import { el, confettiBurst, blurActive } from "./ui.js";
import { getHearts, loseHeart, hasHearts, minutesUntilNextHeart } from "./hearts.js";
import { addXP } from "./gamification.js";

/**
 * @param {HTMLElement} container
 * @param {object} opts
 * @param {string} opts.title
 * @param {Array<{render:Function}>} opts.questions
 * @param {number} [opts.xpPerCorrect]
 * @param {Function} [opts.onExit] called once when the lesson session ends (finished, quit, or out of hearts)
 * @returns {Function} destroy — call to tear down the lesson (used as the route cleanup hook)
 */
export function runLesson(container, { title = "Lesson", questions, xpPerCorrect = 10, onExit }) {
  container.innerHTML = "";
  let idx = 0;
  let correctCount = 0;
  let answeredCount = 0;
  let sessionXP = 0;
  let destroyed = false;

  const shell = el("div", { class: "lesson-shell" });
  container.appendChild(shell);

  const exitBtn = el("button", { class: "lesson-exit-btn", "aria-label": "Exit lesson / Salir", onclick: handleExit }, "×");
  const progressFill = el("div", { class: "lesson-progress-fill", style: "width:0%" });
  const progressTrack = el("div", { class: "lesson-progress-track" }, [progressFill]);
  const heartsLabel = el("div", { class: "lesson-hearts" });
  shell.appendChild(el("div", { class: "lesson-topbar" }, [exitBtn, progressTrack, heartsLabel]));

  const host = el("div", { class: "lesson-question-host" });
  shell.appendChild(host);

  const bottomBar = el("div", { class: "lesson-bottom-bar" });
  document.body.appendChild(bottomBar); // fixed-to-viewport: must live outside any transformed ancestor

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    bottomBar.remove();
  }

  function handleExit() {
    if (answeredCount > 0 && idx < questions.length) {
      if (!confirm("End this lesson now? Your progress in this lesson won't be saved. / ¿Salir ahora?")) return;
    }
    destroy();
    onExit && onExit();
  }

  function updateHeartsLabel() {
    const h = getHearts();
    heartsLabel.textContent = `❤️ ${h.current}`;
  }

  function updateProgress() {
    const pct = questions.length ? Math.round((idx / questions.length) * 100) : 0;
    progressFill.style.width = pct + "%";
  }

  function showQuestion() {
    updateProgress();
    updateHeartsLabel();
    host.innerHTML = "";
    bottomBar.className = "lesson-bottom-bar";
    bottomBar.innerHTML = "";

    if (!hasHearts()) {
      renderOutOfHearts();
      return;
    }
    if (idx >= questions.length) {
      renderSummary();
      return;
    }

    const q = questions[idx];
    const card = el("div", { class: "card lesson-card pop-in" });
    host.appendChild(card);
    q.render(card, (correct, meta) => onAnswered(correct, meta));
  }

  function onAnswered(correct, meta = {}) {
    answeredCount++;
    blurActive();
    if (correct) {
      correctCount++;
      sessionXP += xpPerCorrect;
      addXP(xpPerCorrect, title);
    } else {
      loseHeart();
    }
    showFeedbackBar(correct, meta);
  }

  function showFeedbackBar(correct, meta) {
    updateHeartsLabel();
    bottomBar.className = `lesson-bottom-bar ${correct ? "correct" : "incorrect"}`;
    const textCol = el(
      "div",
      { class: "lesson-feedback-col" },
      [
        el("div", { class: `lesson-feedback-text ${correct ? "correct-text" : "incorrect-text"}` }, correct ? "Nice! · ¡Bien!" : "Not quite · Casi"),
        !correct && meta.correctText ? el("div", { class: "lesson-feedback-sub" }, `Correct answer: ${meta.correctText}`) : null,
        meta.explanation ? el("div", { class: "lesson-feedback-sub" }, meta.explanation) : null
      ].filter(Boolean)
    );
    const continueBtn = el(
      "button",
      { class: `btn btn-duo-cta ${correct ? "btn-success" : "btn-danger"}`, onclick: advance },
      "Continue"
    );
    bottomBar.appendChild(textCol);
    bottomBar.appendChild(continueBtn);
    requestAnimationFrame(() => {
      bottomBar.classList.add("show");
      continueBtn.focus();
    });
  }

  function advance() {
    idx++;
    showQuestion();
  }

  function statBox(value, label) {
    return el("div", { class: "lesson-summary-stat" }, [el("div", { class: "value" }, value), el("div", { class: "label" }, label)]);
  }

  function renderSummary() {
    bottomBar.remove();
    const accuracy = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 100;
    host.innerHTML = "";
    host.appendChild(
      el("div", { class: "lesson-summary pop-in" }, [
        el("div", { class: "summary-icon" }, accuracy >= 80 ? "🎉" : "💪"),
        el("h2", {}, accuracy >= 80 ? "Great job! · ¡Muy bien!" : "Nice effort! · ¡Buen intento!"),
        el("div", { class: "lesson-summary-stats" }, [
          statBox(`+${sessionXP}`, "XP"),
          statBox(`${accuracy}%`, "Accuracy"),
          statBox(`${getHearts().current}`, "Hearts left")
        ]),
        el(
          "button",
          {
            class: "btn btn-primary btn-lg btn-block",
            onclick: () => {
              destroy();
              onExit && onExit();
            }
          },
          "Continue · Continuar"
        )
      ])
    );
    confettiBurst();
  }

  function renderOutOfHearts() {
    bottomBar.remove();
    const mins = minutesUntilNextHeart();
    host.innerHTML = "";
    host.appendChild(
      el("div", { class: "lesson-summary pop-in" }, [
        el("div", { class: "summary-icon" }, "💔"),
        el("h2", {}, "Out of hearts for now"),
        el(
          "p",
          { class: "text-muted" },
          `No worries — this happens to everyone. Your next heart comes back in about ${mins} minute${mins === 1 ? "" : "s"}. Come back soon, or go review something you already know.`
        ),
        el(
          "button",
          {
            class: "btn btn-primary btn-lg btn-block",
            onclick: () => {
              destroy();
              onExit && onExit();
            }
          },
          "Done · Hecho"
        )
      ])
    );
  }

  showQuestion();
  return destroy;
}
