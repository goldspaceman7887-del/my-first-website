// Small cross-data-file helpers: look up a character's full breakdown by
// its hanzi, and split any word/sentence into its component characters.

import { CHARACTERS } from "../data/characters.js";

const byChar = new Map(CHARACTERS.map((c) => [c.char, c]));

export function findCharacter(char) {
  return byChar.get(char) || null;
}

export function breakdownWord(word) {
  return [...word].map((ch) => ({ char: ch, entry: findCharacter(ch) }));
}
