import React, { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  MessageSquare, 
  Settings, 
  CheckCircle2, 
  Clock, 
  Video, 
  ExternalLink, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Sparkles,
  Smartphone,
  Check,
  X
} from 'lucide-react';
import { Booking, BookingStatus, TeacherProfile, WhatsAppTemplate } from '../../types';
import { WhatsAppCenter } from './WhatsAppCenter';
import { SettingsPanel } from './SettingsPanel';
import { openWhatsAppChat, formatWhatsAppMessage } from '../../utils/whatsapp';

interface TeacherDashboardProps {
  teacher: TeacherProfile;
  bookings: Booking[];
  templates: WhatsAppTemplate[];
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  onUpdateTemplate: (templateId: string, content: string) => void;
  onSaveTeacher: (updated: TeacherProfile) => void;
  onAddNewManualBooking: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  bookings,
  templates,
  onUpdateBookingStatus,
  onUpdateTemplate,
  onSaveTeacher,
  onAddNewManualBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'whatsapp' | 'settings' | 'students'>('bookings');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quick WhatsApp sender popup modal
  const [selectedBookingForWhatsApp, setSelectedBookingForWhatsApp] = useState<Booking | null>(null);
  const [selectedTemplateForDispatch, setSelectedTemplateForDispatch] = useState<string>('tpl-24h');

  // Metrics calculations
  const totalEarnings = bookings
    .filter(b => b.status === 'paid' || b.status === 'completed')
    .reduce((sum, b) => sum + b.amount, 0);

  const pendingBookingsCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
  const completedClassesCount = bookings.filter(b => b.status === 'completed').length;
  
  // Unique students count
  const uniqueStudents = Array.from(new Set(bookings.map(b => b.studentEmail)));

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch = 
      b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Codigo', 'Alumno', 'Email', 'Telefono', 'Asignatura', 'Fecha', 'Horario', 'Monto', 'Moneda', 'Estado', 'MetodoPago'];
    const rows = bookings.map(b => [
      b.bookingCode,
      `"${b.studentName}"`,
      b.studentEmail,
      b.studentPhone,
      `"${b.subject}"`,
      b.date,
      `"${b.timeSlot}"`,
      b.amount,
      b.currency,
      b.status,
      b.paymentMethod,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reservas-matematicas-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendCustomWhatsApp = () => {
    if (!selectedBookingForWhatsApp) return;
    const tpl = templates.find(t => t.id === selectedTemplateForDispatch) || templates[0];
    const text = formatWhatsAppMessage(tpl.content, selectedBookingForWhatsApp, teacher.meetLinkDefault);
    openWhatsAppChat(selectedBookingForWhatsApp.studentPhone, text);
    setSelectedBookingForWhatsApp(null);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'paid':
        return <span className="text-emerald-700 font-semibold text-xs">● Pagada</span>;
      case 'confirmed':
        return <span className="text-blue-700 font-semibold text-xs">● Confirmada</span>;
      case 'pending':
        return <span className="text-amber-700 font-semibold text-xs">● Pendiente</span>;
      case 'completed':
        return <span className="text-slate-500 font-semibold text-xs">● Finalizada</span>;
      case 'cancelled':
        return <span className="text-rose-700 font-semibold text-xs">● Cancelada</span>;
    }
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Panel de Control Docente
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">{teacher.title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Gestión de Reservas & Alumnos de Matemáticas
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={onAddNewManualBooking}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agendar Nueva Clase</span>
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Ingresos Totales</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {teacher.currencySymbol} {totalEarnings.toLocaleString('es-PY')}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Cobros por SIPAP, Tigo Money y Tarjetas</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Clases Pendientes</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {pendingBookingsCount}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Próximas sesiones en agenda</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Clases Impartidas</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {completedClassesCount}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Finalizadas con éxito</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Alumnos Activos</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {uniqueStudents.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Estudiantes en plataforma</p>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-1 bg-white p-1 rounded-xl shadow-xs">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agenda & Reservas ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>Automatizaciones WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'students'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Directorio de Alumnos</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Tarifas, Pagos & Horarios</span>
          </button>
        </div>

        {/* TAB 1: BOOKINGS LIST */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
            
            {/* Filter and search bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por alumno, materia o código..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

              {/* Status segmented control */}
              <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-lg">
                {[
                  { id: 'all', label: 'Todas' },
                  { id: 'paid', label: 'Pagadas' },
                  { id: 'confirmed', label: 'Confirmadas' },
                  { id: 'completed', label: 'Finalizadas' },
                  { id: 'cancelled', label: 'Canceladas' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                      statusFilter === tab.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Código / Alumno</th>
                    <th className="py-3 px-4">Asignatura & Plan</th>
                    <th className="py-3 px-4">Fecha & Horario</th>
                    <th className="py-3 px-4">Monto & Pago</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                        No se encontraron reservas con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Student Name & Code */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 text-xs">{b.studentName}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-mono text-indigo-700 bg-indigo-50 px-1 rounded">{b.bookingCode}</span>
                            <span>{b.studentPhone}</span>
                          </div>
                          {b.notes && (
                            <p className="text-[11px] text-slate-400 mt-1 italic line-clamp-1 max-w-xs">
                              "{b.notes}"
                            </p>
                          )}
                        </td>

                        {/* Subject */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800">{b.subject}</span>
                          <span className="block text-[11px] text-slate-500">{b.packageName}</span>
                        </td>

                        {/* Date & Time */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-mono font-medium text-slate-900">{b.date}</div>
                          <div className="text-[11px] text-slate-500">{b.timeSlot}</div>
                        </td>

                        {/* Amount & Method */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-900">
                            {teacher.currencySymbol} {b.amount.toLocaleString('es-PY')} {b.currency}
                          </span>
                          <span className="block text-[11px] text-slate-500 capitalize">
                            Vía {b.paymentMethod === 'bank_transfer' ? 'SIPAP / Billetera' : b.paymentMethod}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={b.status}
                            onChange={(e) => onUpdateBookingStatus(b.id, e.target.value as BookingStatus)}
                            className="text-xs py-1 px-2 border border-slate-200 rounded bg-white font-medium cursor-pointer"
                          >
                            <option value="paid">● Pagada</option>
                            <option value="confirmed">● Confirmada</option>
                            <option value="pending">● Pendiente</option>
                            <option value="completed">● Finalizada</option>
                            <option value="cancelled">● Cancelada</option>
                          </select>
                        </td>

                        {/* Quick Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                          {/* Send WhatsApp Button */}
                          <button
                            onClick={() => setSelectedBookingForWhatsApp(b)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            title="Enviar recordatorio por WhatsApp"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp</span>
                          </button>

                          {/* Join Google Meet Button */}
                          <a
                            href={b.meetLink || teacher.meetLinkDefault}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            title="Abrir sala de Google Meet"
                          >
                            <Video className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Entrar a Clase</span>
                          </a>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: WHATSAPP AUTOMATION CENTER */}
        {activeTab === 'whatsapp' && (
          <WhatsAppCenter
            templates={templates}
            onUpdateTemplate={onUpdateTemplate}
            bookings={bookings}
          />
        )}

        {/* TAB 3: STUDENTS DIRECTORY CRM */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Directorio de Alumnos</h3>
                <p className="text-xs text-slate-500">
                  Historial de estudiantes que han reservado clases de matemáticas contigo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueStudents.map((email) => {
                const studentBookings = bookings.filter(b => b.studentEmail === email);
                const first = studentBookings[0];
                const totalSpent = studentBookings.reduce((sum, b) => sum + b.amount, 0);

                return (
                  <div key={email} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{first.studentName}</h4>
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {studentBookings.length} {studentBookings.length === 1 ? 'clase' : 'clases'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p>📱 WhatsApp: <span className="font-mono">{first.studentPhone}</span></p>
                      <p>✉️ Email: <span>{email}</span></p>
                      <p>💰 Inversión Total: <span className="font-bold font-mono text-slate-900">{teacher.currencySymbol}{totalSpent} {teacher.currency}</span></p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                      <button
                        onClick={() => {
                          const lastBooking = studentBookings[studentBookings.length - 1];
                          const msg = `👋 ¡Hola ${first.studentName}! Soy la Prof. Elena Morales. Quería consultar cómo te sentiste con los ejercicios de la última clase y si deseas agendar tu próxima sesión.`;
                          openWhatsAppChat(first.studentPhone, msg);
                        }}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Abrir Chat WhatsApp</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS PANEL */}
        {activeTab === 'settings' && (
          <SettingsPanel
            teacher={teacher}
            onSaveTeacher={onSaveTeacher}
          />
        )}

      </div>

      {/* WhatsApp Dispatch Modal from Dashboard table */}
      {selectedBookingForWhatsApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-150 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900">Enviar Recordatorio WhatsApp</h4>
                <p className="text-xs text-slate-500">
                  Para {selectedBookingForWhatsApp.studentName} ({selectedBookingForWhatsApp.studentPhone})
                </p>
              </div>
              <button
                onClick={() => setSelectedBookingForWhatsApp(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Selecciona la plantilla de mensaje a enviar:
              </label>
              <div className="space-y-2">
                {templates.map(t => (
                  <label
                    key={t.id}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer text-xs transition-colors ${
                      selectedTemplateForDispatch === t.id
                        ? 'border-indigo-600 bg-indigo-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="templateChoice"
                      checked={selectedTemplateForDispatch === t.id}
                      onChange={() => setSelectedTemplateForDispatch(t.id)}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">{t.name}</span>
                      <span className="text-[11px] text-slate-500">{t.title}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Live Message Preview */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 whitespace-pre-line max-h-40 overflow-y-auto">
              {formatWhatsAppMessage(
                templates.find(t => t.id === selectedTemplateForDispatch)?.content || '',
                selectedBookingForWhatsApp,
                teacher.meetLinkDefault
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedBookingForWhatsApp(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={handleSendCustomWhatsApp}
                className="px-5 py-2.5 bg-[#25d366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Abrir WhatsApp y Enviar</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
