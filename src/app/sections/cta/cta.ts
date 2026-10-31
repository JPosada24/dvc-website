import { Component, computed, inject } from '@angular/core';
import { ClubApi, numeroWhatsApp } from '../../club-api';
import { WHATSAPP_URL, enlaceWhatsApp } from '../../contact';

@Component({
  selector: 'app-cta',
  templateUrl: './cta.html',
  styleUrl: './cta.css',
})
export class Cta {
  private readonly api = inject(ClubApi);
  /** El número del panel (Perfil del club) si está; si no, el fijo del sitio. */
  protected readonly whatsappUrl = computed(() => {
    const numero = numeroWhatsApp(this.api.datos()?.perfil?.whatsapp);
    return numero ? enlaceWhatsApp(numero) : WHATSAPP_URL;
  });
}
