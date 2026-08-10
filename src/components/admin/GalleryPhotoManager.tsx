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

function sortPhotos(items: GalleryPhoto[]) {
  return [...items].sort((a, b) => {
    const orderDiff = (Number(a.order) || 0) - (Number(b.order) || 0);
    if (orderDiff !== 0) return orderDiff;
    return String(a.caption || "").localeCompare(String(b.caption || ""), "id");
  });
}

export default function GalleryPhotoManager() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [albumId, setAlbumId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [savingPhotoId, setSavingPhotoId] = useState("");

  async function loadAlbums() {
    if (!db) return;
    try {
      const snapshot = await getDocs(collection(db, "galleryAlbums"));
      const rows = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }) as GalleryAlbum)
        .filter((album) => album.category !== "KKN")
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
  }, []);

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

  function updateLocalPhoto(id: string, patch: Partial<GalleryPhoto>) {
    setPhotos((current) =>
      current.map((photo) => (photo.id === id ? { ...photo, ...patch } : photo)),
    );
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
        perubahan langsung terhubung ke galeri publik. Konten KKN tetap dikunci.
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
            <div className="grid grid-4" style={{ marginTop: 20 }}>
              {photos.map((photo) => (
                <div className="card card-pad" key={photo.id}>
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || "Foto galeri"}
                    loading="lazy"
                    style={{
                      width: "100%",
                      aspectRatio: "4/3",
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />

                  <div className="form-group" style={{ marginTop: 12 }}>
                    <label>Keterangan Foto</label>
                    <input
                      className="form-control"
                      value={photo.caption || ""}
                      placeholder="Tulis keterangan foto"
                      onChange={(event) =>
                        photo.id &&
                        updateLocalPhoto(photo.id, {
                          caption: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Urutan</label>
                    <input
                      className="form-control"
                      type="number"
                      min="0"
                      value={Number(photo.order) || 0}
                      onChange={(event) =>
                        photo.id &&
                        updateLocalPhoto(photo.id, {
                          order: Number(event.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="flex gap-8" style={{ marginTop: 12 }}>
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => void savePhoto(photo)}
                      disabled={!photo.id || savingPhotoId === photo.id}
                    >
                      {savingPhotoId === photo.id ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => void remove(photo)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
