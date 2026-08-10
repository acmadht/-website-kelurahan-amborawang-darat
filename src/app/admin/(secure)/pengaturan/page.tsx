import AdminDocumentEditor from "@/components/admin/AdminDocumentEditor";
import { demoSettings } from "@/data/demo";

export default function Page() {
  return (
    <AdminDocumentEditor
      collectionName="siteSettings"
      documentId="main" publicHref="/"
      title="Pengaturan Website"
      description="Kelola identitas website, logo, favicon, sosial media, footer, SEO, dan perilaku tampilan."
      defaults={{ ...(demoSettings as unknown as Record<string, unknown>), faviconUrl: "/icon.png" }}
      fields={[
        { key: "siteName", label: "Nama Website", type: "text", required: true },
        { key: "villageName", label: "Nama Kelurahan", type: "text", required: true },
        { key: "subdistrictName", label: "Nama Kecamatan", type: "text" },
        { key: "regencyName", label: "Nama Kabupaten / Kota", type: "text" },
        { key: "provinceName", label: "Nama Provinsi", type: "text" },
        { key: "tagline", label: "Slogan", type: "text", full: true },
        { key: "logoUrl", label: "Logo", type: "image", full: true },
        { key: "faviconUrl", label: "Favicon / Ikon Browser", type: "image", full: true },
        { key: "instagramUrl", label: "Instagram", type: "text" },
        { key: "facebookUrl", label: "Facebook", type: "text" },
        { key: "youtubeUrl", label: "YouTube", type: "text" },
        { key: "footerText", label: "Teks Footer", type: "text", full: true },
        { key: "seoTitle", label: "Judul SEO", type: "text", full: true },
        { key: "seoDescription", label: "Deskripsi SEO", type: "textarea", full: true },
        { key: "animationEnabled", label: "Animasi Aktif", type: "checkbox" },
        { key: "heroAutoplay", label: "Slider Otomatis", type: "checkbox" },
        { key: "heroInterval", label: "Interval Slider (ms)", type: "number" },
      ]}
    />
  );
}
