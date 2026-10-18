import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PACKAGES, 
  INITIAL_TEACHER_PROFILE, 
  INITIAL_WHATSAPP_TEMPLATES, 
  INITIAL_BOOKINGS 
} from './data/initialData';
import { Booking, BookingStatus, ClassPackage, TeacherProfile, WhatsAppTemplate } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PackagesSection } from './components/PackagesSection';
import { WhatsAppAutomationExplainer } from './components/WhatsAppAutomationExplainer';
import { BookingWizard } from './components/BookingFlow/BookingWizard';
import { TeacherDashboard } from './components/TeacherDashboard/TeacherDashboard';
import { DeploymentGuideModal } from './components/DeploymentGuide/DeploymentGuideModal';
import { Footer } from './components/Footer';

const STORAGE_KEYS = {
  TEACHER: 'math_pro_teacher_profile',
  BOOKINGS: 'math_pro_bookings_list',
  TEMPLATES: 'math_pro_whatsapp_templates',
};

export default function App() {
  // Load persistent state from localStorage with fallbacks
  const [teacher, setTeacher] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currency === 'PYG' && parsed.name.includes('Vicente')) {
          return parsed;
        }
      }
      return INITIAL_TEACHER_PROFILE;
    } catch {
      return INITIAL_TEACHER_PROFILE;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].currency === 'Gs.') {
          return parsed;
        }
      }
      return INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      return saved ? JSON.parse(saved) : INITIAL_WHATSAPP_TEMPLATES;
    } catch {
      return INITIAL_WHATSAPP_TEMPLATES;
    }
  });

  const [packages] = useState<ClassPackage[]>(INITIAL_PACKAGES);
  const [currentView, setCurrentView] = useState<'student' | 'teacher'>('student');
  const [isDeploymentGuideOpen, setIsDeploymentGuideOpen] = useState(false);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<ClassPackage | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(teacher));
    } catch (err) {
      console.error(err);
    }
  }, [teacher]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (err) {
      console.error(err);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
    } catch (err) {
      console.error(err);
    }
  }, [templates]);

  // Handlers
  const handleBookingCreated = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const handleUpdateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const handleUpdateTemplate = (templateId: string, newContent: string) => {
    setTemplates(prev =>
      prev.map(t => (t.id === templateId ? { ...t, content: newContent } : t))
    );
  };

  const handleSaveTeacher = (updatedTeacher: TeacherProfile) => {
    setTeacher(updatedTeacher);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPackage = (pkg: ClassPackage) => {
    setSelectedPackageForBooking(pkg);
    handleScrollToSection('reservar');
  };

  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [teacherPin, setTeacherPin] = useState(() => {
    return localStorage.getItem('math_pro_teacher_pin') || '1234';
  });

  const handleOpenTeacherView = () => {
    if (isTeacherAuthenticated) {
      setCurrentView('teacher');
    } else {
      setShowPinModal(true);
      setPinInput('');
      setPinError(false);
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === teacherPin) {
      setIsTeacherAuthenticated(true);
      setShowPinModal(false);
      setCurrentView('teacher');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const confirmationTemplate = templates.find(t => t.id === 'tpl-confirmation') || templates[0];
  const pendingBookingsCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Header */}
      <Header
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'teacher') {
            handleOpenTeacherView();
          } else {
            setCurrentView('student');
          }
        }}
        onOpenDeploymentGuide={() => setIsDeploymentGuideOpen(true)}
        onScrollToSection={handleScrollToSection}
        pendingBookingsCount={pendingBookingsCount}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {currentView === 'student' ? (
          <div>
            {/* Hero Section */}
            <HeroSection
              teacher={teacher}
              onStartBooking={() => handleScrollToSection('reservar')}
              onExploreFeatures={() => handleScrollToSection('recordatorios')}
              onViewTeacherDashboard={handleOpenTeacherView}
            />

            {/* Packages & Pricing Section */}
            <PackagesSection
              packages={packages}
              currencySymbol={teacher.currencySymbol}
              onSelectPackage={handleSelectPackage}
            />

            {/* Interactive WhatsApp Automation and Reminders Explainer */}
            <WhatsAppAutomationExplainer />

            {/* Multi-step Booking Wizard */}
            <BookingWizard
              packages={packages}
              teacher={teacher}
              existingBookings={bookings}
              confirmationTemplate={confirmationTemplate}
              onBookingCreated={handleBookingCreated}
              selectedPackageFromLanding={selectedPackageForBooking}
            />
          </div>
        ) : (
          <TeacherDashboard
            teacher={teacher}
            bookings={bookings}
            templates={templates}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onUpdateTemplate={handleUpdateTemplate}
            onSaveTeacher={handleSaveTeacher}
            onAddNewManualBooking={() => {
              setCurrentView('student');
              setTimeout(() => handleScrollToSection('reservar'), 100);
            }}
          />
        )}
      </main>

      {/* Deployment Guide Modal (Vercel & Railway) */}
      <DeploymentGuideModal
        isOpen={isDeploymentGuideOpen}
        onClose={() => setIsDeploymentGuideOpen(false)}
      />

      {/* Footer */}
      <Footer
        teacher={teacher}
        onOpenDeploymentGuide={() => setIsDeploymentGuideOpen(true)}
        onSwitchView={(view) => {
          if (view === 'teacher') handleOpenTeacherView();
          else setCurrentView('student');
        }}
      />

      {/* Teacher PIN Login Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Acceso al Panel Docente</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ingresa el PIN de seguridad de la profesora para ver ingresos, reservas y alumnos.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={8}
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="PIN de acceso"
                  className="w-full text-center tracking-widest text-lg font-mono py-2.5 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
                {pinError ? (
                  <p className="text-[11px] text-red-600 text-center mt-1.5 font-medium">
                    PIN incorrecto. Intenta de nuevo.
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 text-center mt-1.5">
                    PIN predeterminado: <strong className="text-slate-600">1234</strong>
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="w-1/2 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
