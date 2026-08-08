// REAL-WORLD TASK RUBRIC — scores a free Spanish response on the 5
// dimensions ACTFL actually rates on, instead of the old flat heuristic
// (word count + one past-tense regex + one connector regex - mistake count,
// see scoreOpenResponse in core/assessment.js, which this does NOT replace —
// other views still use it unchanged).
//
// Each dimension is 0-4. A task supplies its own `function` (what the
// learner is meant to DO — describe/narrate/compare/persuade/hypothesize/
// negotiate/sequence/advise) and optional `keywords` (what a relevant answer
// would plausibly mention), so scoring is grounded in the specific real-world
// task, not a generic blob of text.

import { checkText } from "../data/mistakePatterns.js";

const CONNECTOR_RE = /\b(aunque|sin embargo|por un lado|por otro|además|mientras|ya que|porque|por lo tanto|en resumen|entonces|pero|así que)\b/i;

const PRETERITE_RE = /\b\w*(é|aste|ó|amos|aron|í|iste|ió|imos|ieron)\b/i;
const IMPERFECT_RE = /\b\w*(aba|abas|ábamos|aban|ía|ías|íamos|ían)\b/i;
const FUTURE_RE = /\b(\w*(ré|rás|rá|remos|rán)|voy a|vas a|va a|vamos a|van a)\b/i;
const CONDITIONAL_RE = /\b\w*(ría|rías|ríamos|rían)\b/i;
const SUBJUNCTIVE_RE = /\b(si\s+\w*(ara|iera|ase))\b/i;

// One marker regex per real-world function a task can ask for. Matching once
// is evidence the learner attempted the function at all; a second, distinct
// signal (checked separately per function below) earns full credit.
const FUNCTION_MARKERS = {
  describe: /\b(es|son|tiene|tienen|parece|se ve|está hecho|de color|hay)\b/i,
  narrate: /\b(primero|luego|después|entonces|al final|un día|de repente|cuando)\b/i,
  sequence: /\b(primero|segundo|después|luego|para terminar|al final)\b/i,
  compare: /\b(más que|menos que|a diferencia de|mientras que|en cambio|igual que|tan\s+\w+\s+como)\b/i,
  persuade: /\b(creo que|pienso que|en mi opinión|deber[íi]amos|es importante que|por eso|considero que)\b/i,
  hypothesize: /\b(si\s+\w*(ara|iera|ase)|sería|habría|podría)\b/i,
  negotiate: /\b(qué tal si|podríamos|le propongo|estoy de acuerdo|no estoy de acuerdo|mejor|propongo)\b/i,
  advise: /\b(deberías|te recomiendo|lo mejor sería|tienes que|te sugiero)\b/i
};

function words(text) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function sentences(text) {
  return text.split(/[.!?]+/).filter((s) => s.trim().length > 2);
}

function normalize(s) {
  // Escaped unicode range (not a literal combining-mark character) so this
  // stays correct regardless of the source file's encoding — same approach
  // as core/audio.js's normalize().
  return String(s || "").toLowerCase()
    .normalize("NFD").replace(new RegExp("[\\u0300-\\u036f]", "g"), "");
}

function scoreTextType(text) {
  const w = words(text).length;
  const s = sentences(text).length;
  const hasConnector = CONNECTOR_RE.test(text);
  if (w < 3) return 0;
  if (w < 8 || s <= 1) return 1;
  if (s >= 3 && hasConnector && w >= 35) return 4;
  if ((s >= 2 && hasConnector) || w >= 20) return 3;
  return 2;
}

function scoreFunction(text, fn) {
  const marker = FUNCTION_MARKERS[fn];
  const w = words(text).length;
  if (!marker) return w >= 15 ? 3 : w >= 6 ? 2 : 1;
  const matched = marker.test(text);
  if (!matched) return w >= 6 ? 1 : 0;
  return w >= 25 ? 4 : 3;
}

// How many distinct time frames appear, with a bonus for preterite+imperfect
// contrast (the actual marker of controlled past narration, not just "a past
// tense word appeared somewhere").
function scoreTimeFrame(text, fn) {
  const frames = [
    PRETERITE_RE.test(text),
    IMPERFECT_RE.test(text),
    FUTURE_RE.test(text),
    CONDITIONAL_RE.test(text) || SUBJUNCTIVE_RE.test(text)
  ].filter(Boolean).length;
  const contrast = PRETERITE_RE.test(text) && IMPERFECT_RE.test(text);
  if (fn === "narrate" || fn === "sequence") {
    if (contrast) return 4;
    if (frames >= 1) return 2 + Math.min(1, frames - 1);
    return 0;
  }
  if (fn === "hypothesize") return SUBJUNCTIVE_RE.test(text) || CONDITIONAL_RE.test(text) ? 4 : frames >= 1 ? 2 : 1;
  // Non-narrative functions (describe/compare/persuade/...) aren't graded
  // down for staying in present tense — full credit once at least one frame
  // consistent with the task appears, or the response is simply long enough
  // that time-frame isn't the point.
  return frames >= 1 ? Math.min(4, 2 + frames) : words(text).length >= 15 ? 2 : 1;
}

function scoreContext(text, task) {
  const kws = task.keywords || [];
  if (!kws.length) return scoreTextType(text); // nothing to check relevance against
  const n = normalize(text);
  const hits = kws.filter((k) => n.includes(normalize(k))).length;
  const lengthBonus = words(text).length >= 15 ? 1 : 0;
  return Math.min(4, hits + lengthBonus);
}

function scoreAccuracy(text, mistakeHits) {
  return Math.max(0, 4 - mistakeHits.length);
}

const DIM_LABELS = {
  textType: "Text organization",
  function: "Task function",
  timeFrame: "Time-frame control",
  context: "Content & relevance",
  accuracy: "Accuracy"
};

/**
 * Score a real-world response against a task from data/realWorldTasks.js.
 * @param {string} text - the learner's Spanish response
 * @param {object} task - { function, keywords, levelIdx, ... }
 */
export function scoreRealWorldResponse(text, task) {
  const clean = (text || "").trim();
  const mistakeHits = clean ? checkText(clean) : [];

  const dims = {
    textType: scoreTextType(clean),
    function: scoreFunction(clean, task.function),
    timeFrame: scoreTimeFrame(clean, task.function),
    context: scoreContext(clean, task),
    accuracy: scoreAccuracy(clean, mistakeHits)
  };

  const total = Object.values(dims).reduce((a, b) => a + b, 0); // 0-20
  const hasZero = Object.values(dims).some((v) => v === 0);

  let outcomeS;
  if (total >= 16 && !hasZero) outcomeS = 1;
  else if (total >= 10) outcomeS = 0.5;
  else outcomeS = 0;

  const weakest = Object.entries(dims).sort((a, b) => a[1] - b[1])[0];
  const note = weakest[1] <= 1
    ? `Weakest area: ${DIM_LABELS[weakest[0]]} — ${weakestTip(weakest[0], task)}`
    : "Solid across the board — push for more length and precision next time.";

  return {
    dims, total, outcomeS,
    words: words(clean).length,
    mistakes: mistakeHits,
    note
  };
}

function weakestTip(dim, task) {
  switch (dim) {
    case "textType": return "aim for several connected sentences, not a one-liner.";
    case "function": return `the task asked you to ${task.function} — make sure your answer actually does that, not just mention the topic.`;
    case "timeFrame": return "the verb tenses didn't come through clearly for what this task needed.";
    case "context": return "stay closer to what the scenario is actually asking about.";
    case "accuracy": return "a few common mistake patterns showed up — check the correction below.";
    default: return "";
  }
}

export const DIMENSION_LABELS = DIM_LABELS;
