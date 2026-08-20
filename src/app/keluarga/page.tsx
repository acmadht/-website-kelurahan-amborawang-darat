import type { Metadata } from "next";
import PublicAdministrativeDataPage from "@/components/public/PublicAdministrativeDataPage";
import { buildMetadata, getServerCollection, getServerSettings } from "@/lib/seo";
import { normalizeRtNumber } from "@/lib/rtSlots";
import type { FamilyRecord, RegionLeader, ResidentRecord } from "@/types";

// Statistik administrasi harus selalu membaca kondisi Firestore terbaru.
export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{ rt?: string | string[] }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({ settings, path: "/keluarga", title: "Statistik Keluarga / KK", description: `Statistik agregat keluarga Kelurahan ${settings.villageName} tanpa menampilkan nomor KK atau alamat keluarga.` });
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const scopeRt = normalizeRtNumber(Array.isArray(params.rt) ? params.rt[0] : params.rt);
  const [settings, records, residents, rts] = await Promise.all([
    getServerSettings(),
    getServerCollection<FamilyRecord>("families"),
    getServerCollection<ResidentRecord>("residents"),
    getServerCollection<RegionLeader>("rts"),
  ]);

  return (
    <PublicAdministrativeDataPage
      mode="keluarga"
      settings={settings}
      records={records as unknown as Record<string, unknown>[]}
      linkedData={{
        residents: residents as unknown as Record<string, unknown>[],
        rts: rts as unknown as Record<string, unknown>[],
      }}
      scopeRt={scopeRt}
    />
  );
}
