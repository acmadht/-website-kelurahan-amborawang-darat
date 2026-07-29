"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type QueryDocumentSnapshot,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { demoAlbums, demoPhotos } from "@/data/demo";
import { useCollectionData } from "@/hooks/useFirestoreData";
import { db } from "@/lib/firebase/client";
import type { GalleryAlbum, GalleryPhoto } from "@/types";
import PageHero from "./PageHero";
import PublicShell from "./PublicShell";

const PAGE_SIZE = 12;

function AlbumViewer({ album, onClose }: { album: GalleryAlbum; onClose: () => void }) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  async function loadMore(reset = false) {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);

    try {
      if (!db || !album.id) {
        const source = demoPhotos.filter((photo) => photo.albumId === album.id);
        const start = reset ? 0 : photos.length;
        const next = source.slice(start, start + PAGE_SIZE);
        setPhotos(reset ? next : [...photos, ...next]);
        setHasMore(start + next.length < source.length);
        return;
      }

      const constraints: QueryConstraint[] = [
        where("albumId", "==", album.id),
        orderBy("order", "asc"),
        limit(PAGE_SIZE),
      ];
      if (!reset && cursor) constraints.push(startAfter(cursor));

      const snapshot = await getDocs(query(collection(db, "galleryPhotos"), ...constraints));
      const next = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as GalleryPhoto[];
      setPhotos(reset ? next : [...photos, ...next]);
      setCursor(snapshot.docs.at(-1) ?? null);
      setHasMore(snapshot.size === PAGE_SIZE);
    } catch (error) {
      console.error("Gagal memuat foto album", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPhotos([]);
    setCursor(null);
    setHasMore(true);
    void loadMore(true);
    // Album baru selalu memulai halaman pertama.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [album.id]);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal" style={{ width: "min(1050px,100%)" }}>
        <div className="modal-header">
          <div>
            <span className="badge">{album.category}</span>
            <h2>{album.title}</h2>
            <p className="muted">{album.description}</p>
          </div>
          <button className="btn btn-outline btn-small" onClick={onClose}>Tutup</button>
        </div>

        <div className="grid grid-3">
          {photos.map((photo) => (
            <figure key={photo.id ?? photo.imageUrl} style={{ margin: 0 }}>
              <img
                className="card"
                src={photo.imageUrl}
                alt={photo.caption || album.title}
                loading="lazy"
                style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }}
              />
              <figcaption className="muted" style={{ marginTop: 7 }}>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>

        {!loading && photos.length === 0 ? <div className="empty-state">Belum ada foto pada album ini.</div> : null}
        {loading ? <div className="empty-state">Memuat foto...</div> : null}
        {hasMore && !loading ? <button className="btn btn-primary" style={{ marginTop: 22 }} onClick={() => void loadMore()}>Muat 12 Foto Berikutnya</button> : null}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { data: albums } = useCollectionData<GalleryAlbum>(
    "galleryAlbums",
    demoAlbums,
    [{ field: "status", op: "==", value: "published" }],
  );
  const published = albums.filter((item) => item.status === "published");
  const [category, setCategory] = useState("Semua");
  const [selected, setSelected] = useState<GalleryAlbum | null>(null);
  const categories = useMemo(() => ["Semua", ...Array.from(new Set(published.map((item) => item.category)))], [published]);
  const filtered = category === "Semua" ? published : published.filter((item) => item.category === category);

  return (
    <PublicShell>
      <PageHero eyebrow="Dokumentasi" title="Galeri kegiatan" description="Album foto kelurahan, RT, RW, masyarakat, dan kelompok KKN. Jumlah foto tidak dibatasi oleh kode." />
      <section className="section">
        <div className="container">
          <div className="filter-bar">
            {categories.map((item) => <button className={`filter-button ${item === category ? "active" : ""}`} onClick={() => setCategory(item)} key={item}>{item}</button>)}
          </div>
          <div className="gallery-grid">
            {filtered.map((album) => (
              <button type="button" className="gallery-card" style={{ border: 0, padding: 0, textAlign: "left" }} onClick={() => setSelected(album)} key={album.id ?? album.slug}>
                <img src={album.coverImageUrl || "/images/gallery-1.svg"} alt={album.title} loading="lazy" />
                <div className="gallery-overlay"><span className="badge">{album.category}</span><h3>{album.title}</h3><p>{album.photoCount} foto</p></div>
              </button>
            ))}
          </div>
          {filtered.length === 0 ? <div className="empty-state">Belum ada album pada kategori ini.</div> : null}
        </div>
      </section>
      {selected ? <AlbumViewer album={selected} onClose={() => setSelected(null)} /> : null}
    </PublicShell>
  );
}
