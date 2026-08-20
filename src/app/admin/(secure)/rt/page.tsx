import AdminCollectionManager from "@/components/admin/AdminCollectionManager";
import { AMBORAWANG_RT_OPTIONS } from "@/lib/rtSlots";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="rts" publicHref="/data-rt"
      autoRecalculate
      title="Data RT"
      description="Kelola identitas 13 RT Kelurahan Amborawang Darat. Statistik penduduk dan KK di halaman ini dihitung otomatis dari Administrasi Penduduk dan Keluarga/KK, sehingga tidak perlu diketik ulang."

      connectionNote="Data RT sekarang menjadi ringkasan otomatis seluruh modul yang mempunyai hubungan RT. Penduduk/KK mengisi demografi, Fasilitas mengisi daftar fasilitas, UMKM/Bansos/Mutasi/Inventaris/Surat/Pengaduan mengisi jumlah agregat per RT. Ketua RT, area, rumah, kontak, dan keterangan tetap dikelola di sini."
      relatedLinks={[
        { label: "Penduduk", href: "/admin/penduduk" },
        { label: "Keluarga / KK", href: "/admin/keluarga" },
        { label: "Fasilitas", href: "/admin/fasilitas" },
        { label: "UMKM", href: "/admin/umkm" },
        { label: "Bansos", href: "/admin/bansos" },
        { label: "Inventaris", href: "/admin/inventaris" },
        { label: "Mutasi", href: "/admin/mutasi" },
        { label: "Permohonan Surat", href: "/admin/surat" },
        { label: "Pengaduan", href: "/admin/pengaduan" },
      ]}
      defaults={{
        number: "",
        chairmanName: "",
        photoUrl: "",
        phone: "",
        area: "",
        description: "",
        populationCount: 0,
        familyCount: 0,
        maleCount: 0,
        femaleCount: 0,
        houseCount: 0,
        toddlerCount: 0,
        elderlyCount: 0,
        facilities: [],
        facilityCount: 0,
        umkmCount: 0,
        socialAssistanceCount: 0,
        inventoryItemCount: 0,
        inventoryQuantity: 0,
        mutationCount: 0,
        serviceRequestCount: 0,
        complaintCount: 0,
        order: 1,
        isActive: true,
      }}
      displayFields={[
        "number",
        "chairmanName",
        "populationCount",
        "familyCount",
        "isActive",
      ]}
      fields={[
        {
          key: "number",
          label: "Nomor RT",
          type: "select",
          required: true,
          options: AMBORAWANG_RT_OPTIONS,
        },
        {
          key: "chairmanName",
          label: "Nama Ketua RT",
          type: "text",
          required: true,
        },
        {
          key: "photoUrl",
          label: "Foto Ketua RT",
          type: "image",
          full: true,
        },
        {
          key: "phone",
          label: "Kontak Ketua RT",
          type: "text",
          placeholder: "08xxxxxxxxxx",
        },
        {
          key: "area",
          label: "Alamat / Area RT",
          type: "text",
          full: true,
          placeholder: "Contoh: Jl. Balikpapan-Handil II dan sekitarnya",
        },
        {
          key: "populationCount",
          label: "Jumlah Penduduk",
          type: "number",
          readOnly: true,
        },
        {
          key: "familyCount",
          label: "Jumlah Kepala Keluarga",
          type: "number",
          readOnly: true,
        },
        {
          key: "maleCount",
          label: "Jumlah Laki-laki",
          type: "number",
          readOnly: true,
        },
        {
          key: "femaleCount",
          label: "Jumlah Perempuan",
          type: "number",
          readOnly: true,
        },
        {
          key: "houseCount",
          label: "Jumlah Rumah",
          type: "number",
        },
        {
          key: "toddlerCount",
          label: "Jumlah Balita",
          type: "number",
          readOnly: true,
        },
        {
          key: "elderlyCount",
          label: "Jumlah Lansia",
          type: "number",
          readOnly: true,
        },
        {
          key: "facilities",
          label: "Fasilitas RT (Otomatis dari menu Fasilitas)",
          type: "list",
          full: true,
          readOnly: true,
          placeholder:
            "Tulis satu fasilitas per baris, contoh:\nPosyandu\nMusala\nLapangan",
        },
        { key: "facilityCount", label: "Jumlah Fasilitas Terhubung", type: "number", readOnly: true },
        { key: "umkmCount", label: "Jumlah UMKM Terhubung", type: "number", readOnly: true },
        { key: "socialAssistanceCount", label: "Data Bansos Terhubung", type: "number", readOnly: true },
        { key: "inventoryItemCount", label: "Jenis Inventaris Terhubung", type: "number", readOnly: true },
        { key: "inventoryQuantity", label: "Kuantitas Inventaris Terhubung", type: "number", readOnly: true },
        { key: "mutationCount", label: "Catatan Mutasi Terkait", type: "number", readOnly: true },
        { key: "serviceRequestCount", label: "Permohonan Surat Terkait", type: "number", readOnly: true },
        { key: "complaintCount", label: "Pengaduan Terkait", type: "number", readOnly: true },
        {
          key: "description",
          label: "Keterangan Wilayah",
          type: "textarea",
          full: true,
          placeholder:
            "Tuliskan gambaran singkat wilayah RT yang aman untuk dipublikasikan.",
        },
        {
          key: "order",
          label: "Urutan",
          type: "number",
        },
        {
          key: "isActive",
          label: "Tampilkan di Website",
          type: "checkbox",
        },
      ]}
    />
  );
}
