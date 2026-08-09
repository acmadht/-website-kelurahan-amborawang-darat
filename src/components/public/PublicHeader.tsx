"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { collection, getDocs } from "firebase/firestore";

import styles from "./PublicHeader.module.css";
import { AMBORAWANG_LOGO } from "@/data/amborawang";
import {
  demoAlbums,
  demoDocuments,
  demoOfficials,
  demoPosts,
  demoServices,
} from "@/data/demo";
import { db } from "@/lib/firebase/client";

import type {
  GalleryAlbum,
  Official,
  PostItem,
  PublicDocument,
  ServiceItem,
  SiteSettings,
} from "@/types";

/* =========================================================
   MENU
========================================================= */

const mainMenu = [
  {
    label: "Beranda",
    href: "/",
  },
  {
    label: "Profil",
    href: "/profil",
  },
  {
    label: "Pemerintahan",
    href: "/pemerintahan",
  },
  {
    label: "Layanan",
    href: "/layanan",
  },
  {
    label: "Berita",
    href: "/berita",
  },
];

const informationMenu = [
  {
    label: "Wilayah",
    href: "/wilayah",
    description: "Informasi wilayah kelurahan",
  },
  {
    label: "Galeri",
    href: "/galeri",
    description: "Dokumentasi kegiatan kelurahan",
  },
  {
    label: "Dokumen",
    href: "/dokumen",
    description: "Dokumen dan informasi publik",
  },
  {
    label: "Tim KKN",
    href: "/tim-kkn",
    description: "Informasi kegiatan mahasiswa KKN",
  },
  {
    label: "Kontak",
    href: "/kontak",
    description: "Hubungi Kelurahan Amborawang Darat",
  },
];

/* =========================================================
   SEARCH TYPES
========================================================= */

type SearchCategory =
  | "Halaman"
  | "Berita"
  | "Layanan"
  | "Dokumen"
  | "Pemerintahan"
  | "Galeri";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  category: SearchCategory;
  keywords?: string;
  score?: number;
}

/* =========================================================
   STATIC SEARCH INDEX
========================================================= */

const staticSearchItems: SearchResult[] = [
  {
    id: "home",
    title: "Beranda",
    description:
      "Website resmi Kelurahan Amborawang Darat, Kecamatan Samboja Barat.",
    href: "/",
    category: "Halaman",
    keywords:
      "beranda home kelurahan amborawang darat website resmi informasi",
  },
  {
    id: "profil",
    title: "Profil Kelurahan",
    description:
      "Profil, sejarah, visi, misi, dan informasi Kelurahan Amborawang Darat.",
    href: "/profil",
    category: "Halaman",
    keywords:
      "profil sejarah visi misi kelurahan amborawang darat",
  },
  {
    id: "pemerintahan",
    title: "Pemerintahan Kelurahan",
    description:
      "Informasi aparatur dan struktur pemerintahan Kelurahan Amborawang Darat.",
    href: "/pemerintahan",
    category: "Halaman",
    keywords:
      "pemerintahan aparatur lurah struktur perangkat pegawai kelurahan",
  },
  {
    id: "wilayah",
    title: "Wilayah Kelurahan",
    description:
      "Informasi wilayah, RT, RW, dan data kewilayahan Kelurahan Amborawang Darat.",
    href: "/wilayah",
    category: "Halaman",
    keywords:
      "wilayah rt rw penduduk kewilayahan amborawang darat",
  },
  {
    id: "layanan",
    title: "Layanan Masyarakat",
    description:
      "Informasi persyaratan, prosedur, dan pelayanan administrasi kelurahan.",
    href: "/layanan",
    category: "Halaman",
    keywords:
      "layanan pelayanan surat administrasi persyaratan prosedur masyarakat",
  },
  {
    id: "berita",
    title: "Berita Kelurahan",
    description:
      "Berita, kegiatan, dan informasi terbaru Kelurahan Amborawang Darat.",
    href: "/berita",
    category: "Halaman",
    keywords:
      "berita informasi kegiatan terbaru pengumuman kelurahan",
  },
  {
    id: "galeri",
    title: "Galeri Kegiatan",
    description:
      "Dokumentasi foto dan kegiatan Kelurahan Amborawang Darat.",
    href: "/galeri",
    category: "Halaman",
    keywords: "galeri foto dokumentasi kegiatan kelurahan",
  },
  {
    id: "dokumen",
    title: "Dokumen Publik",
    description:
      "Dokumen, formulir, laporan, dan informasi publik kelurahan.",
    href: "/dokumen",
    category: "Halaman",
    keywords:
      "dokumen formulir download unduh laporan peraturan informasi publik",
  },
  {
    id: "kkn",
    title: "Tim KKN",
    description:
      "Informasi tim dan kegiatan KKN di Kelurahan Amborawang Darat.",
    href: "/tim-kkn",
    category: "Halaman",
    keywords: "kkn mahasiswa universitas kegiatan tim",
  },
  {
    id: "kontak",
    title: "Kontak Kelurahan",
    description:
      "Alamat, telepon, WhatsApp, dan informasi kontak Kelurahan Amborawang Darat.",
    href: "/kontak",
    category: "Halaman",
    keywords:
      "kontak alamat telepon whatsapp email kantor kelurahan",
  },
];

/* =========================================================
   HELPER
========================================================= */

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateScore(item: SearchResult, rawQuery: string) {
  const query = normalizeText(rawQuery);
  const title = normalizeText(item.title);
  const description = normalizeText(item.description);
  const keywords = normalizeText(item.keywords ?? "");

  if (!query) return 0;

  let score = 0;

  if (title === query) score += 100;
  if (title.startsWith(query)) score += 70;
  if (title.includes(query)) score += 50;
  if (keywords.includes(query)) score += 30;
  if (description.includes(query)) score += 20;

  const words = query.split(" ").filter(Boolean);

  words.forEach((word) => {
    if (title.includes(word)) score += 10;
    if (keywords.includes(word)) score += 5;
    if (description.includes(word)) score += 3;
  });

  return score;
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

/* =========================================================
   ICONS
========================================================= */

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="23"
      height="23"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PublicHeader({
  settings,
}: {
  settings: SiteSettings;
}) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [informationOpen, setInformationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [queryText, setQueryText] = useState("");
  const [dynamicSearchItems, setDynamicSearchItems] = useState<SearchResult[]>(
    [],
  );

  const [searchDataLoaded, setSearchDataLoaded] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  /* =======================================================
     HEADER SCROLL
  ======================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =======================================================
     CLOSE MENU WHEN ROUTE CHANGES
  ======================================================= */

  useEffect(() => {
    setMobileOpen(false);
    setInformationOpen(false);
    setSearchOpen(false);
    setQueryText("");
  }, [pathname]);

  /* =======================================================
     SEARCH MODAL BEHAVIOR
  ======================================================= */

  useEffect(() => {
    if (!searchOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const timeout = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  /* =======================================================
     LOAD FIRESTORE DATA ONLY WHEN SEARCH IS OPENED
  ======================================================= */

  useEffect(() => {
    if (!searchOpen || searchDataLoaded || searchLoading) {
      return;
    }

    let active = true;

    async function loadSearchData() {
      setSearchLoading(true);

      try {
        let posts: PostItem[] = demoPosts;
        let services: ServiceItem[] = demoServices;
        let documents: PublicDocument[] = demoDocuments;
        let officials: Official[] = demoOfficials;
        let albums: GalleryAlbum[] = demoAlbums;

        if (db) {
          const [
            postsSnapshot,
            servicesSnapshot,
            documentsSnapshot,
            officialsSnapshot,
            albumsSnapshot,
          ] = await Promise.all([
            getDocs(collection(db, "posts")),
            getDocs(collection(db, "services")),
            getDocs(collection(db, "documents")),
            getDocs(collection(db, "officials")),
            getDocs(collection(db, "galleryAlbums")),
          ]);

          posts = postsSnapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          })) as PostItem[];

          services = servicesSnapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          })) as ServiceItem[];

          documents = documentsSnapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          })) as PublicDocument[];

          officials = officialsSnapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          })) as Official[];

          albums = albumsSnapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          })) as GalleryAlbum[];
        }

        const items: SearchResult[] = [];

        posts
          .filter((post) => post.status === "published")
          .forEach((post) => {
            items.push({
              id: `post-${post.id ?? post.slug}`,
              title: post.title,
              description:
                post.summary ||
                post.content?.replace(/<[^>]+>/g, "").slice(0, 160) ||
                "Berita Kelurahan Amborawang Darat",
              href: `/berita/${post.slug}`,
              category: "Berita",
              keywords: `${post.category ?? ""} ${post.content ?? ""}`,
            });
          });

        services
          .filter((service) => service.isActive)
          .forEach((service) => {
            items.push({
              id: `service-${service.id ?? service.slug}`,
              title: service.name,
              description:
                service.summary ||
                "Informasi pelayanan Kelurahan Amborawang Darat",
              href: "/layanan",
              category: "Layanan",
              keywords: [
                service.category,
                ...(service.requirements ?? []),
                ...(service.procedures ?? []),
                service.duration,
                service.cost,
              ]
                .filter(Boolean)
                .join(" "),
            });
          });

        documents
          .filter((document) => document.isActive)
          .forEach((document) => {
            items.push({
              id: `document-${document.id ?? document.title}`,
              title: document.title,
              description:
                document.description ||
                "Dokumen publik Kelurahan Amborawang Darat",
              href: "/dokumen",
              category: "Dokumen",
              keywords: `${document.category ?? ""} ${document.year ?? ""} ${document.fileType ?? ""
                }`,
            });
          });

        officials
          .filter((official) => official.isActive)
          .forEach((official) => {
            items.push({
              id: `official-${official.id ?? official.name}`,
              title: official.name,
              description: `${official.title}${official.category ? ` • ${official.category}` : ""
                }`,
              href: "/pemerintahan",
              category: "Pemerintahan",
              keywords: `${official.title ?? ""} ${official.category ?? ""
                } ${official.description ?? ""}`,
            });
          });

        albums
          .filter((album) => album.status === "published")
          .forEach((album) => {
            items.push({
              id: `album-${album.id ?? album.slug}`,
              title: album.title,
              description:
                album.description ||
                "Dokumentasi kegiatan Kelurahan Amborawang Darat",
              href: "/galeri",
              category: "Galeri",
              keywords: `${album.category ?? ""} ${album.location ?? ""
                } ${album.eventDate ?? ""}`,
            });
          });

        if (active) {
          setDynamicSearchItems(items);
          setSearchDataLoaded(true);
        }
      } catch (error) {
        console.error("Gagal memuat data pencarian global:", error);

        if (active) {
          /* fallback demo tetap digunakan jika Firestore gagal */
          const fallbackItems: SearchResult[] = [];

          demoPosts
            .filter((post) => post.status === "published")
            .forEach((post) => {
              fallbackItems.push({
                id: `fallback-post-${post.id ?? post.slug}`,
                title: post.title,
                description: post.summary,
                href: `/berita/${post.slug}`,
                category: "Berita",
                keywords: `${post.category ?? ""} ${post.content ?? ""}`,
              });
            });

          demoServices
            .filter((service) => service.isActive)
            .forEach((service) => {
              fallbackItems.push({
                id: `fallback-service-${service.id ?? service.slug}`,
                title: service.name,
                description: service.summary,
                href: "/layanan",
                category: "Layanan",
                keywords: `${service.category ?? ""} ${(
                  service.requirements ?? []
                ).join(" ")}`,
              });
            });

          setDynamicSearchItems(fallbackItems);
          setSearchDataLoaded(true);
        }
      } finally {
        if (active) {
          setSearchLoading(false);
        }
      }
    }

    loadSearchData();

    return () => {
      active = false;
    };
  }, [searchOpen, searchDataLoaded, searchLoading]);

  /* =======================================================
     SEARCH RESULT
  ======================================================= */

  const searchResults = useMemo(() => {
    const cleanQuery = queryText.trim();

    if (cleanQuery.length < 2) {
      return [];
    }

    const allItems = [...staticSearchItems, ...dynamicSearchItems];

    return allItems
      .map((item) => ({
        ...item,
        score: calculateScore(item, cleanQuery),
      }))
      .filter((item) => (item.score ?? 0) > 0)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 8);
  }, [queryText, dynamicSearchItems]);

  const informationActive = informationMenu.some((item) =>
    isActivePath(pathname, item.href),
  );

  function openSearch() {
    setMobileOpen(false);
    setInformationOpen(false);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
    setQueryText("");
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (searchResults.length > 0) {
      window.location.href = searchResults[0].href;
    }
  }

  return (
    <>
      <header
        className={`${styles.siteHeader} ${isScrolled ? styles.scrolled : ""
          }`}
      >
        <div className={styles.headerContainer}>
          {/* BRAND */}
          <Link
            href="/"
            className={styles.brand}
            onClick={() => setMobileOpen(false)}
            aria-label={`Beranda ${settings.villageName}`}
          >
            <span className={styles.logoFrame}>
              <Image
                src={AMBORAWANG_LOGO}
                alt={`Logo Kelurahan ${settings.villageName}`}
                width={58}
                height={58}
                priority
                className={styles.logo}
              />
            </span>

            <span className={styles.brandText}>
              <span className={styles.officialLabel}>Website Resmi</span>

              <strong>{settings.villageName}</strong>

              <small>Kecamatan Samboja Barat</small>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            className={styles.desktopNav}
            aria-label="Navigasi utama"
          >
            {mainMenu.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ""
                    }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className={styles.dropdown}>
              <button
                type="button"
                className={`${styles.navLink} ${styles.dropdownButton} ${informationActive ? styles.navLinkActive : ""
                  }`}
                aria-haspopup="true"
              >
                Informasi
                <ChevronIcon />
              </button>

              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span>Informasi Publik</span>
                  <small>
                    Akses informasi Kelurahan Amborawang Darat
                  </small>
                </div>

                {informationMenu.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${styles.dropdownItem} ${active ? styles.dropdownItemActive : ""
                        }`}
                    >
                      <span>
                        <strong>{item.label}</strong>
                        <small>{item.description}</small>
                      </span>

                      <ArrowIcon />
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* ACTIONS */}
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.searchButton}
              onClick={openSearch}
              aria-label="Cari informasi"
              title="Cari informasi"
            >
              <SearchIcon />

              <span className={styles.searchButtonText}>Cari</span>

              <kbd className={styles.searchShortcut}>⌘ K</kbd>
            </button>

            <button
              type="button"
              className={styles.mobileMenuButton}
              onClick={() => setMobileOpen((current) => !current)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={
                mobileOpen
                  ? "Tutup menu navigasi"
                  : "Buka menu navigasi"
              }
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        <div
          id="mobile-navigation"
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

              <span>Cari informasi kelurahan...</span>
            </button>

            <div className={styles.mobileMenuList}>
              {[...mainMenu, ...informationMenu].map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.mobileNavLink} ${active ? styles.mobileNavLinkActive : ""
                      }`}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                    <ArrowIcon />
                  </Link>
                );
              })}
            </div>

            <div className={styles.mobileContact}>
              <small>Butuh informasi?</small>

              <strong>Kelurahan Amborawang Darat</strong>

              <Link
                href="/kontak"
                onClick={() => setMobileOpen(false)}
              >
                Lihat informasi kontak
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================
          GLOBAL SEARCH MODAL
      ==================================================== */}

      {searchOpen && (
        <div
          className={styles.searchOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSearch();
            }
          }}
        >
          <div
            className={styles.searchDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-search-title"
          >
            <div className={styles.searchDialogHeader}>
              <div>
                <span className={styles.searchEyebrow}>
                  Pencarian Global
                </span>

                <h2 id="global-search-title">
                  Apa yang sedang Anda cari?
                </h2>

                <p>
                  Temukan layanan, berita, dokumen, aparatur,
                  galeri, dan informasi kelurahan.
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

            <form
              className={styles.searchForm}
              onSubmit={handleSearchSubmit}
            >
              <SearchIcon />

              <input
                ref={inputRef}
                type="search"
                value={queryText}
                onChange={(event) =>
                  setQueryText(event.target.value)
                }
                placeholder="Contoh: surat domisili, berita, dokumen..."
                autoComplete="off"
                aria-label="Cari informasi"
              />

              {queryText && (
                <button
                  type="button"
                  className={styles.clearSearch}
                  onClick={() => {
                    setQueryText("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Hapus pencarian"
                >
                  <CloseIcon />
                </button>
              )}
            </form>

            <div className={styles.searchContent}>
              {/* INITIAL */}
              {queryText.trim().length < 2 && (
                <div className={styles.searchInitial}>
                  <div className={styles.searchHint}>
                    <SearchIcon />

                    <div>
                      <strong>Cari seluruh informasi website</strong>

                      <p>
                        Ketik minimal 2 karakter untuk mulai
                        melakukan pencarian.
                      </p>
                    </div>
                  </div>

                  <div className={styles.quickSearch}>
                    <span>Pintasan</span>

                    <div className={styles.quickSearchLinks}>
                      <button
                        type="button"
                        onClick={() => setQueryText("layanan")}
                      >
                        Layanan
                      </button>

                      <button
                        type="button"
                        onClick={() => setQueryText("berita")}
                      >
                        Berita
                      </button>

                      <button
                        type="button"
                        onClick={() => setQueryText("dokumen")}
                      >
                        Dokumen
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setQueryText("pemerintahan")
                        }
                      >
                        Pemerintahan
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* LOADING */}
              {queryText.trim().length >= 2 && searchLoading && (
                <div className={styles.loadingState}>
                  <span className={styles.spinner} />

                  <div>
                    <strong>Memuat informasi...</strong>
                    <p>
                      Menghubungkan pencarian dengan data
                      kelurahan.
                    </p>
                  </div>
                </div>
              )}

              {/* RESULTS */}
              {queryText.trim().length >= 2 &&
                !searchLoading &&
                searchResults.length > 0 && (
                  <>
                    <div className={styles.resultSummary}>
                      <span>
                        Hasil pencarian untuk
                        <strong> “{queryText.trim()}”</strong>
                      </span>

                      <small>
                        {searchResults.length} hasil paling relevan
                      </small>
                    </div>

                    <div className={styles.searchResults}>
                      {searchResults.map((result) => (
                        <Link
                          href={result.href}
                          key={result.id}
                          className={styles.searchResultItem}
                          onClick={closeSearch}
                        >
                          <div
                            className={styles.resultCategoryIcon}
                            data-category={result.category}
                          >
                            {result.category.charAt(0)}
                          </div>

                          <div className={styles.resultBody}>
                            <div className={styles.resultTop}>
                              <span
                                className={styles.resultCategory}
                              >
                                {result.category}
                              </span>

                              <ArrowIcon />
                            </div>

                            <strong>{result.title}</strong>

                            <p>{result.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}

              {/* NO RESULT */}
              {queryText.trim().length >= 2 &&
                !searchLoading &&
                searchResults.length === 0 && (
                  <div className={styles.noResult}>
                    <div className={styles.noResultIcon}>
                      <SearchIcon />
                    </div>

                    <h3>Informasi belum ditemukan</h3>

                    <p>
                      Tidak ada hasil yang sesuai dengan
                      <strong> “{queryText.trim()}”</strong>.
                      Coba gunakan kata yang lebih singkat atau
                      berbeda.
                    </p>

                    <Link href="/kontak" onClick={closeSearch}>
                      Hubungi Kelurahan
                    </Link>
                  </div>
                )}
            </div>

            <div className={styles.searchFooter}>
              <span>
                Pencarian Website Resmi Kelurahan Amborawang Darat
              </span>

              <span className={styles.escapeHint}>
                ESC untuk menutup
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}