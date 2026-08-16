"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { useAdminAuth } from "@/components/admin/AuthProvider";

export default function LoginPage() {
  const { user, profile, configured, loading, error: profileError, reloadProfile } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && profile?.isActive) router.replace("/admin");
  }, [loading, user, profile, router]);

  async function login() {
    if (!auth) {
      setError("Firebase belum dikonfigurasi.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      await credential.user.getIdToken(true);
      await reloadProfile();
    } catch (loginError) {
      console.error("Login admin gagal", loginError);
      const message = loginError instanceof Error ? loginError.message : "";
      if (message.includes("auth/invalid-credential") || message.includes("auth/wrong-password") || message.includes("auth/user-not-found")) {
        setError("Email atau kata sandi tidak benar.");
      } else {
        setError(message || "Login berhasil di Authentication, tetapi profil admin tidak dapat dimuat.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="login-card">
        <img src="/images/logo-placeholder.svg" alt="Logo" style={{ width: 64, height: 64 }} />
        <h1>Login Admin</h1>
        <p className="muted">Masuk untuk mengelola website dan administrasi kelurahan.</p>
        {!configured ? <div className="demo-box">Firebase belum diisi. Salin .env.example menjadi .env.local lalu masukkan konfigurasi Firebase.</div> : null}
        <div className="form-grid" style={{ marginTop: 22 }}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" type="email" value={email} onChange={(event) => setEmail(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void login(); }} />
          </div>
          <div className="form-group">
            <label>Kata sandi</label>
            <input className="form-control" type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void login(); }} />
          </div>
          {error || profileError ? <div className="error-box">{error || profileError}</div> : null}
          <button className="btn btn-primary" disabled={busy || loading} onClick={() => void login()}>{busy || loading ? "Memproses..." : "Masuk"}</button>
          <Link className="btn btn-outline" href="/">Kembali ke Website</Link>
        </div>
      </div>
    </div>
  );
}
