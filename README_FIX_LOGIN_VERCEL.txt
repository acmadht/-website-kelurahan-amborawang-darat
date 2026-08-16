FIX LOGIN VERCEL - AMBORAWANG DARAT
===================================

Masalah yang diperbaiki:
- Login menampilkan: Unexpected token '<', "<!DOCTYPE ..." is not valid JSON.
- Penyebab: /api/admin/profile di deployment Vercel mengembalikan HTML/404/500, sedangkan client memaksa response.json().

Perbaikan:
1. AuthProvider tidak lagi memaksa response.json().
2. Jika /api/admin/profile gagal/non-JSON, sistem fallback membaca users/{Firebase Auth UID} langsung dari Firestore.
3. isActive boolean true dan string "true" diterima untuk kompatibilitas data lama.
4. Pesan error login dibuat lebih spesifik.
5. firestore.rules diperbarui agar isActive lama "true" masih dianggap aktif.

WAJIB SETELAH DEPLOY:
- Publish firestore.rules yang ada di ZIP ini.
- Firebase Authentication -> copy UID akun admin.
- Firestore -> users -> Document ID harus sama persis dengan UID tersebut.
- Field role = superadmin (string)
- Field isActive = true (boolean dianjurkan; string "true" tetap diterima sementara).

Jika fallback menampilkan:
"Profil admin belum ditemukan pada users/<UID>"
berarti Document ID Firestore belum sama dengan UID Authentication.
