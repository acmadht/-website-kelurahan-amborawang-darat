import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";
import {
  getAdminApp,
  getAdminDb,
  verifySuperadminToken,
} from "@/lib/firebase/admin";

export const runtime = "nodejs";

type ManagedRole = "superadmin" | "editor" | "operator_rt";

function clean(value: unknown, max = 200) {
  return String(value ?? "").trim().slice(0, max);
}

function normalizeRole(value: unknown): ManagedRole | null {
  const role = clean(value, 32);
  if (role === "superadmin" || role === "editor" || role === "operator_rt") {
    return role;
  }
  return null;
}

async function authorize(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }
  return verifySuperadminToken(authorization.slice(7));
}

function authError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Sesi superadmin tidak ditemukan." }, { status: 401 });
  }
  if (
    error instanceof Error &&
    /superadmin|izin/i.test(error.message)
  ) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  return null;
}

export async function POST(request: Request) {
  let caller: Awaited<ReturnType<typeof verifySuperadminToken>>;
  try {
    caller = await authorize(request);
  } catch (error) {
    return authError(error) ?? NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = clean(body.name, 120);
    const email = clean(body.email, 180).toLowerCase();
    const password = clean(body.password, 200);
    const role = normalizeRole(body.role);
    const rtId = clean(body.rtId, 160) || null;
    const isActive = body.isActive !== false;

    if (!name || !email || !role) {
      return NextResponse.json({ error: "Nama, email, dan peran wajib diisi." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter." }, { status: 400 });
    }
    if (role === "operator_rt" && !rtId) {
      return NextResponse.json({ error: "Operator RT wajib dihubungkan ke Data RT." }, { status: 400 });
    }

    const auth = getAuth(getAdminApp());
    const created = await auth.createUser({
      email,
      password,
      displayName: name,
      disabled: !isActive,
    });

    try {
      await auth.setCustomUserClaims(created.uid, { role, isActive });
      await getAdminDb().collection("users").doc(created.uid).set({
        name,
        email,
        role,
        rtId: role === "operator_rt" ? rtId : null,
        isActive,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        createdBy: caller.uid,
      });
    } catch (error) {
      await auth.deleteUser(created.uid).catch(() => undefined);
      throw error;
    }

    return NextResponse.json({ ok: true, uid: created.uid });
  } catch (error) {
    console.error("[admin-users:create]", error);
    const message = error instanceof Error ? error.message : "Gagal membuat pengguna.";
    const friendly = /email-already-exists/i.test(message)
      ? "Email sudah digunakan oleh akun Firebase Authentication lain."
      : /invalid-email/i.test(message)
        ? "Format email tidak valid."
        : /weak-password/i.test(message)
          ? "Password terlalu lemah. Gunakan minimal 6 karakter."
          : "Pengguna belum dapat dibuat. Periksa data lalu coba lagi.";
    return NextResponse.json({ error: friendly }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  let caller: Awaited<ReturnType<typeof verifySuperadminToken>>;
  try {
    caller = await authorize(request);
  } catch (error) {
    return authError(error) ?? NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const uid = clean(body.uid, 160);
    const name = clean(body.name, 120);
    const email = clean(body.email, 180).toLowerCase();
    const password = clean(body.password, 200);
    let role = normalizeRole(body.role);
    const rtId = clean(body.rtId, 160) || null;
    let isActive = body.isActive !== false;

    if (!uid || !name || !email || !role) {
      return NextResponse.json({ error: "UID, nama, email, dan peran wajib diisi." }, { status: 400 });
    }
    if (password && password.length < 6) {
      return NextResponse.json({ error: "Password baru minimal 6 karakter." }, { status: 400 });
    }
    if (role === "operator_rt" && !rtId) {
      return NextResponse.json({ error: "Operator RT wajib dihubungkan ke Data RT." }, { status: 400 });
    }

    // Mencegah superadmin yang sedang login mengunci dirinya sendiri.
    if (uid === caller.uid) {
      role = "superadmin";
      isActive = true;
    }

    const auth = getAuth(getAdminApp());
    await auth.updateUser(uid, {
      email,
      displayName: name,
      disabled: !isActive,
      ...(password ? { password } : {}),
    });
    await auth.setCustomUserClaims(uid, { role, isActive });

    await getAdminDb().collection("users").doc(uid).set(
      {
        name,
        email,
        role,
        rtId: role === "operator_rt" ? rtId : null,
        isActive,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: caller.uid,
      },
      { merge: true },
    );

    return NextResponse.json({ ok: true, uid });
  } catch (error) {
    console.error("[admin-users:update]", error);
    const message = error instanceof Error ? error.message : "Gagal memperbarui pengguna.";
    const friendly = /user-not-found/i.test(message)
      ? "Akun Firebase Authentication tidak ditemukan."
      : /email-already-exists/i.test(message)
        ? "Email sudah digunakan akun lain."
        : "Pengguna belum dapat diperbarui. Periksa data lalu coba lagi.";
    return NextResponse.json({ error: friendly }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  let caller: Awaited<ReturnType<typeof verifySuperadminToken>>;
  try {
    caller = await authorize(request);
  } catch (error) {
    return authError(error) ?? NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const uid = clean(body.uid, 160);
    if (!uid) {
      return NextResponse.json({ error: "UID pengguna tidak ditemukan." }, { status: 400 });
    }
    if (uid === caller.uid) {
      return NextResponse.json(
        { error: "Akun superadmin yang sedang digunakan tidak dapat dihapus." },
        { status: 400 },
      );
    }

    const auth = getAuth(getAdminApp());
    await auth.deleteUser(uid).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "";
      if (!/user-not-found/i.test(message)) throw error;
    });
    await getAdminDb().collection("users").doc(uid).delete();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin-users:delete]", error);
    return NextResponse.json(
      { error: "Pengguna belum dapat dihapus." },
      { status: 400 },
    );
  }
}
