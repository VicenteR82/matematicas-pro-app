import { AcademicLevel, ClassPackage, TeacherProfile, Booking, WhatsAppTemplate } from '../types';

export const INITIAL_PACKAGES: ClassPackage[] = [
  {
    id: 'pack-single',
    name: 'Clase Individual 1 a 1',
    durationMinutes: 60,
    totalClasses: 1,
    price: 25,
    description: 'Ideal para resolver dudas puntuales de una tarea o preparar un examen próximo.',
    features: [
      '60 minutos de clase personalizada en vivo',
      'Pizarra digital compartida en alta definición',
      'Grabación de la clase y apuntes en PDF al finalizar',
      'Recordatorio automático por WhatsApp con enlace directo',
    ],
  },
  {
    id: 'pack-intensive',
    name: 'Sesión Intensiva de Resolución',
    durationMinutes: 90,
    totalClasses: 1,
    price: 35,
    popular: true,
    description: 'Enfoque profundo en demostraciones, modelos matemáticos o ejercicios complejos de examen.',
    features: [
      '90 minutos continuos de práctica guiada',
      'Resolución de exámenes de años anteriores',
      'Guía personalizada de errores comunes a evitar',
      'Soporte breve por WhatsApp durante la semana',
    ],
  },
  {
    id: 'pack-monthly',
    name: 'Pack Mensual de Acompañamiento',
    durationMinutes: 60,
    totalClasses: 4,
    price: 90,
    discountPercentage: 10,
    description: 'Plan semanal para asegurar el aprobado y dominar la asignatura con constancia.',
    features: [
      '4 clases individuales de 60 min (1 por semana)',
      'Plan de estudio estructurado según tu temario',
      'Seguimiento de progreso y retroalimentación',
      'Prioridad de reserva en horarios estelares',
    ],
  },
  {
    id: 'pack-exam',
    name: 'Programa Superación de Exámenes',
    durationMinutes: 60,
    totalClasses: 8,
    price: 170,
    discountPercentage: 15,
    description: 'Preparación integral para Selectividad, PAES o exámenes finales universitarios.',
    features: [
      '8 clases de 60 min con temario intensivo',
      'Simulacros de examen cronometrados con corrección',
      'Banco de más de 120 ejercicios resueltos paso a paso',
      'Línea directa prioritaria de WhatsApp para dudas',
    ],
  },
];

export const INITIAL_TEACHER_PROFILE: TeacherProfile = {
  name: 'Prof. Elena Morales',
  title: 'Licenciada en Ciencias Matemáticas & Especialista en Didáctica',
  degree: 'Graduada con Honores · Máster en Análisis Matemático y Estadística Aplicada',
  bio: 'Más de 10 años acompañando a estudiantes de secundaria, bachillerato y universidad a perder el miedo a las matemáticas y conseguir sus mejores calificaciones. Clases dinámicas, claras y enfocadas en la comprensión lógica.',
  experienceYears: 11,
  studentsCount: 480,
  rating: 4.98,
  hourlyRate: 25,
  currency: 'USD',
  currencySymbol: '$',
  phoneWhatsApp: '+34612345678',
  email: 'elena.morales.math@gmail.com',
  meetLinkDefault: 'https://meet.google.com/xrq-pmts-gvd',
  timeSlots: [
    '09:00 - 10:00',
    '10:15 - 11:15',
    '11:30 - 12:30',
    '15:00 - 16:00',
    '16:15 - 17:15',
    '17:30 - 18:30',
    '18:45 - 19:45',
    '20:00 - 21:00',
  ],
  workingDays: [1, 2, 3, 4, 5, 6], // Lunes a Sábado
  stripePublicKey: 'pk_test_51MzSAMPLEKEYSTRIPE123456789',
  mercadoPagoPublicKey: 'TEST-384918293-8472-SAMPLE',
  paypalClientId: 'sb-client-sample-key',
  bankDetails: {
    bankName: 'Banco Santander / Bizum',
    accountHolder: 'Elena Morales Ruiz',
    accountNumber: 'ES91 0049 1500 0512 3456 7890',
    routingCode: 'Bizum: +34 612 345 678',
    instructions: 'Indica tu Nombre y Código de Reserva en el concepto. Tu clase se confirmará de inmediato al recibir el comprobante.',
  },
};

export const INITIAL_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl-confirmation',
    name: 'Confirmación Inmediata de Reserva',
    trigger: 'immediate',
    title: 'Confirmación y Enlace de Sala',
    content: `👋 ¡Hola {student_name}!

Soy la Prof. Elena Morales. Tu reserva para la clase de *{subject}* ({package_name}) ha sido confirmada con éxito.

📅 *Fecha:* {date}
⏰ *Hora:* {time_slot}
💳 *Estado del Pago:* {payment_status} ({amount} {currency})
💻 *Enlace de la clase (Google Meet):*
{meet_link}

📌 *Recomendación:* Ten a mano un cuaderno, tu calculadora y los ejercicios que quieras resolver. ¡Nos vemos en clase! 📐✏️`,
  },
  {
    id: 'tpl-24h',
    name: 'Recordatorio 24 Horas Antes',
    trigger: '24h_before',
    title: 'Recordatorio Preventivo (Día previo)',
    content: `🔔 ¡Hola {student_name}!

Te recuerdo que mañana tenemos clase de *{subject}*.

📅 *Fecha:* {date}
⏰ *Horario:* {time_slot}
💻 *Sala virtual:* {meet_link}

Si tienes ejercicios específicos o exámenes que quieras revisar, puedes enviármelos en foto por este chat para prepararlos con antelación. ¡Que tengas un excelente día! 🚀`,
  },
  {
    id: 'tpl-1h',
    name: 'Recordatorio 1 Hora Antes',
    trigger: '1h_before',
    title: 'Recordatorio Inmediato (1 hora)',
    content: `⏰ ¡{student_name}, tu clase comienza en 1 hora!

Nos conectamos a las *{time_slot}* para tu sesión de *{subject}*.

👉 *Entra directamente aquí:*
{meet_link}

¡Todo listo para resolver todas tus dudas! Nos vemos en unos minutos. 📚`,
  },
  {
    id: 'tpl-post',
    name: 'Resumen Post-Clase y Apuntes',
    trigger: 'post_class',
    title: 'Agradecimiento y Material',
    content: `🎉 ¡Excelente trabajo hoy, {student_name}!

Fue una clase muy productiva en *{subject}*. Has avanzado notablemente en la resolución de los problemas planteados.

📎 Te dejo el enlace a la carpeta con el PDF de la pizarra y los ejercicios propuestos para consolidar lo aprendido.
Si deseas agendar tu próxima sesión, puedes hacerlo en cualquier momento en nuestra plataforma. ¡Sigue así! 🌟`,
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    bookingCode: 'MAT-7842',
    studentName: 'Carlos Mendoza',
    studentEmail: 'carlos.mendoza@gmail.com',
    studentPhone: '+34622119933',
    countryCode: '+34',
    subject: 'Cálculo Diferencial e Integral',
    packageId: 'pack-intensive',
    packageName: 'Sesión Intensiva de Resolución (90 min)',
    date: '2026-10-19',
    timeSlot: '16:15 - 17:45',
    durationMinutes: 90,
    amount: 35,
    currency: 'USD',
    status: 'paid',
    paymentMethod: 'stripe',
    paymentReference: 'ch_3N8x7SAMPLE123',
    notes: 'Repaso urgente de cálculo de límites indeterminados y regla de L\'Hôpital para examen de universidad.',
    meetLink: 'https://meet.google.com/xrq-pmts-gvd',
    createdAt: '2026-10-16T10:30:00Z',
    remindersSent: {
      confirmation: true,
      reminder24h: false,
      reminder1h: false,
    },
  },
  {
    id: 'bk-102',
    bookingCode: 'MAT-9120',
    studentName: 'Lucía Fernández',
    studentEmail: 'lucia.fer@outlook.com',
    studentPhone: '+34655443322',
    countryCode: '+34',
    subject: 'Bachillerato / Selectividad',
    packageId: 'pack-monthly',
    packageName: 'Pack Mensual de Acompañamiento',
    date: '2026-10-20',
    timeSlot: '17:30 - 18:30',
    durationMinutes: 60,
    amount: 90,
    currency: 'USD',
    status: 'paid',
    paymentMethod: 'mercadopago',
    paymentReference: 'MP-892184-TX',
    notes: 'Preparación de matrices, determinantes y sistemas de Cramer.',
    meetLink: 'https://meet.google.com/xrq-pmts-gvd',
    createdAt: '2026-10-15T14:20:00Z',
    remindersSent: {
      confirmation: true,
      reminder24h: false,
      reminder1h: false,
    },
  },
  {
    id: 'bk-103',
    bookingCode: 'MAT-4389',
    studentName: 'Mateo Gómez',
    studentEmail: 'mateo.gomez@gmail.com',
    studentPhone: '+525541234567',
    countryCode: '+52',
    subject: 'Álgebra Lineal',
    packageId: 'pack-single',
    packageName: 'Clase Individual 1 a 1',
    date: '2026-10-18',
    timeSlot: '11:30 - 12:30',
    durationMinutes: 60,
    amount: 25,
    currency: 'USD',
    status: 'confirmed',
    paymentMethod: 'bank_transfer',
    paymentReference: 'TRANSF-SPEI-9941',
    notes: 'Duda con espacios vectoriales y bases ortonormales con Gram-Schmidt.',
    meetLink: 'https://meet.google.com/xrq-pmts-gvd',
    createdAt: '2026-10-17T09:15:00Z',
    remindersSent: {
      confirmation: true,
      reminder24h: true,
      reminder1h: false,
    },
  },
  {
    id: 'bk-104',
    bookingCode: 'MAT-2204',
    studentName: 'Sofía Valenzuela',
    studentEmail: 'sofia.valenzuela@yahoo.es',
    studentPhone: '+34699887766',
    countryCode: '+34',
    subject: 'Estadística y Probabilidad',
    packageId: 'pack-single',
    packageName: 'Clase Individual 1 a 1',
    date: '2026-10-16',
    timeSlot: '18:45 - 19:45',
    durationMinutes: 60,
    amount: 25,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'paypal',
    paymentReference: 'PAYID-MN681920',
    notes: 'Distribución normal y contraste de hipótesis.',
    meetLink: 'https://meet.google.com/xrq-pmts-gvd',
    createdAt: '2026-10-14T11:00:00Z',
    remindersSent: {
      confirmation: true,
      reminder24h: true,
      reminder1h: true,
      postClass: true,
    },
  },
];
