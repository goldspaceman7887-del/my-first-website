// STORY MODE — graded mini-stories running the full ACTFL ladder, Novice Low
// through Advanced Low.
//
// Every Spanish word is tappable: tap it and you get the English for that
// exact form, including which verb and tense it came from. Glosses are keyed
// by the surface form rather than the dictionary lemma, because when you're
// reading "levantábamos" what you need is "we used to get up", not "to get up".
//
// The English translation of each line can be hidden, so you can read for
// meaning and lean on the tap-to-define instead of the crib underneath.

import { store } from "../core/storage.js";
import { correctionBlock } from "../core/feedback.js";
import { el, toast } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { gradeItem, QUALITY } from "../core/srs.js";
import { STORIES } from "../data/stories.js";
import { ACTFL_LEVELS } from "../data/roadmap.js";
import { tappable, initTapWords, closeGloss, immersionLevel } from "../core/tapword.js";

function levelInfo(code) {
  return ACTFL_LEVELS.find((l) => l.code === code) || { short: code, label: code };
}
function levelVariant(code) {
  if (code.startsWith("novice")) return "novice";
  if (code.startsWith("intermediate")) return "intermediate";
  return "advanced";
}

export function renderStory(container) {
  // Follows the global Spanish-exposure dial by default; the per-story
  // Hide/Show English button below still lets you override for this read.
  let showEnglish = immersionLevel() <= 2;
  let pop = null;

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "📖 Story Mode"),
      el("p", {}, "Stories from Novice Low all the way to Advanced Low. Tap any Spanish word to see what it means.")
    ])
  );

  // Practice strips a sub-view's .page-header, so the instruction lives here too.
  container.appendChild(
    el("p", { class: "text-muted", style: "font-size:.85rem;margin:.2rem 0 .6rem" },
      "Stories run Novice Low → Advanced Low. Tap any Spanish word for its meaning.")
  );

  const body = el("div", {});
  container.appendChild(body);
  showList();

  const teardownTapWords = initTapWords();

  // ---------- Story list, as a ladder ----------
  function showList() {
    closeGloss();
    body.innerHTML = "";
    let lastLevel = null;
    STORIES.forEach((s) => {
      if (s.level !== lastLevel) {
        lastLevel = s.level;
        const l = levelInfo(s.level);
        body.appendChild(
          el("div", { style: "margin:1rem 0 .4rem" }, [
            el("span", { class: `badge badge-${levelVariant(s.level)}` }, l.short),
            el("span", { style: "font-weight:800;margin-left:.5rem" }, l.label)
          ])
        );
      }
      const done = store.state.progress.storiesCompleted.includes(s.id);
      body.appendChild(
        el("div", { class: "card card-link", style: "cursor:pointer", onclick: () => showStory(s) }, [
          el("div", { class: "flex justify-between items-center", style: "gap:.5rem" }, [
            el("div", {}, [
              el("h3", { style: "margin:0 0 .15rem" }, s.title),
              el("p", { class: "text-muted", style: "margin:0" }, s.titleEs)
            ]),
            done ? el("span", { class: "badge badge-success" }, "✓") : null
          ].filter(Boolean))
        ])
      );
    });
  }

  // ---------- One story ----------
  function showStory(s) {
    closeGloss();
    body.innerHTML = "";
    const l = levelInfo(s.level);

    const englishBtn = el("button", { class: "btn btn-sm", onclick: () => { showEnglish = !showEnglish; showStory(s); } },
      showEnglish ? "🙈 Hide English" : "👁 Show English");

    body.appendChild(
      el("div", { class: "card", style: "margin-bottom:.6rem" }, [
        el("span", { class: `badge badge-${levelVariant(s.level)}` }, l.short),
        el("h2", { style: "margin:.35rem 0 .1rem" }, s.title),
        el("p", { class: "text-muted", style: "margin:0 0 .6rem" }, s.titleEs),
        el("div", { class: "btn-row" }, [
          el("button", { class: "btn btn-sm", onclick: showList }, "← All stories"),
          englishBtn,
          el("button", { class: "btn btn-sm", onclick: () => audioEngine.speak(s.paragraphs.map((p) => p.es).join(" ")) }, "🔊 Read it all")
        ])
      ])
    );

    s.paragraphs.forEach((p) => {
      body.appendChild(
        el("div", { class: "card", style: "margin-top:.5rem" }, [
          el("div", { class: "flex justify-between items-start", style: "gap:.5rem" }, [
            tappable(p.es),
            el("button", { class: "play-btn", style: "width:34px;height:34px;flex-shrink:0", onclick: () => audioEngine.speak(p.es) }, "🔊")
          ]),
          showEnglish ? el("div", { class: "text-muted", style: "margin-top:.3rem" }, p.en) : null
        ].filter(Boolean))
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
        el("div", { class: "flex justify-between items-center", style: "margin-bottom:.4rem;gap:.5rem" }, [
          tappable(q),
          el("button", { class: "play-btn", style: "width:34px;height:34px;flex-shrink:0", onclick: () => audioEngine.speak(q) }, "🔊")
        ])
      );
    });
    body.appendChild(speakCard);

    body.appendChild(el("h3", { style: "margin-top:1.25rem" }, "Retelling exercise"));
    body.appendChild(
      el("div", { class: "card" }, [
        el("p", { class: "text-muted" }, s.retelling),
        (() => {
          const ta = el("textarea", { placeholder: "Vuelve a contar la historia con tus propias palabras..." });
          const notes = el("div", {});
          const btn = el("button", { class: "btn btn-sm btn-primary", style: "margin-top:.5rem", onclick: () => {
            notes.innerHTML = "";
            const block = correctionBlock(ta.value.trim());
            notes.appendChild(block || el("div", { class: "feedback-block correct" }, [
              el("p", { style: "margin:0;font-weight:700" }, "No common mistakes found."),
              el("p", { class: "text-muted", style: "margin:.2rem 0 0" }, "This checks the highest-frequency errors, so it can't promise perfection — but it's a good sign.")
            ]));
          } }, "Check my Spanish");
          return el("div", {}, [ta, btn, notes]);
        })()
      ])
    );

    const wasNew = !store.state.progress.storiesCompleted.includes(s.id);
    body.appendChild(
      el("button", {
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
      }, wasNew ? "Mark as read" : "Back to stories")
    );
  }

  return teardownTapWords;
}
