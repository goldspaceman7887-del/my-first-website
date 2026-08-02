// SENTENCE MINING MODE — paste any Chinese text (dialogue, subtitles, an
// article) and the app extracts sentences, matches known vocabulary and
// characters against the curriculum, and lets you push flashcards
// straight into today's review queue.

import { store, todayISO } from "../core/storage.js";
import { el, toast } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday } from "../core/gamification.js";
import { findCharacter } from "../core/lookup.js";
import { VOCABULARY } from "../data/vocabulary.js";

function extractSentences(text) {
  return text
    .split(/(?<=[。！？!?])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function extractHanzi(text) {
  const matches = text.match(/[一-鿿]/g) || [];
  return [...new Set(matches)];
}

function seedCharacterForReview(charId) {
  const id = `character_${charId}`;
  if (store.state.srs[id]) return false;
  const now = Date.now();
  store.state.srs[id] = { id, type: "character", repetition: 0, easeFactor: 2.5, interval: 0, stepIndex: 0, nextReview: now, lastReview: null, correct: 0, incorrect: 0, history: [] };
  return true;
}
function seedWordForReview(wordId) {
  const id = `word_${wordId}`;
  if (store.state.srs[id]) return false;
  const now = Date.now();
  store.state.srs[id] = { id, type: "word", repetition: 0, easeFactor: 2.5, interval: 0, stepIndex: 0, nextReview: now, lastReview: null, correct: 0, incorrect: 0, history: [] };
  return true;
}

export function renderMining(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "⛏️ Sentence Mining"),
      el("p", {}, "Paste Chinese text — dialogue, subtitles, an article — and pull out the highest-value sentences, vocabulary, and characters to study.")
    ])
  );

  const ta = el("textarea", { placeholder: "在这里粘贴中文文本... (paste Chinese text here)" });
  container.appendChild(ta);
  container.appendChild(el("button", { class: "btn btn-primary", onclick: analyze }, "Analyze"));

  const results = el("div", { style: "margin-top:1rem" });
  container.appendChild(results);

  function analyze() {
    const text = ta.value.trim();
    if (!text) { toast("Paste some Chinese text first.", { type: "error" }); return; }
    const sentences = extractSentences(text);
    const hanzi = extractHanzi(text);
    const knownChars = hanzi.map((ch) => findCharacter(ch)).filter(Boolean);
    const unknownChars = hanzi.filter((ch) => !findCharacter(ch));
    const matchedVocab = VOCABULARY.filter((v) => text.includes(v.word));

    results.innerHTML = "";

    results.appendChild(el("h3", {}, `Sentences found (${sentences.length})`));
    const sentCard = el("div", { class: "card" });
    sentences.slice(0, 25).forEach((s) => {
      sentCard.appendChild(
        el("div", { class: "flex justify-between items-center", style: "padding:.3rem 0;border-bottom:1px solid var(--border)" }, [
          el("span", { class: "hanzi" }, s),
          el("button", { class: "play-btn", style: "width:32px;height:32px", onclick: () => audioEngine.speak(s) }, "🔊")
        ])
      );
    });
    results.appendChild(sentCard);

    results.appendChild(el("h3", { style: "margin-top:1.25rem" }, `Matched vocabulary from the curriculum (${matchedVocab.length})`));
    if (matchedVocab.length) {
      const vocabGrid = el("div", { class: "grid grid-auto" });
      matchedVocab.forEach((v) => {
        vocabGrid.appendChild(
          el("div", { class: "card", style: "padding:.7rem" }, [
            el("div", { class: "hanzi", style: "font-weight:700" }, v.word),
            el("div", { class: "text-muted", style: "font-size:.85rem" }, `${v.pinyin} — ${v.meaning}`),
            el("div", { class: "text-faint", style: "font-size:.78rem" }, `Usage: ${v.category}`)
          ])
        );
      });
      results.appendChild(vocabGrid);
      results.appendChild(
        el(
          "button",
          {
            class: "btn btn-sm",
            style: "margin-top:.5rem",
            onclick: () => {
              let added = 0;
              matchedVocab.forEach((v) => { if (seedWordForReview(v.id)) added++; });
              store.save();
              toast(`Added ${added} word(s) to your review queue.`, { icon: "🗂️" });
            }
          },
          "Add all matched vocabulary to review"
        )
      );
    } else {
      results.appendChild(el("p", { class: "text-muted" }, "No curriculum vocabulary matched directly — try Characters below instead."));
    }

    results.appendChild(el("h3", { style: "margin-top:1.25rem" }, `Characters in the curriculum (${knownChars.length})`));
    const charGrid = el("div", { class: "char-grid" });
    knownChars.forEach((c) => {
      charGrid.appendChild(el("div", { class: "char-tile" }, [el("div", { class: "hz" }, c.char), el("div", { class: "py" }, c.pinyin)]));
    });
    results.appendChild(charGrid);
    if (knownChars.length) {
      results.appendChild(
        el(
          "button",
          {
            class: "btn btn-sm",
            style: "margin-top:.5rem",
            onclick: () => {
              let added = 0;
              knownChars.forEach((c) => { if (seedCharacterForReview(c.id)) added++; });
              store.save();
              toast(`Added ${added} character(s) to your review queue.`, { icon: "🈶" });
            }
          },
          "Add all these characters to review"
        )
      );
    }

    if (unknownChars.length) {
      results.appendChild(el("h3", { style: "margin-top:1.25rem" }, `New characters not yet in the curriculum (${unknownChars.length})`));
      results.appendChild(el("p", { class: "hanzi text-muted" }, unknownChars.join(" ")));
      results.appendChild(el("p", { class: "text-faint" }, "These are outside the current 110-character set — worth looking up individually, but not auto-added."));
    }

    registerStudyToday();
    store.state.progress.sentenceMiningSessions.push({ date: todayISO(), sourceLength: text.length, extractedCount: sentences.length });
    addXP(5, "Sentence mining session");
    store.save();
  }
}
