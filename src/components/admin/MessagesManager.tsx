"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

type MessageItem = {
  id: string;
  name?: string;
  contact?: string;
  subject?: string;
  message?: string;
  status?: string;
  source?: string;
  createdAt?: unknown;
};

function formatCreatedAt(value: unknown) {
  if (!value) return "-";
  try {
    if (typeof value === "object" && value && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function") {
      return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format((value as { toDate: () => Date }).toDate());
    }
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? "-" : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date);
  } catch {
    return "-";
  }
}


function createdAtMillis(value: unknown) {
  if (!value) return 0;
  try {
    if (typeof value === "object" && value !== null) {
      const candidate = value as { toDate?: () => Date; seconds?: number };
      if (typeof candidate.toDate === "function") return candidate.toDate().getTime();
      if (typeof candidate.seconds === "number") return candidate.seconds * 1000;
    }
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  } catch {
    return 0;
  }
}

export default function MessagesManager() {
  const [items, setItems] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "messages"),
      (snapshot) => {
        const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as MessageItem[];
        rows.sort((a, b) => createdAtMillis(b.createdAt) - createdAtMillis(a.createdAt));
        setItems(rows);
        setLoading(false);
      },
      (error) => {
        setStatus(error.message || "Gagal memuat pesan.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  async function mark(item: MessageItem, nextStatus: "dibaca" | "selesai") {
    if (!db) return;
    await updateDoc(doc(db, "messages", item.id), { status: nextStatus, updatedAt: serverTimestamp() });
  }

  async function remove(item: MessageItem) {
    if (!db || !confirm("Hapus pesan ini?")) return;
    await deleteDoc(doc(db, "messages", item.id));
  }

  return (
    <>
      <div className="admin-title">
        <h1>Pesan Masuk</h1>
        <p>Pesan dari formulir kontak website tampil otomatis di sini.</p>
      </div>

      {status ? <div className="error-box">{status}</div> : null}

      <section className="admin-panel">
        <div className="admin-toolbar">
          <div>
            <strong>{items.length} pesan</strong>
            <div className="muted">Form publik dan dashboard membaca koleksi Firestore yang sama.</div>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Memuat pesan...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">Belum ada pesan dari masyarakat.</div>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Nama</th>
                  <th>Kontak</th>
                  <th>Subjek</th>
                  <th>Pesan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{formatCreatedAt(item.createdAt)}</td>
                    <td>{item.name || "-"}</td>
                    <td>{item.contact || "-"}</td>
                    <td>{item.subject || "Pesan masyarakat"}</td>
                    <td>{item.message || "-"}</td>
                    <td>{item.status || "baru"}</td>
                    <td>
                      <div className="flex gap-8">
                        <button className="btn btn-outline btn-small" onClick={() => void mark(item, "dibaca")}>Dibaca</button>
                        <button className="btn btn-outline btn-small" onClick={() => void mark(item, "selesai")}>Selesai</button>
                        <button className="btn btn-danger btn-small" onClick={() => void remove(item)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
