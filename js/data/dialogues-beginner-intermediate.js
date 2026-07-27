export const DIALOGUES_BEGINNER_INTERMEDIATE = [
  {
    id: "dlg_greetings_introductions",
    title: "Encantado de conocerte",
    englishTitle: "Nice to meet you",
    level: "A0",
    category: "beginner",
    topic: "greetings-introductions",
    scenario: "You're at a friend's house party in Madrid and someone you don't know starts chatting with you by the drinks table.",
    lines: [
      { speaker: "Marta", es: "¡Hola! Soy Marta. ¿Y tú?", en: "Hi! I'm Marta. And you?" },
      { speaker: "Tú", es: "Hola, encantado. Me llamo Sam.", en: "Hi, nice to meet you. My name is Sam." },
      { speaker: "Marta", es: "Encantada, Sam. ¿De dónde eres?", en: "Nice to meet you, Sam. Where are you from?" },
      { speaker: "Tú", es: "Soy de Inglaterra, pero vivo aquí en Madrid.", en: "I'm from England, but I live here in Madrid." },
      { speaker: "Marta", es: "¡Qué bien! ¿Y a qué te dedicas?", en: "That's great! And what do you do for work?" },
      { speaker: "Tú", es: "Soy profesor de inglés. ¿Y tú, Marta?", en: "I'm an English teacher. And you, Marta?" },
      { speaker: "Marta", es: "Yo trabajo en una tienda de ropa, aquí cerca.", en: "I work in a clothing store, near here." },
      { speaker: "Tú", es: "Ah, vale. Oye, ¿cuántos años llevas viviendo en Madrid?", en: "Ah, okay. Hey, how many years have you been living in Madrid?" },
      { speaker: "Marta", es: "Toda la vida, soy de aquí. ¿Y tú, cuánto tiempo llevas?", en: "My whole life, I'm from here. And you, how long have you been here?" },
      { speaker: "Tú", es: "Solo dos meses. Todavía estoy aprendiendo español.", en: "Only two months. I'm still learning Spanish." },
      { speaker: "Marta", es: "¡Pues hablas muy bien! No te preocupes.", en: "Well you speak very well! Don't worry." },
      { speaker: "Tú", es: "Gracias, eres muy amable. Bueno, un placer conocerte.", en: "Thanks, you're very kind. Well, a pleasure to meet you." },
      { speaker: "Marta", es: "Igualmente. ¡Nos vemos por ahí!", en: "Likewise. See you around!" }
    ],
    vocabulary: [
      { es: "encantado/a", en: "nice to meet you (pleased, delighted)", note: "agrees in gender with the speaker, not the listener" },
      { es: "¿a qué te dedicas?", en: "what do you do (for work)?", note: "more natural than ¿cuál es tu trabajo?" },
      { es: "llevar + gerundio", en: "to have been doing something for a period of time", note: "llevo dos meses viviendo aquí = I've been living here for two months" },
      { es: "igualmente", en: "likewise / same to you", note: "common polite reply" },
      { es: "un placer", en: "a pleasure", note: "shortened from 'es un placer'" },
      { es: "de aquí", en: "from here / local", note: "soy de aquí = I'm a local" },
      { es: "todavía", en: "still / yet", note: "todavía estoy aprendiendo = I'm still learning" },
      { es: "por ahí", en: "around (somewhere)", note: "nos vemos por ahí = see you around" }
    ],
    grammarNotes: [
      { point: "Ser vs vivir for origin vs residence", explanation: "Soy de Inglaterra (origin, permanent identity) vs vivo en Madrid (current residence) — Spanish separates these clearly, unlike casual English which can blur them." },
      { point: "llevar + gerund for duration", explanation: "To say how long you've been doing something ongoing, Spanish uses llevar + time + gerund: 'llevo dos meses aprendiendo español', not a literal translation of 'I have been learning'." },
      { point: "Adjective agreement in fixed greetings", explanation: "'Encantado' becomes 'encantada' if the speaker is female — it agrees with the person saying it, a common point of confusion for beginners." }
    ],
    comprehensionQuestions: [
      { q: "¿De dónde es Sam?", type: "mc", options: ["De España", "De Inglaterra", "De Francia"], answer: "De Inglaterra" },
      { q: "¿A qué se dedica Marta?", type: "mc", options: ["Es profesora", "Trabaja en una tienda de ropa", "Es camarera"], answer: "Trabaja en una tienda de ropa" },
      { q: "¿Cuánto tiempo lleva Sam en Madrid?", type: "short-answer", answer: "Dos meses" },
      { q: "¿Es Marta de Madrid?", type: "mc", options: ["Sí, es de aquí", "No, es de Inglaterra", "No se sabe"], answer: "Sí, es de aquí" },
      { q: "¿Qué le dice Marta a Sam sobre su español?", type: "short-answer", answer: "Que habla muy bien y que no se preocupe" }
    ],
    speakingTasks: [
      "Roleplay meeting a stranger at a party: introduce yourself, ask their name, origin, and job.",
      "Practice the llevar + gerundio structure by saying how long you've lived in your city or studied Spanish.",
      "Record yourself saying goodbye in three different informal ways."
    ],
    dictationText: "Hola, encantado. Me llamo Sam. Soy de Inglaterra, pero vivo aquí en Madrid.",
    culturalNotes: {
      context: "First meetings in Spain at informal social gatherings are warm and direct — people ask personal questions (job, origin) much sooner than is typical in the UK or US, without it being considered rude.",
      nativeBehaviour: "Spaniards typically greet new acquaintances at informal parties with two kisses on the cheek (dos besos) between people of any gender mix except two men, who usually shake hands or do a casual hand-clasp/hug depending on context.",
      register: "Informal (tú) is standard at a house party among people of similar age; use of tú from the very first exchange is normal and not overly familiar.",
      keyExpressions: ["encantado/a", "¿a qué te dedicas?", "¿de dónde eres?", "igualmente"],
      warnings: ["Don't default to usted at an informal party — it can sound distant or overly formal among peers.", "'Actualmente' does not mean 'actually' (it means 'currently') — a classic false friend to avoid here."],
      regionalNotes: "In Madrid and most of central/southern Spain dos besos is standard; in some professional contexts a handshake is preferred, but at a casual house party the kiss greeting is the default.",
      practicalAdvice: "If unsure whether to kiss or shake hands, follow the other person's lead — they'll usually initiate the besos if that's expected.",
      nativeSpeakerNotes: "Natives often soften first questions with 'oye' (hey/listen) to sound more casual, e.g. 'Oye, ¿de dónde eres?' rather than asking bluntly."
    },
    commonMistakes: [
      "English speakers often say 'Soy encantado' literally, but the correct fixed form is just 'Encantado/a' with no 'soy'.",
      "Confusing 'llevar' with 'tener' when expressing duration — 'tengo dos meses viviendo aquí' is a Latin American calque; Peninsular Spanish prefers 'llevo dos meses viviendo aquí'.",
      "Saying 'Yo soy trabajando' instead of 'trabajo' — English speakers sometimes overuse the progressive where Spanish uses simple present."
    ],
    advancedLowExtension: "Narrate, in the past tense, the story of how you met one of your closest friends: where you were, how the conversation started, what first impressions you had, and how the friendship developed over time."
  },
  {
    id: "dlg_meeting_people_party",
    title: "Conociendo gente en una fiesta",
    englishTitle: "Meeting people at a party",
    level: "A1",
    category: "beginner",
    topic: "meeting-people-party",
    scenario: "At a birthday party in Valencia, you strike up a conversation with a friend of the host about work and where people are from.",
    lines: [
      { speaker: "Diego", es: "¡Qué fiesta más buena! ¿Tú de qué conoces a Laura?", en: "What a great party! How do you know Laura?" },
      { speaker: "Tú", es: "Somos compañeros de trabajo. ¿Y tú?", en: "We're workmates. And you?" },
      { speaker: "Diego", es: "Somos vecinos, vivimos en el mismo edificio.", en: "We're neighbours, we live in the same building." },
      { speaker: "Tú", es: "Ah, qué bien. Oye, ¿tú a qué te dedicas?", en: "Ah, nice. Hey, what do you do for work?" },
      { speaker: "Diego", es: "Soy ingeniero, trabajo en una empresa de software. ¿Y tú?", en: "I'm an engineer, I work at a software company. And you?" },
      { speaker: "Tú", es: "Yo trabajo de comercial en una empresa de marketing.", en: "I work as a salesperson at a marketing company." },
      { speaker: "Diego", es: "Qué interesante. ¿Y de dónde eres? No pareces de aquí.", en: "How interesting. And where are you from? You don't seem to be from here." },
      { speaker: "Tú", es: "Qué va, no soy de Valencia, soy de Escocia. Pero llevo tres años en España.", en: "No way, I'm not from Valencia, I'm from Scotland. But I've been in Spain for three years." },
      { speaker: "Diego", es: "¡Anda! Pues se te nota poco el acento, la verdad.", en: "Wow! Well, you barely have an accent, honestly." },
      { speaker: "Tú", es: "Gracias, jaja. Bueno, ¿pedimos algo de beber?", en: "Thanks, haha. Well, shall we get something to drink?" },
      { speaker: "Diego", es: "Venga, vamos. Hay sangría y cerveza en la cocina.", en: "Sure, let's go. There's sangria and beer in the kitchen." }
    ],
    vocabulary: [
      { es: "¿de qué conoces a...?", en: "how do you know...?", note: "standard way to ask about a social connection" },
      { es: "compañero/a de trabajo", en: "workmate, colleague", note: "also 'colega' informally" },
      { es: "vecino/a", en: "neighbour", note: "-" },
      { es: "trabajar de + profession", en: "to work as a...", note: "trabajo de comercial = I work as a salesperson" },
      { es: "qué va", en: "no way / not at all", note: "filler expressing disagreement or denial, very common" },
      { es: "se te nota", en: "it shows / one can tell", note: "se te nota el acento = your accent shows" },
      { es: "venga", en: "come on / alright then", note: "extremely common discourse marker in Spain" },
      { es: "no pareces de aquí", en: "you don't seem to be from here", note: "parecer + adj/phrase" }
    ],
    grammarNotes: [
      { point: "Ser + profession without article", explanation: "Soy ingeniero / trabajo de comercial — Spanish drops the indefinite article before unmodified professions, unlike English 'I am an engineer'." },
      { point: "Present tense of vivir and llevar for ongoing states", explanation: "Llevo tres años en España expresses duration up to now, paired with the present tense, not a perfect tense as English speakers might expect." },
      { point: "Qué + adjective/noun exclamations", explanation: "¡Qué fiesta más buena! and ¡Qué interesante! are common exclamatory structures: qué + noun + más/tan + adjective." }
    ],
    comprehensionQuestions: [
      { q: "¿Cómo conoce Diego a Laura?", type: "mc", options: ["Son compañeros de trabajo", "Son vecinos", "Son primos"], answer: "Son vecinos" },
      { q: "¿A qué se dedica Diego?", type: "short-answer", answer: "Es ingeniero, trabaja en una empresa de software" },
      { q: "¿De dónde es 'tú' en el diálogo?", type: "mc", options: ["De Valencia", "De Escocia", "De Inglaterra"], answer: "De Escocia" },
      { q: "¿Cuánto tiempo lleva 'tú' en España?", type: "short-answer", answer: "Tres años" },
      { q: "¿Qué deciden hacer al final?", type: "mc", options: ["Bailar", "Irse a casa", "Ir a por algo de beber"], answer: "Ir a por algo de beber" }
    ],
    speakingTasks: [
      "Roleplay meeting a friend-of-a-friend at a party and explain your connection to the host.",
      "Practice answering 'a qué te dedicas' with three different fictional jobs.",
      "Use 'qué va' and 'venga' naturally in a short improvised exchange."
    ],
    dictationText: "Somos compañeros de trabajo. Llevo tres años en España, pero no soy de aquí.",
    culturalNotes: {
      context: "At Spanish house parties and gatherings, small talk quickly moves toward how you know the host and what you do — these are the standard icebreakers, more so than talking about the weather.",
      nativeBehaviour: "Spaniards often comment directly and warmly on someone's accent or appearance ('se te nota poco el acento', '¡qué alto eres!') — this is considered friendly, not intrusive.",
      register: "Informal tú throughout; 'jaja' in spoken register would just be a laugh, but shows how casual banter flows.",
      keyExpressions: ["qué va", "venga", "anda", "¿a qué te dedicas?"],
      warnings: ["'Actualmente' ≠ 'actually' — it means 'currently'; use 'de hecho' for 'actually'.", "Don't translate 'I work as' literally with 'como' — Spanish prefers 'trabajo de/en' for job roles."],
      regionalNotes: "In Valencia and other Mediterranean regions, party invitations and gatherings often center on shared drinks (sangría, tinto de verano) rather than spirits, especially in home settings.",
      practicalAdvice: "If someone asks who you know at a party, a short honest answer (compañero de trabajo, vecino, amigo de la universidad) is all that's expected — no need to over-explain.",
      nativeSpeakerNotes: "'Anda' is a flexible filler expressing mild surprise, similar to 'wow' or 'oh' — used constantly in casual conversation."
    },
    commonMistakes: [
      "Saying 'Yo trabajo como ingeniero' instead of the more natural 'Soy ingeniero' or 'Trabajo de ingeniero'.",
      "Translating 'I've been here for three years' as 'He estado aquí para tres años' instead of the correct 'Llevo tres años aquí'.",
      "Using 'actualmente' to mean 'actually' (false friend) — it means 'currently/nowadays' in Spanish."
    ],
    advancedLowExtension: "Describe, in detail, a memorable party or social gathering you attended: who you met, what you talked about, and what impression those new people made on you. Use a mix of past tenses to narrate the sequence of events."
  },
  {
    id: "dlg_coffee_breakfast_cafe",
    title: "Desayuno en el café",
    englishTitle: "Ordering coffee and breakfast at a café",
    level: "A0",
    category: "beginner",
    topic: "ordering-coffee-breakfast",
    scenario: "You walk into a busy café in Madrid at 9am and order breakfast standing at the counter (la barra).",
    lines: [
      { speaker: "Camarero", es: "¡Buenos días! ¿Qué te pongo?", en: "Good morning! What can I get you?" },
      { speaker: "Tú", es: "Buenos días. Un café con leche, por favor.", en: "Good morning. A coffee with milk, please." },
      { speaker: "Camarero", es: "Vale. ¿Algo más? ¿Para desayunar?", en: "Okay. Anything else? For breakfast?" },
      { speaker: "Tú", es: "Sí, ¿tenéis tostadas con tomate?", en: "Yes, do you have toast with tomato?" },
      { speaker: "Camarero", es: "Claro. ¿Con aceite también, o solo tomate?", en: "Of course. With oil too, or just tomato?" },
      { speaker: "Tú", es: "Con aceite y un poco de sal, por favor.", en: "With oil and a bit of salt, please." },
      { speaker: "Camarero", es: "Perfecto. ¿Vas a tomar aquí en la barra o te lo pongo para llevar?", en: "Perfect. Will you have it here at the bar or should I get it to go?" },
      { speaker: "Tú", es: "Aquí en la barra, gracias.", en: "Here at the bar, thanks." },
      { speaker: "Camarero", es: "Marchando. Son tres euros con veinte.", en: "Coming right up. That's three euros twenty." },
      { speaker: "Tú", es: "Aquí tienes. Quédate con el cambio.", en: "Here you go. Keep the change." },
      { speaker: "Camarero", es: "Muy amable, gracias. ¡Que aproveche!", en: "Very kind, thank you. Enjoy!" }
    ],
    vocabulary: [
      { es: "¿qué te pongo?", en: "what can I get you?", note: "idiomatic service-industry phrase, poner used for 'serve'" },
      { es: "la tostada", en: "toast", note: "tostada con tomate is a classic Spanish breakfast" },
      { es: "la barra", en: "the (bar) counter", note: "standing at the barra is cheaper and faster than sitting at a table" },
      { es: "para llevar", en: "to go / takeaway", note: "-" },
      { es: "marchando", en: "coming right up", note: "common bar/kitchen expression when an order is confirmed" },
      { es: "quédate con el cambio", en: "keep the change", note: "-" },
      { es: "que aproveche", en: "enjoy your meal", note: "said by staff or fellow diners, not just before eating at home" },
      { es: "el café con leche", en: "coffee with milk", note: "the default Spanish breakfast coffee" }
    ],
    grammarNotes: [
      { point: "Informal vosotros/tú mixing with strangers in service contexts", explanation: "Bar staff often use tú informally with customers ('¿qué te pongo?', '¿tenéis...?' when addressing a group) — service register in Spain is generally more informal than in the UK/US." },
      { point: "Ir a + infinitive for near future/intentions", explanation: "'¿Vas a tomar aquí...?' uses ir a + infinitive to ask about an immediate choice, a very common structure in everyday requests." },
      { point: "Direct object pronoun 'lo' referring back to food/order", explanation: "'Te lo pongo para llevar' — 'lo' replaces 'el café/la tostada' already mentioned, avoiding repetition." }
    ],
    comprehensionQuestions: [
      { q: "¿Qué bebida pide el cliente?", type: "mc", options: ["Un té", "Un café con leche", "Un zumo de naranja"], answer: "Un café con leche" },
      { q: "¿Qué pide para desayunar?", type: "short-answer", answer: "Tostadas con tomate, aceite y sal" },
      { q: "¿Dónde va a tomar el desayuno?", type: "mc", options: ["En la barra", "Para llevar", "En una mesa"], answer: "En la barra" },
      { q: "¿Cuánto cuesta el pedido?", type: "short-answer", answer: "Tres euros con veinte" },
      { q: "¿Qué le dice el cliente al camarero con la propina?", type: "mc", options: ["Nada más", "Quédate con el cambio", "No hace falta"], answer: "Quédate con el cambio" }
    ],
    speakingTasks: [
      "Roleplay ordering your own breakfast combo out loud at the barra.",
      "Practice asking for variations of tostada (con aceite, con mermelada, con jamón y queso).",
      "Order a coffee for takeaway (para llevar) instead of at the barra."
    ],
    dictationText: "Un café con leche, por favor. ¿Tenéis tostadas con tomate? Con aceite y un poco de sal.",
    culturalNotes: {
      context: "Spanish café culture revolves around quick, standing breakfasts at the barra before work — sitting at a table often costs more (precio de terraza/mesa) and is used for longer, relaxed visits.",
      nativeBehaviour: "Ordering directly and briefly is normal and not rude — long 'please/thank you' chains like in English aren't required; a simple 'por favor' at the end of the order is enough.",
      register: "Casual tú-based register is standard between customers and bar staff, even with strangers — very different from more formal UK/US service norms.",
      keyExpressions: ["¿qué te pongo?", "para llevar", "marchando", "que aproveche"],
      warnings: ["Tipping isn't obligatory in Spain — leaving small change (not a large percentage) is a courtesy, not an expectation; don't over-tip American-style.", "'Actualmente' still doesn't mean 'actually' — irrelevant here, but a reminder false friends appear everywhere."],
      regionalNotes: "Tostada con tomate is the iconic breakfast especially in Madrid and central Spain; in Cataluña you might hear 'pa amb tomàquet' as the local variant.",
      practicalAdvice: "If you sit at a table (mesa) or outside (terraza), expect a small price increase and table service instead of ordering at the counter.",
      nativeSpeakerNotes: "'Marchando' is used by bar/kitchen staff constantly — it signals your order has been received and is being prepared, similar to 'coming right up'."
    },
    commonMistakes: [
      "Over-tipping heavily as if in the US — in Spain, rounding up or leaving small coins is enough; large tips can seem odd.",
      "Saying 'Yo quiero' bluntly without softening — while understood, 'Un café con leche, por favor' or 'Ponme un café' sounds more natural and polite in this context.",
      "Translating 'to go' literally as 'para ir' instead of the correct fixed expression 'para llevar'."
    ],
    advancedLowExtension: "Narrate a typical morning routine you had while living or traveling in Spain, describing in detail what you would order at your local café and how the staff and regulars interacted, using present habitual tense (soler + infinitive) and past tense for a specific memorable morning."
  },
  {
    id: "dlg_grocery_shopping_market",
    title: "Comprando en el mercado",
    englishTitle: "Grocery shopping at a Spanish supermarket/market",
    level: "A1",
    category: "beginner",
    topic: "grocery-shopping",
    scenario: "You're at a neighborhood market (mercado de abastos) in Sevilla buying fruit, vegetables, and a few other items for the week.",
    lines: [
      { speaker: "Frutera", es: "¡Buenas! ¿Qué le pongo?", en: "Hi there! What can I get you?" },
      { speaker: "Tú", es: "Hola, quería un kilo de tomates, por favor.", en: "Hi, I'd like a kilo of tomatoes, please." },
      { speaker: "Frutera", es: "Marchando. ¿Algo más? Las naranjas están buenísimas hoy.", en: "Coming up. Anything else? The oranges are great today." },
      { speaker: "Tú", es: "Vale, póngame también dos kilos de naranjas.", en: "Okay, give me two kilos of oranges too." },
      { speaker: "Frutera", es: "Perfecto. ¿Y de verdura, qué necesitas?", en: "Perfect. And for vegetables, what do you need?" },
      { speaker: "Tú", es: "Un par de pimientos y una lechuga, por favor.", en: "A couple of peppers and a lettuce, please." },
      { speaker: "Frutera", es: "Aquí tienes. ¿Algo de fruta más, unas fresas quizás?", en: "Here you go. Any more fruit, maybe some strawberries?" },
      { speaker: "Tú", es: "No, con esto me vale. ¿Cuánto es todo?", en: "No, this is all I need. How much is it all?" },
      { speaker: "Frutera", es: "Son nueve euros con cuarenta.", en: "That's nine euros forty." },
      { speaker: "Tú", es: "Aquí tienes diez euros.", en: "Here's ten euros." },
      { speaker: "Frutera", es: "Toma tu cambio. ¡Que tengas un buen día!", en: "Here's your change. Have a good day!" },
      { speaker: "Tú", es: "Gracias, igualmente. ¡Hasta luego!", en: "Thanks, likewise. See you later!" }
    ],
    vocabulary: [
      { es: "quería (+ noun)", en: "I would like (softened, polite request)", note: "imperfect used for politeness, very common in shops" },
      { es: "póngame", en: "give me / put for me", note: "imperative + indirect object pronoun, standard shop request" },
      { es: "un par de", en: "a couple of / a few", note: "not literally always two" },
      { es: "la lechuga", en: "lettuce", note: "-" },
      { es: "con esto me vale", en: "this is enough for me", note: "valer used idiomatically to mean 'to suffice'" },
      { es: "¿cuánto es (todo)?", en: "how much is it (in total)?", note: "-" },
      { es: "el cambio", en: "the change (money)", note: "-" },
      { es: "buenísimas", en: "really good (superlative of buenas)", note: "-ísimo/a is the intensifying suffix, common in spoken Spanish" }
    ],
    grammarNotes: [
      { point: "Imperfect tense for polite requests (quería)", explanation: "'Quería un kilo de tomates' softens the request compared to 'quiero' — a very common politeness strategy in Spanish shops and restaurants." },
      { point: "Imperative + indirect object pronoun (póngame)", explanation: "Formal usted commands attach pronouns to the end: pon + -ga (usted form) + -me = póngame, meaning 'put/give me'." },
      { point: "Superlative with -ísimo/a", explanation: "Buenísimas intensifies 'buenas' beyond 'muy buenas' — a very productive suffix in everyday spoken Spanish." }
    ],
    comprehensionQuestions: [
      { q: "¿Cuántos kilos de tomates compra el cliente?", type: "short-answer", answer: "Un kilo" },
      { q: "¿Qué fruta recomienda la frutera al principio?", type: "mc", options: ["Las manzanas", "Las naranjas", "Las fresas"], answer: "Las naranjas" },
      { q: "¿Qué verduras compra el cliente?", type: "short-answer", answer: "Pimientos y una lechuga" },
      { q: "¿Cuánto cuesta todo?", type: "mc", options: ["Nueve euros con cuarenta", "Diez euros", "Ocho euros con cuarenta"], answer: "Nueve euros con cuarenta" },
      { q: "¿Compra el cliente fresas al final?", type: "mc", options: ["Sí", "No", "No se menciona"], answer: "No" }
    ],
    speakingTasks: [
      "Roleplay buying a full week's worth of fruit and vegetables at a market stall using 'quería' and 'póngame'.",
      "Practice numbers and prices out loud by role-playing paying and receiving change.",
      "List five common Spain-specific market items using their correct articles (el/la)."
    ],
    dictationText: "Quería un kilo de tomates, por favor. Póngame también dos kilos de naranjas.",
    culturalNotes: {
      context: "Traditional mercados de abastos are common across Spanish cities and offer fresh produce from specialized stalls (fruterías, carnicerías, pescaderías) rather than one big supermarket aisle.",
      nativeBehaviour: "Shoppers often chat briefly with vendors, who frequently recommend what's fresh that day — this small talk is a normal, expected part of the transaction, not an imposition.",
      register: "Usted is common with older market vendors as a sign of respect, though many stallholders use tú informally with regular customers — register can shift based on familiarity.",
      keyExpressions: ["quería...", "póngame...", "¿algo más?", "con esto me vale"],
      warnings: ["Don't say 'Yo quiero' too bluntly in a market — 'quería' or 'me pone...' sounds far more natural and polite.", "'Vegetales' is understood but Spaniards more commonly say 'verdura' for everyday vegetables in speech."],
      regionalNotes: "In Andalucía, greetings often start with '¡Buenas!' instead of the full 'Buenos días/buenas tardes', especially in informal market settings.",
      practicalAdvice: "Bring small bills/coins — many small market stalls prefer cash and may not always take cards for small purchases.",
      nativeSpeakerNotes: "Vendors often round prices or offer a small 'yapa' (a little extra) as a friendly gesture to regular customers, especially in southern Spain."
    },
    commonMistakes: [
      "Saying 'Yo quiero' too directly instead of the softer, more idiomatic 'Quería...' when ordering — sounds abrupt to native ears.",
      "Using 'vegetales' instead of the far more common everyday word 'verdura' when shopping in Spain.",
      "Forgetting the personal 'a' isn't needed here but overusing formal 'usted' forms awkwardly mixed with informal vocabulary."
    ],
    advancedLowExtension: "Describe in detail your ideal weekly grocery shopping routine if you lived in Spain: which markets or shops you'd visit, what you'd typically buy, and how it would differ from grocery shopping in your home country. Use comparatives (más...que, menos...que) to contrast the two systems."
  },
  {
    id: "dlg_directions_city",
    title: "Pidiendo direcciones en la ciudad",
    englishTitle: "Asking for and giving directions in a city",
    level: "A1",
    category: "beginner",
    topic: "directions",
    scenario: "You're lost near Plaza Mayor in Madrid and stop a passerby to ask how to get to the nearest metro station.",
    lines: [
      { speaker: "Tú", es: "Perdona, ¿sabes dónde está la estación de metro más cercana?", en: "Excuse me, do you know where the nearest metro station is?" },
      { speaker: "Señora", es: "Sí, claro. Sigue todo recto por esta calle hasta el semáforo.", en: "Yes, of course. Go straight on this street until the traffic light." },
      { speaker: "Tú", es: "Vale, todo recto hasta el semáforo. ¿Y luego?", en: "Okay, straight until the traffic light. And then?" },
      { speaker: "Señora", es: "Luego giras a la derecha y verás una plaza pequeña.", en: "Then you turn right and you'll see a small square." },
      { speaker: "Tú", es: "¿La estación está en la plaza?", en: "Is the station in the square?" },
      { speaker: "Señora", es: "No, está justo enfrente, al lado de una farmacia.", en: "No, it's right across from it, next to a pharmacy." },
      { speaker: "Tú", es: "Perfecto. ¿Está muy lejos de aquí?", en: "Perfect. Is it very far from here?" },
      { speaker: "Señora", es: "Qué va, está a cinco minutos andando.", en: "No way, it's five minutes on foot." },
      { speaker: "Tú", es: "Genial, muchísimas gracias por tu ayuda.", en: "Great, thank you so much for your help." },
      { speaker: "Señora", es: "De nada, hombre. ¡Que tengas suerte!", en: "You're welcome, no problem. Good luck!" }
    ],
    vocabulary: [
      { es: "todo recto", en: "straight ahead", note: "-" },
      { es: "girar a la derecha/izquierda", en: "to turn right/left", note: "-" },
      { es: "el semáforo", en: "traffic light", note: "-" },
      { es: "enfrente de", en: "across from / opposite", note: "-" },
      { es: "al lado de", en: "next to", note: "-" },
      { es: "andando", en: "on foot / walking", note: "ir andando = to go on foot" },
      { es: "la más cercana", en: "the nearest (one)", note: "cercano/a agrees with the noun it modifies" },
      { es: "hombre", en: "filler expressing familiarity/reassurance", note: "used regardless of the listener's gender, e.g. 'de nada, hombre'" }
    ],
    grammarNotes: [
      { point: "Informal tú commands for giving directions", explanation: "Sigue, gira, verás — the second-person tú imperative/future forms are standard when giving directions informally to a stranger of similar age." },
      { point: "Estar for location", explanation: "'¿Dónde está la estación?' uses estar (not ser) because location is always expressed with estar in Spanish, regardless of whether it's temporary or permanent." },
      { point: "Simple future for predictions during directions", explanation: "'Verás una plaza pequeña' uses the future tense naturally to predict what the listener will see, common in spoken direction-giving." }
    ],
    comprehensionQuestions: [
      { q: "¿Qué busca 'tú' en el diálogo?", type: "mc", options: ["Una farmacia", "La estación de metro más cercana", "Un restaurante"], answer: "La estación de metro más cercana" },
      { q: "¿Qué debe hacer primero?", type: "short-answer", answer: "Seguir todo recto hasta el semáforo" },
      { q: "¿Dónde está la estación exactamente?", type: "mc", options: ["En la plaza", "Enfrente de la plaza, al lado de una farmacia", "Lejos, hay que coger un taxi"], answer: "Enfrente de la plaza, al lado de una farmacia" },
      { q: "¿Está lejos la estación?", type: "mc", options: ["Sí, muy lejos", "No, a cinco minutos andando", "No se sabe"], answer: "No, a cinco minutos andando" },
      { q: "¿Cómo termina la señora la conversación?", type: "short-answer", answer: "Deseándole suerte" }
    ],
    speakingTasks: [
      "Roleplay asking a stranger for directions to three different places (farmacia, museo, parada de autobús).",
      "Practice giving directions from your current location to the nearest supermarket, using tú commands.",
      "Describe a route using at least four direction expressions (todo recto, a la derecha, enfrente de, al lado de)."
    ],
    dictationText: "Perdona, ¿sabes dónde está la estación de metro más cercana? Sigue todo recto hasta el semáforo.",
    culturalNotes: {
      context: "Asking strangers for directions on the street is very normal in Spain and people are generally happy to stop and help, often giving more detail than strictly necessary.",
      nativeBehaviour: "Spaniards frequently use landmarks (farmacia, plaza, iglesia) rather than exact addresses when giving directions, since street numbering is less relied upon in casual speech.",
      register: "'Perdona' (informal) or 'perdone' (formal usted) is the standard polite way to interrupt a stranger; tone stays friendly and unhurried.",
      keyExpressions: ["perdona/perdone", "¿sabes dónde está...?", "todo recto", "qué va, está a cinco minutos"],
      warnings: ["Don't use 'excúseme' — that's not natural Spanish; use 'perdona/perdone' or 'oiga/oye' to get someone's attention.", "'Lejos' and 'cerca' are relative — Spaniards often underestimate walking distances compared to car-centric cultures."],
      regionalNotes: "In dense city centers like Madrid's Plaza Mayor area, walking distances given by locals ('cinco minutos andando') are often quite accurate since most locals walk everywhere.",
      practicalAdvice: "If directions are unclear, it's completely acceptable to ask someone to repeat: '¿Puedes repetirlo, por favor?' — locals expect this from tourists and language learners.",
      nativeSpeakerNotes: "'Hombre' as a filler (de nada, hombre) doesn't literally mean 'man' here — it's a gender-neutral, all-purpose exclamation of familiarity used constantly in casual speech."
    },
    commonMistakes: [
      "Using 'excúseme' (a false anglicism) instead of the natural 'perdona/perdone' to get someone's attention.",
      "Confusing 'derecha' (right) with 'derecho' (straight/law) — 'todo recto' or 'todo derecho' means straight, but 'a la derecha' means to the right.",
      "Translating 'next to' literally as 'próximo a' when 'al lado de' is far more natural and common in everyday speech."
    ],
    advancedLowExtension: "Narrate a time you got lost in an unfamiliar city (in Spain or elsewhere): describe where you were trying to go, how you asked for help, what directions you received, and how the situation was eventually resolved, using a mix of preterite and imperfect tenses."
  },
  {
    id: "dlg_public_transportation_ticket",
    title: "Comprando un billete de metro",
    englishTitle: "Taking public transportation and buying a ticket",
    level: "A1",
    category: "beginner",
    topic: "public-transportation",
    scenario: "You're at a metro station ticket machine in Madrid trying to buy a ticket and aren't sure which one to get.",
    lines: [
      { speaker: "Tú", es: "Perdona, ¿me puedes ayudar con la máquina? No sé qué billete coger.", en: "Excuse me, can you help me with the machine? I don't know which ticket to get." },
      { speaker: "Chico", es: "Claro, ¿a dónde vas?", en: "Sure, where are you going?" },
      { speaker: "Tú", es: "Voy a Sol, pero luego quiero coger el autobús también.", en: "I'm going to Sol, but then I want to take the bus too." },
      { speaker: "Chico", es: "Ah, pues te conviene sacar un abono de diez viajes, sirve para metro y bus.", en: "Ah, well it's better for you to get a ten-trip pass, it works for metro and bus." },
      { speaker: "Tú", es: "Vale. ¿Y cómo lo compro aquí en la máquina?", en: "Okay. And how do I buy it here at the machine?" },
      { speaker: "Chico", es: "Mira, pulsas 'billete sencillo o abono', eliges 'diez viajes' y pagas con tarjeta o efectivo.", en: "Look, you press 'single ticket or pass', choose 'ten trips' and pay by card or cash." },
      { speaker: "Tú", es: "Perfecto, ya lo veo. ¿Cuánto cuesta?", en: "Perfect, I see it now. How much does it cost?" },
      { speaker: "Chico", es: "Creo que son unos doce euros y pico.", en: "I think it's about twelve euros and change." },
      { speaker: "Tú", es: "Genial. ¿Y luego tengo que picar el billete al entrar?", en: "Great. And then do I have to tap the ticket when I go in?" },
      { speaker: "Chico", es: "Sí, lo pasas por el torno y ya está.", en: "Yes, you swipe it through the turnstile and that's it." },
      { speaker: "Tú", es: "Muchas gracias, me has salvado.", en: "Thank you so much, you saved me." },
      { speaker: "Chico", es: "No pasa nada, ¡buen viaje!", en: "No problem, have a good trip!" }
    ],
    vocabulary: [
      { es: "el billete", en: "ticket", note: "billete sencillo = single ticket" },
      { es: "el abono", en: "travel pass", note: "abono de diez viajes = ten-trip pass" },
      { es: "coger", en: "to take/catch (transport)", note: "Peninsular Spain usage; not used this way in much of Latin America" },
      { es: "picar el billete", en: "to tap/punch the ticket", note: "colloquial for validating a ticket" },
      { es: "el torno", en: "turnstile", note: "-" },
      { es: "euros y pico", en: "euros and change / a bit more", note: "colloquial for 'a little over X euros'" },
      { es: "te conviene", en: "it suits/benefits you (to)", note: "convenir used impersonally with indirect object pronoun" },
      { es: "no pasa nada", en: "no problem / it's fine", note: "very common reassurance filler" }
    ],
    grammarNotes: [
      { point: "Coger for 'to take' transport", explanation: "In Peninsular Spain, 'coger' is the standard neutral verb for taking a bus/train/metro; in much of Latin America it has a vulgar connotation and 'tomar' is used instead." },
      { point: "Impersonal convenir + indirect object pronoun", explanation: "'Te conviene sacar un abono' — convenir works like gustar, with an indirect object pronoun agreeing with the person it benefits." },
      { point: "Tener que + infinitive for obligation", explanation: "'Tengo que picar el billete' expresses necessity/obligation, a core beginner structure reinforced here in a practical context." }
    ],
    comprehensionQuestions: [
      { q: "¿A dónde quiere ir 'tú' primero?", type: "short-answer", answer: "A Sol" },
      { q: "¿Qué le recomienda el chico comprar?", type: "mc", options: ["Un billete sencillo", "Un abono de diez viajes", "Un abono mensual"], answer: "Un abono de diez viajes" },
      { q: "¿Para qué sirve el abono de diez viajes?", type: "mc", options: ["Solo para el metro", "Solo para el bus", "Para metro y bus"], answer: "Para metro y bus" },
      { q: "¿Cuánto cuesta aproximadamente?", type: "short-answer", answer: "Unos doce euros y pico" },
      { q: "¿Qué hay que hacer al entrar en el metro?", type: "mc", options: ["Enseñar el DNI", "Picar el billete en el torno", "Pagar al conductor"], answer: "Picar el billete en el torno" }
    ],
    speakingTasks: [
      "Roleplay asking a stranger for help at a ticket machine, explaining your destination and transport needs.",
      "Practice describing the steps to buy a ten-trip pass out loud, step by step.",
      "Ask someone how to get from the metro to the bus using an integrated ticket."
    ],
    dictationText: "No sé qué billete coger. Te conviene sacar un abono de diez viajes, sirve para metro y bus.",
    culturalNotes: {
      context: "Madrid's metro and bus system uses an integrated multi-trip pass system (abono de diez viajes or Tarjeta Multi) that's more economical than single tickets for regular use.",
      nativeBehaviour: "It's completely normal to ask a stranger at a ticket machine for help — Spaniards are generally happy to explain the system, especially to visibly confused tourists.",
      register: "Informal tú is default between strangers of similar age in this everyday context; older or more formal interactions might shift to usted.",
      keyExpressions: ["¿me puedes ayudar?", "coger el bus/metro", "picar el billete", "no pasa nada"],
      warnings: ["'Coger' is completely neutral and common in Spain, but should be avoided in much of Latin America where it has a vulgar slang meaning — an important dialect note for learners.", "Don't confuse 'billete' (ticket for transport) with 'boleto' (used more in Latin America) or 'nota' (banknote, different word)."],
      regionalNotes: "Madrid's transport card system (Tarjeta Multi/abono) differs from Barcelona's T-casual or other cities' systems — always check local terminology when traveling within Spain.",
      practicalAdvice: "Ticket machines in most Spanish metro stations offer an English-language option, but asking a local for quick help is often faster and a good way to practice.",
      nativeSpeakerNotes: "'Euros y pico' is a very colloquial way of giving an approximate price — useful to recognize even if you don't produce it yourself yet."
    },
    commonMistakes: [
      "Avoiding 'coger' out of fear it's rude — in Peninsular Spain it's completely standard and neutral; only avoid it in Latin American contexts.",
      "Saying 'tomar el metro' as the default — while understood, 'coger el metro' is far more natural and frequent in Spain.",
      "Forgetting to validate (picar) the ticket and assuming just having it is enough to travel legally."
    ],
    advancedLowExtension: "Narrate a public transportation experience you had (in Spain or another country) that didn't go as planned — a missed connection, a confusing ticket machine, or getting on the wrong bus/train. Describe the sequence of events and how you resolved it, using preterite and imperfect appropriately."
  },
  {
    id: "dlg_renting_piso",
    title: "Preguntando por un piso en alquiler",
    englishTitle: "Renting a piso (calling about a flat listing)",
    level: "A2",
    category: "intermediate",
    topic: "renting-apartment",
    scenario: "You call a landlord in Barcelona about a flat (piso) you saw listed online, asking about the deposit, bills, and viewing times.",
    lines: [
      { speaker: "Tú", es: "Hola, buenas tardes, llamo por el piso que habéis anunciado en el portal.", en: "Hello, good afternoon, I'm calling about the flat you advertised on the listing site." },
      { speaker: "Casero", es: "Ah, sí, el de dos habitaciones cerca de Gràcia. Dime.", en: "Ah, yes, the two-bedroom one near Gràcia. Tell me." },
      { speaker: "Tú", es: "Quería preguntar, ¿cuánto es la fianza?", en: "I wanted to ask, how much is the deposit?" },
      { speaker: "Casero", es: "Son dos meses de fianza, más el primer mes por adelantado.", en: "It's two months' deposit, plus the first month in advance." },
      { speaker: "Tú", es: "Entendido. ¿Y los gastos de comunidad y luz están incluidos en el precio?", en: "Understood. And are the community fees and electricity included in the price?" },
      { speaker: "Casero", es: "La comunidad sí está incluida, pero la luz y el agua las paga el inquilino aparte.", en: "The community fees are included, but electricity and water are paid separately by the tenant." },
      { speaker: "Tú", es: "Vale, tiene sentido. ¿El piso viene amueblado?", en: "Okay, that makes sense. Does the flat come furnished?" },
      { speaker: "Casero", es: "Sí, tiene cama, armario, sofá y electrodomésticos en la cocina.", en: "Yes, it has a bed, wardrobe, sofa, and appliances in the kitchen." },
      { speaker: "Tú", es: "Perfecto. ¿Podría verlo esta semana?", en: "Perfect. Could I see it this week?" },
      { speaker: "Casero", es: "Claro, ¿te viene bien el jueves por la tarde?", en: "Of course, does Thursday afternoon work for you?" },
      { speaker: "Tú", es: "Sí, perfecto. ¿A qué hora quedamos?", en: "Yes, perfect. What time should we meet?" },
      { speaker: "Casero", es: "A las seis, delante del portal. Te mando la dirección exacta por WhatsApp.", en: "At six, in front of the building entrance. I'll send you the exact address by WhatsApp." },
      { speaker: "Tú", es: "Estupendo, muchas gracias. Nos vemos el jueves.", en: "Great, thank you so much. See you Thursday." }
    ],
    vocabulary: [
      { es: "el piso", en: "the flat/apartment", note: "Peninsular Spanish term; 'apartamento' is used but less common for a full family flat" },
      { es: "la fianza", en: "the (security) deposit", note: "typically one to two months' rent" },
      { es: "por adelantado", en: "in advance", note: "-" },
      { es: "los gastos de comunidad", en: "community/building fees", note: "covers shared building maintenance" },
      { es: "el inquilino / la inquilina", en: "the tenant", note: "-" },
      { es: "amueblado/a", en: "furnished", note: "-" },
      { es: "el casero / la casera", en: "the landlord/landlady", note: "colloquial; 'arrendador' is the formal/legal term" },
      { es: "¿te viene bien...?", en: "does ... work for you?", note: "venir bien used idiomatically for convenience/scheduling" }
    ],
    grammarNotes: [
      { point: "Conditional for polite requests (podría)", explanation: "'¿Podría verlo esta semana?' uses the conditional of poder to soften the request — more polite than 'puedo verlo'." },
      { point: "Direct object pronouns replacing previously mentioned items", explanation: "'La luz y el agua las paga el inquilino' — 'las' anticipates/refers back to 'la luz y el agua' (feminine plural), a common structure when topicalizing the object." },
      { point: "Vosotros forms in business/informal register", explanation: "'Llamo por el piso que habéis anunciado' uses vosotros (habéis) because the caller is addressing the landlord(s)/agency informally as a group, typical Peninsular usage." }
    ],
    comprehensionQuestions: [
      { q: "¿Cuánto es la fianza del piso?", type: "short-answer", answer: "Dos meses, más el primer mes por adelantado" },
      { q: "¿Qué gastos están incluidos en el precio?", type: "mc", options: ["Luz y agua", "La comunidad", "Todo incluido"], answer: "La comunidad" },
      { q: "¿Quién paga la luz y el agua?", type: "short-answer", answer: "El inquilino, aparte" },
      { q: "¿Viene amueblado el piso?", type: "mc", options: ["No, está vacío", "Sí, con cama, armario, sofá y electrodomésticos", "Solo con cocina"], answer: "Sí, con cama, armario, sofá y electrodomésticos" },
      { q: "¿Cuándo quedan para ver el piso?", type: "mc", options: ["El jueves a las seis", "El viernes a las ocho", "El sábado por la mañana"], answer: "El jueves a las seis" }
    ],
    speakingTasks: [
      "Roleplay calling about a flat listing and asking about fianza, gastos, and whether it's furnished.",
      "Practice negotiating a viewing time using '¿te viene bien...?'.",
      "Summarize, in your own words, all the conditions mentioned in the call (deposit, bills, furniture, viewing)."
    ],
    dictationText: "Llamo por el piso que habéis anunciado. ¿Cuánto es la fianza? ¿Los gastos de comunidad están incluidos?",
    culturalNotes: {
      context: "Renting a piso in Spain typically involves a fianza (legal deposit, often regulated at one month by law but commonly two months requested informally), plus separate utility payments — navigating this by phone before viewing is standard practice.",
      nativeBehaviour: "Landlords (caseros) often prefer a quick phone call over lengthy written correspondence to gauge a tenant's seriousness and Spanish level before agreeing to a viewing.",
      register: "A mix of usted-avoidance and polite conditional forms (podría, ¿te viene bien?) is typical — fully informal tú, but softened with polite constructions since money and legal terms are being discussed.",
      keyExpressions: ["la fianza", "gastos de comunidad", "¿te viene bien...?", "por adelantado"],
      warnings: ["Legally the fianza is capped at one month's rent by Spanish law (LAU), though landlords sometimes informally request an extra month as a separate guarantee — worth knowing this distinction exists.", "'Actualmente' still doesn't mean 'actually' — remains a common trap even in formal calls like this."],
      regionalNotes: "In Barcelona and Cataluña, some listings and conversations mix in Catalan words (like 'pis' for piso) — expect occasional code-switching in real estate contexts there.",
      practicalAdvice: "Always clarify in writing (WhatsApp/email) what was agreed by phone regarding fianza and gastos before signing anything, as verbal agreements alone aren't legally binding.",
      nativeSpeakerNotes: "'Portal' has two meanings here: the building entrance (portal) and an online listings site (portal inmobiliario) — context determines which is meant."
    },
    commonMistakes: [
      "Confusing 'fianza' (deposit) with 'multa' (fine) — false friend trap for English speakers thinking of 'fine' vs 'fee'.",
      "Translating 'landlord' literally as 'señor de la tierra' instead of the correct 'casero/a' or formal 'arrendador/a'.",
      "Using 'apartamento' by default when 'piso' is the far more natural and common term in Peninsular Spain for a residential flat."
    ],
    advancedLowExtension: "Narrate the process of searching for and eventually renting (or trying to rent) a flat, whether in Spain or elsewhere: describe the listings you considered, the questions you asked, any problems that came up with the landlord or contract, and how the situation was resolved. Use a range of past tenses and conditional forms."
  },
  {
    id: "dlg_going_to_doctor",
    title: "En la consulta del médico",
    englishTitle: "Going to the doctor (describing symptoms)",
    level: "A2",
    category: "intermediate",
    topic: "doctor-symptoms",
    scenario: "You've booked an appointment with your GP (médico de cabecera) through the Spanish public health system (Seguridad Social) because you've been feeling unwell for a few days.",
    lines: [
      { speaker: "Médica", es: "Buenos días, siéntate. Cuéntame, ¿qué te pasa?", en: "Good morning, have a seat. Tell me, what's wrong?" },
      { speaker: "Tú", es: "Buenos días, doctora. Llevo tres días con dolor de garganta y fiebre.", en: "Good morning, doctor. I've had a sore throat and fever for three days." },
      { speaker: "Médica", es: "¿Cuánta fiebre tienes, más o menos?", en: "How much of a fever do you have, roughly?" },
      { speaker: "Tú", es: "Ayer por la noche llegué a treinta y ocho y medio.", en: "Last night I got to thirty-eight and a half." },
      { speaker: "Médica", es: "Vale. ¿Te duele algo más, la cabeza, el cuerpo?", en: "Okay. Does anything else hurt, your head, your body?" },
      { speaker: "Tú", es: "Sí, me duele bastante la cabeza y estoy muy cansado.", en: "Yes, my head hurts quite a bit and I'm very tired." },
      { speaker: "Médica", es: "Voy a mirarte la garganta. Abre la boca, por favor.", en: "I'm going to look at your throat. Open your mouth, please." },
      { speaker: "Tú", es: "Vale.", en: "Okay." },
      { speaker: "Médica", es: "Tienes la garganta bastante irritada. Parece una faringitis vírica.", en: "Your throat is quite irritated. It looks like viral pharyngitis." },
      { speaker: "Tú", es: "¿Necesito antibióticos?", en: "Do I need antibiotics?" },
      { speaker: "Médica", es: "No, al ser vírica no hacen falta. Te mando algo para bajar la fiebre y reposo.", en: "No, since it's viral you don't need them. I'll prescribe something to bring down the fever and rest." },
      { speaker: "Tú", es: "Vale, gracias. ¿Y la receta la recojo en la farmacia?", en: "Okay, thanks. And do I pick up the prescription at the pharmacy?" },
      { speaker: "Médica", es: "Sí, ya la tienes en tu cartilla, solo enseña el DNI en la farmacia.", en: "Yes, it's already in your record, just show your ID at the pharmacy." }
    ],
    vocabulary: [
      { es: "el dolor de garganta", en: "sore throat", note: "-" },
      { es: "la fiebre", en: "fever", note: "tener fiebre = to have a fever" },
      { es: "doler (o>ue)", en: "to hurt", note: "works like gustar: me duele la cabeza" },
      { es: "la faringitis vírica", en: "viral pharyngitis", note: "-" },
      { es: "hacer falta", en: "to be needed/necessary", note: "no hacen falta antibióticos = antibiotics aren't needed" },
      { es: "el reposo", en: "rest", note: "guardar reposo = to rest/stay in bed" },
      { es: "la receta", en: "prescription", note: "also means 'recipe' in other contexts" },
      { es: "la cartilla / tarjeta sanitaria", en: "health record / health card", note: "linked to the Seguridad Social system" }
    ],
    grammarNotes: [
      { point: "Doler like gustar", explanation: "'Me duele la cabeza' follows the same structure as gustar: indirect object pronoun + duele/duelen + subject (the body part), not 'yo duelo'." },
      { point: "Llevar + time + gerund for symptom duration", explanation: "'Llevo tres días con dolor de garganta' — this structure, seen earlier for general duration, is essential vocabulary for describing how long you've been sick." },
      { point: "Ir a + infinitive for imminent doctor actions", explanation: "'Voy a mirarte la garganta' signals an immediate next action, common in medical consultations." }
    ],
    comprehensionQuestions: [
      { q: "¿Cuántos días lleva el paciente con síntomas?", type: "short-answer", answer: "Tres días" },
      { q: "¿Qué síntomas tiene el paciente?", type: "mc", options: ["Solo fiebre", "Dolor de garganta, fiebre, dolor de cabeza y cansancio", "Solo dolor de cabeza"], answer: "Dolor de garganta, fiebre, dolor de cabeza y cansancio" },
      { q: "¿Qué diagnostica la médica?", type: "short-answer", answer: "Faringitis vírica" },
      { q: "¿Necesita antibióticos el paciente?", type: "mc", options: ["Sí", "No, porque es vírica", "No se sabe todavía"], answer: "No, porque es vírica" },
      { q: "¿Dónde recoge la receta el paciente?", type: "mc", options: ["En el hospital", "En la farmacia", "En el ambulatorio"], answer: "En la farmacia" }
    ],
    speakingTasks: [
      "Roleplay a doctor's appointment describing at least three different symptoms using doler and tener.",
      "Practice explaining symptom duration using llevar + time + gerund.",
      "Explain, in Spanish, the difference between needing antibiotics and needing rest for a viral illness."
    ],
    dictationText: "Llevo tres días con dolor de garganta y fiebre. Me duele bastante la cabeza y estoy muy cansado.",
    culturalNotes: {
      context: "Spain's public healthcare system (Seguridad Social) provides free or low-cost consultations with an assigned médico de cabecera (GP), typically booked through a health center (centro de salud) rather than walk-in visits.",
      nativeBehaviour: "Doctors in the public system often see patients quickly and efficiently, with visits typically shorter than in private healthcare — a matter-of-fact, brisk style is normal, not a sign of poor care.",
      register: "Tú is common between doctor and patient regardless of age, especially in public health centers, reflecting a generally informal Spanish medical culture compared to more formal doctor-patient registers in other countries.",
      keyExpressions: ["¿qué te pasa?", "me duele...", "llevo X días con...", "hacer falta"],
      warnings: ["Don't confuse 'receta' (prescription) with 'recibo' (receipt) — a common false-friend-adjacent mix-up.", "'Constipado' means 'having a cold', NOT 'constipated' (that's 'estreñido') — a classic false friend that causes major confusion."],
      regionalNotes: "Public healthcare (Seguridad Social) coexists with private insurance (seguro privado/médico privado) in Spain; many residents have both and choose depending on wait times and specialty needs.",
      practicalAdvice: "Prescriptions from the public system are usually linked electronically to your tarjeta sanitaria (health card) or cartilla, so you often just need to show ID at the pharmacy rather than carry a paper prescription.",
      nativeSpeakerNotes: "'Ambulatorio' and 'centro de salud' are often used interchangeably in everyday speech to refer to the local public health clinic."
    },
    commonMistakes: [
      "Saying 'estoy constipado' to mean physically constipated — in Spanish it means 'I have a cold'; use 'estoy estreñido/a' for constipation.",
      "Translating 'I have a headache' as 'tengo un dolor de cabeza' when the far more natural structure is 'me duele la cabeza'.",
      "Confusing 'receta' (prescription/recipe) with 'recibo' (receipt) in a pharmacy or medical context."
    ],
    advancedLowExtension: "Narrate a time you or someone you know got sick while traveling or living abroad: describe the symptoms, how you sought medical help, what the doctor said, and how the treatment went. Compare, if relevant, how the healthcare experience differed from your home country."
  },
  {
    id: "dlg_banking_account",
    title: "Abriendo una cuenta en el banco",
    englishTitle: "Banking (opening an account / asking about fees)",
    level: "B1",
    category: "intermediate",
    topic: "banking",
    scenario: "You go to a bank branch in Sevilla to open a checking account and ask about maintenance fees and requirements.",
    lines: [
      { speaker: "Empleado", es: "Buenos días, ¿en qué puedo ayudarle?", en: "Good morning, how can I help you?" },
      { speaker: "Tú", es: "Buenos días, quería abrir una cuenta corriente, si es posible.", en: "Good morning, I'd like to open a checking account, if possible." },
      { speaker: "Empleado", es: "Claro. ¿Es usted residente en España?", en: "Of course. Are you a resident in Spain?" },
      { speaker: "Tú", es: "Sí, tengo el NIE y un contrato de trabajo aquí.", en: "Yes, I have my NIE and a work contract here." },
      { speaker: "Empleado", es: "Perfecto, entonces necesitará el NIE, el pasaporte y un justificante de domicilio.", en: "Perfect, then you'll need your NIE, passport, and proof of address." },
      { speaker: "Tú", es: "Vale, los tengo todos aquí. Una pregunta, ¿la cuenta tiene comisiones de mantenimiento?", en: "Okay, I have them all here. One question, does the account have maintenance fees?" },
      { speaker: "Empleado", es: "Depende. Si domicilia la nómina con nosotros, no paga comisiones.", en: "It depends. If you set up direct deposit of your salary with us, you don't pay fees." },
      { speaker: "Tú", es: "Entiendo. ¿Y si no domicilio la nómina?", en: "I understand. And if I don't set up direct deposit?" },
      { speaker: "Empleado", es: "En ese caso son unos doce euros al mes de comisión.", en: "In that case it's about twelve euros a month in fees." },
      { speaker: "Tú", es: "Ya veo. ¿La tarjeta de débito también tiene coste?", en: "I see. Does the debit card also have a cost?" },
      { speaker: "Empleado", es: "No, la tarjeta de débito es gratuita si domicilia la nómina.", en: "No, the debit card is free if you set up direct deposit." },
      { speaker: "Tú", es: "Vale, me interesa. Voy a domiciliar mi nómina entonces.", en: "Okay, I'm interested. I'll set up my salary direct deposit then." },
      { speaker: "Empleado", es: "Estupendo. Rellene este formulario y en diez minutos lo tenemos listo.", en: "Great. Fill out this form and in ten minutes we'll have it ready." }
    ],
    vocabulary: [
      { es: "la cuenta corriente", en: "checking/current account", note: "-" },
      { es: "el NIE", en: "foreigner ID number (Número de Identidad de Extranjero)", note: "required for most financial/legal processes as a foreign resident" },
      { es: "el justificante de domicilio", en: "proof of address", note: "-" },
      { es: "la comisión (de mantenimiento)", en: "(maintenance) fee", note: "-" },
      { es: "domiciliar la nómina", en: "to set up direct deposit of your salary", note: "banks often waive fees in exchange for this" },
      { es: "la tarjeta de débito", en: "debit card", note: "-" },
      { es: "gratuito/a", en: "free (of charge)", note: "-" },
      { es: "rellenar un formulario", en: "to fill out a form", note: "-" }
    ],
    grammarNotes: [
      { point: "Usted forms in formal service settings", explanation: "The bank employee uses usted throughout (¿en qué puedo ayudarle?, rellene, domicilia) since banking is a formal context, contrasting with the informal tú used in cafés or markets." },
      { point: "Si + present indicative for real conditional", explanation: "'Si domicilia la nómina, no paga comisiones' uses the real/likely conditional structure (si + present, + present) to describe a general rule with a real possibility." },
      { point: "Formal usted commands", explanation: "'Rellene este formulario' is the usted imperative form of rellenar, appropriate for formal service interactions like this one." }
    ],
    comprehensionQuestions: [
      { q: "¿Qué tipo de cuenta quiere abrir el cliente?", type: "short-answer", answer: "Una cuenta corriente" },
      { q: "¿Qué documentos necesita para abrir la cuenta?", type: "mc", options: ["Solo el pasaporte", "NIE, pasaporte y justificante de domicilio", "Solo el NIE"], answer: "NIE, pasaporte y justificante de domicilio" },
      { q: "¿Cómo se evitan las comisiones de mantenimiento?", type: "short-answer", answer: "Domiciliando la nómina" },
      { q: "¿Cuánto cuesta la comisión si no domicilia la nómina?", type: "mc", options: ["Cinco euros al mes", "Doce euros al mes", "Veinte euros al mes"], answer: "Doce euros al mes" },
      { q: "¿Decide el cliente domiciliar su nómina?", type: "mc", options: ["Sí", "No", "No lo decide todavía"], answer: "Sí" }
    ],
    speakingTasks: [
      "Roleplay opening a bank account and asking about at least three different types of fees.",
      "Practice using formal usted register throughout an entire mock conversation with a bank employee.",
      "Explain, in Spanish, the pros and cons of domiciliar la nómina with a particular bank."
    ],
    dictationText: "Quería abrir una cuenta corriente. ¿La cuenta tiene comisiones de mantenimiento?",
    culturalNotes: {
      context: "Opening a bank account as a foreign resident in Spain requires an NIE (foreigner identification number) and proof of residence — a process often tied to bureaucratic steps like registering with the local town hall (empadronamiento).",
      nativeBehaviour: "Bank employees typically explain fee structures proactively, since most Spanish banks waive maintenance fees in exchange for direct deposit of salary (domiciliar la nómina) — a very common trade-off worth understanding.",
      register: "Fully formal usted throughout, as banking is one of the contexts in Spain where usted remains the norm regardless of the customer's age, unlike cafés or casual shops.",
      keyExpressions: ["cuenta corriente", "domiciliar la nómina", "comisión de mantenimiento", "justificante de domicilio"],
      warnings: ["Don't confuse 'comisión' (fee/commission) with 'comisaría' (police station) — unrelated but easy to mix up for beginners.", "'Actualmente' remains a false friend meaning 'currently', not 'actually' — relevant if discussing current account terms."],
      regionalNotes: "Bureaucratic requirements (NIE, empadronamiento, proof of address) are consistent nationwide but processing times and required paperwork can vary noticeably between autonomous communities and even individual bank branches.",
      practicalAdvice: "It's worth comparing multiple banks before choosing, since fee waivers, minimum salary requirements for nómina domiciliation, and English-language support vary significantly between Spanish banks.",
      nativeSpeakerNotes: "'Estupendo' is a very common, slightly more formal-but-warm way to say 'great/wonderful', frequently used by service staff to close a positive interaction."
    },
    commonMistakes: [
      "Using tú with a bank employee — this formal context calls for usted, unlike casual cafés or markets where tú is standard.",
      "Confusing 'comisión' (a bank fee) with the English 'commission' in a sales sense — while related, in banking it specifically means a service charge.",
      "Assuming all Spanish banks have identical fee structures — many condition fee waivers on domiciliar la nómina, a system that doesn't map directly onto English speakers' banking expectations."
    ],
    advancedLowExtension: "Explain, as if advising a friend who is about to move to Spain, the entire process of opening a bank account as a foreigner: what documents to prepare, what questions to ask about fees, and what trade-offs (like domiciliar la nómina) they should consider. Use subjunctive-adjacent recommendations like 'te recomiendo que...' where appropriate."
  },
  {
    id: "dlg_clothing_shopping",
    title: "Comprando ropa y probándosela",
    englishTitle: "Clothing shopping (asking for size/trying things on, returns)",
    level: "A2",
    category: "intermediate",
    topic: "clothing-shopping",
    scenario: "You're in a clothing store in Madrid looking for a jacket, need a different size, and later come back to make a return.",
    lines: [
      { speaker: "Dependienta", es: "Hola, buenas, ¿te puedo ayudar en algo?", en: "Hi there, can I help you with anything?" },
      { speaker: "Tú", es: "Hola, sí, busco una chaqueta como esta pero en talla M.", en: "Hi, yes, I'm looking for a jacket like this one but in size M." },
      { speaker: "Dependienta", es: "Deja que mire... sí, tenemos en la M. ¿Quieres probártela?", en: "Let me check... yes, we have it in M. Do you want to try it on?" },
      { speaker: "Tú", es: "Sí, por favor. ¿Dónde están los probadores?", en: "Yes, please. Where are the fitting rooms?" },
      { speaker: "Dependienta", es: "Al fondo a la derecha. Te la traigo enseguida.", en: "At the back on the right. I'll bring it to you right away." },
      { speaker: "Tú", es: "(después de probársela) Me queda un poco grande de hombros.", en: "(after trying it on) It's a bit big on the shoulders." },
      { speaker: "Dependienta", es: "¿Quieres que te traiga una talla S para comparar?", en: "Do you want me to bring you a size S to compare?" },
      { speaker: "Tú", es: "Sí, por favor, así comparo las dos.", en: "Yes, please, that way I compare both." },
      { speaker: "Dependienta", es: "(luego) ¿Qué tal la S? ¿Mejor?", en: "(later) How's the S? Better?" },
      { speaker: "Tú", es: "Sí, esta me queda genial. Me la llevo.", en: "Yes, this one fits great. I'll take it." },
      { speaker: "Dependienta", es: "Perfecto. Recuerda que tienes treinta días para cambios o devoluciones con el tique.", en: "Perfect. Remember you have thirty days for exchanges or returns with the receipt." },
      { speaker: "Tú", es: "Vale, genial. Por cierto, ¿aceptáis devoluciones sin el tique?", en: "Okay, great. By the way, do you accept returns without the receipt?" },
      { speaker: "Dependienta", es: "Solo como vale de compra, no como reembolso en efectivo.", en: "Only as store credit, not as a cash refund." }
    ],
    vocabulary: [
      { es: "la talla", en: "clothing size", note: "not 'tamaño', which is used for object size" },
      { es: "el probador", en: "fitting/changing room", note: "-" },
      { es: "probarse (algo)", en: "to try (something) on", note: "reflexive verb" },
      { es: "quedar (bien/grande/pequeño)", en: "to fit (well/big/small)", note: "works like gustar: me queda grande" },
      { es: "llevarse algo", en: "to take/buy something", note: "me la llevo = I'll take it" },
      { es: "el tique / ticket", en: "receipt", note: "-" },
      { es: "la devolución", en: "return", note: "-" },
      { es: "el vale de compra", en: "store credit voucher", note: "-" }
    ],
    grammarNotes: [
      { point: "Quedar like gustar for fit/appearance", explanation: "'Me queda grande' follows the gustar pattern: indirect object pronoun + quedar + adjective, describing how clothing fits the wearer." },
      { point: "Reflexive pronoun with direct object (llevarse + lo/la)", explanation: "'Me la llevo' combines the reflexive-like usage of llevarse with the direct object pronoun 'la' (referring to la chaqueta), a common contraction pattern in shopping contexts." },
      { point: "Present subjunctive after querer que", explanation: "'¿Quieres que te traiga una talla S?' requires the subjunctive (traiga) because querer que triggers subjunctive in the dependent clause, even in this everyday retail context." }
    ],
    comprehensionQuestions: [
      { q: "¿Qué busca el cliente al principio?", type: "short-answer", answer: "Una chaqueta en talla M" },
      { q: "¿Cómo le queda la talla M?", type: "mc", options: ["Perfecta", "Un poco grande de hombros", "Muy pequeña"], answer: "Un poco grande de hombros" },
      { q: "¿Qué talla decide comprar finalmente?", type: "mc", options: ["M", "S", "L"], answer: "S" },
      { q: "¿Cuántos días tiene para hacer cambios o devoluciones?", type: "short-answer", answer: "Treinta días" },
      { q: "¿Qué pasa si hace una devolución sin tique?", type: "mc", options: ["No se permite", "Le devuelven el dinero en efectivo", "Le dan un vale de compra"], answer: "Le dan un vale de compra" }
    ],
    speakingTasks: [
      "Roleplay trying on two different sizes of an item of clothing and explaining how each one fits using 'quedar'.",
      "Practice asking about a store's return and exchange policy.",
      "Describe your ideal outfit for a specific occasion using at least five clothing vocabulary items."
    ],
    dictationText: "Busco una chaqueta en talla M. Me queda un poco grande de hombros. ¿Aceptáis devoluciones sin el tique?",
    culturalNotes: {
      context: "Spanish clothing stores commonly use European sizing (XS/S/M/L or numeric sizes like 38, 40, 42), which differs from UK/US sizing systems and can confuse shoppers unfamiliar with the conversion.",
      nativeBehaviour: "Sales staff (dependientes/as) in Spain are typically attentive but not pushy — they'll offer help once and then let you browse, following up mainly when you head toward the fitting rooms or checkout.",
      register: "Informal tú is standard in most clothing retail interactions in Spain, even between a customer and staff who are strangers, reflecting the generally relaxed retail register.",
      keyExpressions: ["¿te puedo ayudar en algo?", "me queda grande/pequeño", "me la llevo", "vale de compra"],
      warnings: ["'Ropa' means clothing/clothes in general — don't confuse it with 'rope' (which is 'cuerda' in Spanish), a classic false friend.", "Spanish clothing sizes don't map 1:1 to UK/US sizes — always try before assuming your usual size."],
      regionalNotes: "Return policies vary by store chain rather than region in Spain, but the 30-day exchange/return window with a tique is a very common standard across major retailers nationwide.",
      practicalAdvice: "Always ask to keep the tique (receipt) for a set period after buying clothes, since returns without it are usually only honored as store credit, not cash back.",
      nativeSpeakerNotes: "'Por cierto' is a natural way to introduce an additional, slightly unrelated question mid-conversation, similar to 'by the way' in English."
    },
    commonMistakes: [
      "Confusing 'talla' (clothing size) with 'tamaño' (general size for objects) — Spanish distinguishes these where English just says 'size' for both.",
      "Saying 'ropa' when meaning 'rope' — a classic false friend; rope is 'cuerda' in Spanish.",
      "Translating 'it fits me well' too literally instead of using the natural gustar-like structure 'me queda bien'."
    ],
    advancedLowExtension: "Narrate a shopping experience where you had to exchange or return an item of clothing: describe what you originally bought, what went wrong (wrong size, defect, changed your mind), how the store handled it, and whether you were satisfied with the outcome. Use past tenses and connectors like 'aunque' and 'sin embargo'."
  },
  {
    id: "dlg_family_conversation_meal",
    title: "Comida familiar y charla",
    englishTitle: "Family conversation (catching up over a meal)",
    level: "A2",
    category: "intermediate",
    topic: "family-conversation",
    scenario: "You're at a big Sunday family lunch (comida de domingo) with your Spanish in-laws, catching up on news over the meal, and everyone is chatting using vosotros.",
    lines: [
      { speaker: "Abuela", es: "Bueno, ¿qué tal os va todo por Madrid? Contadme.", en: "Well, how's everything going for you in Madrid? Tell me." },
      { speaker: "Tú", es: "Pues muy bien, abuela. Estamos liados con el trabajo, pero contentos.", en: "Well, very well, grandma. We're swamped with work, but happy." },
      { speaker: "Tío Paco", es: "¿Y vosotros pensáis venir en agosto a la playa como siempre?", en: "And are you two planning to come to the beach in August like always?" },
      { speaker: "Tú", es: "Sí, ya hemos pedido las vacaciones. ¿Vais a estar vosotros también?", en: "Yes, we've already requested the vacation days. Are you all going to be there too?" },
      { speaker: "Tío Paco", es: "Claro, no nos lo perdemos. ¿Y qué tal lleváis lo del piso nuevo?", en: "Of course, we wouldn't miss it. And how's the new flat going?" },
      { speaker: "Tú", es: "Bien, aunque todavía nos falta pintar el salón y montar los muebles.", en: "Good, although we still need to paint the living room and put together the furniture." },
      { speaker: "Abuela", es: "Si necesitáis ayuda, decídmelo, que vuestro tío es un manitas.", en: "If you need help, let me know, because your uncle is very handy." },
      { speaker: "Tío Paco", es: "Eso, llamadme cuando queráis, os echo una mano el fin de semana que sea.", en: "That's right, call me whenever you want, I'll help out any weekend." },
      { speaker: "Tú", es: "Muchas gracias, de verdad. Os lo agradecemos mucho.", en: "Thank you so much, really. We really appreciate it." },
      { speaker: "Abuela", es: "Nada, nada, para eso está la familia. Venga, comed más, que hay de sobra.", en: "It's nothing, that's what family is for. Come on, eat more, there's plenty." },
      { speaker: "Tú", es: "Vale, vale, un poco más y ya paro, que voy a explotar.", en: "Okay, okay, a little more and then I'll stop, I'm going to explode." }
    ],
    vocabulary: [
      { es: "estar liado/a", en: "to be busy/swamped", note: "very common colloquial expression" },
      { es: "no perderse algo", en: "to not miss out on something", note: "no nos lo perdemos = we won't miss it" },
      { es: "montar los muebles", en: "to assemble the furniture", note: "-" },
      { es: "ser un manitas", en: "to be handy/good with DIY", note: "idiomatic, invariable in gender when used as a fixed phrase" },
      { es: "echar una mano", en: "to lend a hand", note: "-" },
      { es: "haber de sobra", en: "to have plenty/more than enough", note: "hay de sobra = there's plenty" },
      { es: "agradecer", en: "to be grateful for / to thank for", note: "os lo agradecemos = we thank you for it" },
      { es: "para eso está la familia", en: "that's what family is for", note: "fixed warm expression" }
    ],
    grammarNotes: [
      { point: "Vosotros forms throughout informal family address", explanation: "Contadme, pensáis, vais, necesitáis, llamadme — the whole exchange uses vosotros because the speaker addresses multiple family members informally, the hallmark of Peninsular Spanish plural informal address." },
      { point: "Vosotros affirmative commands", explanation: "'Contadme', 'decídmelo', 'llamadme' are vosotros imperative forms (drop final -d + attach pronoun, with decid+me+lo → decídmelo needing an accent) — distinctly Peninsular and absent from Latin American Spanish, which uses ustedes instead." },
      { point: "Double object pronouns (decídmelo)", explanation: "'Decídmelo' stacks indirect (me) + direct (lo) object pronouns onto the vosotros command decid, following the standard indirect-before-direct pronoun order." }
    ],
    comprehensionQuestions: [
      { q: "¿Cómo dice 'tú' que está en el trabajo?", type: "short-answer", answer: "Liado/a pero contento/a" },
      { q: "¿A dónde van a ir de vacaciones en agosto?", type: "mc", options: ["A la montaña", "A la playa", "Al extranjero"], answer: "A la playa" },
      { q: "¿Qué les falta hacer en el piso nuevo?", type: "short-answer", answer: "Pintar el salón y montar los muebles" },
      { q: "¿Quién se ofrece a ayudar con el piso?", type: "mc", options: ["La abuela", "El tío Paco", "Nadie"], answer: "El tío Paco" },
      { q: "¿Cómo reacciona 'tú' cuando la abuela le dice que coma más?", type: "short-answer", answer: "Dice que va a explotar, pero acepta un poco más" }
    ],
    speakingTasks: [
      "Roleplay a family lunch conversation using vosotros forms to address two or more relatives at once.",
      "Practice giving and accepting help using 'echar una mano' and 'ser un manitas'.",
      "Give a vosotros command to a group of friends (e.g. inviting them somewhere) using the correct imperative form."
    ],
    dictationText: "¿Qué tal os va todo? Estamos liados con el trabajo, pero contentos. Si necesitáis ayuda, decídmelo.",
    culturalNotes: {
      context: "Sunday family lunches (comidas de domingo) are a deeply rooted tradition in Spain, often lasting several hours with multiple courses, generations gathered together, and lots of conversation (sobremesa) after eating.",
      nativeBehaviour: "Hosts, especially grandmothers, will insist repeatedly that guests eat more food, even after they say they're full — polite refusal followed by taking a little more is a normal social dance.",
      register: "Fully informal vosotros/tú throughout, as this is a close family setting — using usted here would feel oddly distant and out of place.",
      keyExpressions: ["estar liado/a", "echar una mano", "ser un manitas", "para eso está la familia"],
      warnings: ["English speakers unfamiliar with vosotros often default to ustedes forms learned from Latin American Spanish materials — in Spain, ustedes sounds overly formal/distant with family.", "'Actualmente' does not mean 'actually' — comes up again in casual conversation where 'actually' would be 'de hecho' or 'en realidad'."],
      regionalNotes: "Vosotros is used throughout Spain (except in some very formal contexts) for informal plural address; this contrasts sharply with all of Latin America, where ustedes covers both formal and informal plural.",
      practicalAdvice: "When speaking to a group of friends or family in Spain, default to vosotros forms — using ustedes will mark you as having learned Latin American Spanish and can sound stiff in a Peninsular family setting.",
      nativeSpeakerNotes: "'Venga, comed más' — venga here isn't asking permission, it's an encouraging filler meaning something like 'go on, come on'."
    },
    commonMistakes: [
      "Defaulting to ustedes forms with family/friends instead of vosotros — a very common giveaway that someone learned Latin American Spanish materials.",
      "Forming vosotros commands incorrectly by keeping the -d (e.g. 'contadme' becoming *'contarme' or dropping needed accents like in 'decídmelo').",
      "Using 'actualmente' to mean 'actually' instead of 'currently' — a persistent false friend across contexts."
    ],
    advancedLowExtension: "Describe a family gathering or tradition from your own culture, comparing it to the Spanish tradition of the Sunday family lunch: who attends, what's eaten, how long it lasts, and what kinds of conversations typically happen. Use comparison structures (más...que, tan...como) throughout."
  },
  {
    id: "dlg_weekend_plans_friends",
    title: "Haciendo planes para el finde",
    englishTitle: "Making weekend plans with friends",
    level: "A2",
    category: "intermediate",
    topic: "weekend-plans",
    scenario: "You're texting-turned-calling a close friend in Barcelona to figure out what to do this weekend.",
    lines: [
      { speaker: "Nuria", es: "¡Ey! ¿Qué planes tienes para el finde?", en: "Hey! What plans do you have for the weekend?" },
      { speaker: "Tú", es: "Pues nada todavía, ¿qué te apetece hacer?", en: "Well, nothing yet, what do you feel like doing?" },
      { speaker: "Nuria", es: "A ver... podríamos ir a la playa el sábado si hace bueno.", en: "Let's see... we could go to the beach on Saturday if the weather's nice." },
      { speaker: "Tú", es: "Me mola la idea. ¿Y por la noche qué? ¿Cenamos por ahí?", en: "I like the idea. And at night what? Shall we go out for dinner?" },
      { speaker: "Nuria", es: "Vale, podemos ir a ese bar de tapas nuevo del que te hablé.", en: "Okay, we can go to that new tapas bar I told you about." },
      { speaker: "Tú", es: "Genial, o sea, playa por la tarde y tapas por la noche.", en: "Great, so, beach in the afternoon and tapas at night." },
      { speaker: "Nuria", es: "Eso es. ¿Y el domingo? ¿Te apetece hacer algo o prefieres descansar?", en: "That's it. And on Sunday? Do you feel like doing something or would you rather rest?" },
      { speaker: "Tú", es: "Pues la verdad, prefiero quedarme en casa tranquilo, he tenido una semana muy dura.", en: "Well honestly, I'd rather stay home and relax, I've had a really tough week." },
      { speaker: "Nuria", es: "Lo entiendo perfectamente. Pues nada, sábado playa y tapas, domingo tranquilo.", en: "I totally understand. Well then, Saturday beach and tapas, Sunday relaxed." },
      { speaker: "Tú", es: "Venga, trato hecho. ¿Quedamos a las once en tu casa?", en: "Alright, deal. Shall we meet at eleven at your place?" },
      { speaker: "Nuria", es: "Vale, perfecto. ¡Hasta el sábado entonces!", en: "Okay, perfect. See you Saturday then!" }
    ],
    vocabulary: [
      { es: "el finde", en: "the weekend (short for fin de semana)", note: "very common colloquial shortening" },
      { es: "apetecer", en: "to feel like (doing something)", note: "works like gustar: ¿qué te apetece?" },
      { es: "molar", en: "to like/to be cool (slang)", note: "me mola = I really like it, youth/informal register" },
      { es: "o sea", en: "so / I mean / in other words", note: "extremely common discourse filler for clarifying or summarizing" },
      { es: "quedar (con alguien)", en: "to arrange to meet (someone)", note: "quedamos a las once = let's meet at eleven" },
      { es: "trato hecho", en: "deal / it's a deal", note: "-" },
      { es: "hacer bueno/malo", en: "for the weather to be nice/bad", note: "regional colloquial alternative to hacer buen/mal tiempo" },
      { es: "venga", en: "alright / come on", note: "used here to confirm agreement" }
    ],
    grammarNotes: [
      { point: "Apetecer like gustar", explanation: "'¿Qué te apetece hacer?' follows the same pattern as gustar and doler: indirect object pronoun + apetece + infinitive/noun, central to natural informal invitations." },
      { point: "Conditional 'podríamos' for suggestions", explanation: "'Podríamos ir a la playa' softens a suggestion using the conditional of poder, a common polite/casual way to propose plans among friends." },
      { point: "Preferir + infinitive vs preferir que + subjunctive", explanation: "'Prefiero quedarme en casa' uses preferir + infinitive because the subject of both verbs is the same; this contrasts with 'prefiero que vengas tú', which would need subjunctive since the subjects differ." }
    ],
    comprehensionQuestions: [
      { q: "¿Qué plan proponen para el sábado por la tarde?", type: "short-answer", answer: "Ir a la playa" },
      { q: "¿Qué van a hacer el sábado por la noche?", type: "mc", options: ["Ir al cine", "Cenar en un bar de tapas nuevo", "Quedarse en casa"], answer: "Cenar en un bar de tapas nuevo" },
      { q: "¿Qué prefiere hacer 'tú' el domingo?", type: "mc", options: ["Salir de fiesta", "Quedarse en casa tranquilo", "Ir de compras"], answer: "Quedarse en casa tranquilo" },
      { q: "¿Por qué prefiere descansar el domingo?", type: "short-answer", answer: "Porque ha tenido una semana muy dura" },
      { q: "¿A qué hora quedan y dónde?", type: "mc", options: ["A las once, en casa de Nuria", "A las diez, en la playa", "A las doce, en el bar"], answer: "A las once, en casa de Nuria" }
    ],
    speakingTasks: [
      "Roleplay planning a weekend with a friend using 'qué te apetece', 'vale', and 'venga' naturally.",
      "Practice proposing an alternative plan using 'podríamos' when your friend suggests something you don't want to do.",
      "Describe your ideal weekend plan from start to finish using informal discourse markers (o sea, pues, vale)."
    ],
    dictationText: "¿Qué te apetece hacer este finde? Podríamos ir a la playa si hace bueno. Me mola la idea.",
    culturalNotes: {
      context: "Weekend plans among friends in Spain are often decided informally and somewhat last-minute, with phone calls or messages exchanged throughout the week to finalize details day-by-day.",
      nativeBehaviour: "Spanish social plans typically separate into distinct blocks — tarde (afternoon/evening) and noche (night) — with different activities for each, and dinners often start much later than in the UK/US (9-10pm is normal).",
      register: "Fully informal, peppered with youth/casual slang like 'molar' and fillers like 'o sea', 'pues', 'vale', 'venga' — typical of close friend conversations among younger and middle-aged adults alike.",
      keyExpressions: ["qué te apetece", "o sea", "molar", "trato hecho"],
      warnings: ["'Apetecer' does not mean 'to appear' (a false-friend-adjacent trap) — it means 'to feel like/fancy doing something'.", "Don't translate 'the weekend' literally as 'el weekend' — always use 'el fin de semana' or the colloquial 'el finde'."],
      regionalNotes: "'Molar' is widely used across Spain as youth/informal slang for 'to like/to be cool', though it can sound overly casual in more formal or older-generation contexts — gauge your audience.",
      practicalAdvice: "Spanish dinner and social plans run later than many English speakers expect — arriving at a 'dinner' plan at 8pm might mean you're the only one there for a while.",
      nativeSpeakerNotes: "'O sea' functions similarly to 'I mean' or 'so' in English — used constantly to clarify, rephrase, or summarize what was just said."
    },
    commonMistakes: [
      "Confusing 'apetecer' with 'aparecer' (to appear) due to surface similarity — they are unrelated in meaning.",
      "Overusing formal suggestion structures like '¿Te gustaría...?' when friends would more naturally say '¿Te apetece...?' in casual planning.",
      "Translating 'weekend' as 'weekend' or 'fin de semana' awkwardly without using the natural colloquial shortening 'finde' that peers would use."
    ],
    advancedLowExtension: "Describe, in detail, your ideal weekend from Friday evening to Sunday night, explaining what you like to do, why, and who you'd do it with. Then narrate a specific weekend in the past that didn't go according to plan, explaining what happened instead, using a mix of present, future, and past tenses."
  },
  {
    id: "dlg_workplace_interactions",
    title: "Charla de trabajo con compañeros",
    englishTitle: "Workplace interactions (small talk and discussing a task)",
    level: "B1",
    category: "intermediate",
    topic: "workplace-interactions",
    scenario: "It's Monday morning at the office in Madrid, and you chat briefly with a colleague before discussing a shared work task.",
    lines: [
      { speaker: "Compañero", es: "¡Buenos días! ¿Qué tal el fin de semana?", en: "Good morning! How was the weekend?" },
      { speaker: "Tú", es: "Muy bien, tranquilo. ¿Y tú, qué tal?", en: "Very good, relaxed. And you, how was it?" },
      { speaker: "Compañero", es: "Pues nada especial, en casa descansando. Oye, por cierto, ¿tienes un momento para el informe?", en: "Well, nothing special, resting at home. Hey, by the way, do you have a moment for the report?" },
      { speaker: "Tú", es: "Claro, dime. ¿Qué necesitas?", en: "Sure, tell me. What do you need?" },
      { speaker: "Compañero", es: "Necesito que me envíes los datos de ventas antes de la reunión de las once.", en: "I need you to send me the sales data before the eleven o'clock meeting." },
      { speaker: "Tú", es: "Vale, sin problema. ¿Los quieres en la hoja de cálculo de siempre?", en: "Okay, no problem. Do you want them in the usual spreadsheet?" },
      { speaker: "Compañero", es: "Sí, exacto, con el mismo formato del mes pasado.", en: "Yes, exactly, with the same format as last month." },
      { speaker: "Tú", es: "Perfecto, te lo mando en diez minutos.", en: "Perfect, I'll send it to you in ten minutes." },
      { speaker: "Compañero", es: "Genial, muchas gracias. Ah, y otra cosa, ¿sabes si Marisa está hoy en la oficina?", en: "Great, thank you so much. Ah, and one more thing, do you know if Marisa is in the office today?" },
      { speaker: "Tú", es: "Creo que hoy teletrabaja, pero puedes escribirle por el chat interno.", en: "I think she's working from home today, but you can message her on the internal chat." },
      { speaker: "Compañero", es: "Vale, lo haré. Bueno, me voy a preparar la reunión. ¡Gracias por los datos!", en: "Okay, I'll do that. Well, I'm going to go prepare for the meeting. Thanks for the data!" },
      { speaker: "Tú", es: "De nada, cualquier cosa me avisas.", en: "You're welcome, let me know if you need anything." }
    ],
    vocabulary: [
      { es: "el informe", en: "report", note: "-" },
      { es: "la hoja de cálculo", en: "spreadsheet", note: "-" },
      { es: "teletrabajar", en: "to work remotely/telework", note: "increasingly common term post-pandemic" },
      { es: "el chat interno", en: "internal (company) chat", note: "-" },
      { es: "avisar", en: "to let (someone) know / notify", note: "me avisas = let me know" },
      { es: "por cierto", en: "by the way", note: "-" },
      { es: "sin problema", en: "no problem", note: "-" },
      { es: "cualquier cosa", en: "anything / if anything (comes up)", note: "cualquier cosa me avisas = let me know if anything comes up" }
    ],
    grammarNotes: [
      { point: "Necesitar que + subjunctive", explanation: "'Necesito que me envíes los datos' requires the subjunctive (envíes) because necesitar que introduces a dependent clause with a different subject, expressing a desired action from someone else." },
      { point: "Informal tú register in modern Spanish offices", explanation: "Despite being a professional context, colleagues here use tú throughout — many modern Spanish workplaces, especially younger/tech-oriented ones, favor informal address even in work tasks." },
      { point: "Simple future/ir a for near-future work actions", explanation: "'Te lo mando en diez minutos' uses the present tense for a near-certain near future, while 'me voy a preparar la reunión' uses ir a + infinitive — both natural ways to talk about imminent work actions." }
    ],
    comprehensionQuestions: [
      { q: "¿Qué le pide el compañero a 'tú'?", type: "short-answer", answer: "Los datos de ventas para el informe, antes de la reunión de las once" },
      { q: "¿En qué formato quiere los datos?", type: "mc", options: ["En un documento de Word", "En la hoja de cálculo de siempre", "En un PDF"], answer: "En la hoja de cálculo de siempre" },
      { q: "¿Dónde está Marisa hoy?", type: "mc", options: ["En la oficina", "Teletrabajando", "De vacaciones"], answer: "Teletrabajando" },
      { q: "¿Cómo puede el compañero contactar a Marisa?", type: "short-answer", answer: "Por el chat interno" },
      { q: "¿Cuánto tarda 'tú' en enviar los datos?", type: "mc", options: ["Diez minutos", "Una hora", "Antes de comer"], answer: "Diez minutos" }
    ],
    speakingTasks: [
      "Roleplay a Monday morning office exchange combining small talk and a work request.",
      "Practice using 'necesito que + subjunctive' to ask a colleague for three different things.",
      "Explain, in Spanish, how remote work (teletrabajo) is organized at a company you know or imagine."
    ],
    dictationText: "Necesito que me envíes los datos de ventas antes de la reunión de las once. Sin problema, te lo mando en diez minutos.",
    culturalNotes: {
      context: "Spanish office culture increasingly blends brief personal small talk (fin de semana, planes) with direct work requests — the transition from casual chat to task talk happens quickly and naturally, often introduced with 'por cierto' or 'oye'.",
      nativeBehaviour: "Many modern Spanish workplaces, especially in tech, media, and startups, favor tú over usted even between employees of different seniority levels, though more traditional or hierarchical companies (banking, law, public administration) still favor usted.",
      register: "Informal tú here reflects a modern, relatively flat-hierarchy office; the same conversation in a more traditional company or with a senior boss might shift to usted.",
      keyExpressions: ["¿tienes un momento?", "necesito que...", "sin problema", "cualquier cosa me avisas"],
      warnings: ["'Actualmente' still doesn't mean 'actually' — comes up frequently in workplace Spanish (e.g. 'actualmente trabajo en...' = 'currently I work in...').", "Don't confuse 'informe' (report) with 'información' — informe specifically refers to a formal written report/document."],
      regionalNotes: "Teletrabajo (remote work) terminology and hybrid work norms became especially entrenched in Spanish offices after 2020 and are now a standard part of everyday workplace vocabulary nationwide.",
      practicalAdvice: "When starting a job in Spain, it's wise to observe whether colleagues use tú or usted with each other before defaulting to one register — following the office norm avoids sounding either too stiff or too familiar.",
      nativeSpeakerNotes: "'Por cierto' and 'oye' are both natural ways to pivot a conversation from small talk to business without feeling abrupt."
    },
    commonMistakes: [
      "Using the indicative instead of subjunctive after 'necesito que' (e.g. *'necesito que me envías' instead of the correct 'necesito que me envíes').",
      "Assuming all Spanish workplaces use usted by default — many modern offices are informal (tú) throughout, and mismatching register can feel oddly stiff.",
      "Translating 'actually' as 'actualmente' in a work context (e.g. meaning to say 'actually, I already sent it' but saying something that means 'currently, I already sent it')."
    ],
    advancedLowExtension: "Describe a typical day at a job you've had (or imagine having) in Spain, from arriving at the office to interacting with colleagues throughout the day, including at least one work task you had to coordinate with someone else. Then discuss how workplace culture and communication style might differ between Spain and your home country, using comparison and opinion structures."
  }
];
