// Offline support. Precaches the whole app on install so it runs with no
// connection at all — the point being daily practice on a phone, commute
// included. There are no external requests to worry about: all speech is
// synthesised on-device and nothing talks to a server.
//
// Bump CACHE_NAME on every deploy so returning users get the new build
// instead of being pinned to a stale cache forever.
const CACHE_NAME = "mxes-cache-v11";

const PRECACHE_URLS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "css/animations.css",
  "css/components.css",
  "css/main.css",
  "css/themes.css",
  "js/app.js",
  "js/core/audio.js",
  "js/core/backup.js",
  "js/core/distractors.js",
  "js/core/gamification.js",
  "js/core/feedback.js",
  "js/core/hearts.js",
  "js/core/onboarding.js",
  "js/core/router.js",
  "js/core/srs.js",
  "js/core/storage.js",
  "js/core/tapword.js",
  "js/core/ui.js",
  "js/data/conversationThreads.js",
  "js/data/dialogues.js",
  "js/data/glossary.js",
  "js/data/mistakePatterns.js",
  "js/data/roadmap.js",
  "js/data/sentences.js",
  "js/data/stories.js",
  "js/data/spanishIPA.js",
  "js/data/vocabulary.js",
  "js/data/vocabularyCore.js",
  "js/views/achievements.js",
  "js/views/conversation.js",
  "js/views/correction.js",
  "js/views/dashboard.js",
  "js/views/dialogues.js",
  "js/views/immersion.js",
  "js/views/learn.js",
  "js/views/levelTest.js",
  "js/views/practice.js",
  "js/views/review.js",
  "js/views/roadmap.js",
  "js/views/roleplay.js",
  "js/views/saveProgress.js",
  "js/views/sentences.js",
  "js/views/settings.js",
  "js/views/speakingTest.js",
  "js/views/story.js",
  "js/views/vocabulary.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      // addAll is all-or-nothing; one 404 would silently break offline mode,
      // so cache individually and let the rest succeed.
      .then((cache) => Promise.allSettled(PRECACHE_URLS.map((u) => cache.add(u))))
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
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  // Navigations: prefer fresh HTML when online so updates land, fall back to
  // the cached shell when offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.open(CACHE_NAME).then((cache) => cache.match("index.html")))
    );
    return;
  }

  // Assets: serve from cache immediately, then refresh the copy in the
  // background so the next load has the newer file.
  //
  // Every read goes through caches.open(CACHE_NAME) rather than the global
  // caches.match(), which searches *every* cache on the origin and can hand
  // back a file from an older, not-yet-deleted version — bumping CACHE_NAME
  // wouldn't help.
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});
