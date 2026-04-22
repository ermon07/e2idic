const CACHE_NAME = "dictionary-app-v1.2"; // 🔥 change version when you update
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
  '/images/ek-smile.png',
  '/images/ek-book.png',
  '/images/ek-korean-heart.png'
];

// Install
self.addEventListener("install", (event) => {
  self.skipWaiting(); // 🔥 forces new SW to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // 🔥 delete old caches
          }
        })
      )
    )
  );
  self.clients.claim(); // 🔥 take control immediately
});

// Fetch (important fix)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});