import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, Building, Copy, Check, ArrowRight } from 'lucide-react';
import { PaymentMethod, TeacherProfile } from '../../types';

interface PaymentModalProps {
  amount: number;
  currencySymbol: string;
  currency: string;
  teacher: TeacherProfile;
  studentName: string;
  onPaymentSuccess: (method: PaymentMethod, reference: string) => void;
  onCancel: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  amount,
  currencySymbol,
  currency,
  teacher,
  studentName,
  onPaymentSuccess,
  onCancel,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('stripe');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  const handleCopyBank = () => {
    navigator.clipboard.writeText(teacher.bankDetails.accountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const referenceId = `${selectedMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      onPaymentSuccess(selectedMethod, referenceId);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Pasarela de Pago Segura</h3>
            <p className="text-xs text-slate-500">
              Reserva para: <strong className="text-slate-800">{studentName}</strong>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total a Pagar</span>
            <span className="text-2xl font-black text-indigo-600 font-mono">
              {currencySymbol}{amount} {currency}
            </span>
          </div>
        </div>

        {/* Payment Methods Selector Tabs */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <button
            type="button"
            onClick={() => setSelectedMethod('stripe')}
            className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
              selectedMethod === 'stripe'
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <CreditCard className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
            <span className="text-[11px] font-semibold block leading-tight">Tarjeta / Stripe</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('mercadopago')}
            className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
              selectedMethod === 'mercadopago'
                ? 'border-blue-500 bg-blue-50/50 text-blue-900 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="w-4 h-4 mx-auto mb-1 rounded bg-blue-500 text-white text-[9px] font-black flex items-center justify-center">
              MP
            </div>
            <span className="text-[11px] font-semibold block leading-tight">Mercado Pago</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('paypal')}
            className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
              selectedMethod === 'paypal'
                ? 'border-amber-500 bg-amber-50/50 text-amber-900 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="w-4 h-4 mx-auto mb-1 text-amber-600 font-black text-xs">
              PP
            </div>
            <span className="text-[11px] font-semibold block leading-tight">PayPal</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('bank_transfer')}
            className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
              selectedMethod === 'bank_transfer'
                ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <Building className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
            <span className="text-[11px] font-semibold block leading-tight">Bizum / Transf</span>
          </button>
        </div>

        {/* Selected Form Content */}
        <form onSubmit={handleSubmit}>
          {selectedMethod === 'stripe' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Número de Tarjeta (Débito o Crédito)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="4000 1234 5678 9010"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Vencimiento (MM/AA)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="MM/AA"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    CVC / Código de Seguridad
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Encriptación SSL 256-bit mediante Stripe Payments. No se almacenan datos confidenciales.</span>
              </div>
            </div>
          )}

          {selectedMethod === 'mercadopago' && (
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 mb-6 text-xs text-slate-700 space-y-3">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <span>Checkout Oficial Mercado Pago</span>
              </div>
              <p>
                Al confirmar, se generará una orden protegida con Mercado Pago (tarjetas locales, saldo en cuenta, o pago en efectivo vía OXXO / Rapipago / Efecty).
              </p>
              <div className="bg-white p-3 rounded-lg border border-blue-100 flex items-center justify-between font-mono text-xs">
                <span>Modo de Integración:</span>
                <span className="text-emerald-700 font-semibold">Listo para checkout instantáneo</span>
              </div>
            </div>
          )}

          {selectedMethod === 'paypal' && (
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 mb-6 text-xs text-slate-700 space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <span>PayPal Express Checkout</span>
              </div>
              <p>
                Paga de forma rápida con tu cuenta de PayPal o con tarjetas internacionales sin compartir tu información financiera.
              </p>
              <div className="text-[11px] text-amber-800">
                Protección al comprador de PayPal activa para clases y servicios educativos.
              </div>
            </div>
          )}

          {selectedMethod === 'bank_transfer' && (
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 mb-6 text-xs text-slate-800 space-y-3">
              <div className="flex items-center justify-between font-bold text-emerald-950">
                <span>{teacher.bankDetails.bankName}</span>
                <span className="text-emerald-700">{teacher.bankDetails.routingCode}</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-emerald-100 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Titular:</span>
                  <span className="font-semibold">{teacher.bankDetails.accountHolder}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Cuenta / IBAN / CBU:</span>
                  <div className="flex items-center gap-1.5 font-mono font-semibold">
                    <span>{teacher.bankDetails.accountNumber}</span>
                    <button
                      type="button"
                      onClick={handleCopyBank}
                      className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                      title="Copiar cuenta"
                    >
                      {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-tight">
                {teacher.bankDetails.instructions}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Volver
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Procesando Pago Seguro...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pagar {currencySymbol}{amount} y Confirmar</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
