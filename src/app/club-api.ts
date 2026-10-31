import { DOCUMENT, Injectable, PLATFORM_ID, afterNextRender, inject, isDevMode, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Datos en vivo del club desde la plataforma Dragones (GET /api/v1/publico/club).
 *
 * El HTML prerenderizado (lo que indexa Google) no depende de esto: las secciones muestran su contenido fijo y,
 * si la plataforma responde, lo reemplazan por el actual (equipo, torneos con inscripción, galería).
 * La URL de la API sale de <meta name="dragones-api">, que llena scripts/postbuild.mjs con site.config.json.
 */

export interface Foto { id: string; ancho: number; alto: number; }
export interface Album { id: string; nombre: string; fecha: string | null; fotos: Foto[]; }
export interface Video { id: string; titulo: string; youtube_id: string; }
export interface Integrante { id: string; nombre: string; cargo: string; bio: string | null; }
export interface Torneo {
  id: string; nombre: string; rama: string; fecha_inicio: string; fecha_fin: string;
  fecha_limite_inscripcion: string; lugar: string | null; valor_inscripcion: number; cupos_libres: number;
}
export interface Cifras {
  deportistas_activos: number; femenina: number; masculina: number;
  entrenamientos_semana: number; torneos_anio: number; anios: number | null;
}
export interface DatosClub {
  cifras: Cifras | null; albumes: Album[]; videos: Video[]; equipo: Integrante[]; torneos: Torneo[];
}

export interface Inscripcion {
  nombre_club: string; ciudad: string; delegado_nombre: string; delegado_telefono: string;
  delegado_email: string | null; acepta_datos: true; sitio_web: string | null;
}

const ID_YOUTUBE = /^[A-Za-z0-9_-]{11}$/;
const API_DESARROLLO = 'http://localhost:8001';

@Injectable({ providedIn: 'root' })
export class ClubApi {
  private readonly document = inject(DOCUMENT);
  private readonly base = this.leerBase();

  /** null mientras carga o si la plataforma no está disponible: las secciones usan su contenido fijo. */
  readonly datos = signal<DatosClub | null>(null);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID)) || !this.base) return;
    // Después de hidratar, para no tocar el HTML prerenderizado antes de tiempo.
    afterNextRender(() => void this.cargar());
  }

  private leerBase(): string | null {
    const valor = this.document.querySelector('meta[name="dragones-api"]')?.getAttribute('content')?.trim() ?? '';
    if (/^https:\/\/[^/\s]+$/.test(valor) || /^http:\/\/localhost(:\d+)?$/.test(valor)) return valor;
    // Con "npm start" no corre postbuild: en desarrollo se usa la API local.
    return isDevMode() && valor.startsWith('__') ? API_DESARROLLO : null;
  }

  private async cargar(): Promise<void> {
    try {
      const r = await fetch(`${this.base}/api/v1/publico/club`, { credentials: 'omit' });
      if (!r.ok) return; // sitio aún no publicado en la plataforma, o caída: queda el contenido fijo
      const d = (await r.json()) as DatosClub;
      this.datos.set({
        cifras: d.cifras ?? null,
        albumes: (d.albumes ?? []).filter((a) => a.fotos?.length),
        videos: (d.videos ?? []).filter((v) => ID_YOUTUBE.test(v.youtube_id)),
        equipo: d.equipo ?? [],
        torneos: d.torneos ?? [],
      });
    } catch {
      // Sin conexión con la plataforma: no pasa nada, el sitio sigue con su contenido fijo.
    }
  }

  foto(f: Foto, tam: 'mini' | 'grande'): string {
    return `${this.base}/api/v1/publico/fotos/${encodeURIComponent(f.id)}?tam=${tam}`;
  }

  miniaturaVideo(v: Video): string {
    return `https://i.ytimg.com/vi/${v.youtube_id}/mqdefault.jpg`;
  }

  enlaceVideo(v: Video): string {
    return `https://www.youtube.com/watch?v=${v.youtube_id}`;
  }

  /** Inscribe un club externo a un torneo. Devuelve el mensaje para mostrar; lanza Error con el detalle si falla. */
  async inscribir(torneoId: string, datos: Inscripcion): Promise<string> {
    let r: Response;
    try {
      r = await fetch(`${this.base}/api/v1/publico/torneos/${encodeURIComponent(torneoId)}/inscripcion`, {
        method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos),
      });
    } catch {
      throw new Error('No hay conexión. Intenta de nuevo en un momento.');
    }
    const cuerpo = (await r.json().catch(() => ({}))) as { mensaje?: string; detail?: unknown };
    if (r.ok) return cuerpo.mensaje ?? 'Recibimos la inscripción.';
    const detalle = cuerpo.detail;
    if (typeof detalle === 'string') throw new Error(detalle);
    if (Array.isArray(detalle)) throw new Error('Revisa los datos del formulario.');
    throw new Error('No se pudo enviar la inscripción. Intenta de nuevo.');
  }
}

/** Iniciales para el avatar: "Ana María Ruiz" → "AR". */
export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  return ((partes[0]?.[0] ?? '') + (partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? '') : '')).toUpperCase();
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "2026-11-22" → { dia: "22", mes: "nov" } sin pasar por la zona horaria del navegador. */
export function partesFecha(iso: string): { dia: string; mes: string; texto: string } {
  const [, m = 1, d = 1] = iso.split('-').map(Number);
  const mes = MESES[m - 1] ?? '';
  return { dia: String(d), mes, texto: `${d} de ${mes}` };
}

export function pesos(valor: number): string {
  return '$' + valor.toLocaleString('es-CO');
}
