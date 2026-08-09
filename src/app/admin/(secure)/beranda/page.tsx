import AdminDocumentEditor from "@/components/admin/AdminDocumentEditor";

export default function Page() {
  return (
    <AdminDocumentEditor
      collectionName="pages"
      documentId="home"
      title="Beranda"
      description="Kelola sambutan dan teks ringkas pada beranda. Hero/banner tetap dikelola melalui menu Hero Banner."
      defaults={{
        welcomeEyebrow: "Sambutan Lurah",
        welcomeTitle: "Pelayanan yang mudah, terbuka, dan dekat dengan masyarakat",
        welcomeText: "Selamat datang di Website Resmi Kelurahan Amborawang Darat. Website ini kami hadirkan sebagai pusat informasi layanan, pemerintahan, pembangunan, dan kegiatan masyarakat yang dapat diakses dengan mudah.",
        welcomeSecondText: "Kami mengajak seluruh warga untuk memanfaatkan layanan yang tersedia, menyampaikan aspirasi secara bertanggung jawab, dan ikut mendukung pembangunan kelurahan yang tertib, transparan, serta berkelanjutan.",
        complaintText: "Sampaikan aspirasi melalui halaman kontak atau WhatsApp kelurahan",
      }}
      fields={[
        { key: "welcomeEyebrow", label: "Label Sambutan", type: "text", full: true },
        { key: "welcomeTitle", label: "Judul Sambutan", type: "text", full: true },
        { key: "welcomeText", label: "Paragraf Sambutan", type: "textarea", full: true },
        { key: "welcomeSecondText", label: "Paragraf Tambahan", type: "textarea", full: true },
        { key: "complaintText", label: "Teks Pengaduan/Aspirasi", type: "textarea", full: true },
      ]}
    />
  );
}
