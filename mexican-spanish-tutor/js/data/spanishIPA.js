// Rule-based Spanish → IPA transcription, Mexican pronunciation.
//
// Spanish orthography is close to phonemic, so a transcriber gets this right
// far more consistently than a thousand hand-typed IPA strings would. The
// output is checked against the app's hand-written pronunciations as ground
// truth, so regressions in these rules show up as test failures.
//
// Mexican specifics: seseo (z and soft c are /s/, never /θ/), yeísmo
// (ll and y both /ʝ/), and /x/ for j and soft g.

const ACCENTED = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ü": "u" };
const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const STRONG = new Set(["a", "e", "o"]);

// Clusters that stay together at the start of a syllable ("ha-blar", not "hab-lar")
const INSEPARABLE = new Set([
  "pl", "pɾ", "bl", "bɾ", "fl", "fɾ", "tl", "tɾ", "dɾ", "kl", "kɾ", "ɡl", "ɡɾ",
  // Spirantization runs before syllabification, so the softened forms of those
  // clusters have to be listed too or "cuadra" splits as kwað.ɾa.
  "βl", "βɾ", "ðɾ", "ɣl", "ɣɾ"
]);

// Transcribe one orthographic word into phoneme objects.
function toPhonemes(word) {
  const out = [];
  const w = word.toLowerCase();
  let i = 0;
  const atStart = () => out.length === 0;

  while (i < w.length) {
    const c = w[i];
    const next = w[i + 1] || "";
    const two = c + next;

    // --- digraphs ---
    if (two === "ch") { out.push({ p: "tʃ", v: false }); i += 2; continue; }
    if (two === "ll") { out.push({ p: "ʝ", v: false }); i += 2; continue; }
    if (two === "rr") { out.push({ p: "r", v: false }); i += 2; continue; }
    if (two === "qu") { out.push({ p: "k", v: false }); i += 2; continue; }
    if (c === "g" && (two === "gu") && "eiéí".includes(w[i + 2] || "")) {
      out.push({ p: "ɡ", v: false }); i += 2; continue;
    }
    if (c === "g" && next === "ü") { out.push({ p: "ɡ", v: false }, { p: "w", v: false }); i += 2; continue; }

    // --- vowels ---
    if (VOWELS.has(c) || ACCENTED[c]) {
      const base = ACCENTED[c] || c;
      out.push({ p: base, v: true, accented: Boolean(ACCENTED[c]) && c !== "ü", strong: STRONG.has(base) });
      i += 1; continue;
    }

    // --- single consonants ---
    switch (c) {
      case "b": case "v": out.push({ p: "b", v: false }); break;
      case "c":
        out.push({ p: "eiéí".includes(next) ? "s" : "k", v: false });
        break;
      case "z": out.push({ p: "s", v: false }); break;       // seseo
      case "g":
        out.push({ p: "eiéí".includes(next) ? "x" : "ɡ", v: false });
        break;
      case "j": out.push({ p: "x", v: false }); break;
      case "h": break;                                        // silent
      case "ñ": out.push({ p: "ɲ", v: false }); break;
      case "y":
        // Consonant before a vowel ("yo"), otherwise the vowel /i/ ("hoy", "y")
        if (VOWELS.has(next) || ACCENTED[next]) out.push({ p: "ʝ", v: false });
        else out.push({ p: "i", v: true, accented: false, strong: false });
        break;
      case "x": out.push({ p: "k", v: false }, { p: "s", v: false }); break;
      case "r":
        // Trilled word-initially and after l, n, s; a tap everywhere else
        out.push({ p: atStart() || ["l", "n", "s"].includes((out[out.length - 1] || {}).p) ? "r" : "ɾ", v: false });
        break;
      case "w": out.push({ p: "w", v: false }); break;
      case "l": case "m": case "n": case "p": case "t": case "d": case "f": case "s": case "k":
        out.push({ p: c, v: false }); break;
      default: break; // punctuation and anything else is dropped
    }
    i += 1;
  }
  return out;
}

// Group phonemes into syllables. Only the boundaries matter here — they decide
// where the stress mark goes.
function syllabify(ph) {
  const nuclei = [];
  for (let i = 0; i < ph.length; i++) {
    if (!ph[i].v) continue;
    if (nuclei.length) {
      const prev = nuclei[nuclei.length - 1];
      // A diphthong needs adjacency, at least one weak vowel, and no written
      // accent on that weak vowel ("día" is two syllables, "hoy" is one).
      const adjacent = prev.end === i - 1;
      const bothStrong = ph[i].strong && ph[prev.end].strong;
      const weakAccented = (!ph[i].strong && ph[i].accented) || (!ph[prev.end].strong && ph[prev.end].accented);
      if (adjacent && !bothStrong && !weakAccented) { prev.end = i; continue; }
    }
    nuclei.push({ start: i, end: i });
  }
  if (!nuclei.length) return [{ from: 0, to: ph.length - 1, nucleus: null }];

  const syllables = [];
  for (let n = 0; n < nuclei.length; n++) {
    const isLast = n === nuclei.length - 1;
    let from;
    if (n === 0) {
      from = 0; // everything before the first vowel is its onset
    } else {
      // Consonants between this nucleus and the previous one
      const gapStart = nuclei[n - 1].end + 1;
      const gapLen = nuclei[n].start - gapStart;
      if (gapLen <= 1) from = nuclei[n].start - gapLen;
      else {
        const pair = ph[nuclei[n].start - 2].p + ph[nuclei[n].start - 1].p;
        // Two-consonant onset if inseparable, otherwise split them
        from = INSEPARABLE.has(pair) ? nuclei[n].start - 2 : nuclei[n].start - 1;
      }
    }
    const to = isLast ? ph.length - 1 : nuclei[n].end;
    syllables.push({ from, to, nucleusIdx: nuclei[n] });
  }
  // Every phoneme must land in exactly one syllable: a syllable runs right up
  // to where the next one starts, or "mande" loses its /n/ altogether.
  for (let n = 0; n < syllables.length - 1; n++) {
    syllables[n].to = syllables[n + 1].from - 1;
  }
  return syllables;
}

function stressIndex(ph, syllables, raw) {
  // A written accent always wins
  for (let s = 0; s < syllables.length; s++) {
    for (let i = syllables[s].from; i <= syllables[s].to; i++) {
      if (ph[i] && ph[i].v && ph[i].accented) return s;
    }
  }
  if (syllables.length === 1) return 0;
  // Otherwise: words ending in a vowel, n or s stress the penultimate syllable
  const last = raw.replace(/[^a-záéíóúüñ]/gi, "").slice(-1).toLowerCase();
  const openEnding = VOWELS.has(ACCENTED[last] || last) || last === "n" || last === "s";
  return openEnding ? syllables.length - 2 : syllables.length - 1;
}

// In a rising diphthong the unstressed high vowel is a glide, not a full
// vowel: "bueno" is /ˈbwe.no/, not /ˈbu.e.no/.
function applyGlides(ph, syllables) {
  syllables.forEach((s) => {
    for (let i = s.from; i < s.to; i++) {
      const cur = ph[i];
      const nxt = ph[i + 1];
      if (!cur || !nxt || !cur.v || !nxt.v) continue;
      if (cur.accented || cur.strong) continue;
      if (cur.p === "i") cur.p = "j";
      else if (cur.p === "u") cur.p = "w";
    }
  });
}

// b, d and g soften to fricatives except at the start of a word or after a
// nasal — "favor" is /fa.ˈβoɾ/, but "bueno" keeps its hard /b/.
function spirantize(ph) {
  const NASAL = new Set(["m", "n", "ɲ"]);
  for (let i = 1; i < ph.length; i++) {
    const prev = ph[i - 1].p;
    if (NASAL.has(prev)) continue;
    if (ph[i].p === "b") ph[i].p = "β";
    else if (ph[i].p === "d" && prev !== "l") ph[i].p = "ð";
    else if (ph[i].p === "ɡ") ph[i].p = "ɣ";
  }
}

function transcribeWord(raw) {
  const ph = toPhonemes(raw);
  if (!ph.length) return "";
  spirantize(ph);
  const syl = syllabify(ph);
  applyGlides(ph, syl);
  // Monosyllables are left unmarked, the way the app's hand-written
  // pronunciations do it — stress is only contrastive across syllables.
  const accentedMonosyllable = syl.length === 1 && ph.some((x) => x.v && x.accented);
  const stressed = syl.length > 1 || accentedMonosyllable ? stressIndex(ph, syl, raw) : -1;
  return syl
    .map((s, idx) => (idx === stressed ? "ˈ" : "") + ph.slice(s.from, s.to + 1).map((p) => p.p).join(""))
    .join(".")
    .replace(/^\./, "");
}

// Transcribes a word or a short phrase. Punctuation and the inverted marks
// that open Spanish questions are ignored.
export function spanishIPA(text) {
  return String(text || "")
    .replace(/[¿?¡!.,;:()"']/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((chunk) => (chunk === "/" ? "/" : transcribeWord(chunk)))
    .join(" ");
}
