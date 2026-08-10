import AdminDocumentEditor from "@/components/admin/AdminDocumentEditor";
import { homeContentFallback } from "@/data/siteContent";

export default function Page() {
  return (
    <AdminDocumentEditor
      collectionName="pages"
      documentId="home"
      title="Beranda"
      description="Ubah teks utama beranda. Banner, layanan, berita, pengumuman, dan agenda mengambil data langsung dari menu masing-masing."
      publicHref="/"
      defaults={homeContentFallback as unknown as Record<string, unknown>}
      fields={[
        { key: "portalStatus", label: "Label Status Portal", type: "text", full: true },
        { key: "heroEyebrow", label: "Label Kecil Hero", type: "text", full: true },
        { key: "welcomeEyebrow", label: "Label Sambutan / Profil Singkat", type: "text", full: true },
        { key: "welcomeTitle", label: "Judul Sambutan", type: "text", full: true },
        { key: "welcomeText", label: "Paragraf Sambutan", type: "textarea", full: true },
        { key: "welcomeSecondText", label: "Paragraf Pendukung", type: "textarea", full: true },
        { key: "complaintText", label: "Teks Aspirasi / Pengaduan", type: "textarea", full: true },
        { key: "servicesEyebrow", label: "Label Bagian Layanan", type: "text" },
        { key: "servicesTitle", label: "Judul Bagian Layanan", type: "text", full: true },
        { key: "infoEyebrow", label: "Label Informasi Terkini", type: "text" },
        { key: "infoTitle", label: "Judul Informasi Terkini", type: "text", full: true },
        { key: "ctaKicker", label: "Label Panel Bantuan", type: "text" },
        { key: "ctaTitle", label: "Judul Panel Bantuan", type: "text", full: true },
        { key: "ctaText", label: "Deskripsi Panel Bantuan", type: "textarea", full: true },
      ]}
    />
  );
}
