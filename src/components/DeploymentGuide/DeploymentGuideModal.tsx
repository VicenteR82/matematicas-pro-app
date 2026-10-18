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
  Download,
  Cloud
} from 'lucide-react';
import { exportProjectAsZip } from '../../utils/exportProject';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGoogleDrive?: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenGoogleDrive,
}) => {
  const [activeTab, setActiveTab] = useState<'git_commands' | 'what_is_github' | 'no_code' | 'vercel' | 'current_url'>('git_commands');
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

  const gitAllCommands = `# 1. Inicializar repositorio
git init

# 2. Agregar todos los archivos
git add .

# 3. Guardar el primer commit
git commit -m "feat: Sistema de reservas y clases de matemáticas"

# 4. Asegurar rama principal main
git branch -M main

# 5. Conectar con tu repositorio de GitHub (reemplaza con tu enlace de GitHub)
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# 6. Subir a GitHub
git push -u origin main`;

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
                Guía de Puesta en Línea: Git & Despliegue
              </h3>
              <p className="text-xs text-slate-500">
                Comandos de Git listos para copiar, enlaces activos y opciones sin código.
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

        {/* 1-Click ZIP Download & Google Drive Action Box */}
        <div className="my-3 p-3.5 bg-gradient-to-r from-indigo-50 via-purple-50 to-emerald-50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Respaldo del Proyecto: ZIP o Google Drive</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Guárdalo directo en tu Google Drive o descarga el archivo ZIP para tu computadora.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenGoogleDrive && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenGoogleDrive();
                }}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Subir a Google Drive</span>
              </button>
            )}

            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 active:scale-[0.98] text-slate-700 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
            >
              {isDownloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
                  <span>Empaquetando...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Descargar ZIP</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 py-4 shrink-0 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('git_commands')}
            className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'git_commands'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Comandos Git</span>
          </button>

          <button
            onClick={() => setActiveTab('current_url')}
            className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'current_url'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Enlace Activo</span>
          </button>

          <button
            onClick={() => setActiveTab('what_is_github')}
            className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'what_is_github'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>¿Qué es GitHub?</span>
          </button>

          <button
            onClick={() => setActiveTab('no_code')}
            className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'no_code'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <FolderUp className="w-3.5 h-3.5 text-purple-400" />
            <span>Sin Código</span>
          </button>

          <button
            onClick={() => setActiveTab('vercel')}
            className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'vercel'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>Railway / Vercel</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 text-xs text-slate-700 pr-1">
          
          {/* TAB 0: GIT COMMANDS */}
          {activeTab === 'git_commands' && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono font-bold text-xs text-slate-200">Comandos para subir a GitHub</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(gitAllCommands, 'all-git')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedSection === 'all-git' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'all-git' ? '¡Copiado!' : 'Copiar todo el bloque'}</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto text-emerald-300 border border-slate-800">
                  <pre className="whitespace-pre">{gitAllCommands}</pre>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 text-xs">Explicación paso a paso de los 6 comandos:</h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-indigo-700 text-xs">git init</span>
                      <button 
                        onClick={() => copyToClipboard('git init', 'cmd-1')} 
                        className="text-slate-400 hover:text-slate-700 text-[10px]"
                      >
                        {copiedSection === 'cmd-1' ? '✓' : 'Copiar'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Inicializa la carpeta de tu computadora como un repositorio local de Git.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-indigo-700 text-xs">git add .</span>
                      <button 
                        onClick={() => copyToClipboard('git add .', 'cmd-2')} 
                        className="text-slate-400 hover:text-slate-700 text-[10px]"
                      >
                        {copiedSection === 'cmd-2' ? '✓' : 'Copiar'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Prepara todos los archivos del proyecto (código, imágenes, estilos) para ser guardados.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-indigo-700 text-xs">git commit -m "..."</span>
                      <button 
                        onClick={() => copyToClipboard('git commit -m "feat: Sistema de reservas y clases de matemáticas"', 'cmd-3')} 
                        className="text-slate-400 hover:text-slate-700 text-[10px]"
                      >
                        {copiedSection === 'cmd-3' ? '✓' : 'Copiar'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Guarda la primera versión en la historia de tu proyecto con un mensaje descriptivo.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-indigo-700 text-xs">git branch -M main</span>
                      <button 
                        onClick={() => copyToClipboard('git branch -M main', 'cmd-4')} 
                        className="text-slate-400 hover:text-slate-700 text-[10px]"
                      >
                        {copiedSection === 'cmd-4' ? '✓' : 'Copiar'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Nombra a la rama principal como <code className="font-mono bg-slate-200 px-1 rounded">main</code> (estándar requerido por GitHub y Railway).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-950 text-xs">⚠️ ¿Aún no tienes el repositorio creado en GitHub?</span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-1 text-[11px] text-amber-900">
                    <li>Entra a <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-700 underline">github.com/new</a></li>
                    <li>Ponle un nombre (por ejemplo: <code className="bg-amber-100 px-1 rounded">clases-matematicas</code>)</li>
                    <li>Déjalo como <strong>Public</strong> y <strong>NO marques</strong> la casilla "Add a README file" (para que no choque)</li>
                    <li>Haz clic en <strong>Create repository</strong> y copia la URL que te da.</li>
                  </ol>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900 text-xs">¿No tienes Git instalado en tu computadora?</p>
                    <p className="text-[11px] text-slate-600">
                      Descárgalo gratis en <a href="https://git-scm.com/downloads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline">git-scm.com</a> o usa <strong>GitHub Desktop</strong> si prefieres usar solo botones.
                    </p>
                  </div>
                  <a
                    href="https://desktop.github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    GitHub Desktop
                  </a>
                </div>
              </div>
            </div>
          )}

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
                  <p className="font-bold text-slate-900 text-xs">🔗 2. ¿Por qué lo pide Vercel o Railway?</p>
                  <p className="text-slate-600 leading-relaxed">
                    Porque Railway o Vercel leen esos archivos para mantener tu página web encendida las 24 horas del día.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <p className="font-bold text-slate-900 text-xs">🆓 3. Es 100% Gratuito</p>
                  <p className="text-slate-600 leading-relaxed">
                    Crear una cuenta en <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold underline">github.com</a> es gratis, solo te pide tu correo y una contraseña.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <p className="font-bold text-emerald-950 text-xs">
                  💡 ¿No quieres lidiar con la terminal?
                </p>
                <p className="text-emerald-900 leading-relaxed">
                  Tienes opciones directas:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-emerald-900">
                  <li><strong>Opción A:</strong> Tu aplicación <strong>ya está funcionando en internet ahora mismo</strong> en el enlace de este entorno (mira la pestaña <em>"Enlace Activo"</em>).</li>
                  <li><strong>Opción B:</strong> Usa la aplicación visual <strong>GitHub Desktop</strong> donde sólo arrastras la carpeta y presionas un botón para publicar.</li>
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

          {/* TAB 4: RAILWAY / VERCEL */}
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  Desplegar con Railway o Vercel conectando GitHub
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Una vez que subes tu proyecto a GitHub usando los <strong>Comandos Git</strong> o <strong>GitHub Desktop</strong>:
                </p>

                <ol className="list-decimal pl-5 space-y-2 text-slate-600">
                  <li>
                    <strong>En Railway:</strong> Entras a <a href="https://railway.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline">railway.com</a>, seleccionas <em>"New Project"</em> &gt; <em>"Deploy from GitHub repo"</em> y eliges tu repositorio.
                  </li>
                  <li>
                    <strong>Enlace público en Railway:</strong> Vas a la pestaña <em>Settings &gt; Networking</em> y haces clic en <strong>"Generate Domain"</strong>.
                  </li>
                  <li>
                    <strong>En Vercel:</strong> Vas a <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline">vercel.com</a>, haces clic en <em>"Add New Project"</em> &gt; <em>"Import"</em> sobre tu repositorio y luego en <strong>"Deploy"</strong>.
                  </li>
                </ol>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs">
                ✨ <strong>Despliegue automático:</strong> A partir de ese momento, cada vez que hagas un cambio y hagas <code className="font-mono bg-emerald-100 px-1 rounded">git push</code>, Railway o Vercel actualizarán tu página automáticamente.
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
