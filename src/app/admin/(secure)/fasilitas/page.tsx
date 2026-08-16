import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="facilities"
      publicHref="/fasilitas"
      title="Fasilitas & Sarana Prasarana"
      description="Kelola fasilitas publik dan sarana prasarana. Data ini sama dengan sheet Fasilitas dan Firestore."
      connectionNote="Fasilitas adalah direktori sarana publik. Jika ada aset/barang kelurahan yang berada pada fasilitas tersebut, catat asetnya di Inventaris dengan Lokasi yang sesuai."
      relatedLinks={[
        { label: "Inventaris", href: "/admin/inventaris" },
        { label: "Wilayah", href: "/admin/wilayah" },
        { label: "Data RT", href: "/admin/rt" },
      ]}
      defaults={{ category: "", name: "", address: "", rt: "", mapsUrl: "", condition: "Baik", manager: "", status: "Aktif", imageUrl: "", isPublic: true, order: 1, note: "" }}
      displayFields={["name", "category", "rt", "status"]}
      fields={[
        { key: "category", label: "Kategori", type: "text" },
        { key: "name", label: "Nama Fasilitas", type: "text", required: true },
        { key: "address", label: "Alamat", type: "textarea", full: true },
        { key: "rt", label: "RT", type: "text" },
        { key: "mapsUrl", label: "Link Maps / Koordinat", type: "text", full: true },
        { key: "condition", label: "Kondisi", type: "select", options: ["Baik", "Rusak Ringan", "Rusak Sedang", "Rusak Berat"] },
        { key: "manager", label: "Pengelola", type: "text" },
        { key: "status", label: "Status", type: "text" },
        { key: "imageUrl", label: "Foto", type: "image", full: true },
        { key: "order", label: "Urutan", type: "number" },
        { key: "isPublic", label: "Tampilkan di Website", type: "checkbox" },
        { key: "note", label: "Keterangan", type: "textarea", full: true },
      ]}
    />
  );
}
