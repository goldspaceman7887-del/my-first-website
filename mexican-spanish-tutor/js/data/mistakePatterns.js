// SPANISH ERROR CHECKER — the highest-frequency mistakes English speakers make
// writing Mexican Spanish.
//
// The important design point: every rule rewrites YOUR sentence. Showing a
// canned "here's a natural sentence" beside your attempt makes you do the
// diffing yourself, and you usually can't — if you could spot the error you
// would not have made it. So each rule carries a `fix` that transforms the
// fragment it matched, and the checker hands back your own sentence corrected.
//
// Rules only fire when they are confident. A wrong correction teaches a
// mistake, which is worse than saying nothing at all.

const A = "a-záéíóúüñ";

export const MISTAKE_PATTERNS = [
  // ---------- ser vs estar ----------
  {
    id: "estar_profession",
    label: "ser vs estar",
    test: /\b(estoy|est[áa]s|est[áa]|estamos|est[áa]n)\s+((?:un[ao]\s+)?)(doctor|doctora|maestr[oa]|abogad[oa]|ingenier[oa]|estudiante|profesor[a]?|enfermer[oa]|cociner[oa]|taxista)\b/i,
    fix: (m) => {
      const map = { estoy: "soy", estás: "eres", estas: "eres", está: "es", esta: "es", estamos: "somos", están: "son", estan: "son" };
      return `${map[m[1].toLowerCase()] || "soy"} ${m[2]}${m[3]}`;
    },
    why: "Your job is part of who you are, not a passing state, so it takes ser. Estar is for where you are and how you're doing right now.",
    rule: "ser = identity, profession, origin · estar = location, mood, condition",
    examples: ["Soy maestra.", "Es ingeniero.", "Somos estudiantes."]
  },
  {
    id: "ser_location",
    label: "ser vs estar",
    test: /\b(soy|eres|es|somos|son)\s+en\b/i,
    fix: (m) => {
      const map = { soy: "estoy", eres: "estás", es: "está", somos: "estamos", son: "están" };
      return `${map[m[1].toLowerCase()]} en`;
    },
    why: "English uses 'to be' for both identity and location, so 'soy en' feels right — but location always takes estar.",
    rule: "Location = estar + en + place",
    examples: ["Estoy en casa.", "Está en el trabajo.", "Estamos en el mercado."]
  },
  {
    id: "estar_permanent_adj",
    label: "ser vs estar",
    test: /\b(estoy|est[áa]s|est[áa])\s+(alt[oa]|baj[oa]|inteligente|amable)\b/i,
    fix: (m) => {
      const map = { estoy: "soy", estás: "eres", estas: "eres", está: "es", esta: "es" };
      return `${map[m[1].toLowerCase()]} ${m[2]}`;
    },
    why: "These describe what someone is like rather than how they are today, so they take ser.",
    rule: "Lasting qualities take ser; temporary states take estar",
    examples: ["Es muy alta.", "Soy amable.", "Eres inteligente."]
  },

  // ---------- tener idioms ----------
  {
    id: "ser_age",
    label: "age uses tener",
    test: /\b(soy|eres|es)\s+(\d{1,3})\s*(?:años)?\b/i,
    fix: (m) => {
      const map = { soy: "tengo", eres: "tienes", es: "tiene" };
      return `${map[m[1].toLowerCase()]} ${m[2]} años`;
    },
    why: "Spanish says you HAVE years, not that you ARE them.",
    rule: "tener + number + años",
    examples: ["Tengo veinte años.", "¿Cuántos años tienes?", "Tiene treinta y dos años."]
  },
  {
    id: "estar_sensation",
    label: "sensations use tener",
    test: /\b(estoy|est[áa]s)\s+(caliente|fr[íi]o|hambre|sed|sue[ñn]o|miedo)\b/i,
    fix: (m) => {
      const map = { estoy: "tengo", estás: "tienes", estas: "tienes" };
      const w = m[2].toLowerCase();
      const noun = w.startsWith("calien") ? "calor" : w;
      return `${map[m[1].toLowerCase()]} ${noun}`;
    },
    why: "Physical sensations are things you HAVE in Spanish. This one matters: 'estoy caliente' means you're aroused, not that you're warm.",
    rule: "tener calor / frío / hambre / sed / sueño / miedo",
    examples: ["Tengo calor.", "Tengo hambre.", "Tienes sueño."]
  },

  // ---------- por vs para ----------
  {
    id: "por_purpose",
    label: "por vs para",
    test: /\bpor\s+(vivir|trabajar|estudiar|aprender|comprar|ayudar|mejorar|practicar)\b/i,
    fix: (m) => `para ${m[1]}`,
    why: "You're stating the purpose — what you're doing it FOR — and purpose takes para. Por is for causes and reasons.",
    rule: "para = purpose, goal, destination · por = cause, exchange, duration",
    examples: ["Estudio para aprender.", "Ahorro para viajar.", "Lo hice por ti."]
  },

  // ---------- verbs that need no preposition ----------
  {
    id: "buscar_por",
    label: "no preposition needed",
    test: /\bbusc(o|as|a|amos|an|ando|ar)\s+(?:por|para)\s+/i,
    fix: (m) => `busc${m[1]} `,
    why: "Buscar already contains the 'for'. Adding por or para is an English habit.",
    rule: "buscar algo — never buscar por algo",
    examples: ["Busco trabajo.", "Estoy buscando mis llaves."]
  },
  {
    id: "esperar_por",
    label: "no preposition needed",
    test: /\besper(o|as|a|amos|an|ando|ar)\s+por\s+/i,
    fix: (m) => `esper${m[1]} `,
    why: "Esperar already means 'wait for'. 'Esperar por' is a direct translation Spanish doesn't use.",
    rule: "esperar a alguien / esperar algo",
    examples: ["Te espero afuera.", "Esperamos el camión."]
  },
  {
    id: "pedir_por",
    label: "no preposition needed",
    test: /\bpid(o|es|e|en)\s+por\s+/i,
    fix: (m) => `pid${m[1]} `,
    why: "Pedir already means 'ask for'.",
    rule: "pedir algo",
    examples: ["Pedí un café.", "Pide la cuenta."]
  },

  // ---------- gustar ----------
  {
    id: "gustar_subject",
    label: "gustar works backwards",
    test: new RegExp(`\\b(?:yo\\s+)?gusto\\s+((?:el|la|los|las)\\s+[${A}]+|[${A}]+)`, "i"),
    fix: (m) => `me gusta${/^(los|las)\s/i.test(m[1]) ? "n" : ""} ${m[1]}`,
    why: "Gustar doesn't mean 'to like' — it means 'to be pleasing'. The thing you like is the subject, and you're the one it happens to.",
    rule: "me gusta + singular · me gustan + plural",
    examples: ["Me gusta el café.", "Me gustan los tacos.", "¿Te gusta bailar?"]
  },
  {
    id: "gustar_plural_agreement",
    label: "gustar agreement",
    test: /\b(me|te|le|nos|les)\s+gusta\s+(los|las)\s+/i,
    fix: (m) => `${m[1]} gustan ${m[2]} `,
    why: "The verb agrees with the thing being liked, not with you. Plural things take gustan.",
    rule: "me gustan los / las …",
    examples: ["Me gustan los tacos.", "Le gustan las películas."]
  },

  // ---------- reflexives & body parts ----------
  {
    id: "possessive_body",
    label: "body parts take the article",
    test: /\b(lavo|cepillo|lastim[ée])\s+(?:mis|mi)\s+(manos|dientes|cara|pelo|pierna|brazo|mano)\b/i,
    fix: (m) => {
      const article = /^dientes$/i.test(m[2]) ? "los" : /^manos$/i.test(m[2]) ? "las" : /^(pelo|brazo)$/i.test(m[2]) ? "el" : "la";
      return `me ${m[1].toLowerCase()} ${article} ${m[2]}`;
    },
    why: "With your own body, Spanish uses a reflexive plus the definite article — the 'my' is already implied.",
    rule: "me lavo las manos, not lavo mis manos",
    examples: ["Me lavo las manos.", "Me cepillo los dientes.", "Se rompió la pierna."]
  },
  {
    id: "missing_reflexive",
    label: "missing reflexive",
    test: /(?:^|\s)(levanto|acuesto|ba[ñn]o|despierto)\s+(a\s+las|temprano|tarde)\b/i,
    fix: (m) => `me ${m[1].toLowerCase()} ${m[2]}`,
    why: "These are things you do to yourself, so they need me / te / se.",
    rule: "me levanto, me acuesto, me baño, me despierto",
    examples: ["Me levanto a las seis.", "Me acuesto tarde.", "Me despierto temprano."]
  },

  // ---------- hay vs estar ----------
  {
    id: "estar_existence",
    label: "hay, not está",
    test: /\b(?:est[áa]|est[áa]n)\s+(mucha|mucho|muchos|muchas)\s+/i,
    fix: (m) => `hay ${m[1]} `,
    why: "To say something exists or how much of it there is, Spanish uses hay. Estar is for where a specific thing is.",
    rule: "hay = there is / there are",
    examples: ["Hay mucha gente.", "Hay un problema.", "¿Hay tortillas?"]
  },

  // ---------- agreement & quantifiers ----------
  {
    id: "muy_mucho",
    label: "muy vs mucho",
    test: /\bmucho\s+(bueno|malo|grande|caro|bonit[oa]|f[áa]cil|dif[íi]cil|cansad[oa]|content[oa])\b/i,
    fix: (m) => `muy ${m[1]}`,
    why: "Muy modifies adjectives; mucho modifies nouns and verbs.",
    rule: "muy + adjective · mucho + noun",
    examples: ["Muy bueno.", "Mucho trabajo.", "Me gusta mucho."]
  },
  {
    id: "muy_mucho_verb",
    label: "muy vs mucho",
    test: /\bmuy\s+(gusta|gustan|duele|trabajo)\b/i,
    fix: (m) => `mucho ${m[1]}`,
    why: "After a verb you need mucho, not muy.",
    rule: "verb + mucho",
    examples: ["Me gusta mucho.", "Trabajo mucho.", "Me duele mucho."]
  },
  {
    id: "gente_plural",
    label: "gente is singular",
    test: /\bla\s+gente\s+(son|est[áa]n|tienen|hacen|van)(\s+[a-záéíóúñ]+s\b)?/i,
    fix: (m) => {
      const map = { son: "es", están: "está", estan: "está", tienen: "tiene", hacen: "hace", van: "va" };
      // The adjective has to come back to singular as well, or you swap one
      // agreement error for another: "la gente es amables".
      // Only ser/estar are followed by an adjective that must agree. After
      // tener or hacer the plural word is a noun — "la gente tiene problemas"
      // is correct, and singularising it would introduce an error.
      const verb = m[1].toLowerCase();
      const adjectivePosition = verb === "son" || verb.startsWith("est");
      // gente is feminine singular, so "cansados" becomes "cansada".
      const adj = m[2] && adjectivePosition
        ? m[2].replace(/([a-záéíóúñ]+?)(os|as|es|s)\b/i, (w, stem, end) => {
            const e = end.toLowerCase();
            if (e === "os" || e === "as") return stem + "a";
            if (e === "es") return stem + "e";
            return stem;
          })
        : (m[2] || "");
      return `la gente ${map[m[1].toLowerCase()]}${adj}`;
    },
    why: "Gente is grammatically singular in Spanish even though it means several people.",
    rule: "la gente es / está / tiene",
    examples: ["La gente es amable.", "La gente está cansada."]
  },
  {
    id: "un_otro",
    label: "otro takes no article",
    test: /\b(?:un|una)\s+(otr[oa])\b/i,
    fix: (m) => m[1],
    why: "Otro already means 'another'. Putting un in front is an English habit.",
    rule: "otro / otra — never un otro",
    examples: ["Quiero otro café.", "Es otra cosa."]
  },
  {
    id: "mas_mejor",
    label: "mejor already means 'more good'",
    test: /\bm[áa]s\s+(mejor|peor)\b/i,
    fix: (m) => m[1],
    why: "Mejor already means 'better', so más is redundant.",
    rule: "mejor / peor stand alone",
    examples: ["Está mejor así.", "Es peor de lo que pensé."]
  },
  {
    id: "la_problema",
    label: "gender exception",
    test: /\b(la|una|esta)\s+(problema|tema|d[íi]a|idioma|mapa|sistema)\b/i,
    fix: (m) => {
      const map = { la: "el", una: "un", esta: "este" };
      return `${map[m[1].toLowerCase()]} ${m[2]}`;
    },
    why: "These end in -a but are masculine — they came into Spanish from Greek. It's a short, closed list worth memorising.",
    rule: "el problema, el tema, el día, el idioma, el mapa, el sistema",
    examples: ["No hay ningún problema.", "Cambiemos de tema.", "Todo el día."]
  },
  {
    id: "el_mano",
    label: "gender exception",
    test: /\b(el|un|este)\s+(mano|foto|moto)\b/i,
    fix: (m) => {
      const map = { el: "la", un: "una", este: "esta" };
      return `${map[m[1].toLowerCase()]} ${m[2]}`;
    },
    why: "These end in -o but are feminine. Foto and moto are shortened from fotografía and motocicleta.",
    rule: "la mano, la foto, la moto",
    examples: ["Dame la mano.", "Tómame una foto."]
  },
  {
    id: "la_agua",
    label: "el agua (still feminine)",
    test: /\bla\s+(agua|[áa]rea|hambre)\b/i,
    fix: (m) => `el ${m[1]}`,
    why: "A feminine noun starting with a stressed 'a' takes el purely for sound. It stays feminine, so its adjectives do too: el agua fría.",
    rule: "el agua — but el agua está fría",
    examples: ["El agua está fría.", "Tengo hambre."]
  },

  // ---------- personal a ----------
  {
    id: "missing_personal_a",
    label: "missing personal a",
    test: /\b(veo|vi|conoc[íi]|conozco|visit[ée]|visito|llam[ée]|llamo|ayud[ée]|ayudo)\s+((?:mi|mis|tu|su)\s+(?:herman[oa]|mam[áa]|pap[áa]|amig[oa]|hij[oa]|abuel[oa]|prim[oa]))\b/i,
    fix: (m) => `${m[1]} a ${m[2]}`,
    why: "When the direct object is a specific person, Spanish puts an 'a' in front of them. English has nothing like it, so it's easy to drop.",
    rule: "verb + a + person",
    examples: ["Vi a mi hermana.", "Conocí a su papá.", "Llamé a mi mamá."]
  },

  // ---------- subjunctive triggers ----------
  {
    id: "espero_que_indicative",
    label: "subjunctive after espero que",
    test: /\bespero\s+que\s+(vienes|viene|puedes|puede|tienes|tiene|est[áa]s|est[áa]|es|vas|va)\b/i,
    fix: (m) => {
      const map = { vienes: "vengas", viene: "venga", puedes: "puedas", puede: "pueda", tienes: "tengas", tiene: "tenga", estás: "estés", estas: "estés", está: "esté", esta: "esté", es: "sea", vas: "vayas", va: "vaya" };
      return `espero que ${map[m[1].toLowerCase()]}`;
    },
    why: "Hoping isn't stating a fact, so what follows que goes into the subjunctive.",
    rule: "espero que + subjunctive",
    examples: ["Espero que vengas.", "Espero que puedas.", "Espero que estés bien."]
  },
  {
    id: "para_que_indicative",
    label: "subjunctive after para que",
    test: /\bpara\s+que\s+(sabes|sabe|puedes|puede|vienes|viene|entiendes|entiende)\b/i,
    fix: (m) => {
      const map = { sabes: "sepas", sabe: "sepa", puedes: "puedas", puede: "pueda", vienes: "vengas", viene: "venga", entiendes: "entiendas", entiende: "entienda" };
      return `para que ${map[m[1].toLowerCase()]}`;
    },
    why: "Para que introduces a purpose that hasn't happened yet, so it always takes the subjunctive.",
    rule: "para que + subjunctive, always",
    examples: ["Te lo digo para que sepas.", "Habla despacio para que entienda."]
  },
  {
    id: "cuando_future",
    label: "subjunctive after cuando",
    test: /\bcuando\s+(llego|llegas|llega|termino|terminas|termina)\s*,?\s+(te|le|nos|voy|vamos)\b/i,
    fix: (m) => {
      const map = { llego: "llegue", llegas: "llegues", llega: "llegue", termino: "termine", terminas: "termines", termina: "termine" };
      return `cuando ${map[m[1].toLowerCase()]} ${m[2]}`;
    },
    why: "When cuando points at something that hasn't happened yet, it takes the subjunctive.",
    rule: "cuando + subjunctive for future events",
    examples: ["Cuando llegue, te aviso.", "Cuando termines, avísame."]
  },

  // ---------- false friends ----------
  {
    id: "embarazada",
    label: "false friend",
    test: /\b(estoy|est[áa])\s+embarazad[oa]\b/i,
    fix: (m) => (m[1].toLowerCase() === "estoy" ? "tengo pena" : "tiene pena"),
    why: "Embarazada means pregnant, not embarrassed. For embarrassment Mexicans say 'me da pena' or 'tengo pena'.",
    rule: "embarazada = pregnant · pena = embarrassment",
    examples: ["Me da mucha pena.", "Qué pena contigo."],
    alternatives: ["me da vergüenza (also fine, a bit more formal)", "qué oso (very colloquial — \"how embarrassing\")"]
  },
  {
    id: "realizar_false_friend",
    label: "false friend",
    test: /\breali(zo|zas|za|c[ée])\s+que\b/i,
    fix: (m) => {
      const map = { zo: "me doy cuenta de", zas: "te das cuenta de", za: "se da cuenta de", cé: "me di cuenta de", ce: "me di cuenta de" };
      return `${map[m[1].toLowerCase()] || "me doy cuenta de"} que`;
    },
    why: "Realizar means to carry something out, not to realize. For realizing, Spanish uses darse cuenta.",
    rule: "darse cuenta de que = to realize",
    examples: ["Me di cuenta de que era tarde.", "No me di cuenta."],
    alternatives: ["caer en cuenta de que (same meaning, a touch more formal)"]
  },
  {
    id: "aplicar_para",
    label: "false friend",
    test: /\baplic(o|u[ée])\s+(?:para|a)\s+((?:un|el|la)\s+\w+|trabajo|empleo|beca)\b/i,
    fix: (m) => `${m[1].toLowerCase() === "o" ? "solicito" : "solicité"} ${m[2]}`,
    why: "Aplicar means to apply a substance or a rule. For applying to a job, Spanish uses solicitar.",
    rule: "solicitar un trabajo",
    examples: ["Solicité el trabajo.", "Voy a solicitar la beca."],
    alternatives: ["postularme a (also heard, common in formal/HR contexts)"]
  },
  {
    id: "introducir_person",
    label: "false friend",
    test: /\bintroduc(ir|e|es|o)\s+a\s+((?:mi|tu|su)\s+\w+)/i,
    fix: (m) => {
      const map = { ir: "presentar", e: "presenta", es: "presentas", o: "presento" };
      return `${map[m[1].toLowerCase()]} a ${m[2]}`;
    },
    why: "Introducir means to insert. To introduce people, Spanish uses presentar.",
    rule: "presentar a alguien",
    examples: ["Te presento a mi hermana.", "Me presentó a sus papás."],
    alternatives: ["dar a conocer a (more formal, e.g. introducing a speaker)"]
  },
  {
    id: "soportar_false_friend",
    label: "false friend",
    test: /\bte\s+soporto\b/i,
    fix: () => "te apoyo",
    why: "Soportar means to put up with. To support someone, Spanish uses apoyar — 'te soporto' says you can barely tolerate them.",
    rule: "apoyar = to support · soportar = to tolerate",
    examples: ["Siempre te apoyo.", "Gracias por apoyarme."],
    alternatives: ["te banco (very colloquial — \"I've got your back\")"]
  },

  // ---------- register ----------
  {
    id: "tu_usted_mix",
    label: "mixing tú and usted",
    test: /\busted\b[^.?!]{0,30}?\b(tienes|eres|quieres|puedes)\b/i,
    fix: (m) => {
      const map = { tienes: "tiene", eres: "es", quieres: "quiere", puedes: "puede" };
      return m[0].replace(new RegExp(`\\b${m[1]}\\b`, "i"), map[m[1].toLowerCase()]);
    },
    why: "Once you've chosen usted, everything else has to stay formal — verbs and possessives included.",
    rule: "usted + tiene / es / quiere / su",
    examples: ["¿Usted tiene tiempo?", "¿Cómo está usted?", "Es su turno."]
  },

  // ---------- phrasing ----------
  {
    id: "en_dia_semana",
    label: "days take el / los",
    test: /\ben\s+(lunes|martes|mi[ée]rcoles|jueves|viernes|s[áa]bado|domingo)\b/i,
    fix: (m) => `el ${m[1]}`,
    why: "Spanish uses el or los with days of the week where English uses 'on'.",
    rule: "el lunes = on Monday · los lunes = on Mondays",
    examples: ["Nos vemos el viernes.", "Trabajo los sábados."]
  },
  {
    id: "preguntar_pregunta",
    label: "phrasing",
    test: /\bpregunt(o|as|a|ar|[ée])\s+una\s+pregunta\b/i,
    fix: (m) => (m[1].toLowerCase() === "ar" ? "hacer una pregunta" : "hago una pregunta"),
    why: "You don't 'ask a question' with preguntar in Spanish — you make one with hacer.",
    rule: "hacer una pregunta",
    examples: ["¿Te puedo hacer una pregunta?", "Hizo muchas preguntas."]
  }
];

// Runs every confident rule and returns your sentence, corrected.
export function checkSpanish(text) {
  const input = String(text || "");
  if (!input.trim()) return [];
  const hits = [];
  let corrected = input;

  for (const p of MISTAKE_PATTERNS) {
    const m = input.match(p.test);
    if (!m) continue;
    let replacement;
    try {
      replacement = p.fix(m, input);
    } catch (e) {
      continue; // a rule that can't produce a fix stays silent
    }
    if (!replacement || replacement.trim().toLowerCase() === m[0].trim().toLowerCase()) continue;

    // A fix at the start of a sentence must not lowercase it.
    if (/^[A-ZÁÉÍÓÚÑ]/.test(m[0]) && /^[a-záéíóúñ]/.test(replacement)) {
      replacement = replacement[0].toUpperCase() + replacement.slice(1);
    }
    corrected = corrected.replace(m[0], replacement);
    hits.push({
      id: p.id,
      label: p.label,
      fragment: m[0].trim(),
      suggestion: replacement.trim(),
      why: p.why,
      rule: p.rule,
      examples: p.examples || [],
      alternatives: p.alternatives || []
    });
  }

  // Every hit carries the fully corrected sentence, so the UI can show one
  // "here's your sentence, fixed" line no matter how many rules fired.
  return hits.map((h) => ({ ...h, corrected: corrected.trim() }));
}

// Kept for older callers, which only counted hits or read the explanation.
export function checkText(text) {
  return checkSpanish(text).map((h) => ({
    ...h,
    mistakeExplained: h.why,
    natural: h.corrected,
    correctVersion: h.suggestion
  }));
}
