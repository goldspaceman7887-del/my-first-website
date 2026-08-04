// ROADMAP — a Duolingo-style path across all 7 ACTFL levels this app
// targets. Units unlock in order. Every unit, at every level, runs the same
// loop: learn 8 sentences → read the grammar note → take a 10-question quiz
// played with hearts (stakes). Wrong answers cost a heart; running out ends
// the attempt early and you retry. Passing marks the unit complete, awards
// XP, and unlocks the next node.
//
// The second tab is the ACTFL Can-Do checklist, which feeds the level
// estimate on the dashboard.

import { store } from "../core/storage.js";
import { el, progressBar, blurActive, toast, confettiBurst } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { gradeItem, QUALITY } from "../core/srs.js";
import { getHearts, loseHeart, hasHearts, refillHeartsFully, minutesUntilNextHeart, MAX_HEARTS } from "../core/hearts.js";
import { ACTFL_LEVELS, ROADMAP_UNITS, levelIndex } from "../data/roadmap.js";

const PASS_THRESHOLD = 7; // out of 10

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

// Mark every unit below `levelCode` as placed-out, so the path opens where the
// learner actually is instead of making them grind Novice Low first.
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

// Sequential unlock: the first not-yet-completed unit is playable, and
// everything before it stays replayable.
function isUnlocked(idx) {
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

// Builds exactly 10 questions for any unit, mixing recognition, listening,
// grammar, and production. Distractors are pulled from other units at the
// same level so the wrong answers stay plausible.
export function buildQuiz(unit) {
  const sameLevel = ROADMAP_UNITS.filter((u) => u.level === unit.level && u.id !== unit.id);
  const foreignPool = shuffle(sameLevel.flatMap((u) => u.sentences)).slice(0, 30);
  const pool = shuffle(unit.sentences);
  const qs = [];

  const distractorsEn = (correct, n) =>
    shuffle([...unit.sentences.filter((s) => s.es !== correct.es), ...foreignPool]).slice(0, n).map((s) => s.en);
  const distractorsEs = (correct, n) =>
    shuffle([...unit.sentences.filter((s) => s.es !== correct.es), ...foreignPool]).slice(0, n).map((s) => s.es);

  // 3 × recognition: Spanish → English
  pool.slice(0, 3).forEach((s) => {
    qs.push({ kind: "mc", prompt: s.es, sub: "What does this mean?", correct: s.en, options: shuffle([s.en, ...distractorsEn(s, 2)]), speak: s.es });
  });

  // 2 × production recognition: English → Spanish
  pool.slice(3, 5).forEach((s) => {
    qs.push({ kind: "mc", prompt: s.en, sub: "Choose the Spanish", correct: s.es, options: shuffle([s.es, ...distractorsEs(s, 2)]), spanishOptions: true });
  });

  // 1 × listening
  const listen = pool[5] || pool[0];
  qs.push({ kind: "listen", prompt: "🔊 Listen and choose what you heard", correct: listen.es, options: shuffle([listen.es, ...distractorsEs(listen, 2)]), speak: listen.es, spanishOptions: true });

  // 1 × grammar drill from the unit's own grammar point
  if (unit.drill) {
    qs.push({ kind: "mc", prompt: unit.drill.question, sub: `Grammar: ${unit.grammar.title}`, correct: unit.drill.answer, options: shuffle(unit.drill.options), spanishOptions: true });
  }

  // 1 × word order (build the sentence from a word bank)
  const build = pool[6] || pool[1];
  qs.push({ kind: "build", prompt: build.en, correct: build.es, words: shuffle(build.es.replace(/[¿?¡!.,]/g, "").split(/\s+/)), speak: build.es });

  // Remaining slots: typed free recall
  const typedPool = [pool[7], pool[2], pool[0]].filter(Boolean);
  let ti = 0;
  while (qs.length < 10) {
    const s = typedPool[ti % typedPool.length];
    ti++;
    qs.push({ kind: "typed", prompt: s.es, sub: "Type what this means in English", expected: s.en, speak: s.es });
  }

  return qs.slice(0, 10);
}

export function renderRoadmap(container) {
  let tab = "path";

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🗺️ Roadmap"),
      el("p", {}, "Your path from Novice Low to Advanced Low. Every unit ends in a 10-question quiz played with hearts — get 7 right to pass and unlock the next one.")
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
              ? `${earnedCount} passed by quiz · ${done - earnedCount} skipped. Tick the box beside a unit to skip it.`
              : "Units unlock in order. Tick the box beside a unit if you already know it.")
          ]),
          heartBar()
        ]),
        el("div", { style: "margin-top:.6rem" }, [progressBar(Math.round((done / ROADMAP_UNITS.length) * 100))])
      ])
    );

    // If the Level Test says you're above where the path currently sits,
    // offer to place you out of everything below it in one click.
    const lastTest = (store.state.progress.levelTests || []).slice(-1)[0];
    const lastSpoken = (store.state.progress.speakingTests || []).slice(-1)[0];
    const testedCode = (lastSpoken && lastSpoken.date >= (lastTest?.date || "")) ? lastSpoken.level : lastTest?.level;
    if (testedCode) {
      const pending = ROADMAP_UNITS.filter((u) => levelIndex(u.level) < levelIndex(testedCode) && !isCompleted(u.id));
      if (pending.length) {
        const lvl = ACTFL_LEVELS.find((l) => l.code === testedCode);
        wrap.appendChild(
          el("div", { class: "card", style: "margin-bottom:1rem;border-left:3px solid var(--accent)" }, [
            el("div", { class: "card-title" }, `📊 Your test says ${lvl.label}`),
            el("p", { class: "text-muted" }, `You don't have to work up from the beginning. Skip the ${pending.length} unit(s) below ${lvl.label} and start where you actually are — you can still open any of them later.`),
            el("button", {
              class: "btn btn-primary",
              onclick: () => {
                const n = skipToLevel(testedCode);
                toast(`Skipped ahead — ${n} unit(s) marked as known.`, { icon: "⏭️" });
                render();
              }
            }, `⏭️ Skip ahead to ${lvl.label}`)
          ])
        );
      }
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
        title: earned ? "Passed the quiz" : skipped ? "Marked as known — click to undo" : "Already know this? Tick it off to skip",
        "aria-label": `Mark ${u.title} as known`,
        onclick: () => {
          blurActive();
          if (earned) { toast("You already passed this one.", { icon: "✅" }); return; }
          toggleSkip(u.id);
          render();
        }
      }, completed ? "✓" : "");

      path.appendChild(el("div", { class: `roadmap-node-row ${offset}` }, [node, box]));
    });

    wrap.appendChild(path);
    return wrap;
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
              el("span", { class: "es-text", style: "font-size:1.05rem" }, s.es),
              el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(s.es) }, "🔊")
            ]),
            el("div", { class: "text-muted", style: "font-size:.9rem" }, s.en)
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
              el("div", { class: "text-muted", style: "font-size:.85rem" }, ex.en)
            ]),
            el("button", { class: "play-btn", style: "width:32px;height:32px", onclick: () => audioEngine.speak(ex.es) }, "🔊")
          ])
        ),
        el("div", { class: "feedback-block incorrect", style: "margin-top:.8rem" }, [
          el("strong", {}, "Common mistake: "), g.commonMistake
        ]),
        el("div", { class: "btn-row", style: "margin-top:1rem" }, [
          el("button", { class: "btn", onclick: showLearn }, "← Review sentences"),
          el("button", { class: "btn btn-primary", onclick: startQuiz }, "Start quiz (10 questions) →")
        ])
      ]);
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
        renderQuestion(questions[idx]);
      }

      function afterAnswer(wasCorrect, explanation) {
        if (wasCorrect) correctCount++;
        else loseHeart();
        refreshHead();

        const fb = el("div", { class: `feedback-block ${wasCorrect ? "correct" : "incorrect"}`, style: "margin-top:.8rem" }, [
          el("strong", {}, wasCorrect ? "¡Correcto! " : "Not quite — "),
          explanation
        ]);
        qWrap.appendChild(fb);
        qWrap.appendChild(
          el("button", {
            class: "btn btn-primary", style: "margin-top:.7rem",
            onclick: () => { idx++; blurActive(); nextQuestion(); }
          }, idx >= questions.length - 1 ? "See results →" : "Next →")
        );
        fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      function renderQuestion(q) {
        qWrap.innerHTML = "";
        const card = el("div", { class: "card exercise-card" });

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
                el("button", { class: "btn", onclick: startQuiz }, "Retry quiz")
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
}
