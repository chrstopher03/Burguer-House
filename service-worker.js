const CACHE_NAME = "burger-house-v2"; // 👈 sube versión cuando actualices

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

  // activa rápido la nueva versión
  self.skipWaiting();
});

// =========================
// ACTIVATE (LIMPIA CACHES VIEJOS)
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
// 🔥 ESTE ES EL FIX QUE TE FALTABA
// =========================
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// =========================
// FETCH (CACHE FIRST + FALLBACK)
// =========================
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});