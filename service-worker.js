const CACHE_NAME = "jothichits-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/index.html.html",
  "/collection_report.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];
// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    )
  );
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});


