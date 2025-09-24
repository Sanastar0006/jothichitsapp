const CACHE_NAME = 'jothi-chits-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://img.freepik.com/free-vector/finance-concept-illustration_114360-2741.jpg',
  'https://img.freepik.com/free-vector/savings-concept-illustration_114360-2146.jpg',
  'https://img.freepik.com/free-vector/financial-data-concept-illustration_114360-1188.jpg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Put a copy in cache for future offline
        return caches.open(CACHE_NAME).then(cache => {
          try { cache.put(event.request, response.clone()); } catch(e) {}
          return response;
        });
      }).catch(() => {
        // fallback: show offline page or image (if you add one)
        // return caches.match('/offline.html');
      });
    })
  );
});
