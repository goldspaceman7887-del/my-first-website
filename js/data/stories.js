// STORY MODE — short graded-reading stories, Peninsular Spanish, Spain-set.
// Each story runs paragraph by paragraph with tap-to-define words (via
// core/tapword.js) and finishes with comprehension-check exercises graded
// through core/exercises.js. Levels span A1 (short present-tense sentences)
// through B2/C1 (journalistic and reflective registers with subjunctive and
// advanced connectors), so Story Mode reads as a difficulty ladder.
//
// Schema per story:
// {
//   id: string,               // unique, kebab/snake, prefixed "story_"
//   title: string,             // Spanish title, shown large on the detail page
//   level: "A1"|"A2"|"B1"|"B2"|"C1",
//   summary: string,           // short English blurb for the list card
//   paragraphs: [string, ...], // Spanish text, 3-8 paragraphs
//   comprehensionQuestions: [exercise, ...] // 3-5 objects matching the
//     core/exercises.js contract: { type, prompt, options?, answer, explanation }
// }

export const STORIES = [
  {
    id: "story_piso_madrid",
    title: "Mi piso nuevo en Madrid",
    level: "A1",
    summary: "Laura introduces her new flat in Lavapiés and her friendly neighbour Javier. Simple present tense, everyday vocabulary.",
    paragraphs: [
      "Me llamo Laura y vivo en un piso en el barrio de Lavapiés, en Madrid. El piso es pequeño pero muy bonito y tiene mucha luz.",
      "Todos los días me levanto a las ocho. Desayuno un café con leche y una tostada con tomate en la cocina.",
      "Mi vecino se llama Javier. Vive en el piso de al lado con su gato, Michi. Javier es muy simpático y siempre me saluda en la escalera.",
      "Los sábados por la mañana voy al mercado del barrio. Compro fruta, verdura y pan fresco para toda la semana.",
      "Por la tarde me gusta sentarme en la terraza de un bar con un zumo de naranja y leer un libro.",
      "Vivir en Madrid me gusta mucho. Hay mucha vida en las calles y siempre hay algo que hacer."
    ],
    comprehensionQuestions: [
      {
        type: "multiple-choice",
        prompt: "¿Dónde vive Laura?",
        options: ["En Barcelona", "En el barrio de Lavapiés, en Madrid", "En un pueblo", "En Valencia"],
        answer: "En el barrio de Lavapiés, en Madrid",
        explanation: "El primer párrafo dice: 'vivo en un piso en el barrio de Lavapiés, en Madrid'."
      },
      {
        type: "multiple-choice",
        prompt: "¿Cómo se llama el vecino de Laura?",
        options: ["Javier", "Diego", "Pablo", "Antonio"],
        answer: "Javier",
        explanation: "El texto dice: 'Mi vecino se llama Javier'."
      },
      {
        type: "fill-blank",
        prompt: "Laura desayuna un café con leche y una ___ con tomate.",
        answer: "tostada",
        explanation: "'Desayuno un café con leche y una tostada con tomate.'"
      },
      {
        type: "multiple-choice",
        prompt: "¿Qué compra Laura los sábados en el mercado?",
        options: ["Ropa", "Fruta, verdura y pan fresco", "Muebles", "Libros"],
        answer: "Fruta, verdura y pan fresco",
        explanation: "'Compro fruta, verdura y pan fresco para toda la semana.'"
      },
      {
        type: "translation",
        prompt: "Translate: 'I like to sit on the terrace with an orange juice.'",
        answer: "Me gusta sentarme en la terraza con un zumo de naranja",
        explanation: "Note zumo (Spain) rather than jugo, and terraza for a café terrace."
      }
    ]
  },
  {
    id: "story_desayuno_domingo",
    title: "El desayuno de los domingos",
    level: "A1",
    summary: "A simple family breakfast routine on a Sunday morning — great for practicing gustar and daily-life vocabulary.",
    paragraphs: [
      "Los domingos son especiales en mi casa. Toda la familia desayuna junta en la cocina.",
      "Mi madre prepara zumo de naranja natural y tostadas con mantequilla y mermelada.",
      "Mi padre hace café para todos. A mí me gusta el café con mucha leche.",
      "Mi hermano pequeño siempre quiere cereales con leche fría.",
      "Después del desayuno, hablamos de la semana y hacemos planes para el domingo.",
      "Algunos domingos vamos al parque; otros domingos nos quedamos en casa viendo la televisión."
    ],
    comprehensionQuestions: [
      {
        type: "multiple-choice",
        prompt: "¿Qué prepara la madre para desayunar?",
        options: ["Cereales", "Zumo de naranja natural y tostadas", "Huevos fritos", "Sopa"],
        answer: "Zumo de naranja natural y tostadas",
        explanation: "'Mi madre prepara zumo de naranja natural y tostadas con mantequilla y mermelada.'"
      },
      {
        type: "multiple-choice",
        prompt: "¿Cómo le gusta el café a la narradora?",
        options: ["Solo", "Con mucha leche", "Con azúcar", "Frío"],
        answer: "Con mucha leche",
        explanation: "'A mí me gusta el café con mucha leche.'"
      },
      {
        type: "fill-blank",
        prompt: "Mi hermano pequeño siempre quiere ___ con leche fría.",
        answer: "cereales",
        explanation: "'Mi hermano pequeño siempre quiere cereales con leche fría.'"
      },
      {
        type: "multiple-choice",
        prompt: "¿Qué hace la familia después de desayunar?",
        options: ["Se van a trabajar", "Hablan de la semana y hacen planes", "Duermen la siesta", "Limpian la casa"],
        answer: "Hablan de la semana y hacen planes",
        explanation: "'Después del desayuno, hablamos de la semana y hacemos planes para el domingo.'"
      },
      {
        type: "translation",
        prompt: "Translate: 'On Sundays we sometimes go to the park.'",
        answer: "Los domingos a veces vamos al parque",
        explanation: "'a veces' = sometimes; note the family plural 'vamos'."
      }
    ]
  },
  {
    id: "story_pueblo_fin_de_semana",
    title: "Un fin de semana en el pueblo",
    level: "A2",
    summary: "A weekend visiting grandparents in a small Castilian village — past-tense narration with village and food vocabulary.",
    paragraphs: [
      "El verano pasado fui a pasar un fin de semana al pueblo de mis abuelos, en Castilla. El pueblo se llama Sepúlveda y tiene menos de dos mil habitantes.",
      "Llegamos el viernes por la tarde en coche. Mi abuela nos esperaba en la puerta con una sonrisa enorme.",
      "El sábado por la mañana fuimos al bar del pueblo a tomar un café con churros. Todo el mundo conocía a mis abuelos y nos saludaban por la calle.",
      "Por la tarde caminamos hasta el río con mis primos. Hacía mucho calor, así que nos bañamos un rato en el agua fría.",
      "Por la noche cenamos todos juntos en el patio: tortilla de patatas, ensalada y un buen jamón.",
      "El domingo, antes de volver a Madrid, mi abuelo me enseñó su huerto. Me regaló unas patatas y unos tomates para llevar a casa.",
      "Fue un fin de semana tranquilo y muy bonito. Echo de menos la vida del pueblo cuando estoy en la ciudad."
    ],
    comprehensionQuestions: [
      {
        type: "multiple-choice",
        prompt: "¿Cómo se llama el pueblo de los abuelos?",
        options: ["Sepúlveda", "Toledo", "Ávila", "Cuenca"],
        answer: "Sepúlveda",
        explanation: "'El pueblo se llama Sepúlveda y tiene menos de dos mil habitantes.'"
      },
      {
        type: "multiple-choice",
        prompt: "¿Qué desayunaron el sábado por la mañana?",
        options: ["Tostadas", "Café con churros", "Cereales", "Zumo"],
        answer: "Café con churros",
        explanation: "'El sábado por la mañana fuimos al bar del pueblo a tomar un café con churros.'"
      },
      {
        type: "fill-blank",
        prompt: "Por la tarde caminamos hasta el ___ con mis primos.",
        answer: "río",
        explanation: "'Por la tarde caminamos hasta el río con mis primos.'"
      },
      {
        type: "error-correction",
        prompt: "Corrige el error: 'El abuelo me regaló unas patata y unos tomate.'",
        answer: "El abuelo me regaló unas patatas y unos tomates",
        explanation: "Los sustantivos deben concordar en plural con 'unas/unos': patatas, tomates."
      },
      {
        type: "translation",
        prompt: "Translate: 'It was a quiet and very nice weekend.'",
        answer: "Fue un fin de semana tranquilo y muy bonito",
        explanation: "Preterite 'fue' for a completed, bounded event."
      }
    ]
  },
  {
    id: "story_entrevista_trabajo",
    title: "La entrevista de trabajo",
    level: "A2",
    summary: "A first job interview in Madrid, told in the past tense — office vocabulary and a happy ending.",
    paragraphs: [
      "La semana pasada tuve una entrevista de trabajo en una empresa de Madrid. Estaba muy nerviosa porque era mi primera entrevista en español.",
      "Llegué quince minutos antes y esperé en la recepción. Una chica muy amable me ofreció un vaso de agua.",
      "El entrevistador se llamaba Carlos. Me hizo preguntas sobre mi experiencia y mis estudios. También me preguntó por qué quería trabajar en esa empresa.",
      "Le expliqué que estudié administración de empresas y que trabajé dos años en una oficina en Londres.",
      "Al final de la entrevista, Carlos me explicó el horario y el sueldo. El trabajo era de lunes a viernes, de nueve a seis.",
      "Salí de la entrevista bastante contenta. Una semana después, me llamaron para decirme que había conseguido el trabajo."
    ],
    comprehensionQuestions: [
      {
        type: "multiple-choice",
        prompt: "¿Cómo se llamaba el entrevistador?",
        options: ["Javier", "Carlos", "Antonio", "Pablo"],
        answer: "Carlos",
        explanation: "'El entrevistador se llamaba Carlos.'"
      },
      {
        type: "multiple-choice",
        prompt: "¿Dónde trabajó la narradora antes, durante dos años?",
        options: ["En Madrid", "En Barcelona", "En Londres", "En París"],
        answer: "En Londres",
        explanation: "'trabajé dos años en una oficina en Londres.'"
      },
      {
        type: "fill-blank",
        prompt: "El trabajo era de lunes a viernes, de nueve a ___.",
        answer: "seis",
        explanation: "'El trabajo era de lunes a viernes, de nueve a seis.'"
      },
      {
        type: "multiple-choice",
        prompt: "¿Cómo se sintió la narradora al salir de la entrevista?",
        options: ["Muy triste", "Bastante contenta", "Enfadada", "Aburrida"],
        answer: "Bastante contenta",
        explanation: "'Salí de la entrevista bastante contenta.'"
      },
      {
        type: "translation",
        prompt: "Translate: 'A week later, they called me to tell me I had gotten the job.'",
        answer: "Una semana después, me llamaron para decirme que había conseguido el trabajo",
        explanation: "'había conseguido' is the pluperfect: 'had gotten', an action completed before the phone call."
      }
    ]
  },
  {
    id: "story_tren_barcelona",
    title: "El tren a Barcelona",
    level: "B1",
    summary: "A RENFE trip from Madrid to Barcelona nearly goes wrong — a near-missed AVE, a wrong seat, and a warm welcome.",
    paragraphs: [
      "El mes pasado decidí ir a Barcelona en tren para visitar a un amigo. Compré el billete de RENFE con dos semanas de antelación porque siempre es más barato.",
      "El día del viaje, salí de casa con tiempo de sobra, pero el metro se retrasó y por poco pierdo el AVE.",
      "Cuando por fin subí al tren, me di cuenta de que me había sentado en un asiento equivocado. Una señora muy educada me indicó cuál era el mío.",
      "Durante el trayecto, que dura unas dos horas y media, aproveché para leer y descansar. El paisaje entre Madrid y Barcelona es precioso, sobre todo cuando el tren cruza los campos de Aragón.",
      "Al llegar a la estación de Sants, mi amigo me estaba esperando con un cartel escrito a mano.",
      "Pasamos el fin de semana paseando por el Barrio Gótico y comiendo tapas en pequeños bares. Aunque el viaje había empezado con nervios, al final resultó una escapada perfecta."
    ],
    comprehensionQuestions: [
      {
        type: "multiple-choice",
        prompt: "¿Por qué compró el billete con dos semanas de antelación?",
        options: ["Porque no había billetes", "Porque siempre es más barato", "Porque su amigo se lo pidió", "Porque el tren estaba lleno"],
        answer: "Porque siempre es más barato",
        explanation: "'Compré el billete de RENFE con dos semanas de antelación porque siempre es más barato.'"
      },
      {
        type: "multiple-choice",
        prompt: "¿Qué estuvo a punto de pasar por el retraso del metro?",
        options: ["Perdió las llaves", "Por poco pierde el AVE", "Llegó tarde al trabajo", "Perdió la maleta"],
        answer: "Por poco pierde el AVE",
        explanation: "'el metro se retrasó y por poco pierdo el AVE.'"
      },
      {
        type: "fill-blank",
        prompt: "El trayecto en tren dura unas dos horas y ___.",
        answer: "media",
        explanation: "'Durante el trayecto, que dura unas dos horas y media...'"
      },
      {
        type: "error-correction",
        prompt: "Corrige el error: 'El tren cruza los campo de Aragón.'",
        answer: "El tren cruza los campos de Aragón",
        explanation: "'campos' debe ir en plural para concordar con 'los'."
      },
      {
        type: "translation",
        prompt: "Translate: 'Although the trip had started with nerves, in the end it turned out to be a perfect getaway.'",
        answer: "Aunque el viaje había empezado con nervios, al final resultó una escapada perfecta",
        explanation: "'había empezado' (pluperfect) sets up background before the outcome described with 'resultó'."
      }
    ]
  },
  {
    id: "story_vecinos_quinto",
    title: "Los vecinos del quinto",
    level: "B1",
    summary: "Moving into a building in Zaragoza and slowly building community with the retired couple upstairs.",
    paragraphs: [
      "Cuando me mudé a mi piso en Zaragoza, apenas conocía a nadie en el edificio. Los vecinos del quinto, un matrimonio jubilado, fueron los primeros en presentarse.",
      "Se llaman Mercedes y Fernando, y llevan más de treinta años viviendo en el mismo piso. Nada más conocernos, nos invitaron a tomar café en su terraza.",
      "Mercedes me contó que, antes, todos los vecinos se conocían y se ayudaban entre ellos, pero que ahora, con tanta gente que se muda a menudo, cuesta más crear comunidad.",
      "Los sábados por la mañana, el matrimonio suele bajar a la plaza a charlar con otros jubilados del barrio, mientras los más jóvenes seguimos durmiendo hasta tarde.",
      "Poco a poco empecé a saludar a más vecinos por la escalera, e incluso organizamos una cena de la comunidad en el patio interior.",
      "Ahora, cuando vuelvo a casa cansada del trabajo, siempre hay alguien dispuesto a charlar un rato o a prestarme azúcar si me falta.",
      "Creo que, aunque la vida moderna nos hace correr de un lado a otro, todavía merece la pena pararse a conocer a quien vive puerta con puerta."
    ],
    comprehensionQuestions: [
      {
        type: "multiple-choice",
        prompt: "¿Cómo se llaman los vecinos del quinto?",
        options: ["Mercedes y Fernando", "Elena y Diego", "Rosa y Antonio", "Marta y Pablo"],
        answer: "Mercedes y Fernando",
        explanation: "'Se llaman Mercedes y Fernando, y llevan más de treinta años viviendo en el mismo piso.'"
      },
      {
        type: "multiple-choice",
        prompt: "Según Mercedes, ¿qué ha cambiado en el edificio con el tiempo?",
        options: ["Ahora hay menos vecinos", "Cuesta más crear comunidad porque la gente se muda a menudo", "El edificio es más grande", "Ya no hay ascensor"],
        answer: "Cuesta más crear comunidad porque la gente se muda a menudo",
        explanation: "'con tanta gente que se muda a menudo, cuesta más crear comunidad.'"
      },
      {
        type: "fill-blank",
        prompt: "Los sábados por la mañana, el matrimonio suele bajar a la ___ a charlar.",
        answer: "plaza",
        explanation: "'el matrimonio suele bajar a la plaza a charlar con otros jubilados del barrio.'"
      },
      {
        type: "multiple-choice",
        prompt: "¿Qué organizó la narradora con el tiempo?",
        options: ["Una fiesta de cumpleaños", "Una cena de la comunidad en el patio", "Un viaje al pueblo", "Una reunión de trabajo"],
        answer: "Una cena de la comunidad en el patio",
        explanation: "'incluso organizamos una cena de la comunidad en el patio interior.'"
      },
      {
        type: "translation",
        prompt: "Translate: 'It's still worth stopping to get to know whoever lives right next door.'",
        answer: "Todavía merece la pena pararse a conocer a quien vive puerta con puerta",
        explanation: "'merece la pena' = it's worth it; 'puerta con puerta' = door to door, i.e. right next door."
      }
    ]
  },
  {
    id: "story_huelga_metro",
    title: "La huelga en el metro de Madrid",
    level: "B2",
    summary: "A news-style report on a partial Madrid metro strike — journalistic register, quotes, and impersonal 'se' constructions.",
    paragraphs: [
      "Esta semana, los trabajadores del metro de Madrid han convocado una huelga parcial que afecta a miles de viajeros durante las horas punta. Según el sindicato, la protesta responde a la falta de personal y al aumento de la carga de trabajo tras la pandemia.",
      "Durante los días de huelga, se garantizan los servicios mínimos: un tren cada quince minutos en las horas de mayor afluencia y cada media hora el resto del día. Aun así, muchas estaciones del centro se han visto abarrotadas desde primera hora de la mañana.",
      "«Llevamos meses reclamando más contrataciones y mejores condiciones, pero la empresa no nos ha ofrecido una propuesta seria», declaró ayer la portavoz sindical en una rueda de prensa frente a la sede de la compañía.",
      "Por su parte, la dirección del metro asegura que ya se han iniciado varios procesos de selección y que espera resolver el conflicto «en las próximas semanas», aunque no ha concretado ninguna fecha.",
      "Mientras tanto, muchos madrileños han optado por soluciones alternativas: coger la bicicleta pública, compartir coche con compañeros de trabajo o, simplemente, teletrabajar los días más complicados.",
      "Los analistas coinciden en que este tipo de conflictos laborales podría repetirse en otros servicios públicos si no se aborda pronto el problema estructural de la falta de personal en el sector."
    ],
    comprehensionQuestions: [
      {
        type: "multiple-choice",
        prompt: "¿Por qué han convocado la huelga los trabajadores del metro?",
        options: ["Por un aumento de sueldo únicamente", "Por la falta de personal y el aumento de la carga de trabajo", "Porque quieren cerrar el metro", "Por un cambio de uniforme"],
        answer: "Por la falta de personal y el aumento de la carga de trabajo",
        explanation: "'la protesta responde a la falta de personal y al aumento de la carga de trabajo tras la pandemia.'"
      },
      {
        type: "multiple-choice",
        prompt: "Durante la huelga, ¿cada cuánto pasa un tren en las horas de mayor afluencia?",
        options: ["Cada cinco minutos", "Cada quince minutos", "Cada media hora", "Cada hora"],
        answer: "Cada quince minutos",
        explanation: "'un tren cada quince minutos en las horas de mayor afluencia y cada media hora el resto del día.'"
      },
      {
        type: "fill-blank",
        prompt: "La dirección del metro asegura que espera resolver el conflicto «en las próximas ___».",
        answer: "semanas",
        explanation: "'espera resolver el conflicto «en las próximas semanas», aunque no ha concretado ninguna fecha.'"
      },
      {
        type: "multiple-choice",
        prompt: "¿Qué alternativa NO se menciona en el texto?",
        options: ["Coger la bicicleta pública", "Compartir coche", "Teletrabajar", "Coger un taxi"],
        answer: "Coger un taxi",
        explanation: "El texto menciona la bicicleta pública, compartir coche y teletrabajar, pero no menciona el taxi."
      },
      {
        type: "translation",
        prompt: "Translate: 'Many Madrid residents have chosen alternative solutions.'",
        answer: "Muchos madrileños han optado por soluciones alternativas",
        explanation: "'optar por' = to choose/opt for; present perfect 'han optado' for a recent, ongoing trend."
      }
    ]
  },
  {
    id: "story_silencio_mediodia",
    title: "El silencio del mediodía",
    level: "C1",
    summary: "A reflective essay on siesta culture, the pace of village versus city life, and what modern Spain may have lost.",
    paragraphs: [
      "Hay quien piensa que la siesta es cosa del pasado, una costumbre que ya no encaja con el ritmo frenético de las ciudades españolas. Sin embargo, cada vez que vuelvo al pueblo de mi infancia, en pleno agosto, descubro que ese silencio del mediodía sigue siendo sagrado.",
      "A las dos de la tarde, las calles se vacían por completo. Las persianas bajan, los bares cierran sus puertas y, durante un par de horas, parece que el pueblo entero contiene la respiración. No es pereza, como algunos extranjeros suponen, sino una forma de organizar el día en torno al calor.",
      "Mi abuelo solía decir que quien no descansa después de comer no rinde bien por la tarde, y aunque de joven me parecía una excusa para no trabajar, con los años he empezado a sospechar que tenía razón.",
      "En Madrid, en cambio, la vida sigue sin pausa: reuniones que se alargan hasta las tres, comidas de veinte minutos frente al ordenador, cafés para mantenerse despierto. No es que a los madrileños no les guste descansar; es que la ciudad, sencillamente, no se lo permite.",
      "Cabe preguntarse si no habremos perdido algo importante al abandonar esa pausa, aunque sea solo simbólicamente. Quizás no se trate de dormir literalmente la siesta, sino de recuperar la costumbre de detenerse, aunque sea un momento, antes de que la tarde nos arrastre de nuevo.",
      "Por lo tanto, cuando alguien me pregunta si echo de menos algo de mi pueblo, no dudo en responder que sí: echo de menos ese silencio del mediodía que, sin que nadie lo pida, nos obliga a parar."
    ],
    comprehensionQuestions: [
      {
        type: "multiple-choice",
        prompt: "Según el texto, ¿qué ocurre en el pueblo a las dos de la tarde?",
        options: ["Empieza el mercado", "Las calles se vacían y los bares cierran", "Llega el tren", "Empiezan las fiestas"],
        answer: "Las calles se vacían y los bares cierran",
        explanation: "'A las dos de la tarde, las calles se vacían por completo. Las persianas bajan, los bares cierran sus puertas...'"
      },
      {
        type: "multiple-choice",
        prompt: "Según el narrador, ¿por qué se organiza el día en torno al calor en el pueblo?",
        options: ["Por pereza", "Como forma de organizar el día, no por pereza", "Porque no hay electricidad", "Por tradición religiosa únicamente"],
        answer: "Como forma de organizar el día, no por pereza",
        explanation: "'No es pereza, como algunos extranjeros suponen, sino una forma de organizar el día en torno al calor.'"
      },
      {
        type: "fill-blank",
        prompt: "Mi abuelo solía decir que quien no descansa después de comer no ___ bien por la tarde.",
        answer: "rinde",
        explanation: "'quien no descansa después de comer no rinde bien por la tarde.'"
      },
      {
        type: "multiple-choice",
        prompt: "¿Qué opina el narrador sobre el ritmo de vida en Madrid?",
        options: ["Le parece perfecto", "Cree que la ciudad no permite descansar, aunque a la gente le gustaría", "Piensa que en Madrid se trabaja poco", "No menciona Madrid"],
        answer: "Cree que la ciudad no permite descansar, aunque a la gente le gustaría",
        explanation: "'No es que a los madrileños no les guste descansar; es que la ciudad, sencillamente, no se lo permite.'"
      },
      {
        type: "translation",
        prompt: "Translate: 'Perhaps it's not about literally taking a nap, but about recovering the habit of pausing.'",
        answer: "Quizás no se trate de dormir literalmente la siesta, sino de recuperar la costumbre de detenerse",
        explanation: "'se trate' is present subjunctive after 'quizás', a common trigger for doubt/uncertainty."
      }
    ]
  }
];
