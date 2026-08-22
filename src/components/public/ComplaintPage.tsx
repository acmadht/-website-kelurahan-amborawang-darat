"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./PublicServicePortal.module.css";
import { readApiJson } from "@/lib/http-response";

const CATS = [
  "Administrasi",
  "Infrastruktur",
  "Kebersihan",
  "Keamanan",
  "Bansos",
  "Pelayanan Publik",
  "Lingkungan",
  "Lainnya",
];

const HISTORY_KEY = "amborawang_complaint_history_v1";
const MAX_HISTORY = 20;

type PublicStats = {
  total: number;
  newCount: number;
  inProgress: number;
  completed: number;
};

type ComplaintHistoryItem = {
  ticketId: string;
  createdAt: string;
  category: string;
};

function loadHistory(): ComplaintHistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is ComplaintHistoryItem =>
          Boolean(
            item &&
              typeof item.ticketId === "string" &&
              typeof item.createdAt === "string" &&
              typeof item.category === "string",
          ),
      )
      .slice(0, MAX_HISTORY);
  } catch {
    return [];
  }
}

function persistHistory(items: ComplaintHistoryItem[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  } catch {
    // Riwayat bersifat fitur tambahan. Pengaduan tetap berhasil walau browser
    // memblokir localStorage (misalnya pada mode privat tertentu).
  }
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function ComplaintPage({
  publicStats = { total: 0, newCount: 0, inProgress: 0, completed: 0 },
}: {
  publicStats?: PublicStats;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState("");
  const [history, setHistory] = useState<ComplaintHistoryItem[]>([]);
  const [copiedTicket, setCopiedTicket] = useState("");

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  function rememberTicket(item: ComplaintHistoryItem) {
    setHistory((current) => {
      const next = [
        item,
        ...current.filter((entry) => entry.ticketId !== item.ticketId),
      ].slice(0, MAX_HISTORY);

      persistHistory(next);
      return next;
    });
  }

  function clearHistory() {
    setHistory([]);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(HISTORY_KEY);
      } catch {
        // Abaikan jika browser memblokir localStorage.
      }
    }
  }

  async function copyTicket(ticketId: string) {
    try {
      await navigator.clipboard.writeText(ticketId);
      setCopiedTicket(ticketId);
      window.setTimeout(() => setCopiedTicket(""), 1600);
    } catch {
      setCopiedTicket("");
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTicket("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    const category = String(payload.category || "Lainnya");

    try {
      const res = await fetch("/api/pengaduan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await readApiJson<{ error?: string; ticketId?: string }>(res);

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim pengaduan.");
      }

      if (!data.ticketId) {
        throw new Error("Nomor pengaduan tidak diterima dari server.");
      }

      setTicket(data.ticketId);
      rememberTicket({
        ticketId: data.ticketId,
        createdAt: new Date().toISOString(),
        category,
      });
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim pengaduan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div>
            <span className={styles.eyebrow}>Pelayanan Masyarakat</span>
            <h1>Pengaduan Masyarakat</h1>
            <p>
              Sampaikan laporan atau keluhan terkait pelayanan dan lingkungan
              kelurahan. Setiap pengaduan menerima nomor tiket untuk pengecekan
              status.
            </p>
          </div>
          <div className={styles.heroCard}>
            <strong>Privasi pelapor</strong>
            <span>
              Nama, kontak, dan isi rinci pengaduan disimpan sebagai data internal
              dan tidak ditampilkan pada website publik.
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.card}>
            <h2>Form Pengaduan</h2>
            <p>
              Berikan informasi yang cukup agar petugas dapat memahami dan
              menindaklanjuti laporan.
            </p>

            <form className={styles.form} onSubmit={submit}>
              <input
                className={styles.honeypot}
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className={styles.field}>
                <label>Nama pelapor</label>
                <input name="name" required maxLength={120} />
              </div>

              <div className={styles.field}>
                <label>No. HP / WhatsApp</label>
                <input name="phone" required maxLength={40} />
              </div>

              <div className={styles.field}>
                <label>RT</label>
                <select name="rt" defaultValue="">
                  <option value="">Pilih RT (opsional)</option>
                  {Array.from({ length: 13 }, (_, index) =>
                    String(index + 1).padStart(2, "0"),
                  ).map((rt) => (
                    <option value={rt} key={rt}>
                      RT {rt}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Kategori</label>
                <select name="category" required defaultValue="">
                  <option value="" disabled>
                    Pilih kategori
                  </option>
                  {CATS.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div className={`${styles.field} ${styles.full}`}>
                <label>Lokasi kejadian</label>
                <input name="location" maxLength={240} />
              </div>

              <div className={`${styles.field} ${styles.full}`}>
                <label>Isi pengaduan</label>
                <textarea name="message" required maxLength={3000} />
              </div>

              <div className={`${styles.actions} ${styles.full}`}>
                <button className={styles.button} disabled={loading}>
                  {loading ? "Mengirim..." : "Kirim Pengaduan"}
                </button>
                <Link
                  className={`${styles.button} ${styles.secondary}`}
                  href="/cek-pengaduan"
                >
                  Cek Status
                </Link>
                <a
                  className={`${styles.button} ${styles.secondary}`}
                  href="#riwayat-pengaduan"
                >
                  Riwayat Nomor
                </a>
              </div>
            </form>

            {error && <div className={`${styles.notice} ${styles.error}`}>{error}</div>}

            {ticket && (
              <div className={styles.ticket}>
                <span>Nomor pengaduan Anda</span>
                <strong>{ticket}</strong>
                <div className={styles.ticketActions}>
                  <button
                    type="button"
                    className={styles.ticketActionButton}
                    onClick={() => copyTicket(ticket)}
                  >
                    {copiedTicket === ticket ? "Tersalin" : "Salin Nomor"}
                  </button>
                  <Link
                    className={styles.ticketActionButton}
                    href={`/cek-pengaduan?id=${encodeURIComponent(ticket)}`}
                  >
                    Cek Status
                  </Link>
                </div>
              </div>
            )}

            <section id="riwayat-pengaduan" className={styles.historySection}>
              <div className={styles.historyHeader}>
                <div>
                  <h3>Riwayat Nomor Pengaduan</h3>
                  <p>
                    Nomor tiket yang dikirim dari perangkat ini disimpan otomatis
                    agar tidak mudah hilang.
                  </p>
                </div>
                {history.length > 0 && (
                  <button
                    type="button"
                    className={styles.historyClearButton}
                    onClick={clearHistory}
                  >
                    Hapus Riwayat
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className={styles.historyEmpty}>
                  Belum ada riwayat nomor pengaduan pada perangkat ini.
                </div>
              ) : (
                <div className={styles.historyList}>
                  {history.map((item) => (
                    <div className={styles.historyItem} key={item.ticketId}>
                      <div className={styles.historyMain}>
                        <strong>{item.ticketId}</strong>
                        <span>
                          {item.category} • {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <div className={styles.historyActions}>
                        <button
                          type="button"
                          className={styles.historyButton}
                          onClick={() => copyTicket(item.ticketId)}
                        >
                          {copiedTicket === item.ticketId ? "Tersalin" : "Salin"}
                        </button>
                        <Link
                          className={styles.historyButton}
                          href={`/cek-pengaduan?id=${encodeURIComponent(item.ticketId)}`}
                        >
                          Cek Status
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.historyPrivacy}>
                Riwayat ini hanya disimpan di browser/perangkat yang digunakan dan
                tidak menampilkan nama, nomor HP, lokasi, atau isi pengaduan.
              </div>
            </section>
          </div>

          <aside className={styles.card}>
            <h2>Informasi</h2>
            {publicStats.total > 0 ? (
              <div className={styles.statusBox}>
                <div className={styles.statusRow}>
                  <span>Pengaduan masuk statistik publik</span>
                  <strong>{publicStats.total}</strong>
                </div>
                <div className={styles.statusRow}>
                  <span>Baru</span>
                  <strong>{publicStats.newCount}</strong>
                </div>
                <div className={styles.statusRow}>
                  <span>Diproses</span>
                  <strong>{publicStats.inProgress}</strong>
                </div>
                <div className={styles.statusRow}>
                  <span>Selesai</span>
                  <strong>{publicStats.completed}</strong>
                </div>
              </div>
            ) : null}

            <div className={styles.sideList}>
              <div className={styles.sideItem}>
                <strong>Gunakan informasi faktual</strong>
                <span>Sertakan lokasi dan penjelasan yang dapat diverifikasi.</span>
              </div>
              <div className={styles.sideItem}>
                <strong>Nomor tiket tersimpan otomatis</strong>
                <span>
                  Riwayat nomor tiket dapat dilihat kembali pada perangkat yang sama.
                </span>
              </div>
              <div className={styles.sideItem}>
                <strong>Status diproses petugas</strong>
                <span>Alur umum: Baru, Diproses, Selesai, atau Ditolak.</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
