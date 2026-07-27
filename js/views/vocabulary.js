import { store } from "../core/storage.js";
import { el } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { gradeItem, masteryLevel, QUALITY, newItems, dueItems } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { VOCABULARY } from "../data/vocabulary.js";

function srsId(v) {
  return `vocab_${v.id}`;
}

function parseQuery() {
  const q = (window.location.hash.split("?")[1]) || "";
  return new URLSearchParams(q);
}

function levelsPresent() {
  return ["A0", "A1", "A2", "B1", "B2", "C1"].filter((l) => VOCABULARY.some((v) => v.level === l));
}

function categoriesPresent() {
  return [...new Set(VOCABULARY.map((v) => v.category))].sort();
}

export function renderVocabulary(container) {
  const query = parseQuery();
  const state = {
    tab: "flashcards",
    level: query.get("level") || "all",
    category: "all",
    search: ""
  };

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🗂️ Entrenador de vocabulario"),
      el("p", {}, "Vocabulario de mayor frecuencia del español de España, con repetición espaciada (SRS) y audio nativo.")
    ])
  );

  const tabs = el("div", { class: "tabs" }, [
    tabBtn("flashcards", "Tarjetas (SRS)"),
    tabBtn("explore", "Explorar y buscar")
  ]);
  container.appendChild(tabs);

  const body = el("div", {});
  container.appendChild(body);

  function tabBtn(id, label) {
    const b = el(
      "button",
      { class: `tab-btn ${state.tab === id ? "active" : ""}`, onclick: () => setTab(id) },
      label
    );
    b.dataset.tabId = id;
    return b;
  }

  function setTab(id) {
    state.tab = id;
    tabs.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tabId === id));
    renderBody();
  }

  function renderBody() {
    body.innerHTML = "";
    if (state.tab === "flashcards") body.appendChild(renderFlashcards());
    else body.appendChild(renderExplore());
  }

  function renderFlashcards() {
    const wrap = el("div", {});
    const due = dueItems("vocab").filter((i) => i.id.startsWith("vocab_"));
    const newIds = newItems(
      VOCABULARY.map(srsId),
      "vocab"
    );
    let queue = [
      ...due.map((d) => d.id.replace("vocab_", "")),
      ...newIds.map((id) => id.replace("vocab_", ""))
    ];
    queue = [...new Set(queue)].slice(0, 20);
    const items = queue.map((id) => VOCABULARY.find((v) => v.id === id)).filter(Boolean);

    if (items.length === 0) {
      wrap.appendChild(
        el("div", { class: "card empty-state" }, [
          el("div", { class: "empty-icon" }, "🎉"),
          el("h3", {}, "¡Todo repasado por ahora!"),
          el("p", {}, "No tienes tarjetas pendientes. Vuelve más tarde o explora nuevo vocabulario en la pestaña Explorar.")
        ])
      );
      return wrap;
    }

    let idx = 0;
    const stage = el("div", { class: "flashcard-stage" });
    const counter = el("p", { class: "text-muted" }, `Tarjeta 1 de ${items.length}`);
    wrap.appendChild(counter);
    wrap.appendChild(stage);

    function showCard() {
      stage.innerHTML = "";
      const v = items[idx];
      const card = el("div", { class: "flashcard" });
      const inner = el("div", { class: "flashcard-inner" }, [
        el("div", { class: "flashcard-face front" }, [
          el("div", { class: "badge badge-level" }, v.level),
          el("div", { class: "flashcard-word" }, v.es),
          el(
            "button",
            {
              class: "play-btn",
              onclick: (e) => {
                e.stopPropagation();
                audioEngine.speak(v.es);
              }
            },
            "🔊"
          ),
          el("div", { class: "flashcard-hint" }, "Toca para ver la traducción")
        ]),
        el("div", { class: "flashcard-face back" }, [
          el("div", { class: "flashcard-word", style: "font-size:1.3rem" }, v.en),
          el("div", { class: "flashcard-sub" }, v.exampleEs),
          el("div", { class: "flashcard-sub text-faint" }, v.exampleEn),
          v.spainNote ? el("div", { class: "badge badge-gold", style: "margin-top:.4rem" }, v.spainNote) : null
        ].filter(Boolean))
      ]);
      card.appendChild(inner);
      card.addEventListener("click", () => card.classList.toggle("flipped"));
      stage.appendChild(card);

      const ratingRow = el("div", { class: "srs-rating-row" }, [
        ratingBtn("Otra vez", QUALITY.AGAIN, "btn-danger"),
        ratingBtn("Difícil", QUALITY.HARD, "btn"),
        ratingBtn("Bien", QUALITY.GOOD, "btn"),
        ratingBtn("Fácil", QUALITY.EASY, "btn-success")
      ]);
      stage.appendChild(ratingRow);
      counter.textContent = `Tarjeta ${idx + 1} de ${items.length}`;

      if (store.state.settings.autoplayAudio) audioEngine.speak(v.es);

      function ratingBtn(label, quality, cls) {
        return el(
          "button",
          {
            class: `btn ${cls}`,
            onclick: () => {
              gradeItem(srsId(v), "vocab", quality);
              store.state.progress.vocabExposure[v.id] = (store.state.progress.vocabExposure[v.id] || 0) + 1;
              const xp = quality >= 3 ? 3 : 1;
              addXP(xp, `Vocabulario: ${v.es}`);
              updateSkillScore("vocabulary", quality >= 3 ? 1 : -0.5);
              store.save();
              idx++;
              if (idx >= items.length) {
                stage.innerHTML = "";
                counter.textContent = "";
                stage.appendChild(
                  el("div", { class: "card empty-state pop-in" }, [
                    el("div", { class: "empty-icon" }, "✅"),
                    el("h3", {}, "¡Sesión completada!"),
                    el("button", { class: "btn btn-primary", onclick: renderBody }, "Repasar más")
                  ])
                );
              } else {
                showCard();
              }
            }
          },
          label
        );
      }
    }
    showCard();
    return wrap;
  }

  function renderExplore() {
    const wrap = el("div", {});
    const searchRow = el("div", { class: "search-row" });
    const input = el("input", { type: "search", placeholder: "Buscar en español o inglés...", style: "flex:1;min-width:200px;padding:.6rem .9rem;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--text)" });
    input.addEventListener("input", () => {
      state.search = input.value;
      renderList();
    });
    searchRow.appendChild(input);
    wrap.appendChild(searchRow);

    const levelPills = el("div", { class: "level-pills" }, [
      pill("all", "Todos los niveles"),
      ...levelsPresent().map((l) => pill(l, l))
    ]);
    wrap.appendChild(levelPills);

    const catPills = el("div", { class: "level-pills", style: "margin-top:.5rem" }, [
      catPill("all", "Todas las categorías"),
      ...categoriesPresent().map((c) => catPill(c, c))
    ]);
    wrap.appendChild(catPills);

    const countLabel = el("p", { class: "text-muted", style: "margin-top:.75rem" }, "");
    wrap.appendChild(countLabel);
    const list = el("div", { class: "grid grid-auto" });
    wrap.appendChild(list);

    function pill(level, label) {
      const b = el(
        "button",
        { class: `level-pill ${state.level === level ? "active" : ""}`, onclick: () => { state.level = level; refreshPills(); renderList(); } },
        label
      );
      b.dataset.level = level;
      return b;
    }
    function catPill(cat, label) {
      const b = el(
        "button",
        { class: `level-pill ${state.category === cat ? "active" : ""}`, onclick: () => { state.category = cat; refreshCatPills(); renderList(); } },
        label
      );
      b.dataset.cat = cat;
      return b;
    }
    function refreshPills() {
      levelPills.querySelectorAll(".level-pill").forEach((b) => b.classList.toggle("active", b.dataset.level === state.level));
    }
    function refreshCatPills() {
      catPills.querySelectorAll(".level-pill").forEach((b) => b.classList.toggle("active", b.dataset.cat === state.category));
    }

    function renderList() {
      list.innerHTML = "";
      const s = state.search.trim().toLowerCase();
      const filtered = VOCABULARY.filter((v) => {
        if (state.level !== "all" && v.level !== state.level) return false;
        if (state.category !== "all" && v.category !== state.category) return false;
        if (s && !(v.es.toLowerCase().includes(s) || v.en.toLowerCase().includes(s))) return false;
        return true;
      }).sort((a, b) => a.frequencyRank - b.frequencyRank);

      countLabel.textContent = `${filtered.length} palabras`;
      filtered.slice(0, 150).forEach((v) => {
        const mastery = masteryLevel(srsId(v));
        list.appendChild(
          el("div", { class: "card", style: "padding:.9rem" }, [
            el("div", { class: "flex justify-between items-center" }, [
              el("span", { class: "badge badge-level" }, v.level),
              el(
                "button",
                { class: "play-btn", style: "width:30px;height:30px", onclick: () => audioEngine.speak(v.es) },
                "🔊"
              )
            ]),
            el("div", { style: "font-family:var(--font-es);font-weight:700;font-size:1.15rem;margin-top:.4rem" }, v.es),
            el("div", { class: "text-muted", style: "font-size:.88rem" }, v.en),
            el("div", { class: "text-faint", style: "font-size:.78rem;margin-top:.3rem" }, `#${v.frequencyRank} · ${v.category}`),
            el("div", { class: "progress-bar", style: "margin-top:.5rem" }, [
              el("div", { class: "progress-bar-fill", style: `width:${mastery}%` })
            ])
          ])
        );
      });
      if (filtered.length > 150) {
        list.appendChild(el("p", { class: "text-faint" }, `Mostrando 150 de ${filtered.length}. Afina la búsqueda para ver más.`));
      }
    }
    renderList();
    return wrap;
  }

  renderBody();
}
