// A DAY IN MEXICO — Daily Life Simulation Mode.
//
// Chains seven existing task scenarios into one narrative day: Morning
// (coffee) → Commute (metro) → Work (team meeting) → Lunch (restaurant) →
// Afternoon (apartment hunting) → Evening (a party) → Night (a lost
// wallet). Each segment runs through the exact same renderScenarioPlay()
// every standalone scenario already uses — no conversation logic is
// reimplemented here, just a timeline wrapper around it.
//
// Continuity is intentionally light: from the second segment on, the NPC's
// opening line is chosen from that scenario's moodOpenings.good/rough pool
// based on how the PREVIOUS segment scored (scenarioPlay.js's `openings`
// option), instead of the plain openings[] every standalone scenario uses.
// Every segment still separately feeds the normal proficiency/SRS
// pipeline through its own attempt — this view only adds a day-level
// summary on top, no special-casing of the underlying data.

import { store, todayISO } from "../core/storage.js";
import { el, toast, confettiBurst } from "../core/ui.js";
import { scenarioById } from "../data/scenarios.js";
import { renderScenarioPlay } from "./scenarioPlay.js";

export const SEGMENTS = [
  { id: "order-coffee", label: "Morning", icon: "☕" },
  { id: "taking-the-metro", label: "Commute", icon: "🚇" },
  { id: "team-meeting", label: "Work", icon: "📊" },
  { id: "restaurant", label: "Lunch", icon: "🌮" },
  { id: "apartment-hunting", label: "Afternoon", icon: "🏠" },
  { id: "making-friends-party", label: "Evening", icon: "🎉" },
  { id: "lost-wallet-police-report", label: "Night", icon: "🚨" }
];

const GOOD_THRESHOLD = 70;

export function moodFor(score) {
  return score >= GOOD_THRESHOLD ? "good" : "rough";
}

// Pure aggregation over one day's results — separated from showSummary()'s
// DOM/storage side effects so the actual math is directly unit-testable.
export function summarizeDay(results, outcomes) {
  const scored = SEGMENTS.filter((seg) => results[seg.id] !== undefined);
  const skipped = SEGMENTS.filter((seg) => results[seg.id] === undefined);
  const avg = scored.length ? Math.round(scored.reduce((s, seg) => s + results[seg.id], 0) / scored.length) : 0;
  const successes = scored.filter((seg) => outcomes[seg.id] === "success").length;
  const dayOutcome = skipped.length ? "incomplete" : avg >= GOOD_THRESHOLD ? "strong" : avg >= 40 ? "mixed" : "rough";
  return { scored, skipped, avg, successes, dayOutcome };
}

export function renderDailyLife(container) {
  let idx = 0;
  let cleanup = null;
  const results = {}; // scenarioId -> overallScore
  const outcomes = {}; // scenarioId -> outcome string

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🌅 A Day in Mexico"),
      el("p", {}, "Seven real-life tasks chained into one day — how the previous one goes shapes the mood of the next. Each still counts toward your normal progress; this is just the story wrapped around it.")
    ])
  );

  const timeline = el("div", { class: "flex gap-2 flex-wrap", style: "margin-bottom:1rem" });
  container.appendChild(timeline);

  const stage = el("div", {});
  container.appendChild(stage);

  function runCleanup() {
    if (typeof cleanup === "function") { try { cleanup(); } catch (e) { console.error(e); } }
    cleanup = null;
  }

  function drawTimeline() {
    timeline.innerHTML = "";
    SEGMENTS.forEach((seg, i) => {
      const done = results[seg.id] !== undefined;
      const state = done ? "done" : i === idx ? "active" : "upcoming";
      timeline.appendChild(
        el("span", {
          class: `badge ${state === "done" ? "badge-success" : state === "active" ? "badge-level" : "badge-default"}`,
          style: state === "upcoming" ? "opacity:.5" : ""
        }, `${seg.icon} ${seg.label}${done ? ` · ${results[seg.id]}` : ""}`)
      );
    });
  }

  // ---------- intro / restart ----------
  function showIntro() {
    runCleanup();
    idx = 0;
    Object.keys(results).forEach((k) => delete results[k]);
    Object.keys(outcomes).forEach((k) => delete outcomes[k]);
    stage.innerHTML = "";
    drawTimeline();
    stage.appendChild(
      el("div", { class: "card" }, [
        el("h3", { class: "card-title" }, "Your day, one task at a time"),
        el("p", {}, "Seven everyday situations back to back — a coffee run, the commute, a work meeting, lunch, apartment hunting, a party, and reporting a lost wallet. How each one goes shapes the mood of the next."),
        el("button", { class: "btn btn-primary", style: "margin-top:.5rem", onclick: () => { idx = 0; playSegment(); } }, "Start the day →")
      ])
    );
  }

  // ---------- one segment ----------
  function playSegment() {
    runCleanup();
    stage.innerHTML = "";
    drawTimeline();

    if (idx >= SEGMENTS.length) return showSummary();

    const seg = SEGMENTS[idx];
    const scenario = scenarioById(seg.id);
    if (!scenario) { idx++; return playSegment(); }

    stage.appendChild(
      el("div", { class: "card", style: "margin-bottom:.5rem" }, [
        el("span", { class: "badge badge-level" }, `${seg.icon} ${seg.label} · ${idx + 1}/${SEGMENTS.length}`)
      ])
    );

    // The first segment has no prior score to react to; every later one
    // prefers the scenario's mood pool over its plain openings[] when the
    // scenario has one.
    let openings;
    if (idx > 0 && scenario.moodOpenings) {
      const prevId = SEGMENTS[idx - 1].id;
      const prevScore = results[prevId] ?? 0;
      openings = scenario.moodOpenings[moodFor(prevScore)];
    }

    const body = el("div", {});
    stage.appendChild(body);

    cleanup = renderScenarioPlay(body, scenario, {
      openings,
      onExit: showIntro,
      onRetry: () => playSegment(),
      onFinish: (attempt) => {
        results[seg.id] = attempt.overallScore;
        outcomes[seg.id] = attempt.outcome;
        // scenarioPlay's own debrief card appends synchronously right after
        // this callback returns — queue ours for the next tick so it lands
        // below that card instead of being clobbered by it.
        setTimeout(() => {
          drawTimeline();
          body.appendChild(
            el("div", { class: "btn-row", style: "margin-top:.8rem" }, [
              el("button", { class: "btn btn-primary", onclick: () => { idx++; playSegment(); } },
                idx + 1 >= SEGMENTS.length ? "See day summary →" : "Continue to the next part of your day →")
            ])
          );
        }, 0);
      }
    });
  }

  // ---------- day summary ----------
  function showSummary() {
    runCleanup();
    stage.innerHTML = "";

    const { scored, skipped, avg, successes, dayOutcome } = summarizeDay(results, outcomes);

    store.state.progress.dailyLifeRuns.push({
      date: todayISO(),
      segmentsCompleted: scored.map((seg) => seg.id),
      segmentResults: scored.reduce((acc, seg) => { acc[seg.id] = results[seg.id]; return acc; }, {}),
      dayOutcome
    });
    store.save();
    if (dayOutcome === "strong") confettiBurst();
    toast(`Day complete — ${successes}/${scored.length || SEGMENTS.length} tasks handled well`, { icon: "🌅" });

    const summaryIcon = { strong: "🌟", mixed: "🌤️", incomplete: "🌥️", rough: "🌧️" }[dayOutcome];
    stage.appendChild(
      el("div", { class: "card empty-state pop-in" }, [
        el("div", { class: "empty-icon" }, summaryIcon),
        el("h3", {}, "Day complete"),
        el("p", {}, `${successes}/${scored.length} tasks handled well · average score ${avg}/100`),
        skipped.length ? el("p", { class: "text-muted" }, `Skipped: ${skipped.map((s) => s.label).join(", ")}`) : null,
        el("div", { class: "grid grid-auto", style: "margin-top:.8rem;text-align:left" }, SEGMENTS.map((seg) =>
          el("div", { class: "card", style: "padding:.6rem" }, [
            el("div", {}, `${seg.icon} ${seg.label}`),
            el("div", { class: "text-muted", style: "font-size:.85rem" },
              results[seg.id] !== undefined ? `${results[seg.id]}/100 · ${outcomes[seg.id]}` : "skipped")
          ])
        )),
        el("div", { class: "btn-row", style: "justify-content:center;margin-top:1rem" }, [
          el("button", { class: "btn btn-primary", onclick: showIntro }, "Play again"),
          el("a", { class: "btn", href: "#/practice" }, "Back to Practice")
        ])
      ].filter(Boolean))
    );
    drawTimeline();
  }

  showIntro();
  return () => runCleanup();
}
