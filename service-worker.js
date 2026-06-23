const CACHE_NAME = "burger-house-v1";

const urlsToCache = [
  "./",
  "index.html",
  "menu.html",
  "pedidos.html",
  "promos.html",
  "logo.jpeg",
  "1.jpeg",
  "3.jpeg",
  "4.jpeg",
  "5.jpeg",
  "6.jpeg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});