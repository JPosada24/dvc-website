import { Component, DestroyRef, DOCUMENT, afterNextRender, effect, inject, signal } from '@angular/core';

/** Ancho a partir del cual se muestra el menú de escritorio (debe coincidir con header.css). */
const DESKTOP_QUERY = '(min-width: 1180px)';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: {
    '[class.menu-open]': 'menuOpen()',
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class Header {
  protected readonly links = [
    { id: 'club', label: 'El club' },
    { id: 'categorias', label: 'Categorías' },
    { id: 'horarios', label: 'Horarios' },
    { id: 'entrenadores', label: 'Entrenadores' },
    { id: 'eventos', label: 'Eventos' },
    { id: 'preguntas', label: 'Preguntas' },
  ];

  // Por defecto (portada) queda activo el primer enlace.
  protected readonly activeId = signal(this.links[0].id);
  protected readonly menuOpen = signal(false);

  private readonly document = inject(DOCUMENT);

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Bloquea el scroll de la página mientras el menú móvil está abierto.
    effect(() => {
      this.document.body.classList.toggle('no-scroll', this.menuOpen());
    });

    afterNextRender(() => {
      const sections = this.links
        .map((link) => document.getElementById(link.id))
        .filter((section): section is HTMLElement => section !== null);

      // Activa la última sección cuyo inicio ya pasó el 40 % superior de la pantalla;
      // así, más allá de la última sección (inscripción, footer) sigue activa la más cercana.
      const update = () => {
        const line = window.innerHeight * 0.4;
        let current = this.links[0].id;
        for (const section of sections) {
          if (section.getBoundingClientRect().top <= line) current = section.id;
        }
        this.activeId.set(current);
      };

      let frame = 0;
      const onScroll = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(update);
      };

      // Al pasar a escritorio el menú móvil deja de tener sentido.
      const desktop = window.matchMedia(DESKTOP_QUERY);
      const onDesktopChange = (e: MediaQueryListEvent) => e.matches && this.closeMenu();

      update();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      desktop.addEventListener('change', onDesktopChange);

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        desktop.removeEventListener('change', onDesktopChange);
      });
    });
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
