// 12-week (3-month) intensive roadmap for a learner already midway through Intermediate High.
// Goal: full command of IH + Advanced Low + Advanced Mid grammar and discourse by the end of
// week 12, with Advanced High as the explicit next phase (see EXTENSION below) — "go from there."
// This is deliberately front-loaded and dense: expect 45-60 min/day, not 20.
export const CHECKPOINTS = [
  { week: 4, label: "Advanced Low checkpoint", desc: "All 14 AL grammar items at 90%+, sustained 4-5 sentence narration with a real complication, Rubric average 2.7+." },
  { week: 8, label: "Advanced Mid progress checkpoint", desc: "First 16 AM grammar items in active use, two-sided reasoning (concede + rebut) under time pressure, Rubric average 3.0+." },
  { week: 12, label: "Advanced Mid mastery checkpoint", desc: "All 36 IH/AL/AM grammar items at 90%+ overall, 5-function mock session with no notes, Rubric average 3.2+. This is where the 3-month plan ends and the Advanced High phase begins." },
];

export const ROADMAP = [
  {
    week: 1,
    title: "Close out Intermediate High — fast",
    focus: "You're already close, so this week moves quickly. Every IH structure must stop costing you thinking time before week 2 starts.",
    dailyMinutes: 45,
    tasks: [
      "Grammar Ladder: all 6 IH items to 90%+ quiz accuracy",
      "Connector Lab: master Sequence + Addition + Cause categories (85%+)",
      "Level Ladder: read IH and AL tiers for all 6 topics; say the AL tier out loud after each",
      "Paragraph Practice: Narrate-past, 3 topics, 4+ sentences each, recorded",
      "Daily: one 60-second turn, no notes, self-timed",
      "Vocabulary in Sentences: with 284 words now in the list, don't try to sequence them by hand — let Review Session introduce ~8 new words/day and start building your daily streak there",
    ],
  },
  {
    week: 2,
    title: "Advanced Low, block 1",
    focus: "First 6 AL structures: contrast-in-a-clause (のに), reasoning closers (ということだ／わけだ), and stacking qualities (ばかりでなく／として／にとって).",
    dailyMinutes: 50,
    tasks: [
      "Grammar Ladder: のに, ということだ, わけだ, ばかりでなく/だけでなく, として, にとって — 85%+",
      "Connector Lab: Contrast + Result categories (85%+)",
      "Paragraph Practice: Complication-resolution, 2 topics, 60-75 seconds each",
      "Shadow all narrate-past + complication model paragraphs, twice each",
      "Use at least 2 of this week's new grammar structures out loud today, every day",
      "Vocabulary in Sentences: keep Review Session running daily — that's what paces new vocabulary now, not a fixed weekly list",
    ],
  },
  {
    week: 3,
    title: "Advanced Low, block 2",
    focus: "Causative/passive for narrating other people, plus わりに／おかげで・せいで／たびに for precise cause and comparison.",
    dailyMinutes: 50,
    tasks: [
      "Grammar Ladder: causative させる, passive られる, ば/たら nuance, わりに, おかげで/せいで, たびに — 85%+",
      "Connector Lab: Condition + Example categories (85%+)",
      "Paragraph Practice: Complication-resolution, 2 harder topics, 75+ seconds",
      "Level Ladder: reread the AL tier for all 6 topics, note every grammar structure you now recognize",
      "Full AL-so-far grammar quiz (12 items), 85%+",
      "Vocabulary in Sentences: browse the N3 filter in Vocabulary in Sentences for words tied to this week's grammar/complication topics",
    ],
  },
  {
    week: 4,
    title: "Advanced Low checkpoint",
    focus: "Finish the AL set, then prove it under pressure. This is the first hard gate.",
    dailyMinutes: 50,
    tasks: [
      "Grammar Ladder: とおり(に), ながらも — then full AL review, all 14 items, 90%+",
      "Connector Lab: full quiz across all categories learned so far, 90%+",
      "Checkpoint: record a narrate-past + a complication topic back to back, no notes, self-score on the Rubric — target 2.7+",
      "Paragraph Practice: Compare & Contrast, 2 topics, first attempt",
      "Write down your 3 weakest AL structures and drill them specifically",
      "Vocabulary in Sentences: continue daily Review Session — check the Dashboard due-count and clear it",
    ],
  },
  {
    week: 5,
    title: "Advanced Mid begins",
    focus: "Move past 'here's my opinion' into 'here's my opinion, here's the counterpoint, here's why I still hold it.' First 4 AM structures.",
    dailyMinutes: 55,
    tasks: [
      "Grammar Ladder: causative-passive させられる, ものの, つつ/つつある, において/に関して — 85%+",
      "Level Ladder: study the AM tier for the opinion + comparison topics — note where もちろん/一方で get used",
      "Paragraph Practice: Support an Opinion, 3 topics, every answer must include a stated counterargument",
      "Connector Lab: Summary + Opinion categories, full-deck quiz 85%+",
      "Daily: describe one complex opinion in 90 seconds with zero preparation time",
      "Vocabulary in Sentences: continue daily Review Session — check the Dashboard due-count and clear it",
    ],
  },
  {
    week: 6,
    title: "Advanced Mid: precision cause and pushback",
    focus: "ばかりに and からといって〜ない let you narrate blame and reject overgeneralizations — native-sounding, not workaround language.",
    dailyMinutes: 55,
    tasks: [
      "Grammar Ladder: ばかりに, からといって〜ない, にしても/にしろ, 上で — 85%+",
      "Paragraph Practice: Compare & Contrast, 2 topics, structure: point / counterpoint / point / weighted conclusion",
      "Shadow all AM-tier Level Ladder examples out loud, twice through",
      "Use ばかりに or からといって〜ない at least once per recording this week",
      "Full connector quiz across all 10 categories, 90%+",
      "Vocabulary in Sentences: checkpoint — in the Vocabulary section, filter to N3 and spot-check your mastery %; drill any word you keep missing directly on its card",
    ],
  },
  {
    week: 7,
    title: "Advanced Mid: narrating drawn-out complications",
    focus: "あげく, ことなく, かのように, にほかならない — the vocabulary of a long, difficult process and its resolution.",
    dailyMinutes: 55,
    tasks: [
      "Grammar Ladder: あげく(に), ことなく, かのように, にほかならない — 85%+",
      "Paragraph Practice: Hypothesize about the future, 2 topics, 90 seconds each",
      "Complication-resolution, 2 topics, must include a multi-step failed attempt before the resolution (あげく)",
      "Read the AH register-switching entry on the Grammar Ladder — don't drill it yet, just notice it",
      "Self-check: are you stalling or reverting to English at any point? Note exactly when",
      "Vocabulary in Sentences: switch your daily reading focus to the N2 filter — Review Session will keep mixing in whatever's actually due",
    ],
  },
  {
    week: 8,
    title: "Advanced Mid progress checkpoint",
    focus: "Final 4 AM structures, then a real progress check before the integration phase.",
    dailyMinutes: 55,
    tasks: [
      "Grammar Ladder: を通じて/を通して, に伴って, たところで, べきだ/べきではない — 85%+",
      "Full AM grammar review, all 16 items, 90%+",
      "Checkpoint: record an Opinion + a Compare topic back to back, no notes, self-score on the Rubric — target 3.0+",
      "Paragraph Practice: mixed session — one topic from each of the 6 functions, back to back",
      "Identify your weakest connector category from the dashboard and drill it to 90%+",
      "Vocabulary in Sentences: keep Review Session running daily — don't let the due-count pile up",
    ],
  },
  {
    week: 9,
    title: "Integration — everything, spaced",
    focus: "Stop learning new structures. Force IH + AL + AM (36 items) to work together under time pressure.",
    dailyMinutes: 55,
    tasks: [
      "Full grammar quiz across all 36 IH/AL/AM items, target 90%+ (repeat daily until you hit it twice in a row)",
      "4x timed turns, 90 seconds to 2 minutes, topics drawn from any of the 6 functions",
      "Begin deliberate register-switching drills: narrate a story, drop into である-style for one formal aside, return to です・ます",
      "Shadow 3 model paragraphs daily, focusing on pacing, not new vocabulary",
      "Re-run 2 Level Ladder topics from memory, aiming for something between AM and AH",
      "Vocabulary in Sentences: keep Review Session running daily — don't let the due-count pile up",
    ],
  },
  {
    week: 10,
    title: "Stress test",
    focus: "Remove every remaining scaffold. This week should feel uncomfortable — that's the point.",
    dailyMinutes: 60,
    tasks: [
      "4x random-topic Extended Talk sessions, 2 minutes each, absolutely no scaffold or prep",
      "Mock OPI: narrate-past topic → immediately pivot to opinion on a related issue → immediately pivot to a hypothetical, no pause between",
      "Full grammar + connector review, 90%+ across the board",
      "Review every transcript this week for connector-category variety — aim for 7+ different categories across the week",
      "List your 5 weakest grammar structures overall and schedule daily drilling for them",
      "Vocabulary in Sentences: keep Review Session running daily — don't let the due-count pile up",
    ],
  },
  {
    week: 11,
    title: "Polish the weak points",
    focus: "Targeted repair, not broad review. Use what week 10 revealed about your specific gaps.",
    dailyMinutes: 55,
    tasks: [
      "Drill your 5 weakest grammar structures to 90%+ individually",
      "2x full mock sessions (narration + complication + opinion + comparison + hypothetical), self-score on the Rubric — target 3.0-3.3+",
      "Shadow every AM-tier model plus the AH-tier Level Ladder examples as a preview of what's next",
      "Deliberately include one register switch per recording, every recording, this week",
      "Compare a Week 1 recording to this week's side by side — write 3 concrete differences you can hear",
      "Vocabulary in Sentences: keep Review Session running daily — don't let the due-count pile up",
    ],
  },
  {
    week: 12,
    title: "Advanced Mid mastery checkpoint",
    focus: "The 3-month test. Full command of IH/AL/AM, and a running start into Advanced High.",
    dailyMinutes: 55,
    tasks: [
      "Full mock session: all 5 speaking functions back-to-back, zero notes, zero pauses to plan",
      "Complete grammar review: 36 IH/AL/AM items at 90%+ overall accuracy",
      "Score every recording on the full Rubric — target 3.2+ average across all 7 dimensions",
      "Preview all 8 Advanced High grammar items on the Grammar Ladder — you won't have drilled them yet, and that's expected",
      "Read the Month 4+ extension plan below and commit to a start date",
      "Vocabulary in Sentences: with 284 words in the pool, full coverage runs past week 12 — that's expected. Review Session keeps working exactly the same way into Month 4+",
    ],
  },
];

// What comes after week 12 — the "go from there" phase. Not week-numbered on purpose:
// pace this against how close week 12's checkpoint score actually landed.
export const EXTENSION = {
  title: "Month 4 and beyond: Advanced High",
  desc: "By the end of week 12 you should have full command of IH, Advanced Low, and Advanced Mid grammar and discourse. Advanced High is a smaller, denser set of 8 structures — the payoff is less about volume and more about deliberate register control.",
  tasks: [
    "Grammar Ladder: drill all 8 AH items (とはいえ, にすぎない, ざるを得ない, かねない, がたい, ずにはいられない, んばかりに, register switching) to 90%+ — expect this to take 3-4 weeks on its own",
    "Make register switching (だ・である ↔ です・ます) a deliberate habit in every recording, not just a once-a-week drill",
    "Weekly unscaffolded mock OPIs, 2+ topics back to back, self-scored on the Rubric — target 3.5+ average",
    "Retire the scaffold entirely: use Paragraph Practice only in 'no scaffold visible' mode",
    "Once AH grammar quizzes are consistently 90%+, the remaining work is almost entirely about volume: more unscripted speaking, more shadowing of native long-form audio outside this app (podcasts, interviews), less app-guided structure",
  ],
};
