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
      a: 'No. Se organizan por nivel, Iniciación y Avanzado, y cada nivel tiene rama femenina y rama masculina.',
    },
    {
      q: '¿Un menor de edad puede entrenar en Avanzado?',
      a: 'Sí. Un menor puede pasar a Avanzado según su nivel de juego; la edad no define el nivel.',
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
