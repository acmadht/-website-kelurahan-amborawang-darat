import type { Metadata } from "next";
import Link from "next/link";
import PublicShell from "@/components/public/PublicShell";
import JsonLd from "@/components/seo/JsonLd";
import { staticKknPrograms } from "@/data/kknStatic";
import { breadcrumbJsonLd, buildMetadata, getServerSettings } from "@/lib/seo";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/kkn/program-kerja",
    title: `Program Kerja KKN ${settings.villageName}`,
    description: `Informasi program kerja Tim KKN Reguler di Kelurahan ${settings.villageName}.`,
  });
}

export default async function Page() {
  const settings = await getServerSettings();
  const programs = staticKknPrograms
    .filter((item) => item.isActive !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: "KKN", path: "/tim-kkn" },
          { name: "Program Kerja", path: "/kkn/program-kerja" },
        ])}
      />
      <PublicShell>
        <main className={styles.page}>
          <section className={styles.hero}>
            <div className={styles.pattern} aria-hidden="true" />
            <div className={styles.glowOne} aria-hidden="true" />
            <div className={styles.glowTwo} aria-hidden="true" />

            <div className={`container ${styles.heroInner}`}>
              <div className={styles.heroCopy}>
                <span className={styles.heroEyebrow}>Program KKN 2026</span>
                <h1>
                  Program Kerja
                  <strong>KKN {settings.villageName}</strong>
                </h1>
                <p>
                  Daftar program kerja KKN yang disimpan sebagai arsip statis dan dipublikasikan khusus pada ruang KKN.
                </p>
              </div>

              <div className={styles.heroMeta} aria-label="Ringkasan program kerja KKN">
                <div className={styles.heroStat}>
                  <strong>{programs.length}</strong>
                  <span>Program</span>
                </div>
                <div className={styles.heroStat}>
                  <strong>2026</strong>
                  <span>Periode KKN</span>
                </div>
                <div className={`${styles.heroStat} ${styles.heroStatWide}`}>
                  <strong>KKN</strong>
                  <span>{settings.villageName}</span>
                </div>
              </div>
            </div>
          </section>

          <nav className={styles.kknNav} aria-label="Navigasi ruang KKN">
            <div className={`container ${styles.kknNavInner}`}>
              <Link href="/tim-kkn">Tim KKN</Link>
              <Link href="/kkn/program-kerja" className={styles.activeNav}>Program Kerja</Link>
              <Link href="/kkn/berita">Berita KKN</Link>
              <Link href="/kkn/galeri">Galeri</Link>
              <Link href="/kkn/luaran">Luaran</Link>
            </div>
          </nav>

          <section className={styles.content}>
            <div className="container">
              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>01</span>
                <div>
                  <span className={styles.eyebrow}>Program KKN</span>
                  <h2>{programs.length} program terdaftar</h2>
                  <p>Program KKN didokumentasikan pada ruang khusus agar tidak bercampur dengan informasi resmi kelurahan.</p>
                </div>
              </div>

              {programs.length ? (
                <>
                  <div className={styles.desktopGrid}>
                    {programs.map((item) => (
                      <article key={`desktop-${item.id || `${item.code}-${item.title}`}`} className={styles.programCard}>
                        <div className={styles.programTopline}>
                          <span className={styles.programCode}>{item.code || "PRG"}</span>
                          <span className={styles.statusBadge}>{item.status || "-"}</span>
                        </div>
                        <span className={styles.eyebrow}>{item.category}</span>
                        <h3>{item.title}</h3>
                        <p className={styles.programDescription}>{item.description}</p>

                        <div className={styles.detailGrid}>
                          {item.objective ? (
                            <div className={styles.detailItem}>
                              <span>Tujuan</span>
                              <p>{item.objective}</p>
                            </div>
                          ) : null}
                          {item.target ? (
                            <div className={styles.detailItem}>
                              <span>Sasaran</span>
                              <p>{item.target}</p>
                            </div>
                          ) : null}
                          {item.schedule ? (
                            <div className={styles.detailItem}>
                              <span>Waktu</span>
                              <p>{item.schedule}</p>
                            </div>
                          ) : null}
                          {item.personInCharge ? (
                            <div className={styles.detailItem}>
                              <span>Penanggung Jawab</span>
                              <p>{item.personInCharge}</p>
                            </div>
                          ) : null}
                        </div>

                        {item.linkUrl ? (
                          <div className={styles.featureLinks}>
                            <Link href={item.linkUrl}>{item.linkLabel || "Lihat Detail"}</Link>
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>

                  <div className={styles.mobilePrograms}>
                    {programs.length > 1 ? (
                      <div className={styles.swipeHint}>
                        <span>Program aktif</span>
                        <span>Geser untuk melihat lainnya →</span>
                      </div>
                    ) : null}

                    <div className={styles.programRail}>
                      {programs.map((item, index) => (
                        <article key={`mobile-${item.id || `${item.code}-${item.title}`}`} className={styles.mobileProgramCard}>
                          <div className={styles.cardAccent} aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>

                          <div className={styles.programTopline}>
                            <span className={styles.programCode}>{item.code || "PRG"}</span>
                            <span className={styles.statusBadge}>{item.status || "-"}</span>
                          </div>

                          <span className={styles.eyebrow}>{item.category}</span>
                          <h3>{item.title}</h3>
                          <p className={styles.mobileDescription}>{item.description}</p>

                          <div className={styles.quickFacts}>
                            {item.schedule ? (
                              <span>
                                <small>Waktu</small>
                                {item.schedule}
                              </span>
                            ) : null}
                            {item.target ? (
                              <span>
                                <small>Sasaran</small>
                                {item.target}
                              </span>
                            ) : null}
                          </div>

                          <details className={styles.mobileDetails}>
                            <summary>
                              <span>Detail program</span>
                              <i aria-hidden="true" />
                            </summary>
                            <div className={styles.mobileDetailsBody}>
                              {item.objective ? (
                                <div>
                                  <strong>Tujuan</strong>
                                  <p>{item.objective}</p>
                                </div>
                              ) : null}
                              {item.target ? (
                                <div>
                                  <strong>Sasaran</strong>
                                  <p>{item.target}</p>
                                </div>
                              ) : null}
                              {item.schedule ? (
                                <div>
                                  <strong>Waktu</strong>
                                  <p>{item.schedule}</p>
                                </div>
                              ) : null}
                              {item.personInCharge ? (
                                <div>
                                  <strong>Penanggung jawab</strong>
                                  <p>{item.personInCharge}</p>
                                </div>
                              ) : null}
                            </div>
                          </details>

                          {item.linkUrl ? (
                            <Link href={item.linkUrl} className={styles.mobilePrimaryLink}>
                              {item.linkLabel || "Lihat Detail"}
                              <span aria-hidden="true">→</span>
                            </Link>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon} aria-hidden="true">01</span>
                  <div>
                    <span>Belum ada program</span>
                    <h2>Data program kerja belum dipublikasikan.</h2>
                    <p>Informasi program akan ditampilkan setelah data kegiatan KKN ditetapkan untuk dipublikasikan.</p>
                  </div>
                </div>
              )}

              <div className={styles.notice}>
                <div className={styles.noticeCopy}>
                  <span>Ruang KKN</span>
                  <h2>Jelajahi dokumentasi dan hasil kegiatan KKN.</h2>
                  <p>Program, berita, galeri, Book Chapter, dan luaran KKN disimpan terpisah dari konten resmi kelurahan.</p>
                </div>
                <div className={styles.actions}>
                  <Link href="/kkn/luaran" className={styles.primaryAction}>Lihat Luaran</Link>
                  <Link href="/kkn/berita" className={styles.secondaryAction}>Berita KKN</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </PublicShell>
    </>
  );
}
