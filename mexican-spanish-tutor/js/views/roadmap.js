// ROADMAP — a Duolingo-style path across all 7 ACTFL levels this app
// targets. Units unlock in order. Every unit, at every level, runs the same
// loop: learn 8 sentences → read the grammar note → take a 10-question unit
// test played with hearts (stakes). Wrong answers cost a heart; running out
// ends the attempt early and you retry. Passing marks the unit complete,
// awards XP, and unlocks the next node.
//
// The unit test is cumulative: three of its ten questions come from units you
// already passed, so grammar and vocabulary keep circling back instead of
// being tested once and forgotten.
//
// At the end of each ACTFL section sits a checkpoint — 15 questions across
// every unit in that section at once. It confirms the level rather than
// gating it: the next level is already reachable by finishing units.
//
// The second tab is the ACTFL Can-Do checklist, which feeds the level
// estimate on the dashboard.

import { store } from "../core/storage.js";
import { el, progressBar, blurActive, toast, confettiBurst } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { gradeItem, QUALITY, masteryLevel, isDue } from "../core/srs.js";
import { getHearts, loseHeart, hasHearts, refillHeartsFully, minutesUntilNextHeart, MAX_HEARTS } from "../core/hearts.js";
import { ACTFL_LEVELS, ROADMAP_UNITS, levelIndex } from "../data/roadmap.js";
import { tappable, initTapWords, englishReveal } from "../core/tapword.js";
import { correctionBlock } from "../core/feedback.js";
import { scenariosByCategory } from "../data/scenarios.js";

// Rough keyword match from a unit's title/subtitle onto a Scenario Mode
// category, so "practice this for real" has somewhere to point without
// needing every one of the 35 units hand-tagged. Units with no match simply
// don't show the link — this is a light-touch connector, not a rebuild of
// the roadmap's own already-solid "learn → use → review" loop.
const SCENARIO_CATEGORY_KEYWORDS = {
  food: /food|comida|restaurant/i,
  shopping: /shop|compra/i,
  transportation: /transport|direcciones/i,
  travel: /travel|viaj/i,
  healthcare: /health|salud|m[ée]dic|doctor/i,
  social: /friend|amistad|famil|social/i,
  workplace: /\bwork\b|trabajo|oficina|empleo/i,
  housing: /hous|casa|departamento|renta/i,
  banking: /bank|banco|dinero/i,
  emergencies: /emergenc|unexpected|imprevist/i,
  government: /government|gobierno|tr[aá]mite/i
};

function scenarioForUnit(unit) {
  const text = `${unit.title} ${unit.subtitle}`;
  for (const [cat, re] of Object.entries(SCENARIO_CATEGORY_KEYWORDS)) {
    if (re.test(text)) {
      const scenarios = scenariosByCategory(cat);
      if (scenarios.length) return scenarios[0];
    }
  }
  return null;
}

const PASS_THRESHOLD = 7; // out of 10

// Every unit ends in a 10-question unit test. Three of those ten come from
// units you already passed, so grammar and vocabulary keep coming back around
// instead of being tested once and dropped. Interleaving old material with new
// is also what makes it stick — testing a unit purely on itself lets you pass
// on short-term memory alone.
const REVIEW_PER_TEST = 3;
// Earlier units are weighted toward the ones you saw recently and the ones the
// SRS says are shaky, so review stays useful instead of drifting back to
// "hola" forever once you're at Advanced Low.
const RECENT_WINDOW = 8;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function completedUnits() {
  return store.state.progress.roadmapUnitsCompleted || (store.state.progress.roadmapUnitsCompleted = []);
}

function skippedUnits() {
  return store.state.progress.roadmapUnitsSkipped || (store.state.progress.roadmapUnitsSkipped = []);
}

// "Earned" means you passed the quiz. "Skipped" means you placed out of it via
// the Level Test or ticked it off yourself. Both count as done for unlocking,
// but they're drawn differently so you can see what you actually did.
function isEarned(id) { return completedUnits().includes(id); }
function isSkipped(id) { return skippedUnits().includes(id); }
function isCompleted(id) { return isEarned(id) || isSkipped(id); }

function toggleSkip(id) {
  const list = skippedUnits();
  const at = list.indexOf(id);
  if (at === -1) list.push(id);
  else list.splice(at, 1);
  store.save();
}

// Opens every unit up to and including `levelCode` for practice. This is the
// point of taking the test: you get ACCESS to the material at your level, not
// a shortcut past it. Nothing is marked as done — these are units to work
// through, they're just no longer gated behind the ones below them.
export function unlockThroughLevel(levelCode) {
  const prev = store.state.profile.unlockedThroughLevel;
  // Never walk the unlock backwards if a later test comes out lower.
  if (prev && levelIndex(prev) >= levelIndex(levelCode)) return 0;
  store.state.profile.unlockedThroughLevel = levelCode;
  store.save();
  return ROADMAP_UNITS.filter((u) => levelIndex(u.level) <= levelIndex(levelCode) && !isCompleted(u.id)).length;
}

export function unlockedThroughLevel() {
  return store.state.profile.unlockedThroughLevel || null;
}

// Mark every unit below `levelCode` as already known, for people who'd rather
// clear them off the path than practise them.
export function skipToLevel(levelCode) {
  const target = levelIndex(levelCode);
  const list = skippedUnits();
  let n = 0;
  ROADMAP_UNITS.forEach((u) => {
    if (levelIndex(u.level) < target && !isCompleted(u.id)) { list.push(u.id); n++; }
  });
  store.save();
  return n;
}

// A unit is playable if you earned your way to it, OR it sits at or below the
// level you tested into. Units above your level still unlock in order.
function isUnlocked(idx) {
  const through = unlockedThroughLevel();
  if (through && levelIndex(ROADMAP_UNITS[idx].level) <= levelIndex(through)) return true;
  if (idx === 0) return true;
  return isCompleted(ROADMAP_UNITS[idx - 1].id);
}

function levelVariant(code) {
  if (code.startsWith("novice")) return "novice";
  if (code.startsWith("intermediate")) return "intermediate";
  return "advanced";
}

const STOPWORDS = new Set(["the", "a", "an", "to", "of", "and", "is", "are", "am", "i", "it", "in", "on", "at", "my", "you", "we", "do", "does"]);

function normalizeWords(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD").replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// Lenient production check: at least half the expected sentence's content
// words need to appear. Typed answers are about recall, not spelling.
function lenientMatch(input, expected) {
  const given = new Set(normalizeWords(input));
  const want = normalizeWords(expected).filter((w) => !STOPWORDS.has(w));
  if (!want.length) return given.size > 0;
  return want.filter((w) => given.has(w)).length / want.length >= 0.5;
}

// Wrong answers are pulled from other units at the same level so they stay
// plausible — a Novice decoy next to an Advanced sentence gives the answer away.
function decoyPool(unit) {
  const sameLevel = ROADMAP_UNITS.filter((u) => u.level === unit.level && u.id !== unit.id);
  return shuffle(sameLevel.flatMap((u) => u.sentences)).slice(0, 30);
}

function decoysFor(unit, correct, n, key) {
  return shuffle([...unit.sentences.filter((s) => s.es !== correct.es), ...decoyPool(unit)])
    .slice(0, n)
    .map((s) => s[key]);
}

// Questions drawn from the current unit, in priority order: if review questions
// take some of the ten slots, the ones dropped are the duplicated kinds at the
// end, never the listening, grammar, or word-order question.
function unitQuestions(unit, count) {
  const pool = shuffle(unit.sentences);
  const esEn = (s) => ({
    kind: "mc", role: "mc-es-en", prompt: s.es, sub: "What does this mean?",
    correct: s.en, options: shuffle([s.en, ...decoysFor(unit, s, 2, "en")]), speak: s.es
  });
  const enEs = (s) => ({
    kind: "mc", role: "mc-en-es", prompt: s.en, sub: "Choose the Spanish",
    correct: s.es, options: shuffle([s.es, ...decoysFor(unit, s, 2, "es")]), spanishOptions: true
  });
  const typed = (s) => ({
    kind: "typed", role: "typed", prompt: s.es, sub: "Type what this means in English",
    expected: s.en, speak: s.es
  });
  // Production in Spanish — the one question type where your own Spanish gets
  // checked and corrected.
  const produce = (s) => ({
    kind: "produce", role: "produce", prompt: s.en,
    sub: "Write this in Spanish — you'll get feedback on your grammar",
    expected: s.es, speak: s.es
  });

  const listen = pool[5] || pool[0];
  const build = pool[6] || pool[1];
  const at = (i) => pool[i % pool.length];

  const ordered = [
    esEn(at(0)),
    enEs(at(3)),
    {
      kind: "listen", role: "listen", prompt: "🔊 Listen and choose what you heard",
      correct: listen.es, options: shuffle([listen.es, ...decoysFor(unit, listen, 2, "es")]),
      speak: listen.es, spanishOptions: true
    },
    unit.drill
      ? {
          kind: "mc", role: "grammar", prompt: unit.drill.question,
          sub: `Grammar: ${unit.grammar.title}`, correct: unit.drill.answer,
          options: shuffle(unit.drill.options), spanishOptions: true
        }
      : esEn(at(4)),
    {
      kind: "build", role: "build", prompt: build.en, correct: build.es,
      words: shuffle(build.es.replace(/[¿?¡!.,]/g, "").split(/\s+/)), speak: build.es
    },
    typed(at(7)),
    esEn(at(1)),
    enEs(at(4)),
    produce(at(5)),
    esEn(at(2))
  ];

  return ordered.slice(0, count);
}

// Which earlier units to bring back. Recent units and ones the SRS rates as
// weak or due score highest; the random term keeps repeat attempts from
// serving the identical three every time.
function pickReviewUnits(unit, n) {
  const idx = ROADMAP_UNITS.findIndex((u) => u.id === unit.id);
  if (idx <= 0) return [];
  const prior = ROADMAP_UNITS.slice(0, idx);
  return prior
    .map((u, i) => {
      const id = `roadmap_${u.id}`;
      const weakness = (100 - masteryLevel(id)) / 100;
      const recent = i >= idx - RECENT_WINDOW ? 0.5 : 0;
      const due = isDue(id) ? 0.5 : 0;
      return { u, score: weakness + recent + due + Math.random() * 0.4 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((s) => s.u);
}

// One grammar question, one meaning question, one typed recall — so both
// halves of an old unit come back, not just its vocabulary.
function reviewQuestions(unit, n) {
  const sources = pickReviewUnits(unit, n);
  if (!sources.length) return [];

  // The grammar slot needs a unit that actually has a drill.
  const withDrill = sources.findIndex((u) => u.drill);
  if (withDrill > 0) sources.unshift(sources.splice(withDrill, 1)[0]);

  return sources.map((src, i) => {
    const tag = { review: true, reviewUnitId: src.id, reviewUnitTitle: src.title };
    const s = shuffle(src.sentences)[0];

    if (i === 0 && src.drill) {
      return {
        kind: "mc", role: "review-grammar", prompt: src.drill.question,
        sub: `Grammar: ${src.grammar.title}`, correct: src.drill.answer,
        options: shuffle(src.drill.options), spanishOptions: true, ...tag
      };
    }
    if (i === 1) {
      return {
        kind: "mc", role: "review-mc", prompt: s.es, sub: "What does this mean?",
        correct: s.en, options: shuffle([s.en, ...decoysFor(src, s, 2, "en")]), speak: s.es, ...tag
      };
    }
    return {
      kind: "typed", role: "review-typed", prompt: s.es,
      sub: "Type what this means in English", expected: s.en, speak: s.es, ...tag
    };
  });
}

// ---------- Section checkpoints ----------
// At the end of each ACTFL section (all the Novice Mid units, all the Novice
// High units, and so on) sits a checkpoint that tests the whole section at
// once. Individual unit tests only ever catch you while the material is fresh;
// this is the one that asks whether the section actually stuck.
//
// It never blocks the path — you reach the next level by finishing units, as
// before. The checkpoint is evidence, not a gate.
const CHECKPOINT_QUESTIONS = 15;
const CHECKPOINT_PASS = 11; // out of 15

export function unitsInLevel(levelCode) {
  return ROADMAP_UNITS.filter((u) => u.level === levelCode);
}

export function checkpointsPassed() {
  return store.state.progress.checkpointsPassed || (store.state.progress.checkpointsPassed = []);
}

export function isCheckpointPassed(levelCode) {
  return checkpointsPassed().includes(levelCode);
}

// Available once every unit in the section is done — passed or ticked off.
// Testing a section you haven't worked through yet would just be noise.
export function isCheckpointReady(levelCode) {
  const units = unitsInLevel(levelCode);
  return units.length > 0 && units.every((u) => isCompleted(u.id));
}

function unitWeakness(unit) {
  const id = `roadmap_${unit.id}`;
  return (100 - masteryLevel(id)) / 100 + (isDue(id) ? 0.5 : 0);
}

// 15 questions spread across every unit in the section. Units are ordered
// weakest-first so the ones you're shakiest on are drawn from first and pick
// up the extra slots when the count doesn't divide evenly.
export function buildCheckpoint(levelCode) {
  const units = unitsInLevel(levelCode);
  if (!units.length) return [];

  const ordered = units.slice().sort((a, b) => unitWeakness(b) - unitWeakness(a));
  // A full spread per unit, so rotating the take-index gives varied kinds
  // rather than fifteen of the same recognition question.
  const perUnit = ordered.map((u) => unitQuestions(u, 10));

  const picked = [];
  let round = 0;
  while (picked.length < CHECKPOINT_QUESTIONS && round < 10) {
    for (let k = 0; k < ordered.length && picked.length < CHECKPOINT_QUESTIONS; k++) {
      const list = perUnit[k];
      const q = list[(round + k) % list.length];
      picked.push({ ...q, sourceUnitId: ordered[k].id, sourceUnitTitle: ordered[k].title });
    }
    round++;
  }
  return shuffle(picked).slice(0, CHECKPOINT_QUESTIONS);
}

// Renders one question card and reports the outcome. Shared by the per-unit
// test and the section checkpoint so both behave identically.
function renderQuestionInto(qWrap, q, afterAnswer) {
    qWrap.innerHTML = "";
    const card = el("div", { class: "card exercise-card" });

    // Say where an unfamiliar question came from, so an old sentence
    // doesn't read as a bug.
    if (q.review) {
      card.appendChild(
        el("span", { class: "badge badge-level", style: "margin-bottom:.5rem" },
          `🔁 Repaso · ${q.reviewUnitTitle}`)
      );
    }

    const promptRow = el("div", { class: "flex justify-between items-center", style: "gap:.5rem" }, [
      el("p", { class: "exercise-prompt", style: "margin:0" }, q.kind === "listen" ? q.prompt : q.prompt),
      q.speak ? el("button", { class: "play-btn", onclick: () => audioEngine.speak(q.speak) }, "🔊") : null
    ].filter(Boolean));
    card.appendChild(promptRow);
    if (q.sub) card.appendChild(el("p", { class: "text-muted", style: "margin:.2rem 0 0;font-size:.85rem" }, q.sub));
    if (q.kind === "listen") audioEngine.speak(q.speak);

    if (q.kind === "mc" || q.kind === "listen") {
      const list = el("div", { class: "option-list", style: "margin-top:.7rem" });
      q.options.forEach((opt) => {
        const btn = el("button", { class: `option-btn ${q.spanishOptions ? "es-text" : ""}` }, opt);
        btn.addEventListener("click", () => {
          list.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
          const ok = opt === q.correct;
          btn.classList.add(ok ? "correct" : "incorrect");
          if (!ok) {
            [...list.children].find((b) => b.textContent === q.correct)?.classList.add("correct");
          }
          afterAnswer(ok, ok ? "" : `The answer is “${q.correct}”.`);
        });
        list.appendChild(btn);
      });
      card.appendChild(list);
    } else if (q.kind === "build") {
      const answer = el("div", { class: "word-bank", style: "margin-top:.7rem" });
      const bank = el("div", { class: "word-bank", style: "margin-top:.5rem;border-style:solid" });
      const picked = [];
      q.words.forEach((w) => {
        const chip = el("button", { class: "word-chip" }, w);
        chip.addEventListener("click", () => {
          picked.push(w);
          chip.remove();
          const placed = el("button", { class: "word-chip" }, w);
          placed.addEventListener("click", () => {
            const i = picked.indexOf(w);
            if (i > -1) picked.splice(i, 1);
            placed.remove();
            bank.appendChild(chip);
          });
          answer.appendChild(placed);
        });
        bank.appendChild(chip);
      });
      card.appendChild(el("p", { class: "text-muted", style: "margin:.5rem 0 0;font-size:.85rem" }, "Tap the words in order to build the Spanish sentence."));
      card.appendChild(answer);
      card.appendChild(bank);
      card.appendChild(
        el("button", {
          class: "btn btn-primary", style: "margin-top:.7rem",
          onclick: () => {
            const given = picked.join(" ").toLowerCase();
            const want = q.correct.replace(/[¿?¡!.,]/g, "").toLowerCase();
            const ok = given === want;
            afterAnswer(ok, ok ? "" : `The answer is “${q.correct}”.`);
          }
        }, "Check")
      );
    } else if (q.kind === "produce") {
      const input = el("input", { type: "text", placeholder: "Escríbelo en español..." });
      input.style.cssText = "width:100%;margin-top:.7rem;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1rem;font-family:var(--font-es);";
      const submit = () => {
        const given = input.value.trim();
        const ok = lenientMatch(given, q.expected);
        // Grammar feedback runs whether or not the answer counted as correct —
        // a right answer can still contain a fixable mistake.
        afterAnswer(ok, `A natural way to say it is \u201C${q.expected}\u201D.`, correctionBlock(given, { compact: true }));
      };
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
      card.appendChild(input);
      card.appendChild(el("button", { class: "btn btn-primary", style: "margin-top:.7rem", onclick: submit }, "Check"));
      setTimeout(() => input.focus(), 30);
    } else {
      const input = el("input", { type: "text", placeholder: "Type your answer in English..." });
      input.style.cssText = "width:100%;margin-top:.7rem;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1rem;";
      const submit = () => {
        const ok = lenientMatch(input.value, q.expected);
        afterAnswer(ok, ok ? "" : `Expected something like “${q.expected}”.`);
      };
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
      card.appendChild(input);
      card.appendChild(el("button", { class: "btn btn-primary", style: "margin-top:.7rem", onclick: submit }, "Check"));
      setTimeout(() => input.focus(), 30);
    }

    qWrap.appendChild(card);
}
// Builds exactly 10 questions: the current unit plus up to three drawn from
// units already passed. Review questions never come first — the test opens on
// what you just learned — and are spaced out rather than clumped at the end.
export function buildQuiz(unit) {
  const reviews = reviewQuestions(unit, REVIEW_PER_TEST);
  const qs = unitQuestions(unit, 10 - reviews.length);
  const positions = [2, 5, 8];
  reviews.forEach((rq, i) => {
    qs.splice(Math.min(positions[i] ?? qs.length, qs.length), 0, rq);
  });
  return qs.slice(0, 10);
}

export function renderRoadmap(container) {
  const teardownTapWords = initTapWords();
  let tab = "path";

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🗺️ Roadmap"),
      el("p", {}, "Your path from Novice Low to Advanced Low. Every unit ends in a 10-question unit test — three of those ten come from units you already passed, so grammar and vocabulary keep coming back. At the end of each ACTFL section there's a 15-question checkpoint covering the whole section.")
    ])
  );

  const tabs = el("div", { class: "tabs" }, [
    el("button", { class: "tab-btn active", onclick: () => setTab("path") }, "Path"),
    el("button", { class: "tab-btn", onclick: () => setTab("candos") }, "Can-Do checklist")
  ]);
  container.appendChild(tabs);

  const body = el("div", {});
  container.appendChild(body);

  function setTab(id) {
    tab = id;
    tabs.querySelectorAll(".tab-btn").forEach((b, i) => b.classList.toggle("active", (i === 0 ? "path" : "candos") === id));
    render();
  }

  function render() {
    body.innerHTML = "";
    body.appendChild(tab === "path" ? renderPath() : renderCanDos());
  }

  // ---------- Heart bar ----------
  function heartBar() {
    const h = getHearts();
    const row = el("div", { class: "flex items-center gap-1", style: "font-size:1.15rem" },
      Array.from({ length: MAX_HEARTS }, (_, i) => el("span", { style: i < h.current ? "" : "opacity:.25" }, "❤️"))
    );
    const note = h.current < MAX_HEARTS
      ? el("span", { class: "text-faint", style: "font-size:.8rem" }, `next heart in ~${minutesUntilNextHeart()} min`)
      : null;
    return el("div", { class: "flex items-center gap-2", style: "flex-wrap:wrap" }, [row, note].filter(Boolean));
  }

  // ---------- Path ----------
  function renderPath() {
    const wrap = el("div", {});
    const done = ROADMAP_UNITS.filter((u) => isCompleted(u.id)).length;
    const earnedCount = ROADMAP_UNITS.filter((u) => isEarned(u.id)).length;

    wrap.appendChild(
      el("div", { class: "card", style: "margin-bottom:1rem" }, [
        el("div", { class: "flex justify-between items-center", style: "flex-wrap:wrap;gap:.5rem" }, [
          el("div", {}, [
            el("div", { class: "card-title", style: "margin-bottom:.2rem" }, `${done} / ${ROADMAP_UNITS.length} units complete`),
            el("div", { class: "text-muted", style: "font-size:.85rem" }, done > earnedCount
              ? `${earnedCount} passed by test · ${done - earnedCount} skipped. Tick the box beside a unit to skip it.`
              : "Units unlock in order. Tick the box beside a unit if you already know it.")
          ]),
          heartBar()
        ]),
        el("div", { style: "margin-top:.6rem" }, [progressBar(Math.round((done / ROADMAP_UNITS.length) * 100))])
      ])
    );

    // A test result should give you ACCESS to everything at your level, not
    // just a shortcut past the easy part. Offer opening first, skipping second.
    const lastTest = (store.state.progress.levelTests || []).slice(-1)[0];
    const lastSpoken = (store.state.progress.speakingTests || []).slice(-1)[0];
    const testedCode = (lastSpoken && lastSpoken.date >= (lastTest?.date || "")) ? lastSpoken.level : lastTest?.level;
    const through = unlockedThroughLevel();

    if (testedCode && (!through || levelIndex(through) < levelIndex(testedCode))) {
      const lvl = ACTFL_LEVELS.find((l) => l.code === testedCode);
      const willOpen = ROADMAP_UNITS.filter((u) => levelIndex(u.level) <= levelIndex(testedCode) && !isCompleted(u.id)).length;
      wrap.appendChild(
        el("div", { class: "card", style: "margin-bottom:1rem;border-left:3px solid var(--accent)" }, [
          el("div", { class: "card-title" }, `📊 Your test says ${lvl.label}`),
          el("p", { class: "text-muted" }, `Open every unit up to ${lvl.label} — that's ${willOpen} unit(s) you can jump straight into and practise, in any order. Nothing gets marked as done; you just don't have to work up to them.`),
          el("div", { class: "btn-row" }, [
            el("button", {
              class: "btn btn-primary",
              onclick: () => {
                const n = unlockThroughLevel(testedCode);
                toast(`Opened ${n} unit(s) through ${lvl.label} — practise any of them.`, { icon: "🔓" });
                render();
              }
            }, `🔓 Open all units through ${lvl.label}`),
            el("button", {
              class: "btn",
              title: "Mark the levels below yours as already known instead of practising them",
              onclick: () => {
                const n = skipToLevel(testedCode);
                unlockThroughLevel(testedCode);
                toast(n ? `Marked ${n} unit(s) as known.` : "Nothing left to mark.", { icon: "⏭️" });
                render();
              }
            }, "⏭️ Just mark them known")
          ])
        ])
      );
    } else if (through) {
      const lvl = ACTFL_LEVELS.find((l) => l.code === through);
      wrap.appendChild(
        el("div", { class: "card", style: "margin-bottom:1rem;border-left:3px solid var(--success)" }, [
          el("div", { class: "card-title" }, `🔓 Everything through ${lvl.label} is open`),
          el("p", { class: "text-muted", style: "margin:0" }, "Jump into any unit at or below your level and practise it in any order. Units above it still unlock as you pass them.")
        ])
      );
    }

    const path = el("div", { class: "roadmap-path" });
    let lastLevel = null;

    ROADMAP_UNITS.forEach((u, idx) => {
      if (u.level !== lastLevel) {
        lastLevel = u.level;
        const l = ACTFL_LEVELS.find((x) => x.code === u.level);
        path.appendChild(
          el("div", { class: "roadmap-tier-header" }, [
            el("span", { class: `badge badge-${levelVariant(l.code)}` }, l.short),
            el("h3", { style: "margin-top:.3rem" }, l.label),
            el("p", { class: "text-muted", style: "font-size:.85rem" }, l.blurb)
          ])
        );
      }

      const earned = isEarned(u.id);
      const skipped = isSkipped(u.id);
      const completed = earned || skipped;
      const unlocked = isUnlocked(idx);
      const state = earned ? "completed" : skipped ? "skipped" : unlocked ? "unlocked" : "locked";
      const offset = idx % 2 === 0 ? "offset-left" : "offset-right";

      const node = el("button", {
        class: `roadmap-node ${state}`,
        // Presence of the attribute disables the button, so only set it when
        // locked — `disabled: false` would still render disabled="false".
        disabled: unlocked ? null : "",
        title: unlocked ? u.title : "Finish the previous unit to unlock",
        onclick: () => (unlocked ? openLesson(u) : toast("Finish the previous unit first.", { icon: "🔒" }))
      }, [
        el("div", { class: "roadmap-node-circle" }, earned ? "✓" : skipped ? "⏭" : unlocked ? u.icon : "🔒"),
        el("div", { class: "roadmap-node-label" }, u.title)
      ]);

      // Tick-off box: mark a unit known and move on without taking the quiz.
      const box = el("button", {
        class: `unit-tick ${completed ? "checked" : ""}`,
        title: earned ? "Passed the unit test" : skipped ? "Marked as known — click to undo" : "Already know this? Tick it off to skip",
        "aria-label": `Mark ${u.title} as known`,
        onclick: () => {
          blurActive();
          if (earned) { toast("You already passed this one.", { icon: "✅" }); return; }
          toggleSkip(u.id);
          render();
        }
      }, completed ? "✓" : "");

      path.appendChild(el("div", { class: `roadmap-node-row ${offset}` }, [node, box]));

      // End of a section? Drop the checkpoint in before the next tier header.
      const next = ROADMAP_UNITS[idx + 1];
      if (!next || next.level !== u.level) path.appendChild(checkpointRow(u.level));
    });

    wrap.appendChild(path);
    return wrap;
  }

  // The end-of-section marker on the path. Deliberately not a gate: when it
  // isn't ready yet it still says what's left rather than just refusing.
  function checkpointRow(levelCode) {
    const l = ACTFL_LEVELS.find((x) => x.code === levelCode);
    const passed = isCheckpointPassed(levelCode);
    const ready = isCheckpointReady(levelCode);
    const units = unitsInLevel(levelCode);
    const remaining = units.filter((u) => !isCompleted(u.id)).length;
    const state = passed ? "passed" : ready ? "ready" : "waiting";

    const btn = el("button", {
      class: `checkpoint-node ${state}`,
      onclick: () => {
        if (ready || passed) return openCheckpoint(levelCode);
        toast(`${remaining} more ${remaining === 1 ? "unit" : "units"} in ${l.label} first.`, { icon: "🏁" });
      }
    }, [
      el("span", { class: "checkpoint-icon" }, passed ? "🏆" : ready ? "🏁" : "🔒"),
      el("span", { class: "checkpoint-text" }, [
        el("strong", {}, `${l.label} checkpoint`),
        el("span", { class: "checkpoint-sub" },
          passed
            ? "Passed — level confirmed. Tap to retake."
            : ready
              ? `${CHECKPOINT_QUESTIONS} questions across all ${units.length} units`
              : `${remaining} more ${remaining === 1 ? "unit" : "units"} to go`)
      ])
    ]);

    return el("div", { class: "checkpoint-row" }, [btn]);
  }

  // ---------- Section checkpoint ----------
  function openCheckpoint(levelCode) {
    const l = ACTFL_LEVELS.find((x) => x.code === levelCode);
    body.innerHTML = "";

    body.appendChild(
      el("div", { class: "card", style: "margin-bottom:.75rem" }, [
        el("div", { class: "flex justify-between items-center", style: "flex-wrap:wrap;gap:.5rem" }, [
          el("div", {}, [
            el("span", { class: `badge badge-${levelVariant(levelCode)}` }, l.short),
            el("h2", { style: "margin:.35rem 0 0" }, `🏁 ${l.label} checkpoint`),
            el("p", { class: "text-muted", style: "margin:0" }, `Everything from the ${unitsInLevel(levelCode).length} units in this section.`)
          ]),
          heartBar()
        ]),
        el("button", { class: "btn btn-sm", style: "margin-top:.6rem", onclick: render }, "← Back to path")
      ])
    );

    const stage = el("div", {});
    body.appendChild(stage);
    showIntro();

    function showIntro() {
      stage.innerHTML = "";
      stage.appendChild(
        el("div", { class: "card" }, [
          el("h3", { class: "card-title" }, "What this is"),
          el("p", {}, `Your unit tests checked each unit while it was fresh. This one asks whether ${l.label} actually stuck — ${CHECKPOINT_QUESTIONS} questions pulled from every unit in the section at once, weighted toward whatever you've been shakiest on.`),
          el("p", { class: "text-muted" }, `Get ${CHECKPOINT_PASS} of ${CHECKPOINT_QUESTIONS} to pass. This doesn't block anything — the next level is already open. Fail it and you'll get a list of the units worth redoing.`),
          el("button", { class: "btn btn-primary", style: "margin-top:.6rem", onclick: startCheckpoint }, `Start checkpoint (${CHECKPOINT_QUESTIONS} questions) →`)
        ])
      );
    }

    function startCheckpoint() {
      if (!hasHearts()) {
        stage.innerHTML = "";
        stage.appendChild(
          el("div", { class: "card empty-state" }, [
            el("div", { class: "empty-icon" }, "💔"),
            el("h3", {}, "You're out of hearts"),
            el("p", {}, `The next one arrives in about ${minutesUntilNextHeart()} minutes.`),
            el("div", { class: "btn-row", style: "justify-content:center" }, [
              el("button", { class: "btn", onclick: render }, "Back to path"),
              el("button", { class: "btn btn-primary", onclick: () => { refillHeartsFully(); toast("Hearts refilled.", { icon: "❤️" }); startCheckpoint(); } }, "Refill now (free)")
            ])
          ])
        );
        return;
      }

      const questions = buildCheckpoint(levelCode);
      let idx = 0;
      let correctCount = 0;
      const missedUnits = new Map(); // unit id -> times missed

      stage.innerHTML = "";
      const head = el("div", { class: "card", style: "margin-bottom:.75rem" });
      const bar = el("div", {});
      const heartSlot = el("div", {});
      head.appendChild(el("div", { class: "flex justify-between items-center", style: "flex-wrap:wrap;gap:.5rem" }, [bar, heartSlot]));
      stage.appendChild(head);
      const qWrap = el("div", {});
      stage.appendChild(qWrap);

      function refreshHead() {
        bar.innerHTML = "";
        bar.appendChild(el("span", { class: "text-muted", style: "font-weight:700" },
          `Question ${Math.min(idx + 1, questions.length)} of ${questions.length}`));
        heartSlot.innerHTML = "";
        heartSlot.appendChild(heartBar());
      }

      function nextQuestion() {
        if (!hasHearts()) return finish(true);
        if (idx >= questions.length) return finish(false);
        refreshHead();
        renderQuestionInto(qWrap, questions[idx], afterAnswer);
      }

      function afterAnswer(wasCorrect, explanation, extraNode) {
        if (wasCorrect) correctCount++;
        else loseHeart();

        // Every question belongs to a unit, so a checkpoint doubles as a
        // spaced-repetition pass over the whole section.
        const asked = questions[idx];
        if (asked && asked.sourceUnitId) {
          gradeItem(`roadmap_${asked.sourceUnitId}`, "roadmap", wasCorrect ? QUALITY.GOOD : QUALITY.AGAIN);
          if (!wasCorrect) missedUnits.set(asked.sourceUnitId, (missedUnits.get(asked.sourceUnitId) || 0) + 1);
          store.save();
        }
        refreshHead();

        const fb = el("div", { class: `feedback-block ${wasCorrect ? "correct" : "incorrect"}`, style: "margin-top:.8rem" }, [
          el("strong", {}, wasCorrect ? "¡Correcto! " : "Not quite — "),
          explanation
        ]);
        qWrap.appendChild(fb);
        if (extraNode) qWrap.appendChild(extraNode);
        qWrap.appendChild(
          el("button", {
            class: "btn btn-primary", style: "margin-top:.7rem",
            onclick: () => { idx++; blurActive(); nextQuestion(); }
          }, idx >= questions.length - 1 ? "See results →" : "Next →")
        );
        fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      function finish(ranOutOfHearts) {
        refreshHead();
        qWrap.innerHTML = "";
        const passed = !ranOutOfHearts && correctCount >= CHECKPOINT_PASS;

        if (passed) {
          const firstTime = !isCheckpointPassed(levelCode);
          if (firstTime) checkpointsPassed().push(levelCode);

          // Passing is direct evidence of the level: tick the section's ACTFL
          // Can-Do statements and hold the estimate at or above it.
          const checked = store.state.progress.canDoCompleted || (store.state.progress.canDoCompleted = []);
          l.canDo.forEach((_, i) => {
            const id = `${levelCode}__${i}`;
            if (!checked.includes(id)) checked.push(id);
          });
          const prev = store.state.profile.confirmedLevel;
          if (!prev || levelIndex(prev) < levelIndex(levelCode)) {
            store.state.profile.confirmedLevel = levelCode;
          }

          registerStudyToday();
          updateSkillScore("grammar", 4);
          updateSkillScore("vocabulary", 4);
          const xp = 50 + correctCount;
          addXP(xp, `${l.label} checkpoint`);
          store.save();
          confettiBurst();

          qWrap.appendChild(
            el("div", { class: "card empty-state pop-in" }, [
              el("div", { class: "empty-icon" }, "🏆"),
              el("h3", {}, `${l.label} confirmed`),
              el("p", {}, `${correctCount} / ${questions.length} correct · +${xp} XP`),
              el("p", { class: "text-muted" }, `Your ${l.canDo.length} ${l.label} Can-Do statements are ticked off, and your level estimate won't read below ${l.short} from here.`),
              el("div", { class: "btn-row", style: "justify-content:center" }, [
                el("button", { class: "btn btn-primary", onclick: render }, "Back to path")
              ])
            ])
          );
        } else {
          // Name the units that actually cost points — a bare score doesn't
          // tell you what to do next.
          const worst = [...missedUnits.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([id]) => ROADMAP_UNITS.find((u) => u.id === id))
            .filter(Boolean);

          qWrap.appendChild(
            el("div", { class: "card empty-state pop-in" }, [
              el("div", { class: "empty-icon" }, ranOutOfHearts ? "💔" : "📚"),
              el("h3", {}, ranOutOfHearts ? "Out of hearts" : "Not this time"),
              el("p", {}, ranOutOfHearts
                ? `You ran out of hearts at ${correctCount} correct.`
                : `You got ${correctCount} / ${questions.length}. You need ${CHECKPOINT_PASS} to pass.`),
              worst.length
                ? el("div", { style: "margin:.6rem 0" }, [
                    el("p", { style: "font-weight:700;margin:0 0 .4rem" }, "Worth redoing first:"),
                    el("div", { class: "btn-row", style: "justify-content:center" },
                      worst.map((u) => el("button", { class: "btn btn-sm", onclick: () => openLesson(u) }, `${u.icon} ${u.title}`)))
                  ])
                : null,
              el("div", { class: "btn-row", style: "justify-content:center;margin-top:.5rem" }, [
                el("button", { class: "btn btn-primary", onclick: render }, "Back to path"),
                el("button", { class: "btn", onclick: startCheckpoint }, "Try again")
              ])
            ].filter(Boolean))
          );
        }
      }

      nextQuestion();
    }
  }

  // ---------- Lesson (learn → grammar → quiz) ----------
  function openLesson(unit) {
    body.innerHTML = "";
    const l = ACTFL_LEVELS.find((x) => x.code === unit.level);

    body.appendChild(
      el("div", { class: "card", style: "margin-bottom:.75rem" }, [
        el("div", { class: "flex justify-between items-center", style: "flex-wrap:wrap;gap:.5rem" }, [
          el("div", {}, [
            el("span", { class: `badge badge-${levelVariant(unit.level)}` }, l.short),
            el("h2", { style: "margin:.35rem 0 0" }, `${unit.icon} ${unit.title}`),
            el("p", { class: "text-muted", style: "margin:0" }, unit.subtitle)
          ]),
          heartBar()
        ]),
        el("button", { class: "btn btn-sm", style: "margin-top:.6rem", onclick: render }, "← Back to path")
      ])
    );

    const stage = el("div", {});
    body.appendChild(stage);
    showLearn();

    function showLearn() {
      stage.innerHTML = "";
      const card = el("div", { class: "card" }, [
        el("h3", { class: "card-title" }, "1 · Learn these sentences"),
        el("p", { class: "text-muted" }, "Tap 🔊 to hear each one. Meaning first — the grammar comes after.")
      ]);
      unit.sentences.forEach((s) => {
        card.appendChild(
          el("div", { style: "padding:.55rem 0;border-bottom:1px solid var(--border)" }, [
            el("div", { class: "flex justify-between items-center", style: "gap:.5rem" }, [
              // Tap any word for its meaning, same as in Story Mode.
              tappable(s.es, "unit-sentence"),
              el("button", { class: "play-btn", style: "width:34px;height:34px;flex-shrink:0", onclick: () => audioEngine.speak(s.es) }, "🔊")
            ]),
            englishReveal(s.en, { className: "text-muted", style: "font-size:.9rem" })
          ])
        );
      });
      card.appendChild(el("button", { class: "btn btn-primary", style: "margin-top:.9rem", onclick: showGrammar }, "Continue →"));
      stage.appendChild(card);
    }

    function showGrammar() {
      stage.innerHTML = "";
      const g = unit.grammar;
      const card = el("div", { class: "card" }, [
        el("h3", { class: "card-title" }, "2 · How it works"),
        el("div", { class: "culture-note-block" }, [
          el("h4", {}, g.title),
          el("p", { style: "font-weight:700;margin:.2rem 0" }, g.pattern),
          el("p", { style: "margin:.3rem 0" }, g.explain)
        ]),
        el("h4", { style: "margin-top:.9rem" }, "Examples"),
        ...g.examples.map((ex) =>
          el("div", { class: "flex justify-between items-center", style: "padding:.35rem 0;border-bottom:1px solid var(--border);gap:.5rem" }, [
            el("div", {}, [
              el("div", { class: "es-text" }, ex.es),
              englishReveal(ex.en, { className: "text-muted", style: "font-size:.85rem" })
            ]),
            el("button", { class: "play-btn", style: "width:32px;height:32px", onclick: () => audioEngine.speak(ex.es) }, "🔊")
          ])
        ),
        el("div", { class: "feedback-block incorrect", style: "margin-top:.8rem" }, [
          el("strong", {}, "Common mistake: "), g.commonMistake
        ]),
        (() => {
          const scenario = scenarioForUnit(unit);
          return scenario
            ? el("a", { class: "btn", style: "margin-top:.8rem;display:inline-block", href: `#/scenarios/${scenario.id}` }, `🎬 Practice this for real: ${scenario.title}`)
            : null;
        })(),
        el("div", { class: "btn-row", style: "margin-top:1rem" }, [
          el("button", { class: "btn", onclick: showLearn }, "← Review sentences"),
          el("button", { class: "btn btn-primary", onclick: startQuiz }, "Start unit test (10 questions) →")
        ])
      ].filter(Boolean));
      stage.appendChild(card);
    }

    // ---------- Quiz ----------
    function startQuiz() {
      if (!hasHearts()) {
        stage.innerHTML = "";
        stage.appendChild(
          el("div", { class: "card empty-state" }, [
            el("div", { class: "empty-icon" }, "💔"),
            el("h3", {}, "You're out of hearts"),
            el("p", {}, `Hearts refill over time — the next one arrives in about ${minutesUntilNextHeart()} minutes. You can keep learning in the meantime.`),
            el("div", { class: "btn-row", style: "justify-content:center" }, [
              el("button", { class: "btn", onclick: render }, "Back to path"),
              el("button", { class: "btn btn-primary", onclick: () => { refillHeartsFully(); toast("Hearts refilled — go get it.", { icon: "❤️" }); startQuiz(); } }, "Refill now (free)")
            ])
          ])
        );
        return;
      }

      const questions = buildQuiz(unit);
      let idx = 0;
      let correctCount = 0;

      stage.innerHTML = "";
      const head = el("div", { class: "card", style: "margin-bottom:.75rem" });
      const bar = el("div", {});
      const heartSlot = el("div", {});
      head.appendChild(el("div", { class: "flex justify-between items-center", style: "flex-wrap:wrap;gap:.5rem" }, [bar, heartSlot]));
      stage.appendChild(head);
      const qWrap = el("div", {});
      stage.appendChild(qWrap);

      function refreshHead() {
        bar.innerHTML = "";
        bar.appendChild(el("span", { class: "text-muted", style: "font-weight:700" }, `Question ${Math.min(idx + 1, 10)} of 10`));
        heartSlot.innerHTML = "";
        heartSlot.appendChild(heartBar());
      }

      function nextQuestion() {
        if (!hasHearts()) return finish(true);
        if (idx >= questions.length) return finish(false);
        refreshHead();
        renderQuestionInto(qWrap, questions[idx], afterAnswer);
      }

      function afterAnswer(wasCorrect, explanation, extraNode) {
        if (wasCorrect) correctCount++;
        else loseHeart();

        // Review questions feed the earlier unit's own SRS entry, so a unit you
        // keep missing here comes back sooner — both in later tests and in the
        // Review tab.
        const asked = questions[idx];
        if (asked && asked.review && asked.reviewUnitId) {
          gradeItem(`roadmap_${asked.reviewUnitId}`, "roadmap", wasCorrect ? QUALITY.GOOD : QUALITY.AGAIN);
          store.save();
        }
        refreshHead();

        const fb = el("div", { class: `feedback-block ${wasCorrect ? "correct" : "incorrect"}`, style: "margin-top:.8rem" }, [
          el("strong", {}, wasCorrect ? "¡Correcto! " : "Not quite — "),
          explanation
        ]);
        qWrap.appendChild(fb);
        if (extraNode) qWrap.appendChild(extraNode);
        qWrap.appendChild(
          el("button", {
            class: "btn btn-primary", style: "margin-top:.7rem",
            onclick: () => { idx++; blurActive(); nextQuestion(); }
          }, idx >= questions.length - 1 ? "See results →" : "Next →")
        );
        fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }


      function finish(ranOutOfHearts) {
        refreshHead();
        qWrap.innerHTML = "";
        const passed = !ranOutOfHearts && correctCount >= PASS_THRESHOLD;

        if (passed) {
          const firstTime = !isCompleted(unit.id);
          if (firstTime) completedUnits().push(unit.id);
          gradeItem(`roadmap_${unit.id}`, "roadmap", correctCount >= 9 ? QUALITY.EASY : QUALITY.GOOD);
          registerStudyToday();
          updateSkillScore("grammar", 2);
          updateSkillScore("vocabulary", 2);
          const xp = 15 + correctCount;
          addXP(xp, `Roadmap: ${unit.title}`);
          store.save();
          confettiBurst();
          qWrap.appendChild(
            el("div", { class: "card empty-state pop-in" }, [
              el("div", { class: "empty-icon" }, "🎉"),
              el("h3", {}, firstTime ? "¡Unidad completada!" : "¡Bien hecho otra vez!"),
              el("p", {}, `${correctCount} / 10 correct · +${xp} XP`),
              firstTime ? el("p", { class: "text-muted" }, "Next unit unlocked.") : null,
              el("div", { class: "btn-row", style: "justify-content:center" }, [
                el("button", { class: "btn btn-primary", onclick: render }, "Back to path"),
                el("button", { class: "btn", onclick: startQuiz }, "Retry unit test")
              ])
            ].filter(Boolean))
          );
        } else {
          qWrap.appendChild(
            el("div", { class: "card empty-state pop-in" }, [
              el("div", { class: "empty-icon" }, ranOutOfHearts ? "💔" : "📚"),
              el("h3", {}, ranOutOfHearts ? "Out of hearts" : "Casi — almost there"),
              el("p", {}, ranOutOfHearts
                ? `You got ${correctCount} right before running out. Review the sentences and try again.`
                : `You got ${correctCount} / 10. You need ${PASS_THRESHOLD} to pass — review and retry.`),
              el("div", { class: "btn-row", style: "justify-content:center" }, [
                el("button", { class: "btn btn-primary", onclick: showLearn }, "Review sentences"),
                el("button", { class: "btn", onclick: startQuiz }, "Try again"),
                el("button", { class: "btn btn-ghost", onclick: render }, "Back to path")
              ])
            ])
          );
        }
      }

      nextQuestion();
    }
  }

  // ---------- Can-Do checklist ----------
  function renderCanDos() {
    const wrap = el("div", {});
    const all = ACTFL_LEVELS.flatMap((l) => l.canDo.map((_, i) => `${l.code}__${i}`));
    const checkedList = store.state.progress.canDoCompleted || (store.state.progress.canDoCompleted = []);
    const checked = checkedList.filter((id) => all.includes(id));

    wrap.appendChild(
      el("div", { class: "roadmap-progress-summary" }, [
        el("span", { class: "text-muted" }, `${checked.length} / ${all.length} checked off`),
        progressBar(Math.round((checked.length / all.length) * 100))
      ])
    );

    ACTFL_LEVELS.forEach((l) => {
      const card = el("div", { class: "card", style: "margin-top:.75rem" }, [
        el("div", { class: "flex justify-between items-center" }, [
          el("div", { class: "card-title" }, `${l.label} (${l.short})`),
          el("span", { class: `badge badge-${levelVariant(l.code)}` }, l.short)
        ]),
        el("p", { class: "text-muted" }, l.blurb)
      ]);
      l.canDo.forEach((c, i) => {
        const id = `${l.code}__${i}`;
        const on = checkedList.includes(id);
        const check = el("button", { class: `can-do-check ${on ? "checked" : ""}`, "aria-label": "Toggle can-do" }, on ? "✓" : "");
        check.addEventListener("click", () => {
          blurActive();
          const at = checkedList.indexOf(id);
          if (at === -1) {
            checkedList.push(id);
            addXP(5, "Can-Do checked off");
          } else {
            checkedList.splice(at, 1);
            store.save();
          }
          check.classList.toggle("checked");
          check.textContent = check.classList.contains("checked") ? "✓" : "";
        });
        card.appendChild(el("div", { class: "can-do-item" }, [check, el("span", {}, c)]));
      });
      wrap.appendChild(card);
    });
    return wrap;
  }

  render();
  // The gloss popup is appended to document.body, so it must be removed when
  // you navigate away from the roadmap.
  return teardownTapWords;
}
