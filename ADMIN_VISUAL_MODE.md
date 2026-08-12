# Admin Visual Mode

Perubahan ini membuat dashboard administrasi lebih mudah dipahami oleh operator non-teknis.

## Prinsip tampilan

- Halaman dokumen tunggal seperti Beranda, Wilayah, Kontak, dan Pengaturan tidak lagi langsung membuka formulir panjang.
- Admin melihat pratinjau website publik terlebih dahulu melalui iframe internal.
- Formulir baru dibuka setelah admin menekan tombol **Edit Halaman**.
- Halaman berbasis koleksi seperti Layanan, Berita, Hero Banner, Pengumuman, Agenda, Aparatur, Galeri, Dokumen, dan Data RT ditampilkan dalam bentuk kartu visual, bukan tabel database.
- Setiap kartu memiliki tindakan **Edit** dan **Hapus**.
- Tombol **Tambah** berada di bagian atas halaman.
- Profil Kelurahan juga membuka pratinjau publik terlebih dahulu; editor lengkap hanya muncul setelah klik **Edit Profil**.
- Foto di Galeri ditampilkan sebagai kartu foto dengan tombol **Edit** dan **Hapus**.

## Hubungan dengan Firebase

Tidak ada perubahan nama koleksi atau struktur data Firestore. Semua proses tambah/edit/hapus tetap menggunakan koleksi yang sama seperti sebelumnya. Perubahan ini hanya mengubah pengalaman antarmuka admin.

## KKN

Bagian KKN tetap statis sesuai keputusan sebelumnya dan tidak menjadi konten yang dapat diubah dari dashboard Admin.
