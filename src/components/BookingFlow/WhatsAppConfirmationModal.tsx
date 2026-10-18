import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, Calendar, Download, Copy, Check, ExternalLink, X } from 'lucide-react';
import { Booking } from '../../types';
import { formatWhatsAppMessage, openWhatsAppChat } from '../../utils/whatsapp';
import { generateICSFile } from '../../utils/ics';

interface WhatsAppConfirmationModalProps {
  booking: Booking;
  templateContent: string;
  onClose: () => void;
}

export const WhatsAppConfirmationModal: React.FC<WhatsAppConfirmationModalProps> = ({
  booking,
  templateContent,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const formattedMessage = formatWhatsAppMessage(templateContent, booking);

  const handleOpenWhatsApp = () => {
    openWhatsAppChat(booking.studentPhone, formattedMessage);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCalendar = () => {
    generateICSFile(booking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            ¡Clase Reservada con Éxito!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Tu código de reserva es <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{booking.bookingCode}</span>
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-6 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200/60">
            <div>
              <span className="text-slate-400 block">Asignatura:</span>
              <span className="font-semibold text-slate-800">{booking.subject}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Plan:</span>
              <span className="font-semibold text-slate-800">{booking.packageName}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-slate-400 block">Fecha y Hora:</span>
              <span className="font-semibold text-slate-800">{booking.date} · {booking.timeSlot}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Estudiante / WhatsApp:</span>
              <span className="font-semibold text-slate-800">{booking.studentName} ({booking.studentPhone})</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Preview Box */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#075e54]">
              <MessageSquare className="w-4 h-4 text-[#25d366]" />
              <span>Recordatorio Automático por WhatsApp</span>
            </div>
            <button
              onClick={handleCopyMessage}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar Texto</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#e7f3ee] border border-[#c1e2d4] rounded-xl p-4 text-xs text-slate-800 whitespace-pre-line font-normal leading-relaxed max-h-48 overflow-y-auto">
            {formattedMessage}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-3.5 bg-[#25d366] hover:bg-[#20ba59] active:scale-[0.99] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 fill-white" />
            <span>Abrir en WhatsApp y Guardar Recordatorio</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadCalendar}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>Añadir a mi Calendario (.ics)</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Cerrar y Finalizar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
