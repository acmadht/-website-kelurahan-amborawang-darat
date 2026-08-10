# Finishing SEO Google - Kelurahan Amborawang Darat

Source ini sudah menambahkan fondasi SEO teknis agar Google dapat merayapi, merender, dan memahami halaman publik website dengan lebih baik.

## Yang sudah dipasang

- Canonical URL berbeda dan benar untuk setiap halaman publik.
- Metadata title, description, Open Graph, Twitter Card, robots index/follow.
- Google Search Console verification melalui `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` atau field admin `googleSiteVerification`.
- `robots.txt` membuka halaman publik dan menutup `/admin/` serta `/api/` dari crawling biasa.
- `sitemap.xml` berisi seluruh halaman utama dan berita published.
- Structured data JSON-LD `WebSite` dan `GovernmentOrganization` pada homepage.
- Structured data `BreadcrumbList` pada halaman publik.
- Structured data `NewsArticle` pada detail berita.
- Berita dinamis dari Firestore dirender dari server terlebih dahulu agar isi artikel tidak hanya bergantung pada JavaScript browser.
- Data dinamis utama pada Beranda, Profil, Pemerintahan, Layanan, Wilayah, Data RT, Galeri, Dokumen, Kontak, dan Berita diberi initial server data dari Firestore, lalu tetap realtime melalui listener Firebase di browser.
- Halaman admin tetap `noindex`.

## Environment Vercel yang harus tersedia

Pastikan Production Environment Vercel memiliki konfigurasi proyek yang sebelumnya digunakan website, terutama:

```text
NEXT_PUBLIC_SITE_URL=https://website-kelurahan-amborawang-darat.vercel.app
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=q5ReWo_LtIesXBuf1nT7-ETCqNrgxzzg_XSFq6m7er4
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY=...
```

Variabel Firebase client yang sudah digunakan website tetap harus dipertahankan. Jangan menghapus environment variable lama.

## Setelah deploy

1. Buka `https://website-kelurahan-amborawang-darat.vercel.app/robots.txt` dan pastikan tidak error.
2. Buka `https://website-kelurahan-amborawang-darat.vercel.app/sitemap.xml` dan pastikan semua halaman penting muncul.
3. Masuk Google Search Console dan pastikan property website sudah terverifikasi.
4. Menu `Sitemaps`: kirim `sitemap.xml`.
5. Menu `URL Inspection`: cek homepage, lalu pilih Request Indexing.
6. Ulangi Request Indexing untuk `/profil`, `/pemerintahan`, `/layanan`, `/berita`, `/wilayah`, `/data-rt`, `/galeri`, `/dokumen`, dan `/kontak` secara bertahap.
7. Setiap berita baru otomatis masuk sitemap jika statusnya `published` dan bukan kategori KKN dinamis.

## Catatan

Tidak ada kode website biasa yang dapat memaksa Google mengindeks halaman secara instan. Google menentukan waktu crawling dan indexing. Google Indexing API juga bukan API untuk halaman website umum, melainkan dibatasi untuk tipe konten tertentu seperti JobPosting dan BroadcastEvent. Untuk website kelurahan, jalur yang benar adalah sitemap, internal link, metadata yang benar, structured data, konten server-rendered, Search Console, dan Request Indexing.
