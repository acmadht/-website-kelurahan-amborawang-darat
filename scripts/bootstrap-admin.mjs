import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore, initializeFirestore } from "firebase-admin/firestore";

function app() {
  if (getApps().length) return getApps()[0];
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ?.replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Konfigurasi Firebase Admin belum lengkap di .env.local");
  }
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim();
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
const name = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || "Admin Kelurahan";
if (!email || !password) {
  throw new Error("BOOTSTRAP_ADMIN_EMAIL dan BOOTSTRAP_ADMIN_PASSWORD wajib diisi.");
}
if (password.length < 12) throw new Error("Gunakan password minimal 12 karakter.");

const firebaseApp = app();
const auth = getAuth(firebaseApp);
let user;
try {
  user = await auth.getUserByEmail(email);
  await auth.updateUser(user.uid, { displayName: name, password, disabled: false });
  console.log("Akun Authentication yang sudah ada diperbarui.");
} catch (error) {
  if (error?.code !== "auth/user-not-found") throw error;
  user = await auth.createUser({ email, password, displayName: name, emailVerified: false });
  console.log("Akun Authentication baru dibuat.");
}

// Custom claims membuat upload tidak perlu membaca Firestore dari server.
await auth.setCustomUserClaims(user.uid, {
  role: "superadmin",
  isActive: true,
});
console.log("Hak superadmin berhasil disimpan pada token Firebase Authentication.");

try {
  let db;
  try {
    db = initializeFirestore(firebaseApp, {
      preferRest: true,
      ignoreUndefinedProperties: true,
    });
  } catch {
    db = getFirestore(firebaseApp);
  }

  await db.collection("users").doc(user.uid).set(
    {
      name,
      email,
      role: "superadmin",
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  console.log("Profil Firestore berhasil diperbarui.");
} catch (error) {
  console.warn("Peringatan: custom claims berhasil, tetapi profil Firestore gagal diperbarui.");
  console.warn(error instanceof Error ? error.message : error);
}

console.log(`Superadmin siap. UID: ${user.uid}`);
console.log("WAJIB keluar dari dashboard lalu login kembali agar token baru terbaca.");
console.log("Hapus nilai BOOTSTRAP_ADMIN_PASSWORD dari .env.local setelah berhasil.");
