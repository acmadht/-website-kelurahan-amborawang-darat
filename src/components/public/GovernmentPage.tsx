"use client";

import Link from "next/link";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./GovernmentPage.module.css";

type Person = {
  name: string;
  role: string;
  unit: string;
  photo: string;
  status?: "aktif" | "kosong" | "verifikasi";
};

const structuralOfficials: Person[] = [
  {
    name: "A. Achmad Dendi, S.Sos",
    role: "Lurah Amborawang Darat",
    unit: "Pimpinan Kelurahan",
    photo: "/images/pemerintahan/lurah.jpg",
    status: "aktif",
  },
  {
    name: "Akhmad Deni Sopiani, S.P",
    role: "Sekretaris Lurah",
    unit: "Sekretariat",
    photo: "/images/pemerintahan/sekretaris-lurah.jpg",
    status: "aktif",
  },
  {
    name: "Belum terisi",
    role: "Kepala Seksi Pemerintahan",
    unit: "Seksi Pemerintahan",
    photo: "/images/pemerintahan/placeholder.svg",
    status: "kosong",
  },
  {
    name: "Nurhalis, S.Sos., M.Si",
    role: "Kepala Seksi Sosial",
    unit: "Seksi Sosial",
    photo: "/images/pemerintahan/kasi-sosial.jpg",
    status: "aktif",
  },
  {
    name: "A. Sofiar, S.H",
    role: "Kepala Seksi Pembangunan",
    unit: "Seksi Pembangunan",
    photo: "/images/pemerintahan/kasi-pembangunan.jpg",
    status: "aktif",
  },
];

const staff: Person[] = [
  { name: "Suwandi", role: "Pengolah Data dan Informasi", unit: "Seksi Pemerintahan", photo: "/images/pemerintahan/suwandi.jpg" },
  { name: "Yeni Rahayu", role: "Pengolah Data dan Informasi", unit: "Seksi Pembangunan", photo: "/images/pemerintahan/yeni-rahayu.jpg" },
  { name: "Nilfa Fatmuria, S.Sos", role: "Pengadministrasi Perkantoran", unit: "Seksi Sosial", photo: "/images/pemerintahan/nilfa-fatmuria.jpg" },
  { name: "Sheila Novindya", role: "Pengadministrasi Perkantoran", unit: "Seksi Sosial", photo: "/images/pemerintahan/sheila-novindya.jpg" },
  { name: "Satriyani", role: "Pengadministrasi Perkantoran", unit: "Seksi Pembangunan", photo: "/images/pemerintahan/satriyani.jpg" },
  { name: "Suharianto", role: "Pengadministrasi Perkantoran", unit: "Sekretariat", photo: "/images/pemerintahan/suharianto.jpg" },
  { name: "Dini Hariasdika", role: "Pengadministrasi Perkantoran", unit: "Sekretariat", photo: "/images/pemerintahan/dini-hariasdika.jpg" },
  { name: "Sofia Salsabila", role: "Pengadministrasi Perkantoran", unit: "Sekretariat", photo: "/images/pemerintahan/sofia-salsabila.jpg" },
  { name: "Johni Fatmanto", role: "Pengadministrasi Perkantoran", unit: "Seksi Pemerintahan", photo: "/images/pemerintahan/johni-fatmanto.jpg" },
  { name: "M. Ali AS", role: "Pengadministrasi Perkantoran", unit: "Seksi Pemerintahan", photo: "/images/pemerintahan/m-ali-as.jpg" },
  { name: "Sopiansyah", role: "Pengadministrasi Perkantoran", unit: "Seksi Pembangunan", photo: "/images/pemerintahan/sopiansyah.jpg" },
  { name: "Galina", role: "Pengadministrasi Perkantoran", unit: "Seksi Sosial", photo: "/images/pemerintahan/galina.jpg" },
  { name: "Suparno", role: "Pengelola Umum Operasional", unit: "Seksi Sosial", photo: "/images/pemerintahan/suparno.jpg" },
];

const communityInstitutions: Person[] = [
  {
    name: "Isi sesuai SK / data resmi kelurahan",
    role: "Ketua LPM",
    unit: "Lembaga Pemberdayaan Masyarakat",
    photo: "/images/pemerintahan/ketua-lpm.jpg",
    status: "verifikasi",
  },
  {
    name: "Isi sesuai SK / data resmi kelurahan",
    role: "Ketua TP PKK",
    unit: "Pemberdayaan Kesejahteraan Keluarga",
    photo: "/images/pemerintahan/ketua-pkk.jpg",
    status: "verifikasi",
  },
  {
    name: "Isi sesuai SK / data resmi kelurahan",
    role: "Ketua Karang Taruna",
    unit: "Karang Taruna",
    photo: "/images/pemerintahan/ketua-karang-taruna.jpg",
    status: "verifikasi",
  },
  {
    name: "Isi sesuai SK / data resmi kelurahan",
    role: "Kepala / Ketua Adat",
    unit: "Lembaga Adat",
    photo: "/images/pemerintahan/kepala-adat.jpg",
    status: "verifikasi",
  },
  {
    name: "Isi sesuai data resmi kelurahan",
    role: "Koordinator Linmas",
    unit: "Perlindungan Masyarakat",
    photo: "/images/pemerintahan/koordinator-linmas.jpg",
    status: "verifikasi",
  },
  {
    name: "Isi sesuai data resmi wilayah",
    role: "Bhabinkamtibmas",
    unit: "Mitra Keamanan",
    photo: "/images/pemerintahan/bhabinkamtibmas.jpg",
    status: "verifikasi",
  },
  {
    name: "Isi sesuai data resmi wilayah",
    role: "Babinsa",
    unit: "Mitra Kewilayahan",
    photo: "/images/pemerintahan/babinsa.jpg",
    status: "verifikasi",
  },
];

const rtList: Person[] = Array.from({ length: 13 }, (_, i) => ({
  name: "Isi nama Ketua RT sesuai SK",
  role: `Ketua RT ${String(i + 1).padStart(2, "0")}`,
  unit: "Kelurahan Amborawang Darat",
  photo: `/images/pemerintahan/rt-${String(i + 1).padStart(2, "0")}.jpg`,
  status: "verifikasi",
}));

function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function GovernmentIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21h18" />
      <path d="M5 21V10h14v11" />
      <path d="M2 10h20L12 3 2 10Z" />
      <path d="M8 13v5M12 13v5M16 13v5" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="18" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <path d="M12 7.5v4.2M12 11.7 5.8 15.6M12 11.7l6.2 3.9" />
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
        event.currentTarget.src = "/images/pemerintahan/placeholder.svg";
      }}
    />
  );
}

function PersonCard({ person, compact = false }: { person: Person; compact?: boolean }) {
  return (
    <article className={`${styles.personCard} ${compact ? styles.personCardCompact : ""}`}>
      <div className={styles.personPhoto}>
        <Photo src={person.photo} alt={`Foto ${person.role}`} />
        {person.status === "kosong" && <span className={styles.emptyBadge}>Jabatan Kosong</span>}
        {person.status === "verifikasi" && <span className={styles.verifyBadge}>Perlu Verifikasi</span>}
      </div>

      <div className={styles.personBody}>
        <div className={styles.personMetaRow}>
          <span>{person.unit}</span>
          <i />
        </div>
        <h3>{person.name}</h3>
        <strong>{person.role}</strong>
      </div>
    </article>
  );
}

export default function GovernmentPage() {
  return (
    <PublicShell>
      <main className={styles.page}>
        {/* HERO - CIRI KHAS PEMERINTAHAN */}
        <section className={styles.hero}>
          <div className={styles.heroGridTexture} aria-hidden="true" />

          <div className={`container ${styles.heroLayout}`}>
            <Reveal enabled>
              <div className={styles.heroCopy}>
                <div className={styles.govSeal}>
                  <GovernmentIcon />
                  <span>Struktur Pemerintahan 2026</span>
                </div>

                <h1>
                  Pemerintahan
                  <strong>Amborawang Darat</strong>
                </h1>

                <p>
                  Struktur aparatur, lembaga kemasyarakatan, mitra kewilayahan,
                  lembaga adat, serta 13 Ketua RT dalam satu halaman resmi.
                </p>

                <div className={styles.heroStats}>
                  <div><strong>17</strong><span>Aparatur terdata</span></div>
                  <div><strong>13</strong><span>Wilayah RT</span></div>
                  <div><strong>07</strong><span>Lembaga & mitra</span></div>
                </div>
              </div>
            </Reveal>

            <Reveal enabled delay={70}>
              <div className={styles.commandPanel}>
                <div className={styles.commandTop}>
                  <div className={styles.commandIcon}><NetworkIcon /></div>
                  <div>
                    <span>Struktur Koordinasi</span>
                    <strong>Kelurahan → Lembaga → RT → Warga</strong>
                  </div>
                </div>

                <div className={styles.commandFlow}>
                  <div><span>01</span><strong>Lurah</strong></div>
                  <i />
                  <div><span>02</span><strong>Perangkat</strong></div>
                  <i />
                  <div><span>03</span><strong>Lembaga</strong></div>
                  <i />
                  <div><span>04</span><strong>13 RT</strong></div>
                </div>

                <a href="#rt" className={styles.commandLink}>
                  Lihat Struktur Lengkap
                  <ArrowIcon size={16} />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* NAV */}
        <section className={styles.navSection}>
          <div className="container">
            <nav className={styles.sectionNav}>
              <a href="#pimpinan">Pimpinan</a>
              <a href="#struktural">Struktural</a>
              <a href="#staf">Staf</a>
              <a href="#lembaga">Lembaga</a>
              <a href="#rt">Ketua RT</a>
            </nav>
          </div>
        </section>

        {/* EXECUTIVE SUMMARY */}
        <section className={styles.executiveSection}>
          <div className="container">
            <div className={styles.executiveGrid}>
              <Reveal enabled>
                <div className={styles.executiveIntro}>
                  <span>Ringkasan Struktur</span>
                  <strong>Pemerintahan yang terhubung sampai tingkat RT</strong>
                  <p>
                    Struktur halaman dirancang agar masyarakat dapat mengenali
                    aparatur, lembaga, dan unsur kewilayahan secara cepat.
                  </p>
                </div>
              </Reveal>

              <Reveal enabled delay={40}>
                <div className={styles.executiveStat}>
                  <span>Struktural</span>
                  <strong>05</strong>
                  <small>Lurah, Sekretaris, dan Kepala Seksi</small>
                </div>
              </Reveal>

              <Reveal enabled delay={80}>
                <div className={styles.executiveStat}>
                  <span>Staf</span>
                  <strong>13</strong>
                  <small>Pelaksana dan pengadministrasi</small>
                </div>
              </Reveal>

              <Reveal enabled delay={120}>
                <div className={styles.executiveStat}>
                  <span>Kewilayahan</span>
                  <strong>13 RT</strong>
                  <small>Struktur lingkungan masyarakat</small>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* PIMPINAN */}
        <section id="pimpinan" className={styles.leaderSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.sectionHeading}>
                <span>01</span>
                <div>
                  <small>Pimpinan Kelurahan</small>
                  <h2>Lurah Amborawang Darat</h2>
                </div>
              </div>
            </Reveal>

            <Reveal enabled delay={50}>
              <article className={styles.leaderProfile}>
                <div className={styles.leaderPhoto}>
                  <Photo src={structuralOfficials[0].photo} alt="Foto Lurah Amborawang Darat" />
                </div>

                <div className={styles.leaderText}>
                  <span>Pimpinan Pemerintahan</span>
                  <h3>{structuralOfficials[0].name}</h3>
                  <strong>{structuralOfficials[0].role}</strong>

                  <p>
                    Memimpin penyelenggaraan pemerintahan kelurahan, pelayanan
                    publik, pembangunan, pembinaan kemasyarakatan, serta
                    koordinasi perangkat dan lembaga di wilayah Amborawang Darat.
                  </p>

                  <div className={styles.leaderMeta}>
                    <div><small>Wilayah</small><strong>Amborawang Darat</strong></div>
                    <div><small>Kecamatan</small><strong>Samboja Barat</strong></div>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        {/* PEJABAT STRUKTURAL */}
        <section id="struktural" className={styles.darkSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.sectionHeadingDark}>
                <span>02</span>
                <div>
                  <small>Pejabat Struktural</small>
                  <h2>Perangkat inti kelurahan</h2>
                </div>
              </div>
            </Reveal>

            <div className={styles.structuralGrid}>
              {structuralOfficials.slice(1).map((person, index) => (
                <Reveal key={person.role} enabled delay={index * 45}>
                  <PersonCard person={person} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* STAF */}
        <section id="staf" className={styles.staffSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.sectionHeading}>
                <span>03</span>
                <div>
                  <small>Staf & Pelaksana</small>
                  <h2>Aparatur pendukung pelayanan kelurahan</h2>
                </div>
              </div>
            </Reveal>

            <div className={styles.staffSummary}>
              <div>
                <strong>13</strong>
                <span>Staf & pelaksana terdata</span>
              </div>
              <p>
                Mendukung administrasi, pengolahan data, pelayanan kantor,
                kegiatan sosial, pembangunan, dan pemerintahan.
              </p>
            </div>

            <div className={styles.staffGrid}>
              {staff.map((person, index) => (
                <Reveal key={`${person.name}-${person.role}`} enabled delay={(index % 6) * 35}>
                  <PersonCard person={person} compact />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TRANSITION PANEL */}
        <section className={styles.transitionSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.transitionPanel}>
                <div>
                  <span>Kolaborasi Pemerintahan</span>
                  <h2>Kelurahan tidak bekerja sendiri.</h2>
                </div>
                <p>
                  Lembaga kemasyarakatan, mitra keamanan, adat, dan Ketua RT
                  menjadi bagian penting dalam koordinasi pelayanan di tingkat wilayah.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* LEMBAGA */}
        <section id="lembaga" className={styles.institutionSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.institutionHeading}>
                <div>
                  <span>04</span>
                  <small>Lembaga & Mitra Kelurahan</small>
                  <h2>Unsur masyarakat yang bekerja bersama pemerintah</h2>
                </div>

                <p>
                  Nama dan foto pada bagian ini harus mengikuti SK atau daftar
                  resmi Kelurahan Amborawang Darat agar tidak salah menampilkan
                  pengurus.
                </p>
              </div>
            </Reveal>

            <div className={styles.institutionChips}>
              <span>LPM</span>
              <span>TP PKK</span>
              <span>Karang Taruna</span>
              <span>Lembaga Adat</span>
              <span>Linmas</span>
              <span>Bhabinkamtibmas</span>
              <span>Babinsa</span>
            </div>

            <div className={styles.institutionGrid}>
              {communityInstitutions.map((person, index) => (
                <Reveal key={person.role} enabled delay={index * 40}>
                  <PersonCard person={person} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* RT */}
        <section id="rt" className={styles.rtSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.rtHeading}>
                <div>
                  <span>05</span>
                  <small>Struktur Kewilayahan</small>
                  <h2>Ketua RT 01 sampai RT 13</h2>
                </div>

                <div className={styles.rtCount}>
                  <small>Struktur Wilayah</small>
                  <strong>13</strong>
                  <span>RT Kelurahan Amborawang Darat</span>
                </div>
              </div>
            </Reveal>

            <div className={styles.rtMetaStrip}>
              <div><span>Jumlah</span><strong>13 RT</strong></div>
              <div><span>Status</span><strong>Perlu verifikasi nama & foto</strong></div>
              <div><span>Wilayah</span><strong>Amborawang Darat</strong></div>
            </div>

            <div className={styles.rtGrid}>
              {rtList.map((person, index) => (
                <Reveal key={person.role} enabled delay={(index % 6) * 32}>
                  <PersonCard person={person} compact />
                </Reveal>
              ))}
            </div>

            <Reveal enabled>
              <div className={styles.dataNotice}>
                <div>
                  <span>Dokumen yang dibutuhkan</span>
                  <strong>
                    Daftar Ketua RT, Ketua LPM, Ketua PKK, Ketua Karang Taruna,
                    Kepala Adat, Linmas, Babinsa, Bhabinkamtibmas dan foto resmi.
                  </strong>
                </div>
                <Link href="/kontak" className={styles.noticeLink}>
                  Kontak Kelurahan
                  <ArrowIcon size={16} />
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
                  <small>Data Pemerintahan</small>
                  <h2>Struktur lengkap, terbuka, dan mudah diperbarui.</h2>
                  <p>
                    Gunakan dokumentasi resmi kelurahan sebagai sumber nama,
                    jabatan, dan foto pengurus.
                  </p>
                </div>

                <div className={styles.ctaActions}>
                  <Link href="/kontak" className={styles.ctaPrimary}>
                    Hubungi Kelurahan
                    <ArrowIcon />
                  </Link>
                  <Link href="/dokumen" className={styles.ctaSecondary}>
                    Dokumen Publik
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
