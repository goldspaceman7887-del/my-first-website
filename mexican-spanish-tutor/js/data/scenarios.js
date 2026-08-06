// Real-life task scenarios for the ACTFL task-based proficiency engine.
//
// Unlike a scripted dialogue, a scenario isn't "done" when you've said any
// Spanish back — it's done when every required piece of information has
// actually been exchanged, the way it would in Mexico: drink, size,
// hot/iced, milk, sugar, payment, and whatever curveball the NPC throws in.
// core/taskEngine.js drives the turn-by-turn state machine against this
// data; core/actflAssess.js turns a finished session into an ACTFL rubric
// score. Append more scenarios here the same way roadmap.js's units grow —
// views/scenarios.js is schema-driven and picks up new entries automatically.
//
// Every `extract(text)` is regex-based NLU over free Spanish text (typed or
// dictated) — the same capture-group approach conversationThreads.js uses
// for MEMORY_RULES, just scoped per-slot instead of a flat table.

// Generic "accept whatever free text follows" extractor for optional
// free-form slots (substitutions, special requests). Only ever run when
// contextOnly gates it to the turn right after the NPC actually asked, so
// being permissive here is safe.
function extractFreeAnswer(text) {
  const t = text.trim();
  if (!t) return null;
  if (/^(no,?\s*(gracias)?|nada|ninguna?)\.?$/i.test(t)) return "ninguna";
  return t;
}

// Every scenario resolves to success, "incomplete" (abandoned — too many
// turns, most required slots still empty), or "failed" (an NPC mistake
// never repaired) — this is the shape every scenario shares; only the
// turn thresholds vary with how many slots there are to work through.
function defaultFailureStates({ abandonTurns = 14, mistakeTurns = 12 } = {}) {
  return [
    {
      id: "abandoned",
      when: (session) => session.turns > abandonTurns && session.filledRequiredCount < session.requiredSlots.length * 0.5,
      outcome: "incomplete"
    },
    {
      id: "miscommunication",
      when: (session) => session.unresolvedMistakes >= 1 && session.turns > mistakeTurns,
      outcome: "failed"
    }
  ];
}

function fullSlotCompletion(session) {
  return session.filledRequiredCount === session.requiredSlots.length && session.unresolvedMistakes === 0;
}

export const SCENARIOS = [
  {
    id: "order-coffee",
    title: "Order a Coffee",
    titleEs: "Pedir un café",
    actflTier: "novice-mid",
    npcRole: "barista",
    npcName: "Rosa",
    icon: "☕",
    setting: {
      es: "Estás en una cafetería en la Ciudad de México. La barista está lista para tomar tu orden.",
      en: "You're in a coffee shop in Mexico City. The barista is ready to take your order."
    },
    openings: [
      { es: "¡Buenas! ¿Qué te preparo?", en: "Hi! What can I get you?" },
      { es: "¿Qué va a tomar?", en: "What will you have?" },
      { es: "¿Qué se le antoja hoy?", en: "What are you in the mood for today?" },
      { es: "Hola, bienvenido. ¿Qué le sirvo?", en: "Hi, welcome. What can I serve you?" }
    ],

    slots: [
      {
        id: "drink", label: "drink type", labelEs: "tipo de bebida", required: true, type: "enum",
        values: ["americano", "café de olla", "capuchino", "latte", "espresso", "chocolate"],
        extract(text) {
          const m = text.match(/\b(americano|café de olla|cafe de olla|capuchino|latte|late|espresso|expreso|chocolate)\b/i);
          if (!m) return null;
          const w = m[1].toLowerCase();
          if (w === "late") return "latte";
          if (w === "expreso") return "espresso";
          if (w === "cafe de olla") return "café de olla";
          return w;
        },
        askPhrases: [
          { es: "¿Qué te gustaría tomar?", en: "What would you like to drink?" },
          { es: "¿Qué se le antoja — café americano, capuchino, latte...?", en: "What sounds good — americano, cappuccino, latte...?" },
          { es: "¿Va a querer un café, un capuchino, o algo más?", en: "Would you like a coffee, a cappuccino, or something else?" }
        ],
        confirmTemplate: { es: "Un {v}, va.", en: "One {v}, coming up." }
      },
      {
        id: "size", label: "size", labelEs: "tamaño", required: true, type: "enum",
        values: ["chico", "mediano", "grande"],
        extract(text) {
          const m = text.match(/\b(chic[oa]|pequeñ[oa]|peque[nñ][oa]|median[oa]|grande|extra\s?grande)\b/i);
          if (!m) return null;
          const w = m[1].toLowerCase();
          if (/^(chic|pequeñ|peque[nñ])/.test(w)) return "chico";
          if (/^median/.test(w)) return "mediano";
          return "grande";
        },
        askPhrases: [
          { es: "¿De qué tamaño lo quiere — chico, mediano o grande?", en: "What size — small, medium, or large?" },
          { es: "¿Chico, mediano o grande?", en: "Small, medium, or large?" }
        ]
      },
      {
        id: "temperature", label: "hot or iced", labelEs: "caliente o frío", required: true, type: "enum",
        values: ["caliente", "frío"],
        extract(text) {
          if (/\b(fr[ií]o|helad[oa]|con hielo|iced)\b/i.test(text)) return "frío";
          if (/\bcaliente\b/i.test(text)) return "caliente";
          return null;
        },
        askPhrases: [
          { es: "¿Lo quiere caliente o frío?", en: "Hot or iced?" },
          { es: "¿Caliente o con hielo?", en: "Hot or with ice?" }
        ]
      },
      {
        id: "milk", label: "milk type", required: false, type: "enum",
        // Only becomes eligible once `drink` is filled with a milk-relevant
        // value — this is what keeps ask ORDER non-fixed rather than
        // hardcoded to a position.
        dependsOn: { slot: "drink", when: (v) => ["capuchino", "latte", "chocolate"].includes(v) },
        values: ["leche entera", "deslactosada", "almendra", "avena", "soya", "sin leche"],
        extract(text) {
          const m = text.match(/\b(leche\s+entera|deslactosada|leche\s+de\s+almendra|almendra|leche\s+de\s+avena|avena|leche\s+de\s+soya|soya|sin\s+leche|leche\s+light)\b/i);
          if (!m) return null;
          const w = m[1].toLowerCase();
          if (w.includes("almendra")) return "almendra";
          if (w.includes("avena")) return "avena";
          if (w.includes("soya")) return "soya";
          if (w.includes("sin")) return "sin leche";
          if (w.includes("light") || w.includes("deslactosada")) return "deslactosada";
          return "leche entera";
        },
        askPhrases: [
          { es: "¿Con qué leche — entera, deslactosada, de almendra, de avena o de soya?", en: "What kind of milk — whole, lactose-free, almond, oat, or soy?" },
          { es: "¿Su leche de siempre, o alguna alternativa?", en: "Your regular milk, or a dairy-free option?" }
        ]
      },
      {
        id: "sugar", label: "sugar", labelEs: "azúcar", required: true, type: "enum",
        values: ["con azúcar", "sin azúcar", "con splenda", "con stevia", "medio azúcar"],
        extract(text) {
          if (/\bsin\s+az[uú]car\b/i.test(text)) return "sin azúcar";
          if (/\bsplenda\b/i.test(text)) return "con splenda";
          if (/\bstevia\b/i.test(text)) return "con stevia";
          if (/\bmedi[oa]\s+az[uú]car\b/i.test(text)) return "medio azúcar";
          if (/\baz[uú]car\b/i.test(text)) return "con azúcar";
          return null;
        },
        askPhrases: [
          { es: "¿Con azúcar, splenda, stevia, o sin nada?", en: "With sugar, splenda, stevia, or nothing?" },
          { es: "¿Le pongo azúcar?", en: "Should I add sugar?" }
        ]
      },
      {
        // contextOnly: a generic "accept whatever free text follows" extractor
        // is only safe to run on the turn right after the NPC actually asked
        // this — otherwise it would swallow an unrelated answer (e.g. "Tarjeta,
        // por favor.") the moment the slot becomes eligible. taskEngine.js
        // gates this via session.lastAskedSlotId.
        id: "substitution", label: "substitution", required: false, type: "free", contextOnly: true,
        askPhrases: [
          { es: "¿Alguna sustitución o algo que quiera cambiar?", en: "Any substitutions or changes?" }
        ],
        extract: extractFreeAnswer
      },
      {
        id: "specialRequest", label: "special request", required: false, type: "free", contextOnly: true,
        askPhrases: [
          { es: "¿Algo especial que deba anotar?", en: "Anything special I should note?" }
        ],
        extract: extractFreeAnswer
      },
      {
        id: "allergy", label: "allergy check", required: false, type: "boolean", contextOnly: true,
        askPhrases: [
          { es: "¿Tiene alguna alergia que deba saber?", en: "Any allergies I should know about?" }
        ],
        extract(text) {
          if (/\b(no tengo|ninguna|no)\b/i.test(text)) return false;
          if (/\balerg/i.test(text)) return true;
          return null;
        }
      },
      {
        id: "payment", label: "payment method", labelEs: "forma de pago", required: true, type: "enum",
        values: ["efectivo", "tarjeta"],
        extract(text) {
          if (/\btarjeta\b/i.test(text)) return "tarjeta";
          if (/\befectivo\b/i.test(text)) return "efectivo";
          return null;
        },
        askPhrases: [
          { es: "¿Cómo va a pagar, efectivo o tarjeta?", en: "How will you pay, cash or card?" },
          { es: "¿Efectivo o tarjeta?", en: "Cash or card?" }
        ]
      }
    ],

    // Fires when a filled slot's value is itself ambiguous.
    clarifications: [
      {
        whenSlot: "drink", when: (v) => v === "chocolate",
        es: "¿Chocolate caliente o frío?", en: "Hot or iced chocolate?", forcesSlot: "temperature"
      }
    ],

    // A weighted pool of curveballs — fired once their trigger slots are
    // filled, so no two playthroughs ask things in quite the same order.
    unexpectedFollowUps: [
      { id: "forHere", afterSlots: ["drink", "size"], es: "¿Es para aquí o para llevar?", en: "For here or to go?", weight: 1 },
      { id: "extraShot", afterSlots: ["drink"], es: "¿Le pongo un shot extra de café?", en: "Want an extra shot?", weight: 0.6 },
      { id: "outOfAlmond", afterSlots: ["milk"], es: "Se nos acabó la leche de almendra, ¿le sirve otra?", en: "We're out of almond milk, is another kind okay?", weight: 0.3, isMistakeTrigger: true, forcesSlot: "milk", onlyIf: (session) => session.slots.milk === "almendra" }
    ],

    // Deliberate NPC mistakes the learner must catch and correct — a real
    // repair-strategy test, not just comprehension.
    mistakes: [
      {
        id: "wrong-size", chance: 0.15,
        npcLine: { es: "Aquí tiene, un {drink} grande.", en: "Here you go, one large {drink}." },
        firesIf: (session) => session.slots.size && session.slots.size !== "grande",
        expectedRepair: /\bno\b.*(chico|median[oa])|(chico|median[oa]).*\bno\b|no era grande|ped[ií].*(chico|median[oa])/i,
        repairPrompt: { es: "Perdón, ¿de qué tamaño lo pidió?", en: "Sorry, what size did you order?" }
      }
    ],

    failureStates: defaultFailureStates(),
    successCondition: fullSlotCompletion,

    // How this scenario's rubric score weighs the 7 evaluation dimensions —
    // Novice/Novice-Mid scenarios lean on comprehensibility/slot-fill;
    // higher-tier scenarios weight conversation-management and
    // question-asking more heavily, per the Novice/Intermediate/Advanced
    // functional benchmarks.
    dimensionWeights: {
      comprehensibility: 0.3, vocabularyRange: 0.15, sentenceFormation: 0.15,
      repairStrategies: 0.1, conversationManagement: 0.15, questionAsking: 0.1, surpriseHandling: 0.05
    }
  },

  // ---------------------------------------------------------------------
  {
    id: "asking-directions",
    title: "Ask for Directions",
    titleEs: "Pedir direcciones",
    actflTier: "novice-mid",
    npcRole: "local",
    npcName: "Don Beto",
    icon: "🧭",
    setting: {
      es: "Estás en la calle en el centro de la Ciudad de México y necesitas llegar a algún lado.",
      en: "You're on the street in downtown Mexico City and need to get somewhere."
    },
    openings: [
      { es: "¿Se le ofrece algo? ¿Anda perdido?", en: "Can I help you? Are you lost?" },
      { es: "¿Le ayudo en algo, joven?", en: "Can I help you with something?" },
      { es: "¿Buscando algo por aquí?", en: "Looking for something around here?" }
    ],
    slots: [
      {
        id: "destination", label: "destination", labelEs: "destino", required: true, type: "enum",
        values: ["la farmacia", "el metro", "el banco", "el museo", "la catedral", "el parque"],
        extract(text) {
          const m = text.match(/\b(farmacia|metro|banco|museo|catedral|parque)\b/i);
          if (!m) return null;
          const w = m[1].toLowerCase();
          return w === "metro" || w === "banco" || w === "museo" || w === "parque" ? `el ${w}` : `la ${w}`;
        },
        askPhrases: [
          { es: "¿A dónde quiere llegar?", en: "Where are you trying to get to?" },
          { es: "¿Qué anda buscando?", en: "What are you looking for?" }
        ]
      },
      {
        id: "transportMode", label: "how you're getting there", required: false, type: "enum", contextOnly: true,
        values: ["a pie", "en camión", "en taxi"],
        askPhrases: [{ es: "¿Va a pie o en camión?", en: "Are you walking or taking the bus?" }],
        extract(text) {
          if (/\ba pie\b|\bcaminando\b/i.test(text)) return "a pie";
          if (/\bcami[oó]n\b|\bautob[uú]s\b/i.test(text)) return "en camión";
          if (/\btaxi\b/i.test(text)) return "en taxi";
          return null;
        }
      },
      {
        id: "directionAck", label: "acknowledging the directions", labelEs: "confirmar que entendiste", required: true, type: "enum",
        values: ["understood"],
        extract(text) {
          return /\b(derecha|izquierda|derecho|cuadras?|semáforo|esquina)\b/i.test(text) ? "understood" : null;
        },
        askPhrases: [
          { es: "Siga derecho dos cuadras y dé vuelta a la derecha en el semáforo.", en: "Go straight two blocks and turn right at the light." },
          { es: "Camine derecho hasta la esquina y luego a la izquierda.", en: "Walk straight to the corner and then left." }
        ]
      },
      {
        id: "distanceAck", label: "checking the distance", labelEs: "preguntar la distancia", required: true, type: "enum",
        values: ["asked"],
        extract(text) {
          return /\b(cuadras?|lejos|cerca|minutos?)\b/i.test(text) ? "asked" : null;
        },
        askPhrases: [{ es: "¿Le queda claro, o está muy lejos para usted?", en: "Is that clear, or is it too far?" }]
      },
      {
        id: "thanks", label: "thanking the local", labelEs: "dar las gracias", required: true, type: "enum",
        values: ["thanked"],
        extract(text) {
          return /\bgracias\b/i.test(text) ? "thanked" : null;
        },
        askPhrases: [{ es: "¿Le quedó claro el camino?", en: "Is the route clear to you?" }]
      }
    ],
    unexpectedFollowUps: [
      { id: "transportAsk", afterSlots: ["destination"], es: "¿Va a pie o prefiere tomar un camión?", en: "Are you walking, or would you rather take a bus?", weight: 0.7, forcesSlot: "transportMode" },
      { id: "watchOut", afterSlots: ["directionAck"], es: "Aguas con el tráfico al cruzar, ¿eh?", en: "Watch out for traffic crossing, okay?", weight: 0.5 },
      { id: "landmark", afterSlots: ["directionAck"], es: "Va a ver una tiendita en la esquina — ahí es.", en: "You'll see a little shop on the corner — that's the spot.", weight: 0.5 }
    ],
    mistakes: [
      {
        id: "wrong-turn", chance: 0.2,
        npcLine: { es: "Ah, disculpe, me equivoqué — es a la izquierda, no a la derecha.", en: "Oh, sorry, I got that wrong — it's a left, not a right." },
        firesIf: (session) => session.slots.directionAck === "understood",
        expectedRepair: /\b(ok|okay|está bien|entendido|de acuerdo|izquierda)\b/i,
        repairPrompt: { es: "¿Me entendió? Es a la izquierda.", en: "Did you get that? It's to the left." }
      }
    ],
    failureStates: defaultFailureStates({ abandonTurns: 13, mistakeTurns: 11 }),
    successCondition: fullSlotCompletion,
    dimensionWeights: {
      comprehensibility: 0.35, vocabularyRange: 0.15, sentenceFormation: 0.15,
      repairStrategies: 0.1, conversationManagement: 0.1, questionAsking: 0.1, surpriseHandling: 0.05
    }
  },

  // ---------------------------------------------------------------------
  {
    id: "restaurant",
    title: "Order at a Restaurant",
    titleEs: "Pedir en un restaurante",
    actflTier: "novice-high",
    npcRole: "mesero",
    npcName: "Chuy",
    icon: "🌮",
    setting: {
      es: "Estás en un restaurante mexicano y el mesero viene a tomar tu orden.",
      en: "You're at a Mexican restaurant and the waiter comes to take your order."
    },
    openings: [
      { es: "Buenas, ¿ya saben qué van a ordenar?", en: "Good afternoon, do you know what you'd like to order?" },
      { es: "¿Le tomo su orden?", en: "May I take your order?" },
      { es: "¿Qué le sirvo hoy?", en: "What can I get you today?" }
    ],
    slots: [
      {
        id: "dish", label: "dish", labelEs: "platillo", required: true, type: "enum",
        values: ["tacos", "enchiladas", "pozole", "quesadillas", "mole", "chiles rellenos"],
        extract(text) {
          const m = text.match(/\b(tacos|enchiladas|pozole|quesadillas|mole|chiles rellenos)\b/i);
          return m ? m[1].toLowerCase() : null;
        },
        askPhrases: [
          { es: "¿Qué se le antoja — tacos, enchiladas, pozole?", en: "What sounds good — tacos, enchiladas, pozole?" },
          { es: "¿Qué va a querer de plato fuerte?", en: "What would you like for a main dish?" }
        ]
      },
      {
        id: "spiceLevel", label: "spice level", labelEs: "nivel de picante", required: true, type: "enum",
        values: ["picante", "no muy picante", "sin picante"],
        extract(text) {
          if (/\bsin (picante|picoso)\b|\bnada picante\b/i.test(text)) return "sin picante";
          if (/\bno muy picante|poco picante|poquito picante\b/i.test(text)) return "no muy picante";
          if (/\bpicante|picoso\b/i.test(text)) return "picante";
          return null;
        },
        askPhrases: [{ es: "¿Lo quiere picante, o mejor no muy picante?", en: "Do you want it spicy, or not too spicy?" }]
      },
      {
        id: "drink", label: "drink", labelEs: "bebida", required: true, type: "enum",
        values: ["agua de jamaica", "agua de horchata", "refresco", "cerveza", "agua natural"],
        extract(text) {
          const m = text.match(/\b(agua de jamaica|jamaica|agua de horchata|horchata|refresco|cerveza|agua natural)\b/i);
          if (!m) return null;
          const w = m[1].toLowerCase();
          if (w === "jamaica") return "agua de jamaica";
          if (w === "horchata") return "agua de horchata";
          return w;
        },
        askPhrases: [{ es: "¿Qué le traigo de tomar — agua de jamaica, horchata, refresco?", en: "What can I bring you to drink — jamaica water, horchata, soda?" }]
      },
      {
        id: "billSplit", label: "how to split the bill", labelEs: "cómo dividir la cuenta", required: true, type: "enum",
        values: ["junta", "separada"],
        extract(text) {
          if (/\bsepar/i.test(text)) return "separada";
          if (/\bjunt/i.test(text)) return "junta";
          return null;
        },
        askPhrases: [{ es: "¿La cuenta junta o separada?", en: "One bill or separate checks?" }]
      },
      {
        id: "extra", label: "extra request", required: false, type: "free", contextOnly: true,
        askPhrases: [{ es: "¿Le traigo algo más — guacamole, tortillas extra?", en: "Can I bring you anything else — guacamole, extra tortillas?" }],
        extract: extractFreeAnswer
      },
      {
        id: "allergy", label: "allergy check", required: false, type: "boolean", contextOnly: true,
        askPhrases: [{ es: "¿Alguna alergia que deba decirle a la cocina?", en: "Any allergies I should tell the kitchen about?" }],
        extract(text) {
          if (/\b(no tengo|ninguna|no)\b/i.test(text)) return false;
          if (/\balerg/i.test(text)) return true;
          return null;
        }
      }
    ],
    unexpectedFollowUps: [
      { id: "appetizer", afterSlots: ["dish"], es: "¿Algo para picar mientras le traigo el plato fuerte?", en: "Anything to snack on while I bring your main dish?", weight: 0.5 },
      { id: "moreTortillas", afterSlots: ["dish"], es: "¿Le traigo tortillas de maíz o de harina?", en: "Corn or flour tortillas?", weight: 0.6 }
    ],
    mistakes: [
      {
        id: "out-of-dish", chance: 0.2,
        npcLine: { es: "Se nos acabaron los {dish} — ¿le sirvo otra cosa?", en: "We're out of {dish} — can I get you something else?" },
        firesIf: (session) => !!session.slots.dish,
        forcesSlot: "dish",
        expectedRepair: /\b(tacos|enchiladas|pozole|quesadillas|mole|chiles rellenos)\b/i,
        repairPrompt: { es: "¿Qué le sirvo entonces?", en: "What can I get you instead, then?" }
      }
    ],
    failureStates: defaultFailureStates({ abandonTurns: 15, mistakeTurns: 13 }),
    successCondition: fullSlotCompletion,
    dimensionWeights: {
      comprehensibility: 0.3, vocabularyRange: 0.15, sentenceFormation: 0.15,
      repairStrategies: 0.1, conversationManagement: 0.15, questionAsking: 0.1, surpriseHandling: 0.05
    }
  },

  // ---------------------------------------------------------------------
  {
    id: "hotel-check-in",
    title: "Check Into a Hotel",
    titleEs: "Registrarse en un hotel",
    actflTier: "intermediate-low",
    npcRole: "recepcionista",
    npcName: "Lupita",
    icon: "🏨",
    setting: {
      es: "Llegas a un hotel en Guadalajara para hacer el check-in.",
      en: "You've arrived at a hotel in Guadalajara to check in."
    },
    openings: [
      { es: "Buenas noches, bienvenido. ¿Tiene una reservación?", en: "Good evening, welcome. Do you have a reservation?" },
      { es: "Hola, ¿en qué le puedo ayudar?", en: "Hi, how can I help you?" }
    ],
    slots: [
      {
        id: "reservationConfirmed", label: "whether you have a reservation", labelEs: "si tienes reservación", required: true, type: "boolean",
        extract(text) {
          if (/\b(sí|si tengo|tengo una reservaci[oó]n|reservé)\b/i.test(text)) return true;
          if (/\bno tengo|no hice|sin reservaci[oó]n\b/i.test(text)) return false;
          return null;
        },
        askPhrases: [{ es: "¿Tiene una reservación con nosotros?", en: "Do you have a reservation with us?" }]
      },
      {
        id: "reservationName", label: "the name on the reservation", labelEs: "el nombre de la reservación", required: true, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "¿A nombre de quién está la reservación?", en: "What name is the reservation under?" }]
      },
      {
        id: "nights", label: "how many nights", labelEs: "cuántas noches", required: true, type: "enum",
        values: ["una noche", "dos noches", "tres noches", "cuatro noches"],
        extract(text) {
          const m = text.match(/\b(una|dos|tres|cuatro|cinco)\s+noches?\b/i);
          if (!m) return null;
          const n = m[1].toLowerCase();
          return n === "una" ? "una noche" : `${n} noches`;
        },
        askPhrases: [{ es: "¿Cuántas noches se va a quedar?", en: "How many nights will you be staying?" }]
      },
      {
        id: "roomType", label: "room type", labelEs: "tipo de habitación", required: true, type: "enum",
        values: ["individual", "doble", "matrimonial", "suite"],
        extract(text) {
          const m = text.match(/\b(individual|doble|matrimonial|suite)\b/i);
          return m ? m[1].toLowerCase() : null;
        },
        askPhrases: [{ es: "¿Prefiere habitación individual, doble o matrimonial?", en: "Do you prefer a single, double, or matrimonial room?" }]
      },
      {
        id: "idDocument", label: "handing over ID", labelEs: "entregar identificación", required: true, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "¿Me puede dar una identificación, por favor?", en: "Could I get an ID from you, please?" }]
      },
      {
        id: "paymentMethod", label: "payment method", labelEs: "forma de pago", required: true, type: "enum",
        values: ["efectivo", "tarjeta"],
        extract(text) {
          if (/\btarjeta\b/i.test(text)) return "tarjeta";
          if (/\befectivo\b/i.test(text)) return "efectivo";
          return null;
        },
        askPhrases: [{ es: "¿Cómo va a cubrir el depósito, efectivo o tarjeta?", en: "How will you cover the deposit, cash or card?" }]
      }
    ],
    unexpectedFollowUps: [
      { id: "checkoutTime", afterSlots: ["roomType"], es: "El checkout es a las doce, ¿le parece bien?", en: "Checkout is at noon, is that okay?", weight: 0.6 },
      { id: "wifi", afterSlots: ["roomType"], es: "La contraseña del wifi se la doy con la llave.", en: "I'll give you the wifi password with your key.", weight: 0.4 }
    ],
    mistakes: [
      {
        id: "reservation-not-found", chance: 0.25,
        npcLine: { es: "Qué raro, no encuentro su reservación a nombre de {reservationName}.", en: "Strange, I can't find your reservation under {reservationName}." },
        firesIf: (session) => session.slots.reservationConfirmed === true && !!session.slots.reservationName,
        expectedRepair: /\b(confirmaci[oó]n|reserv[eé]|correo|c[oó]digo|number|número)\b/i,
        repairPrompt: { es: "¿Tiene un número de confirmación o el correo de la reservación?", en: "Do you have a confirmation number or the reservation email?" }
      }
    ],
    failureStates: defaultFailureStates({ abandonTurns: 15, mistakeTurns: 13 }),
    successCondition: fullSlotCompletion,
    dimensionWeights: {
      comprehensibility: 0.2, vocabularyRange: 0.15, sentenceFormation: 0.15,
      repairStrategies: 0.15, conversationManagement: 0.2, questionAsking: 0.1, surpriseHandling: 0.05
    }
  },

  // ---------------------------------------------------------------------
  {
    id: "calling-a-doctor",
    title: "Call a Doctor's Office",
    titleEs: "Llamar al consultorio del doctor",
    actflTier: "intermediate-mid",
    npcRole: "recepcionista de la clínica",
    npcName: "Sra. Ramírez",
    icon: "🩺",
    setting: {
      es: "Llamas a una clínica porque no te sientes bien y necesitas una cita.",
      en: "You're calling a clinic because you're not feeling well and need an appointment."
    },
    openings: [
      { es: "Clínica San Rafael, buenos días, ¿en qué le puedo ayudar?", en: "San Rafael Clinic, good morning, how can I help you?" },
      { es: "Consultorio del Doctor López, ¿qué se le ofrece?", en: "Doctor López's office, what do you need?" }
    ],
    slots: [
      {
        id: "reasonForCall", label: "reason for calling", labelEs: "motivo de la llamada", required: true, type: "enum",
        values: ["fiebre", "dolor de cabeza", "dolor de estómago", "tos", "gripe", "mareo", "dolor de garganta"],
        extract(text) {
          const m = text.match(/\b(fiebre|dolor de cabeza|dolor de est[oó]mago|tos|grip[ea]|mareo|dolor de garganta|n[aá]useas?|vomit\w*)\b/i);
          if (!m) return null;
          const w = m[1].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
          if (w.includes("fiebre")) return "fiebre";
          if (w.includes("cabeza")) return "dolor de cabeza";
          if (w.includes("estomago")) return "dolor de estómago";
          if (w.startsWith("tos")) return "tos";
          if (w.startsWith("grip")) return "gripe";
          if (w.startsWith("mareo")) return "mareo";
          if (w.includes("garganta")) return "dolor de garganta";
          return "fiebre";
        },
        askPhrases: [{ es: "¿Qué síntomas tiene?", en: "What symptoms do you have?" }]
      },
      {
        id: "patientName", label: "patient's name", labelEs: "nombre del paciente", required: true, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "¿A nombre de quién hago la cita?", en: "Who should I make the appointment for?" }]
      },
      {
        id: "insuranceOrPrivate", label: "insurance or private pay", labelEs: "seguro o particular", required: true, type: "enum",
        values: ["seguro", "particular"],
        extract(text) {
          if (/\bseguro\b/i.test(text)) return "seguro";
          if (/\bparticular\b/i.test(text)) return "particular";
          return null;
        },
        askPhrases: [{ es: "¿Va a venir con seguro o de manera particular?", en: "Will you be coming with insurance or paying privately?" }]
      },
      {
        id: "preferredDay", label: "preferred day", labelEs: "día preferido", required: true, type: "enum",
        values: ["hoy", "mañana", "lunes", "martes", "miércoles", "jueves", "viernes"],
        extract(text) {
          const m = text.match(/\b(hoy|mañana|lunes|martes|mi[eé]rcoles|jueves|viernes)\b/i);
          return m ? m[1].toLowerCase() : null;
        },
        askPhrases: [{ es: "¿Qué día le gustaría venir?", en: "What day would you like to come in?" }]
      },
      {
        id: "preferredTime", label: "preferred time of day", labelEs: "hora preferida", required: true, type: "enum",
        values: ["mañana", "tarde"],
        extract(text) {
          if (/\bpor la mañana|en la mañana|temprano\b/i.test(text)) return "mañana";
          if (/\bpor la tarde|en la tarde\b/i.test(text)) return "tarde";
          return null;
        },
        askPhrases: [{ es: "¿Prefiere en la mañana o en la tarde?", en: "Do you prefer morning or afternoon?" }]
      },
      {
        id: "phoneNumber", label: "callback number", required: false, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "¿Me deja un número donde le podamos llamar?", en: "Could you leave a number where we can reach you?" }]
      }
    ],
    unexpectedFollowUps: [
      { id: "priorPatient", afterSlots: ["patientName"], es: "¿Ya lo ha atendido el doctor antes?", en: "Has the doctor seen you before?", weight: 0.5 },
      { id: "medAllergy", afterSlots: ["reasonForCall"], es: "¿Es alérgico a algún medicamento?", en: "Are you allergic to any medication?", weight: 0.5 }
    ],
    mistakes: [
      {
        id: "no-availability", chance: 0.25,
        npcLine: { es: "Ese día no tenemos espacio, ¿le sirve otro día?", en: "We don't have space that day, would another day work?" },
        firesIf: (session) => !!session.slots.preferredDay,
        forcesSlot: "preferredDay",
        expectedRepair: /\b(hoy|mañana|lunes|martes|mi[eé]rcoles|jueves|viernes)\b/i,
        repairPrompt: { es: "¿Qué otro día le funciona?", en: "What other day works for you?" }
      }
    ],
    failureStates: defaultFailureStates({ abandonTurns: 15, mistakeTurns: 13 }),
    successCondition: fullSlotCompletion,
    dimensionWeights: {
      comprehensibility: 0.2, vocabularyRange: 0.15, sentenceFormation: 0.15,
      repairStrategies: 0.15, conversationManagement: 0.2, questionAsking: 0.1, surpriseHandling: 0.05
    }
  },

  // ---------------------------------------------------------------------
  {
    id: "job-interview",
    title: "Job Interview",
    titleEs: "Entrevista de trabajo",
    actflTier: "advanced-low",
    npcRole: "entrevistador",
    npcName: "Lic. Herrera",
    icon: "💼",
    setting: {
      es: "Estás en una entrevista de trabajo para un puesto de asistente de oficina.",
      en: "You're in a job interview for an office assistant position."
    },
    openings: [
      { es: "Buenos días, gracias por venir. Platíqueme un poco de usted.", en: "Good morning, thanks for coming. Tell me a bit about yourself." },
      { es: "Adelante, tome asiento. ¿Por qué le interesa este puesto?", en: "Go ahead, have a seat. Why are you interested in this position?" }
    ],
    slots: [
      {
        id: "selfIntro", label: "self-introduction", labelEs: "presentarte", required: true, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "Platíqueme un poco de usted.", en: "Tell me a bit about yourself." }]
      },
      {
        id: "experience", label: "past experience", labelEs: "experiencia laboral", required: true, type: "enum",
        values: ["experience-shown"],
        extract(text) {
          return /\b(trabaj[eéc]|estudi[eé]|tengo experiencia|he trabajado|fui|laboré)\w*/i.test(text) ? "experience-shown" : null;
        },
        askPhrases: [{ es: "Cuénteme de su experiencia anterior — ¿dónde ha trabajado?", en: "Tell me about your prior experience — where have you worked?" }]
      },
      {
        id: "motivation", label: "why this job", labelEs: "por qué te interesa el puesto", required: true, type: "enum",
        values: ["motivation-shown"],
        extract(text) {
          return /\b(me interesa|me gustar[ií]a|porque|me llama la atenci[oó]n|busco)\b/i.test(text) ? "motivation-shown" : null;
        },
        askPhrases: [{ es: "¿Por qué le interesa este puesto en particular?", en: "Why are you interested in this position specifically?" }]
      },
      {
        id: "availability", label: "availability", labelEs: "disponibilidad", required: true, type: "enum",
        values: ["tiempo completo", "medio tiempo", "días específicos"],
        extract(text) {
          if (/\btiempo completo\b/i.test(text)) return "tiempo completo";
          if (/\bmedio tiempo\b/i.test(text)) return "medio tiempo";
          if (/\b(lunes|martes|mi[eé]rcoles|jueves|viernes|fines? de semana)\b/i.test(text)) return "días específicos";
          return null;
        },
        askPhrases: [{ es: "¿Qué disponibilidad tiene — tiempo completo, medio tiempo?", en: "What's your availability — full time, part time?" }]
      },
      {
        id: "salaryExpectation", label: "salary expectation", required: false, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "¿Qué expectativa salarial tiene?", en: "What are your salary expectations?" }]
      }
    ],
    unexpectedFollowUps: [
      { id: "narrateChallenge", afterSlots: ["experience"], es: "Cuénteme de un reto que enfrentó en un trabajo anterior y cómo lo resolvió.", en: "Tell me about a challenge you faced at a previous job and how you resolved it.", weight: 0.7 },
      { id: "fiveYears", afterSlots: ["motivation"], es: "¿Dónde se ve usted en cinco años?", en: "Where do you see yourself in five years?", weight: 0.5 },
      { id: "askBack", afterSlots: ["availability"], es: "¿Tiene alguna pregunta para mí?", en: "Do you have any questions for me?", weight: 0.8 }
    ],
    mistakes: [
      {
        id: "misheard-duration", chance: 0.2,
        npcLine: { es: "Perdón, ¿dijo que trabajó ahí tres meses o tres años?", en: "Sorry, did you say you worked there three months or three years?" },
        firesIf: (session) => session.slots.experience === "experience-shown",
        expectedRepair: /\b(mes|meses|año|años|quise decir|me refería|dije)\b/i,
        repairPrompt: { es: "Disculpe, ¿me lo puede aclarar?", en: "Sorry, could you clarify that for me?" }
      }
    ],
    failureStates: defaultFailureStates({ abandonTurns: 14, mistakeTurns: 12 }),
    successCondition: fullSlotCompletion,
    dimensionWeights: {
      comprehensibility: 0.1, vocabularyRange: 0.15, sentenceFormation: 0.15,
      repairStrategies: 0.15, conversationManagement: 0.2, questionAsking: 0.15, surpriseHandling: 0.1
    }
  }
];

export function scenarioById(id) {
  return SCENARIOS.find((s) => s.id === id);
}

export function scenariosForTier(tier) {
  return SCENARIOS.filter((s) => s.actflTier === tier);
}
