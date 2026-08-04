// Unified Characters + Vocabulary section, Duolingo-style: pick how many new
// items to learn, step through them, then immediately practice picking each
// one out of a real example sentence. Replaces the old separate Characters,
// Vocabulary, and Char+Vocab sections with a single "Learn" flow plus one
// merged Browse tab. Grading during the sentence-context practice uses the
// same SRS ids (character_*, word_*) as before, so it feeds the same
// spaced-repetition queue the Review section already reviews.

import { store } from "../core/storage.js";
import { el, blurActive, toast } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { gradeItem, masteryLevel, QUALITY, newItems } from "../core/srs.js";
import { addXP } from "../core/gamification.js";
import { toneNumbers, primaryTone } from "../core/pinyin.js";
import { breakdownWord } from "../core/lookup.js";
import { CHARACTERS } from "../data/characters.js";
import { VOCABULARY } from "../data/vocabulary.js";

function srsIdFor(kind, id) {
  return kind === "character" ? `character_${id}` : `word_${id}`;
}
function textFor(kind, data) {
  return kind === "character" ? data.char : data.word;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeLoose(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[āáǎà]/g, "a").replace(/[ēéěè]/g, "e").replace(/[īíǐì]/g, "i")
    .replace(/[ōóǒò]/g, "o").replace(/[ūúǔù]/g, "u").replace(/[ǖǘǚǜ]/g, "u")
    .replace(/[^a-z0-9一-鿿]/g, "");
}
function wordMatch(input, targetZh, targetPy) {
  const norm = normalizeLoose(input);
  if (!norm) return false;
  return norm === normalizeLoose(targetZh) || norm === normalizeLoose(targetPy);
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

function sentencePracticeBlock(v) {
  const wrap = el("div", { style: "margin-top:1rem" });
  wrap.appendChild(el("h4", {}, "✍️ Practice: write your own sentence"));
  wrap.appendChild(el("p", { class: "text-muted" }, `Write a Chinese sentence that uses ${v.word} (${v.pinyin}).`));
  const ta = el("textarea", { placeholder: `在这里写一个用 "${v.word}" 的句子... (write a sentence using "${v.word}")` });
  ta.style.cssText = "width:100%;min-height:70px;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1rem;font-family:inherit;";
  const submit = el("button", { class: "btn btn-primary btn-sm", style: "margin-top:.5rem" }, "Check my sentence");
  const feedback = el("div", { style: "margin-top:.6rem" });
  wrap.appendChild(ta);
  wrap.appendChild(submit);
  wrap.appendChild(feedback);

  let done = false;
  submit.addEventListener("click", () => {
    const text = ta.value.trim();
    if (!text) { toast("Write a sentence first.", { type: "error" }); return; }
    feedback.innerHTML = "";
    const usesWord = text.includes(v.word);
    const longEnough = text.length >= v.word.length + 2;
    const success = usesWord && longEnough;
    feedback.appendChild(
      el("div", { class: `feedback-block ${success ? "correct" : "incorrect"}` }, [
        el("p", {}, success
          ? `Nice work — that's a real sentence using ${v.word}!`
          : !usesWord
            ? `Try again — your sentence should include ${v.word}.`
            : `Try to write a full sentence, not just the word by itself.`)
      ])
    );
    if (success && !done) {
      done = true;
      addXP(3, `Sentence practice: ${v.word}`);
      toast(`+3 XP — great sentence with ${v.word}!`, { type: "xp", icon: "⚡" });
      submit.disabled = true;
      ta.disabled = true;
    }
  });

  return wrap;
}

function characterDetail(c) {
  const wrap = el("div", { class: "card" });
  wrap.appendChild(
    el("div", { class: "flex justify-between items-center" }, [
      el("div", { class: "hanzi-xl" }, c.char),
      el("button", { class: "play-btn", onclick: () => audioEngine.speak(c.char) }, "🔊")
    ])
  );
  wrap.appendChild(el("div", { class: "pinyin-lg" }, c.pinyin));
  wrap.appendChild(el("div", {}, [el("strong", {}, c.meaning)]));
  wrap.appendChild(el("span", { class: `badge badge-tone${primaryTone(c.pinyin)}` }, `${c.pinyin} · ${toneNumbers(c.pinyin)}`));
  wrap.appendChild(el("p", { class: "text-faint", style: "margin-top:.4rem" }, toneExplain(primaryTone(c.pinyin))));

  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Words using it"));
  wrap.appendChild(
    el("div", {}, c.words.map((w) => el("p", {}, [el("span", { class: "hanzi" }, w.w), el("span", { class: "text-muted" }, ` ${w.py} — ${w.en}`)])))
  );
  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Example sentences"));
  wrap.appendChild(
    el("div", {}, c.sentences.map((s) =>
      el("p", {}, [el("span", { class: "hanzi" }, s.zh), el("br"), el("span", { class: "pinyin" }, s.py), el("br"), el("span", { class: "text-muted" }, s.en)])
    ))
  );
  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Mini conversation"));
  wrap.appendChild(
    el("div", {}, c.convo.map((l) => el("p", {}, [el("strong", {}, `${l.spk}: `), el("span", { class: "hanzi" }, l.zh), el("span", { class: "text-muted" }, ` (${l.py})`)])))
  );
  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Memory trick"));
  wrap.appendChild(el("p", { class: "text-muted" }, c.trick));
  return wrap;
}

function wordDetailCard(v) {
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
    el("div", { class: "flex gap-2 flex-wrap" }, breakdownWord(v.word).map((b) =>
      el("div", { class: "badge badge-default" }, b.entry ? `${b.char} ${b.entry.pinyin} — ${b.entry.meaning}` : b.char)
    ))
  );

  wrap.appendChild(sentencePracticeBlock(v));

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

function detailFor(kind, data) {
  return kind === "character" ? characterDetail(data) : wordDetailCard(data);
}

export function renderLearn(container) {
  const view = { tab: "learn" };

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "📚 Learn"),
      el("p", {}, "Characters and vocabulary together. Pick how many new ones you want to learn, go through them, then see them used in real sentences.")
    ])
  );

  const tabs = el("div", { class: "tabs" }, [tabBtn("learn", "Learn new"), tabBtn("browse", "Browse")]);
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
    body.appendChild(view.tab === "learn" ? buildLearnFlow() : buildBrowse());
  }
}

function buildLearnFlow() {
  const wrap = el("div", {});
  const flow = { stage: "setup", batchSize: 10, batch: [], learnIdx: 0, practiceIdx: 0, correctCount: 0 };
  renderStage();
  return wrap;

  function renderStage() {
    wrap.innerHTML = "";
    if (flow.stage === "practice") {
      while (flow.practiceIdx < flow.batch.length && !(flow.batch[flow.practiceIdx].data.sentences || []).length) {
        flow.practiceIdx++;
      }
      if (flow.practiceIdx >= flow.batch.length) flow.stage = "done";
    }
    if (flow.stage === "setup") wrap.appendChild(renderSetup());
    else if (flow.stage === "learning") wrap.appendChild(renderLearning());
    else if (flow.stage === "practice") wrap.appendChild(renderPractice());
    else wrap.appendChild(renderDone());
  }

  function newCounts() {
    const charFresh = newItems(CHARACTERS.map((c) => srsIdFor("character", c.id)), "character").length;
    const wordFresh = newItems(VOCABULARY.map((v) => srsIdFor("word", v.id)), "word").length;
    return { charFresh, wordFresh, total: charFresh + wordFresh };
  }

  function buildBatch(size) {
    const charFresh = shuffle(newItems(CHARACTERS.map((c) => srsIdFor("character", c.id)), "character").map((id) => id.replace("character_", "")));
    const wordFresh = shuffle(newItems(VOCABULARY.map((v) => srsIdFor("word", v.id)), "word").map((id) => id.replace("word_", "")));
    const half = Math.ceil(size / 2);
    let items = shuffle([
      ...charFresh.slice(0, half).map((id) => CHARACTERS.find((c) => c.id === id)).filter(Boolean).map((data) => ({ kind: "character", data })),
      ...wordFresh.slice(0, half).map((id) => VOCABULARY.find((v) => v.id === id)).filter(Boolean).map((data) => ({ kind: "word", data }))
    ]).slice(0, size);
    if (items.length < size) {
      const used = new Set(items.map((i) => i.data.id));
      const restChar = charFresh.filter((id) => !used.has(id)).map((id) => CHARACTERS.find((c) => c.id === id)).filter(Boolean).map((data) => ({ kind: "character", data }));
      const restWord = wordFresh.filter((id) => !used.has(id)).map((id) => VOCABULARY.find((v) => v.id === id)).filter(Boolean).map((data) => ({ kind: "word", data }));
      items = items.concat(shuffle([...restChar, ...restWord])).slice(0, size);
    }
    return items;
  }

  function renderSetup() {
    const counts = newCounts();
    const setupWrap = el("div", {});
    if (counts.total === 0) {
      setupWrap.appendChild(
        el("div", { class: "card empty-state" }, [
          el("div", { class: "empty-icon" }, "🎉"),
          el("h3", {}, "You've learned every character and word in the app!"),
          el("p", {}, "Head to Review to keep your existing knowledge sharp with spaced repetition."),
          el("a", { class: "btn btn-primary", href: "#/review" }, "Go to Review")
        ])
      );
      return setupWrap;
    }

    setupWrap.appendChild(el("p", { class: "text-muted" }, `${counts.charFresh} new character(s) and ${counts.wordFresh} new word(s) available to learn.`));
    setupWrap.appendChild(el("p", { class: "text-faint", style: "margin-top:.4rem" }, "How many do you want to learn right now?"));

    const sizeRow = el("div", { class: "level-pills" }, [5, 10, 15, 20].map(sizePill));
    setupWrap.appendChild(sizeRow);

    const customInput = el("input", {
      type: "number", min: "1", max: String(counts.total), placeholder: "Custom amount",
      style: "margin-top:.6rem;width:160px;padding:.55rem .8rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text)"
    });
    customInput.addEventListener("input", () => {
      const n = Number(customInput.value);
      if (n > 0) {
        flow.batchSize = n;
        sizeRow.querySelectorAll(".level-pill").forEach((b) => b.classList.remove("active"));
      }
    });
    setupWrap.appendChild(customInput);

    function sizePill(n) {
      const b = el("button", { class: `level-pill ${flow.batchSize === n ? "active" : ""}`, onclick: () => {
        flow.batchSize = n;
        customInput.value = "";
        sizeRow.querySelectorAll(".level-pill").forEach((x) => x.classList.toggle("active", Number(x.dataset.size) === n));
      } }, String(n));
      b.dataset.size = n;
      return b;
    }

    const startBtn = el("button", { class: "btn btn-primary btn-block", style: "margin-top:1rem", onclick: () => {
      const size = Math.max(1, Math.min(counts.total, Math.round(flow.batchSize) || 10));
      flow.batch = buildBatch(size);
      flow.learnIdx = 0;
      flow.practiceIdx = 0;
      flow.correctCount = 0;
      flow.stage = "learning";
      renderStage();
    } }, `Start learning ${Math.max(1, Math.min(counts.total, Math.round(flow.batchSize) || 10))} →`);
    setupWrap.appendChild(startBtn);

    return setupWrap;
  }

  function renderLearning() {
    const learnWrap = el("div", { class: "card exercise-card" });
    const item = flow.batch[flow.learnIdx];
    const { kind, data } = item;
    const text = textFor(kind, data);
    const pinyinDisplay = kind === "character" ? `${data.pinyin} · ${toneNumbers(data.pinyin)}` : data.pinyin;

    learnWrap.appendChild(el("p", { class: "text-faint" }, `Learning ${flow.learnIdx + 1} of ${flow.batch.length}`));
    learnWrap.appendChild(el("span", { class: "badge badge-default" }, kind === "character" ? "🈶 Character" : "🗂️ Word"));
    learnWrap.appendChild(
      el("div", { class: "flex justify-between items-center", style: "margin-top:.5rem" }, [
        el("div", { class: "hanzi-xl" }, text),
        el("button", { class: "play-btn", onclick: () => audioEngine.speak(text) }, "🔊")
      ])
    );
    learnWrap.appendChild(el("div", { class: "pinyin-lg" }, pinyinDisplay));
    learnWrap.appendChild(el("p", { style: "font-weight:700;margin-top:.3rem" }, data.meaning));
    if (kind === "character" && data.trick) learnWrap.appendChild(el("p", { class: "text-faint", style: "margin-top:.5rem" }, data.trick));
    if (kind === "word" && data.collocations && data.collocations.length) {
      learnWrap.appendChild(el("p", { class: "text-faint", style: "margin-top:.5rem" }, `Also seen in: ${data.collocations.slice(0, 2).map((c) => c.w).join("、")}`));
    }

    learnWrap.appendChild(
      el("button", { class: "btn btn-primary btn-block", style: "margin-top:1rem", onclick: () => {
        blurActive();
        if (kind === "character") store.state.progress.charExposure[data.id] = (store.state.progress.charExposure[data.id] || 0) + 1;
        else store.state.progress.vocabExposure[data.id] = (store.state.progress.vocabExposure[data.id] || 0) + 1;
        store.save();
        flow.learnIdx++;
        if (flow.learnIdx >= flow.batch.length) { flow.stage = "practice"; flow.practiceIdx = 0; }
        renderStage();
      } }, flow.learnIdx + 1 < flow.batch.length ? "Got it → Next" : "Got it → See them in sentences")
    );

    if (store.state.settings.autoplayAudio) audioEngine.speak(text);
    return learnWrap;
  }

  function buildSentenceExercise(item) {
    const { kind, data } = item;
    const sentence = (data.sentences || [])[0];
    if (!sentence) return null;
    const target = textFor(kind, data);
    const zhBlanked = sentence.zh.includes(target) ? sentence.zh.replace(target, "____") : sentence.zh;
    const sameKindPool = flow.batch.filter((b) => b !== item && b.kind === kind).map((b) => textFor(b.kind, b.data));
    const fullPool = kind === "character" ? CHARACTERS.filter((c) => c.id !== data.id).map((c) => c.char) : VOCABULARY.filter((v) => v.id !== data.id).map((v) => v.word);
    const distractorPool = shuffle([...new Set([...sameKindPool, ...fullPool])]).filter((x) => x !== target);
    const options = shuffle([target, ...distractorPool.slice(0, 3)]);
    return { kind, data, sentence, target, zhBlanked, options };
  }

  function renderPractice() {
    const practiceWrap = el("div", { class: "card exercise-card" });
    const item = flow.batch[flow.practiceIdx];
    const ex = buildSentenceExercise(item);
    if (!ex) { practiceWrap.appendChild(el("p", {}, "Nothing to practice here.")); return practiceWrap; }

    practiceWrap.appendChild(el("p", { class: "text-faint" }, `Sentence ${flow.practiceIdx + 1} of ${flow.batch.length}`));
    practiceWrap.appendChild(
      el("div", { class: "flex justify-between items-center" }, [
        el("p", { class: "exercise-prompt hanzi" }, ex.zhBlanked),
        el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(ex.sentence.zh) }, "🔊")
      ])
    );
    practiceWrap.appendChild(el("p", { class: "text-muted" }, ex.sentence.en));
    practiceWrap.appendChild(el("p", { class: "text-faint", style: "margin-top:.2rem" }, "Which word fills the blank?"));

    const options = el("div", { class: "option-list" }, ex.options.map((opt) =>
      el("button", { class: "option-btn", onclick: (e) => {
        const btn = e.currentTarget;
        lockExercise();
        const isCorrect = opt === ex.target;
        btn.classList.add(isCorrect ? "correct" : "incorrect");
        if (!isCorrect) [...options.children].find((b) => b.textContent === ex.target)?.classList.add("correct");
        gradeAndAdvance(isCorrect);
      } }, opt)
    ));
    practiceWrap.appendChild(options);

    const typeToggle = el("button", { class: "btn btn-ghost btn-sm", style: "margin-top:.6rem" }, "✍️ Or type your answer instead (optional)");
    const typeBox = el("div", { class: "hidden", style: "margin-top:.5rem" });
    const typeInput = el("input", { type: "text", placeholder: "Type the word..." });
    typeInput.style.cssText = "width:100%;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1rem;";
    const typeSubmit = el("button", { class: "btn btn-primary btn-sm", style: "margin-top:.5rem" }, "Check");
    typeBox.appendChild(typeInput);
    typeBox.appendChild(typeSubmit);
    typeToggle.addEventListener("click", () => { typeBox.classList.toggle("hidden"); if (!typeBox.classList.contains("hidden")) typeInput.focus(); });
    typeInput.addEventListener("keydown", (e) => { if (e.key === "Enter") checkTyped(); });
    typeSubmit.addEventListener("click", checkTyped);
    practiceWrap.appendChild(typeToggle);
    practiceWrap.appendChild(typeBox);

    function lockExercise() {
      options.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
      typeToggle.disabled = true;
      typeInput.disabled = true;
      typeSubmit.disabled = true;
    }

    function checkTyped() {
      const text = typeInput.value.trim();
      if (!text) { toast("Type your answer first.", { type: "error" }); return; }
      lockExercise();
      const isCorrect = wordMatch(text, ex.target, ex.data.pinyin);
      const correctBtn = [...options.children].find((b) => b.textContent === ex.target);
      if (correctBtn) correctBtn.classList.add("correct");
      const feedback = el("div", { class: `feedback-block ${isCorrect ? "correct" : "incorrect"}`, style: "margin-top:.6rem" }, [
        el("p", {}, isCorrect ? "Nice — that's right!" : "Close — the correct word is highlighted above.")
      ]);
      practiceWrap.appendChild(feedback);
      gradeAndAdvance(isCorrect);
    }

    function gradeAndAdvance(isCorrect) {
      blurActive();
      if (isCorrect) flow.correctCount++;
      gradeItem(srsIdFor(ex.kind, ex.data.id), ex.kind, isCorrect ? QUALITY.GOOD : QUALITY.AGAIN);
      if (ex.kind === "character") store.state.progress.charExposure[ex.data.id] = (store.state.progress.charExposure[ex.data.id] || 0) + 1;
      else store.state.progress.vocabExposure[ex.data.id] = (store.state.progress.vocabExposure[ex.data.id] || 0) + 1;
      addXP(isCorrect ? 3 : 1, `${ex.kind === "character" ? "Character" : "Word"}: ${ex.target}`);
      store.save();
      setTimeout(() => {
        flow.practiceIdx++;
        if (flow.practiceIdx >= flow.batch.length) flow.stage = "done";
        renderStage();
      }, isCorrect ? 900 : 1600);
    }

    return practiceWrap;
  }

  function renderDone() {
    const doneWrap = el("div", { class: "card empty-state pop-in" });
    doneWrap.appendChild(el("div", { class: "empty-icon" }, "✅"));
    doneWrap.appendChild(el("h3", {}, `Learned ${flow.batch.length} — ${flow.correctCount} / ${flow.batch.length} correct in context`));
    doneWrap.appendChild(el("p", {}, "Nice work! These are now in your spaced-repetition queue and will come back up in Review."));
    doneWrap.appendChild(
      el("div", { class: "btn-row", style: "margin-top:1rem" }, [
        el("button", { class: "btn btn-primary", onclick: () => { flow.stage = "setup"; renderStage(); } }, "Learn more"),
        el("a", { class: "btn", href: "#/review" }, "Go to Review")
      ])
    );
    return doneWrap;
  }
}

function buildBrowse() {
  const wrap = el("div", {});
  const state = { kind: "all", search: "" };

  const searchRow = el("div", { class: "search-row" });
  const input = el("input", { type: "search", placeholder: "Search characters or words by hanzi, pinyin, or meaning...", style: "flex:1;min-width:200px;padding:.6rem .9rem;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--text)" });
  input.addEventListener("input", () => { state.search = input.value; renderList(); });
  searchRow.appendChild(input);
  wrap.appendChild(searchRow);

  const kindPills = el("div", { class: "level-pills" }, [
    kindPill("all", "All"),
    kindPill("character", "🈶 Characters"),
    kindPill("word", "🗂️ Words")
  ]);
  wrap.appendChild(kindPills);

  const countLabel = el("p", { class: "text-muted", style: "margin-top:.75rem" }, "");
  wrap.appendChild(countLabel);
  const grid = el("div", { class: "grid grid-auto" });
  wrap.appendChild(grid);
  const detailWrap = el("div", { style: "margin-top:1rem" });
  wrap.appendChild(detailWrap);

  function kindPill(id, label) {
    const b = el("button", { class: `level-pill ${state.kind === id ? "active" : ""}`, onclick: () => {
      state.kind = id;
      kindPills.querySelectorAll(".level-pill").forEach((x) => x.classList.toggle("active", x.dataset.kind === id));
      renderList();
    } }, label);
    b.dataset.kind = id;
    return b;
  }

  function renderList() {
    grid.innerHTML = "";
    detailWrap.innerHTML = "";
    const s = state.search.trim().toLowerCase();
    const chars = state.kind === "word" ? [] : CHARACTERS.filter((c) => !s || c.char.includes(s) || c.pinyin.toLowerCase().includes(s) || c.meaning.toLowerCase().includes(s)).map((data) => ({ kind: "character", data }));
    const words = state.kind === "character" ? [] : VOCABULARY.filter((v) => !s || v.word.includes(s) || v.pinyin.toLowerCase().includes(s) || v.meaning.toLowerCase().includes(s)).map((data) => ({ kind: "word", data }));
    const combined = [...chars, ...words];
    countLabel.textContent = `${combined.length} result(s)`;

    combined.forEach(({ kind, data }) => {
      const text = textFor(kind, data);
      const mastery = masteryLevel(srsIdFor(kind, data.id));
      grid.appendChild(
        el("div", { class: "card", style: "padding:.9rem;cursor:pointer", onclick: () => {
          detailWrap.innerHTML = "";
          detailWrap.appendChild(detailFor(kind, data));
          detailWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } }, [
          el("div", { class: "flex justify-between items-center" }, [
            el("span", { class: "badge badge-default" }, kind === "character" ? "🈶" : "🗂️"),
            el("button", { class: "play-btn", style: "width:30px;height:30px", onclick: (e) => { e.stopPropagation(); audioEngine.speak(text); } }, "🔊")
          ]),
          el("div", { class: "hanzi", style: "font-weight:700;font-size:1.2rem;margin-top:.4rem" }, text),
          el("div", { class: "text-muted", style: "font-size:.85rem" }, `${data.pinyin} — ${data.meaning}`),
          el("div", { class: "progress-bar", style: "margin-top:.5rem" }, [el("div", { class: "progress-bar-fill", style: `width:${mastery}%` })])
        ])
      );
    });
  }
  renderList();
  return wrap;
}
