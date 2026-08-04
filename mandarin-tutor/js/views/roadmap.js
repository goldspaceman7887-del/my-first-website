// ROADMAP MODE — a Duolingo-style path spanning all 9 ACTFL sub-levels,
// Novice Low through Advanced High. Each unit follows grammar -> vocabulary
// -> sentences -> practice: the grammar point is explained first, then the
// individual words/characters it's built from, then the 8 full sentences
// in context, then an 8-exercise practice round (recognition, a grammar-
// specific drill, and typed free-recall production) before the next unit
// unlocks. Passing a unit also seeds it into the spaced-repetition Review
// queue, so it actually comes back later instead of being seen once and
// forgotten.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive, toast, progressBar, downloadJSON } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday } from "../core/gamification.js";
import { gradeItem, QUALITY } from "../core/srs.js";
import { ROADMAP_UNITS, ACTFL_LEVELS, levelIndex, HSK_LEVELS, hskForLevel, hskInfo } from "../data/roadmap.js";
import { CAN_DO_STATEMENTS } from "../data/canDo.js";
import { VOCABULARY } from "../data/vocabulary.js";
import { findCharacter } from "../core/lookup.js";

function completedSet() {
  return new Set(store.state.progress.roadmapUnitsCompleted || []);
}

function skippedSet() {
  return new Set(store.state.progress.roadmapUnitsSkipped || []);
}

// Marks a unit as skipped: it counts toward unlocking the next one, but
// earns no XP and doesn't get seeded into the spaced-repetition Review
// queue. Shared by the in-unit "Skip this unit" button and the on-path
// skip-ahead node.
function skipUnitAction(unit, onDone) {
  if (!window.confirm(`Skip "${unit.title}" for now? It won't be added to your spaced-repetition review queue or earn XP, but the next unit will unlock. You can come back and do it properly anytime.`)) return;
  blurActive();
  const done = completedSet();
  const skipped = skippedSet();
  done.add(unit.id);
  skipped.add(unit.id);
  store.state.progress.roadmapUnitsCompleted = [...done];
  store.state.progress.roadmapUnitsSkipped = [...skipped];
  store.save();
  toast("Unit skipped -- the next one is unlocked. Come back anytime from the roadmap.", { type: "info", icon: "⏭️" });
  if (onDone) onDone();
}

function unitStatus(index, done) {
  if (done.has(ROADMAP_UNITS[index].id)) return "completed";
  if (index === 0 || done.has(ROADMAP_UNITS[index - 1].id)) return "unlocked";
  return "locked";
}

// Current ACTFL tier = the tier of the next not-yet-completed unit, or the
// top tier once everything is done.
function currentLevel(done) {
  const nextUnit = ROADMAP_UNITS.find((u) => !done.has(u.id));
  const level = nextUnit ? nextUnit.level : ROADMAP_UNITS[ROADMAP_UNITS.length - 1].level;
  return ACTFL_LEVELS[levelIndex(level)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Vocabulary actually used in this unit's sentences, computed on the fly
// against the existing curriculum data rather than hand-authored per unit.
function unitVocab(unit) {
  const text = unit.sentences.map((s) => s.zh).join("");
  const words = VOCABULARY.filter((v) => text.includes(v.word));
  const coveredChars = new Set(words.flatMap((v) => [...v.word]));
  const chars = [...new Set(text)]
    .map((ch) => findCharacter(ch))
    .filter((c) => c && !coveredChars.has(c.char));
  return { words, chars };
}

// Strips combining tone-mark diacritics so pinyin can be compared regardless
// of whether the learner typed tone marks (nǐ hǎo) or plain letters (ni hao).
function stripDiacritics(s) {
  return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function normalizePinyinLoose(s) {
  return stripDiacritics(s).toLowerCase().replace(/[^a-z]/g, "");
}
function normalizeChinese(s) {
  return String(s || "").replace(/[，。？！,.?!、\s]/g, "");
}

// Lenient Chinese production check: accepts an exact hanzi match, a plain
// (tone-optional) pinyin match, or a near-exact hanzi match (most of the
// expected characters present, similar length) so small typos still pass.
function chineseMatch(input, expectedZh, expectedPy) {
  const raw = String(input || "").trim();
  if (!raw) return false;
  const normInput = normalizeChinese(raw);
  const normExpectedZh = normalizeChinese(expectedZh);
  if (normInput === normExpectedZh) return true;

  const hasCJK = /[\u4e00-\u9fff]/.test(raw);
  if (!hasCJK) {
    return normalizePinyinLoose(raw) === normalizePinyinLoose(expectedPy);
  }

  const expectedChars = [...normExpectedZh];
  const inputChars = new Set([...normInput]);
  const matched = expectedChars.filter((c) => inputChars.has(c)).length;
  return expectedChars.length > 0 && matched / expectedChars.length >= 0.8 && Math.abs(normInput.length - normExpectedZh.length) <= 2;
}

// 8 exercises per attempt: 4 recognition MC, 1 grammar-specific drill,
// 3 typed free-recall production -- draws on all 8 taught sentences plus
// the unit's core grammar point, mixed and reshuffled on every attempt.
function buildPracticeSet(unit) {
  const pool = shuffle(unit.sentences);
  const mcPool = pool.slice(0, 4);
  const typedPool = pool.slice(4, 7);
  const exercises = [];

  mcPool.forEach((correct) => {
    const distractors = shuffle(unit.sentences.filter((s) => s !== correct)).slice(0, 2).map((s) => s.en);
    const options = shuffle([correct.en, ...distractors]);
    exercises.push({ type: "mc", zh: correct.zh, py: correct.py, correct: correct.en, options });
  });

  if (unit.drill) {
    exercises.push({ type: "drill", question: unit.drill.question, options: shuffle(unit.drill.options), answer: unit.drill.answer });
  }

  typedPool.forEach((s) => {
    exercises.push({ type: "typed", zh: s.zh, py: s.py, expected: s.en });
  });

  return shuffle(exercises);
}

function seedRoadmapReview(unit) {
  const id = `roadmap_${unit.id}`;
  if (store.state.srs[id]) return;
  gradeItem(id, "roadmap", QUALITY.GOOD);
}

export function renderRoadmap(container) {
  const state = { view: "path" };

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("div", { class: "flex justify-between items-center flex-wrap gap-2" }, [
        el("h1", {}, "🗺️ Roadmap"),
        el(
          "button",
          {
            class: "btn btn-sm",
            title: "Download a backup of your progress",
            onclick: () => {
              downloadJSON("mandarin-tutor-progress.json", store.exportJSON());
              toast("Progress saved to a file on your device.", { type: "success", icon: "💾" });
            }
          },
          "💾 Save my progress"
        )
      ]),
      el("p", {}, "A path from zero to ACTFL Advanced High — Novice Low through Advanced High. Each unit: the grammar point first, then the individual vocabulary it uses, then 8 full sentences in context, then an 8-exercise practice round."),
      el("p", { class: "text-faint" }, "Passing a unit adds it to your spaced-repetition Review queue, so it comes back later instead of being seen once and forgotten. Every unit is open, not just the next one in line — jump ahead to preview or use any unit for review anytime, no need to go strictly in order."),
      el("p", { class: "text-faint" }, "Your progress already saves automatically in this browser as you go. Tap \"Save my progress\" any time to download a backup file — keep it somewhere safe, or import it (in Settings) on another device to pick up where you left off.")
    ])
  );

  const tabs = el("div", { class: "tabs" }, [tabBtn("path", "🗺️ Path"), tabBtn("candos", "✅ Can-Do Checklist")]);
  container.appendChild(tabs);

  const body = el("div", {});
  container.appendChild(body);

  function tabBtn(id, label) {
    const b = el("button", { class: `tab-btn ${state.view === id ? "active" : ""}`, onclick: () => setView(id) }, label);
    b.dataset.viewId = id;
    return b;
  }
  function setView(id) {
    state.view = id;
    tabs.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.viewId === id));
    render();
  }
  function render() {
    body.innerHTML = "";
    if (state.view === "candos") showCanDo();
    else showPath();
  }

  render();

  function showPath() {
    const done = completedSet();
    const skipped = skippedSet();
    const level = currentLevel(done);
    const track = store.state.settings.roadmapTrack === "hsk" ? "hsk" : "actfl";

    body.appendChild(
      el("div", { class: "roadmap-progress-summary" }, [
        el("span", { class: "badge badge-gold" }, `${done.size} / ${ROADMAP_UNITS.length} units complete`),
        skipped.size > 0 ? el("span", { class: "badge badge-default" }, `⏭ ${skipped.size} skipped`) : null,
        el("span", { class: "badge badge-level" }, track === "hsk" ? `Current tier: HSK ${hskForLevel(level.code)}` : `Current tier: ${level.label}`),
        el("div", { style: "flex:1" }, [progressBar(Math.round((done.size / ROADMAP_UNITS.length) * 100))])
      ].filter(Boolean))
    );

    const trackRow = el("div", { class: "level-pills" }, [
      trackPill("actfl", "ACTFL levels"),
      trackPill("hsk", "HSK 1–6")
    ]);
    body.appendChild(trackRow);
    body.appendChild(
      el(
        "p",
        { class: "text-faint", style: "margin-top:.4rem" },
        track === "hsk"
          ? "HSK bands here are an approximate correlation based on the grammar each unit teaches — there's no single official ACTFL↔HSK crosswalk, so treat this as a helpful guide rather than an exact equivalence."
          : "Switch to HSK 1–6 if you're studying toward the HSK exam — the same units and progression, just grouped by HSK band instead of ACTFL sub-level."
      )
    );

    function trackPill(id, label) {
      const b = el(
        "button",
        {
          class: `level-pill ${track === id ? "active" : ""}`,
          onclick: () => { store.set("settings.roadmapTrack", id); render(); }
        },
        label
      );
      return b;
    }

    const path = el("div", { class: "roadmap-path" });
    let lastLevel = null;
    let lastHsk = null;
    ROADMAP_UNITS.forEach((unit, i) => {
      if (track === "hsk") {
        const hsk = hskForLevel(unit.level);
        if (hsk !== lastHsk) {
          lastHsk = hsk;
          const info = hskInfo(hsk);
          path.appendChild(
            el("div", { class: "roadmap-tier-header" }, [
              el("h3", {}, info.label),
              el("p", { class: "text-faint" }, info.blurb)
            ])
          );
        }
      } else if (unit.level !== lastLevel) {
        lastLevel = unit.level;
        const tier = ACTFL_LEVELS[levelIndex(unit.level)];
        path.appendChild(
          el("div", { class: "roadmap-tier-header" }, [
            el("h3", {}, tier.label),
            el("p", { class: "text-faint" }, tier.blurb)
          ])
        );
      }
      const status = unitStatus(i, done);
      const wasSkipped = skippedSet().has(unit.id);
      const side = i % 3 === 0 ? "" : i % 3 === 1 ? "offset-left" : "offset-right";
      const mainNode = el(
        "button",
        {
          class: `roadmap-node ${status}`,
          title: wasSkipped ? "Skipped -- tap to go back and do it properly" : status === "locked" ? "Not reached yet in your path -- tap to preview or use for review anytime" : null,
          onclick: () => showUnit(unit)
        },
        [
          el("div", { class: "roadmap-node-circle" }, status === "locked" ? "🔓" : status === "completed" ? (wasSkipped ? "⏭" : "✓") : unit.icon),
          el("div", { class: "roadmap-node-label" }, unit.title)
        ]
      );
      const rowChildren = [mainNode];
      if (status === "unlocked") {
        rowChildren.unshift(
          el(
            "button",
            {
              class: "roadmap-skip-node",
              title: `Skip "${unit.title}" and move on`,
              onclick: () => skipUnitAction(unit, render)
            },
            "⏭"
          )
        );
      }
      const row = el("div", { class: `roadmap-node-row ${side}` }, [
        el("div", { class: "roadmap-node-cluster" }, rowChildren)
      ]);
      path.appendChild(row);
    });
    body.appendChild(path);
  }

  function showCanDo() {
    const checked = new Set(store.state.progress.canDoChecked || []);
    const track = store.state.settings.roadmapTrack === "hsk" ? "hsk" : "actfl";
    const totalStatements = ACTFL_LEVELS.reduce((sum, l) => sum + CAN_DO_STATEMENTS[l.code].length, 0);

    const overallBadge = el("span", { class: "badge badge-gold" }, `${checked.size} / ${totalStatements} checked off`);
    const overallBar = progressBar(Math.round((checked.size / totalStatements) * 100));
    body.appendChild(
      el("div", { class: "roadmap-progress-summary" }, [overallBadge, el("div", { style: "flex:1" }, [overallBar])])
    );
    body.appendChild(
      el("p", { class: "text-faint" }, "Self-assessment, not a test: check off a statement once you feel you can actually do it in a real conversation, not just recognize it on a flashcard. Written for this course, not copied from any official ACTFL document.")
    );

    function refreshOverall() {
      const n = (store.state.progress.canDoChecked || []).length;
      overallBadge.textContent = `${n} / ${totalStatements} checked off`;
      overallBar.querySelector(".progress-bar-fill").style.width = `${Math.round((n / totalStatements) * 100)}%`;
    }

    ACTFL_LEVELS.forEach((tier) => {
      const statements = CAN_DO_STATEMENTS[tier.code] || [];
      const levelDone = statements.filter((s) => checked.has(s.id)).length;
      const heading = track === "hsk" ? `${tier.label} · HSK ${hskForLevel(tier.code)}` : tier.label;

      const levelBadge = el("span", { class: "badge badge-default" }, `${levelDone} / ${statements.length}`);
      function refreshLevelBadge() {
        const n = statements.filter((s) => (store.state.progress.canDoChecked || []).includes(s.id)).length;
        levelBadge.textContent = `${n} / ${statements.length}`;
      }

      const card = el("div", { class: "card", style: "margin-top:1rem" });
      card.appendChild(
        el("div", { class: "flex justify-between items-center flex-wrap gap-2" }, [
          el("h3", { class: "card-title" }, heading),
          levelBadge
        ])
      );
      card.appendChild(el("p", { class: "text-faint", style: "margin-top:.2rem" }, tier.blurb));

      statements.forEach((s) => {
        const isChecked = checked.has(s.id);
        const row = el("label", { class: "candoItem", style: "display:flex;align-items:flex-start;gap:.6rem;margin-top:.6rem;cursor:pointer" });
        const box = el("input", { type: "checkbox" });
        box.checked = isChecked;
        box.addEventListener("change", () => {
          const set = new Set(store.state.progress.canDoChecked || []);
          if (box.checked) set.add(s.id);
          else set.delete(s.id);
          store.state.progress.canDoChecked = [...set];
          store.save();
          row.classList.toggle("is-checked", box.checked);
          refreshLevelBadge();
          refreshOverall();
        });
        row.classList.toggle("is-checked", isChecked);
        row.appendChild(box);
        row.appendChild(el("span", {}, s.text));
        card.appendChild(row);
      });

      body.appendChild(card);
    });
  }

  function showUnit(unit) {
    body.innerHTML = "";
    body.appendChild(
      el("div", { class: "flex justify-between items-center flex-wrap gap-2" }, [
        el("button", { class: "btn btn-sm", onclick: render }, "← Roadmap"),
        el("button", { class: "btn btn-sm btn-ghost", onclick: skipUnit }, "⏭ Skip this unit for now")
      ])
    );
    body.appendChild(el("span", { class: "badge badge-level", style: "margin-top:.75rem;display:inline-block" }, ACTFL_LEVELS[levelIndex(unit.level)].label));
    body.appendChild(el("h2", { style: "margin-top:.4rem" }, `${unit.icon} ${unit.title} · ${unit.titleZh}`));
    runGrammarStep();

    function skipUnit() {
      skipUnitAction(unit, render);
    }

    function stepHeader(n, total, label) {
      return el("p", { class: "text-faint" }, `Step ${n} of ${total} · ${label}`);
    }

    function runGrammarStep() {
      const wrap = el("div", {});
      body.appendChild(wrap);
      wrap.appendChild(stepHeader(1, 4, "Grammar point"));
      if (unit.grammar) {
        const g = unit.grammar;
        wrap.appendChild(
          el("div", { class: "card grammar-note", style: "border-left:3px solid var(--accent)" }, [
            el("div", { class: "badge badge-gold" }, "📐 New Grammar Point"),
            el("h3", { style: "margin-top:.5rem" }, g.title),
            el("p", { style: "font-family:var(--font-zh);font-weight:700" }, g.pattern),
            el("p", { class: "text-muted" }, g.explain),
            el("div", {}, g.examples.map((ex) =>
              el("p", { style: "margin:.3rem 0" }, [
                el("span", { class: "hanzi" }, ex.zh),
                el("span", { class: "text-faint" }, ` — ${ex.py} — ${ex.en}`)
              ])
            )),
            g.commonMistake ? el("p", { class: "text-faint", style: "margin-top:.4rem" }, [el("strong", {}, "Watch out: "), g.commonMistake]) : null
          ].filter(Boolean))
        );
      }
      const nextBtn = el("button", { class: "btn btn-primary", style: "margin-top:1rem", onclick: () => { wrap.remove(); runVocabStep(); } }, "Continue to vocabulary →");
      wrap.appendChild(nextBtn);
    }

    function runVocabStep() {
      const wrap = el("div", {});
      body.appendChild(wrap);
      wrap.appendChild(stepHeader(2, 4, "Vocabulary in this unit"));
      wrap.appendChild(el("p", { class: "text-muted" }, "The words and characters you'll see in this unit's sentences."));
      const { words, chars } = unitVocab(unit);
      if (words.length) {
        const grid = el("div", { class: "grid grid-auto" });
        words.forEach((v) => {
          grid.appendChild(
            el("div", { class: "card", style: "padding:.7rem" }, [
              el("div", { class: "flex justify-between items-center" }, [
                el("span", { class: "hanzi", style: "font-weight:700" }, v.word),
                el("button", { class: "play-btn", style: "width:30px;height:30px", onclick: () => audioEngine.speak(v.word) }, "🔊")
              ]),
              el("div", { class: "text-muted", style: "font-size:.85rem" }, `${v.pinyin} — ${v.meaning}`)
            ])
          );
        });
        wrap.appendChild(grid);
      }
      if (chars.length) {
        wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Other characters used"));
        wrap.appendChild(el("div", { class: "char-grid" }, chars.map((c) =>
          el("div", { class: "char-tile", onclick: () => audioEngine.speak(c.char) }, [
            el("div", { class: "hz" }, c.char),
            el("div", { class: "py" }, c.pinyin)
          ])
        )));
      }
      if (!words.length && !chars.length) {
        wrap.appendChild(el("p", { class: "text-faint" }, "Nothing new to flag here — continue to the sentences."));
      }
      const nextBtn = el("button", { class: "btn btn-primary", style: "margin-top:1rem", onclick: () => { wrap.remove(); runSentencesStep(); } }, "Continue to sentences →");
      wrap.appendChild(nextBtn);
    }

    function runSentencesStep() {
      const wrap = el("div", {});
      body.appendChild(wrap);
      wrap.appendChild(stepHeader(3, 4, "Sentences in context"));
      wrap.appendChild(el("p", { class: "text-muted" }, "Read and listen to each sentence, then continue to practice."));
      unit.sentences.forEach((s) => {
        wrap.appendChild(
          el("div", { class: "roadmap-lesson-sentence" }, [
            el("div", { class: "flex justify-between items-center" }, [
              el("div", { class: "hanzi", style: "font-size:1.15rem" }, s.zh),
              el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(s.zh) }, "🔊")
            ]),
            el("div", { class: "pinyin" }, s.py),
            el("div", { class: "text-muted" }, s.en)
          ])
        );
      });
      const nextBtn = el("button", { class: "btn btn-primary", style: "margin-top:1rem", onclick: () => { wrap.remove(); runPracticeStep(); } }, "Continue to practice →");
      wrap.appendChild(nextBtn);
    }

    function runPracticeStep() {
      let exercises = buildPracticeSet(unit);
      let qi = 0;
      let correctCount = 0;
      const practiceWrap = el("div", { class: "card exercise-card" });
      body.appendChild(el("p", { class: "text-faint" }, "Step 4 of 4 · Practice"));
      body.appendChild(practiceWrap);
      showExercise();

      function markResult(isCorrect, resultNode) {
        blurActive();
        if (isCorrect) correctCount++;
        practiceWrap.appendChild(resultNode);
        setTimeout(() => {
          qi++;
          if (qi < exercises.length) showExercise();
          else finishPractice();
        }, isCorrect ? 900 : 1600);
      }

      function showExercise() {
        practiceWrap.innerHTML = "";
        const q = exercises[qi];
        practiceWrap.appendChild(el("p", { class: "text-faint" }, `Exercise ${qi + 1} of ${exercises.length}`));

        if (q.type === "mc") {
          practiceWrap.appendChild(el("div", { class: "flex justify-between items-center" }, [
            el("p", { class: "exercise-prompt hanzi" }, q.zh),
            el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(q.zh) }, "🔊")
          ]));
          practiceWrap.appendChild(el("p", { class: "text-faint" }, q.py));
          const options = el("div", { class: "option-list" }, q.options.map((opt) =>
            el("button", { class: "option-btn", onclick: (e) => {
              const btn = e.currentTarget;
              options.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
              const isCorrect = opt === q.correct;
              btn.classList.add(isCorrect ? "correct" : "incorrect");
              if (!isCorrect) [...options.children].find((b) => b.textContent === q.correct)?.classList.add("correct");
              markResult(isCorrect, el("div"));
            } }, opt)
          ));
          practiceWrap.appendChild(options);
        } else if (q.type === "drill") {
          practiceWrap.appendChild(el("div", { class: "badge badge-gold" }, "📐 Grammar drill"));
          practiceWrap.appendChild(el("p", { class: "exercise-prompt hanzi", style: "margin-top:.4rem" }, q.question));
          const options = el("div", { class: "option-list" }, q.options.map((opt) =>
            el("button", { class: "option-btn", onclick: (e) => {
              const btn = e.currentTarget;
              options.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
              const isCorrect = opt === q.answer;
              btn.classList.add(isCorrect ? "correct" : "incorrect");
              if (!isCorrect) [...options.children].find((b) => b.textContent === q.answer)?.classList.add("correct");
              markResult(isCorrect, el("div"));
            } }, opt)
          ));
          practiceWrap.appendChild(options);
        } else {
          // typed production: given the English meaning, produce the Chinese
          // sentence yourself -- typed as characters (if you have a Chinese
          // keyboard/IME) or as plain pinyin without tone marks, either works.
          practiceWrap.appendChild(el("div", { class: "badge badge-gold" }, "✍️ Your turn"));
          practiceWrap.appendChild(el("p", { class: "exercise-prompt", style: "margin-top:.4rem" }, q.expected));
          practiceWrap.appendChild(el("p", { class: "text-muted" }, "Type this in Chinese -- characters or plain pinyin (tones optional) both work."));
          const input = el("input", { type: "text", placeholder: "你好 or nihao..." });
          input.style.cssText = "width:100%;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1rem;";
          const submit = el("button", { class: "btn btn-primary", style: "margin-top:.6rem", onclick: check }, "Check");
          input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
          practiceWrap.appendChild(input);
          practiceWrap.appendChild(submit);
          input.focus();

          function check() {
            const text = input.value.trim();
            if (!text) { toast("Type your answer first.", { type: "error" }); return; }
            input.disabled = true;
            submit.disabled = true;
            const isCorrect = chineseMatch(text, q.zh, q.py);
            const feedback = el("div", { class: `feedback-block ${isCorrect ? "correct" : "incorrect"}`, style: "margin-top:.6rem" }, [
              el("p", {}, isCorrect ? "Nice — that's right!" : "Close — here's the sentence:"),
              el("div", { class: "flex justify-between items-center", style: "margin-top:.3rem" }, [
                el("p", { class: "hanzi" }, q.zh),
                el("button", { class: "play-btn", style: "width:30px;height:30px", onclick: () => audioEngine.speak(q.zh) }, "🔊")
              ]),
              el("p", { class: "text-faint" }, q.py)
            ]);
            markResult(isCorrect, feedback);
          }
        }
      }

      function finishPractice() {
        practiceWrap.innerHTML = "";
        const passed = correctCount >= 7;
        practiceWrap.appendChild(
          el("div", { class: "empty-state" }, [
            el("div", { class: "empty-icon" }, passed ? "✅" : "🔁"),
            el("h3", {}, `${correctCount} / ${exercises.length} correct`),
            el("p", {}, passed ? "Unit complete — nice work!" : "Not quite there — review the sentences and grammar point, then try a fresh set of exercises.")
          ])
        );
        if (passed) {
          const wasOnlySkipped = skippedSet().has(unit.id);
          const wasNew = !completedSet().has(unit.id) || wasOnlySkipped;
          if (wasNew) {
            const done = completedSet();
            done.add(unit.id);
            store.state.progress.roadmapUnitsCompleted = [...done];
            if (wasOnlySkipped) {
              const skipped = skippedSet();
              skipped.delete(unit.id);
              store.state.progress.roadmapUnitsSkipped = [...skipped];
            }
            registerStudyToday();
            addXP(15, `Roadmap unit: ${unit.title}`);
            seedRoadmapReview(unit);
            store.save();
            toast("Unit complete! +15 XP · added to your Review queue", { type: "xp", icon: "⚡" });
          }
          practiceWrap.appendChild(el("button", { class: "btn btn-primary", style: "margin-top:.75rem", onclick: render }, "Back to roadmap"));
        } else {
          practiceWrap.appendChild(
            el("div", { class: "btn-row", style: "margin-top:.75rem" }, [
              el("button", { class: "btn btn-primary", onclick: () => { exercises = buildPracticeSet(unit); qi = 0; correctCount = 0; showExercise(); } }, "Try a fresh set"),
              el("button", { class: "btn", onclick: () => showUnit(unit) }, "Start unit over")
            ])
          );
        }
      }
    }
  }
}
