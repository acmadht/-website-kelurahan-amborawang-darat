WEBSITE KELURAHAN AMBORAWANG DARAT
Pembaruan: Halaman & Data Saling Terhubung

1. PENDUDUK -> DATA RT + KELUARGA + BERANDA
   - Penduduk aktif per RT menjadi sumber jumlah penduduk RT.
   - Jenis kelamin menjadi sumber laki-laki/perempuan per RT.
   - Tanggal lahir digunakan untuk ringkasan balita (<5 tahun) dan lansia (>=60 tahun).
   - No. KK menghubungkan Penduduk ke Keluarga dan dapat menghitung jumlah anggota keluarga.
   - Ringkasan Data RT kemudian membentuk villageStats/main untuk statistik beranda.

2. KELUARGA / KK -> DATA RT + BERANDA
   - RT pada data Keluarga menjadi sumber jumlah KK per RT.
   - No. KK menjadi penghubung dengan Penduduk dan Bansos.

3. BANSOS -> PENDUDUK / KELUARGA
   - Jika field RT Bansos kosong, sistem mencoba mencari RT berdasarkan NIK Penduduk.
   - Jika NIK tidak cocok, sistem mencoba No. KK pada Keluarga.
   - Identitas tetap hanya di admin. Publik hanya menampilkan agregat.

4. MUTASI -> PENDUDUK (ALUR KERJA)
   - Mutasi disimpan sebagai riwayat administrasi.
   - Setelah mencatat pindah masuk/keluar, antar RT, meninggal, atau perubahan domisili,
     admin diarahkan ke Penduduk untuk memperbarui status domisili/RT/tanggal.
   - Mutasi tidak otomatis mengubah Penduduk untuk mencegah perubahan identitas yang salah.

5. INVENTARIS <-> FASILITAS / WILAYAH
   - Tidak digabung otomatis karena aset dan fasilitas adalah jenis data yang berbeda.
   - Hubungan dilakukan melalui lokasi aset dan tautan halaman terkait.

6. TOMBOL SINKRONKAN DATA
   - Tersedia pada admin Penduduk, Keluarga/KK, Data RT, dan Bansos.
   - Menjalankan sinkronisasi ulang statistik terkait tanpa harus mengedit satu per satu.

7. NAVIGASI PUBLIK
   - Data Publik terhubung ke Penduduk, KK, Mutasi, Bansos, Inventaris.
   - Data Publik juga terhubung ke Data RT, Wilayah, Fasilitas, UMKM, dan Layanan.
   - Setiap halaman data memiliki bagian "Data saling terhubung".
   - Data RT terhubung ke Penduduk, Keluarga, Fasilitas, dan Data Publik.
   - UMKM/Fasilitas memiliki tautan kontekstual ke halaman terkait.
   - Footer sekarang menyediakan akses langsung ke Data Publik, Data RT, Penduduk,
     Fasilitas, dan UMKM.

8. SPREADSHEET SYNC
   - Sinkronisasi sheet Penduduk, Keluarga, Bansos, dan Data RT otomatis memicu
     perhitungan hubungan data di atas.

CATATAN KEAMANAN
- NIK, No. KK, nama penerima bansos, alamat pribadi, dan data identitas tidak dibuka
  pada halaman publik.
- Statistik publik bersifat agregat.
