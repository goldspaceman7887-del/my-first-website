// MEXICAN VOCABULARY ALTERNATIVES — not wrong grammar, just the word a
// Spain-Spanish textbook teaches when Mexicans actually say something else.
// Same rule shape as mistakePatterns.js ({id, label, test, fix, why, rule,
// examples}), but tagged category: "vocab" so correctionBlock() can render
// it as a usage tip rather than an error — word choice isn't a mistake,
// it's just not how it's said here.

export const VOCAB_ALTERNATIVES = [
  {
    id: "coche_vs_carro", category: "vocab", label: "word choice (Mexico)",
    test: /\b(coche)\b/i,
    fix: () => "carro",
    why: "\"Coche\" is understood but reads as Spain Spanish — Mexicans overwhelmingly say \"carro.\"",
    rule: "Mexican Spanish: carro (not coche) for car",
    examples: ["Voy a lavar el carro.", "Mi carro es rojo.", "¿Tienes carro?"]
  },
  {
    id: "ordenador_vs_computadora", category: "vocab", label: "word choice (Mexico)",
    test: /\b(ordenador)\b/i,
    fix: () => "computadora",
    why: "\"Ordenador\" is Spain Spanish. In Mexico it's \"computadora.\"",
    rule: "Mexican Spanish: computadora (not ordenador) for computer",
    examples: ["Prendí la computadora.", "Trabajo en la computadora todo el día."]
  },
  {
    id: "movil_vs_celular", category: "vocab", label: "word choice (Mexico)",
    test: /\b(m[oó]vil)\b/i,
    fix: () => "celular",
    why: "\"Móvil\" is Spain Spanish for cell phone. Mexico says \"celular.\"",
    rule: "Mexican Spanish: celular (not móvil) for cell phone",
    examples: ["Se me quedó el celular en la casa.", "¿Cuál es tu número de celular?"]
  },
  {
    id: "patatas_vs_papas", category: "vocab", label: "word choice (Mexico)",
    test: /\b(patatas?)\b/i,
    fix: (m) => (/^patatas$/i.test(m[1]) ? "papas" : "papa"),
    why: "\"Patata\" is Spain Spanish. Mexicans say \"papa.\"",
    rule: "Mexican Spanish: papa/papas (not patata) for potato",
    examples: ["Quiero papas fritas.", "Compré unas papas."]
  },
  {
    id: "zumo_vs_jugo", category: "vocab", label: "word choice (Mexico)",
    test: /\b(zumo)\b/i,
    fix: () => "jugo",
    why: "\"Zumo\" is Spain Spanish for juice. Mexico says \"jugo.\"",
    rule: "Mexican Spanish: jugo (not zumo) for juice",
    examples: ["Quiero un jugo de naranja.", "Me tomé todo el jugo."]
  },
  {
    id: "coger_avoid", category: "vocab", label: "word choice (Mexico)",
    test: /\b(cojo|coges|coge|cogemos|cogen)\b/i,
    fix: (m) => ({ cojo: "tomo/agarro", coges: "tomas/agarras", coge: "toma/agarra", cogemos: "tomamos/agarramos", cogen: "toman/agarran" }[m[1].toLowerCase()] || "agarro"),
    why: "\"Coger\" is vulgar slang in Mexico (and most of Latin America). Use \"tomar\" or \"agarrar\" instead — same meaning, no risk of raising eyebrows.",
    rule: "Avoid coger in Mexico; use tomar/agarrar",
    examples: ["Voy a tomar el camión.", "Agarra tus llaves.", "Tomé un taxi."]
  },
  {
    id: "vosotros_avoid", category: "vocab", label: "word choice (Mexico)",
    test: /\b(vosotros|vosotras|est[aá]is|ten[eé]is|sois)\b/i,
    fix: () => "ustedes",
    why: "\"Vosotros\" isn't used anywhere in Latin America — Mexicans use \"ustedes\" for every plural \"you,\" formal or not.",
    rule: "Mexico: ustedes always, never vosotros",
    examples: ["¿Ustedes quieren comer?", "¿De dónde son ustedes?"]
  },
  {
    id: "conducir_vs_manejar", category: "vocab", label: "word choice (Mexico)",
    test: /\b(conduzco|conduces|conduce|conducimos|conducen|conducir)\b/i,
    fix: (m) => ({ conduzco: "manejo", conduces: "manejas", conduce: "maneja", conducimos: "manejamos", conducen: "manejan", conducir: "manejar" }[m[1].toLowerCase()] || "manejar"),
    why: "\"Conducir\" is understood but Mexicans say \"manejar\" for driving.",
    rule: "Mexican Spanish: manejar (not conducir) for to drive",
    examples: ["No sé manejar.", "Voy a manejar hasta allá.", "Ella maneja muy bien."]
  },
  {
    id: "billete_vs_boleto", category: "vocab", label: "word choice (Mexico)",
    test: /\b(billetes?)\b/i,
    fix: (m) => (/^billetes$/i.test(m[1]) ? "boletos" : "boleto"),
    why: "\"Billete\" (ticket) is Spain Spanish. In Mexico, \"billete\" usually means paper money — for a ticket, say \"boleto.\"",
    rule: "Mexican Spanish: boleto (not billete) for ticket",
    examples: ["Compré el boleto del camión.", "¿Ya tienes tu boleto de avión?"]
  },
  {
    id: "guay_vs_padre", category: "vocab", label: "word choice (Mexico)",
    test: /\b(guay)\b/i,
    fix: () => "padre/chido",
    why: "\"Guay\" is Spain slang for \"cool.\" Mexicans say \"padre\" or \"chido\" instead.",
    rule: "Mexican Spanish: padre/chido (not guay) for cool",
    examples: ["¡Qué padre!", "Está bien chido ese lugar."]
  },
  {
    id: "tio_vs_carnal", category: "vocab", label: "word choice (Mexico)",
    test: /\b(tío|tía)\b(?!\s+(abuel|Juan|María|Pedro))/i,
    fix: () => "carnal/compa",
    why: "Using \"tío/tía\" to mean \"dude\" is Spain slang. Mexicans say \"carnal\" or \"compa\" (or \"wey\" among close friends) — \"tío/tía\" in Mexico almost always just means literal uncle/aunt.",
    rule: "Mexican Spanish: carnal/compa (not tío/tía) for \"dude\"",
    examples: ["¿Qué onda, carnal?", "Ese es mi compa."]
  },
  {
    id: "aparcar_vs_estacionar", category: "vocab", label: "word choice (Mexico)",
    test: /\b(aparco|aparcas|aparca|aparcamos|aparcan|aparcar)\b/i,
    fix: (m) => ({ aparco: "estaciono", aparcas: "estacionas", aparca: "estaciona", aparcamos: "estacionamos", aparcan: "estacionan", aparcar: "estacionar" }[m[1].toLowerCase()] || "estacionar"),
    why: "\"Aparcar\" is Spain Spanish for to park. Mexico says \"estacionar.\"",
    rule: "Mexican Spanish: estacionar (not aparcar) for to park",
    examples: ["Voy a estacionar el carro.", "¿Dónde te estacionaste?"]
  },
  {
    id: "vale_vs_va", category: "vocab", label: "word choice (Mexico)",
    test: /\b(vale)\b(?=[\s.,!?]|$)/i,
    fix: () => "va/órale/está bien",
    why: "\"Vale\" (okay) is heavily Spain Spanish. Mexicans say \"va,\" \"órale,\" or \"está bien.\"",
    rule: "Mexican Spanish: va/órale/está bien (not vale) for okay",
    examples: ["¿Vamos al cine? — Va.", "Órale, nos vemos ahí."]
  },
  {
    id: "chaval_vs_chavo", category: "vocab", label: "word choice (Mexico)",
    test: /\b(chaval|chavala)\b/i,
    fix: () => "chavo/chava",
    why: "\"Chaval/chavala\" (kid, young person) is Spain slang. Mexicans say \"chavo/chava.\"",
    rule: "Mexican Spanish: chavo/chava (not chaval/chavala) for young person",
    examples: ["Ese chavo es mi primo.", "Esa chava trabaja conmigo."]
  }
];
