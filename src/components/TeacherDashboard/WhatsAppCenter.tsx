import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Clock, Smartphone, Settings, Sparkles, Key, AlertCircle, RefreshCw } from 'lucide-react';
import { WhatsAppTemplate, Booking } from '../../types';
import { openWhatsAppChat } from '../../utils/whatsapp';

interface WhatsAppCenterProps {
  templates: WhatsAppTemplate[];
  onUpdateTemplate: (templateId: string, newContent: string) => void;
  bookings: Booking[];
}

export const WhatsAppCenter: React.FC<WhatsAppCenterProps> = ({
  templates,
  onUpdateTemplate,
  bookings,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || 'tpl-confirmation');
  const [editedContent, setEditedContent] = useState<string>(templates[0]?.content || '');
  const [testPhoneNumber, setTestPhoneNumber] = useState('+34612345678');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // API credentials settings toggle
  const [apiProvider, setApiProvider] = useState<'wame' | 'meta_cloud' | 'twilio'>('wame');
  const [metaToken, setMetaToken] = useState('');
  const [metaPhoneId, setMetaPhoneId] = useState('');
  const [twilioAccountSid, setTwilioAccountSid] = useState('');
  const [twilioAuthToken, setTwilioAuthToken] = useState('');

  const currentTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  const handleSelectTemplate = (tpl: WhatsAppTemplate) => {
    setSelectedTemplateId(tpl.id);
    setEditedContent(tpl.content);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    onUpdateTemplate(selectedTemplateId, editedContent);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSendTest = () => {
    // Generate sample preview
    const sampleText = editedContent
      .replace(/{student_name}/g, 'Carlos Mendoza')
      .replace(/{subject}/g, 'Cálculo Diferencial e Integral')
      .replace(/{package_name}/g, 'Sesión Intensiva (90 min)')
      .replace(/{date}/g, 'Lunes, 19 de Octubre de 2026')
      .replace(/{time_slot}/g, '16:15 - 17:45')
      .replace(/{amount}/g, '35')
      .replace(/{currency}/g, 'USD')
      .replace(/{payment_status}/g, 'Pagado y Aprobado ✅')
      .replace(/{meet_link}/g, 'https://meet.google.com/xrq-pmts-gvd')
      .replace(/{booking_code}/g, 'MAT-7842');

    openWhatsAppChat(testPhoneNumber, sampleText);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      
      {/* Intro info box */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-emerald-950">
                Centro de Automatización & Recordatorios de WhatsApp
              </h3>
            </div>
            <p className="text-xs text-emerald-800 max-w-2xl leading-relaxed">
              Configura las plantillas automáticas que se envían a tus alumnos de matemáticas. 
              El sistema soporta tanto <strong>enlaces wa.me directos sin costo</strong> (1 clic desde el navegador o móvil) 
              como integración desatendida con <strong>Meta WhatsApp Cloud API</strong> o <strong>Twilio</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg">
              4 Plantillas Activas
            </span>
          </div>
        </div>
      </div>

      {/* Main editor split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Template Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Plantillas Disponibles:
          </p>
          
          {templates.map((tpl) => {
            const isSelected = tpl.id === selectedTemplateId;
            return (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-600/10 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{tpl.name}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{tpl.title}</p>
                <span className="inline-block mt-2 text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  Disparador: {tpl.trigger}
                </span>
              </button>
            );
          })}

          {/* Variables Reference Box */}
          <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-4 text-xs space-y-1.5 text-slate-600">
            <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
              Variables Dinámicas Permitidas:
            </p>
            <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-700">
              <span>{'{student_name}'}</span>
              <span>{'{subject}'}</span>
              <span>{'{date}'}</span>
              <span>{'{time_slot}'}</span>
              <span>{'{meet_link}'}</span>
              <span>{'{amount}'}</span>
              <span>{'{payment_status}'}</span>
              <span>{'{booking_code}'}</span>
            </div>
          </div>
        </div>

        {/* Right: Template Content Editor & Test Trigger */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">{currentTemplate.name}</h4>
              <p className="text-xs text-slate-500">{currentTemplate.title}</p>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Plantilla Guardada!</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Cuerpo del Mensaje de WhatsApp (Soporta negritas con *texto* y emojis)
            </label>
            <textarea
              value={editedContent}
              onChange={(e) => {
                setEditedContent(e.target.value);
                setSaveSuccess(false);
              }}
              rows={11}
              className="w-full p-3.5 text-xs sm:text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 leading-relaxed bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Guardar Cambios en Plantilla
            </button>

            {/* Test Trigger Input */}
            <div className="flex items-center gap-2">
              <input
                type="tel"
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value)}
                placeholder="+34612345678"
                className="w-40 px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
              <button
                onClick={handleSendTest}
                className="px-4 py-2 bg-[#25d366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Abre WhatsApp Web o tu app con el mensaje de prueba renderizado"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Probar Envío</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* WhatsApp Cloud API & Twilio Settings Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            Método de Entrega de WhatsApp
          </h4>
          <p className="text-xs text-slate-500">
            Elige si prefieres disparar los mensajes con un clic en tu navegador/móvil (100% gratuito) o a través de una API desatendida.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setApiProvider('wame')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              apiProvider === 'wame'
                ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">1. wa.me Directo</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                Gratis
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Abre la app oficial de WhatsApp en tu teléfono o WhatsApp Web con el mensaje pre-cargado listo para enviar. Sin costes mensuales.
            </p>
          </button>

          <button
            onClick={() => setApiProvider('meta_cloud')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              apiProvider === 'meta_cloud'
                ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">2. Meta Cloud API</span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                Oficial
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Envío automatizado en segundo plano a través de Facebook Developers & WhatsApp Business Platform.
            </p>
          </button>

          <button
            onClick={() => setApiProvider('twilio')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              apiProvider === 'twilio'
                ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">3. Twilio WhatsApp</span>
              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                Servidor
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Envío programable con cron jobs en servidor (Railway, Render o servidor dedicado).
            </p>
          </button>
        </div>

        {apiProvider === 'meta_cloud' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h5 className="text-xs font-bold text-slate-800">Credenciales Meta Cloud API</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">WhatsApp Phone Number ID</label>
                <input
                  type="text"
                  value={metaPhoneId}
                  onChange={(e) => setMetaPhoneId(e.target.value)}
                  placeholder="Ej: 104829104928"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">System User Access Token</label>
                <input
                  type="password"
                  value={metaToken}
                  onChange={(e) => setMetaToken(e.target.value)}
                  placeholder="EAABw..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Las primeras 1,000 conversaciones iniciadas por el usuario al mes son gratuitas en Meta.
            </p>
          </div>
        )}

        {apiProvider === 'twilio' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h5 className="text-xs font-bold text-slate-800">Credenciales Twilio WhatsApp</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Account SID</label>
                <input
                  type="text"
                  value={twilioAccountSid}
                  onChange={(e) => setTwilioAccountSid(e.target.value)}
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Auth Token</label>
                <input
                  type="password"
                  value={twilioAuthToken}
                  onChange={(e) => setTwilioAuthToken(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
