# V6 - Admin Website ↔ Firestore ↔ Google Spreadsheet

## Tujuan
Firestore adalah satu-satunya database pusat. Admin website dan Google Spreadsheet membaca serta mengubah dokumen yang sama. Website publik tetap membaca Firestore.

## Prinsip awal
Untuk pertama kali, data yang sudah ada di Admin/Firestore dianggap sebagai sumber awal. Google Spreadsheet dibuat sama dengan Admin melalui menu **Samakan data awal dari Admin (buat backup)**. Setelah sama, sinkron otomatis dua arah dapat diaktifkan.

## Modul dua arah
- Data RT ↔ `rts`
- Pemerintahan ↔ `officials`
- Berita ↔ `posts`
- Pengumuman ↔ `announcements`
- Agenda ↔ `agendas`
- Layanan ↔ `services`
- Dokumen ↔ `documents`
- Hero ↔ `heroSlides`
- Galeri Album ↔ `galleryAlbums`
- UMKM ↔ `umkm`
- Fasilitas ↔ `facilities`
- Surat ↔ `serviceRequests`
- Pengaduan ↔ `complaints`
- Beranda ↔ `pages/home`
- Wilayah ↔ `pages/wilayah`
- Pengaturan Website ↔ `siteSettings/main`
- Kontak ↔ `siteSettings/main`
- Profil Website ↔ `pages/profil`
- Profil Statistik ↔ `pages/profil.stats`
- Profil Timeline ↔ `pages/profil.timeline`
- Profil Fakta Wilayah ↔ `pages/profil.regionFacts`
- Profil Batas ↔ `pages/profil.boundaryItems`
- Profil Potensi ↔ `pages/profil.potentials`

## Data internal yang tetap di spreadsheet
Penduduk, Keluarga, Mutasi, Bansos, Inventaris dan data administrasi internal lain tetap boleh dipakai sebagai basis kerja kelurahan, tetapi tidak dipublikasikan per individu. Statistik agregat dapat masuk ke website melalui Data RT / villageStats.

## Perubahan Admin V6
Admin ditambah menu untuk:
- UMKM
- Fasilitas
- Permohonan Surat
- Pengaduan

Dengan demikian data yang diedit melalui spreadsheet juga dapat dilihat dan diedit melalui Admin yang memakai Firestore yang sama.

## Langkah pemasangan
1. Merge folder `src` V6 ke repository website yang sebenarnya.
2. Pastikan route ini ter-deploy:
   - `/api/spreadsheet-sync`
   - `/api/spreadsheet-mirror`
3. Di Vercel Environment Variables pastikan ada:
   - `SPREADSHEET_SYNC_SECRET`
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
4. Redeploy Vercel.
5. Google Sheets → Extensions → Apps Script.
6. Ganti seluruh `Code.gs` dengan file V6.
7. Script Properties:
   - `SYNC_ENDPOINT=https://DOMAIN/api/spreadsheet-sync`
   - `SYNC_SECRET=<sama dengan SPREADSHEET_SYNC_SECRET>`
   - `WEBSITE_BASE_URL=https://DOMAIN`
8. Refresh Google Sheets.

## Urutan aman untuk menyamakan data
1. Menu **Website Kelurahan → Siapkan / samakan struktur Spreadsheet**.
   - Sheet yang belum ada dibuat otomatis.
   - Kolom yang kurang ditambahkan.
   - Data lama tidak dihapus.
2. Menu **Website Kelurahan → Tes koneksi dua arah**.
3. Jika sukses, pilih **Samakan data awal dari Admin (buat backup)**.
   - Sistem membuat salinan backup spreadsheet.
   - Hanya sheet yang terhubung website yang dikosongkan lalu diisi ulang dari Firestore/Admin.
   - Sheet internal Penduduk/Keluarga/Mutasi/Bansos/Inventaris tidak disentuh.
4. Bandingkan Data RT dan Berita dengan Admin.
5. Setelah sama, pilih **Aktifkan sinkron otomatis**.

## Cara kerja normal
- Edit di Google Sheet → baris tersebut dikirim ke Firestore → Admin dan website membaca nilai baru.
- Edit di Admin → Firestore berubah → Google Sheet mengambil perubahan maksimal sekitar 1 menit.
- Untuk langsung menarik perubahan Admin, pilih **Tarik semua perubahan dari Admin**.

## Konflik
Jika Admin dan Sheet mengubah field yang sama hampir bersamaan, nilai terakhir yang masuk Firestore menjadi nilai akhir. Hindari dua orang mengedit record yang sama pada saat bersamaan.

## Privasi
NIK, No. KK, data bansos, identitas pelapor, dan data individu tidak boleh tampil pada halaman publik. Surat dan pengaduan berada di koleksi internal; halaman publik hanya menggunakan tiket/status/verifikasi minimum.

## Catatan Galeri
Spreadsheet menyinkronkan metadata **album galeri**. Upload foto galeri individual tetap lebih baik dilakukan melalui Admin karena file upload dan penyimpanan gambar lebih aman ditangani di sana.
