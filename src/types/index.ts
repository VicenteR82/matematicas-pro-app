export type BookingStatus = 'pending' | 'confirmed' | 'paid' | 'completed' | 'cancelled';

export type PaymentMethod = 'stripe' | 'mercadopago' | 'paypal' | 'bank_transfer';

export type ClassModality = 'online' | 'presencial';

export type OnlinePlatform = 'teams' | 'meet' | 'zoom' | 'other';

export type AcademicLevel = 
  | 'Secundaria / ESO'
  | 'Bachillerato / Selectividad'
  | 'Cálculo Diferencial e Integral'
  | 'Álgebra Lineal'
  | 'Geometría y Trigonometría'
  | 'Estadística y Probabilidad'
  | 'Matemáticas Universitarias'
  | 'Preparación Examen / PAES';

export interface ClassPackage {
  id: string;
  name: string;
  durationMinutes: number;
  totalClasses: number;
  price: number;
  discountPercentage?: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface Booking {
  id: string;
  bookingCode: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  countryCode: string;
  subject: AcademicLevel;
  packageId: string;
  packageName: string;
  modality: ClassModality; // 'online' or 'presencial'
  locationOrPlatform?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "16:00 - 17:00"
  durationMinutes: number;
  amount: number;
  currency: string;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  notes?: string;
  meetLink?: string; // Microsoft Teams, Google Meet, or Zoom link
  inPersonAddress?: string; // Physical address if in-person
  createdAt: string;
  remindersSent: {
    confirmation?: boolean;
    reminder24h?: boolean;
    reminder1h?: boolean;
    postClass?: boolean;
  };
}

export interface TeacherProfile {
  name: string;
  title: string;
  degree: string;
  bio: string;
  experienceYears: number;
  studentsCount: number;
  rating: number;
  hourlyRate: number;
  currency: string;
  currencySymbol: string;
  phoneWhatsApp: string;
  email: string;
  preferredPlatform: OnlinePlatform; // 'teams' | 'meet' | 'zoom' | 'other'
  meetLinkDefault: string; // URL for Microsoft Teams, Google Meet or Zoom
  inPersonAddress: string; // Classroom address or physical meeting location
  allowOnline: boolean;
  allowInPerson: boolean;
  timeSlots: string[];
  workingDays: number[];
  stripePublicKey?: string;
  mercadoPagoPublicKey?: string;
  paypalClientId?: string;
  bankDetails: {
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    routingCode: string;
    instructions: string;
  };
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  trigger: 'immediate' | '24h_before' | '1h_before' | 'post_class';
  title: string;
  content: string;
}
