// REAL-WORLD SPEAKING TASK BANK — Phase 1 of the ACTFL redesign.
//
// Every task is a genuine communicative act (order food, resolve a dispute,
// explain a problem to a landlord), never "translate this sentence." Each is
// tagged with the ACTFL function it targets, a real-life context, and a
// difficulty rating on the same 0-2400 scale as core/ratingEngine.js, so the
// adaptive task selector can place it directly against a learner's current
// rating.
//
// Writing/Reading/Listening task banks are Phase 2+ — the shape here
// (function/mode/context/difficulty/keywords) is deliberately skill-generic
// so those can reuse core/ratingEngine.js and core/rubricEngine.js unchanged.
//
// Two optional second-turn fields, matching required abilities at their
// level rather than being decoration:
//   - `followUp` (Intermediate Low/Mid): a natural clarifying question, the
//     way a real conversation partner asks one — tests "handle follow-up
//     questions," an Intermediate-level ability, not just Advanced.
//   - `complication` (Intermediate High+): an unexpected turn or pushback
//     mid-task — tests "handle unexpected situations," which only becomes a
//     required ability at Intermediate High and above.
// js/views/speakingTest.js treats both the same way in the flow (ask, wait
// for a second response, score the combined turn); only the content differs.
//
// Band centers (see data/actflProficiency.js): NL 133, NM 400, NH 667,
// IL 933, IM 1200, IH 1467, AL 1733, AM 2000, AH 2267.

export const SPEAKING_TASKS = [
  // ================= NOVICE LOW (0) =================
  { id: "sp-nl-01", skill: "speaking", levelIdx: 0, function: "describe", mode: "presentational", context: "home", difficulty: 110,
    es: "Mira a tu alrededor y nombra tres cosas que ves.", en: "Look around and name three things you see.",
    keywords: ["mesa", "silla", "libro", "ventana", "puerta", "teléfono", "computadora"] },
  { id: "sp-nl-02", skill: "speaking", levelIdx: 0, function: "sequence", mode: "presentational", context: "shopping", difficulty: 140,
    es: "Cuenta del uno al diez.", en: "Count from one to ten.",
    keywords: ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"] },
  { id: "sp-nl-03", skill: "speaking", levelIdx: 0, function: "describe", mode: "interpersonal", context: "social", difficulty: 120,
    es: "Preséntate: tu nombre y de dónde eres.", en: "Introduce yourself: your name and where you're from.",
    keywords: ["me llamo", "soy de", "mi nombre"] },
  { id: "sp-nl-04", skill: "speaking", levelIdx: 0, function: "compare", mode: "interpersonal", context: "food", difficulty: 155,
    es: "De estas dos comidas, tacos o pizza, ¿cuál prefieres? Solo di cuál.", en: "Of tacos or pizza, which do you prefer? Just say which.",
    keywords: ["tacos", "pizza", "prefiero"] },

  // ================= NOVICE MID (1) =================
  { id: "sp-nm-01", skill: "speaking", levelIdx: 1, function: "describe", mode: "interpersonal", context: "family", difficulty: 370,
    es: "Cuéntame de tu familia: ¿cuántos son?", en: "Tell me about your family: how many are there?",
    keywords: ["familia", "hermano", "hermana", "mamá", "papá", "somos"] },
  { id: "sp-nm-02", skill: "speaking", levelIdx: 1, function: "negotiate", mode: "interpersonal", context: "food", difficulty: 410,
    es: "Estás en una taquería. Pide dos tacos y algo de tomar.", en: "You're at a taquería. Order two tacos and something to drink.",
    keywords: ["quiero", "una", "por favor", "tacos", "agua", "refresco"] },
  { id: "sp-nm-03", skill: "speaking", levelIdx: 1, function: "compare", mode: "interpersonal", context: "social-media", difficulty: 430,
    es: "¿Qué te gusta hacer los fines de semana? Di dos o tres cosas.", en: "What do you like doing on weekends? Say two or three things.",
    keywords: ["me gusta", "los fines de semana", "salgo", "veo"] },
  { id: "sp-nm-04", skill: "speaking", levelIdx: 1, function: "sequence", mode: "presentational", context: "shopping", difficulty: 390,
    es: "Enumera tres cosas que necesitas comprar en el mercado.", en: "List three things you need to buy at the market.",
    keywords: ["necesito", "comprar", "mercado", "primero", "también"] },

  // ================= NOVICE HIGH (2) =================
  { id: "sp-nh-01", skill: "speaking", levelIdx: 2, function: "describe", mode: "presentational", context: "home", difficulty: 630,
    es: "Describe tu rutina de un día típico, desde que te levantas.", en: "Describe your typical day, from when you wake up.",
    keywords: ["me levanto", "desayuno", "trabajo", "escuela", "después", "luego"] },
  { id: "sp-nh-02", skill: "speaking", levelIdx: 2, function: "negotiate", mode: "interpersonal", context: "transit", difficulty: 700,
    es: "Vas a comprar una tarjeta del metro, pero solo tienen la de otro color. ¿Qué haces?", en: "You're buying a metro card, but they only have a different color. What do you do?",
    keywords: ["tarjeta", "metro", "está bien", "cuánto cuesta", "entonces"] },
  { id: "sp-nh-03", skill: "speaking", levelIdx: 2, function: "compare", mode: "interpersonal", context: "food", difficulty: 660,
    es: "¿Prefieres cocinar en casa o comer fuera? ¿Por qué?", en: "Do you prefer cooking at home or eating out? Why?",
    keywords: ["prefiero", "porque", "cocinar", "comer fuera", "más fácil", "más barato"] },
  { id: "sp-nh-04", skill: "speaking", levelIdx: 2, function: "sequence", mode: "presentational", context: "work", difficulty: 690,
    es: "Explica los pasos para llegar de tu casa a tu trabajo o escuela.", en: "Explain the steps to get from your home to work or school.",
    keywords: ["primero", "luego", "después", "camión", "carro", "camino"] },

  // ================= INTERMEDIATE LOW (3) =================
  { id: "sp-il-01", skill: "speaking", levelIdx: 3, function: "narrate", mode: "presentational", context: "travel", difficulty: 900,
    es: "Cuéntame de la última vez que fuiste a un lugar nuevo. ¿Qué pasó?", en: "Tell me about the last time you went somewhere new. What happened?",
    keywords: ["fui", "llegué", "vi", "me gustó", "después"],
    followUp: { es: "¿Y con quién fuiste?", en: "And who did you go with?" } },
  { id: "sp-il-02", skill: "speaking", levelIdx: 3, function: "describe", mode: "interpersonal", context: "family", difficulty: 950,
    es: "Describe a un amigo cercano: cómo es y cómo se conocieron.", en: "Describe a close friend: what they're like, and how you met.",
    keywords: ["es", "conocimos", "en", "amigo", "amiga", "simpático", "divertido"],
    followUp: { es: "¿Y qué es lo que más admiras de él o ella?", en: "And what do you admire most about them?" } },
  { id: "sp-il-03", skill: "speaking", levelIdx: 3, function: "negotiate", mode: "interpersonal", context: "transit", difficulty: 1000,
    es: "Estás perdido/a. Pídele indicaciones a un desconocido para llegar al centro, y hazle una pregunta de seguimiento sobre lo que te diga.", en: "You're lost. Ask a stranger for directions downtown, and ask a follow-up question about what they tell you.",
    keywords: ["disculpe", "cómo llego", "centro", "y luego", "está lejos"] },
  { id: "sp-il-04", skill: "speaking", levelIdx: 3, function: "advise", mode: "interpersonal", context: "social", difficulty: 920,
    es: "Un amigo quiere visitar tu ciudad por un día. ¿Qué le recomiendas hacer?", en: "A friend wants to visit your city for a day. What do you recommend they do?",
    keywords: ["deberías", "te recomiendo", "puedes ir a", "es bueno"] },

  // ================= INTERMEDIATE MID (4) =================
  { id: "sp-im-01", skill: "speaking", levelIdx: 4, function: "narrate", mode: "presentational", context: "health", difficulty: 1170,
    es: "Cuéntale a un farmacéutico qué te ha pasado: desde cuándo te sientes mal y qué síntomas tienes.", en: "Tell a pharmacist what's been going on: how long you've felt unwell, and your symptoms.",
    keywords: ["desde", "me duele", "me siento", "ayer", "empezó"],
    followUp: { es: "¿Ya tomaste algo para eso?", en: "Have you already taken anything for it?" } },
  { id: "sp-im-02", skill: "speaking", levelIdx: 4, function: "negotiate", mode: "interpersonal", context: "shopping", difficulty: 1230,
    es: "Compraste algo que no te queda bien. Explica el problema en la tienda y pide un cambio o devolución.", en: "You bought something that doesn't fit. Explain the problem at the store and ask for an exchange or refund.",
    keywords: ["no me queda", "quisiera", "cambiar", "devolver", "el recibo"] },
  { id: "sp-im-03", skill: "speaking", levelIdx: 4, function: "describe", mode: "presentational", context: "work", difficulty: 1190,
    es: "Describe tu trabajo o tus estudios con detalle: qué haces día a día.", en: "Describe your job or studies in detail: what you do day to day.",
    keywords: ["trabajo", "estudio", "todos los días", "mis tareas", "responsable de"],
    followUp: { es: "¿Y qué es lo que más te gusta de eso?", en: "And what do you like most about it?" } },
  { id: "sp-im-04", skill: "speaking", levelIdx: 4, function: "advise", mode: "interpersonal", context: "travel", difficulty: 1210,
    es: "Un amigo va a Oaxaca por primera vez. Recomiéndale qué comer y qué visitar, y explica por qué.", en: "A friend is going to Oaxaca for the first time. Recommend what to eat and see, and explain why.",
    keywords: ["te recomiendo", "porque", "no te pierdas", "vale la pena"] },

  // ================= INTERMEDIATE HIGH (5) =================
  { id: "sp-ih-01", skill: "speaking", levelIdx: 5, function: "narrate", mode: "presentational", context: "travel", difficulty: 1430,
    es: "Cuéntame sobre un viaje memorable, paso a paso, y qué sentías en cada momento.", en: "Tell me about a memorable trip, step by step, and how you felt at each point.",
    keywords: ["primero", "luego", "cuando", "me sentía", "al final"],
    complication: { es: "Espera — dijiste que todo salió bien, pero ¿no hubo ningún problema en el camino?", en: "Wait — you said everything went fine, but wasn't there any problem along the way?" } },
  { id: "sp-ih-02", skill: "speaking", levelIdx: 5, function: "negotiate", mode: "interpersonal", context: "transit", difficulty: 1500,
    es: "El camión que esperas no llega y ya vas tarde. Explícale la situación a alguien y decide qué hacer.", en: "The bus you're waiting for isn't coming and you're already late. Explain the situation to someone and decide what to do.",
    keywords: ["no ha llegado", "voy tarde", "qué hago", "mejor tomo"],
    complication: { es: "Alguien te dice que ese camión ya no pasa por aquí — cambiaron la ruta. ¿Ahora qué?", en: "Someone tells you that bus doesn't come this way anymore — they changed the route. Now what?" } },
  { id: "sp-ih-03", skill: "speaking", levelIdx: 5, function: "persuade", mode: "interpersonal", context: "work", difficulty: 1550,
    es: "¿Qué opinas de trabajar desde casa comparado con ir a una oficina? Da tus razones.", en: "What do you think about working from home vs. an office? Give your reasons.",
    keywords: ["creo que", "porque", "por un lado", "sin embargo"] },
  { id: "sp-ih-04", skill: "speaking", levelIdx: 5, function: "compare", mode: "interpersonal", context: "social-media", difficulty: 1470,
    es: "¿Prefieres vivir en una ciudad grande o en un pueblo pequeño? Compara los dos.", en: "Would you rather live in a big city or a small town? Compare the two.",
    keywords: ["más que", "mientras que", "en cambio", "a diferencia de"] },

  // ================= ADVANCED LOW (6) =================
  { id: "sp-al-01", skill: "speaking", levelIdx: 6, function: "narrate", mode: "presentational", context: "family", difficulty: 1700,
    es: "Explica cómo ha cambiado una tradición o celebración de tu familia con el tiempo: cómo era antes, cómo es ahora, y cómo crees que será.", en: "Explain how a family tradition or celebration has changed over time: how it was before, how it is now, and how you think it will be.",
    keywords: ["antes", "ahora", "en el futuro", "ha cambiado", "seguirá"] },
  { id: "sp-al-02", skill: "speaking", levelIdx: 6, function: "negotiate", mode: "interpersonal", context: "work", difficulty: 1760,
    es: "Te cobraron mal en un restaurante. Explica lo que pasó, disputa el cargo, y propón una solución.", en: "You were overcharged at a restaurant. Explain what happened, dispute the charge, and propose a solution.",
    keywords: ["me cobraron", "no es correcto", "propongo", "podríamos"],
    complication: { es: "El mesero dice que el cargo sí es correcto y te muestra el menú. ¿Qué le dices?", en: "The waiter says the charge is correct and shows you the menu. What do you say?" } },
  { id: "sp-al-03", skill: "speaking", levelIdx: 6, function: "persuade", mode: "presentational", context: "civic", difficulty: 1650,
    es: "Explica las causas y los efectos de un problema social que te importe, y defiende tu punto de vista.", en: "Explain the causes and effects of a social issue you care about, and defend your view.",
    keywords: ["la causa es", "como resultado", "por eso", "considero que"] },
  { id: "sp-al-04", skill: "speaking", levelIdx: 6, function: "advise", mode: "presentational", context: "health", difficulty: 1710,
    es: "Explícale a tu casero un problema de mantenimiento: cuándo empezó, qué has intentado, y qué necesitas que haga.", en: "Explain a maintenance problem to your landlord: when it started, what you've tried, and what you need them to do.",
    keywords: ["empezó", "he intentado", "necesito que", "por favor"] },

  // ================= ADVANCED MID (7) =================
  { id: "sp-am-01", skill: "speaking", levelIdx: 7, function: "negotiate", mode: "interpersonal", context: "civic", difficulty: 1930,
    es: "Dos compañeros de cuarto no se ponen de acuerdo sobre los quehaceres. Escucha ambos lados y propón una solución justa.", en: "Two roommates disagree about chores. Hear both sides and propose a fair resolution.",
    keywords: ["por un lado", "por otro lado", "propongo que", "les parece justo"] },
  { id: "sp-am-02", skill: "speaking", levelIdx: 7, function: "persuade", mode: "presentational", context: "civic", difficulty: 2000,
    es: "Da tu opinión sobre un tema de actualidad en México (por ejemplo, el transporte público o el medio ambiente), con datos y una postura clara.", en: "Give your opinion on a current issue in Mexico (e.g. public transit or the environment), with facts and a clear stance.",
    keywords: ["según", "los datos muestran", "mi postura es", "por lo tanto"] },
  { id: "sp-am-03", skill: "speaking", levelIdx: 7, function: "advise", mode: "interpersonal", context: "work", difficulty: 2050,
    es: "Estás haciendo un trámite por teléfono, pero te dicen que falta un documento y te mandan a otra oficina. Maneja la situación.", en: "You're handling an official procedure by phone, but they say a document is missing and send you to another office. Handle the situation.",
    keywords: ["me falta", "me podría explicar", "entonces qué hago", "podría repetir"],
    complication: { es: "La persona te transfiere a otra línea, y ahí te dicen algo distinto. ¿Cómo respondes?", en: "They transfer you to another line, and there you're told something different. How do you respond?" } },
  { id: "sp-am-04", skill: "speaking", levelIdx: 7, function: "compare", mode: "presentational", context: "civic", difficulty: 1970,
    es: "Compara cómo se vivía hace veinte años con cómo se vive ahora en tu ciudad, y qué piensas de esos cambios.", en: "Compare how life was twenty years ago with how it is now in your city, and what you think of those changes.",
    keywords: ["hace veinte años", "hoy en día", "a diferencia de", "en mi opinión"] },

  // ================= ADVANCED HIGH (8) =================
  { id: "sp-ah-01", skill: "speaking", levelIdx: 8, function: "persuade", mode: "presentational", context: "abstract-opinion", difficulty: 2200,
    es: "Presenta un argumento a favor o en contra de una política pública, y responde a un posible contraargumento.", en: "Present an argument for or against a public policy, and address a possible counter-argument.",
    keywords: ["mi argumento es", "alguien podría decir que", "sin embargo", "en conclusión"] },
  { id: "sp-ah-02", skill: "speaking", levelIdx: 8, function: "hypothesize", mode: "presentational", context: "abstract-opinion", difficulty: 2260,
    es: "Si pudieras cambiar una cosa de tu país, ¿qué cambiarías y qué consecuencias tendría?", en: "If you could change one thing about your country, what would you change and what would follow?",
    keywords: ["si pudiera", "cambiaría", "eso llevaría a", "por consecuencia"] },
  { id: "sp-ah-03", skill: "speaking", levelIdx: 8, function: "negotiate", mode: "interpersonal", context: "work", difficulty: 2230,
    es: "Presenta una queja formal por escrito sobre un servicio, manteniendo un registro profesional de principio a fin.", en: "Present a formal complaint about a service, keeping a professional register throughout.",
    keywords: ["por medio de la presente", "le escribo para", "solicito que", "atentamente"] },
  { id: "sp-ah-04", skill: "speaking", levelIdx: 8, function: "describe", mode: "presentational", context: "abstract-opinion", difficulty: 2290,
    es: "Explica, con matices, tu postura sobre un tema abstracto que no domines por completo — por ejemplo, el impacto de la inteligencia artificial en el trabajo.", en: "Explain, with nuance, your view on an abstract topic you don't fully master — e.g. AI's impact on work.",
    keywords: ["por un lado", "por otro lado", "no tengo una respuesta clara, pero", "matiz"] }
];

export function tasksForSkill(skill) {
  if (skill === "speaking") return SPEAKING_TASKS;
  return []; // writing/reading/listening task banks: Phase 2+
}
