import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="kknBookChapters"
      publicHref="/kkn/book-chapter"
      title="Book Chapter KKN"
      description="Kelola Book Chapter KKN, daftar penulis, abstrak, cover, identitas publikasi, dan tautan dokumen."
      defaults={{
        title: "",
        authors: [],
        abstract: "",
        coverImageUrl: "",
        isbn: "",
        doi: "",
        year: "2026",
        publisher: "",
        fileUrl: "",
        status: "draft",
        order: 1,
        isActive: true,
      }}
      displayFields={["title", "year", "publisher", "status", "isActive"]}
      fields={[
        { key: "title", label: "Judul Book Chapter", type: "text", required: true, full: true },
        { key: "authors", label: "Penulis · satu nama per baris", type: "list", required: true, full: true },
        { key: "abstract", label: "Abstrak / Ringkasan", type: "textarea", required: true, full: true },
        { key: "coverImageUrl", label: "Cover", type: "image", full: true },
        { key: "year", label: "Tahun", type: "text" },
        { key: "publisher", label: "Penerbit", type: "text" },
        { key: "isbn", label: "ISBN", type: "text" },
        { key: "doi", label: "DOI", type: "text" },
        { key: "fileUrl", label: "Link PDF / Dokumen", type: "text", placeholder: "https://...", full: true },
        { key: "status", label: "Status", type: "select", options: ["draft", "published"] },
        { key: "order", label: "Urutan", type: "number" },
        { key: "isActive", label: "Tampilkan di Website", type: "checkbox" },
      ]}
    />
  );
}
