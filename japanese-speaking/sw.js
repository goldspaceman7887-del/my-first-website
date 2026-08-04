// Offline app-shell cache. Bump CACHE_VERSION whenever precached files change so clients
// pick up the new set instead of serving stale ones forever.
const CACHE_VERSION = "v1";
const CACHE_NAME = `jp-speaking-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./js/app.js",
  "./js/core/audio.js",
  "./js/core/pathGeometry.js",
  "./js/core/router.js",
  "./js/core/srs.js",
  "./js/core/storage.js",
  "./js/core/ui.js",
  "./js/core/wordLookup.js",
  "./js/data/connectors.js",
  "./js/data/dictionary.js",
  "./js/data/grammar.js",
  "./js/data/levelExamples.js",
  "./js/data/models.js",
  "./js/data/prompts.js",
  "./js/data/reviewPool.js",
  "./js/data/roadmap.js",
  "./js/data/vocabulary.js",
  "./js/views/connectors.js",
  "./js/views/dashboard.js",
  "./js/views/grammar.js",
  "./js/views/guide.js",
  "./js/views/levels.js",
  "./js/views/practice.js",
  "./js/views/review.js",
  "./js/views/roadmap.js",
  "./js/views/rubric.js",
  "./js/views/settings.js",
  "./js/views/shadowing.js",
  "./js/views/vocabulary.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache-first for everything precached (the whole app is static, so freshness isn't a concern
// between deploys — CACHE_VERSION bumps handle that). Anything not precached is fetched from the
// network and stashed for next time; a failed navigation falls back to the cached shell so the
// hash router still has something to boot from while offline.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response && response.ok && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          if (request.mode === "navigate") return caches.match("./index.html");
          return undefined;
        });
    })
  );
});
