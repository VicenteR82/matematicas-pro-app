import React, { useState } from 'react';
import { MessageSquare, Bell, CreditCard, Send, CheckCheck, Smartphone, Sparkles, ExternalLink } from 'lucide-react';
import { openWhatsAppChat } from '../utils/whatsapp';

export const WhatsAppAutomationExplainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'confirmation' | '24h' | '1h' | 'post'>('confirmation');

  const messages = {
    confirmation: {
      title: 'Confirmación Inmediata',
      timing: 'En el momento en que se confirma la reserva',
      text: `👋 ¡Hola Sofía!

Soy la Prof. Elena Morales. Tu reserva para la clase de *Cálculo Diferencial e Integral* ha sido confirmada con éxito.

📅 *Fecha:* Lunes, 19 de Octubre
⏰ *Hora:* 16:15 - 17:45
💳 *Estado del Pago:* Pagado y Aprobado ✅ ($35 USD)
💻 *Enlace de la clase (Google Meet):*
https://meet.google.com/xrq-pmts-gvd

📌 *Recomendación:* Ten a mano tu cuaderno y los ejercicios que quieras resolver. ¡Nos vemos en clase! 📐✏️`,
    },
    '24h': {
      title: 'Recordatorio 24 Horas Antes',
      timing: '1 día antes de la sesión programada',
      text: `🔔 ¡Hola Sofía!

Te recuerdo que mañana tenemos clase de *Cálculo Diferencial e Integral*.

📅 *Fecha:* Lunes, 19 de Octubre
⏰ *Horario:* 16:15 - 17:45
💻 *Sala virtual:* https://meet.google.com/xrq-pmts-gvd

Si tienes ejercicios específicos o dudas de tu guía, puedes enviarme una foto por este chat para prepararlos con antelación. ¡Que tengas un excelente día! 🚀`,
    },
    '1h': {
      title: 'Recordatorio 1 Hora Antes',
      timing: '60 minutos antes del inicio de la clase',
      text: `⏰ ¡Sofía, tu clase de matemáticas comienza en 1 hora!

Nos conectamos a las *16:15* para tu sesión de *Cálculo*.

👉 *Entra directamente aquí:*
https://meet.google.com/xrq-pmts-gvd

¡Pizarra lista! Nos vemos en unos minutos. 📚`,
    },
    post: {
      title: 'Resumen y Apuntes Post-Clase',
      timing: '15 minutos después de finalizar la clase',
      text: `🎉 ¡Excelente trabajo hoy en la clase, Sofía!

Has entendido a la perfección la regla de la cadena y las derivadas implícitas.

📎 Te dejo el enlace con el PDF de la pizarra y 3 ejercicios clave para practicar antes del examen:
https://drive.google.com/drive/folders/ejemplo-matematicas

¡Seguimos con todo para tu examen! 🌟`,
    },
  };

  const handleTestWhatsApp = () => {
    // Allows user to test the real WhatsApp trigger
    openWhatsAppChat('+34612345678', messages[activeTab].text);
  };

  return (
    <section id="recordatorios" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-2">
            Recordatorios Automáticos por WhatsApp & Pagos
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Cero faltas y cero olvidos con notificaciones inteligentes
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Tus estudiantes reciben la confirmación, el enlace de la videollamada y los recordatorios en la app que más usan: WhatsApp.
          </p>
        </div>

        {/* 2-Column interactive demo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Left: Interactive triggers explanation */}
          <div className="lg:col-span-6 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Flujo de Recordatorios Programados:
            </p>

            <button
              onClick={() => setActiveTab('confirmation')}
              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                activeTab === 'confirmation'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">1. Confirmación de Reserva</span>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  Inmediato
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Se envía apenas se completa el pago o se reserva la clase, con enlace de Google Meet y código de reserva.
              </p>
            </button>

            <button
              onClick={() => setActiveTab('24h')}
              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                activeTab === '24h'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">2. Recordatorio 24 Horas Antes</span>
                <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  24h Previas
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Avisa al alumno para preparar material, dudas puntuales y confirmar disponibilidad de su horario.
              </p>
            </button>

            <button
              onClick={() => setActiveTab('1h')}
              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                activeTab === '1h'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">3. Recordatorio 1 Hora Antes</span>
                <span className="text-[11px] font-medium text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                  1h Previa
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Botón directo de Google Meet en su WhatsApp para que se conecte a tiempo sin buscar correos perdidos.
              </p>
            </button>

            <button
              onClick={() => setActiveTab('post')}
              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                activeTab === 'post'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">4. Apuntes & Resumen Post-Clase</span>
                <span className="text-[11px] font-medium text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                  Post-Sesión
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Envío de la pizarra digital en PDF y retroalimentación para fidelizar y asegurar la próxima reserva.
              </p>
            </button>
          </div>

          {/* Right: Phone Simulator showing the real WhatsApp message */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-sm rounded-[2.5rem] border-4 border-slate-800 bg-slate-900 p-2.5 shadow-2xl">
              {/* Phone screen container */}
              <div className="rounded-[2rem] bg-[#efeae2] overflow-hidden flex flex-col h-[490px]">
                
                {/* WhatsApp Chat Header */}
                <div className="bg-[#075e54] text-white p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                      EM
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">Prof. Elena Morales</p>
                      <p className="text-[10px] text-emerald-200">En línea · Matemáticas</p>
                    </div>
                  </div>
                  <MessageSquare className="w-4 h-4 text-emerald-200" />
                </div>

                {/* Chat Body */}
                <div 
                  className="flex-1 p-3.5 overflow-y-auto space-y-2.5"
                  style={{
                    backgroundImage: `radial-gradient(#075e54 0.5px, transparent 0.5px)`,
                    backgroundSize: '16px 16px',
                    opacity: 0.95
                  }}
                >
                  <div className="text-center my-1">
                    <span className="text-[10px] bg-white/70 text-slate-600 px-2 py-0.5 rounded shadow-xs">
                      HOY
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm text-xs text-slate-800 max-w-[95%] space-y-1 relative">
                    <div className="whitespace-pre-line leading-relaxed text-[11px]">
                      {messages[activeTab].text}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-1">
                      <span>16:00</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Chat Footer with Test Trigger */}
                <div className="p-2 bg-[#f0f2f5] border-t border-slate-200 flex items-center gap-2">
                  <button
                    onClick={handleTestWhatsApp}
                    className="w-full py-2 bg-[#25d366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                    title="Abre WhatsApp con este mensaje preconfigurado"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Probar este mensaje en tu WhatsApp</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
