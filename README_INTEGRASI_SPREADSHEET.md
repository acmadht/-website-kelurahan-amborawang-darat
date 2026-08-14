# Integrasi Spreadsheet ke Website Kelurahan Amborawang Darat

## Status versi ini

Versi ini sudah menyiapkan alur Google Spreadsheet -> Apps Script -> `/api/spreadsheet-sync` -> Firestore -> website Next.js.

Fitur yang sudah ditambahkan:

- sinkronisasi Data RT ke `rts`,
- statistik agregat ke `villageStats/main`,
- sinkronisasi Pemerintahan ke `officials`,
- Berita/Kegiatan ke `posts`,
- Pengumuman ke `announcements`,
- Agenda publik ke `agendas`,
- UMKM publik ke `umkm`,
- Fasilitas publik ke `facilities`,
- halaman publik `/umkm`,
- halaman publik `/fasilitas`,
- statistik Penduduk, KK, Laki-laki, Perempuan, dan RT pada beranda,
- menu dan pencarian website untuk UMKM dan Fasilitas,
- sitemap untuk `/umkm` dan `/fasilitas`.

Kelurahan menggunakan struktur Kelurahan -> RT -> Keluarga -> Penduduk. Sistem ini tidak menggunakan RW.

## Privasi

Endpoint hanya menerima sheet yang telah di-whitelist. Sheet Penduduk, Keluarga, Bansos, Pengaduan, Inventaris, dan data internal lain tidak mempunyai jalur sinkronisasi publik.

Untuk modul yang memiliki kolom publikasi, server sekarang hanya menyimpan baris yang memang diizinkan tampil. Data draft atau baris `Tampil Website = Tidak` tidak disimpan ke koleksi publik.

NIK, nomor KK, NIP/NIK aparatur, dan NIK pemilik UMKM sengaja tidak dikirim melalui endpoint publik.

## Sheet yang didukung

| Sheet | Firestore | Fungsi |
|---|---|---|
| Data RT | `rts` + `villageStats/main` | RT dan statistik agregat |
| Pemerintahan | `officials` | Aparatur yang ditandai tampil di website |
| Kegiatan | `posts` + `announcements` | Konten berstatus Dipublikasikan |
| Agenda | `agendas` | Agenda dengan Tampil Website = Ya |
| UMKM | `umkm` | UMKM aktif dengan Tampil Website = Ya |
| Fasilitas | `facilities` | Fasilitas dengan Tampil Website = Ya |

## Environment variable di Vercel

Tambahkan:

`SPREADSHEET_SYNC_SECRET=<rahasia-panjang-random>`

Gunakan nilai acak yang kuat. Jangan menaruh secret pada kode frontend atau sel spreadsheet.

Firebase Admin environment variables project harus tetap tersedia:

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

Setelah menambah environment variable, redeploy website.

## Menyiapkan Google Spreadsheet

1. Upload master Excel ke Google Drive.
2. Buka sebagai Google Spreadsheet.
3. Jangan mengubah nama sheet publik dan nama header pada baris 4.
4. Buka **Extensions -> Apps Script**.
5. Salin isi `scripts/google-apps-script/Code.gs`.
6. Buka **Project Settings -> Script Properties**.
7. Tambahkan:
   - `SYNC_ENDPOINT` = `https://website-kelurahan-amborawang-darat.vercel.app/api/spreadsheet-sync`
   - `SYNC_SECRET` = nilai yang sama dengan `SPREADSHEET_SYNC_SECRET` di Vercel.
8. Reload spreadsheet.

Menu **Website Kelurahan** akan muncul.

## Cara penggunaan pegawai

1. Isi atau perbarui data pada spreadsheet.
2. Untuk data publik, isi status publikasi atau `Tampil Website = Ya`.
3. Periksa kembali data yang memang boleh dilihat masyarakat.
4. Klik **Website Kelurahan -> Sinkronkan sheet aktif**.
5. Untuk memperbarui seluruh data publik, gunakan **Sinkronkan semua data publik**.
6. Website mengambil perubahan dari Firestore.

Pada fase awal gunakan sinkronisasi manual. Jangan memakai trigger setiap kali sel diedit sampai alur kerja pegawai sudah stabil.

## Statistik beranda

Saat sheet Data RT disinkronkan, endpoint menjumlahkan:

- jumlah penduduk,
- jumlah KK,
- laki-laki,
- perempuan,
- RT aktif.

Hasil disimpan di `villageStats/main`. Beranda website membaca dokumen tersebut. Yang ditampilkan hanya angka agregat, bukan identitas penduduk.

## Halaman UMKM

URL: `/umkm`

Hanya UMKM dengan:

- Status = `Aktif`, dan
- Tampil Website = `Ya`

yang dikirim ke koleksi publik.

NIK pemilik tidak dikirim. Halaman dapat menampilkan nama usaha, jenis usaha, produk, alamat publik, RT, kontak, lokasi Maps, dan foto.

## Halaman Fasilitas

URL: `/fasilitas`

Hanya fasilitas dengan `Tampil Website = Ya` yang dikirim. Halaman dapat menampilkan kategori, nama fasilitas, alamat, RT, kondisi, pengelola, status, foto, dan lokasi.

## Aturan sinkronisasi

Setiap dokumen hasil spreadsheet memiliki:

- `syncSource`,
- `syncedAt`.

Endpoint hanya menghapus dokumen lama yang sebelumnya berasal dari sheet yang sama. Data manual admin tanpa `syncSource` tidak ikut dihapus.

## Tahap berikutnya

Tahap pengembangan selanjutnya yang disarankan:

1. halaman cek surat dengan token atau QR verifikasi,
2. form pengaduan masyarakat dengan nomor tiket,
3. sinkronisasi statistik wilayah ke halaman Wilayah,
4. filter pencarian UMKM dan fasilitas,
5. akses operator kelurahan yang lebih sederhana,
6. trigger sinkronisasi terjadwal setelah penggunaan manual stabil.

## V3 - Pelayanan Surat dan Pengaduan

Versi ini menambahkan pelayanan dua arah antara website, Firestore, dan Google Spreadsheet.

### Halaman publik baru
- `/permohonan-surat` - pengajuan data awal permohonan surat.
- `/cek-surat` - pengecekan status dengan tiket `SR-YYYYMMDD-XXXXXX`.
- `/pengaduan` - pengaduan masyarakat.
- `/cek-pengaduan` - pengecekan tindak lanjut dengan tiket `PG-YYYYMMDD-XXXXXX`.

### Koleksi internal Firestore
- `serviceRequests` untuk permohonan surat.
- `complaints` untuk pengaduan.

Koleksi ini berisi data internal. Jangan membuat Firestore Rules yang memberi akses baca publik langsung ke kedua koleksi tersebut. Pengecekan status dilakukan melalui API server yang hanya mengembalikan status dan informasi minimum.

### Menu Google Spreadsheet
Menu **Website Kelurahan** sekarang memiliki:
1. Sinkronkan sheet aktif.
2. Sinkronkan semua data.
3. Tarik permohonan surat dari website.
4. Tarik pengaduan dari website.
5. Atur koneksi.

Saat petugas memilih **Tarik permohonan surat dari website**, permohonan baru dari Firestore dimasukkan ke sheet `Surat` berdasarkan `ID Surat`. Data yang sudah pernah masuk tidak digandakan. Mekanisme yang sama berlaku pada sheet `Pengaduan`.

Setelah petugas mengubah `Status`, `Nomor Surat`, `Tanggal Selesai`, `Keterangan`, `Tindak Lanjut`, atau `Petugas`, jalankan sinkronisasi sheet. Status baru kemudian dapat dilihat warga melalui halaman cek status.

### Environment variable
Tetap gunakan:

`SPREADSHEET_SYNC_SECRET=<secret-panjang-dan-acak>`

`SYNC_ENDPOINT` pada Apps Script diarahkan ke:

`https://DOMAIN-WEBSITE/api/spreadsheet-sync`

Apps Script otomatis menurunkan endpoint inbox menjadi `/api/spreadsheet-inbox`.

### Catatan privasi
- NIK, No. KK, nomor HP, identitas pelapor, isi pengaduan, dan keperluan surat tidak dikembalikan oleh API cek status.
- Tiket dibuat acak dan tidak mengandung identitas warga.
- Data bansos dan data kependudukan tetap tidak memiliki endpoint publik individual.

## V4 - Surat Otomatis, PDF, dan QR Verifikasi

Versi ini menyelesaikan alur surat sampai pembuatan dokumen final dari Google Spreadsheet.

### Fitur baru

Menu **Website Kelurahan** pada Google Spreadsheet sekarang memiliki:

- **Beri nomor surat baris aktif**
- **Buat PDF + QR surat baris aktif**
- **Buat PDF semua surat selesai**
- **Buat template surat default**

Alur final:

`Permohonan website -> Firestore -> Sheet Surat -> verifikasi petugas -> nomor surat -> status Selesai -> PDF + QR -> sinkronisasi -> halaman verifikasi website`

### Penomoran surat

Sistem tidak memaksakan format nomor surat karena format resmi harus mengikuti tata naskah dinas yang digunakan kelurahan.

Tambahkan Script Property:

`LETTER_NUMBER_PATTERN`

Contoh teknis saja:

`470/{SEQ}/KEL-AD/{ROMAN_MONTH}/{YEAR}`

Token yang tersedia:

- `{SEQ}` nomor urut tiga digit
- `{MONTH}` bulan dua digit
- `{ROMAN_MONTH}` bulan Romawi
- `{YEAR}` tahun empat digit
- `{TYPE}` jenis surat
- `{RT}` nomor RT

Sesuaikan pola tersebut dengan aturan resmi sebelum dipakai untuk produksi.

### Template Google Docs

Ada dua pilihan:

1. Jalankan **Website Kelurahan -> Buat template surat default**. Sistem membuat template dasar di Google Drive dan menyimpan ID-nya otomatis.
2. Gunakan template Google Docs resmi milik kelurahan, lalu isi Script Property `LETTER_TEMPLATE_ID` dengan ID dokumen tersebut.

Placeholder yang didukung:

- `{{ID_SURAT}}`
- `{{NOMOR_SURAT}}`
- `{{TANGGAL}}`
- `{{NAMA}}`
- `{{NIK}}`
- `{{RT}}`
- `{{JENIS_SURAT}}`
- `{{KEPERLUAN}}`
- `{{PETUGAS}}`
- `{{URL_VERIFIKASI}}`

Template default hanya kerangka teknis. Kop surat, redaksi hukum, pejabat penandatangan, nomor klasifikasi, dan format tata naskah harus disesuaikan dengan ketentuan resmi kelurahan.

### Folder output

Jika `LETTER_OUTPUT_FOLDER_ID` belum diatur, Apps Script otomatis membuat folder Google Drive:

`Surat Kelurahan Amborawang Darat - Otomatis`

ID folder kemudian disimpan sebagai Script Property.

PDF final ditulis kembali ke kolom **Link Dokumen** pada sheet Surat.

### QR verifikasi

QR mengarah ke:

`https://DOMAIN-WEBSITE/verifikasi-surat/ID-SURAT`

Halaman ini hanya menampilkan:

- ID verifikasi
- jenis surat
- nomor surat
- status
- tanggal selesai

Halaman tidak menampilkan NIK, No. KK, nomor HP, alamat, atau keperluan pemohon.

QR dibuat sebagai gambar PNG oleh QuickChart QR API. Jika layanan QR eksternal sedang tidak tersedia, PDF tetap dapat dibuat dan URL verifikasi tetap ditulis ke spreadsheet. QR dapat dibuat ulang kemudian.

### Script Properties lengkap

Minimum:

- `SYNC_ENDPOINT`
- `SYNC_SECRET`

Untuk surat otomatis:

- `WEBSITE_BASE_URL`
- `LETTER_TEMPLATE_ID`
- `LETTER_OUTPUT_FOLDER_ID` (opsional, dapat dibuat otomatis)
- `LETTER_NUMBER_PATTERN`

Contoh `WEBSITE_BASE_URL`:

`https://website-kelurahan-amborawang-darat.vercel.app`

### Aturan pembuatan PDF

PDF final hanya dibuat jika:

- `ID Surat` terisi
- `Nama Pemohon` terisi
- `Jenis Surat` terisi
- `Nomor Surat` terisi
- `Status` = `Selesai`

Setelah PDF dibuat, sistem mengisi:

- `Link Dokumen`
- `URL Verifikasi`
- `Tampil Cek Publik = Ya` jika kolom tersebut masih kosong

Kemudian Apps Script mencoba menyinkronkan sheet Surat kembali ke website.

### Verifikasi publik versus cek status

`/cek-surat` ditujukan kepada pemohon yang memegang nomor tiket.

`/verifikasi-surat/[id]` ditujukan untuk memeriksa bahwa surat tercatat pada sistem. Halaman verifikasi hanya aktif untuk dokumen yang diizinkan melalui kolom `Tampil Cek Publik`.

### Privasi dokumen PDF

Link Google Drive pada kolom `Link Dokumen` tidak otomatis dibuat publik oleh script. File mengikuti hak akses Google Drive pemilik/folder. Ini disengaja agar PDF tidak menjadi dokumen publik hanya karena tercatat di spreadsheet.

### Catatan pengujian

Syntax Google Apps Script pada `Code.gs` telah diperiksa. Paket source yang diberikan pengguna hanya berisi folder `src` dan tidak menyertakan `package.json`, sehingga build Next.js penuh tidak dapat dijalankan pada paket source parsial ini. Setelah file ditempatkan kembali pada repository Next.js lengkap, jalankan build project sebelum deployment ke Vercel.

---

## V5 - Sinkronisasi dua arah otomatis
Versi V5 menambahkan endpoint `GET /api/spreadsheet-mirror` dan trigger Apps Script dua arah.

Untuk langkah pengujian dari nol, baca `TEST_DUA_ARAH.md`.

Perubahan utama:
- setiap record memakai `Firestore ID` yang sama di Admin dan Spreadsheet;
- edit spreadsheet mengirim hanya baris yang diedit;
- perubahan Admin ditarik otomatis ke Spreadsheet setiap 1 menit;
- tersedia menu `Tarik semua perubahan dari Admin` untuk tes instan;
- sinkronisasi spreadsheet menggunakan upsert dan tidak menghapus dokumen Firestore secara otomatis untuk mengurangi risiko kehilangan data.
