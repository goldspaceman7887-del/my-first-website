import { el, toast } from "../core/ui.js";
import { getState, exportData, importData, resetAll, updateSettings } from "../core/storage.js";
import { getJapaneseVoices } from "../core/audio.js";

export function render(root) {
  const state = getState();
  const container = el("div", { class: "view" });
  container.appendChild(
    el("header", { class: "view-header" }, [el("h1", {}, "⚙️ Settings"), el("p", { class: "subtitle" }, "Everything is stored locally in your browser — nothing is sent anywhere.")])
  );

  const voices = getJapaneseVoices();
  const voiceCard = el("div", { class: "card" });
  voiceCard.appendChild(el("h2", {}, "Voice"));
  if (voices.length === 0) {
    voiceCard.appendChild(el("p", { class: "muted small" }, "No ja-JP voice found on this device. Speech will still play with a default voice."));
  } else {
    const select = el(
      "select",
      {
        class: "select",
        onchange: (e) => updateSettings({ voiceName: e.target.value || null }),
      },
      [el("option", { value: "" }, "Auto (first available)"), ...voices.map((v) => el("option", { value: v.name, selected: state.settings.voiceName === v.name ? "selected" : null }, `${v.name} (${v.lang})`))]
    );
    voiceCard.appendChild(select);
  }
  container.appendChild(voiceCard);

  const dataCard = el("div", { class: "card" });
  dataCard.appendChild(el("h2", {}, "Your data"));
  dataCard.appendChild(el("p", { class: "muted small" }, `${state.recordings.length} recordings · ${state.rubricAssessments.length} self-assessments · ${state.xp} XP`));
  const exportBtn = el("button", { class: "btn" }, "Export progress (JSON)");
  exportBtn.addEventListener("click", () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jp-advanced-speaking-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  const importInput = el("input", { type: "file", accept: "application/json", class: "file-input" });
  importInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    if (importData(text)) {
      toast("Progress imported.", { type: "success" });
      render(root);
    } else {
      toast("Couldn't read that file.", { type: "error" });
    }
  });

  const resetBtn = el("button", { class: "btn danger" }, "Reset all progress");
  resetBtn.addEventListener("click", () => {
    if (confirm("This clears all recordings, XP, and progress. Are you sure?")) {
      resetAll();
      toast("Progress reset.", { type: "info" });
      render(root);
    }
  });

  dataCard.appendChild(el("div", { class: "settings-actions" }, [exportBtn, importInput, resetBtn]));
  container.appendChild(dataCard);

  root.innerHTML = "";
  root.appendChild(container);
}
