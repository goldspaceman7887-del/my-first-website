// Slot-filling dialogue engine for real-life task scenarios.
//
// This is not a script: the NPC's next line is chosen at each turn from
// whatever's still unresolved, weighted so ask order varies between
// playthroughs, with a chance of a clarification, an unexpected follow-up,
// or a deliberate mistake instead of "the next logical question." A session
// always resolves to "success", "incomplete" (abandoned), or "failed"
// (an NPC mistake never repaired) — never a script that just runs out.

const QUESTION_RE = /\?|(\bcu[aá]nto\b|\bqu[eé] es\b|\bpuede repetir\b|\bno entiendo\b|\bc[oó]mo\b|\bpor qu[eé]\b)/i;
const NEGATIVE_RE = /\bno\b/i;

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slotEligible(session, slot) {
  if (session.slots[slot.id] !== undefined) return false;
  if (!slot.dependsOn) return true;
  const depValue = session.slots[slot.dependsOn.slot];
  return depValue !== undefined && slot.dependsOn.when(depValue);
}

export function createSession(scenario) {
  const requiredSlots = scenario.slots.filter((s) => s.required);
  return {
    scenario,
    slots: {},
    turns: 0,
    log: [],
    requiredSlots,
    filledRequiredCount: 0,
    questionsAsked: 0,
    mistakesFired: [],
    unresolvedMistakes: 0,
    pendingMistake: null,
    pendingClarification: null,
    usedFollowUps: new Set(),
    askedOptionalIds: new Set(),
    lastAskedSlotId: null,
    status: "active"
  };
}

export function extractSlots(session, text) {
  const filled = [];
  for (const slot of session.scenario.slots) {
    if (session.slots[slot.id] !== undefined) continue;
    if (!slot.extract) continue;
    // contextOnly slots (permissive free-text acceptors, or ones the NPC
    // must have proactively raised) are only extracted on the turn right
    // after the NPC actually asked about them — otherwise a permissive
    // extractor would swallow an answer meant for something else the
    // moment the slot becomes eligible.
    if (slot.contextOnly && session.lastAskedSlotId !== slot.id) continue;
    const value = slot.extract(text);
    if (value === null || value === undefined) continue;
    session.slots[slot.id] = value;
    filled.push(slot);
    if (slot.required) session.filledRequiredCount++;
    const clar = (session.scenario.clarifications || []).find(
      (c) => c.whenSlot === slot.id && c.when(value)
    );
    if (clar) session.pendingClarification = clar;
  }
  return filled;
}

function eligibleFollowUp(session) {
  const pool = (session.scenario.unexpectedFollowUps || []).filter((f) => {
    if (session.usedFollowUps.has(f.id)) return false;
    if (f.onlyIf && !f.onlyIf(session)) return false;
    return (f.afterSlots || []).every((id) => session.slots[id] !== undefined);
  });
  if (!pool.length) return null;
  const totalWeight = pool.reduce((sum, f) => sum + (f.weight || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const f of pool) {
    roll -= f.weight || 1;
    if (roll <= 0) return f;
  }
  return pool[pool.length - 1];
}

function fillTemplate(str, session) {
  return str.replace(/\{(\w+)\}/g, (_, key) => session.slots[key] ?? "");
}

// Decides the NPC's next line. Priority: a clarification just triggered >
// a mistake's repair prompt is pending > (~20% chance) an eligible
// unexpected follow-up not yet used > a weighted-random pick among unfilled,
// dependency-satisfied required slots not asked last turn.
export function nextTurn(session) {
  if (session.pendingClarification) {
    const c = session.pendingClarification;
    session.pendingClarification = null;
    session.lastAskedSlotId = c.forcesSlot || null;
    return { kind: "clarification", es: c.es, en: c.en };
  }

  if (session.pendingMistake) {
    const m = session.pendingMistake;
    return { kind: "repair-prompt", es: m.repairPrompt.es, en: m.repairPrompt.en };
  }

  // Deliberate mistake: only after every required slot referenced in
  // firesIf has a value, otherwise firesIf can't evaluate meaningfully.
  for (const mistake of session.scenario.mistakes || []) {
    if (session.mistakesFired.includes(mistake.id)) continue;
    if (!mistake.firesIf(session)) continue;
    if (Math.random() > mistake.chance) continue;
    session.mistakesFired.push(mistake.id);
    session.unresolvedMistakes++;
    session.pendingMistake = mistake;
    return { kind: "mistake", es: fillTemplate(mistake.npcLine.es, session), en: fillTemplate(mistake.npcLine.en, session), isMistakeTrigger: true };
  }

  if (Math.random() < 0.2) {
    const followUp = eligibleFollowUp(session);
    if (followUp) {
      session.usedFollowUps.add(followUp.id);
      if (followUp.forcesSlot) session.lastAskedSlotId = followUp.forcesSlot;
      return { kind: "follow-up", es: followUp.es, en: followUp.en, isMistakeTrigger: !!followUp.isMistakeTrigger };
    }
  }

  const candidates = session.scenario.slots.filter(
    (s) => s.required && slotEligible(session, s) && s.id !== session.lastAskedSlotId
  );
  const pool = candidates.length ? candidates : session.scenario.slots.filter((s) => s.required && slotEligible(session, s));
  if (pool.length) {
    const slot = pick(pool);
    session.lastAskedSlotId = slot.id;
    const phrase = pick(slot.askPhrases);
    return { kind: "ask", slotId: slot.id, es: phrase.es, en: phrase.en };
  }

  // Optional (non-required) slots, asked at most once each — even if the
  // reply doesn't parse into a value, re-asking forever would mean a
  // session with an unrecognized answer could never reach "close".
  const optional = session.scenario.slots.filter(
    (s) => !s.required && slotEligible(session, s) && s.askPhrases && !session.askedOptionalIds.has(s.id)
  );
  if (optional.length) {
    const slot = pick(optional);
    session.lastAskedSlotId = slot.id;
    session.askedOptionalIds.add(slot.id);
    const phrase = pick(slot.askPhrases);
    return { kind: "ask", slotId: slot.id, es: phrase.es, en: phrase.en };
  }

  return { kind: "close" };
}

export function submitUserTurn(session, text) {
  session.turns++;
  if (QUESTION_RE.test(text)) session.questionsAsked++;

  if (session.pendingMistake) {
    const resolved = session.pendingMistake.expectedRepair.test(text);
    if (resolved) {
      session.unresolvedMistakes--;
      session.pendingMistake = null;
    }
    // If not resolved this turn, keep pendingMistake set — the engine will
    // keep surfacing the repair prompt until the learner catches it or the
    // scenario times out into a failure state.
  }

  extractSlots(session, text);
  session.log.push({ speaker: "user", text, filledSnapshot: { ...session.slots } });

  const turn = nextTurn(session);
  session.log.push({ speaker: "npc", ...turn });
  return turn;
}

export function resolveSession(session) {
  const failure = (session.scenario.failureStates || []).find((f) => f.when(session));
  if (failure) {
    session.status = failure.outcome;
    return session;
  }
  session.status = session.scenario.successCondition(session) ? "success" : "incomplete";
  return session;
}

export function missingRequiredSlots(session) {
  return session.requiredSlots
    .filter((s) => session.slots[s.id] === undefined)
    .map((s) => ({ label: s.label, labelEs: s.labelEs || s.label }));
}
