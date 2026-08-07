// Shared engine behind Conversation Mode and Immersion Mode. Both views used
// to carry byte-identical copies of learnerTier()/reaction()/detectThread()/
// nextProbe()/callback() — this is the one copy both now call into. The
// views themselves are just UI shells: input handling, chat bubbles, English
// visibility, mic wiring.
//
// Each view gets its own persisted "asked" list (Immersion Mode already had
// one; Conversation Mode gets its own via createProbeSession's progressKey)
// so the two modes don't share — or lose — cross-session memory of what's
// already been asked.

import { store } from "./storage.js";
import { estimatedLevel } from "./gamification.js";
import { levelIndex } from "../data/roadmap.js";
import { THREADS, REACTIONS, NEUTRAL_REACTIONS, MEMORY_RULES, CALLBACKS } from "../data/conversationThreads.js";
import { tierBias } from "./adaptive.js";

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Novice → 0, Intermediate → 1, Advanced → 2, nudged ±1 by adaptive.js's
// rolling recent-performance signal and clamped back into the same bucket —
// a run of struggling turns eases the questions off a notch ahead of the
// learner's canonical ACTFL estimate itself moving.
export function learnerTier() {
  const idx = levelIndex(estimatedLevel().code);
  const base = idx <= 2 ? 0 : idx <= 5 ? 1 : 2;
  return Math.max(0, Math.min(2, base + tierBias()));
}

export function remember(memory, text) {
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
export function reaction(text) {
  let best = null;
  let bestAt = -1;
  REACTIONS.forEach((r) => {
    const re = new RegExp(r.match.source, r.match.flags.includes("g") ? r.match.flags : r.match.flags + "g");
    let m;
    let last = -1;
    while ((m = re.exec(text)) !== null) {
      last = m.index;
      if (m.index === re.lastIndex) re.lastIndex++; // guard against zero-length matches
    }
    if (last > bestAt) { bestAt = last; best = r; }
  });
  return best ? pick(best.lines) : pick(NEUTRAL_REACTIONS);
}

// Switch threads if what they said clearly belongs to another topic — that's
// the learner steering the conversation, and following is the natural move.
export function detectThread(text, currentThread) {
  const matches = THREADS.filter((t) => t.match.test(text));
  if (!matches.length) return null;
  if (currentThread && matches.some((m) => m.id === currentThread.id)) return null; // already here
  return matches[0];
}

// Binds probe/callback picking to one persisted "asked" list in
// store.state.progress[progressKey], so Conversation Mode and Immersion
// Mode each get their own cross-session memory instead of sharing a pool.
export function createProbeSession(progressKey) {
  function askedList() {
    return store.state.progress[progressKey] || (store.state.progress[progressKey] = []);
  }

  // Never asks the same question twice. Once every question at the
  // learner's tier has been used across every thread, the memory clears so
  // the pool comes back around rather than the conversation dead-ending.
  function nextProbe(thread, tier) {
    if (!thread) return null;
    const asked = askedList();
    let eligible = thread.probes.filter((p) => p.tier <= tier && !asked.includes(`${thread.id}:${p.es}`));
    if (!eligible.length) {
      const anyLeft = THREADS.some((x) => x.probes.some((p) => p.tier <= tier && !asked.includes(`${x.id}:${p.es}`)));
      if (!anyLeft) {
        asked.length = 0;
        store.save();
        eligible = thread.probes.filter((p) => p.tier <= tier);
      }
    }
    if (!eligible.length) return null;
    // Prefer the hardest question the learner can actually handle.
    const best = Math.max(...eligible.map((p) => p.tier));
    const chosen = pick(eligible.filter((p) => p.tier === best));
    asked.push(`${thread.id}:${chosen.es}`);
    store.save();
    return chosen;
  }

  // Callbacks are questions too, so they share the same asked list —
  // otherwise a callback could repeat across sessions even though every
  // probe was fresh.
  function callback(memory) {
    const asked = askedList();
    const options = [];
    Object.keys(memory).forEach((k) => {
      (CALLBACKS[k] || []).forEach((tpl) => {
        if (!asked.includes(`cb:${k}:${tpl.es}`)) options.push({ k, tpl });
      });
    });
    if (!options.length) return null;
    const { k, tpl } = pick(options);
    asked.push(`cb:${k}:${tpl.es}`);
    store.save();
    return { es: tpl.es.replace("{v}", memory[k]), en: tpl.en.replace("{v}", memory[k]) };
  }

  // Other threads that still have something fresh to ask, so an exhausted
  // thread can hand off instead of repeating itself.
  function freshThreads(excludeId, tier) {
    const asked = askedList();
    return THREADS.filter((t) => t.id !== excludeId &&
      t.probes.some((p) => p.tier <= tier && !asked.includes(`${t.id}:${p.es}`)));
  }

  return { nextProbe, callback, freshThreads };
}
