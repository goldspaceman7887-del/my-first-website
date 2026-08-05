import { store } from "../core/storage.js";
import { el, toast } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { showOnboarding } from "../core/onboarding.js";
import { describeLastSaved, downloadBackup, makeCode, restoreFromCode, restoreFromJSON } from "../core/backup.js";

export function renderSettings(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [el("h1", {}, "⚙️ Ajustes"), el("p", {}, "Personaliza tu experiencia de aprendizaje. Todo se guarda localmente en tu navegador.")])
  );

  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "¿Necesitas ayuda para empezar?"),
      el("p", { class: "text-muted" }, "Vuelve a ver la guía de bienvenida paso a paso (en inglés sencillo)."),
      el("button", { class: "btn btn-lg", onclick: () => showOnboarding() }, "🚀 Ver la guía de nuevo / Show welcome guide again")
    ])
  );

  // Profile
  const nameField = el("input", { type: "text", value: store.state.profile.name || "", placeholder: "Tu nombre (opcional)" });
  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "Perfil"),
      el("div", { class: "field" }, [el("label", {}, "Nombre"), nameField]),
      el("button", { class: "btn btn-sm", onclick: () => { store.set("profile.name", nameField.value); toast("Guardado", { icon: "✅" }); } }, "Guardar")
    ])
  );

  // Theme
  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "Apariencia"),
      el("div", { class: "field" }, [
        el("label", {}, "Tema"),
        selectField(
          [
            ["auto", "Automático (sistema)"],
            ["light", "Claro"],
            ["dark", "Oscuro"]
          ],
          store.state.settings.theme,
          (v) => {
            store.set("settings.theme", v);
            document.documentElement.toggleAttribute("data-theme", v !== "auto");
            if (v !== "auto") document.documentElement.setAttribute("data-theme", v);
            else document.documentElement.removeAttribute("data-theme");
          }
        )
      ])
    ])
  );

  // Immersion
  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "Nivel de inmersión"),
      el("p", { class: "text-muted" }, "Controla cuánta traducción al inglés se muestra por defecto en los diálogos."),
      el(
        "div",
        { class: "level-pills" },
        [1, 2, 3, 4].map((lvl) =>
          el(
            "button",
            {
              class: `level-pill ${store.state.settings.immersionLevel === lvl ? "active" : ""}`,
              onclick: (e) => {
                store.set("settings.immersionLevel", lvl);
                document.getElementById("immersion-select").value = String(lvl);
                e.currentTarget.parentElement.querySelectorAll(".level-pill").forEach((b) => b.classList.remove("active"));
                e.currentTarget.classList.add("active");
              }
            },
            `Nivel ${lvl}`
          )
        )
      )
    ])
  );

  // Audio
  const voices = audioEngine.spainVoices();
  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "🔊 Audio (voces es-ES)"),
      el("div", { class: "field" }, [
        el("label", {}, "Voz preferida"),
        selectField(
          [["", "Automática"], ...voices.map((v) => [v.name, `${v.name} (${v.lang})`])],
          store.state.settings.preferredVoiceName || "",
          (v) => store.set("settings.preferredVoiceName", v || null)
        )
      ]),
      el("div", { class: "field" }, [
        el("label", {}, "Género de voz preferido"),
        selectField(
          [
            ["any", "Cualquiera"],
            ["female", "Femenina"],
            ["male", "Masculina"]
          ],
          store.state.settings.preferredVoiceGender,
          (v) => store.set("settings.preferredVoiceGender", v)
        )
      ]),
      rangeField("Velocidad normal", "voiceRate", 0.5, 1.5, 0.05),
      rangeField("Velocidad lenta", "slowVoiceRate", 0.3, 1, 0.05),
      checkboxField("Reproducir audio automáticamente en tarjetas", "autoplayAudio"),
      el(
        "button",
        { class: "btn btn-sm", onclick: () => audioEngine.speak("Hola, esto es una prueba de la voz en español de España.") },
        "🔊 Probar voz"
      ),
      !audioEngine.isSupported() ? el("p", { class: "text-faint" }, "Tu navegador no soporta síntesis de voz.") : null
    ].filter(Boolean))
  );

  // Goals
  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "Meta diaria"),
      el("div", { class: "field" }, [
        el("label", {}, "XP objetivo por día"),
        el("input", {
          type: "text",
          value: store.state.settings.dailyGoalXP,
          onchange: (e) => {
            const v = Math.max(10, parseInt(e.target.value) || 50);
            store.set("settings.dailyGoalXP", v);
          }
        })
      ])
    ])
  );

  // Data management / backup
  const savedLine = el("p", { class: "text-muted" }, `Last saved: ${describeLastSaved()} · Última copia: ${describeLastSaved()}`);
  const codeBox = el("textarea", { readonly: "readonly", rows: "4", style: "width:100%;font-family:monospace;font-size:.78rem;margin-top:.6rem", placeholder: "Tu código de copia de seguridad aparecerá aquí..." });
  const restoreInput = el("textarea", { rows: "4", style: "width:100%;font-family:monospace;font-size:.78rem;margin-top:.6rem", placeholder: "Pega aquí tu código VAMOS1:... para restaurar" });
  container.appendChild(
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "💾 Datos y copia de seguridad · Data & backup"),
      el("p", { class: "text-muted" }, "Everything saves automatically on this device only — nothing is sent to a server. Use these to move your progress to another device or as extra insurance."),
      savedLine,
      el("div", { class: "btn-row", style: "margin-top:.5rem" }, [
        el(
          "button",
          {
            class: "btn btn-primary",
            onclick: () => {
              downloadBackup();
              savedLine.textContent = `Last saved: ${describeLastSaved()} · Última copia: ${describeLastSaved()}`;
              toast("Backup downloaded", { icon: "⬇️" });
            }
          },
          "⬇️ Download backup file"
        ),
        el(
          "button",
          {
            class: "btn",
            onclick: () => {
              const inputFile = document.createElement("input");
              inputFile.type = "file";
              inputFile.accept = "application/json";
              inputFile.onchange = () => {
                const file = inputFile.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const result = restoreFromJSON(reader.result);
                  if (result.ok) {
                    toast("Progreso importado.", { icon: "✅" });
                    window.location.hash = "#/dashboard";
                    window.location.reload();
                  } else {
                    toast(result.error, { icon: "⚠️" });
                  }
                };
                reader.readAsText(file);
              };
              inputFile.click();
            }
          },
          "⬆️ Import backup file"
        )
      ]),
      el("div", { class: "field", style: "margin-top:1rem" }, [
        el("label", {}, "📋 Copy a backup code (paste it on another device)"),
        el(
          "button",
          {
            class: "btn btn-sm",
            onclick: () => {
              codeBox.value = makeCode();
              codeBox.select();
              savedLine.textContent = `Last saved: ${describeLastSaved()} · Última copia: ${describeLastSaved()}`;
              toast("Code generated — copy it now", { icon: "📋" });
            }
          },
          "Generate code"
        ),
        codeBox
      ]),
      el("div", { class: "field", style: "margin-top:1rem" }, [
        el("label", {}, "🔁 Restore from a backup code"),
        restoreInput,
        el(
          "button",
          {
            class: "btn btn-sm",
            style: "margin-top:.4rem",
            onclick: () => {
              const result = restoreFromCode(restoreInput.value);
              if (result.ok) {
                toast("Progress restored!", { icon: "✅" });
                window.location.hash = "#/dashboard";
                window.location.reload();
              } else {
                toast(result.error, { icon: "⚠️" });
              }
            }
          },
          "Restore"
        )
      ]),
      el("div", { class: "btn-row", style: "margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border)" }, [
        el(
          "button",
          {
            class: "btn btn-danger",
            onclick: () => {
              if (confirm("¿Seguro que quieres borrar todo tu progreso? Esta acción no se puede deshacer.")) {
                store.resetAll();
                toast("Progreso reiniciado.", { icon: "🗑️" });
                window.location.hash = "#/dashboard";
                window.location.reload();
              }
            }
          },
          "🗑️ Borrar todo el progreso"
        )
      ])
    ])
  );

  function selectField(options, current, onChange) {
    const sel = el(
      "select",
      { onchange: (e) => onChange(e.target.value) },
      options.map(([val, label]) => el("option", { value: val, selected: String(val) === String(current) ? "selected" : null }, label))
    );
    return sel;
  }

  function rangeField(label, key, min, max, step) {
    const valueLabel = el("span", { class: "text-muted" }, String(store.state.settings[key]));
    const input = el("input", {
      type: "range",
      min: String(min),
      max: String(max),
      step: String(step),
      value: String(store.state.settings[key]),
      style: "width:100%",
      oninput: (e) => {
        valueLabel.textContent = e.target.value;
        store.set(`settings.${key}`, parseFloat(e.target.value));
      }
    });
    return el("div", { class: "field" }, [el("label", {}, [label, " (", valueLabel, ")"]), input]);
  }

  function checkboxField(label, key) {
    const input = el("input", {
      type: "checkbox",
      checked: store.state.settings[key] ? "checked" : null,
      onchange: (e) => store.set(`settings.${key}`, e.target.checked)
    });
    return el("label", { class: "flex items-center gap-1", style: "font-weight:600;font-size:.9rem" }, [input, label]);
  }
}
