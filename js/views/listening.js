import { store } from "../core/storage.js";
import { el, esc } from "../core/ui.js";
import { audioEngine, textSimilarity } from "../core/audio.js";
import { gradeItem, QUALITY } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { ALL_DIALOGUES } from "./dialogues.js";
import { READINGS } from "../data/reading.js";

function buildListeningPool() {
  const fromDialogues = ALL_DIALOGUES.map((d) => ({
    id: `listen_dlg_${d.id}`,
    title: d.title,
    level: d.level,
    text: d.lines.map((l) => l.es).join(" "),
    translation: d.lines.map((l) => `${l.speaker}: ${l.en}`).join(" "),
    source: "Diálogo",
    href: `#/dialogues/${d.id}`
  }));
  const fromReadings = (READINGS || []).map((r) => ({
    id: `listen_read_${r.id}`,
    title: r.title,
    level: r.level,
    text: r.text,
    translation: r.translation,
    source: "Lectura",
    href: `#/reading/${r.id}`
  }));
  return [...fromDialogues, ...fromReadings];
}

export function renderListening(container) {
  const pool = buildListeningPool();
  const state = { level: "all", mode: "comprehension" };

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🎧 Sistema de escucha"),
      el("p", {}, "Escucha español auténtico de España a velocidad lenta y natural. Comprensión, dictado y repaso auditivo.")
    ])
  );

  const tabs = el("div", { class: "tabs" }, [
    tabBtn("comprehension", "Comprensión"),
    tabBtn("dictation", "Dictado libre")
  ]);
  container.appendChild(tabs);
  const body = el("div", {});
  container.appendChild(body);

  function tabBtn(id, label) {
    const b = el("button", { class: `tab-btn ${state.mode === id ? "active" : ""}`, onclick: () => setMode(id) }, label);
    b.dataset.id = id;
    return b;
  }
  function setMode(id) {
    state.mode = id;
    tabs.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.id === id));
    renderBody();
  }

  function renderBody() {
    body.innerHTML = "";
    const levels = ["all", ...new Set(pool.map((p) => p.level))];
    const pills = el(
      "div",
      { class: "level-pills", style: "margin-bottom:1rem" },
      levels.map((l) =>
        el(
          "button",
          { class: `level-pill ${state.level === l ? "active" : ""}`, onclick: () => { state.level = l; renderBody(); } },
          l === "all" ? "Todos" : l
        )
      )
    );
    body.appendChild(pills);

    const filtered = pool.filter((p) => state.level === "all" || p.level === state.level).slice(0, 40);
    const grid = el("div", { class: "grid grid-2" });
    filtered.forEach((item) => grid.appendChild(listeningCard(item)));
    body.appendChild(grid);
  }

  function listeningCard(item) {
    let revealed = false;
    const card = el("div", { class: "card" }, [
      el("div", { class: "flex justify-between items-center" }, [
        el("span", { class: "badge badge-level" }, item.level),
        el("span", { class: "badge badge-default" }, item.source)
      ]),
      el("h3", { style: "margin:.4rem 0" }, item.title)
    ]);
    const controls = el("div", { class: "audio-controls-row" }, [
      el("button", { class: "btn btn-sm", onclick: () => audioEngine.speak(item.text, { rate: store.state.settings.slowVoiceRate }) }, "🐢 Lento"),
      el("button", { class: "btn btn-sm", onclick: () => audioEngine.speak(item.text, { rate: store.state.settings.voiceRate }) }, "🗣️ Natural"),
      el("button", { class: "btn btn-sm", onclick: () => audioEngine.speak(item.text, { rate: 1.15 }) }, "⚡ Rápido")
    ]);
    card.appendChild(controls);

    if (state.mode === "comprehension") {
      const transWrap = el("div", { class: "hidden" }, [el("p", { class: "text-muted" }, item.translation)]);
      card.appendChild(
        el("button", {
          class: "btn btn-sm btn-ghost",
          onclick: (e) => {
            revealed = !revealed;
            transWrap.classList.toggle("hidden", !revealed);
            e.target.textContent = revealed ? "Ocultar traducción" : "Ver traducción";
            if (revealed) {
              gradeItem(item.id, "listening", QUALITY.GOOD);
              addXP(3, "Escucha");
              updateSkillScore("listening", 0.8);
            }
          }
        }, "Ver traducción")
      );
      card.appendChild(transWrap);
      card.appendChild(el("a", { href: item.href, class: "text-muted", style: "font-size:.8rem" }, "Abrir contenido completo →"));
    } else {
      const input = el("textarea", { placeholder: "Escucha y escribe lo que oigas...", style: "width:100%;min-height:70px;margin-top:.5rem" });
      const fb = el("div", { class: "feedback-block hidden" });
      card.appendChild(input);
      card.appendChild(
        el("button", {
          class: "btn btn-primary btn-sm",
          style: "margin-top:.4rem",
          onclick: () => {
            const score = textSimilarity(input.value, item.text);
            fb.classList.remove("hidden", "correct", "incorrect");
            fb.classList.add(score >= 65 ? "correct" : "incorrect");
            fb.innerHTML = `Precisión: <strong>${score}%</strong><br><span class="text-faint">${esc(item.text)}</span>`;
            gradeItem(item.id, "listening", score >= 65 ? QUALITY.GOOD : QUALITY.AGAIN);
            addXP(score >= 65 ? 6 : 2, "Dictado");
            updateSkillScore("listening", score >= 65 ? 1.5 : -0.5);
          }
        }, "Comprobar")
      );
      card.appendChild(fb);
    }
    return card;
  }

  renderBody();
}
