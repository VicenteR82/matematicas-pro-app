import React, { useState } from 'react';
import { 
  Rocket, 
  X, 
  Copy, 
  Check, 
  Terminal, 
  ExternalLink, 
  ShieldCheck, 
  Server, 
  Globe, 
  CheckCircle2, 
  CreditCard, 
  Smartphone,
  HelpCircle,
  FolderUp,
  Sparkles,
  Link,
  Download
} from 'lucide-react';
import { exportProjectAsZip } from '../../utils/exportProject';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'what_is_github' | 'no_code' | 'vercel' | 'current_url'>('what_is_github');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const currentAppUrl = window.location.origin;

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      await exportProjectAsZip();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const vercelJsonContent = `{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Guía de Puesta en Línea: Sin Complicaciones
              </h3>
              <p className="text-xs text-slate-500">
                Todo explicado en lenguaje sencillo para que tengas tu web funcionando sin frustraciones.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click ZIP Download Action Box */}
        <div className="my-3 p-3.5 bg-gradient-to-r from-indigo-50 via-purple-50 to-emerald-50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Descargar Proyecto en ZIP (100% Gratis)</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Obtén una copia con todos los archivos listos para abrir en tu computadora o en GitHub Desktop.
            </p>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-60"
          >
            {isDownloading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Empaquetando ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Descargar matematicas-pro.zip</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-4 shrink-0 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('what_is_github')}
            className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'what_is_github'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>¿Qué es GitHub?</span>
          </button>

          <button
            onClick={() => setActiveTab('current_url')}
            className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'current_url'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tu Enlace Ya Activo</span>
          </button>

          <button
            onClick={() => setActiveTab('no_code')}
            className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'no_code'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <FolderUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sin Código (Arrastrar)</span>
          </button>

          <button
            onClick={() => setActiveTab('vercel')}
            className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'vercel'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>Vercel Paso a Paso</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 text-xs text-slate-700 pr-1">
          
          {/* TAB 1: WHAT IS GITHUB */}
          {activeTab === 'what_is_github' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                <h4 className="font-bold text-amber-950 text-sm mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Explicación sin tecnicismos: ¿Qué es GitHub?</span>
                </h4>
                <p className="text-amber-900 leading-relaxed text-xs">
                  Piensa en <strong>GitHub</strong> exactamente como un <strong>Google Drive</strong> o <strong>Dropbox</strong>, pero pensado para guardar los archivos de una página web en lugar de fotos o documentos de Word.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <p className="font-bold text-slate-900 text-xs">📁 1. Tu "Carpeta en la Nube"</p>
                  <p className="text-slate-600 leading-relaxed">
                    Un "repositorio" en GitHub es simplemente el nombre que le dan a una <strong>carpeta en internet</strong> donde están guardados los archivos de tu app de matemáticas.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <p className="font-bold text-slate-900 text-xs">🔗 2. ¿Por qué lo pide Vercel?</p>
                  <p className="text-slate-600 leading-relaxed">
                    Porque Vercel o Railway necesitan leer esos archivos para mantener tu página web encendida las 24 horas del día. Vercel se "conecta" a tu carpeta de GitHub.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <p className="font-bold text-slate-900 text-xs">🆓 3. Es 100% Gratuito</p>
                  <p className="text-slate-600 leading-relaxed">
                    Crear una cuenta en <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold underline">github.com</a> es gratis, solo te pide tu correo y una contraseña, igual que abrir una cuenta de correo.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <p className="font-bold text-emerald-950 text-xs">
                  💡 ¿No quieres lidiar con GitHub?
                </p>
                <p className="text-emerald-900 leading-relaxed">
                  ¡No te preocupes! Tienes dos opciones mucho más fáciles:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-emerald-900">
                  <li><strong>Opción A (Ya lista):</strong> Tu aplicación <strong>ya está funcionando en internet ahora mismo</strong> en el enlace de este entorno (mira la pestaña <em>"Tu Enlace Ya Activo"</em>).</li>
                  <li><strong>Opción B (Sin comandos):</strong> Puedes subir la carpeta directamente arrastrándola con el ratón en plataformas como <strong>Netlify Drop</strong> sin escribir ningún comando en la terminal.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: CURRENT URL */}
          {activeTab === 'current_url' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-emerald-950 text-sm">
                    ¡Tu aplicación ya está en línea y funcionando ahora mismo!
                  </h4>
                </div>
                <p className="text-emerald-900 leading-relaxed text-xs">
                  Esta web ya está desplegada en servidores seguros en la nube de Google. Puedes copiar el enlace a continuación y abrirlo en tu teléfono móvil o compartírselo a tus alumnos por WhatsApp inmediatamente:
                </p>

                <div className="bg-white p-3 rounded-lg border border-emerald-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate font-mono text-xs text-slate-800">
                    <Link className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{currentAppUrl}</span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(currentAppUrl, 'app-url')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedSection === 'app-url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'app-url' ? '¡Copiado!' : 'Copiar Enlace'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <p className="font-bold text-slate-900 text-xs">¿Qué puedes hacer con este enlace?</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Enviárselo a un estudiante por WhatsApp para que agende su primera clase.</li>
                  <li>Probar cómo llega el recordatorio de WhatsApp a su celular.</li>
                  <li>Entrar al <strong>Panel de la Profesora</strong> para ver cómo se registran las reservas y pagos.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: NO CODE DRAG & DROP */}
          {activeTab === 'no_code' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4">
                <h4 className="font-bold text-indigo-950 text-sm mb-1 flex items-center gap-2">
                  <FolderUp className="w-4 h-4 text-indigo-600" />
                  <span>Método "Arrastrar y Soltar" (Sin GitHub ni comandos)</span>
                </h4>
                <p className="text-indigo-900 leading-relaxed text-xs">
                  Si no quieres usar la terminal ni aprender Git, existe una herramienta gratuita llamada <strong>Netlify Drop</strong> donde solo arrastras tu carpeta con el ratón y la web queda publicada al instante.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-xs">Pasos en 1 minuto:</h5>
                <ol className="list-decimal pl-5 space-y-2 text-slate-600">
                  <li>
                    Entra a la página gratuita: <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline">app.netlify.com/drop</a>
                  </li>
                  <li>
                    Verás un círculo grande en pantalla que dice <em>"Drag and drop your site output folder here"</em>.
                  </li>
                  <li>
                    Arrastra la carpeta <code className="bg-slate-100 font-mono px-1 rounded text-slate-800">dist</code> de tu proyecto (que es la versión compilada y lista de tu web).
                  </li>
                  <li>
                    ¡Listo! En 5 segundos Netlify te entrega un enlace público gratuito tipo <code className="bg-slate-100 font-mono px-1 rounded text-slate-800">tu-sitio.netlify.app</code> que funciona en todo el mundo.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: VERCEL WITH GITHUB STEP BY STEP */}
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  Si decides usar GitHub y Vercel (Paso a paso sin miedo)
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Para no usar la pantalla negra de la consola (terminal), puedes usar un programa visual con botones llamado <strong>GitHub Desktop</strong>:
                </p>

                <ol className="list-decimal pl-5 space-y-2 text-slate-600">
                  <li>
                    Descarga el programa gratuito <strong>GitHub Desktop</strong> desde <a href="https://desktop.github.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline">desktop.github.com</a>.
                  </li>
                  <li>
                    Inicia sesión con tu cuenta de GitHub.
                  </li>
                  <li>
                    Haz clic en <strong>"Add an Existing Repository"</strong> y selecciona la carpeta de tu proyecto.
                  </li>
                  <li>
                    Haz clic en el botón azul <strong>"Publish Repository"</strong>. ¡Eso subirá tus archivos a la nube sin tocar ningún comando!
                  </li>
                  <li>
                    Luego vas a <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline">vercel.com</a>, inicias sesión con GitHub, haces clic en <strong>"Import"</strong> sobre tu proyecto, y presionas <strong>"Deploy"</strong>.
                  </li>
                </ol>
              </div>

              <div className="p-3 bg-slate-100 rounded-lg text-slate-600 text-xs">
                ✨ <strong>Ventaja de Vercel:</strong> Cada vez que hagas un cambio en tus textos o precios en el futuro, Vercel actualizará tu página web automáticamente sin que tengas que volver a configurarla.
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500">
            Tu app de matemáticas está 100% lista para ser usada.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Cerrar Guía
          </button>
        </div>

      </div>
    </div>
  );
};
