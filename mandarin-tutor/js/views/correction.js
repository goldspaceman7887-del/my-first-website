// CORRECTION MODE — write Mandarin, get mistakes corrected with an
// explanation, the native version, the literal meaning of your version,
// and a natural conversational version. Never a flat "wrong."

import { store, todayISO } from "../core/storage.js";
import { el, toast } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday } from "../core/gamification.js";
import { checkText } from "../data/mistakePatterns.js";

export function renderCorrection(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "✍️ Correction Mode"),
      el("p", {}, "Write a sentence in Mandarin. We'll check it against the most common English-speaker mistakes and explain what to fix — with the reasoning, not just a red X.")
    ])
  );

  const ta = el("textarea", { placeholder: "在这里写中文句子... (write a Chinese sentence here)" });
  container.appendChild(ta);
  container.appendChild(el("button", { class: "btn btn-primary", onclick: check }, "Check my Mandarin"));

  const results = el("div", { style: "margin-top:1rem" });
  container.appendChild(results);

  function check() {
    const text = ta.value.trim();
    if (!text) { toast("Write something first.", { type: "error" }); return; }
    const hits = checkText(text);
    results.innerHTML = "";

    if (hits.length === 0) {
      results.appendChild(
        el("div", { class: "feedback-block correct" }, [
          el("p", { style: "font-weight:700" }, "No common mistakes detected!"),
          el("p", {}, "That doesn't guarantee it's perfect — this is a rule-based checker for the highest-frequency errors — but it's a great sign.")
        ])
      );
    } else {
      hits.forEach((h) => {
        results.appendChild(
          el("div", { class: "correction-block" }, [
            el("div", { class: "co-orig hanzi" }, text),
            el("div", { class: "co-fixed hanzi" }, h.correctVersion),
            el("div", { class: "co-literal" }, `Literal reading of your version: ${h.literal}`),
            el("div", { class: "co-explain" }, h.mistakeExplained),
            el("p", { class: "text-muted", style: "margin-top:.4rem" }, [el("strong", {}, "Rule: "), h.rule]),
            el("p", { class: "text-muted" }, [el("strong", {}, "Natural, conversational version: "), h.conversational]),
            el("div", { class: "flex gap-2 flex-wrap", style: "margin-top:.4rem" }, h.examples.map((ex) => el("span", { class: "badge badge-default" }, ex))),
            el("button", { class: "play-btn", style: "width:34px;height:34px;margin-top:.4rem", onclick: () => audioEngine.speak(h.conversational.split(" (")[0]) }, "🔊")
          ])
        );
      });
    }

    registerStudyToday();
    store.state.progress.correctionSessions.push({ date: todayISO(), count: hits.length });
    addXP(hits.length > 0 ? 6 : 4, "Correction Mode session");
    store.save();
  }
}
