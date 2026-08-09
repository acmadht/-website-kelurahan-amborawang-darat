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
import {
  collection,
  getDocs,
} from "firebase/firestore";

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

const mainMenu = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Pemerintahan", href: "/pemerintahan" },
  { label: "Layanan", href: "/layanan" },
  { label: "Berita", href: "/berita" },
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

const staticSearchItems: SearchResult[] = [
  {
    id: "home",
    title: "Beranda",
    description:
      "Website resmi Kelurahan Amborawang Darat.",
    href: "/",
    category: "Halaman",
    keywords:
      "beranda home kelurahan amborawang darat website resmi",
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
      "pemerintahan aparatur lurah struktur perangkat pegawai",
  },
  {
    id: "wilayah",
    title: "Wilayah Kelurahan",
    description:
      "Informasi wilayah dan data kewilayahan Amborawang Darat.",
    href: "/wilayah",
    category: "Halaman",
    keywords:
      "wilayah rt rw penduduk kewilayahan amborawang darat",
  },
  {
    id: "layanan",
    title: "Layanan Masyarakat",
    description:
      "Informasi pelayanan administrasi dan persyaratan kelurahan.",
    href: "/layanan",
    category: "Halaman",
    keywords:
      "layanan pelayanan surat administrasi persyaratan masyarakat",
  },
  {
    id: "berita",
    title: "Berita Kelurahan",
    description:
      "Berita dan informasi terbaru Kelurahan Amborawang Darat.",
    href: "/berita",
    category: "Halaman",
    keywords:
      "berita informasi kegiatan terbaru pengumuman",
  },
  {
    id: "galeri",
    title: "Galeri Kegiatan",
    description:
      "Dokumentasi kegiatan Kelurahan Amborawang Darat.",
    href: "/galeri",
    category: "Halaman",
    keywords: "galeri foto dokumentasi kegiatan",
  },
  {
    id: "dokumen",
    title: "Dokumen Publik",
    description:
      "Dokumen dan informasi publik Kelurahan Amborawang Darat.",
    href: "/dokumen",
    category: "Halaman",
    keywords:
      "dokumen formulir download unduh informasi publik",
  },
  {
    id: "kkn",
    title: "Tim KKN Reguler Amborawang Darat",
    description:
      "Profil dan struktur Tim KKN Reguler Amborawang Darat 2026.",
    href: "/tim-kkn",
    category: "Halaman",
    keywords:
      "tim kkn kkn reguler kelompok 2 mahasiswa amborawang darat 2026",
  },
  {
    id: "kontak",
    title: "Kontak Kelurahan",
    description:
      "Informasi kontak Kelurahan Amborawang Darat.",
    href: "/kontak",
    category: "Halaman",
    keywords:
      "kontak alamat telepon whatsapp email kantor",
  },
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateScore(
  item: SearchResult,
  rawQuery: string,
) {
  const query = normalizeText(rawQuery);
  const title = normalizeText(item.title);
  const description = normalizeText(
    item.description,
  );
  const keywords = normalizeText(
    item.keywords ?? "",
  );

  if (!query) return 0;

  let score = 0;

  if (title === query) score += 100;
  if (title.startsWith(query)) score += 70;
  if (title.includes(query)) score += 50;
  if (keywords.includes(query)) score += 30;
  if (description.includes(query)) score += 20;

  query
    .split(" ")
    .filter(Boolean)
    .forEach((word) => {
      if (title.includes(word)) score += 10;
      if (keywords.includes(word)) score += 5;
      if (description.includes(word)) score += 3;
    });

  return score;
}

function isActivePath(
  pathname: string,
  href: string,
) {
  if (href === "/") {
    return pathname === "/";
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

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

async function promiseWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 3000,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => {
        reject(
          new Error("Search request timeout"),
        );
      }, timeoutMs);
    }),
  ]);
}

export default function PublicHeader({
  settings,
}: {
  settings: SiteSettings;
}) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [isScrolled, setIsScrolled] =
    useState(false);

  const [queryText, setQueryText] =
    useState("");

  const [
    dynamicSearchItems,
    setDynamicSearchItems,
  ] = useState<SearchResult[]>([]);

  const [
    searchDataLoaded,
    setSearchDataLoaded,
  ] = useState(false);

  const [
    searchBackgroundLoading,
    setSearchBackgroundLoading,
  ] = useState(false);

  const inputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(
        window.scrollY > 12,
      );
    }

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setQueryText("");
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow =
      "hidden";

    const timeout =
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 60);

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.clearTimeout(timeout);

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        "";
    };
  }, [searchOpen]);

  useEffect(() => {
    if (
      !searchOpen ||
      searchDataLoaded ||
      searchBackgroundLoading
    ) {
      return;
    }

    let active = true;

    async function loadSearchData() {
      setSearchBackgroundLoading(true);

      try {
        if (!db) {
          if (active) {
            setSearchDataLoaded(true);
          }

          return;
        }

        const results =
          await promiseWithTimeout(
            Promise.allSettled([
              getDocs(
                collection(db, "posts"),
              ),
              getDocs(
                collection(
                  db,
                  "services",
                ),
              ),
              getDocs(
                collection(
                  db,
                  "documents",
                ),
              ),
              getDocs(
                collection(
                  db,
                  "officials",
                ),
              ),
              getDocs(
                collection(
                  db,
                  "galleryAlbums",
                ),
              ),
            ]),
            3500,
          );

        if (!active) {
          return;
        }

        const items: SearchResult[] =
          [];

        const [
          postsResult,
          servicesResult,
          documentsResult,
          officialsResult,
          albumsResult,
        ] = results;

        if (
          postsResult.status ===
          "fulfilled"
        ) {
          const posts =
            postsResult.value.docs.map(
              (docItem) => ({
                id: docItem.id,
                ...docItem.data(),
              }),
            ) as PostItem[];

          posts
            .filter(
              (post) =>
                post.status ===
                "published",
            )
            .forEach((post) => {
              items.push({
                id: `post-${post.id ?? post.slug}`,
                title: post.title,
                description:
                  post.summary ||
                  post.content
                    ?.replace(
                      /<[^>]+>/g,
                      "",
                    )
                    .slice(0, 160) ||
                  "Berita Kelurahan Amborawang Darat",
                href: `/berita/${post.slug}`,
                category: "Berita",
                keywords: `${post.category ?? ""} ${post.content ?? ""}`,
              });
            });
        }

        if (
          servicesResult.status ===
          "fulfilled"
        ) {
          const services =
            servicesResult.value.docs.map(
              (docItem) => ({
                id: docItem.id,
                ...docItem.data(),
              }),
            ) as ServiceItem[];

          services
            .filter(
              (service) =>
                service.isActive,
            )
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
                  ...(service.requirements ??
                    []),
                  ...(service.procedures ??
                    []),
                  service.duration,
                  service.cost,
                ]
                  .filter(Boolean)
                  .join(" "),
              });
            });
        }

        if (
          documentsResult.status ===
          "fulfilled"
        ) {
          const documents =
            documentsResult.value.docs.map(
              (docItem) => ({
                id: docItem.id,
                ...docItem.data(),
              }),
            ) as PublicDocument[];

          documents
            .filter(
              (document) =>
                document.isActive,
            )
            .forEach((document) => {
              items.push({
                id: `document-${document.id ?? document.title}`,
                title:
                  document.title,
                description:
                  document.description ||
                  "Dokumen publik Kelurahan Amborawang Darat",
                href: "/dokumen",
                category: "Dokumen",
                keywords: `${document.category ?? ""} ${document.year ?? ""}`,
              });
            });
        }

        if (
          officialsResult.status ===
          "fulfilled"
        ) {
          const officials =
            officialsResult.value.docs.map(
              (docItem) => ({
                id: docItem.id,
                ...docItem.data(),
              }),
            ) as Official[];

          officials
            .filter(
              (official) =>
                official.isActive,
            )
            .forEach((official) => {
              items.push({
                id: `official-${official.id ?? official.name}`,
                title:
                  official.name,
                description:
                  official.title,
                href: "/pemerintahan",
                category:
                  "Pemerintahan",
                keywords: `${official.title ?? ""} ${official.category ?? ""}`,
              });
            });
        }

        if (
          albumsResult.status ===
          "fulfilled"
        ) {
          const albums =
            albumsResult.value.docs.map(
              (docItem) => ({
                id: docItem.id,
                ...docItem.data(),
              }),
            ) as GalleryAlbum[];

          albums
            .filter(
              (album) =>
                album.status ===
                "published",
            )
            .forEach((album) => {
              items.push({
                id: `album-${album.id ?? album.slug}`,
                title: album.title,
                description:
                  album.description ||
                  "Dokumentasi kegiatan Kelurahan Amborawang Darat",
                href: "/galeri",
                category: "Galeri",
                keywords: `${album.category ?? ""} ${album.location ?? ""}`,
              });
            });
        }

        setDynamicSearchItems(
          items,
        );

        setSearchDataLoaded(true);
      } catch (error) {
        console.warn(
          "Pencarian Firestore melewati batas waktu:",
          error,
        );

        if (active) {
          setSearchDataLoaded(true);
        }
      } finally {
        if (active) {
          setSearchBackgroundLoading(
            false,
          );
        }
      }
    }

    loadSearchData();

    return () => {
      active = false;
    };
  }, [
    searchOpen,
    searchDataLoaded,
    searchBackgroundLoading,
  ]);

  const searchResults = useMemo(() => {
    const cleanQuery =
      queryText.trim();

    if (cleanQuery.length < 2) {
      return [];
    }

    return [
      ...staticSearchItems,
      ...dynamicSearchItems,
    ]
      .map((item) => ({
        ...item,
        score: calculateScore(
          item,
          cleanQuery,
        ),
      }))
      .filter(
        (item) =>
          (item.score ?? 0) > 0,
      )
      .sort(
        (a, b) =>
          (b.score ?? 0) -
          (a.score ?? 0),
      )
      .slice(0, 8);
  }, [
    queryText,
    dynamicSearchItems,
  ]);

  const informationActive =
    informationMenu.some((item) =>
      isActivePath(
        pathname,
        item.href,
      ),
    );

  function openSearch() {
    setMobileOpen(false);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
    setQueryText("");
  }

  function handleSearchSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      searchResults.length > 0
    ) {
      window.location.href =
        searchResults[0].href;
    }
  }

  return (
    <>
      <header
        className={`${styles.siteHeader} ${isScrolled
            ? styles.scrolled
            : ""
          }`}
      >
        <div
          className={
            styles.headerContainer
          }
        >
          <Link
            href="/"
            className={styles.brand}
            aria-label={`Beranda ${settings.villageName}`}
          >
            <span
              className={
                styles.logoFrame
              }
            >
              <Image
                src={AMBORAWANG_LOGO}
                alt={`Logo Kelurahan ${settings.villageName}`}
                width={58}
                height={58}
                priority
                className={styles.logo}
              />
            </span>

            <span
              className={
                styles.brandText
              }
            >
              <span
                className={
                  styles.officialLabel
                }
              >
                Website Resmi
              </span>

              <strong>
                {settings.villageName}
              </strong>

              <small>
                Kecamatan Samboja Barat
              </small>
            </span>
          </Link>

          <nav
            className={
              styles.desktopNav
            }
            aria-label="Navigasi utama"
          >
            {mainMenu.map((item) => {
              const active =
                isActivePath(
                  pathname,
                  item.href,
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${active
                      ? styles.navLinkActive
                      : ""
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div
              className={
                styles.dropdown
              }
            >
              <button
                type="button"
                className={`${styles.navLink} ${styles.dropdownButton} ${informationActive
                    ? styles.navLinkActive
                    : ""
                  }`}
              >
                Informasi
                <ChevronIcon />
              </button>

              <div
                className={
                  styles.dropdownMenu
                }
              >
                <div
                  className={
                    styles.dropdownHeader
                  }
                >
                  <span>
                    Informasi Publik
                  </span>

                  <small>
                    Akses informasi
                    Kelurahan
                    Amborawang Darat
                  </small>
                </div>

                {informationMenu.map(
                  (item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={
                        styles.dropdownItem
                      }
                    >
                      <span>
                        <strong>
                          {item.label}
                        </strong>

                        <small>
                          {
                            item.description
                          }
                        </small>
                      </span>

                      <ArrowIcon />
                    </Link>
                  ),
                )}
              </div>
            </div>
          </nav>

          <div
            className={
              styles.headerActions
            }
          >
            <button
              type="button"
              className={
                styles.searchButton
              }
              onClick={openSearch}
              aria-label="Cari informasi"
            >
              <SearchIcon />

              <span
                className={
                  styles.searchButtonText
                }
              >
                Cari
              </span>
            </button>

            <button
              type="button"
              className={
                styles.mobileMenuButton
              }
              onClick={() =>
                setMobileOpen(
                  (value) => !value,
                )
              }
              aria-expanded={
                mobileOpen
              }
            >
              {mobileOpen ? (
                <CloseIcon />
              ) : (
                <MenuIcon />
              )}
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div
          className={
            styles.searchOverlay
          }
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeSearch();
            }
          }}
        >
          <div
            className={
              styles.searchDialog
            }
            role="dialog"
            aria-modal="true"
          >
            <div
              className={
                styles.searchDialogHeader
              }
            >
              <div>
                <span
                  className={
                    styles.searchEyebrow
                  }
                >
                  Pencarian Global
                </span>

                <h2>
                  Apa yang sedang Anda cari?
                </h2>

                <p>
                  Temukan layanan,
                  berita, dokumen,
                  aparatur, galeri, dan
                  informasi kelurahan.
                </p>
              </div>

              <button
                type="button"
                className={
                  styles.closeSearchButton
                }
                onClick={closeSearch}
              >
                <CloseIcon />
              </button>
            </div>

            <form
              className={
                styles.searchForm
              }
              onSubmit={
                handleSearchSubmit
              }
            >
              <SearchIcon />

              <input
                ref={inputRef}
                type="search"
                value={queryText}
                onChange={(event) =>
                  setQueryText(
                    event.target.value,
                  )
                }
                placeholder="Contoh: tim kkn, surat domisili, berita..."
                autoComplete="off"
              />

              {queryText && (
                <button
                  type="button"
                  className={
                    styles.clearSearch
                  }
                  onClick={() =>
                    setQueryText("")
                  }
                >
                  <CloseIcon />
                </button>
              )}
            </form>

            <div
              className={
                styles.searchContent
              }
            >
              {queryText.trim().length <
                2 && (
                  <div
                    className={
                      styles.searchInitial
                    }
                  >
                    <div
                      className={
                        styles.searchHint
                      }
                    >
                      <SearchIcon />

                      <div>
                        <strong>
                          Cari seluruh
                          informasi website
                        </strong>

                        <p>
                          Ketik minimal 2
                          karakter untuk
                          mulai mencari.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {queryText.trim().length >=
                2 &&
                searchResults.length >
                0 && (
                  <>
                    <div
                      className={
                        styles.resultSummary
                      }
                    >
                      <span>
                        Hasil untuk
                        <strong>
                          {" "}
                          “
                          {queryText.trim()}
                          ”
                        </strong>
                      </span>

                      {searchBackgroundLoading && (
                        <small>
                          Memuat data
                          tambahan...
                        </small>
                      )}
                    </div>

                    <div
                      className={
                        styles.searchResults
                      }
                    >
                      {searchResults.map(
                        (result) => (
                          <Link
                            href={
                              result.href
                            }
                            key={
                              result.id
                            }
                            className={
                              styles.searchResultItem
                            }
                            onClick={
                              closeSearch
                            }
                          >
                            <div
                              className={
                                styles.resultCategoryIcon
                              }
                            >
                              {result.category.charAt(
                                0,
                              )}
                            </div>

                            <div
                              className={
                                styles.resultBody
                              }
                            >
                              <div
                                className={
                                  styles.resultTop
                                }
                              >
                                <span
                                  className={
                                    styles.resultCategory
                                  }
                                >
                                  {
                                    result.category
                                  }
                                </span>

                                <ArrowIcon />
                              </div>

                              <strong>
                                {
                                  result.title
                                }
                              </strong>

                              <p>
                                {
                                  result.description
                                }
                              </p>
                            </div>
                          </Link>
                        ),
                      )}
                    </div>
                  </>
                )}

              {queryText.trim().length >=
                2 &&
                searchResults.length ===
                0 &&
                !searchBackgroundLoading && (
                  <div
                    className={
                      styles.noResult
                    }
                  >
                    <div
                      className={
                        styles.noResultIcon
                      }
                    >
                      <SearchIcon />
                    </div>

                    <h3>
                      Informasi belum
                      ditemukan
                    </h3>

                    <p>
                      Tidak ada hasil yang
                      sesuai dengan
                      <strong>
                        {" "}
                        “
                        {queryText.trim()}
                        ”
                      </strong>
                      .
                    </p>
                  </div>
                )}

              {queryText.trim().length >=
                2 &&
                searchResults.length ===
                0 &&
                searchBackgroundLoading && (
                  <div
                    className={
                      styles.loadingState
                    }
                  >
                    <span
                      className={
                        styles.spinner
                      }
                    />

                    <div>
                      <strong>
                        Mencari data
                        tambahan...
                      </strong>

                      <p>
                        Hasil halaman
                        lokal tetap akan
                        muncul langsung.
                      </p>
                    </div>
                  </div>
                )}
            </div>

            <div
              className={
                styles.searchFooter
              }
            >
              <span>
                Pencarian Website Resmi
                Kelurahan Amborawang
                Darat
              </span>

              <span>
                ESC untuk menutup
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}