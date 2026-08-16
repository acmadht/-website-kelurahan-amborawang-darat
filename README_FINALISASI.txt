FINALISASI WEBSITE KELURAHAN AMBORAWANG DARAT
===============================================

Versi ini melanjutkan paket website_amborawang_data_publik_rt_lengkap.

PENAMBAHAN
----------
1. Export CSV langsung dari Admin:
   - Penduduk
   - Keluarga / KK
   - Mutasi Penduduk
   - Bansos
   - Inventaris
   - Data RT

2. Backup penuh Firestore:
   Admin > Backup & Export
   - Khusus akun superadmin.
   - Menghasilkan satu file JSON berisi konten website dan administrasi inti.
   - Tidak berisi password Firebase Authentication.
   - Tidak menyalin file gambar fisik; URL gambar tetap tercatat di data.

3. Halaman publik baru:
   /transparansi  = pusat Transparansi & Informasi Publik
   /privasi       = Kebijakan Privasi dan batas publikasi data

4. Navigasi diperbarui:
   - Transparansi masuk ke menu Informasi.
   - Privasi tersedia dari footer dan pencarian.
   - Keduanya masuk sitemap.

5. Fitur RW lama dibersihkan:
   - route /admin/rw dihapus.
   - rule koleksi rws dihapus.
   - Sistem tetap menggunakan RT sebagai struktur wilayah administrasi website.

KEAMANAN DATA
-------------
- Export/backup mengandung data internal. Jangan taruh file backup di folder public website.
- NIK, No. KK, alamat pribadi, nama penerima bansos, isi pengaduan, serta data administrasi rinci tetap tidak ditampilkan sebagai daftar publik.
- Backup penuh hanya ditampilkan untuk role superadmin.

CARA PASANG
-----------
1. Backup source lama.
2. Replace folder src dengan src dalam ZIP ini.
3. Firebase Console > Firestore Database > Rules.
4. Replace Rules dengan firestore.rules dalam ZIP ini lalu Publish.
5. Jalankan ulang project: npm run dev
6. Login sebagai superadmin dan uji menu Backup & Export.

CHECKLIST UJI SEBELUM DEPLOY
----------------------------
[ ] Login superadmin berhasil.
[ ] Login editor berhasil dan tidak melihat Backup/Pengguna bila memang dibatasi.
[ ] Operator RT hanya masuk ke Data RT Saya.
[ ] Tambah/edit/hapus Penduduk memperbarui statistik RT.
[ ] Keluarga/KK terhubung ke Penduduk dan Data RT.
[ ] Mutasi tersimpan dengan benar.
[ ] Bansos tidak tampil sebagai identitas publik.
[ ] Inventaris tampil sesuai data publik yang aman.
[ ] Export CSV keenam modul berhasil dibuka di Excel.
[ ] Backup JSON superadmin berhasil diunduh.
[ ] /transparansi dapat dibuka.
[ ] /privasi dapat dibuka.
[ ] Permohonan surat dan cek status berfungsi.
[ ] Pengaduan dan cek status berfungsi.
[ ] Upload gambar berfungsi.
[ ] Berita draft tidak tampil sebagai artikel publik.
[ ] Data publik tidak menampilkan NIK/No. KK/alamat pribadi.
[ ] Tampilan mobile menu/header/footer diperiksa.
[ ] Firestore Rules sudah dipublish sebelum deployment.

PEMERIKSAAN SOURCE
------------------
- 150 file TypeScript/TSX berhasil diparsing tanpa syntax error.
- Pemeriksaan import lokal: tidak ada import file lokal yang hilang.
- Full npm build belum dapat dijalankan dari paket source ini karena paket yang tersedia tidak menyertakan keseluruhan project/dependency (misalnya package.json/node_modules).
