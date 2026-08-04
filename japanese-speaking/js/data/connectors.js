// Discourse connectors (接続表現) — the core toolkit for turning sentences into paragraphs.
// Each connector includes a two-sentence example showing it stitching ideas together.
export const CATEGORIES = [
  { id: "sequence", jp: "時間・順序", en: "Sequence / Time", color: "#3b82f6" },
  { id: "addition", jp: "追加", en: "Addition", color: "#22c55e" },
  { id: "cause", jp: "理由・原因", en: "Cause / Reason", color: "#f59e0b" },
  { id: "result", jp: "結果", en: "Result / Consequence", color: "#ef4444" },
  { id: "contrast", jp: "逆接・対比", en: "Contrast / Concession", color: "#a855f7" },
  { id: "condition", jp: "条件・仮定", en: "Condition / Hypothesis", color: "#14b8a6" },
  { id: "example", jp: "例示", en: "Example / Illustration", color: "#eab308" },
  { id: "summary", jp: "まとめ・結論", en: "Summary / Conclusion", color: "#6366f1" },
  { id: "opinion", jp: "意見・立場", en: "Opinion / Stance", color: "#ec4899" },
  { id: "emphasis", jp: "強調・補足", en: "Emphasis / Aside", color: "#64748b" },
];

export const CONNECTORS = [
  // sequence
  { id: "c1", jp: "まず", reading: "mazu", en: "first / to begin with", category: "sequence", register: "neutral",
    a: "まず、朝起きてコーヒーを飲みます。", b: "そしてニュースを読みます。" },
  { id: "c2", jp: "次に", reading: "tsugi ni", en: "next", category: "sequence", register: "neutral",
    a: "資料を集めました。", b: "次に、それを整理しました。" },
  { id: "c3", jp: "それから", reading: "sorekara", en: "after that / then", category: "sequence", register: "neutral",
    a: "駅で友達に会いました。", b: "それから、一緒に映画を見に行きました。" },
  { id: "c4", jp: "その後", reading: "sono ato", en: "after that (slightly formal)", category: "sequence", register: "neutral-formal",
    a: "会議は三時に終わりました。", b: "その後、みんなで食事に行きました。" },
  { id: "c5", jp: "〜てから", reading: "~te kara", en: "after doing ~", category: "sequence", register: "neutral",
    a: "宿題を終わらせてから、ゲームをします。", b: "" },
  { id: "c6", jp: "同時に", reading: "dōji ni", en: "at the same time", category: "sequence", register: "neutral-formal",
    a: "彼は音楽を聞きながら勉強します。", b: "同時に、料理も上手にできます。" },
  { id: "c7", jp: "最後に", reading: "saigo ni", en: "finally / lastly", category: "sequence", register: "neutral",
    a: "いろいろな案を検討しました。", b: "最後に、一番安い方法を選びました。" },

  // addition
  { id: "a1", jp: "それに", reading: "sore ni", en: "besides / on top of that", category: "addition", register: "casual-neutral",
    a: "このレストランは安いです。", b: "それに、とても美味しいです。" },
  { id: "a2", jp: "その上", reading: "sono ue", en: "moreover / furthermore", category: "addition", register: "neutral-formal",
    a: "彼女は優秀な学生です。", b: "その上、とても親切です。" },
  { id: "a3", jp: "さらに", reading: "sara ni", en: "furthermore / in addition", category: "addition", register: "neutral-formal",
    a: "物価が上がっています。", b: "さらに、給料は下がっています。" },
  { id: "a4", jp: "また", reading: "mata", en: "also / additionally", category: "addition", register: "neutral",
    a: "この町には美術館があります。", b: "また、有名な公園もあります。" },
  { id: "a5", jp: "加えて", reading: "kuwaete", en: "in addition to that", category: "addition", register: "formal",
    a: "仕事が忙しいです。", b: "加えて、家族の世話もしなければなりません。" },

  // cause
  { id: "r1", jp: "なぜなら〜からだ", reading: "naze nara ~ kara da", en: "because ~ (explains a preceding claim)", category: "cause", register: "neutral-formal",
    a: "私は日本語の勉強を続けたいです。", b: "なぜなら、日本の文化にとても興味があるからです。" },
  { id: "r2", jp: "というのは〜からだ", reading: "to iu no wa ~ kara da", en: "the reason is that ~", category: "cause", register: "formal",
    a: "彼は会議に来られませんでした。", b: "というのは、急に熱が出たからです。" },
  { id: "r3", jp: "〜ので", reading: "~ node", en: "since / because (softer, connects clauses)", category: "cause", register: "neutral",
    a: "雨が降っているので、傘を持って行きます。", b: "" },
  { id: "r4", jp: "その理由は〜だ", reading: "sono riyū wa ~ da", en: "the reason for that is ~", category: "cause", register: "formal",
    a: "留学を決めました。", b: "その理由は、現地でしか学べないことがあると思ったからです。" },

  // result
  { id: "s1", jp: "それで", reading: "sorede", en: "so / because of that (spoken)", category: "result", register: "casual-neutral",
    a: "終電を逃してしまいました。", b: "それで、タクシーで帰りました。" },
  { id: "s2", jp: "その結果", reading: "sono kekka", en: "as a result", category: "result", register: "neutral-formal",
    a: "毎日練習を続けました。", b: "その結果、大会で優勝することができました。" },
  { id: "s3", jp: "したがって", reading: "shitagatte", en: "therefore (formal/written)", category: "result", register: "formal",
    a: "この製品はコストが高いです。", b: "したがって、価格を見直す必要があります。" },
  { id: "s4", jp: "そのため", reading: "sono tame", en: "because of that / for that reason", category: "result", register: "neutral-formal",
    a: "台風が近づいています。", b: "そのため、電車が止まる可能性があります。" },
  { id: "s5", jp: "だから", reading: "dakara", en: "so (casual)", category: "result", register: "casual",
    a: "明日は試験がある。", b: "だから、今日は早く寝るつもりだ。" },

  // contrast
  { id: "k1", jp: "しかし", reading: "shikashi", en: "however", category: "contrast", register: "neutral-formal",
    a: "計画は完璧に見えました。", b: "しかし、実行するのは簡単ではありませんでした。" },
  { id: "k2", jp: "でも", reading: "demo", en: "but (casual)", category: "contrast", register: "casual",
    a: "頑張って勉強した。", b: "でも、思ったより点数が低かった。" },
  { id: "k3", jp: "ところが", reading: "tokoroga", en: "however, unexpectedly (narrative twist)", category: "contrast", register: "neutral",
    a: "早く着くつもりで家を出ました。", b: "ところが、電車が事故で止まってしまいました。" },
  { id: "k4", jp: "けれども", reading: "keredomo", en: "although / but (slightly formal)", category: "contrast", register: "neutral-formal",
    a: "彼の意見にはある程度賛成です。", b: "けれども、全て正しいとは思いません。" },
  { id: "k5", jp: "それにもかかわらず", reading: "sore ni mo kakawarazu", en: "despite that / nevertheless", category: "contrast", register: "formal",
    a: "何度も注意を受けていました。", b: "それにもかかわらず、彼は同じミスを繰り返しました。" },
  { id: "k6", jp: "一方で", reading: "ippō de", en: "on the other hand", category: "contrast", register: "neutral-formal",
    a: "都会の生活は便利です。", b: "一方で、自然と触れ合う機会は少ないです。" },
  { id: "k7", jp: "それに対して", reading: "sore ni taishite", en: "in contrast to that", category: "contrast", register: "formal",
    a: "兄はとても社交的です。", b: "それに対して、弟は静かで内向的です。" },

  // condition
  { id: "h1", jp: "もし〜たら", reading: "moshi ~ tara", en: "if ~ (hypothetical)", category: "condition", register: "neutral",
    a: "もし時間があったら、もっと旅行したいです。", b: "" },
  { id: "h2", jp: "〜ば", reading: "~ ba", en: "if ~ (conditional form)", category: "condition", register: "neutral-formal",
    a: "早く出発すれば、渋滞を避けられるでしょう。", b: "" },
  { id: "h3", jp: "たとえ〜ても", reading: "tatoe ~ temo", en: "even if ~", category: "condition", register: "neutral-formal",
    a: "たとえ失敗しても、諦めずに挑戦し続けるつもりです。", b: "" },

  // example
  { id: "e1", jp: "たとえば", reading: "tatoeba", en: "for example", category: "example", register: "neutral",
    a: "日本には独特な習慣がたくさんあります。", b: "たとえば、家に入る前に靴を脱ぐことです。" },
  { id: "e2", jp: "具体的に言うと", reading: "gutaiteki ni iu to", en: "to be specific / concretely speaking", category: "example", register: "formal",
    a: "この地域は高齢化が進んでいます。", b: "具体的に言うと、住民の三分の一が六十五歳以上です。" },
  { id: "e3", jp: "例を挙げると", reading: "rei o ageru to", en: "to give an example", category: "example", register: "neutral-formal",
    a: "オンライン学習には利点があります。", b: "例を挙げると、自分のペースで進められる点です。" },

  // summary
  { id: "m1", jp: "つまり", reading: "tsumari", en: "in other words / in short", category: "summary", register: "neutral",
    a: "彼はいつも遅刻して、連絡もしません。", b: "つまり、責任感が足りないということです。" },
  { id: "m2", jp: "要するに", reading: "yō suru ni", en: "in short / to sum up", category: "summary", register: "neutral-formal",
    a: "予算も時間も足りません。", b: "要するに、この計画は現実的ではありません。" },
  { id: "m3", jp: "このように", reading: "kono yō ni", en: "in this way / as shown", category: "summary", register: "formal",
    a: "以上、三つの理由を説明しました。", b: "このように、環境問題は私たち一人一人の課題です。" },
  { id: "m4", jp: "結論として", reading: "ketsuron toshite", en: "in conclusion", category: "summary", register: "formal",
    a: "様々な意見を検討しました。", b: "結論として、この案が最も現実的だと思います。" },

  // opinion
  { id: "o1", jp: "私の考えでは", reading: "watashi no kangae dewa", en: "in my opinion", category: "opinion", register: "formal",
    a: "私の考えでは、テクノロジーは人と人の距離を縮めることも遠ざけることもあります。", b: "" },
  { id: "o2", jp: "〜と思う", reading: "~ to omou", en: "I think that ~", category: "opinion", register: "neutral",
    a: "この問題はもっと議論されるべきだと思います。", b: "" },
  { id: "o3", jp: "個人的には", reading: "kojinteki ni wa", en: "personally", category: "opinion", register: "neutral-formal",
    a: "個人的には、リモートワークの方が生産性が上がると感じています。", b: "" },

  // emphasis
  { id: "z1", jp: "実は", reading: "jitsu wa", en: "actually / in fact", category: "emphasis", register: "neutral",
    a: "彼は自信満々に見えました。", b: "実は、とても緊張していたそうです。" },
  { id: "z2", jp: "もちろん", reading: "mochiron", en: "of course", category: "emphasis", register: "neutral",
    a: "もちろん、努力すれば必ず結果が出るとは限りません。", b: "しかし、努力なしに結果が出ることもありません。" },
  { id: "z3", jp: "特に", reading: "tokuni", en: "especially / in particular", category: "emphasis", register: "neutral",
    a: "夏は観光客が多いです。", b: "特に、七月と八月は非常に混雑します。" },
];
