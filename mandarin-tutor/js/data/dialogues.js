// 10 short beginner/low-intermediate dialogues across daily-life categories.
// Each ships: the line-by-line script (Chinese/pinyin/English), key
// vocabulary used, two comprehension questions, and an optional cultural
// note — everything needed for listening + speaking + review practice.

export const DIALOGUES = [
  { id: "d01", title: "Meeting Someone New", titleZh: "认识新朋友", level: "beginner", category: "greetings",
    lines: [
      { spk: "A", zh: "你好！我叫安娜。", py: "Nǐ hǎo! Wǒ jiào Ānnà.", en: "Hello! My name is Anna." },
      { spk: "B", zh: "你好，我叫王明。很高兴认识你。", py: "Nǐ hǎo, wǒ jiào Wáng Míng. Hěn gāoxìng rènshi nǐ.", en: "Hello, I'm Wang Ming. Nice to meet you." },
      { spk: "A", zh: "我也很高兴认识你。你是哪国人？", py: "Wǒ yě hěn gāoxìng rènshi nǐ. Nǐ shì nǎ guó rén?", en: "Nice to meet you too. What's your nationality?" },
      { spk: "B", zh: "我是中国人。你呢？", py: "Wǒ shì Zhōngguó rén. Nǐ ne?", en: "I'm Chinese. And you?" },
      { spk: "A", zh: "我是美国人。你是学生吗？", py: "Wǒ shì Měiguó rén. Nǐ shì xuésheng ma?", en: "I'm American. Are you a student?" },
      { spk: "B", zh: "是，我在大学学习。", py: "Shì, wǒ zài dàxué xuéxí.", en: "Yes, I study at university." }
    ],
    vocabHighlights: [{ w: "认识", py: "rènshi", en: "to know (a person)" }, { w: "哪国人", py: "nǎ guó rén", en: "what nationality" }, { w: "学习", py: "xuéxí", en: "to study" }],
    comprehension: [
      { q: "What is Wang Ming's nationality?", options: ["American", "Chinese", "Unclear"], answerIndex: 1 },
      { q: "Is Wang Ming a student?", options: ["Yes, at university", "No, he works", "Not mentioned"], answerIndex: 0 }
    ],
    culturalNote: "Asking 你是哪国人 (nationality) right after meeting someone is completely normal small talk in China — it's not considered intrusive the way it might feel elsewhere." },

  { id: "d02", title: "Ordering Food", titleZh: "点菜", level: "beginner", category: "food",
    lines: [
      { spk: "服务员", zh: "欢迎光临！请问几位？", py: "Huānyíng guānglín! Qǐngwèn jǐ wèi?", en: "Welcome! How many people?" },
      { spk: "客人", zh: "两位，谢谢。", py: "Liǎng wèi, xièxie.", en: "Two, thanks." },
      { spk: "服务员", zh: "请这边坐。这是菜单。", py: "Qǐng zhè biān zuò. Zhè shì càidān.", en: "Please sit this way. Here's the menu." },
      { spk: "客人", zh: "谢谢。我们要一个宫保鸡丁和一碗米饭。", py: "Xièxie. Wǒmen yào yí ge gōngbǎo jīdīng hé yì wǎn mǐfàn.", en: "Thanks. We'd like a Kung Pao chicken and a bowl of rice." },
      { spk: "服务员", zh: "好的，还要喝点什么？", py: "Hǎo de, hái yào hē diǎn shénme?", en: "Okay, anything to drink?" },
      { spk: "客人", zh: "一杯茶，谢谢。", py: "Yì bēi chá, xièxie.", en: "A cup of tea, thanks." },
      { spk: "服务员", zh: "好，请稍等。", py: "Hǎo, qǐng shāo děng.", en: "Okay, please wait a moment." }
    ],
    vocabHighlights: [{ w: "几位", py: "jǐ wèi", en: "how many people (polite)" }, { w: "菜单", py: "càidān", en: "menu" }, { w: "点菜", py: "diǎn cài", en: "to order food" }],
    comprehension: [
      { q: "How many people are dining?", options: ["One", "Two", "Three"], answerIndex: 1 },
      { q: "What did they order to drink?", options: ["Coffee", "Beer", "Tea"], answerIndex: 2 }
    ],
    culturalNote: "服务员 (waiter/waitress) is called out loud across the restaurant to get their attention — it's normal, not rude." },

  { id: "d03", title: "Asking for Directions", titleZh: "问路", level: "beginner", category: "directions",
    lines: [
      { spk: "A", zh: "请问，火车站怎么走？", py: "Qǐngwèn, huǒchēzhàn zěnme zǒu?", en: "Excuse me, how do I get to the train station?" },
      { spk: "B", zh: "一直往前走，到红绿灯往右拐。", py: "Yìzhí wǎng qián zǒu, dào hónglǜdēng wǎng yòu guǎi.", en: "Go straight ahead, turn right at the traffic light." },
      { spk: "A", zh: "远吗？", py: "Yuǎn ma?", en: "Is it far?" },
      { spk: "B", zh: "不远，走十分钟就到了。", py: "Bù yuǎn, zǒu shí fēnzhōng jiù dào le.", en: "Not far, it's a 10-minute walk." },
      { spk: "A", zh: "谢谢你！", py: "Xièxie nǐ!", en: "Thank you!" },
      { spk: "B", zh: "不客气。", py: "Bú kèqi.", en: "You're welcome." }
    ],
    vocabHighlights: [{ w: "怎么走", py: "zěnme zǒu", en: "how to get there" }, { w: "红绿灯", py: "hónglǜdēng", en: "traffic light" }, { w: "拐", py: "guǎi", en: "to turn" }],
    comprehension: [
      { q: "Which way do you turn at the traffic light?", options: ["Left", "Right", "Straight"], answerIndex: 1 },
      { q: "How long is the walk?", options: ["5 minutes", "10 minutes", "20 minutes"], answerIndex: 1 }
    ] },

  { id: "d04", title: "At the Clothing Store", titleZh: "在服装店", level: "beginner", category: "shopping",
    lines: [
      { spk: "店员", zh: "欢迎光临，需要帮忙吗？", py: "Huānyíng guānglín, xūyào bāngmáng ma?", en: "Welcome, need any help?" },
      { spk: "顾客", zh: "我想买一件外套。", py: "Wǒ xiǎng mǎi yí jiàn wàitào.", en: "I want to buy a coat." },
      { spk: "店员", zh: "您喜欢什么颜色？", py: "Nín xǐhuan shénme yánsè?", en: "What color do you like?" },
      { spk: "顾客", zh: "黑色的，有吗？", py: "Hēisè de, yǒu ma?", en: "Black, do you have any?" },
      { spk: "店员", zh: "有，这件怎么样？", py: "Yǒu, zhè jiàn zěnmeyàng?", en: "Yes, how about this one?" },
      { spk: "顾客", zh: "多少钱？", py: "Duōshao qián?", en: "How much is it?" },
      { spk: "店员", zh: "三百块，现在打八折。", py: "Sānbǎi kuài, xiànzài dǎ bā zhé.", en: "300 yuan, it's 20% off right now." },
      { spk: "顾客", zh: "太好了，我要这件。", py: "Tài hǎo le, wǒ yào zhè jiàn.", en: "Great, I'll take this one." }
    ],
    vocabHighlights: [{ w: "外套", py: "wàitào", en: "coat" }, { w: "打折", py: "dǎzhé", en: "discount" }, { w: "颜色", py: "yánsè", en: "color" }],
    comprehension: [
      { q: "What is the customer buying?", options: ["Shoes", "A coat", "A shirt"], answerIndex: 1 },
      { q: "What's the discount?", options: ["10% off", "20% off", "No discount"], answerIndex: 1 }
    ] },

  { id: "d05", title: "Introducing My Family", titleZh: "介绍我的家人", level: "beginner", category: "family",
    lines: [
      { spk: "A", zh: "你家有几口人？", py: "Nǐ jiā yǒu jǐ kǒu rén?", en: "How many people are in your family?" },
      { spk: "B", zh: "我家有四口人：爸爸、妈妈、姐姐和我。", py: "Wǒ jiā yǒu sì kǒu rén: bàba, māma, jiějie hé wǒ.", en: "There are four in my family: dad, mom, older sister, and me." },
      { spk: "A", zh: "你姐姐做什么工作？", py: "Nǐ jiějie zuò shénme gōngzuò?", en: "What does your sister do?" },
      { spk: "B", zh: "她是医生，在医院工作。", py: "Tā shì yīshēng, zài yīyuàn gōngzuò.", en: "She's a doctor, works at a hospital." },
      { spk: "A", zh: "你爸爸妈妈呢？", py: "Nǐ bàba māma ne?", en: "And your parents?" },
      { spk: "B", zh: "我爸爸是老师，我妈妈在家。", py: "Wǒ bàba shì lǎoshī, wǒ māma zài jiā.", en: "My dad is a teacher, my mom is at home." }
    ],
    vocabHighlights: [{ w: "几口人", py: "jǐ kǒu rén", en: "how many family members" }, { w: "工作", py: "gōngzuò", en: "job; to work" }, { w: "医院", py: "yīyuàn", en: "hospital" }],
    comprehension: [
      { q: "How many people are in speaker B's family?", options: ["Three", "Four", "Five"], answerIndex: 1 },
      { q: "What is the sister's job?", options: ["Teacher", "Doctor", "Waitress"], answerIndex: 1 }
    ] },

  { id: "d06", title: "Making Weekend Plans", titleZh: "周末计划", level: "beginner", category: "daily",
    lines: [
      { spk: "A", zh: "周末你有什么计划？", py: "Zhōumò nǐ yǒu shénme jìhuà?", en: "What are your plans for the weekend?" },
      { spk: "B", zh: "我想去买东西，你呢？", py: "Wǒ xiǎng qù mǎi dōngxi, nǐ ne?", en: "I want to go shopping, and you?" },
      { spk: "A", zh: "我打算在家休息。", py: "Wǒ dǎsuàn zài jiā xiūxi.", en: "I plan to rest at home." },
      { spk: "B", zh: "我们一起去看电影，好不好？", py: "Wǒmen yìqǐ qù kàn diànyǐng, hǎo bu hǎo?", en: "Let's watch a movie together, okay?" },
      { spk: "A", zh: "好啊！几点？", py: "Hǎo a! Jǐ diǎn?", en: "Sure! What time?" },
      { spk: "B", zh: "下午三点怎么样？", py: "Xiàwǔ sān diǎn zěnmeyàng?", en: "How about 3pm?" },
      { spk: "A", zh: "可以，就这么定了。", py: "Kěyǐ, jiù zhème dìng le.", en: "Sounds good, it's settled then." }
    ],
    vocabHighlights: [{ w: "计划", py: "jìhuà", en: "plan" }, { w: "打算", py: "dǎsuàn", en: "to plan to" }, { w: "好不好", py: "hǎo bu hǎo", en: "is that okay?" }],
    comprehension: [
      { q: "What do they decide to do together?", options: ["Go shopping", "Watch a movie", "Stay home"], answerIndex: 1 },
      { q: "What time do they agree on?", options: ["1pm", "3pm", "6pm"], answerIndex: 1 }
    ] },

  { id: "d07", title: "Talking About the Weather", titleZh: "聊天气", level: "beginner", category: "weather",
    lines: [
      { spk: "A", zh: "今天天气怎么样？", py: "Jīntiān tiānqì zěnmeyàng?", en: "How's the weather today?" },
      { spk: "B", zh: "很冷，还刮风。", py: "Hěn lěng, hái guāfēng.", en: "Very cold, and windy too." },
      { spk: "A", zh: "明天呢？会下雨吗？", py: "Míngtiān ne? Huì xiàyǔ ma?", en: "What about tomorrow? Will it rain?" },
      { spk: "B", zh: "天气预报说明天晴天。", py: "Tiānqì yùbào shuō míngtiān qíngtiān.", en: "The forecast says it'll be sunny tomorrow." },
      { spk: "A", zh: "太好了，我们可以出去玩。", py: "Tài hǎo le, wǒmen kěyǐ chūqù wán.", en: "Great, we can go out and have fun." }
    ],
    vocabHighlights: [{ w: "天气预报", py: "tiānqì yùbào", en: "weather forecast" }, { w: "刮风", py: "guāfēng", en: "windy" }, { w: "晴天", py: "qíngtiān", en: "sunny day" }],
    comprehension: [
      { q: "How's today's weather?", options: ["Hot and sunny", "Cold and windy", "Rainy"], answerIndex: 1 },
      { q: "What's the forecast for tomorrow?", options: ["Rain", "Snow", "Sunny"], answerIndex: 2 }
    ] },

  { id: "d08", title: "Taking a Taxi", titleZh: "坐出租车", level: "beginner", category: "travel",
    lines: [
      { spk: "乘客", zh: "师傅，去机场，谢谢。", py: "Shīfu, qù jīchǎng, xièxie.", en: "Driver, to the airport please, thanks." },
      { spk: "司机", zh: "好的，大概四十分钟。", py: "Hǎo de, dàgài sìshí fēnzhōng.", en: "Okay, about 40 minutes." },
      { spk: "乘客", zh: "大概多少钱？", py: "Dàgài duōshao qián?", en: "About how much will it cost?" },
      { spk: "司机", zh: "大概一百块。", py: "Dàgài yìbǎi kuài.", en: "About 100 yuan." },
      { spk: "乘客", zh: "好，麻烦快一点，我要赶飞机。", py: "Hǎo, máfan kuài yìdiǎn, wǒ yào gǎn fēijī.", en: "Okay, please hurry a bit, I need to catch my flight." },
      { spk: "司机", zh: "没问题！", py: "Méi wèntí!", en: "No problem!" }
    ],
    vocabHighlights: [{ w: "师傅", py: "shīfu", en: "master (polite for driver)" }, { w: "大概", py: "dàgài", en: "approximately" }, { w: "赶飞机", py: "gǎn fēijī", en: "to rush to catch a flight" }],
    comprehension: [
      { q: "Where is the passenger going?", options: ["Train station", "Airport", "Hotel"], answerIndex: 1 },
      { q: "Why does the passenger want to hurry?", options: ["Meeting a friend", "Catching a flight", "Work"], answerIndex: 1 }
    ] },

  { id: "d09", title: "First Day at School", titleZh: "开学第一天", level: "beginner", category: "school",
    lines: [
      { spk: "老师", zh: "同学们好，我是你们的中文老师。", py: "Tóngxuémen hǎo, wǒ shì nǐmen de Zhōngwén lǎoshī.", en: "Hello everyone, I'm your Chinese teacher." },
      { spk: "学生", zh: "老师好！", py: "Lǎoshī hǎo!", en: "Hello, teacher!" },
      { spk: "老师", zh: "你们以前学过中文吗？", py: "Nǐmen yǐqián xuéguo Zhōngwén ma?", en: "Have you studied Chinese before?" },
      { spk: "学生", zh: "学过一点儿，但是不多。", py: "Xuéguo yìdiǎnr, dànshì bù duō.", en: "A little, but not much." },
      { spk: "老师", zh: "没关系，我们从头开始。", py: "Méi guānxi, wǒmen cóngtóu kāishǐ.", en: "That's fine, we'll start from the beginning." },
      { spk: "学生", zh: "谢谢老师！", py: "Xièxie lǎoshī!", en: "Thank you, teacher!" }
    ],
    vocabHighlights: [{ w: "同学", py: "tóngxué", en: "classmate" }, { w: "以前", py: "yǐqián", en: "before; previously" }, { w: "从头开始", py: "cóngtóu kāishǐ", en: "start from scratch" }],
    comprehension: [
      { q: "Have the students studied Chinese before?", options: ["Never", "A little", "A lot"], answerIndex: 1 },
      { q: "What does the teacher say they'll do?", options: ["Skip basics", "Start from the beginning", "Take a test"], answerIndex: 1 }
    ] },

  { id: "d10", title: "Feeling Sick", titleZh: "生病了", level: "beginner", category: "health",
    lines: [
      { spk: "A", zh: "你怎么了？看起来不太舒服。", py: "Nǐ zěnme le? Kànqǐlái bú tài shūfu.", en: "What's wrong? You don't look too well." },
      { spk: "B", zh: "我头疼，可能感冒了。", py: "Wǒ tóuténg, kěnéng gǎnmào le.", en: "I have a headache, maybe I've caught a cold." },
      { spk: "A", zh: "你应该去医院看医生。", py: "Nǐ yīnggāi qù yīyuàn kàn yīshēng.", en: "You should go to the hospital to see a doctor." },
      { spk: "B", zh: "好，我现在就去。", py: "Hǎo, wǒ xiànzài jiù qù.", en: "Okay, I'll go right now." },
      { spk: "A", zh: "多喝水，好好休息。", py: "Duō hē shuǐ, hǎohāo xiūxi.", en: "Drink more water and get good rest." },
      { spk: "B", zh: "谢谢你的关心。", py: "Xièxie nǐ de guānxīn.", en: "Thanks for caring." }
    ],
    vocabHighlights: [{ w: "头疼", py: "tóuténg", en: "headache" }, { w: "感冒", py: "gǎnmào", en: "to catch a cold" }, { w: "应该", py: "yīnggāi", en: "should" }],
    comprehension: [
      { q: "What symptom does B have?", options: ["Stomachache", "Headache", "Fever"], answerIndex: 1 },
      { q: "What does A suggest?", options: ["Sleep more", "See a doctor", "Take medicine"], answerIndex: 1 }
    ] }
];
