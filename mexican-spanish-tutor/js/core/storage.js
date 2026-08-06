// Central localStorage-backed state store for the whole app.
// Single JSON blob keeps writes atomic and simple to version/migrate.

const STORAGE_KEY = "mx_es_state_v1";
const SCHEMA_VERSION = 1;

function defaultState() {
  return {
    version: SCHEMA_VERSION,
    settings: {
      theme: "auto", // "light" | "dark" | "auto"
      immersionLevel: 1, // 1-4, mirrors the app-wide "how much English support" dial
      voiceRate: 0.95,
      slowVoiceRate: 0.6,
      preferredVoiceName: null,
      preferredVoiceGender: "any", // "male" | "female" | "any"
      dailyGoalXP: 40,
      autoplayAudio: true,
      onboardingSeen: false
    },
    profile: {
      name: "",
      xp: 0,
      streak: 0,
      longestStreak: 0,
      lastStudyDate: null, // "YYYY-MM-DD"
      studyDates: [],
      totalStudyMinutes: 0,
      createdAt: Date.now(),
      selfReportedLevel: "novice-low", // ACTFL level reported at onboarding
      // Declared here so it survives reloads — deepMerge only keeps keys that
      // exist in defaultState, so anything omitted is silently dropped.
      hearts: { current: 5, max: 5, lastRegenAt: Date.now() },
      lastSavedAt: null, // last explicit backup (download or code)
      // Every unit at or below this ACTFL level is open to practise, without
      // having to earn your way up to it unit by unit.
      unlockedThroughLevel: null,
      // Highest ACTFL level whose end-of-section checkpoint you passed. The
      // level estimate never reports below this.
      confirmedLevel: null,
      // Highest ACTFL level whose task-scenario proficiency gate (see
      // actflProfile.js) has been earned. Same floor treatment as
      // confirmedLevel — direct evidence, so the estimate never drops below it.
      actflConfirmedByScenario: null
    },
    srs: {
      // itemId -> { type, repetition, easeFactor, interval, stepIndex, nextReview, lastReview, correct, incorrect, history: [] }
    },
    scores: {
      // skill -> 0-100 heuristic score, nudged by every gradeable interaction
      speaking: 0, listening: 0, reading: 0, writing: 0, vocabulary: 0, grammar: 0
    },
    progress: {
      lessonsCompleted: [], // daily lesson ids/dates
      dialoguesCompleted: [],
      storiesCompleted: [],
      correctionSessions: [], // { date, count }
      roleplaySessions: [], // { date, scenarioId, turns }
      immersionSessions: [], // { date, turns }
      conversationSessions: [], // { date, turns }
      levelTests: [], // { date, level } from the Level Test
      speakingTests: [], // { date, level, avg } from the spoken OPI-style test
      grammarAttempts: {}, // patternId -> { attempts, correct }
      vocabExposure: {}, // wordId -> count
      activeSentenceIds: [], // sentence ids currently "being studied"
      canDoCompleted: [], // ACTFL can-do statement ids marked as achieved
      roadmapUnitsCompleted: [], // roadmap unit ids passed by quiz
      roadmapUnitsSkipped: [], // units placed out of (level test or manual tick-off)
      checkpointsPassed: [], // ACTFL level codes whose end-of-section checkpoint you passed
      savedWords: {}, // word -> English gloss, bookmarked from Story Mode
      // Questions Immersion has already asked, so a new session doesn't open
      // with the same one. Resets automatically once the pool is exhausted.
      immersionAsked: [],
      // Task-scenario attempts: { date, scenarioId, tier, turns,
      //   requiredSlotsFilled, requiredSlotsTotal, questionsAsked,
      //   mistakesFired, unresolvedMistakes, dimensions, overallScore, outcome }
      scenarioAttempts: [],
      scenarioBest: {}, // scenarioId -> best overallScore
      // ACTFL level codes whose scenario-proficiency gate has been earned.
      // Append-only — once unlocked, never re-locked by a later bad attempt.
      gatesUnlocked: [],
      // Rolling log of the last graded interactions across scenarios,
      // conversation, and immersion — { date, kind, outcome: "good"|"struggled",
      // mistakeDensity: 0-1 }. Capped at 20 entries (oldest dropped) by
      // core/adaptive.js, which reads this to modulate difficulty/pacing in
      // real time without a separate grading subsystem.
      recentPerformance: [],
      // Completed "Day in Mexico" runs — { date, segmentsCompleted: [scenarioId],
      // segmentResults: { scenarioId: overallScore }, dayOutcome: "great"|"mixed"|"rough" }
      dailyLifeRuns: [],
      // Conversation Mode's equivalent of immersionAsked — questions already
      // asked, persisted cross-session so retaking the mode doesn't repeat
      // itself the way it used to (immersion.js already had this; conversation.js
      // previously only tracked it in-memory for the current tab visit).
      conversationAsked: []
    },
    achievements: {
      unlocked: []
    },
    xpLog: [] // { amount, reason, date }
  };
}

function deepMerge(base, incoming) {
  if (typeof incoming !== "object" || incoming === null) return base;

  // A default of {} means "free-form map" whose keys aren't known up front —
  // SRS entries keyed by item id, per-word exposure counters, and so on.
  // The loop below only walks keys present in `base`, so an empty default has
  // nothing to walk and would silently discard everything that was saved.
  // Keep those wholesale instead.
  if (!Array.isArray(base) && !Array.isArray(incoming) && Object.keys(base).length === 0) {
    return { ...incoming };
  }

  const out = Array.isArray(base) ? base.slice() : { ...base };
  for (const key of Object.keys(base)) {
    if (incoming[key] === undefined) continue;
    if (
      typeof base[key] === "object" &&
      base[key] !== null &&
      !Array.isArray(base[key]) &&
      typeof incoming[key] === "object" &&
      incoming[key] !== null &&
      !Array.isArray(incoming[key])
    ) {
      out[key] = deepMerge(base[key], incoming[key]);
    } else {
      out[key] = incoming[key];
    }
  }
  return out;
}

class Store {
  constructor() {
    this.state = this._load();
    this._listeners = new Set();
    this._saveTimer = null;
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            this.state = deepMerge(defaultState(), JSON.parse(e.newValue));
            this._notify();
          } catch (err) {}
        }
      });
    }
  }

  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return deepMerge(defaultState(), parsed);
    } catch (e) {
      console.warn("Failed to load saved progress, starting fresh.", e);
      return defaultState();
    }
  }

  _persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Failed to persist state (storage full or blocked).", e);
    }
  }

  save() {
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => this._persist(), 150);
    this._notify();
  }

  saveNow() {
    clearTimeout(this._saveTimer);
    this._persist();
    this._notify();
  }

  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _notify() {
    for (const fn of this._listeners) {
      try {
        fn(this.state);
      } catch (e) {
        console.error(e);
      }
    }
  }

  get(path) {
    return path.split(".").reduce((o, k) => (o == null ? o : o[k]), this.state);
  }

  set(path, value) {
    const parts = path.split(".");
    let obj = this.state;
    for (let i = 0; i < parts.length - 1; i++) {
      if (obj[parts[i]] === undefined) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    this.save();
  }

  resetAll() {
    this.state = defaultState();
    this._persist();
    this._notify();
  }

  exportJSON() {
    return JSON.stringify(this.state, null, 2);
  }

  importJSON(json) {
    const parsed = JSON.parse(json);
    this.state = deepMerge(defaultState(), parsed);
    this._persist();
    this._notify();
  }
}

export const store = new Store();

export function todayISO() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export function daysBetween(isoA, isoB) {
  const a = new Date(isoA + "T00:00:00");
  const b = new Date(isoB + "T00:00:00");
  return Math.round((b - a) / 86400000);
}
