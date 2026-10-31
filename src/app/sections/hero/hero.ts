import { Component, computed, inject, signal } from '@angular/core';
import { ClubApi } from '../../club-api';

interface Diapositiva { src: string; titulo: string; }

/** Máximo de fotos de la plataforma en el carrusel (además de la foto fija del equipo). */
const MAX_DIAPOSITIVAS = 6;

/**
 * Portada. La foto del equipo es la primera (va en el HTML prerenderizado); cuando llegan los datos del club se
 * suman las portadas de los álbumes publicados (y, si hay pocos, otras fotos horizontales) y pasan como carrusel.
 * Avanza al terminar la barra de progreso (animación CSS), así pausar = pausar la animación.
 */
@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  private readonly api = inject(ClubApi);

  protected readonly extra = computed<Diapositiva[]>(() => {
    const albumes = this.api.datos()?.albumes ?? [];
    const lista: Diapositiva[] = albumes.slice(0, MAX_DIAPOSITIVAS).map((a) => ({
      src: this.api.portadaGrande(a), titulo: a.nombre,
    }));
    // Pocos álbumes: se completa hasta 4 con fotos horizontales, alternando entre álbumes.
    const largo = Math.max(0, ...albumes.map((a) => a.fotos.length));
    for (let n = 1; n < largo && lista.length < 4; n++) {
      for (const a of albumes) {
        const f = a.fotos[n];
        if (f && f.ancho >= f.alto && lista.length < 4) lista.push({ src: this.api.foto(f, 'grande'), titulo: a.nombre });
      }
    }
    return lista;
  });
  /** Total contando la foto fija del equipo (índice 0). */
  protected readonly total = computed(() => 1 + this.extra().length);
  protected readonly indices = computed(() => Array.from({ length: this.total() }, (_, i) => i));
  protected readonly actual = signal(0);
  protected readonly titulo = computed(() =>
    this.actual() === 0 ? 'Club Deportivo Dragones' : (this.extra()[this.actual() - 1]?.titulo ?? ''),
  );
  protected readonly pausado = signal(false);
  private readonly encima = signal(false);
  protected readonly detenido = computed(() => this.pausado() || this.encima());

  /** Solo se piden la imagen actual y sus vecinas (las demás no se descargan aún). */
  protected cargada(i: number): boolean {
    const t = this.total();
    const a = this.actual();
    return i === a || i === (a + 1) % t || i === (a - 1 + t) % t;
  }

  protected ir(i: number): void {
    this.actual.set((i + this.total()) % this.total());
  }

  protected siguiente(): void {
    this.ir(this.actual() + 1);
  }

  protected encimaDe(si: boolean): void {
    this.encima.set(si);
  }

  protected alternarPausa(): void {
    this.pausado.update((p) => !p);
  }

  protected num(i: number): string {
    return String(i + 1).padStart(2, '0');
  }
}
