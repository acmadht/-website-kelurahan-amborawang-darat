"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AMBORAWANG_OFFICE_IMAGE,
  applyAmborawangPublicSettings,
} from "@/data/amborawang";
import {
  amborawangProfileFallback,
  developmentPriorities,
  profileBoundaries,
  profileFacts,
  profilePotentials,
  profileTimeline,
  resolveAmborawangProfile,
  type ProfileContent,
} from "@/data/amborawangProfile";
import { demoSettings } from "@/data/demo";
import { useDocumentData } from "@/hooks/useFirestoreData";
import type { SiteSettings } from "@/types";
import PageHero from "./PageHero";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./ProfilePage.module.css";

type IconName =
  | "area"
  | "people"
  | "home"
  | "route"
  | "history"
  | "vision"
  | "mission"
  | "map"
  | "shield"
  | "plant"
  | "store"
  | "education"
  | "connect"
  | "building"
  | "check"
  | "arrow";

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
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

  const paths: Record<IconName, React.ReactNode> = {
    area: <><path d="M4 19V8l8-4 8 4v11" /><path d="M8 19v-6h8v6" /><path d="M3 19h18" /></>,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.5-4 2.5-6 5.5-6s5 2 5.5 6" /><path d="M15 6.5a2.5 2.5 0 0 1 0 5" /><path d="M16 13c2.6.5 4 2.5 4.5 5" /></>,
    home: <><path d="m3 11 9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></>,
    route: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M7.5 16.5 16.5 7.5" /><path d="M8 6h4l2 2" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 7v5l3 2" /></>,
    vision: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    mission: <><path d="M9 6h11" /><path d="M9 12h11" /><path d="M9 18h11" /><path d="m3.5 6 1.2 1.2L7 4.8" /><path d="m3.5 12 1.2 1.2L7 10.8" /><path d="m3.5 18 1.2 1.2L7 16.8" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" /><path d="M9 3v15" /><path d="M15 6v15" /></>,
    shield: <><path d="M12 3 5 6v5c0 4.8 2.8 8 7 10 4.2-2 7-5.2 7-10V6Z" /><path d="m9 12 2 2 4-4" /></>,
    plant: <><path d="M12 21V10" /><path d="M12 13c-4 0-7-2.4-7-6 4 0 7 2.4 7 6Z" /><path d="M12 10c0-4 2.4-7 6-7 0 4-2.4 7-6 7Z" /></>,
    store: <><path d="M4 10v10h16V10" /><path d="M3 10h18l-2-6H5Z" /><path d="M8 20v-6h8v6" /><path d="M5 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0" /></>,
    education: <><path d="m3 9 9-5 9 5-9 5Z" /><path d="M7 12v4c3 2 7 2 10 0v-4" /><path d="M21 9v6" /></>,
    connect: <><circle cx="5" cy="12" r="2.5" /><circle cx="19" cy="6" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="m7.5 11 9-4" /><path d="m7.5 13 9 4" /></>,
    building: <><path d="M4 21V5l8-3 8 3v16" /><path d="M8 8h2" /><path d="M14 8h2" /><path d="M8 12h2" /><path d="M14 12h2" /><path d="M9 21v-5h6v5" /><path d="M2 21h20" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function splitParagraphs(value: string) {
  return value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export default function ProfilePage() {
  const { data: storedProfile } = useDocumentData<ProfileContent>(
    "pages",
    "profil",
    amborawangProfileFallback,
  );
  const { data: rawSettings } = useDocumentData<SiteSettings>(
    "siteSettings",
    "main",
    demoSettings,
  );
  const settings = applyAmborawangPublicSettings(rawSettings);
  const data = resolveAmborawangProfile(storedProfile);
  const [officeImage, setOfficeImage] = useState(data.imageUrl);

  useEffect(() => {
    setOfficeImage(data.imageUrl);
  }, [data.imageUrl]);

  const animationEnabled = settings.animationEnabled !== false;

  return (
    <PublicShell>
      <PageHero
        eyebrow="Profil Kelurahan"
        title={`Mengenal ${settings.villageName}`}
        description="Sejarah, arah pelayanan, kondisi wilayah, batas administratif, potensi, dan fasilitas umum dalam satu halaman yang lebih informatif."
      />

      <section className={styles.introSection}>
        <div className={`container ${styles.introGrid}`}>
          <Reveal enabled={animationEnabled}>
            <figure className={styles.officeFigure}>
              <img
                src={officeImage}
                alt="Kantor Kelurahan Amborawang Darat"
                onError={() => setOfficeImage(AMBORAWANG_OFFICE_IMAGE)}
              />
              <div className={styles.officeShade} />
              <figcaption className={styles.officeCaption}>
                <span className={styles.captionIcon}><Icon name="building" /></span>
                <span>
                  <strong>Kantor Kelurahan Amborawang Darat</strong>
                  <small>Dokumentasi bangunan kantor, 19 September 2015</small>
                </span>
              </figcaption>
              <span className={styles.photoCredit}>Foto: Arief R. Sandan (Ezagren)</span>
            </figure>
          </Reveal>

          <Reveal enabled={animationEnabled} delay={90}>
            <div className={styles.historyPanel}>
              <span className="eyebrow">Sejarah Kelurahan</span>
              <h2>Dari wilayah Samboja menuju pelayanan Samboja Barat</h2>
              <div className={styles.historyCopy}>
                {splitParagraphs(data.history).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className={styles.legalNote}>
                <span><Icon name="shield" /></span>
                <p>
                  Amborawang Darat menjadi bagian Kecamatan Samboja Barat berdasarkan
                  Perda Kabupaten Kutai Kartanegara Nomor 6 Tahun 2020.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.factSection} aria-label="Profil Amborawang Darat dalam angka">
        <div className={`container ${styles.factGrid}`}>
          {profileFacts.map((fact, index) => (
            <Reveal key={fact.label} enabled={animationEnabled} delay={index * 65}>
              <article className={styles.factCard}>
                <span className={styles.factIcon}><Icon name={fact.icon} /></span>
                <div>
                  <strong>{fact.value}</strong>
                  <span>{fact.label}</span>
                  <small>{fact.note}</small>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={styles.timelineSection}>
        <div className={`container ${styles.timelineLayout}`}>
          <Reveal enabled={animationEnabled}>
            <div className={styles.sectionIntro}>
              <span className="eyebrow">Jejak Perkembangan</span>
              <h2>Perubahan administratif dan penguatan pelayanan</h2>
              <p>
                Bagian ini menampilkan tonggak yang dapat diverifikasi tanpa menambahkan
                cerita asal-usul yang belum memiliki dokumen resmi.
              </p>
              <span className={styles.largeIcon}><Icon name="history" size={48} /></span>
            </div>
          </Reveal>

          <div className={styles.timeline}>
            {profileTimeline.map((item, index) => (
              <Reveal key={item.year} enabled={animationEnabled} delay={index * 75}>
                <article className={styles.timelineItem}>
                  <span className={styles.timelineYear}>{item.year}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.visionSection}>
        <div className={`container ${styles.visionGrid}`}>
          <Reveal enabled={animationEnabled}>
            <article className={styles.visionCard}>
              <span className={styles.darkIcon}><Icon name="vision" size={28} /></span>
              <span className={styles.darkKicker}>Visi Pelayanan</span>
              <blockquote>{data.vision}</blockquote>
              <small>
                Rumusan profil digital ini tetap dapat disesuaikan melalui dashboard
                apabila dokumen visi kelurahan yang ditetapkan tersedia.
              </small>
            </article>
          </Reveal>

          <Reveal enabled={animationEnabled} delay={100}>
            <article className={styles.missionCard}>
              <div className={styles.missionHeading}>
                <span className={styles.lightIcon}><Icon name="mission" size={25} /></span>
                <div>
                  <span>Misi</span>
                  <h2>Arah kerja yang dekat dengan kebutuhan warga</h2>
                </div>
              </div>
              <ol className={styles.missionList}>
                {data.missions.map((mission, index) => (
                  <li key={mission}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{mission}</p>
                  </li>
                ))}
              </ol>
            </article>
          </Reveal>
        </div>
      </section>

      <section className={styles.geographySection}>
        <div className="container">
          <Reveal enabled={animationEnabled}>
            <div className={styles.centerHeading}>
              <span className="eyebrow">Kondisi Wilayah</span>
              <h2>Geografi dan batas administratif</h2>
              <p>{data.geography}</p>
            </div>
          </Reveal>

          <div className={styles.geographyGrid}>
            <Reveal enabled={animationEnabled}>
              <article className={styles.mapCard}>
                <div className={styles.mapPattern} aria-hidden="true" />
                <span className={styles.mapBadge}><Icon name="map" /> Ringkasan Wilayah</span>
                <div className={styles.mapCenter}>
                  <span>Kelurahan</span>
                  <strong>Amborawang<br />Darat</strong>
                  <small>Samboja Barat</small>
                </div>
                <div className={`${styles.compassPoint} ${styles.north}`}>U</div>
                <div className={`${styles.compassPoint} ${styles.east}`}>T</div>
                <div className={`${styles.compassPoint} ${styles.south}`}>S</div>
                <div className={`${styles.compassPoint} ${styles.west}`}>B</div>
              </article>
            </Reveal>

            <div className={styles.boundaryGrid}>
              {profileBoundaries.map((boundary, index) => (
                <Reveal key={boundary.direction} enabled={animationEnabled} delay={index * 65}>
                  <article className={styles.boundaryCard}>
                    <span>{boundary.direction}</span>
                    <strong>{boundary.places}</strong>
                  </article>
                </Reveal>
              ))}
              <Reveal enabled={animationEnabled} delay={260} className={styles.boundaryLegalWrap}>
                <div className={styles.boundaryLegal}>
                  <Icon name="shield" />
                  <p>{data.boundaries}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.potentialSection}>
        <div className="container">
          <Reveal enabled={animationEnabled}>
            <div className={styles.splitHeading}>
              <div>
                <span className="eyebrow">Potensi Kelurahan</span>
                <h2>Peluang yang dapat dikembangkan bersama</h2>
              </div>
              <p>{data.potential}</p>
            </div>
          </Reveal>

          <div className={styles.potentialGrid}>
            {profilePotentials.map((item, index) => (
              <Reveal key={item.title} enabled={animationEnabled} delay={index * 70}>
                <article className={styles.potentialCard}>
                  <span><Icon name={item.icon} size={27} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.facilitySection}>
        <div className="container">
          <Reveal enabled={animationEnabled}>
            <div className={styles.centerHeading}>
              <span className="eyebrow">Fasilitas Umum</span>
              <h2>Sarana yang mendukung aktivitas masyarakat</h2>
              <p>
                Daftar dapat diperbarui melalui dashboard ketika terdapat fasilitas baru
                atau perubahan nama layanan.
              </p>
            </div>
          </Reveal>

          <div className={styles.facilityGrid}>
            {data.facilities.map((facility, index) => (
              <Reveal key={facility} enabled={animationEnabled} delay={(index % 4) * 55}>
                <article className={styles.facilityCard}>
                  <span className={styles.facilityNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.facilityCheck}><Icon name="check" /></span>
                  <p>{facility}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.prioritySection}>
        <div className={`container ${styles.priorityPanel}`}>
          <Reveal enabled={animationEnabled}>
            <div className={styles.priorityIntro}>
              <span className={styles.priorityKicker}>Tambahan Profil</span>
              <h2>Prioritas pengembangan wilayah</h2>
              <p>
                Bagian ini membuat halaman profil lebih relevan dengan kebutuhan
                perencanaan dan menunjukkan fokus perbaikan secara ringkas.
              </p>
            </div>
          </Reveal>
          <div className={styles.priorityList}>
            {developmentPriorities.map((item, index) => (
              <Reveal key={item} enabled={animationEnabled} delay={index * 45}>
                <div className={styles.priorityItem}>
                  <span><Icon name="check" /></span>
                  <strong>{item}</strong>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaPanel}`}>
          <div>
            <span>Data wilayah perlu diperbarui secara berkala</span>
            <h2>Menemukan data atau fasilitas yang belum tercantum?</h2>
            <p>Sampaikan koreksi kepada kelurahan agar profil publik tetap akurat.</p>
          </div>
          <div className={styles.ctaActions}>
            <Link href="/kontak" className="btn btn-primary">
              Hubungi Kelurahan <Icon name="arrow" />
            </Link>
            <Link href="/wilayah" className="btn btn-outline">
              Lihat Data Wilayah
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
