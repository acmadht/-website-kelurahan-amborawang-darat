"use client";

import { useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  staticKknBookChapters,
  staticKknGalleryItems,
  staticKknMembers,
  staticKknOutputs,
  staticKknPosts,
  staticKknPrograms,
  staticKknTeam,
} from "@/data/kknStatic";
import { slugify } from "@/lib/utils";

function safeId(prefix: string, value: string, index: number) {
  const normalized = slugify(value) || String(index + 1);
  return `${prefix}-${normalized}`;
}

export default function KknLegacyImport() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function importLegacy() {
    if (!db || busy) return;
    const accepted = window.confirm(
      "Impor data KKN lama dari source ke Firestore? Data dengan ID yang sama akan diperbarui, sedangkan data KKN lain tetap aman.",
    );
    if (!accepted) return;

    setBusy(true);
    setMessage("");

    try {
      const now = serverTimestamp();
      const tasks: Promise<unknown>[] = [];

      tasks.push(
        setDoc(doc(db, "kknTeam", "main"), { ...staticKknTeam, updatedAt: now }, { merge: true }),
      );

      staticKknMembers.forEach((item, index) => {
        tasks.push(
          setDoc(
            doc(db!, "kknMembers", safeId("member", item.name, index)),
            { ...item, updatedAt: now },
            { merge: true },
          ),
        );
      });

      staticKknPrograms.forEach((item, index) => {
        tasks.push(
          setDoc(
            doc(db!, "kknPrograms", safeId("program", item.code || item.title, index)),
            { ...item, updatedAt: now },
            { merge: true },
          ),
        );
      });

      staticKknPosts.forEach((item, index) => {
        const id = item.id || safeId("kkn-post", item.slug || item.title, index);
        tasks.push(
          setDoc(
            doc(db!, "posts", id),
            { ...item, category: "KKN", updatedAt: now },
            { merge: true },
          ),
        );
      });

      const legacyAlbumId = "kkn-dokumentasi-lama";
      if (staticKknGalleryItems.length) {
        tasks.push(
          setDoc(
            doc(db, "galleryAlbums", legacyAlbumId),
            {
              title: "Dokumentasi KKN",
              slug: "dokumentasi-kkn",
              category: "KKN",
              description: "Dokumentasi kegiatan KKN yang sebelumnya tersimpan pada source website.",
              coverImageUrl: staticKknGalleryItems[0]?.image || "",
              location: staticKknTeam.location,
              eventDate: "2026-08-06",
              photoCount: staticKknGalleryItems.length,
              isFeatured: true,
              status: "published",
              order: 1,
              updatedAt: now,
            },
            { merge: true },
          ),
        );

        staticKknGalleryItems.forEach((item, index) => {
          tasks.push(
            setDoc(
              doc(db!, "galleryPhotos", safeId("kkn-photo", item.id || item.title, index)),
              {
                albumId: legacyAlbumId,
                imageUrl: item.image,
                publicId: "",
                caption: item.caption || item.title,
                order: index + 1,
                updatedAt: now,
              },
              { merge: true },
            ),
          );
        });
      }

      staticKknBookChapters.forEach((item, index) => {
        tasks.push(
          setDoc(
            doc(db!, "kknBookChapters", safeId("book", item.title, index)),
            { ...item, updatedAt: now },
            { merge: true },
          ),
        );
      });

      staticKknOutputs.forEach((item, index) => {
        tasks.push(
          setDoc(
            doc(db!, "kknOutputs", safeId("output", item.code || item.title, index)),
            { ...item, updatedAt: now },
            { merge: true },
          ),
        );
      });

      await Promise.all(tasks);
      setMessage(`Data KKN lama berhasil diimpor (${tasks.length} dokumen diperbarui). Sekarang seluruhnya bisa diedit dari Admin.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mengimpor data KKN lama.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-panel" style={{ marginBottom: 18 }}>
      <h2>Aktifkan Pengelolaan KKN</h2>
      <p className="muted">
        Jika halaman publik masih memakai data KKN lama dari source, klik tombol ini sekali untuk menyalinnya ke Firestore. Setelah itu data dapat diubah dari menu KKN di Admin.
      </p>
      <button className="btn btn-primary" type="button" onClick={() => void importLegacy()} disabled={busy}>
        {busy ? "Mengimpor data KKN…" : "Impor Data KKN Lama ke Admin"}
      </button>
      {message ? (
        <div className={/berhasil/i.test(message) ? "success-box" : "error-box"} style={{ marginTop: 12 }}>
          {message}
        </div>
      ) : null}
    </section>
  );
}
