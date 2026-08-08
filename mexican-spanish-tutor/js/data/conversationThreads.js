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
      { tier: 1, es: "¿Qué es lo más raro que te ha pasado hoy?", en: "What's the strangest thing that's happened to you today?" },
      { tier: 2, es: "Si pudieras repetir el día, ¿qué cambiarías?", en: "If you could redo the day, what would you change?" },
      { tier: 2, es: "Comparando con hace un año, ¿tus días son mejores, peores o iguales? ¿Y cómo te gustaría que fueran en el futuro?", en: "Compared to a year ago, are your days better, worse, or the same? And how would you like them to be in the future?" }
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
      { tier: 1, es: "¿Hay alguna tradición familiar que hagan seguido?", en: "Is there a family tradition you do often?" },
      { tier: 2, es: "¿Crees que las familias de antes eran más unidas que las de ahora?", en: "Do you think families used to be closer than they are now?" },
      { tier: 2, es: "¿Qué es lo que más te gustaría cambiar de cómo te llevas con tu familia?", en: "What would you most like to change about how you get along with your family?" }
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
      { tier: 1, es: "¿Qué plato mexicano todavía no has probado pero quieres probar?", en: "What Mexican dish haven't you tried yet but want to?" },
      { tier: 2, es: "¿Por qué crees que la comida es tan importante en la cultura mexicana?", en: "Why do you think food matters so much in Mexican culture?" },
      { tier: 2, es: "¿Cómo ha cambiado tu forma de comer con los años, y cómo te gustaría que fuera más adelante?", en: "How has your way of eating changed over the years, and how would you like it to be going forward?" }
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
      { tier: 1, es: "¿Qué harías si pudieras cambiar de trabajo mañana mismo?", en: "What would you do if you could change jobs tomorrow?" },
      { tier: 2, es: "¿Crees que la gente debería trabajar menos horas? ¿Por qué?", en: "Do you think people should work fewer hours? Why?" },
      { tier: 2, es: "Cuéntame cómo era tu trabajo o tus estudios hace unos años, cómo es ahora, y qué te imaginas haciendo en el futuro.", en: "Tell me what your work or studies were like a few years ago, what they're like now, and what you picture yourself doing in the future." }
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
      { tier: 1, es: "¿Cuándo fue la última vez que aprendiste algo nuevo por diversión?", en: "When was the last time you learned something new for fun?" },
      { tier: 2, es: "¿Crees que hoy la gente tiene menos tiempo libre que antes?", en: "Do you think people have less free time now than before?" },
      { tier: 2, es: "¿Sientes que tienes suficiente tiempo libre, o siempre te queda corto?", en: "Do you feel like you have enough free time, or does it always run short?" }
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
      { tier: 1, es: "¿Hay algún lugar al que sigues queriendo ir pero no has podido?", en: "Is there somewhere you still want to go but haven't been able to?" },
      { tier: 2, es: "¿Crees que viajar realmente cambia a la gente?", en: "Do you think traveling really changes people?" },
      { tier: 2, es: "¿Prefieres planear todo antes de viajar o improvisar sobre la marcha? ¿Por qué?", en: "Do you prefer to plan everything before traveling, or improvise as you go? Why?" }
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
      { tier: 1, es: "¿Has perdido contacto con algún amigo que extrañas?", en: "Have you lost touch with a friend you miss?" },
      { tier: 2, es: "¿Qué hace que una amistad dure años?", en: "What makes a friendship last for years?" },
      { tier: 2, es: "¿Crees que es más difícil hacer amigos de adulto que de joven? ¿Por qué?", en: "Do you think it's harder to make friends as an adult than when you were young? Why?" }
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
      { tier: 1, es: "¿Qué parte de tu rutina te gustaría cambiar si pudieras?", en: "What part of your routine would you change if you could?" },
      { tier: 2, es: "¿Crees que las rutinas ayudan o limitan a la gente?", en: "Do you think routines help people or limit them?" },
      { tier: 2, es: "Compara tu rutina de hace unos años con la de ahora. ¿Qué cambió y por qué?", en: "Compare your routine from a few years ago to now. What changed, and why?" }
    ]
  },
  {
    id: "opinion", icon: "💭", label: "Opiniones",
    match: /\b(creo|pienso|opini[oó]n|me parece|siento que|importante|deber[ií]a)\b/i,
    open: { es: "Me interesa lo que piensas. ¿Hay algo que te importe mucho ahorita?", en: "I'm curious what you think. Is there something you care a lot about right now?" },
    probes: [
      { tier: 0, es: "¿Te gusta dar tu opinión o prefieres solo escuchar?", en: "Do you like giving your opinion, or do you prefer just listening?" },
      { tier: 1, es: "¿Por qué piensas así?", en: "Why do you think that?" },
      { tier: 1, es: "¿Siempre has opinado igual, o cambiaste de idea?", en: "Have you always thought that, or did you change your mind?" },
      { tier: 1, es: "¿Qué opinión tuya sorprendería a la gente que te conoce?", en: "What opinion of yours would surprise people who know you?" },
      { tier: 2, es: "¿Qué le dirías a alguien que piensa lo contrario?", en: "What would you say to someone who thinks the opposite?" },
      { tier: 2, es: "Si estuviera en tus manos, ¿qué cambiarías?", en: "If it were up to you, what would you change?" },
      { tier: 2, es: "¿Cómo crees que va a estar eso en diez años?", en: "How do you think that will look in ten years?" }
    ]
  },
  {
    id: "clima", icon: "🌦️", label: "El clima",
    match: /\b(clima|calor|frío|frio|lluvia|llover|llueve|nublado|fresco)\w*/i,
    open: { es: "Oye, ¿cómo está el clima por donde vives?", en: "Hey, what's the weather like where you live?" },
    probes: [
      { tier: 0, es: "¿Hace mucho calor ahorita?", en: "Is it very hot right now?" },
      { tier: 0, es: "¿Te gusta más el calor o el frío?", en: "Do you like heat or cold more?" },
      { tier: 0, es: "¿Va a llover hoy?", en: "Is it going to rain today?" },
      { tier: 1, es: "¿Cómo cambia el clima según la temporada donde vives?", en: "How does the weather change by season where you live?" },
      { tier: 1, es: "¿El clima te afecta el ánimo? Cuéntame.", en: "Does the weather affect your mood? Tell me." },
      { tier: 2, es: "¿Crees que el clima ha cambiado mucho comparado con cuando eras niño o niña?", en: "Do you think the weather has changed a lot compared to when you were a kid?" }
    ]
  },
  {
    id: "salud", icon: "💪", label: "La salud",
    match: /\b(salud|enferm[oa]|resfriad[oa]|ejercicio|gimnasio|m[eé]dic[oa]|pastilla)\w*/i,
    open: { es: "¿Cómo te cuidas? ¿Haces ejercicio o algo así?", en: "How do you take care of yourself? Do you exercise or anything like that?" },
    probes: [
      { tier: 0, es: "¿Haces ejercicio seguido?", en: "Do you exercise often?" },
      { tier: 0, es: "¿Te enfermas mucho?", en: "Do you get sick a lot?" },
      { tier: 0, es: "¿Duermes bien normalmente?", en: "Do you usually sleep well?" },
      { tier: 1, es: "¿Qué haces cuando te sientes estresado o estresada?", en: "What do you do when you feel stressed?" },
      { tier: 1, es: "Cuéntame de la última vez que te enfermaste.", en: "Tell me about the last time you got sick." },
      { tier: 2, es: "Cuéntame cómo cuidabas tu salud antes, cómo la cuidas ahora, y qué te gustaría cambiar en el futuro.", en: "Tell me how you used to take care of your health, how you do now, and what you'd like to change in the future." }
    ]
  },
  {
    id: "barrio", icon: "🏘️", label: "El barrio",
    match: /\b(barrio|colonia|mercado|vecin[oa]|camión|camion|pesero)\w*/i,
    open: { es: "¿Cómo es la colonia donde vives?", en: "What's the neighborhood you live in like?" },
    probes: [
      { tier: 0, es: "¿Conoces a tus vecinos?", en: "Do you know your neighbors?" },
      { tier: 0, es: "¿Hay un mercado cerca de tu casa?", en: "Is there a market near your house?" },
      { tier: 0, es: "¿Cómo te mueves, en carro o en transporte público?", en: "How do you get around, by car or public transport?" },
      { tier: 1, es: "¿Qué es lo que más te gusta de tu barrio?", en: "What do you like most about your neighborhood?" },
      { tier: 1, es: "¿Ha cambiado mucho tu colonia desde que llegaste?", en: "Has your neighborhood changed a lot since you got there?" },
      { tier: 2, es: "¿Preferirías vivir en el centro de la ciudad o más retirado? ¿Por qué?", en: "Would you rather live downtown or further out? Why?" }
    ]
  },
  {
    id: "tecnologia", icon: "📱", label: "La tecnología",
    match: /\b(celular|tel[eé]fono|internet|whatsapp|instagram|tiktok|aplicaci[oó]n|computadora)\w*/i,
    open: { es: "¿Cuánto tiempo pasas en el celular al día?", en: "How much time do you spend on your phone per day?" },
    probes: [
      { tier: 0, es: "¿Qué aplicación usas más?", en: "Which app do you use the most?" },
      { tier: 0, es: "¿Tienes redes sociales?", en: "Do you have social media?" },
      { tier: 0, es: "¿Prefieres llamar o mandar mensaje?", en: "Do you prefer calling or texting?" },
      { tier: 1, es: "¿Sientes que usas mucho el celular, o está bien equilibrado?", en: "Do you feel like you use your phone too much, or is it well balanced?" },
      { tier: 1, es: "¿Cómo era tu vida antes de tener redes sociales?", en: "What was your life like before you had social media?" },
      { tier: 2, es: "¿Crees que la tecnología nos ha acercado o alejado como personas? ¿Por qué?", en: "Do you think technology has brought us closer or pushed us apart as people? Why?" }
    ]
  }
];

// Topic-agnostic continuations — used sparingly (core/conversationEngine.js,
// gated behind the `followups` option) to dig one turn deeper into whatever
// was just said instead of always jumping to the next scripted thread probe.
// Every line ends in "?" for the same reason the unpredictability banks do.
export const FOLLOWUPS = [
  { tier: 0, es: "¿Y luego qué pasó?", en: "And then what happened?" },
  { tier: 0, es: "¿En serio?", en: "Really?" },
  { tier: 0, es: "¿Por qué?", en: "Why?" },
  { tier: 1, es: "Cuéntame más de eso.", en: "Tell me more about that." },
  { tier: 1, es: "¿Cómo te sentiste?", en: "How did you feel?" },
  { tier: 1, es: "¿Te pasa seguido?", en: "Does that happen to you often?" },
  { tier: 1, es: "¿Y qué hiciste después?", en: "And what did you do after that?" },
  { tier: 2, es: "¿Y eso cómo te cambió la forma de ver las cosas?", en: "And how did that change how you see things?" },
  { tier: 2, es: "¿Crees que fue lo correcto? ¿Por qué?", en: "Do you think that was the right call? Why?" },
  { tier: 2, es: "¿Qué le dirías a alguien en la misma situación?", en: "What would you tell someone in the same situation?" }
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
  ] },
  { match: /\b(no manches|no inventes|de verdad|no puede ser)\w*/i, lines: [
    { es: "¡No manches! ¿En serio?", en: "No way! Really?" },
    { es: "¡Ay, no inventes!", en: "Oh come on!" }
  ] },
  { match: /\b(suerte|afortunad[oa]|me gan[eé]|logr[eé])\w*/i, lines: [
    { es: "¡Qué suerte!", en: "What luck!" },
    { es: "¡Órale, felicidades!", en: "Wow, congrats!" }
  ] }
];

export const NEUTRAL_REACTIONS = [
  { es: "Ah, mira.", en: "Ah, I see." },
  { es: "Ya veo.", en: "I see." },
  { es: "Interesante.", en: "Interesting." },
  { es: "Órale.", en: "Wow." },
  { es: "Qué bien.", en: "Nice." },
  { es: "Fíjate.", en: "How about that." },
  { es: "Mira nada más.", en: "Look at that." },
  { es: "No sabía eso.", en: "I didn't know that." }
];

// Used when a thread runs out and the bot moves on, so the switch is announced
// rather than jarring.
export const PIVOTS = [
  { es: "Oye, cambiando de tema —", en: "Hey, changing the subject —" },
  { es: "Por cierto,", en: "By the way," },
  { es: "Ah, y otra cosa —", en: "Oh, and another thing —" },
  { es: "Oye, se me ocurrió otra cosa —", en: "Hey, something else occurred to me —" },
  { es: "A todo esto,", en: "Speaking of which," }
];

// High-precision patterns only. A wrong "fact" repeated back is far worse than
// no callback at all, so these deliberately miss rather than guess.
export const MEMORY_RULES = [
  { key: "nombre", re: /\b(?:me llamo|mi nombre es)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ]{2,20})/i },
  { key: "lugar", re: /\b(?:vivo en|soy de)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ][A-Za-zÁÉÍÓÚÑáéíóúñ\s]{1,24}?)(?=[.,;!?]|$)/i },
  { key: "trabajo", re: /\btrabajo (?:en|de|como)\s+([a-záéíóúñ][a-záéíóúñ\s]{1,24}?)(?=[.,;!?]|$)/i },
  { key: "gusto", re: /\bme gustan?\s+((?:el |la |los |las )?[a-záéíóúñ][a-záéíóúñ\s]{1,26}?)(?=[.,;!?]|$)/i },
  { key: "edad", re: /\btengo\s+(\d{1,2})\s*años\b/i },
  { key: "mascota", re: /\btengo (?:un|una)\s+(perro|gato|perico|pez|hámster|hamster)\b/i },
  { key: "deporte", re: /\bjuego\s+(f[uú]tbol|b[aá]squetbol|voleibol|tenis|béisbol|beisbol)\b/i }
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
  { es: "Mmm, ¿en serio dijiste eso? No estoy segura de haber entendido.", en: "Hmm, did you really say that? I'm not sure I understood." },
  { es: "Perdón, ¿me lo puedes repetir? Se me fue el hilo.", en: "Sorry, can you repeat that? I lost my train of thought." },
  { es: "Oye, creo que no te escuché bien, ¿qué fue lo último que dijiste?", en: "Hey, I don't think I heard you right, what was the last thing you said?" }
];

export const INTERRUPTIONS = [
  { es: "Espera, espera — antes de que sigas, ¿ya viste que va a llover?", en: "Wait, wait — before you go on, did you see it's about to rain?" },
  { es: "Ay, perdón que te interrumpa, pero se me acaba de ocurrir algo: ¿ya comiste?", en: "Sorry to interrupt, but something just occurred to me: have you eaten yet?" },
  { es: "Un momento — ¿oíste eso? Bueno, no importa. ¿En qué íbamos?", en: "Hold on — did you hear that? Never mind. Where were we?" },
  { es: "Perdón, se me cruzó un pensamiento — ¿tú crees que va a estar bien el clima este fin?", en: "Sorry, a thought just crossed my mind — do you think the weather will be good this weekend?" },
  { es: "Espérame tantito, ¿me repites lo último? Se me fue el hilo.", en: "Hold on a sec, can you repeat that last part? I lost my train of thought." },
  { es: "Ay, espera, se me olvidó preguntarte algo — ¿ya desayunaste?", en: "Oh wait, I forgot to ask you something — have you had breakfast yet?" },
  { es: "Perdón, un segundo — se me antojó algo de repente, ¿tú también tienes hambre?", en: "Sorry, one second — I suddenly got a craving, are you hungry too?" }
];

export const CLARIFICATION_REQUESTS = [
  { es: "No sé si entendí bien — ¿me lo puedes explicar de otra forma?", en: "I'm not sure I understood — can you explain it another way?" },
  { es: "¿A qué te refieres exactamente con eso?", en: "What exactly do you mean by that?" },
  { es: "¿Puedes ser más específico? No me quedó claro.", en: "Can you be more specific? That wasn't clear to me." },
  { es: "Eso no me quedó del todo claro, ¿me explicas otra vez?", en: "That wasn't entirely clear to me, can you explain again?" },
  { es: "Oye, ¿me lo puedes decir con otras palabras?", en: "Hey, can you say that in other words?" },
  { es: "Mmm, no capté bien eso — ¿me das un ejemplo?", en: "Hmm, I didn't quite catch that — can you give me an example?" }
];

export const MULTI_QUESTION_PROBES = [
  { es: "Oye, dos cosas: ¿cómo te fue hoy y ya comiste algo?", en: "Hey, two things: how was your day, and have you eaten?" },
  { es: "Cuéntame, ¿qué hiciste ayer y con quién estabas?", en: "Tell me, what did you do yesterday, and who were you with?" },
  { es: "¿Qué tal tu semana, y ya tienes planes para el fin?", en: "How's your week been, and do you already have weekend plans?" },
  { es: "A ver, ¿de dónde eres y qué te trae por aquí?", en: "So, where are you from, and what brings you here?" },
  { es: "Oye, ¿qué hora es allá y qué estás haciendo?", en: "Hey, what time is it there, and what are you doing?" },
  { es: "Dime, ¿te gusta más el café o el té, y por qué?", en: "Tell me, do you like coffee or tea more, and why?" }
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
  ],
  edad: [
    { es: "Oye, dijiste que tienes {v} años. ¿Te sientes de esa edad?", en: "Hey, you said you're {v}. Do you feel that age?" }
  ],
  mascota: [
    { es: "¿Cómo se porta tu {v}?", en: "How does your {v} behave?" },
    { es: "Oye, ¿desde cuándo tienes a tu {v}?", en: "Hey, how long have you had your {v}?" }
  ],
  deporte: [
    { es: "Y el {v}, ¿lo juegas seguido?", en: "And {v} — do you play it often?" }
  ]
};
