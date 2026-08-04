# Tests

The app has no build step, so nothing else stands between a bad edit and the
learners using it. This suite is that gate.

```bash
npm install
npx playwright install chromium
npm test              # everything
npm test storage      # one group
```

Exits non-zero if any check fails. CI runs it on every push touching
`mexican-spanish-tutor/`, and the Pages deploy will not run unless it passes.

## Groups

| Group | What it protects |
|---|---|
| `routes` | Every route renders, with no JS errors |
| `vocabulary` | 1,000 unique words, all with pronunciation, meaning and an example; the detail view survives lean entries |
| `pronunciation` | The IPA generator still matches all 70 hand-written transcriptions |
| `roadmap` | Unit tests are 10 questions with correct review sourcing; checkpoints are 15 and cover every unit in their section |
| `stories` | Stories span all seven ACTFL levels and every rendered word has a definition |
| `storage` | Progress survives a reload |
| `mobile` | No horizontal scrolling at phone widths; tab bar shows on phones and hides on desktop |
| `offline` | The service worker caches the app and it runs with the network off |

## Why `storage` matters most

A `deepMerge` bug once discarded **all** spaced-repetition data on every page
load. Any key whose default was `{}` had its saved contents dropped, silently —
the app looked fine, and progress evaporated. That group re-checks the exact
behaviour; deliberately reintroducing the bug fails it.

Adding a state key? Declare it in `defaultState()` in `js/core/storage.js`, or
it will not survive a reload. Add it to the `storage` group too.
