import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, BookOpen, Check, ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { AcademicLevel, ClassPackage, TeacherProfile, Booking, PaymentMethod, WhatsAppTemplate } from '../../types';
import { PaymentModal } from './PaymentModal';
import { WhatsAppConfirmationModal } from './WhatsAppConfirmationModal';

interface BookingWizardProps {
  packages: ClassPackage[];
  teacher: TeacherProfile;
  existingBookings: Booking[];
  confirmationTemplate: WhatsAppTemplate;
  onBookingCreated: (booking: Booking) => void;
  selectedPackageFromLanding?: ClassPackage | null;
}

const ACADEMIC_SUBJECTS: { id: AcademicLevel; label: string; iconText: string; desc: string }[] = [
  { id: 'Cálculo Diferencial e Integral', label: 'Cálculo Diferencial e Integral', iconText: '∫ dx', desc: 'Límites, derivadas, integrales múltiples y series' },
  { id: 'Álgebra Lineal', label: 'Álgebra Lineal & Matrices', iconText: 'Ax=b', desc: 'Espacios vectoriales, matrices y transformaciones' },
  { id: 'Bachillerato / Selectividad', label: 'Bachillerato & Selectividad / PAU', iconText: 'PAU', desc: 'Preparación integral para notas de corte altas' },
  { id: 'Estadística y Probabilidad', label: 'Estadística & Probabilidad', iconText: 'σ / μ', desc: 'Inferencia, distribuciones y análisis de datos' },
  { id: 'Geometría y Trigonometría', label: 'Geometría Analítica & Trigonometría', iconText: 'sin θ', desc: 'Cónicas, vectores, identidades y triángulos' },
  { id: 'Secundaria / ESO', label: 'Matemáticas ESO / Secundaria', iconText: 'x + y', desc: 'Refuerzo de bases, fracciones y álgebra inicial' },
  { id: 'Preparación Examen / PAES', label: 'Exámenes Universitarios & PAES', iconText: 'A+', desc: 'Simulacros y resolución de exámenes reales' },
  { id: 'Matemáticas Universitarias', label: 'Modelado Matemático Avanzado', iconText: 'f(t)', desc: 'Ecuaciones diferenciales y métodos numéricos' },
];

const COUNTRY_CODES = [
  { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
  { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+51', country: 'Perú', flag: '🇵🇪' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+52', country: 'México', flag: '🇲🇽' },
  { code: '+34', country: 'España', flag: '🇪🇸' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
];

export const BookingWizard: React.FC<BookingWizardProps> = ({
  packages,
  teacher,
  existingBookings,
  confirmationTemplate,
  onBookingCreated,
  selectedPackageFromLanding,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedPackage, setSelectedPackage] = useState<ClassPackage>(
    selectedPackageFromLanding || packages[0]
  );
  const [selectedSubject, setSelectedSubject] = useState<AcademicLevel>('Cálculo Diferencial e Integral');

  // Dates: Next 14 days
  const today = new Date();
  const availableDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i + 1);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay(); // 0 is Sunday
    const isWorkingDay = teacher.workingDays.includes(dayOfWeek);
    return {
      dateStr,
      dateObj: d,
      dayName: d.toLocaleDateString('es-ES', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('es-ES', { month: 'short' }),
      available: isWorkingDay,
    };
  }).filter(d => d.available);

  const [selectedDate, setSelectedDate] = useState<string>(
    availableDates[0]?.dateStr || new Date().toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(teacher.timeSlots[0] || '16:00 - 17:00');

  // Student Info
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+595');
  const [studentPhoneNum, setStudentPhoneNum] = useState('');
  const [notes, setNotes] = useState('');

  // Modals state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Check taken slots for selected date
  const bookedSlotsOnSelectedDate = existingBookings
    .filter(b => b.date === selectedDate && b.status !== 'cancelled')
    .map(b => b.timeSlot);

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
  };

  const handleOpenPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhoneNum.trim() || !studentEmail.trim()) {
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (method: PaymentMethod, reference: string) => {
    setShowPaymentModal(false);

    const fullPhone = `${countryCode}${studentPhoneNum.replace(/[^\d]/g, '')}`;
    const randomCode = `MAT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingCode: randomCode,
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim(),
      studentPhone: fullPhone,
      countryCode,
      subject: selectedSubject,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      date: selectedDate,
      timeSlot: selectedSlot,
      durationMinutes: selectedPackage.durationMinutes,
      amount: selectedPackage.price,
      currency: teacher.currency,
      status: method === 'bank_transfer' ? 'confirmed' : 'paid',
      paymentMethod: method,
      paymentReference: reference,
      notes: notes.trim(),
      meetLink: teacher.meetLinkDefault,
      createdAt: new Date().toISOString(),
      remindersSent: {
        confirmation: true,
        reminder24h: false,
        reminder1h: false,
      },
    };

    onBookingCreated(newBooking);
    setCreatedBooking(newBooking);
  };

  return (
    <section id="reservar" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Wizard Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
            Paso a Paso Rápido
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Reserva tu Clase de Matemáticas
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Confirmación inmediata, recordatorios automáticos en tu WhatsApp y pago 100% seguro.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              1
            </div>
            <span className="text-xs font-medium text-slate-700 hidden sm:inline">Materia & Plan</span>
          </div>
          <div className="w-8 sm:w-16 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              2
            </div>
            <span className="text-xs font-medium text-slate-700 hidden sm:inline">Fecha & Horario</span>
          </div>
          <div className="w-8 sm:w-16 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              3
            </div>
            <span className="text-xs font-medium text-slate-700 hidden sm:inline">Tus Datos & Pago</span>
          </div>
        </div>

        {/* Step Container */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          
          {/* STEP 1: Select Subject and Package */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in duration-150">
              {/* Select Subject */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  1. ¿Qué tema o nivel necesitas trabajar?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {ACADEMIC_SUBJECTS.map((sub) => {
                    const isSelected = selectedSubject === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedSubject(sub.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {sub.iconText}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <p className="text-xs font-bold text-slate-900 leading-snug">{sub.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{sub.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Select Package */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  2. Selecciona la modalidad de tu clase
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {packages.map((pkg) => {
                    const isSelected = selectedPackage.id === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackage(pkg)}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-900">{pkg.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                          </div>
                          <p className="text-[11px] text-slate-500 mb-3">{pkg.durationMinutes} min / sesión</p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                          <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                            {teacher.currencySymbol} {pkg.price.toLocaleString('es-PY')}
                          </span>
                          {pkg.discountPercentage && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              -{pkg.discountPercentage}%
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-end pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Continuar a Fecha & Horario</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Date & Available Slot */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Selecciona el día de tu clase
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Prof. Elena está disponible de Lunes a Sábado.
                </p>

                {/* Horizontal date selector */}
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {availableDates.map((item) => {
                    const isSelected = selectedDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        onClick={() => setSelectedDate(item.dateStr)}
                        className={`shrink-0 w-20 py-3 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span className="text-[11px] uppercase block font-semibold opacity-80">
                          {item.dayName}
                        </span>
                        <span className="text-lg font-extrabold block font-mono my-0.5">
                          {item.dayNumber}
                        </span>
                        <span className="text-[10px] block opacity-80">
                          {item.monthName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Horarios disponibles para esta fecha
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {teacher.timeSlots.map((slot) => {
                    const isBooked = bookedSlotsOnSelectedDate.includes(slot);
                    const isSelected = selectedSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isBooked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs cursor-pointer'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5 text-xs font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{slot}</span>
                        </div>
                        {isBooked ? (
                          <span className="text-[10px] block mt-0.5 text-slate-400 no-underline">Ocupado</span>
                        ) : (
                          <span className="text-[10px] block mt-0.5 opacity-80">Disponible</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary of selections */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Sesión seleccionada:</span>
                  <p className="font-semibold text-slate-800">
                    {selectedSubject} · {selectedDate} ({selectedSlot})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Monto:</span>
                  <p className="font-bold text-indigo-600 font-mono text-sm">
                    {teacher.currencySymbol} {selectedPackage.price.toLocaleString('es-PY')} {teacher.currency}
                  </p>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Continuar a Tus Datos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Student Details & Checkout trigger */}
          {currentStep === 3 && (
            <form onSubmit={handleOpenPayment} className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Datos del Estudiante para WhatsApp y Sala Virtual
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  A este número de WhatsApp te enviaremos el enlace de Google Meet y los recordatorios automáticos.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nombre y Apellido del Alumno
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                        placeholder="Ej: Sofía Valenzuela"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  {/* WhatsApp phone with Country Code */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Teléfono WhatsApp (Con código de país para recordatorios)
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-36 px-2 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 shrink-0 font-medium cursor-pointer"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>

                      <div className="relative flex-1">
                        <input
                          type="tel"
                          value={studentPhoneNum}
                          onChange={(e) => setStudentPhoneNum(e.target.value)}
                          required
                          placeholder="612345678"
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 font-mono"
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-700 mt-1 block">
                      ✓ Recibirás la confirmación inmediata y recordatorios 24h y 1h antes por WhatsApp.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Correo Electrónico (para respaldo y apuntes)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        required
                        placeholder="ejemplo@correo.com"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Dudas concretas o ejercicios a revisar (Opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder="Ej: Tengo examen el viernes sobre integrales racionales y optimización de funciones."
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Order Final Summary */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-700">
                  <span>Resumen de tu Clase:</span>
                  <span className="font-semibold">{selectedSubject}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Fecha y Horario:</span>
                  <span className="font-semibold">{selectedDate} · {selectedSlot}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Modalidad:</span>
                  <span className="font-semibold">{selectedPackage.name} ({selectedPackage.durationMinutes} min)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-indigo-200/60 font-bold text-slate-900 text-sm">
                  <span>Total a Pagar:</span>
                  <span className="text-indigo-700 font-mono text-base">
                    {teacher.currencySymbol} {selectedPackage.price.toLocaleString('es-PY')} {teacher.currency}
                  </span>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Proceder al Pago ({teacher.currencySymbol} {selectedPackage.price.toLocaleString('es-PY')})</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          amount={selectedPackage.price}
          currencySymbol={teacher.currencySymbol}
          currency={teacher.currency}
          teacher={teacher}
          studentName={studentName}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}

      {/* Confirmation & WhatsApp Dialog */}
      {createdBooking && (
        <WhatsAppConfirmationModal
          booking={createdBooking}
          templateContent={confirmationTemplate.content}
          onClose={() => {
            setCreatedBooking(null);
            setCurrentStep(1);
            setStudentName('');
            setStudentPhoneNum('');
            setNotes('');
          }}
        />
      )}

    </section>
  );
};
