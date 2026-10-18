import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Upload, 
  RefreshCw, 
  FolderCheck, 
  FileArchive, 
  AlertCircle, 
  LogOut, 
  Sparkles,
  Download
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken 
} from '../../utils/firebaseAuth';
import { 
  uploadProjectToGoogleDrive, 
  listAppDriveBackups, 
  DriveUploadedFile 
} from '../../utils/googleDrive';
import { exportProjectAsZip } from '../../utils/exportProject';

interface GoogleDriveBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleDriveBackupModal: React.FC<GoogleDriveBackupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<DriveUploadedFile | null>(null);
  const [driveBackups, setDriveBackups] = useState<DriveUploadedFile[]>([]);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [showConfirmUploadModal, setShowConfirmUploadModal] = useState(false);

  // Initialize Firebase Auth listener on modal mount
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        fetchBackups(currentToken);
      },
      () => {
        // Not authenticated or token expired
        setUser(null);
        setToken(null);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  const fetchBackups = async (authToken: string) => {
    setIsLoadingBackups(true);
    try {
      const files = await listAppDriveBackups(authToken);
      setDriveBackups(files);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingBackups(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        fetchBackups(res.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'No se pudo conectar con tu cuenta de Google.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setDriveBackups([]);
      setUploadedFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Called when user clicks "Subir a Drive" -> Prompts mandatory confirmation modal
  const handleInitiateUpload = () => {
    setErrorMsg(null);
    setShowConfirmUploadModal(true);
  };

  // Called when user confirms in the confirmation dialog
  const handleConfirmUpload = async () => {
    setShowConfirmUploadModal(false);
    let activeToken = token;
    if (!activeToken) {
      activeToken = await getAccessToken();
    }

    if (!activeToken) {
      setErrorMsg('Por favor inicia sesión con tu cuenta de Google primero.');
      return;
    }

    setIsUploading(true);
    setStatusMessage('Preparando archivos...');
    setErrorMsg(null);

    try {
      const result = await uploadProjectToGoogleDrive(activeToken, (msg) => {
        setStatusMessage(msg);
      });
      setUploadedFile(result);
      // Refresh list
      fetchBackups(activeToken);
    } catch (err: any) {
      console.error('Error during Drive upload:', err);
      setErrorMsg(err.message || 'Ocurrió un error al subir el archivo a Google Drive.');
    } finally {
      setIsUploading(false);
      setStatusMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Cloud className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Subir Proyecto a Google Drive</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                  Google Drive API
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Guarda una copia íntegra de tu aplicación directamente en tu cuenta de Drive.
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 text-xs text-slate-700 pr-1">
          
          {/* Account status box */}
          {!user ? (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
              <div className="max-w-md mx-auto space-y-2">
                <p className="text-sm font-bold text-slate-900">
                  Conecta tu cuenta de Google
                </p>
                <p className="text-xs text-slate-500">
                  Para guardar el código y las copias de seguridad de la plataforma en tu unidad personal de Google Drive con un solo clic.
                </p>
              </div>

              {/* Standard Sign in with Google Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isLoggingIn}
                  className="inline-flex items-center gap-3 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>
                    {isLoggingIn ? 'Conectando con Google...' : 'Iniciar Sesión con Google'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'Google User'} 
                    className="w-10 h-10 rounded-full border border-blue-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900 text-xs">
                    {user.displayName || 'Usuario de Google'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 text-[11px] text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message banner */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px]">
                <p className="font-semibold">Ocurrió un inconveniente:</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Upload Action Box */}
          {user && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 border border-indigo-100 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Subir copia completa a tu Google Drive</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Empaqueta todos los archivos (código React, TypeScript, Vite, estilos Tailwind, configuración de Docker, Railway y Vercel) y los sube a tu unidad.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleInitiateUpload}
                  disabled={isUploading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isUploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{statusMessage || 'Subiendo a Drive...'}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Subir Proyecto a mi Google Drive Ahora</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={exportProjectAsZip}
                  className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>O descargar ZIP al computador</span>
                </button>
              </div>
            </div>
          )}

          {/* Last Upload Success Card */}
          {uploadedFile && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <h5 className="font-bold text-xs text-emerald-950">
                  ¡Proyecto guardado exitosamente en tu Google Drive!
                </h5>
              </div>

              <div className="bg-white p-3 rounded-lg border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900 truncate">
                    <FileArchive className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{uploadedFile.name}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Guardado en tu unidad de Google Drive ({user?.email})
                </p>
              </div>

              <div className="flex items-center justify-end">
                <a
                  href={uploadedFile.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Abrir en Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Previous Drive Backups List */}
          {user && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <FolderCheck className="w-4 h-4 text-indigo-600" />
                  <span>Respaldos en tu Google Drive</span>
                </h5>
                <button
                  type="button"
                  onClick={() => token && fetchBackups(token)}
                  disabled={isLoadingBackups}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingBackups ? 'animate-spin' : ''}`} />
                  <span>Actualizar lista</span>
                </button>
              </div>

              {isLoadingBackups ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Cargando archivos de Google Drive...
                </div>
              ) : driveBackups.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-500 text-xs">
                  Aún no has subido copias a Google Drive. Haz clic en "Subir Proyecto a mi Google Drive Ahora" para generar tu primera copia de seguridad.
                </div>
              ) : (
                <div className="space-y-2">
                  {driveBackups.map((file) => (
                    <div 
                      key={file.id} 
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileArchive className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div className="truncate">
                          <p className="font-bold text-slate-800 text-xs truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {file.createdTime ? new Date(file.createdTime).toLocaleString('es-PY') : 'Fecha no disponible'}
                          </p>
                        </div>
                      </div>

                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                      >
                        <span>Ver en Drive</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-400">
            Conexión autorizada bajo alcance <code className="font-mono bg-slate-100 px-1 rounded">drive.file</code>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Listo
          </button>
        </div>

      </div>

      {/* Mandatory User Confirmation Dialog for Workspace Operations */}
      {showConfirmUploadModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Cloud className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  ¿Confirmar subida a Google Drive?
                </h4>
                <p className="text-xs text-slate-500">
                  Cuenta: <span className="font-semibold text-slate-700">{user?.email}</span>
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1.5 leading-relaxed">
              <p>
                Se empaquetará el código fuente actual de la plataforma (incluyendo componentes React, docentes configurados, pasarelas de pago y estilos) y se subirá un archivo ZIP con el nombre:
              </p>
              <p className="font-mono text-indigo-700 font-semibold bg-white p-1.5 rounded border border-slate-200 break-all text-[11px]">
                matematicas-pro-proyecto-....zip
              </p>
              <p className="text-[11px] text-slate-500">
                Esta acción creará un nuevo archivo en tu Google Drive personal con tu permiso.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmUploadModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmUpload}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Confirmar y Subir</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
