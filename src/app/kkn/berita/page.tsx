import type { Metadata } from "next";
import NewsPage from "@/components/public/NewsPage";
import JsonLd from "@/components/seo/JsonLd";
import { staticKknPosts } from "@/data/kknStatic";
import {
  breadcrumbJsonLd,
  buildMetadata,
  getServerSettings,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/kkn/berita",
    title: `Berita KKN ${settings.villageName}`,
    description: `Berita, aktivitas, program kerja, dan perkembangan kegiatan Tim KKN Reguler di Kelurahan ${settings.villageName}.`,
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
          { name: "Berita KKN", path: "/kkn/berita" },
        ])}
      />
      <NewsPage
        initialPosts={staticKknPosts}
        initialSettings={settings}
        scope="kkn"
      />
    </>
  );
}
