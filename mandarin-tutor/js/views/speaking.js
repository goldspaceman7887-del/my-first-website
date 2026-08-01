// SPEAKING MODE — a role-play conversation partner built from the
// Dialogues data. The bot plays one role and speaks it aloud; you play the
// other role, type (or reveal) your line, and get an immediate,
// non-judgmental correction with the native version.

import { store, todayISO } from "../core/storage.js";
import { el, blurActive, toast } from "../core/ui.js";
import { audioEngine, hanziSimilarity, speechRecognitionSupported, listenOnce } from "../core/audio.js";
import { addXP, registerStudyToday } from "../core/gamification.js";
import { DIALOGUES } from "../data/dialogues.js";

export function renderSpeaking(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎤 Speaking Mode"),
      el("p", {}, "Practice a real role-play. The bot plays one side and speaks Mandarin aloud; you produce the other side, then compare to a native version. Mistakes are corrected, never just marked wrong.")
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
          el("span", { class: "badge badge-default" }, d.category),
          el("h3", { style: "margin:.5rem 0 .2rem" }, d.title),
          el("p", { class: "text-muted" }, d.titleZh)
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
        el("button", { class: "btn btn-sm", onclick: showTopicPicker }, "← Choose a different topic")
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
          el("div", { class: "cb-zh hanzi" }, line.zh),
          el("div", { class: "cb-py" }, line.py),
          el("div", { class: "cb-en" }, line.en)
        ])
      );
      log.scrollTop = log.scrollHeight;
      audioEngine.speak(line.zh);
    }

    function userBubble(text, note) {
      log.appendChild(
        el("div", { class: "chat-bubble user" }, [el("div", { class: "cb-zh hanzi" }, text), note ? el("div", { class: "cb-en" }, note) : null].filter(Boolean))
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
        el("p", { style: "font-weight:700" }, `Your turn as ${userRole}:`),
        el("p", { class: "text-faint" }, `(${line.en})`)
      ]);
      const input = el("input", { type: "text", placeholder: "在这里输入你的回答...", class: "chat-input-row-input" });
      input.style.cssText = "width:100%;padding:.65rem .9rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-family:var(--font-zh);font-size:1.05rem;";
      const row = el("div", { class: "chat-input-row" }, [input]);
      const micBtn = speechRecognitionSupported()
        ? el("button", { class: "btn btn-sm", onclick: async () => { const r = await listenOnce(); if (r.transcript) input.value = r.transcript; } }, "🎙️")
        : null;
      if (micBtn) row.appendChild(micBtn);
      const submit = el("button", { class: "btn btn-primary", onclick: () => submitTurn() }, "Submit");
      row.appendChild(submit);
      const revealBtn = el("button", { class: "btn btn-ghost btn-sm", onclick: () => { userBubble(line.zh, "(revealed, not scored)"); i++; turns++; step(); } }, "I don't know — show me");
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") submitTurn(); });

      prompt.appendChild(row);
      prompt.appendChild(revealBtn);
      controls.appendChild(prompt);
      input.focus();

      function submitTurn() {
        const text = input.value.trim();
        if (!text) { toast("Type something first, or tap \"show me\".", { type: "error" }); return; }
        const score = hanziSimilarity(text, line.zh);
        const verdict = score >= 70 ? "Nice, very close!" : score >= 35 ? "Good attempt — here's the natural version:" : "Here's how a native speaker would say it:";
        userBubble(text, `${verdict} (${score}% match)`);
        log.appendChild(
          el("div", { class: "correction-block" }, [
            el("div", { class: "co-fixed hanzi" }, line.zh),
            el("div", { class: "co-literal" }, line.py),
            el("div", { class: "co-explain" }, line.en)
          ])
        );
        audioEngine.speak(line.zh);
        turns++;
        i++;
        blurActive();
        setTimeout(step, 400);
      }
    }

    function finishSession() {
      controls.innerHTML = "";
      registerStudyToday();
      store.state.progress.speakingSessions.push({ date: todayISO(), topicId: d.id, turns });
      const xp = 8 + turns * 2;
      addXP(xp, `Speaking Mode: ${d.title}`);
      store.save();
      controls.appendChild(
        el("div", { class: "card empty-state pop-in" }, [
          el("div", { class: "empty-icon" }, "✅"),
          el("h3", {}, "Role-play complete!"),
          el("p", {}, `+${xp} XP · ${turns} turns spoken`),
          el("button", { class: "btn btn-primary", onclick: showTopicPicker }, "Try another topic")
        ])
      );
    }
  }
}
