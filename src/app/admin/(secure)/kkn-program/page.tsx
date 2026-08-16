import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="kknPrograms"
      publicHref="/kkn/program-kerja"
      title="Program Kerja KKN"
      description="Kelola seluruh program kerja KKN yang tampil pada ruang publik KKN."
      defaults={{
        code: "PROG",
        programType: "Program Utama",
        title: "",
        category: "Pengabdian Masyarakat",
        description: "",
        objective: "",
        target: "",
        startDate: "",
        endDate: "",
        schedule: "",
        personInCharge: "",
        status: "Berjalan",
        imageUrl: "",
        linkUrl: "",
        linkLabel: "",
        order: 1,
        isActive: true,
      }}
      displayFields={["programType", "code", "title", "category", "status", "isActive"]}
      fields={[
        { key: "programType", label: "Jenis Program", type: "select", required: true, options: ["Program Utama", "Program Pendukung"] },
        { key: "code", label: "Kode Program", type: "text", required: true },
        { key: "title", label: "Nama Program", type: "text", required: true, full: true },
        { key: "category", label: "Kategori", type: "text", required: true },
        { key: "status", label: "Status", type: "select", options: ["Rencana", "Berjalan", "Selesai", "Ditunda"] },
        { key: "description", label: "Deskripsi", type: "textarea", required: true, full: true },
        { key: "objective", label: "Tujuan", type: "textarea", full: true },
        { key: "target", label: "Sasaran", type: "text", full: true },
        { key: "startDate", label: "Tanggal Mulai", type: "date", required: true },
        { key: "endDate", label: "Tanggal Selesai (opsional jika 1 hari)", type: "date" },
        { key: "personInCharge", label: "Penanggung Jawab", type: "text" },
        { key: "linkUrl", label: "Tautan Detail (Opsional)", type: "text", placeholder: "Kosongkan jika tidak ada. Contoh: /berita/... atau https://...", full: true },
        { key: "linkLabel", label: "Teks Tombol (Opsional)", type: "text", placeholder: "Kosong = Lihat Detail" },
        { key: "order", label: "Urutan Tampil", type: "number" },
        { key: "isActive", label: "Tampilkan di Website", type: "checkbox" },
      ]}
    />
  );
}
