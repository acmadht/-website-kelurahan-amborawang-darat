import type { Metadata } from "next";
import PublicAdministrativeDataPage from "@/components/public/PublicAdministrativeDataPage";
import { buildMetadata, getServerCollection, getServerSettings } from "@/lib/seo";
import { normalizeRtNumber } from "@/lib/rtSlots";
import type { InventoryRecord } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{ rt?: string | string[] }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({ settings, path: "/inventaris", title: "Inventaris Kelurahan", description: `Ringkasan aset dan inventaris Kelurahan ${settings.villageName}.` });
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const scopeRt = normalizeRtNumber(Array.isArray(params.rt) ? params.rt[0] : params.rt);
  const [settings, records] = await Promise.all([getServerSettings(), getServerCollection<InventoryRecord>("inventory")]);
  return <PublicAdministrativeDataPage mode="inventaris" settings={settings} records={records as unknown as Record<string, unknown>[]} scopeRt={scopeRt} />;
}
