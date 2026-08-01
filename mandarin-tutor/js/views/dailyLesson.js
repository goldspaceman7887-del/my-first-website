// DAILY LESSON MODE — the spec's 9-part structure: review, recall drills,
// new words, new characters, new sentences, conversation practice,
// shadowing, production practice, and an SRS summary.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive, toast } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { dueItems, newItems, reviewCounts, isMastered } from "../core/srs.js";
import { addXP } from "../core/gamification.js";
import { CHARACTERS } from "../data/characters.js";
import { VOCABULARY } from "../data/vocabulary.js";
import { SENTENCES } from "../data/sentences.js";
import { DIALOGUES } from "../data/dialogues.js";

const PARTS = [
  "1 · Review", "2 · Recall drills", "3 · New words", "4 · New characters",
  "5 · New sentences", "6 · Conversation", "7 · Shadowing", "8 · Production", "9 · SRS update"
];

export function renderDailyLesson(container) {
  let step = 0;
  const lesson = buildLesson();

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "📅 Daily Lesson"),
      el("p", {}, "Review first, then new material in the right order: meaning → sentence → conversation → vocabulary → characters → grammar.")
    ])
  );

  const tabs = el("div", { class: "tabs" }, PARTS.map((label, i) => {
    const b = el("button", { class: `tab-btn ${i === step ? "active" : ""}` }, label);
    return b;
  }));
  container.appendChild(tabs);

  const body = el("div", {});
  container.appendChild(body);

  const nav = el("div", { class: "btn-row", style: "margin-top:1rem" });
  const backBtn = el("button", { class: "btn", onclick: () => go(step - 1) }, "← Back");
  const nextBtn = el("button", { class: "btn btn-primary", onclick: () => go(step + 1) }, "Next →");
  nav.appendChild(backBtn);
  nav.appendChild(nextBtn);
  container.appendChild(nav);

  function go(next) {
    if (next < 0) return;
    step = Math.min(next, PARTS.length - 1);
    render();
  }

  function render() {
    tabs.querySelectorAll(".tab-btn").forEach((b, i) => b.classList.toggle("active", i === step));
    backBtn.disabled = step === 0;
    nextBtn.textContent = step === PARTS.length - 1 ? "Finish lesson" : "Next →";
    nextBtn.onclick = step === PARTS.length - 1 ? finishLesson : () => go(step + 1);
    body.innerHTML = "";
    body.appendChild(renderPart(step));
  }

  function renderPart(i) {
    if (i === 0) return partReview();
    if (i === 1) return partRecall();
    if (i === 2) return partNewWords();
    if (i === 3) return partNewChars();
    if (i === 4) return partNewSentences();
    if (i === 5) return partConversation();
    if (i === 6) return partShadowing();
    if (i === 7) return partProduction();
    return partSrsUpdate();
  }

  function partReview() {
    const counts = reviewCounts();
    return el("div", { class: "card" }, [
      el("h3", { class: "card-title" }, "Review old material"),
      counts.dueToday > 0
        ? el("div", {}, [
            el("p", {}, `You have ${counts.dueToday} item(s) due for review (characters, words, and sentences).`),
            el("a", { class: "btn btn-primary", href: "#/review" }, "Go review now"),
            el("p", { class: "text-faint", style: "margin-top:.5rem" }, "Come back to this tab afterward to continue today's lesson.")
          ])
        : el("p", {}, "Nothing due today — you're caught up. Moving straight to new material.")
    ]);
  }

  function partRecall() {
    const knownIds = Object.keys(store.state.srs).filter((id) => isMastered(id, 40));
    const sample = knownIds.slice(0, 5).map((id) => {
      const [type, ...rest] = id.split("_");
      const dataId = rest.join("_");
      if (type === "character") return { type, data: CHARACTERS.find((c) => c.id === dataId) };
      if (type === "word") return { type, data: VOCABULARY.find((v) => v.id === dataId) };
      return null;
    }).filter((x) => x && x.data);

    if (sample.length === 0) {
      return el("div", { class: "card" }, [
        el("h3", { class: "card-title" }, "Recall drills"),
        el("p", {}, "No material learned yet to drill — that's fine on day one. This section fills in as you build up known characters and words.")
      ]);
    }

    const wrap = el("div", { class: "card" }, [el("h3", { class: "card-title" }, "Recall drills"), el("p", { class: "text-muted" }, "Try to recall the meaning before revealing it.")]);
    sample.forEach((item) => {
      const front = item.type === "character" ? item.data.char : item.data.word;
      const meaning = item.type === "character" ? item.data.meaning : item.data.meaning;
      const row = el("div", { class: "flex justify-between items-center", style: "padding:.5rem 0;border-bottom:1px solid var(--border)" }, [
        el("span", { class: "hanzi", style: "font-size:1.3rem" }, front),
        (() => {
          const ans = el("span", { class: "text-muted hidden" }, meaning);
          const btn = el("button", { class: "btn btn-sm", onclick: () => ans.classList.toggle("hidden") }, "Reveal");
          return el("span", { class: "flex gap-1 items-center" }, [ans, btn]);
        })()
      ]);
      wrap.appendChild(row);
    });
    return wrap;
  }

  function partNewWords() {
    const wrap = el("div", { class: "card" }, [el("h3", { class: "card-title" }, "3–5 new words"), el("p", { class: "text-muted" }, "Listen, then move on to Vocabulary flashcards later to formally add these to your review queue.")]);
    lesson.newWords.forEach((v) => {
      wrap.appendChild(
        el("div", { style: "padding:.5rem 0;border-bottom:1px solid var(--border)" }, [
          el("div", { class: "flex justify-between items-center" }, [
            el("span", { class: "hanzi", style: "font-size:1.2rem" }, v.word),
            el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(v.word) }, "🔊")
          ]),
          el("div", { class: "text-muted" }, `${v.pinyin} — ${v.meaning}`)
        ])
      );
    });
    return wrap;
  }

  function partNewChars() {
    const wrap = el("div", { class: "card" }, [el("h3", { class: "card-title" }, "3 new characters")]);
    lesson.newChars.forEach((c) => {
      wrap.appendChild(
        el("div", { style: "padding:.5rem 0;border-bottom:1px solid var(--border)" }, [
          el("div", { class: "flex justify-between items-center" }, [
            el("span", { class: "hanzi", style: "font-size:1.4rem" }, c.char),
            el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(c.char) }, "🔊")
          ]),
          el("div", { class: "text-muted" }, `${c.pinyin} — ${c.meaning}`),
          el("div", { class: "text-faint", style: "font-size:.82rem" }, c.trick)
        ])
      );
    });
    return wrap;
  }

  function partNewSentences() {
    const wrap = el("div", { class: "card" }, [el("h3", { class: "card-title" }, "3 useful daily-life sentences")]);
    lesson.newSentences.forEach((s) => {
      wrap.appendChild(
        el("div", { style: "padding:.5rem 0;border-bottom:1px solid var(--border)" }, [
          el("div", { class: "flex justify-between items-center" }, [
            el("span", { class: "hanzi" }, s.zh),
            el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(s.zh) }, "🔊")
          ]),
          el("div", { class: "pinyin" }, s.py),
          el("div", { class: "text-muted" }, s.en)
        ])
      );
    });
    return wrap;
  }

  function partConversation() {
    const d = lesson.dialogue;
    if (!d) return el("div", { class: "card" }, [el("h3", { class: "card-title" }, "Conversation practice"), el("p", {}, "You've completed every dialogue — amazing! Revisit any of them from the Dialogues section.")]);
    return el("div", { class: "card" }, [
      el("h3", { class: "card-title" }, "Conversation practice"),
      el("p", {}, `Today's pick: ${d.title} · ${d.titleZh}`),
      el("a", { class: "btn btn-primary", href: `#/dialogues/${d.id}` }, "Open dialogue")
    ]);
  }

  function partShadowing() {
    const items = lesson.newSentences;
    const wrap = el("div", { class: "card" }, [
      el("h3", { class: "card-title" }, "Shadowing practice"),
      el("p", { class: "text-muted" }, "Listen, then repeat out loud in the pause. Each phrase plays 3 times.")
    ]);
    items.forEach((s) => {
      const status = el("span", { class: "text-faint" }, "");
      wrap.appendChild(
        el("div", { style: "padding:.5rem 0;border-bottom:1px solid var(--border)" }, [
          el("div", { class: "hanzi" }, s.zh),
          el("div", { class: "pinyin" }, s.py),
          el("div", { class: "text-muted" }, s.en),
          el("div", { class: "btn-row", style: "margin-top:.3rem" }, [
            el("button", { class: "btn btn-sm", onclick: () => { status.textContent = "Shadowing..."; audioEngine.shadow(s.zh, { repeats: 3, onRound: (r) => (status.textContent = `Round ${r}/3 — repeat now`), onDone: () => (status.textContent = "Done!") }); } }, "🎧 Start shadowing"),
            status
          ])
        ])
      );
    });
    return wrap;
  }

  function partProduction() {
    const wrap = el("div", { class: "card" }, [
      el("h3", { class: "card-title" }, "Production practice"),
      el("p", { class: "text-muted" }, "Create: 3 sentences, 1 question, and 1 short conversation using anything you've learned. There's no wrong answer here — this is about attempting production.")
    ]);
    const ta = el("textarea", { placeholder: "写你的句子、问题和小对话...\n(Write your sentences, question, and mini conversation here.)" });
    wrap.appendChild(ta);
    const feedback = el("p", { class: "text-faint hidden" }, "Nice work attempting production — that's the hardest and most valuable skill to practice.");
    wrap.appendChild(
      el(
        "button",
        {
          class: "btn btn-primary btn-sm",
          onclick: () => {
            if (ta.value.trim().length < 5) { toast("Write at least a little before checking off this step.", { type: "error" }); return; }
            feedback.classList.remove("hidden");
            addXP(6, "Production practice");
          }
        },
        "I'm done"
      )
    );
    wrap.appendChild(feedback);
    return wrap;
  }

  function partSrsUpdate() {
    const known = (store.state.profile.selfReportedKnownChars || []).length +
      Object.keys(store.state.srs).filter((id) => id.startsWith("character_") && isMastered(id, 70)).length;
    const learning = Object.keys(store.state.srs).filter((id) => !isMastered(id, 70)).length;
    const counts = reviewCounts();
    return el("div", { class: "card" }, [
      el("h3", { class: "card-title" }, "Spaced repetition update"),
      el("div", { class: "grid grid-3" }, [
        statBox("Mastered", counts.total - learning),
        statBox("Learning", learning),
        statBox("Review due", counts.dueToday)
      ]),
      el("p", { class: "text-muted", style: "margin-top:.75rem" }, "Click \"Finish lesson\" to log today's session and earn XP.")
    ]);
    function statBox(label, value) {
      return el("div", { class: "card", style: "text-align:center" }, [el("div", { class: "stat-value" }, String(value)), el("div", { class: "stat-label" }, label)]);
    }
  }

  function finishLesson() {
    blurActive();
    const today = todayISO();
    if (!store.state.progress.lessonsCompleted.includes(today)) {
      store.state.progress.lessonsCompleted.push(today);
      addXP(20, "Daily Lesson completed");
      toast("Daily Lesson complete! +20 XP", { type: "xp", icon: "⚡" });
    } else {
      toast("Lesson reviewed again — nice consistency!", { icon: "🔁" });
    }
    store.save();
    window.location.hash = "#/dashboard";
  }

  render();
}

function buildLesson() {
  const knownWordIds = new Set(Object.keys(store.state.srs).filter((id) => id.startsWith("word_")).map((id) => id.replace("word_", "")));
  const knownCharIds = new Set(Object.keys(store.state.srs).filter((id) => id.startsWith("character_")).map((id) => id.replace("character_", "")));
  const knownSentenceIds = new Set(Object.keys(store.state.srs).filter((id) => id.startsWith("sentence_")).map((id) => id.replace("sentence_", "")));

  const newWords = VOCABULARY.filter((v) => !knownWordIds.has(v.id)).slice(0, 4);
  const newChars = CHARACTERS.filter((c) => !knownCharIds.has(c.id) && !(store.state.profile.selfReportedKnownChars || []).includes(c.char)).slice(0, 3);
  const newSentences = SENTENCES.filter((s) => !knownSentenceIds.has(s.id)).slice(0, 3);
  const dialogue = DIALOGUES.find((d) => !store.state.progress.dialoguesCompleted.includes(d.id)) || null;

  return { newWords, newChars, newSentences, dialogue };
}
