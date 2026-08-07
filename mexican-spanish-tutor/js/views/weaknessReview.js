// WEAKNESS REVIEW — a read-only snapshot over data that already exists:
// the six skill scores and the SRS's shakiest-mastery items. Nothing here
// is graded and nothing new is stored; it just points at what's worth
// practicing and links out to the mode that actually practices it.

import { store } from "../core/storage.js";
import { el, progressBar } from "../core/ui.js";
import { masteryLevel } from "../core/srs.js";

const SKILL_INFO = {
  speaking: { icon: "🗣️", label: "Speaking", link: "#/practice/conversation", linkLabel: "Practice conversation →" },
  listening: { icon: "👂", label: "Listening", link: "#/practice/listening", linkLabel: "Listening practice →" },
  reading: { icon: "📖", label: "Reading", link: "#/learn/dialogues", linkLabel: "Read a dialogue →" },
  writing: { icon: "✍️", label: "Writing", link: "#/practice/writing", linkLabel: "Writing practice →" },
  vocabulary: { icon: "🗂️", label: "Vocabulary", link: "#/learn/vocab", linkLabel: "Browse vocabulary →" },
  grammar: { icon: "🧩", label: "Grammar", link: "#/learn/grammar", linkLabel: "Grammar practice →" }
};

function typeLabel(type) {
  return { word: "Word", sentence: "Sentence pattern", dialogue: "Dialogue", story: "Story", roadmap: "Roadmap unit", gloss: "Saved phrase" }[type] || type;
}

export function renderWeaknessReview(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "📉 Weakness Review"),
      el("p", {}, "A snapshot of your skill scores and shakiest items — nothing here is graded, it's just pointing at what's worth practicing next.")
    ])
  );

  const scores = store.state.scores || {};
  const ranked = Object.keys(SKILL_INFO)
    .map((k) => ({ key: k, value: Math.max(0, Math.min(100, Math.round(scores[k] || 0))), ...SKILL_INFO[k] }))
    .sort((a, b) => a.value - b.value);

  const skillCard = el("div", { class: "card" }, [el("h3", { class: "card-title" }, "Skill scores — weakest first")]);
  ranked.forEach((s) => {
    skillCard.appendChild(
      el("div", { style: "margin-top:.7rem" }, [
        el("div", { class: "flex justify-between items-center", style: "gap:.5rem" }, [
          el("span", {}, `${s.icon} ${s.label} · ${s.value}`),
          el("a", { class: "btn btn-sm", href: s.link }, s.linkLabel)
        ]),
        progressBar(s.value)
      ])
    );
  });
  container.appendChild(skillCard);

  // Weakest items you've actually been graded on at least once — brand-new,
  // never-attempted items would trivially top a "weakest" list without
  // meaning anything.
  const srs = store.state.srs || {};
  const drilled = Object.entries(srs)
    .filter(([, item]) => (item.correct || 0) + (item.incorrect || 0) > 0)
    .map(([id, item]) => ({ id, type: item.type, mastery: masteryLevel(id) }))
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 8);

  const itemCard = el("div", { class: "card", style: "margin-top:1rem" }, [el("h3", { class: "card-title" }, "Shakiest drilled items")]);
  if (!drilled.length) {
    itemCard.appendChild(el("p", { class: "text-muted" }, "Nothing drilled yet — grade a few flashcards or a unit test, and the weakest ones show up here."));
  } else {
    drilled.forEach((d) => {
      itemCard.appendChild(
        el("div", { class: "flex justify-between items-center", style: "padding:.4rem 0;border-bottom:1px solid var(--border)" }, [
          el("span", {}, `${typeLabel(d.type)} · ${d.id.replace(/^\w+?_/, "")}`),
          el("span", { class: "text-muted" }, `${d.mastery}%`)
        ])
      );
    });
    itemCard.appendChild(el("a", { class: "btn btn-sm", style: "margin-top:.7rem", href: "#/review" }, "Go review these →"));
  }
  container.appendChild(itemCard);
}
