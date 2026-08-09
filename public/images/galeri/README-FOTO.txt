FOTO GALERI
===========
Simpan foto di folder:
public/images/galeri/

Nama file contoh:
kantor-kelurahan.jpg
koordinasi-kkn.jpg
kerja-bakti.jpg
pelayanan-masyarakat.jpg
kegiatan-warga.jpg
dokumentasi-kkn.jpg

Jika foto belum tersedia, halaman otomatis memakai:
placeholder-gallery.svg

Data judul, kategori, tanggal, caption, dan ukuran layout:
src/components/public/GalleryPage.tsx

Ukuran layout:
size: "wide"   -> foto lebar
size: "tall"   -> foto tinggi
size: "normal" -> standar

Fitur:
- filter kategori
- featured gallery
- masonry/grid
- lightbox/modal klik foto
- caption & tanggal
- fallback jika foto belum ada
