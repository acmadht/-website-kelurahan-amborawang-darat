import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="posts"
      publicHref="/kkn/berita"
      title="Berita KKN"
      description="Kelola berita, aktivitas, dan dokumentasi program KKN. Berita KKN dipisahkan dari berita resmi kelurahan."
      fixedValues={{ category: "KKN" }}
      filterField="category"
      filterValue="KKN"
      filterMode="include"
      defaults={{
        title: "",
        slug: "",
        summary: "",
        content: "",
        coverImageUrl: "",
        category: "KKN",
        authorName: "Tim KKN",
        publishedDate: "",
        publishedTime: "",
        status: "draft",
        isFeatured: false,
        order: 1,
      }}
      displayFields={["title", "publishedDate", "authorName", "status"]}
      fields={[
        { key: "title", label: "Judul", type: "text", required: true, full: true },
        { key: "slug", label: "Slug, boleh kosong agar otomatis", type: "text", full: true },
        { key: "summary", label: "Ringkasan", type: "textarea", required: true, full: true },
        { key: "content", label: "Isi Berita", type: "textarea", required: true, full: true },
        { key: "coverImageUrl", label: "Gambar Utama", type: "image", required: true, full: true },
        { key: "authorName", label: "Nama Penulis", type: "text" },
        { key: "publishedDate", label: "Tanggal Publikasi", type: "date" },
        { key: "publishedTime", label: "Waktu Publikasi (WITA)", type: "text", placeholder: "09.15 WITA" },
        { key: "status", label: "Status", type: "select", options: ["draft", "published", "archived"] },
        { key: "isFeatured", label: "Berita Unggulan KKN", type: "checkbox" },
        { key: "order", label: "Urutan", type: "number" },
      ]}
    />
  );
}
