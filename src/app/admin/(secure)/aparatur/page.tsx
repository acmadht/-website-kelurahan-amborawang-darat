import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="officials" publicHref="/pemerintahan"
      title="Pemerintahan & Lembaga"
      description="Kelola lurah, sekretaris, kepala seksi, staf, LPM, PKK, Karang Taruna, unsur adat, Linmas, Bhabinkamtibmas, Babinsa, dan mitra kelurahan."
      defaults={{
        name: "",
        title: "",
        category: "Kelurahan",
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
            "Kelurahan",
            "Staf",
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
        { key: "photoUrl", label: "Foto", type: "image", full: true },
        { key: "phone", label: "Nomor Kontak", type: "text" },
        { key: "parentId", label: "ID Induk Struktur, opsional", type: "text" },
        { key: "description", label: "Deskripsi / Keterangan", type: "textarea", full: true },
        { key: "termStart", label: "Awal Masa Jabatan", type: "date" },
        { key: "termEnd", label: "Akhir Masa Jabatan", type: "date" },
        { key: "order", label: "Urutan Tampil", type: "number" },
        { key: "isActive", label: "Tampilkan di Website", type: "checkbox" },
      ]}
    />
  );
}
