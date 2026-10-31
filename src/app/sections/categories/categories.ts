import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  protected readonly categories = [
    {
      level: 'Primeros pasos',
      name: 'Iniciación',
      text: 'Técnica base, primeros contactos, coordinación y juego simple. Sin límite de edad.',
    },
    {
      level: 'Juego estructurado',
      name: 'Avanzado',
      text: 'Sistemas de juego, lectura de la cancha, preparación física y torneos interclubes.',
    },
    {
      level: 'Alto rendimiento',
      name: 'Competitivo',
      text: 'Liga departamental, concentraciones y competencia real. Un menor puede ascender según su nivel.',
    },
  ];
}
