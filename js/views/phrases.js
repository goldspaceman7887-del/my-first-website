// PHRASES — a simple, calm place to browse and listen to real everyday
// Spain expressions (vale, venga, qué guay...), separate from Speaking
// practice where these same expressions are only used as prompts.
//
// No quiz here, no hearts, nothing to get wrong — just tap 🔊 as many times
// as you like until a phrase sounds familiar. Matches the "phrases" section
// of apps like HelloChinese: short, real, high-frequency expressions taught
// on their own, alongside (not instead of) grammar and vocabulary.

import { store } from "../core/storage.js";
import { el } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { EXPRESSIONS } from "../data/expressions.js";

const REGISTER_LABEL = {
  neutral: "Uso general",
  informal: "Informal",
  "youth-slang": "Jerga joven"
};
const REGISTER_BADGE = {
  neutral: "badge-default",
  informal: "badge-informal",
  "youth-slang": "badge-slang"
};

function playBtn(text, { slow, big } = {}) {
  return el(
    "button",
    {
      class: "play-btn",
      style: big ? "width:54px;height:54px;font-size:1.5rem" : "",
      "aria-label": "Escuchar · Listen",
      title: "Escuchar de nuevo · Listen again",
      onclick: () => audioEngine.speak(text, slow && slow() ? { rate: store.state.settings.slowVoiceRate } : {})
    },
    "🔊"
  );
}

export function renderPhrases(container) {
  let slow = false;

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "💡 Frases · Phrases"),
      el("p", {}, "Real, everyday Spain expressions you'll hear constantly — vale, venga, qué guay. Tap 🔊 on any phrase to hear it, as many times as you want. No quiz, no pressure."),
      el("p", { class: "text-faint" }, `${EXPRESSIONS.length} frases auténticas de España.`)
    ])
  );

  const slowBtn = el(
    "button",
    {
      class: "btn btn-sm",
      onclick: () => {
        slow = !slow;
        slowBtn.classList.toggle("active", slow);
        slowBtn.textContent = slow ? "🐢 Hablando despacio · ON" : "🐢 Hablar más despacio";
      }
    },
    "🐢 Hablar más despacio"
  );
  const playAllBtn = el(
    "button",
    {
      class: "btn btn-sm btn-primary",
      onclick: async () => {
        playAllBtn.disabled = true;
        const rate = slow ? store.state.settings.slowVoiceRate : undefined;
        for (const e of EXPRESSIONS) {
          await audioEngine.speak(e.es, rate ? { rate } : {});
        }
        playAllBtn.disabled = false;
      }
    },
    "▶️ Escuchar todas las frases"
  );
  container.appendChild(
    el("div", { class: "card", style: "text-align:center;margin-bottom:1rem" }, [
      el("div", { class: "btn-row", style: "justify-content:center" }, [playAllBtn, slowBtn])
    ])
  );

  const grid = el("div", { class: "flex-col gap-2" });
  EXPRESSIONS.forEach((e) => {
    const card = el("div", { class: "card" }, [
      el("div", { class: "flex justify-between items-start", style: "gap:.75rem" }, [
        el("div", { style: "display:flex;align-items:center;gap:.75rem" }, [
          playBtn(e.es, { slow: () => slow, big: true }),
          el("div", {}, [
            el("div", { class: "es-text-lg", style: "font-weight:800" }, e.es),
            el("div", { class: "text-muted", style: "font-size:.85rem" }, e.actualMeaning)
          ])
        ]),
        el("span", { class: `badge ${REGISTER_BADGE[e.register] || "badge-default"}` }, REGISTER_LABEL[e.register] || e.register)
      ]),
      e.literal ? el("p", { class: "text-faint", style: "margin:.6rem 0 0;font-size:.85rem" }, `Literalmente: ${e.literal}`) : null,
      el("p", { style: "margin:.5rem 0 0" }, e.context),
      e.example
        ? el("div", { class: "flex justify-between items-center", style: "gap:.5rem;margin-top:.7rem;padding-top:.7rem;border-top:1px solid var(--border)" }, [
            el("div", {}, [
              el("div", { class: "es-text" }, e.example.es),
              el("div", { class: "text-muted", style: "font-size:.85rem" }, e.example.en)
            ]),
            playBtn(e.example.es, { slow: () => slow })
          ])
        : null
    ].filter(Boolean));
    grid.appendChild(card);
  });
  container.appendChild(grid);
}
