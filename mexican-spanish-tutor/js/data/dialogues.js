// 16 realistic Mexican Spanish dialogues. `scenario` doubles as the tag used
// by both the Dialogues library (read/listen/comprehension) and Roleplay
// Mode (interactive spoken practice) — see ROLEPLAY MODE in the spec:
// restaurant, airport, hotel, store, doctor, job interview, meeting new
// friends, dating, travel, family gathering — plus everyday-life scenarios
// from FREQUENCY PRIORITY (greetings, food, directions, work).

export const DIALOGUES = [
  { id: "d01", title: "Meeting Someone New", titleEs: "Conociendo a alguien nuevo", level: "novice-low", scenario: "meeting-friends",
    lines: [
      { spk: "A", es: "¡Hola! ¿Qué onda? Soy Ana.", en: "Hi! What's up? I'm Ana." },
      { spk: "B", es: "¡Qué onda! Yo soy Marco. Mucho gusto.", en: "Hey! I'm Marco. Nice to meet you." },
      { spk: "A", es: "Igualmente. ¿De dónde eres?", en: "Likewise. Where are you from?" },
      { spk: "B", es: "Soy de Guadalajara. ¿Y tú?", en: "I'm from Guadalajara. And you?" },
      { spk: "A", es: "Yo soy de aquí, de la Ciudad de México.", en: "I'm from here, Mexico City." },
      { spk: "B", es: "¡Qué padre! ¿Nos vemos en la fiesta el sábado?", en: "Cool! Will I see you at the party Saturday?" }
    ],
    vocabHighlights: [{ w: "qué onda", en: "what's up (slang)" }, { w: "mucho gusto", en: "nice to meet you" }, { w: "qué padre", en: "cool/awesome (Mexican slang)" }],
    comprehension: [
      { q: "Where is Marco from?", options: ["Mexico City", "Guadalajara", "Puebla"], answerIndex: 1 },
      { q: "What are they planning to do Saturday?", options: ["Study together", "Go to a party", "Go to work"], answerIndex: 1 }
    ],
    culturalNote: "¡Qué padre! is one of the most common ways to say 'cool!' or 'awesome!' in Mexico — extremely versatile and used constantly in casual speech." },

  { id: "d02", title: "Ordering Tacos", titleEs: "Pidiendo tacos", level: "novice-mid", scenario: "restaurant",
    lines: [
      { spk: "Taquero", es: "¿Qué le doy, jefe?", en: "What can I get you, boss (friendly term)?" },
      { spk: "Cliente", es: "Deme tres de pastor y uno de bistec, por favor.", en: "Give me three al pastor and one steak, please." },
      { spk: "Taquero", es: "¿Se los preparo con todo?", en: "Should I make them with everything?" },
      { spk: "Cliente", es: "Sí, con todo. Y una agua de horchata, porfa.", en: "Yes, with everything. And a horchata drink, please." },
      { spk: "Taquero", es: "Va. ¿Algo más?", en: "Got it. Anything else?" },
      { spk: "Cliente", es: "No, así está bien. ¿Cuánto le debo?", en: "No, that's it. How much do I owe you?" },
      { spk: "Taquero", es: "Son ochenta pesos.", en: "That's 80 pesos." }
    ],
    vocabHighlights: [{ w: "jefe", en: "friendly term for a customer/stranger" }, { w: "con todo", en: "with all the toppings" }, { w: "porfa", en: "please (casual contraction)" }],
    comprehension: [
      { q: "How many al pastor tacos did the customer order?", options: ["One", "Two", "Three"], answerIndex: 2 },
      { q: "How much was the total?", options: ["60 pesos", "80 pesos", "100 pesos"], answerIndex: 1 }
    ],
    culturalNote: "Street taco stands (taquerías) often address customers as 'jefe/jefa' or 'joven' as a friendly, informal courtesy — not a literal boss/job reference." },

  { id: "d03", title: "Asking for Directions Downtown", titleEs: "Preguntando cómo llegar al centro", level: "novice-mid", scenario: "travel",
    lines: [
      { spk: "A", es: "Disculpe, ¿cómo llego a la catedral?", en: "Excuse me, how do I get to the cathedral?" },
      { spk: "B", es: "Siga derecho por esta calle, unas cuatro cuadras.", en: "Go straight down this street, about four blocks." },
      { spk: "A", es: "¿Está lejos caminando?", en: "Is it far on foot?" },
      { spk: "B", es: "No, para nada, unos diez minutos nomás.", en: "No, not at all, just about 10 minutes." },
      { spk: "A", es: "Perfecto, muchas gracias.", en: "Perfect, thank you very much." },
      { spk: "B", es: "Con gusto. Que le vaya bien.", en: "You're welcome. Have a good one." }
    ],
    vocabHighlights: [{ w: "siga derecho", en: "go straight (usted command)" }, { w: "nomás", en: "just / only (colloquial)" }, { w: "con gusto", en: "you're welcome (lit. 'with pleasure')" }],
    comprehension: [
      { q: "How many blocks to the cathedral?", options: ["Two", "Four", "Six"], answerIndex: 1 },
      { q: "How is 'nomás' used here?", options: ["To mean 'never'", "To mean 'just/only'", "To mean 'again'"], answerIndex: 1 }
    ] },

  { id: "d04", title: "At the Clothing Store", titleEs: "En la tienda de ropa", level: "novice-mid", scenario: "store",
    lines: [
      { spk: "Empleada", es: "Buenas tardes, ¿le puedo ayudar en algo?", en: "Good afternoon, can I help you with something?" },
      { spk: "Cliente", es: "Sí, ando buscando una chamarra para el frío.", en: "Yes, I'm looking for a jacket for the cold." },
      { spk: "Empleada", es: "Tenemos varias por acá. ¿Qué talla usa?", en: "We have several over here. What size do you wear?" },
      { spk: "Cliente", es: "Mediana, creo. ¿Me la puedo probar?", en: "Medium, I think. Can I try it on?" },
      { spk: "Empleada", es: "Claro, el probador está al fondo.", en: "Of course, the fitting room is in the back." },
      { spk: "Cliente", es: "Le queda bien. ¿Cuánto cuesta?", en: "It fits well. How much is it?" },
      { spk: "Empleada", es: "Ochocientos pesos, pero hoy está con veinte por ciento de descuento.", en: "800 pesos, but today it's 20% off." }
    ],
    vocabHighlights: [{ w: "ando buscando", en: "I'm looking for (colloquial progressive)" }, { w: "probador", en: "fitting room" }, { w: "descuento", en: "discount" }],
    comprehension: [
      { q: "What is the customer looking for?", options: ["Shoes", "A jacket", "A shirt"], answerIndex: 1 },
      { q: "What's today's discount?", options: ["10%", "20%", "50%"], answerIndex: 1 }
    ] },

  { id: "d05", title: "Talking About Family", titleEs: "Hablando de la familia", level: "novice-high", scenario: "family-gathering",
    lines: [
      { spk: "A", es: "¿Cuántos son en tu familia?", en: "How many are in your family?" },
      { spk: "B", es: "Somos cinco: mis papás, mis dos hermanos y yo.", en: "We're five: my parents, my two siblings, and me." },
      { spk: "A", es: "¿Eres el mayor o el menor?", en: "Are you the oldest or the youngest?" },
      { spk: "B", es: "Soy el de en medio, de hecho.", en: "I'm actually the middle child." },
      { spk: "A", es: "Qué chido. ¿Se llevan bien?", en: "That's cool. Do you all get along?" },
      { spk: "B", es: "Sí, súper bien, nos juntamos cada domingo a comer.", en: "Yes, really well, we get together every Sunday to eat." }
    ],
    vocabHighlights: [{ w: "el de en medio", en: "the middle one" }, { w: "qué chido", en: "how cool (Mexican slang)" }, { w: "llevarse bien", en: "to get along" }],
    comprehension: [
      { q: "How many siblings does speaker B have?", options: ["One", "Two", "Three"], answerIndex: 1 },
      { q: "How often does the family get together?", options: ["Every Sunday", "Once a month", "Only holidays"], answerIndex: 0 }
    ],
    culturalNote: "Sunday family lunches (la comida dominical) are a deeply rooted tradition in Mexico — extended family often gathers weekly, not just on holidays." },

  { id: "d06", title: "Weekend Plans", titleEs: "Planes de fin de semana", level: "novice-high", scenario: "friends",
    lines: [
      { spk: "A", es: "¿Qué vas a hacer este finde?", en: "What are you doing this weekend?" },
      { spk: "B", es: "No sé todavía, tal vez ir al cine. ¿Tú?", en: "I don't know yet, maybe go to the movies. You?" },
      { spk: "A", es: "Voy a ir a una boda el sábado.", en: "I'm going to a wedding on Saturday." },
      { spk: "B", es: "¡Qué padre! ¿De quién?", en: "How nice! Whose?" },
      { spk: "A", es: "De mi prima. Va a estar toda la familia.", en: "My cousin's. The whole family is going to be there." },
      { spk: "B", es: "Que la pases increíble.", en: "Have an amazing time." }
    ],
    vocabHighlights: [{ w: "el finde", en: "the weekend (short for fin de semana)" }, { w: "tal vez", en: "maybe" }, { w: "que la pases increíble", en: "have an amazing time" }],
    comprehension: [
      { q: "What is speaker A doing Saturday?", options: ["Going to the movies", "Going to a wedding", "Working"], answerIndex: 1 },
      { q: "Whose wedding is it?", options: ["A cousin's", "A sibling's", "A coworker's"], answerIndex: 0 }
    ] },

  { id: "d07", title: "First Day at a New Job", titleEs: "Primer día de trabajo", level: "intermediate-low", scenario: "work",
    lines: [
      { spk: "Jefa", es: "Bienvenido al equipo. ¿Cómo te sientes?", en: "Welcome to the team. How are you feeling?" },
      { spk: "Nuevo", es: "Un poco nervioso, la verdad, pero emocionado.", en: "A bit nervous, honestly, but excited." },
      { spk: "Jefa", es: "Es normal. Cualquier duda, me preguntas.", en: "That's normal. Any questions, just ask me." },
      { spk: "Nuevo", es: "Gracias. ¿A qué hora es la comida aquí?", en: "Thanks. What time is lunch here?" },
      { spk: "Jefa", es: "Salimos a comer como a la una y media.", en: "We go out to eat around 1:30." },
      { spk: "Nuevo", es: "Perfecto, ahí estaré.", en: "Perfect, I'll be there." }
    ],
    vocabHighlights: [{ w: "el equipo", en: "the team" }, { w: "cualquier duda", en: "any question/doubt" }, { w: "la comida", en: "lunch (midday meal)" }],
    comprehension: [
      { q: "How does the new employee feel?", options: ["Confident", "Nervous but excited", "Bored"], answerIndex: 1 },
      { q: "What time do they go to lunch?", options: ["12:00", "1:30", "3:00"], answerIndex: 1 }
    ] },

  { id: "d08", title: "Checking Into a Hotel", titleEs: "Registrándose en el hotel", level: "intermediate-low", scenario: "hotel",
    lines: [
      { spk: "Recepcionista", es: "Buenas noches, bienvenido. ¿Tiene una reservación?", en: "Good evening, welcome. Do you have a reservation?" },
      { spk: "Huésped", es: "Sí, a nombre de Carlos Torres.", en: "Yes, under the name Carlos Torres." },
      { spk: "Recepcionista", es: "Aquí está, una habitación doble por tres noches.", en: "Here it is, a double room for three nights." },
      { spk: "Huésped", es: "Así es. ¿El desayuno está incluido?", en: "That's right. Is breakfast included?" },
      { spk: "Recepcionista", es: "Sí, de siete a diez en el restaurante del primer piso.", en: "Yes, from 7 to 10 in the first-floor restaurant." },
      { spk: "Huésped", es: "Excelente. ¿Me puede dar el wifi también?", en: "Excellent. Could you also give me the wifi?" },
      { spk: "Recepcionista", es: "Claro, la clave está en su llave de habitación.", en: "Of course, the password is on your room key." }
    ],
    vocabHighlights: [{ w: "a nombre de", en: "under the name of" }, { w: "habitación doble", en: "double room" }, { w: "la clave", en: "the password" }],
    comprehension: [
      { q: "How many nights is the reservation for?", options: ["One", "Two", "Three"], answerIndex: 2 },
      { q: "What time does breakfast start?", options: ["6am", "7am", "9am"], answerIndex: 1 }
    ] },

  { id: "d09", title: "At the Airport", titleEs: "En el aeropuerto", level: "intermediate-low", scenario: "airport",
    lines: [
      { spk: "Agente", es: "Buenas, ¿me permite su pasaporte y boleto?", en: "Hello, may I have your passport and ticket?" },
      { spk: "Pasajero", es: "Aquí tiene. ¿Va a salir a tiempo el vuelo?", en: "Here you go. Is the flight leaving on time?" },
      { spk: "Agente", es: "Sí, hasta ahora sin retraso. ¿Cuántas maletas factura?", en: "Yes, no delay so far. How many bags are you checking?" },
      { spk: "Pasajero", es: "Solo una. La otra la llevo de mano.", en: "Just one. The other I'm carrying on." },
      { spk: "Agente", es: "Perfecto, su puerta de abordar es la doce.", en: "Perfect, your boarding gate is 12." },
      { spk: "Pasajero", es: "Muchas gracias. ¿A qué hora empieza el abordaje?", en: "Thank you very much. What time does boarding start?" }
    ],
    vocabHighlights: [{ w: "factura", en: "to check (a bag)" }, { w: "de mano", en: "carry-on" }, { w: "el abordaje", en: "boarding" }],
    comprehension: [
      { q: "Is the flight delayed?", options: ["Yes", "No, so far", "Cancelled"], answerIndex: 1 },
      { q: "What's the boarding gate?", options: ["10", "12", "20"], answerIndex: 1 }
    ] },

  { id: "d10", title: "At the Doctor's Office", titleEs: "En el consultorio", level: "intermediate-mid", scenario: "doctor",
    lines: [
      { spk: "Doctor", es: "Buenos días, ¿qué le trae por aquí?", en: "Good morning, what brings you in?" },
      { spk: "Paciente", es: "Llevo dos días con dolor de garganta y algo de fiebre.", en: "I've had a sore throat and a bit of fever for two days." },
      { spk: "Doctor", es: "¿Le duele al tragar?", en: "Does it hurt to swallow?" },
      { spk: "Paciente", es: "Sí, bastante, y me siento muy cansado.", en: "Yes, quite a lot, and I feel very tired." },
      { spk: "Doctor", es: "Parece una infección. Le voy a recetar unos antibióticos.", en: "It looks like an infection. I'm going to prescribe some antibiotics." },
      { spk: "Paciente", es: "¿Debo tomar algo más, como para el dolor?", en: "Should I take something else, like for the pain?" },
      { spk: "Doctor", es: "Sí, un analgésico cada ocho horas y mucho líquido.", en: "Yes, a painkiller every 8 hours and lots of fluids." }
    ],
    vocabHighlights: [{ w: "dolor de garganta", en: "sore throat" }, { w: "recetar", en: "to prescribe" }, { w: "analgésico", en: "painkiller" }],
    comprehension: [
      { q: "How many days has the patient had symptoms?", options: ["One", "Two", "A week"], answerIndex: 1 },
      { q: "What does the doctor prescribe?", options: ["Only rest", "Antibiotics and a painkiller", "Surgery"], answerIndex: 1 }
    ] },

  { id: "d11", title: "A Job Interview", titleEs: "Una entrevista de trabajo", level: "intermediate-mid", scenario: "job-interview",
    lines: [
      { spk: "Entrevistador", es: "Cuénteme un poco sobre su experiencia.", en: "Tell me a bit about your experience." },
      { spk: "Candidato", es: "Llevo cinco años trabajando en atención al cliente.", en: "I've been working in customer service for five years." },
      { spk: "Entrevistador", es: "¿Por qué le interesa este puesto?", en: "Why are you interested in this position?" },
      { spk: "Candidato", es: "Busco un reto nuevo y me gusta mucho lo que hace esta empresa.", en: "I'm looking for a new challenge and I really like what this company does." },
      { spk: "Entrevistador", es: "¿Cuál considera que es su mayor fortaleza?", en: "What do you consider your greatest strength?" },
      { spk: "Candidato", es: "Me adapto rápido y trabajo bien bajo presión.", en: "I adapt quickly and work well under pressure." },
      { spk: "Entrevistador", es: "Muy bien, le avisamos en unos días.", en: "Very good, we'll let you know in a few days." }
    ],
    vocabHighlights: [{ w: "atención al cliente", en: "customer service" }, { w: "el puesto", en: "the position/job" }, { w: "fortaleza", en: "strength" }],
    comprehension: [
      { q: "How many years of experience does the candidate have?", options: ["Three", "Five", "Ten"], answerIndex: 1 },
      { q: "What's their stated strength?", options: ["Being punctual", "Adapting quickly, working under pressure", "Speaking English"], answerIndex: 1 }
    ] },

  { id: "d12", title: "A First Date", titleEs: "Una primera cita", level: "intermediate-mid", scenario: "dating",
    lines: [
      { spk: "A", es: "Qué bueno que aceptaste salir conmigo.", en: "I'm glad you agreed to go out with me." },
      { spk: "B", es: "Yo también, tenía ganas de conocerte mejor.", en: "Me too, I wanted to get to know you better." },
      { spk: "A", es: "¿Qué te gusta hacer en tu tiempo libre?", en: "What do you like to do in your free time?" },
      { spk: "B", es: "Me encanta el senderismo y también pintar.", en: "I love hiking and also painting." },
      { spk: "A", es: "Qué interesante, yo nunca he pintado nada bueno.", en: "That's interesting, I've never painted anything good." },
      { spk: "B", es: "Te puedo enseñar algún día, si quieres.", en: "I could teach you sometime, if you want." }
    ],
    vocabHighlights: [{ w: "tenía ganas de", en: "I wanted to / felt like" }, { w: "el senderismo", en: "hiking" }, { w: "algún día", en: "someday" }],
    comprehension: [
      { q: "What does speaker B enjoy?", options: ["Cooking and reading", "Hiking and painting", "Music and dancing"], answerIndex: 1 },
      { q: "What does B offer to do?", options: ["Cook for A", "Teach A to paint", "Take A hiking"], answerIndex: 1 }
    ] },

  { id: "d13", title: "Planning a Trip", titleEs: "Planeando un viaje", level: "intermediate-high", scenario: "travel",
    lines: [
      { spk: "A", es: "Estoy pensando en ir a Oaxaca el próximo mes.", en: "I'm thinking about going to Oaxaca next month." },
      { spk: "B", es: "¡Qué envidia! Yo fui hace dos años y me encantó.", en: "I'm jealous! I went two years ago and loved it." },
      { spk: "A", es: "¿Qué me recomiendas hacer allá?", en: "What do you recommend I do there?" },
      { spk: "B", es: "Tienes que probar el mole y visitar Monte Albán.", en: "You have to try the mole and visit Monte Albán." },
      { spk: "A", es: "Anotado. ¿Y para moverse por la ciudad?", en: "Noted. And for getting around the city?" },
      { spk: "B", es: "Casi todo se hace caminando, el centro es chiquito.", en: "Almost everything is done on foot, the downtown is small." },
      { spk: "A", es: "Perfecto, entonces no voy a necesitar rentar carro.", en: "Perfect, so I won't need to rent a car." }
    ],
    vocabHighlights: [{ w: "qué envidia", en: "I'm jealous (lit. 'what envy')" }, { w: "anotado", en: "noted" }, { w: "rentar", en: "to rent" }],
    comprehension: [
      { q: "What food is recommended?", options: ["Tacos", "Mole", "Pozole"], answerIndex: 1 },
      { q: "Will speaker A need to rent a car?", options: ["Yes", "No, downtown is walkable", "Not mentioned"], answerIndex: 1 }
    ] },

  { id: "d14", title: "Handling a Car Breakdown", titleEs: "Se descompuso el carro", level: "intermediate-high", scenario: "travel",
    lines: [
      { spk: "A", es: "Se me descompuso el carro a mitad del camino.", en: "My car broke down halfway there." },
      { spk: "B", es: "¡No manches! ¿Qué le pasó?", en: "No way! What happened to it?" },
      { spk: "A", es: "No sé bien, empezó a hacer un ruido raro y luego se apagó.", en: "I'm not sure, it started making a weird noise and then it shut off." },
      { spk: "B", es: "¿Ya le hablaste a una grúa?", en: "Did you already call a tow truck?" },
      { spk: "A", es: "Sí, va a tardar como una hora en llegar.", en: "Yes, it's going to take about an hour to arrive." },
      { spk: "B", es: "Qué estrés. Avísame si necesitas que pase por ti.", en: "That's so stressful. Let me know if you need me to pick you up." },
      { spk: "A", es: "Gracias, te aviso en un rato.", en: "Thanks, I'll let you know in a bit." }
    ],
    vocabHighlights: [{ w: "no manches", en: "no way! (mild Mexican exclamation)" }, { w: "la grúa", en: "tow truck" }, { w: "avísame", en: "let me know" }],
    comprehension: [
      { q: "What happened to the car?", options: ["Flat tire", "Strange noise then shut off", "Ran out of gas"], answerIndex: 1 },
      { q: "How long will the tow truck take?", options: ["10 minutes", "About an hour", "All day"], answerIndex: 1 }
    ],
    culturalNote: "¡No manches! is a very common, family-friendly Mexican exclamation of surprise ('no way!/come on!') — a softer version of a much ruder phrase." },

  { id: "d15", title: "Debating a Local Issue", titleEs: "Debatiendo un tema local", level: "advanced-low", scenario: "opinions",
    lines: [
      { spk: "A", es: "¿Qué opinas de la nueva línea del metro?", en: "What do you think of the new metro line?" },
      { spk: "B", es: "Por un lado, va a ayudar mucho con el tráfico; por otro, la construcción está afectando a los negocios locales.", en: "On one hand, it's going to help a lot with traffic; on the other, construction is affecting local businesses." },
      { spk: "A", es: "Es cierto, pero a largo plazo creo que va a valer la pena.", en: "That's true, but in the long run I think it'll be worth it." },
      { spk: "B", es: "Puede ser, aunque el problema principal es que no consultaron bien a los vecinos antes de empezar.", en: "Maybe, although the main problem is that they didn't properly consult the neighbors before starting." },
      { spk: "A", es: "Tienes razón en eso. Si lo hubieran planeado mejor, habría menos quejas.", en: "You're right about that. If they had planned it better, there would be fewer complaints." },
      { spk: "B", es: "Exacto. En resumen, la idea es buena, pero la ejecución dejó mucho que desear.", en: "Exactly. In summary, the idea is good, but the execution left a lot to be desired." }
    ],
    vocabHighlights: [{ w: "a largo plazo", en: "in the long run" }, { w: "consultar a los vecinos", en: "to consult the neighbors" }, { w: "dejar mucho que desear", en: "to leave a lot to be desired" }],
    comprehension: [
      { q: "What is speaker B's main criticism?", options: ["The cost", "Lack of consultation with neighbors", "The color of the trains"], answerIndex: 1 },
      { q: "What do both speakers agree on by the end?", options: ["The project should be cancelled", "The idea is good but poorly executed", "Nothing"], answerIndex: 1 }
    ],
    culturalNote: "This dialogue models the paragraph-length, structured argumentation (por un lado/por otro, a largo plazo, en resumen) that ACTFL Advanced Low expects for discussing abstract, civic topics." },

  { id: "d16", title: "A Sunday Family Gathering", titleEs: "Una comida familiar de domingo", level: "advanced-low", scenario: "family-gathering",
    lines: [
      { spk: "Abuela", es: "Cuéntame, mijo, ¿cómo va todo con el trabajo nuevo?", en: "Tell me, dear, how's everything going with the new job?" },
      { spk: "Nieto", es: "Pues ha sido difícil adaptarme, pero poco a poco voy agarrando el ritmo.", en: "Well it's been hard adjusting, but little by little I'm getting the hang of it." },
      { spk: "Abuela", es: "Eso siempre pasa al principio. Cuando tu abuelo cambió de trabajo, tardó meses en sentirse cómodo.", en: "That always happens at first. When your grandfather changed jobs, it took him months to feel comfortable." },
      { spk: "Nieto", es: "¿De verdad? No sabía eso.", en: "Really? I didn't know that." },
      { spk: "Abuela", es: "Sí, y mira, al final le encantó ese trabajo y se jubiló ahí veinte años después.", en: "Yes, and look, in the end he loved that job and retired there twenty years later." },
      { spk: "Nieto", es: "Eso me da esperanza. Gracias por contarme, abue.", en: "That gives me hope. Thanks for telling me, grandma." }
    ],
    vocabHighlights: [{ w: "agarrar el ritmo", en: "to get the hang of it" }, { w: "jubilarse", en: "to retire" }, { w: "abue", en: "grandma (affectionate short form)" }],
    comprehension: [
      { q: "What does the grandmother compare the grandson's situation to?", options: ["Her own first job", "The grandfather's job change", "A cooking mistake"], answerIndex: 1 },
      { q: "How did the grandfather's story end?", options: ["He quit quickly", "He grew to love it and retired there", "He got fired"], answerIndex: 1 }
    ],
    culturalNote: "This dialogue mixes past narration (fue, tardó, se jubiló) with present commentary — exactly the multi-timeframe storytelling ACTFL Advanced Low speakers are expected to produce." }
];
