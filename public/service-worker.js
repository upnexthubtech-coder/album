self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Simple cache-first strategy for static assets
  event.respondWith(
    caches.open('adventure-album-v1').then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});
