import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="rts" publicHref="/data-rt"
      title="Data 13 RT"
      description="Kelola RT 01 sampai RT 13, ketua RT, data penduduk, komposisi warga, fasilitas, kontak, foto, dan informasi wilayah. Data yang disimpan akan tampil pada halaman publik Data RT."
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
          type: "text",
          required: true,
          placeholder: "01",
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
        },
        {
          key: "familyCount",
          label: "Jumlah Kepala Keluarga",
          type: "number",
        },
        {
          key: "maleCount",
          label: "Jumlah Laki-laki",
          type: "number",
        },
        {
          key: "femaleCount",
          label: "Jumlah Perempuan",
          type: "number",
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
        },
        {
          key: "elderlyCount",
          label: "Jumlah Lansia",
          type: "number",
        },
        {
          key: "facilities",
          label: "Fasilitas Utama RT",
          type: "list",
          full: true,
          placeholder:
            "Tulis satu fasilitas per baris, contoh:\nPosyandu\nMusala\nLapangan",
        },
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
