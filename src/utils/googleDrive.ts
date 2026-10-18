import { generateProjectZipBlob } from './exportProject';

export interface DriveUploadedFile {
  id: string;
  name: string;
  webViewLink: string;
  createdTime?: string;
  size?: string;
}

/**
 * Uploads the entire project codebase bundled as a ZIP directly to the authenticated user's Google Drive.
 */
export async function uploadProjectToGoogleDrive(
  accessToken: string,
  onStatusUpdate?: (status: string) => void
): Promise<DriveUploadedFile> {
  onStatusUpdate?.('Generando archivo ZIP con todo el código del proyecto...');
  const zipBlob = await generateProjectZipBlob();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName = `matematicas-pro-proyecto-${timestamp}.zip`;

  onStatusUpdate?.('Conectando con Google Drive y subiendo respaldo...');

  const metadata = {
    name: fileName,
    mimeType: 'application/zip',
    description: 'Copia completa del código fuente y archivos de la plataforma de clases particulares de matemáticas.',
  };

  const boundary = '-------MathProDriveUploadBoundary' + Math.random().toString(36).substring(2);
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartBody = new Blob([
    delimiter,
    'Content-Type: application/json; charset=UTF-8\r\n\r\n',
    JSON.stringify(metadata),
    delimiter,
    'Content-Type: application/zip\r\n\r\n',
    zipBlob,
    closeDelimiter,
  ], { type: `multipart/related; boundary=${boundary}` });

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,createdTime,size',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: multipartBody,
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error al subir a Google Drive:', errorText);
    throw new Error(`Error en Google Drive API (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  onStatusUpdate?.('¡Proyecto subido exitosamente a Google Drive!');

  return {
    id: data.id,
    name: data.name,
    webViewLink: data.webViewLink || `https://drive.google.com/file/d/${data.id}/view`,
    createdTime: data.createdTime,
    size: data.size,
  };
}

/**
 * Lists the project backups previously uploaded to Google Drive.
 */
export async function listAppDriveBackups(accessToken: string): Promise<DriveUploadedFile[]> {
  try {
    const query = encodeURIComponent("name contains 'matematicas-pro' and trashed = false");
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink,createdTime,size)&orderBy=createdTime desc&pageSize=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.error('Error fetching Drive backups:', err);
    return [];
  }
}
