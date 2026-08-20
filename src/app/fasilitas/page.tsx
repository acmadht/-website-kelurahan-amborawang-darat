import type { Metadata } from "next";
import PublicDirectoryPage from "@/components/public/PublicDirectoryPage";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, getServerCollection, getServerSettings } from "@/lib/seo";
import { normalizeRtNumber } from "@/lib/rtSlots";
import type { FacilityItem } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{ rt?: string | string[] }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({ settings, path: "/fasilitas", title: `Fasilitas Kelurahan ${settings.villageName}`, description: `Daftar fasilitas dan sarana prasarana Kelurahan ${settings.villageName}.` });
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const scopeRt = normalizeRtNumber(Array.isArray(params.rt) ? params.rt[0] : params.rt);
  const [settings, facilities] = await Promise.all([getServerSettings(), getServerCollection<FacilityItem>("facilities")]);
  const publicFacilities = facilities.map(({ note: _note, ...item }) => item);
  return <><JsonLd data={breadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "Fasilitas", path: "/fasilitas" }])} /><PublicDirectoryPage mode="facilities" initialSettings={settings} initialFacilities={publicFacilities} scopeRt={scopeRt} /></>;
}
