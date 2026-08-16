import AdminCollectionManager from "@/components/admin/AdminCollectionManager";
import GalleryPhotoManager from "@/components/admin/GalleryPhotoManager";

export default function Page() {
  return (
    <>
      <AdminCollectionManager
        collectionName="galleryAlbums" publicHref="/galeri"
        title="Galeri"
        description="Buat album dokumentasi kelurahan lalu unggah foto. Galeri KKN dikelola terpisah melalui menu KKN agar tidak bercampur dengan galeri resmi kelurahan."
        defaults={{
          title: "",
          slug: "",
          category: "Kelurahan",
          description: "",
          coverImageUrl: "",
          location: "",
          eventDate: "",
          photoCount: 0,
          isFeatured: true,
          status: "published",
          order: 1,
        }}
        displayFields={["title", "category", "photoCount", "status"]}
        filterField="category"
        filterValue="KKN"
        filterMode="exclude"
        fields={[
          { key: "title", label: "Judul Album", type: "text", required: true, full: true },
          { key: "slug", label: "Slug, boleh kosong", type: "text", full: true },
          { key: "category", label: "Kategori", type: "select", options: ["Kelurahan", "RT", "Pemerintahan", "PKK", "Karang Taruna", "Pelayanan", "Lingkungan", "Masyarakat", "Lainnya"] },
          { key: "description", label: "Deskripsi", type: "textarea", full: true },
          { key: "coverImageUrl", label: "Foto Sampul", type: "image", full: true },
          { key: "location", label: "Lokasi", type: "text" },
          { key: "eventDate", label: "Tanggal Kegiatan", type: "date" },
          { key: "isFeatured", label: "Tampil di Beranda", type: "checkbox" },
          { key: "status", label: "Status", type: "select", options: ["draft", "published"] },
          { key: "order", label: "Urutan", type: "number" },
        ]}
      />
      <GalleryPhotoManager scope="village" />
    </>
  );
}
