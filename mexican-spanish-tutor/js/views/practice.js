// PRACTICE — every speaking/writing mode behind one nav item instead of
// five. Same views as before, just grouped so the sidebar stays short.

import { el } from "../core/ui.js";
import { renderRoleplay } from "./roleplay.js";
import { renderConversation } from "./conversation.js";
import { renderImmersion } from "./immersion.js";
import { renderStory } from "./story.js";
import { renderCorrection } from "./correction.js";
import { renderSpeakingTest } from "./speakingTest.js";

const TABS = [
  { id: "roleplay", label: "🎭 Roleplay", render: renderRoleplay },
  { id: "speaking-test", label: "🎓 Speaking Test", render: renderSpeakingTest },
  { id: "conversation", label: "🤖 Conversation", render: renderConversation },
  { id: "immersion", label: "🌊 Immersion", render: renderImmersion },
  { id: "story", label: "📖 Stories", render: renderStory },
  { id: "writing", label: "✍️ Writing", render: renderCorrection }
];

export function renderPractice(container, params) {
  let active = TABS.some((t) => t.id === params?.tab) ? params.tab : "roleplay";

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎯 Practice"),
      el("p", {}, "Use what you've learned: role-play a scenario, chat freely, go Spanish-only, read a story, or get your writing corrected.")
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

  function render() {
    const tab = TABS.find((t) => t.id === active);
    body.innerHTML = "";
    tab.render(body);
    body.querySelector(".page-header")?.remove();
  }

  render();
}
