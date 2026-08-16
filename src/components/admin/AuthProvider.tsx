"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase/client";
import type { UserRole } from "@/types";

type AdminProfile = {
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  rtId?: string;
};

type AuthState = {
  user: User | null;
  profile: AdminProfile | null;
  loading: boolean;
  configured: boolean;
  error: string;
  reloadProfile: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

function activeValue(value: unknown): boolean {
  if (value === true) return true;
  if (value === false) return false;
  return String(value ?? "").trim().toLowerCase() === "true";
}

function validRole(value: unknown): value is UserRole {
  return value === "superadmin" || value === "editor" || value === "operator_rt";
}

function normalizeProfile(
  data: Record<string, unknown>,
  currentUser: User,
): AdminProfile {
  if (!validRole(data.role)) {
    throw new Error("Role admin tidak valid. Gunakan superadmin, editor, atau operator_rt.");
  }

  if (!activeValue(data.isActive)) {
    throw new Error("Akun admin tidak aktif.");
  }

  const rtId = String(data.rtId ?? "").trim();
  return {
    name: String(data.name || currentUser.displayName || currentUser.email || "Admin").trim(),
    email: String(data.email || currentUser.email || "").trim().toLowerCase(),
    role: data.role,
    isActive: true,
    rtId: data.role === "operator_rt" && rtId ? rtId : undefined,
  };
}

async function fetchProfileFromFirestore(currentUser: User): Promise<AdminProfile> {
  if (!db) throw new Error("Firestore belum dikonfigurasi.");

  const profileRef = doc(db, "users", currentUser.uid);
  const snapshot = await getDoc(profileRef);

  if (!snapshot.exists()) {
    throw new Error(
      `Profil admin belum ditemukan pada users/${currentUser.uid}. Pastikan Document ID di Firestore sama persis dengan UID akun Firebase Authentication.`,
    );
  }

  return normalizeProfile(snapshot.data() as Record<string, unknown>, currentUser);
}

async function fetchProfile(currentUser: User): Promise<AdminProfile> {
  const idToken = await currentUser.getIdToken();

  // Jalur utama: server API. API ini dapat melakukan normalisasi profil lama
  // dan memasang custom claims ketika Firebase Admin tersedia di Vercel.
  try {
    const response = await fetch("/api/admin/profile", {
      method: "GET",
      headers: {
        authorization: `Bearer ${idToken}`,
        accept: "application/json",
      },
      cache: "no-store",
    });

    // Jangan langsung response.json(). Vercel dapat mengembalikan halaman HTML
    // untuk 404/500 sehingga JSON.parse akan menghasilkan Unexpected token '<'.
    const raw = await response.text();
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json") || raw.trim().startsWith("{")) {
      let payload: { profile?: AdminProfile; error?: string } = {};
      try {
        payload = raw ? JSON.parse(raw) as { profile?: AdminProfile; error?: string } : {};
      } catch {
        // Biarkan fallback Firestore menangani respons JSON yang rusak.
      }

      if (response.ok && payload.profile) {
        await currentUser.getIdToken(true).catch(() => undefined);
        return payload.profile;
      }

      // Jika API memang merespons JSON 401/403, pesannya berguna. Namun tetap
      // coba Firestore agar instalasi yang belum punya Firebase Admin di Vercel
      // masih dapat login memakai profil users/{uid}.
      if (payload.error) {
        console.warn("API profil admin menolak request, mencoba Firestore:", payload.error);
      }
    } else {
      console.warn(
        `API profil admin mengembalikan ${response.status} ${contentType || "non-JSON"}; menggunakan fallback Firestore.`,
      );
    }
  } catch (apiError) {
    console.warn("API profil admin tidak dapat diakses; menggunakan fallback Firestore.", apiError);
  }

  return fetchProfileFromFirestore(currentUser);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProfile(currentUser: User | null) {
    if (!currentUser) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setProfile(await fetchProfile(currentUser));
    } catch (profileError) {
      console.error("Gagal memuat profil admin", profileError);
      setProfile(null);
      setError(profileError instanceof Error ? profileError.message : "Gagal memuat profil admin.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    let active = true;
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!active) return;
      setUser(currentUser);
      setProfile(null);
      await loadProfile(currentUser);
    });

    return () => {
      active = false;
      unsubscribeAuth();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      profile,
      loading,
      configured: isFirebaseConfigured,
      error,
      reloadProfile: async () => loadProfile(auth?.currentUser ?? user),
      logout: async () => {
        if (auth) await signOut(auth);
      },
    }),
    [user, profile, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAdminAuth harus dipakai di dalam AuthProvider");
  return value;
}
