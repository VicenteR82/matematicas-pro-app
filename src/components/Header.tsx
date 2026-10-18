import React from 'react';
import { Calendar, UserCheck, Rocket, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentView: 'student' | 'teacher';
  onViewChange: (view: 'student' | 'teacher') => void;
  onOpenDeploymentGuide: () => void;
  onScrollToSection: (sectionId: string) => void;
  pendingBookingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenDeploymentGuide,
  onScrollToSection,
  pendingBookingsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onViewChange('student');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left group cursor-pointer"
          >
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
              Prof. Elena Morales
            </span>
            <span className="text-xs text-slate-500 block font-normal whitespace-nowrap">
              Matemáticas Universitarias & Bachillerato
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              if (currentView !== 'student') onViewChange('student');
              setTimeout(() => onScrollToSection('planes'), 100);
            }}
            className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            Planes & Precios
          </button>
          <button
            onClick={() => {
              if (currentView !== 'student') onViewChange('student');
              setTimeout(() => onScrollToSection('reservar'), 100);
            }}
            className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            Agendar Clase
          </button>
          <button
            onClick={() => {
              if (currentView !== 'student') onViewChange('student');
              setTimeout(() => onScrollToSection('recordatorios'), 100);
            }}
            className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            WhatsApp & Pagos
          </button>
          <button
            onClick={onOpenDeploymentGuide}
            className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap cursor-pointer font-semibold"
          >
            <Rocket className="w-4 h-4" />
            <span>Guía Despliegue</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / Mode Switch */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenDeploymentGuide}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Descargar código en ZIP gratis"
          >
            <span>Descargar ZIP Gratis</span>
          </button>
          {currentView === 'student' ? (
            <button
              onClick={() => onViewChange('teacher')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Panel Profesora</span>
              {pendingBookingsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-500 text-white rounded">
                  {pendingBookingsCount}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => onViewChange('student')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-600" />
              <span>Ver como Alumno</span>
            </button>
          )}

          <button
            onClick={() => {
              if (currentView !== 'student') onViewChange('student');
              setTimeout(() => onScrollToSection('reservar'), 100);
            }}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            Reservar Ahora
          </button>
        </div>
      </div>
    </header>
  );
};
