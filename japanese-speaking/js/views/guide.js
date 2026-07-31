import { el } from "../core/ui.js";

export function render(root) {
  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "🧭 The Guide: Intermediate High → Advanced High"),
      el("p", { class: "subtitle" }, "What actually changes between these two levels, and why this site is built the way it is."),
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
      "What ACTFL is actually testing at each level",
      `<p><strong>Intermediate High</strong> speakers can handle most everyday situations with some ease, produce full sentences, and can string a few sentences together — but discourse often breaks down under complication, and paragraph-length narration is inconsistent.</p>
       <p><strong>Advanced High</strong> speakers narrate and describe in <em>all major time frames</em> with good control, sustain <em>paragraph-length connected discourse</em>, handle a task with an unexpected complication, and use vocabulary/circumlocution well enough that a native speaker rarely has to guess at meaning. Errors exist but almost never interfere with communication.</p>
       <p>The single biggest structural gap between IH and AH is exactly what you named: <strong>connecting sentences into paragraphs</strong>. IH speakers produce accurate sentences in relative isolation. AH speakers produce sentences that are explicitly linked — with connectors, referencing back to earlier ideas, and building toward a point — for 5+ sentences at a stretch, including when the topic gets complicated.</p>`
    )
  );

  container.appendChild(
    section(
      "The 4 things that get you from IH to AH",
      `<ol>
        <li><strong>Cohesion devices (接続表現).</strong> Cause, result, contrast, condition, example, and summary connectors — used varied and naturally, not just そして/でも repeated. This is the Connector Lab.</li>
        <li><strong>Sustained turns.</strong> Practicing speaking for 60-120 seconds uninterrupted on one topic, not answering in single sentences. This is Paragraph Practice.</li>
        <li><strong>Handling complications.</strong> AH-level OPI tasks almost always include an unexpected twist (a canceled flight, a scheduling conflict, a mistake). You need reps narrating a problem <em>and</em> its resolution in one breath. Several Paragraph Practice topics are built around this.</li>
        <li><strong>Input at the level you're producing.</strong> Shadowing model paragraphs trains your ear and mouth on how a fluent speaker actually threads connectors through a paragraph, at natural speed.</li>
      </ol>`
    )
  );

  container.appendChild(
    section(
      "How to use this site over 8 weeks",
      `<ul>
        <li><strong>Weeks 1-2:</strong> Drill connectors daily in the Connector Lab until quiz accuracy is 85%+. Shadow 1-2 model paragraphs a day.</li>
        <li><strong>Weeks 3-4:</strong> Start Paragraph Practice on Narration topics. Record yourself. Read the feedback — sentence count, connector variety, duration.</li>
        <li><strong>Weeks 5-6:</strong> Add Comparison, Opinion, and Complication-resolution topics. These are harder because you have to hold a structure (thesis → reasons → counterpoint → conclusion) while speaking.</li>
        <li><strong>Weeks 7-8:</strong> Remove the scaffold. Speak on a random topic for 2 minutes with no prep, the way an OPI actually works. Self-score with the Rubric every week and watch the trend.</li>
      </ul>
      <p>See the full week-by-week task list on the <a href="#/roadmap">Roadmap page</a>.</p>`
    )
  );

  container.appendChild(
    section(
      "Daily habit that matters most",
      `<p>20-30 minutes a day beats 3 hours once a week. The specific habit that closes the IH→AH gap fastest: <strong>never answer a practice prompt in one sentence.</strong> Force yourself to add "and here's why," "but on the other hand," or "for example" — even in easy conversations outside this app. Connectors are a muscle, not a fact you memorize once.</p>`
    )
  );

  root.innerHTML = "";
  root.appendChild(container);
}
