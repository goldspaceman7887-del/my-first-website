// ACTFL PROFICIENCY TRACKING + Duolingo-style ROADMAP.
//
// The 7 sub-levels this app trains toward, Novice Low through Advanced Low,
// each with the Can-Do statements from the tutor spec.
//
// ROADMAP_UNITS is the path: units unlock in order, and every single unit —
// at every level — ends in a 10-question quiz played with hearts (stakes).
// Each unit ships 8 example sentences, a grammar note taught the spec's way
// (meaning → example → conversation → pattern → rule, never theory first),
// and a targeted drill. Novice units teach single useful sentences;
// Advanced units use longer multi-clause sentences reflecting the
// paragraph-length discourse ACTFL expects at that range.
//
// All Spanish here is modern, everyday Mexican Spanish.

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
    blurb: "Connected sentences on personal topics; can narrate, and handle a complication.",
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

export const ROADMAP_UNITS = [
  // ================= NOVICE LOW =================
  { id: "r01", title: "Saludos", subtitle: "Greetings", level: "novice-low", icon: "👋",
    sentences: [
      { es: "Hola, ¿qué tal?", en: "Hi, how's it going?" },
      { es: "Buenos días, señora.", en: "Good morning, ma'am." },
      { es: "Buenas tardes, ¿cómo está?", en: "Good afternoon, how are you?" },
      { es: "¿Qué onda? Todo bien.", en: "What's up? All good." },
      { es: "Mucho gusto.", en: "Nice to meet you." },
      { es: "Bien, gracias, ¿y tú?", en: "Fine, thanks, and you?" },
      { es: "Nos vemos, ¡hasta luego!", en: "See you, bye for now!" },
      { es: "Buenas noches, que descanses.", en: "Good night, rest well." }
    ],
    grammar: { title: "Greetings change with the time of day", pattern: "Buenos días / Buenas tardes / Buenas noches",
      explain: "Spanish picks the greeting by time of day, not by formality. Días is masculine plural (buenos), while tardes and noches are feminine plural (buenas) — that's why the ending flips.",
      examples: [{ es: "Buenos días, maestro.", en: "Good morning, teacher." }, { es: "Buenas noches a todos.", en: "Good night, everyone." }],
      commonMistake: "Don't say 'buenos tardes' — tardes is feminine, so it must be 'buenas tardes'." },
    drill: { question: "Which greeting is correct for the afternoon?", options: ["Buenas tardes", "Buenos tardes", "Buenas días"], answer: "Buenas tardes" } },

  { id: "r02", title: "Presentarse", subtitle: "Introducing yourself", level: "novice-low", icon: "🙋",
    sentences: [
      { es: "¿Cómo te llamas?", en: "What's your name?" },
      { es: "Me llamo Diego.", en: "My name is Diego." },
      { es: "¿De dónde eres?", en: "Where are you from?" },
      { es: "Soy de Estados Unidos.", en: "I'm from the United States." },
      { es: "Vivo en la Ciudad de México.", en: "I live in Mexico City." },
      { es: "Soy estudiante.", en: "I'm a student." },
      { es: "¿Cómo se llama usted?", en: "What's your name? (formal)" },
      { es: "Encantado de conocerte.", en: "Delighted to meet you." }
    ],
    grammar: { title: "llamarse for names", pattern: "me llamo / te llamas / se llama + name",
      explain: "Literally 'I call myself.' It's a reflexive verb, so the pronoun changes with the person: me llamo, te llamas, se llama. Use se llama with usted for politeness.",
      examples: [{ es: "Me llamo Ana.", en: "My name is Ana." }, { es: "¿Cómo se llama su hijo?", en: "What's your son's name?" }],
      commonMistake: "Don't say 'mi nombre es' in casual speech — it's understood but sounds stiff. 'Me llamo' is what people actually say." },
    drill: { question: "How do you ask a stranger's name politely?", options: ["¿Cómo se llama usted?", "¿Cómo te llamas?", "¿Qué es tu nombre?"], answer: "¿Cómo se llama usted?" } },

  { id: "r03", title: "Números y edad", subtitle: "Numbers & age", level: "novice-low", icon: "🔢",
    sentences: [
      { es: "Uno, dos, tres, cuatro, cinco.", en: "One, two, three, four, five." },
      { es: "Seis, siete, ocho, nueve, diez.", en: "Six, seven, eight, nine, ten." },
      { es: "¿Cuántos años tienes?", en: "How old are you?" },
      { es: "Tengo veinticinco años.", en: "I'm 25 years old." },
      { es: "Mi hermana tiene doce años.", en: "My sister is 12 years old." },
      { es: "Somos cuatro en mi familia.", en: "There are four of us in my family." },
      { es: "Cuesta cincuenta pesos.", en: "It costs 50 pesos." },
      { es: "Hay veinte estudiantes en la clase.", en: "There are 20 students in the class." }
    ],
    grammar: { title: "tener for age", pattern: "Subject + tener + number + años",
      explain: "Spanish says you 'have' years, not that you 'are' a number. So 'I am 25' becomes 'Tengo veinticinco años' — and años is never dropped.",
      examples: [{ es: "Tengo treinta años.", en: "I'm 30." }, { es: "¿Cuántos años tiene tu papá?", en: "How old is your dad?" }],
      commonMistake: "Never say 'Soy veinticinco' — that's a direct translation of English and sounds wrong. Use tener, and don't drop 'años'." },
    drill: { question: "How do you say 'I am 25 years old'?", options: ["Tengo veinticinco años", "Soy veinticinco años", "Estoy veinticinco"], answer: "Tengo veinticinco años" } },

  { id: "r04", title: "La familia", subtitle: "Family", level: "novice-low", icon: "👪",
    sentences: [
      { es: "Esta es mi mamá.", en: "This is my mom." },
      { es: "Él es mi papá.", en: "He is my dad." },
      { es: "Tengo dos hermanos.", en: "I have two siblings." },
      { es: "Mi hermana es maestra.", en: "My sister is a teacher." },
      { es: "¿Tienes hermanos?", en: "Do you have siblings?" },
      { es: "Soy hijo único.", en: "I'm an only child." },
      { es: "Mis abuelos viven en Puebla.", en: "My grandparents live in Puebla." },
      { es: "Mi familia es muy unida.", en: "My family is very close-knit." }
    ],
    grammar: { title: "mi / mis for possession", pattern: "mi + singular noun · mis + plural noun",
      explain: "Possessives agree with the thing owned, not the owner. One sibling is 'mi hermano'; several are 'mis hermanos' — the -s moves onto mi.",
      examples: [{ es: "mi hermano / mis hermanos", en: "my brother / my brothers" }, { es: "mi abuela / mis abuelos", en: "my grandma / my grandparents" }],
      commonMistake: "Don't use 'mis' with a singular noun — 'mis hermano' is wrong; it's 'mi hermano'." },
    drill: { question: "Which is correct for 'my grandparents'?", options: ["mis abuelos", "mi abuelos", "mío abuelos"], answer: "mis abuelos" } },

  { id: "r05", title: "Colores y objetos", subtitle: "Colors & common objects", level: "novice-low", icon: "🎨",
    sentences: [
      { es: "El libro es rojo.", en: "The book is red." },
      { es: "La mesa es blanca.", en: "The table is white." },
      { es: "Quiero la camisa azul.", en: "I want the blue shirt." },
      { es: "¿De qué color es tu carro?", en: "What color is your car?" },
      { es: "Mi mochila es negra.", en: "My backpack is black." },
      { es: "Necesito una silla.", en: "I need a chair." },
      { es: "¿Dónde está mi teléfono?", en: "Where is my phone?" },
      { es: "Las flores son amarillas.", en: "The flowers are yellow." }
    ],
    grammar: { title: "Adjectives agree with the noun", pattern: "noun + adjective (matching gender & number)",
      explain: "Colors come after the noun and change ending to match it: rojo/roja, blanco/blanca, and add -s for plural. Colors ending in -e or a consonant (verde, azul) don't change for gender, only number.",
      examples: [{ es: "el carro rojo / la casa roja", en: "the red car / the red house" }, { es: "los libros azules", en: "the blue books" }],
      commonMistake: "Don't put the color before the noun — 'la roja casa' is wrong; Spanish says 'la casa roja'." },
    drill: { question: "Which is correct for 'the white table'?", options: ["la mesa blanca", "la mesa blanco", "la blanca mesa"], answer: "la mesa blanca" } },

  { id: "r06", title: "Días y fechas", subtitle: "Days & dates", level: "novice-low", icon: "📅",
    sentences: [
      { es: "Hoy es lunes.", en: "Today is Monday." },
      { es: "Mañana es martes.", en: "Tomorrow is Tuesday." },
      { es: "¿Qué día es hoy?", en: "What day is today?" },
      { es: "El sábado voy al mercado.", en: "On Saturday I go to the market." },
      { es: "Mi cumpleaños es el quince de junio.", en: "My birthday is June 15th." },
      { es: "Los domingos como con mi familia.", en: "On Sundays I eat with my family." },
      { es: "La clase es el miércoles.", en: "The class is on Wednesday." },
      { es: "Nos vemos el viernes.", en: "See you on Friday." }
    ],
    grammar: { title: "el + day = 'on' that day", pattern: "el lunes (this Monday) · los lunes (every Monday)",
      explain: "Spanish uses the article instead of a word for 'on.' Singular 'el viernes' means this coming Friday; plural 'los viernes' means Fridays in general, as a habit.",
      examples: [{ es: "El jueves tengo examen.", en: "On Thursday I have an exam." }, { es: "Los jueves tengo clase.", en: "On Thursdays I have class." }],
      commonMistake: "Don't add 'en' before the day — 'en lunes' is wrong. Just say 'el lunes'." },
    drill: { question: "How do you say 'on Mondays' (every Monday)?", options: ["los lunes", "el lunes", "en lunes"], answer: "los lunes" } },

  // ================= NOVICE MID =================
  { id: "r07", title: "Comida", subtitle: "Food", level: "novice-mid", icon: "🌮",
    sentences: [
      { es: "Tengo hambre, ¿comemos algo?", en: "I'm hungry, should we eat something?" },
      { es: "Quiero unos tacos al pastor, por favor.", en: "I want some tacos al pastor, please." },
      { es: "¿Qué me recomienda?", en: "What do you recommend?" },
      { es: "Me encanta la comida picante.", en: "I love spicy food." },
      { es: "Para mí, un agua de horchata.", en: "For me, a horchata drink." },
      { es: "¿Me trae la cuenta, por favor?", en: "Could you bring me the check, please?" },
      { es: "Está bien rico, gracias.", en: "It's really delicious, thank you." },
      { es: "Sin cebolla, por favor.", en: "Without onion, please." }
    ],
    grammar: { title: "querer for ordering", pattern: "quiero / quisiera + noun",
      explain: "'Quiero' (I want) is normal and not rude in Mexico when ordering. 'Quisiera' (I would like) is a softer, more polite version for formal settings.",
      examples: [{ es: "Quiero dos tacos.", en: "I want two tacos." }, { es: "Quisiera ver el menú.", en: "I'd like to see the menu." }],
      commonMistake: "Adding 'por favor' matters more than the verb choice — leaving it off is what actually sounds abrupt." },
    drill: { question: "Which is the softer, more polite way to order?", options: ["Quisiera un café", "Quiero un café", "Dame un café"], answer: "Quisiera un café" } },

  { id: "r08", title: "Gustos", subtitle: "Likes & dislikes", level: "novice-mid", icon: "❤️",
    sentences: [
      { es: "Me gusta el fútbol.", en: "I like soccer." },
      { es: "Me gustan las películas de terror.", en: "I like horror movies." },
      { es: "No me gusta levantarme temprano.", en: "I don't like getting up early." },
      { es: "Me encanta la música en vivo.", en: "I love live music." },
      { es: "¿Te gusta bailar?", en: "Do you like dancing?" },
      { es: "A mi hermano le gusta cocinar.", en: "My brother likes to cook." },
      { es: "Prefiero el café sobre el té.", en: "I prefer coffee over tea." },
      { es: "No me gustan nada las arañas.", en: "I don't like spiders at all." }
    ],
    grammar: { title: "gustar works backwards", pattern: "me/te/le + gusta (singular) / gustan (plural)",
      explain: "Gustar means 'to be pleasing to.' The thing liked is the subject, so the verb agrees with IT, not with you: 'me gusta el café' but 'me gustan los tacos.' A verb after gustar always stays singular.",
      examples: [{ es: "Me gusta el libro.", en: "I like the book." }, { es: "Me gustan los libros.", en: "I like the books." }],
      commonMistake: "Never say 'yo gusto' — that would mean 'I am pleasing to someone.' Use 'me gusta.'" },
    drill: { question: "Which is correct for 'I like tacos'?", options: ["Me gustan los tacos", "Me gusta los tacos", "Yo gusto tacos"], answer: "Me gustan los tacos" } },

  { id: "r09", title: "De compras", subtitle: "Shopping", level: "novice-mid", icon: "🛍️",
    sentences: [
      { es: "¿Cuánto cuesta esta camisa?", en: "How much does this shirt cost?" },
      { es: "¿Tiene esto en talla mediana?", en: "Do you have this in medium?" },
      { es: "Es un poco caro.", en: "It's a bit expensive." },
      { es: "¿Hay descuento?", en: "Is there a discount?" },
      { es: "Me lo llevo, gracias.", en: "I'll take it, thanks." },
      { es: "¿Aceptan tarjeta?", en: "Do you accept cards?" },
      { es: "¿Me lo puedo probar?", en: "Can I try it on?" },
      { es: "Solo estoy viendo, gracias.", en: "I'm just looking, thanks." }
    ],
    grammar: { title: "este / esta / esto", pattern: "este + masculine · esta + feminine · esto = 'this thing'",
      explain: "Use este/esta directly before a noun, matching its gender. Use esto alone when you don't name the thing — pointing at something unidentified.",
      examples: [{ es: "este suéter / esta camisa", en: "this sweater / this shirt" }, { es: "¿Cuánto cuesta esto?", en: "How much does this cost?" }],
      commonMistake: "Don't say 'esto camisa' — before a noun you need esta (feminine) or este (masculine)." },
    drill: { question: "Which is correct for 'this shirt' (la camisa)?", options: ["esta camisa", "este camisa", "esto camisa"], answer: "esta camisa" } },

  { id: "r10", title: "La hora", subtitle: "Telling time", level: "novice-mid", icon: "🕐",
    sentences: [
      { es: "¿Qué hora es?", en: "What time is it?" },
      { es: "Son las tres de la tarde.", en: "It's 3 in the afternoon." },
      { es: "Es la una en punto.", en: "It's one o'clock sharp." },
      { es: "Son las ocho y media.", en: "It's 8:30." },
      { es: "La junta es a las diez.", en: "The meeting is at 10." },
      { es: "Llego como a las seis.", en: "I arrive around 6." },
      { es: "Son las nueve y cuarto.", en: "It's 9:15." },
      { es: "¿A qué hora empieza?", en: "What time does it start?" }
    ],
    grammar: { title: "ser for time, and es vs. son", pattern: "Es la una · Son las dos/tres/...",
      explain: "Time uses ser, and it agrees with the hour: only one o'clock is singular ('es la una'); every other hour is plural ('son las dos'). Use 'a las' to say AT what time something happens.",
      examples: [{ es: "Son las cinco.", en: "It's five o'clock." }, { es: "Nos vemos a las cinco.", en: "See you at five." }],
      commonMistake: "Don't say 'son las una' — one o'clock is the one singular hour: 'es la una.'" },
    drill: { question: "Which is correct for 'It's one o'clock'?", options: ["Es la una", "Son la una", "Son las una"], answer: "Es la una" } },

  // ================= NOVICE HIGH =================
  { id: "r11", title: "Rutina diaria", subtitle: "Daily routine", level: "novice-high", icon: "⏰",
    sentences: [
      { es: "Normalmente me despierto a las seis y media.", en: "I normally wake up at 6:30." },
      { es: "Me baño y desayuno rápido.", en: "I shower and eat breakfast quickly." },
      { es: "Salgo para el trabajo a las ocho.", en: "I leave for work at 8." },
      { es: "Como con mis compañeros a la una.", en: "I eat lunch with my coworkers at 1." },
      { es: "Después del trabajo, hago ejercicio.", en: "After work, I exercise." },
      { es: "En la noche veo series o leo.", en: "At night I watch shows or read." },
      { es: "Me acuesto como a las once.", en: "I go to bed around 11." },
      { es: "Los fines de semana duermo hasta tarde.", en: "On weekends I sleep in." }
    ],
    grammar: { title: "Reflexive verbs for routines", pattern: "me + verb (levantarse, bañarse, acostarse)",
      explain: "Daily-routine verbs are reflexive in Spanish even when English uses no extra word. 'I wake up' = 'me despierto'; the 'me' is required, and it changes with the person (me/te/se/nos).",
      examples: [{ es: "Me levanto temprano.", en: "I get up early." }, { es: "Se acuesta tarde.", en: "He/she goes to bed late." }],
      commonMistake: "Dropping the pronoun changes the meaning — 'despierto a mi hermano' means you wake up your BROTHER, not yourself." },
    drill: { question: "Which correctly says 'I go to bed at 11'?", options: ["Me acuesto a las once", "Acuesto a las once", "Me acuesto las once"], answer: "Me acuesto a las once" } },

  { id: "r12", title: "Direcciones", subtitle: "Directions & transport", level: "novice-high", icon: "🧭",
    sentences: [
      { es: "Disculpe, ¿cómo llego al centro?", en: "Excuse me, how do I get downtown?" },
      { es: "Siga derecho dos cuadras.", en: "Go straight two blocks." },
      { es: "Doble a la izquierda en la esquina.", en: "Turn left at the corner." },
      { es: "Está a diez minutos caminando.", en: "It's a 10-minute walk." },
      { es: "¿Hay una parada de camión por aquí?", en: "Is there a bus stop around here?" },
      { es: "Voy a pedir un taxi.", en: "I'm going to get a taxi." },
      { es: "Creo que me perdí.", en: "I think I got lost." },
      { es: "Está enfrente del banco.", en: "It's across from the bank." }
    ],
    grammar: { title: "Formal (usted) commands", pattern: "-ar → -e · -er/-ir → -a",
      explain: "Directions from strangers come as usted commands, which flip the vowel: doblar → doble, seguir → siga. You'll hear these constantly from shopkeepers, police, and passersby.",
      examples: [{ es: "Doble a la derecha.", en: "Turn right." }, { es: "Tome la segunda calle.", en: "Take the second street." }],
      commonMistake: "'Derecho' means straight ahead; 'derecha' means the right side. Mixing them sends you the wrong way." },
    drill: { question: "Which word means 'straight ahead'?", options: ["derecho", "derecha", "izquierda"], answer: "derecho" } },

  { id: "r13", title: "Planes", subtitle: "Talking about plans", level: "novice-high", icon: "🗓️",
    sentences: [
      { es: "Voy a viajar el próximo mes.", en: "I'm going to travel next month." },
      { es: "¿Qué vas a hacer este fin de semana?", en: "What are you going to do this weekend?" },
      { es: "Vamos a ver una película.", en: "We're going to watch a movie." },
      { es: "Pienso estudiar más este año.", en: "I'm planning to study more this year." },
      { es: "Tengo ganas de salir a caminar.", en: "I feel like going out for a walk." },
      { es: "Quizá vaya a la fiesta.", en: "Maybe I'll go to the party." },
      { es: "El sábado voy a visitar a mi abuela.", en: "On Saturday I'm going to visit my grandma." },
      { es: "Todavía no tengo planes.", en: "I don't have plans yet." }
    ],
    grammar: { title: "The 'going to' future", pattern: "ir + a + infinitive",
      explain: "The easiest future in Spanish: conjugate ir (voy, vas, va, vamos, van), add 'a', then the plain verb. This is what people actually use in speech far more than the formal future tense.",
      examples: [{ es: "Voy a comer.", en: "I'm going to eat." }, { es: "Vamos a salir.", en: "We're going to go out." }],
      commonMistake: "Don't drop the 'a' — 'voy comer' is wrong. It's always 'voy a comer.'" },
    drill: { question: "Which correctly says 'We're going to travel'?", options: ["Vamos a viajar", "Vamos viajar", "Vamos a viajamos"], answer: "Vamos a viajar" } },

  { id: "r14", title: "El clima", subtitle: "Weather & seasons", level: "novice-high", icon: "🌤️",
    sentences: [
      { es: "¿Cómo está el clima hoy?", en: "How's the weather today?" },
      { es: "Hace mucho calor.", en: "It's very hot." },
      { es: "Hace frío en la mañana.", en: "It's cold in the morning." },
      { es: "Está lloviendo bien fuerte.", en: "It's raining really hard." },
      { es: "Hoy está nublado.", en: "It's cloudy today." },
      { es: "En verano hace muchísimo calor.", en: "In summer it's extremely hot." },
      { es: "Va a llover en la tarde.", en: "It's going to rain in the afternoon." },
      { es: "Me gusta el clima de primavera.", en: "I like spring weather." }
    ],
    grammar: { title: "hacer vs. estar for weather", pattern: "hace + noun (calor/frío) · está + adjective (nublado)",
      explain: "Spanish uses hacer with weather nouns — literally 'it makes heat' — so it's 'hace calor,' not 'es caliente.' Use estar for conditions described with adjectives or -ando forms.",
      examples: [{ es: "Hace viento.", en: "It's windy." }, { es: "Está nublado.", en: "It's cloudy." }],
      commonMistake: "'Estoy caliente' does NOT mean 'I'm hot' from the weather — it has a sexual meaning. Say 'tengo calor' instead." },
    drill: { question: "How do you say 'It's very hot' (weather)?", options: ["Hace mucho calor", "Es muy caliente", "Estoy caliente"], answer: "Hace mucho calor" } },

  // ================= INTERMEDIATE LOW =================
  { id: "r15", title: "El trabajo", subtitle: "Work", level: "intermediate-low", icon: "💼",
    sentences: [
      { es: "¿A qué te dedicas?", en: "What do you do for work?" },
      { es: "Trabajo en una oficina de contabilidad.", en: "I work in an accounting office." },
      { es: "Llevo tres años en esta empresa.", en: "I've been at this company for three years." },
      { es: "Mi jefe es exigente pero justo.", en: "My boss is demanding but fair." },
      { es: "Tengo junta a las diez.", en: "I have a meeting at 10." },
      { es: "Me gusta mi trabajo aunque es estresante.", en: "I like my job even though it's stressful." },
      { es: "El mes pasado me dieron un aumento.", en: "Last month I got a raise." },
      { es: "Estoy buscando algo mejor.", en: "I'm looking for something better." }
    ],
    grammar: { title: "llevar + time + gerund", pattern: "llevar + time + -ando/-iendo",
      explain: "To say how long you've been doing something, Spanish uses llevar, not 'have been.' 'Llevo tres años trabajando aquí' = 'I've been working here three years.' You can also drop the gerund: 'llevo tres años aquí.'",
      examples: [{ es: "Llevo dos horas esperando.", en: "I've been waiting two hours." }, { es: "Lleva cinco años en México.", en: "He's been in Mexico five years." }],
      commonMistake: "Don't translate literally with 'he estado por' — it's understood but sounds foreign. Native speakers reach for llevar." },
    drill: { question: "Which says 'I've been waiting two hours'?", options: ["Llevo dos horas esperando", "Estoy dos horas esperando", "Tengo dos horas espero"], answer: "Llevo dos horas esperando" } },

  { id: "r16", title: "Amistades", subtitle: "Friends & experiences", level: "intermediate-low", icon: "🤝",
    sentences: [
      { es: "Mi mejor amiga y yo nos conocimos en la universidad.", en: "My best friend and I met in college." },
      { es: "Nos juntamos casi todos los fines de semana.", en: "We get together almost every weekend." },
      { es: "Ella siempre me hace reír muchísimo.", en: "She always makes me laugh a lot." },
      { es: "Hace tiempo que no veo a mis amigos de la prepa.", en: "I haven't seen my high school friends in a while." },
      { es: "Nos llevamos súper bien.", en: "We get along really well." },
      { es: "¿Cómo se conocieron ustedes dos?", en: "How did you two meet?" },
      { es: "Le tengo mucha confianza.", en: "I trust them a lot." },
      { es: "Ayer salimos a cenar juntos.", en: "Yesterday we went out to dinner together." }
    ],
    grammar: { title: "Reciprocal 'each other'", pattern: "nos / se + plural verb",
      explain: "To say people do something to each other, Spanish reuses the reflexive pronoun with a plural subject: 'nos conocimos' = we met each other; 'se llevan bien' = they get along with each other.",
      examples: [{ es: "Nos vemos seguido.", en: "We see each other often." }, { es: "Se ayudan mucho.", en: "They help each other a lot." }],
      commonMistake: "Don't add 'el uno al otro' by default — the pronoun already carries the 'each other' meaning." },
    drill: { question: "Which says 'we met each other in college'?", options: ["Nos conocimos en la universidad", "Conocimos en la universidad", "Nos conocemos la universidad"], answer: "Nos conocimos en la universidad" } },

  // ================= INTERMEDIATE MID =================
  { id: "r17", title: "Viajes", subtitle: "Travel & past narration", level: "intermediate-mid", icon: "✈️",
    sentences: [
      { es: "El verano pasado viajé a Oaxaca con mi familia.", en: "Last summer I traveled to Oaxaca with my family." },
      { es: "Nos quedamos en un hotel cerca del centro.", en: "We stayed at a hotel near downtown." },
      { es: "Lo que más me gustó fue la comida callejera.", en: "What I liked most was the street food." },
      { es: "Visitamos Monte Albán y tomamos muchas fotos.", en: "We visited Monte Albán and took a lot of photos." },
      { es: "Perdimos el vuelo de regreso por el tráfico.", en: "We missed our return flight because of traffic." },
      { es: "Fue un viaje inolvidable.", en: "It was an unforgettable trip." },
      { es: "Para la próxima, quiero conocer Guanajuato.", en: "Next time, I want to visit Guanajuato." },
      { es: "Nunca había probado el mole así.", en: "I had never tried mole like that." }
    ],
    grammar: { title: "Preterite for completed past events", pattern: "-é / -aste / -ó (ar) · -í / -iste / -ió (er, ir)",
      explain: "The preterite reports finished actions with a clear endpoint — the backbone of telling what happened on a trip. Time markers like 'el verano pasado' and 'ayer' signal it.",
      examples: [{ es: "Viajé a Oaxaca.", en: "I traveled to Oaxaca." }, { es: "Comimos en el mercado.", en: "We ate at the market." }],
      commonMistake: "Watch the accent: 'viajo' means 'I travel' (now), but 'viajó' means 'he/she traveled.' The written accent changes both person and tense." },
    drill: { question: "Which is the preterite for 'we visited'?", options: ["visitamos", "visitábamos", "visitaremos"], answer: "visitamos" } },

  { id: "r18", title: "Opiniones", subtitle: "Opinions", level: "intermediate-mid", icon: "💬",
    sentences: [
      { es: "En mi opinión, deberíamos cuidar más el medio ambiente.", en: "In my opinion, we should take better care of the environment." },
      { es: "No estoy de acuerdo con esa idea, para nada.", en: "I don't agree with that idea, at all." },
      { es: "Depende del caso, la verdad.", en: "It depends on the situation, honestly." },
      { es: "Creo que tiene razón en parte.", en: "I think they're partly right." },
      { es: "Desde mi punto de vista, es complicado.", en: "From my point of view, it's complicated." },
      { es: "Me parece que exageran un poco.", en: "It seems to me they're exaggerating a bit." },
      { es: "Estoy totalmente de acuerdo contigo.", en: "I totally agree with you." },
      { es: "Habría que pensarlo mejor.", en: "We'd have to think it through more." }
    ],
    grammar: { title: "Softening an opinion", pattern: "creo que / me parece que / se me hace que + indicative",
      explain: "Mexican Spanish softens opinions constantly. 'Creo que' and 'me parece que' in the affirmative take the normal indicative — the subjunctive only shows up once you negate them ('no creo que sea').",
      examples: [{ es: "Creo que es buena idea.", en: "I think it's a good idea." }, { es: "No creo que sea buena idea.", en: "I don't think it's a good idea." }],
      commonMistake: "Stating opinions bluntly with no softener can read as aggressive — 'me parece que' does a lot of social work." },
    drill: { question: "Which correctly follows 'No creo que...'?", options: ["No creo que sea justo", "No creo que es justo", "No creo que fue justo"], answer: "No creo que sea justo" } },

  // ================= INTERMEDIATE HIGH =================
  { id: "r19", title: "Imprevistos", subtitle: "Unexpected situations", level: "intermediate-high", icon: "⚠️",
    sentences: [
      { es: "Se me descompuso el carro a mitad del camino.", en: "My car broke down halfway there." },
      { es: "No sabía qué hacer, así que llamé a una grúa.", en: "I didn't know what to do, so I called a tow truck." },
      { es: "Mientras esperaba, empezó a llover.", en: "While I was waiting, it started to rain." },
      { es: "Al final todo se resolvió, aunque llegué tarde.", en: "In the end everything got resolved, though I arrived late." },
      { es: "Si hubiera salido antes, no habría pasado nada.", en: "If I had left earlier, nothing would have happened." },
      { es: "Se me olvidó por completo la cita.", en: "I completely forgot about the appointment." },
      { es: "Fue estresante, pero aprendí bastante.", en: "It was stressful, but I learned a lot." },
      { es: "Por suerte, un vecino me ayudó.", en: "Luckily, a neighbor helped me." }
    ],
    grammar: { title: "Accidental 'se' — it happened TO me", pattern: "se + me/te/le + verb",
      explain: "To show something wasn't your fault, Spanish flips the sentence: 'se me olvidó' = 'it got forgotten on me.' It's the standard way to describe breaking, losing, or forgetting things without assigning blame.",
      examples: [{ es: "Se me perdió la llave.", en: "I lost the key." }, { es: "Se nos acabó el tiempo.", en: "We ran out of time." }],
      commonMistake: "The verb agrees with the THING, not you: 'se me olvidaron las llaves' (plural keys → plural verb)." },
    drill: { question: "Which says 'I forgot the appointment' (accidentally)?", options: ["Se me olvidó la cita", "Yo olvidé se la cita", "Me se olvidó la cita"], answer: "Se me olvidó la cita" } },

  // ================= ADVANCED LOW =================
  { id: "r20", title: "Narración extendida", subtitle: "Extended storytelling", level: "advanced-low", icon: "📖",
    sentences: [
      { es: "Cuando era niño, pasaba los veranos en el rancho de mis abuelos.", en: "When I was a kid, I used to spend summers at my grandparents' ranch." },
      { es: "Nos levantábamos antes de que saliera el sol para ayudar con los animales.", en: "We got up before sunrise to help with the animals." },
      { es: "Un día se soltó una tormenta enorme mientras trabajábamos afuera.", en: "One day a huge storm broke out while we were working outside." },
      { es: "Recuerdo que mi abuelo me enseñó a montar a caballo a los seis años.", en: "I remember my grandfather taught me to ride a horse at six." },
      { es: "Esa experiencia me marcó porque entendí lo duro que era ese trabajo.", en: "That experience shaped me because I understood how hard that work was." },
      { es: "Hoy en día, cada vez que llueve fuerte, me acuerdo de esa tarde.", en: "Nowadays, whenever it rains hard, I remember that afternoon." },
      { es: "Aunque ya no vamos, mi familia sigue hablando de esos veranos.", en: "Although we don't go anymore, my family still talks about those summers." },
      { es: "Si pudiera, regresaría aunque fuera por un fin de semana.", en: "If I could, I'd go back even if just for a weekend." }
    ],
    grammar: { title: "Preterite + imperfect together", pattern: "imperfect = background · preterite = the event that interrupts",
      explain: "Real narration constantly mixes both: the imperfect paints the ongoing scene ('trabajábamos'), and the preterite drops in the single event that broke it ('se soltó'). Controlling this pairing is the core of Advanced-level storytelling.",
      examples: [{ es: "Estaba lloviendo cuando salimos.", en: "It was raining when we left." }, { es: "Dormía cuando sonó el teléfono.", en: "I was sleeping when the phone rang." }],
      commonMistake: "Using only preterite makes a story read like a flat list of events with no scene-setting." },
    drill: { question: "Which correctly mixes background and interrupting event?", options: ["Dormía cuando sonó el teléfono", "Dormí cuando sonaba el teléfono", "Dormía cuando sonaba el teléfono"], answer: "Dormía cuando sonó el teléfono" } },

  { id: "r21", title: "Argumentación", subtitle: "Argument & abstract topics", level: "advanced-low", icon: "🧠",
    sentences: [
      { es: "El problema principal es que no se toma en cuenta el impacto a largo plazo.", en: "The main problem is that the long-term impact isn't taken into account." },
      { es: "Por un lado genera empleos; por otro, contamina bastante.", en: "On one hand it creates jobs; on the other, it pollutes quite a bit." },
      { es: "Aunque entiendo el punto de vista económico, creo que hay alternativas.", en: "Although I understand the economic point of view, I think there are alternatives." },
      { es: "Si se hubiera invertido antes en tecnología limpia, la situación sería distinta.", en: "If clean technology had been invested in earlier, the situation would be different." },
      { es: "Habría que considerar también a las comunidades afectadas.", en: "We'd also have to consider the affected communities." },
      { es: "No se trata solo de dinero, sino de calidad de vida.", en: "It's not just about money, but about quality of life." },
      { es: "En resumen, el tema es más complejo de lo que parece.", en: "In short, the issue is more complex than it seems." },
      { es: "Lo que propongo es buscar un punto intermedio.", en: "What I'm proposing is finding a middle ground." }
    ],
    grammar: { title: "Connectors that build paragraphs", pattern: "por un lado / por otro · aunque · no solo... sino · en resumen",
      explain: "What separates Advanced Low from Intermediate isn't vocabulary — it's connective tissue. These phrases let you hold a position across several sentences, concede a point, and close with a conclusion.",
      examples: [{ es: "No solo es caro, sino lento.", en: "It's not only expensive, but slow." }, { es: "En resumen, no conviene.", en: "In short, it's not worth it." }],
      commonMistake: "'Sino' contradicts a negative ('no A sino B'); 'pero' just adds contrast. They aren't interchangeable." },
    drill: { question: "Which correctly completes 'No es caro, ___ barato'?", options: ["sino", "pero", "aunque"], answer: "sino" } }
];
