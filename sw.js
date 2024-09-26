const CACHE_NAME = 'dog-blog-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/icon.png',
        'script.js',
        'sw.js',
        'styles.css',

      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // ako nema u cacheu
      return fetch(event.request).then((networkResponse) => {
        
        /*if (event.request.url.startsWith('https://localhost:8080')) {
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }*/

        return networkResponse;
      });
    })
  );
});

