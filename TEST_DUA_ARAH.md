# Uji Sinkronisasi Dua Arah Admin ↔ Spreadsheet

## Tujuan
Firestore menjadi database pusat. Admin website dan Google Spreadsheet mengubah dokumen Firestore yang sama.

- Spreadsheet → Firestore: otomatis sesaat setelah baris diedit.
- Admin/Firestore → Spreadsheet: diperiksa otomatis setiap 1 menit.
- Website publik tetap membaca Firestore seperti biasa.
- Kolom `Firestore ID` dibuat otomatis dan disembunyikan agar satu record tidak menjadi duplikat.

## 1. Pasang source website
Salin/merge folder `src` dari paket ini ke repository Next.js website yang sebenarnya.
Pastikan dua endpoint ini ikut terpasang:

- `src/app/api/spreadsheet-sync/route.ts`
- `src/app/api/spreadsheet-mirror/route.ts`

Lalu deploy ke Vercel.

## 2. Environment Variable di Vercel
Project → Settings → Environment Variables.

Tambahkan:

`SPREADSHEET_SYNC_SECRET=<secret-acak-panjang>`

Gunakan nilai rahasia yang sama di Apps Script. Setelah menambah/mengubah env, redeploy.

## 3. Pasang Apps Script
Google Spreadsheet → Extensions → Apps Script.

Hapus kode contoh, lalu tempel seluruh isi:

`scripts/google-apps-script/Code.gs`

Simpan.

## 4. Script Properties
Apps Script → Project Settings → Script Properties.

Tambahkan:

- `SYNC_ENDPOINT` = `https://DOMAIN-WEBSITE/api/spreadsheet-sync`
- `SYNC_SECRET` = nilai yang sama dengan `SPREADSHEET_SYNC_SECRET` di Vercel
- `WEBSITE_BASE_URL` = `https://DOMAIN-WEBSITE`

Untuk fitur surat otomatis, opsional:
- `LETTER_NUMBER_PATTERN`
- `LETTER_TEMPLATE_ID`
- `LETTER_OUTPUT_FOLDER_ID`

## 5. Refresh Google Spreadsheet
Setelah reload, menu `Website Kelurahan` akan muncul.

Pilih:

`Website Kelurahan → Tes koneksi dua arah`

Jika berhasil, akan muncul pesan bahwa endpoint aktif dan Firestore dapat dibaca.

## 6. Aktifkan otomatis
Pilih:

`Website Kelurahan → Aktifkan sinkron otomatis`

Saat pertama kali dijalankan, Google meminta izin. Izinkan akses Spreadsheet dan koneksi eksternal.

Sistem akan:
1. menarik data Firestore ke sheet terlebih dahulu;
2. menambahkan kolom tersembunyi `Firestore ID`;
3. memasang trigger onEdit;
4. memasang trigger Firestore → Spreadsheet setiap 1 menit.

## 7. Tes Spreadsheet → Admin/Website
Gunakan sheet `Data RT`.

1. Pilih satu RT yang sudah ada, misalnya RT 01.
2. Ubah `Nama Ketua RT` menjadi `TEST DUA ARAH`.
3. Tunggu beberapa detik.
4. Buka Admin → Data RT.
5. RT 01 harus menampilkan `TEST DUA ARAH`.
6. Halaman publik `/data-rt` juga harus mengikuti Firestore.

Jangan membuat RT baru untuk tes pertama. Edit record yang sudah ada agar hasil mudah diverifikasi.

## 8. Tes Admin → Spreadsheet
1. Dari Admin → Data RT, ubah kembali nama Ketua RT 01 menjadi `TEST DARI ADMIN`.
2. Simpan.
3. Jangan edit baris RT 01 di spreadsheet selama proses tes.
4. Maksimal sekitar 1 menit, spreadsheet harus berubah menjadi `TEST DARI ADMIN`.

Jika ingin langsung tanpa menunggu, pilih:

`Website Kelurahan → Tarik semua perubahan dari Admin`

## 9. Tes tanpa menunggu 1 menit
Untuk pengujian cepat:

- Spreadsheet → Admin: edit satu sel pada baris data.
- Admin → Spreadsheet: setelah menyimpan Admin, klik `Tarik semua perubahan dari Admin`.

Setelah dua arah terbukti, gunakan trigger otomatis 1 menit untuk pemakaian normal.

## 10. Modul yang sudah dua arah
- Data RT ↔ `rts`
- Pemerintahan ↔ `officials`
- Kegiatan/Berita ↔ `posts`
- Pengumuman ↔ `announcements`
- Agenda ↔ `agendas`
- UMKM ↔ `umkm`
- Fasilitas ↔ `facilities`
- Surat ↔ `serviceRequests`
- Pengaduan ↔ `complaints`

## 11. Aturan penting
- Firestore adalah database pusat.
- Jangan menghapus kolom tersembunyi `Firestore ID`.
- Untuk menghapus/menonaktifkan data, gunakan status aktif/publikasi. Sinkron otomatis tidak menghapus dokumen Firestore hanya karena baris spreadsheet dihapus. Ini sengaja dibuat untuk mencegah data Admin terhapus karena konflik sinkronisasi.
- Jika Admin dan Spreadsheet mengubah field yang sama hampir bersamaan, perubahan terakhir yang masuk ke Firestore akan menjadi nilai terakhir.

## 12. Jika menu tidak muncul
1. Pastikan `Code.gs` tersimpan.
2. Refresh Spreadsheet.
3. Jalankan fungsi `onOpen` sekali dari Apps Script jika diperlukan.
4. Beri izin saat diminta.

## 13. Jika tes koneksi gagal 401
`SYNC_SECRET` di Apps Script tidak sama dengan `SPREADSHEET_SYNC_SECRET` di Vercel.

## 14. Jika tes koneksi 404
Source terbaru belum ter-deploy atau endpoint `/api/spreadsheet-mirror` belum masuk ke repository website.

## 15. Jika 500
Periksa Vercel Function Logs dan konfigurasi Firebase Admin yang sudah digunakan project.
