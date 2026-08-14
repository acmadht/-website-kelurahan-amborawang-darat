import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
} from "firebase-admin/firestore";

declare global {
  // eslint-disable-next-line no-var
  var __kelurahanAdminApp: App | undefined;
  // eslint-disable-next-line no-var
  var __kelurahanAdminDb: Firestore | undefined;
}

export function getAdminApp(): App {
  if (globalThis.__kelurahanAdminApp) return globalThis.__kelurahanAdminApp;

  const existingApp = getApps()[0];
  if (existingApp) {
    globalThis.__kelurahanAdminApp = existingApp;
    return existingApp;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ?.replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin belum dikonfigurasi pada environment variables.");
  }

  const app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  globalThis.__kelurahanAdminApp = app;
  return app;
}

export function getAdminDb(): Firestore {
  if (globalThis.__kelurahanAdminDb) return globalThis.__kelurahanAdminDb;

  const app = getAdminApp();
  try {
    globalThis.__kelurahanAdminDb = initializeFirestore(app, {
      preferRest: true,
    });
  } catch {
    globalThis.__kelurahanAdminDb = getFirestore(app);
  }
  return globalThis.__kelurahanAdminDb;
}
