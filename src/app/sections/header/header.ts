import { computed, Component, DestroyRef, DOCUMENT, afterNextRender, effect, inject, signal } from '@angular/core';
import { ClubApi } from '../../club-api';

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
  private readonly api = inject(ClubApi);
  /** "Galería" aparece solo si la plataforma tiene fotos o videos publicados; "Eventos" pasa a "Torneos" si hay. */
  protected readonly links = computed(() => {
    const d = this.api.datos();
    return [
      { id: 'club', label: 'El club' },
      { id: 'categorias', label: 'Categorías' },
      { id: 'horarios', label: 'Horarios' },
      { id: 'entrenadores', label: 'Entrenadores' },
      ...(d && (d.albumes.length || d.videos.length) ? [{ id: 'galeria', label: 'Galería' }] : []),
      { id: 'eventos', label: d?.torneos.length ? 'Torneos' : 'Eventos' },
      { id: 'preguntas', label: 'Preguntas' },
    ];
  });

  // Por defecto (portada) queda activo el primer enlace.
  protected readonly activeId = signal('club');
  protected readonly menuOpen = signal(false);

  private readonly document = inject(DOCUMENT);

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Bloquea el scroll de la página mientras el menú móvil está abierto.
    effect(() => {
      this.document.body.classList.toggle('no-scroll', this.menuOpen());
    });

    afterNextRender(() => {

      // Activa la última sección cuyo inicio ya pasó el 40 % superior de la pantalla;
      // así, más allá de la última sección (inscripción, footer) sigue activa la más cercana.
      const update = () => {
        const line = window.innerHeight * 0.4;
        // Se buscan en cada cálculo: la galería aparece después, cuando llegan los datos de la plataforma.
        const sections = this.links()
          .map((link) => document.getElementById(link.id))
          .filter((section): section is HTMLElement => section !== null);
        let current = 'club';
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
