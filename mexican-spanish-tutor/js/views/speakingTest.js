// SPEAKING TEST (OPI PRACTICE) — Phase 1 of the ACTFL redesign.
//
// Rebuilt on the adaptive engine (core/ratingEngine.js + core/taskSelector.js
// + core/rubricEngine.js, task bank in data/realWorldTasks.js):
//   - Real-world tasks, not "translate this sentence" — each one is tagged
//     with the ACTFL function and everyday context it's actually testing.
//     Intermediate tasks add a natural follow-up question (task.followUp);
//     Intermediate High+ tasks add an unexpected complication
//     (task.complication) — both are a required second turn, since
//     "handle follow-up questions" and "handle unexpected situations" are
//     abilities, not just prompts to read.
//   - Adaptive difficulty — the next task is chosen against your current
//     rating, with periodic ceiling probes (one band up from wherever the
//     rating currently sits) and recovery probes when a level looks shaky,
//     instead of a fixed day-of-year script.
//   - Honest reassessment — a level only moves on a pattern of evidence
//     (core/ratingEngine.js's hysteresis rules), and it can move down as
//     well as up. No single answer sets a permanent floor, and nothing here
//     is reachable by vocabulary recall or multiple choice — every task is
//     graded on what you actually communicated (core/rubricEngine.js).
//
// Speaking is still the primary input: the mic streams a live Spanish
// transcript while you talk, typing stays available as a fallback.
//
// This does NOT touch core/assessment.js's older XP+scores composite, which
// Roadmap/Conversation/Immersion still rely on — updateSkillScore() and the
// progress.speakingTests log are still written here for backward
// compatibility with those (levels written there are capped to the older
// 7-level ladder Roadmap understands; the full 9-level result lives in
// state.proficiency.speaking).

import { store, todayISO } from "../core/storage.js";
import { el, toast, blurActive, confettiBurst } from "../core/ui.js";
import { audioEngine, speechRecognitionSupported, startDictation } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { scoreRealWorldResponse, DIMENSION_LABELS } from "../core/rubricEngine.js";
import { getSkillState, displayedLevel, recordTaskOutcome, isStale, stalenessDays } from "../core/ratingEngine.js";
import { pickNextTask } from "../core/taskSelector.js";
import { PROFICIENCY_LEVELS, levelAt } from "../data/actflProficiency.js";

const SESSION_LENGTH = 7;

const FUNCTION_TITLES = {
  describe: "Describe", narrate: "Narrate", compare: "Compare", persuade: "Give an opinion",
  hypothesize: "Hypothesize", negotiate: "Handle a situation", sequence: "Explain steps", advise: "Advise"
};

const KIND_BADGE = {
  adaptive: null, // no special badge — this is the normal case
  ceiling: "🔼 Level check",
  recovery: "🎯 Confirming your level"
};

// The old 7-level Roadmap ladder tops out at Advanced Low (index 6). This
// system tracks through Advanced High (index 8) internally, but anything
// written where Roadmap reads it must stay inside the range Roadmap knows
// about, or `ACTFL_LEVELS.find(...)` over there comes back undefined.
function legacyCompatibleCode(idx) {
  return PROFICIENCY_LEVELS[Math.min(idx, 6)].code;
}

export function renderSpeakingTest(container) {
  const canSpeak = speechRecognitionSupported();
  let sessionUsedIds = [];
  let sessionResults = []; // { task, kind, text, scored, summary }
  let pendingComplication = null; // { es, en } queued off the main answer — from task.followUp or task.complication
  let pendingSecondTurnKind = null; // "followUp" | "complication", drives the label shown for it
  let activePick = null; // { task, kind } for the current turn
  let draftText = "";
  const ratingAtStart = getSkillState("speaking").rating;

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎓 Speaking Test"),
      el("p", {}, "Real-world tasks, adapted to your level as you go. Tap the mic, speak in Spanish as long as you like, then stop — your words appear as you talk. Some tasks throw in a complication mid-scene, the way a real conversation would.")
    ])
  );

  if (!canSpeak) {
    container.appendChild(
      el("div", { class: "feedback-block incorrect", style: "margin-bottom:1rem" }, [
        el("strong", {}, "Mic not available in this browser. "),
        "Speech recognition needs Chrome or Edge (Safari and Firefox don't support it). You can still take the test by typing your answers below."
      ])
    );
  }

  const progressLine = el("p", { class: "text-muted" });
  container.appendChild(progressLine);
  const body = el("div", {});
  container.appendChild(body);

  renderIntro();

  function renderIntro() {
    const s = getSkillState("speaking");
    const lvl = displayedLevel("speaking");
    const stale = isStale("speaking");
    const days = stalenessDays("speaking");
    body.innerHTML = "";
    body.appendChild(
      el("div", { class: "card" }, [
        el("div", { class: "flex justify-between items-center" }, [
          el("div", {}, [
            el("h3", { class: "card-title" }, "Your speaking level right now"),
            el("p", { style: "margin:.1rem 0 0" }, [
              el("strong", {}, lvl.label),
              stale ? el("span", { class: "text-faint" }, ` — last confirmed ${days} days ago, take a session to refresh it` ) : null
            ].filter(Boolean))
          ]),
          el("span", { class: `badge badge-${lvl.code.startsWith("novice") ? "novice" : lvl.code.startsWith("intermediate") ? "intermediate" : "advanced"}` }, lvl.short)
        ]),
        s.atRisk ? el("p", { class: "text-muted", style: "margin-top:.5rem" }, "⚠️ Your last couple of answers at this level were shaky — this session includes a check to confirm where you actually are.") : null,
        el("p", { class: "text-muted", style: "margin-top:.5rem" }, `${SESSION_LENGTH} real-world tasks, roughly 5-8 minutes. Answer honestly — the point is an accurate read, not a high score.`),
        el("button", { class: "btn btn-primary btn-lg", style: "margin-top:.5rem", onclick: renderTurn }, "Start the session")
      ].filter(Boolean))
    );
  }

  function renderTurn() {
    if (sessionResults.length >= SESSION_LENGTH && !pendingComplication) return renderReport();

    if (!activePick && !pendingComplication) {
      activePick = pickNextTask("speaking", sessionUsedIds, sessionResults.length);
      if (!activePick) return renderReport();
      sessionUsedIds.push(activePick.task.id);
    }

    const task = activePick.task;
    const prompt = pendingComplication || task;
    progressLine.textContent = pendingComplication
      ? `${pendingSecondTurnKind === "followUp" ? "Follow-up" : "Complication"} · ${FUNCTION_TITLES[task.function] || task.function}`
      : `Task ${sessionResults.length + 1} of ${SESSION_LENGTH} · ${FUNCTION_TITLES[task.function] || task.function}`;

    body.innerHTML = "";
    const kindBadge = KIND_BADGE[activePick.kind];

    const card = el("div", { class: "card" }, [
      kindBadge ? el("span", { class: "badge badge-gold" }, kindBadge) : null,
      el("div", { class: "flex justify-between items-center", style: "gap:.5rem;margin-top:.4rem" }, [
        el("p", { class: "es-text", style: "font-size:1.15rem;font-weight:700;margin:0" }, prompt.es),
        el("button", { class: "play-btn", title: "Hear the prompt", onclick: () => audioEngine.speak(prompt.es) }, "🔊")
      ]),
      el("p", { class: "text-muted", style: "margin:.25rem 0 0" }, prompt.en)
    ].filter(Boolean));

    const transcript = el("div", {
      class: "es-text",
      style: "min-height:5.5rem;margin-top:.9rem;padding:.75rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);white-space:pre-wrap;line-height:1.55"
    });
    const placeholder = canSpeak ? "Your speech will appear here..." : "Type your answer here...";
    transcript.appendChild(el("span", { class: "text-faint" }, placeholder));

    let finalText = "";
    let dictation = null;
    let listening = false;

    function paint(fin, interim = "") {
      transcript.innerHTML = "";
      if (!fin && !interim) {
        transcript.appendChild(el("span", { class: "text-faint" }, placeholder));
        return;
      }
      if (fin) transcript.appendChild(document.createTextNode(fin));
      if (interim) transcript.appendChild(el("span", { class: "text-faint" }, (fin ? " " : "") + interim));
    }

    const status = el("span", { class: "text-faint", style: "font-size:.85rem" }, "");

    const micBtn = el("button", { class: "btn btn-primary btn-lg" }, canSpeak ? "🎤 Start speaking" : "🎤 Mic unavailable");
    if (!canSpeak) micBtn.disabled = true;

    micBtn.addEventListener("click", () => {
      if (!listening) {
        listening = true;
        micBtn.textContent = "⏹ Stop";
        micBtn.classList.remove("btn-primary");
        micBtn.classList.add("btn-danger");
        status.textContent = "Listening... speak in Spanish";
        dictation = startDictation({
          onInterim: (fin, interim) => { finalText = fin; paint(fin, interim); },
          onStateChange: (s) => {
            if (s === "denied") {
              status.textContent = "Mic permission denied — you can type your answer instead.";
              resetMic();
            }
          },
          onError: (e) => { status.textContent = `Mic error: ${e}. You can type instead.`; }
        });
      } else {
        const text = dictation ? dictation.stop() : finalText;
        finalText = text || finalText;
        paint(finalText);
        resetMic();
        status.textContent = finalText ? "Got it — edit below if needed, then submit." : "Didn't catch anything. Try again or type it.";
      }
    });

    function resetMic() {
      listening = false;
      micBtn.textContent = "🎤 Start speaking";
      micBtn.classList.add("btn-primary");
      micBtn.classList.remove("btn-danger");
    }

    const ta = el("textarea", { placeholder: canSpeak ? "…or type / edit your answer here" : "Type your answer in Spanish..." });
    ta.style.marginTop = ".6rem";
    ta.addEventListener("input", () => { finalText = ta.value; });

    const submit = el("button", { class: "btn btn-success", onclick: () => {
      const answer = (ta.value.trim() || finalText || "").trim();
      if (answer.length < 3) {
        toast("Say or type an answer first.", { type: "error" });
        return;
      }
      if (dictation && listening) dictation.stop();
      blurActive();

      if (pendingComplication) {
        finalizeTurn((draftText + " " + answer).trim());
        draftText = "";
        pendingComplication = null;
        pendingSecondTurnKind = null;
      } else if (task.complication || task.followUp) {
        draftText = answer;
        pendingSecondTurnKind = task.complication ? "complication" : "followUp";
        pendingComplication = task.complication || task.followUp;
        renderTurn();
      } else {
        finalizeTurn(answer);
      }
    } }, pendingComplication ? "Respond & continue →" : "Submit & continue →");

    card.appendChild(transcript);
    card.appendChild(el("div", { class: "btn-row", style: "margin-top:.7rem;align-items:center" }, [micBtn, status]));
    card.appendChild(ta);
    card.appendChild(el("div", { class: "btn-row", style: "margin-top:.6rem" }, [
      submit,
      el("button", { class: "btn btn-ghost", onclick: () => { if (dictation && listening) dictation.stop(); paint(""); finalText = ""; ta.value = ""; status.textContent = ""; resetMic(); } }, "Clear")
    ]));

    body.appendChild(card);
  }

  function finalizeTurn(text) {
    const task = activePick.task;
    const kind = activePick.kind;
    const scored = scoreRealWorldResponse(text, task);
    const summary = recordTaskOutcome("speaking", task, scored);
    sessionResults.push({ task, kind, text, scored, summary });

    if (summary.promoted) {
      confettiBurst();
      toast(`📈 Leveled up to ${levelAt(summary.displayedLevelIdx).label}!`, { icon: "🎉" });
    } else if (summary.regressed) {
      toast(`Level adjusted to ${levelAt(summary.displayedLevelIdx).label} based on your last few answers.`, { icon: "📉" });
    }

    activePick = null;
    renderTurn();
  }

  function renderReport() {
    progressLine.textContent = "";
    body.innerHTML = "";

    const finalState = getSkillState("speaking");
    const lvl = displayedLevel("speaking");
    const avgS = sessionResults.reduce((a, r) => a + r.scored.outcomeS, 0) / sessionResults.length;
    const changedThisSession = sessionResults.some((r) => r.summary.promoted || r.summary.regressed);

    registerStudyToday();
    addXP(25, "Speaking Test completed");
    updateSkillScore("speaking", avgS >= 0.6 ? 4 : avgS >= 0.3 ? 1 : -1);

    const log = store.state.progress.speakingTests || (store.state.progress.speakingTests = []);
    log.push({ date: todayISO(), level: legacyCompatibleCode(finalState.displayedLevelIdx), avg: Math.round(avgS * 100) });
    if (log.length > 30) log.shift();
    store.state.profile.selfReportedLevel = legacyCompatibleCode(finalState.displayedLevelIdx);
    store.save();
    if (!changedThisSession) confettiBurst();

    body.appendChild(
      el("div", { class: "card pop-in", style: "text-align:center" }, [
        el("div", { style: "font-size:2.4rem" }, "🎓"),
        el("p", { class: "text-muted", style: "margin:.2rem 0 0" }, "Your speaking level"),
        el("h2", { style: "margin:.2rem 0" }, lvl.label),
        el("span", { class: `badge badge-${lvl.code.startsWith("novice") ? "novice" : lvl.code.startsWith("intermediate") ? "intermediate" : "advanced"}` }, lvl.short),
        el("p", { class: "text-muted", style: "margin-top:.6rem" }, lvl.blurb),
        el("p", { class: "text-faint", style: "margin-top:.5rem" },
          `Rating moved ${ratingAtStart} → ${finalState.rating} this session.` + (changedThisSession ? " Your level changed based on the evidence above — see the log below." : " Not enough evidence yet to move your level; keep at it.")
        )
      ])
    );

    const dimTotals = { textType: 0, function: 0, timeFrame: 0, context: 0, accuracy: 0 };
    sessionResults.forEach((r) => Object.keys(dimTotals).forEach((d) => { dimTotals[d] += r.scored.dims[d]; }));
    const dimAverages = Object.entries(dimTotals).map(([k, v]) => [k, v / sessionResults.length]).sort((a, b) => a[1] - b[1]);
    const weakest = dimAverages[0];
    const strongest = dimAverages[dimAverages.length - 1];

    body.appendChild(
      el("div", { class: "grid grid-2", style: "margin-top:1rem" }, [
        el("div", { class: "card" }, [
          el("div", { class: "card-title" }, "💪 Strongest"),
          el("p", { class: "text-muted" }, `${DIMENSION_LABELS[strongest[0]]} (${strongest[1].toFixed(1)}/4)`)
        ]),
        el("div", { class: "card" }, [
          el("div", { class: "card-title" }, "🎯 Weakest"),
          el("p", { class: "text-muted" }, `${DIMENSION_LABELS[weakest[0]]} (${weakest[1].toFixed(1)}/4)`)
        ])
      ])
    );

    const evidenceCard = el("div", { class: "card", style: "margin-top:1rem" }, [el("div", { class: "card-title" }, "📋 This session's tasks")]);
    sessionResults.forEach((r) => {
      const changeNote = r.summary.promoted ? " · 📈 leveled up" : r.summary.regressed ? " · 📉 level adjusted" : "";
      evidenceCard.appendChild(
        el("div", { style: "padding:.55rem 0;border-bottom:1px solid var(--border)" }, [
          el("div", { class: "flex justify-between items-center" }, [
            el("strong", {}, `${FUNCTION_TITLES[r.task.function] || r.task.function} · ${r.task.context}`),
            el("span", { class: "badge badge-default" }, `${r.scored.total}/20 · ${r.scored.outcomeS === 1 ? "pass" : r.scored.outcomeS === 0.5 ? "partial" : "needs work"}${changeNote}`)
          ]),
          el("p", { class: "es-text", style: "margin:.3rem 0 0" }, r.text),
          el("p", { class: "text-faint", style: "margin:.25rem 0 0;font-size:.85rem" }, r.scored.note)
        ])
      );
    });
    body.appendChild(evidenceCard);

    if (finalState.evidenceLog.length) {
      const historyCard = el("div", { class: "card", style: "margin-top:1rem" }, [el("div", { class: "card-title" }, "📈 Level history")]);
      finalState.evidenceLog.slice(-10).reverse().forEach((e) => {
        historyCard.appendChild(
          el("p", { class: "text-muted", style: "margin:.3rem 0" },
            `${e.date} — ${e.type === "promotion" ? "Advanced" : "Adjusted down"} from ${levelAt(e.fromLevelIdx).label} to ${levelAt(e.toLevelIdx).label}`)
        );
      });
      body.appendChild(historyCard);
    }

    body.appendChild(
      el("div", { class: "btn-row", style: "margin-top:1rem" }, [
        el("button", { class: "btn btn-primary", onclick: () => {
          sessionUsedIds = []; sessionResults = []; pendingComplication = null; pendingSecondTurnKind = null; activePick = null; draftText = "";
          renderTurn();
        } }, "Take another session"),
        el("a", { class: "btn", href: "#/practice" }, "Back to practice")
      ])
    );
  }
}
