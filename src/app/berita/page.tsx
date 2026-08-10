import type { Metadata } from "next";
import NewsPage from "@/components/public/NewsPage";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  buildMetadata,
  getDynamicPublishedPostsServer,
  getServerSettings,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/berita",
    title: `Berita Kelurahan ${settings.villageName}`,
    description: `Berita, pengumuman kegiatan, dan informasi terbaru dari Kelurahan ${settings.villageName}, Kecamatan ${settings.subdistrictName}.`,
  });
}

export default async function Page() {
  const [settings, initialPosts] = await Promise.all([getServerSettings(), getDynamicPublishedPostsServer()]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "Berita", path: "/berita" }])} />
      <NewsPage initialPosts={initialPosts} initialSettings={settings} />
    </>
  );
}
