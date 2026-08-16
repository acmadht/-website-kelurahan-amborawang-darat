UPDATE FOTO INFORMASI TERKINI
Kelurahan Amborawang Darat

Perubahan:
1. Kartu Informasi Terkini di beranda sekarang menampilkan foto masing-masing item.
2. Berita memakai field coverImageUrl / Gambar Utama.
3. Pengumuman sekarang memiliki field Foto Pengumuman (imageUrl) di Admin > Pengumuman.
4. Agenda memakai field imageUrl / Gambar yang sudah tersedia.
5. Jika suatu item belum diberi foto, kartu tetap memakai fallback navy agar tampilan tidak rusak.
6. Foto memakai object-fit: cover sehingga memenuhi thumbnail tanpa merusak rasio kartu.
7. Spreadsheet sync Pengumuman juga mengenali kolom Gambar atau Link Foto.

CARA MENGISI FOTO:
- Berita: Admin > Berita > edit/tambah > Gambar Utama.
- Pengumuman: Admin > Pengumuman > edit/tambah > Foto Pengumuman.
- Agenda: Admin > Agenda > edit/tambah > Gambar.

Setelah menyimpan foto, refresh halaman beranda.
