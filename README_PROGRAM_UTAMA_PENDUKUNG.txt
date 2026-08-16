UPDATE PROGRAM KERJA KKN — PROGRAM UTAMA & PROGRAM PENDUKUNG

Perubahan:
1. Admin > KKN > Program Kerja memiliki field wajib “Jenis Program”.
2. Pilihan Jenis Program: Program Utama / Program Pendukung.
3. Status tetap terpisah: Rencana / Berjalan / Selesai / Ditunda.
4. Halaman publik /kkn/program-kerja memisahkan Program Utama dan Program Pendukung.
5. Ringkasan hero menampilkan Total Program, Program Utama, Program Pendukung, dan Periode KKN.
6. Data Firestore lama yang belum mempunyai programType tetap tampil dan diperlakukan sebagai Program Utama sampai diedit.
7. Tidak ada perubahan Firestore Rules karena field baru tersimpan di collection kknPrograms yang sama.

Field baru Firestore:
programType: "Program Utama" | "Program Pendukung"

Contoh:
{
  code: "UTM-001",
  programType: "Program Utama",
  title: "Digitalisasi Administrasi Kelurahan",
  status: "Rencana"
}

{
  code: "PDK-001",
  programType: "Program Pendukung",
  title: "Gotong Royong",
  status: "Rencana"
}
