import { store } from "../core/storage.js";
import { el, blurActive } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { gradeItem, masteryLevel, isMastered, QUALITY, newItems, dueItems } from "../core/srs.js";
import { addXP } from "../core/gamification.js";
import { breakdownWord } from "../core/lookup.js";
import { VOCABULARY } from "../data/vocabulary.js";

function srsId(v) {
  return `word_${v.id}`;
}

function categoriesPresent() {
  return [...new Set(VOCABULARY.map((v) => v.category))].sort();
}

function wordDetail(v) {
  const wrap = el("div", { class: "card" });
  wrap.appendChild(
    el("div", { class: "flex justify-between items-center" }, [
      el("div", { class: "hanzi-lg" }, v.word),
      el("button", { class: "play-btn", onclick: () => audioEngine.speak(v.word) }, "🔊")
    ])
  );
  wrap.appendChild(el("div", { class: "pinyin-lg" }, v.pinyin));
  wrap.appendChild(el("p", {}, [el("strong", {}, v.meaning)]));

  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Common collocations"));
  wrap.appendChild(el("div", {}, v.collocations.map((c) => el("p", {}, [el("span", { class: "hanzi" }, c.w), el("span", { class: "text-muted" }, ` ${c.py} — ${c.en}`)]))));

  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Example sentences"));
  wrap.appendChild(
    el("div", {}, v.sentences.map((s) => el("p", {}, [el("span", { class: "hanzi" }, s.zh), el("br"), el("span", { class: "pinyin" }, s.py), el("br"), el("span", { class: "text-muted" }, s.en)])))
  );

  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Short dialogue"));
  wrap.appendChild(el("div", {}, v.dialogue.map((l) => el("p", {}, [el("strong", {}, `${l.spk}: `), el("span", { class: "hanzi" }, l.zh), el("span", { class: "text-muted" }, ` (${l.py})`)]))));

  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Character breakdown"));
  wrap.appendChild(
    el(
      "div",
      { class: "flex gap-2 flex-wrap" },
      breakdownWord(v.word).map((b) =>
        el("div", { class: "badge badge-default" }, b.entry ? `${b.char} ${b.entry.pinyin} — ${b.entry.meaning}` : b.char)
      )
    )
  );

  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Speaking practice"));
  wrap.appendChild(el("p", { class: "text-muted" }, v.speakingPrompt));

  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Review question"));
  const revealBtn = el("button", { class: "btn btn-sm" }, "Reveal answer");
  const answer = el("p", { class: "text-muted hidden" }, v.reviewQ.answer);
  revealBtn.addEventListener("click", () => { answer.classList.toggle("hidden"); });
  wrap.appendChild(el("p", {}, v.reviewQ.prompt));
  wrap.appendChild(revealBtn);
  wrap.appendChild(answer);

  return wrap;
}

export function renderVocabulary(container) {
  const state = { tab: "flashcards", category: "all", search: "" };

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🗂️ Vocabulary"),
      el("p", {}, "~150 high-frequency words across greetings, family, food, directions, time, shopping, work, travel, emotions, daily routines, opinions, questions, and common verbs.")
    ])
  );

  const tabs = el("div", { class: "tabs" }, [tabBtn("flashcards", "Flashcards"), tabBtn("explore", "Browse")]);
  container.appendChild(tabs);
  const body = el("div", {});
  container.appendChild(body);

  function tabBtn(id, label) {
    const b = el("button", { class: `tab-btn ${state.tab === id ? "active" : ""}`, onclick: () => setTab(id) }, label);
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
    body.appendChild(state.tab === "flashcards" ? renderFlashcards() : renderExplore());
  }

  function renderFlashcards() {
    const wrap = el("div", {});
    const due = dueItems("word").map((d) => d.id.replace("word_", ""));
    const fresh = newItems(VOCABULARY.map(srsId), "word").map((id) => id.replace("word_", ""));
    let queue = [...new Set([...due, ...fresh])].slice(0, 20);
    const items = queue.map((id) => VOCABULARY.find((v) => v.id === id)).filter(Boolean);

    if (items.length === 0) {
      wrap.appendChild(
        el("div", { class: "card empty-state" }, [
          el("div", { class: "empty-icon" }, "🎉"),
          el("h3", {}, "All caught up!"),
          el("p", {}, "No word reviews due right now. Browse the full list in the \"Browse\" tab.")
        ])
      );
      return wrap;
    }

    let idx = 0;
    const counter = el("p", { class: "text-muted" }, `Card 1 of ${items.length}`);
    const stage = el("div", { class: "flashcard-stage" });
    wrap.appendChild(counter);
    wrap.appendChild(stage);

    function showCard() {
      stage.innerHTML = "";
      const v = items[idx];
      const card = el("div", { class: "flashcard" });
      const inner = el("div", { class: "flashcard-inner" }, [
        el("div", { class: "flashcard-face front" }, [
          el("span", { class: "badge badge-default" }, v.category),
          el("div", { class: "flashcard-word hanzi" }, v.word),
          el("div", { class: "flashcard-hint" }, "Tap to reveal")
        ]),
        el("div", { class: "flashcard-face back" }, [
          el("div", { class: "pinyin-lg" }, v.pinyin),
          el("div", { class: "flashcard-sub", style: "font-weight:700" }, v.meaning)
        ])
      ]);
      card.appendChild(inner);
      card.addEventListener("click", () => card.classList.toggle("flipped"));
      stage.appendChild(card);

      stage.appendChild(el("div", { class: "btn-row" }, [
        el("button", { class: "btn btn-sm", onclick: (e) => { e.stopPropagation(); audioEngine.speak(v.word); } }, "🔊 Normal"),
        el("button", { class: "btn btn-sm", onclick: (e) => { e.stopPropagation(); audioEngine.speakSlow(v.word); } }, "🐢 Slow")
      ]));

      const detail = wordDetail(v);
      detail.classList.add("hidden");
      stage.appendChild(el("button", { class: "btn btn-ghost btn-block", onclick: () => detail.classList.toggle("hidden") }, "Show full word breakdown"));
      stage.appendChild(detail);

      stage.appendChild(
        el("div", { class: "srs-rating-row" }, [
          ratingBtn("Again", QUALITY.AGAIN, "btn-danger"),
          ratingBtn("Hard", QUALITY.HARD, "btn"),
          ratingBtn("Good", QUALITY.GOOD, "btn"),
          ratingBtn("Easy", QUALITY.EASY, "btn-success")
        ])
      );
      counter.textContent = `Card ${idx + 1} of ${items.length}`;
      if (store.state.settings.autoplayAudio) audioEngine.speak(v.word);

      function ratingBtn(label, quality, cls) {
        return el(
          "button",
          {
            class: `btn ${cls}`,
            onclick: () => {
              blurActive();
              gradeItem(srsId(v), "word", quality);
              store.state.progress.vocabExposure[v.id] = (store.state.progress.vocabExposure[v.id] || 0) + 1;
              addXP(quality >= 3 ? 3 : 1, `Word: ${v.word}`);
              store.save();
              idx++;
              if (idx >= items.length) {
                stage.innerHTML = "";
                counter.textContent = "";
                stage.appendChild(
                  el("div", { class: "card empty-state pop-in" }, [
                    el("div", { class: "empty-icon" }, "✅"),
                    el("h3", {}, "Session complete!"),
                    el("button", { class: "btn btn-primary", onclick: renderBody }, "Keep going")
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
    const input = el("input", { type: "search", placeholder: "Search by word, pinyin, or meaning...", style: "flex:1;min-width:200px;padding:.6rem .9rem;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--text)" });
    input.addEventListener("input", () => { state.search = input.value; renderList(); });
    searchRow.appendChild(input);
    wrap.appendChild(searchRow);

    const catPills = el("div", { class: "level-pills" }, [catPill("all", "All categories"), ...categoriesPresent().map((c) => catPill(c, c))]);
    wrap.appendChild(catPills);

    const countLabel = el("p", { class: "text-muted", style: "margin-top:.75rem" }, "");
    wrap.appendChild(countLabel);
    const list = el("div", { class: "grid grid-auto" });
    wrap.appendChild(list);
    const detailWrap = el("div", { style: "margin-top:1rem" });
    wrap.appendChild(detailWrap);

    function catPill(cat, label) {
      const b = el("button", { class: `level-pill ${state.category === cat ? "active" : ""}`, onclick: () => { state.category = cat; refreshPills(); renderList(); } }, label);
      b.dataset.cat = cat;
      return b;
    }
    function refreshPills() {
      catPills.querySelectorAll(".level-pill").forEach((b) => b.classList.toggle("active", b.dataset.cat === state.category));
    }

    function renderList() {
      list.innerHTML = "";
      detailWrap.innerHTML = "";
      const s = state.search.trim().toLowerCase();
      const filtered = VOCABULARY.filter((v) => {
        if (state.category !== "all" && v.category !== state.category) return false;
        if (s && !(v.word.includes(s) || v.pinyin.toLowerCase().includes(s) || v.meaning.toLowerCase().includes(s))) return false;
        return true;
      });
      countLabel.textContent = `${filtered.length} words`;
      filtered.forEach((v) => {
        const mastery = masteryLevel(srsId(v));
        list.appendChild(
          el(
            "div",
            {
              class: "card",
              style: "padding:.9rem;cursor:pointer",
              onclick: () => { detailWrap.innerHTML = ""; detailWrap.appendChild(wordDetail(v)); detailWrap.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
            },
            [
              el("div", { class: "flex justify-between items-center" }, [
                el("span", { class: "badge badge-default" }, v.category),
                el("button", { class: "play-btn", style: "width:30px;height:30px", onclick: (e) => { e.stopPropagation(); audioEngine.speak(v.word); } }, "🔊")
              ]),
              el("div", { class: "hanzi", style: "font-weight:700;font-size:1.2rem;margin-top:.4rem" }, v.word),
              el("div", { class: "text-muted", style: "font-size:.85rem" }, `${v.pinyin} — ${v.meaning}`),
              el("div", { class: "progress-bar", style: "margin-top:.5rem" }, [el("div", { class: "progress-bar-fill", style: `width:${mastery}%` })])
            ]
          )
        );
      });
    }
    renderList();
    return wrap;
  }

  renderBody();
}
