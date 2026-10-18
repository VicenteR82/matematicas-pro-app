import { Booking } from '../types';

export function generateICSFile(booking: Booking, teacherName: string = 'Prof. Elena Morales'): void {
  try {
    const [startHourStr] = booking.timeSlot.split('-').map(s => s.trim());
    const [startHour, startMin] = startHourStr.split(':').map(Number);
    const [year, month, day] = booking.date.split('-').map(Number);

    const startDate = new Date(Date.UTC(year, month - 1, day, startHour, startMin || 0));
    const endDate = new Date(startDate.getTime() + (booking.durationMinutes || 60) * 60 * 1000);

    const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
    const formatICSDate = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const startICS = formatICSDate(startDate);
    const endICS = formatICSDate(endDate);

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Matematicas Pro//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${booking.bookingCode}-${Date.now()}@matematicaspro.com`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${startICS}`,
      `DTEND:${endICS}`,
      `SUMMARY:Clase de Matemáticas: ${booking.subject} con ${teacherName}`,
      `DESCRIPTION:Clase particular de matemáticas (${booking.packageName})\\nCódigo de Reserva: ${booking.bookingCode}\\nEnlace de Google Meet: ${booking.meetLink || 'https://meet.google.com/xrq-pmts-gvd'}`,
      `LOCATION:${booking.meetLink || 'Google Meet'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `clase-matematicas-${booking.bookingCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Error generating calendar invite', err);
  }
}
