import { store } from "../core/storage.js";
import { el, esc, toast, blurActive } from "../core/ui.js";
import { audioEngine, textSimilarity, speechRecognitionSupported, listenOnce } from "../core/audio.js";
import { gradeItem, QUALITY } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { tappable, initTapWords } from "../core/tapword.js";
import { DIALOGUES_BEGINNER_INTERMEDIATE } from "../data/dialogues-beginner-intermediate.js";
import { DIALOGUES_ADVANCED } from "../data/dialogues-advanced.js";

export const ALL_DIALOGUES = [...DIALOGUES_BEGINNER_INTERMEDIATE, ...DIALOGUES_ADVANCED];

function parseQuery() {
  return new URLSearchParams((window.location.hash.split("?")[1]) || "");
}

const CATEGORY_LABELS = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  challenge: "Reto Advanced Low"
};

export function renderDialogueList(container) {
  const query = parseQuery();
  const state = { category: query.get("category") || "all", search: "" };
  const completed = new Set(store.state.progress.dialoguesCompleted);

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "💬 Conversations · Diálogos"),
      el("p", {}, "Real-life conversations you'd actually have in Spain. Pick one below, listen to it, then work through it step by step."),
      el("p", { class: "text-faint" }, "Diálogos realistas de España, con audio, cultura y tareas para llevarte hasta ACTFL Advanced Low.")
    ])
  );

  const searchRow = el("div", { class: "search-row" });
  const input = el("input", {
    type: "search",
    placeholder: "Buscar diálogos...",
    style: "flex:1;min-width:200px;padding:.6rem .9rem;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--text)"
  });
  input.addEventListener("input", () => {
    state.search = input.value;
    renderList();
  });
  searchRow.appendChild(input);
  container.appendChild(searchRow);

  const pills = el(
    "div",
    { class: "level-pills" },
    [{ id: "all", label: "Todos" }, ...Object.entries(CATEGORY_LABELS).map(([id, label]) => ({ id, label }))].map((c) =>
      el(
        "button",
        {
          class: `level-pill ${state.category === c.id ? "active" : ""}`,
          onclick: () => {
            state.category = c.id;
            refreshPills();
            renderList();
          }
        },
        c.label
      )
    )
  );
  container.appendChild(pills);
  function refreshPills() {
    pills.querySelectorAll(".level-pill").forEach((b, i) => {
      const ids = ["all", ...Object.keys(CATEGORY_LABELS)];
      b.classList.toggle("active", ids[i] === state.category);
    });
  }

  const progressLine = el("p", { class: "text-muted" }, "");
  container.appendChild(progressLine);
  const grid = el("div", { class: "grid grid-3" });
  container.appendChild(grid);

  function renderList() {
    grid.innerHTML = "";
    const s = state.search.trim().toLowerCase();
    const filtered = ALL_DIALOGUES.filter((d) => {
      if (state.category !== "all" && d.category !== state.category) return false;
      if (s && !(d.title.toLowerCase().includes(s) || (d.englishTitle || "").toLowerCase().includes(s))) return false;
      return true;
    });
    progressLine.textContent = `${completed.size} / ${ALL_DIALOGUES.length} diálogos completados · mostrando ${filtered.length}`;
    filtered.forEach((d) => {
      grid.appendChild(
        el("a", { class: "card card-link", href: `#/dialogues/${d.id}` }, [
          el("div", { class: "flex justify-between items-center" }, [
            el("span", { class: "badge badge-level" }, d.level),
            completed.has(d.id) ? el("span", { class: "badge badge-success" }, "✓ Hecho") : el("span", { class: "badge badge-default" }, CATEGORY_LABELS[d.category] || d.category)
          ]),
          el("h3", { style: "margin:.5rem 0 .3rem" }, d.title),
          el("p", { class: "text-muted", style: "font-size:.87rem" }, d.englishTitle || ""),
          el("p", { class: "text-faint", style: "font-size:.8rem" }, d.scenario.slice(0, 90) + (d.scenario.length > 90 ? "…" : ""))
        ])
      );
    });
    if (!filtered.length) {
      grid.appendChild(el("div", { class: "empty-state" }, "No se encontraron diálogos."));
    }
  }
  renderList();
}

function immersionShowsTranslation() {
  return (store.state.settings.immersionLevel || 1) <= 2;
}

export function renderDialogueDetail(container, params) {
  const d = ALL_DIALOGUES.find((x) => x.id === params.id);
  if (!d) {
    container.appendChild(el("div", { class: "card" }, "Diálogo no encontrado."));
    return;
  }

  let showTranslations = immersionShowsTranslation();
  let currentRate = store.state.settings.voiceRate;

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("a", { href: "#/dialogues", class: "text-muted" }, "← Academia de diálogos"),
      el("h1", { style: "margin-top:.5rem" }, d.title),
      el("p", { class: "text-muted" }, d.englishTitle),
      el("div", { class: "flex gap-1" }, [
        el("span", { class: "badge badge-level" }, d.level),
        el("span", { class: "badge badge-default" }, CATEGORY_LABELS[d.category] || d.category)
      ])
    ])
  );

  container.appendChild(
    el("div", { class: "card" }, [el("div", { class: "card-title" }, "1. Escenario"), el("p", { style: "margin:0" }, d.scenario)])
  );

  // 2+3. Dialogue + audio controls
  const audioRow = el("div", { class: "audio-controls-row" }, [
    el("strong", {}, "🔊 Audio:"),
    speedToggle(),
    el("button", { class: "btn btn-sm", onclick: () => playAll() }, "▶ Reproducir todo"),
    el("button", { class: "btn btn-sm btn-ghost", onclick: () => audioEngine.stop() }, "⏹ Parar"),
    el(
      "button",
      {
        class: "btn btn-sm",
        onclick: (e) => {
          showTranslations = !showTranslations;
          renderLines();
          e.target.textContent = showTranslations ? "🙈 Ocultar traducción" : "👁 Mostrar traducción";
        }
      },
      showTranslations ? "🙈 Ocultar traducción" : "👁 Mostrar traducción"
    )
  ]);

  function speedToggle() {
    const wrap = el("div", { class: "speed-toggle" }, [
      el("button", { class: "active", onclick: (e) => setRate(store.state.settings.voiceRate, e) }, "Natural"),
      el("button", { onclick: (e) => setRate(store.state.settings.slowVoiceRate, e) }, "Lento")
    ]);
    function setRate(rate, e) {
      currentRate = rate;
      wrap.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
    }
    return wrap;
  }

  const linesWrap = el("div", { class: "card" });
  const dialogueSection = el("div", {}, [el("h2", {}, "2. Diálogo"), audioRow, linesWrap]);
  container.appendChild(dialogueSection);

  function renderLines() {
    linesWrap.innerHTML = "";
    d.lines.forEach((line, i) => {
      const isMe = /^t[uú]$/i.test(line.speaker) || /^yo$/i.test(line.speaker);
      linesWrap.appendChild(
        el("div", { class: `dialogue-line ${isMe ? "me" : ""}` }, [
          el("div", { class: "speaker-tag" }, line.speaker),
          el("div", { class: "line-content" }, [
            el("div", { class: "line-es" }, [tappable(line.es)]),
            showTranslations ? el("div", { class: "line-en" }, line.en) : null
          ].filter(Boolean)),
          el("div", { class: "line-controls" }, [
            el(
              "button",
              {
                class: "play-btn",
                id: `play-line-${i}`,
                onclick: async (e) => {
                  e.currentTarget.classList.add("playing");
                  await audioEngine.speak(line.es, { rate: currentRate });
                  e.currentTarget.classList.remove("playing");
                }
              },
              "🔊"
            )
          ])
        ])
      );
    });
  }
  renderLines();

  async function playAll() {
    for (const line of d.lines) {
      await audioEngine.speak(line.es, { rate: currentRate });
    }
  }

  // 5. Vocabulary breakdown
  container.appendChild(
    el("div", { class: "card" }, [
      el("h2", {}, "3. Vocabulario clave"),
      el(
        "table",
        { class: "data-table" },
        [
          el("thead", {}, el("tr", {}, [el("th", {}, "Español"), el("th", {}, "Inglés"), el("th", {}, "Nota")])),
          el("tbody", {}, d.vocabulary.map((v) => el("tr", {}, [el("td", {}, v.es), el("td", {}, v.en), el("td", { class: "text-muted" }, v.note || "")])))
        ]
      )
    ])
  );

  // 6. Grammar breakdown
  container.appendChild(
    el("div", { class: "card" }, [
      el("h2", {}, "4. Gramática en contexto"),
      el("div", { class: "flex-col gap-1" }, d.grammarNotes.map((g) => el("div", {}, [el("strong", {}, g.point + ": "), el("span", { class: "text-muted" }, g.explanation)])))
    ])
  );

  // 7. Comprehension questions
  const compCard = el("div", { class: "card" }, [el("h2", {}, "5. Preguntas de comprensión")]);
  let compCorrect = 0;
  d.comprehensionQuestions.forEach((q, i) => {
    const qWrap = el("div", { style: "margin-bottom:1rem" }, [el("p", { style: "font-weight:700" }, `${i + 1}. ${q.q}`)]);
    if (q.type === "mc" && q.options) {
      const list = el("div", { class: "option-list" });
      q.options.forEach((opt) => {
        list.appendChild(
          el(
            "button",
            {
              class: "option-btn",
              onclick: (e) => {
                list.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
                const correct = opt === q.answer;
                e.target.classList.add(correct ? "correct" : "incorrect");
                if (!correct) Array.from(list.children).find((b) => b.textContent === q.answer)?.classList.add("correct");
                blurActive();
                if (correct) { compCorrect++; onCompProgress(); }
              }
            },
            opt
          )
        );
      });
      qWrap.appendChild(list);
    } else {
      const input = el("input", { type: "text", placeholder: "Tu respuesta...", style: "width:100%;padding:.6rem;border-radius:8px;border:1px solid var(--border);background:var(--surface-2);color:var(--text)" });
      const fb = el("div", { class: "feedback-block hidden" });
      const btn = el(
        "button",
        {
          class: "btn btn-sm",
          onclick: () => {
            const correct = input.value.trim().length > 0 && textSimilarity(input.value, q.answer) >= 40;
            fb.classList.remove("hidden", "correct", "incorrect");
            fb.classList.add(correct ? "correct" : "incorrect");
            fb.textContent = correct ? "¡Bien!" : `Respuesta orientativa: ${q.answer}`;
            blurActive();
            if (correct) { compCorrect++; onCompProgress(); }
          }
        },
        "Comprobar"
      );
      qWrap.appendChild(el("div", { class: "btn-row", style: "margin-top:.4rem" }, [input, btn]));
      qWrap.appendChild(fb);
    }
    compCard.appendChild(qWrap);
  });
  let compDone = false;
  function onCompProgress() {
    if (compDone) return;
    compDone = true;
    markSection("comprehension");
  }
  container.appendChild(compCard);

  // 8. Speaking tasks
  container.appendChild(
    el("div", { class: "card" }, [
      el("h2", {}, "6. Tareas de expresión oral"),
      el("ul", {}, d.speakingTasks.map((t) => el("li", {}, t))),
      el(
        "button",
        {
          class: "btn",
          onclick: async () => {
            if (speechRecognitionSupported()) {
              toast("Escuchando... habla ahora", { icon: "🎙️" });
              const res = await listenOnce();
              if (res.transcript) toast(`Te oí decir: "${res.transcript}"`, { icon: "✅", duration: 5000 });
              else toast("No se detectó voz, inténtalo de nuevo.", { icon: "⚠️" });
            } else {
              toast("El reconocimiento de voz no está disponible en este navegador. Practica en voz alta igualmente.", { icon: "ℹ️" });
            }
            markSection("speaking");
            addXP(5, "Práctica oral");
            updateSkillScore("speaking", 1.5);
          }
        },
        "🎤 Grabar mi intento"
      )
    ])
  );

  // 9. Dictation
  const dictWrap = el("div", { class: "card" });
  dictWrap.appendChild(el("h2", {}, "7. Dictado"));
  dictWrap.appendChild(el("p", { class: "text-muted" }, "Escucha y escribe exactamente lo que oigas."));
  dictWrap.appendChild(el("button", { class: "btn btn-sm", onclick: () => audioEngine.speak(d.dictationText, { rate: store.state.settings.slowVoiceRate }) }, "🔊 Reproducir (lento)"));
  const dictInput = el("textarea", { style: "margin-top:.6rem;width:100%;min-height:70px", placeholder: "Escribe lo que oyes..." });
  dictWrap.appendChild(dictInput);
  const dictFeedback = el("div", { class: "feedback-block hidden" });
  dictWrap.appendChild(
    el(
      "button",
      {
        class: "btn btn-primary",
        style: "margin-top:.5rem",
        onclick: () => {
          const score = textSimilarity(dictInput.value, d.dictationText);
          dictFeedback.classList.remove("hidden", "correct", "incorrect");
          dictFeedback.classList.add(score >= 70 ? "correct" : "incorrect");
          dictFeedback.innerHTML = `Precisión: <strong>${score}%</strong><br>Texto correcto: <em>${esc(d.dictationText)}</em>`;
          blurActive();
          gradeItem(`dialogue_dict_${d.id}`, "listening", score >= 70 ? QUALITY.GOOD : QUALITY.AGAIN);
          addXP(score >= 70 ? 5 : 1, "Dictado");
          updateSkillScore("listening", score >= 70 ? 1.5 : -0.5);
        }
      },
      "Comprobar dictado"
    )
  );
  dictWrap.appendChild(dictFeedback);
  container.appendChild(dictWrap);

  // 10. Cultural notes
  const cn = d.culturalNotes;
  container.appendChild(
    el("div", { class: "card" }, [
      el("h2", {}, "8. Notas culturales"),
      el("div", { class: "culture-notes-grid" }, [
        cultureBlock("Contexto cultural", cn.context),
        cultureBlock("Comportamiento natural", cn.nativeBehaviour),
        cultureBlock("Registro", cn.register),
        cultureBlock("Expresiones clave", cn.keyExpressions),
        cultureBlock("⚠️ Avisos culturales", cn.warnings),
        cultureBlock("Notas regionales", cn.regionalNotes),
        cultureBlock("Consejo práctico", cn.practicalAdvice),
        cultureBlock("Notas de un hablante nativo", cn.nativeSpeakerNotes)
      ])
    ])
  );
  function cultureBlock(title, content) {
    const body = Array.isArray(content) ? el("ul", {}, content.map((c) => el("li", {}, c))) : el("p", { style: "margin:0" }, content);
    return el("div", { class: "culture-note-block" }, [el("h4", {}, title), body]);
  }

  // 11. Common mistakes
  container.appendChild(
    el("div", { class: "card" }, [el("h2", {}, "9. Errores típicos de anglohablantes"), el("ul", {}, d.commonMistakes.map((m) => el("li", {}, m)))])
  );

  // 12. Advanced Low extension
  const extWrap = el("div", { class: "card" });
  extWrap.appendChild(el("h2", {}, "10. Reto ACTFL Advanced Low"));
  extWrap.appendChild(el("p", {}, d.advancedLowExtension));
  const extArea = el("textarea", { placeholder: "Escribe o practica en voz alta tu respuesta extendida...", style: "width:100%;min-height:110px" });
  extWrap.appendChild(extArea);
  extWrap.appendChild(
    el(
      "button",
      {
        class: "btn",
        style: "margin-top:.5rem",
        onclick: () => {
          blurActive();
          if (extArea.value.trim().split(/\s+/).length >= 15) {
            toast("¡Buen trabajo desarrollando la idea!", { icon: "🚀" });
            addXP(8, "Reto Advanced Low");
            updateSkillScore("speaking", 2);
          } else {
            toast("Intenta escribir una respuesta más larga y desarrollada.", { icon: "✏️" });
          }
        }
      },
      "Registrar mi respuesta"
    )
  );
  container.appendChild(extWrap);

  // Completion
  const doneBtn = el(
    "button",
    {
      class: "btn btn-primary btn-lg btn-block",
      onclick: () => {
        if (!store.state.progress.dialoguesCompleted.includes(d.id)) {
          store.state.progress.dialoguesCompleted.push(d.id);
          gradeItem(`dialogue_${d.id}`, "dialogue", QUALITY.GOOD);
          addXP(15, `Diálogo completado: ${d.title}`);
          store.save();
          toast("¡Diálogo completado! +15 XP", { icon: "🎉" });
        }
        doneBtn.textContent = "✓ Diálogo completado";
        doneBtn.disabled = true;
      }
    },
    store.state.progress.dialoguesCompleted.includes(d.id) ? "✓ Diálogo completado" : "Marcar diálogo como completado"
  );
  if (store.state.progress.dialoguesCompleted.includes(d.id)) doneBtn.disabled = true;
  container.appendChild(doneBtn);

  function markSection(section) {
    const sec = store.state.progress.dialogueSectionsCompleted;
    if (!sec[d.id]) sec[d.id] = {};
    sec[d.id][section] = true;
    store.save();
  }

  return initTapWords();
}
