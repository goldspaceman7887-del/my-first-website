import { buildSession, getDueCount, getNewAvailableCount, REVIEW_POOL } from "../data/reviewPool.js";
import { MODELS } from "../data/models.js";
import { grade, formatInterval } from "../core/srs.js";
import { getState, gradeSrsItem, completeReviewSession, setNewCardsPerSession, saveSession, loadSession, clearSession } from "../core/storage.js";
import { el, toast, stripHighlightMarkup } from "../core/ui.js";
import { renderClickableJp } from "../core/wordLookup.js";
import { speak } from "../core/audio.js";

const BREATHER_EVERY = 6;
const MARKER_ID = "review-view-marker";
const SESSION_KEY = "review";

let session = null;
let index = 0;
let flipped = false;
let stats = { reviewed: 0, newLearned: 0, again: 0, hard: 0, good: 0, easy: 0 };
let sessionCompleteRecorded = false;
let keyListenerAttached = false;
let showTranslation = {};
let restoredFromStorage = false;

function buildQueueWithBreathers(state) {
  const cards = buildSession(state);
  const withBreathers = [];
  let modelIdx = 0;
  cards.forEach((c, i) => {
    withBreathers.push(c);
    if ((i + 1) % BREATHER_EVERY === 0 && i !== cards.length - 1) {
      withBreathers.push({ kind: "breather", model: MODELS[modelIdx % MODELS.length] });
      modelIdx++;
    }
  });
  return withBreathers;
}

// Persist just enough to rebuild `session` on reload: real cards by id (looked up in
// REVIEW_POOL), breathers by their model id (looked up in MODELS) — not the full objects.
function persistSession() {
  if (!session) {
    clearSession(SESSION_KEY);
    return;
  }
  saveSession(SESSION_KEY, {
    items: session.map((c) => (c.kind === "breather" ? { kind: "breather", modelId: c.model.id } : { kind: "item", id: c.id })),
    index,
    flipped,
    stats,
    sessionCompleteRecorded,
  });
}

function restoreSession() {
  restoredFromStorage = true;
  const saved = loadSession(SESSION_KEY);
  if (!saved) return;
  const rebuilt = saved.items
    .map((s) => {
      if (s.kind === "breather") {
        const model = MODELS.find((m) => m.id === s.modelId);
        return model ? { kind: "breather", model } : null;
      }
      return REVIEW_POOL.find((c) => c.id === s.id) || null;
    })
    .filter(Boolean);
  if (rebuilt.length === 0) return;
  session = rebuilt;
  index = Math.min(saved.index ?? 0, session.length);
  flipped = !!saved.flipped;
  stats = saved.stats || stats;
  sessionCompleteRecorded = !!saved.sessionCompleteRecorded;
}

function startSession(state) {
  session = buildQueueWithBreathers(state);
  index = 0;
  flipped = false;
  stats = { reviewed: 0, newLearned: 0, again: 0, hard: 0, good: 0, easy: 0 };
  sessionCompleteRecorded = false;
  persistSession();
}

function gradeAndAdvance(item, gradeName, root, wasNew) {
  gradeSrsItem(item.id, gradeName);
  stats.reviewed += 1;
  stats[gradeName] += 1;
  if (wasNew) stats.newLearned += 1;
  index += 1;
  flipped = false;
  persistSession();
  render(root);
}

function attachKeyListener(root) {
  if (keyListenerAttached) return;
  keyListenerAttached = true;
  document.addEventListener("keydown", (e) => {
    if (!document.getElementById(MARKER_ID)) return;
    if (!session || index >= session.length) return;
    const item = session[index];
    if (item.kind === "breather") {
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        index += 1;
        persistSession();
        render(root);
      }
      return;
    }
    if (!flipped) {
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        flipped = true;
        persistSession();
        render(root);
      }
      return;
    }
    const map = { 1: "again", 2: "hard", 3: "good", 4: "easy" };
    if (map[e.key]) {
      const wasNew = !getState().srs[item.id];
      gradeAndAdvance(item, map[e.key], root, wasNew);
    }
  });
}

export function render(root) {
  attachKeyListener(root);
  if (!restoredFromStorage) restoreSession();
  const state = getState();
  const container = el("div", { class: "view", id: MARKER_ID });

  container.appendChild(
    el("header", { class: "view-header" }, [
      el("h1", {}, "⚡ Review Session"),
      el("p", { class: "subtitle" }, "Fast spaced-repetition review — connectors, grammar, and vocabulary, always shown in a full sentence. Flip, grade, move on."),
    ])
  );

  if (session === null) {
    container.appendChild(renderStart(root, state));
  } else if (index >= session.length) {
    container.appendChild(renderSummary(root));
  } else {
    const item = session[index];
    container.appendChild(item.kind === "breather" ? renderBreather(item, root) : renderCard(item, root, state));
  }

  root.innerHTML = "";
  root.appendChild(container);
}

function renderStart(root, state) {
  const due = getDueCount(state);
  const fresh = getNewAvailableCount(state);
  const newLimit = state.reviewStats.newCardsPerSession;

  const wrap = el("div", {});
  wrap.appendChild(
    el("div", { class: "review-hero" }, [
      el("div", { class: "review-hero-stat" }, [el("div", { class: "review-hero-num" }, String(due)), el("div", { class: "muted small" }, "due now")]),
      el("div", { class: "review-hero-stat" }, [el("div", { class: "review-hero-num accent2" }, String(Math.min(fresh, newLimit))), el("div", { class: "muted small" }, "new this session")]),
    ])
  );

  if (due === 0 && fresh === 0) {
    wrap.appendChild(el("div", { class: "card" }, "🎉 Nothing due right now and no new items left in the pool — you're fully caught up. Check back later, or review ahead of schedule from the Grammar/Vocabulary/Connector pages."));
    return wrap;
  }

  const card = el("div", { class: "card" });
  card.appendChild(el("p", { class: "muted" }, `About ${Math.min(20, due + Math.min(fresh, newLimit))} cards — roughly 8-10 minutes. Every card shows a full sentence, never an isolated word.`));
  const newInput = el("label", { class: "review-new-limit" }, [
    "New cards this session: ",
    el("input", {
      type: "number", min: "0", max: "20", value: String(newLimit), class: "select",
      oninput: (e) => setNewCardsPerSession(Math.max(0, Math.min(20, parseInt(e.target.value, 10) || 0))),
    }),
  ]);
  card.appendChild(newInput);
  card.appendChild(
    el(
      "button",
      { class: "btn primary review-start-btn", onclick: () => { startSession(getState()); render(root); } },
      "▶ Start Review Session"
    )
  );
  wrap.appendChild(card);
  return wrap;
}

function renderCard(item, root, state) {
  const wrap = el("div", {});
  wrap.appendChild(el("div", { class: "review-progress muted small" }, `Card ${index + 1} / ${session.length}`));

  const card = el("div", { class: "card review-card" });
  card.appendChild(
    el("div", { class: "review-card-top" }, [
      el("span", { class: "cat-tag", style: `background:${item.tagColor}22;color:${item.tagColor}` }, item.tag),
      el("button", { class: "icon-btn small", title: "Listen", onclick: (e) => { e.stopPropagation(); speak(item.listenJp, { rate: getState().settings.rate }); } }, "🔊"),
    ])
  );

  const frontEl = el("p", { class: "review-front", lang: "ja" }, renderClickableJp(item.frontJp));
  card.appendChild(frontEl);

  if (!flipped) {
    card.appendChild(el("p", { class: "muted small review-tap-hint" }, "Tap the card (or press space) to reveal"));
    card.classList.add("review-card-clickable");
    card.addEventListener("click", () => { flipped = true; persistSession(); render(root); });
  } else {
    const back = el("div", { class: "review-back" });
    back.appendChild(el("div", { class: "review-back-title" }, item.backTitle));
    if (item.backReading) back.appendChild(el("div", { class: "muted small" }, item.backReading));
    if (item.backMeaning) back.appendChild(el("div", {}, item.backMeaning));
    if (item.backExtra) back.appendChild(el("p", { class: "muted small" }, item.backExtra));
    if (item.backTranslation) back.appendChild(el("p", { class: "muted small" }, item.backTranslation));
    card.appendChild(back);

    const record = state.srs[item.id];
    const grades = [
      ["again", "Again", "danger"],
      ["hard", "Hard", "warn2"],
      ["good", "Good", "good2"],
      ["easy", "Easy", "accent2b"],
    ];
    const gradeRow = el("div", { class: "review-grade-row" });
    grades.forEach(([g, label, cls]) => {
      const preview = formatInterval(grade(record, g).interval);
      const wasNew = !record;
      const btn = el(
        "button",
        {
          class: `review-grade-btn ${cls}`,
          onclick: (e) => { e.stopPropagation(); gradeAndAdvance(item, g, root, wasNew); },
        },
        [el("div", {}, label), el("div", { class: "review-grade-preview" }, preview)]
      );
      gradeRow.appendChild(btn);
    });
    card.appendChild(gradeRow);
  }

  wrap.appendChild(card);
  return wrap;
}

function renderBreather(item, root) {
  const { model } = item;
  const wrap = el("div", {});
  wrap.appendChild(el("div", { class: "review-progress muted small" }, `Card ${index + 1} / ${session.length} · reading break`));
  const card = el("div", { class: "card review-card breather" });
  card.appendChild(el("div", { class: "cat-tag" }, "📖 Paragraph practice"));
  card.appendChild(el("h3", {}, model.title));
  const jpBlock = el("p", { class: "model-jp", lang: "ja" }, renderClickableJp(model.jp));
  card.appendChild(jpBlock);
  if (showTranslation[model.id]) card.appendChild(el("p", { class: "muted" }, model.en));
  card.appendChild(
    el("div", { class: "model-btn-row" }, [
      el("button", { class: "btn primary", onclick: (e) => { e.stopPropagation(); speak(stripHighlightMarkup(model.jp), { rate: getState().settings.rate }); } }, "▶ Play"),
      el(
        "button",
        {
          class: "btn subtle",
          onclick: (e) => { e.stopPropagation(); showTranslation[model.id] = !showTranslation[model.id]; render(root); },
        },
        showTranslation[model.id] ? "Hide translation" : "Show translation"
      ),
    ])
  );
  card.appendChild(
    el("button", { class: "btn primary review-continue-btn", onclick: () => { index += 1; persistSession(); render(root); } }, "Continue →")
  );
  wrap.appendChild(card);
  return wrap;
}

function renderSummary(root) {
  if (!sessionCompleteRecorded) {
    completeReviewSession();
    sessionCompleteRecorded = true;
  }
  const wrap = el("div", {});
  const card = el("div", { class: "card celebration-card" });
  card.appendChild(el("h2", {}, "✅ Session complete"));
  card.appendChild(
    el("div", { class: "review-summary-grid" }, [
      summaryStat(stats.reviewed, "reviewed"),
      summaryStat(stats.newLearned, "new learned"),
      summaryStat(stats.again, "again"),
      summaryStat(stats.good + stats.easy, "good/easy"),
    ])
  );
  card.appendChild(
    el("div", { class: "review-summary-actions" }, [
      el("button", { class: "btn primary", onclick: () => { session = null; clearSession(SESSION_KEY); render(root); } }, "Check for more"),
      el("a", { class: "btn", href: "#/dashboard" }, "Back to Dashboard"),
    ])
  );
  wrap.appendChild(card);
  return wrap;
}

function summaryStat(value, label) {
  return el("div", { class: "feedback-stat good" }, [el("div", { class: "feedback-stat-value" }, String(value)), el("div", { class: "feedback-stat-label" }, label)]);
}
