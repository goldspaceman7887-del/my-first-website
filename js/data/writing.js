export const WRITING_PROMPTS = [
  {
    id: "wr_01",
    level: "A1",
    type: "journal",
    title: "Mi rutina diaria",
    prompt: "Escribe sobre tu rutina diaria. ¿A qué hora te levantas? ¿Qué haces por la mañana, por la tarde y por la noche?",
    minWords: 40,
    checklist: [
      "Usa al menos 5 verbos reflexivos o de rutina (levantarse, ducharse, desayunar...)",
      "Incluye al menos tres expresiones de tiempo (por la mañana, luego, después)",
      "Escribe en presente de indicativo",
      "Menciona una comida del día"
    ],
    modelAnswer: "Todos los días me levanto a las siete de la mañana. Primero me ducho y me visto, y después desayuno un café con leche y una tostada. Luego cojo el autobús para ir al trabajo. Por la tarde, cuando termino de trabajar, voy al gimnasio o quedo con amigos. Por la noche ceno algo ligero, veo la televisión un rato y me acuesto sobre las once."
  },
  {
    id: "wr_02",
    level: "A1",
    type: "journal",
    title: "Mi familia",
    prompt: "Describe a tu familia. ¿Cuántas personas sois? ¿Cómo son? ¿A qué se dedican?",
    minWords: 40,
    checklist: [
      "Usa el verbo ser para describir el físico y la personalidad",
      "Usa el verbo tener para dar la edad",
      "Menciona al menos tres miembros de la familia",
      "Incluye una profesión con el verbo trabajar o ser + profesión"
    ],
    modelAnswer: "Mi familia es pequeña: somos cuatro. Mi padre se llama Javier y es ingeniero; es muy trabajador y tranquilo. Mi madre se llama Isabel y trabaja en un colegio; es simpática y habladora. Tengo un hermano, Carlos, que tiene veinte años y estudia en la universidad. Nos llevamos muy bien y cenamos juntos casi todos los días."
  },
  {
    id: "wr_03",
    level: "A2",
    type: "journal",
    title: "Mi fin de semana",
    prompt: "Escribe sobre tu fin de semana. ¿Qué hiciste? ¿Con quién?",
    minWords: 50,
    checklist: [
      "Usa al menos 3 verbos en pretérito",
      "Incluye una expresión de tiempo (el sábado, luego, después)",
      "Menciona a una persona con la que estuviste",
      "Da tu opinión sobre el fin de semana al final"
    ],
    modelAnswer: "El sábado pasado fui al cine con mi hermana. Vimos una película de aventuras y después cenamos en un restaurante italiano. El domingo me levanté tarde y quedé con unos amigos para dar un paseo por el parque. Por la tarde estudié un poco para el examen del lunes. En general fue un fin de semana muy relajante."
  },
  {
    id: "wr_04",
    level: "A2",
    type: "storytelling",
    title: "Un día especial",
    prompt: "Cuenta un día especial que recuerdes: un cumpleaños, una fiesta o una celebración. ¿Qué pasó? ¿Cómo te sentiste?",
    minWords: 60,
    checklist: [
      "Usa el pretérito para narrar los acontecimientos principales",
      "Usa el imperfecto al menos una vez para describir el ambiente o los sentimientos",
      "Incluye al menos dos conectores temporales (primero, luego, al final)",
      "Termina describiendo cómo te sentiste"
    ],
    modelAnswer: "El día de mi dieciocho cumpleaños mis padres organizaron una fiesta sorpresa en casa. Cuando llegué, todos mis amigos estaban escondidos en el salón y gritaron '¡sorpresa!'. Yo no me lo esperaba y me puse muy contento. Primero cenamos una tarta enorme de chocolate, luego bailamos hasta muy tarde y al final mis amigos me regalaron una cámara de fotos. Fue uno de los días más felices de mi vida."
  },
  {
    id: "wr_05",
    level: "A2",
    type: "paragraph",
    title: "Mi ciudad",
    prompt: "Describe la ciudad o el pueblo donde vives. ¿Cómo es? ¿Qué se puede hacer allí?",
    minWords: 50,
    checklist: [
      "Usa hay para hablar de lo que existe en la ciudad",
      "Incluye al menos tres adjetivos descriptivos",
      "Menciona un lugar concreto (una plaza, un parque, un monumento)",
      "Escribe en presente de indicativo"
    ],
    modelAnswer: "Vivo en Zaragoza, una ciudad bastante grande y muy bonita del norte de España. Hay muchas plazas y parques, y el río Ebro pasa por el centro. Mi lugar favorito es la Basílica del Pilar, que es enorme e impresionante. En el centro hay muchas tiendas y bares donde se puede tomar unas tapas. Es una ciudad tranquila pero con mucho ambiente los fines de semana."
  },
  {
    id: "wr_06",
    level: "B1",
    type: "storytelling",
    title: "Un viaje inolvidable",
    prompt: "Narra un viaje que recuerdes especialmente, bueno o malo. ¿Adónde fuiste, con quién, y qué pasó?",
    minWords: 100,
    checklist: [
      "Alterna correctamente el pretérito y el imperfecto",
      "Usa al menos un conector de secuencia avanzado (al cabo de, mientras, en cuanto)",
      "Incluye una anécdota concreta con un problema o un momento inesperado",
      "Concluye con una reflexión sobre lo que aprendiste o sentiste"
    ],
    modelAnswer: "Hace dos veranos viajé a Portugal con dos amigas de la universidad. Habíamos planeado pasar tres días en Lisboa y dos en Oporto, pero, mientras conducíamos hacia Lisboa, el coche se averió en mitad de la autopista. Al principio nos asustamos mucho porque no sabíamos qué hacer, pero al cabo de una hora llegó una grúa y nos llevó hasta el taller más cercano. Al final tuvimos que quedarnos una noche extra en un pueblo que no estaba en nuestros planes, y precisamente esa noche descubrimos un restaurante familiar donde comimos el mejor pescado de todo el viaje. Aprendí que, a veces, los mejores recuerdos nacen de los planes que salen mal."
  },
  {
    id: "wr_07",
    level: "B1",
    type: "storytelling",
    title: "Un error que cometí",
    prompt: "Cuenta un error o una equivocación que cometiste y qué consecuencias tuvo. ¿Qué aprendiste de esa experiencia?",
    minWords: 100,
    checklist: [
      "Usa el pretérito para narrar los hechos principales",
      "Usa el imperfecto para dar contexto o explicar el estado de ánimo",
      "Incluye al menos una oración con \"porque\" o \"ya que\" explicando la causa",
      "Termina explicando qué aprendiste"
    ],
    modelAnswer: "El año pasado, en mi primer trabajo, envié un correo importante al cliente equivocado porque no revisé bien la dirección antes de darle a enviar. Me di cuenta del error unos minutos después y me puse muy nervioso, ya que el correo contenía información confidencial. Llamé enseguida a mi jefe para contárselo, y entre los dos conseguimos solucionarlo antes de que causara ningún problema grave. Desde entonces, siempre reviso dos veces cualquier correo antes de enviarlo, por muy pequeño que parezca el detalle."
  },
  {
    id: "wr_08",
    level: "B1",
    type: "opinion",
    title: "La tecnología en nuestra vida diaria",
    prompt: "¿Crees que la tecnología, como el móvil o las redes sociales, nos hace la vida mejor o peor? Da tu opinión con ejemplos concretos.",
    minWords: 100,
    checklist: [
      "Presenta claramente tu opinión con expresiones como \"en mi opinión\" o \"creo que\"",
      "Da al menos dos argumentos con ejemplos concretos",
      "Usa al menos un conector de contraste (sin embargo, por otro lado)",
      "Escribe una conclusión que resuma tu postura"
    ],
    modelAnswer: "En mi opinión, la tecnología tiene ventajas e inconvenientes, pero en general nos facilita la vida. Por un lado, gracias al móvil podemos hablar con familiares que viven lejos o resolver dudas en segundos. Por otro lado, creo que pasamos demasiado tiempo mirando la pantalla y eso afecta a nuestras relaciones cara a cara; por ejemplo, es normal ver a un grupo de amigos en un bar mirando cada uno su móvil en vez de hablar entre ellos. Sin embargo, pienso que el problema no es la tecnología en sí, sino el uso que hacemos de ella. En conclusión, creo que hay que aprender a usarla con más equilibrio."
  },
  {
    id: "wr_09",
    level: "B1",
    type: "opinion",
    title: "¿Ciudad o pueblo? Dónde prefiero vivir",
    prompt: "¿Prefieres vivir en una gran ciudad o en un pueblo pequeño? Explica tu opinión comparando las ventajas y desventajas de cada opción.",
    minWords: 100,
    checklist: [
      "Compara al menos dos aspectos (trabajo, tranquilidad, servicios, transporte...)",
      "Usa estructuras comparativas (más...que, menos...que, tan...como)",
      "Da tu opinión personal claramente justificada",
      "Usa al menos un conector de contraste"
    ],
    modelAnswer: "Personalmente, prefiero vivir en una ciudad mediana antes que en un pueblo pequeño o en una gran capital. En un pueblo la vida es más tranquila que en la ciudad y la gente se conoce mejor, pero hay muchos menos servicios y oportunidades de trabajo. En cambio, en una gran ciudad como Madrid hay tanto trabajo como oferta cultural, aunque el ritmo de vida es más estresante y el alquiler es carísimo. Por eso creo que una ciudad mediana, como Valencia o Zaragoza, ofrece un buen equilibrio: tiene casi tantos servicios como una gran capital, pero un ritmo de vida más parecido al de un pueblo."
  },
  {
    id: "wr_10",
    level: "B2",
    type: "opinion",
    title: "El equilibrio entre el trabajo y la vida personal",
    prompt: "Escribe un texto de opinión sobre la conciliación entre el trabajo y la vida personal en la sociedad actual. ¿Crees que las empresas españolas respetan suficientemente el tiempo libre de sus empleados?",
    minWords: 150,
    checklist: [
      "Estructura el texto en introducción, desarrollo y conclusión",
      "Usa conectores avanzados (sin embargo, no obstante, por lo tanto, en cuanto a)",
      "Incluye al menos un ejemplo concreto de la vida laboral española (horario, sobremesa, jornada continua...)",
      "Presenta un argumento a favor y otro en contra antes de dar tu conclusión"
    ],
    modelAnswer: "La conciliación entre el trabajo y la vida personal es, hoy en día, uno de los grandes retos de la sociedad española. Por un lado, cada vez más empresas ofrecen horarios flexibles o la posibilidad de teletrabajar, lo que permite a los empleados organizar mejor su tiempo y reducir el estrés. Por otro lado, sin embargo, todavía persisten hábitos poco saludables, como las jornadas que se alargan más allá de las ocho horas o las reuniones convocadas a última hora de la tarde, justo cuando muchos empleados quieren volver a casa con su familia. En cuanto a la administración pública, algunas medidas recientes, como la reducción de la jornada laboral, apuntan en la dirección correcta, pero su aplicación real todavía es desigual según el sector. Por lo tanto, considero que, aunque se ha avanzado bastante en los últimos años, España todavía tiene mucho camino por recorrer para que la conciliación deje de ser un privilegio de unos pocos y se convierta en la norma general."
  },
  {
    id: "wr_11",
    level: "B2",
    type: "storytelling",
    title: "Una diferencia cultural que he notado",
    prompt: "Describe una diferencia cultural que hayas notado entre España y otro país que conozcas (horarios, comida, forma de saludar, etc.). Usa una anécdota personal para ilustrarla.",
    minWords: 150,
    checklist: [
      "Combina narración (una anécdota concreta) con explicación general",
      "Usa el pretérito y el imperfecto correctamente en la anécdota",
      "Compara explícitamente España con otro país usando conectores comparativos",
      "Incluye una reflexión final sobre lo que esa diferencia te enseñó"
    ],
    modelAnswer: "Una de las diferencias culturales que más me sorprendió al llegar a España fueron los horarios de las comidas. En mi país solemos cenar sobre las seis o las siete de la tarde, así que, la primera vez que unos compañeros de trabajo me invitaron a cenar en Sevilla, llegué al restaurante a las siete y media y me encontré las puertas todavía cerradas. Me quedé esperando en la calle, un poco confundido, hasta que vi que la gente empezaba a entrar sobre las nueve y media. Mientras tanto, había aprovechado para pasear por el barrio y descubrir una plaza preciosa que no conocía. Con el tiempo entendí que en España la cena es un momento social que se alarga durante horas, muy distinto de la cena rápida a la que yo estaba acostumbrado. Esa anécdota me enseñó que adaptarse a los horarios de un país no es solo una cuestión práctica, sino también una forma de entender su cultura y su manera de relacionarse."
  },
  {
    id: "wr_12",
    level: "B2",
    type: "guided",
    title: "Escribe un correo de reclamación",
    prompt: "Escribe un correo formal de reclamación a una compañía aérea porque tu vuelo se retrasó seis horas y perdiste una conexión importante. Explica lo sucedido y pide una compensación.",
    minWords: 120,
    checklist: [
      "Usa un registro formal (usted, fórmulas de apertura y cierre adecuadas)",
      "Explica los hechos con claridad usando el pretérito",
      "Incluye una petición concreta (compensación, reembolso, explicación)",
      "Usa al menos una fórmula formal de cierre (Atentamente, Un cordial saludo)"
    ],
    modelAnswer: "Estimados señores:\n\nMe pongo en contacto con ustedes para presentar una reclamación relacionada con el vuelo IB2457 de Madrid a Bruselas del pasado 14 de junio. El vuelo, previsto originalmente a las 09:15, se retrasó más de seis horas sin ninguna explicación clara por parte del personal de tierra, lo que me hizo perder la conexión con el vuelo a Nueva York que tenía programado para esa misma tarde.\n\nComo consecuencia de este retraso, tuve que asumir gastos adicionales de alojamiento y comida, además de perder un día completo de mi viaje de negocios. Adjunto a este correo las tarjetas de embarque y los recibos correspondientes.\n\nPor todo ello, les solicito una compensación económica conforme a la normativa europea sobre derechos de los pasajeros, así como el reembolso de los gastos mencionados anteriormente.\n\nQuedo a la espera de su respuesta a la mayor brevedad posible.\n\nAtentamente,\nCarmen Ruiz"
  },
  {
    id: "wr_13",
    level: "B2",
    type: "opinion",
    title: "El teletrabajo: ¿a favor o en contra?",
    prompt: "Escribe un texto argumentativo sobre el teletrabajo. Presenta argumentos a favor y en contra, y termina defendiendo tu propia postura.",
    minWords: 150,
    checklist: [
      "Presenta al menos dos argumentos a favor y dos en contra",
      "Usa conectores de argumentación (en primer lugar, además, por otro lado, en conclusión)",
      "Incluye un ejemplo concreto relacionado con España (ciudades, vivienda, transporte)",
      "Defiende claramente tu propia opinión en la conclusión"
    ],
    modelAnswer: "El teletrabajo se ha convertido en una realidad habitual en muchas empresas españolas desde la pandemia, y no está exento de debate. A favor, en primer lugar, permite ahorrar tiempo y dinero en desplazamientos, algo especialmente valioso en ciudades como Madrid o Barcelona, donde los trayectos al trabajo pueden superar la hora. Además, ofrece mayor flexibilidad para conciliar la vida laboral y familiar. Sin embargo, también existen argumentos en contra: por un lado, muchos trabajadores echan de menos el contacto directo con sus compañeros, lo que puede afectar negativamente a la creatividad y al sentimiento de equipo; por otro lado, trabajar desde casa dificulta separar la vida personal de la profesional, y no es raro acabar trabajando más horas de las debidas. En conclusión, aunque reconozco los inconvenientes, considero que, bien gestionado —por ejemplo, combinando días de oficina con días de teletrabajo—, el teletrabajo aporta más beneficios que problemas tanto para los empleados como para las empresas."
  },
  {
    id: "wr_14",
    level: "C1",
    type: "opinion",
    title: "El impacto del turismo en las ciudades españolas",
    prompt: "Redacta un ensayo argumentativo sobre el impacto del turismo masivo en ciudades españolas como Barcelona, Sevilla o Palma. Analiza tanto los beneficios económicos como los efectos negativos, y propone posibles soluciones.",
    minWords: 200,
    checklist: [
      "Estructura el ensayo con introducción, dos o tres párrafos de desarrollo y conclusión",
      "Usa conectores avanzados y subordinadas complejas (a pesar de que, dado que, con el fin de)",
      "Incluye datos o ejemplos concretos y matizados, evitando generalizaciones simplistas",
      "Propón al menos dos soluciones concretas y realistas en la conclusión"
    ],
    modelAnswer: "El turismo masivo se ha convertido en una de las principales fuentes de riqueza de numerosas ciudades españolas, pero también en el origen de tensiones sociales cada vez más visibles. Ciudades como Barcelona, Sevilla o Palma de Mallorca dependen en gran medida del sector turístico, que genera empleo directo e indirecto y sostiene a miles de pequeños negocios locales. A pesar de estos beneficios innegables, no puede ignorarse que el modelo actual de turismo plantea problemas serios: el encarecimiento de la vivienda, provocado en parte por la proliferación de pisos turísticos, ha expulsado a residentes de toda la vida de sus propios barrios; y la masificación en puntos emblemáticos, como la Sagrada Familia o el barrio de Santa Cruz, ha terminado por degradar la experiencia tanto de vecinos como de visitantes. Dado que el turismo seguirá siendo, previsiblemente, uno de los pilares de la economía española, el reto no consiste en eliminarlo, sino en gestionarlo de manera más sostenible. Con el fin de lograrlo, algunas ciudades ya han empezado a limitar el número de licencias para pisos turísticos y a promover un turismo más repartido a lo largo del año y del territorio, evitando la concentración exclusiva en los meses de verano y en los cascos históricos. En conclusión, considero que solo un equilibrio cuidadoso entre el aprovechamiento económico del turismo y la protección de la vida cotidiana de los residentes permitirá que estas ciudades sigan siendo, al mismo tiempo, destinos atractivos y lugares habitables para quienes viven en ellas."
  },
  {
    id: "wr_15",
    level: "C1",
    type: "guided",
    title: "Una diferencia generacional",
    prompt: "Escribe un artículo de opinión, en un tono reflexivo y personal, sobre una diferencia generacional que hayas observado entre tú y tus padres o abuelos (actitudes ante el trabajo, la tecnología, las relaciones o la vivienda). El artículo debe ir dirigido a los lectores de una revista cultural.",
    minWords: 200,
    checklist: [
      "Adopta un registro cuidado y reflexivo propio de un artículo de opinión publicado",
      "Combina reflexión general con al menos un ejemplo o anécdota personal concreta",
      "Usa estructuras propias del nivel C1: subjuntivo, conectores de matiz (si bien, aun cuando, en la medida en que)",
      "Cierra el artículo con una conclusión que invite a la reflexión del lector, sin ser categórica"
    ],
    modelAnswer: "Cada vez que hablo con mi abuela sobre el trabajo, me sorprende comprobar hasta qué punto ha cambiado la relación que tenemos con nuestra propia vida laboral. Ella trabajó treinta y cinco años en la misma fábrica, sin plantearse siquiera la posibilidad de cambiar de empleo, y solía decirme, no sin cierto orgullo, que la estabilidad era lo más importante que se podía pedir a un trabajo. Yo, en cambio, he cambiado de empresa tres veces en los últimos ocho años, y aunque entiendo perfectamente el valor de la estabilidad que ella defendía, no puedo evitar sentir que mi generación busca, sobre todo, sentirse realizada en lo que hace, aun cuando eso implique renunciar a cierta seguridad económica. Recuerdo especialmente una conversación que tuvimos el verano pasado, cuando le confesé que estaba pensando en dejar un trabajo bien pagado para dedicarme a algo que me apasionaba mucho más, aunque ganara bastante menos dinero. Ella se quedó en silencio unos segundos y, finalmente, me dijo que ojalá ella hubiera tenido esa posibilidad cuando era joven. Aquella respuesta me hizo entender que, si bien nuestras prioridades son distintas, no lo son tanto nuestros deseos más profundos: en la medida en que ambas generaciones buscamos, cada una a su manera, una vida que merezca la pena, quizá no estemos tan lejos la una de la otra como a veces parece."
  }
];
