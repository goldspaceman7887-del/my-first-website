// ROADMAP MODE — a Duolingo-style path spanning all 9 ACTFL sub-levels,
// Novice Low through Advanced High. Each unit: learn 5 sentences + a
// grammar point, then a 6-exercise practice round (recognition, a
// grammar-specific drill, and typed free-recall production) before the
// next unit unlocks. Passing a unit also seeds it into the spaced-
// repetition Review queue, so it actually comes back later instead of
// being seen once and forgotten.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive, toast, progressBar } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday } from "../core/gamification.js";
import { gradeItem, QUALITY } from "../core/srs.js";
import { ROADMAP_UNITS, ACTFL_LEVELS, levelIndex } from "../data/roadmap.js";

function completedSet() {
  return new Set(store.state.progress.roadmapUnitsCompleted || []);
}

function unitStatus(index, done) {
  if (done.has(ROADMAP_UNITS[index].id)) return "completed";
  if (index === 0 || done.has(ROADMAP_UNITS[index - 1].id)) return "unlocked";
  return "locked";
}

// Current ACTFL tier = the tier of the next not-yet-completed unit, or the
// top tier once everything is done.
function currentLevel(done) {
  const nextUnit = ROADMAP_UNITS.find((u) => !done.has(u.id));
  const level = nextUnit ? nextUnit.level : ROADMAP_UNITS[ROADMAP_UNITS.length - 1].level;
  return ACTFL_LEVELS[levelIndex(level)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const STOPWORDS = new Set(["a", "an", "the", "is", "are", "am", "to", "i", "you", "he", "she", "it", "we", "they", "my", "your", "his", "her", "its", "our", "their", "and", "of", "in", "on", "at", "be", "do", "does", "for", "with"]);

function normalizeWords(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

// Lenient production check: at least half of the expected sentence's
// non-trivial content words need to show up in what the learner typed.
function lenientMatch(input, expected) {
  const inputWords = new Set(normalizeWords(input));
  const expectedWords = normalizeWords(expected).filter((w) => !STOPWORDS.has(w));
  if (expectedWords.length === 0) return inputWords.size > 0;
  const matched = expectedWords.filter((w) => inputWords.has(w)).length;
  return matched / expectedWords.length >= 0.5;
}

// 6 exercises per attempt: 3 recognition MC, 1 grammar-specific drill,
// 2 typed free-recall production -- covers all 5 taught sentences plus
// the unit's core grammar point, mixed and reshuffled on every attempt.
function buildPracticeSet(unit) {
  const pool = shuffle(unit.sentences);
  const mcPool = pool.slice(0, 3);
  const typedPool = pool.slice(3, 5);
  const exercises = [];

  mcPool.forEach((correct) => {
    const distractors = shuffle(unit.sentences.filter((s) => s !== correct)).slice(0, 2).map((s) => s.en);
    const options = shuffle([correct.en, ...distractors]);
    exercises.push({ type: "mc", zh: correct.zh, py: correct.py, correct: correct.en, options });
  });

  if (unit.drill) {
    exercises.push({ type: "drill", question: unit.drill.question, options: shuffle(unit.drill.options), answer: unit.drill.answer });
  }

  typedPool.forEach((s) => {
    exercises.push({ type: "typed", zh: s.zh, py: s.py, expected: s.en });
  });

  return shuffle(exercises);
}

function seedRoadmapReview(unit) {
  const id = `roadmap_${unit.id}`;
  if (store.state.srs[id]) return;
  gradeItem(id, "roadmap", QUALITY.GOOD);
}

export function renderRoadmap(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🗺️ Roadmap"),
      el("p", {}, "A sentence-first path from zero to ACTFL Advanced High — Novice Low through Advanced High, one unit at a time. Each unit: 5 real sentences, a grammar point, then a 6-exercise practice round (recognition, a grammar drill, and typed production) before the next one unlocks."),
      el("p", { class: "text-faint" }, "Passing a unit also adds it to your spaced-repetition Review queue, so it comes back later instead of being seen once and forgotten. A growing foundation, not a finished multi-year curriculum yet.")
    ])
  );

  const body = el("div", {});
  container.appendChild(body);
  showPath();

  function showPath() {
    body.innerHTML = "";
    const done = completedSet();
    const level = currentLevel(done);

    body.appendChild(
      el("div", { class: "roadmap-progress-summary" }, [
        el("span", { class: "badge badge-gold" }, `${done.size} / ${ROADMAP_UNITS.length} units complete`),
        el("span", { class: "badge badge-level" }, `Current tier: ${level.label}`),
        el("div", { style: "flex:1" }, [progressBar(Math.round((done.size / ROADMAP_UNITS.length) * 100))])
      ])
    );

    const path = el("div", { class: "roadmap-path" });
    let lastLevel = null;
    ROADMAP_UNITS.forEach((unit, i) => {
      if (unit.level !== lastLevel) {
        lastLevel = unit.level;
        const tier = ACTFL_LEVELS[levelIndex(unit.level)];
        path.appendChild(
          el("div", { class: "roadmap-tier-header" }, [
            el("h3", {}, tier.label),
            el("p", { class: "text-faint" }, tier.blurb)
          ])
        );
      }
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
    body.appendChild(el("span", { class: "badge badge-level", style: "margin-top:.75rem;display:inline-block" }, ACTFL_LEVELS[levelIndex(unit.level)].label));
    body.appendChild(el("h2", { style: "margin-top:.4rem" }, `${unit.icon} ${unit.title} · ${unit.titleZh}`));
    runLearnStep();

    function runLearnStep() {
      const learnWrap = el("div", {});
      body.appendChild(learnWrap);
      learnWrap.appendChild(el("p", { class: "text-muted" }, "Read and listen to each sentence, then continue to practice."));
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
      if (unit.grammar) {
        const g = unit.grammar;
        learnWrap.appendChild(
          el("div", { class: "card grammar-note", style: "margin-top:1rem;border-left:3px solid var(--accent)" }, [
            el("div", { class: "badge badge-gold" }, "📐 New Grammar Point"),
            el("h3", { style: "margin-top:.5rem" }, g.title),
            el("p", { style: "font-family:var(--font-zh);font-weight:700" }, g.pattern),
            el("p", { class: "text-muted" }, g.explain),
            el("div", {}, g.examples.map((ex) =>
              el("p", { style: "margin:.3rem 0" }, [
                el("span", { class: "hanzi" }, ex.zh),
                el("span", { class: "text-faint" }, ` — ${ex.py} — ${ex.en}`)
              ])
            )),
            g.commonMistake ? el("p", { class: "text-faint", style: "margin-top:.4rem" }, [el("strong", {}, "Watch out: "), g.commonMistake]) : null
          ].filter(Boolean))
        );
      }
      const nextBtn = el("button", { class: "btn btn-primary", style: "margin-top:1rem", onclick: () => { learnWrap.remove(); nextBtn.remove(); runPracticeStep(); } }, "Continue to practice →");
      body.appendChild(nextBtn);
    }

    function runPracticeStep() {
      let exercises = buildPracticeSet(unit);
      let qi = 0;
      let correctCount = 0;
      const practiceWrap = el("div", { class: "card exercise-card" });
      body.appendChild(practiceWrap);
      showExercise();

      function markResult(isCorrect, resultNode) {
        blurActive();
        if (isCorrect) correctCount++;
        practiceWrap.appendChild(resultNode);
        setTimeout(() => {
          qi++;
          if (qi < exercises.length) showExercise();
          else finishPractice();
        }, isCorrect ? 900 : 1600);
      }

      function showExercise() {
        practiceWrap.innerHTML = "";
        const q = exercises[qi];
        practiceWrap.appendChild(el("p", { class: "text-faint" }, `Exercise ${qi + 1} of ${exercises.length}`));

        if (q.type === "mc") {
          practiceWrap.appendChild(el("div", { class: "flex justify-between items-center" }, [
            el("p", { class: "exercise-prompt hanzi" }, q.zh),
            el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(q.zh) }, "🔊")
          ]));
          practiceWrap.appendChild(el("p", { class: "text-faint" }, q.py));
          const options = el("div", { class: "option-list" }, q.options.map((opt) =>
            el("button", { class: "option-btn", onclick: (e) => {
              const btn = e.currentTarget;
              options.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
              const isCorrect = opt === q.correct;
              btn.classList.add(isCorrect ? "correct" : "incorrect");
              if (!isCorrect) [...options.children].find((b) => b.textContent === q.correct)?.classList.add("correct");
              markResult(isCorrect, el("div"));
            } }, opt)
          ));
          practiceWrap.appendChild(options);
        } else if (q.type === "drill") {
          practiceWrap.appendChild(el("div", { class: "badge badge-gold" }, "📐 Grammar drill"));
          practiceWrap.appendChild(el("p", { class: "exercise-prompt hanzi", style: "margin-top:.4rem" }, q.question));
          const options = el("div", { class: "option-list" }, q.options.map((opt) =>
            el("button", { class: "option-btn", onclick: (e) => {
              const btn = e.currentTarget;
              options.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
              const isCorrect = opt === q.answer;
              btn.classList.add(isCorrect ? "correct" : "incorrect");
              if (!isCorrect) [...options.children].find((b) => b.textContent === q.answer)?.classList.add("correct");
              markResult(isCorrect, el("div"));
            } }, opt)
          ));
          practiceWrap.appendChild(options);
        } else {
          // typed production: listen/read the Chinese, type the English meaning
          practiceWrap.appendChild(el("div", { class: "badge badge-gold" }, "✍️ Your turn"));
          practiceWrap.appendChild(el("div", { class: "flex justify-between items-center", style: "margin-top:.4rem" }, [
            el("p", { class: "exercise-prompt hanzi" }, q.zh),
            el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(q.zh) }, "🔊")
          ]));
          practiceWrap.appendChild(el("p", { class: "text-faint" }, q.py));
          practiceWrap.appendChild(el("p", { class: "text-muted" }, "Type what this means in English."));
          const input = el("input", { type: "text", placeholder: "Type the English meaning..." });
          input.style.cssText = "width:100%;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1rem;";
          const submit = el("button", { class: "btn btn-primary", style: "margin-top:.6rem", onclick: check }, "Check");
          input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
          practiceWrap.appendChild(input);
          practiceWrap.appendChild(submit);
          input.focus();

          function check() {
            const text = input.value.trim();
            if (!text) { toast("Type your answer first.", { type: "error" }); return; }
            input.disabled = true;
            submit.disabled = true;
            const isCorrect = lenientMatch(text, q.expected);
            const feedback = el("div", { class: `feedback-block ${isCorrect ? "correct" : "incorrect"}`, style: "margin-top:.6rem" }, [
              el("p", {}, isCorrect ? "Nice — that's right!" : `Close — expected something like: "${q.expected}"`)
            ]);
            markResult(isCorrect, feedback);
          }
        }
      }

      function finishPractice() {
        practiceWrap.innerHTML = "";
        const passed = correctCount >= 5;
        practiceWrap.appendChild(
          el("div", { class: "empty-state" }, [
            el("div", { class: "empty-icon" }, passed ? "✅" : "🔁"),
            el("h3", {}, `${correctCount} / ${exercises.length} correct`),
            el("p", {}, passed ? "Unit complete — nice work!" : "Not quite there — review the sentences and grammar point, then try a fresh set of exercises.")
          ])
        );
        if (passed) {
          const wasNew = !completedSet().has(unit.id);
          if (wasNew) {
            store.state.progress.roadmapUnitsCompleted = [...completedSet(), unit.id];
            registerStudyToday();
            addXP(15, `Roadmap unit: ${unit.title}`);
            seedRoadmapReview(unit);
            store.save();
            toast("Unit complete! +15 XP · added to your Review queue", { type: "xp", icon: "⚡" });
          }
          practiceWrap.appendChild(el("button", { class: "btn btn-primary", style: "margin-top:.75rem", onclick: showPath }, "Back to roadmap"));
        } else {
          practiceWrap.appendChild(
            el("div", { class: "btn-row", style: "margin-top:.75rem" }, [
              el("button", { class: "btn btn-primary", onclick: () => { exercises = buildPracticeSet(unit); qi = 0; correctCount = 0; showExercise(); } }, "Try a fresh set"),
              el("button", { class: "btn", onclick: () => showUnit(unit) }, "Review sentences again")
            ])
          );
        }
      }
    }
  }
}
