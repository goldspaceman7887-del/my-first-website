// CAN-DO VALIDATION ENGINE — Phase 1 of docs/can-do-validation-framework.md.
//
// Evaluates every statement in data/canDoValidation.js against evidence
// already collected in state.proficiency.<skill>.history (populated live by
// Speaking Test via core/ratingEngine.js's recordTaskOutcome — unmodified
// here). This is a pure, additive read: nothing about how Speaking Test
// runs or scores a session changes.
//
// Deliberately separate from progress.canDoCompleted (the legacy self-check
// + checkpoint blanket-grant in js/views/roadmap.js) — this module never
// reads or writes that array. Reconciling the two is Phase 4 of the design
// doc and requires touching js/views/roadmap.js, out of scope here.

import { store, todayISO, daysBetween } from "./storage.js";
import { getSkillState } from "./ratingEngine.js";
import { CAN_DO_VALIDATION_SPECS } from "../data/canDoValidation.js";
import { tasksForSkill } from "../data/realWorldTasks.js";

const MAX_EVIDENCE_LOG = 40;
const AT_RISK_STREAK = 2; // consecutive outcomeS=0 attempts at-level before flagging at-risk

function hasZeroDim(dims) {
  if (!dims) return true;
  return Object.values(dims).some((v) => v === 0);
}

// Lazily built, cached per skill — data/realWorldTasks.js is a static array,
// so this only ever runs once per skill per page load.
const taskLookupCache = new Map();
function taskLookup(skill) {
  if (!taskLookupCache.has(skill)) {
    taskLookupCache.set(skill, new Map(tasksForSkill(skill).map((t) => [t.id, t])));
  }
  return taskLookupCache.get(skill);
}

// Entries at levelIdx+1 (a ceiling probe one band up) count as evidence too —
// succeeding above the statement's own level is stronger, not weaker,
// evidence for it. Mirrors core/ratingEngine.js's ceiling-probe treatment.
function matchesComponent(entry, comp, statementLevelIdx, tasks) {
  if (comp.function !== "any" && entry.function !== comp.function) return false;
  if (entry.levelIdx !== statementLevelIdx && entry.levelIdx !== statementLevelIdx + 1) return false;
  // Without this, two statements that share a function+level (e.g. "Handle
  // simple daily situations" and "Talk about plans", both negotiate@novice-
  // high) would silently share evidence — passing one would validate the
  // other with zero direct evidence, the exact failure mode this system
  // exists to fix. null means the statement is deliberately generic.
  if (comp.contexts && !comp.contexts.includes(entry.context)) return false;
  // Phase 1 can't inspect the learner's raw response text (see docs §9.3),
  // so it can't confirm a follow-up/complication turn was actually handled
  // well — but it CAN confirm the task itself carried a second turn at all,
  // via data/realWorldTasks.js's `followUp`/`complication` fields, which is
  // the only signal available without that raw text. A component marked
  // requiresConversationTurn therefore only accepts evidence from a task
  // that has one of those fields; a single-turn task with a matching
  // function/level/context no longer silently counts.
  if (comp.requiresConversationTurn) {
    const task = tasks.get(entry.taskId);
    if (!task || !(task.followUp || task.complication)) return false;
  }
  if (comp.extraCheck && !comp.extraCheck(entry)) return false;
  return true;
}

function withinWindow(dateISO, windowDays) {
  return daysBetween(dateISO, todayISO()) <= windowDays;
}

/**
 * Evaluate one component against a skill's history. Pure function — no
 * store writes.
 */
function evaluateComponent(comp, statementLevelIdx, history, windowDays, tasks) {
  const inWindow = history.filter((e) => withinWindow(e.date, windowDays));
  const matches = inWindow.filter((e) => matchesComponent(e, comp, statementLevelIdx, tasks));
  const qualifying = matches.filter((e) => e.outcomeS >= 0.5 && !hasZeroDim(e.dims));
  const distinctContexts = new Set(qualifying.map((e) => e.context)).size;
  const met = qualifying.length >= comp.minQualifying && distinctContexts >= comp.minContexts;

  // At-risk: the most recent attempts strictly AT this statement's level
  // (not a ceiling probe) are a losing streak — checked on raw matches, not
  // just qualifying ones, so a run of fails is visible even before enough
  // qualifying evidence has accumulated.
  const atLevelMatches = matches.filter((e) => e.levelIdx === statementLevelIdx);
  const tail = atLevelMatches.slice(-AT_RISK_STREAK);
  const strugglingNow = tail.length === AT_RISK_STREAK && tail.every((e) => e.outcomeS === 0);

  const lastQualifyingDate = qualifying.length ? qualifying[qualifying.length - 1].date : null;

  return {
    id: comp.id,
    function: comp.function,
    qualifyingCount: qualifying.length,
    distinctContexts,
    met,
    strugglingNow,
    lastQualifyingDate,
    minQualifying: comp.minQualifying,
    minContexts: comp.minContexts
  };
}

function computeConfidence(componentResults, stale) {
  if (!componentResults.length) return 0;
  const perComponent = componentResults.map((c) => {
    const volume = Math.min(1, c.qualifyingCount / Math.max(1, c.minQualifying));
    const breadth = Math.min(1, c.distinctContexts / Math.max(1, c.minContexts));
    return volume * 0.6 + breadth * 0.4;
  });
  let score = (perComponent.reduce((a, b) => a + b, 0) / perComponent.length) * 100;
  if (stale) score *= 0.6;
  return Math.round(Math.max(0, Math.min(100, score)));
}

function statusFor(componentResults, staleDays) {
  const allMet = componentResults.every((c) => c.met);
  const anyStruggling = componentResults.some((c) => c.strugglingNow);
  const anyEvidence = componentResults.some((c) => c.qualifyingCount > 0);

  let stale = false;
  if (allMet) {
    const dates = componentResults.map((c) => c.lastQualifyingDate).filter(Boolean);
    const daysSinceNewest = dates.length ? Math.min(...dates.map((d) => daysBetween(d, todayISO()))) : Infinity;
    stale = daysSinceNewest > staleDays;
  }

  let status;
  if (allMet && !stale) status = "validated";
  else if (allMet && stale) status = "needs-reverification";
  else if (anyStruggling) status = "at-risk";
  else if (anyEvidence) status = "in-progress";
  else status = "not-started";

  return { status, stale };
}

/**
 * Evaluate one Can-Do statement. Pure — does not touch the store.
 * @param {object} spec - an entry from data/canDoValidation.js
 * @returns {{id, status, confidence, components}}
 */
export function evaluateCanDo(spec) {
  const skillState = getSkillState(spec.skill);
  const history = (skillState && skillState.history) || [];
  const tasks = taskLookup(spec.skill);

  const componentResults = spec.components.map((comp) =>
    evaluateComponent(comp, spec.levelIdx, history, spec.requiredEvidence.windowDays, tasks)
  );

  const { status, stale } = statusFor(componentResults, spec.requiredEvidence.staleDays);
  const confidence = computeConfidence(componentResults, stale);

  return { id: spec.id, status, confidence, components: componentResults };
}

/** Evaluate every known statement. Pure — does not touch the store. */
export function evaluateAllCanDos() {
  return CAN_DO_VALIDATION_SPECS.map(evaluateCanDo);
}

/**
 * Evaluate every statement and persist the results into
 * state.canDoValidation, logging any status transition. Call this after a
 * Speaking Test session (or on demand) to refresh stored Can-Do status.
 */
export function recomputeCanDoValidation() {
  const results = evaluateAllCanDos();
  const bucket = store.state.canDoValidation;
  const date = todayISO();

  for (const result of results) {
    const prev = bucket.statuses[result.id];
    if (!prev || prev.status !== result.status) {
      bucket.evidenceLog.push({
        date, id: result.id,
        from: prev ? prev.status : "unknown",
        to: result.status
      });
      if (bucket.evidenceLog.length > MAX_EVIDENCE_LOG) bucket.evidenceLog.shift();
    }
    bucket.statuses[result.id] = { status: result.status, confidence: result.confidence, updatedAt: date };
  }

  store.save();
  return results;
}

/** Last-persisted status for one statement, or null if never computed. */
export function getCanDoStatus(id) {
  return store.state.canDoValidation.statuses[id] || null;
}

/** Last-persisted status for every statement. */
export function getAllCanDoStatuses() {
  return store.state.canDoValidation.statuses;
}
