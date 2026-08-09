RESTORE HALAMAN PUBLIK FINAL - TANPA MENYENTUH ADMIN
====================================================

Masalah:
Paket restore admin sebelumnya jika dipakai mengganti seluruh folder src akan
mengembalikan halaman publik ke desain lama.

Paket ini sengaja HANYA berisi file halaman publik yang sudah didesain ulang.
TIDAK ADA src/app/admin dan TIDAK ADA src/components/admin.

CARA PASANG:
1. Jangan hapus folder src project.
2. Ekstrak ZIP ini.
3. Copy folder src dari ZIP ke root project dan pilih Replace/Merge untuk file yang sama.
4. Jangan menghapus file lain.
5. Restart: npm run dev
6. Hard refresh browser: Ctrl + F5

YANG DI-RESTORE:
- Beranda modern + Google Maps
- Profil modern
- Pemerintahan modern
- Layanan modern
- Berita + detail + share
- Wilayah modern
- Galeri + lightbox
- Dokumen
- Tim KKN flip-card klik
- Kontak modern

ADMIN:
Tidak disentuh sama sekali oleh paket ini.
Dashboard admin yang sekarang ada akan tetap seperti adanya.

CATATAN:
Jangan lagi replace satu folder src penuh dari paket dashboard lama karena itu
akan menimpa halaman publik yang sudah diperbaiki.
