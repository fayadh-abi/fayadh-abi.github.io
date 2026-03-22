const CACHE_NAME = 'kipapp-pwa-v1';
const urlsToCache = [
  '/KPI/',
  '/KPI/index.html',
  '/KPI/manifest.json',
  '/KPI/icon.png'
];

// Install Service Worker dan simpan file ke Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Aktivasi dan hapus cache lama jika ada versi baru
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercept fetch request
self.addEventListener('fetch', event => {
  // Hanya intercept request untuk file lokal di repositori GitHub
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response; // Gunakan dari cache jika tersedia
          }
          return fetch(event.request); // Ambil dari network jika belum di-cache
        })
    );
  }
});
