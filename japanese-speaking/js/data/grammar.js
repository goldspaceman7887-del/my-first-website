// Sentence-internal grammar structures (as opposed to connectors.js, which is discourse-level).
// Leveled to ACTFL sublevels. IH is fast review; AL and AM are the real 3-month payload;
// AH is the on-ramp for the month after this plan ends.
// Example sentences mark the target span in **double asterisks** so Review Session can highlight it reliably.
export const LEVELS = [
  { id: "IH", label: "Intermediate High", note: "Should be automatic — foundation you're consolidating in week 1", color: "#3b82f6" },
  { id: "AL", label: "Advanced Low", note: "Month 1 payload — narration/description control", color: "#14b8a6" },
  { id: "AM", label: "Advanced Mid", note: "Months 2-3 payload — nuance, elaboration, tighter logic", color: "#f59e0b" },
  { id: "AH", label: "Advanced High", note: "Where you go after this plan — register control, sophisticated stance-taking", color: "#d6336c" },
];

export const GRAMMAR = [
  // ================= IH — fast review, week 1 only =================
  {
    id: "g1", level: "IH", title: "~ている (progressive / resultative)",
    structure: "Verb-て + いる",
    explanation: "Two distinct meanings you must control automatically: ongoing action (今食べている＝eating right now) vs. resultant state (結婚している＝is married, a state resulting from a past change). Advanced narration constantly relies on getting the state/action distinction right.",
    examples: [
      { jp: "今、資料を**準備しているところ**です。", en: "I'm in the middle of preparing the materials right now." },
      { jp: "彼はもう五年間その会社に**勤めています**。", en: "He has been working at that company for five years now." },
    ],
    mistake: "Learners often use ~た for states that should be ~ている (窓が閉まった vs 窓が閉まっている) — this is one of the most common fossilized IH-level errors.",
  },
  {
    id: "g2", level: "IH", title: "~たことがある (experience)",
    structure: "Verb-た + ことがある",
    explanation: "Marks lifetime experience, not a single completed past event. Essential for narrating background before you launch into a specific story.",
    examples: [
      { jp: "以前、大阪に**住んでいたことがあります**。", en: "I've lived in Osaka before." },
      { jp: "彼女に一度だけ**会ったことがある**。", en: "I've met her only once." },
    ],
    mistake: "Confusing with plain past (会った) when you mean 'I have the experience of' rather than 'I did it (once, specifically).'",
  },
  {
    id: "g3", level: "IH", title: "~ようになる / ~なくなる (change of state)",
    structure: "Verb (dictionary/nai-form) + ようになる・なくなる",
    explanation: "Narrating gradual change over time — a core building block for 'how things got to be this way' paragraphs, which is exactly the kind of extended narration Advanced raters listen for.",
    examples: [
      { jp: "毎日練習した結果、スムーズに**話せるようになりました**。", en: "As a result of practicing every day, I became able to speak smoothly." },
      { jp: "忙しくなって、あまり**本を読まなくなった**。", en: "I got busy and stopped reading books much." },
    ],
  },
  {
    id: "g4", level: "IH", title: "~そうだ (様態: looks like / seems)",
    structure: "い-adj(stem)/な-adj/Verb-stem + そうだ",
    explanation: "Visual/inferential judgment based on appearance — distinct from 伝聞 hearsay そうだ (which attaches to plain form). Mixing these up is a classic IH-level error that Advanced raters notice immediately.",
    examples: [
      { jp: "この料理、**美味しそう**ですね。", en: "This dish looks delicious." },
      { jp: "彼は**疲れていそう**だった。", en: "He looked tired." },
    ],
    mistake: "美味しいそうだ (hearsay: 'I heard it's delicious') vs 美味しそうだ (looks delicious) — these are different structures with different attachment rules.",
  },
  {
    id: "g5", level: "IH", title: "~かもしれない (possibility)",
    structure: "Plain form + かもしれない",
    explanation: "Hedging language — critical for opinion paragraphs where Advanced speakers qualify claims instead of overstating certainty.",
    examples: [
      { jp: "明日は雨が**降るかもしれません**。", en: "It might rain tomorrow." },
      { jp: "彼はまだ**知らないかもしれない**。", en: "He might not know yet." },
    ],
  },
  {
    id: "g6", level: "IH", title: "~なければならない / ~なくてはいけない (obligation)",
    structure: "Verb-nai stem + ければならない / くてはいけない",
    explanation: "Baseline obligation forms. You'll layer べきだ (AM) and ざるを得ない (AH) on top of this later — this plain version needs to be completely automatic first.",
    examples: [
      { jp: "明日までにレポートを**提出しなければなりません**。", en: "I have to submit the report by tomorrow." },
      { jp: "規則だから、**守らなくてはいけない**。", en: "It's a rule, so we have to follow it." },
    ],
  },

  // ================= AL — Month 1 payload =================
  {
    id: "g7", level: "AL", title: "~のに (contrary to expectation)",
    structure: "Plain form + のに",
    explanation: "Stronger than しかし — it packs contrast and a hint of surprise/frustration into a single clause, letting you build complex sentences instead of always starting a new one with a connector. This clause-level compression is a hallmark of the IH→AL shift.",
    examples: [
      { jp: "あんなに**頑張ったのに**、結果が出なかった。", en: "Even though I tried so hard, I didn't get results." },
      { jp: "彼は**お金持ちなのに**、とてもけちだ。", en: "Even though he's rich, he's very stingy." },
    ],
  },
  {
    id: "g8", level: "AL", title: "~ということだ (definition / hearsay conclusion)",
    structure: "Clause + ということだ",
    explanation: "Two uses: restating/defining ('that means...') and reporting secondhand information as a conclusion. Useful for the 'summarize what you just said' move that closes an AL-level paragraph.",
    examples: [
      { jp: "つまり、彼は来月**引っ越すということだ**。", en: "In other words, that means he's moving next month." },
      { jp: "天気予報によると、明日は**台風が来るということだ**。", en: "According to the weather forecast, a typhoon is coming tomorrow." },
    ],
  },
  {
    id: "g9", level: "AL", title: "~わけだ (naturally follows / makes sense)",
    structure: "Plain form + わけだ",
    explanation: "Marks a logical conclusion the listener should now understand given what was just said — a discourse-management tool for guiding your listener through your reasoning, not just stating facts.",
    examples: [
      { jp: "彼は十年間フランスに住んでいた。だからフランス語が**上手なわけだ**。", en: "He lived in France for ten years. That's why (it makes sense that) his French is good." },
      { jp: "電車が止まっている。つまり、**歩いて行くしかないわけだ**。", en: "The trains are stopped. In other words, we have no choice but to walk." },
    ],
  },
  {
    id: "g10", level: "AL", title: "Causative ~させる",
    structure: "Verb (causative form)",
    explanation: "Needed constantly in narration involving other people — 'made someone do X' or 'let someone do X.' A narrative with only direct action verbs (I did X) sounds flat; causatives let you narrate interactions.",
    examples: [
      { jp: "先生は学生に**発表させた**。", en: "The teacher had the students give presentations." },
      { jp: "子供を一人で**行かせる**のは心配だ。", en: "I'm worried about letting my child go alone." },
    ],
  },
  {
    id: "g11", level: "AL", title: "Passive ~られる",
    structure: "Verb (passive form)",
    explanation: "Beyond textbook 'was done to' — the Japanese 迷惑受身 (adversative passive) lets you narrate something unfortunate happening to you, which is exactly the register 'complication' narratives need.",
    examples: [
      { jp: "電車の中で足を**踏まれた**。", en: "My foot got stepped on on the train (and it was annoying)." },
      { jp: "急に予定を**変更されて**困った。", en: "The schedule was suddenly changed on me, and it was a problem." },
    ],
  },
  {
    id: "g12", level: "AL", title: "~ば / ~たら nuance control",
    structure: "Conditional forms",
    explanation: "たら = sequential/one-off condition (often past-flavored); ば = general/hypothetical rule, and stacks awkwardly with volitional forms in ば. Being able to choose deliberately (not just default to たら for everything) reads as more controlled.",
    examples: [
      { jp: "駅に**着いたら**、電話してください。", en: "Once you get to the station, please call me." },
      { jp: "早く**出発すれば**、渋滞を避けられる。", en: "If you leave early, you can avoid the traffic." },
    ],
  },
  {
    id: "g13", level: "AL", title: "~ばかりでなく / ~だけでなく (not only X but also Y)",
    structure: "Clause + ばかりでなく・だけでなく + も",
    explanation: "Stacks two supporting points into one sentence instead of two separate ones — an easy, high-payoff way to sound more elaborated when you list reasons or qualities.",
    examples: [
      { jp: "彼女は語学が**得意なだけでなく**、リーダーシップもある。", en: "She's not only good at languages, she also has leadership skills." },
      { jp: "この問題は経済的な**影響ばかりでなく**、社会的な影響も大きい。", en: "This issue has a large impact not only economically but socially as well." },
    ],
  },
  {
    id: "g14", level: "AL", title: "~として (in the capacity/role of)",
    structure: "Noun + として",
    explanation: "Lets you frame a statement from a specific stance — 'as a student,' 'as a foreigner' — which is exactly the kind of perspective-marking Advanced opinion paragraphs need.",
    examples: [
      { jp: "一人の**学習者として**、この方法は効果的だと感じています。", en: "As a learner myself, I feel this method is effective." },
      { jp: "彼は**エンジニアとして**十年の経験がある。", en: "He has ten years of experience as an engineer." },
    ],
  },
  {
    id: "g15", level: "AL", title: "~にとって (from the standpoint of / for)",
    structure: "Noun + にとって",
    explanation: "Frames a judgment as relative to a particular person or group's perspective — a precise way to qualify a claim instead of stating it as a flat universal fact.",
    examples: [
      { jp: "この変更は多くの**社員にとって**大きな負担になる。", en: "This change will be a big burden for many employees." },
      { jp: "**私にとって**、家族との時間が一番大切です。", en: "For me, time with family is the most important thing." },
    ],
  },
  {
    id: "g16", level: "AL", title: "~わりに (considering / for what it is)",
    structure: "Plain form / Noun + の + わりに",
    explanation: "Signals a mismatch between an expectation set by one fact and the actual outcome — 'cheap for how good it is,' 'young for how experienced he is.' A compact contrast tool below the sentence level.",
    examples: [
      { jp: "このレストランは**安いわりに**、料理がとても美味しい。", en: "This restaurant is cheap, but (considering that) the food is really delicious." },
      { jp: "彼は**経験が浅いわりに**、仕事がとても丁寧だ。", en: "Considering how little experience he has, his work is very careful." },
    ],
  },
  {
    id: "g17", level: "AL", title: "~おかげで / ~せいで (thanks to / because of — blame)",
    structure: "Plain form / Noun + の + おかげで・せいで",
    explanation: "おかげで credits a positive cause; せいで blames a negative one. Using both deliberately (not just だから for everything) signals you can mark the emotional valence of a cause, not just the cause itself.",
    examples: [
      { jp: "**先生のおかげで**、試験に合格することができました。", en: "Thanks to my teacher, I was able to pass the exam." },
      { jp: "**電車が遅れたせいで**、会議に遅刻してしまった。", en: "Because the train was late, I ended up being late to the meeting." },
    ],
  },
  {
    id: "g18", level: "AL", title: "~たびに (every time / whenever)",
    structure: "Verb (dictionary form) / Noun + の + たびに",
    explanation: "Marks a recurring pattern tied to an event, useful for description paragraphs that need to show a habit or repeated observation rather than a one-time fact.",
    examples: [
      { jp: "彼女に**会うたびに**、新しい発見がある。", en: "Every time I meet her, there's something new to discover." },
      { jp: "海外に**行くたびに**、日本の良さを再確認する。", en: "Every time I go abroad, I reconfirm what's good about Japan." },
    ],
  },
  {
    id: "g19", level: "AL", title: "~とおり(に) (as / in accordance with)",
    structure: "Verb-た/る + とおり(に), Noun + の + とおり(に)",
    explanation: "Marks that something happened exactly matching a plan, instruction, or expectation — useful for narrating whether a situation went as anticipated before you introduce a complication.",
    examples: [
      { jp: "**計画どおりに**進めば、来月には完成する予定です。", en: "If it proceeds as planned, it should be finished next month." },
      { jp: "先生に**言われたとおりに**やってみました。", en: "I tried doing it exactly as the teacher told me." },
    ],
  },
  {
    id: "g20", level: "AL", title: "~ながらも (even while / although)",
    structure: "Verb-stem / い-adj / な-adj + ながらも",
    explanation: "A softer, slightly more literary alternative to のに — concedes a fact while asserting something that sits in tension with it, often about your own conflicted feelings or actions.",
    examples: [
      { jp: "忙しいと**知っていながらも**、つい連絡してしまった。", en: "Even though I knew he was busy, I ended up contacting him anyway." },
      { jp: "不安を**感じながらも**、新しい挑戦を続けている。", en: "Even while feeling anxious, I keep pursuing the new challenge." },
    ],
  },

  // ================= AM — Months 2-3 payload =================
  {
    id: "g21", level: "AM", title: "Causative-passive ~させられる",
    structure: "Verb (causative-passive form)",
    explanation: "'Was made to do X (against my will).' One structure, entirely native-sounding way to narrate being compelled into something — replaces a clunky workaround like 'X said I had to.'",
    examples: [
      { jp: "部長に飲み会に**参加させられた**。", en: "I was made to attend the drinking party by my boss." },
      { jp: "満員電車で一時間も**立たされた**。", en: "I was forced to stand for a whole hour on a packed train." },
    ],
  },
  {
    id: "g22", level: "AM", title: "~ものの (although / despite)",
    structure: "Plain form + ものの",
    explanation: "More literary/formal than けれども — signals you acknowledge a fact fully before pivoting. Common in opinion paragraphs when conceding a counterpoint before your main claim.",
    examples: [
      { jp: "計画には**賛成したものの**、実行には不安がある。", en: "Although I agreed to the plan, I have concerns about carrying it out." },
      { jp: "経験は**浅いものの**、彼のやる気は本物だ。", en: "Although his experience is limited, his motivation is genuine." },
    ],
  },
  {
    id: "g23", level: "AM", title: "~つつ / ~つつある (while / in the process of)",
    structure: "Verb-stem + つつ(ある)",
    explanation: "つつ = doing X while doing Y (simultaneous, often contradictory); つつある = a change is currently in progress. Both let you narrate nuance and gradual shifts that plain ~ながら/~ている can't quite capture.",
    examples: [
      { jp: "悪いと**知りつつ**、つい言ってしまった。", en: "Knowing it was wrong, I still ended up saying it." },
      { jp: "その習慣は徐々に**失われつつある**。", en: "That custom is gradually being lost." },
    ],
  },
  {
    id: "g24", level: "AM", title: "~において / ~に関して (formal topic markers)",
    structure: "Noun + において・に関して",
    explanation: "Formal register substitutes for で/について — signals you can shift into a more written/formal register mid-speech, which raters read as register flexibility.",
    examples: [
      { jp: "この**会議において**、来年度の予算について話し合います。", en: "At this meeting, we will discuss next year's budget." },
      { jp: "その**問題に関して**は、まだ結論が出ていません。", en: "Regarding that issue, no conclusion has been reached yet." },
    ],
  },
  {
    id: "g25", level: "AM", title: "~ばかりに (unfortunately because of / all because)",
    structure: "Plain form + ばかりに",
    explanation: "Cause that led to a bad, often disproportionate, result — carries emotional weight (regret/frustration) that plain ~ので lacks. Perfect for 'complication' narratives.",
    examples: [
      { jp: "**焦っていたばかりに**、大事なファイルを送り忘れた。", en: "Just because I was in a rush, I forgot to send the important file." },
      { jp: "一言**余計なことを言ったばかりに**、けんかになってしまった。", en: "Just because of one unnecessary comment, it turned into a fight." },
    ],
  },
  {
    id: "g26", level: "AM", title: "~からといって〜ない (just because... doesn't mean...)",
    structure: "Plain form + からといって + negative",
    explanation: "A two-part structure for rejecting an implied overgeneralization — exactly the move Advanced opinion paragraphs need when acknowledging then refuting a counterargument.",
    examples: [
      { jp: "**お金があるからといって**、幸せだとは限らない。", en: "Just because you have money doesn't mean you're happy." },
      { jp: "**若いからといって**、体力があるわけではない。", en: "Just because someone is young doesn't mean they're physically strong." },
    ],
  },
  {
    id: "g27", level: "AM", title: "~にしても / ~にしろ (even granting that)",
    structure: "Plain form + にしても・にしろ",
    explanation: "Concedes a premise as fully valid, then argues your point still holds anyway — a stronger, more formal move than 'even if,' good for rebutting a strong counterargument rather than a weak one.",
    examples: [
      { jp: "**忙しいにしても**、返事ぐらいはできたはずだ。", en: "Even granting that he was busy, he should have at least been able to reply." },
      { jp: "多少の**リスクがあるにしろ**、挑戦する価値はある。", en: "Even if there's some risk, it's worth the challenge." },
    ],
  },
  {
    id: "g28", level: "AM", title: "~上で (after doing / having done, as a basis for)",
    structure: "Verb-た + 上で",
    explanation: "Marks a necessary prior step before the main action — useful for describing a careful, deliberate process ('having considered X, we decided Y') rather than a simple sequence.",
    examples: [
      { jp: "十分に**検討した上で**、結論を出したいと思います。", en: "I'd like to reach a conclusion only after considering it thoroughly." },
      { jp: "上司に**相談した上で**、返事をします。", en: "I'll reply after consulting with my supervisor first." },
    ],
  },
  {
    id: "g29", level: "AM", title: "~あげく(に) (in the end, after all that — negative outcome)",
    structure: "Verb-た + あげく(に)",
    explanation: "Marks the culmination of a long, difficult, or repetitive process ending in an unfortunate result — a compact way to narrate a drawn-out complication and its (bad) resolution in one clause.",
    examples: [
      { jp: "何時間も**悩んだあげく**、結局その話を断ることにした。", en: "After agonizing over it for hours, I ended up deciding to turn the offer down." },
      { jp: "何軒も店を**回ったあげく**、何も買わずに帰った。", en: "After going around to shop after shop, I went home having bought nothing." },
    ],
  },
  {
    id: "g30", level: "AM", title: "~ことなく (without doing)",
    structure: "Verb (dictionary form) + ことなく",
    explanation: "A more literary, elevated register alternative to ~ないで/~ずに — good for narrating persistence or restraint with a slightly more formal, deliberate tone.",
    examples: [
      { jp: "彼は一度も**諦めることなく**、最後までやり遂げた。", en: "He carried it through to the end without ever giving up." },
      { jp: "誰にも**相談することなく**、一人で決めてしまった。", en: "I ended up deciding alone, without consulting anyone." },
    ],
  },
  {
    id: "g31", level: "AM", title: "~かのように (as if / as though)",
    structure: "Plain form + かのように",
    explanation: "Marks a comparison to something that isn't actually true — useful for vivid description and for framing someone's behavior skeptically ('he acted as if he didn't know').",
    examples: [
      { jp: "彼は**何も知らないかのように**振る舞った。", en: "He acted as if he didn't know anything." },
      { jp: "まるで**昨日のことのように**鮮明に覚えている。", en: "I remember it vividly, as if it were yesterday." },
    ],
  },
  {
    id: "g32", level: "AM", title: "~にほかならない (nothing other than / precisely because of)",
    structure: "Noun + にほかならない",
    explanation: "A strong, formal way of asserting that one specific cause/explanation is the real one, rejecting alternatives — useful for a confident, emphatic conclusion in an opinion paragraph.",
    examples: [
      { jp: "彼が成功したのは、**努力の結果にほかならない**。", en: "The reason he succeeded is nothing other than the result of his effort." },
    ],
  },
  {
    id: "g33", level: "AM", title: "~を通じて / ~を通して (through / by means of)",
    structure: "Noun + を通じて・を通して",
    explanation: "Frames a means or channel through which something happens — common in describing how you learned or experienced something over an extended period, a natural fit for reflective description.",
    examples: [
      { jp: "**留学を通じて**、多くのことを学びました。", en: "Through studying abroad, I learned a great many things." },
      { jp: "この**活動を通して**、地域の人々とつながることができた。", en: "Through this activity, I was able to connect with people in the community." },
    ],
  },
  {
    id: "g34", level: "AM", title: "~に伴って (accompanying / as X happens)",
    structure: "Noun / Verb (dictionary form) + に伴って",
    explanation: "Marks that two changes are happening together — good for describing broader trends and their consequences, a common move in comparison and opinion paragraphs about society.",
    examples: [
      { jp: "**少子化に伴って**、学校の数も減少している。", en: "Accompanying the declining birthrate, the number of schools is also decreasing." },
    ],
  },
  {
    id: "g35", level: "AM", title: "~たところで (even if you were to — it wouldn't help)",
    structure: "Verb-た + ところで",
    explanation: "Concedes a hypothetical action but asserts it would be futile — a pointed, slightly world-weary structure for arguing that a proposed solution wouldn't actually fix the underlying problem.",
    examples: [
      { jp: "今さら**謝ったところで**、許してもらえるとは思えない。", en: "Even if I apologized now, I don't think I'd be forgiven." },
    ],
  },
  {
    id: "g36", level: "AM", title: "~べきだ / ~べきではない (should / shouldn't — moral obligation)",
    structure: "Verb (dictionary form) + べきだ・べきではない",
    explanation: "Marks moral or principled obligation, distinct from external necessity (なければならない) — the natural structure for stating and defending a position in an opinion paragraph.",
    examples: [
      { jp: "子供にはもっと自然の中で**遊ばせるべきだ**と思う。", en: "I think children should be allowed to play in nature more." },
      { jp: "他人のプライバシーを**軽視するべきではない**。", en: "One shouldn't disregard other people's privacy." },
    ],
  },

  // ================= AH — where you go after this plan =================
  {
    id: "g37", level: "AH", title: "~とはいえ (that said / even so)",
    structure: "Clause + とはいえ",
    explanation: "More formal/written-flavored than でも/しかし — a single word that concedes fully and pivots, letting you sound measured rather than blunt. AH speakers use this to soften disagreement while still making a clear point.",
    examples: [
      { jp: "在宅勤務は便利だ。**とはいえ**、孤独を感じる人も少なくない。", en: "Remote work is convenient. That said, quite a few people feel isolated." },
    ],
  },
  {
    id: "g38", level: "AH", title: "~にすぎない (nothing more than / merely)",
    structure: "Noun/Clause + にすぎない",
    explanation: "Diminishes a claim precisely — useful for pushing back on an argument without being aggressive ('that's merely one possibility, not the whole picture').",
    examples: [
      { jp: "それは一つの**可能性にすぎない**。断定はできない。", en: "That's merely one possibility. We can't say for certain." },
    ],
  },
  {
    id: "g39", level: "AH", title: "~ざるを得ない (have no choice but to)",
    structure: "Verb-nai stem (irregular for する→せざるを得ない) + ざるを得ない",
    explanation: "A formal, almost literary way of expressing reluctant compulsion — noticeably more sophisticated than しなければならない, and signals you can modulate obligation language by register.",
    examples: [
      { jp: "状況を考えると、計画を**変更せざるを得ない**。", en: "Given the situation, we have no choice but to change the plan." },
    ],
  },
  {
    id: "g40", level: "AH", title: "~かねない (might well / risk of)",
    structure: "Verb-stem + かねない",
    explanation: "Expresses a negative possibility with real weight — 'this could well lead to X (bad outcome).' Distinct from the neutral かもしれない; using it correctly signals precise control over nuance of risk.",
    examples: [
      { jp: "この対応を誤ると、大きな問題に**なりかねない**。", en: "If we mishandle this, it could well turn into a serious problem." },
    ],
  },
  {
    id: "g41", level: "AH", title: "~がたい (hard to / difficult to, emotionally/morally)",
    structure: "Verb-stem + がたい",
    explanation: "More abstract/formal than ~にくい — used for things that are conceptually or morally hard to do (信じがたい, 許しがたい), not physically difficult. A precision marker of advanced vocabulary control.",
    examples: [
      { jp: "彼の言い訳は到底**信じがたい**。", en: "His excuse is simply hard to believe." },
    ],
  },
  {
    id: "g42", level: "AH", title: "~ずにはいられない (can't help but / can't resist)",
    structure: "Verb-nai stem + ずにはいられない",
    explanation: "Expresses an emotional or physical impulse too strong to suppress — a natural way to narrate a reaction you couldn't control, adding emotional texture to a story's climax.",
    examples: [
      { jp: "その話を聞いて、**涙を流さずにはいられなかった**。", en: "Hearing that story, I couldn't help but cry." },
    ],
  },
  {
    id: "g43", level: "AH", title: "~んばかりに (as if about to / practically)",
    structure: "Verb-nai stem (drop ない) + んばかりに",
    explanation: "A vivid, literary way to describe an intense state that looks like it's on the verge of happening — 'shouting as if about to cry.' Rare in casual speech, but a clear marker of stylistic range when used well.",
    examples: [
      { jp: "彼は今にも**泣き出さんばかりの**顔をしていた。", en: "He had a look on his face as if he were about to burst into tears." },
    ],
  },
  {
    id: "g44", level: "AH", title: "Register switching: だ・である体 vs です・ます体",
    structure: "Plain/copula style vs. polite style, deployed deliberately",
    explanation: "The clearest Advanced High signal isn't a grammar point at all — it's controlled code-switching. AH speakers can drop into である-style for a formal aside or a definitional statement mid-conversation, then return to です・ます, on purpose, for rhetorical effect (this mirrors how native speakers quote written sources or make a point sound 'official'). Doing this by accident (mixing styles carelessly) reads as an error; doing it deliberately reads as sophistication.",
    examples: [
      { jp: "この問題については様々な意見がある。しかし、**私はこう考えています**。", en: "There are various opinions on this issue [formal/written-flavored]. However, I think as follows [back to polite speech register]." },
    ],
  },
];

export function grammarForLevel(levelId) {
  return GRAMMAR.filter((g) => g.level === levelId);
}
