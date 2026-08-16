FIX VERCEL BUILD - Amborawang Darat

Error yang diperbaiki:
./src/components/public/PublicAdministrativeDataPage.tsx:79:21
Type error: 'totals.population' is of type 'unknown'.

Perbaikan:
1. Menambahkan type RtTotals dengan seluruh properti numerik.
2. Mengubah rts.reduce(...) menjadi rts.reduce<RtTotals>(...).
3. Menambahkan type PublicRtTotals pada src/app/data-publik/page.tsx sebagai pencegahan error inferensi reduce serupa.
4. Logika dan tampilan website tidak diubah.

Setelah mengganti source, jalankan kembali npm run build atau redeploy ke Vercel.
