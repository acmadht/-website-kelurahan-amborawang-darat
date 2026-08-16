import type { Metadata } from "next";
import PublicAdministrativeDataPage from "@/components/public/PublicAdministrativeDataPage";
import { buildMetadata, getServerCollection, getServerSettings } from "@/lib/seo";
import type { PopulationMutationRecord } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({ settings, path: "/mutasi", title: "Statistik Mutasi Penduduk", description: `Ringkasan mutasi penduduk Kelurahan ${settings.villageName} tanpa menampilkan identitas pribadi.` });
}

export default async function Page() {
  const [settings, records] = await Promise.all([getServerSettings(), getServerCollection<PopulationMutationRecord>("populationMutations")]);
  return <PublicAdministrativeDataPage mode="mutasi" settings={settings} records={records as unknown as Record<string, unknown>[]} />;
}
