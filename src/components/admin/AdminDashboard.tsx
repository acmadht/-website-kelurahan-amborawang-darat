"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import styles from "./AdminDashboard.module.css";

const statsConfig = [
  { collection: "posts", label: "Berita", href: "/admin/berita", code: "BR" },
  { collection: "services", label: "Layanan", href: "/admin/layanan", code: "LY" },
  { collection: "announcements", label: "Pengumuman", href: "/admin/pengumuman", code: "PG" },
  { collection: "agendas", label: "Agenda", href: "/admin/agenda", code: "AG" },
  { collection: "galleryPhotos", label: "Foto Galeri", href: "/admin/galeri", code: "GL" },
  { collection: "documents", label: "Dokumen", href: "/admin/dokumen", code: "DK" },
  { collection: "officials", label: "Aparatur", href: "/admin/aparatur", code: "PM" },
  { collection: "rts", label: "RT", href: "/admin/rt", code: "RT" },
] as const;

const quickActions = [
  { title: "Tambah berita", text: "Publikasikan informasi terbaru lengkap dengan tanggal dan waktu.", href: "/admin/berita", code: "BR" },
  { title: "Kelola aparatur", text: "Perbarui pejabat, staf, lembaga, dan foto pemerintahan.", href: "/admin/aparatur", code: "PM" },
  { title: "Perbarui wilayah", text: "Sesuaikan statistik, batas wilayah, peta, dan data ringkas.", href: "/admin/wilayah", code: "WL" },
  { title: "Kontak & jam layanan", text: "Ubah nomor, alamat, Google Maps, dan jam pelayanan.", href: "/admin/kontak", code: "KT" },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const pairs = await Promise.all(
          statsConfig.map(async ({ collection: name }) => {
            const snap = await getDocs(collection(db!, name));
            return [name, snap.size] as const;
          }),
        );
        setCounts(Object.fromEntries(pairs));
      } catch (error) {
        console.error("Gagal memuat ringkasan dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const total = useMemo(
    () => Object.values(counts).reduce((sum: number, value: number) => sum + value, 0),
    [counts],
  );

  return (
    <div className={styles.page}>
      <section className={styles.welcome}>
        <div>
          <span>Dashboard Kelurahan</span>
          <h1>Pusat pengelolaan website</h1>
          <p>
            Kelola informasi publik Amborawang Darat dari satu dashboard yang
            terhubung dengan Firestore.
          </p>
        </div>
        <div className={styles.welcomeMeta}>
          <small>Konten terdata</small>
          <strong>{loading ? "…" : total}</strong>
          <span>pada modul utama</span>
        </div>
      </section>

      <section className={styles.lockNotice}>
        <div className={styles.lockIcon}>KKN</div>
        <div>
          <span>Konten Dilindungi</span>
          <strong>Tim KKN tidak dapat diubah melalui admin.</strong>
          <p>
            Nama, foto, divisi, dosen pembimbing, dan struktur KKN tetap dikunci
            di source code agar tidak terubah oleh admin kelurahan.
          </p>
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={styles.sectionHead}>
          <div>
            <span>Ringkasan Konten</span>
            <h2>Data yang dikelola admin</h2>
          </div>
          <Link href="/" className={styles.textLink}>Lihat website ↗</Link>
        </div>

        <div className={styles.statsGrid}>
          {statsConfig.map((item) => (
            <Link href={item.href} className={styles.statCard} key={item.collection}>
              <span className={styles.statCode}>{item.code}</span>
              <strong>{loading ? "…" : counts[item.collection] ?? 0}</strong>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.quickSection}>
        <div className={styles.sectionHead}>
          <div>
            <span>Akses Cepat</span>
            <h2>Pekerjaan admin yang paling sering digunakan</h2>
          </div>
        </div>

        <div className={styles.quickGrid}>
          {quickActions.map((item) => (
            <Link href={item.href} key={item.href} className={styles.quickCard}>
              <span className={styles.quickCode}>{item.code}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
              <span className={styles.arrow}>→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.panel}>
          <span>Urutan Pengelolaan</span>
          <h2>Alur kerja yang disarankan</h2>
          <ol>
            <li>Periksa Beranda, Hero Banner, dan Profil Kelurahan.</li>
            <li>Lengkapi Pemerintahan, lembaga, dan 13 RT.</li>
            <li>Perbarui Wilayah, Layanan, Kontak, dan jam pelayanan.</li>
            <li>Publikasikan Berita, Pengumuman, Agenda, Galeri, dan Dokumen.</li>
            <li>Periksa hasil akhir melalui tampilan website publik.</li>
          </ol>
        </article>

        <article className={styles.panelAccent}>
          <span>Prinsip Akses</span>
          <h2>Admin fokus pada kebutuhan kelurahan.</h2>
          <p>
            Seluruh modul operasional dapat diperbarui tanpa edit kode, sedangkan
            halaman Tim KKN sengaja tidak memiliki menu pengelolaan.
          </p>
          <Link href="/admin/pengaturan">Buka Pengaturan Website →</Link>
        </article>
      </section>
    </div>
  );
}
