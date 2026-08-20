import AdminCollectionManager from "@/components/admin/AdminCollectionManager";
import { AMBORAWANG_RT_OPTIONS } from "@/lib/rtSlots";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="facilities"
      publicHref="/fasilitas"
      title="Fasilitas & Sarana Prasarana"
      description="Kelola fasilitas publik dan sarana prasarana. Data ini sama dengan sheet Fasilitas dan Firestore."
      connectionNote="RT pada Fasilitas menjadi sumber otomatis daftar Fasilitas di Data RT. Jika nama Lokasi Inventaris sama dengan nama Fasilitas, RT Inventaris juga dapat mengikuti RT fasilitas tersebut."
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
        { key: "rt", label: "RT", type: "select", options: AMBORAWANG_RT_OPTIONS },
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
