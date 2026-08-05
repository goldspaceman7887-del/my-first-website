import { store } from "../core/storage.js";
import { reviewCounts, retentionRate } from "../core/srs.js";
import { xpProgressToNextLevel, ACHIEVEMENTS } from "../core/gamification.js";
import { el } from "../core/ui.js";
import { CURRICULUM_UNITS } from "../data/curriculum.js";
import { ROADMAP_UNITS } from "../data/roadmap.js";

function scoreRing(pct, label, color) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, pct)) / 100) * c;
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 84 84");
  svg.setAttribute("class", "score-ring");
  svg.innerHTML = `
    <circle cx="42" cy="42" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="8"/>
    <circle cx="42" cy="42" r="${r}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${offset}" transform="rotate(-90 42 42)"/>
    <text x="42" y="47" text-anchor="middle" font-size="18" font-weight="800" fill="var(--text)">${Math.round(pct)}</text>
  `;
  return el("div", { class: "score-ring-wrap" }, [svg, el("div", { class: "score-ring-label" }, label)]);
}

function heatmap(studyDates) {
  const set = new Set(studyDates);
  const days = [];
  const today = new Date();
  for (let i = 111; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push(iso);
  }
  const grid = el("div", { class: "heatmap" });
  days.forEach((iso) => {
    const active = set.has(iso);
    grid.appendChild(el("div", { class: "heatmap-cell", "data-level": active ? "3" : "0", title: iso }));
  });
  return grid;
}

function nextLesson() {
  const completed = new Set(store.state.progress.lessonsCompleted);
  for (const unit of CURRICULUM_UNITS) {
    for (const lesson of unit.lessons) {
      if (!completed.has(lesson.id)) return { unit, lesson };
    }
  }
  return null;
}

export function renderDashboard(container) {
  const p = store.state.profile;
  const s = store.state.scores;
  const counts = reviewCounts();
  const lvl = xpProgressToNextLevel();
  const next = nextLesson();
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => store.state.achievements.unlocked.includes(a.id));

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, `¡Hola${p.name ? ", " + p.name : ""}! 👋 Welcome back`),
      el("p", {}, "This is your home base. Not sure what to do? Just tap the big button below — it always points you to what's next."),
      el("p", { class: "text-faint" }, "Tu camino del español de España, de A0 a Advanced Low. Vamos a ello.")
    ])
  );

  const statGrid = el("div", { class: "grid grid-4" }, [
    el("div", { class: "card stat-card" }, [
      el("span", { class: "stat-icon" }, "🔥"),
      el("span", { class: "stat-value" }, String(p.streak || 0)),
      el("span", { class: "stat-label" }, "Racha de días")
    ]),
    el("div", { class: "card stat-card" }, [
      el("span", { class: "stat-icon" }, "⚡"),
      el("span", { class: "stat-value" }, String(p.xp || 0)),
      el("span", { class: "stat-label" }, "XP total")
    ]),
    el("div", { class: "card stat-card" }, [
      el("span", { class: "stat-icon" }, "📈"),
      el("span", { class: "stat-value" }, p.level || "A0"),
      el("span", { class: "stat-label" }, lvl.isMax ? "¡Nivel máximo!" : `${lvl.pct}% hacia ${lvl.nextLevel}`)
    ]),
    el("div", { class: "card stat-card" }, [
      el("span", { class: "stat-icon" }, "🔁"),
      el("span", { class: "stat-value" }, String(counts.dueToday)),
      el("span", { class: "stat-label" }, "Repasos pendientes")
    ])
  ]);
  container.appendChild(statGrid);

  const mid = el("div", { class: "grid grid-2" });

  // Next lesson card
  const nextCard = el("div", { class: "card" }, [el("div", { class: "card-title" }, "👉 Do this next / Siguiente paso")]);
  if (next) {
    nextCard.appendChild(el("p", { class: "text-muted" }, `${next.unit.level} · ${next.unit.title}`));
    nextCard.appendChild(el("h3", {}, next.lesson.title));
    nextCard.appendChild(el("p", {}, next.lesson.description || ""));
    nextCard.appendChild(
      el("a", { class: "btn btn-primary btn-lg", href: next.lesson.href || "#/vocabulary" }, "Continue / Continuar →")
    );
  } else {
    nextCard.appendChild(el("p", {}, "¡Has completado todas las lecciones del currículo base! Explora Repaso y Cultura para seguir avanzando."));
  }
  mid.appendChild(nextCard);

  // Review due card
  const reviewCard = el("div", { class: "card" }, [
    el("div", { class: "card-title" }, "🔁 Today's review / Repaso de hoy"),
    el("p", { class: "text-muted" }, `You have ${counts.dueToday} word${counts.dueToday === 1 ? "" : "s"} ready to review right now (a few minutes, tops).`),
    el(
      "div",
      { class: "btn-row" },
      [
        el("a", { class: "btn btn-primary btn-lg", href: "#/review" }, "Start review / Empezar"),
        el("span", { class: "badge badge-default" }, `Retention: ${retentionRate()}%`)
      ]
    )
  ]);
  mid.appendChild(reviewCard);
  container.appendChild(mid);

  // Roadmap nudge — the Duolingo-style path lives on its own view; this just
  // says what to do next on it, same as the sibling apps' dashboards do.
  const roadmapDone = new Set([
    ...(store.state.progress.roadmapUnitsCompleted || []),
    ...(store.state.progress.roadmapUnitsSkipped || [])
  ]);
  const roadmapUnitsDone = ROADMAP_UNITS.filter((u) => roadmapDone.has(u.id)).length;
  const nextRoadmapUnit = ROADMAP_UNITS.find((u) => !roadmapDone.has(u.id));
  const tookLevelTest = (store.state.progress.levelTests || []).length > 0;
  container.appendChild(
    el("div", { class: "card", style: "border-left:3px solid var(--accent)" }, [
      el("div", { class: "card-title" }, !tookLevelTest
        ? "📊 Start by finding your level"
        : nextRoadmapUnit ? `🗺️ Roadmap: next up — ${nextRoadmapUnit.title}` : "🎉 Roadmap complete"),
      el("p", { class: "text-muted" }, !tookLevelTest
        ? "Take the two-minute Level Test so the roadmap starts in the right place."
        : nextRoadmapUnit
          ? `${nextRoadmapUnit.icon} ${nextRoadmapUnit.subtitle} — 8 sentences, a grammar note, then a 10-question unit test. (${roadmapUnitsDone}/${ROADMAP_UNITS.length} units done)`
          : "You've finished every unit on the roadmap. Keep sharp with Review and Practice."),
      el("div", { class: "btn-row", style: "margin-top:.5rem" }, [
        !tookLevelTest ? el("a", { class: "btn btn-primary", href: "#/level-test" }, "📊 Take the Level Test") : null,
        el("a", { class: "btn btn-primary", href: "#/roadmap" }, "🗺️ Continue roadmap")
      ].filter(Boolean))
    ])
  );

  // Score rings
  const scoreCard = el("div", { class: "card" }, [
    el("div", { class: "card-title" }, "Tu perfil de competencia"),
    el("div", { class: "grid grid-4", style: "text-align:center" }, [
      el("div", {}, scoreRing(s.speaking, "Habla", "var(--c-red)")),
      el("div", {}, scoreRing(s.listening, "Escucha", "var(--c-blue)")),
      el("div", {}, scoreRing(s.grammar, "Gramática", "var(--c-purple)")),
      el("div", {}, scoreRing(s.vocabulary, "Vocabulario", "var(--c-green)"))
    ]),
    el("div", { class: "grid grid-4", style: "text-align:center;margin-top:.5rem" }, [
      el("div", {}, scoreRing(s.cultural, "Cultura", "var(--gold)")),
      el("div", {}, scoreRing(lvl.pct, "Nivel actual", "var(--accent)")),
      el("div", {}, scoreRing(retentionRate(), "Retención", "var(--c-green)")),
      el("div", {}, scoreRing(Math.min(100, (store.state.progress.dialoguesCompleted.length / 28) * 100), "Diálogos", "var(--c-blue)"))
    ])
  ]);
  container.appendChild(scoreCard);

  // Heatmap
  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "Constancia (últimos ~16 semanas)"),
      heatmap(p.studyDates)
    ])
  );

  // Quick links
  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "Accesos rápidos"),
      el("div", { class: "grid grid-4" }, [
        quickLink("🗂️", "Vocabulario", "#/vocabulary"),
        quickLink("🧠", "Gramática", "#/grammar"),
        quickLink("💬", "Diálogos", "#/dialogues"),
        quickLink("🎧", "Escucha", "#/listening"),
        quickLink("🎤", "Habla", "#/speaking"),
        quickLink("📖", "Lectura", "#/reading"),
        quickLink("✍️", "Escritura", "#/writing"),
        quickLink("🇪🇸", "Cultura", "#/culture")
      ])
    ])
  );

  // Achievements preview
  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "flex justify-between items-center" }, [
        el("div", { class: "card-title mb-0" }, "Logros"),
        el("a", { href: "#/achievements", class: "text-muted" }, "Ver todos →")
      ]),
      el(
        "p",
        { class: "text-muted" },
        unlockedAchievements.length
          ? `${unlockedAchievements.length} de ${ACHIEVEMENTS.length} desbloqueados`
          : "Aún no has desbloqueado logros — ¡empieza a estudiar!"
      )
    ])
  );
}

function quickLink(icon, label, href) {
  return el("a", { class: "card card-link", href, style: "text-align:center;padding:1rem" }, [
    el("div", { style: "font-size:1.6rem" }, icon),
    el("div", { style: "font-weight:700;margin-top:.35rem;font-size:.85rem" }, label)
  ]);
}
