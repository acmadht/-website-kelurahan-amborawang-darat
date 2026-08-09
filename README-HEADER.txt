RESTORE HEADER PUBLIK
=====================

Paket ini HANYA mengganti:
src/components/public/PublicHeader.tsx
src/components/public/PublicHeader.module.css

Tidak menyentuh:
- src/app/admin
- src/components/admin
- halaman publik lain
- Firebase admin
- Tim KKN

Header versi ini:
- navy modern
- sticky
- logo lebih compact
- brand kiri tetap rapi
- navigasi desktop
- dropdown Informasi
- active state halaman
- tombol pencarian
- Ctrl+K membuka pencarian
- search modal
- mobile menu
- responsive HP/tablet
- kontak WhatsApp pada menu mobile

CARA PASANG:
Copy folder src dari ZIP ke project dan pilih Replace untuk 2 file yang sama.
JANGAN hapus seluruh folder src.
Setelah itu restart:
npm run dev
dan browser Ctrl+F5.
