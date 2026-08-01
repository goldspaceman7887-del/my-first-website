// Same prompt, answered at 4 ACTFL sublevels, so you can hear exactly what changes
// as you move from where you are now toward Advanced High.
export const LEVEL_EXAMPLES = [
  {
    id: "le1",
    topic: "週末は何をしましたか",
    topicEn: "What did you do this weekend?",
    functionId: "narrate-past",
    tiers: {
      IH: {
        jp: "週末は友達と映画を見ました。それから、レストランでご飯を食べました。楽しかったです。",
        en: "This weekend I watched a movie with a friend. After that, I ate at a restaurant. It was fun.",
        notes: ["3 short, largely independent sentences", "Only one connector (それから)", "No complication, no elaboration — just a list of events"],
      },
      AL: {
        jp: "土曜日に友達と映画を見に行きました。それから、近くのレストランでご飯を食べに行きましたが、とても混んでいて、四十分ぐらい待たなければなりませんでした。それでも、料理は美味しかったので満足でした。",
        en: "On Saturday I went to see a movie with a friend. After that, we went to eat at a nearby restaurant, but it was very crowded, so we had to wait about forty minutes. Even so, the food was delicious, so I was satisfied.",
        notes: ["Adds a small complication (the wait) and a result connector (それでも)", "Sustains 3 linked sentences instead of a list", "Still fairly linear — one thread, no elaboration"],
      },
      AM: {
        jp: "土曜日は、久しぶりに友達と映画を見に行きました。そのあと、近くのレストランに入ろうとしたのですが、思ったより混んでいたばかりに、四十分ほど待たされてしまいました。ただ、待っている間に友達といろいろ話せたので、それはそれで良かったです。結局、料理も美味しかったし、良い一日になりました。",
        en: "On Saturday, I went to see a movie with a friend for the first time in a while. After that, we tried to go into a nearby restaurant, but because it was more crowded than expected, we ended up having to wait about forty minutes. Still, since we got to talk about various things while waiting, that turned out to be nice in its own way. In the end, the food was delicious too, so it became a good day.",
        notes: ["Uses ~ばかりに (unfortunate cause) and the adversative passive 待たされて", "Reframes the complication positively (それはそれで良かった) — elaboration, not just narration", "Closes with a summarizing conclusion (結局〜良い一日になりました)"],
      },
      AH: {
        jp: "土曜日は、久しぶりに友達と映画を見に行くことにしました。映画自体はとても良かったのですが、そのあとレストランに入ろうとしたところ、予約なしでは入れないと言われてしまいまして。**とはいえ**、近くに別の店を見つけて、結果的にはそちらの方が美味しかったので、かえって良かったかもしれません。こうしたちょっとした予定変更があっても、案外いい思い出になるものだと感じました。",
        en: "On Saturday, I decided to go see a movie with a friend for the first time in a while. The movie itself was very good, but when we tried to go into a restaurant afterward, we were told we couldn't get in without a reservation. That said, we found a different place nearby, and it ended up being tastier, so it might have actually worked out for the better. I felt that even a small change of plans like this can, surprisingly, turn into a good memory.",
        notes: ["Mid-narrative register shift: まして (formal/humble narrative flavor) mixed with です・ます — deliberate, not accidental", "とはいえ instead of でも — more measured concession", "Closes with a generalized reflective statement (ものだと感じました) — moving from narration to insight, a hallmark AH move"],
        grammarIds: ["g37"],
      },
    },
  },
  {
    id: "le2",
    topic: "引っ越しで大変だったこと",
    topicEn: "Something difficult about a time you moved",
    functionId: "complication",
    tiers: {
      IH: {
        jp: "先月、引っ越しをしました。荷物がたくさんあって、大変でした。友達が手伝ってくれました。",
        en: "Last month I moved. There was a lot of luggage, and it was hard. A friend helped me.",
        notes: ["Facts stated in isolation", "No cause-effect language", "'大変でした' does all the emotional work with no elaboration"],
      },
      AL: {
        jp: "先月、引っ越しをしましたが、業者が予定より二時間も遅れて来たので、その日は予定が全部狂ってしまいました。それで、友達に急いで手伝いに来てもらいました。おかげで何とか終わりましたが、本当に疲れました。",
        en: "Last month I moved, but the movers arrived two hours later than scheduled, so my whole day's plans were thrown off. So I had a friend rush over to help. Thanks to that, we somehow finished, but I was really exhausted.",
        notes: ["A real complication (movers late) drives the narrative", "Cause-result chain: ので → それで → おかげで", "Still mostly chronological, one complication only"],
      },
      AM: {
        jp: "先月引っ越しをしたのですが、業者が予定より二時間も遅れてきたばかりに、その日組んでいたスケジュールが全部狂ってしまいました。しかも、エレベーターが故障中で、大きな荷物を階段で運ばなければならず、正直かなり参りました。とはいえ、急遽駆けつけてくれた友人のおかげで、何とか予定通りに近い形で終えることができました。",
        en: "I moved last month, but just because the movers arrived two hours late, my whole schedule for that day got thrown off. What's more, the elevator was out of order, so we had to carry the big luggage up the stairs by hand, and honestly it wore me down. Even so, thanks to a friend who rushed over to help, we managed to finish in something close to the planned time.",
        notes: ["Two stacked complications (しかも adds a second problem) instead of one", "~ばかりに and ~なければならず show precise cause/obligation nuance", "とはいえ pivots into resolution — clear 3-part structure: problem → escalation → recovery"],
      },
      AH: {
        jp: "先月の引っ越しは、正直かなり手こずりました。業者が二時間も遅刻してきたうえに、当日に限ってエレベーターが点検中だったものですから、大きな家具を全部階段で**運ばざるを得ませんでした**。あの時は正直、誰かに愚痴の一つもこぼしたくなりましたが、駆けつけてくれた友人たちのおかげで、何とか乗り切ることができました。振り返ってみると、ああいう予期せぬトラブルほど、人のありがたみを**実感させられる**ものはないのかもしれません。",
        en: "Honestly, last month's move gave me quite a lot of trouble. On top of the movers being two hours late, of all days the elevator happened to be under inspection, so we had no choice but to carry all the big furniture up the stairs. At the time, I honestly felt like venting to someone, but thanks to the friends who rushed over, I somehow managed to get through it. Looking back, I think there's nothing quite like an unexpected problem like that to make you truly appreciate the people around you.",
        notes: ["ざるを得ませんでした = sophisticated reluctant-obligation, not just なければなりません", "ものですから (formal causal) varies register from the surrounding です・ます", "Ends on a generalized, almost aphoristic reflection (〜させられるものはないのかもしれません) — abstraction beyond the story itself, a strong AH marker"],
        grammarIds: ["g39", "g21"],
      },
    },
  },
  {
    id: "le3",
    topic: "都会と田舎、どちらに住みたいですか",
    topicEn: "Would you rather live in the city or the countryside?",
    functionId: "compare",
    tiers: {
      IH: {
        jp: "私は都会に住みたいです。便利だからです。田舎は不便だと思います。",
        en: "I want to live in the city. Because it's convenient. I think the countryside is inconvenient.",
        notes: ["Opinion + one bare reason, no development", "Second claim about the countryside is just asserted, not explained", "No comparison structure, just two separate statements"],
      },
      AL: {
        jp: "私は都会に住みたいです。なぜなら、交通が便利で、仕事の選択肢も多いからです。田舎は自然が多くて良いところもありますが、車がないと生活しにくいと聞いたことがあります。",
        en: "I want to live in the city. Because transportation is convenient and there are more job options. The countryside has a lot of nature and good points too, but I've heard it's hard to live without a car.",
        notes: ["Gives two reasons instead of one, using なぜなら〜から", "Acknowledges the countryside has merits before dismissing them", "Still one-directional — doesn't really weigh both sides against each other"],
      },
      AM: {
        jp: "難しい質問ですが、今のところは都会に住みたいと思っています。というのも、交通の便が良く、仕事や趣味の選択肢が圧倒的に多いからです。一方で、田舎には自然の豊かさや人とのつながりの近さといった魅力があることも理解しています。ただ、車を持たない私にとっては、生活の面でハードルが高いのではないかと感じています。",
        en: "It's a difficult question, but for now I think I'd like to live in the city. That's because public transportation is good, and there are overwhelmingly more options for work and hobbies. On the other hand, I do understand that the countryside has its own appeal, like rich nature and closer human connections. However, for someone like me who doesn't own a car, I feel like it would raise the bar in terms of daily life.",
        notes: ["Genuine two-sided comparison: 一方で explicitly weighs the countryside's merits", "というのも (more elaborated than なぜなら) plus a personal-condition caveat (車を持たない私にとっては)", "Hedges with 今のところは / のではないかと感じています — controlled uncertainty, not blunt certainty"],
      },
      AH: {
        jp: "正直なところ、どちらか一方に決め切れないというのが本音です。都会には利便性や仕事の選択肢の多さという明らかな強みがありますが、それは同時に、人との距離が希薄になりがちだという側面も持ち合わせています。それに対して、田舎の暮らしは不便さと隣り合わせであるものの、地域のつながりの濃さという、都会では**得がたい**ものを与えてくれます。結局のところ、どちらが優れているというより、その人がその時々の人生において何を優先するかという話に尽きるのではないでしょうか。",
        en: "Honestly, the truth is I can't fully decide on just one. The city has clear strengths like convenience and abundant job options, but at the same time, it also carries the aspect of relationships with people tending to become thin. In contrast, life in the countryside goes hand-in-hand with inconvenience, but it offers something hard to obtain in the city: the density of community ties. In the end, I think it's less a matter of which is superior, and more a question of what a person prioritizes at that stage of their life.",
        notes: ["Opens by refusing a simple binary answer — a sophisticated rhetorical stance, not just 'both have good points'", "それと同時に / それに対して build a tight two-sided structure holding both sides in tension", "得がたい (~がたい) and 尽きるのではないでしょうか close with precise, formal vocabulary and a soft rhetorical-question conclusion typical of AH argumentation"],
        grammarIds: ["g41", "g22"],
      },
    },
  },
  {
    id: "le4",
    topic: "リモートワークについてどう思いますか",
    topicEn: "What do you think about remote work?",
    functionId: "opinion",
    tiers: {
      IH: {
        jp: "リモートワークはいいと思います。通勤しなくていいからです。家で仕事ができます。",
        en: "I think remote work is good. Because you don't have to commute. You can work from home.",
        notes: ["Opinion, one reason, one restated fact — three disconnected sentences", "No counterpoint, no example"],
      },
      AL: {
        jp: "私はリモートワークに賛成です。通勤時間がなくなるので、その分の時間を家族や趣味に使えます。ただ、家だと集中できない人もいると聞いたことがあります。",
        en: "I'm in favor of remote work. Since commute time disappears, you can use that time for family or hobbies. However, I've heard some people can't concentrate at home.",
        notes: ["One reason + one acknowledged counterpoint (ただ)", "Reason is elaborated slightly (その分の時間を...) rather than left bare"],
      },
      AM: {
        jp: "私はリモートワークに賛成の立場です。まず、通勤時間がなくなることで、その時間を家族や自己投資に充てられるという利点があります。もちろん、家では集中しづらい、あるいはチームとの一体感が薄れるという意見があるのも事実です。しかし、オンラインツールをうまく使えば、そうした問題はある程度解消できるのではないかと思います。",
        en: "My position is in favor of remote work. First, there's the benefit that by eliminating commute time, that time can be devoted to family or self-investment. Of course, it's also true that some argue it's hard to concentrate at home, or that team cohesion weakens. However, I think that if online tools are used well, those problems can be resolved to some extent.",
        notes: ["Formal opinion opener (〜の立場です) plus まず to signal structured reasoning", "Full concede-then-rebut structure: もちろん... 事実です → しかし...", "Hedged conclusion (解消できるのではないかと思います) instead of a blunt claim"],
      },
      AH: {
        jp: "個人的には、リモートワークには賛成ですが、無条件に賛成というわけではありません。通勤の負担がなくなり、生産性が上がるという声が多いのは事実ですし、私自身もそれを実感しています。**とはいえ**、対面でのちょっとした雑談から生まれるアイデアや、新人が先輩の仕事ぶりを間近で見て学ぶ機会が**失われかねない**という懸念も無視できません。要するに、リモートワークを導入するかどうかではなく、どのような業務にはリモートが向き、どのような業務には対面が欠かせないのかを、企業ごとに見極める必要があるのだと思います。",
        en: "Personally, I'm in favor of remote work, but that doesn't mean I'm unconditionally in favor of it. It's true that many voices say the burden of commuting disappears and productivity rises, and I myself feel that too. That said, the concern that ideas born from casual in-person chats, or the opportunity for new employees to learn up close by watching senior colleagues work, could well be lost is also not something to ignore. In short, I think the question isn't whether to introduce remote work or not, but rather that each company needs to determine which tasks suit remote work and which absolutely require being in person.",
        notes: ["Opens by immediately complicating a simple yes/no stance (賛成ですが、無条件に賛成というわけではありません) — refuses to oversimplify", "~かねない used precisely for a real but not certain risk", "要するに reframes the entire question at a higher level of abstraction instead of just summarizing — a distinctly AH move"],
        grammarIds: ["g37", "g40"],
      },
    },
  },
  {
    id: "le5",
    topic: "もし転職するとしたら、何を大事にしますか",
    topicEn: "If you were to change jobs, what would matter most to you?",
    functionId: "hypothetical",
    tiers: {
      IH: {
        jp: "もし転職するなら、給料が高い仕事がいいです。休みも多い方がいいです。",
        en: "If I changed jobs, I'd want one with a high salary. I'd also want more time off.",
        notes: ["Two flat preferences listed, no reasoning or hypothetical development"],
      },
      AL: {
        jp: "もし転職するとしたら、給料はもちろん大事ですが、それ以上に働きやすい環境を重視すると思います。前の職場は人間関係が大変だったので、次はそういう会社を選びたいです。",
        en: "If I were to change jobs, salary is of course important, but I think I'd prioritize a comfortable working environment even more. My previous workplace had difficult relationships, so next time I want to choose a company like that (a comfortable one).",
        notes: ["Ranks priorities (salary vs. environment) instead of just listing", "Brings in a real past reason to justify the hypothetical preference"],
      },
      AM: {
        jp: "もし転職するとしたら、給料よりも働きやすさを重視すると思います。以前の職場では、人間関係のストレスで体調を崩しかけたことがあったので、それ以来、環境の良さを何より大事にするようになりました。もちろん、生活のためにある程度の収入は必要ですが、それさえ満たされていれば、あとは無理なく長く続けられるかどうかを基準に選びたいです。",
        en: "If I were to change jobs, I think I'd prioritize a comfortable working environment over salary. At my previous workplace, I nearly made myself sick from relationship stress, and ever since then, I've come to value a good environment above all else. Of course, a certain amount of income is necessary for living, but as long as that's met, I'd want to choose based on whether I can keep doing it comfortably and long-term.",
        notes: ["~かけた (nearly did X) adds narrative precision to the backstory", "それ以来〜ようになった shows a change-of-state connected to a past event, not just a static preference", "Sets a clear conditional priority order (income as a floor, then environment as the real criterion)"],
      },
      AH: {
        jp: "もし今後転職するとしたら、正直、給料の優先順位はそれほど高くありません。以前、人間関係のストレスで体調を崩しかけた経験があり、そのとき初めて、お金では取り戻せないものがあるのだと**痛感させられました**。**とはいえ**、収入をまったく考慮しないというのも現実的ではないので、最低限の生活を維持できる水準さえ確保できれば、あとは裁量権の大きさや、長期的に成長を実感できる環境かどうかを基準に判断したいと考えています。",
        en: "If I were to change jobs in the future, honestly, salary isn't that high a priority for me. I once nearly made myself sick from relationship stress, and it was then that I was made to keenly realize there are things money can't get back. That said, ignoring income entirely isn't realistic either, so as long as I can secure a level that maintains a minimum standard of living, I'd want to judge based on how much discretion I'm given and whether it's an environment where I can feel long-term growth.",
        notes: ["痛感させられました — causative-passive used for emotional impact, not just physical compulsion", "とはいえ prevents the stance from sounding naively idealistic — self-aware qualification", "Ends with two concrete, weighed criteria (裁量権 / 成長を実感できる環境) rather than a vague restatement — specificity is an AH marker"],
        grammarIds: ["g21", "g37"],
      },
    },
  },
  {
    id: "le6",
    topic: "日本語学習で苦労していることは何ですか",
    topicEn: "What's difficult for you in learning Japanese?",
    functionId: "describe-present",
    tiers: {
      IH: {
        jp: "漢字が難しいです。敬語も難しいです。もっと勉強しなければなりません。",
        en: "Kanji is difficult. Keigo is also difficult. I have to study more.",
        notes: ["Three flat statements, no elaboration on why or how these are difficult"],
      },
      AL: {
        jp: "一番苦労しているのは敬語です。友達と話すときは問題ないのですが、フォーマルな場面になると、とっさに正しい形が出てこないことが多いです。それで、最近は敬語の本を読んで勉強しています。",
        en: "What I struggle with most is keigo. There's no problem when I talk with friends, but in formal situations, I often can't come up with the correct form on the spot. So lately I've been studying by reading a keigo book.",
        notes: ["Narrows to one specific weak point instead of listing several", "Explains the specific failure mode (とっさに出てこない) and what they're doing about it"],
      },
      AM: {
        jp: "一番苦労しているのは、実は文法よりも、状況に応じて話し方を切り替えることです。友達との会話なら問題なく話せるのですが、目上の人と話すとなると、頭では敬語のルールが分かっていても、いざその場になると自然に出てこないことがよくあります。おそらく、知識としては持っていても、実際に使う練習が足りていないのだと思います。それで最近は、あえて丁寧な場面を想定した会話練習を取り入れるようにしています。",
        en: "What I struggle with most is actually not grammar itself, but switching my way of speaking depending on the situation. I can speak without problems in conversations with friends, but when it comes to talking with someone senior, even though I understand the keigo rules in my head, it often doesn't come out naturally when I'm actually in that moment. I think it's probably that even though I have the knowledge, I lack practice actually using it. So lately, I've been deliberately incorporating conversation practice that assumes formal situations.",
        notes: ["Reframes the problem at a more abstract level (状況に応じて話し方を切り替えること) rather than just naming a topic like '敬語'", "Diagnoses the root cause (知識はあるが練習不足) instead of just describing the symptom", "Describes a specific, ongoing remedy — shows self-directed learning strategy, not just 'I need to study more'"],
      },
      AH: {
        jp: "文法や語彙そのものより、今も苦労しているのは、相手や場面に応じて自然にレジスタ―を切り替えることです。友人との会話では特に意識せず話せるのですが、フォーマルな場になると、敬語の知識はあっても、それを瞬時に、しかも不自然にならない形で運用するのが難しいと感じています。頭で分かっていることと、実際に口から出てくることの間には、まだ埋めきれない差があるというのが正直なところです。ただ、これは単なる語彙や文法の問題というより、その言語文化における立ち居振る舞いそのものを体に染み込ませる必要がある領域なのだと考えるようになりました。だからこそ、最近はあえて日本語話者だけの場に身を置き、失敗を重ねながら感覚を掴もうとしています。",
        en: "More than grammar or vocabulary themselves, what I still struggle with is naturally switching register depending on the person and situation. In conversations with friends I can speak without really thinking about it, but in formal settings, even though I have the knowledge of keigo, I find it difficult to deploy it instantly and in a way that doesn't sound unnatural. Honestly, there's still a gap that I haven't been able to fully close between what I understand in my head and what actually comes out of my mouth. That said, I've come to think this isn't simply a matter of vocabulary or grammar, but a domain where you need to let the comportment itself, within that language's culture, sink into your body. That's exactly why lately I've been deliberately putting myself in spaces with only Japanese speakers, trying to grasp the feel of it through repeated failure.",
        notes: ["Names the abstract skill (register-switching, 立ち居振る舞い) rather than a grammar topic — meta-level self-analysis is a strong AH signal", "頭で分かっていることと、実際に口から出てくることの間には〜差がある — a genuinely reflective, almost philosophical framing of the struggle", "Closes with a concrete, deliberate strategy stated with conviction (だからこそ〜掴もうとしています), not a vague intention"],
        grammarIds: [],
      },
    },
  },
  {
    id: "le7",
    topic: "日本語を勉強し始めたきっかけは何ですか",
    topicEn: "What made you start learning Japanese?",
    functionId: "narrate-past",
    tiers: {
      IH: {
        jp: "日本のアニメが好きです。それで、日本語を勉強し始めました。今も勉強しています。",
        en: "I like Japanese anime. So I started studying Japanese. I'm still studying now.",
        notes: ["Three short flat statements", "Only one connector (それで)", "No elaboration on the actual motivation"],
      },
      AL: {
        jp: "高校生の時、日本のアニメをよく見ていました。それがきっかけで、日本語に興味を持つようになりました。それから、大学で日本語の授業を取り始めました。",
        en: "When I was in high school, I used to watch a lot of Japanese anime. That became the reason I got interested in Japanese. After that, I started taking Japanese classes in college.",
        notes: ["Adds a specific time frame (高校生の時) and a change-of-state (~ようになりました)", "Sustains 3 linked sentences with a clear cause-to-action chain", "Still purely chronological, no reflection"],
      },
      AM: {
        jp: "きっかけは高校生の時に見たアニメなのですが、最初はただ楽しんで見ていただけでした。ところが、字幕なしで理解したいと思うようになり、それが本格的に勉強を始める動機になりました。今振り返ると、あの頃の単純な興味が、まさかここまで続くとは思っていませんでした。",
        en: "The trigger was anime I watched in high school, but at first I was just enjoying it for fun. However, I came to want to understand it without subtitles, and that became the real motivation to start studying seriously. Looking back now, I never thought that simple interest back then would continue this far.",
        notes: ["ところが marks a turning point mid-narrative, not just そして", "~ようになり shows the shift from passive enjoyment to active motivation", "Closes with a reflective aside (今振り返ると) instead of just ending the story"],
      },
      AH: {
        jp: "きっかけ自体は高校生の頃に見ていたアニメという、ごくありふれたものの、それをただの趣味で終わらせなかったのは、字幕への違和感がどうしても拭えなかった**からにほかなりません**。翻訳された言葉と、画面の向こうで実際に話されている言葉の間には、**埋めがたい**ずれがあるように感じられ、それが逆に強い原動力になったのです。今の実力はまだ**道半ばであるものの**、あの頃感じた小さな違和感が、結果的に今の自分を形作っているのだと思うと、不思議な気持ちになります。",
        en: "The trigger itself was something quite ordinary — anime I watched in high school — but the reason I didn't let it end as just a hobby is nothing other than the fact that I could never quite shake off a sense of discomfort with the subtitles. It felt like there was a gap, hard to fully bridge, between the translated words and what was actually being said on screen, and that, ironically, became a powerful driving force. Even though my current ability is still only halfway there, it's a strange feeling to think that the small discomfort I felt back then ended up shaping who I am now.",
        notes: ["にほかならない makes a confident, formal causal claim instead of a plain because-clause", "埋めがたい (~がたい) — precise, literary word choice for 'a gap hard to close'", "ものの concedes the ordinary starting point before pivoting to what made it different — a genuinely AH structural move, not just more vocabulary"],
        grammarIds: ["g32", "g41", "g22"],
      },
    },
  },
  {
    id: "le8",
    topic: "大切な物をなくしてしまった経験について話してください",
    topicEn: "Talk about a time you lost something important.",
    functionId: "complication",
    tiers: {
      IH: {
        jp: "前に財布をなくしました。とても心配でした。でも、後で見つかりました。",
        en: "I lost my wallet before. I was very worried. But I found it later.",
        notes: ["Bare facts, no detail about how or where", "でも is the only connector", "No description of the search or the emotional arc"],
      },
      AL: {
        jp: "去年、電車の中で財布をなくしてしまいました。中に大事なカードが入っていたので、とても心配になりました。それで、駅員さんに相談したら、次の日に見つかりました。",
        en: "Last year, I lost my wallet on the train. Since there was an important card inside, I got very worried. So I consulted with a station employee, and it was found the next day.",
        notes: ["Adds a specific cause for the worry (大事なカードが入っていた)", "それで connects the problem to the action taken", "Still a single clean thread with no real complication in the search itself"],
      },
      AM: {
        jp: "去年、電車の中で財布をなくしたことがあります。気づいたのは家に着いてからだったので、慌てて駅に電話をかけたのですが、その日はまだ届いていないと言われてしまいました。一晩中心配で眠れませんでしたが、次の日、無事に届いていると連絡があり、心から安心しました。",
        en: "Last year, I had the experience of losing my wallet on the train. I didn't notice until I got home, so I frantically called the station, but I was told it hadn't been turned in yet that day. I couldn't sleep all night from worry, but the next day, I got a call saying it had safely arrived, and I felt truly relieved.",
        notes: ["~たことがある frames it as a notable life experience, not just a report", "Adds a real complication (まだ届いていない) before the resolution", "一晩中心配で眠れませんでした adds emotional texture, not just events"],
      },
      AH: {
        jp: "去年、電車内に財布を置き忘れたことがあるのですが、あの時ほど自分の不注意を悔やんだことはありません。気づいたのは家に着いてからで、慌てて駅に**問い合わせたばかりに**、逆に気持ちばかり焦ってしまい、要領を得ない説明をしてしまったほどです。結局、その日は何の情報も得られないまま**一晩過ごすことなく**、深夜になって駅から折り返しの連絡がありました。あの**経験のあげく**、今では貴重品には必ず名前と連絡先を貼るようにしています。",
        en: "Last year I have the experience of leaving my wallet behind on a train, and I've never regretted my own carelessness as much as I did then. I didn't notice until I got home, and just because I frantically called the station, I ended up getting so flustered that I gave a confusing, hard-to-follow explanation. In the end, I didn't spend the whole night without any information at all — late that night, I got a callback from the station. After all that experience, I now make sure to put my name and contact information on anything valuable.",
        notes: ["ばかりに again, but now stacked with a second consequence (要領を得ない説明) — cause leading to an unintended side effect, not just the main problem", "~ことなく negates an expected narrative beat (spending the whole night with no news) for dramatic effect", "あげく frames the whole ordeal as culminating in a lasting behavior change — narration turning into a concrete lesson, a hallmark AH close"],
        grammarIds: ["g25", "g30", "g29"],
      },
    },
  },
  {
    id: "le9",
    topic: "AIが仕事を奪うことについてどう思いますか",
    topicEn: "What do you think about AI taking away jobs?",
    functionId: "opinion",
    tiers: {
      IH: {
        jp: "AIは便利だと思います。でも、仕事がなくなるのは心配です。",
        en: "I think AI is convenient. But I'm worried jobs will disappear.",
        notes: ["Two disconnected claims", "No reasoning or examples", "でも does minimal work — just a bare contrast"],
      },
      AL: {
        jp: "AIが仕事を奪うという意見をよく聞きますが、私は少し違う考えを持っています。確かに一部の仕事はなくなるかもしれませんが、新しい仕事も生まれると思います。",
        en: "I often hear the opinion that AI will take away jobs, but I have a slightly different view. It's true that some jobs might disappear, but I think new jobs will also be created.",
        notes: ["確かに...が structure introduces a counterpoint before the main claim", "One elaborated reason instead of a bare assertion", "Still fairly general — no concrete example"],
      },
      AM: {
        jp: "AIが仕事を奪うという意見をよく耳にしますが、個人的には、なくなる仕事があるからといって、それがすぐに悪いことだとは限らないと思っています。例えば、単純な作業はAIに任せて、人間はより創造的な仕事に集中できるようになるかもしれません。もちろん、変化の途中では混乱も生じるでしょうが、長期的にはプラスに働く可能性もあると思います。",
        en: "I often hear the opinion that AI will take away jobs, but personally, I don't think the fact that some jobs will disappear necessarily means that's immediately a bad thing. For example, simple tasks could be left to AI, allowing humans to focus on more creative work. Of course, there will likely be confusion during the transition, but I think there's also a possibility it will work out positively in the long term.",
        notes: ["からといって〜とは限らない rejects the implied overgeneralization directly", "たとえば grounds the abstract claim in one concrete scenario", "もちろん...が concedes a real cost (混乱) before restating the position — genuine two-sided reasoning"],
      },
      AH: {
        jp: "AIが仕事を奪うという議論はもはや目新しいものではありませんが、個人的には、なくなる仕事の数字ばかりが独り歩きしているように感じています。単純作業が**代替されるからといって**、それがそのまま失業を意味するわけではなく、多くの場合、業務内容そのものが**再定義されるにすぎない**のではないでしょうか。**とはいえ**、この変化に対応できる人とできない人の間に、新たな格差が**生まれかねない**という点は、楽観視できない現実だと思います。",
        en: "The debate about AI taking away jobs is no longer anything new, but personally, I feel like the numbers about disappearing jobs are taking on a life of their own. Just because simple tasks get replaced doesn't mean that straightforwardly translates to unemployment — in many cases, isn't it merely that the nature of the work itself gets redefined? That said, the point that a new gap could well emerge between people who can adapt to this change and those who can't is a reality that can't be optimistically dismissed.",
        notes: ["にすぎない cuts the scale of the claim down precisely ('merely redefined,' not eliminated)", "からといって〜わけではなく rejects the popular framing with real precision", "とはいえ pivots to a genuine, unresolved concern instead of a tidy conclusion — models real ambivalence, a hallmark of AH argumentation"],
        grammarIds: ["g38", "g26", "g37", "g40"],
      },
    },
  },
  {
    id: "le10",
    topic: "もし日本の首相だったら、何を変えますか",
    topicEn: "If you were the Prime Minister of Japan, what would you change?",
    functionId: "hypothetical",
    tiers: {
      IH: {
        jp: "もし首相だったら、税金を安くしたいです。それから、給料を上げたいです。",
        en: "If I were Prime Minister, I'd want to lower taxes. And I'd want to raise salaries.",
        notes: ["Two flat wishes with no reasoning", "それから is the only connector", "No sense of feasibility or trade-off"],
      },
      AL: {
        jp: "もし日本の首相だったら、まず子育て世代への支援を増やしたいです。少子化が進んでいるので、経済的な負担を減らすことが大切だと思うからです。",
        en: "If I were the Prime Minister of Japan, first I'd want to increase support for families raising children. Since the birthrate is declining, I think reducing the economic burden is important.",
        notes: ["Names one specific priority instead of a wish list", "ので gives a real reason tied to a broader trend (少子化)", "Still a single simple claim-plus-reason, no complication"],
      },
      AM: {
        jp: "もし日本の首相だったら、少子化対策に一番力を入れると思います。子育てにお金がかかりすぎることが大きな原因の一つだと言われているので、教育費や医療費の負担を減らす政策を進めたいです。ただ、財源をどこから確保するかという問題もあるので、簡単には実現できないだろうとも思います。",
        en: "If I were the Prime Minister of Japan, I think I'd focus most on measures against the declining birthrate. Since it's said that the cost of raising children being too high is one major cause, I'd want to push forward policies that reduce the burden of education and medical costs. However, there's also the problem of where to secure the funding, so I also think it wouldn't be easy to actually achieve.",
        notes: ["Backs the priority with a commonly-cited cause (子育てにお金がかかりすぎる)", "ただ introduces a genuine practical constraint, not just a token counterpoint", "Ends with realistic hedging (簡単には実現できないだろう) instead of a naive promise"],
      },
      AH: {
        jp: "もし日本の首相だったら、少子化対策に真っ先に**取り組むべきだ**と思います。子育て世代の経済的負担が大きいことは以前から指摘されており、**人口減少に伴って**社会保障制度そのものの持続可能性も揺らぎつつあります。もちろん、財源の確保という壁がある以上、増税を一切避けて通ることはできないでしょうし、国民の理解を得るのは容易ではないでしょう。それでも、この問題を先送りし続ければ、将来的にはさらに大きな代償を**払わざるを得なくなる**と思います。",
        en: "If I were the Prime Minister of Japan, I think addressing the declining birthrate should be tackled before anything else. The heavy economic burden on families raising children has been pointed out for a long time, and as the population declines, the sustainability of the social security system itself is starting to waver. Of course, given that there's the obstacle of securing funding, it probably won't be possible to avoid tax increases entirely, and gaining the public's understanding won't be easy either. Even so, I think that if this problem keeps getting postponed, we'll have no choice but to pay an even bigger price in the future.",
        notes: ["べきだ states a clear, principled stance rather than a personal wish", "に伴って ties population decline to a broader structural consequence (social security sustainability), not just the immediate issue", "ざるを得なくなる closes with a stark, reluctant inevitability — raising the stakes instead of ending on a soft hope"],
        grammarIds: ["g36", "g34", "g39"],
      },
    },
  },
];
