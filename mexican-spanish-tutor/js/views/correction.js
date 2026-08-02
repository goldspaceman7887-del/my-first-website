// WRITING COACH / CORRECTION MODE — write a sentence in Spanish, get
// mistakes corrected with: your version, the corrected version, a natural
// Mexican version, and a plain-English explanation. Never a flat "wrong."

import { store, todayISO } from "../core/storage.js";
import { el, toast } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { checkText } from "../data/mistakePatterns.js";

export function renderCorrection(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "✍️ Writing Coach"),
      el("p", {}, "Write a sentence in Spanish. We'll check it against the most common English-speaker mistakes and show your version, the corrected version, a natural Mexican version, and why — never just a red X.")
    ])
  );

  const ta = el("textarea", { placeholder: "Escribe una oración en español aquí..." });
  container.appendChild(ta);
  container.appendChild(el("button", { class: "btn btn-primary", onclick: check }, "Revisar mi español"));

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
          el("p", { style: "font-weight:700" }, "¡No se detectaron errores comunes!"),
          el("p", {}, "That doesn't guarantee it's perfect — this is a rule-based checker for the highest-frequency errors — but it's a great sign.")
        ])
      );
    } else {
      hits.forEach((h) => {
        results.appendChild(
          el("div", { class: "correction-block" }, [
            el("h4", { style: "margin:0 0 .3rem" }, "My version"),
            el("div", { class: "co-orig es-text" }, text),
            el("h4", { style: "margin:.6rem 0 .3rem" }, "Corrected"),
            el("div", { class: "co-fixed es-text" }, h.correctVersion),
            el("h4", { style: "margin:.6rem 0 .3rem" }, "Natural Mexican version"),
            el("div", { class: "co-natural" }, h.natural),
            el("div", { class: "co-explain", style: "margin-top:.4rem" }, h.mistakeExplained),
            el("p", { class: "text-muted", style: "margin-top:.4rem" }, [el("strong", {}, "Rule: "), h.rule]),
            el("div", { class: "flex gap-2 flex-wrap", style: "margin-top:.4rem" }, h.examples.map((ex) => el("span", { class: "badge badge-default" }, ex))),
            el("button", { class: "play-btn", style: "width:34px;height:34px;margin-top:.4rem", onclick: () => audioEngine.speak(h.natural.split(" (")[0]) }, "🔊")
          ])
        );
      });
    }

    registerStudyToday();
    store.state.progress.correctionSessions.push({ date: todayISO(), count: hits.length });
    updateSkillScore("writing", hits.length > 0 ? 1 : 3);
    addXP(hits.length > 0 ? 6 : 4, "Writing Coach session");
    store.save();
  }
}
