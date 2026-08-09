"use client";

import { useState } from "react";
import Link from "next/link";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./KknPage.module.css";

type Member = {
  name: string;
  role: string;
  division: string;
  image: string;
  accent?: string;
};

const coreTeam: Member[] = [
  {
    name: "Achmad Aldi Saputra",
    role: "Ketua",
    division: "Pimpinan Tim",
    image: "/images/kkn/02-ketua.jpg",
  },
  {
    name: "Norvina Alvionika",
    role: "Sekretaris",
    division: "Administrasi",
    image: "/images/kkn/03-sekretaris.jpg",
  },
  {
    name: "Junita Noor Azzara",
    role: "Bendahara",
    division: "Keuangan",
    image: "/images/kkn/04-bendahara.jpg",
  },
];

const divisions: { title: string; members: Member[] }[] = [
  {
    title: "Media",
    members: [
      {
        name: "Syarifah Rabiatul Adhawiyah",
        role: "Anggota Media",
        division: "Media",
        image: "/images/kkn/05-media-syarifah.jpg",
      },
      {
        name: "Devi Sulistyowati",
        role: "Anggota Media",
        division: "Media",
        image: "/images/kkn/06-media-devi.jpg",
      },
      {
        name: "Ikhtiara Nada Maheswari",
        role: "Anggota Media",
        division: "Media",
        image: "/images/kkn/07-media-ikhtiara.jpg",
      },
    ],
  },
  {
    title: "Humas",
    members: [
      {
        name: "Muhammad Hylmi Ramadhan Ardani",
        role: "Anggota Humas",
        division: "Humas",
        image: "/images/kkn/08-humas-hylmi.jpg",
      },
    ],
  },
  {
    title: "Logistik",
    members: [
      {
        name: "Elisyah Febrianti",
        role: "Anggota Logistik",
        division: "Logistik",
        image: "/images/kkn/09-logistik-elisyah.jpg",
      },
      {
        name: "Abdul Khakim",
        role: "Anggota Logistik",
        division: "Logistik",
        image: "/images/kkn/10-logistik-abdul.jpg",
      },
      {
        name: "Muhamad Helmi Yanur",
        role: "Anggota Logistik",
        division: "Logistik",
        image: "/images/kkn/11-logistik-helmi.jpg",
      },
    ],
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

function TeamIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className={styles.photoFrame}>
      <img className={styles.photoBackdrop} src={src} alt="" aria-hidden="true" />
      <img
        className={styles.photoMain}
        src={src}
        alt={alt}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = "/images/kkn/placeholder-kkn.svg";
        }}
      />
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  const [flipped, setFlipped] = useState(false);

  const detailText =
    member.division === "Media"
      ? "Bertanggung jawab mendukung dokumentasi, publikasi, dan kebutuhan media kegiatan KKN."
      : member.division === "Humas"
        ? "Mendukung komunikasi, koordinasi, serta hubungan tim KKN dengan masyarakat dan pihak kelurahan."
        : member.division === "Logistik"
          ? "Mendukung kesiapan perlengkapan dan kebutuhan teknis selama pelaksanaan program KKN."
          : member.division === "Administrasi"
            ? "Mendukung pencatatan, administrasi, dan penyusunan kebutuhan dokumentasi kegiatan tim."
            : member.division === "Keuangan"
              ? "Mengelola pencatatan dan kebutuhan keuangan kegiatan KKN secara tertib."
              : "Mengoordinasikan pelaksanaan program serta memastikan kegiatan tim berjalan terarah.";

  return (
    <button
      type="button"
      className={`${styles.flipCard} ${flipped ? styles.flipped : ""}`}
      onClick={() => setFlipped((value) => !value)}
      aria-pressed={flipped}
      aria-label={`${flipped ? "Tampilkan bagian depan" : "Lihat detail"} ${member.name}`}
    >
      <span className={styles.flipHint}>
        {flipped ? "Klik untuk kembali" : "Klik untuk lihat detail"}
      </span>

      <span className={styles.flipInner}>
        <span className={`${styles.flipFace} ${styles.flipFront}`}>
          <span className={styles.memberPhotoWrap}>
            <Photo src={member.image} alt={`Foto ${member.name}`} />
          </span>

          <span className={styles.memberBody}>
            <span>{member.division}</span>
            <h3>{member.name}</h3>
            <strong>{member.role}</strong>
          </span>
        </span>

        <span className={`${styles.flipFace} ${styles.flipBack}`}>
          <span className={styles.backNumber}>
            {member.division.substring(0, 2).toUpperCase()}
          </span>

          <span className={styles.backContent}>
            <small>{member.division}</small>
            <h3>{member.name}</h3>
            <strong>{member.role}</strong>
            <p>{detailText}</p>
          </span>

          <span className={styles.backAction}>Klik untuk kembali</span>
        </span>
      </span>
    </button>
  );
}

export default function KknPage() {
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
                  <TeamIcon />
                  <span>Tim KKN Reguler</span>
                </div>

                <h1>
                  Tim KKN
                  <strong>Amborawang Darat</strong>
                </h1>

                <p>
                  Kolaborasi mahasiswa, dosen pembimbing, dan pemerintah
                  kelurahan dalam mendukung program pengabdian dan pengembangan
                  informasi publik di Amborawang Darat.
                </p>

                <div className={styles.heroStats}>
                  <div>
                    <strong>10</strong>
                    <span>Mahasiswa</span>
                  </div>
                  <div>
                    <strong>01</strong>
                    <span>Dosen Pembimbing</span>
                  </div>
                  <div>
                    <strong>03</strong>
                    <span>Divisi</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal enabled delay={70}>
              <div className={styles.heroVisual}>
                <div className={styles.heroVisualTop}>
                  <span>Struktur Tim</span>
                  <strong>KKN Amborawang Darat</strong>
                </div>

                <div className={styles.heroFlow}>
                  <div>
                    <span>01</span>
                    <strong>Dosen Pembimbing</strong>
                  </div>
                  <i />
                  <div>
                    <span>02</span>
                    <strong>Ketua</strong>
                  </div>
                  <i />
                  <div>
                    <span>03</span>
                    <strong>Divisi</strong>
                  </div>
                </div>

                <a href="#struktur" className={styles.heroLink}>
                  Lihat Struktur Tim
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
              <a href="#pembimbing">Pembimbing</a>
              <a href="#inti">Tim Inti</a>
              <a href="#divisi">Divisi</a>
              <a href="#struktur">Struktur</a>
            </nav>
          </div>
        </section>

        {/* ADVISOR */}
        <section id="pembimbing" className={styles.advisorSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.sectionHeading}>
                <span>01</span>
                <div>
                  <small>Dosen Pembimbing</small>
                  <h2>Pendamping akademik tim</h2>
                </div>
              </div>
            </Reveal>

            <Reveal enabled delay={50}>
              <article className={styles.advisorCard}>
                <div className={styles.advisorPhoto}>
                  <Photo
                    src="/images/kkn/01-dosen-pembimbing.jpg"
                    alt="Foto Dr. Nur Kholik Afandi, S.Ag., M.Pd"
                  />
                </div>

                <div className={styles.advisorBody}>
                  <span>Dosen Pembimbing Lapangan</span>
                  <h3>Dr. Nur Kholik Afandi, S.Ag., M.Pd</h3>
                  <p>
                    Mendampingi pelaksanaan program KKN, memberikan arahan
                    akademik, serta memastikan kegiatan pengabdian berjalan
                    terarah dan sesuai tujuan program.
                  </p>

                  <div className={styles.advisorMeta}>
                    <div>
                      <small>Peran</small>
                      <strong>Pembimbing Lapangan</strong>
                    </div>
                    <div>
                      <small>Lokasi</small>
                      <strong>Amborawang Darat</strong>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        {/* CORE TEAM */}
        <section id="inti" className={styles.coreSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.sectionHeadingDark}>
                <span>02</span>
                <div>
                  <small>Tim Inti</small>
                  <h2>Koordinasi utama kegiatan</h2>
                </div>
              </div>
            </Reveal>

            <div className={styles.coreGrid}>
              {coreTeam.map((member, index) => (
                <Reveal key={member.name} enabled delay={index * 45}>
                  <MemberCard member={member} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* DIVISIONS */}
        <section id="divisi" className={styles.divisionSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.divisionHeading}>
                <div>
                  <span>03</span>
                  <small>Divisi KKN</small>
                  <h2>Tim pelaksana program</h2>
                </div>

                <p>
                  Setiap divisi memiliki peran berbeda untuk memastikan
                  dokumentasi, komunikasi, dan kebutuhan teknis kegiatan berjalan
                  dengan baik.
                </p>
              </div>
            </Reveal>

            {divisions.map((division, divisionIndex) => (
              <section key={division.title} className={styles.divisionBlock}>
                <div className={styles.divisionLabel}>
                  <span>0{divisionIndex + 1}</span>
                  <strong>{division.title}</strong>
                </div>

                <div className={styles.divisionGrid}>
                  {division.members.map((member, index) => (
                    <Reveal key={member.name} enabled delay={index * 40}>
                      <MemberCard member={member} />
                    </Reveal>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        {/* STRUCTURE */}
        <section id="struktur" className={styles.structureSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.structureHeading}>
                <span>04</span>
                <small>Struktur Organisasi</small>
                <h2>Susunan Tim KKN</h2>
                <p>
                  Struktur organisasi menampilkan jalur koordinasi tim secara
                  keseluruhan.
                </p>
              </div>
            </Reveal>

            <Reveal enabled delay={50}>
              <div className={styles.structureCard}>
                <div className={styles.structureImage}>
                  <img
                    src="/images/kkn/struktur-organisasi-kkn.png"
                    alt="Struktur organisasi Tim KKN Amborawang Darat"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/images/kkn/placeholder-kkn.svg";
                    }}
                  />
                </div>

                <div className={styles.structureFooter}>
                  <div>
                    <span>Struktur Tim</span>
                    <strong>KKN Amborawang Darat</strong>
                  </div>

                  <a
                    href="/images/kkn/struktur-organisasi-kkn.png"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lihat Ukuran Penuh
                    <ArrowIcon size={16} />
                  </a>
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
                  <span>Program KKN</span>
                  <h2>Kolaborasi untuk Amborawang Darat.</h2>
                  <p>
                    Dokumentasi program dan kegiatan KKN dapat dilihat melalui
                    halaman berita dan galeri.
                  </p>
                </div>

                <div className={styles.ctaActions}>
                  <Link href="/berita" className={styles.ctaPrimary}>
                    Lihat Berita
                    <ArrowIcon />
                  </Link>

                  <Link href="/galeri" className={styles.ctaSecondary}>
                    Lihat Galeri
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
