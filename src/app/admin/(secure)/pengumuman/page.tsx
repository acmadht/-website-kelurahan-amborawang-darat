import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="announcements"
      publicHref="/"
      title="Pengumuman"
      description="Kelola pengumuman publik. Tambahkan foto agar kartu Informasi Terkini di beranda memiliki gambar masing-masing."
      defaults={{
        title: "",
        summary: "",
        imageUrl: "",
        attachmentUrl: "",
        priority: "normal",
        validUntil: "",
        isActive: true,
        order: 1,
      }}
      displayFields={["title", "priority", "validUntil", "isActive"]}
      fields={[
        { key: "title", label: "Judul", type: "text", required: true, full: true },
        { key: "summary", label: "Isi Singkat", type: "textarea", required: true, full: true },
        { key: "imageUrl", label: "Foto Pengumuman", type: "image", full: true },
        { key: "attachmentUrl", label: "URL Lampiran", type: "text", full: true },
        { key: "priority", label: "Prioritas", type: "select", options: ["normal", "penting"] },
        { key: "validUntil", label: "Berlaku Sampai", type: "date" },
        { key: "order", label: "Urutan", type: "number" },
        { key: "isActive", label: "Status Aktif", type: "checkbox" },
      ]}
    />
  );
}
