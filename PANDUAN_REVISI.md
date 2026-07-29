# Panduan Revisi Website

## Revisi yang tidak membutuhkan coding

Masuk ke `/admin/login`, lalu gunakan menu berikut:

| Perubahan | Menu Admin |
|---|---|
| Nama, logo, alamat, WhatsApp, peta | Pengaturan |
| Gambar dan tulisan bagian atas | Hero Banner |
| Sejarah, visi, misi, potensi | Profil Kelurahan |
| Nama, jabatan, foto aparatur | Aparatur |
| Ketua dan data RW | Data RW |
| Ketua dan data RT | Data RT |
| Persyaratan pelayanan | Layanan |
| Berita kegiatan | Berita |
| Informasi penting | Pengumuman |
| Jadwal kegiatan | Agenda |
| Album dan foto | Galeri |
| Kelompok KKN | Tim KKN |
| Formulir dan file publik | Dokumen |
| Admin dan editor | Pengguna Admin |

## Mengganti warna utama

Warna sengaja tidak dibuka untuk perubahan bebas melalui admin agar desain tetap konsisten. Bila warna resmi berubah, edit variabel paling atas pada:

```text
src/app/globals.css
```

Variabel utama:

```css
--navy-950
--navy-900
--navy-800
--blue-600
--blue-500
--background
```

## Mengganti menu navigasi

Edit daftar menu pada:

```text
src/components/public/PublicHeader.tsx
```

## Mengganti susunan beranda

Edit urutan section pada:

```text
src/components/public/HomePage.tsx
```

Perubahan isi section tidak membutuhkan coding. Hanya perubahan jenis section atau posisi section yang membutuhkan coding.

## Menambah jenis konten admin

Gunakan komponen generik:

```text
src/components/admin/AdminCollectionManager.tsx
```

Komponen mendukung field:

- text
- textarea
- number
- checkbox
- select
- date
- image
- list

## Menghapus foto dari Cloudinary

Pada versi awal, tombol hapus foto di galeri hanya menghapus data Firestore. Aset Cloudinary tidak otomatis dihapus untuk menghindari penghapusan file yang masih digunakan. API hapus sudah tersedia di:

```text
src/app/api/delete-image/route.ts
```

Penghapusan permanen dapat ditambahkan ke tombol galeri setelah alur backup disepakati.
