const CACHE_NAME = "mzh-cache-v2";

const PRECACHE_URLS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/themes.css",
  "css/main.css",
  "css/components.css",
  "css/animations.css",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "js/app.js",
  "js/core/audio.js",
  "js/core/gamification.js",
  "js/core/lookup.js",
  "js/core/onboarding.js",
  "js/core/pinyin.js",
  "js/core/router.js",
  "js/core/srs.js",
  "js/core/storage.js",
  "js/core/ui.js",
  "js/data/characters.js",
  "js/data/dialogues.js",
  "js/data/mistakePatterns.js",
  "js/data/roadmap.js",
  "js/data/sentences.js",
  "js/data/stories.js",
  "js/data/vocabulary.js",
  "js/views/achievements.js",
  "js/views/characters.js",
  "js/views/correction.js",
  "js/views/dailyLesson.js",
  "js/views/dashboard.js",
  "js/views/dialogues.js",
  "js/views/immersion.js",
  "js/views/mining.js",
  "js/views/review.js",
  "js/views/roadmap.js",
  "js/views/sentences.js",
  "js/views/settings.js",
  "js/views/speaking.js",
  "js/views/story.js",
  "js/views/vocabulary.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Navigations: prefer fresh HTML when online, fall back to the cached shell offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("index.html"))
    );
    return;
  }

  // Everything else: cache-first (this app has no external API calls), with
  // a background network fetch to keep the cache warm for same-origin assets.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.ok && req.url.startsWith(self.location.origin)) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match("index.html"));
    })
  );
});
