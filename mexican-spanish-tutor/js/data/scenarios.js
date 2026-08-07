// SCENARIO MODE — structured, goal-directed real-life situations in Mexico:
// order the right thing, get the right room, explain the right symptom. Each
// scenario has a concrete goal, one or more NPCs, a short scripted-but-varied
// turn sequence (every turn has 2-3 line variants so a replay doesn't feel
// identical), an "unexpected event" that can interrupt or complicate things,
// and three narrated outcomes depending on how much of the required
// information you actually got across — a wrong order or a missed detail is
// a real consequence here, not a silent pass/fail.
//
// This reuses core/conversationEngine.js's building blocks (reaction/
// unexpected-event banks) rather than inventing a second dialogue system —
// see js/views/scenario.js for the runner.

export const SCENARIO_CATEGORIES = [
  { id: "food", icon: "🌮", label: "Food" },
  { id: "shopping", icon: "🛍️", label: "Shopping" },
  { id: "transportation", icon: "🚕", label: "Transportation" },
  { id: "travel", icon: "🧳", label: "Travel" },
  { id: "healthcare", icon: "🩺", label: "Healthcare" },
  { id: "social", icon: "🧑‍🤝‍🧑", label: "Social Life" },
  { id: "workplace", icon: "💼", label: "Workplace" },
  { id: "housing", icon: "🏠", label: "Housing" },
  { id: "banking", icon: "🏦", label: "Banking" },
  { id: "emergencies", icon: "🚨", label: "Emergencies" },
  { id: "government", icon: "🏛️", label: "Government" }
];

export const SCENARIOS = [
  // ================= FOOD =================
  {
    id: "food_cafe_order", category: "food", subcategory: "coffee-shop",
    title: "Ordering at a Coffee Shop", level: "novice-low",
    goal: "Order a coffee, say how you take it, and pay.",
    speakers: [{ id: "barista", name: "Lupe", role: "barista ☕" }],
    openingLines: [
      { spk: "barista", es: "¡Buenas! ¿Qué te preparo?", en: "Morning! What can I get you?" },
      { spk: "barista", es: "Hola, bienvenido — ¿qué se te antoja hoy?", en: "Hi, welcome — what are you in the mood for today?" }
    ],
    turns: [
      { spk: "barista", tier: 0, variants: [
        { es: "¿De qué tamaño — chico, mediano o grande?", en: "What size — small, medium, or large?" },
        { es: "¿Lo quieres chico, mediano o grande?", en: "You want it small, medium, or large?" }
      ] },
      { spk: "barista", tier: 0, variants: [
        { es: "¿Con leche, con azúcar, o lo tomas negro?", en: "With milk, with sugar, or do you take it black?" },
        { es: "¿Se lo preparo con algo, o solito?", en: "Should I make it with anything, or plain?" }
      ] },
      { spk: "barista", tier: 1, variants: [
        { es: "Va a estar en cuarenta y cinco pesos. ¿Efectivo o tarjeta?", en: "That'll be forty-five pesos. Cash or card?" }
      ] }
    ],
    requiredInfo: [
      { key: "drink", patterns: [/caf[eé]/i, /capuchino/i, /lat[eé]/i, /americano/i, /expreso/i] },
      { key: "modifier", patterns: [/sin az[uú]car/i, /con leche/i, /negro/i, /descafeinado/i, /az[uú]car/i, /leche/i] },
      { key: "payment", patterns: [/efectivo/i, /tarjeta/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 1, chance: 0.35, type: "misunderstanding", es: "Perdón, ¿dijiste grande o chico? No te oí bien.", en: "Sorry, did you say large or small? I didn't catch that." }
    ],
    outcomes: {
      success: { es: "Aquí tienes tu café, tal como lo pediste. ¡Que lo disfrutes!", en: "Here's your coffee, just how you ordered it. Enjoy!", tag: "confident" },
      partial: { es: "Toma — creo que es lo que querías, aunque no estoy segura de haber entendido todo.", en: "Here — I think it's what you wanted, though I wasn't sure I understood everything.", tag: "mixed" },
      fail: { es: "Ten... la verdad no entendí bien qué querías, así que te di el de siempre.", en: "Here... honestly I didn't quite understand what you wanted, so I gave you the usual.", tag: "confused" }
    }
  },
  {
    id: "food_restaurant_wrong_order", category: "food", subcategory: "restaurant",
    title: "Fixing a Wrong Order at a Restaurant", level: "intermediate-low",
    goal: "Politely explain that your order is wrong and get it fixed.",
    speakers: [{ id: "mesero", name: "Beto", role: "mesero 🍽️" }],
    openingLines: [
      { spk: "mesero", es: "Aquí tiene, unos tacos al pastor. ¡Buen provecho!", en: "Here you go, some al pastor tacos. Enjoy!" },
      { spk: "mesero", es: "Su orden, unos tacos al pastor. ¿Se le ofrece algo más?", en: "Your order, al pastor tacos. Need anything else?" }
    ],
    turns: [
      { spk: "mesero", tier: 1, variants: [
        { es: "¿Cómo? Perdón, ¿qué fue lo que pidió exactamente?", en: "Sorry, what exactly did you order?" }
      ] },
      { spk: "mesero", tier: 1, variants: [
        { es: "Ay, disculpe, tiene toda la razón. ¿Se lo cambio ahorita mismo?", en: "Oh, I'm sorry, you're completely right. Should I switch it out right now?" }
      ] },
      { spk: "mesero", tier: 1, variants: [
        { es: "Aquí tiene los de bistec, como pidió. Y le regalamos un refresco por la espera.", en: "Here are the steak ones, as you asked. And we'll throw in a soda for the wait." }
      ] }
    ],
    requiredInfo: [
      { key: "problem", patterns: [/no (es|son) lo que ped[ií]/i, /pedí\s+\w+.*no/i, /est[aá] mal/i, /equivocaron/i, /me equivoqu[eé]/i] },
      { key: "correct-order", patterns: [/bistec/i, /pollo/i, /pescado/i, /de \w+ ped[ií]/i] },
      { key: "politeness", patterns: [/por favor/i, /disculpe/i, /perd[oó]n/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.4, type: "clarification", es: "No sé si entendí bien — ¿me lo puede repetir?", en: "I'm not sure I understood — can you repeat that for me?" }
    ],
    outcomes: {
      success: { es: "El mesero corrige la orden sin problema y hasta te invita un refresco por la molestia.", en: "The waiter fixes the order without any issue and even treats you to a soda for the trouble.", tag: "confident" },
      partial: { es: "El mesero se disculpa y se lleva el plato, pero tarda un buen rato en regresar con el correcto.", en: "The waiter apologizes and takes the plate away, but takes a while to come back with the right one.", tag: "mixed" },
      fail: { es: "El mesero se queda confundido y termina trayendo otro plato que tampoco era el tuyo.", en: "The waiter stays confused and ends up bringing yet another dish that also wasn't yours.", tag: "confused" }
    }
  },
  {
    id: "food_allergy_substitution", category: "food", subcategory: "allergies",
    title: "Food Allergies and Substitutions", level: "intermediate-mid",
    goal: "Explain a food allergy and ask for a substitution.",
    speakers: [{ id: "mesera", name: "Xochitl", role: "mesera 🍽️" }],
    openingLines: [
      { spk: "mesera", es: "Buenas tardes, ¿ya saben qué van a ordenar?", en: "Good afternoon, do you know what you're ordering?" }
    ],
    turns: [
      { spk: "mesera", tier: 1, variants: [
        { es: "Entendido, le aviso a la cocina. ¿Es alergia o nomás no le gusta?", en: "Got it, I'll let the kitchen know. Is it an allergy or you just don't like it?" }
      ] },
      { spk: "mesera", tier: 2, variants: [
        { es: "Perfecto, se lo puedo cambiar por champiñones o por más verduras. ¿Cuál prefiere?", en: "Perfect, I can swap that for mushrooms or more vegetables. Which do you prefer?" }
      ] },
      { spk: "mesera", tier: 1, variants: [
        { es: "Muy bien, ya quedó anotado, sin cacahuate y con champiñones en vez de queso.", en: "Great, it's noted — no peanuts, and mushrooms instead of cheese." }
      ] }
    ],
    requiredInfo: [
      { key: "allergy", patterns: [/alergia/i, /soy alérgic[oa]/i, /no puedo comer/i] },
      { key: "ingredient", patterns: [/cacahuate/i, /mariscos/i, /gluten/i, /lácteos/i, /queso/i, /nuez/i] },
      { key: "substitution", patterns: [/champi[ñn]ones/i, /verduras/i, /en vez de/i, /sin/i, /cámbielo por/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 1, chance: 0.35, type: "interruption", es: "Espere, antes de seguir — ¿alguien más en la mesa tiene alguna alergia?", en: "Hold on, before we continue — does anyone else at the table have an allergy?" }
    ],
    outcomes: {
      success: { es: "La cocina prepara tu plato exactamente como lo pediste, sin ningún rastro del ingrediente.", en: "The kitchen prepares your dish exactly as you asked, with no trace of the ingredient.", tag: "confident" },
      partial: { es: "El plato llega casi bien, pero con una salsa que no estabas seguro si llevaba el ingrediente o no.", en: "The dish arrives mostly right, but with a sauce you weren't sure contained the ingredient or not.", tag: "mixed" },
      fail: { es: "El plato llega con el ingrediente de siempre — la cocina no captó el cambio.", en: "The dish arrives with the usual ingredient — the kitchen didn't catch the change.", tag: "confused" }
    }
  },

  // ================= SHOPPING =================
  {
    id: "shopping_clothing_exchange", category: "shopping", subcategory: "clothing",
    title: "Exchanging a Shirt at a Clothing Store", level: "novice-mid",
    goal: "Ask to exchange a shirt for a different size or color.",
    speakers: [{ id: "vendedora", name: "Diana", role: "vendedora 👕" }],
    openingLines: [
      { spk: "vendedora", es: "Buenas, ¿en qué le puedo ayudar?", en: "Hi there, how can I help you?" }
    ],
    turns: [
      { spk: "vendedora", tier: 0, variants: [
        { es: "Claro, ¿qué talla necesita?", en: "Sure, what size do you need?" },
        { es: "Sin problema. ¿La quiere más grande o más chica?", en: "No problem. Do you want it bigger or smaller?" }
      ] },
      { spk: "vendedora", tier: 0, variants: [
        { es: "¿Trae el ticket de compra?", en: "Do you have the receipt?" }
      ] },
      { spk: "vendedora", tier: 1, variants: [
        { es: "Perfecto, aquí tiene la talla mediana. ¿Se la quiere probar?", en: "Perfect, here's the medium. Do you want to try it on?" }
      ] }
    ],
    requiredInfo: [
      { key: "item", patterns: [/camisa/i, /playera/i, /talla/i] },
      { key: "size-or-color", patterns: [/grande/i, /mediana?/i, /chica/i, /color/i, /azul|rojo|negro|blanco/i] },
      { key: "receipt", patterns: [/ticket/i, /recibo/i, /s[ií],? (aqu[ií] )?(lo |la )?trai?go/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 1, chance: 0.3, type: "clarification", es: "¿Me puede explicar de nuevo qué talla trae puesta ahorita?", en: "Can you tell me again what size you're wearing right now?" }
    ],
    outcomes: {
      success: { es: "La vendedora te da la talla correcta sin ningún problema y te desea buen día.", en: "The salesperson gives you the correct size with no issue and wishes you a good day.", tag: "confident" },
      partial: { es: "Te da una talla parecida, pero no exactamente la que buscabas.", en: "She gives you a similar size, but not quite the one you were looking for.", tag: "mixed" },
      fail: { es: "Sin el ticket y sin quedar claro qué necesitabas, la vendedora no puede hacer el cambio hoy.", en: "Without the receipt and without it being clear what you needed, the salesperson can't do the exchange today.", tag: "confused" }
    }
  },
  {
    id: "shopping_pharmacy_medicine", category: "shopping", subcategory: "pharmacy",
    title: "Buying Medicine at the Pharmacy", level: "intermediate-low",
    goal: "Describe a symptom and ask for the right over-the-counter medicine and dosage.",
    speakers: [{ id: "farmaceutico", name: "Ricardo", role: "farmacéutico 💊" }],
    openingLines: [
      { spk: "farmaceutico", es: "Buenas tardes, ¿qué necesita?", en: "Good afternoon, what do you need?" }
    ],
    turns: [
      { spk: "farmaceutico", tier: 1, variants: [
        { es: "Entiendo. ¿Desde cuándo tiene ese malestar?", en: "I see. Since when have you had that?" }
      ] },
      { spk: "farmaceutico", tier: 1, variants: [
        { es: "Le recomiendo este, es de venta libre. ¿Alguna alergia a algún medicamento?", en: "I'd recommend this one, it's over the counter. Any medication allergies?" }
      ] },
      { spk: "farmaceutico", tier: 2, variants: [
        { es: "Tómelo cada ocho horas, con alimento. Si no mejora en dos días, vaya con un doctor.", en: "Take it every eight hours, with food. If it doesn't improve in two days, see a doctor." }
      ] }
    ],
    requiredInfo: [
      { key: "symptom", patterns: [/me duele/i, /dolor/i, /fiebre/i, /tos/i, /gripe/i, /malestar/i] },
      { key: "duration", patterns: [/desde (ayer|hace|el)/i, /hace \w+ d[ií]as?/i, /dos d[ií]as/i] },
      { key: "dosage", patterns: [/cada (\d+|ocho|doce) horas/i, /c[oó]mo (lo|la) tomo/i, /cu[aá]ntas veces/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "multiQuestion", es: "A ver, dos cosas: ¿tiene fiebre también, y ya se tomó algo para eso?", en: "Let's see, two things: do you also have a fever, and have you already taken anything for it?" }
    ],
    outcomes: {
      success: { es: "El farmacéutico te da exactamente lo que necesitas y te explica bien cómo tomarlo.", en: "The pharmacist gives you exactly what you need and explains clearly how to take it.", tag: "confident" },
      partial: { es: "Te da algo para el malestar general, aunque no estás del todo seguro de la dosis.", en: "He gives you something for general discomfort, though you're not entirely sure of the dose.", tag: "mixed" },
      fail: { es: "Sin quedar claro qué te dolía, el farmacéutico solo te ofrece un analgésico genérico.", en: "Without it being clear what hurt, the pharmacist only offers a generic painkiller.", tag: "confused" }
    }
  },
  {
    id: "shopping_market_haggle", category: "shopping", subcategory: "market",
    title: "Haggling at an Open-Air Market", level: "intermediate-mid",
    goal: "Ask the price, negotiate it down, and close the deal.",
    speakers: [{ id: "vendedor", name: "Don Chuy", role: "vendedor 🧺" }],
    openingLines: [
      { spk: "vendedor", es: "¡Pásele, pásele! ¿Qué le damos?", en: "Come on in! What can I get you?" }
    ],
    turns: [
      { spk: "vendedor", tier: 1, variants: [
        { es: "Esto se lo dejo en doscientos pesos, es buena calidad.", en: "I'll let you have this for two hundred pesos, it's good quality." }
      ] },
      { spk: "vendedor", tier: 2, variants: [
        { es: "Ándele, no sea malo, apenas gano. Se lo dejo en ciento setenta, y ya.", en: "Come on, don't be tough, I barely make anything. I'll give it to you for one seventy, final." }
      ] },
      { spk: "vendedor", tier: 1, variants: [
        { es: "Sale pues, trato hecho. ¿Le envuelvo?", en: "Alright then, deal. Should I wrap it up?" }
      ] }
    ],
    requiredInfo: [
      { key: "ask-price", patterns: [/cu[aá]nto (cuesta|vale)/i, /qu[eé] precio/i] },
      { key: "counter-offer", patterns: [/le doy/i, /se lo compro en/i, /muy caro/i, /más barato/i, /pesos/i] },
      { key: "close", patterns: [/trato hecho/i, /va(le)?/i, /s[ií],? me lo llevo/i, /órale/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 1, chance: 0.3, type: "interruption", es: "Aguánteme tantito, tengo otro cliente — ¿en qué íbamos?", en: "Hold on a second, I've got another customer — where were we?" }
    ],
    outcomes: {
      success: { es: "Cierras el trato a buen precio y Don Chuy te invita a regresar pronto.", en: "You close the deal at a good price and Don Chuy invites you to come back soon.", tag: "confident" },
      partial: { es: "Terminas pagando casi el precio original, pero te llevas lo que querías.", en: "You end up paying nearly the original price, but you get what you wanted.", tag: "mixed" },
      fail: { es: "La negociación se enreda y terminas yéndote sin comprar nada.", en: "The negotiation gets tangled and you end up leaving without buying anything.", tag: "confused" }
    }
  },

  // ================= TRANSPORTATION =================
  {
    id: "transport_taxi_destination", category: "transportation", subcategory: "taxi",
    title: "Taking a Taxi", level: "novice-low",
    goal: "Tell the driver where you're going and confirm the fare.",
    speakers: [{ id: "taxista", name: "Chuy", role: "taxista 🚕" }],
    openingLines: [
      { spk: "taxista", es: "Buenas, ¿a dónde lo llevo?", en: "Hey there, where can I take you?" }
    ],
    turns: [
      { spk: "taxista", tier: 0, variants: [
        { es: "¿Sabe cómo llegar o le muestro la ruta en el teléfono?", en: "Do you know the way, or should I show you the route on the phone?" }
      ] },
      { spk: "taxista", tier: 1, variants: [
        { es: "Va a estar como en ciento veinte pesos, depende del tráfico.", en: "It'll be about a hundred and twenty pesos, depending on traffic." }
      ] },
      { spk: "taxista", tier: 0, variants: [
        { es: "Ya llegamos. ¿Efectivo o le pido que pague por la app?", en: "We're here. Cash, or should I have you pay through the app?" }
      ] }
    ],
    requiredInfo: [
      { key: "destination", patterns: [/llev[ao] a/i, /voy a/i, /a la (calle|colonia|avenida)/i, /al aeropuerto/i, /al centro/i] },
      { key: "price-check", patterns: [/cu[aá]nto (cuesta|va a costar|es)/i, /m[aá]s o menos/i] },
      { key: "payment", patterns: [/efectivo/i, /tarjeta/i, /app/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.35, type: "misunderstanding", es: "Perdón, ¿a qué calle dijo? No le entendí bien.", en: "Sorry, which street did you say? I didn't quite understand." }
    ],
    outcomes: {
      success: { es: "Llegas exactamente a donde querías, y el precio fue justo el que te dijeron.", en: "You arrive exactly where you wanted, and the price was exactly what you were told.", tag: "confident" },
      partial: { es: "Llegas cerca de donde querías, pero tienes que caminar una cuadra más de lo esperado.", en: "You arrive near where you wanted, but you have to walk a block further than expected.", tag: "mixed" },
      fail: { es: "El taxista no entendió bien la dirección y terminas en el lugar equivocado.", en: "The driver didn't quite understand the address and you end up in the wrong place.", tag: "confused" }
    }
  },
  {
    id: "transport_metro_lost", category: "transportation", subcategory: "metro",
    title: "Asking for Directions in the Metro", level: "novice-high",
    goal: "Explain you're lost and ask which line/station to take.",
    speakers: [{ id: "empleado", name: "Sr. Aguilar", role: "empleado del metro 🚇" }],
    openingLines: [
      { spk: "empleado", es: "Buenas, ¿se le ofrece algo?", en: "Hi there, can I help with something?" }
    ],
    turns: [
      { spk: "empleado", tier: 0, variants: [
        { es: "Ah sí, tiene que hacer transbordo en la siguiente estación.", en: "Ah yes, you need to transfer at the next station." }
      ] },
      { spk: "empleado", tier: 1, variants: [
        { es: "Tome la línea verde, dirección Indios Verdes, y bájese en la cuarta parada.", en: "Take the green line, direction Indios Verdes, and get off at the fourth stop." }
      ] },
      { spk: "empleado", tier: 0, variants: [
        { es: "¿Le quedó claro, o se lo repito?", en: "Was that clear, or should I repeat it?" }
      ] }
    ],
    requiredInfo: [
      { key: "problem", patterns: [/estoy perdid[oa]/i, /no s[eé] c[oó]mo llegar/i, /me puede ayudar/i, /d[oó]nde queda/i] },
      { key: "destination-line", patterns: [/l[ií]nea/i, /estaci[oó]n/i, /direcci[oó]n/i] },
      { key: "confirm", patterns: [/entendido/i, /gracias/i, /s[ií], claro/i, /me qued[oó] claro/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 1, chance: 0.3, type: "interruption", es: "Espere, antes de que se vaya — ¿trae su tarjeta recargada?", en: "Wait, before you go — is your card topped up?" }
    ],
    outcomes: {
      success: { es: "Llegas a tu destino sin ningún contratiempo, siguiendo las indicaciones exactas.", en: "You arrive at your destination with no trouble at all, following the exact directions.", tag: "confident" },
      partial: { es: "Te bajas una estación antes de lo debido, pero logras llegar caminando.", en: "You get off one stop too early, but manage to get there on foot.", tag: "mixed" },
      fail: { es: "Terminas en la línea equivocada y tienes que regresar sobre tus pasos.", en: "You end up on the wrong line and have to backtrack.", tag: "confused" }
    }
  },
  {
    id: "transport_airport_missed_flight", category: "transportation", subcategory: "airport",
    title: "A Delayed Flight at the Airport", level: "intermediate-high",
    goal: "Explain your situation to the airline agent and figure out your options.",
    speakers: [{ id: "agente", name: "Vanessa", role: "agente de aerolínea ✈️" }],
    openingLines: [
      { spk: "agente", es: "Buenas tardes, ¿en qué le puedo ayudar?", en: "Good afternoon, how can I help you?" }
    ],
    turns: [
      { spk: "agente", tier: 2, variants: [
        { es: "Entiendo su molestia. Déjeme revisar qué opciones tenemos disponibles.", en: "I understand your frustration. Let me check what options we have available." }
      ] },
      { spk: "agente", tier: 2, variants: [
        { es: "Le puedo ofrecer el siguiente vuelo en tres horas, o un reembolso completo. ¿Cuál prefiere?", en: "I can offer you the next flight in three hours, or a full refund. Which do you prefer?" }
      ] },
      { spk: "agente", tier: 1, variants: [
        { es: "Perfecto, ya quedó su nuevo vuelo confirmado. Aquí tiene su nuevo pase de abordar.", en: "Perfect, your new flight is confirmed. Here's your new boarding pass." }
      ] }
    ],
    requiredInfo: [
      { key: "problem", patterns: [/se cancel[oó]/i, /se retras[oó]/i, /perd[ií] mi vuelo/i, /vuelo (se )?demor[oó]/i] },
      { key: "preference", patterns: [/pr[oó]ximo vuelo/i, /reembolso/i, /otra fecha/i, /prefiero/i] },
      { key: "closing", patterns: [/gracias/i, /perfecto/i, /est[aá] bien/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.35, type: "clarification", es: "Disculpe, ¿me puede repetir su número de reservación?", en: "Sorry, could you repeat your reservation number for me?" }
    ],
    outcomes: {
      success: { es: "La agente resuelve tu situación con calma y sales con un plan claro.", en: "The agent resolves your situation calmly and you leave with a clear plan.", tag: "confident" },
      partial: { es: "Te reacomodan en un vuelo, aunque tarda más de lo que hubieras querido explicar la situación.", en: "You get rebooked on a flight, though it takes longer than you'd have liked to explain the situation.", tag: "mixed" },
      fail: { es: "La agente no logra entender bien tu situación y te manda a otro mostrador.", en: "The agent can't quite understand your situation and sends you to another counter.", tag: "confused" }
    }
  },

  // ================= TRAVEL =================
  {
    id: "travel_hotel_checkin_problem", category: "travel", subcategory: "hotel",
    title: "A Reservation Problem at the Hotel", level: "intermediate-low",
    goal: "Check in and resolve a mix-up with your reservation.",
    speakers: [{ id: "recepcionista", name: "Mariana", role: "recepcionista 🏨" }],
    openingLines: [
      { spk: "recepcionista", es: "Buenas noches, bienvenido. ¿A nombre de quién está la reservación?", en: "Good evening, welcome. Whose name is the reservation under?" }
    ],
    turns: [
      { spk: "recepcionista", tier: 1, variants: [
        { es: "Qué raro, no la encuentro con ese nombre. ¿Tiene el correo de confirmación?", en: "That's strange, I don't find it under that name. Do you have the confirmation email?" }
      ] },
      { spk: "recepcionista", tier: 1, variants: [
        { es: "Ah, ya la encontré, estaba mal escrito el apellido. Le puedo dar una habitación doble.", en: "Ah, found it, the last name was misspelled. I can give you a double room." }
      ] },
      { spk: "recepcionista", tier: 0, variants: [
        { es: "Aquí tiene su llave, cuarto trescientos cuatro. El desayuno es de siete a diez.", en: "Here's your key, room 304. Breakfast is from seven to ten." }
      ] }
    ],
    requiredInfo: [
      { key: "name", patterns: [/a nombre de/i, /mi nombre es/i, /me llamo/i, /reservaci[oó]n de/i] },
      { key: "confirmation", patterns: [/correo/i, /confirmaci[oó]n/i, /aqu[ií] (lo )?(tengo|traigo)/i] },
      { key: "resolve", patterns: [/gracias/i, /perfecto/i, /est[aá] bien/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "misunderstanding", es: "Perdón, ¿me puede deletrear su apellido? No le entendí bien.", en: "Sorry, could you spell your last name for me? I didn't catch it." }
    ],
    outcomes: {
      success: { es: "El malentendido se resuelve rápido y subes a tu cuarto sin más contratiempos.", en: "The mix-up gets resolved quickly and you head up to your room with no further trouble.", tag: "confident" },
      partial: { es: "Te dan un cuarto distinto al que reservaste, pero al menos ya tienes dónde quedarte.", en: "You get a different room than you booked, but at least you have somewhere to stay.", tag: "mixed" },
      fail: { es: "La recepcionista no logra encontrar tu reservación y tienes que esperar a que resuelvan todo por teléfono.", en: "The receptionist can't find your reservation and you have to wait while they sort it out by phone.", tag: "confused" }
    }
  },
  {
    id: "travel_guided_tour_questions", category: "travel", subcategory: "tours",
    title: "Asking Questions on a Guided Tour", level: "novice-high",
    goal: "Ask the tour guide questions about the site and the schedule.",
    speakers: [{ id: "guia", name: "Fernanda", role: "guía de turistas 🗺️" }],
    openingLines: [
      { spk: "guia", es: "Bienvenidos al recorrido. ¿Alguien tiene preguntas antes de empezar?", en: "Welcome to the tour. Anyone have questions before we start?" }
    ],
    turns: [
      { spk: "guia", tier: 1, variants: [
        { es: "Buena pregunta — esta pirámide se construyó hace más de mil años.", en: "Good question — this pyramid was built over a thousand years ago." }
      ] },
      { spk: "guia", tier: 0, variants: [
        { es: "El recorrido dura como dos horas, con una parada para tomar agua.", en: "The tour lasts about two hours, with a stop for water." }
      ] },
      { spk: "guia", tier: 0, variants: [
        { es: "Sí, se permiten fotos en todas partes menos adentro del museo.", en: "Yes, photos are allowed everywhere except inside the museum." }
      ] }
    ],
    requiredInfo: [
      { key: "question", patterns: [/\?|cu[aá]ndo|cu[aá]nto|puedo|se permite|d[oó]nde/i] },
      { key: "follow-up", patterns: [/y (tambi[eé]n|adem[aá]s)/i, /otra pregunta/i, /una cosa m[aá]s/i] },
      { key: "thanks", patterns: [/gracias/i, /qu[eé] interesante/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 1, chance: 0.3, type: "multiQuestion", es: "Ah, y ya que preguntan — ¿alguien trae sombrero, y todos tienen suficiente agua?", en: "Oh, and since you're asking — does anyone have a hat, and does everyone have enough water?" }
    ],
    outcomes: {
      success: { es: "La guía responde todas tus preguntas con gusto y te recomienda otro sitio para visitar.", en: "The guide happily answers all your questions and recommends another site to visit.", tag: "confident" },
      partial: { es: "Consigues algunas respuestas, aunque te quedas con dudas sobre el horario.", en: "You get some answers, though you're still unsure about the schedule.", tag: "mixed" },
      fail: { es: "Entre el ruido del grupo, no logras que la guía entienda bien tu pregunta.", en: "Between the noise of the group, you can't quite get the guide to understand your question.", tag: "confused" }
    }
  },
  {
    id: "travel_car_rental_change", category: "travel", subcategory: "car-rental",
    title: "Changing a Car Rental Reservation", level: "intermediate-mid",
    goal: "Ask to change the pickup date or car type on your rental.",
    speakers: [{ id: "agente", name: "Oswaldo", role: "agente de renta de autos 🚗" }],
    openingLines: [
      { spk: "agente", es: "Buenas, ¿tiene una reservación con nosotros?", en: "Hi, do you have a reservation with us?" }
    ],
    turns: [
      { spk: "agente", tier: 2, variants: [
        { es: "Claro, ¿para qué fecha la quiere mover, y qué tipo de auto prefiere?", en: "Sure, what date would you like to move it to, and what type of car do you prefer?" }
      ] },
      { spk: "agente", tier: 1, variants: [
        { es: "Tenemos un auto más grande disponible, pero tiene un costo extra de trescientos pesos.", en: "We have a bigger car available, but it has an extra cost of three hundred pesos." }
      ] },
      { spk: "agente", tier: 1, variants: [
        { es: "Listo, ya quedó actualizada su reservación con el nuevo auto y fecha.", en: "Done, your reservation is updated with the new car and date." }
      ] }
    ],
    requiredInfo: [
      { key: "reservation", patterns: [/reservaci[oó]n/i, /a nombre de/i] },
      { key: "change", patterns: [/cambiar/i, /mover la fecha/i, /otro auto/i, /más grande|más chico/i] },
      { key: "confirm", patterns: [/est[aá] bien/i, /de acuerdo/i, /perfecto/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "interruption", es: "Un momento — antes de seguir, ¿me puede confirmar su licencia de conducir?", en: "One moment — before we go on, can you confirm your driver's license for me?" }
    ],
    outcomes: {
      success: { es: "Tu reservación queda actualizada exactamente como querías, sin cargos inesperados.", en: "Your reservation is updated exactly as you wanted, with no surprise charges.", tag: "confident" },
      partial: { es: "Cambian el auto, pero la fecha se queda igual porque no quedó del todo clara.", en: "They change the car, but the date stays the same because it wasn't entirely clear.", tag: "mixed" },
      fail: { es: "El agente se confunde entre tantos detalles y termina sin cambiar nada.", en: "The agent gets confused amid so many details and ends up changing nothing.", tag: "confused" }
    }
  },

  // ================= HEALTHCARE =================
  {
    id: "healthcare_doctor_symptoms", category: "healthcare", subcategory: "doctor",
    title: "Describing Symptoms to a Doctor", level: "intermediate-low",
    goal: "Describe your symptoms clearly enough for the doctor to help you.",
    speakers: [{ id: "doctora", name: "Dra. Reyes", role: "doctora 🩺" }],
    openingLines: [
      { spk: "doctora", es: "Buenas tardes, cuénteme, ¿qué le pasa?", en: "Good afternoon, tell me, what's going on?" }
    ],
    turns: [
      { spk: "doctora", tier: 1, variants: [
        { es: "¿Desde cuándo tiene ese dolor, y qué tan fuerte es, del uno al diez?", en: "Since when have you had that pain, and how strong is it, one to ten?" }
      ] },
      { spk: "doctora", tier: 1, variants: [
        { es: "¿Ha tomado algo para eso, o tiene alguna alergia a medicamentos?", en: "Have you taken anything for it, or do you have any medication allergies?" }
      ] },
      { spk: "doctora", tier: 2, variants: [
        { es: "Le voy a recetar algo, y quiero que regrese si no mejora en tres días.", en: "I'm going to prescribe you something, and I want you to come back if it doesn't improve in three days." }
      ] }
    ],
    requiredInfo: [
      { key: "symptom", patterns: [/me duele/i, /dolor/i, /siento/i, /tengo (fiebre|tos|náuseas)/i] },
      { key: "duration", patterns: [/desde/i, /hace \w+ d[ií]as?/i, /ayer/i] },
      { key: "severity", patterns: [/mucho|poco|leve|fuerte|del \d al \d|\d de \d+/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "clarification", es: "No me quedó claro dónde exactamente le duele, ¿me puede señalar?", en: "It wasn't clear to me exactly where it hurts, can you point to it?" }
    ],
    outcomes: {
      success: { es: "La doctora entiende bien tus síntomas y te da un diagnóstico y receta claros.", en: "The doctor understands your symptoms well and gives you a clear diagnosis and prescription.", tag: "confident" },
      partial: { es: "Te receta algo general, aunque no queda del todo claro qué tan grave es lo que tienes.", en: "She prescribes something general, though it's not entirely clear how serious what you have is.", tag: "mixed" },
      fail: { es: "Sin detalles claros, la doctora solo te pide que regreses si empeora.", en: "Without clear details, the doctor just asks you to come back if it gets worse.", tag: "confused" }
    }
  },
  {
    id: "healthcare_pharmacy_otc", category: "healthcare", subcategory: "pharmacy-visit",
    title: "Asking the Pharmacist for Advice", level: "novice-mid",
    goal: "Ask for something to help with a headache or a cold.",
    speakers: [{ id: "farmaceutica", name: "Sra. Nava", role: "farmacéutica 💊" }],
    openingLines: [
      { spk: "farmaceutica", es: "Buenas, ¿qué se le ofrece?", en: "Hello, what can I get you?" }
    ],
    turns: [
      { spk: "farmaceutica", tier: 0, variants: [
        { es: "¿Es dolor de cabeza, de estómago, o gripe?", en: "Is it a headache, stomach ache, or a cold?" }
      ] },
      { spk: "farmaceutica", tier: 0, variants: [
        { es: "Este le puede servir. ¿Cuántas pastillas necesita?", en: "This one might help. How many pills do you need?" }
      ] },
      { spk: "farmaceutica", tier: 1, variants: [
        { es: "Tómelo con agua, no con el estómago vacío.", en: "Take it with water, not on an empty stomach." }
      ] }
    ],
    requiredInfo: [
      { key: "symptom", patterns: [/dolor de cabeza/i, /gripe/i, /tos/i, /dolor de est[oó]mago/i] },
      { key: "quantity", patterns: [/una caja/i, /unas pastillas/i, /\d+ (pastillas|tabletas)/i] },
      { key: "thanks", patterns: [/gracias/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "misunderstanding", es: "¿Cómo dijo? ¿Dolor de cabeza o de estómago?", en: "What did you say? Headache or stomach ache?" }
    ],
    outcomes: {
      success: { es: "Sales con exactamente lo que necesitabas y sabiendo cómo tomarlo.", en: "You leave with exactly what you needed and knowing how to take it.", tag: "confident" },
      partial: { es: "Te da algo para el malestar en general, que sirve pero no es lo más específico.", en: "She gives you something for general discomfort, which helps but isn't the most specific.", tag: "mixed" },
      fail: { es: "Sin que quede claro el síntoma, la farmacéutica te ofrece algo genérico nada más.", en: "Without the symptom being clear, the pharmacist just offers something generic.", tag: "confused" }
    }
  },
  {
    id: "healthcare_urgent_injury", category: "healthcare", subcategory: "urgent-care",
    title: "Describing an Injury at Urgent Care", level: "advanced-low",
    goal: "Explain how an injury happened and how it's affecting you, in detail.",
    speakers: [{ id: "enfermero", name: "Enf. Torres", role: "enfermero 🚑" }],
    openingLines: [
      { spk: "enfermero", es: "A ver, cuénteme exactamente qué pasó.", en: "Okay, tell me exactly what happened." }
    ],
    turns: [
      { spk: "enfermero", tier: 2, variants: [
        { es: "Entiendo. ¿Y desde el accidente, ha podido mover el brazo con normalidad?", en: "I see. And since the accident, have you been able to move your arm normally?" }
      ] },
      { spk: "enfermero", tier: 2, variants: [
        { es: "¿El dolor es constante o va y viene? ¿Empeora con el movimiento?", en: "Is the pain constant or does it come and go? Does it get worse with movement?" }
      ] },
      { spk: "enfermero", tier: 2, variants: [
        { es: "Bien, con lo que me cuenta, vamos a hacerle unas radiografías para estar seguros.", en: "Alright, based on what you're telling me, we're going to take some X-rays to be sure." }
      ] }
    ],
    requiredInfo: [
      { key: "cause", patterns: [/me ca[ií]/i, /choqu[eé]/i, /me golpe[eé]/i, /pas[oó] cuando/i] },
      { key: "function", patterns: [/no puedo mover/i, /s[ií] puedo mover/i, /me cuesta/i] },
      { key: "pain-pattern", patterns: [/constante/i, /va y viene/i, /empeora/i, /cuando me muevo/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 1, chance: 0.3, type: "clarification", es: "No me quedó del todo claro — ¿el dolor empezó antes o después de caerse?", en: "That wasn't entirely clear to me — did the pain start before or after you fell?" }
    ],
    outcomes: {
      success: { es: "El enfermero entiende exactamente lo que pasó y actúa rápido con el diagnóstico correcto.", en: "The nurse understands exactly what happened and moves quickly with the right diagnosis.", tag: "confident" },
      partial: { es: "Te atienden, pero piden más pruebas de las necesarias por no quedar claro el detalle.", en: "You get treated, but they order more tests than necessary because the detail wasn't clear.", tag: "mixed" },
      fail: { es: "Sin entender bien qué pasó, el personal pierde tiempo valioso haciendo preguntas de más.", en: "Without understanding well what happened, the staff loses valuable time asking extra questions.", tag: "confused" }
    }
  },

  // ================= SOCIAL LIFE =================
  {
    id: "social_making_friend_party", category: "social", subcategory: "making-friends",
    title: "Making a New Friend at a Party", level: "novice-mid",
    goal: "Introduce yourself and find something in common to talk about.",
    speakers: [{ id: "compa", name: "Karla", role: "invitada 🎉" }],
    openingLines: [
      { spk: "compa", es: "¡Hola! No te había visto antes, ¿eres amigo de quién?", en: "Hi! I haven't seen you before, whose friend are you?" }
    ],
    turns: [
      { spk: "compa", tier: 0, variants: [
        { es: "Ah, qué bien. ¿Y tú a qué te dedicas?", en: "Oh nice. So what do you do?" }
      ] },
      { spk: "compa", tier: 1, variants: [
        { es: "¡No manches, yo también! ¿Y qué haces cuando no trabajas?", en: "No way, me too! So what do you do when you're not working?" }
      ] },
      { spk: "compa", tier: 0, variants: [
        { es: "Qué padre. Oye, ¿me pasas tu número para seguir platicando?", en: "That's cool. Hey, can I get your number to keep chatting?" }
      ] }
    ],
    requiredInfo: [
      { key: "intro", patterns: [/me llamo/i, /soy/i, /mucho gusto/i] },
      { key: "connection", patterns: [/amigo de/i, /conoc[ií] a/i, /vengo con/i] },
      { key: "common-ground", patterns: [/tambi[eé]n me gusta/i, /a m[ií] me gusta/i, /qu[eé] casualidad/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 1, chance: 0.3, type: "interruption", es: "Espérame, me está hablando alguien — ¿decías?", en: "Hold on, someone's calling me — what were you saying?" }
    ],
    outcomes: {
      success: { es: "Terminan intercambiando números y quedan de verse otra vez pronto.", en: "You end up exchanging numbers and plan to meet up again soon.", tag: "confident" },
      partial: { es: "La plática fluye bien, pero se queda ahí, sin planes concretos.", en: "The conversation flows fine, but it stays there, with no concrete plans.", tag: "mixed" },
      fail: { es: "La conversación se siente forzada y ella se va a platicar con alguien más.", en: "The conversation feels forced and she goes off to talk to someone else.", tag: "confused" }
    }
  },
  {
    id: "social_family_gathering", category: "social", subcategory: "family-gathering",
    title: "Meeting Relatives at a Family Gathering", level: "intermediate-low",
    goal: "Make small talk with several relatives you're meeting for the first time.",
    speakers: [
      { id: "tia", name: "Tía Lupe", role: "tía 👵" },
      { id: "primo", name: "Primo Beto", role: "primo 🧑" },
      { id: "abuelo", name: "Abuelo Nacho", role: "abuelo 👴" }
    ],
    openingLines: [
      { spk: "tia", es: "¡Mira nada más, ya llegaste! Ven, siéntate con nosotros.", en: "Look who's here, you made it! Come sit with us." }
    ],
    turns: [
      { spk: "tia", tier: 1, variants: [
        { es: "Y cuéntame, ¿tus papás cómo están?", en: "So tell me, how are your parents doing?" }
      ] },
      { spk: "primo", tier: 1, variants: [
        { es: "Oye, ¿y tú a qué te dedicas ahorita?", en: "Hey, so what do you do these days?" }
      ] },
      { spk: "abuelo", tier: 2, variants: [
        { es: "En mis tiempos era muy distinto todo eso. Cuéntame más.", en: "In my day all that was very different. Tell me more." }
      ] }
    ],
    requiredInfo: [
      { key: "family-update", patterns: [/mis papás/i, /est[aá]n bien/i, /mi familia/i] },
      { key: "occupation", patterns: [/trabajo (en|de)/i, /estudio/i, /me dedico a/i] },
      { key: "engagement", patterns: [/cu[eé]nteme/i, /y usted/i, /y a ti/i, /interesante/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 1, chance: 0.35, type: "multiQuestion", es: "Oye, dos cosas: ¿ya te sirvieron de comer, y hasta cuándo te quedas?", en: "Hey, two things: have they served you food yet, and how long are you staying?" }
    ],
    outcomes: {
      success: { es: "Toda la familia queda encantada contigo y te invitan a la próxima reunión.", en: "The whole family is delighted with you and invites you to the next gathering.", tag: "confident" },
      partial: { es: "La plática va bien en general, aunque alguna pregunta se queda sin responder del todo.", en: "The conversation goes fine overall, though a question or two goes not entirely answered.", tag: "mixed" },
      fail: { es: "Entre tantas preguntas a la vez, terminas confundido y respondiendo cosas que no venían al caso.", en: "Between so many questions at once, you end up confused and answering things that were beside the point.", tag: "confused" }
    }
  },
  {
    id: "social_first_date", category: "social", subcategory: "dating",
    title: "A First Date Conversation", level: "intermediate-mid",
    goal: "Keep a first-date conversation going and ask about the other person too.",
    speakers: [{ id: "cita", name: "Sofía", role: "cita 💐" }],
    openingLines: [
      { spk: "cita", es: "¡Hola! Qué bueno por fin conocerte en persona.", en: "Hi! It's great to finally meet you in person." }
    ],
    turns: [
      { spk: "cita", tier: 1, variants: [
        { es: "Qué interesante. ¿Y eso siempre te gustó, o fue algo que descubriste después?", en: "That's interesting. Did you always like that, or was it something you discovered later?" }
      ] },
      { spk: "cita", tier: 2, variants: [
        { es: "Oye, ¿y tú qué buscas ahorita, en general, en tu vida?", en: "So, what are you looking for right now, in general, in your life?" }
      ] },
      { spk: "cita", tier: 1, variants: [
        { es: "Me la pasé muy bien. ¿Repetimos la próxima semana?", en: "I had a really good time. Should we do this again next week?" }
      ] }
    ],
    requiredInfo: [
      { key: "share", patterns: [/a m[ií] me gusta/i, /me encanta/i, /me interesa/i] },
      { key: "ask-back", patterns: [/y a ti/i, /y t[uú]/i, /qu[eé] hay de ti/i] },
      { key: "closing", patterns: [/me la pas[eé]/i, /me gustar[ií]a/i, /claro que s[ií]/i, /por supuesto/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 1, chance: 0.3, type: "clarification", es: "Perdón, ¿a qué te refieres exactamente con eso?", en: "Sorry, what exactly do you mean by that?" }
    ],
    outcomes: {
      success: { es: "La conversación fluye de verdad y terminan planeando una segunda cita.", en: "The conversation really flows and you end up planning a second date.", tag: "confident" },
      partial: { es: "La pasan bien, pero la plática se siente un poco de una sola vía.", en: "You have a nice time, but the conversation feels a bit one-sided.", tag: "mixed" },
      fail: { es: "Las respuestas cortas hacen que la plática se sienta forzada toda la noche.", en: "The short answers make the conversation feel forced the whole night.", tag: "confused" }
    }
  },

  // ================= WORKPLACE =================
  {
    id: "workplace_team_meeting", category: "workplace", subcategory: "meetings",
    title: "Giving a Status Update in a Team Meeting", level: "intermediate-mid",
    goal: "Report your progress on a project and answer follow-up questions from two coworkers.",
    speakers: [
      { id: "jefa", name: "Lic. Cárdenas", role: "jefa 👩‍💼" },
      { id: "compañero", name: "Iván", role: "compañero 🧑‍💻" }
    ],
    openingLines: [
      { spk: "jefa", es: "A ver, empecemos. ¿Cómo va tu parte del proyecto?", en: "Alright, let's start. How's your part of the project going?" }
    ],
    turns: [
      { spk: "jefa", tier: 2, variants: [
        { es: "Bien. ¿Y crees que vamos a terminar a tiempo?", en: "Good. Do you think we'll finish on time?" }
      ] },
      { spk: "compañero", tier: 1, variants: [
        { es: "Oye, ¿necesitas ayuda con algo de tu parte?", en: "Hey, do you need help with anything on your end?" }
      ] },
      { spk: "jefa", tier: 2, variants: [
        { es: "Perfecto, entonces seguimos como está planeado. Buen trabajo.", en: "Perfect, then we continue as planned. Good work." }
      ] }
    ],
    requiredInfo: [
      { key: "progress", patterns: [/voy (en|con)/i, /ya termin[eé]/i, /avanzando/i, /porcentaje|por ciento/i] },
      { key: "timeline", patterns: [/a tiempo/i, /vamos a terminar/i, /necesito más tiempo/i] },
      { key: "acknowledge-help", patterns: [/gracias/i, /s[ií], me ayudar[ií]a/i, /no, estoy bien/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "interruption", es: "Espera, antes de seguir — ¿ya le avisaste al cliente del avance?", en: "Wait, before we continue — did you already let the client know about the progress?" }
    ],
    outcomes: {
      success: { es: "El equipo queda tranquilo con tu reporte y confía en que todo va bien encaminado.", en: "The team feels reassured by your report and trusts everything is on track.", tag: "confident" },
      partial: { es: "El reporte pasa, aunque queda una que otra duda sobre los tiempos.", en: "The report is fine, though a question or two remains about the timeline.", tag: "mixed" },
      fail: { es: "La jefa se queda con dudas sobre si el proyecto realmente va a tiempo.", en: "The boss is left unsure whether the project is really on time.", tag: "confused" }
    }
  },
  {
    id: "workplace_job_interview", category: "workplace", subcategory: "interview",
    title: "A Job Interview", level: "intermediate-high",
    goal: "Answer interview questions about your experience and ask a question of your own.",
    speakers: [{ id: "entrevistador", name: "Lic. Morales", role: "entrevistador 💼" }],
    openingLines: [
      { spk: "entrevistador", es: "Buenas tardes, gracias por venir. Cuénteme sobre su experiencia.", en: "Good afternoon, thanks for coming in. Tell me about your experience." }
    ],
    turns: [
      { spk: "entrevistador", tier: 2, variants: [
        { es: "Interesante. ¿Cuál diría que es su mayor fortaleza para este puesto?", en: "Interesting. What would you say is your greatest strength for this position?" }
      ] },
      { spk: "entrevistador", tier: 2, variants: [
        { es: "Entiendo. ¿Y cómo maneja usted una situación de mucha presión?", en: "I see. And how do you handle a high-pressure situation?" }
      ] },
      { spk: "entrevistador", tier: 1, variants: [
        { es: "Muy bien. ¿Usted tiene alguna pregunta para mí?", en: "Very good. Do you have any questions for me?" }
      ] }
    ],
    requiredInfo: [
      { key: "experience", patterns: [/trabaj[eé]/i, /experiencia/i, /años/i, /me dediqu[eé]/i] },
      { key: "strength", patterns: [/fortaleza/i, /se me da bien/i, /soy bueno/i, /destaco/i] },
      { key: "question-back", patterns: [/\?/, /me gustar[ií]a preguntar/i, /una pregunta/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "multiQuestion", es: "Ah, y otra cosa: ¿por qué dejó su trabajo anterior, y desde cuándo puede empezar?", en: "Oh, and another thing: why did you leave your previous job, and when can you start?" }
    ],
    outcomes: {
      success: { es: "El entrevistador queda muy impresionado y te dice que te contactarán pronto con buenas noticias.", en: "The interviewer is very impressed and tells you they'll be in touch soon with good news.", tag: "confident" },
      partial: { es: "La entrevista va bien en general, aunque una de tus respuestas se sintió algo corta.", en: "The interview goes well overall, though one of your answers felt a bit short.", tag: "mixed" },
      fail: { es: "Varias respuestas cortas dejan al entrevistador con más dudas que certezas.", en: "Several short answers leave the interviewer with more doubts than certainty.", tag: "confused" }
    }
  },
  {
    id: "workplace_difficult_customer", category: "workplace", subcategory: "customer-service",
    title: "Handling a Difficult Customer", level: "advanced-low",
    goal: "De-escalate an angry customer's complaint and offer a solution.",
    speakers: [{ id: "cliente", name: "Sr. Domínguez", role: "cliente molesto 😠" }],
    openingLines: [
      { spk: "cliente", es: "¡Esto es una falta de respeto! Llevo esperando media hora.", en: "This is disrespectful! I've been waiting half an hour." }
    ],
    turns: [
      { spk: "cliente", tier: 2, variants: [
        { es: "No me interesan las disculpas, quiero una solución ahora mismo.", en: "I don't care about apologies, I want a solution right now." }
      ] },
      { spk: "cliente", tier: 2, variants: [
        { es: "Está bien, eso ayuda. Pero espero que no se repita.", en: "Fine, that helps. But I expect this not to happen again." }
      ] },
      { spk: "cliente", tier: 1, variants: [
        { es: "Gracias por resolverlo. Disculpe si me alteré.", en: "Thanks for sorting it out. Sorry if I got upset." }
      ] }
    ],
    requiredInfo: [
      { key: "acknowledge", patterns: [/tiene raz[oó]n/i, /entiendo su (molestia|frustraci[oó]n)/i, /lo siento/i, /disculpe/i] },
      { key: "solution", patterns: [/le puedo ofrecer/i, /le voy a/i, /vamos a resolver/i, /descuento|reembolso/i] },
      { key: "closing", patterns: [/algo más/i, /qued[oó] resuelto/i, /gracias por su paciencia/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "interruption", es: "Y otra cosa — ¡esto ya me había pasado antes también!", en: "And another thing — this has happened to me before too!" }
    ],
    outcomes: {
      success: { es: "El cliente se calma por completo y se va satisfecho con la solución.", en: "The customer completely calms down and leaves satisfied with the solution.", tag: "confident" },
      partial: { es: "El cliente acepta la solución, pero se va todavía algo molesto.", en: "The customer accepts the solution, but leaves still a bit annoyed.", tag: "mixed" },
      fail: { es: "Sin una disculpa clara ni una solución concreta, el cliente pide hablar con tu supervisor.", en: "Without a clear apology or a concrete solution, the customer asks to speak with your supervisor.", tag: "confused" }
    }
  },

  // ================= HOUSING =================
  {
    id: "housing_apartment_hunting", category: "housing", subcategory: "apartment-hunting",
    title: "Asking a Landlord About an Apartment", level: "intermediate-low",
    goal: "Ask the landlord about rent, utilities, and lease length.",
    speakers: [{ id: "propietaria", name: "Sra. Ochoa", role: "propietaria 🏠" }],
    openingLines: [
      { spk: "propietaria", es: "Buenas, pásele. ¿Qué le gustaría saber del departamento?", en: "Hi, come on in. What would you like to know about the apartment?" }
    ],
    turns: [
      { spk: "propietaria", tier: 1, variants: [
        { es: "La renta es de nueve mil al mes, sin incluir servicios.", en: "Rent is nine thousand a month, not including utilities." }
      ] },
      { spk: "propietaria", tier: 1, variants: [
        { es: "El contrato mínimo es de un año. ¿Le funciona?", en: "The minimum lease is one year. Does that work for you?" }
      ] },
      { spk: "propietaria", tier: 0, variants: [
        { es: "Perfecto, entonces le mando el contrato por correo.", en: "Perfect, then I'll send you the contract by email." }
      ] }
    ],
    requiredInfo: [
      { key: "rent", patterns: [/cu[aá]nto es la renta/i, /cu[aá]nto cuesta/i, /precio/i] },
      { key: "utilities", patterns: [/servicios/i, /luz|agua|gas/i, /incluye/i] },
      { key: "lease-length", patterns: [/contrato/i, /por cu[aá]nto tiempo/i, /a[ñn]o/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 1, chance: 0.3, type: "clarification", es: "Perdón, ¿me pregunta por el contrato o por el depósito?", en: "Sorry, are you asking about the contract or the deposit?" }
    ],
    outcomes: {
      success: { es: "Sales con toda la información clara y lista para decidir.", en: "You leave with all the information clear and ready to decide.", tag: "confident" },
      partial: { es: "Sales con la mayoría de la información, pero sin estar segura de los servicios.", en: "You leave with most of the information, but unsure about the utilities.", tag: "mixed" },
      fail: { es: "Sales sin saber ni el precio final ni el tiempo del contrato.", en: "You leave not knowing either the final price or the lease length.", tag: "confused" }
    }
  },
  {
    id: "housing_maintenance_issue", category: "housing", subcategory: "maintenance",
    title: "Reporting a Maintenance Issue", level: "novice-high",
    goal: "Explain what's broken in your apartment and when you're available for a repair visit.",
    speakers: [{ id: "encargado", name: "Don Poncho", role: "encargado del edificio 🔧" }],
    openingLines: [
      { spk: "encargado", es: "¿Bueno? Habla el encargado, dígame.", en: "Hello? This is the building manager, go ahead." }
    ],
    turns: [
      { spk: "encargado", tier: 0, variants: [
        { es: "Ah, ya veo. ¿Desde cuándo tiene ese problema?", en: "Ah, I see. Since when have you had that problem?" }
      ] },
      { spk: "encargado", tier: 1, variants: [
        { es: "Puedo pasar mañana en la tarde, ¿le queda bien?", en: "I can stop by tomorrow afternoon, does that work for you?" }
      ] },
      { spk: "encargado", tier: 0, variants: [
        { es: "Listo, ahí lo veo mañana entonces.", en: "Great, I'll see you tomorrow then." }
      ] }
    ],
    requiredInfo: [
      { key: "problem", patterns: [/no funciona/i, /se descompuso/i, /est[aá] roto/i, /gotea/i, /no (prende|calienta)/i] },
      { key: "duration", patterns: [/desde (ayer|hace)/i, /hace \w+ d[ií]as?/i] },
      { key: "availability", patterns: [/me queda bien/i, /puedo (a|en) la/i, /ma[ñn]ana/i, /esta tarde/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "misunderstanding", es: "¿Cómo dijo? Se escucha mal la llamada.", en: "What did you say? The call is coming through badly." }
    ],
    outcomes: {
      success: { es: "El encargado entiende bien el problema y agenda la visita sin contratiempos.", en: "The manager understands the problem well and schedules the visit with no trouble.", tag: "confident" },
      partial: { es: "Agenda una visita, pero para una fecha más lejana de la que hubieras querido.", en: "He schedules a visit, but for a later date than you would have wanted.", tag: "mixed" },
      fail: { es: "Entre la mala llamada y la explicación confusa, el encargado no capta bien qué está fallando.", en: "Between the bad call and the confusing explanation, the manager doesn't quite grasp what's wrong.", tag: "confused" }
    }
  },
  {
    id: "housing_negotiate_lease", category: "housing", subcategory: "lease-terms",
    title: "Negotiating Rent and Lease Terms", level: "intermediate-mid",
    goal: "Negotiate the rent price or ask for changes to the lease terms.",
    speakers: [{ id: "propietario", name: "Sr. Villanueva", role: "propietario 🏠" }],
    openingLines: [
      { spk: "propietario", es: "Bueno, ¿ya decidió si le interesa el departamento?", en: "So, have you decided if you're interested in the apartment?" }
    ],
    turns: [
      { spk: "propietario", tier: 2, variants: [
        { es: "Entiendo, pero es un precio justo para la zona. Le puedo bajar quinientos, no más.", en: "I understand, but it's a fair price for the area. I can lower it five hundred, no more." }
      ] },
      { spk: "propietario", tier: 1, variants: [
        { es: "Sobre el depósito, eso sí es negociable — le puedo pedir uno solo en vez de dos.", en: "About the deposit, that's negotiable — I can ask for just one instead of two." }
      ] },
      { spk: "propietario", tier: 1, variants: [
        { es: "De acuerdo, entonces quedamos así. Le preparo el contrato.", en: "Alright, then we're agreed. I'll prepare the contract." }
      ] }
    ],
    requiredInfo: [
      { key: "counter", patterns: [/es mucho/i, /muy caro/i, /le puedo (pagar|dar|ofrecer)/i, /bajarle/i] },
      { key: "term-ask", patterns: [/dep[oó]sito/i, /contrato/i, /meses/i, /condiciones/i] },
      { key: "agreement", patterns: [/de acuerdo/i, /me parece bien/i, /aceptamos/i, /trato/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "interruption", es: "Espere, antes de seguir — ¿usted trabaja de planta o es independiente?", en: "Wait, before we continue — are you a full-time employee or self-employed?" }
    ],
    outcomes: {
      success: { es: "Llegan a un acuerdo justo para ambos y quedan en firmar el contrato pronto.", en: "You reach an agreement that's fair for both, and plan to sign the contract soon.", tag: "confident" },
      partial: { es: "Bajan un poco el precio, aunque no tanto como hubieras querido.", en: "They lower the price a little, though not as much as you'd have liked.", tag: "mixed" },
      fail: { es: "La negociación no avanza y el propietario se queda con el precio original.", en: "The negotiation doesn't move and the landlord sticks with the original price.", tag: "confused" }
    }
  },

  // ================= BANKING =================
  {
    id: "banking_open_account", category: "banking", subcategory: "accounts",
    title: "Opening a Bank Account", level: "intermediate-low",
    goal: "Tell the bank employee what type of account you want and provide your information.",
    speakers: [{ id: "ejecutiva", name: "Lic. Paredes", role: "ejecutiva bancaria 🏦" }],
    openingLines: [
      { spk: "ejecutiva", es: "Buenas, ¿qué tipo de cuenta le interesa abrir?", en: "Hi, what type of account are you interested in opening?" }
    ],
    turns: [
      { spk: "ejecutiva", tier: 1, variants: [
        { es: "Perfecto. ¿Me puede proporcionar una identificación y un comprobante de domicilio?", en: "Perfect. Can you provide an ID and proof of address?" }
      ] },
      { spk: "ejecutiva", tier: 1, variants: [
        { es: "¿Le interesa también una tarjeta de débito con la cuenta?", en: "Are you also interested in a debit card with the account?" }
      ] },
      { spk: "ejecutiva", tier: 0, variants: [
        { es: "Listo, su cuenta queda abierta. La tarjeta llega en cinco días hábiles.", en: "Done, your account is open. The card arrives in five business days." }
      ] }
    ],
    requiredInfo: [
      { key: "account-type", patterns: [/cuenta de (ahorro|cheques|débito)/i, /una cuenta/i] },
      { key: "documents", patterns: [/identificaci[oó]n/i, /credencial/i, /comprobante de domicilio/i, /aqu[ií] (la |lo )?tengo/i] },
      { key: "confirm", patterns: [/s[ií],? (por favor|claro)/i, /no, gracias/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "clarification", es: "Disculpe, ¿me puede repetir qué tipo de cuenta busca?", en: "Sorry, can you repeat what type of account you're looking for?" }
    ],
    outcomes: {
      success: { es: "Sales del banco con tu cuenta abierta y toda la documentación en orden.", en: "You leave the bank with your account open and all the paperwork in order.", tag: "confident" },
      partial: { es: "Abren la cuenta, pero tienes que regresar otro día con un documento que faltó.", en: "They open the account, but you have to come back another day with a document that was missing.", tag: "mixed" },
      fail: { es: "Sin quedar claro qué tipo de cuenta querías, la ejecutiva te pide regresar con más información.", en: "Without it being clear what type of account you wanted, the banker asks you to come back with more information.", tag: "confused" }
    }
  },
  {
    id: "banking_lost_card", category: "banking", subcategory: "fraud",
    title: "Reporting a Lost or Stolen Card", level: "intermediate-mid",
    goal: "Report your card as lost or stolen and ask for a replacement.",
    speakers: [{ id: "representante", name: "Mónica", role: "representante telefónica ☎️" }],
    openingLines: [
      { spk: "representante", es: "Banco Nacional, buenas tardes, ¿en qué le puedo ayudar?", en: "National Bank, good afternoon, how can I help you?" }
    ],
    turns: [
      { spk: "representante", tier: 2, variants: [
        { es: "Entiendo, vamos a bloquear la tarjeta de inmediato. ¿Notó algún cargo que no reconozca?", en: "I understand, we'll block the card right away. Did you notice any charge you don't recognize?" }
      ] },
      { spk: "representante", tier: 1, variants: [
        { es: "Le voy a enviar una tarjeta nueva a su domicilio registrado. Llega en tres a cinco días.", en: "I'll send a new card to your registered address. It arrives in three to five days." }
      ] },
      { spk: "representante", tier: 1, variants: [
        { es: "Listo, ya quedó todo procesado. ¿Necesita algo más?", en: "Done, everything's processed. Do you need anything else?" }
      ] }
    ],
    requiredInfo: [
      { key: "report", patterns: [/se me perdi[oó]/i, /me robaron/i, /perd[ií] mi tarjeta/i, /no encuentro mi tarjeta/i] },
      { key: "unusual-charge", patterns: [/cargo/i, /no reconozco/i, /no fui yo/i, /no hab[ií]a cargos/i] },
      { key: "closing", patterns: [/gracias/i, /nada m[aá]s/i, /eso ser[ií]a todo/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "clarification", es: "Perdón, ¿me confirma su nombre completo tal como aparece en la cuenta?", en: "Sorry, can you confirm your full name as it appears on the account?" }
    ],
    outcomes: {
      success: { es: "La tarjeta queda bloqueada de inmediato y una nueva va en camino.", en: "The card is blocked immediately and a new one is on its way.", tag: "confident" },
      partial: { es: "Bloquean la tarjeta, pero quedas con dudas sobre si algún cargo raro se reembolsará.", en: "They block the card, but you're left unsure whether a strange charge will be refunded.", tag: "mixed" },
      fail: { es: "Sin confirmar bien tu identidad, la representante no puede completar el reporte hoy.", en: "Without confirming your identity well, the representative can't complete the report today.", tag: "confused" }
    }
  },
  {
    id: "banking_send_money", category: "banking", subcategory: "remittances",
    title: "Sending Money at a Remittance Counter", level: "novice-high",
    goal: "Send money to a family member and confirm the fee and delivery time.",
    speakers: [{ id: "cajero", name: "Sr. Uribe", role: "cajero 💵" }],
    openingLines: [
      { spk: "cajero", es: "Buenas, ¿a dónde va a enviar el dinero?", en: "Hi, where are you sending the money to?" }
    ],
    turns: [
      { spk: "cajero", tier: 0, variants: [
        { es: "¿Cuánto quiere enviar?", en: "How much do you want to send?" }
      ] },
      { spk: "cajero", tier: 1, variants: [
        { es: "La comisión es de ochenta pesos, y llega en menos de una hora.", en: "The fee is eighty pesos, and it arrives in under an hour." }
      ] },
      { spk: "cajero", tier: 0, variants: [
        { es: "Listo, aquí tiene su comprobante.", en: "Done, here's your receipt." }
      ] }
    ],
    requiredInfo: [
      { key: "destination", patterns: [/a m[eé]xico/i, /a mi (mam[aá]|familia)/i, /para/i] },
      { key: "amount", patterns: [/quiero enviar/i, /pesos/i, /d[oó]lares/i, /\d+/] },
      { key: "fee-question", patterns: [/comisi[oó]n/i, /cu[aá]nto cobra/i, /cu[aá]nto tarda/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "misunderstanding", es: "Perdón, ¿dijo México o Estados Unidos?", en: "Sorry, did you say Mexico or the United States?" }
    ],
    outcomes: {
      success: { es: "El envío queda hecho con la comisión y el tiempo exactos que esperabas.", en: "The transfer goes through with exactly the fee and time you expected.", tag: "confident" },
      partial: { es: "El dinero se envía, aunque la comisión resulta más alta de lo que pensabas.", en: "The money is sent, though the fee turns out higher than you thought.", tag: "mixed" },
      fail: { es: "Por la confusión con el destino, el cajero tiene que empezar de nuevo todo el trámite.", en: "Because of the confusion about the destination, the cashier has to start the whole process over.", tag: "confused" }
    }
  },

  // ================= EMERGENCIES =================
  {
    id: "emergency_stolen_wallet", category: "emergencies", subcategory: "police-report",
    title: "Filing a Police Report for a Stolen Wallet", level: "intermediate-high",
    goal: "Explain what was stolen, where, and when to file a police report.",
    speakers: [{ id: "oficial", name: "Oficial Ramos", role: "oficial de policía 👮" }],
    openingLines: [
      { spk: "oficial", es: "Buenas, ¿qué fue lo que pasó?", en: "Hello, what happened?" }
    ],
    turns: [
      { spk: "oficial", tier: 2, variants: [
        { es: "¿Dónde exactamente ocurrió, y a qué hora se dio cuenta?", en: "Where exactly did it happen, and what time did you notice?" }
      ] },
      { spk: "oficial", tier: 2, variants: [
        { es: "¿Qué llevaba la cartera, aparte del dinero — tarjetas, identificación?", en: "What was in the wallet, besides money — cards, ID?" }
      ] },
      { spk: "oficial", tier: 1, variants: [
        { es: "Bien, ya tengo todos los datos. Aquí tiene el número de su reporte.", en: "Alright, I have all the details. Here's your report number." }
      ] }
    ],
    requiredInfo: [
      { key: "theft", patterns: [/me robaron/i, /se me perdi[oó]/i, /me quitaron/i] },
      { key: "location-time", patterns: [/en el metro/i, /en la calle/i, /hace \w+ (minutos|horas)/i, /a las/i] },
      { key: "contents", patterns: [/identificaci[oó]n/i, /tarjetas/i, /dinero/i, /licencia/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "clarification", es: "No me quedó claro — ¿le robaron o se le perdió?", en: "That wasn't clear to me — was it stolen, or did you lose it?" }
    ],
    outcomes: {
      success: { es: "El oficial toma tu reporte con todos los detalles correctos, listo para el trámite del seguro.", en: "The officer takes your report with all the correct details, ready for the insurance process.", tag: "confident" },
      partial: { es: "El reporte queda hecho, aunque falta algún detalle sobre la hora exacta.", en: "The report gets filed, though some detail about the exact time is missing.", tag: "mixed" },
      fail: { es: "Sin los detalles claros, el oficial solo puede levantar un reporte genérico.", en: "Without the details being clear, the officer can only file a generic report.", tag: "confused" }
    }
  },
  {
    id: "emergency_lost_phone", category: "emergencies", subcategory: "lost-item",
    title: "Asking for Help After Losing Your Phone", level: "novice-high",
    goal: "Explain that you lost your phone and ask for help finding it or reporting it.",
    speakers: [{ id: "guardia", name: "Guardia Solís", role: "guardia de seguridad 🛡️" }],
    openingLines: [
      { spk: "guardia", es: "Buenas, ¿en qué le puedo ayudar?", en: "Hi, how can I help you?" }
    ],
    turns: [
      { spk: "guardia", tier: 0, variants: [
        { es: "¿Dónde cree que lo dejó, más o menos?", en: "Where do you think you left it, roughly?" }
      ] },
      { spk: "guardia", tier: 1, variants: [
        { es: "Voy a revisar si alguien lo entregó. ¿De qué color es, y de qué marca?", en: "I'll check if someone turned it in. What color is it, and what brand?" }
      ] },
      { spk: "guardia", tier: 0, variants: [
        { es: "Aquí está, alguien lo entregó hace rato. Qué suerte.", en: "Here it is, someone turned it in a while ago. Lucky you." }
      ] }
    ],
    requiredInfo: [
      { key: "problem", patterns: [/perd[ií] mi (celular|tel[eé]fono)/i, /se me qued[oó]/i, /no encuentro mi/i] },
      { key: "location", patterns: [/en el ba[ñn]o/i, /en la mesa/i, /por ah[ií]/i, /cerca de/i] },
      { key: "description", patterns: [/color/i, /marca/i, /negro|blanco|azul/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "misunderstanding", es: "Perdón, ¿perdió el celular o la cartera?", en: "Sorry, did you lose your phone or your wallet?" }
    ],
    outcomes: {
      success: { es: "El guardia encuentra tu teléfono rápido gracias a la descripción exacta que le diste.", en: "The guard finds your phone quickly thanks to the exact description you gave.", tag: "confident" },
      partial: { es: "El guardia revisa, pero tarda porque la descripción quedó algo vaga.", en: "The guard checks, but it takes a while because the description was a bit vague.", tag: "mixed" },
      fail: { es: "Sin una descripción clara, el guardia no puede confirmar si lo que encontró es tuyo.", en: "Without a clear description, the guard can't confirm whether what he found is yours.", tag: "confused" }
    }
  },
  {
    id: "emergency_traffic_accident", category: "emergencies", subcategory: "accident",
    title: "A Minor Traffic Accident", level: "advanced-low",
    goal: "Exchange information and explain what happened after a minor car accident.",
    speakers: [{ id: "otro_conductor", name: "Sra. Espinoza", role: "otra conductora 🚗" }],
    openingLines: [
      { spk: "otro_conductor", es: "¡Oiga! ¿Está bien? No lo vi venir.", en: "Hey! Are you okay? I didn't see you coming." }
    ],
    turns: [
      { spk: "otro_conductor", tier: 2, variants: [
        { es: "Tiene razón, fue mi culpa, se me pasó el alto. ¿Llamamos al seguro?", en: "You're right, it was my fault, I missed the stop sign. Should we call insurance?" }
      ] },
      { spk: "otro_conductor", tier: 2, variants: [
        { es: "Aquí tiene mi número de póliza y mi teléfono. ¿Me da los suyos también?", en: "Here's my policy number and my phone. Can I get yours too?" }
      ] },
      { spk: "otro_conductor", tier: 1, variants: [
        { es: "Perdón otra vez por todo esto. Que tenga buen día, a pesar del susto.", en: "Sorry again for all this. Have a good day, despite the scare." }
      ] }
    ],
    requiredInfo: [
      { key: "what-happened", patterns: [/se pas[oó] el alto/i, /me choc[oó]/i, /iba muy r[aá]pido/i, /no vio/i] },
      { key: "insurance-exchange", patterns: [/seguro/i, /p[oó]liza/i, /n[uú]mero de tel[eé]fono/i] },
      { key: "wellbeing", patterns: [/estoy bien/i, /no me pas[oó] nada/i, /me duele/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "interruption", es: "Espere — ¿alguien más venía en su carro? ¿Están todos bien?", en: "Wait — was anyone else in your car? Is everyone okay?" }
    ],
    outcomes: {
      success: { es: "Intercambian toda la información necesaria con calma y sin más problemas.", en: "You exchange all the necessary information calmly and with no further issues.", tag: "confident" },
      partial: { es: "Intercambian los datos principales, aunque olvidan confirmar algún detalle del seguro.", en: "You exchange the main details, though you forget to confirm some insurance detail.", tag: "mixed" },
      fail: { es: "La situación se queda confusa y terminan esperando a que llegue la policía para aclararlo todo.", en: "The situation stays confusing and you end up waiting for the police to arrive to sort it all out.", tag: "confused" }
    }
  },

  // ================= GOVERNMENT =================
  {
    id: "government_immigration_paperwork", category: "government", subcategory: "immigration",
    title: "Immigration Paperwork Office Visit", level: "advanced-low",
    goal: "Explain what type of immigration process you need and what documents you're missing.",
    speakers: [{ id: "funcionario", name: "Lic. Bravo", role: "funcionario de migración 🛂" }],
    openingLines: [
      { spk: "funcionario", es: "Buenas, ¿qué trámite viene a realizar?", en: "Hello, what process are you here to do?" }
    ],
    turns: [
      { spk: "funcionario", tier: 2, variants: [
        { es: "Entiendo. Para eso va a necesitar comprobante de domicilio y una carta de la empresa.", en: "I see. For that you'll need proof of address and a letter from the company." }
      ] },
      { spk: "funcionario", tier: 2, variants: [
        { es: "¿Trae alguno de esos documentos consigo hoy, o va a necesitar programar otra cita?", en: "Do you have any of those documents with you today, or will you need to schedule another appointment?" }
      ] },
      { spk: "funcionario", tier: 1, variants: [
        { es: "Bien, entonces le doy una cita para el próximo martes con todo completo.", en: "Alright, then I'll give you an appointment for next Tuesday with everything complete." }
      ] }
    ],
    requiredInfo: [
      { key: "process", patterns: [/visa/i, /residencia/i, /permiso de trabajo/i, /tr[aá]mite/i] },
      { key: "documents-status", patterns: [/traigo/i, /no tengo/i, /me falta/i, /aqu[ií] (lo |la )?tengo/i] },
      { key: "next-step", patterns: [/cita/i, /pr[oó]xima semana/i, /martes|lunes|mi[eé]rcoles/i, /regreso/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "clarification", es: "Disculpe, ¿me puede aclarar exactamente qué tipo de trámite necesita?", en: "Sorry, can you clarify exactly what type of process you need?" }
    ],
    outcomes: {
      success: { es: "El funcionario entiende bien tu situación y te da instrucciones claras para completar el trámite.", en: "The official understands your situation well and gives you clear instructions to complete the process.", tag: "confident" },
      partial: { es: "Te da una cita, aunque quedas con dudas sobre exactamente qué documentos llevar.", en: "He gives you an appointment, though you're left unsure exactly what documents to bring.", tag: "mixed" },
      fail: { es: "Sin quedar claro el trámite, el funcionario te manda a otra ventanilla a empezar de nuevo.", en: "Without the process being clear, the official sends you to another window to start over.", tag: "confused" }
    }
  },
  {
    id: "government_license_renewal", category: "government", subcategory: "licenses",
    title: "Renewing a License at a Government Office", level: "intermediate-mid",
    goal: "Ask what's needed to renew your license and confirm the cost and wait time.",
    speakers: [{ id: "empleada", name: "Sra. Fuentes", role: "empleada de gobierno 🏛️" }],
    openingLines: [
      { spk: "empleada", es: "Buenas, tome su turno. ¿Qué trámite necesita?", en: "Hi, take your ticket. What process do you need?" }
    ],
    turns: [
      { spk: "empleada", tier: 1, variants: [
        { es: "Necesita su licencia vencida, una identificación, y comprobante de domicilio.", en: "You need your expired license, an ID, and proof of address." }
      ] },
      { spk: "empleada", tier: 1, variants: [
        { es: "El costo es de setecientos pesos, y se tarda como cuarenta minutos.", en: "The cost is seven hundred pesos, and it takes about forty minutes." }
      ] },
      { spk: "empleada", tier: 0, variants: [
        { es: "Perfecto, pase a la ventanilla tres a pagar.", en: "Perfect, go to window three to pay." }
      ] }
    ],
    requiredInfo: [
      { key: "process", patterns: [/renovar/i, /licencia/i, /vencida?/i] },
      { key: "cost", patterns: [/cu[aá]nto cuesta/i, /precio/i, /pesos/i] },
      { key: "time", patterns: [/cu[aá]nto tarda/i, /cu[aá]nto tiempo/i, /minutos/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "multiQuestion", es: "A ver, dos cosas: ¿trae ya sus documentos, y ya sacó su turno?", en: "Let's see, two things: do you already have your documents, and did you already get your number?" }
    ],
    outcomes: {
      success: { es: "Sales del trámite con toda la información clara y lista para pagar y completarlo.", en: "You leave the process with everything clear and ready to pay and finish it.", tag: "confident" },
      partial: { es: "Consigues la mayoría de la información, aunque no estás segura del costo exacto.", en: "You get most of the information, though you're not sure of the exact cost.", tag: "mixed" },
      fail: { es: "Entre las dos preguntas a la vez, se te olvida confirmar qué documentos te faltan.", en: "Between the two questions at once, you forget to confirm which documents you're missing.", tag: "confused" }
    }
  },
  {
    id: "government_required_documents", category: "government", subcategory: "documents",
    title: "Asking What Documents a Process Requires", level: "intermediate-low",
    goal: "Ask a government clerk exactly which documents you need before starting a process.",
    speakers: [{ id: "recepcionista_gob", name: "Sr. Camacho", role: "recepcionista 🏛️" }],
    openingLines: [
      { spk: "recepcionista_gob", es: "Buenas, ¿en qué le puedo ayudar?", en: "Hello, how can I help you?" }
    ],
    turns: [
      { spk: "recepcionista_gob", tier: 1, variants: [
        { es: "Para eso necesita su acta de nacimiento y una identificación oficial.", en: "For that you need your birth certificate and an official ID." }
      ] },
      { spk: "recepcionista_gob", tier: 1, variants: [
        { es: "¿Ya los trae, o necesita saber dónde sacarlos?", en: "Do you already have them, or do you need to know where to get them?" }
      ] },
      { spk: "recepcionista_gob", tier: 0, variants: [
        { es: "Perfecto, con eso puede hacer el trámite hoy mismo.", en: "Perfect, with that you can do the process today." }
      ] }
    ],
    requiredInfo: [
      { key: "question", patterns: [/qu[eé] documentos/i, /qu[eé] necesito/i, /qu[eé] papeles/i] },
      { key: "have-status", patterns: [/s[ií] (lo |la |los )?(traigo|tengo)/i, /no (lo |la )?tengo/i, /d[oó]nde (lo |la )?saco/i] },
      { key: "thanks", patterns: [/gracias/i, /perfecto/i] }
    ],
    unexpectedEvents: [
      { afterTurn: 0, chance: 0.3, type: "clarification", es: "¿Me puede decir de nuevo para qué trámite es exactamente?", en: "Can you tell me again exactly what process this is for?" }
    ],
    outcomes: {
      success: { es: "Sales sabiendo exactamente qué necesitas y listo para volver con todo completo.", en: "You leave knowing exactly what you need and ready to come back with everything complete.", tag: "confident" },
      partial: { es: "Sales con la lista general, aunque no del todo seguro de dónde conseguir un documento.", en: "You leave with the general list, though not entirely sure where to get one document.", tag: "mixed" },
      fail: { es: "Sin quedar claro el trámite exacto, sales con información que no aplica a tu caso.", en: "Without the exact process being clear, you leave with information that doesn't apply to your case.", tag: "confused" }
    }
  }
];

export function scenariosByCategory(categoryId) {
  return SCENARIOS.filter((s) => s.category === categoryId);
}

export function scenarioById(id) {
  return SCENARIOS.find((s) => s.id === id) || null;
}
