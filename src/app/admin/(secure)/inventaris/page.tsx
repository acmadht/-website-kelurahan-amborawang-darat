import AdminCollectionManager from "@/components/admin/AdminCollectionManager";
import { AMBORAWANG_RT_OPTIONS } from "@/lib/rtSlots";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="inventory"
      publicHref="/inventaris"
      title="Inventaris Kelurahan"
      description="Kelola aset dan barang kelurahan sesuai sheet Inventaris. Inventaris terhubung dengan Data RT melalui field RT. Jika Lokasi sama persis dengan nama Fasilitas, RT inventaris dapat diisi otomatis mengikuti RT fasilitas tersebut."

      connectionNote="Isi RT lokasi aset, atau gunakan nama Fasilitas sebagai Lokasi. Jika nama lokasi cocok dengan data Fasilitas, sistem akan menyelaraskan RT inventaris otomatis dan menghitungnya pada Data RT."
      relatedLinks={[{ label: "Fasilitas", href: "/admin/fasilitas" }, { label: "Wilayah", href: "/admin/wilayah" }, { label: "Dokumen", href: "/admin/dokumen" }]}
      defaults={{ itemId: "", itemName: "", category: "", itemCode: "", quantity: 0, unit: "Unit", condition: "Baik", location: "", rt: "", acquisitionYear: "", fundingSource: "", personInCharge: "", note: "" }}
      fields={[
        { key: "itemId", label: "ID Barang", type: "text", required: true },
        { key: "itemName", label: "Nama Barang", type: "text", required: true },
        { key: "category", label: "Kategori", type: "text" },
        { key: "itemCode", label: "Kode Barang", type: "text" },
        { key: "quantity", label: "Jumlah", type: "number" },
        { key: "unit", label: "Satuan", type: "text" },
        { key: "condition", label: "Kondisi", type: "select", options: ["Baik", "Rusak Ringan", "Rusak Sedang", "Rusak Berat", "Hilang", "Dihapuskan"] },
        { key: "location", label: "Lokasi / Nama Fasilitas", type: "text" },
        { key: "rt", label: "RT Lokasi", type: "select", options: AMBORAWANG_RT_OPTIONS },
        { key: "acquisitionYear", label: "Tahun Perolehan", type: "text" },
        { key: "fundingSource", label: "Sumber Dana", type: "text" },
        { key: "personInCharge", label: "Penanggung Jawab", type: "text" },
        { key: "note", label: "Keterangan", type: "textarea", full: true },
      ]}
    />
  );
}
