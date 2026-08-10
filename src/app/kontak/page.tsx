import type { Metadata } from "next";
import ContactPage from "@/components/public/ContactPage";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, getServerSettings, organizationJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/kontak",
    title: `Kontak Kelurahan ${settings.villageName}`,
    description: `Alamat kantor, nomor telepon, WhatsApp, jam pelayanan, dan lokasi Kelurahan ${settings.villageName}, Kecamatan ${settings.subdistrictName}.`,
  });
}

export default async function Page() {
  const settings = await getServerSettings();
  return (
    <>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "Kontak", path: "/kontak" }]),
        organizationJsonLd(settings),
      ]} />
      <ContactPage initialSettings={settings} />
    </>
  );
}
