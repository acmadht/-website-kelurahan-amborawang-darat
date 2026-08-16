"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCollectionData } from "@/hooks/useFirestoreData";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import type { PostItem, SiteSettings } from "@/types";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import { displayPostDate, mergeKknPosts, mergePublicPosts } from "./newsData";
import styles from "./NewsPage.module.css";

function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h13v16H4z" />
      <path d="M17 8h3v12h-3" />
      <path d="M7 8h7M7 12h7M7 16h4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
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
        event.currentTarget.src = "/images/berita/placeholder-news.svg";
      }}
    />
  );
}

type NewsScope = "village" | "kkn";

export default function NewsPage({
  initialPosts = [],
  initialSettings,
  scope = "village",
}: {
  initialPosts?: PostItem[];
  initialSettings?: SiteSettings;
  scope?: NewsScope;
}) {
  const isKkn = scope === "kkn";
  const { data: remotePosts } = useCollectionData<PostItem>(
    "posts",
    initialPosts,
    [{ field: "status", op: "==", value: "published" }],
    !isKkn,
  );
  const { settings } = usePublicSettings(initialSettings);
  const articleBase = isKkn ? "/kkn/berita" : "/berita";

  const posts = useMemo(
    () => (isKkn ? mergeKknPosts(remotePosts) : mergePublicPosts(remotePosts)),
    [isKkn, remotePosts],
  );

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(posts.map((item) => item.category).filter(Boolean)))],
    [posts],
  );
  const [activeCategory, setActiveCategory] = useState("Semua");

  useEffect(() => {
    if (!categories.includes(activeCategory)) setActiveCategory("Semua");
  }, [activeCategory, categories]);

  const filteredNews = useMemo(() => {
    if (activeCategory === "Semua") return posts;
    return posts.filter((item) => item.category === activeCategory);
  }, [activeCategory, posts]);

  const featured = posts.find((item) => item.isFeatured) ?? posts[0];
  const sideNews = posts.filter((item) => item.slug !== featured?.slug).slice(0, 3);

  if (!featured) return null;

  return (
    <PublicShell>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroPattern} aria-hidden="true" />
          <div className={`container ${styles.heroGrid}`}>
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.heroCopy}>
                <div className={styles.heroBadge}>
                  <NewsIcon />
                  <span>{isKkn ? "Publikasi KKN" : "Informasi Kelurahan"}</span>
                </div>
                <h1>
                  {isKkn ? "Berita" : "Berita"}
                  <strong>{isKkn ? "KKN Amborawang Darat" : settings.villageName}</strong>
                </h1>
                <p>
                  {isKkn
                    ? "Berita, aktivitas, program kerja, dan perkembangan kegiatan Tim KKN Reguler di Kelurahan Amborawang Darat disajikan pada halaman khusus KKN."
                    : `Informasi pelayanan, lingkungan, kegiatan masyarakat, dan perkembangan Kelurahan ${settings.villageName} dalam satu halaman yang ringkas dan mudah dipindai.`}
                </p>
                <div className={styles.heroMeta}>
                  <span><i />{isKkn ? "Dokumentasi kegiatan KKN" : "Informasi resmi kelurahan"}</span>
                  <span>Tanggal & waktu publikasi tercantum</span>
                </div>
              </div>
            </Reveal>

            <Reveal enabled={settings.animationEnabled} delay={70}>
              <div className={styles.heroTicker}>
                <div className={styles.tickerHead}>
                  <span>{isKkn ? "Berita KKN Terkini" : "Berita Terkini"}</span>
                  <small>{String(posts.length).padStart(2, "0")} artikel</small>
                </div>
                <div className={styles.tickerList}>
                  {posts.slice(0, 5).map((item, index) => (
                    <Link key={item.slug} href={`${articleBase}/${item.slug}`} className={styles.tickerItem}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <small>{item.category} · {displayPostDate(item.publishedDate)} · {item.publishedTime || "Waktu belum diisi"}</small>
                        <strong>{item.title}</strong>
                      </div>
                      <ArrowIcon size={15} />
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.categorySection}>
          <div className="container">
            <div className={styles.categoryBar}>
              <div className={styles.categoryIntro}>
                <span>{isKkn ? "Jelajahi Publikasi KKN" : "Jelajahi Berita"}</span>
                <strong>Pilih kategori informasi</strong>
              </div>
              <div className={styles.categoryTabs}>
                {categories.map((category) => (
                  <button key={category} type="button" onClick={() => setActiveCategory(category)} className={activeCategory === category ? styles.activeTab : ""}>
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.featuredSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>01</span>
                <div>
                  <span className={styles.eyebrow}>Sorotan Utama</span>
                  <h2>{isKkn ? "Aktivitas dan program Tim KKN" : "Informasi yang perlu diketahui warga"}</h2>
                </div>
              </div>
            </Reveal>

            <div className={styles.featuredGrid}>
              <Reveal enabled={settings.animationEnabled}>
                <Link href={`${articleBase}/${featured.slug}`} className={styles.featuredCard}>
                  <div className={styles.featuredImage}>
                    <Photo src={featured.coverImageUrl} alt={featured.title} />
                    <span>{featured.category}</span>
                  </div>
                  <div className={styles.featuredBody}>
                    <div className={styles.articleMeta}>
                      <span><CalendarIcon />{displayPostDate(featured.publishedDate)}</span>
                      <span><ClockIcon />{featured.publishedTime || "Waktu belum diisi"}</span>
                    </div>
                    <h3>{featured.title}</h3>
                    <p>{featured.summary}</p>
                    <span className={styles.readMore}>Baca selengkapnya <ArrowIcon size={16} /></span>
                  </div>
                </Link>
              </Reveal>

              <div className={styles.sideNews}>
                {sideNews.map((item, index) => (
                  <Reveal key={item.slug} enabled delay={index * 55}>
                    <Link href={`${articleBase}/${item.slug}`} className={styles.sideCard}>
                      <div className={styles.sideImage}><Photo src={item.coverImageUrl} alt={item.title} /></div>
                      <div className={styles.sideBody}>
                        <span>{item.category}</span>
                        <h3>{item.title}</h3>
                        <p>{item.summary}</p>
                        <div className={styles.sideFooter}>
                          <small>{displayPostDate(item.publishedDate)} · {item.publishedTime || "Waktu belum diisi"}</small>
                          <ArrowIcon size={16} />
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.archiveSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.archiveHeading}>
                <div>
                  <span className={styles.eyebrowLight}>{isKkn ? "Arsip KKN" : "Arsip Berita"}</span>
                  <h2>{isKkn ? "Publikasi kegiatan KKN" : "Informasi terbaru kelurahan"}</h2>
                </div>
                <div className={styles.archiveCount}><strong>{String(filteredNews.length).padStart(2, "0")}</strong><span>artikel ditampilkan</span></div>
              </div>
            </Reveal>

            <div className={styles.archiveGrid}>
              {filteredNews.map((item, index) => (
                <Reveal key={item.slug} enabled delay={(index % 6) * 45}>
                  <Link href={`${articleBase}/${item.slug}`} className={styles.newsCard}>
                    <div className={styles.newsImage}><Photo src={item.coverImageUrl} alt={item.title} /><span>{item.category}</span></div>
                    <div className={styles.newsBody}>
                      <div className={styles.newsDateLine}>
                        <span><CalendarIcon />{displayPostDate(item.publishedDate)}</span>
                        <span><ClockIcon />{item.publishedTime || "Waktu belum diisi"}</span>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                      <div className={styles.newsFooter}><span>Baca berita</span><ArrowIcon size={16} /></div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.infoSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.infoPanel}>
                <div>
                  <span>{isKkn ? "Ruang KKN" : "Informasi Publik"}</span>
                  <h2>{isKkn ? "Berita KKN kini terpisah dari berita resmi kelurahan." : "Berita menjadi bagian dari keterbukaan informasi kelurahan."}</h2>
                </div>
                <div className={styles.infoLinks}>
                  {isKkn ? (
                    <>
                      <Link href="/kkn/galeri">Galeri KKN <ArrowIcon size={15} /></Link>
                      <Link href="/tim-kkn">Tim KKN <ArrowIcon size={15} /></Link>
                      <Link href="/kkn/book-chapter">Book Chapter <ArrowIcon size={15} /></Link>
                    </>
                  ) : (
                    <>
                      <Link href="/galeri">Galeri <ArrowIcon size={15} /></Link>
                      <Link href="/dokumen">Dokumen Publik <ArrowIcon size={15} /></Link>
                      <Link href="/kontak">Kontak Kelurahan <ArrowIcon size={15} /></Link>
                    </>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.cta}>
                <div>
                  <span>{isKkn ? "Dokumentasi KKN" : "Punya Informasi?"}</span>
                  <h2>{isKkn ? "Jelajahi dokumentasi dan keluaran kegiatan KKN." : "Sampaikan informasi atau dokumentasi kegiatan."}</h2>
                  <p>{isKkn ? "Tim, program kerja, berita, galeri, Book Chapter, dan luaran ditempatkan dalam satu kelompok menu KKN agar lebih mudah ditemukan." : "Informasi masyarakat dapat diteruskan kepada kelurahan untuk diverifikasi sebelum dipublikasikan."}</p>
                </div>
                <div className={styles.ctaActions}>
                  {isKkn ? (
                    <>
                      <Link href="/kkn/galeri" className={styles.ctaPrimary}>Lihat Galeri KKN <ArrowIcon /></Link>
                      <Link href="/tim-kkn" className={styles.ctaSecondary}>Lihat Tim KKN</Link>
                    </>
                  ) : (
                    <>
                      <Link href="/kontak" className={styles.ctaPrimary}>Hubungi Kelurahan <ArrowIcon /></Link>
                      <Link href="/galeri" className={styles.ctaSecondary}>Lihat Galeri</Link>
                    </>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
