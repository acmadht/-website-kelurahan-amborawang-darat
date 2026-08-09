"use client";

import { useState } from "react";
import Link from "next/link";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import type { NewsItem } from "./newsData";
import styles from "./NewsDetailPage.module.css";

function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
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

export default function NewsDetailPage({ article }: { article: NewsItem }) {
  const [copied, setCopied] = useState(false);

  const getUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const shareNative = async () => {
    const url = getUrl();

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url,
        });
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(getUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const encodedUrl =
    typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const encodedTitle = encodeURIComponent(article.title);

  return (
    <PublicShell>
      <main className={styles.page}>
        {/* ARTICLE HERO */}
        <section className={styles.hero}>
          <div className={styles.heroPattern} aria-hidden="true" />

          <div className={`container ${styles.heroInner}`}>
            <Reveal enabled>
              <div className={styles.breadcrumb}>
                <Link href="/">Beranda</Link>
                <span>/</span>
                <Link href="/berita">Berita</Link>
                <span>/</span>
                <span>{article.category}</span>
              </div>

              <span className={styles.category}>{article.category}</span>

              <h1>{article.title}</h1>

              <p className={styles.heroExcerpt}>{article.excerpt}</p>

              <div className={styles.meta}>
                <div>
                  <span>Tanggal</span>
                  <strong>{article.date}</strong>
                </div>
                <div>
                  <span>Waktu</span>
                  <strong>{article.time}</strong>
                </div>
                <div>
                  <span>Penulis</span>
                  <strong>{article.author}</strong>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FEATURE IMAGE */}
        <section className={styles.imageSection}>
          <div className="container">
            <Reveal enabled>
              <figure className={styles.figure}>
                <div className={styles.mainImage}>
                  <Photo src={article.image} alt={article.title} />
                </div>
                <figcaption>
                  Dokumentasi berita Kelurahan Amborawang Darat.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* ARTICLE */}
        <section className={styles.articleSection}>
          <div className={`container ${styles.articleGrid}`}>
            <aside className={styles.shareAside}>
              <span>Bagikan</span>

              <button type="button" onClick={shareNative} className={styles.sharePrimary}>
                <ShareIcon />
                Share
              </button>

              <a
                href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>

              <button type="button" onClick={copyLink}>
                <CopyIcon />
                {copied ? "Tersalin" : "Salin link"}
              </button>
            </aside>

            <article className={styles.article}>
              <Reveal enabled>
                <div className={styles.articleIntro}>
                  <span>Amborawang Darat</span>
                  <p>{article.excerpt}</p>
                </div>
              </Reveal>

              {article.content.map((paragraph, index) => (
                <Reveal key={index} enabled delay={index * 35}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}

              <Reveal enabled>
                <div className={styles.articleNote}>
                  <span>Informasi Publik</span>
                  <strong>
                    Berita ini dipublikasikan melalui Website Resmi Kelurahan
                    Amborawang Darat.
                  </strong>
                </div>
              </Reveal>

              <div className={styles.mobileShare}>
                <span>Bagikan berita</span>
                <div>
                  <button type="button" onClick={shareNative}>
                    <ShareIcon />
                    Bagikan
                  </button>
                  <button type="button" onClick={copyLink}>
                    <CopyIcon />
                    {copied ? "Link tersalin" : "Salin link"}
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* FOOTER ARTICLE */}
        <section className={styles.articleFooter}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.footerPanel}>
                <div>
                  <span>Selesai Membaca</span>
                  <h2>Lihat informasi kelurahan lainnya</h2>
                </div>

                <div className={styles.footerActions}>
                  <Link href="/berita" className={styles.primaryLink}>
                    Berita Lainnya
                    <ArrowIcon />
                  </Link>

                  <Link href="/kontak" className={styles.secondaryLink}>
                    Hubungi Kelurahan
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
