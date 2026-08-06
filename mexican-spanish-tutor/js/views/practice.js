// PRACTICE — every speaking/writing mode behind one nav item instead of
// five. Same views as before, just grouped so the sidebar stays short.

import { el } from "../core/ui.js";
import { renderScenarios } from "./scenarios.js";
import { renderConversation } from "./conversation.js";
import { renderImmersion } from "./immersion.js";
import { renderStory } from "./story.js";
import { renderCorrection } from "./correction.js";
import { renderSpeakingTest } from "./speakingTest.js";

const TABS = [
  { id: "conversation", label: "💬 Conversation", render: renderConversation },
  { id: "roleplay", label: "🎭 Roleplay", render: renderScenarios },
  { id: "speaking-test", label: "🎓 Speaking Test", render: renderSpeakingTest },
  { id: "immersion", label: "🌊 Immersion", render: renderImmersion },
  { id: "story", label: "📖 Stories", render: renderStory },
  { id: "writing", label: "✍️ Writing", render: renderCorrection }
];

export function renderPractice(container, params) {
  let active = TABS.some((t) => t.id === params?.tab) ? params.tab : "conversation";

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎯 Practice"),
      el("p", {}, "Use what you've learned: complete a real-life task, chat freely, go Spanish-only, read a story, or get your writing corrected.")
    ])
  );

  const tabs = el("div", { class: "tabs" }, TABS.map((t) =>
    el("button", { class: `tab-btn ${t.id === active ? "active" : ""}`, onclick: () => setTab(t.id) }, t.label)
  ));
  container.appendChild(tabs);

  const body = el("div", {});
  container.appendChild(body);

  function setTab(id) {
    active = id;
    tabs.querySelectorAll(".tab-btn").forEach((b, i) => b.classList.toggle("active", TABS[i].id === id));
    render();
  }

  // A tab may return a cleanup function (the conversation tab does, to release
  // the microphone). Dropping it would leave the mic recording after you
  // switch tabs or navigate away.
  let cleanup = null;
  function runCleanup() {
    if (typeof cleanup !== "function") return;
    try { cleanup(); } catch (e) { console.error(e); }
    cleanup = null;
  }

  function render() {
    const tab = TABS.find((t) => t.id === active);
    runCleanup();
    body.innerHTML = "";
    const maybeCleanup = tab.render(body);
    if (typeof maybeCleanup === "function") cleanup = maybeCleanup;
    body.querySelector(".page-header")?.remove();
  }

  render();
  return runCleanup;
}
