import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { Album, ClubApi } from '../../club-api';

/** Galería en vivo: solo aparece si la plataforma tiene álbumes o videos publicados. */
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
  host: { '(document:keydown.arrowright)': 'mover(1)', '(document:keydown.arrowleft)': 'mover(-1)' },
})
export class Gallery {
  protected readonly api = inject(ClubApi);
  private readonly visor = viewChild<ElementRef<HTMLDialogElement>>('visor');

  protected readonly albumes = computed(() => this.api.datos()?.albumes ?? []);
  protected readonly videos = computed(() => this.api.datos()?.videos ?? []);
  protected readonly abierto = signal<{ album: Album; indice: number } | null>(null);
  protected readonly foto = computed(() => {
    const a = this.abierto();
    return a ? (a.album.fotos[a.indice] ?? null) : null;
  });

  protected abrir(album: Album, indice: number): void {
    this.abierto.set({ album, indice });
    this.visor()?.nativeElement.showModal();
  }

  protected cerrar(): void {
    this.visor()?.nativeElement.close();
  }

  protected mover(paso: number): void {
    this.abierto.update((a) => {
      if (!a) return a;
      const total = a.album.fotos.length;
      return { ...a, indice: (a.indice + paso + total) % total };
    });
  }
}
