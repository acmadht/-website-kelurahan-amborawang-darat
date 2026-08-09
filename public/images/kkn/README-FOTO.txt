TIM KKN - FOTO
==============
Simpan foto di:
public/images/kkn/

01-dosen-pembimbing.jpg
02-ketua.jpg
03-sekretaris.jpg
04-bendahara.jpg
05-media-syarifah.jpg
06-media-devi.jpg
07-media-ikhtiara.jpg
08-humas-hylmi.jpg
09-logistik-elisyah.jpg
10-logistik-abdul.jpg
11-logistik-helmi.jpg
struktur-organisasi-kkn.png

Halaman menggunakan teknik:
- foreground object-fit: contain
- blurred background cover
Agar badan/orang pada foto tetap terlihat utuh dan tidak terpotong.

Route:
src/app/tim-kkn/page.tsx

Komponen:
src/components/public/KknPage.tsx


FLIP CARD
=========
Kartu anggota sekarang hanya berbalik saat diklik / ditap.
- Klik pertama: bagian belakang / detail
- Klik kedua: kembali ke foto
- Hover tidak membalik kartu
- Bisa dipakai dengan keyboard
- Responsif untuk HP
