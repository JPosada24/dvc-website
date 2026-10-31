// Se ejecuta después de `ng build` (ver "build" en package.json).
// 1. Pone la URL pública del sitio (canonical, Open Graph, datos estructurados, robots.txt, sitemap.xml).
// 2. Precarga las fuentes de la portada (sus nombres llevan un hash que cambia en cada build).
// 3. Calcula el hash SHA-256 de cada <script> en línea que genera Angular (hidratación, CSS crítico).
// 4. Inserta una Content-Security-Policy en index.html, que funciona en cualquier hosting.
// 5. Genera _headers (Netlify, Cloudflare Pages) y .htaccess (Apache/cPanel) con las cabeceras de seguridad,
//    que añaden lo que una etiqueta <meta> no puede (frame-ancestors, HSTS, etc.).
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = join(import.meta.dirname, '..');
const dist = join(rootDir, 'dist', 'dragones-club', 'browser');
const indexPath = join(dist, 'index.html');
let html = readFileSync(indexPath, 'utf8');

// URL pública: la variable SITE_URL manda; en Netlify se usa la URL de producción que entrega (URL);
// si no, la de site.config.json. Así, al tener dominio propio solo hay que cambiar un lugar.
const netlify = process.env.NETLIFY === 'true';
const config = JSON.parse(readFileSync(join(rootDir, 'site.config.json'), 'utf8'));
const siteUrl = (process.env.SITE_URL || (netlify && process.env.URL) || config.siteUrl).replace(/\/+$/, '');
if (!/^https:\/\/[^/]+$/.test(siteUrl)) throw new Error(`URL del sitio no válida: "${siteUrl}" (debe ser https://dominio, sin ruta)`);

// Las vistas previas de Netlify (deploy previews, ramas) no deben aparecer en Google.
const indexable = !netlify || process.env.CONTEXT === 'production';

// API de la plataforma Dragones (datos en vivo). Vacía = el sitio solo muestra su contenido fijo.
const apiUrl = (process.env.API_URL ?? config.apiUrl ?? '').trim().replace(/\/+$/, '');
if (apiUrl && !/^https:\/\/[^/]+$/.test(apiUrl)) throw new Error(`API_URL no válida: "${apiUrl}" (debe ser https://dominio, sin ruta)`);

const today = new Date().toISOString().slice(0, 10);
const fillTokens = (text) =>
  text.replaceAll('__SITE_URL__', siteUrl).replaceAll('__BUILD_DATE__', today).replaceAll('__API_URL__', apiUrl);
html = fillTokens(html);
if (!indexable) html = html.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">');
for (const file of ['robots.txt', 'sitemap.xml']) {
  const path = join(dist, file);
  let text = fillTokens(readFileSync(path, 'utf8'));
  if (!indexable && file === 'robots.txt') text = 'User-agent: *\nDisallow: /\n';
  writeFileSync(path, text);
}

// Fuentes visibles en la primera pantalla; precargarlas evita el salto de diseño (CLS) al cambiar de fuente.
const heroFonts = ['anton-latin-400-normal', 'barlow-latin-400-normal', 'barlow-latin-600-normal', 'barlow-latin-700-normal'];
const mediaFiles = readdirSync(join(dist, 'media'));
const preloads = heroFonts.map((name) => {
  const file = mediaFiles.find((f) => f.startsWith(name) && f.endsWith('.woff2'));
  if (!file) throw new Error(`No se encontró la fuente ${name} en dist/media`);
  return `<link rel="preload" href="media/${file}" as="font" type="font/woff2" crossorigin>`;
});
html = html.replace(/<link rel="preload" href="media\/[^"]+" as="font"[^>]*>\s*/g, '');
html = html.replace('<base href="/">', `<base href="/">\n    ${preloads.join('\n    ')}`);

// Solo los scripts que el navegador ejecuta; los bloques JSON (ld+json, ng-state) no necesitan hash.
const hashes = [];
for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
  if (/\bsrc=/.test(attrs) || /type="application\/(ld\+)?json"/.test(attrs) || !body.trim()) continue;
  hashes.push(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
}

const policy = {
  'default-src': ["'self'"],
  'script-src': ["'self'", ...hashes],
  // Angular inserta los estilos de cada componente en etiquetas <style>.
  'style-src': ["'self'", "'unsafe-inline'"],
  // Con API: fotos de la galería (la API) y portadas de YouTube; las peticiones van solo a la API.
  'img-src': ["'self'", 'data:', ...(apiUrl ? [apiUrl, 'https://i.ytimg.com'] : [])],
  'font-src': ["'self'"],
  'connect-src': ["'self'", ...(apiUrl ? [apiUrl] : [])],
  'manifest-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'none'"],
  'frame-src': ["'none'"],
};
const toCsp = (p) => Object.entries(p).map(([k, v]) => `${k} ${v.join(' ')}`).join('; ');
const metaCsp = `${toCsp(policy)}; upgrade-insecure-requests`;
const headerCsp = `${toCsp({ ...policy, 'frame-ancestors': ["'none'"] })}; upgrade-insecure-requests`;

html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\s*/g, '');
html = html.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n  <meta http-equiv="Content-Security-Policy" content="${metaCsp}">`);
if (!html.includes('http-equiv="Content-Security-Policy"')) throw new Error('No se pudo insertar la CSP en index.html');
writeFileSync(indexPath, html);

// La versión sin prerenderizar no se usa en un hosting estático.
const csr = join(dist, 'index.csr.html');
if (existsSync(csr)) rmSync(csr);

const security = {
  'Content-Security-Policy': headerCsp,
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

const netlifyHeaders = [
  '/*',
  ...Object.entries(security).map(([k, v]) => `  ${k}: ${v}`),
  '',
  '# Archivos con hash en el nombre: se pueden guardar en caché para siempre.',
  '/*.js',
  '  Cache-Control: public, max-age=31536000, immutable',
  '/*.css',
  '  Cache-Control: public, max-age=31536000, immutable',
  '/media/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '/img/*',
  '  Cache-Control: public, max-age=604800',
  '/index.html',
  '  Cache-Control: no-cache',
  '/',
  '  Cache-Control: no-cache',
  '',
].join('\n');
writeFileSync(join(dist, '_headers'), netlifyHeaders);

const apache = [
  '# Cabeceras de seguridad (requiere mod_headers).',
  '<IfModule mod_headers.c>',
  ...Object.entries(security).map(([k, v]) => `  Header always set ${k} "${v.replace(/"/g, '\\"')}"`),
  '  <FilesMatch "\\.(js|css|woff2?)$">',
  '    Header set Cache-Control "public, max-age=31536000, immutable"',
  '  </FilesMatch>',
  '  <FilesMatch "\\.html$">',
  '    Header set Cache-Control "no-cache"',
  '  </FilesMatch>',
  '</IfModule>',
  '',
  '# Forzar HTTPS.',
  '<IfModule mod_rewrite.c>',
  '  RewriteEngine On',
  '  RewriteCond %{HTTPS} !=on',
  '  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]',
  '</IfModule>',
  '',
  '# No listar carpetas ni exponer archivos ocultos.',
  'Options -Indexes',
  '<FilesMatch "^\\.">',
  '  Require all denied',
  '</FilesMatch>',
  '',
].join('\n');
// Netlify no usa .htaccess; solo se genera para hostings Apache.
const htaccess = join(dist, '.htaccess');
if (netlify) {
  if (existsSync(htaccess)) rmSync(htaccess);
} else {
  writeFileSync(htaccess, apache);
}

console.log(`URL del sitio: ${siteUrl}${indexable ? '' : ' (vista previa: noindex)'}`);
console.log(`CSP lista: ${hashes.length} script(s) en línea permitidos por hash.`);
console.log(apiUrl ? `Plataforma Dragones: ${apiUrl}` : 'Sin API de la plataforma: el sitio muestra solo su contenido fijo.');
