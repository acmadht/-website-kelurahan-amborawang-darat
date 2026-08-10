import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="officials" publicHref="/pemerintahan"
      title="Pemerintahan & Lembaga"
      description="Kelola struktur pemerintahan lengkap. Untuk staf/pelaksana pilih kategori Staf lalu tentukan Unit / Bagian Penempatan agar tampil pada struktur yang benar."
      defaults={{
        name: "",
        title: "",
        category: "Pimpinan Kelurahan",
        unit: "",
        photoUrl: "",
        phone: "",
        description: "",
        parentId: "",
        termStart: "",
        termEnd: "",
        order: 1,
        isActive: true,
      }}
      displayFields={["name", "title", "category", "isActive"]}
      fields={[
        { key: "name", label: "Nama Lengkap", type: "text", required: true },
        { key: "title", label: "Jabatan", type: "text", required: true },
        {
          key: "category",
          label: "Kategori",
          type: "select",
          options: [
            "Pimpinan Kelurahan",
            "Sekretariat",
            "Seksi Pemerintahan",
            "Seksi Sosial",
            "Seksi Pembangunan",
            "Staf",
            "Kelurahan",
            "LPM",
            "TP PKK",
            "Karang Taruna",
            "Adat",
            "Linmas",
            "Bhabinkamtibmas",
            "Babinsa",
            "Mitra",
            "Lainnya",
          ],
        },
        {
          key: "unit",
          label: "Unit / Bagian Penempatan",
          type: "select",
          options: [
            "Sekretariat",
            "Seksi Pemerintahan",
            "Seksi Sosial",
            "Seksi Pembangunan",
          ],
        },
        { key: "photoUrl", label: "Foto", type: "image", full: true },
        { key: "phone", label: "Nomor Kontak", type: "text" },
        { key: "description", label: "Deskripsi / Keterangan", type: "textarea", full: true },
        { key: "termStart", label: "Awal Masa Jabatan", type: "date" },
        { key: "termEnd", label: "Akhir Masa Jabatan", type: "date" },
        { key: "order", label: "Urutan Tampil", type: "number" },
        { key: "isActive", label: "Tampilkan di Website", type: "checkbox" },
      ]}
    />
  );
}
