import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import { getAdminApp, getAdminDb } from "./admin-db";

export { getAdminApp, getAdminDb } from "./admin-db";

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

export async function verifyUploadToken(idToken: string) {
  const app = getAdminApp();
  const decoded = await getAuth(app).verifyIdToken(idToken, true);
  const claimRole = typeof decoded.role === "string" ? decoded.role : "";
  const allowedRoles = ["superadmin", "editor", "operator_rt"];

  if (
    decoded.isActive !== false &&
    allowedRoles.includes(claimRole)
  ) {
    return { uid: decoded.uid, role: claimRole };
  }

  if (isAllowedEmail(decoded)) {
    return { uid: decoded.uid, role: "editor" };
  }

  try {
    const userDoc = await getAdminDb().collection("users").doc(decoded.uid).get();
    if (!userDoc.exists) {
      throw new Error("Profil pengguna tidak ditemukan di Firestore.");
    }

    const data = userDoc.data() as { role?: string; isActive?: boolean };
    const role = data.role ?? "";
    if (!data.isActive || !allowedRoles.includes(role)) {
      throw new Error("Akun tidak memiliki izin upload.");
    }

    return { uid: decoded.uid, role };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "koneksi Firestore gagal";
    throw new Error(`Izin upload tidak valid. Detail: ${reason}`);
  }
}


export async function verifySuperadminToken(idToken: string) {
  const app = getAdminApp();
  const decoded = await getAuth(app).verifyIdToken(idToken, true);

  if (
    decoded.isActive !== false &&
    typeof decoded.role === "string" &&
    decoded.role === "superadmin"
  ) {
    return { uid: decoded.uid, role: "superadmin" as const };
  }

  const userDoc = await getAdminDb().collection("users").doc(decoded.uid).get();
  if (!userDoc.exists) {
    throw new Error("Profil superadmin tidak ditemukan.");
  }

  const data = userDoc.data() as { role?: string; isActive?: boolean };
  if (data.isActive === false || data.role !== "superadmin") {
    throw new Error("Akun tidak memiliki izin superadmin.");
  }

  return { uid: decoded.uid, role: "superadmin" as const };
}
