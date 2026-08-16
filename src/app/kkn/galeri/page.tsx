import type { Metadata } from "next";
import GalleryPage from "@/components/public/GalleryPage";
import JsonLd from "@/components/seo/JsonLd";
import type { GalleryAlbum, GalleryPhoto } from "@/types";
import {
  breadcrumbJsonLd,
  buildMetadata,
  getServerCollection,
  getServerSettings,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/kkn/galeri",
    title: `Galeri KKN ${settings.villageName}`,
    description: `Dokumentasi khusus kegiatan dan program kerja Tim KKN di Kelurahan ${settings.villageName}.`,
  });
}

export default async function Page() {
  const [settings, allAlbums, allPhotos] = await Promise.all([
    getServerSettings(),
    getServerCollection<GalleryAlbum>("galleryAlbums"),
    getServerCollection<GalleryPhoto>("galleryPhotos"),
  ]);
  const albums = allAlbums.filter((item) => String(item.category || "").toUpperCase() === "KKN");
  const albumIds = new Set(albums.map((item) => item.id).filter(Boolean));
  const photos = allPhotos.filter((item) => item.albumId && albumIds.has(item.albumId));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: "KKN", path: "/tim-kkn" },
          { name: "Galeri KKN", path: "/kkn/galeri" },
        ])}
      />
      <GalleryPage initialAlbums={albums} initialPhotos={photos} initialSettings={settings} scope="kkn" />
    </>
  );
}
