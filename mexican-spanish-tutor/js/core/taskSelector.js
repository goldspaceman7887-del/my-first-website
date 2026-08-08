// ADAPTIVE TASK SELECTOR — picks the next real-world task for a skill
// against the learner's current rating (core/ratingEngine.js), instead of a
// fixed script. Three kinds of pick:
//   - "recovery": same level as currently displayed, not harder — given
//     once a skill is flagged at-risk, before a losing streak can trigger
//     the regression rule.
//   - "ceiling": one band above the displayed level, injected periodically
//     to check whether the current level is actually a ceiling.
//   - "adaptive": nearest-difficulty task to the current rating, preferring
//     a function/context different from the last couple of tasks so
//     evidence naturally spans what the promotion rule requires.

import { getSkillState, needsRecoveryProbe } from "./ratingEngine.js";
import { tasksForSkill } from "../data/realWorldTasks.js";

function pickFrom(pool) {
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * @param {string} skill
 * @param {string[]} sessionUsedIds - task ids already asked this session
 * @param {number} sessionCount - tasks completed so far this session
 * @returns {{task: object, kind: "recovery"|"ceiling"|"adaptive"}|null}
 */
export function pickNextTask(skill, sessionUsedIds = [], sessionCount = 0) {
  const all = tasksForSkill(skill);
  if (!all.length) return null;
  const s = getSkillState(skill);
  const unused = all.filter((t) => !sessionUsedIds.includes(t.id));
  const pool = unused.length ? unused : all; // session outran the bank — allow repeats rather than stopping

  if (needsRecoveryProbe(skill)) {
    const atLevel = pool.filter((t) => t.levelIdx === s.displayedLevelIdx);
    if (atLevel.length) return { task: pickFrom(atLevel), kind: "recovery" };
  }

  const wantsCeiling = sessionCount > 0 && sessionCount % 4 === 3 && s.displayedLevelIdx < 8;
  if (wantsCeiling) {
    const above = pool.filter((t) => t.levelIdx === s.displayedLevelIdx + 1);
    if (above.length) return { task: pickFrom(above), kind: "ceiling" };
  }

  const recentFns = new Set(s.history.slice(-2).map((h) => h.function));
  const recentCtxs = new Set(s.history.slice(-2).map((h) => h.context));
  const scored = pool
    .map((t) => {
      let score = Math.abs(t.difficulty - s.rating);
      if (recentFns.has(t.function)) score += 120;
      if (recentCtxs.has(t.context)) score += 60;
      return { t, score };
    })
    .sort((a, b) => a.score - b.score);

  return { task: scored[0].t, kind: "adaptive" };
}
