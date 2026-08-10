import type { Metadata } from "next";
import KknPage from "@/components/public/KknPage";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, getServerSettings } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/tim-kkn",
    title: `Tim KKN di Kelurahan ${settings.villageName}`,
    description: `Informasi Tim KKN Reguler yang melaksanakan program di Kelurahan ${settings.villageName}. Konten halaman ini bersifat statis dan terpisah dari pengelolaan konten kelurahan.`,
  });
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "Tim KKN", path: "/tim-kkn" }])} />
      <KknPage />
    </>
  );
}
