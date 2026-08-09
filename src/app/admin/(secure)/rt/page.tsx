import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="rts"
      title="Data 13 RT"
      description="Kelola RT 01 sampai RT 13, ketua RT, foto, kontak, dan informasi wilayah. Tidak menggunakan struktur RW."
      defaults={{
        number: "",
        chairmanName: "",
        photoUrl: "",
        phone: "",
        description: "",
        populationCount: 0,
        familyCount: 0,
        order: 1,
        isActive: true,
      }}
      displayFields={["number", "chairmanName", "populationCount", "isActive"]}
      fields={[
        { key: "number", label: "Nomor RT", type: "text", required: true, placeholder: "01" },
        { key: "chairmanName", label: "Nama Ketua RT", type: "text", required: true },
        { key: "photoUrl", label: "Foto Ketua RT", type: "image", full: true },
        { key: "phone", label: "Kontak", type: "text" },
        { key: "description", label: "Keterangan Wilayah", type: "textarea", full: true },
        { key: "populationCount", label: "Jumlah Penduduk", type: "number" },
        { key: "familyCount", label: "Jumlah Kepala Keluarga", type: "number" },
        { key: "order", label: "Urutan", type: "number" },
        { key: "isActive", label: "Tampilkan di Website", type: "checkbox" },
      ]}
    />
  );
}
