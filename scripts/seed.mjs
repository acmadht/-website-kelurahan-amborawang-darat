import { cert, getApps, initializeApp } from "firebase-admin/app";
import { initializeFirestore, FieldValue } from "firebase-admin/firestore";

function app() {
  if (getApps().length) return getApps()[0];
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) throw new Error("Konfigurasi Firebase Admin belum lengkap di .env.local");
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

process.env.FIRESTORE_PREFER_REST = "true";
const db = initializeFirestore(app(), { preferRest: true, ignoreUndefinedProperties: true });
const batch = db.batch();
const set = (collection, id, data) => batch.set(db.collection(collection).doc(id), { ...data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });

set("siteSettings", "main", {
  siteName: "Website Resmi Kelurahan",
  villageName: "Kelurahan Contoh",
  tagline: "Melayani dengan cepat, transparan, dan profesional",
  logoUrl: "/images/logo-placeholder.svg",
  officeImageUrl: "/images/office.svg",
  address: "Jl. Pelayanan Masyarakat No. 1, Kecamatan Contoh",
  phone: "0541-000000",
  whatsapp: "6281234567890",
  email: "kelurahan@example.go.id",
  serviceHours: "Senin sampai Jumat, 08.00 sampai 15.00 WITA",
  mapsEmbedUrl: "",
  instagramUrl: "#",
  facebookUrl: "#",
  youtubeUrl: "#",
  footerText: "Pemerintah Kelurahan Contoh",
  seoTitle: "Website Resmi Kelurahan Contoh",
  seoDescription: "Informasi, layanan, berita, dan kegiatan Kelurahan Contoh.",
  animationEnabled: true,
  heroAutoplay: true,
  heroInterval: 7000,
  whatsappEnabled: true
});
set("pages", "profil", {
  history: "Amborawang Darat telah menjadi salah satu kelurahan dalam wilayah administratif Kecamatan Samboja, Kabupaten Kutai Kartanegara. Perkembangan permukiman, aktivitas masyarakat, pendidikan, pertanian, perdagangan, dan pelayanan pemerintahan membentuk karakter wilayah ini dari waktu ke waktu.\n\nMelalui Peraturan Daerah Kabupaten Kutai Kartanegara Nomor 6 Tahun 2020, Amborawang Darat ditetapkan sebagai salah satu kelurahan dalam Kecamatan Samboja Barat. Kecamatan baru tersebut mulai menjalankan pemerintahan secara efektif pada 15 Februari 2023. Perubahan administratif ini mendekatkan koordinasi pembangunan dan pelayanan publik kepada masyarakat.\n\nSaat ini, Kelurahan Amborawang Darat terus memperkuat pelayanan administrasi, keterbukaan informasi, partisipasi warga, pengembangan potensi ekonomi lokal, dan pengelolaan lingkungan yang berkelanjutan.",
  vision: "Terwujudnya Kelurahan Amborawang Darat yang tertib, responsif, transparan, berdaya, dan berkelanjutan dalam memberikan pelayanan kepada masyarakat.",
  missions: [
    "Meningkatkan pelayanan publik yang cepat, jelas, ramah, dan mudah diakses.",
    "Memperkuat keterbukaan informasi serta pengelolaan data kelurahan yang akurat.",
    "Mendorong partisipasi masyarakat dalam perencanaan, pembangunan, dan pengawasan lingkungan.",
    "Mendukung pengembangan UMKM, pertanian, pendidikan, dan kegiatan produktif masyarakat.",
    "Menjaga kebersihan, ketertiban, keamanan, serta keberlanjutan lingkungan kelurahan."
  ],
  geography: "Kelurahan Amborawang Darat berada di Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur. Luas wilayahnya sekitar 19,47 km² atau 4,68 persen dari luas Kecamatan Samboja Barat. Jarak menuju ibu kota kecamatan sekitar 5,3 km. Wilayah ini berada pada kawasan beriklim tropis basah dan terhubung dengan koridor Jalan Balikpapan–Handil II serta jaringan jalan lingkungan.",
  boundaries: "Batas administratif Kelurahan Amborawang Darat ditetapkan melalui Peraturan Bupati Kutai Kartanegara Nomor 43 Tahun 2019. Wilayah yang berbatasan langsung meliputi Kelurahan Margomulyo, Kelurahan Argosari, Kelurahan Amborawang Laut, Kelurahan Salok Api Laut, Kelurahan Salok Api Darat, dan Desa Tani Bhakti.",
  potential: "Potensi wilayah mencakup pertanian dan hortikultura, usaha mikro dan perdagangan lokal, pendidikan, kegiatan sosial kemasyarakatan, serta posisi strategis pada koridor pengembangan Samboja Barat. Pengembangan potensi diarahkan pada peningkatan nilai tambah usaha warga, penguatan kapasitas sumber daya manusia, perbaikan infrastruktur dasar, dan pengelolaan lingkungan.",
  facilities: [
    "Kantor Kelurahan Amborawang Darat dan layanan administrasi masyarakat",
    "SD Negeri 005 Samboja",
    "SMP Negeri 2 Samboja",
    "MI Al Fatah Samboja dan satuan pendidikan keagamaan",
    "Layanan kesehatan dalam wilayah kerja Puskesmas Sungai Merdeka",
    "Tempat ibadah dan fasilitas sosial kemasyarakatan",
    "Jalan Balikpapan–Handil II dan jaringan jalan lingkungan",
    "Sarana perdagangan serta ruang usaha masyarakat"
  ],
  imageUrl: "/images/kantor-kelurahan-amborawang-darat.jpg"
});
set("kknTeam", "main", {
  universityName: "Universitas Contoh",
  groupName: "Kelompok KKN",
  year: "2026",
  location: "Kelurahan Contoh",
  supervisorName: "Dosen Pembimbing Lapangan",
  description: "Website dikembangkan sebagai program kerja digitalisasi informasi dan pelayanan publik kelurahan.",
  logoUrl: "/images/logo-kkn.svg",
  groupPhotoUrl: "/images/kkn-team.svg"
});

const collections = {
  heroSlides: [
    ["hero-1", { title: "Selamat Datang di Website Resmi Kelurahan", subtitle: "Akses informasi dan layanan masyarakat secara mudah, cepat, dan terbuka.", imageUrl: "/images/logo-amborawang.png", primaryButtonText: "Lihat Layanan", primaryButtonUrl: "/layanan", secondaryButtonText: "Hubungi Kami", secondaryButtonUrl: "/kontak", order: 1, isActive: true }],
    ["hero-2", { title: "Kelurahan Aktif, Masyarakat Terhubung", subtitle: "Berita, agenda, pengumuman, galeri, data RT, dan data RW tersedia dalam satu website.", imageUrl: "/images/logo-amborawang.png", primaryButtonText: "Baca Berita", primaryButtonUrl: "/berita", secondaryButtonText: "Lihat Galeri", secondaryButtonUrl: "/galeri", order: 2, isActive: true }]
  ],
  services: [
    ["layanan-1", { name: "Administrasi Kependudukan", slug: "administrasi-kependudukan", category: "Administrasi", icon: "ID", summary: "Informasi pengantar KTP, KK, kelahiran, kematian, dan perpindahan penduduk.", requirements: ["Fotokopi KK", "Dokumen pendukung sesuai keperluan"], procedures: ["Siapkan persyaratan", "Datang ke loket", "Petugas melakukan verifikasi"], duration: "1 hari kerja", cost: "Gratis", order: 1, isFeatured: true, isActive: true }],
    ["layanan-2", { name: "Surat Keterangan Usaha", slug: "surat-keterangan-usaha", category: "Surat Keterangan", icon: "SU", summary: "Panduan pengurusan surat keterangan usaha untuk warga dan pelaku UMKM.", requirements: ["Fotokopi KTP", "Fotokopi KK", "Surat pengantar RT"], procedures: ["Ajukan berkas", "Verifikasi petugas", "Penandatanganan"], duration: "1 hari kerja", cost: "Gratis", order: 2, isFeatured: true, isActive: true }],
    ["layanan-3", { name: "Pengaduan Masyarakat", slug: "pengaduan-masyarakat", category: "Pengaduan", icon: "PM", summary: "Sampaikan aspirasi, keluhan, atau laporan terkait pelayanan dan lingkungan.", requirements: ["Identitas pelapor", "Uraian laporan"], procedures: ["Kirim laporan", "Verifikasi", "Tindak lanjut"], duration: "Sesuai jenis laporan", cost: "Gratis", order: 3, isFeatured: true, isActive: true }]
  ],
  officials: [
    ["official-1", { name: "Nama Lurah", title: "Lurah", category: "Kelurahan", photoUrl: "/images/person-1.svg", description: "Memimpin penyelenggaraan pemerintahan dan pelayanan masyarakat.", order: 1, isActive: true }],
    ["official-2", { name: "Nama Sekretaris", title: "Sekretaris Kelurahan", category: "Kelurahan", photoUrl: "/images/person-2.svg", order: 2, isActive: true }],
    ["official-3", { name: "Nama Kepala Seksi", title: "Kepala Seksi Pemerintahan", category: "Kelurahan", photoUrl: "/images/person-3.svg", order: 3, isActive: true }]
  ],
  rws: [
    ["rw-01", { number: "01", chairmanName: "Ketua RW 01", populationCount: 910, familyCount: 245, order: 1, isActive: true }],
    ["rw-02", { number: "02", chairmanName: "Ketua RW 02", populationCount: 840, familyCount: 220, order: 2, isActive: true }]
  ],
  rts: [
    ["rt-01", { rwId: "rw-01", number: "01", chairmanName: "Ketua RT 01", populationCount: 300, familyCount: 80, order: 1, isActive: true }],
    ["rt-02", { rwId: "rw-01", number: "02", chairmanName: "Ketua RT 02", populationCount: 310, familyCount: 82, order: 2, isActive: true }],
    ["rt-03", { rwId: "rw-02", number: "03", chairmanName: "Ketua RT 03", populationCount: 290, familyCount: 76, order: 3, isActive: true }]
  ],
  posts: [
    ["post-1", { title: "Pelayanan Administrasi Kelurahan Semakin Mudah", slug: "pelayanan-administrasi-kelurahan-semakin-mudah", summary: "Kelurahan meningkatkan keterbukaan informasi persyaratan dan alur pelayanan.", content: "Kelurahan terus meningkatkan kualitas pelayanan melalui penyediaan informasi yang jelas dan pemanfaatan website resmi.", coverImageUrl: "/images/news-1.svg", category: "Pelayanan", status: "published", isFeatured: true, order: 1, publishedAt: FieldValue.serverTimestamp() }],
    ["post-2", { title: "Kerja Bakti Warga untuk Lingkungan Bersih", slug: "kerja-bakti-warga-untuk-lingkungan-bersih", summary: "Warga bersama perangkat kelurahan melaksanakan kerja bakti.", content: "Kegiatan melibatkan warga, ketua RT, ketua RW, dan unsur kelurahan.", coverImageUrl: "/images/news-2.svg", category: "Lingkungan", status: "published", isFeatured: false, order: 2, publishedAt: FieldValue.serverTimestamp() }]
  ],
  announcements: [
    ["announcement-1", { title: "Perubahan Jam Pelayanan Hari Jumat", summary: "Pelayanan hari Jumat dibuka pukul 08.00 sampai 11.30 WITA.", priority: "penting", isActive: true, order: 1 }]
  ],
  agendas: [
    ["agenda-1", { title: "Rapat Koordinasi RT dan RW", date: "2026-08-03", time: "09.00 WITA", location: "Aula Kelurahan", organizer: "Pemerintah Kelurahan", description: "Koordinasi pelayanan dan kegiatan masyarakat.", status: "akan-datang", order: 1 }]
  ],
  galleryAlbums: [
    ["album-1", { title: "Kegiatan Pelayanan Masyarakat", slug: "kegiatan-pelayanan-masyarakat", category: "Kelurahan", description: "Dokumentasi pelayanan dan koordinasi masyarakat.", coverImageUrl: "/images/gallery-1.svg", eventDate: "2026-07-20", photoCount: 1, isFeatured: true, status: "published", order: 1 }],
    ["album-2", { title: "Program Kerja Kelompok KKN", slug: "program-kerja-kelompok-kkn", category: "KKN", description: "Dokumentasi program kerja dan pembuatan website.", coverImageUrl: "/images/gallery-2.svg", eventDate: "2026-07-25", photoCount: 1, isFeatured: true, status: "published", order: 2 }]
  ],
  galleryPhotos: [
    ["photo-1", { albumId: "album-1", imageUrl: "/images/gallery-1.svg", publicId: "demo-1", caption: "Pelayanan masyarakat", order: 1 }],
    ["photo-2", { albumId: "album-2", imageUrl: "/images/gallery-2.svg", publicId: "demo-2", caption: "Program kerja KKN", order: 1 }]
  ],
  kknMembers: [
    ["member-1", { name: "Nama Ketua", role: "Ketua", order: 1, isActive: true }],
    ["member-2", { name: "Nama Sekretaris", role: "Sekretaris", order: 2, isActive: true }],
    ["member-3", { name: "Nama Bendahara", role: "Bendahara", order: 3, isActive: true }]
  ],
  documents: [
    ["doc-1", { title: "Formulir Permohonan Surat Keterangan", category: "Formulir", year: "2026", description: "Formulir umum pengajuan surat keterangan.", fileUrl: "#", fileType: "PDF", isActive: true, order: 1 }]
  ]
};

for (const [collectionName, docs] of Object.entries(collections)) {
  for (const [id, data] of docs) set(collectionName, id, data);
}

await batch.commit();
console.log("Data contoh berhasil dimasukkan ke Firestore.");
console.log("Masuk ke dashboard admin dan ganti seluruh data contoh.");
