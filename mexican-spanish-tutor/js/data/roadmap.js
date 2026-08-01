// ACTFL PROFICIENCY TRACKING — the 7 sub-levels this app trains toward,
// Novice Low through Advanced Low, each with the Can-Do statements from the
// tutor spec. Roadmap units unlock in order; each bundles a handful of
// Mexican-Spanish sentences that exemplify that level's complexity.

export const ACTFL_LEVELS = [
  {
    code: "novice-low", label: "Novice Low", short: "NL",
    blurb: "Isolated words and memorized phrases — greetings, numbers, common objects.",
    canDo: [
      "Introduce myself",
      "Say my name",
      "Greet people",
      "Count",
      "Identify common objects"
    ]
  },
  {
    code: "novice-mid", label: "Novice Mid", short: "NM",
    blurb: "Short lists and simple, formulaic sentences on very familiar topics.",
    canDo: [
      "Answer simple questions",
      "Discuss family",
      "Order food",
      "Talk about likes and dislikes"
    ]
  },
  {
    code: "novice-high", label: "Novice High", short: "NH",
    blurb: "Simple sentences on familiar topics, with occasional gaps.",
    canDo: [
      "Handle simple daily situations",
      "Describe routines",
      "Talk about plans"
    ]
  },
  {
    code: "intermediate-low", label: "Intermediate Low", short: "IL",
    blurb: "Create with the language: simple sentences on everyday needs.",
    canDo: [
      "Maintain short conversations",
      "Ask follow-up questions",
      "Talk about personal experiences"
    ]
  },
  {
    code: "intermediate-mid", label: "Intermediate Mid", short: "IM",
    blurb: "Handle simple transactions and everyday situations.",
    canDo: [
      "Discuss familiar topics in detail",
      "Describe events",
      "Explain preferences"
    ]
  },
  {
    code: "intermediate-high", label: "Intermediate High", short: "IH",
    blurb: "Connected sentences on personal topics; can narrate a little, with some ease handling a complication.",
    canDo: [
      "Narrate across time frames",
      "Handle unexpected situations",
      "Support opinions"
    ]
  },
  {
    code: "advanced-low", label: "Advanced Low", short: "AL",
    blurb: "Paragraph-length discourse: narrate and describe in all major time frames, explain, and defend opinions.",
    canDo: [
      "Narrate and describe in all major time frames",
      "Explain causes and effects",
      "Discuss abstract topics",
      "Defend opinions",
      "Speak in organized paragraphs"
    ]
  }
];

export function levelIndex(code) {
  return ACTFL_LEVELS.findIndex((l) => l.code === code);
}

export function levelByCode(code) {
  return ACTFL_LEVELS.find((l) => l.code === code) || ACTFL_LEVELS[0];
}

export function allCanDoIds() {
  const ids = [];
  ACTFL_LEVELS.forEach((l) => l.canDo.forEach((_, i) => ids.push(`${l.code}__${i}`)));
  return ids;
}

// A Duolingo-style path: each unit is a short "meet 4-5 sentences at this
// level's complexity, then a 3-question quiz" loop, ordered by the spec's
// FREQUENCY PRIORITY: greetings, questions, family, food, shopping,
// directions, routines, work, friends, travel, opinions, storytelling,
// argumentation, abstract topics.
export const ROADMAP_UNITS = [
  { id: "r01", title: "Saludos", subtitle: "Greetings", level: "novice-low", icon: "👋",
    sentences: [
      { es: "Hola, ¿qué tal?", en: "Hi, how's it going?" },
      { es: "Buenos días. Me llamo Diego.", en: "Good morning. My name is Diego." },
      { es: "Mucho gusto.", en: "Nice to meet you." },
      { es: "¿Cómo estás? — Bien, gracias, ¿y tú?", en: "How are you? — Fine, thanks, and you?" },
      { es: "Nos vemos, ¡hasta luego!", en: "See you, bye for now!" }
    ] },
  { id: "r02", title: "Preguntas básicas", subtitle: "Basic questions", level: "novice-low", icon: "❓",
    sentences: [
      { es: "¿Cómo te llamas?", en: "What's your name?" },
      { es: "¿De dónde eres?", en: "Where are you from?" },
      { es: "Soy de Estados Unidos.", en: "I'm from the United States." },
      { es: "¿Qué edad tienes?", en: "How old are you?" },
      { es: "Tengo veinticinco años.", en: "I'm 25 years old." }
    ] },
  { id: "r03", title: "La familia", subtitle: "Family", level: "novice-low", icon: "👪",
    sentences: [
      { es: "¿Cuántas personas hay en tu familia?", en: "How many people are in your family?" },
      { es: "Somos cinco: mis papás, mis dos hermanos y yo.", en: "We're five: my parents, my two siblings, and me." },
      { es: "Mi papá es maestro y mi mamá es doctora.", en: "My dad is a teacher and my mom is a doctor." },
      { es: "¿Tienes hermanos?", en: "Do you have siblings?" },
      { es: "Soy hija única.", en: "I'm an only child (female)." }
    ] },
  { id: "r04", title: "Números y fechas", subtitle: "Numbers & dates", level: "novice-low", icon: "🔢",
    sentences: [
      { es: "¿Qué día es hoy?", en: "What day is today?" },
      { es: "Hoy es martes, diez de marzo.", en: "Today is Tuesday, March 10th." },
      { es: "Mi cumpleaños es el quince de junio.", en: "My birthday is June 15th." },
      { es: "Hay treinta días en abril.", en: "There are 30 days in April." },
      { es: "El próximo año voy a cumplir veintiséis.", en: "Next year I'll turn 26." }
    ] },
  { id: "r05", title: "Comida", subtitle: "Food", level: "novice-mid", icon: "🌮",
    sentences: [
      { es: "Tengo hambre, ¿comemos algo?", en: "I'm hungry, should we eat something?" },
      { es: "Quiero unos tacos al pastor, por favor.", en: "I want some tacos al pastor, please." },
      { es: "¿Qué me recomienda?", en: "What do you recommend?" },
      { es: "Me encanta la comida picante.", en: "I love spicy food." },
      { es: "La cuenta, por favor.", en: "The check, please." }
    ] },
  { id: "r06", title: "Gustos y preferencias", subtitle: "Likes & dislikes", level: "novice-mid", icon: "❤️",
    sentences: [
      { es: "Me gusta mucho el fútbol.", en: "I really like soccer." },
      { es: "No me gusta nada levantarme temprano.", en: "I really don't like getting up early." },
      { es: "Me encantan las películas de terror.", en: "I love horror movies." },
      { es: "Prefiero el café sobre el té.", en: "I prefer coffee over tea." },
      { es: "¿Qué tipo de música te gusta?", en: "What kind of music do you like?" }
    ] },
  { id: "r07", title: "De compras", subtitle: "Shopping", level: "novice-mid", icon: "🛍️",
    sentences: [
      { es: "¿Cuánto cuesta esta camisa?", en: "How much does this shirt cost?" },
      { es: "¿Tiene esto en talla mediana?", en: "Do you have this in medium?" },
      { es: "Es un poco caro, ¿hay descuento?", en: "It's a bit expensive, is there a discount?" },
      { es: "Voy a llevar dos, por favor.", en: "I'll take two, please." },
      { es: "¿Aceptan tarjeta?", en: "Do you accept cards?" }
    ] },
  { id: "r08", title: "Rutina diaria", subtitle: "Daily routine", level: "novice-high", icon: "⏰",
    sentences: [
      { es: "Normalmente me despierto a las seis y media.", en: "I normally wake up at 6:30." },
      { es: "Me baño, desayuno y salgo para el trabajo.", en: "I shower, eat breakfast, and head out to work." },
      { es: "Los fines de semana duermo hasta tarde.", en: "On weekends I sleep in." },
      { es: "Después del trabajo, hago ejercicio.", en: "After work, I exercise." },
      { es: "Me acuesto como a las once de la noche.", en: "I go to bed around 11pm." }
    ] },
  { id: "r09", title: "Direcciones", subtitle: "Directions", level: "novice-high", icon: "🧭",
    sentences: [
      { es: "Disculpe, ¿cómo llego al centro?", en: "Excuse me, how do I get downtown?" },
      { es: "Siga derecho dos cuadras y doble a la izquierda.", en: "Go straight two blocks and turn left." },
      { es: "Está bastante cerca, a diez minutos caminando.", en: "It's pretty close, a 10-minute walk." },
      { es: "¿Hay una parada de camión por aquí?", en: "Is there a bus stop around here?" },
      { es: "Se me perdió el camino, ¿me puede ayudar?", en: "I got lost, can you help me?" }
    ] },
  { id: "r10", title: "El trabajo", subtitle: "Work", level: "intermediate-low", icon: "💼",
    sentences: [
      { es: "¿A qué te dedicas?", en: "What do you do for work?" },
      { es: "Trabajo en una oficina de contabilidad.", en: "I work in an accounting office." },
      { es: "Llevo tres años en esta empresa.", en: "I've been at this company for three years." },
      { es: "Mi jefe es bastante exigente pero justo.", en: "My boss is pretty demanding but fair." },
      { es: "El mes pasado me dieron un aumento.", en: "Last month I got a raise." }
    ] },
  { id: "r11", title: "Amistades", subtitle: "Friends", level: "intermediate-low", icon: "🤝",
    sentences: [
      { es: "Mi mejor amiga y yo nos conocimos en la universidad.", en: "My best friend and I met in college." },
      { es: "Nos juntamos casi todos los fines de semana.", en: "We get together almost every weekend." },
      { es: "Ella siempre me hace reír muchísimo.", en: "She always makes me laugh a lot." },
      { es: "Hace tiempo que no veo a mis amigos de la prepa.", en: "I haven't seen my high school friends in a while." },
      { es: "¿Cómo se conocieron ustedes dos?", en: "How did you two meet?" }
    ] },
  { id: "r12", title: "Viajes", subtitle: "Travel", level: "intermediate-mid", icon: "✈️",
    sentences: [
      { es: "El verano pasado viajé a Oaxaca con mi familia.", en: "Last summer I traveled to Oaxaca with my family." },
      { es: "Nos quedamos en un hotel cerca del centro.", en: "We stayed at a hotel near downtown." },
      { es: "Lo que más me gustó fue la comida callejera.", en: "What I liked most was the street food." },
      { es: "Perdimos el vuelo de regreso por el tráfico.", en: "We missed our return flight because of traffic." },
      { es: "Para la próxima, quiero conocer Guanajuato.", en: "Next time, I want to visit Guanajuato." }
    ] },
  { id: "r13", title: "Opiniones", subtitle: "Opinions", level: "intermediate-mid", icon: "💬",
    sentences: [
      { es: "En mi opinión, deberíamos cuidar más el medio ambiente.", en: "In my opinion, we should take better care of the environment." },
      { es: "No estoy de acuerdo con esa idea, para nada.", en: "I don't agree with that idea, at all." },
      { es: "Depende del caso, la verdad.", en: "It depends on the situation, honestly." },
      { es: "Creo que tiene razón en parte.", en: "I think they're partly right." },
      { es: "Desde mi punto de vista, es complicado.", en: "From my point of view, it's complicated." }
    ] },
  { id: "r14", title: "Situaciones inesperadas", subtitle: "Unexpected situations", level: "intermediate-high", icon: "⚠️",
    sentences: [
      { es: "Se me descompuso el carro a mitad del camino.", en: "My car broke down halfway there." },
      { es: "No sabía qué hacer, así que llamé a una grúa.", en: "I didn't know what to do, so I called a tow truck." },
      { es: "Al final todo se resolvió, aunque llegué tarde.", en: "In the end everything got resolved, even though I arrived late." },
      { es: "Si hubiera salido antes, no habría pasado nada.", en: "If I had left earlier, nothing would have happened." },
      { es: "Fue una experiencia estresante, pero aprendí bastante.", en: "It was a stressful experience, but I learned a lot." }
    ] },
  { id: "r15", title: "Narración y descripción", subtitle: "Storytelling", level: "advanced-low", icon: "📖",
    sentences: [
      { es: "Cuando era niño, pasaba los veranos en el rancho de mis abuelos.", en: "When I was a kid, I used to spend summers at my grandparents' ranch." },
      { es: "Recuerdo que siempre nos levantábamos temprano para ordeñar las vacas.", en: "I remember we always got up early to milk the cows." },
      { es: "Un día se soltó una tormenta enorme y tuvimos que refugiarnos en el granero.", en: "One day a huge storm broke out and we had to take shelter in the barn." },
      { es: "Esa experiencia me marcó porque entendí lo duro que era ese trabajo.", en: "That experience shaped me because I understood how hard that work was." },
      { es: "Hoy en día, cada vez que llueve fuerte, me acuerdo de esa tarde.", en: "Nowadays, whenever it rains hard, I remember that afternoon." }
    ] },
  { id: "r16", title: "Argumentación y temas abstractos", subtitle: "Argumentation & abstract topics", level: "advanced-low", icon: "🧠",
    sentences: [
      { es: "El principal problema con ese plan es que no toma en cuenta el impacto a largo plazo.", en: "The main problem with that plan is that it doesn't account for the long-term impact." },
      { es: "Por un lado, genera empleos; por otro, contamina bastante.", en: "On one hand, it creates jobs; on the other, it pollutes quite a bit." },
      { es: "Aunque entiendo el punto de vista económico, creo que hay alternativas más sostenibles.", en: "Although I understand the economic point of view, I think there are more sustainable alternatives." },
      { es: "Si se hubiera invertido antes en tecnología limpia, la situación sería distinta.", en: "If clean technology had been invested in earlier, the situation would be different." },
      { es: "En resumen, el tema es más complejo de lo que parece a primera vista.", en: "In short, the issue is more complex than it seems at first glance." }
    ] }
];
