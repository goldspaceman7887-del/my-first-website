// WRITING COACH / CORRECTION MODE — write a sentence in Spanish, get
// mistakes corrected with: your version, the corrected version, a natural
// Mexican version, and a plain-English explanation. Never a flat "wrong."

import { store, todayISO } from "../core/storage.js";
import { correctionBlock } from "../core/feedback.js";
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
      // One block per session showing your sentence corrected, then each
      // individual fix with its explanation.
      results.appendChild(correctionBlock(text));
    }

    registerStudyToday();
    store.state.progress.correctionSessions.push({ date: todayISO(), count: hits.length });
    updateSkillScore("writing", hits.length > 0 ? 1 : 3);
    addXP(hits.length > 0 ? 6 : 4, "Writing Coach session");
    store.save();
  }
}
