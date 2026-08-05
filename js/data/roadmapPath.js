// ROADMAP PATH — the Duolingo-style ordered path of unlockable lesson nodes.
//
// Pure data + a couple of pure helper functions: no imports from
// vocabulary.js/grammar.js/storage.js here. Each node just REFERENCES real
// content (a grammar concept id, or a vocabulary level+category slice) —
// js/views/roadmap.js is responsible for turning a node reference into an
// actual array of runLesson questions using the existing exercises/
// distractors engines, and for reading/writing completion state in
// store.state.progress.lessonsCompleted.
//
// Structure mirrors js/data/curriculum.js's CEFR level grouping (A0 → C1),
// but goes one level deeper: each curriculum "unit" here becomes several
// bite-sized roadmap nodes (one per grammar concept or vocabulary category
// grouping) so the path has enough granularity to actually feel like a path.
//
// Unlock rules (see computeRoadmapState):
//   - The very first node of the very first unit is always unlocked.
//   - A regular node unlocks once the node immediately before it (in global
//     path order) is completed.
//   - A unit's checkpoint unlocks only once every regular node in that unit
//     is completed.
//   - The next unit's first node unlocks only once the previous unit's
//     checkpoint is passed.

export const ROADMAP_UNITS = [
  {
    level: "A0",
    title: "Fundamentos absolutos",
    icon: "🌱",
    nodes: [
      {
        id: "roadmap_a0_alphabet",
        type: "grammar",
        title: "Alfabeto español",
        description: "Las letras, la eñe y cómo deletrear en español.",
        icon: "🔤",
        grammarIds: ["gram_alphabet"]
      },
      {
        id: "roadmap_a0_pronunciation",
        type: "grammar",
        title: "Pronunciación castellana",
        description: "Los sonidos del español de España: la distinción, la jota, la doble erre.",
        icon: "🗣️",
        grammarIds: ["gram_pronunciation"]
      },
      {
        id: "roadmap_a0_greetings",
        type: "vocab",
        title: "Saludos y presentaciones",
        description: "Hola, buenos días, mucho gusto — tu primera conversación.",
        icon: "👋",
        vocabLevel: "A0",
        vocabCategories: ["greetings"]
      },
      {
        id: "roadmap_a0_numbers",
        type: "vocab",
        title: "Números y fechas",
        description: "Contar, decir la fecha, los días de la semana y los meses.",
        icon: "🔢",
        vocabLevel: "A0",
        vocabCategories: ["numbers"]
      },
      {
        id: "roadmap_a0_daily",
        type: "vocab",
        title: "Frases esenciales",
        description: "Por favor, gracias, ¿dónde está...?, no entiendo.",
        icon: "🙏",
        vocabLevel: "A0",
        vocabCategories: ["daily-life"]
      },
      {
        id: "roadmap_a0_time_verbs",
        type: "vocab",
        title: "La hora y primeros verbos",
        description: "Decir la hora y tus primeros verbos de uso diario.",
        icon: "⏰",
        vocabLevel: "A0",
        vocabCategories: ["time", "verbs"]
      }
    ],
    checkpoint: {
      id: "roadmap_a0_checkpoint",
      title: "Repaso: Fundamentos absolutos",
      description: "Un repaso a fondo de todo lo aprendido en A0.",
      icon: "🏁"
    }
  },
  {
    level: "A1",
    title: "Bases del idioma",
    icon: "🧱",
    nodes: [
      {
        id: "roadmap_a1_articles",
        type: "grammar",
        title: "Artículos, género y plural",
        description: "El/la, un/una, y cómo formar el plural.",
        icon: "📐",
        grammarIds: ["gram_articles", "gram_gender", "gram_plural"]
      },
      {
        id: "roadmap_a1_adjectives_gram",
        type: "grammar",
        title: "Los adjetivos",
        description: "Cómo los adjetivos concuerdan con el sustantivo en español.",
        icon: "🎨",
        grammarIds: ["gram_adjectives"]
      },
      {
        id: "roadmap_a1_ser_estar",
        type: "grammar",
        title: "Ser, estar y hay",
        description: "Los tres verbos imprescindibles para empezar a describir el mundo.",
        icon: "🧩",
        grammarIds: ["gram_ser", "gram_estar", "gram_hay"]
      },
      {
        id: "roadmap_a1_present",
        type: "grammar",
        title: "Presente regular y preguntas",
        description: "Verbos -ar/-er/-ir en presente y cómo hacer preguntas.",
        icon: "❓",
        grammarIds: ["gram_present_regular", "gram_questions"]
      },
      {
        id: "roadmap_a1_family_daily",
        type: "vocab",
        title: "Familia y vida diaria",
        description: "Casa, familia, rutina — el léxico de más alta frecuencia.",
        icon: "👨‍👩‍👧",
        vocabLevel: "A1",
        vocabCategories: ["family", "daily-life"]
      },
      {
        id: "roadmap_a1_food_weather",
        type: "vocab",
        title: "Comida y el tiempo",
        description: "Vocabulario de comida española y del tiempo atmosférico.",
        icon: "🍽️",
        vocabLevel: "A1",
        vocabCategories: ["food", "weather"]
      },
      {
        id: "roadmap_a1_time_numbers",
        type: "vocab",
        title: "La hora y los números",
        description: "Ampliando los números y las expresiones de tiempo.",
        icon: "🕐",
        vocabLevel: "A1",
        vocabCategories: ["time", "numbers"]
      },
      {
        id: "roadmap_a1_adjectives_studies",
        type: "vocab",
        title: "Adjetivos, estudios y verbos",
        description: "Describir cosas y personas, y hablar de estudios.",
        icon: "🎓",
        vocabLevel: "A1",
        vocabCategories: ["adjectives", "education", "verbs"]
      }
    ],
    checkpoint: {
      id: "roadmap_a1_checkpoint",
      title: "Repaso: Bases del idioma",
      description: "Repaso mixto y algo más difícil de todo A1.",
      icon: "🏁"
    }
  },
  {
    level: "A2",
    title: "Español cotidiano",
    icon: "🏘️",
    nodes: [
      {
        id: "roadmap_a2_present_irregular",
        type: "grammar",
        title: "Presente irregular y reflexivos",
        description: "Verbos con cambio de raíz, irregulares en yo, y los reflexivos.",
        icon: "🔄",
        grammarIds: ["gram_present_irregular", "gram_reflexive"]
      },
      {
        id: "roadmap_a2_past",
        type: "grammar",
        title: "Pretérito e imperfecto",
        description: "Hablar del pasado: qué pasó y cómo eran las cosas.",
        icon: "⏳",
        grammarIds: ["gram_preterite", "gram_imperfect"]
      },
      {
        id: "roadmap_a2_future_pronouns",
        type: "grammar",
        title: "Futuro y pronombres de objeto",
        description: "Hacer planes y sustituir nombres por lo/la/le.",
        icon: "➡️",
        grammarIds: ["gram_future", "gram_direct_object_pronouns", "gram_indirect_object_pronouns"]
      },
      {
        id: "roadmap_a2_comparisons",
        type: "grammar",
        title: "Comparativos y superlativos",
        description: "Más...que, menos...que, tan...como.",
        icon: "⚖️",
        grammarIds: ["gram_comparisons"]
      },
      {
        id: "roadmap_a2_shopping_food",
        type: "vocab",
        title: "De compras y de tapas",
        description: "En el mercado, en la tienda, y pidiendo en un bar.",
        icon: "🛍️",
        vocabLevel: "A2",
        vocabCategories: ["shopping", "food"]
      },
      {
        id: "roadmap_a2_travel",
        type: "vocab",
        title: "Viajar por España",
        description: "Renfe, aeropuertos, hoteles — español de viaje real.",
        icon: "🚄",
        vocabLevel: "A2",
        vocabCategories: ["travel"]
      },
      {
        id: "roadmap_a2_house_body",
        type: "vocab",
        title: "La casa y el cuerpo",
        description: "Las habitaciones del piso y las partes del cuerpo.",
        icon: "🏠",
        vocabLevel: "A2",
        vocabCategories: ["house", "body"]
      },
      {
        id: "roadmap_a2_health_daily",
        type: "vocab",
        title: "Salud y vida diaria",
        description: "En el médico, la farmacia, y la vida de cada día.",
        icon: "🩺",
        vocabLevel: "A2",
        vocabCategories: ["health", "daily-life"]
      }
    ],
    checkpoint: {
      id: "roadmap_a2_checkpoint",
      title: "Repaso: Español cotidiano",
      description: "Repaso mixto y algo más difícil de todo A2.",
      icon: "🏁"
    }
  },
  {
    level: "B1",
    title: "Conversación intermedia",
    icon: "💬",
    nodes: [
      {
        id: "roadmap_b1_preterite_imperfect",
        type: "grammar",
        title: "Pretérito vs. imperfecto",
        description: "Elegir el tiempo pasado correcto al narrar.",
        icon: "📖",
        grammarIds: ["gram_preterite_vs_imperfect"]
      },
      {
        id: "roadmap_b1_conditional_commands",
        type: "grammar",
        title: "Condicional e imperativo",
        description: "Qué harías, y cómo dar órdenes (incluido vosotros).",
        icon: "🎯",
        grammarIds: ["gram_conditional", "gram_commands"]
      },
      {
        id: "roadmap_b1_relative_passive",
        type: "grammar",
        title: "Relativos y voz pasiva",
        description: "Que, quien, donde — y la voz pasiva con se.",
        icon: "🔗",
        grammarIds: ["gram_relative_pronouns", "gram_passive"]
      },
      {
        id: "roadmap_b1_subjunctive_perfect",
        type: "grammar",
        title: "Subjuntivo presente y tiempos compuestos",
        description: "El presente de subjuntivo y el pretérito perfecto/pluscuamperfecto.",
        icon: "🌀",
        grammarIds: ["gram_present_subjunctive", "gram_perfect_tenses"]
      },
      {
        id: "roadmap_b1_emotions",
        type: "vocab",
        title: "Emociones y expresiones",
        description: "Cómo te sientes, y expresiones muy usadas en España.",
        icon: "❤️",
        vocabLevel: "B1",
        vocabCategories: ["emotions", "expressions"]
      },
      {
        id: "roadmap_b1_tech_work",
        type: "vocab",
        title: "Tecnología y trabajo",
        description: "El móvil, el ordenador, y el vocabulario de la oficina.",
        icon: "💻",
        vocabLevel: "B1",
        vocabCategories: ["technology", "work"]
      },
      {
        id: "roadmap_b1_nature_studies",
        type: "vocab",
        title: "Vida diaria, naturaleza y estudios",
        description: "El campo, la universidad, y algo más de vida diaria.",
        icon: "🌳",
        vocabLevel: "B1",
        vocabCategories: ["daily-life", "nature", "education"]
      }
    ],
    checkpoint: {
      id: "roadmap_b1_checkpoint",
      title: "Repaso: Conversación intermedia",
      description: "Repaso mixto y algo más difícil de todo B1.",
      icon: "🏁"
    }
  },
  {
    level: "B2",
    title: "Español avanzado",
    icon: "🚀",
    nodes: [
      {
        id: "roadmap_b2_imperfect_subjunctive",
        type: "grammar",
        title: "Imperfecto de subjuntivo",
        description: "Si tuviera tiempo... — el subjuntivo en pasado.",
        icon: "🌫️",
        grammarIds: ["gram_imperfect_subjunctive"]
      },
      {
        id: "roadmap_b2_conditional_perfect",
        type: "grammar",
        title: "Condicional compuesto",
        description: "Lo habría hecho... — hablar de hipótesis pasadas.",
        icon: "🔮",
        grammarIds: ["gram_conditional_perfect"]
      },
      {
        id: "roadmap_b2_reported_speech",
        type: "grammar",
        title: "Estilo indirecto",
        description: "Contar lo que otra persona dijo.",
        icon: "💭",
        grammarIds: ["gram_reported_speech"]
      },
      {
        id: "roadmap_b2_connectors",
        type: "grammar",
        title: "Conectores avanzados",
        description: "Sin embargo, no obstante, por lo tanto, aunque...",
        icon: "🧷",
        grammarIds: ["gram_advanced_connectors"]
      },
      {
        id: "roadmap_b2_work",
        type: "vocab",
        title: "El trabajo y lo profesional",
        description: "Reuniones, negociaciones, el mundo laboral.",
        icon: "💼",
        vocabLevel: "B2",
        vocabCategories: ["work"]
      },
      {
        id: "roadmap_b2_daily_expressions",
        type: "vocab",
        title: "Vida diaria y expresiones avanzadas",
        description: "Matices y expresiones para sonar más natural.",
        icon: "🗨️",
        vocabLevel: "B2",
        vocabCategories: ["daily-life", "expressions", "adjectives"]
      }
    ],
    checkpoint: {
      id: "roadmap_b2_checkpoint",
      title: "Repaso: Español avanzado",
      description: "Repaso mixto y algo más difícil de todo B2.",
      icon: "🏁"
    }
  },
  {
    level: "C1",
    title: "Fluidez casi nativa",
    icon: "👑",
    nodes: [
      {
        id: "roadmap_c1_idiomatic",
        type: "grammar",
        title: "Estructuras idiomáticas",
        description: "Estructuras avanzadas propias del español nativo.",
        icon: "🎭",
        grammarIds: ["gram_idiomatic_structures"]
      },
      {
        id: "roadmap_c1_spain_usage",
        type: "grammar",
        title: "Usos avanzados de España",
        description: "Leísmo, vosotros en subjuntivo/mandatos, vale, venga.",
        icon: "🇪🇸",
        grammarIds: ["gram_spain_advanced_usage"]
      },
      {
        id: "roadmap_c1_vocab",
        type: "vocab",
        title: "Vocabulario avanzado y matices",
        description: "Los últimos matices de vocabulario para sonar nativo.",
        icon: "📚",
        vocabLevel: "C1",
        vocabCategories: ["daily-life", "adjectives", "expressions"]
      }
    ],
    checkpoint: {
      id: "roadmap_c1_checkpoint",
      title: "Repaso final: Fluidez casi nativa",
      description: "El último repaso del camino — enhorabuena si llegas hasta aquí.",
      icon: "🏆"
    }
  }
];

/**
 * Total count of regular (non-checkpoint) nodes across the whole path.
 */
export function totalNodeCount() {
  return ROADMAP_UNITS.reduce((sum, u) => sum + u.nodes.length, 0);
}

/**
 * Total count of checkpoint nodes across the whole path.
 */
export function totalCheckpointCount() {
  return ROADMAP_UNITS.length;
}

/**
 * Every node id in the path, regular nodes and checkpoints, in path order.
 */
export function allNodeIds() {
  const ids = [];
  ROADMAP_UNITS.forEach((unit) => {
    unit.nodes.forEach((n) => ids.push(n.id));
    ids.push(unit.checkpoint.id);
  });
  return ids;
}

/**
 * Look up a single node (regular or checkpoint) by id, along with the unit
 * it belongs to. Returns null if not found.
 */
export function findNode(nodeId) {
  for (const unit of ROADMAP_UNITS) {
    const node = unit.nodes.find((n) => n.id === nodeId);
    if (node) return { unit, node, isCheckpoint: false };
    if (unit.checkpoint.id === nodeId) return { unit, node: unit.checkpoint, isCheckpoint: true };
  }
  return null;
}

/**
 * Walks the whole path applying the unlock rules described at the top of
 * this file, given the list of completed node ids (roadmap.js reads these
 * from store.state.progress.lessonsCompleted). Returns ROADMAP_UNITS with
 * each node/checkpoint annotated with a `status`:
 *   node status:       "locked" | "unlocked" | "completed"
 *   checkpoint status:  "waiting" | "ready" | "passed"
 *
 * Pure function — takes no dependency on storage.js so it stays trivially
 * testable and reusable from the view.
 */
export function computeRoadmapState(completedList = []) {
  const completed = new Set(completedList);
  let prevDone = true; // the very first node of the very first unit is always unlocked
  return ROADMAP_UNITS.map((unit) => {
    let allNodesDone = true;
    const nodes = unit.nodes.map((node) => {
      const isCompleted = completed.has(node.id);
      const unlocked = prevDone;
      prevDone = isCompleted;
      if (!isCompleted) allNodesDone = false;
      return { ...node, status: isCompleted ? "completed" : unlocked ? "unlocked" : "locked" };
    });
    const checkpointCompleted = completed.has(unit.checkpoint.id);
    const checkpointStatus = checkpointCompleted ? "passed" : allNodesDone ? "ready" : "waiting";
    prevDone = checkpointCompleted; // next unit's first node gates on the checkpoint, not the last node
    return { ...unit, nodes, checkpoint: { ...unit.checkpoint, status: checkpointStatus } };
  });
}
