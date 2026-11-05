# Club Deportivo Dragones · Sitio web

Sitio oficial del **Club Deportivo Dragones**, escuela y equipos de voleibol: [dragonesvolleyclub.com](https://dragonesvolleyclub.com).

Es una página única (landing) que presenta el club, sus categorías, horarios y entrenadores, y lleva a los interesados a
agendar una clase de prueba por WhatsApp. Funciona como sitio estático y, cuando la plataforma del club responde,
completa sus secciones con datos en vivo: equipo técnico, galería, cifras y torneos con inscripción en línea.

## Qué tiene el sitio

| Sección | Contenido | Datos en vivo de la plataforma |
| --- | --- | --- |
| Portada | Mensaje principal, botones de acción y foto del equipo | Carrusel con fotos de los álbumes |
| Cifras | Niveles, ramas, entrenamientos por semana y clase de prueba gratis | Deportistas activos, años, entrenamientos y torneos del año |
| El club | Pilares: técnica, físico y equipo | Misión, visión e historia |
| Categorías | Dos niveles (Iniciación y Avanzado) y dos ramas | — |
| Formación | Etapas de formación por zonas de la cancha (1 a 6) | Etapas definidas en el panel |
| Horarios | Días y horas de entrenamiento en línea de tiempo | Sede |
| Entrenadores | Equipo técnico | Integrantes con foto, cargo y biografía |
| Galería | Álbumes de fotos y videos (solo aparece si hay contenido) | Álbumes y videos de YouTube |
| Eventos / Torneos | Agenda del club | Torneos abiertos con formulario de inscripción para otros clubes |
| Preguntas frecuentes | Acordeón con las dudas más comunes | — |
| Inscripción | Botón para escribir al club por WhatsApp | Número de WhatsApp |
| Pie de página | Logo y derechos | Correo, Instagram y Facebook |

Además incluye [politica-de-datos.html](public/politica-de-datos.html), la política de tratamiento de datos personales
(Ley 1581 de 2012) que se acepta al inscribir un club en un torneo.

**Características:**

- **Responsivo:** diseñado para celular, tablet y escritorio. Debajo de 1180 px se usa un menú desplegable.
- **El menú sigue el scroll:** marca la sección que se está viendo.
- **Listo para Google:** la página se prerenderiza, así el HTML ya trae todo el contenido. Incluye título y
  descripción, URL canónica, datos estructurados (`SportsOrganization`), `sitemap.xml`, `robots.txt` y una
  vista previa para redes sociales.
- **Seguro:** es un sitio estático, sin servidor propio. Tiene una Content-Security-Policy estricta (scripts permitidos
  solo por hash) y cabeceras de seguridad. Las fuentes van incluidas en el sitio, sin cargar recursos de terceros.
- **Rápido:** imágenes en WebP con varios tamaños, fuentes precargadas y caché larga para los archivos con hash.
- **Accesible:** enlace para saltar al contenido, navegación por teclado, textos alternativos y respeto por la
  preferencia de menos movimiento.

## Tecnología

- [Angular 22](https://angular.dev) con componentes standalone y signals, prerenderizado como sitio estático (`outputMode: "static"`).
- Fuentes Anton y Barlow alojadas en el propio sitio con [Fontsource](https://fontsource.org).
- Sin dependencias de interfaz ni de estilos externas: CSS propio por componente.
- Publicado en [Netlify](https://www.netlify.com).

## Estructura

```text
src/
  index.html                 SEO, Open Graph, datos estructurados (con marcas __SITE_URL__ y __API_URL__)
  styles.css                 Colores, tipografía y estilos compartidos
  app/
    app.html                 Orden de las secciones
    club-api.ts              Datos en vivo de la plataforma (lectura e inscripción a torneos)
    contact.ts               Número y mensaje de WhatsApp por defecto
    sections/                Un componente por sección (header, hero, stats, club, categories,
                             formation, schedule, coaches, gallery, events, faq, cta, footer)
public/
  img/                       Foto del equipo en varios tamaños, logos e imagen para compartir
  icons/                     Favicon e íconos de app
  fonts/                     Fuentes de la página de política de datos
  politica-de-datos.html     Política de tratamiento de datos personales
  robots.txt, sitemap.xml    Con marcas que se llenan al compilar
scripts/postbuild.mjs        Completa URLs, CSP y cabeceras después del build
site.config.json             URL del sitio y de la API
netlify.toml                 Configuración de Netlify
design-src/                  Originales en alta resolución (no se publican)
```

## Desarrollo

Requisitos: Node.js 24.15+ (o 22.22.3+) y npm.

```bash
npm install
npm start          # http://localhost:4200
```

Con `npm start` el sitio usa la API local de la plataforma (`http://localhost:8001`). Si no está corriendo, cada
sección muestra su contenido fijo.

## Compilar

```bash
npm run build
```

Genera `dist/dragones-club/browser/`, la carpeta que se publica. El comando:

1. Prerenderiza la página con todo su contenido.
2. Ejecuta [scripts/postbuild.mjs](scripts/postbuild.mjs), que:
   - Pone la URL del sitio y la de la API en el HTML, `robots.txt` y `sitemap.xml` (con la fecha del build).
   - Precarga las fuentes de la portada.
   - Inserta la Content-Security-Policy con los hashes de los scripts de Angular, y solo permite conexiones hacia la API.
   - Genera `_headers` (Netlify, Cloudflare Pages) y `.htaccess` (Apache) con las cabeceras de seguridad.

Para revisar el resultado en local: `npm run serve:dist` (http://localhost:8080).

## Configuración

[site.config.json](site.config.json):

```json
{
  "siteUrl": "https://dragonesvolleyclub.com",
  "apiUrl": "https://panel.dragonesvolleyclub.com"
}
```

- **`siteUrl`:** dominio público, con `https://` y sin ruta. Se usa para la URL canónica, Open Graph, datos
  estructurados, `robots.txt` y `sitemap.xml`. Prioridad: variable `SITE_URL` → URL de producción que entrega
  Netlify → `site.config.json`.
- **`apiUrl`:** API de la plataforma Dragones, con `https://` y sin ruta. Se puede reemplazar con la variable `API_URL`.
  Si queda vacía, el sitio muestra solo su contenido fijo.
- **WhatsApp:** se usa el número del panel (Perfil del club). Si no está, se usa el de [src/app/contact.ts](src/app/contact.ts).

### Datos en vivo desde la plataforma Dragones

El sitio muestra lo que el club publica en la plataforma (panel → «Perfil del club» y «Torneos»): equipo técnico,
galería de fotos y videos, cifras y torneos con inscripciones abiertas. Incluye el formulario para que otros
clubes se inscriban solos.

- El HTML prerenderizado (lo que indexa Google) no depende de la plataforma: los datos se cargan después en el
  navegador. Si la plataforma no responde, cada sección queda con su texto fijo.
- En la plataforma, el dominio del sitio debe estar en `SITIO_ORIGENES` (`.env`). El sitio solo puede leer
  `/api/v1/publico` y lo hace sin credenciales.

## Publicar en Netlify

1. Sube el repositorio a GitHub (o GitLab/Bitbucket).
2. En Netlify: **Add new site → Import an existing project** y elige el repositorio. No hay que configurar nada más:
   [netlify.toml](netlify.toml) define el comando (`npm run build`), la carpeta (`dist/dragones-club/browser`) y Node 24.
3. En **Domain management → Add a domain**, agrega `dragonesvolleyclub.com`, márcalo como dominio principal
   y sigue las instrucciones de DNS que da Netlify. El certificado HTTPS se emite solo.
4. Cada cambio que subas a la rama principal se publica solo. Las vistas previas (ramas y pull requests) salen con
   `noindex` para que Google no las indexe.

Las cabeceras de seguridad se aplican solas desde `_headers`. Para otro hosting, sube `dist/dragones-club/browser/`:
Apache usa `.htaccess`, y en otros servicios hay que copiar las cabeceras de `_headers` a su configuración.

**Después de publicar:**

1. Registra el dominio en [Google Search Console](https://search.google.com/search-console) y envía `sitemap.xml`.
2. Revisa las cabeceras en [securityheaders.com](https://securityheaders.com) y los datos estructurados en la
   [prueba de resultados enriquecidos](https://search.google.com/test/rich-results).
3. Para refrescar la vista previa al compartir en WhatsApp o Facebook, usa el
   [depurador de Facebook](https://developers.facebook.com/tools/debug/) → **Scrape Again**.
4. Activa la verificación en dos pasos en GitHub, Netlify y el registrador del dominio.

## Imágenes

- `public/img/equipo-{600,800,1280,1920}.{webp,jpg}`: foto principal del equipo, mejorada con IA (Real-ESRGAN).
  El original está en `design-src/hero-equipo.png` y la versión de 2560 px en `design-src/hero-equipo-hd.jpg`.
- `public/img/logo-{96,192}.png`: logo optimizado. El original en alta resolución está en `design-src/logo-hd.png`.
- `public/img/og-image.jpg`: vista previa de 1200×630 para redes sociales, con el escudo del club.
- `public/icons/`: favicon e íconos de app.
