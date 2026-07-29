# Website Kelurahan CMS

Website publik dan dashboard admin untuk kelurahan. Proyek menggunakan Next.js, TypeScript, Firebase Authentication, Cloud Firestore, Cloudinary, dan Vercel.

## Fitur utama

- Tema navy dan putih yang responsif
- Animasi ringan, hero slider, counter statistik, hover, dan reveal saat scroll
- Website tetap menampilkan data contoh sebelum Firebase dihubungkan
- Semua konten utama dapat diganti melalui dashboard admin
- Profil kelurahan, aparatur, struktur, RW, RT, layanan, berita, pengumuman, agenda, dokumen, dan kontak
- Galeri album dengan upload beberapa foto sekaligus
- Galeri dan profil khusus kelompok KKN
- Formulir pesan masyarakat
- Login admin menggunakan Firebase Email/Password
- Hak akses superadmin, editor, dan operator RT
- Upload gambar ke Cloudinary melalui API server yang memverifikasi token admin
- Firestore Security Rules dan index sudah tersedia

## Persyaratan

- Node.js minimal 20.9
- Akun Firebase
- Akun Cloudinary
- Akun GitHub dan Vercel untuk publikasi

## 1. Menjalankan website di komputer

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

Tanpa konfigurasi Firebase, website publik tetap tampil dengan data contoh. Dashboard admin belum dapat dipakai sampai Firebase dihubungkan.

## 2. Menyiapkan Firebase

### Buat proyek

1. Buka Firebase Console.
2. Buat proyek baru.
3. Tambahkan aplikasi Web.
4. Salin konfigurasi Web App ke `.env.local`.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Aktifkan Authentication

1. Masuk ke Authentication.
2. Pilih Sign-in method.
3. Aktifkan Email/Password.
4. Buat akun admin pertama.
5. Salin UID akun tersebut.

### Buat Firestore

1. Masuk ke Firestore Database.
2. Buat database.
3. Pilih lokasi terdekat yang tersedia.
4. Jangan biarkan aturan test mode untuk website publik.

### Buat profil superadmin

Buat collection `users` dan document dengan ID yang sama seperti UID akun Firebase Authentication.

```json
{
  "name": "Admin Kelurahan",
  "email": "admin@example.com",
  "role": "superadmin",
  "isActive": true
}
```

### Pasang Firestore Rules

Cara paling mudah memakai Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules,firestore:indexes
```

File yang dipakai:

- `firestore.rules`
- `firestore.indexes.json`
- `firebase.json`

## 3. Menyiapkan Firebase Admin

Firebase Admin diperlukan agar server dapat memeriksa token sebelum upload gambar.

1. Firebase Console, Project Settings.
2. Buka Service accounts.
3. Pilih Generate new private key.
4. Ambil `project_id`, `client_email`, dan `private_key`.
5. Masukkan ke `.env.local`.

```env
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Jangan memasukkan file JSON service account ke GitHub.

## 4. Menyiapkan Cloudinary

1. Buat akun Cloudinary.
2. Ambil Cloud name, API key, dan API secret.
3. Masukkan ke `.env.local`.

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=website-kelurahan
```

Upload dari dashboard akan:

- Memeriksa token Firebase admin
- Membatasi file awal maksimal 8 MB
- Mengubah gambar menjadi WebP
- Membatasi sisi gambar maksimal 1.920 piksel
- Menyimpan URL dan public ID ke Firestore

Jumlah foto tidak dibatasi oleh kode. Kapasitas nyata tetap mengikuti kuota akun Cloudinary dan bandwidth.

## 5. Login dashboard

Buka:

```text
http://localhost:3000/admin/login
```

Masuk menggunakan akun Email/Password yang sudah dibuat pada Firebase Authentication.

## 6. Urutan pengisian konten

1. Pengaturan Website
2. Hero Banner
3. Profil Kelurahan
4. Aparatur
5. Data RW
6. Data RT
7. Layanan
8. Berita
9. Pengumuman
10. Agenda
11. Galeri
12. Tim KKN
13. Dokumen
14. Pengguna Admin

## 7. Deploy ke Vercel

1. Upload proyek ke GitHub.
2. Import repository pada Vercel.
3. Tambahkan semua environment variables dari `.env.local` ke Project Settings, Environment Variables.
4. Deploy.
5. Setelah environment variables diubah, lakukan redeploy.

Jangan mengunggah `.env.local` ke GitHub.

## 8. Bagian yang diganti tanpa coding

Semua bagian berikut diubah melalui admin:

- Nama dan logo kelurahan
- Slogan, alamat, kontak, jam pelayanan, dan peta
- Animasi dan slider
- Banner utama
- Profil, sejarah, visi, misi, potensi, dan fasilitas
- Nama, jabatan, foto, dan masa jabatan aparatur
- Data RW dan RT
- Layanan dan persyaratan
- Berita, pengumuman, dan agenda
- Album dan foto galeri
- Profil serta anggota kelompok KKN
- Dokumen publik

## 9. Bagian yang masih membutuhkan coding

Coding hanya diperlukan apabila menambah fungsi baru yang belum tersedia, misalnya:

- Pengajuan surat online dengan NIK dan dokumen pribadi
- Sistem antrean
- Tanda tangan elektronik
- Notifikasi WhatsApp otomatis
- Integrasi data pemerintah lain
- Pembayaran

## 10. Pemeriksaan sebelum website resmi dipublikasikan

- Ganti semua data contoh
- Buat minimal dua akun superadmin
- Pastikan Firestore Rules sudah terpasang
- Pastikan API secret tidak ada di GitHub
- Uji login, tambah, edit, hapus, upload, dan logout
- Uji tampilan ponsel
- Periksa seluruh nomor telepon dan tautan
- Gunakan alamat domain resmi pemerintah jika tersedia
- Hindari menyimpan NIK, KK, KTP, dan data sensitif warga pada versi awal

## Perintah proyek

```bash
npm run dev
npm run typecheck
npm run build
npm run start
```
