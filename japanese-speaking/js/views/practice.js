import { FUNCTIONS, getFunction } from "../data/prompts.js";
import { CONNECTORS, CATEGORIES } from "../data/connectors.js";
import { el, toast } from "../core/ui.js";
import { getState, saveRecording } from "../core/storage.js";
import { speechRecognitionSupported, startRecognition } from "../core/audio.js";

let selectedFunctionId = FUNCTIONS[0].id;
let selectedTopic = FUNCTIONS[0].topics[0];
let recognitionController = null;
let recording = false;
let startTime = null;
let timerInterval = null;
let liveTranscript = "";
let lastAnalysis = null;

function categoryChipsFor(categoryIds) {
  return el(
    "div",
    { class: "chip-row small" },
    categoryIds.map((cid) => {
      const cat = CATEGORIES.find((c) => c.id === cid);
      const examples = CONNECTORS.filter((c) => c.category === cid).slice(0, 3);
      return el(
        "span",
        { class: "chip static", style: `background:${cat.color}22;color:${cat.color}`, title: examples.map((e) => e.jp).join(" / ") },
        cat.jp
      );
    })
  );
}

function analyzeTranscript(text) {
  const clean = text.trim();
  const sentences = clean.split(/[。！？]/).map((s) => s.trim()).filter(Boolean);
  const charCount = clean.replace(/\s/g, "").length;
  const hits = CONNECTORS.filter((c) => clean.includes(c.jp));
  const categoriesUsed = [...new Set(hits.map((h) => h.category))];
  return { sentenceCount: sentences.length, charCount, hits, categoriesUsed };
}

export function render(root) {
  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "🎤 Paragraph Practice"),
      el("p", { class: "subtitle" }, "Pick a function, follow the scaffold, and speak in connected sentences — not isolated ones."),
    ])
  );

  const fnSelect = el(
    "select",
    {
      class: "select",
      onchange: (e) => {
        selectedFunctionId = e.target.value;
        selectedTopic = getFunction(selectedFunctionId).topics[0];
        resetRecordingUI();
        render(root);
      },
    },
    FUNCTIONS.map((f) => el("option", { value: f.id, selected: f.id === selectedFunctionId ? "selected" : null }, f.title))
  );

  const fn = getFunction(selectedFunctionId);

  const topicSelect = el(
    "select",
    {
      class: "select",
      onchange: (e) => {
        selectedTopic = e.target.value;
      },
    },
    fn.topics.map((t) => el("option", { value: t, selected: t === selectedTopic ? "selected" : null }, t))
  );

  const controlCard = el("div", { class: "card" }, [
    el("div", { class: "practice-controls" }, [
      el("label", {}, ["Function", fnSelect]),
      el("label", {}, ["Topic", topicSelect]),
    ]),
    el("p", { class: "muted" }, fn.actfl),
  ]);
  container.appendChild(controlCard);

  const scaffoldCard = el("div", { class: "card" });
  scaffoldCard.appendChild(el("h2", {}, "Scaffold — build your paragraph move by move"));
  const moveList = el("ol", { class: "scaffold-list" });
  fn.moves.forEach((m) => {
    moveList.appendChild(el("li", {}, [el("div", {}, m.label), m.hint ? el("div", { class: "muted small" }, m.hint) : null, categoryChipsFor(m.categories)]));
  });
  scaffoldCard.appendChild(moveList);
  container.appendChild(scaffoldCard);

  const recCard = el("div", { class: "card" });
  recCard.appendChild(el("h2", {}, "Record your paragraph"));
  const timerLabel = el("span", { id: "practice-timer", class: "timer" }, "0:00");
  const transcriptBox = el("div", { id: "practice-transcript", class: "transcript-box" }, liveTranscript || "Your speech will appear here as you talk…");

  if (!speechRecognitionSupported()) {
    recCard.appendChild(
      el("p", { class: "muted small" }, "Speech recognition isn't available in this browser — Chrome or Edge on desktop works best. You can still time yourself and type your paragraph below to get connector feedback.")
    );
    const manualBox = el("textarea", { class: "manual-transcript", rows: "5", placeholder: "Type or paste what you said (or plan to say) here…" });
    recCard.appendChild(manualBox);
    const analyzeBtn = el("button", { class: "btn primary" }, "Analyze & save");
    analyzeBtn.addEventListener("click", () => {
      finishPractice(manualBox.value, 0);
    });
    recCard.appendChild(analyzeBtn);
  } else {
    const startBtn = el("button", { class: "btn primary record-btn" }, "● Start speaking");
    startBtn.addEventListener("click", () => {
      if (!recording) {
        recording = true;
        liveTranscript = "";
        startTime = Date.now();
        startBtn.textContent = "■ Stop";
        startBtn.classList.add("recording");
        timerInterval = setInterval(() => {
          const secs = Math.floor((Date.now() - startTime) / 1000);
          timerLabel.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
        }, 250);
        recognitionController = startRecognition({
          onInterim: (text) => {
            liveTranscript = text;
            transcriptBox.textContent = text || "…";
          },
          onFinal: (text) => {
            liveTranscript = text;
          },
          onError: (e) => {
            toast("Recognition error — try again or check mic permissions.", { type: "error" });
          },
        });
      } else {
        recording = false;
        startBtn.textContent = "● Start speaking";
        startBtn.classList.remove("recording");
        clearInterval(timerInterval);
        const durationSec = Math.floor((Date.now() - startTime) / 1000);
        recognitionController?.stop();
        setTimeout(() => finishPractice(liveTranscript, durationSec), 400);
      }
    });
    recCard.appendChild(el("div", { class: "practice-record-row" }, [startBtn, timerLabel]));
    recCard.appendChild(transcriptBox);
  }

  container.appendChild(recCard);

  const feedbackHost = el("div", { id: "practice-feedback" });
  if (lastAnalysis) feedbackHost.appendChild(renderFeedback(lastAnalysis));
  container.appendChild(feedbackHost);

  root.innerHTML = "";
  root.appendChild(container);

  function finishPractice(text, durationSec) {
    const analysis = analyzeTranscript(text || "");
    lastAnalysis = { ...analysis, text, durationSec, functionId: selectedFunctionId, topic: selectedTopic };
    saveRecording({
      functionId: selectedFunctionId,
      topic: selectedTopic,
      transcript: text,
      wordCount: analysis.charCount,
      sentenceCount: analysis.sentenceCount,
      connectorHits: analysis.hits.map((h) => h.id),
      durationSec,
    });
    toast("Saved! Check your feedback below.", { type: "success" });
    render(root);
  }
}

function resetRecordingUI() {
  recording = false;
  liveTranscript = "";
  lastAnalysis = null;
  if (timerInterval) clearInterval(timerInterval);
  if (recognitionController) recognitionController.stop();
}

function renderFeedback(a) {
  const fn = getFunction(a.functionId);
  const targetMoves = fn.moves.length;
  const card = el("div", { class: "card feedback-card" });
  card.appendChild(el("h2", {}, "Feedback on your last recording"));
  card.appendChild(
    el("div", { class: "feedback-grid" }, [
      feedbackStat(a.sentenceCount, "sentences", a.sentenceCount >= targetMoves - 1 ? "good" : "warn"),
      feedbackStat(a.hits.length, "connector uses", a.hits.length >= 3 ? "good" : "warn"),
      feedbackStat(a.categoriesUsed.length, "connector categories", a.categoriesUsed.length >= 2 ? "good" : "warn"),
      feedbackStat(`${a.durationSec}s`, "duration", a.durationSec >= 30 ? "good" : "warn"),
    ])
  );
  if (a.text) {
    card.appendChild(el("p", { class: "muted small" }, "Transcript:"));
    card.appendChild(el("div", { class: "transcript-box" }, a.text));
  }
  const tips = [];
  if (a.sentenceCount < targetMoves - 1) tips.push("Try to hit closer to the number of moves in the scaffold — you're speaking in fewer sentences than the target structure.");
  if (a.hits.length < 3) tips.push("Add more connectors — aim for at least one per 1-2 sentences so ideas feel linked, not listed.");
  if (a.categoriesUsed.length < 2) tips.push("Vary your connector categories (e.g. don't just use sequence words — add a cause, contrast, or result connector too).");
  if (a.durationSec > 0 && a.durationSec < 30) tips.push("Push for a longer, more sustained turn — Advanced High raters want to hear you sustain discourse, not give short answers.");
  if (tips.length === 0) tips.push("Strong paragraph! This has the sentence count, connector variety, and length of an Advanced-level turn. Try a harder topic next.");
  const tipList = el("ul", { class: "tip-list" });
  tips.forEach((t) => tipList.appendChild(el("li", {}, t)));
  card.appendChild(tipList);
  card.appendChild(el("a", { class: "btn", href: "#/rubric" }, "Self-score this with the full AH rubric →"));
  return card;
}

function feedbackStat(value, label, status) {
  return el("div", { class: `feedback-stat ${status}` }, [el("div", { class: "feedback-stat-value" }, String(value)), el("div", { class: "feedback-stat-label" }, label)]);
}
