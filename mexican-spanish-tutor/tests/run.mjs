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
    "#/practice/conversation", "#/review", "#/review/known", "#/save", "#/achievements", "#/settings"];
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
      saved: Object.keys(store.state.progress.savedWords || {}).length
    };
  });
  check("spaced repetition survives a reload", after.srs === 2, `${after.srs} of 2 items`);
  check("XP survives a reload", after.xp === 4321, String(after.xp));
  check("completed units survive a reload", after.units === 2, String(after.units));
  check("checkpoints survive a reload", after.checkpoints === 1, String(after.checkpoints));
  check("confirmed level survives a reload", after.confirmed === "novice-low", String(after.confirmed));
  check("saved story words survive a reload", after.saved === 1, String(after.saved));
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
    for (const h of ["#/dashboard", "#/roadmap", "#/learn", "#/practice", "#/review", "#/save"]) {
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
