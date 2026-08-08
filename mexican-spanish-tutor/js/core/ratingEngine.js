// PER-SKILL ADAPTIVE RATING ENGINE — the "honest reassessment" + "adaptive
// difficulty" backbone described in docs/actfl-assessment-redesign.md.
//
// One Elo-style rating per skill (speaking in Phase 1; writing/reading/
// listening reuse this unchanged once their task banks exist). Every graded
// task nudges the rating toward the truth; the *displayed* level only moves
// on a pattern of evidence (hysteresis), never a single task — so a bad day
// can't tank it and a lucky one can't inflate it. This intentionally does
// NOT touch core/assessment.js's older composite (XP + state.scores), which
// core/roadmap.js, conversation.js, and immersion.js still rely on — this is
// a separate, additive proficiency track living in state.proficiency.
//
// Deliberately NOT seeded from that older composite, even though most
// learners already have one: XP and state.scores are both reachable mostly
// through multiple-choice roadmap quizzes, and this track exists precisely
// so proficiency is never inherited from vocabulary recall or MC grinding.
// Every skill starts at true Novice Low and climbs only on graded real-world
// task performance (core/rubricEngine.js) — slower for an already-fluent
// existing user, but the only way this number stays honest.
//
// Design doc reference: sections 2.1, 6, 7.

import { store, todayISO, daysBetween } from "./storage.js";
import { PROFICIENCY_LEVELS, bandIndexForRating, levelAt, bandCenter } from "../data/actflProficiency.js";

const TOP_LEVEL_IDX = PROFICIENCY_LEVELS.length - 1;

const REGRESSION_STREAK = 3;      // consecutive fails at the displayed level before demotion
const AT_RISK_WINDOW = 5;         // how many recent same-level outcomes we watch
const AT_RISK_FAILS = 2;          // fails within that window that flag "at risk"
const PROMOTION_MIN_EVIDENCE = 5; // qualifying tasks needed in the candidate band
const PROMOTION_MIN_FUNCTIONS = 3;
const PROMOTION_MIN_CONTEXTS = 2;
const STALE_DAYS = 45;            // no qualifying evidence past this = "stale"
const REANCHOR_GAP_DAYS = 21;     // gap after which the next few tasks re-anchor faster
const REANCHOR_TASKS = 3;

function hasZeroDim(dims) {
  return Object.values(dims).some((v) => v === 0);
}

export function getSkillState(skill) {
  return store.state.proficiency[skill];
}

export function displayedLevel(skill) {
  return levelAt(getSkillState(skill).displayedLevelIdx);
}

export function stalenessDays(skill) {
  const s = getSkillState(skill);
  if (!s.lastQualifyingDate) return null;
  return daysBetween(s.lastQualifyingDate, todayISO());
}

export function isStale(skill) {
  const d = stalenessDays(skill);
  return d !== null && d > STALE_DAYS;
}

/**
 * Record the outcome of one real-world task and update the skill's rating,
 * evidence history, and (only when the evidence pattern actually supports
 * it) its displayed level.
 *
 * @param {string} skill - "speaking" | "writing" | "reading" | "listening"
 * @param {object} task - { id, levelIdx, difficulty, function, context }
 * @param {object} scored - result of rubricEngine.scoreRealWorldResponse(): { dims, outcomeS }
 * @returns {{ratingBefore:number, ratingAfter:number, promoted:boolean, regressed:boolean, displayedLevelIdx:number, atRisk:boolean}}
 */
export function recordTaskOutcome(skill, task, scored) {
  const s = getSkillState(skill);
  const { dims, outcomeS } = scored;
  const difficulty = task.difficulty ?? bandCenter(task.levelIdx);

  // Re-anchor faster after a long gap — continuous reassessment shouldn't
  // drag months-old evidence along at full weight.
  const gapDays = s.lastQualifyingDate ? daysBetween(s.lastQualifyingDate, todayISO()) : null;
  if (gapDays !== null && gapDays > REANCHOR_GAP_DAYS && s.boostedRemaining <= 0) {
    s.boostedRemaining = REANCHOR_TASKS;
  }
  const K = s.boostedRemaining > 0 ? 50 : (s.qualifyingCount < 10 ? 40 : 12);
  if (s.boostedRemaining > 0) s.boostedRemaining--;

  const ratingBefore = s.rating;
  const expected = 1 / (1 + Math.pow(10, (difficulty - ratingBefore) / 400));
  const ratingAfter = Math.max(0, Math.min(2400, Math.round(ratingBefore + K * (outcomeS - expected))));
  s.rating = ratingAfter;
  s.qualifyingCount++;
  s.lastQualifyingDate = todayISO();

  const entry = {
    date: todayISO(), taskId: task.id, levelIdx: task.levelIdx,
    function: task.function, context: task.context, dims, outcomeS,
    ratingBefore, ratingAfter
  };
  s.history.push(entry);
  if (s.history.length > 40) s.history.shift();

  let regressed = false;
  let promoted = false;

  // --- Regression: only evidence AT the currently displayed level counts,
  // so a hard ceiling probe failing can never look like a regression. ---
  if (task.levelIdx === s.displayedLevelIdx) {
    s.recentOutcomesAtDisplayed.push(outcomeS);
    if (s.recentOutcomesAtDisplayed.length > AT_RISK_WINDOW) s.recentOutcomesAtDisplayed.shift();
    s.consecutiveFailsAtLevel = outcomeS === 0 ? s.consecutiveFailsAtLevel + 1 : 0;

    if (s.consecutiveFailsAtLevel >= REGRESSION_STREAK && s.displayedLevelIdx > 0) {
      const from = s.displayedLevelIdx;
      s.displayedLevelIdx -= 1;
      s.consecutiveFailsAtLevel = 0;
      s.recentOutcomesAtDisplayed = [];
      s.evidenceLog.push({ date: todayISO(), type: "regression", fromLevelIdx: from, toLevelIdx: s.displayedLevelIdx });
      if (s.evidenceLog.length > 20) s.evidenceLog.shift();
      regressed = true;
    }
  }

  // --- Promotion: never more than one displayed level per task, and only
  // once the last 15 tasks show sustained, varied, spread-out evidence in
  // the candidate band PLUS a ceiling probe one band above that — except at
  // the top of the ladder (Advanced High), where there IS no band above to
  // probe, so the sustained-evidence criteria alone have to be enough. Without
  // this exception nobody could ever reach the top level, no matter how good
  // they are: the ceiling-probe band (candidate+1) would never exist.
  if (!regressed) {
    const ratingBand = bandIndexForRating(s.rating);
    const candidate = Math.min(ratingBand, s.displayedLevelIdx + 1);
    if (candidate > s.displayedLevelIdx) {
      const recent = s.history.slice(-15);
      const inBand = recent.filter((e) => e.levelIdx === candidate && e.outcomeS >= 0.5 && !hasZeroDim(e.dims));
      const distinctFunctions = new Set(inBand.map((e) => e.function)).size;
      const distinctContexts = new Set(inBand.map((e) => e.context)).size;
      const ceilingProbeCleared = candidate >= TOP_LEVEL_IDX || recent.some((e) => e.levelIdx === candidate + 1 && e.outcomeS >= 0.5);

      if (inBand.length >= PROMOTION_MIN_EVIDENCE
        && distinctFunctions >= PROMOTION_MIN_FUNCTIONS
        && distinctContexts >= PROMOTION_MIN_CONTEXTS
        && ceilingProbeCleared) {
        s.evidenceLog.push({ date: todayISO(), type: "promotion", fromLevelIdx: s.displayedLevelIdx, toLevelIdx: candidate });
        if (s.evidenceLog.length > 20) s.evidenceLog.shift();
        s.displayedLevelIdx = candidate;
        s.consecutiveFailsAtLevel = 0;
        s.recentOutcomesAtDisplayed = [];
        promoted = true;
      }
    }
  }

  const atRisk = s.recentOutcomesAtDisplayed.filter((v) => v === 0).length >= AT_RISK_FAILS;
  s.atRisk = atRisk;
  store.save();

  return { ratingBefore, ratingAfter, promoted, regressed, displayedLevelIdx: s.displayedLevelIdx, atRisk, outcomeS };
}

// Whether the next task selected for this skill should specifically be a
// recovery probe (see taskSelector.js) — same level, not harder, to give an
// at-risk learner one clean chance before the streak can trigger regression.
export function needsRecoveryProbe(skill) {
  return getSkillState(skill).atRisk;
}
