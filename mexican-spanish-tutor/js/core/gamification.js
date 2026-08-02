// XP, streaks, ACTFL level estimation, skill scores, and achievements.

import { store, todayISO, daysBetween } from "./storage.js";
import { ACTFL_LEVELS, levelIndex } from "../data/roadmap.js";

// XP thresholds mapped onto the 7 ACTFL sub-levels this app targets.
const XP_THRESHOLDS = [0, 300, 800, 1600, 2800, 4400, 6500];

export function addXP(amount, reason = "") {
  const p = store.state.profile;
  p.xp += amount;
  store.state.xpLog.push({ amount, reason, date: Date.now() });
  if (store.state.xpLog.length > 500) store.state.xpLog.shift();
  registerStudyToday();
  checkAchievements();
  store.save();
  return p.xp;
}

// Composite ACTFL estimate: XP is the baseline pace-setter, nudged by how
// many Can-Do statements the learner has actually checked off (self-report +
// performance both feed the same signal, per the spec's "update regularly
// based on performance").
export function levelForXP(xp) {
  let idx = 0;
  for (let i = 0; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) idx = i;
  }
  return ACTFL_LEVELS[idx].code;
}

export function estimatedLevel() {
  const xp = store.state.profile.xp || 0;
  const xpLevelIdx = levelIndex(levelForXP(xp));
  const canDoCount = (store.state.progress.canDoCompleted || []).length;
  // Roughly 4 can-do statements checked off nudges the estimate up one level,
  // but never past what XP alone would already justify by more than one tier.
  const canDoBoost = Math.min(1, Math.floor(canDoCount / 8));
  const idx = Math.min(ACTFL_LEVELS.length - 1, xpLevelIdx + (canDoCount >= 4 ? canDoBoost : 0));
  return ACTFL_LEVELS[idx];
}

export function xpProgressToNextLevel() {
  const p = store.state.profile;
  const cur = estimatedLevel();
  const idx = levelIndex(cur.code);
  const curXp = XP_THRESHOLDS[idx];
  const nextXp = XP_THRESHOLDS[idx + 1];
  if (nextXp === undefined) return { pct: 100, isMax: true, current: cur, next: null };
  const span = nextXp - curXp;
  const into = p.xp - curXp;
  return {
    pct: Math.max(0, Math.min(100, Math.round((into / span) * 100))),
    isMax: false,
    current: cur,
    next: ACTFL_LEVELS[idx + 1]
  };
}

export function registerStudyToday() {
  const p = store.state.profile;
  const today = todayISO();
  if (p.lastStudyDate === today) return;
  if (p.lastStudyDate) {
    const gap = daysBetween(p.lastStudyDate, today);
    if (gap === 1) {
      p.streak += 1;
    } else if (gap > 1) {
      p.streak = 1;
    }
  } else {
    p.streak = 1;
  }
  p.longestStreak = Math.max(p.longestStreak || 0, p.streak);
  p.lastStudyDate = today;
  if (!p.studyDates.includes(today)) {
    p.studyDates.push(today);
    if (p.studyDates.length > 400) p.studyDates.shift();
  }
}

export function currentStreak() {
  const p = store.state.profile;
  if (!p.lastStudyDate) return 0;
  const today = todayISO();
  const gap = daysBetween(p.lastStudyDate, today);
  if (gap > 1) return 0;
  return p.streak;
}

export function updateSkillScore(skill, delta) {
  const s = store.state.scores;
  s[skill] = Math.max(0, Math.min(100, (s[skill] || 0) + delta));
  store.save();
}

export const ACHIEVEMENTS = [
  { id: "first_step", name: "Primer paso", desc: "Complete your first study session.", icon: "🌱", check: (s) => s.xpLog.length >= 1 },
  { id: "streak_3", name: "Racha de 3", desc: "Study 3 days in a row.", icon: "🔥", check: (s) => s.profile.streak >= 3 },
  { id: "streak_7", name: "Semana completa", desc: "Study 7 days in a row.", icon: "🔥", check: (s) => s.profile.streak >= 7 },
  { id: "streak_30", name: "Racha de hierro", desc: "Study 30 days in a row.", icon: "🏆", check: (s) => s.profile.streak >= 30 },
  { id: "xp_500", name: "500 puntos", desc: "Earn 500 XP.", icon: "⭐", check: (s) => s.profile.xp >= 500 },
  { id: "xp_2000", name: "2,000 puntos", desc: "Earn 2,000 XP.", icon: "🌟", check: (s) => s.profile.xp >= 2000 },
  { id: "level_intermediate", name: "¡Intermedio!", desc: "Reach Intermediate Low.", icon: "🎉", check: (s) => XP_THRESHOLDS_reached(s, "intermediate-low") },
  { id: "level_advanced", name: "Advanced Low", desc: "Reach the app's target level: Advanced Low.", icon: "👑", check: (s) => XP_THRESHOLDS_reached(s, "advanced-low") },
  { id: "dialogues_5", name: "Conversador/a", desc: "Complete 5 dialogues.", icon: "💬", check: (s) => s.progress.dialoguesCompleted.length >= 5 },
  { id: "dialogues_15", name: "Charlatán/a", desc: "Complete 15 dialogues.", icon: "🗣️", check: (s) => s.progress.dialoguesCompleted.length >= 15 },
  { id: "vocab_50", name: "50 palabras", desc: "Review 50 unique vocabulary items.", icon: "📚", check: (s) => Object.keys(s.progress.vocabExposure).length >= 50 },
  { id: "vocab_150", name: "150 palabras", desc: "Review 150 unique vocabulary items.", icon: "📖", check: (s) => Object.keys(s.progress.vocabExposure).length >= 150 },
  { id: "stories_3", name: "Lector/a de cuentos", desc: "Finish 3 stories.", icon: "📰", check: (s) => s.progress.storiesCompleted.length >= 3 },
  { id: "roleplay_5", name: "Actor/actriz", desc: "Complete 5 roleplay sessions.", icon: "🎭", check: (s) => s.progress.roleplaySessions.length >= 5 },
  { id: "immersion_5", name: "Inmersión total", desc: "Complete 5 immersion-mode sessions.", icon: "🌊", check: (s) => s.progress.immersionSessions.length >= 5 },
  { id: "conversation_10", name: "Conversador/a nato/a", desc: "Complete 10 conversation-mode turns sessions.", icon: "🤖", check: (s) => s.progress.conversationSessions.length >= 10 },
  { id: "level_test_1", name: "¿Cuál es mi nivel?", desc: "Take the Level Test to find your level.", icon: "📊", check: (s) => (s.progress.levelTests || []).length >= 1 },
  { id: "roadmap_5", name: "En camino", desc: "Complete 5 roadmap units.", icon: "🗺️", check: (s) => (s.progress.roadmapUnitsCompleted || []).length >= 5 },
  { id: "writing_5", name: "Escritor/a", desc: "Submit 5 writing corrections.", icon: "✍️", check: (s) => s.progress.correctionSessions.length >= 5 },
  { id: "srs_100", name: "100 repasos", desc: "Complete 100 spaced-repetition reviews.", icon: "🔁", check: (s) => Object.values(s.srs).reduce((a, i) => a + i.correct + i.incorrect, 0) >= 100 },
  { id: "candos_10", name: "10 Can-Do", desc: "Check off 10 ACTFL Can-Do statements.", icon: "✅", check: (s) => (s.progress.canDoCompleted || []).length >= 10 }
];

function XP_THRESHOLDS_reached(state, code) {
  return levelIndex(levelForXP(state.profile.xp)) >= levelIndex(code);
}

export function checkAchievements() {
  const unlocked = store.state.achievements.unlocked;
  const newlyUnlocked = [];
  for (const a of ACHIEVEMENTS) {
    if (unlocked.includes(a.id)) continue;
    if (a.check(store.state)) {
      unlocked.push(a.id);
      newlyUnlocked.push(a);
    }
  }
  if (newlyUnlocked.length) store.save();
  return newlyUnlocked;
}
