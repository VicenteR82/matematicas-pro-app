import { AcademicLevel, ClassPackage, TeacherProfile, Booking, WhatsAppTemplate } from '../types';

export const INITIAL_PACKAGES: ClassPackage[] = [
  {
    id: 'pack-single',
    name: 'Clase Individual 1 a 1',
    durationMinutes: 60,
    totalClasses: 1,
    price: 80000,
    description: 'Ideal para resolver dudas puntuales de una tarea, prácticos o preparar un examen próximo.',
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
    price: 120000,
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
    price: 290000,
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
    price: 550000,
    discountPercentage: 15,
    description: 'Preparación integral para Ingreso Universitario (UNA, UCA), Probatorio o exámenes finales.',
    features: [
      '8 clases de 60 min con temario intensivo',
      'Simulacros de examen cronometrados con corrección',
      'Banco de más de 120 ejercicios resueltos paso a paso',
      'Línea directa prioritaria de WhatsApp para dudas',
    ],
  },
];

export const INITIAL_TEACHER_PROFILE: TeacherProfile = {
  id: 'teacher-1',
  name: 'Prof. Vicente Rolón',
  title: 'Licenciado en Ciencias Matemáticas & Docente Especialista',
  degree: 'Docente de Matemáticas · Especialista en Cálculo, Álgebra y Cursos Probatorios',
  bio: 'Acompañando a estudiantes de colegio secundario, bachillerato y carreras universitarias (Ingeniería, Ciencias Económicas, Politécnica) a comprender las matemáticas paso a paso y aprobar sus exámenes con seguridad.',
  avatarUrl: '/src/assets/images/math_teacher_portrait_1792284327362.jpg',
  experienceYears: 12,
  studentsCount: 520,
  rating: 4.98,
  hourlyRate: 80000,
  currency: 'PYG',
  currencySymbol: 'Gs.',
  phoneWhatsApp: '+595981123456',
  email: 'profevicenterolon@gmail.com',
  preferredPlatform: 'teams',
  meetLinkDefault: 'https://teams.microsoft.com/l/meetup-join/sample-math-pro',
  inPersonAddress: 'Aula particular: Calle Palma 450 casi 14 de Mayo, Asunción',
  allowOnline: true,
  allowInPerson: true,
  timeSlots: [
    '08:00 - 09:00',
    '09:15 - 10:15',
    '10:30 - 11:30',
    '14:00 - 15:00',
    '15:15 - 16:15',
    '16:30 - 17:30',
    '17:45 - 18:45',
    '19:00 - 20:00',
  ],
  workingDays: [1, 2, 3, 4, 5, 6], // Lunes a Sábado
  stripePublicKey: 'pk_test_51MzSAMPLEKEYSTRIPE123456789',
  mercadoPagoPublicKey: 'TEST-384918293-8472-SAMPLE',
  paypalClientId: 'sb-client-sample-key',
  bankDetails: {
    bankName: 'Transferencia SIPAP (Itaú / Continental / BNF)',
    accountHolder: 'Vicente Rolón',
    accountNumber: 'Cta: 720194821 · CI: 4.238.910',
    routingCode: 'Tigo Money / Personal Pay: 0981 123 456',
    instructions: 'Puedes abonar por Transferencia Bancaria SIPAP o por Billetera Tigo Money / Personal Pay. Envía tu comprobante con tu nombre.',
  },
};

export const INITIAL_TEACHERS: TeacherProfile[] = [
  INITIAL_TEACHER_PROFILE,
  {
    id: 'teacher-2',
    name: 'Lic. Elena Morales',
    title: 'Magíster en Didáctica y Docente de Bachillerato',
    degree: 'Especialista en Geometría Analítica, Trigonometría y Probabilidad',
    bio: 'Clases dinámicas y explicaciones visuales paso a paso para estudiantes que buscan asegurar su nota en exámenes y pruebas de admisión.',
    avatarUrl: '/src/assets/images/math_teacher_portrait_1792284327362.jpg',
    experienceYears: 9,
    studentsCount: 390,
    rating: 4.97,
    hourlyRate: 80000,
    currency: 'PYG',
    currencySymbol: 'Gs.',
    phoneWhatsApp: '+595981987654',
    email: 'elena.morales.mate@gmail.com',
    preferredPlatform: 'meet',
    meetLinkDefault: 'https://meet.google.com/abc-mate-demo',
    inPersonAddress: 'Aula 2: Avda. Mariscal López y Sacramento, Asunción',
    allowOnline: true,
    allowInPerson: true,
    timeSlots: [
      '08:30 - 09:30',
      '10:00 - 11:00',
      '14:30 - 15:30',
      '16:00 - 17:00',
      '17:30 - 18:30',
    ],
    workingDays: [1, 2, 3, 4, 5],
    stripePublicKey: '',
    mercadoPagoPublicKey: '',
    paypalClientId: '',
    bankDetails: {
      bankName: 'Transferencia SIPAP (Banco Familiar / Basa)',
      accountHolder: 'Elena Morales',
      accountNumber: 'Cta: 510928371 · CI: 5.120.443',
      routingCode: 'Tigo Money: 0981 987 654',
      instructions: 'Abonar vía SIPAP o Billetera Tigo Money y enviar comprobante por WhatsApp.',
    },
  },
];

export const INITIAL_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl-confirmation',
    name: 'Confirmación Inmediata de Reserva',
    trigger: 'immediate',
    title: 'Confirmación y Enlace de Sala',
    content: `👋 ¡Hola {student_name}!

Soy el Prof. Vicente Rolón. Tu reserva para la clase de *{subject}* ({package_name}) ha sido confirmada con éxito.

📅 *Fecha:* {date}
⏰ *Hora:* {time_slot}
💳 *Estado del Pago:* {payment_status} ({amount} {currency})
💻 *Enlace de la clase (Google Meet):*
{meet_link}

📌 *Recomendación:* Ten a mano tu cuaderno de apuntes, calculadora y los ejercicios que quieras resolver. ¡Nos vemos en clase! 📐✏️`,
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
    studentName: 'Carlos Benítez',
    studentEmail: 'carlos.benitez@gmail.com',
    studentPhone: '+595981445566',
    countryCode: '+595',
    subject: 'Cálculo Diferencial e Integral',
    packageId: 'pack-intensive',
    packageName: 'Sesión Intensiva de Resolución (90 min)',
    modality: 'online',
    locationOrPlatform: 'Microsoft Teams',
    date: '2026-10-19',
    timeSlot: '15:15 - 16:45',
    durationMinutes: 90,
    amount: 120000,
    currency: 'Gs.',
    status: 'paid',
    paymentMethod: 'bank_transfer',
    paymentReference: 'SIPAP-TRANSF-88912',
    notes: 'Repaso urgente de cálculo de límites indeterminados y derivadas para examen en la FIUNA.',
    meetLink: 'https://teams.microsoft.com/l/meetup-join/sample-math-pro',
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
    studentName: 'Lucía Vera',
    studentEmail: 'lucia.vera@outlook.com',
    studentPhone: '+595971223344',
    countryCode: '+595',
    subject: 'Bachillerato / Selectividad',
    packageId: 'pack-monthly',
    packageName: 'Pack Mensual de Acompañamiento',
    modality: 'presencial',
    locationOrPlatform: 'Aula Asunción (Palma 450)',
    inPersonAddress: 'Aula particular: Calle Palma 450 casi 14 de Mayo, Asunción',
    date: '2026-10-20',
    timeSlot: '16:30 - 17:30',
    durationMinutes: 60,
    amount: 290000,
    currency: 'Gs.',
    status: 'paid',
    paymentMethod: 'bank_transfer',
    paymentReference: 'TIGO-MONEY-7741',
    notes: 'Preparación de matrices, determinantes y sistemas de ecuaciones.',
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
    studentName: 'Mateo González',
    studentEmail: 'mateo.gonzalez@gmail.com',
    studentPhone: '+595982112233',
    countryCode: '+595',
    subject: 'Álgebra Lineal',
    packageId: 'pack-single',
    packageName: 'Clase Individual 1 a 1',
    modality: 'online',
    locationOrPlatform: 'Microsoft Teams',
    date: '2026-10-18',
    timeSlot: '10:30 - 11:30',
    durationMinutes: 60,
    amount: 80000,
    currency: 'Gs.',
    status: 'confirmed',
    paymentMethod: 'bank_transfer',
    paymentReference: 'SIPAP-ITAU-5510',
    notes: 'Espacios vectoriales y bases ortonormales.',
    meetLink: 'https://teams.microsoft.com/l/meetup-join/sample-math-pro',
    createdAt: '2026-10-17T09:15:00Z',
    remindersSent: {
      confirmation: true,
      reminder24h: true,
      reminder1h: false,
    },
  },
];
