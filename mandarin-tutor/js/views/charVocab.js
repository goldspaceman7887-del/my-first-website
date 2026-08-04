// Combined Characters + Vocabulary practice -- a single interleaved deck
// mixing due/new characters and due/new words together, instead of two
// separate decks. Uses the exact same SRS ids as the Characters and
// Vocabulary views, so grading here updates the same underlying progress.

import { store } from "../core/storage.js";
import { el, blurActive } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { gradeItem, QUALITY, newItems, dueItems } from "../core/srs.js";
import { addXP } from "../core/gamification.js";
import { toneNumbers, primaryTone } from "../core/pinyin.js";
import { CHARACTERS } from "../data/characters.js";
import { VOCABULARY } from "../data/vocabulary.js";

function srsIdFor(kind, id) {
  return kind === "character" ? `character_${id}` : `word_${id}`;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQueue() {
  const charDue = dueItems("character").map((d) => d.id.replace("character_", ""));
  const charFresh = newItems(CHARACTERS.map((c) => srsIdFor("character", c.id)), "character").map((id) => id.replace("character_", ""));
  const charIds = [...new Set([...charDue, ...charFresh])].slice(0, 12);
  const charItems = charIds.map((id) => CHARACTERS.find((c) => c.id === id)).filter(Boolean).map((data) => ({ kind: "character", data }));

  const wordDue = dueItems("word").map((d) => d.id.replace("word_", ""));
  const wordFresh = newItems(VOCABULARY.map((v) => srsIdFor("word", v.id)), "word").map((id) => id.replace("word_", ""));
  const wordIds = [...new Set([...wordDue, ...wordFresh])].slice(0, 12);
  const wordItems = wordIds.map((id) => VOCABULARY.find((v) => v.id === id)).filter(Boolean).map((data) => ({ kind: "word", data }));

  return shuffle([...charItems, ...wordItems]).slice(0, 20);
}

export function renderCharVocab(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🔀 Characters + Vocabulary"),
      el("p", {}, "One mixed deck of your due and new characters and vocabulary words, interleaved together instead of studied as two separate decks."),
      el("p", { class: "text-faint" }, "Grading a card here updates the same spaced-repetition progress as the Characters and Vocabulary pages -- this is just a blended way to go through both at once.")
    ])
  );

  const body = el("div", {});
  container.appendChild(body);
  renderDeck();

  function renderDeck() {
    body.innerHTML = "";
    const items = buildQueue();

    if (items.length === 0) {
      body.appendChild(
        el("div", { class: "card empty-state" }, [
          el("div", { class: "empty-icon" }, "🎉"),
          el("h3", {}, "All caught up!"),
          el("p", {}, "No character or vocabulary reviews due right now. Learn something new in Characters or Vocabulary, then come back here to mix them together.")
        ])
      );
      return;
    }

    let idx = 0;
    const counter = el("p", { class: "text-muted" }, `Card 1 of ${items.length}`);
    const stage = el("div", { class: "flashcard-stage" });
    body.appendChild(counter);
    body.appendChild(stage);

    function showCard() {
      stage.innerHTML = "";
      const { kind, data } = items[idx];
      const text = kind === "character" ? data.char : data.word;
      const pinyinDisplay = kind === "character" ? `${data.pinyin} · ${toneNumbers(data.pinyin)}` : data.pinyin;

      const card = el("div", { class: "flashcard" });
      const inner = el("div", { class: "flashcard-inner" }, [
        el("div", { class: "flashcard-face front" }, [
          el("span", { class: "badge badge-default" }, kind === "character" ? "🈶 Character" : "🗂️ Vocabulary"),
          el("div", { class: "flashcard-word hanzi" }, text),
          el("div", { class: "flashcard-hint" }, "Tap to reveal pinyin + meaning")
        ]),
        el("div", { class: "flashcard-face back" }, [
          el("div", { class: "pinyin-lg" }, pinyinDisplay),
          el("div", { class: "flashcard-sub", style: "font-weight:700" }, data.meaning),
          kind === "character" && data.trick ? el("div", { class: "flashcard-sub text-faint" }, data.trick) : null
        ].filter(Boolean))
      ]);
      card.appendChild(inner);
      card.addEventListener("click", () => card.classList.toggle("flipped"));
      stage.appendChild(card);

      stage.appendChild(el("div", { class: "btn-row" }, [
        el("button", { class: "btn btn-sm", onclick: (e) => { e.stopPropagation(); audioEngine.speak(text); } }, "🔊 Normal"),
        el("button", { class: "btn btn-sm", onclick: (e) => { e.stopPropagation(); audioEngine.speakSlow(text); } }, "🐢 Slow")
      ]));

      stage.appendChild(
        el("div", { class: "srs-rating-row" }, [
          ratingBtn("Again", QUALITY.AGAIN, "btn-danger"),
          ratingBtn("Hard", QUALITY.HARD, "btn"),
          ratingBtn("Good", QUALITY.GOOD, "btn"),
          ratingBtn("Easy", QUALITY.EASY, "btn-success")
        ])
      );
      counter.textContent = `Card ${idx + 1} of ${items.length}`;
      if (store.state.settings.autoplayAudio) audioEngine.speak(text);

      function ratingBtn(label, quality, cls) {
        return el(
          "button",
          {
            class: `btn ${cls}`,
            onclick: () => {
              blurActive();
              gradeItem(srsIdFor(kind, data.id), kind, quality);
              if (kind === "character") store.state.progress.charExposure[data.id] = (store.state.progress.charExposure[data.id] || 0) + 1;
              else store.state.progress.vocabExposure[data.id] = (store.state.progress.vocabExposure[data.id] || 0) + 1;
              addXP(quality >= 3 ? 3 : 1, `${kind === "character" ? "Character" : "Word"}: ${text}`);
              store.save();
              idx++;
              if (idx >= items.length) {
                stage.innerHTML = "";
                counter.textContent = "";
                stage.appendChild(
                  el("div", { class: "card empty-state pop-in" }, [
                    el("div", { class: "empty-icon" }, "✅"),
                    el("h3", {}, "Session complete!"),
                    el("button", { class: "btn btn-primary", onclick: renderDeck }, "Keep going")
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
  }
}
