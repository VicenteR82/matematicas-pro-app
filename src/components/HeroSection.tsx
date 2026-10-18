import React from 'react';
import { Calendar, MessageSquare, ShieldCheck, Star, Clock, CheckCircle2, Video } from 'lucide-react';
import { TeacherProfile } from '../types';

interface HeroSectionProps {
  teacher: TeacherProfile;
  onStartBooking: () => void;
  onExploreFeatures: () => void;
  onViewTeacherDashboard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  teacher,
  onStartBooking,
  onExploreFeatures,
  onViewTeacherDashboard,
}) => {
  return (
    <div className="relative overflow-hidden bg-white border-b border-slate-200">
      {/* Background soft geometric pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#4338ca 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Trust Kicker - Clean unboxed text with dot separator */}
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 tracking-wide uppercase mb-3">
              <span>{teacher.title}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>100% Online & Personalizado</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance mb-4">
              Aprende matemáticas con claridad y supera tus exámenes sin estrés
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-6">
              Reserva tu clase particular con la <strong className="text-slate-800 font-semibold">{teacher.name}</strong>. 
              Elige tu horario en tiempo real, abona de forma segura con Stripe, Mercado Pago o Bizum, y recibe 
              <span className="text-emerald-700 font-medium"> recordatorios automáticos por WhatsApp</span> con el enlace a tu clase.
            </p>

            {/* Feature quick checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cálculo, Álgebra, Estadística y Exámenes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Recordatorio 24h y 1h antes por WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pizarra virtual interactiva y apuntes en PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Google Meet en 1 clic y confirmación al instante</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onStartBooking}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar mi Clase Ahora</span>
              </button>

              <button
                onClick={onExploreFeatures}
                className="px-5 py-3.5 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Ver Automatización WhatsApp</span>
              </button>

              <button
                onClick={onViewTeacherDashboard}
                className="px-4 py-3.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                ¿Eres la profesora? Entrar al Panel →
              </button>
            </div>
          </div>

          {/* Right Column: Teacher Portrait & Visual Card */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                {/* Teacher Photo */}
                <div className="aspect-square w-full relative bg-slate-100 overflow-hidden">
                  <img
                    src="/src/assets/images/math_teacher_portrait_1792284327362.jpg"
                    alt="Profesora de Matemáticas Elena Morales"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      // Fallback if image path fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  
                  {/* Subtle gradient scrim at bottom of image */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent flex items-end p-4">
                    <div className="text-white">
                      <p className="font-bold text-lg leading-tight">{teacher.name}</p>
                      <p className="text-xs text-slate-200">{teacher.degree}</p>
                    </div>
                  </div>
                </div>

                {/* Card summary footer */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                    <div className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{teacher.rating} / 5.0</span>
                    </div>
                    <span>184 alumnos evaluados</span>
                    <span className="font-mono font-medium text-slate-900">
                      Desde {teacher.currencySymbol}{teacher.hourlyRate}/h
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                    <Video className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">Google Meet & Zoom listos para unirse</span>
                  </div>
                </div>
              </div>

              {/* Floating micro notification card */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-6 bg-white border border-slate-200/90 rounded-xl p-3 shadow-lg flex items-center gap-3 max-w-[260px]">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-slate-900 leading-tight">WhatsApp Automatizado</p>
                  <p className="text-slate-500 text-[11px] leading-tight">Confirmación y link de sala al instante</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 4-Column KPI Strip below the hero split */}
        <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              +{teacher.studentsCount}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Estudiantes acompañados con éxito</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              96.4%
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Tasa de aprobación en primer examen</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              100%
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Recordatorios WhatsApp automáticos</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              3 Pasos
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Reserva directa sin llamadas ni demoras</p>
          </div>
        </div>

      </div>
    </div>
  );
};
