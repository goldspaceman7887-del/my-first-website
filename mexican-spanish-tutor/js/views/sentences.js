import { store } from "../core/storage.js";
import { el, blurActive, toast, clickableDiv } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { gradeItem, masteryLevel, QUALITY } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { SENTENCES } from "../data/sentences.js";
import { englishReveal } from "../core/tapword.js";

function srsId(s) {
  return `sentence_${s.id}`;
}

function isActive(id) {
  return (store.state.progress.activeSentenceIds || []).includes(id);
}

function toggleActive(id) {
  const list = store.state.progress.activeSentenceIds || (store.state.progress.activeSentenceIds = []);
  const i = list.indexOf(id);
  if (i === -1) list.push(id);
  else list.splice(i, 1);
  store.save();
}

function sentenceDetail(s, { onGraded } = {}) {
  const wrap = el("div", { class: "card" });

  wrap.appendChild(el("h3", { class: "card-title" }, "Sentence Analysis"));
  wrap.appendChild(
    el("div", { class: "flex justify-between items-center" }, [
      el("div", { class: "es-text-lg" }, s.es),
      el("button", { class: "play-btn", onclick: () => audioEngine.speak(s.es) }, "🔊")
    ])
  );
  wrap.appendChild(englishReveal(s.en, { className: "" }));

  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Vocabulary breakdown"));
  wrap.appendChild(el("div", { class: "flex gap-2 flex-wrap" }, s.vocab.map((v) => el("span", { class: "badge badge-default" }, `${v.w} — ${v.en}`))));

  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Grammar pattern"));
  wrap.appendChild(el("p", { style: "font-weight:700" }, s.pattern));
  wrap.appendChild(el("p", { class: "text-muted" }, s.explain));

  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Similar sentences"));
  wrap.appendChild(
    el("div", {}, s.similar.map((sim) => el("p", {}, [el("span", { class: "es-text" }, sim.es), el("span", { class: "text-muted" }, ` — ${sim.en}`)])))
  );

  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Conversation expansion"));
  wrap.appendChild(el("div", {}, s.convo.map((l) => el("p", {}, [el("strong", {}, `${l.spk}: `), el("span", { class: "es-text" }, l.es), el("span", { class: "text-muted" }, ` (${l.en})`)]))));

  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Speaking drill (replacement)"));
  wrap.appendChild(el("p", { class: "text-muted" }, `${s.drill.instruction} ${s.drill.base}`));
  wrap.appendChild(
    el(
      "div",
      { class: "flex gap-2 flex-wrap" },
      s.drill.options.map((opt) =>
        el(
          "button",
          {
            class: "word-chip",
            onclick: () => {
              audioEngine.speak(s.es.replace(s.drill.base, opt));
              toast(`Try saying it aloud: ${s.es.replace(s.drill.base, opt)}`, { icon: "🗣️" });
            }
          },
          opt
        )
      )
    )
  );

  wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Track this sentence"));
  const active = isActive(s.id);
  const activeBtn = el(
    "button",
    { class: `btn ${active ? "btn-success" : "btn"}`, onclick: () => { toggleActive(s.id); activeBtn.textContent = isActive(s.id) ? "✓ Active in study" : "Add to active study"; activeBtn.classList.toggle("btn-success", isActive(s.id)); } },
    active ? "✓ Active in study" : "Add to active study"
  );
  wrap.appendChild(activeBtn);

  if (onGraded) {
    wrap.appendChild(el("h4", { style: "margin-top:1rem" }, "Rate your recall"));
    wrap.appendChild(
      el("div", { class: "srs-rating-row" }, [
        ratingBtn("Again", QUALITY.AGAIN, "btn-danger"),
        ratingBtn("Hard", QUALITY.HARD, "btn"),
        ratingBtn("Good", QUALITY.GOOD, "btn"),
        ratingBtn("Easy", QUALITY.EASY, "btn-success")
      ])
    );
  }

  function ratingBtn(label, quality, cls) {
    return el(
      "button",
      {
        class: `btn ${cls}`,
        onclick: () => {
          blurActive();
          gradeItem(srsId(s), "sentence", quality);
          addXP(quality >= 3 ? 4 : 1, `Patrón: ${s.pattern}`);
          updateSkillScore("grammar", quality >= 3 ? 1.5 : -0.5);
          store.save();
          onGraded();
        }
      },
      label
    );
  }

  return wrap;
}

export function renderSentences(container) {
  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🧩 Gramática y oraciones"),
      el("p", {}, "20 core grammar patterns spanning ser/estar through the subjunctive and hypotheticals — every rule taught through a real sentence and a conversation first, never grammar theory first.")
    ])
  );

  const list = el("div", { class: "grid grid-auto" });
  container.appendChild(list);
  const detailWrap = el("div", { style: "margin-top:1rem" });
  container.appendChild(detailWrap);

  function showDetail(s) {
    detailWrap.innerHTML = "";
    detailWrap.appendChild(sentenceDetail(s, { onGraded: () => showDetail(s) }));
    detailWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  SENTENCES.forEach((s) => {
    const mastery = masteryLevel(srsId(s));
    list.appendChild(
      clickableDiv({ class: "card", style: "padding:.9rem;cursor:pointer", onclick: () => showDetail(s) }, [
        el("div", { class: "es-text", style: "font-weight:700" }, s.es),
        el("div", { class: "text-muted", style: "font-size:.85rem" }, s.en),
        el("div", { class: "badge badge-default", style: "margin-top:.4rem" }, s.pattern),
        el("div", { class: "progress-bar", style: "margin-top:.5rem" }, [el("div", { class: "progress-bar-fill", style: `width:${mastery}%` })])
      ])
    );
  });
}
