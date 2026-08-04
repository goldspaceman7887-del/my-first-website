// STORY MODE — graded mini-stories built from vocabulary you've already
// met, shown paragraph by paragraph (Spanish / English), followed by vocab
// review, comprehension questions, speaking questions, and a retelling
// exercise.

import { store, todayISO } from "../core/storage.js";
import { el, toast } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { gradeItem, QUALITY } from "../core/srs.js";
import { STORIES } from "../data/stories.js";

export function renderStory(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "📖 Story Mode"),
      el("p", {}, "Short stories built almost entirely from vocabulary you've already met — read for meaning first, then review, then retell it yourself.")
    ])
  );

  const body = el("div", {});
  container.appendChild(body);
  showList();

  function showList() {
    body.innerHTML = "";
    const grid = el("div", { class: "grid grid-auto" });
    STORIES.forEach((s) => {
      const done = store.state.progress.storiesCompleted.includes(s.id);
      grid.appendChild(
        el("div", { class: "card", style: "cursor:pointer", onclick: () => showStory(s) }, [
          el("div", { class: "flex justify-between items-center" }, [
            el("span", { class: "badge badge-default" }, s.level),
            done ? el("span", { class: "badge badge-success" }, "✓ Read") : null
          ].filter(Boolean)),
          el("h3", { style: "margin:.5rem 0 .2rem" }, s.title),
          el("p", { class: "text-muted" }, s.titleEs)
        ])
      );
    });
    body.appendChild(grid);
  }

  function showStory(s) {
    body.innerHTML = "";
    body.appendChild(el("button", { class: "btn btn-sm", onclick: showList }, "← All stories"));
    body.appendChild(el("h2", { style: "margin-top:.75rem" }, `${s.title} · ${s.titleEs}`));

    s.paragraphs.forEach((p) => {
      body.appendChild(
        el("div", { class: "card", style: "margin-top:.6rem" }, [
          el("div", { class: "flex justify-between items-center" }, [
            el("div", { class: "es-text", style: "font-size:1.05rem" }, p.es),
            el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(p.es) }, "🔊")
          ]),
          el("div", { class: "text-muted" }, p.en)
        ])
      );
    });

    body.appendChild(el("h3", { style: "margin-top:1.25rem" }, "Vocabulary review"));
    body.appendChild(
      el("div", { class: "flex gap-2 flex-wrap" }, s.vocabReview.map((v) => el("span", { class: "badge badge-default" }, `${v.w} — ${v.en}`)))
    );

    body.appendChild(el("h3", { style: "margin-top:1.25rem" }, "Comprehension questions"));
    const compCard = el("div", { class: "card" });
    s.comprehension.forEach((c) => {
      const ans = el("p", { class: "text-muted hidden" }, c.a);
      compCard.appendChild(
        el("div", { style: "margin-bottom:.6rem" }, [
          el("p", { style: "font-weight:600" }, c.q),
          el("button", { class: "btn btn-sm", onclick: () => { ans.classList.toggle("hidden"); } }, "Reveal answer"),
          ans
        ])
      );
    });
    body.appendChild(compCard);

    body.appendChild(el("h3", { style: "margin-top:1.25rem" }, "Speaking questions"));
    const speakCard = el("div", { class: "card" });
    s.speakingQuestions.forEach((q) => {
      speakCard.appendChild(
        el("div", { class: "flex justify-between items-center", style: "margin-bottom:.4rem" }, [
          el("span", { class: "es-text" }, q),
          el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(q) }, "🔊")
        ])
      );
    });
    body.appendChild(speakCard);

    body.appendChild(el("h3", { style: "margin-top:1.25rem" }, "Retelling exercise"));
    body.appendChild(
      el("div", { class: "card" }, [
        el("p", { class: "text-muted" }, s.retelling),
        el("textarea", { placeholder: "Vuelve a contar la historia con tus propias palabras..." })
      ])
    );

    const wasNew = !store.state.progress.storiesCompleted.includes(s.id);
    body.appendChild(
      el(
        "button",
        {
          class: "btn btn-primary",
          style: "margin-top:1rem",
          onclick: () => {
            if (wasNew) {
              store.state.progress.storiesCompleted.push(s.id);
              gradeItem(`story_${s.id}`, "story", QUALITY.GOOD);
              registerStudyToday();
              updateSkillScore("reading", 3);
              addXP(12, `Story: ${s.title}`);
              store.save();
              toast("Story marked as read! +12 XP", { type: "xp", icon: "⚡" });
            } else {
              toast("Already marked as read — nice re-read!", { icon: "📖" });
            }
            showList();
          }
        },
        wasNew ? "Mark as read" : "Back to stories"
      )
    );
  }
}
