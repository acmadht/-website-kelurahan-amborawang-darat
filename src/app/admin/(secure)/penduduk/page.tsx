import AdminCollectionManager from "@/components/admin/AdminCollectionManager";
import { AMBORAWANG_RT_OPTIONS } from "@/lib/rtSlots";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="residents"
      publicHref="/penduduk"
      title="Administrasi Penduduk"
      description="Kelola data penduduk sesuai sheet Penduduk. Data ini menjadi sumber statistik Penduduk, membantu menghitung jumlah warga per RT, komposisi laki-laki/perempuan, balita/lansia, serta jumlah anggota KK. Detail identitas tetap hanya tersedia untuk admin."

      connectionNote="Penduduk adalah sumber utama RT. Perubahan NIK/No. KK/RT menghitung ulang demografi Data RT, jumlah anggota dan RT Keluarga, serta dapat menyelaraskan RT Bansos, UMKM pemilik, dan permohonan surat yang identitasnya cocok."
      relatedLinks={[{ label: "Keluarga / KK", href: "/admin/keluarga" }, { label: "Mutasi", href: "/admin/mutasi" }, { label: "Data RT", href: "/admin/rt" }, { label: "Bansos", href: "/admin/bansos" }]}
      defaults={{ residentId: "", nik: "", familyCardNumber: "", fullName: "", gender: "", birthPlace: "", birthDate: "", religion: "", maritalStatus: "", education: "", occupation: "", rt: "", address: "", domicileStatus: "Aktif", arrivalDate: "", departureDate: "", note: "" }}
      fields={[
        { key: "residentId", label: "ID Penduduk", type: "text", required: true },
        { key: "nik", label: "NIK", type: "text", required: true },
        { key: "familyCardNumber", label: "No. KK", type: "text" },
        { key: "fullName", label: "Nama Lengkap", type: "text", required: true },
        { key: "gender", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
        { key: "birthPlace", label: "Tempat Lahir", type: "text" },
        { key: "birthDate", label: "Tanggal Lahir", type: "date" },
        { key: "religion", label: "Agama", type: "select", options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu", "Lainnya"] },
        { key: "maritalStatus", label: "Status Perkawinan", type: "select", options: ["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"] },
        { key: "education", label: "Pendidikan", type: "text" },
        { key: "occupation", label: "Pekerjaan", type: "text" },
        { key: "rt", label: "RT", type: "select", options: AMBORAWANG_RT_OPTIONS },
        { key: "address", label: "Alamat", type: "textarea", full: true },
        { key: "domicileStatus", label: "Status Domisili", type: "select", options: ["Aktif", "Pindah", "Meninggal", "Sementara"] },
        { key: "arrivalDate", label: "Tanggal Masuk", type: "date" },
        { key: "departureDate", label: "Tanggal Keluar", type: "date" },
        { key: "note", label: "Keterangan", type: "textarea", full: true },
      ]}
    />
  );
}
