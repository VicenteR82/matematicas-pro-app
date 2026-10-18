import React from 'react';
import { Rocket, ShieldCheck, Heart } from 'lucide-react';
import { TeacherProfile } from '../types';

interface FooterProps {
  teacher: TeacherProfile;
  onOpenDeploymentGuide: () => void;
  onSwitchView: (view: 'student' | 'teacher') => void;
}

export const Footer: React.FC<FooterProps> = ({
  teacher,
  onOpenDeploymentGuide,
  onSwitchView,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-100">
          
          <div className="md:col-span-2 space-y-2">
            <p className="text-sm font-bold text-slate-900 tracking-tight">
              {teacher.name} · Matemáticas Universitarias & Bachillerato
            </p>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              Plataforma para reserva de clases particulares, recordatorios directos por WhatsApp y pagos seguros para estudiantes de secundaria, bachillerato y universidad.
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              Contacto docente: {teacher.phoneWhatsApp} · {teacher.email}
            </p>
          </div>

          <div>
            <p className="font-bold text-slate-900 text-xs mb-3">Plataforma</p>
            <ul className="space-y-2 text-slate-500">
              <li>
                <button
                  onClick={() => onSwitchView('student')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Vista Estudiante (Reservar)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSwitchView('teacher')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Panel de la Profesora (Admin)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDeploymentGuide}
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Guía para Desplegar en Vercel/Railway</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-slate-900 text-xs mb-3">Seguridad & Pagos</p>
            <div className="space-y-2 text-slate-500 text-[11px]">
              <p>💳 Stripe · Pagos seguros con tarjeta</p>
              <p>💙 Mercado Pago · Checkout seguro</p>
              <p>🏦 Transferencia directa y Bizum</p>
              <p>🔒 Encriptación SSL 256 bits</p>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} {teacher.name}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-3">
            <span>Diseñado para educación y matemáticas</span>
            <span aria-hidden="true">·</span>
            <span>Listo para producción en Vercel o Railway</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
