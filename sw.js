// Simulador KTI - service worker. Subí VERSION en cada actualización.
const VERSION = 'kti-sim-v15';
const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png',
  './comp_entrada.jpg',
  './crom_ent.jpg',
  './crom_pm.jpg',
  './debutanizador.jpg',
  './deetanizador.jpg',
  './depropanizador.jpg',
  './distrib_hotoil.jpg',
  './entrada_salida_planta.jpg',
  './expansor.jpg',
  './filtros_entrada.jpg',
  './gas_comb_instr.jpg',
  './gas_regen.jpg',
  './horno_a.jpg',
  './horno_b.jpg',
  './intercambiadores.jpg',
  './medicion_almacen.jpg',
  './recompresores.jpg',
  './recontactor.jpg',
  './reflujo_deet.jpg',
  './sep_entrada.jpg',
  './sep_salida_comp.jpg',
  './torres_desh.jpg',
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
