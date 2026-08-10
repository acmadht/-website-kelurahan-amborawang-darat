"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
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
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    let unsubscribeProfile = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      unsubscribeProfile();
      unsubscribeProfile = () => {};
      setUser(currentUser);
      setProfile(null);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      unsubscribeProfile = onSnapshot(
        doc(db!, "users", currentUser.uid),
        (snapshot) => {
          setProfile(snapshot.exists() ? (snapshot.data() as AdminProfile) : null);
          setLoading(false);
        },
        (error) => {
          console.error("Gagal memantau profil admin", error);
          setProfile(null);
          setLoading(false);
        },
      );
    });

    return () => {
      unsubscribeProfile();
      unsubscribeAuth();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      profile,
      loading,
      configured: isFirebaseConfigured,
      logout: async () => {
        if (auth) await signOut(auth);
      },
    }),
    [user, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAdminAuth harus dipakai di dalam AuthProvider");
  return value;
}
