"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";
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

async function fetchProfile(currentUser: User): Promise<AdminProfile> {
  const idToken = await currentUser.getIdToken();
  const response = await fetch("/api/admin/profile", {
    method: "GET",
    headers: { authorization: `Bearer ${idToken}` },
    cache: "no-store",
  });
  const payload = await response.json() as { profile?: AdminProfile; error?: string };
  if (!response.ok || !payload.profile) {
    throw new Error(payload.error || "Profil admin tidak dapat dimuat.");
  }

  // Refresh token sekali setelah server menyetel custom claims.
  await currentUser.getIdToken(true).catch(() => undefined);
  return payload.profile;
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
