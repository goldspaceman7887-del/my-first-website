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
// All Spanish here is modern, everyday PENINSULAR (Spain) Spanish: vosotros
// for informal plural "you", coger for "to take/catch", móvil, ordenador,
// piso, coche, zumo, patata, vale, conducir — never the Latin American forms.

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
      "Order food and drink",
      "Talk about likes and dislikes",
      "Shop for everyday things"
    ]
  },
  {
    code: "novice-high", label: "Novice High", short: "NH",
    blurb: "Simple sentences on familiar topics, with occasional gaps.",
    canDo: [
      "Handle simple daily situations",
      "Describe my routine",
      "Talk about plans",
      "Ask for and give directions"
    ]
  },
  {
    code: "intermediate-low", label: "Intermediate Low", short: "IL",
    blurb: "Create with the language: simple sentences on everyday needs.",
    canDo: [
      "Maintain short conversations",
      "Ask follow-up questions",
      "Talk about work and friendships",
      "Describe my home"
    ]
  },
  {
    code: "intermediate-mid", label: "Intermediate Mid", short: "IM",
    blurb: "Handle simple transactions and everyday situations.",
    canDo: [
      "Narrate a past trip or event",
      "Give and support an opinion",
      "Talk about health",
      "Describe habits and customs"
    ]
  },
  {
    code: "intermediate-high", label: "Intermediate High", short: "IH",
    blurb: "Connected sentences on personal topics; can narrate, and handle a complication.",
    canDo: [
      "Narrate across time frames",
      "Handle an unexpected situation",
      "Give advice",
      "Discuss the environment and the future"
    ]
  },
  {
    code: "advanced-low", label: "Advanced Low", short: "AL",
    blurb: "Paragraph-length discourse: narrate and describe in all major time frames, explain, and defend opinions.",
    canDo: [
      "Narrate and describe in all major time frames",
      "Explain causes and effects",
      "Discuss abstract topics",
      "Defend opinions and handle counterarguments",
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

const RAW_UNITS = [
  {
    "id": "r01",
    "title": "Saludos",
    "subtitle": "Greetings",
    "level": "novice-low",
    "icon": "👋",
    "sentences": [
      {
        "es": "Hola, ¿qué tal?",
        "en": "Hi, how's it going?"
      },
      {
        "es": "Buenos días, ¿cómo estás?",
        "en": "Good morning, how are you?"
      },
      {
        "es": "Buenas tardes, señora García.",
        "en": "Good afternoon, Mrs. García."
      },
      {
        "es": "Buenas noches, que duermas bien.",
        "en": "Good night, sleep well."
      },
      {
        "es": "¿Qué tal estáis, chicos?",
        "en": "How are you all doing, guys?"
      },
      {
        "es": "Muy bien, gracias, ¿y tú?",
        "en": "Very well, thanks, and you?"
      },
      {
        "es": "Encantada de conocerte.",
        "en": "Delighted to meet you."
      },
      {
        "es": "Hasta luego, nos vemos mañana.",
        "en": "See you later, see you tomorrow."
      }
    ],
    "grammar": {
      "title": "Greetings match the time of day",
      "pattern": "Buenos días / Buenas tardes / Buenas noches",
      "explain": "Spanish switches the greeting as the day goes on, not by how formal the situation is. Días is masculine plural, so it takes buenos; tardes and noches are feminine plural, so they take buenas — the adjective is simply agreeing with the noun.",
      "examples": [
        {
          "es": "Buenos días, ¿qué tal la mañana?",
          "en": "Good morning, how's the morning going?"
        },
        {
          "es": "Buenas noches a todos.",
          "en": "Good night, everyone."
        }
      ],
      "commonMistake": "Saying 'buenos tardes' is a common slip — tardes is feminine, so the adjective has to match: buenas tardes."
    },
    "drill": {
      "question": "Which greeting is correct when you run into a friend at 9pm?",
      "options": [
        "Buenas noches",
        "Buenos noches",
        "Buenas tarde"
      ],
      "answer": "Buenas noches"
    }
  },
  {
    "id": "r02",
    "title": "Presentarse",
    "subtitle": "Introducing yourself",
    "level": "novice-low",
    "icon": "🙋",
    "sentences": [
      {
        "es": "¿Cómo te llamas?",
        "en": "What's your name?"
      },
      {
        "es": "Me llamo Marta.",
        "en": "My name is Marta."
      },
      {
        "es": "¿De dónde eres?",
        "en": "Where are you from?"
      },
      {
        "es": "Soy de Sevilla, pero vivo en Madrid.",
        "en": "I'm from Seville, but I live in Madrid."
      },
      {
        "es": "¿A qué te dedicas?",
        "en": "What do you do for a living?"
      },
      {
        "es": "Soy profesor de instituto.",
        "en": "I'm a high school teacher."
      },
      {
        "es": "¿Cómo se llama usted?",
        "en": "What's your name? (formal)"
      },
      {
        "es": "Encantado, igualmente.",
        "en": "Nice to meet you, likewise."
      }
    ],
    "grammar": {
      "title": "llamarse for names",
      "pattern": "me llamo / te llamas / se llama + name",
      "explain": "Llamarse literally means 'to call oneself,' so the reflexive pronoun changes with who's talking: me llamo, te llamas, se llama. With usted you also use se llama, since usted takes third-person verb forms even though you're speaking to someone directly.",
      "examples": [
        {
          "es": "Me llamo Javier.",
          "en": "My name is Javier."
        },
        {
          "es": "¿Cómo se llama su compañera?",
          "en": "What's your colleague's name?"
        }
      ],
      "commonMistake": "Don't say 'mi nombre es' as your default — it's understood but sounds like a form you're filling out; 'me llamo' is what people actually say in conversation."
    },
    "drill": {
      "question": "How do you politely ask a stranger their name?",
      "options": [
        "¿Cómo se llama usted?",
        "¿Cómo te llamas?",
        "¿Qué es su nombre?"
      ],
      "answer": "¿Cómo se llama usted?"
    }
  },
  {
    "id": "r03",
    "title": "Números y edad",
    "subtitle": "Numbers & age",
    "level": "novice-low",
    "icon": "🔢",
    "sentences": [
      {
        "es": "Uno, dos, tres, cuatro, cinco.",
        "en": "One, two, three, four, five."
      },
      {
        "es": "Seis, siete, ocho, nueve, diez.",
        "en": "Six, seven, eight, nine, ten."
      },
      {
        "es": "¿Cuántos años tienes?",
        "en": "How old are you?"
      },
      {
        "es": "Tengo veintiocho años.",
        "en": "I'm 28 years old."
      },
      {
        "es": "Mi hijo tiene diez años.",
        "en": "My son is 10 years old."
      },
      {
        "es": "Somos cinco en mi familia.",
        "en": "There are five of us in my family."
      },
      {
        "es": "Este café cuesta un euro con veinte.",
        "en": "This coffee costs one euro twenty."
      },
      {
        "es": "Hay treinta alumnos en mi clase.",
        "en": "There are 30 students in my class."
      }
    ],
    "grammar": {
      "title": "tener for age",
      "pattern": "Subject + tener + number + años",
      "explain": "Spanish speakers 'have' years rather than 'being' a number, so 'I'm 28' becomes tengo veintiocho años. The word años is never optional — leaving it off just sounds unfinished.",
      "examples": [
        {
          "es": "Tengo treinta y dos años.",
          "en": "I'm 32."
        },
        {
          "es": "¿Cuántos años tiene tu madre?",
          "en": "How old is your mother?"
        }
      ],
      "commonMistake": "Never say 'Soy veintiocho' to give your age — that's a literal English translation and doesn't work in Spanish; you need tener, plus años."
    },
    "drill": {
      "question": "How do you say 'I am 28 years old'?",
      "options": [
        "Tengo veintiocho años",
        "Soy veintiocho años",
        "Estoy veintiocho"
      ],
      "answer": "Tengo veintiocho años"
    }
  },
  {
    "id": "r04",
    "title": "La familia",
    "subtitle": "Family",
    "level": "novice-low",
    "icon": "👪",
    "sentences": [
      {
        "es": "Esta es mi madre.",
        "en": "This is my mother."
      },
      {
        "es": "Él es mi padre.",
        "en": "He is my father."
      },
      {
        "es": "Tengo dos hermanos.",
        "en": "I have two siblings."
      },
      {
        "es": "Mi hermana es enfermera.",
        "en": "My sister is a nurse."
      },
      {
        "es": "¿Tienes hermanos?",
        "en": "Do you have siblings?"
      },
      {
        "es": "Soy hijo único.",
        "en": "I'm an only child."
      },
      {
        "es": "Mis abuelos viven en un pueblo de Galicia.",
        "en": "My grandparents live in a village in Galicia."
      },
      {
        "es": "Mi familia es bastante numerosa.",
        "en": "My family is quite large."
      }
    ],
    "grammar": {
      "title": "mi / mis for possession",
      "pattern": "mi + singular noun · mis + plural noun",
      "explain": "Possessives agree with what's owned, not with the owner. One sibling is mi hermano; several are mis hermanos — the -s attaches to mi, not to the person speaking.",
      "examples": [
        {
          "es": "mi hermana / mis hermanas",
          "en": "my sister / my sisters"
        },
        {
          "es": "mi tío / mis tíos",
          "en": "my uncle / my aunts and uncles"
        }
      ],
      "commonMistake": "Don't use mis with a singular noun — 'mis hermana' is wrong; it has to be mi hermana."
    },
    "drill": {
      "question": "Which is correct for 'my grandparents'?",
      "options": [
        "mis abuelos",
        "mi abuelos",
        "mío abuelos"
      ],
      "answer": "mis abuelos"
    }
  },
  {
    "id": "r05",
    "title": "Colores y objetos",
    "subtitle": "Colors & everyday objects",
    "level": "novice-low",
    "icon": "🎨",
    "sentences": [
      {
        "es": "El bolígrafo es rojo.",
        "en": "The pen is red."
      },
      {
        "es": "La mesa es blanca.",
        "en": "The table is white."
      },
      {
        "es": "Quiero la camiseta azul.",
        "en": "I want the blue T-shirt."
      },
      {
        "es": "¿De qué color es tu coche?",
        "en": "What color is your car?"
      },
      {
        "es": "Mi mochila es negra.",
        "en": "My backpack is black."
      },
      {
        "es": "Necesito una silla nueva.",
        "en": "I need a new chair."
      },
      {
        "es": "¿Dónde está mi móvil?",
        "en": "Where's my phone?"
      },
      {
        "es": "Las flores del balcón son amarillas.",
        "en": "The flowers on the balcony are yellow."
      }
    ],
    "grammar": {
      "title": "Adjectives agree with the noun",
      "pattern": "noun + adjective (matching gender & number)",
      "explain": "Colors follow the noun in Spanish and change their ending to match it: rojo/roja, blanco/blanca, adding -s for the plural. Colors ending in -e or a consonant, like verde or azul, stay the same for gender and only change for number.",
      "examples": [
        {
          "es": "el coche rojo / la casa roja",
          "en": "the red car / the red house"
        },
        {
          "es": "los bolígrafos azules",
          "en": "the blue pens"
        }
      ],
      "commonMistake": "Don't place the color before the noun — 'la roja mesa' is wrong; Spanish says la mesa roja."
    },
    "drill": {
      "question": "Which is correct for 'the black backpack'?",
      "options": [
        "la mochila negra",
        "la mochila negro",
        "la negra mochila"
      ],
      "answer": "la mochila negra"
    }
  },
  {
    "id": "r06",
    "title": "Días y fechas",
    "subtitle": "Days & dates",
    "level": "novice-low",
    "icon": "📅",
    "sentences": [
      {
        "es": "Hoy es lunes.",
        "en": "Today is Monday."
      },
      {
        "es": "Mañana es martes.",
        "en": "Tomorrow is Tuesday."
      },
      {
        "es": "¿Qué día es hoy?",
        "en": "What day is today?"
      },
      {
        "es": "El sábado voy al mercado.",
        "en": "On Saturday I'm going to the market."
      },
      {
        "es": "Mi cumpleaños es el veinte de mayo.",
        "en": "My birthday is May 20th."
      },
      {
        "es": "Los domingos como en casa de mis padres.",
        "en": "On Sundays I eat lunch at my parents' place."
      },
      {
        "es": "La reunión es el miércoles.",
        "en": "The meeting is on Wednesday."
      },
      {
        "es": "Nos vemos el viernes por la tarde.",
        "en": "See you Friday afternoon."
      }
    ],
    "grammar": {
      "title": "el + day = 'on' that day",
      "pattern": "el lunes (this Monday) · los lunes (every Monday)",
      "explain": "Spanish uses the article where English uses 'on.' Singular el viernes points to this coming Friday; plural los viernes means Fridays as a habit, something that happens regularly.",
      "examples": [
        {
          "es": "El jueves tengo una entrevista.",
          "en": "On Thursday I have an interview."
        },
        {
          "es": "Los jueves tengo clase de yoga.",
          "en": "On Thursdays I have yoga class."
        }
      ],
      "commonMistake": "Don't add en before the day — 'en lunes' is wrong. Just say el lunes, no extra word needed."
    },
    "drill": {
      "question": "How do you say 'on Sundays' (every Sunday)?",
      "options": [
        "los domingos",
        "el domingo",
        "en domingos"
      ],
      "answer": "los domingos"
    }
  },
  {
    "id": "r07",
    "title": "Comida y bebida",
    "subtitle": "Food & drink",
    "level": "novice-mid",
    "icon": "🥘",
    "sentences": [
      {
        "es": "Tengo hambre, ¿pedimos algo de tapas?",
        "en": "I'm hungry, shall we order some tapas?"
      },
      {
        "es": "Quiero una ración de patatas bravas, por favor.",
        "en": "I'd like an order of patatas bravas, please."
      },
      {
        "es": "¿Qué me recomienda de la carta?",
        "en": "What do you recommend from the menu?"
      },
      {
        "es": "Me encanta el jamón ibérico.",
        "en": "I love Iberian ham."
      },
      {
        "es": "Para beber, un zumo de naranja natural.",
        "en": "To drink, a fresh orange juice."
      },
      {
        "es": "Quisiera la tortilla de patatas, sin cebolla.",
        "en": "I'd like the Spanish omelette, without onion."
      },
      {
        "es": "¿Nos trae la cuenta cuando pueda?",
        "en": "Could you bring us the check when you get a chance?"
      },
      {
        "es": "Está buenísimo, gracias.",
        "en": "It's really good, thanks."
      }
    ],
    "grammar": {
      "title": "querer / quisiera for ordering",
      "pattern": "quiero / quisiera + noun",
      "explain": "Quiero (I want) is the everyday, perfectly polite way to order in a bar or restaurant in Spain, especially paired with por favor. Quisiera (I would like) is its softer, more formal cousin — the conditional form makes the request feel gentler.",
      "examples": [
        {
          "es": "Quiero dos cañas, por favor.",
          "en": "I'd like two small beers, please."
        },
        {
          "es": "Quisiera ver la carta de vinos.",
          "en": "I would like to see the wine list."
        }
      ],
      "commonMistake": "Leaving off por favor is what actually sounds abrupt in Spain — quiero itself is completely normal and not rude when ordering."
    },
    "drill": {
      "question": "Which is the softer, more formal way to order?",
      "options": [
        "Quisiera un café con leche",
        "Quiero un café con leche",
        "Dame un café con leche"
      ],
      "answer": "Quisiera un café con leche"
    }
  },
  {
    "id": "r08",
    "title": "Gustos",
    "subtitle": "Likes & dislikes",
    "level": "novice-mid",
    "icon": "❤️",
    "sentences": [
      {
        "es": "Me gusta el fútbol.",
        "en": "I like football."
      },
      {
        "es": "Me gustan las películas de miedo.",
        "en": "I like scary movies."
      },
      {
        "es": "No me gusta madrugar.",
        "en": "I don't like getting up early."
      },
      {
        "es": "Me encanta la música en directo.",
        "en": "I love live music."
      },
      {
        "es": "¿Te gusta bailar?",
        "en": "Do you like dancing?"
      },
      {
        "es": "A mi hermano le gusta cocinar los domingos.",
        "en": "My brother likes cooking on Sundays."
      },
      {
        "es": "Prefiero el té al café.",
        "en": "I prefer tea to coffee."
      },
      {
        "es": "No me gustan nada las arañas.",
        "en": "I don't like spiders at all."
      }
    ],
    "grammar": {
      "title": "gustar works backwards",
      "pattern": "me/te/le + gusta (singular) / gustan (plural)",
      "explain": "Gustar really means 'to be pleasing to,' so the thing liked is the grammatical subject and the verb agrees with IT, not with the person who likes it: me gusta el fútbol but me gustan las películas. Followed by a verb, gustar always stays singular.",
      "examples": [
        {
          "es": "Me gusta el vino tinto.",
          "en": "I like red wine."
        },
        {
          "es": "Me gustan los conciertos.",
          "en": "I like concerts."
        }
      ],
      "commonMistake": "Never say 'yo gusto' to mean 'I like' — that would mean 'I am pleasing to someone.' The construction always starts with me/te/le."
    },
    "drill": {
      "question": "Which is correct for 'I like concerts'?",
      "options": [
        "Me gustan los conciertos",
        "Me gusta los conciertos",
        "Yo gusto conciertos"
      ],
      "answer": "Me gustan los conciertos"
    }
  },
  {
    "id": "r09",
    "title": "De compras",
    "subtitle": "Shopping",
    "level": "novice-mid",
    "icon": "🛍️",
    "sentences": [
      {
        "es": "¿Cuánto cuesta esta camiseta?",
        "en": "How much does this T-shirt cost?"
      },
      {
        "es": "¿Tiene esto en la talla mediana?",
        "en": "Do you have this in a medium?"
      },
      {
        "es": "Es un poco caro para mi presupuesto.",
        "en": "It's a bit expensive for my budget."
      },
      {
        "es": "¿Hay algún descuento en estos pantalones?",
        "en": "Is there a discount on these trousers?"
      },
      {
        "es": "Me lo llevo, gracias.",
        "en": "I'll take it, thanks."
      },
      {
        "es": "¿Se puede pagar con tarjeta?",
        "en": "Can I pay by card?"
      },
      {
        "es": "¿Puedo probarme esta chaqueta?",
        "en": "Can I try on this jacket?"
      },
      {
        "es": "Solo estoy mirando, gracias.",
        "en": "I'm just looking, thanks."
      }
    ],
    "grammar": {
      "title": "este / esta / esto",
      "pattern": "este + masculine · esta + feminine · esto = 'this thing'",
      "explain": "Put este or esta directly in front of a noun, matching its gender. Reach for esto on its own when you're pointing at something without naming it — you don't yet know, or don't care, what it's called.",
      "examples": [
        {
          "es": "este jersey / esta camiseta",
          "en": "this sweater / this T-shirt"
        },
        {
          "es": "¿Qué es esto?",
          "en": "What is this?"
        }
      ],
      "commonMistake": "Don't say 'esto camiseta' — right before a noun you need the matching form, esta (feminine) or este (masculine), never the neuter esto."
    },
    "drill": {
      "question": "Which is correct for 'this jacket' (la chaqueta)?",
      "options": [
        "esta chaqueta",
        "este chaqueta",
        "esto chaqueta"
      ],
      "answer": "esta chaqueta"
    }
  },
  {
    "id": "r10",
    "title": "La hora",
    "subtitle": "Telling time",
    "level": "novice-mid",
    "icon": "🕐",
    "sentences": [
      {
        "es": "¿Qué hora es?",
        "en": "What time is it?"
      },
      {
        "es": "Son las tres de la tarde.",
        "en": "It's three in the afternoon."
      },
      {
        "es": "Es la una en punto.",
        "en": "It's one o'clock sharp."
      },
      {
        "es": "Son las ocho y media.",
        "en": "It's half past eight."
      },
      {
        "es": "La reunión es a las diez.",
        "en": "The meeting is at ten."
      },
      {
        "es": "Llego sobre las seis.",
        "en": "I'll get there around six."
      },
      {
        "es": "Son las nueve menos cuarto.",
        "en": "It's a quarter to nine."
      },
      {
        "es": "¿A qué hora abre la tienda?",
        "en": "What time does the shop open?"
      }
    ],
    "grammar": {
      "title": "ser for time, and es vs. son",
      "pattern": "Es la una · Son las dos/tres...",
      "explain": "Telling time uses ser, and it agrees with the hour: one o'clock is the lone singular hour, es la una, while every other hour is plural, son las dos. Use a las to say AT what time something happens.",
      "examples": [
        {
          "es": "Son las siete.",
          "en": "It's seven o'clock."
        },
        {
          "es": "Quedamos a las siete.",
          "en": "Let's meet at seven."
        }
      ],
      "commonMistake": "Don't say 'son la una' — one o'clock is the exception and stays singular: es la una."
    },
    "drill": {
      "question": "Which is correct for 'It's one o'clock'?",
      "options": [
        "Es la una",
        "Son la una",
        "Son las una"
      ],
      "answer": "Es la una"
    }
  },
  {
    "id": "r11",
    "title": "Rutina diaria",
    "subtitle": "Daily routine",
    "level": "novice-high",
    "icon": "⏰",
    "sentences": [
      {
        "es": "Normalmente me despierto a las siete.",
        "en": "I normally wake up at seven."
      },
      {
        "es": "Me ducho y desayuno rápido antes de salir.",
        "en": "I shower and have a quick breakfast before leaving."
      },
      {
        "es": "Cojo el autobús a las ocho y cuarto.",
        "en": "I catch the bus at a quarter past eight."
      },
      {
        "es": "Como con mis compañeros sobre las dos.",
        "en": "I have lunch with my coworkers around two."
      },
      {
        "es": "Después del trabajo, voy al gimnasio.",
        "en": "After work, I go to the gym."
      },
      {
        "es": "Por la noche veo una serie o leo un rato.",
        "en": "In the evening I watch a series or read for a bit."
      },
      {
        "es": "Me acuesto sobre las once y media.",
        "en": "I go to bed around half past eleven."
      },
      {
        "es": "Los fines de semana me levanto tarde.",
        "en": "On weekends I get up late."
      }
    ],
    "grammar": {
      "title": "Reflexive verbs for routines",
      "pattern": "me + verb (levantarse, ducharse, acostarse)",
      "explain": "Routine verbs are reflexive in Spanish even where English needs no extra word. 'I wake up' becomes me despierto — the me is required and changes with the subject: me/te/se/nos/os/se.",
      "examples": [
        {
          "es": "Me levanto pronto.",
          "en": "I get up early."
        },
        {
          "es": "Se acuesta tarde los viernes.",
          "en": "He/she goes to bed late on Fridays."
        }
      ],
      "commonMistake": "Dropping the pronoun changes the meaning entirely — 'despierto a mi hijo' means you wake up your SON, not yourself."
    },
    "drill": {
      "question": "Which correctly says 'I go to bed at eleven'?",
      "options": [
        "Me acuesto a las once",
        "Acuesto a las once",
        "Me acuesto las once"
      ],
      "answer": "Me acuesto a las once"
    }
  },
  {
    "id": "r12",
    "title": "Direcciones y transporte",
    "subtitle": "Directions & transport",
    "level": "novice-high",
    "icon": "🧭",
    "sentences": [
      {
        "es": "Perdone, ¿cómo llego al centro?",
        "en": "Excuse me, how do I get downtown?"
      },
      {
        "es": "Siga todo recto dos calles.",
        "en": "Go straight ahead two streets."
      },
      {
        "es": "Gire a la izquierda en el semáforo.",
        "en": "Turn left at the traffic light."
      },
      {
        "es": "Está a diez minutos andando.",
        "en": "It's a ten-minute walk."
      },
      {
        "es": "Puede coger el metro hasta Sol.",
        "en": "You can take the metro to Sol."
      },
      {
        "es": "Yo suelo coger el autobús para ir al trabajo.",
        "en": "I usually take the bus to get to work."
      },
      {
        "es": "Creo que me he perdido.",
        "en": "I think I've gotten lost."
      },
      {
        "es": "Está enfrente de la estación de RENFE.",
        "en": "It's across from the RENFE station."
      }
    ],
    "grammar": {
      "title": "Formal (usted) commands",
      "pattern": "-ar → -e · -er/-ir → -a",
      "explain": "Directions from a stranger come as usted commands, which flip the normal vowel: girar becomes gire, seguir becomes siga. You'll hear these all the time from shop assistants, police officers, and people on the street.",
      "examples": [
        {
          "es": "Gire a la derecha.",
          "en": "Turn right."
        },
        {
          "es": "Coja la segunda calle.",
          "en": "Take the second street."
        }
      ],
      "commonMistake": "Recto means straight ahead while derecha means the right-hand side — mixing the two sends you the wrong way entirely."
    },
    "drill": {
      "question": "Which word means 'straight ahead'?",
      "options": [
        "recto",
        "derecha",
        "izquierda"
      ],
      "answer": "recto"
    }
  },
  {
    "id": "r13",
    "title": "Planes",
    "subtitle": "Talking about plans",
    "level": "novice-high",
    "icon": "🗓️",
    "sentences": [
      {
        "es": "Voy a viajar a Barcelona el mes que viene.",
        "en": "I'm going to travel to Barcelona next month."
      },
      {
        "es": "¿Qué vais a hacer este fin de semana?",
        "en": "What are you all going to do this weekend?"
      },
      {
        "es": "Vamos a ver una peli esta noche.",
        "en": "We're going to watch a movie tonight."
      },
      {
        "es": "Pienso estudiar más este curso.",
        "en": "I'm planning to study more this year."
      },
      {
        "es": "Tengo ganas de salir a dar una vuelta.",
        "en": "I feel like going out for a walk."
      },
      {
        "es": "A lo mejor voy a la fiesta de Marta.",
        "en": "Maybe I'll go to Marta's party."
      },
      {
        "es": "El sábado vamos a visitar a mis abuelos.",
        "en": "On Saturday we're going to visit my grandparents."
      },
      {
        "es": "Todavía no tengo planes para las vacaciones.",
        "en": "I don't have plans for the holidays yet."
      }
    ],
    "grammar": {
      "title": "The 'going to' future",
      "pattern": "ir + a + infinitive",
      "explain": "The simplest future in Spanish: conjugate ir (voy, vas, va, vamos, vais, van), add a, then the plain verb. In everyday speech this is used far more often than the formal future tense.",
      "examples": [
        {
          "es": "Voy a comer.",
          "en": "I'm going to eat."
        },
        {
          "es": "Vais a salir esta noche.",
          "en": "You all are going to go out tonight."
        }
      ],
      "commonMistake": "Don't drop the a — 'voy comer' is wrong. It's always voy a comer."
    },
    "drill": {
      "question": "Which correctly says 'We're going to travel'?",
      "options": [
        "Vamos a viajar",
        "Vamos viajar",
        "Vamos a viajamos"
      ],
      "answer": "Vamos a viajar"
    }
  },
  {
    "id": "r14",
    "title": "El tiempo y las estaciones",
    "subtitle": "Weather & seasons",
    "level": "novice-high",
    "icon": "🌤️",
    "sentences": [
      {
        "es": "¿Qué tiempo hace hoy?",
        "en": "What's the weather like today?"
      },
      {
        "es": "Hace mucho calor en agosto.",
        "en": "It's very hot in August."
      },
      {
        "es": "Hace frío por la mañana.",
        "en": "It's cold in the morning."
      },
      {
        "es": "Está lloviendo bastante fuerte.",
        "en": "It's raining quite hard."
      },
      {
        "es": "Hoy está nublado en Madrid.",
        "en": "It's cloudy in Madrid today."
      },
      {
        "es": "En verano hace un calor insoportable.",
        "en": "In summer the heat is unbearable."
      },
      {
        "es": "Va a llover por la tarde.",
        "en": "It's going to rain in the afternoon."
      },
      {
        "es": "Me encanta el tiempo de otoño.",
        "en": "I love autumn weather."
      }
    ],
    "grammar": {
      "title": "hacer vs. estar for weather",
      "pattern": "hace + noun (calor/frío) · está + adjective (nublado)",
      "explain": "Spanish pairs weather nouns with hacer — literally 'it makes heat' — so it's hace calor, never es caliente. Use estar with an adjective or an -ando/-iendo form to describe a condition, like está nublado or está lloviendo.",
      "examples": [
        {
          "es": "Hace viento en la costa.",
          "en": "It's windy on the coast."
        },
        {
          "es": "Está nublado esta mañana.",
          "en": "It's cloudy this morning."
        }
      ],
      "commonMistake": "'Estoy caliente' does not mean 'I'm hot' from the weather — it has a sexual meaning in Spanish. Say tengo calor instead."
    },
    "drill": {
      "question": "How do you say 'It's very hot' (weather)?",
      "options": [
        "Hace mucho calor",
        "Es muy caliente",
        "Estoy caliente"
      ],
      "answer": "Hace mucho calor"
    }
  },
  {
    "id": "r15",
    "title": "El trabajo",
    "subtitle": "Work",
    "level": "intermediate-low",
    "icon": "💼",
    "sentences": [
      {
        "es": "¿A qué te dedicas?",
        "en": "What do you do for work?"
      },
      {
        "es": "Trabajo en una asesoría fiscal.",
        "en": "I work at a tax consultancy."
      },
      {
        "es": "Llevo cuatro años en esta empresa.",
        "en": "I've been at this company for four years."
      },
      {
        "es": "Mi jefa es exigente pero muy justa.",
        "en": "My boss is demanding but very fair."
      },
      {
        "es": "Tengo una reunión a las diez.",
        "en": "I have a meeting at ten."
      },
      {
        "es": "Llevo dos meses trabajando desde casa.",
        "en": "I've been working from home for two months."
      },
      {
        "es": "El mes pasado me subieron el sueldo.",
        "en": "Last month I got a raise."
      },
      {
        "es": "Estoy buscando algo con mejor horario.",
        "en": "I'm looking for something with better hours."
      }
    ],
    "grammar": {
      "title": "llevar + time + gerund",
      "pattern": "llevar + time + -ando/-iendo",
      "explain": "To say how long you've been doing something, Spanish reaches for llevar, not a form of 'have been.' Llevo cuatro años trabajando aquí means 'I've been working here for four years' — you can also drop the gerund and just say llevo cuatro años aquí.",
      "examples": [
        {
          "es": "Llevo una hora esperando el tren.",
          "en": "I've been waiting for the train for an hour."
        },
        {
          "es": "Lleva diez años viviendo en Madrid.",
          "en": "He's been living in Madrid for ten years."
        }
      ],
      "commonMistake": "Translating literally with 'he estado' + gerund is understood but sounds foreign — native speakers reach for llevar instead."
    },
    "drill": {
      "question": "Which says 'I've been waiting an hour'?",
      "options": [
        "Llevo una hora esperando",
        "Estoy una hora esperando",
        "Tengo una hora espero"
      ],
      "answer": "Llevo una hora esperando"
    }
  },
  {
    "id": "r16",
    "title": "Amistades",
    "subtitle": "Friendships & shared experiences",
    "level": "intermediate-low",
    "icon": "🤝",
    "sentences": [
      {
        "es": "Mi mejor amiga y yo nos conocimos en la universidad.",
        "en": "My best friend and I met each other in college."
      },
      {
        "es": "Quedamos casi todos los fines de semana.",
        "en": "We get together almost every weekend."
      },
      {
        "es": "Ella siempre me hace reír muchísimo.",
        "en": "She always makes me laugh a lot."
      },
      {
        "es": "Hace tiempo que no veo a mis amigos del instituto.",
        "en": "I haven't seen my high school friends in a while."
      },
      {
        "es": "Nos llevamos genial desde el primer día.",
        "en": "We've gotten along great since the first day."
      },
      {
        "es": "¿Cómo os conocisteis vosotros dos?",
        "en": "How did you two meet each other?"
      },
      {
        "es": "Nos contamos todo, la verdad.",
        "en": "We tell each other everything, honestly."
      },
      {
        "es": "Ayer quedamos para cenar juntos.",
        "en": "Yesterday we met up to have dinner together."
      }
    ],
    "grammar": {
      "title": "Reciprocal 'each other'",
      "pattern": "nos / os / se + plural verb",
      "explain": "To say people do something to each other, Spanish reuses the reflexive pronoun with a plural subject: nos conocimos means 'we met each other,' se llevan bien means 'they get along with each other.' With vosotros, the pronoun is os: os conocisteis.",
      "examples": [
        {
          "es": "Nos vemos casi cada semana.",
          "en": "We see each other almost every week."
        },
        {
          "es": "Se ayudan mucho entre ellos.",
          "en": "They help each other a lot."
        }
      ],
      "commonMistake": "Don't automatically add el uno al otro — the pronoun alone already carries the 'each other' meaning, so adding both is redundant."
    },
    "drill": {
      "question": "Which says 'we met each other in college'?",
      "options": [
        "Nos conocimos en la universidad",
        "Conocimos en la universidad",
        "Nos conocemos la universidad"
      ],
      "answer": "Nos conocimos en la universidad"
    }
  },
  {
    "id": "r17",
    "title": "La casa y el piso",
    "subtitle": "Home & the flat",
    "level": "intermediate-low",
    "icon": "🏠",
    "sentences": [
      {
        "es": "Vivo en un piso de dos habitaciones en Malasaña.",
        "en": "I live in a two-bedroom flat in Malasaña."
      },
      {
        "es": "Hay un balcón pequeño con vistas a la calle.",
        "en": "There's a small balcony overlooking the street."
      },
      {
        "es": "El sofá está entre la ventana y la estantería.",
        "en": "The sofa is between the window and the bookshelf."
      },
      {
        "es": "En la cocina hay una mesa y cuatro sillas.",
        "en": "In the kitchen there's a table and four chairs."
      },
      {
        "es": "El baño está al lado del dormitorio.",
        "en": "The bathroom is next to the bedroom."
      },
      {
        "es": "¿Dónde están las llaves del piso?",
        "en": "Where are the keys to the flat?"
      },
      {
        "es": "Hay mucha luz natural por las mañanas.",
        "en": "There's a lot of natural light in the mornings."
      },
      {
        "es": "El edificio está cerca del metro.",
        "en": "The building is close to the metro."
      }
    ],
    "grammar": {
      "title": "hay vs. estar for location",
      "pattern": "hay + indefinite noun · estar + definite/specific thing",
      "explain": "Use hay to introduce something for the first time or say it exists — un balcón, unas sillas — without pointing to a particular one. Once you're talking about a specific, already-identified thing, switch to estar plus a preposition of place: el sofá está entre...",
      "examples": [
        {
          "es": "Hay un armario grande en el pasillo.",
          "en": "There's a big wardrobe in the hallway."
        },
        {
          "es": "El armario está en el pasillo.",
          "en": "The wardrobe is in the hallway."
        }
      ],
      "commonMistake": "Don't say 'el piso hay cerca del metro' — hay never takes a definite subject like el piso; that sentence needs estar: el piso está cerca del metro."
    },
    "drill": {
      "question": "Which is correct: 'There's a table in the kitchen'?",
      "options": [
        "Hay una mesa en la cocina",
        "Está una mesa en la cocina",
        "La mesa hay en la cocina"
      ],
      "answer": "Hay una mesa en la cocina"
    }
  },
  {
    "id": "r18",
    "title": "En el bar",
    "subtitle": "Ordering at a bar",
    "level": "intermediate-low",
    "icon": "🍻",
    "sentences": [
      {
        "es": "¿Qué te pongo?",
        "en": "What can I get you?"
      },
      {
        "es": "Ponme una caña, por favor.",
        "en": "Give me a small beer, please."
      },
      {
        "es": "¿Me pones también una tapa de tortilla?",
        "en": "Could you also get me a tapa of tortilla?"
      },
      {
        "es": "Vale, ahora mismo te lo traigo.",
        "en": "OK, I'll bring it to you right away."
      },
      {
        "es": "¿Nos traes la cuenta cuando puedas?",
        "en": "Could you bring us the check when you get a chance?"
      },
      {
        "es": "Vale, aquí tienes.",
        "en": "OK, here you go."
      },
      {
        "es": "¿Me cobras esto, por favor?",
        "en": "Could you charge me for this, please?"
      },
      {
        "es": "Vale, pues nos vemos la próxima.",
        "en": "OK, well, see you next time."
      }
    ],
    "grammar": {
      "title": "Indirect object pronouns at the bar",
      "pattern": "me pone / me trae / ponme + item",
      "explain": "Ordering in Spain leans on indirect object pronouns: me pone una caña literally means 'put me a beer,' with me marking who benefits from the action. With a command, the pronoun attaches to the end: ponme, tráeme. Vale is the all-purpose filler for 'OK' that glues the whole exchange together.",
      "examples": [
        {
          "es": "Me pones un café, por favor.",
          "en": "Could you get me a coffee, please."
        },
        {
          "es": "Tráeme la cuenta, vale.",
          "en": "Bring me the check, OK."
        }
      ],
      "commonMistake": "Don't skip the pronoun and just say 'pon una caña' to a bartender — without me/nos it sounds like an order barked at no one in particular rather than a request directed at you."
    },
    "drill": {
      "question": "Which is the natural way to ask a bartender for a beer?",
      "options": [
        "Ponme una caña, por favor",
        "Pon una caña, por favor",
        "Yo quiero pones una caña"
      ],
      "answer": "Ponme una caña, por favor"
    }
  },
  {
    "id": "r19",
    "title": "El fin de semana",
    "subtitle": "The weekend",
    "level": "intermediate-low",
    "icon": "🎉",
    "sentences": [
      {
        "es": "Acabo de llegar a casa después de la fiesta.",
        "en": "I just got home after the party."
      },
      {
        "es": "Acabamos de comer en un bar de tapas buenísimo.",
        "en": "We just ate at a really good tapas bar."
      },
      {
        "es": "Mi hermana acaba de volver de Barcelona.",
        "en": "My sister just got back from Barcelona."
      },
      {
        "es": "Acabo de despertarme, dame un minuto.",
        "en": "I just woke up, give me a minute."
      },
      {
        "es": "El sábado por la noche salimos de fiesta hasta tarde.",
        "en": "On Saturday night we went out partying until late."
      },
      {
        "es": "El domingo no hicimos nada, solo descansamos.",
        "en": "On Sunday we didn't do anything, we just rested."
      },
      {
        "es": "Acabáis de perderos lo mejor de la fiesta.",
        "en": "You all just missed the best part of the party."
      },
      {
        "es": "Menudo fin de semana, necesito otro para descansar.",
        "en": "What a weekend, I need another one just to rest."
      }
    ],
    "grammar": {
      "title": "acabar de + infinitive",
      "pattern": "acabar de + infinitive = 'to have just done something'",
      "explain": "Acabar de plus an infinitive describes something that happened moments ago — acabo de llegar means 'I just arrived,' not 'I finish arriving.' Conjugate acabar for the person and keep de before the infinitive; it never changes to a different preposition.",
      "examples": [
        {
          "es": "Acabo de comer, no tengo hambre.",
          "en": "I just ate, I'm not hungry."
        },
        {
          "es": "Acaban de salir del cine.",
          "en": "They just left the cinema."
        }
      ],
      "commonMistake": "Don't drop the de — 'acabo llegar' is wrong; the construction always needs acabar de + infinitive."
    },
    "drill": {
      "question": "Which correctly says 'I just arrived'?",
      "options": [
        "Acabo de llegar",
        "Acabo llegar",
        "Estoy acabando llegar"
      ],
      "answer": "Acabo de llegar"
    }
  },
  {
    "id": "r20",
    "title": "Viajes",
    "subtitle": "Travel & past narration",
    "level": "intermediate-mid",
    "icon": "✈️",
    "sentences": [
      {
        "es": "El año pasado fui a Barcelona con mis amigas.",
        "en": "Last year I went to Barcelona with my friends."
      },
      {
        "es": "Cogimos el AVE desde Madrid y llegamos en menos de tres horas.",
        "en": "We took the AVE from Madrid and arrived in under three hours."
      },
      {
        "es": "Nos alojamos en un hostal cerca de la playa.",
        "en": "We stayed at a hostel near the beach."
      },
      {
        "es": "Visitamos la Sagrada Familia y sacamos un montón de fotos.",
        "en": "We visited the Sagrada Familia and took a ton of photos."
      },
      {
        "es": "Perdimos el tren de vuelta porque llegamos tarde a la estación.",
        "en": "We missed the return train because we got to the station late."
      },
      {
        "es": "Fue un viaje estupendo, aunque un poco caro.",
        "en": "It was a great trip, though a bit expensive."
      },
      {
        "es": "Comimos en un montón de bares de tapas por el Gótico.",
        "en": "We ate at loads of tapas bars around the Gothic Quarter."
      },
      {
        "es": "Para la próxima vez, quiero conocer el norte de España.",
        "en": "Next time, I want to see the north of Spain."
      }
    ],
    "grammar": {
      "title": "Preterite for completed past events",
      "pattern": "-é/-aste/-ó (ar) · -í/-iste/-ió (er, ir)",
      "explain": "The preterite reports finished actions with a clear beginning and end — exactly what you need to say what happened on a trip. Words like 'el año pasado' or 'ayer' usually flag that it belongs here rather than in another past tense.",
      "examples": [
        {
          "es": "Cogimos el tren a las nueve.",
          "en": "We caught the train at nine."
        },
        {
          "es": "Estuvimos tres días en Sevilla.",
          "en": "We were in Seville for three days."
        }
      ],
      "commonMistake": "For -ar verbs, the nosotros form looks identical in the present and the preterite — 'visitamos' can mean 'we visit' or 'we visited' — so don't expect the verb ending alone to signal past tense; time words like 'el año pasado' are doing that work."
    },
    "drill": {
      "question": "Which correctly completes 'El verano pasado ___ en Barcelona' (preterite of estar)?",
      "options": [
        "estuvimos",
        "estamos",
        "estábamos"
      ],
      "answer": "estuvimos"
    }
  },
  {
    "id": "r21",
    "title": "Opiniones",
    "subtitle": "Opinions",
    "level": "intermediate-mid",
    "icon": "💬",
    "sentences": [
      {
        "es": "Creo que deberíamos reciclar más en casa.",
        "en": "I think we should recycle more at home."
      },
      {
        "es": "Me parece que el nuevo horario de trabajo es un acierto.",
        "en": "I think the new work schedule is a good move."
      },
      {
        "es": "En mi opinión, el transporte público en Madrid funciona genial.",
        "en": "In my opinion, public transport in Madrid works great."
      },
      {
        "es": "Opino que deberían bajar el precio de la vivienda.",
        "en": "I think they should lower housing prices."
      },
      {
        "es": "No estoy de acuerdo contigo, la verdad.",
        "en": "I don't agree with you, to be honest."
      },
      {
        "es": "A mí me parece que exageras un poco.",
        "en": "It seems to me you're exaggerating a bit."
      },
      {
        "es": "Depende del punto de vista, supongo.",
        "en": "It depends on the point of view, I suppose."
      },
      {
        "es": "Estoy totalmente de acuerdo con lo que dices.",
        "en": "I completely agree with what you're saying."
      }
    ],
    "grammar": {
      "title": "Stating an opinion",
      "pattern": "creo que / me parece que / opino que + indicative",
      "explain": "These are the everyday ways to introduce an opinion, and because you're stating what you believe to be true, the verb that follows stays in the indicative: creo que hace calor, not haga calor. That changes the moment you deny the opinion — no creo que sea verdad — which is a subjunctive trigger you'll meet later on.",
      "examples": [
        {
          "es": "Creo que va a llover.",
          "en": "I think it's going to rain."
        },
        {
          "es": "Me parece que tiene razón.",
          "en": "It seems to me she's right."
        }
      ],
      "commonMistake": "Learners often reach for the subjunctive automatically after any opinion phrase, but 'creo que', 'me parece que' and 'opino que' in the affirmative all take the indicative — the subjunctive only shows up once you negate them."
    },
    "drill": {
      "question": "Which correctly completes 'Creo que ___ razón'?",
      "options": [
        "tienes",
        "tengas",
        "tuvieras"
      ],
      "answer": "tienes"
    }
  },
  {
    "id": "r22",
    "title": "La salud",
    "subtitle": "Health",
    "level": "intermediate-mid",
    "icon": "🩺",
    "sentences": [
      {
        "es": "Me duele mucho la cabeza desde esta mañana.",
        "en": "My head has been hurting a lot since this morning."
      },
      {
        "es": "¿Te duelen las piernas después de correr?",
        "en": "Do your legs hurt after running?"
      },
      {
        "es": "Tengo que pedir cita con el médico de cabecera.",
        "en": "I have to make an appointment with my GP."
      },
      {
        "es": "Me duele la espalda de estar todo el día sentada.",
        "en": "My back hurts from sitting all day."
      },
      {
        "es": "Tienes que tomarte esto con el estómago lleno.",
        "en": "You have to take this on a full stomach."
      },
      {
        "es": "Le dolían tanto las muelas que fue al dentista de urgencias.",
        "en": "His teeth hurt so much that he went to the emergency dentist."
      },
      {
        "es": "Si sigues así, vas a tener que coger la baja.",
        "en": "If you keep this up, you're going to have to take sick leave."
      },
      {
        "es": "Ya no me duele tanto, menos mal.",
        "en": "It doesn't hurt as much anymore, thank goodness."
      }
    ],
    "grammar": {
      "title": "doler works like gustar",
      "pattern": "me/te/le + duele (singular) / duelen (plural) · tener que + infinitive",
      "explain": "Doler behaves exactly like gustar: what hurts is the grammatical subject, so the verb agrees with the body part, not with the person in pain — me duele la cabeza, but me duelen las piernas. Tener que + infinitive is how you say you must do something, and only tener changes for the person: tengo que, tienes que, tiene que.",
      "examples": [
        {
          "es": "Me duele el cuello.",
          "en": "My neck hurts."
        },
        {
          "es": "Tenemos que ir a la farmacia.",
          "en": "We have to go to the pharmacy."
        }
      ],
      "commonMistake": "Because the body part is the subject, don't put a possessive in front of it — 'me duele mi cabeza' is wrong; the article does that job instead: 'me duele la cabeza'."
    },
    "drill": {
      "question": "Which is correct for 'his teeth hurt'?",
      "options": [
        "Le duelen las muelas",
        "Le duele las muelas",
        "Sus muelas duelen"
      ],
      "answer": "Le duelen las muelas"
    }
  },
  {
    "id": "r23",
    "title": "La tecnología",
    "subtitle": "Technology",
    "level": "intermediate-mid",
    "icon": "📱",
    "sentences": [
      {
        "es": "Mi móvil nuevo es mucho más rápido que el anterior.",
        "en": "My new phone is much faster than my previous one."
      },
      {
        "es": "Este ordenador portátil pesa menos que el de mi hermano.",
        "en": "This laptop weighs less than my brother's."
      },
      {
        "es": "Las redes sociales no son tan útiles como parecen.",
        "en": "Social media isn't as useful as it seems."
      },
      {
        "es": "Prefiero mandar un mensaje que llamar por teléfono.",
        "en": "I'd rather send a message than make a phone call."
      },
      {
        "es": "Cuanto más uso el móvil, menos leo.",
        "en": "The more I use my phone, the less I read."
      },
      {
        "es": "Mi ordenador va tan lento como una tortuga.",
        "en": "My computer runs as slow as a tortoise."
      },
      {
        "es": "Instagram me parece menos entretenido que TikTok.",
        "en": "I find Instagram less entertaining than TikTok."
      },
      {
        "es": "Tengo tantas aplicaciones que ya no me cabe nada en el móvil.",
        "en": "I have so many apps that nothing fits on my phone anymore."
      }
    ],
    "grammar": {
      "title": "Comparatives",
      "pattern": "más/menos + adjective + que · tan + adjective + como",
      "explain": "To compare unequal things, sandwich the adjective between más or menos and que: más rápido que, menos útil que. To say two things are equal, use tan + adjective + como; for nouns, tanto/a/os/as + noun + como does the same job and has to agree with the noun.",
      "examples": [
        {
          "es": "Es más caro que el otro.",
          "en": "It's more expensive than the other one."
        },
        {
          "es": "No es tan difícil como crees.",
          "en": "It's not as hard as you think."
        }
      ],
      "commonMistake": "Don't say 'más bueno' or 'más malo' — Spanish has irregular comparatives, mejor (better) and peor (worse), that already mean 'more good' and 'more bad'."
    },
    "drill": {
      "question": "Which correctly means 'better'?",
      "options": [
        "mejor",
        "más bueno",
        "más bien"
      ],
      "answer": "mejor"
    }
  },
  {
    "id": "r24",
    "title": "Costumbres de España",
    "subtitle": "Spanish customs",
    "level": "intermediate-mid",
    "icon": "😴",
    "sentences": [
      {
        "es": "De pequeña, siempre echaba la siesta después de comer.",
        "en": "As a kid, I always used to take a nap after lunch."
      },
      {
        "es": "Mis abuelos comían a las dos y cenaban pasadas las nueve.",
        "en": "My grandparents used to eat lunch at two and dinner after nine."
      },
      {
        "es": "Los domingos nos quedábamos horas de sobremesa charlando.",
        "en": "On Sundays we used to stay at the table for hours chatting."
      },
      {
        "es": "Cuando vivía en un pueblo, las tiendas cerraban entre semana por la tarde.",
        "en": "When I lived in a small town, the shops used to close on weekday afternoons."
      },
      {
        "es": "De niños, jugábamos en la calle hasta que se hacía de noche.",
        "en": "As kids, we used to play in the street until it got dark."
      },
      {
        "es": "Mi madre siempre decía que había que descansar después de comer.",
        "en": "My mother always used to say you had to rest after eating."
      },
      {
        "es": "Antes la gente cenaba más tarde que ahora, aunque poco a poco va cambiando.",
        "en": "People used to have dinner later than now, though it's gradually changing."
      },
      {
        "es": "Cada verano pasábamos las tardes en la terraza hasta muy tarde.",
        "en": "Every summer we used to spend our evenings on the terrace until very late."
      }
    ],
    "grammar": {
      "title": "Imperfect for habitual past actions",
      "pattern": "-aba/-abas/-aba... (ar) · -ía/-ías/-ía... (er, ir)",
      "explain": "The imperfect is for things you used to do repeatedly, or that were simply the backdrop of life — perfect for describing customs and routines with no clear endpoint. Signal words like 'de pequeño', 'siempre', and 'los domingos' point straight to it.",
      "examples": [
        {
          "es": "Comíamos juntos todos los días.",
          "en": "We used to eat together every day."
        },
        {
          "es": "Siempre echaba la siesta.",
          "en": "I always used to take a nap."
        }
      ],
      "commonMistake": "Don't reach for the preterite to describe a repeated habit — 'de pequeño jugamos en la calle' sounds like it happened once; the habitual sense needs the imperfect, jugábamos."
    },
    "drill": {
      "question": "Which correctly completes 'De pequeños, siempre ___ en la calle' (imperfect of jugar)?",
      "options": [
        "jugábamos",
        "jugamos",
        "jugaríamos"
      ],
      "answer": "jugábamos"
    }
  },
  {
    "id": "r25",
    "title": "Imprevistos",
    "subtitle": "Unexpected situations",
    "level": "intermediate-high",
    "icon": "⚠️",
    "sentences": [
      {
        "es": "Se me ha olvidado el paraguas en casa y está lloviendo a cántaros.",
        "en": "I forgot my umbrella at home and it's pouring rain."
      },
      {
        "es": "Se le rompió la pantalla del móvil al caérsele al suelo.",
        "en": "His phone screen broke when he dropped it on the floor."
      },
      {
        "es": "Se nos estropeó el coche a mitad de la autovía.",
        "en": "Our car broke down halfway down the motorway."
      },
      {
        "es": "Se me ha perdido la cartera, no sé dónde la he dejado.",
        "en": "I've lost my wallet, I don't know where I left it."
      },
      {
        "es": "Se te ha quemado la tortilla, huele a chamusquina.",
        "en": "Your tortilla has burnt, it smells like something's burning."
      },
      {
        "es": "Se nos acabó el gas justo antes de la cena.",
        "en": "We ran out of gas right before dinner."
      },
      {
        "es": "Se me cayeron las llaves por la alcantarilla, no me lo podía creer.",
        "en": "My keys fell down the drain, I couldn't believe it."
      },
      {
        "es": "Al final se solucionó todo, aunque fue un mal rato.",
        "en": "In the end everything got sorted out, though it was a rough moment."
      }
    ],
    "grammar": {
      "title": "Accidental 'se'",
      "pattern": "se + me/te/le/nos/os/les + verb",
      "explain": "This construction takes the blame off the person: instead of saying 'I forgot the umbrella,' Spanish says 'the umbrella got forgotten on me' — se me olvidó el paraguas. It's the natural way to talk about things that break, get lost, or slip your mind without sounding like you did it on purpose.",
      "examples": [
        {
          "es": "Se me ha roto el vaso.",
          "en": "I broke the glass (it broke on me)."
        },
        {
          "es": "Se os ha olvidado la llave.",
          "en": "You all forgot the key."
        }
      ],
      "commonMistake": "The verb has to agree with the thing that happened, not with the person affected — 'se me perdieron las llaves' (plural keys), never 'se me perdió las llaves'."
    },
    "drill": {
      "question": "Which correctly says 'I lost my keys' (accidental se)?",
      "options": [
        "Se me perdieron las llaves",
        "Se me perdió las llaves",
        "Perdí se las llaves"
      ],
      "answer": "Se me perdieron las llaves"
    }
  },
  {
    "id": "r26",
    "title": "Narración en el pasado",
    "subtitle": "Narrating in the past",
    "level": "intermediate-high",
    "icon": "📖",
    "sentences": [
      {
        "es": "Estaba duchándome cuando sonó el timbre de la puerta.",
        "en": "I was showering when the doorbell rang."
      },
      {
        "es": "Hacía un día precioso, así que decidimos coger la bici.",
        "en": "It was a beautiful day, so we decided to take the bikes."
      },
      {
        "es": "Mientras esperábamos el autobús, empezó a diluviar.",
        "en": "While we were waiting for the bus, it started pouring."
      },
      {
        "es": "Yo estaba tan cansado que me quedé dormido en el sofá.",
        "en": "I was so tired that I fell asleep on the sofa."
      },
      {
        "es": "Yo conducía tranquilamente por la carretera cuando un ciervo cruzó de repente.",
        "en": "I was driving calmly down the road when a deer suddenly crossed."
      },
      {
        "es": "Todo el mundo hablaba en la sobremesa cuando de repente se fue la luz.",
        "en": "Everyone was chatting at the table when the power suddenly went out."
      },
      {
        "es": "Llevaba dos años viviendo en Sevilla cuando decidí mudarme a Madrid.",
        "en": "I had been living in Seville for two years when I decided to move to Madrid."
      },
      {
        "es": "Como no paraba de llover, al final cancelamos la excursión.",
        "en": "Since it wouldn't stop raining, we ended up cancelling the trip."
      }
    ],
    "grammar": {
      "title": "Preterite and imperfect together",
      "pattern": "imperfect = background · preterite = the event that interrupts",
      "explain": "This is the pairing that makes a story sound alive: the imperfect paints what was already happening — estaba duchándome, hacía un día precioso — and the preterite drops in the single thing that interrupted it — sonó el timbre. Getting comfortable switching between them mid-sentence is the core skill here.",
      "examples": [
        {
          "es": "Dormía cuando llamaste.",
          "en": "I was sleeping when you called."
        },
        {
          "es": "Llovía cuando salimos de casa.",
          "en": "It was raining when we left the house."
        }
      ],
      "commonMistake": "Putting both verbs in the preterite flattens the scene — 'sonó el timbre mientras duché' loses the sense that the shower was already underway; the ongoing action needs the imperfect, duchaba."
    },
    "drill": {
      "question": "Which correctly completes '___ cuando sonó el teléfono' (I was sleeping)?",
      "options": [
        "Dormía",
        "Dormí",
        "He dormido"
      ],
      "answer": "Dormía"
    }
  },
  {
    "id": "r27",
    "title": "Dando consejos",
    "subtitle": "Giving advice",
    "level": "intermediate-high",
    "icon": "💡",
    "sentences": [
      {
        "es": "Chicos, coged el paraguas, que va a llover.",
        "en": "Guys, grab your umbrellas, it's going to rain."
      },
      {
        "es": "No os preocupéis tanto por el examen, seguro que os sale bien.",
        "en": "Don't worry so much about the exam, I'm sure it'll go well."
      },
      {
        "es": "Venid pronto, que la cena se enfría.",
        "en": "Come soon, dinner's getting cold."
      },
      {
        "es": "No cojáis el coche si habéis bebido, coged un taxi.",
        "en": "Don't take the car if you've been drinking, take a taxi."
      },
      {
        "es": "Escuchad bien las instrucciones antes de empezar.",
        "en": "Listen carefully to the instructions before you start."
      },
      {
        "es": "No dejéis los deberes para el último momento.",
        "en": "Don't leave your homework till the last minute."
      },
      {
        "es": "Sed puntuales, que el tren no espera a nadie.",
        "en": "Be punctual, the train doesn't wait for anyone."
      },
      {
        "es": "Llamadme si tenéis cualquier problema, vale.",
        "en": "Call me if you all have any problem, okay."
      }
    ],
    "grammar": {
      "title": "Informal vosotros commands",
      "pattern": "affirmative: infinitive -r → -d (coged, venid) · negative: no + vosotros present subjunctive (no cojáis)",
      "explain": "This is the plural you-all command reserved for Spain, used constantly with friends, family, and groups of kids. Affirmative commands swap the infinitive's final -r for -d (coger → coged, venir → venid); negative commands borrow the vosotros present subjunctive instead (no cojáis, no vengáis).",
      "examples": [
        {
          "es": "Comed algo antes de salir.",
          "en": "Eat something before you go out."
        },
        {
          "es": "No lleguéis tarde.",
          "en": "Don't be late."
        }
      ],
      "commonMistake": "Don't build the negative vosotros command off the affirmative form — 'no coged' is wrong; the negative needs the subjunctive ending, 'no cojáis'."
    },
    "drill": {
      "question": "Which is the correct negative vosotros command for 'don't be late'?",
      "options": [
        "No lleguéis tarde",
        "No llegad tarde",
        "No llegáis tarde"
      ],
      "answer": "No lleguéis tarde"
    }
  },
  {
    "id": "r28",
    "title": "El medio ambiente",
    "subtitle": "The environment",
    "level": "intermediate-high",
    "icon": "🌍",
    "sentences": [
      {
        "es": "Es importante que reciclemos el vidrio y el plástico por separado.",
        "en": "It's important that we recycle glass and plastic separately."
      },
      {
        "es": "Es necesario que el gobierno invierta más en energías renovables.",
        "en": "It's necessary for the government to invest more in renewable energy."
      },
      {
        "es": "Es una lástima que se desperdicie tanta agua en las ciudades.",
        "en": "It's a shame that so much water gets wasted in cities."
      },
      {
        "es": "Conviene que apaguemos las luces al salir de casa.",
        "en": "It's a good idea for us to turn off the lights when we leave home."
      },
      {
        "es": "Es probable que el cambio climático empeore si no actuamos ya.",
        "en": "It's likely that climate change will get worse if we don't act now."
      },
      {
        "es": "No es normal que haga tanto calor en pleno octubre.",
        "en": "It's not normal for it to be this hot in the middle of October."
      },
      {
        "es": "Es fundamental que las empresas reduzcan las emisiones cuanto antes.",
        "en": "It's essential that companies reduce emissions as soon as possible."
      },
      {
        "es": "Basta con que cada uno haga un pequeño cambio para que se note.",
        "en": "It's enough for each person to make a small change for it to show."
      }
    ],
    "grammar": {
      "title": "Subjunctive after impersonal expressions",
      "pattern": "es importante/necesario/una lástima que + subjunctive",
      "explain": "Impersonal opinion phrases like es importante que, es necesario que, and es una lástima que push the verb that follows into the subjunctive, because they're expressing what should happen or how someone feels about it, not a plain fact. A handful of exceptions — es verdad que, es cierto que — keep the indicative, since those state something as objectively true.",
      "examples": [
        {
          "es": "Es necesario que lo hagamos hoy.",
          "en": "It's necessary that we do it today."
        },
        {
          "es": "Es una pena que no vengas.",
          "en": "It's a shame you're not coming."
        }
      ],
      "commonMistake": "'Es importante que reciclamos' is a very common slip — the impersonal expression triggers the subjunctive, so it must be 'reciclemos'."
    },
    "drill": {
      "question": "Which correctly completes 'Es importante que lo ___ pronto'?",
      "options": [
        "hagamos",
        "hacemos",
        "haremos"
      ],
      "answer": "hagamos"
    }
  },
  {
    "id": "r29",
    "title": "Planes futuros",
    "subtitle": "Future plans",
    "level": "intermediate-high",
    "icon": "🔮",
    "sentences": [
      {
        "es": "El año que viene me mudaré a un piso más grande.",
        "en": "Next year I'll move to a bigger flat."
      },
      {
        "es": "Cuando termine la carrera, buscaré trabajo en Madrid.",
        "en": "When I finish my degree, I'll look for work in Madrid."
      },
      {
        "es": "Mis padres vendrán a visitarme por Navidad.",
        "en": "My parents will come visit me at Christmas."
      },
      {
        "es": "¿Qué harás cuando te jubiles?",
        "en": "What will you do when you retire?"
      },
      {
        "es": "Estudiaremos juntos para el examen del viernes.",
        "en": "We'll study together for Friday's exam."
      },
      {
        "es": "Dentro de unos años, seguramente tendré coche propio.",
        "en": "In a few years, I'll probably have my own car."
      },
      {
        "es": "Si todo va bien, ahorraré lo suficiente para el viaje este verano.",
        "en": "If all goes well, I'll save enough for the trip this summer."
      },
      {
        "es": "No sé todavía dónde viviré, pero seguro que será cerca de la playa.",
        "en": "I don't know yet where I'll live, but I'm sure it'll be near the beach."
      }
    ],
    "grammar": {
      "title": "The simple future tense",
      "pattern": "infinitive + -é, -ás, -á, -emos, -éis, -án",
      "explain": "The simple future is built by adding one set of endings straight onto the infinitive, with no stem change for regular verbs: mudar + é, viviré, seremos. A handful of common verbs have irregular stems (tendré, haré, vendrán) but they still take the exact same endings.",
      "examples": [
        {
          "es": "Iré a la playa este fin de semana.",
          "en": "I'll go to the beach this weekend."
        },
        {
          "es": "Tendremos que decidir pronto.",
          "en": "We'll have to decide soon."
        }
      ],
      "commonMistake": "Don't drop the accent on the yo/él/ella forms — 'mudare' without the accent isn't the future tense; it has to be 'mudaré'. Also watch irregular stems: 'teneré' is wrong, it's 'tendré'."
    },
    "drill": {
      "question": "Which is the correct future form of 'tener' for 'nosotros'?",
      "options": [
        "tendremos",
        "teneremos",
        "tenimos"
      ],
      "answer": "tendremos"
    }
  },
  {
    "id": "r30",
    "title": "Narración extendida",
    "subtitle": "Extended storytelling",
    "level": "advanced-low",
    "icon": "📜",
    "sentences": [
      {
        "es": "Cuando era pequeña, pasábamos los veranos en el pueblo de mi abuela, en un caserío perdido entre montañas.",
        "en": "When I was little, we used to spend summers in my grandmother's village, in a farmhouse lost among the mountains."
      },
      {
        "es": "Nos levantábamos con el sol porque había que ordeñar las vacas antes de que apretara el calor.",
        "en": "We got up with the sun because the cows had to be milked before the heat set in."
      },
      {
        "es": "Un verano, mientras jugábamos en el río, se puso a tronar de repente y tuvimos que correr a refugiarnos.",
        "en": "One summer, while we were playing in the river, it suddenly started thundering and we had to run for shelter."
      },
      {
        "es": "Recuerdo que mi abuelo, que apenas hablaba, me enseñó a pescar sin decir casi una palabra.",
        "en": "I remember my grandfather, who barely spoke, taught me to fish without saying almost a word."
      },
      {
        "es": "Aquella experiencia me marcó de una manera que no entendí del todo hasta muchos años después.",
        "en": "That experience shaped me in a way I didn't fully understand until many years later."
      },
      {
        "es": "Hoy, cada vez que huelo a leña quemada, me viene a la cabeza aquel verano entero.",
        "en": "Today, whenever I smell burning wood, that whole summer comes rushing back to me."
      },
      {
        "es": "Aunque ya no queda casi nadie en el pueblo, sigo yendo cada agosto porque siento que le debo algo a ese lugar.",
        "en": "Although there's hardly anyone left in the village, I still go every August because I feel I owe that place something."
      },
      {
        "es": "Si mis abuelos no me hubieran criado así, aunque fuera solo unos meses al año, no sería la persona que soy ahora.",
        "en": "If my grandparents hadn't raised me that way, even if only for a few months a year, I wouldn't be the person I am now."
      }
    ],
    "grammar": {
      "title": "Fluent tense-blending in a story",
      "pattern": "imperfect for scene-setting · preterite for the pivotal event · connectors (mientras, de repente, aunque, hasta que) stitch it into one account",
      "explain": "At this level the skill isn't choosing one tense over the other — it's weaving both fluidly across a whole story using connectors like mientras, de repente, and aunque, so the account reads as continuous instead of a list of separate facts. Notice how a single sentence can hold a background imperfect (pasábamos), a pivotal preterite (se puso a tronar), and a reflection that reaches into the present.",
      "examples": [
        {
          "es": "Vivíamos tranquilos hasta que un día todo cambió.",
          "en": "We were living peacefully until one day everything changed."
        },
        {
          "es": "Aunque llovía a cántaros, decidimos salir de todas formas.",
          "en": "Although it was pouring rain, we decided to go out anyway."
        }
      ],
      "commonMistake": "Chaining short, single-tense sentences (Fuimos. Comimos. Volvimos.) is grammatically fine but reads like a list, not a story — advanced narration needs subordinate clauses and real tense-mixing to sound genuinely fluent."
    },
    "drill": {
      "question": "Which sentence correctly blends background and event?",
      "options": [
        "Jugábamos en el río cuando se puso a tronar",
        "Jugamos en el río cuando se ponía a tronar",
        "Jugábamos en el río cuando se ponía a tronar"
      ],
      "answer": "Jugábamos en el río cuando se puso a tronar"
    }
  },
  {
    "id": "r31",
    "title": "Argumentando una opinión",
    "subtitle": "Defending an opinion",
    "level": "advanced-low",
    "icon": "🧠",
    "sentences": [
      {
        "es": "Dudo mucho que subir los impuestos sea la única solución posible.",
        "en": "I seriously doubt that raising taxes is the only possible solution."
      },
      {
        "es": "No creo que el problema se solucione simplemente prohibiendo las cosas.",
        "en": "I don't think the problem gets solved just by banning things."
      },
      {
        "es": "No es cierto que todos los jóvenes sean unos vagos, como dicen algunos.",
        "en": "It's not true that all young people are lazy, as some claim."
      },
      {
        "es": "Niego rotundamente que esa medida vaya a mejorar la situación.",
        "en": "I flatly deny that that measure is going to improve the situation."
      },
      {
        "es": "Es dudoso que ese estudio refleje la realidad de la mayoría.",
        "en": "It's doubtful that study reflects the reality of most people."
      },
      {
        "es": "No pienso que haya una respuesta sencilla a un problema tan complejo.",
        "en": "I don't think there's a simple answer to such a complex problem."
      },
      {
        "es": "Dudo que a nadie le convenza ese argumento tal y como está planteado.",
        "en": "I doubt that argument is going to convince anyone the way it's currently framed."
      },
      {
        "es": "No niego que haya cosas que mejorar, pero de ahí a decir que todo está mal hay un trecho.",
        "en": "I'm not denying there are things to improve, but that's a long way from saying everything is wrong."
      }
    ],
    "grammar": {
      "title": "Subjunctive with doubt and negation",
      "pattern": "dudar que / no creer que / no es cierto que + subjunctive",
      "explain": "Doubt and denial both signal that you're not vouching for something as fact, so the subjunctive follows: dudo que sea, no creo que se solucione. Flip it around — creo que, es cierto que, no dudo que — and you're back to the indicative, because now you're asserting something as true.",
      "examples": [
        {
          "es": "Dudo que llegue a tiempo.",
          "en": "I doubt he'll arrive on time."
        },
        {
          "es": "No es cierto que no me importe.",
          "en": "It's not true that I don't care."
        }
      ],
      "commonMistake": "The switch is easy to miss going the other direction: 'no dudo que sea verdad' should actually take the indicative in most contexts — no dudo que ES verdad — because 'no dudar' asserts certainty rather than doubt, the opposite of what the usual rule might suggest."
    },
    "drill": {
      "question": "Which correctly completes 'No creo que ___ razón'?",
      "options": [
        "tenga",
        "tiene",
        "tendrá"
      ],
      "answer": "tenga"
    }
  },
  {
    "id": "r32",
    "title": "Hipótesis",
    "subtitle": "Hypotheticals",
    "level": "advanced-low",
    "icon": "🤔",
    "sentences": [
      {
        "es": "Si tuviera más tiempo libre, aprendería a tocar la guitarra.",
        "en": "If I had more free time, I'd learn to play guitar."
      },
      {
        "es": "Si me tocara la lotería, dejaría el trabajo sin pensármelo dos veces.",
        "en": "If I won the lottery, I'd quit my job without a second thought."
      },
      {
        "es": "Iríamos a vivir al extranjero si no fuera por la familia.",
        "en": "We'd go live abroad if it weren't for family."
      },
      {
        "es": "Si hubiera estudiado más, habría aprobado el examen sin problema.",
        "en": "If I had studied more, I would have passed the exam easily."
      },
      {
        "es": "¿Qué harías tú si estuvieras en mi lugar?",
        "en": "What would you do if you were in my position?"
      },
      {
        "es": "Si pudiera cambiar algo del pasado, no cambiaría casi nada.",
        "en": "If I could change something from the past, I wouldn't change almost anything."
      },
      {
        "es": "Si no hubiera cogido ese vuelo, no habría conocido a mi mejor amigo.",
        "en": "If I hadn't taken that flight, I wouldn't have met my best friend."
      },
      {
        "es": "Viviríamos mucho más tranquilos si dejáramos de compararnos con los demás.",
        "en": "We'd live much more peacefully if we stopped comparing ourselves to others."
      }
    ],
    "grammar": {
      "title": "Conditional + si-clauses",
      "pattern": "si + imperfect subjunctive, + conditional · si + pluperfect subjunctive, + conditional perfect",
      "explain": "Spanish has two flavors of 'if': for something contrary to fact right now, use si + imperfect subjunctive with a plain conditional (si tuviera, iría); for something that didn't happen in the past, step one layer further back with si + pluperfect subjunctive and conditional perfect (si hubiera estudiado, habría aprobado). Either way, the si-half itself never takes the conditional.",
      "examples": [
        {
          "es": "Si fuera tú, no lo haría.",
          "en": "If I were you, I wouldn't do it."
        },
        {
          "es": "Si hubiéramos salido antes, no habríamos perdido el tren.",
          "en": "If we had left earlier, we wouldn't have missed the train."
        }
      ],
      "commonMistake": "'Si tendría tiempo, iría' is a very common error — the si-half can never hold the conditional; it needs the subjunctive instead: 'si tuviera tiempo'."
    },
    "drill": {
      "question": "Which correctly completes 'Si ___ estudiado más, habría aprobado'?",
      "options": [
        "hubiera",
        "habría",
        "había"
      ],
      "answer": "hubiera"
    }
  },
  {
    "id": "r33",
    "title": "El mundo laboral",
    "subtitle": "The professional world",
    "level": "advanced-low",
    "icon": "💼",
    "sentences": [
      {
        "es": "Se necesita camarero con experiencia para los fines de semana.",
        "en": "Waiter needed with experience for weekends."
      },
      {
        "es": "En esta empresa se valora mucho la puntualidad.",
        "en": "In this company punctuality is highly valued."
      },
      {
        "es": "Se requiere nivel alto de inglés para el puesto de comercial.",
        "en": "A high level of English is required for the sales position."
      },
      {
        "es": "Aquí se contrata sobre todo a gente con contactos, la verdad.",
        "en": "Here they mostly hire people with connections, to be honest."
      },
      {
        "es": "Se buscan candidatos con ganas de aprender, más que con experiencia.",
        "en": "Candidates with eagerness to learn are sought, more than experience."
      },
      {
        "es": "Se firmó el contrato la semana pasada y empiezo el lunes.",
        "en": "The contract was signed last week and I start Monday."
      },
      {
        "es": "Se rumorea que van a hacer recortes de personal el año que viene.",
        "en": "There are rumors that they're going to make staff cuts next year."
      },
      {
        "es": "Últimamente se está apostando mucho por el teletrabajo en el sector.",
        "en": "Lately there's a big push for remote work in the sector."
      }
    ],
    "grammar": {
      "title": "Impersonal / passive se",
      "pattern": "se + verb (agreeing with what follows), with no named subject",
      "explain": "Job ads, company policies, and workplace gossip constantly hide who's doing the action behind se: se necesita, se valora, se buscan candidatos. When a plural noun follows the verb, treat it like the grammatical subject and make the verb agree with it — se buscan candidatos, not se busca candidatos.",
      "examples": [
        {
          "es": "Se ofrece formación gratuita.",
          "en": "Free training is offered."
        },
        {
          "es": "Se solicitan repartidores con moto propia.",
          "en": "Delivery drivers with their own motorbike wanted."
        }
      ],
      "commonMistake": "'Se busca candidatos' (singular verb with a plural noun) is a frequent slip — the noun after se controls agreement, so it has to be 'se buscan candidatos'."
    },
    "drill": {
      "question": "Which correctly completes a job ad needing several people: 'Se ___ dependientes para la tienda'?",
      "options": [
        "necesitan",
        "necesita",
        "necesitas"
      ],
      "answer": "necesitan"
    }
  },
  {
    "id": "r34",
    "title": "Temas abstractos",
    "subtitle": "Identity, culture & values",
    "level": "advanced-low",
    "icon": "🧩",
    "sentences": [
      {
        "es": "Me alegra mucho que cada vez se hable más abiertamente de salud mental.",
        "en": "I'm really glad that mental health is talked about more openly these days."
      },
      {
        "es": "Es una pena que tantas tradiciones se estén perdiendo con las nuevas generaciones.",
        "en": "It's a shame that so many traditions are being lost with new generations."
      },
      {
        "es": "Me da rabia que se juzgue tan rápido a quien piensa diferente.",
        "en": "It bothers me that people who think differently get judged so quickly."
      },
      {
        "es": "Me sorprende que la identidad de alguien pueda cambiar tanto según el contexto.",
        "en": "It surprises me that someone's identity can change so much depending on the context."
      },
      {
        "es": "Me preocupa que perdamos ciertos valores por perseguir el éxito a toda costa.",
        "en": "It worries me that we might lose certain values by chasing success at all costs."
      },
      {
        "es": "Ojalá que las próximas generaciones valoren más lo que tienen.",
        "en": "I hope future generations appreciate more what they have."
      },
      {
        "es": "Es curioso que dos personas de la misma familia entiendan la vida de forma tan distinta.",
        "en": "It's curious that two people from the same family understand life so differently."
      },
      {
        "es": "Siento que a veces nos falte espacio para hablar de estas cosas sin juzgarnos.",
        "en": "I feel like sometimes we lack the space to talk about these things without judging each other."
      }
    ],
    "grammar": {
      "title": "Subjunctive triggered by emotion",
      "pattern": "me alegra que / es una pena que / me preocupa que + subjunctive",
      "explain": "Whenever a sentence expresses a feeling about someone else's action or a situation — joy, worry, surprise, regret — the verb describing that situation shifts into the subjunctive, because you're reacting to it rather than reporting it as neutral fact: me alegra que se hable, not se habla. This holds even when the feeling is mild, like 'es curioso que'.",
      "examples": [
        {
          "es": "Me sorprende que no lo sepas.",
          "en": "It surprises me that you don't know."
        },
        {
          "es": "Es una pena que no puedas venir.",
          "en": "It's a shame you can't come."
        }
      ],
      "commonMistake": "'Me alegra que estás aquí' is a common slip — the emotional trigger (me alegra que) needs the subjunctive no matter how obviously true the fact is: 'me alegra que estés aquí'."
    },
    "drill": {
      "question": "Which correctly completes 'Me preocupa que no ___ suficiente'?",
      "options": [
        "comas",
        "comes",
        "comerás"
      ],
      "answer": "comas"
    }
  },
  {
    "id": "r35",
    "title": "Debates y matices",
    "subtitle": "Debates & nuance",
    "level": "advanced-low",
    "icon": "⚖️",
    "sentences": [
      {
        "es": "Aunque llueve, vamos a salir a dar una vuelta de todas formas.",
        "en": "Although it's raining, we're going out for a walk anyway."
      },
      {
        "es": "Aunque llueva mañana, el concierto se va a celebrar igualmente.",
        "en": "Even if it rains tomorrow, the concert will happen all the same."
      },
      {
        "es": "Aunque no estoy del todo de acuerdo contigo, entiendo tu punto de vista.",
        "en": "Although I don't fully agree with you, I understand your point of view."
      },
      {
        "es": "Aunque no estés de acuerdo conmigo, respeto tu opinión igualmente.",
        "en": "Even if you don't agree with me, I respect your opinion all the same."
      },
      {
        "es": "Aunque es un tema complicado, merece la pena hablarlo con calma.",
        "en": "Although it's a complicated topic, it's worth discussing calmly."
      },
      {
        "es": "Por muy complicado que sea el tema, siempre hay que intentar dialogar.",
        "en": "However complicated the topic may be, you always have to try to talk it through."
      },
      {
        "es": "Aunque tenga razón en parte, no significa que la solución sea tan sencilla.",
        "en": "Even granting that he might be partly right, it doesn't mean the solution is that simple."
      },
      {
        "es": "Aunque al final no cambiemos de opinión el uno al otro, al menos habremos hablado con respeto.",
        "en": "Even if in the end we don't change each other's minds, at least we'll have talked with respect."
      }
    ],
    "grammar": {
      "title": "Concessive aunque: indicative vs. subjunctive",
      "pattern": "aunque + indicative = known/established fact · aunque + subjunctive = hypothetical, unconfirmed, or dismissed as irrelevant",
      "explain": "Aunque doesn't lock in one mood — the speaker's stance decides. Use the indicative when the fact is real and you're simply granting it (aunque llueve = it IS raining, and I'm telling you so). Use the subjunctive when the fact is unconfirmed (aunque llueva mañana = it might rain, we don't know yet) or when you're waving it away as beside the point regardless of whether it's true (aunque tenga razón = even granting, hypothetically, that he's right). Same word, near-identical sentence — the mood alone carries real information about what you actually know or care about.",
      "examples": [
        {
          "es": "Aunque hace frío, salgo a correr.",
          "en": "Although it's cold (it is cold, a known fact), I'm going for a run."
        },
        {
          "es": "Aunque haga frío mañana, saldré a correr.",
          "en": "Even if it's cold tomorrow (not yet known), I'll go for a run."
        }
      ],
      "commonMistake": "Learners often default to the subjunctive after aunque just because it 'feels advanced' — but 'aunque llueva' when you can see it's currently pouring outside is wrong; a known, present fact takes the indicative, 'aunque llueve'."
    },
    "drill": {
      "question": "You can see it's raining right now. Which is correct: 'Aunque ___, salimos a pasear'?",
      "options": [
        "llueve",
        "llueva",
        "lloverá"
      ],
      "answer": "llueve"
    }
  }
];

export const ROADMAP_UNITS = RAW_UNITS;
