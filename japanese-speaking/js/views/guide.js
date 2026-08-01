import { el } from "../core/ui.js";

export function render(root) {
  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "🧭 The Guide: mid-Intermediate High → Advanced Mid in 3 months"),
      el("p", { class: "subtitle" }, "You're already partway from Intermediate High to Advanced Low. This is a full, intensive 12-week grammar-and-speaking curriculum through Advanced Mid, with Advanced High as the immediate next phase — not a gentle ramp." ),
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
      "Why 3 months, and why it's intense",
      `<p>Full command of Advanced Mid grammar and discourse — 36 sentence-internal structures plus the full connector set, all deployable under time pressure — is a realistic 3-month target if you practice daily, not a few times a week. This plan assumes 45-60 minutes a day, front-loaded with new grammar in the first 8 weeks, then integration and stress-testing in the last 4. It is not paced for comfort.</p>
       <p>Advanced High is deliberately <em>not</em> squeezed into these 12 weeks. It's a smaller set (8 structures) but a harder skill — deliberate register control — and trying to rush it on top of 36 new AM structures would weaken both. Finish AM properly, then go straight into the AH phase with real command underneath you.</p>`
    )
  );

  container.appendChild(
    section(
      "The three levels between you and Advanced Mid",
      `<p><strong>Advanced Low</strong> — you narrate/describe in past, present, and future with only some breakdown, and you're beginning to handle a complication without switching to English, but it takes visible effort. 14 grammar structures.</p>
       <p><strong>Advanced Mid</strong> — narration is smoother and more elaborated, you can hold a two-sided argument (concede a counterpoint, then rebut it), and you deploy a wide range of cause/result/contrast structures without hunting for words. 16 grammar structures — the bulk of this plan.</p>
       <p><strong>Advanced High</strong> (the phase after this plan) — you sustain long, unscaffolded turns; you switch register deliberately; you narrate complications the way a native speaker tells a story, including their own reflection on it. 8 grammar structures, but the hardest to internalize.</p>`
    )
  );

  container.appendChild(
    section(
      "What actually separates each level (concretely)",
      `<ol>
        <li><strong>Cohesion devices (接続表現).</strong> Varied connectors — not just そして/でも repeated. <a href="#/connectors">Connector Lab</a>, ~40 items.</li>
        <li><strong>Sentence-internal grammar precision.</strong> ~のに/わけだ/として mark AL; ~ものの/つつある/ばかりに/にほかならない mark AM; ~とはいえ/ざるを得ない/かねない/がたい and deliberate register-switching mark AH. <a href="#/grammar">Grammar Ladder</a> has all 44, leveled, with example sentences.</li>
        <li><strong>Sustained turns.</strong> 60-120 seconds uninterrupted, not one-line answers. <a href="#/practice">Paragraph Practice</a>.</li>
        <li><strong>Handling complications and taking a stance.</strong> AM/AH-level tasks almost always include an unexpected twist or ask you to argue a position while acknowledging the other side.</li>
        <li><strong>Hearing the target.</strong> <a href="#/levels">Level Ladder</a> shows the exact same prompt answered at all 4 levels side by side, annotated — the fastest way to internalize what each level actually sounds like.</li>
      </ol>`
    )
  );

  container.appendChild(
    section(
      "How the 12 weeks break down",
      `<ul>
        <li><strong>Week 1:</strong> Lock all 6 IH structures so they cost zero thinking time.</li>
        <li><strong>Weeks 2-4 — Advanced Low:</strong> all 14 AL structures in 3 dense blocks, then a hard checkpoint — record cold, self-score 2.7+.</li>
        <li><strong>Weeks 5-8 — Advanced Mid:</strong> all 16 AM structures in 4 blocks (opinion reasoning → precision cause/pushback → drawn-out complications → formal framing), checkpoint at week 8 — self-score 3.0+.</li>
        <li><strong>Week 9 — Integration:</strong> stop learning new grammar, force all 36 items to work together under time pressure, begin register-switching drills.</li>
        <li><strong>Week 10 — Stress test:</strong> fully unscaffolded, randomized, back-to-back mock OPI runs.</li>
        <li><strong>Week 11 — Targeted repair:</strong> drill whatever week 10 exposed as still weak.</li>
        <li><strong>Week 12 — Advanced Mid mastery checkpoint:</strong> full 5-function mock session, 90%+ grammar overall, self-score 3.2+. Then straight into the Advanced High extension plan.</li>
      </ul>
      <p>Full week-by-week task list, including exact grammar assignments per week: <a href="#/roadmap">Roadmap page</a>.</p>`
    )
  );

  container.appendChild(
    section(
      "The habit that matters most",
      `<p>45-60 focused minutes a day beats a long session once a week, and at this pace, skipping days compounds fast — you're covering roughly 3 new grammar structures every week for two months straight. The single highest-leverage habit: <strong>never let a grammar structure stay passive knowledge.</strong> If you learn ~ばかりに on the Grammar Ladder, use it out loud that same day. Structures you can recognize on a quiz but haven't produced under time pressure don't count toward Advanced-level speech — and at this density, passive knowledge piles up fast if you let it.</p>`
    )
  );

  root.innerHTML = "";
  root.appendChild(container);
}
