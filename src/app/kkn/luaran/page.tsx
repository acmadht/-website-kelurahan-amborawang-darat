import type { Metadata } from "next";
import Link from "next/link";
import PublicShell from "@/components/public/PublicShell";
import JsonLd from "@/components/seo/JsonLd";
import { staticKknOutputs } from "@/data/kknStatic";
import type { KknOutput } from "@/types";
import { breadcrumbJsonLd, buildMetadata, getServerCollection, getServerSettings } from "@/lib/seo";
import styles from "./page.module.css";


export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/kkn/luaran",
    title: `Luaran KKN ${settings.villageName}`,
    description: `Ruang luaran dan dokumentasi hasil kegiatan Tim KKN Reguler di Kelurahan ${settings.villageName}.`,
  });
}

export default async function Page() {
  const [settings, remoteOutputs] = await Promise.all([
    getServerSettings(),
    getServerCollection<KknOutput>("kknOutputs"),
  ]);

  const outputs = (remoteOutputs.length ? remoteOutputs : staticKknOutputs)
    .filter((item) => item.isActive !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Beranda", path: "/" },
        { name: "KKN", path: "/tim-kkn" },
        { name: "Luaran KKN", path: "/kkn/luaran" },
      ])} />
      <PublicShell>
        <main className={styles.page}>
          <section className={styles.hero}>
            <div className={styles.pattern} aria-hidden="true" />
            <div className={`container ${styles.heroInner}`}>
              <span>Hasil & Dokumentasi</span>
              <h1>Luaran KKN<strong>{settings.villageName}</strong></h1>
              <p>Hasil digital, publikasi, media, dan dokumentasi KKN yang dikelola melalui dashboard admin.</p>
            </div>
          </section>

          <section className={styles.content}>
            <div className="container">
              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>01</span>
                <div>
                  <span className={styles.eyebrow}>Ruang luaran</span>
                  <h2>{outputs.length} luaran tersedia</h2>
                  <p>Luaran KKN disajikan pada ruang khusus sebagai dokumentasi hasil kegiatan dan publikasi tim.</p>
                </div>
              </div>

              <div className={styles.grid}>
                {outputs.map((item) => (
                  <article key={item.id || `${item.code}-${item.title}`} className={styles.outputCard}>
                    <div className={styles.outputTop}>
                      <span className={styles.outputCode}>{item.code || "OUT"}</span>
                      <span className={styles.outputType}>{item.type}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    {item.href ? <Link href={item.href}>{item.linkLabel || "Lihat Luaran"} <span aria-hidden="true">→</span></Link> : null}
                  </article>
                ))}
              </div>

              <div className={styles.infoPanel}>
                <div>
                  <span>Pengelolaan admin</span>
                  <h2>Luaran KKN dapat dilengkapi sesuai hasil kegiatan yang telah ditetapkan untuk dipublikasikan.</h2>
                  <p>Modul, leaflet, video profil, infografis, peta, poster, laporan, atau media lain dapat ditampilkan sebagai bagian dari luaran kegiatan KKN.</p>
                </div>
                <div className={styles.actions}>
                  <Link href="/kkn/program-kerja" className={styles.primaryAction}>Program Kerja</Link>
                  <Link href="/tim-kkn" className={styles.secondaryAction}>Tim KKN</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </PublicShell>
    </>
  );
}
