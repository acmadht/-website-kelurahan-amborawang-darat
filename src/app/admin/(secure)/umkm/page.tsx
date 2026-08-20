import AdminCollectionManager from "@/components/admin/AdminCollectionManager";
import { AMBORAWANG_RT_OPTIONS } from "@/lib/rtSlots";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="umkm"
      publicHref="/umkm"
      title="UMKM & Potensi Usaha"
      description="Kelola direktori UMKM. Data ini sama dengan sheet UMKM dan Firestore."
      connectionNote="Pilih RT usaha. Jika NIK Pemilik cocok dengan Penduduk, RT UMKM akan mengikuti RT penduduk tersebut. Jumlah UMKM publik otomatis dihitung pada Data RT; NIK tetap internal dan tidak ditampilkan di publik."
      relatedLinks={[
        { label: "Data RT", href: "/admin/rt" },
        { label: "Wilayah", href: "/admin/wilayah" },
        { label: "Penduduk", href: "/admin/penduduk" },
      ]}
      defaults={{ name: "", ownerName: "", ownerNik: "", businessType: "", mainProduct: "", address: "", rt: "", phone: "", mapsUrl: "", imageUrl: "", isActive: true, isPublic: true, order: 1, note: "" }}
      displayFields={["name", "businessType", "rt", "isPublic"]}
      fields={[
        { key: "name", label: "Nama Usaha", type: "text", required: true },
        { key: "ownerName", label: "Nama Pemilik", type: "text" },
        { key: "ownerNik", label: "NIK Pemilik (Internal)", type: "text" },
        { key: "businessType", label: "Jenis Usaha", type: "text" },
        { key: "mainProduct", label: "Produk Utama", type: "text" },
        { key: "address", label: "Alamat", type: "textarea", full: true },
        { key: "rt", label: "RT", type: "select", options: AMBORAWANG_RT_OPTIONS },
        { key: "phone", label: "Kontak", type: "text" },
        { key: "mapsUrl", label: "Link Maps", type: "text", full: true },
        { key: "imageUrl", label: "Foto", type: "image", full: true },
        { key: "order", label: "Urutan", type: "number" },
        { key: "isActive", label: "Status Aktif", type: "checkbox" },
        { key: "isPublic", label: "Tampilkan di Website", type: "checkbox" },
        { key: "note", label: "Keterangan", type: "textarea", full: true },
      ]}
    />
  );
}
