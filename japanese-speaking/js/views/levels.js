import { LEVEL_EXAMPLES } from "../data/levelExamples.js";
import { LEVELS } from "../data/grammar.js";
import { el } from "../core/ui.js";
import { speak } from "../core/audio.js";
import { getState } from "../core/storage.js";

let activeTopicId = LEVEL_EXAMPLES[0].id;

export function render(root) {
  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "🪜 Level Ladder — same prompt, four levels"),
      el("p", { class: "subtitle" }, "The exact same question, answered at Intermediate High, Advanced Low, Advanced Mid, and Advanced High. Read (and listen to) each tier in order — the annotations point out precisely what changed."),
    ])
  );

  const topicSelect = el(
    "select",
    {
      class: "select",
      onchange: (e) => { activeTopicId = e.target.value; render(root); },
    },
    LEVEL_EXAMPLES.map((t) => el("option", { value: t.id, selected: t.id === activeTopicId ? "selected" : null }, t.topic))
  );
  container.appendChild(el("div", { class: "card" }, [el("label", {}, ["Topic", topicSelect]), el("p", { class: "muted" }, LEVEL_EXAMPLES.find((t) => t.id === activeTopicId).topicEn)]));

  const topic = LEVEL_EXAMPLES.find((t) => t.id === activeTopicId);
  const ladder = el("div", { class: "ladder" });
  LEVELS.forEach((lvl) => {
    const tier = topic.tiers[lvl.id];
    const card = el("div", { class: "card ladder-tier", style: `border-left:4px solid ${lvl.color}` });
    card.appendChild(
      el("div", { class: "ladder-tier-head" }, [
        el("span", { class: "cat-tag", style: `background:${lvl.color};color:#fff` }, lvl.id),
        el("strong", {}, lvl.label),
        el("button", { class: "icon-btn small", title: "Listen", onclick: () => speak(tier.jp, { rate: getState().settings.rate }) }, "🔊"),
      ])
    );
    card.appendChild(el("p", { class: "model-jp", lang: "ja" }, tier.jp));
    card.appendChild(el("p", { class: "muted small" }, tier.en));
    const notesList = el("ul", { class: "tip-list ladder-notes" });
    tier.notes.forEach((n) => notesList.appendChild(el("li", {}, n)));
    card.appendChild(notesList);
    ladder.appendChild(card);
  });
  container.appendChild(ladder);

  container.appendChild(
    el("div", { class: "card" }, [
      el("h2", {}, "How to use this page"),
      el("p", { class: "muted" }, "Pick a topic close to something you'd actually be asked. Read the IH tier first — that's roughly your floor. Then read AL and AM, noticing exactly which connector or grammar structure got added at each step. Finally read AH out loud, then try answering the same topic yourself before checking Paragraph Practice."),
    ])
  );

  root.innerHTML = "";
  root.appendChild(container);
}
