"use client";

import Link from "next/link";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./RegionPage.module.css";

const stats = [
  { value: "19,47 km²", label: "Luas wilayah", note: "BPS, data 2023" },
  { value: "2.921 jiwa", label: "Jumlah penduduk", note: "BPS, data 2023" },
  { value: "13 RT", label: "Wilayah RT", note: "Data kelurahan" },
  { value: "5,3 km", label: "Ke ibu kota kecamatan", note: "BPS, data 2023" },
];

const boundaries = [
  { direction: "Utara", place: "Kelurahan Margomulyo" },
  { direction: "Timur", place: "Kelurahan Argosari dan Kelurahan Amborawang Laut" },
  { direction: "Selatan", place: "Kelurahan Salok Api Laut dan Kelurahan Salok Api Darat" },
  { direction: "Barat", place: "Desa Tani Bhakti" },
];

const rtList = Array.from({ length: 13 }, (_, index) => ({
  number: String(index + 1).padStart(2, "0"),
  title: `RT ${String(index + 1).padStart(2, "0")}`,
}));

const regionFacts = [
  {
    number: "01",
    title: "Kawasan Tropis Basah",
    text: "Karakter iklim wilayah dipengaruhi kondisi tropis Kalimantan Timur dengan curah hujan dan kelembapan yang relatif tinggi.",
  },
  {
    number: "02",
    title: "Koridor Balikpapan–Handil II",
    text: "Wilayah terhubung dengan koridor Jalan Balikpapan–Handil II yang mendukung mobilitas masyarakat dan aktivitas lokal.",
  },
  {
    number: "03",
    title: "Permukiman & Lahan Produktif",
    text: "Karakter wilayah mencakup area permukiman, aktivitas masyarakat, lahan produktif, dan ruang lingkungan kelurahan.",
  },
];

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

export default function RegionPage() {
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
                  <CompassIcon />
                  <span>Data Kewilayahan</span>
                </div>

                <h1>
                  Wilayah
                  <strong>Amborawang Darat</strong>
                </h1>

                <p>
                  Informasi geografis, batas administratif, data RT,
                  konektivitas, dan gambaran wilayah Kelurahan Amborawang Darat.
                </p>

                <div className={styles.heroMeta}>
                  <span><i />Kecamatan Samboja Barat</span>
                  <span>Kabupaten Kutai Kartanegara</span>
                </div>
              </div>
            </Reveal>

            <Reveal enabled delay={70}>
              <div className={styles.heroMapCard}>
                <div className={styles.mapCardHead}>
                  <div className={styles.mapCardIcon}>
                    <PinIcon />
                  </div>
                  <div>
                    <span>Lokasi Wilayah</span>
                    <strong>Kelurahan Amborawang Darat</strong>
                  </div>
                </div>

                <div className={styles.heroMap}>
                  <iframe
                    src="https://www.google.com/maps?q=Kelurahan+Amborawang+Darat,+Samboja+Barat,+Kutai+Kartanegara,+Kalimantan+Timur&z=14&output=embed"
                    title="Google Maps Kelurahan Amborawang Darat"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Kelurahan+Amborawang+Darat,+Samboja+Barat,+Kutai+Kartanegara,+Kalimantan+Timur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapCardLink}
                >
                  Buka Google Maps
                  <ArrowIcon size={16} />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* STATS */}
        <section className={styles.statsSection}>
          <div className="container">
            <div className={styles.statsGrid}>
              {stats.map((item, index) => (
                <Reveal key={item.label} enabled delay={index * 40}>
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

        {/* OVERVIEW */}
        <section className={styles.overviewSection}>
          <div className={`container ${styles.overviewGrid}`}>
            <Reveal enabled>
              <div className={styles.overviewAside}>
                <span className={styles.sectionNumber}>01</span>
                <span className={styles.eyebrow}>Gambaran Wilayah</span>
                <h2>Posisi dan karakter wilayah</h2>
              </div>
            </Reveal>

            <Reveal enabled delay={60}>
              <div className={styles.overviewArticle}>
                <p className={styles.lead}>
                  Kelurahan Amborawang Darat merupakan bagian dari Kecamatan
                  Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur.
                </p>

                <p>
                  Luas wilayahnya sekitar 19,47 km² atau sekitar 4,68 persen dari
                  luas Kecamatan Samboja Barat. Jarak menuju ibu kota kecamatan
                  sekitar 5,3 km.
                </p>

                <p>
                  Wilayah ini terhubung dengan koridor Jalan Balikpapan–Handil II
                  serta jaringan jalan lingkungan yang mendukung aktivitas
                  masyarakat, pelayanan, pendidikan, perdagangan, dan mobilitas
                  antarkawasan.
                </p>

                <div className={styles.overviewCallout}>
                  <span>Administrasi Wilayah</span>
                  <strong>
                    Amborawang Darat terdiri atas 13 wilayah RT.
                  </strong>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* MAP + BOUNDARIES */}
        <section className={styles.boundarySection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.sectionHeadingDark}>
                <span className={styles.eyebrowLight}>Batas Administratif</span>
                <h2>Wilayah yang berbatasan langsung</h2>
                <p>
                  Batas administratif membantu memberikan gambaran posisi
                  Amborawang Darat dalam wilayah Samboja Barat.
                </p>
              </div>
            </Reveal>

            <div className={styles.boundaryGrid}>
              <Reveal enabled>
                <div className={styles.staticMapCard}>
                  <div className={styles.staticMapHead}>
                    <div>
                      <span>Peta Administratif</span>
                      <strong>Amborawang Darat</strong>
                    </div>

                    <a
                      href="/images/peta-amborawang-darat.png"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Lihat Peta Penuh
                      <ArrowIcon size={16} />
                    </a>
                  </div>

                  <div className={styles.staticMapImage}>
                    <img
                      src="/images/peta-amborawang-darat.png"
                      alt="Peta wilayah Kelurahan Amborawang Darat"
                    />
                  </div>
                </div>
              </Reveal>

              <div className={styles.boundaryList}>
                {boundaries.map((item, index) => (
                  <Reveal key={item.direction} enabled delay={index * 45}>
                    <article className={styles.boundaryCard}>
                      <span>0{index + 1}</span>
                      <small>{item.direction}</small>
                      <strong>{item.place}</strong>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal enabled>
              <div className={styles.boundaryNote}>
                <span>Dasar Wilayah</span>
                <p>
                  Batas administratif Kelurahan Amborawang Darat ditetapkan
                  melalui Peraturan Bupati Kutai Kartanegara Nomor 43 Tahun 2019.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* RT */}
        <section className={styles.rtSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.rtHeading}>
                <div>
                  <span className={styles.sectionNumber}>02</span>
                  <span className={styles.eyebrow}>Struktur Wilayah</span>
                  <h2>13 RT Amborawang Darat</h2>
                </div>

                <p>
                  RT menjadi unit lingkungan yang paling dekat dengan masyarakat
                  dalam koordinasi administrasi dan kegiatan kewilayahan.
                </p>
              </div>
            </Reveal>

            <div className={styles.rtGrid}>
              {rtList.map((rt, index) => (
                <Reveal key={rt.number} enabled delay={(index % 6) * 35}>
                  <article className={styles.rtCard}>
                    <span>{rt.number}</span>
                    <h3>{rt.title}</h3>
                    <small>Kelurahan Amborawang Darat</small>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CHARACTER */}
        <section className={styles.characterSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.characterHeading}>
                <span className={styles.eyebrowLight}>Karakter Wilayah</span>
                <h2>Lingkungan yang terus berkembang</h2>
              </div>
            </Reveal>

            <div className={styles.characterGrid}>
              {regionFacts.map((item, index) => (
                <Reveal key={item.title} enabled delay={index * 50}>
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

        {/* LOCATION CTA */}
        <section className={styles.locationSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.locationPanel}>
                <div className={styles.locationIcon}>
                  <PinIcon />
                </div>

                <div className={styles.locationCopy}>
                  <span>Lokasi Kantor</span>
                  <h2>Kantor Kelurahan Amborawang Darat</h2>
                  <p>
                    Jl. Balikpapan–Handil II KM 42, RT 12, Kelurahan Amborawang
                    Darat, Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara.
                  </p>
                </div>

                <Link href="/kontak" className={styles.locationButton}>
                  Kontak & Lokasi
                  <ArrowIcon />
                </Link>
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
                  <span>Data Wilayah</span>
                  <h2>Menemukan data yang perlu diperbarui?</h2>
                  <p>
                    Sampaikan koreksi agar informasi publik wilayah tetap akurat.
                  </p>
                </div>

                <div className={styles.ctaActions}>
                  <Link href="/kontak" className={styles.ctaPrimary}>
                    Hubungi Kelurahan
                    <ArrowIcon />
                  </Link>

                  <Link href="/profil" className={styles.ctaSecondary}>
                    Lihat Profil
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
