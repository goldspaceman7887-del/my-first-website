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
        id: "drink", label: "drink type", required: true, type: "enum",
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
        id: "size", label: "size", required: true, type: "enum",
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
        id: "temperature", label: "hot or iced", required: true, type: "enum",
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
        id: "sugar", label: "sugar", required: true, type: "enum",
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
        id: "substitution", label: "substitution", required: false, type: "free",
        askPhrases: [
          { es: "¿Alguna sustitución o algo que quiera cambiar?", en: "Any substitutions or changes?" }
        ]
      },
      {
        id: "specialRequest", label: "special request", required: false, type: "free",
        askPhrases: [
          { es: "¿Algo especial que deba anotar?", en: "Anything special I should note?" }
        ]
      },
      {
        id: "allergy", label: "allergy check", required: false, type: "boolean", npcInitiated: true,
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
        id: "payment", label: "payment method", required: true, type: "enum",
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

    failureStates: [
      {
        id: "abandoned",
        when: (session) => session.turns > 14 && session.filledRequiredCount < session.requiredSlots.length * 0.5,
        outcome: "incomplete"
      },
      {
        id: "miscommunication",
        when: (session) => session.unresolvedMistakes >= 1 && session.turns > 12,
        outcome: "failed"
      }
    ],
    successCondition: (session) => session.filledRequiredCount === session.requiredSlots.length && session.unresolvedMistakes === 0,

    // How this scenario's rubric score weighs the 7 evaluation dimensions —
    // Novice/Novice-Mid scenarios lean on comprehensibility/slot-fill;
    // higher-tier scenarios (added later) weight conversation-management and
    // question-asking more heavily, per the Novice/Intermediate/Advanced
    // functional benchmarks.
    dimensionWeights: {
      comprehensibility: 0.3, vocabularyRange: 0.15, sentenceFormation: 0.15,
      repairStrategies: 0.1, conversationManagement: 0.15, questionAsking: 0.1, surpriseHandling: 0.05
    }
  }
];

export function scenarioById(id) {
  return SCENARIOS.find((s) => s.id === id);
}

export function scenariosForTier(tier) {
  return SCENARIOS.filter((s) => s.actflTier === tier);
}
