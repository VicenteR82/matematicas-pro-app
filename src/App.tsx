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
      return saved ? JSON.parse(saved) : INITIAL_TEACHER_PROFILE;
    } catch {
      return INITIAL_TEACHER_PROFILE;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
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

  const confirmationTemplate = templates.find(t => t.id === 'tpl-confirmation') || templates[0];
  const pendingBookingsCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
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
              onViewTeacherDashboard={() => setCurrentView('teacher')}
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
        onSwitchView={setCurrentView}
      />

    </div>
  );
}
