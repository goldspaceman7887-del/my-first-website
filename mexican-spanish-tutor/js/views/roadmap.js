// ACTFL CAN-DO SYSTEM — browse the 7 levels, check off Can-Do statements,
// and work through the roadmap path of level-appropriate sentences.

import { store, todayISO } from "../core/storage.js";
import { el, progressBar, blurActive, toast } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { addXP, registerStudyToday } from "../core/gamification.js";
import { ACTFL_LEVELS, ROADMAP_UNITS, levelIndex } from "../data/roadmap.js";

function canDoId(levelCode, i) {
  return `${levelCode}__${i}`;
}
function isCanDoChecked(id) {
  return (store.state.progress.canDoCompleted || []).includes(id);
}
function toggleCanDo(id) {
  const list = store.state.progress.canDoCompleted || (store.state.progress.canDoCompleted = []);
  const i = list.indexOf(id);
  if (i === -1) {
    list.push(id);
    addXP(5, "Can-Do checked off");
  } else {
    list.splice(i, 1);
    store.save();
  }
}

export function renderRoadmap(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🗺️ ACTFL Roadmap"),
      el("p", {}, "Novice Low through Advanced Low — the exact scale this app tracks. Check off Can-Do statements as you genuinely feel you can do them, and work through level-appropriate sentences below.")
    ])
  );

  let tab = "candos";
  const tabs = el("div", { class: "tabs" }, [tabBtn("candos", "Can-Do statements"), tabBtn("path", "Sentence path")]);
  container.appendChild(tabs);
  const body = el("div", {});
  container.appendChild(body);

  function tabBtn(id, label) {
    return el("button", { class: `tab-btn ${tab === id ? "active" : ""}`, onclick: () => setTab(id) }, label);
  }
  function setTab(id) {
    tab = id;
    tabs.querySelectorAll(".tab-btn").forEach((b, i) => b.classList.toggle("active", (i === 0 ? "candos" : "path") === id));
    renderBody();
  }
  function renderBody() {
    body.innerHTML = "";
    body.appendChild(tab === "candos" ? renderCanDos() : renderPath());
  }

  function renderCanDos() {
    const wrap = el("div", {});
    const all = ACTFL_LEVELS.flatMap((l) => l.canDo.map((_, i) => canDoId(l.code, i)));
    const checked = (store.state.progress.canDoCompleted || []).filter((id) => all.includes(id));
    wrap.appendChild(
      el("div", { class: "roadmap-progress-summary" }, [
        el("span", { class: "text-muted" }, `${checked.length} / ${all.length} checked off`),
        progressBar(Math.round((checked.length / all.length) * 100))
      ])
    );
    ACTFL_LEVELS.forEach((l) => {
      const card = el("div", { class: "card", style: "margin-top:.75rem" }, [
        el("div", { class: "flex justify-between items-center" }, [
          el("div", { class: "card-title" }, `${l.label} (${l.short})`),
          el("span", { class: `badge badge-${l.code.startsWith("novice") ? "novice" : l.code.startsWith("intermediate") ? "intermediate" : "advanced"}` }, l.short)
        ]),
        el("p", { class: "text-muted" }, l.blurb)
      ]);
      l.canDo.forEach((c, i) => {
        const id = canDoId(l.code, i);
        const checkedNow = isCanDoChecked(id);
        const check = el("button", { class: `can-do-check ${checkedNow ? "checked" : ""}`, "aria-label": "Toggle can-do" }, checkedNow ? "✓" : "");
        check.addEventListener("click", () => {
          blurActive();
          toggleCanDo(id);
          check.classList.toggle("checked");
          check.textContent = check.classList.contains("checked") ? "✓" : "";
        });
        card.appendChild(el("div", { class: "can-do-item" }, [check, el("span", {}, c)]));
      });
      wrap.appendChild(card);
    });
    return wrap;
  }

  function renderPath() {
    const wrap = el("div", { class: "roadmap-path" });
    let lastLevel = null;
    ROADMAP_UNITS.forEach((u, idx) => {
      if (u.level !== lastLevel) {
        lastLevel = u.level;
        const l = ACTFL_LEVELS.find((x) => x.code === u.level);
        wrap.appendChild(el("div", { class: "roadmap-tier-header" }, [el("h3", {}, `${l.label} (${l.short})`), el("p", { class: "text-muted" }, l.blurb)]));
      }
      const offset = idx % 2 === 0 ? "offset-left" : "offset-right";
      const done = (store.state.progress.roadmapUnitsCompleted || []).includes(u.id);
      const row = el("div", { class: `roadmap-node-row ${offset}` }, [
        el("button", { class: `roadmap-node ${done ? "completed" : "unlocked"}`, onclick: () => openUnit(u) }, [
          el("div", { class: "roadmap-node-circle" }, u.icon),
          el("div", { class: "roadmap-node-label" }, u.title)
        ])
      ]);
      wrap.appendChild(row);
    });
    const detail = el("div", { style: "margin-top:1.5rem" });
    wrap.appendChild(detail);

    function openUnit(u) {
      detail.innerHTML = "";
      const card = el("div", { class: "card" }, [
        el("div", { class: "card-title" }, `${u.icon} ${u.title} · ${u.subtitle}`)
      ]);
      u.sentences.forEach((s) => {
        card.appendChild(
          el("div", { style: "padding:.5rem 0;border-bottom:1px solid var(--border)" }, [
            el("div", { class: "flex justify-between items-center" }, [
              el("span", { class: "es-text" }, s.es),
              el("button", { class: "play-btn", style: "width:34px;height:34px", onclick: () => audioEngine.speak(s.es) }, "🔊")
            ]),
            el("div", { class: "text-muted" }, s.en)
          ])
        );
      });
      card.appendChild(
        el("button", {
          class: "btn btn-primary",
          style: "margin-top:.75rem",
          onclick: () => {
            const list = store.state.progress.roadmapUnitsCompleted || (store.state.progress.roadmapUnitsCompleted = []);
            if (!list.includes(u.id)) {
              list.push(u.id);
              registerStudyToday();
              addXP(10, `Roadmap unit: ${u.title}`);
              toast("Unit complete! +10 XP", { type: "xp", icon: "⚡" });
              store.save();
              renderBody();
            }
          }
        }, "Mark unit complete")
      );
      detail.appendChild(card);
      detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    return wrap;
  }

  renderBody();
}
