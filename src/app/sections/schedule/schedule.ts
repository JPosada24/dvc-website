import { Component } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
})
export class Schedule {
  protected readonly sessions = ['Lunes', 'Miércoles', 'Sábado'].flatMap((day) => [
    { day, group: 'Iniciación', time: '6:00 p.m – 8:00 p.m.' },
    { day, group: 'Avanzado', time: '7:00 p.m – 10:00 p.m.' },
  ]);
}
