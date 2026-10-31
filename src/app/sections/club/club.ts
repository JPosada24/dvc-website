import { Component } from '@angular/core';

@Component({
  selector: 'app-club',
  templateUrl: './club.html',
  styleUrl: './club.css',
})
export class Club {
  protected readonly pillars = [
    { title: 'Técnica', text: 'Corrección individual en cada sesión, con video y métricas simples.' },
    { title: 'Físico', text: 'Trabajo de salto, velocidad y prevención de lesiones por categoría.' },
    { title: 'Equipo', text: 'Grupos reducidos, roles claros y competencia real todo el año.' },
  ];
}
