import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
} from "firebase-admin/firestore";

declare global {
  // Singleton mencegah inisialisasi ulang saat Next.js hot reload.
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

function hasEditorClaim(token: DecodedIdToken): boolean {
  const role = typeof token.role === "string" ? token.role : "";
  const isActive = token.isActive !== false;
  return isActive && ["superadmin", "editor"].includes(role);
}

function isAllowedEmail(token: DecodedIdToken): boolean {
  const allowed = (process.env.UPLOAD_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(token.email && allowed.includes(token.email.toLowerCase()));
}

export async function verifyEditorToken(idToken: string) {
  const app = getAdminApp();
  const decoded = await getAuth(app).verifyIdToken(idToken, true);

  // Jalur utama. Tidak perlu membaca Firestore saat upload.
  if (hasEditorClaim(decoded) || isAllowedEmail(decoded)) {
    return {
      uid: decoded.uid,
      role: typeof decoded.role === "string" ? decoded.role : "editor",
    };
  }

  // Fallback untuk akun lama yang belum memiliki custom claims.
  try {
    const userDoc = await getAdminDb().collection("users").doc(decoded.uid).get();
    if (!userDoc.exists) {
      throw new Error("Profil admin tidak ditemukan di Firestore.");
    }

    const data = userDoc.data() as { role?: string; isActive?: boolean };
    if (!data.isActive || !["superadmin", "editor"].includes(data.role ?? "")) {
      throw new Error("Akun tidak memiliki izin editor.");
    }

    return { uid: decoded.uid, role: data.role };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "koneksi Firestore gagal";
    throw new Error(
      `Hak upload belum tersimpan pada token akun. Jalankan npm run bootstrap-admin, lalu keluar dan login kembali. Detail: ${reason}`,
    );
  }
}
