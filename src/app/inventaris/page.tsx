import type { Metadata } from "next";
import PublicAdministrativeDataPage from "@/components/public/PublicAdministrativeDataPage";
import { buildMetadata, getServerCollection, getServerSettings } from "@/lib/seo";
import type { InventoryRecord } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({ settings, path: "/inventaris", title: "Inventaris Kelurahan", description: `Ringkasan aset dan inventaris Kelurahan ${settings.villageName}.` });
}

export default async function Page() {
  const [settings, records] = await Promise.all([getServerSettings(), getServerCollection<InventoryRecord>("inventory")]);
  return <PublicAdministrativeDataPage mode="inventaris" settings={settings} records={records as unknown as Record<string, unknown>[]} />;
}
