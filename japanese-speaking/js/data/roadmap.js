// 8-week roadmap, recalibrated for a learner already midway through Intermediate High,
// heading toward Advanced High. Three explicit checkpoints: Advanced Low -> Advanced Mid -> Advanced High.
// This is intentionally demanding — each week assumes daily practice, not passive review.
export const CHECKPOINTS = [
  { week: 2, label: "Advanced Low checkpoint", desc: "Sustained 4-5 sentence narration with at least one real complication, using AL-tier grammar without hesitation." },
  { week: 5, label: "Advanced Mid checkpoint", desc: "Two-sided reasoning (concede + rebut), register-appropriate connectors, AM-tier grammar deployed under time pressure." },
  { week: 8, label: "Advanced High checkpoint", desc: "Unscaffolded 2-minute turns with deliberate register switching, abstraction/reflection beyond the story itself." },
];

export const ROADMAP = [
  {
    week: 1,
    title: "Close out Intermediate High",
    focus: "You're already close. Lock down IH grammar so it's automatic, and push your connector range past what IH speakers typically use.",
    dailyMinutes: 30,
    tasks: [
      "Grammar Ladder: drill all 6 IH items to 90%+ quiz accuracy — these must stop costing you thinking time",
      "Connector Lab: master Sequence + Addition + Cause categories (quiz 85%+)",
      "Level Ladder: read the IH and AL tiers for all 6 topics; say the AL tier out loud after each",
      "Paragraph Practice: Narrate-past, 2 topics, 4+ sentences, record and review transcript",
      "Speak one 60-second turn daily on any topic, no notes, self-timed",
    ],
  },
  {
    week: 2,
    title: "Advanced Low: control the complication",
    focus: "AL is defined by sustaining narration through an unexpected turn without breaking down. Checkpoint at the end of this week.",
    dailyMinutes: 30,
    tasks: [
      "Grammar Ladder: all 6 AL items (causative, passive, のに, ということだ, わけだ, ば/たら) to 85%+",
      "Connector Lab: add Contrast + Result categories, full quiz across all 5 categories so far",
      "Paragraph Practice: Complication-resolution, 3 topics, aim 60-75 seconds each",
      "Shadow all narrate-past + complication model paragraphs twice each",
      "Checkpoint: record one narrate-past + one complication topic back to back, self-score on the Rubric — target 2.5+ average",
    ],
  },
  {
    week: 3,
    title: "Advanced Mid begins: two-sided reasoning",
    focus: "Move past 'here's my opinion' into 'here's my opinion, here's the counterpoint, here's why I still hold it.'",
    dailyMinutes: 35,
    tasks: [
      "Grammar Ladder: AM items ものの, つつ/つつある, において (85%+)",
      "Level Ladder: study the AM tier for the opinion + comparison topics — note exactly where もちろん/一方で/とはいえ get used",
      "Paragraph Practice: Support an Opinion, 3 topics, every answer must include a stated counterargument",
      "Connector Lab: Condition + Example categories, full-deck quiz 85%+",
      "Daily: describe one complex opinion in 90 seconds with zero preparation time",
    ],
  },
  {
    week: 4,
    title: "Advanced Mid: precision cause and consequence",
    focus: "ばかりに, からといって〜ない, and causative-passive let you narrate blame, compulsion, and disproportionate outcomes — native-sounding, not workaround language.",
    dailyMinutes: 35,
    tasks: [
      "Grammar Ladder: AM items させられる, ばかりに, からといって〜ない (85%+)",
      "Paragraph Practice: Complication-resolution, 3 harder topics, explicitly use させられる or ばかりに at least once",
      "Compare & Contrast, 2 topics, structure: point / counterpoint / point / weighted conclusion",
      "Shadow all AM-tier Level Ladder examples out loud, twice through",
      "Full connector quiz across all 8 non-opinion/emphasis categories, 85%+",
    ],
  },
  {
    week: 5,
    title: "Advanced Mid checkpoint + Advanced High grammar begins",
    focus: "Consolidate AM, then start layering AH-tier register control on top.",
    dailyMinutes: 35,
    tasks: [
      "Checkpoint: record an Opinion + a Compare topic back to back, no notes, self-score on the Rubric — target 3.0+ average",
      "Grammar Ladder: AH items とはいえ, にすぎない, ざるを得ない (85%+)",
      "Level Ladder: read the AH tier for all 6 topics side by side with AM — identify the register shift in each",
      "Paragraph Practice: Hypothesize about the future, 2 topics, 90 seconds each",
      "Identify your weakest connector category from the dashboard and drill it to 90%+",
    ],
  },
  {
    week: 6,
    title: "Advanced High: risk, difficulty, and reluctant compulsion",
    focus: "かねない and がたい let you express precise shades of risk and difficulty that かもしれない/難しい can't carry.",
    dailyMinutes: 40,
    tasks: [
      "Grammar Ladder: AH items かねない, がたい, and the register-switching concept (だ・である vs です・ます) — study deeply, this one has no quiz shortcut",
      "Paragraph Practice: Hypothesize + Complication-resolution, 2 topics each, 90-120 seconds, no scaffold visible while speaking",
      "Deliberately narrate one story using a formal aside (である-style) then return to です・ます — record and listen back",
      "Shadow every AH-tier Level Ladder example, focusing on pacing and where the register shifts land",
      "Self-assess: does your speech ever downshift to English or stall for 3+ seconds? Note when it happens",
    ],
  },
  {
    week: 7,
    title: "Remove every scaffold",
    focus: "AH speakers don't get sentence-starters in real conversation. Full improvisation, timed, across all 6 functions.",
    dailyMinutes: 40,
    tasks: [
      "4x random-topic Extended Talk sessions, 2 minutes each, absolutely no scaffold or prep",
      "Re-run all 6 Level Ladder topics from memory — try to produce something close to the AH tier unaided, then compare",
      "Mock OPI: narrate-past topic -> immediately pivot to opinion on a related issue -> immediately pivot to a hypothetical, no pause between",
      "Grammar Ladder: full-deck quiz across all 24 items, target 90%+",
      "Review every transcript this week for connector-category variety — aim for 6+ different categories across the week"
    ],
  },
  {
    week: 8,
    title: "Advanced High checkpoint",
    focus: "Simulate a real speaking sample and score it honestly. This is the test of everything above.",
    dailyMinutes: 40,
    tasks: [
      "Full mock session: narration + complication + opinion + comparison + hypothetical, back-to-back, no notes, no pauses to plan",
      "Score every recording on the full AH Rubric — target 3.0-3.5+ average across all 7 dimensions",
      "Deliberately include one register switch and one AH-tier grammar structure (とはいえ/ざるを得ない/かねない/がたい) per recording",
      "Compare your Week 8 recording against Week 1 side by side — write down 3 concrete differences you can hear",
      "Identify the single dimension still holding you back and build a focused 2-week extension plan for it",
    ],
  },
];
