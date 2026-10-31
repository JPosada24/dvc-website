import { Component } from '@angular/core';
import { WHATSAPP_URL } from '../../contact';

@Component({
  selector: 'app-cta',
  templateUrl: './cta.html',
  styleUrl: './cta.css',
})
export class Cta {
  protected readonly whatsappUrl = WHATSAPP_URL;
}
