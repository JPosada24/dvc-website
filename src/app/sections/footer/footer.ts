import { Component, computed, inject } from '@angular/core';
import { ClubApi, numeroWhatsApp, usuarioRed } from '../../club-api';
import { WHATSAPP_URL, enlaceWhatsApp } from '../../contact';
import { ICONOS_REDES } from '../../iconos-redes';

interface Red { red: string; detalle: string; href: string; icono: string; externa: boolean; }

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private readonly api = inject(ClubApi);
  /** Redes y contacto del panel (Perfil del club) como íconos. WhatsApp siempre está (el fijo del sitio si falta). */
  protected readonly redes = computed<Red[]>(() => {
    const p = this.api.datos()?.perfil;
    const instagram = usuarioRed(p?.instagram);
    const facebook = usuarioRed(p?.facebook);
    const tiktok = usuarioRed(p?.tiktok);
    const numero = numeroWhatsApp(p?.whatsapp);
    const correo = p?.correo && /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(p.correo) ? p.correo : null;
    return [
      ...(instagram ? [{ red: 'Instagram', detalle: '@' + instagram, href: `https://www.instagram.com/${instagram}/`,
                         icono: ICONOS_REDES.instagram, externa: true }] : []),
      ...(facebook ? [{ red: 'Facebook', detalle: facebook, href: `https://www.facebook.com/${facebook}`,
                        icono: ICONOS_REDES.facebook, externa: true }] : []),
      ...(tiktok ? [{ red: 'TikTok', detalle: '@' + tiktok, href: `https://www.tiktok.com/@${tiktok}`,
                      icono: ICONOS_REDES.tiktok, externa: true }] : []),
      { red: 'WhatsApp', detalle: 'Escríbenos', href: numero ? enlaceWhatsApp(numero) : WHATSAPP_URL,
        icono: ICONOS_REDES.whatsapp, externa: true },
      ...(correo ? [{ red: 'Correo', detalle: correo, href: `mailto:${correo}`, externa: false,
                      icono: /@gmail\.com$/i.test(correo) ? ICONOS_REDES.gmail : ICONOS_REDES.correo }] : []),
    ];
  });
}
