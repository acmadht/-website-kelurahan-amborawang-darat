import type { Metadata } from "next";
import GalleryPage from "@/components/public/GalleryPage";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  buildMetadata,
  getServerCollection,
  getServerSettings,
} from "@/lib/seo";
import type { GalleryAlbum, GalleryPhoto } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/galeri",
    title: `Galeri Kelurahan ${settings.villageName}`,
    description: `Dokumentasi foto kegiatan pemerintahan, pelayanan, pembangunan, dan masyarakat Kelurahan ${settings.villageName}.`,
  });
}

export default async function Page() {
  const [settings, albums, photos] = await Promise.all([
    getServerSettings(),
    getServerCollection<GalleryAlbum>("galleryAlbums"),
    getServerCollection<GalleryPhoto>("galleryPhotos"),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "Galeri", path: "/galeri" }])} />
      <GalleryPage initialSettings={settings} initialAlbums={albums} initialPhotos={photos} />
    </>
  );
}
