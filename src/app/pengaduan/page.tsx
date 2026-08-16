import type { Metadata } from "next";
import ComplaintPage from "@/components/public/ComplaintPage";
import { buildMetadata, getServerCollection, getServerSettings } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({ settings, path: "/pengaduan", title: "Pengaduan Masyarakat", description: `Sampaikan pengaduan kepada Kelurahan ${settings.villageName} dan pantau tindak lanjutnya.` });
}

export default async function Page() {
  const complaints = await getServerCollection<Record<string, unknown>>("complaints");
  const publicRows = complaints.filter((item) => item.showInPublicStats === true);
  const stats = {
    total: publicRows.length,
    newCount: publicRows.filter((item) => String(item.status || "").toLowerCase() === "baru").length,
    inProgress: publicRows.filter((item) => String(item.status || "").toLowerCase() === "diproses").length,
    completed: publicRows.filter((item) => String(item.status || "").toLowerCase() === "selesai").length,
  };
  return <ComplaintPage publicStats={stats} />;
}
