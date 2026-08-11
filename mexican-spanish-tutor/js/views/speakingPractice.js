// SPEAKING PRACTICE — Conversation, Roleplay, and the Speaking Test under
// one tab instead of three. Same three existing views, just regrouped.

import { el, clickableDiv } from "../core/ui.js";
import { renderConversation } from "./conversation.js";
import { renderRoleplay } from "./roleplay.js";
import { renderSpeakingTest } from "./speakingTest.js";

const MODES = [
  { id: "conversation", label: "💬 Conversation", blurb: "Chat freely — it follows up on what you actually say.", render: renderConversation },
  { id: "roleplay", label: "🎭 Roleplay", blurb: "Play a real-world scenario against a scripted native model.", render: renderRoleplay },
  { id: "speaking-test", label: "🎓 Speaking Test", blurb: "A mock ACTFL interview, scored on what you actually say.", render: renderSpeakingTest }
];

export function renderSpeakingPractice(container) {
  let active = null;
  const picker = el("div", { class: "grid grid-auto" });
  const body = el("div", {});
  container.appendChild(picker);
  container.appendChild(body);

  let cleanup = null;
  function runCleanup() {
    if (typeof cleanup !== "function") return;
    try { cleanup(); } catch (e) { console.error(e); }
    cleanup = null;
  }

  function showPicker() {
    active = null;
    runCleanup();
    body.innerHTML = "";
    picker.classList.remove("hidden");
  }

  function open(mode) {
    active = mode.id;
    runCleanup();
    picker.classList.add("hidden");
    body.innerHTML = "";
    body.appendChild(
      el("button", { class: "btn btn-sm", style: "margin-bottom:.6rem", onclick: showPicker }, "← Choose a different mode")
    );
    const inner = el("div", {});
    body.appendChild(inner);
    const maybeCleanup = mode.render(inner);
    if (typeof maybeCleanup === "function") cleanup = maybeCleanup;
    inner.querySelector(".page-header")?.remove();
  }

  MODES.forEach((mode) => {
    picker.appendChild(
      clickableDiv({ class: "card card-link", style: "cursor:pointer", onclick: () => open(mode) }, [
        el("h3", { style: "margin:0 0 .3rem" }, mode.label),
        el("p", { class: "text-muted" }, mode.blurb)
      ])
    );
  });

  return runCleanup;
}
