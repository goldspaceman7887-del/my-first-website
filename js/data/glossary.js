// Tap-any-word glossary, used by core/tapword.js across Dialogues, Reading,
// and Grammar example sentences.
//
// Keyed by the SURFACE FORM as it actually appears in text, lowercased and
// stripped of punctuation — not by dictionary lemma. A learner tapping
// "levantábamos" wants to know what that word is doing right there, so
// conjugated verbs carry their infinitive and tense rather than being
// silently normalised away.
//
// One rule governs the whole thing: a word is only underlined if we can
// actually define it (see core/tapword.js). So this file covers the closed,
// high-frequency set of function words and common conjugated verb forms,
// then falls back to the full VOCABULARY list for everything else.

import { VOCABULARY } from "./vocabulary.js";

export const GLOSSARY = {
  // --- articles, pronouns, function words ---
  a: "to, at",
  al: "to the (a + el)",
  algo: "something",
  alguien: "someone",
  antes: "before",
  así: "like that, that way",
  aunque: "although",
  bastante: "quite, fairly",
  cada: "each, every",
  casi: "almost",
  como: "like, about, around",
  con: "with",
  cuando: "when",
  de: "of, from",
  del: "of the (de + el)",
  después: "after, afterwards",
  donde: "where",
  dónde: "where",
  el: "the (masculine)",
  él: "he, him",
  ella: "she, her",
  ellas: "they, them (feminine)",
  ellos: "they, them (masculine)",
  en: "in, on, at",
  eso: "that (neuter)",
  esa: "that (feminine)",
  ese: "that (masculine)",
  esta: "this (feminine)",
  este: "this (masculine)",
  esto: "this (neuter)",
  hasta: "until, up to",
  hoy: "today",
  igual: "the same",
  la: "the (feminine); her, it",
  las: "the (feminine plural); them",
  le: "to him / to her / to you (indirect object)",
  les: "to them / to you all (indirect object)",
  lo: "it; the (neuter) — 'lo difícil' = the hard part",
  los: "the (masculine plural); them",
  me: "me, to me, myself",
  mejor: "better, best",
  mi: "my",
  mientras: "while",
  mis: "my (plural)",
  muchas: "many (feminine)",
  mucho: "a lot, much",
  muy: "very",
  nada: "nothing",
  nadie: "no one",
  ni: "nor, not even",
  no: "no, not",
  nos: "us, to us, ourselves",
  nosotros: "we, us",
  nunca: "never",
  o: "or",
  os: "you all, to you all (vosotros object form)",
  para: "for, in order to",
  pero: "but",
  poco: "a little, few",
  por: "for, by, through",
  porque: "because",
  pues: "well, then",
  que: "that, which, who",
  qué: "what",
  quien: "who, whom",
  quién: "who",
  se: "himself / herself / itself; one",
  si: "if",
  sí: "yes",
  siempre: "always",
  sin: "without",
  solo: "only, alone",
  su: "his, her, their, your (formal)",
  sus: "his, her, their, your (formal, plural)",
  también: "also, too",
  tampoco: "neither, not either",
  te: "you, to you, yourself",
  todavía: "still, yet",
  todo: "all, everything",
  todos: "all, everyone, every",
  tu: "your",
  tú: "you (informal)",
  tus: "your (plural)",
  un: "a, an (masculine)",
  una: "a, an (feminine)",
  usted: "you (formal)",
  ustedes: "you all (formal, or general plural outside Spain)",
  vosotras: "you all (informal, feminine — Spain)",
  vosotros: "you all (informal — Spain)",
  y: "and",
  ya: "already, now",
  yo: "I",

  // --- numbers & time ---
  cinco: "five",
  cuatro: "four",
  diez: "ten",
  dos: "two",
  media: "half — 'seis y media' = six thirty",
  minutos: "minutes",
  nueve: "nine",
  ocho: "eight",
  once: "eleven",
  seis: "six",
  siete: "seven",
  tres: "three",
  veinte: "twenty",
  años: "years — 'tengo veinte años' = I am twenty",
  hora: "hour, time",
  horas: "hours",
  día: "day",
  días: "days",
  domingo: "Sunday",
  lunes: "Monday",
  martes: "Tuesday",
  miércoles: "Wednesday",
  jueves: "Thursday",
  viernes: "Friday",
  sábado: "Saturday",
  semana: "week",
  ahora: "now",
  luego: "later, then",
  mañana: "tomorrow; the morning",
  tarde: "late; the afternoon",
  temprano: "early",
  pasado: "last, past",
  ayer: "yesterday",
  final: "end — 'al final' = in the end",

  // --- common verb forms (ser, estar, tener, hacer, ir, querer, poder...) ---
  soy: "I am (ser)",
  eres: "you are (ser)",
  es: "he/she/it is (ser)",
  somos: "we are (ser)",
  sois: "you all are (ser, vosotros — Spain)",
  son: "they are (ser)",
  ser: "to be (permanent qualities)",
  sería: "it would be (ser, conditional)",
  era: "it was, used to be (ser, imperfect)",
  fue: "it was; he/she went (ser / ir, preterite)",
  fueron: "they were / went (ser / ir, preterite)",
  estoy: "I am (estar — location or state)",
  estás: "you are (estar)",
  está: "he/she/it is (estar)",
  estamos: "we are (estar)",
  estáis: "you all are (estar, vosotros — Spain)",
  están: "they are (estar)",
  estaba: "it was (estar, imperfect)",
  tengo: "I have; I am (with age)",
  tienes: "you have (tener)",
  tiene: "he/she/it has (tener)",
  tenemos: "we have (tener)",
  tenéis: "you all have (tener, vosotros — Spain)",
  tienen: "they have (tener)",
  tenía: "I/he/she had, used to have (tener, imperfect)",
  tuve: "I had (tener, preterite)",
  hago: "I do, I make (hacer)",
  haces: "you do, you make (hacer)",
  hace: "he/she/it does/makes; 'hace calor' = it's hot",
  hacer: "to do, to make",
  hecho: "done, made (past participle of hacer)",
  hacía: "I/he/she was doing (hacer, imperfect)",
  voy: "I go (ir)",
  vas: "you go (ir)",
  va: "he/she/it goes (ir)",
  vamos: "we go, let's go (ir)",
  vais: "you all go (ir, vosotros — Spain)",
  van: "they go (ir)",
  ir: "to go",
  iba: "I/he/she was going, used to go (ir, imperfect)",
  quiero: "I want (querer)",
  quieres: "you want (querer)",
  quiere: "he/she/it wants (querer)",
  queremos: "we want (querer)",
  quieren: "they want (querer)",
  puedo: "I can (poder)",
  puedes: "you can (poder)",
  puede: "he/she/it can (poder)",
  podemos: "we can (poder)",
  pueden: "they can (poder)",
  digo: "I say (decir)",
  dice: "he/she/it says (decir)",
  dijo: "he/she said (decir, preterite)",
  dije: "I said (decir, preterite)",
  veo: "I see (ver)",
  ve: "he/she/it sees (ver)",
  vio: "he/she saw (ver, preterite)",
  doy: "I give (dar)",
  da: "he/she/it gives (dar)",
  llamo: "I call — 'me llamo' = my name is",
  llama: "he/she/it calls — 'se llama' = his/her name is",
  llamé: "I called (llamar, preterite)",
  gusta: "pleases — 'me gusta' = I like it",
  gustan: "please (plural) — 'me gustan' = I like them",
  gusto: "pleasure — 'mucho gusto' = nice to meet you",
  vivo: "I live (vivir)",
  vive: "he/she lives (vivir)",
  creo: "I think, I believe (creer)",
  sé: "I know (saber)",
  sabe: "he/she knows (saber)",
  llegar: "to arrive, to get somewhere",
  llegué: "I arrived (llegar, preterite)",
  llegó: "he/she arrived (llegar, preterite)"
};

// Words are looked up by their bare lowercase form, so punctuation and the
// inverted marks Spanish opens questions with must come off first.
export function normalizeWord(w) {
  return String(w || "")
    .toLowerCase()
    .replace(/[¿?¡!.,;:"'()—–…«»]/g, "")
    .trim();
}

// VOCABULARY is itself a dictionary, so rather than duplicating those
// meanings here it is indexed and used as a second layer. Articles come off,
// because a reader taps "mercado", not "el mercado".
let vocabIndex = null;
function buildVocabIndex() {
  const idx = new Map();
  for (const v of VOCABULARY) {
    const key = normalizeWord(v.es).replace(/^(el|la|los|las|un|una)\s+/, "");
    if (key && !key.includes(" ") && !idx.has(key)) idx.set(key, v.en);
  }
  return idx;
}

// Lookup order: the hand-written glossary first, because it carries the
// exact inflected form and its tense; then the vocabulary list; then a
// cautious plural rule. Anything else returns null, and the caller must not
// make that word tappable — an underline that yields nothing is worse than
// no underline.
export function lookupWord(w) {
  const key = normalizeWord(w);
  if (!key) return null;
  if (GLOSSARY[key]) return GLOSSARY[key];

  if (!vocabIndex) vocabIndex = buildVocabIndex();
  if (vocabIndex.has(key)) return vocabIndex.get(key);

  // Plurals only — dropping -s or -es is safe. Guessing at verb endings or
  // gender is not, and a confidently wrong definition teaches the wrong thing.
  if (key.length > 3) {
    const singular = key.endsWith("es") ? key.slice(0, -2) : key.endsWith("s") ? key.slice(0, -1) : null;
    if (singular) {
      if (GLOSSARY[singular]) return `${GLOSSARY[singular]} (plural)`;
      if (vocabIndex.has(singular)) return `${vocabIndex.get(singular)} (plural)`;
    }
  }
  return null;
}

export function hasDefinition(w) {
  return lookupWord(w) !== null;
}
