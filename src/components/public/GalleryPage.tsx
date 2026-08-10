"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCollectionData } from "@/hooks/useFirestoreData";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import type { GalleryAlbum, GalleryPhoto, SiteSettings } from "@/types";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./GalleryPage.module.css";

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  caption: string;
  size?: "wide" | "tall" | "normal";
};

const staticKknItems: GalleryItem[] = [
  { id: "static-kkn-1", title: "Koordinasi Program Kerja KKN", category: "KKN", date: "6 Agustus 2026", image: "/images/galeri/koordinasi-kkn.jpg", caption: "Koordinasi program kerja bersama pihak Kelurahan Amborawang Darat.", size: "normal" },
  { id: "static-kkn-2", title: "Dokumentasi KKN", category: "KKN", date: "Agustus 2026", image: "/images/galeri/dokumentasi-kkn.jpg", caption: "Dokumentasi kegiatan Kelompok KKN di Kelurahan Amborawang Darat.", size: "normal" },
];
const sizes: GalleryItem["size"][] = ["wide", "normal", "tall", "normal", "wide", "normal"];

function displayDate(value?: string) {
  if (!value) return "Tanggal belum diisi";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T00:00:00`));
  }
  return value;
}

function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-5-5L5 20" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    <img src={src} alt={alt} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/galeri/placeholder-gallery.svg"; }} />
  );
}

export default function GalleryPage({ initialAlbums = [], initialPhotos = [], initialSettings }: { initialAlbums?: GalleryAlbum[]; initialPhotos?: GalleryPhoto[]; initialSettings?: SiteSettings }) {
  const { data: albums } = useCollectionData<GalleryAlbum>("galleryAlbums", initialAlbums);
  const { data: photos } = useCollectionData<GalleryPhoto>("galleryPhotos", initialPhotos);
  const { settings } = usePublicSettings(initialSettings);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const galleryItems = useMemo(() => {
    const publishedAlbums = albums.filter((album) => album.status === "published" && album.category !== "KKN");
    const remoteItems: GalleryItem[] = [];

    publishedAlbums.forEach((album, albumIndex) => {
      const albumPhotos = photos.filter((photo) => photo.albumId === album.id && photo.imageUrl);
      if (albumPhotos.length) {
        albumPhotos.forEach((photo, photoIndex) => {
          remoteItems.push({
            id: photo.id || `${album.id}-photo-${photoIndex}`,
            title: photo.caption || album.title,
            category: album.category || "Kelurahan",
            date: displayDate(album.eventDate),
            image: photo.imageUrl,
            caption: photo.caption || album.description || album.title,
            size: sizes[(remoteItems.length + albumIndex) % sizes.length],
          });
        });
      } else if (album.coverImageUrl) {
        remoteItems.push({
          id: album.id || `album-${albumIndex}`,
          title: album.title,
          category: album.category || "Kelurahan",
          date: displayDate(album.eventDate),
          image: album.coverImageUrl,
          caption: album.description || album.title,
          size: sizes[remoteItems.length % sizes.length],
        });
      }
    });

    return [...remoteItems, ...staticKknItems];
  }, [albums, photos]);

  const categories = useMemo(() => ["Semua", ...Array.from(new Set(galleryItems.map((item) => item.category)))], [galleryItems]);

  useEffect(() => {
    if (!categories.includes(activeCategory)) setActiveCategory("Semua");
  }, [activeCategory, categories]);

  const filteredItems = useMemo(() => activeCategory === "Semua" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory), [activeCategory, galleryItems]);
  const featured = galleryItems[0];

  if (!featured) return null;

  return (
    <PublicShell>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroPattern} aria-hidden="true" />
          <div className={`container ${styles.heroGrid}`}>
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.heroCopy}>
                <div className={styles.heroBadge}><GalleryIcon /><span>Dokumentasi Kelurahan</span></div>
                <h1>Galeri<strong>{settings.villageName}</strong></h1>
                <p>Dokumentasi kegiatan pemerintahan, masyarakat, lingkungan, dan program KKN di Kelurahan {settings.villageName}.</p>
                <div className={styles.heroMeta}><span><i />Dokumentasi kegiatan</span><span>Arsip visual kelurahan</span></div>
              </div>
            </Reveal>

            <Reveal enabled={settings.animationEnabled} delay={70}>
              <div className={styles.heroPreview}>
                <div className={styles.previewMain}>
                  <Photo src={featured.image} alt={featured.title} />
                  <div className={styles.previewOverlay}><span>{featured.category}</span><strong>{featured.title}</strong></div>
                </div>
                <div className={styles.previewStats}>
                  <div><strong>{String(galleryItems.length).padStart(2, "0")}</strong><span>Dokumentasi</span></div>
                  <div><strong>{String(categories.length - 1).padStart(2, "0")}</strong><span>Kategori</span></div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.filterSection}>
          <div className="container">
            <div className={styles.filterBar}>
              <div className={styles.filterIntro}><span>Jelajahi Galeri</span><strong>Pilih kategori dokumentasi</strong></div>
              <div className={styles.filterTabs}>
                {categories.map((category) => (
                  <button key={category} type="button" onClick={() => setActiveCategory(category)} className={activeCategory === category ? styles.activeTab : ""}>{category}</button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.featuredSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}><div className={styles.sectionHeading}><span className={styles.sectionNumber}>01</span><div><span className={styles.eyebrow}>Dokumentasi Pilihan</span><h2>Momen dan aktivitas kelurahan</h2></div></div></Reveal>
            <div className={styles.featuredGrid}>
              <Reveal enabled={settings.animationEnabled}>
                <button type="button" className={styles.featuredMain} onClick={() => setSelected(featured)}>
                  <Photo src={featured.image} alt={featured.title} />
                  <div className={styles.featuredOverlay}><div><span>{featured.category}</span><h3>{featured.title}</h3><small>{featured.date}</small></div><span className={styles.expandButton}><ExpandIcon /></span></div>
                </button>
              </Reveal>
              <div className={styles.featuredSide}>
                {galleryItems.slice(1, 3).map((item, index) => (
                  <Reveal key={item.id} enabled delay={index * 50}>
                    <button type="button" className={styles.featuredSmall} onClick={() => setSelected(item)}>
                      <Photo src={item.image} alt={item.title} />
                      <div className={styles.smallOverlay}><span>{item.category}</span><strong>{item.title}</strong><small>{item.date}</small></div>
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.gallerySection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.galleryHeading}>
                <div><span className={styles.eyebrowLight}>Arsip Visual</span><h2>Dokumentasi kegiatan</h2></div>
                <div className={styles.galleryCount}><strong>{String(filteredItems.length).padStart(2, "0")}</strong><span>foto ditampilkan</span></div>
              </div>
            </Reveal>
            <div className={styles.galleryGrid}>
              {filteredItems.map((item, index) => (
                <Reveal key={item.id} enabled delay={(index % 6) * 35}>
                  <button type="button" className={`${styles.galleryCard} ${item.size === "wide" ? styles.wide : item.size === "tall" ? styles.tall : ""}`} onClick={() => setSelected(item)}>
                    <Photo src={item.image} alt={item.title} />
                    <div className={styles.cardOverlay}><div><span>{item.category}</span><h3>{item.title}</h3><small>{item.date}</small></div><div className={styles.cardExpand}><ExpandIcon /></div></div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.infoSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.infoPanel}>
                <div><span>Dokumentasi Publik</span><h2>Galeri menjadi arsip visual kegiatan kelurahan.</h2><p>Foto kegiatan dapat diperbarui secara berkala sebagai bagian dari dokumentasi dan keterbukaan informasi publik.</p></div>
                <div className={styles.infoLinks}><Link href="/berita">Lihat Berita <ArrowIcon size={15} /></Link><Link href="/kontak">Kirim Dokumentasi <ArrowIcon size={15} /></Link></div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.cta}>
                <div><span>Punya Dokumentasi?</span><h2>Sampaikan foto kegiatan kepada kelurahan.</h2><p>Dokumentasi dapat diverifikasi terlebih dahulu sebelum ditampilkan pada galeri publik.</p></div>
                <div className={styles.ctaActions}><Link href="/kontak" className={styles.ctaPrimary}>Hubungi Kelurahan <ArrowIcon /></Link><Link href="/berita" className={styles.ctaSecondary}>Lihat Berita</Link></div>
              </div>
            </Reveal>
          </div>
        </section>

        {selected && (
          <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}>
            <div className={styles.lightboxPanel} onClick={(event) => event.stopPropagation()}>
              <button type="button" className={styles.closeButton} onClick={() => setSelected(null)} aria-label="Tutup"><CloseIcon /></button>
              <div className={styles.lightboxImage}><Photo src={selected.image} alt={selected.title} /></div>
              <div className={styles.lightboxContent}><span>{selected.category}</span><h2>{selected.title}</h2><small>{selected.date}</small><p>{selected.caption}</p></div>
            </div>
          </div>
        )}
      </main>
    </PublicShell>
  );
}
