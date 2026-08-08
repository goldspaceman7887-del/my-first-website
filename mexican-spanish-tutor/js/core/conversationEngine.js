// Shared "threaded" rule-based conversation engine behind Conversation Mode,
// Immersion Mode, and Scenario Mode.
//
// This used to be ~140 nearly-identical lines duplicated between
// conversation.js and immersion.js (topic threads, tiered probes, reaction
// detection, memory/callbacks, no-repeat tracking). Pulling it out means a
// new capability — like the unpredictability behaviors below — lands once
// and every mode that uses this engine gets it, instead of three call sites
// slowly drifting apart.
//
// createEngine({ persist }) returns one conversation's worth of state and
// behavior. persist:true (Immersion Mode) tracks "already asked" in
// store.state.progress.immersionAsked so it survives a reload; persist:false
// (Conversation Mode) tracks it in an in-memory Set that resets every visit.

import { store } from "./storage.js";
import { levelIndex } from "../data/roadmap.js";
import { estimatedLevel } from "./gamification.js";
import {
  THREADS, REACTIONS, NEUTRAL_REACTIONS, PIVOTS, MEMORY_RULES, CALLBACKS,
  MISUNDERSTANDINGS, INTERRUPTIONS, CLARIFICATION_REQUESTS, MULTI_QUESTION_PROBES,
  FOLLOWUPS
} from "../data/conversationThreads.js";

const UNEXPECTED_BANKS = {
  misunderstanding: MISUNDERSTANDINGS,
  interruption: INTERRUPTIONS,
  clarification: CLARIFICATION_REQUESTS,
  multiQuestion: MULTI_QUESTION_PROBES
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Novice → 0, Intermediate → 1, Advanced → 2
export function learnerTier() {
  const idx = levelIndex(estimatedLevel().code);
  return idx <= 2 ? 0 : idx <= 5 ? 1 : 2;
}

// adaptive/followups default OFF, so a caller that doesn't pass them (every
// existing Conversation Mode call site) gets byte-identical behavior to
// before these were added. Immersion Mode opts in explicitly.
export function createEngine({ persist = false, unpredictability = 0.15, adaptive = false, followups = false } = {}) {
  let thread = null;
  let sessionAsked = new Set(); // used when persist is false
  let sinceCallback = 0;
  let sinceUnexpected = 0;
  let sinceFollowup = 0;
  let greetedName = false;
  // Mutable copies so a caller can retune mid-session (Immersion Mode does,
  // based on how the learner is doing); default behavior for callers that
  // never touch these is identical to the original fixed values.
  let unpredictabilityLevel = unpredictability;
  let tierBias = 0; // -1 (struggling) .. +1 (doing well); only consulted when adaptive is true
  const memory = {};

  function askedList() {
    return store.state.progress.immersionAsked || (store.state.progress.immersionAsked = []);
  }

  function isAsked(key) {
    return persist ? askedList().includes(key) : sessionAsked.has(key);
  }
  function markAsked(key) {
    if (persist) { askedList().push(key); store.save(); }
    else sessionAsked.add(key);
  }
  function clearAsked() {
    if (persist) { askedList().length = 0; store.save(); }
    else sessionAsked = new Set();
  }

  function startThread(t) { thread = t; }
  function getThread() { return thread; }

  function remember(text) {
    MEMORY_RULES.forEach((rule) => {
      const m = text.match(rule.re);
      if (m && m[1]) {
        const v = m[1].trim().replace(/\s+/g, " ");
        if (v.length >= 2 && v.length <= 28) memory[rule.key] = v;
      }
    });
  }

  // "cansada pero contenta" should get "qué bueno", not "ay, lo siento". In
  // Spanish the clause after `pero` carries the real point, so when several
  // sentiments match, the one appearing LAST in the sentence wins.
  function reaction(text) {
    let best = null;
    let bestAt = -1;
    REACTIONS.forEach((r) => {
      const re = new RegExp(r.match.source, r.match.flags.includes("g") ? r.match.flags : r.match.flags + "g");
      let m;
      let last = -1;
      while ((m = re.exec(text)) !== null) {
        last = m.index;
        if (m.index === re.lastIndex) re.lastIndex++;
      }
      if (last > bestAt) { bestAt = last; best = r; }
    });
    return best ? pick(best.lines) : pick(NEUTRAL_REACTIONS);
  }

  // Switch threads if what they said clearly belongs to another topic —
  // that's the learner steering the conversation, and following is natural.
  function detectThread(text) {
    const matches = THREADS.filter((t) => t.match.test(text));
    if (!matches.length) return null;
    if (thread && matches.some((m) => m.id === thread.id)) return null;
    return matches[0];
  }

  function nextProbe(fromThread) {
    const t = fromThread || thread;
    if (!t) return null;
    const tier = learnerTier();
    let eligible = t.probes.filter((p) => p.tier <= tier && !isAsked(`${t.id}:${p.es}`));
    if (!eligible.length) {
      const anyLeft = THREADS.some((x) => x.probes.some((p) => p.tier <= tier && !isAsked(`${x.id}:${p.es}`)));
      if (!anyLeft) { clearAsked(); eligible = t.probes.filter((p) => p.tier <= tier); }
    }
    if (!eligible.length) return null;
    // Default: always reach for the hardest available probe (unchanged from
    // the original behavior). Adaptive mode softens that only when the
    // learner has been visibly struggling this session — it never picks
    // something *harder* than the ceiling already allows, it only ever backs
    // off toward easier, already-eligible material.
    const tiersAvail = eligible.map((p) => p.tier);
    const best = (adaptive && tierBias < -0.4) ? Math.min(...tiersAvail) : Math.max(...tiersAvail);
    const chosen = pick(eligible.filter((p) => p.tier === best));
    markAsked(`${t.id}:${chosen.es}`);
    return chosen;
  }

  // Generic, topic-agnostic "dig one turn deeper" continuation — used instead
  // of always jumping straight to the next scripted thread probe, so a
  // session feels less like a fixed Q&A ladder. Opt-in via `followups` so
  // Conversation Mode is unaffected.
  function maybeFollowup() {
    sinceFollowup++;
    if (sinceFollowup < 2) return null;
    if (Math.random() > 0.4) return null;
    const tier = learnerTier();
    const eligible = FOLLOWUPS.filter((f) => f.tier <= tier && !isAsked(`followup:${f.es}`));
    if (!eligible.length) return null;
    const line = pick(eligible);
    markAsked(`followup:${line.es}`);
    sinceFollowup = 0;
    return line;
  }

  function callback() {
    const options = [];
    Object.keys(memory).forEach((k) => {
      (CALLBACKS[k] || []).forEach((tpl) => {
        const key = `cb:${k}:${tpl.es}`;
        if (!isAsked(key)) options.push({ k, tpl, key });
      });
    });
    if (!options.length) return null;
    const { k, tpl, key } = pick(options);
    markAsked(key);
    return { es: tpl.es.replace("{v}", memory[k]), en: tpl.en.replace("{v}", memory[k]) };
  }

  // Occasionally the partner mishears you, cuts in with a tangent, asks you
  // to clarify, or stacks two questions in one turn — instead of always
  // politely single-threading like a form. Gated by a cooldown so it never
  // fires two turns in a row, and every bank line ends in "?" so it still
  // reads as "the partner is asking something," not a non-sequitur.
  function maybeUnexpected() {
    sinceUnexpected++;
    if (sinceUnexpected < 3) return null;
    if (Math.random() > unpredictabilityLevel) return null;
    const kinds = Object.keys(UNEXPECTED_BANKS);
    const kind = pick(kinds);
    const bank = UNEXPECTED_BANKS[kind] || [];
    const eligible = bank.filter((line) => !isAsked(`unexpected:${kind}:${line.es}`));
    if (!eligible.length) return null;
    const line = pick(eligible);
    markAsked(`unexpected:${kind}:${line.es}`);
    sinceUnexpected = 0;
    return { kind, es: line.es, en: line.en };
  }

  function respond(text) {
    const react = reaction(text);
    sinceCallback++;

    // Someone who tells you their name expects you to use it.
    if (memory.nombre && !greetedName) {
      greetedName = true;
      const p = nextProbe() || thread.open;
      return { es: `¡Mucho gusto, ${memory.nombre}! ${p.es}`, en: `Nice to meet you, ${memory.nombre}! ${p.en}` };
    }

    const unexpected = maybeUnexpected();
    if (unexpected) {
      return { es: unexpected.es, en: unexpected.en, unexpected: unexpected.kind };
    }

    // Every few turns, bring back something they told us earlier.
    if (sinceCallback >= 3) {
      const cb = callback();
      if (cb) {
        sinceCallback = 0;
        return { es: `${react.es} ${cb.es}`, en: `${react.en} ${cb.en}` };
      }
    }

    const steered = detectThread(text);
    if (steered) {
      startThread(steered);
      const p = nextProbe() || steered.open;
      return { es: `${react.es} ${p.es}`, en: `${react.en} ${p.en}` };
    }

    // Only when the learner didn't just steer to a new topic — following
    // their lead always wins over a generic follow-up.
    if (followups) {
      const fu = maybeFollowup();
      if (fu) return { es: `${react.es} ${fu.es}`, en: `${react.en} ${fu.en}` };
    }

    const probe = nextProbe();
    if (probe) return { es: `${react.es} ${probe.es}`, en: `${react.en} ${probe.en}` };

    // Thread exhausted — move somewhere new rather than repeating ourselves.
    const tier = learnerTier();
    const fresh = THREADS.filter((t) => t.id !== (thread && thread.id) &&
      t.probes.some((p) => p.tier <= tier && !isAsked(`${t.id}:${p.es}`)));
    if (fresh.length) {
      const next = pick(fresh);
      startThread(next);
      const p = nextProbe() || next.open;
      // Most pivots are announced ("by the way..."); occasionally the
      // subject just changes, the way people actually talk.
      if (Math.random() < 0.25) return { es: p.es, en: p.en };
      const pivot = pick(PIVOTS);
      return { es: `${pivot.es} ${p.es}`, en: `${pivot.en} ${p.en}` };
    }

    // Been all the way around; start over.
    clearAsked();
    return { es: `${react.es} ${thread.open.es}`, en: `${react.en} ${thread.open.en}` };
  }

  // Both are no-ops for callers that never invoke them (e.g. Conversation
  // Mode), so leaving them unset preserves the original fixed-parameter
  // behavior exactly.
  function setBias(v) { tierBias = v; }
  function setUnpredictability(v) { unpredictabilityLevel = v; }

  return { startThread, getThread, remember, respond, setBias, setUnpredictability };
}
