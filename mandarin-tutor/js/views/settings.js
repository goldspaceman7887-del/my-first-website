import { store } from "../core/storage.js";
import { el, toast, downloadJSON } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";

function field(labelText, inputEl) {
  return el("div", { class: "field" }, [el("label", {}, labelText), inputEl]);
}

export function renderSettings(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [el("h1", {}, "⚙️ Settings"), el("p", {}, "Voice, pacing, and your progress data.")])
  );

  const card = el("div", { class: "card" });
  container.appendChild(card);

  const rateInput = el("input", { type: "text", value: String(store.state.settings.voiceRate) });
  rateInput.addEventListener("change", () => {
    const v = parseFloat(rateInput.value);
    if (!isNaN(v)) store.set("settings.voiceRate", v);
  });
  card.appendChild(field("Normal speech rate (0.5–1.5)", rateInput));

  const slowRateInput = el("input", { type: "text", value: String(store.state.settings.slowVoiceRate) });
  slowRateInput.addEventListener("change", () => {
    const v = parseFloat(slowRateInput.value);
    if (!isNaN(v)) store.set("settings.slowVoiceRate", v);
  });
  card.appendChild(field("Slow speech rate (0.3–0.8)", slowRateInput));

  const genderSelect = el("select", {}, [
    el("option", { value: "any" }, "Any voice"),
    el("option", { value: "female" }, "Prefer female"),
    el("option", { value: "male" }, "Prefer male")
  ]);
  genderSelect.value = store.state.settings.preferredVoiceGender || "any";
  genderSelect.addEventListener("change", () => store.set("settings.preferredVoiceGender", genderSelect.value));
  card.appendChild(field("Voice preference", genderSelect));

  card.appendChild(el("button", { class: "btn btn-sm", onclick: () => audioEngine.speak("你好，很高兴认识你。") }, "🔊 Test voice"));

  const autoplayToggle = el("input", { type: "checkbox" });
  autoplayToggle.checked = !!store.state.settings.autoplayAudio;
  autoplayToggle.addEventListener("change", () => store.set("settings.autoplayAudio", autoplayToggle.checked));
  card.appendChild(el("div", { class: "field", style: "flex-direction:row;align-items:center;gap:.6rem" }, [autoplayToggle, el("label", {}, "Autoplay audio on flashcards")]));

  const dailyGoalInput = el("input", { type: "text", value: String(store.state.settings.dailyGoalXP) });
  dailyGoalInput.addEventListener("change", () => {
    const v = parseInt(dailyGoalInput.value, 10);
    if (!isNaN(v) && v > 0) store.set("settings.dailyGoalXP", v);
  });
  card.appendChild(field("Daily XP goal", dailyGoalInput));

  const immersionSelect = el("select", {}, [
    el("option", { value: "1" }, "1 · Heavy English support"),
    el("option", { value: "2" }, "2 · Mixed"),
    el("option", { value: "3" }, "3 · Mostly Chinese"),
    el("option", { value: "4" }, "4 · Chinese only")
  ]);
  immersionSelect.value = String(store.state.settings.immersionLevel || 1);
  immersionSelect.addEventListener("change", () => store.set("settings.immersionLevel", Number(immersionSelect.value)));
  card.appendChild(field("Immersion level", immersionSelect));

  const themeSelect = el("select", {}, [
    el("option", { value: "auto" }, "Auto (match system)"),
    el("option", { value: "light" }, "Light"),
    el("option", { value: "dark" }, "Dark")
  ]);
  themeSelect.value = store.state.settings.theme || "auto";
  themeSelect.addEventListener("change", () => {
    store.set("settings.theme", themeSelect.value);
    if (themeSelect.value === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", themeSelect.value);
  });
  card.appendChild(field("Theme", themeSelect));

  const dataCard = el("div", { class: "card", style: "margin-top:1rem" }, [
    el("h3", { class: "card-title" }, "Your data"),
    el("p", { class: "text-muted" }, "Your progress is saved automatically in this browser as you go — no action needed. To back it up or move it to another device or browser, download a save file below and import it there.")
  ]);
  container.appendChild(dataCard);

  dataCard.appendChild(
    el(
      "button",
      {
        class: "btn",
        onclick: () => downloadJSON("mandarin-tutor-progress.json", store.exportJSON())
      },
      "⬇️ Export progress"
    )
  );

  const importInput = el("input", { type: "file", accept: "application/json", class: "hidden" });
  importInput.addEventListener("change", () => {
    const file = importInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        store.importJSON(reader.result);
        toast("Progress imported.", { type: "success" });
      } catch (e) {
        toast("Could not read that file.", { type: "error" });
      }
    };
    reader.readAsText(file);
  });
  dataCard.appendChild(importInput);
  dataCard.appendChild(el("button", { class: "btn", style: "margin-left:.5rem", onclick: () => importInput.click() }, "⬆️ Import progress"));

  dataCard.appendChild(
    el(
      "button",
      {
        class: "btn btn-danger",
        style: "margin-left:.5rem",
        onclick: () => {
          if (confirm("This will erase all progress on this device. Are you sure?")) {
            store.resetAll();
            toast("Progress reset.", { type: "info" });
            window.location.hash = "#/dashboard";
            window.location.reload();
          }
        }
      },
      "🗑️ Reset all progress"
    )
  );
}
