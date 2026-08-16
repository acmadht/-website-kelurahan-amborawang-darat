UPDATE DATA RT OTOMATIS — KELURAHAN AMBORAWANG DARAT
======================================================

Perubahan utama:
1. Statistik Data RT tidak perlu diketik ulang.
2. Koleksi residents / Administrasi Penduduk menjadi sumber otomatis untuk:
   - Jumlah Penduduk
   - Jumlah Laki-laki
   - Jumlah Perempuan
   - Jumlah Balita
   - Jumlah Lansia
3. Koleksi families / Keluarga-KK menjadi sumber otomatis untuk Jumlah KK per RT.
4. Jika warga dipindah dari RT 01 ke RT 02, RT asal dan RT tujuan sama-sama dihitung ulang.
5. Jika warga/KK terakhir meninggalkan suatu RT, statistik RT asal dapat turun menjadi 0. Ini memperbaiki bug versi sebelumnya yang mempertahankan angka lama.
6. Penduduk dengan status Pindah atau Meninggal tidak dihitung sebagai penduduk aktif.
7. Jumlah anggota pada Keluarga/KK dihitung ulang berdasarkan No. KK yang sama di Penduduk.
8. Data Bansos yang mempunyai NIK atau No. KK yang cocok ikut menyesuaikan RT saat warga/KK berpindah.
9. Membuka Admin > Data RT memicu rekalkulasi otomatis satu kali.
10. Menambah, mengedit, atau menghapus Penduduk/Keluarga/Data RT/Bansos tetap memicu rekalkulasi otomatis.

Kolom Data RT yang sekarang OTOMATIS / READ ONLY:
- Jumlah Penduduk
- Jumlah Kepala Keluarga
- Jumlah Laki-laki
- Jumlah Perempuan
- Jumlah Balita
- Jumlah Lansia

Kolom yang tetap dikelola manual di Data RT:
- Nomor RT
- Nama Ketua RT
- Foto Ketua RT
- Kontak Ketua RT
- Alamat / Area RT
- Jumlah Rumah
- Fasilitas Utama RT
- Keterangan Wilayah
- Urutan
- Tampilkan di Website

PENTING:
- Jika koleksi Penduduk sudah mempunyai data, angka demografi RT mengikuti Penduduk.
- Jika koleksi Keluarga/KK sudah mempunyai data, Jumlah KK RT mengikuti Keluarga/KK.
- Jadi jangan lagi menjadikan angka manual pada Data RT sebagai sumber utama setelah kedua modul administrasi tersebut mulai digunakan.

Cara pasang:
1. Backup source saat ini.
2. Replace folder src dengan folder src dari ZIP ini.
3. Tidak ada perubahan Firestore Rules khusus untuk update ini; firestore.rules dalam ZIP tetap dapat dipakai.
4. Restart Next.js: npm run dev
5. Login admin dan buka Admin > Data RT. Sistem akan menghitung ulang otomatis.
6. Uji: pindahkan satu Penduduk dari RT 01 ke RT 02 lalu Simpan. Periksa Data RT 01 dan RT 02.
