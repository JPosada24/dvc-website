import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {
  protected readonly questions = [
    {
      q: '¿Los grupos se organizan por edad?',
      a: 'No. En Dragones, las categorías se organizan por nivel: Iniciación, Avanzado y Competitivo.',
    },
    {
      q: '¿Un menor de edad puede jugar en el equipo competitivo?',
      a: 'Sí. Un menor puede formar parte del equipo competitivo según su nivel de juego; la edad no define la categoría.',
    },
    {
      q: '¿Qué días y a qué horas se entrena?',
      a: 'Entrenamos lunes, miércoles y sábado en horario nocturno. Iniciación: de 6:00 a 8:00 p.m. Avanzado: de 7:00 a 10:00 p.m.',
    },
  ];

  protected readonly openIndex = signal<number | null>(null);

  protected toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
