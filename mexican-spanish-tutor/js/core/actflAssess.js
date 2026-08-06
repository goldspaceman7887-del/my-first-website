// Turns a finished task-scenario session into an ACTFL rubric score.
//
// Evaluates comprehensibility, vocabulary range, sentence formation, repair
// strategies, conversation management, question-asking, and surprise
// handling — not grammar accuracy alone — and maps the result onto the
// scenario's own ACTFL tier (one level up if the learner clearly
// outperformed it, one down if they clearly struggled).

import { checkText } from "../data/mistakePatterns.js";
import { ACTFL_LEVELS, levelIndex } from "../data/roadmap.js";

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function scoreSession(session) {
  const userTurns = session.log.filter((l) => l.speaker === "user");
  const allText = userTurns.map((t) => t.text).join(" ").trim();
  const mistakeHits = allText ? checkText(allText).length : 0;
  const slotFillRate = session.requiredSlots.length
    ? session.filledRequiredCount / session.requiredSlots.length
    : 1;
  const wordCount = allText ? allText.split(/\s+/).filter(Boolean).length : 0;
  const wordsPerTurn = userTurns.length ? wordCount / userTurns.length : 0;

  const mistakesFiredCount = session.mistakesFired.length;
  const repairStrategies = mistakesFiredCount
    ? clamp((100 * (mistakesFiredCount - session.unresolvedMistakes)) / mistakesFiredCount)
    : 70; // no mistake fired this session — neutral, not penalized

  const surpriseTriggers = session.log.filter((l) => l.isMistakeTrigger).length;
  const surpriseHandling = surpriseTriggers
    ? clamp(100 * (1 - session.unresolvedMistakes / Math.max(1, mistakesFiredCount)))
    : 60;

  const dimensions = {
    comprehensibility: clamp(100 * slotFillRate - mistakeHits * 10),
    vocabularyRange: clamp(Math.min(100, wordsPerTurn * 12)),
    sentenceFormation: clamp(100 - mistakeHits * 15),
    repairStrategies,
    conversationManagement: clamp(Math.min(100, session.questionsAsked * 25 + slotFillRate * 40)),
    questionAsking: clamp(Math.min(100, session.questionsAsked * 33)),
    surpriseHandling
  };

  const weights = session.scenario.dimensionWeights || {};
  const dimKeys = Object.keys(dimensions);
  const overall = clamp(
    dimKeys.reduce((sum, key) => sum + dimensions[key] * (weights[key] ?? 1 / dimKeys.length), 0)
  );

  return {
    dimensions,
    overall,
    mistakeHits,
    slotFillRate,
    actflEstimate: levelFromScore(session.scenario.actflTier, overall)
  };
}

// overall >= 80: performed above the scenario's own tier (one level up, capped).
// 50-79: performed at the scenario's tier.
// < 50: struggled below the scenario's tier (one level down, floored).
export function levelFromScore(scenarioTier, overall) {
  const baseIdx = levelIndex(scenarioTier);
  let idx = baseIdx;
  if (overall >= 80) idx = Math.min(ACTFL_LEVELS.length - 1, baseIdx + 1);
  else if (overall < 50) idx = Math.max(0, baseIdx - 1);
  return ACTFL_LEVELS[idx].code;
}

export function attemptFromSession(session, dateISO) {
  const score = scoreSession(session);
  return {
    date: dateISO,
    scenarioId: session.scenario.id,
    tier: session.scenario.actflTier,
    turns: session.turns,
    requiredSlotsFilled: session.filledRequiredCount,
    requiredSlotsTotal: session.requiredSlots.length,
    questionsAsked: session.questionsAsked,
    mistakesFired: session.mistakesFired.length,
    unresolvedMistakes: session.unresolvedMistakes,
    dimensions: score.dimensions,
    overallScore: score.overall,
    outcome: session.status
  };
}
