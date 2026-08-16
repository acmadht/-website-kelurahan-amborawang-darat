import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="populationMutations"
      publicHref="/mutasi"
      title="Mutasi Penduduk"
      description="Catat perpindahan dan perubahan status penduduk. Mutasi menjadi riwayat administrasi; setelah mencatat mutasi, perbarui data Penduduk terkait agar status domisili dan RT aktif tetap menjadi sumber statistik yang benar."

      connectionNote="Mutasi berfungsi sebagai riwayat. Untuk Pindah Masuk/Keluar, Antar RT, atau Meninggal, lanjutkan ke Penduduk untuk memperbarui status domisili, RT, dan tanggal masuk/keluar."
      relatedLinks={[{ label: "Penduduk", href: "/admin/penduduk" }, { label: "Data RT", href: "/admin/rt" }, { label: "Keluarga / KK", href: "/admin/keluarga" }]}
      defaults={{ mutationId: "", date: "", nik: "", name: "", mutationType: "", originRt: "", destinationRt: "", address: "", documentNumber: "", officer: "", note: "" }}
      fields={[
        { key: "mutationId", label: "ID Mutasi", type: "text", required: true },
        { key: "date", label: "Tanggal", type: "date", required: true },
        { key: "nik", label: "NIK", type: "text" },
        { key: "name", label: "Nama", type: "text" },
        { key: "mutationType", label: "Jenis Mutasi", type: "select", options: ["Pindah Masuk", "Pindah Keluar", "Pindah Antar RT", "Meninggal", "Lahir", "Perubahan Domisili", "Lainnya"] },
        { key: "originRt", label: "RT Asal", type: "text" },
        { key: "destinationRt", label: "RT Tujuan", type: "text" },
        { key: "address", label: "Alamat Asal / Tujuan", type: "textarea", full: true },
        { key: "documentNumber", label: "No. Dokumen", type: "text" },
        { key: "officer", label: "Petugas", type: "text" },
        { key: "note", label: "Keterangan", type: "textarea", full: true },
      ]}
    />
  );
}
