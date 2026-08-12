# Arsitektur Konten Website Kelurahan

## Prinsip

- Semua konten resmi kelurahan dikelola dari Dashboard Admin dan disimpan di Firebase/Cloud Firestore.
- Seluruh ruang KKN tetap statis di source code dan tidak memiliki editor di dashboard admin.
- Data KKN lama yang mungkin masih ada di Firestore tidak dipakai oleh halaman publik KKN.

## Pemetaan Public → Admin → Firestore

| Halaman publik | Menu admin | Firestore |
|---|---|---|
| `/` | Beranda | `pages/home` |
| `/` | Hero Banner | `heroSlides` |
| `/` | Layanan | `services` |
| `/` | Berita | `posts` non-KKN |
| `/` | Pengumuman | `announcements` |
| `/` | Agenda | `agendas` |
| `/profil` | Profil | `pages/profil` |
| `/pemerintahan` | Pemerintahan | `officials` + `rts` |
| `/layanan` | Layanan | `services` |
| `/berita` | Berita | `posts` non-KKN |
| `/wilayah` | Wilayah | `pages/wilayah` + `rts` |
| `/data-rt` | Data RT | `rts` |
| `/galeri` | Galeri | `galleryAlbums` non-KKN + `galleryPhotos` |
| `/dokumen` | Dokumen | `documents` |
| `/kontak` | Kontak & Jam Layanan | `siteSettings/main` |
| Header/Footer/SEO | Pengaturan Website | `siteSettings/main` |
| Form kontak | Pesan Masuk | `messages` |
| Akun dashboard | Pengguna Admin | `users` + Firebase Authentication |

## Konten KKN yang statis

Konten berikut tidak membaca data KKN dari Firestore:

- `/tim-kkn`
- `/kkn/program-kerja`
- `/kkn/berita`
- `/kkn/berita/[slug]`
- `/kkn/galeri`
- `/kkn/book-chapter`
- `/kkn/luaran`

Sumber data KKN utama berada di:

- `src/data/kknStatic.ts`

Berita KKN menggunakan `staticKknPosts`, galeri menggunakan `staticKknGalleryItems`, program menggunakan `staticKknPrograms`, Book Chapter menggunakan `staticKknBookChapters`, dan luaran menggunakan `staticKknOutputs`.

## Koleksi KKN lama di Firestore

Jika sebelumnya ada koleksi seperti:

- `kknTeam`
- `kknMembers`
- `kknPrograms`
- `kknBookChapters`
- `kknOutputs`

koleksi tersebut boleh dibiarkan sementara. Source versi ini tidak membaca atau menulis koleksi tersebut. Setelah website sudah dipastikan berjalan dengan baik, koleksi lama dapat dihapus secara manual jika memang tidak lagi diperlukan.

## Berita dan Galeri

Dashboard Berita hanya mengelola kategori non-KKN. Kategori `KKN` tidak tersedia pada form admin dan data lama kategori KKN tidak ditampilkan pada halaman `/berita`.

Dashboard Galeri juga hanya mengelola album non-KKN. Album lama dengan kategori `KKN` tidak ditampilkan pada `/galeri`.

## Footer

Teks copyright sekarang dinamis dari:

`siteSettings/main.footerText`

Jika Firestore masih memiliki nilai lama yang mengandung kata `Contoh`, website menggunakan fallback:

`Pemerintah Kelurahan Amborawwang Darat`

Setelah admin menyimpan nilai baru melalui **Pengaturan Website → Teks Footer**, nilai admin akan digunakan.

## Setelah mengganti source

Hentikan server lalu jalankan:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

Kemudian cek:

1. `/admin` tidak lagi menampilkan menu KKN.
2. Perubahan pada Beranda, Profil, Pemerintahan, Layanan, Berita, Wilayah, RT, Galeri, Dokumen, Kontak, Hero, Pengumuman, dan Agenda tampil di halaman publik.
3. Perubahan data KKN di Firestore tidak mengubah halaman KKN.
4. Berita/galeri kategori KKN lama tidak muncul pada halaman resmi kelurahan.
