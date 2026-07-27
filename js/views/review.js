import { store } from "../core/storage.js";
import { el } from "../core/ui.js";
import { reviewCounts, retentionRate, masteryLevel } from "../core/srs.js";
import { VOCABULARY } from "../data/vocabulary.js";
import { GRAMMAR } from "../data/grammar.js";

const TYPE_META = {
  vocab: { label: "Vocabulario", icon: "🗂️", href: "#/vocabulary" },
  grammar: { label: "Gramática", icon: "🧠", href: "#/grammar" },
  dialogue: { label: "Diálogos", icon: "💬", href: "#/dialogues" },
  listening: { label: "Escucha", icon: "🎧", href: "#/listening" },
  speaking: { label: "Habla", icon: "🎤", href: "#/speaking" },
  reading: { label: "Lectura", icon: "📖", href: "#/reading" }
};

export function renderReview(container) {
  const counts = reviewCounts();

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🔁 Panel de repaso (SRS)"),
      el("p", {}, "Repetición espaciada estilo Anki (SM-2): repasa lo justo, en el momento justo, para no olvidar nunca.")
    ])
  );

  container.appendChild(
    el("div", { class: "grid grid-4" }, [
      statCard("📅", counts.dueToday, "Pendientes hoy"),
      statCard("⏰", counts.overdue, "Atrasados"),
      statCard("📦", counts.total, "Elementos en total"),
      statCard("🎯", `${retentionRate()}%`, "Tasa de retención")
    ])
  );

  container.appendChild(el("h2", { style: "margin-top:1.5rem" }, "Repaso por tipo"));
  const grid = el("div", { class: "grid grid-3" });
  Object.entries(TYPE_META).forEach(([type, meta]) => {
    const t = counts.byType[type] || { total: 0, due: 0 };
    grid.appendChild(
      el("div", { class: "card" }, [
        el("div", { style: "font-size:1.5rem" }, meta.icon),
        el("h3", { style: "margin:.4rem 0" }, meta.label),
        el("p", { class: "text-muted" }, `${t.due} pendientes de ${t.total} estudiados`),
        el("a", { class: "btn btn-primary btn-sm", href: meta.href }, "Repasar ahora →")
      ])
    );
  });
  container.appendChild(grid);

  // Weakness analysis — forgetting curve optimization
  container.appendChild(el("h2", { style: "margin-top:1.5rem" }, "🩹 Puntos débiles (repaso prioritario)"));
  const weakVocab = weakestItems("vocab_", VOCABULARY, (v) => v.es, (v) => `#/vocabulary`);
  const weakGrammar = weakestItems("gram_", GRAMMAR, (g) => g.title, (g) => `#/grammar/${g.id}`);
  const weakGrid = el("div", { class: "grid grid-2" });
  weakGrid.appendChild(weaknessCard("Vocabulario más débil", weakVocab));
  weakGrid.appendChild(weaknessCard("Gramática más débil", weakGrammar));
  container.appendChild(weakGrid);

  function weakestItems(prefix, source, labelFn, hrefFn) {
    return Object.entries(store.state.srs)
      .filter(([id]) => id.startsWith(prefix))
      .map(([id, item]) => {
        const rawId = id.slice(prefix.length);
        const src = source.find((x) => x.id === rawId);
        if (!src) return null;
        return { id, mastery: masteryLevel(id), label: labelFn(src), href: hrefFn(src) };
      })
      .filter(Boolean)
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, 8);
  }

  function weaknessCard(title, items) {
    if (!items.length) {
      return el("div", { class: "card" }, [el("div", { class: "card-title" }, title), el("p", { class: "text-muted" }, "Aún no hay suficientes datos — sigue estudiando.")]);
    }
    return el("div", { class: "card" }, [
      el("div", { class: "card-title" }, title),
      el(
        "div",
        { class: "flex-col gap-1" },
        items.map((it) =>
          el("a", { href: it.href, class: "flex justify-between items-center", style: "text-decoration:none;color:inherit;padding:.4rem 0;border-bottom:1px solid var(--border)" }, [
            el("span", {}, it.label),
            el("span", { class: `badge ${it.mastery < 40 ? "badge-danger" : "badge-default"}` }, `${it.mastery}%`)
          ])
        )
      )
    ]);
  }

  function statCard(icon, value, label) {
    return el("div", { class: "card stat-card" }, [
      el("span", { class: "stat-icon" }, icon),
      el("span", { class: "stat-value" }, String(value)),
      el("span", { class: "stat-label" }, label)
    ]);
  }
}
