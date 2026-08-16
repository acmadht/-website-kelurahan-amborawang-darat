"use client";

import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAdminAuth } from "./AuthProvider";
import styles from "./AdminVisualEditor.module.css";

const CORE_COLLECTIONS = [
  "siteSettings",
  "pages",
  "heroSlides",
  "officials",
  "rts",
  "services",
  "posts",
  "announcements",
  "agendas",
  "galleryAlbums",
  "galleryPhotos",
  "documents",
  "publicDocuments",
  "umkm",
  "facilities",
  "villageStats",
  "residents",
  "families",
  "populationMutations",
  "socialAssistance",
  "inventory",
  "serviceRequests",
  "complaints",
  "messages",
  "activityLogs",
] as const;

function serialize(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(serialize);
  if (typeof value === "object") {
    const maybeTimestamp = value as { toDate?: () => Date; seconds?: number; nanoseconds?: number };
    if (typeof maybeTimestamp.toDate === "function") {
      try {
        return { __type: "timestamp", iso: maybeTimestamp.toDate().toISOString() };
      } catch {
        return null;
      }
    }
    if (typeof maybeTimestamp.seconds === "number") {
      return {
        __type: "timestamp",
        iso: new Date(maybeTimestamp.seconds * 1000).toISOString(),
        seconds: maybeTimestamp.seconds,
        nanoseconds: maybeTimestamp.nanoseconds ?? 0,
      };
    }
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, serialize(item)]));
  }
  return value;
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function AdminBackupManager() {
  const { profile } = useAdminAuth();
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  if (profile?.role !== "superadmin") {
    return (
      <div className="error-box">
        Backup penuh hanya tersedia untuk Super Admin karena file dapat berisi data administrasi yang bersifat pribadi.
      </div>
    );
  }

  async function createBackup() {
    if (!db || running) return;
    setRunning(true);
    setStatus("");
    setError("");

    try {
      const collections: Record<string, unknown[]> = {};
      const counts: Record<string, number> = {};

      for (const collectionName of CORE_COLLECTIONS) {
        const snapshot = await getDocs(collection(db, collectionName));
        collections[collectionName] = snapshot.docs.map((item) => ({
          id: item.id,
          ...serialize(item.data()) as Record<string, unknown>,
        }));
        counts[collectionName] = snapshot.size;
      }

      const usersSnapshot = await getDocs(collection(db, "users"));
      collections.users = usersSnapshot.docs.map((item) => ({
        id: item.id,
        ...serialize(item.data()) as Record<string, unknown>,
      }));
      counts.users = usersSnapshot.size;

      const now = new Date();
      const backup = {
        format: "amborawang-darat-firestore-backup-v1",
        createdAt: now.toISOString(),
        note: "Backup data Firestore. Tidak berisi kata sandi Firebase Authentication atau file gambar fisik.",
        counts,
        collections,
      };

      const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Makassar" }).format(now);
      downloadJson(`backup-amborawang-darat-${date}.json`, backup);
      const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
      setStatus(`Backup berhasil dibuat: ${total} dokumen dari ${Object.keys(counts).length} koleksi.`);
    } catch (backupError) {
      setError(backupError instanceof Error ? backupError.message : "Backup gagal dibuat.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <>
      <div className="admin-title">
        <h1>Backup & Export Data</h1>
        <p>
          Unduh cadangan data Firestore untuk keperluan arsip internal. Export CSV per modul tersedia langsung pada halaman Penduduk, Keluarga/KK, Mutasi, Bansos, Inventaris, dan Data RT.
        </p>
      </div>

      <div className={styles.connectionBar}>
        <div>
          <strong>Backup penuh khusus Super Admin</strong>
          <span>
            File JSON dapat memuat NIK, No. KK, data bansos, permohonan surat, pengaduan, pesan, dan data internal lainnya. Simpan file di lokasi yang aman dan jangan unggah ke halaman publik.
          </span>
        </div>
      </div>

      {status ? <div className="success-box" style={{ marginTop: 14 }}>{status}</div> : null}
      {error ? <div className="error-box" style={{ marginTop: 14 }}>{error}</div> : null}

      <section className={styles.previewShell} style={{ marginTop: 18 }}>
        <div className={styles.previewTopbar}>
          <div className={styles.previewTopbarCopy}>
            <strong>Cadangan Firestore</strong>
            <span>Backup mencakup konten website dan administrasi inti, tetapi tidak mencakup password pengguna atau file gambar yang tersimpan di layanan upload.</span>
          </div>
          <div className={styles.previewActions}>
            <button type="button" className={styles.addButton} onClick={() => void createBackup()} disabled={running}>
              {running ? "Membuat backup…" : "⇩ Unduh Backup JSON"}
            </button>
          </div>
        </div>

        <div className={styles.collectionCanvas}>
          <div className={styles.emptyState} style={{ minHeight: 220 }}>
            <strong>Export cepat tersedia di masing-masing modul</strong>
            <span>
              Gunakan tombol “Export CSV” di Penduduk, Keluarga/KK, Mutasi Penduduk, Bansos, Inventaris, atau Data RT untuk membuka data langsung di Excel.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
