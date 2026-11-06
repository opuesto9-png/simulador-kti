// Simulador KTI - service worker. Subí VERSION en cada actualización.
const VERSION = 'kti-sim-v2';
const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png',
  './img/comp_entrada.jpg',
  './img/crom_ent.jpg',
  './img/crom_pm.jpg',
  './img/debutanizador.jpg',
  './img/deetanizador.jpg',
  './img/depropanizador.jpg',
  './img/distrib_hotoil.jpg',
  './img/entrada_salida_planta.jpg',
  './img/expansor.jpg',
  './img/filtros_entrada.jpg',
  './img/gas_comb_instr.jpg',
  './img/gas_regen.jpg',
  './img/horno_a.jpg',
  './img/horno_b.jpg',
  './img/intercambiadores.jpg',
  './img/medicion_almacen.jpg',
  './img/recompresores.jpg',
  './img/recontactor.jpg',
  './img/reflujo_deet.jpg',
  './img/sep_entrada.jpg',
  './img/sep_salida_comp.jpg',
  './img/torres_desh.jpg',
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k)).filter(Boolean))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Clima en vivo: siempre a la red (el simulador ya tiene valor de respaldo)
  if (url.hostname.includes('open-meteo')) return;
  // Fuentes de Google: se guardan la primera vez para usarlas sin internet
  if (url.hostname.includes('fonts.g')) {
    e.respondWith(caches.open(VERSION + '-fonts').then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      try { const r = await fetch(req); c.put(req, r.clone()); return r; } catch (_) { return Response.error(); }
    }));
    return;
  }
  // Resto: primero lo guardado, si no, red
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
});
