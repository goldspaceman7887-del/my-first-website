// ROADMAP MODE — a Duolingo-style path of 16 units following the standard
// beginner-Mandarin topic sequence (greetings -> nationality -> family ->
// dates/time -> hobbies -> plans -> studying -> school/work -> shopping ->
// food -> directions -> weather -> health -> travel -> opinions). Every
// sentence here is original, written for this app — not sourced from any
// textbook. Units unlock in order; each is a short "learn 5 sentences,
// then a 3-question quiz" loop.

export const ROADMAP_UNITS = [
  { id: "r01", title: "Greetings & Introductions", titleZh: "问候和自我介绍", icon: "👋",
    sentences: [
      { zh: "你好，我叫大卫。", py: "Nǐ hǎo, wǒ jiào Dàwèi.", en: "Hello, my name is David." },
      { zh: "很高兴认识你。", py: "Hěn gāoxìng rènshi nǐ.", en: "Nice to meet you." },
      { zh: "你好吗？我很好，谢谢。", py: "Nǐ hǎo ma? Wǒ hěn hǎo, xièxie.", en: "How are you? I'm fine, thanks." },
      { zh: "请问，你叫什么名字？", py: "Qǐngwèn, nǐ jiào shénme míngzi?", en: "Excuse me, what's your name?" },
      { zh: "再见，明天见！", py: "Zàijiàn, míngtiān jiàn!", en: "Goodbye, see you tomorrow!" }
    ] },
  { id: "r02", title: "Nationality & Language", titleZh: "国籍和语言", icon: "🌏",
    sentences: [
      { zh: "你是哪国人？", py: "Nǐ shì nǎ guó rén?", en: "What's your nationality?" },
      { zh: "我是美国人，我来自纽约。", py: "Wǒ shì Měiguórén, wǒ láizì Niǔyuē.", en: "I'm American, I'm from New York." },
      { zh: "你会说中文吗？", py: "Nǐ huì shuō Zhōngwén ma?", en: "Can you speak Chinese?" },
      { zh: "我会说一点儿中文，还不太流利。", py: "Wǒ huì shuō yìdiǎnr Zhōngwén, hái bú tài liúlì.", en: "I can speak a little Chinese, not very fluent yet." },
      { zh: "你的英语说得真好。", py: "Nǐ de Yīngyǔ shuō de zhēn hǎo.", en: "Your English is really good." }
    ] },
  { id: "r03", title: "Family", titleZh: "家庭", icon: "👪",
    sentences: [
      { zh: "你家有几口人？", py: "Nǐ jiā yǒu jǐ kǒu rén?", en: "How many people are in your family?" },
      { zh: "我家有四口人：爸爸、妈妈、姐姐和我。", py: "Wǒ jiā yǒu sì kǒu rén: bàba, māma, jiějie hé wǒ.", en: "There are four in my family: dad, mom, older sister, and me." },
      { zh: "你有兄弟姐妹吗？", py: "Nǐ yǒu xiōngdì jiěmèi ma?", en: "Do you have any siblings?" },
      { zh: "我是家里最小的孩子。", py: "Wǒ shì jiā lǐ zuì xiǎo de háizi.", en: "I'm the youngest child in my family." },
      { zh: "我爸爸是医生，我妈妈是老师。", py: "Wǒ bàba shì yīshēng, wǒ māma shì lǎoshī.", en: "My dad is a doctor, my mom is a teacher." }
    ] },
  { id: "r04", title: "Numbers & Dates", titleZh: "数字和日期", icon: "📅",
    sentences: [
      { zh: "今天几月几号？", py: "Jīntiān jǐ yuè jǐ hào?", en: "What's today's date?" },
      { zh: "今天是九月十号，星期二。", py: "Jīntiān shì jiǔyuè shí hào, xīngqī'èr.", en: "Today is September 10th, Tuesday." },
      { zh: "你的生日是什么时候？", py: "Nǐ de shēngrì shì shénme shíhou?", en: "When is your birthday?" },
      { zh: "我的生日是六月十五号。", py: "Wǒ de shēngrì shì liùyuè shíwǔ hào.", en: "My birthday is June 15th." },
      { zh: "明年我二十五岁。", py: "Míngnián wǒ èrshíwǔ suì.", en: "Next year I'll be 25." }
    ] },
  { id: "r05", title: "Time & Daily Schedule", titleZh: "时间和日常安排", icon: "⏰",
    sentences: [
      { zh: "你每天几点起床？", py: "Nǐ měitiān jǐ diǎn qǐchuáng?", en: "What time do you get up every day?" },
      { zh: "我七点起床，八点上班。", py: "Wǒ qī diǎn qǐchuáng, bā diǎn shàngbān.", en: "I get up at 7 and start work at 8." },
      { zh: "你几点吃午饭？", py: "Nǐ jǐ diǎn chī wǔfàn?", en: "What time do you eat lunch?" },
      { zh: "我中午十二点半吃午饭。", py: "Wǒ zhōngwǔ shí'èr diǎn bàn chī wǔfàn.", en: "I eat lunch at 12:30 noon." },
      { zh: "我晚上十一点睡觉。", py: "Wǒ wǎnshang shíyī diǎn shuìjiào.", en: "I go to sleep at 11pm." }
    ] },
  { id: "r06", title: "Hobbies & Preferences", titleZh: "爱好和喜好", icon: "🎨",
    sentences: [
      { zh: "你周末喜欢做什么？", py: "Nǐ zhōumò xǐhuan zuò shénme?", en: "What do you like to do on weekends?" },
      { zh: "我喜欢看电影和听音乐。", py: "Wǒ xǐhuan kàn diànyǐng hé tīng yīnyuè.", en: "I like watching movies and listening to music." },
      { zh: "你有什么爱好？", py: "Nǐ yǒu shénme àihào?", en: "What are your hobbies?" },
      { zh: "我的爱好是打篮球和跑步。", py: "Wǒ de àihào shì dǎ lánqiú hé pǎobù.", en: "My hobbies are playing basketball and running." },
      { zh: "我不太喜欢购物。", py: "Wǒ bú tài xǐhuan gòuwù.", en: "I don't really like shopping." }
    ] },
  { id: "r07", title: "Making Plans", titleZh: "安排计划", icon: "📱",
    sentences: [
      { zh: "你今晚有空吗？", py: "Nǐ jīnwǎn yǒu kòng ma?", en: "Are you free tonight?" },
      { zh: "我们一起吃饭吧，好不好？", py: "Wǒmen yìqǐ chīfàn ba, hǎo bu hǎo?", en: "Let's eat together, okay?" },
      { zh: "你星期六有什么安排？", py: "Nǐ xīngqīliù yǒu shénme ānpái?", en: "What are your plans for Saturday?" },
      { zh: "我们几点、在哪儿见面？", py: "Wǒmen jǐ diǎn, zài nǎr jiànmiàn?", en: "What time and where shall we meet?" },
      { zh: "对不起，我今天没有时间，改天吧。", py: "Duìbuqǐ, wǒ jīntiān méiyǒu shíjiān, gǎitiān ba.", en: "Sorry, I don't have time today, let's do it another day." }
    ] },
  { id: "r08", title: "Studying Chinese", titleZh: "学习中文", icon: "📚",
    sentences: [
      { zh: "你学中文多长时间了？", py: "Nǐ xué Zhōngwén duō cháng shíjiān le?", en: "How long have you been studying Chinese?" },
      { zh: "我学中文已经一年了。", py: "Wǒ xué Zhōngwén yǐjīng yì nián le.", en: "I've been studying Chinese for a year already." },
      { zh: "汉字很难写，但是很有意思。", py: "Hànzì hěn nán xiě, dànshì hěn yǒu yìsi.", en: "Chinese characters are hard to write, but very interesting." },
      { zh: "你觉得中文难不难？", py: "Nǐ juéde Zhōngwén nán bu nán?", en: "Do you think Chinese is difficult?" },
      { zh: "多说多练，你会越来越好。", py: "Duō shuō duō liàn, nǐ huì yuè lái yuè hǎo.", en: "Speak more, practice more, and you'll get better and better." }
    ] },
  { id: "r09", title: "School & Work", titleZh: "学校和工作", icon: "🏫",
    sentences: [
      { zh: "你在哪儿上班？", py: "Nǐ zài nǎr shàngbān?", en: "Where do you work?" },
      { zh: "我在一家公司当工程师。", py: "Wǒ zài yì jiā gōngsī dāng gōngchéngshī.", en: "I work as an engineer at a company." },
      { zh: "你是大学生吗？在哪个学校上学？", py: "Nǐ shì dàxuéshēng ma? Zài nǎge xuéxiào shàngxué?", en: "Are you a university student? Which school do you attend?" },
      { zh: "我们八点上课，下午三点下课。", py: "Wǒmen bā diǎn shàngkè, xiàwǔ sān diǎn xiàkè.", en: "Our classes start at 8 and end at 3pm." },
      { zh: "我的工作很忙，但是我很喜欢。", py: "Wǒ de gōngzuò hěn máng, dànshì wǒ hěn xǐhuan.", en: "My job is busy, but I like it a lot." }
    ] },
  { id: "r10", title: "Shopping", titleZh: "购物", icon: "🛍️",
    sentences: [
      { zh: "这个多少钱？", py: "Zhège duōshao qián?", en: "How much is this?" },
      { zh: "太贵了，便宜点儿吧。", py: "Tài guì le, piányi diǎnr ba.", en: "Too expensive, give me a discount." },
      { zh: "我可以试穿一下吗？", py: "Wǒ kěyǐ shìchuān yíxià ma?", en: "Can I try it on?" },
      { zh: "有没有大一点的？", py: "Yǒu méiyǒu dà yìdiǎn de?", en: "Do you have a bigger size?" },
      { zh: "我要这件，可以刷卡吗？", py: "Wǒ yào zhè jiàn, kěyǐ shuākǎ ma?", en: "I'll take this one, can I pay by card?" }
    ] },
  { id: "r11", title: "Food & Restaurants", titleZh: "美食和餐厅", icon: "🍜",
    sentences: [
      { zh: "服务员，我们想点菜。", py: "Fúwùyuán, wǒmen xiǎng diǎn cài.", en: "Waiter, we'd like to order." },
      { zh: "这个菜辣不辣？", py: "Zhège cài là bu là?", en: "Is this dish spicy?" },
      { zh: "请给我们一壶茶。", py: "Qǐng gěi wǒmen yì hú chá.", en: "Please bring us a pot of tea." },
      { zh: "这道菜真好吃，你也尝尝。", py: "Zhè dào cài zhēn hǎochī, nǐ yě chángchang.", en: "This dish is really delicious, try some too." },
      { zh: "服务员，买单，谢谢。", py: "Fúwùyuán, mǎidān, xièxie.", en: "Waiter, the bill please, thanks." }
    ] },
  { id: "r12", title: "Directions & Transportation", titleZh: "方向和交通", icon: "🚕",
    sentences: [
      { zh: "请问，最近的地铁站在哪儿？", py: "Qǐngwèn, zuìjìn de dìtiězhàn zài nǎr?", en: "Excuse me, where's the nearest subway station?" },
      { zh: "一直往前走，然后往左拐。", py: "Yìzhí wǎng qián zǒu, ránhòu wǎng zuǒ guǎi.", en: "Go straight ahead, then turn left." },
      { zh: "从这儿到机场要多长时间？", py: "Cóng zhèr dào jīchǎng yào duō cháng shíjiān?", en: "How long does it take to get from here to the airport?" },
      { zh: "我们坐地铁去还是打车去？", py: "Wǒmen zuò dìtiě qù háishi dǎchē qù?", en: "Should we take the subway or a taxi?" },
      { zh: "师傅，麻烦到这个地址，谢谢。", py: "Shīfu, máfan dào zhège dìzhǐ, xièxie.", en: "Driver, please take me to this address, thanks." }
    ] },
  { id: "r13", title: "Weather & Seasons", titleZh: "天气和季节", icon: "☀️",
    sentences: [
      { zh: "今天天气怎么样？", py: "Jīntiān tiānqì zěnmeyàng?", en: "How's the weather today?" },
      { zh: "今天很晴朗，但是有点儿冷。", py: "Jīntiān hěn qínglǎng, dànshì yǒudiǎnr lěng.", en: "It's sunny today, but a bit cold." },
      { zh: "明天可能会下雨，记得带伞。", py: "Míngtiān kěnéng huì xiàyǔ, jìde dài sǎn.", en: "It might rain tomorrow, remember to bring an umbrella." },
      { zh: "我最喜欢秋天，不冷也不热。", py: "Wǒ zuì xǐhuan qiūtiān, bù lěng yě bú rè.", en: "I like autumn the most, neither cold nor hot." },
      { zh: "夏天这儿很热，冬天很冷。", py: "Xiàtiān zhèr hěn rè, dōngtiān hěn lěng.", en: "It's hot here in summer, cold in winter." }
    ] },
  { id: "r14", title: "Health & Feelings", titleZh: "健康和感受", icon: "🤒",
    sentences: [
      { zh: "你怎么了？看起来不太舒服。", py: "Nǐ zěnme le? Kànqǐlái bú tài shūfu.", en: "What's wrong? You don't look well." },
      { zh: "我有点儿头疼，可能感冒了。", py: "Wǒ yǒudiǎnr tóuténg, kěnéng gǎnmào le.", en: "I have a bit of a headache, maybe I caught a cold." },
      { zh: "你应该多喝水，好好休息。", py: "Nǐ yīnggāi duō hē shuǐ, hǎohāo xiūxi.", en: "You should drink more water and rest well." },
      { zh: "今天考试通过了，我很高兴。", py: "Jīntiān kǎoshì tōngguò le, wǒ hěn gāoxìng.", en: "I passed the exam today, I'm very happy." },
      { zh: "别担心，一切都会好起来的。", py: "Bié dānxīn, yíqiè dōu huì hǎo qǐlái de.", en: "Don't worry, everything will be fine." }
    ] },
  { id: "r15", title: "Travel", titleZh: "旅行", icon: "✈️",
    sentences: [
      { zh: "你去过中国吗？", py: "Nǐ qùguo Zhōngguó ma?", en: "Have you been to China?" },
      { zh: "我下个月要去北京旅游。", py: "Wǒ xià ge yuè yào qù Běijīng lǚyóu.", en: "I'm going to travel to Beijing next month." },
      { zh: "你打算在那儿待多久？", py: "Nǐ dǎsuàn zài nàr dāi duō jiǔ?", en: "How long do you plan to stay there?" },
      { zh: "我想去长城和故宫看看。", py: "Wǒ xiǎng qù Chángchéng hé Gùgōng kànkan.", en: "I want to visit the Great Wall and the Forbidden City." },
      { zh: "别忘了带护照和相机。", py: "Bié wàng le dài hùzhào hé xiàngjī.", en: "Don't forget to bring your passport and camera." }
    ] },
  { id: "r16", title: "Opinions & Small Talk", titleZh: "意见和闲聊", icon: "💬",
    sentences: [
      { zh: "我觉得这个主意不错。", py: "Wǒ juéde zhège zhǔyi búcuò.", en: "I think this idea is pretty good." },
      { zh: "你觉得呢？你同意吗？", py: "Nǐ juéde ne? Nǐ tóngyì ma?", en: "What do you think? Do you agree?" },
      { zh: "说实话，我不太确定。", py: "Shuō shíhuà, wǒ bú tài quèdìng.", en: "To be honest, I'm not too sure." },
      { zh: "这要看情况。", py: "Zhè yào kàn qíngkuàng.", en: "That depends on the situation." },
      { zh: "不管怎么样，我们试试看吧。", py: "Bùguǎn zěnmeyàng, wǒmen shìshi kàn ba.", en: "No matter what, let's give it a try." }
    ] }
];
