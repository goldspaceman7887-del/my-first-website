// SAVE PROGRESS — makes saving visible and portable.
//
// Progress saves itself on this device automatically; this screen exists so
// you can (a) see that it's working, (b) take a backup you can keep, and
// (c) move everything to another device with a copy-pasteable code.

import { store } from "../core/storage.js";
import { el, toast } from "../core/ui.js";
import {
  downloadBackup, makeCode, restoreFromCode, restoreFromJSON,
  describeLastSaved, progressSummary
} from "../core/backup.js";

function summaryLine() {
  const s = progressSummary();
  return `${s.xp} XP · ${s.streak}-day streak · ${s.units} unit(s) done · ${s.words} word(s) practised`;
}

export function renderSaveProgress(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "💾 Save Progress"),
      el("p", {}, "Your progress saves automatically on this device. Use a backup to keep a copy or move to another device.")
    ])
  );

  const body = el("div", {});
  container.appendChild(body);
  render();

  function render() {
    body.innerHTML = "";

    const savedLine = el("p", { class: "text-faint", style: "margin:.3rem 0 0;font-size:.85rem" }, `Last backup taken: ${describeLastSaved()}`);
    const refreshSavedLine = () => { savedLine.textContent = `Last backup taken: ${describeLastSaved()}`; };

    // --- Status -------------------------------------------------------
    body.appendChild(
      el("div", { class: "card", style: "border-left:3px solid var(--success)" }, [
        el("div", { class: "card-title" }, "✅ Saving automatically"),
        el("p", { class: "text-muted", style: "margin-bottom:.3rem" }, "Everything you do is saved to this browser the moment it happens — no save button needed."),
        el("p", { style: "font-weight:700;margin:0" }, summaryLine()),
        savedLine
      ])
    );

    // --- Why back up --------------------------------------------------
    body.appendChild(
      el("div", { class: "card", style: "margin-top:1rem" }, [
        el("div", { class: "card-title" }, "⚠️ When you'd lose it"),
        el("p", { class: "text-muted", style: "margin-bottom:.4rem" }, "Because it lives in this browser, progress does NOT follow you automatically. It's lost if you:"),
        el("ul", { style: "margin:0;padding-left:1.2rem;color:var(--text-muted)" }, [
          el("li", {}, "clear your browsing data or site data"),
          el("li", {}, "use a private / incognito window"),
          el("li", {}, "switch to a different browser, phone, or computer")
        ]),
        el("p", { class: "text-muted", style: "margin:.5rem 0 0" }, "Take a backup below and none of that matters.")
      ])
    );

    // --- Backup -------------------------------------------------------
    const codeBox = el("textarea", {
      readonly: "",
      style: "margin-top:.5rem;min-height:90px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.78rem"
    });
    codeBox.classList.add("hidden");

    const backupCard = el("div", { class: "card", style: "margin-top:1rem" }, [
      el("div", { class: "card-title" }, "⬇️ Back up"),
      el("p", { class: "text-muted" }, "Download a file to keep, or generate a code you can paste somewhere safe (a note to yourself, a message)."),
      el("div", { class: "btn-row" }, [
        el("button", {
          class: "btn btn-primary",
          onclick: () => { downloadBackup(); toast("Backup downloaded.", { icon: "💾" }); render(); }
        }, "⬇️ Download backup file"),
        el("button", {
          class: "btn",
          onclick: () => {
            codeBox.value = makeCode();
            codeBox.classList.remove("hidden");
            codeBox.select();
            refreshSavedLine();
            toast("Code generated — copy it somewhere safe.", { icon: "🔑" });
          }
        }, "🔑 Show backup code")
      ]),
      codeBox,
      el("button", {
        class: "btn btn-sm", style: "margin-top:.5rem",
        onclick: async () => {
          if (!codeBox.value) { toast("Generate the code first.", { type: "error" }); return; }
          try {
            await navigator.clipboard.writeText(codeBox.value);
            toast("Code copied to clipboard.", { icon: "📋" });
          } catch (e) {
            codeBox.select();
            toast("Select-all and copy manually (clipboard blocked).", { type: "error" });
          }
        }
      }, "📋 Copy code")
    ]);
    body.appendChild(backupCard);

    // --- Restore ------------------------------------------------------
    const restoreInput = el("textarea", { placeholder: "Paste a backup code here (starts with MXES1:)" });
    restoreInput.style.marginTop = ".5rem";

    const fileInput = el("input", { type: "file", accept: "application/json", class: "hidden" });
    fileInput.addEventListener("change", () => {
      const f = fileInput.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => finishRestore(restoreFromJSON(reader.result));
      reader.onerror = () => toast("Couldn't read that file.", { type: "error" });
      reader.readAsText(f);
    });

    function finishRestore(res) {
      if (!res.ok) { toast(res.error, { type: "error", duration: 5000 }); return; }
      toast("Progress restored.", { icon: "✅" });
      render();
    }

    body.appendChild(
      el("div", { class: "card", style: "margin-top:1rem" }, [
        el("div", { class: "card-title" }, "⬆️ Restore"),
        el("p", { class: "text-muted" }, "Bringing progress to a new device? Restore it here. This replaces whatever progress is currently on this device."),
        el("div", { class: "btn-row" }, [
          el("button", { class: "btn", onclick: () => fileInput.click() }, "📂 Restore from file"),
          el("button", {
            class: "btn",
            onclick: () => {
              if (!confirm("Restoring replaces the progress currently on this device. Continue?")) return;
              finishRestore(restoreFromCode(restoreInput.value));
            }
          }, "🔑 Restore from code")
        ]),
        fileInput,
        restoreInput
      ])
    );

    // --- Move to another device ---------------------------------------
    body.appendChild(
      el("div", { class: "card", style: "margin-top:1rem" }, [
        el("div", { class: "card-title" }, "📱 Moving to your phone or another computer"),
        el("ol", { style: "margin:0;padding-left:1.2rem;color:var(--text-muted)" }, [
          el("li", {}, "On this device, tap “Show backup code”, then “Copy code”."),
          el("li", {}, "Send the code to yourself (message, email, note app)."),
          el("li", {}, "Open the app on the other device and come back to this screen."),
          el("li", {}, "Paste it under Restore and tap “Restore from code”.")
        ])
      ])
    );
  }
}
