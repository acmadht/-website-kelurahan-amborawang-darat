"use client";

import Link from "next/link";
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
    label: "Dokumen",
    title: "Dokumen Publik",
    description: "Akses formulir dan dokumen informasi publik.",
    href: "/dokumen",
  },
];

const services = [
  {
    number: "01",
    title: "Surat Pengantar",
    description:
      "Lihat persyaratan dan alur pengurusan surat pengantar melalui kelurahan.",
    href: "/layanan",
  },
  {
    number: "02",
    title: "Administrasi Kependudukan",
    description:
      "Informasi administrasi kependudukan serta dokumen pendukung yang diperlukan.",
    href: "/layanan",
  },
  {
    number: "03",
    title: "Dokumen & Formulir",
    description:
      "Temukan dokumen publik dan formulir yang tersedia untuk masyarakat.",
    href: "/dokumen",
  },
  {
    number: "04",
    title: "Kontak Kelurahan",
    description:
      "Hubungi kantor kelurahan untuk pertanyaan dan informasi pelayanan.",
    href: "/kontak",
  },
];

const infoCards = [
  {
    category: "Berita",
    title: "Berita dan kegiatan terbaru kelurahan",
    description:
      "Ikuti pembaruan resmi kegiatan, informasi, dan pengumuman Kelurahan Amborawang Darat.",
    href: "/berita",
  },
  {
    category: "Pelayanan",
    title: "Persyaratan layanan lebih mudah ditemukan",
    description:
      "Periksa informasi pelayanan sebelum datang ke kantor kelurahan agar proses lebih efisien.",
    href: "/layanan",
  },
  {
    category: "Informasi Publik",
    title: "Dokumen publik dalam satu halaman",
    description:
      "Akses dokumen dan informasi publik yang tersedia untuk masyarakat secara lebih mudah.",
    href: "/dokumen",
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

export default function HomePage() {
  return (
    <PublicShell>
      <main className={styles.page}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroGlowOne} aria-hidden="true" />
          <div className={styles.heroGlowTwo} aria-hidden="true" />
          <div className={styles.heroMesh} aria-hidden="true" />

          <div className={`container ${styles.heroGrid}`}>
            <Reveal enabled>
              <div className={styles.heroCopy}>
                <div className={styles.heroStatus}>
                  <span className={styles.statusDot} />
                  Portal Informasi Resmi Kelurahan
                </div>

                <span className={styles.heroEyebrow}>
                  Website Resmi Kelurahan
                </span>

                <h1>
                  <span>Amborawang</span>
                  <strong>Darat</strong>
                </h1>

                <p>
                  Portal resmi untuk layanan masyarakat, berita, dokumen publik,
                  informasi wilayah, dan pemerintahan Kelurahan Amborawang Darat.
                </p>

                <div className={styles.heroActions}>
                  <Link href="/layanan" className={styles.primaryButton}>
                    Lihat Layanan
                    <ArrowIcon />
                  </Link>

                  <Link href="/profil" className={styles.secondaryButton}>
                    Profil Kelurahan
                  </Link>
                </div>

                <div className={styles.heroMeta}>
                  <span>
                    <i />
                    Kecamatan Samboja Barat
                  </span>
                  <span>Kabupaten Kutai Kartanegara</span>
                </div>
              </div>
            </Reveal>

            <Reveal enabled delay={80}>
              <div className={styles.mapPanel}>
                <div className={styles.mapHeader}>
                  <div className={styles.mapHeaderIcon}>
                    <MapPinIcon />
                  </div>

                  <div className={styles.mapHeaderCopy}>
                    <span>Lokasi Wilayah</span>
                    <strong>Kelurahan Amborawang Darat</strong>
                  </div>

                  <span className={styles.mapLive}>
                    <i />
                    Google Maps
                  </span>
                </div>

                <div className={styles.googleMapWrap}>
                  <iframe
                    className={styles.googleMap}
                    src="https://www.google.com/maps?q=Kelurahan+Amborawang+Darat,+Samboja+Barat,+Kutai+Kartanegara,+Kalimantan+Timur&z=14&output=embed"
                    title="Google Maps Kelurahan Amborawang Darat"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>

                <div className={styles.mapFooter}>
                  <div>
                    <span>Samboja Barat</span>
                    <strong>Amborawang Darat, Kutai Kartanegara</strong>
                  </div>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Kelurahan+Amborawang+Darat,+Samboja+Barat,+Kutai+Kartanegara,+Kalimantan+Timur"
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
                <Reveal key={item.title} enabled delay={index * 45}>
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

        {/* PROFILE */}
        <section className={styles.aboutSection}>
          <div className={`container ${styles.aboutGrid}`}>
            <Reveal enabled>
              <div className={styles.aboutVisual}>
                <div className={styles.aboutVisualIcon}>
                  <ShieldIcon />
                </div>

                <span className={styles.aboutKicker}>AMBORAWANG DARAT</span>

                <h2>
                  Informasi publik yang ringkas, jelas, dan mudah diakses.
                </h2>

                <p>
                  Beranda dirancang sebagai pintu utama menuju layanan dan
                  informasi masyarakat tanpa menampilkan konten berulang.
                </p>

                <div className={styles.aboutMiniPanel}>
                  <span>Portal Resmi</span>
                  <strong>Pelayanan & Informasi Publik</strong>
                </div>
              </div>
            </Reveal>

            <Reveal enabled delay={70}>
              <div className={styles.aboutContent}>
                <span className={styles.eyebrow}>Profil Singkat</span>

                <h2>Mengenal Kelurahan Amborawang Darat</h2>

                <p>
                  Informasi sejarah, visi, misi, potensi, dan data wilayah
                  tersedia pada halaman profil. Beranda hanya menampilkan
                  ringkasan penting agar navigasi tetap cepat dan nyaman.
                </p>

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
            <Reveal enabled>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.eyebrow}>Layanan Utama</span>
                  <h2>Pelayanan penting untuk masyarakat</h2>
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
              {services.map((service, index) => (
                <Reveal key={service.title} enabled delay={index * 55}>
                  <Link href={service.href} className={styles.serviceCard}>
                    <div className={styles.serviceTop}>
                      <span>{service.number}</span>
                      <ArrowIcon />
                    </div>

                    <div className={styles.serviceGlow} aria-hidden="true" />

                    <div className={styles.serviceBody}>
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* INFO */}
        <section className={styles.infoSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.eyebrow}>Informasi</span>
                  <h2>Informasi penting untuk masyarakat</h2>
                </div>
              </div>
            </Reveal>

            <div className={styles.infoGrid}>
              {infoCards.map((item, index) => (
                <Reveal key={item.title} enabled delay={index * 60}>
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
            <Reveal enabled>
              <div className={styles.ctaPanel}>
                <div className={styles.ctaCopy}>
                  <span>Butuh Bantuan?</span>
                  <h2>Temukan layanan atau hubungi kelurahan.</h2>
                  <p>
                    Lihat persyaratan pelayanan atau hubungi kantor kelurahan
                    jika membutuhkan informasi lebih lanjut.
                  </p>
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
