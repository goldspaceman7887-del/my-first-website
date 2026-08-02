// DISTRACTOR ENGINE — builds wrong answers that are genuinely hard to rule out.
//
// Picking three unrelated sentences as decoys makes a question answerable by
// topic-matching alone: you spot the one about food and you're done, without
// knowing any grammar. Instead, these build MINIMAL PAIRS — the same sentence
// with exactly one real thing changed (ser→estar, por→para, preterite→
// imperfect, gustar agreement, a missing reflexive) so the only way to answer
// is to actually know the point being tested.
//
// English decoys work the same way: near-miss translations that shift tense,
// person, polarity, or a time word, rather than describing a different scene.
//
// Note on boundaries: JavaScript's \b and \w are ASCII-only, so \bcompré\b
// silently fails and \b(\w+)ó\b happily matches *inside* "próximo". Every
// pattern here uses the explicit Unicode-aware boundaries below instead.

const ES_LETTER = "a-záéíóúüñA-ZÁÉÍÓÚÜÑ";
const START = `(?:^|(?<=[\\s(¿¡"'—-]))`;
const END = `(?=[\\s.,!?;:)"'—-]|$)`;

function reWord(word) {
  return new RegExp(`${START}${word}${END}`, "i");
}

// Capitalise the replacement only when it actually starts the sentence —
// otherwise you get tells like "Yesterday We went to the market."
function applySwap(s, re, replacement) {
  const m = s.match(re);
  if (!m) return null;
  const at = m.index;
  // "¿Cuántos..." starts the sentence even though the match isn't at index 0.
  const atStart = at === 0 || /^[\s(¿¡"'—-]*$/.test(s.slice(0, at));
  const rep = atStart ? replacement[0].toUpperCase() + replacement.slice(1) : replacement.toLowerCase();
  const out = s.slice(0, at) + rep + s.slice(at + m[0].length);
  return out === s ? null : out;
}

function swapPair(s, a, b) {
  const outA = applySwap(s, reWord(a), b);
  if (outA) return outA;
  return applySwap(s, reWord(b), a);
}

// Verb-ending rewrites, anchored with Unicode-safe boundaries.
function endingSwap(s, fromEnding, toEnding) {
  const re = new RegExp(`${START}([${ES_LETTER}]{2,})${fromEnding}${END}`);
  const m = s.match(re);
  if (!m) return null;
  const out = s.slice(0, m.index) + m[1] + toEnding + s.slice(m.index + m[0].length);
  return out === s ? null : out;
}

// --- Spanish: one grammatical error per decoy -------------------------------
const ES_RULES = [
  // ser / estar — the single most common confusion for English speakers
  { fn: (s) => swapPair(s, "es", "está") },
  { fn: (s) => swapPair(s, "son", "están") },
  { fn: (s) => swapPair(s, "soy", "estoy") },
  { fn: (s) => swapPair(s, "eres", "estás") },
  // por / para
  { fn: (s) => swapPair(s, "por", "para") },
  // gustar-type agreement
  { fn: (s) => swapPair(s, "gusta", "gustan") },
  { fn: (s) => swapPair(s, "gustó", "gustaron") },
  { fn: (s) => swapPair(s, "encanta", "encantan") },
  { fn: (s) => swapPair(s, "parece", "parecen") },
  // tener idioms vs. ser / hacer
  { fn: (s) => swapPair(s, "tengo", "soy") },
  { fn: (s) => swapPair(s, "tiene", "es") },
  { fn: (s) => swapPair(s, "hace", "está") },
  // preterite <-> imperfect (regular endings), Unicode-safe
  { fn: (s) => endingSwap(s, "é", "aba") },
  { fn: (s) => endingSwap(s, "ó", "aba") },
  { fn: (s) => endingSwap(s, "ió", "ía") },
  { fn: (s) => endingSwap(s, "aba", "ó") },
  { fn: (s) => endingSwap(s, "amos", "ábamos") },
  // subjunctive <-> indicative
  { fn: (s) => swapPair(s, "sea", "es") },
  { fn: (s) => swapPair(s, "tenga", "tiene") },
  { fn: (s) => swapPair(s, "vaya", "va") },
  { fn: (s) => swapPair(s, "llegues", "llegas") },
  { fn: (s) => swapPair(s, "venga", "viene") },
  { fn: (s) => swapPair(s, "haya", "hay") },
  // reflexive pronoun dropped (changes who the action lands on)
  {
    fn: (s) => {
      const re = new RegExp(`${START}(me|te|se|nos) ([${ES_LETTER}]{3,})${END}`, "i");
      const m = s.match(re);
      if (!m) return null;
      let verb = m[2];
      if (m.index === 0) verb = verb[0].toUpperCase() + verb.slice(1);
      const out = s.slice(0, m.index) + verb + s.slice(m.index + m[0].length);
      return out === s ? null : out;
    }
  },
  // article / agreement
  { fn: (s) => swapPair(s, "el", "la") },
  { fn: (s) => swapPair(s, "los", "las") },
  { fn: (s) => swapPair(s, "un", "una") },
  // prepositions
  { fn: (s) => swapPair(s, "a", "en") },
  { fn: (s) => swapPair(s, "de", "en") },
  { fn: (s) => swapPair(s, "al", "en el") },
  // degree words
  { fn: (s) => swapPair(s, "muy", "mucho") },
  // question words learners conflate
  { fn: (s) => swapPair(s, "qué", "cuál") },
  { fn: (s) => swapPair(s, "cuánto", "cuántos") },
  // ir a + infinitive: dropping the linking "a"
  {
    fn: (s) => {
      const re = new RegExp(`${START}(voy|vas|va|vamos|van) a ${END}`, "i");
      const m = s.match(re);
      if (!m) return null;
      let v = m[1];
      if (m.index === 0) v = v[0].toUpperCase() + v.slice(1);
      const out = s.slice(0, m.index) + v + " " + s.slice(m.index + m[0].length);
      return out === s ? null : out;
    }
  }
];

/**
 * Wrong Spanish options that differ from `correct` by exactly one grammar
 * point. Falls back to other real sentences when the sentence can't be
 * perturbed enough ways.
 */
export function spanishDistractors(correct, n, pool = []) {
  return build(correct, n, pool, ES_RULES);
}

// --- English: near-miss translations ---------------------------------------
const EN_RULES = [
  // polarity
  { fn: (s) => applySwap(s, /\bdon't /, "") },
  { fn: (s) => applySwap(s, /\bI (like|want|have|know|go|live|work)\b/, "I don't $1") ? s.replace(/\bI (like|want|have|know|go|live|work)\b/, "I don't $1") : null },
  { fn: (s) => swapPair(s, "is", "isn't") },
  { fn: (s) => swapPair(s, "are", "aren't") },
  // person
  { fn: (s) => swapPersonNumber(s) },
  { fn: (s) => swapPair(s, "my", "your") },
  { fn: (s) => swapPair(s, "he", "she") },
  { fn: (s) => swapPair(s, "his", "her") },
  // tense
  { fn: (s) => swapPair(s, "is", "was") },
  { fn: (s) => swapPair(s, "are", "were") },
  { fn: (s) => swapPair(s, "have", "had") },
  { fn: (s) => swapPair(s, "go", "went") },
  { fn: (s) => swapPair(s, "eat", "ate") },
  // time
  { fn: (s) => swapPair(s, "today", "tomorrow") },
  { fn: (s) => swapPair(s, "yesterday", "tomorrow") },
  { fn: (s) => swapPair(s, "always", "never") },
  { fn: (s) => swapPair(s, "morning", "evening") },
  { fn: (s) => swapPair(s, "early", "late") },
  { fn: (s) => swapPair(s, "before", "after") },
  // degree / quantity
  { fn: (s) => applySwap(s, /\ba lot\b/, "a little") },
  { fn: (s) => applySwap(s, /\bvery\b/, "not very") },
  { fn: (s) => swapPair(s, "two", "three") },
  { fn: (s) => swapPair(s, "three", "four") },
  // question words — a wrong one is a real comprehension error, not a topic tell
  { fn: (s) => swapPair(s, "where", "when") },
  { fn: (s) => swapPair(s, "what", "which") },
  { fn: (s) => swapPair(s, "who", "whose") },
  { fn: (s) => applySwap(s, /\bhow much\b/i, "how many") },
  { fn: (s) => applySwap(s, /\bWhat time\b/, "What day") },
  // antonyms that flip meaning while keeping the topic
  { fn: (s) => swapPair(s, "start", "end") },
  { fn: (s) => swapPair(s, "hot", "cold") },
  { fn: (s) => swapPair(s, "big", "small") },
  { fn: (s) => swapPair(s, "cheap", "expensive") },
  { fn: (s) => swapPair(s, "near", "far") },
  { fn: (s) => swapPair(s, "left", "right") },
  { fn: (s) => applySwap(s, /\bget up\b/i, "go to bed") },
  // register / modality
  { fn: (s) => swapPair(s, "can", "must") },
  { fn: (s) => swapPair(s, "like", "love") },
  { fn: (s) => swapPair(s, "should", "will") }
];

/**
 * Wrong English options that are near-miss readings of the same sentence —
 * right topic, wrong tense/person/polarity — so topic-matching won't save you.
 */
export function englishDistractors(correct, n, pool = []) {
  return build(correct, n, pool, EN_RULES);
}

// Swapping I<->we has to bring the verb with it, otherwise the decoy is
// obviously broken ("I are going") rather than plausibly wrong.
function swapPersonNumber(s) {
  const pairs = [
    // Contractions first, or "I'm" becomes the giveaway "We'm".
    [/\bI'm\b/, "we're"], [/\bwe're\b/i, "I'm"],
    [/\bI've\b/, "we've"], [/\bwe've\b/i, "I've"],
    [/\bI'll\b/, "we'll"], [/\bwe'll\b/i, "I'll"],
    [/\bI am\b/, "we are"], [/\bwe are\b/i, "I am"],
    [/\bI was\b/, "we were"], [/\bwe were\b/i, "I was"],
    [/\bI\b/, "we"], [/\bwe\b/i, "I"]
  ];
  for (const [re, to] of pairs) {
    const out = applySwap(s, re, to);
    // applySwap lowercases mid-sentence replacements; the English "I" is
    // always capitalised, so restore it.
    if (out) return out.replace(/\bi\b/g, "I").replace(/\bi'/g, "I'");
  }
  return null;
}

function build(correct, n, pool, rules) {
  const out = [];
  const seen = new Set([correct]);
  for (const rule of shuffled(rules)) {
    if (out.length >= n) break;
    let variant = null;
    try { variant = rule.fn(correct); } catch (e) { variant = null; }
    if (variant && variant !== correct && !seen.has(variant)) {
      seen.add(variant);
      out.push(variant);
    }
  }
  // When rules can't produce enough decoys, prefer pool sentences sharing the
  // most words with the right answer — an unrelated sentence can be eliminated
  // on topic alone, a similar one can't.
  for (const p of rankBySimilarity(correct, pool)) {
    if (out.length >= n) break;
    if (p && !seen.has(p)) { seen.add(p); out.push(p); }
  }
  return out.slice(0, n);
}

function wordSet(s) {
  return new Set(
    String(s || "").toLowerCase()
      .normalize("NFD").replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/).filter((w) => w.length > 2)
  );
}

function rankBySimilarity(correct, pool) {
  const target = wordSet(correct);
  return shuffled(pool)
    .map((p) => {
      const w = wordSet(p);
      let shared = 0;
      w.forEach((x) => { if (target.has(x)) shared++; });
      return { p, score: shared / Math.max(1, Math.min(target.size, w.size)) };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

function shuffled(a) {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}
