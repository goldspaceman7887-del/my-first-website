import { store } from "../core/storage.js";
import { el, blurActive } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { gradeItem, QUALITY } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { READINGS } from "../data/reading.js";

function parseQuery() {
  return new URLSearchParams((window.location.hash.split("?")[1]) || "");
}

export function renderReading(container, params) {
  if (params && params.id) return renderReadingDetail(container, params.id);
  const query = parseQuery();
  const levelFilter = query.get("level");

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "📖 Sistema de lectura"),
      el("p", {}, "Textos de dificultad progresiva ambientados en España, con vocabulario glosado y preguntas de comprensión.")
    ])
  );

  const completed = new Set(store.state.progress.readingCompleted);
  const levels = [...new Set(READINGS.map((r) => r.level))];
  const pills = el(
    "div",
    { class: "level-pills" },
    [{ id: null, label: "Todos" }, ...levels.map((l) => ({ id: l, label: l }))].map((l) =>
      el(
        "button",
        { class: `level-pill ${levelFilter === l.id ? "active" : ""}`, onclick: () => (window.location.hash = l.id ? `#/reading?level=${l.id}` : "#/reading") },
        l.label
      )
    )
  );
  container.appendChild(pills);

  const grid = el("div", { class: "grid grid-3" });
  READINGS.filter((r) => !levelFilter || r.level === levelFilter).forEach((r) => {
    grid.appendChild(
      el("a", { class: "card card-link", href: `#/reading/${r.id}` }, [
        el("div", { class: "flex justify-between items-center" }, [
          el("span", { class: "badge badge-level" }, r.level),
          completed.has(r.id) ? el("span", { class: "badge badge-success" }, "✓ Leído") : el("span", { class: "badge badge-default" }, `${r.wordCount || "~"} palabras`)
        ]),
        el("h3", { style: "margin:.5rem 0 .3rem" }, r.title),
        el("p", { class: "text-muted", style: "font-size:.85rem" }, r.text.slice(0, 90) + "…")
      ])
    );
  });
  container.appendChild(grid);
}

function renderReadingDetail(container, id) {
  const r = READINGS.find((x) => x.id === id);
  if (!r) {
    container.appendChild(el("div", { class: "card" }, "Lectura no encontrada."));
    return;
  }
  let showTranslation = false;
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("a", { href: "#/reading", class: "text-muted" }, "← Sistema de lectura"),
      el("h1", { style: "margin-top:.5rem" }, r.title),
      el("span", { class: "badge badge-level" }, r.level)
    ])
  );

  const textCard = el("div", { class: "card" });
  const controls = el("div", { class: "audio-controls-row" }, [
    el("button", { class: "btn btn-sm", onclick: () => audioEngine.speak(r.text, { rate: store.state.settings.slowVoiceRate }) }, "🐢 Escuchar lento"),
    el("button", { class: "btn btn-sm", onclick: () => audioEngine.speak(r.text) }, "🔊 Escuchar"),
    el("button", { class: "btn btn-sm btn-ghost", onclick: () => audioEngine.stop() }, "⏹")
  ]);
  textCard.appendChild(controls);
  const textBody = el("div", { style: "font-family:var(--font-es);font-size:1.08rem;line-height:1.8" });
  r.text.split("\n\n").forEach((p) => textBody.appendChild(el("p", {}, p)));
  textCard.appendChild(textBody);
  const toggleBtn = el(
    "button",
    {
      class: "btn btn-sm",
      onclick: (e) => {
        showTranslation = !showTranslation;
        transBody.classList.toggle("hidden", !showTranslation);
        e.target.textContent = showTranslation ? "🙈 Ocultar traducción" : "👁 Ver traducción";
      }
    },
    "👁 Ver traducción"
  );
  textCard.appendChild(toggleBtn);
  const transBody = el("div", { class: "hidden", style: "margin-top:.75rem;color:var(--text-muted)" });
  r.translation.split("\n\n").forEach((p) => transBody.appendChild(el("p", {}, p)));
  textCard.appendChild(transBody);
  container.appendChild(textCard);

  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "Vocabulario"),
      el(
        "table",
        { class: "data-table" },
        [el("tbody", {}, r.vocab.map((v) => el("tr", {}, [el("td", {}, v.es), el("td", { class: "text-muted" }, v.en)])))]
      )
    ])
  );

  const qCard = el("div", { class: "card" }, [el("div", { class: "card-title" }, "Preguntas de comprensión")]);
  let correct = 0;
  r.questions.forEach((q, i) => {
    const qWrap = el("div", { style: "margin-bottom:1rem" }, [el("p", { style: "font-weight:700" }, `${i + 1}. ${q.q}`)]);
    const list = el("div", { class: "option-list" });
    q.options.forEach((opt) => {
      list.appendChild(
        el(
          "button",
          {
            class: "option-btn",
            onclick: (e) => {
              list.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
              const isCorrect = opt === q.answer;
              e.target.classList.add(isCorrect ? "correct" : "incorrect");
              if (!isCorrect) Array.from(list.children).find((b) => b.textContent === q.answer)?.classList.add("correct");
              blurActive();
              if (isCorrect) {
                correct++;
                onDone();
              }
            }
          },
          opt
        )
      );
    });
    qWrap.appendChild(list);
    qCard.appendChild(qWrap);
  });
  container.appendChild(qCard);

  let markedDone = false;
  function onDone() {
    if (markedDone) return;
    markedDone = true;
    if (!store.state.progress.readingCompleted.includes(r.id)) {
      store.state.progress.readingCompleted.push(r.id);
    }
    gradeItem(`reading_${r.id}`, "reading", QUALITY.GOOD);
    addXP(10, `Lectura: ${r.title}`);
    updateSkillScore("vocabulary", 1);
    store.save();
  }
}
