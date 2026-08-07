// LISTENING PRACTICE — a launcher, not a second copy of the listening UI:
// dialogues already have audio + a comprehension quiz (js/views/dialogues.js,
// reached via #/dialogues/:id) and stories already have audio + tap-to-define
// + comprehension questions (js/views/story.js). This view is the one place
// that points at both, so "practice listening" has a single door.

import { store } from "../core/storage.js";
import { el } from "../core/ui.js";
import { DIALOGUES } from "../data/dialogues.js";

function isDialogueDone(id) {
  return store.state.progress.dialoguesCompleted.includes(id);
}

export function renderListeningPractice(container) {
  container.appendChild(el("h3", { style: "margin:0 0 .3rem" }, "💬 Dialogues"));
  container.appendChild(el("p", { class: "text-muted", style: "margin:0 0 .6rem" }, "Listen at normal or slow speed, read along, then check comprehension."));
  const grid = el("div", { class: "grid grid-auto" });
  DIALOGUES.forEach((d) => {
    grid.appendChild(
      el("a", { class: "card card-link", href: `#/dialogues/${d.id}` }, [
        el("div", { class: "flex justify-between items-center" }, [
          el("span", { class: "badge badge-default" }, d.scenario),
          isDialogueDone(d.id) ? el("span", { class: "badge badge-success" }, "✓") : null
        ].filter(Boolean)),
        el("h3", { style: "margin:.5rem 0 .2rem" }, d.title),
        el("p", { class: "text-muted" }, d.titleEs)
      ])
    );
  });
  container.appendChild(grid);

  container.appendChild(el("h3", { style: "margin:1.5rem 0 .3rem" }, "📖 Stories"));
  container.appendChild(el("p", { class: "text-muted", style: "margin:0 0 .6rem" }, "Every story plays start to finish, with tap-to-define and comprehension questions once you're done."));
  container.appendChild(el("a", { class: "btn btn-primary", href: "#/practice/story" }, "Go to Story Mode →"));
}
