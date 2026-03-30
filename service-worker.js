self.addEventListener('fetch', function(event) {
  // Basic worker to satisfy PWA requirements
  event.respondWith(caches.match(event.request).then(function(response) {
    return response || fetch(event.request);
  }));
});
