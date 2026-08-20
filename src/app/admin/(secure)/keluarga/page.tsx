import AdminCollectionManager from "@/components/admin/AdminCollectionManager";
import { AMBORAWANG_RT_OPTIONS } from "@/lib/rtSlots";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="families"
      publicHref="/keluarga"
      title="Administrasi Keluarga / KK"
      description="Kelola data keluarga sesuai sheet Keluarga. No. KK menghubungkan data keluarga dengan Penduduk; jumlah anggota dapat diselaraskan dari data Penduduk dan jumlah KK per RT ikut memperbarui ringkasan wilayah."

      connectionNote="No. KK menjadi penghubung utama. Jumlah anggota dan RT Keluarga mengikuti Penduduk aktif dengan No. KK yang sama; hasilnya otomatis mengisi jumlah KK pada Data RT dan menjadi referensi RT Bansos."
      relatedLinks={[{ label: "Penduduk", href: "/admin/penduduk" }, { label: "Data RT", href: "/admin/rt" }, { label: "Bansos", href: "/admin/bansos" }]}
      defaults={{ familyCardNumber: "", headName: "", rt: "", address: "", housingStatus: "", memberCount: 0, inputDate: "", note: "" }}
      fields={[
        { key: "familyCardNumber", label: "No. KK", type: "text", required: true },
        { key: "headName", label: "Kepala Keluarga", type: "text", required: true },
        { key: "rt", label: "RT", type: "select", options: AMBORAWANG_RT_OPTIONS },
        { key: "address", label: "Alamat", type: "textarea", full: true },
        { key: "housingStatus", label: "Status Rumah", type: "select", options: ["Milik Sendiri", "Kontrak", "Sewa", "Menumpang", "Dinas", "Lainnya"] },
        { key: "memberCount", label: "Jumlah Anggota", type: "number" },
        { key: "inputDate", label: "Tanggal Input", type: "date" },
        { key: "note", label: "Keterangan", type: "textarea", full: true },
      ]}
    />
  );
}
