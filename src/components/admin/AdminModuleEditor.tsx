"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./AdminModuleEditor.module.css";

type Props = {
  moduleKey: string;
};

const labels: Record<string, { title: string; desc: string }> = {
  profil: { title: "Profil Kelurahan", desc: "Kelola sejarah, visi misi, potensi, fasilitas, dan narasi profil." },
  pemerintahan: { title: "Pemerintahan", desc: "Kelola aparatur, staf, RT, lembaga, mitra, jabatan, dan foto." },
  layanan: { title: "Layanan", desc: "Kelola jenis layanan, persyaratan, alur, jam layanan, dan status." },
  berita: { title: "Berita", desc: "Kelola artikel, tanggal, waktu, foto, kategori, isi, dan status publikasi." },
  pengumuman: { title: "Pengumuman & Agenda", desc: "Kelola pengumuman penting dan agenda kegiatan kelurahan." },
  galeri: { title: "Galeri", desc: "Kelola dokumentasi foto, kategori, caption, tanggal, dan urutan." },
  dokumen: { title: "Dokumen Publik", desc: "Kelola file, kategori, tahun, format, dan status publik." },
  wilayah: { title: "Wilayah", desc: "Kelola statistik, batas administratif, data RT, dan informasi wilayah." },
  kontak: { title: "Kontak", desc: "Kelola WhatsApp, telepon, alamat, jam pelayanan, dan peta kantor." },
  pengaturan: { title: "Pengaturan Website", desc: "Kelola identitas situs, logo, favicon, footer, SEO, dan metadata." },
};

export default function AdminModuleEditor({ moduleKey }: Props) {
  const meta = labels[moduleKey] ?? { title: "Modul Admin", desc: "Kelola konten website." };
  const [items, setItems] = useState([
    { id: 1, title: `Contoh data ${meta.title}`, status: "Tampil", updated: "Baru saja" },
  ]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Tampil");

  const canAdd = useMemo(() => title.trim().length > 2, [title]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!canAdd) return;
    setItems((current) => [
      ...current,
      { id: Date.now(), title: title.trim(), status, updated: "Baru saja" },
    ]);
    setTitle("");
  }

  function remove(id: number) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <Link href="/admin">← Kembali ke Dashboard</Link>
        <span>Admin Kelurahan</span>
      </div>

      <header className={styles.hero}>
        <span>Manajemen Konten</span>
        <h1>{meta.title}</h1>
        <p>{meta.desc}</p>
      </header>

      <div className={styles.workspace}>
        <form onSubmit={submit} className={styles.form}>
          <div>
            <span>Data Baru</span>
            <h2>Tambah konten</h2>
          </div>

          <label>
            <span>Judul / Nama</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`Masukkan data ${meta.title.toLowerCase()}`} />
          </label>

          <label>
            <span>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Tampil</option>
              <option>Draft</option>
              <option>Disembunyikan</option>
            </select>
          </label>

          <label>
            <span>Keterangan</span>
            <textarea rows={5} placeholder="Tambahkan deskripsi atau informasi pendukung..." />
          </label>

          <label>
            <span>Upload Foto / File</span>
            <input type="file" />
          </label>

          <button disabled={!canAdd}>Simpan Data</button>

          <p className={styles.note}>
            Ini adalah UI admin siap integrasi. Hubungkan submit, edit, delete, upload, dan status ke Firestore/API proyek Anda.
          </p>
        </form>

        <section className={styles.list}>
          <div className={styles.listHead}>
            <div>
              <span>Konten Tersimpan</span>
              <h2>{meta.title}</h2>
            </div>
            <strong>{items.length} data</strong>
          </div>

          <div className={styles.rows}>
            {items.map((item) => (
              <article key={item.id}>
                <div>
                  <span>{item.status}</span>
                  <strong>{item.title}</strong>
                  <small>Diperbarui {item.updated}</small>
                </div>
                <div>
                  <button type="button">Edit</button>
                  <button type="button" className={styles.delete} onClick={() => remove(item.id)}>Hapus</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
