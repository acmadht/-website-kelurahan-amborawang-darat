"use client";

import Link from "next/link";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./ProfilePage.module.css";

const stats = [
  { value: "19,47 km²", label: "Luas wilayah", note: "BPS, data 2023" },
  { value: "2.921 jiwa", label: "Jumlah penduduk", note: "BPS, data 2023" },
  { value: "13 RT", label: "Wilayah RT", note: "Laporan lokal, Mei 2026" },
  { value: "5,3 km", label: "Ke ibu kota kecamatan", note: "BPS, data 2023" },
];

const timeline = [
  {
    year: "Sebelum 2020",
    title: "Bagian dari Kecamatan Samboja",
    text: "Amborawang Darat menjalankan pemerintahan kelurahan dalam wilayah Kecamatan Samboja.",
  },
  {
    year: "2020",
    title: "Pembentukan Kecamatan Samboja Barat",
    text: "Perda Kabupaten Kutai Kartanegara Nomor 6 Tahun 2020 memasukkan Amborawang Darat ke wilayah kecamatan baru.",
  },
  {
    year: "2023",
    title: "Pemerintahan kecamatan mulai efektif",
    text: "Kecamatan Samboja Barat mulai berjalan efektif pada 15 Februari 2023 dan memperkuat koordinasi pelayanan kewilayahan.",
  },
  {
    year: "Sekarang",
    title: "Penguatan pelayanan digital",
    text: "Informasi publik, layanan, berita, dan data wilayah dikembangkan agar lebih mudah diakses masyarakat.",
  },
];

const missions = [
  "Meningkatkan pelayanan publik yang cepat, jelas, ramah, dan mudah diakses.",
  "Memperkuat keterbukaan informasi serta pengelolaan data kelurahan yang akurat.",
  "Mendorong partisipasi masyarakat dalam perencanaan, pembangunan, dan pengawasan lingkungan.",
  "Mendukung pengembangan UMKM, pertanian, pendidikan, dan kegiatan produktif masyarakat.",
  "Menjaga kebersihan, ketertiban, keamanan, serta keberlanjutan lingkungan kelurahan.",
];

const boundaries = [
  ["Utara", "Kelurahan Margomulyo"],
  ["Timur", "Kelurahan Argosari dan Kelurahan Amborawang Laut"],
  ["Selatan", "Kelurahan Salok Api Laut dan Kelurahan Salok Api Darat"],
  ["Barat", "Desa Tani Bhakti"],
];

const potentials = [
  {
    title: "Pertanian dan Hortikultura",
    text: "Lahan dan aktivitas budidaya dapat dikembangkan melalui peningkatan produktivitas, pengolahan hasil, dan pemasaran.",
  },
  {
    title: "UMKM dan Ekonomi Lokal",
    text: "Usaha rumah tangga, perdagangan, kuliner, dan jasa menjadi ruang penguatan pendapatan masyarakat.",
  },
  {
    title: "Pendidikan dan SDM",
    text: "Keberadaan satuan pendidikan mendukung peningkatan keterampilan, literasi, dan kapasitas generasi muda.",
  },
  {
    title: "Konektivitas Wilayah",
    text: "Posisi pada koridor Samboja Barat membuka peluang pengembangan layanan, logistik lokal, dan kegiatan produktif.",
  },
];

const facilities = [
  "Kantor Kelurahan Amborawang Darat dan layanan administrasi masyarakat",
  "SD Negeri 005 Samboja",
  "SMP Negeri 2 Samboja",
  "MI Al Fatah Samboja dan satuan pendidikan keagamaan",
  "Layanan kesehatan dalam wilayah kerja Puskesmas Sungai Merdeka",
  "Tempat ibadah dan fasilitas sosial kemasyarakatan",
  "Jalan Balikpapan–Handil II dan jaringan jalan lingkungan",
  "Sarana perdagangan serta ruang usaha masyarakat",
];

const priorities = [
  "Pelayanan publik berbasis data",
  "Jalan, drainase, dan penerangan",
  "Penguatan UMKM dan usaha warga",
  "Kebersihan dan pengelolaan sampah",
  "Pendidikan serta kegiatan pemuda",
  "Pembaruan data wilayah berkala",
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

function PinIcon() {
  return (
    <svg
      width="20"
      height="20"
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

export default function ProfilePage() {
  return (
    <PublicShell>
      <main className={styles.page}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroPattern} aria-hidden="true" />
          <div className={`container ${styles.heroInner}`}>
            <Reveal enabled>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrowLight}>Profil Kelurahan</span>
                <h1>Mengenal Amborawang Darat</h1>
                <p>
                  Sejarah, arah pelayanan, kondisi wilayah, batas administratif,
                  potensi, dan fasilitas umum dalam satu halaman yang lebih informatif.
                </p>
              </div>
            </Reveal>

            <Reveal enabled delay={70}>
              <div className={styles.heroPhotoCard}>
                <div className={styles.heroPhoto}>
                  <img
                    src="/images/kantor-kelurahan-amborawang-darat.jpg"
                    alt="Kantor Kelurahan Amborawang Darat"
                  />
                </div>
                <div className={styles.heroPhotoMeta}>
                  <span>Kantor Kelurahan Amborawang Darat</span>
                  <small>Dokumentasi bangunan kantor, 19 September 2015</small>
                  <small>Foto: Arief R. Sandan (Ezagren)</small>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* QUICK PROFILE BAND */}
        <section className={styles.quickBand}>
          <div className="container">
            <div className={styles.quickBandGrid}>
              <Reveal enabled>
                <div className={styles.quickBandIntro}>
                  <span>Ringkasan Profil</span>
                  <strong>Amborawang Darat</strong>
                  <p>Kelurahan di Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara.</p>
                </div>
              </Reveal>

              <Reveal enabled delay={40}>
                <div className={styles.quickBandItem}>
                  <span>Wilayah</span>
                  <strong>19,47 km²</strong>
                </div>
              </Reveal>

              <Reveal enabled delay={80}>
                <div className={styles.quickBandItem}>
                  <span>Penduduk</span>
                  <strong>2.921 jiwa</strong>
                </div>
              </Reveal>

              <Reveal enabled delay={120}>
                <div className={styles.quickBandItem}>
                  <span>Administrasi</span>
                  <strong>13 RT</strong>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* SEJARAH */}
        <section className={styles.historyIntro}>
          <div className={`container ${styles.twoCol}`}>
            <Reveal enabled>
              <div className={styles.sectionLabelBlock}>
                <span className={styles.sectionIndex}>01</span>
                <span className={styles.eyebrow}>Sejarah Kelurahan</span>
              </div>
            </Reveal>

            <Reveal enabled delay={60}>
              <div className={styles.article}>
                <h2>Dari wilayah Samboja menuju pelayanan Samboja Barat</h2>

                <p>
                  Amborawang Darat telah menjadi salah satu kelurahan dalam wilayah administratif Kecamatan Samboja, Kabupaten Kutai Kartanegara. Perkembangan permukiman, aktivitas masyarakat, pendidikan, pertanian, perdagangan, dan pelayanan pemerintahan membentuk karakter wilayah ini dari waktu ke waktu.
                </p>

                <p>
                  Melalui Peraturan Daerah Kabupaten Kutai Kartanegara Nomor 6 Tahun 2020, Amborawang Darat ditetapkan sebagai salah satu kelurahan dalam Kecamatan Samboja Barat. Kecamatan baru tersebut mulai menjalankan pemerintahan secara efektif pada 15 Februari 2023. Perubahan administratif ini mendekatkan koordinasi pembangunan dan pelayanan publik kepada masyarakat.
                </p>

                <p>
                  Saat ini, Kelurahan Amborawang Darat terus memperkuat pelayanan administrasi, keterbukaan informasi, partisipasi warga, pengembangan potensi ekonomi lokal, dan pengelolaan lingkungan yang berkelanjutan.
                </p>

                <div className={styles.factCallout}>
                  Amborawang Darat menjadi bagian Kecamatan Samboja Barat berdasarkan Perda Kabupaten Kutai Kartanegara Nomor 6 Tahun 2020.
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* STATS */}
        <section className={styles.statsSection}>
          <div className="container">
            <div className={styles.statsGrid}>
              {stats.map((item, index) => (
                <Reveal key={item.label} enabled delay={index * 45}>
                  <div className={styles.statItem}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                    <small>{item.note}</small>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className={styles.timelineSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.sectionHeading}>
                <span className={styles.eyebrowLight}>Jejak Perkembangan</span>
                <h2>Perubahan administratif dan penguatan pelayanan</h2>
                <p>
                  Bagian ini menampilkan tonggak yang dapat diverifikasi tanpa menambahkan cerita asal-usul yang belum memiliki dokumen resmi.
                </p>
              </div>
            </Reveal>

            <div className={styles.timeline}>
              {timeline.map((item, index) => (
                <Reveal key={item.year} enabled delay={index * 55}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                      <span>{item.year}</span>
                    </div>
                    <div className={styles.timelineContent}>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* VISI MISI */}
        <section className={styles.visionSection}>
          <div className="container">
            <div className={styles.visionGrid}>
              <Reveal enabled>
                <div className={styles.visionCard}>
                  <span className={styles.eyebrowLight}>Visi Pelayanan</span>
                  <blockquote>
                    Terwujudnya Kelurahan Amborawang Darat yang tertib, responsif, transparan, berdaya, dan berkelanjutan dalam memberikan pelayanan kepada masyarakat.
                  </blockquote>
                  <p>
                    Rumusan profil digital ini tetap dapat disesuaikan melalui dashboard apabila dokumen visi kelurahan yang ditetapkan tersedia.
                  </p>
                </div>
              </Reveal>

              <div className={styles.missionArea}>
                <Reveal enabled>
                  <div className={styles.missionHeading}>
                    <span className={styles.eyebrow}>Misi</span>
                    <h2>Arah kerja yang dekat dengan kebutuhan warga</h2>
                  </div>
                </Reveal>

                <div className={styles.missionList}>
                  {missions.map((item, index) => (
                    <Reveal key={item} enabled delay={index * 40}>
                      <div className={styles.missionItem}>
                        <span>0{index + 1}</span>
                        <p>{item}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WILAYAH */}
        <section className={styles.regionSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.sectionHeadingDark}>
                <span className={styles.eyebrowLight}>Kondisi Wilayah</span>
                <h2>Geografi dan batas administratif</h2>
                <p>
                  Kelurahan Amborawang Darat berada di Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur. Luas wilayahnya sekitar 19,47 km² atau 4,68 persen dari luas Kecamatan Samboja Barat. Jarak menuju ibu kota kecamatan sekitar 5,3 km. Wilayah ini berada pada kawasan beriklim tropis basah dan terhubung dengan koridor Jalan Balikpapan–Handil II serta jaringan jalan lingkungan.
                </p>
              </div>
            </Reveal>

            <div className={styles.regionFacts}>
              <Reveal enabled>
                <div className={styles.regionFact}>
                  <span>04,68%</span>
                  <small>Proporsi luas terhadap Kecamatan Samboja Barat</small>
                </div>
              </Reveal>
              <Reveal enabled delay={40}>
                <div className={styles.regionFact}>
                  <span>5,3 km</span>
                  <small>Jarak menuju ibu kota kecamatan</small>
                </div>
              </Reveal>
              <Reveal enabled delay={80}>
                <div className={styles.regionFact}>
                  <span>Tropis</span>
                  <small>Karakter iklim wilayah</small>
                </div>
              </Reveal>
            </div>

            <div className={styles.regionGrid}>
              <Reveal enabled>
                <div className={styles.mapCard}>
                  <div className={styles.mapTop}>
                    <div>
                      <span>Peta Wilayah</span>
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

                  <div className={styles.mapImageWrap}>
                    <img
                      src="/images/peta-amborawang-darat.png"
                      alt="Peta wilayah Kelurahan Amborawang Darat"
                    />
                  </div>
                </div>
              </Reveal>

              <div className={styles.boundaryList}>
                {boundaries.map(([dir, place], index) => (
                  <Reveal key={dir} enabled delay={index * 45}>
                    <div className={styles.boundaryItem}>
                      <span>{dir}</span>
                      <strong>{place}</strong>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal enabled>
              <p className={styles.regionNote}>
                Batas administratif Kelurahan Amborawang Darat ditetapkan melalui Peraturan Bupati Kutai Kartanegara Nomor 43 Tahun 2019. Wilayah yang berbatasan langsung meliputi Kelurahan Margomulyo, Kelurahan Argosari, Kelurahan Amborawang Laut, Kelurahan Salok Api Laut, Kelurahan Salok Api Darat, dan Desa Tani Bhakti.
              </p>
            </Reveal>
          </div>
        </section>

        {/* POTENSI */}
        <section className={styles.potentialSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.sectionHeading}>
                <span className={styles.eyebrow}>Potensi Kelurahan</span>
                <h2>Peluang yang dapat dikembangkan bersama</h2>
                <p>
                  Potensi wilayah mencakup pertanian dan hortikultura, usaha mikro dan perdagangan lokal, pendidikan, kegiatan sosial kemasyarakatan, serta posisi strategis pada koridor pengembangan Samboja Barat. Pengembangan potensi diarahkan pada peningkatan nilai tambah usaha warga, penguatan kapasitas sumber daya manusia, perbaikan infrastruktur dasar, dan pengelolaan lingkungan.
                </p>
              </div>
            </Reveal>

            <div className={styles.potentialGrid}>
              {potentials.map((item, index) => (
                <Reveal key={item.title} enabled delay={index * 50}>
                  <article className={styles.potentialCard}>
                    <span className={styles.cardNumber}>0{index + 1}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FASILITAS */}
        <section className={styles.facilitySection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.facilityHeading}>
                <div>
                  <span className={styles.eyebrow}>Fasilitas Umum</span>
                  <h2>Sarana yang mendukung aktivitas masyarakat</h2>
                </div>
                <p>
                  Daftar dapat diperbarui melalui dashboard ketika terdapat fasilitas baru atau perubahan nama layanan.
                </p>
              </div>
            </Reveal>

            <div className={styles.facilityLead}>
              <div>
                <span>08</span>
                <strong>Kelompok fasilitas utama</strong>
              </div>
              <p>
                Pelayanan pemerintahan, pendidikan, kesehatan, keagamaan,
                konektivitas, dan kegiatan ekonomi masyarakat.
              </p>
            </div>

            <div className={styles.facilityList}>
              {facilities.map((item, index) => (
                <Reveal key={item} enabled delay={index * 35}>
                  <div className={styles.facilityItem}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item}</strong>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PRIORITAS */}
        <section className={styles.prioritySection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.sectionHeadingDark}>
                <span className={styles.eyebrowLight}>Tambahan Profil</span>
                <h2>Prioritas pengembangan wilayah</h2>
                <p>
                  Bagian ini membuat halaman profil lebih relevan dengan kebutuhan perencanaan dan menunjukkan fokus perbaikan secara ringkas.
                </p>
              </div>
            </Reveal>

            <div className={styles.priorityGrid}>
              {priorities.map((item, index) => (
                <Reveal key={item} enabled delay={index * 40}>
                  <div className={styles.priorityItem}>
                    <span>0{index + 1}</span>
                    <strong>{item}</strong>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* UPDATE DATA */}
        <section className={styles.updateSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.updatePanel}>
                <div className={styles.updateIcon}>
                  <PinIcon />
                </div>

                <div className={styles.updateCopy}>
                  <span>Data wilayah perlu diperbarui secara berkala</span>
                  <h2>Menemukan data atau fasilitas yang belum tercantum?</h2>
                  <p>
                    Sampaikan koreksi kepada kelurahan agar profil publik tetap akurat.
                  </p>
                </div>

                <div className={styles.updateActions}>
                  <Link href="/kontak" className={styles.primaryButton}>
                    Hubungi Kelurahan
                    <ArrowIcon />
                  </Link>

                  <Link href="/wilayah" className={styles.secondaryButton}>
                    Lihat Data Wilayah
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
