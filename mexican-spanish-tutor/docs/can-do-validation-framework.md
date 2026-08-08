# ACTFL Can-Do Validation Framework

Design-only for §1–§8; §9 onward records what Phase 1 actually implements.
Sibling document to `docs/actfl-assessment-redesign.md` (the per-skill Elo
rating engine for Speaking) — this framework is additive to that work and
reuses its evidence, not a third parallel system.

**Scope guarantee:** nothing in this document, or in Phase 1, modifies
`js/data/roadmap.js`, `js/views/roadmap.js`, `js/core/onboarding.js`,
Immersion Mode, or any app outside `mexican-spanish-tutor/`. The existing
Can-Do checklist (self-check toggle + checkpoint blanket-grant) keeps running
exactly as it does today. This framework is a **separate, additive,
evidence-based validation track** that computes an honest status per
statement without touching the legacy UI or data. Reconciling the two
(replacing the roadmap checklist's self-check/blanket-grant with this
framework's output) is explicitly out of scope until requested separately —
see §11.

---

## 1. Problem recap

The roadmap's 26 Can-Do statements (`ACTFL_LEVELS[].canDo` in
`data/roadmap.js`) are currently granted two ways, neither of which is
performance of the specific statement: a manual self-check toggle (zero
validation, pays XP), and a blanket grant of *every* statement in a level
the moment its 15-question, mostly-recognition checkpoint is passed. See the
prior analysis in this conversation for the full trace.

## 2. Design principles

1. **Per-statement, not per-level.** Each of the 26 statements is validated
   independently, against its own evidence — not inherited from a section
   checkpoint that never tested it.
2. **Decomposed into components.** A statement like "Talk about plans" isn't
   one atomic check; it's broken into the specific sub-abilities a real
   Can-Do rating would require, each independently gradeable.
3. **Evidence-based, reusing the existing rubric.** Every qualifying
   attempt comes from `core/rubricEngine.js`'s 5-dimension scoring of a real
   task in `data/realWorldTasks.js`, recorded by `core/ratingEngine.js` —
   the same infrastructure Speaking Test already uses. No new scoring
   heuristic is invented.
4. **Reversible.** A statement can move from `validated` back to
   `in-progress` on a failure pattern, and decays to `needs-reverification`
   if unreinforced — mirroring the "evidence, not a switch" principle from
   the sibling proficiency-rating doc.
5. **Confidence, not a boolean.** Every statement carries a 0–100 confidence
   score alongside its status, so "validated" always means *how sure*, not
   just yes/no.
6. **Honest about gaps.** Where the current task bank doesn't yet cover a
   statement's component (e.g. no task exists for negotiating plans), the
   framework says so explicitly (`GAP` in §8) rather than quietly validating
   on a loose proxy.

---

## 3. Architecture

```
data/roadmap.js (READ ONLY — statement text/ids, untouched)
        │
        ▼
data/canDoValidation.js  ── per-statement spec: components, required
   (NEW)                     tasks/conversation shape, evidence thresholds,
                             pass/fail rules, marker regexes (for future
                             text-level checks)
        │
        ▼
core/canDoEngine.js  ── reads core/ratingEngine.js's existing
   (NEW)                 state.proficiency.speaking.history (already
                          populated live by Speaking Test, unmodified),
                          evaluates each statement's components against it,
                          computes status + confidence, persists into the
                          new state.canDoValidation branch (storage.js)
        │
        ▼
state.canDoValidation (storage.js, additive)  ── statuses + evidence log,
                                                   separate from the legacy
                                                   progress.canDoCompleted
```

No existing view is modified in Phase 1. The engine is a pure read of
already-collected Speaking Test evidence; nothing changes what a learner
sees today.

---

### 3.1 Component disambiguation (context allow-lists)

Matching a component purely on `function` + `levelIdx` is not enough:
several statements at the same level share a function (e.g. "Handle simple
daily situations" and "Talk about plans" are both `negotiate` at Novice
High; "Explain causes and effects" and "Discuss abstract topics" are both
`persuade` at Advanced Low). Without further restriction, passing one
statement's task would silently validate the other — the exact false-credit
failure mode this framework exists to fix, and one the Phase 1 smoke test
caught in `novice-high__2` before this file was finalized. Every component
therefore carries an optional `contexts` allow-list (§4) restricting which
`data/realWorldTasks.js` context tags its evidence may come from; statements
that are genuinely generic (e.g. "Handle simple daily situations") leave it
unset. Statements whose only distinguishing feature is a context tag that
doesn't exist yet (e.g. `plans`, `abstract-opinion` at Advanced Low, `greeting`)
are scoped to that tag specifically, so they honestly stay `not-started`
rather than piggybacking on an unrelated task's evidence.

## 4. Statement schema

```js
{
  id: "novice-low__0",       // matches data/roadmap.js's existing "<levelCode>__<index>" id
  skill: "speaking",         // which proficiency track's evidence to read (Phase 1: speaking only)
  levelIdx: 0,                // index into data/actflProficiency.js's 9-level ladder
  components: [
    {
      id: "self-identify",
      function: "describe",   // tag matching data/realWorldTasks.js / core/rubricEngine.js function taxonomy; "any" = cross-cutting
      mode: "interpersonal",  // informational — not hard-enforced in Phase 1
      contexts: ["social"],   // allow-list of realWorldTasks.js context tags, or null for "any" (see §3.1)
      requiresConversationTurn: false, // true = needs a task with `followUp`/`complication`
      marker: /\b(me llamo|mi nombre es|soy)\b/i, // reserved for Phase 2 raw-text checks (see §9.3)
      minQualifying: 2,
      minContexts: 1,
      extraCheck: null        // optional (entry) => boolean, for cross-cutting checks like text organization
    }
  ],
  requiredEvidence: { windowDays: 120, staleDays: 120 },
  taskCoverage: "sp-nl-03",   // representative existing task id(s), or "GAP"
  notes: ""
}
```

## 5. Evidence sourcing (Phase 1 scope)

Every qualifying attempt already exists as an entry in
`state.proficiency.speaking.history` (populated by Speaking Test via
`recordTaskOutcome`): `{ date, taskId, levelIdx, function, context, dims,
outcomeS }`. Phase 1 validates Can-Do statements **only from this existing
Speaking evidence** — Writing/Reading/Listening statements can't yet be
validated because those skills have no task bank (per
`data/realWorldTasks.js`'s own header, that's Phase 2+ of the sibling rating
engine). This is a real, current limitation, not a simplification: a
statement like "Talk about plans" today can only accumulate evidence through
Speaking Test sessions.

An entry **qualifies** for a component when:
- `function` matches the component's `function` (or the component is
  `"any"`), **and**
- `levelIdx` equals the statement's `levelIdx`, or `levelIdx + 1` (a
  ceiling-probe success one band up counts as *stronger* evidence, same
  logic as the sibling rating engine's ceiling probes), **and**
- `outcomeS ≥ 0.5` and no rubric dimension scored 0 (a "breakdown", not a
  passable rough edge — same bar `ratingEngine.js` uses for promotion
  evidence), **and**
- falls inside `requiredEvidence.windowDays`, **and**
- (if `extraCheck` is set) the entry's `dims` satisfy it.

## 6. Status state machine

| Status | Meaning |
|---|---|
| `not-started` | Zero qualifying evidence for any component. |
| `in-progress` | At least one component has qualifying evidence, but not every component has met its threshold. |
| `at-risk` | A component has 2 consecutive `outcomeS = 0` attempts at the statement's own level (not a ceiling probe) — flagged before any prior `validated` status is lost. |
| `validated` | Every component has met `minQualifying` + `minContexts` within the evidence window. |
| `needs-reverification` | Was `validated`, but the most recent qualifying evidence for some component is older than `staleDays` — an honest "we're not sure anymore," never a silently-stale green check. |

Transitions are logged to `state.canDoValidation.evidenceLog` (capped at 40
entries, same rolling-window pattern as `proficiency.speaking.evidenceLog`)
whenever a recompute changes a statement's stored status.

## 7. Confidence score (0–100)

For each component: `volume = min(1, qualifyingCount / minQualifying)`,
`breadth = min(1, distinctContexts / minContexts)`, per-component score =
`volume × 0.6 + breadth × 0.4`. The statement's confidence is the mean of
its components' scores × 100, multiplied by 0.6 if the statement is
`needs-reverification` (stale evidence is worth less, not zero — matching
the sibling engine's "confidence band widens" treatment of decay rather than
discarding history outright).

## 8. The 26 statements

Evidence-threshold tiers by level (tighter/higher-stakes at higher levels,
matching real ACTFL's "sustained, consistent" bar getting stricter, not
looser, as level rises):

| Tier | minQualifying | minContexts | windowDays / staleDays |
|---|---|---|---|
| Novice (idx 0–2) | 2 | 1 | 120 |
| Intermediate (idx 3–5) | 2 | 2 | 90 |
| Advanced (idx 6) | 3 | 2 | 60 |

| ID | Statement | Component → function (mode) | Conversation turn required? | Task coverage |
|---|---|---|---|---|
| `novice-low__0` | Introduce myself | describe (interpersonal) | no | `sp-nl-03` |
| `novice-low__1` | Say my name | describe (interpersonal), min 1 | no | `sp-nl-03` (shared) |
| `novice-low__2` | Greet people | describe (interpersonal) | no | **GAP** — no dedicated greeting task |
| `novice-low__3` | Count | sequence (presentational) | no | `sp-nl-02` |
| `novice-low__4` | Identify common objects | describe (presentational) | no | `sp-nl-01` |
| `novice-mid__0` | Answer simple questions | describe (interpersonal) | no | `sp-nm-01`, `sp-nm-03` |
| `novice-mid__1` | Discuss family | describe (interpersonal) | no | `sp-nm-01` |
| `novice-mid__2` | Order food | negotiate (interpersonal) | no | `sp-nm-02` |
| `novice-mid__3` | Talk about likes and dislikes | compare (interpersonal) | no | `sp-nm-03` |
| `novice-high__0` | Handle simple daily situations | negotiate (interpersonal) | no | `sp-nh-02` |
| `novice-high__1` | Describe routines | describe (presentational) | no | `sp-nh-01` |
| `novice-high__2` | Talk about plans | negotiate (interpersonal) | no | **GAP** — no "plans" context task; see §8.1 |
| `intermediate-low__0` | Maintain short conversations | negotiate (interpersonal) | yes | `sp-il-03` |
| `intermediate-low__1` | Ask follow-up questions | negotiate (interpersonal) | yes | `sp-il-03` only — **thin coverage**, see §8.1 |
| `intermediate-low__2` | Talk about personal experiences | narrate (presentational/interpersonal) | yes (followUp) | `sp-il-01`, `sp-il-02` |
| `intermediate-mid__0` | Discuss familiar topics in detail | describe (presentational) | yes (followUp) | `sp-im-03` |
| `intermediate-mid__1` | Describe events | narrate (presentational) | yes (followUp) | `sp-im-01` |
| `intermediate-mid__2` | Explain preferences | advise (interpersonal) | no | `sp-im-04` |
| `intermediate-high__0` | Narrate across time frames | narrate (presentational) | yes (complication) | `sp-ih-01` |
| `intermediate-high__1` | Handle unexpected situations | negotiate (interpersonal) | yes (complication) | `sp-ih-02` |
| `intermediate-high__2` | Support opinions | persuade (interpersonal) | no | `sp-ih-03` |
| `advanced-low__0` | Narrate and describe in all major time frames | narrate (presentational) | no | `sp-al-01` |
| `advanced-low__1` | Explain causes and effects | persuade (presentational) | no | `sp-al-03` |
| `advanced-low__2` | Discuss abstract topics | persuade (presentational) | no | `sp-al-03` (partial) — **GAP**, see §8.1 |
| `advanced-low__3` | Defend opinions | persuade (interpersonal) | yes (complication) | `sp-al-02` |
| `advanced-low__4` | Speak in organized paragraphs | any function, `dims.textType ≥ 3` | no | any Advanced Low task |

### 8.1 Known task-bank gaps (Phase 2 authoring, not Phase 1 code)

- **`novice-low__2` "Greet people"** — no task in `realWorldTasks.js` is
  tagged for a standalone greeting exchange.
- **`novice-high__2` "Talk about plans"** — this is the statement from the
  original bug report. No task currently exercises suggesting a time/date,
  accepting, declining, or rescheduling. The component is defined
  (`negotiate`, interpersonal) so the engine is *ready* to validate it the
  moment a `context: "plans"` task exists, but until then this statement can
  only reach `not-started`. This is intentional: it must not silently
  validate on a loose proxy.
- **`intermediate-low__1` "Ask follow-up questions"** — only one existing
  task (`sp-il-03`) explicitly instructs the learner to produce their own
  follow-up question within a single response. Real component-level
  detection (did the learner's own text actually contain a question, not
  just respond to one) requires raw response text, which
  `ratingEngine.recordTaskOutcome` does not currently store (see §9.3) —
  Phase 1 can only credit this component via the `function`/`context`
  signal already available, not by confirming a question was actually
  asked.
- **`advanced-low__2` "Discuss abstract topics"** — the `abstract-opinion`
  context tag only appears on Advanced High tasks today; Advanced Low reuses
  `civic` as an imperfect proxy.

---

## 9. Phasing

### Phase 1 (implemented now)
- `data/canDoValidation.js`: full spec for all 26 statements.
- `core/canDoEngine.js`: evaluates every statement from existing
  `proficiency.speaking.history`, computes status + confidence, persists to
  `state.canDoValidation`.
- `core/storage.js`: additive `state.canDoValidation` branch.
- No UI changes. No changes to `progress.canDoCompleted`, the roadmap
  checklist, the checkpoint blanket-grant, or the composite ACTFL estimate.
  A learner's on-screen experience is unchanged; the new system computes
  quietly in parallel and can be inspected via the exported functions in
  `core/canDoEngine.js`, and later a dashboard/roadmap surface can be added
  once approved.

### Phase 2 (not implemented — needs separate approval)
- Extend `ratingEngine.recordTaskOutcome` to optionally store the learner's
  raw response text in each history entry (additive field), and update
  Speaking Test to pass it, so component `marker` regexes (§4) can actually
  run — enables real detection of "asked a follow-up," "suggested a time,"
  "declined," "rescheduled," etc., instead of relying on the task's
  `function` tag alone.
- Author the task-bank content flagged as `GAP` in §8.1 (a `plans` context,
  a standalone greeting task, more follow-up-required tasks, more
  `abstract-opinion` tasks at Advanced Low).

### Phase 3 (not implemented)
- Writing/Reading/Listening task banks + rubric wiring (mirrors the sibling
  proficiency-rating doc's own Phase 2+), so those statements can accumulate
  evidence beyond Speaking.

### Phase 4 (not implemented — requires explicit approval to touch `roadmap.js`)
- Reconcile with the legacy roadmap checklist: replace the self-check
  toggle and checkpoint blanket-grant with this framework's computed
  status, and surface per-statement evidence/confidence in the Can-Do tab
  UI. Deliberately deferred — this document's scope is Speaking-app-internal
  files only, per the current task's explicit instruction not to modify
  `roadmap.js`.

---

## 10. What this does not do (yet)

- It does not remove or disable the legacy self-check toggle or the
  checkpoint blanket-grant — both still run exactly as before.
- It does not change `computeActflEstimate()`'s `canDoBoost` — that still
  reads the legacy `progress.canDoCompleted`, untouched.
- It does not add any new UI.
- It does not validate Writing, Reading, or Listening statements (no task
  bank exists for those skills yet).

## 11. Explicit boundary

This framework and its Phase 1 implementation touch only:
`docs/can-do-validation-framework.md` (new), `js/data/canDoValidation.js`
(new), `js/core/canDoEngine.js` (new), `js/core/storage.js` (additive edit).
Nothing in `js/data/roadmap.js`, `js/views/roadmap.js`,
`js/core/onboarding.js`, `js/views/immersion.js`, `js/core/immersion*`, or
any file under `mandarin-tutor/`, `japanese-speaking/`,
`seed-english-tokyo/`, or the repo root (Vamos) is read for context beyond
`data/roadmap.js`'s statement text (read-only import), let alone modified.
