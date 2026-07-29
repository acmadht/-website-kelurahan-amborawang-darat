# Validasi Proyek

Pemeriksaan yang telah dilakukan sebelum ZIP dibuat:

- Seluruh file TypeScript dan TSX diperiksa dengan TypeScript transpiler
- Seluruh import lokal diperiksa dan ditemukan valid
- `package.json`, `firebase.json`, dan `firestore.indexes.json` diperiksa sebagai JSON valid
- Script `bootstrap-admin.mjs` dan `seed.mjs` lulus pemeriksaan sintaks Node.js
- Struktur route publik dan route admin diperiksa
- Firestore Rules disesuaikan dengan query publik berita dan galeri
- Galeri publik memakai pagination 12 foto per permintaan
- Tidak ada `.env.local`, service account JSON, API secret, atau node_modules di dalam proyek

Catatan:

`npm install`, `npm run typecheck`, dan `npm run build` belum dapat dijalankan di lingkungan pembuatan ZIP karena registry paket npm tidak tersedia dari container kerja. Versi dependency telah disesuaikan dengan rilis stabil yang tersedia pada 29 Juli 2026. Jalankan tiga perintah tersebut pada komputer lokal setelah ekstraksi.
