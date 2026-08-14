# V7 FIX FINAL - Spreadsheet ↔ Firestore tanpa firebase-admin pada route spreadsheet

## Masalah yang diperbaiki
Deployment sebelumnya gagal pada `/api/spreadsheet-mirror` dengan error:

`ERR_REQUIRE_ESM: require() of ES Module .../jose/... from jwks-rsa ...`

Route spreadsheet kini **tidak mengimpor `firebase-admin` sama sekali**. Akses Firestore dilakukan melalui Firestore REST API dengan service account dan modul bawaan Node.js (`node:crypto` + `fetch`). Karena itu route spreadsheet tidak lagi memuat `firebase-admin/auth`, `jwks-rsa`, atau `jose`.

## File utama yang wajib di-merge
- `src/lib/firebase/firestore-rest-admin.ts`
- `src/app/api/spreadsheet-health/route.ts`
- `src/app/api/spreadsheet-mirror/route.ts`
- `src/app/api/spreadsheet-sync/route.ts`
- `scripts/google-apps-script/Code.gs`

## Route database publik yang juga dipindahkan ke REST
Agar error dependency yang sama tidak muncul pada layanan publik:
- `src/app/api/spreadsheet-inbox/route.ts`
- `src/app/api/cek-surat/route.ts`
- `src/app/api/cek-pengaduan/route.ts`
- `src/app/api/layanan-surat/route.ts`
- `src/app/api/pengaduan/route.ts`
- `src/app/api/contact/route.ts`

Route Admin yang benar-benar memerlukan Firebase Auth tetap boleh menggunakan `src/lib/firebase/admin.ts`.

## Environment Variables Vercel
Wajib:

- `SPREADSHEET_SYNC_SECRET`
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

`FIREBASE_ADMIN_PRIVATE_KEY` boleh berisi newline asli atau `\\n`. Jangan menambahkan key ke source code.

## Script Properties Google Apps Script
- `SYNC_ENDPOINT=https://website-kelurahan-amborawang-darat.vercel.app/api/spreadsheet-sync`
- `SYNC_SECRET=<sama persis dengan SPREADSHEET_SYNC_SECRET>`
- `WEBSITE_BASE_URL=https://website-kelurahan-amborawang-darat.vercel.app`

## Urutan deployment
1. Merge seluruh folder `src` dari paket ini ke source project asli.
2. Ganti `scripts/google-apps-script/Code.gs` di Apps Script bila masih memakai versi lama.
3. Commit dan push ke branch Production (`main` bila itu branch Vercel Anda).
4. Tunggu Vercel hingga status `Ready` dan `Production`.
5. Di Google Sheet reload halaman.
6. Pilih `Website Kelurahan → Tes koneksi dua arah`.
7. Jika sukses, pilih `Website Kelurahan → Samakan data awal dari Admin (buat backup)`.
8. Setelah data sama, pilih `Website Kelurahan → Aktifkan sinkron otomatis`.

## Endpoint diagnostik
Setelah deploy, `Code.gs` menguji:

`/api/spreadsheet-health`

Endpoint ini memeriksa secret, service account, OAuth access token, dan akses Firestore. Jika gagal, error dikembalikan sebagai JSON singkat, bukan halaman HTML Next.js panjang.

## Catatan penting
- Jangan hapus kolom `Firestore ID` di Google Sheet.
- Firestore tetap menjadi sumber data utama.
- Data Penduduk, Keluarga, Bansos, dan data sensitif lain tidak dipublikasikan per individu.
