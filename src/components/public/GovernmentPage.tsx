"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCollectionData } from "@/hooks/useFirestoreData";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import type { Official, RegionLeader } from "@/types";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./GovernmentPage.module.css";

type Person = {
  name: string;
  role: string;
  unit: string;
  category?: string;
  parentId?: string;
  photo: string;
  status?: "aktif" | "kosong" | "verifikasi";
  description?: string;
};

const fallbackStructuralOfficials: Person[] = [
  { name: "", role: "Lurah", unit: "Pimpinan Kelurahan", category: "Pimpinan Kelurahan", photo: "/images/pemerintahan/placeholder.svg", status: "kosong" },
  { name: "", role: "Sekretaris Kelurahan", unit: "Sekretariat", category: "Sekretariat", photo: "/images/pemerintahan/placeholder.svg", status: "kosong" },
  { name: "", role: "Kepala Seksi Pemerintahan", unit: "Seksi Pemerintahan", category: "Seksi Pemerintahan", photo: "/images/pemerintahan/placeholder.svg", status: "kosong" },
  { name: "", role: "Kepala Seksi Sosial", unit: "Seksi Sosial", category: "Seksi Sosial", photo: "/images/pemerintahan/placeholder.svg", status: "kosong" },
  { name: "", role: "Kepala Seksi Pembangunan", unit: "Seksi Pembangunan", category: "Seksi Pembangunan", photo: "/images/pemerintahan/placeholder.svg", status: "kosong" },
];


const fallbackCommunityInstitutions: Person[] = [
  {
    name: "",
    role: "Ketua LPM",
    unit: "Lembaga Pemberdayaan Masyarakat",
    photo: "/images/pemerintahan/placeholder.svg",
    status: "verifikasi",
  },
  {
    name: "",
    role: "Ketua TP PKK",
    unit: "Pemberdayaan Kesejahteraan Keluarga",
    photo: "/images/pemerintahan/placeholder.svg",
    status: "verifikasi",
  },
  {
    name: "",
    role: "Ketua Karang Taruna",
    unit: "Karang Taruna",
    photo: "/images/pemerintahan/placeholder.svg",
    status: "verifikasi",
  },
  {
    name: "",
    role: "Kepala / Ketua Adat",
    unit: "Lembaga Adat",
    photo: "/images/pemerintahan/placeholder.svg",
    status: "verifikasi",
  },
  {
    name: "",
    role: "Koordinator Linmas",
    unit: "Perlindungan Masyarakat",
    photo: "/images/pemerintahan/placeholder.svg",
    status: "verifikasi",
  },
  {
    name: "",
    role: "Bhabinkamtibmas",
    unit: "Mitra Keamanan",
    photo: "/images/pemerintahan/placeholder.svg",
    status: "verifikasi",
  },
  {
    name: "",
    role: "Babinsa",
    unit: "Mitra Kewilayahan",
    photo: "/images/pemerintahan/placeholder.svg",
    status: "verifikasi",
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
        <h3>{person.name || "Belum terisi"}</h3>
        <strong>{person.role}</strong>
      </div>
    </article>
  );
}


function inferGovernmentUnit(person: Person) {
  const text = `${person.unit} ${person.role}`.toLowerCase();

  if (/sekretaris|sekretariat/.test(text)) return "Sekretariat";
  if (/pemerintahan/.test(text)) return "Seksi Pemerintahan";
  if (/sosial/.test(text)) return "Seksi Sosial";
  if (/pembangunan/.test(text)) return "Seksi Pembangunan";

  if (person.unit && !/^(kelurahan|staf|pimpinan kelurahan)$/i.test(person.unit)) {
    return person.unit;
  }

  return "Staf Kelurahan";
}

const structureUnitDefinitions = [
  {
    key: "Sekretariat",
    label: "Sekretariat",
    shortLabel: "Administrasi & koordinasi",
  },
  {
    key: "Seksi Pemerintahan",
    label: "Seksi Pemerintahan",
    shortLabel: "Administrasi pemerintahan",
  },
  {
    key: "Seksi Sosial",
    label: "Seksi Sosial",
    shortLabel: "Pelayanan sosial masyarakat",
  },
  {
    key: "Seksi Pembangunan",
    label: "Seksi Pembangunan",
    shortLabel: "Pembangunan & pemberdayaan",
  },
];

export default function GovernmentPage() {
  const { data: rawOfficials } = useCollectionData<Official>("officials", []);
  const { data: rawRts } = useCollectionData<RegionLeader>("rts", []);
  const { settings } = usePublicSettings();

  const activeOfficials = useMemo(
    () => rawOfficials.filter((item) => item.isActive !== false),
    [rawOfficials],
  );

  const officialById = useMemo(
    () => new Map(rawOfficials.filter((item) => item.id).map((item) => [String(item.id), item])),
    [rawOfficials],
  );

  const people = useMemo<Person[]>(
    () =>
      activeOfficials.map((item) => {
        const parent = item.parentId ? officialById.get(item.parentId) : undefined;
        const resolvedUnit = item.unit?.trim() ||
          (item.category === "Staf" ? parent?.unit || parent?.category : item.category) ||
          "Kelurahan";

        return {
          name: item.name || "",
          role: item.title || "Jabatan belum diisi",
          unit: resolvedUnit,
          category: item.category || "Kelurahan",
          parentId: item.parentId,
          photo: item.photoUrl || "/images/pemerintahan/placeholder.svg",
          description: item.description,
          status: item.name?.trim() ? "aktif" : "kosong",
        };
      }),
    [activeOfficials, officialById],
  );

  const institutionCategories = new Set([
    "LPM",
    "TP PKK",
    "Karang Taruna",
    "Adat",
    "Linmas",
    "Bhabinkamtibmas",
    "Babinsa",
    "Mitra",
    "Lainnya",
  ]);

  const communityInstitutions = useMemo(() => {
    const items = people.filter((person) => institutionCategories.has(person.category || person.unit));
    if (!items.length) return fallbackCommunityInstitutions;

    const used = new Set<number>();
    const patterns = [
      /\blpm\b/i,
      /\bpkk\b/i,
      /karang taruna/i,
      /adat/i,
      /linmas/i,
      /bhabinkamtibmas/i,
      /babinsa/i,
    ];

    const completed = fallbackCommunityInstitutions.map((fallback, slotIndex) => {
      const pattern = patterns[slotIndex];
      const matchIndex = items.findIndex((person, index) => {
        if (used.has(index)) return false;
        return pattern.test(`${person.unit} ${person.role}`);
      });

      if (matchIndex >= 0) {
        used.add(matchIndex);
        return items[matchIndex];
      }

      return fallback;
    });

    return [
      ...completed,
      ...items.filter((_, index) => !used.has(index)),
    ];
  }, [people]);

  const staff = useMemo(() => {
    const items = people.filter((person) => {
      if (person.category === "Staf" || person.unit === "Staf") return true;
      return /pengadministrasi|pengolah data|pengelola umum|pelaksana|staf/i.test(
        person.role,
      );
    });
    return items;
  }, [people]);

  const structuralOfficials = useMemo(() => {
    const items = people.filter(
      (person) =>
        !institutionCategories.has(person.category || person.unit) &&
        person.category !== "Staf" &&
        !/pengadministrasi|pengolah data|pengelola umum|pelaksana|staf/i.test(
          person.role,
        ),
    );

    if (!items.length) return fallbackStructuralOfficials;

    const slotPatterns = [
      (person: Person) =>
        person.category === "Pimpinan Kelurahan" ||
        (/^lurah\b/i.test(person.role) && !/sekretaris/i.test(person.role)),
      (person: Person) =>
        person.category === "Sekretariat" || /sekretaris/i.test(person.role),
      (person: Person) =>
        person.category === "Seksi Pemerintahan" ||
        /kepala seksi.*pemerintahan|kasi.*pemerintahan/i.test(person.role),
      (person: Person) =>
        person.category === "Seksi Sosial" ||
        /kepala seksi.*sosial|kasi.*sosial/i.test(person.role),
      (person: Person) =>
        person.category === "Seksi Pembangunan" ||
        /kepala seksi.*pembangunan|kasi.*pembangunan/i.test(person.role),
    ];

    const used = new Set<number>();
    const completed = fallbackStructuralOfficials.map((fallback, slotIndex) => {
      const matchIndex = items.findIndex(
        (person, index) => !used.has(index) && slotPatterns[slotIndex](person),
      );

      if (matchIndex >= 0) {
        used.add(matchIndex);
        return items[matchIndex];
      }

      return {
        ...fallback,
        name: "",
        photo: "/images/pemerintahan/placeholder.svg",
        status: "kosong" as const,
      };
    });

    return [
      ...completed,
      ...items.filter((_, index) => !used.has(index)),
    ];
  }, [people]);

  const rtList = useMemo<Person[]>(
    () =>
      rawRts
        .filter((item) => {
          if (item.isActive === false) return false;
          const numeric = Number(String(item.number || "").replace(/\D/g, ""));
          return Number.isInteger(numeric) && numeric >= 1;
        })
        .map((item): Person => {
          const numeric = Number(String(item.number || "").replace(/\D/g, ""));
          const number = String(numeric).padStart(2, "0");
          return {
            name: item.chairmanName || "",
            role: `Ketua RT ${number}`,
            unit: item.area || `Kelurahan ${settings.villageName}`,
            photo: item.photoUrl || "/images/pemerintahan/placeholder.svg",
            description: item.description,
            status: item.chairmanName?.trim() ? "aktif" : "verifikasi",
          };
        })
        .sort((a, b) => {
          const aNumber = Number(a.role.replace(/\D/g, ""));
          const bNumber = Number(b.role.replace(/\D/g, ""));
          return aNumber - bNumber;
        }),
    [rawRts, settings.villageName],
  );

  const rtRangeLabel = useMemo(
    () => (rtList.length ? `Ketua RT (${rtList.length} RT aktif)` : "Data Ketua RT"),
    [rtList.length],
  );

  const coordinationSteps = useMemo(
    () => [
      { number: "01", title: "Lurah", subtitle: "Pimpinan" },
      { number: "02", title: "Perangkat", subtitle: "Pelayanan" },
      { number: "03", title: "Lembaga", subtitle: "Kemitraan" },
      {
        number: "04",
        title: rtList.length ? `${rtList.length} RT` : "Data RT",
        subtitle: "Kewilayahan",
      },
    ],
    [rtList.length],
  );

  const leader = structuralOfficials[0] ?? fallbackStructuralOfficials[0];
  const institutionLabels = Array.from(
    new Set(communityInstitutions.map((item) => item.unit).filter(Boolean)),
  ).slice(0, 8);

  const structureUnits = useMemo(() => {
    const officialsWithoutLeader = structuralOfficials.filter(
      (person) => person !== leader && !(/^lurah\b/i.test(person.role) && !/sekretaris/i.test(person.role)),
    );

    const assignedOfficialRoles = new Set<string>();
    const assignedStaffKeys = new Set<string>();

    const units = structureUnitDefinitions.map((definition) => {
      const head = officialsWithoutLeader.find(
        (person) => inferGovernmentUnit(person) === definition.key,
      );

      if (head) assignedOfficialRoles.add(`${head.name}|${head.role}`);

      const members = staff.filter((person) => {
        const match = inferGovernmentUnit(person) === definition.key;
        if (match) assignedStaffKeys.add(`${person.name}|${person.role}`);
        return match;
      });

      return { ...definition, head, members };
    });

    const extraOfficials = officialsWithoutLeader.filter(
      (person) => !assignedOfficialRoles.has(`${person.name}|${person.role}`),
    );
    const extraStaff = staff.filter(
      (person) => !assignedStaffKeys.has(`${person.name}|${person.role}`),
    );

    if (extraOfficials.length || extraStaff.length) {
      units.push({
        key: "Staf Kelurahan",
        label: "Unit / Staf Lainnya",
        shortLabel: "Aparatur pendukung kelurahan",
        head: extraOfficials[0],
        members: [...extraOfficials.slice(1), ...extraStaff],
      });
    }

    return units;
  }, [leader, staff, structuralOfficials]);

  const filledGovernmentCount = people.filter(
    (person) => !institutionCategories.has(person.category || person.unit),
  ).length;
  const filledRtCount = rawRts.filter(
    (item) => item.isActive !== false && Boolean(item.chairmanName?.trim()),
  ).length;
  const filledInstitutionCount = people.filter((person) =>
    institutionCategories.has(person.category || person.unit),
  ).length;

  return (
    <PublicShell>
      <main className={styles.page}>
        {/* HERO - CIRI KHAS PEMERINTAHAN */}
        <section className={styles.hero}>
          <div className={styles.heroGridTexture} aria-hidden="true" />

          <div className={`container ${styles.heroLayout}`}>
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.heroCopy}>
                <div className={styles.govSeal}>
                  <GovernmentIcon />
                  <span>Struktur Pemerintahan {new Date().getFullYear()}</span>
                </div>

                <h1>
                  Pemerintahan
                  <strong>{settings.villageName}</strong>
                </h1>

                <p>
                  Struktur aparatur, lembaga kemasyarakatan, mitra kewilayahan,
                  lembaga adat, serta data Ketua RT dalam satu halaman resmi.
                </p>

                <div className={styles.heroStats}>
                  <div><strong>{String(filledGovernmentCount).padStart(2, "0")}</strong><span>Aparatur terisi</span></div>
                  <div><strong>{String(filledRtCount).padStart(2, "0")}</strong><span>Ketua RT terisi</span></div>
                  <div><strong>{String(filledInstitutionCount).padStart(2, "0")}</strong><span>Lembaga terisi</span></div>
                </div>
              </div>
            </Reveal>

            <Reveal enabled={settings.animationEnabled} delay={70}>
              <div className={styles.commandPanel}>
                <div className={styles.commandGlow} aria-hidden="true" />
                <div className={styles.commandOrbit} aria-hidden="true" />

                <div className={styles.commandTop}>
                  <div className={styles.commandIcon}>
                    <span className={styles.commandIconPulse} aria-hidden="true" />
                    <NetworkIcon />
                  </div>

                  <div className={styles.commandTitleWrap}>
                    <span>Struktur Koordinasi</span>
                    <strong>Kelurahan → Lembaga → RT → Warga</strong>
                  </div>

                  <div className={styles.commandStatus}>
                    <i />
                    Aktif
                  </div>
                </div>

                <div className={styles.commandRoute}>
                  <div className={styles.commandRouteLine} aria-hidden="true">
                    <span />
                  </div>

                  {coordinationSteps.map((step, index) => (
                    <div
                      key={step.number}
                      className={styles.commandStep}
                      style={{ animationDelay: `${index * 120}ms` }}
                    >
                      <div className={styles.commandNode}>
                        <span>{step.number}</span>
                      </div>
                      <strong>{step.title}</strong>
                      <small>{step.subtitle}</small>
                    </div>
                  ))}
                </div>

                <div className={styles.commandFooter}>
                  <a href="#struktur" className={styles.commandLink}>
                    Lihat Struktur Lengkap
                    <ArrowIcon size={16} />
                  </a>

                  <div className={styles.commandMiniInfo}>
                    <span />
                    Koordinasi sampai tingkat warga
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* NAV */}
        <section className={styles.navSection}>
          <div className="container">
            <nav className={styles.sectionNav}>
              <a href="#struktur">Struktur Pemerintahan</a>
              <a href="#lembaga">Lembaga & Mitra</a>
              <a href="#rt">{rtRangeLabel}</a>
            </nav>
          </div>
        </section>

        {/* STRUKTUR PEMERINTAHAN LENGKAP */}
        <section id="struktur" className={styles.fullStructureSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.fullStructureHeading}>
                <div>
                  <span>01</span>
                  <small>Bagan Organisasi Kelurahan</small>
                  <h2>Struktur Pemerintahan Lengkap</h2>
                  <p>
                    Susunan aparatur ditampilkan dari Lurah, pejabat struktural,
                    sampai staf pada masing-masing unit pelayanan.
                  </p>
                </div>
                <div className={styles.structureCountBox}>
                  <strong>{filledGovernmentCount}</strong>
                  <span>Aparatur terisi</span>
                </div>
              </div>
            </Reveal>

            <div className={styles.orgChart}>
              <Reveal enabled={settings.animationEnabled} delay={40}>
                <article className={styles.orgLeaderCard}>
                  <div className={styles.orgLeaderPhoto}>
                    <Photo src={leader.photo} alt={`Foto ${leader.role}`} />
                  </div>
                  <div className={styles.orgLeaderInfo}>
                    <span>Pimpinan Kelurahan</span>
                    <h3>{leader.name || "Belum terisi"}</h3>
                    <strong>{leader.role}</strong>
                    <p>
                      {leader.description ||
                        `Memimpin penyelenggaraan pemerintahan, pelayanan publik, pembangunan, dan pembinaan kemasyarakatan di Kelurahan ${settings.villageName}.`}
                    </p>
                  </div>
                </article>
              </Reveal>

              <div className={styles.orgConnector} aria-hidden="true">
                <span />
              </div>

              <div className={styles.orgUnitGrid}>
                {structureUnits.map((unit, index) => (
                  <Reveal key={unit.key} enabled delay={(index % 4) * 45}>
                    <article className={styles.orgUnitCard}>
                      <header className={styles.orgUnitHeader}>
                        <div>
                          <span>{String(index + 2).padStart(2, "0")}</span>
                          <div>
                            <h3>{unit.label}</h3>
                            <p>{unit.shortLabel}</p>
                          </div>
                        </div>
                        <strong>{unit.members.length + (unit.head ? 1 : 0)}</strong>
                      </header>

                      {unit.head ? (
                        <div className={styles.orgHeadPerson}>
                          <div className={styles.orgHeadPhoto}>
                            <Photo src={unit.head.photo} alt={`Foto ${unit.head.role}`} />
                          </div>
                          <div>
                            <small>Penanggung Jawab</small>
                            <h4>{unit.head.name}</h4>
                            <span>{unit.head.role}</span>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.orgVacantHead}>
                          <span>Jabatan struktural belum terdata</span>
                        </div>
                      )}

                      <div className={styles.orgStaffBlock}>
                        <div className={styles.orgStaffTitle}>
                          <span>Staf / Pelaksana</span>
                          <strong>{unit.members.length}</strong>
                        </div>

                        {unit.members.length ? (
                          <div className={styles.orgStaffList}>
                            {unit.members.map((person) => (
                              <div className={styles.orgStaffItem} key={`${unit.key}-${person.name}-${person.role}`}>
                                <div className={styles.orgStaffAvatar}>
                                  <Photo src={person.photo} alt={`Foto ${person.name}`} />
                                </div>
                                <div>
                                  <strong>{person.name || "Belum terisi"}</strong>
                                  <span>{person.role}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className={styles.orgEmptyText}>Belum ada staf yang terdata pada unit ini.</p>
                        )}
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.structureAdminNote}>
                <div>
                  <span>Data dinamis</span>
                  <strong>Nama, jabatan, foto, dan unit dapat diperbarui melalui menu Pemerintahan di dashboard admin.</strong>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* LEMBAGA */}
        <section id="lembaga" className={styles.institutionSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.institutionHeading}>
                <div>
                  <span>02</span>
                  <small>Lembaga & Mitra Kelurahan</small>
                  <h2>Unsur masyarakat yang bekerja bersama pemerintah</h2>
                </div>

                <p>
                  Nama dan foto pada bagian ini harus mengikuti SK atau daftar
                  resmi Kelurahan {settings.villageName} agar tidak salah menampilkan
                  pengurus.
                </p>
              </div>
            </Reveal>

            <div className={styles.institutionChips}>
              {institutionLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
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
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.rtHeading}>
                <div>
                  <span>03</span>
                  <small>Struktur Kewilayahan</small>
                  <h2>{rtRangeLabel}</h2>
                </div>

                <div className={styles.rtCount}>
                  <small>Struktur Wilayah</small>
                  <strong>{rtList.length}</strong>
                  <span>RT Kelurahan {settings.villageName}</span>
                </div>
              </div>
            </Reveal>

            <div className={styles.rtMetaStrip}>
              <div><span>Jumlah</span><strong>{rtList.length} RT</strong></div>
              <div><span>Status</span><strong>Data terhubung dengan dashboard RT</strong></div>
              <div><span>Wilayah</span><strong>{settings.villageName}</strong></div>
            </div>

            {rtList.length ? (
              <div className={styles.rtGrid}>
                {rtList.map((person, index) => (
                  <Reveal key={person.role} enabled delay={(index % 6) * 32}>
                    <PersonCard person={person} compact />
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className={styles.orgEmptyText}>
                Belum ada data RT aktif. Tambahkan data melalui menu Data RT di dashboard admin.
              </p>
            )}

            <Reveal enabled={settings.animationEnabled}>
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
            <Reveal enabled={settings.animationEnabled}>
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
