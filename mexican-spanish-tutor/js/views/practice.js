// PRACTICE — every speaking/writing mode behind one nav item instead of
// several. Same views as before, just grouped so the sidebar stays short.
//
// Lands on Daily Practice by default: a condensed "what's due right now"
// instead of dropping you on whichever mode happened to be first.

import { el } from "../core/ui.js";
import { renderDailyPractice } from "./dailyPractice.js";
import { renderScenarios } from "./scenarios.js";
import { renderConversation } from "./conversation.js";
import { renderListeningPractice } from "./listeningPractice.js";
import { renderImmersion } from "./immersion.js";
import { renderStory } from "./story.js";
import { renderCorrection } from "./correction.js";
import { renderSpeakingTest } from "./speakingTest.js";
import { renderWeaknessReview } from "./weaknessReview.js";

const TABS = [
  { id: "daily", label: "🎯 Daily Practice", render: renderDailyPractice },
  { id: "conversation", label: "💬 Conversation", render: renderConversation },
  { id: "scenarios", label: "🎭 Scenarios", render: renderScenarios },
  { id: "listening", label: "👂 Listening", render: renderListeningPractice },
  { id: "speaking-test", label: "🎓 Speaking Test", render: renderSpeakingTest },
  { id: "writing", label: "✍️ Writing", render: renderCorrection },
  { id: "weakness", label: "📉 Weakness Review", render: renderWeaknessReview },
  { id: "immersion", label: "🌊 Immersion", render: renderImmersion },
  { id: "story", label: "📖 Stories", render: renderStory }
];

// "Roleplay" was the old id for what's now "Scenarios" — old links/bookmarks
// (and dialogues.js's cross-link) still route here.
const TAB_ALIASES = { roleplay: "scenarios" };
function resolveTab(id) {
  return TAB_ALIASES[id] || id;
}

export function renderPractice(container, params) {
  const requested = resolveTab(params?.tab);
  let active = TABS.some((t) => t.id === requested) ? requested : "daily";

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
