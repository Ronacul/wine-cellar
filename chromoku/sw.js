// The game already runs offline once loaded — everything is in one file and
// there is no backend. This worker is what makes that survive a cold start,
// which on iOS is also what stops the home-screen app from being evicted after
// a week of not playing.
//
// Bump CACHE on every deploy; the old one is deleted on activate.
const CACHE = "chromoku-v8";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // Cache-first: the page is static, and being instantly playable underground
  // matters more than picking up a deploy a few seconds sooner. A new CACHE
  // version on the next visit refreshes everything.
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res && res.status === 200 && res.type === "basic"){
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
