// Shared open-response scoring + the composite ACTFL estimate.
//
// scoreOpenResponse() is the heuristic the Speaking Test always used — length,
// sentence count, past-tense use, connector use, minus mistake count — pulled
// out here so the Speaking Test, onboarding's placement check, and ACTFL
// Skill Practice all grade free-typed/spoken Spanish the same way instead of
// three slightly-different copies drifting apart.

import { checkText } from "../data/mistakePatterns.js";
import { ACTFL_LEVELS, levelIndex } from "../data/roadmap.js";

const PAST_TENSE_RE = /\b\w*(é|aste|ó|amos|aron|í|iste|ió|imos|ieron|aba|abas|ábamos|aban|ía|ías|íamos|ían)\b/i;
const CONNECTOR_RE = /\b(aunque|sin embargo|por un lado|por otro|además|mientras|ya que|porque|por lo tanto|en resumen|entonces|pero)\b/i;

export function scoreOpenResponse(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 2);
  const mistakes = checkText(text).length;
  const hasPast = PAST_TENSE_RE.test(text);
  const hasConnector = CONNECTOR_RE.test(text);
  let score = Math.min(60, words.length * 2.2);
  score += sentences.length >= 3 ? 15 : sentences.length * 5;
  score += hasPast ? 10 : 0;
  score += hasConnector ? 15 : 0;
  score -= mistakes * 8;
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    words: words.length, sentences: sentences.length, hasPast, hasConnector, mistakes
  };
}

// Maps a 0-100 score onto the same 7-rung ladder XP uses. Exported so the
// onboarding placement check can turn its own 0-100 result into a starting
// ACTFL level with the same math the ongoing estimate uses.
export function levelIdxFromScore(avgScore) {
  const idx = Math.floor((avgScore / 100) * ACTFL_LEVELS.length);
  return Math.max(0, Math.min(ACTFL_LEVELS.length - 1, idx));
}

// Composite ACTFL estimate. XP alone used to set the baseline, which meant a
// learner could grind multiple-choice-heavy roadmap XP to a level their
// actual speaking/listening/writing never demonstrated. The baseline is now
// the BETTER of the XP-implied level and the level implied by real
// performance (state.scores: speaking/listening/reading/writing/vocabulary/
// grammar — fed by Conversation, Speaking Test, Writing Coach, Listening
// Practice, Scenario Mode, etc., none of them multiple-choice), so genuine
// skill can pull the estimate up ahead of XP. XP is never reduced by a weak
// score — a bad session shouldn't erase progress already demonstrated
// elsewhere — it only ever raises the floor.
//
// levelForXP is passed in rather than imported to avoid a circular import
// with gamification.js, which owns the XP thresholds.
export function computeActflEstimate(state, { levelForXP }) {
  const xp = state.profile.xp || 0;
  const xpLevelIdx = levelIndex(levelForXP(xp));

  const scoreVals = Object.values(state.scores || {});
  const avgScore = scoreVals.length ? scoreVals.reduce((a, b) => a + b, 0) / scoreVals.length : 0;
  const scoresLevelIdx = levelIdxFromScore(avgScore);

  const baseline = Math.max(xpLevelIdx, scoresLevelIdx);

  const canDoCount = (state.progress.canDoCompleted || []).length;
  // Roughly 4 can-do statements checked off nudges the estimate up one level,
  // but never past what the baseline alone would already justify by more
  // than one tier.
  const canDoBoost = Math.min(1, Math.floor(canDoCount / 8));
  let idx = Math.min(ACTFL_LEVELS.length - 1, baseline + (canDoCount >= 4 ? canDoBoost : 0));

  // Passing a section checkpoint is direct evidence of that level, so the
  // estimate never reads below it.
  const confirmed = state.profile.confirmedLevel;
  if (confirmed) idx = Math.max(idx, levelIndex(confirmed));

  return ACTFL_LEVELS[idx];
}
