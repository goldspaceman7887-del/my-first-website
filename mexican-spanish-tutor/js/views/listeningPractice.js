// LISTENING PRACTICE — a standalone "listen and choose what you heard"
// drill. Reuses the same audio + multiple-choice mechanic the roadmap's
// unit test already has, but pulled from the whole SENTENCES + DIALOGUES
// pool instead of one unit, and deliberately decoupled from roadmap
// progression: no hearts, no unit completion, just repetitions.

import { el, toast } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { SENTENCES } from "../data/sentences.js";
import { DIALOGUES } from "../data/dialogues.js";

const ROUND_SIZE = 10;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pool() {
  return [
    ...SENTENCES.map((s) => ({ es: s.es, en: s.en })),
    ...DIALOGUES.flatMap((d) => d.lines.map((l) => ({ es: l.es, en: l.en })))
  ];
}

function buildRound() {
  const all = pool();
  const picked = shuffle(all).slice(0, ROUND_SIZE);
  return picked.map((item) => {
    const decoys = shuffle(all.filter((x) => x.es !== item.es)).slice(0, 2).map((x) => x.es);
    return { es: item.es, en: item.en, options: shuffle([item.es, ...decoys]) };
  });
}

export function renderListeningPractice(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "👂 Listening Practice"),
      el("p", {}, `Listen and pick what you heard — ${ROUND_SIZE} rounds drawn from every sentence and dialogue in the app, not tied to one roadmap unit.`)
    ])
  );

  const body = el("div", {});
  container.appendChild(body);

  function start() {
    const questions = buildRound();
    let idx = 0;
    let correctCount = 0;

    body.innerHTML = "";
    const counter = el("p", { class: "text-muted" }, "");
    const qWrap = el("div", {});
    body.appendChild(counter);
    body.appendChild(qWrap);

    function showQuestion() {
      counter.textContent = `Question ${idx + 1} of ${questions.length}`;
      qWrap.innerHTML = "";
      const q = questions[idx];
      const card = el("div", { class: "card exercise-card" });
      card.appendChild(el("p", { class: "exercise-prompt" }, "🔊 Listen and choose what you heard"));
      card.appendChild(el("button", { class: "btn btn-sm", style: "margin-top:.4rem", onclick: () => audioEngine.speak(q.es) }, "🔊 Play again"));

      const list = el("div", { class: "option-list", style: "margin-top:.7rem" });
      q.options.forEach((opt) => {
        const btn = el("button", { class: "option-btn es-text" }, opt);
        btn.addEventListener("click", () => {
          list.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
          const ok = opt === q.es;
          btn.classList.add(ok ? "correct" : "incorrect");
          if (!ok) [...list.children].find((b) => b.textContent === q.es)?.classList.add("correct");
          if (ok) correctCount++;
          const fb = el("div", { class: `feedback-block ${ok ? "correct" : "incorrect"}`, style: "margin-top:.7rem" }, [
            el("strong", {}, ok ? "¡Correcto! " : "Not quite — "),
            `"${q.es}" — ${q.en}`
          ]);
          qWrap.appendChild(fb);
          qWrap.appendChild(
            el("button", {
              class: "btn btn-primary", style: "margin-top:.7rem",
              onclick: () => { idx++; idx >= questions.length ? finish() : showQuestion(); }
            }, idx >= questions.length - 1 ? "See results →" : "Next →")
          );
        });
        list.appendChild(btn);
      });
      card.appendChild(list);
      qWrap.appendChild(card);
      audioEngine.speak(q.es);
    }

    function finish() {
      counter.textContent = "";
      qWrap.innerHTML = "";
      registerStudyToday();
      updateSkillScore("listening", correctCount >= questions.length * 0.7 ? 3 : 1);
      const xp = 5 + correctCount;
      addXP(xp, "Listening Practice");
      toast(`${correctCount}/${questions.length} correct — +${xp} XP`, { icon: "👂" });
      qWrap.appendChild(
        el("div", { class: "card empty-state pop-in" }, [
          el("div", { class: "empty-icon" }, "✅"),
          el("h3", {}, "Round complete!"),
          el("p", {}, `${correctCount} / ${questions.length} correct · +${xp} XP`),
          el("button", { class: "btn btn-primary", onclick: start }, "Another round")
        ])
      );
    }

    showQuestion();
  }

  start();
}
