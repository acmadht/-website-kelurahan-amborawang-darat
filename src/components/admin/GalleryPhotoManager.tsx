"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { GalleryAlbum, GalleryPhoto } from "@/types";
import ImageUploader from "./ImageUploader";
import visualStyles from "./AdminVisualEditor.module.css";

function sortPhotos(items: GalleryPhoto[]) {
  return [...items].sort((a, b) => {
    const orderDiff = (Number(a.order) || 0) - (Number(b.order) || 0);
    if (orderDiff !== 0) return orderDiff;
    return String(a.caption || "").localeCompare(String(b.caption || ""), "id");
  });
}

export default function GalleryPhotoManager({ scope = "village" }: { scope?: "village" | "kkn" }) {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [albumId, setAlbumId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [savingPhotoId, setSavingPhotoId] = useState("");
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);

  async function loadAlbums() {
    if (!db) return;
    try {
      const snapshot = await getDocs(collection(db, "galleryAlbums"));
      const rows = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }) as GalleryAlbum)
        .filter((album) => scope === "kkn" ? String(album.category || "").toUpperCase() === "KKN" : String(album.category || "").toUpperCase() !== "KKN")
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      setAlbums(rows);

      if (albumId && !rows.some((album) => album.id === albumId)) {
        setAlbumId("");
        setPhotos([]);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal memuat album galeri.");
    }
  }

  async function loadPhotos(selectedAlbumId: string) {
    if (!db || !selectedAlbumId) {
      setPhotos([]);
      return;
    }

    setLoading(true);
    try {
      // Diurutkan di browser agar tidak membutuhkan composite index Firestore.
      const snapshot = await getDocs(
        query(
          collection(db, "galleryPhotos"),
          where("albumId", "==", selectedAlbumId),
        ),
      );
      setPhotos(
        sortPhotos(
          snapshot.docs.map(
            (item) => ({ id: item.id, ...item.data() }) as GalleryPhoto,
          ),
        ),
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal memuat foto album.");
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAlbums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  useEffect(() => {
    void loadPhotos(albumId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumId]);

  async function addMany(
    items: {
      url: string;
      publicId: string;
      width: number;
      height: number;
      bytes: number;
    }[],
  ) {
    if (!db || !albumId || !items.length) return;

    setStatus("");
    const album = albums.find((item) => item.id === albumId);
    const highestOrder = photos.reduce(
      (max, photo) => Math.max(max, Number(photo.order) || 0),
      0,
    );

    try {
      await Promise.all(
        items.map((item, index) =>
          addDoc(collection(db!, "galleryPhotos"), {
            albumId,
            imageUrl: item.url,
            publicId: item.publicId,
            caption: "",
            order: highestOrder + index + 1,
            width: item.width,
            height: item.height,
            fileSize: item.bytes,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }),
        ),
      );

      await updateDoc(doc(db, "galleryAlbums", albumId), {
        photoCount: photos.length + items.length,
        coverImageUrl: album?.coverImageUrl || items[0]?.url || "",
        updatedAt: serverTimestamp(),
      });

      setStatus(`${items.length} foto berhasil ditambahkan.`);
      await Promise.all([loadAlbums(), loadPhotos(albumId)]);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal menambahkan foto.");
    }
  }

  async function savePhoto(photo: GalleryPhoto) {
    if (!db || !photo.id) return;
    setSavingPhotoId(photo.id);
    setStatus("");

    try {
      await updateDoc(doc(db, "galleryPhotos", photo.id), {
        caption: String(photo.caption || "").trim(),
        order: Math.max(0, Number(photo.order) || 0),
        updatedAt: serverTimestamp(),
      });
      setStatus("Keterangan dan urutan foto berhasil disimpan.");
      await loadPhotos(albumId);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan keterangan foto.",
      );
    } finally {
      setSavingPhotoId("");
    }
  }

  async function remove(photo: GalleryPhoto) {
    if (
      !db ||
      !albumId ||
      !photo.id ||
      !confirm(
        "Hapus foto ini dari galeri? Aset Cloudinary tidak dihapus otomatis agar file yang masih digunakan tetap aman.",
      )
    ) {
      return;
    }

    setStatus("");

    try {
      await deleteDoc(doc(db, "galleryPhotos", photo.id));

      const album = albums.find((item) => item.id === albumId);
      const remaining = photos.filter((item) => item.id !== photo.id);
      const coverImageUrl =
        album?.coverImageUrl === photo.imageUrl
          ? remaining[0]?.imageUrl || ""
          : album?.coverImageUrl || remaining[0]?.imageUrl || "";

      await updateDoc(doc(db, "galleryAlbums", albumId), {
        photoCount: remaining.length,
        coverImageUrl,
        updatedAt: serverTimestamp(),
      });

      setStatus("Foto berhasil dihapus dari galeri.");
      await Promise.all([loadAlbums(), loadPhotos(albumId)]);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal menghapus foto.");
    }
  }

  return (
    <section className="admin-panel">
      <h2>Foto Album</h2>
      <p className="muted">
        Pilih album, unggah foto, lalu atur keterangan dan urutannya. Semua
        perubahan langsung terhubung ke {scope === "kkn" ? "Galeri KKN" : "galeri publik kelurahan"}.
      </p>

      {status ? (
        <div
          className={
            /berhasil|ditambahkan/i.test(status) ? "success-box" : "error-box"
          }
        >
          {status}
        </div>
      ) : null}

      <div className="form-group">
        <label>Pilih Album</label>
        <select
          className="form-control"
          value={albumId}
          onChange={(event) => {
            setAlbumId(event.target.value);
            setStatus("");
          }}
        >
          <option value="">Pilih album</option>
          {albums.map((album) => (
            <option value={album.id} key={album.id}>
              {album.title}
            </option>
          ))}
        </select>
      </div>

      {albumId ? (
        <div style={{ marginTop: 18 }}>
          <ImageUploader multiple folder="galeri" onMultiple={addMany} />

          {loading ? (
            <div className="empty-state">Memuat foto album...</div>
          ) : photos.length === 0 ? (
            <div className="empty-state" style={{ marginTop: 20 }}>
              Album ini belum memiliki foto.
            </div>
          ) : (
            <div className={visualStyles.visualGrid} style={{ marginTop: 20 }}>
              {photos.map((photo, index) => (
                <article className={visualStyles.visualCard} key={photo.id}>
                  <div className={visualStyles.cardMedia} style={{ aspectRatio: "4 / 3" }}>
                    <img src={photo.imageUrl} alt={photo.caption || "Foto galeri"} loading="lazy" />
                    <div className={visualStyles.cardMediaShade} />
                    <div className={visualStyles.cardMediaTitle}>
                      <small>Foto #{Number(photo.order) || index + 1}</small>
                      <strong>{photo.caption || "Belum ada keterangan"}</strong>
                    </div>
                  </div>
                  <div className={visualStyles.cardActions}>
                    <span className={visualStyles.actionLeft}>Urutan {Number(photo.order) || index + 1}</span>
                    <div className={visualStyles.actionButtons}>
                      <button className={visualStyles.editButton} type="button" onClick={() => setEditingPhoto({ ...photo })}>✎ Edit</button>
                      <button className={visualStyles.deleteButton} type="button" onClick={() => void remove(photo)}>Hapus</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {editingPhoto ? (
        <div className={visualStyles.modalBackdrop} role="dialog" aria-modal="true" aria-label="Edit foto galeri">
          <div className={visualStyles.modal} style={{ maxWidth: 620 }}>
            <div className={visualStyles.modalHeader}>
              <div>
                <span>Edit Foto</span>
                <h2>Keterangan dan Urutan</h2>
              </div>
              <button className={visualStyles.previewButton} type="button" onClick={() => setEditingPhoto(null)}>Tutup</button>
            </div>
            <div className={visualStyles.modalBody}>
              <img
                src={editingPhoto.imageUrl}
                alt={editingPhoto.caption || "Foto galeri"}
                style={{ width: "100%", maxHeight: 360, objectFit: "contain", borderRadius: 12, background: "#eef3f7" }}
              />
              <div className="form-group" style={{ marginTop: 16 }}>
                <label>Keterangan Foto</label>
                <input
                  className="form-control"
                  value={editingPhoto.caption || ""}
                  placeholder="Tulis keterangan foto"
                  onChange={(event) => setEditingPhoto({ ...editingPhoto, caption: event.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label>Urutan</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  value={Number(editingPhoto.order) || 0}
                  onChange={(event) => setEditingPhoto({ ...editingPhoto, order: Number(event.target.value) || 0 })}
                />
              </div>
            </div>
            <div className={visualStyles.modalFooter}>
              <button className={visualStyles.previewButton} type="button" onClick={() => setEditingPhoto(null)}>Batal</button>
              <button
                className={visualStyles.addButton}
                type="button"
                disabled={!editingPhoto.id || savingPhotoId === editingPhoto.id}
                onClick={async () => {
                  await savePhoto(editingPhoto);
                  setEditingPhoto(null);
                }}
              >
                {savingPhotoId === editingPhoto.id ? "Menyimpan…" : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
