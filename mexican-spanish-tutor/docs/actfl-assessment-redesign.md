# ACTFL Assessment Framework — Redesign

Design-only document. No implementation yet. Written to persist the design
across sessions before code work begins.

This replaces the current system analyzed earlier (`core/assessment.js`,
`views/levelTest.js`, `views/speakingTest.js`, checkpoint logic in
`views/roadmap.js`), which collapses everything into one composite number via
`max(xpLevelIdx, scoresLevelIdx)`, lets multiple-choice XP alone reach the top
level, uses a permanent unfalsifiable `confirmedLevel` floor, and scores open
responses with a single flat heuristic (word count + regex checks). See prior
analysis in this conversation for the full weakness list; every item below
exists to close one of those gaps.

**Constraint carried over from `PROJECT.md`:** zero backend, zero
dependencies, vanilla JS, `localStorage` only, no API keys, no network calls.
Everything in this design must be pure client-side arithmetic and data —
nothing here requires a model API, a server, or a database. Where a technique
below sounds like "adaptive testing infrastructure," the actual mechanism is
intentionally simple enough to hand-write (an Elo-style updater, some tables,
some rubric heuristics) rather than anything requiring real ML infra.

---

## 1. Design principles

1. **Proficiency is per-skill, not one blended number.** Speaking, Writing,
   Reading, and Listening are tracked as four independent ACTFL levels, the
   way real-world ACTFL testing does it (OPI ≠ WPT ≠ RPT). A composite
   headline is still shown, but it's derived transparently, not by taking a
   `max()` that lets one strong signal hide three absent ones.
2. **Evidence, not a switch.** No single passed test permanently "confirms"
   a level. Every level claim is a standing hypothesis backed by a rolling
   window of recent evidence, and it can be lost as well as gained.
3. **Multiple-choice and recognition tasks calibrate vocabulary/grammar
   *readiness*, not proficiency.** They feed the item-selection engine (what
   to teach/drill next) but never by themselves justify a Speaking, Writing,
   Reading, or Listening level. Only performance tasks — producing or
   comprehending real, non-memorized language for a real-world purpose — can
   move a skill's ACTFL level.
4. **ACTFL's own rating logic drives advancement: sustained, consistent,
   spontaneous.** One great answer doesn't prove a level; one bad day doesn't
   disprove one. Both advancement and regression require a pattern across
   multiple tasks, multiple functions, and multiple contexts — never a
   single data point.
5. **Difficulty adapts to the learner, continuously, per skill.** No fixed
   linear roadmap gates what a learner is asked next; task selection targets
   each skill's current estimated ceiling directly.
6. **Every task is a real-world communicative act**, framed with a genuine
   purpose (text a friend, read a menu, understand a voice note, explain a
   problem to a landlord) — never "translate this sentence," which tests
   recall, not proficiency.

---

## 2. Architecture overview

Four components, all client-side, all reading/writing one `localStorage`
blob per the existing `storage.js` pattern:

```
┌─────────────────────┐     ┌──────────────────────┐
│   Task Bank          │     │   Rubric Engine        │
│  (real-world tasks,   │     │  (5-dimension scoring   │
│   tagged by skill,    │     │   of any response:       │
│   level, function,    │────▶│   text type, function,   │
│   mode, context)      │     │   context, accuracy,     │
└─────────────────────┘     │   register)             │
          ▲                  └──────────┬────────────┘
          │                             │ outcome (0 / 0.5 / 1) per task
          │                             ▼
┌─────────────────────┐     ┌──────────────────────┐
│ Adaptive Task         │◀────│  Per-Skill Rating       │
│ Selector               │     │  Engine (Elo-style,     │
│ (picks next task near  │     │  4 independent ratings, │
│  each skill's current  │     │  continuous reassessment,│
│  estimate; runs        │     │  decay, ceiling/floor    │
│  periodic ceiling/     │     │  probing)                │
│  floor probes)         │     └──────────┬────────────┘
└─────────────────────┘                  │
                                          ▼
                              ┌──────────────────────┐
                              │  Level Reporting        │
                              │  (per-skill levels +     │
                              │   composite headline +   │
                              │   confidence + evidence   │
                              │   log, shown on           │
                              │   Dashboard/OPI/Writing/   │
                              │   Listening/Reading views) │
                              └──────────────────────┘
```

Every gradeable interaction anywhere in the app — Conversation, Speaking
Test, Writing Coach, a Story comprehension check, a Listening clip, a
Roleplay, a Scenario — passes through the same Rubric Engine and updates the
same Rating Engine. There is no longer a special "the test that sets your
level" screen versus "practice that doesn't count." Dedicated assessment
views (a redesigned Speaking Test / Writing Test / Reading Test / Listening
Test) exist to *generate high-quality, level-targeted evidence on demand*,
not because they're the only thing that counts.

### 2.1 The per-skill rating engine (continuous reassessment + adaptive difficulty)

An Elo-style rating, one per skill, is the mechanism that satisfies
*continuous reassessment* and *adaptive difficulty* simultaneously with
nothing more than arithmetic:

- Each skill has a rating `R` on a 0–2400 scale, banded into the 9 levels at
  ~267 points/level (table in §2.2).
- Each task in the Task Bank has a difficulty rating `D`, pre-authored per
  level band (with a small ± jitter so tasks within a level aren't
  identical difficulty).
- After a task is scored by the Rubric Engine into an outcome
  `S ∈ {0, 0.5, 1}` (fail / partial / pass — see §3), expected success is
  `P = 1 / (1 + 10^((D - R) / 400))` and the rating updates:
  `R += K * (S - P)`.
- `K` starts high (≈40) for a skill's first ~10 qualifying tasks (fast
  initial placement, replacing the old one-shot Level Test) and decays to
  ≈12 once a skill has a stable history (slow, resistant-to-noise
  tracking thereafter) — the same K-decay pattern real Elo systems use to
  separate "placement" from "ongoing tracking."
- **This single mechanism replaces**: the old Level Test's fixed
  question-by-level script, the Speaking Test's `ceiling = last index scoring
  ≥55`, and the `max(xp, scores)` composite — a task at any difficulty, at any
  time, in any view, nudges the rating toward the truth.

**Adaptive difficulty** falls out of the same number: the Task Selector
always prefers tasks whose `D` is within ~100–150 points of the skill's
current `R` (target success rate ~65–75%, the productive-struggle zone —
too easy teaches nothing, too hard just frustrates and adds noise). Roughly
every 5th task is deliberately a **ceiling probe** (`D` ≈ `R + 300`, one full
level up) or a **floor check** (`D` ≈ `R − 300`), which is what lets the
engine detect "you've actually outgrown this level" or "you've slipped"
without waiting for a dedicated retest.

**Continuous reassessment / decay:** if a skill has gone 21+ days without a
qualifying task, the next 3 qualifying tasks use an inflated `K` (≈50) so the
rating re-anchors quickly instead of dragging stale history along — this
directly fixes the old system's permanent, unfalsifiable `confirmedLevel`.

### 2.2 Level ↔ rating bands

| Level | Code | Rating band |
|---|---|---|
| Novice Low | `novice-low` | 0 – 266 |
| Novice Mid | `novice-mid` | 267 – 533 |
| Novice High | `novice-high` | 534 – 800 |
| Intermediate Low | `intermediate-low` | 801 – 1066 |
| Intermediate Mid | `intermediate-mid` | 1067 – 1333 |
| Intermediate High | `intermediate-high` | 1334 – 1600 |
| Advanced Low | `advanced-low` | 1601 – 1866 |
| Advanced Mid | `advanced-mid` | 1867 – 2133 |
| Advanced High | `advanced-high` | 2134 – 2400 |

A learner's **displayed level** for a skill is not simply "whatever band `R`
falls in," because a raw rating can cross a band edge on noise. Displayed
level = the band containing `R`, *held* until either (a) `R` has stayed in a
new band for ≥5 qualifying tasks (promotion) or (b) the regression rule in
§7 fires (demotion). This hysteresis is what makes advancement/failure
criteria meaningful instead of a number quivering across a line.

---

## 3. The universal rubric (replaces `scoreOpenResponse`)

Every performance task — spoken, written, or a comprehension response to
something read/heard — is scored on **five dimensions**, 0–4 each, by the
Rubric Engine. This is the direct fix for the old system's single flat
heuristic (length + one past-tense regex + one connector regex − mistake
count).

| Dimension | What it measures | 0 | 2 | 4 |
|---|---|---|---|---|
| **Text type** | Isolated words → lists → sentences → paragraphs → extended discourse | single words only | strings of loosely joined sentences | fully organized, cohesive paragraph(s) with signaled structure |
| **Function** | Did the response actually do what the task asked (describe / narrate / compare / hypothesize / persuade)? | attempted a different, easier function | performed the function partially or with heavy support | performed the target function fully and directly |
| **Time-frame / aspect control** | For narrating/describing tasks: correct and *contrastive* use of tenses/aspect (not just "a past-tense word appeared") | no time-frame marking, or wrong frame throughout | one time frame handled; others attempted but broken | full, consistent control across all time frames the task calls for, including preterite/imperfect contrast where relevant |
| **Context & content** | Register, cultural appropriateness, relevance to the real-world scenario given | off-topic or ignores the scenario's constraints (e.g., formal register when the scenario demands it) | addresses the scenario but misses constraints/register | fully appropriate to audience, purpose, and (for Mexican Spanish specifically) register/regional norms |
| **Accuracy & comprehensibility** | Errors weighted by structure frequency, not flat-counted; a Novice-level error in a high-frequency structure counts more than an Advanced learner's error in a rare subjunctive clause | frequent breakdown; a sympathetic native listener/reader would struggle | errors present but a patient native speaker follows without difficulty | accurate enough that a stranger, not just a sympathetic interlocutor, would understand without asking for repetition |

An **outcome** `S` for the Elo update is derived from the rubric total
(0–20) relative to the task's **target level anchor** (each task in the
Task Bank declares which level it's written to probe, and what a "pass" at
that level requires — see §4 for how anchors differ by level, since the
bar for "accurate," "organized," etc. is different at Novice vs. Advanced):

- `S = 1` (pass): total ≥ 80% of the level's max, **and** no dimension
  scores 0.
- `S = 0.5` (partial): total 50–79%, or one dimension at 0.
- `S = 0` (fail): total < 50%, or two-plus dimensions at 0 (signals a
  breakdown pattern, not a rough edge).

Accuracy scoring keeps a **pattern library** like today's 13
`mistakePatterns.js` rules, but expanded and weighted by frequency-class
(high-frequency structures — ser/estar, gender agreement, present tense
conjugation — penalized more at every level; low-frequency structures —
subjunctive in hypotheticals, literary tenses — only penalized once a
learner's tasks are already targeting Advanced-level functions where that
structure is actually called for). This is the mechanism-level fix for
weakness #7 (flat, pattern-blind mistake penalty) from the prior analysis.

---

## 4. Per-skill evaluation design

All four skills reuse the Rating Engine + Rubric Engine from §2–3. What
differs is **task shape** and **which rubric dimensions apply**.

### 4.1 Speaking (Interpersonal + Presentational)

- **Task shapes:** live-mic OPI-style interview turns (existing
  `startDictation` infra reused), roleplay with a simulated interlocutor who
  can introduce a complication mid-scene (a missed bus, a wrong order, a
  price dispute), a "leave a voice message" presentational task (no
  back-and-forth, just sustained monologue), timed picture/scenario
  narration.
- **Rubric application:** all five dimensions apply; Time-frame control and
  Function are weighted highest, since spontaneous, unrehearsed handling of
  a task is what speaking uniquely tests (vs. writing, where more planning
  time is normal and expected).
- **Interactive-function check** (fixes missing-function #5 from prior
  analysis): roleplay tasks specifically score whether the learner
  *negotiated* the complication (asked a clarifying question, repaired a
  misunderstanding) rather than just producing correct sentences in
  isolation — a dedicated "Interaction" sub-flag alongside the 5 rubric
  dimensions, required at Intermediate High and above.

### 4.2 Writing (Presentational, some Interpersonal)

- **Task shapes:** reply to a WhatsApp/text message (Interpersonal,
  short-turnaround), write a short note/email (Presentational, more
  planning time expected → accuracy bar is higher than for Speaking at the
  same level), fill out a form (Novice), write a structured opinion piece
  or complaint letter (Advanced).
- **Rubric application:** all five dimensions apply; Accuracy is weighted
  higher than in Speaking (writing allows self-correction, so ACTFL expects
  tighter control at the same functional level), Text type is weighted
  higher (organization/paragraphing is directly visible in writing).
- Replaces the old single-fixed-answer `produce` question type entirely —
  writing tasks are always open free-response, never matched against one
  canonical string.

### 4.3 Reading (Interpretive)

- **Task shapes:** leveled authentic-style texts (a menu/sign at Novice, a
  text-message exchange at Intermediate, a short news item or blog opinion
  piece at Advanced) followed by comprehension tasks that require producing
  or selecting information *in a way that proves understanding of
  structure*, not just keyword-spotting — e.g., "put these steps in order,"
  "what would this person NOT agree with," not just "what does X mean."
- **Rubric application:** a modified 3-dimension rubric — **Function**
  (did the learner extract the right *kind* of information: a fact, a
  sequence, an inference, an author's stance), **Context & content**, and
  **Accuracy** (of comprehension, not production). Text-type and
  time-frame/aspect dimensions don't apply to a receptive skill in the same
  way; instead, **text complexity of the passage itself** (already tagged
  per task in the Task Bank — sentence length, structure density, whether
  meaning requires inference vs. is stated directly) stands in as the `D`
  difficulty rating.
- Directly fixes weakness (missing function): reading level no longer moves
  on a flat "+3 for finishing any story" — it moves only when comprehension
  of a passage *tagged at a specific level* is demonstrated.

### 4.4 Listening (Interpretive)

- **Task shapes:** audio clips (via `SpeechSynthesis`, since there's no
  audio-file pipeline) at varying speech rate/naturalness — a scripted
  announcement at Novice, a natural-speed voice note at Intermediate, an
  unscripted-sounding opinionated monologue or a two-person exchange with
  overlapping turns at Advanced — followed by the same
  extract-information-style comprehension tasks as Reading.
- **Rubric application:** same 3-dimension model as Reading. Difficulty
  (`D`) is driven by speech rate, vocabulary familiarity, and
  redundancy/directness of the information (an Advanced-level clip requires
  inferring something not stated outright).
- Fixes the same "flat completion bonus regardless of clip difficulty"
  problem Reading has today (`dialogues.js` gives +2 listening for finishing
  any dialogue, regardless of level).

---

## 5. Real-world task bank

Every task carries: `skill`, `level` (the band it's written to probe),
`function` (an ACTFL communicative function — describe / narrate / compare /
sequence / persuade / hypothesize / negotiate / advise), `mode`
(interpersonal / interpretive / presentational), and `context` (a tag like
`family`, `food`, `transit`, `work`, `civic`, `social-media`, `travel`,
`health`, `abstract-opinion`) so the Task Selector can enforce the
advancement rule's "≥3 task types across ≥2 contexts" requirement (§6) and
so content stays the specifically-Mexican-Spanish, meaning-before-grammar
material the app already commits to (register/slang notes, `¿Qué onda?`,
camión/pesero, tianguis, etc. — not generic Spanish-from-Spain content).

Representative contexts reused across levels at rising difficulty (concrete
examples appear in §8 per level): greetings/family/food (Novice) → transit,
shopping, scheduling, minor complaints (Intermediate) → work, civic topics,
media, hypothetical/abstract opinion, persuasion and advice (Advanced).

---

## 6. Advancement criteria — general rule

Stated once here; §8 gives the level-specific "what a qualifying task looks
like" and any level-specific nuance.

A skill advances from level **N** to **N+1** when, within a rolling 45-day
evidence window:

1. **Rating** `R` has been inside the N+1 band for ≥5 qualifying tasks
   (not 5 calendar days — 5 actual graded performance tasks), AND
2. Those tasks span **≥3 different functions** and **≥2 different
   contexts** — a learner who only ever narrates about food doesn't
   "advance" on narration alone, AND
3. **No dimension averaged 0** across those 5 tasks (a pattern gap, not a
   passable weak spot), AND
4. At least **one ceiling probe** (§2.1) into the N+2 band was attempted
   without a full breakdown (`S` ≥ 0.5) — confirms N+1 isn't itself the
   learner's ceiling, mirroring how a real OPI always probes one level
   above wherever the candidate seems to plateau.

When all four hold, the displayed level updates, a `levelChangeLog` entry is
written (level, date, evidence task ids — an audit trail the old system
never had), and (unlike the old system) **this is per skill** — Speaking can
advance while Writing sits still.

---

## 7. Failure / regression criteria — general rule

1. A skill/level pairing enters **"at risk"** when ≥2 of the learner's last
   5 qualifying tasks at the current level score `S = 0`, or show a
   level-specific breakdown pattern (defined per level in §8 — e.g., for
   Intermediate levels, reverting to memorized chunks instead of created
   sentences; for Advanced levels, losing time-frame control under a
   complication).
2. While "at risk," the Task Selector inserts a **recovery probe** — one
   more qualifying task at the current level, not harder — before any
   further regression step, so a single bad session (tired, noisy mic,
   distracted) can't cascade.
3. **Regression** (demotion one band) fires only if the recovery probe also
   fails, giving **3 consecutive qualifying failures with no recovery
   between them**. This hysteresis mirrors §6's hysteresis and is the fix
   for "permanent floor" — the level can move down, but not on a whim.
4. **Silent decay** (separate from active failure): if a skill has **zero**
   qualifying tasks for 45+ days, its confidence band widens (displayed as
   "last confirmed: Intermediate Mid, 3 months ago" rather than a bare
   badge) and the next qualifying task uses the inflated re-anchoring `K`
   from §2.1 instead of waiting for 5 more tasks to move anything — an
   honest "we're not sure anymore," not a stale number presented as current.

---

## 8. The 9 ACTFL levels

Each level's **Required communication abilities** are broken out per mode
(Interpersonal/Interpretive/Presentational) since that's how the skills
actually differ at every level. **Sample real-life scenarios** are Mexican
Spanish-specific, matching the app's existing content style. **Advancement**
and **Failure** criteria here are the level-specific *content* that plugs
into the general rules in §6/§7 (what a "qualifying task" and a "breakdown
pattern" concretely mean at this level).

### 8.1 Novice Low

**Required communication abilities**
- *Interpersonal:* Exchange greetings and produce a few memorized, isolated
  words/phrases (name, basic courtesy expressions) when directly modeled or
  strongly cued. No original sentence formation expected.
- *Interpretive:* Recognize a handful of high-frequency written/spoken
  words in context (signs, numbers, own name) with visual/contextual
  support.
- *Presentational:* Copy or reproduce single memorized words/phrases (e.g.,
  fill in name on a form).

**Sample real-life scenarios**
- Greeting a shopkeeper: "Buenos días" / "Hola, ¿qué tal?"
- Saying your name and nationality when asked directly.
- Recognizing "abierto/cerrado," "baño," "salida" on signage.
- Counting change handed to you at a tianguis stall.

**Advancement criteria (to Novice Mid)**
- Qualifying task = producing 3+ isolated relevant words/phrases (not full
  original sentences yet) in response to a real prompt (not multiple
  choice) — e.g., naming objects in a photo, greeting appropriately for
  time of day.
- Ceiling probe: attempt a Novice Mid "answer a simple question with a
  short phrase" task without total silence/refusal.

**Failure criteria**
- Breakdown pattern: no relevant Spanish produced at all (silence, only
  English, or entirely unrelated memorized chunks) on ≥2 of last 5 tasks.
- Because this is the floor level, "regression" below Novice Low isn't
  meaningful — instead, persistent failure here holds the learner at
  Novice Low and routes them to more scaffolded (audio-modeled,
  choral-repetition-style) practice rather than open-response tasks.

---

### 8.2 Novice Mid

**Required communication abilities**
- *Interpersonal:* Answer simple, highly predictable questions (name,
  origin, likes) using short memorized/formulaic phrases; can produce
  short lists.
- *Interpretive:* Understand common words/phrases and short memorized
  exchanges when spoken slowly/clearly with support (visuals, repetition).
- *Presentational:* Produce short lists and simple learned phrases about
  self, family, food preferences.

**Sample real-life scenarios**
- Ordering a basic item at a taquería: "Una de pastor, por favor."
- Answering "¿De dónde eres?" / "¿Tienes hermanos?" with short phrases.
- Reading a simple menu and picking out familiar food words.
- Listing 3–4 foods you like/dislike.

**Advancement criteria (to Novice High)**
- Qualifying task = handling a short, predictable exchange (ordering,
  answering 2–3 personal questions) using strings of short phrases, without
  needing every word modeled first.
- Spans ≥2 contexts (e.g., food + family, not just food twice).
- Ceiling probe: attempt a Novice High "describe your daily routine in a
  few sentences" task and produce at least loosely connected sentences
  (even if gap-filled).

**Failure criteria**
- Breakdown: relies entirely on repeating back the interviewer's/prompt's
  own words rather than producing any independent phrase, on ≥2 of last 5
  tasks.
- Regression to Novice Low: 3 consecutive qualifying failures where even
  short memorized phrases can't be produced without direct modeling.

---

### 8.3 Novice High

**Required communication abilities**
- *Interpersonal:* Handle a small set of uncomplicated, predictable
  everyday tasks (ordering, simple shopping, basic scheduling) using mostly
  formulaic language, with occasional original recombination; can
  self-correct or use strategies (repetition, gesture-equivalent phrasing)
  to get through a gap.
- *Interpretive:* Understand the gist of short, simple, predictable spoken
  or written texts on familiar topics; may miss detail.
- *Presentational:* Attempt strings of simple sentences, though usually
  breaking into a paragraph is inconsistent/unsustained.

**Sample real-life scenarios**
- Buying a metro card and asking how much to add.
- Reading a short WhatsApp message from a friend about weekend plans and
  getting the gist.
- Describing your daily routine in 3–5 simple sentences.
- Handling "no hay de ese sabor, ¿quiere otro?" with a simple adjusted
  response instead of freezing.

**Advancement criteria (to Intermediate Low)**
- Qualifying task = producing **original** (not memorized-chunk) sentences
  to answer an unpredictable follow-up, not just a scripted exchange —
  this is the key Novice→Intermediate threshold ACTFL defines as "creating
  with language."
- Ceiling probe: attempt an Intermediate Low "have a short back-and-forth
  about a personal topic, including one follow-up you didn't expect" task
  and produce at least a couple of independently-formed sentences in
  response.

**Failure criteria**
- Breakdown: falls back to memorized formulaic phrases even when the
  question requires a genuinely new sentence (echoing rather than
  creating), on ≥2 of last 5 tasks.
- Regression to Novice Mid: 3 consecutive qualifying failures where even
  predictable, rehearsed-shape exchanges break down.

---

### 8.4 Intermediate Low

**Required communication abilities**
- *Interpersonal:* Create original sentences (not just recombined
  memorized chunks) to ask and answer simple questions and participate in
  short, predictable conversations on immediate needs; can initiate,
  though sustaining requires interlocutor support.
- *Interpretive:* Understand simple, straightforward information in short
  connected texts/speech on familiar topics.
- *Presentational:* Write/say simple original sentences, loosely strung
  together, about self and immediate needs.

**Sample real-life scenarios**
- Asking a stranger for directions to the metro and understanding a short
  reply well enough to follow it.
- Texting a friend to reschedule plans, in your own words (not a copied
  template).
- Explaining briefly why you're late for a work meeting.
- Reading a short personal-ad-style social media bio and getting the main
  facts.

**Advancement criteria (to Intermediate Mid)**
- Qualifying task = sustaining a short exchange across ≥3 conversational
  turns on a familiar topic, initiating at least one turn (not purely
  reactive), across ≥2 contexts (e.g., transit + scheduling).
- Ceiling probe: an Intermediate Mid "describe a familiar situation in
  detail, several connected sentences" task, produced without collapsing
  into single-word/short-phrase answers.

**Failure criteria**
- Breakdown: conversation stalls after one exchange because the learner
  can't independently extend it (waits entirely on interlocutor prompting)
  on ≥2 of last 5 tasks.
- Regression to Novice High: 3 consecutive qualifying failures marked by
  reverting to formulaic, non-original phrasing even for simple personal
  questions.

---

### 8.5 Intermediate Mid

**Required communication abilities**
- *Interpersonal:* Sustain sentence-level conversation across a broader
  range of everyday/survival situations; handle uncomplicated transactional
  tasks (shopping, scheduling, simple problem-mentioning) effectively; can
  ask follow-up questions unprompted.
- *Interpretive:* Understand the main ideas and some supporting details in
  everyday connected texts/speech on familiar topics.
- *Presentational:* Produce connected sentences forming short paragraphs on
  familiar/personal topics; can describe and give simple explanations.

**Sample real-life scenarios**
- Negotiating a return/exchange at a store when an item doesn't fit.
- Describing your job or studies in several connected sentences to a new
  acquaintance.
- Understanding a short voice note from a landlord about a repair
  appointment, including the day/time detail.
- Explaining a minor problem to a pharmacist ("me duele la garganta desde
  ayer...") and understanding their follow-up questions.

**Advancement criteria (to Intermediate High)**
- Qualifying task = producing a short organized paragraph (3+ connected
  sentences forming one coherent point, not just a longer list) describing
  or explaining something familiar, and successfully handling an
  unprompted follow-up question within the same task.
- Ceiling probe: an Intermediate High "narrate what happened, past time
  frame, including an unexpected complication" task, attempted with at
  least partial past-tense control (even if imperfect/preterite contrast is
  shaky).

**Failure criteria**
- Breakdown: responses stay at disconnected-sentence level (a list, not a
  paragraph with signaled connections) even on tasks that specifically ask
  for explanation/description, on ≥2 of last 5 tasks.
- Regression to Intermediate Low: 3 consecutive qualifying failures where
  even short predictable exchanges can't be sustained past one turn.

---

### 8.6 Intermediate High

**Required communication abilities**
- *Interpersonal:* Handle most uncomplicated communicative tasks in
  straightforward social situations with ease; converse with reasonable
  fluency; can narrate/describe in past, present, and future to a degree,
  though control weakens noticeably when a complication or unfamiliar topic
  arises.
- *Interpretive:* Understand connected discourse with mostly-clear main
  ideas and many details on both familiar and some unfamiliar topics,
  though inference/implied meaning is still difficult.
- *Presentational:* Narrate/describe across time frames in paragraph-length
  discourse, generally understood, but with some loss of accuracy/control
  especially in less familiar territory.

**Sample real-life scenarios**
- Narrating a memorable trip or event to a new friend, past tense, in a
  connected multi-sentence story.
- Handling a bus that doesn't show up: asking around, understanding
  conflicting answers, deciding what to do, and explaining the situation
  afterward.
- Reading a short news brief (not a full article) and summarizing the main
  point plus one supporting detail.
- Being asked your opinion on a everyday debate (WFH vs. office) and giving
  a reason, even if not deeply elaborated.

**Advancement criteria (to Advanced Low)**
- Qualifying task = a task explicitly requiring **narration/description
  across multiple time frames within one response** (not just one frame
  per task), sustained as connected paragraph-length discourse, completed
  with control that a patient native speaker follows without asking for
  repetition.
- Includes successfully **handling a complication mid-task** (a roleplay
  where something goes wrong) — the defining Advanced-level threshold task.
- Ceiling probe: an Advanced Low "explain the causes and effects of
  something, defend a view" task attempted with organized paragraph
  structure, even if some abstract vocabulary gaps show.

**Failure criteria**
- Breakdown: time-frame control collapses under complication — reverts to
  present tense or loses narrative thread when the roleplay throws a
  curveball — on ≥2 of last 5 tasks.
- Regression to Intermediate Mid: 3 consecutive qualifying failures where
  even single-time-frame paragraph description can't be sustained.

---

### 8.7 Advanced Low

**Required communication abilities**
- *Interpersonal:* Participate effectively in most informal and some
  formal conversations on practical, social, and (to a degree) professional
  topics; can handle a complication or an unexpected turn with only some
  hesitation.
- *Interpretive:* Understand the main ideas and most supporting details of
  connected discourse on a variety of topics, including some
  unfamiliar/abstract ones, when context provides support.
- *Presentational:* Narrate and describe in all major time frames — past,
  present, future — in paragraph-length connected discourse; not yet fully
  consistent, but functional and generally accurate.

**Sample real-life scenarios**
- Explaining to a landlord, in a written message, a maintenance problem's
  history (when it started, what's been tried, what you need now) —
  spanning past, present, and a request about the future.
- Describing, unprompted, how a tradition/celebration has changed over
  time (comparing past and present).
- Handling a mildly contentious situation: disputing an incorrect charge,
  narrating what happened, and proposing a resolution.
- Reading an opinion-column-style piece and identifying the author's
  stance plus one piece of supporting reasoning.

**Advancement criteria (to Advanced Mid)**
- Qualifying task = narration/description across **all three major time
  frames within a single response**, with *consistent* (not just
  functional-but-shaky) control, across ≥3 functions/contexts.
- Ceiling probe: an Advanced Mid task requiring handling an unexpected
  complication *while already mid-narration* (not a separate prompt) —
  e.g., a roleplay where the story you're telling gets interrupted by a
  new fact you must incorporate — attempted without abandoning the
  narrative thread.

**Failure criteria**
- Breakdown: only 1–2 of the 3 major time frames are handled with real
  control in a task explicitly requiring all three, on ≥2 of last 5 tasks.
- Regression to Intermediate High: 3 consecutive qualifying failures where
  multi-time-frame narration can't be sustained even without a
  complication added.

---

### 8.8 Advanced Mid

**Required communication abilities**
- *Interpersonal:* Communicate with ease and accuracy on practical,
  social, and professional topics; handle a complicated or unexpected
  situation effectively (not just functionally) — e.g., resolve a
  genuine dispute, not just narrate one.
- *Interpretive:* Understand most of what's said/written on both concrete
  and some abstract topics, including some inferred/implied meaning.
- *Presentational:* Narrate and describe with good control across all
  major time frames, in extended, well-organized paragraph-length
  discourse; communicates facts and discusses topics of public interest
  with relative ease.

**Sample real-life scenarios**
- Mediating a disagreement between two people (e.g., a roommate dispute
  about chores) — understanding both sides and proposing a fair
  resolution.
- Discussing a current-events topic (e.g., transit policy, environmental
  issue in Mexico City) with facts and a coherent personal stance.
- Handling an official/bureaucratic task by phone (a `trámite`) including
  an unexpected snag (missing document, wrong office) without abandoning
  the interaction.
- Reading a moderately complex opinion piece or editorial and
  distinguishing the author's claims from the evidence given.

**Advancement criteria (to Advanced High)**
- Qualifying task = discussing an abstract or public-interest topic (not
  just personal/practical) with organized, evidenced reasoning, sustained
  across a multi-turn interaction, with control that holds up even when
  challenged/pushed back on.
- Ceiling probe: an Advanced High–shaped task requiring **hypothesizing**
  ("what would happen if...") or **supporting an opinion with structured
  counter-argument handling** — attempted with at least partial success,
  even if not fully consistent (Advanced High itself is defined by
  *sporadic*, not full, command of Superior-level tasks).

**Failure criteria**
- Breakdown: reasoning stays anecdotal/personal even when the task
  explicitly asks for abstract/public-interest discussion, or control
  collapses when genuinely challenged (vs. just narrating past a
  complication), on ≥2 of last 5 tasks.
- Regression to Advanced Low: 3 consecutive qualifying failures where even
  functional (not-fully-accurate) complication-handling breaks down.

---

### 8.9 Advanced High

**Required communication abilities**
- *Interpersonal:* Converse fluently and accurately on a wide range of
  practical, social, professional, and abstract topics; can sporadically
  perform Superior-level tasks — hypothesize, support opinions with
  structured argumentation, discuss unfamiliar abstract topics — though not
  yet with full consistency across all topics.
- *Interpretive:* Understand most formal and informal spoken/written
  discourse, including implied meaning and some culturally-specific
  nuance, though occasional gaps remain on highly abstract or unfamiliar
  material.
- *Presentational:* Narrate/describe with consistent control across all
  time frames and aspects; produce extended, well-organized discourse
  approaching Superior-level structure (explicit thesis, structured
  support, conclusion) on familiar-to-somewhat-unfamiliar topics.

**Sample real-life scenarios**
- Presenting a structured argument for or against a policy/social issue,
  anticipating and addressing a counter-argument.
- Hypothesizing about a counterfactual ("si México hubiera... ¿qué habría
  pasado?") in an extended, organized response.
- Handling a professional-register interaction (a formal complaint, a
  negotiation) with register control matched to the situation.
- Reading/listening to an unfamiliar abstract topic (economics, policy,
  a cultural-critique piece) and accurately summarizing both the content
  and the author's/speaker's stance, including nuance.

**Advancement criteria** — none within this app; Advanced High is the
ceiling this app tracks toward (matches the existing product scope, which
already targets Novice→Advanced; this redesign extends the ceiling from
Advanced Low to Advanced High to close the gap the prior analysis flagged —
namely that the old system's top level was reachable via MC-grinding alone
and never actually distinguished true upper-range ability). A learner who
sustains Advanced High qualifying evidence is shown as having reached the
app's target range, with an explicit note that Superior-level (unbounded
topic range, fully consistent hypothesizing/argumentation, near-native
error rate) is beyond what this app assesses or claims to teach.

**Failure criteria**
- Breakdown: attempted Superior-shaped tasks (hypothesizing, structured
  argument) collapse into simpler description/narration when the topic is
  unfamiliar or abstract, on ≥2 of last 5 tasks.
- Regression to Advanced Mid: 3 consecutive qualifying failures where even
  familiar-topic complication-handling with full accuracy breaks down.

---

## 9. Composite reporting

- **Per-skill levels are always visible** (Speaking / Writing / Reading /
  Listening, each independently badged with its own confidence/recency
  note) — this replaces the old single hidden number and the three
  disagreeing signals (`selfReportedLevel`, `confirmedLevel`, composite)
  identified in the prior analysis.
- **Headline/composite badge** shown on the Dashboard = the **Speaking**
  level (matching real-world convention, where the OPI is the standard
  headline proficiency rating). If any other skill lags Speaking by more
  than one full sublevel, the badge carries a visible flag (e.g., "Speaking:
  Intermediate High · Writing lagging 2 levels behind — practice Writing")
  rather than silently averaging it away.
- **Evidence log** (new): each level change (up or down) is timestamped
  with the qualifying task ids that triggered it, viewable by the learner —
  turns "why does it say I'm X" from a black box into an inspectable trail.
- **Placement (first run)**: replaces the old fixed 3-questions-per-level
  script with an adaptive placement sequence using the same Elo engine at
  high `K`, ceiling/floor-probing from a mid-range starting difficulty
  (~Intermediate Low) rather than always starting at Novice Low — gets to a
  stable estimate in fewer questions, and immediately starts each of the
  four skill ratings rather than one shared score.

---

## 10. What this replaces, concretely

| Old | New |
|---|---|
| `computeActflEstimate` = `max(xpLevelIdx, scoresLevelIdx)` + can-do boost + permanent `confirmedLevel` floor | Four independent Elo-style per-skill ratings, continuously updated, with decay and reversible regression |
| One flat `scoreOpenResponse` heuristic for all open text | 5-dimension rubric with level-specific anchors, applied per skill with skill-appropriate weighting |
| Section checkpoints (mostly MC) set a permanent floor | Checkpoints still exist for readiness/review, but only performance tasks move a skill's ACTFL level |
| Speaking Test ceiling = last stage scoring ≥55, no consistency requirement | Ceiling/floor probing built into every session via the Elo engine; advancement requires 5 qualifying tasks across ≥3 functions/≥2 contexts |
| `produce` question graded against one fixed canonical string | Writing/Speaking performance tasks always scored by the open rubric, never string-matched |
| App caps at Advanced Low | Extends to Advanced High (9 levels), matching this document's brief |
| `selfReportedLevel`, `confirmedLevel`, composite estimate can silently disagree | Single evidence-log-backed source of truth per skill, reported transparently |

---

Not implemented yet — this is the design to review before any code changes.
