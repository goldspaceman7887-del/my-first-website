// DAILY LIFE SIMULATION MODE — an entire day in Mexico, seven scenarios
// chained back to back (morning coffee → commute → work → lunch → an
// errand → a social evening → something unexpected at night), each one
// pulled from Scenario Mode's own data and engine (js/data/scenarios.js,
// js/views/scenario.js's embedded mode) rather than a second copy of it.
//
// How one part of the day goes carries into the next: a short narrator line
// between scenarios, colored by the previous outcome, acknowledges a rushed
// morning or a smooth lunch before the next NPC picks up — "previous
// decisions influence future interactions" without rewriting every
// scenario's own dialogue for every possible history.

import { store, todayISO } from "../core/storage.js";
import { el, confettiBurst } from "../core/ui.js";
import { addXP, registerStudyToday } from "../core/gamification.js";
import { scenariosByCategory } from "../data/scenarios.js";
import { renderScenarioRun } from "./scenario.js";

const SLOTS = [
  { key: "morning", label: "Morning", icon: "🌅", category: "food" },
  { key: "commute", label: "Commute", icon: "🚕", category: "transportation" },
  { key: "work", label: "Work", icon: "💼", category: "workplace" },
  { key: "lunch", label: "Lunch", icon: "🌮", category: "food" },
  { key: "afternoon", label: "Afternoon errand", icon: "🏦", category: "banking" },
  { key: "evening", label: "Evening", icon: "🧑‍🤝‍🧑", category: "social" },
  { key: "night", label: "Night", icon: "🚨", category: "emergencies" }
];

const CONNECTORS = {
  success: [
    { es: "Sales con buen ánimo — las cosas van saliendo bien hasta ahora.", en: "You head out feeling good — things are going well so far." },
    { es: "Todo salió bien, así que sigues con confianza hacia lo que sigue.", en: "That all went well, so you move on with confidence to what's next." }
  ],
  partial: [
    { es: "Sigues adelante, aunque con la sensación de que algo se quedó a medias.", en: "You carry on, though with the feeling something was left half-finished." },
    { es: "No salió perfecto, pero no hay tiempo de pensarlo mucho — sigues con tu día.", en: "It wasn't perfect, but there's no time to dwell on it — you carry on with your day." }
  ],
  fail: [
    { es: "Sigues con la cabeza todavía en lo que acaba de pasar, algo distraído.", en: "Your head is still on what just happened — a little distracted." },
    { es: "Ese último malentendido te dejó algo inseguro, pero el día continúa.", en: "That last mix-up left you a bit unsure of yourself, but the day goes on." }
  ]
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function renderDailySim(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🗓️ A Day in Mexico"),
      el("p", {}, "Seven parts of a real day, back to back — coffee, commute, work, lunch, an errand, a social evening, and something unexpected at night. How each one goes carries into the next.")
    ])
  );

  let slotIdx = 0;
  const outcomes = []; // outcomeKey per completed slot
  const usedScenarioIds = []; // avoid repeating the exact same scenario within one day
  const body = el("div", {});
  container.appendChild(body);
  let cleanup = null;

  renderTimeline();

  function runCleanup() {
    if (typeof cleanup === "function") { try { cleanup(); } catch (e) { console.error(e); } }
    cleanup = null;
  }

  function renderTimeline() {
    runCleanup();
    body.innerHTML = "";
    const grid = el("div", { class: "grid grid-auto" }, SLOTS.map((s, i) => {
      const done = outcomes[i];
      return el("div", { class: "card", style: `opacity:${i <= slotIdx ? "1" : ".55"}` }, [
        el("div", { style: "font-size:1.6rem" }, s.icon),
        el("h4", { style: "margin:.35rem 0 0" }, s.label),
        done
          ? el("span", { class: `badge badge-${done === "success" ? "success" : done === "partial" ? "gold" : "danger"}`, style: "margin-top:.35rem" },
              done === "success" ? "✓ Went well" : done === "partial" ? "~ Mixed" : "✗ Rocky")
          : null
      ].filter(Boolean));
    }));
    body.appendChild(grid);

    if (outcomes.length === SLOTS.length) {
      body.appendChild(renderDaySummary());
      return;
    }

    body.appendChild(
      el("button", { class: "btn btn-primary", style: "margin-top:1rem", onclick: startSlot },
        outcomes.length ? "Continue your day →" : "Start your day →")
    );
  }

  function pickScenarioFor(slot) {
    const pool = scenariosByCategory(slot.category);
    const fresh = pool.filter((s) => !usedScenarioIds.includes(s.id));
    return pick(fresh.length ? fresh : pool);
  }

  function startSlot() {
    runCleanup();
    body.innerHTML = "";
    const slot = SLOTS[slotIdx];
    const scenario = pickScenarioFor(slot);
    usedScenarioIds.push(scenario.id);

    const lastOutcome = outcomes[outcomes.length - 1];
    body.appendChild(
      el("div", { class: "card", style: "margin-bottom:.75rem" }, [
        el("div", { class: "flex items-center", style: "gap:.5rem" }, [
          el("span", { style: "font-size:1.4rem" }, slot.icon),
          el("h3", { style: "margin:0" }, slot.label)
        ]),
        lastOutcome ? el("p", { class: "text-muted", style: "margin-top:.4rem" }, pick(CONNECTORS[lastOutcome]).es) : null
      ].filter(Boolean))
    );

    const runWrap = el("div", {});
    body.appendChild(runWrap);
    const maybeCleanup = renderScenarioRun(runWrap, { id: scenario.id }, {
      embedded: true,
      onFinish: (outcomeKey) => {
        outcomes[slotIdx] = outcomeKey;
        slotIdx++;
        if (slotIdx >= SLOTS.length) finishDay();
        else renderTimeline();
      }
    });
    if (typeof maybeCleanup === "function") cleanup = maybeCleanup;
  }

  function finishDay() {
    registerStudyToday();
    const successCount = outcomes.filter((o) => o === "success").length;
    const xp = 20 + successCount * 5;
    addXP(xp, "A Day in Mexico completed");
    store.state.progress.dailySimSessions.push({ date: todayISO(), outcomes: outcomes.slice() });
    store.save();
    if (successCount >= SLOTS.length - 1) confettiBurst();
    renderTimeline();
  }

  function renderDaySummary() {
    const successCount = outcomes.filter((o) => o === "success").length;
    const partialCount = outcomes.filter((o) => o === "partial").length;
    return el("div", { class: "card pop-in", style: "margin-top:1rem;text-align:center" }, [
      el("div", { style: "font-size:2.2rem" }, successCount === SLOTS.length ? "🌟" : successCount >= SLOTS.length / 2 ? "🙂" : "😅"),
      el("h3", {}, "Your day is done"),
      el("p", { class: "text-muted" }, `${successCount} went smoothly, ${partialCount} were a mixed bag, ${SLOTS.length - successCount - partialCount} were rocky — every one of them real communication, start to finish.`),
      el("button", { class: "btn btn-primary", style: "margin-top:.6rem", onclick: () => {
        slotIdx = 0; outcomes.length = 0; usedScenarioIds.length = 0; renderTimeline();
      } }, "Live another day")
    ]);
  }

  return () => runCleanup();
}
