import type { Metadata } from "next";
import RegionPage from "@/components/public/RegionPage";
import JsonLd from "@/components/seo/JsonLd";
import { regionContentFallback, type RegionContent } from "@/data/siteContent";
import {
  breadcrumbJsonLd,
  buildMetadata,
  getServerCollection,
  getServerDocument,
  getServerSettings,
} from "@/lib/seo";
import type { RegionLeader } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/wilayah",
    title: `Wilayah Kelurahan ${settings.villageName}`,
    description: `Informasi wilayah Kelurahan ${settings.villageName}, Kecamatan ${settings.subdistrictName}, meliputi luas wilayah, batas administratif, kondisi geografis, konektivitas, dan peta.`,
  });
}

export default async function Page() {
  const [settings, region, rts] = await Promise.all([
    getServerSettings(),
    getServerDocument<RegionContent>("pages", "wilayah", regionContentFallback),
    getServerCollection<RegionLeader>("rts"),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "Wilayah", path: "/wilayah" }])} />
      <RegionPage initialSettings={settings} initialRegion={region} initialRts={rts} />
    </>
  );
}
