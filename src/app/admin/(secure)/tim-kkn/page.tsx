import AdminDocumentEditor from "@/components/admin/AdminDocumentEditor";
import AdminCollectionManager from "@/components/admin/AdminCollectionManager";
import KknLegacyImport from "@/components/admin/KknLegacyImport";
import { staticKknTeam } from "@/data/kknStatic";

export default function Page() {
  return (
    <>
      <KknLegacyImport />
      <AdminDocumentEditor
        collectionName="kknTeam"
        documentId="main"
        publicHref="/tim-kkn"
        title="Tim KKN · Identitas"
        description="Kelola identitas kelompok, dosen pembimbing, foto, logo, struktur organisasi, dan deskripsi KKN yang tampil pada halaman publik."
        defaults={{ ...staticKknTeam }}
        fields={[
          { key: "universityName", label: "Nama Universitas", type: "text", required: true, full: true },
          { key: "groupName", label: "Nama Kelompok", type: "text", required: true },
          { key: "year", label: "Tahun / Periode", type: "text", required: true },
          { key: "location", label: "Lokasi KKN", type: "text", required: true, full: true },
          { key: "description", label: "Deskripsi Tim KKN", type: "textarea", required: true, full: true },
          { key: "supervisorName", label: "Nama Dosen Pembimbing", type: "text", required: true, full: true },
          { key: "supervisorPhotoUrl", label: "Foto Dosen Pembimbing", type: "image", full: true },
          { key: "supervisorDescription", label: "Deskripsi Dosen Pembimbing", type: "textarea", full: true },
          { key: "structureImageUrl", label: "Bagan Struktur Organisasi", type: "image", full: true },
        ]}
      />

      <AdminCollectionManager
        collectionName="kknMembers"
        publicHref="/tim-kkn"
        title="Anggota Tim KKN"
        description="Tambah, ubah, hapus, dan atur urutan anggota KKN. Perubahan langsung dipakai halaman Tim KKN."
        defaults={{
          name: "",
          role: "Anggota",
          division: "Anggota",
          studyProgram: "",
          nim: "",
          quote: "",
          description: "",
          photoUrl: "",
          order: 1,
          isActive: true,
        }}
        displayFields={["name", "role", "division", "studyProgram", "isActive"]}
        fields={[
          { key: "name", label: "Nama Lengkap", type: "text", required: true, full: true },
          { key: "role", label: "Jabatan / Peran", type: "text", required: true },
          { key: "division", label: "Divisi", type: "select", options: ["Pimpinan Tim", "Administrasi", "Keuangan", "Media", "Humas", "Logistik", "Anggota", "Lainnya"] },
          { key: "studyProgram", label: "Program Studi", type: "text" },
          { key: "nim", label: "NIM", type: "text" },
          { key: "quote", label: "Quote / Motto", type: "textarea", full: true },
          { key: "photoUrl", label: "Foto Anggota", type: "image", full: true },
          { key: "order", label: "Urutan Tampil", type: "number" },
          { key: "isActive", label: "Tampilkan di Website", type: "checkbox" },
        ]}
      />
    </>
  );
}
