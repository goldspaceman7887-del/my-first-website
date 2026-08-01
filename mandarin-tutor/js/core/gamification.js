// XP, streaks, the spec's character-count difficulty levels, and achievements.

import { store, todayISO, daysBetween } from "./storage.js";

// The "Difficulty System" from the tutor spec: levels keyed off known-character count.
export const CHAR_LEVELS = [
  { level: 0, label: "Level 0", chars: 25, desc: "Absolute beginner" },
  { level: 1, label: "Level 1", chars: 100, desc: "Building the core" },
  { level: 2, label: "Level 2", chars: 250, desc: "Conversational basics" },
  { level: 3, label: "Level 3", chars: 500, desc: "Intermediate" },
  { level: 4, label: "Level 4", chars: 1000, desc: "Advanced (1000+)" }
];

export function levelForCharCount(count) {
  let current = CHAR_LEVELS[0];
  for (const l of CHAR_LEVELS) {
    if (count >= l.chars) current = l;
  }
  return current;
}

export function nextLevelInfo(count) {
  const cur = levelForCharCount(count);
  const idx = CHAR_LEVELS.findIndex((l) => l.level === cur.level);
  const next = CHAR_LEVELS[idx + 1];
  if (!next) return { current: cur, next: null, pct: 100 };
  const prevThreshold = cur.chars;
  const span = next.chars - prevThreshold;
  const into = Math.max(0, count - prevThreshold);
  return { current: cur, next, pct: Math.min(100, Math.round((into / span) * 100)) };
}

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

export const ACHIEVEMENTS = [
  { id: "first_step", name: "First Step", desc: "Complete your first study session.", icon: "🌱", check: (s) => s.xpLog.length >= 1 },
  { id: "streak_3", name: "3-Day Streak", desc: "Study 3 days in a row.", icon: "🔥", check: (s) => s.profile.streak >= 3 },
  { id: "streak_7", name: "Full Week", desc: "Study 7 days in a row.", icon: "🔥", check: (s) => s.profile.streak >= 7 },
  { id: "streak_30", name: "Iron Streak", desc: "Study 30 days in a row.", icon: "🏆", check: (s) => s.profile.streak >= 30 },
  { id: "xp_500", name: "500 Points", desc: "Earn 500 XP.", icon: "⭐", check: (s) => s.profile.xp >= 500 },
  { id: "xp_2000", name: "2,000 Points", desc: "Earn 2,000 XP.", icon: "🌟", check: (s) => s.profile.xp >= 2000 },
  { id: "level_1", name: "Level 1 Reached", desc: "Know 100 characters.", icon: "🎉", check: (s) => Object.keys(s.progress.charExposure || {}).length >= 100 },
  { id: "level_2", name: "Level 2 Reached", desc: "Know 250 characters.", icon: "🚀", check: (s) => Object.keys(s.progress.charExposure || {}).length >= 250 },
  { id: "level_3", name: "Level 3 Reached", desc: "Know 500 characters.", icon: "👑", check: (s) => Object.keys(s.progress.charExposure || {}).length >= 500 },
  { id: "dialogues_5", name: "Conversationalist", desc: "Complete 5 dialogues.", icon: "💬", check: (s) => s.progress.dialoguesCompleted.length >= 5 },
  { id: "vocab_50", name: "50 Words", desc: "Review 50 unique words.", icon: "📚", check: (s) => Object.keys(s.progress.vocabExposure).length >= 50 },
  { id: "vocab_150", name: "150 Words", desc: "Review 150 unique words.", icon: "📖", check: (s) => Object.keys(s.progress.vocabExposure).length >= 150 },
  { id: "stories_3", name: "Story Reader", desc: "Finish 3 stories.", icon: "📰", check: (s) => s.progress.storiesCompleted.length >= 3 },
  { id: "speaking_5", name: "Speaker", desc: "Complete 5 speaking-mode sessions.", icon: "🎤", check: (s) => s.progress.speakingSessions.length >= 5 },
  { id: "immersion_5", name: "Immersed", desc: "Complete 5 immersion-mode sessions.", icon: "🌊", check: (s) => s.progress.immersionSessions.length >= 5 },
  { id: "mining_5", name: "Sentence Miner", desc: "Run sentence mining 5 times.", icon: "⛏️", check: (s) => s.progress.sentenceMiningSessions.length >= 5 },
  { id: "srs_100", name: "100 Reviews", desc: "Complete 100 spaced-repetition reviews.", icon: "🔁", check: (s) => Object.values(s.srs).reduce((a, i) => a + i.correct + i.incorrect, 0) >= 100 }
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
