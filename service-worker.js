const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/ilocano_dictionary.json',
  '/service-worker.js',
  '/manifests.json',
  '/images/favicon.ico',
  '/images/android-chrome-192x192.png',
  '/images/android-chrome-512x512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        } 

        return fetch(event.request);
      })
  );
});