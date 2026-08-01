// ROADMAP MODE — a Duolingo-style path through 16 original beginner units.
// Each unit: review 5 sentences, take a 3-question quiz, unlock the next.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive, toast, progressBar } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday } from "../core/gamification.js";
import { ROADMAP_UNITS } from "../data/roadmap.js";

function completedSet() {
  return new Set(store.state.progress.roadmapUnitsCompleted || []);
}

function unitStatus(index, done) {
  if (done.has(ROADMAP_UNITS[index].id)) return "completed";
  if (index === 0 || done.has(ROADMAP_UNITS[index - 1].id)) return "unlocked";
  return "locked";
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuiz(unit) {
  const pool = unit.sentences;
  const picks = shuffle(pool).slice(0, 3);
  return picks.map((correct) => {
    const distractors = shuffle(pool.filter((s) => s !== correct)).slice(0, 2).map((s) => s.en);
    const options = shuffle([correct.en, ...distractors]);
    return { zh: correct.zh, py: correct.py, correct: correct.en, options };
  });
}

export function renderRoadmap(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🗺️ Roadmap"),
      el("p", {}, "A sentence-first path through beginner Mandarin — 16 units, each built around 5 real sentences you'll actually use, plus a quick check before the next one unlocks.")
    ])
  );

  const body = el("div", {});
  container.appendChild(body);
  showPath();

  function showPath() {
    body.innerHTML = "";
    const done = completedSet();

    body.appendChild(
      el("div", { class: "roadmap-progress-summary" }, [
        el("span", { class: "badge badge-gold" }, `${done.size} / ${ROADMAP_UNITS.length} units complete`),
        el("div", { style: "flex:1" }, [progressBar(Math.round((done.size / ROADMAP_UNITS.length) * 100))])
      ])
    );

    const path = el("div", { class: "roadmap-path" });
    ROADMAP_UNITS.forEach((unit, i) => {
      const status = unitStatus(i, done);
      const side = i % 3 === 0 ? "" : i % 3 === 1 ? "offset-left" : "offset-right";
      const row = el("div", { class: `roadmap-node-row ${side}` }, [
        el(
          "button",
          {
            class: `roadmap-node ${status}`,
            disabled: status === "locked" ? "true" : null,
            onclick: () => { if (status !== "locked") showUnit(unit); }
          },
          [
            el("div", { class: "roadmap-node-circle" }, status === "locked" ? "🔒" : status === "completed" ? "✓" : unit.icon),
            el("div", { class: "roadmap-node-label" }, unit.title)
          ]
        )
      ]);
      path.appendChild(row);
    });
    body.appendChild(path);
  }

  function showUnit(unit) {
    body.innerHTML = "";
    body.appendChild(el("button", { class: "btn btn-sm", onclick: showPath }, "← Roadmap"));
    body.appendChild(el("h2", { style: "margin-top:.75rem" }, `${unit.icon} ${unit.title} · ${unit.titleZh}`));
    runLearnStep();

    function runLearnStep() {
      const learnWrap = el("div", {});
      body.appendChild(learnWrap);
      learnWrap.appendChild(el("p", { class: "text-muted" }, "Read and listen to each sentence, then continue to a quick check."));
      unit.sentences.forEach((s) => {
        learnWrap.appendChild(
          el("div", { class: "roadmap-lesson-sentence" }, [
            el("div", { class: "flex justify-between items-center" }, [
              el("div", { class: "hanzi", style: "font-size:1.15rem" }, s.zh),
              el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(s.zh) }, "🔊")
            ]),
            el("div", { class: "pinyin" }, s.py),
            el("div", { class: "text-muted" }, s.en)
          ])
        );
      });
      const nextBtn = el("button", { class: "btn btn-primary", style: "margin-top:1rem", onclick: () => { learnWrap.remove(); nextBtn.remove(); runQuizStep(); } }, "Continue to quiz →");
      body.appendChild(nextBtn);
    }

    function runQuizStep() {
      const quiz = buildQuiz(unit);
      let qi = 0;
      let correctCount = 0;
      const quizWrap = el("div", { class: "card exercise-card" });
      body.appendChild(quizWrap);
      showQuestion();

      function showQuestion() {
        quizWrap.innerHTML = "";
        const q = quiz[qi];
        quizWrap.appendChild(el("p", { class: "text-faint" }, `Question ${qi + 1} of ${quiz.length}`));
        quizWrap.appendChild(el("div", { class: "flex justify-between items-center" }, [
          el("p", { class: "exercise-prompt hanzi" }, q.zh),
          el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(q.zh) }, "🔊")
        ]));
        quizWrap.appendChild(el("p", { class: "text-faint" }, q.py));
        const options = el(
          "div",
          { class: "option-list" },
          q.options.map((opt) =>
            el(
              "button",
              {
                class: "option-btn roadmap-quiz-option",
                onclick: (e) => {
                  blurActive();
                  const btn = e.currentTarget;
                  options.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
                  const isCorrect = opt === q.correct;
                  btn.classList.add(isCorrect ? "correct" : "incorrect");
                  if (!isCorrect) {
                    [...options.children].find((b) => b.textContent === q.correct)?.classList.add("correct");
                  } else {
                    correctCount++;
                  }
                  setTimeout(() => {
                    qi++;
                    if (qi < quiz.length) showQuestion();
                    else finishQuiz();
                  }, 900);
                }
              },
              opt
            )
          )
        );
        quizWrap.appendChild(options);
      }

      function finishQuiz() {
        quizWrap.innerHTML = "";
        const passed = correctCount >= 2;
        quizWrap.appendChild(
          el("div", { class: "empty-state" }, [
            el("div", { class: "empty-icon" }, passed ? "✅" : "🔁"),
            el("h3", {}, `${correctCount} / ${quiz.length} correct`),
            el("p", {}, passed ? "Unit complete — nice work!" : "Not quite — review the sentences and try the quiz again.")
          ])
        );
        if (passed) {
          const wasNew = !completedSet().has(unit.id);
          if (wasNew) {
            store.state.progress.roadmapUnitsCompleted = [...completedSet(), unit.id];
            registerStudyToday();
            addXP(15, `Roadmap unit: ${unit.title}`);
            store.save();
            toast(`Unit complete! +15 XP`, { type: "xp", icon: "⚡" });
          }
          quizWrap.appendChild(el("button", { class: "btn btn-primary", style: "margin-top:.75rem", onclick: showPath }, "Back to roadmap"));
        } else {
          quizWrap.appendChild(
            el("div", { class: "btn-row", style: "margin-top:.75rem" }, [
              el("button", { class: "btn btn-primary", onclick: () => { qi = 0; correctCount = 0; showQuestion(); } }, "Try quiz again"),
              el("button", { class: "btn", onclick: () => showUnit(unit) }, "Review sentences again")
            ])
          );
        }
      }
    }
  }
}
