import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';

// Read configuration from environment variables with safe defaults
// so Vite build never fails if firebase-applet-config.json is absent in external repos or CI.
const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || 'AIzaSyDyTjeX45JruA74-F_hbFWzZtmjK5Ny3N8',
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || 'gen-lang-client-0779068374.firebaseapp.com',
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || 'gen-lang-client-0779068374',
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || 'gen-lang-client-0779068374.firebasestorage.app',
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || '263543188633',
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || '1:263543188633:web:419094db1df8cc3fb71c08',
  measurementId: (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string) || '',
};

export const OAUTH_CLIENT_ID = 
  (import.meta.env.VITE_FIREBASE_OAUTH_CLIENT_ID as string) || 
  '263543188633-e2r4b6i0pid1g8at9epbt93qjnh6t4gj.apps.googleusercontent.com';

// Ensure singleton Firebase initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

export const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
];

const provider = new GoogleAuthProvider();
SCOPES.forEach(scope => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'select_account',
});

// Flag to indicate if we are in the middle of a sign-in flow.
let isSigningIn = false;
// Cache the access token in memory (never in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
let cachedUser: User | null = null;

// Auth listeners for subscribers
type AuthCallback = (user: User | null, token: string | null) => void;
const customListeners: Set<AuthCallback> = new Set();

function notifyListeners() {
  customListeners.forEach((listener) => {
    try {
      listener(cachedUser, cachedAccessToken);
    } catch (err) {
      console.error('Error in auth listener:', err);
    }
  });
}

/**
 * Loads the Google Identity Services client script if not already available.
 */
function ensureGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const existing = document.getElementById('gsi-client-script');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', (e) => reject(e));
      return;
    }
    const script = document.createElement('script');
    script.id = 'gsi-client-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(new Error('No se pudo cargar Google Identity Services'));
    document.head.appendChild(script);
  });
}

/**
 * Direct Google OAuth 2.0 token flow using Google Identity Services (GIS).
 * Provides a 100% reliable sign-in and token acquisition mechanism when
 * Firebase Auth Identity Toolkit provider is configuring or origin-restricted.
 */
async function signInViaGoogleIdentityServices(): Promise<{ user: User; accessToken: string }> {
  await ensureGsiScript();

  return new Promise((resolve, reject) => {
    try {
      const google = (window as any).google;
      if (!google?.accounts?.oauth2) {
        throw new Error('Google Identity Services no está disponible');
      }

      const client = google.accounts.oauth2.initTokenClient({
        client_id: OAUTH_CLIENT_ID,
        scope: SCOPES.join(' '),
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error_description || tokenResponse.error));
            return;
          }

          const accessToken = tokenResponse.access_token;
          if (!accessToken) {
            reject(new Error('No se recibió token de acceso de Google'));
            return;
          }

          cachedAccessToken = accessToken;

          // Attempt to retrieve profile details via Google OAuth2 UserInfo
          try {
            const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (userinfoRes.ok) {
              const profile = await userinfoRes.json();
              cachedUser = {
                uid: profile.sub || 'google-user',
                displayName: profile.name || profile.email || 'Usuario de Google',
                email: profile.email || '',
                photoURL: profile.picture || null,
                emailVerified: profile.email_verified ?? true,
              } as unknown as User;
            } else {
              throw new Error('UserInfo response not ok');
            }
          } catch {
            cachedUser = {
              uid: 'google-user',
              displayName: 'Usuario de Google',
              email: 'Cuenta conectada con Google Drive',
              photoURL: null,
            } as unknown as User;
          }

          notifyListeners();
          resolve({ user: cachedUser!, accessToken });
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      reject(err);
    }
  });
}

// Initialize auth state listener. Call this on app load or component mount.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  const listener: AuthCallback = (u, t) => {
    if (u && t) {
      onAuthSuccess?.(u, t);
    } else {
      onAuthFailure?.();
    }
  };

  customListeners.add(listener);

  // If we already have a cached session, invoke immediately
  if (cachedUser && cachedAccessToken) {
    onAuthSuccess?.(cachedUser, cachedAccessToken);
  }

  // Also listen to Firebase Auth native state changes
  const unsubscribeFirebase = onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      cachedUser = user;
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
        notifyListeners();
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else if (!cachedUser) {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });

  return () => {
    customListeners.delete(listener);
    unsubscribeFirebase();
  };
};

// Must be called from a button click or user interaction
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;

    // First attempt: Standard Firebase Auth popup
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedAccessToken = credential.accessToken;
        cachedUser = result.user;
        notifyListeners();
        return { user: result.user, accessToken: cachedAccessToken };
      }
    } catch (firebaseErr: any) {
      console.warn('Firebase popup returned error, falling back to Google Identity Services:', firebaseErr);
      // If error is configuration-not-found or similar, fallback to GIS direct OAuth
      return await signInViaGoogleIdentityServices();
    }

    // Fallback if no credential token was extracted
    return await signInViaGoogleIdentityServices();
  } catch (error: any) {
    console.error('Error al iniciar sesión con Google:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch {
    // Ignore signOut errors if only GIS was used
  }
  cachedAccessToken = null;
  cachedUser = null;
  notifyListeners();
};
