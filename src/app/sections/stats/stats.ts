import { Component, computed, inject } from '@angular/core';
import { ClubApi } from '../../club-api';

interface Cifra {
  value: string;
  label: string;
}

/** Datos ciertos aunque la plataforma no responda (se muestran en el HTML prerenderizado). */
const FIJAS: Cifra[] = [
  { value: '2', label: 'Niveles' },
  { value: '2', label: 'Ramas' },
  { value: '3', label: 'Entrenamientos por semana' },
  { value: 'Gratis', label: 'Clase de prueba' },
];

@Component({
  selector: 'app-stats',
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  private readonly api = inject(ClubApi);

  /** Con datos de la plataforma: deportistas, años, entrenamientos y torneos reales; completa con las fijas. */
  protected readonly stats = computed<Cifra[]>(() => {
    const c = this.api.datos()?.cifras;
    if (!c) return FIJAS;
    const reales: Cifra[] = [];
    if (c.deportistas_activos > 0) reales.push({ value: String(c.deportistas_activos), label: 'Deportistas activos' });
    if (c.anios) reales.push({ value: String(c.anios), label: c.anios === 1 ? 'Año formando' : 'Años formando' });
    if (c.entrenamientos_semana > 0) {
      reales.push({ value: String(c.entrenamientos_semana), label: 'Entrenamientos por semana' });
    }
    if (c.torneos_anio > 0) reales.push({ value: String(c.torneos_anio), label: 'Torneos organizados este año' });
    const usadas = new Set(reales.map((r) => r.label));
    return [...reales, ...FIJAS.filter((f) => !usadas.has(f.label))].slice(0, 4);
  });
}
