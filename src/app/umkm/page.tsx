import type { Metadata } from "next";
import PublicDirectoryPage from "@/components/public/PublicDirectoryPage";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, getServerCollection, getServerSettings } from "@/lib/seo";
import { normalizeRtNumber } from "@/lib/rtSlots";
import type { UmkmItem } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{ rt?: string | string[] }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({ settings, path: "/umkm", title: `UMKM Kelurahan ${settings.villageName}`, description: `Direktori UMKM dan potensi usaha masyarakat Kelurahan ${settings.villageName}.` });
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const scopeRt = normalizeRtNumber(Array.isArray(params.rt) ? params.rt[0] : params.rt);
  const [settings, umkm] = await Promise.all([getServerSettings(), getServerCollection<UmkmItem>("umkm")]);
  const publicUmkm = umkm.map(({ ownerNik: _ownerNik, note: _note, ...item }) => item);
  return <><JsonLd data={breadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "UMKM", path: "/umkm" }])} /><PublicDirectoryPage mode="umkm" initialSettings={settings} initialUmkm={publicUmkm} scopeRt={scopeRt} /></>;
}
