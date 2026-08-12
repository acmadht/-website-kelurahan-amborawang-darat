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
            <div className={`container ${styles.heroInner}`}>
              <span>Program KKN 2026</span>
              <h1>
                Program Kerja
                <strong>KKN {settings.villageName}</strong>
              </h1>
              <p>
                Daftar program kerja KKN yang disimpan sebagai arsip statis dan dipublikasikan khusus pada ruang KKN.
              </p>
            </div>
          </section>

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
                <div className={styles.grid}>
                  {programs.map((item) => (
                    <article key={item.id || `${item.code}-${item.title}`} className={styles.stepCard}>
                      <span className={styles.stepCode}>{item.code || "PRG"}</span>
                      <span className={styles.eyebrow}>{item.category}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      {item.objective ? <p><strong>Tujuan:</strong> {item.objective}</p> : null}
                      {item.target ? <p><strong>Sasaran:</strong> {item.target}</p> : null}
                      {item.schedule ? <p><strong>Waktu:</strong> {item.schedule}</p> : null}
                      {item.personInCharge ? <p><strong>Penanggung jawab:</strong> {item.personInCharge}</p> : null}
                      <p><strong>Status:</strong> {item.status || "-"}</p>
                      {item.linkUrl ? (
                        <div className={styles.featureLinks}>
                          <Link href={item.linkUrl}>{item.linkLabel || "Lihat Detail"}</Link>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              ) : (
                <div className={styles.notice}>
                  <div>
                    <span>Belum ada program</span>
                    <h2>Data program kerja belum dipublikasikan.</h2>
                    <p>Informasi program akan ditampilkan setelah data kegiatan KKN ditetapkan untuk dipublikasikan.</p>
                  </div>
                </div>
              )}

              <div className={styles.notice}>
                <div>
                  <span>Ruang KKN</span>
                  <h2>Program, berita, galeri, Book Chapter, dan luaran KKN disimpan terpisah dari konten dinamis kelurahan.</h2>
                  <p>Pemisahan ini menjaga dokumentasi KKN tetap terorganisasi tanpa bercampur dengan konten resmi kelurahan.</p>
                </div>
                <div className={styles.actions}>
                  <Link href="/kkn/luaran" className={styles.primaryAction}>Lihat Luaran KKN</Link>
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
