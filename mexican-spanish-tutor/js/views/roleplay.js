// ROLEPLAY MODE — real-world scenarios (restaurant, airport, hotel, store,
// doctor, job interview, meeting new friends, dating, travel, family
// gathering...). The bot plays one role aloud; you produce the other role,
// then compare against a native version — corrected, never just marked wrong.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive, toast } from "../core/ui.js";
import { audioEngine, textSimilarity, speechRecognitionSupported, listenOnce } from "../core/audio.js";
import { addXP, registerStudyToday, updateSkillScore } from "../core/gamification.js";
import { DIALOGUES } from "../data/dialogues.js";

const SCENARIO_LABELS = {
  restaurant: "🌮 Restaurant", airport: "✈️ Airport", hotel: "🏨 Hotel", store: "🛍️ Store",
  doctor: "🩺 Doctor", "job-interview": "💼 Job Interview", "meeting-friends": "🤝 Meeting New Friends",
  dating: "💐 Dating", travel: "🧳 Travel in Mexico", "family-gathering": "👪 Family Gathering",
  friends: "😄 Friends", work: "🏢 Work", opinions: "💬 Opinions"
};

export function renderRoleplay(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎭 Roleplay Mode"),
      el("p", {}, "Pick a real-world scenario. The bot plays one role and speaks Spanish aloud; you produce the other side, then compare to a native Mexican version. Mistakes are corrected, never just marked wrong.")
    ])
  );

  const body = el("div", {});
  container.appendChild(body);
  showTopicPicker();

  function showTopicPicker() {
    body.innerHTML = "";
    const grid = el("div", { class: "grid grid-auto" });
    DIALOGUES.forEach((d) => {
      grid.appendChild(
        el("div", { class: "card", style: "cursor:pointer", onclick: () => startRolePlay(d) }, [
          el("span", { class: "badge badge-default" }, SCENARIO_LABELS[d.scenario] || d.scenario),
          el("h3", { style: "margin:.5rem 0 .2rem" }, d.title),
          el("p", { class: "text-muted" }, d.titleEs)
        ])
      );
    });
    body.appendChild(grid);
  }

  function startRolePlay(d) {
    body.innerHTML = "";
    const speakers = [...new Set(d.lines.map((l) => l.spk))];
    const botRole = speakers[0];
    const userRole = speakers[1] || speakers[0];

    body.appendChild(
      el("div", { class: "card", style: "margin-bottom:.75rem" }, [
        el("p", {}, [el("strong", {}, "🤖 Bot plays: "), botRole, el("br"), el("strong", {}, "🗣️ You play: "), userRole]),
        el("button", { class: "btn btn-sm", onclick: showTopicPicker }, "← Choose a different scenario")
      ])
    );

    const log = el("div", { class: "chat-log" });
    body.appendChild(log);
    const controls = el("div", {});
    body.appendChild(controls);

    let i = 0;
    let turns = 0;
    step();

    function botBubble(line) {
      log.appendChild(
        el("div", { class: "chat-bubble bot" }, [
          el("div", { class: "cb-es es-text" }, line.es),
          el("div", { class: "cb-en" }, line.en)
        ])
      );
      log.scrollTop = log.scrollHeight;
      audioEngine.speak(line.es);
    }

    function userBubble(text, note) {
      log.appendChild(
        el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-es es-text" }, text), note ? el("div", { class: "cb-en" }, note) : null].filter(Boolean))
      );
      log.scrollTop = log.scrollHeight;
    }

    function step() {
      controls.innerHTML = "";
      if (i >= d.lines.length) return finishSession();
      const line = d.lines[i];
      if (line.spk === userRole) {
        promptUserTurn(line);
      } else {
        botBubble(line);
        i++;
        setTimeout(step, 500);
      }
    }

    function promptUserTurn(line) {
      const prompt = el("div", { class: "card" }, [
        el("p", { style: "font-weight:700" }, `Tu turno como ${userRole}:`),
        el("p", { class: "text-faint" }, `(${line.en})`)
      ]);
      const input = el("input", { type: "text", placeholder: "Escribe tu respuesta en español..." });
      input.style.cssText = "width:100%;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:1.05rem;";
      const row = el("div", { class: "chat-input-row" }, [input]);
      const micBtn = speechRecognitionSupported()
        ? el("button", { class: "btn btn-sm", onclick: async () => { const r = await listenOnce(); if (r.transcript) input.value = r.transcript; } }, "🎙️")
        : null;
      if (micBtn) row.appendChild(micBtn);
      const submit = el("button", { class: "btn btn-primary", onclick: () => submitTurn() }, "Enviar");
      row.appendChild(submit);
      const revealBtn = el("button", { class: "btn btn-ghost btn-sm", onclick: () => { userBubble(line.es, "(revealed, not scored)"); i++; turns++; step(); } }, "No sé — muéstrame");
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") submitTurn(); });

      prompt.appendChild(row);
      prompt.appendChild(revealBtn);
      controls.appendChild(prompt);
      input.focus();

      function submitTurn() {
        const text = input.value.trim();
        if (!text) { toast("Type something first, or tap \"muéstrame\".", { type: "error" }); return; }
        const score = textSimilarity(text, line.es);
        const verdict = score >= 70 ? "¡Muy bien, casi idéntico!" : score >= 35 ? "Buen intento — así lo diría un mexicano:" : "Así lo diría un hablante nativo:";
        userBubble(text, `${verdict} (${score}% match)`);
        log.appendChild(
          el("div", { class: "correction-block" }, [
            el("div", { class: "co-fixed es-text" }, line.es),
            el("div", { class: "co-explain" }, line.en)
          ])
        );
        audioEngine.speak(line.es);
        updateSkillScore("speaking", score >= 60 ? 2 : 0.5);
        turns++;
        i++;
        blurActive();
        setTimeout(step, 400);
      }
    }

    function finishSession() {
      controls.innerHTML = "";
      registerStudyToday();
      store.state.progress.roleplaySessions.push({ date: todayISO(), scenarioId: d.id, turns });
      const xp = 8 + turns * 2;
      addXP(xp, `Roleplay: ${d.title}`);
      store.save();
      controls.appendChild(
        el("div", { class: "card empty-state pop-in" }, [
          el("div", { class: "empty-icon" }, "✅"),
          el("h3", {}, "¡Roleplay completo!"),
          el("p", {}, `+${xp} XP · ${turns} turnos hablados`),
          el("button", { class: "btn btn-primary", onclick: showTopicPicker }, "Probar otro escenario")
        ])
      );
    }
  }
}
