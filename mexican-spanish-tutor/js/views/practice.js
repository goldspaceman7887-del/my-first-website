// PRACTICE — organized around what you're training, not just a list of
// modes: Daily Practice, Vocabulary Review, Listening Practice, Speaking
// Practice, Writing Practice, Weakness Review, ACTFL Skill Practice.
//
// Old direct tab ids (conversation, roleplay, speaking-test, immersion,
// story, writing) still work as deep links — e.g. #/practice/conversation —
// rendering that view full-page without the redesigned tab pills. Nothing
// that could reach one of those before stops working; the pills are just a
// new front door.

import { el } from "../core/ui.js";
import { renderRoleplay } from "./roleplay.js";
import { renderConversation } from "./conversation.js";
import { renderImmersion } from "./immersion.js";
import { renderStory } from "./story.js";
import { renderCorrection } from "./correction.js";
import { renderSpeakingTest } from "./speakingTest.js";
import { renderReview } from "./review.js";
import { renderDailyPractice } from "./dailyPractice.js";
import { renderListeningPractice } from "./listeningPractice.js";
import { renderWeaknessReview } from "./weaknessReview.js";
import { renderSkillPractice } from "./skillPractice.js";
import { renderSpeakingPractice } from "./speakingPractice.js";

const TABS = [
  { id: "daily", label: "🌅 Daily Practice", render: renderDailyPractice, blurb: "A short, personalized starting point: what's due, your next unit, one real-life scenario." },
  { id: "vocabulary", label: "🗂️ Vocabulary Review", render: (c) => renderReview(c, { tab: "known", deck: "words" }), blurb: "Spaced-repetition flashcards for the words you've been taught." },
  { id: "listening", label: "👂 Listening Practice", render: renderListeningPractice, blurb: "Dialogues and stories played aloud, then comprehension questions." },
  { id: "speaking", label: "🗣️ Speaking Practice", render: renderSpeakingPractice, blurb: "Conversation, Roleplay, and the Speaking Test in one place." },
  { id: "writing", label: "✍️ Writing Practice", render: renderCorrection, blurb: "Write freely — every mistake gets explained, never just marked wrong." },
  { id: "weakness", label: "🎯 Weakness Review", render: renderWeaknessReview, blurb: "Pulled straight from your data: your lowest skills and shakiest items." },
  { id: "skill", label: "📈 ACTFL Skill Practice", render: renderSkillPractice, blurb: "Pick a skill and practice it directly — this is exactly what moves your ACTFL estimate." }
];

// Legacy ids from before this redesign, kept working as direct deep links.
const LEGACY = {
  conversation: renderConversation,
  roleplay: renderRoleplay,
  "speaking-test": renderSpeakingTest,
  immersion: renderImmersion,
  story: renderStory
};

export function renderPractice(container, params) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎯 Practice"),
      el("p", {}, "Practice organized around what you're training, not just a list of games.")
    ])
  );

  const legacyTab = params?.tab && LEGACY[params.tab] ? params.tab : null;
  if (legacyTab) {
    const body = el("div", {});
    container.appendChild(body);
    const maybeCleanup = LEGACY[legacyTab](body);
    body.querySelector(".page-header")?.remove();
    return maybeCleanup;
  }

  let active = TABS.some((t) => t.id === params?.tab) ? params.tab : "daily";

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

  // A tab may return a cleanup function (Conversation/Immersion release the
  // mic; the Speaking/Skill hubs forward their active sub-view's cleanup).
  // Dropping it would leave the mic recording after you switch tabs away.
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
    blurb.textContent = tab.blurb;
    const maybeCleanup = tab.render(body);
    if (typeof maybeCleanup === "function") cleanup = maybeCleanup;
    body.querySelector(".page-header")?.remove();
  }

  render();
  return runCleanup;
}
