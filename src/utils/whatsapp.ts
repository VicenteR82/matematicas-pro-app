import { Booking } from '../types';

export function cleanPhoneNumber(phone: string): string {
  // Strip all non-digit characters except leading +
  const cleaned = phone.replace(/[^\d]/g, '');
  return cleaned;
}

export function formatWhatsAppMessage(
  templateContent: string,
  booking: Booking,
  meetLinkOverride?: string
): string {
  const meetLink = meetLinkOverride || booking.meetLink || 'https://meet.google.com/xrq-pmts-gvd';
  const paymentStatusMap: Record<string, string> = {
    paid: 'Pagado y Aprobado ✅',
    confirmed: 'Confirmado (Pendiente de pago) ⏳',
    pending: 'Pendiente ⏳',
    completed: 'Completado 🎉',
    cancelled: 'Cancelado ❌',
  };

  const statusText = paymentStatusMap[booking.status] || booking.status;

  // Format date nicely: "Lunes, 19 de Octubre de 2026"
  let formattedDate = booking.date;
  try {
    const [year, month, day] = booking.date.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    formattedDate = d.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    // Capitalize first letter
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  } catch {
    formattedDate = booking.date;
  }

  return templateContent
    .replace(/{student_name}/g, booking.studentName)
    .replace(/{subject}/g, booking.subject)
    .replace(/{package_name}/g, booking.packageName)
    .replace(/{date}/g, formattedDate)
    .replace(/{time_slot}/g, booking.timeSlot)
    .replace(/{amount}/g, booking.amount.toString())
    .replace(/{currency}/g, booking.currency)
    .replace(/{payment_status}/g, statusText)
    .replace(/{meet_link}/g, meetLink)
    .replace(/{booking_code}/g, booking.bookingCode);
}

export function generateWhatsAppLink(
  phoneNumber: string,
  messageText: string
): string {
  const digits = cleanPhoneNumber(phoneNumber);
  const encoded = encodeURIComponent(messageText);
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function openWhatsAppChat(phoneNumber: string, messageText: string) {
  const link = generateWhatsAppLink(phoneNumber, messageText);
  window.open(link, '_blank', 'noopener,noreferrer');
}
