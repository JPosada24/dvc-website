// Número de WhatsApp del club: código de país + número, solo dígitos (ej. 573001234567).
export const WHATSAPP_NUMBER = '573145939557';

const WHATSAPP_MESSAGE = 'Hola, quiero información para agendar una clase de prueba en el Club Deportivo Dragones.';

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
