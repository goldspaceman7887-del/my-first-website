// Lightweight curriculum map used to drive the Dashboard's "next lesson"
// nudge and give learners a clear sense of the overall A0→C1 path.
// Actual teaching content lives in vocabulary.js / grammar.js / dialogues*.js
// / reading.js / culture.js — these lessons just point into filtered views.

export const CURRICULUM_UNITS = [
  {
    level: "A0",
    title: "Fundamentos absolutos",
    lessons: [
      { id: "a0_alphabet", title: "Alfabeto y pronunciación castellana", description: "El abecedario español, sonidos de ce/ci/z, la ñ, y cómo suena el español de España.", href: "#/grammar?level=beginner" },
      { id: "a0_greetings", title: "Saludos y presentaciones", description: "Hola, ¿qué tal?, mucho gusto — tu primera conversación.", href: "#/dialogues?category=beginner" },
      { id: "a0_numbers", title: "Números, fechas y días", description: "Contar, decir la fecha, los días de la semana y los meses.", href: "#/vocabulary?level=A0" },
      { id: "a0_phrases", title: "Frases esenciales", description: "Por favor, gracias, ¿dónde está...?, no entiendo — supervivencia básica.", href: "#/vocabulary?level=A0" }
    ]
  },
  {
    level: "A1",
    title: "Bases del idioma",
    lessons: [
      { id: "a1_present", title: "Presente de indicativo, artículos y género", description: "Ser, estar, hay, y los verbos regulares en presente.", href: "#/grammar?level=beginner" },
      { id: "a1_daily", title: "Vocabulario de la vida diaria", description: "Casa, familia, comida, rutina — el léxico de más alta frecuencia.", href: "#/vocabulary?level=A1" },
      { id: "a1_conversation", title: "Conversación básica", description: "Pedir un café, hacer la compra, preguntar direcciones.", href: "#/dialogues?category=beginner" }
    ]
  },
  {
    level: "A2",
    title: "Español cotidiano",
    lessons: [
      { id: "a2_preterite", title: "Pretérito y expresiones de futuro", description: "Hablar del pasado y hacer planes.", href: "#/grammar?level=intermediate" },
      { id: "a2_travel", title: "Español de viaje, compras y restaurantes", description: "Renfe, tiendas, menús — comunicación real.", href: "#/dialogues?category=intermediate" }
    ]
  },
  {
    level: "B1",
    title: "Conversación intermedia",
    lessons: [
      { id: "b1_storytelling", title: "Narración, opiniones y explicaciones", description: "Pretérito vs. imperfecto, dar tu opinión con seguridad.", href: "#/grammar?level=intermediate" },
      { id: "b1_speaking", title: "Habla extendida", description: "Practica hablar en párrafos completos.", href: "#/speaking" }
    ]
  },
  {
    level: "B2",
    title: "Español avanzado",
    lessons: [
      { id: "b2_grammar", title: "Gramática avanzada y subjuntivo", description: "Subjuntivo presente, condicional, conectores avanzados.", href: "#/grammar?level=advanced" },
      { id: "b2_professional", title: "Situaciones profesionales y actualidad", description: "Reuniones, negociaciones, noticias.", href: "#/dialogues?category=advanced" }
    ]
  },
  {
    level: "C1",
    title: "Fluidez casi nativa",
    lessons: [
      { id: "c1_expression", title: "Expresión avanzada y matices", description: "Estilo indirecto, estructuras idiomáticas, uso avanzado en España.", href: "#/grammar?level=advanced" },
      { id: "c1_media", title: "Medios nativos y diferencias regionales", description: "Lectura y comprensión de nivel C1.", href: "#/reading?level=C1" }
    ]
  }
];
