// LEVEL TEST — a quick placement check that answers one question: "what's
// my level right now?"
//
// Multiple-choice questions drawn from the roadmap, three per ACTFL level,
// asked from easiest to hardest. It stops early once you clearly hit your
// ceiling (two whole levels missed in a row), so it never drags on. The
// result sets your level estimate and points you at the right unit.

import { store } from "../core/storage.js";
import { el, progressBar, blurActive, confettiBurst } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday } from "../core/gamification.js";
import { ACTFL_LEVELS, ROADMAP_UNITS } from "../data/roadmap.js";
import { spanishDistractors, englishDistractors } from "../core/distractors.js";

const PER_LEVEL = 3;
const OPTIONS = 4;      // more choices = less passing by luck
const PASS_RATIO = 0.6; // 2 of 3 correct to clear a level

function shuffle(a) {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

// Three questions per level, ascending. Distractors come from the same level
// so a question is only hard because of the level, not trick options.
function buildTest() {
  const qs = [];
  ACTFL_LEVELS.forEach((lvl) => {
    const units = ROADMAP_UNITS.filter((u) => u.level === lvl.code);
    const sentences = shuffle(units.flatMap((u) => u.sentences));
    if (sentences.length < OPTIONS) return;
    const others = sentences.filter((x) => !sentences.slice(0, PER_LEVEL).includes(x));
    sentences.slice(0, PER_LEVEL).forEach((s, i) => {
      // Decoys are minimal pairs of the right answer, not other topics — you
      // have to know the grammar, not just recognise the subject matter.
      if (i % 2 === 0) {
        const wrong = englishDistractors(s.en, OPTIONS - 1, others.map((o) => o.en));
        qs.push({ level: lvl.code, prompt: s.es, sub: "What does this mean?", correct: s.en, options: shuffle([s.en, ...wrong]), speak: s.es });
      } else {
        const wrong = spanishDistractors(s.es, OPTIONS - 1, others.map((o) => o.es));
        qs.push({ level: lvl.code, prompt: s.en, sub: "Choose the Spanish", correct: s.es, options: shuffle([s.es, ...wrong]), spanish: true });
      }
    });
  });
  return qs;
}

// Your level is the highest one you actually passed, requiring every level
// below it to be passed too — a ceiling, not a lucky streak.
function scoreToLevel(byLevel) {
  let best = null;
  for (const lvl of ACTFL_LEVELS) {
    const r = byLevel[lvl.code];
    if (!r || !r.asked) break;
    if (r.correct / r.asked >= PASS_RATIO) best = lvl;
    else break;
  }
  return best;
}

export function renderLevelTest(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "📊 Level Test"),
      el("p", {}, "A quick check of where you are right now. Questions get harder as you go and stop once you hit your ceiling — usually about two minutes.")
    ])
  );

  const body = el("div", {});
  container.appendChild(body);
  showIntro();

  function showIntro() {
    const last = (store.state.progress.levelTests || []).slice(-1)[0];
    body.innerHTML = "";
    body.appendChild(
      el("div", { class: "card" }, [
        el("h3", { class: "card-title" }, "Ready?"),
        el("p", { class: "text-muted" }, "Answer honestly and don't look anything up — the point is an accurate read, not a high score. Guessing just moves your estimate away from the truth."),
        last ? el("p", { class: "text-muted" }, `Last result: ${ACTFL_LEVELS.find((l) => l.code === last.level)?.label || "—"} on ${last.date}`) : null,
        el("button", { class: "btn btn-primary btn-lg", style: "margin-top:.5rem", onclick: start }, "Start the test")
      ].filter(Boolean))
    );
  }

  function start() {
    const questions = buildTest();
    const byLevel = {};
    let idx = 0;
    let consecutiveLevelFails = 0;
    let currentLevelCode = null;
    let levelCorrect = 0;
    let levelAsked = 0;

    body.innerHTML = "";
    const head = el("div", { class: "card", style: "margin-bottom:.75rem" });
    const bar = el("div", { style: "margin-top:.5rem" });
    head.appendChild(el("div", { class: "flex justify-between items-center", style: "flex-wrap:wrap;gap:.5rem" }, [
      el("span", { class: "text-muted", style: "font-weight:700" }, "Finding your level..."),
      el("span", { class: "text-faint", id: "lt-count" }, "")
    ]));
    head.appendChild(bar);
    body.appendChild(head);
    const qWrap = el("div", {});
    body.appendChild(qWrap);

    next();

    function next() {
      if (idx >= questions.length) return finish();

      const q = questions[idx];
      // Level boundary: bank the previous level's result first.
      if (currentLevelCode && q.level !== currentLevelCode) {
        byLevel[currentLevelCode] = { asked: levelAsked, correct: levelCorrect };
        const passed = levelCorrect / Math.max(1, levelAsked) >= PASS_RATIO;
        consecutiveLevelFails = passed ? 0 : consecutiveLevelFails + 1;
        levelCorrect = 0;
        levelAsked = 0;
        if (consecutiveLevelFails >= 2) return finish();
      }
      currentLevelCode = q.level;

      bar.innerHTML = "";
      bar.appendChild(progressBar(Math.round((idx / questions.length) * 100)));
      const c = document.getElementById("lt-count");
      if (c) c.textContent = `Question ${idx + 1}`;

      qWrap.innerHTML = "";
      const card = el("div", { class: "card exercise-card" }, [
        el("div", { class: "flex justify-between items-center", style: "gap:.5rem" }, [
          el("p", { class: "exercise-prompt", style: "margin:0" }, q.prompt),
          q.speak ? el("button", { class: "play-btn", onclick: () => audioEngine.speak(q.speak) }, "🔊") : null
        ].filter(Boolean)),
        el("p", { class: "text-muted", style: "margin:.2rem 0 0;font-size:.85rem" }, q.sub)
      ]);

      const list = el("div", { class: "option-list", style: "margin-top:.7rem" });
      q.options.forEach((opt) => {
        const btn = el("button", { class: `option-btn ${q.spanish ? "es-text" : ""}` }, opt);
        btn.addEventListener("click", () => {
          blurActive();
          list.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
          const ok = opt === q.correct;
          btn.classList.add(ok ? "correct" : "incorrect");
          if (!ok) [...list.children].find((b) => b.textContent === q.correct)?.classList.add("correct");
          levelAsked++;
          if (ok) levelCorrect++;
          idx++;
          setTimeout(next, ok ? 320 : 800);
        });
        list.appendChild(btn);
      });
      card.appendChild(list);
      qWrap.appendChild(card);
    }

    function finish() {
      if (currentLevelCode && levelAsked > 0 && !byLevel[currentLevelCode]) {
        byLevel[currentLevelCode] = { asked: levelAsked, correct: levelCorrect };
      }
      const level = scoreToLevel(byLevel) || ACTFL_LEVELS[0];

      store.state.profile.selfReportedLevel = level.code;
      const log = store.state.progress.levelTests || (store.state.progress.levelTests = []);
      log.push({ date: new Date().toISOString().slice(0, 10), level: level.code });
      if (log.length > 30) log.shift();
      registerStudyToday();
      addXP(15, "Level Test completed");
      store.save();
      confettiBurst();

      // Point them at the first unit they haven't finished at their level.
      const target = ROADMAP_UNITS.find((u) => u.level === level.code) || ROADMAP_UNITS[0];

      body.innerHTML = "";
      body.appendChild(
        el("div", { class: "card pop-in" }, [
          el("div", { style: "text-align:center" }, [
            el("div", { style: "font-size:2.5rem" }, "📊"),
            el("p", { class: "text-muted", style: "margin:.2rem 0 0" }, "Your level right now"),
            el("h2", { style: "margin:.2rem 0" }, level.label),
            el("span", { class: `badge badge-${level.code.startsWith("novice") ? "novice" : level.code.startsWith("intermediate") ? "intermediate" : "advanced"}` }, level.short),
            el("p", { class: "text-muted", style: "margin-top:.6rem" }, level.blurb)
          ])
        ])
      );

      const detail = el("div", { class: "card", style: "margin-top:1rem" }, [el("div", { class: "card-title" }, "How you did at each level")]);
      ACTFL_LEVELS.forEach((l) => {
        const r = byLevel[l.code];
        if (!r) return;
        const pct = Math.round((r.correct / r.asked) * 100);
        detail.appendChild(
          el("div", { style: "padding:.45rem 0;border-bottom:1px solid var(--border)" }, [
            el("div", { class: "flex justify-between items-center" }, [
              el("span", {}, l.label),
              el("span", { class: `badge badge-${pct >= PASS_RATIO * 100 ? "success" : "danger"}` }, `${r.correct}/${r.asked}`)
            ]),
            el("div", { class: "progress-bar", style: "margin-top:.3rem" }, [el("div", { class: "progress-bar-fill", style: `width:${pct}%` })])
          ])
        );
      });
      body.appendChild(detail);

      body.appendChild(
        el("div", { class: "card", style: "margin-top:1rem;border-left:3px solid var(--accent)" }, [
          el("div", { class: "card-title" }, "What to do next"),
          el("p", { class: "text-muted" }, `Start on the roadmap at "${target.title}" — that's where your level begins.`),
          el("div", { class: "btn-row" }, [
            el("a", { class: "btn btn-primary", href: "#/roadmap" }, "Go to roadmap"),
            el("button", { class: "btn", onclick: showIntro }, "Retake test")
          ])
        ])
      );
    }
  }
}
