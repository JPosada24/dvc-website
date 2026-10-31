import { Component } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  protected readonly stats = [
    { value: '+120', label: 'Deportistas activos' },
    { value: '8', label: 'Años formando' },
    { value: '3', label: 'Categorías' },
    { value: '12', label: 'Torneos al año' },
  ];
}
