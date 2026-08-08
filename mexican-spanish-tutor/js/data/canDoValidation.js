// CAN-DO VALIDATION SPECS — Phase 1 of docs/can-do-validation-framework.md.
//
// One entry per existing ACTFL_LEVELS[].canDo statement (data/roadmap.js,
// READ ONLY here — this file never writes to it). Each statement is broken
// into components tagged to the same function taxonomy core/rubricEngine.js
// and data/realWorldTasks.js already use (describe/narrate/sequence/compare/
// negotiate/persuade/advise), so core/canDoEngine.js can check a statement
// against evidence Speaking Test is already producing, without inventing a
// second scoring system.
//
// `marker` regexes are reserved for Phase 2 (see docs, §9): they let a
// future raw-text check confirm a component more precisely (e.g. "did the
// response actually contain a question mark" for "ask follow-up
// questions"), once core/ratingEngine.js is extended to store response text.
// core/canDoEngine.js does not use `marker` yet — Phase 1 evaluates purely
// from the function/levelIdx/context/outcomeS signal already recorded in
// state.proficiency.speaking.history.
//
// `taskCoverage` is documentation only (which existing data/realWorldTasks.js
// id(s) can currently produce qualifying evidence) — the engine itself
// matches on `function`/`levelIdx`, not on specific task ids, so newly
// authored tasks are picked up automatically with no change here.

import { ACTFL_LEVELS, allCanDoIds } from "./roadmap.js";
import { PROFICIENCY_LEVELS } from "./actflProficiency.js";

const LEVEL_IDX_BY_CODE = Object.fromEntries(PROFICIENCY_LEVELS.map((l, i) => [l.code, i]));

// Evidence-threshold tiers by level (docs §8) — stricter at higher levels,
// matching ACTFL's "sustained, consistent" bar getting harder to satisfy
// with a single lucky attempt as level rises, not easier.
const TIER_NOVICE = { minQualifying: 2, minContexts: 1, windowDays: 120, staleDays: 120 };
const TIER_INTERMEDIATE = { minQualifying: 2, minContexts: 2, windowDays: 90, staleDays: 90 };
const TIER_ADVANCED = { minQualifying: 3, minContexts: 2, windowDays: 60, staleDays: 60 };

function tierFor(levelCode) {
  if (levelCode.startsWith("novice")) return TIER_NOVICE;
  if (levelCode === "advanced-low") return TIER_ADVANCED;
  return TIER_INTERMEDIATE;
}

function component(overrides, tier) {
  return {
    id: overrides.id,
    function: overrides.function,
    mode: overrides.mode || "interpersonal",
    // Allow-list of data/realWorldTasks.js context tags this component may
    // draw evidence from, or null for "any context" — deliberately used for
    // statements that are genuinely generic (e.g. "Handle simple daily
    // situations"). Required whenever another statement shares the same
    // function+level, so unrelated evidence (e.g. ordering tacos) can't
    // silently validate a different statement (e.g. discussing family) just
    // because both happen to be tagged "describe" at the same level — see
    // docs/can-do-validation-framework.md §8 for the full collision audit.
    contexts: overrides.contexts || null,
    requiresConversationTurn: overrides.requiresConversationTurn || false,
    marker: overrides.marker || null,
    minQualifying: overrides.minQualifying ?? tier.minQualifying,
    minContexts: overrides.minContexts ?? tier.minContexts,
    extraCheck: overrides.extraCheck || null
  };
}

function spec(levelCode, index, { components, taskCoverage, notes = "" }) {
  const tier = tierFor(levelCode);
  return {
    id: `${levelCode}__${index}`,
    skill: "speaking",
    levelIdx: LEVEL_IDX_BY_CODE[levelCode],
    components: components.map((c) => component(c, tier)),
    requiredEvidence: { windowDays: tier.windowDays, staleDays: tier.staleDays },
    taskCoverage,
    notes
  };
}

export const CAN_DO_VALIDATION_SPECS = [
  // ================= NOVICE LOW =================
  spec("novice-low", 0, {
    components: [{ id: "self-identify", function: "describe", contexts: ["social"], marker: /\b(me llamo|mi nombre es|soy)\b/i }],
    taskCoverage: ["sp-nl-03"]
  }),
  spec("novice-low", 1, {
    components: [{ id: "say-name", function: "describe", contexts: ["social"], marker: /\b(me llamo|mi nombre es)\b/i, minQualifying: 1 }],
    taskCoverage: ["sp-nl-03"],
    notes: "Subset of novice-low__0's evidence; lighter threshold since it's a strict sub-ability."
  }),
  spec("novice-low", 2, {
    components: [{ id: "greet", function: "describe", contexts: ["greeting"], marker: /\b(hola|buenos días|buenas tardes|buenas noches|qué tal|qué onda)\b/i }],
    taskCoverage: [],
    notes: "GAP — no dedicated greeting task in data/realWorldTasks.js yet (no task carries a 'greeting' context tag), so this can only reach not-started until Phase 2 authoring. Deliberately NOT reusing 'social' (novice-low__0/1's context) — self-introduction and greeting are different abilities and sharing a context would silently conflate them."
  }),
  spec("novice-low", 3, {
    components: [{ id: "count", function: "sequence", mode: "presentational", marker: /\b(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b/i }],
    taskCoverage: ["sp-nl-02"]
  }),
  spec("novice-low", 4, {
    components: [{ id: "name-objects", function: "describe", mode: "presentational", contexts: ["home"] }],
    taskCoverage: ["sp-nl-01"]
  }),

  // ================= NOVICE MID =================
  spec("novice-mid", 0, {
    components: [{ id: "answer-questions", function: "describe" }],
    taskCoverage: ["sp-nm-01", "sp-nm-03"],
    notes: "Deliberately unrestricted by context — 'answer simple questions' is generic by nature. Evidence legitimately overlaps with novice-mid__1 when a family-topic answer qualifies for both; that's correct double credit, not a bug."
  }),
  spec("novice-mid", 1, {
    components: [{ id: "discuss-family", function: "describe", contexts: ["family"] }],
    taskCoverage: ["sp-nm-01"]
  }),
  spec("novice-mid", 2, {
    components: [{ id: "order-food", function: "negotiate", contexts: ["food"] }],
    taskCoverage: ["sp-nm-02"]
  }),
  spec("novice-mid", 3, {
    components: [{ id: "likes-dislikes", function: "compare" }],
    taskCoverage: ["sp-nm-03"]
  }),

  // ================= NOVICE HIGH =================
  spec("novice-high", 0, {
    components: [{ id: "handle-daily-situation", function: "negotiate" }],
    taskCoverage: ["sp-nh-02"],
    notes: "Deliberately unrestricted by context — this statement is meant to be a broad catch-all, unlike novice-high__2 below."
  }),
  spec("novice-high", 1, {
    components: [{ id: "describe-routine", function: "describe", mode: "presentational" }],
    taskCoverage: ["sp-nh-01"]
  }),
  spec("novice-high", 2, {
    components: [{
      id: "negotiate-plans", function: "negotiate", contexts: ["plans"],
      marker: /\b(qué tal si|podríamos|te parece si|propongo|vamos a|mejor otro día|no puedo|de acuerdo)\b/i
    }],
    taskCoverage: [],
    notes: "GAP — the original bug report's example. No task carries a 'plans' context tag yet, so this can only reach not-started until Phase 2 authors one. Deliberately scoped to its own context rather than left unrestricted: an earlier draft of this spec let it match any negotiate/novice-high evidence, which meant passing the unrelated metro-card task (novice-high__0) would falsely validate 'Talk about plans' too — caught by this file's own smoke test."
  }),

  // ================= INTERMEDIATE LOW =================
  spec("intermediate-low", 0, {
    components: [{ id: "sustain-exchange", function: "negotiate", requiresConversationTurn: true }],
    taskCoverage: ["sp-il-03"]
  }),
  spec("intermediate-low", 1, {
    components: [{
      id: "ask-follow-up", function: "negotiate", requiresConversationTurn: true,
      marker: /\?|¿/
    }],
    taskCoverage: ["sp-il-03"],
    notes: "Thin coverage — only one existing task explicitly instructs the learner to produce their own follow-up question. Phase 1 can only credit this via the function/context signal, not by confirming a question was actually asked (needs raw text — see docs §9.3)."
  }),
  spec("intermediate-low", 2, {
    components: [{ id: "personal-experience", function: "narrate", requiresConversationTurn: true }],
    taskCoverage: ["sp-il-01", "sp-il-02"]
  }),

  // ================= INTERMEDIATE MID =================
  spec("intermediate-mid", 0, {
    components: [{ id: "discuss-in-detail", function: "describe", mode: "presentational", requiresConversationTurn: true }],
    taskCoverage: ["sp-im-03"]
  }),
  spec("intermediate-mid", 1, {
    components: [{ id: "describe-events", function: "narrate", mode: "presentational", requiresConversationTurn: true }],
    taskCoverage: ["sp-im-01"]
  }),
  spec("intermediate-mid", 2, {
    components: [{ id: "explain-preferences", function: "advise" }],
    taskCoverage: ["sp-im-04"],
    notes: "Closest existing function match — the bank has no dedicated 'compare/prefer with reasons' task at this tier yet."
  }),

  // ================= INTERMEDIATE HIGH =================
  spec("intermediate-high", 0, {
    components: [{ id: "narrate-time-frames", function: "narrate", mode: "presentational", requiresConversationTurn: true }],
    taskCoverage: ["sp-ih-01"]
  }),
  spec("intermediate-high", 1, {
    components: [{ id: "handle-unexpected", function: "negotiate", requiresConversationTurn: true }],
    taskCoverage: ["sp-ih-02"]
  }),
  spec("intermediate-high", 2, {
    components: [{ id: "support-opinions", function: "persuade" }],
    taskCoverage: ["sp-ih-03"]
  }),

  // ================= ADVANCED LOW =================
  spec("advanced-low", 0, {
    components: [{ id: "all-time-frames", function: "narrate", mode: "presentational" }],
    taskCoverage: ["sp-al-01"]
  }),
  spec("advanced-low", 1, {
    components: [{
      id: "causes-effects", function: "persuade", mode: "presentational", contexts: ["civic"],
      marker: /\b(la causa|como resultado|por eso|debido a)\b/i
    }],
    taskCoverage: ["sp-al-03"]
  }),
  spec("advanced-low", 2, {
    components: [{ id: "abstract-topics", function: "persuade", mode: "presentational", contexts: ["abstract-opinion"] }],
    taskCoverage: [],
    notes: "GAP — 'abstract-opinion' context tasks only exist at Advanced High today. Scoped to that context rather than reusing 'civic' (advanced-low__1's context): sharing it would let passing 'Explain causes and effects' automatically validate 'Discuss abstract topics' from the same evidence, which is the same false-credit failure mode novice-high__2 was fixed for."
  }),
  spec("advanced-low", 3, {
    components: [{ id: "defend-opinions", function: "persuade", contexts: ["work"], requiresConversationTurn: true }],
    taskCoverage: ["sp-al-02"]
  }),
  spec("advanced-low", 4, {
    components: [{
      id: "organized-paragraphs", function: "any", mode: "presentational",
      extraCheck: (entry) => entry.dims && entry.dims.textType >= 3
    }],
    taskCoverage: ["any advanced-low task"],
    notes: "Cross-cutting: not tied to one function — checks the rubric's textType dimension across any Advanced Low evidence."
  })
];

// Dev-time consistency check, not a runtime assertion — call manually (e.g.
// from a scratch script) after editing either this file or data/roadmap.js's
// canDo lists, to catch id drift before it causes a silent gap.
export function findCanDoSpecDrift() {
  const specIds = new Set(CAN_DO_VALIDATION_SPECS.map((s) => s.id));
  const roadmapIds = new Set(allCanDoIds());
  return {
    missingFromSpecs: [...roadmapIds].filter((id) => !specIds.has(id)),
    orphanedSpecs: [...specIds].filter((id) => !roadmapIds.has(id))
  };
}

export function canDoStatementText(id) {
  const [levelCode, indexStr] = id.split("__");
  const level = ACTFL_LEVELS.find((l) => l.code === levelCode);
  return level ? level.canDo[Number(indexStr)] : null;
}

export function specForCanDo(id) {
  return CAN_DO_VALIDATION_SPECS.find((s) => s.id === id) || null;
}
