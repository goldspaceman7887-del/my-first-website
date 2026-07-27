export const DIALOGUES_ADVANCED = [
  {
    id: "dlg_adv_reunion_proyecto",
    title: "Reunión de seguimiento del proyecto",
    englishTitle: "Project status meeting",
    level: "B2",
    category: "advanced",
    topic: "workplace-meeting",
    scenario: "Trabajas en una oficina en Madrid. Es lunes por la mañana y tienes una reunión con tu jefa, Marisa, y un compañero, Nacho, para revisar el estado de un proyecto que lleva retraso.",
    lines: [
      { speaker: "Marisa", es: "Bueno, vamos al grano. Según el calendario, deberíamos haber entregado la primera fase la semana pasada. ¿Qué ha pasado?", en: "Right, let's get to the point. According to the schedule, we should have delivered phase one last week. What happened?" },
      { speaker: "Tú", es: "Pues mira, el problema ha sido que el proveedor nos envió los materiales con diez días de retraso, y eso nos ha descuadrado todo el calendario.", en: "Well look, the problem was that the supplier sent us the materials ten days late, and that's thrown off the whole schedule." },
      { speaker: "Nacho", es: "Yo, la verdad, creo que también nos faltó prever un margen de seguridad. Lo digo con todo el respeto, pero deberíamos haber calculado un colchón de tiempo.", en: "Honestly, I think we also failed to plan in a safety margin. I say this with all due respect, but we should have factored in a time buffer." },
      { speaker: "Tú", es: "Puede que tengas razón, Nacho, aunque tampoco creo que hubiéramos podido prever un retraso tan grande por parte del proveedor.", en: "You might be right, Nacho, although I don't think we could have foreseen such a big delay from the supplier either." },
      { speaker: "Marisa", es: "A ver, no se trata de buscar culpables, sino de solucionarlo. ¿Qué proponéis para recuperar el tiempo perdido?", en: "Look, it's not about finding someone to blame, but about fixing it. What do you propose to make up the lost time?" },
      { speaker: "Tú", es: "Yo propondría que dividiéramos el equipo en dos: unos que sigan con la fase dos mientras otros terminan lo pendiente de la fase uno.", en: "I'd propose we split the team in two: some continue with phase two while others finish what's pending from phase one." },
      { speaker: "Nacho", es: "Me parece razonable, siempre que Marisa esté de acuerdo en reasignar recursos. Aunque, sinceramente, dudo que podamos recuperar los diez días enteros.", en: "That seems reasonable, as long as Marisa agrees to reallocate resources. Although, honestly, I doubt we can make up the full ten days." },
      { speaker: "Marisa", es: "No hace falta que los recuperemos todos, pero sí que lleguemos a la fecha límite del cliente. Es imprescindible que no se note el retraso de cara a él.", en: "We don't need to make up all of them, but we do need to hit the client's deadline. It's essential that the delay isn't noticeable to them." },
      { speaker: "Tú", es: "Entendido. Yo me encargo de hablar con el proveedor para que esto no vuelva a pasar, y os mando un correo esta tarde con el nuevo calendario.", en: "Understood. I'll take care of talking to the supplier so this doesn't happen again, and I'll send you an email this afternoon with the new schedule." },
      { speaker: "Nacho", es: "Perfecto. Y oye, para la próxima, no estaría de más que quedáramos también con el proveedor desde el principio, no solo con el cliente.", en: "Perfect. And hey, next time, it wouldn't hurt to also meet with the supplier from the start, not just the client." },
      { speaker: "Marisa", es: "Totalmente de acuerdo. Bueno, pues nada, gracias a los dos por la sinceridad. Seguimos en contacto por correo.", en: "Totally agree. Well then, thanks to both of you for the honesty. We'll stay in touch by email." }
    ],
    vocabulary: [
      { es: "ir al grano", en: "to get to the point", note: "common idiom in professional register" },
      { es: "descuadrar (el calendario)", en: "to throw off / unbalance (the schedule)", note: "used figuratively for plans, budgets" },
      { es: "un colchón de tiempo", en: "a time buffer/cushion", note: "literally 'mattress'; workplace idiom" },
      { es: "buscar culpables", en: "to look for someone to blame", note: "common in conflict-avoidance phrasing" },
      { es: "reasignar recursos", en: "to reallocate resources", note: "formal business vocabulary" },
      { es: "de cara a (el cliente)", en: "as far as (the client is concerned) / facing", note: "very common preposition-like phrase" },
      { es: "no estaría de más", en: "it wouldn't hurt / it wouldn't be a bad idea", note: "polite suggestion softener" },
      { es: "el margen de seguridad", en: "safety margin", note: "project-management term" }
    ],
    grammarNotes: [
      { point: "Conditional perfect for hypothetical past criticism", explanation: "'Deberíamos haber entregado', 'no hubiéramos podido prever' — used to discuss what should/could have happened, softer than direct blame." },
      { point: "Present subjunctive after impersonal expressions of necessity", explanation: "'Es imprescindible que no se note', 'no hace falta que los recuperemos' trigger subjunctive because they express necessity/sufficiency, not fact." },
      { point: "Dudar que + subjunctive", explanation: "'Dudo que podamos recuperar' — dudar que expresses doubt and requires subjunctive, unlike creo que (indicative) in affirmative form." },
      { point: "Softening disagreement with 'puede que' + subjunctive", explanation: "'Puede que tengas razón' hedges agreement/disagreement politely, a key Advanced-Low workplace strategy." }
    ],
    comprehensionQuestions: [
      { q: "¿Por qué se ha retrasado el proyecto según el hablante?", type: "mc", options: ["Falta de personal", "El proveedor envió los materiales tarde", "Un problema técnico"], answer: "El proveedor envió los materiales tarde" },
      { q: "¿Qué opina Nacho sobre la planificación original?", type: "short-answer", answer: "Que faltó prever un margen de seguridad / colchón de tiempo." },
      { q: "¿Qué solución propone el protagonista?", type: "mc", options: ["Contratar a más gente", "Dividir el equipo en dos grupos", "Pedir más tiempo al cliente"], answer: "Dividir el equipo en dos grupos" },
      { q: "¿Está de acuerdo Marisa en recuperar los diez días completos?", type: "short-answer", answer: "No; solo quiere que se cumpla la fecha límite del cliente, sin que el retraso se note." },
      { q: "¿Qué sugiere Nacho para futuros proyectos?", type: "short-answer", answer: "Reunirse con el proveedor desde el principio del proyecto, no solo con el cliente." }
    ],
    speakingTasks: [
      "Roleplay this meeting with a partner, one playing the boss pushing for accountability and the other explaining a delay diplomatically.",
      "Prepare a 1-minute status update on a fictional project of yours, including at least one setback and one proposed fix, using deberíamos haber + participle.",
      "Practice softening a disagreement with a colleague using 'puede que' + subjunctive and 'no creo que' + subjunctive."
    ],
    dictationText: "Deberíamos haber entregado la primera fase la semana pasada. Es imprescindible que no se note el retraso de cara al cliente.",
    culturalNotes: {
      context: "In Spanish offices, direct criticism is common but is typically cushioned with hedging phrases ('con todo el respeto', 'puede que tengas razón') even in fairly informal team settings — bluntness is normal but rarely delivered without some softening.",
      nativeBehaviour: "Spanish colleagues often address problems head-on in meetings rather than only in private one-on-ones; it's normal to discuss a missed deadline openly in front of the whole team, which can feel more confrontational to English speakers used to indirect written feedback.",
      register: "Semi-formal: tuteo (tú) is standard between colleagues and even with many bosses in Spanish companies, but sentence structure stays formal via subjunctive and conditional perfect — informality of pronoun does not mean informality of grammar.",
      keyExpressions: ["ir al grano", "no se trata de buscar culpables", "de cara al cliente", "no estaría de más"],
      warnings: ["Don't assume tú = casual speech throughout — advanced workplace Spanish still requires subjunctive and formal connectors even when addressing someone as tú.", "Avoid overly apologetic English-style hedging ('I'm so sorry, I know this is really bad') — Spanish workplace culture favors direct explanation over emotional apology."],
      regionalNotes: "Meeting culture in Spain often runs later into the morning than in the UK/US and may start a few minutes after the scheduled time without comment — this is normal and not a sign of disorganization.",
      practicalAdvice: "When explaining a setback, lead with the concrete cause, then pivot quickly to solutions — dwelling on blame is seen as unproductive in Spanish corporate culture.",
      nativeSpeakerNotes: "Notice how Marisa uses 'a ver' as a discourse marker to redirect the conversation — extremely common in Spain to signal 'let's refocus' without being rude."
    },
    commonMistakes: [
      "English speakers often say 'nosotros deberíamos entregar' instead of 'deberíamos haber entregado' when referring to a missed past deadline — the perfect infinitive is required for past hypothetical obligation.",
      "Avoiding subjunctive after 'dudo que' and defaulting to indicative ('dudo que podemos') — doubt verbs require subjunctive in Peninsular Spanish.",
      "Translating 'in front of the client' literally as 'en frente del cliente' instead of the idiomatic 'de cara al cliente' in business contexts.",
      "Overusing 'lo siento mucho' (I'm so sorry) when a factual explanation ('el problema ha sido que...') is more natural and expected in this register."
    ],
    advancedLowExtension: "Narrate, in the past, a real or invented work project that went wrong from start to finish: what was planned, what went wrong, who you talked to, and how it was resolved. Then hypothesize: if you could redo the project, what would you have done differently? Use preterite, imperfect, conditional perfect, and at least two subjunctive constructions of necessity or doubt."
  },
  {
    id: "dlg_adv_negociacion_tarifa",
    title: "Negociando la tarifa de un proyecto freelance",
    englishTitle: "Negotiating a freelance rate",
    level: "B2",
    category: "advanced",
    topic: "freelance-negotiation",
    scenario: "Eres diseñadora freelance en Barcelona. Un cliente potencial, Roberto, te ha propuesto una tarifa por un proyecto de branding que te parece baja, y os reunís por videollamada para negociar las condiciones.",
    lines: [
      { speaker: "Roberto", es: "Entonces, como te comentaba, tenemos un presupuesto de dos mil euros para todo el proyecto de identidad de marca.", en: "So, as I mentioned, we have a budget of two thousand euros for the whole brand identity project." },
      { speaker: "Tú", es: "Te agradezco la propuesta, Roberto, pero, sinceramente, para el alcance que me describes —logo, manual de marca, aplicaciones— dos mil euros se me queda un poco corto.", en: "I appreciate the offer, Roberto, but honestly, for the scope you're describing—logo, brand manual, applications—two thousand euros falls a bit short for me." },
      { speaker: "Roberto", es: "Entiendo, aunque nuestro presupuesto es el que es. ¿Habría alguna manera de ajustarlo, aunque fuera reduciendo el alcance?", en: "I understand, although our budget is what it is. Would there be any way to adjust it, even if by reducing the scope?" },
      { speaker: "Tú", es: "Podríamos plantearlo de dos maneras: o reducimos el alcance a logo y manual básico por los dos mil, o mantenemos el alcance completo y subimos a tres mil doscientos.", en: "We could approach it two ways: either we reduce the scope to logo and basic manual for the two thousand, or we keep the full scope and go up to three thousand two hundred." },
      { speaker: "Roberto", es: "Uf, tres mil doscientos se sale bastante de lo que teníamos pensado. ¿Y si lo dejamos en dos mil setecientos, con un pequeño recorte en las aplicaciones?", en: "Ugh, three thousand two hundred is quite a bit outside what we had planned. What if we settle at two thousand seven hundred, with a small cut in the applications?" },
      { speaker: "Tú", es: "Podría funcionar, siempre que el pago se divida en dos partes: cincuenta por ciento al empezar y el resto a la entrega final. Así nos cubrimos ambos.", en: "That could work, as long as the payment is split into two parts: fifty percent at the start and the rest at final delivery. That way we're both covered." },
      { speaker: "Roberto", es: "Me parece justo. También necesitaríamos que los plazos fueran flexibles, por si surge algún cambio de última hora por parte del equipo de marketing.", en: "That seems fair. We'd also need the deadlines to be flexible, in case there's a last-minute change from the marketing team." },
      { speaker: "Tú", es: "Ahí sí que tengo que ser un poco estricta. Puedo aceptar hasta dos rondas de cambios incluidas, pero cualquier cambio adicional se facturaría aparte, a razón de cuarenta euros la hora.", en: "There I do have to be a bit strict. I can accept up to two rounds of changes included, but any additional change would be billed separately, at forty euros an hour." },
      { speaker: "Roberto", es: "Me parece razonable. Entonces, ¿cerramos en dos mil setecientos, cincuenta por ciento por adelantado, y dos rondas de revisión incluidas?", en: "That seems reasonable. So, do we close at two thousand seven hundred, fifty percent up front, and two rounds of revision included?" },
      { speaker: "Tú", es: "Trato hecho. Te mando el contrato esta misma tarde para que lo revises con calma antes de firmarlo.", en: "Deal. I'll send you the contract this very afternoon so you can review it carefully before signing." },
      { speaker: "Roberto", es: "Perfecto, muchas gracias por la flexibilidad. Ha sido un placer negociar contigo, la verdad.", en: "Perfect, thank you very much for the flexibility. It's honestly been a pleasure negotiating with you." }
    ],
    vocabulary: [
      { es: "el alcance (del proyecto)", en: "the scope (of the project)", note: "key freelance/business term" },
      { es: "quedarse corto", en: "to fall short / not be enough", note: "used for money, time, quantities" },
      { es: "salirse de lo pensado/presupuestado", en: "to go beyond what was planned/budgeted", note: "common negotiation phrase" },
      { es: "un recorte", en: "a cut/reduction", note: "also used for budget cuts in news contexts" },
      { es: "por adelantado", en: "up front / in advance", note: "payment terminology" },
      { es: "facturar aparte", en: "to bill separately", note: "invoicing vocabulary" },
      { es: "a razón de", en: "at a rate of", note: "formal rate-expression, common in contracts" },
      { es: "trato hecho", en: "deal / it's a deal", note: "fixed expression to close a negotiation" }
    ],
    grammarNotes: [
      { point: "Conditional for polite hypothetical proposals", explanation: "'Habría alguna manera', 'necesitaríamos', 'podría funcionar' soften requests and proposals during negotiation — a hallmark of Advanced-Low persuasive register." },
      { point: "Siempre que + subjunctive", explanation: "'Siempre que el pago se divida' — siempre que (provided that) requires subjunctive when introducing a condition for agreement." },
      { point: "Por si + indicative/subjunctive for contingency", explanation: "'Por si surge algún cambio' uses subjunctive because it's a hypothetical, not-yet-real contingency; contrast with 'por si acaso' + indicative for habitual contingencies." },
      { point: "Se pasiva in business contexts", explanation: "'Se facturaría aparte' — impersonal se + conditional is common in Spanish contracts and negotiations to state policy neutrally." }
    ],
    comprehensionQuestions: [
      { q: "¿Cuál era el presupuesto inicial de Roberto?", type: "mc", options: ["1500 euros", "2000 euros", "3200 euros"], answer: "2000 euros" },
      { q: "¿En qué precio final se ponen de acuerdo?", type: "mc", options: ["2000 euros", "2700 euros", "3200 euros"], answer: "2700 euros" },
      { q: "¿Cómo se dividirá el pago?", type: "short-answer", answer: "50% al empezar y el resto a la entrega final." },
      { q: "¿Cuántas rondas de cambios están incluidas en la tarifa?", type: "short-answer", answer: "Dos rondas de revisión." },
      { q: "¿Qué pasa si Roberto pide más cambios de los incluidos?", type: "mc", options: ["Se hacen gratis", "Se facturan a 40 euros la hora", "Se cancela el proyecto"], answer: "Se facturan a 40 euros la hora" }
    ],
    speakingTasks: [
      "Roleplay a rate negotiation for a freelance service of your choice, proposing two alternative packages like the dialogue does.",
      "Practice countering a low offer politely without immediately accepting or rejecting it outright.",
      "Prepare and say aloud your own payment-terms sentence using 'siempre que' + subjunctive."
    ],
    dictationText: "Podríamos plantearlo de dos maneras: o reducimos el alcance, o mantenemos el alcance completo y subimos el precio.",
    culturalNotes: {
      context: "Freelance negotiation in Spain is common in creative and tech sectors, and clients often open with a lower anchor figure expecting some back-and-forth rather than a fixed take-it-or-leave-it offer.",
      nativeBehaviour: "It's culturally normal and expected to counter-offer rather than accept the first number; refusing to negotiate at all can come across as inflexible, while accepting immediately can undersell your value.",
      register: "Professional but warm tuteo is standard between freelancers and clients in Spain, even in first meetings — usted is rare in creative/digital freelance circles, more common with older, traditional-sector clients.",
      keyExpressions: ["se me queda un poco corto", "trato hecho", "por adelantado", "a razón de"],
      warnings: ["Don't assume a lower offer is final — Spanish negotiating culture generally expects a counter, and not countering can be read as inexperience.", "Avoid translating 'I'll invoice you' too literally with 'te voy a invoice' — use facturar."],
      regionalNotes: "Splitting payment 50/50 (adelanto + finiquito) is a very standard freelance practice in Spain, partly as protection against late payment, which is a widely discussed issue among Spanish autónomos (self-employed workers).",
      practicalAdvice: "When negotiating, offering two structured alternatives (like reduced scope vs. higher price) is a persuasive, professional technique widely used in Spain rather than a single yes/no ask.",
      nativeSpeakerNotes: "Note Roberto's closing line, 'ha sido un placer negociar contigo' — closing a negotiation with a warm, relationship-preserving remark is typical, even after hard bargaining."
    },
    commonMistakes: [
      "Saying 'estoy de acuerdo con dos mil' too quickly without countering — this skips the expected negotiation dance in Spanish business culture.",
      "Using 'actualmente' to mean 'actually' (false friend) instead of 'en realidad' or 'la verdad es que' when correcting a client's assumption.",
      "Avoiding conditional forms and instead using blunt present tense ('necesito tres mil') rather than softened 'necesitaría' — sounds abrupt in negotiation register.",
      "Confusing 'presupuesto' (budget/quote) with 'precio' (price) — a presupuesto is the proposed total estimate, not just a number."
    ],
    advancedLowExtension: "Prepare and deliver an extended negotiation monologue: explain to a client why your rate is justified (your experience, the scope, the market rate), propose two alternative deal structures, and hypothesize what you would do if the client refused both. Use conditional, siempre que + subjunctive, and at least one hypothetical si clause with imperfect subjunctive (si no aceptara, yo...)."
  },
  {
    id: "dlg_adv_debate_teletrabajo",
    title: "Debate amistoso: teletrabajo o oficina",
    englishTitle: "Friendly debate: remote work vs. the office",
    level: "B2",
    category: "advanced",
    topic: "debate-remote-work",
    scenario: "Dos amigos, Elena y Pau, quedan a tomar algo después del trabajo y acaban debatiendo, con humor pero con argumentos serios, sobre si el teletrabajo es mejor que ir a la oficina.",
    lines: [
      { speaker: "Elena", es: "Oye, yo es que no lo entiendo. Llevo un año teletrabajando y no cambiaría esto por nada del mundo. Me ahorro hora y media de trayecto al día.", en: "Hey, I just don't get it. I've been working remotely for a year and I wouldn't trade it for anything. I save an hour and a half of commuting a day." },
      { speaker: "Pau", es: "Ya, pero eso tiene su parte negativa también, ¿no? A mí lo que me preocupa es que se pierde muchísimo en cuanto a relación con el equipo.", en: "Sure, but that has its downside too, doesn't it? What worries me is that you lose a lot in terms of team relationships." },
      { speaker: "Elena", es: "Hombre, no estoy de acuerdo del todo. Tenemos videollamadas constantemente, y la verdad es que nos comunicamos bastante bien.", en: "Well, I don't fully agree. We have video calls constantly, and honestly we communicate pretty well." },
      { speaker: "Pau", es: "Puede ser, pero no es lo mismo una videollamada que tomarte un café con un compañero y comentar cómo va todo de manera informal. Ahí surgen las mejores ideas, en plan, sin querer.", en: "Maybe, but a video call isn't the same as grabbing a coffee with a colleague and chatting about how things are going informally. That's where the best ideas come up, like, without even meaning to." },
      { speaker: "Elena", es: "A ver, eso lo entiendo, pero también es verdad que en la oficina se pierde muchísimo tiempo en interrupciones tontas. O sea, alguien te viene a preguntar algo cada dos por tres y no te concentras.", en: "Look, I get that, but it's also true that in the office you lose a lot of time to silly interruptions. Like, someone comes to ask you something every five minutes and you can't concentrate." },
      { speaker: "Pau", es: "Eso es verdad, no te lo voy a negar. Pero, vamos, para mí el mayor problema del teletrabajo es la salud mental. Yo, si no salgo de casa, acabo fatal.", en: "That's true, I won't deny it. But come on, for me the biggest problem with remote work is mental health. If I don't leave the house, I end up in a terrible state." },
      { speaker: "Elena", es: "Eso depende de la persona, ¿no crees? A mí me viene fenomenal porque organizo mi día como quiero: hago deporte por la mañana y luego trabajo más concentrada.", en: "That depends on the person, don't you think? It works great for me because I organize my day how I want: I exercise in the morning and then work more focused." },
      { speaker: "Pau", es: "Vale, ahí te doy la razón, cada uno es un mundo. Pero, no obstante, creo que las empresas deberían al menos exigir dos o tres días presenciales para mantener cierta cohesión de equipo.", en: "Okay, I'll give you that, everyone's different. But, nevertheless, I think companies should at least require two or three in-person days to maintain some team cohesion." },
      { speaker: "Elena", es: "Un modelo híbrido, vamos. Bueno, eso sí que te lo acepto, no me parece mala idea. Lo que no soportaría es que me obligaran a ir cinco días.", en: "A hybrid model, basically. Well, that I do accept, doesn't seem like a bad idea. What I couldn't stand is being forced to go in five days." },
      { speaker: "Pau", es: "Totalmente. Bueno, oye, qué fuerte que hayamos acabado debatiendo esto con las cervezas en la mano.", en: "Totally. Well, hey, how funny that we ended up debating this with beers in hand." },
      { speaker: "Elena", es: "Jajaja, es que es un tema que da para mucho. Venga, brindemos por el modelo híbrido, que parece que es lo único en lo que estamos de acuerdo.", en: "Haha, it's a topic that gives a lot to talk about. Come on, let's toast to the hybrid model, since it seems to be the only thing we agree on." }
    ],
    vocabulary: [
      { es: "el trayecto", en: "the commute", note: "used for daily travel to work" },
      { es: "surgir (una idea)", en: "to arise/come up (an idea)", note: "common with ideas, problems, opportunities" },
      { es: "cada dos por tres", en: "every five minutes / constantly", note: "idiomatic frequency expression" },
      { es: "dar la razón (a alguien)", en: "to concede someone is right", note: "debate vocabulary" },
      { es: "no obstante", en: "nevertheless", note: "formal connector, common in spoken debate too" },
      { es: "el modelo híbrido", en: "the hybrid model", note: "workplace vocabulary" },
      { es: "dar para mucho", en: "to give a lot to talk about / be a rich topic", note: "idiomatic" },
      { es: "brindar (por algo)", en: "to toast (to something)", note: "social expression" }
    ],
    grammarNotes: [
      { point: "No creer que + subjunctive to express polite disagreement", explanation: "'No estoy de acuerdo del todo' softens disagreement without a subjunctive trigger here, but note the pattern would shift to subjunctive with 'no creo que sea lo mismo'." },
      { point: "Concessive puede que/puede ser + subjunctive", explanation: "'Puede ser' followed by 'pero' is a classic debate structure: concede a point, then pivot with a counterargument." },
      { point: "Deberían + infinitive for recommendations", explanation: "'Las empresas deberían exigir' expresses a policy recommendation — conditional-like modal deber in the conditional form, softer than 'tienen que'." },
      { point: "Si no salgo... acabo fatal — present real conditional", explanation: "Habitual/real conditional (si + present, present) used for general truths about the speaker, contrasted with hypothetical si + imperfect subjunctive used elsewhere in the set." }
    ],
    comprehensionQuestions: [
      { q: "¿Qué ventaja principal del teletrabajo menciona Elena al principio?", type: "mc", options: ["Gana más dinero", "Se ahorra el trayecto", "Tiene más vacaciones"], answer: "Se ahorra el trayecto" },
      { q: "¿Cuál es la principal preocupación de Pau sobre el teletrabajo?", type: "short-answer", answer: "Que se pierde relación y cohesión con el equipo." },
      { q: "¿Qué problema del trabajo en oficina reconoce Elena?", type: "mc", options: ["El ruido", "Las interrupciones constantes", "El café es malo"], answer: "Las interrupciones constantes" },
      { q: "¿En qué modelo de trabajo acaban coincidiendo los dos amigos?", type: "short-answer", answer: "En el modelo híbrido, con algunos días presenciales." },
      { q: "¿Qué expresión usa Pau para mostrar sorpresa divertida al final?", type: "mc", options: ["Qué va", "Qué fuerte", "Vale, vale"], answer: "Qué fuerte" }
    ],
    speakingTasks: [
      "Debate this same topic with a partner, each taking one side, using at least three concession-then-counter structures ('puede ser, pero...').",
      "Give a one-minute argument defending either full remote work or full office work, using no obstante and por lo tanto at least once each.",
      "Practice conceding a point gracefully with 'ahí te doy la razón' before pivoting back to your argument."
    ],
    dictationText: "No es lo mismo una videollamada que tomarte un café con un compañero. Ahí surgen las mejores ideas, sin querer.",
    culturalNotes: {
      context: "Friendly debate over drinks (una caña, unas cervezas) is a very common social activity in Spain, where discussing politics, work, or social issues openly with friends is normal and not considered rude, unlike in some more conflict-averse cultures.",
      nativeBehaviour: "Spaniards tend to argue passionately and interrupt more in casual debate than English speakers might expect, while still maintaining underlying warmth — raised voices or overlapping speech don't necessarily signal real conflict.",
      register: "Very informal, full of discourse markers (o sea, en plan, vamos, hombre) — this is authentic peer-to-peer spoken Spanish, contrasting sharply with the meeting dialogue's more careful register.",
      keyExpressions: ["o sea", "en plan", "no obstante", "qué fuerte", "dar la razón"],
      warnings: ["Don't mistake 'no obstante' as purely written/formal — it's used in spoken debate among educated speakers too, especially when making a stronger counterpoint.", "Avoid flattening all these discourse markers to a single generic 'like' in English translation when studying — each has a distinct pragmatic role (o sea = reformulating, en plan = exemplifying/approximating)."],
      regionalNotes: "The debate over teletrabajo vs. oficina is a very current topic in Spain post-2020, especially in Madrid and Barcelona tech/office sectors — remote work adoption has been slower in Spain than in the UK/US, making this a genuinely live cultural debate.",
      practicalAdvice: "In casual Spanish debate, conceding a point ('ahí te doy la razón') before disagreeing again is a common rhetorical rhythm — mirroring this makes you sound more natural than flatly disagreeing.",
      nativeSpeakerNotes: "Elena's 'hombre, no estoy de acuerdo del todo' shows how 'hombre' functions as a gender-neutral interjection expressing mild pushback, used by all speakers regardless of who they're addressing."
    },
    commonMistakes: [
      "Overtranslating 'like' as 'como' in filler position instead of using authentic 'en plan' or 'o sea', which sound far more native in this exact function.",
      "Avoiding concession structures and jumping straight to disagreement — Spanish debate register favors 'puede ser, pero...' over blunt 'no, estás equivocado'.",
      "Using 'actualmente' to mean 'currently' correctly is fine, but confusing it with 'realmente/en realidad' (actually) is a frequent false-friend error in debate contexts.",
      "Treating 'no obstante' as interchangeable with 'pero' in placement — no obstante usually starts a clause/sentence, while pero can join clauses mid-sentence."
    ],
    advancedLowExtension: "Defend, in an extended monologue, a firm personal position on teletrabajo vs. oficina, addressing at least two counterarguments before they're raised ('sé que mucha gente dirá que...') and conceding one minor point while defending your overall stance. Use no obstante, por lo tanto, and at least one hypothetical (si todos trabajáramos desde casa...)."
  },
  {
    id: "dlg_adv_actualidad_cafe",
    title: "Hablando de actualidad en el café",
    englishTitle: "Discussing current events over coffee",
    level: "B2",
    category: "advanced",
    topic: "current-events",
    scenario: "Dos vecinos, Carmen y Julián, coinciden en la cafetería del barrio un sábado por la mañana y se ponen a comentar una noticia reciente sobre la subida del precio de la vivienda.",
    lines: [
      { speaker: "Carmen", es: "¿Has visto la noticia de esta mañana? Dicen que el precio del alquiler ha subido otra vez, un doce por ciento en un año en Madrid.", en: "Did you see this morning's news? They say rent prices have gone up again, twelve percent in a year in Madrid." },
      { speaker: "Julián", es: "Uf, no me extraña nada. Mi sobrina lleva meses buscando piso y no encuentra nada decente por menos de mil euros al mes.", en: "Ugh, that doesn't surprise me at all. My niece has been looking for a flat for months and can't find anything decent for less than a thousand euros a month." },
      { speaker: "Carmen", es: "Es una barbaridad. Yo no creo que esto vaya a mejorar mientras no se regule más el mercado de los pisos turísticos.", en: "It's outrageous. I don't think this is going to improve as long as the tourist-flat market isn't regulated more." },
      { speaker: "Julián", es: "Hombre, tampoco es tan sencillo. Entiendo que regular ayudaría, pero también hay que tener en cuenta que mucha gente vive del turismo en este país.", en: "Well, it's not that simple either. I understand regulating would help, but you also have to take into account that a lot of people make a living from tourism in this country." },
      { speaker: "Carmen", es: "Ya, si no digo que haya que prohibirlo todo, pero sí que se limite en las zonas más saturadas. Es que ya no queda un solo piso para residentes en algunos barrios.", en: "Right, I'm not saying it should all be banned, but it should be limited in the most saturated areas. There isn't a single flat left for residents in some neighborhoods." },
      { speaker: "Julián", es: "En eso sí que estoy de acuerdo contigo. Ojalá los ayuntamientos tomaran medidas más contundentes, la verdad, porque esto va a acabar echando a los jóvenes del centro de las ciudades.", en: "There I do agree with you. I really wish city councils would take more forceful measures, honestly, because this is going to end up pushing young people out of city centers." },
      { speaker: "Carmen", es: "Es que mi hijo, con veintiocho años, todavía vive con nosotros. No es que no quiera independizarse, es que no le sale a cuenta con lo que gana.", en: "It's that my son, at twenty-eight, still lives with us. It's not that he doesn't want to move out, it's that it doesn't add up financially with what he earns." },
      { speaker: "Julián", es: "Es un problema generacional como la copa de un pino, oye. Cuando nosotros teníamos su edad, era impensable seguir viviendo con los padres.", en: "It's a huge generational problem, you know. When we were his age, it was unthinkable to still be living with your parents." },
      { speaker: "Carmen", es: "Totalmente. Aunque, bueno, tampoco quiero ser tan pesimista. Al menos ahora se está empezando a hablar más del tema en el Congreso.", en: "Totally. Although, well, I don't want to be too pessimistic either. At least now they're starting to talk about it more in Parliament." },
      { speaker: "Julián", es: "Esperemos que no se quede solo en hablar, porque llevamos años oyendo promesas y la situación no hace más que empeorar.", en: "Let's hope it doesn't stay just talk, because we've been hearing promises for years and the situation only keeps getting worse." },
      { speaker: "Carmen", es: "Bueno, en fin, vamos a dejarlo aquí que si no me amargo el café. ¿Te pido otro cortado?", en: "Well, anyway, let's leave it here or I'll sour my own coffee. Shall I order you another cortado?" }
    ],
    vocabulary: [
      { es: "una barbaridad", en: "an outrage / a huge amount", note: "colloquial intensifier, used for prices, quantities" },
      { es: "no salir a cuenta", en: "to not be worth it financially", note: "very common expression about money" },
      { es: "como la copa de un pino", en: "huge/enormous", note: "colloquial simile intensifier" },
      { es: "los pisos turísticos", en: "tourist flats/short-term rentals", note: "hot-button housing topic in Spain" },
      { es: "el ayuntamiento", en: "the city council/town hall", note: "local government institution" },
      { es: "tomar medidas contundentes", en: "to take forceful measures", note: "news/politics register" },
      { es: "independizarse", en: "to move out / become independent", note: "specifically about leaving the parental home" },
      { es: "amargarse (el café)", en: "to sour/embitter (one's coffee/mood)", note: "figurative, humorous closing line" }
    ],
    grammarNotes: [
      { point: "No creer que + subjunctive for opinion negation", explanation: "'No creo que esto vaya a mejorar' — negated opinion verbs trigger subjunctive, unlike affirmative 'creo que va a mejorar' (indicative)." },
      { point: "Ojalá + imperfect subjunctive for present-unlikely wishes", explanation: "'Ojalá los ayuntamientos tomaran medidas' expresses a wish seen as unlikely to happen soon — classic Advanced-Low structure." },
      { point: "No es que + subjunctive to correct a misconception", explanation: "'No es que no quiera independizarse, es que no le sale a cuenta' — a key rhetorical structure for clarifying real cause vs. assumed cause." },
      { point: "Mientras no + subjunctive", explanation: "'Mientras no se regule más el mercado' — mientras (no) + subjunctive expresses a pending/uncertain condition for change." }
    ],
    comprehensionQuestions: [
      { q: "¿Cuánto ha subido el alquiler en Madrid según la noticia?", type: "mc", options: ["Un 5%", "Un 12%", "Un 20%"], answer: "Un 12%" },
      { q: "¿Qué solución propone Carmen para el problema de la vivienda?", type: "short-answer", answer: "Limitar los pisos turísticos, sobre todo en las zonas más saturadas." },
      { q: "¿Por qué sigue el hijo de Carmen viviendo con sus padres?", type: "mc", options: ["Porque quiere ahorrar", "Porque no le sale a cuenta económicamente independizarse", "Porque está estudiando"], answer: "Porque no le sale a cuenta económicamente independizarse" },
      { q: "¿Está Julián totalmente de acuerdo con prohibir los pisos turísticos?", type: "short-answer", answer: "No del todo; reconoce que mucha gente vive del turismo, pero acaba coincidiendo en que hay que limitarlos en zonas saturadas." },
      { q: "¿Cómo termina Carmen la conversación?", type: "mc", options: ["Enfadada", "Cambiando de tema para no amargarse", "Llorando"], answer: "Cambiando de tema para no amargarse" }
    ],
    speakingTasks: [
      "Discuss a current news topic from your own country with a partner using ojalá + imperfect subjunctive to express a wish for change.",
      "Practice the 'no es que..., es que...' structure to correct a misconception about a topical issue.",
      "Give your opinion on a controversial policy using no creo que + subjunctive and creo que + indicative correctly in the same turn."
    ],
    dictationText: "No creo que esto vaya a mejorar mientras no se regule más el mercado de los pisos turísticos.",
    culturalNotes: {
      context: "The housing crisis (la crisis de la vivienda), especially rent prices and pisos turísticos, is one of the most widely discussed social and political topics in Spain as of the mid-2020s, particularly in Madrid, Barcelona, and coastal cities.",
      nativeBehaviour: "Casual conversation about politics and social issues over coffee is extremely normal in Spain, even among people who don't know each other's political affiliations well — it's not considered taboo small talk the way it can be in some English-speaking cultures.",
      register: "Informal but articulate; note the mix of colloquial intensifiers (una barbaridad, como la copa de un pino) with more formal opinion structures (no creo que, ojalá) — typical of educated informal Spanish speech.",
      keyExpressions: ["una barbaridad", "no salir a cuenta", "tomar medidas contundentes", "como la copa de un pino"],
      warnings: ["Don't assume discussing politics/current events with acquaintances is impolite in Spain — avoiding it entirely can actually seem distant.", "Be careful with 'independizarse' — it specifically means moving out of the parental home, not general political independence, in this everyday context."],
      regionalNotes: "The generational gap in home-leaving age is a very real, frequently cited statistic in Spain — Spaniards move out of their parents' homes later than almost anywhere else in the EU, making Carmen's comment about her 28-year-old son culturally authentic, not exaggerated.",
      practicalAdvice: "When joining this kind of conversation, using a hedge like 'yo no digo que...' before your opinion is a very natural way to state a strong view without sounding absolutist.",
      nativeSpeakerNotes: "Notice 'en fin' and 'bueno' used together to gracefully close a heavy topic — a common conversational exit strategy in Spanish before changing the subject."
    },
    commonMistakes: [
      "Using 'creo que va a mejorar' correctly but then wrongly keeping indicative after negating it ('no creo que va a mejorar') instead of switching to subjunctive ('no creo que vaya a mejorar').",
      "Translating 'it's not worth it' too literally as 'no vale la pena' when 'no le sale a cuenta' is the more natural expression specifically for financial calculations.",
      "Avoiding ojalá + subjunctive and instead saying 'espero que los ayuntamientos toman medidas' (indicative) — esperar que and ojalá both require subjunctive.",
      "Using 'actualmente' to mean 'actually' instead of 'currently' — a frequent false-friend slip in discussions of current events (actualidad)."
    ],
    advancedLowExtension: "Deliver an extended opinion piece (as if being interviewed on the street) about a housing or cost-of-living issue in your own country: describe the problem, explain its causes, propose a solution using ojalá/es necesario que + subjunctive, and address a counterargument someone might raise."
  },
  {
    id: "dlg_adv_logistica_evento",
    title: "Resolviendo un problema logístico juntos",
    englishTitle: "Solving a logistics problem together",
    level: "B2",
    category: "advanced",
    topic: "problem-solving",
    scenario: "Dos compañeros de trabajo, Sara y Diego, organizan un evento de empresa para trescientas personas y descubren, dos días antes, que el catering ha cancelado a última hora.",
    lines: [
      { speaker: "Sara", es: "Diego, tenemos un problema serio. Me acaba de llamar el catering y dicen que no pueden cubrir el evento del jueves. Se les ha caído otro proveedor y no dan abasto.", en: "Diego, we have a serious problem. The catering company just called me and they say they can't cover Thursday's event. Another supplier fell through on them and they can't keep up." },
      { speaker: "Diego", es: "¿Qué me estás contando? Con trescientas personas confirmadas, no podemos quedarnos sin comida así como así. A ver, vamos a pensar con calma.", en: "What are you telling me? With three hundred people confirmed, we can't just be left without food like that. Okay, let's think calmly." },
      { speaker: "Sara", es: "He estado mirando alternativas mientras venía hacia aquí. Hay una empresa, Delicatessen Ibérica, que trabaja con eventos grandes, pero no sé si en dos días les daría tiempo.", en: "I've been looking at alternatives on my way here. There's a company, Delicatessen Ibérica, that works with big events, but I don't know if two days would give them enough time." },
      { speaker: "Diego", es: "Merece la pena que los llamemos ya mismo. Mientras tanto, yo voy a contactar con el catering que usamos el año pasado, por si acaso todavía tienen hueco.", en: "It's worth calling them right now. Meanwhile, I'm going to contact the caterer we used last year, in case they still have availability." },
      { speaker: "Sara", es: "Buena idea. Y, oye, aunque encontremos catering nuevo, habría que avisar también al espacio, porque igual necesitan cambiar el montaje de las mesas.", en: "Good idea. And hey, even if we find new catering, we'd need to notify the venue too, because they might need to change the table setup." },
      { speaker: "Diego", es: "Cierto, no había caído en eso. Vale, entonces yo me encargo de llamar al catering antiguo y tú a Delicatessen Ibérica. Nos vemos en quince minutos y comparamos.", en: "True, I hadn't thought of that. Okay, so I'll handle calling the old caterer and you call Delicatessen Ibérica. Let's meet in fifteen minutes and compare." },
      { speaker: "Sara", es: "Vale. Ah, y si ninguno de los dos puede, tendríamos que plantearnos un plan B: un catering más pequeño de aperitivos y bebida, en lugar de menú completo.", en: "Okay. Oh, and if neither of the two can do it, we'd have to consider a plan B: a smaller catering of appetizers and drinks, instead of a full menu." },
      { speaker: "Diego", es: "No es lo ideal, pero desde luego es mejor que no tener nada. Lo apunto como última opción por si todo lo demás falla.", en: "It's not ideal, but it's definitely better than having nothing. I'll note it down as a last option in case everything else fails." },
      { speaker: "Sara", es: "Perfecto. Voy a llamar ya. Ojalá tengan disponibilidad, porque si no, se nos complica muchísimo el jueves.", en: "Perfect. I'm going to call now. I hope they have availability, because if not, Thursday gets really complicated for us." },
      { speaker: "Diego", es: "Tranquila, seguro que lo solucionamos. Peor sería que nos hubiéramos enterado el mismo jueves por la mañana.", en: "Don't worry, I'm sure we'll sort it out. It would be worse if we'd found out the same Thursday morning." },
      { speaker: "Sara", es: "Eso sí es verdad. Bueno, venga, cada uno a lo suyo. Nos escribimos en cuanto sepamos algo.", en: "That's true. Okay, come on, each to our task. We'll message each other as soon as we know something." }
    ],
    vocabulary: [
      { es: "no dar abasto", en: "to not be able to keep up / be overwhelmed", note: "very common expression for being overloaded" },
      { es: "así como así", en: "just like that / without more ado", note: "used to express something isn't acceptable casually" },
      { es: "merecer la pena", en: "to be worth it", note: "extremely common in decision-making contexts" },
      { es: "por si acaso", en: "just in case", note: "high-frequency contingency phrase" },
      { es: "no haber caído en algo", en: "to not have thought of/realized something", note: "idiomatic, caer en = to realize" },
      { es: "el plan B", en: "the backup plan", note: "same as English, very common in workplace Spanish" },
      { es: "el montaje (de las mesas)", en: "the setup (of the tables)", note: "events vocabulary" },
      { es: "cada uno a lo suyo", en: "each to their own task", note: "phrase used to divide work and part ways" }
    ],
    grammarNotes: [
      { point: "Merecer la pena que + subjunctive", explanation: "'Merece la pena que los llamemos' — impersonal value-judgment expressions require subjunctive in the dependent clause." },
      { point: "Conditional perfect for hypothetical worse scenarios", explanation: "'Peor sería que nos hubiéramos enterado el jueves' combines conditional (sería) + pluperfect subjunctive to imagine an alternative, worse past scenario." },
      { point: "Por si + subjunctive/indicative for contingency planning", explanation: "'Por si acaso todavía tienen hueco' — contingency register central to logistics/problem-solving Spanish." },
      { point: "Tendríamos que + infinitive for collaborative obligation", explanation: "'Tendríamos que plantearnos un plan B' softens obligation as a joint, negotiated necessity rather than a command." }
    ],
    comprehensionQuestions: [
      { q: "¿Por qué ha cancelado el catering original?", type: "short-answer", answer: "Porque se les cayó otro proveedor y no daban abasto." },
      { q: "¿Cuántas personas hay confirmadas para el evento?", type: "mc", options: ["100", "300", "500"], answer: "300" },
      { q: "¿Qué tareas se reparten Sara y Diego?", type: "short-answer", answer: "Sara llama a Delicatessen Ibérica y Diego llama al catering del año pasado." },
      { q: "¿Qué es lo que Diego no había tenido en cuenta?", type: "mc", options: ["El precio", "Avisar al espacio del evento sobre el montaje de mesas", "La lista de invitados"], answer: "Avisar al espacio del evento sobre el montaje de mesas" },
      { q: "¿Cuál es el plan B que proponen?", type: "short-answer", answer: "Un catering más pequeño de aperitivos y bebida en lugar de menú completo." }
    ],
    speakingTasks: [
      "Roleplay a similar last-minute logistics crisis (a canceled venue, a no-show speaker) and divide tasks with a partner the way Sara and Diego do.",
      "Practice proposing a plan B using 'tendríamos que plantearnos' + noun.",
      "Narrate afterward, in the past, how you solved the crisis, using pluperfect subjunctive to describe what would have been worse."
    ],
    dictationText: "Merece la pena que los llamemos ya mismo. Mientras tanto, yo voy a contactar con el catering que usamos el año pasado.",
    culturalNotes: {
      context: "Event planning in Spain, especially corporate events, often relies on personal/professional networks built over years — calling 'el catering del año pasado' reflects how relationship continuity with vendors is highly valued.",
      nativeBehaviour: "Under pressure, Spanish colleagues tend to move quickly into a division-of-labor mode ('cada uno a lo suyo') rather than dwelling on frustration — practical problem-solving is prioritized over venting, at least in front of each other.",
      register: "Fast-paced informal professional Spanish — tuteo, short clipped sentences, urgency markers ('ya mismo', 'a ver') typical of real workplace crisis conversations.",
      keyExpressions: ["no dar abasto", "no haber caído en algo", "por si acaso", "cada uno a lo suyo"],
      warnings: ["Don't over-apologize or dwell on blame in a crisis-response register — Spanish workplace norms favor immediately pivoting to solutions ('vamos a pensar con calma').", "Note 'no dar abasto' is about capacity/overload, not literally 'giving' anything — avoid literal translation."],
      regionalNotes: "Corporate event culture in Spain often includes tighter timelines and more last-minute changes than some northern European contexts are used to — flexibility and quick backup planning are considered normal professional skills, not signs of poor planning.",
      practicalAdvice: "When solving a problem collaboratively in Spanish, explicitly assigning tasks out loud ('yo me encargo de X, tú de Y') is the expected, efficient way to close a planning conversation — leaving it vague is seen as unproductive.",
      nativeSpeakerNotes: "Diego's 'tranquila, seguro que lo solucionamos' shows a common reassurance pattern in Spanish teamwork — confidence expressed briefly, then straight back to action, rather than prolonged comfort-giving."
    },
    commonMistakes: [
      "Translating 'we can't keep up' too literally instead of using the idiomatic 'no damos abasto', which natives use constantly in workplace contexts.",
      "Avoiding subjunctive after 'merece la pena que' and defaulting to infinitive incorrectly when the subject changes between clauses (merece la pena llamar is fine only when there's no explicit different subject).",
      "Using 'plan B' but mispronouncing/misusing it as 'segundo plan' — plan B is a fixed borrowed expression in Spanish business Spanish.",
      "Overusing 'perdón' or apologetic language when reporting bad news, instead of the more natural direct 'tenemos un problema serio' opening."
    ],
    advancedLowExtension: "Narrate a real or invented crisis you had to solve under time pressure (work, travel, an event): what went wrong, what steps you and others took, and what would have happened if you hadn't acted quickly. Use pluperfect subjunctive for the hypothetical worse outcome and merecer la pena que + subjunctive at least once."
  },
  {
    id: "dlg_adv_networking_evento",
    title: "Haciendo contactos en un evento profesional",
    englishTitle: "Networking at a professional event",
    level: "B2",
    category: "advanced",
    topic: "networking",
    scenario: "En un congreso de marketing digital en Valencia, Álvaro se acerca a Beatriz, que trabaja en una empresa que le interesa, durante el descanso para el café.",
    lines: [
      { speaker: "Álvaro", es: "Hola, perdona que te interrumpa. Te he visto antes en la charla haciendo preguntas muy interesantes sobre analítica de datos.", en: "Hi, sorry to interrupt. I saw you earlier in the talk asking some really interesting questions about data analytics." },
      { speaker: "Beatriz", es: "¡Ah, qué majo! Sí, es un tema que me apasiona, la verdad. Soy Beatriz, trabajo en el departamento de datos de una consultora en Valencia.", en: "Oh, how nice of you! Yes, it's a topic I'm really passionate about, honestly. I'm Beatriz, I work in the data department of a consultancy in Valencia." },
      { speaker: "Álvaro", es: "Encantado, Álvaro. Yo llevo dos años como responsable de marketing digital en una startup de Barcelona, y estamos empezando a meternos más en analítica avanzada.", en: "Nice to meet you, Álvaro. I've been the digital marketing lead at a startup in Barcelona for two years, and we're starting to get more into advanced analytics." },
      { speaker: "Beatriz", es: "Qué interesante. ¿Y qué tipo de herramientas estáis usando ahora mismo? Porque hay un salto bastante grande entre lo básico y lo avanzado, no sé si os habéis encontrado con eso.", en: "How interesting. And what kind of tools are you using right now? Because there's quite a big jump between the basics and the advanced stuff, I don't know if you've run into that." },
      { speaker: "Álvaro", es: "Justo por eso he venido a este congreso. Ahora mismo trabajamos con herramientas bastante limitadas y necesitamos dar el salto, pero no tenemos claro por dónde empezar.", en: "That's exactly why I came to this conference. Right now we work with fairly limited tools and we need to take the leap, but we're not sure where to start." },
      { speaker: "Beatriz", es: "Mira, casualmente eso es justo lo que hacemos en mi empresa: ayudamos a startups a montar su primera infraestructura de datos en condiciones. Podría ponerte en contacto con mi jefe, si te interesa.", en: "Look, coincidentally that's exactly what we do at my company: we help startups set up their first proper data infrastructure. I could put you in touch with my boss, if you're interested." },
      { speaker: "Álvaro", es: "Me interesaría muchísimo, sí. ¿Tenéis alguna manera de que os podamos conocer sin comprometernos a nada todavía? Estamos en fase muy inicial de decidir esto.", en: "I'd be very interested, yes. Do you have any way for us to get to know you without committing to anything yet? We're at a very early stage of deciding on this." },
      { speaker: "Beatriz", es: "Claro, sin problema. Solemos hacer una primera reunión gratuita para entender las necesidades del cliente, sin ningún compromiso por su parte.", en: "Of course, no problem. We usually do a first free meeting to understand the client's needs, with no obligation on their part." },
      { speaker: "Álvaro", es: "Perfecto, eso me viene genial. Toma, aquí tienes mi tarjeta. Si me escribes un correo esta semana, te paso el contacto de nuestro CTO para que cuadréis la reunión.", en: "Perfect, that works great for me. Here, here's my card. If you email me this week, I'll pass along our CTO's contact so you can sort out the meeting." },
      { speaker: "Beatriz", es: "Genial, así lo haré. Oye, y aparte del trabajo, ¿es tu primera vez en este congreso? Porque yo llevo viniendo tres años y cada vez está más interesante.", en: "Great, I'll do that. Hey, and apart from work, is this your first time at this conference? Because I've been coming for three years and it gets more interesting every time." },
      { speaker: "Álvaro", es: "Es la primera vez, sí, y la verdad es que estoy encantado. Bueno, oye, no te robo más tiempo, que seguro que tienes más gente que conocer, pero espero que sigamos en contacto.", en: "It's my first time, yes, and honestly I'm delighted. Well, hey, I won't take up more of your time, I'm sure you have more people to meet, but I hope we stay in touch." }
    ],
    vocabulary: [
      { es: "qué majo/maja", en: "how nice/kind (of you)", note: "friendly Spain-specific compliment adjective" },
      { es: "el responsable de (marketing)", en: "the (marketing) lead/manager", note: "job-title vocabulary" },
      { es: "dar el salto", en: "to take the leap / level up", note: "figurative expression for a big step forward" },
      { es: "poner en contacto (a alguien)", en: "to put (someone) in touch", note: "networking phrase" },
      { es: "sin compromiso", en: "with no obligation", note: "very common in sales/services offers" },
      { es: "cuadrar (una reunión)", en: "to arrange/coordinate (a meeting)", note: "colloquial but professional" },
      { es: "robar tiempo (a alguien)", en: "to take up (someone's) time", note: "polite closing expression" },
      { es: "la tarjeta (de visita)", en: "the business card", note: "networking essential" }
    ],
    grammarNotes: [
      { point: "Condicional for polite offers and requests", explanation: "'Podría ponerte en contacto', 'me interesaría' — conditional softens both offers and expressions of interest in professional first encounters." },
      { point: "Para que + subjunctive expressing purpose", explanation: "'Te paso el contacto para que cuadréis la reunión' — para que always triggers subjunctive when introducing a purpose clause with a different subject." },
      { point: "Present perfect for recent relevant past", explanation: "'Te he visto antes en la charla' — pretérito perfecto used for a recent, same-day event, standard in Peninsular Spanish (unlike much of Latin America, which would favor simple preterite here)." },
      { point: "Llevar + gerund for duration", explanation: "'Llevo dos años como responsable' and 'llevo viniendo tres años' — llevar + time + gerund expresses ongoing duration, a structure English speakers often mistranslate with present perfect continuous." }
    ],
    comprehensionQuestions: [
      { q: "¿En qué se especializa la empresa de Beatriz?", type: "short-answer", answer: "Ayudan a startups a montar su infraestructura de datos." },
      { q: "¿Cuánto tiempo lleva Álvaro como responsable de marketing digital?", type: "mc", options: ["Un año", "Dos años", "Cinco años"], answer: "Dos años" },
      { q: "¿Qué le ofrece Beatriz a Álvaro?", type: "mc", options: ["Un descuento inmediato", "Ponerlo en contacto con su jefe para una reunión gratuita", "Un trabajo"], answer: "Ponerlo en contacto con su jefe para una reunión gratuita" },
      { q: "¿Es la primera vez de Álvaro en el congreso?", type: "short-answer", answer: "Sí, es su primera vez; Beatriz lleva viniendo tres años." },
      { q: "¿Cómo se despide Álvaro al final?", type: "short-answer", answer: "Dice que no quiere robarle más tiempo y espera que sigan en contacto." }
    ],
    speakingTasks: [
      "Roleplay approaching a stranger at a professional event, complimenting something specific you noticed about them, as Álvaro does.",
      "Practice offering a no-obligation next step ('sin compromiso') in a professional context.",
      "Give a 30-second self-introduction (elevator pitch) using llevar + gerund to describe how long you've done your current role."
    ],
    dictationText: "Podría ponerte en contacto con mi jefe, si te interesa. Solemos hacer una primera reunión gratuita, sin ningún compromiso.",
    culturalNotes: {
      context: "Networking events in Spain (congresos, jornadas) are common in tech and marketing sectors in cities like Madrid, Barcelona, and Valencia, and approaching strangers to talk shop during coffee breaks is an expected, low-pressure norm.",
      nativeBehaviour: "Spaniards often network in a warmer, more personal register than the transactional style common in some English-speaking business cultures — complimenting someone's contribution before pitching anything is typical and appreciated.",
      register: "Professional but warm tuteo from the very first exchange — usted would feel oddly distant at a networking event among peers in most Spanish industries, especially tech/marketing.",
      keyExpressions: ["qué majo/maja", "sin compromiso", "dar el salto", "no te robo más tiempo"],
      warnings: ["Don't over-formalize with usted in a peer networking context — it can create unwanted distance rather than respect.", "Avoid pushing too hard for a sale/commitment in the first exchange — offering something 'sin compromiso' is the culturally expected soft close."],
      regionalNotes: "Business card exchange is still common at Spanish professional events (more than some fully-digital English-speaking equivalents), often paired with immediately suggesting a concrete follow-up like an email or LinkedIn connection.",
      practicalAdvice: "A good Spanish networking closing line acknowledges the other person's time and other commitments ('seguro que tienes más gente que conocer') rather than just ending abruptly.",
      nativeSpeakerNotes: "Notice 'qué majo' as an immediate warm reaction to a compliment — a very Spain-specific adjective (majo/a) meaning nice/kind/likeable, used constantly in daily speech."
    },
    commonMistakes: [
      "Defaulting to usted throughout a networking conversation among industry peers, which can sound stiff — tú is the norm in most modern Spanish professional/creative sectors.",
      "Mistranslating 'I've seen you' with simple preterite 'te vi' instead of the more natural Peninsular present perfect 'te he visto' for a same-day, still-relevant event.",
      "Forgetting subjunctive after para que ('para que cuadréis' not 'para que cuadráis') when explaining the purpose of an introduction.",
      "Translating 'I don't want to take up your time' too literally instead of using the idiomatic 'no te robo más tiempo'."
    ],
    advancedLowExtension: "Roleplay or narrate an extended professional networking exchange: introduce yourself, ask detailed follow-up questions about the other person's work, propose a concrete next step, and later narrate to a colleague how the conversation went and why you think it could lead somewhere, using llevar + gerund, present perfect, and para que + subjunctive."
  },
  {
    id: "dlg_chal_tren_perdido",
    title: "El tren de enlace perdido",
    englishTitle: "The missed connecting train",
    level: "B2",
    category: "challenge",
    topic: "renfe-missed-connection",
    scenario: "Has perdido el tren de enlace en la estación de Atocha, en Madrid, porque el primer tren llegó con retraso. Hablas con un empleado de Renfe para buscar una solución.",
    lines: [
      { speaker: "Tú", es: "Buenas tardes, disculpe. Acabo de llegar de Sevilla y he perdido el AVE de enlace a Barcelona porque el primer tren venía con cuarenta minutos de retraso.", en: "Good afternoon, excuse me. I've just arrived from Seville and I missed the connecting AVE to Barcelona because the first train was forty minutes late." },
      { speaker: "Empleado", es: "Vaya, lo siento. A ver, déjeme comprobarlo en el sistema. ¿Me puede enseñar el billete y el DNI, por favor?", en: "Oh, I'm sorry. Let me check it in the system. Could you show me the ticket and ID, please?" },
      { speaker: "Tú", es: "Aquí tiene. Mire, el billete original era para el tren de las 16:20, pero ya son las 16:35 y ha salido sin mí.", en: "Here you go. Look, the original ticket was for the 4:20 train, but it's already 4:35 and it's left without me." },
      { speaker: "Empleado", es: "Efectivamente, veo aquí que el tren de Sevilla llegó con retraso confirmado por incidencia de vía. En ese caso, tiene usted derecho a que le recoloquemos en el siguiente tren disponible sin coste adicional.", en: "Indeed, I see here that the Seville train arrived late due to a confirmed track incident. In that case, you're entitled to be rebooked on the next available train at no extra cost." },
      { speaker: "Tú", es: "Menos mal. ¿Y a qué hora saldría el próximo tren con plazas libres? Es que tengo una reunión mañana a primera hora en Barcelona y no puedo llegar mucho más tarde.", en: "Thank goodness. And what time would the next train with available seats leave? I have a meeting first thing tomorrow morning in Barcelona and I can't arrive much later." },
      { speaker: "Empleado", es: "El siguiente con plazas es el de las 18:00. Llegaría a Barcelona sobre las 20:30. Si le viene mejor, también tenemos uno a las 19:30 en clase preferente, aunque ese tendría un pequeño suplemento.", en: "The next one with seats is at 6:00 PM. It would arrive in Barcelona around 8:30 PM. If it suits you better, we also have one at 7:30 PM in premium class, though that would have a small surcharge." },
      { speaker: "Tú", es: "No, no, el de las 18:00 me viene perfecto, gracias. Por cierto, ¿esto me lo tramitan aquí mismo o tengo que ir a otra ventanilla?", en: "No, no, the 6:00 one works perfectly for me, thanks. By the way, do you process this right here or do I need to go to another window?" },
      { speaker: "Empleado", es: "Se lo tramito yo mismo ahora. Solo necesito que me confirme si quiere el mismo asiento, ventanilla, o le da igual.", en: "I'll process it myself right now. I just need you to confirm if you want the same seat, window, or if it doesn't matter." },
      { speaker: "Tú", es: "Ventanilla, si es posible, por favor. Y una última cosa: como he perdido casi dos horas por el retraso, ¿tendría derecho a alguna compensación económica, no solo al cambio de billete?", en: "Window, if possible, please. And one last thing: since I've lost almost two hours due to the delay, would I be entitled to any financial compensation, not just the ticket change?" },
      { speaker: "Empleado", es: "Sí, de hecho, por la normativa de Renfe, los retrasos superiores a sesenta minutos dan derecho a una compensación de entre el cincuenta y el cien por cien del billete, dependiendo del tiempo exacto. Puede solicitarla en la web con el número de incidencia que le voy a dar ahora.", en: "Yes, in fact, under Renfe regulations, delays of more than sixty minutes entitle you to compensation of between fifty and one hundred percent of the ticket, depending on the exact time. You can request it on the website with the incident number I'm going to give you now." },
      { speaker: "Tú", es: "Perfecto, muchísimas gracias por la ayuda. Al final no ha sido tan mala tarde como pensaba.", en: "Perfect, thank you so much for the help. In the end it wasn't as bad an afternoon as I thought." },
      { speaker: "Empleado", es: "De nada, aquí tiene el nuevo billete y el número de incidencia. Que tenga buen viaje, y siento las molestias.", en: "You're welcome, here's your new ticket and the incident number. Have a good trip, and sorry for the inconvenience." }
    ],
    vocabulary: [
      { es: "el tren de enlace", en: "the connecting train", note: "essential travel vocabulary" },
      { es: "recolocar (en otro tren)", en: "to rebook/reassign (to another train)", note: "Renfe customer-service term" },
      { es: "una incidencia de vía", en: "a track incident", note: "official cause-of-delay terminology" },
      { es: "la clase preferente", en: "premium/business class", note: "Renfe fare category" },
      { es: "el suplemento", en: "the surcharge/extra fee", note: "travel/fare vocabulary" },
      { es: "tramitar (un cambio)", en: "to process (a change)", note: "bureaucratic/administrative verb" },
      { es: "la ventanilla", en: "the window (seat) / service counter", note: "double meaning — context distinguishes" },
      { es: "la compensación económica", en: "financial compensation", note: "consumer-rights vocabulary" }
    ],
    grammarNotes: [
      { point: "Tener derecho a que + subjunctive", explanation: "'Tiene usted derecho a que le recoloquemos' — derecho a que triggers subjunctive since it introduces what the airline/train company will do for the customer as a right, not a stated fact yet realized." },
      { point: "Conditional for hypothetical scheduling options", explanation: "'Llegaría sobre las 20:30', 'ese tendría un pequeño suplemento' — conditional used to present not-yet-confirmed options politely." },
      { point: "Formal usted register throughout", explanation: "Both customer and employee use usted consistently — standard for a formal institutional service interaction in Spain, contrasting with the tú-based dialogues elsewhere in this set." },
      { point: "Como + cause clause fronting", explanation: "'Como he perdido casi dos horas...' fronting the cause with como (since/as) is a natural, advanced way to justify a request before making it." }
    ],
    comprehensionQuestions: [
      { q: "¿Por qué perdió el viajero el tren de enlace?", type: "short-answer", answer: "Porque el primer tren desde Sevilla llegó con 40 minutos de retraso." },
      { q: "¿Tiene que pagar el viajero por el cambio de billete?", type: "mc", options: ["Sí, el precio completo", "No, es gratuito por el retraso confirmado", "Solo la mitad"], answer: "No, es gratuito por el retraso confirmado" },
      { q: "¿A qué hora sale el tren que finalmente elige el viajero?", type: "mc", options: ["18:00", "19:30", "20:30"], answer: "18:00" },
      { q: "¿A partir de cuántos minutos de retraso da derecho Renfe a compensación económica?", type: "short-answer", answer: "A partir de 60 minutos de retraso." },
      { q: "¿Cómo puede solicitar el viajero la compensación?", type: "short-answer", answer: "En la web de Renfe, usando el número de incidencia proporcionado." }
    ],
    speakingTasks: [
      "Roleplay explaining a missed connection to a Renfe/train employee, including the cause and your onward time constraints.",
      "Practice politely asking about compensation rights using 'tendría derecho a...' after already resolving the immediate ticket problem.",
      "Narrate afterward, to a friend, the whole missed-connection story from start to resolution, using preterite and imperfect together."
    ],
    dictationText: "Tiene usted derecho a que le recoloquemos en el siguiente tren disponible sin coste adicional.",
    culturalNotes: {
      context: "Renfe, Spain's national rail operator, has a formal delay-compensation policy (Compromiso Renfe) that automatically grants refunds or compensation for AVE high-speed delays over a set threshold, which is well known among frequent Spanish travelers.",
      nativeBehaviour: "Renfe staff at major stations like Atocha typically resolve rebooking issues directly at the platform-level customer service desk rather than requiring travelers to queue at a separate ticket office — efficiency in this specific scenario is generally better than travelers expect.",
      register: "Formal usted is standard and expected in this institutional context, even though Spain is generally a tú-leaning culture socially — service interactions with strangers in official settings default to usted, especially when the customer is asking for something.",
      keyExpressions: ["tener derecho a", "sin coste adicional", "el número de incidencia", "siento las molestias"],
      warnings: ["Don't assume compensation is automatic without asking — while it's a legal right, travelers are generally expected to request it explicitly, often via the website with an incident number.", "Avoid over-apologizing or getting visibly frustrated with staff — a calm, factual explanation of the situation ('el tren venía con retraso') gets faster results in Spanish institutional settings."],
      regionalNotes: "The 60-minute compensation threshold and tiered percentage system (50-100%) is specific, real Renfe policy — this reflects genuine Spanish consumer-protection norms for rail travel, distinct from many other European systems.",
      practicalAdvice: "Always keep your original ticket and ask for a 'número de incidencia' (incident number) — this is the reference needed to claim compensation later online, and staff will provide it if asked.",
      nativeSpeakerNotes: "The employee's closing 'siento las molestias' (sorry for the inconvenience) is a standard formal service-closing phrase in Spain — polite but not effusive, reflecting professional register rather than personal apology."
    },
    commonMistakes: [
      "Using tú with Renfe staff in this formal institutional context instead of the expected usted, which can come across as overly casual.",
      "Saying 'tengo derecho a recibir' with indicative instead of the subjunctive-triggering construction 'tengo derecho a que me recoloquen' when someone else performs the action.",
      "Translating 'track incident' too literally as 'incidente de pista' instead of the correct Spanish rail terminology 'incidencia de vía'.",
      "Forgetting to ask proactively about compensation, assuming (incorrectly) that a rebooking automatically includes it without a separate request."
    ],
    advancedLowExtension: "Narrate, as if recounting it to a friend afterward, the entire missed-connection experience from when you realized you'd miss the train to how it was resolved — include what you were thinking/feeling (imperfect), what happened step by step (preterite), and what you would do differently next time (conditional/hypothetical). Include at least one subjunctive clause about your rights as a passenger."
  },
  {
    id: "dlg_chal_pasaporte_perdido",
    title: "Pasaporte perdido: comisaría y consulado",
    englishTitle: "Lost passport: police station and consulate",
    level: "B2",
    category: "challenge",
    topic: "lost-passport",
    scenario: "Estás de viaje en Sevilla y descubres que te han robado la mochila con el pasaporte dentro. Vas a la comisaría a poner una denuncia y luego llamas al consulado de tu país.",
    lines: [
      { speaker: "Policía", es: "Buenas tardes. ¿En qué le puedo ayudar?", en: "Good afternoon. How can I help you?" },
      { speaker: "Tú", es: "Buenas tardes, vengo a poner una denuncia. Me han robado la mochila esta mañana en el autobús, y dentro llevaba el pasaporte, la cartera y el móvil viejo.", en: "Good afternoon, I've come to file a police report. My backpack was stolen this morning on the bus, and it had my passport, wallet, and old phone in it." },
      { speaker: "Policía", es: "Vale, cuénteme con detalle qué ha pasado. ¿A qué hora fue exactamente y en qué línea de autobús iba?", en: "Okay, tell me in detail what happened. What time exactly was it and what bus line were you on?" },
      { speaker: "Tú", es: "Pues serían sobre las diez de la mañana. Iba en el autobús C2, muy lleno, y en algún momento entre que subí y que me bajé, alguien debió de abrirme la mochila sin que me diera cuenta.", en: "It would have been around ten in the morning. I was on the C2 bus, very crowded, and at some point between when I got on and when I got off, someone must have opened my backpack without me noticing." },
      { speaker: "Policía", es: "Es un método muy típico en autobuses concurridos, por desgracia. ¿Se dio cuenta en el momento o más tarde?", en: "It's a very typical method on crowded buses, unfortunately. Did you notice it in the moment or later?" },
      { speaker: "Tú", es: "Más tarde, cuando ya había llegado a mi alojamiento y quise sacar el pasaporte para hacer el check-in. Ahí fue cuando me di cuenta de que no estaba.", en: "Later, when I had already arrived at my accommodation and wanted to take out my passport to check in. That's when I realized it wasn't there." },
      { speaker: "Policía", es: "Entendido. Le voy a pedir su nombre completo, nacionalidad y número de pasaporte, si lo recuerda o tiene alguna copia, aunque sea una foto.", en: "Understood. I'm going to ask for your full name, nationality, and passport number, if you remember it or have any copy, even a photo." },
      { speaker: "Tú", es: "Menos mal que tenía una foto del pasaporte guardada en el correo electrónico. Se lo enseño ahora mismo desde el móvil.", en: "Thank goodness I had a photo of my passport saved in my email. I'll show it to you right now from my phone." },
      { speaker: "Policía", es: "Perfecto, eso nos facilita bastante las cosas. En unos minutos le tendré lista la denuncia. La va a necesitar tanto para el consulado como para el seguro de viaje.", en: "Perfect, that makes things a lot easier for us. In a few minutes I'll have the report ready for you. You're going to need it both for the consulate and for your travel insurance." },
      { speaker: "Tú", es: "Genial, muchas gracias. Nada más salir de aquí voy a llamar al consulado, porque supongo que necesitaré un pasaporte de emergencia para poder volver a mi país.", en: "Great, thank you very much. As soon as I leave here I'm going to call the consulate, because I imagine I'll need an emergency passport to be able to return to my country." },
      { speaker: "Empleado consular", es: "Consulado, buenas tardes, ¿en qué puedo ayudarle?", en: "Consulate, good afternoon, how can I help you?" },
      { speaker: "Tú", es: "Buenas tardes, le llamo porque me han robado el pasaporte en Sevilla y tengo el vuelo de vuelta pasado mañana. Ya tengo la denuncia policial hecha.", en: "Good afternoon, I'm calling because my passport was stolen in Seville and I have my return flight the day after tomorrow. I already have the police report done." },
      { speaker: "Empleado consular", es: "De acuerdo, no se preocupe, esto lo vemos constantemente. Necesitaría que viniera mañana a primera hora con la denuncia, una foto de carné y, si tiene, una copia del pasaporte robado.", en: "Alright, don't worry, we see this constantly. I'd need you to come tomorrow first thing with the report, a passport photo, and, if you have it, a copy of the stolen passport." },
      { speaker: "Tú", es: "Tengo una foto del pasaporte en el correo, ¿serviría eso como copia?", en: "I have a photo of the passport in my email, would that work as a copy?" },
      { speaker: "Empleado consular", es: "Sí, perfectamente, imprímala si puede o enséñenosla desde el móvil. Con eso podríamos emitirle un documento de viaje de emergencia en el mismo día.", en: "Yes, perfectly, print it if you can or show it to us from your phone. With that we could issue you an emergency travel document the same day." },
      { speaker: "Tú", es: "Qué alivio. Muchísimas gracias por la ayuda, mañana estaré ahí a primera hora.", en: "What a relief. Thank you so much for the help, tomorrow I'll be there first thing." }
    ],
    vocabulary: [
      { es: "poner una denuncia", en: "to file a police report", note: "essential legal/bureaucratic phrase" },
      { es: "el alojamiento", en: "the accommodation", note: "travel vocabulary" },
      { es: "sin que me diera cuenta", en: "without me noticing", note: "sin que + subjunctive construction" },
      { es: "el pasaporte de emergencia / documento de viaje de emergencia", en: "emergency passport / emergency travel document", note: "consular vocabulary" },
      { es: "el seguro de viaje", en: "travel insurance", note: "essential travel vocabulary" },
      { es: "el carné (foto de carné)", en: "ID / ID photo", note: "carné used broadly for ID-type documents" },
      { es: "emitir (un documento)", en: "to issue (a document)", note: "bureaucratic/official verb" },
      { es: "primera hora", en: "first thing (in the morning)", note: "very common time expression" }
    ],
    grammarNotes: [
      { point: "Deber de + infinitive for past probability", explanation: "'Alguien debió de abrirme la mochila' expresses a probable past action — deber de + infinitive (not deber + infinitive, which is obligation) signals conjecture." },
      { point: "Sin que + subjunctive", explanation: "'Sin que me diera cuenta' — sin que always requires subjunctive, expressing an action happening without another's awareness/participation." },
      { point: "Conditional of estimation", explanation: "'Serían sobre las diez' uses conditional to estimate an approximate past time, a common Spanish structure with no direct English equivalent (English would just say 'it was around ten')." },
      { point: "Necesitaría que + subjunctive for formal requests", explanation: "'Necesitaría que viniera mañana' — formal, softened request structure used by officials making requirements sound like polite asks rather than orders." }
    ],
    comprehensionQuestions: [
      { q: "¿Dónde le robaron la mochila al viajero?", type: "mc", options: ["En el hotel", "En el autobús C2", "En la calle"], answer: "En el autobús C2" },
      { q: "¿Cuándo se dio cuenta de que le faltaba el pasaporte?", type: "short-answer", answer: "Más tarde, al llegar al alojamiento e intentar hacer el check-in." },
      { q: "¿Qué tenía guardado el viajero que facilitó el trámite?", type: "mc", options: ["El pasaporte físico", "Una foto del pasaporte en el correo", "Una copia en la maleta"], answer: "Una foto del pasaporte en el correo" },
      { q: "¿Para qué dos cosas le servirá la denuncia policial?", type: "short-answer", answer: "Para el consulado y para el seguro de viaje." },
      { q: "¿Qué necesita llevar al consulado al día siguiente?", type: "short-answer", answer: "La denuncia, una foto de carné, y si tiene, una copia/foto del pasaporte robado." }
    ],
    speakingTasks: [
      "Roleplay filing a police report for a stolen item, narrating the timeline of events (when, where, how you noticed).",
      "Practice a phone call to a consulate explaining an emergency document need under time pressure.",
      "Narrate the whole experience afterward as an anecdote to a friend, combining preterite for events and imperfect for background description."
    ],
    dictationText: "Alguien debió de abrirme la mochila sin que me diera cuenta. Menos mal que tenía una foto del pasaporte guardada en el correo.",
    culturalNotes: {
      context: "Pickpocketing on crowded public buses and metro lines is a well-documented issue in major Spanish tourist cities (Sevilla, Barcelona, Madrid), and police are very accustomed to processing these denuncias efficiently and without judgment.",
      nativeBehaviour: "Spanish police (policía nacional/local) handling tourist theft reports are typically businesslike and reassuring rather than alarmed — 'esto lo vemos constantemente' reflects a genuinely routine, well-practiced process.",
      register: "Formal usted throughout with both police and consular staff — official interactions in Spain almost universally default to usted regardless of the visitor's age or how informal Spanish culture is socially.",
      keyExpressions: ["poner una denuncia", "menos mal que", "primera hora", "no se preocupe, esto lo vemos constantemente"],
      warnings: ["A denuncia (police report) is not the same as a denuncia in a criminal-accusation sense against a specific person — here it primarily documents the theft for insurance/consular purposes.", "Don't assume you need the physical stolen passport for anything — a photo/copy is generally sufficient for both denuncia and consulate in emergencies."],
      regionalNotes: "Consulates of most countries in Spain are used to processing emergency travel documents quickly for tourists who've had passports stolen, especially in high-tourism cities — same-day service, as shown here, is realistic when documentation (denuncia + photo ID) is in order.",
      practicalAdvice: "Keeping a photo of your passport's ID page in an email or cloud drive (not just your phone gallery, in case that's also stolen) is standard, recommended practice precisely for situations like this one.",
      nativeSpeakerNotes: "Note the officer's calm, procedural tone throughout — Spanish institutional register in stressful situations favors steady reassurance ('no se preocupe') over emotional language, which can feel understated to some English speakers but is meant to be comforting through competence."
    },
    commonMistakes: [
      "Confusing 'denuncia' with 'demanda' — denuncia is a police report of an incident/crime, demanda is a formal legal lawsuit; they are not interchangeable.",
      "Using 'deber' instead of 'deber de' when expressing probability ('debió abrirme' vs. the more standard conjecture form 'debió de abrirme') — though colloquially both are heard, deber de is the traditionally 'correct' probability marker worth knowing for advanced accuracy.",
      "Forgetting subjunctive after sin que ('sin que me di cuenta' is incorrect; must be 'sin que me diera cuenta').",
      "Translating 'I realized' consistently as 'realicé' (false friend meaning 'I carried out/accomplished') instead of the correct 'me di cuenta de que'."
    ],
    advancedLowExtension: "Narrate the full story of losing important documents while traveling (real or invented): set the scene (imperfect), describe what happened step by step (preterite), explain what you did to resolve it, and hypothesize what you would have done differently to prevent it (pluperfect subjunctive: si hubiera llevado una copia...). Include at least one deber de + infinitive conjecture and one sin que + subjunctive clause."
  },
  {
    id: "dlg_chal_problema_alquiler",
    title: "Sin agua caliente: problema con el casero",
    englishTitle: "No hot water: problem with the landlord",
    level: "B2",
    category: "challenge",
    topic: "housing-dispute",
    scenario: "Llevas cinco días sin agua caliente en tu piso de alquiler en Zaragoza y, además, has visto un cargo extra en la factura que no entiendes. Llamas a tu casero, Ricardo, para resolverlo.",
    lines: [
      { speaker: "Tú", es: "Hola, Ricardo, soy Marta, la inquilina del piso de la calle Alfonso. Te llamo porque llevamos ya cinco días sin agua caliente y necesito que se solucione cuanto antes.", en: "Hi, Ricardo, it's Marta, the tenant of the flat on Alfonso street. I'm calling because we've now gone five days without hot water and I need it to be fixed as soon as possible." },
      { speaker: "Ricardo", es: "Ah, hola Marta. Sí, me comentaste algo la semana pasada, pero pensaba que ya se había arreglado. ¿Sigue sin funcionar el termo?", en: "Ah, hi Marta. Yes, you mentioned something last week, but I thought it had already been fixed. Is the water heater still not working?" },
      { speaker: "Tú", es: "No, para nada. Sigue exactamente igual. Y mira, entiendo que estas cosas pasan, pero cinco días sin poder ducharme con agua caliente ya es demasiado.", en: "No, not at all. It's exactly the same. And look, I understand these things happen, but five days without being able to shower with hot water is already too much." },
      { speaker: "Ricardo", es: "Tienes toda la razón, lo siento. Voy a llamar al técnico hoy mismo para que venga esta semana sin falta. Es que, sinceramente, se me había pasado por completo.", en: "You're absolutely right, I'm sorry. I'm going to call the technician today without fail so they come this week. It's just that, honestly, it had completely slipped my mind." },
      { speaker: "Tú", es: "Te agradezco que lo soluciones, pero necesitaría una fecha concreta, no un 'esta semana' genérico, porque ya me ha pasado antes que se retrasa más de lo prometido.", en: "I appreciate you fixing it, but I'd need a specific date, not a generic 'this week', because it's happened to me before that it gets delayed longer than promised." },
      { speaker: "Ricardo", es: "Entendido, tienes razón en pedirlo. Le voy a decir al técnico que venga mañana por la mañana, y si no puede, te aviso hoy mismo por la tarde para buscar otra solución.", en: "Understood, you're right to ask for it. I'll tell the technician to come tomorrow morning, and if he can't, I'll let you know today in the afternoon to find another solution." },
      { speaker: "Tú", es: "Perfecto, así sí. Por otro lado, quería comentarte algo más: en la última factura de la comunidad hay un cargo de ochenta euros que no reconozco, algo de 'derrama extraordinaria'.", en: "Perfect, that works. On another note, I wanted to mention something else: on the last community bill there's an eighty-euro charge I don't recognize, something about an 'extraordinary levy'." },
      { speaker: "Ricardo", es: "Ah, eso es por el arreglo del tejado del edificio, que se aprobó en la última junta de vecinos. Pero espera, eso debería pagarlo yo como propietario, no debería habértelo cargado a ti.", en: "Ah, that's for the building's roof repair, which was approved at the last residents' meeting. But wait, that should be paid by me as the owner, it shouldn't have been charged to you." },
      { speaker: "Tú", es: "Eso pensaba yo también, porque en el contrato pone claramente que los gastos extraordinarios de comunidad corren de tu cuenta, no de la mía.", en: "That's what I thought too, because the contract clearly states that extraordinary community expenses are your responsibility, not mine." },
      { speaker: "Ricardo", es: "Tienes toda la razón, voy a revisarlo con la administradora de fincas y te devuelvo esos ochenta euros en cuanto lo confirme, probablemente esta misma semana.", en: "You're absolutely right, I'll check it with the property manager and I'll refund you those eighty euros as soon as I confirm it, probably this very week." },
      { speaker: "Tú", es: "Genial, muchas gracias por tomártelo en serio. Y bueno, en cuanto sepas la hora exacta del técnico, avísame, que tengo que organizarme el teletrabajo de mañana.", en: "Great, thank you very much for taking it seriously. And well, as soon as you know the technician's exact time, let me know, since I need to organize my remote work for tomorrow." },
      { speaker: "Ricardo", es: "Sin problema, Marta. Te escribo esta tarde en cuanto hable con él. Y de verdad, siento las molestias de estos días.", en: "No problem, Marta. I'll write to you this afternoon as soon as I talk to him. And really, I'm sorry for the inconvenience these past few days." }
    ],
    vocabulary: [
      { es: "el/la inquilino/a", en: "the tenant", note: "rental vocabulary, contrasts with casero/propietario" },
      { es: "el termo", en: "the water heater", note: "essential housing appliance vocabulary" },
      { es: "sin falta", en: "without fail", note: "used to emphasize a firm commitment" },
      { es: "la derrama extraordinaria", en: "the extraordinary levy/special assessment", note: "community-of-owners (comunidad de vecinos) financial term" },
      { es: "la junta de vecinos", en: "the residents' meeting", note: "governing body of a comunidad de vecinos" },
      { es: "correr de cuenta de (alguien)", en: "to be (someone's) responsibility/expense", note: "formal expression for financial responsibility" },
      { es: "la administradora de fincas", en: "the property management company/administrator", note: "manages comunidad de vecinos finances" },
      { es: "los gastos", en: "the expenses/costs", note: "essential rental/housing vocabulary" }
    ],
    grammarNotes: [
      { point: "Necesitar que + subjunctive for firm requests", explanation: "'Necesito que se solucione' and 'necesitaría que me dieras una fecha' escalate politely but firmly using subjunctive-triggering necessity verbs." },
      { point: "No debería haber + participle for past error correction", explanation: "'No debería habértelo cargado' — conditional + haber + participle expresses that a past action was wrong and shouldn't have happened, key for disputing a charge." },
      { point: "Se me había pasado — reflexive/involuntary se construction", explanation: "'Se me había pasado por completo' uses the involuntary se construction (like se me olvidó) to soften an admission of fault by framing it as something that happened to the speaker rather than something they did." },
      { point: "En cuanto + subjunctive/indicative for future time clauses", explanation: "'En cuanto lo confirme' (subjunctive, future/uncertain) vs. 'en cuanto hable con él' — both project forward in time and require subjunctive when the action hasn't happened yet." }
    ],
    comprehensionQuestions: [
      { q: "¿Cuántos días lleva Marta sin agua caliente?", type: "mc", options: ["Dos días", "Cinco días", "Una semana"], answer: "Cinco días" },
      { q: "¿Qué excusa da Ricardo por no haberlo arreglado antes?", type: "short-answer", answer: "Que pensaba que ya estaba arreglado y que se le había pasado por completo." },
      { q: "¿Qué es la 'derrama extraordinaria' que aparece en la factura?", type: "mc", options: ["Un aumento del alquiler", "Un cargo por el arreglo del tejado del edificio", "Una multa"], answer: "Un cargo por el arreglo del tejado del edificio" },
      { q: "Según el contrato, ¿quién debería pagar los gastos extraordinarios de comunidad?", type: "short-answer", answer: "El propietario (Ricardo), no la inquilina." },
      { q: "¿Qué promete hacer Ricardo respecto a los 80 euros?", type: "short-answer", answer: "Confirmarlo con la administradora de fincas y devolvérselos a Marta, probablemente esa misma semana." }
    ],
    speakingTasks: [
      "Roleplay reporting an ongoing maintenance issue to a landlord and pushing for a specific date, not a vague promise.",
      "Practice disputing an incorrect charge on a bill, citing what the contract states.",
      "Narrate afterward how the housing issue was resolved, using se me había + past participle to describe things that 'happened to' you or the landlord."
    ],
    dictationText: "No debería habértelo cargado a ti. Voy a revisarlo con la administradora de fincas y te devuelvo esos ochenta euros en cuanto lo confirme.",
    culturalNotes: {
      context: "In Spain, rental disputes over maintenance and comunidad de vecinos (homeowners' association) charges are common and governed by the Ley de Arrendamientos Urbanos (LAU), which clearly separates ordinary vs. extraordinary expenses between tenant and landlord.",
      nativeBehaviour: "Spanish tenants are generally expected to be assertive but not aggressive when pushing landlords for repairs — repeating a firm, specific request ('necesitaría una fecha concreta') rather than escalating to anger is the culturally effective approach.",
      register: "Tuteo is standard between tenant and landlord in Spain even in a dispute — this doesn't reduce the seriousness of the complaint; firmness is expressed through directness and specificity, not formality of pronouns.",
      keyExpressions: ["cuanto antes", "sin falta", "correr de cuenta de", "tienes toda la razón"],
      warnings: ["Derramas extraordinarias (special assessments for major building repairs) are legally the owner's responsibility, not the tenant's, under Spanish rental law — tenants should know this distinction and cite the contract when disputing such charges.", "Don't confuse 'gastos ordinarios de comunidad' (which can sometimes be negotiated into the rent) with 'derramas extraordinarias' (almost always the owner's burden) — mixing these up weakens your position in a dispute."],
      regionalNotes: "Comunidad de vecinos structures (with juntas de vecinos voting on repairs) are a distinctively Spanish housing institution, especially relevant in apartment buildings (pisos) common across Spanish cities.",
      practicalAdvice: "Keeping a paper trail — texting or emailing after a phone call to confirm what was agreed ('como hablamos por teléfono, confirmo que...') — is standard practice for Spanish tenants dealing with unresponsive landlords.",
      nativeSpeakerNotes: "Notice how Marta repeats 'tienes toda la razón' back — an agreement-mirroring phrase that Ricardo also uses to accept fault; this reciprocal phrase is a common de-escalation tool in Spanish conflict conversations."
    },
    commonMistakes: [
      "Using 'necesito que tú soluciones' with indicative instead of correctly conjugated subjunctive 'necesito que (tú) soluciones' — actually the correct subjunctive form is 'soluciones', so the common error is producing indicative 'solucionas' instead.",
      "Translating 'it slipped my mind' too literally instead of using the natural Spanish reflexive construction 'se me pasó/se me olvidó'.",
      "Confusing 'casero' (informal for landlord) with 'casera' as unrelated to 'homemade' (comida casera) — same word, different meanings depending on context.",
      "Avoiding direct confrontation about money out of politeness — in Spanish rental culture, directly citing the contract ('en el contrato pone que...') is expected and respected, not seen as rude."
    ],
    advancedLowExtension: "Narrate an extended account of a housing problem you had (real or invented) from start to resolution: describe the ongoing issue (imperfect), the specific actions you took to resolve it (preterite), what the other party should or shouldn't have done (deber + infinitive / no debería haber + participle), and what you would do differently if it happened again (conditional/hypothetical si clause)."
  },
  {
    id: "dlg_chal_emergencia_viaje",
    title: "Emergencia médica en el aeropuerto",
    englishTitle: "Medical emergency at the airport",
    level: "B2",
    category: "challenge",
    topic: "travel-emergency",
    scenario: "Estás en el aeropuerto de Málaga esperando tu vuelo cuando tu compañero de viaje empieza a sentirse muy mal. Hablas con el personal de seguridad y luego con un médico de urgencias.",
    lines: [
      { speaker: "Tú", es: "¡Perdone! Necesito ayuda urgente, por favor. Mi compañero de viaje se ha puesto muy pálido de repente y dice que le cuesta respirar.", en: "Excuse me! I need urgent help, please. My travel companion has suddenly gone very pale and says he's having trouble breathing." },
      { speaker: "Seguridad", es: "Tranquila, vamos a avisar ahora mismo al servicio médico del aeropuerto. ¿Dónde está exactamente?", en: "Stay calm, we're going to notify the airport's medical service right now. Where is he exactly?" },
      { speaker: "Tú", es: "Está sentado en la puerta de embarque doce, en el suelo porque no se veía capaz de seguir de pie. Llevamos aquí solo un par de minutos así.", en: "He's sitting at boarding gate twelve, on the floor because he didn't feel able to keep standing. We've only been like this for a couple of minutes." },
      { speaker: "Seguridad", es: "Vale, quédese con él, que ya envío al equipo médico para allá. No lo mueva y, si puede, aflójele la ropa alrededor del cuello.", en: "Okay, stay with him, I'm sending the medical team over there now. Don't move him, and if you can, loosen his clothing around his neck." },
      { speaker: "Médico", es: "Buenas, soy el médico de guardia del aeropuerto. Cuénteme qué ha pasado desde el principio, con el mayor detalle posible.", en: "Hello, I'm the airport's on-duty doctor. Tell me what happened from the beginning, with as much detail as possible." },
      { speaker: "Tú", es: "Pues estábamos haciendo cola para embarcar cuando, de repente, empezó a decir que se mareaba y que veía borroso. Luego se le puso la cara pálida y dijo que le costaba respirar.", en: "Well, we were queuing to board when, suddenly, he started saying he felt dizzy and was seeing blurry. Then his face went pale and he said he was having trouble breathing." },
      { speaker: "Médico", es: "¿Tiene alguna enfermedad conocida, alergias, o toma alguna medicación habitual?", en: "Does he have any known illness, allergies, or take any regular medication?" },
      { speaker: "Tú", es: "Que yo sepa, no tiene ninguna enfermedad grave, pero sí es alérgico a los frutos secos. No hemos comido nada raro, aunque en el avión anterior sí picamos algo del catering.", en: "As far as I know, he doesn't have any serious illness, but he is allergic to nuts. We haven't eaten anything unusual, although on the previous flight we did snack on something from the catering." },
      { speaker: "Médico", es: "Eso podría ser clave. Voy a revisarlo ahora mismo por si se trata de una reacción alérgica. Si es así, actuamos de inmediato con adrenalina.", en: "That could be key. I'm going to check him right now in case it's an allergic reaction. If that's the case, we act immediately with epinephrine." },
      { speaker: "Tú", es: "Madre mía, ojalá no sea nada grave. ¿Creen que hará falta llevarlo a un hospital, o se podrá quedar para el vuelo?", en: "Oh my goodness, I hope it's nothing serious. Do you think he'll need to be taken to a hospital, or will he be able to stay for the flight?" },
      { speaker: "Médico", es: "De momento no le puedo confirmar nada hasta que lo examine bien, pero si se confirma que es alérgico, lo más probable es que lo traslademos al hospital para observación, aunque sea unas horas.", en: "Right now I can't confirm anything until I examine him properly, but if it's confirmed he's allergic, it's most likely we'll transfer him to the hospital for observation, even if just for a few hours." },
      { speaker: "Tú", es: "Entiendo. En ese caso, ¿qué tenemos que hacer con el vuelo? Está previsto que salga en cuarenta minutos.", en: "I understand. In that case, what do we need to do about the flight? It's scheduled to leave in forty minutes." },
      { speaker: "Médico", es: "Eso se lo tendrá que gestionar directamente con la aerolínea en el mostrador; nosotros les daremos un justificante médico que sirve para cambiar el vuelo sin coste.", en: "You'll have to arrange that directly with the airline at the counter; we'll give you a medical certificate that serves to change the flight at no cost." },
      { speaker: "Tú", es: "Vale, muchas gracias por actuar tan rápido. Me quedo con él mientras lo revisan, y en cuanto pueda, voy corriendo al mostrador de la aerolínea.", en: "Okay, thank you very much for acting so quickly. I'll stay with him while they check him, and as soon as I can, I'll run to the airline counter." }
    ],
    vocabulary: [
      { es: "ponerse pálido/a", en: "to turn pale", note: "ponerse + adjective for sudden physical change" },
      { es: "costar respirar", en: "to have trouble breathing", note: "idiomatic costar construction" },
      { es: "el médico/la médica de guardia", en: "the on-duty doctor", note: "essential emergency vocabulary" },
      { es: "marearse", en: "to feel dizzy/nauseous", note: "reflexive verb, common symptom vocabulary" },
      { es: "los frutos secos", en: "nuts", note: "common allergen vocabulary, false-friend trap with 'dried fruit'" },
      { es: "trasladar (a un hospital)", en: "to transfer (to a hospital)", note: "medical/emergency logistics verb" },
      { es: "el justificante médico", en: "the medical certificate/note", note: "bureaucratic document for excusing/rebooking" },
      { es: "el mostrador (de la aerolínea)", en: "the (airline) counter", note: "airport vocabulary" }
    ],
    grammarNotes: [
      { point: "Por si + subjunctive for precautionary action", explanation: "'Voy a revisarlo por si se trata de una reacción alérgica' — por si introduces a precautionary reason for acting, common in emergency/medical Spanish." },
      { point: "Lo más probable es que + subjunctive", explanation: "'Lo más probable es que lo traslademos' — probability expressions require subjunctive, even strong probability (unlike 'seguro que' + indicative)." },
      { point: "Hasta que + subjunctive for pending future condition", explanation: "'No le puedo confirmar nada hasta que lo examine' — hasta que requires subjunctive when referring to an action not yet completed." },
      { point: "Se + passive/impersonal for procedural instructions", explanation: "'Eso se lo tendrá que gestionar con la aerolínea' combines an impersonal-feeling instruction with a direct future obligation, typical of official emergency-response language." }
    ],
    comprehensionQuestions: [
      { q: "¿Qué síntomas empezó a tener el compañero de viaje?", type: "short-answer", answer: "Mareo, visión borrosa, palidez y dificultad para respirar." },
      { q: "¿A qué es alérgico el compañero de viaje?", type: "mc", options: ["Al marisco", "A los frutos secos", "A la lactosa"], answer: "A los frutos secos" },
      { q: "¿Qué le pide el personal de seguridad a la protagonista mientras llega el médico?", type: "short-answer", answer: "Que se quede con él, no lo mueva y le afloje la ropa del cuello." },
      { q: "¿Qué es probable que ocurra si se confirma la alergia?", type: "mc", options: ["Nada, sigue el vuelo normal", "Lo trasladan al hospital para observación", "Le dan un caramelo"], answer: "Lo trasladan al hospital para observación" },
      { q: "¿Qué documento le da el médico para gestionar el vuelo?", type: "short-answer", answer: "Un justificante médico para cambiar el vuelo sin coste." }
    ],
    speakingTasks: [
      "Roleplay reporting a medical emergency to airport/airline staff, describing symptoms clearly and answering follow-up medical questions.",
      "Practice narrating symptoms in order using empezar a + infinitive and de repente.",
      "Prepare a script explaining a friend's allergy history to a doctor under time pressure, using que yo sepa to hedge uncertain information."
    ],
    dictationText: "Voy a revisarlo ahora mismo por si se trata de una reacción alérgica. Lo más probable es que lo traslademos al hospital para observación.",
    culturalNotes: {
      context: "Spanish airports and public spaces have on-site medical services (servicio médico) for emergencies, and Spain's public healthcare system generally responds quickly and without upfront payment demands, which surprises many visitors from countries with insurance-first models.",
      nativeBehaviour: "In a medical emergency, Spanish staff move quickly to action-oriented, procedural language ('vamos a avisar', 'no lo mueva') rather than reassuring small talk — this directness is meant to be efficient, not cold.",
      register: "Mixed usted/tú: security and medical staff use usted with the traveler out of professional protocol, even in an urgent situation, while the panicked traveler may lapse into less formal speech under stress — both are realistic.",
      keyExpressions: ["madre mía", "que yo sepa", "de guardia", "el justificante médico"],
      warnings: ["Don't assume a hospital transfer means huge unexpected costs — EU travelers with an EHIC/GHIC card, and most travel-insured visitors, are typically covered, and Spanish public emergency care doesn't demand payment on the spot.", "Avoid confusing 'frutos secos' (nuts, a common allergen) with 'fruta seca' (dried fruit) — a classic vocabulary trap in medical/allergy contexts."],
      regionalNotes: "Major Spanish airports (Málaga, Madrid-Barajas, Barcelona-El Prat) have dedicated on-site medical teams for exactly this kind of situation, and airlines are legally required to accept a medical certificate for penalty-free rebooking.",
      practicalAdvice: "In a medical emergency in Spain, stating known allergies and medications immediately and clearly ('es alérgico a...') is the single most useful information you can give — Spanish emergency responders will ask for this right away, as shown here.",
      nativeSpeakerNotes: "The doctor's calm, procedural 'de momento no le puedo confirmar nada hasta que lo examine' models how Spanish professionals avoid promising outcomes prematurely — a pattern worth imitating in your own emergency Spanish."
    },
    commonMistakes: [
      "Confusing 'frutos secos' (nuts) with a literal translation attempt like 'nueces secas', missing that frutos secos is the standard umbrella term for the allergen category.",
      "Using indicative after 'lo más probable es que' instead of subjunctive — probability expressions, even strong ones, trigger subjunctive in Spanish unlike in English.",
      "Panicking into English mid-sentence instead of using set Spanish emergency phrases like 'necesito ayuda urgente' — practicing these phrases in advance avoids this common freeze-up.",
      "Translating 'trouble breathing' too literally instead of the natural Spanish 'le cuesta respirar' (costar + infinitive construction)."
    ],
    advancedLowExtension: "Narrate, as an urgent phone call to a family member back home, what happened during this airport emergency from start to finish: the symptoms, what staff did, what the doctor said, and what the plan is now. Include hypothesizing about what might happen next (es probable que / puede que + subjunctive) and at least one por si + subjunctive precaution clause."
  },
  {
    id: "dlg_chal_reclamacion_producto",
    title: "Reclamación por un producto defectuoso",
    englishTitle: "Complaint about a faulty product",
    level: "B2",
    category: "challenge",
    topic: "customer-complaint",
    scenario: "Compraste una lavadora hace tres meses y ha dejado de funcionar. Vuelves a la tienda en Bilbao con el ticket para reclamar, y el primer empleado se muestra poco colaborador, así que pides hablar con el encargado.",
    lines: [
      { speaker: "Tú", es: "Buenas tardes. Vengo a hacer una reclamación. Compré esta lavadora hace tres meses y desde ayer ha dejado de encender directamente.", en: "Good afternoon. I've come to make a complaint. I bought this washing machine three months ago and since yesterday it won't turn on at all." },
      { speaker: "Empleado", es: "Vaya, pues eso tendría que verlo el servicio técnico. Nosotros aquí en tienda no podemos hacer mucho más que darle el número de atención al cliente.", en: "Well, technical service would have to look at that. Here in the store we can't do much more than give you the customer service number." },
      { speaker: "Tú", es: "Perdona, pero tengo entendido que, al ser un producto con menos de seis meses de uso, tengo derecho a que me lo reparen, lo sustituyan o me devuelvan el dinero, y eso lo gestiona la tienda, no solo un teléfono genérico.", en: "Excuse me, but I understand that, since it's a product with less than six months of use, I'm entitled to have it repaired, replaced, or refunded, and that's handled by the store, not just a generic phone line." },
      { speaker: "Empleado", es: "Ya, bueno, es que estas cosas normalmente las gestiona directamente el fabricante, no nosotros.", en: "Right, well, it's just that these things are usually handled directly by the manufacturer, not us." },
      { speaker: "Tú", es: "Mira, con todo respeto, la ley de garantías es bastante clara en esto, y preferiría hablar con el encargado de la tienda para que me lo confirme él mismo.", en: "Look, with all due respect, the warranty law is quite clear on this, and I'd prefer to speak with the store manager so he can confirm it himself." },
      { speaker: "Encargado", es: "Buenas tardes, soy el encargado. Cuénteme qué ha pasado, por favor.", en: "Good afternoon, I'm the manager. Please tell me what happened." },
      { speaker: "Tú", es: "Pues eso, que compré esta lavadora hace tres meses, aquí tengo el ticket, y ayer dejó de funcionar por completo. Su compañero me ha dicho que esto lo tiene que gestionar el fabricante, pero según la ley de garantías, la responsabilidad es de la tienda dentro de los primeros seis meses.", en: "Well, that I bought this washing machine three months ago, here's the receipt, and yesterday it stopped working completely. Your colleague told me the manufacturer has to handle this, but according to warranty law, the store is responsible within the first six months." },
      { speaker: "Encargado", es: "Tiene usted toda la razón, disculpe la confusión. Dentro de los primeros seis meses se presume que el defecto ya existía en origen, así que nos corresponde a nosotros ofrecerle una solución.", en: "You're absolutely right, apologies for the confusion. Within the first six months it's presumed the defect already existed from the start, so it's up to us to offer you a solution." },
      { speaker: "Tú", es: "Se lo agradezco. Yo lo que preferiría, si es posible, es que me la cambien por una nueva, porque no me fío de que una reparación dure mucho en un electrodoméstico tan nuevo.", en: "I appreciate that. What I'd prefer, if possible, is for you to exchange it for a new one, because I don't trust that a repair would last long on such a new appliance." },
      { speaker: "Encargado", es: "Lo entiendo perfectamente. Puedo ofrecerle la sustitución directa por el mismo modelo, o si lo prefiere, un modelo similar de gama superior pagando solo la diferencia.", en: "I understand perfectly. I can offer you a direct replacement with the same model, or if you prefer, a similar higher-end model paying only the difference." },
      { speaker: "Tú", es: "Con la sustitución por el mismo modelo me conformo, la verdad. ¿Cuándo podría recogerla?", en: "I'll settle for the replacement with the same model, honestly. When could I pick it up?" },
      { speaker: "Encargado", es: "Mañana mismo se la tenemos preparada, y además nos encargamos nosotros de retirar la defectuosa de su domicilio sin coste alguno.", en: "We'll have it ready for you tomorrow, and moreover we'll take care of removing the faulty one from your home at no cost." },
      { speaker: "Tú", es: "Perfecto, muchas gracias por resolverlo así. Espero que a partir de ahora la comunicación entre ustedes sea un poco más clara, porque casi me voy sin solución.", en: "Perfect, thank you very much for resolving it this way. I hope from now on the communication between you all is a bit clearer, because I almost left without a solution." }
    ],
    vocabulary: [
      { es: "hacer una reclamación", en: "to file a complaint", note: "essential consumer-rights vocabulary" },
      { es: "el servicio técnico", en: "technical service/repair department", note: "common in appliance/electronics contexts" },
      { es: "la ley de garantías", en: "the warranty law", note: "Spanish/EU consumer protection legislation" },
      { es: "el/la encargado/a", en: "the manager/person in charge", note: "store-level authority, below a full store director" },
      { es: "presumirse (un defecto)", en: "to be presumed (a defect)", note: "legal-consumer terminology" },
      { es: "la sustitución", en: "the replacement", note: "consumer-rights remedy option" },
      { es: "de gama superior/alta", en: "higher-end / premium range", note: "product-tier vocabulary" },
      { es: "retirar (un electrodoméstico)", en: "to remove/collect (an appliance)", note: "logistics vocabulary for returns" }
    ],
    grammarNotes: [
      { point: "Tener derecho a que + subjunctive", explanation: "'Tengo derecho a que me lo reparen, lo sustituyan o me devuelvan el dinero' — a triple subjunctive series listing entitlements, powerful for formal complaint register." },
      { point: "Preferiría que + subjunctive vs. preferiría + infinitive", explanation: "'Preferiría que me la cambien' (different subjects) vs. 'preferiría hablar' (same subject) — contrast shows when subjunctive is required after preferir." },
      { point: "No fiarse de que + subjunctive", explanation: "'No me fío de que una reparación dure mucho' — fiarse de que with negation/doubt nuance triggers subjunctive, similar to dudar que." },
      { point: "Se + impersonal for procedural transparency", explanation: "'Se presume que el defecto ya existía' — impersonal se in legal/consumer contexts states a rule neutrally, common in formal Spanish explanations of rights." }
    ],
    comprehensionQuestions: [
      { q: "¿Cuánto tiempo hace que compró la lavadora la clienta?", type: "mc", options: ["Un mes", "Tres meses", "Un año"], answer: "Tres meses" },
      { q: "¿Qué le dice primero el empleado que debe hacer?", type: "short-answer", answer: "Que llame al servicio de atención al cliente / que lo gestiona el fabricante." },
      { q: "Según la ley de garantías, ¿de quién es la responsabilidad dentro de los primeros seis meses?", type: "mc", options: ["Del fabricante únicamente", "De la tienda", "Del cliente"], answer: "De la tienda" },
      { q: "¿Qué solución prefiere la clienta al final?", type: "short-answer", answer: "La sustitución directa por el mismo modelo, no una reparación." },
      { q: "¿Qué servicio adicional ofrece el encargado sin coste?", type: "short-answer", answer: "Retirar la lavadora defectuosa del domicilio de la clienta." }
    ],
    speakingTasks: [
      "Roleplay escalating a complaint from an unhelpful employee to a manager, citing a specific consumer-rights rule.",
      "Practice stating a preference for one remedy over another using preferiría que + subjunctive.",
      "Give a short closing statement expressing satisfaction with a resolution while still noting a critique of the earlier service, as the customer does at the end."
    ],
    dictationText: "Tengo derecho a que me lo reparen, lo sustituyan o me devuelvan el dinero, y eso lo gestiona la tienda, no solo un teléfono genérico.",
    culturalNotes: {
      context: "Spanish and EU consumer law (Ley General para la Defensa de los Consumidores y Usuarios) presumes defects present at the point of sale are the seller's responsibility for the first six months — a stronger consumer protection than some non-EU shoppers are used to.",
      nativeBehaviour: "Escalating calmly and specifically ('preferiría hablar con el encargado') rather than raising your voice is the effective, expected way to move up the chain in Spanish retail disputes — citing the actual law by name adds real credibility.",
      register: "Formal usted maintained throughout despite the tension — Spanish consumer complaint culture allows firmness without informality; switching to tú here would undercut the seriousness of the claim.",
      keyExpressions: ["hacer una reclamación", "tengo entendido que", "con todo respeto", "me conformo con"],
      warnings: ["Store employees, especially junior staff, sometimes incorrectly redirect warranty claims to manufacturers — knowing your rights (and citing the ley de garantías) is often necessary and expected of consumers in Spain.", "Don't assume 'devolución' (return/refund) and 'sustitución' (replacement) are the same remedy — Spanish consumer law names them as distinct options you can request."],
      regionalNotes: "Every physical store in Spain is required to have a 'hoja de reclamaciones' (official complaint form) available on request if a dispute isn't resolved informally — a well-known consumer-rights tool many tourists don't know exists.",
      practicalAdvice: "Always keep the 'ticket' or 'factura' (receipt/invoice) — as shown here, it's the first thing requested and is essential proof of purchase date for warranty claims.",
      nativeSpeakerNotes: "The customer's closing line politely but firmly notes the earlier poor service ('espero que la comunicación sea más clara') — ending a resolved complaint with constructive feedback rather than dropping the issue entirely is a common, assertive-but-polite Spanish consumer habit."
    },
    commonMistakes: [
      "Accepting the first unhelpful answer from junior staff instead of calmly escalating — in Spanish retail culture, asking for 'el encargado' is completely normal and not considered confrontational.",
      "Confusing 'devolución del dinero' (refund) with simply 'devolución' (return) — devolución alone can mean giving the product back without specifying the remedy.",
      "Using indicative after 'preferiría que' when the subject changes ('preferiría que me la cambian' is incorrect; must be 'me la cambien').",
      "Translating 'warranty' inconsistently — 'garantía' is the standard term; avoid the false-friend temptation of 'warranta', which doesn't exist in Spanish."
    ],
    advancedLowExtension: "Narrate an extended account of a time you had to return or complain about a faulty product (real or invented): describe the product and problem, narrate the interaction step by step including any pushback you faced, explain what specific remedy you asked for and why, and reflect on whether the outcome was fair. Use tener derecho a que + subjunctive, preferiría que + subjunctive, and at least one past-tense narrative sequence combining preterite and imperfect."
  },
  {
    id: "dlg_chal_conflicto_laboral",
    title: "Planteando un conflicto con un compañero",
    englishTitle: "Raising a conflict with a coworker",
    level: "B2",
    category: "challenge",
    topic: "workplace-conflict",
    scenario: "Trabajas en un equipo de diseño en Madrid y llevas semanas notando que un compañero, Tomás, se atribuye ideas tuyas en las reuniones. Decides hablarlo primero con él y, si no se resuelve, con vuestra jefa.",
    lines: [
      { speaker: "Tú", es: "Tomás, ¿tienes un momento? Me gustaría hablar contigo de algo que me está incomodando desde hace unas semanas.", en: "Tomás, do you have a moment? I'd like to talk to you about something that's been bothering me for a few weeks." },
      { speaker: "Tomás", es: "Claro, dime. ¿Qué pasa?", en: "Sure, tell me. What's going on?" },
      { speaker: "Tú", es: "Mira, en las dos últimas reuniones has presentado como tuyas un par de ideas que, en realidad, salieron de nuestras conversaciones previas, o directamente de mí. Y me hace sentir un poco invisible, la verdad.", en: "Look, in the last two meetings you've presented as your own a couple of ideas that, actually, came out of our previous conversations, or directly from me. And it makes me feel a bit invisible, honestly." },
      { speaker: "Tomás", es: "Vaya, no era en absoluto mi intención, te lo aseguro. Igual es que, como trabajamos tan juntos en esto, se me mezclan las ideas y ya no sé de quién fue cada cosa.", en: "Wow, that was absolutely not my intention, I assure you. Maybe it's just that, since we work so closely on this, the ideas get mixed up for me and I no longer know whose was whose." },
      { speaker: "Tú", es: "Lo entiendo, y no creo que lo hicieras con mala fe, pero sí que me gustaría que, a partir de ahora, cuando presentemos algo que hemos pensado juntos, lo dejemos claro delante del equipo.", en: "I understand that, and I don't think you did it in bad faith, but I would like it if, from now on, when we present something we've thought up together, we make that clear in front of the team." },
      { speaker: "Tomás", es: "Tienes razón, y siento que te haya hecho sentir así. A partir de ahora, prometo mencionar explícitamente cuando algo viene de una idea tuya o compartida.", en: "You're right, and I'm sorry it made you feel that way. From now on, I promise to explicitly mention when something comes from an idea of yours or a shared one." },
      { speaker: "Tú", es: "Te lo agradezco de verdad. No es que quiera montar un drama por esto, pero para mí es importante que se reconozca el trabajo de cada uno, sobre todo de cara a la evaluación de fin de año.", en: "I really appreciate it. It's not that I want to make a drama out of this, but it's important to me that everyone's work is recognized, especially with the year-end review coming up." },
      { speaker: "Tomás", es: "Totalmente de acuerdo, tiene todo el sentido. Oye, y si en alguna reunión se me vuelve a olvidar mencionarlo, dímelo ahí mismo, prefiero que me lo digas en el momento a que se quede algo pendiente.", en: "Totally agree, it makes complete sense. Hey, and if I forget to mention it again in some meeting, tell me right there, I'd rather you tell me in the moment than have something left unresolved." },
      { speaker: "Tú", es: "Perfecto, así lo haré. Y bueno, ya que estamos, ¿qué te parece si en la próxima reunión presentamos juntos la propuesta del nuevo cliente? Así lo dejamos claro desde el principio.", en: "Perfect, I'll do that. And well, since we're at it, what do you think if in the next meeting we present the new client's proposal together? That way we make it clear from the start." },
      { speaker: "Tomás", es: "Me parece una idea estupenda. Así, además, demostramos que trabajamos bien en equipo, que también cuenta para la evaluación.", en: "I think that's a great idea. That way, we also demonstrate that we work well as a team, which also counts for the review." },
      { speaker: "Tú", es: "Genial. Me alegra que lo hayamos hablado, la verdad, porque llevaba tiempo dándole vueltas y prefiero mil veces decírtelo a mí a guardármelo.", en: "Great. I'm glad we talked about it, honestly, because I'd been mulling it over for a while and I much prefer telling you directly to keeping it to myself." }
    ],
    vocabulary: [
      { es: "atribuirse (una idea)", en: "to take credit for (an idea)", note: "reflexive verb, workplace-conflict vocabulary" },
      { es: "sentirse invisible", en: "to feel invisible/overlooked", note: "emotional workplace vocabulary" },
      { es: "de mala fe", en: "in bad faith", note: "common qualifier when assessing intent" },
      { es: "montar un drama", en: "to make a big deal / drama out of something", note: "colloquial but common even in semi-formal register" },
      { es: "reconocer (el trabajo de alguien)", en: "to acknowledge/give credit for (someone's work)", note: "workplace recognition vocabulary" },
      { es: "la evaluación de fin de año", en: "the year-end review", note: "HR/performance vocabulary" },
      { es: "dar vueltas (a algo)", en: "to mull something over", note: "idiomatic, common for prolonged worry/thinking" },
      { es: "guardárselo", en: "to keep it to oneself", note: "reflexive construction, common in emotional/conflict contexts" }
    ],
    grammarNotes: [
      { point: "No creer que + subjunctive to soften an accusation", explanation: "'No creo que lo hicieras con mala fe' — using subjunctive to negate intent softens the confrontation while still naming the problem." },
      { point: "Me gustaría que + subjunctive for a requested change", explanation: "'Me gustaría que lo dejemos claro' — polite, non-confrontational request format central to diplomatic workplace Spanish." },
      { point: "Prefiero que + subjunctive vs. prefiero + infinitive", explanation: "'Prefiero que me lo digas' (different subjects) vs. 'prefiero decírtelo a mí' (same subject, using a to + pronoun contrast structure) — shows both patterns in near-parallel sentences." },
      { point: "Sentir que + subjunctive vs. sentir + infinitive for apology", explanation: "'Siento que te haya hecho sentir así' uses present perfect subjunctive because the regretted action is completed and affects the other person — a nuanced advanced apology structure." }
    ],
    comprehensionQuestions: [
      { q: "¿Qué le molesta a la protagonista sobre el comportamiento de Tomás?", type: "short-answer", answer: "Que se atribuye como propias ideas que en realidad surgieron de conversaciones conjuntas o de ella." },
      { q: "¿Cómo explica Tomás lo que ha pasado?", type: "mc", options: ["Dice que lo hizo a propósito", "Dice que se le mezclan las ideas porque trabajan muy juntos", "Niega que haya pasado"], answer: "Dice que se le mezclan las ideas porque trabajan muy juntos" },
      { q: "¿Qué solución proponen para la próxima reunión?", type: "short-answer", answer: "Presentar juntos la propuesta del nuevo cliente para dejar claro desde el principio que es trabajo conjunto." },
      { q: "¿Por qué es importante para la protagonista que se reconozca su trabajo?", type: "mc", options: ["Por orgullo personal solamente", "De cara a la evaluación de fin de año", "Porque quiere un ascenso inmediato"], answer: "De cara a la evaluación de fin de año" },
      { q: "¿Qué prefiere la protagonista: decir las cosas directamente o guardárselas?", type: "short-answer", answer: "Prefiere decirlas directamente, como ella misma explica al final." }
    ],
    speakingTasks: [
      "Roleplay raising a workplace credit/recognition issue with a colleague diplomatically, using me gustaría que + subjunctive.",
      "Practice softening a criticism with 'no creo que lo hicieras con mala fe' before stating the actual problem.",
      "Prepare and deliver a short apology using 'siento que te haya hecho sentir...' for a real or invented situation."
    ],
    dictationText: "No creo que lo hicieras con mala fe, pero sí que me gustaría que, a partir de ahora, lo dejemos claro delante del equipo.",
    culturalNotes: {
      context: "Direct, one-on-one conversations to resolve interpersonal workplace friction before escalating to a manager are generally the culturally preferred first step in Spanish offices, reflecting a value placed on resolving things 'de tú a tú' (person to person) when possible.",
      nativeBehaviour: "Spanish workplace conflict conversations often open with an explicit framing ('me gustaría hablar de algo que me incomoda') rather than easing in with small talk — naming the topic directly, then softening the delivery with hedges, is the expected pattern.",
      register: "Tuteo throughout, as is standard between peers in most Spanish companies, but note the careful hedging vocabulary (no creo que, no es que quiera) that keeps the tone constructive despite the informal pronouns.",
      keyExpressions: ["no es que quiera montar un drama", "de cara a la evaluación", "dándole vueltas", "de mala fe"],
      warnings: ["Don't assume tuteo means the conversation is casual/low-stakes — advanced diplomatic vocabulary is still expected even between friendly colleagues discussing a real grievance.", "Avoid excessive English-style indirectness that never actually names the problem — Spanish workplace conflict-resolution culture values naming the issue clearly, just with softened delivery, not avoiding it."],
      regionalNotes: "Idea/credit disputes are increasingly discussed openly in Spanish creative and tech workplaces influenced by growing awareness of workplace psychological safety, though older-generation hierarchical offices may still expect such issues to go straight to a manager rather than peer-to-peer.",
      practicalAdvice: "Proposing a concrete forward-looking fix (presenting together next time) rather than only dwelling on the past incident is considered the mark of a mature, solution-oriented conversation in Spanish professional culture.",
      nativeSpeakerNotes: "Notice Tomás's 'tienes razón, y siento que te haya hecho sentir así' — validating the other person's feelings explicitly before pivoting to a fix is a common, valued de-escalation pattern in Spanish interpersonal conflict resolution."
    },
    commonMistakes: [
      "Using indicative after 'me gustaría que' ('me gustaría que lo dejamos claro' is incorrect; must be subjunctive 'dejemos').",
      "Softening a complaint so much that the actual issue never gets stated clearly — Spanish workplace diplomacy pairs softeners with directness, not avoidance.",
      "Using present subjunctive instead of imperfect subjunctive after 'no creo que' when referring to a completed past action ('no creo que lo hagas con mala fe' is wrong for a past event; should be 'no creo que lo hicieras/hayas hecho').",
      "Translating 'I don't want to make a big deal of this' too literally instead of using the natural idiom 'no quiero montar un drama'."
    ],
    advancedLowExtension: "Narrate an extended account of a workplace conflict you experienced or witnessed (real or invented): describe the situation as it built up over time (imperfect), the specific conversation where you addressed it (preterite), how the other person reacted, and what changed afterward. Include at least one me gustaría que + subjunctive request and one sentir que + present perfect subjunctive apology structure."
  },
  {
    id: "dlg_chal_tramite_empadronamiento",
    title: "Explicando un problema burocrático complicado",
    englishTitle: "Explaining a complicated bureaucratic problem",
    level: "B2",
    category: "challenge",
    topic: "bureaucracy-explanation",
    scenario: "Te has mudado de piso en Valencia y necesitas actualizar tu empadronamiento, pero el sistema online te da un error constante. Vas al ayuntamiento a explicar el problema a una funcionaria para que te ayude a resolverlo.",
    lines: [
      { speaker: "Tú", es: "Buenos días. Vengo porque llevo intentando empadronarme en mi nueva dirección desde hace dos semanas, y el trámite online no deja de darme error.", en: "Good morning. I've come because I've been trying to register at my new address for two weeks, and the online process keeps giving me an error." },
      { speaker: "Funcionaria", es: "A ver, cuénteme paso a paso qué es exactamente lo que ha intentado hacer y en qué momento le da el error.", en: "Let's see, tell me step by step exactly what you've tried to do and at what point it gives you the error." },
      { speaker: "Tú", es: "Vale, pues primero entro con mi certificado digital, relleno el formulario con mis datos y los del piso nuevo, adjunto el contrato de alquiler escaneado, y cuando le doy a enviar, me sale un mensaje que dice que el documento no es válido.", en: "Okay, so first I log in with my digital certificate, fill out the form with my details and the new flat's details, attach the scanned rental contract, and when I click submit, I get a message saying the document is not valid." },
      { speaker: "Funcionaria", es: "Hmm, eso suele pasar cuando el contrato no está firmado electrónicamente o cuando el archivo pesa más de lo permitido. ¿Cómo escaneó usted el contrato, con un escáner o con el móvil?", en: "Hmm, that usually happens when the contract isn't electronically signed or when the file is bigger than allowed. How did you scan the contract, with a scanner or with your phone?" },
      { speaker: "Tú", es: "Con el móvil, con una aplicación de escanear documentos. Puede que el archivo sea demasiado grande, la verdad, porque son ocho páginas con fotos de bastante calidad.", en: "With my phone, with a document-scanning app. It could be that the file is too large, honestly, because it's eight pages with fairly high-quality photos." },
      { speaker: "Funcionaria", es: "Ahí está el problema, seguramente. El sistema solo admite archivos de menos de cinco megas. Le recomendaría que comprimiera el archivo antes de subirlo, o que lo escaneara en blanco y negro, que pesa mucho menos.", en: "That's probably the problem. The system only accepts files under five megabytes. I'd recommend you compress the file before uploading it, or scan it in black and white, which weighs much less." },
      { speaker: "Tú", es: "Entendido, lo intentaré así. Pero, además, tengo otra duda: el contrato está a nombre de mi pareja y mío, pero solo uno de los dos puede hacer el trámite online, ¿verdad? ¿Cómo se hace para empadronar a los dos?", en: "Understood, I'll try that. But also, I have another question: the contract is under my partner's name and mine, but only one of us can do the process online, right? How do you go about registering both of us?" },
      { speaker: "Funcionaria", es: "Correcto, uno de ustedes hace la solicitud principal, y en el mismo formulario hay un apartado para añadir a otros miembros del hogar que también quieran empadronarse en la misma dirección.", en: "Correct, one of you makes the main request, and in the same form there's a section to add other household members who also want to be registered at the same address." },
      { speaker: "Tú", es: "Ah, no había visto ese apartado, la verdad, porque el error me saltaba antes de poder avanzar tanto en el formulario.", en: "Ah, I hadn't seen that section, honestly, because the error would pop up before I could get that far in the form." },
      { speaker: "Funcionaria", es: "Tiene sentido. Una vez solucionado lo del archivo, verá que el formulario avanza sin problema y le aparecerá esa opción. Si le vuelve a dar error después de comprimirlo, puede venir aquí directamente con el contrato en papel y se lo tramitamos en persona.", en: "That makes sense. Once the file issue is solved, you'll see the form progresses without a problem and that option will appear. If it gives you an error again after compressing it, you can come here directly with the paper contract and we'll process it in person." },
      { speaker: "Tú", es: "Perfecto, muchísimas gracias por explicármelo tan bien. Creo que ahora sí que lo voy a poder resolver yo sola desde casa.", en: "Perfect, thank you so much for explaining it so well. I think now I'll be able to solve it myself from home." },
      { speaker: "Funcionaria", es: "De nada. Y, por si acaso, aquí tiene un papel con mi extensión directa, para que no tenga que empezar la explicación desde cero si vuelve a llamar.", en: "You're welcome. And, just in case, here's a paper with my direct extension, so you don't have to start the explanation from scratch if you call again." }
    ],
    vocabulary: [
      { es: "empadronarse", en: "to register at an address (padrón/civil registry)", note: "essential Spanish bureaucratic verb, no direct English equivalent" },
      { es: "el certificado digital", en: "the digital certificate", note: "used for identity verification in Spanish e-government" },
      { es: "adjuntar (un documento)", en: "to attach (a document)", note: "standard online-forms vocabulary" },
      { es: "pesar (un archivo)", en: "to weigh / be sized (a file)", note: "figurative use of pesar for file size" },
      { es: "comprimir (un archivo)", en: "to compress (a file)", note: "tech vocabulary" },
      { es: "el/la funcionario/a", en: "the civil servant/official", note: "government-office worker" },
      { es: "la solicitud", en: "the application/request", note: "essential bureaucratic vocabulary" },
      { es: "tramitar en persona", en: "to process in person", note: "contrasted with online trámites" }
    ],
    grammarNotes: [
      { point: "Recomendar que + subjunctive for formal advice", explanation: "'Le recomendaría que comprimiera el archivo' — conditional recomendaría + subjunctive comprimiera, a doubly softened, very formal advice structure common in official settings." },
      { point: "Sequencing a multi-step process with ordinal/temporal markers", explanation: "'Primero entro..., relleno..., adjunto..., y cuando le doy a enviar...' — chaining present-tense steps with temporal connectors is key for explaining procedures clearly." },
      { point: "Puede que + subjunctive for tentative diagnosis", explanation: "'Puede que el archivo sea demasiado grande' — hedged hypothesis about the cause of a problem, essential register for troubleshooting conversations." },
      { point: "Para que + subjunctive explaining purpose of an offered solution", explanation: "'Aquí tiene mi extensión, para que no tenga que empezar desde cero' — purpose clause explaining why a solution/favor is being offered." }
    ],
    comprehensionQuestions: [
      { q: "¿Qué trámite intenta hacer la protagonista?", type: "short-answer", answer: "Empadronarse en su nueva dirección en Valencia." },
      { q: "¿Cuál es la causa probable del error según la funcionaria?", type: "mc", options: ["El certificado digital ha caducado", "El archivo del contrato pesa demasiado", "La dirección no existe"], answer: "El archivo del contrato pesa demasiado" },
      { q: "¿Qué le recomienda la funcionaria para solucionar el problema del archivo?", type: "short-answer", answer: "Comprimir el archivo o escanearlo en blanco y negro." },
      { q: "¿Cómo se puede empadronar también la pareja de la protagonista?", type: "mc", options: ["Con una solicitud completamente separada", "Añadiéndola en un apartado del mismo formulario", "No es posible, debe ir en persona"], answer: "Añadiéndola en un apartado del mismo formulario" },
      { q: "¿Qué le da la funcionaria a la protagonista al final por si necesita ayuda de nuevo?", type: "short-answer", answer: "Un papel con su extensión directa." }
    ],
    speakingTasks: [
      "Roleplay explaining a multi-step technical or bureaucratic problem to someone who needs to help you solve it, describing each step in order.",
      "Practice a troubleshooting exchange using puede que + subjunctive to hypothesize about the cause of a problem.",
      "Explain, in your own words, a real online form or bureaucratic process from your own country using sequencing connectors (primero, luego, después, una vez que)."
    ],
    dictationText: "Le recomendaría que comprimiera el archivo antes de subirlo, o que lo escaneara en blanco y negro, que pesa mucho menos.",
    culturalNotes: {
      context: "Empadronamiento (municipal registration) is a foundational Spanish bureaucratic step required for access to healthcare, school enrollment, and many other services — it has no direct equivalent in many English-speaking countries, which often surprises newcomers.",
      nativeBehaviour: "Spanish civil servants dealing with a citizen's technical problem typically ask for a precise step-by-step account before diagnosing the issue, rather than guessing — being able to narrate your own process clearly, as the speaker does, significantly speeds up help.",
      register: "Formal usted throughout, standard for any interaction in a government office (ayuntamiento) — this remains true even though the tone here is warm and helpful rather than cold.",
      keyExpressions: ["el trámite", "no deja de darme error", "desde cero", "por si acaso"],
      warnings: ["Digital certificates (certificado digital) and file-size limits are common, genuine friction points in Spanish e-government systems — this isn't an exaggerated scenario but a realistic one many residents encounter.", "Don't assume a single household member's registration automatically covers a partner or family member — Spanish empadronamiento forms typically require explicitly adding each household member."],
      regionalNotes: "Ayuntamientos (city/town halls) across Spain vary somewhat in their online systems' reliability, and offering to finish a stuck online trámite in person is a very standard, expected fallback offered by Spanish civil servants.",
      practicalAdvice: "When a Spanish bureaucratic website gives a vague error, compressing/reducing file sizes and checking digital signature requirements are the two most common real fixes — worth trying before assuming a deeper problem.",
      nativeSpeakerNotes: "The funcionaria offering her direct extension ('para que no tenga que empezar desde cero') reflects a genuinely helpful, continuity-focused service style found in many well-run Spanish public offices, countering the stereotype of impersonal bureaucracy."
    },
    commonMistakes: [
      "Explaining a multi-step problem out of order or vaguely instead of using clear sequencing (primero, luego, cuando) — Spanish civil servants and technical staff respond much faster to an ordered account.",
      "Translating 'file size' awkwardly instead of using the natural Spanish verb 'pesar' (el archivo pesa mucho) for digital file weight/size.",
      "Using indicative instead of subjunctive after 'le recomendaría que' — recommendation verbs, even in the conditional, still trigger subjunctive in the dependent clause.",
      "Assuming 'empadronarse' translates directly to 'to register' without qualification — in English-speaking contexts there is no exact one-word equivalent, so over-literal single-word translation causes confusion."
    ],
    advancedLowExtension: "Explain, in extended detail, a complicated bureaucratic or technical problem you've had to solve (in Spain or elsewhere) to someone who needs enough information to actually help you: describe the multi-step process you followed, exactly where and how it failed, what you've already tried, and what outcome you need. Use puede que + subjunctive for hypothesizing causes and para que + subjunctive to explain the purpose of at least one requested solution."
  },
  {
    id: "dlg_chal_defendiendo_opinion",
    title: "Defendiendo una opinión ante la presión",
    englishTitle: "Defending an opinion under pushback",
    level: "B2",
    category: "challenge",
    topic: "defending-opinion",
    scenario: "En una cena familiar en Toledo, tu tío Fernando cuestiona tu decisión de dejar un trabajo estable para montar tu propio negocio, y defiendes tu postura durante toda la sobremesa.",
    lines: [
      { speaker: "Fernando", es: "A ver, sobrina, no te lo tomes a mal, pero no acabo de entender por qué has dejado un trabajo fijo, con nómina segura, para meterte en la aventura esta de montar tu propio negocio.", en: "Look, niece, don't take it the wrong way, but I just don't understand why you've left a permanent job, with a secure paycheck, to get into this adventure of starting your own business." },
      { speaker: "Tú", es: "Lo entiendo, tío, y sé que desde fuera puede parecer una locura, pero para mí llevaba dos años sintiendo que no crecía, ni profesional ni económicamente, en ese trabajo.", en: "I understand, uncle, and I know from the outside it might seem crazy, but for me, for two years I'd been feeling like I wasn't growing, either professionally or financially, in that job." },
      { speaker: "Fernando", es: "Ya, pero es que un negocio propio implica un riesgo altísimo. ¿Y si no funciona? Te quedas sin ahorros y sin el trabajo que tenías, que no es tan fácil de recuperar hoy en día.", en: "Right, but a business of your own involves an extremely high risk. What if it doesn't work? You end up without savings and without the job you had, which isn't so easy to get back nowadays." },
      { speaker: "Tú", es: "Es un riesgo real, no te lo voy a negar. Pero he pasado los últimos seis meses haciendo números, hablando con clientes potenciales y ahorrando un colchón para aguantar al menos un año sin ingresos estables.", en: "It's a real risk, I won't deny it. But I've spent the last six months crunching numbers, talking to potential clients, and saving a cushion to hold out at least a year without stable income." },
      { speaker: "Fernando", es: "Bueno, eso ya es otra cosa, no lo sabía. Pensaba que había sido una decisión más impulsiva, la verdad.", en: "Well, that's a different matter, I didn't know that. I thought it had been a more impulsive decision, honestly." },
      { speaker: "Tú", es: "No, qué va, para nada. Si hubiera sido impulsiva, no habría dejado el trabajo hasta no tener al menos dos clientes ya comprometidos, que es justo lo que hice.", en: "No, not at all. If it had been impulsive, I wouldn't have left the job until having at least two clients already committed, which is exactly what I did." },
      { speaker: "Fernando", es: "¿Y qué pasa si dentro de un año esto no ha despegado como esperabas? ¿Tienes un plan B, o sería volver a buscar trabajo fijo directamente?", en: "And what happens if in a year this hasn't taken off like you expected? Do you have a plan B, or would it be going straight back to looking for a permanent job?" },
      { speaker: "Tú", es: "Tengo un plan B, sí: si en un año no llego a un mínimo de ingresos que me he marcado, volvería al mundo laboral por cuenta ajena sin ningún drama, pero al menos lo habré intentado con todas las de la ley.", en: "I do have a plan B, yes: if in a year I don't reach a minimum income I've set for myself, I would go back to working for someone else with no drama at all, but at least I'll have tried it properly, giving it my all." },
      { speaker: "Fernando", es: "Bueno, visto así, reconozco que lo tienes bastante más pensado de lo que yo creía. Aun así, no te voy a engañar, me sigue preocupando un poco el tema económico.", en: "Well, seen that way, I admit you've thought it through quite a bit more than I believed. Even so, I won't lie to you, the financial side still worries me a little." },
      { speaker: "Tú", es: "Lo entiendo, y te agradezco que te preocupes, de verdad. Pero también creo que, si no lo intento ahora, con treinta años y sin hijos todavía, no sé cuándo lo voy a intentar.", en: "I understand, and I appreciate that you worry, really. But I also think that, if I don't try it now, at thirty and without kids yet, I don't know when I will try it." },
      { speaker: "Fernando", es: "Ahí tienes razón, la verdad. Bueno, pues nada, espero de corazón que te vaya muy bien, y ya sabes que, si necesitas algo, aquí estamos.", en: "You're right there, honestly. Well then, I really hope it goes very well for you, and you know that if you need anything, we're here." }
    ],
    vocabulary: [
      { es: "el trabajo fijo", en: "the permanent job", note: "contrasts with temporal/autónomo work" },
      { es: "hacer números", en: "to crunch numbers", note: "idiomatic for financial planning" },
      { es: "un colchón (financiero)", en: "a financial cushion/buffer", note: "figurative use of colchón, also seen in dialogue 1" },
      { es: "despegar", en: "to take off (figuratively, for a business/project)", note: "aviation metaphor used for growth/success" },
      { es: "con todas las de la ley", en: "properly / doing it right, giving it full effort", note: "fixed idiomatic expression" },
      { es: "trabajar por cuenta ajena", en: "to work for someone else (as employee)", note: "contrasts with 'por cuenta propia' (self-employed)" },
      { es: "no te lo voy a negar", en: "I won't deny it", note: "concession phrase in argument/debate" },
      { es: "de corazón", en: "sincerely / from the heart", note: "intensifier for wishes/hopes" }
    ],
    grammarNotes: [
      { point: "Si hubiera sido... no habría dejado — past hypothetical (pluperfect subjunctive + conditional perfect)", explanation: "'Si hubiera sido impulsiva, no habría dejado el trabajo' is a full contrary-to-fact past conditional, essential Advanced-Low structure for defending a past decision." },
      { point: "Si + present + conditional for future hypothetical plan", explanation: "'Si en un año no llego..., volvería' mixes present indicative (real future condition) with conditional (hypothetical result) — note this differs from the pure past-hypothetical structure above." },
      { point: "Aun así as a concessive connector", explanation: "'Aun así, no te voy a engañar, me sigue preocupando' — aun así (even so) pivots after conceding a point, similar in function to no obstante but more conversational." },
      { point: "Llevar + gerund for ongoing past feeling", explanation: "'Llevaba dos años sintiendo que no crecía' — llevar + time + gerund in imperfect describes a feeling that had been ongoing before the decision was made." }
    ],
    comprehensionQuestions: [
      { q: "¿Qué decisión de su sobrina cuestiona Fernando?", type: "short-answer", answer: "Dejar un trabajo fijo para montar su propio negocio." },
      { q: "¿Cuánto tiempo llevaba la protagonista sintiendo que no crecía en su trabajo anterior?", type: "mc", options: ["Seis meses", "Un año", "Dos años"], answer: "Dos años" },
      { q: "¿Qué hizo la protagonista antes de dejar su trabajo, para no actuar impulsivamente?", type: "short-answer", answer: "Hizo números, habló con clientes potenciales, ahorró un colchón, y consiguió dos clientes comprometidos." },
      { q: "¿Cuál es el plan B de la protagonista si el negocio no funciona en un año?", type: "mc", options: ["Pedir dinero a la familia", "Volver a trabajar por cuenta ajena", "Cerrar el negocio y no volver a intentarlo nunca"], answer: "Volver a trabajar por cuenta ajena" },
      { q: "¿Cómo termina Fernando la conversación?", type: "short-answer", answer: "Reconociendo que lo tiene bien pensado y deseándole de corazón que le vaya bien." }
    ],
    speakingTasks: [
      "Roleplay defending a bold personal or professional decision against a skeptical family member, addressing their concerns one by one.",
      "Practice a past contrary-to-fact structure: 'si hubiera sido..., no habría...' to defend a decision as well-planned rather than impulsive.",
      "Prepare a short monologue defending an opinion under polite pushback, conceding at least one valid point from the other side using aun así."
    ],
    dictationText: "Si hubiera sido impulsiva, no habría dejado el trabajo hasta no tener al menos dos clientes ya comprometidos.",
    culturalNotes: {
      context: "Extended sobremesa conversations (lingering at the table after a meal) are a core part of Spanish family and social life, and it's very common for these conversations to turn into genuine, sustained debates about life choices, politics, or values.",
      nativeBehaviour: "Family members in Spain, especially older relatives, often feel entitled to comment directly on major life decisions (leaving a job, moving cities, relationships) — this directness is generally understood as care/concern rather than overstepping, though it can feel intrusive to outsiders.",
      register: "Warm familiar tuteo throughout, with tío/tía used as both the literal relationship term and a natural address form — the emotional stakes are high but the register stays respectful and affectionate even during disagreement.",
      keyExpressions: ["no te lo tomes a mal", "no te lo voy a negar", "con todas las de la ley", "de corazón"],
      warnings: ["Don't mistake direct questioning of a life decision ('¿por qué has dejado...?') for hostility — in Spanish family culture this is often a normal, expected form of showing interest and concern.", "Avoid overly defensive or clipped answers — providing detailed reasoning (as the niece does) is what actually earns respect and shifts the older relative's position, rather than shutting down the conversation."],
      regionalNotes: "The rise of autónomos (self-employed workers) and entrepreneurship in Spain has made this exact intergenerational conversation increasingly common, as younger Spaniards weigh job security against the flexibility and risk of self-employment amid a historically job-security-oriented culture.",
      practicalAdvice: "When defending a major decision to a skeptical relative in Spain, presenting concrete evidence of planning (numbers, savings, a backup plan) tends to be far more persuasive than appeals to passion or happiness alone.",
      nativeSpeakerNotes: "Fernando's shift from skepticism to 'visto así, reconozco que lo tienes bastante más pensado de lo que yo creía' models a graceful concession — acknowledging new information changed his view, a valued rhetorical move in Spanish family debate."
    },
    commonMistakes: [
      "Using present subjunctive instead of imperfect/pluperfect subjunctive in past hypothetical si clauses ('si sea impulsiva' is wrong; must be 'si hubiera sido impulsiva').",
      "Mixing conditional tenses incorrectly, e.g. using conditional perfect where simple conditional is needed for a still-open future hypothetical ('si no llego..., habría vuelto' is inconsistent; should be 'volvería').",
      "Translating 'permanent job' too literally as 'trabajo permanente' instead of the standard Spanish term 'trabajo fijo'.",
      "Responding defensively to a relative's direct question instead of engaging with reasoned detail — in Spanish family debate culture, detailed justification is expected and effective, not seen as over-explaining."
    ],
    advancedLowExtension: "Defend, in an extended exchange, a real or invented major personal decision you made against someone who initially disagrees with it. Address at least two of their concerns with concrete reasoning, concede one valid point using aun así, and use a full past-hypothetical si clause (si hubiera hecho X, no habría pasado Y) to show the decision was carefully considered, not impulsive."
  },
  {
    id: "dlg_chal_anecdota_viaje",
    title: "Contando una anécdota de viaje",
    englishTitle: "Telling a travel anecdote",
    level: "B2",
    category: "challenge",
    topic: "storytelling-anecdote",
    scenario: "Dos amigas, Nuria y Cova, toman algo en una terraza en Granada, y Nuria le cuenta a Cova una anécdota de cuando se perdió haciendo senderismo en los Pirineos el verano pasado.",
    lines: [
      { speaker: "Cova", es: "Oye, cuéntame, que me dijeron que el verano pasado os pasó algo bastante fuerte en los Pirineos, ¿no?", en: "Hey, tell me, I heard something pretty crazy happened to you guys in the Pyrenees last summer, right?" },
      { speaker: "Nuria", es: "Uy, madre mía, sí. Fue una locura. Estábamos haciendo una ruta de senderismo de esas que se supone que duran unas cinco horas, íbamos mi hermano y yo solos, sin guía ni nada.", en: "Oh, gosh, yes. It was crazy. We were doing one of those hiking routes that's supposed to take about five hours, it was just my brother and me, no guide or anything." },
      { speaker: "Cova", es: "Vale, y ¿qué pasó? Porque por el tono ya me imagino que no salió como esperabais.", en: "Okay, and what happened? Because from your tone I already imagine it didn't go as you expected." },
      { speaker: "Nuria", es: "Pues resulta que, hacia la mitad de la ruta, empezó a llover fuerte de repente, algo que no estaba nada previsto según el pronóstico. Y claro, con la niebla que se levantó, perdimos de vista el sendero.", en: "Well, it turns out that, halfway through the route, it suddenly started raining hard, something that wasn't at all forecast. And of course, with the fog that came up, we lost sight of the trail." },
      { speaker: "Cova", es: "Qué fuerte. ¿Y qué hicisteis? Porque imagino que el pánico entra rápido en esas situaciones.", en: "How intense. And what did you do? Because I imagine panic sets in fast in those situations." },
      { speaker: "Nuria", es: "Mi hermano, que es más tranquilo que yo, dijo que lo mejor era quedarnos quietos un rato en lugar de seguir caminando a ciegas, porque si nos movíamos sin ver bien, podíamos acabar aún más perdidos.", en: "My brother, who's calmer than me, said the best thing was to stay still for a while instead of continuing to walk blindly, because if we moved without seeing well, we could end up even more lost." },
      { speaker: "Cova", es: "Tiene sentido, la verdad. ¿Y cuánto tiempo estuvisteis así, parados?", en: "That makes sense, honestly. And how long were you like that, stopped?" },
      { speaker: "Nuria", es: "Pues estaríamos como cuarenta minutos, que se hicieron eternos, la verdad. Yo ya estaba empezando a pensar que íbamos a tener que pasar la noche allí.", en: "It was probably about forty minutes, which honestly felt eternal. I was already starting to think we were going to have to spend the night there." },
      { speaker: "Cova", es: "Uf, qué angustia. ¿Y al final cómo conseguisteis salir?", en: "Ugh, how distressing. And how did you finally manage to get out?" },
      { speaker: "Nuria", es: "En cuanto la niebla se despejó un poco, mi hermano reconoció una roca enorme que habíamos visto al principio de la ruta, así que supimos más o menos por dónde volver. Aun así, tardamos casi dos horas más de lo previsto en llegar al coche.", en: "As soon as the fog cleared a bit, my brother recognized a huge rock we'd seen at the start of the route, so we roughly knew which way to go back. Even so, we took almost two hours more than planned to get to the car." },
      { speaker: "Cova", es: "Menos mal que estabais los dos juntos, porque sola no sé yo si habría sido tan fácil mantener la calma.", en: "Thank goodness you were both together, because alone I don't know if it would have been so easy to keep calm." },
      { speaker: "Nuria", es: "Totalmente, si hubiera ido sola, creo que me habría puesto muchísimo más nerviosa. Desde entonces, eso sí, no salgo a hacer una ruta larga sin llevar mapa descargado y una batería externa, por si las moscas.", en: "Totally, if I had gone alone, I think I would have gotten much more nervous. Since then, though, I don't go out on a long route without a downloaded map and a portable charger, just in case." },
      { speaker: "Cova", es: "Normal, yo habría hecho lo mismo. Bueno, menos mal que al final se quedó solo en una anécdota y no en algo peor.", en: "Makes sense, I would have done the same. Well, thank goodness it ended up just being an anecdote and not something worse." },
      { speaker: "Nuria", es: "Ya te digo. Ahora nos reímos, pero en el momento pasamos bastante miedo, la verdad. Fue una lección de las que no se olvidan.", en: "You're telling me. Now we laugh about it, but in the moment we were quite scared, honestly. It was one of those lessons you don't forget." }
    ],
    vocabulary: [
      { es: "la ruta de senderismo", en: "the hiking route/trail", note: "outdoor-activity vocabulary" },
      { es: "perder de vista (algo)", en: "to lose sight of (something)", note: "figurative and literal use" },
      { es: "caminar a ciegas", en: "to walk blindly", note: "idiomatic, common in danger/uncertainty narratives" },
      { es: "hacerse eterno/a", en: "to feel/become endless", note: "figurative expression for perceived time" },
      { es: "despejarse (la niebla)", en: "to clear (the fog)", note: "weather vocabulary, also used for 'clearing one's head'" },
      { es: "por si las moscas", en: "just in case (colloquial)", note: "colorful colloquial synonym of 'por si acaso'" },
      { es: "pasar miedo", en: "to be scared / go through fear", note: "common experiential expression" },
      { es: "una lección que no se olvida", en: "a lesson you don't forget", note: "reflective closing expression" }
    ],
    grammarNotes: [
      { point: "Preterite and imperfect working together in narrative", explanation: "Imperfect sets the scene ('estábamos haciendo', 'no estaba previsto') while preterite advances the plot ('empezó a llover', 'perdimos de vista') — the core Advanced-Low storytelling skill." },
      { point: "Conditional of estimation for approximate past duration", explanation: "'Estaríamos como cuarenta minutos' uses conditional to estimate an approximate elapsed time in the past, paralleling the same structure seen in the lost-passport dialogue." },
      { point: "Full past-hypothetical si clause for reflection", explanation: "'Si hubiera ido sola, creo que me habría puesto muchísimo más nerviosa' — pluperfect subjunctive + conditional perfect used to reflect on an alternate past scenario, a hallmark advanced structure." },
      { point: "En cuanto + preterite for a completed sequential trigger", explanation: "'En cuanto la niebla se despejó, mi hermano reconoció...' — en cuanto with preterite (not subjunctive) because it narrates a completed past sequence, contrasting with en cuanto + subjunctive for future events seen elsewhere in this set." }
    ],
    comprehensionQuestions: [
      { q: "¿Dónde y con quién estaba haciendo senderismo Nuria?", type: "short-answer", answer: "En los Pirineos, con su hermano." },
      { q: "¿Qué provocó que se perdieran?", type: "mc", options: ["Se quedaron sin batería en el móvil", "Empezó a llover fuerte y se levantó niebla, perdiendo el sendero", "Se durmieron en el camino"], answer: "Empezó a llover fuerte y se levantó niebla, perdiendo el sendero" },
      { q: "¿Qué decidió hacer su hermano en ese momento?", type: "short-answer", answer: "Quedarse quietos un rato en vez de seguir caminando a ciegas." },
      { q: "¿Cómo lograron encontrar el camino de vuelta?", type: "mc", options: ["Llamaron a un guía", "Reconocieron una roca de al principio de la ruta cuando se despejó la niebla", "Los encontró un helicóptero"], answer: "Reconocieron una roca de al principio de la ruta cuando se despejó la niebla" },
      { q: "¿Qué hace Nuria diferente ahora después de esta experiencia?", type: "short-answer", answer: "No sale a hacer rutas largas sin mapa descargado y batería externa." }
    ],
    speakingTasks: [
      "Narrate a personal travel or outdoor mishap anecdote to a partner, combining preterite for events and imperfect for background/feelings.",
      "Practice using a full past-hypothetical (si hubiera..., habría...) to reflect on how an experience could have gone differently.",
      "Retell Nuria's story from her brother's point of view, using the same past-tense storytelling techniques."
    ],
    dictationText: "Si hubiera ido sola, creo que me habría puesto muchísimo más nerviosa. Fue una lección de las que no se olvidan.",
    culturalNotes: {
      context: "Sharing personal anecdotes at length over drinks or coffee (contar batallitas) is a core part of Spanish social bonding, and listeners actively participate with reactive interjections rather than staying silent.",
      nativeBehaviour: "Note how Cova constantly reacts throughout ('qué fuerte', 'uf, qué angustia', 'menos mal') — active listener engagement with short exclamations is expected and encourages the storyteller to continue, unlike more passive listening norms in some other cultures.",
      register: "Very informal, friend-to-friend register full of natural discourse markers (pues, la verdad, ya te digo, aun así) — this is authentic peer storytelling Spanish, ideal for modeling natural narrative flow.",
      keyExpressions: ["qué fuerte", "menos mal", "por si las moscas", "ya te digo"],
      warnings: ["Don't neglect the imperfect for scene-setting when narrating — a story told entirely in preterite loses the descriptive backdrop and sounds like a flat list of events rather than a natural anecdote.", "'Por si las moscas' is a colorful colloquialism (literally 'in case of the flies') — don't overanalyze it literally, it simply means 'just in case', interchangeable with por si acaso in casual speech."],
      regionalNotes: "Hiking (senderismo) in mountain ranges like the Pirineos is a hugely popular Spanish summer activity, and stories of sudden weather changes and getting lost are common enough that this anecdote reflects a very real, relatable risk of unguided mountain routes in Spain.",
      practicalAdvice: "Real hiking safety advice embedded in this anecdote — downloading offline maps and carrying a portable charger — reflects genuine, commonly given advice among Spanish senderismo enthusiasts.",
      nativeSpeakerNotes: "Nuria's closing reflection, 'ahora nos reímos, pero en el momento pasamos bastante miedo', is a classic anecdote-closing structure in Spanish: contrasting the present retelling (now, we laugh) with the past emotional reality (then, we were scared) — a good model for structuring your own stories."
    },
    commonMistakes: [
      "Using only preterite throughout a story, flattening it into a list of actions instead of using imperfect for background description and emotional context.",
      "Getting the preterite/imperfect split backward — using imperfect for the main plot-advancing actions (e.g. 'llovía fuerte' as if it were ongoing background instead of 'empezó a llover' as the triggering event).",
      "Avoiding the past-hypothetical si + pluperfect subjunctive + conditional perfect structure and instead using simpler, less nuanced language to express 'what would have happened if...'.",
      "Translating 'just in case' inconsistently — both por si acaso and the more colloquial por si las moscas are correct and interchangeable, but learners often only know one."
    ],
    advancedLowExtension: "Narrate, at length, a personal anecdote about a time something unexpected happened to you while traveling or doing an outdoor activity: set the scene with imperfect, narrate the key events with preterite, describe how you felt throughout, and close with a reflection using a full past-hypothetical si clause (si hubiera..., habría...) about how it could have gone differently."
  }
];
