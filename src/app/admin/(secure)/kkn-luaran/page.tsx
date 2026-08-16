import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="kknOutputs"
      publicHref="/kkn/luaran"
      title="Luaran KKN"
      description="Kelola website, modul, video, poster, laporan, infografis, dan luaran KKN lainnya."
      defaults={{
        code: "OUT",
        type: "Luaran Digital",
        title: "",
        description: "",
        imageUrl: "",
        href: "",
        linkLabel: "Lihat Luaran",
        order: 1,
        isActive: true,
      }}
      displayFields={["code", "type", "title", "isActive"]}
      fields={[
        { key: "code", label: "Kode", type: "text", required: true },
        { key: "type", label: "Jenis Luaran", type: "text", required: true },
        { key: "title", label: "Nama Luaran", type: "text", required: true, full: true },
        { key: "description", label: "Deskripsi", type: "textarea", required: true, full: true },
        { key: "href", label: "Tautan Luaran", type: "text", placeholder: "/... atau https://...", full: true },
        { key: "linkLabel", label: "Teks Tombol", type: "text" },
        { key: "order", label: "Urutan", type: "number" },
        { key: "isActive", label: "Tampilkan di Website", type: "checkbox" },
      ]}
    />
  );
}
