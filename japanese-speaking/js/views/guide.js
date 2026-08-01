import { el } from "../core/ui.js";

export function render(root) {
  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "🧭 The Guide: mid-Intermediate High → Advanced High"),
      el("p", { class: "subtitle" }, "You're already partway from Intermediate High to Advanced Low. Here's the specific path onward, with two explicit checkpoints before Advanced High." ),
    ])
  );

  const section = (title, html) => {
    const c = el("section", { class: "card guide-section" });
    c.appendChild(el("h2", {}, title));
    c.appendChild(el("div", { class: "guide-body", html }));
    return c;
  };

  container.appendChild(
    section(
      "The three levels between you and the goal",
      `<p><strong>Advanced Low</strong> — you can narrate/describe in past, present, and future with only some breakdown, and you're beginning to handle a complication without switching to English, but it takes visible effort.</p>
       <p><strong>Advanced Mid</strong> — narration is smoother and more elaborated, you can hold a two-sided argument (concede a counterpoint, then rebut it), and you deploy a wider range of cause/result/contrast structures without hunting for words.</p>
       <p><strong>Advanced High</strong> — you sustain long, unscaffolded turns; you switch register deliberately (a formal aside, then back to casual); you narrate complications the way a native speaker tells a story, including their own reflection on it; errors exist but essentially never interfere with meaning.</p>
       <p>Since you're already close to Advanced Low, this plan compresses the first stretch and gets demanding fast — the goal is Advanced High in 8 weeks, not a gentle ramp.</p>`
    )
  );

  container.appendChild(
    section(
      "What actually separates each level (concretely)",
      `<ol>
        <li><strong>Cohesion devices (接続表現).</strong> Varied connectors — not just そして/でも repeated. <a href="#/connectors">Connector Lab</a>.</li>
        <li><strong>Sentence-internal grammar precision.</strong> ~のに and わけだ mark you as AL; ~ものの, つつある, ばかりに mark AM; ~とはいえ, ざるを得ない, かねない, がたい, and deliberate register-switching mark AH. <a href="#/grammar">Grammar Ladder</a> has all 24, leveled, with example sentences.</li>
        <li><strong>Sustained turns.</strong> 60-120 seconds uninterrupted, not one-line answers. <a href="#/practice">Paragraph Practice</a>.</li>
        <li><strong>Handling complications and taking a stance.</strong> AH-level tasks almost always include an unexpected twist or ask you to argue a position while acknowledging the other side.</li>
        <li><strong>Hearing the target.</strong> <a href="#/levels">Level Ladder</a> shows the exact same prompt answered at all 4 levels side by side, annotated — the fastest way to internalize what "sounds like AH" actually means versus what you're doing now.</li>
      </ol>`
    )
  );

  container.appendChild(
    section(
      "How to use this site over 8 weeks",
      `<ul>
        <li><strong>Week 1:</strong> Lock IH grammar so it costs zero thinking time; push connector range past typical IH usage.</li>
        <li><strong>Week 2 — Advanced Low checkpoint:</strong> sustain 4-5 sentence narration through a real complication.</li>
        <li><strong>Weeks 3-4:</strong> Two-sided reasoning, causative-passive, ばかりに/からといって — precision cause and consequence.</li>
        <li><strong>Week 5 — Advanced Mid checkpoint:</strong> record an opinion + comparison cold, self-score 3.0+.</li>
        <li><strong>Weeks 6-7:</strong> AH-tier grammar (とはいえ, ざるを得ない, かねない, がたい), deliberate register switching, scaffolds removed entirely.</li>
        <li><strong>Week 8 — Advanced High checkpoint:</strong> full mock session, no notes, scored against the complete rubric.</li>
      </ul>
      <p>Full week-by-week task list: <a href="#/roadmap">Roadmap page</a>.</p>`
    )
  );

  container.appendChild(
    section(
      "The habit that matters most",
      `<p>30-40 focused minutes a day beats a long session once a week. The single highest-leverage habit: <strong>never answer in one sentence, and never let a grammar structure stay passive knowledge.</strong> If you learn ~ばかりに on the Grammar Ladder, use it out loud that same day — in this app or in real conversation. Structures you can recognize but haven't produced under time pressure don't count toward Advanced level speech.</p>`
    )
  );

  root.innerHTML = "";
  root.appendChild(container);
}
