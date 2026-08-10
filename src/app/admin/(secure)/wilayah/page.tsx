import AdminDocumentEditor from "@/components/admin/AdminDocumentEditor";
import { regionContentFallback } from "@/data/siteContent";

export default function Page() {
  return (
    <AdminDocumentEditor
      collectionName="pages"
      documentId="wilayah"
      publicHref="/wilayah"
      title="Wilayah"
      description="Kelola statistik kewilayahan, batas administratif, gambaran wilayah, karakter wilayah, dan peta."
      defaults={regionContentFallback as unknown as Record<string, unknown>}
      fields={[
        { key: "area", label: "Luas Wilayah", type: "text" },
        { key: "areaNote", label: "Sumber / Catatan Luas", type: "text" },
        { key: "population", label: "Jumlah Penduduk", type: "text" },
        { key: "populationNote", label: "Sumber / Catatan Penduduk", type: "text" },
        { key: "rtCount", label: "Jumlah RT", type: "text" },
        { key: "rtNote", label: "Sumber / Catatan RT", type: "text" },
        { key: "districtDistance", label: "Jarak ke Ibu Kota Kecamatan", type: "text" },
        { key: "districtDistanceNote", label: "Sumber / Catatan Jarak", type: "text" },
        { key: "northBoundary", label: "Batas Utara", type: "text", full: true },
        { key: "eastBoundary", label: "Batas Timur", type: "text", full: true },
        { key: "southBoundary", label: "Batas Selatan", type: "text", full: true },
        { key: "westBoundary", label: "Batas Barat", type: "text", full: true },
        { key: "geography", label: "Gambaran Wilayah", type: "textarea", full: true },
        { key: "geographyDetail", label: "Detail Geografi / Luas", type: "textarea", full: true },
        { key: "connectivity", label: "Konektivitas Wilayah", type: "textarea", full: true },
        { key: "boundaryNote", label: "Catatan Dasar Batas Wilayah", type: "textarea", full: true },
        { key: "climateTitle", label: "Judul Karakter 1", type: "text" },
        { key: "climateText", label: "Isi Karakter 1", type: "textarea", full: true },
        { key: "corridorTitle", label: "Judul Karakter 2", type: "text" },
        { key: "corridorText", label: "Isi Karakter 2", type: "textarea", full: true },
        { key: "landTitle", label: "Judul Karakter 3", type: "text" },
        { key: "landText", label: "Isi Karakter 3", type: "textarea", full: true },
        { key: "mapImageUrl", label: "Peta Administratif", type: "image", full: true },
      ]}
    />
  );
}
