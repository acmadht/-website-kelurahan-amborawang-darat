import AdminDocumentEditor from "@/components/admin/AdminDocumentEditor";
import { amborawangProfileFallback } from "@/data/amborawangProfile";

export default function Page() {
  return (
    <AdminDocumentEditor
      collectionName="pages"
      documentId="profil"
      title="Profil Kelurahan"
      description="Kelola sejarah, visi, misi, kondisi geografis, batas wilayah, potensi, fasilitas umum, dan foto kantor."
      defaults={{ ...amborawangProfileFallback }}
      fields={[
        { key: "history", label: "Sejarah Kelurahan", type: "textarea", full: true },
        { key: "vision", label: "Visi Pelayanan", type: "textarea", full: true },
        { key: "missions", label: "Misi, satu baris satu poin", type: "list", full: true },
        { key: "geography", label: "Kondisi Geografis", type: "textarea", full: true },
        { key: "boundaries", label: "Batas Wilayah", type: "textarea", full: true },
        { key: "potential", label: "Potensi Kelurahan", type: "textarea", full: true },
        { key: "facilities", label: "Fasilitas Umum, satu baris satu poin", type: "list", full: true },
        { key: "imageUrl", label: "Foto Kantor Kelurahan", type: "image", full: true },
      ]}
    />
  );
}
