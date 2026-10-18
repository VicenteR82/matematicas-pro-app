# 📐 Matemáticas Pro - Guía de Puesta en Línea Gratuita

Esta aplicación está completamente lista para ser desplegada en plataformas gratuitas como **Vercel** (opción más rápida y 100% gratuita) o **Railway**.

---

## Opción 1: Desplegar en Vercel (Recomendada - 100% Gratis)

Vercel es la plataforma oficial de los creadores de Next.js y ofrece alojamiento gratuito ilimitado para proyectos Frontend construidos con Vite y React.

### Paso 1: Subir tu código a GitHub

1. Abre tu terminal en la carpeta del proyecto y ejecuta:
```bash
git init
git add .
git commit -m "feat: Primera versión de web de reservas de matemáticas"
```

2. Entra a [github.com](https://github.com), crea un repositorio nuevo llamado `matematicas-reservas` (puede ser público o privado) y vincúlalo:
```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/matematicas-reservas.git
git push -u origin main
```

### Paso 2: Importar en Vercel

1. Entra a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New..."** → **"Project"**.
3. Selecciona tu repositorio `matematicas-reservas` y haz clic en **"Import"**.
4. Vercel reconocerá automáticamente que el framework es **Vite**.
5. Verifica los ajustes predeterminados:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Haz clic en **"Deploy"**.

¡Listo! En menos de 1 minuto tendrás una URL como `https://matematicas-reservas.vercel.app` con certificado SSL gratuito (https) y actualización automática cada vez que hagas `git push`.

El archivo `vercel.json` ya incluido en la raíz se encarga de manejar las rutas limpias (SPA rewrites).

---

## Opción 2: Desplegar en Railway (Full-Stack o Contenedor)

Railway es ideal si deseas hospedar la aplicación junto a un servidor backend Node o bases de datos PostgreSQL/MySQL.

### Paso 1: Conectar en Railway.app

1. Entra a [railway.app](https://railway.app) y haz clic en **"Login with GitHub"**.
2. Haz clic en **"New Project"** → **"Deploy from GitHub repo"**.
3. Selecciona tu repositorio.
4. El archivo `railway.toml` incluido configurará el build (`npm run build`) y el comando de arranque (`npm run preview -- --host 0.0.0.0 --port $PORT`).
5. En la configuración del servicio dentro de Railway, ve a **Settings** → **Networking** y presiona **"Generate Domain"** para obtener tu enlace público `.up.railway.app`.

---

## Configuración de Pasarelas de Pago y WhatsApp

### 1. Activar Pagos con Tarjeta (Stripe)
1. Ve a [dashboard.stripe.com/register](https://dashboard.stripe.com/register) y crea tu cuenta.
2. En **Desarrolladores → Claves de API**, copia tu **Publishable Key** (`pk_live_...` o `pk_test_...`).
3. En la aplicación, ve al **Panel de la Profesora → Tarifas, Pagos & Horarios** y pega tu clave.

### 2. Activar Mercado Pago
1. Ve a [mercadopago.com/developers](https://www.mercadopago.com/developers).
2. Obtén tu **Public Key** y pégala en la pestaña de configuración.

### 3. Recordatorios por WhatsApp
- **Modo Gratuito (wa.me)**: Ya está activo por defecto. Genera enlaces directos de WhatsApp con el mensaje preformateado y la sala de Google Meet sin requerir pago ni suscripción a plataformas externas.
- **Modo Desatendido (Cloud API)**: Puedes introducir tu token de Meta WhatsApp Business o Twilio en la pestaña *Automatizaciones WhatsApp* del panel docente si deseas envíos automáticos sin tocar el teléfono.
