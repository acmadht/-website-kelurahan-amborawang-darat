"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { GalleryAlbum, GalleryPhoto } from "@/types";
import ImageUploader from "./ImageUploader";

export default function GalleryPhotoManager() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [albumId, setAlbumId] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadAlbums() {
    if (!db) return;
    const snapshot = await getDocs(collection(db, "galleryAlbums"));
    setAlbums((snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as GalleryAlbum[]).filter((album) => album.category !== "KKN"));
  }

  async function loadPhotos(selectedAlbumId: string) {
    if (!db || !selectedAlbumId) {
      setPhotos([]);
      return;
    }
    setLoading(true);
    try {
      const snapshot = await getDocs(query(
        collection(db, "galleryPhotos"),
        where("albumId", "==", selectedAlbumId),
        orderBy("order", "asc"),
      ));
      setPhotos(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as GalleryPhoto[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadAlbums(); }, []);
  useEffect(() => { void loadPhotos(albumId); }, [albumId]);

  async function addMany(items: { url: string; publicId: string; width: number; height: number; bytes: number }[]) {
    if (!db || !albumId) return;
    const album = albums.find((item) => item.id === albumId);
    const currentCount = Math.max(Number(album?.photoCount) || 0, photos.length);

    await Promise.all(items.map((item, index) => addDoc(collection(db!, "galleryPhotos"), {
      albumId,
      imageUrl: item.url,
      publicId: item.publicId,
      caption: "",
      order: currentCount + index + 1,
      width: item.width,
      height: item.height,
      fileSize: item.bytes,
      createdAt: serverTimestamp(),
    })));

    await updateDoc(doc(db, "galleryAlbums", albumId), {
      photoCount: currentCount + items.length,
      coverImageUrl: album?.coverImageUrl || items[0]?.url || "",
      updatedAt: serverTimestamp(),
    });
    await Promise.all([loadAlbums(), loadPhotos(albumId)]);
  }

  async function remove(photo: GalleryPhoto) {
    if (!db || !photo.id || !confirm("Hapus data foto ini? Aset Cloudinary tidak dihapus otomatis agar file yang masih digunakan tetap aman.")) return;
    await deleteDoc(doc(db, "galleryPhotos", photo.id));
    const album = albums.find((item) => item.id === albumId);
    await updateDoc(doc(db, "galleryAlbums", albumId), {
      photoCount: Math.max(0, (Number(album?.photoCount) || photos.length) - 1),
      updatedAt: serverTimestamp(),
    });
    await Promise.all([loadAlbums(), loadPhotos(albumId)]);
  }

  return (
    <section className="admin-panel">
      <h2>Upload Foto Album</h2>
      <p className="muted">Jumlah foto tidak dibatasi oleh kode. Website publik mengambil 12 foto per halaman agar tetap cepat.</p>
      <div className="form-group">
        <label>Pilih Album</label>
        <select className="form-control" value={albumId} onChange={(event) => setAlbumId(event.target.value)}>
          <option value="">Pilih album</option>
          {albums.map((album) => <option value={album.id} key={album.id}>{album.title}</option>)}
        </select>
      </div>

      {albumId ? (
        <div style={{ marginTop: 18 }}>
          <ImageUploader multiple folder="galeri" onMultiple={addMany} />
          {loading ? <div className="empty-state">Memuat foto album...</div> : null}
          <div className="grid grid-4" style={{ marginTop: 20 }}>
            {photos.map((photo) => (
              <div className="card card-pad" key={photo.id}>
                <img src={photo.imageUrl} alt={photo.caption || "Foto galeri"} loading="lazy" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 10 }} />
                <button className="btn btn-danger btn-small" style={{ marginTop: 12 }} onClick={() => void remove(photo)}>Hapus Data</button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
