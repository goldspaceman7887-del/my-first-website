export const GRAMMAR = [
  // ============================================================
  // BEGINNER TIER
  // ============================================================
  {
    id: "gram_alphabet",
    title: "El alfabeto español (The Spanish Alphabet)",
    level: "A0",
    tier: "beginner",
    simpleExplanation: "Spanish has 27 letters, almost the same as English but with one extra: ñ, and every letter has one consistent name and sound.",
    detailedExplanation: "The Spanish alphabet (el abecedario) is the English alphabet plus ñ (eñe), inserted after n. Historically ch and ll were treated as separate letters in dictionaries, but since 2010 the Real Academia Española classifies them as two-letter combinations, not separate letters, so words are alphabetized normally. Each letter has an official name you use when spelling something aloud (deletrear), which is essential in Spain for giving your name over the phone, at a pharmacy, or booking a table.",
    englishComparison: "English speakers already know 26 of the 27 letters; the only new symbol is ñ. The tricky part is that letter names sound completely different from English: h is \"hache\" (silent), j is \"jota\", v is \"uve\", w is \"uve doble\", y is \"i griega\", and z is \"zeta\". Spelling out loud in Spanish uses these names, not English letter sounds.",
    commonMistakes: [
      "Saying English letter names when spelling a word in Spanish (e.g. saying \"double-u\" instead of \"uve doble\").",
      "Forgetting that ñ is a completely separate letter from n — \"año\" (year) and \"ano\" (anus) are different words, so dropping the tilde is a real, embarrassing mistake.",
      "Pronouncing h as an English \"h\" sound; in Spanish h is always silent (\"hola\" = OH-lah).",
      "Treating ch and ll as needing their own dictionary section — modern Spanish alphabetizes them normally under c and l."
    ],
    spainExamples: [
      "\"Me llamo Beatriz, con be de Barcelona\" — Spaniards often clarify b vs v by naming a word (\"be de burro\" vs \"uve de vaca\") because both letters sound almost identical in Spain.",
      "\"¿Puede deletrearlo, por favor?\" — very common request at a Spanish pharmacy, bank, or town hall (ayuntamiento) when giving your name.",
      "\"Con eñe, no con ene\" — said to clarify that a word has ñ, e.g. when spelling \"España\"."
    ],
    exampleSentences: [
      { es: "El alfabeto español tiene veintisiete letras.", en: "The Spanish alphabet has twenty-seven letters." },
      { es: "¿Cómo se escribe tu apellido?", en: "How do you spell your last name?" },
      { es: "Se escribe con eñe, no con ene.", en: "It's spelled with ñ, not with n." },
      { es: "La hache es muda en español.", en: "The letter h is silent in Spanish." },
      { es: "Mi nombre se deletrea así: ele, u, ce, í, a.", en: "My name is spelled like this: L, U, C, Í, A." }
    ],
    memoryTricks: "Think \"ENYE like ONION\" — the ñ makes the same nasal-y sound as the \"ny\" in \"canyon\" (which comes from Spanish cañón). Picture a worm (the tilde ~) wriggling on top of an n to remember it changes the sound.",
    visualExplanation: "Key letters and their Spanish names, written as a table: a=a | b=be | c=ce | d=de | e=e | f=efe | g=ge | h=hache (silent) | i=i | j=jota | k=ka | l=ele | m=eme | n=ene | ñ=eñe | o=o | p=pe | q=cu | r=erre | s=ese | t=te | u=u | v=uve | w=uve doble | x=equis | y=i griega | z=zeta.",
    exercises: [
      { type: "multiple-choice", prompt: "Which letter is unique to the Spanish alphabet and not found in English?", options: ["ñ", "w", "k", "h"], answer: "ñ", explanation: "Ñ (eñe) is the one letter added to the Latin alphabet specifically for Spanish." },
      { type: "fill-blank", prompt: "La letra ___ es muda en español (h).", answer: "hache", explanation: "H is called \"hache\" in Spanish and is always silent." },
      { type: "error-correction", prompt: "El año pasado fui a la playa. (a student wrote \"ano\" instead of \"año\")", answer: "El año pasado fui a la playa.", explanation: "Without the tilde, \"ano\" means something completely different from \"año\" (year) — the ñ is essential." },
      { type: "translation", prompt: "How do you spell your name?", answer: "¿Cómo se escribe tu nombre?", explanation: "\"Deletrear\" also works: ¿Puedes deletrear tu nombre?" },
      { type: "dialogue-completion", prompt: "—¿Cómo te llamas? —Me llamo Javier. —¿Cómo se ___ eso? —Se ___: jota, a, uve, i, e, ere.", answer: "escribe / deletrea", explanation: "Both \"escribe\" (is it written) and \"deletrea\" (spell it) are natural here." }
    ]
  },
  {
    id: "gram_pronunciation",
    title: "La pronunciación (Pronunciation)",
    level: "A0",
    tier: "beginner",
    simpleExplanation: "Spanish spelling is very phonetic — almost every letter always makes the same sound, so once you learn the rules you can read almost any word correctly.",
    detailedExplanation: "Unlike English, Spanish vowels (a, e, i, o, u) each have exactly one sound, always. Consonants are mostly predictable too, with a few key rules: c and z before e/i are pronounced as a soft \"th\" sound in Castilian Spain Spanish (distinción), unlike Latin America where they're an \"s\" sound (seseo). The letter j and g (before e/i) make a harsh throat sound like the \"ch\" in the Scottish \"loch\". Double r (rr) and word-initial r are strongly trilled. B and v sound identical in Spain (a soft b).",
    englishComparison: "English vowels shift wildly (compare the \"a\" in \"cat\", \"father\", and \"cake\"); Spanish vowels never shift — \"a\" is always like the \"a\" in \"father\". Spain's ce/ci/z distinción (pronounced like English \"th\" in \"think\") is a key feature that does NOT exist in Latin American Spanish, where it's pronounced like \"s\".",
    commonMistakes: [
      "Pronouncing Spanish vowels with English diphthong sounds, e.g. saying \"no\" like the English word instead of a pure, short \"oh\".",
      "Not distinguishing z/ce/ci with the Castilian \"th\" sound — English speakers who learned Latin American Spanish often say \"gracias\" as \"GRAH-see-as\" instead of the Spain pronunciation \"GRAH-thee-as\".",
      "Pronouncing j as an English \"j\" or \"h\" sound instead of the guttural Spanish jota.",
      "Under-trilling or skipping the rr sound, which can change word meaning (\"pero\" = but, vs \"perro\" = dog)."
    ],
    spainExamples: [
      "\"Gracias\" is pronounced \"GRA-thias\" in Madrid and most of Spain (distinción), versus \"GRA-sias\" in Latin America and parts of Andalucía/Canarias (seseo).",
      "\"Cerveza\" (beer) — the c and the z are both pronounced with the Castilian \"th\" sound: ther-VEH-tha.",
      "\"Coche\" (car) is pronounced KOH-cheh — a word you'll hear constantly in Spain, unlike \"carro\", which sounds Latin American."
    ],
    exampleSentences: [
      { es: "En España, \"cinco\" se pronuncia con el sonido de \"th\".", en: "In Spain, \"cinco\" (five) is pronounced with a \"th\" sound." },
      { es: "El perro corre por el parque.", en: "The dog runs through the park." },
      { es: "Zaragoza es una ciudad bonita.", en: "Zaragoza is a beautiful city." },
      { es: "La jota se pronuncia en la garganta.", en: "The letter j is pronounced in the throat." },
      { es: "Vamos a comer una tortilla de patatas.", en: "We're going to eat a Spanish potato omelette." }
    ],
    memoryTricks: "Remember distinción with \"Barthelona, not Barcelona\" — Spaniards pronounce the c in Barcelona with a soft th sound (BAR-theh-LO-na). For the jota, imagine clearing your throat gently while saying \"h\".",
    visualExplanation: "Vowel sounds (always the same): a = \"ah\" (father) | e = \"eh\" (bed) | i = \"ee\" (see) | o = \"oh\" (note) | u = \"oo\" (moon). Spain-specific consonants: c/z (before e,i) = \"th\" (think) | j, g+e/i = guttural \"h\" (loch) | ll = \"y\"-ish sound | rr / initial r = strong trill.",
    exercises: [
      { type: "multiple-choice", prompt: "How is \"z\" pronounced in Madrid Spanish (distinción)?", options: ["Like English \"s\"", "Like English \"th\" in \"think\"", "Like English \"z\" in \"zoo\"", "Silent"], answer: "Like English \"th\" in \"think\"", explanation: "Castilian Spain Spanish pronounces z (and c before e/i) as a \"th\" sound, unlike Latin American seseo." },
      { type: "fill-blank", prompt: "\"Cerveza\" begins with the letter c, pronounced like the English sound ___.", answer: "th", explanation: "Before e or i, c is pronounced \"th\" in Peninsular Spanish." },
      { type: "error-correction", prompt: "A learner says \"perro\" (dog) with a single soft r, making it sound like \"pero\" (but).", answer: "The rr in \"perro\" needs a strong trill to distinguish it from \"pero\".", explanation: "Rr and word-initial r require a multiple trill; failing to trill changes the meaning of the word." },
      { type: "translation", prompt: "The dog runs fast.", answer: "El perro corre rápido.", explanation: "Make sure to trill the rr in \"perro\" and \"rápido\"." },
      { type: "dialogue-completion", prompt: "—¿Cómo se pronuncia \"Zaragoza\" en España? —Se pronuncia con el sonido \"___\", como en \"think\".", answer: "th", explanation: "Confirms the distinción feature of Peninsular Spanish pronunciation." }
    ]
  },
  {
    id: "gram_articles",
    title: "Los artículos (Articles: el/la/los/las, un/una)",
    level: "A1",
    tier: "beginner",
    simpleExplanation: "Spanish nouns need a little word in front of them (\"el\", \"la\", \"un\", \"una\") that matches the noun's gender and number.",
    detailedExplanation: "Definite articles (\"the\") are el (m. sing.), la (f. sing.), los (m. pl.), las (f. pl.). Indefinite articles (\"a/an/some\") are un (m. sing.), una (f. sing.), unos (m. pl.), unas (f. pl.). The article must agree in gender and number with the noun it accompanies, not with the meaning. A special rule: feminine singular nouns starting with a stressed \"a\" or \"ha\" sound take \"el\" for euphonic reasons (el agua, el hacha), but stay feminine (el agua fría).",
    englishComparison: "English has only one definite article (\"the\") and one indefinite article (\"a/an\"), with no gender agreement. Spanish articles must change form to match masculine/feminine and singular/plural, which has no equivalent in English grammar.",
    commonMistakes: [
      "Using \"la\" with \"el agua\" because it looks feminine — the exception only affects the article, not adjectives (el agua está fría, not frío).",
      "Forgetting the article altogether, since English sometimes omits it (English: \"I like coffee\" vs Spanish: Me gusta el café — the article is required).",
      "Mismatching gender, e.g. saying \"el mesa\" instead of \"la mesa\".",
      "Using indefinite articles with professions after \"ser\" (Spanish drops the article: Es profesor, not Es un profesor, unless the noun is modified)."
    ],
    spainExamples: [
      "\"Voy a coger el coche\" — \"the car\", masculine definite article, a very Spain-typical use of \"coger\" (to take/grab), which is neutral in Spain but avoided in Latin America.",
      "\"Ponme una caña, por favor\" — \"a small beer\", indefinite feminine article, typical bar order in Spain.",
      "\"El móvil está en la mesa\" — \"the mobile phone is on the table\"; note \"el móvil\", not \"el celular\" (Latin American term)."
    ],
    exampleSentences: [
      { es: "El piso tiene dos habitaciones.", en: "The flat has two bedrooms." },
      { es: "La profesora es muy simpática.", en: "The teacher is very nice." },
      { es: "Quiero un bocadillo de jamón.", en: "I want a ham sandwich." },
      { es: "Necesito unas patatas para la tortilla.", en: "I need some potatoes for the omelette." },
      { es: "El agua está muy fría hoy.", en: "The water is very cold today." }
    ],
    memoryTricks: "\"LO-LA\" rule: masculine words often end in -o (el libro), feminine in -a (la casa) — match the article to that pattern first, then learn the exceptions (el día, la mano) as a short memorized list.",
    visualExplanation: "Definite articles: el (m. sg) | la (f. sg) | los (m. pl) | las (f. pl). Indefinite articles: un (m. sg) | una (f. sg) | unos (m. pl) | unas (f. pl). Example set: el chico / la chica / los chicos / las chicas — un libro / una mesa / unos libros / unas mesas.",
    exercises: [
      { type: "multiple-choice", prompt: "Which article completes \"___ agua está fría\"?", options: ["la", "el", "los", "un"], answer: "el", explanation: "Feminine nouns beginning with stressed \"a\" (agua) take \"el\" for pronunciation, but remain grammatically feminine." },
      { type: "fill-blank", prompt: "Necesito ___ (a, fem.) mesa nueva para el salón.", answer: "una", explanation: "\"Mesa\" is feminine singular, so the indefinite article is \"una\"." },
      { type: "error-correction", prompt: "El mesa está en la cocina.", answer: "La mesa está en la cocina.", explanation: "\"Mesa\" is feminine, so it needs \"la\", not \"el\"." },
      { type: "translation", prompt: "The children are in the park.", answer: "Los niños están en el parque.", explanation: "\"Niños\" (mixed/masculine plural) takes \"los\"; \"parque\" is masculine so it takes \"el\"." },
      { type: "sentence-building", words: ["camisetas", "unas", "compré", "azules"], answer: "Compré unas camisetas azules.", explanation: "\"Camisetas\" (t-shirts) is feminine plural, so the indefinite article is \"unas\"." },
      { type: "dialogue-completion", prompt: "—¿Tienes ___ boli? —Sí, toma, aquí tienes ___ bolígrafo azul.", answer: "un / el", explanation: "First mention uses the indefinite \"un\" (a pen); once identified, \"el\" (the pen) is used." }
    ]
  },
  {
    id: "gram_gender",
    title: "El género de los sustantivos (Noun Gender)",
    level: "A1",
    tier: "beginner",
    simpleExplanation: "Every Spanish noun is either masculine or feminine, even for objects with no natural gender, and this affects the articles and adjectives that go with it.",
    detailedExplanation: "Most nouns ending in -o are masculine (el libro) and most ending in -a are feminine (la casa), but there are many important exceptions: el día, el mapa, el problema, el idioma (masculine despite ending in -a, mostly Greek-origin words), and la mano, la foto, la moto (feminine despite ending in -o, the latter two being shortened forms). Nouns ending in -ción, -sión, -dad, -tad, -umbre are almost always feminine (la nación, la ciudad, la costumbre). Gender must be memorized with each noun, ideally by learning the noun together with its article.",
    englishComparison: "English nouns have no grammatical gender (\"the table\" and \"the chair\" use the same article); Spanish assigns every noun a gender that native speakers feel instinctively but learners must memorize, since it also controls adjective and article agreement throughout the sentence.",
    commonMistakes: [
      "Assuming all -a words are feminine and all -o words are masculine without learning the exceptions (el día, la mano).",
      "Forgetting that adjectives must also change to match the noun's gender, not just the article (un problema grande, not una problema grande).",
      "Guessing gender from the English meaning instead of Spanish word ending/pattern (e.g. assuming \"el clima\" is feminine because \"climate\" feels neutral in English).",
      "Mispronouncing/misgendering words that changed gender historically, like \"la moto\" (motorcycle) and \"la foto\" (photo), which look masculine but are feminine."
    ],
    spainExamples: [
      "\"El coche es nuevo\" — coche is masculine, a very frequent Spain word for \"car\".",
      "\"La moto está aparcada en la calle\" — moto is feminine even though it ends in -o (short for \"motocicleta\").",
      "\"El problema es que no hay wifi en el piso\" — problema is masculine despite ending in -a."
    ],
    exampleSentences: [
      { es: "El día está muy soleado.", en: "The day is very sunny." },
      { es: "La mano derecha me duele.", en: "My right hand hurts." },
      { es: "Ese idioma es muy difícil.", en: "That language is very difficult." },
      { es: "La ciudad de Sevilla es preciosa.", en: "The city of Seville is beautiful." },
      { es: "Mi foto favorita está en el móvil.", en: "My favorite photo is on my mobile phone." }
    ],
    memoryTricks: "Learn the mnemonic \"EL DÍA MAPA PROBLEMA\" as one chant for -a words that are secretly masculine, and \"LA MANO FOTO MOTO\" for -o words that are secretly feminine.",
    visualExplanation: "Pattern table: -o → masculine (el libro) [exceptions: la mano, la foto, la moto] | -a → feminine (la casa) [exceptions: el día, el mapa, el problema, el idioma, el planeta] | -ción/-sión → feminine (la información) | -dad/-tad → feminine (la ciudad, la libertad).",
    exercises: [
      { type: "multiple-choice", prompt: "Which of these -a nouns is actually masculine?", options: ["la casa", "el problema", "la mesa", "la ventana"], answer: "el problema", explanation: "\"Problema\" comes from Greek and is masculine despite ending in -a." },
      { type: "fill-blank", prompt: "___ mano me duele mucho (the).", answer: "la", explanation: "\"Mano\" ends in -o but is feminine, so it takes \"la\"." },
      { type: "error-correction", prompt: "El día es soleada.", answer: "El día es soleado.", explanation: "\"Día\" is masculine, so the adjective \"soleado\" must also be masculine, not \"soleada\"." },
      { type: "translation", prompt: "The map is on the table.", answer: "El mapa está en la mesa.", explanation: "\"Mapa\" is masculine despite ending in -a; \"mesa\" is feminine." },
      { type: "sentence-building", words: ["moto", "mi", "nueva", "es"], answer: "Mi moto es nueva.", explanation: "\"Moto\" is feminine, so the adjective \"nueva\" must agree, even though moto ends in -o." },
      { type: "dialogue-completion", prompt: "—¿De quién es ___ foto? —Es ___ foto de mi hermana.", answer: "esa / la", explanation: "\"Foto\" is feminine, so it takes feminine determiners even though it ends in -o." }
    ]
  },
  {
    id: "gram_plural",
    title: "El plural (Plural Forms)",
    level: "A1",
    tier: "beginner",
    simpleExplanation: "To make a Spanish noun plural, add -s if it ends in a vowel, or -es if it ends in a consonant, and the article/adjectives change too.",
    detailedExplanation: "Nouns ending in an unstressed vowel simply add -s (casa → casas). Nouns ending in a consonant add -es (ciudad → ciudades, profesor → profesores). Nouns ending in -z change the z to c before adding -es (lápiz → lápices, vez → veces). Nouns ending in a stressed vowel often add -es too (café → cafés is an exception with just -s, but rubí → rubíes is more standard). Articles and adjectives must also become plural to agree (el libro rojo → los libros rojos).",
    englishComparison: "English mostly adds -s or -es too (cat/cats, box/boxes), so the core idea is familiar, but English doesn't require adjectives or articles to also change for plural — Spanish does (a red car → los coches rojos, not \"los coche rojo\").",
    commonMistakes: [
      "Forgetting to pluralize the article and adjective along with the noun (\"los coche rojo\" instead of \"los coches rojos\").",
      "Not changing z to c before -es (writing \"lapizes\" instead of \"lápices\").",
      "Adding only -s to words ending in a consonant instead of -es (\"ciudads\" instead of \"ciudades\").",
      "Mispluralizing compound or invariable nouns like \"el paraguas\" (singular umbrella) → \"los paraguas\" (plural), which doesn't change form."
    ],
    spainExamples: [
      "\"Los pisos en Madrid son muy caros\" — pisos (flats) is the everyday Spain word for apartments.",
      "\"Ponnos dos cañas y unas bravas\" — plural nouns typical of a Spanish tapas order.",
      "\"Los autobuses llegan tarde los domingos\" — autobús → autobuses, note the accent disappears in the plural because the stress pattern changes."
    ],
    exampleSentences: [
      { es: "Tengo dos hermanos y una hermana.", en: "I have two brothers and one sister." },
      { es: "Los estudiantes llegan a las nueve.", en: "The students arrive at nine." },
      { es: "Compré tres lápices nuevos.", en: "I bought three new pencils." },
      { es: "Las ciudades españolas son muy bonitas.", en: "Spanish cities are very beautiful." },
      { es: "Los autobuses en Madrid son puntuales.", en: "The buses in Madrid are punctual." }
    ],
    memoryTricks: "Remember \"VOWEL + S, CONSONANT + ES\" as a chant, and for -z words think \"Z becomes C before you can sneeze (-ES)\": lápiz → lápices.",
    visualExplanation: "Rules table: vowel ending → +s (casa → casas) | consonant ending → +es (ciudad → ciudades) | -z ending → change to c +es (lápiz → lápices) | article agreement: el → los, la → las, un → unos, una → unas.",
    exercises: [
      { type: "multiple-choice", prompt: "What is the plural of \"lápiz\"?", options: ["lapizes", "lápizes", "lápices", "lápics"], answer: "lápices", explanation: "Words ending in -z change z to c before adding -es." },
      { type: "fill-blank", prompt: "Los ___ (profesor) de este instituto son muy buenos.", answer: "profesores", explanation: "Consonant-ending nouns add -es: profesor → profesores." },
      { type: "error-correction", prompt: "Los coche son caros en España.", answer: "Los coches son caros en España.", explanation: "\"Coche\" must also become plural — \"coches\" — to agree with \"los\"." },
      { type: "translation", prompt: "The cities are beautiful.", answer: "Las ciudades son bonitas.", explanation: "\"Ciudad\" ends in a consonant, so the plural is \"ciudades\"." },
      { type: "sentence-building", words: ["autobuses", "puntuales", "los", "son"], answer: "Los autobuses son puntuales.", explanation: "\"Autobús\" loses its accent in the plural form \"autobuses\" because the stress falls naturally on the same syllable." },
      { type: "dialogue-completion", prompt: "—¿Cuántos ___ (hermano) tienes? —Tengo dos ___ y una hermana.", answer: "hermanos / hermanos", explanation: "Mixed-gender groups use the masculine plural form \"hermanos\"." }
    ]
  },
  {
    id: "gram_adjectives",
    title: "Los adjetivos (Adjectives)",
    level: "A1",
    tier: "beginner",
    simpleExplanation: "Spanish adjectives must match the gender and number of the noun they describe, and they usually go after the noun, not before it.",
    detailedExplanation: "Adjectives ending in -o have four forms (alto/alta/altos/altas) to match masculine/feminine and singular/plural. Adjectives ending in -e or most consonants only change for number, not gender (interesante/interesantes; fácil/fáciles). Word order is usually noun + adjective (una casa grande), the reverse of English. A few adjectives change meaning depending on position: un amigo viejo (an elderly friend) vs un viejo amigo (a long-time friend); gran vs grande shortens before singular nouns (un gran hombre = a great man, un hombre grande = a big man).",
    englishComparison: "English adjectives never change form (\"a tall man\", \"a tall woman\", \"tall men\") and always go before the noun. Spanish adjectives must agree in gender/number and typically follow the noun, which feels backwards to English speakers at first.",
    commonMistakes: [
      "Placing the adjective before the noun by default, mirroring English word order (\"una bonita casa\" is possible for emphasis, but \"una casa bonita\" is the neutral, most common order).",
      "Forgetting to change adjective endings to match a feminine or plural noun (\"un chica alto\" instead of \"una chica alta\").",
      "Using \"grande\" before a singular noun without shortening it to \"gran\" (\"un grande hombre\" instead of \"un gran hombre\").",
      "Applying gender agreement to invariable adjectives like \"interesante\", which only changes for number, not gender."
    ],
    spainExamples: [
      "\"Es un tío muy majo\" — \"majo/maja\" is a very Spain-specific adjective meaning nice/likeable, rarely used this way in Latin America.",
      "\"Este bar está guay\" — \"guay\" (cool) is a classic Spain slang adjective, invariable in form.",
      "\"Qué piso tan chulo\" — \"chulo/a\" (cool, neat) is common informal Spain Spanish, agreeing in gender with the noun."
    ],
    exampleSentences: [
      { es: "Tengo un coche rojo y una bici azul.", en: "I have a red car and a blue bike." },
      { es: "Mi hermana es muy inteligente.", en: "My sister is very intelligent." },
      { es: "Son unos pisos pequeños pero bonitos.", en: "They are small but pretty flats." },
      { es: "Es un gran amigo, siempre me ayuda.", en: "He's a great friend, he always helps me." },
      { es: "Las playas de Galicia son impresionantes.", en: "The beaches of Galicia are impressive." }
    ],
    memoryTricks: "Think \"noun first, describe it after\" — like a photograph: you see the thing (casa) before you note the quality (grande). For agreement, picture the adjective as an echo that must copy the noun's ending.",
    visualExplanation: "Agreement pattern for -o adjectives: alto (m. sg) | alta (f. sg) | altos (m. pl) | altas (f. pl). Invariable-gender pattern for -e/consonant adjectives: interesante (m/f sg) | interesantes (m/f pl). Shortened forms before masc. singular nouns: grande → gran, bueno → buen, malo → mal.",
    exercises: [
      { type: "multiple-choice", prompt: "Which sentence has correct adjective agreement?", options: ["La casa es blanco.", "La casa es blanca.", "El casa es blanca.", "La casas es blanca."], answer: "La casa es blanca.", explanation: "\"Casa\" is feminine singular, so the adjective must be \"blanca\"." },
      { type: "fill-blank", prompt: "Mis amigas son muy ___ (simpático).", answer: "simpáticas", explanation: "The adjective must agree with feminine plural \"amigas\"." },
      { type: "error-correction", prompt: "Es un grande problema para todos.", answer: "Es un gran problema para todos.", explanation: "\"Grande\" shortens to \"gran\" before a singular noun of either gender." },
      { type: "translation", prompt: "She is a very kind woman.", answer: "Es una mujer muy amable.", explanation: "\"Amable\" is invariable for gender, only changes for number." },
      { type: "sentence-building", words: ["bonitas", "son", "las", "playas"], answer: "Las playas son bonitas.", explanation: "\"Playas\" is feminine plural, so \"bonitas\" must match." },
      { type: "dialogue-completion", prompt: "—¿Cómo es tu piso? —Es ___ (pequeño) pero muy ___ (cómodo).", answer: "pequeño / cómodo", explanation: "\"Piso\" is masculine singular, so both adjectives take the -o ending." }
    ]
  },
  {
    id: "gram_ser",
    title: "El verbo Ser",
    level: "A1",
    tier: "beginner",
    simpleExplanation: "\"Ser\" means \"to be\" for permanent or defining characteristics: identity, origin, profession, physical traits, and time.",
    detailedExplanation: "Ser is used for things that define what something/someone fundamentally is: nationality and origin (Soy de Madrid), profession (Es médico), physical/personality characteristics (Es alto, es simpático), material (La mesa es de madera), time and dates (Son las tres, Es lunes), and relationships (Es mi hermano). It contrasts with estar, which is used for temporary states, locations, and conditions. The present tense of ser is fully irregular and must be memorized.",
    englishComparison: "English has just one verb \"to be\" for all these meanings, so English speakers must learn to split that single concept into ser vs estar depending on whether the quality is essential/defining (ser) or temporary/positional (estar) — a distinction with no direct English grammatical equivalent.",
    commonMistakes: [
      "Using estar for professions or nationality (\"Estoy profesor\" instead of \"Soy profesor\").",
      "Using ser for location (\"La tienda es en el centro\" instead of \"La tienda está en el centro\").",
      "Forgetting ser is irregular and trying to conjugate it like a regular -er verb.",
      "Confusing \"es\" (he/she/it is) with \"está\" when describing someone's mood versus their character."
    ],
    spainExamples: [
      "\"Soy de Bilbao, pero vivo en Madrid\" — typical way Spaniards introduce their origin versus current residence.",
      "\"¿Qué hora es? Son las ocho y media\" — telling the time always uses ser.",
      "\"Mi padre es funcionario\" — \"funcionario\" (civil servant) is a very common profession word in Spain given the size of the public sector."
    ],
    exampleSentences: [
      { es: "Soy español, de Valencia.", en: "I am Spanish, from Valencia." },
      { es: "Mi madre es profesora de instituto.", en: "My mother is a high school teacher." },
      { es: "Vosotros sois muy majos.", en: "You all (informal) are very nice." },
      { es: "Hoy es viernes, por fin.", en: "Today is Friday, finally." },
      { es: "Estas gafas son de mi hermano.", en: "These glasses are my brother's." }
    ],
    memoryTricks: "Use the acronym DOCTOR for ser: Description, Occupation, Characteristic, Time, Origin, Relationship — all the categories that call for ser instead of estar.",
    visualExplanation: "Present tense of ser: yo soy | tú eres | él/ella/usted es | nosotros/as somos | vosotros/as sois | ellos/ellas/ustedes son.",
    exercises: [
      { type: "multiple-choice", prompt: "Complete: \"Nosotros ___ de Sevilla.\"", options: ["somos", "estamos", "son", "es"], answer: "somos", explanation: "Origin is expressed with ser: nosotros somos." },
      { type: "fill-blank", prompt: "Vosotros ___ (ser) muy simpáticos.", answer: "sois", explanation: "The vosotros form of ser is \"sois\", used for informal plural \"you\" in Spain." },
      { type: "error-correction", prompt: "Mi hermano está médico en el hospital.", answer: "Mi hermano es médico en el hospital.", explanation: "Professions require ser, not estar." },
      { type: "translation", prompt: "What time is it? It's two o'clock.", answer: "¿Qué hora es? Son las dos.", explanation: "Telling time in Spanish always uses ser, not estar." },
      { type: "sentence-building", words: ["sois", "muy", "amables", "vosotros"], answer: "Vosotros sois muy amables.", explanation: "\"Vosotros\" pairs with \"sois\", the informal plural form used across Spain." },
      { type: "dialogue-completion", prompt: "—¿De dónde ___ vosotros? —___ de Zaragoza.", answer: "sois / Somos", explanation: "Ser conjugates as \"sois\" for vosotros and \"somos\" for nosotros when discussing origin." }
    ]
  },
  {
    id: "gram_estar",
    title: "El verbo Estar",
    level: "A1",
    tier: "beginner",
    simpleExplanation: "\"Estar\" means \"to be\" for location, temporary states, feelings, and ongoing actions (with the gerund).",
    detailedExplanation: "Estar is used for physical location of people, places, and objects (Madrid está en España), temporary conditions and feelings (Estoy cansado, Está enfadada), and continuous/progressive actions with the gerund (Estoy trabajando). Location with estar applies even to \"permanent\" buildings — Spanish grammar treats location as always requiring estar, regardless of how permanent the place is. Estar is irregular in the yo form (estoy) and carries written accents on several forms.",
    englishComparison: "English uses \"to be\" for both location and temporary states without distinguishing them, so English speakers must learn that Spanish requires estar specifically whenever talking about where something is or a changeable condition, contrasting with ser for defining traits.",
    commonMistakes: [
      "Using ser for location instead of estar (\"El museo es en el centro\" instead of \"El museo está en el centro\").",
      "Confusing \"es aburrido\" (he/it is boring, a trait — ser) with \"está aburrido\" (he is bored right now — estar); these two sentences mean very different things.",
      "Forgetting the accent on estás/está/estáis when writing.",
      "Using ser instead of estar with the progressive gerund construction (\"Soy trabajando\" instead of \"Estoy trabajando\")."
    ],
    spainExamples: [
      "\"El bar está a la vuelta de la esquina\" — typical Spain way to give directions using estar for location.",
      "\"Estoy hasta arriba de trabajo\" — Spain idiom meaning \"I'm swamped with work\", using estar for a temporary state.",
      "\"¿Estáis listos para la fiesta?\" — vosotros form of estar, everyday informal plural address in Spain."
    ],
    exampleSentences: [
      { es: "Madrid está en el centro de España.", en: "Madrid is in the center of Spain." },
      { es: "Estoy un poco cansada hoy.", en: "I'm a little tired today." },
      { es: "¿Vosotros estáis bien?", en: "Are you all (informal) okay?" },
      { es: "El café está muy caliente.", en: "The coffee is very hot." },
      { es: "Estamos estudiando para el examen.", en: "We are studying for the exam." }
    ],
    memoryTricks: "Use the acronym PLACE for estar: Position, Location, Action (ongoing), Condition, Emotion — the flip side of the ser DOCTOR list.",
    visualExplanation: "Present tense of estar: yo estoy | tú estás | él/ella/usted está | nosotros/as estamos | vosotros/as estáis | ellos/ellas/ustedes están.",
    exercises: [
      { type: "multiple-choice", prompt: "Complete: \"El supermercado ___ cerca de mi piso.\"", options: ["es", "está", "son", "están"], answer: "está", explanation: "Location always uses estar, regardless of permanence." },
      { type: "fill-blank", prompt: "Vosotros ___ (estar) muy callados hoy.", answer: "estáis", explanation: "Vosotros form of estar is \"estáis\", with a written accent." },
      { type: "error-correction", prompt: "Mi abuela es muy cansada después del viaje.", answer: "Mi abuela está muy cansada después del viaje.", explanation: "Tiredness is a temporary state, so it requires estar, not ser." },
      { type: "translation", prompt: "We are in the kitchen.", answer: "Estamos en la cocina.", explanation: "Location requires estar: estamos en la cocina." },
      { type: "sentence-building", words: ["estáis", "vosotros", "listos", "para", "salir"], answer: "Vosotros estáis listos para salir.", explanation: "Vosotros conjugation \"estáis\" describes a temporary readiness state." },
      { type: "dialogue-completion", prompt: "—¿Dónde ___ el baño? —___ al fondo a la derecha.", answer: "está / Está", explanation: "Both blanks use estar because they describe location." }
    ]
  },
  {
    id: "gram_hay",
    title: "Hay (There is / There are)",
    level: "A1",
    tier: "beginner",
    simpleExplanation: "\"Hay\" is an invariable form meaning \"there is\" or \"there are\", used to say something exists, with no plural change.",
    detailedExplanation: "Hay comes from the verb haber and is used to state the existence of something, always in this one impersonal form regardless of singular or plural (Hay un bar / Hay tres bares — never \"han tres bares\"). It's typically followed by an indefinite article, a number, or an indefinite quantity word (mucho, poco, algún), not a definite article — you don't say \"hay el libro\", you'd say \"el libro está aquí\" instead, showing the contrast between existence (hay) and location (estar).",
    englishComparison: "English distinguishes \"there is\" (singular) from \"there are\" (plural); Spanish \"hay\" never changes form no matter how many things you're talking about, which trips up English speakers who instinctively want a plural form.",
    commonMistakes: [
      "Pluralizing hay incorrectly as \"hayn\" or \"han\" for plural nouns — hay never changes form.",
      "Using hay with a definite article (\"Hay el pan en la mesa\") instead of estar (\"El pan está en la mesa\") when the thing is already identified/specific.",
      "Confusing hay (existence) with estar (location) — hay introduces something new, estar locates something already known.",
      "Forgetting the silent h and mispronouncing \"hay\" starting with an English h-sound."
    ],
    spainExamples: [
      "\"¿Hay algún bar cerca?\" — very typical Spain phrase when looking for the nearest place to get a caña.",
      "\"No hay de qué\" — a common Spain response to \"gracias\", meaning \"don't mention it\".",
      "\"Hay mucha gente en la Puerta del Sol hoy\" — using hay to describe crowds in a well-known Madrid square."
    ],
    exampleSentences: [
      { es: "Hay un bar muy bueno en esta calle.", en: "There is a very good bar on this street." },
      { es: "Hay muchos turistas en verano.", en: "There are many tourists in summer." },
      { es: "¿Hay algo de comer en la nevera?", en: "Is there anything to eat in the fridge?" },
      { es: "No hay leche, hay que comprar más.", en: "There's no milk, we need to buy more." },
      { es: "Hay tres farmacias cerca de mi piso.", en: "There are three pharmacies near my flat." }
    ],
    memoryTricks: "Remember hay never changes: it's always just \"HAY\", no matter if you mean one thing or a thousand — think of it as a single unchanging stamp: \"HAY = EXISTS\".",
    visualExplanation: "Hay usage: Hay + [un/una/unos/unas/number/mucho/poco] + noun → states existence, singular and plural identical. Contrast: Hay un bar (existence, unspecified) vs El bar está aquí (location, specified/known).",
    exercises: [
      { type: "multiple-choice", prompt: "Which is correct for \"There are five students\"?", options: ["Hayn cinco estudiantes.", "Hay cinco estudiantes.", "Han cinco estudiantes.", "Está cinco estudiantes."], answer: "Hay cinco estudiantes.", explanation: "Hay is invariable and works for both singular and plural." },
      { type: "fill-blank", prompt: "___ un restaurante muy bueno en esta plaza.", answer: "Hay", explanation: "Introducing the existence of something new uses hay." },
      { type: "error-correction", prompt: "Hay el libro que buscas en la mesa.", answer: "El libro que buscas está en la mesa.", explanation: "Once the object is specific/known (\"el libro que buscas\"), use estar for location, not hay." },
      { type: "translation", prompt: "There isn't any bread at home.", answer: "No hay pan en casa.", explanation: "Negation with hay simply adds \"no\" before it." },
      { type: "sentence-building", words: ["hay", "gente", "mucha", "hoy", "aquí"], answer: "Hoy hay mucha gente aquí.", explanation: "Hay stays invariable even with \"mucha gente\", a quantity expression." },
      { type: "dialogue-completion", prompt: "—¿___ farmacias por aquí cerca? —Sí, ___ una justo al lado del banco.", answer: "Hay / hay", explanation: "Both blanks use hay because they refer to unspecified existence of pharmacies." }
    ]
  },
  {
    id: "gram_present_regular",
    title: "Presente de indicativo — verbos regulares (-ar/-er/-ir)",
    level: "A1",
    tier: "beginner",
    simpleExplanation: "Regular Spanish verbs change their endings depending on whether they end in -ar, -er, or -ir, and who is doing the action.",
    detailedExplanation: "To conjugate a regular verb, remove the -ar/-er/-ir ending from the infinitive and add the endings for that verb group. -AR verbs (hablar): -o, -as, -a, -amos, -áis, -an. -ER verbs (comer): -o, -es, -e, -emos, -éis, -en. -IR verbs (vivir): -o, -es, -e, -imos, -ís, -en. Note -er and -ir verbs are identical except for the nosotros and vosotros forms. The present tense in Spanish can translate English simple present (I eat) and present continuous (I am eating) alike.",
    englishComparison: "English present tense barely changes (I eat, you eat, he eats — only the third person adds -s). Spanish present tense has six distinct endings depending on the subject, so the verb ending itself often tells you who's doing the action, which is why subject pronouns are frequently dropped in Spanish.",
    commonMistakes: [
      "Mixing up -er and -ir endings for nosotros/vosotros (comemos vs vivimos, coméis vs vivís) — the only place these two groups differ.",
      "Adding an extra -s to the tú form thinking it's needed like English third person -s (correct is \"tú hablas\", not \"tú hablas\" mistaken for \"él habla\" with -s in the wrong place).",
      "Forgetting the vosotros form entirely and only ever using the ustedes form — vosotros (habláis/coméis/vivís) is essential in Spain for addressing a group informally.",
      "Using the infinitive instead of a conjugated form in a full sentence (\"Yo hablar español\" instead of \"Yo hablo español\")."
    ],
    spainExamples: [
      "\"¿Habláis inglés?\" — vosotros form used constantly across Spain to ask a group of friends if they speak English.",
      "\"Vivimos en un piso compartido\" — \"piso compartido\" (shared flat) is very common phrasing among young people in Spanish cities.",
      "\"Coméis muy tarde en España, ¿no?\" — a comment foreigners often make, using the vosotros form of comer."
    ],
    exampleSentences: [
      { es: "Yo hablo español y un poco de catalán.", en: "I speak Spanish and a bit of Catalan." },
      { es: "Tú comes muy rápido.", en: "You eat very fast." },
      { es: "Nosotros vivimos en Sevilla.", en: "We live in Seville." },
      { es: "¿Vosotros trabajáis los sábados?", en: "Do you all work on Saturdays?" },
      { es: "Ellos estudian en la universidad.", en: "They study at university." }
    ],
    memoryTricks: "Remember \"A-E-A / E-E-E / I-I-I\" pattern trick isn't quite right — instead memorize the vosotros endings as a set: -áis (ar), -éis (er), -ís (ir), all ending with an accented vowel + s, easy to spot in writing.",
    visualExplanation: "hablar: hablo | hablas | habla | hablamos | habláis | hablan. comer: como | comes | come | comemos | coméis | comen. vivir: vivo | vives | vive | vivimos | vivís | viven.",
    exercises: [
      { type: "multiple-choice", prompt: "What is the vosotros form of \"comer\"?", options: ["comemos", "coméis", "comen", "comes"], answer: "coméis", explanation: "The vosotros ending for -er verbs is -éis." },
      { type: "fill-blank", prompt: "Nosotros ___ (vivir) cerca de la playa.", answer: "vivimos", explanation: "The nosotros ending for -ir verbs is -imos." },
      { type: "error-correction", prompt: "Vosotros vivís hablar muy rápido.", answer: "Vosotros habláis muy rápido.", explanation: "The infinitive \"hablar\" must be conjugated to \"habláis\" to match the subject vosotros." },
      { type: "translation", prompt: "Do you all (informal, Spain) work on Fridays?", answer: "¿Vosotros trabajáis los viernes?", explanation: "Vosotros is mandatory here in Peninsular Spanish for informal plural \"you\"." },
      { type: "sentence-building", words: ["estudiamos", "nosotros", "español", "todos", "los", "días"], answer: "Nosotros estudiamos español todos los días.", explanation: "Nosotros pairs with the -amos ending for -ar verbs." },
      { type: "dialogue-completion", prompt: "—¿Dónde ___ (vivir) vosotros? —___ en un piso en el centro.", answer: "vivís / Vivimos", explanation: "Vosotros takes \"vivís\"; the answer uses \"vivimos\" for nosotros." }
    ]
  },
  {
    id: "gram_present_irregular",
    title: "Presente — verbos irregulares (yo irregular y cambios de raíz)",
    level: "A2",
    tier: "beginner",
    simpleExplanation: "Some common verbs change spelling only in the yo form, and others change their stem vowel (e→ie, o→ue, e→i) in most forms except nosotros/vosotros.",
    detailedExplanation: "Irregular yo verbs add an unpredictable first-person form but stay regular elsewhere: tener→tengo, hacer→hago, salir→salgo, poner→pongo, conocer→conozco, ver→veo. Stem-changing verbs shift their stressed vowel in all forms except nosotros and vosotros (because the stress falls on the ending, not the stem, in those two forms): querer (e→ie) → quiero, quieres, quiere, queremos, queréis, quieren; poder (o→ue) → puedo, puedes, puede, podemos, podéis, pueden; pedir (e→i) → pido, pides, pide, pedimos, pedís, piden. Note nosotros and vosotros always keep the original stem vowel unchanged.",
    englishComparison: "English irregular verbs (go/went, be/am/is/are) are irregular across all tenses unpredictably. Spanish stem-changing verbs follow a very predictable pattern: irregular everywhere except nosotros/vosotros, which is a systematic rule once learned, unlike the more chaotic irregularity of English.",
    commonMistakes: [
      "Applying the stem change to nosotros/vosotros forms (\"nosotros queremos\" incorrectly changed to \"quieremos\") — these two forms never change.",
      "Forgetting the irregular yo form and instead regularizing it (\"yo tengo\" mistakenly said as \"yo teno\").",
      "Confusing which vowel changes to which (e→ie vs e→i) since some -ir verbs like pedir go to i instead of ie.",
      "Not applying the stem change at all, treating these as fully regular verbs (\"yo pedo\" instead of \"yo pido\")."
    ],
    spainExamples: [
      "\"¿Queréis venir al cine esta noche?\" — vosotros stem-changing form (querer, e→ie), typical way to invite friends in Spain.",
      "\"Yo siempre pido la tortilla de patatas\" — pedir (e→i), very Spain-relevant dish to order.",
      "\"Tengo que coger el autobús a las ocho\" — irregular yo form of tener (tengo) plus Spain's use of \"coger\"."
    ],
    exampleSentences: [
      { es: "Yo tengo dos hermanos.", en: "I have two siblings." },
      { es: "¿Vosotros queréis un café?", en: "Do you all want a coffee?" },
      { es: "Ella puede venir mañana.", en: "She can come tomorrow." },
      { es: "Nosotros pedimos la cuenta al camarero.", en: "We ask the waiter for the bill." },
      { es: "Yo hago la comida los domingos.", en: "I make lunch on Sundays." }
    ],
    memoryTricks: "Picture stem-changing verbs as a \"boot\" shape: draw a boot around yo, tú, él/ella, ellos on a conjugation chart — those forms change; nosotros and vosotros sit outside the boot and stay regular.",
    visualExplanation: "querer (e→ie): quiero | quieres | quiere | queremos | queréis | quieren. poder (o→ue): puedo | puedes | puede | podemos | podéis | pueden. pedir (e→i): pido | pides | pide | pedimos | pedís | piden. Irregular yo only: tener→tengo, hacer→hago, salir→salgo, poner→pongo.",
    exercises: [
      { type: "multiple-choice", prompt: "Which form of \"querer\" is correct for nosotros?", options: ["quieremos", "queremos", "quiremos", "quieren"], answer: "queremos", explanation: "Nosotros keeps the unstressed stem, so no e→ie change happens." },
      { type: "fill-blank", prompt: "Yo ___ (tener) mucha hambre ahora mismo.", answer: "tengo", explanation: "Tener has an irregular yo form: tengo." },
      { type: "error-correction", prompt: "Nosotros pidemos la cuenta.", answer: "Nosotros pedimos la cuenta.", explanation: "Nosotros never takes the stem change; it stays \"pedimos\", not \"pidemos\"." },
      { type: "translation", prompt: "Can you all (informal, Spain) come to the party?", answer: "¿Podéis venir a la fiesta?", explanation: "Vosotros form of poder is \"podéis\", stem unchanged since stress is on the ending." },
      { type: "sentence-building", words: ["quiere", "ella", "un", "café", "con", "leche"], answer: "Ella quiere un café con leche.", explanation: "Querer stem-changes in the ella form: quiere." },
      { type: "dialogue-completion", prompt: "—¿Qué ___ (pedir) vosotros? —___ la ensalada mixta y el pollo.", answer: "pedís / Pedimos", explanation: "Vosotros form \"pedís\" has no stem change (regular in that form); nosotros \"pedimos\" is also unchanged." }
    ]
  },
  {
    id: "gram_reflexive",
    title: "Los verbos reflexivos (Reflexive Verbs)",
    level: "A2",
    tier: "beginner",
    simpleExplanation: "Reflexive verbs describe an action you do to yourself, and they need a small pronoun (me, te, se, nos, os, se) that matches the subject.",
    detailedExplanation: "Many daily-routine verbs are reflexive in Spanish because the subject performs the action on themselves: levantarse (to get up), ducharse (to shower), vestirse (to get dressed), lavarse (to wash oneself), acostarse (to go to bed). The reflexive pronoun goes right before the conjugated verb (me levanto) or can attach to the end of an infinitive or gerund (voy a levantarme / levantándome). The pronoun must match the subject: yo me, tú te, él/ella/usted se, nosotros nos, vosotros os, ellos/ellas/ustedes se.",
    englishComparison: "English rarely marks reflexivity explicitly (\"I get up\", not \"I get myself up\"); Spanish requires the reflexive pronoun on many verbs where English uses no pronoun at all, which is one of the more counterintuitive features for English speakers to internalize.",
    commonMistakes: [
      "Dropping the reflexive pronoun entirely (\"Yo levanto a las siete\" instead of \"Me levanto a las siete\") because English doesn't need one.",
      "Using the wrong pronoun that doesn't match the subject (\"Yo se levanto\" instead of \"Yo me levanto\").",
      "Forgetting the vosotros reflexive pronoun \"os\" and using \"se\" instead (\"vosotros se levantáis\" is wrong; it should be \"vosotros os levantáis\").",
      "Placing the pronoun incorrectly with an infinitive, e.g. splitting it awkwardly instead of attaching it to the end (\"me voy a levantar\" and \"voy a levantarme\" are both correct, but the pronoun can't float elsewhere)."
    ],
    spainExamples: [
      "\"¿Os levantáis pronto los findes?\" — vosotros reflexive form, casual Spain speech (\"findes\" = fines de semana, weekends).",
      "\"Me pillo el metro para ir a currar\" — reflexive-style \"pillar\" here used colloquially (\"coger/pillar el metro\"), \"currar\" being Spain slang for \"trabajar\".",
      "\"Se me ha olvidado el paraguas\" — reflexive construction expressing accidental forgetting, very typically Spanish in structure."
    ],
    exampleSentences: [
      { es: "Me levanto a las siete todos los días.", en: "I get up at seven every day." },
      { es: "¿Vosotros os ducháis por la mañana o por la noche?", en: "Do you all shower in the morning or at night?" },
      { es: "Ella se viste muy rápido.", en: "She gets dressed very quickly." },
      { es: "Nos acostamos tarde los viernes.", en: "We go to bed late on Fridays." },
      { es: "Los niños se lavan las manos antes de comer.", en: "The children wash their hands before eating." }
    ],
    memoryTricks: "Remember the pronoun set rhymes with the subject pronouns: me-te-se-nos-os-se — say it like a little song matching yo-tú-él-nosotros-vosotros-ellos in order.",
    visualExplanation: "levantarse: me levanto | te levantas | se levanta | nos levantamos | os levantáis | se levantan. Pronoun placement: before conjugated verb (Me ducho) OR attached to infinitive/gerund (Voy a ducharme / Estoy duchándome).",
    exercises: [
      { type: "multiple-choice", prompt: "Which is correct for \"You all (vosotros) go to bed late\"?", options: ["Os acostáis tarde.", "Se acostáis tarde.", "Vos acostáis tarde.", "Nos acostáis tarde."], answer: "Os acostáis tarde.", explanation: "The vosotros reflexive pronoun is \"os\", paired with the verb form \"acostáis\"." },
      { type: "fill-blank", prompt: "Yo ___ (levantarse) muy temprano los lunes.", answer: "me levanto", explanation: "First person reflexive pronoun is \"me\", plus the conjugated verb \"levanto\"." },
      { type: "error-correction", prompt: "Vosotros se laváis las manos antes de comer.", answer: "Vosotros os laváis las manos antes de comer.", explanation: "Vosotros requires the reflexive pronoun \"os\", not \"se\", which is for third person." },
      { type: "translation", prompt: "We get dressed quickly in the mornings.", answer: "Nos vestimos rápido por las mañanas.", explanation: "\"Vestirse\" is reflexive; nosotros pairs with \"nos\"." },
      { type: "sentence-building", words: ["duchan", "se", "niños", "los", "por", "la", "noche"], answer: "Los niños se duchan por la noche.", explanation: "Third person plural reflexive pronoun is \"se\", matching \"los niños\"." },
      { type: "dialogue-completion", prompt: "—¿A qué hora ___ (acostarse) vosotros? —___ sobre las once.", answer: "os acostáis / Nos acostamos", explanation: "Vosotros form uses \"os acostáis\"; the reply uses nosotros \"nos acostamos\"." }
    ]
  },
  {
    id: "gram_questions",
    title: "Las preguntas (Questions and Question Words)",
    level: "A1",
    tier: "beginner",
    simpleExplanation: "Spanish questions use inverted question marks (¿...?) and question words like qué, quién, dónde, cuándo, cómo, cuánto, por qué, all carrying written accents.",
    detailedExplanation: "Yes/no questions in Spanish often just add question marks around a statement, sometimes with a slight change in word order or intonation (¿Hablas español?). Information questions use interrogative words, all of which carry an accent mark when used as a question word (qué, quién/quiénes, dónde, cuándo, cómo, cuánto/a/os/as, cuál/cuáles, por qué). The inverted question mark ¿ at the start of a question is a distinctive Spanish convention not found in English, signaling that a question is coming before you even read it.",
    englishComparison: "English usually needs an auxiliary verb to form a question (\"Do you speak Spanish?\"); Spanish often just needs question marks and intonation without adding an extra auxiliary verb (¿Hablas español? — literally \"Speak you Spanish?\"). English also has no opening question mark, unlike Spanish's ¿.",
    commonMistakes: [
      "Forgetting the opening inverted question mark ¿ when writing.",
      "Forgetting the accent on question words (writing \"como\" instead of \"cómo\", which changes meaning — \"como\" without accent means \"I eat\" or \"like/as\").",
      "Trying to insert an auxiliary verb like English \"do\" (\"¿Haces tú hablas español?\" is wrong — Spanish doesn't use a \"do\" auxiliary).",
      "Confusing \"por qué\" (why, two words with accent) with \"porque\" (because, one word, no accent) and \"porqué\" (the noun \"reason\")."
    ],
    spainExamples: [
      "\"¿Qué tal?\" — extremely common Spain greeting/question meaning \"How's it going?\"",
      "\"¿Dónde está el baño, por favor?\" — practical everyday question in bars and restaurants across Spain.",
      "\"¿Vale? ¿Nos vemos a las ocho?\" — combining the discourse marker \"vale\" with a yes/no question to confirm plans."
    ],
    exampleSentences: [
      { es: "¿Cómo te llamas?", en: "What is your name?" },
      { es: "¿Dónde vives ahora?", en: "Where do you live now?" },
      { es: "¿Cuándo llega el tren?", en: "When does the train arrive?" },
      { es: "¿Por qué no vienes con nosotros?", en: "Why don't you come with us?" },
      { es: "¿Cuánto cuesta este bocadillo?", en: "How much does this sandwich cost?" }
    ],
    memoryTricks: "Remember the \"upside-down umbrella\" ¿ opens every question like an umbrella opening before the rain (the question) starts — and every question word wears an accent \"hat\" (qué, cómo, dónde, cuándo, cuánto, cuál, quién).",
    visualExplanation: "Question word list: qué = what | quién/quiénes = who | dónde = where | cuándo = when | cómo = how | cuánto/a/os/as = how much/many | cuál/cuáles = which | por qué = why. Structure: ¿[question word] + [verb] + [subject]? e.g. ¿Dónde vive tu hermano?",
    exercises: [
      { type: "multiple-choice", prompt: "Which question word means \"why\"?", options: ["porque", "por qué", "cuándo", "cómo"], answer: "por qué", explanation: "\"Por qué\" (two words, accented) means \"why\"; \"porque\" (one word) means \"because\"." },
      { type: "fill-blank", prompt: "¿___ cuesta el billete de tren? (how much)", answer: "Cuánto", explanation: "\"Cuánto\" asks about quantity/price and carries an accent as a question word." },
      { type: "error-correction", prompt: "Como te llamas?", answer: "¿Cómo te llamas?", explanation: "Missing opening question mark ¿ and missing accent on \"cómo\"." },
      { type: "translation", prompt: "Where is the train station?", answer: "¿Dónde está la estación de tren?", explanation: "\"Dónde\" + estar for location, with both question marks." },
      { type: "sentence-building", words: ["el", "tren", "llega", "cuándo", "?"], answer: "¿Cuándo llega el tren?", explanation: "Question word \"cuándo\" leads the sentence, followed by verb and subject." },
      { type: "dialogue-completion", prompt: "—¿___ te llamas? —Me llamo Carlos. —¿Y ___ eres? —Soy de Toledo.", answer: "Cómo / de dónde", explanation: "\"Cómo\" asks for the name; \"de dónde\" asks for origin." }
    ]
  },

  // ============================================================
  // INTERMEDIATE TIER
  // ============================================================
  {
    id: "gram_preterite",
    title: "El pretérito indefinido (Preterite)",
    level: "A2",
    tier: "intermediate",
    simpleExplanation: "The preterite describes completed actions in the past, with a clear beginning and end — like a snapshot of something that happened once.",
    detailedExplanation: "The preterite (pretérito indefinido or pretérito perfecto simple) narrates finished, punctual events: Ayer fui al cine, Comimos en un restaurante nuevo. Regular endings: -AR verbs add -é, -aste, -ó, -amos, -asteis, -aron; -ER/-IR verbs add -í, -iste, -ió, -imos, -isteis, -ieron. Many high-frequency verbs are irregular with a distinct stem and unstressed endings: ser/ir (fui, fuiste, fue, fuimos, fuisteis, fueron — identical for both verbs, distinguished by context), tener (tuve), estar (estuve), hacer (hice), poder (pude), decir (dije), venir (vine).",
    englishComparison: "English forms the simple past by adding -ed or using an irregular past form (I walked, I went) and it doesn't distinguish between a single completed action and a repeated/background action the way Spanish does with preterite vs imperfect — English relies on context, while Spanish has two separate grammatical tenses.",
    commonMistakes: [
      "Using the wrong stress pattern, e.g. stressing \"hablo\" (present) instead of \"habló\" (preterite, he spoke) — the accent is essential and changes meaning/tense.",
      "Regularizing irregular preterites (\"yo hací\" instead of \"yo hice\", \"yo tuve\" said as \"yo tené\").",
      "Confusing ser and ir in the preterite since they share identical forms (fui, fuiste, fue...) — context is the only way to tell them apart.",
      "Adding an accent to irregular preterite forms that don't take one (tuve, hice, dije — no accents, unlike regular preterite forms)."
    ],
    spainExamples: [
      "\"Ayer quedé con mis colegas para tomar unas cañas\" — \"quedar\" (to meet up) and \"colegas\" (mates/friends) are common informal Spain vocabulary in the preterite.",
      "\"Fuimos al Retiro a pasear el domingo pasado\" — El Retiro is Madrid's most famous park, a natural example for locals.",
      "\"¿Vosotros disteis el examen ayer?\" — vosotros preterite form of \"dar\", used to ask a group about a shared past event."
    ],
    exampleSentences: [
      { es: "Ayer fui al cine con mis amigos.", en: "Yesterday I went to the cinema with my friends." },
      { es: "Comimos paella el domingo.", en: "We ate paella on Sunday." },
      { es: "¿Vosotros visteis la nueva película?", en: "Did you all see the new movie?" },
      { es: "Ella tuvo un problema con el coche.", en: "She had a problem with the car." },
      { es: "Los niños jugaron en el parque toda la tarde.", en: "The kids played in the park all afternoon." }
    ],
    memoryTricks: "Think of the preterite as a camera \"click\" — one completed snapshot in time. The written accent on regular forms (hablé, comió) is like the flash of the camera marking the exact completed moment.",
    visualExplanation: "hablar: hablé | hablaste | habló | hablamos | hablasteis | hablaron. comer: comí | comiste | comió | comimos | comisteis | comieron. ir/ser: fui | fuiste | fue | fuimos | fuisteis | fueron.",
    exercises: [
      { type: "multiple-choice", prompt: "What is the preterite \"yo\" form of \"hacer\"?", options: ["hací", "hice", "hago", "hací"], answer: "hice", explanation: "Hacer has an irregular preterite stem \"hic-\" with unstressed endings, giving \"hice\"." },
      { type: "fill-blank", prompt: "Nosotros ___ (comer) en un restaurante nuevo anoche.", answer: "comimos", explanation: "Regular -er preterite nosotros ending is -imos: comimos." },
      { type: "error-correction", prompt: "Ayer yo hablo con mi jefe sobre el proyecto.", answer: "Ayer yo hablé con mi jefe sobre el proyecto.", explanation: "A completed past action needs the preterite \"hablé\", not the present \"hablo\"." },
      { type: "translation", prompt: "They went to Barcelona last summer.", answer: "Fueron a Barcelona el verano pasado.", explanation: "\"Fueron\" is the preterite of ir, used here for a completed trip." },
      { type: "sentence-building", words: ["visteis", "película", "la", "vosotros", "ayer"], answer: "Vosotros visteis la película ayer.", explanation: "Vosotros preterite form of ver is \"visteis\"." },
      { type: "dialogue-completion", prompt: "—¿Qué ___ (hacer) vosotros el fin de semana? —___ una excursión a la sierra.", answer: "hicisteis / Hicimos", explanation: "Vosotros preterite of hacer is \"hicisteis\"; nosotros is \"hicimos\"." }
    ]
  },
  {
    id: "gram_imperfect",
    title: "El pretérito imperfecto (Imperfect)",
    level: "A2",
    tier: "intermediate",
    simpleExplanation: "The imperfect describes ongoing, habitual, or background actions in the past — things that were happening or used to happen, without a clear endpoint.",
    detailedExplanation: "The imperfect is used for habitual past actions (\"used to\"): Cuando era pequeño, jugaba en la calle. It's also used for descriptions and background setting in a story (Hacía sol y la gente paseaba), ongoing actions interrupted by another event (Yo dormía cuando sonó el teléfono), and telling time/age in the past (Eran las tres, Tenía diez años). Only three verbs are irregular in the imperfect: ser (era, eras, era, éramos, erais, eran), ir (iba, ibas, iba, íbamos, ibais, iban), and ver (veía, veías...). Regular endings: -AR verbs add -aba, -abas, -aba, -ábamos, -abais, -aban; -ER/-IR verbs add -ía, -ías, -ía, -íamos, -íais, -ían.",
    englishComparison: "English expresses this with \"used to + verb\" or \"was/were + -ing\" (I used to play, I was playing); Spanish has one dedicated verb tense — the imperfect — for all of these habitual/ongoing past meanings, which is more compact than English's periphrastic constructions.",
    commonMistakes: [
      "Using the preterite for background description or habitual past actions instead of the imperfect (\"Cuando fui pequeño\" instead of \"Cuando era pequeño\").",
      "Thinking almost all verbs are irregular in the imperfect — only ser, ir, and ver are irregular; everything else follows the regular pattern.",
      "Forgetting the accent marks on -er/-ir imperfect endings (comía, vivíamos) which are essential to the correct pronunciation and spelling.",
      "Mixing up imperfect \"era\" (I/he/she was, ongoing) with preterite \"fue\" (was, a completed single event) when describing a past state."
    ],
    spainExamples: [
      "\"Cuando era pequeña, veraneaba en un pueblo de Asturias\" — \"veranear\" (to spend the summer somewhere) is a very Spain-specific verb.",
      "\"Antes vivíamos en un piso más pequeño\" — imperfect used to describe a past habitual living situation, common structure in everyday Spain conversation.",
      "\"¿Vosotros ibais al colegio andando?\" — vosotros imperfect of ir, asking about a childhood habit."
    ],
    exampleSentences: [
      { es: "Cuando era niño, jugaba al fútbol todos los días.", en: "When I was a child, I used to play football every day." },
      { es: "Hacía mucho calor aquel verano.", en: "It was very hot that summer." },
      { es: "Vosotros vivíais cerca de la playa, ¿verdad?", en: "You all used to live near the beach, right?" },
      { es: "Mientras yo cocinaba, ella ponía la mesa.", en: "While I was cooking, she was setting the table." },
      { es: "Eran las diez de la noche cuando llegamos.", en: "It was ten at night when we arrived." }
    ],
    memoryTricks: "Think \"imperfect = unfinished picture\" — imagine an old, faded photograph (a background scene) rather than a sharp snapshot (preterite). The repeated -aba/-ía sound is like a slow, repeating loop, matching its habitual meaning.",
    visualExplanation: "hablar: hablaba | hablabas | hablaba | hablábamos | hablabais | hablaban. comer/vivir: comía | comías | comía | comíamos | comíais | comían. Irregulars — ser: era, eras, era, éramos, erais, eran. ir: iba, ibas, iba, íbamos, ibais, iban.",
    exercises: [
      { type: "multiple-choice", prompt: "Which verb is irregular in the imperfect?", options: ["hablar", "comer", "ir", "vivir"], answer: "ir", explanation: "Only ser, ir, and ver are irregular in the imperfect; ir becomes iba, ibas, iba..." },
      { type: "fill-blank", prompt: "Cuando ___ (ser) pequeños, jugábamos en la calle.", answer: "éramos", explanation: "Imperfect of ser for nosotros is \"éramos\"." },
      { type: "error-correction", prompt: "Cuando tenía diez años, fui a la playa todos los veranos.", answer: "Cuando tenía diez años, iba a la playa todos los veranos.", explanation: "A repeated/habitual past action (\"every summer\") needs the imperfect \"iba\", not the preterite \"fui\"." },
      { type: "translation", prompt: "We used to live in Barcelona.", answer: "Vivíamos en Barcelona.", explanation: "\"Used to live\" (habitual past state) maps to the Spanish imperfect \"vivíamos\"." },
      { type: "sentence-building", words: ["hacía", "frío", "mucho", "invierno", "aquel"], answer: "Aquel invierno hacía mucho frío.", explanation: "Weather description in the past uses the imperfect: \"hacía frío\"." },
      { type: "dialogue-completion", prompt: "—¿Dónde ___ (vivir) vosotros de pequeños? —___ en un pueblo de Galicia.", answer: "vivíais / Vivíamos", explanation: "Vosotros imperfect of vivir is \"vivíais\"; nosotros is \"vivíamos\"." }
    ]
  },
  {
    id: "gram_preterite_vs_imperfect",
    title: "Pretérito vs. Imperfecto (Choosing the Right Past Tense)",
    level: "B1",
    tier: "intermediate",
    simpleExplanation: "Use the preterite for completed actions/events, and the imperfect for background description, ongoing actions, or habits — often both appear together in the same story.",
    detailedExplanation: "The classic contrast: the imperfect sets the scene (what was going on, what things were like), and the preterite reports what happened, often interrupting that scene: Yo dormía (imperfect, ongoing) cuando sonó el teléfono (preterite, sudden interrupting event). Other clues: words like \"siempre\", \"todos los días\", \"de niño/a\" tend to trigger imperfect (habitual), while \"ayer\", \"una vez\", \"de repente\", \"el año pasado\" tend to trigger preterite (single completed event). Some verbs change English translation depending on which past tense is used: sabía (I knew) vs supe (I found out); conocía (I knew/was acquainted with) vs conocí (I met for the first time); quería (I wanted) vs quise (I tried/attempted); no quería (I didn't want) vs no quise (I refused).",
    englishComparison: "English uses one simple past form for almost everything and relies on context or extra words to show the nuance (\"I knew\" vs \"I found out\" both need different verbs in English, e.g. \"know\" vs \"find out\", whereas Spanish uses the same verb saber in two different tenses to capture that shift), so English speakers must learn to actively choose between two grammatical tools that don't map to two different English tenses.",
    commonMistakes: [
      "Defaulting to the preterite for everything since it feels like the \"normal\" past tense to an English speaker.",
      "Using preterite for background/scene-setting description (\"Era las tres y hizo sol\" instead of \"Eran las tres y hacía sol\").",
      "Missing the meaning shift with verbs like saber/conocer/querer/poder, translating supe and sabía identically as \"I knew\".",
      "Using imperfect for a clearly single, completed, bounded event (\"Ayer comía en un restaurante nuevo\" instead of \"Ayer comí en un restaurante nuevo\")."
    ],
    spainExamples: [
      "\"Estaba en el bar cuando empezó a llover\" — imperfect sets the scene (estaba), preterite reports the sudden event (empezó).",
      "\"De pequeño, iba al colegio andando, pero un día cogí el autobús porque llovía mucho\" — combines habitual imperfect (iba, llovía) with a single preterite event (cogí).",
      "\"No conocía Madrid hasta que fui el año pasado\" — imperfect (didn't know/hadn't been) contrasted with preterite (went, a completed trip)."
    ],
    exampleSentences: [
      { es: "Hacía sol cuando salimos de casa.", en: "It was sunny when we left home." },
      { es: "Yo dormía cuando llamaste.", en: "I was sleeping when you called." },
      { es: "Conocí a mi mejor amiga en la universidad.", en: "I met my best friend at university." },
      { es: "De niños, íbamos a la playa cada verano.", en: "As kids, we used to go to the beach every summer." },
      { es: "Ayer supe que se mudaban de piso.", en: "Yesterday I found out they were moving flats." }
    ],
    memoryTricks: "Picture the imperfect as the movie's background set (still, painted, unfinished) and the preterite as the actor walking on stage and doing something (a discrete completed action). Ask: \"Is this the scenery, or the event?\"",
    visualExplanation: "Signal words → imperfect: siempre, todos los días, de niño/a, mientras, a menudo. Signal words → preterite: ayer, una vez, de repente, el año pasado, anoche. Meaning-shift verbs: saber (sabía=knew / supe=found out) — conocer (conocía=knew / conocí=met) — querer (quería=wanted / quise=tried) — poder (podía=was able/capable / pude=managed to, succeeded).",
    exercises: [
      { type: "multiple-choice", prompt: "Complete: \"___ las once cuando ___ a casa.\"", options: ["Eran / llegamos", "Fueron / llegábamos", "Eran / llegábamos", "Fue / llegamos"], answer: "Eran / llegamos", explanation: "Time-setting uses imperfect (Eran las once); the completed arrival event uses preterite (llegamos)." },
      { type: "fill-blank", prompt: "Ayer yo ___ (saber) que mi vecina se mudaba de piso.", answer: "supe", explanation: "\"Supe\" (preterite of saber) means \"found out\", matching a single completed discovery." },
      { type: "error-correction", prompt: "Cuando era joven, viví en Madrid durante diez años y trabajé como profesor mientras vivía allí.", answer: "Cuando era joven, viví en Madrid durante diez años y trabajaba como profesor mientras vivía allí.", explanation: "\"Trabajaba\" (imperfect) fits better as an ongoing background activity during the ten years, paired with \"vivía\"; \"viví\" as the bounded ten-year stay can stay preterite." },
      { type: "translation", prompt: "I was watching TV when the phone rang.", answer: "Veía la tele cuando sonó el teléfono.", explanation: "Ongoing background action (veía) interrupted by a sudden event (sonó)." },
      { type: "sentence-building", words: ["llovía", "cuando", "salimos", "mucho", "de", "casa"], answer: "Llovía mucho cuando salimos de casa.", explanation: "Background weather (llovía) is imperfect; the completed action of leaving (salimos) is preterite." },
      { type: "dialogue-completion", prompt: "—¿Qué ___ (hacer) tú cuando ___ (sonar) el timbre? —___ (cocinar) la cena.", answer: "hacías / sonó / Cocinaba", explanation: "Ongoing action = imperfect (hacías, cocinaba); the interrupting event = preterite (sonó)." }
    ]
  },
  {
    id: "gram_future",
    title: "El futuro simple (Simple Future)",
    level: "A2",
    tier: "intermediate",
    simpleExplanation: "The simple future says what will happen, formed by adding endings directly onto the full infinitive of the verb.",
    detailedExplanation: "Unlike other tenses, the future is formed by adding endings to the whole infinitive (not a stem): hablaré, comeré, viviré. The endings are the same for all three verb groups: -é, -ás, -á, -emos, -éis, -án. A handful of common verbs have an irregular future stem while keeping the same endings: tener→tendré, hacer→haré, poder→podré, decir→diré, salir→saldré, venir→vendré, querer→querré, saber→sabré, poner→pondré. Spanish speakers, especially in everyday spoken Spain Spanish, often prefer \"ir a + infinitive\" (voy a comer) for near-future plans, reserving the simple future for more formal predictions, promises, or probability (\"Serán las cinco\" = It's probably five o'clock).",
    englishComparison: "English future uses the auxiliary \"will\" before the base verb (I will speak); Spanish instead changes the verb ending itself, with no separate auxiliary word needed, and native speakers often prefer the \"going to\" equivalent (ir a + infinitive) for near-future plans just like colloquial English does.",
    commonMistakes: [
      "Trying to form the future off a truncated stem like other tenses (\"habl-\" + \"aré\") instead of adding endings onto the complete infinitive (\"hablar\" + \"é\" = hablaré).",
      "Forgetting the accent marks on all persons except nosotros (hablaré, hablarás, hablará — all accented; hablaremos has no written accent).",
      "Overusing the simple future for near-term plans, where natural Spain Spanish would prefer \"voy a + infinitive\" in casual conversation.",
      "Misapplying the irregular stems, e.g. saying \"tendré\" as \"teneré\" instead of dropping the e (tener → tendr- + é)."
    ],
    spainExamples: [
      "\"El año que viene haré el examen de la EBAU\" — EBAU is the Spain university entrance exam, a very locally relevant example.",
      "\"¿Vendréis a la boda de mi prima?\" — vosotros future form, common when discussing weddings and family events.",
      "\"Serán las nueve, más o menos\" — using the future for probability/guessing, a very natural Spain conversational habit."
    ],
    exampleSentences: [
      { es: "Mañana hablaré con el jefe sobre las vacaciones.", en: "Tomorrow I'll talk to the boss about the holidays." },
      { es: "El año que viene viviremos en Barcelona.", en: "Next year we will live in Barcelona." },
      { es: "¿Vosotros vendréis a la fiesta del sábado?", en: "Will you all come to Saturday's party?" },
      { es: "Ella tendrá que estudiar mucho para el examen.", en: "She will have to study a lot for the exam." },
      { es: "No sé qué hora es; serán las siete.", en: "I don't know what time it is; it's probably seven." }
    ],
    memoryTricks: "Remember \"whole infinitive + ending\" by thinking of the future as \"the infinitive growing a tail\": hablar → hablar+é. For irregulars, group them by pattern: drop-e (podré, sabré, querré, habré), and d-insert (tendré, pondré, saldré, vendré).",
    visualExplanation: "hablar: hablaré | hablarás | hablará | hablaremos | hablaréis | hablarán. Irregular stems: tener→tendr- | hacer→har- | poder→podr- | decir→dir- | salir→saldr- | venir→vendr- (endings stay -é, -ás, -á, -emos, -éis, -án).",
    exercises: [
      { type: "multiple-choice", prompt: "What is the correct future form of \"hacer\" for yo?", options: ["haceré", "haré", "hací", "hazré"], answer: "haré", explanation: "\"Hacer\" has an irregular future stem \"har-\", giving \"haré\"." },
      { type: "fill-blank", prompt: "Vosotros ___ (tener) que llegar antes de las ocho.", answer: "tendréis", explanation: "Tener's irregular future stem is \"tendr-\", plus the vosotros ending \"-éis\"." },
      { type: "error-correction", prompt: "Mañana yo hablaré con ella y tú tambien hablará con ella.", answer: "Mañana yo hablaré con ella y tú también hablarás con ella.", explanation: "The tú future ending is \"-ás\" (hablarás), not \"-á\" (which is for él/ella/usted)." },
      { type: "translation", prompt: "We will travel to Galicia next summer.", answer: "Viajaremos a Galicia el próximo verano.", explanation: "Regular -ar future for nosotros: viajaremos." },
      { type: "sentence-building", words: ["vendréis", "vosotros", "boda", "a", "la", "?"], answer: "¿Vosotros vendréis a la boda?", explanation: "Vosotros future of venir uses the irregular stem \"vendr-\" plus \"-éis\"." },
      { type: "dialogue-completion", prompt: "—¿Qué ___ (hacer) vosotros este verano? —___ un viaje a Portugal.", answer: "haréis / Haremos", explanation: "Vosotros future of hacer is \"haréis\"; nosotros is \"haremos\"." }
    ]
  },
  {
    id: "gram_conditional",
    title: "El condicional simple (Simple Conditional)",
    level: "B1",
    tier: "intermediate",
    simpleExplanation: "The conditional expresses what would happen, formed with the same stem as the future plus -ía endings.",
    detailedExplanation: "The conditional uses the exact same stems as the future tense (including the same irregular stems) but adds the endings -ía, -ías, -ía, -íamos, -íais, -ían to the full infinitive: hablaría, comería, viviría. It expresses hypothetical actions (Yo viajaría si tuviera dinero), polite requests (¿Podrías ayudarme?), and softened suggestions (Deberías estudiar más). It's also used for reported future-in-the-past (Dijo que vendría mañana) and for probability in the past (Serían las diez cuando llegó — It was probably ten when he arrived).",
    englishComparison: "English forms the conditional with the auxiliary \"would\" (I would speak); Spanish again changes the verb ending, this time with -ía endings on the infinitive stem, mirroring the same irregular-stem pattern used in the future tense.",
    commonMistakes: [
      "Forgetting that conditional irregular stems are identical to future irregular stems (tendría, not teneria; haría, not haceria).",
      "Confusing the conditional -ía endings with the imperfect -ía endings on -er/-ir verbs (comería [conditional, \"would eat\"] vs comía [imperfect, \"used to eat/was eating\"]) — the difference is the added -r- before -ía in the conditional.",
      "Using the present tense instead of the conditional for polite requests (\"¿Puedes ayudarme?\" is fine but less formal/polite than \"¿Podrías ayudarme?\").",
      "Omitting the accent mark, though conditional endings are always accented on every syllable of -ía, unlike some future forms."
    ],
    spainExamples: [
      "\"¿Podrías pasarme la sal, por favor?\" — extremely common polite request structure heard at any Spanish dinner table.",
      "\"Yo que tú, cogería el AVE en vez del coche\" — AVE is Spain's high-speed train, a locally relevant example of giving advice with the conditional.",
      "\"Me encantaría ir a la Feria de Abril algún día\" — expressing a hypothetical wish about a well-known Sevillian festival."
    ],
    exampleSentences: [
      { es: "Me gustaría vivir en la costa algún día.", en: "I would like to live on the coast someday." },
      { es: "¿Podrías cerrar la ventana, por favor?", en: "Could you close the window, please?" },
      { es: "Yo en tu lugar hablaría con el profesor.", en: "In your place, I would talk to the teacher." },
      { es: "Dijo que llegaría antes de las nueve.", en: "He said he would arrive before nine." },
      { es: "Serían las once cuando por fin nos dormimos.", en: "It was probably eleven when we finally fell asleep." }
    ],
    memoryTricks: "Think \"future stem + IMPERFECT-style ending\" — the conditional is literally the future's irregular stem wearing the imperfect's -ía costume. If you know the future irregular stems already, the conditional is nearly free.",
    visualExplanation: "hablar: hablaría | hablarías | hablaría | hablaríamos | hablaríais | hablarían. Irregular stems (same as future): tener→tendría | hacer→haría | poder→podría | decir→diría | salir→saldría | venir→vendría.",
    exercises: [
      { type: "multiple-choice", prompt: "Which sentence politely asks for help?", options: ["¿Puedas ayudarme?", "¿Podrías ayudarme?", "¿Podías ayudarme?", "¿Podrás ayudarme?"], answer: "¿Podrías ayudarme?", explanation: "The conditional \"podrías\" softens the request into a polite form." },
      { type: "fill-blank", prompt: "Yo, en tu lugar, ___ (hablar) con el jefe primero.", answer: "hablaría", explanation: "Hypothetical advice uses the conditional: hablaría." },
      { type: "error-correction", prompt: "De pequeño, comería mucho helado todos los veranos.", answer: "De pequeño, comía mucho helado todos los veranos.", explanation: "A habitual past action needs the imperfect \"comía\", not the conditional \"comería\" (would eat)." },
      { type: "translation", prompt: "I would love to visit Granada.", answer: "Me encantaría visitar Granada.", explanation: "\"Me encantaría\" is the natural conditional way to express a hypothetical wish." },
      { type: "sentence-building", words: ["deberíais", "más", "vosotros", "descansar"], answer: "Vosotros deberíais descansar más.", explanation: "Vosotros conditional of deber is \"deberíais\", giving polite/softened advice." },
      { type: "dialogue-completion", prompt: "—¿Qué ___ (hacer) vosotros con el dinero del premio? —___ un viaje por toda España.", answer: "haríais / Haríamos", explanation: "Vosotros conditional of hacer is \"haríais\"; nosotros is \"haríamos\"." }
    ]
  },
  {
    id: "gram_direct_object_pronouns",
    title: "Los pronombres de objeto directo (Direct Object Pronouns)",
    level: "A2",
    tier: "intermediate",
    simpleExplanation: "Direct object pronouns (lo, la, los, las, me, te, nos, os) replace the noun that directly receives the action, and they normally go right before the conjugated verb.",
    detailedExplanation: "Direct object pronouns replace the thing/person directly affected by the verb: me, te, lo/la, nos, os, los/las. They answer the question \"what?\" or \"whom?\" (¿Compraste el pan? → Sí, lo compré). They go before a conjugated verb (Lo veo) or attach to the end of an infinitive/gerund/affirmative command (Voy a verlo / Viéndolo / Cómpralo). In Spain, an important dialectal feature is leísmo: many Spain speakers use \"le\" instead of \"lo\" for a masculine person direct object (Le vi ayer = I saw him yesterday), which is grammatically accepted by the RAE specifically for masculine persons, even though \"lo\" remains the prescriptively neutral standard form.",
    englishComparison: "English direct object pronouns (him, her, it, them) always go after the verb (I see him); Spanish direct object pronouns normally go before the conjugated verb (Lo veo), which is a fundamental word-order difference English speakers must practice.",
    commonMistakes: [
      "Placing the pronoun after the conjugated verb like in English (\"Veo lo\" instead of \"Lo veo\").",
      "Confusing direct object lo/la with indirect object le/les when both could appear (Le compré un regalo [indirect, to whom] vs Lo compré [direct, what]).",
      "Not attaching the pronoun to an infinitive or affirmative command when required (\"Voy a lo comprar\" instead of \"Voy a comprarlo\").",
      "Over-generalizing leísmo to feminine or plural objects (using \"le\" for a female person or for things), which goes beyond what's accepted even in Spain's leísmo pattern — the standard/accepted leísmo is for masculine singular persons only."
    ],
    spainExamples: [
      "\"¿Has visto a Pedro? Sí, le vi esta mañana en el bar\" — classic Spain leísmo, using \"le\" instead of \"lo\" for a male person, very common and accepted in Peninsular Spanish.",
      "\"¿Dónde están las llaves? No las encuentro\" — standard direct object pronoun \"las\" for a feminine plural thing (llaves).",
      "\"Cómpralo tú, que yo no tengo tiempo\" — direct object pronoun attached to an affirmative command, everyday Spain phrasing."
    ],
    exampleSentences: [
      { es: "¿Tienes las llaves? Sí, las tengo aquí.", en: "Do you have the keys? Yes, I have them here." },
      { es: "A Pedro no le vi en la fiesta.", en: "I didn't see Pedro at the party (leísmo, Spain-style)." },
      { es: "¿Compraste el pan? No, no lo compré todavía.", en: "Did you buy the bread? No, I haven't bought it yet." },
      { es: "Os quiero mucho a los dos.", en: "I love you both a lot." },
      { es: "Voy a llamarte esta noche.", en: "I'm going to call you tonight." }
    ],
    memoryTricks: "Remember \"pronoun jumps in front of the verb, like a bodyguard stepping in front of its boss\" — lo/la/los/las step in front of the conjugated verb instead of trailing behind like in English.",
    visualExplanation: "Direct object pronoun set: me (me) | te (you, informal) | lo/la (him/her/it/you formal) | nos (us) | os (you all, informal Spain) | los/las (them/you all). Placement: [pronoun] + conjugated verb (Lo veo) OR infinitive/gerund/command + [pronoun] attached (verlo, viéndolo, ¡Cómpralo!).",
    exercises: [
      { type: "multiple-choice", prompt: "Which pronoun replaces \"las llaves\" in \"¿Tienes las llaves?\"?", options: ["lo", "la", "las", "los"], answer: "las", explanation: "\"Llaves\" is feminine plural, so the direct object pronoun is \"las\"." },
      { type: "fill-blank", prompt: "¿Viste a Pedro ayer? Sí, ___ vi en el bar (leísmo, Spain).", answer: "le", explanation: "In Peninsular Spain Spanish, \"le\" is commonly and correctly used for a masculine singular person as a direct object (leísmo)." },
      { type: "error-correction", prompt: "Compré el periódico y leí lo en el metro.", answer: "Compré el periódico y lo leí en el metro.", explanation: "The direct object pronoun \"lo\" must go before the conjugated verb \"leí\", not after it." },
      { type: "translation", prompt: "I love you both (vosotros).", answer: "Os quiero a los dos.", explanation: "\"Os\" is the vosotros direct object pronoun, standard in Spain for informal plural \"you\"." },
      { type: "sentence-building", words: ["cómpralo", "quieres", "si", "tú"], answer: "Cómpralo tú si quieres.", explanation: "The pronoun \"lo\" attaches to the end of the affirmative command \"compra\" → \"cómpralo\"." },
      { type: "dialogue-completion", prompt: "—¿Has llamado a tu madre? —Sí, ___ he llamado esta mañana.", answer: "la", explanation: "\"Madre\" is feminine singular, so the correct direct object pronoun is \"la\" (not leísmo, since leísmo in Spain applies mainly to masculine persons)." }
    ]
  },
  {
    id: "gram_indirect_object_pronouns",
    title: "Los pronombres de objeto indirecto (Indirect Object Pronouns)",
    level: "A2",
    tier: "intermediate",
    simpleExplanation: "Indirect object pronouns (me, te, le, nos, os, les) show to whom or for whom an action is done, and are required even when the person is also named.",
    detailedExplanation: "Indirect object pronouns answer \"to whom?\" or \"for whom?\": me, te, le, nos, os, les. A key Spanish feature is that the pronoun is often used redundantly alongside the actual noun for clarity or emphasis: Le di el regalo a mi madre (I gave the gift to my mother — \"le\" and \"a mi madre\" both appear). This is required, not optional, whenever the indirect object noun is specified. When both a direct and indirect object pronoun appear together, indirect comes first, and le/les change to \"se\" before lo/la/los/las (Se lo di, not Le lo di).",
    englishComparison: "English can say \"I gave the gift to my mother\" or \"I gave her the gift\" without needing both together; Spanish grammar requires the pronoun \"le\" even when \"a mi madre\" is already stated, which feels redundant to English speakers but is mandatory in Spanish.",
    commonMistakes: [
      "Omitting the indirect object pronoun when the noun is already stated (\"Di el regalo a mi madre\" instead of the grammatically required \"Le di el regalo a mi madre\").",
      "Saying \"le lo\" instead of correctly changing le/les to \"se\" before a direct object pronoun (\"Se lo di\", not \"Le lo di\").",
      "Confusing indirect object le/les with direct object lo/la, especially since Spain's leísmo can blur this for male person objects.",
      "Forgetting the vosotros indirect object pronoun \"os\" and defaulting to \"les\" (\"Les doy un regalo\" to a group of friends you address as vosotros should instead be \"Os doy un regalo\")."
    ],
    spainExamples: [
      "\"Le compré un regalo a mi abuela por su cumpleaños\" — the redundant pronoun \"le\" plus \"a mi abuela\" is standard, natural Spain Spanish.",
      "\"¿Os apetece un café?\" — vosotros indirect object pronoun \"os\", extremely common casual Spain invitation.",
      "\"Se lo expliqué mil veces y no lo entendió\" — le → se transformation before the direct object pronoun \"lo\"."
    ],
    exampleSentences: [
      { es: "Le mandé un mensaje a mi hermana esta mañana.", en: "I sent my sister a message this morning." },
      { es: "¿Os apetece cenar fuera esta noche?", en: "Do you all feel like eating out tonight?" },
      { es: "Se lo dije claramente, pero no me hizo caso.", en: "I told him/her clearly, but he/she didn't listen to me." },
      { es: "Nos regalaron unas entradas para el concierto.", en: "They gave us tickets to the concert as a gift." },
      { es: "¿Te importa si cierro la ventana?", en: "Do you mind if I close the window?" }
    ],
    memoryTricks: "Remember \"le becomes se before lo/la\" with the rhyme \"le + lo? Oh no, say SE-LO!\" — this avoids the awkward \"le lo\" combination that Spanish grammar disallows.",
    visualExplanation: "Indirect object pronoun set: me | te | le (→ se before lo/la/los/las) | nos | os | les (→ se before lo/la/los/las). Double pronoun order: [indirect] + [direct] + verb, e.g. Se lo di (indirect \"se\"=to him, direct \"lo\"=it, verb \"di\"=gave).",
    exercises: [
      { type: "multiple-choice", prompt: "Complete: \"___ compré un regalo a mi padre.\"", options: ["Lo", "Le", "La", "Les"], answer: "Le", explanation: "\"A mi padre\" is the indirect object (to whom), so the pronoun is \"le\"." },
      { type: "fill-blank", prompt: "Le expliqué el problema, pero no ___ entendió (change \"le lo\" correctly).", answer: "se lo", explanation: "\"Le\" becomes \"se\" before the direct object pronoun \"lo\": se lo." },
      { type: "error-correction", prompt: "Le lo di a mi hermano ayer.", answer: "Se lo di a mi hermano ayer.", explanation: "\"Le\" must change to \"se\" before \"lo\" — Spanish never allows \"le lo\" together." },
      { type: "translation", prompt: "Does it matter to you all if we arrive late? (vosotros)", answer: "¿Os importa si llegamos tarde?", explanation: "\"Os\" is the vosotros indirect object pronoun, standard in Spain." },
      { type: "sentence-building", words: ["mandé", "un", "mensaje", "le", "ayer"], answer: "Le mandé un mensaje ayer.", explanation: "Indirect object pronoun \"le\" precedes the conjugated verb \"mandé\"." },
      { type: "dialogue-completion", prompt: "—¿___ diste las llaves a Marta? —Sí, ___ las di esta mañana.", answer: "Le / se", explanation: "\"Le\" is used to ask; in the answer, \"le\" becomes \"se\" before the direct object pronoun \"las\"." }
    ]
  },
  {
    id: "gram_comparisons",
    title: "Comparativos y superlativos (Comparisons: más/menos que, tan...como)",
    level: "A2",
    tier: "intermediate",
    simpleExplanation: "To compare things in Spanish, use más/menos + adjective + que (more/less than), or tan + adjective + como (as...as) for equal comparisons.",
    detailedExplanation: "Comparisons of inequality: más + adjective/adverb/noun + que (Madrid es más grande que Salamanca). Comparisons of equality: tan + adjective/adverb + como (Mi piso es tan bonito como el tuyo), or tanto/a/os/as + noun + como for nouns (Tengo tantos libros como tú). Superlatives use el/la/los/las + más/menos + adjective (+ de) (Es la ciudad más bonita de España). Irregular comparative/superlative forms exist for a few adjectives: bueno→mejor, malo→peor, grande→mayor (often age), pequeño→menor (often age), and these don't use más/menos.",
    englishComparison: "English adds -er/-est to short adjectives (bigger, biggest) or uses more/most for longer ones (more beautiful); Spanish always uses más/menos + adjective, regardless of adjective length, which is actually simpler and more consistent than English's mixed system, except for a handful of irregular forms like mejor/peor that parallel English's better/worse.",
    commonMistakes: [
      "Using \"más bueno\" instead of the irregular \"mejor\" (better) — bueno/malo/grande/pequeño have irregular comparative forms.",
      "Forgetting \"que\" after más/menos (\"Es más alto Juan\" instead of \"Es más alto que Juan\").",
      "Using \"como\" instead of \"que\" in unequal comparisons, or vice versa (tan...como is for equality; más/menos...que is for inequality — they aren't interchangeable).",
      "Forgetting to make tanto agree in gender/number with the noun it modifies (tantas ganas, not tanto ganas)."
    ],
    spainExamples: [
      "\"El Camp Nou es más grande que el Bernabéu\" — comparing two of Spain's most famous football stadiums.",
      "\"Los pisos en Madrid son tan caros como en Barcelona\" — equal comparison relevant to Spain's real estate conversations.",
      "\"Mi hermano mayor vive en Valencia\" — using the irregular comparative \"mayor\" for age/seniority, a very natural Spain expression."
    ],
    exampleSentences: [
      { es: "Sevilla es más calurosa que Santander en verano.", en: "Seville is hotter than Santander in summer." },
      { es: "Este bar es tan bueno como el de la esquina.", en: "This bar is as good as the one on the corner." },
      { es: "Tengo tantos amigos aquí como en mi ciudad.", en: "I have as many friends here as in my city." },
      { es: "Mi hermana menor estudia en la universidad.", en: "My younger sister studies at university." },
      { es: "Es el mejor restaurante de todo el barrio.", en: "It's the best restaurant in the whole neighborhood." }
    ],
    memoryTricks: "Remember \"MÁS...QUE / TAN...COMO\" as two fixed sandwich structures — the filling (adjective) changes, but the bread (más/que or tan/como) never mixes between the two structures.",
    visualExplanation: "Inequality: más/menos + adj + que (Ana es más alta que Luis). Equality: tan + adj + como (Ana es tan alta como Luis) | tanto/a/os/as + noun + como (Ana tiene tanto dinero como Luis). Irregulars: bueno→mejor | malo→peor | grande→mayor | pequeño→menor.",
    exercises: [
      { type: "multiple-choice", prompt: "Which is correct: \"Este libro es ___ interesante ___ aquel.\"", options: ["tan / como", "más / como", "tan / que", "tanto / que"], answer: "tan / como", explanation: "Equal comparison uses \"tan + adjective + como\"." },
      { type: "fill-blank", prompt: "Mi hermano es ___ (irregular comparative of \"bueno\") jugador que yo.", answer: "mejor", explanation: "\"Bueno\" has the irregular comparative \"mejor\" (better), not \"más bueno\"." },
      { type: "error-correction", prompt: "Ella es más buena que su hermana en matemáticas.", answer: "Ella es mejor que su hermana en matemáticas.", explanation: "\"Más buena\" should be replaced with the irregular comparative \"mejor\"." },
      { type: "translation", prompt: "This city is as beautiful as Seville.", answer: "Esta ciudad es tan bonita como Sevilla.", explanation: "Equal comparison: tan + adjective + como." },
      { type: "sentence-building", words: ["mayor", "es", "mi", "hermano", "que", "yo"], answer: "Mi hermano es mayor que yo.", explanation: "\"Mayor\" (irregular comparative for age) + que forms the comparison." },
      { type: "dialogue-completion", prompt: "—¿Es Barcelona ___ grande ___ Madrid? —No, Madrid es un poco ___ grande.", answer: "tan / como / más", explanation: "First blank pair expresses equality (tan...como); the reply uses inequality (más)." }
    ]
  },
  {
    id: "gram_commands",
    title: "El imperativo (Commands, incluido vosotros)",
    level: "B1",
    tier: "intermediate",
    simpleExplanation: "Commands tell someone to do (or not do) something, with different forms for tú, usted, nosotros, vosotros, and ustedes — and Spain uses vosotros constantly for informal group commands.",
    detailedExplanation: "Affirmative tú commands mostly use the él/ella present tense form (habla, come, escribe), with irregulars like ven (venir), pon (poner), sal (salir), ten (tener), ve (ir), haz (hacer), sé (ser), di (decir). Negative tú commands use the present subjunctive (no hables, no comas). The vosotros affirmative command is famously simple: drop the -r of the infinitive and add -d (hablad, comed, escribid) — this is a uniquely Peninsular Spain form barely used in Latin America, where ustedes replaces it. Negative vosotros commands use the subjunctive vosotros form (no habléis, no comáis). Object pronouns attach to the end of affirmative commands (¡Hazlo!, ¡Sentaos!, note the -d drops before -os: sentad + os → sentaos) and go before negative commands (¡No lo hagas!).",
    englishComparison: "English commands use the plain base verb with no ending changes and no distinction for who you're commanding (\"Speak!\" works for one person or a whole group); Spanish has five distinct command forms (tú, usted, nosotros, vosotros, ustedes), each with its own conjugation, and Peninsular Spanish adds the vosotros command that doesn't exist at all in Latin American Spanish.",
    commonMistakes: [
      "Skipping the vosotros command form and defaulting to ustedes, which sounds overly formal/foreign in Spain — vosotros is the natural informal plural in Peninsular Spanish (¡Venid aquí!, not ¡Vengan aquí! among friends).",
      "Using the present indicative form instead of the subjunctive for negative commands (\"No hablas\" instead of \"No hables\").",
      "Forgetting to drop the -d before attaching -os in reflexive vosotros commands (\"sentados\" instead of \"sentaos\"; the only exception is idos for irse).",
      "Misplacing object pronouns — attaching them to negative commands instead of placing them before the verb (\"No hazlo\" instead of \"No lo hagas\")."
    ],
    spainExamples: [
      "\"¡Venid a cenar, que ya está listo!\" — vosotros affirmative command, an everyday phrase called out at Spanish family dinners.",
      "\"No os preocupéis, todo va a salir bien\" — vosotros negative command using the subjunctive, reassuring a group of friends.",
      "\"¡Sentaos, por favor!\" — vosotros reflexive affirmative command (sentad + os → sentaos), typical classroom or host instruction in Spain."
    ],
    exampleSentences: [
      { es: "¡Habla más despacio, por favor!", en: "Speak more slowly, please! (tú)" },
      { es: "¡Venid aquí un momento!", en: "Come here for a moment! (vosotros)" },
      { es: "No os preocupéis por el examen.", en: "Don't worry about the exam. (vosotros, negative)" },
      { es: "Coged vuestras cosas y salid ya.", en: "Grab your things and leave now. (vosotros)" },
      { es: "¡Cómetelo todo, que está riquísimo!", en: "Eat it all up, it's delicious! (tú, with pronouns attached)" }
    ],
    memoryTricks: "Remember vosotros affirmative commands with \"drop the R, add a D\": hablar → hablad, comer → comed, vivir → vivid — like the infinitive lost its tail and grew a new one.",
    visualExplanation: "Tú affirmative: habla | come | escribe (irregulars: ven, pon, sal, ten, ve, haz, sé, di). Vosotros affirmative: hablad | comed | escribid (drop -r, add -d). Vosotros negative (subjunctive): no habléis | no comáis | no escribáis. Reflexive vosotros: sentaos (sentad+os, d drops), levantaos, but idos (irregular, keeps the d).",
    exercises: [
      { type: "multiple-choice", prompt: "What is the vosotros affirmative command of \"comer\"?", options: ["comed", "comáis", "coman", "comen"], answer: "comed", explanation: "Vosotros affirmative commands drop the infinitive -r and add -d: comer → comed." },
      { type: "fill-blank", prompt: "¡No ___ (preocuparse, vosotros) tanto!", answer: "os preocupéis", explanation: "Negative vosotros commands use the subjunctive form, with the reflexive pronoun \"os\" placed before the verb." },
      { type: "error-correction", prompt: "¡Vengan aquí, chicos, que os quiero enseñar algo! (talking to a group of close friends in Spain)", answer: "¡Venid aquí, chicos, que os quiero enseñar algo!", explanation: "Among friends in Spain, the natural informal plural command is vosotros (\"venid\"), not the more formal ustedes (\"vengan\")." },
      { type: "translation", prompt: "Sit down (vosotros) and relax!", answer: "¡Sentaos y relajaos!", explanation: "Reflexive vosotros affirmative commands drop the -d before adding -os: sentad+os → sentaos." },
      { type: "sentence-building", words: ["lo", "hagas", "no", "así"], answer: "No lo hagas así.", explanation: "Negative commands place the object pronoun \"lo\" before the verb, unlike affirmative commands." },
      { type: "dialogue-completion", prompt: "—Mamá, ¿podemos ver la tele? —Sí, pero primero ___ (terminar, vosotros) los deberes.", answer: "terminad", explanation: "Vosotros affirmative command of terminar: terminad (drop -r, add -d)." }
    ]
  },
  {
    id: "gram_relative_pronouns",
    title: "Los pronombres relativos (que, quien, donde)",
    level: "B1",
    tier: "intermediate",
    simpleExplanation: "Relative pronouns connect two ideas about the same noun without repeating it: que (that/which/who), quien(es) (who, after a preposition or comma), and donde (where).",
    detailedExplanation: "\"Que\" is by far the most common and versatile relative pronoun, used for people or things, with or without a preceding preposition, and works in both restrictive and non-restrictive clauses: El libro que compré es muy bueno; La chica que vive al lado es simpática. \"Quien/quienes\" refers only to people and is typically used after a preposition (la persona con quien hablé) or after a comma in a non-restrictive clause (Mi padre, quien es médico, trabaja en el hospital) — in casual speech, \"que\" often replaces \"quien\" even for people. \"Donde\" refers to places (El pueblo donde nací es muy pequeño) and can combine with a preposition (la ciudad de donde vengo).",
    englishComparison: "English has several distinct relative pronouns based on function (who for people, which for things, that for either, where for places); Spanish simplifies much of this into one workhorse word, \"que\", which covers both \"who\" and \"which/that\" for restrictive clauses, while quien/donde are used more narrowly.",
    commonMistakes: [
      "Omitting \"que\" the way English sometimes omits \"that\" (\"El libro compré\" instead of \"El libro que compré\") — Spanish never drops the relative pronoun.",
      "Using \"quien\" for things instead of people (\"la casa quien compré\" instead of \"la casa que compré\").",
      "Forgetting that after a preposition, \"que\" often needs the article added (el/la que) or should become \"quien\" for people (\"la persona que hablé\" instead of \"la persona con quien hablé\" or \"con la que hablé\").",
      "Using \"que\" instead of \"donde\" for places (\"el pueblo que nací\" instead of \"el pueblo donde nací\")."
    ],
    spainExamples: [
      "\"El bar donde quedamos siempre está cerca de Sol\" — using donde for a well-known Madrid meeting spot.",
      "\"Mi compañero de piso, quien es de Bilbao, cocina genial\" — quien in a non-restrictive clause describing a flatmate.",
      "\"La chica que conocí en la fiesta es de Zaragoza\" — que used for a person, the most natural everyday choice."
    ],
    exampleSentences: [
      { es: "El piso que alquilé está muy bien situado.", en: "The flat that I rented is very well located." },
      { es: "Mi vecino, quien trabaja en el ayuntamiento, es muy majo.", en: "My neighbor, who works at the town hall, is very nice." },
      { es: "El pueblo donde pasé mi infancia está en Asturias.", en: "The village where I spent my childhood is in Asturias." },
      { es: "La persona con quien hablé no sabía la respuesta.", en: "The person I spoke with didn't know the answer." },
      { es: "Esa es la razón por la que llegué tarde.", en: "That's the reason (why) I arrived late." }
    ],
    memoryTricks: "Remember \"QUE does it all, QUIEN needs a person and often a preposition, DONDE needs a place\" — que is your default, the other two are specialized tools.",
    visualExplanation: "que → people or things, most common, never omitted (El libro que leí). quien/quienes → people only, after preposition or comma (con quien, Mi amigo, quien...). donde → places (la ciudad donde vivo). Preposition + article + que → el/la que, los/las que (la mesa en la que como).",
    exercises: [
      { type: "multiple-choice", prompt: "Which relative pronoun fits: \"El pueblo ___ nací es muy pequeño\"?", options: ["que", "quien", "donde", "cual"], answer: "donde", explanation: "\"Donde\" refers to a place, matching \"el pueblo\"." },
      { type: "fill-blank", prompt: "La chica ___ conocí ayer es muy simpática.", answer: "que", explanation: "\"Que\" is the default, most common relative pronoun for both people and things." },
      { type: "error-correction", prompt: "El libro quien compré es muy interesante.", answer: "El libro que compré es muy interesante.", explanation: "\"Quien\" is only for people; things use \"que\"." },
      { type: "translation", prompt: "My sister, who lives in Valencia, is a doctor.", answer: "Mi hermana, quien vive en Valencia, es médica.", explanation: "Non-restrictive clause about a person after a comma uses \"quien\"." },
      { type: "sentence-building", words: ["donde", "el", "bar", "quedamos", "es", "aquí"], answer: "El bar donde quedamos es aquí.", explanation: "\"Donde\" links the place (el bar) to the clause describing it." },
      { type: "dialogue-completion", prompt: "—¿Conoces al chico ___ vive al lado? —Sí, es la persona con ___ trabajo.", answer: "que / quien", explanation: "\"Que\" works generally; \"quien\" is preferred after the preposition \"con\" when referring to a person." }
    ]
  },
  {
    id: "gram_passive",
    title: "La voz pasiva (ser + participio, y la pasiva refleja con se)",
    level: "B1",
    tier: "intermediate",
    simpleExplanation: "Spanish can make a passive sentence with ser + past participle (like English \"is/was done\"), but far more often uses \"se\" + verb to express the same idea informally.",
    detailedExplanation: "The formal passive uses ser + past participle, with the participle agreeing in gender/number with the subject, and \"por\" introducing the agent if mentioned: El puente fue construido por los romanos. This construction is more common in written/formal Spanish (news, history) than in everyday speech. In spoken Spanish, especially in Spain, the passive \"se\" (pasiva refleja) is far more natural and frequent: Se venden pisos (Flats are sold/for sale), Se habla español (Spanish is spoken), Aquí se come muy bien (One eats very well here). With \"se\", the verb agrees in number with the noun that follows (Se vende piso / Se venden pisos).",
    englishComparison: "English relies almost exclusively on \"to be\" + past participle for passive voice (\"the house was built\"); Spanish has that same option (ser + participio) but strongly prefers the \"se\" passive construction in everyday communication, which has no single direct English equivalent — English speakers often mistranslate it as an impersonal \"one\" or active voice.",
    commonMistakes: [
      "Overusing ser + participle in spoken contexts where a native speaker would use se (\"El piso es vendido\" sounds unnatural; \"Se vende el piso\" is what a Spaniard would actually say).",
      "Forgetting to make the past participle agree with the subject in the ser passive (\"La casa fue construido\" instead of \"La casa fue construida\").",
      "Making the verb singular with a plural noun in the se passive (\"Se vende pisos\" instead of \"Se venden pisos\").",
      "Confusing the passive se with the reflexive se or the impersonal se (uno) — context and whether there's a clear grammatical subject helps distinguish them."
    ],
    spainExamples: [
      "\"Se alquila piso, 3 habitaciones, centro de Madrid\" — an extremely typical real-estate ad structure seen all over Spanish cities.",
      "\"En este restaurante se come de maravilla\" — praising a restaurant using the impersonal/passive se construction.",
      "\"El Museo del Prado fue inaugurado en 1819\" — formal ser + participio passive, appropriate for a historical/written fact."
    ],
    exampleSentences: [
      { es: "Se habla español y catalán en Barcelona.", en: "Spanish and Catalan are spoken in Barcelona." },
      { es: "El Alcázar fue construido hace siglos.", en: "The Alcázar was built centuries ago." },
      { es: "Se venden pisos nuevos en esta zona.", en: "New flats are sold/for sale in this area." },
      { es: "Aquí se cena muy tarde, sobre las diez.", en: "Here people eat dinner very late, around ten." },
      { es: "Las entradas fueron compradas con antelación.", en: "The tickets were bought in advance." }
    ],
    memoryTricks: "Remember \"SE is for the STREET, SER+participio is for the NEWSPAPER\" — se passive sounds natural and everyday, while ser + participio sounds more formal and written.",
    visualExplanation: "Formal passive: [subject] + ser (conjugated) + [participle agreeing in gender/number] + (por + agent). Example: La novela fue escrita por Cervantes. Passive se (pasiva refleja): Se + verb (3rd person, singular or plural to match the noun) + noun. Example: Se vende piso / Se venden pisos.",
    exercises: [
      { type: "multiple-choice", prompt: "Which is the most natural way to say \"Spanish is spoken here\" in everyday Spain Spanish?", options: ["Español es hablado aquí.", "Aquí se habla español.", "Aquí es hablado español.", "Aquí hablan español ellos."], answer: "Aquí se habla español.", explanation: "The passive se construction is the natural, everyday way to express this in Spanish." },
      { type: "fill-blank", prompt: "Se ___ (vender) pisos nuevos en el centro (plural agreement).", answer: "venden", explanation: "The se-passive verb agrees in number with \"pisos\" (plural), so it's \"venden\"." },
      { type: "error-correction", prompt: "La catedral fue construido en el siglo XIII.", answer: "La catedral fue construida en el siglo XIII.", explanation: "The past participle must agree with the feminine subject \"la catedral\": construida, not construido." },
      { type: "translation", prompt: "Breakfast is served from 8 to 10.", answer: "Se sirve el desayuno de 8 a 10.", explanation: "Everyday passive se construction fits this announcement-style sentence naturally." },
      { type: "sentence-building", words: ["fue", "la", "novela", "escrita", "Cervantes", "por"], answer: "La novela fue escrita por Cervantes.", explanation: "Formal ser + participio passive with the agent introduced by \"por\"." },
      { type: "dialogue-completion", prompt: "—¿___ (hablar) inglés en esta tienda? —No mucho, aquí ___ (hablar) sobre todo español.", answer: "Se habla / se habla", explanation: "Both blanks use the passive se construction, appropriate for describing general practice." }
    ]
  },

  // ============================================================
  // ADVANCED TIER
  // ============================================================
  {
    id: "gram_present_subjunctive",
    title: "El presente de subjuntivo (Present Subjunctive)",
    level: "B1",
    tier: "advanced",
    simpleExplanation: "The subjunctive is a mood (not a tense) used to express wishes, doubts, emotions, and recommendations — not to state facts.",
    detailedExplanation: "The present subjunctive is triggered in a subordinate clause (usually after \"que\") when the main clause expresses desire (querer que), doubt (dudar que), emotion (alegrarse de que, es una pena que), recommendation/influence (recomendar que, es importante que), or certain impersonal expressions. Formation: take the yo form of the present indicative, drop the -o, and add the \"opposite vowel\" endings: -AR verbs get -e endings (hable, hables, hable, hablemos, habléis, hablen); -ER/-IR verbs get -a endings (coma, comas, coma, comamos, comáis, coman). Many irregular-yo verbs keep that irregularity throughout the subjunctive (tener→tenga, hacer→haga, salir→salga, conocer→conozca). A handful are fully irregular: sea (ser), esté (estar), vaya (ir), sepa (saber), haya (haber), dé (dar).",
    englishComparison: "English subjunctive is nearly invisible (\"I suggest that he go\" — just drops the -s) and rarely used in everyday speech; Spanish subjunctive is a fully distinct, actively used verb form that changes constantly in daily conversation whenever wishes, doubts, or emotional reactions are expressed, making it one of the biggest structural gaps between the two languages.",
    commonMistakes: [
      "Using the indicative after subjunctive trigger phrases (\"Quiero que vienes\" instead of \"Quiero que vengas\") because it feels like a normal statement in English.",
      "Forgetting the \"opposite vowel\" rule and using -e for -er/-ir verbs or -a for -ar verbs.",
      "Not recognizing impersonal expressions of doubt/emotion as subjunctive triggers (\"Es posible que\", \"Es una pena que\", \"Ojalá que\").",
      "Using the subjunctive even when there's no change of subject (when the subject is the same in both clauses, Spanish uses an infinitive instead: Quiero ir, not Quiero que yo vaya)."
    ],
    spainExamples: [
      "\"Espero que vengáis a la boda\" — vosotros present subjunctive, natural in Spain when inviting a group of friends.",
      "\"Ojalá que llueva pronto, hace mucha sequía\" — \"ojalá\" (I hope/wish) always triggers subjunctive, common in weather talk about Spain's droughts.",
      "\"Es importante que hagáis los deberes antes de cenar\" — vosotros subjunctive used by Spanish parents/teachers giving instructions to a group."
    ],
    exampleSentences: [
      { es: "Quiero que vengas a la fiesta el sábado.", en: "I want you to come to the party on Saturday." },
      { es: "Espero que tengáis un buen viaje.", en: "I hope you all have a good trip." },
      { es: "Dudo que ella sepa la verdad.", en: "I doubt she knows the truth." },
      { es: "Es una pena que no podáis venir.", en: "It's a shame you all can't come." },
      { es: "Ojalá tengamos suerte en el examen.", en: "I hope we have luck on the exam." }
    ],
    memoryTricks: "Remember WEIRDO as the classic trigger acronym: Wishes, Emotions, Impersonal expressions, Recommendations, Doubt, Ojalá — if the sentence fits one of these categories and has a change of subject with \"que\", reach for the subjunctive.",
    visualExplanation: "hablar (subj.): hable | hables | hable | hablemos | habléis | hablen. comer (subj.): coma | comas | coma | comamos | comáis | coman. Fully irregular: ser→sea | estar→esté | ir→vaya | saber→sepa | haber→haya | dar→dé.",
    exercises: [
      { type: "multiple-choice", prompt: "Complete: \"Espero que vosotros ___ un buen fin de semana.\"", options: ["tenéis", "tengáis", "tenían", "tendréis"], answer: "tengáis", explanation: "\"Esperar que\" triggers the subjunctive; the vosotros form of tener in the subjunctive is \"tengáis\"." },
      { type: "fill-blank", prompt: "Es importante que tú ___ (estudiar) para el examen.", answer: "estudies", explanation: "\"Es importante que\" is an impersonal expression triggering subjunctive: estudies." },
      { type: "error-correction", prompt: "Quiero que vosotros venís a mi cumpleaños.", answer: "Quiero que vosotros vengáis a mi cumpleaños.", explanation: "\"Querer que\" triggers subjunctive, so \"venís\" (indicative) must become \"vengáis\" (subjunctive)." },
      { type: "translation", prompt: "I hope you all (vosotros) enjoy the trip.", answer: "Espero que disfrutéis del viaje.", explanation: "\"Esperar que\" triggers the subjunctive; vosotros form of disfrutar is \"disfrutéis\"." },
      { type: "sentence-building", words: ["dudo", "sepa", "que", "verdad", "la", "él"], answer: "Dudo que él sepa la verdad.", explanation: "\"Dudar que\" (doubt) triggers subjunctive; \"sepa\" is the irregular subjunctive of saber." },
      { type: "dialogue-completion", prompt: "—¿Vais a venir a la boda? —Ojalá que ___ (poder) ir, pero no estamos seguros.", answer: "podamos", explanation: "\"Ojalá que\" always triggers the subjunctive: podamos (nosotros)." }
    ]
  },
  {
    id: "gram_imperfect_subjunctive",
    title: "El imperfecto de subjuntivo (Imperfect Subjunctive)",
    level: "B2",
    tier: "advanced",
    simpleExplanation: "The imperfect subjunctive is the past version of the subjunctive, used after past-tense trigger verbs and in hypothetical \"if\" clauses about unreal situations.",
    detailedExplanation: "Formed from the ellos/ellas preterite form: drop -ron and add -ra endings (or the less common -se endings, more literary/formal): hablar → hablaron → hablara, hablaras, hablara, habláramos, hablarais, hablaran. Used when the main clause is in a past tense and still triggers subjunctive (Quería que vinieras = I wanted you to come), and crucially in contrary-to-fact \"si\" clauses: Si tuviera dinero, viajaría más (If I had money, I would travel more) — note the imperfect subjunctive in the \"si\" clause paired with the conditional in the result clause. The nosotros form always carries a written accent on the syllable before -ramos/-semos (habláramos, tuviéramos).",
    englishComparison: "English keeps a trace of this idea in fixed forms like \"If I were you...\" (using \"were\" instead of \"was\" for hypotheticals); Spanish has a fully conjugated, actively used verb form for every person that appears constantly in polite requests, past wishes, and hypothetical statements, well beyond English's one surviving fossil expression.",
    commonMistakes: [
      "Using the conditional in the \"si\" clause instead of the imperfect subjunctive (\"Si tendría dinero\" instead of \"Si tuviera dinero\").",
      "Forgetting the accent on the nosotros form (\"hablaramos\" instead of \"habláramos\").",
      "Not recognizing that a past-tense trigger verb (quería, esperaba, dudaba) requires the imperfect, not present, subjunctive in the subordinate clause.",
      "Mixing up -ra and -se endings inconsistently within the same sentence (both are valid, but consistency and register matter — -ra is more common in everyday Spain speech)."
    ],
    spainExamples: [
      "\"Si tuviera más tiempo, viajaría por toda España\" — a hypothetical wish, very common conversational structure.",
      "\"Mi madre quería que estudiara Derecho, pero yo prefería Filología\" — reflecting on a past family expectation, a relatable Spain scenario.",
      "\"Como si vosotros no supierais lo que pasó...\" — \"como si\" (as if) always triggers imperfect subjunctive, common in sarcastic/ironic Spain speech."
    ],
    exampleSentences: [
      { es: "Si tuviera dinero, me compraría un piso en la playa.", en: "If I had money, I would buy myself a flat on the beach." },
      { es: "Mis padres querían que fuéramos médicos.", en: "My parents wanted us to be doctors." },
      { es: "Ojalá vosotros supierais lo importante que sois para mí.", en: "I wish you all knew how important you are to me." },
      { es: "Nos habló como si no pasara nada.", en: "He/she talked to us as if nothing were happening." },
      { es: "Si vinierais antes, veríamos la puesta de sol.", en: "If you all came earlier, we would see the sunset." }
    ],
    memoryTricks: "Remember the shortcut \"take the THEY-preterite, drop -RON, add -RA\": hablaron → habla-RA. It works for every verb, regular or irregular, because it's built on the already-irregular preterite stem.",
    visualExplanation: "hablar: hablara | hablaras | hablara | habláramos | hablarais | hablaran. tener (from tuvieron): tuviera | tuvieras | tuviera | tuviéramos | tuvierais | tuvieran. Si-clause pattern: Si + imperfect subjunctive, + conditional (Si tuviera tiempo, iría).",
    exercises: [
      { type: "multiple-choice", prompt: "Complete: \"Si yo ___ más tiempo, aprendería a tocar la guitarra.\"", options: ["tengo", "tendría", "tuviera", "tenía"], answer: "tuviera", explanation: "Contrary-to-fact \"si\" clauses use the imperfect subjunctive: si tuviera." },
      { type: "fill-blank", prompt: "Mis padres querían que yo ___ (estudiar) medicina.", answer: "estudiara", explanation: "Past-tense trigger (querían) requires the imperfect subjunctive: estudiara." },
      { type: "error-correction", prompt: "Si tendría un coche, iría a la playa todos los fines de semana.", answer: "Si tuviera un coche, iría a la playa todos los fines de semana.", explanation: "The \"si\" clause needs the imperfect subjunctive \"tuviera\", not the conditional \"tendría\"." },
      { type: "translation", prompt: "If you all (vosotros) came to Madrid, I would show you the city.", answer: "Si vinierais a Madrid, os enseñaría la ciudad.", explanation: "Vosotros imperfect subjunctive of venir is \"vinierais\", paired with the conditional \"enseñaría\"." },
      { type: "sentence-building", words: ["supiéramos", "ojalá", "verdad", "la"], answer: "Ojalá supiéramos la verdad.", explanation: "\"Ojalá\" triggers subjunctive; the nosotros imperfect subjunctive of saber is \"supiéramos\", with its required accent." },
      { type: "dialogue-completion", prompt: "—¿Qué harías si ___ (ganar) la lotería? —Si la ___, viajaría por todo el mundo.", answer: "ganaras / ganara", explanation: "Both blanks use the imperfect subjunctive of ganar in the hypothetical \"si\" clause." }
    ]
  },
  {
    id: "gram_perfect_tenses",
    title: "Los tiempos compuestos (Pretérito perfecto y pluscuamperfecto)",
    level: "B1",
    tier: "advanced",
    simpleExplanation: "Perfect tenses combine \"haber\" with a past participle: pretérito perfecto (he hablado = I have spoken) for recent/relevant past, and pluscuamperfecto (había hablado = I had spoken) for a past action before another past action.",
    detailedExplanation: "The pretérito perfecto compuesto (present perfect) uses present-tense haber + past participle: he, has, ha, hemos, habéis, han + hablado/comido/vivido. In Peninsular Spain Spanish, this tense is used very frequently for actions in a time period that includes the present (hoy, esta semana, este año) or with clear present relevance — much more so than in most of Latin America, where the simple preterite is often preferred even for today's events. The pluscuamperfecto (past perfect) uses the imperfect of haber + past participle: había, habías, había, habíamos, habíais, habían + participle, expressing an action completed before another past action (Cuando llegué, ya se había ido — When I arrived, he had already left). Irregular past participles must be memorized: hecho (hacer), dicho (decir), visto (ver), puesto (poner), escrito (escribir), vuelto (volver), abierto (abrir), roto (romper), muerto (morir).",
    englishComparison: "English present perfect (\"I have spoken\") and past perfect (\"I had spoken\") map closely onto Spanish pretérito perfecto and pluscuamperfecto, making this one of the more intuitive tense pairs for English speakers — though Spain uses the present perfect noticeably more often than English does for today-relevant events, where American English might simply use the simple past.",
    commonMistakes: [
      "Using the simple preterite instead of the present perfect for today's events in Spain Spanish (\"Hoy comí mucho\" is acceptable but a Peninsular speaker would very naturally say \"Hoy he comido mucho\").",
      "Forgetting irregular past participles and regularizing them (\"yo he hacido\" instead of \"yo he hecho\").",
      "Inserting another word between haber and the participle (Spanish never splits this pair, unlike English \"I have already spoken\" — Spanish keeps haber and participle together: \"Ya he hablado\", not \"He ya hablado\").",
      "Confusing pretérito perfecto (recent past, relevant now) with pluscuamperfecto (past before another past) when narrating a sequence of past events."
    ],
    spainExamples: [
      "\"Esta mañana he desayunado churros con chocolate\" — very typical Spain use of the present perfect for a same-day event.",
      "\"¿Habéis estado alguna vez en San Sebastián?\" — vosotros present perfect, asking a group about lifetime experience.",
      "\"Cuando llegamos al restaurante, ya habían cerrado la cocina\" — pluscuamperfecto describing an earlier past event relative to another."
    ],
    exampleSentences: [
      { es: "Hoy he trabajado mucho, estoy agotada.", en: "Today I've worked a lot, I'm exhausted." },
      { es: "¿Habéis visto la última película de Almodóvar?", en: "Have you all seen Almodóvar's latest movie?" },
      { es: "Cuando llegué a casa, mis padres ya habían cenado.", en: "When I got home, my parents had already had dinner." },
      { es: "Nunca he estado en el norte de España.", en: "I have never been to the north of Spain." },
      { es: "Todavía no habíamos hablado de este tema.", en: "We hadn't talked about this topic yet." }
    ],
    memoryTricks: "Remember \"HABER never lets go of its PARTICIPLE\" — they're glued together like a compound word; nothing can be inserted between them, and the participle never changes for gender/number in these tenses (unlike with ser).",
    visualExplanation: "Pretérito perfecto: he | has | ha | hemos | habéis | han + hablado. Pluscuamperfecto: había | habías | había | habíamos | habíais | habían + hablado. Irregular participles: hecho, dicho, visto, puesto, escrito, vuelto, abierto, roto, muerto.",
    exercises: [
      { type: "multiple-choice", prompt: "Complete: \"¿___ vosotros la nueva serie española?\"", options: ["Habéis visto", "Habéis visto", "Han visto", "Has visto"], answer: "Habéis visto", explanation: "Vosotros present perfect uses \"habéis\" plus the irregular participle \"visto\" (ver)." },
      { type: "fill-blank", prompt: "Cuando llegamos, la película ya ___ (empezar).", answer: "había empezado", explanation: "An action completed before another past action uses the pluscuamperfecto: había empezado." },
      { type: "error-correction", prompt: "Yo he ya terminado los deberes.", answer: "Yo ya he terminado los deberes.", explanation: "Haber and the participle can never be separated; \"ya\" must go before \"he\" or after \"terminado\", not between haber and the participle." },
      { type: "translation", prompt: "I have never eaten paella before.", answer: "Nunca he comido paella.", explanation: "Present perfect for a lifetime experience up to now: he comido." },
      { type: "sentence-building", words: ["habíamos", "cuando", "llegaste", "salido", "ya"], answer: "Cuando llegaste, ya habíamos salido.", explanation: "Pluscuamperfecto describes an action (salir) completed before another past event (llegar)." },
      { type: "dialogue-completion", prompt: "—¿___ (hacer) vosotros los deberes? —Sí, ya los ___.", answer: "Habéis hecho / hemos hecho", explanation: "Vosotros present perfect \"habéis hecho\"; the reply uses nosotros \"hemos hecho\", both with the irregular participle \"hecho\"." }
    ]
  },
  {
    id: "gram_conditional_perfect",
    title: "El condicional compuesto (Conditional Perfect)",
    level: "B2",
    tier: "advanced",
    simpleExplanation: "The conditional perfect (habría + participle) expresses what would have happened, used for hypothetical past situations and regrets.",
    detailedExplanation: "Formed with the conditional of haber (habría, habrías, habría, habríamos, habríais, habrían) plus a past participle: habría hablado (I would have spoken). It's most often paired with the pluscuamperfecto subjunctive in unreal past conditional sentences: Si hubiera estudiado más, habría aprobado el examen (If I had studied more, I would have passed the exam). It also expresses probability about a past event (Habría sido la una cuando se fueron — It was probably one o'clock when they left) and can express regret or hypothetical alternatives about the past (Yo, en tu lugar, habría llamado antes).",
    englishComparison: "English forms this with \"would have\" + past participle (\"I would have spoken\"), which maps very directly onto Spanish habría + participle, making the meaning intuitive — the main challenge for English speakers is remembering to pair it correctly with the pluscuamperfecto subjunctive (not a simple past) in the \"if\" clause of unreal past conditionals.",
    commonMistakes: [
      "Using the simple conditional instead of the conditional perfect for past hypotheticals (\"Si hubiera estudiado, aprobaría\" instead of \"habría aprobado\").",
      "Pairing the conditional perfect with the wrong \"si\" clause tense — it needs the pluscuamperfecto subjunctive (hubiera/hubiese + participle), not the imperfect subjunctive alone.",
      "Forgetting irregular participles in this compound tense too (habría escrito, not habría escribido).",
      "Confusing conditional perfect (habría hablado, would have spoken) with the pluscuamperfecto indicative (había hablado, had spoken) — different auxiliary tense, different meaning."
    ],
    spainExamples: [
      "\"Si hubiera cogido el AVE, habría llegado antes\" — reflecting on a missed better travel option using Spain's high-speed train.",
      "\"Yo que tú, habría llamado a Urgencias directamente\" — giving hindsight advice about a health situation, referencing Spain's emergency healthcare system.",
      "\"Habríais disfrutado mucho más de las Fallas si hubierais venido en marzo\" — vosotros conditional perfect, referencing the Valencia Fallas festival."
    ],
    exampleSentences: [
      { es: "Si hubiera sabido que venías, habría preparado algo de comer.", en: "If I had known you were coming, I would have prepared something to eat." },
      { es: "Habríamos llegado antes si no hubiera tanto tráfico.", en: "We would have arrived earlier if there hadn't been so much traffic." },
      { es: "¿Qué habríais hecho vosotros en mi lugar?", en: "What would you all have done in my place?" },
      { es: "Habría sido más fácil si me lo hubieras dicho antes.", en: "It would have been easier if you had told me sooner." },
      { es: "Ella nunca habría aceptado ese trabajo.", en: "She would never have accepted that job." }
    ],
    memoryTricks: "Remember \"HABRÍA = HAD-would\" — it's the conditional's \"would\" merged with haber's compound structure, always paired with the pluscuamperfecto subjunctive (hubiera + participle) when expressing an unreal past condition.",
    visualExplanation: "Conditional perfect: habría | habrías | habría | habríamos | habríais | habrían + hablado/comido/vivido. Full unreal past pattern: Si + hubiera/hubiese + participle, + habría + participle. Example: Si hubiera llovido, habríamos cancelado el picnic.",
    exercises: [
      { type: "multiple-choice", prompt: "Complete: \"Si hubiéramos salido antes, ___ el tren.\"", options: ["cogeríamos", "habríamos cogido", "cogimos", "hubiéramos cogido"], answer: "habríamos cogido", explanation: "The result clause of an unreal past conditional uses the conditional perfect: habríamos cogido." },
      { type: "fill-blank", prompt: "Yo, en tu lugar, ___ (hablar) con el profesor antes del examen.", answer: "habría hablado", explanation: "Hypothetical advice about a past situation uses the conditional perfect: habría hablado." },
      { type: "error-correction", prompt: "Si hubiera tenido más dinero, compraría esa casa.", answer: "Si hubiera tenido más dinero, habría comprado esa casa.", explanation: "An unreal past condition (hubiera tenido) needs the conditional perfect in the result clause (habría comprado), not the simple conditional." },
      { type: "translation", prompt: "You all (vosotros) would have loved that concert.", answer: "Os habría encantado ese concierto.", explanation: "Conditional perfect expressing a hypothetical past reaction: habría encantado." },
      { type: "sentence-building", words: ["habría", "dicho", "nunca", "ella", "eso"], answer: "Ella nunca habría dicho eso.", explanation: "Conditional perfect with the irregular participle \"dicho\" (decir)." },
      { type: "dialogue-completion", prompt: "—¿___ (venir) vosotros si os hubiéramos avisado antes? —Claro, ___ encantados.", answer: "Habríais venido / habríamos venido", explanation: "Vosotros conditional perfect \"habríais venido\"; the answer uses nosotros \"habríamos venido\"." }
    ]
  },
  {
    id: "gram_reported_speech",
    title: "El estilo indirecto (Reported Speech)",
    level: "B2",
    tier: "advanced",
    simpleExplanation: "Reported speech tells what someone else said, and when the reporting verb is in the past, the tenses of the original words usually shift back one step.",
    detailedExplanation: "When reporting speech with a present-tense verb (dice que), tenses generally stay the same as the direct quote. When the reporting verb is past tense (dijo que), a tense backshift typically occurs: present → imperfect (\"Tengo hambre\" → Dijo que tenía hambre); preterite/present perfect → pluscuamperfecto (\"Comí\" / \"He comido\" → Dijo que había comido); future → conditional (\"Vendré\" → Dijo que vendría); imperative → subjunctive (\"Ven\" → Me dijo que viniera). Pronouns, possessives, and time/place expressions also shift (aquí→allí, hoy→ese día, mañana→al día siguiente, este→ese) to match the new perspective of the reporting context.",
    englishComparison: "English reported speech follows a nearly identical backshift pattern (\"I am hungry\" → He said he was hungry; \"I will come\" → He said he would come), so the core logic transfers well — the main added complexity in Spanish is that an original imperative must become a subjunctive form, which has no equivalent shift in English (\"Come!\" → He told me to come, using an infinitive, not a special mood).",
    commonMistakes: [
      "Forgetting to backshift the tense when the reporting verb is in the past (\"Dijo que tiene hambre\" instead of \"Dijo que tenía hambre\").",
      "Not converting an original command into the subjunctive (\"Me dijo que vengo\" instead of \"Me dijo que viniera\").",
      "Forgetting to shift time/place words that no longer make sense from the new perspective (\"Dijo que vendría mañana\" said days later, instead of updating it appropriately in context).",
      "Not adjusting possessives and pronouns to match the change in speaker perspective (\"Dijo que mi coche...\" when it should be \"su coche\" from the reporting speaker's viewpoint)."
    ],
    spainExamples: [
      "\"Mi jefe me dijo que llegara antes mañana\" — reporting an implied command using the imperfect subjunctive, typical workplace scenario in Spain.",
      "\"Mis padres dijeron que vendrían a visitarme el puente de mayo\" — \"el puente\" (a long weekend) is a very Spain-specific time expression.",
      "\"Le pregunté si había cogido el AVE o el coche\" — reporting a yes/no question with \"si\", referencing Spain's high-speed train."
    ],
    exampleSentences: [
      { es: "Dijo que estaba muy cansada después del viaje.", en: "She said she was very tired after the trip." },
      { es: "Me contaron que habían visto a Marta en el centro.", en: "They told me they had seen Marta downtown." },
      { es: "Nos avisó de que llegaría un poco tarde.", en: "He/she let us know he/she would arrive a bit late." },
      { es: "El profesor nos pidió que entregáramos los deberes el lunes.", en: "The teacher asked us to hand in the homework on Monday." },
      { es: "Le pregunté si le apetecía ir al cine.", en: "I asked him/her if he/she felt like going to the cinema." }
    ],
    memoryTricks: "Remember the backshift chain as a staircase going down one step: presente→imperfecto, pretérito/perfecto→pluscuamperfecto, futuro→condicional, imperativo→subjuntivo — each original tense steps back exactly one level into the past.",
    visualExplanation: "Backshift table: presente (tengo) → imperfecto (tenía) | pretérito (comí) / perfecto (he comido) → pluscuamperfecto (había comido) | futuro (vendré) → condicional (vendría) | imperativo (ven) → subjuntivo imperfecto (viniera). Time-word shifts: hoy→ese día | mañana→al día siguiente | ayer→el día anterior | aquí→allí.",
    exercises: [
      { type: "multiple-choice", prompt: "Direct: \"Vendré mañana.\" Reported (dijo que...): \"Dijo que ___ al día siguiente.\"", options: ["vendrá", "viene", "vendría", "venga"], answer: "vendría", explanation: "Future backshifts to conditional in reported speech: vendré → vendría." },
      { type: "fill-blank", prompt: "Direct: \"Tengo mucho trabajo.\" Reported: Me dijo que ___ (tener) mucho trabajo.", answer: "tenía", explanation: "Present backshifts to imperfect: tengo → tenía." },
      { type: "error-correction", prompt: "Mi madre me dijo que vengo a cenar a las nueve.", answer: "Mi madre me dijo que viniera a cenar a las nueve.", explanation: "An original command (\"Ven a cenar\") reported after a past verb becomes the imperfect subjunctive: viniera." },
      { type: "translation", prompt: "He told us he had already eaten.", answer: "Nos dijo que ya había comido.", explanation: "Present perfect (\"he comido\") backshifts to pluscuamperfecto (\"había comido\") in past reported speech." },
      { type: "sentence-building", words: ["preguntó", "si", "me", "quería", "café", "un"], answer: "Me preguntó si quería un café.", explanation: "Reporting a yes/no question uses \"si\" plus the backshifted verb." },
      { type: "dialogue-completion", prompt: "Directo: \"Estamos cansados.\" Indirecto: Dijeron que ___ cansados y que ___ (ir) a descansar.", answer: "estaban / iban", explanation: "Present \"estamos\" backshifts to \"estaban\"; present \"van\" backshifts to \"iban\"." }
    ]
  },
  {
    id: "gram_advanced_connectors",
    title: "Conectores avanzados (sin embargo, no obstante, por lo tanto, aunque...)",
    level: "B2",
    tier: "advanced",
    simpleExplanation: "Advanced connectors link ideas with logical relationships like contrast, consequence, and concession, making speech and writing sound more sophisticated and cohesive.",
    detailedExplanation: "Contrast connectors: sin embargo, no obstante (however/nevertheless, more formal), en cambio (on the other hand). Consequence connectors: por lo tanto, por consiguiente, así que (therefore, so). Concession connectors: aunque (although/even if — can take indicative for known facts, or subjunctive for hypothetical/dismissed facts: Aunque llueve, salgo [it's raining, fact] vs Aunque llueva, saldré [even if it rains, hypothetical]), a pesar de que (despite the fact that), pese a (despite). Addition connectors: además, es más (moreover/what's more). These connectors typically go at the start of a clause or sentence and are often set off by commas, and are heavily used in formal writing, opinion pieces, and higher-register spoken Spanish.",
    englishComparison: "English has direct equivalents for most of these (however, therefore, although, despite), so the concepts transfer easily — the main added difficulty is that \"aunque\" can trigger either the indicative or the subjunctive depending on whether the speaker treats the concession as a known fact or a hypothetical, a distinction English's \"although\" doesn't grammatically mark.",
    commonMistakes: [
      "Using \"pero\" in every contrastive context instead of varying with sin embargo/no obstante/en cambio for a more advanced, natural register.",
      "Always using indicative after \"aunque\" regardless of meaning, missing the nuance that subjunctive signals a hypothetical or dismissed concession (Aunque sea caro, lo compraré = Even if it's expensive [not confirmed], I'll buy it).",
      "Misplacing connectors mid-sentence without the natural comma pause that Spanish punctuation and rhythm expect.",
      "Confusing \"sino\" (but rather, after a negative) with \"pero\" (but) — a related but distinct advanced connector distinction (No es caro, sino barato vs Es caro, pero bueno)."
    ],
    spainExamples: [
      "\"El AVE es caro; sin embargo, ahorra muchísimo tiempo\" — contrasting cost and convenience of Spain's high-speed train.",
      "\"Aunque llovía, fuimos de todas formas a la Feria de Abril\" — indicative aunque for a known fact about Seville's spring festival.",
      "\"No hay entradas para el Bernabéu; por lo tanto, veremos el partido en el bar\" — logical consequence connector in an everyday football-watching context."
    ],
    exampleSentences: [
      { es: "El piso es pequeño; sin embargo, está muy bien situado.", en: "The flat is small; however, it's very well located." },
      { es: "No estudió mucho; por lo tanto, suspendió el examen.", en: "He didn't study much; therefore, he failed the exam." },
      { es: "Aunque hace frío, vamos a la playa igualmente.", en: "Although it's cold, we're going to the beach anyway." },
      { es: "A pesar de la lluvia, el concierto no se canceló.", en: "Despite the rain, the concert wasn't cancelled." },
      { es: "Además, no debemos olvidar el impacto en el medio ambiente.", en: "Moreover, we shouldn't forget the environmental impact." }
    ],
    memoryTricks: "Group connectors by function into three mental \"boxes\": CONTRAST (sin embargo, no obstante, en cambio), CONSEQUENCE (por lo tanto, así que), CONCESSION (aunque, a pesar de que) — pick the box that matches the logical relationship you need.",
    visualExplanation: "Contrast: sin embargo | no obstante | en cambio. Consequence: por lo tanto | por consiguiente | así que. Concession: aunque + indicative (known fact) | aunque + subjunctive (hypothetical/dismissed) | a pesar de que | pese a. Addition: además | es más.",
    exercises: [
      { type: "multiple-choice", prompt: "Which connector best expresses consequence?", options: ["sin embargo", "aunque", "por lo tanto", "además"], answer: "por lo tanto", explanation: "\"Por lo tanto\" (therefore) expresses a logical consequence between two ideas." },
      { type: "fill-blank", prompt: "___ hace mal tiempo, iremos de excursión (even if, hypothetical → subjunctive).", answer: "Aunque haga", explanation: "\"Aunque\" + subjunctive expresses a hypothetical/uncertain concession: aunque haga mal tiempo." },
      { type: "error-correction", prompt: "Aunque llueve mañana (todavía no lo sabemos), iremos a la excursión de todas formas.", answer: "Aunque llueva mañana (todavía no lo sabemos), iremos a la excursión de todas formas.", explanation: "Since the rain is uncertain/hypothetical (\"todavía no lo sabemos\"), \"aunque\" should trigger the subjunctive: llueva." },
      { type: "translation", prompt: "The museum was closed; nevertheless, we had a great day.", answer: "El museo estaba cerrado; sin embargo, tuvimos un día genial.", explanation: "\"Sin embargo\" is the natural formal connector for \"nevertheless\"." },
      { type: "sentence-building", words: ["pesar", "a", "de", "lluvia", "la", "salimos"], answer: "A pesar de la lluvia, salimos.", explanation: "\"A pesar de\" + noun expresses concession without needing a full clause." },
      { type: "dialogue-completion", prompt: "—¿Vais a ir a la boda ___ el mal tiempo? —Sí, ___ llueva, iremos igualmente.", answer: "a pesar del / aunque", explanation: "\"A pesar del\" (despite) and \"aunque\" (even if, + subjunctive) both express concession here." }
    ]
  },
  {
    id: "gram_idiomatic_structures",
    title: "Estructuras idiomáticas (Idiomatic Structures)",
    level: "C1",
    tier: "advanced",
    simpleExplanation: "Spanish has many fixed expressions that don't translate word-for-word into English, built around verbs like llevar, hacer, tener, and dar, that native speakers use constantly.",
    detailedExplanation: "Key idiomatic patterns: llevar + [time period] + gerund expresses how long something has been ongoing (Llevo dos años estudiando español = I've been studying Spanish for two years); hace + [time period] + que expresses duration similarly (Hace tres años que vivo aquí); tener + noun idioms express states that English expresses with \"to be\" (tener hambre/sed/sueño/razón/prisa/miedo = to be hungry/thirsty/sleepy/right/in a hurry/afraid); dar + noun idioms (dar igual = not to matter, dar pena = to feel sorry, darse cuenta de = to realize); ponerse + adjective for a change of emotional/physical state (ponerse nervioso, ponerse rojo); echar de menos (to miss someone/something).",
    englishComparison: "English builds equivalent ideas with \"to be\" (to be hungry, to be right, to be in a hurry) or different individual verbs (to realize, to miss), while Spanish channels many of these through a small set of workhorse verbs (tener, dar, ponerse, echar) combined with a noun or adjective — memorizing these as fixed chunks, rather than translating word-for-word, is essential for sounding natural.",
    commonMistakes: [
      "Translating \"to be hungry/thirsty/right\" literally with \"ser/estar\" instead of using \"tener\" (\"Estoy hambre\" instead of \"Tengo hambre\").",
      "Using \"para\" instead of \"llevar + gerundio\" or \"hace...que\" to express duration (\"Estudio español para dos años\" instead of \"Llevo dos años estudiando español\").",
      "Missing reflexive \"se\" in darse cuenta de (\"Di cuenta de mi error\" instead of \"Me di cuenta de mi error\").",
      "Confusing \"echar de menos\" (to miss someone/something emotionally) with \"perder\" (to miss a bus/deadline) — these are not interchangeable in Spanish, unlike English \"miss\" covering both."
    ],
    spainExamples: [
      "\"Llevo viviendo en este piso cinco años\" — very natural Spain phrasing for describing how long you've lived somewhere.",
      "\"Echo mucho de menos el jamón cuando estoy fuera de España\" — a classic homesickness expression among Spaniards abroad.",
      "\"Me da igual ir al cine o quedarnos en casa, vale\" — combining \"dar igual\" with the discourse marker \"vale\", extremely natural casual Spain speech."
    ],
    exampleSentences: [
      { es: "Llevo dos horas esperando el autobús.", en: "I've been waiting for the bus for two hours." },
      { es: "Tengo muchísima prisa, llego tarde al trabajo.", en: "I'm in a big hurry, I'm late for work." },
      { es: "Me di cuenta de que había olvidado las llaves.", en: "I realized I had forgotten the keys." },
      { es: "Se puso muy nerviosa antes del examen oral.", en: "She got very nervous before the oral exam." },
      { es: "Echo de menos a mis amigos de la universidad.", en: "I miss my university friends." }
    ],
    memoryTricks: "Group idioms by their \"engine verb\": TENER for states (hambre, sed, razón, prisa), DAR for reactions (igual, pena, asco), PONERSE for changes of state (nervioso, rojo, contento) — learning the verb families makes dozens of idioms easier to recall.",
    visualExplanation: "Duration: Llevo + [time] + gerundio = Llevo tres años trabajando aquí | Hace + [time] + que + present = Hace tres años que trabajo aquí. Tener idioms: tener hambre/sed/sueño/razón/prisa/miedo/calor/frío. Dar idioms: dar igual/pena/asco/rabia. Ponerse + adjective: ponerse nervioso/rojo/contento/triste.",
    exercises: [
      { type: "multiple-choice", prompt: "Which best translates \"I've been living here for three years\"?", options: ["Vivo aquí para tres años.", "Llevo tres años viviendo aquí.", "Tengo tres años viviendo aquí.", "Estoy viviendo aquí tres años."], answer: "Llevo tres años viviendo aquí.", explanation: "\"Llevar + time + gerundio\" is the natural Spanish structure for ongoing duration." },
      { type: "fill-blank", prompt: "¡Date prisa! ___ (tener) mucha prisa, el tren sale en cinco minutos.", answer: "Tengo", explanation: "\"Tener prisa\" (to be in a hurry) uses tener, not ser/estar: Tengo prisa." },
      { type: "error-correction", prompt: "Estoy mucha hambre, vamos a comer algo.", answer: "Tengo mucha hambre, vamos a comer algo.", explanation: "\"Tener hambre\" (to be hungry) is the correct idiomatic structure, not \"estar hambre\"." },
      { type: "translation", prompt: "I miss my family a lot.", answer: "Echo mucho de menos a mi familia.", explanation: "\"Echar de menos\" is the natural idiomatic expression for missing someone." },
      { type: "sentence-building", words: ["cuenta", "me", "di", "error", "de", "mi"], answer: "Me di cuenta de mi error.", explanation: "\"Darse cuenta de\" (to realize) is reflexive and requires \"me\" here." },
      { type: "dialogue-completion", prompt: "—¿Cuánto tiempo ___ (llevar) estudiando español? —___ casi tres años.", answer: "llevas / Llevo", explanation: "\"Llevar + gerundio\" expresses ongoing duration in both the question and the answer." }
    ]
  },
  {
    id: "gram_spain_advanced_usage",
    title: "Usos avanzados propios de España (leísmo, vosotros en subjuntivo/mandatos, vale/venga)",
    level: "C1",
    tier: "advanced",
    simpleExplanation: "Peninsular Spain Spanish has distinctive features non-Spain learners must know: leísmo (using \"le\" for masculine person direct objects), vosotros forms extending into the subjunctive and commands, and discourse markers like vale and venga used constantly in conversation.",
    detailedExplanation: "Leísmo: in most of Spain, \"le\" is used instead of \"lo\" as the direct object pronoun for a masculine singular person (Le vi ayer en el bar = I saw him yesterday at the bar), a usage accepted by the RAE specifically for personal masculine objects, even though \"lo\" remains the etymologically \"correct\" form and is still used for things (Lo vi = I saw it). Vosotros is the default informal plural \"you\" throughout Spain (never ustedes among friends/family), and it fully conjugates across every mood and tense, including the subjunctive (que vengáis, que tengáis, que hagáis) and the imperative (venid, comed, ¡no os preocupéis!). Discourse markers vale and venga are used constantly to punctuate spoken Spanish: vale mainly means \"okay/agreed\" and can close a phone call or confirm a plan (Vale, hasta luego); venga can mean \"come on\" (encouragement), can also serve like vale to mean \"okay, let's do it\", and can even function as a casual farewell (Venga, ¡nos vemos!).",
    englishComparison: "None of these three features exist in standard textbook \"neutral\" Spanish taught outside Spain: Latin American Spanish uses \"lo\" consistently (no leísmo) and replaces vosotros entirely with ustedes for all plural \"you\" contexts (formal and informal), and English has no direct equivalent for vale/venga as flexible conversational particles — English speakers might reach for \"okay\", \"come on\", or \"alright\", but Spanish speakers deploy vale and venga far more frequently and in more varied grammatical roles throughout a conversation.",
    commonMistakes: [
      "Learning Spanish from Latin American materials and defaulting to \"lo\" for all masculine direct objects, sounding overly formal/foreign in Spain when referring to a specific man (Spain speakers would say \"Le vi\", not necessarily \"Lo vi\", for a person).",
      "Avoiding vosotros forms in the subjunctive and imperative because they weren't drilled as much as the present indicative, and reverting to ustedes forms, which sounds distant/formal among friends in Spain.",
      "Using vale and venga interchangeably without noticing their subtle different flavors — venga often carries more encouragement/urging energy, while vale is more neutral confirmation.",
      "Overusing \"lo\" with leísmo for things (only masculine PEOPLE take \"le\" in accepted leísmo; using \"le\" for an object like a book is considered incorrect even within Spain's leísmo norms)."
    ],
    spainExamples: [
      "\"¿Has visto a mi hermano? Sí, le vi esta mañana en el gimnasio\" — textbook Spain leísmo for a male person, completely natural and expected in Madrid or anywhere in central/northern Spain.",
      "\"Venga, vale, nos vemos a las ocho en la plaza\" — combining venga and vale together to close off making plans, an extremely characteristic burst of Spain conversational Spanish.",
      "\"Cuando lleguéis, avisadme, ¿vale?\" — vosotros subjunctive/imperative (lleguéis, avisadme) plus the tag \"¿vale?\" seeking confirmation, all in one natural sentence."
    ],
    exampleSentences: [
      { es: "A Javier le conozco desde el colegio.", en: "I've known Javier since school (leísmo for a male person)." },
      { es: "Espero que vengáis todos a la cena del sábado.", en: "I hope you all come to Saturday's dinner (vosotros subjunctive)." },
      { es: "¡Venga, daos prisa, que llegamos tarde!", en: "Come on, hurry up, we're going to be late! (venga + vosotros command)" },
      { es: "Vale, nos vemos luego entonces.", en: "Okay, see you later then." },
      { es: "Cuando acabéis los deberes, avisadme, ¿vale?", en: "When you all finish your homework, let me know, okay? (vosotros subjunctive + vale tag)" }
    ],
    memoryTricks: "Remember the three-part \"Spain badge\": LE for a guy you saw (leísmo), -ÁIS/-ÉIS endings everywhere for your friend group (vosotros, even in subjunctive/commands), and VALE/VENGA sprinkled through every conversation like verbal punctuation — spotting these three features instantly marks Peninsular Spanish.",
    visualExplanation: "Leísmo: Le vi (a Juan, masc. person, accepted) vs Lo vi (el libro, a thing, standard \"lo\"). Vosotros across moods: present (habláis) | subjunctive (habléis) | affirmative command (hablad) | negative command (no habléis). Discourse markers: vale = okay/agreed/got it | venga = come on! / okay let's go / see you (as farewell).",
    exercises: [
      { type: "multiple-choice", prompt: "Which sentence shows classic Peninsular Spain leísmo?", options: ["Lo vi en el parque (a Carlos).", "Le vi en el parque (a Carlos).", "La vi en el parque (a Carlos).", "Les vi en el parque (a Carlos)."], answer: "Le vi en el parque (a Carlos).", explanation: "Using \"le\" instead of \"lo\" for a masculine singular person object is the defining feature of Spain's leísmo." },
      { type: "fill-blank", prompt: "Espero que ___ (venir, vosotros) a mi fiesta de cumpleaños.", answer: "vengáis", explanation: "Vosotros present subjunctive of venir is \"vengáis\", used after \"espero que\"." },
      { type: "error-correction", prompt: "Espero que ustedes vengan a la boda (talking to a group of close friends in Spain).", answer: "Espero que vosotros vengáis a la boda.", explanation: "Among friends in Spain, vosotros (not ustedes) is the natural informal plural, extending even into the subjunctive: vengáis." },
      { type: "translation", prompt: "Okay, come on, let's go, we're late!", answer: "Vale, venga, vamos, que llegamos tarde.", explanation: "Vale and venga are both used together here as natural Spain discourse markers urging action." },
      { type: "sentence-building", words: ["le", "conozco", "javier", "a", "bien"], answer: "A Javier le conozco bien.", explanation: "Leísmo: \"le\" as the direct object pronoun for a specific male person, Javier." },
      { type: "dialogue-completion", prompt: "—¿Nos vemos mañana a las diez? —___, perfecto. —___, hasta mañana entonces.", answer: "Vale / Venga", explanation: "\"Vale\" confirms the plan; \"venga\" here works as a casual sign-off before parting ways, both classic Spain discourse markers." }
    ]
  }
];
