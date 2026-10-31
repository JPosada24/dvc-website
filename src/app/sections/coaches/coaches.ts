import { Component, computed, inject } from '@angular/core';
import { ClubApi, iniciales } from '../../club-api';

@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.html',
  styleUrl: './coaches.css',
})
export class Coaches {
  protected readonly api = inject(ClubApi);
  /** Equipo publicado en la plataforma; vacío = se muestra el texto fijo. */
  protected readonly equipo = computed(() => this.api.datos()?.equipo ?? []);
  protected readonly iniciales = iniciales;
}
