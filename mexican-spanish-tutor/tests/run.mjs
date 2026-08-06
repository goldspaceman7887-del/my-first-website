// Regression suite for the Mexican Spanish tutor.
//
// Every check here exists because something actually broke. The storage check
// is the one that matters most: a deepMerge bug once discarded ALL spaced
// repetition data on every page load, and nothing caught it.
//
//   node tests/run.mjs            runs everything
//   node tests/run.mjs storage    runs one group
//
// Exits non-zero if any check fails, so CI blocks the deploy.

import { chromium, devices } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, resolve, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("../", import.meta.url)));
const PORT = Number(process.env.TEST_PORT || 8123);
const BASE = `http://127.0.0.1:${PORT}`;

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".svg": "image/svg+xml"
};

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const url = decodeURIComponent(req.url.split("?")[0]);
      // normalize() collapses ../ so a request can't escape the app directory
      const rel = normalize(url === "/" ? "/index.html" : url).replace(/^(\.\.[/\\])+/, "");
      const file = join(ROOT, rel);
      if (!file.startsWith(ROOT) || !existsSync(file)) { res.writeHead(404); return res.end("not found"); }
      const body = await readFile(file);
      res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
      res.end(body);
    } catch (e) {
      res.writeHead(500); res.end(String(e));
    }
  });
  return new Promise((ok) => server.listen(PORT, "127.0.0.1", () => ok(server)));
}

// ---------- tiny assertion harness ----------
const results = [];
let currentGroup = "";
function group(name) { currentGroup = name; }
function check(label, pass, detail = "") {
  results.push({ group: currentGroup, label, pass, detail });
  const mark = pass ? "  ✓" : "  ✗";
  console.log(`${mark} ${label}${detail && !pass ? "  — " + detail : ""}`);
}

async function freshPage(browser, { mobile = false } = {}) {
  const ctx = await browser.newContext(mobile ? { ...devices["iPhone 13"] } : { viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("favicon")) errors.push(m.text()); });
  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  // Click past onboarding
  for (let i = 0; i < 4; i++) {
    const btn = await page.$(".onboarding-nav .btn-primary");
    if (btn) { await btn.click(); await page.waitForTimeout(120); }
  }
  // Speech synthesis is noise in a test run
  await page.evaluate(async () => {
    const { audioEngine } = await import("/js/core/audio.js");
    audioEngine.speak = () => {};
  });
  return { page, ctx, errors };
}

// Re-setting an identical hash fires no hashchange, so the router never
// re-renders. Bounce through another route first.
async function go(page, hash) {
  await page.evaluate(() => { window.location.hash = "#/dashboard"; });
  await page.waitForTimeout(120);
  await page.evaluate((h) => { window.location.hash = h; }, hash);
  await page.waitForTimeout(400);
}

// ================= groups =================

async function testRoutes(browser) {
  group("routes");
  const { page, ctx, errors } = await freshPage(browser);
  const routes = ["#/dashboard", "#/roadmap", "#/level-test", "#/learn", "#/learn/vocab",
    "#/learn/grammar", "#/learn/dialogues", "#/practice", "#/practice/story",
    "#/practice/conversation", "#/practice/roleplay", "#/review", "#/review/known", "#/save", "#/achievements", "#/settings"];
  let rendered = 0;
  for (const r of routes) {
    await go(page, r);
    const has = await page.evaluate(() => document.getElementById("view-root").children.length > 0);
    if (has) rendered++;
    else check(`${r} renders`, false, "empty view");
  }
  check(`all ${routes.length} routes render`, rendered === routes.length, `${rendered}/${routes.length}`);
  check("no JS errors while navigating", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

async function testVocabulary(browser) {
  group("vocabulary");
  const { page, ctx, errors } = await freshPage(browser);
  const d = await page.evaluate(async () => {
    const { VOCABULARY } = await import("/js/data/vocabulary.js");
    const ids = new Set(VOCABULARY.map((v) => v.id));
    const words = new Set(VOCABULARY.map((v) => v.word.toLowerCase()));
    return {
      total: VOCABULARY.length, ids: ids.size, words: words.size,
      noIpa: VOCABULARY.filter((v) => !v.ipa).length,
      noMeaning: VOCABULARY.filter((v) => !v.meaning).length,
      noCategory: VOCABULARY.filter((v) => !v.category).length,
      noExample: VOCABULARY.filter((v) => !v.sentences || !v.sentences.length).length
    };
  });
  check("1,000 words", d.total === 1000, String(d.total));
  check("every id unique", d.ids === d.total, `${d.ids} unique`);
  check("every word unique", d.words === d.total, `${d.total - d.words} duplicate(s)`);
  check("every word has pronunciation", d.noIpa === 0, `${d.noIpa} missing`);
  check("every word has a meaning", d.noMeaning === 0, `${d.noMeaning} missing`);
  check("every word has a category", d.noCategory === 0, `${d.noCategory} missing`);
  check("every word has an example", d.noExample === 0, `${d.noExample} missing`);

  // The detail view once crashed on entries with no collocations / reviewQ
  await go(page, "#/learn/vocab");
  await page.click('.tab-btn:has-text("Browse")');
  await page.waitForTimeout(600);
  const listed = await page.$$eval(".grid-auto > *", (els) => els.length);
  check("browse list shows all 1,000", listed === 1000, String(listed));
  let opened = 0;
  for (let i = 0; i < 1000; i += 17) {
    const ok = await page.evaluate((idx) => {
      const items = document.querySelectorAll(".grid-auto > *");
      if (!items[idx]) return false;
      items[idx].click(); return true;
    }, i);
    if (ok) { opened++; await page.waitForTimeout(30); }
  }
  const emptyHeadings = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll("h4").forEach((h) => {
      const n = h.nextElementSibling;
      if (!n || !n.textContent.trim()) bad.push(h.textContent);
    });
    return bad;
  });
  check(`opened ${opened} word cards across the range`, opened > 50);
  check("no empty section headings on lean entries", emptyHeadings.length === 0, emptyHeadings.join(", "));
  check("no JS errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

async function testPronunciation(browser) {
  group("pronunciation");
  const { page, ctx } = await freshPage(browser);
  const r = await page.evaluate(async () => {
    const { spanishIPA } = await import("/js/data/spanishIPA.js");
    const src = await (await fetch("/js/data/vocabulary.js")).text();
    const pairs = [...src.matchAll(/word: "([^"]+)", ipa: "([^"]+)"/g)].map((m) => ({ w: m[1], ipa: m[2] }));
    const wrong = pairs.filter((p) => spanishIPA(p.w) !== p.ipa)
      .map((p) => `${p.w}: hand "${p.ipa}" vs generated "${spanishIPA(p.w)}"`);
    return { n: pairs.length, wrong };
  });
  check(`generator matches all ${r.n} hand-written transcriptions`, r.wrong.length === 0, r.wrong.slice(0, 3).join(" | "));
  await ctx.close();
}

async function testRoadmap(browser) {
  group("roadmap");
  const { page, ctx } = await freshPage(browser);
  const r = await page.evaluate(async () => {
    const M = await import("/js/views/roadmap.js");
    const { ROADMAP_UNITS, ACTFL_LEVELS } = await import("/js/data/roadmap.js");
    const problems = [];
    ROADMAP_UNITS.forEach((u, idx) => {
      for (let n = 0; n < 8; n++) {
        const qs = M.buildQuiz(u);
        if (qs.length !== 10) problems.push(`${u.id}: ${qs.length} questions`);
        const reviews = qs.filter((q) => q.review);
        if (reviews.length !== Math.min(idx, 3)) problems.push(`${u.id}: ${reviews.length} review questions`);
        const priorIds = new Set(ROADMAP_UNITS.slice(0, idx).map((x) => x.id));
        reviews.forEach((q) => { if (!priorIds.has(q.reviewUnitId)) problems.push(`${u.id} reviews ${q.reviewUnitId}, not earlier on the path`); });
        if (qs[0] && qs[0].review) problems.push(`${u.id}: opens on a review question`);
        qs.forEach((q, i) => {
          if ((q.kind === "mc" || q.kind === "listen")) {
            if (!q.options.includes(q.correct)) problems.push(`${u.id} q${i}: answer not among options`);
            if (new Set(q.options).size !== q.options.length) problems.push(`${u.id} q${i}: duplicate options`);
          }
          if (q.kind === "build") {
            const rebuilt = [...q.words].sort().join(" ");
            const want = q.correct.replace(/[¿?¡!.,]/g, "").split(/\s+/).sort().join(" ");
            if (rebuilt !== want) problems.push(`${u.id} q${i}: word bank can't rebuild the answer`);
          }
        });
      }
    });
    // Section checkpoints
    ACTFL_LEVELS.forEach((l) => {
      const units = M.unitsInLevel(l.code);
      const ids = new Set(units.map((u) => u.id));
      for (let n = 0; n < 8; n++) {
        const qs = M.buildCheckpoint(l.code);
        if (qs.length !== 15) problems.push(`${l.code} checkpoint: ${qs.length} questions`);
        const seen = new Set(qs.map((q) => q.sourceUnitId));
        if (seen.size !== units.length) problems.push(`${l.code} checkpoint covered ${seen.size}/${units.length} units`);
        qs.forEach((q) => { if (!ids.has(q.sourceUnitId)) problems.push(`${l.code} checkpoint sourced outside its section`); });
      }
    });
    return { units: ROADMAP_UNITS.length, levels: ACTFL_LEVELS.length, problems: [...new Set(problems)] };
  });
  check(`${r.units} units, ${r.levels} levels`, r.units === 35 && r.levels === 7);
  check("unit tests and checkpoints generate correctly", r.problems.length === 0, r.problems.slice(0, 4).join(" | "));
  await ctx.close();
}

async function testStories(browser) {
  group("stories");
  const { page, ctx, errors } = await freshPage(browser, { mobile: true });
  const cover = await page.evaluate(async () => {
    const { STORIES } = await import("/js/data/stories.js");
    const { GLOSSARY, normalizeWord } = await import("/js/data/glossary.js");
    const levels = [];
    const missing = [];
    STORIES.forEach((s) => {
      if (!levels.includes(s.level)) levels.push(s.level);
      const texts = [...s.paragraphs.map((p) => p.es), ...(s.speakingQuestions || [])];
      texts.forEach((t) => t.split(/\s+/).forEach((chunk) => {
        const m = chunk.match(/^([¿¡"'(]*)(.*?)([.,;:!?")'…—]*)$/);
        const core = normalizeWord(m[2]);
        if (core && !GLOSSARY[core]) missing.push(core);
      }));
    });
    return { stories: STORIES.length, levels, missing: [...new Set(missing)] };
  });
  const want = ["novice-low", "novice-mid", "novice-high", "intermediate-low", "intermediate-mid", "intermediate-high", "advanced-low"];
  check("stories run Novice Low → Advanced Low", JSON.stringify(cover.levels) === JSON.stringify(want), cover.levels.join(" → "));
  check("every story word has a definition", cover.missing.length === 0, cover.missing.slice(0, 8).join(", "));

  // Rendered words must all be tappable, and must not blow up to button height
  await go(page, "#/practice/story");
  await page.click(".card-link");
  await page.waitForTimeout(350);
  const rendered = await page.evaluate(async () => {
    const { GLOSSARY, normalizeWord } = await import("/js/data/glossary.js");
    const words = [...document.querySelectorAll(".word-tap")];
    return {
      n: words.length,
      missing: words.map((w) => normalizeWord(w.textContent)).filter((k) => !GLOSSARY[k]),
      maxHeight: Math.max(...words.slice(0, 20).map((w) => w.getBoundingClientRect().height))
    };
  });
  check("rendered story words all resolve", rendered.missing.length === 0, rendered.missing.join(", "));
  check("tappable words stay inline (not 44px controls)", rendered.maxHeight < 40, `${Math.round(rendered.maxHeight)}px`);
  await page.$$eval(".word-tap", (els) => els[0].click());
  await page.waitForTimeout(250);
  check("tapping a word opens its definition", Boolean(await page.$(".gloss-pop")));
  check("no JS errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

async function testTapWords(browser) {
  group("tap-a-word");
  const { page, ctx, errors } = await freshPage(browser, { mobile: true });

  // Every word the app renders as tappable content must be definable.
  const cover = await page.evaluate(async () => {
    const { ROADMAP_UNITS } = await import("/js/data/roadmap.js");
    const { DIALOGUES } = await import("/js/data/dialogues.js");
    const { STORIES } = await import("/js/data/stories.js");
    const { lookupWord, normalizeWord } = await import("/js/data/glossary.js");
    const toks = new Set();
    const add = (s) => String(s).split(/\s+/).forEach((c) => {
      const m = c.match(/^([¿¡"'(]*)(.*?)([.,;:!?")'…—]*)$/);
      const k = normalizeWord(m[2]);
      if (k) toks.add(k);
    });
    ROADMAP_UNITS.forEach((u) => u.sentences.forEach((s) => add(s.es)));
    DIALOGUES.forEach((d) => d.lines.forEach((l) => add(l.es)));
    STORIES.forEach((s) => { s.paragraphs.forEach((pp) => add(pp.es)); (s.speakingQuestions || []).forEach(add); });
    const missing = [...toks].filter((k) => !lookupWord(k));
    return { total: toks.size, missing };
  });
  check(`all ${cover.total} words across roadmap, dialogues and stories are definable`,
    cover.missing.length === 0, cover.missing.slice(0, 10).join(", "));

  // A roadmap unit's sentences must be tappable
  await go(page, "#/roadmap");
  const node = await page.$(".roadmap-node.unlocked");
  if (node) {
    await node.click();
    await page.waitForTimeout(350);
    const n = await page.$$eval(".word-tap", (els) => els.length);
    check("roadmap unit sentences are tappable", n > 20, `${n} tappable words`);
    if (n) {
      await page.$$eval(".word-tap", (els) => els[0].click());
      await page.waitForTimeout(250);
      check("tapping a roadmap word opens its definition", Boolean(await page.$(".gloss-pop")));
    }
  } else {
    check("roadmap unit reachable", false, "no unlocked node");
  }

  // Leaving the view must remove the popup — it lives on document.body
  await go(page, "#/dashboard");
  await page.waitForTimeout(300);
  check("popup removed when leaving the roadmap", !(await page.$(".gloss-pop")));

  // Dialogue lines must be tappable too
  await go(page, "#/learn/dialogues");
  const dlg = await page.$(".card-link, .card");
  if (dlg) {
    await dlg.click();
    await page.waitForTimeout(400);
    const n = await page.$$eval(".word-tap", (els) => els.length);
    check("dialogue lines are tappable", n > 10, `${n} tappable words`);
  }

  // Undefined words must not be underlined at all
  const falsePromise = await page.evaluate(async () => {
    const { lookupWord, normalizeWord } = await import("/js/data/glossary.js");
    return [...document.querySelectorAll(".word-tap")]
      .map((w) => normalizeWord(w.textContent))
      .filter((k) => !lookupWord(k));
  });
  check("no word is underlined without a definition", falsePromise.length === 0, falsePromise.join(", "));
  check("no JS errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

async function testCorrections(browser) {
  group("error feedback");
  const { page, ctx, errors } = await freshPage(browser, { mobile: true });

  // The checker must correct YOUR sentence, not offer a canned one.
  const engine = await page.evaluate(async () => {
    const { checkSpanish } = await import("/js/data/mistakePatterns.js");
    const cases = [
      ["Estoy doctor", "Soy doctor"],
      ["Soy en Puebla", "Estoy en Puebla"],
      ["Soy 25 años", "Tengo 25 años"],
      ["Estoy caliente", "Tengo calor"],
      ["Trabajo por vivir", "Trabajo para vivir"],
      ["Busco por trabajo", "Busco trabajo"],
      ["Yo gusto los tacos", "Me gustan los tacos"],
      ["Me gusta los tacos", "Me gustan los tacos"],
      ["Lavo mis manos", "Me lavo las manos"],
      ["Están muchas personas", "Hay muchas personas"],
      ["Es mucho bueno", "Es muy bueno"],
      ["La gente son amables", "La gente es amable"],
      ["Quiero un otro café", "Quiero otro café"],
      ["Es la problema", "Es el problema"],
      ["Vi mi hermana", "Vi a mi hermana"],
      ["Espero que vienes", "Espero que vengas"],
      ["Realizo que es tarde", "Me doy cuenta de que es tarde"],
      ["Nos vemos en viernes", "Nos vemos el viernes"]
    ];
    const wrong = [];
    cases.forEach(([input, want]) => {
      const hits = checkSpanish(input);
      const got = hits.length ? hits[0].corrected : "(no correction)";
      if (got !== want) wrong.push(`"${input}" → got "${got}", expected "${want}"`);
    });
    // Correct Spanish must produce no false alarms
    const clean = ["Voy al mercado.", "Me gusta el café.", "Tengo veinte años.",
      "Estoy en casa.", "Soy maestra.", "La gente es amable.", "Me lavo las manos."];
    const falseAlarms = clean.filter((s) => checkSpanish(s).length);
    // Every rule must carry an explanation and a fix
    const { MISTAKE_PATTERNS } = await import("/js/data/mistakePatterns.js");
    const incomplete = MISTAKE_PATTERNS.filter((p) => !p.why || !p.rule || typeof p.fix !== "function").map((p) => p.id);
    return { rules: MISTAKE_PATTERNS.length, wrong, falseAlarms, incomplete };
  });
  check(`${engine.rules} rules, each with a fix and an explanation`, engine.incomplete.length === 0, engine.incomplete.join(", "));
  check("corrects the learner's own sentence", engine.wrong.length === 0, engine.wrong.slice(0, 3).join(" | "));
  check("no false alarms on correct Spanish", engine.falseAlarms.length === 0, engine.falseAlarms.join(" | "));

  // The unit test must include a write-it-in-Spanish question that gives feedback
  const hasProduce = await page.evaluate(async () => {
    const { buildQuiz } = await import("/js/views/roadmap.js");
    const { ROADMAP_UNITS } = await import("/js/data/roadmap.js");
    let seen = 0;
    for (let n = 0; n < 6; n++) {
      if (buildQuiz(ROADMAP_UNITS[0]).some((q) => q.kind === "produce")) seen++;
    }
    return seen;
  });
  check("unit tests ask you to write in Spanish", hasProduce === 6, `${hasProduce}/6 quizzes`);

  // Drive it: answer a produce question wrongly and expect an explained fix
  await go(page, "#/roadmap");
  const node = await page.$(".roadmap-node.unlocked");
  await node.click();
  await page.waitForTimeout(300);
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(200);
  await page.click('button:has-text("Start unit test")');
  await page.waitForTimeout(350);
  // Answer correctly on the way there — wrong answers cost hearts and the
  // attempt would end before reaching the Spanish question.
  await page.evaluate(async () => {
    const { ROADMAP_UNITS } = await import("/js/data/roadmap.js");
    window.__UNITS = ROADMAP_UNITS;
    const { audioEngine } = await import("/js/core/audio.js");
    audioEngine.speak = (x) => { window.__spoken = x; };
  });
  let sawFeedback = false;
  for (let i = 0; i < 12; i++) {
    const spanishBox = await page.$('.exercise-card input[placeholder*="español"]');
    if (spanishBox) {
      await spanishBox.fill("Yo gusto los tacos y estoy doctor");
      await page.click('.exercise-card button:has-text("Check")');
      await page.waitForTimeout(450);
      const block = await page.$(".correction-block");
      if (block) {
        const txt = (await block.textContent()).replace(/\s+/g, " ");
        sawFeedback = /Try/.test(txt) && /gustar|ser vs estar/.test(txt) && /Me gustan los tacos/.test(txt);
      }
      break;
    }
    const info = await page.evaluate(() => {
      const c = document.querySelector(".exercise-card");
      if (!c) return null;
      const prompt = (c.querySelector(".exercise-prompt") || {}).textContent || "";
      const options = [...c.querySelectorAll(".option-btn")].map((o) => o.textContent.trim());
      const words = [...c.querySelectorAll(".word-chip")].map((w) => w.textContent.trim());
      const hasInput = Boolean(c.querySelector('input[type="text"]'));
      let answer = null;
      for (const u of window.__UNITS) {
        for (const s of u.sentences) {
          if (s.es === prompt.trim()) answer = answer ?? s.en;
          if (s.en === prompt.trim()) answer = answer ?? s.es;
        }
        if (u.drill && u.drill.question === prompt.trim()) answer = answer ?? u.drill.answer;
      }
      if (prompt.startsWith("🔊")) answer = window.__spoken || null;
      return { options, words, hasInput, answer };
    });
    if (!info) break;
    if (info.options.length) {
      const idx = info.options.indexOf(info.answer);
      await page.$$eval(".option-btn", (els, k) => els[k >= 0 ? k : 0].click(), idx);
    } else if (info.words.length) {
      for (const w of (info.answer || "").replace(/[¿?¡!.,]/g, "").split(/\s+/)) {
        await page.evaluate((word) => {
          const bank = document.querySelectorAll(".word-bank")[1];
          const chip = [...bank.querySelectorAll(".word-chip")].find((c) => c.textContent.trim() === word);
          if (chip) chip.click();
        }, w);
        await page.waitForTimeout(25);
      }
      await page.click('.exercise-card button:has-text("Check")');
    } else if (info.hasInput) {
      await page.fill('.exercise-card input[type="text"]', info.answer || "x");
      await page.click('.exercise-card button:has-text("Check")');
    }
    await page.waitForTimeout(260);
    const next = await page.$('button:has-text("Next"), button:has-text("See results")');
    if (next) { await next.click(); await page.waitForTimeout(280); }
  }
  check("a wrong Spanish answer gets an explained correction in the quiz", sawFeedback);
  check("no JS errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

async function testImmersion(browser) {
  group("immersion");
  const { page, ctx, errors } = await freshPage(browser, { mobile: true });

  const say = async (msg) => {
    await page.fill(".chat-input-row input", msg);
    await page.click('button:has-text("Enviar")');
    await page.waitForTimeout(450);
    return page.$$eval(".chat-bubble.bot .cb-es", (els) => els.map((e) => e.textContent.trim()));
  };

  await go(page, "#/practice/immersion");
  await page.waitForTimeout(300);

  // 14 turns of the same kind of answer — the old engine returned one canned
  // reply per keyword, so this is exactly what exposed the repetition.
  const replies = [];
  const inputs = ["Hola", "Me llamo Cindy", "Bien, gracias", "Me gusta la comida",
    "Sí, mucho", "Trabajo en un hospital", "Está bien", "Tengo dos hermanos",
    "Sí, nos vemos seguido", "Me gusta viajar", "A la playa", "Con mi familia",
    "Los fines de semana", "Sí, claro"];
  for (const msg of inputs) {
    const all = await say(msg);
    replies.push(all[all.length - 1]);
  }
  const unique = new Set(replies);
  check(`${replies.length} turns produced ${unique.size} distinct replies`,
    unique.size === replies.length, [...replies].filter((r, i) => replies.indexOf(r) !== i).slice(0, 3).join(" | "));

  const questions = replies.filter((r) => r.includes("?"));
  check("nearly every reply asks something", questions.length >= replies.length - 2, `${questions.length}/${replies.length}`);

  // Asking for help must not consume a question or invent a new one
  const beforeHelp = (await page.$$eval(".chat-bubble.bot .cb-es", (e) => e.length));
  await page.fill(".chat-input-row input", "?");
  await page.click('button:has-text("Enviar")');
  await page.waitForTimeout(500);
  const helpBubble = await page.$(".badge.badge-gold");
  check('"?" replays the last line with a translation', Boolean(helpBubble));
  const afterHelp = await page.$$eval(".chat-bubble.bot .cb-es", (e) => e.length);
  check('"?" does not skip ahead to a new question', afterHelp - beforeHelp <= 1, `${afterHelp - beforeHelp} new bot lines`);

  // A SECOND session in the same browser must not repeat the first session's
  // questions — this is the part people actually notice.
  const firstSession = new Set(replies.map((r) => r.replace(/^[^¿]*/, "")).filter(Boolean));
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.evaluate(async () => {
    const { audioEngine } = await import("/js/core/audio.js");
    audioEngine.speak = () => {};
  });
  await go(page, "#/practice/immersion");
  await page.waitForTimeout(300);
  const second = [];
  for (const msg of inputs.slice(0, 8)) {
    const all = await say(msg);
    second.push(all[all.length - 1]);
  }
  const secondQuestions = second.map((r) => r.replace(/^[^¿]*/, "")).filter(Boolean);
  const repeated = secondQuestions.filter((q) => firstSession.has(q));
  check("a second session asks different questions", repeated.length === 0, repeated.slice(0, 3).join(" | "));

  // Openers should vary rather than always being the same greeting
  const openers = new Set();
  for (let i = 0; i < 8; i++) {
    const c = await browser.newContext({ ...devices["iPhone 13"] });
    const pg = await c.newPage();
    await pg.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
    await pg.waitForTimeout(250);
    for (let k = 0; k < 4; k++) { const b = await pg.$(".onboarding-nav .btn-primary"); if (b) { await b.click(); await pg.waitForTimeout(110); } }
    await pg.evaluate(async () => { const { audioEngine } = await import("/js/core/audio.js"); audioEngine.speak = () => {}; });
    await pg.evaluate(() => { window.location.hash = "#/practice/immersion"; });
    await pg.waitForTimeout(500);
    const first = await pg.$eval(".chat-bubble.bot .cb-es", (e) => e.textContent.trim()).catch(() => null);
    if (first) openers.add(first);
    await c.close();
  }
  check("the opening line varies between sessions", openers.size >= 3, `${openers.size} distinct openers in 8 fresh sessions`);
  check("no JS errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

async function testScenarios(browser) {
  group("scenarios");
  const { page, ctx, errors } = await freshPage(browser);

  const integrity = await page.evaluate(async () => {
    const { SCENARIOS } = await import("/js/data/scenarios.js");
    const { levelIndex } = await import("/js/data/roadmap.js");
    const problems = [];
    const ids = new Set();
    SCENARIOS.forEach((s) => {
      if (ids.has(s.id)) problems.push(`duplicate id ${s.id}`);
      ids.add(s.id);
      if (levelIndex(s.actflTier) === -1) problems.push(`${s.id}: invalid actflTier ${s.actflTier}`);
      if (!s.openings || !s.openings.length) problems.push(`${s.id}: no openings`);
      const required = s.slots.filter((sl) => sl.required);
      if (!required.length) problems.push(`${s.id}: no required slots`);
      required.forEach((sl) => {
        if (!sl.askPhrases || !sl.askPhrases.length) problems.push(`${s.id}/${sl.id}: no askPhrases`);
        if (typeof sl.extract !== "function") problems.push(`${s.id}/${sl.id}: no extract()`);
      });
      if (!s.unexpectedFollowUps || !s.unexpectedFollowUps.length) problems.push(`${s.id}: no unexpectedFollowUps`);
      if (!s.failureStates || !s.failureStates.length) problems.push(`${s.id}: no failureStates`);
      if (typeof s.successCondition !== "function") problems.push(`${s.id}: no successCondition()`);
    });
    return { count: SCENARIOS.length, problems };
  });
  check(`${integrity.count} scenario(s) defined`, integrity.count >= 1);
  check("every scenario has valid tier/slots/openings/failure states", integrity.problems.length === 0, integrity.problems.slice(0, 4).join(" | "));

  const nlu = await page.evaluate(async () => {
    const { scenarioById } = await import("/js/data/scenarios.js");
    const s = scenarioById("order-coffee");
    const slot = (id) => s.slots.find((x) => x.id === id);
    return {
      size1: slot("size").extract("Quiero uno mediano, por favor"),
      size2: slot("size").extract("uno grande"),
      size3: slot("size").extract("un chico"),
      milk1: slot("milk").extract("con leche de almendra"),
      milk2: slot("milk").extract("sin leche"),
      milk3: slot("milk").extract("deslactosada, por favor"),
      drink1: slot("drink").extract("Quiero un latte"),
      drink2: slot("drink").extract("un capuchino"),
      temp1: slot("temperature").extract("frío, por favor"),
      temp2: slot("temperature").extract("caliente"),
      sugar1: slot("sugar").extract("sin azúcar"),
      payment1: slot("payment").extract("con tarjeta")
    };
  });
  check("NLU extracts size (mediano/grande/chico)", nlu.size1 === "mediano" && nlu.size2 === "grande" && nlu.size3 === "chico", JSON.stringify(nlu));
  check("NLU extracts milk type", nlu.milk1 === "almendra" && nlu.milk2 === "sin leche" && nlu.milk3 === "deslactosada", JSON.stringify(nlu));
  check("NLU extracts drink type", nlu.drink1 === "latte" && nlu.drink2 === "capuchino", JSON.stringify(nlu));
  check("NLU extracts temperature", nlu.temp1 === "frío" && nlu.temp2 === "caliente", JSON.stringify(nlu));
  check("NLU extracts sugar preference", nlu.sugar1 === "sin azúcar", JSON.stringify(nlu));
  check("NLU extracts payment method", nlu.payment1 === "tarjeta", JSON.stringify(nlu));

  const completion = await page.evaluate(async () => {
    const { scenarioById } = await import("/js/data/scenarios.js");
    const { createSession, submitUserTurn, resolveSession } = await import("/js/core/taskEngine.js");
    const s = scenarioById("order-coffee");
    const answers = { drink: "Quiero un latte", size: "mediano", temperature: "caliente", milk: "leche entera", sugar: "con azúcar", payment: "con tarjeta" };
    const session = createSession(s);
    let guard = 0;
    // Repeats until every required slot is filled AND any NPC mistake along
    // the way has been repaired — a real "success" run must handle whatever
    // turn kind comes back, not just answer slots in isolation.
    while (guard < 20) {
      guard++;
      if (session.pendingMistake) {
        submitUserTurn(session, "No, pedí mediano.");
        continue;
      }
      const missing = session.requiredSlots.find((sl) => session.slots[sl.id] === undefined);
      if (!missing) break;
      submitUserTurn(session, answers[missing.id] || "no sé");
    }
    resolveSession(session);
    return { status: session.status, filled: session.filledRequiredCount, total: session.requiredSlots.length, turns: session.turns, unresolvedMistakes: session.unresolvedMistakes };
  });
  check("filling every required slot resolves to success", completion.status === "success", JSON.stringify(completion));

  const abandonment = await page.evaluate(async () => {
    const { scenarioById } = await import("/js/data/scenarios.js");
    const { createSession, submitUserTurn, resolveSession } = await import("/js/core/taskEngine.js");
    const s = scenarioById("order-coffee");
    const session = createSession(s);
    for (let i = 0; i < 15; i++) submitUserTurn(session, "mmm no sé");
    resolveSession(session);
    return { status: session.status, filled: session.filledRequiredCount };
  });
  check("never answering resolves to incomplete (not stuck)", abandonment.status === "incomplete", JSON.stringify(abandonment));

  const rubric = await page.evaluate(async () => {
    const { scenarioById } = await import("/js/data/scenarios.js");
    const { scoreSession } = await import("/js/core/actflAssess.js");
    const s = scenarioById("order-coffee");
    const strong = {
      scenario: s, turns: 8, requiredSlots: s.slots.filter((sl) => sl.required),
      filledRequiredCount: s.slots.filter((sl) => sl.required).length,
      questionsAsked: 2, mistakesFired: ["wrong-size"], unresolvedMistakes: 0,
      log: [
        { speaker: "user", text: "Quisiera un latte mediano, caliente, con leche de avena y sin azúcar, por favor. ¿Cuánto cuesta?" },
        { speaker: "npc", isMistakeTrigger: true },
        { speaker: "user", text: "Perdón, no era grande, pedí mediano. ¿Puede repetir mi orden?" }
      ]
    };
    const weak = {
      scenario: s, turns: 3, requiredSlots: s.slots.filter((sl) => sl.required),
      filledRequiredCount: 2, questionsAsked: 0, mistakesFired: [], unresolvedMistakes: 0,
      log: [{ speaker: "user", text: "latte estoy doctor" }]
    };
    return { strong: scoreSession(strong).overall, weak: scoreSession(weak).overall };
  });
  check("a strong session scores higher than a weak one", rubric.strong > rubric.weak, JSON.stringify(rubric));

  // Gating is relative to the nearest tier that actually HAS scenario
  // content, not literal ACTFL_LEVELS[index-1] — otherwise the very first
  // scenario tier shipped would be permanently locked behind a prerequisite
  // that can never be earned because no scenario exists at that tier. These
  // fixtures pass an explicit `tiers` lineup so the test stays meaningful
  // regardless of how many real scenarios/tiers currently exist.
  const gate = await page.evaluate(async () => {
    const { store } = await import("/js/core/storage.js");
    const { meetsGateForTier } = await import("/js/core/actflProfile.js");
    const { ACTFL_LEVELS } = await import("/js/data/roadmap.js");
    const fixtureTiers = [ACTFL_LEVELS[0], ACTFL_LEVELS[1]]; // novice-low, novice-mid
    store.state.progress.scenarioAttempts = [];
    const base = { requiredSlotsFilled: 6, requiredSlotsTotal: 6, overallScore: 80, tier: "novice-low" };
    const openAlways = meetsGateForTier("novice-low", fixtureTiers);
    store.state.progress.scenarioAttempts = [
      { ...base, scenarioId: "a" }, { ...base, scenarioId: "a" }
    ];
    const oneScenarioTwoPasses = meetsGateForTier("novice-mid", fixtureTiers);
    store.state.progress.scenarioAttempts.push({ ...base, scenarioId: "b" });
    const twoScenariosThreePasses = meetsGateForTier("novice-mid", fixtureTiers);
    return { openAlways, oneScenarioTwoPasses, twoScenariosThreePasses };
  });
  check("the first content-bearing tier is always open", gate.openAlways === true, JSON.stringify(gate));
  check("a gate stays locked on passes from only one scenario", gate.oneScenarioTwoPasses === false, JSON.stringify(gate));
  check("a gate unlocks on 3 passes across 2 distinct scenarios", gate.twoScenariosThreePasses === true, JSON.stringify(gate));

  // Regression guard for a real bug: with only one scenario shipped so far
  // (order-coffee, tier novice-mid), novice-mid IS the first content-bearing
  // tier, so it must be playable immediately with zero prior attempts.
  const firstShippedTierOpen = await page.evaluate(async () => {
    const { meetsGateForTier } = await import("/js/core/actflProfile.js");
    const { store } = await import("/js/core/storage.js");
    store.state.progress.scenarioAttempts = [];
    return meetsGateForTier("novice-mid");
  });
  check("the first tier that actually ships a scenario is playable with no prior attempts", firstShippedTierOpen === true);

  // Regression: a past bug jumped straight to the debrief without ever
  // showing the NPC's final line whenever that SAME turn also tripped a
  // failure/incomplete resolution (e.g. the turn that crosses the abandoned
  // threshold is still a normal "ask" with real content). Math.random is
  // pinned so no mistake/follow-up ever fires — every turn is a plain ask —
  // isolating this from mistake-timing luck.
  const { page: page2, ctx: ctx2 } = await freshPage(browser);
  await page2.evaluate(() => { Math.random = () => 0.99; });
  await page2.evaluate(() => { window.location.hash = "#/practice/roleplay"; });
  await page2.waitForTimeout(400);
  await page2.evaluate(() => { [...document.querySelectorAll(".card")].find((c) => c.textContent.includes("Order a Coffee"))?.click(); });
  await page2.waitForTimeout(300);
  for (let i = 0; i < 15; i++) {
    await page2.evaluate(() => { const input = document.querySelector(".chat-input-row input"); if (input) input.value = "no sé, no sé"; });
    await page2.evaluate(() => { [...document.querySelectorAll(".chat-input-row button")].find((b) => b.textContent.includes("Enviar"))?.click(); });
    await page2.waitForTimeout(200);
  }
  // finish() renders through a 350ms + 700ms chained delay (so the NPC's
  // final line is visibly shown before the debrief) — give it time to land.
  await page2.waitForTimeout(1300);
  const abandoned = await page2.evaluate(async () => {
    const { store } = await import("/js/core/storage.js");
    const attempts = store.state.progress.scenarioAttempts;
    const last = attempts[attempts.length - 1];
    return {
      outcome: last && last.outcome,
      turns: last && last.turns,
      botBubbles: document.querySelectorAll(".chat-bubble.bot").length,
      hasDebrief: !!document.querySelector(".empty-state")
    };
  });
  check("an abandoned session still shows the NPC's final turn before the debrief", abandoned.hasDebrief && abandoned.botBubbles >= abandoned.turns, JSON.stringify(abandoned));
  check("an abandoned session resolves to incomplete, not a silent dead end", abandoned.outcome === "incomplete", JSON.stringify(abandoned));
  await ctx2.close();

  check("no JS errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

async function testProficiency(browser) {
  group("proficiency");
  const { page, ctx, errors } = await freshPage(browser);

  const baseline = await page.evaluate(async () => {
    const { store } = await import("/js/core/storage.js");
    const { canonicalLevelIndex } = await import("/js/core/actflProfile.js");
    store.state.profile.xp = 0;
    store.state.profile.confirmedLevel = null;
    store.state.progress.gatesUnlocked = [];
    return canonicalLevelIndex();
  });
  check("zero-evidence learner reads as the lowest ACTFL level", baseline === 0, String(baseline));

  const confirmedFloor = await page.evaluate(async () => {
    const { store } = await import("/js/core/storage.js");
    const { canonicalLevelIndex } = await import("/js/core/actflProfile.js");
    const { levelIndex } = await import("/js/data/roadmap.js");
    store.state.profile.xp = 0;
    store.state.profile.confirmedLevel = "intermediate-mid";
    return { idx: canonicalLevelIndex(), want: levelIndex("intermediate-mid") };
  });
  check("a roadmap checkpoint still floors the estimate", confirmedFloor.idx === confirmedFloor.want, JSON.stringify(confirmedFloor));

  // An earned scenario gate is a floor, tested directly against
  // canonicalLevelIndex() the same way confirmedLevel is above (recording
  // HOW a gate gets earned is covered separately in the "scenarios" group).
  const scenarioFloor = await page.evaluate(async () => {
    const { store } = await import("/js/core/storage.js");
    const { canonicalLevelIndex } = await import("/js/core/actflProfile.js");
    const { levelIndex } = await import("/js/data/roadmap.js");
    store.state.profile.xp = 0;
    store.state.profile.confirmedLevel = null;
    store.state.progress.gatesUnlocked = ["novice-mid"];
    return { idx: canonicalLevelIndex(), want: levelIndex("novice-mid") };
  });
  check("an earned scenario gate raises the estimate past a zero XP baseline", scenarioFloor.idx >= scenarioFloor.want, JSON.stringify(scenarioFloor));

  // Regression guard for a real bug caught in manual testing: with only one
  // scenario tier shipped so far, that tier is trivially open (no
  // prerequisite exists to earn), so merely attempting it — even
  // successfully, repeatedly — must NOT by itself confirm a proficiency
  // floor. Confirmation requires clearing an actual prerequisite gate.
  const firstTierNeverAutoConfirms = await page.evaluate(async () => {
    const { store } = await import("/js/core/storage.js");
    const { recordScenarioAttempt } = await import("/js/core/actflProfile.js");
    store.state.progress.scenarioAttempts = [];
    store.state.progress.scenarioBest = {};
    store.state.progress.gatesUnlocked = [];
    store.state.profile.actflConfirmedByScenario = null;
    const passing = { requiredSlotsFilled: 6, requiredSlotsTotal: 6, overallScore: 80, tier: "novice-mid", turns: 8, questionsAsked: 1, mistakesFired: 0, unresolvedMistakes: 0, dimensions: {}, outcome: "success", date: "2026-01-01" };
    recordScenarioAttempt({ ...passing, scenarioId: "order-coffee" });
    recordScenarioAttempt({ ...passing, scenarioId: "order-coffee" });
    recordScenarioAttempt({ ...passing, scenarioId: "order-coffee" });
    return { gatesUnlocked: store.state.progress.gatesUnlocked.slice(), confirmedByScenario: store.state.profile.actflConfirmedByScenario };
  });
  check("passing attempts at the first (always-open) tier don't themselves confirm a gate", firstTierNeverAutoConfirms.gatesUnlocked.length === 0, JSON.stringify(firstTierNeverAutoConfirms));

  check("no JS errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

async function testStorage(browser) {
  group("storage");
  // The bug this guards: deepMerge only walked keys present in the defaults,
  // so any key whose default was {} had its saved contents silently dropped.
  const { page, ctx } = await freshPage(browser);
  await page.evaluate(async () => {
    const { store } = await import("/js/core/storage.js");
    const { gradeItem, QUALITY } = await import("/js/core/srs.js");
    gradeItem("word_v001", "word", QUALITY.GOOD);
    gradeItem("word_v002", "word", QUALITY.GOOD);
    store.state.profile.xp = 4321;
    store.state.progress.roadmapUnitsCompleted = ["r01", "r02"];
    store.state.progress.checkpointsPassed = ["novice-low"];
    store.state.profile.confirmedLevel = "novice-low";
    store.state.progress.savedWords = { hola: "hello" };
    store.state.progress.scenarioAttempts.push({
      date: "2026-01-01", scenarioId: "order-coffee", tier: "novice-mid",
      turns: 9, requiredSlotsFilled: 6, requiredSlotsTotal: 6, questionsAsked: 1,
      mistakesFired: 1, unresolvedMistakes: 0,
      dimensions: { comprehensibility: 80, vocabularyRange: 60, sentenceFormation: 75,
        repairStrategies: 100, conversationManagement: 65, questionAsking: 33, surpriseHandling: 100 },
      overallScore: 78, outcome: "success"
    });
    store.state.progress.scenarioBest["order-coffee"] = 78;
    store.state.progress.gatesUnlocked = ["novice-mid"];
    store.state.profile.actflConfirmedByScenario = "novice-mid";
    store.saveNow();
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const after = await page.evaluate(async () => {
    const { store } = await import("/js/core/storage.js");
    return {
      srs: Object.keys(store.state.srs).length,
      xp: store.state.profile.xp,
      units: (store.state.progress.roadmapUnitsCompleted || []).length,
      checkpoints: (store.state.progress.checkpointsPassed || []).length,
      confirmed: store.state.profile.confirmedLevel,
      saved: Object.keys(store.state.progress.savedWords || {}).length,
      scenarioAttempts: (store.state.progress.scenarioAttempts || []).length,
      scenarioBest: (store.state.progress.scenarioBest || {})["order-coffee"],
      gatesUnlocked: (store.state.progress.gatesUnlocked || []).length,
      actflConfirmedByScenario: store.state.profile.actflConfirmedByScenario
    };
  });
  check("spaced repetition survives a reload", after.srs === 2, `${after.srs} of 2 items`);
  check("XP survives a reload", after.xp === 4321, String(after.xp));
  check("completed units survive a reload", after.units === 2, String(after.units));
  check("checkpoints survive a reload", after.checkpoints === 1, String(after.checkpoints));
  check("confirmed level survives a reload", after.confirmed === "novice-low", String(after.confirmed));
  check("saved story words survive a reload", after.saved === 1, String(after.saved));
  check("scenario attempts survive a reload", after.scenarioAttempts === 1, String(after.scenarioAttempts));
  check("scenario best score survives a reload", after.scenarioBest === 78, String(after.scenarioBest));
  check("unlocked scenario gates survive a reload", after.gatesUnlocked === 1, String(after.gatesUnlocked));
  check("scenario-confirmed ACTFL level survives a reload", after.actflConfirmedByScenario === "novice-mid", String(after.actflConfirmedByScenario));
  await ctx.close();
}

async function testMobile(browser) {
  group("mobile");
  for (const [label, viewport] of [["iPhone SE 375", { width: 375, height: 667 }], ["phone 390", { width: 390, height: 844 }], ["tiny 320", { width: 320, height: 568 }]]) {
    const ctx = await browser.newContext({ viewport, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
    await page.waitForTimeout(250);
    for (let i = 0; i < 4; i++) { const x = await page.$(".onboarding-nav .btn-primary"); if (x) { await x.click(); await page.waitForTimeout(110); } }
    let overflow = 0;
    for (const h of ["#/dashboard", "#/roadmap", "#/learn", "#/practice", "#/practice/roleplay", "#/review", "#/save"]) {
      await go(page, h);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (over > 2) overflow++;
    }
    const tabbar = await page.evaluate(() => getComputedStyle(document.getElementById("tabbar")).display);
    check(`${label}: no horizontal scrolling`, overflow === 0, `${overflow} route(s) overflow`);
    check(`${label}: bottom tab bar visible`, tabbar === "grid", tabbar);
    await ctx.close();
  }
  const dctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const dpage = await dctx.newPage();
  await dpage.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await dpage.waitForTimeout(300);
  const dtab = await dpage.evaluate(() => getComputedStyle(document.getElementById("tabbar")).display);
  check("desktop: tab bar hidden", dtab === "none", dtab);
  await dctx.close();
}

async function testOffline(browser) {
  group("offline");
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const cached = await page.evaluate(async () => {
    const names = await caches.keys();
    if (!names.length) return { names, files: 0 };
    const c = await caches.open(names[0]);
    return { names, files: (await c.keys()).length };
  });
  check("service worker caches the app", cached.files > 40, `${cached.files} files in ${cached.names.join(",")}`);
  await ctx.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
  await page.waitForTimeout(1200);
  const offlineOk = await page.evaluate(() => document.querySelectorAll(".roadmap-node, .app-shell").length > 0);
  check("app still loads with the network off", offlineOk);
  await ctx.setOffline(false);
  await ctx.close();
}

// ================= runner =================
const GROUPS = {
  routes: testRoutes,
  vocabulary: testVocabulary,
  pronunciation: testPronunciation,
  roadmap: testRoadmap,
  stories: testStories,
  "tap-a-word": testTapWords,
  "error feedback": testCorrections,
  immersion: testImmersion,
  scenarios: testScenarios,
  proficiency: testProficiency,
  storage: testStorage,
  mobile: testMobile,
  offline: testOffline
};

const only = process.argv[2];
const server = await startServer();
const browser = await chromium.launch();
const started = Date.now();

try {
  for (const [name, fn] of Object.entries(GROUPS)) {
    if (only && only !== name) continue;
    console.log(`\n${name}`);
    await fn(browser);
  }
} finally {
  await browser.close();
  server.close();
}

const failed = results.filter((r) => !r.pass);
console.log(`\n${"─".repeat(52)}`);
console.log(`${results.length - failed.length}/${results.length} checks passed in ${((Date.now() - started) / 1000).toFixed(1)}s`);
if (failed.length) {
  console.log(`\n${failed.length} FAILED:`);
  failed.forEach((f) => console.log(`  ✗ [${f.group}] ${f.label}${f.detail ? " — " + f.detail : ""}`));
  process.exit(1);
}
