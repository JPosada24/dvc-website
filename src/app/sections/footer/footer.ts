import { Component, computed, inject } from '@angular/core';
import { ClubApi, usuarioRed } from '../../club-api';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private readonly api = inject(ClubApi);
  /** Correo y redes del panel (Perfil del club); sin datos, el pie queda como siempre. */
  protected readonly redes = computed(() => {
    const p = this.api.datos()?.perfil;
    const instagram = usuarioRed(p?.instagram);
    const facebook = usuarioRed(p?.facebook);
    const correo = p?.correo && /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(p.correo) ? p.correo : null;
    return [
      ...(instagram ? [{ label: '@' + instagram, href: `https://www.instagram.com/${instagram}/`, red: 'Instagram' }] : []),
      ...(facebook ? [{ label: 'Facebook', href: `https://www.facebook.com/${facebook}`, red: 'Facebook' }] : []),
      ...(correo ? [{ label: correo, href: `mailto:${correo}`, red: 'Correo' }] : []),
    ];
  });
}
