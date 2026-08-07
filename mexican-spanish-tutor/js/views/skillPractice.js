// ACTFL SKILL PRACTICE — pick a modality (or let it point at your weakest)
// and it routes straight into the matching existing generator. Every one of
// these sessions ends by updating the store.state.scores value that field
// feeds — see core/assessment.js's computeActflEstimate() — so the
// connection between "practice this" and "your level moves" is direct, not
// just XP.

import { store } from "../core/storage.js";
import { el } from "../core/ui.js";
import { renderSpeakingTest } from "./speakingTest.js";
import { renderCorrection } from "./correction.js";
import { renderReview } from "./review.js";
import { renderStory } from "./story.js";
import { renderSentences } from "./sentences.js";
import { renderListeningPractice } from "./listeningPractice.js";

const MODALITIES = [
  { id: "speaking", label: "🗣️ Speaking", blurb: "A live Speaking Test session, scored on what you actually say.", render: renderSpeakingTest },
  { id: "listening", label: "👂 Listening", blurb: "A dialogue or story, played aloud, then comprehension.", render: renderListeningPractice },
  { id: "writing", label: "✍️ Writing", blurb: "Write freely, get every mistake explained.", render: renderCorrection },
  { id: "vocabulary", label: "🗂️ Vocabulary", blurb: "Flashcards from everything you've been taught.", render: (c) => renderReview(c, { tab: "known", deck: "words" }) },
  { id: "reading", label: "📖 Reading", blurb: "A story at your level, with tap-to-define.", render: renderStory },
  { id: "grammar", label: "🧩 Grammar", blurb: "A grammar pattern, drilled and explained through a real sentence.", render: renderSentences }
];

function skillFromHash() {
  const q = window.location.hash.split("?")[1];
  if (!q) return null;
  return new URLSearchParams(q).get("skill");
}

export function renderSkillPractice(container) {
  const scores = store.state.scores || {};
  const weakestId = Object.entries(scores).sort((a, b) => a[1] - b[1])[0]?.[0];
  const requested = skillFromHash();
  let active = MODALITIES.some((m) => m.id === requested) ? requested : null;

  const picker = el("div", {});
  const body = el("div", {});
  container.appendChild(picker);
  container.appendChild(body);

  let cleanup = null;
  function runCleanup() {
    if (typeof cleanup !== "function") return;
    try { cleanup(); } catch (e) { console.error(e); }
    cleanup = null;
  }

  function drawPicker() {
    picker.innerHTML = "";
    picker.appendChild(
      el("p", { class: "text-muted" }, "Pick a skill to drill directly — this is exactly what moves your ACTFL estimate; the estimate is now the better of your XP and your real skill scores, not XP alone.")
    );
    const grid = el("div", { class: "grid grid-auto" });
    MODALITIES.forEach((m) => {
      const isWeakest = m.id === weakestId;
      grid.appendChild(
        el("div", { class: "card card-link", style: "cursor:pointer", onclick: () => open(m) }, [
          el("div", { class: "flex justify-between items-center", style: "gap:.4rem" }, [
            el("h3", { style: "margin:0" }, m.label),
            isWeakest ? el("span", { class: "badge badge-danger" }, "Weakest for you") : null
          ].filter(Boolean)),
          el("p", { class: "text-muted" }, m.blurb)
        ])
      );
    });
    picker.appendChild(grid);
  }

  function showPicker() {
    active = null;
    runCleanup();
    body.innerHTML = "";
    drawPicker();
  }

  function open(m) {
    active = m.id;
    runCleanup();
    picker.innerHTML = "";
    body.innerHTML = "";
    body.appendChild(
      el("div", { class: "flex justify-between items-center", style: "margin-bottom:.6rem;gap:.5rem" }, [
        el("button", { class: "btn btn-sm", onclick: showPicker }, "← Choose a different skill"),
        el("span", { class: "badge badge-default" }, `Updates your ${m.id} score`)
      ])
    );
    const inner = el("div", {});
    body.appendChild(inner);
    const maybeCleanup = m.render(inner);
    if (typeof maybeCleanup === "function") cleanup = maybeCleanup;
    inner.querySelector(".page-header")?.remove();
  }

  if (active) open(MODALITIES.find((m) => m.id === active));
  else drawPicker();

  return runCleanup;
}
