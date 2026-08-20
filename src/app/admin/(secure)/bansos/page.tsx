import AdminCollectionManager from "@/components/admin/AdminCollectionManager";
import { AMBORAWANG_RT_OPTIONS } from "@/lib/rtSlots";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="socialAssistance"
      publicHref="/bansos"
      title="Administrasi Bansos"
      description="Kelola penerima dan penyaluran bantuan sosial. NIK dan No. KK menghubungkan Bansos dengan Penduduk/Keluarga. Jika RT belum diisi, sistem mencoba mengambil RT dari NIK atau No. KK yang cocok."

      connectionNote="Jika NIK cocok dengan Penduduk atau No. KK cocok dengan Keluarga, RT Bansos mengikuti data tersebut. Jumlah data bantuan kemudian dihitung otomatis pada Data RT tanpa menampilkan identitas penerima ke publik."
      relatedLinks={[{ label: "Penduduk", href: "/admin/penduduk" }, { label: "Keluarga / KK", href: "/admin/keluarga" }, { label: "Data RT", href: "/admin/rt" }]}
      defaults={{ recordId: "", recipientName: "", nik: "", familyCardNumber: "", rt: "", aidType: "", period: "", receiptStatus: "", date: "", programSource: "", note: "" }}
      fields={[
        { key: "recordId", label: "ID Data", type: "text", required: true },
        { key: "recipientName", label: "Nama Penerima", type: "text", required: true },
        { key: "nik", label: "NIK", type: "text" },
        { key: "familyCardNumber", label: "No. KK", type: "text" },
        { key: "rt", label: "RT", type: "select", options: AMBORAWANG_RT_OPTIONS },
        { key: "aidType", label: "Jenis Bantuan", type: "text", required: true },
        { key: "period", label: "Periode", type: "text" },
        { key: "receiptStatus", label: "Status Penerimaan", type: "select", options: ["Terdaftar", "Tersalurkan", "Belum Tersalurkan", "Ditunda", "Tidak Aktif"] },
        { key: "date", label: "Tanggal", type: "date" },
        { key: "programSource", label: "Sumber Program", type: "text" },
        { key: "note", label: "Keterangan", type: "textarea", full: true },
      ]}
    />
  );
}
