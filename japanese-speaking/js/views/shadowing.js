import { MODELS } from "../data/models.js";
import { FUNCTIONS } from "../data/prompts.js";
import { el } from "../core/ui.js";
import { renderHighlighted, stripHighlightMarkup } from "../core/ui.js";
import { speak, stopSpeaking, getJapaneseVoices } from "../core/audio.js";
import { getState, updateSettings } from "../core/storage.js";

let filterFn = "all";
let showTranslation = {};

export function render(root) {
  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "🔁 Shadowing Library"),
      el("p", { class: "subtitle" }, "Listen to model paragraphs, then repeat them out loud matching rhythm and where the connectors land. Highlighted words are your cohesion toolkit in action."),
    ])
  );

  const state = getState();
  const speedRow = el("div", { class: "card speed-card" }, [
    el("label", {}, [
      `Playback speed: ${state.settings.rate.toFixed(2)}x`,
      el("input", {
        type: "range",
        min: "0.5",
        max: "1.1",
        step: "0.05",
        value: String(state.settings.rate),
        oninput: (e) => updateSettings({ rate: parseFloat(e.target.value) }),
      }),
    ]),
  ]);
  container.appendChild(speedRow);

  const filterRow = el("div", { class: "chip-row" });
  filterRow.appendChild(el("button", { class: `chip ${filterFn === "all" ? "active" : ""}`, onclick: () => { filterFn = "all"; render(root); } }, "All"));
  FUNCTIONS.forEach((f) => {
    filterRow.appendChild(el("button", { class: `chip ${filterFn === f.id ? "active" : ""}`, onclick: () => { filterFn = f.id; render(root); } }, f.title));
  });
  container.appendChild(filterRow);

  const list = el("div", { class: "model-list" });
  MODELS.filter((m) => filterFn === "all" || m.functionId === filterFn).forEach((m) => {
    const fn = FUNCTIONS.find((f) => f.id === m.functionId);
    const card = el("div", { class: "card model-card" });
    card.appendChild(el("div", { class: "model-tag" }, fn.title));
    card.appendChild(el("h3", {}, m.title));
    const jpBlock = el("p", { class: "model-jp", lang: "ja" });
    jpBlock.appendChild(renderHighlighted(m.jp));
    card.appendChild(jpBlock);

    if (showTranslation[m.id]) {
      card.appendChild(el("p", { class: "muted model-en" }, m.en));
    }

    const btnRow = el("div", { class: "model-btn-row" });
    btnRow.appendChild(
      el("button", { class: "btn primary", onclick: () => speak(stripHighlightMarkup(m.jp), { rate: getState().settings.rate }) }, "▶ Play (normal)")
    );
    btnRow.appendChild(
      el("button", { class: "btn", onclick: () => speak(stripHighlightMarkup(m.jp), { rate: Math.max(0.5, getState().settings.rate - 0.25) }) }, "▶ Play (slow)")
    );
    btnRow.appendChild(el("button", { class: "btn", onclick: stopSpeaking }, "■ Stop"));
    btnRow.appendChild(
      el(
        "button",
        {
          class: "btn subtle",
          onclick: () => {
            showTranslation[m.id] = !showTranslation[m.id];
            render(root);
          },
        },
        showTranslation[m.id] ? "Hide translation" : "Show translation"
      )
    );
    card.appendChild(btnRow);
    list.appendChild(card);
  });
  container.appendChild(list);

  if (getJapaneseVoices().length === 0) {
    container.appendChild(
      el("p", { class: "muted small" }, "No Japanese voice detected on this device yet — speech synthesis will use a default voice, or check your OS/browser language settings for a ja-JP voice.")
    );
  }

  root.innerHTML = "";
  root.appendChild(container);
}
