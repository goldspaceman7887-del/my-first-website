// Tap-a-word, shared by Story Mode, the roadmap units and the dialogues.
//
// One rule governs the whole thing: a word is only underlined if we can
// actually define it. A dotted underline that yields "no definition" trains
// people to stop tapping, which is worse than never offering it.

import { el, toast } from "./ui.js";
import { store } from "./storage.js";
import { audioEngine } from "./audio.js";
import { gradeItem, QUALITY } from "./srs.js";
import { lookupWord, normalizeWord } from "../data/glossary.js";

let pop = null;

export function closeGloss() {
  if (pop) { pop.remove(); pop = null; }
  document.querySelectorAll(".word-tap.active").forEach((w) => w.classList.remove("active"));
}

function showGloss(wordEl, raw) {
  closeGloss();
  wordEl.classList.add("active");
  const key = normalizeWord(raw);
  const gloss = lookupWord(key);

  pop = el("div", { class: "gloss-pop pop-in", role: "dialog", "aria-label": `Meaning of ${key}` }, [
    el("div", { class: "flex justify-between items-center", style: "gap:.5rem" }, [
      el("span", { class: "es-text", style: "font-size:1.25rem;font-weight:700" }, key),
      el("div", { class: "flex", style: "gap:.35rem" }, [
        el("button", { class: "btn btn-sm", onclick: (e) => { e.stopPropagation(); audioEngine.speak(key); } }, "🔊"),
        el("button", { class: "btn btn-sm", "aria-label": "Close", onclick: (e) => { e.stopPropagation(); closeGloss(); } }, "✕")
      ])
    ]),
    el("div", { style: "margin-top:.35rem" }, gloss || "No definition for this one yet."),
    el("button", {
      class: "btn btn-sm btn-primary", style: "margin-top:.6rem",
      onclick: (e) => {
        e.stopPropagation();
        // Store the meaning with the word: Review has no other way to render a
        // bare glossary key as a card.
        store.state.progress.savedWords[key] = gloss || "";
        gradeItem(`gloss_${key}`, "gloss", QUALITY.GOOD);
        store.save();
        toast(`"${key}" guardada para repasar`, { icon: "🔖" });
        closeGloss();
      }
    }, "🔖 Save to review")
  ]);
  document.body.appendChild(pop);
}

// Turns a Spanish string into a span whose definable words are tappable.
// Punctuation stays outside the button so the tap target is the word itself.
export function tappable(text, extraClass = "") {
  const wrap = el("span", { class: `es-text tappable-line ${extraClass}`.trim() });
  String(text || "").split(/(\s+)/).forEach((chunk) => {
    if (!chunk) return;
    if (/^\s+$/.test(chunk)) { wrap.appendChild(document.createTextNode(chunk)); return; }
    const m = chunk.match(/^([¿¡"'(]*)(.*?)([.,;:!?")'…—]*)$/);
    const [, pre, core, post] = m;
    if (pre) wrap.appendChild(document.createTextNode(pre));
    if (core) {
      if (lookupWord(core)) {
        const btn = el("button", { class: "word-tap", type: "button" }, core);
        btn.addEventListener("click", (e) => { e.stopPropagation(); showGloss(btn, core); });
        wrap.appendChild(btn);
      } else {
        // No definition, so no underline — nothing to promise the reader.
        wrap.appendChild(document.createTextNode(core));
      }
    }
    if (post) wrap.appendChild(document.createTextNode(post));
  });
  return wrap;
}

// Views that render tappable text must call this on teardown: the popup lives
// on document.body, so it would otherwise outlive the view that opened it.
export function initTapWords() {
  const onDocClick = (e) => {
    if (pop && !pop.contains(e.target) && !e.target.classList.contains("word-tap")) closeGloss();
  };
  document.addEventListener("click", onDocClick);
  return () => {
    document.removeEventListener("click", onDocClick);
    closeGloss();
  };
}
