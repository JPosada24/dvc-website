import { Component } from '@angular/core';

/** Escala de la línea de tiempo: de 6 p. m. a 10 p. m. */
const DESDE = 18;
const HASTA = 22;

interface Nivel {
  name: string;
  note: string;
  start: number; // hora de 24 h
  end: number;
  label: string;
  /** Posición y ancho de la barra en la línea de tiempo (en %). */
  left: number;
  width: number;
}

const barra = (start: number, end: number) => ({
  left: ((start - DESDE) / (HASTA - DESDE)) * 100,
  width: ((end - start) / (HASTA - DESDE)) * 100,
});

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
})
export class Schedule {
  /** Los dos niveles entrenan los mismos días: se muestran una sola vez. */
  protected readonly days = [
    { short: 'Lun', long: 'Lunes' },
    { short: 'Mié', long: 'Miércoles' },
    { short: 'Sáb', long: 'Sábado' },
  ];

  protected readonly levels: Nivel[] = [
    { name: 'Iniciación', note: 'Primeros pasos', start: 18, end: 20, label: '6:00 – 8:00 p. m.', ...barra(18, 20) },
    { name: 'Avanzado', note: 'Juego estructurado', start: 19, end: 22, label: '7:00 – 10:00 p. m.', ...barra(19, 22) },
  ];

  /** Marcas de la escala: 6, 7, 8, 9 y 10 p. m. */
  protected readonly hours = Array.from({ length: HASTA - DESDE + 1 }, (_, i) => ({
    label: `${DESDE + i - 12}`,
    left: (i / (HASTA - DESDE)) * 100,
  }));
}
