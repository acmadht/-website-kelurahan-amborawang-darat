import type { Metadata } from "next";
import ServicesPage from "@/components/public/ServicesPage";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  buildMetadata,
  getServerCollection,
  getServerSettings,
} from "@/lib/seo";
import type { ServiceItem } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/layanan",
    title: `Layanan Kelurahan ${settings.villageName}`,
    description: `Informasi layanan administrasi dan pelayanan masyarakat Kelurahan ${settings.villageName}, termasuk persyaratan, prosedur, durasi, biaya, dan kontak pelayanan.`,
  });
}

export default async function Page() {
  const [settings, services] = await Promise.all([
    getServerSettings(),
    getServerCollection<ServiceItem>("services"),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "Layanan", path: "/layanan" }])} />
      <ServicesPage initialSettings={settings} initialServices={services} />
    </>
  );
}
