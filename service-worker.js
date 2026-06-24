const CACHE_NAME = "burger-house-v2";

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
// ACTIVATE (BORRA CACHES VIEJOS)
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
// RECIBE MENSAJES (IMPORTANTE)
// =========================
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// =========================
// FETCH (CACHE FIRST)
// =========================
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => networkResponse)
        .catch(() => {
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});