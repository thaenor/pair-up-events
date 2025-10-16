// Service Worker for Pair Up Events PWA
const CACHE_NAME = 'pair-up-events-v1';
const STATIC_CACHE_NAME = 'pair-up-events-static-v1';
const DYNAMIC_CACHE_NAME = 'pair-up-events-dynamic-v1';

// Check if we're in development mode
const isDevelopment = self.location.hostname === 'localhost' || 
                     self.location.hostname === '127.0.0.1' ||
                     self.location.hostname.includes('::1') ||
                     self.location.port === '8080';

// In development, skip most service worker functionality
if (isDevelopment) {
  console.log('Service Worker: Development mode - minimal functionality');
}

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/PUE_logo.png',
  '/PUE_logo_transparent.png',
  '/manifest.json',
  '/favicon.ico'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip HMR and development requests
  if (url.pathname.includes('/@vite/') || 
      url.pathname.includes('/@fs/') ||
      url.pathname.includes('/node_modules/') ||
      url.searchParams.has('t') || // Vite cache busting
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1' ||
      url.hostname.includes('::1')) {
    return; // Let the browser handle these requests directly
  }

  // Skip Firebase authentication and API requests
  if (url.hostname.includes('firebase') || 
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com') ||
      url.pathname.includes('/auth/') ||
      url.pathname.includes('/v1/') ||
      url.searchParams.has('key')) {
    return; // Let Firebase handle these requests directly
  }

  // Skip Google Analytics and tracking requests
  if (url.hostname.includes('google-analytics.com') ||
      url.hostname.includes('googletagmanager.com') ||
      url.hostname.includes('analytics.google.com') ||
      url.pathname.includes('/g/collect') ||
      url.pathname.includes('/gtm.js') ||
      url.pathname.includes('/gtag/')) {
    return; // Let Google Analytics handle these requests directly
  }

  // Skip Sentry error reporting requests
  if (url.hostname.includes('sentry.io') ||
      url.hostname.includes('ingest.sentry.io') ||
      url.pathname.includes('/api/') ||
      url.pathname.includes('/store/') ||
      url.pathname.includes('/envelope/')) {
    return; // Let Sentry handle these requests directly
  }

  // In development, use network-first strategy for better HMR
  if (isDevelopment) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Only cache static assets in development with proper validation
          if (networkResponse && 
              networkResponse.ok && 
              networkResponse.status === 200 &&
              networkResponse.type === 'basic' &&
              (url.pathname.endsWith('.png') || 
               url.pathname.endsWith('.jpg') || 
               url.pathname.endsWith('.ico') ||
               url.pathname.endsWith('.svg'))) {
            const responseToCache = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME)
              .then((cache) => {
                // Additional validation before caching
                if (responseToCache && responseToCache.status === 200) {
                  return cache.put(request, responseToCache);
                }
              })
              .catch((error) => {
                console.log('Service Worker: Failed to cache in development', error);
              }); // Log cache errors in dev for debugging
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback to cache only for static assets
          return caches.match(request);
        })
    );
  } else {
    // Production: use cache-first strategy
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          // Return cached version if available
          if (cachedResponse) {
            return cachedResponse;
          }

          // Otherwise fetch from network
          return fetch(request)
            .then((networkResponse) => {
              // Don't cache if not a valid response
              if (!networkResponse || 
                  networkResponse.status !== 200 || 
                  networkResponse.type !== 'basic' ||
                  !networkResponse.ok) {
                return networkResponse;
              }

              // Clone the response
              const responseToCache = networkResponse.clone();

              // Only cache if the cloned response is also valid
              if (responseToCache && responseToCache.status === 200) {
                // Cache dynamic content with proper error handling
                caches.open(DYNAMIC_CACHE_NAME)
                  .then((cache) => {
                    return cache.put(request, responseToCache);
                  })
                  .catch((error) => {
                    console.log('Service Worker: Failed to cache response', error);
                  });
              }

              return networkResponse;
            })
            .catch((error) => {
              console.log('Service Worker: Network request failed', error);
              // If network fails and it's a navigation request, return offline page
              if (request.mode === 'navigate') {
                return caches.match('/index.html').then((offlinePage) => {
                  return offlinePage || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
                });
              }
              // For non-navigation requests, return a proper error response
              return new Response('Network error', { status: 503, statusText: 'Service Unavailable' });
            });
        })
        .catch((error) => {
          console.error('Service Worker: Unexpected error in fetch handler', error);
          return new Response('Service Worker Error', { status: 500, statusText: 'Internal Server Error' });
        })
    );
  }
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  let notificationData = {
    title: 'Pair Up Events',
    body: 'You have a new notification!',
    icon: '/PUE_logo.png',
    badge: '/PUE_logo.png',
    tag: 'pair-up-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/PUE_logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/PUE_logo.png'
      }
    ]
  };

  // Parse push data if available
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.error('Service Worker: Error parsing push data', error);
      notificationData.body = event.data.text() || notificationData.body;
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Default action or 'open' action
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any pending offline actions here
      Promise.resolve()
    );
  }
});

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
