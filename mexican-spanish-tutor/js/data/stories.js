// STORY MODE — graded mini-stories built from vocabulary taught elsewhere
// in the app, shown paragraph by paragraph (Spanish/English), followed by a
// vocab review, comprehension questions, speaking questions, and a
// retelling prompt.

const RAW_STORIES = [
  { id: "st01", title: "My Day", titleEs: "Mi día", level: "novice-mid",
    paragraphs: [
      { es: "Todos los días me despierto a las seis y media.", en: "Every day I wake up at 6:30." },
      { es: "Me baño, desayuno un café y salgo para el trabajo.", en: "I shower, have a coffee for breakfast, and head out to work." },
      { es: "Trabajo en una oficina hasta las seis de la tarde.", en: "I work at an office until 6pm." },
      { es: "Después del trabajo, hago ejercicio o camino un rato.", en: "After work, I exercise or go for a walk." },
      { es: "Ceno con mi familia como a las ocho.", en: "I have dinner with my family around 8." },
      { es: "Me acuesto a las once, cansado pero contento.", en: "I go to bed at 11, tired but happy." }
    ],
    vocabReview: [{ w: "despertarse", en: "to wake up" }, { w: "salir para el trabajo", en: "to head out to work" }, { w: "hacer ejercicio", en: "to exercise" }, { w: "acostarse", en: "to go to bed" }],
    comprehension: [
      { q: "What time does the narrator wake up?", a: "A las seis y media (6:30)." },
      { q: "What do they do after work?", a: "Hacen ejercicio o caminan un rato." },
      { q: "Who do they have dinner with?", a: "Con su familia." }
    ],
    speakingQuestions: ["¿A qué hora te despiertas normalmente?", "¿Qué haces después del trabajo o de la escuela?", "¿Con quién cenas normalmente?"],
    retelling: "Retell this story in your own words, in the present tense, using at least four verbs from the vocab review." },

  { id: "st02", title: "My Family", titleEs: "Mi familia", level: "novice-mid",
    paragraphs: [
      { es: "Somos cinco en mi familia: mis papás, mi hermano, mi hermana y yo.", en: "There are five of us in my family: my parents, my brother, my sister, and me." },
      { es: "Mi papá es taxista y trabaja muchas horas.", en: "My dad is a taxi driver and works a lot of hours." },
      { es: "Mi mamá es maestra en una primaria.", en: "My mom is a teacher at an elementary school." },
      { es: "Mi hermano mayor estudia ingeniería en la universidad.", en: "My older brother studies engineering at university." },
      { es: "Mi hermana menor todavía está en la prepa.", en: "My younger sister is still in high school." },
      { es: "Los domingos nos juntamos todos a comer en casa de mis abuelos.", en: "On Sundays we all get together to eat at my grandparents' house." }
    ],
    vocabReview: [{ w: "los papás", en: "the parents" }, { w: "hermano mayor / menor", en: "older/younger brother" }, { w: "la universidad", en: "university" }, { w: "juntarse", en: "to get together" }],
    comprehension: [
      { q: "What does the narrator's mom do?", a: "Es maestra en una primaria." },
      { q: "What is the older brother studying?", a: "Ingeniería." },
      { q: "Where does the family gather on Sundays?", a: "En casa de sus abuelos." }
    ],
    speakingQuestions: ["¿Cuántas personas hay en tu familia?", "¿A qué se dedican tus papás?", "¿Se juntan seguido con la familia extendida?"],
    retelling: "Describe your own family using the same structure: how many, what they do, and a weekly tradition." },

  { id: "st03", title: "A Trip to the Market", titleEs: "Una vuelta al mercado", level: "novice-high",
    paragraphs: [
      { es: "Los sábados me gusta ir al mercado por fruta y verdura fresca.", en: "On Saturdays I like to go to the market for fresh fruit and vegetables." },
      { es: "Siempre saludo a doña Lupe, la señora que vende chiles y tomates.", en: "I always greet doña Lupe, the lady who sells chiles and tomatoes." },
      { es: "Ese día se me antojó comprar un elote con todo.", en: "That day I got a craving to buy an elote with everything on it." },
      { es: "También compré tortillas recién hechas, todavía calientitas.", en: "I also bought freshly-made tortillas, still nice and warm." },
      { es: "Al final, gasté como doscientos pesos en total.", en: "In the end, I spent about 200 pesos total." },
      { es: "Regresé a casa contento con mis bolsas llenas.", en: "I went back home happy with my bags full." }
    ],
    vocabReview: [{ w: "el mercado", en: "the market" }, { w: "antojarse", en: "to crave" }, { w: "recién hecho", en: "freshly made" }, { w: "gastar", en: "to spend (money)" }],
    comprehension: [
      { q: "What does the narrator buy besides fruit and vegetables?", a: "Un elote y tortillas recién hechas." },
      { q: "Roughly how much did they spend?", a: "Como doscientos pesos." }
    ],
    speakingQuestions: ["¿Te gusta ir al mercado o prefieres el supermercado?", "¿Qué se te antoja comer ahorita?"],
    retelling: "Retell a real or imagined trip to a market or grocery store, in the past tense." },

  { id: "st04", title: "A Complicated Day", titleEs: "Un día complicado", level: "intermediate-mid",
    paragraphs: [
      { es: "Ayer tuve un día bastante complicado.", en: "Yesterday I had a pretty complicated day." },
      { es: "Salí tarde de mi casa porque no sonó el despertador.", en: "I left home late because my alarm didn't go off." },
      { es: "Mientras manejaba al trabajo, se me descompuso el carro en plena avenida.", en: "While I was driving to work, my car broke down right in the middle of the avenue." },
      { es: "No sabía qué hacer, así que llamé a una grúa y esperé casi una hora.", en: "I didn't know what to do, so I called a tow truck and waited almost an hour." },
      { es: "Llegué al trabajo súper tarde, pero mi jefa lo entendió sin problema.", en: "I got to work super late, but my boss understood without any problem." },
      { es: "Al final, todo se resolvió, aunque fue un día para el recuerdo.", en: "In the end, everything got resolved, even though it was a day to remember." }
    ],
    vocabReview: [{ w: "descomponerse", en: "to break down" }, { w: "la grúa", en: "tow truck" }, { w: "resolverse", en: "to get resolved" }, { w: "aunque", en: "although" }],
    comprehension: [
      { q: "Why did the narrator leave home late?", a: "Porque no sonó el despertador." },
      { q: "What happened on the way to work?", a: "Se le descompuso el carro." },
      { q: "How did the boss react?", a: "Lo entendió sin problema." }
    ],
    speakingQuestions: ["Cuéntame de un día complicado que hayas tenido.", "¿Cómo reaccionas cuando algo sale mal de repente?"],
    retelling: "Narrate your own 'complicated day' story, mixing preterite (what happened) and imperfect (background) verbs." },

  { id: "st05", title: "Growing Up on the Ranch", titleEs: "Creciendo en el rancho", level: "advanced-low",
    paragraphs: [
      { es: "Cuando era niño, pasaba los veranos en el rancho de mis abuelos, en un pueblito de Jalisco.", en: "When I was a kid, I used to spend summers at my grandparents' ranch, in a small town in Jalisco." },
      { es: "Nos levantábamos muy temprano, antes de que saliera el sol, para ayudar con los animales.", en: "We used to get up very early, before the sun came out, to help with the animals." },
      { es: "Recuerdo que mi abuelo me enseñó a montar a caballo cuando tenía solo seis años.", en: "I remember my grandfather taught me to ride a horse when I was only six." },
      { es: "Un verano, se soltó una tormenta enorme y tuvimos que refugiarnos todos en el granero.", en: "One summer, a huge storm broke out and we all had to take shelter in the barn." },
      { es: "Esa experiencia me marcó, porque entendí lo duro que era realmente ese trabajo.", en: "That experience shaped me, because I understood how hard that work really was." },
      { es: "Hoy en día, aunque vivo en la ciudad, cada vez que llueve fuerte me acuerdo de esa tarde en el rancho.", en: "Nowadays, although I live in the city, whenever it rains hard I remember that afternoon at the ranch." }
    ],
    vocabReview: [{ w: "el rancho", en: "the ranch" }, { w: "montar a caballo", en: "to ride a horse" }, { w: "refugiarse", en: "to take shelter" }, { w: "marcar (a alguien)", en: "to leave a mark on (someone), to shape" }],
    comprehension: [
      { q: "Who taught the narrator to ride a horse, and at what age?", a: "Su abuelo, cuando tenía seis años." },
      { q: "What happened during one summer storm?", a: "Tuvieron que refugiarse en el granero." },
      { q: "How did that experience affect the narrator?", a: "Le hizo entender lo duro que era el trabajo del rancho; hoy se acuerda cada vez que llueve fuerte." }
    ],
    speakingQuestions: ["Cuéntame una historia de tu niñez que te haya marcado.", "¿Hay algo del pasado que recuerdes cada vez que pasa algo específico hoy en día (como la lluvia)?", "En tu opinión, ¿por qué es importante recordar experiencias así?"],
    retelling: "Retell this story fully in the past (mixing preterite and imperfect), then add one sentence of present-day reflection, mirroring ACTFL Advanced Low's expectation of narrating across time frames." },

  { id: "st06", title: "Hello, I'm Ana", titleEs: "Hola, soy Ana", level: "novice-low",
    paragraphs: [
      { es: "Hola. Me llamo Ana.", en: "Hello. My name is Ana." },
      { es: "Soy de México.", en: "I'm from Mexico." },
      { es: "Tengo veinte años.", en: "I'm twenty years old." },
      { es: "Mi color favorito es el azul.", en: "My favorite color is blue." },
      { es: "Tengo un perro. Se llama Max.", en: "I have a dog. His name is Max." },
      { es: "Mucho gusto.", en: "Nice to meet you." }
    ],
    vocabReview: [{ w: "me llamo", en: "my name is" }, { w: "soy de", en: "I'm from" }, { w: "tengo", en: "I have / I am (with age)" }, { w: "mucho gusto", en: "nice to meet you" }],
    comprehension: [
      { q: "What is her name?", a: "Ana." },
      { q: "Where is she from?", a: "De México." },
      { q: "What animal does she have?", a: "Un perro, Max." }
    ],
    speakingQuestions: ["¿Cómo te llamas?", "¿De dónde eres?", "¿Cuántos años tienes?"],
    retelling: "Say the same six things about yourself, one short sentence at a time." },

  { id: "st07", title: "Looking for the Bus", titleEs: "Buscando el camión", level: "intermediate-low",
    paragraphs: [
      { es: "El lunes pasado salí de mi casa muy tarde.", en: "Last Monday I left my house very late." },
      { es: "Necesitaba llegar al centro antes de las nueve.", en: "I needed to get downtown before nine." },
      { es: "Le pregunté a una señora dónde estaba la parada del camión.", en: "I asked a woman where the bus stop was." },
      { es: "Ella me dijo que caminara dos cuadras y diera vuelta a la derecha.", en: "She told me to walk two blocks and turn right." },
      { es: "Cuando llegué, el camión ya se había ido.", en: "When I got there, the bus had already left." },
      { es: "Al final tomé un taxi y llegué solo diez minutos tarde.", en: "In the end I took a taxi and arrived only ten minutes late." }
    ],
    vocabReview: [{ w: "la parada del camión", en: "the bus stop (camión = bus in Mexico)" }, { w: "dar vuelta", en: "to turn" }, { w: "la cuadra", en: "the block" }, { w: "al final", en: "in the end" }],
    comprehension: [
      { q: "Why was the narrator in a hurry?", a: "Necesitaba llegar al centro antes de las nueve." },
      { q: "What directions did the woman give?", a: "Caminar dos cuadras y dar vuelta a la derecha." },
      { q: "How did the narrator finally get there?", a: "En taxi, diez minutos tarde." }
    ],
    speakingQuestions: ["Cuéntame de una vez que llegaste tarde a algo.", "¿Cómo te mueves normalmente en tu ciudad?", "¿Alguna vez le has pedido direcciones a un desconocido?"],
    retelling: "Retell it in the past tense, and add one sentence saying what you would do differently." },

  { id: "st08", title: "The Argument About the Party", titleEs: "El pleito por la fiesta", level: "intermediate-high",
    paragraphs: [
      { es: "Mi hermana quería hacer una fiesta enorme para el cumpleaños de mi mamá.", en: "My sister wanted to throw a huge party for my mom's birthday." },
      { es: "Yo le dije que sería mejor algo pequeño, porque a mi mamá no le gusta ser el centro de atención.", en: "I told her something small would be better, because my mom doesn't like being the center of attention." },
      { es: "Discutimos casi una semana entera sin ponernos de acuerdo.", en: "We argued for almost a whole week without reaching an agreement." },
      { es: "Al final decidimos invitar solo a la familia y a cuatro amigas suyas.", en: "In the end we decided to invite only family and four of her friends." },
      { es: "Mi mamá lloró cuando entró y vio a todos esperándola.", en: "My mom cried when she walked in and saw everyone waiting for her." },
      { es: "Creo que si hubiéramos hecho la fiesta grande, no habría disfrutado igual.", en: "I think if we had thrown the big party, she wouldn't have enjoyed it the same way." }
    ],
    vocabReview: [{ w: "el pleito", en: "the argument, the quarrel (very common in Mexico)" }, { w: "ponerse de acuerdo", en: "to reach an agreement" }, { w: "el centro de atención", en: "the center of attention" }, { w: "disfrutar", en: "to enjoy" }],
    comprehension: [
      { q: "What did the sister want?", a: "Una fiesta enorme para el cumpleaños de su mamá." },
      { q: "Why did the narrator disagree?", a: "Porque a su mamá no le gusta ser el centro de atención." },
      { q: "What did they end up doing?", a: "Invitaron solo a la familia y a cuatro amigas." }
    ],
    speakingQuestions: ["Cuéntame de un desacuerdo que hayas tenido con alguien de tu familia.", "¿Prefieres las fiestas grandes o las reuniones pequeñas? ¿Por qué?", "¿Crees que fue la decisión correcta? Explica."],
    retelling: "Retell the disagreement from your sister's point of view, defending her position." }
];

// Ordered low → high so Story Mode always reads as a ladder, regardless of
// the order stories were authored in. Stable sort keeps within-level order.
const LEVEL_ORDER = [
  "novice-low", "novice-mid", "novice-high",
  "intermediate-low", "intermediate-mid", "intermediate-high", "advanced-low"
];
export const STORIES = RAW_STORIES
  .slice()
  .sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));
