// Rule-based common-mistake detector used by the AI Tutor's "Corrector" tool.
// Pure pattern matching (regex heuristics), not a live LLM — but genuinely
// useful for the highest-frequency English-speaker interference errors.

export const MISTAKE_PATTERNS = [
  {
    id: "ser_estar_location",
    test: /\b(soy|eres|es|somos|sois|son)\s+(en|de pie)\b/i,
    mistakeExplained: "Usaste 'ser' para hablar de ubicación. La ubicación siempre se expresa con 'estar', no con 'ser'.",
    correctVersion: "Ej.: 'Está en Madrid' (no 'Es en Madrid').",
    rule: "'Ser' se usa para identidad, características permanentes y origen. 'Estar' se usa para ubicación, estados temporales y condiciones.",
    examples: ["El museo está en el centro.", "Madrid está en España.", "¿Dónde está la estación?"],
    relatedGrammarId: "gram_estar"
  },
  {
    id: "problema_gender",
    test: /\buna? problema\b/i,
    mistakeExplained: "'Problema' termina en -a pero es masculino: dijiste 'una problema' en vez de 'un problema'.",
    correctVersion: "un problema / el problema",
    rule: "Varias palabras de origen griego que terminan en -ma son masculinas: el problema, el programa, el sistema, el tema, el idioma.",
    examples: ["Tengo un problema.", "El sistema no funciona.", "Es un tema interesante."],
    relatedGrammarId: "gram_gender"
  },
  {
    id: "mucho_gente",
    test: /\bmucho gente\b/i,
    mistakeExplained: "'Gente' es femenino singular, así que necesita 'mucha', no 'mucho'.",
    correctVersion: "mucha gente",
    rule: "Los adjetivos concuerdan en género y número con el sustantivo. 'Gente' siempre es femenino singular, aunque se refiera a varias personas.",
    examples: ["Había mucha gente en la plaza.", "Es una gente muy amable.", "Poca gente lo sabe."],
    relatedGrammarId: "gram_gender"
  },
  {
    id: "gustar_yo",
    test: /\byo gusto\b/i,
    mistakeExplained: "'Gustar' funciona al revés que en inglés: no dices 'yo gusto algo', dices 'algo me gusta a mí'.",
    correctVersion: "me gusta / me gustan",
    rule: "Con 'gustar', el sujeto gramatical es la cosa que gusta, y la persona lleva un pronombre de objeto indirecto (me, te, le, nos, os, les).",
    examples: ["Me gusta el chocolate.", "Nos gustan las películas españolas.", "¿Te gusta Madrid?"],
    relatedGrammarId: "gram_indirect_object_pronouns"
  },
  {
    id: "tener_frio",
    test: /\b(soy|estoy) (fr[ií]o|calor|hambre|sed|sue[ñn]o|miedo)\b/i,
    mistakeExplained: "En español, sensaciones como el frío, el calor, el hambre o el sueño se expresan con 'tener', no con 'ser' o 'estar'.",
    correctVersion: "tengo frío / tengo hambre / tengo sueño",
    rule: "Muchas sensaciones físicas usan la construcción 'tener + sustantivo': tener frío, tener calor, tener hambre, tener sed, tener sueño, tener miedo.",
    examples: ["Tengo mucho frío hoy.", "¿Tienes hambre?", "Tenemos sueño después de comer."],
    relatedGrammarId: "gram_present_irregular"
  },
  {
    id: "vosotros_ustedes_mix",
    test: /\bvosotros\s+\w*(an|en)\b.*\bustedes\b|\bustedes\b.*\bvosotros\b/i,
    mistakeExplained: "Estás mezclando 'vosotros' (informal, plural, España) con 'ustedes' (formal en España / general en Latinoamérica) en la misma frase.",
    correctVersion: "En España, con amigos usa 'vosotros'; 'ustedes' solo se usa en contextos formales.",
    rule: "España distingue vosotros (informal) de ustedes (formal). Latinoamérica solo usa 'ustedes' para ambos registros. No mezcles las dos formas.",
    examples: ["Vosotros sois mis amigos.", "¿Qué queréis hacer esta noche?", "Ustedes, por favor, esperen aquí (formal)."],
    relatedGrammarId: "gram_spain_advanced_usage"
  },
  {
    id: "double_negative_missing_no",
    test: /\b(nunca|nada|nadie)\b(?!.*\bno\b)/i,
    mistakeExplained: "En español, normalmente se necesita 'no' antes del verbo además de la palabra negativa (a diferencia del inglés, que evita la doble negación).",
    correctVersion: "No tengo nada. / No viene nadie.",
    rule: "El español usa doble negación: 'no' + verbo + palabra negativa (nada, nadie, nunca), cuando la palabra negativa va después del verbo.",
    examples: ["No como nunca carne.", "No conozco a nadie aquí.", "No tengo nada que decir."],
    relatedGrammarId: "gram_questions"
  },
  {
    id: "por_para_confusion",
    test: /\bpara\s+(dos|tres|cuatro|cinco|seis|una?)\s+(d[ií]as|semanas|meses|a[ñn]os|horas)\b/i,
    mistakeExplained: "Para expresar una duración de tiempo ('durante X tiempo'), normalmente se usa 'por', no 'para'.",
    correctVersion: "por dos días / por tres semanas",
    rule: "'Por' se usa para duración, causa y medio; 'para' se usa para propósito, destino y plazo límite.",
    examples: ["Viajé por dos semanas.", "Lo hice por ti.", "Es para el lunes (plazo)."],
    relatedGrammarId: "gram_advanced_connectors"
  },
  {
    id: "personal_a_missing",
    test: /\b(veo|conozco|busco|llamo|ayudo)\s+(mi|el|la|los|las)?\s*(hermano|hermana|amigo|amiga|profesor|profesora|madre|padre)\b(?!.*\ba\b)/i,
    mistakeExplained: "Cuando el objeto directo es una persona específica, el español requiere la 'a personal' antes del objeto.",
    correctVersion: "Veo a mi hermano. / Conozco a la profesora.",
    rule: "La 'a personal' se añade delante de objetos directos que son personas (o mascotas concretas): veo a Juan, conozco a mi amiga.",
    examples: ["Busco a mi hermano.", "Conozco a Ana.", "¿Ves a tus amigos?"],
    relatedGrammarId: "gram_direct_object_pronouns"
  },
  {
    id: "subjunctive_trigger_missing",
    test: /\bespero que\s+\w+(o|a|amos|an)\b/i,
    mistakeExplained: "Después de 'espero que' (expresión de deseo) se necesita el subjuntivo, no el indicativo.",
    correctVersion: "Espero que estés bien. (no 'estás')",
    rule: "Verbos y expresiones de deseo, duda o emoción (esperar que, querer que, ojalá) activan el modo subjuntivo en la cláusula siguiente.",
    examples: ["Espero que tengas un buen día.", "Quiero que vengas a la fiesta.", "Ojalá haga sol mañana."],
    relatedGrammarId: "gram_present_subjunctive"
  },
  {
    id: "accent_tu_possessive",
    test: /\btú\s+(casa|coche|familia|libro|móvil|piso)\b/i,
    mistakeExplained: "Confundiste 'tú' (pronombre, con tilde) con 'tu' (posesivo, sin tilde).",
    correctVersion: "tu casa (posesivo) vs. tú vienes (pronombre)",
    rule: "'Tú' con tilde es el pronombre de sujeto ('you'); 'tu' sin tilde es el posesivo ('your'). Se distinguen solo por la tilde.",
    examples: ["Tu casa es bonita.", "Tú eres muy simpático.", "¿Es tu móvil?"],
    relatedGrammarId: "gram_pronunciation"
  },
  {
    id: "ser_estar_mood",
    test: /\b(soy|es)\s+(cansad[oa]|content[oa]|enfermo|enferma|aburrid[oa]|nervios[oa])\b/i,
    mistakeExplained: "Usaste 'ser' para un estado temporal (cansancio, enfermedad, ánimo). Estos estados requieren 'estar'.",
    correctVersion: "estoy cansado / está enfermo",
    rule: "'Estar' se usa para estados temporales o cambiantes: emociones, salud, condiciones. 'Ser' se reserva para características permanentes o identidad.",
    examples: ["Estoy cansado hoy.", "Mi madre está enferma.", "Estamos muy contentos."],
    relatedGrammarId: "gram_estar"
  },
  {
    id: "coger_warning",
    test: /\bagarr(o|as|a|amos)\s+el\s+(autob[uú]s|metro|tren)\b/i,
    mistakeExplained: "'Agarrar' se entiende en España, pero suena a español latinoamericano. En España, para transporte se dice 'coger'.",
    correctVersion: "cojo el autobús / cojo el metro",
    rule: "En España 'coger' es completamente normal y neutro (tomar/agarrar). En algunos países de Latinoamérica se evita por connotación vulgar — pero en España es la palabra estándar.",
    examples: ["Cojo el metro todos los días.", "¿Coges el autobús 24?", "Voy a coger un taxi."],
    relatedGrammarId: "gram_spain_advanced_usage"
  }
];

export function checkText(text) {
  const hits = [];
  for (const p of MISTAKE_PATTERNS) {
    if (p.test.test(text)) hits.push(p);
  }
  return hits;
}
