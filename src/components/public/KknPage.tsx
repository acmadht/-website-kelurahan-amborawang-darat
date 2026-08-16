"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./KknPage.module.css";
import kknLogoWatermark from "@/assets/kkn-logo-watermark.webp";
import type { KknMember, KknTeam } from "@/types";

type Member = {
  name: string;
  role: string;
  division: string;
  image: string;
  studyProgram: string;
  nim: string;
  quote: string;
  description?: string;
};

// GANTI nilai studyProgram dan nim di bawah ini sesuai data asli mahasiswa.
// Nilai "Belum diisi" sengaja digunakan agar tidak mengarang data akademik.
const coreTeam: Member[] = [
  {
    name: "Achmad Aldi Saputra",
    role: "Ketua",
    division: "Pimpinan Tim",
    image: "/images/kkn/02-ketua.jpg",
    studyProgram: "Sistem Informasi",
    nim: "2341919017",
    quote:
      "Jika Kamu Tidak Mengambil resiko, Kamu Tidak Akan Mendapatkan Masa Depan",
  },
  {
    name: "Norvina Alvionika",
    role: "Sekretaris",
    division: "Administrasi",
    image: "/images/kkn/03-sekretaris.jpg",
    studyProgram: "Hukum Ekonomi Syariah",
    nim: "2221407035",
    quote:
      "Belajar Bukan Untuk Menjadi Sempurna, Tetapi Untuk Menjadi Lebih Baik.",
  },
  {
    name: "Junita Noor Azzara",
    role: "Bendahara",
    division: "Keuangan",
    image: "/images/kkn/04-bendahara.jpg",
    studyProgram: "Hukum Tata Negara",
    nim: "2321609063",
    quote:
      "Hidup Bukan Untuk Sempurna, Tapi Untuk Bermanfaat.",
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
        studyProgram: "Manajemen Pendidikan Islam",
        nim: "2311102020",
        quote:
          "فن الحب هو الشوك - Seni Cinta ialah Rindu.",
      },
      {
        name: "Devi Sulistyowati",
        role: "Anggota Media",
        division: "Media",
        image: "/images/kkn/06-media-devi.jpg",
        studyProgram: "Pendidikan Agama Islam",
        nim: "2311101123",
        quote: "Apa Yang Menjadi Takdirmu Tidak Akan Melewatkanmu, Dan Apa Yang Melewatkanmu Tidak Akan Pernah Menjadi Takdirmu. - Umar Bin Khattab",
      },
      {
        name: "Ikhtiara Nada Maheswari",
        role: "Anggota Media",
        division: "Media",
        image: "/images/kkn/07-media-ikhtiara.jpg",
        studyProgram: "Ilmu Al-Quran Dan Tafsir",
        nim: "2342115007",
        quote:
          "Tetap bertahan walau semuanya berantakan.",
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
        studyProgram: "Manajemen Dakwah",
        nim: "2341913021",
        quote:
          "Ini Bukan Soal Apakah Aku Bisa, Aku Akan Melakukannya Karena Aku Menginginkannya.",
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
        studyProgram: "Manajemen Bisnis Syariah",
        nim: "2331716058",
        quote:
          "I Love Being Cringe, I Love Being Annoying, I Love Being Weird. #Freedom",
      },
      {
        name: "Abdul Khakim",
        role: "Anggota Logistik",
        division: "Logistik",
        image: "/images/kkn/10-logistik-abdul.jpg",
        studyProgram: "Sistem Informasi",
        nim: "2341919006",
        quote:
          "Bahagia Itu Diciptakan Bukan Dicari.",
      },
      {
        name: "Muhamad Helmi Yanur",
        role: "Anggota Logistik",
        division: "Logistik",
        image: "/images/kkn/11-logistik-helmi.jpg",
        studyProgram: "Pendidikan Bahasa Arab",
        nim: "2211203057",
        quote:
          "Babi Tu Haram.",
      },
    ],
  },
];

const fallbackTeam: KknTeam = {
  universityName: "Universitas Islam Negeri Sultan Aji Muhammad Idris Samarinda",
  groupName: "Kelompok 2 KKN Reguler",
  year: "2026",
  location: "Kelurahan Amborawang Darat",
  supervisorName: "Dr. Nur Kholik Afandi, S.Ag., M.Pd",
  supervisorPhotoUrl: "/images/kkn/01-dosen-pembimbing.jpg",
  supervisorDescription: "Mendampingi pelaksanaan program KKN, memberikan arahan akademik, serta memastikan kegiatan pengabdian berjalan terarah dan sesuai tujuan program.",
  description: "Kolaborasi mahasiswa, dosen pembimbing, dan pemerintah kelurahan dalam mendukung program pengabdian dan pengembangan informasi publik di Amborawang Darat.",
  structureImageUrl: "/images/kkn/struktur-organisasi-kkn.png",
};

const fallbackMembers = [...coreTeam, ...divisions.flatMap((item) => item.members)];

function inferDivision(member: Partial<KknMember>) {
  const explicit = String(member.division || "").trim();
  if (explicit) return explicit;
  const role = String(member.role || "").toLowerCase();
  if (role.includes("ketua")) return "Pimpinan Tim";
  if (role.includes("sekretaris")) return "Administrasi";
  if (role.includes("bendahara")) return "Keuangan";
  if (role.includes("media")) return "Media";
  if (role.includes("humas")) return "Humas";
  if (role.includes("logistik")) return "Logistik";
  return "Anggota";
}

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
  if (member.description?.trim()) {
    return {
      description: member.description.trim(),
      focus: [member.division, member.role, "Program KKN"].filter(Boolean).slice(0, 3),
    };
  }
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

function MemberCard({ member, location, year }: { member: Member; location: string; year: string }) {
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
              <span className={styles.frontLocation}>{location} • KKN {year}</span>
            </span>
          </span>
        </span>

        <span className={`${styles.flipFace} ${styles.flipBack}`}>
          <span className={styles.backDecor} aria-hidden="true">
            <span className={styles.backDecorRing} />
            <span
              className={styles.backLogoWatermark}
              style={{ backgroundImage: `url(${kknLogoWatermark.src})` }}
            />
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
              <span>{location}</span>
              <i aria-hidden="true" />
              <span>KKN {year}</span>
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

export default function KknPage({
  initialTeam = fallbackTeam,
  initialMembers = [],
}: {
  initialTeam?: KknTeam;
  initialMembers?: KknMember[];
}) {
  const team = { ...fallbackTeam, ...initialTeam };
  const locationLabel = String(team.location || fallbackTeam.location).replace(/^Kelurahan\s+/i, "").trim() || "Amborawang Darat";
  const yearLabel = String(team.year || fallbackTeam.year || "").trim() || "-";

  const displayedMembers = useMemo(() => {
    const fallbackByName = new Map(fallbackMembers.map((member) => [member.name.toLowerCase(), member]));
    const source = initialMembers.length ? initialMembers : fallbackMembers.map((member, index) => ({
      ...member,
      photoUrl: member.image,
      order: index + 1,
      isActive: true,
    }));

    return source
      .filter((member) => member.isActive !== false)
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
      .map((member) => {
        const base = fallbackByName.get(String(member.name || "").toLowerCase());
        return {
          name: String(member.name || base?.name || "Anggota KKN"),
          role: String(member.role || base?.role || "Anggota"),
          division: inferDivision(member) || base?.division || "Anggota",
          image: String(member.photoUrl || base?.image || "/images/kkn/placeholder-kkn.svg"),
          studyProgram: String(member.studyProgram || base?.studyProgram || "Belum diisi"),
          nim: String(member.nim || base?.nim || "Belum diisi"),
          quote: String(member.quote || base?.quote || "Bersama mengabdi untuk masyarakat."),
          description: String(member.description || ""),
        } satisfies Member;
      });
  }, [initialMembers]);

  const coreRoles = new Set(["ketua", "sekretaris", "bendahara"]);
  const coreTeamItems = displayedMembers.filter((member) => coreRoles.has(member.role.toLowerCase()));
  const divisionMembers = displayedMembers.filter((member) => !coreRoles.has(member.role.toLowerCase()));
  const divisionItems = Array.from(
    divisionMembers.reduce((map, member) => {
      const key = member.division || "Anggota";
      if (!map.has(key)) map.set(key, [] as Member[]);
      map.get(key)!.push(member);
      return map;
    }, new Map<string, Member[]>()),
  ).map(([title, members]) => ({ title, members }));

  const divisionCount = divisionItems.length;

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
                  <span>{team.groupName || "Tim KKN Reguler"}</span>
                </div>

                <h1>
                  Tim KKN
                  <strong>{locationLabel}</strong>
                </h1>

                <p>
                  {team.description}
                </p>

                <div className={styles.heroStats}>
                  <div>
                    <strong>{String(displayedMembers.length).padStart(2, "0")}</strong>
                    <span>Mahasiswa</span>
                  </div>
                  <div>
                    <strong>01</strong>
                    <span>Dosen Pembimbing</span>
                  </div>
                  <div>
                    <strong>{String(divisionCount).padStart(2, "0")}</strong>
                    <span>Divisi</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal enabled delay={70}>
              <div className={styles.heroVisual}>
                <div className={styles.heroVisualTop}>
                  <span>Struktur Tim</span>
                  <strong>KKN {locationLabel}</strong>
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
                    src={team.supervisorPhotoUrl || "/images/kkn/01-dosen-pembimbing.jpg"}
                    alt={`Foto ${team.supervisorName}`}
                  />
                </div>

                <div className={styles.advisorBody}>
                  <span>Dosen Pembimbing Lapangan</span>
                  <h3>{team.supervisorName}</h3>
                  <p>{team.supervisorDescription || fallbackTeam.supervisorDescription}</p>

                  <div className={styles.advisorMeta}>
                    <div>
                      <small>Peran</small>
                      <strong>Pembimbing Lapangan</strong>
                    </div>
                    <div>
                      <small>Lokasi</small>
                      <strong>{team.location.replace(/^Kelurahan\s+/i, "")}</strong>
                    </div>
                    <div>
                      <small>Universitas</small>
                      <strong>{team.universityName}</strong>
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
              {coreTeamItems.map((member, index) => (
                <Reveal key={member.name} enabled delay={index * 45}>
                  <MemberCard
                    member={member}
                    location={locationLabel}
                    year={yearLabel}
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

            {divisionItems.map((division, divisionIndex) => {
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
                          location={locationLabel}
                          year={yearLabel}
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
                    <strong>{String(coreTeamItems.length).padStart(2, "0")}</strong>
                    <span>Tim Inti</span>
                  </div>
                  <div>
                    <strong>{String(divisionCount).padStart(2, "0")}</strong>
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
                    {team.groupName} • {team.year}
                  </span>
                </div>

                <div className={styles.structureTree}>
                  <div className={styles.structureLevel}>
                    <article className={`${styles.structurePersonCard} ${styles.structureAdvisorCard}`}>
                      <span className={styles.structureAvatar}>
                        <img
                          src={team.supervisorPhotoUrl || "/images/kkn/01-dosen-pembimbing.jpg"}
                          alt={`Foto ${team.supervisorName}`}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = "/images/kkn/placeholder-kkn.svg";
                          }}
                        />
                      </span>

                      <span className={styles.structurePersonText}>
                        <small>Dosen Pembimbing Lapangan</small>
                        <strong>{team.supervisorName}</strong>
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
                      {coreTeamItems.map((member, index) => (
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
                      {divisionItems.map((division, divisionIndex) => (
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
                    href={team.structureImageUrl || "/images/kkn/struktur-organisasi-kkn.png"}
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
                  <h2>Kolaborasi untuk {locationLabel}.</h2>
                  <p>
                    Program kerja, dokumentasi kegiatan, dan luaran KKN kini
                    dikelompokkan dalam ruang KKN agar lebih mudah ditelusuri.
                  </p>
                </div>

                <div className={styles.ctaActions}>
                  <Link href="/kkn/program-kerja" className={styles.ctaPrimary}>
                    Program Kerja
                    <ArrowIcon />
                  </Link>

                  <Link href="/kkn/luaran" className={styles.ctaSecondary}>
                    Luaran KKN
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
