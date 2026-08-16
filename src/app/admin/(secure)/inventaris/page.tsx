import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="inventory"
      publicHref="/inventaris"
      title="Inventaris Kelurahan"
      description="Kelola aset dan barang kelurahan sesuai sheet Inventaris. Inventaris terhubung secara informasi dengan Fasilitas dan Wilayah melalui lokasi aset, tetapi tetap menjadi pencatatan aset tersendiri."

      connectionNote="Inventaris tidak digabung otomatis dengan Fasilitas karena satu aset belum tentu merupakan fasilitas publik. Gunakan Lokasi untuk mengaitkan aset dengan kantor atau fasilitas yang relevan."
      relatedLinks={[{ label: "Fasilitas", href: "/admin/fasilitas" }, { label: "Wilayah", href: "/admin/wilayah" }, { label: "Dokumen", href: "/admin/dokumen" }]}
      defaults={{ itemId: "", itemName: "", category: "", itemCode: "", quantity: 0, unit: "Unit", condition: "Baik", location: "", acquisitionYear: "", fundingSource: "", personInCharge: "", note: "" }}
      fields={[
        { key: "itemId", label: "ID Barang", type: "text", required: true },
        { key: "itemName", label: "Nama Barang", type: "text", required: true },
        { key: "category", label: "Kategori", type: "text" },
        { key: "itemCode", label: "Kode Barang", type: "text" },
        { key: "quantity", label: "Jumlah", type: "number" },
        { key: "unit", label: "Satuan", type: "text" },
        { key: "condition", label: "Kondisi", type: "select", options: ["Baik", "Rusak Ringan", "Rusak Sedang", "Rusak Berat", "Hilang", "Dihapuskan"] },
        { key: "location", label: "Lokasi", type: "text" },
        { key: "acquisitionYear", label: "Tahun Perolehan", type: "text" },
        { key: "fundingSource", label: "Sumber Dana", type: "text" },
        { key: "personInCharge", label: "Penanggung Jawab", type: "text" },
        { key: "note", label: "Keterangan", type: "textarea", full: true },
      ]}
    />
  );
}
