// Combines connectors + grammar + vocabulary into one gradable review pool for Review Session.
// Each card normalizes to the same shape regardless of source, so the session UI doesn't need
// to know or care whether it's looking at a connector, a grammar structure, or a vocab word.
import { CONNECTORS, CATEGORIES } from "./connectors.js";
import { GRAMMAR, LEVELS as GRAMMAR_LEVELS } from "./grammar.js";
import { VOCABULARY, WORD_LEVELS } from "./vocabulary.js";
import { isDue } from "../core/srs.js";

function markFirst(sentence, target) {
  if (!target) return sentence;
  const idx = sentence.indexOf(target);
  if (idx === -1) return sentence;
  return sentence.slice(0, idx) + "**" + target + "**" + sentence.slice(idx + target.length);
}

function buildPool() {
  const items = [];

  CONNECTORS.forEach((c) => {
    const cat = CATEGORIES.find((k) => k.id === c.category);
    const raw = c.b ? `${c.a} ${c.b}` : c.a;
    items.push({
      id: c.id,
      kind: "connector",
      tag: cat.jp,
      tagColor: cat.color,
      frontJp: markFirst(raw, c.jp),
      listenJp: raw,
      backTitle: c.jp,
      backReading: c.reading,
      backMeaning: c.en,
      backExtra: `register: ${c.register}`,
      backTranslation: null,
    });
  });

  GRAMMAR.forEach((g) => {
    const lvl = GRAMMAR_LEVELS.find((l) => l.id === g.level);
    const ex = g.examples[0];
    items.push({
      id: g.id,
      kind: "grammar",
      tag: `${lvl.id} grammar`,
      tagColor: lvl.color,
      frontJp: ex.jp,
      listenJp: ex.jp.replace(/\*\*/g, ""),
      backTitle: g.title,
      backReading: g.structure,
      backMeaning: null,
      backExtra: g.explanation,
      backTranslation: ex.en,
    });
  });

  VOCABULARY.forEach((w) => {
    const lvl = WORD_LEVELS.find((l) => l.id === w.level);
    items.push({
      id: w.id,
      kind: "vocab",
      tag: `${lvl.id} vocab`,
      tagColor: lvl.color,
      frontJp: w.sentence,
      listenJp: w.sentence.replace(/\*\*/g, ""),
      backTitle: w.jp,
      backReading: w.reading,
      backMeaning: `${w.pos} — ${w.en}`,
      backExtra: null,
      backTranslation: w.sentenceEn,
    });
  });

  return items;
}

export const REVIEW_POOL = buildPool();

export function getDueCount(state) {
  return REVIEW_POOL.filter((item) => isDue(state.srs[item.id])).length;
}

export function getNewAvailableCount(state) {
  return REVIEW_POOL.filter((item) => !state.srs[item.id]).length;
}

export function buildSession(state, newLimit) {
  const limit = newLimit ?? state.reviewStats?.newCardsPerSession ?? 8;
  const due = REVIEW_POOL.filter((item) => isDue(state.srs[item.id]));
  const fresh = REVIEW_POOL.filter((item) => !state.srs[item.id]).slice(0, limit);
  return [...due, ...fresh].sort(() => Math.random() - 0.5);
}
