import AdminDocumentEditor from "@/components/admin/AdminDocumentEditor";

export default function Page() {
  return (
    <AdminDocumentEditor
      collectionName="pages"
      documentId="wilayah"
      title="Wilayah"
      description="Kelola statistik kewilayahan, batas administratif, karakter wilayah, dan peta Amborawang Darat."
      defaults={{
        area: "19,47 km²",
        population: "2.921 jiwa",
        rtCount: "13 RT",
        districtDistance: "5,3 km",
        northBoundary: "Kelurahan Margomulyo",
        eastBoundary: "Kelurahan Argosari dan Kelurahan Amborawang Laut",
        southBoundary: "Kelurahan Salok Api Laut dan Kelurahan Salok Api Darat",
        westBoundary: "Desa Tani Bhakti",
        geography: "Kelurahan Amborawang Darat merupakan bagian dari Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur.",
        connectivity: "Wilayah terhubung dengan koridor Jalan Balikpapan–Handil II dan jaringan jalan lingkungan.",
        mapImageUrl: "/images/peta-amborawang-darat.png",
      }}
      fields={[
        { key: "area", label: "Luas Wilayah", type: "text" },
        { key: "population", label: "Jumlah Penduduk", type: "text" },
        { key: "rtCount", label: "Jumlah RT", type: "text" },
        { key: "districtDistance", label: "Jarak ke Ibu Kota Kecamatan", type: "text" },
        { key: "northBoundary", label: "Batas Utara", type: "text", full: true },
        { key: "eastBoundary", label: "Batas Timur", type: "text", full: true },
        { key: "southBoundary", label: "Batas Selatan", type: "text", full: true },
        { key: "westBoundary", label: "Batas Barat", type: "text", full: true },
        { key: "geography", label: "Gambaran Wilayah", type: "textarea", full: true },
        { key: "connectivity", label: "Konektivitas Wilayah", type: "textarea", full: true },
        { key: "mapImageUrl", label: "Peta Administratif", type: "image", full: true },
      ]}
    />
  );
}
