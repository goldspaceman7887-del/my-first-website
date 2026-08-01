import { store, todayISO } from "../core/storage.js";
import { el, progressBar } from "../core/ui.js";
import { reviewCounts, isMastered } from "../core/srs.js";
import { levelForCharCount, nextLevelInfo, currentStreak } from "../core/gamification.js";
import { CHARACTERS } from "../data/characters.js";
import { VOCABULARY } from "../data/vocabulary.js";

function srsEntriesByType(type) {
  return Object.values(store.state.srs).filter((i) => i.type === type);
}

function knownCharacters() {
  // "Known" = self-reported at onboarding, or mastered through review.
  const selfReported = new Set(store.state.profile.selfReportedKnownChars || []);
  const mastered = srsEntriesByType("character")
    .filter((i) => isMastered(i.id, 70))
    .map((i) => i.id.replace("character_", ""))
    .map((cid) => CHARACTERS.find((c) => c.id === cid))
    .filter(Boolean)
    .map((c) => c.char);
  return new Set([...selfReported, ...mastered]);
}

function learningCharacters() {
  return srsEntriesByType("character")
    .filter((i) => !isMastered(i.id, 70))
    .map((i) => i.id.replace("character_", ""))
    .map((cid) => CHARACTERS.find((c) => c.id === cid))
    .filter(Boolean);
}

function masteredWords() {
  return srsEntriesByType("word")
    .filter((i) => isMastered(i.id, 70))
    .map((i) => i.id.replace("word_", ""))
    .map((wid) => VOCABULARY.find((v) => v.id === wid))
    .filter(Boolean);
}

function activeSentences() {
  return (store.state.progress.activeSentenceIds || []).length;
}

function statCard(icon, value, label) {
  return el("div", { class: "card stat-card" }, [
    el("div", { class: "stat-icon" }, icon),
    el("div", { class: "stat-value" }, String(value)),
    el("div", { class: "stat-label" }, label)
  ]);
}

function heatmap() {
  const dates = new Set(store.state.profile.studyDates || []);
  const days = 84; // 12 weeks
  const cells = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const level = dates.has(iso) ? "4" : "0";
    cells.push(el("div", { class: "heatmap-cell", "data-level": level, title: iso }));
  }
  return el("div", { class: "heatmap" }, cells);
}

export function renderDashboard(container) {
  const known = knownCharacters();
  const learning = learningCharacters();
  const words = masteredWords();
  const counts = reviewCounts();
  const { current, next, pct } = nextLevelInfo(known.size);
  const streak = currentStreak();

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🀄 Dashboard"),
      el("p", {}, "Your Mandarin memory system: what you know, what you're learning, and what's due for review — reviewed first, before anything new.")
    ])
  );

  container.appendChild(
    el("div", { class: "grid grid-4" }, [
      statCard("🔥", streak, "Day streak"),
      statCard("⚡", store.state.profile.xp || 0, "Total XP"),
      statCard("🔁", counts.dueToday, "Reviews due"),
      statCard("🈶", known.size, "Known characters")
    ])
  );

  const levelCard = el("div", { class: "card", style: "margin-top:1rem" }, [
    el("div", { class: "flex justify-between items-center" }, [
      el("div", {}, [
        el("div", { class: "card-title" }, `${current.label} · ${current.desc}`),
        el("div", { class: "text-muted" }, next ? `${known.size} / ${next.chars} characters toward ${next.label}` : `${known.size} characters known — top level reached!`)
      ]),
      el("span", { class: "badge badge-gold" }, `Level ${current.level}`)
    ]),
    el("div", { style: "margin-top:.6rem" }, [progressBar(pct)])
  ]);
  container.appendChild(levelCard);

  container.appendChild(
    el("div", { class: "grid grid-3", style: "margin-top:1rem" }, [
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "🈶 Known characters"),
        el("div", { class: "stat-value" }, String(known.size)),
        el("p", { class: "text-muted" }, "Self-reported at onboarding, plus anything you've mastered through review."),
        el("a", { class: "btn btn-sm", href: "#/characters" }, "Browse characters")
      ]),
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "📖 Learning now"),
        el("div", { class: "stat-value" }, String(learning.length)),
        el("p", { class: "text-muted" }, "Characters currently in your SRS queue, not yet mastered."),
        el("a", { class: "btn btn-sm", href: "#/review" }, "Review queue")
      ]),
      el("div", { class: "card" }, [
        el("div", { class: "card-title" }, "✅ Mastered words"),
        el("div", { class: "stat-value" }, String(words.length)),
        el("p", { class: "text-muted" }, "Words recalled correctly enough times to count as mastered."),
        el("a", { class: "btn btn-sm", href: "#/vocabulary" }, "Browse vocabulary")
      ])
    ])
  );

  container.appendChild(
    el("div", { class: "card", style: "margin-top:1rem" }, [
      el("div", { class: "card-title" }, "🎯 Active sentences"),
      el("p", { class: "text-muted" }, `You currently have ${activeSentences()} sentence pattern(s) in active study. Sentences move here from the Sentences view when you start practicing them.`),
      el("a", { class: "btn btn-sm", href: "#/sentences" }, "Study sentence patterns")
    ])
  );

  const nudge = el("div", { class: "card", style: "margin-top:1rem;border-left:3px solid var(--accent)" }, [
    el("div", { class: "card-title" }, counts.dueToday > 0 ? `🔁 ${counts.dueToday} review(s) waiting` : "🆕 Ready for something new"),
    el("p", { class: "text-muted" }, counts.dueToday > 0
      ? "Reviewing due material first is the single best thing you can do for long-term retention."
      : "No reviews due right now — great time to start today's Daily Lesson."),
    el("div", { class: "btn-row", style: "margin-top:.5rem" }, [
      counts.dueToday > 0 ? el("a", { class: "btn btn-primary", href: "#/review" }, "Start review") : null,
      el("a", { class: "btn btn-primary", href: "#/daily-lesson" }, "Daily Lesson"),
      el("a", { class: "btn", href: "#/speaking" }, "🎤 Speaking Mode"),
      el("a", { class: "btn", href: "#/immersion" }, "🌊 Immersion Mode")
    ].filter(Boolean))
  ]);
  container.appendChild(nudge);

  container.appendChild(
    el("div", { class: "card", style: "margin-top:1rem" }, [
      el("div", { class: "card-title" }, "📅 Study activity"),
      heatmap()
    ])
  );
}
