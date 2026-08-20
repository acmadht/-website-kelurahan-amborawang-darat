import type { Metadata } from "next";
import PublicAdministrativeDataPage from "@/components/public/PublicAdministrativeDataPage";
import { buildMetadata, getServerCollection, getServerSettings } from "@/lib/seo";
import { normalizeRtNumber } from "@/lib/rtSlots";
import type { RegionLeader, ResidentRecord } from "@/types";

// Statistik administrasi harus selalu membaca kondisi Firestore terbaru.
export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{ rt?: string | string[] }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({ settings, path: "/penduduk", title: "Statistik Penduduk", description: `Statistik agregat penduduk Kelurahan ${settings.villageName} tanpa menampilkan identitas pribadi.` });
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const scopeRt = normalizeRtNumber(Array.isArray(params.rt) ? params.rt[0] : params.rt);
  const [settings, records, rts] = await Promise.all([
    getServerSettings(),
    getServerCollection<ResidentRecord>("residents"),
    getServerCollection<RegionLeader>("rts"),
  ]);

  return (
    <PublicAdministrativeDataPage
      mode="penduduk"
      settings={settings}
      records={records as unknown as Record<string, unknown>[]}
      linkedData={{ rts: rts as unknown as Record<string, unknown>[] }}
      scopeRt={scopeRt}
    />
  );
}
