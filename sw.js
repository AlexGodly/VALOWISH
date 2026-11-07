// VALOWISH service worker: offline support without ever pinning users to an old version.
// App files are network-first (always fresh when online, cached copy when offline);
// cosmetic images are cache-first; Supabase and other APIs are never cached here.
const VERSION = 'valowish-v29';
const APP_CACHE = VERSION + '-app', IMG_CACHE = 'valowish-images-v1', API_CACHE = 'valowish-api-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './assets/favicon-32.png', './assets/icon-192.png', './assets/valowish-mark.svg'];
const MAX_IMAGES = 600;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('valowish-') && k.endsWith('-app') && k !== APP_CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

async function networkFirst(req, cacheName, key = req) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(key, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(key, { ignoreSearch: false }) || await cache.match(key, { ignoreSearch: true });
    if (hit) return hit;
    throw err;
  }
}
async function trim(cache) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_IMAGES; i++) await cache.delete(keys[i]);
}
async function cacheFirst(req) {
  const cache = await caches.open(IMG_CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === 'opaque')) { cache.put(req, res.clone()); trim(cache); }
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (req.mode === 'navigate') { e.respondWith(networkFirst(req, APP_CACHE, './index.html')); return; }
    e.respondWith(networkFirst(req, APP_CACHE)); return;
  }
  if (url.hostname === 'media.valorant-api.com') { e.respondWith(cacheFirst(req)); return; }
  if (url.hostname === 'valorant-api.com') { e.respondWith(networkFirst(req, API_CACHE)); return; }
  if (/^(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com)$/.test(url.hostname)) { e.respondWith(networkFirst(req, APP_CACHE)); return; }
  // Everything else (Supabase auth/data, video streams) goes straight to the network.
});
