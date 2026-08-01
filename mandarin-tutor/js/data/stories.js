// 4 graded mini-stories built almost entirely from vocabulary and
// characters already taught elsewhere in the app. Each ships
// paragraph-by-paragraph Chinese/pinyin/English, a vocab review list,
// comprehension questions, and speaking questions — matching STORY MODE.

export const STORIES = [
  { id: "st01", title: "My Day", titleZh: "我的一天", level: "beginner",
    paragraphs: [
      { zh: "我每天七点起床。", py: "Wǒ měitiān qī diǎn qǐchuáng.", en: "I get up at 7 every day." },
      { zh: "我吃早饭，喝一杯咖啡。", py: "Wǒ chī zǎofàn, hē yì bēi kāfēi.", en: "I eat breakfast and drink a cup of coffee." },
      { zh: "九点我去上班。我在一家公司工作。", py: "Jiǔ diǎn wǒ qù shàngbān. Wǒ zài yì jiā gōngsī gōngzuò.", en: "At 9 I go to work. I work at a company." },
      { zh: "中午我和同事一起吃午饭。", py: "Zhōngwǔ wǒ hé tóngshì yìqǐ chī wǔfàn.", en: "At noon I eat lunch with my colleagues." },
      { zh: "晚上六点我下班，回家吃晚饭。", py: "Wǎnshang liù diǎn wǒ xiàbān, huí jiā chī wǎnfàn.", en: "At 6pm I finish work and go home to eat dinner." },
      { zh: "十一点我睡觉。我很忙，但是很开心。", py: "Shíyī diǎn wǒ shuìjiào. Wǒ hěn máng, dànshì hěn kāixīn.", en: "At 11 I go to sleep. I'm busy, but happy." }
    ],
    vocabReview: [{ w: "起床", py: "qǐchuáng", en: "to get up" }, { w: "上班", py: "shàngbān", en: "to go to work" }, { w: "下班", py: "xiàbān", en: "to get off work" }, { w: "同事", py: "tóngshì", en: "colleague" }],
    comprehension: [
      { q: "What time does the narrator get up?", a: "七点 (7 o'clock)" },
      { q: "Who does the narrator eat lunch with?", a: "同事 (colleagues)" },
      { q: "How does the narrator feel at the end of the day?", a: "很忙，但是很开心 (busy but happy)" }
    ],
    speakingQuestions: ["你几点起床？", "你在哪儿工作或者学习？", "你今天开心吗？为什么？"] },

  { id: "st02", title: "My Family", titleZh: "我的家人", level: "beginner",
    paragraphs: [
      { zh: "我家有五口人：爸爸、妈妈、哥哥、妹妹和我。", py: "Wǒ jiā yǒu wǔ kǒu rén: bàba, māma, gēge, mèimei hé wǒ.", en: "There are five people in my family: dad, mom, older brother, younger sister, and me." },
      { zh: "我爸爸是老师，他在学校工作。", py: "Wǒ bàba shì lǎoshī, tā zài xuéxiào gōngzuò.", en: "My dad is a teacher, he works at a school." },
      { zh: "我妈妈是医生，她在医院工作。", py: "Wǒ māma shì yīshēng, tā zài yīyuàn gōngzuò.", en: "My mom is a doctor, she works at a hospital." },
      { zh: "我哥哥是大学生，他学习中文。", py: "Wǒ gēge shì dàxuéshēng, tā xuéxí Zhōngwén.", en: "My older brother is a university student, he studies Chinese." },
      { zh: "我妹妹才八岁，她很可爱。", py: "Wǒ mèimei cái bā suì, tā hěn kě'ài.", en: "My younger sister is only 8, she's very cute." },
      { zh: "周末我们一家人一起吃饭，很开心。", py: "Zhōumò wǒmen yì jiā rén yìqǐ chīfàn, hěn kāixīn.", en: "On weekends our whole family eats together, very happy." }
    ],
    vocabReview: [{ w: "家人", py: "jiārén", en: "family members" }, { w: "大学生", py: "dàxuéshēng", en: "university student" }, { w: "可爱", py: "kě'ài", en: "cute" }, { w: "一起", py: "yìqǐ", en: "together" }],
    comprehension: [
      { q: "How many people are in the narrator's family?", a: "五口人 (five people)" },
      { q: "What does the mom do?", a: "她是医生 (she's a doctor)" },
      { q: "What does the family do on weekends?", a: "一起吃饭 (eat together)" }
    ],
    speakingQuestions: ["你家有几口人？", "你的爸爸妈妈做什么工作？", "周末你和家人做什么？"] },

  { id: "st03", title: "The Weekend", titleZh: "周末", level: "beginner",
    paragraphs: [
      { zh: "周末我不上班，我可以睡懒觉。", py: "Zhōumò wǒ bú shàngbān, wǒ kěyǐ shuì lǎnjiào.", en: "On weekends I don't work, I can sleep in." },
      { zh: "星期六早上我去超市买东西。", py: "Xīngqīliù zǎoshang wǒ qù chāoshì mǎi dōngxi.", en: "Saturday morning I go to the supermarket to shop." },
      { zh: "下午我和朋友一起去公园。", py: "Xiàwǔ wǒ hé péngyou yìqǐ qù gōngyuán.", en: "In the afternoon I go to the park with a friend." },
      { zh: "我们在公园散步，聊天，很舒服。", py: "Wǒmen zài gōngyuán sànbù, liáotiān, hěn shūfu.", en: "We walk and chat in the park, very relaxing." },
      { zh: "星期天我在家看书，休息。", py: "Xīngqītiān wǒ zài jiā kàn shū, xiūxi.", en: "Sunday I stay home reading and resting." },
      { zh: "晚上我准备好下星期的工作。", py: "Wǎnshang wǒ zhǔnbèi hǎo xià xīngqī de gōngzuò.", en: "In the evening I prepare for next week's work." }
    ],
    vocabReview: [{ w: "睡懒觉", py: "shuì lǎnjiào", en: "to sleep in" }, { w: "公园", py: "gōngyuán", en: "park" }, { w: "散步", py: "sànbù", en: "to take a walk" }, { w: "准备", py: "zhǔnbèi", en: "to prepare" }],
    comprehension: [
      { q: "What does the narrator do Saturday morning?", a: "去超市买东西 (go to the supermarket)" },
      { q: "Where do the narrator and friend go in the afternoon?", a: "公园 (the park)" },
      { q: "What does the narrator do Sunday?", a: "在家看书，休息 (stay home reading and resting)" }
    ],
    speakingQuestions: ["周末你做什么？", "你喜欢去公园吗？", "你怎么准备新的一星期？"] },

  { id: "st04", title: "At the Restaurant", titleZh: "在饭馆", level: "intermediate",
    paragraphs: [
      { zh: "今天是我的生日，所以我和朋友去饭馆吃饭。", py: "Jīntiān shì wǒ de shēngrì, suǒyǐ wǒ hé péngyou qù fànguǎn chīfàn.", en: "Today is my birthday, so my friend and I went to a restaurant to eat." },
      { zh: "服务员给我们菜单，我们点了很多菜。", py: "Fúwùyuán gěi wǒmen càidān, wǒmen diǎn le hěn duō cài.", en: "The waiter gave us the menu, and we ordered a lot of dishes." },
      { zh: "我们点了鱼、肉和一个汤。", py: "Wǒmen diǎn le yú, ròu hé yí ge tāng.", en: "We ordered fish, meat, and a soup." },
      { zh: "菜很好吃，我们都很喜欢。", py: "Cài hěn hǎochī, wǒmen dōu hěn xǐhuan.", en: "The food was delicious, we all liked it." },
      { zh: "吃完以后，服务员送了我一个小蛋糕。", py: "Chīwán yǐhòu, fúwùyuán sòng le wǒ yí ge xiǎo dàngāo.", en: "After eating, the waiter gave me a small cake." },
      { zh: "我很高兴，这是一个难忘的生日。", py: "Wǒ hěn gāoxìng, zhè shì yí ge nánwàng de shēngrì.", en: "I was very happy, this was an unforgettable birthday." }
    ],
    vocabReview: [{ w: "生日", py: "shēngrì", en: "birthday" }, { w: "饭馆", py: "fànguǎn", en: "restaurant" }, { w: "点菜", py: "diǎn cài", en: "to order dishes" }, { w: "难忘", py: "nánwàng", en: "unforgettable" }],
    comprehension: [
      { q: "Why did they go to the restaurant?", a: "今天是生日 (it was a birthday)" },
      { q: "What three things did they order?", a: "鱼、肉和一个汤 (fish, meat, and soup)" },
      { q: "What surprise did the waiter bring?", a: "一个小蛋糕 (a small cake)" }
    ],
    speakingQuestions: ["你生日的时候做什么？", "你喜欢吃什么菜？", "你去过难忘的饭馆吗？"] }
];
