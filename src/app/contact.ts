// Número de WhatsApp del club: código de país + número, solo dígitos (ej. 573001234567).
export const WHATSAPP_NUMBER = '573145939557';

const WHATSAPP_MESSAGE = 'Hola, quiero información para agendar una clase de prueba en el Club Deportivo Dragones.';

export const WHATSAPP_URL = enlaceWhatsApp(WHATSAPP_NUMBER);

/** Enlace de WhatsApp con el mensaje de la clase de prueba (el número puede venir de la plataforma). */
export function enlaceWhatsApp(numero: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}
