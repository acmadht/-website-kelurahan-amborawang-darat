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
  studyProgram: string;
  nim: string;
  quote: string;
};

// GANTI nilai studyProgram dan nim di bawah ini sesuai data asli mahasiswa.
// Nilai "Belum diisi" sengaja digunakan agar tidak mengarang data akademik.
const coreTeam: Member[] = [
  {
    name: "Achmad Aldi Saputra",
    role: "Ketua",
    division: "Pimpinan Tim",
    image: "/images/kkn/02-ketua.jpg",
    studyProgram: "Belum diisi",
    nim: "Belum diisi",
    quote:
      "Memimpin bukan tentang berjalan paling depan, tetapi memastikan semua bergerak bersama.",
  },
  {
    name: "Norvina Alvionika",
    role: "Sekretaris",
    division: "Administrasi",
    image: "/images/kkn/03-sekretaris.jpg",
    studyProgram: "Belum diisi",
    nim: "Belum diisi",
    quote:
      "Hal kecil yang tertata hari ini memudahkan langkah besar esok hari.",
  },
  {
    name: "Junita Noor Azzara",
    role: "Bendahara",
    division: "Keuangan",
    image: "/images/kkn/04-bendahara.jpg",
    studyProgram: "Belum diisi",
    nim: "Belum diisi",
    quote:
      "Ketelitian menjaga kepercayaan, keteraturan menjaga perjalanan tim.",
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
        studyProgram: "Belum diisi",
        nim: "Belum diisi",
        quote:
          "Setiap momen yang terdokumentasi adalah cerita yang tetap hidup.",
      },
      {
        name: "Devi Sulistyowati",
        role: "Anggota Media",
        division: "Media",
        image: "/images/kkn/06-media-devi.jpg",
        studyProgram: "Belum diisi",
        nim: "Belum diisi",
        quote: "Karya sederhana dapat menyampaikan pesan yang bermakna.",
      },
      {
        name: "Ikhtiara Nada Maheswari",
        role: "Anggota Media",
        division: "Media",
        image: "/images/kkn/07-media-ikhtiara.jpg",
        studyProgram: "Belum diisi",
        nim: "Belum diisi",
        quote:
          "Tangkap momennya, sampaikan ceritanya, tinggalkan manfaatnya.",
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
        studyProgram: "Belum diisi",
        nim: "Belum diisi",
        quote:
          "Komunikasi yang baik dimulai dari mendengar dan tumbuh melalui kolaborasi.",
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
        studyProgram: "Belum diisi",
        nim: "Belum diisi",
        quote:
          "Kesiapan yang baik membuat setiap kegiatan berjalan lebih tenang.",
      },
      {
        name: "Abdul Khakim",
        role: "Anggota Logistik",
        division: "Logistik",
        image: "/images/kkn/10-logistik-abdul.jpg",
        studyProgram: "Belum diisi",
        nim: "Belum diisi",
        quote:
          "Kerja yang rapi di balik layar ikut menentukan keberhasilan di lapangan.",
      },
      {
        name: "Muhamad Helmi Yanur",
        role: "Anggota Logistik",
        division: "Logistik",
        image: "/images/kkn/11-logistik-helmi.jpg",
        studyProgram: "Belum diisi",
        nim: "Belum diisi",
        quote:
          "Siap membantu, sigap bekerja, dan tetap solid dalam setiap kegiatan.",
      },
    ],
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

function RotateIcon({ size = 16 }: { size?: number }) {
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
      <path d="M21 2v6h-6" />
      <path d="M3 11a9 9 0 0 1 15.55-5.55L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 13a9 9 0 0 1-15.55 5.55L3 16" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
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

function getMemberDetails(member: Member) {
  if (member.division === "Media") {
    return {
      description:
        "Bertanggung jawab mendukung dokumentasi, publikasi, dan kebutuhan media kegiatan KKN.",
      focus: ["Dokumentasi", "Publikasi", "Konten Digital"],
    };
  }

  if (member.division === "Humas") {
    return {
      description:
        "Mendukung komunikasi, koordinasi, serta hubungan tim KKN dengan masyarakat dan pihak kelurahan.",
      focus: ["Koordinasi Warga", "Komunikasi Mitra", "Informasi Kegiatan"],
    };
  }

  if (member.division === "Logistik") {
    return {
      description:
        "Mendukung kesiapan perlengkapan dan kebutuhan teknis selama pelaksanaan program KKN.",
      focus: ["Perlengkapan", "Distribusi", "Kesiapan Teknis"],
    };
  }

  if (member.division === "Administrasi") {
    return {
      description:
        "Mendukung pencatatan, administrasi, dan penyusunan kebutuhan dokumentasi kegiatan tim.",
      focus: ["Surat & Arsip", "Notulensi", "Laporan Kegiatan"],
    };
  }

  if (member.division === "Keuangan") {
    return {
      description:
        "Mengelola pencatatan dan kebutuhan keuangan kegiatan KKN secara tertib dan transparan.",
      focus: ["Anggaran", "Pencatatan", "Rekap Biaya"],
    };
  }

  return {
    description:
      "Mengoordinasikan pelaksanaan program serta memastikan kegiatan tim berjalan terarah dan terhubung dengan pihak terkait.",
    focus: ["Koordinasi Program", "Evaluasi Tim", "Komunikasi Kelurahan"],
  };
}

function MemberCard({ member }: { member: Member }) {
  const [flipped, setFlipped] = useState(false);
  const detail = getMemberDetails(member);
  const initials = member.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <button
      type="button"
      className={`${styles.flipCard} ${flipped ? styles.flipped : ""}`}
      onClick={() => setFlipped((value) => !value)}
      aria-pressed={flipped}
      aria-label={`${flipped ? "Tampilkan bagian depan" : "Lihat detail"} ${member.name}`}
    >
      <span className={styles.flipHint}>
        <RotateIcon size={13} />
        {flipped ? "Klik untuk kembali" : "Klik untuk lihat detail"}
      </span>

      <span className={styles.flipInner}>
        <span className={`${styles.flipFace} ${styles.flipFront}`}>
          <span className={styles.frontGlow} aria-hidden="true" />
          <span className={styles.frontRing} aria-hidden="true" />

          <span className={styles.memberPhotoWrap}>
            <Photo src={member.image} alt={`Foto ${member.name}`} />
          </span>

          <span className={styles.frontGradient} aria-hidden="true" />

          <span className={styles.frontTopBar}>
            <span className={styles.frontDivisionBadge}>{member.division}</span>
          </span>

          <span className={styles.frontPanel}>
            <span className={styles.frontIdentity}>
              <small>{member.role}</small>
              <h3>{member.name}</h3>
              <strong>{member.role}</strong>
            </span>

            <span className={styles.frontAcademicRow}>
              <span className={styles.frontAcademicPill}>
                <small>Prodi</small>
                <strong>{member.studyProgram}</strong>
              </span>
              <span className={styles.frontAcademicPill}>
                <small>NIM</small>
                <strong>{member.nim}</strong>
              </span>
            </span>

            <span className={styles.frontFooter}>
              <span className={styles.frontLocation}>Amborawang Darat • KKN 2026</span>
            </span>
          </span>
        </span>

        <span className={`${styles.flipFace} ${styles.flipBack}`}>
          <span className={styles.backDecor} aria-hidden="true">
            <span className={styles.backDecorRing} />
            <span className={styles.backWatermark}>{initials}</span>
          </span>

          <span className={styles.backHeader}>
            <span className={styles.backNumber}>{member.division.substring(0, 2).toUpperCase()}</span>


          </span>

          <span className={styles.backContent}>
            <small>{member.division}</small>
            <h3>{member.name}</h3>
            <strong>{member.role}</strong>

            <span className={styles.backAcademicGrid}>
              <span className={styles.backAcademicItem}>
                <small>Program Studi</small>
                <strong>{member.studyProgram}</strong>
              </span>
              <span className={styles.backAcademicItem}>
                <small>NIM</small>
                <strong>{member.nim}</strong>
              </span>
            </span>

            <span className={styles.backFocusLabel}>Fokus Tugas</span>
            <span className={styles.backFocusGrid}>
              {detail.focus.map((item) => (
                <span key={item} className={styles.backFocusItem}>
                  {item}
                </span>
              ))}
            </span>

            <span className={styles.backQuoteLabel}>Quote / Motto</span>
            <span className={styles.backQuoteBox}>
              <span className={styles.backQuoteMark} aria-hidden="true">
                “
              </span>
              <span className={styles.backQuoteText}>{member.quote}</span>
            </span>
          </span>

          <span className={styles.backFooter}>
            <span className={styles.backMeta}>
              <span>Amborawang Darat</span>
              <i aria-hidden="true" />
              <span>KKN 2026</span>
            </span>

            <span className={styles.backAction}>
              Klik untuk kembali
              <ArrowIcon size={14} />
            </span>
          </span>
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
                  <MemberCard
                    member={member}
                  />
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
                  dokumentasi, komunikasi, dan kebutuhan teknis kegiatan
                  berjalan dengan baik.
                </p>
              </div>
            </Reveal>

            {divisions.map((division, divisionIndex) => {
              return (
                <section key={division.title} className={styles.divisionBlock}>
                  <div className={styles.divisionLabel}>
                    <span>0{divisionIndex + 1}</span>
                    <strong>{division.title}</strong>
                  </div>

                  <div className={styles.divisionGrid}>
                    {division.members.map((member, index) => (
                      <Reveal key={member.name} enabled delay={index * 40}>
                        <MemberCard
                          member={member}
                        />
                      </Reveal>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        {/* STRUCTURE */}
        <section id="struktur" className={styles.structureSection}>
          <span className={styles.structureGlowOne} aria-hidden="true" />
          <span className={styles.structureGlowTwo} aria-hidden="true" />
          <span className={styles.structureGridPattern} aria-hidden="true" />

          <div className="container">
            <Reveal enabled>
              <div className={styles.structureHeadingRow}>
                <div className={styles.structureHeading}>
                  <span>04</span>
                  <small>Struktur Organisasi</small>
                  <h2>Tim yang terhubung dalam satu alur kerja</h2>
                  <p>
                    Struktur ini menampilkan jalur koordinasi dari dosen
                    pembimbing, tim inti, hingga setiap divisi pelaksana KKN.
                  </p>
                </div>

                <div className={styles.structureSummary}>
                  <div>
                    <strong>01</strong>
                    <span>Pembimbing</span>
                  </div>
                  <div>
                    <strong>03</strong>
                    <span>Tim Inti</span>
                  </div>
                  <div>
                    <strong>03</strong>
                    <span>Divisi</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal enabled delay={50}>
              <div className={styles.structureBoard}>
                <div className={styles.structureBoardTop}>
                  <span className={styles.structureLiveBadge}>
                    <i aria-hidden="true" />
                    Jalur Koordinasi
                  </span>

                  <span className={styles.structureBoardMeta}>
                    KKN Amborawang Darat • 2026
                  </span>
                </div>

                <div className={styles.structureTree}>
                  <div className={styles.structureLevel}>
                    <article className={`${styles.structurePersonCard} ${styles.structureAdvisorCard}`}>
                      <span className={styles.structureAvatar}>
                        <img
                          src="/images/kkn/01-dosen-pembimbing.jpg"
                          alt="Foto Dr. Nur Kholik Afandi, S.Ag., M.Pd"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = "/images/kkn/placeholder-kkn.svg";
                          }}
                        />
                      </span>

                      <span className={styles.structurePersonText}>
                        <small>Dosen Pembimbing Lapangan</small>
                        <strong>Dr. Nur Kholik Afandi, S.Ag., M.Pd</strong>
                        <span>Pendamping akademik dan arah program</span>
                      </span>

                      <span className={styles.structureRoleBadge}>Pembimbing</span>
                    </article>
                  </div>

                  <div className={styles.structureConnector}>
                    <span />
                  </div>

                  <div className={styles.structureCoreLevel}>
                    <div className={styles.structureLevelLabel}>
                      <span>Tim Inti</span>
                      <small>Koordinasi utama</small>
                    </div>

                    <div className={styles.structureCoreGrid}>
                      {coreTeam.map((member, index) => (
                        <article
                          key={member.name}
                          className={styles.structurePersonCard}
                          style={{ animationDelay: `${index * 0.12}s` }}
                        >
                          <span className={styles.structureAvatar}>
                            <img
                              src={member.image}
                              alt={`Foto ${member.name}`}
                              onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src = "/images/kkn/placeholder-kkn.svg";
                              }}
                            />
                          </span>

                          <span className={styles.structurePersonText}>
                            <small>{member.division}</small>
                            <strong>{member.name}</strong>
                            <span>{member.role}</span>
                          </span>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className={`${styles.structureConnector} ${styles.structureConnectorWide}`}>
                    <span />
                  </div>

                  <div className={styles.structureDivisionLevel}>
                    <div className={styles.structureLevelLabel}>
                      <span>Divisi Pelaksana</span>
                      <small>Eksekusi program di lapangan</small>
                    </div>

                    <div className={styles.structureDivisionGrid}>
                      {divisions.map((division, divisionIndex) => (
                        <article
                          key={division.title}
                          className={styles.structureDivisionCard}
                          style={{ animationDelay: `${divisionIndex * 0.14}s` }}
                        >
                          <div className={styles.structureDivisionTop}>
                            <div>
                              <small>Divisi</small>
                              <h3>{division.title}</h3>
                            </div>
                            <span>{String(division.members.length).padStart(2, "0")}</span>
                          </div>

                          <div className={styles.structureMemberList}>
                            {division.members.map((member) => (
                              <div key={member.name} className={styles.structureMiniMember}>
                                <span className={styles.structureMiniAvatar}>
                                  <img
                                    src={member.image}
                                    alt=""
                                    aria-hidden="true"
                                    onError={(event) => {
                                      event.currentTarget.onerror = null;
                                      event.currentTarget.src = "/images/kkn/placeholder-kkn.svg";
                                    }}
                                  />
                                </span>

                                <span>
                                  <strong>{member.name}</strong>
                                  <small>{member.role}</small>
                                </span>
                              </div>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.structureFlowFooter}>
                  <div className={styles.structureFlowSteps}>
                    <span>Pembimbing</span>
                    <i />
                    <span>Tim Inti</span>
                    <i />
                    <span>Divisi</span>
                    <i />
                    <span>Program</span>
                  </div>

                  <a
                    href="/images/kkn/struktur-organisasi-kkn.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.structureImageLink}
                  >
                    Lihat bagan asli
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
