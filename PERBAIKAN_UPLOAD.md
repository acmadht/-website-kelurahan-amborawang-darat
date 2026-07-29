# Perbaikan Upload Gambar

## Langkah wajib setelah memasang versi ini

1. Pastikan `.env.local` masih berisi kredensial Firebase dan Cloudinary.
2. Isi kembali sementara:

```env
BOOTSTRAP_ADMIN_EMAIL=admin.kelurahan@gmail.com
BOOTSTRAP_ADMIN_PASSWORD=PASSWORD_ADMIN_YANG_DIPAKAI_LOGIN
BOOTSTRAP_ADMIN_NAME=Administrator Kelurahan
UPLOAD_ALLOWED_EMAILS=admin.kelurahan@gmail.com
```

3. Jalankan:

```bash
npm install
npm run bootstrap-admin
npm run check-upload
```

4. Hentikan server dengan `Ctrl + C`, lalu jalankan:

```bash
npm run dev
```

5. Klik **Keluar** dari dashboard. Login kembali. Langkah ini wajib agar Firebase menerbitkan token baru yang berisi hak `superadmin`.
6. Coba unggah gambar JPG kecil, sekitar 200 KB sampai 1 MB.

## Membaca hasil pemeriksaan

`npm run check-upload` harus menampilkan:

- `OK Firebase Auth`
- Claims berisi `role: superadmin` dan `isActive: true`
- `OK Cloudinary`

Jika Cloudinary gagal, periksa Cloud name, API key, API secret, firewall, VPN, dan koneksi port 443.
