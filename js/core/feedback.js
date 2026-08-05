// Shared Spanish-error feedback, used everywhere you type Spanish: the
// AI Tutor corrector, dialogue extension answers, the vocabulary/grammar
// free-writing boxes, and anywhere else free Spanish text gets typed.
//
// The shape of the feedback is the point. Three things, in this order:
//   1. your sentence, corrected — so you can see the target
//   2. exactly which fragment was wrong and what it should be
//   3. why, in plain English, plus the rule and a couple of real examples
//
// Never a bare "wrong". If it can't explain the fix, it says nothing.

import { el } from "./ui.js";
import { audioEngine } from "./audio.js";
import { checkSpanish } from "../data/mistakePatterns.js";

// Returns a DOM node, or null when the Spanish had no detectable problems.
export function correctionBlock(text, { compact = false } = {}) {
  const hits = checkSpanish(text);
  if (!hits.length) return null;

  const corrected = hits[0].corrected;
  const wrap = el("div", { class: "correction-block" });

  wrap.appendChild(
    el("div", { class: "co-head" }, [
      el("span", { class: "co-icon" }, "✏️"),
      el("span", {}, hits.length === 1 ? "One thing to fix" : `${hits.length} things to fix`)
    ])
  );

  // What you wrote → what it should be
  wrap.appendChild(
    el("div", { class: "co-fix" }, [
      el("div", { class: "co-line co-wrong" }, [
        el("span", { class: "co-tag" }, "You wrote"),
        el("span", { class: "es-text" }, text.trim())
      ]),
      el("div", { class: "co-line co-right" }, [
        el("span", { class: "co-tag" }, "Try"),
        el("span", { class: "es-text" }, corrected),
        el(
          "button",
          {
            class: "btn btn-sm",
            style: "margin-left:.4rem",
            onclick: (e) => {
              e.stopPropagation();
              audioEngine.speak(corrected);
            }
          },
          "🔊"
        )
      ])
    ])
  );

  hits.forEach((h) => {
    const item = el("div", { class: "co-item" }, [
      el("div", { class: "co-swap" }, [
        el("span", { class: "badge badge-danger" }, h.fragment),
        el("span", { class: "co-arrow" }, "→"),
        el("span", { class: "badge badge-success" }, h.suggestion),
        el("span", { class: "co-label" }, h.label)
      ]),
      el("p", { class: "co-explain" }, h.why)
    ]);
    if (!compact) {
      item.appendChild(el("p", { class: "co-rule" }, h.rule));
      if (h.examples.length) {
        item.appendChild(
          el(
            "div",
            { class: "co-examples" },
            h.examples.slice(0, 3).map((ex) => el("span", { class: "es-text co-example" }, ex))
          )
        );
      }
    }
    wrap.appendChild(item);
  });

  return wrap;
}

// True when the text has something worth correcting — for callers that want
// to decide before building UI.
export function hasCorrections(text) {
  return checkSpanish(text).length > 0;
}

// A short one-line version for tight spots like a chat bubble.
export function inlineCorrection(text) {
  const hits = checkSpanish(text);
  if (!hits.length) return null;
  return el("div", { class: "correction-block compact" }, [
    el("div", { class: "co-line co-right" }, [
      el("span", { class: "co-tag" }, "Mejor"),
      el("span", { class: "es-text" }, hits[0].corrected)
    ]),
    el("p", { class: "co-explain" }, hits[0].why)
  ]);
}
