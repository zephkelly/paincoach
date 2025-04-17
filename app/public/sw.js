const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

// Install event - caches assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    // Don't wait for cache to complete - this prevents installation failures
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('Some resources failed to cache:', err);
          // Continue anyway
        });
      })
      .catch(error => {
        console.error('Cache error, but continuing installation:', error);
      });
    
    // This ensures installation succeeds even if caching fails
    event.waitUntil(Promise.resolve());
  });

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    try {
      event.respondWith(
        caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            return fetch(event.request);
          })
      );
    } catch (error) {
      console.error('Error in fetch handler:', error);
    }
  });

// Handle update prompts for PWA
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('error', (event) => {
    console.error('Service Worker global error:', event.message, event.filename, event.lineno);
  });