import type { Metadata } from "next";
import DocumentsPage from "@/components/public/DocumentsPage";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  buildMetadata,
  getServerCollection,
  getServerSettings,
} from "@/lib/seo";
import type { PublicDocument } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/dokumen",
    title: `Dokumen Publik Kelurahan ${settings.villageName}`,
    description: `Akses dokumen, formulir, arsip, dan informasi publik yang tersedia dari Kelurahan ${settings.villageName}.`,
  });
}

export default async function Page() {
  const [settings, documents] = await Promise.all([
    getServerSettings(),
    getServerCollection<PublicDocument>("documents"),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "Dokumen", path: "/dokumen" }])} />
      <DocumentsPage initialSettings={settings} initialDocuments={documents} />
    </>
  );
}
