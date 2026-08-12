"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { AMBORAWANG_LOGO } from "@/data/amborawang";
import type { SiteSettings } from "@/types";
import styles from "./PublicHeader.module.css";

type SearchItem = {
  title: string;
  description: string;
  category: string;
  href: string;
};

const mainMenu = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Pemerintahan", href: "/pemerintahan" },
  { label: "Layanan", href: "/layanan" },
  { label: "Berita", href: "/berita" },
];

const moreMenu = [
  {
    label: "Wilayah",
    href: "/wilayah",
    description: "Data wilayah, batas administratif, dan peta",
  },
  {
    label: "Data RT",
    href: "/data-rt",
    description: "Ketua RT, jumlah warga, KK, kontak, dan keterangan wilayah",
  },
  {
    label: "Galeri",
    href: "/galeri",
    description: "Dokumentasi kegiatan kelurahan dan masyarakat",
  },
  {
    label: "Dokumen",
    href: "/dokumen",
    description: "Arsip dan dokumen publik kelurahan",
  },
  {
    label: "Kontak",
    href: "/kontak",
    description: "Alamat, jam pelayanan, WhatsApp, dan lokasi kantor",
  },
];

const kknMenu = [
  {
    label: "Tim KKN",
    href: "/tim-kkn",
    description: "Profil dan struktur Tim KKN Reguler Amborawang Darat",
  },
  {
    label: "Program Kerja",
    href: "/kkn/program-kerja",
    description: "Daftar dan dokumentasi program kerja Tim KKN",
  },
  {
    label: "Berita KKN",
    href: "/kkn/berita",
    description: "Berita dan perkembangan kegiatan Tim KKN",
  },
  {
    label: "Galeri KKN",
    href: "/kkn/galeri",
    description: "Dokumentasi foto khusus kegiatan Tim KKN",
  },
  {
    label: "Book Chapter",
    href: "/kkn/book-chapter",
    description: "Luaran tulisan dan Book Chapter kegiatan KKN",
  },
  {
    label: "Luaran KKN",
    href: "/kkn/luaran",
    description: "Hasil digital, publikasi, dan dokumentasi luaran KKN",
  },
];

const staticSearchItems: SearchItem[] = [
  {
    title: "Beranda",
    description: "Portal utama informasi Kelurahan Amborawang Darat.",
    category: "Halaman",
    href: "/",
  },
  {
    title: "Profil Kelurahan",
    description: "Sejarah, visi misi, potensi, dan identitas wilayah.",
    category: "Profil",
    href: "/profil",
  },
  {
    title: "Pemerintahan",
    description: "Lurah, pejabat struktural, staf, lembaga, dan Ketua RT.",
    category: "Pemerintahan",
    href: "/pemerintahan",
  },
  {
    title: "Wilayah Amborawang Darat",
    description: "Luas wilayah, batas administratif, karakter wilayah, dan peta.",
    category: "Wilayah",
    href: "/wilayah",
  },
  {
    title: "Data RT Amborawang Darat",
    description: "Ketua RT, jumlah warga, kepala keluarga, kontak, dan keterangan wilayah RT.",
    category: "RT",
    href: "/data-rt",
  },
  {
    title: "Layanan Kelurahan",
    description: "Informasi pelayanan administrasi masyarakat.",
    category: "Layanan",
    href: "/layanan",
  },
  {
    title: "Berita Kelurahan",
    description: "Informasi dan kegiatan terbaru Kelurahan Amborawang Darat.",
    category: "Berita",
    href: "/berita",
  },
  {
    title: "Galeri",
    description: "Dokumentasi kegiatan pemerintahan dan masyarakat.",
    category: "Galeri",
    href: "/galeri",
  },
  {
    title: "Dokumen Publik",
    description: "Dokumen, formulir, laporan, dan arsip publik.",
    category: "Dokumen",
    href: "/dokumen",
  },
  {
    title: "Tim KKN",
    description: "Struktur dan profil Tim KKN Reguler Amborawang Darat.",
    category: "KKN",
    href: "/tim-kkn",
  },
  {
    title: "Program Kerja KKN",
    description: "Program kerja dan pengembangan website oleh Tim KKN Reguler.",
    category: "KKN",
    href: "/kkn/program-kerja",
  },
  {
    title: "Berita KKN",
    description: "Berita dan perkembangan kegiatan Tim KKN.",
    category: "KKN",
    href: "/kkn/berita",
  },
  {
    title: "Galeri KKN",
    description: "Dokumentasi foto khusus kegiatan Tim KKN Reguler.",
    category: "KKN",
    href: "/kkn/galeri",
  },
  {
    title: "Book Chapter KKN",
    description: "Luaran tulisan dan Book Chapter kegiatan Tim KKN.",
    category: "KKN",
    href: "/kkn/book-chapter",
  },
  {
    title: "Luaran KKN",
    description: "Hasil digital, publikasi, dan dokumentasi luaran Tim KKN.",
    category: "KKN",
    href: "/kkn/luaran",
  },
  {
    title: "Kontak Kelurahan",
    description: "Alamat kantor, WhatsApp, telepon, jam pelayanan, dan peta.",
    category: "Kontak",
    href: "/kontak",
  },
];

function SearchIcon({ size = 19 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  ) : (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  );
}

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function PublicHeader({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;

    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);

    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [searchOpen]);

  useEffect(() => {
    const onShortcut = (event: globalThis.KeyboardEvent) => {
      const isShortcut =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  const searchItems = useMemo(
    () =>
      staticSearchItems.map((item) => ({
        ...item,
        title: item.title.replaceAll("Amborawang Darat", settings.villageName),
        description: item.description.replaceAll(
          "Amborawang Darat",
          settings.villageName,
        ),
      })),
    [settings.villageName],
  );

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return [];

    return searchItems.filter((item) =>
      `${item.title} ${item.description} ${item.category}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [query, searchItems]);

  function openSearch() {
    setMobileOpen(false);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
  }

  function handleOverlayKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") closeSearch();
  }

  const kknActive = kknMenu.some((item) => isCurrent(pathname, item.href));
  const moreActive = moreMenu.some((item) => isCurrent(pathname, item.href));
  const whatsapp = (settings.whatsapp || "").replace(/\D/g, "").replace(/^0/, "62");
  const logo = settings.logoUrl || AMBORAWANG_LOGO;

  return (
    <>
      <header className={`${styles.siteHeader} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.headerContainer}>
          <Link
            href="/"
            className={styles.brand}
            aria-label={`Beranda ${settings.villageName}`}
          >
            <span className={styles.logoFrame}>
              <Image
                src={logo}
                alt={`Logo Kelurahan ${settings.villageName}`}
                width={48}
                height={48}
                className={styles.logo}
                priority
                unoptimized
              />
            </span>

            <span className={styles.brandText}>
              <strong>{settings.villageName}</strong>
              <small>Kecamatan {settings.subdistrictName || "Samboja Barat"}</small>
            </span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Navigasi utama">
            {mainMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isCurrent(pathname, item.href) ? styles.navLinkActive : ""
                  }`}
              >
                {item.label}
              </Link>
            ))}

            <div className={styles.dropdown}>
              <button
                type="button"
                className={`${styles.navLink} ${styles.dropdownButton} ${kknActive ? styles.navLinkActive : ""
                  }`}
                aria-haspopup="true"
              >
                KKN
                <ChevronDown />
              </button>

              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span>Ruang KKN</span>
                  <small>Tim, program kerja, publikasi, dokumentasi, dan luaran KKN</small>
                </div>

                {kknMenu.map((item) => (
                  <Link key={item.href} href={item.href} className={styles.dropdownItem}>
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                    <ArrowIcon />
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.dropdown}>
              <button
                type="button"
                className={`${styles.navLink} ${styles.dropdownButton} ${moreActive ? styles.navLinkActive : ""
                  }`}
                aria-haspopup="true"
              >
                Informasi
                <ChevronDown />
              </button>

              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span>Informasi Publik</span>
                  <small>Akses data dan informasi lainnya</small>
                </div>

                {moreMenu.map((item) => (
                  <Link key={item.href} href={item.href} className={styles.dropdownItem}>
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                    <ArrowIcon />
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.searchButton}
              onClick={openSearch}
              aria-label="Buka pencarian website"
            >
              <SearchIcon />
              <span className={styles.searchButtonText}>Cari</span>
            </button>

            <button
              type="button"
              className={styles.mobileMenuButton}
              onClick={() => setMobileOpen((value) => !value)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-public-navigation"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            >
              <MenuIcon open={mobileOpen} />
            </button>
          </div>
        </div>

        <div
          id="mobile-public-navigation"
          className={`${styles.mobileNavigation} ${mobileOpen ? styles.mobileNavigationOpen : ""
            }`}
        >
          <div className={styles.mobileNavInner}>
            <button
              type="button"
              className={styles.mobileSearchButton}
              onClick={openSearch}
            >
              <SearchIcon />
              Cari informasi di website
            </button>

            <nav className={styles.mobileMenuList} aria-label="Navigasi mobile">
              {mainMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.mobileNavLink} ${isCurrent(pathname, item.href) ? styles.mobileNavLinkActive : ""}`}
                >
                  <span>{item.label}</span>
                  <ArrowIcon />
                </Link>
              ))}

              <div className={styles.mobileMenuGroup}>
                <div className={styles.mobileMenuGroupTitle}>KKN</div>
                {kknMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.mobileNavLink} ${styles.mobileSubNavLink} ${isCurrent(pathname, item.href) ? styles.mobileNavLinkActive : ""}`}
                  >
                    <span>{item.label}</span>
                    <ArrowIcon />
                  </Link>
                ))}
              </div>

              <div className={styles.mobileMenuGroup}>
                <div className={styles.mobileMenuGroupTitle}>Informasi</div>
                {moreMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.mobileNavLink} ${styles.mobileSubNavLink} ${isCurrent(pathname, item.href) ? styles.mobileNavLinkActive : ""}`}
                  >
                    <span>{item.label}</span>
                    <ArrowIcon />
                  </Link>
                ))}
              </div>
            </nav>

            <div className={styles.mobileContact}>
              <small>Kontak Kelurahan</small>
              <strong>{settings.phone || settings.whatsapp || settings.villageName}</strong>
              {whatsapp ? (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hubungi melalui WhatsApp
                </a>
              ) : (
                <Link href="/kontak">Lihat halaman kontak</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div
          className={styles.searchOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSearch();
          }}
          onKeyDown={handleOverlayKeyDown}
        >
          <section
            className={styles.searchDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-title"
          >
            <div className={styles.searchDialogHeader}>
              <div>
                <span className={styles.searchEyebrow}>Pencarian Website</span>
                <h2 id="search-title">Cari informasi kelurahan</h2>
                <p>
                  Telusuri halaman layanan, pemerintahan, berita, wilayah,
                  dokumen, dan informasi publik.
                </p>
              </div>

              <button
                type="button"
                className={styles.closeSearchButton}
                onClick={closeSearch}
                aria-label="Tutup pencarian"
              >
                <CloseIcon />
              </button>
            </div>

            <form className={styles.searchForm} onSubmit={submitSearch}>
              <SearchIcon />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Contoh: layanan, RT, dokumen, KKN..."
                aria-label="Kata kunci pencarian"
              />
              {query && (
                <button
                  type="button"
                  className={styles.clearSearch}
                  onClick={() => setQuery("")}
                  aria-label="Hapus kata kunci"
                >
                  <CloseIcon />
                </button>
              )}
            </form>

            <div className={styles.searchContent}>
              {!query.trim() ? (
                <div className={styles.searchInitial}>
                  <div className={styles.searchHint}>
                    <SearchIcon size={22} />
                    <div>
                      <strong>Mulai ketik kata kunci</strong>
                      <p>
                        Pencarian cepat akan menampilkan halaman yang paling relevan.
                      </p>
                    </div>
                  </div>

                  <div className={styles.quickSearch}>
                    <span>Pencarian cepat</span>
                    <div className={styles.quickSearchLinks}>
                      {["Layanan", "Pemerintahan", "Data RT", "Wilayah", "Dokumen", "Kontak"].map(
                        (keyword) => (
                          <button
                            key={keyword}
                            type="button"
                            onClick={() => setQuery(keyword)}
                          >
                            {keyword}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ) : results.length ? (
                <>
                  <div className={styles.resultSummary}>
                    <span>
                      {results.length} hasil untuk &quot;{query.trim()}&quot;
                    </span>
                  </div>

                  <div className={styles.searchResults}>
                    {results.map((item) => (
                      <Link
                        key={`${item.category}-${item.href}`}
                        href={item.href}
                        className={styles.searchResultItem}
                        onClick={closeSearch}
                      >
                        <span className={styles.resultCategoryIcon}>
                          {item.category.slice(0, 2).toUpperCase()}
                        </span>

                        <span className={styles.resultBody}>
                          <span className={styles.resultTop}>
                            <span className={styles.resultCategory}>{item.category}</span>
                            <ArrowIcon />
                          </span>
                          <strong>{item.title}</strong>
                          <p>{item.description}</p>
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.noResult}>
                  <span className={styles.noResultIcon}>
                    <SearchIcon size={22} />
                  </span>
                  <h3>Informasi tidak ditemukan</h3>
                  <p>Coba gunakan kata kunci yang lebih singkat atau berbeda.</p>
                </div>
              )}
            </div>

            <div className={styles.searchFooter}>
              <span>ESC untuk menutup</span>
              <span>Kelurahan {settings.villageName}</span>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
