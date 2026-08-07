// Conversation material for the practice partner.
//
// The thing that makes scripted dialogue feel robotic is one-off replies: you
// answer, it says something unrelated, you answer again. Real conversations go
// somewhere. So each topic is a THREAD — an opener followed by probes that dig
// progressively further into the same subject, the way a person actually
// follows up.
//
// tier gates difficulty against the learner's ACTFL estimate:
//   0 = Novice        · concrete, answerable in a phrase
//   1 = Intermediate  · past tense, comparison, short narration
//   2 = Advanced      · opinion, hypothesis, argument
//
// All Spanish is everyday Mexican Spanish.

export const THREADS = [
  {
    id: "dia", icon: "☀️", label: "Tu día",
    match: /\b(hoy|día|dia|mañana|tarde|noche|cansad|ocupad|temprano)\b/i,
    open: { es: "¿Cómo te ha ido hoy?", en: "How's your day been?" },
    probes: [
      { tier: 0, es: "¿A qué hora te levantaste?", en: "What time did you get up?" },
      { tier: 0, es: "¿Ya comiste algo?", en: "Have you eaten yet?" },
      { tier: 0, es: "¿Tienes mucho que hacer hoy?", en: "Do you have a lot to do today?" },
      { tier: 1, es: "¿Qué fue lo mejor de tu día hasta ahorita?", en: "What's been the best part of your day so far?" },
      { tier: 1, es: "¿Hiciste algo diferente de lo normal?", en: "Did you do anything different from usual?" },
      { tier: 2, es: "Si pudieras repetir el día, ¿qué cambiarías?", en: "If you could redo the day, what would you change?" }
    ]
  },
  {
    id: "familia", icon: "👪", label: "La familia",
    match: /\b(familia|hermano|hermana|papá|papa|mamá|mama|hijo|hija|esposa|esposo|primo|abuel|tío|tia)\w*/i,
    open: { es: "Cuéntame de tu familia. ¿Son muchos?", en: "Tell me about your family. Are there a lot of you?" },
    probes: [
      { tier: 0, es: "¿Tienes hermanos?", en: "Do you have siblings?" },
      { tier: 0, es: "¿Con quién vives?", en: "Who do you live with?" },
      { tier: 0, es: "¿Cómo se llama tu mamá?", en: "What's your mom's name?" },
      { tier: 1, es: "¿A quién te pareces más de tu familia?", en: "Who in your family are you most like?" },
      { tier: 1, es: "¿Se juntan seguido? Cuéntame de la última vez.", en: "Do you get together often? Tell me about the last time." },
      { tier: 2, es: "¿Crees que las familias de antes eran más unidas que las de ahora?", en: "Do you think families used to be closer than they are now?" }
    ]
  },
  {
    id: "comida", icon: "🌮", label: "La comida",
    match: /\b(comida|com[ií]|taco|tortilla|salsa|picante|hambre|antojo|cocin|desayun|cen[ao]|restaurante)\w*/i,
    open: { es: "¿Qué comiste hoy? A mí me encanta hablar de comida.", en: "What did you eat today? I love talking about food." },
    probes: [
      { tier: 0, es: "¿Cuál es tu comida favorita?", en: "What's your favorite food?" },
      { tier: 0, es: "¿Te gusta lo picante?", en: "Do you like spicy food?" },
      { tier: 0, es: "¿Desayunas todos los días?", en: "Do you eat breakfast every day?" },
      { tier: 1, es: "¿Sabes cocinar? ¿Qué te sale bien?", en: "Do you know how to cook? What do you make well?" },
      { tier: 1, es: "Cuéntame de la mejor comida que has probado.", en: "Tell me about the best meal you've ever had." },
      { tier: 2, es: "¿Por qué crees que la comida es tan importante en la cultura mexicana?", en: "Why do you think food matters so much in Mexican culture?" }
    ]
  },
  {
    id: "trabajo", icon: "💼", label: "El trabajo",
    match: /\b(trabaj|oficina|jefe|chamba|empleo|estudi|escuela|universidad|clase)\w*/i,
    open: { es: "¿En qué trabajas, o qué estudias?", en: "What do you do for work, or what do you study?" },
    probes: [
      { tier: 0, es: "¿Te gusta lo que haces?", en: "Do you like what you do?" },
      { tier: 0, es: "¿A qué hora empiezas?", en: "What time do you start?" },
      { tier: 0, es: "¿Trabajas en casa o vas a una oficina?", en: "Do you work at home or go to an office?" },
      { tier: 1, es: "¿Qué es lo más difícil de tu trabajo?", en: "What's the hardest part of your job?" },
      { tier: 1, es: "¿Cómo llegaste a hacer eso? Cuéntame.", en: "How did you end up doing that? Tell me." },
      { tier: 2, es: "¿Crees que la gente debería trabajar menos horas? ¿Por qué?", en: "Do you think people should work fewer hours? Why?" }
    ]
  },
  {
    id: "libre", icon: "⚽", label: "Tiempo libre",
    match: /\b(gusta|hobby|pasatiempo|música|musica|película|pelicula|series|leer|libro|deporte|fútbol|futbol|juego|videojuego|correr|gym)\w*/i,
    open: { es: "¿Qué te gusta hacer cuando tienes tiempo libre?", en: "What do you like to do in your free time?" },
    probes: [
      { tier: 0, es: "¿Qué música te gusta?", en: "What music do you like?" },
      { tier: 0, es: "¿Ves mucha tele?", en: "Do you watch a lot of TV?" },
      { tier: 0, es: "¿Haces algún deporte?", en: "Do you play any sports?" },
      { tier: 1, es: "¿Desde cuándo te gusta eso?", en: "How long have you liked that?" },
      { tier: 1, es: "Cuéntame de la última película o serie que viste.", en: "Tell me about the last movie or show you watched." },
      { tier: 2, es: "¿Crees que hoy la gente tiene menos tiempo libre que antes?", en: "Do you think people have less free time now than before?" }
    ]
  },
  {
    id: "viajes", icon: "✈️", label: "Viajes",
    match: /\b(viaj|vacacion|playa|ciudad|pueblo|avión|avion|hotel|turis|méxico|mexico|extranjero)\w*/i,
    open: { es: "¿Te gusta viajar? ¿A dónde has ido?", en: "Do you like to travel? Where have you been?" },
    probes: [
      { tier: 0, es: "¿Prefieres la playa o la montaña?", en: "Do you prefer the beach or the mountains?" },
      { tier: 0, es: "¿Has ido a México?", en: "Have you been to Mexico?" },
      { tier: 0, es: "¿Viajas con alguien o por tu cuenta?", en: "Do you travel with someone or on your own?" },
      { tier: 1, es: "Cuéntame del mejor viaje que has hecho.", en: "Tell me about the best trip you've taken." },
      { tier: 1, es: "¿Alguna vez se te complicó algo viajando?", en: "Has anything ever gone wrong while traveling?" },
      { tier: 2, es: "¿Crees que viajar realmente cambia a la gente?", en: "Do you think traveling really changes people?" }
    ]
  },
  {
    id: "amigos", icon: "🧑‍🤝‍🧑", label: "Los amigos",
    match: /\b(amig|cuate|compa|fiesta|salir|sal[ií]|conoc[ií])\w*/i,
    open: { es: "¿Y tus amigos? ¿Los ves seguido?", en: "What about your friends? Do you see them often?" },
    probes: [
      { tier: 0, es: "¿Cuántos amigos cercanos tienes?", en: "How many close friends do you have?" },
      { tier: 0, es: "¿Qué hacen cuando salen?", en: "What do you do when you go out?" },
      { tier: 1, es: "¿Cómo conociste a tu mejor amigo?", en: "How did you meet your best friend?" },
      { tier: 1, es: "Cuéntame de la última vez que salieron juntos.", en: "Tell me about the last time you went out together." },
      { tier: 2, es: "¿Qué hace que una amistad dure años?", en: "What makes a friendship last for years?" }
    ]
  },
  {
    id: "rutina", icon: "🕗", label: "La rutina",
    match: /\b(rutina|siempre|normalmente|todos los días|temprano|tarde|dormir|duermo|despierto)\b/i,
    open: { es: "¿Cómo es un día normal para ti?", en: "What's a normal day like for you?" },
    probes: [
      { tier: 0, es: "¿A qué hora te duermes?", en: "What time do you go to sleep?" },
      { tier: 0, es: "¿Tomas café en la mañana?", en: "Do you drink coffee in the morning?" },
      { tier: 1, es: "¿Qué parte del día te gusta más y por qué?", en: "What part of the day do you like most, and why?" },
      { tier: 1, es: "¿Ha cambiado tu rutina en el último año?", en: "Has your routine changed in the last year?" },
      { tier: 2, es: "¿Crees que las rutinas ayudan o limitan a la gente?", en: "Do you think routines help people or limit them?" }
    ]
  },
  {
    id: "opinion", icon: "💭", label: "Opiniones",
    match: /\b(creo|pienso|opini[oó]n|me parece|siento que|importante|deber[ií]a)\b/i,
    open: { es: "Me interesa lo que piensas. ¿Hay algo que te importe mucho ahorita?", en: "I'm curious what you think. Is there something you care a lot about right now?" },
    probes: [
      { tier: 1, es: "¿Por qué piensas así?", en: "Why do you think that?" },
      { tier: 1, es: "¿Siempre has opinado igual, o cambiaste de idea?", en: "Have you always thought that, or did you change your mind?" },
      { tier: 2, es: "¿Qué le dirías a alguien que piensa lo contrario?", en: "What would you say to someone who thinks the opposite?" },
      { tier: 2, es: "Si estuviera en tus manos, ¿qué cambiarías?", en: "If it were up to you, what would you change?" },
      { tier: 2, es: "¿Cómo crees que va a estar eso en diez años?", en: "How do you think that will look in ten years?" }
    ]
  }
];

// Said before the question, so the bot reacts to you instead of interrogating
// you. Matched against what you actually wrote.
export const REACTIONS = [
  { match: /\b(no s[eé]|no entiendo|no sabía|no se)\b/i, lines: [
    { es: "No te preocupes, así se aprende.", en: "Don't worry, that's how you learn." },
    { es: "Está bien, vamos con calma.", en: "That's fine, let's take it slow." }
  ] },
  { match: /\b(triste|mal|difícil|dificil|cansad|problema|preocup|enoj)\w*/i, lines: [
    { es: "Ay, lo siento.", en: "Oh, I'm sorry." },
    { es: "Qué pesado, de verdad.", en: "That's really rough." }
  ] },
  { match: /\b(bien|bueno|feliz|content|padre|chido|genial|excelente|me encanta|me gusta)\w*/i, lines: [
    { es: "¡Qué padre!", en: "That's great!" },
    { es: "Órale, qué bueno.", en: "Oh nice, that's good." },
    { es: "Me da gusto oír eso.", en: "I'm glad to hear that." }
  ] },
  { match: /\b(bastante|siempre|todos los días|un montón)\b/i, lines: [
    { es: "Órale, sí que es harto.", en: "Wow, that really is a lot." },
    { es: "Vaya, no es poco.", en: "Wow, that's no small thing." }
  ] }
];

export const NEUTRAL_REACTIONS = [
  { es: "Ah, mira.", en: "Ah, I see." },
  { es: "Ya veo.", en: "I see." },
  { es: "Interesante.", en: "Interesting." },
  { es: "Órale.", en: "Wow." },
  { es: "Qué bien.", en: "Nice." }
];

// Used when a thread runs out and the bot moves on, so the switch is announced
// rather than jarring.
export const PIVOTS = [
  { es: "Oye, cambiando de tema —", en: "Hey, changing the subject —" },
  { es: "Por cierto,", en: "By the way," },
  { es: "Ah, y otra cosa —", en: "Oh, and another thing —" }
];

// High-precision patterns only. A wrong "fact" repeated back is far worse than
// no callback at all, so these deliberately miss rather than guess.
export const MEMORY_RULES = [
  { key: "nombre", re: /\b(?:me llamo|mi nombre es)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ]{2,20})/i },
  { key: "lugar", re: /\b(?:vivo en|soy de)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ][A-Za-zÁÉÍÓÚÑáéíóúñ\s]{1,24}?)(?=[.,;!?]|$)/i },
  { key: "trabajo", re: /\btrabajo (?:en|de|como)\s+([a-záéíóúñ][a-záéíóúñ\s]{1,24}?)(?=[.,;!?]|$)/i },
  { key: "gusto", re: /\bme gustan?\s+((?:el |la |los |las )?[a-záéíóúñ][a-záéíóúñ\s]{1,26}?)(?=[.,;!?]|$)/i }
];

// Unpredictability banks — used sparingly by core/conversationEngine.js so
// the partner occasionally behaves like a real person mid-conversation:
// mishearing you, cutting in with a tangent, asking you to clarify, or
// stacking two questions in one turn. Every line ends in "?" on purpose —
// Immersion Mode's test suite checks that nearly every bot reply asks
// something, and these fire in the same slot a normal probe would.

export const MISUNDERSTANDINGS = [
  { es: "Perdón, ¿qué dijiste? No alcancé a oír bien.", en: "Sorry, what did you say? I didn't quite catch that." },
  { es: "Espera, ¿dijiste que sí o que no? Me perdí.", en: "Wait, did you say yes or no? I got lost." },
  { es: "Ay, creí que habías dicho otra cosa — ¿me lo repites?", en: "Oh, I thought you said something else — can you repeat it?" },
  { es: "¿Cómo? Se me fue la onda un segundo, ¿qué contabas?", en: "What? I spaced out for a second, what were you telling me?" },
  { es: "Mmm, ¿en serio dijiste eso? No estoy segura de haber entendido.", en: "Hmm, did you really say that? I'm not sure I understood." }
];

export const INTERRUPTIONS = [
  { es: "Espera, espera — antes de que sigas, ¿ya viste que va a llover?", en: "Wait, wait — before you go on, did you see it's about to rain?" },
  { es: "Ay, perdón que te interrumpa, pero se me acaba de ocurrir algo: ¿ya comiste?", en: "Sorry to interrupt, but something just occurred to me: have you eaten yet?" },
  { es: "Un momento — ¿oíste eso? Bueno, no importa. ¿En qué íbamos?", en: "Hold on — did you hear that? Never mind. Where were we?" },
  { es: "Perdón, se me cruzó un pensamiento — ¿tú crees que va a estar bien el clima este fin?", en: "Sorry, a thought just crossed my mind — do you think the weather will be good this weekend?" },
  { es: "Espérame tantito, ¿me repites lo último? Se me fue el hilo.", en: "Hold on a sec, can you repeat that last part? I lost my train of thought." }
];

export const CLARIFICATION_REQUESTS = [
  { es: "No sé si entendí bien — ¿me lo puedes explicar de otra forma?", en: "I'm not sure I understood — can you explain it another way?" },
  { es: "¿A qué te refieres exactamente con eso?", en: "What exactly do you mean by that?" },
  { es: "¿Puedes ser más específico? No me quedó claro.", en: "Can you be more specific? That wasn't clear to me." },
  { es: "Eso no me quedó del todo claro, ¿me explicas otra vez?", en: "That wasn't entirely clear to me, can you explain again?" }
];

export const MULTI_QUESTION_PROBES = [
  { es: "Oye, dos cosas: ¿cómo te fue hoy y ya comiste algo?", en: "Hey, two things: how was your day, and have you eaten?" },
  { es: "Cuéntame, ¿qué hiciste ayer y con quién estabas?", en: "Tell me, what did you do yesterday, and who were you with?" },
  { es: "¿Qué tal tu semana, y ya tienes planes para el fin?", en: "How's your week been, and do you already have weekend plans?" },
  { es: "A ver, ¿de dónde eres y qué te trae por aquí?", en: "So, where are you from, and what brings you here?" }
];

export const CALLBACKS = {
  nombre: [
    { es: "Oye {v}, ¿y qué más me cuentas?", en: "Hey {v}, what else can you tell me?" },
    { es: "{v}, tengo curiosidad — ¿qué te gusta hacer?", en: "{v}, I'm curious — what do you like doing?" }
  ],
  lugar: [
    { es: "Oye, dijiste que eres de {v}. ¿Cómo es por allá?", en: "Hey, you said you're from {v}. What's it like there?" },
    { es: "Volviendo a {v} — ¿lo extrañas?", en: "Going back to {v} — do you miss it?" }
  ],
  trabajo: [
    { es: "Y en {v}, ¿cómo te tratan?", en: "And at {v}, how do they treat you?" },
    { es: "Dijiste que trabajas en {v}. ¿Llevas mucho tiempo ahí?", en: "You said you work at {v}. Have you been there long?" }
  ],
  gusto: [
    { es: "Mencionaste que te gusta {v}. ¿Desde cuándo?", en: "You mentioned you like {v}. Since when?" },
    { es: "Regresando a {v} — ¿qué es lo que más te llama de eso?", en: "Back to {v} — what draws you to it most?" }
  ]
};
