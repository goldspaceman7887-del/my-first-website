// Central localStorage-backed state store for the whole app.
// Single JSON blob keeps writes atomic and simple to version/migrate.

const STORAGE_KEY = "ssp_state_v1";
const SCHEMA_VERSION = 1;

function defaultState() {
  return {
    version: SCHEMA_VERSION,
    settings: {
      theme: "auto", // "light" | "dark" | "auto"
      immersionLevel: 1, // 1-4
      voiceRate: 0.95,
      slowVoiceRate: 0.6,
      preferredVoiceName: null,
      preferredVoiceGender: "any", // "male" | "female" | "any"
      dailyGoalXP: 50,
      autoplayAudio: true,
      showFurigana: true // reused generically as "show hints"
    },
    profile: {
      name: "",
      xp: 0,
      level: "A0",
      streak: 0,
      longestStreak: 0,
      lastStudyDate: null, // "YYYY-MM-DD"
      studyDates: [], // history of days studied, for heatmap
      totalStudyMinutes: 0,
      createdAt: Date.now()
    },
    srs: {
      // itemId -> { type, repetition, easeFactor, interval, stepIndex, nextReview, lastReview, correct, incorrect, history: [] }
    },
    progress: {
      lessonsCompleted: [],
      dialoguesCompleted: [], // dialogue ids
      dialogueSectionsCompleted: {}, // dialogueId -> { comprehension:true, dictation:true, speaking:true }
      grammarAttempts: {}, // gramId -> { attempts, correct, lastReview }
      readingCompleted: [],
      writingSubmissions: [], // { id, promptId, text, wordCount, date, selfCheck }
      cultureCompleted: [],
      cultureQuizScores: {}, // culId -> { attempts, best }
      vocabExposure: {} // vocId -> count
    },
    scores: {
      speaking: 0,
      listening: 0,
      grammar: 0,
      vocabulary: 0,
      cultural: 0
    },
    achievements: {
      unlocked: [] // achievement ids
    },
    xpLog: [] // { amount, reason, date }
  };
}

function deepMerge(base, incoming) {
  if (typeof incoming !== "object" || incoming === null) return base;
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
    // Debounce writes so rapid updates don't thrash localStorage.
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
