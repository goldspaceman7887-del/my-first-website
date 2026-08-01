// ROADMAP MODE — a Duolingo-style path spanning all 9 ACTFL sub-levels,
// Novice Low through Advanced High. Every sentence here is original,
// written for this app — not sourced from any textbook. Units unlock in
// order; each is a short "learn 5 sentences, then a 3-question quiz" loop.
// Novice/Intermediate units teach single useful sentences; Advanced units
// use longer, multi-clause connected sentences reflecting the paragraph-
// length discourse ACTFL expects at that range. This is a growing
// foundation, not a finished multi-year curriculum — more units get added
// over time.

export const ACTFL_LEVELS = [
  { code: "novice-low", label: "Novice Low", short: "NL", blurb: "Isolated words and memorized phrases." },
  { code: "novice-mid", label: "Novice Mid", short: "NM", blurb: "Short lists and simple, formulaic sentences." },
  { code: "novice-high", label: "Novice High", short: "NH", blurb: "Simple sentences on very familiar topics, with gaps." },
  { code: "intermediate-low", label: "Intermediate Low", short: "IL", blurb: "Create with language: simple sentences on everyday needs." },
  { code: "intermediate-mid", label: "Intermediate Mid", short: "IM", blurb: "Handle simple transactions and everyday situations." },
  { code: "intermediate-high", label: "Intermediate High", short: "IH", blurb: "Connected sentences on personal, familiar topics; can narrate a little." },
  { code: "advanced-low", label: "Advanced Low", short: "AL", blurb: "Narrate and describe in major time frames with paragraph-length discourse." },
  { code: "advanced-mid", label: "Advanced Mid", short: "AM", blurb: "Handle a complication; discuss topics of broad interest with detail." },
  { code: "advanced-high", label: "Advanced High", short: "AH", blurb: "Discuss abstract/professional topics with precision; handle disagreement." }
];

export function levelIndex(code) {
  return ACTFL_LEVELS.findIndex((l) => l.code === code);
}

export const ROADMAP_UNITS = [
  { id: "r01", title: "Greetings & Introductions", titleZh: "问候和自我介绍", level: "novice-low", icon: "👋",
    sentences: [
      { zh: "你好，我叫大卫。", py: "Nǐ hǎo, wǒ jiào Dàwèi.", en: "Hello, my name is David." },
      { zh: "很高兴认识你。", py: "Hěn gāoxìng rènshi nǐ.", en: "Nice to meet you." },
      { zh: "你好吗？我很好，谢谢。", py: "Nǐ hǎo ma? Wǒ hěn hǎo, xièxie.", en: "How are you? I'm fine, thanks." },
      { zh: "请问，你叫什么名字？", py: "Qǐngwèn, nǐ jiào shénme míngzi?", en: "Excuse me, what's your name?" },
      { zh: "再见，明天见！", py: "Zàijiàn, míngtiān jiàn!", en: "Goodbye, see you tomorrow!" }
    ],
    grammar: { title: "叫 for names", pattern: "Subject + 叫 + Name", explain: "叫 introduces a name directly -- no verb 'to be' needed. It works for full names or just first names, and is the standard way to ask/give a name.", examples: [{ zh: "我叫大卫。", py: "Wǒ jiào Dàwèi.", en: "My name is David." }, { zh: "你叫什么名字？", py: "Nǐ jiào shénme míngzi?", en: "What's your name?" }], commonMistake: "Don't add 是 before 叫 (not 我是叫大卫) -- 叫 already does the job of 'to be called' by itself." } },
  { id: "r02", title: "Nationality & Language", titleZh: "国籍和语言", level: "novice-low", icon: "🌏",
    sentences: [
      { zh: "你是哪国人？", py: "Nǐ shì nǎ guó rén?", en: "What's your nationality?" },
      { zh: "我是美国人，我来自纽约。", py: "Wǒ shì Měiguórén, wǒ láizì Niǔyuē.", en: "I'm American, I'm from New York." },
      { zh: "你会说中文吗？", py: "Nǐ huì shuō Zhōngwén ma?", en: "Can you speak Chinese?" },
      { zh: "我会说一点儿中文，还不太流利。", py: "Wǒ huì shuō yìdiǎnr Zhōngwén, hái bú tài liúlì.", en: "I can speak a little Chinese, not very fluent yet." },
      { zh: "你的英语说得真好。", py: "Nǐ de Yīngyǔ shuō de zhēn hǎo.", en: "Your English is really good." }
    ],
    grammar: { title: "是 for identity", pattern: "Subject + 是 + Noun", explain: "是 links two nouns like an equals sign -- it's how you state nationality, occupation, or any identity. It never changes form for tense or subject.", examples: [{ zh: "我是美国人。", py: "Wǒ shì Měiguórén.", en: "I am American." }, { zh: "他是老师。", py: "Tā shì lǎoshī.", en: "He is a teacher." }], commonMistake: "Don't use 是 before an adjective (not 我是忙) -- adjectives use 很 instead, covered in a later unit." } },
  { id: "r03", title: "Family", titleZh: "家庭", level: "novice-low", icon: "👪",
    sentences: [
      { zh: "你家有几口人？", py: "Nǐ jiā yǒu jǐ kǒu rén?", en: "How many people are in your family?" },
      { zh: "我家有四口人：爸爸、妈妈、姐姐和我。", py: "Wǒ jiā yǒu sì kǒu rén: bàba, māma, jiějie hé wǒ.", en: "There are four in my family: dad, mom, older sister, and me." },
      { zh: "你有兄弟姐妹吗？", py: "Nǐ yǒu xiōngdì jiěmèi ma?", en: "Do you have any siblings?" },
      { zh: "我是家里最小的孩子。", py: "Wǒ shì jiā lǐ zuì xiǎo de háizi.", en: "I'm the youngest child in my family." },
      { zh: "我爸爸是医生，我妈妈是老师。", py: "Wǒ bàba shì yīshēng, wǒ māma shì lǎoshī.", en: "My dad is a doctor, my mom is a teacher." }
    ],
    grammar: { title: "Number + Measure Word + Noun", pattern: "有 + Number + Measure Word + Noun", explain: "Chinese nouns need a measure word between a number and the noun -- similar to English 'three pieces of paper.' For people, especially family members, the measure word is 口 (kǒu); for most other things it's 个 (gè).", examples: [{ zh: "我家有四口人。", py: "Wǒ jiā yǒu sì kǒu rén.", en: "There are four people in my family." }, { zh: "我有一个哥哥。", py: "Wǒ yǒu yí ge gēge.", en: "I have one older brother." }], commonMistake: "Don't skip the measure word (not 我有四人) -- it's required, not optional, in Chinese." } },
  { id: "r04", title: "Numbers & Dates", titleZh: "数字和日期", level: "novice-mid", icon: "📅",
    sentences: [
      { zh: "今天几月几号？", py: "Jīntiān jǐ yuè jǐ hào?", en: "What's today's date?" },
      { zh: "今天是九月十号，星期二。", py: "Jīntiān shì jiǔyuè shí hào, xīngqī'èr.", en: "Today is September 10th, Tuesday." },
      { zh: "你的生日是什么时候？", py: "Nǐ de shēngrì shì shénme shíhou?", en: "When is your birthday?" },
      { zh: "我的生日是六月十五号。", py: "Wǒ de shēngrì shì liùyuè shíwǔ hào.", en: "My birthday is June 15th." },
      { zh: "明年我二十五岁。", py: "Míngnián wǒ èrshíwǔ suì.", en: "Next year I'll be 25." }
    ],
    grammar: { title: "Time words come first", pattern: "Subject + Time + Predicate", explain: "Time expressions (dates, days, years) are placed right after the subject and before the verb -- the opposite order from English, which usually puts time at the end.", examples: [{ zh: "今天是九月十号。", py: "Jīntiān shì jiǔyuè shí hào.", en: "Today is September 10th." }, { zh: "我的生日是六月十五号。", py: "Wǒ de shēngrì shì liùyuè shíwǔ hào.", en: "My birthday is June 15th." }], commonMistake: "Don't put the time word at the end like in English -- 生日是六月十五号我的 is backwards." } },
  { id: "r05", title: "Time & Daily Schedule", titleZh: "时间和日常安排", level: "novice-mid", icon: "⏰",
    sentences: [
      { zh: "你每天几点起床？", py: "Nǐ měitiān jǐ diǎn qǐchuáng?", en: "What time do you get up every day?" },
      { zh: "我七点起床，八点上班。", py: "Wǒ qī diǎn qǐchuáng, bā diǎn shàngbān.", en: "I get up at 7 and start work at 8." },
      { zh: "你几点吃午饭？", py: "Nǐ jǐ diǎn chī wǔfàn?", en: "What time do you eat lunch?" },
      { zh: "我中午十二点半吃午饭。", py: "Wǒ zhōngwǔ shí'èr diǎn bàn chī wǔfàn.", en: "I eat lunch at 12:30 noon." },
      { zh: "我晚上十一点睡觉。", py: "Wǒ wǎnshang shíyī diǎn shuìjiào.", en: "I go to sleep at 11pm." }
    ],
    grammar: { title: "Time before the verb", pattern: "Subject + Clock Time + Verb", explain: "Just like dates, clock times (using 点 for o'clock) go before the verb they modify, not after -- 'I get up at 7' becomes 'I 7-o'clock get-up.'", examples: [{ zh: "我七点起床。", py: "Wǒ qī diǎn qǐchuáng.", en: "I get up at 7." }, { zh: "我晚上十一点睡觉。", py: "Wǒ wǎnshang shíyī diǎn shuìjiào.", en: "I go to sleep at 11pm." }], commonMistake: "Don't say 我起床七点 -- the time word must come before the verb, never after." } },
  { id: "r06", title: "Hobbies & Preferences", titleZh: "爱好和喜好", level: "novice-mid", icon: "🎨",
    sentences: [
      { zh: "你周末喜欢做什么？", py: "Nǐ zhōumò xǐhuan zuò shénme?", en: "What do you like to do on weekends?" },
      { zh: "我喜欢看电影和听音乐。", py: "Wǒ xǐhuan kàn diànyǐng hé tīng yīnyuè.", en: "I like watching movies and listening to music." },
      { zh: "你有什么爱好？", py: "Nǐ yǒu shénme àihào?", en: "What are your hobbies?" },
      { zh: "我的爱好是打篮球和跑步。", py: "Wǒ de àihào shì dǎ lánqiú hé pǎobù.", en: "My hobbies are playing basketball and running." },
      { zh: "我不太喜欢购物。", py: "Wǒ bú tài xǐhuan gòuwù.", en: "I don't really like shopping." }
    ],
    grammar: { title: "喜欢 + Verb/Noun", pattern: "Subject + 喜欢 + Verb Phrase / Noun", explain: "喜欢 (to like) can be followed directly by either a noun (things you like) or a verb phrase (activities you like) -- no extra connecting word needed.", examples: [{ zh: "我喜欢看电影。", py: "Wǒ xǐhuan kàn diànyǐng.", en: "I like watching movies." }, { zh: "我不太喜欢购物。", py: "Wǒ bú tài xǐhuan gòuwù.", en: "I don't really like shopping." }], commonMistake: "Don't insert 去 or 的 between 喜欢 and the verb -- 喜欢看 is correct, not 喜欢去看 for a general preference." } },
  { id: "r07", title: "Making Plans", titleZh: "安排计划", level: "novice-high", icon: "📱",
    sentences: [
      { zh: "你今晚有空吗？", py: "Nǐ jīnwǎn yǒu kòng ma?", en: "Are you free tonight?" },
      { zh: "我们一起吃饭吧，好不好？", py: "Wǒmen yìqǐ chīfàn ba, hǎo bu hǎo?", en: "Let's eat together, okay?" },
      { zh: "你星期六有什么安排？", py: "Nǐ xīngqīliù yǒu shénme ānpái?", en: "What are your plans for Saturday?" },
      { zh: "我们几点、在哪儿见面？", py: "Wǒmen jǐ diǎn, zài nǎr jiànmiàn?", en: "What time and where shall we meet?" },
      { zh: "对不起，我今天没有时间，改天吧。", py: "Duìbuqǐ, wǒ jīntiān méiyǒu shíjiān, gǎitiān ba.", en: "Sorry, I don't have time today, let's do it another day." }
    ],
    grammar: { title: "Suggestions with 吧 and 好不好", pattern: "Statement + 吧 / Statement, 好不好？", explain: "Adding 吧 to the end of a statement turns it into a soft suggestion ('let's...'). Adding 好不好？ or 好吗？ instead turns it into a question checking if the other person agrees.", examples: [{ zh: "我们一起吃饭吧。", py: "Wǒmen yìqǐ chīfàn ba.", en: "Let's eat together." }, { zh: "我们几点、在哪儿见面？", py: "Wǒmen jǐ diǎn, zài nǎr jiànmiàn?", en: "What time and where shall we meet?" }], commonMistake: "吧 and 吗 don't combine -- a sentence ends in one or the other, never both." } },
  { id: "r08", title: "Studying Chinese", titleZh: "学习中文", level: "novice-high", icon: "📚",
    sentences: [
      { zh: "你学中文多长时间了？", py: "Nǐ xué Zhōngwén duō cháng shíjiān le?", en: "How long have you been studying Chinese?" },
      { zh: "我学中文已经一年了。", py: "Wǒ xué Zhōngwén yǐjīng yì nián le.", en: "I've been studying Chinese for a year already." },
      { zh: "汉字很难写，但是很有意思。", py: "Hànzì hěn nán xiě, dànshì hěn yǒu yìsi.", en: "Chinese characters are hard to write, but very interesting." },
      { zh: "你觉得中文难不难？", py: "Nǐ juéde Zhōngwén nán bu nán?", en: "Do you think Chinese is difficult?" },
      { zh: "多说多练，你会越来越好。", py: "Duō shuō duō liàn, nǐ huì yuè lái yuè hǎo.", en: "Speak more, practice more, and you'll get better and better." }
    ],
    grammar: { title: "Duration with 了", pattern: "Verb + Time Duration + 了", explain: "To say how long you've been doing something (and are still doing it), put the duration after the verb, followed by 了 to show it's ongoing up to now.", examples: [{ zh: "我学中文已经一年了。", py: "Wǒ xué Zhōngwén yǐjīng yì nián le.", en: "I've been studying Chinese for a year already." }, { zh: "你学中文多长时间了？", py: "Nǐ xué Zhōngwén duō cháng shíjiān le?", en: "How long have you been studying Chinese?" }], commonMistake: "Don't drop the final 了 -- without it, the sentence loses the 'and still going' meaning." } },
  { id: "r09", title: "School & Work", titleZh: "学校和工作", level: "intermediate-low", icon: "🏫",
    sentences: [
      { zh: "你在哪儿上班？", py: "Nǐ zài nǎr shàngbān?", en: "Where do you work?" },
      { zh: "我在一家公司当工程师。", py: "Wǒ zài yì jiā gōngsī dāng gōngchéngshī.", en: "I work as an engineer at a company." },
      { zh: "你是大学生吗？在哪个学校上学？", py: "Nǐ shì dàxuéshēng ma? Zài nǎge xuéxiào shàngxué?", en: "Are you a university student? Which school do you attend?" },
      { zh: "我们八点上课，下午三点下课。", py: "Wǒmen bā diǎn shàngkè, xiàwǔ sān diǎn xiàkè.", en: "Our classes start at 8 and end at 3pm." },
      { zh: "我的工作很忙，但是我很喜欢。", py: "Wǒ de gōngzuò hěn máng, dànshì wǒ hěn xǐhuan.", en: "My job is busy, but I like it a lot." }
    ],
    grammar: { title: "在 marking location of an action", pattern: "Subject + 在 + Place + Verb", explain: "在 placed before a place word and a verb means the action happens 'at' that place. This is different from 在 alone as 'to be located.'", examples: [{ zh: "我在一家公司当工程师。", py: "Wǒ zài yì jiā gōngsī dāng gōngchéngshī.", en: "I work as an engineer at a company." }, { zh: "你在哪儿上班？", py: "Nǐ zài nǎr shàngbān?", en: "Where do you work?" }], commonMistake: "Don't put 在 + place after the verb like English 'work at a company' -- it has to come before the verb: 在公司工作, not 工作在公司." } },
  { id: "r10", title: "Shopping", titleZh: "购物", level: "intermediate-low", icon: "🛍️",
    sentences: [
      { zh: "这个多少钱？", py: "Zhège duōshao qián?", en: "How much is this?" },
      { zh: "太贵了，便宜点儿吧。", py: "Tài guì le, piányi diǎnr ba.", en: "Too expensive, give me a discount." },
      { zh: "我可以试穿一下吗？", py: "Wǒ kěyǐ shìchuān yíxià ma?", en: "Can I try it on?" },
      { zh: "有没有大一点的？", py: "Yǒu méiyǒu dà yìdiǎn de?", en: "Do you have a bigger size?" },
      { zh: "我要这件，可以刷卡吗？", py: "Wǒ yào zhè jiàn, kěyǐ shuākǎ ma?", en: "I'll take this one, can I pay by card?" }
    ],
    grammar: { title: "可以 for permission", pattern: "Subject + 可以 + Verb + 吗？", explain: "可以 asks for or grants permission -- 'may I' or 'is it OK to.' Answer yes with 可以 alone; answer no with 不可以 or the softer 不行.", examples: [{ zh: "我可以试穿一下吗？", py: "Wǒ kěyǐ shìchuān yíxià ma?", en: "Can I try it on?" }, { zh: "我要这件，可以刷卡吗？", py: "Wǒ yào zhè jiàn, kěyǐ shuākǎ ma?", en: "I'll take this one, can I pay by card?" }], commonMistake: "可以 is about permission/possibility -- don't confuse it with 会, which is about learned ability (I know how to)." } },
  { id: "r11", title: "Food & Restaurants", titleZh: "美食和餐厅", level: "intermediate-low", icon: "🍜",
    sentences: [
      { zh: "服务员，我们想点菜。", py: "Fúwùyuán, wǒmen xiǎng diǎn cài.", en: "Waiter, we'd like to order." },
      { zh: "这个菜辣不辣？", py: "Zhège cài là bu là?", en: "Is this dish spicy?" },
      { zh: "请给我们一壶茶。", py: "Qǐng gěi wǒmen yì hú chá.", en: "Please bring us a pot of tea." },
      { zh: "这道菜真好吃，你也尝尝。", py: "Zhè dào cài zhēn hǎochī, nǐ yě chángchang.", en: "This dish is really delicious, try some too." },
      { zh: "服务员，买单，谢谢。", py: "Fúwùyuán, mǎidān, xièxie.", en: "Waiter, the bill please, thanks." }
    ],
    grammar: { title: "A-not-A questions", pattern: "Subject + Verb/Adj + 不 + Verb/Adj？", explain: "Repeating a verb or adjective in positive-then-negative form is an alternative to using 吗 for yes/no questions -- both are equally common in speech.", examples: [{ zh: "这个菜辣不辣？", py: "Zhège cài là bu là?", en: "Is this dish spicy?" }, { zh: "你要不要喝茶？", py: "Nǐ yào bu yào hē chá?", en: "Do you want to drink tea or not?" }], commonMistake: "Don't add 吗 to an A-not-A question -- 辣不辣吗 double-marks the question and isn't used." } },
  { id: "r12", title: "Directions & Transportation", titleZh: "方向和交通", level: "intermediate-mid", icon: "🚕",
    sentences: [
      { zh: "请问，最近的地铁站在哪儿？", py: "Qǐngwèn, zuìjìn de dìtiězhàn zài nǎr?", en: "Excuse me, where's the nearest subway station?" },
      { zh: "一直往前走，然后往左拐。", py: "Yìzhí wǎng qián zǒu, ránhòu wǎng zuǒ guǎi.", en: "Go straight ahead, then turn left." },
      { zh: "从这儿到机场要多长时间？", py: "Cóng zhèr dào jīchǎng yào duō cháng shíjiān?", en: "How long does it take to get from here to the airport?" },
      { zh: "我们坐地铁去还是打车去？", py: "Wǒmen zuò dìtiě qù háishi dǎchē qù?", en: "Should we take the subway or a taxi?" },
      { zh: "师傅，麻烦到这个地址，谢谢。", py: "Shīfu, máfan dào zhège dìzhǐ, xièxie.", en: "Driver, please take me to this address, thanks." }
    ],
    grammar: { title: "从...到... and direction complements", pattern: "从 + Point A + 到 + Point B; 往 + Direction + 走/拐", explain: "从...到... brackets a start and end point (for places or times). 往 + a direction word + a motion verb (走 to walk, 拐 to turn) tells someone which way to go.", examples: [{ zh: "从这儿到机场要多长时间？", py: "Cóng zhèr dào jīchǎng yào duō cháng shíjiān?", en: "How long does it take from here to the airport?" }, { zh: "一直往前走，然后往左拐。", py: "Yìzhí wǎng qián zǒu, ránhòu wǎng zuǒ guǎi.", en: "Go straight ahead, then turn left." }], commonMistake: "Don't drop 从 or 到 -- unlike English, Chinese needs both markers even when the context seems obvious." } },
  { id: "r13", title: "Weather & Seasons", titleZh: "天气和季节", level: "intermediate-mid", icon: "☀️",
    sentences: [
      { zh: "今天天气怎么样？", py: "Jīntiān tiānqì zěnmeyàng?", en: "How's the weather today?" },
      { zh: "今天很晴朗，但是有点儿冷。", py: "Jīntiān hěn qínglǎng, dànshì yǒudiǎnr lěng.", en: "It's sunny today, but a bit cold." },
      { zh: "明天可能会下雨，记得带伞。", py: "Míngtiān kěnéng huì xiàyǔ, jìde dài sǎn.", en: "It might rain tomorrow, remember to bring an umbrella." },
      { zh: "我最喜欢秋天，不冷也不热。", py: "Wǒ zuì xǐhuan qiūtiān, bù lěng yě bú rè.", en: "I like autumn the most, neither cold nor hot." },
      { zh: "夏天这儿很热，冬天很冷。", py: "Xiàtiān zhèr hěn rè, dōngtiān hěn lěng.", en: "It's hot here in summer, cold in winter." }
    ],
    grammar: { title: "会 for future possibility", pattern: "Subject/Topic + 可能 + 会 + Verb Phrase", explain: "Beyond 'know how to,' 会 also predicts something is likely to happen in the future -- especially natural paired with 可能 (possibly) for weather and forecasts.", examples: [{ zh: "明天可能会下雨。", py: "Míngtiān kěnéng huì xiàyǔ.", en: "It might rain tomorrow." }, { zh: "今天很晴朗，但是有点儿冷。", py: "Jīntiān hěn qínglǎng, dànshì yǒudiǎnr lěng.", en: "It's sunny today, but a bit cold." }], commonMistake: "For weather that's already happening, don't use 会 -- 会 is for predictions, not for describing the current state (外面在下雨, not 外面会下雨, for rain happening right now)." } },
  { id: "r14", title: "Health & Feelings", titleZh: "健康和感受", level: "intermediate-mid", icon: "🤒",
    sentences: [
      { zh: "你怎么了？看起来不太舒服。", py: "Nǐ zěnme le? Kànqǐlái bú tài shūfu.", en: "What's wrong? You don't look well." },
      { zh: "我有点儿头疼，可能感冒了。", py: "Wǒ yǒudiǎnr tóuténg, kěnéng gǎnmào le.", en: "I have a bit of a headache, maybe I caught a cold." },
      { zh: "你应该多喝水，好好休息。", py: "Nǐ yīnggāi duō hē shuǐ, hǎohāo xiūxi.", en: "You should drink more water and rest well." },
      { zh: "今天考试通过了，我很高兴。", py: "Jīntiān kǎoshì tōngguò le, wǒ hěn gāoxìng.", en: "I passed the exam today, I'm very happy." },
      { zh: "别担心，一切都会好起来的。", py: "Bié dānxīn, yíqiè dōu huì hǎo qǐlái de.", en: "Don't worry, everything will be fine." }
    ],
    grammar: { title: "应该 for advice", pattern: "Subject + 应该 + Verb Phrase", explain: "应该 means 'should' or 'ought to' -- it softens a suggestion into friendly advice rather than a command.", examples: [{ zh: "你应该多喝水，好好休息。", py: "Nǐ yīnggāi duō hē shuǐ, hǎohāo xiūxi.", en: "You should drink more water and rest well." }, { zh: "别担心，一切都会好起来的。", py: "Bié dānxīn, yíqiè dōu huì hǎo qǐlái de.", en: "Don't worry, everything will be fine." }], commonMistake: "应该 expresses obligation/advice, not ability -- don't swap it in for 能 or 会 when talking about being capable of something." } },
  { id: "r15", title: "Travel", titleZh: "旅行", level: "intermediate-high", icon: "✈️",
    sentences: [
      { zh: "你去过中国吗？", py: "Nǐ qùguo Zhōngguó ma?", en: "Have you been to China?" },
      { zh: "我下个月要去北京旅游。", py: "Wǒ xià ge yuè yào qù Běijīng lǚyóu.", en: "I'm going to travel to Beijing next month." },
      { zh: "你打算在那儿待多久？", py: "Nǐ dǎsuàn zài nàr dāi duō jiǔ?", en: "How long do you plan to stay there?" },
      { zh: "我想去长城和故宫看看。", py: "Wǒ xiǎng qù Chángchéng hé Gùgōng kànkan.", en: "I want to visit the Great Wall and the Forbidden City." },
      { zh: "别忘了带护照和相机。", py: "Bié wàng le dài hùzhào hé xiàngjī.", en: "Don't forget to bring your passport and camera." }
    ],
    grammar: { title: "过 for past experience", pattern: "Subject + Verb + 过 + Object", explain: "过 attached right after a verb marks that you've had the experience of doing something at least once in your life -- 'have ever done X' -- regardless of when.", examples: [{ zh: "你去过中国吗？", py: "Nǐ qùguo Zhōngguó ma?", en: "Have you been to China?" }, { zh: "我想去长城和故宫看看。", py: "Wǒ xiǎng qù Chángchéng hé Gùgōng kànkan.", en: "I want to visit the Great Wall and the Forbidden City." }], commonMistake: "过 (experience) and 了 (completion) answer different questions -- 去过 means 'have ever been,' while 去了 just means 'went' on a specific occasion." } },
  { id: "r16", title: "Opinions & Small Talk", titleZh: "意见和闲聊", level: "intermediate-high", icon: "💬",
    sentences: [
      { zh: "我觉得这个主意不错。", py: "Wǒ juéde zhège zhǔyi búcuò.", en: "I think this idea is pretty good." },
      { zh: "你觉得呢？你同意吗？", py: "Nǐ juéde ne? Nǐ tóngyì ma?", en: "What do you think? Do you agree?" },
      { zh: "说实话，我不太确定。", py: "Shuō shíhuà, wǒ bú tài quèdìng.", en: "To be honest, I'm not too sure." },
      { zh: "这要看情况。", py: "Zhè yào kàn qíngkuàng.", en: "That depends on the situation." },
      { zh: "不管怎么样，我们试试看吧。", py: "Bùguǎn zěnmeyàng, wǒmen shìshi kàn ba.", en: "No matter what, let's give it a try." }
    ],
    grammar: { title: "我觉得 for opinions", pattern: "我觉得 + Clause", explain: "我觉得 ('I feel/think that') is the everyday way to introduce a personal opinion -- more casual than 我认为, which sounds more formal.", examples: [{ zh: "我觉得这个主意不错。", py: "Wǒ juéde zhège zhǔyi búcuò.", en: "I think this idea is pretty good." }, { zh: "你觉得呢？你同意吗？", py: "Nǐ juéde ne? Nǐ tóngyì ma?", en: "What do you think? Do you agree?" }], commonMistake: "No 是 or 那 is needed after 我觉得 -- the clause follows directly, unlike some English 'I think that...' constructions that get over-translated word for word." } },
  { id: "r17", title: "Describing Past Experiences", titleZh: "描述过去的经历", level: "intermediate-high", icon: "🎒",
    sentences: [
      { zh: "你去年做了什么让你印象最深的事？", py: "Nǐ qùnián zuò le shénme ràng nǐ yìnxiàng zuì shēn de shì?", en: "What's the most memorable thing you did last year?" },
      { zh: "去年夏天我一个人去西藏旅行了三个星期。", py: "Qùnián xiàtiān wǒ yí ge rén qù Xīzàng lǚxíng le sān ge xīngqī.", en: "Last summer I traveled to Tibet alone for three weeks." },
      { zh: "虽然旅途很辛苦，但是我学到了很多东西。", py: "Suīrán lǚtú hěn xīnkǔ, dànshì wǒ xuédào le hěn duō dōngxi.", en: "Although the journey was tough, I learned a lot." },
      { zh: "如果有机会，我还想再去一次。", py: "Rúguǒ yǒu jīhuì, wǒ hái xiǎng zài qù yí cì.", en: "If I have the chance, I'd like to go again." },
      { zh: "那次经历彻底改变了我看世界的方式。", py: "Nà cì jīnglì chèdǐ gǎibiàn le wǒ kàn shìjiè de fāngshì.", en: "That experience completely changed the way I see the world." }
    ],
    grammar: { title: "虽然...但是... (although...but...)", pattern: "虽然 + Clause A，但是 + Clause B", explain: "Unlike English, which usually drops one half ('Although tired, I'm happy' -- no 'but'), Chinese keeps both 虽然 and 但是 in the same sentence. Leaving one out sounds incomplete.", examples: [{ zh: "虽然旅途很辛苦，但是我学到了很多东西。", py: "Suīrán lǚtú hěn xīnkǔ, dànshì wǒ xuédào le hěn duō dōngxi.", en: "Although the journey was tough, I learned a lot." }, { zh: "如果有机会，我还想再去一次。", py: "Rúguǒ yǒu jīhuì, wǒ hái xiǎng zài qù yí cì.", en: "If I have the chance, I'd like to go again." }], commonMistake: "Don't drop 但是 the way English drops 'but' -- 虽然...但是... is a matched pair in Chinese." } },
  { id: "r18", title: "Handling a Complication", titleZh: "处理突发状况", level: "intermediate-high", icon: "🧳",
    sentences: [
      { zh: "对不起，我订的房间好像被取消了。", py: "Duìbuqǐ, wǒ dìng de fángjiān hǎoxiàng bèi qǔxiāo le.", en: "Excuse me, it seems my room reservation was cancelled." },
      { zh: "能不能麻烦您帮我查一下预订记录？", py: "Néng bu néng máfan nín bāng wǒ chá yíxià yùdìng jìlù?", en: "Could you please help me check the reservation record?" },
      { zh: "这不是我的错，我有确认邮件为证。", py: "Zhè bú shì wǒ de cuò, wǒ yǒu quèrèn yóujiàn wéi zhèng.", en: "This isn't my fault, I have a confirmation email as proof." },
      { zh: "要是问题解决不了，我需要找您的经理谈谈。", py: "Yàoshi wèntí jiějué bù liǎo, wǒ xūyào zhǎo nín de jīnglǐ tántan.", en: "If the problem can't be resolved, I'll need to speak with your manager." },
      { zh: "谢谢你的耐心，希望这种事不会再发生。", py: "Xièxie nǐ de nàixīn, xīwàng zhè zhǒng shì bú huì zài fāshēng.", en: "Thanks for your patience, I hope this won't happen again." }
    ],
    grammar: { title: "被 passive voice", pattern: "Subject + 被 + (Agent) + Verb + Complement", explain: "被 marks the passive voice: the subject receives the action instead of doing it. The person/thing doing the action is optional and can be omitted if unknown or unimportant.", examples: [{ zh: "我订的房间好像被取消了。", py: "Wǒ dìng de fángjiān hǎoxiàng bèi qǔxiāo le.", en: "It seems my room reservation was cancelled." }, { zh: "这不是我的错，我有确认邮件为证。", py: "Zhè bú shì wǒ de cuò, wǒ yǒu quèrèn yóujiàn wéi zhèng.", en: "This isn't my fault, I have a confirmation email as proof." }], commonMistake: "被 sentences almost always need a verb complement or 了 after the verb (被取消了, not just 被取消) -- a bare verb after 被 sounds incomplete." } },
  { id: "r19", title: "Narrating a Sequence of Events", titleZh: "叙述一连串的事件", level: "advanced-low", icon: "📱",
    sentences: [
      { zh: "那天早上我一起床就发现手机不见了。", py: "Nà tiān zǎoshang wǒ yì qǐchuáng jiù fāxiàn shǒujī bú jiàn le.", en: "That morning, as soon as I got up, I found my phone missing." },
      { zh: "我先是在房间里翻箱倒柜地找，什么都没找到。", py: "Wǒ xiānshì zài fángjiān lǐ fān xiāng dǎo guì de zhǎo, shénme dōu méi zhǎodào.", en: "I first turned the room upside down looking, but found nothing." },
      { zh: "后来才想起来，昨晚可能落在出租车上了。", py: "Hòulái cái xiǎngqǐlái, zuówǎn kěnéng là zài chūzūchē shàng le.", en: "Later I remembered I might have left it in the taxi last night." },
      { zh: "幸好司机师傅第二天主动联系了我，把手机还给了我。", py: "Xìnghǎo sījī shīfu dì-èr tiān zhǔdòng liánxì le wǒ, bǎ shǒujī huán gěi le wǒ.", en: "Luckily the driver contacted me the next day and returned the phone." },
      { zh: "这件事让我明白，出门在外还是小心一点比较好。", py: "Zhè jiàn shì ràng wǒ míngbai, chūmén zài wài háishi xiǎoxīn yìdiǎn bǐjiào hǎo.", en: "This taught me that it's better to be a bit more careful when out and about." }
    ],
    grammar: { title: "Sequencing a narrative", pattern: "先...，后来（才）...，幸好...", explain: "先 (first), 后来 (later/afterward), and 幸好 (luckily) are connector words that string a series of events into a clear timeline -- essential for telling a story instead of just listing disconnected facts.", examples: [{ zh: "我先是在房间里翻箱倒柜地找，什么都没找到。", py: "Wǒ xiānshì zài fángjiān lǐ fān xiāng dǎo guì de zhǎo, shénme dōu méi zhǎodào.", en: "I first turned the room upside down looking, but found nothing." }, { zh: "后来才想起来，昨晚可能落在出租车上了。", py: "Hòulái cái xiǎngqǐlái, zuówǎn kěnéng là zài chūzūchē shàng le.", en: "Later I remembered I might have left it in the taxi last night." }], commonMistake: "Don't rely only on 了 to show sequence -- native narration leans on connector words like these, not just aspect markers, to make the order of events clear." } },
  { id: "r20", title: "Supporting an Opinion", titleZh: "支持自己的观点", level: "advanced-low", icon: "🗳️",
    sentences: [
      { zh: "我个人认为，远程工作对年轻人来说利大于弊。", py: "Wǒ gèrén rènwéi, yuǎnchéng gōngzuò duì niánqīngrén láishuō lì dà yú bì.", en: "Personally, I think remote work benefits young people more than it harms them." },
      { zh: "首先，它节省了通勤时间，让人有更多时间陪家人。", py: "Shǒuxiān, tā jiéshěng le tōngqín shíjiān, ràng rén yǒu gèng duō shíjiān péi jiārén.", en: "First, it saves commuting time, giving people more time with family." },
      { zh: "不过，也有人担心在家工作会影响团队合作。", py: "Búguò, yě yǒu rén dānxīn zài jiā gōngzuò huì yǐngxiǎng tuánduì hézuò.", en: "However, some worry that working from home affects teamwork." },
      { zh: "我觉得只要沟通及时，这个问题是可以解决的。", py: "Wǒ juéde zhǐyào gōutōng jíshí, zhège wèntí shì kěyǐ jiějué de.", en: "I think as long as communication is timely, this problem can be solved." },
      { zh: "总的来说，我支持公司提供更灵活的工作方式。", py: "Zǒngdeláishuō, wǒ zhīchí gōngsī tígōng gèng línghuó de gōngzuò fāngshì.", en: "Overall, I support companies offering more flexible ways of working." }
    ],
    grammar: { title: "Structuring an argument", pattern: "首先...，不过...，总的来说...", explain: "首先 (first of all), 不过 (however), and 总的来说 (overall/in summary) are discourse markers that organize an opinion into a clear structure: main point, counterpoint, conclusion -- exactly how Advanced-level speech is expected to be organized.", examples: [{ zh: "首先，它节省了通勤时间，让人有更多时间陪家人。", py: "Shǒuxiān, tā jiéshěng le tōngqín shíjiān, ràng rén yǒu gèng duō shíjiān péi jiārén.", en: "First, it saves commuting time, giving people more time with family." }, { zh: "总的来说，我支持公司提供更灵活的工作方式。", py: "Zǒngdeláishuō, wǒ zhīchí gōngsī tígōng gèng línghuó de gōngzuò fāngshì.", en: "Overall, I support companies offering more flexible ways of working." }], commonMistake: "Without these connectors, a string of opinions can sound like disconnected statements rather than a reasoned argument -- they're what makes extended speech sound organized." } },
  { id: "r21", title: "Comparing Hypothetical Scenarios", titleZh: "比较假设情境", level: "advanced-mid", icon: "🔀",
    sentences: [
      { zh: "假如我当初选择了另一个专业，现在的生活会完全不一样吧。", py: "Jiǎrú wǒ dāngchū xuǎnzé le lìng yí ge zhuānyè, xiànzài de shēnghuó huì wánquán bù yíyàng ba.", en: "If I had chosen a different major back then, my life now would probably be completely different." },
      { zh: "有时候我在想，要是留在国内发展，是不是压力会小一些？", py: "Yǒu shíhou wǒ zài xiǎng, yàoshi liú zài guónèi fāzhǎn, shì bu shì yālì huì xiǎo yìxiē?", en: "Sometimes I wonder, if I'd stayed to develop my career at home, would the pressure be a bit less?" },
      { zh: "但换个角度想，出国也让我看到了更大的世界。", py: "Dàn huàn ge jiǎodù xiǎng, chūguó yě ràng wǒ kàndào le gèng dà de shìjiè.", en: "But looked at another way, going abroad also let me see a much bigger world." },
      { zh: "每个选择都有得有失，很难说哪条路绝对更好。", py: "Měi ge xuǎnzé dōu yǒu dé yǒu shī, hěn nán shuō nǎ tiáo lù juéduì gèng hǎo.", en: "Every choice has its gains and losses; it's hard to say which path is absolutely better." },
      { zh: "与其后悔过去的决定，不如把握好现在。", py: "Yǔqí hòuhuǐ guòqù de juédìng, bùrú bǎwò hǎo xiànzài.", en: "Rather than regretting past decisions, it's better to make the most of the present." }
    ],
    grammar: { title: "假如/要是...的话 (hypotheticals)", pattern: "假如/要是 + Condition + 的话，Subject + 会 + Result", explain: "假如 or 要是 introduces a hypothetical condition (often paired with an optional 的话 at the end of the clause), and 会 in the result clause marks what would happen -- Chinese's core way to talk about 'what if.'", examples: [{ zh: "假如我当初选择了另一个专业，现在的生活会完全不一样吧。", py: "Jiǎrú wǒ dāngchū xuǎnzé le lìng yí ge zhuānyè, xiànzài de shēnghuó huì wánquán bù yíyàng ba.", en: "If I had chosen a different major back then, my life now would probably be completely different." }, { zh: "每个选择都有得有失，很难说哪条路绝对更好。", py: "Měi ge xuǎnzé dōu yǒu dé yǒu shī, hěn nán shuō nǎ tiáo lù juéduì gèng hǎo.", en: "Every choice has its gains and losses; it's hard to say which path is absolutely better." }], commonMistake: "Chinese doesn't have a separate verb form for 'would have' like English -- 会 plus context (and often 了 or 吧) carries all of that hypothetical/past meaning." } },
  { id: "r22", title: "Explaining a System", titleZh: "解释一个体制", level: "advanced-mid", icon: "🏛️",
    sentences: [
      { zh: "中国的高考制度对学生未来的发展影响很大。", py: "Zhōngguó de gāokǎo zhìdù duì xuésheng wèilái de fāzhǎn yǐngxiǎng hěn dà.", en: "China's college entrance exam system greatly affects students' future development." },
      { zh: "学生从高一开始就要为这场考试做准备。", py: "Xuésheng cóng gāo yī kāishǐ jiù yào wèi zhè chǎng kǎoshì zuò zhǔnbèi.", en: "Students start preparing for this exam from their first year of high school." },
      { zh: "考试成绩几乎决定了他们能上哪所大学。", py: "Kǎoshì chéngjì jīhū juédìng le tāmen néng shàng nǎ suǒ dàxué.", en: "The exam score almost determines which university they can attend." },
      { zh: "近年来，社会上出现了不少改革这个制度的声音。", py: "Jìnnián lái, shèhuì shàng chūxiàn le bùshǎo gǎigé zhège zhìdù de shēngyīn.", en: "In recent years, there have been quite a few voices in society calling to reform this system." },
      { zh: "究竟应该怎么改，各方一直没有达成一致意见。", py: "Jiūjìng yīnggāi zěnme gǎi, gè fāng yìzhí méiyǒu dáchéng yízhì yìjiàn.", en: "Exactly how it should be reformed is something all sides still haven't agreed on." }
    ],
    grammar: { title: "对...有影响 (impact on something)", pattern: "Subject + 对 + Object + 有/产生 + Effect", explain: "对 introduces what something affects, and is followed by a verb like 有 (to have) or 产生 (to produce) plus a noun like 影响 (influence/impact) -- the standard way to describe cause-and-effect relationships in explanatory speech.", examples: [{ zh: "中国的高考制度对学生未来的发展影响很大。", py: "Zhōngguó de gāokǎo zhìdù duì xuésheng wèilái de fāzhǎn yǐngxiǎng hěn dà.", en: "China's college entrance exam system greatly affects students' future development." }, { zh: "近年来，社会上出现了不少改革这个制度的声音。", py: "Jìnnián lái, shèhuì shàng chūxiàn le bùshǎo gǎigé zhège zhìdù de shēngyīn.", en: "In recent years, there have been quite a few voices in society calling to reform this system." }], commonMistake: "Don't confuse 对 (regarding/toward) with 跟/和 (with) -- 对学生的影响 (impact on students) is a completely different meaning from 跟学生的关系 (relationship with students)." } },
  { id: "r23", title: "Discussing Abstract & Professional Topics", titleZh: "讨论抽象和专业话题", level: "advanced-high", icon: "🤖",
    sentences: [
      { zh: "人工智能的迅速发展正在重新定义许多行业的工作方式。", py: "Réngōng zhìnéng de xùnsù fāzhǎn zhèngzài chóngxīn dìngyì xǔduō hángyè de gōngzuò fāngshì.", en: "The rapid development of AI is redefining how many industries work." },
      { zh: "有专家指出，与其担心被机器取代，不如思考如何与技术共存。", py: "Yǒu zhuānjiā zhǐchū, yǔqí dānxīn bèi jīqì qǔdài, bùrú sīkǎo rúhé yǔ jìshù gòngcún.", en: "Some experts point out that rather than worrying about being replaced by machines, it's better to think about how to coexist with technology." },
      { zh: "这场变革带来的不仅是挑战，也蕴含着前所未有的机遇。", py: "Zhè chǎng biàngé dàilái de bùjǐn shì tiǎozhàn, yě yùnhánzhe qiánsuǒwèiyǒu de jīyù.", en: "This transformation brings not only challenges but also unprecedented opportunities." },
      { zh: "归根结底，如何权衡效率与就业，是政策制定者必须面对的难题。", py: "Guīgēnjiédǐ, rúhé quánhéng xiàolǜ yǔ jiùyè, shì zhèngcè zhìdìngzhě bìxū miànduì de nántí.", en: "Ultimately, how to balance efficiency and employment is a difficult problem policymakers must confront." },
      { zh: "我认为，教育体系的及时调整将是应对这一趋势的关键。", py: "Wǒ rènwéi, jiàoyù tǐxì de jíshí tiáozhěng jiāng shì yìngduì zhè yī qūshì de guānjiàn.", en: "I believe timely adjustment of the education system will be key to responding to this trend." }
    ],
    grammar: { title: "与其...不如... (rather than...better to...)", pattern: "与其 + Option A，不如 + Option B", explain: "与其...不如... weighs two options and states a preference: 'rather than A, it's better to B.' It's a hallmark of nuanced, Advanced-level argumentation, common in professional and abstract discussion.", examples: [{ zh: "与其担心被机器取代，不如思考如何与技术共存。", py: "Yǔqí dānxīn bèi jīqì qǔdài, bùrú sīkǎo rúhé yǔ jìshù gòngcún.", en: "Rather than worrying about being replaced by machines, it's better to think about how to coexist with technology." }, { zh: "我认为，教育体系的及时调整将是应对这一趋势的关键。", py: "Wǒ rènwéi, jiàoyù tǐxì de jíshí tiáozhěng jiāng shì yìngduì zhè yī qūshì de guānjiàn.", en: "I believe timely adjustment of the education system will be key to responding to this trend." }], commonMistake: "The two halves are not equal alternatives -- 不如 always signals which option is being recommended, so order matters (the recommended choice comes second)." } },
  { id: "r24", title: "Navigating a Sensitive Disagreement", titleZh: "妥善处理分歧", level: "advanced-high", icon: "🤝",
    sentences: [
      { zh: "关于这个问题，我恐怕不能完全同意您的看法。", py: "Guānyú zhège wèntí, wǒ kǒngpà bù néng wánquán tóngyì nín de kànfǎ.", en: "Regarding this issue, I'm afraid I can't completely agree with your view." },
      { zh: "我理解您的顾虑，但事情恐怕没有那么简单。", py: "Wǒ lǐjiě nín de gùlǜ, dàn shìqing kǒngpà méiyǒu nàme jiǎndān.", en: "I understand your concerns, but I'm afraid the matter isn't that simple." },
      { zh: "从长远来看，这个方案可能会带来一些意想不到的问题。", py: "Cóng chángyuǎn lái kàn, zhège fāng'àn kěnéng huì dàilái yìxiē yìxiǎngbúdào de wèntí.", en: "In the long run, this plan might bring some unexpected problems." },
      { zh: "也许我们可以换个思路，找一个双方都能接受的折中方案。", py: "Yěxǔ wǒmen kěyǐ huàn ge sīlù, zhǎo yí ge shuāngfāng dōu néng jiēshòu de zhézhōng fāng'àn.", en: "Perhaps we could think differently and find a compromise both sides can accept." },
      { zh: "不管最后决定是什么，我希望我们能就事论事，理性讨论。", py: "Bùguǎn zuìhòu juédìng shì shénme, wǒ xīwàng wǒmen néng jiùshìlùnshì, lǐxìng tǎolùn.", en: "Whatever the final decision is, I hope we can discuss it rationally, on its own merits." }
    ],
    grammar: { title: "恐怕 and 不管...都... (hedging and concession)", pattern: "恐怕 + Clause; 不管 + Question word/Alternatives，Subject + 都/也 + Verb", explain: "恐怕 ('I'm afraid that...') softens a disagreement or bad news, making it less blunt. 不管...都/也... means 'no matter what/who/how,' dismissing all alternatives to state something holds true regardless.", examples: [{ zh: "关于这个问题，我恐怕不能完全同意您的看法。", py: "Guānyú zhège wèntí, wǒ kǒngpà bù néng wánquán tóngyì nín de kànfǎ.", en: "Regarding this issue, I'm afraid I can't completely agree with your view." }, { zh: "不管最后决定是什么，我希望我们能就事论事，理性讨论。", py: "Bùguǎn zuìhòu juédìng shì shénme, wǒ xīwàng wǒmen néng jiùshìlùnshì, lǐxìng tǎolùn.", en: "Whatever the final decision is, I hope we can discuss it rationally, on its own merits." }], commonMistake: "不管 needs a question word (什么/谁/怎么) or an 'A还是B' alternative in its clause, plus 都 or 也 in the result -- dropping either half breaks the pattern." } }
];
