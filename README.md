# Club Deportivo Dragones

Landing page del club, hecha en Angular 22 y prerenderizada como sitio estático.

## Desarrollo

```bash
npm install
npm start          # http://localhost:4200
```

## Compilar para producción

```bash
npm run build
```

Genera `dist/dragones-club/browser/`, la carpeta que se publica. El comando:

1. Prerenderiza la página: el HTML ya trae todo el contenido, así Google lo indexa sin ejecutar JavaScript.
2. Ejecuta [scripts/postbuild.mjs](scripts/postbuild.mjs), que precarga las fuentes, inserta la
   Content-Security-Policy con los hashes de los scripts de Angular y genera `_headers` y `.htaccess`
   con las cabeceras de seguridad.

## URL del sitio

La URL pública se define en un solo lugar: [site.config.json](site.config.json). Al compilar, `postbuild.mjs`
la pone en la URL canónica, Open Graph, datos estructurados, `robots.txt` y `sitemap.xml` (con la fecha del build).

Orden de prioridad: variable `SITE_URL` → URL de producción que entrega Netlify → `site.config.json`.
Cuando tengas dominio propio, cambia `siteUrl` (o configúralo en Netlify) y vuelve a publicar.

## Publicar en Netlify

**Opción A, recomendada: conectar el repositorio (GitHub, GitLab o Bitbucket).**
1. Sube el proyecto a un repositorio.
2. En Netlify: *Add new site → Import an existing project* y elige el repositorio.
   [netlify.toml](netlify.toml) ya define el comando (`npm run build`), la carpeta (`dist/dragones-club/browser`) y Node 24.
3. En *Site configuration → Change site name* elige el nombre, por ejemplo `club-deportivo-dragones`.
4. Cada cambio que subas se publica solo. Netlify entrega la URL de producción y las vistas previas salen con `noindex`.

**Opción B: arrastrar y soltar (sin repositorio).**
1. Pon en `site.config.json` la URL exacta que tendrá el sitio, por ejemplo `https://club-deportivo-dragones.netlify.app`.
2. Ejecuta `npm run build`.
3. Arrastra la carpeta `dist/dragones-club/browser` a [app.netlify.com/drop](https://app.netlify.com/drop).
4. Cambia el nombre del sitio en Netlify para que coincida con el que pusiste en el paso 1.

## Otros hostings

Sube el contenido de `dist/dragones-club/browser/` (incluidos `_headers` y `.htaccess`) a un hosting estático con HTTPS:

| Hosting | Cabeceras de seguridad |
| --- | --- |
| Netlify, Cloudflare Pages | Se aplican solas desde `_headers`. |
| Apache / cPanel | Se aplican solas desde `.htaccess` (requiere `mod_headers`). |
| Vercel, Firebase, otros | Copia las cabeceras de `_headers` a su archivo de configuración. |

La CSP también va dentro de `index.html`, así que la protección principal contra scripts inyectados funciona en cualquier hosting.

Después de publicar:

1. Registra el dominio en [Google Search Console](https://search.google.com/search-console) y envía `sitemap.xml`.
2. Revisa las cabeceras en [securityheaders.com](https://securityheaders.com) y los datos estructurados en
   [la prueba de resultados enriquecidos](https://search.google.com/test/rich-results).

## Imágenes

- `public/img/equipo-{600,800,1280,1920}.{webp,jpg}`: foto principal (el equipo), mejorada con IA (Real-ESRGAN). El original está en `design-src/hero-equipo.png` y la versión mejorada de 2560 px en `design-src/hero-equipo-hd.jpg`.
- `public/img/logo-{96,192}.png`: logo optimizado. El original en alta resolución está en `design-src/` y no se publica.
- `public/img/og-image.jpg`: vista previa de 1200×630 para redes sociales, con el escudo del club.
- `public/icons/`: favicon e íconos de app.
