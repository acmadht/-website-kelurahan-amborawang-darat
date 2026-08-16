"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "./AuthProvider";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import styles from "./AdminShell.module.css";

type MenuItem = {
  label: string;
  href: string;
  code: string;
};

type ExpandableMenu = {
  id: string;
  label: string;
  code: string;
  items: MenuItem[];
};

const directPublicItems: MenuItem[] = [
  { label: "Layanan", href: "/admin/layanan", code: "LY" },
  { label: "Berita", href: "/admin/berita", code: "BR" },
];

const homeItems: MenuItem[] = [
  { label: "Isi Beranda", href: "/admin/beranda", code: "BD" },
  { label: "Hero Banner", href: "/admin/hero", code: "HB" },
  { label: "Pengumuman", href: "/admin/pengumuman", code: "PG" },
  { label: "Agenda", href: "/admin/agenda", code: "AG" },
];

const profileItems: MenuItem[] = [
  { label: "Profil Kelurahan", href: "/admin/profil", code: "PR" },
  { label: "Pemerintahan / Aparatur", href: "/admin/aparatur", code: "PM" },
];

const informationItems: MenuItem[] = [
  { label: "Wilayah", href: "/admin/wilayah", code: "WL" },
  { label: "Data RT", href: "/admin/rt", code: "RT" },
  { label: "UMKM", href: "/admin/umkm", code: "UM" },
  { label: "Fasilitas", href: "/admin/fasilitas", code: "FS" },
  { label: "Galeri", href: "/admin/galeri", code: "GL" },
  { label: "Dokumen", href: "/admin/dokumen", code: "DK" },
  { label: "Kontak & Jam Layanan", href: "/admin/kontak", code: "KT" },
];

const systemBaseItems: MenuItem[] = [
  { label: "Penduduk", href: "/admin/penduduk", code: "PD" },
  { label: "Keluarga / KK", href: "/admin/keluarga", code: "KK" },
  { label: "Mutasi Penduduk", href: "/admin/mutasi", code: "MT" },
  { label: "Bansos", href: "/admin/bansos", code: "BS" },
  { label: "Inventaris", href: "/admin/inventaris", code: "IV" },
  { label: "Permohonan Surat", href: "/admin/surat", code: "SR" },
  { label: "Pengaduan", href: "/admin/pengaduan", code: "AD" },
  { label: "Pesan Masuk", href: "/admin/pesan", code: "PS" },
  { label: "Pengaturan Website", href: "/admin/pengaturan", code: "ST" },
  { label: "Backup & Export", href: "/admin/backup", code: "BK" },
  { label: "Pengguna Admin", href: "/admin/pengguna", code: "US" },
];

function isItemActive(pathname: string, href: string) {
  return href !== "/" && pathname.startsWith(href);
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, configured, logout } = useAdminAuth();
  const { settings } = usePublicSettings();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    home: false,
    profile: false,
    information: false,
  });

  const systemItems = useMemo(() => {
    if (profile?.role === "superadmin") return systemBaseItems;
    return systemBaseItems.filter((item) => !["/admin/pengguna", "/admin/backup"].includes(item.href));
  }, [profile?.role]);

  const publicExpandableMenus = useMemo<ExpandableMenu[]>(
    () => [
      {
        id: "home",
        label: "Beranda",
        code: "BD",
        items: homeItems,
      },
      {
        id: "profile",
        label: "Profil",
        code: "PR",
        items: profileItems,
      },
      {
        id: "information",
        label: "Informasi",
        code: "IN",
        items: informationItems,
      },
    ],
    [],
  );

  useEffect(() => {
    if (!loading && configured && (!user || !profile?.isActive)) {
      router.replace("/admin/login");
    }
  }, [loading, configured, user, profile, router]);

  useEffect(() => {
    if (
      !loading &&
      profile?.role === "operator_rt" &&
      pathname !== "/admin/rt-saya"
    ) {
      router.replace("/admin/rt-saya");
    }
  }, [loading, pathname, profile?.role, router]);

  useEffect(() => {
    if (profile?.role === "operator_rt") return;

    const nextState: Record<string, boolean> = {};
    for (const group of publicExpandableMenus) {
      if (group.items.some((item) => isItemActive(pathname, item.href))) {
        nextState[group.id] = true;
      }
    }

    if (Object.keys(nextState).length) {
      setExpanded((current) => ({ ...current, ...nextState }));
    }
  }, [pathname, profile?.role, publicExpandableMenus]);

  if (loading) {
    return (
      <div className="admin-login">
        <div className="login-card">Memeriksa sesi admin...</div>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h1>Firebase belum dikonfigurasi</h1>
          <div className="demo-box">Isi file .env.local terlebih dahulu.</div>
          <p>
            <Link className="btn btn-primary" href="/">
              Lihat Website
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (!user || !profile?.isActive) {
    return null;
  }

  return (
    <div className={styles.adminBody}>
      <div className={styles.layout}>
        {open && (
          <button
            className={styles.overlay}
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}
        >
          <div className={styles.brand}>
            <div className={styles.logoMark}>AD</div>
            <div>
              <strong>Admin Kelurahan</strong>
              <span>{settings.villageName}</span>
            </div>
          </div>

          {profile.role === "operator_rt" ? (
            <nav className={styles.nav}>
              <span className={styles.groupTitle}>Menu Operator</span>
              <Link
                href="/admin/rt-saya"
                onClick={() => setOpen(false)}
                className={`${styles.navItem} ${
                  pathname.startsWith("/admin/rt-saya") ? styles.navItemActive : ""
                }`}
              >
                <span className={styles.navCode}>RT</span>
                <span>Data RT Saya</span>
              </Link>
            </nav>
          ) : (
            <nav className={styles.nav}>
              <section className={styles.navGroup}>
                <span className={styles.groupTitle}>Menu Website · Sesuai Publik</span>

                {publicExpandableMenus.slice(0, 2).map((group) => {
                  const groupActive = group.items.some((item) =>
                    isItemActive(pathname, item.href),
                  );
                  const isExpanded = expanded[group.id] || groupActive;

                  return (
                    <div className={styles.expandable} key={group.id}>
                      <button
                        type="button"
                        className={`${styles.navItem} ${styles.navButton} ${
                          groupActive ? styles.navItemActive : ""
                        }`}
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpanded((current) => ({
                            ...current,
                            [group.id]: !isExpanded,
                          }))
                        }
                      >
                        <span className={styles.navCode}>{group.code}</span>
                        <span>{group.label}</span>
                        <span
                          className={`${styles.chevron} ${
                            isExpanded ? styles.chevronOpen : ""
                          }`}
                          aria-hidden="true"
                        >
                          ▾
                        </span>
                      </button>

                      {isExpanded ? (
                        <div className={styles.subnav}>
                          {group.items.map((item) => {
                            const active = isItemActive(pathname, item.href);
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`${styles.subnavItem} ${
                                  active ? styles.subnavItemActive : ""
                                }`}
                              >
                                <span>{item.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                {directPublicItems.map((item) => {
                  const active = isItemActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`${styles.navItem} ${
                        active ? styles.navItemActive : ""
                      }`}
                    >
                      <span className={styles.navCode}>{item.code}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <div className={`${styles.navItem} ${styles.navStatic}`}>
                  <span className={styles.navCode}>KN</span>
                  <span className={styles.navLabelWrap}>
                    <strong>KKN</strong>
                    <small>Statis · tidak diedit dari Admin</small>
                  </span>
                </div>

                {publicExpandableMenus.slice(2).map((group) => {
                  const groupActive = group.items.some((item) =>
                    isItemActive(pathname, item.href),
                  );
                  const isExpanded = expanded[group.id] || groupActive;

                  return (
                    <div className={styles.expandable} key={group.id}>
                      <button
                        type="button"
                        className={`${styles.navItem} ${styles.navButton} ${
                          groupActive ? styles.navItemActive : ""
                        }`}
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpanded((current) => ({
                            ...current,
                            [group.id]: !isExpanded,
                          }))
                        }
                      >
                        <span className={styles.navCode}>{group.code}</span>
                        <span>{group.label}</span>
                        <span
                          className={`${styles.chevron} ${
                            isExpanded ? styles.chevronOpen : ""
                          }`}
                          aria-hidden="true"
                        >
                          ▾
                        </span>
                      </button>

                      {isExpanded ? (
                        <div className={styles.subnav}>
                          {group.items.map((item) => {
                            const active = isItemActive(pathname, item.href);
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`${styles.subnavItem} ${
                                  active ? styles.subnavItemActive : ""
                                }`}
                              >
                                <span>{item.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </section>

              <section className={`${styles.navGroup} ${styles.secondaryGroup}`}>
                <span className={styles.groupTitle}>Administrasi Kelurahan</span>
                {systemItems.map((item) => {
                  const active = isItemActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`${styles.navItem} ${
                        active ? styles.navItemActive : ""
                      }`}
                    >
                      <span className={styles.navCode}>{item.code}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </section>
            </nav>
          )}

          <div className={styles.sidebarFooter}>
            <div className={styles.accountCompact}>
              <span className={styles.avatar}>{profile.name?.charAt(0)?.toUpperCase() || "A"}</span>
              <div>
                <strong>{profile.name}</strong>
                <small>
                  {profile.role === "superadmin"
                    ? "Super Admin"
                    : profile.role === "operator_rt"
                      ? "Operator RT"
                      : "Editor Kelurahan"}
                </small>
              </div>
            </div>
            <Link href="/" className={styles.websiteShortcut} onClick={() => setOpen(false)}>
              Lihat Website ↗
            </Link>
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button
                className={styles.mobileButton}
                onClick={() => setOpen((value) => !value)}
              >
                Menu
              </button>

              <div>
                <span>Dashboard Administrasi</span>
                <strong>Kelola konten website</strong>
              </div>
            </div>

            <div className={styles.topbarActions}>
              <Link href="/" className={styles.previewButton}>
                Lihat Website ↗
              </Link>

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
