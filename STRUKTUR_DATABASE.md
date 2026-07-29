# Struktur Database Firestore

- `siteSettings/main`: identitas dan pengaturan website
- `pages/profil`: sejarah, visi, misi, wilayah, potensi, fasilitas
- `heroSlides`: banner beranda
- `officials`: lurah dan aparatur
- `rws`: data RW
- `rts`: data RT
- `services`: layanan masyarakat
- `posts`: berita
- `announcements`: pengumuman
- `agendas`: agenda kegiatan
- `galleryAlbums`: album galeri
- `galleryPhotos`: foto dengan relasi `albumId`
- `kknTeam/main`: identitas kelompok KKN
- `kknMembers`: anggota kelompok KKN
- `documents`: dokumen publik
- `messages`: pesan masyarakat
- `users/{uid}`: profil dan hak akses admin
- `activityLogs`: disediakan untuk pengembangan log aktivitas

## Peran pengguna

- `superadmin`: seluruh konten dan profil pengguna
- `editor`: seluruh konten, tidak dapat mengubah profil pengguna berdasarkan rules
- `operator_rt`: dapat memperbarui dokumen RT sesuai `rtId`
