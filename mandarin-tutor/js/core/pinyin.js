// Converts diacritic pinyin ("nǐ hǎo") to tone-number pinyin ("ni3 hao3")
// for the spec's Pronunciation Coach ("nǐ hǎo / ni3 hao3").

const TONE_MAP = {
  "ā": ["a", 1], "á": ["a", 2], "ǎ": ["a", 3], "à": ["a", 4],
  "ē": ["e", 1], "é": ["e", 2], "ě": ["e", 3], "è": ["e", 4],
  "ī": ["i", 1], "í": ["i", 2], "ǐ": ["i", 3], "ì": ["i", 4],
  "ō": ["o", 1], "ó": ["o", 2], "ǒ": ["o", 3], "ò": ["o", 4],
  "ū": ["u", 1], "ú": ["u", 2], "ǔ": ["u", 3], "ù": ["u", 4],
  "ǖ": ["ü", 1], "ǘ": ["ü", 2], "ǚ": ["ü", 3], "ǜ": ["ü", 4]
};

function syllableToneNumber(syllable) {
  let base = "";
  let tone = 5; // neutral tone if no mark found
  for (const ch of syllable) {
    if (TONE_MAP[ch]) {
      base += TONE_MAP[ch][0];
      tone = TONE_MAP[ch][1];
    } else {
      base += ch;
    }
  }
  return `${base}${tone}`;
}

export function toneNumbers(pinyin) {
  return String(pinyin || "")
    .split(/(\s+)/)
    .map((chunk) => (/\s/.test(chunk) ? chunk : chunk.replace(/[a-zA-Züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+/g, (w) => syllableToneNumber(w))))
    .join("");
}

// Returns the tone (1-5) of the first marked vowel found, for tone-color badges.
export function primaryTone(pinyin) {
  for (const ch of String(pinyin || "")) {
    if (TONE_MAP[ch]) return TONE_MAP[ch][1];
  }
  return 5;
}
