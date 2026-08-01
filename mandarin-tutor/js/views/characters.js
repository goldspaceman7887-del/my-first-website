import { store } from "../core/storage.js";
import { el, blurActive } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { gradeItem, masteryLevel, isMastered, QUALITY, newItems, dueItems } from "../core/srs.js";
import { addXP } from "../core/gamification.js";
import { toneNumbers, primaryTone } from "../core/pinyin.js";
import { CHARACTERS } from "../data/characters.js";

function srsId(c) {
  return `character_${c.id}`;
}

function toneExplain(tone) {
  const table = {
    1: "Tone 1 (ā): high and flat, like holding a note while singing.",
    2: "Tone 2 (á): rising, like asking 'huh?' in English.",
    3: "Tone 3 (ǎ): dips low then rises — English speakers often flatten this into tone 1, the most common tone mistake.",
    4: "Tone 4 (à): sharp and falling, like giving a firm command.",
    5: "Neutral tone: short and unstressed, no real pitch contour."
  };
  return table[tone] || table[5];
}

function categoriesPresent() {
  return [...new Set(CHARACTERS.map((c) => c.category))].sort();
}

export function renderCharacters(container) {
  const state = { tab: "flashcards", category: "all", search: "" };

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🈶 Characters"),
      el("p", {}, "Full character breakdowns: pinyin, meaning, words that use it, example sentences, a mini conversation, a memory trick, and pronunciation coaching.")
    ])
  );

  const tabs = el("div", { class: "tabs" }, [tabBtn("flashcards", "Review"), tabBtn("explore", "Browse")]);
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

  function characterCard(c, { compact = false } = {}) {
    const wrap = el("div", { class: "card" });
    wrap.appendChild(
      el("div", { class: "flex justify-between items-center" }, [
        el("div", { class: "hanzi-xl" }, c.char),
        el(
          "button",
          { class: "play-btn", onclick: () => audioEngine.speak(c.char) },
          "🔊"
        )
      ])
    );
    wrap.appendChild(el("div", { class: "pinyin-lg" }, c.pinyin));
    wrap.appendChild(el("div", {}, [el("strong", {}, c.meaning)]));
    wrap.appendChild(el("span", { class: `badge badge-tone${primaryTone(c.pinyin)}` }, `${c.pinyin} · ${toneNumbers(c.pinyin)}`));
    wrap.appendChild(el("p", { class: "text-faint", style: "margin-top:.4rem" }, toneExplain(primaryTone(c.pinyin))));

    if (!compact) {
      wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Words using it"));
      wrap.appendChild(
        el(
          "div",
          {},
          c.words.map((w) => el("p", {}, [el("span", { class: "hanzi" }, w.w), el("span", { class: "text-muted" }, ` ${w.py} — ${w.en}`)]))
        )
      );
      wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Example sentences"));
      wrap.appendChild(
        el(
          "div",
          {},
          c.sentences.map((s) =>
            el("p", {}, [
              el("span", { class: "hanzi" }, s.zh),
              el("br"),
              el("span", { class: "pinyin" }, s.py),
              el("br"),
              el("span", { class: "text-muted" }, s.en)
            ])
          )
        )
      );
      wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Mini conversation"));
      wrap.appendChild(
        el(
          "div",
          {},
          c.convo.map((l) => el("p", {}, [el("strong", {}, `${l.spk}: `), el("span", { class: "hanzi" }, l.zh), el("span", { class: "text-muted" }, ` (${l.py})`)]))
        )
      );
      wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Memory trick"));
      wrap.appendChild(el("p", { class: "text-muted" }, c.trick));
    }
    return wrap;
  }

  function renderFlashcards() {
    const wrap = el("div", {});
    const due = dueItems("character").map((d) => d.id.replace("character_", ""));
    const fresh = newItems(CHARACTERS.map(srsId), "character").map((id) => id.replace("character_", ""));
    let queue = [...new Set([...due, ...fresh])].slice(0, 20);
    const items = queue.map((id) => CHARACTERS.find((c) => c.id === id)).filter(Boolean);

    if (items.length === 0) {
      wrap.appendChild(
        el("div", { class: "card empty-state" }, [
          el("div", { class: "empty-icon" }, "🎉"),
          el("h3", {}, "All caught up!"),
          el("p", {}, "No character reviews due right now. Browse the full list in the \"Browse\" tab.")
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
      const c = items[idx];
      const card = el("div", { class: "flashcard" });
      const inner = el("div", { class: "flashcard-inner" }, [
        el("div", { class: "flashcard-face front" }, [
          el("div", { class: "flashcard-word hanzi" }, c.char),
          el("div", { class: "flashcard-hint" }, "Tap to reveal pinyin + meaning")
        ]),
        el("div", { class: "flashcard-face back" }, [
          el("div", { class: "pinyin-lg" }, `${c.pinyin} · ${toneNumbers(c.pinyin)}`),
          el("div", { class: "flashcard-sub", style: "font-weight:700" }, c.meaning),
          el("div", { class: "flashcard-sub text-faint" }, c.trick)
        ])
      ]);
      card.appendChild(inner);
      card.addEventListener("click", () => card.classList.toggle("flipped"));
      stage.appendChild(card);

      const playRow = el("div", { class: "btn-row" }, [
        el("button", { class: "btn btn-sm", onclick: (e) => { e.stopPropagation(); audioEngine.speak(c.char); } }, "🔊 Normal"),
        el("button", { class: "btn btn-sm", onclick: (e) => { e.stopPropagation(); audioEngine.speakSlow(c.char); } }, "🐢 Slow")
      ]);
      stage.appendChild(playRow);

      const detail = characterCard(c, { compact: false });
      detail.classList.add("hidden");
      const detailToggle = el("button", { class: "btn btn-ghost btn-block", onclick: () => detail.classList.toggle("hidden") }, "Show full breakdown (words, sentences, conversation)");
      stage.appendChild(detailToggle);
      stage.appendChild(detail);

      const ratingRow = el("div", { class: "srs-rating-row" }, [
        ratingBtn("Again", QUALITY.AGAIN, "btn-danger"),
        ratingBtn("Hard", QUALITY.HARD, "btn"),
        ratingBtn("Good", QUALITY.GOOD, "btn"),
        ratingBtn("Easy", QUALITY.EASY, "btn-success")
      ]);
      stage.appendChild(ratingRow);
      counter.textContent = `Card ${idx + 1} of ${items.length}`;
      if (store.state.settings.autoplayAudio) audioEngine.speak(c.char);

      function ratingBtn(label, quality, cls) {
        return el(
          "button",
          {
            class: `btn ${cls}`,
            onclick: () => {
              blurActive();
              gradeItem(srsId(c), "character", quality);
              store.state.progress.charExposure[c.id] = (store.state.progress.charExposure[c.id] || 0) + 1;
              addXP(quality >= 3 ? 3 : 1, `Character: ${c.char}`);
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
    const input = el("input", { type: "search", placeholder: "Search by character, pinyin, or meaning...", style: "flex:1;min-width:200px;padding:.6rem .9rem;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--text)" });
    input.addEventListener("input", () => { state.search = input.value; renderList(); });
    searchRow.appendChild(input);
    wrap.appendChild(searchRow);

    const catPills = el("div", { class: "level-pills" }, [
      catPill("all", "All categories"),
      ...categoriesPresent().map((c) => catPill(c, c))
    ]);
    wrap.appendChild(catPills);

    const countLabel = el("p", { class: "text-muted", style: "margin-top:.75rem" }, "");
    wrap.appendChild(countLabel);
    const grid = el("div", { class: "char-grid" });
    wrap.appendChild(grid);
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
      grid.innerHTML = "";
      detailWrap.innerHTML = "";
      const s = state.search.trim().toLowerCase();
      const filtered = CHARACTERS.filter((c) => {
        if (state.category !== "all" && c.category !== state.category) return false;
        if (s && !(c.char.includes(s) || c.pinyin.toLowerCase().includes(s) || c.meaning.toLowerCase().includes(s))) return false;
        return true;
      });
      countLabel.textContent = `${filtered.length} characters`;
      filtered.forEach((c) => {
        const known = isMastered(srsId(c), 70) || (store.state.profile.selfReportedKnownChars || []).includes(c.char);
        const learning = !known && store.state.srs[srsId(c)];
        const status = known ? "status-known" : learning ? "status-learning" : "status-new";
        const tile = el("div", { class: `char-tile ${status}`, onclick: () => { detailWrap.innerHTML = ""; detailWrap.appendChild(characterCard(c)); detailWrap.scrollIntoView({ behavior: "smooth", block: "nearest" }); } }, [
          el("div", { class: "hz" }, c.char),
          el("div", { class: "py" }, c.pinyin)
        ]);
        grid.appendChild(tile);
      });
    }
    renderList();
    return wrap;
  }

  renderBody();
}
