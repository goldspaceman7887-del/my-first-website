// WRITING COACH / CORRECTION MODE — rule-based detector for the highest-
// frequency mistakes English speakers make writing Mexican Spanish. Every
// hit returns: my version (implicit — the text itself), the corrected
// version, the natural Mexican version, and a plain-English explanation —
// never a flat "wrong."

export const MISTAKE_PATTERNS = [
  {
    id: "estoy_soy_profession",
    test: /\best\w*\s+(doctor|maestr\w*|abogad\w*|ingenier\w*|estudiante|profesor\w*)\b/i,
    mistakeExplained: "Ser is for identity — profession, occupation, what someone is — while estar is for location or temporary states. Profession takes ser, not estar.",
    correctVersion: "Soy doctor / Soy maestra (use ser, not estar).",
    natural: "Soy maestra de primaria, llevo diez años en esto.",
    rule: "Use ser for identity/profession/origin; use estar for location and temporary states.",
    examples: ["Soy ingeniero.", "Ella es abogada.", "Somos estudiantes."],
    relatedSentenceId: "s01"
  },
  {
    id: "soy_location",
    test: /\bsoy\s+en\b/i,
    mistakeExplained: "Location uses estar, not ser — even though English uses 'to be' for both. 'Soy en' is a very common literal-translation mistake.",
    correctVersion: "Estoy en (not soy en) for location.",
    natural: "Estoy en la oficina ahorita, te llamo al rato.",
    rule: "Location = estar + en + place. Identity = ser + noun.",
    examples: ["Estoy en casa.", "Estamos en el mercado.", "Está en el trabajo."],
    relatedSentenceId: "s01"
  },
  {
    id: "por_para_purpose_confusion",
    test: /\bpor\s+(vivir|trabajar|estudiar|aprender|comprar|ayudar)\b/i,
    mistakeExplained: "When expressing purpose or goal ('in order to'), Mexican Spanish uses para, not por. Por points to cause/reason/exchange, not destination/purpose.",
    correctVersion: "Trabajo para vivir (not por vivir) when stating a purpose.",
    natural: "Trabajo para vivir, no vivo para trabajar.",
    rule: "Para = purpose/goal/destination/recipient. Por = cause/reason/exchange/duration/'through'.",
    examples: ["Estudio para aprender más.", "Ahorro para viajar.", "Lo hice por ti (cause, not purpose)."],
    relatedSentenceId: "s15"
  },
  {
    id: "embarazada_false_friend",
    test: /\bestoy\s+embarazada\b.{0,20}\b(pena|vergüenza|apenad)/i,
    mistakeExplained: "'Embarazada' is a classic false friend — it means 'pregnant', not 'embarrassed'. To say embarrassed, use 'apenado/a' or 'me da pena/vergüenza'.",
    correctVersion: "Me da mucha pena (not estoy embarazada) for 'I'm embarrassed'.",
    natural: "Me dio mucha pena olvidar su nombre.",
    rule: "Embarazada = pregnant. Embarrassed = apenado/a, me da pena/vergüenza.",
    examples: ["Estoy apenada por llegar tarde.", "Me da pena hablar en público.", "Está embarazada de seis meses."],
    relatedSentenceId: null
  },
  {
    id: "missing_personal_a",
    test: /\b(veo|conozco|busco|visito|ayudo|extraño|llamo)\s+(mi|mis|el|la|los|las)?\s*(hermano|hermana|amigo|amiga|papá|mamá|abuelo|abuela|primo|prima|maestro|maestra)\b(?!.*\ba\b)/i,
    mistakeExplained: "When the direct object of a verb is a specific person, Spanish requires the 'personal a' right before it — a rule with no direct English equivalent, so it's easy to forget.",
    correctVersion: "Veo a mi hermano (not veo mi hermano).",
    natural: "Voy a visitar a mi abuela este fin de semana.",
    rule: "Verb + a + [specific person as direct object]. No personal a for things: 'veo la película' (no a needed).",
    examples: ["Conozco a tu hermano.", "Extraño a mis amigos.", "Busco a mi prima en la fiesta."],
    relatedSentenceId: null
  },
  {
    id: "gustar_wrong_subject",
    test: /\byo\s+gusto\b/i,
    mistakeExplained: "Gustar works backwards from English 'to like' — the thing liked is the grammatical subject, and the person is an indirect object (me/te/le...). 'Yo gusto' would mean 'I am liked (by someone)', not 'I like'.",
    correctVersion: "Me gusta (not yo gusto) for 'I like'.",
    natural: "Me gusta mucho la música en vivo.",
    rule: "me/te/le/nos/les + gusta(n) + [the thing liked, which is the real subject].",
    examples: ["Me gusta el café.", "Te gustan los tacos.", "Le gusta bailar."],
    relatedSentenceId: "s02"
  },
  {
    id: "missing_reflexive_pronoun",
    test: /\b(yo\s+)?(levanto|baño|visto|acuesto|despierto)\b(?!\s*(me|te|se|nos))/i,
    mistakeExplained: "Daily-routine verbs like levantarse, bañarse, vestirse are reflexive in Spanish even when the English equivalent isn't ('I wake up' has no reflexive marker, but 'me despierto' does).",
    correctVersion: "Me levanto (not solo 'levanto') — the reflexive pronoun is required.",
    natural: "Me levanto a las seis y media todos los días.",
    rule: "Reflexive daily-routine verbs need me/te/se/nos/se before the conjugated verb.",
    examples: ["Me baño en la mañana.", "Se viste rápido.", "Nos acostamos tarde."],
    relatedSentenceId: "s07"
  },
  {
    id: "adjective_gender_mismatch",
    test: /\b(la|una)\s+\w+a\s+\b(bueno|malo|cansado|ocupado|nervioso|contento|aburrido)\b/i,
    mistakeExplained: "Adjectives must agree in gender with the noun they describe — a feminine noun needs a feminine adjective ending in -a, not the masculine -o form.",
    correctVersion: "Match the adjective ending to the noun's gender: la comida está buena, not bueno.",
    natural: "Mi hermana está muy cansada hoy.",
    rule: "Feminine nouns take -a adjective endings; masculine nouns take -o. This applies to estar/ser + adjective too.",
    examples: ["Ella está contenta.", "La clase estuvo aburrida.", "Mi amiga es muy trabajadora."],
    relatedSentenceId: null
  },
  {
    id: "espero_que_no_subjunctive",
    test: /\bespero\s+que\s+\w*(as|es)\b(?!.*\b(as|es)\b.*(subj))/i,
    mistakeExplained: "Espero que (I hope that) triggers the subjunctive in the following verb because it expresses a wish, not a fact — a common gap for English speakers since English doesn't mark this with a different verb form.",
    correctVersion: "Espero que llegues bien (subjunctive llegues), not llegas.",
    natural: "Espero que te vaya muy bien en tu viaje.",
    rule: "Verbs of wish/hope/doubt/emotion + que + [subjunctive verb], not indicative.",
    examples: ["Espero que estés bien.", "Ojalá que llueva.", "Quiero que vengas."],
    relatedSentenceId: "s11"
  },
  {
    id: "tu_usted_mismatch",
    test: /\busted\b.{0,40}\b(tienes|quieres|puedes|vas|eres|sabes)\b/i,
    mistakeExplained: "Mixing usted (formal 'you') with tú-conjugated verbs (tienes, quieres...) is a common error — usted always pairs with third-person (él/ella) verb forms, even though it means 'you'.",
    correctVersion: "Usted tiene (not usted tienes) — usted takes third-person conjugation.",
    natural: "¿Usted tiene tiempo para una pregunta rápida?",
    rule: "Usted grammatically behaves like él/ella: usted tiene, usted puede, usted sabe — never usted tienes/puedes/sabes.",
    examples: ["¿Usted sabe la hora?", "¿Puede usted ayudarme?", "Usted es muy amable."],
    relatedSentenceId: "s08"
  },
  {
    id: "double_negative_missing_no",
    test: /^\s*(nada|nadie|nunca)\b[^,]{0,40}\b(es|está|tengo|quiero|puedo|hay)\b/i,
    mistakeExplained: "Unlike English, Spanish requires 'no' before the verb even when a negative word like nada/nadie/nunca already appears later in the sentence — double negatives are correct and required, not a mistake.",
    correctVersion: "No hay nada (not just 'nada hay' without no, unless nada leads and you drop it).",
    natural: "No tengo nada que hacer hoy, ¿nos juntamos?",
    rule: "No + verb + negative word (nada/nadie/nunca) is the standard pattern when 'no' comes first, or drop 'no' only when the negative word itself opens the sentence.",
    examples: ["No tengo nada.", "No conozco a nadie aquí.", "Nunca voy solo. / No voy nunca solo."],
    relatedSentenceId: null
  },
  {
    id: "preterite_imperfect_confusion_narration",
    test: /\bcuando\s+(era|tenía)\s+\w+\s+años?,?\s+\w*\s*(fui|comí|jugué|viví)\b/i,
    mistakeExplained: "Background/ongoing states ('when I was X years old') use the imperfect, but a one-time completed action embedded right after often needs the preterite — mixing them up flips the meaning between 'used to' and 'did once'.",
    correctVersion: "Cuando tenía diez años, jugaba fútbol todos los días (imperfect for repeated habit) — but Un día, jugué... (preterite) for one specific occasion.",
    natural: "Cuando era niño, pasaba los veranos en el rancho de mis abuelos.",
    rule: "Imperfect = background, ongoing, habitual past ('used to'). Preterite = a single completed event with a clear start/end.",
    examples: ["De niño, comía mucho pan.", "Un día, comí algo que me hizo daño.", "Cuando vivía ahí, salía mucho."],
    relatedSentenceId: "s05"
  }
];

export function checkText(text) {
  const hits = [];
  for (const p of MISTAKE_PATTERNS) {
    if (p.test.test(text)) hits.push(p);
  }
  return hits;
}
