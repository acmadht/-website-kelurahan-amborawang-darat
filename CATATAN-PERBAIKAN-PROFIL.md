# Perbaikan Halaman Profil Amborawang Darat

## Isi perubahan

- Tampilan halaman profil dibangun ulang agar tidak monoton dan tetap responsif.
- Foto Kantor Kelurahan Amborawang Darat ditampilkan sebagai elemen utama dengan kredit fotografer.
- Sejarah disusun berdasarkan perubahan administratif Kecamatan Samboja Barat.
- Ditambahkan kartu data ringkas: luas wilayah, penduduk, jumlah RT, dan jarak ke ibu kota kecamatan.
- Ditambahkan lini masa perkembangan administratif.
- Visi pelayanan dan lima misi ditampilkan dalam komposisi visual yang berbeda.
- Kondisi geografis dan batas wilayah disajikan melalui kartu arah mata angin.
- Potensi kelurahan dibagi menjadi pertanian, UMKM, pendidikan, dan konektivitas.
- Fasilitas umum dibuat dalam daftar kartu yang dapat dikelola melalui admin.
- Ditambahkan bagian prioritas pengembangan wilayah dan tombol koreksi data.
- Nilai awal pada halaman admin Profil dan script seed sudah diperbarui.
- Data lama bawaan proyek yang masih berupa teks contoh akan otomatis diganti dengan konten profil baru pada halaman publik.

## Acuan data

1. BPS Kabupaten Kutai Kartanegara, Kecamatan Samboja Barat Dalam Angka 2024, untuk data tahun 2023.
2. Peraturan Daerah Kabupaten Kutai Kartanegara Nomor 6 Tahun 2020 tentang Pembentukan Kecamatan Samboja Barat.
3. Peraturan Bupati Kutai Kartanegara Nomor 43 Tahun 2019 tentang batas Kelurahan Amborawang Darat.
4. Referensi Data Kemendikdasmen untuk SD Negeri 005 Samboja dan SMP Negeri 2 Samboja.
5. Wikimedia Commons, foto Kantor Kelurahan Amborawang Darat oleh Arief R. Sandan atau Ezagren, diambil 19 September 2015.

## Catatan validasi

- Rumusan visi dan misi pada patch merupakan rumusan pelayanan untuk profil digital. Rumusan tersebut belum dinyatakan sebagai visi dan misi resmi kelurahan karena dokumen penetapan resmi belum ditemukan. Ubah melalui dashboard admin setelah dokumen resmi tersedia.
- Foto kantor yang tersedia merupakan dokumentasi tahun 2015 dan masih menunjukkan Kecamatan Samboja pada papan kantor. Ganti melalui admin apabila tersedia foto kantor terbaru.
- Jumlah 13 RT mengikuti laporan lokal Mei 2026. Publikasi BPS dengan data tahun 2023 masih mencatat 12 RT. Kelurahan perlu mengonfirmasi angka yang berlaku sebelum publikasi final.
- Ringkasan batas arah utara, timur, selatan, dan barat disederhanakan dari enam segmen batas dalam Perbup Nomor 43 Tahun 2019. Dokumen dan peta koordinat resmi tetap menjadi acuan hukum.
- Data penduduk dan fasilitas perlu diperbarui secara berkala melalui dashboard admin.

## Cara memasang

1. Ekstrak ZIP ke folder utama proyek.
2. Pilih Replace atau Overwrite untuk seluruh file.
3. Hapus folder cache `.next`.
4. Jalankan `npm run dev`.
5. Buka `/profil` dan lakukan hard refresh dengan `Ctrl + F5`.

## Pemeriksaan

- `npm run typecheck` berhasil tanpa kesalahan TypeScript.
- `node --check scripts/seed.mjs` berhasil.
- Build penuh tidak dapat dijalankan di lingkungan pembuatan patch karena paket SWC Next.js untuk Linux tidak tersedia pada cache lingkungan. Kegagalan tersebut bukan kesalahan TypeScript pada patch.
