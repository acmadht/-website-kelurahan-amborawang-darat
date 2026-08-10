import type { Metadata } from "next";
import GovernmentPage from "@/components/public/GovernmentPage";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  buildMetadata,
  getServerCollection,
  getServerSettings,
} from "@/lib/seo";
import type { Official, RegionLeader } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/pemerintahan",
    title: `Pemerintahan Kelurahan ${settings.villageName}`,
    description: `Struktur pemerintahan dan aparatur Kelurahan ${settings.villageName}, Kecamatan ${settings.subdistrictName}, termasuk pimpinan, sekretariat, seksi, staf, lembaga, dan ketua RT.`,
  });
}

export default async function Page() {
  const [settings, officials, rts] = await Promise.all([
    getServerSettings(),
    getServerCollection<Official>("officials"),
    getServerCollection<RegionLeader>("rts"),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "Pemerintahan", path: "/pemerintahan" }])} />
      <GovernmentPage initialSettings={settings} initialOfficials={officials} initialRts={rts} />
    </>
  );
}
