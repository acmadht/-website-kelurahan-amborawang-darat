"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { applyAmborawangPublicSettings } from "@/data/amborawang";
import {
  demoAgendas,
  demoAnnouncements,
  demoHeroSlides,
  demoPosts,
  demoServices,
  demoSettings,
} from "@/data/demo";
import { homeContentFallback, type HomeContent } from "@/data/siteContent";
import { useCollectionData, useDocumentData } from "@/hooks/useFirestoreData";
import { formatDate } from "@/lib/utils";
import type {
  AgendaItem,
  Announcement,
  HeroSlide,
  PostItem,
  ServiceItem,
  SiteSettings,
} from "@/types";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./HomePage.module.css";

const quickLinks = [
  {
    number: "01",
    label: "Profil",
    title: "Profil Kelurahan",
    description: "Sejarah, visi, misi, potensi, dan informasi wilayah.",
    href: "/profil",
  },
  {
    number: "02",
    label: "Layanan",
    title: "Pelayanan Warga",
    description: "Informasi layanan dan persyaratan administrasi masyarakat.",
    href: "/layanan",
  },
  {
    number: "03",
    label: "Berita",
    title: "Informasi Terbaru",
    description: "Berita, pengumuman, dan kegiatan resmi kelurahan.",
    href: "/berita",
  },
  {
    number: "04",
    label: "Data RT",
    title: "Data 13 RT",
    description: "Ketua RT, warga, kepala keluarga, fasilitas, dan wilayah.",
    href: "/data-rt",
  },
];

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

function MapPinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 5 6v5c0 4.8 2.8 8 7 10 4.2-2 7-5.2 7-10V6Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function buildMapsSearchUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default function HomePage() {
  const { data: rawSettings } = useDocumentData<SiteSettings>(
    "siteSettings",
    "main",
    demoSettings,
  );
  const settings = applyAmborawangPublicSettings(rawSettings);
  const { data: home } = useDocumentData<HomeContent>(
    "pages",
    "home",
    homeContentFallback,
  );
  const { data: rawSlides } = useCollectionData<HeroSlide>(
    "heroSlides",
    demoHeroSlides,
  );
  const { data: rawServices } = useCollectionData<ServiceItem>(
    "services",
    demoServices,
  );
  const { data: rawPosts } = useCollectionData<PostItem>("posts", demoPosts);
  const { data: rawAnnouncements } = useCollectionData<Announcement>(
    "announcements",
    demoAnnouncements,
  );
  const { data: rawAgendas } = useCollectionData<AgendaItem>(
    "agendas",
    demoAgendas,
  );

  const slides = useMemo(() => {
    const active = rawSlides.filter((item) => item.isActive !== false);
    return active.length ? active : demoHeroSlides;
  }, [rawSlides]);

  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (slideIndex >= slides.length) setSlideIndex(0);
  }, [slideIndex, slides.length]);

  useEffect(() => {
    if (!settings.heroAutoplay || slides.length < 2) return;

    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % slides.length);
    }, Math.max(4000, Number(settings.heroInterval) || 7000));

    return () => window.clearInterval(timer);
  }, [settings.heroAutoplay, settings.heroInterval, slides.length]);

  const activeSlide = slides[slideIndex] ?? demoHeroSlides[0];

  const featuredServices = useMemo(() => {
    const active = rawServices.filter((item) => item.isActive !== false);
    const featured = active.filter((item) => item.isFeatured !== false);
    const source = featured.length ? featured : active;
    return (source.length ? source : demoServices).slice(0, 4);
  }, [rawServices]);

  const publishedPosts = useMemo(() => {
    const items = rawPosts.filter((item) => item.status === "published");
    return items.length ? items : demoPosts.filter((item) => item.status === "published");
  }, [rawPosts]);

  const latestPost = publishedPosts[0];
  const importantAnnouncement =
    rawAnnouncements.find((item) => item.isActive && item.priority === "penting") ??
    rawAnnouncements.find((item) => item.isActive) ??
    demoAnnouncements[0];
  const nextAgenda =
    rawAgendas.find(
      (item) => item.status === "akan-datang" || item.status === "berlangsung",
    ) ?? demoAgendas[0];

  const infoCards = [
    latestPost
      ? {
          category: latestPost.category || "Berita",
          title: latestPost.title,
          description: latestPost.summary,
          href: `/berita/${latestPost.slug}`,
        }
      : {
          category: "Berita",
          title: "Berita dan kegiatan terbaru kelurahan",
          description: "Ikuti pembaruan resmi Kelurahan Amborawang Darat.",
          href: "/berita",
        },
    {
      category: importantAnnouncement?.priority === "penting" ? "Pengumuman Penting" : "Pengumuman",
      title: importantAnnouncement?.title || "Informasi pelayanan kelurahan",
      description:
        importantAnnouncement?.summary ||
        "Periksa informasi terbaru sebelum datang ke kantor kelurahan.",
      href: "/kontak",
    },
    {
      category: "Agenda",
      title: nextAgenda?.title || "Agenda kegiatan kelurahan",
      description: nextAgenda
        ? `${formatDate(nextAgenda.date)} • ${nextAgenda.time || "Waktu menyesuaikan"} • ${nextAgenda.location || "Kelurahan Amborawang Darat"}`
        : "Informasi agenda dan kegiatan masyarakat.",
      href: "/berita",
    },
  ];

  const mapsLink = buildMapsSearchUrl(settings.address);

  return (
    <PublicShell>
      <main className={styles.page}>
        {/* HERO */}
        <section className={styles.hero}>
          {activeSlide.imageUrl ? (
            <img
              className={styles.heroBackgroundImage}
              src={activeSlide.imageUrl}
              alt=""
              aria-hidden="true"
            />
          ) : null}
          <div className={styles.heroBackgroundShade} aria-hidden="true" />
          <div className={styles.heroGlowOne} aria-hidden="true" />
          <div className={styles.heroGlowTwo} aria-hidden="true" />
          <div className={styles.heroMesh} aria-hidden="true" />

          <div className={`container ${styles.heroGrid}`}>
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.heroCopy}>
                <div className={styles.heroStatus}>
                  <span className={styles.statusDot} />
                  {home.portalStatus}
                </div>

                <span className={styles.heroEyebrow}>{home.heroEyebrow}</span>

                <h1 className={styles.heroDynamicTitle}>{activeSlide.title}</h1>

                <p>{activeSlide.subtitle}</p>

                <div className={styles.heroActions}>
                  <Link
                    href={activeSlide.primaryButtonUrl || "/layanan"}
                    className={styles.primaryButton}
                  >
                    {activeSlide.primaryButtonText || "Lihat Layanan"}
                    <ArrowIcon />
                  </Link>

                  {activeSlide.secondaryButtonText ? (
                    <Link
                      href={activeSlide.secondaryButtonUrl || "/profil"}
                      className={styles.secondaryButton}
                    >
                      {activeSlide.secondaryButtonText}
                    </Link>
                  ) : null}
                </div>

                <div className={styles.heroMeta}>
                  <span>
                    <i />
                    Kecamatan Samboja Barat
                  </span>
                  <span>Kabupaten Kutai Kartanegara</span>
                </div>

                {slides.length > 1 ? (
                  <div className={styles.heroDots} aria-label="Pilih banner">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.id ?? `${slide.title}-${index}`}
                        type="button"
                        className={index === slideIndex ? styles.heroDotActive : ""}
                        onClick={() => setSlideIndex(index)}
                        aria-label={`Tampilkan banner ${index + 1}`}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </Reveal>

            <Reveal enabled={settings.animationEnabled} delay={80}>
              <div className={styles.mapPanel}>
                <div className={styles.mapHeader}>
                  <div className={styles.mapHeaderIcon}>
                    <MapPinIcon />
                  </div>

                  <div className={styles.mapHeaderCopy}>
                    <span>Lokasi Wilayah</span>
                    <strong>Kelurahan {settings.villageName}</strong>
                  </div>

                  <span className={styles.mapLive}>
                    <i />
                    Google Maps
                  </span>
                </div>

                <div className={styles.googleMapWrap}>
                  <iframe
                    className={styles.googleMap}
                    src={settings.mapsEmbedUrl}
                    title={`Google Maps Kelurahan ${settings.villageName}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>

                <div className={styles.mapFooter}>
                  <div>
                    <span>Samboja Barat</span>
                    <strong>{settings.address}</strong>
                  </div>

                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapButton}
                  >
                    Buka Google Maps
                    <ArrowIcon size={16} />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* QUICK LINKS */}
        <section className={styles.quickSection}>
          <div className="container">
            <div className={styles.quickGrid}>
              {quickLinks.map((item, index) => (
                <Reveal
                  key={item.title}
                  enabled={settings.animationEnabled}
                  delay={index * 45}
                >
                  <Link href={item.href} className={styles.quickCard}>
                    <div className={styles.quickTop}>
                      <span>{item.number}</span>
                      <ArrowIcon size={16} />
                    </div>

                    <small>{item.label}</small>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PROFILE / SAMBUTAN */}
        <section className={styles.aboutSection}>
          <div className={`container ${styles.aboutGrid}`}>
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.aboutVisual}>
                <div className={styles.aboutVisualIcon}>
                  <ShieldIcon />
                </div>

                <span className={styles.aboutKicker}>{settings.villageName.toUpperCase()}</span>

                <h2>{home.welcomeTitle}</h2>

                <p>{home.welcomeSecondText}</p>

                <div className={styles.aboutMiniPanel}>
                  <span>Portal Resmi</span>
                  <strong>Pelayanan & Informasi Publik</strong>
                </div>
              </div>
            </Reveal>

            <Reveal enabled={settings.animationEnabled} delay={70}>
              <div className={styles.aboutContent}>
                <span className={styles.eyebrow}>{home.welcomeEyebrow}</span>

                <h2>{home.welcomeTitle}</h2>

                <p>{home.welcomeText}</p>

                <div className={styles.aboutList}>
                  <div>
                    <span>01</span>
                    <p>Profil dan informasi kewilayahan.</p>
                  </div>
                  <div>
                    <span>02</span>
                    <p>Pelayanan administrasi masyarakat.</p>
                  </div>
                  <div>
                    <span>03</span>
                    <p>Berita, dokumen, dan informasi publik.</p>
                  </div>
                </div>

                <Link href="/profil" className={styles.textLink}>
                  Lihat Profil Lengkap
                  <ArrowIcon size={17} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SERVICES */}
        <section className={styles.serviceSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.eyebrow}>{home.servicesEyebrow}</span>
                  <h2>{home.servicesTitle}</h2>
                </div>

                <div className={styles.headingSide}>
                  <Link href="/layanan" className={styles.textLink}>
                    Semua Layanan
                    <ArrowIcon size={17} />
                  </Link>
                </div>
              </div>
            </Reveal>

            <div className={styles.serviceGrid}>
              {featuredServices.map((service, index) => (
                <Reveal
                  key={service.id ?? service.name}
                  enabled={settings.animationEnabled}
                  delay={index * 55}
                >
                  <Link
                    href={`/layanan#${service.slug || "daftar-layanan"}`}
                    className={styles.serviceCard}
                  >
                    <div className={styles.serviceTop}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <ArrowIcon />
                    </div>

                    <div className={styles.serviceGlow} aria-hidden="true" />

                    <div className={styles.serviceBody}>
                      <h3>{service.name}</h3>
                      <p>{service.summary}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* INFO */}
        <section id="informasi-terkini" className={styles.infoSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.eyebrow}>{home.infoEyebrow}</span>
                  <h2>{home.infoTitle}</h2>
                </div>
              </div>
            </Reveal>

            <div className={styles.infoGrid}>
              {infoCards.map((item, index) => (
                <Reveal
                  key={`${item.category}-${item.title}`}
                  enabled={settings.animationEnabled}
                  delay={index * 60}
                >
                  <Link href={item.href} className={styles.infoCard}>
                    <div className={styles.infoVisual}>
                      <span>{item.category}</span>
                      <div className={styles.infoOrb} aria-hidden="true" />
                    </div>

                    <div className={styles.infoBody}>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>

                      <span className={styles.infoMore}>
                        Buka Informasi
                        <ArrowIcon size={16} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.ctaPanel}>
                <div className={styles.ctaCopy}>
                  <span>{home.ctaKicker}</span>
                  <h2>{home.ctaTitle}</h2>
                  <p>{home.ctaText} {home.complaintText}</p>
                </div>

                <div className={styles.ctaActions}>
                  <Link href="/layanan" className={styles.ctaPrimary}>
                    Lihat Layanan
                    <ArrowIcon />
                  </Link>

                  <Link href="/kontak" className={styles.ctaSecondary}>
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
