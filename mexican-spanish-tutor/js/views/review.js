// REPASO / REVIEW — two ways in.
//
// "Due today" is the spaced-repetition queue: the app decides what you see,
// and only what the schedule says is ripe.
//
// "Everything I know" is the opposite, and exists because the schedule alone
// locks you out of your own vocabulary — once a word is solid its interval
// stretches to 30, 60, 90 days, so the one thing you couldn't do was go back
// and revisit words you already know. Here you pick the deck and go through
// as much as you like, whenever you like.

import { store } from "../core/storage.js";
import { el, blurActive } from "../core/ui.js";
import { audioEngine } from "../core/audio.js";
import { gradeItem, gradeAhead, dueItems, reviewCounts, QUALITY, stepLabel, masteryLevel, getItem } from "../core/srs.js";
import { addXP, updateSkillScore } from "../core/gamification.js";
import { VOCABULARY } from "../data/vocabulary.js";
import { SENTENCES } from "../data/sentences.js";
import { DIALOGUES } from "../data/dialogues.js";
import { STORIES } from "../data/stories.js";
import { ROADMAP_UNITS } from "../data/roadmap.js";

function resolveItem(srsItem) {
  const [type, ...rest] = srsItem.id.split("_");
  const dataId = rest.join("_");
  if (type === "word") return { type, data: VOCABULARY.find((v) => v.id === dataId) };
  if (type === "sentence") return { type, data: SENTENCES.find((s) => s.id === dataId) };
  if (type === "dialogue") return { type, data: DIALOGUES.find((d) => d.id === dataId) };
  if (type === "story") return { type, data: STORIES.find((s) => s.id === dataId) };
  if (type === "roadmap") return { type, data: ROADMAP_UNITS.find((u) => u.id === dataId) };
  // Words bookmarked from Story Mode: the gloss is the card, so it lives in
  // progress rather than in one of the static data sets.
  if (type === "gloss") {
    const en = (store.state.progress.savedWords || {})[dataId];
    return { type, data: en === undefined ? null : { word: dataId, en } };
  }
  return { type, data: null };
}

// Dialogues, stories and roadmap units aren't flashcards — they're reminders
// to go back and redo the thing, so show a representative line as the cue.
function frontText(type, data) {
  if (type === "word" || type === "gloss") return data.word;
  if (type === "dialogue") return data.lines[0].es;
  if (type === "story") return data.paragraphs[0].es;
  if (type === "roadmap") return data.sentences[0].es;
  return data.es;
}
function backSub(type, data) {
  if (type === "gloss") return "Saved from a story";
  if (type === "word") return `/${data.ipa}/`;
  if (type === "dialogue") return `Dialogue · ${data.title}`;
  if (type === "story") return `Story · ${data.title}`;
  if (type === "roadmap") return `Roadmap unit · ${data.title}`;
  return "";
}
function backMeaning(type, data) {
  if (type === "gloss") return data.en;
  if (type === "word") return data.meaning;
  if (type === "dialogue") return data.lines[0].en;
  if (type === "story") return data.paragraphs[0].en;
  if (type === "roadmap") return data.sentences[0].en;
  return data.en;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Everything you've actually met, whether or not it's due. Deliberately wider
// than the SRS table: someone who has only worked the roadmap has no `word_*`
// entries at all, and telling them they know no words would be nonsense.
function knownPool() {
  const srs = store.state.srs || {};
  const exposure = store.state.progress.vocabExposure || {};
  const doneUnits = new Set([
    ...(store.state.progress.roadmapUnitsCompleted || []),
    ...(store.state.progress.roadmapUnitsSkipped || [])
  ]);
  const out = [];

  // Vocabulary you've been quizzed on or looked at in Learn
  VOCABULARY.forEach((v) => {
    const srsId = `word_${v.id}`;
    if (!srs[srsId] && !exposure[v.id]) return;
    out.push({
      deck: "words", srsId, srsType: "word",
      front: v.word, sub: `/${v.ipa}/`, back: v.meaning,
      note: v.register ? v.register : ""
    });
  });

  // Words you bookmarked while reading a story
  Object.entries(store.state.progress.savedWords || {}).forEach(([w, en]) => {
    out.push({ deck: "saved", srsId: `gloss_${w}`, srsType: "gloss", front: w, sub: "Saved from a story", back: en, note: "" });
  });

  // Every sentence from every unit you've finished or ticked off
  ROADMAP_UNITS.filter((u) => doneUnits.has(u.id)).forEach((u) => {
    u.sentences.forEach((s) => {
      out.push({
        // Individual lines have no SRS entry of their own, so grading one
        // feeds the unit it came from — the same id scheme the unit tests use.
        deck: "sentences", srsId: `roadmap_${u.id}`, srsType: "roadmap",
        front: s.es, sub: `${u.icon} ${u.title}`, back: s.en, note: ""
      });
    });
  });

  // Anything else already in the schedule — dialogues, stories, sentence
  // patterns, and the roadmap units themselves
  Object.values(srs).forEach((item) => {
    const { type, data } = resolveItem(item);
    if (!data || type === "word") return;
    if (type === "gloss") return; // already added from savedWords above
    const deck = type === "dialogue" ? "dialogues" : type === "story" ? "stories" : type === "roadmap" ? "units" : "sentences";
    out.push({
      deck, srsId: item.id, srsType: type,
      front: frontText(type, data), sub: backSub(type, data), back: backMeaning(type, data), note: ""
    });
  });

  return out;
}

const DECKS = [
  { id: "all", label: "All" },
  { id: "words", label: "Words" },
  { id: "saved", label: "Saved" },
  { id: "sentences", label: "Sentences" },
  { id: "dialogues", label: "Dialogues" },
  { id: "stories", label: "Stories" },
  { id: "units", label: "Units" }
];

export function renderReview(container, params = {}) {
  const counts = reviewCounts();
  let mode = params.tab === "known" ? "known" : "due";
  // Callers that mount this view directly (rather than via the URL) can
  // preselect a deck — e.g. Practice's "Vocabulary Review" opens straight
  // into the Words deck instead of making you pick it every time.
  let deck = params.deck && DECKS.some((d) => d.id === params.deck) ? params.deck : "all";

  container.appendChild(
    el("div", { class: "page-header" }, [
      el("h1", {}, "🔁 Repaso / Review"),
      el("p", {}, "Due today is what the spaced schedule says is ripe. Everything I know is the whole deck — go back over words you already have whenever you want.")
    ])
  );

  // Counts of what's DUE. Meaningless in the other mode — and on a phone six
  // zeroes would push the actual cards off the screen — so it's hidden there.
  const strip = el("div", { class: "stat-strip" }, [
      statCard("🗂️", counts.byType.word?.due || 0, "Words"),
      statCard("🧩", counts.byType.sentence?.due || 0, "Patterns"),
      statCard("💬", counts.byType.dialogue?.due || 0, "Dialogues"),
      statCard("📖", counts.byType.story?.due || 0, "Stories"),
      statCard("🗺️", counts.byType.roadmap?.due || 0, "Units"),
      statCard("⏰", counts.overdue, "Overdue")
  ]);
  container.appendChild(strip);

  const tabs = el("div", { class: "tabs", style: "margin-top:1rem" });
  const body = el("div", {});
  container.appendChild(tabs);
  container.appendChild(body);

  function setMode(next) {
    mode = next;
    deck = "all";
    drawTabs();
    draw();
  }

  function drawTabs() {
    tabs.innerHTML = "";
    [
      { id: "due", label: `Due today${counts.dueToday ? ` (${counts.dueToday})` : ""}` },
      { id: "known", label: "Everything I know" }
    ].forEach((t) => {
      tabs.appendChild(
        el("button", { class: `tab-btn ${mode === t.id ? "active" : ""}`, onclick: () => setMode(t.id) }, t.label)
      );
    });
  }

  function draw() {
    body.innerHTML = "";
    strip.classList.toggle("hidden", mode !== "due");
    if (mode === "due") drawDue();
    else drawKnown();
  }

  // ---------- Due today ----------
  function drawDue() {
    const due = dueItems();
    if (due.length === 0) {
      body.appendChild(
        el("div", { class: "card empty-state", style: "margin-top:1rem" }, [
          el("div", { class: "empty-icon" }, "🎉"),
          el("h3", {}, "Nothing due right now"),
          el("p", {}, "You're on top of the schedule. You can still go back over anything you've already learned."),
          el("div", { class: "btn-row", style: "justify-content:center" }, [
            el("button", { class: "btn btn-primary", onclick: () => setMode("known") }, "Review words I know"),
            el("a", { class: "btn", href: "#/roadmap" }, "Continue roadmap")
          ])
        ])
      );
      return;
    }
    const queue = [...due].sort((a, b) => a.nextReview - b.nextReview).slice(0, 30).map((srsItem) => {
      const { type, data } = resolveItem(srsItem);
      if (!data) return null;
      return {
        srsId: srsItem.id, srsType: type,
        front: frontText(type, data), sub: backSub(type, data), back: backMeaning(type, data),
        note: stepLabel(srsItem)
      };
    }).filter(Boolean);

    if (!queue.length) {
      body.appendChild(el("div", { class: "card empty-state" }, [el("h3", {}, "Nothing to show")]));
      return;
    }
    runSession(queue, false);
  }

  // ---------- Everything I know ----------
  function drawKnown() {
    const pool = knownPool();
    if (!pool.length) {
      body.appendChild(
        el("div", { class: "card empty-state", style: "margin-top:1rem" }, [
          el("div", { class: "empty-icon" }, "🌱"),
          el("h3", {}, "Nothing to review yet"),
          el("p", {}, "Finish a unit on the roadmap or open some words in Learn, and they'll show up here to revisit any time."),
          el("a", { class: "btn btn-primary", href: "#/roadmap" }, "Go to the roadmap")
        ])
      );
      return;
    }

    const available = DECKS.filter((d) => d.id === "all" || pool.some((p) => p.deck === d.id));
    const chips = el("div", { class: "search-row", style: "margin-top:1rem" });
    const stageWrap = el("div", {});
    body.appendChild(chips);
    body.appendChild(stageWrap);

    function drawChips() {
      chips.innerHTML = "";
      available.forEach((d) => {
        const n = d.id === "all" ? pool.length : pool.filter((p) => p.deck === d.id).length;
        chips.appendChild(
          el("button", {
            class: `chip-filter ${deck === d.id ? "active" : ""}`,
            onclick: () => { deck = d.id; drawChips(); start(); }
          }, `${d.label} (${n})`)
        );
      });
    }

    function start() {
      const picked = deck === "all" ? pool : pool.filter((p) => p.deck === deck);
      stageWrap.innerHTML = "";
      runSession(shuffle(picked).slice(0, 40), true, stageWrap);
    }

    drawChips();
    start();
  }

  // ---------- Shared flashcard session ----------
  function runSession(queue, ahead, mount = body) {
    let idx = 0;
    const counter = el("p", { class: "text-muted", style: "margin-top:1rem" }, "");
    const stage = el("div", { class: "flashcard-stage" });
    mount.appendChild(counter);
    mount.appendChild(stage);

    function showItem() {
      stage.innerHTML = "";
      const item = queue[idx];
      // A word you've only met in Learn has no score yet — "0% mastered"
      // would read as failure rather than "we haven't tested this".
      const drilled = Boolean(getItem(item.srsId));
      const masteryLabel = drilled ? `${masteryLevel(item.srsId)}% mastered` : "not drilled yet";
      const card = el("div", { class: "flashcard" });
      card.appendChild(
        el("div", { class: "flashcard-inner" }, [
          el("div", { class: "flashcard-face front" }, [
            el("span", { class: "badge badge-default" }, ahead ? masteryLabel : `${item.srsType} · ${item.note}`),
            el("div", { class: "flashcard-word es-text" }, item.front),
            el("div", { class: "flashcard-hint" }, "Tap to reveal")
          ]),
          el("div", { class: "flashcard-face back" }, [
            el("div", { class: "ipa-lg" }, item.sub),
            el("div", { class: "flashcard-sub", style: "font-weight:700" }, item.back)
          ])
        ])
      );
      card.addEventListener("click", () => card.classList.toggle("flipped"));
      stage.appendChild(card);

      stage.appendChild(
        el("button", { class: "btn btn-sm", onclick: (e) => { e.stopPropagation(); audioEngine.speak(item.front); } }, "🔊 Escuchar")
      );

      stage.appendChild(
        el("div", { class: "srs-rating-row" }, [
          ratingBtn("Again", QUALITY.AGAIN, "btn-danger"),
          ratingBtn("Hard", QUALITY.HARD, "btn"),
          ratingBtn("Good", QUALITY.GOOD, "btn"),
          ratingBtn("Easy", QUALITY.EASY, "btn-success")
        ])
      );

      counter.textContent = ahead
        ? `Card ${idx + 1} of ${queue.length} · revisiting, your schedule stays put unless you miss one`
        : `Item ${idx + 1} of ${queue.length}`;
      if (store.state.settings.autoplayAudio) audioEngine.speak(item.front);

      function ratingBtn(label, quality, cls) {
        return el("button", {
          class: `btn ${cls}`,
          onclick: () => {
            blurActive();
            if (ahead) gradeAhead(item.srsId, item.srsType, quality);
            else gradeItem(item.srsId, item.srsType, quality);
            addXP(quality >= 3 ? (ahead ? 1 : 3) : 1, `Repaso: ${item.front}`);
            updateSkillScore(item.srsType === "word" ? "vocabulary" : "grammar", quality >= 3 ? 1 : -0.5);
            store.save();
            idx++;
            if (idx >= queue.length) finish();
            else showItem();
          }
        }, label);
      }
    }

    function finish() {
      stage.innerHTML = "";
      counter.textContent = "";
      stage.appendChild(
        el("div", { class: "card empty-state pop-in" }, [
          el("div", { class: "empty-icon" }, "✅"),
          el("h3", {}, ahead ? "Deck finished" : "Review session complete!"),
          el("div", { class: "btn-row", style: "justify-content:center" }, [
            ahead
              ? el("button", { class: "btn btn-primary", onclick: () => { idx = 0; queue = shuffle(queue); showItem(); } }, "Go again")
              : el("button", { class: "btn btn-primary", onclick: () => setMode("known") }, "Review words I know"),
            el("a", { class: "btn", href: "#/dashboard" }, "Back to dashboard")
          ])
        ])
      );
    }

    showItem();
  }

  drawTabs();
  draw();

  function statCard(icon, value, label) {
    return el("div", { class: "card stat-card compact" }, [
      el("div", { class: "stat-icon" }, icon),
      el("div", { class: "stat-value" }, String(value)),
      el("div", { class: "stat-label" }, label)
    ]);
  }
}
