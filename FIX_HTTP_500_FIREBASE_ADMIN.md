# Fix HTTP 500 spreadsheet-mirror

Penyebab log Vercel:
`firebase-admin/auth -> jwks-rsa -> jose` mengalami `ERR_REQUIRE_ESM`.

Perbaikan:
- `src/lib/firebase/admin-db.ts` hanya memuat `firebase-admin/app` dan `firebase-admin/firestore`.
- route sinkronisasi spreadsheet menggunakan `admin-db.ts`, sehingga tidak memuat Auth.
- `src/lib/firebase/admin.ts` tetap khusus route yang memang membutuhkan verifikasi Firebase Auth.

## Setelah merge
1. Pastikan env Vercel tersedia:
   - FIREBASE_ADMIN_PROJECT_ID
   - FIREBASE_ADMIN_CLIENT_EMAIL
   - FIREBASE_ADMIN_PRIVATE_KEY
   - SPREADSHEET_SYNC_SECRET
2. Redeploy Production.
3. Di Google Sheet jalankan `Tarik semua perubahan dari Admin`.
4. Cek Data RT dulu.

Jika route Auth lain masih mengalami ERR_REQUIRE_ESM, itu masalah dependency tree Auth terpisah dan perlu diperbaiki melalui package.json/lockfile. Fix ini sengaja membuat sinkronisasi Firestore tidak bergantung pada Auth.
