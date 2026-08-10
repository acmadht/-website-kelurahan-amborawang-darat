"use client";

import Link from "next/link";
import { useDocumentData } from "@/hooks/useFirestoreData";
import {
  amborawangProfileFallback,
  resolveAmborawangProfile,
  type ProfileContent,
} from "@/data/amborawangProfile";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./ProfilePage.module.css";

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
  const { data } = useDocumentData<ProfileContent>(
    "pages",
    "profil",
    amborawangProfileFallback,
  );
  const profile = resolveAmborawangProfile(data);
  const quickStats = profile.stats.slice(0, 3);
  const historyParagraphs = profile.history
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <PublicShell>
      <main className={styles.page}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroPattern} aria-hidden="true" />
          <div className={`container ${styles.heroInner}`}>
            <Reveal enabled>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrowLight}>{profile.heroEyebrow}</span>
                <h1>{profile.heroTitle}</h1>
                <p>{profile.heroDescription}</p>
              </div>
            </Reveal>

            <Reveal enabled delay={70}>
              <div className={styles.heroPhotoCard}>
                <div className={styles.heroPhoto}>
                  <img
                    src={profile.imageUrl}
                    alt={profile.heroImageTitle}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = amborawangProfileFallback.imageUrl;
                    }}
                  />
                </div>
                <div className={styles.heroPhotoMeta}>
                  <span>{profile.heroImageTitle}</span>
                  <small>{profile.heroImageCaption}</small>
                  <small>{profile.heroImageCredit}</small>
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
                  <span>{profile.summaryEyebrow}</span>
                  <strong>{profile.summaryName}</strong>
                  <p>{profile.summaryDescription}</p>
                </div>
              </Reveal>

              {quickStats.map((item, index) => (
                <Reveal key={`${item.label}-${index}`} enabled delay={(index + 1) * 40}>
                  <div className={styles.quickBandItem}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                </Reveal>
              ))}
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
                <h2>{profile.historyTitle}</h2>

                {historyParagraphs.map((paragraph, index) => (
                  <p key={`${paragraph.slice(0, 30)}-${index}`}>{paragraph}</p>
                ))}

                <div className={styles.factCallout}>{profile.historyCallout}</div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* STATS */}
        <section className={styles.statsSection}>
          <div className="container">
            <div className={styles.statsGrid}>
              {profile.stats.map((item, index) => (
                <Reveal key={`${item.label}-${index}`} enabled delay={index * 45}>
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
              <div className={styles.sectionHeadingDark}>
                <span className={styles.eyebrowLight}>{profile.timelineEyebrow}</span>
                <h2>{profile.timelineTitle}</h2>
                <p>{profile.timelineDescription}</p>
              </div>
            </Reveal>

            <div className={styles.timeline}>
              {profile.timeline.map((item, index) => (
                <Reveal key={`${item.year}-${index}`} enabled delay={index * 55}>
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
                  <blockquote>{profile.vision}</blockquote>
                  <p>{profile.visionNote}</p>
                </div>
              </Reveal>

              <div className={styles.missionArea}>
                <Reveal enabled>
                  <div className={styles.missionHeading}>
                    <span className={styles.eyebrow}>Misi</span>
                    <h2>{profile.missionTitle}</h2>
                  </div>
                </Reveal>

                <div className={styles.missionList}>
                  {profile.missions.map((item, index) => (
                    <Reveal key={`${item}-${index}`} enabled delay={index * 40}>
                      <div className={styles.missionItem}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
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
                <span className={styles.eyebrowLight}>{profile.regionEyebrow}</span>
                <h2>{profile.regionTitle}</h2>
                <p>{profile.geography}</p>
              </div>
            </Reveal>

            <div className={styles.regionFacts}>
              {profile.regionFacts.map((item, index) => (
                <Reveal key={`${item.label}-${index}`} enabled delay={index * 40}>
                  <div className={styles.regionFact}>
                    <span>{item.value}</span>
                    <small>{item.label}</small>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className={styles.regionGrid}>
              <Reveal enabled>
                <div className={styles.mapCard}>
                  <div className={styles.mapTop}>
                    <div>
                      <span>Peta Wilayah</span>
                      <strong>{profile.mapTitle}</strong>
                    </div>
                    <a
                      href={profile.mapImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Lihat Peta Penuh
                      <ArrowIcon size={16} />
                    </a>
                  </div>

                  <div className={styles.mapImageWrap}>
                    <img
                      src={profile.mapImageUrl}
                      alt={`Peta wilayah ${profile.mapTitle}`}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = amborawangProfileFallback.mapImageUrl;
                      }}
                    />
                  </div>
                </div>
              </Reveal>

              <div className={styles.boundaryList}>
                {profile.boundaryItems.map((item, index) => (
                  <Reveal key={`${item.direction}-${index}`} enabled delay={index * 45}>
                    <div className={styles.boundaryItem}>
                      <span>{item.direction}</span>
                      <strong>{item.places}</strong>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal enabled>
              <p className={styles.regionNote}>{profile.boundaries}</p>
            </Reveal>
          </div>
        </section>

        {/* POTENSI */}
        <section className={styles.potentialSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.sectionHeading}>
                <span className={styles.eyebrow}>{profile.potentialEyebrow}</span>
                <h2>{profile.potentialTitle}</h2>
                <p>{profile.potential}</p>
              </div>
            </Reveal>

            <div className={styles.potentialGrid}>
              {profile.potentials.map((item, index) => (
                <Reveal key={`${item.title}-${index}`} enabled delay={index * 50}>
                  <article className={styles.potentialCard}>
                    <span className={styles.cardNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
                  <span className={styles.eyebrow}>{profile.facilityEyebrow}</span>
                  <h2>{profile.facilityTitle}</h2>
                </div>
                <p>{profile.facilityIntro}</p>
              </div>
            </Reveal>

            <div className={styles.facilityLead}>
              <div>
                <span>{String(profile.facilities.length).padStart(2, "0")}</span>
                <strong>Kelompok fasilitas utama</strong>
              </div>
              <p>{profile.facilityLeadText}</p>
            </div>

            <div className={styles.facilityList}>
              {profile.facilities.map((item, index) => (
                <Reveal key={`${item}-${index}`} enabled delay={index * 35}>
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
                <span className={styles.eyebrowLight}>{profile.priorityEyebrow}</span>
                <h2>{profile.priorityTitle}</h2>
                <p>{profile.priorityIntro}</p>
              </div>
            </Reveal>

            <div className={styles.priorityGrid}>
              {profile.priorities.map((item, index) => (
                <Reveal key={`${item}-${index}`} enabled delay={index * 40}>
                  <div className={styles.priorityItem}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
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
                  <span>{profile.updateKicker}</span>
                  <h2>{profile.updateTitle}</h2>
                  <p>{profile.updateText}</p>
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
