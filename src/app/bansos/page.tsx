import type { Metadata } from "next";
import PublicAdministrativeDataPage from "@/components/public/PublicAdministrativeDataPage";
import { buildMetadata, getServerCollection, getServerSettings } from "@/lib/seo";
import type { SocialAssistanceRecord } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({ settings, path: "/bansos", title: "Statistik Bantuan Sosial", description: `Ringkasan bantuan sosial Kelurahan ${settings.villageName} tanpa menampilkan identitas penerima.` });
}

export default async function Page() {
  const [settings, records] = await Promise.all([getServerSettings(), getServerCollection<SocialAssistanceRecord>("socialAssistance")]);
  return <PublicAdministrativeDataPage mode="bansos" settings={settings} records={records as unknown as Record<string, unknown>[]} />;
}
