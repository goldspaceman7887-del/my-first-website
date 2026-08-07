// LEARN — vocabulary, grammar, and dialogues in one place instead of three
// separate sections. Each tab reuses its existing view; the sub-view's own
// page header is stripped so the section reads as one screen.

import { el } from "../core/ui.js";
import { renderVocabulary } from "./vocabulary.js";
import { renderSentences } from "./sentences.js";
import { renderDialogueList } from "./dialogues.js";

const TABS = [
  { id: "vocab", label: "🗂️ Vocabulary", render: renderVocabulary, blurb: "High-frequency Mexican Spanish words with usage notes, examples, and flashcards." },
  { id: "grammar", label: "🧩 Grammar", render: renderSentences, blurb: "Grammar taught through real sentences and conversations — never rules first." },
  { id: "dialogues", label: "💬 Dialogues", render: renderDialogueList, blurb: "Realistic conversations across everyday Mexican situations." }
];

export function renderLearn(container, params) {
  let active = TABS.some((t) => t.id === params?.tab) ? params.tab : "vocab";

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "📚 Learn"),
      el("p", {}, "Vocabulary, grammar, and dialogues together in one place.")
    ])
  );

  const tabs = el("div", { class: "tabs" }, TABS.map((t) =>
    el("button", { class: `tab-btn ${t.id === active ? "active" : ""}`, onclick: () => setTab(t.id) }, t.label)
  ));
  container.appendChild(tabs);

  const blurb = el("p", { class: "text-muted", style: "margin-top:-.4rem" });
  container.appendChild(blurb);

  const body = el("div", {});
  container.appendChild(body);

  function setTab(id) {
    active = id;
    tabs.querySelectorAll(".tab-btn").forEach((b, i) => b.classList.toggle("active", TABS[i].id === id));
    render();
  }

  // A tab may return a cleanup function (vocabulary.js does, to release its
  // tap-word listener). Dropping it would leak a document click listener
  // every time the sub-tab or route changes.
  let cleanup = null;
  function runCleanup() {
    if (typeof cleanup !== "function") return;
    try { cleanup(); } catch (e) { console.error(e); }
    cleanup = null;
  }

  function render() {
    const tab = TABS.find((t) => t.id === active);
    runCleanup();
    blurb.textContent = tab.blurb;
    body.innerHTML = "";
    const maybeCleanup = tab.render(body);
    if (typeof maybeCleanup === "function") cleanup = maybeCleanup;
    // Each sub-view ships its own header; drop it so this reads as one screen.
    body.querySelector(".page-header")?.remove();
  }

  render();
  return runCleanup;
}
