import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="posts" publicHref="/berita"
      title="Berita"
      description="Tulis dan publikasikan berita lengkap dengan tanggal, waktu, penulis, foto utama, dan isi artikel."
      defaults={{
        title: "",
        slug: "",
        summary: "",
        content: "",
        coverImageUrl: "",
        category: "Pelayanan",
        authorName: "",
        publishedDate: "",
        publishedTime: "",
        status: "draft",
        isFeatured: false,
        order: 1,
      }}
      displayFields={["title", "category", "publishedDate", "publishedTime", "status"]}
      lockedField="category"
      lockedValues={["KKN"]}
      fields={[
        { key: "title", label: "Judul", type: "text", required: true, full: true },
        { key: "slug", label: "Slug, boleh kosong agar otomatis", type: "text", full: true },
        { key: "summary", label: "Ringkasan", type: "textarea", required: true, full: true },
        { key: "content", label: "Isi Berita", type: "textarea", required: true, full: true },
        { key: "coverImageUrl", label: "Gambar Utama", type: "image", required: true, full: true },
        { key: "category", label: "Kategori", type: "select", options: ["Pelayanan", "Pemerintahan", "Lingkungan", "Masyarakat", "Pembangunan", "Informasi"] },
        { key: "authorName", label: "Nama Penulis", type: "text" },
        { key: "publishedDate", label: "Tanggal Publikasi", type: "date" },
        { key: "publishedTime", label: "Waktu Publikasi (WITA)", type: "text", placeholder: "09.15 WITA" },
        { key: "status", label: "Status", type: "select", options: ["draft", "published", "archived"] },
        { key: "isFeatured", label: "Berita Unggulan", type: "checkbox" },
        { key: "order", label: "Urutan", type: "number" },
      ]}
    />
  );
}
