import AdminCollectionManager from "@/components/admin/AdminCollectionManager";
import { AMBORAWANG_RT_OPTIONS } from "@/lib/rtSlots";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="populationMutations"
      publicHref="/mutasi"
      title="Mutasi Penduduk"
      description="Catat perpindahan dan perubahan status penduduk. Mutasi menjadi riwayat administrasi; setelah mencatat mutasi, perbarui data Penduduk terkait agar status domisili dan RT aktif tetap menjadi sumber statistik yang benar."

      connectionNote="Mutasi tetap menjadi riwayat dan tidak mengubah Penduduk otomatis. RT Asal/Tujuan dihitung sebagai catatan terkait pada Data RT. Setelah mutasi, perbarui Penduduk agar statistik warga aktif ikut berubah."
      relatedLinks={[{ label: "Penduduk", href: "/admin/penduduk" }, { label: "Data RT", href: "/admin/rt" }, { label: "Keluarga / KK", href: "/admin/keluarga" }]}
      defaults={{ mutationId: "", date: "", nik: "", name: "", mutationType: "", originRt: "", destinationRt: "", address: "", documentNumber: "", officer: "", note: "" }}
      fields={[
        { key: "mutationId", label: "ID Mutasi", type: "text", required: true },
        { key: "date", label: "Tanggal", type: "date", required: true },
        { key: "nik", label: "NIK", type: "text" },
        { key: "name", label: "Nama", type: "text" },
        { key: "mutationType", label: "Jenis Mutasi", type: "select", options: ["Pindah Masuk", "Pindah Keluar", "Pindah Antar RT", "Meninggal", "Lahir", "Perubahan Domisili", "Lainnya"] },
        { key: "originRt", label: "RT Asal", type: "select", options: AMBORAWANG_RT_OPTIONS },
        { key: "destinationRt", label: "RT Tujuan", type: "select", options: AMBORAWANG_RT_OPTIONS },
        { key: "address", label: "Alamat Asal / Tujuan", type: "textarea", full: true },
        { key: "documentNumber", label: "No. Dokumen", type: "text" },
        { key: "officer", label: "Petugas", type: "text" },
        { key: "note", label: "Keterangan", type: "textarea", full: true },
      ]}
    />
  );
}
