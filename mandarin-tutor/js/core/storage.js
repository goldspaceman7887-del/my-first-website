// Central localStorage-backed state store for the whole app.
// Single JSON blob keeps writes atomic and simple to version/migrate.

const STORAGE_KEY = "mzh_state_v1";
const BACKUP_KEY = "mzh_state_v1_backup";
const SCHEMA_VERSION = 1;

function defaultState() {
  return {
    version: SCHEMA_VERSION,
    settings: {
      theme: "auto", // "light" | "dark" | "auto"
      immersionLevel: 1, // 1-4, mirrors the app-wide "how much English support" dial
      voiceRate: 0.92,
      slowVoiceRate: 0.55,
      preferredVoiceName: null,
      preferredVoiceGender: "any", // "male" | "female" | "any"
      dailyGoalXP: 40,
      autoplayAudio: true,
      showPinyin: true,
      showToneColors: true,
      onboardingSeen: false,
      roadmapTrack: "actfl", // "actfl" | "hsk" -- which scale the Roadmap path groups units by
      lastBackupAt: null // timestamp of the last manual "Save my progress" download
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
      selfReportedKnownChars: [] // characters the learner told onboarding they already know
    },
    srs: {
      // itemId -> { type, repetition, easeFactor, interval, stepIndex, nextReview, lastReview, correct, incorrect, history: [] }
    },
    progress: {
      lessonsCompleted: [], // daily lesson ids/dates
      dialoguesCompleted: [],
      dialogueSectionsCompleted: {},
      storiesCompleted: [],
      sentenceMiningSessions: [], // { date, sourceLength, extractedCount }
      correctionSessions: [], // { date, count }
      speakingSessions: [], // { date, topicId, turns }
      immersionSessions: [], // { date, turns }
      grammarAttempts: {}, // patternId -> { attempts, correct, lastReview }
      charExposure: {}, // charId -> count
      vocabExposure: {}, // wordId -> count
      activeSentenceIds: [], // sentence ids currently "being studied"
      roadmapUnitsCompleted: [], // roadmap unit ids completed (or skipped), in the Duolingo-style path
      roadmapUnitsSkipped: [], // subset of roadmapUnitsCompleted that were skipped rather than actually finished
      charFlipIndex: 0, // resume position in the "flip through all characters" practice deck
      canDoChecked: [] // ids of self-assessed "I can..." statements the learner has checked off
    },
    achievements: {
      unlocked: []
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
    if (typeof document !== "undefined") {
      // iOS Safari suspends JS almost immediately when the app is
      // backgrounded (home button, app switcher, swiping away) and does
      // NOT reliably fire beforeunload there -- a pending debounced save()
      // can be silently dropped, which is how progress goes missing.
      // visibilitychange (and pagehide as a second safety net) are the
      // events mobile Safari actually fires reliably before suspending,
      // so flush immediately on either.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") this.saveNow();
      });
    }
    if (typeof window !== "undefined") {
      window.addEventListener("pagehide", () => this.saveNow());
    }
  }

  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return deepMerge(defaultState(), parsed);
      }
      // Primary key is empty -- try the shadow backup before assuming this
      // is really a first visit. Guards against the primary key getting
      // wiped/corrupted while the backup (written alongside it on every
      // save) survives.
      const backup = localStorage.getItem(BACKUP_KEY);
      if (backup) {
        const parsed = JSON.parse(backup);
        console.warn("Primary progress key was empty; restored from local backup.");
        return deepMerge(defaultState(), parsed);
      }
      return defaultState();
    } catch (e) {
      console.warn("Failed to load saved progress, starting fresh.", e);
      return defaultState();
    }
  }

  _persist() {
    try {
      const json = JSON.stringify(this.state);
      localStorage.setItem(STORAGE_KEY, json);
      localStorage.setItem(BACKUP_KEY, json);
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
