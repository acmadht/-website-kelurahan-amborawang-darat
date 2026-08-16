import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminApp, getAdminDb } from "@/lib/firebase/admin";
import type { UserRole } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProfileData = {
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean | string;
  rtId?: string | null;
};

function bearer(request: Request) {
  const authorization = request.headers.get("authorization");
  return authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
}

function activeValue(value: unknown) {
  if (value === true) return true;
  if (value === false) return false;
  return String(value ?? "").trim().toLowerCase() === "true";
}

function validRole(value: unknown): value is UserRole {
  return value === "superadmin" || value === "editor" || value === "operator_rt";
}

export async function GET(request: Request) {
  try {
    const token = bearer(request);
    if (!token) return NextResponse.json({ error: "Sesi admin tidak ditemukan." }, { status: 401 });

    const auth = getAuth(getAdminApp());
    const decoded = await auth.verifyIdToken(token, true);
    const db = getAdminDb();
    const directRef = db.collection("users").doc(decoded.uid);
    let snapshot = await directRef.get();
    let data = snapshot.exists ? (snapshot.data() as ProfileData) : null;

    // Migrasi otomatis untuk akun lama yang profil Firestore-nya dibuat dengan
    // Auto-ID. Cocokkan hanya dokumen dengan email yang sama dengan token Auth.
    if (!data && decoded.email) {
      const candidates = await db
        .collection("users")
        .where("email", "==", decoded.email.toLowerCase())
        .limit(2)
        .get();

      if (candidates.size === 1) {
        const legacy = candidates.docs[0];
        data = legacy.data() as ProfileData;
        await directRef.set(
          {
            ...data,
            email: decoded.email.toLowerCase(),
            migratedFromDocumentId: legacy.id,
            migratedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
        snapshot = await directRef.get();
        data = snapshot.data() as ProfileData;
      }
    }

    if (!data || !validRole(data.role)) {
      return NextResponse.json(
        { error: "Profil admin belum terhubung dengan UID Firebase Authentication." },
        { status: 403 },
      );
    }

    const isActive = activeValue(data.isActive);
    if (!isActive) {
      return NextResponse.json({ error: "Akun admin tidak aktif." }, { status: 403 });
    }

    // Normalisasi data lama seperti isActive = "true" menjadi boolean true dan
    // simpan custom claims supaya akses berikutnya konsisten.
    await directRef.set(
      {
        name: String(data.name || decoded.name || decoded.email || "Admin").trim(),
        email: String(data.email || decoded.email || "").trim().toLowerCase(),
        role: data.role,
        isActive: true,
        rtId: data.role === "operator_rt" ? String(data.rtId || "").trim() || null : null,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    const authUser = await auth.getUser(decoded.uid);
    await auth.setCustomUserClaims(decoded.uid, {
      ...(authUser.customClaims ?? {}),
      role: data.role,
      isActive: true,
    });

    return NextResponse.json({
      ok: true,
      profile: {
        name: String(data.name || decoded.name || decoded.email || "Admin").trim(),
        email: String(data.email || decoded.email || "").trim().toLowerCase(),
        role: data.role,
        isActive: true,
        rtId: data.role === "operator_rt" ? String(data.rtId || "").trim() || undefined : undefined,
      },
    });
  } catch (error) {
    console.error("[admin-profile]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Profil admin tidak dapat dimuat." },
      { status: 500 },
    );
  }
}
