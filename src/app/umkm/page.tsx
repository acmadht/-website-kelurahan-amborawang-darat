import type { Metadata } from "next";
import PublicDirectoryPage from "@/components/public/PublicDirectoryPage";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, getServerCollection, getServerSettings } from "@/lib/seo";
import type { UmkmItem } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({ settings, path: "/umkm", title: `UMKM Kelurahan ${settings.villageName}`, description: `Direktori UMKM dan potensi usaha masyarakat Kelurahan ${settings.villageName}.` });
}

export default async function Page() {
  const [settings, umkm] = await Promise.all([getServerSettings(), getServerCollection<UmkmItem>("umkm")]);
  return <><JsonLd data={breadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "UMKM", path: "/umkm" }])} /><PublicDirectoryPage mode="umkm" initialSettings={settings} initialUmkm={umkm} /></>;
}
