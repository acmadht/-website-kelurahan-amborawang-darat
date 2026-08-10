"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCollectionData } from "@/hooks/useFirestoreData";
import type { PublicDocument } from "@/types";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./DocumentsPage.module.css";

type DocumentItem = {
  id: string;
  title: string;
  category: string;
  year: string;
  type: string;
  size: string;
  description: string;
  href: string;
};

const fallbackDocuments: DocumentItem[] = [
  { id: "1", title: "Profil Kelurahan Amborawang Darat", category: "Profil", year: "2026", type: "PDF", size: "Dokumen publik", description: "Dokumen profil kelurahan yang memuat informasi dasar, wilayah, pelayanan, dan potensi.", href: "/dokumen/profil-kelurahan-amborawang-darat.pdf" },
  { id: "2", title: "Formulir Pelayanan Administrasi", category: "Administrasi", year: "2026", type: "DOCX", size: "Dokumen publik", description: "Formulir pendukung pelayanan administrasi masyarakat yang dapat diunduh.", href: "/dokumen/formulir-pelayanan-administrasi.docx" },
  { id: "3", title: "Peraturan Daerah Kabupaten Kutai Kartanegara Nomor 6 Tahun 2020", category: "Peraturan", year: "2020", type: "PDF", size: "Dokumen publik", description: "Dokumen peraturan terkait pembentukan Kecamatan Samboja Barat.", href: "/dokumen/perda-kukar-nomor-6-tahun-2020.pdf" },
  { id: "4", title: "Peraturan Bupati Kutai Kartanegara Nomor 43 Tahun 2019", category: "Peraturan", year: "2019", type: "PDF", size: "Dokumen publik", description: "Dokumen peraturan yang berkaitan dengan batas administratif wilayah.", href: "/dokumen/perbup-kukar-nomor-43-tahun-2019.pdf" },
  { id: "5", title: "Rekapitulasi Data Wilayah", category: "Laporan", year: "2026", type: "PDF", size: "Dokumen publik", description: "Ringkasan data wilayah, RT, dan informasi administratif kelurahan.", href: "/dokumen/rekapitulasi-data-wilayah.pdf" },
  { id: "6", title: "Laporan Informasi Publik Kelurahan", category: "Laporan", year: "2026", type: "PDF", size: "Dokumen publik", description: "Dokumen ringkasan informasi publik dan dokumentasi pelayanan kelurahan.", href: "/dokumen/laporan-informasi-publik.pdf" },
];

function ArrowIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>;
}
function DocumentIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h5M10 12h5M10 16h5" /></svg>;
}
function SearchIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
}
function DownloadIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>;
}
function EyeIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></svg>;
}

export default function DocumentsPage() {
  const { data: remoteDocuments } = useCollectionData<PublicDocument>("documents", []);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [query, setQuery] = useState("");

  const documents = useMemo<DocumentItem[]>(() => {
    const active = remoteDocuments.filter((item) => item.isActive !== false && item.fileUrl);
    if (!active.length) return fallbackDocuments;
    return active.map((item, index) => ({
      id: item.id || `document-${index}`,
      title: item.title,
      category: item.category || "Lainnya",
      year: item.year || "-",
      type: item.fileType || "File",
      size: "Dokumen publik",
      description: item.description || "Dokumen publik Kelurahan Amborawang Darat.",
      href: item.fileUrl,
    }));
  }, [remoteDocuments]);

  const categories = useMemo(() => ["Semua", ...Array.from(new Set(documents.map((item) => item.category)))], [documents]);

  useEffect(() => {
    if (!categories.includes(activeCategory)) setActiveCategory("Semua");
  }, [activeCategory, categories]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((item) => {
      const categoryMatch = activeCategory === "Semua" || item.category === activeCategory;
      const q = query.trim().toLowerCase();
      const searchMatch = !q || item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.year.includes(q);
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, documents, query]);

  return (
    <PublicShell>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroPattern} aria-hidden="true" />
          <div className={`container ${styles.heroGrid}`}>
            <Reveal enabled>
              <div className={styles.heroCopy}>
                <div className={styles.heroBadge}><DocumentIcon /><span>Arsip Digital Kelurahan</span></div>
                <h1>Dokumen<strong>Publik</strong></h1>
                <p>Pusat arsip dokumen Kelurahan Amborawang Darat untuk administrasi, profil, peraturan, dan laporan publik.</p>
                <div className={styles.heroMeta}><span><i />Dokumen dapat diakses masyarakat</span><span>Terstruktur berdasarkan kategori</span></div>
              </div>
            </Reveal>
            <Reveal enabled delay={70}>
              <div className={styles.heroArchive}>
                <div className={styles.archiveTop}><div className={styles.archiveIcon}><DocumentIcon /></div><div><span>Pusat Dokumen</span><strong>Arsip Publik Kelurahan</strong></div></div>
                <div className={styles.archiveStats}>
                  <div><strong>{String(documents.length).padStart(2, "0")}</strong><span>Dokumen</span></div>
                  <div><strong>{String(categories.length - 1).padStart(2, "0")}</strong><span>Kategori</span></div>
                  <div><strong>FILE</strong><span>Format digital</span></div>
                </div>
                <a href="#daftar-dokumen" className={styles.archiveLink}>Lihat Dokumen <ArrowIcon size={16} /></a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.searchSection}>
          <div className="container">
            <div className={styles.searchPanel}>
              <div className={styles.searchBox}><SearchIcon /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari judul, kategori, atau tahun dokumen..." aria-label="Cari dokumen" /></div>
              <div className={styles.categoryTabs}>{categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} className={activeCategory === category ? styles.activeTab : ""}>{category}</button>)}</div>
            </div>
          </div>
        </section>

        <section className={styles.introSection}>
          <div className={`container ${styles.introGrid}`}>
            <Reveal enabled><div className={styles.introAside}><span className={styles.sectionNumber}>01</span><span className={styles.eyebrow}>Dokumen Publik</span><h2>Informasi yang mudah ditemukan</h2></div></Reveal>
            <Reveal enabled delay={60}><div className={styles.introArticle}><p className={styles.lead}>Dokumen publik disusun agar masyarakat dapat mengakses informasi penting tanpa harus mencari berkas secara terpisah.</p><p>Setiap dokumen menampilkan kategori, tahun, dan format berkas agar lebih mudah dikenali sebelum dibuka atau diunduh.</p><div className={styles.introCallout}><span>Catatan</span><strong>Pastikan file yang dipublikasikan telah melalui verifikasi dan merupakan dokumen yang boleh diakses publik.</strong></div></div></Reveal>
          </div>
        </section>

        <section id="daftar-dokumen" className={styles.documentsSection}>
          <div className="container">
            <Reveal enabled><div className={styles.documentsHeading}><div><span className={styles.eyebrowLight}>Daftar Dokumen</span><h2>Arsip tersedia</h2></div><div className={styles.documentsCount}><strong>{String(filteredDocuments.length).padStart(2, "0")}</strong><span>dokumen ditampilkan</span></div></div></Reveal>
            <div className={styles.documentsGrid}>
              {filteredDocuments.map((item, index) => (
                <Reveal key={item.id} enabled delay={(index % 6) * 35}>
                  <article className={styles.documentCard}>
                    <div className={styles.documentTop}><div className={styles.fileIcon}><DocumentIcon /></div><div className={styles.fileType}><span>{item.type}</span><small>{item.size}</small></div></div>
                    <div className={styles.documentBody}><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p></div>
                    <div className={styles.documentMeta}><span>Tahun</span><strong>{item.year}</strong></div>
                    <div className={styles.documentActions}>
                      <a href={item.href} target="_blank" rel="noopener noreferrer"><EyeIcon />Lihat</a>
                      <a href={item.href} download><DownloadIcon />Unduh</a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            {filteredDocuments.length === 0 && <div className={styles.emptyState}><DocumentIcon /><strong>Dokumen tidak ditemukan</strong><p>Coba gunakan kata kunci lain atau pilih kategori yang berbeda.</p></div>}
          </div>
        </section>

        <section className={styles.publicInfoSection}>
          <div className="container">
            <Reveal enabled><div className={styles.publicInfoPanel}><div><span>Pengelolaan Arsip</span><h2>Dokumen publik perlu diperbarui secara berkala.</h2><p>Pastikan dokumen lama, formulir, peraturan, dan laporan diganti apabila tersedia versi terbaru.</p></div><div className={styles.publicInfoLinks}><Link href="/layanan">Layanan <ArrowIcon size={15} /></Link><Link href="/berita">Berita <ArrowIcon size={15} /></Link><Link href="/kontak">Kontak <ArrowIcon size={15} /></Link></div></div></Reveal>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className="container"><Reveal enabled><div className={styles.cta}><div><span>Butuh Dokumen Tertentu?</span><h2>Hubungi kelurahan jika dokumen belum tersedia.</h2><p>Petugas dapat membantu memberikan informasi mengenai dokumen publik dan kebutuhan administrasi.</p></div><div className={styles.ctaActions}><Link href="/kontak" className={styles.ctaPrimary}>Hubungi Kelurahan <ArrowIcon /></Link><Link href="/layanan" className={styles.ctaSecondary}>Lihat Layanan</Link></div></div></Reveal></div>
        </section>
      </main>
    </PublicShell>
  );
}
