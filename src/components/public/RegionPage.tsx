"use client";

import Link from "next/link";
import { useCollectionData, useDocumentData } from "@/hooks/useFirestoreData";
import { demoSettings } from "@/data/demo";
import { AMBORAWANG_RT_TOTAL, applyAmborawangPublicSettings } from "@/data/amborawang";
import { regionContentFallback, type RegionContent } from "@/data/siteContent";
import type { RegionLeader, SiteSettings } from "@/types";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./RegionPage.module.css";

function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}

export default function RegionPage({ initialSettings = demoSettings, initialRegion = regionContentFallback, initialRts = [] }: { initialSettings?: SiteSettings; initialRegion?: RegionContent; initialRts?: RegionLeader[] }) {
  const { data: rawSettings } = useDocumentData<SiteSettings>(
    "siteSettings",
    "main",
    initialSettings,
  );
  const { data: region } = useDocumentData<RegionContent>(
    "pages",
    "wilayah",
    initialRegion,
  );
  const { data: rawRts } = useCollectionData<RegionLeader>("rts", initialRts);

  const settings = applyAmborawangPublicSettings(rawSettings);
  const animationEnabled = settings.animationEnabled !== false;
  const activeRtCount = Math.max(
    AMBORAWANG_RT_TOTAL,
    rawRts.filter((item) => {
      if (item.isActive === false) return false;
      const numeric = Number(String(item.number || "").replace(/\D/g, ""));
      return Number.isInteger(numeric) && numeric > 0;
    }).length,
  );
  const rtCountLabel = activeRtCount ? `${activeRtCount} RT` : "Belum ada data RT";

  const stats = [
    { value: region.area, label: "Luas wilayah", note: region.areaNote },
    { value: region.population, label: "Jumlah penduduk", note: region.populationNote },
    { value: rtCountLabel, label: "Wilayah RT", note: "Data RT aktif pada dashboard" },
    { value: region.districtDistance, label: "Ke kecamatan Samboja Barat", note: region.districtDistanceNote },
  ];

  const boundaries = [
    { direction: "Utara", place: region.northBoundary },
    { direction: "Timur", place: region.eastBoundary },
    { direction: "Selatan", place: region.southBoundary },
    { direction: "Barat", place: region.westBoundary },
  ];

  const regionFacts = [
    { number: "01", title: region.climateTitle, text: region.climateText },
    { number: "02", title: region.corridorTitle, text: region.corridorText },
    { number: "03", title: region.landTitle, text: region.landText },
  ];

  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || "Kelurahan Amborawang Darat")}`;
  const mapImageUrl = region.mapImageUrl || "/images/peta-amborawang-darat.png";

  return (
    <PublicShell>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroPattern} aria-hidden="true" />

          <div className={`container ${styles.heroGrid}`}>
            <Reveal enabled={animationEnabled}>
              <div className={styles.heroCopy}>
                <div className={styles.heroBadge}>
                  <CompassIcon />
                  <span>Data Kewilayahan</span>
                </div>

                <h1>
                  Wilayah
                  <strong>{settings.villageName}</strong>
                </h1>

                <p>
                  Informasi geografis, batas administratif, konektivitas, peta,
                  dan gambaran wilayah Kelurahan {settings.villageName}.
                </p>

                <div className={styles.heroMeta}>
                  <span><i />Kecamatan {settings.subdistrictName || "Samboja Barat"}</span>
                  <span>Kabupaten {settings.regencyName || "Kutai Kartanegara"}</span>
                </div>
              </div>
            </Reveal>

            <Reveal enabled={animationEnabled} delay={70}>
              <div className={styles.heroMapCard}>
                <div className={styles.mapCardHead}>
                  <div className={styles.mapCardIcon}><PinIcon /></div>
                  <div>
                    <span>Lokasi Wilayah</span>
                    <strong>Kelurahan {settings.villageName}</strong>
                  </div>
                </div>

                <div className={styles.heroMap}>
                  <iframe
                    src={settings.mapsEmbedUrl}
                    title={`Google Maps Kelurahan ${settings.villageName}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>

                <a href={mapSearchUrl} target="_blank" rel="noopener noreferrer" className={styles.mapCardLink}>
                  Buka Google Maps
                  <ArrowIcon size={16} />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.statsSection}>
          <div className="container">
            <div className={styles.statsGrid}>
              {stats.map((item, index) => (
                <Reveal key={item.label} enabled={animationEnabled} delay={index * 40}>
                  <div className={styles.statCard}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <small>{item.note}</small>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.overviewSection}>
          <div className={`container ${styles.overviewGrid}`}>
            <Reveal enabled={animationEnabled}>
              <div className={styles.overviewAside}>
                <span className={styles.sectionNumber}>01</span>
                <span className={styles.eyebrow}>Gambaran Wilayah</span>
                <h2>Posisi dan karakter wilayah</h2>
              </div>
            </Reveal>

            <Reveal enabled={animationEnabled} delay={60}>
              <div className={styles.overviewArticle}>
                <p className={styles.lead}>{region.geography}</p>
                <p>{region.geographyDetail}</p>
                <p>{region.connectivity}</p>

                <div className={styles.overviewCallout}>
                  <span>Administrasi Wilayah</span>
                  <strong>{settings.villageName} terdiri atas {rtCountLabel}.</strong>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.boundarySection}>
          <div className="container">
            <Reveal enabled={animationEnabled}>
              <div className={styles.sectionHeadingDark}>
                <span className={styles.eyebrowLight}>Batas Administratif</span>
                <h2>Wilayah yang berbatasan langsung</h2>
                <p>Batas administratif membantu memberikan gambaran posisi {settings.villageName} dalam wilayah {settings.subdistrictName || "Samboja Barat"}.</p>
              </div>
            </Reveal>

            <div className={styles.boundaryGrid}>
              <Reveal enabled={animationEnabled}>
                <div className={styles.staticMapCard}>
                  <div className={styles.staticMapHead}>
                    <div>
                      <span>Peta Administratif</span>
                      <strong>{settings.villageName}</strong>
                    </div>
                    <a href={mapImageUrl} target="_blank" rel="noopener noreferrer">
                      Lihat Peta Penuh
                      <ArrowIcon size={16} />
                    </a>
                  </div>

                  <div className={styles.staticMapImage}>
                    <img
                      src={mapImageUrl}
                      alt={`Peta wilayah Kelurahan ${settings.villageName}`}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/images/peta-amborawang-darat.png";
                      }}
                    />
                  </div>
                </div>
              </Reveal>

              <div className={styles.boundaryList}>
                {boundaries.map((item, index) => (
                  <Reveal key={item.direction} enabled={animationEnabled} delay={index * 45}>
                    <article className={styles.boundaryCard}>
                      <span>0{index + 1}</span>
                      <small>{item.direction}</small>
                      <strong>{item.place}</strong>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal enabled={animationEnabled}>
              <div className={styles.boundaryNote}>
                <span>Dasar Wilayah</span>
                <p>{region.boundaryNote}</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.characterSection}>
          <div className="container">
            <Reveal enabled={animationEnabled}>
              <div className={styles.characterHeading}>
                <span className={styles.eyebrowLight}>Karakter Wilayah</span>
                <h2>Lingkungan yang terus berkembang</h2>
              </div>
            </Reveal>

            <div className={styles.characterGrid}>
              {regionFacts.map((item, index) => (
                <Reveal key={item.number} enabled={animationEnabled} delay={index * 50}>
                  <article className={styles.characterCard}>
                    <span>{item.number}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.locationSection}>
          <div className="container">
            <Reveal enabled={animationEnabled}>
              <div className={styles.locationPanel}>
                <div className={styles.locationIcon}><PinIcon /></div>
                <div className={styles.locationCopy}>
                  <span>Lokasi Kantor</span>
                  <h2>Kantor Kelurahan {settings.villageName}</h2>
                  <p>{settings.address}</p>
                </div>
                <Link href="/kontak" className={styles.locationButton}>
                  Kontak & Lokasi
                  <ArrowIcon />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className="container">
            <Reveal enabled={animationEnabled}>
              <div className={styles.cta}>
                <div>
                  <span>Data Wilayah</span>
                  <h2>Menemukan data yang perlu diperbarui?</h2>
                  <p>Sampaikan koreksi agar informasi publik wilayah tetap akurat.</p>
                </div>
                <div className={styles.ctaActions}>
                  <Link href="/kontak" className={styles.ctaPrimary}>Hubungi Kelurahan <ArrowIcon /></Link>
                  <Link href="/data-rt" className={styles.ctaSecondary}>Data RT</Link>
                  <Link href="/data-publik" className={styles.ctaSecondary}>Data Publik</Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
