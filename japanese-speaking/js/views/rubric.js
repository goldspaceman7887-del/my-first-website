import { el, toast } from "../core/ui.js";
import { getState, saveRubricAssessment } from "../core/storage.js";

const DIMENSIONS = [
  {
    id: "paragraph",
    title: "Paragraph-length discourse",
    desc: "Do you sustain 5+ linked sentences, or do you fall back to short, disconnected statements?",
    levels: ["I mostly give 1-2 sentence answers", "I can string 3-4 sentences, but they feel like a list", "I sustain 5+ sentences that clearly connect", "I sustain long stretches with no loss of cohesion"],
  },
  {
    id: "timeframes",
    title: "Control across time frames",
    desc: "Can you narrate/describe accurately in past, present, and future/hypothetical with good verb control?",
    levels: ["I'm shaky outside the present tense", "I can handle one other time frame with effort", "I handle past, present, and hypothetical with good control", "I move between time frames fluidly mid-paragraph"],
  },
  {
    id: "complication",
    title: "Handling a complication",
    desc: "When a task includes an unexpected twist, can you talk your way through resolving it?",
    levels: ["I get stuck or switch to English/simple phrases", "I can describe the problem but not really resolve it in speech", "I narrate the problem and resolution with reasonable ease", "I handle complications the way a native speaker narrates a story"],
  },
  {
    id: "cohesion",
    title: "Cohesion & connector variety",
    desc: "Do you use a range of connectors (not just そして/でも), or does it sound like a list of sentences?",
    levels: ["I rarely use connectors, or repeat the same 1-2", "I use a few connector types but not smoothly", "I use 3+ connector categories naturally within a paragraph", "My connector use is varied, precise, and register-appropriate"],
  },
  {
    id: "vocab",
    title: "Vocabulary & circumlocution",
    desc: "When you don't know a word, can you talk around it, or does the sentence break down?",
    levels: ["I stall or switch to English when I lack a word", "I can sometimes describe around a gap", "I circumlocute smoothly most of the time", "Listeners rarely notice a vocabulary gap"],
  },
  {
    id: "accuracy",
    title: "Grammatical accuracy",
    desc: "Are basic/complex structures nearly always correct, with only occasional patterned errors?",
    levels: ["Frequent errors interfere with meaning", "Basic structures solid, complex ones inconsistent", "Nearly always accurate; occasional patterned slips don't interfere", "Consistently accurate, including complex structures"],
  },
  {
    id: "fluency",
    title: "Fluency & pacing",
    desc: "Can you sustain speech at a reasonable pace without long pauses or falling silent?",
    levels: ["Frequent long pauses break the flow", "Noticeable hesitation but I recover", "Mostly smooth with brief natural pauses", "Smooth, native-like pacing throughout"],
  },
];

let currentScores = {};

function levelLabel(avg) {
  if (avg < 2) return { label: "Intermediate High territory", cls: "warn" };
  if (avg < 3) return { label: "Advanced Mid — solid progress, keep pushing", cls: "info" };
  if (avg < 3.5) return { label: "Advanced High — this is your target zone! 🎯", cls: "good" };
  return { label: "Superior-leaning — excellent control", cls: "good" };
}

export function render(root) {
  const state = getState();
  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "📋 ACTFL Advanced High Self-Assessment"),
      el("p", { class: "subtitle" }, "After a recording session, rate yourself honestly on each dimension (1 = still Intermediate, 4 = exceeds Advanced High). Use this every couple of weeks to track real movement."),
    ])
  );

  const form = el("div", { class: "card rubric-form" });
  DIMENSIONS.forEach((d) => {
    currentScores[d.id] = currentScores[d.id] || 2;
    const block = el("div", { class: "rubric-dimension" });
    block.appendChild(el("h3", {}, d.title));
    block.appendChild(el("p", { class: "muted small" }, d.desc));
    const levelRow = el("div", { class: "rubric-levels" });
    d.levels.forEach((lvlText, idx) => {
      const value = idx + 1;
      const btn = el(
        "button",
        {
          class: `rubric-level ${currentScores[d.id] === value ? "active" : ""}`,
          onclick: () => {
            currentScores[d.id] = value;
            render(root);
          },
        },
        [el("div", { class: "rubric-level-num" }, String(value)), el("div", { class: "rubric-level-text" }, lvlText)]
      );
      levelRow.appendChild(btn);
    });
    block.appendChild(levelRow);
    form.appendChild(block);
  });

  const avg = Object.values(currentScores).reduce((a, b) => a + b, 0) / DIMENSIONS.length;
  const info = levelLabel(avg);
  form.appendChild(
    el("div", { class: `rubric-result ${info.cls}` }, [
      el("div", { class: "rubric-result-score" }, avg.toFixed(2)),
      el("div", {}, info.label),
    ])
  );

  const saveBtn = el("button", { class: "btn primary" }, "Save this self-assessment");
  saveBtn.addEventListener("click", () => {
    saveRubricAssessment({ ...currentScores });
    toast("Self-assessment saved — track it over time on your dashboard.", { type: "success" });
    currentScores = {};
    render(root);
  });
  form.appendChild(saveBtn);
  container.appendChild(form);

  if (state.rubricAssessments.length > 0) {
    const historyCard = el("div", { class: "card" });
    historyCard.appendChild(el("h2", {}, "History"));
    const list = el("div", { class: "recording-list" });
    state.rubricAssessments.slice(0, 8).forEach((r) => {
      list.appendChild(
        el("div", { class: "recording-row" }, [
          el("div", {}, new Date(r.ts).toLocaleDateString()),
          el("div", { class: `badge ${levelLabel(r.average).cls}` }, `${r.average.toFixed(2)} — ${levelLabel(r.average).label}`),
        ])
      );
    });
    historyCard.appendChild(list);
    container.appendChild(historyCard);
  }

  root.innerHTML = "";
  root.appendChild(container);
}
