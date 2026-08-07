// Shared "how much English should show right now" gate, wired to
// settings.immersionLevel (1 = heavy support .. 4 = Spanish only) instead of
// every view reinventing its own boolean. story.js used to have its own
// local show/hide toggle — this generalizes that pattern so roadmap.js,
// dialogues.js, and vocabulary.js can all share one mechanism instead of
// showing English unconditionally.

import { store } from "./storage.js";

export function immersionLevel() {
  return store.state.settings.immersionLevel || 1;
}

// Inline English (directly under the Spanish, no click needed) only at low
// immersion. This is the same threshold conversation.js/scenarioPlay.js
// already use for their own chat bubbles.
export function showEnglishInline() {
  return immersionLevel() <= 2;
}

// At immersion 3-4, English still exists but requires a deliberate reveal
// tap — this is what replaces "always visible" everywhere in the sweep.
export function englishNeedsReveal() {
  return immersionLevel() >= 3;
}

// Builds a reveal-gated English row: the same DOM shape everywhere
// (roadmap, dialogues, vocabulary) so one bit of CSS covers all of them.
// Returns either the English directly (low immersion) or a "Show English"
// toggle that reveals it in place (high immersion). `el` is passed in
// rather than imported to avoid this module needing a UI dependency —
// every call site already imports `el` from core/ui.js anyway.
export function englishLine(el, enText, { className = "text-muted" } = {}) {
  if (showEnglishInline()) return el("div", { class: className }, enText);
  const line = el("div", { class: `${className} hidden` }, enText);
  const btn = el("button", { class: "btn btn-sm english-reveal-btn", type: "button" }, "👁 Show English");
  btn.addEventListener("click", () => {
    line.classList.toggle("hidden");
    btn.textContent = line.classList.contains("hidden") ? "👁 Show English" : "🙈 Hide English";
  });
  return el("div", { class: "english-reveal" }, [btn, line]);
}
