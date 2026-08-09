"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "./AuthProvider";
import styles from "./AdminShell.module.css";

type MenuItem = { label: string; href: string; code: string };
type MenuGroup = { title: string; items: MenuItem[] };

const editorGroups: MenuGroup[] = [
  {
    title: "Ringkasan",
    items: [
      { label: "Dashboard", href: "/admin", code: "DB" },
      { label: "Beranda", href: "/admin/beranda", code: "BD" },
      { label: "Hero Banner", href: "/admin/hero", code: "HB" },
    ],
  },
  {
    title: "Informasi Kelurahan",
    items: [
      { label: "Profil Kelurahan", href: "/admin/profil", code: "PR" },
      { label: "Pemerintahan", href: "/admin/aparatur", code: "PM" },
      { label: "Data RT", href: "/admin/rt", code: "RT" },
      { label: "Wilayah", href: "/admin/wilayah", code: "WL" },
      { label: "Kontak & Jam Layanan", href: "/admin/kontak", code: "KT" },
    ],
  },
  {
    title: "Pelayanan & Publikasi",
    items: [
      { label: "Layanan", href: "/admin/layanan", code: "LY" },
      { label: "Berita", href: "/admin/berita", code: "BR" },
      { label: "Pengumuman", href: "/admin/pengumuman", code: "PG" },
      { label: "Agenda", href: "/admin/agenda", code: "AG" },
      { label: "Galeri", href: "/admin/galeri", code: "GL" },
      { label: "Dokumen", href: "/admin/dokumen", code: "DK" },
      { label: "Pesan Masuk", href: "/admin/pesan", code: "PS" },
    ],
  },
  {
    title: "Sistem",
    items: [
      { label: "Pengaturan Website", href: "/admin/pengaturan", code: "ST" },
      { label: "Pengguna Admin", href: "/admin/pengguna", code: "US" },
      { label: "Lihat Website", href: "/", code: "↗" },
    ],
  },
];

const operatorGroups: MenuGroup[] = [
  {
    title: "Akses Operator RT",
    items: [
      { label: "Data RT Saya", href: "/admin/rt-saya", code: "RT" },
      { label: "Lihat Website", href: "/", code: "↗" },
    ],
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, configured, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const groups = useMemo(() => {
    if (profile?.role === "operator_rt") return operatorGroups;
    if (profile?.role === "superadmin") return editorGroups;
    return editorGroups.map((group) => ({
      ...group,
      items: group.items.filter((item) => item.href !== "/admin/pengguna"),
    }));
  }, [profile?.role]);

  useEffect(() => {
    if (!loading && configured && (!user || !profile?.isActive)) {
      router.replace("/admin/login");
    }
  }, [loading, configured, user, profile, router]);

  useEffect(() => {
    if (!loading && profile?.role === "operator_rt" && pathname !== "/admin/rt-saya") {
      router.replace("/admin/rt-saya");
    }
  }, [loading, pathname, profile?.role, router]);

  if (loading) {
    return <div className="admin-login"><div className="login-card">Memeriksa sesi admin...</div></div>;
  }

  if (!configured) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h1>Firebase belum dikonfigurasi</h1>
          <div className="demo-box">Isi file .env.local terlebih dahulu.</div>
          <p><Link className="btn btn-primary" href="/">Lihat Website</Link></p>
        </div>
      </div>
    );
  }

  if (!user || !profile?.isActive) return null;

  return (
    <div className={styles.adminBody}>
      <div className={styles.layout}>
        {open && <button className={styles.overlay} aria-label="Tutup menu" onClick={() => setOpen(false)} />}

        <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
          <div className={styles.brand}>
            <div className={styles.logoMark}>AD</div>
            <div>
              <strong>Admin Kelurahan</strong>
              <span>Amborawang Darat</span>
            </div>
          </div>

          <div className={styles.accountCard}>
            <span>Akun aktif</span>
            <strong>{profile.name}</strong>
            <small>{profile.role === "superadmin" ? "Super Admin" : profile.role === "operator_rt" ? "Operator RT" : "Editor Kelurahan"}</small>
          </div>

          <div className={styles.lockedNotice}>
            <span>Area terkunci</span>
            <strong>Tim KKN</strong>
            <p>Tidak tersedia pada dashboard admin.</p>
          </div>

          <nav className={styles.nav}>
            {groups.map((group) => (
              <section key={group.title} className={styles.navGroup}>
                <span className={styles.groupTitle}>{group.title}</span>
                {group.items.map((item) => {
                  const active = item.href === "/admin"
                    ? pathname === "/admin"
                    : item.href !== "/" && pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                    >
                      <span className={styles.navCode}>{item.code}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </section>
            ))}
          </nav>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button className={styles.mobileButton} onClick={() => setOpen((value) => !value)}>Menu</button>
              <div>
                <span>Dashboard Administrasi</span>
                <strong>Kelola konten website</strong>
              </div>
            </div>

            <div className={styles.topbarActions}>
              <Link href="/" className={styles.previewButton}>Lihat Website ↗</Link>
              <button
                className={styles.logoutButton}
                onClick={async () => {
                  await logout();
                  router.replace("/admin/login");
                }}
              >
                Keluar
              </button>
            </div>
          </header>

          <main className={`${styles.content} admin-content`}>{children}</main>
        </div>
      </div>
    </div>
  );
}
