"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageHero from "./PageHero";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./KknPage.module.css";

type MemberGroup = "advisor" | "leader" | "division";

type DivisionName =
    | "Pembimbing"
    | "Ketua"
    | "Sekretaris"
    | "Bendahara"
    | "Media"
    | "Humas"
    | "Logistik";

interface MemberItem {
    id: string;
    name: string;
    role: string;
    division: DivisionName;
    image: string;
    group: MemberGroup;
    description: string;
}

const kknMembers: MemberItem[] = [
    {
        id: "dosen-pembimbing",
        name: "Dr. Nur Kholik Afandi, S.Ag., M.Pd",
        role: "Dosen Pembimbing",
        division: "Pembimbing",
        image: "/images/kkn/01-dosen-pembimbing.jpg",
        group: "advisor",
        description:
            "Pembimbing utama Kelompok 2 KKN Reguler Amborawang Darat Tahun 2026.",
    },
    {
        id: "ketua",
        name: "Achmad Aldi Saputra",
        role: "Ketua",
        division: "Ketua",
        image: "/images/kkn/02-ketua.jpg",
        group: "leader",
        description:
            "Mengkoordinasikan pelaksanaan program kerja, arah gerak tim, dan komunikasi umum kelompok.",
    },
    {
        id: "sekretaris",
        name: "Norvina Alvionika",
        role: "Sekretaris",
        division: "Sekretaris",
        image: "/images/kkn/03-sekretaris.jpg",
        group: "leader",
        description:
            "Mengelola administrasi, dokumentasi surat, notulen, dan pengarsipan kegiatan tim.",
    },
    {
        id: "bendahara",
        name: "Junita Noor Azzara",
        role: "Bendahara",
        division: "Bendahara",
        image: "/images/kkn/04-bendahara.jpg",
        group: "leader",
        description:
            "Mengelola pencatatan keuangan, pengeluaran kegiatan, dan akuntabilitas dana tim.",
    },
    {
        id: "media-1",
        name: "Syarifah Rabiatul Adhawiyah",
        role: "Anggota",
        division: "Media",
        image: "/images/kkn/05-media-syarifah.jpg",
        group: "division",
        description:
            "Bertanggung jawab pada publikasi, visual konten, dokumentasi, dan media informasi kegiatan KKN.",
    },
    {
        id: "media-2",
        name: "Devi Sulistyowati",
        role: "Anggota",
        division: "Media",
        image: "/images/kkn/06-media-devi.jpg",
        group: "division",
        description:
            "Mendukung publikasi kegiatan, pembuatan materi komunikasi, serta penyebaran informasi tim.",
    },
    {
        id: "media-3",
        name: "Ikhtiara Nada Maheswari",
        role: "Anggota",
        division: "Media",
        image: "/images/kkn/07-media-ikhtiara.jpg",
        group: "division",
        description:
            "Berperan dalam dokumentasi kegiatan lapangan dan pengembangan materi visual tim KKN.",
    },
    {
        id: "humas",
        name: "Muhammad Hylmi Ramadhan Ardani",
        role: "Anggota",
        division: "Humas",
        image: "/images/kkn/08-humas-hylmi.jpg",
        group: "division",
        description:
            "Mengelola hubungan komunikasi dengan masyarakat, mitra, dan pihak terkait selama program berlangsung.",
    },
    {
        id: "logistik-1",
        name: "Elisyah Febrianti",
        role: "Anggota",
        division: "Logistik",
        image: "/images/kkn/09-logistik-elisyah.jpg",
        group: "division",
        description:
            "Mendukung kebutuhan perlengkapan, penyiapan alat, dan distribusi sarana kegiatan tim.",
    },
    {
        id: "logistik-2",
        name: "Abdul Khakim",
        role: "Anggota",
        division: "Logistik",
        image: "/images/kkn/10-logistik-abdul.jpg",
        group: "division",
        description:
            "Menangani pengelolaan perlengkapan dan memastikan kesiapan kebutuhan teknis kegiatan.",
    },
    {
        id: "logistik-3",
        name: "Muhamad Helmi Yanur",
        role: "Anggota",
        division: "Logistik",
        image: "/images/kkn/11-logistik-helmi.jpg",
        group: "division",
        description:
            "Mendukung koordinasi lapangan, pengelolaan perlengkapan, dan kebutuhan operasional kegiatan.",
    },
];

function Icon({
    name,
    size = 20,
}: {
    name:
    | "users"
    | "sparkles"
    | "arrow"
    | "flip"
    | "camera"
    | "message"
    | "box"
    | "wallet"
    | "shield"
    | "star";
    size?: number;
}) {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        "aria-hidden": true,
    };

    const icons = {
        users: (
            <>
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 19c.5-4 2.5-6 5.5-6s5 2 5.5 6" />
                <path d="M15 6.5a2.5 2.5 0 0 1 0 5" />
                <path d="M16 13c2.6.5 4 2.5 4.5 5" />
            </>
        ),

        sparkles: (
            <>
                <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
                <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
            </>
        ),

        arrow: (
            <>
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
            </>
        ),

        flip: (
            <>
                <path d="M8 7H4V3" />
                <path d="M20 17v4h-4" />
                <path d="M4 7c2-2.8 4.7-4 8-4 4.4 0 7.4 1.8 9 5" />
                <path d="M20 17c-2 2.8-4.7 4-8 4-4.4 0-7.4-1.8-9-5" />
            </>
        ),

        camera: (
            <>
                <path d="M4 8h3l1.5-2h7L17 8h3v10H4Z" />
                <circle cx="12" cy="13" r="3.5" />
            </>
        ),

        message: <path d="M5 5h14v10H9l-4 4V5Z" />,

        box: (
            <>
                <path d="m12 3 8 4.5v9L12 21 4 16.5v-9L12 3Z" />
                <path d="M12 12 4 7.5" />
                <path d="M12 12l8-4.5" />
                <path d="M12 12v9" />
            </>
        ),

        wallet: (
            <>
                <path d="M4 7h14a2 2 0 0 1 2 2v8H6a2 2 0 0 1-2-2V7Z" />
                <path d="M4 7V6a2 2 0 0 1 2-2h11" />
                <path d="M16 12h4" />
            </>
        ),

        shield: (
            <>
                <path d="M12 3 5 6v5c0 4.8 2.8 8 7 10 4.2-2 7-5.2 7-10V6Z" />
                <path d="m9 12 2 2 4-4" />
            </>
        ),

        star: (
            <path d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8L6.8 19l1-5.8-4.2-4.1 5.8-.8Z" />
        ),
    };

    return <svg {...common}>{icons[name]}</svg>;
}

function getDivisionIcon(division: DivisionName) {
    switch (division) {
        case "Media":
            return <Icon name="camera" />;

        case "Humas":
            return <Icon name="message" />;

        case "Logistik":
            return <Icon name="box" />;

        case "Bendahara":
            return <Icon name="wallet" />;

        case "Pembimbing":
            return <Icon name="shield" />;

        case "Ketua":
            return <Icon name="star" />;

        default:
            return <Icon name="users" />;
    }
}

function MemberCard({
    member,
    flipped,
    onToggle,
    featured = false,
}: {
    member: MemberItem;
    flipped: boolean;
    onToggle: (id: string) => void;
    featured?: boolean;
}) {
    return (
        <button
            type="button"
            className={`${styles.memberCard} ${flipped ? styles.memberCardFlipped : ""
                } ${featured ? styles.featuredMemberCard : ""}`}
            onClick={() => onToggle(member.id)}
            aria-pressed={flipped}
            aria-label={`Lihat detail ${member.name}`}
        >
            <div className={styles.memberCardInner}>
                {/* FRONT */}
                <div className={`${styles.memberFace} ${styles.memberFront}`}>
                    <div className={styles.photoWrap}>
                        {/* BACKGROUND BLUR */}
                        <img
                            src={member.image}
                            alt=""
                            aria-hidden="true"
                            className={styles.photoBackground}
                        />

                        {/* FOTO UTAMA TIDAK DIPOTONG */}
                        <img
                            src={member.image}
                            alt={`Foto ${member.name}`}
                            className={styles.memberPhoto}
                            loading="lazy"
                        />

                        <div className={styles.photoGradient} aria-hidden="true" />

                        <span className={styles.cardRoleBadge}>
                            {member.division}
                        </span>

                        {featured && (
                            <span className={styles.premiumBadge}>
                                <Icon name="star" size={14} />
                                Pembimbing
                            </span>
                        )}
                    </div>

                    <div className={styles.memberInfo}>
                        <div className={styles.memberTopMeta}>
                            <span className={styles.memberDivisionIcon}>
                                {getDivisionIcon(member.division)}
                            </span>

                            <small>{member.role}</small>
                        </div>

                        <h3>{member.name}</h3>

                        <p>
                            Kelompok 2 KKN Reguler
                            <span> • </span>
                            Amborawang Darat
                        </p>

                        <span className={styles.flipHint}>
                            <Icon name="flip" size={16} />
                            Klik untuk lihat profil
                        </span>
                    </div>
                </div>

                {/* BACK */}
                <div className={`${styles.memberFace} ${styles.memberBack}`}>
                    <div className={styles.backPattern} />

                    <div className={styles.memberBackHeader}>
                        <span className={styles.memberBackIcon}>
                            {getDivisionIcon(member.division)}
                        </span>

                        <span className={styles.memberBackBadge}>
                            {member.division}
                        </span>
                    </div>

                    <div className={styles.memberBackBody}>
                        <span className={styles.backEyebrow}>
                            Profil Anggota
                        </span>

                        <h3>{member.name}</h3>

                        <strong>{member.role}</strong>

                        <p>{member.description}</p>

                        <ul className={styles.memberMetaList}>
                            <li>
                                <span>Program</span>
                                <strong>KKN Reguler 2026</strong>
                            </li>

                            <li>
                                <span>Kelompok</span>
                                <strong>Kelompok 2</strong>
                            </li>

                            <li>
                                <span>Lokasi</span>
                                <strong>Amborawang Darat</strong>
                            </li>

                            <li>
                                <span>Divisi</span>
                                <strong>{member.division}</strong>
                            </li>
                        </ul>
                    </div>

                    <span className={styles.flipHintBack}>
                        <Icon name="flip" size={16} />
                        Klik untuk kembali
                    </span>
                </div>
            </div>
        </button>
    );
}

export default function KknPage() {
    const [flippedCards, setFlippedCards] = useState<string[]>([]);

    function toggleCard(id: string) {
        setFlippedCards((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id],
        );
    }

    const advisor = useMemo(
        () =>
            kknMembers.find(
                (member) => member.group === "advisor",
            ),
        [],
    );

    const leaders = useMemo(
        () =>
            kknMembers.filter(
                (member) => member.group === "leader",
            ),
        [],
    );

    const mediaMembers = useMemo(
        () =>
            kknMembers.filter(
                (member) => member.division === "Media",
            ),
        [],
    );

    const humasMembers = useMemo(
        () =>
            kknMembers.filter(
                (member) => member.division === "Humas",
            ),
        [],
    );

    const logisticMembers = useMemo(
        () =>
            kknMembers.filter(
                (member) => member.division === "Logistik",
            ),
        [],
    );

    return (
        <PublicShell>
            <PageHero
                eyebrow="Tim KKN 2026"
                title="Tim KKN Reguler Amborawang Darat"
                description="Kenali dosen pembimbing, pengurus inti, dan anggota Kelompok 2 KKN Reguler Amborawang Darat melalui profil interaktif."
            />

            <section className={styles.kknSection}>
                <div className="container">
                    {/* PEMBIMBING */}
                    {advisor && (
                        <section className={styles.advisorSection}>
                            <Reveal enabled>
                                <div className={styles.sectionHeadingCenter}>
                                    <span className={styles.sectionLabel}>
                                        Dosen Pembimbing
                                    </span>

                                    <h2>Pembimbing Utama</h2>

                                    <p>
                                        Pendamping akademik yang memberikan arahan dan supervisi
                                        selama pelaksanaan KKN.
                                    </p>
                                </div>
                            </Reveal>

                            <Reveal enabled delay={60}>
                                <div className={styles.advisorWrap}>
                                    <MemberCard
                                        member={advisor}
                                        flipped={flippedCards.includes(advisor.id)}
                                        onToggle={toggleCard}
                                        featured
                                    />
                                </div>
                            </Reveal>
                        </section>
                    )}

                    {/* PENGURUS INTI */}
                    <section className={styles.blockSection}>
                        <Reveal enabled>
                            <div className={styles.sectionHeading}>
                                <div>
                                    <span className={styles.sectionLabel}>
                                        Pengurus Inti
                                    </span>

                                    <h2>Koordinator Kelompok</h2>
                                </div>

                                <p>
                                    Struktur inti yang mengelola koordinasi, administrasi, dan
                                    tata kelola kegiatan kelompok.
                                </p>
                            </div>
                        </Reveal>

                        <div className={styles.leaderGrid}>
                            {leaders.map((member, index) => (
                                <Reveal
                                    enabled
                                    delay={index * 70}
                                    key={member.id}
                                >
                                    <MemberCard
                                        member={member}
                                        flipped={flippedCards.includes(member.id)}
                                        onToggle={toggleCard}
                                    />
                                </Reveal>
                            ))}
                        </div>
                    </section>

                    {/* DIVISI */}
                    <section className={styles.blockSection}>
                        <Reveal enabled>
                            <div className={styles.sectionHeading}>
                                <div>
                                    <span className={styles.sectionLabel}>
                                        Divisi Pelaksana
                                    </span>

                                    <h2>Tim Pendukung Program Kerja</h2>
                                </div>

                                <p>
                                    Setiap divisi memiliki peran khusus dalam mendukung
                                    komunikasi, publikasi, dan operasional kegiatan lapangan.
                                </p>
                            </div>
                        </Reveal>

                        <div className={styles.divisionStack}>
                            {/* MEDIA */}
                            <section className={styles.divisionPanel}>
                                <div className={styles.divisionHeader}>
                                    <div className={styles.divisionTitleWrap}>
                                        <span className={styles.divisionIcon}>
                                            <Icon name="camera" />
                                        </span>

                                        <div>
                                            <span>Divisi</span>
                                            <h3>Media</h3>
                                        </div>
                                    </div>

                                    <p>
                                        Mengelola publikasi, dokumentasi, dan materi visual
                                        kegiatan.
                                    </p>
                                </div>

                                <div className={styles.divisionGridThree}>
                                    {mediaMembers.map((member, index) => (
                                        <Reveal
                                            enabled
                                            delay={index * 60}
                                            key={member.id}
                                        >
                                            <MemberCard
                                                member={member}
                                                flipped={flippedCards.includes(member.id)}
                                                onToggle={toggleCard}
                                            />
                                        </Reveal>
                                    ))}
                                </div>
                            </section>

                            {/* HUMAS */}
                            <section className={styles.divisionPanel}>
                                <div className={styles.divisionHeader}>
                                    <div className={styles.divisionTitleWrap}>
                                        <span className={styles.divisionIcon}>
                                            <Icon name="message" />
                                        </span>

                                        <div>
                                            <span>Divisi</span>
                                            <h3>Humas</h3>
                                        </div>
                                    </div>

                                    <p>
                                        Menjalin komunikasi dengan masyarakat serta pihak yang
                                        terlibat dalam kegiatan.
                                    </p>
                                </div>

                                <div className={styles.divisionGridSingle}>
                                    {humasMembers.map((member) => (
                                        <Reveal
                                            enabled
                                            key={member.id}
                                        >
                                            <MemberCard
                                                member={member}
                                                flipped={flippedCards.includes(member.id)}
                                                onToggle={toggleCard}
                                            />
                                        </Reveal>
                                    ))}
                                </div>
                            </section>

                            {/* LOGISTIK */}
                            <section className={styles.divisionPanel}>
                                <div className={styles.divisionHeader}>
                                    <div className={styles.divisionTitleWrap}>
                                        <span className={styles.divisionIcon}>
                                            <Icon name="box" />
                                        </span>

                                        <div>
                                            <span>Divisi</span>
                                            <h3>Logistik</h3>
                                        </div>
                                    </div>

                                    <p>
                                        Menyiapkan kebutuhan teknis, perlengkapan, dan operasional
                                        kegiatan.
                                    </p>
                                </div>

                                <div className={styles.divisionGridThree}>
                                    {logisticMembers.map((member, index) => (
                                        <Reveal
                                            enabled
                                            delay={index * 60}
                                            key={member.id}
                                        >
                                            <MemberCard
                                                member={member}
                                                flipped={flippedCards.includes(member.id)}
                                                onToggle={toggleCard}
                                            />
                                        </Reveal>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </section>
                </div>
            </section>
        </PublicShell>
    );
}