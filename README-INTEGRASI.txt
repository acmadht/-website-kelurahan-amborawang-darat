PAKET ADMIN FINAL - KKN TERKUNCI
================================

URL Dashboard:
  /admin

Modul admin:
  /admin/profil
  /admin/pemerintahan
  /admin/layanan
  /admin/berita
  /admin/pengumuman
  /admin/galeri
  /admin/dokumen
  /admin/wilayah
  /admin/kontak
  /admin/pengaturan

TIDAK ADA:
  /admin/tim-kkn

File:
- src/app/admin/page.tsx
- src/app/admin/[module]/page.tsx
- src/components/admin/AdminDashboard.tsx
- src/components/admin/AdminDashboard.module.css
- src/components/admin/AdminModuleEditor.tsx
- src/components/admin/AdminModuleEditor.module.css
- src/lib/adminAccess.ts
- ADMIN-AKSES.txt

PENTING:
Paket ini fokus pada struktur admin final dan proteksi KKN.
Editor modul masih UI/scaffold agar tidak menebak struktur Firestore proyek Anda.

Untuk produksi:
- hubungkan modul ke Firestore/API yang sudah digunakan website
- gunakan autentikasi admin yang sudah ada
- terapkan whitelist adminAccess.ts pada backend/API
- jangan berikan write permission ke data KKN
- Tim KKN tetap menggunakan KknPage.tsx statis/flip card yang sudah dibuat
