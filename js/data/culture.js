export const CULTURE = [
  // ===================== FOOD =====================
  {
    id: "cul_tapas",
    title: "Tapas Culture",
    category: "food",
    summary: "Small shared plates built for grazing and socializing, not solitary dining.",
    content: "Tapas began as small snacks — legend says a slice of bread or ham placed over a glass of sherry to keep out flies and dust, which is also the likely origin of the word (\"tapar\" means \"to cover\"). Whatever the true origin, tapas today are less about the food itself and more about the rhythm of the evening: you move from bar to bar with friends, ordering one or two small plates at each stop, standing at the bar or squeezed around a small table, talking loudly over the noise.\n\nIn cities like Granada and León a free tapa still comes automatically with every drink you order, but in most of Spain (Madrid, Barcelona) you order and pay for tapas separately, often as raciones (full-size) or medias raciones (half portions) meant for the whole table to share, not one dish per person. \"Tapear\" or \"ir de tapas\" — bar-hopping for tapas — is a social activity in its own right, often replacing what would be a sit-down dinner.\n\nA newcomer's biggest mistake is ordering an entire meal at one bar and never moving on — locals treat each bar as a single course in a longer crawl, each with a specialty (one bar for its tortilla, another for its croquetas). Tipping is not expected the way it is in the US; rounding up or leaving small change is plenty.",
    comparison: {
      spain: "Eating out is a communal, unhurried, multi-stop social event built around shared small plates and conversation, often replacing a formal sit-down dinner entirely.",
      uk: "Pub culture centers on drinks first, with food as an optional, individually ordered side (crisps, a pub meal) rather than an integrated shared course.",
      us: "Appetizers are a brief individual pre-course before each diner's own main dish arrives; sharing is common but not the default structure of the meal, and tipping 18-20% is expected."
    },
    quiz: [
      { q: "What does \"tapear\" mean?", options: ["Eating one huge meal at a single restaurant", "Bar-hopping and ordering small plates at each stop", "Ordering only desserts", "Cooking tapas at home"], answer: "Bar-hopping and ordering small plates at each stop" },
      { q: "In which cities do tapas still typically come free with a drink?", options: ["Madrid and Barcelona", "Granada and León", "Bilbao and Valencia", "Everywhere in Spain"], answer: "Granada and León" },
      { q: "What is a common mistake newcomers make with tapas?", options: ["Not sharing plates with the table", "Staying at one bar and ordering everything there instead of moving on", "Tipping too much", "Eating tapas for breakfast"], answer: "Staying at one bar and ordering everything there instead of moving on" },
      { q: "What is expected regarding tipping for tapas?", options: ["A mandatory 20%", "Rounding up or leaving small change is enough", "No tipping is ever acceptable", "A fixed 1 euro per plate"], answer: "Rounding up or leaving small change is enough" }
    ]
  },
  {
    id: "cul_sobremesa",
    title: "Sobremesa",
    category: "food",
    summary: "The unhurried conversation that lingers at the table long after the plates are cleared.",
    content: "Sobremesa is the time spent sitting and talking at the table after a meal has finished — no more food is coming, but nobody gets up. It can last twenty minutes after a quick lunch or stretch three hours after a big family Sunday meal, filled with coffee, a digestif, and conversation that ranges from gossip to politics to long stories.\n\nThe custom exists because a meal in Spain is treated as an occasion for connection, not just refueling; rushing off right after the last bite would seem strange, even rude, especially at a home meal or a lunch with colleagues. Restaurants reflect this too: waiters will almost never bring the bill unless you ask for it, because doing so unprompted would signal \"please leave,\" which is considered impolite.\n\nFor a newcomer, this means two practical things: don't panic if the check doesn't appear — you need to actively say \"la cuenta, por favor\" (or catch the waiter's eye and mime signing) — and don't feel awkward staying at the table once the food is gone. Business lunches often include real sobremesa too, where informal conversation continues to build trust even after the professional topics are done.",
    comparison: {
      spain: "Tables are held for as long as the group wants to talk; bills are never brought unprompted and lingering after eating is the social point of the meal.",
      uk: "Diners are generally expected to settle up and free the table within a reasonable time after finishing, especially if the restaurant is busy.",
      us: "Checks are often brought automatically soon after the meal ends, with a cultural expectation of turning tables over relatively quickly."
    },
    quiz: [
      { q: "What is sobremesa?", options: ["The appetizer course", "Time spent talking at the table after the meal is finished", "A type of Spanish dessert", "The bill at a restaurant"], answer: "Time spent talking at the table after the meal is finished" },
      { q: "Why don't Spanish waiters bring the bill automatically?", options: ["It's against the law", "It would signal you should leave, which is considered impolite", "They forget", "Bills are only given at the bar"], answer: "It would signal you should leave, which is considered impolite" },
      { q: "What should you say to get the check in Spain?", options: ["Nothing, just wait", "\"La cuenta, por favor\"", "\"Gracias, adiós\"", "Leave money on the table silently"], answer: "\"La cuenta, por favor\"" },
      { q: "Sobremesa is most associated with which type of meal?", options: ["Quick breakfast", "Fast food", "Family Sunday lunch", "Solo coffee break"], answer: "Family Sunday lunch" }
    ]
  },
  {
    id: "cul_menu_del_dia",
    title: "Menú del Día",
    category: "food",
    summary: "A fixed-price, multi-course weekday lunch offered by most restaurants at a bargain price.",
    content: "The menú del día is a set lunch menu — typically a starter, a main course, dessert or coffee, bread, and often a drink included — for one fixed price, usually between 10 and 15 euros depending on the city. It's offered by the vast majority of restaurants and bars, from humble neighborhood spots to fairly nice establishments, but almost always only on weekdays at lunchtime, not for dinner and rarely on weekends.\n\nThe tradition has a legal origin: in 1965, during the tourism boom under Franco, a law required restaurants to offer an affordable fixed-price meal so that workers and travelers alike could eat a full, proper lunch without breaking the bank. The law itself has since lapsed, but the custom stuck permanently into Spanish food culture, and it remains one of the best-value ways to eat well in Spain.\n\nOrdering is simple: ask for \"el menú del día\" and the waiter will bring a small list of starter and main options to choose from. It's aimed at office workers and locals having their big meal of the day, so don't expect it at fine-dining restaurants or after about 4pm — by dinner, restaurants switch to the regular à la carte menu.",
    comparison: {
      spain: "A genuine three-course sit-down meal with table service, offered nearly everywhere on weekdays for a fixed low price, treated as the normal way to have lunch out.",
      uk: "The closest equivalent, a \"meal deal\" from a supermarket or chain, is a grab-and-go sandwich-drink-snack combo with no table service or courses.",
      us: "Fixed-price \"prix fixe\" menus exist mainly at upscale restaurants for special occasions, not as an everyday affordable lunch option for workers."
    },
    quiz: [
      { q: "What does a typical menú del día include?", options: ["Only a main course", "Starter, main, dessert/coffee, bread, often a drink", "Just tapas", "An unlimited buffet"], answer: "Starter, main, dessert/coffee, bread, often a drink" },
      { q: "When is the menú del día typically available?", options: ["Weekday dinners only", "Weekday lunchtime only", "24 hours a day", "Weekends only"], answer: "Weekday lunchtime only" },
      { q: "What was the historical origin of the menú del día?", options: ["A royal decree for banquets", "A 1965 law ensuring affordable lunches during the tourism boom", "A restaurant marketing gimmick from the 1990s", "An EU regulation"], answer: "A 1965 law ensuring affordable lunches during the tourism boom" },
      { q: "How do you order the menú del día?", options: ["Ask for \"el menú del día\"", "Point at the dessert menu", "Order each course separately by name", "Ask for \"la carta\""], answer: "Ask for \"el menú del día\"" }
    ]
  },
  {
    id: "cul_breakfast",
    title: "Spanish Breakfast Culture",
    category: "food",
    summary: "A light breakfast, often eaten out at a bar rather than at home, with a second small bite mid-morning.",
    content: "Spanish breakfast (desayuno) is typically small: a coffee (café con leche or cortado) with a tostada — toasted bread with olive oil and crushed tomato, or butter and jam — eaten either quickly at home or, very commonly, standing at a bar on the way to work or school. On weekends, churros con chocolate (fried dough dipped in thick hot chocolate) is a beloved treat, especially after a night out.\n\nBreakfast is light because it isn't the day's main event — lunch is. Many workers also take a mid-morning break around 10:30-11am called the \"almuerzo\" or informally \"el bocata de media mañana,\" stepping out to a café for a coffee and a small sandwich (bocadillo) or pastry. This second breakfast is a genuine institution in Spanish office life, not a snack taken guiltily at a desk.\n\nFor newcomers, the practical tip is to embrace the bar-breakfast habit: cafés open early and serve breakfast standing at the counter quickly and cheaply, which is both faster and more social than eating alone at home. Don't expect a big cooked breakfast (eggs, bacon) — that's simply not part of the everyday routine here.",
    comparison: {
      spain: "Light and often eaten standing at a café counter (coffee plus toast), with a genuine second breakfast/coffee break built into the mid-morning work routine.",
      uk: "A cooked breakfast (eggs, bacon, beans) is a weekend treat, while weekday breakfast is usually cereal or toast eaten quickly at home before work.",
      us: "Breakfast can be substantial (eggs, pancakes, bacon) and is often eaten on the go or skipped entirely in favor of coffee, with no cultural equivalent to a formal mid-morning break."
    },
    quiz: [
      { q: "What is a typical Spanish breakfast?", options: ["A full cooked breakfast with eggs and bacon", "Coffee and toast (tostada), often at a bar", "Pancakes and syrup", "Cereal with orange juice"], answer: "Coffee and toast (tostada), often at a bar" },
      { q: "What is \"el almuerzo\" in the context of the workday?", options: ["The main lunch meal", "A mid-morning second breakfast/coffee break", "Dinner with colleagues", "A siesta"], answer: "A mid-morning second breakfast/coffee break" },
      { q: "What is a popular weekend breakfast treat?", options: ["Churros con chocolate", "Paella", "Gazpacho", "Tortilla de patatas only"], answer: "Churros con chocolate" },
      { q: "Why is Spanish breakfast typically light?", options: ["Food is scarce in the morning", "Lunch is the day's main meal", "Breakfast is culturally forbidden", "Bars don't open early"], answer: "Lunch is the day's main meal" }
    ]
  },
  {
    id: "cul_dinner_schedule",
    title: "Spanish Dinner & Eating Schedule",
    category: "food",
    summary: "Spaniards eat notably late by international standards — lunch around 2-3pm, dinner around 9-10:30pm.",
    content: "Spain's meal times run about two hours later than most of Europe: lunch (comida) is typically the biggest meal of the day, eaten around 2-3pm, and dinner (cena) — usually lighter — happens around 9 or even 10:30pm. Many restaurants in cities don't even open their kitchens for dinner service before 8:30pm, and arriving at 7pm expecting a full dinner service will often mean an empty restaurant or a closed kitchen.\n\nThere are a few overlapping reasons for this schedule. Spain geographically sits in the same time zone as the UK and Portugal but has clocks set to Central European Time (an inheritance from a wartime alignment with Germany), which effectively shifts the whole day later relative to the sun. Add to that a traditional afternoon work-and-siesta split (many small businesses historically closed 2-5pm and reopened until 8pm), and the whole daily rhythm of meals, work, and socializing shifted later to compensate.\n\nFor newcomers, the practical advice is to adjust expectations: don't schedule dinner reservations for 6pm, plan a substantial lunch since it's the main meal, and expect an afternoon lull in shop hours in smaller towns. Locals often have a small evening snack around 6-7pm to bridge the gap if dinner is very late.",
    comparison: {
      spain: "Lunch (2-3pm) is the main, substantial meal often lasting over an hour; dinner is lighter and eaten late, from 9pm onward.",
      uk: "Lunch is a quick midday break (12-1pm) and dinner, the main meal, is eaten relatively early, around 6-7pm.",
      us: "Lunch is brief and light (12-1pm) while dinner, the day's main meal, is typically eaten around 6-7pm, much earlier than in Spain."
    },
    quiz: [
      { q: "Around what time do Spaniards typically eat dinner?", options: ["5-6pm", "9-10:30pm", "Noon", "Midnight-1am"], answer: "9-10:30pm" },
      { q: "Which meal is traditionally the biggest of the day in Spain?", options: ["Breakfast", "Lunch", "Dinner", "The mid-morning snack"], answer: "Lunch" },
      { q: "Why are Spain's meal times shifted so late relative to the sun?", options: ["A strict religious rule", "Clocks are set to Central European Time despite Spain's geographic position", "Restaurants are required by law to open late", "It's purely a modern tourism trend"], answer: "Clocks are set to Central European Time despite Spain's geographic position" },
      { q: "What should a newcomer expect if they arrive at a restaurant at 7pm for dinner?", options: ["A packed restaurant at peak dinner rush", "The kitchen may not even be open yet", "A breakfast menu only", "Automatic seating with no wait"], answer: "The kitchen may not even be open yet" }
    ]
  },

  // ===================== SOCIAL LIFE =====================
  {
    id: "cul_friendship",
    title: "Friendships in Spain",
    category: "social",
    summary: "Close friend groups (cuadrillas/pandillas) often form in childhood or university and last a lifetime.",
    content: "Many Spaniards keep the same core group of friends — often called a \"cuadrilla\" or \"pandilla\" — from school or their home neighborhood well into adulthood, seeing each other weekly for decades. Because these groups run deep and are formed early, breaking into an established friend circle as an adult newcomer can take real time and patience; Spaniards are warm and welcoming in the moment, but turning a friendly acquaintance into a true \"amigo/a\" who's part of the group takes repeated shared time, not just a few nice conversations.\n\nSocializing tends to happen outdoors and in public rather than at home: bars, terraces, plazas, and long walks (dar una vuelta) are the default settings for hanging out, not living rooms. This is partly cultural and partly practical — Spanish homes, especially in cities, tend to be smaller, and the mild climate and abundance of affordable bars make public spaces the natural stage for social life.\n\nPhysical warmth is part of the friendship style too: greeting friends (and even friends-of-friends) with two kisses on the cheek is standard, personal space in conversation is closer than in the UK or US, and enthusiastic, animated conversation — talking over each other slightly — is a sign of engagement, not rudeness. Practical advice for newcomers: say yes to repeated invitations to the same group's plans, host or contribute occasionally, and expect the friendship to deepen gradually rather than instantly.",
    comparison: {
      spain: "Tight, long-lasting friend groups formed young; socializing happens mostly in public spaces (bars, plazas); physical greetings (two kisses) and close personal space are the norm.",
      uk: "Friend groups are often more fluid and can be maintained with less frequent contact; socializing leans toward pubs but home gatherings are also common; greetings are typically more reserved (handshake or brief hug).",
      us: "Friendships often form around work, activities, or moves between cities and can be more geographically dispersed; socializing frequently happens at each other's homes; personal space in greetings is generally larger."
    },
    quiz: [
      { q: "What is a \"cuadrilla\" or \"pandilla\"?", options: ["A type of tapa", "A close friend group formed early in life", "A government office", "A Spanish festival"], answer: "A close friend group formed early in life" },
      { q: "Where does Spanish socializing most commonly happen?", options: ["In private homes", "In public spaces like bars and plazas", "Exclusively at the workplace", "Over the phone"], answer: "In public spaces like bars and plazas" },
      { q: "What is the standard greeting between friends in Spain?", options: ["A firm handshake", "Two kisses on the cheek", "A bow", "A fist bump"], answer: "Two kisses on the cheek" },
      { q: "What should a newcomer expect when trying to join an established Spanish friend group?", options: ["Instant, immediate inclusion", "It typically takes repeated shared time to be fully welcomed in", "It's culturally impossible for outsiders", "An official invitation ceremony"], answer: "It typically takes repeated shared time to be fully welcomed in" }
    ]
  },
  {
    id: "cul_invitations",
    title: "Invitations & Hospitality Norms",
    category: "social",
    summary: "Going out together is more common than hosting, so a genuine invitation into someone's home is a real marker of closeness.",
    content: "Because so much Spanish social life happens in bars and public spaces, being invited to someone's home for a meal is a more significant gesture of trust and friendship than it might be in cultures where home entertaining is the default. When it happens — for a family Sunday lunch, a birthday, or a special dinner — it's worth taking seriously and reciprocating eventually.\n\nWhen invited, it's polite to bring something, though it doesn't need to be elaborate: a bottle of wine, a dessert, or flowers are all safe choices; ask the host if unsure (\"¿Llevo algo?\"). Once inside, you'll often hear \"estás en tu casa\" (\"you're in your own home\") — a genuine expression of hospitality meaning you should relax and not stand on ceremony.\n\nPunctuality for social invitations is looser than for business: arriving 10-20 minutes after the stated time is completely normal and even expected for a casual gathering, though for a sit-down dinner at a set time, don't push it much further than that. Overstaying isn't really a concept at a home gathering the way it might be elsewhere — thanks to the sobremesa custom, lingering for hours after the meal is the norm, not an imposition.",
    comparison: {
      spain: "Home invitations are less frequent but carry real weight as a sign of closeness; arriving slightly late to informal gatherings is normal and lingering afterward is expected.",
      uk: "Dinner party invitations are common social currency with an expectation of near-exact punctuality (\"fashionably late\" means at most 10-15 minutes) and a polite awareness of not overstaying.",
      us: "Hosting at home (dinner parties, cookouts) is a frequent and central social ritual, usually with a clearer expected end time and RSVP culture."
    },
    quiz: [
      { q: "Why does a home invitation carry extra significance in Spain?", options: ["Because Spanish homes are always huge", "Because most socializing happens outside the home, so a home invite signals real closeness", "Because it's illegal to meet in bars", "Because meals at home are cheaper"], answer: "Because most socializing happens outside the home, so a home invite signals real closeness" },
      { q: "What does \"estás en tu casa\" mean?", options: ["Please leave now", "You're in your own home — make yourself at home", "This is a formal event", "You must remove your shoes"], answer: "You're in your own home — make yourself at home" },
      { q: "What is a normal amount to be \"late\" to a casual Spanish gathering?", options: ["Exactly on time only", "10-20 minutes", "2+ hours", "Being early is expected"], answer: "10-20 minutes" },
      { q: "What is polite to ask a host before arriving?", options: ["\"¿A qué hora cierra?\"", "\"¿Llevo algo?\" (Should I bring something?)", "\"¿Cuánto cuesta?\"", "\"¿Puedo grabar la cena?\""], answer: "\"¿Llevo algo?\" (Should I bring something?)" }
    ]
  },
  {
    id: "cul_humor",
    title: "Spanish Humor & Directness",
    category: "social",
    summary: "Spaniards tend to be blunt, teasing, and comfortable with sharp banter as an expression of closeness, not hostility.",
    content: "Direct feedback and playful teasing (\"cachondeo\" or \"choteo\") are core parts of Spanish humor and everyday conversation. Friends nickname each other, poke fun at appearance or mistakes, and joke about topics — weight, baldness, being late, being cheap — that might feel off-limits in more indirect cultures. This isn't cruelty; among friends, being teased is often a sign you're genuinely part of the group, since strangers don't get the same treatment.\n\nThis directness extends beyond humor into everyday communication: Spaniards will often tell you plainly that they disagree, that they don't like something, or that a plan doesn't work for them, rather than softening it with hedging language. It's a culture that generally prizes sinceridad (sincerity) over excessive diplomatic cushioning.\n\nFor someone from a more indirect or reserved culture, the practical adjustment is twofold: don't take teasing personally — it usually signals affection — and don't over-read directness as anger or rudeness when a Spaniard says \"no me gusta\" or \"no estoy de acuerdo\" bluntly. At the same time, over-apologizing or excessive hedging (\"sorry to bother you, but maybe, if it's not too much trouble...\") can come across as oddly formal or even insincere.",
    comparison: {
      spain: "Direct disagreement and playful teasing are normal and generally read as sincerity or closeness rather than rudeness.",
      uk: "Communication leans indirect, with disagreement often softened through understatement, hedging, and self-deprecating humor to avoid confrontation.",
      us: "Communication is often direct on substance but wrapped in more overt positivity and politeness markers (\"great question!\", \"no worries!\") than in Spain."
    },
    quiz: [
      { q: "What is \"cachondeo\"?", options: ["A formal business meeting", "Playful teasing/banter among friends", "A type of dance", "A government form"], answer: "Playful teasing/banter among friends" },
      { q: "Being teased by Spanish friends usually signals what?", options: ["Genuine hostility", "You're likely a real part of the group", "A misunderstanding", "That you should leave"], answer: "You're likely a real part of the group" },
      { q: "How do Spaniards typically express disagreement?", options: ["Never directly, always avoided", "Directly and plainly, without heavy hedging", "Only in writing", "Through a third party"], answer: "Directly and plainly, without heavy hedging" },
      { q: "What might come across as oddly formal to a Spaniard?", options: ["Direct feedback", "Teasing a close friend", "Excessive apologizing and hedging", "Making eye contact"], answer: "Excessive apologizing and hedging" }
    ]
  },
  {
    id: "cul_politeness",
    title: "Politeness & Social Norms",
    category: "social",
    summary: "Politeness in Spain shows up through greetings, closeness, and engagement rather than frequent \"please\" and \"thank you.\"",
    content: "Spanish social etiquette places less emphasis on repeating verbal politeness markers like \"please\" (por favor) and \"thank you\" (gracias) in every single exchange compared to English — ordering \"Ponme un café\" (\"Give me a coffee\") at a bar without an explicit \"please\" is completely normal and not rude, whereas it might sound curt translated literally into English. Politeness instead shows up strongly in greetings: it's expected to say \"buenos días\" or \"hola\" when entering a small shop, lift, or waiting room, even to strangers, and skipping this can genuinely read as rude.\n\nPersonal space is smaller than in the UK or US: standing close while talking, touching an arm to make a point, and speaking with more volume and animation are all normal registers of engaged, friendly conversation rather than aggression. Interrupting during an enthusiastic conversation is common and generally read as active interest and participation, not as cutting someone off rudely.\n\nFormality is marked mainly through the tú/usted distinction rather than extra phrasing: using \"usted\" with strangers, elders, doctors, or in formal business settings shows respect, while \"tú\" is used with friends, peers, and increasingly by default among younger people. Practical advice: greet shopkeepers and neighbors, don't be alarmed by louder or more physically close conversation, and default to \"usted\" with anyone clearly senior to you or in an official role until invited to use \"tú.\"",
    comparison: {
      spain: "Fewer verbal politeness markers per sentence, but strong expectations around greeting people directly and closer physical/conversational proximity.",
      uk: "Frequent use of \"please,\" \"thank you,\" and softening phrases is a core politeness marker, alongside more physical distance and restraint in conversation.",
      us: "Politeness is expressed through friendly verbal markers and enthusiasm (\"thanks so much!\", \"have a great day\") with moderate personal space, generally larger than Spain's."
    },
    quiz: [
      { q: "Is it rude to order without saying \"please\" in a Spanish bar?", options: ["Yes, always", "No, it's completely normal", "Only at fancy restaurants", "Only in Madrid"], answer: "No, it's completely normal" },
      { q: "What is expected when entering a small shop or lift in Spain?", options: ["Complete silence", "A greeting like \"buenos días\" or \"hola\"", "A formal bow", "Removing your hat"], answer: "A greeting like \"buenos días\" or \"hola\"" },
      { q: "What does interrupting during a lively conversation typically signal in Spain?", options: ["Rudeness and disrespect", "Active interest and engagement", "A desire to end the conversation", "A cultural taboo"], answer: "Active interest and engagement" },
      { q: "When is \"usted\" typically used instead of \"tú\"?", options: ["With close friends only", "With strangers, elders, or in formal settings", "Only when angry", "Never in modern Spain"], answer: "With strangers, elders, or in formal settings" }
    ]
  },

  // ===================== WORK =====================
  {
    id: "cul_meetings",
    title: "Meetings in Spain",
    category: "work",
    summary: "Meetings often open with genuine small talk before business, and starting a few minutes late is tolerated more than in Anglo offices.",
    content: "Spanish business meetings usually begin with a period of relationship-building conversation — asking about the weekend, family, or general chat — before moving to the agenda. This isn't wasted time; it's viewed as an important part of building the trust (confianza) that makes the actual business discussion go smoother. Cutting straight to the agenda without any warm-up can come across as cold or overly transactional.\n\nPunctuality expectations are somewhat more relaxed for internal or informal meetings than in the UK, US, or Germany — starting 5-10 minutes after the scheduled time is common and rarely commented on — though client-facing and formal meetings still expect reasonable promptness. Meetings can also run long, since interruptions, tangents, and passionate debate about details are normal rather than a sign of poor discipline.\n\nHierarchy plays a visible role: the most senior person in the room is typically given deference, may speak last to summarize or decide, and decisions are sometimes not fully finalized in the room itself but confirmed afterward through informal conversations. For a foreigner running or attending meetings in Spain, the practical advice is to budget more time than the agenda suggests, invest genuinely in the small talk, and not mistake spirited disagreement for the meeting going badly.",
    comparison: {
      spain: "Meetings open with real small talk, tolerate a later start for internal meetings, and defer visibly to the most senior person present.",
      uk: "Meetings tend to start close to on time with brief, polite small talk, follow a clear agenda, and value staying on schedule.",
      us: "Meetings are typically efficiency-focused, start on time, keep small talk brief, and aim to reach concrete action items within the scheduled slot."
    },
    quiz: [
      { q: "Why do Spanish meetings often start with small talk?", options: ["To waste time deliberately", "It builds the trust (confianza) that helps the business discussion", "It's a legal requirement", "Because agendas are illegal"], answer: "It builds the trust (confianza) that helps the business discussion" },
      { q: "How is starting a meeting a few minutes late typically viewed for internal meetings?", options: ["A serious offense", "Commonly tolerated and rarely commented on", "Grounds for firing", "Physically impossible"], answer: "Commonly tolerated and rarely commented on" },
      { q: "Who is typically given deference in a Spanish workplace meeting?", options: ["The newest employee", "The most senior person in the room", "Whoever arrives first", "No one, it's fully flat"], answer: "The most senior person in the room" },
      { q: "What should a foreigner NOT mistake spirited disagreement for in a Spanish meeting?", options: ["Enthusiasm", "The meeting going badly", "A joke", "A translation error"], answer: "The meeting going badly" }
    ]
  },
  {
    id: "cul_hierarchy",
    title: "Workplace Hierarchy",
    category: "work",
    summary: "Spanish workplaces are traditionally more vertical and title-conscious than the flatter structures common in the UK or US.",
    content: "Many Spanish organizations, especially larger and more traditional companies (banks, public administration, established industrial firms), operate with a clearer top-down chain of command than the relatively flat structures common in Anglo tech or startup culture. Job titles and formal position matter, decisions often need explicit sign-off from a manager or \"jefe/a\" rather than being made autonomously at a lower level, and challenging a superior's decision openly in a group setting is less common than doing so privately.\n\nAddress reflects this hierarchy in more traditional or formal companies: some employees still use \"usted\" with senior managers, though this is fading fast, especially in startups, multinationals, and younger industries, where \"tú\" and first names are standard even with the CEO. It's worth reading the room in a new workplace rather than assuming either extreme.\n\nFor someone coming from a flatter corporate culture, the practical advice is to identify who the actual decision-maker is early on, route significant proposals through your direct manager rather than skipping levels, and raise disagreements with a superior privately rather than contradicting them in front of the team. Younger and more international companies in Spain increasingly resemble flatter Anglo structures, so this varies significantly by sector and company age.",
    comparison: {
      spain: "Many traditional companies retain a clear top-down chain of command with visible deference to seniority and formal sign-off processes, though this is loosening in newer industries.",
      uk: "Workplace structures tend to be moderately flat with an emphasis on consultation, though seniority is still respected in more traditional sectors like law and finance.",
      us: "Especially in tech and startups, structures are often explicitly flat with direct access to senior leadership and a stronger cultural expectation of speaking up regardless of rank."
    },
    quiz: [
      { q: "Which type of Spanish company is more likely to have a strict top-down hierarchy?", options: ["A young tech startup", "A large traditional bank or public administration office", "A freelance collective", "All Spanish companies equally"], answer: "A large traditional bank or public administration office" },
      { q: "What is the recommended way to raise a disagreement with a superior in a more traditional Spanish workplace?", options: ["Publicly in a team meeting", "Privately, rather than contradicting them in front of the team", "Only via email to HR", "Never raise disagreements"], answer: "Privately, rather than contradicting them in front of the team" },
      { q: "What trend is changing the use of \"usted\" with managers?", options: ["It's becoming more common everywhere", "It's fading, especially in startups and multinationals", "It was never used in Spain", "It's now required by law"], answer: "It's fading, especially in startups and multinationals" },
      { q: "What should a newcomer do when routing a significant proposal?", options: ["Skip their manager and go straight to the CEO", "Go through their direct manager rather than skipping levels", "Post it publicly on social media", "Wait for someone else to raise it"], answer: "Go through their direct manager rather than skipping levels" }
    ]
  },
  {
    id: "cul_networking",
    title: "Professional Networking",
    category: "work",
    summary: "Spanish professional networks run on personal trust (confianza) built over food and coffee, not cold outreach.",
    content: "Professional relationships in Spain are built and maintained largely through personal connection — a coffee, a lunch, an introduction from a mutual contact — rather than cold emails or unsolicited LinkedIn messages, which tend to get a much cooler reception than in the US. A warm introduction from someone both parties trust (a \"contacto\") carries enormous weight and can open doors that direct outreach simply won't.\n\nBuilding this kind of confianza takes time and repeated informal contact: grabbing a coffee or lunch specifically to get to know someone, without an immediate ask, is a completely normal and expected first step before any business proposal. Rushing straight to \"the ask\" in a first meeting can feel transactional and off-putting.\n\nFor a newcomer building a professional network in Spain, practical advice includes: prioritize getting warm introductions over cold outreach, invest time in relationship-building meetings before pushing an agenda, attend industry events and associations (colegios profesionales exist for many regulated professions), and be patient — a network here tends to develop over months of consistent contact rather than a single well-crafted message.",
    comparison: {
      spain: "Built on personal trust developed face-to-face over time; warm introductions matter far more than cold outreach, and business follows relationship, not the reverse.",
      uk: "A mix of formal networking events, alumni networks, and LinkedIn outreach is common, with a moderate degree of directness accepted in initial contact.",
      us: "Cold outreach via LinkedIn or email is widely normalized and often expected, with networking events and direct \"pitch\" conversations common even on first meeting."
    },
    quiz: [
      { q: "What typically carries the most weight in Spanish professional networking?", options: ["A cold email", "A warm introduction from a trusted mutual contact", "A LinkedIn connection request", "A cold phone call"], answer: "A warm introduction from a trusted mutual contact" },
      { q: "What is a normal first step before making a business proposal in Spain?", options: ["Sending an invoice", "A coffee or lunch meeting focused on getting to know each other", "A signed contract", "A public announcement"], answer: "A coffee or lunch meeting focused on getting to know each other" },
      { q: "How might jumping straight to \"the ask\" in a first meeting come across in Spain?", options: ["Efficient and appreciated", "Transactional and off-putting", "Completely standard practice", "Illegal"], answer: "Transactional and off-putting" },
      { q: "What does \"confianza\" mean in this context?", options: ["A legal contract", "Trust built through personal relationship", "A type of business card", "A government registration"], answer: "Trust built through personal relationship" }
    ]
  },
  {
    id: "cul_workplace_comm",
    title: "Workplace Communication Style",
    category: "work",
    summary: "Written communication tends to be formal, while spoken communication is often animated, direct, and relationally warm.",
    content: "Written workplace communication in Spain, especially email, often stays fairly formal even among colleagues who know each other well: full greetings (\"Buenos días\" / \"Estimado/a\"), formal sign-offs (\"Un cordial saludo\"), and a generally more structured tone than the brief, casual style common in US or UK workplace emails, at least until real familiarity is established.\n\nSpoken communication, by contrast, tends to be warmer, more animated, and more direct than written correspondence: raised voices, talking over each other, and blunt pushback on an idea are normal parts of an engaged discussion rather than signs of conflict. Complaints and disagreement are often voiced more openly and immediately than in cultures that favor indirect or written feedback channels.\n\nFor someone adjusting to a Spanish workplace, the practical advice is to keep initial written communication reasonably formal and err toward Spain's structured email conventions, don't over-interpret direct verbal pushback as personal or hostile, and recognize that a loud, passionate meeting discussion is often just normal collaborative problem-solving, not a breakdown of professionalism.",
    comparison: {
      spain: "Formal, structured emails contrast with warm, direct, and animated spoken communication where disagreement is voiced openly.",
      uk: "Both written and spoken communication tend toward understatement and diplomatic phrasing, with direct criticism often softened considerably.",
      us: "Emails are typically brief and casual quite quickly, while spoken feedback is direct on content but usually wrapped in more overt positive framing."
    },
    quiz: [
      { q: "How does formal Spanish workplace email compare to spoken conversation?", options: ["Email is more casual than speech", "Email tends to stay more formal while speech is more direct and animated", "Both are equally informal", "Both are equally formal"], answer: "Email tends to stay more formal while speech is more direct and animated" },
      { q: "What is a normal part of an engaged Spanish workplace discussion?", options: ["Complete silence", "Raised voices and talking over each other", "Written memos only", "Avoiding all disagreement"], answer: "Raised voices and talking over each other" },
      { q: "What is good advice for a newcomer's initial written communication style in Spain?", options: ["Keep it very casual immediately", "Err toward Spain's more formal, structured email conventions", "Use no greeting at all", "Write only in English slang"], answer: "Err toward Spain's more formal, structured email conventions" },
      { q: "How should direct verbal pushback in a meeting generally be interpreted?", options: ["As a personal attack", "As normal collaborative problem-solving, not hostility", "As a resignation threat", "As a joke that shouldn't be taken seriously"], answer: "As normal collaborative problem-solving, not hostility" }
    ]
  },

  // ===================== UNIVERSITY =====================
  {
    id: "cul_student_life",
    title: "Student Life in Spain",
    category: "university",
    summary: "Most Spanish students live at home or in a shared piso rather than in campus dorms, and higher education costs far less than in the US.",
    content: "Unlike the US or UK, where moving into a campus dormitory is the default university experience, most Spanish university students either continue living with their parents (especially if the university is in their home city) or move into a shared apartment (piso compartido) with other students. Dedicated dorm-style residences (\"colegios mayores\" or \"residencias universitarias\") exist but are far less common and less central to student social life than American dorms.\n\nPublic university tuition in Spain is heavily subsidized and costs a small fraction of equivalent US tuition — typically somewhere in the range of 1,000-2,500 euros a year for a full degree at a public university, though private universities cost considerably more. This changes the whole financial picture of student life: fewer students take on major debt, and many combine studies with part-time work or internships.\n\nThe Erasmus exchange program is a major part of Spanish student culture, sending huge numbers of students abroad within Europe and bringing large numbers of international students into Spanish cities, creating a genuinely international social scene around university life, especially in cities like Salamanca, Granada, and Barcelona. Practical advice for an international student: expect to find your own housing (the university may help but rarely assigns it), and expect much of your social life to happen off-campus in the city itself rather than in a self-contained \"college town\" bubble.",
    comparison: {
      spain: "Students typically live at home or in a shared flat rather than a dorm; tuition is low, and social life centers on the city, not an enclosed campus.",
      uk: "University students commonly move into halls of residence in the first year, tuition is significantly higher (with loans the norm), and campus life is often central to the university experience.",
      us: "On-campus dormitory living is the standard first-year experience, tuition and debt loads are typically much higher, and campus life (sports, Greek life, dining halls) is often the center of student social identity."
    },
    quiz: [
      { q: "Where do most Spanish university students typically live?", options: ["Exclusively in campus dorms", "At home with parents or in a shared piso", "Hotels", "University-owned single rooms for all students"], answer: "At home with parents or in a shared piso" },
      { q: "How does Spanish public university tuition compare to the US?", options: ["Much more expensive", "Roughly the same", "A small fraction of the cost", "Free with no exceptions"], answer: "A small fraction of the cost" },
      { q: "What is Erasmus?", options: ["A Spanish exam board", "A European student exchange program", "A type of scholarship only for Spaniards", "A private university chain"], answer: "A European student exchange program" },
      { q: "Where does student social life in Spain mostly happen?", options: ["Enclosed within campus", "Out in the city itself", "Exclusively online", "In dedicated Greek-life houses"], answer: "Out in the city itself" }
    ]
  },
  {
    id: "cul_classroom",
    title: "Classroom Culture",
    category: "university",
    summary: "Traditionally lecture-heavy and exam-weighted, with more formality between students and professors than in many Anglo classrooms.",
    content: "Spanish higher education has traditionally leaned heavily on lectures (clases magistrales) and a small number of high-stakes final exams (\"convocatorias\") rather than continuous assessment through many small assignments — meaning a large portion, sometimes the entirety, of a course grade can rest on one exam at the end of the term. Since Spain adopted the Bologna Process and European Credit Transfer System (ECTS) reforms, continuous assessment has grown significantly, but the exam-centric legacy still shapes study habits and expectations, especially at older, more traditional universities.\n\nStudent-professor relationships tend to be more formal than at many US or UK universities: professors are addressed with \"usted\" and their title, office hours (tutorías) are the appropriate channel for individual questions, and interrupting a lecture with questions is less common than saving them for the end or for tutorías. This isn't coldness — many professors are warm and accessible — but the classroom register itself is more formal than the very participatory, hand-raising discussion style common in US seminars.\n\nPractical advice for a foreign student: don't assume a lack of in-class questions means disengagement — it's often just classroom norms — and budget serious, sustained study time before final exam periods (\"época de exámenes\"), since a single exam can carry enormous weight on your final grade rather than being cushioned by weekly homework.",
    comparison: {
      spain: "Traditionally lecture-heavy with major weight on final exams and more formal student-professor address, though continuous assessment has grown under EU reforms.",
      uk: "A mix of lectures and smaller seminars with more discussion, assessed through a combination of coursework, essays, and exams; student-professor address is often first-name and less formal.",
      us: "Heavy use of continuous assessment (weekly homework, midterms, class participation grades) alongside finals, with a strongly participatory, discussion-based classroom culture."
    },
    quiz: [
      { q: "What has traditionally carried a lot of weight in Spanish university grading?", options: ["Class participation only", "A small number of high-stakes final exams", "Attendance alone", "Group projects exclusively"], answer: "A small number of high-stakes final exams" },
      { q: "How are Spanish professors traditionally addressed by students?", options: ["First name only, informally", "With \"usted\" and their title", "By nickname", "Not addressed directly at all"], answer: "With \"usted\" and their title" },
      { q: "What reform increased continuous assessment in Spanish universities?", options: ["The Bologna Process / ECTS reforms", "A royal decree from the 1800s", "A private university merger", "US accreditation standards"], answer: "The Bologna Process / ECTS reforms" },
      { q: "What is the appropriate channel for individual questions to a professor?", options: ["Interrupting the lecture at any time", "Office hours (tutorías)", "Social media", "Only through the university president"], answer: "Office hours (tutorías)" }
    ]
  },

  // ===================== HOUSING =====================
  {
    id: "cul_renting_piso",
    title: "Renting a Piso",
    category: "housing",
    summary: "Renting an apartment (piso) in Spain's big cities involves a competitive market, upfront deposits, and specific paperwork.",
    content: "In Spain, apartments are almost universally called \"pisos,\" and renting one — especially in Madrid, Barcelona, or other high-demand cities — typically requires an upfront deposit (fianza) equal to one month's rent by law, though landlords commonly ask for one to two additional months as extra guarantee, plus sometimes an agency fee. Rental contracts are governed by the Ley de Arrendamientos Urbanos (LAU), and standard long-term contracts typically run for a minimum term with renewal rights, while short-term \"temporada\" contracts (common for students or those without a stable local income) offer landlords more flexibility but fewer protections for tenants.\n\nLandlords, especially for long-term contracts, usually want proof of stable income — a payslip (nómina), an employment contract, or a guarantor (avalista) — which can be a real obstacle for newcomers without a Spanish job history; some landlords will accept a larger deposit or several months paid upfront instead. Utilities (luz, agua, gas, internet) are typically separate from rent and need to be set up or transferred into the tenant's name.\n\nPractical advice: use reputable listing sites (Idealista, Fotocasa), be wary of deals that seem too good to be true or ask for money before an in-person viewing (a common scam target for foreigners), read the contract carefully or have someone fluent review it, and confirm what's included (furnished vs unfurnished, appliances, community fees) before signing.",
    comparison: {
      spain: "Deposits are legally capped at one month but often supplemented informally; proof of stable local income or a guarantor is commonly required, and demand in big cities is intense.",
      uk: "Deposits are typically capped at five weeks' rent by law and protected in a government-approved deposit scheme; referencing and credit checks are standard.",
      us: "Deposit norms vary by state (often one to two months), credit score checks are central to approval, and lease terms and tenant protections vary significantly by city and state."
    },
    quiz: [
      { q: "What is a piso in Spain?", options: ["A type of Spanish dance", "An apartment", "A government office", "A rural farmhouse"], answer: "An apartment" },
      { q: "What law governs standard Spanish rental contracts?", options: ["The Ley de Arrendamientos Urbanos (LAU)", "The Bologna Process", "The Ley de Extranjería", "EU General Data Protection Regulation"], answer: "The Ley de Arrendamientos Urbanos (LAU)" },
      { q: "What do landlords commonly require to prove a tenant's financial stability?", options: ["A university diploma", "A payslip (nómina), contract, or guarantor (avalista)", "A passport photo only", "Nothing at all"], answer: "A payslip (nómina), contract, or guarantor (avalista)" },
      { q: "What is a red flag when apartment hunting in Spain?", options: ["Being asked to view the apartment in person", "Being asked to send money before any in-person viewing", "A landlord requesting a nómina", "Signing a written contract"], answer: "Being asked to send money before any in-person viewing" }
    ]
  },
  {
    id: "cul_roommates",
    title: "Roommates & Pisos Compartidos",
    category: "housing",
    summary: "Shared flats are common even among working adults, not just students, due to high rents in major cities.",
    content: "Pisos compartidos — shared flats where each tenant rents a room and shares common spaces — are extremely common in Spain's big cities, and not just among students: young professionals well into their 30s often share flats simply because rent, especially in Madrid and Barcelona, has risen much faster than wages. This makes shared housing a mainstream, unremarkable living arrangement rather than a stage people are expected to have outgrown by a certain age.\n\nHouse rules in a piso compartido are usually worked out informally among flatmates rather than imposed top-down: a rough cleaning rota, agreements about guests, and how to split shared bills (luz, agua, internet, community fees) are typically negotiated in a WhatsApp group chat rather than a written house contract. Flatmates found through platforms like Idealista, Fotocasa, or Badi often become genuine friends, since the shared living situation naturally overlaps with a chunk of one's social life.\n\nPractical etiquette advice: communicate clearly and early about habits (noise, guests, cleaning), split bills promptly and transparently, and be aware that in many shared-flat arrangements a departing flatmate is expected to help find their own replacement, since landlords increasingly prefer to deal with one lead tenant.",
    comparison: {
      spain: "Common at all career stages, not just for students, due to a widening gap between rents and wages in big cities; arrangements tend to be informal and negotiated among flatmates.",
      uk: "House-shares (\"flatshares\") are common among young professionals in expensive cities like London, often via formal tenancy agreements with each named on the lease.",
      us: "Roommates are typical for students and young professionals in expensive cities but often seen as a temporary phase to outgrow once income rises, more so than in Spain."
    },
    quiz: [
      { q: "Why are pisos compartidos common even among working professionals in Spain?", options: ["Spanish law requires shared housing", "Rent has risen much faster than wages in big cities", "Solo apartments don't exist", "It's only for students"], answer: "Rent has risen much faster than wages in big cities" },
      { q: "How are house rules typically decided in a piso compartido?", options: ["A landlord dictates them in writing", "Informally negotiated among flatmates, often via WhatsApp", "By a government inspector", "They don't exist at all"], answer: "Informally negotiated among flatmates, often via WhatsApp" },
      { q: "What is often expected of a departing flatmate?", options: ["Nothing, the landlord handles everything", "Helping find their own replacement", "Paying a year's rent in advance", "Forfeiting their deposit automatically"], answer: "Helping find their own replacement" },
      { q: "Which platforms are commonly used to find flatmates in Spain?", options: ["Idealista, Fotocasa, Badi", "Only newspaper classifieds", "Government housing offices exclusively", "None, it's all word of mouth"], answer: "Idealista, Fotocasa, Badi" }
    ]
  },

  // ===================== TRAVEL =====================
  {
    id: "cul_renfe",
    title: "Renfe Trains",
    category: "travel",
    summary: "Renfe is Spain's national rail operator, with high-speed AVE trains connecting major cities in just a few hours.",
    content: "Renfe runs Spain's rail network, spanning everything from local Cercanías commuter trains around big cities, to Media Distancia regional trains, to the AVE high-speed intercity trains that connect cities like Madrid and Barcelona in around 2.5 hours or Madrid and Seville in under 2.5 hours. Unlike a UK-style walk-up-and-board system, longer-distance trains (Media Distancia and AVE) require booking a specific train and an assigned seat in advance, and AVE stations require passengers to pass bags through an airport-style security scanner before boarding.\n\nRenfe is famous for a punctuality guarantee on its AVE service: if the train arrives more than a set number of minutes late, passengers are entitled to a partial or full refund, a policy that has historically kept AVE reliability very high. Discount cards exist for frequent travelers and specific groups — the Tarjeta Dorada for seniors and Renfe's youth discounts for those under a certain age — and advance-purchase fares can be dramatically cheaper than last-minute tickets.\n\nPractical advice: book through the official Renfe app or website in advance for the best prices, arrive with enough buffer time to clear AVE security, and double-check whether your journey requires Cercanías (cheap, walk-up, no reservation) versus a long-distance train (reserved seat, must book ahead) since they work quite differently.",
    comparison: {
      spain: "Long-distance trains require an advance-booked, assigned seat and airport-style security for AVE; punctuality is strong, reinforced by a refund guarantee.",
      uk: "Many long-distance trains allow walk-up travel without a mandatory reservation, though advance tickets are much cheaper; no security screening is required to board.",
      us: "Long-distance passenger rail (Amtrak) is far less extensive and generally slower than Spain's AVE network, and intercity travel relies much more heavily on cars and domestic flights."
    },
    quiz: [
      { q: "What is the AVE?", options: ["A type of Spanish bus", "Spain's high-speed train service", "A metro line in Madrid", "A taxi app"], answer: "Spain's high-speed train service" },
      { q: "What must passengers do before boarding an AVE train?", options: ["Nothing special", "Pass through airport-style security screening", "Show a vaccination card", "Complete a written exam"], answer: "Pass through airport-style security screening" },
      { q: "What happens if an AVE train is significantly delayed?", options: ["Nothing, delays are not tracked", "Passengers may be entitled to a partial or full refund", "The train is cancelled entirely", "Passengers get a free upgrade to first class only"], answer: "Passengers may be entitled to a partial or full refund" },
      { q: "How do Cercanías trains differ from long-distance Renfe trains?", options: ["They also require an assigned seat booked in advance", "They are cheap, walk-up commuter trains with no reservation needed", "They only run overnight", "They are more expensive than AVE"], answer: "They are cheap, walk-up commuter trains with no reservation needed" }
    ]
  },
  {
    id: "cul_metro",
    title: "Metro Systems",
    category: "travel",
    summary: "Madrid and Barcelona have extensive, cheap metro networks that are usually the fastest way to get around the city.",
    content: "Madrid and Barcelona both operate large, efficient metro systems that are typically the fastest and cheapest way to cross the city, especially compared to taxis during rush hour. Tickets can be single rides, but locals and regular visitors usually buy a multi-trip pass — historically the \"billete de diez viajes\" (a 10-trip ticket, referred to informally like the old T-10 in Barcelona) — or a monthly travel pass (Abono Transportes), both of which are considerably cheaper per trip than single tickets and often work across metro, bus, and Cercanías trains within the relevant zone.\n\nMost Spanish metro systems only require validating your ticket on entry, with no need to tap out when you leave, unlike some other cities' systems. Fare zones matter for longer trips or trips out to the suburbs, so check zone coverage on multi-trip cards if traveling beyond the city center.\n\nEtiquette-wise, standard city-transit norms apply: let passengers off before boarding, stand on the right on escalators to let people pass on the left, and keep bags close during busy periods. A rechargeable travel card (Multi in Barcelona, Tarjeta Transporte Público in Madrid) can be picked up cheaply at any station and is worth getting on day one for anyone staying more than a couple of days.",
    comparison: {
      spain: "Fast, affordable multi-trip and monthly passes cover metro, bus, and commuter rail together in one zone-based system; no tap-out required on exit.",
      uk: "London's Underground uses tap-in/tap-out contactless or Oyster fares with daily/weekly caps, and pay-as-you-go is heavily encouraged over paper tickets.",
      us: "Outside a handful of cities (New York, Washington DC, Chicago), metro/subway systems are far less extensive, and many US cities have no rail transit at all, making cars the default."
    },
    quiz: [
      { q: "What is generally the fastest way to cross Madrid or Barcelona?", options: ["Walking", "The metro", "A private car during rush hour", "A ferry"], answer: "The metro" },
      { q: "Do most Spanish metro systems require tapping out when you exit?", options: ["Yes, always", "No, typically only entry validation is required", "Only on weekends", "Only for tourists"], answer: "No, typically only entry validation is required" },
      { q: "What does a multi-trip or monthly pass typically allow?", options: ["Metro travel only, nothing else", "Travel across metro, bus, and Cercanías within a zone, often cheaper per trip", "Unlimited free taxis", "International train travel"], answer: "Travel across metro, bus, and Cercanías within a zone, often cheaper per trip" },
      { q: "What is standard escalator etiquette in Spanish metro systems?", options: ["Stand on the left, walk on the right", "Stand on the right, let people pass on the left", "Sit down on the steps", "No etiquette rules exist"], answer: "Stand on the right, let people pass on the left" }
    ]
  },
  {
    id: "cul_buses",
    title: "Buses",
    category: "travel",
    summary: "Urban and intercity buses fill in the gaps trains don't reach, forming an extensive and affordable network.",
    content: "Within cities, local bus networks (like Madrid's EMT) complement the metro, often running later at night and reaching neighborhoods the metro doesn't cover; tickets validate at a machine near the driver, and in many cities you board at the front and exit through a rear door. Night buses (búhos in Madrid) are especially useful since some metro lines close overnight.\n\nFor travel between cities and towns, Spain has an extensive coach network operated by companies like ALSA, which is often cheaper than the train, if slower, and reaches many smaller towns that have no train service at all — in large parts of rural Spain, the bus is genuinely the only public transport option. Luggage typically goes in a compartment underneath the coach, and long-distance buses usually have assigned seats booked in advance, similar to trains.\n\nPractical advice: for intercity trips, compare bus and train prices/times on booking apps since the bus is often significantly cheaper for a modest time cost, and for city buses, keep an eye on the electronic display or app for real-time arrivals since schedules can be less exact during peak traffic than the metro.",
    comparison: {
      spain: "A dense, affordable intercity coach network (ALSA and others) reaches many towns with no train service, alongside extensive urban bus networks with night service.",
      uk: "National Express and Megabus provide coach alternatives to trains, generally the cheapest but slowest travel option; local bus networks vary widely in quality by region.",
      us: "Intercity buses (Greyhound and similar) exist but are less extensive and often carry more stigma than in Spain, with driving being the default for most intercity and even many local trips."
    },
    quiz: [
      { q: "What does ALSA operate in Spain?", options: ["The national rail service", "A major intercity coach/bus network", "The Madrid metro", "Domestic flights"], answer: "A major intercity coach/bus network" },
      { q: "Why are buses especially important in rural Spain?", options: ["They are the fastest option", "They often reach towns with no train service at all", "They are always free", "They replace all metro lines"], answer: "They often reach towns with no train service at all" },
      { q: "What are Madrid's night buses called?", options: ["AVE nocturno", "Búhos", "Cercanías Express", "Renfe Night"], answer: "Búhos" },
      { q: "How does taking the bus between Spanish cities typically compare to the train?", options: ["Always more expensive and faster", "Often cheaper but slower", "Identical in price and speed", "Buses don't run between cities"], answer: "Often cheaper but slower" }
    ]
  },
  {
    id: "cul_taxis",
    title: "Taxis & Ride-Hailing",
    category: "travel",
    summary: "Regulated taxis coexist with ride-hailing apps like Cabify, and tipping is optional, not expected.",
    content: "Spanish taxis are heavily regulated, licensed, and easily recognizable (often white with a diagonal colored stripe), with metered or fixed fares — many cities set a fixed flat rate for airport-to-city-center trips, which is worth knowing in advance to avoid confusion. Taxis can be hailed on the street, found at designated ranks, or booked by app or phone, and are generally considered safe and reliable.\n\nRide-hailing apps like Cabify are widely used and, in cities where it operates, Uber as well, though the taxi sector has fought hard against them politically — leading to periodic protests, regulatory fights, and, in some cities, restrictions that limit ride-hailing availability compared to a US city like New York. Prices between taxis and ride-hailing apps are often fairly comparable in Spain, unlike markets where ride-hailing undercuts taxis dramatically.\n\nTipping is not expected for either taxis or ride-hailing — rounding up the fare or leaving small change is a generous, appreciated gesture, but withholding a tip entirely is completely normal and won't be seen as rude, unlike in the US where tipping is a core part of driver income expectations.",
    comparison: {
      spain: "Regulated taxis and apps like Cabify coexist at broadly similar prices; tipping is optional and modest at most, never a core expectation.",
      uk: "Black cabs and apps like Uber both operate widely; tipping is appreciated but not mandatory, similar to Spain, though black cab fares tend to run higher.",
      us: "Ride-hailing apps (Uber, Lyft) are dominant and often cheaper than traditional taxis; tipping 15-20% is a strong cultural expectation for both taxis and rideshare drivers."
    },
    quiz: [
      { q: "Is tipping expected for Spanish taxis?", options: ["Yes, 20% is required", "No, it's optional — rounding up is appreciated but not expected", "Only in cash", "Only for airport trips"], answer: "No, it's optional — rounding up is appreciated but not expected" },
      { q: "What has the traditional taxi sector done in response to ride-hailing apps?", options: ["Welcomed them with no resistance", "Fought them politically, leading to protests and regulatory restrictions", "Merged with them completely", "Ignored the issue entirely"], answer: "Fought them politically, leading to protests and regulatory restrictions" },
      { q: "What is often set as a fixed rate in many Spanish cities?", options: ["All taxi rides regardless of distance", "Airport-to-city-center trips", "Only nighttime rides", "Rides under 1km"], answer: "Airport-to-city-center trips" },
      { q: "Which ride-hailing app is widely used across Spain?", options: ["Cabify", "Lyft", "Grab", "Didi"], answer: "Cabify" }
    ]
  },

  // ===================== HEALTHCARE =====================
  {
    id: "cul_pharmacy",
    title: "Pharmacy (Farmacia) System",
    category: "healthcare",
    summary: "Green-cross pharmacies are a genuine first stop for minor health issues, with pharmacists giving real medical advice.",
    content: "Pharmacies in Spain, marked by an illuminated green (or sometimes red) cross sign, are far more than a place to pick up a prescription — pharmacists are trained to assess minor ailments, recommend over-the-counter treatments, and give real medical advice for things like a cold, a minor rash, or a stomach bug, often making a doctor's visit unnecessary for small issues. This makes the farmacia a genuine first stop for minor health concerns rather than a last resort after seeing a doctor.\n\nBecause pharmacies can't all stay open 24 hours, cities and towns run a rotating \"farmacia de guardia\" (duty pharmacy) system, guaranteeing at least one pharmacy is open overnight and on holidays in any given area; the schedule is posted on every pharmacy's door and available via city websites and apps. Some medicines that require a prescription elsewhere have historically been available more informally in Spain, though regulation has tightened in recent years, so don't assume anything beyond very basic over-the-counter items will be sold without a prescription.\n\nPractical advice: bring your tarjeta sanitaria (health card) if you're registered in the public system, know that pharmacists usually speak enough English in tourist-heavy areas to help, and check a pharmacy-locator app for the nearest farmacia de guardia if you need something outside normal hours.",
    comparison: {
      spain: "Pharmacists give substantive medical advice for minor issues, function as an accessible first stop, and a duty rotation guarantees 24-hour coverage.",
      uk: "NHS pharmacies are also a genuine first stop for minor ailments and offer free health advice, with prescriptions dispensed at low fixed NHS charges (or free in some nations).",
      us: "Pharmacists typically give more limited medical advice, prescriptions and even OTC costs are heavily tied to insurance coverage, and there is no universal duty-pharmacy guarantee."
    },
    quiz: [
      { q: "What symbol marks a Spanish pharmacy?", options: ["A red cross", "An illuminated green (or red) cross", "A blue circle", "A yellow star"], answer: "An illuminated green (or red) cross" },
      { q: "What can Spanish pharmacists typically do beyond dispensing prescriptions?", options: ["Perform surgery", "Give real medical advice for minor ailments", "Issue passports", "Nothing extra"], answer: "Give real medical advice for minor ailments" },
      { q: "What is a \"farmacia de guardia\"?", options: ["A pharmacy that only sells to tourists", "The rotating duty pharmacy open overnight/holidays in an area", "A government health inspector", "A hospital emergency room"], answer: "The rotating duty pharmacy open overnight/holidays in an area" },
      { q: "What should you bring if registered in Spain's public health system?", options: ["A foreign insurance card only", "Your tarjeta sanitaria (health card)", "A passport photo", "Nothing is needed"], answer: "Your tarjeta sanitaria (health card)" }
    ]
  },
  {
    id: "cul_emergencies",
    title: "Emergencies (Urgencias/112)",
    category: "healthcare",
    summary: "112 is Spain's universal emergency number, and public hospital urgencias departments provide free-at-point-of-use emergency care.",
    content: "112 is the single number to call for any emergency in Spain — police, fire, or medical — and operators can dispatch or transfer you to the right service; it works the same way across the whole country and, like 999 in the UK, is free to call from any phone. For non-life-threatening but urgent medical issues, hospitals have an \"urgencias\" department (the equivalent of A&E/ER) that triages patients by severity rather than arrival order, meaning a genuinely serious case will be seen before someone who arrived earlier with a minor issue.\n\nSpain's public healthcare system (Sistema Nacional de Salud) provides free-at-point-of-use care for residents registered in the system, funded through payroll contributions similar to the UK's NHS model; EU visitors can generally use the EHIC/GHIC card for necessary care, while non-EU visitors typically need travel insurance, since urgencias for uninsured non-residents can result in a bill. A private healthcare system also runs in parallel and is popular for faster access to specialists and elective care.\n\nPractical advice for newcomers: register with your local health center (centro de salud) and get a tarjeta sanitaria as soon as you're a legal resident, know the address of your nearest hospital's urgencias, and keep 112 saved in your phone — operators can generally handle calls in English if needed, though starting in Spanish helps get through faster.",
    comparison: {
      spain: "112 covers all emergencies nationwide; public urgencias departments provide free-at-point-of-use, severity-triaged care funded like the NHS.",
      uk: "999 is the equivalent number, and NHS A&E departments similarly triage by severity and provide free care at the point of use for anyone in the country.",
      us: "911 is the equivalent number, but emergency room visits are billed, often heavily, based on insurance coverage, with no universal free-at-point-of-use guarantee."
    },
    quiz: [
      { q: "What is Spain's universal emergency number?", options: ["999", "911", "112", "061 only"], answer: "112" },
      { q: "How are patients seen in a hospital's urgencias department?", options: ["Strictly first-come, first-served", "Triaged by severity of condition", "By insurance status only", "Alphabetically by last name"], answer: "Triaged by severity of condition" },
      { q: "What card can EU visitors generally use for necessary public healthcare in Spain?", options: ["A national ID card only", "The EHIC/GHIC card", "A driver's license", "A library card"], answer: "The EHIC/GHIC card" },
      { q: "What should a new resident register for as soon as possible?", options: ["A gym membership", "A local health center (centro de salud) and tarjeta sanitaria", "A private hospital only", "A tourist visa"], answer: "A local health center (centro de salud) and tarjeta sanitaria" }
    ]
  },

  // ===================== GOVERNMENT =====================
  {
    id: "cul_cita_previa",
    title: "Cita Previa & Appointments",
    category: "government",
    summary: "Many Spanish administrative processes require booking an appointment (cita previa) online in advance rather than simply walking in.",
    content: "\"Cita previa\" — literally \"prior appointment\" — is the system by which many Spanish government offices, and increasingly some banks, health centers, and even retailers, require you to book a specific time slot online before showing up, rather than accepting walk-ins. This applies to essential processes for newcomers, such as police stations that handle foreigner paperwork (NIE appointments), town halls (ayuntamientos) for registration, and social security offices.\n\nThe practical challenge is that popular offices, especially in big cities, can have appointment slots that fill up within minutes of being released, sometimes weeks or months in advance, which has become a genuine source of frustration and even a small industry of third-party services that help people book slots. Appointments are typically booked through each institution's own online portal (each ministry or agency usually has a separate one), so there's no single unified booking system.",
    comparison: {
      spain: "Most essential government processes require booking a specific appointment online well in advance; popular slots can be scarce and competitive.",
      uk: "Many services (GP appointments, some government offices) also use booking systems, but a wider range of transactions can still be done via walk-in or online without a timed slot.",
      us: "Some agencies (DMV, immigration offices) use appointment systems, but many local government transactions can still be completed via walk-in, mail, or fully online without booking a slot."
    },
    quiz: [
      { q: "What does \"cita previa\" mean?", options: ["Walk-in service", "A prior/advance appointment", "A type of fine", "A tax form"], answer: "A prior/advance appointment" },
      { q: "What is a common challenge with cita previa for popular offices?", options: ["Slots never run out", "Slots can fill up within minutes and be scarce for weeks", "Appointments are always same-day", "There's no online system at all"], answer: "Slots can fill up within minutes and be scarce for weeks" },
      { q: "Is there one single unified portal for booking all cita previa appointments?", options: ["Yes, one national website covers everything", "No, each institution typically has its own separate portal", "Only by phone", "Only in person"], answer: "No, each institution typically has its own separate portal" },
      { q: "Which of these commonly requires a cita previa?", options: ["Buying bread", "NIE-related appointments at a police station", "Boarding a public bus", "Entering a public park"], answer: "NIE-related appointments at a police station" }
    ]
  },
  {
    id: "cul_bureaucracy",
    title: "Bureaucracy: NIE & Empadronamiento",
    category: "government",
    summary: "The NIE (foreigner ID number) and empadronamiento (address registration) are the two foundational steps for living in Spain.",
    content: "The NIE (Número de Identidad de Extranjero) is a unique identification number assigned to foreigners in Spain, required for almost everything official: opening a bank account, signing a work contract, renting a long-term apartment, or buying a car. It's obtained through a police station appointment (usually via cita previa) or, for some nationalities, through a Spanish consulate before arrival.\n\nEmpadronamiento is separate: it's registering your current address with your local town hall (ayuntamiento), producing a certificate (\"empadronamiento\" or \"volante/certificado de empadronamiento\") that proves you live where you say you live. It's required for accessing local public healthcare, enrolling children in school, and renewing residency permits, and — somewhat confusingly for newcomers — it's a registration of address, not proof of legal immigration status, so even undocumented residents are generally encouraged to register for access to local services.\n\nSpanish bureaucracy has a reputation, often deserved, for being slow, paper-heavy, and inconsistent between offices, so practical advice is essential: bring more original documents and photocopies than you think you'll need, expect to make more than one trip, and consider hiring a \"gestor\" — a paperwork professional common in Spain who handles bureaucratic processes for a modest fee — if the process feels overwhelming, especially for anything tax or residency related.",
    comparison: {
      spain: "Requires two distinct registrations (NIE for identity, empadronamiento for address) through separate offices, often via a slow, paper-heavy process; professional \"gestores\" exist specifically to help navigate it.",
      uk: "Registering for a National Insurance number and with a local GP/council serves a broadly similar function but is generally handled through more centralized, digital-first processes.",
      us: "There is no direct equivalent system of local address registration; identity is generally handled through a Social Security number and state-level ID/driver's license processes."
    },
    quiz: [
      { q: "What is the NIE?", options: ["A tax refund form", "A unique foreigner identification number required for most official processes", "A type of visa", "A residency permit"], answer: "A unique foreigner identification number required for most official processes" },
      { q: "What does empadronamiento register?", options: ["Your criminal record", "Your current address with the local town hall", "Your tax bracket", "Your voting preference"], answer: "Your current address with the local town hall" },
      { q: "Is empadronamiento the same as legal immigration status?", options: ["Yes, exactly the same thing", "No, it's a separate registration of address", "It replaces the NIE entirely", "It's only for Spanish citizens"], answer: "No, it's a separate registration of address" },
      { q: "What is a \"gestor\"?", options: ["A government minister", "A professional who helps navigate Spanish bureaucratic paperwork for a fee", "A type of visa", "A police officer"], answer: "A professional who helps navigate Spanish bureaucratic paperwork for a fee" }
    ]
  },

  // ===================== FESTIVALS =====================
  {
    id: "cul_semana_santa",
    title: "Semana Santa",
    category: "festivals",
    summary: "Holy Week processions with elaborate floats and hooded penitents, most famously in Sevilla, fill the week before Easter.",
    content: "Semana Santa (Holy Week) is one of Spain's most important religious and cultural events, marked by daily processions in which religious brotherhoods (cofradías/hermandades) carry elaborate floats (pasos) depicting scenes of Christ's Passion or the Virgin Mary through the streets, accompanied by drums, incense, and huge crowds. Seville's Semana Santa is the most famous nationally, but processions happen across virtually every Spanish city and town, each with local variations.\n\nThe pointed hoods (capirotes) worn by penitents (nazarenos) often startle first-time visitors because of a visual resemblance to unrelated imagery from elsewhere; in Spain, this garb long predates and has no connection to that association — it's a centuries-old form of penitential dress meant to conceal the wearer's identity while doing penance, a tradition that goes back to medieval religious brotherhoods. The heavy floats are carried on the shoulders of teams called costaleros, who train for months to bear the physical weight through narrow streets for hours.\n\nPractical tips for visitors: check processional routes and timings in advance since streets close and crowds are intense, dress respectfully, expect some restaurants and businesses to adjust hours around major processions, and know that in cities like Seville, this is one of the busiest, most heavily booked tourism weeks of the year.",
    comparison: {
      spain: "A major, days-long public religious event with elaborate street processions, brotherhoods, and citywide participation, drawing huge domestic and international crowds.",
      uk: "Easter is marked primarily by a bank holiday weekend, church services for the religiously observant, and commercial traditions like chocolate eggs, with little public procession culture.",
      us: "Easter is largely a family and commercial holiday (egg hunts, church for some), observed at a much smaller, more private scale with no equivalent nationwide public procession tradition."
    },
    quiz: [
      { q: "What are \"pasos\" in the context of Semana Santa?", options: ["Types of Spanish dance steps", "Elaborate religious floats carried in processions", "Government appointment slots", "A type of tapa"], answer: "Elaborate religious floats carried in processions" },
      { q: "Which Spanish city is most famous for its Semana Santa processions?", options: ["Bilbao", "Sevilla", "Santander", "Vigo"], answer: "Sevilla" },
      { q: "What is the traditional origin of the pointed hoods (capirotes)?", options: ["Modern fashion trend", "Centuries-old penitential dress meant to conceal identity during penance", "Military uniforms", "Sports team mascots"], answer: "Centuries-old penitential dress meant to conceal identity during penance" },
      { q: "Who are \"costaleros\"?", options: ["Government officials", "Teams who carry the heavy floats on their shoulders", "Tourist guides", "Street vendors"], answer: "Teams who carry the heavy floats on their shoulders" }
    ]
  },
  {
    id: "cul_reyes_magos",
    title: "Reyes Magos",
    category: "festivals",
    summary: "The Three Kings, not Santa Claus, are the traditional gift-bringers in Spain, arriving on the night of January 5th.",
    content: "In Spain, the main gift-giving tradition centers on the Reyes Magos (the Three Wise Kings — Melchor, Gaspar, and Baltasar), who are said to arrive on the night of January 5th and leave gifts for children to open on the morning of January 6th (Día de Reyes), rather than on December 25th. Christmas Day (Navidad) itself is still celebrated, often as a family meal, but the biggest gift-focused celebration for children traditionally happens nearly two weeks later.\n\nEvery city and town holds a \"cabalgata de Reyes\" on the evening of January 5th — a festive parade with elaborate floats carrying the three kings, who throw sweets to crowds of children lining the streets, functioning as Spain's answer to a Santa parade. On the morning of January 6th, families share a \"roscón de reyes,\" a ring-shaped sweet bread, which traditionally hides a small figurine (and sometimes a bean) inside — finding the figurine supposedly brings luck, while finding the bean traditionally means you have to pay for next year's roscón.\n\nFor expat families with children, this means the Christmas season in Spain runs noticeably longer than in the UK or US, and many households incorporate both traditions — a stocking or small gift on the 25th and the main gifts on the 6th — so it's worth knowing which night your child's school or social circle treats as \"the big one.\"",
    comparison: {
      spain: "The Three Kings (Reyes Magos) bring the main gifts on the night of January 5th, celebrated the next morning with a citywide parade tradition and roscón de reyes cake.",
      uk: "Santa Claus/Father Christmas brings gifts on the night of December 24th, opened on the morning of December 25th, with no equivalent major second gift-giving event in January.",
      us: "Santa Claus brings gifts on Christmas Eve/Day (December 24-25), the singular focal point of the gift-giving season, with no comparable January 6th tradition."
    },
    quiz: [
      { q: "Who traditionally brings the main gifts to children in Spain?", options: ["Santa Claus on December 25th", "The Reyes Magos (Three Kings) on January 5th-6th", "The Easter Bunny", "St. Nicholas on December 6th"], answer: "The Reyes Magos (Three Kings) on January 5th-6th" },
      { q: "What is a \"cabalgata de Reyes\"?", options: ["A religious fast", "A festive evening parade with floats of the three kings", "A type of Spanish exam", "A government appointment"], answer: "A festive evening parade with floats of the three kings" },
      { q: "What is hidden inside a roscón de reyes?", options: ["A gold coin only", "A small figurine (and sometimes a bean)", "Nothing, it's just plain bread", "A house key"], answer: "A small figurine (and sometimes a bean)" },
      { q: "What does finding the bean in the roscón traditionally mean?", options: ["You win a prize", "You have to pay for next year's roscón", "You get to keep the crown", "Nothing happens"], answer: "You have to pay for next year's roscón" }
    ]
  },
  {
    id: "cul_feria_abril",
    title: "Feria de Abril",
    category: "festivals",
    summary: "Seville's April Fair is a week-long celebration of flamenco dress, dancing, horses, and social tents (casetas).",
    content: "The Feria de Abril (April Fair) takes place in Seville roughly two weeks after Easter and transforms a huge fairground into a sea of striped tents called \"casetas,\" hundreds of which are set up by families, friend groups, companies, and clubs for a week of eating, drinking, and dancing sevillanas — a distinctive flamenco-rooted couple's dance closely tied to Andalusian identity. Women traditionally wear the colorful, ruffled \"traje de gitana\" (flamenco dress) and men often wear traditional Andalusian riding attire, especially those participating in the daytime horse and carriage parades.\n\nThe fair began in the mid-19th century as a livestock trading fair and gradually evolved into the massive social event it is today, though a smaller cattle-market element still technically exists on the fairground's edges. A key thing for visitors to understand is that many casetas are private, belonging to families or clubs who require an invitation to enter, while a smaller number are public and open to anyone — so simply wandering in without knowing which is which can lead to confusion or an awkward turn-away.\n\nThe rhythm of the week alternates between a more traditional daytime (horse parades, formal dress, lunch) and an all-night party atmosphere once the sun goes down, with the fairground staying loud and lit until dawn for several nights running. For visitors, practical advice includes seeking out one of the public casetas or asking a Sevillano contact for an invitation, dressing appropriately if invited, and expecting very late nights.",
    comparison: {
      spain: "A week-long, citywide social festival built around private and public tents (casetas), traditional dress, dancing, and horse culture, deeply tied to Andalusian identity.",
      uk: "The closest equivalents are large public festivals or county fairs, but nothing carries the same scale of private family/club social tents or a single unifying folk dance tradition.",
      us: "State fairs offer a livestock-fair legacy and public entertainment, but lack the private, invitation-based social tent culture and citywide, week-long nightlife scale of Feria de Abril."
    },
    quiz: [
      { q: "What are \"casetas\" at the Feria de Abril?", options: ["Government buildings", "Striped tents set up for eating, drinking, and dancing", "Horse stables only", "Museum exhibits"], answer: "Striped tents set up for eating, drinking, and dancing" },
      { q: "What dance is closely associated with the Feria de Abril?", options: ["Flamenco's sevillanas", "Tango", "Salsa", "Waltz"], answer: "Flamenco's sevillanas" },
      { q: "Are all casetas open to the public?", options: ["Yes, always", "No, many are private and require an invitation", "No, all of them are private", "Only foreigners can enter"], answer: "No, many are private and require an invitation" },
      { q: "What was the original purpose of the Feria de Abril?", options: ["A religious pilgrimage", "A livestock trading fair", "A royal wedding celebration", "A military parade"], answer: "A livestock trading fair" }
    ]
  },
  {
    id: "cul_san_fermin",
    title: "San Fermín (Running of the Bulls)",
    category: "festivals",
    summary: "Pamplona's July festival is famous worldwide for the daily encierro (bull run) and round-the-clock celebration.",
    content: "San Fermín, held in Pamplona each July, centers on the religious feast day of Saint Fermín but is best known internationally for the encierro — the daily running of the bulls, in which participants run through a barricaded stretch of narrow streets just ahead of six bulls released to run to the bullring each morning at 8am. The festival officially opens with the \"chupinazo,\" a firework launched from the town hall balcony that kicks off nine days of near-continuous celebration, with participants traditionally dressed in white with a red scarf (pañuelo) and sash.\n\nThe encierro is genuinely dangerous: injuries are common every year, and fatalities, while rare, do happen, since a half-ton bull moving at speed through a crowd of runners is inherently unpredictable. The event is also a focal point for a significant and ongoing animal rights debate within Spain and internationally, with regular protests against bullfighting and the bull run held during the festival itself.\n\nPractical safety advice for anyone considering watching or participating: never run if you haven't studied the route and safety guidance seriously in advance, watch from behind the barriers if unsure, be aware that alcohol and the run are a dangerous combination that experienced participants avoid, and know that simply attending the broader festival — without running — is itself a full, safe, and completely valid way to experience San Fermín.",
    comparison: {
      spain: "A globally famous, physically dangerous public event combining religious tradition, bull-running, and round-the-clock street celebration, alongside active domestic debate over its ethics.",
      uk: "No direct equivalent exists; the closest cultural parallel would be large outdoor festivals or historic customs (e.g., cheese rolling) that carry a fraction of the scale, danger, or controversy.",
      us: "No direct equivalent exists in mainstream US culture; rodeo culture shares a bull-and-danger theme but operates as a controlled competitive sport rather than a public street event."
    },
    quiz: [
      { q: "What is the \"encierro\"?", options: ["A formal dinner", "The daily running of the bulls through Pamplona's streets", "A religious mass", "A fireworks show only"], answer: "The daily running of the bulls through Pamplona's streets" },
      { q: "What event officially opens the San Fermín festival?", options: ["The chupinazo firework launch", "The bull run itself", "A royal address", "A parade of kings"], answer: "The chupinazo firework launch" },
      { q: "What color do participants traditionally wear?", options: ["Black with a blue scarf", "White with a red scarf and sash", "All red", "Green and gold"], answer: "White with a red scarf and sash" },
      { q: "What is a serious risk associated with the encierro?", options: ["It is completely without danger", "Injuries are common and fatalities, while rare, do happen", "Only property damage occurs", "It is purely symbolic with no real bulls"], answer: "Injuries are common and fatalities, while rare, do happen" }
    ]
  },

  // ===================== MODERN SPAIN =====================
  {
    id: "cul_technology",
    title: "Technology & Apps",
    category: "modern",
    summary: "WhatsApp is the backbone of daily communication in Spain, used for everything from friends to schools to landlords.",
    content: "WhatsApp is used far more pervasively in Spain than plain SMS or even email for a huge range of informal and semi-formal communication: friend groups run on WhatsApp chats, parents get school announcements through class WhatsApp groups, landlords and flatmates coordinate through it, and even some small businesses take bookings or questions over WhatsApp rather than phone or email. Not having WhatsApp set up essentially cuts you out of a large share of everyday social and practical coordination.\n\nOn the government and banking side, apps and digital ID systems have become central: Cl@ve is the national digital identity system used to log into many government portals and complete official processes online, and most banks have robust apps used for everything from transfers to identity verification. Food and grocery delivery apps (Glovo, Just Eat, Uber Eats) are extremely popular in cities, and BlaBlaCar, a long-distance carpooling platform, is a genuinely mainstream way many Spaniards travel between cities cheaply, not a niche service.\n\nPractical advice for a newcomer: set up WhatsApp immediately since it's assumed by default in nearly every social and logistical context, and register for Cl@ve or the equivalent digital ID system early since it will save repeated in-person trips for bureaucratic processes down the line.",
    comparison: {
      spain: "WhatsApp is the default channel for nearly all informal coordination (friends, schools, landlords); Cl@ve provides a widely used national digital ID for government processes.",
      uk: "Communication is more split between SMS, WhatsApp, and email depending on context; the UK's Gov.uk Verify/One Login system serves a broadly similar digital government ID role.",
      us: "Texting (iMessage/SMS) remains more dominant than WhatsApp for personal communication; there is no single unified national digital ID app for government services."
    },
    quiz: [
      { q: "What app is used pervasively in Spain for both social and practical coordination?", options: ["WhatsApp", "Only email", "Fax", "A single government app for everything"], answer: "WhatsApp" },
      { q: "What is Cl@ve?", options: ["A dating app", "Spain's national digital identity system for government portals", "A ride-hailing app", "A grocery delivery service"], answer: "Spain's national digital identity system for government portals" },
      { q: "What is BlaBlaCar commonly used for in Spain?", options: ["Booking hotels", "Long-distance carpooling between cities", "Ordering food delivery", "Government appointments"], answer: "Long-distance carpooling between cities" },
      { q: "Why should a newcomer set up WhatsApp immediately?", options: ["It's legally required", "It's assumed by default in nearly every social and logistical context", "It replaces a bank account", "It's only used by tourists"], answer: "It's assumed by default in nearly every social and logistical context" }
    ]
  },
  {
    id: "cul_social_media",
    title: "Social Media Habits",
    category: "modern",
    summary: "Instagram and TikTok dominate youth social media in Spain, while X (Twitter) remains unusually active for news and political debate.",
    content: "Among younger Spaniards, Instagram and TikTok are the dominant platforms for everyday social sharing, entertainment, and following influencers, mirroring broader global trends, but X (formerly Twitter) has remained more actively used in Spain for real-time news, sports commentary, and political discussion than in some countries where its relative influence has faded. Spanish digital culture has its own strong ecosystem of influencers, streamers (Twitch is particularly big for Spanish-language gaming and talk content), and meme culture, often carrying distinctly Spanish humor and references that don't always translate directly.\n\nPrivacy and openness norms online broadly track the more expressive, less reserved communication style seen offline — posting about daily life, relationships, and opinions tends to be less guarded than in more reserved online cultures. Group chats, rather than public posts, are often where the most candid day-to-day conversation actually happens, mirroring the centrality of WhatsApp in offline coordination.\n\nFor a learner of Spanish, following Spanish creators and accounts on these platforms is a genuinely useful, low-effort way to pick up current slang, youth expressions, and cultural references that formal study materials won't cover, though it's worth being aware that regional slang (Madrid vs Andalusia vs Catalonia) can vary significantly.",
    comparison: {
      spain: "Instagram and TikTok dominate youth usage; X remains unusually influential for news/political discussion; Twitch is a major platform for Spanish-language streaming.",
      uk: "Instagram and TikTok are similarly dominant among younger users, with X's relative importance for news discussion having declined more sharply in recent years.",
      us: "Instagram, TikTok, and X all see heavy use, but platform preferences vary widely by age group and political alignment, and Twitch usage skews more toward English-language content."
    },
    quiz: [
      { q: "Which platforms dominate youth social media use in Spain?", options: ["Instagram and TikTok", "Only Facebook", "LinkedIn primarily", "MySpace"], answer: "Instagram and TikTok" },
      { q: "What has remained unusually active in Spain compared to some other countries?", options: ["Fax machines", "X (Twitter) for news and political discussion", "MySpace", "Print newspapers only"], answer: "X (Twitter) for news and political discussion" },
      { q: "What is a practical benefit of following Spanish social media accounts for a language learner?", options: ["It replaces the need to ever speak Spanish", "It's a low-effort way to pick up current slang and cultural references", "It guarantees fluency", "It's required to open a bank account"], answer: "It's a low-effort way to pick up current slang and cultural references" },
      { q: "What platform is particularly popular for Spanish-language streaming?", options: ["Twitch", "LinkedIn Live", "A dedicated government platform", "None, streaming isn't popular in Spain"], answer: "Twitch" }
    ]
  },
  {
    id: "cul_youth_culture",
    title: "Youth Culture",
    category: "modern",
    summary: "High youth unemployment and rent costs mean many young Spaniards live with parents into their late 20s or 30s, shaping a social life built around going out.",
    content: "Spain has historically had among the highest youth unemployment rates in the EU, and even when employed, wages relative to rent — especially in Madrid and Barcelona — have made moving out and achieving full financial independence much slower than in many northern European countries or the US; it's genuinely common and not stigmatized for someone in their late 20s or even early 30s to still live with parents while saving or waiting for stable work. This economic backdrop shapes social habits significantly.\n\nOne clear expression of this is \"botellón\" culture: groups of (often young) people buying alcohol and mixers cheaply from a supermarket and drinking together in a public park or plaza before heading to bars or clubs later at night, since buying drinks all night at a bar or club is expensive relative to income. It's a widespread, normalized weekend ritual in most Spanish cities, though technically restricted or banned in some public spaces by local ordinances, enforced with varying strictness.\n\nFor a young expat, practical advice includes understanding that living with parents longer is not a marker of failure to launch the way it might be perceived elsewhere, and that joining a botellón before a night out is a completely normal, budget-friendly way to socialize with peers rather than something to feel embarrassed about avoiding or joining.",
    comparison: {
      spain: "High youth unemployment and rent burden mean living with parents well into one's late 20s/30s is common and unstigmatized; going-out culture (botellón, late nightlife) fills the social gap.",
      uk: "Moving out for university or work in one's early-to-mid 20s remains a stronger cultural expectation, though rising rents are increasingly pushing more young adults back home too.",
      us: "Independence (moving out, often for college) at 18-22 is a stronger cultural norm and marker of adulthood, with living with parents into one's late 20s carrying more social stigma than in Spain."
    },
    quiz: [
      { q: "Why do many young Spaniards live with their parents into their late 20s or 30s?", options: ["It's a strict cultural law", "High youth unemployment and rent costs relative to wages", "Spanish culture forbids independent living", "There is no rental housing in Spain"], answer: "High youth unemployment and rent costs relative to wages" },
      { q: "What is \"botellón\"?", options: ["A type of tapa", "Drinking cheaply bought alcohol together in a public space before going out", "A government subsidy", "A university exam"], answer: "Drinking cheaply bought alcohol together in a public space before going out" },
      { q: "How is living with parents into one's late 20s generally viewed in Spain?", options: ["Highly stigmatized", "Common and not stigmatized", "Illegal", "Only acceptable for students"], answer: "Common and not stigmatized" },
      { q: "Why is botellón a popular option before a night out?", options: ["Bars are closed until midnight", "It's much cheaper than buying drinks all night at a bar or club", "It's the only legal way to drink", "It's required by universities"], answer: "It's much cheaper than buying drinks all night at a bar or club" }
    ]
  },
  {
    id: "cul_workplace_trends",
    title: "Workplace Trends (Remote Work & Work-Life Balance)",
    category: "modern",
    summary: "Spain has embraced remote/hybrid work and passed a 'right to disconnect' law, though traditions like August slowdowns persist.",
    content: "Since the pandemic, remote and hybrid work have become widespread in Spain's office-based sectors, supported by a 2020 teleworking law (\"ley de teletrabajo\") that sets out requirements around equipment, expense reimbursement, and voluntary agreement for remote arrangements. Spain also has a legal \"derecho a la desconexión digital\" (right to digital disconnection), meaning employees generally have a right to not be contacted about work outside working hours, reflecting a broader cultural and legal push toward protecting personal time.\n\nSome older seasonal habits persist strongly alongside these newer trends: many Spanish businesses, especially smaller ones, slow down significantly or close entirely for parts of August, when a large share of the country takes its main summer holiday at once, and many companies shift to a \"jornada intensiva\" (a shorter, single continuous shift, often finishing by 3pm) during summer months, especially in southern and hotter regions. There's an ongoing broader debate in Spain about modernizing the traditional long lunch break and late finish time in favor of a schedule closer to northern Europe's, though change has been gradual and uneven across sectors.\n\nFor foreign workers or remote employees dealing with Spain, practical advice includes expecting reduced responsiveness in August, being aware that a formal right to disconnect exists (so out-of-hours messages may go unanswered without any negative implication), and checking whether a company observes jornada intensiva in summer, which can significantly shift meeting availability.",
    comparison: {
      spain: "A legal right to digital disconnection and widespread hybrid work coexist with strong seasonal traditions like August slowdowns and shortened summer working hours (jornada intensiva).",
      uk: "Hybrid work is similarly common post-pandemic, but there is no equivalent formal legal right to disconnect, and August slowdowns are far less pronounced nationally.",
      us: "Remote/hybrid work adoption varies heavily by company and has faced more pushback (return-to-office mandates) in some sectors, with no federal right to disconnect and minimal seasonal slowdown culture."
    },
    quiz: [
      { q: "What does Spain's \"derecho a la desconexión digital\" refer to?", options: ["The right to a company phone", "The legal right to not be contacted about work outside working hours", "Mandatory overtime pay", "A rule about internet speed"], answer: "The legal right to not be contacted about work outside working hours" },
      { q: "What is \"jornada intensiva\"?", options: ["A mandatory overtime shift", "A shortened, single continuous summer work shift, often ending by 3pm", "A type of layoff", "A night-shift-only schedule"], answer: "A shortened, single continuous summer work shift, often ending by 3pm" },
      { q: "What commonly happens to many Spanish businesses in August?", options: ["They open 24/7", "Many slow down significantly or close for parts of the month", "They double their staff", "Nothing changes at all"], answer: "Many slow down significantly or close for parts of the month" },
      { q: "What law in 2020 addressed remote work arrangements in Spain?", options: ["The Ley de Arrendamientos Urbanos", "The ley de teletrabajo (teleworking law)", "The Ley de Extranjería", "The Bologna Process"], answer: "The ley de teletrabajo (teleworking law)" }
    ]
  }
];
