import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { Album, ClubApi, partesFecha } from '../../club-api';

/** Galería en vivo: álbumes como tarjetas; al abrir uno se ven solo sus fotos. Sin datos de la plataforma no aparece. */
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
  host: { '(document:keydown.arrowright)': 'mover(1)', '(document:keydown.arrowleft)': 'mover(-1)' },
})
export class Gallery {
  protected readonly api = inject(ClubApi);
  private readonly visor = viewChild<ElementRef<HTMLDialogElement>>('visor');
  private readonly seccion = viewChild<ElementRef<HTMLElement>>('seccion');

  protected readonly albumes = computed(() => this.api.datos()?.albumes ?? []);
  protected readonly videos = computed(() => this.api.datos()?.videos ?? []);
  /** Álbum abierto (null = se ven las tarjetas de todos). */
  protected readonly album = signal<Album | null>(null);
  /** Foto ampliada en el visor (índice dentro del álbum abierto). */
  protected readonly indice = signal<number | null>(null);
  protected readonly foto = computed(() => {
    const a = this.album();
    const i = this.indice();
    return a && i !== null ? (a.fotos[i] ?? null) : null;
  });
  protected readonly fecha = partesFecha;

  protected abrirAlbum(a: Album): void {
    this.album.set(a);
    this.alInicio();
  }

  protected volver(): void {
    this.album.set(null);
    this.alInicio();
  }

  /** Al cambiar de vista se vuelve al inicio de la sección (si no, quedaría a mitad de página). */
  private alInicio(): void {
    this.seccion()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected ampliar(i: number): void {
    this.indice.set(i);
    this.visor()?.nativeElement.showModal();
  }

  protected cerrar(): void {
    this.visor()?.nativeElement.close();
  }

  protected mover(paso: number): void {
    const a = this.album();
    const i = this.indice();
    if (!a || i === null || !this.visor()?.nativeElement.open) return;
    this.indice.set((i + paso + a.fotos.length) % a.fotos.length);
  }
}
