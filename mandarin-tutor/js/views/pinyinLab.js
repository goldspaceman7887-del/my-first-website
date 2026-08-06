// Standalone Pinyin section: the 5 tones, initials, and finals, each with
// real audio (via a genuine example character, not a raw romanized letter),
// plus a listening quiz. Separate from Learn/Review on purpose -- this is
// about training the ear on the sound system itself, not vocabulary recall.

import { store } from "../core/storage.js";
import { el, blurActive, toast } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP } from "../core/gamification.js";
import { primaryTone, toneNumbers } from "../core/pinyin.js";
import { CHARACTERS } from "../data/characters.js";
import { TONES, INITIALS, FINALS } from "../data/pinyinChart.js";

function stripDiacritics(s) {
  return String(s || "").toLowerCase()
    .replace(/[āáǎà]/g, "a").replace(/[ēéěè]/g, "e").replace(/[īíǐì]/g, "i")
    .replace(/[ōóǒò]/g, "o").replace(/[ūúǔù]/g, "u").replace(/[ǖǘǚǜ]/g, "u")
    .replace(/[^a-z0-9]/g, "");
}
function baseOnly(s) {
  return stripDiacritics(s).replace(/[0-9]/g, "");
}

function toneBadge(t) {
  return el("span", { class: `badge badge-tone${t}`, style: "margin-right:.5rem" }, t === 5 ? "·" : String(t));
}

export function renderPinyin(container) {
  const view = { tab: "tones" };

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🔤 Pinyin"),
      el("p", {}, "The building blocks of Mandarin pronunciation — tones, initials, and finals — with real audio for every sound, plus a listening quiz.")
    ])
  );

  const tabs = el("div", { class: "tabs" }, [
    tabBtn("tones", "Tones"),
    tabBtn("initials", "Initials"),
    tabBtn("finals", "Finals"),
    tabBtn("quiz", "Listen & Guess")
  ]);
  container.appendChild(tabs);
  const body = el("div", {});
  container.appendChild(body);
  renderBody();

  function tabBtn(id, label) {
    const b = el("button", { class: `tab-btn ${view.tab === id ? "active" : ""}`, onclick: () => setTab(id) }, label);
    b.dataset.tabId = id;
    return b;
  }
  function setTab(id) {
    view.tab = id;
    tabs.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tabId === id));
    renderBody();
  }
  function renderBody() {
    body.innerHTML = "";
    if (view.tab === "tones") body.appendChild(buildTones());
    else if (view.tab === "initials") body.appendChild(buildSoundGrid(INITIALS, "Initial"));
    else if (view.tab === "finals") body.appendChild(buildSoundGrid(FINALS, "Final"));
    else body.appendChild(buildListenGuess());
  }
}

function buildTones() {
  const wrap = el("div", {});
  wrap.appendChild(el("p", { class: "text-muted" }, "Mandarin is a tonal language — the same syllable means something completely different depending on its pitch contour. Listen to each tone below, then compare all five on the same syllable (妈 mā)."));

  TONES.forEach((t) => {
    wrap.appendChild(
      el("div", { class: "card", style: "margin-top:.75rem" }, [
        el("div", { class: "flex justify-between items-center" }, [
          el("div", { class: "flex items-center" }, [
            toneBadge(t.tone),
            el("strong", {}, t.label)
          ]),
          el("button", { class: "play-btn", onclick: () => audioEngine.speak(t.example.char) }, "🔊")
        ]),
        el("p", { class: "text-muted", style: "margin-top:.4rem" }, t.desc),
        el("div", { class: "flex items-center gap-2", style: "margin-top:.5rem" }, [
          el("span", { class: "hanzi", style: "font-size:1.3rem;font-weight:700" }, t.example.char),
          el("span", { class: "pinyin" }, t.example.pinyin),
          el("span", { class: "text-muted" }, `— ${t.example.meaning}`)
        ])
      ])
    );
  });

  const compareCard = el("div", { class: "card", style: "margin-top:1rem" }, [
    el("div", { class: "card-title" }, "Compare all five: 妈 麻 马 骂 吗"),
    el("p", { class: "text-muted" }, "The classic minimal-pair drill — same syllable, five different meanings.")
  ]);
  const row = el("div", { class: "btn-row", style: "margin-top:.6rem" }, TONES.map((t) =>
    el("button", { class: "btn", onclick: () => audioEngine.speak(t.example.char) }, `${t.example.char} ${t.example.pinyin}`)
  ));
  compareCard.appendChild(row);
  compareCard.appendChild(
    el("button", { class: "btn btn-primary btn-block", style: "margin-top:.6rem", onclick: async () => {
      for (const t of TONES) {
        await audioEngine.speak(t.example.char);
        await new Promise((r) => setTimeout(r, 350));
      }
    } }, "▶ Play all five in order")
  );
  wrap.appendChild(compareCard);

  return wrap;
}

function buildSoundGrid(list, kind) {
  const wrap = el("div", {});
  wrap.appendChild(el("p", { class: "text-muted" }, `Tap any ${kind.toLowerCase()} to hear it pronounced in a real word.`));
  const detailWrap = el("div", { style: "margin-top:1rem" });
  const grid = el("div", { class: "char-grid" }, list.map((item) =>
    el("div", { class: "char-tile", onclick: () => {
      audioEngine.speak(item.example.char);
      detailWrap.innerHTML = "";
      detailWrap.appendChild(
        el("div", { class: "card" }, [
          el("div", { class: "flex justify-between items-center" }, [
            el("div", {}, [
              el("span", { class: "badge badge-default" }, `${kind}: ${item.id}`),
              el("div", { class: "hanzi-lg", style: "margin-top:.4rem" }, item.example.char)
            ]),
            el("button", { class: "play-btn", onclick: () => audioEngine.speak(item.example.char) }, "🔊")
          ]),
          el("div", { class: "pinyin-lg" }, item.example.pinyin),
          el("p", {}, item.example.meaning)
        ])
      );
    } }, [
      el("div", { class: "hz" }, item.id),
      el("div", { class: "py" }, item.example.char)
    ])
  ));
  wrap.appendChild(grid);
  wrap.appendChild(detailWrap);
  return wrap;
}

function buildListenGuess() {
  const wrap = el("div", {});
  const state = { mode: "tone", current: null, score: 0, total: 0 };

  const modeRow = el("div", { class: "level-pills" }, [modePill("tone", "🎯 Guess the tone"), modePill("type", "✍️ Type the pinyin")]);
  wrap.appendChild(modeRow);
  const scoreLabel = el("p", { class: "text-faint", style: "margin-top:.5rem" }, "");
  wrap.appendChild(scoreLabel);
  const quizWrap = el("div", { class: "card exercise-card", style: "margin-top:.5rem" });
  wrap.appendChild(quizWrap);

  function modePill(id, label) {
    const b = el("button", { class: `level-pill ${state.mode === id ? "active" : ""}`, onclick: () => {
      state.mode = id;
      modeRow.querySelectorAll(".level-pill").forEach((x) => x.classList.toggle("active", x.dataset.mode === id));
      nextQuestion();
    } }, label);
    b.dataset.mode = id;
    return b;
  }

  function updateScore() {
    scoreLabel.textContent = state.total ? `${state.score} / ${state.total} correct` : "Listen, then answer.";
  }

  function nextQuestion() {
    state.current = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    renderQuiz();
  }

  function renderQuiz() {
    quizWrap.innerHTML = "";
    const c = state.current;
    quizWrap.appendChild(
      el("div", { class: "btn-row" }, [
        el("button", { class: "btn btn-primary", onclick: () => audioEngine.speak(c.char) }, "🔊 Play"),
        el("button", { class: "btn btn-sm", onclick: () => audioEngine.speakSlow(c.char) }, "🐢 Slow")
      ])
    );

    if (state.mode === "tone") {
      quizWrap.appendChild(el("p", { class: "text-faint", style: "margin-top:.6rem" }, "Which tone did you hear?"));
      const options = el("div", { class: "option-list" }, [1, 2, 3, 4, 5].map((t) =>
        el("button", { class: "option-btn", onclick: (e) => {
          const btn = e.currentTarget;
          const correct = primaryTone(c.pinyin);
          const isCorrect = t === correct;
          options.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
          btn.classList.add(isCorrect ? "correct" : "incorrect");
          if (!isCorrect) options.children[correct - 1].classList.add("correct");
          finishQuestion(isCorrect, `${c.char} (${c.pinyin}) — ${c.meaning}`);
        } }, [toneBadge(t), t === 5 ? "Neutral tone" : `Tone ${t}`])
      ));
      quizWrap.appendChild(options);
    } else {
      quizWrap.appendChild(el("p", { class: "text-faint", style: "margin-top:.6rem" }, "Type the pinyin you heard (tone marks or numbers both work, e.g. nǐ or ni3):"));
      const input = el("input", { type: "text", placeholder: "nǐ or ni3..." });
      input.style.cssText = "width:100%;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1rem;";
      const submit = el("button", { class: "btn btn-primary btn-sm", style: "margin-top:.5rem" }, "Check");
      quizWrap.appendChild(input);
      quizWrap.appendChild(submit);
      const check = () => {
        const text = input.value.trim();
        if (!text) { toast("Type your answer first.", { type: "error" }); return; }
        input.disabled = true;
        submit.disabled = true;
        const exact = stripDiacritics(text) === stripDiacritics(toneNumbers(c.pinyin)) || stripDiacritics(text) === stripDiacritics(c.pinyin);
        const closeBase = !exact && baseOnly(text) === baseOnly(c.pinyin);
        finishQuestion(exact, `${c.char} (${c.pinyin}) — ${c.meaning}`, closeBase ? "Right sound, but check the tone." : null);
      };
      submit.addEventListener("click", check);
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
      input.focus();
    }

    if (store.state.settings.autoplayAudio) audioEngine.speak(c.char);
  }

  function finishQuestion(isCorrect, detailText, note) {
    blurActive();
    state.total++;
    if (isCorrect) { state.score++; addXP(1, `Pinyin: ${state.current.char}`); }
    updateScore();
    quizWrap.appendChild(
      el("div", { class: `feedback-block ${isCorrect ? "correct" : "incorrect"}`, style: "margin-top:.6rem" }, [
        el("p", {}, isCorrect ? "Nice ear!" : `Not quite — that was ${detailText}.`),
        note ? el("p", { style: "margin-top:.2rem" }, note) : null
      ].filter(Boolean))
    );
    quizWrap.appendChild(el("button", { class: "btn btn-primary btn-block", style: "margin-top:.6rem", onclick: nextQuestion }, "Next →"));
  }

  updateScore();
  nextQuestion();
  return wrap;
}
