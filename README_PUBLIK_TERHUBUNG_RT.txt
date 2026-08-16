UPDATE: STATISTIK PUBLIK TERHUBUNG DENGAN DATA RT
=================================================

Perubahan utama:
1. /keluarga sekarang membaca tiga sumber server-side:
   - families
   - residents
   - rts

2. Jika koleksi families belum terisi, halaman Statistik Keluarga / KK memakai agregat Admin -> Data RT:
   - Keluarga / KK = total familyCount seluruh RT aktif
   - Anggota keluarga tercatat = total populationCount seluruh RT aktif
     (atau jumlah Penduduk aktif jika data Penduduk sudah tersedia)
   - Rata-rata anggota = anggota / jumlah KK
   - RT terdata = RT yang mempunyai familyCount > 0
   - Sebaran keluarga per RT = familyCount masing-masing RT

3. Jika data families sudah tersedia, data families menjadi sumber jumlah KK dan sebaran keluarga.
   Data residents yang aktif menjadi sumber jumlah anggota bila sudah tersedia.

4. /penduduk juga memakai Data RT sebagai fallback jika koleksi residents masih kosong.

5. /data-publik memakai Data RT sebagai fallback untuk kartu Penduduk dan Keluarga agar tidak tampil 0 selama data rinci belum dimigrasikan.

6. /keluarga, /penduduk, /data-publik, dan /data-rt dibuat force-dynamic (revalidate = 0), sehingga reload halaman selalu membaca Firestore terbaru.

CATATAN
-------
- Setelah mengubah data di Admin, halaman publik yang sudah terbuka di tab lain perlu di-refresh untuk mengambil render server terbaru.
- Detail NIK, No. KK, nama, dan alamat tetap tidak dibuka di browser publik.
- Data RT agregat aman dipakai sebagai fallback publik karena memang merupakan ringkasan wilayah.

PEMBARUAN DATA PUBLIK LENGKAP:
- /data-publik sekarang menampilkan agregat: jumlah warga, KK, laki-laki, perempuan, rumah, balita, lansia, dan RT aktif.
- /data-publik sekarang memiliki tabel lengkap per RT termasuk fasilitas.
- /penduduk sekarang menampilkan seluruh statistik aman dari Data RT, bukan hanya laki-laki/perempuan.
- Data tetap memakai Firestore terbaru (force-dynamic), sehingga perubahan Data RT akan terlihat setelah reload halaman publik.
