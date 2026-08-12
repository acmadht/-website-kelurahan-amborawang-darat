import type { Metadata } from "next";
import GalleryPage from "@/components/public/GalleryPage";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  buildMetadata,
  getServerSettings,
} from "@/lib/seo";

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
  const settings = await getServerSettings();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: "KKN", path: "/tim-kkn" },
          { name: "Galeri KKN", path: "/kkn/galeri" },
        ])}
      />
      <GalleryPage initialSettings={settings} scope="kkn" />
    </>
  );
}
