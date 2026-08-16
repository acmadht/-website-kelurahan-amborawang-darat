UPDATE KKN EDITABLE DARI ADMIN
Website Kelurahan Amborawang Darat

PERUBAHAN UTAMA
1. Menu KKN di dashboard Admin sekarang aktif dan memiliki sub-menu:
   - Tim & Identitas
   - Program Kerja
   - Berita KKN
   - Galeri KKN
   - Book Chapter
   - Luaran KKN

2. Data publik KKN sekarang dapat membaca Firestore:
   - kknTeam/main
   - kknMembers
   - kknPrograms
   - posts dengan category = KKN
   - galleryAlbums dengan category = KKN + galleryPhotos
   - kknBookChapters
   - kknOutputs

3. Data lama di src/data/kknStatic.ts tetap menjadi fallback agar halaman KKN tidak langsung kosong.

4. Pada Admin > KKN > Tim & Identitas tersedia tombol:
   "Impor Data KKN Lama ke Admin"
   Klik sekali untuk menyalin data KKN lama ke Firestore agar bisa diedit dari dashboard.

5. Berita KKN dan Galeri KKN tetap terpisah dari berita/galeri resmi kelurahan dengan category = KKN.

CARA PASANG
1. Backup folder src lama.
2. Replace folder src menggunakan folder src dari paket ini.
3. Firebase Console > Firestore Database > Rules.
4. Replace/padukan Rules dengan file firestore_rules_kkn_editable.rules dari paket ini lalu Publish.
5. Jalankan/redeploy website.
6. Login Admin.
7. Buka KKN > Tim & Identitas.
8. Klik "Impor Data KKN Lama ke Admin" satu kali.
9. Setelah berhasil, edit data KKN dari masing-masing sub-menu.

CATATAN
- Role superadmin dan editor dapat mengelola KKN mengikuti helper isEditor() pada Firestore Rules.
- operator_rt tetap diarahkan hanya ke Data RT Saya.
- Halaman publik KKN dibuat force-dynamic pada bagian yang mengambil Firestore server agar perubahan admin terbaca setelah refresh.
- Book Chapter mendukung daftar penulis satu nama per baris serta link PDF/dokumen.
- Galeri KKN memiliki album dan pengelolaan foto terpisah dari galeri kelurahan.
