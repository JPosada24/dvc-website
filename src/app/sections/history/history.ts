import { Component, DOCUMENT, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { ClubApi, TorneoRealizado, partesFecha } from '../../club-api';

/** «Torneos realizados»: los torneos que ya organizó el club, con su anuncio. Sin datos de la plataforma no aparece. */
@Component({
  selector: 'app-history',
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class Historial {
  protected readonly api = inject(ClubApi);
  private readonly doc = inject(DOCUMENT);
  private readonly visor = viewChild<ElementRef<HTMLDialogElement>>('visor');

  protected readonly torneos = computed(() => this.api.datos()?.torneosRealizados ?? []);
  /** Ids de los álbumes que se ven en la galería: «Ver fotos» solo si el álbum está ahí. */
  private readonly albumes = computed(() => new Set((this.api.datos()?.albumes ?? []).map((a) => a.id)));
  /** Anuncio ampliado en el visor. */
  protected readonly ampliado = signal<TorneoRealizado | null>(null);

  protected fecha(iso: string): string {
    return `${partesFecha(iso).texto} de ${iso.slice(0, 4)}`;
  }

  protected tieneFotos(t: TorneoRealizado): boolean {
    return !!t.album_id && this.albumes().has(t.album_id);
  }

  protected verFotos(t: TorneoRealizado): void {
    if (!t.album_id) return;
    this.api.albumPedido.set(t.album_id);
    this.doc.getElementById('galeria')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected ampliar(t: TorneoRealizado): void {
    this.ampliado.set(t);
    this.visor()?.nativeElement.showModal();
    this.doc.documentElement.style.overflow = 'hidden'; // la página de fondo no se desplaza
  }

  protected cerrar(): void {
    this.visor()?.nativeElement.close();
  }

  /** Al cerrarse (botón, Esc o clic fuera). */
  protected alCerrar(): void {
    this.ampliado.set(null);
    this.doc.documentElement.style.overflow = '';
  }

  /** Clic en el fondo (no en el anuncio): cierra. */
  protected clicFondo(e: MouseEvent): void {
    if (e.target === e.currentTarget) this.cerrar();
  }
}
