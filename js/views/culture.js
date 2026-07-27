import { store } from "../core/storage.js";
import { el, toast } from "../core/ui.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { CULTURE } from "../data/culture.js";

const CATEGORY_LABELS = {
  food: "🍽️ Comida",
  social: "🤝 Vida social",
  work: "💼 Trabajo",
  university: "🎓 Universidad",
  housing: "🏠 Vivienda",
  travel: "🚄 Transporte",
  healthcare: "⚕️ Sanidad",
  government: "🏛️ Administración",
  festivals: "🎉 Fiestas",
  modern: "📱 España moderna"
};

function parseQuery() {
  return new URLSearchParams((window.location.hash.split("?")[1]) || "");
}

export function renderCulture(container, params) {
  if (params && params.id) return renderCultureDetail(container, params.id);

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🇪🇸 Inmersión cultural en España"),
      el("p", {}, "Todo lo que necesitas entender para vivir, trabajar y hacer amigos en España sin sorpresas.")
    ])
  );

  const scores = store.state.progress.cultureQuizScores;
  const completed = store.state.progress.cultureCompleted.length;
  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "flex justify-between items-center" }, [
        el("strong", {}, `Preparación para España: ${Math.round((completed / CULTURE.length) * 100)}%`),
        el("span", { class: "badge badge-default" }, `${completed} / ${CULTURE.length} temas`)
      ]),
      el("div", { class: "progress-bar", style: "margin-top:.5rem" }, [el("div", { class: "progress-bar-fill", style: `width:${(completed / CULTURE.length) * 100}%` })])
    ])
  );

  Object.entries(CATEGORY_LABELS).forEach(([cat, label]) => {
    const items = CULTURE.filter((c) => c.category === cat);
    if (!items.length) return;
    container.appendChild(el("h2", { style: "margin-top:1.5rem" }, label));
    const grid = el("div", { class: "grid grid-3" });
    items.forEach((c) => {
      const done = store.state.progress.cultureCompleted.includes(c.id);
      grid.appendChild(
        el("a", { class: "card card-link", href: `#/culture/${c.id}` }, [
          el("div", { class: "flex justify-between items-center" }, [
            done ? el("span", { class: "badge badge-success" }, "✓") : el("span", { class: "badge badge-default" }, "Nuevo")
          ]),
          el("h3", { style: "margin:.4rem 0" }, c.title),
          el("p", { class: "text-muted", style: "font-size:.85rem" }, c.summary)
        ])
      );
    });
    container.appendChild(grid);
  });
}

function renderCultureDetail(container, id) {
  const c = CULTURE.find((x) => x.id === id);
  if (!c) {
    container.appendChild(el("div", { class: "card" }, "Tema no encontrado."));
    return;
  }
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("a", { href: "#/culture", class: "text-muted" }, "← Cultura"),
      el("h1", { style: "margin-top:.5rem" }, c.title),
      el("span", { class: "badge badge-default" }, CATEGORY_LABELS[c.category] || c.category)
    ])
  );

  const contentBody = el("div", { style: "line-height:1.75" });
  c.content.split("\n\n").forEach((p) => contentBody.appendChild(el("p", {}, p)));
  container.appendChild(el("div", { class: "card" }, [contentBody]));

  if (c.comparison) {
    container.appendChild(
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "🌍 España vs. Reino Unido vs. Estados Unidos"),
        el("div", { class: "compare-grid" }, [
          el("div", { class: "compare-col" }, [el("h4", {}, "🇪🇸 España"), el("p", {}, c.comparison.spain)]),
          el("div", { class: "compare-col" }, [el("h4", {}, "🇬🇧 Reino Unido"), el("p", {}, c.comparison.uk)]),
          el("div", { class: "compare-col" }, [el("h4", {}, "🇺🇸 Estados Unidos"), el("p", {}, c.comparison.us)])
        ])
      ])
    );
  }

  const quizCard = el("div", { class: "card" }, [el("div", { class: "card-title" }, "Comprueba lo que has aprendido")]);
  let correct = 0;
  c.quiz.forEach((q, i) => {
    const qWrap = el("div", { style: "margin-bottom:1rem" }, [el("p", { style: "font-weight:700" }, `${i + 1}. ${q.q}`)]);
    const list = el("div", { class: "option-list" });
    q.options.forEach((opt) => {
      list.appendChild(
        el(
          "button",
          {
            class: "option-btn",
            onclick: (e) => {
              list.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));
              const isCorrect = opt === q.answer;
              e.target.classList.add(isCorrect ? "correct" : "incorrect");
              if (!isCorrect) Array.from(list.children).find((b) => b.textContent === q.answer)?.classList.add("correct");
              if (isCorrect) {
                correct++;
                finishIfDone();
              }
            }
          },
          opt
        )
      );
    });
    qWrap.appendChild(list);
    quizCard.appendChild(qWrap);
  });
  container.appendChild(quizCard);

  let done = false;
  function finishIfDone() {
    if (done) return;
    done = true;
    if (!store.state.progress.cultureCompleted.includes(c.id)) store.state.progress.cultureCompleted.push(c.id);
    const scores = store.state.progress.cultureQuizScores;
    if (!scores[c.id]) scores[c.id] = { attempts: 0, best: 0 };
    scores[c.id].attempts++;
    scores[c.id].best = Math.max(scores[c.id].best, 1);
    addXP(10, `Cultura: ${c.title}`);
    updateSkillScore("cultural", 2);
    store.save();
    toast("¡Tema cultural completado! +10 XP", { icon: "🇪🇸" });
  }
}
