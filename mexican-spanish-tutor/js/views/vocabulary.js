import { store } from "../core/storage.js";
import { el, blurActive } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { gradeItem, masteryLevel, QUALITY, newItems, dueItems } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { VOCABULARY } from "../data/vocabulary.js";
import { tappable, initTapWords } from "../core/tapword.js";
import { englishLine } from "../core/immersion.js";

function srsId(v) {
  return `word_${v.id}`;
}

function categoriesPresent() {
  return [...new Set(VOCABULARY.map((v) => v.category))].sort();
}

function registerBadge(register) {
  return el("span", { class: `badge badge-${register}` }, register);
}

function wordDetail(v) {
  const wrap = el("div", { class: "card" });
  wrap.appendChild(
    el("div", { class: "flex justify-between items-center" }, [
      el("div", { class: "es-text-lg" }, v.word),
      el("button", { class: "play-btn", onclick: () => audioEngine.speak(v.word) }, "🔊")
    ])
  );
  wrap.appendChild(el("div", { class: "ipa-lg" }, `/${v.ipa}/`));
  wrap.appendChild(el("p", {}, [el("strong", {}, englishLine(el, v.meaning, { className: "" })), " ", registerBadge(v.register)]));
  // Only the 70 deep entries carry every section. The other 930 are
  // dictionary-style, so each block appears only if that word actually has
  // one — an empty "Mini-dialogue" heading is worse than no heading.
  if (v.usageNote) wrap.appendChild(el("div", { class: "usage-note" }, v.usageNote));

  if (v.collocations && v.collocations.length) {
    wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Common expressions"));
    wrap.appendChild(el("div", {}, v.collocations.map((c) => el("p", {}, [el("span", { class: "es-text" }, c.w), " — ", englishLine(el, c.en, { className: "text-muted" })]))));
  }

  if (v.sentences && v.sentences.length) {
    wrap.appendChild(el("h4", { style: "margin-top:1rem" }, v.sentences.length > 1 ? "Example sentences" : "Example"));
    wrap.appendChild(
      el("div", {}, v.sentences.map((s) => el("p", {}, [tappable(s.es), el("br"), englishLine(el, s.en, { className: "text-muted" })])))
    );
  }

  if (v.dialogue && v.dialogue.length) {
    wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Mini-dialogue"));
    wrap.appendChild(el("div", {}, v.dialogue.map((l) => el("p", {}, [el("strong", {}, `${l.spk}: `), tappable(l.es), " ", englishLine(el, `(${l.en})`, { className: "text-muted" })]))));
  }

  if (v.speakingPrompt) {
    wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Speaking practice"));
    wrap.appendChild(el("p", { class: "text-muted" }, v.speakingPrompt));
  }

  if (v.reviewQ && v.reviewQ.prompt) {
    wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Review question"));
    const revealBtn = el("button", { class: "btn btn-sm" }, "Reveal answer");
    const answer = el("p", { class: "text-muted hidden" }, v.reviewQ.answer);
    revealBtn.addEventListener("click", () => { answer.classList.toggle("hidden"); });
    wrap.appendChild(el("p", {}, v.reviewQ.prompt));
    wrap.appendChild(revealBtn);
    wrap.appendChild(answer);
  }

  return wrap;
}

export function renderVocabulary(container) {
  const teardownTapWords = initTapWords();
  const state = { tab: "flashcards", category: "all", search: "" };

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🗂️ Vocabulario"),
      el("p", {}, "~100 high-frequency Mexican Spanish words across greetings, questions, family, food, shopping, directions, daily routines, work, friends, travel, and opinions — sentence-first, with Mexican usage notes.")
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
          el("div", { class: "flashcard-word es-text" }, v.word),
          el("div", { class: "flashcard-hint" }, "Tap to reveal")
        ]),
        el("div", { class: "flashcard-face back" }, [
          el("div", { class: "ipa-lg" }, `/${v.ipa}/`),
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
              addXP(quality >= 3 ? 3 : 1, `Palabra: ${v.word}`);
              updateSkillScore("vocabulary", quality >= 3 ? 1.5 : -0.5);
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
    const input = el("input", { type: "search", placeholder: "Search by word or meaning...", style: "flex:1;min-width:200px;padding:.6rem .9rem;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--text)" });
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
        if (s && !(v.word.toLowerCase().includes(s) || v.meaning.toLowerCase().includes(s))) return false;
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
              el("div", { class: "es-text", style: "font-weight:700;font-size:1.15rem;margin-top:.4rem" }, v.word),
              englishLine(el, v.meaning, { className: "text-muted", style: "font-size:.85rem" }),
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
  return teardownTapWords;
}
