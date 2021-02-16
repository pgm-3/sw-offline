/**
 * The Service Worker
 */

const precacheList = [ "offline.html" ]
const currentCacheName = "sw-offline-v1";

/**
 * Install the offline page
 */

self.addEventListener("install", e => {
  e.waitUntil(
    caches
      .open(currentCacheName)
      .then(cache => {
        precacheList.forEach((cacheItem) => {
          return cache.add(new Request(cacheItem, { credentials: 'same-origin', redirect: 'follow' }))
        })
      })
  )
});

/**
 * The activate event handler
 */

self.addEventListener("activate", e => {
  e.waitUntil(
    caches
      .keys()
      .then(names => {
        const cachesToGetRidOf = names.map(cacheName => {
          if(cacheName !== currentCacheName) {
            return caches.delete(cacheName);
          }
        });
        Promise.all(cachesToGetRidOf);
      })
  )
});

/**
 * The Fetch event handler
 */

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match("offline.html"))
  )
});