// Happy Subarashi CRM — minimal service worker
// Provides installability + basic offline app-shell fallback.
// Intentionally simple: this CRM is data-live, so we do not cache
// API/data responses — only the static app shell.

const CACHE_NAME = "happy-subarashi-shell-v1";
const APP_SHELL = ["/dashboard", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Never intercept Supabase API calls or non-GET requests.
  if (request.method !== "GET" || request.url.includes("supabase.co")) {
    return;
  }

  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((res) => res || caches.match("/dashboard")))
  );
});
