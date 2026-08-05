// LEVEL TEST — a short, adaptive-feeling CEFR placement test.
//
// Questions are pulled straight from GRAMMAR[].exercises plus vocabulary-
// based "what does this mean?" questions built with the shared distractor
// engine. A simple staircase adjusts difficulty as you go: two correct
// answers in a row at a level bumps you up a tier, two wrong in a row stops
// the test and places you one tier below where you were. The whole thing
// is designed to feel calm — no shame language, no red "you failed" marks,
// and it's explicitly fine to guess.

import { store } from "../core/storage.js";
import { el, toast, progressBar, confettiBurst, blurActive } from "../core/ui.js";
import { renderExercise } from "../core/exercises.js";
import { addXP } from "../core/gamification.js";
import { GRAMMAR } from "../data/grammar.js";
import { VOCABULARY } from "../data/vocabulary.js";
import { englishDistractors } from "../core/distractors.js";

const LEVELS = ["A0", "A1", "A2", "B1", "B2", "C1"];

const LEVEL_LABELS = {
  A0: "A0 · Total beginner / Principiante absoluto",
  A1: "A1 · Beginner / Principiante",
  A2: "A2 · Elementary / Elemental",
  B1: "B1 · Intermediate / Intermedio",
  B2: "B2 · Upper-intermediate / Intermedio alto",
  C1: "C1 · Advanced / Avanzado"
};

const LEVEL_DESCRIPTIONS = {
  A0: "You're just getting started. You may know a handful of words and phrases — greetings, numbers, a few basics — and everything else is still new. That's a completely normal, good place to begin: every fluent speaker started exactly here.",
  A1: "You can handle very simple, everyday exchanges: introducing yourself, ordering food, asking basic questions. You lean on memorised phrases more than on building sentences freely, and that's expected at this stage.",
  A2: "You can talk about familiar topics — your routine, your family, shopping, simple travel situations — using short, connected sentences, even if you sometimes pause to find a word.",
  B1: "You can hold your own in most everyday situations: describing experiences, giving simple opinions, sorting out minor problems while travelling. You'll still make mistakes with tenses or word order sometimes, but people understand you without much effort.",
  B2: "You can discuss a fairly wide range of topics, including some abstract ones, with reasonable fluency and few misunderstandings. Spontaneous conversation feels comfortable most of the time.",
  C1: "You use Spanish flexibly and effectively for social, everyday, and even more complex or abstract purposes, with only occasional small gaps. This is an advanced, confident level."
};

const MAX_QUESTIONS = 20;
const MIN_BEFORE_EARLY_STOP = 3; // don't conclude from just 2 unlucky guesses

function shuffle(arr) {
  const r = arr.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

// Turns a vocabulary entry into a multiple-choice exercise shaped exactly
// like the ones in GRAMMAR[].exercises, so renderExercise() can't tell the
// difference.
function buildVocabExercise(item, levelPool) {
  const pool = levelPool.filter((v) => v.id !== item.id).map((v) => v.en);
  let wrong = englishDistractors(item.en, 3, pool);
  if (wrong.length < 3) {
    const extra = shuffle(VOCABULARY.filter((v) => v.id !== item.id && v.en !== item.en && !wrong.includes(v.en)));
    for (const v of extra) {
      if (wrong.length >= 3) break;
      wrong.push(v.en);
    }
  }
  const options = shuffle([item.en, ...wrong]);
  return {
    type: "multiple-choice",
    prompt: `¿Qué significa "${item.es}"? / What does "${item.es}" mean?`,
    options,
    answer: item.en,
    explanation: item.exampleEs ? `${item.exampleEs} — ${item.exampleEn}` : `"${item.es}" means "${item.en}".`
  };
}

function grammarBankForLevel(level) {
  const out = [];
  GRAMMAR.filter((g) => g.level === level).forEach((g) => {
    (g.exercises || []).forEach((ex) => out.push({ ex, source: "grammar" }));
  });
  return out;
}

function vocabBankForLevel(level, limit = 6) {
  const items = VOCABULARY.filter((v) => v.level === level);
  if (!items.length) return [];
  return shuffle(items)
    .slice(0, Math.min(limit, items.length))
    .map((v) => ({ ex: buildVocabExercise(v, items), source: "vocab" }));
}

function buildBank() {
  const bank = {};
  LEVELS.forEach((lvl) => {
    bank[lvl] = shuffle([...grammarBankForLevel(lvl), ...vocabBankForLevel(lvl)]);
  });
  return bank;
}

// Pops the next question for a level; if that level's queue has run dry
// (shouldn't normally happen, given the data volume), borrows from the
// closest level with anything left rather than dead-ending the test.
function nextQuestion(bank, level) {
  if (bank[level].length) return bank[level].pop();
  const idx = LEVELS.indexOf(level);
  for (let d = 1; d < LEVELS.length; d++) {
    const below = LEVELS[idx - d];
    const above = LEVELS[idx + d];
    if (below && bank[below].length) return bank[below].pop();
    if (above && bank[above].length) return bank[above].pop();
  }
  return null;
}

export function renderLevelTest(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "📊 Prueba de nivel · Level Test"),
      el("p", {}, "A short, adaptive check of where your Spanish is right now — helps make sure the rest of the app is pitched at the right level for you.")
    ])
  );

  const body = el("div", {});
  container.appendChild(body);
  showIntro();

  function showIntro() {
    body.innerHTML = "";
    const currentLevel = store.state.profile.level || "A0";
    body.appendChild(
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "How this works / Cómo funciona"),
        el("p", { class: "text-muted" }, "You'll get a short series of questions — usually somewhere around 15 to 20. They start around a beginner level and adjust as you go: answer well and the questions get a bit harder, miss a couple and it eases off and wraps up. There's no clock and no rush."),
        el("p", { class: "text-muted" }, "It's completely fine to guess if you're not sure — that's how a placement test is supposed to work, and there's nothing to lose. This isn't a school exam and nothing here is scored against you."),
        el("p", { class: "text-faint" }, `Your saved level right now: ${LEVEL_LABELS[currentLevel] || currentLevel}.`),
        el(
          "button",
          { class: "btn btn-primary btn-lg", style: "margin-top:.5rem", onclick: startTest },
          "Empezar · Start the test"
        )
      ])
    );
  }

  function startTest() {
    const bank = buildBank();
    let levelIdx = 1; // start around A1, as a gentle warm-up
    let totalAsked = 0;
    let levelAsked = 0;
    let levelCorrect = 0;
    let consecCorrect = 0;
    let consecWrong = 0;
    let minLevelSeen = LEVELS[levelIdx];
    let maxLevelSeen = LEVELS[levelIdx];

    body.innerHTML = "";
    const head = el("div", { class: "card", style: "margin-bottom:.75rem" });
    const barWrap = el("div", { style: "margin-top:.6rem" });
    const countLabel = el("span", { class: "text-faint" }, "");
    head.appendChild(
      el("div", { class: "flex justify-between items-center", style: "flex-wrap:wrap;gap:.5rem" }, [
        el("span", { style: "font-weight:700" }, "Finding your level... / Buscando tu nivel..."),
        countLabel
      ])
    );
    head.appendChild(barWrap);
    body.appendChild(head);

    const qWrap = el("div", {});
    body.appendChild(qWrap);

    const exitRow = el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("a", { class: "btn btn-ghost", href: "#/dashboard" }, "Salir sin guardar · Exit without saving")
    ]);
    body.appendChild(exitRow);

    askNext();

    function updateHeader() {
      const pct = Math.min(92, Math.round((totalAsked / 16) * 100));
      barWrap.innerHTML = "";
      barWrap.appendChild(progressBar(pct));
      countLabel.textContent = `Question ${totalAsked + 1}`;
    }

    function askNext() {
      updateHeader();
      const level = LEVELS[levelIdx];
      const item = nextQuestion(bank, level);
      qWrap.innerHTML = "";

      if (!item) {
        // Ran out of material for this stretch of the test — a graceful stop
        // rather than an error.
        return finish(levelIdx);
      }

      const card = el("div", { class: "card" });
      card.appendChild(renderExercise(item.ex, { onResult: (correct) => handleResult(correct, card) }));
      qWrap.appendChild(card);
    }

    function handleResult(correct, card) {
      totalAsked++;
      levelAsked++;
      if (correct) {
        levelCorrect++;
        consecCorrect++;
        consecWrong = 0;
      } else {
        consecWrong++;
        consecCorrect = 0;
      }

      const currentLevel = LEVELS[levelIdx];
      if (LEVELS.indexOf(minLevelSeen) > levelIdx) minLevelSeen = currentLevel;
      if (LEVELS.indexOf(maxLevelSeen) < levelIdx) maxLevelSeen = currentLevel;

      const atTop = levelIdx === LEVELS.length - 1;
      const readyToStop = totalAsked >= MIN_BEFORE_EARLY_STOP;
      let decision = null; // "up" | "stop" | null (keep going at this level)

      if (consecCorrect >= 2) decision = "up";
      else if (consecWrong >= 2 && readyToStop) decision = "stop";
      else if (levelAsked >= 4) decision = levelCorrect / levelAsked >= 0.5 ? "up" : "stop";

      const continueBtn = el(
        "button",
        {
          class: "btn btn-primary",
          style: "margin-top:.75rem",
          onclick: () => {
            blurActive();
            if (decision === "stop") {
              finish(Math.max(0, levelIdx - 1));
            } else if (decision === "up" && atTop) {
              finish(levelIdx); // already at the top tier, nowhere higher to go
            } else if (decision === "up") {
              levelIdx++;
              consecCorrect = 0;
              consecWrong = 0;
              levelAsked = 0;
              levelCorrect = 0;
              if (totalAsked >= MAX_QUESTIONS) finish(levelIdx);
              else askNext();
            } else if (totalAsked >= MAX_QUESTIONS) {
              finish(levelIdx);
            } else {
              askNext();
            }
          }
        },
        "Continuar · Continue →"
      );
      card.appendChild(continueBtn);
      continueBtn.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function finish(estimatedIdx) {
      const level = LEVELS[Math.max(0, Math.min(LEVELS.length - 1, estimatedIdx))];
      addXP(10, "Prueba de nivel completada");
      confettiBurst();
      showResults(level, minLevelSeen, maxLevelSeen, totalAsked);
    }
  }

  function showResults(level, minLevelSeen, maxLevelSeen, totalAsked) {
    body.innerHTML = "";
    const currentLevel = store.state.profile.level || "A0";

    const resultCard = el("div", { class: "card pop-in", style: "text-align:center" }, [
      el("div", { style: "font-size:2.5rem" }, "📊"),
      el("p", { class: "text-muted", style: "margin:.2rem 0 0" }, "Your estimated level right now / Tu nivel estimado"),
      el("h2", { style: "margin:.3rem 0" }, `Your estimated level is ${level}`),
      el("span", { class: "badge badge-level" }, LEVEL_LABELS[level]),
      el("p", { class: "text-muted", style: "margin-top:.8rem;text-align:left" }, LEVEL_DESCRIPTIONS[level]),
      el(
        "p",
        { class: "text-faint", style: "margin-top:.6rem" },
        `Based on ${totalAsked} question${totalAsked === 1 ? "" : "s"}, spanning roughly ${LEVEL_LABELS[minLevelSeen].split(" ·")[0]} to ${LEVEL_LABELS[maxLevelSeen].split(" ·")[0]}.`
      )
    ]);
    body.appendChild(resultCard);

    const actionCard = el("div", { class: "card", style: "margin-top:1rem" }, [
      el("div", { class: "card-title" }, "What would you like to do?"),
      el(
        "p",
        { class: "text-muted" },
        currentLevel === level
          ? `This matches your currently saved level (${currentLevel}), so there's nothing you have to change.`
          : `Your saved level is currently ${currentLevel}. You can update it to ${level}, or leave it as it is — either is fine.`
      )
    ]);
    const btnRow = el("div", { class: "btn-row", style: "margin-top:.5rem" });
    const afterRow = el("div", { style: "margin-top:.9rem" });

    const acceptBtn = el(
      "button",
      {
        class: "btn btn-primary",
        onclick: () => {
          store.set("profile.level", level);
          store.save();
          toast(`Level updated to ${level}`, { icon: "🎉" });
          acceptBtn.disabled = true;
          keepBtn.disabled = true;
          afterRow.innerHTML = "";
          afterRow.appendChild(
            el("div", { class: "flex-col gap-2" }, [
              el("p", { class: "text-muted" }, `Your level is now set to ${level}. Head to your roadmap or dashboard to keep going.`),
              el("div", { class: "btn-row" }, [
                el("a", { class: "btn btn-primary", href: "#/roadmap" }, "Ir al roadmap · Go to roadmap"),
                el("a", { class: "btn", href: "#/dashboard" }, "Ir al panel · Go to dashboard")
              ])
            ])
          );
        }
      },
      `Usar este nivel · Use ${level}`
    );
    const keepBtn = el(
      "button",
      {
        class: "btn btn-ghost",
        onclick: () => {
          acceptBtn.disabled = true;
          keepBtn.disabled = true;
          afterRow.innerHTML = "";
          afterRow.appendChild(
            el("div", { class: "flex-col gap-2" }, [
              el("p", { class: "text-muted" }, `No changes made — you're still at ${currentLevel}. You can always retake this test later.`),
              el("div", { class: "btn-row" }, [
                el("a", { class: "btn", href: "#/dashboard" }, "Ir al panel · Go to dashboard")
              ])
            ])
          );
        }
      },
      "Mantener mi nivel actual · Keep current level"
    );
    const retakeBtn = el("button", { class: "btn btn-ghost", onclick: showIntro }, "Repetir la prueba · Retake test");

    btnRow.appendChild(acceptBtn);
    btnRow.appendChild(keepBtn);
    btnRow.appendChild(retakeBtn);
    actionCard.appendChild(btnRow);
    actionCard.appendChild(afterRow);
    body.appendChild(actionCard);
  }
}
