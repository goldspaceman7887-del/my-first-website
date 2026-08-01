// DAILY LESSON MODE — the spec's 9-part structure: Review, Recall Drills,
// New Vocabulary, Useful Sentences, Mini Dialogue, Listening Simulation,
// Speaking Practice, ACTFL Task, Progress Update.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive, toast } from "../core/ui.js";
import { audioEngine, textSimilarity } from "../core/audio.js";
import { dueItems, isMastered, reviewCounts } from "../core/srs.js";
import { addXP, updateSkillScore, estimatedLevel } from "../core/gamification.js";
import { VOCABULARY } from "../data/vocabulary.js";
import { SENTENCES } from "../data/sentences.js";
import { DIALOGUES } from "../data/dialogues.js";

const PARTS = [
  "1 · Repaso", "2 · Recall drills", "3 · Nuevo vocabulario", "4 · Oraciones útiles",
  "5 · Mini diálogo", "6 · Escucha (listening)", "7 · Habla (speaking)", "8 · Tarea ACTFL", "9 · Progreso"
];

export function renderDailyLesson(container) {
  let step = 0;
  const lesson = buildLesson();

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "📅 Daily Lesson"),
      el("p", {}, "Review first, then new material in the right order: meaning → sentence → conversation → vocabulary → grammar.")
    ])
  );

  const tabs = el("div", { class: "tabs" }, PARTS.map((label, i) => el("button", { class: `tab-btn ${i === step ? "active" : ""}` }, label)));
  container.appendChild(tabs);

  const body = el("div", {});
  container.appendChild(body);

  const nav = el("div", { class: "btn-row", style: "margin-top:1rem" });
  const backBtn = el("button", { class: "btn", onclick: () => go(step - 1) }, "← Atrás");
  const nextBtn = el("button", { class: "btn btn-primary", onclick: () => go(step + 1) }, "Siguiente →");
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
    nextBtn.textContent = step === PARTS.length - 1 ? "Terminar lección" : "Siguiente →";
    nextBtn.onclick = step === PARTS.length - 1 ? finishLesson : () => go(step + 1);
    body.innerHTML = "";
    body.appendChild(renderPart(step));
  }

  function renderPart(i) {
    if (i === 0) return partReview();
    if (i === 1) return partRecall();
    if (i === 2) return partNewVocab();
    if (i === 3) return partNewSentences();
    if (i === 4) return partMiniDialogue();
    if (i === 5) return partListening();
    if (i === 6) return partSpeaking();
    if (i === 7) return partActflTask();
    return partProgressUpdate();
  }

  function partReview() {
    const counts = reviewCounts();
    return el("div", { class: "card" }, [
      el("h3", { class: "card-title" }, "Review old material"),
      counts.dueToday > 0
        ? el("div", {}, [
            el("p", {}, `You have ${counts.dueToday} item(s) due for review (vocabulary and sentence patterns).`),
            el("a", { class: "btn btn-primary", href: "#/review" }, "Go review now"),
            el("p", { class: "text-faint", style: "margin-top:.5rem" }, "Come back to this tab afterward to continue today's lesson.")
          ])
        : el("p", {}, "Nothing due today — you're caught up. Moving straight to new material.")
    ]);
  }

  function partRecall() {
    const knownIds = Object.keys(store.state.srs).filter((id) => isMastered(id, 40));
    const sample = knownIds.slice(0, 6).map((id) => {
      const [type, ...rest] = id.split("_");
      const dataId = rest.join("_");
      if (type === "word") return { type, data: VOCABULARY.find((v) => v.id === dataId) };
      if (type === "sentence") return { type, data: SENTENCES.find((s) => s.id === dataId) };
      return null;
    }).filter((x) => x && x.data);

    if (sample.length === 0) {
      return el("div", { class: "card" }, [
        el("h3", { class: "card-title" }, "Recall drills"),
        el("p", {}, "No material learned yet to drill — that's fine on day one. This section fills in as you build up known vocabulary and sentences.")
      ]);
    }

    const wrap = el("div", { class: "card" }, [el("h3", { class: "card-title" }, "Recall drills"), el("p", { class: "text-muted" }, "Try to recall the meaning before revealing it.")]);
    sample.forEach((item) => {
      const front = item.type === "word" ? item.data.word : item.data.es;
      const meaning = item.type === "word" ? item.data.meaning : item.data.en;
      const row = el("div", { class: "flex justify-between items-center", style: "padding:.5rem 0;border-bottom:1px solid var(--border)" }, [
        el("span", { class: "es-text", style: "font-size:1.05rem" }, front),
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

  function partNewVocab() {
    const wrap = el("div", { class: "card" }, [el("h3", { class: "card-title" }, "3–5 new words"), el("p", { class: "text-muted" }, "Listen, then head to Vocabulario to formally add these to your review queue.")]);
    lesson.newWords.forEach((v) => {
      wrap.appendChild(
        el("div", { style: "padding:.5rem 0;border-bottom:1px solid var(--border)" }, [
          el("div", { class: "flex justify-between items-center" }, [
            el("span", { class: "es-text", style: "font-size:1.1rem" }, v.word),
            el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(v.word) }, "🔊")
          ]),
          el("div", { class: "text-muted" }, v.meaning),
          el("div", { class: "usage-note" }, v.usageNote)
        ])
      );
    });
    return wrap;
  }

  function partNewSentences() {
    const wrap = el("div", { class: "card" }, [el("h3", { class: "card-title" }, "Useful sentences today")]);
    lesson.newSentences.forEach((s) => {
      wrap.appendChild(
        el("div", { style: "padding:.5rem 0;border-bottom:1px solid var(--border)" }, [
          el("div", { class: "flex justify-between items-center" }, [
            el("span", { class: "es-text" }, s.es),
            el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(s.es) }, "🔊")
          ]),
          el("div", { class: "text-muted" }, s.en),
          el("div", { class: "text-faint", style: "font-size:.82rem" }, s.pattern)
        ])
      );
    });
    return wrap;
  }

  function partMiniDialogue() {
    const d = lesson.dialogue;
    if (!d) return el("div", { class: "card" }, [el("h3", { class: "card-title" }, "Mini dialogue"), el("p", {}, "You've completed every dialogue — amazing! Revisit any of them from Diálogos.")]);
    const wrap = el("div", { class: "card" }, [
      el("h3", { class: "card-title" }, `Mini dialogue: ${d.title}`)
    ]);
    d.lines.slice(0, 4).forEach((l) => {
      wrap.appendChild(el("p", {}, [el("strong", {}, `${l.spk}: `), el("span", { class: "es-text" }, l.es), el("span", { class: "text-muted" }, ` (${l.en})`)]));
    });
    wrap.appendChild(el("a", { class: "btn btn-primary", style: "margin-top:.5rem", href: `#/dialogues/${d.id}` }, "Open full dialogue"));
    return wrap;
  }

  function partListening() {
    const s = lesson.newSentences[0] || SENTENCES[0];
    const input = el("input", { type: "text", placeholder: "Escribe lo que escuchaste..." });
    input.style.cssText = "width:100%;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1rem;";
    const result = el("p", { class: "text-muted hidden" });
    const wrap = el("div", { class: "card" }, [
      el("h3", { class: "card-title" }, "Listening simulation"),
      el("p", { class: "text-muted" }, "Listen to the sentence (as many times as you like), then type what you heard."),
      el("button", { class: "btn btn-sm", onclick: () => audioEngine.speak(s.es) }, "🔊 Play"),
      el("button", { class: "btn btn-sm", onclick: () => audioEngine.speakSlow(s.es) }, "🐢 Play slow"),
      input,
      el("button", {
        class: "btn btn-primary btn-sm", style: "margin-top:.5rem",
        onclick: () => {
          const score = textSimilarity(input.value, s.es);
          result.classList.remove("hidden");
          result.textContent = `Match: ${score}% — correct: "${s.es}" (${s.en})`;
          updateSkillScore("listening", score >= 60 ? 2 : -0.5);
          addXP(4, "Listening simulation");
        }
      }, "Check"),
      result
    ]);
    return wrap;
  }

  function partSpeaking() {
    const wrap = el("div", { class: "card" }, [
      el("h3", { class: "card-title" }, "Speaking practice" ),
      el("p", { class: "text-muted" }, "Say today's new sentences out loud, shadowing the audio. Each phrase plays 3 times with a pause to repeat.")
    ]);
    lesson.newSentences.forEach((s) => {
      const status = el("span", { class: "text-faint" }, "");
      wrap.appendChild(
        el("div", { style: "padding:.5rem 0;border-bottom:1px solid var(--border)" }, [
          el("div", { class: "es-text" }, s.es),
          el("div", { class: "text-muted" }, s.en),
          el("div", { class: "btn-row", style: "margin-top:.3rem" }, [
            el("button", { class: "btn btn-sm", onclick: () => { status.textContent = "Shadowing..."; audioEngine.shadow(s.es, { repeats: 3, onRound: (r) => (status.textContent = `Round ${r}/3 — repite ahora`), onDone: () => { status.textContent = "¡Listo!"; updateSkillScore("speaking", 1.5); } }); } }, "🎧 Start shadowing"),
            status
          ])
        ])
      );
    });
    return wrap;
  }

  function partActflTask() {
    const level = estimatedLevel();
    const task = level.canDo[Math.floor(Math.random() * level.canDo.length)];
    const wrap = el("div", { class: "card" }, [
      el("h3", { class: "card-title" }, `ACTFL task — ${level.label}`),
      el("p", {}, `Today's task, matched to your level: `, ),
      el("p", { style: "font-weight:700" }, task),
      el("p", { class: "text-muted" }, "Write (or say aloud) a short response. There's no wrong answer — this is about attempting production at your target level.")
    ]);
    const ta = el("textarea", { placeholder: "Escribe tu respuesta en español..." });
    wrap.appendChild(ta);
    const feedback = el("p", { class: "text-faint hidden" }, "Nice work attempting production — that's the hardest and most valuable skill to practice.");
    wrap.appendChild(
      el("button", {
        class: "btn btn-primary btn-sm",
        onclick: () => {
          if (ta.value.trim().length < 5) { toast("Write at least a little before checking off this step.", { type: "error" }); return; }
          feedback.classList.remove("hidden");
          updateSkillScore("writing", 2);
          addXP(8, "ACTFL task production");
        }
      }, "Ya terminé")
    );
    wrap.appendChild(feedback);
    return wrap;
  }

  function partProgressUpdate() {
    const level = estimatedLevel();
    const counts = reviewCounts();
    const learning = Object.keys(store.state.srs).filter((id) => !isMastered(id, 70)).length;
    return el("div", { class: "card" }, [
      el("h3", { class: "card-title" }, "Progress update" ),
      el("div", { class: "grid grid-3" }, [
        statBox("Mastered", counts.total - learning),
        statBox("Learning", learning),
        statBox("Review due", counts.dueToday)
      ]),
      el("p", { class: "text-muted", style: "margin-top:.75rem" }, `Current ACTFL estimate: ${level.label} (${level.short})`),
      el("p", { class: "text-muted" }, "Click \"Terminar lección\" to log today's session and earn XP.")
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
      toast("¡Daily Lesson complete! +20 XP", { type: "xp", icon: "⚡" });
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
  const knownSentenceIds = new Set(Object.keys(store.state.srs).filter((id) => id.startsWith("sentence_")).map((id) => id.replace("sentence_", "")));

  const newWords = VOCABULARY.filter((v) => !knownWordIds.has(v.id)).slice(0, 4);
  const newSentences = SENTENCES.filter((s) => !knownSentenceIds.has(s.id)).slice(0, 3);
  const dialogue = DIALOGUES.find((d) => !store.state.progress.dialoguesCompleted.includes(d.id)) || null;

  return { newWords, newSentences, dialogue };
}
