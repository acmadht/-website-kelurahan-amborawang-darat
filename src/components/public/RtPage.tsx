"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useCollectionData } from "@/hooks/useFirestoreData";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import { AMBORAWANG_RT_TOTAL } from "@/data/amborawang";
import { buildAmborawangRtSlots } from "@/lib/rtSlots";
import type { RegionLeader, SiteSettings } from "@/types";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./RtPage.module.css";

function displayNumber(value?: number) {
  if (!value || value <= 0) return "Belum diisi";
  return new Intl.NumberFormat("id-ID").format(value);
}

function displayCount(value?: number) {
  const numeric = Number(value) || 0;
  return new Intl.NumberFormat("id-ID").format(Math.max(0, numeric));
}

function normalizePhone(value?: string) {
  if (!value) return "";
  return value.replace(/[^\d+]/g, "");
}

function formatUpdatedAt(value: unknown) {
  if (!value) return "Belum tersedia";

  try {
    let date: Date | null = null;

    if (value instanceof Date) {
      date = value;
    } else if (typeof value === "string" || typeof value === "number") {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) date = parsed;
    } else if (typeof value === "object" && value !== null) {
      const candidate = value as {
        toDate?: () => Date;
        seconds?: number;
      };

      if (typeof candidate.toDate === "function") {
        date = candidate.toDate();
      } else if (typeof candidate.seconds === "number") {
        date = new Date(candidate.seconds * 1000);
      }
    }

    if (!date || Number.isNaN(date.getTime())) return "Belum tersedia";

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return "Belum tersedia";
  }
}

function UserIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function FamilyIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function MaleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="14" r="5" />
      <path d="m14 10 6-6" />
      <path d="M15 4h5v5" />
    </svg>
  );
}

function FemaleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="5" />
      <path d="M12 13v8" />
      <path d="M9 18h6" />
    </svg>
  );
}

function PhoneIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function MapIcon({ size = 21 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </svg>
  );
}

function RtIcon({ size = 23 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21h18" />
      <path d="M5 21V8l7-5 7 5v13" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
    </svg>
  );
}

function HomeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function BabyIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
      <path d="M9.5 15a4 4 0 0 0 5 0" />
      <path d="M12 4c-1.5-1.7-4.2-.8-4 1.5" />
    </svg>
  );
}

function ElderlyIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="2" />
      <path d="M11 7.5 9 13l3 2 2-4 2 3" />
      <path d="m9 13-2 7" />
      <path d="m12 15 2 5" />
      <path d="M17 14v7" />
    </svg>
  );
}

function FacilityIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 21V8l8-5 8 5v13" />
      <path d="M9 21v-6h6v6" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  );
}

function CalendarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function ArrowIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function InitialAvatar({ name, number }: { name: string; number: string }) {
  const initials = name
    ? name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : `RT${number}`;

  return <span className={styles.avatarFallback}>{initials}</span>;
}

function StatBox({
  icon,
  label,
  value,
  suffix,
}: {
  icon: ReactNode;
  label: string;
  value?: number;
  suffix?: string;
}) {
  return (
    <div className={styles.modalStatBox}>
      <span className={styles.modalStatIcon}>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{displayNumber(value)}</strong>
        {value && value > 0 && suffix ? <span>{suffix}</span> : null}
      </div>
    </div>
  );
}

export default function RtPage({ initialRts = [], initialSettings, initialSelectedRt = "" }: { initialRts?: RegionLeader[]; initialSettings?: SiteSettings; initialSelectedRt?: string }) {
  const { data: rawRts, loading } = useCollectionData<RegionLeader>(
    "rts",
    initialRts,
  );
  const { settings } = usePublicSettings(initialSettings);
  const [selectedRt, setSelectedRt] = useState<RegionLeader | null>(null);
  const queryOpenedRef = useRef(false);

  const rts = useMemo(
    () => buildAmborawangRtSlots(rawRts),
    [rawRts],
  );

  useEffect(() => {
    if (queryOpenedRef.current) return;
    const requested = String(initialSelectedRt ?? "").replace(/\D/g, "").padStart(2, "0");
    if (!requested || requested === "00") return;
    const match = rts.find((item) => item.number === requested);
    if (!match) return;
    queryOpenedRef.current = true;
    setSelectedRt(match);
  }, [rts, initialSelectedRt]);

  const totals = useMemo(() => {
    const population = rts.reduce(
      (sum, rt) => sum + (Number(rt.populationCount) || 0),
      0,
    );
    const families = rts.reduce(
      (sum, rt) => sum + (Number(rt.familyCount) || 0),
      0,
    );

    return {
      population,
      families,
      rt: AMBORAWANG_RT_TOTAL,
    };
  }, [rts]);

  const rtRangeLabel = `${totals.rt} RT`;

  useEffect(() => {
    if (!selectedRt) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedRt(null);
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedRt]);

  return (
    <PublicShell>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGridPattern} aria-hidden="true" />
          <div className={styles.heroOrb} aria-hidden="true" />

          <div className={`container ${styles.heroInner}`}>
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.heroCopy}>
                <span className={styles.heroBadge}>
                  <RtIcon />
                  Data Rukun Tetangga
                </span>

                <h1>
                  {totals.rt ? `Data ${totals.rt} RT` : "Data RT"}
                  <strong>{settings.villageName}</strong>
                </h1>

                <p>
                  Informasi publik setiap RT meliputi ketua RT, jumlah warga,
                  kepala keluarga, komposisi penduduk, fasilitas, UMKM, bansos,
                  inventaris, mutasi, dan gambaran wilayah yang saling terhubung.
                </p>

                <div className={styles.heroStatus}>
                  <span className={styles.statusDot} />
                  <span>Data terhubung dengan administrasi kelurahan</span>
                </div>
              </div>
            </Reveal>

            <Reveal enabled={settings.animationEnabled} delay={70}>
              <div className={styles.heroSummary}>
                <div className={styles.summaryTop}>
                  <span>Ringkasan Wilayah RT</span>
                  <strong>Kelurahan {settings.villageName}</strong>
                </div>

                <div className={styles.summaryGrid}>
                  <div>
                    <span className={styles.summaryIcon}>
                      <RtIcon size={20} />
                    </span>
                    <strong>{totals.rt}</strong>
                    <small>RT</small>
                  </div>
                  <div>
                    <span className={styles.summaryIcon}>
                      <UserIcon />
                    </span>
                    <strong>
                      {new Intl.NumberFormat("id-ID").format(totals.population)}
                    </strong>
                    <small>Warga</small>
                  </div>
                  <div>
                    <span className={styles.summaryIcon}>
                      <FamilyIcon />
                    </span>
                    <strong>
                      {new Intl.NumberFormat("id-ID").format(totals.families)}
                    </strong>
                    <small>KK</small>
                  </div>
                </div>

                <p>
                  Kelurahan memiliki 13 RT. Data warga dan KK mengikuti data
                  yang telah diisi melalui dashboard admin.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.introSection}>
          <div className={`container ${styles.introGrid}`}>
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.introLabel}>
                <span>01</span>
                <small>Data Publik RT</small>
              </div>
            </Reveal>

            <Reveal enabled={settings.animationEnabled} delay={50}>
              <div className={styles.introCopy}>
                <h2>Informasi setiap lingkungan RT dalam satu halaman</h2>
                <p>
                  Kartu utama menampilkan data yang paling sering dibutuhkan
                  warga. Informasi tambahan seperti jumlah rumah, balita,
                  lansia, fasilitas, area RT, dan tanggal pembaruan dapat dibuka
                  melalui tombol detail.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.rtSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.eyebrow}>Daftar RT</span>
                  <h2>{rtRangeLabel}</h2>
                </div>
                <p>
                  Data yang ditampilkan bersifat ringkasan wilayah. Informasi
                  pribadi warga tidak ditampilkan pada halaman publik.
                </p>
              </div>
            </Reveal>

            {loading ? (
              <div className={styles.loadingBox}>Memuat data RT...</div>
            ) : rts.length === 0 ? (
              <div className={styles.loadingBox}>
                Belum ada data RT aktif. Tambahkan data melalui menu Data RT di dashboard admin.
              </div>
            ) : (
              <div className={styles.rtGrid}>
                {rts.map((rt, index) => {
                  const phone = normalizePhone(rt.phone);
                  const hasPhoto = Boolean(rt.photoUrl && rt.photoUrl.trim());

                  return (
                    <Reveal
                      key={rt.id || rt.number}
                      enabled
                      delay={(index % 4) * 45}
                    >
                      <article className={styles.rtCard}>
                        <div className={styles.cardAccent} aria-hidden="true" />

                        <div className={styles.cardHeader}>
                          <div className={styles.rtNumber}>
                            <small>RT</small>
                            <strong>{rt.number}</strong>
                          </div>

                          <span className={`${styles.activeBadge} ${!rt.chairmanName?.trim() ? styles.pendingBadge : ""}`}>
                            <i /> {rt.chairmanName?.trim() ? "Aktif" : "Belum diisi"}
                          </span>
                        </div>

                        <div className={styles.chairmanBlock}>
                          <div className={styles.avatarWrap}>
                            {hasPhoto ? (
                              <img
                                src={rt.photoUrl}
                                alt={`Foto Ketua RT ${rt.number}`}
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <InitialAvatar
                                name={rt.chairmanName}
                                number={rt.number}
                              />
                            )}
                          </div>

                          <div className={styles.chairmanText}>
                            <small>Ketua RT {rt.number}</small>
                            <h3>
                              {rt.chairmanName || "Nama ketua belum diisi"}
                            </h3>
                          </div>
                        </div>

                        <div className={styles.dataGrid}>
                          <div className={styles.dataItem}>
                            <span className={styles.dataIcon}>
                              <UserIcon size={18} />
                            </span>
                            <div>
                              <small>Jumlah Warga</small>
                              <strong>{displayNumber(rt.populationCount)}</strong>
                              {rt.populationCount ? <span>jiwa</span> : null}
                            </div>
                          </div>

                          <div className={styles.dataItem}>
                            <span className={styles.dataIcon}>
                              <FamilyIcon size={18} />
                            </span>
                            <div>
                              <small>Kepala Keluarga</small>
                              <strong>{displayNumber(rt.familyCount)}</strong>
                              {rt.familyCount ? <span>KK</span> : null}
                            </div>
                          </div>

                          <div className={styles.dataItem}>
                            <span className={styles.dataIcon}>
                              <MaleIcon />
                            </span>
                            <div>
                              <small>Laki-laki</small>
                              <strong>{displayNumber(rt.maleCount)}</strong>
                              {rt.maleCount ? <span>jiwa</span> : null}
                            </div>
                          </div>

                          <div className={styles.dataItem}>
                            <span className={styles.dataIcon}>
                              <FemaleIcon />
                            </span>
                            <div>
                              <small>Perempuan</small>
                              <strong>{displayNumber(rt.femaleCount)}</strong>
                              {rt.femaleCount ? <span>jiwa</span> : null}
                            </div>
                          </div>
                        </div>

                        <div className={styles.descriptionBlock}>
                          <span className={styles.descriptionLabel}>
                            <MapIcon size={17} />
                            Area RT
                          </span>
                          <p>
                            {rt.area ||
                              rt.description ||
                              `RT ${rt.number}, Kelurahan ${settings.villageName}, Kecamatan ${settings.subdistrictName || "Samboja Barat"}.`}
                          </p>
                        </div>

                        <div className={styles.cardActions}>
                          <button
                            type="button"
                            className={styles.detailButton}
                            onClick={() => setSelectedRt(rt)}
                          >
                            Lihat Detail RT
                            <ArrowIcon />
                          </button>

                          {phone ? (
                            <a
                              href={`tel:${phone}`}
                              className={styles.contactButton}
                            >
                              <PhoneIcon size={15} />
                              Hubungi
                            </a>
                          ) : (
                            <span className={styles.contactButtonDisabled}>
                              Kontak belum tersedia
                            </span>
                          )}
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className={styles.infoSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.infoPanel}>
                <div className={styles.infoIcon}>
                  <RtIcon />
                </div>
                <div>
                  <span>Pembaruan Data</span>
                  <h2>Data RT dikelola melalui dashboard admin</h2>
                  <p>
                    Data ketua RT, area, rumah, kontak, dan keterangan wilayah dikelola pada Data RT.
                    Demografi berasal dari Penduduk/KK, fasilitas berasal dari menu Fasilitas, dan jumlah UMKM, bansos, inventaris, mutasi, surat, serta pengaduan dihitung otomatis menurut RT.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.relatedSection}>
          <div className="container">
            <div className={styles.relatedHeading}>
              <span>Data terkait</span>
              <h2>RT menjadi penghubung data wilayah dan administrasi</h2>
              <p>Gunakan halaman berikut untuk melihat statistik agregat yang menjadi konteks data masing-masing RT.</p>
            </div>
            <div className={styles.relatedGrid}>
              <Link href="/penduduk" className={styles.relatedCard}><strong>Penduduk</strong><span>Sebaran warga aktif, pendidikan, dan pekerjaan.</span><small>Buka →</small></Link>
              <Link href="/keluarga" className={styles.relatedCard}><strong>Keluarga / KK</strong><span>Jumlah keluarga dan sebaran KK menurut RT.</span><small>Buka →</small></Link>
              <Link href="/fasilitas" className={styles.relatedCard}><strong>Fasilitas</strong><span>Sarana prasarana publik pada wilayah kelurahan.</span><small>Buka →</small></Link>
              <Link href="/data-publik" className={styles.relatedCard}><strong>Data Publik</strong><span>Portal seluruh statistik agregat kelurahan.</span><small>Buka →</small></Link>
            </div>
          </div>
        </section>

        {selectedRt ? (
          <div
            className={styles.modalOverlay}
            role="presentation"
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setSelectedRt(null);
            }}
          >
            <section
              className={styles.detailModal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="rt-detail-title"
            >
              <div className={styles.modalHeader}>
                <div>
                  <span className={styles.modalEyebrow}>
                    Detail Wilayah RT {selectedRt.number}
                  </span>
                  <h2 id="rt-detail-title">
                    {selectedRt.chairmanName || `RT ${selectedRt.number}`}
                  </h2>
                  <p>Ketua RT {selectedRt.number} • {settings.villageName}</p>
                </div>

                <button
                  type="button"
                  className={styles.modalClose}
                  onClick={() => setSelectedRt(null)}
                  aria-label="Tutup detail RT"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.modalLeaderCard}>
                  <div className={styles.modalAvatar}>
                    {selectedRt.photoUrl ? (
                      <img
                        src={selectedRt.photoUrl}
                        alt={`Foto Ketua RT ${selectedRt.number}`}
                      />
                    ) : (
                      <InitialAvatar
                        name={selectedRt.chairmanName}
                        number={selectedRt.number}
                      />
                    )}
                  </div>

                  <div>
                    <small>Ketua RT {selectedRt.number}</small>
                    <strong>
                      {selectedRt.chairmanName || "Nama ketua belum diisi"}
                    </strong>
                    <span>
                      {selectedRt.area || "Area RT belum dilengkapi"}
                    </span>
                  </div>
                </div>

                <div className={styles.modalStatsGrid}>
                  <StatBox
                    icon={<UserIcon size={18} />}
                    label="Jumlah Warga"
                    value={selectedRt.populationCount}
                    suffix="jiwa"
                  />
                  <StatBox
                    icon={<FamilyIcon size={18} />}
                    label="Kepala Keluarga"
                    value={selectedRt.familyCount}
                    suffix="KK"
                  />
                  <StatBox
                    icon={<MaleIcon />}
                    label="Laki-laki"
                    value={selectedRt.maleCount}
                    suffix="jiwa"
                  />
                  <StatBox
                    icon={<FemaleIcon />}
                    label="Perempuan"
                    value={selectedRt.femaleCount}
                    suffix="jiwa"
                  />
                  <StatBox
                    icon={<HomeIcon />}
                    label="Jumlah Rumah"
                    value={selectedRt.houseCount}
                    suffix="rumah"
                  />
                  <StatBox
                    icon={<BabyIcon />}
                    label="Balita"
                    value={selectedRt.toddlerCount}
                    suffix="jiwa"
                  />
                  <StatBox
                    icon={<ElderlyIcon />}
                    label="Lansia"
                    value={selectedRt.elderlyCount}
                    suffix="jiwa"
                  />
                </div>

                <div className={styles.modalInfoGrid}>
                  <div className={styles.modalInfoCard}>
                    <div className={styles.modalInfoTitle}>
                      <MapIcon size={18} />
                      <span>Keterangan Wilayah</span>
                    </div>
                    <p>
                      {selectedRt.description ||
                        `RT ${selectedRt.number} merupakan bagian dari Kelurahan ${settings.villageName}, Kecamatan ${settings.subdistrictName || "Samboja Barat"}.`}
                    </p>
                  </div>

                  <div className={styles.modalInfoCard}>
                    <div className={styles.modalInfoTitle}>
                      <FacilityIcon />
                      <span>Fasilitas Utama</span>
                    </div>

                    {selectedRt.facilities && selectedRt.facilities.length > 0 ? (
                      <div className={styles.facilityList}>
                        {selectedRt.facilities.map((facility) => (
                          <span key={facility}>{facility}</span>
                        ))}
                      </div>
                    ) : (
                      <p>Data fasilitas belum diisi.</p>
                    )}
                  </div>
                </div>

                <section className={styles.modalLinkedSection}>
                  <div className={styles.modalLinkedTitle}>
                    <div>
                      <span>Data Terhubung</span>
                      <strong>Ringkasan modul yang memakai RT {selectedRt.number}</strong>
                    </div>
                    <small>Agregat aman tanpa identitas pribadi</small>
                  </div>
                  <div className={styles.modalLinkedGrid}>
                    <Link href={`/penduduk?rt=${selectedRt.number}`} className={styles.modalLinkedCard}>
                      <span>Penduduk</span><strong>{displayCount(selectedRt.populationCount)}</strong><small>jiwa aktif</small>
                    </Link>
                    <Link href={`/keluarga?rt=${selectedRt.number}`} className={styles.modalLinkedCard}>
                      <span>Keluarga / KK</span><strong>{displayCount(selectedRt.familyCount)}</strong><small>KK terhubung</small>
                    </Link>
                    <Link href={`/fasilitas?rt=${selectedRt.number}`} className={styles.modalLinkedCard}>
                      <span>Fasilitas</span><strong>{displayCount(selectedRt.facilityCount)}</strong><small>fasilitas publik</small>
                    </Link>
                    <Link href={`/umkm?rt=${selectedRt.number}`} className={styles.modalLinkedCard}>
                      <span>UMKM</span><strong>{displayCount(selectedRt.umkmCount)}</strong><small>usaha publik</small>
                    </Link>
                    <Link href={`/bansos?rt=${selectedRt.number}`} className={styles.modalLinkedCard}>
                      <span>Bansos</span><strong>{displayCount(selectedRt.socialAssistanceCount)}</strong><small>data bantuan</small>
                    </Link>
                    <Link href={`/inventaris?rt=${selectedRt.number}`} className={styles.modalLinkedCard}>
                      <span>Inventaris</span><strong>{displayCount(selectedRt.inventoryItemCount)}</strong><small>{displayCount(selectedRt.inventoryQuantity)} kuantitas</small>
                    </Link>
                    <Link href={`/mutasi?rt=${selectedRt.number}`} className={styles.modalLinkedCard}>
                      <span>Mutasi</span><strong>{displayCount(selectedRt.mutationCount)}</strong><small>catatan terkait</small>
                    </Link>
                  </div>
                </section>

                <div className={styles.modalFooter}>
                  <div className={styles.updatedInfo}>
                    <CalendarIcon size={17} />
                    <div>
                      <small>Terakhir diperbarui</small>
                      <strong>{formatUpdatedAt(selectedRt.updatedAt)}</strong>
                    </div>
                  </div>

                  {normalizePhone(selectedRt.phone) ? (
                    <a
                      className={styles.modalContactButton}
                      href={`tel:${normalizePhone(selectedRt.phone)}`}
                    >
                      <PhoneIcon size={16} />
                      Hubungi Ketua RT
                    </a>
                  ) : (
                    <span className={styles.modalContactDisabled}>
                      Kontak belum tersedia
                    </span>
                  )}
                </div>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </PublicShell>
  );
}
