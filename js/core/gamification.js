// XP, levels, streaks, and achievements.

import { store, todayISO, daysBetween } from "./storage.js";

const LEVEL_THRESHOLDS = [
  { level: "A0", xp: 0 },
  { level: "A1", xp: 400 },
  { level: "A2", xp: 1200 },
  { level: "B1", xp: 2800 },
  { level: "B2", xp: 5200 },
  { level: "C1", xp: 8500 }
];

export function addXP(amount, reason = "") {
  const p = store.state.profile;
  p.xp += amount;
  store.state.xpLog.push({ amount, reason, date: Date.now() });
  if (store.state.xpLog.length > 500) store.state.xpLog.shift();
  p.level = levelForXP(p.xp);
  registerStudyToday();
  checkAchievements();
  store.save();
  return p.xp;
}

export function levelForXP(xp) {
  let current = LEVEL_THRESHOLDS[0].level;
  for (const t of LEVEL_THRESHOLDS) {
    if (xp >= t.xp) current = t.level;
  }
  return current;
}

export function xpProgressToNextLevel() {
  const p = store.state.profile;
  const idx = LEVEL_THRESHOLDS.findIndex((t) => t.level === p.level);
  const curT = LEVEL_THRESHOLDS[idx];
  const nextT = LEVEL_THRESHOLDS[idx + 1];
  if (!nextT) return { pct: 100, xpIntoLevel: p.xp - curT.xp, xpForLevel: 0, isMax: true };
  const span = nextT.xp - curT.xp;
  const into = p.xp - curT.xp;
  return { pct: Math.min(100, Math.round((into / span) * 100)), xpIntoLevel: into, xpForLevel: span, isMax: false, nextLevel: nextT.level };
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
  if (gap > 1) return 0; // streak broken, not yet reflected in stored value
  return p.streak;
}

export const ACHIEVEMENTS = [
  { id: "first_step", name: "Primer paso", desc: "Complete your first study session.", icon: "🌱", check: (s) => s.xpLog.length >= 1 },
  { id: "streak_3", name: "Racha de 3", desc: "Study 3 days in a row.", icon: "🔥", check: (s) => s.profile.streak >= 3 },
  { id: "streak_7", name: "Semana completa", desc: "Study 7 days in a row.", icon: "🔥", check: (s) => s.profile.streak >= 7 },
  { id: "streak_30", name: "Racha de hierro", desc: "Study 30 days in a row.", icon: "🏆", check: (s) => s.profile.streak >= 30 },
  { id: "xp_1000", name: "Mil puntos", desc: "Earn 1,000 XP.", icon: "⭐", check: (s) => s.profile.xp >= 1000 },
  { id: "xp_5000", name: "Cinco mil puntos", desc: "Earn 5,000 XP.", icon: "🌟", check: (s) => s.profile.xp >= 5000 },
  { id: "level_a1", name: "¡Hola, A1!", desc: "Reach level A1.", icon: "🎉", check: (s) => ["A1","A2","B1","B2","C1"].includes(s.profile.level) },
  { id: "level_b1", name: "Intermedio", desc: "Reach level B1.", icon: "🚀", check: (s) => ["B1","B2","C1"].includes(s.profile.level) },
  { id: "level_c1", name: "Casi nativo", desc: "Reach level C1.", icon: "👑", check: (s) => s.profile.level === "C1" },
  { id: "dialogues_5", name: "Conversador", desc: "Complete 5 dialogues.", icon: "💬", check: (s) => s.progress.dialoguesCompleted.length >= 5 },
  { id: "dialogues_20", name: "Charlatán", desc: "Complete 20 dialogues.", icon: "🗣️", check: (s) => s.progress.dialoguesCompleted.length >= 20 },
  { id: "vocab_50", name: "50 palabras", desc: "Review 50 unique vocabulary items.", icon: "📚", check: (s) => Object.keys(s.progress.vocabExposure).length >= 50 },
  { id: "vocab_200", name: "200 palabras", desc: "Review 200 unique vocabulary items.", icon: "📖", check: (s) => Object.keys(s.progress.vocabExposure).length >= 200 },
  { id: "grammar_10", name: "Gramático", desc: "Practice 10 grammar concepts.", icon: "🧠", check: (s) => Object.keys(s.progress.grammarAttempts).length >= 10 },
  { id: "culture_10", name: "Casi español/a", desc: "Complete 10 cultural lessons.", icon: "🇪🇸", check: (s) => s.progress.cultureCompleted.length >= 10 },
  { id: "writing_5", name: "Escritor/a", desc: "Submit 5 writing pieces.", icon: "✍️", check: (s) => s.progress.writingSubmissions.length >= 5 },
  { id: "reading_5", name: "Lector/a", desc: "Complete 5 reading passages.", icon: "📰", check: (s) => s.progress.readingCompleted.length >= 5 },
  { id: "srs_100", name: "Cien repasos", desc: "Complete 100 spaced-repetition reviews.", icon: "🔁", check: (s) => Object.values(s.srs).reduce((a, i) => a + i.correct + i.incorrect, 0) >= 100 }
];

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

export function updateSkillScore(skill, delta) {
  const s = store.state.scores;
  s[skill] = Math.max(0, Math.min(100, (s[skill] || 0) + delta));
  store.save();
}
