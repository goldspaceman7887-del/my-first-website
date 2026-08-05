// Conversation engine data — shared by the free-topic Conversation partner
// and Immersion mode (js/views/conversation.js, js/views/immersion.js).
//
// The thing that makes a canned-reply bot feel robotic is that it never goes
// anywhere: you answer, it fires an unrelated line, you answer again. Real
// conversations follow a thread. So each topic here is exactly that — an
// opener plus a set of follow-ups that dig progressively further into the
// same subject, tiered by how much Spanish they demand.
//
// tier gates difficulty against the learner's estimated level:
//   0 = Novice/Elementary   (A0-A1) · concrete, answerable in a phrase
//   1 = Intermediate        (A2-B1) · past tense, comparison, short narration
//   2 = Advanced             (B2-C1) · opinion, hypothesis, argument
//
// Every helper in this file is pure — it takes state in and hands a result
// back, it never touches localStorage itself. The views own persistence
// (store.state.progress.conversationAsked / immersionAsked) so a question
// that's already been asked, in this session or a previous one, doesn't come
// back around until the whole pool has been used up.
//
// All Spanish is Peninsular (Spain): vosotros, coche/móvil/ordenador,
// coger, vale, piso, zumo, patata, conducir. Settings are Madrid, Barcelona,
// tapas bars, RENFE, the siesta — not Latin America.

export const CONVERSATION_TOPICS = [
  {
    id: "rutina",
    icon: "🕗",
    label: "La rutina diaria",
    match: /\b(rutina|me levanto|despierto|duermo|acuesto|temprano|tarde|siesta)\w*/i,
    open: { es: "¿Cómo es un día normal para ti?", en: "What's a normal day like for you?" },
    followups: [
      { tier: 0, es: "¿A qué hora te levantas normalmente?", en: "What time do you usually get up?" },
      { tier: 0, es: "¿Desayunas algo antes de salir de casa?", en: "Do you have breakfast before leaving the house?" },
      { tier: 1, es: "¿Echas la siesta alguna vez, o eso ya no se estila tanto?", en: "Do you ever take a siesta, or is that not really done anymore?" },
      { tier: 1, es: "¿Ha cambiado mucho tu rutina desde el año pasado?", en: "Has your routine changed much since last year?" },
      { tier: 2, es: "¿Crees que tener una rutina fija ayuda a la gente o más bien la limita?", en: "Do you think having a fixed routine helps people, or does it limit them?" },
      { tier: 2, es: "Si pudieras cambiar una sola cosa de tu rutina diaria, ¿qué cambiarías y por qué?", en: "If you could change one thing about your daily routine, what would it be and why?" }
    ]
  },
  {
    id: "comida",
    icon: "🥘",
    label: "La comida y las tapas",
    match: /\b(comid|tapa|tortilla|jam[oó]n|paella|tapear|bocadillo|men[uú]|restaurante|cen[ao]|almuerz)\w*/i,
    open: { es: "Hablemos de comida — ¿qué has comido hoy?", en: "Let's talk about food — what have you eaten today?" },
    followups: [
      { tier: 0, es: "¿Cuál es tu tapa favorita?", en: "What's your favorite tapa?" },
      { tier: 0, es: "¿Sueles comer fuera o prefieres cocinar en casa?", en: "Do you usually eat out, or do you prefer cooking at home?" },
      { tier: 1, es: "Cuéntame de la última vez que fuiste de tapas con alguien.", en: "Tell me about the last time you went out for tapas with someone." },
      { tier: 1, es: "¿Sabes preparar alguna receta española, como la tortilla de patatas?", en: "Do you know how to make any Spanish dish, like tortilla de patatas?" },
      { tier: 2, es: "¿Por qué crees que salir a tapear es tan importante socialmente en España?", en: "Why do you think going out for tapas matters so much socially in Spain?" },
      { tier: 2, es: "¿Qué opinas del horario de las comidas en España comparado con otros países?", en: "What do you think about Spanish mealtimes compared to other countries?" }
    ]
  },
  {
    id: "viajes",
    icon: "🚄",
    label: "Viajes y el tren",
    match: /\b(viaj|renfe|tren|avi[oó]n|vacacion|maleta|billete|estaci[oó]n|aeropuerto)\w*/i,
    open: { es: "¿Te gusta viajar? ¿Adónde has ido últimamente?", en: "Do you like to travel? Where have you been recently?" },
    followups: [
      { tier: 0, es: "¿Prefieres viajar en tren o en avión?", en: "Do you prefer traveling by train or by plane?" },
      { tier: 0, es: "¿Has cogido alguna vez el AVE?", en: "Have you ever taken the AVE (Spain's high-speed train)?" },
      { tier: 1, es: "Cuéntame del mejor viaje que has hecho hasta ahora.", en: "Tell me about the best trip you've ever taken." },
      { tier: 1, es: "¿Alguna vez se te complicó algo viajando, como perder un tren?", en: "Has anything ever gone wrong while traveling, like missing a train?" },
      { tier: 2, es: "¿Crees que viajar realmente cambia la forma de pensar de una persona?", en: "Do you think traveling really changes the way a person thinks?" },
      { tier: 2, es: "¿Qué le recomendarías a alguien que visita España por primera vez?", en: "What would you recommend to someone visiting Spain for the first time?" }
    ]
  },
  {
    id: "tiempo",
    icon: "☀️",
    label: "El tiempo",
    match: /\b(tiempo|llueve|lluvia|sol|calor|fr[ií]o|nub|nieve|clima|verano|invierno|primavera|oto[nñ]o)\w*/i,
    open: { es: "¿Qué tiempo hace hoy donde estás?", en: "What's the weather like today where you are?" },
    followups: [
      { tier: 0, es: "¿Prefieres el calor o el frío?", en: "Do you prefer hot weather or cold?" },
      { tier: 0, es: "¿Qué estación del año te gusta más?", en: "Which season do you like most?" },
      { tier: 1, es: "¿Cómo cambia tu humor según el tiempo que hace?", en: "How does your mood change with the weather?" },
      { tier: 1, es: "Cuéntame cómo fue el verano pasado por donde vives.", en: "Tell me what last summer was like where you live." },
      { tier: 2, es: "¿Crees que el cambio climático ya se nota en las estaciones del año?", en: "Do you think climate change is already noticeable in the seasons?" }
    ]
  },
  {
    id: "familia",
    icon: "👪",
    label: "La familia",
    match: /\b(familia|hermano|hermana|padre|madre|hij[oa]|abuel|prim[oa]|t[ií][oa]|marido|mujer|pareja)\w*/i,
    open: { es: "Cuéntame de tu familia. ¿Sois muchos?", en: "Tell me about your family. Are there a lot of you?" },
    followups: [
      { tier: 0, es: "¿Tienes hermanos?", en: "Do you have siblings?" },
      { tier: 0, es: "¿Con quién vives ahora mismo?", en: "Who do you live with right now?" },
      { tier: 1, es: "¿Os reunís mucho, tú y tu familia? Cuéntame de la última vez.", en: "Do you get together a lot, you and your family? Tell me about the last time." },
      { tier: 1, es: "¿A quién de tu familia te pareces más, físicamente o de carácter?", en: "Who in your family are you most like, in looks or personality?" },
      { tier: 2, es: "¿Crees que las familias de antes estaban más unidas que las de ahora?", en: "Do you think families used to be closer than they are now?" },
      { tier: 2, es: "¿Qué papel crees que debería tener la familia en la vida de un adulto?", en: "What role do you think family should play in an adult's life?" }
    ]
  },
  {
    id: "trabajo",
    icon: "💼",
    label: "El trabajo y los estudios",
    match: /\b(trabaj|oficina|jefe|empleo|estudi|universidad|carrera|clase|examen)\w*/i,
    open: { es: "¿A qué te dedicas? ¿Trabajas o estudias?", en: "What do you do? Do you work or study?" },
    followups: [
      { tier: 0, es: "¿Te gusta lo que haces?", en: "Do you like what you do?" },
      { tier: 0, es: "¿A qué hora empiezas a trabajar o a estudiar?", en: "What time do you start work or class?" },
      { tier: 1, es: "¿Qué es lo más difícil de tu trabajo o tus estudios ahora mismo?", en: "What's the hardest part of your work or studies right now?" },
      { tier: 1, es: "¿Cómo llegaste a dedicarte a eso? Cuéntame.", en: "How did you end up doing that? Tell me." },
      { tier: 2, es: "¿Crees que la gente debería trabajar menos horas a la semana? ¿Por qué?", en: "Do you think people should work fewer hours a week? Why?" },
      { tier: 2, es: "¿Qué cambiarías del sistema educativo o laboral si pudieras?", en: "What would you change about the education or work system if you could?" }
    ]
  },
  {
    id: "ocio",
    icon: "⚽",
    label: "El tiempo libre",
    match: /\b(gusta|hobby|afici[oó]n|m[uú]sica|pel[ií]cula|serie|leer|libro|deporte|f[uú]tbol|gimnasio|videojuego)\w*/i,
    open: { es: "¿Qué te gusta hacer en tu tiempo libre?", en: "What do you like doing in your free time?" },
    followups: [
      { tier: 0, es: "¿Qué música sueles escuchar?", en: "What music do you usually listen to?" },
      { tier: 0, es: "¿Haces algún deporte?", en: "Do you play any sport?" },
      { tier: 1, es: "¿Desde cuándo te gusta eso?", en: "Since when have you liked that?" },
      { tier: 1, es: "Cuéntame de la última película o serie que has visto.", en: "Tell me about the last movie or show you watched." },
      { tier: 2, es: "¿Crees que hoy en día la gente tiene menos tiempo libre que antes?", en: "Do you think people have less free time nowadays than before?" },
      { tier: 2, es: "¿Qué opinas de cómo el móvil ha cambiado la forma en que la gente descansa?", en: "What do you think about how the mobile phone has changed the way people relax?" }
    ]
  },
  {
    id: "compras",
    icon: "🛍️",
    label: "Las compras",
    match: /\b(compr|tienda|mercado|centro comercial|rebajas|dinero|preci|ropa)\w*/i,
    open: { es: "¿Te gusta ir de compras?", en: "Do you like going shopping?" },
    followups: [
      { tier: 0, es: "¿Prefieres comprar en tiendas pequeñas o en el centro comercial?", en: "Do you prefer shopping in small stores or at the mall?" },
      { tier: 0, es: "¿Qué fue lo último que compraste?", en: "What's the last thing you bought?" },
      { tier: 1, es: "Cuéntame de alguna vez que te arrepintieras de una compra.", en: "Tell me about a time you regretted buying something." },
      { tier: 1, es: "¿Sueles esperar a las rebajas para comprar algo caro?", en: "Do you usually wait for the sales to buy something expensive?" },
      { tier: 2, es: "¿Crees que compramos más de lo que realmente necesitamos hoy en día?", en: "Do you think we buy more than we actually need nowadays?" }
    ]
  },
  {
    id: "finde",
    icon: "🎉",
    label: "Los planes de fin de semana",
    match: /\b(fin de semana|finde|s[áa]bado|domingo|plan|quedar|salir)\w*/i,
    open: { es: "¿Qué planes tienes para este fin de semana?", en: "What plans do you have for this weekend?" },
    followups: [
      { tier: 0, es: "¿Sueles quedar con amigos los fines de semana?", en: "Do you usually meet up with friends on weekends?" },
      { tier: 0, es: "¿Prefieres un finde tranquilo o lleno de planes?", en: "Do you prefer a quiet weekend or one packed with plans?" },
      { tier: 1, es: "Contadme, tú y tus amigos, ¿qué soléis hacer un sábado por la noche?", en: "Tell me, you and your friends, what do you usually do on a Saturday night?" },
      { tier: 1, es: "¿Cuál ha sido el mejor fin de semana que recuerdas?", en: "What's the best weekend you can remember?" },
      { tier: 2, es: "¿Crees que la gente necesita desconectar del trabajo los fines de semana para estar bien?", en: "Do you think people need to disconnect from work on weekends to be okay?" }
    ]
  }
];

// Said before the follow-up question, so the bot reacts to what you said
// instead of interrogating you. Matched against your actual message.
export const REACTIONS = [
  {
    match: /\b(no s[eé]|no estoy segur[oa]|no s[eé] qu[eé] decir)\b/i,
    lines: [
      { es: "No pasa nada, tómate tu tiempo.", en: "No worries, take your time." },
      { es: "Tranquilo/a, vamos poco a poco.", en: "Relax, let's take it step by step." }
    ]
  },
  {
    match: /\b(mal|triste|dif[ií]cil|cansad[oa]|problema|preocup\w*|fatal|hart[oa]|agobiad[oa])\w*/i,
    lines: [
      { es: "Vaya, lo siento.", en: "Oh, I'm sorry to hear that." },
      { es: "Qué rollo, de verdad.", en: "That's a real pain, honestly." }
    ]
  },
  {
    match: /\b(bien|buen[oa]|feliz|content[oa]|genial|estupend[oa]|guay|de maravilla|me encanta|me gusta)\w*/i,
    lines: [
      { es: "¡Qué bien!", en: "That's great!" },
      { es: "Me alegro mucho.", en: "I'm really glad to hear that." },
      { es: "¡Genial, qué buena noticia!", en: "Great, what good news!" }
    ]
  },
  {
    match: /\b(much[ií]sim[oa]|much[oa]|siempre|todos los d[ií]as|un mont[oó]n)\b/i,
    lines: [
      { es: "Vaya, no es poco.", en: "Wow, that's no small thing." },
      { es: "Anda, sí que es bastante.", en: "Wow, that really is a lot." }
    ]
  }
];

export const NEUTRAL_REACTIONS = [
  { es: "Ah, ya veo.", en: "Ah, I see." },
  { es: "Vale, entiendo.", en: "Okay, I understand." },
  { es: "Qué interesante.", en: "How interesting." },
  { es: "Anda, mira.", en: "Oh, look at that." },
  { es: "Qué curioso.", en: "How curious." }
];

// Said when a topic runs out and the bot moves to another one, so the switch
// is announced rather than jarring.
export const PIVOTS = [
  { es: "Oye, cambiando de tema —", en: "Hey, changing the subject —" },
  { es: "Por cierto,", en: "By the way," },
  { es: "Ah, y otra cosa —", en: "Oh, and another thing —" },
  { es: "Venga, hablemos de otra cosa —", en: "Come on, let's talk about something else —" }
];

// High-precision patterns only. A wrong "fact" handed back to the learner is
// worse than no callback at all, so these deliberately miss rather than guess.
export const MEMORY_RULES = [
  { key: "nombre", re: /\b(?:me llamo|mi nombre es)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ]{2,20})/i },
  { key: "lugar", re: /\b(?:vivo en|soy de)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ][A-Za-zÁÉÍÓÚÑáéíóúñ\s]{1,24}?)(?=[.,;!?]|$)/i },
  { key: "trabajo", re: /\btrabajo (?:en|de|como)\s+([a-záéíóúñ][a-záéíóúñ\s]{1,24}?)(?=[.,;!?]|$)/i },
  { key: "gusto", re: /\bme gustan?\s+((?:el |la |los |las )?[a-záéíóúñ][a-záéíóúñ\s]{1,26}?)(?=[.,;!?]|$)/i }
];

export const CALLBACKS = {
  nombre: [
    { es: "Oye {v}, cuéntame algo más.", en: "Hey {v}, tell me something more." },
    { es: "{v}, tengo curiosidad — ¿qué más te gusta hacer?", en: "{v}, I'm curious — what else do you like to do?" }
  ],
  lugar: [
    { es: "Antes dijiste que eres de {v}. ¿Cómo es la vida allí?", en: "You mentioned earlier you're from {v}. What's life like there?" },
    { es: "Volviendo a {v} — ¿lo echas de menos?", en: "Going back to {v} — do you miss it?" }
  ],
  trabajo: [
    { es: "Y en {v}, ¿qué tal te tratan?", en: "And at {v}, how do they treat you?" },
    { es: "Dijiste que trabajas en {v}. ¿Llevas mucho tiempo allí?", en: "You said you work at {v}. Have you been there long?" }
  ],
  gusto: [
    { es: "Mencionaste que te gusta {v}. ¿Desde cuándo?", en: "You mentioned you like {v}. Since when?" },
    { es: "Volviendo a {v} — ¿qué es lo que más te llama de eso?", en: "Back to {v} — what draws you to it most?" }
  ]
};

// ---------------------------------------------------------------------------
// Helpers. All pure — no storage access, no side effects. Callers (the view
// modules) own the "already asked" arrays and localStorage persistence.
// ---------------------------------------------------------------------------

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Maps an ACTFL-style level code (A0..C1, as stored in profile.level) to a
// difficulty tier: 0 = Novice/Elementary, 1 = Intermediate, 2 = Advanced.
export function tierForLevel(levelCode) {
  const idx = ["A0", "A1", "A2", "B1", "B2", "C1"].indexOf(levelCode);
  if (idx <= 1) return 0;
  if (idx <= 3) return 1;
  return 2;
}

export function getTopicById(id) {
  return CONVERSATION_TOPICS.find((t) => t.id === id) || null;
}

// Returns a topic the learner just steered toward by keyword, or null if
// nothing new was detected (including when they're already on that topic).
export function detectTopic(text, currentTopicId) {
  const matches = CONVERSATION_TOPICS.filter((t) => t.match.test(text));
  if (!matches.length) return null;
  if (currentTopicId && matches.some((m) => m.id === currentTopicId)) return null;
  return matches[0];
}

// "cansada pero contenta" should get "qué bien", not "vaya, lo siento". The
// clause after "pero" carries the real point, so when several sentiments
// match, the one appearing LAST in the sentence wins.
export function reactionFor(text) {
  let best = null;
  let bestAt = -1;
  REACTIONS.forEach((r) => {
    const re = new RegExp(r.match.source, r.match.flags.includes("g") ? r.match.flags : r.match.flags + "g");
    let m;
    let last = -1;
    while ((m = re.exec(text)) !== null) {
      last = m.index;
      if (m.index === re.lastIndex) re.lastIndex++; // guard against zero-length matches
    }
    if (last > bestAt) {
      bestAt = last;
      best = r;
    }
  });
  return best ? pick(best.lines) : pick(NEUTRAL_REACTIONS);
}

// Scans text for anything worth remembering (name, hometown, job, a stated
// preference). Returns only the keys it actually found — callers merge this
// into their own running memory object.
export function extractMemory(text) {
  const found = {};
  MEMORY_RULES.forEach((rule) => {
    const m = text.match(rule.re);
    if (m && m[1]) {
      const v = m[1].trim().replace(/\s+/g, " ");
      if (v.length >= 2 && v.length <= 28) found[rule.key] = v;
    }
  });
  return found;
}

// Picks the hardest eligible follow-up the learner can handle for a topic
// that hasn't already been asked (per the caller's askedIds list). Returns
// null when the topic is exhausted at this tier. Does NOT mutate askedIds —
// the caller pushes the returned `key` once it actually uses the question.
export function pickNextQuestion(topicId, askedIds, tier) {
  const topic = getTopicById(topicId);
  if (!topic) return null;
  const eligible = topic.followups.filter((f) => f.tier <= tier && !askedIds.includes(`${topic.id}:${f.es}`));
  if (!eligible.length) return null;
  const best = Math.max(...eligible.map((f) => f.tier));
  const chosen = pick(eligible.filter((f) => f.tier === best));
  return { es: chosen.es, en: chosen.en, key: `${topic.id}:${chosen.es}` };
}

// True if ANY topic still has an unused question at this tier — used to
// decide whether to pivot to another topic or the pool is genuinely spent.
export function anyQuestionsRemain(askedIds, tier) {
  return CONVERSATION_TOPICS.some((t) => t.followups.some((f) => f.tier <= tier && !askedIds.includes(`${t.id}:${f.es}`)));
}

// Brings back something the learner mentioned earlier. Callbacks count as
// "asked" too (same list, prefixed "cb:") so a callback doesn't repeat any
// more than a regular question would. Returns null if nothing memorized yet,
// or everything memorized has already been called back on.
export function pickCallback(memory, askedIds) {
  const options = [];
  Object.keys(memory).forEach((k) => {
    (CALLBACKS[k] || []).forEach((tpl) => {
      if (!askedIds.includes(`cb:${k}:${tpl.es}`)) options.push({ k, tpl });
    });
  });
  if (!options.length) return null;
  const { k, tpl } = pick(options);
  return { es: tpl.es.replace("{v}", memory[k]), en: tpl.en.replace("{v}", memory[k]), key: `cb:${k}:${tpl.es}` };
}

export function pickPivot() {
  return pick(PIVOTS);
}
