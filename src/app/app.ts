import { Component } from '@angular/core';
import { Header } from './sections/header/header';
import { Hero } from './sections/hero/hero';
import { Stats } from './sections/stats/stats';
import { Club } from './sections/club/club';
import { Categories } from './sections/categories/categories';
import { Schedule } from './sections/schedule/schedule';
import { Coaches } from './sections/coaches/coaches';
import { Events } from './sections/events/events';
import { Gallery } from './sections/gallery/gallery';
import { Faq } from './sections/faq/faq';
import { Formation } from './sections/formation/formation';
import { Cta } from './sections/cta/cta';
import { Footer } from './sections/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, Hero, Stats, Club, Categories, Formation, Schedule, Coaches, Gallery, Events, Faq, Cta, Footer],
  templateUrl: './app.html',
})
export class App {}
