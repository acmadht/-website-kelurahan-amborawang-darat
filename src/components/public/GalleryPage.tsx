"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./GalleryPage.module.css";

type GalleryItem = {
  id: number;
  title: string;
  category: "Pemerintahan" | "Masyarakat" | "KKN" | "Lingkungan";
  date: string;
  image: string;
  caption: string;
  size?: "wide" | "tall" | "normal";
};

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Kantor Kelurahan Amborawang Darat",
    category: "Pemerintahan",
    date: "19 September 2015",
    image: "/images/galeri/kantor-kelurahan.jpg",
    caption:
      "Dokumentasi bangunan Kantor Kelurahan Amborawang Darat.",
    size: "wide",
  },
  {
    id: 2,
    title: "Koordinasi Program Kerja KKN",
    category: "KKN",
    date: "6 Agustus 2026",
    image: "/images/galeri/koordinasi-kkn.jpg",
    caption:
      "Koordinasi program kerja bersama pihak Kelurahan Amborawang Darat.",
    size: "normal",
  },
  {
    id: 3,
    title: "Kerja Bakti Lingkungan",
    category: "Lingkungan",
    date: "8 Agustus 2026",
    image: "/images/galeri/kerja-bakti.jpg",
    caption:
      "Kegiatan kebersihan lingkungan bersama masyarakat.",
    size: "tall",
  },
  {
    id: 4,
    title: "Pelayanan Masyarakat",
    category: "Pemerintahan",
    date: "10 Agustus 2026",
    image: "/images/galeri/pelayanan-masyarakat.jpg",
    caption:
      "Dokumentasi pelayanan administrasi masyarakat di kantor kelurahan.",
    size: "normal",
  },
  {
    id: 5,
    title: "Kegiatan Warga",
    category: "Masyarakat",
    date: "Agustus 2026",
    image: "/images/galeri/kegiatan-warga.jpg",
    caption:
      "Dokumentasi partisipasi masyarakat dalam kegiatan lingkungan.",
    size: "wide",
  },
  {
    id: 6,
    title: "Dokumentasi KKN",
    category: "KKN",
    date: "Agustus 2026",
    image: "/images/galeri/dokumentasi-kkn.jpg",
    caption:
      "Dokumentasi kegiatan Kelompok KKN di Kelurahan Amborawang Darat.",
    size: "normal",
  },
];

const categories = [
  "Semua",
  "Pemerintahan",
  "Masyarakat",
  "KKN",
  "Lingkungan",
] as const;

function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
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

function GalleryIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m21 15-5-5L5 20" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = "/images/galeri/placeholder-gallery.svg";
      }}
    />
  );
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("Semua");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "Semua") return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <PublicShell>
      <main className={styles.page}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroPattern} aria-hidden="true" />

          <div className={`container ${styles.heroGrid}`}>
            <Reveal enabled>
              <div className={styles.heroCopy}>
                <div className={styles.heroBadge}>
                  <GalleryIcon />
                  <span>Dokumentasi Kelurahan</span>
                </div>

                <h1>
                  Galeri
                  <strong>Amborawang Darat</strong>
                </h1>

                <p>
                  Dokumentasi kegiatan pemerintahan, masyarakat, lingkungan,
                  dan program KKN di Kelurahan Amborawang Darat.
                </p>

                <div className={styles.heroMeta}>
                  <span><i />Dokumentasi kegiatan</span>
                  <span>Arsip visual kelurahan</span>
                </div>
              </div>
            </Reveal>

            <Reveal enabled delay={70}>
              <div className={styles.heroPreview}>
                <div className={styles.previewMain}>
                  <Photo
                    src={galleryItems[0].image}
                    alt={galleryItems[0].title}
                  />
                  <div className={styles.previewOverlay}>
                    <span>{galleryItems[0].category}</span>
                    <strong>{galleryItems[0].title}</strong>
                  </div>
                </div>

                <div className={styles.previewStats}>
                  <div>
                    <strong>{String(galleryItems.length).padStart(2, "0")}</strong>
                    <span>Dokumentasi</span>
                  </div>
                  <div>
                    <strong>{String(categories.length - 1).padStart(2, "0")}</strong>
                    <span>Kategori</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FILTER */}
        <section className={styles.filterSection}>
          <div className="container">
            <div className={styles.filterBar}>
              <div className={styles.filterIntro}>
                <span>Jelajahi Galeri</span>
                <strong>Pilih kategori dokumentasi</strong>
              </div>

              <div className={styles.filterTabs}>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={
                      activeCategory === category ? styles.activeTab : ""
                    }
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED */}
        <section className={styles.featuredSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>01</span>
                <div>
                  <span className={styles.eyebrow}>Dokumentasi Pilihan</span>
                  <h2>Momen dan aktivitas kelurahan</h2>
                </div>
              </div>
            </Reveal>

            <div className={styles.featuredGrid}>
              <Reveal enabled>
                <button
                  type="button"
                  className={styles.featuredMain}
                  onClick={() => setSelected(galleryItems[0])}
                >
                  <Photo
                    src={galleryItems[0].image}
                    alt={galleryItems[0].title}
                  />

                  <div className={styles.featuredOverlay}>
                    <div>
                      <span>{galleryItems[0].category}</span>
                      <h3>{galleryItems[0].title}</h3>
                      <small>{galleryItems[0].date}</small>
                    </div>

                    <span className={styles.expandButton}>
                      <ExpandIcon />
                    </span>
                  </div>
                </button>
              </Reveal>

              <div className={styles.featuredSide}>
                {galleryItems.slice(1, 3).map((item, index) => (
                  <Reveal key={item.id} enabled delay={index * 50}>
                    <button
                      type="button"
                      className={styles.featuredSmall}
                      onClick={() => setSelected(item)}
                    >
                      <Photo src={item.image} alt={item.title} />
                      <div className={styles.smallOverlay}>
                        <span>{item.category}</span>
                        <strong>{item.title}</strong>
                        <small>{item.date}</small>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY GRID */}
        <section className={styles.gallerySection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.galleryHeading}>
                <div>
                  <span className={styles.eyebrowLight}>Arsip Visual</span>
                  <h2>Dokumentasi kegiatan</h2>
                </div>

                <div className={styles.galleryCount}>
                  <strong>{String(filteredItems.length).padStart(2, "0")}</strong>
                  <span>foto ditampilkan</span>
                </div>
              </div>
            </Reveal>

            <div className={styles.galleryGrid}>
              {filteredItems.map((item, index) => (
                <Reveal
                  key={item.id}
                  enabled
                  delay={(index % 6) * 35}
                >
                  <button
                    type="button"
                    className={`${styles.galleryCard} ${
                      item.size === "wide"
                        ? styles.wide
                        : item.size === "tall"
                          ? styles.tall
                          : ""
                    }`}
                    onClick={() => setSelected(item)}
                  >
                    <Photo src={item.image} alt={item.title} />

                    <div className={styles.cardOverlay}>
                      <div>
                        <span>{item.category}</span>
                        <h3>{item.title}</h3>
                        <small>{item.date}</small>
                      </div>

                      <div className={styles.cardExpand}>
                        <ExpandIcon />
                      </div>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* INFO PANEL */}
        <section className={styles.infoSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.infoPanel}>
                <div>
                  <span>Dokumentasi Publik</span>
                  <h2>Galeri menjadi arsip visual kegiatan kelurahan.</h2>
                  <p>
                    Foto kegiatan dapat diperbarui secara berkala sebagai bagian
                    dari dokumentasi dan keterbukaan informasi publik.
                  </p>
                </div>

                <div className={styles.infoLinks}>
                  <Link href="/berita">
                    Lihat Berita
                    <ArrowIcon size={15} />
                  </Link>

                  <Link href="/kontak">
                    Kirim Dokumentasi
                    <ArrowIcon size={15} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.cta}>
                <div>
                  <span>Punya Dokumentasi?</span>
                  <h2>Sampaikan foto kegiatan kepada kelurahan.</h2>
                  <p>
                    Dokumentasi dapat diverifikasi terlebih dahulu sebelum
                    ditampilkan pada galeri publik.
                  </p>
                </div>

                <div className={styles.ctaActions}>
                  <Link href="/kontak" className={styles.ctaPrimary}>
                    Hubungi Kelurahan
                    <ArrowIcon />
                  </Link>

                  <Link href="/berita" className={styles.ctaSecondary}>
                    Lihat Berita
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* LIGHTBOX */}
        {selected && (
          <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            onClick={() => setSelected(null)}
          >
            <div
              className={styles.lightboxPanel}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setSelected(null)}
                aria-label="Tutup"
              >
                <CloseIcon />
              </button>

              <div className={styles.lightboxImage}>
                <Photo src={selected.image} alt={selected.title} />
              </div>

              <div className={styles.lightboxContent}>
                <span>{selected.category}</span>
                <h2>{selected.title}</h2>
                <small>{selected.date}</small>
                <p>{selected.caption}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </PublicShell>
  );
}
