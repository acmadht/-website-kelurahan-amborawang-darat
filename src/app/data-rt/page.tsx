import type { Metadata } from "next";
import RtPage from "@/components/public/RtPage";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  buildMetadata,
  getServerCollection,
  getServerSettings,
} from "@/lib/seo";
import { normalizeRtNumber } from "@/lib/rtSlots";
import type { RegionLeader } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{ rt?: string | string[] }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/data-rt",
    title: `Data RT Kelurahan ${settings.villageName}`,
    description: `Data RT Kelurahan ${settings.villageName} yang memuat informasi ketua RT, jumlah warga, kepala keluarga, fasilitas, dan keterangan wilayah sesuai data kelurahan.`,
  });
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedRt = normalizeRtNumber(Array.isArray(params.rt) ? params.rt[0] : params.rt);
  const [settings, rts] = await Promise.all([
    getServerSettings(),
    getServerCollection<RegionLeader>("rts"),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "Data RT", path: "/data-rt" }])} />
      <RtPage initialSettings={settings} initialRts={rts} initialSelectedRt={selectedRt} />
    </>
  );
}
