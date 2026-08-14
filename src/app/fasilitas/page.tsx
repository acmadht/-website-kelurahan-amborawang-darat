import type { Metadata } from "next";
import PublicDirectoryPage from "@/components/public/PublicDirectoryPage";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, getServerCollection, getServerSettings } from "@/lib/seo";
import type { FacilityItem } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({ settings, path: "/fasilitas", title: `Fasilitas Kelurahan ${settings.villageName}`, description: `Daftar fasilitas dan sarana prasarana Kelurahan ${settings.villageName}.` });
}

export default async function Page() {
  const [settings, facilities] = await Promise.all([getServerSettings(), getServerCollection<FacilityItem>("facilities")]);
  return <><JsonLd data={breadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "Fasilitas", path: "/fasilitas" }])} /><PublicDirectoryPage mode="facilities" initialSettings={settings} initialFacilities={facilities} /></>;
}
