// Click-any-word lookup: builds one dictionary index from SUPPLEMENTARY_WORDS + VOCABULARY +
// GRAMMAR + CONNECTORS, tokenizes Japanese text against it (greedy longest-match), and renders
// clickable spans that open a shared popover with reading + English meaning. This is the drop-in
// replacement for ui.js's renderHighlighted — it still honors **span** markup for the bold
// "this is the target" highlight, and layers click-to-define on top of every recognized word.
import { SUPPLEMENTARY_WORDS } from "../data/dictionary.js";
import { VOCABULARY } from "../data/vocabulary.js";
import { GRAMMAR } from "../data/grammar.js";
import { CONNECTORS } from "../data/connectors.js";
import { el } from "./ui.js";

let INDEX = null;
let MAX_LEN = 1;
const wordEntryMap = new WeakMap();
let popoverEl = null;
let listenersAttached = false;

function extractMarkedSpans(text) {
  const spans = [];
  const re = /\*\*(.+?)\*\*/g;
  let m;
  while ((m = re.exec(text))) spans.push(m[1]);
  return spans;
}

function buildIndex() {
  const map = new Map();
  const add = (surface, entry) => {
    if (!surface || map.has(surface)) return;
    map.set(surface, entry);
    if (surface.length > MAX_LEN) MAX_LEN = surface.length;
  };

  SUPPLEMENTARY_WORDS.forEach((w) => {
    const entry = { reading: w.reading, meaning: w.meaning, pos: w.pos, base: w.forms[0] };
    w.forms.forEach((f) => add(f, entry));
  });

  VOCABULARY.forEach((w) => {
    const entry = { reading: w.reading, meaning: w.en, pos: w.pos, base: w.jp };
    extractMarkedSpans(w.sentence).forEach((s) => add(s, entry));
    add(w.jp, entry);
  });

  GRAMMAR.forEach((g) => {
    const entry = { reading: g.structure, meaning: g.title, pos: "grammar point", base: g.title, isGrammar: true, grammarId: g.id };
    g.examples.forEach((ex) => extractMarkedSpans(ex.jp).forEach((s) => add(s, entry)));
  });

  CONNECTORS.forEach((c) => {
    const entry = { reading: c.reading, meaning: c.en, pos: "connector", base: c.jp };
    add(c.jp, entry);
  });

  return map;
}

function getIndex() {
  if (!INDEX) INDEX = buildIndex();
  return INDEX;
}

function findMatchAt(text, i, index) {
  const upper = Math.min(MAX_LEN, text.length - i);
  for (let len = upper; len >= 1; len--) {
    const sub = text.slice(i, i + len);
    if (index.has(sub)) return { text: sub, entry: index.get(sub) };
  }
  return null;
}

function tokenize(text) {
  const index = getIndex();
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    const hit = findMatchAt(text, i, index);
    if (hit) {
      tokens.push(hit);
      i += hit.text.length;
    } else {
      let j = i + 1;
      while (j < text.length && !findMatchAt(text, j, index)) j++;
      tokens.push({ text: text.slice(i, j), entry: null });
      i = j;
    }
  }
  return tokens;
}

function ensurePopover() {
  if (popoverEl) return popoverEl;
  popoverEl = el("div", { class: "word-popover", role: "dialog" }, [
    el("button", { class: "word-popover-close", "aria-label": "Close", onclick: hidePopover }, "×"),
    el("div", { class: "word-popover-reading", id: "word-popover-reading" }),
    el("div", { class: "word-popover-pos", id: "word-popover-pos" }),
    el("div", { class: "word-popover-meaning", id: "word-popover-meaning" }),
  ]);
  popoverEl.style.display = "none";
  document.body.appendChild(popoverEl);
  return popoverEl;
}

function hidePopover() {
  if (popoverEl) popoverEl.style.display = "none";
}

function showPopoverFor(target, entry, surfaceText) {
  const pop = ensurePopover();
  pop.querySelector("#word-popover-reading").textContent = `${entry.base}${entry.reading ? `【${entry.reading}】` : ""}`;
  pop.querySelector("#word-popover-pos").textContent = entry.isGrammar ? "grammar point" : entry.pos || "";
  pop.querySelector("#word-popover-meaning").textContent = entry.meaning;
  pop.style.display = "block";

  const rect = target.getBoundingClientRect();
  const popRect = pop.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - popRect.width / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - popRect.width - 8));
  let top = rect.bottom + 8;
  if (top + popRect.height > window.innerHeight - 8) top = rect.top - popRect.height - 8;
  pop.style.left = `${left + window.scrollX}px`;
  pop.style.top = `${top + window.scrollY}px`;
}

function attachGlobalListeners() {
  if (listenersAttached) return;
  listenersAttached = true;
  document.addEventListener("click", (e) => {
    const wordEl = e.target.closest && e.target.closest(".word-click");
    if (wordEl) {
      const entry = wordEntryMap.get(wordEl);
      if (entry) {
        e.stopPropagation();
        showPopoverFor(wordEl, entry, wordEl.textContent);
      }
      return;
    }
    if (popoverEl && !popoverEl.contains(e.target)) hidePopover();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hidePopover();
  });
  window.addEventListener("hashchange", hidePopover);
}

// Renders text that may contain **highlighted** spans, with every recognized word (inside or
// outside the highlight) wrapped as a clickable, definable span.
export function renderClickableJp(text) {
  attachGlobalListeners();
  const frag = document.createDocumentFragment();
  const rawSegments = text.split(/\*\*(.+?)\*\*/g);

  rawSegments.forEach((segment, i) => {
    const isTarget = i % 2 === 1;
    if (!segment) return;
    const tokens = tokenize(segment);
    const host = isTarget ? el("mark", { class: "connector-hl" }) : null;
    const appendTo = (node) => (host ? host.appendChild(node) : frag.appendChild(node));

    tokens.forEach((tok) => {
      if (tok.entry) {
        const span = el("span", { class: `word-click ${tok.entry.isGrammar ? "word-click-grammar" : ""}` }, tok.text);
        wordEntryMap.set(span, tok.entry);
        appendTo(span);
      } else {
        appendTo(document.createTextNode(tok.text));
      }
    });
    if (host) frag.appendChild(host);
  });

  return frag;
}
