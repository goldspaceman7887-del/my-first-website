// Sentence-internal grammar structures (as opposed to connectors.js, which is discourse-level).
// Leveled to ACTFL sublevels so the gap between where you are (mid-IH) and Advanced High is explicit.
export const LEVELS = [
  { id: "IH", label: "Intermediate High", note: "Should be automatic — foundation you're consolidating right now", color: "#3b82f6" },
  { id: "AL", label: "Advanced Low", note: "The next checkpoint — narration/description control", color: "#14b8a6" },
  { id: "AM", label: "Advanced Mid", note: "Nuance, elaboration, tighter logical structures", color: "#f59e0b" },
  { id: "AH", label: "Advanced High", note: "Register control, sophisticated stance-taking, near-native precision", color: "#d6336c" },
];

export const GRAMMAR = [
  // ---- IH: consolidate ----
  {
    id: "g1", level: "IH", title: "~ている (progressive / resultative)",
    structure: "Verb-て + いる",
    explanation: "Two distinct meanings you must control automatically: ongoing action (今食べている＝eating right now) vs. resultant state (結婚している＝is married, a state resulting from a past change). Advanced narration constantly relies on getting the state/action distinction right.",
    examples: [
      { jp: "今、資料を準備しているところです。", en: "I'm in the middle of preparing the materials right now." },
      { jp: "彼はもう五年間その会社に勤めています。", en: "He has been working at that company for five years now." },
    ],
    mistake: "Learners often use ~た for states that should be ~ている (窓が閉まった vs 窓が閉まっている) — this is one of the most common fossilized IH-level errors.",
  },
  {
    id: "g2", level: "IH", title: "~たことがある (experience)",
    structure: "Verb-た + ことがある",
    explanation: "Marks lifetime experience, not a single completed past event. Essential for narrating background before you launch into a specific story.",
    examples: [
      { jp: "以前、大阪に住んでいたことがあります。", en: "I've lived in Osaka before." },
      { jp: "彼女に一度だけ会ったことがある。", en: "I've met her only once." },
    ],
    mistake: "Confusing with plain past (会った) when you mean 'I have the experience of' rather than 'I did it (once, specifically).'",
  },
  {
    id: "g3", level: "IH", title: "~ようになる / ~なくなる (change of state)",
    structure: "Verb (dictionary/nai-form) + ようになる・なくなる",
    explanation: "Narrating gradual change over time — a core building block for 'how things got to be this way' paragraphs, which is exactly the kind of extended narration Advanced raters listen for.",
    examples: [
      { jp: "毎日練習した結果、スムーズに話せるようになりました。", en: "As a result of practicing every day, I became able to speak smoothly." },
      { jp: "忙しくなって、あまり本を読まなくなった。", en: "I got busy and stopped reading books much." },
    ],
  },
  {
    id: "g4", level: "IH", title: "~そうだ (様態: looks like / seems)",
    structure: "い-adj(stem)/な-adj/Verb-stem + そうだ",
    explanation: "Visual/inferential judgment based on appearance — distinct from 伝聞 hearsay そうだ (which attaches to plain form). Mixing these up is a classic IH-level error that Advanced raters notice immediately.",
    examples: [
      { jp: "この料理、美味しそうですね。", en: "This dish looks delicious." },
      { jp: "彼は疲れていそうだった。", en: "He looked tired." },
    ],
    mistake: "美味しいそうだ (hearsay: 'I heard it's delicious') vs 美味しそうだ (looks delicious) — these are different structures with different attachment rules.",
  },
  {
    id: "g5", level: "IH", title: "~かもしれない (possibility)",
    structure: "Plain form + かもしれない",
    explanation: "Hedging language — critical for opinion paragraphs where Advanced speakers qualify claims instead of overstating certainty.",
    examples: [
      { jp: "明日は雨が降るかもしれません。", en: "It might rain tomorrow." },
      { jp: "彼はまだ知らないかもしれない。", en: "He might not know yet." },
    ],
  },
  {
    id: "g6", level: "IH", title: "~なければならない / ~なくてはいけない (obligation)",
    structure: "Verb-nai stem + ければならない / くてはいけない",
    explanation: "Obligation forms. Advanced speakers vary between these and more sophisticated forms (べきだ, ざるを得ない) depending on whether they mean external necessity vs. moral 'should' vs. reluctant compulsion — that variation itself is an Advanced-level signal.",
    examples: [
      { jp: "明日までにレポートを提出しなければなりません。", en: "I have to submit the report by tomorrow." },
      { jp: "規則だから、守らなくてはいけない。", en: "It's a rule, so we have to follow it." },
    ],
  },

  // ---- AL: the next checkpoint ----
  {
    id: "g7", level: "AL", title: "~のに (contrary to expectation)",
    structure: "Plain form + のに",
    explanation: "Stronger than しかし — it packs contrast and a hint of surprise/frustration into a single clause, letting you build complex sentences instead of always starting a new one with a connector. This clause-level compression is a hallmark of the IH→AL shift.",
    examples: [
      { jp: "あんなに頑張ったのに、結果が出なかった。", en: "Even though I tried so hard, I didn't get results." },
      { jp: "彼はお金持ちなのに、とてもけちだ。", en: "Even though he's rich, he's very stingy." },
    ],
  },
  {
    id: "g8", level: "AL", title: "~ということだ (definition / hearsay conclusion)",
    structure: "Clause + ということだ",
    explanation: "Two uses: restating/defining ('that means...') and reporting secondhand information as a conclusion. Useful for the 'summarize what you just said' move that closes an AL-level paragraph.",
    examples: [
      { jp: "つまり、彼は来月引っ越すということだ。", en: "In other words, that means he's moving next month." },
      { jp: "天気予報によると、明日は台風が来るということだ。", en: "According to the weather forecast, a typhoon is coming tomorrow." },
    ],
  },
  {
    id: "g9", level: "AL", title: "~わけだ (naturally follows / makes sense)",
    structure: "Plain form + わけだ",
    explanation: "Marks a logical conclusion the listener should now understand given what was just said — a discourse-management tool for guiding your listener through your reasoning, not just stating facts.",
    examples: [
      { jp: "彼は十年間フランスに住んでいた。だからフランス語が上手なわけだ。", en: "He lived in France for ten years. That's why (it makes sense that) his French is good." },
      { jp: "電車が止まっている。つまり、歩いて行くしかないわけだ。", en: "The trains are stopped. In other words, we have no choice but to walk." },
    ],
  },
  {
    id: "g10", level: "AL", title: "Causative ~させる",
    structure: "Verb (causative form)",
    explanation: "Needed constantly in narration involving other people — 'made someone do X' or 'let someone do X.' A narrative with only direct action verbs (I did X) sounds flat; causatives let you narrate interactions.",
    examples: [
      { jp: "先生は学生に発表させた。", en: "The teacher had the students give presentations." },
      { jp: "子供を一人で行かせるのは心配だ。", en: "I'm worried about letting my child go alone." },
    ],
  },
  {
    id: "g11", level: "AL", title: "Passive ~られる",
    structure: "Verb (passive form)",
    explanation: "Beyond textbook 'was done to' — the Japanese 迷惑受身 (adversative passive) lets you narrate something unfortunate happening to you, which is exactly the register 'complication' narratives need.",
    examples: [
      { jp: "電車の中で足を踏まれた。", en: "My foot got stepped on on the train (and it was annoying)." },
      { jp: "急に予定を変更されて困った。", en: "The schedule was suddenly changed on me, and it was a problem." },
    ],
  },
  {
    id: "g12", level: "AL", title: "~ば / ~たら nuance control",
    structure: "Conditional forms",
    explanation: "たら = sequential/one-off condition (often past-flavored); ば = general/hypothetical rule, and stacks awkwardly with volitional forms in ば. Being able to choose deliberately (not just default to たら for everything) reads as more controlled.",
    examples: [
      { jp: "駅に着いたら、電話してください。", en: "Once you get to the station, please call me." },
      { jp: "早く出発すれば、渋滞を避けられる。", en: "If you leave early, you can avoid the traffic." },
    ],
  },

  // ---- AM: nuance and elaboration ----
  {
    id: "g13", level: "AM", title: "Causative-passive ~させられる",
    structure: "Verb (causative-passive form)",
    explanation: "'Was made to do X (against my will).' One structure, entirely native-sounding way to narrate being compelled into something — replaces a clunky workaround like 'X said I had to.'",
    examples: [
      { jp: "部長に飲み会に参加させられた。", en: "I was made to attend the drinking party by my boss." },
      { jp: "満員電車で一時間も立たされた。", en: "I was forced to stand for a whole hour on a packed train." },
    ],
  },
  {
    id: "g14", level: "AM", title: "~ものの (although / despite)",
    structure: "Plain form + ものの",
    explanation: "More literary/formal than けれども — signals you acknowledge a fact fully before pivoting. Common in opinion paragraphs when conceding a counterpoint before your main claim.",
    examples: [
      { jp: "計画には賛成したものの、実行には不安がある。", en: "Although I agreed to the plan, I have concerns about carrying it out." },
      { jp: "経験は浅いものの、彼のやる気は本物だ。", en: "Although his experience is limited, his motivation is genuine." },
    ],
  },
  {
    id: "g15", level: "AM", title: "~つつ / ~つつある (while / in the process of)",
    structure: "Verb-stem + つつ(ある)",
    explanation: "つつ = doing X while doing Y (simultaneous, often contradictory); つつある = a change is currently in progress. Both let you narrate nuance and gradual shifts that plain ~ながら/~ている can't quite capture.",
    examples: [
      { jp: "悪いと知りつつ、つい言ってしまった。", en: "Knowing it was wrong, I still ended up saying it." },
      { jp: "その習慣は徐々に失われつつある。", en: "That custom is gradually being lost." },
    ],
  },
  {
    id: "g16", level: "AM", title: "~において / ~に関して (formal topic markers)",
    structure: "Noun + において・に関して",
    explanation: "Formal register substitutes for で/について — signals you can shift into a more written/formal register mid-speech, which raters read as register flexibility.",
    examples: [
      { jp: "この会議において、来年度の予算について話し合います。", en: "At this meeting, we will discuss next year's budget." },
      { jp: "その問題に関しては、まだ結論が出ていません。", en: "Regarding that issue, no conclusion has been reached yet." },
    ],
  },
  {
    id: "g17", level: "AM", title: "~ばかりに (unfortunately because of / all because)",
    structure: "Plain form + ばかりに",
    explanation: "Cause that led to a bad, often disproportionate, result — carries emotional weight (regret/frustration) that plain ~ので lacks. Perfect for 'complication' narratives.",
    examples: [
      { jp: "焦っていたばかりに、大事なファイルを送り忘れた。", en: "Just because I was in a rush, I forgot to send the important file." },
      { jp: "一言余計なことを言ったばかりに、けんかになってしまった。", en: "Just because of one unnecessary comment, it turned into a fight." },
    ],
  },
  {
    id: "g18", level: "AM", title: "~からといって〜ない (just because... doesn't mean...)",
    structure: "Plain form + からといって + negative",
    explanation: "A two-part structure for rejecting an implied overgeneralization — exactly the move Advanced opinion paragraphs need when acknowledging then refuting a counterargument.",
    examples: [
      { jp: "お金があるからといって、幸せだとは限らない。", en: "Just because you have money doesn't mean you're happy." },
      { jp: "若いからといって、体力があるわけではない。", en: "Just because someone is young doesn't mean they're physically strong." },
    ],
  },

  // ---- AH: register control and sophisticated stance ----
  {
    id: "g19", level: "AH", title: "~とはいえ (that said / even so)",
    structure: "Clause + とはいえ",
    explanation: "More formal/written-flavored than でも/しかし — a single word that concedes fully and pivots, letting you sound measured rather than blunt. AH speakers use this to soften disagreement while still making a clear point.",
    examples: [
      { jp: "在宅勤務は便利だ。とはいえ、孤独を感じる人も少なくない。", en: "Remote work is convenient. That said, quite a few people feel isolated." },
    ],
  },
  {
    id: "g20", level: "AH", title: "~にすぎない (nothing more than / merely)",
    structure: "Noun/Clause + にすぎない",
    explanation: "Diminishes a claim precisely — useful for pushing back on an argument without being aggressive ('that's merely one possibility, not the whole picture').",
    examples: [
      { jp: "それは一つの可能性にすぎない。断定はできない。", en: "That's merely one possibility. We can't say for certain." },
    ],
  },
  {
    id: "g21", level: "AH", title: "~ざるを得ない (have no choice but to)",
    structure: "Verb-nai stem (irregular for する→せざるを得ない) + ざるを得ない",
    explanation: "A formal, almost literary way of expressing reluctant compulsion — noticeably more sophisticated than しなければならない, and signals you can modulate obligation language by register.",
    examples: [
      { jp: "状況を考えると、計画を変更せざるを得ない。", en: "Given the situation, we have no choice but to change the plan." },
    ],
  },
  {
    id: "g22", level: "AH", title: "~かねない (might well / risk of)",
    structure: "Verb-stem + かねない",
    explanation: "Expresses a negative possibility with real weight — 'this could well lead to X (bad outcome).' Distinct from the neutral かもしれない; using it correctly signals precise control over nuance of risk.",
    examples: [
      { jp: "この対応を誤ると、大きな問題になりかねない。", en: "If we mishandle this, it could well turn into a serious problem." },
    ],
  },
  {
    id: "g23", level: "AH", title: "~がたい (hard to / difficult to, emotionally/morally)",
    structure: "Verb-stem + がたい",
    explanation: "More abstract/formal than ~にくい — used for things that are conceptually or morally hard to do (信じがたい, 許しがたい), not physically difficult. A precision marker of advanced vocabulary control.",
    examples: [
      { jp: "彼の言い訳は到底信じがたい。", en: "His excuse is simply hard to believe." },
    ],
  },
  {
    id: "g24", level: "AH", title: "Register switching: だ・である体 vs です・ます体",
    structure: "Plain/copula style vs. polite style, deployed deliberately",
    explanation: "The clearest Advanced High signal isn't a grammar point at all — it's controlled code-switching. AH speakers can drop into である-style for a formal aside or a definitional statement mid-conversation, then return to です・ます, on purpose, for rhetorical effect (this mirrors how native speakers quote written sources or make a point sound 'official'). Doing this by accident (mixing styles carelessly) reads as an error; doing it deliberately reads as sophistication.",
    examples: [
      { jp: "この問題については様々な意見がある。しかし、私はこう考えています。", en: "There are various opinions on this issue [formal/written-flavored]. However, I think as follows [back to polite speech register]." },
    ],
  },
];

export function grammarForLevel(levelId) {
  return GRAMMAR.filter((g) => g.level === levelId);
}
