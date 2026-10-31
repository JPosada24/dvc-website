import { Component, computed, inject } from '@angular/core';
import { ClubApi } from '../../club-api';

@Component({
  selector: 'app-club',
  templateUrl: './club.html',
  styleUrl: './club.css',
})
export class Club {
  private readonly api = inject(ClubApi);

  protected readonly pillars = [
    { title: 'Técnica', text: 'Corrección individual en cada sesión, con video y métricas simples.' },
    { title: 'Físico', text: 'Trabajo de salto, velocidad y prevención de lesiones por categoría.' },
    { title: 'Equipo', text: 'Grupos reducidos, roles claros y competencia real todo el año.' },
  ];

  /** Textos del panel (Perfil del club); si están vacíos, la sección queda como siempre. */
  protected readonly historia = computed(() => this.api.datos()?.perfil?.historia ?? null);
  protected readonly proposito = computed(() => {
    const p = this.api.datos()?.perfil;
    return [
      ...(p?.mision ? [{ title: 'Misión', text: p.mision }] : []),
      ...(p?.vision ? [{ title: 'Visión', text: p.vision }] : []),
    ];
  });
}
