// Unified ACTFL proficiency model.
//
// Reconciles the app's four previously-disconnected "what's my level"
// signals into one canonical, deterministic read path:
//   1. XP pace (baseline — how much practice volume so far)
//   2. Can-Do self-ticks (small nudge, max +1 tier over XP)
//   3. Roadmap checkpoint evidence (confirmedLevel — a floor, never drops)
//   4. Task-scenario proficiency gates (NEW — a floor, never drops, earned
//      by actually completing real-life tasks, see meetsGateForTier below)
//   5. Recent Speaking Test average (a bounded nudge, max +1 tier, never a
//      floor — one heuristic OPI session is weaker evidence than 3+
//      scenario passes)
//
// core/gamification.js's estimatedLevel() delegates to canonicalLevelIndex()
// here, so every existing call site (dashboard, conversation/immersion tier
// gating, the topbar stat) picks up scenario evidence automatically.

import { store } from "./storage.js";
import { ACTFL_LEVELS, levelIndex } from "../data/roadmap.js";

// XP thresholds mapped onto the 7 ACTFL sub-levels this app targets. Owned
// here (not gamification.js) so this module has no dependency on it —
// gamification.js imports levelForXP/XP_THRESHOLDS from here instead,
// keeping the dependency one-directional.
export const XP_THRESHOLDS = [0, 300, 800, 1600, 2800, 4400, 6500];

export function levelForXP(xp) {
  let idx = 0;
  for (let i = 0; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) idx = i;
  }
  return ACTFL_LEVELS[idx].code;
}

const GATE_MIN_PASSES = 3;
const GATE_MIN_DISTINCT_SCENARIOS = 2;
const GATE_SCORE_THRESHOLD = 70;
const GATE_SLOT_FILL_MIN = 0.8;

function qualifyingAttempts(tierCode) {
  return (store.state.progress.scenarioAttempts || []).filter(
    (a) =>
      a.tier === tierCode &&
      a.overallScore >= GATE_SCORE_THRESHOLD &&
      a.requiredSlotsTotal > 0 &&
      a.requiredSlotsFilled / a.requiredSlotsTotal >= GATE_SLOT_FILL_MIN
  );
}

// Deterministic gate: a tier unlocks once the learner has demonstrated
// proficiency at the PRIOR tier — enough passing attempts, across enough
// distinct scenarios, not just one lucky repeat of the same task.
export function meetsGateForTier(tierCode) {
  const priorIdx = levelIndex(tierCode) - 1;
  if (priorIdx < 0) return true; // the first tier is always open
  const priorTier = ACTFL_LEVELS[priorIdx].code;
  const passes = qualifyingAttempts(priorTier);
  const distinctScenarios = new Set(passes.map((a) => a.scenarioId)).size;
  return passes.length >= GATE_MIN_PASSES && distinctScenarios >= GATE_MIN_DISTINCT_SCENARIOS;
}

function highestUnlockedGateIndex() {
  const gates = store.state.progress.gatesUnlocked || [];
  return gates.reduce((max, code) => Math.max(max, levelIndex(code)), -1);
}

function speakingTestNudge(baselineIdx) {
  const tests = (store.state.progress.speakingTests || []).slice(-5);
  if (!tests.length) return 0;
  const avgIdx = tests.reduce((sum, t) => sum + levelIndex(t.level), 0) / tests.length;
  return avgIdx > baselineIdx ? 1 : 0;
}

export function canonicalLevelIndex() {
  const xp = store.state.profile.xp || 0;
  const xpLevelIdx = levelIndex(levelForXP(xp));
  const canDoCount = (store.state.progress.canDoCompleted || []).length;
  const canDoBoost = Math.min(1, Math.floor(canDoCount / 8));
  let idx = Math.min(ACTFL_LEVELS.length - 1, xpLevelIdx + (canDoCount >= 4 ? canDoBoost : 0));

  const confirmed = store.state.profile.confirmedLevel;
  if (confirmed) idx = Math.max(idx, levelIndex(confirmed));

  idx = Math.max(idx, highestUnlockedGateIndex());

  idx = Math.min(ACTFL_LEVELS.length - 1, idx + speakingTestNudge(idx));

  return idx;
}

// A richer breakdown for the proficiency report view — the same pieces
// canonicalLevelIndex() used, not recomputed, so the report can explain
// *why* the number is what it is.
export function proficiencyDetail() {
  const xp = store.state.profile.xp || 0;
  const xpLevelIdx = levelIndex(levelForXP(xp));
  const canDoCount = (store.state.progress.canDoCompleted || []).length;
  const canDoBoost = Math.min(1, Math.floor(canDoCount / 8));
  const afterCanDo = Math.min(ACTFL_LEVELS.length - 1, xpLevelIdx + (canDoCount >= 4 ? canDoBoost : 0));
  const confirmedIdx = store.state.profile.confirmedLevel ? levelIndex(store.state.profile.confirmedLevel) : -1;
  const scenarioIdx = highestUnlockedGateIndex();
  const preNudgeIdx = Math.max(afterCanDo, confirmedIdx, scenarioIdx);
  const nudge = speakingTestNudge(preNudgeIdx);
  const finalIdx = Math.min(ACTFL_LEVELS.length - 1, preNudgeIdx + nudge);

  const sources = [];
  sources.push({ label: "Study volume (XP)", levelIdx: xpLevelIdx });
  if (canDoCount >= 4) sources.push({ label: "Can-Do statements checked off", levelIdx: afterCanDo });
  if (confirmedIdx >= 0) sources.push({ label: "Roadmap checkpoint passed", levelIdx: confirmedIdx });
  if (scenarioIdx >= 0) sources.push({ label: "Task scenarios completed", levelIdx: scenarioIdx });
  if (nudge > 0) sources.push({ label: "Recent Speaking Test average", levelIdx: finalIdx });

  return {
    levelIdx: finalIdx,
    level: ACTFL_LEVELS[finalIdx],
    xpFloorIdx: xpLevelIdx,
    confirmedFloorIdx: confirmedIdx,
    scenarioFloorIdx: scenarioIdx,
    speakingNudge: nudge,
    sources
  };
}

// Records a finished scenario attempt, updates the per-scenario best score,
// and — if this attempt (combined with prior ones) newly earns a tier's
// gate — unlocks it. Unlocking is append-only: once earned, a later bad
// attempt can never re-lock a tier.
export function recordScenarioAttempt(attempt) {
  const progress = store.state.progress;
  progress.scenarioAttempts.push(attempt);
  const prevBest = progress.scenarioBest[attempt.scenarioId] || 0;
  progress.scenarioBest[attempt.scenarioId] = Math.max(prevBest, attempt.overallScore);

  for (const level of ACTFL_LEVELS) {
    if (progress.gatesUnlocked.includes(level.code)) continue;
    if (meetsGateForTier(level.code)) {
      progress.gatesUnlocked.push(level.code);
    }
  }

  const highestIdx = highestUnlockedGateIndex();
  if (highestIdx >= 0) {
    const highestCode = ACTFL_LEVELS[highestIdx].code;
    const currentConfirmed = store.state.profile.actflConfirmedByScenario;
    if (!currentConfirmed || levelIndex(currentConfirmed) < highestIdx) {
      store.state.profile.actflConfirmedByScenario = highestCode;
    }
  }

  store.save();
  return progress.scenarioAttempts[progress.scenarioAttempts.length - 1];
}
