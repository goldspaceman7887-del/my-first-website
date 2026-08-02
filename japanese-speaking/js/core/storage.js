import { grade } from "./srs.js";

const KEY = "jpAdvSpeak_v1";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function defaultState() {
  return {
    startDate: today(),
    lastActive: today(),
    streak: 0,
    xp: 0,
    connectorProgress: {}, // id -> { seen: n, correct: n, mastered: bool } — used by the Learn/Quiz pages
    srs: {}, // id -> { interval, ease, reps, lapses, due, lastReviewed } — used by Review Session
    reviewStats: { totalReviews: 0, sessionsCompleted: 0, newCardsPerSession: 8 },
    completedTasks: {}, // "week-taskIndex" -> true
    recordings: [], // { id, ts, functionId, topic, transcript, wordCount, sentenceCount, connectorHits: [], durationSec, rubricScore }
    rubricAssessments: [], // { id, ts, scores: {dimensionId: 1-4}, average, note }
    quizStats: { attempts: 0, correct: 0 },
    settings: { rate: 0.85, voiceName: null },
    lastRoute: null, // last visited page, e.g. "/vocabulary" — so re-opening the app returns you there
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

let state = load();
const subscribers = new Set();

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
  subscribers.forEach((fn) => fn(state));
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function touchDaily() {
  const t = today();
  if (state.lastActive === t) return;
  const last = new Date(state.lastActive);
  const cur = new Date(t);
  const diffDays = Math.round((cur - last) / 86400000);
  state.streak = diffDays === 1 ? state.streak + 1 : diffDays === 0 ? state.streak : 1;
  state.lastActive = t;
  save();
}

export function addXP(amount) {
  state.xp += amount;
  save();
}

export function recordQuizAnswer(connectorId, correct) {
  const cp = state.connectorProgress[connectorId] || { seen: 0, correct: 0, mastered: false };
  cp.seen += 1;
  if (correct) cp.correct += 1;
  cp.mastered = cp.seen >= 3 && cp.correct / cp.seen >= 0.8;
  state.connectorProgress[connectorId] = cp;
  state.quizStats.attempts += 1;
  if (correct) state.quizStats.correct += 1;
  addXP(correct ? 5 : 1);
  save();
}

export function gradeSrsItem(id, gradeName) {
  const prev = state.srs[id];
  const next = grade(prev, gradeName);
  state.srs[id] = next;
  state.reviewStats.totalReviews += 1;
  const xpByGrade = { again: 1, hard: 3, good: 5, easy: 7 };
  addXP(xpByGrade[gradeName] || 3);
  save();
  return next;
}

export function completeReviewSession() {
  state.reviewStats.sessionsCompleted += 1;
  addXP(10);
  save();
}

export function setNewCardsPerSession(n) {
  state.reviewStats.newCardsPerSession = n;
  save();
}

export function toggleTask(week, index) {
  const k = `${week}-${index}`;
  const was = !!state.completedTasks[k];
  state.completedTasks[k] = !was;
  if (!was) addXP(10);
  save();
  return !was;
}

export function saveRecording(rec) {
  state.recordings.unshift({ id: `rec_${Date.now()}`, ts: Date.now(), ...rec });
  state.recordings = state.recordings.slice(0, 100);
  addXP(15);
  save();
}

export function deleteRecording(id) {
  state.recordings = state.recordings.filter((r) => r.id !== id);
  save();
}

export function saveRubricAssessment(scores, note = "") {
  const values = Object.values(scores);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  state.rubricAssessments.unshift({ id: `rub_${Date.now()}`, ts: Date.now(), scores, average, note });
  state.rubricAssessments = state.rubricAssessments.slice(0, 50);
  addXP(20);
  save();
  return average;
}

export function updateSettings(patch) {
  state.settings = { ...state.settings, ...patch };
  save();
}

export function exportData() {
  return JSON.stringify(state, null, 2);
}

export function importData(json) {
  try {
    const parsed = JSON.parse(json);
    state = { ...defaultState(), ...parsed };
    save();
    return true;
  } catch {
    return false;
  }
}

export function resetAll() {
  state = defaultState();
  save();
}

export function setLastRoute(path) {
  if (state.lastRoute === path) return;
  state.lastRoute = path;
  save();
}

// ---- in-progress session snapshots (current queue/index/filters for a page's flip-through
// flow) — separate localStorage keys so a card flip doesn't re-serialize the entire app state
// (srs/connectorProgress can get large). Lets closing and reopening the app resume exactly
// where you left off, not just keep the graded results.
const SESSION_PREFIX = "jpAdvSpeak_session_";

export function saveSession(key, data) {
  try {
    localStorage.setItem(SESSION_PREFIX + key, JSON.stringify(data));
  } catch {
    // storage full or unavailable — resuming mid-session is a nice-to-have, fail silently
  }
}

export function loadSession(key) {
  try {
    const raw = localStorage.getItem(SESSION_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession(key) {
  localStorage.removeItem(SESSION_PREFIX + key);
}
