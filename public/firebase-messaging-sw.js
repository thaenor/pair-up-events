// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/12.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // This will be replaced at build time
  authDomain: "YOUR_AUTH_DOMAIN", // This will be replaced at build time
  projectId: "YOUR_PROJECT_ID", // This will be replaced at build time
  appId: "YOUR_APP_ID", // This will be replaced at build time
  storageBucket: "YOUR_STORAGE_BUCKET", // This will be replaced at build time
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // This will be replaced at build time
};

firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Firebase Messaging: Background message received', payload);

  const notificationTitle = payload.notification?.title || 'Pair Up Events';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification!',
    icon: '/PUE_logo.png',
    badge: '/PUE_logo.png',
    tag: 'pair-up-notification',
    requireInteraction: false,
    data: payload.data,
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

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Firebase Messaging: Notification clicked', event);
  
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
