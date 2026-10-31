import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { ClubApi, Torneo, partesFecha, pesos } from '../../club-api';

const RAMAS: Record<string, string> = { femenina: 'Rama femenina', masculina: 'Rama masculina', mixta: 'Mixto' };

@Component({
  selector: 'app-events',
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events {
  private readonly api = inject(ClubApi);
  private readonly dialogo = viewChild<ElementRef<HTMLDialogElement>>('dialogo');

  /** Torneos con inscripciones abiertas en la plataforma; vacío = se muestra el texto fijo. */
  protected readonly torneos = computed(() => this.api.datos()?.torneos ?? []);
  protected readonly elegido = signal<Torneo | null>(null);
  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly listo = signal<string | null>(null);

  protected readonly ramas = RAMAS;
  protected readonly fecha = partesFecha;
  protected readonly pesos = pesos;

  protected abrir(t: Torneo): void {
    this.elegido.set(t);
    this.error.set(null);
    this.listo.set(null);
    this.dialogo()?.nativeElement.showModal();
  }

  protected cerrar(): void {
    this.dialogo()?.nativeElement.close();
  }

  protected async enviar(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    const t = this.elegido();
    const form = e.target as HTMLFormElement;
    if (!t || this.enviando() || !form.reportValidity()) return;
    const v = (nombre: string) => ((form.elements.namedItem(nombre) as HTMLInputElement | null)?.value ?? '').trim();
    this.enviando.set(true);
    this.error.set(null);
    try {
      const mensaje = await this.api.inscribir(t.id, {
        nombre_club: v('nombre_club'),
        ciudad: v('ciudad'),
        delegado_nombre: v('delegado_nombre'),
        delegado_telefono: v('delegado_telefono').replace(/[\s-]/g, ''),
        delegado_email: v('delegado_email') || null,
        acepta_datos: true,
        sitio_web: v('sitio_web') || null,
      });
      this.listo.set(mensaje);
      form.reset();
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'No se pudo enviar la inscripción.');
    } finally {
      this.enviando.set(false);
    }
  }
}
