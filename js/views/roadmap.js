// ROADMAP VIEW — the winding, Duolingo-style unlockable path.
//
// This view does not reimplement any quiz/lesson UI: every node's lesson is
// played through the existing runLesson() engine (core/lessonPlayer.js),
// using renderExercise() (core/exercises.js) to render each question and
// spanishDistractors/englishDistractors (core/distractors.js) to build
// multiple-choice options for vocabulary nodes on the fly. Grammar nodes
// mostly just replay the ready-made `exercises` arrays already authored on
// each GRAMMAR concept.
//
// Completion is tracked the same way the rest of the app tracks lessons:
// store.state.progress.lessonsCompleted gets the roadmap node id pushed
// onto it once a session is played to the end with a passing accuracy.
// SRS grading and grammarAttempts/vocabExposure bookkeeping mirror the
// exact conventions used in views/vocabulary.js and views/grammar.js, so
// mastery shown elsewhere in the app (Grammar Lab, vocabulary explore tab)
// stays in sync with roadmap play.

import { store } from "../core/storage.js";
import { el, toast, badge, progressBar } from "../core/ui.js";
import { runLesson } from "../core/lessonPlayer.js";
import { renderExercise } from "../core/exercises.js";
import { spanishDistractors, englishDistractors } from "../core/distractors.js";
import { gradeItem, QUALITY } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { getHearts, hasHearts, minutesUntilNextHeart } from "../core/hearts.js";
import { VOCABULARY } from "../data/vocabulary.js";
import { GRAMMAR } from "../data/grammar.js";
import { ROADMAP_UNITS, computeRoadmapState, allNodeIds } from "../data/roadmapPath.js";

const NODE_PASS_THRESHOLD = 0.6; // 60% to clear a regular node
const CHECKPOINT_PASS_THRESHOLD = 0.75; // checkpoints are the harder gate
const NODE_XP = { grammar: 6, vocab: 8 };
const CHECKPOINT_XP = 10;

// ---------- small local helpers ----------

function shuffleArr(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function completedIds() {
  return store.state.progress.lessonsCompleted;
}

function markComplete(nodeId) {
  const list = store.state.progress.lessonsCompleted;
  if (!list.includes(nodeId)) list.push(nodeId);
  store.save();
}

// ---------- SRS / mastery bookkeeping — mirrors views/grammar.js and views/vocabulary.js exactly ----------

function recordGrammarResult(gramId, correct) {
  const g = store.state.progress.grammarAttempts;
  if (!g[gramId]) g[gramId] = { attempts: 0, correct: 0, lastReview: null };
  g[gramId].attempts += 1;
  if (correct) g[gramId].correct += 1;
  g[gramId].lastReview = Date.now();
  gradeItem(`gram_${gramId}`, "grammar", correct ? QUALITY.GOOD : QUALITY.AGAIN);
  addXP(correct ? 4 : 1, "Gramática");
  updateSkillScore("grammar", correct ? 1.2 : -0.6);
  store.save();
}

function recordVocabResult(v, correct) {
  gradeItem(`vocab_${v.id}`, "vocab", correct ? QUALITY.GOOD : QUALITY.AGAIN);
  store.state.progress.vocabExposure[v.id] = (store.state.progress.vocabExposure[v.id] || 0) + 1;
  updateSkillScore("vocabulary", correct ? 1 : -0.5);
  store.save();
}

// ---------- building runLesson questions from real content ----------

// One question per grammar exercise, drawn from one or more GRAMMAR concepts'
// ready-made `exercises` arrays (already in exercises.js's shape). `limit`
// caps how many are used for a single node; pass Infinity to pull the whole
// pool (used when assembling a unit checkpoint).
function buildGrammarQuestions(grammarIds, limit = 12) {
  const concepts = grammarIds.map((id) => GRAMMAR.find((g) => g.id === id)).filter(Boolean);
  let pairs = concepts.flatMap((g) => g.exercises.map((ex) => ({ ex, gramId: g.id })));
  pairs = shuffleArr(pairs);
  if (pairs.length > limit) pairs = pairs.slice(0, limit);
  return pairs.map(({ ex, gramId }) => ({
    render(host, onResult) {
      host.appendChild(
        renderExercise(ex, {
          onResult: (correct) => {
            recordGrammarResult(gramId, correct);
            onResult(correct);
          }
        })
      );
    }
  }));
}

// Builds one multiple-choice exercise per vocabulary item, using its example
// sentence and spanishDistractors/englishDistractors to build hard-to-guess
// wrong options — the same "minimal pair" decoys used elsewhere in the app,
// rather than reinventing distractor logic here.
function vocabExerciseFor(v, sentencePoolEs, sentencePoolEn) {
  const hasExample = !!(v.exampleEs && v.exampleEn);
  const r = Math.random();
  if (!hasExample) {
    // Defensive fallback (current VOCABULARY data always has examples): plain
    // word-meaning question using other words in the same category as decoys.
    const pool = VOCABULARY.filter((x) => x.id !== v.id && x.category === v.category).map((x) => x.en);
    const decoys = shuffleArr(pool.length >= 3 ? pool : VOCABULARY.filter((x) => x.id !== v.id).map((x) => x.en)).slice(0, 3);
    return { type: "multiple-choice", prompt: `¿Qué significa "${v.es}"?`, options: shuffleArr([v.en, ...decoys]), answer: v.en, explanation: "" };
  }
  if (r < 0.55) {
    // Read the Spanish example, pick its English meaning.
    const decoys = englishDistractors(v.exampleEn, 3, sentencePoolEn.filter((s) => s !== v.exampleEn));
    return {
      type: "multiple-choice",
      prompt: `¿Qué significa esta frase? · "${v.exampleEs}"`,
      options: shuffleArr([v.exampleEn, ...decoys]),
      answer: v.exampleEn,
      explanation: `"${v.es}" = "${v.en}"`
    };
  }
  // Read the English translation, pick the matching Spanish sentence.
  const decoys = spanishDistractors(v.exampleEs, 3, sentencePoolEs.filter((s) => s !== v.exampleEs));
  return {
    type: "multiple-choice",
    prompt: `How do you say: "${v.exampleEn}"?`,
    options: shuffleArr([v.exampleEs, ...decoys]),
    answer: v.exampleEs,
    explanation: `"${v.es}" = "${v.en}"`
  };
}

function buildVocabQuestionsFromWords(words) {
  const sentencePoolEs = words.filter((w) => w.exampleEs).map((w) => w.exampleEs);
  const sentencePoolEn = words.filter((w) => w.exampleEn).map((w) => w.exampleEn);
  return words.map((v) => {
    const ex = vocabExerciseFor(v, sentencePoolEs, sentencePoolEn);
    return {
      render(host, onResult) {
        host.appendChild(
          renderExercise(ex, {
            onResult: (correct) => {
              recordVocabResult(v, correct);
              onResult(correct);
            }
          })
        );
      }
    };
  });
}

function vocabWordsFor(level, categories) {
  return VOCABULARY.filter((v) => v.level === level && categories.includes(v.category));
}

function buildVocabQuestions(level, categories, limit = 12) {
  let words = shuffleArr(vocabWordsFor(level, categories));
  if (words.length > limit) words = words.slice(0, limit);
  return buildVocabQuestionsFromWords(words);
}

function buildNodeQuestions(node) {
  if (node.type === "grammar") return buildGrammarQuestions(node.grammarIds, 12);
  if (node.type === "vocab") return buildVocabQuestions(node.vocabLevel, node.vocabCategories, 12);
  return [];
}

// Checkpoint = a harder mixed review pulling from every regular node in the
// unit at once (all its grammar concepts + all its vocab categories), capped
// at 14 questions.
function buildCheckpointQuestions(unit) {
  const grammarIds = [...new Set(unit.nodes.filter((n) => n.type === "grammar").flatMap((n) => n.grammarIds))];
  const grammarPool = grammarIds.length ? buildGrammarQuestions(grammarIds, Infinity) : [];

  const vocabWords = shuffleArr(
    unit.nodes.filter((n) => n.type === "vocab").flatMap((n) => vocabWordsFor(n.vocabLevel, n.vocabCategories))
  ).slice(0, 30);
  const vocabPool = vocabWords.length ? buildVocabQuestionsFromWords(vocabWords) : [];

  return shuffleArr([...grammarPool, ...vocabPool]).slice(0, 14);
}

// ---------- session tracking (runLesson's onExit gives us no pass/fail info,
// so we tally accuracy ourselves via the same onResult hook every question
// already uses to grade SRS) ----------

function withSessionTracking(questions, tracker) {
  return questions.map((q) => ({
    render(host, onResult) {
      q.render(host, (correct, meta) => {
        tracker.answered++;
        if (correct) tracker.correct++;
        onResult(correct, meta);
      });
    }
  }));
}

// ---------- view ----------

export function renderRoadmap(container) {
  let activeLessonDestroy = null;

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🗺️ Roadmap · Camino de aprendizaje"),
      el("p", {}, "Follow the winding path from absolute beginner to near-native. Complete each node to unlock the next; pass the checkpoint to move up a level."),
      el("p", { class: "text-faint" }, "Un camino de nodos desbloqueables, de A0 a C1, con checkpoints de repaso entre niveles.")
    ])
  );

  const summary = el("div", {});
  const stage = el("div", {});
  container.appendChild(summary);
  container.appendChild(stage);

  function renderSummary() {
    summary.innerHTML = "";
    const done = completedIds().filter((id) => allNodeIds().includes(id)).length;
    const total = allNodeIds().length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    summary.appendChild(
      el("div", { class: "roadmap-progress-summary" }, [
        progressBar(pct, { label: `${done}/${total} · ${pct}%` }),
        badge(`❤️ ${getHearts().current}`, "default")
      ])
    );
  }

  function offsetClass(i) {
    const m = i % 4;
    if (m === 1) return "offset-right";
    if (m === 3) return "offset-left";
    return "";
  }

  function nodeGlyph(node) {
    if (node.status === "locked") return "🔒";
    if (node.status === "completed") return "✓";
    return node.icon;
  }

  function checkpointGlyph(cp) {
    if (cp.status === "passed") return "🏆";
    if (cp.status === "ready") return cp.icon;
    return "🔒";
  }

  function checkpointSub(cp) {
    if (cp.status === "passed") return "Superado · Passed";
    if (cp.status === "ready") return "Disponible · Ready";
    return "Completa los nodos de esta unidad primero";
  }

  function renderPath() {
    stage.innerHTML = "";
    const path = computeRoadmapState(completedIds());
    const pathEl = el("div", { class: "roadmap-path" });
    let i = 0;

    path.forEach((unit) => {
      const doneInUnit = unit.nodes.filter((n) => n.status === "completed").length;
      pathEl.appendChild(
        el("div", { class: "roadmap-tier-header" }, [
          el("h3", {}, `${unit.icon} ${unit.level} · ${unit.title}`),
          el("p", { class: "text-muted" }, `${doneInUnit}/${unit.nodes.length} nodos completados`)
        ])
      );

      unit.nodes.forEach((node) => {
        const row = el("div", { class: `roadmap-node-row ${offsetClass(i++)}` });
        row.appendChild(
          el(
            "button",
            { class: `roadmap-node ${node.status}`, "aria-label": node.title, onclick: () => handleNodeClick(node) },
            [el("div", { class: "roadmap-node-circle" }, nodeGlyph(node)), el("div", { class: "roadmap-node-label" }, node.title)]
          )
        );
        pathEl.appendChild(row);
      });

      const cp = unit.checkpoint;
      const cpRow = el("div", { class: "checkpoint-row" });
      cpRow.appendChild(
        el("button", { class: `checkpoint-node ${cp.status}`, onclick: () => handleCheckpointClick(unit) }, [
          el("div", { class: "checkpoint-icon" }, checkpointGlyph(cp)),
          el("div", { class: "checkpoint-text" }, [el("strong", {}, cp.title), el("div", { class: "checkpoint-sub" }, checkpointSub(cp))])
        ])
      );
      pathEl.appendChild(cpRow);
    });

    stage.appendChild(pathEl);
    renderSummary();
  }

  function finishAttempt(nodeId, tracker, totalQuestions, { isCheckpoint = false, unlockLabel = "" } = {}) {
    if (totalQuestions === 0 || tracker.answered < totalQuestions) return; // quit early or empty node — nothing to grade
    const accuracy = tracker.answered ? tracker.correct / tracker.answered : 0;
    const threshold = isCheckpoint ? CHECKPOINT_PASS_THRESHOLD : NODE_PASS_THRESHOLD;
    if (accuracy >= threshold) {
      const alreadyDone = completedIds().includes(nodeId);
      markComplete(nodeId);
      if (!alreadyDone) {
        toast(isCheckpoint ? `¡Checkpoint superado! ${unlockLabel}` : "¡Nodo completado! · Node complete!", {
          type: "achievement",
          icon: isCheckpoint ? "🏆" : "✅"
        });
      } else {
        toast("¡Buen repaso! · Nice review!", { icon: "🔁" });
      }
    } else {
      toast(`Necesitas ${Math.round(threshold * 100)}% de aciertos para completarlo — ¡inténtalo de nuevo!`, { icon: "💪" });
    }
  }

  function playSession({ nodeId, title, questions, xpPerCorrect, isCheckpoint, unlockLabel }) {
    if (!questions.length) {
      toast("No hay suficiente contenido para esta lección todavía.", { icon: "⚠️" });
      return;
    }
    if (!hasHearts()) {
      toast(`Sin corazones por ahora. Vuelve en ${minutesUntilNextHeart()} min. · Out of hearts for now.`, { icon: "💔" });
      return;
    }
    const tracker = { answered: 0, correct: 0 };
    const tracked = withSessionTracking(questions, tracker);
    activeLessonDestroy = runLesson(stage, {
      title,
      questions: tracked,
      xpPerCorrect,
      onExit: () => {
        activeLessonDestroy = null;
        finishAttempt(nodeId, tracker, questions.length, { isCheckpoint, unlockLabel });
        renderPath();
      }
    });
  }

  function handleNodeClick(node) {
    if (node.status === "locked") {
      toast("Completa la lección anterior para desbloquear esta. · Complete the previous lesson first.", { icon: "🔒" });
      return;
    }
    playSession({
      nodeId: node.id,
      title: node.title,
      questions: buildNodeQuestions(node),
      xpPerCorrect: NODE_XP[node.type] || 8,
      isCheckpoint: false
    });
  }

  function handleCheckpointClick(unit) {
    const cp = unit.checkpoint;
    if (cp.status === "waiting") {
      toast("Completa todos los nodos de esta unidad para desbloquear el checkpoint. · Finish every node in this unit first.", { icon: "🔒" });
      return;
    }
    playSession({
      nodeId: cp.id,
      title: cp.title,
      questions: buildCheckpointQuestions(unit),
      xpPerCorrect: CHECKPOINT_XP,
      isCheckpoint: true,
      unlockLabel: "Siguiente nivel desbloqueado."
    });
  }

  renderPath();

  return () => {
    if (activeLessonDestroy) activeLessonDestroy();
  };
}
