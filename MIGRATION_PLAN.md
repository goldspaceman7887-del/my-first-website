# MIGRATION_PLAN.md

## Scope

This plan covers the three language-learning apps built to the same architecture: **Mexican Spanish Tutor** (`/mexican-spanish-tutor/`), **Mandarin Tutor** (`/mandarin-tutor/`), and **Japanese Speaking Lab** (`/japanese-speaking/`). Vamos and Seed English Tokyo are out of scope for this decision.

Note: no `CONTEXT.md` exists anywhere in this repository (verified by a full-tree search). This plan is based on `PROJECT.md` plus a direct code-level diff of the three apps' `js/core/` modules, CSS, data, and views.

---

## Evidence

Diffing the three apps' core modules:

| Module | Finding |
|---|---|
| `router.js` | Mexican vs. Mandarin: **1-line diff** out of 91 lines. Near byte-identical. |
| `ui.js` | Mandarin has one extra helper (`downloadJSON`); otherwise identical. |
| `storage.js` | Same shape (`Store` class, `deepMerge`, debounced save, `subscribe`) — but ~130 of 224 lines diverge, and that divergence is entirely each app's own `defaultState()` content. |
| `srs.js` | Shared SM-2-style skeleton, with app-specific extras layered on top (`gradeAhead` in Mexican Spanish Tutor; `markKnown`/`forgetItem` in Mandarin Tutor). |
| `gamification.js` | Shares XP/streak/achievement *mechanics*, but the leveling scheme genuinely differs (ACTFL XP thresholds vs. character-count tiers). Japanese Speaking Lab doesn't have this file at all. |
| CSS (`themes.css`, `main.css`) | 100+ line diffs each — same token *structure*, different values/scale. Japanese Speaking Lab uses a single unstructured `styles.css`, no split. |
| `data/` (content) | 5,568 / 2,825 / 8,063 lines respectively — the bulk of each app, 100% pedagogy-specific (vocabulary, grammar, dialogues). Not shareable by nature. |
| Views | 25 / 15 / 12 route modules — also inherently app/content-specific. |

The CI pipeline (`deploy-pages.yml`) already treats these as independent deploy artifacts: it gates the whole site's deploy only on Mexican Spanish Tutor's Playwright suite, and copies each app's folder as-is into `_site/`.

---

## Options evaluated

| Criterion | 1. Separate + shared core | 2. Single multilingual platform | 3. Fully separate |
|---|---|---|---|
| **Development speed** | High — content/view work stays scoped to one app; shared plumbing fixed once | Low initially — needs a unifying schema/router/i18n layer before any content work resumes | High per-app, but any cross-cutting fix must be redone 3x |
| **Maintenance effort** | Medium — one shared core to keep stable, small surface (~400-500 lines) | Low *if* unified, but high risk of an ever-growing abstraction layer trying to fit 3 different pedagogies | High — every bugfix in router/storage/srs/gamification logic is manually re-applied in 3 places (already the state today) |
| **Scalability** | Good — content and views scale per-app without touching the core | Poor — a single schema strains as apps diverge further (Japanese Speaking Lab already has no onboarding/gamification) | Poor — duplication compounds linearly with each new app |
| **Future language expansion** | Good — new app copies the shared core, writes only its content/schema | Risky — new language must fit the unified model or the model bends again | Good speed for the new app itself, but adds another full copy of everything to maintain |
| **Deployment complexity** | Low-medium — one added CI step (copy `shared/` into each app folder pre-package); apps still ship as independent static folders | High — likely needs a real build step, shared routing/state, and the current CI gating story (one app's tests block everyone's deploy) gets murkier | Lowest — status quo, already working |
| **Claude Code token efficiency** | High — most sessions stay scoped to one app's views/data (small shared core is cheap to load fully when touched); no duplicated-fix tax across repeat sessions | Lower — a unified codebase means more surrounding cross-language context has to be loaded per session to avoid breaking other languages | High per individual session, but the same fix (e.g. a storage bug) gets independently re-diagnosed and re-token-spent across 3 separate sessions over time |
| **Risk of breaking existing functionality** | Low-medium — extraction is mechanical (proven by diff), storage keys/schemas untouched, but needs a shared-core test gate since 3 apps now depend on one file | High — touches live apps' `localStorage` schemas and content structure; real risk of a user-progress-breaking migration | None from this decision, but the current duplication risk (a fix applied once, forgotten twice) is realized on every core-logic change |

---

## Recommendation: Keep separate apps with a shared core

This isn't a compromise pick — it's the option the evidence supports. The diffs show real, low-risk duplication in exactly the parts of the codebase that are generic (router, UI helpers, storage/SRS/gamification *engines*), while the parts that would have to unify under a single-platform approach — content, views, `defaultState()` schema — are irreducibly language-specific and represent the large majority of each app's code (~16,500 of roughly 20,000 total lines). A single-platform rewrite pays a large rework and data-migration cost to unify code that shouldn't be unified. Staying fully separate keeps paying a small but compounding tax forever: every core-logic fix gets applied once and forgotten in the other two apps.

### Major risks

1. **Shared core becomes a silent single point of failure.** Once 3 apps depend on one `storage.js`/`srs.js` engine, a regression there breaks three live products with real users' progress at once — and today only Mexican Spanish Tutor has any automated test gate. This must be closed *before* the extraction fans out, not after.
2. **Scope creep toward a full platform merge.** The temptation, once a shared core exists, is to keep pulling more in (views, content schema) "since it's already shared." Extraction criteria need to stay strict: only code that's already proven near-identical by diff.
3. **Deploy pipeline coupling.** `deploy-pages.yml` currently copies each app folder as-is; introducing a copy-shared-into-each-app step is a new moving part in the one thing that reliably ships all four apps today. A mistake here risks the "resilient multi-app packaging" property PROJECT.md calls out as a deliberate strength.
4. **No user-facing data migration required, but no zero-risk guarantee either.** Even though `defaultState()`/storage keys stay app-owned, any bug in the extracted `deepMerge`/`Store` logic touches live `localStorage` data for all three apps' users simultaneously.

---

## Migration plan (ordered to minimize rework, each phase independently shippable)

**Phase 0 — Freeze extraction criteria & pick the sharing mechanism.**
Only extract code that's identical or near-identical across ≥2 apps *today* (proven by diff, not assumption) and stable (not mid-redesign). Sharing mechanism: a new top-level `shared/` source directory, copied into each app's own `js/core/` at CI packaging time — not imported across app boundaries at runtime. This keeps each deployed app self-contained (no new cross-app runtime coupling, no risk to independent rollback) while eliminating source duplication in the repo. Update `.github/workflows/deploy-pages.yml`'s copy step accordingly.

**Phase 1 — Extract the near-zero-risk modules first.**
`router.js` (1-line diff) and `ui.js` (near-identical) move to `shared/core/`, parameterized only where they already differ (e.g., router's default-hash fallback becomes a constructor argument). Safest possible first commit; validates the copy-at-build mechanism before anything riskier moves.

**Phase 2 — Extract the storage engine skeleton, not the schema.**
Pull the generic `Store` class (`get`/`set`/debounced `save`/`subscribe`/`deepMerge`) into `shared/core/storage-engine.js`, taking `STORAGE_KEY` and `defaultState()` as constructor arguments. Each app's own `storage.js` shrinks to its `defaultState()` object plus a one-line instantiation of the shared engine. No app's localStorage key or schema changes — purely an internal refactor, invisible to end users.

**Phase 3 — Extract the SRS ladder engine.**
Generalize the SM-2-style scheduler to take an app's interval-step table as config. Keep app-specific extras (`gradeAhead`, `markKnown`, `forgetItem`) as thin per-app wrappers calling the shared engine, since these aren't universal across all three apps.

**Phase 4 — Extract gamification primitives, not leveling schemes.**
Share the XP/streak/achievement bookkeeping mechanism; leave each app's threshold table (ACTFL XP curve vs. character-count tiers) as a config object passed in. Japanese Speaking Lab, which currently has no `gamification.js`, can adopt the shared module directly here rather than someone writing one from scratch — a side benefit, not a phase goal.

**Phase 5 — Mandatory: extend automated test coverage to the shared core before/alongside extraction.**
Right now only Mexican Spanish Tutor has tests, and it's the only thing gating the whole site's deploy. Once `shared/core/` feeds three apps, a regression there silently breaks three curricula with no CI signal. Add a dedicated test suite against `shared/core/` itself (can reuse Mexican Spanish Tutor's Playwright setup as a template) and wire it into `deploy-pages.yml` as an additional required job — this closes the exact gap the extraction would otherwise open.

**Phase 6 — Optional cleanup, not required for the sharing goal.**
Bring Japanese Speaking Lab's CSS up to the same `themes.css`/`main.css`/`components.css`/`animations.css` split the other two use, now that the token *structure* can come from shared conventions — purely cosmetic parity, do it last and only if there's appetite.

**What never moves:** `js/data/`, `js/views/`, each app's `defaultState()` content, storage keys, and manifest/icon branding. These are the actual product and are correctly independent.

---

## Next 3 implementation steps

1. **Stand up the `shared/` source directory and the copy-at-build mechanism**, and prove it end-to-end on the two safest modules only — `router.js` and `ui.js` (already near byte-identical). Update `deploy-pages.yml`'s packaging step to copy `shared/core/` into each app's `js/core/` before assembly, so each deployed app remains a self-contained static folder with zero new runtime coupling.
2. **Extract the storage engine skeleton** (the generic `Store` class: get/set/debounced save/subscribe/deepMerge) into the shared core, parameterized by each app's own `STORAGE_KEY` and `defaultState()`. Leave every app's schema, content, and localStorage key exactly as-is — this step should be invisible to end users.
3. **Add an automated regression suite for the shared core itself** (extending the existing Playwright pattern from Mexican Spanish Tutor) and wire it into `deploy-pages.yml` as a required job before any further logic (SRS, gamification) is extracted — so the moment shared code starts feeding more than one app, there's a CI gate protecting all of them, not just one.
