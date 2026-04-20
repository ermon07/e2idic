const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/ilocano_dictionary.json',
  '/service-worker.js',
  '/manifest.json',
  '/images/favicon.ico',
  '/images/android-chrome-192x192.png',
  '/images/android-chrome-512x512.png',
];

sself.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// FETCH (cache-first strategy)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

// ACTIVATE (clean old cache)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    })
  );
});