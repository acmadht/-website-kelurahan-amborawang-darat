"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "./AuthProvider";

const editorMenu = [
  ["Dashboard", "/admin"], ["Hero Banner", "/admin/hero"], ["Pengaturan", "/admin/pengaturan"],
  ["Profil Kelurahan", "/admin/profil"], ["Berita", "/admin/berita"], ["Layanan", "/admin/layanan"],
  ["Aparatur", "/admin/aparatur"], ["Data RW", "/admin/rw"], ["Data RT", "/admin/rt"],
  ["Pengumuman", "/admin/pengumuman"], ["Agenda", "/admin/agenda"], ["Galeri", "/admin/galeri"],
  ["Tim KKN", "/admin/tim-kkn"], ["Dokumen", "/admin/dokumen"], ["Pesan Masuk", "/admin/pesan"],
  ["Pengguna Admin", "/admin/pengguna"], ["Lihat Website", "/"],
];
const operatorMenu = [["Data RT Saya", "/admin/rt-saya"], ["Lihat Website", "/"]];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, configured, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menu = useMemo(() => {
    if (profile?.role === "operator_rt") return operatorMenu;
    if (profile?.role === "superadmin") return editorMenu;
    return editorMenu.filter(([, href]) => href !== "/admin/pengguna");
  }, [profile?.role]);

  useEffect(() => {
    if (!loading && configured && (!user || !profile?.isActive)) router.replace("/admin/login");
  }, [loading, configured, user, profile, router]);

  useEffect(() => {
    if (!loading && profile?.role === "operator_rt" && pathname !== "/admin/rt-saya") {
      router.replace("/admin/rt-saya");
    }
  }, [loading, pathname, profile?.role, router]);

  if (loading) return <div className="admin-login"><div className="login-card">Memeriksa sesi admin...</div></div>;
  if (!configured) return <div className="admin-login"><div className="login-card"><h1>Firebase belum dikonfigurasi</h1><div className="demo-box">Isi file .env.local terlebih dahulu. Panduan lengkap tersedia di README.md.</div><p><Link className="btn btn-primary" href="/">Lihat Website Demo</Link></p></div></div>;
  if (!user || !profile?.isActive) return null;

  return (
    <div className="admin-body">
      <div className="admin-layout">
        <aside className={`admin-sidebar ${open ? "open" : ""}`}>
          <div className="admin-brand"><strong>Dashboard Kelurahan</strong><span>{profile.name} • {profile.role}</span></div>
          <nav className="admin-nav">
            {menu.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} style={pathname === href ? { background: "rgba(255,255,255,.14)", color: "white" } : undefined}>{label}</Link>)}
          </nav>
        </aside>
        <div className="admin-main">
          <header className="admin-topbar">
            <div className="flex gap-12 items-center"><button className="btn btn-outline btn-small admin-mobile-toggle" onClick={() => setOpen((value) => !value)}>Menu</button><strong>Kelola konten website</strong></div>
            <button className="btn btn-outline btn-small" onClick={async () => { await logout(); router.replace("/admin/login"); }}>Keluar</button>
          </header>
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
