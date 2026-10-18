import JSZip from 'jszip';

// Load source files as raw text using Vite's eager glob import
const srcFiles = import.meta.glob<string>([
  '/src/**/*.{ts,tsx,css}',
  '/index.html',
  '/package.json',
  '/tsconfig.json',
  '/vite.config.ts',
  '/vercel.json',
  '/railway.toml',
  '/server.js',
  '/Dockerfile',
  '/.dockerignore',
  '/README.md',
  '/.env.example',
  '/firebase-applet-config.json',
], { query: '?raw', import: 'default', eager: true });

export async function generateProjectZipBlob(): Promise<Blob> {
  const zip = new JSZip();

  // Add each file to the zip
  for (const [path, content] of Object.entries(srcFiles)) {
    // Strip leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    if (typeof content === 'string') {
      zip.file(cleanPath, content);
    }
  }

  // Also include a minimal .gitignore
  zip.file('.gitignore', `node_modules
dist
dist-ssr
*.local
.DS_Store
.env
`);

  // Generate the zip blob
  return await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
}

export async function exportProjectAsZip(): Promise<void> {
  const blob = await generateProjectZipBlob();

  // Trigger browser download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'matematicas-pro-app.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
