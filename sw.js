/* Service worker Tempo Lille — V'Lille
   - precache du shell (chargement instantané / hors-ligne)
   - HTML : réseau d'abord, repli cache
   - assets statiques (CSS/JS/polices/Leaflet) : cache d'abord + mise à jour en arrière-plan
   - données temps réel (GBFS Ilévia, géocodage IGN) et tuiles de carte : toujours réseau (jamais cachées) */
const CACHE = 'tempo-vlille-v1';
const SHELL = [
  './',
  './index.html',
  './assets/tempo-ux.css',
  './assets/tempo-common.js',
  './assets/icon.svg',
  './assets/icon-180.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  // Precache tolérant : un échec sur une entrée ne fait pas échouer toute l'installation.
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.allSettled(SHELL.map((u) => cache.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Temps réel + tuiles : on laisse passer au réseau, sans cache (évite d'afficher des données périmées et de gonfler le cache).
  if (url.hostname.includes('ilevia.fr') || url.hostname.includes('geopf.fr') || url.hostname.includes('tile.openstreetmap.org')) {
    return;
  }

  // Navigation (HTML) : réseau d'abord, repli sur le cache hors-ligne.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // Assets de l'app (même origine, non versionnés) : réseau d'abord pour rester frais après un déploiement, repli cache hors-ligne.
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Tiers immuables (Leaflet, polices Google, URLs versionnées) : cache d'abord, mise à jour en arrière-plan.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
