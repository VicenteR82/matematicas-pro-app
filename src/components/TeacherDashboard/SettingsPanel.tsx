import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  CheckCircle2, 
  Video, 
  DollarSign, 
  CreditCard, 
  Building, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Lock, 
  Camera, 
  Upload, 
  Trash2, 
  Plus, 
  Sparkles,
  Users
} from 'lucide-react';
import { TeacherProfile } from '../../types';

interface SettingsPanelProps {
  teacher: TeacherProfile;
  teachers?: TeacherProfile[];
  onSelectTeacher?: (id: string) => void;
  onAddTeacher?: (newTeacher: TeacherProfile) => void;
  onDeleteTeacher?: (id: string) => void;
  onSaveTeacher: (updated: TeacherProfile) => void;
}

const PRESET_AVATARS = [
  { label: 'Retrato Femenino (Elena)', url: '/src/assets/images/math_teacher_portrait_1792284327362.jpg' },
  { label: 'Profesora Universitaria', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
  { label: 'Profesor de Ciencias', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400' },
  { label: 'Tutora Especialista', url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=400' },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  teacher,
  teachers = [],
  onSelectTeacher,
  onAddTeacher,
  onDeleteTeacher,
  onSaveTeacher,
}) => {
  const [formData, setFormData] = useState<TeacherProfile>(teacher);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newSlotInput, setNewSlotInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if selected teacher changes from parent
  useEffect(() => {
    setFormData(teacher);
  }, [teacher]);

  const handleTextChange = (field: keyof TeacherProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Por favor selecciona una imagen de menos de 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleTextChange('avatarUrl', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBankChange = (field: keyof TeacherProfile['bankDetails'], value: string) => {
    setFormData(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value,
      },
    }));
    setSavedSuccess(false);
  };

  const handleAddSlot = () => {
    if (!newSlotInput.trim() || formData.timeSlots.includes(newSlotInput.trim())) return;
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, newSlotInput.trim()].sort(),
    }));
    setNewSlotInput('');
  };

  const handleRemoveSlot = (slotToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter(s => s !== slotToRemove),
    }));
  };

  const handleToggleDay = (dayNum: number) => {
    setFormData(prev => {
      const exists = prev.workingDays.includes(dayNum);
      const updated = exists
        ? prev.workingDays.filter(d => d !== dayNum)
        : [...prev.workingDays, dayNum].sort();
      return { ...prev, workingDays: updated };
    });
  };

  const handleCreateNewTeacher = () => {
    if (!onAddTeacher) return;
    const newId = `teacher-${Date.now()}`;
    const newDocente: TeacherProfile = {
      id: newId,
      name: 'Nueva Docente',
      title: 'Docente Especialista',
      degree: 'Licenciada en Educación / Matemáticas',
      bio: 'Especialista en acompañamiento académico personalizado y preparación para exámenes.',
      avatarUrl: '/src/assets/images/math_teacher_portrait_1792284327362.jpg',
      experienceYears: 5,
      studentsCount: 120,
      rating: 5.0,
      hourlyRate: formData.hourlyRate || 80000,
      currency: formData.currency || 'PYG',
      currencySymbol: formData.currencySymbol || 'Gs.',
      phoneWhatsApp: '+595981000000',
      email: 'docente@ejemplo.com',
      preferredPlatform: 'teams',
      meetLinkDefault: 'https://teams.microsoft.com/l/meetup-join/sample',
      inPersonAddress: formData.inPersonAddress || 'Aula en Asunción',
      allowOnline: true,
      allowInPerson: true,
      timeSlots: [
        '08:00 - 09:00',
        '09:15 - 10:15',
        '10:30 - 11:30',
        '14:00 - 15:00',
        '15:15 - 16:15',
      ],
      workingDays: [1, 2, 3, 4, 5],
      bankDetails: { ...formData.bankDetails },
    };
    onAddTeacher(newDocente);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTeacher(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const daysMap = [
    { num: 1, name: 'Lun' },
    { num: 2, name: 'Mar' },
    { num: 3, name: 'Mié' },
    { num: 4, name: 'Jue' },
    { num: 5, name: 'Vie' },
    { num: 6, name: 'Sáb' },
    { num: 0, name: 'Dom' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-150">
      
      {/* Multi-Teacher Management Selector Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Docentes Registrados ({teachers.length > 0 ? teachers.length : 1})
              </h4>
              <p className="text-[11px] text-slate-500">
                Selecciona qué docente deseas configurar o agrega nuevos profesores al plantel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onAddTeacher && (
              <button
                type="button"
                onClick={handleCreateNewTeacher}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Agregar Docente</span>
              </button>
            )}

            {teachers.length > 1 && onDeleteTeacher && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Eliminar al docente ${formData.name}? Esta acción no se puede deshacer.`)) {
                    onDeleteTeacher(formData.id);
                  }
                }}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Eliminar este docente"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Eliminar</span>
              </button>
            )}
          </div>
        </div>

        {/* Teacher list pills */}
        {teachers.length > 1 && onSelectTeacher && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {teachers.map((t) => {
              const isCurrent = t.id === formData.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectTeacher(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-300 shrink-0">
                    <img
                      src={t.avatarUrl || '/src/assets/images/math_teacher_portrait_1792284327362.jpg'}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <span>{t.name}</span>
                  {isCurrent && <span className="text-[10px] bg-indigo-500 px-1 rounded">Editando</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Header bar with save button */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Configuración de {formData.name}
          </h3>
          <p className="text-xs text-slate-500">
            Ajusta los datos del perfil, foto, tarifas y enlaces de reunión para este docente.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardado con éxito</span>
            </div>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Datos Personales y Docentes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">Perfil y Fotografía del Docente</h4>
          </div>

          {/* Interactive Photo Uploader */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Fotografía de Perfil del Docente
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500/40 bg-slate-200 shadow-xs shrink-0">
                <img
                  src={formData.avatarUrl || '/src/assets/images/math_teacher_portrait_1792284327362.jpg'}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="flex-1 space-y-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Subir Foto desde mi Dispositivo</span>
                </button>
                <p className="text-[10px] text-slate-500">
                  Formatos JPG o PNG (máx. 3MB). Se actualizará al instante en el sitio.
                </p>
              </div>
            </div>

            {/* URL or presets */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
              <label className="block text-[11px] font-medium text-slate-600">
                O ingresar URL de imagen externa:
              </label>
              <input
                type="url"
                value={formData.avatarUrl || ''}
                onChange={(e) => handleTextChange('avatarUrl', e.target.value)}
                placeholder="https://ejemplo.com/mi-foto.jpg"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-mono"
              />

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400">Predefinidos:</span>
                {PRESET_AVATARS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTextChange('avatarUrl', p.url)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-200 hover:bg-indigo-100 hover:text-indigo-700 text-slate-700 font-medium cursor-pointer transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nombre Completo del Docente</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleTextChange('name', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Título Profesional</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTextChange('title', e.target.value)}
              placeholder="Ej: Licenciada en Ciencias Matemáticas & Docente"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Especialidad / Titulación Detallada</label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => handleTextChange('degree', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Biografía / Presentación Corta</label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => handleTextChange('bio', e.target.value)}
              placeholder="Breve reseña sobre experiencia y método de enseñanza..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono WhatsApp</label>
              <input
                type="text"
                value={formData.phoneWhatsApp}
                onChange={(e) => handleTextChange('phoneWhatsApp', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email de Contacto</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleTextChange('email', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Plataforma Virtual y Presencial */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Plataforma de Videollamada
              </label>
              <select
                value={formData.preferredPlatform || 'teams'}
                onChange={(e) => handleTextChange('preferredPlatform', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="teams">Microsoft Teams</option>
                <option value="meet">Google Meet</option>
                <option value="zoom">Zoom</option>
                <option value="other">Otra sala personalizada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Modalidades Disponibles
              </label>
              <div className="flex gap-2 pt-1 text-xs">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowOnline ?? true}
                    onChange={(e) => handleTextChange('allowOnline', e.target.checked)}
                    className="text-indigo-600 rounded"
                  />
                  <span>Online</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer ml-2">
                  <input
                    type="checkbox"
                    checked={formData.allowInPerson ?? true}
                    onChange={(e) => handleTextChange('allowInPerson', e.target.checked)}
                    className="text-indigo-600 rounded"
                  />
                  <span>Presencial</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Enlace de la Sala Virtual ({formData.preferredPlatform === 'teams' ? 'Microsoft Teams' : formData.preferredPlatform === 'zoom' ? 'Zoom' : 'Google Meet'})
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.meetLinkDefault}
                onChange={(e) => handleTextChange('meetLinkDefault', e.target.value)}
                placeholder="https://teams.microsoft.com/l/meetup-join/..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono text-indigo-700"
                required
              />
              <Video className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Dirección para Clases Presenciales
            </label>
            <input
              type="text"
              value={formData.inPersonAddress || ''}
              onChange={(e) => handleTextChange('inPersonAddress', e.target.value)}
              placeholder="Ej: Aula particular: Calle Palma 450 casi 14 de Mayo, Asunción"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Si el alumno elige clase presencial, esta dirección se incluirá en el recordatorio de WhatsApp.
            </p>
          </div>
        </div>

        {/* 2. Tarifas y Moneda */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="w-4 h-4 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">Tarifas & Moneda</h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Precio por Hora Base</label>
              <input
                type="number"
                min="1000"
                max="2000000"
                step="5000"
                value={formData.hourlyRate}
                onChange={(e) => handleTextChange('hourlyRate', Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Moneda Principal</label>
              <select
                value={formData.currency}
                onChange={(e) => {
                  const curr = e.target.value;
                  const symbolMap: Record<string, string> = {
                    PYG: 'Gs.',
                    USD: '$',
                    EUR: '€',
                    ARS: '$',
                    BRL: 'R$',
                    MXN: '$',
                    COP: '$',
                    CLP: '$',
                  };
                  setFormData(prev => ({
                    ...prev,
                    currency: curr,
                    currencySymbol: symbolMap[curr] || 'Gs.',
                  }));
                }}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold"
              >
                <option value="PYG">🇵🇾 PYG (Gs.) Guaraní Paraguayo</option>
                <option value="USD">💵 USD ($) Dólares</option>
                <option value="ARS">🇦🇷 ARS ($) Pesos Argentinos</option>
                <option value="BRL">🇧🇷 BRL (R$) Reales Brasileños</option>
                <option value="EUR">🇪🇺 EUR (€) Euros</option>
                <option value="MXN">🇲🇽 MXN ($) Pesos Mexicanos</option>
              </select>
            </div>
          </div>

          {/* Días laborables */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Días de Atención a Clases:
            </label>
            <div className="flex gap-2">
              {daysMap.map(d => {
                const isSelected = formData.workingDays.includes(d.num);
                return (
                  <button
                    key={d.num}
                    type="button"
                    onClick={() => handleToggleDay(d.num)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {d.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots manager */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Horarios Diarios Disponibles ({formData.timeSlots.length} franjas)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2 max-h-32 overflow-y-auto p-1">
              {formData.timeSlots.map(slot => (
                <span
                  key={slot}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-mono"
                >
                  <span>{slot}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(slot)}
                    className="text-slate-400 hover:text-red-500 font-bold ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSlotInput}
                onChange={(e) => setNewSlotInput(e.target.value)}
                placeholder="Ej: 14:00 - 15:00"
                className="w-48 px-3 py-1.5 text-xs border border-slate-300 rounded font-mono"
              />
              <button
                type="button"
                onClick={handleAddSlot}
                className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 cursor-pointer"
              >
                Añadir Horario
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Pasarelas de Pago Integradas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <CreditCard className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm font-bold text-slate-900">
            Integración de Pagos (Stripe, Mercado Pago, Bizum & Transferencias)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stripe Config */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">1. Stripe Checkout</span>
              <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                Tarjetas Internacionales
              </span>
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">Clave Pública (Publishable Key)</label>
              <input
                type="text"
                value={formData.stripePublicKey || ''}
                onChange={(e) => handleTextChange('stripePublicKey', e.target.value)}
                placeholder="pk_test_..."
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Permite recibir cobros instantáneos con tarjetas Visa, MasterCard y American Express de cualquier país.
            </p>
          </div>

          {/* Mercado Pago Config */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">2. Mercado Pago</span>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Latinoamérica
              </span>
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">Public Key de Mercado Pago</label>
              <input
                type="text"
                value={formData.mercadoPagoPublicKey || ''}
                onChange={(e) => handleTextChange('mercadoPagoPublicKey', e.target.value)}
                placeholder="TEST-..."
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Ideal para cobros en Argentina, México, Colombia, Chile, Uruguay y Perú.
            </p>
          </div>
        </div>

        {/* Bank & Bizum Details */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-700" />
            <h5 className="text-xs font-bold text-emerald-950">
              3. Datos para Transferencia Bancaria Directa / Bizum / SPEI
            </h5>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">Nombre del Banco / Plataforma</label>
              <input
                type="text"
                value={formData.bankDetails.bankName}
                onChange={(e) => handleBankChange('bankName', e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 mb-1">Titular de la Cuenta</label>
              <input
                type="text"
                value={formData.bankDetails.accountHolder}
                onChange={(e) => handleBankChange('accountHolder', e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 mb-1">Bizum / Alias / CLABE</label>
              <input
                type="text"
                value={formData.bankDetails.routingCode}
                onChange={(e) => handleBankChange('routingCode', e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-600 mb-1">Número de Cuenta / IBAN / CBU</label>
            <input
              type="text"
              value={formData.bankDetails.accountNumber}
              onChange={(e) => handleBankChange('accountNumber', e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-600 mb-1">Instrucciones para el Alumno</label>
            <input
              type="text"
              value={formData.bankDetails.instructions}
              onChange={(e) => handleBankChange('instructions', e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
            />
          </div>
        </div>
      </div>

    </form>
  );
};
