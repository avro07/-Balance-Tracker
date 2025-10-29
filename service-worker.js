const CACHE_NAME = 'bdt-usd-tracker-cache-v1';
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/index.tsx',
  '/vite.svg',
];

// On install, cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(APP_SHELL_URLS);
      })
      .catch(err => {
          console.error("Failed to cache app shell:", err);
      })
  );
});

// On activate, clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// On fetch, use stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // If the request is successful, update the cache.
          // Check for basic or opaque responses to cache.
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(err => {
            // This is to handle cases where the network is down.
            console.warn('Fetch failed; returning cached response if available.', event.request.url, err);
            // If fetch fails and there's no cached response, it will result in an error,
            // which is the correct behavior.
        });

        // Return the cached response immediately if available, and update the cache in the background.
        return cachedResponse || fetchPromise;
      });
    })
  );
});
