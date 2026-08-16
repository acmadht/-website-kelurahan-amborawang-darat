import AdminCollectionManager from "@/components/admin/AdminCollectionManager";
import GalleryPhotoManager from "@/components/admin/GalleryPhotoManager";

export default function Page() {
  return (
    <>
      <AdminCollectionManager
        collectionName="galleryAlbums"
        publicHref="/kkn/galeri"
        title="Galeri KKN"
        description="Buat album khusus KKN dan kelola foto dokumentasinya. Album ini tidak bercampur dengan galeri resmi kelurahan."
        fixedValues={{ category: "KKN" }}
        filterField="category"
        filterValue="KKN"
        filterMode="include"
        defaults={{
          title: "",
          slug: "",
          category: "KKN",
          description: "",
          coverImageUrl: "",
          location: "Kelurahan Amborawang Darat",
          eventDate: "",
          photoCount: 0,
          isFeatured: true,
          status: "published",
          order: 1,
        }}
        displayFields={["title", "eventDate", "photoCount", "status"]}
        fields={[
          { key: "title", label: "Judul Album", type: "text", required: true, full: true },
          { key: "slug", label: "Slug, boleh kosong", type: "text", full: true },
          { key: "description", label: "Deskripsi", type: "textarea", full: true },
          { key: "coverImageUrl", label: "Foto Sampul", type: "image", full: true },
          { key: "location", label: "Lokasi", type: "text" },
          { key: "eventDate", label: "Tanggal Kegiatan", type: "date" },
          { key: "isFeatured", label: "Album Unggulan", type: "checkbox" },
          { key: "status", label: "Status", type: "select", options: ["draft", "published"] },
          { key: "order", label: "Urutan", type: "number" },
        ]}
      />
      <GalleryPhotoManager scope="kkn" />
    </>
  );
}
