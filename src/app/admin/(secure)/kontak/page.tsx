import AdminDocumentEditor from "@/components/admin/AdminDocumentEditor";
import { demoSettings } from "@/data/demo";

export default function Page() {
  return (
    <AdminDocumentEditor
      collectionName="siteSettings"
      documentId="main"
      title="Kontak & Jam Pelayanan"
      description="Kelola informasi yang digunakan pada halaman kontak, footer, tombol WhatsApp, dan lokasi kantor."
      defaults={demoSettings as unknown as Record<string, unknown>}
      fields={[
        { key: "address", label: "Alamat Kantor", type: "textarea", full: true },
        { key: "phone", label: "Telepon", type: "text" },
        { key: "whatsapp", label: "WhatsApp", type: "text" },
        { key: "email", label: "Email", type: "text", full: true },
        { key: "serviceHours", label: "Jam Pelayanan", type: "textarea", full: true },
        { key: "mapsEmbedUrl", label: "URL Embed Google Maps", type: "textarea", full: true },
        { key: "officeImageUrl", label: "Foto Kantor", type: "image", full: true },
        { key: "whatsappEnabled", label: "Tombol WhatsApp Aktif", type: "checkbox" },
      ]}
    />
  );
}
