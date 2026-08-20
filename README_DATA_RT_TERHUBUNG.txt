DATA RT TERHUBUNG - KELURAHAN AMBORAWANG DARAT
================================================

Versi ini menjadikan Data RT sebagai pusat ringkasan wilayah untuk setiap modul yang memang mempunyai hubungan RT.

ALUR DATA OTOMATIS
------------------
1. Penduduk -> Data RT
   - Jumlah penduduk aktif
   - Laki-laki
   - Perempuan
   - Balita
   - Lansia
   - No. KK pada Penduduk juga dapat membantu menghitung KK per RT bila modul Keluarga belum diisi.

2. Keluarga / KK -> Data RT
   - Jumlah KK per RT
   - Jumlah anggota keluarga mengikuti penduduk aktif dengan No. KK yang sama.
   - RT keluarga mengikuti RT mayoritas anggota aktif pada No. KK tersebut.

3. Bansos -> Data RT
   - RT bantuan dapat mengikuti NIK Penduduk atau No. KK.
   - Data RT menyimpan hanya JUMLAH agregat bantuan, bukan identitas penerima.

4. UMKM -> Data RT
   - RT UMKM dapat terhubung melalui RT yang diisi dan NIK pemilik bila tersedia.
   - Data RT menghitung jumlah UMKM publik/aktif per RT.

5. Fasilitas -> Data RT
   - Daftar fasilitas pada detail RT berasal dari menu Fasilitas.
   - Jumlah fasilitas per RT dihitung otomatis.
   - Setelah modul Fasilitas pernah menjadi sumber, menghapus fasilitas terakhir akan membersihkan daftar lama pada Data RT.

6. Inventaris -> Data RT
   - Inventaris sekarang mempunyai field RT Lokasi.
   - Bila Lokasi/Nama Fasilitas sama dengan nama pada modul Fasilitas, RT inventaris dapat mengikuti RT fasilitas.
   - Data RT menghitung jumlah jenis dan kuantitas inventaris per RT.

7. Mutasi -> Data RT
   - RT Asal dan RT Tujuan dihitung sebagai catatan mutasi yang terkait dengan RT.
   - Mutasi tidak otomatis memindahkan Penduduk agar kesalahan input mutasi tidak mengubah data warga tanpa verifikasi.

8. Permohonan Surat -> Data RT
   - Bila RT kosong dan NIK ditemukan pada Penduduk, RT permohonan dapat terisi otomatis.
   - Jumlah permohonan per RT hanya tampil pada Admin Data RT.

9. Pengaduan -> Data RT
   - RT pengaduan menggunakan pilihan RT 01-13.
   - Jumlah pengaduan per RT hanya tampil pada Admin Data RT.

HALAMAN PUBLIK YANG SALING TERHUBUNG
------------------------------------
- /data-rt?rt=02 membuka detail RT 02.
- Dari detail RT tersedia tautan terfilter ke:
  /penduduk?rt=02
  /keluarga?rt=02
  /fasilitas?rt=02
  /umkm?rt=02
  /bansos?rt=02
  /inventaris?rt=02
  /mutasi?rt=02
- Navigasi Penduduk/Keluarga/Mutasi/Bansos/Inventaris mempertahankan filter RT yang sama.
- Badge RT pada UMKM dan Fasilitas dapat diklik untuk kembali ke detail Data RT.

PRIVASI
-------
Halaman publik hanya menampilkan statistik/agregat yang aman. NIK, No. KK, nama penerima bansos, identitas pemohon surat, isi pengaduan, dan data pribadi lainnya tidak ditampilkan pada halaman publik.

SETELAH MEMASANG SOURCE
-----------------------
1. Jalankan/deploy source terbaru.
2. Login Admin.
3. Buka Admin -> Data RT.
4. Halaman akan melakukan sinkronisasi otomatis sekali. Bila diperlukan klik tombol "Sinkronkan Data".
5. Coba ubah satu data Penduduk/Fasilitas/UMKM/Bansos/Inventaris, lalu cek Data RT dan halaman publik terkait.

Firestore Rules tidak perlu diubah khusus untuk perubahan ini apabila sudah memakai Rules versi KKN/final sebelumnya, karena tidak ada collection baru.
