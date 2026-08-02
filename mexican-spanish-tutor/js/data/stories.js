// STORY MODE — graded mini-stories built from vocabulary taught elsewhere
// in the app, shown paragraph by paragraph (Spanish/English), followed by a
// vocab review, comprehension questions, speaking questions, and a
// retelling prompt.

export const STORIES = [
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
    retelling: "Retell this story fully in the past (mixing preterite and imperfect), then add one sentence of present-day reflection, mirroring ACTFL Advanced Low's expectation of narrating across time frames." }
];
