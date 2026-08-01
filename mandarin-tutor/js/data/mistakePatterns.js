// Rule-based common-mistake detector for CORRECTION MODE.
// Pure regex heuristics (no live LLM) targeting the highest-frequency
// errors English speakers make when writing Mandarin. Chinese has no word
// spacing, so patterns rely on direct character adjacency rather than \b
// word boundaries.

export const MISTAKE_PATTERNS = [
  {
    id: "missing_hen_before_adjective",
    test: /(?<!比[^，。！]{0,4})(我|你|他|她|我们|你们|他们)(忙|累|饿|渴|冷|热|大|小|高|难过|开心|高兴)(?=[。！？，,]|$)/,
    mistakeExplained: "You used a bare adjective as the whole predicate. In Chinese, plain adjective-predicate sentences need 很 (or another degree word) as connective glue — leaving it out sounds like an implied comparison, not a simple statement.",
    correctVersion: "Add 很 right before the adjective: 我很忙 (not 我忙).",
    literal: "'我忙' reads literally as 'I busy' — grammatical in English, incomplete in Chinese.",
    conversational: "我很忙，最近事情很多。 (I'm busy, I've had a lot going on lately.)",
    rule: "Subject + 很 + Adjective is the default pattern for adjective predicates. 很 here doesn't always mean 'very' — it's often just structural glue.",
    examples: ["我很忙。", "他很累。", "今天很冷。"],
    relatedSentenceId: "s02"
  },
  {
    id: "bu_you_instead_of_mei_you",
    test: /不有/,
    mistakeExplained: "有 (to have) is negated with 没, never 不 — it's the one major exception to the general negation rule.",
    correctVersion: "没有 (not 不有).",
    literal: "'不有' would read as a direct (incorrect) 'not have', mixing the wrong negator with 有.",
    conversational: "我没有时间，改天吧。 (I don't have time, let's do it another day.)",
    rule: "没 negates 有 and any completed/past action. 不 negates everything else (regular verbs, adjectives, habitual/future actions).",
    examples: ["我没有钱。", "他没有时间。", "我们没有课。"],
    relatedSentenceId: "s04"
  },
  {
    id: "le_after_mei",
    test: /没(吃|去|看|做|写|说|买|来|睡|喝|见)了/,
    mistakeExplained: "了 marks a completed action, but 没 already negates completion by itself — the two cancel each other out and never appear together after the verb.",
    correctVersion: "Drop the 了: 没吃 / 没去 / 没看 (not 没吃了).",
    literal: "'没吃了' literally doubles up on 'already', which Chinese grammar doesn't allow in this slot.",
    conversational: "我还没吃饭呢。 (I haven't eaten yet.)",
    rule: "了 (completed-action) and 没 (negation of a past action) are mutually exclusive — never write both around the same verb.",
    examples: ["我没吃饭。", "他没去学校。", "我没看那部电影。"],
    relatedSentenceId: "s04"
  },
  {
    id: "missing_measure_word_number",
    test: /(一|两|二|三|四|五|六|七|八|九|十)(书|猫|狗|车|苹果|杯子|老师|学生|朋友)/,
    mistakeExplained: "A number can't attach directly to a noun in Chinese — a measure word has to sit between them (like English 'a piece of' or 'a cup of', but required for almost every noun).",
    correctVersion: "Insert a measure word: 一本书, 一只猫, 一辆车, 一个学生 (个 is the safe default if you're unsure of the specific one).",
    literal: "'三书' reads like 'three book' — missing the classifier that Chinese requires.",
    conversational: "我有三本书，你要借一本吗？ (I have three books, want to borrow one?)",
    rule: "Number + Measure word + Noun is mandatory. Common measure words: 个 (general), 本 (books), 只 (animals), 辆 (vehicles), 张 (flat objects), 杯 (cups).",
    examples: ["一本书", "两只猫", "三个人", "一辆车"],
    relatedSentenceId: "s10"
  },
  {
    id: "shi_before_adjective",
    test: /是(忙|累|饿|渴|冷|热|大|小|高|开心|难过|高兴)/,
    mistakeExplained: "是 links two nouns (like an equals sign) — it doesn't work in front of a plain adjective the way English 'to be' does before an adjective.",
    correctVersion: "Drop 是 and use 很 instead: 我很忙 (not 我是忙).",
    literal: "'我是忙' tries to translate 'I am busy' word-for-word, but 是 only pairs with nouns in Chinese, not adjectives.",
    conversational: "我今天很忙，改天再聊吧。 (I'm busy today, let's chat another day.)",
    rule: "是 + Noun for identity ('X is a Y'). 很 + Adjective for description ('X is [quality]'). Don't mix the two patterns.",
    examples: ["我是学生。 (identity, uses 是)", "我很忙。 (description, uses 很)"],
    relatedSentenceId: "s01"
  },
  {
    id: "hen_with_bi_comparison",
    test: /比[^，。！]{1,4}很/,
    mistakeExplained: "比 already sets up the comparison by itself — adding 很 in front of the adjective is redundant and not used in the 比 pattern.",
    correctVersion: "Drop 很 in a 比 sentence: 我比他高 (not 我比他很高).",
    literal: "'比他很高' redundantly stacks two intensity markers where Chinese only wants one.",
    conversational: "这个比那个便宜一点。 (This one is a bit cheaper than that one.)",
    rule: "Pattern is A + 比 + B + Adjective (no 很). To add degree, use 一点/得多/多了 after the adjective instead: 比他高一点.",
    examples: ["我比他高。", "今天比昨天热。", "这个比那个便宜。"],
    relatedSentenceId: "s16"
  },
  {
    id: "verb_before_time_word",
    test: /(起床|睡觉|上班|下班|吃饭)(一|两|三|四|五|六|七|八|九|十|十一|十二)点/,
    mistakeExplained: "Time words come before the verb in Chinese, the opposite order from English ('I get up at 7' → literally '7-o'clock get-up').",
    correctVersion: "Move the time word in front of the verb: 我七点起床 (not 我起床七点).",
    literal: "Putting the verb first mirrors English word order, which reads as backwards/foreign in Chinese.",
    conversational: "我七点起床，八点上班。 (I get up at 7, start work at 8.)",
    rule: "Subject + Time + Verb is the fixed order for when-questions. Time words never trail the verb the way they do in English.",
    examples: ["我七点起床。", "他六点下班。", "我们九点吃饭。"],
    relatedSentenceId: "s14"
  },
  {
    id: "redundant_a_not_a_with_ma",
    test: /(是不是|去不去|忙不忙|来不来|要不要|好不好)[^，。！]{0,6}吗/,
    mistakeExplained: "A-not-A questions (是不是, 去不去...) already function as a complete yes/no question — adding 吗 on top double-marks the question and isn't used together.",
    correctVersion: "Use one or the other: either 你是不是学生？ or 你是学生吗？, never both combined.",
    literal: "Stacking 吗 onto an A-not-A question is like asking 'is he going or not, right?' — redundant question marking.",
    conversational: "你是不是很累？ (Aren't you tired?)",
    rule: "吗 and A-not-A (X不X) are two separate, mutually exclusive ways to form a yes/no question. Pick one per sentence.",
    examples: ["你是不是学生？", "你是学生吗？", "你去不去？"],
    relatedSentenceId: "s06"
  },
  {
    id: "men_on_nonperson_noun",
    test: /(书|车|猫|狗|苹果|桌子|椅子)们/,
    mistakeExplained: "们 only pluralizes people (我们/你们/他们/学生们) — it doesn't attach to objects or animals the way English '-s' does.",
    correctVersion: "Just drop 们: 书 can already mean 'book' or 'books' depending on context — quantity is shown with numbers instead (三本书).",
    literal: "'猫们' tries to pluralize 'cat' the English way, but Chinese nouns for animals/objects don't change form for plural.",
    conversational: "这些书很有意思。 (These books are interesting.)",
    rule: "们 is reserved for people (and occasionally personified/collective nouns). For everything else, context or a number + measure word shows quantity.",
    examples: ["老师们 (teachers)", "同学们 (classmates)", "三本书 (three books, not 书们)"],
    relatedSentenceId: "s10"
  },
  {
    id: "mei_negating_adjective",
    test: /没(忙|累|渴|饿|高|大|小|冷|热|开心|难过|高兴)/,
    mistakeExplained: "没 negates 有 and completed actions — plain adjective predicates are negated with 不, not 没.",
    correctVersion: "我不忙 (not 我没忙) for a simple statement.",
    literal: "'没忙' tries to apply the 'didn't happen' negator to a description, which isn't how adjective predicates work.",
    conversational: "我今天不忙，有空一起吃饭吗？ (I'm not busy today, want to grab a meal?)",
    rule: "不 handles ordinary negation of adjectives/verbs. 没 is reserved for 有 and for actions that didn't happen in the past.",
    examples: ["我不忙。", "他不累。", "今天不冷。"],
    relatedSentenceId: "s03"
  },
  {
    id: "question_word_fronted_english_style",
    test: /^(什么|哪儿|谁|怎么样)(你|他|她|我)/,
    mistakeExplained: "Chinese question words stay in the exact slot the answer would fill — they don't move to the front of the sentence the way English 'what/where/who' do.",
    correctVersion: "Keep the question word where the answer goes: 你要什么？ (not 什么你要？)",
    literal: "Fronting the question word mirrors English syntax ('What do you want?'), which sounds scrambled in Chinese.",
    conversational: "你想吃什么？我请客。 (What do you want to eat? My treat.)",
    rule: "Chinese question words (什么/谁/哪儿/怎么样/几) are 'in-situ' — they sit exactly where the answer noun/phrase would naturally go.",
    examples: ["你要什么？", "他去哪儿？", "这是谁的？"],
    relatedSentenceId: "s15"
  },
  {
    id: "missing_measure_word_this_that",
    test: /(这|那)(书|车|猫|狗|衣服|苹果)/,
    mistakeExplained: "这/那 (this/that) need a measure word before the noun too, just like numbers do.",
    correctVersion: "这本书 / 那件衣服 / 那只猫 (not 这书 / 那衣服 / 那猫).",
    literal: "'这书' skips the required classifier, reading like 'this book' minus its connective piece.",
    conversational: "这本书很有意思，你看过吗？ (This book is interesting, have you read it?)",
    rule: "这/那 + Measure word + Noun, exactly parallel to Number + Measure word + Noun.",
    examples: ["这本书", "那件衣服", "这只猫"],
    relatedSentenceId: "s10"
  }
];

export function checkText(text) {
  const hits = [];
  for (const p of MISTAKE_PATTERNS) {
    if (p.test.test(text)) hits.push(p);
  }
  return hits;
}
