UPGRADE WEBSITE KELURAHAN AMBORAWANG DARAT — ADMIN + PUBLIK
============================================================

Isi paket:
- src/                  : source Next.js yang sudah diperbarui
- firestore.rules       : Firestore Security Rules untuk modul lama + baru
- README_UPDATE.txt     : panduan pemasangan ini

MODUL BARU ADMIN + PUBLIK
- Penduduk            -> /admin/penduduk    | /penduduk
- Keluarga / KK       -> /admin/keluarga    | /keluarga
- Mutasi Penduduk     -> /admin/mutasi      | /mutasi
- Bansos              -> /admin/bansos      | /bansos
- Inventaris          -> /admin/inventaris  | /inventaris
- Portal Data Publik  ->                    | /data-publik

PENYEMPURNAAN MODUL YANG SUDAH ADA
- Agenda: field Tampilkan di Website / isPublic dipakai pada tampilan publik.
- UMKM: NIK Pemilik (khusus admin/internal) + Keterangan.
- Fasilitas: Keterangan.
- Pengaduan: Tampil Statistik Publik + ringkasan status pada halaman publik.
- Dashboard admin: statistik Penduduk, Keluarga, Mutasi, Bansos, Inventaris.
- Header/search/sitemap publik: ditambah Data Publik dan modul statistik baru.
- Spreadsheet sync/mirror: ditambah Penduduk, Keluarga, Mutasi, Bansos, Inventaris
  dan field baru Agenda/UMKM/Fasilitas/Pengaduan.
- Berita publik: query browser hanya membaca status=published.
- Login admin: profil dibaca melalui API server dan dapat menghubungkan otomatis
  profil Firestore lama yang dibuat dengan Auto-ID jika emailnya cocok tepat satu.

PRIVASI & KEAMANAN PUBLIK
- NIK, No. KK, nama penduduk, nama penerima bansos, alamat pribadi, nomor dokumen,
  dan penanggung jawab personal tidak ditampilkan pada halaman publik.
- Penduduk/Keluarga/Mutasi/Bansos dipublikasikan sebagai agregat statistik.
- Inventaris publik hanya menampilkan field aset yang aman; penanggung jawab tidak dikirim.
- NIK pemilik UMKM tetap hanya dapat dibaca oleh admin/editor.
- Data permohonan surat, pengaduan mentah, pesan, dan administrasi penduduk tidak dibuka
  langsung melalui Firestore SDK publik.

COLLECTION FIRESTORE BARU
- residents
- families
- populationMutations
- socialAssistance
- inventory

SETELAH REPLACE SOURCE
1. Backup proyek lama.
2. Ganti folder src proyek dengan folder src dari paket ini.
3. Salin seluruh isi firestore.rules ke Firebase Console > Firestore Database > Rules,
   lalu klik Publish.
4. Pastikan Firebase Admin tersedia pada environment local/Vercel:
   FIREBASE_ADMIN_PROJECT_ID
   FIREBASE_ADMIN_CLIENT_EMAIL
   FIREBASE_ADMIN_PRIVATE_KEY
5. Pastikan konfigurasi Firebase Client/NEXT_PUBLIC_FIREBASE_* yang sebelumnya dipakai
   tetap tersedia.
6. Pastikan akun Authentication memiliki email yang sama dengan profil collection users.
   Endpoint /api/admin/profile akan membuat/menormalkan users/{UID} dari profil Auto-ID
   lama jika hanya ada satu profil dengan email yang sama, termasuk mengubah isActive
   "true" lama menjadi boolean true.
7. Restart dev server / redeploy aplikasi.
8. Setelah login, lakukan sinkronisasi Spreadsheet agar 5 sheet administrasi baru masuk
   ke collection Firestore baru.

VALIDASI YANG SUDAH DILAKUKAN
- 145 file .ts/.tsx diperiksa dengan TypeScript transpile parser: tidak ada error sintaks.
- Semua import lokal @/ dan relative diperiksa: tidak ada file import yang hilang.
- Full `npm build` belum dapat dijalankan dari paket upload karena source yang diterima
  hanya folder src dan tidak menyertakan package.json/node_modules konfigurasi proyek lengkap.
