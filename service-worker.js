const CACHE_NAME = "burger-house-v3"; // 👈 cambia versión aquí cuando actualices

const urlsToCache = [
  "/",
  "/index.html",
  "/menu.html",
  "/pedidos.html",
  "/promos.html",
  "/logo.jpeg",
  "/1.jpeg",
  "/3.jpeg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpeg"
];

// =========================
// INSTALL
// =========================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );

  // fuerza instalación inmediata
  self.skipWaiting();
});

// =========================
// ACTIVATE (BORRA VIEJOS CACHES)
// =========================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// =========================
// FETCH (CACHE FIRST + NETWORK FALLBACK)
// =========================
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          // opcional: podrías devolver una página offline aquí
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});