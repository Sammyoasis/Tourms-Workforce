import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
import appletConfig from '../../firebase-applet-config.json';

/**
 * Public Firebase Client Configuration.
 * Prioritizes VITE_ environment variables, falling back to provisioned applet configuration.
 */
export const firebaseClientConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId || '',
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || appletConfig.firestoreDatabaseId || '(default)'
};

/**
 * Validates whether required public client configuration parameters are present.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseClientConfig.apiKey &&
    firebaseClientConfig.projectId &&
    firebaseClientConfig.projectId !== 'remixed-project-id'
  );
}

// Singleton App instance initialization
export const app: FirebaseApp = getApps().length === 0 
  ? initializeApp(firebaseClientConfig) 
  : getApp();

// Centralized Services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app, firebaseClientConfig.firestoreDatabaseId);
export const storage: FirebaseStorage = getStorage(app);

// Local Emulator Support (activated via VITE_USE_FIREBASE_EMULATOR=true)
if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
    console.info('🔌 Connected to local Firebase Emulators (Auth: 9099, Firestore: 8080, Storage: 9199)');
  } catch (err) {
    console.warn('Notice: Firebase Emulator connection attempted but already initialized or skipped:', err);
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Standardized Firestore error handler mandated by Firebase Integration Skill.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validates connection to Cloud Firestore upon initial boot.
 */
export async function testConnection(): Promise<boolean> {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase configuration missing or unconfigured. Operating in fallback demonstration mode.');
    return false;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('✓ Cloud Firestore connected successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice. Please verify network access.');
    } else {
      console.log('Firestore initialized and ready.');
    }
    return false;
  }
}
