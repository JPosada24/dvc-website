import { Component, computed, inject } from '@angular/core';
import { ClubApi, Etapa } from '../../club-api';

/** Etapas fijas (zona 1 a 6). Se reemplazan por las del panel (Perfil del club → La formación) si existen. */
const ETAPAS: Etapa[] = [
  { titulo: 'Primer contacto', texto: 'Reglas básicas, control de pelota, primer paso.' },
  { titulo: 'Técnica individual', texto: 'Gesto del golpe, saque y recepción.' },
  { titulo: 'Juego en la red', texto: 'Colocación, ataque y bloqueo con compañero.' },
  { titulo: 'Sistema de juego', texto: 'Defensa, transición y jugadas de equipo construidas.' },
  { titulo: 'Competencia', texto: 'Torneos municipales y del departamento.' },
  { titulo: 'Jugador completo', texto: 'Valores, disciplina y pertenencia al club.' },
];

const INTRO =
  'Este es el diagrama de una rotación de voleibol y también el camino del jugador en el club: ' +
  'se entra por la zona 1 y se sale con el juego completo.';

/** Zonas como se ven en la cancha: arriba 4 · 3 · 2 (junto a la red), abajo 5 · 6 · 1. */
const ORDEN = [4, 3, 2, 5, 6, 1];

@Component({
  selector: 'app-formation',
  templateUrl: './formation.html',
  styleUrl: './formation.css',
})
export class Formation {
  private readonly api = inject(ClubApi);

  protected readonly intro = computed(() => this.api.datos()?.perfil?.formacion_intro || INTRO);
  protected readonly zonas = computed(() => {
    const propias = this.api.datos()?.perfil?.formacion;
    const etapas = propias?.length === 6 ? propias : ETAPAS;
    return ORDEN.map((n) => ({ n, ...(etapas[n - 1] ?? ETAPAS[n - 1]!) }));
  });
}
