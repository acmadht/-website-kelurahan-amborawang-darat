import type { Metadata } from "next";
import Link from "next/link";
import PublicShell from "@/components/public/PublicShell";
import JsonLd from "@/components/seo/JsonLd";
import { staticKknBookChapters } from "@/data/kknStatic";
import { breadcrumbJsonLd, buildMetadata, getServerSettings } from "@/lib/seo";
import styles from "./page.module.css";


export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/kkn/book-chapter",
    title: `Book Chapter KKN ${settings.villageName}`,
    description: `Halaman khusus Book Chapter sebagai luaran kegiatan Tim KKN di Kelurahan ${settings.villageName}.`,
  });
}

export default async function Page() {
  const settings = await getServerSettings();

  const published = staticKknBookChapters
    .filter((item) => item.isActive !== false && item.status === "published")
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Beranda", path: "/" },
        { name: "KKN", path: "/tim-kkn" },
        { name: "Book Chapter", path: "/kkn/book-chapter" },
      ])} />
      <PublicShell>
        <main className={styles.page}>
          <section className={styles.hero}>
            <div className={styles.pattern} aria-hidden="true" />
            <div className={`container ${styles.heroInner}`}>
              <span>Luaran KKN</span>
              <h1>Book Chapter<strong>KKN {settings.villageName}</strong></h1>
              <p>Publikasi tertulis Tim KKN yang disimpan sebagai arsip statis khusus ruang KKN.</p>
            </div>
          </section>

          <section className={styles.content}>
            <div className={`container ${styles.grid}`}>
              {published.length ? published.map((item, index) => (
                <article className={styles.card} key={item.id || item.title}>
                  {item.coverImageUrl ? (
                    <div className={styles.cover}><img src={item.coverImageUrl} alt={`Cover ${item.title}`} /></div>
                  ) : (
                    <div className={styles.code}>{String(index + 1).padStart(2, "0")}</div>
                  )}
                  <div>
                    <span className={styles.eyebrow}>Book Chapter {item.year || ""}</span>
                    <h2>{item.title}</h2>
                    {item.authors?.length ? <p><strong>Penulis:</strong> {item.authors.join(", ")}</p> : null}
                    <p>{item.abstract}</p>
                    <div className={styles.meta}>
                      {item.publisher ? <span>Penerbit: {item.publisher}</span> : null}
                      {item.isbn ? <span>ISBN: {item.isbn}</span> : null}
                      {item.doi ? <span>DOI: {item.doi}</span> : null}
                    </div>
                    <div className={styles.actions}>
                      {item.fileUrl ? <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">Baca / Unduh Dokumen</a> : null}
                      <Link href="/kkn/luaran">Luaran KKN</Link>
                    </div>
                  </div>
                </article>
              )) : (
                <div className={styles.card}>
                  <div className={styles.code}>BC</div>
                  <div>
                    <span className={styles.eyebrow}>Book Chapter KKN</span>
                    <h2>Belum ada Book Chapter yang dipublikasikan</h2>
                    <p>Book Chapter belum dipublikasikan. Informasi publikasi akan tampil pada halaman ini setelah naskah dan dokumennya tersedia.</p>
                    <div className={styles.actions}>
                      <Link href="/tim-kkn">Tim KKN</Link>
                      <Link href="/kkn/program-kerja">Program Kerja</Link>
                      <Link href="/kkn/luaran">Luaran KKN</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </PublicShell>
    </>
  );
}
