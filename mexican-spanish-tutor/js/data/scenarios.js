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
    // Used only by Daily Life Mode (views/dailyLife.js) as this scenario's
    // Morning segment — light continuity based on how the previous segment
    // went, never referenced by the standalone scenario picker.
    moodOpenings: {
      good: [{ es: "¡Buenos días! Se ve que va a ser un gran día, ¿qué le preparo?", en: "Good morning! Looks like it's going to be a great day, what can I get you?" }],
      rough: [{ es: "Buenos días... ¿todo bien? ¿Qué le preparo?", en: "Good morning... everything okay? What can I get you?" }]
    },

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
    // Daily Life Mode's Lunch segment, following Work.
    moodOpenings: {
      good: [{ es: "¡Buenas! Se ve que tuvo una mañana productiva. ¿Ya sabe qué va a ordenar?", en: "Hi! Looks like you had a productive morning. Do you know what you'd like to order?" }],
      rough: [{ es: "Buenas... ¿mañana pesada? A ver si esto lo anima. ¿Ya sabe qué va a ordenar?", en: "Hi... rough morning? Let's see if this cheers you up. Do you know what you'd like to order?" }]
    },
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
  },

  // ---------------------------------------------------------------------
  {
    id: "taking-the-metro",
    title: "Taking the Metro",
    titleEs: "Tomar el metro",
    actflTier: "novice-mid",
    npcRole: "empleado del metro",
    npcName: "Sr. Ortiz",
    icon: "🚇",
    setting: {
      es: "Estás en una estación del metro en la Ciudad de México y necesitas comprar tu boleto e ir al andén correcto.",
      en: "You're at a metro station in Mexico City and need to buy your ticket and get to the right platform."
    },
    openings: [
      { es: "Buenas, ¿a dónde va?", en: "Hi, where are you headed?" },
      { es: "¿Le ayudo con su viaje?", en: "Can I help you with your trip?" },
      { es: "¿Qué necesita?", en: "What do you need?" }
    ],
    // Daily Life Mode's Commute segment, following Morning.
    moodOpenings: {
      good: [{ es: "¡Buenas! Con esa energía se nota que le fue bien en el desayuno. ¿A dónde va?", en: "Hey! You look like breakfast went well. Where are you headed?" }],
      rough: [{ es: "¿Todo bien? Se le ve algo apurado. ¿A dónde va?", en: "Everything okay? You look a bit rushed. Where are you headed?" }]
    },
    slots: [
      {
        id: "destination", label: "destination station", labelEs: "estación destino", required: true, type: "enum",
        values: ["el zócalo", "chapultepec", "insurgentes", "bellas artes", "coyoacán", "polanco"],
        extract(text) {
          const m = text.match(/\b(z[oó]calo|chapultepec|insurgentes|bellas artes|coyoac[aá]n|polanco)\b/i);
          if (!m) return null;
          const w = m[1].toLowerCase();
          if (/^z[oó]calo$/.test(w)) return "el zócalo";
          if (w.startsWith("coyoac")) return "coyoacán";
          return w;
        },
        askPhrases: [
          { es: "¿A dónde va?", en: "Where are you headed?" },
          { es: "¿Qué estación necesita?", en: "What station do you need?" }
        ]
      },
      {
        id: "platformAck", label: "acknowledging the platform/line", labelEs: "confirmar el andén", required: true, type: "enum",
        values: ["understood"],
        extract(text) {
          return /\b(and[eé]n|l[ií]nea|transbordo|direcci[oó]n)\b/i.test(text) ? "understood" : null;
        },
        askPhrases: [
          { es: "Vaya al andén de la Línea 2, dirección Cuatro Caminos.", en: "Go to the Line 2 platform, direction Cuatro Caminos." },
          { es: "Tome la Línea 3 y haga transbordo en Balderas.", en: "Take Line 3 and transfer at Balderas." }
        ]
      },
      {
        id: "tripAmount", label: "how many trips to load", labelEs: "cuántos viajes cargar", required: true, type: "enum",
        values: ["un viaje", "cinco viajes", "diez viajes", "veinte viajes"],
        extract(text) {
          const m = text.match(/\b(un|cinco|diez|veinte)\s+viajes?\b/i);
          if (!m) return null;
          const w = m[1].toLowerCase();
          return w === "un" ? "un viaje" : `${w} viajes`;
        },
        askPhrases: [{ es: "¿Cuántos viajes quiere cargar?", en: "How many trips would you like to load?" }]
      },
      {
        id: "paymentMethod", label: "payment method", labelEs: "forma de pago", required: true, type: "enum",
        values: ["efectivo", "tarjeta bancaria"],
        extract(text) {
          if (/\btarjeta\b/i.test(text)) return "tarjeta bancaria";
          if (/\befectivo\b/i.test(text)) return "efectivo";
          return null;
        },
        askPhrases: [{ es: "¿Cómo va a pagar, efectivo o tarjeta?", en: "How will you pay, cash or card?" }]
      },
      {
        id: "thanks", label: "thanking the employee", labelEs: "dar las gracias", required: true, type: "enum",
        values: ["thanked"],
        extract(text) {
          return /\bgracias\b/i.test(text) ? "thanked" : null;
        },
        askPhrases: [{ es: "¿Le quedó claro cómo llegar?", en: "Is it clear how to get there?" }]
      }
    ],
    comboAsks: [
      { slots: ["tripAmount", "paymentMethod"], askPhrases: [{ es: "¿Cuántos viajes quiere y cómo va a pagar?", en: "How many trips do you want and how will you pay?" }] }
    ],
    unexpectedFollowUps: [
      { id: "rushHour", afterSlots: ["destination"], es: "Aguas, va a ir bien lleno a esta hora.", en: "Watch out, it's going to be packed at this hour.", weight: 0.5 },
      { id: "transferNeeded", afterSlots: ["platformAck"], es: "Recuerde bajarse en la siguiente para hacer transbordo.", en: "Remember to get off at the next stop to transfer.", weight: 0.4, fast: true }
    ],
    mistakes: [
      {
        id: "wrong-platform", chance: 0.2,
        npcLine: { es: "Ah espere, ese andén no es — es del otro lado.", en: "Oh wait, that's not the platform — it's on the other side." },
        firesIf: (session) => session.slots.platformAck === "understood",
        expectedRepair: /entendido|est[aá] bien|del otro lado|ok|gracias/i,
        repairPrompt: { es: "¿Me escuchó? Es del otro lado.", en: "Did you hear me? It's on the other side." }
      }
    ],
    failureStates: defaultFailureStates(),
    successCondition: fullSlotCompletion,
    dimensionWeights: {
      comprehensibility: 0.35, vocabularyRange: 0.15, sentenceFormation: 0.15,
      repairStrategies: 0.1, conversationManagement: 0.1, questionAsking: 0.1, surpriseHandling: 0.05
    }
  },

  // ---------------------------------------------------------------------
  {
    id: "clothing-store",
    title: "Shop for Clothes",
    titleEs: "Comprar ropa",
    actflTier: "novice-high",
    npcRole: "vendedora",
    npcName: "Sra. Nayeli",
    icon: "👕",
    setting: {
      es: "Estás en una tienda de ropa buscando algo para comprar.",
      en: "You're in a clothing store looking for something to buy."
    },
    openings: [
      { es: "Hola, bienvenido. ¿Busca algo en especial?", en: "Hi, welcome. Are you looking for something specific?" },
      { es: "¿Le ayudo a encontrar algo?", en: "Can I help you find something?" }
    ],
    slots: [
      {
        id: "itemType", label: "item type", labelEs: "prenda", required: true, type: "enum",
        values: ["una camisa", "un pantalón", "un vestido", "una chamarra", "unos zapatos"],
        extract(text) {
          const m = text.match(/\b(camisa|pantal[oó]n|vestido|chamarra|zapatos)\b/i);
          if (!m) return null;
          const w = m[1].toLowerCase();
          if (w.startsWith("camisa")) return "una camisa";
          if (w.startsWith("pantal")) return "un pantalón";
          if (w === "vestido") return "un vestido";
          if (w === "chamarra") return "una chamarra";
          return "unos zapatos";
        },
        askPhrases: [{ es: "¿Qué anda buscando?", en: "What are you looking for?" }]
      },
      {
        id: "size", label: "size", labelEs: "talla", required: true, type: "enum",
        values: ["chica", "mediana", "grande", "extra grande"],
        extract(text) {
          const m = text.match(/\b(chic[oa]|median[oa]|grande|extra\s?grande)\b/i);
          if (!m) return null;
          const w = m[1].toLowerCase();
          if (/^extra/.test(text.toLowerCase()) || w === "extra grande") return "extra grande";
          if (w.startsWith("chic")) return "chica";
          if (w.startsWith("median")) return "mediana";
          return "grande";
        },
        askPhrases: [{ es: "¿Qué talla usa?", en: "What size do you wear?" }]
      },
      {
        id: "color", label: "color", required: true, type: "enum",
        values: ["negro", "azul", "blanco", "rojo", "gris"],
        extract(text) {
          const m = text.match(/\b(negro|azul|blanco|rojo|gris)\b/i);
          return m ? m[1].toLowerCase() : null;
        },
        askPhrases: [{ es: "¿De qué color lo quiere?", en: "What color would you like?" }]
      },
      {
        id: "tryOn", label: "whether to try it on", labelEs: "si te lo pruebas", required: true, type: "boolean",
        extract(text) {
          if (/\b(claro|por favor|quiero probarlo)\b/i.test(text)) return true;
          if (/\bno,?\s*gracias\b|no hace falta\b/i.test(text)) return false;
          return null;
        },
        askPhrases: [{ es: "¿Se lo quiere probar?", en: "Would you like to try it on?" }]
      },
      {
        id: "paymentMethod", label: "payment method", labelEs: "forma de pago", required: true, type: "enum",
        values: ["efectivo", "tarjeta"],
        extract(text) {
          if (/\btarjeta\b/i.test(text)) return "tarjeta";
          if (/\befectivo\b/i.test(text)) return "efectivo";
          return null;
        },
        askPhrases: [{ es: "¿Cómo va a pagar, efectivo o tarjeta?", en: "How will you pay, cash or card?" }]
      }
    ],
    comboAsks: [
      { slots: ["size", "color"], askPhrases: [{ es: "¿Qué talla y de qué color lo busca?", en: "What size and what color are you looking for?" }] }
    ],
    unexpectedFollowUps: [
      { id: "discount", afterSlots: ["itemType"], es: "Ah, ese anda en oferta, treinta por ciento de descuento.", en: "Oh, that one's on sale, 30 percent off.", weight: 0.4 },
      { id: "matchingItem", afterSlots: ["color"], es: "Tenemos algo que combina, ¿le muestro?", en: "We have something that matches, want me to show you?", weight: 0.4 }
    ],
    mistakes: [
      {
        id: "out-of-size", chance: 0.2,
        npcLine: { es: "Uy, se nos acabó esa talla — ¿le sirve otra?", en: "Oh, we're out of that size — would another one work?" },
        firesIf: (session) => !!session.slots.size,
        forcesSlot: "size",
        expectedRepair: /\b(chica|median[oa]|grande|extra grande)\b/i,
        repairPrompt: { es: "¿Qué otra talla le sirve?", en: "What other size works for you?" }
      }
    ],
    failureStates: defaultFailureStates(),
    successCondition: fullSlotCompletion,
    dimensionWeights: {
      comprehensibility: 0.3, vocabularyRange: 0.15, sentenceFormation: 0.15,
      repairStrategies: 0.1, conversationManagement: 0.15, questionAsking: 0.1, surpriseHandling: 0.05
    }
  },

  // ---------------------------------------------------------------------
  {
    id: "making-friends-party",
    title: "Meeting People at a Party",
    titleEs: "Conocer gente en una fiesta",
    actflTier: "novice-high",
    npcRole: "invitado",
    npcName: "Vale",
    icon: "🎉",
    setting: {
      es: "Estás en una fiesta y conoces a alguien nuevo.",
      en: "You're at a party and meet someone new."
    },
    openings: [
      { es: "¡Hola! No te había visto antes, ¿verdad? Soy Vale.", en: "Hi! I haven't seen you before, right? I'm Vale." },
      { es: "¿Qué onda? ¿De dónde conoces al que organiza la fiesta?", en: "Hey! How do you know the host?" }
    ],
    // Daily Life Mode's Evening segment, following Afternoon.
    moodOpenings: {
      good: [{ es: "¡Hola! Se te ve contento hoy. Soy Vale, ¿cómo te llamas?", en: "Hi! You seem happy today. I'm Vale, what's your name?" }],
      rough: [{ es: "¡Hola! ¿Cansado? Ven, relájate. Soy Vale, ¿cómo te llamas?", en: "Hi! Tired? Come on, relax. I'm Vale, what's your name?" }]
    },
    slots: [
      {
        id: "selfName", label: "your name", labelEs: "tu nombre", required: true, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "¿Cómo te llamas?", en: "What's your name?" }]
      },
      {
        id: "howKnowHost", label: "how you know the host", labelEs: "cómo conoces al anfitrión", required: true, type: "enum",
        values: ["amigo del trabajo", "compañero de escuela", "vecino", "familiar"],
        extract(text) {
          if (/\btrabajo\b/i.test(text)) return "amigo del trabajo";
          if (/\bescuela\b/i.test(text)) return "compañero de escuela";
          if (/\bvecin[oa]\b/i.test(text)) return "vecino";
          if (/\bfamili/i.test(text)) return "familiar";
          return null;
        },
        askPhrases: [{ es: "¿De dónde conoces al anfitrión?", en: "How do you know the host?" }]
      },
      {
        id: "whatYouDo", label: "what you do", labelEs: "a qué te dedicas", required: true, type: "enum",
        values: ["trabajo", "estudio"],
        extract(text) {
          if (/\bestudio\b/i.test(text)) return "estudio";
          if (/\btrabajo\b/i.test(text)) return "trabajo";
          return null;
        },
        askPhrases: [{ es: "¿A qué te dedicas?", en: "What do you do?" }]
      },
      {
        id: "hobby", label: "a hobby", labelEs: "un pasatiempo", required: true, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "¿Qué te gusta hacer en tu tiempo libre?", en: "What do you like to do in your free time?" }]
      },
      {
        id: "exchangeContact", label: "whether to exchange contact info", labelEs: "si intercambian número", required: true, type: "boolean",
        extract(text) {
          if (/\b(claro|va|dale|por supuesto)\b/i.test(text)) return true;
          if (/\bno,?\s*gracias\b|mejor no\b/i.test(text)) return false;
          return null;
        },
        askPhrases: [{ es: "Oye, ¿nos damos número para seguir platicando?", en: "Hey, should we exchange numbers to keep chatting?" }]
      }
    ],
    comboAsks: [
      { slots: ["howKnowHost", "whatYouDo"], askPhrases: [{ es: "¿De dónde conoces al anfitrión y a qué te dedicas?", en: "How do you know the host and what do you do?" }] }
    ],
    unexpectedFollowUps: [
      { id: "loudMusic", afterSlots: ["selfName"], es: "¡Está bien fuerte la música! ¿Qué dijiste?", en: "The music's really loud! What did you say?", weight: 0.4, fast: true },
      { id: "introduceOthers", afterSlots: ["hobby"], es: "Ven, te presento a unos amigos.", en: "Come on, let me introduce you to some friends.", weight: 0.4 }
    ],
    mistakes: [
      {
        id: "mishear-name", chance: 0.2,
        npcLine: { es: "Perdón, ¿cómo dijiste que te llamabas?", en: "Sorry, what did you say your name was?" },
        firesIf: (session) => !!session.slots.selfName,
        expectedRepair: /me llamo|mi nombre es|soy/i,
        repairPrompt: { es: "No te escuché bien, ¿me repites tu nombre?", en: "I didn't hear you well, can you repeat your name?" }
      }
    ],
    failureStates: defaultFailureStates(),
    successCondition: fullSlotCompletion,
    dimensionWeights: {
      comprehensibility: 0.3, vocabularyRange: 0.15, sentenceFormation: 0.15,
      repairStrategies: 0.1, conversationManagement: 0.15, questionAsking: 0.1, surpriseHandling: 0.05
    }
  },

  // ---------------------------------------------------------------------
  {
    id: "apartment-hunting",
    title: "Apartment Hunting",
    titleEs: "Buscar departamento",
    actflTier: "intermediate-low",
    npcRole: "agente inmobiliario",
    npcName: "Sr. Cruz",
    icon: "🏠",
    setting: {
      es: "Estás viendo un departamento en renta en Guadalajara y hablas con el agente.",
      en: "You're viewing an apartment for rent in Guadalajara and talking with the agent."
    },
    openings: [
      { es: "Bienvenido, pase. ¿Qué le gustaría saber del departamento?", en: "Welcome, come in. What would you like to know about the apartment?" },
      { es: "Hola, ¿es su primera vez viendo el lugar?", en: "Hi, is this your first time seeing the place?" }
    ],
    // Daily Life Mode's Afternoon segment, following Lunch.
    moodOpenings: {
      good: [{ es: "Bienvenido, pase. Se le ve de buen humor. ¿Qué le gustaría saber del departamento?", en: "Welcome, come in. You seem to be in a good mood. What would you like to know about the apartment?" }],
      rough: [{ es: "Bienvenido, pase. ¿Todo bien? A ver, ¿qué le gustaría saber del departamento?", en: "Welcome, come in. Everything okay? So, what would you like to know about the apartment?" }]
    },
    slots: [
      {
        id: "moveInDate", label: "move-in date", labelEs: "fecha de mudanza", required: true, type: "enum",
        values: ["este mes", "el próximo mes", "en dos meses"],
        extract(text) {
          if (/\beste mes\b/i.test(text)) return "este mes";
          if (/\bpr[oó]ximo mes\b/i.test(text)) return "el próximo mes";
          if (/\bdos meses\b/i.test(text)) return "en dos meses";
          return null;
        },
        askPhrases: [{ es: "¿Cuándo necesita mudarse?", en: "When do you need to move in?" }]
      },
      {
        id: "budget", label: "monthly budget", labelEs: "presupuesto mensual", required: true, type: "enum",
        values: ["seis mil pesos", "ocho mil pesos", "diez mil pesos", "doce mil pesos"],
        extract(text) {
          const m = text.match(/\b(seis|ocho|diez|doce)\s+mil\s+pesos\b/i);
          return m ? `${m[1].toLowerCase()} mil pesos` : null;
        },
        askPhrases: [{ es: "¿Cuál es su presupuesto mensual?", en: "What's your monthly budget?" }]
      },
      {
        id: "hasPets", label: "whether you have pets", labelEs: "si tienes mascotas", required: true, type: "boolean",
        extract(text) {
          if (/\b(perro|gato|mascota)\b/i.test(text) && !/\bno tengo\b/i.test(text)) return true;
          if (/\bno tengo|no,? no\b/i.test(text)) return false;
          return null;
        },
        askPhrases: [{ es: "¿Tiene mascotas?", en: "Do you have pets?" }]
      },
      {
        id: "numberOfOccupants", label: "number of occupants", labelEs: "cuántas personas", required: true, type: "enum",
        values: ["una persona", "dos personas", "tres personas", "una familia"],
        extract(text) {
          if (/\buna familia\b/i.test(text)) return "una familia";
          const m = text.match(/\b(una|dos|tres|cuatro)\s+personas?\b/i);
          if (!m) return null;
          const n = m[1].toLowerCase();
          return n === "una" ? "una persona" : `${n} personas`;
        },
        askPhrases: [{ es: "¿Cuántas personas van a vivir ahí?", en: "How many people will live there?" }]
      },
      {
        id: "depositAck", label: "acknowledging the deposit terms", labelEs: "confirmar el depósito", required: true, type: "enum",
        values: ["understood"],
        extract(text) {
          return /\bdep[oó]sito|mes de garant[ií]a|entendido|est[aá] bien\b/i.test(text) ? "understood" : null;
        },
        askPhrases: [{ es: "Se pide un mes de depósito y el primer mes de renta por adelantado.", en: "We require a month's deposit and first month's rent in advance." }]
      },
      {
        id: "leaseLength", label: "lease length", labelEs: "duración del contrato", required: true, type: "enum",
        values: ["seis meses", "un año", "dos años"],
        extract(text) {
          if (/\bseis meses\b/i.test(text)) return "seis meses";
          if (/\bun a[nñ]o\b/i.test(text)) return "un año";
          if (/\bdos a[nñ]os\b/i.test(text)) return "dos años";
          return null;
        },
        askPhrases: [{ es: "¿Por cuánto tiempo quiere firmar el contrato?", en: "How long would you like to sign the lease for?" }]
      }
    ],
    comboAsks: [
      { slots: ["moveInDate", "leaseLength"], askPhrases: [{ es: "¿Cuándo se mudaría y por cuánto tiempo firmaría?", en: "When would you move in and how long would you sign for?" }] }
    ],
    unexpectedFollowUps: [
      { id: "utilitiesIncluded", afterSlots: ["budget"], es: "Ah, y eso no incluye los servicios — agua, luz, eso es aparte.", en: "Oh, and that doesn't include utilities — water, electricity, that's separate.", weight: 0.5 },
      { id: "noisyNeighbors", afterSlots: ["numberOfOccupants"], es: "Le aviso que los vecinos de arriba a veces hacen ruido.", en: "Just so you know, the upstairs neighbors are sometimes noisy.", weight: 0.3 }
    ],
    mistakes: [
      {
        id: "wrong-price", chance: 0.2,
        npcLine: { es: "Ay perdón, me equivoqué — la renta es de {budget}, no lo que le dije antes.", en: "Oh sorry, I made a mistake — the rent is {budget}, not what I told you before." },
        firesIf: (session) => !!session.slots.budget,
        expectedRepair: /entendido|est[aá] bien|de acuerdo|ok/i,
        repairPrompt: { es: "¿Le parece bien ese precio?", en: "Is that price okay with you?" }
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
    id: "opening-a-bank-account",
    title: "Open a Bank Account",
    titleEs: "Abrir una cuenta bancaria",
    actflTier: "intermediate-low",
    npcRole: "ejecutivo bancario",
    npcName: "Lic. Mendoza",
    icon: "🏦",
    setting: {
      es: "Estás en el banco para abrir una cuenta.",
      en: "You're at the bank to open an account."
    },
    openings: [
      { es: "Buenos días, ¿en qué le puedo ayudar hoy?", en: "Good morning, how can I help you today?" },
      { es: "Adelante, tome asiento. ¿Qué necesita?", en: "Go ahead, have a seat. What do you need?" }
    ],
    slots: [
      {
        id: "accountType", label: "account type", labelEs: "tipo de cuenta", required: true, type: "enum",
        values: ["cuenta de ahorros", "cuenta de cheques", "cuenta de nómina"],
        extract(text) {
          if (/\bahorros\b/i.test(text)) return "cuenta de ahorros";
          if (/\bcheques\b/i.test(text)) return "cuenta de cheques";
          if (/\bn[oó]mina\b/i.test(text)) return "cuenta de nómina";
          return null;
        },
        askPhrases: [{ es: "¿Qué tipo de cuenta quiere abrir?", en: "What kind of account would you like to open?" }]
      },
      {
        id: "idDocument", label: "handing over ID", labelEs: "entregar identificación", required: true, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "¿Me puede dar una identificación oficial?", en: "Could I have an official ID?" }]
      },
      {
        id: "proofOfAddress", label: "whether you brought proof of address", labelEs: "si trae comprobante de domicilio", required: true, type: "boolean",
        extract(text) {
          if (/\btraigo\b|\baqu[ií]\s+(lo\s+)?tengo\b/i.test(text) && !/\bno\b/i.test(text)) return true;
          if (/\bno\s+traigo\b|\bno\s+tengo\b|se me olvid[oó]\b/i.test(text)) return false;
          return null;
        },
        askPhrases: [{ es: "¿Trae algún comprobante de domicilio?", en: "Did you bring proof of address?" }]
      },
      {
        id: "initialDeposit", label: "opening deposit amount", labelEs: "depósito inicial", required: true, type: "enum",
        values: ["quinientos pesos", "mil pesos", "dos mil pesos", "cinco mil pesos"],
        extract(text) {
          if (/\bquinientos pesos\b/i.test(text)) return "quinientos pesos";
          const m = text.match(/\b(un|mil|dos mil|cinco mil)\s*(mil)?\s*pesos\b/i);
          if (/\bmil pesos\b/i.test(text) && !/\bdos mil|cinco mil\b/i.test(text)) return "mil pesos";
          if (/\bdos mil pesos\b/i.test(text)) return "dos mil pesos";
          if (/\bcinco mil pesos\b/i.test(text)) return "cinco mil pesos";
          return null;
        },
        askPhrases: [{ es: "¿Con cuánto quiere abrir la cuenta?", en: "How much would you like to open the account with?" }]
      },
      {
        id: "debitCardWanted", label: "whether you want a debit card", labelEs: "si quieres tarjeta de débito", required: true, type: "boolean",
        extract(text) {
          if (/\b(claro|por favor)\b/i.test(text)) return true;
          if (/\bno,?\s*gracias\b/i.test(text)) return false;
          return null;
        },
        askPhrases: [{ es: "¿Quiere que le demos una tarjeta de débito también?", en: "Would you like a debit card as well?" }]
      },
      {
        id: "onlineBanking", label: "whether you want online banking", labelEs: "si quieres banca en línea", required: true, type: "boolean",
        extract(text) {
          if (/\b(claro|me interesa)\b/i.test(text)) return true;
          if (/\bno,?\s*gracias\b/i.test(text)) return false;
          return null;
        },
        askPhrases: [{ es: "¿Le interesa la banca en línea?", en: "Are you interested in online banking?" }]
      }
    ],
    comboAsks: [
      { slots: ["debitCardWanted", "onlineBanking"], askPhrases: [{ es: "¿Quiere tarjeta de débito y banca en línea?", en: "Would you like a debit card and online banking?" }] }
    ],
    unexpectedFollowUps: [
      { id: "monthlyFee", afterSlots: ["accountType"], es: "Ah, le comento que esta cuenta tiene una comisión mensual si no mantiene el saldo mínimo.", en: "Just so you know, this account has a monthly fee if you don't keep the minimum balance.", weight: 0.5 },
      { id: "appDownload", afterSlots: ["onlineBanking"], es: "Le recomiendo bajar la aplicación del banco desde ahorita.", en: "I'd recommend downloading the bank's app right now.", weight: 0.3 }
    ],
    mistakes: [
      {
        id: "missing-document", chance: 0.2,
        npcLine: { es: "Disculpe, este comprobante ya tiene más de tres meses — necesito uno más reciente.", en: "Sorry, this proof is more than three months old — I need a more recent one." },
        firesIf: (session) => session.slots.proofOfAddress === true,
        expectedRepair: /entendido|puedo traer|tengo otro|est[aá] bien/i,
        repairPrompt: { es: "¿Tiene otro comprobante más reciente?", en: "Do you have a more recent one?" }
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
    id: "team-meeting",
    title: "Team Meeting",
    titleEs: "Junta de equipo",
    actflTier: "intermediate-mid",
    npcRole: "jefa de equipo",
    npcName: "Ing. Torres",
    icon: "📊",
    setting: {
      es: "Estás en una junta de equipo en la oficina y la jefa de proyecto quiere saber el estatus del tuyo.",
      en: "You're in a team meeting at the office and the project lead wants a status update on yours."
    },
    openings: [
      { es: "Buenos días a todos. Empecemos — ¿cómo va tu proyecto?", en: "Good morning everyone. Let's start — how's your project going?" },
      { es: "A ver, cuéntame el avance de tu parte.", en: "So, tell me the progress on your part." }
    ],
    // Daily Life Mode's Work segment, following Commute.
    moodOpenings: {
      good: [{ es: "Buenos días a todos, veo que llegaron bien. Empecemos — ¿cómo va tu proyecto?", en: "Good morning everyone, glad you made it in okay. Let's start — how's your project going?" }],
      rough: [{ es: "Buenos días... ¿todo bien con el traslado? En fin, empecemos — ¿cómo va tu proyecto?", en: "Good morning... everything okay with the commute? Anyway, let's start — how's your project going?" }]
    },
    slots: [
      {
        id: "projectStatus", label: "project status", labelEs: "estatus del proyecto", required: true, type: "enum",
        values: ["a tiempo", "atrasado", "adelantado"],
        extract(text) {
          if (/\ba tiempo\b/i.test(text)) return "a tiempo";
          if (/\b(atrasad|retrasad)[oa]\b/i.test(text)) return "atrasado";
          if (/\badelantad[oa]\b/i.test(text)) return "adelantado";
          return null;
        },
        askPhrases: [{ es: "¿Cómo va tu proyecto — a tiempo, atrasado, adelantado?", en: "How's your project going — on time, behind, ahead?" }]
      },
      {
        id: "blocker", label: "any blockers", labelEs: "obstáculos", required: true, type: "enum",
        values: ["sin problemas", "falta de recursos", "dependencia de otro equipo", "problema técnico"],
        extract(text) {
          if (/\bsin problemas?\b|\bningun[oa]\b|\bno hay\b/i.test(text)) return "sin problemas";
          if (/\brecursos?\b/i.test(text)) return "falta de recursos";
          if (/\botro equipo\b|\bdependencia\b/i.test(text)) return "dependencia de otro equipo";
          if (/\bt[eé]cnico\b/i.test(text)) return "problema técnico";
          return null;
        },
        askPhrases: [{ es: "¿Hay algún obstáculo o dependencia que debamos resolver?", en: "Any blockers or dependencies we should resolve?" }]
      },
      {
        id: "nextDeadline", label: "next deadline", labelEs: "próxima fecha límite", required: true, type: "enum",
        values: ["lunes", "martes", "miércoles", "jueves", "viernes"],
        extract(text) {
          const m = text.match(/\b(lunes|martes|mi[eé]rcoles|jueves|viernes)\b/i);
          return m ? m[1].toLowerCase() : null;
        },
        askPhrases: [{ es: "¿Para cuándo lo tienes listo?", en: "When will it be ready?" }]
      },
      {
        id: "needHelp", label: "whether you need help", labelEs: "si necesitas ayuda", required: true, type: "boolean",
        extract(text) {
          if (/\bs[ií],?\s*necesito|necesito ayuda\b/i.test(text)) return true;
          if (/\bno,?\s*(no necesito|estoy bien|gracias)\b/i.test(text)) return false;
          return null;
        },
        askPhrases: [{ es: "¿Necesitas ayuda de alguien del equipo?", en: "Do you need help from anyone on the team?" }]
      },
      {
        id: "actionItem", label: "your next concrete step", labelEs: "tu siguiente paso", required: true, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "¿Cuál es tu siguiente paso concreto?", en: "What's your next concrete step?" }]
      }
    ],
    comboAsks: [
      { slots: ["projectStatus", "nextDeadline"], askPhrases: [{ es: "¿Cómo va tu proyecto y para cuándo lo tienes?", en: "How's your project going and when will you have it?" }] }
    ],
    unexpectedFollowUps: [
      { id: "interrupt", afterSlots: ["blocker"], es: "Perdón, te voy a interrumpir un segundo — ¿ya hablaste con Recursos Humanos?", en: "Sorry, let me interrupt for a second — have you talked to HR yet?", weight: 0.5, fast: true },
      { id: "anyoneElse", afterSlots: ["needHelp"], es: "¿Alguien más tiene algo que agregar sobre esto?", en: "Does anyone else have anything to add about this?", weight: 0.4 }
    ],
    mistakes: [
      {
        id: "wrong-project", chance: 0.2,
        npcLine: { es: "Espera, ¿ese no era el proyecto de Marketing? Perdón, me confundí.", en: "Wait, wasn't that the Marketing project? Sorry, I got confused." },
        firesIf: (session) => !!session.slots.projectStatus,
        expectedRepair: /no,?\s*(es|era)|te refieres a|hablo de|mi proyecto es/i,
        repairPrompt: { es: "A ver, ¿de qué proyecto hablamos entonces?", en: "Okay, which project are we talking about then?" }
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
    id: "lost-wallet-police-report",
    title: "Report a Lost Wallet",
    titleEs: "Reportar una cartera perdida",
    actflTier: "intermediate-mid",
    npcRole: "oficial de policía",
    npcName: "Oficial Vargas",
    icon: "🚨",
    setting: {
      es: "Perdiste tu cartera y vas a la policía para reportarlo.",
      en: "You lost your wallet and go to the police to report it."
    },
    openings: [
      { es: "Buenas, ¿en qué le puedo ayudar?", en: "Good day, how can I help you?" },
      { es: "¿Qué se le ofrece?", en: "What do you need?" }
    ],
    // Daily Life Mode's Night segment, following Evening — the finale.
    moodOpenings: {
      good: [{ es: "Buenas noches, ¿en qué le puedo ayudar? Se ve que la está pasando bien.", en: "Good evening, how can I help you? Looks like you're having a good time." }],
      rough: [{ es: "Buenas noches, ¿en qué le puedo ayudar? Se le ve preocupado.", en: "Good evening, how can I help you? You seem worried." }]
    },
    slots: [
      {
        id: "reasonForReport", label: "reason for the report", labelEs: "motivo del reporte", required: true, type: "enum",
        values: ["perdí mi cartera", "me robaron la cartera", "perdí mi teléfono", "me robaron el teléfono"],
        extract(text) {
          const robbedWallet = /\brobaron\b.*\bcartera\b/i.test(text);
          const robbedPhone = /\brobaron\b.*\btel[eé]fono\b/i.test(text);
          if (robbedWallet) return "me robaron la cartera";
          if (robbedPhone) return "me robaron el teléfono";
          if (/\bperd[ií].*\bcartera\b/i.test(text)) return "perdí mi cartera";
          if (/\bperd[ií].*\btel[eé]fono\b/i.test(text)) return "perdí mi teléfono";
          return null;
        },
        askPhrases: [{ es: "¿Qué pasó exactamente?", en: "What exactly happened?" }]
      },
      {
        id: "whenItHappened", label: "when it happened", labelEs: "cuándo pasó", required: true, type: "enum",
        values: ["hoy en la mañana", "hoy en la tarde", "ayer", "hace dos días"],
        extract(text) {
          if (/\bhoy en la ma[nñ]ana\b/i.test(text)) return "hoy en la mañana";
          if (/\bhoy en la tarde\b/i.test(text)) return "hoy en la tarde";
          if (/\bhace dos d[ií]as\b/i.test(text)) return "hace dos días";
          if (/\bayer\b/i.test(text)) return "ayer";
          return null;
        },
        askPhrases: [{ es: "¿Cuándo pasó esto?", en: "When did this happen?" }]
      },
      {
        id: "whereItHappened", label: "where it happened", labelEs: "dónde pasó", required: true, type: "enum",
        values: ["en el metro", "en la calle", "en un restaurante", "en el mercado"],
        extract(text) {
          if (/\bmetro\b/i.test(text)) return "en el metro";
          if (/\bcalle\b/i.test(text)) return "en la calle";
          if (/\brestaurante\b/i.test(text)) return "en un restaurante";
          if (/\bmercado\b/i.test(text)) return "en el mercado";
          return null;
        },
        askPhrases: [{ es: "¿Dónde fue — en qué lugar?", en: "Where was it — what place?" }]
      },
      {
        id: "itemsLost", label: "what was inside", labelEs: "qué traía adentro", required: true, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "¿Qué traía adentro?", en: "What did you have inside it?" }]
      },
      {
        id: "fullName", label: "full name for the report", labelEs: "nombre completo", required: true, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "Necesito su nombre completo para el reporte.", en: "I need your full name for the report." }]
      },
      {
        id: "contactPhone", label: "callback number", labelEs: "número de contacto", required: true, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "¿Me deja un número donde le podamos llamar?", en: "Could you leave a number where we can reach you?" }]
      }
    ],
    comboAsks: [
      { slots: ["whenItHappened", "whereItHappened"], askPhrases: [{ es: "¿Cuándo y dónde pasó?", en: "When and where did it happen?" }] }
    ],
    unexpectedFollowUps: [
      { id: "cardBlock", afterSlots: ["itemsLost"], es: "¿Ya canceló sus tarjetas del banco?", en: "Have you already cancelled your bank cards?", weight: 0.6 },
      { id: "witnessAsk", afterSlots: ["whereItHappened"], es: "¿Había alguien más ahí que haya visto algo?", en: "Was anyone else there who might have seen something?", weight: 0.4 }
    ],
    mistakes: [
      {
        id: "wrong-form", chance: 0.2,
        npcLine: { es: "Ay, disculpe, le di el formato equivocado — necesito el otro.", en: "Oh, sorry, I gave you the wrong form — I need the other one." },
        firesIf: (session) => !!session.slots.reasonForReport,
        expectedRepair: /entendido|est[aá] bien|no hay problema|ok/i,
        repairPrompt: { es: "¿Me entendió? Un momento, por favor.", en: "Did you understand? One moment, please." }
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
    id: "renewing-id-paperwork",
    title: "Renew Official ID",
    titleEs: "Renovar identificación oficial",
    actflTier: "advanced-low",
    npcRole: "funcionario",
    npcName: "Lic. Paredes",
    icon: "🪪",
    setting: {
      es: "Estás en una oficina de gobierno para renovar tu identificación oficial.",
      en: "You're at a government office to renew your official ID."
    },
    openings: [
      { es: "Buenos días, ¿qué trámite viene a hacer?", en: "Good morning, what procedure are you here for?" },
      { es: "Adelante. ¿En qué le puedo apoyar?", en: "Go ahead. How can I help you?" }
    ],
    slots: [
      {
        id: "reasonForVisit", label: "reason for the visit", labelEs: "motivo de la visita", required: true, type: "enum",
        values: ["renovación", "reposición por robo", "cambio de domicilio", "primera vez"],
        extract(text) {
          if (/\brenovaci[oó]n\b/i.test(text)) return "renovación";
          if (/\breposici[oó]n\b/i.test(text)) return "reposición por robo";
          if (/\bcambio de domicilio\b/i.test(text)) return "cambio de domicilio";
          if (/\bprimera vez\b/i.test(text)) return "primera vez";
          return null;
        },
        askPhrases: [{ es: "¿Es renovación, reposición, o es la primera vez que la tramita?", en: "Is it a renewal, replacement, or your first time applying?" }]
      },
      {
        id: "documentsBrought", label: "documents brought", labelEs: "documentos que trae", required: true, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "¿Qué documentos trae?", en: "What documents did you bring?" }]
      },
      {
        id: "currentAddressConfirm", label: "whether the address is current", labelEs: "si la dirección sigue vigente", required: true, type: "boolean",
        extract(text) {
          if (/\bs[ií],?\s*(sigo|la misma)\b/i.test(text)) return true;
          if (/\bno,?\s*(me cambi[eé]|ya no)\b/i.test(text)) return false;
          return null;
        },
        askPhrases: [{ es: "¿Sigue viviendo en la misma dirección registrada?", en: "Are you still living at the registered address?" }]
      },
      {
        id: "appointmentOrWalkIn", label: "appointment or walk-in", labelEs: "con o sin cita", required: true, type: "enum",
        values: ["con cita", "sin cita"],
        extract(text) {
          if (/\bcon cita\b/i.test(text)) return "con cita";
          if (/\bsin cita\b/i.test(text)) return "sin cita";
          return null;
        },
        askPhrases: [{ es: "¿Viene con cita programada o sin cita?", en: "Are you here with a scheduled appointment or a walk-in?" }]
      },
      {
        id: "reasonExplanation", label: "detailed explanation", labelEs: "explicación detallada", required: true, type: "free", contextOnly: true,
        extract: extractFreeAnswer,
        askPhrases: [{ es: "Cuénteme con más detalle qué pasó con su identificación anterior.", en: "Tell me in more detail what happened with your previous ID." }]
      },
      {
        id: "followUpAppointment", label: "day for the follow-up appointment", labelEs: "día de la siguiente cita", required: true, type: "enum",
        values: ["lunes", "martes", "miércoles", "jueves", "viernes"],
        extract(text) {
          const m = text.match(/\b(lunes|martes|mi[eé]rcoles|jueves|viernes)\b/i);
          return m ? m[1].toLowerCase() : null;
        },
        askPhrases: [{ es: "¿Qué día le viene bien para tomarle sus datos biométricos?", en: "What day works for you to come in for biometrics?" }]
      }
    ],
    comboAsks: [
      { slots: ["reasonForVisit", "appointmentOrWalkIn"], askPhrases: [{ es: "¿Qué trámite es y viene con cita o sin cita?", en: "What procedure is it and are you here with or without an appointment?" }] }
    ],
    unexpectedFollowUps: [
      { id: "feeAsk", afterSlots: ["reasonForVisit"], es: "Le comento que la reposición por robo tiene un costo adicional.", en: "Just so you know, a replacement for theft has an additional cost.", weight: 0.4 },
      { id: "biometrics", afterSlots: ["documentsBrought"], es: "Vamos a necesitar tomarle sus datos biométricos de nuevo — huellas y foto.", en: "We're going to need to take your biometric data again — fingerprints and photo.", weight: 0.5 }
    ],
    mistakes: [
      {
        id: "system-down", chance: 0.2,
        npcLine: { es: "Disculpe, el sistema se cayó — vamos a tener que esperar unos minutos o reagendar.", en: "Sorry, the system just went down — we'll have to wait a few minutes or reschedule." },
        firesIf: (session) => !!session.slots.reasonForVisit,
        expectedRepair: /espero|puedo esperar|reagend|otro d[ií]a|est[aá] bien/i,
        repairPrompt: { es: "¿Prefiere esperar o reagendar para otro día?", en: "Would you rather wait or reschedule for another day?" }
      }
    ],
    failureStates: defaultFailureStates({ abandonTurns: 16, mistakeTurns: 14 }),
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
