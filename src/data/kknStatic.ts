import type {
  KknBookChapter,
  KknMember,
  KknOutput,
  KknProgram,
  KknTeam,
  PostItem,
} from "@/types";

/**
 * Data KKN awal / fallback.
 *
 * Website sekarang membaca data KKN dinamis dari Firestore dan dapat dikelola
 * melalui dashboard Admin. Data di file ini hanya dipakai sebagai cadangan
 * sebelum data lama diimpor ke Firestore atau bila koneksi server tidak tersedia.
 */

export type StaticKknGalleryItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  caption: string;
  size?: "wide" | "tall" | "normal";
};

export const staticKknTeam: KknTeam = {
  universityName: "Universitas Islam Negeri Sultan Aji Muhammad Idris Samarinda",
  groupName: "Kelompok 2 KKN Reguler",
  year: "2026",
  location: "Kelurahan Amborawang Darat",
  supervisorName: "Dr. Nur Kholik Afandi, S.Ag., M.Pd",
  supervisorPhotoUrl: "/images/kkn/01-dosen-pembimbing.jpg",
  supervisorDescription:
    "Mendampingi pelaksanaan program KKN, memberikan arahan akademik, serta memastikan kegiatan pengabdian berjalan terarah dan sesuai tujuan program.",
  description:
    "Tim KKN Reguler yang melaksanakan program pengabdian masyarakat dan mendukung pengembangan website Kelurahan Amborawang Darat.",
  logoUrl: "/images/logo-kkn.svg",
  groupPhotoUrl: "/images/kkn-team.svg",
  structureImageUrl: "/images/kkn/struktur-organisasi-kkn.png",
};

export const staticKknMembers: KknMember[] = [
  {
    name: "Achmad Aldi Saputra",
    studyProgram: "Sistem Informasi",
    nim: "2341919017",
    quote: "Jika Kamu Tidak Mengambil resiko, Kamu Tidak Akan Mendapatkan Masa Depan",
    role: "Ketua",
    division: "Pimpinan Tim",
    photoUrl: "/images/kkn/02-ketua.jpg",
    description:
      "Mengoordinasikan pelaksanaan program dan memastikan kegiatan tim berjalan terarah.",
    order: 1,
    isActive: true,
  },
  {
    name: "Norvina Alvionika",
    studyProgram: "Hukum Ekonomi Syariah",
    nim: "2221407035",
    quote: "Belajar Bukan Untuk Menjadi Sempurna, Tetapi Untuk Menjadi Lebih Baik.",
    role: "Sekretaris",
    division: "Administrasi",
    photoUrl: "/images/kkn/03-sekretaris.jpg",
    description:
      "Mendukung pencatatan, administrasi, dan penyusunan dokumentasi kegiatan tim.",
    order: 2,
    isActive: true,
  },
  {
    name: "Junita Noor Azzara",
    studyProgram: "Hukum Tata Negara",
    nim: "2321609063",
    quote: "Hidup Bukan Untuk Sempurna, Tapi Untuk Bermanfaat.",
    role: "Bendahara",
    division: "Keuangan",
    photoUrl: "/images/kkn/04-bendahara.jpg",
    description:
      "Mengelola pencatatan dan kebutuhan keuangan kegiatan KKN secara tertib.",
    order: 3,
    isActive: true,
  },
  {
    name: "Syarifah Rabiatul Adhawiyah",
    studyProgram: "Manajemen Pendidikan Islam",
    nim: "2311102020",
    quote: "فن الحب هو الشوك - Seni Cinta ialah Rindu.",
    role: "Anggota Media",
    division: "Media",
    photoUrl: "/images/kkn/05-media-syarifah.jpg",
    description:
      "Mendukung dokumentasi, publikasi, dan kebutuhan media kegiatan KKN.",
    order: 4,
    isActive: true,
  },
  {
    name: "Devi Sulistyowati",
    studyProgram: "Pendidikan Agama Islam",
    nim: "2311101123",
    quote: "Apa Yang Menjadi Takdirmu Tidak Akan Melewatkanmu, Dan Apa Yang Melewatkanmu Tidak Akan Pernah Menjadi Takdirmu. - Umar Bin Khattab",
    role: "Anggota Media",
    division: "Media",
    photoUrl: "/images/kkn/06-media-devi.jpg",
    description:
      "Mendukung dokumentasi, publikasi, dan kebutuhan media kegiatan KKN.",
    order: 5,
    isActive: true,
  },
  {
    name: "Ikhtiara Nada Maheswari",
    studyProgram: "Ilmu Al-Quran Dan Tafsir",
    nim: "2342115007",
    quote: "Tetap bertahan walau semuanya berantakan.",
    role: "Anggota Media",
    division: "Media",
    photoUrl: "/images/kkn/07-media-ikhtiara.jpg",
    description:
      "Mendukung dokumentasi, publikasi, dan kebutuhan media kegiatan KKN.",
    order: 6,
    isActive: true,
  },
  {
    name: "Muhammad Hylmi Ramadhan Ardani",
    studyProgram: "Manajemen Dakwah",
    nim: "2341913021",
    quote: "Ini Bukan Soal Apakah Aku Bisa, Aku Akan Melakukannya Karena Aku Menginginkannya.",
    role: "Anggota Humas",
    division: "Humas",
    photoUrl: "/images/kkn/08-humas-hylmi.jpg",
    description:
      "Mendukung komunikasi, koordinasi, serta hubungan tim dengan masyarakat dan pihak kelurahan.",
    order: 7,
    isActive: true,
  },
  {
    name: "Elisyah Febrianti",
    studyProgram: "Manajemen Bisnis Syariah",
    nim: "2331716058",
    quote: "I Love Being Cringe, I Love Being Annoying, I Love Being Weird. #Freedom",
    role: "Anggota Logistik",
    division: "Logistik",
    photoUrl: "/images/kkn/09-logistik-elisyah.jpg",
    description:
      "Mendukung kesiapan perlengkapan dan kebutuhan teknis pelaksanaan program.",
    order: 8,
    isActive: true,
  },
  {
    name: "Abdul Khakim",
    studyProgram: "Sistem Informasi",
    nim: "2341919006",
    quote: "Bahagia Itu Diciptakan Bukan Dicari.",
    role: "Anggota Logistik",
    division: "Logistik",
    photoUrl: "/images/kkn/10-logistik-abdul.jpg",
    description:
      "Mendukung kesiapan perlengkapan dan kebutuhan teknis pelaksanaan program.",
    order: 9,
    isActive: true,
  },
  {
    name: "Muhamad Helmi Yanur",
    studyProgram: "Pendidikan Bahasa Arab",
    nim: "2211203057",
    quote: "Babi Tu Haram.",
    role: "Anggota Logistik",
    division: "Logistik",
    photoUrl: "/images/kkn/11-logistik-helmi.jpg",
    description:
      "Mendukung kesiapan perlengkapan dan kebutuhan teknis pelaksanaan program.",
    order: 10,
    isActive: true,
  },
];

export const staticKknPrograms: KknProgram[] = [
  {
    code: "WEB",
    title: "Pengembangan Website Kelurahan",
    category: "Digitalisasi Informasi",
    description:
      "Pengembangan website kelurahan sebagai media pelayanan informasi, publikasi, dokumentasi kegiatan, dan akses masyarakat terhadap data publik.",
    objective:
      "Mendukung pengelolaan informasi kelurahan yang lebih terstruktur dan dapat diperbarui secara berkelanjutan.",
    target: "Pemerintah kelurahan dan masyarakat",
    schedule: "KKN Reguler 2026",
    personInCharge: "Kelompok 2 KKN Reguler",
    status: "Berjalan",
    linkUrl: "/",
    linkLabel: "Lihat Website",
    order: 1,
    isActive: true,
  },
];

export const staticKknPosts: PostItem[] = [
  {
    id: "static-kkn-koordinasi-program-kerja",
    slug: "koordinasi-program-kerja-kelompok-kkn",
    category: "KKN",
    title: "Koordinasi Program Kerja Kelompok KKN",
    summary:
      "Kelompok KKN memaparkan program kerja dan rencana pengembangan website kelurahan.",
    coverImageUrl: "/images/berita/koordinasi-program-kerja-kelompok-kkn.jpg",
    publishedDate: "6 Agustus 2026",
    publishedTime: "14.00 WITA",
    authorName: "Kelompok 2 KKN Reguler UINSI Samarinda",
    status: "published",
    isFeatured: true,
    content: [
      "Kelompok 2 KKN Reguler UINSI Samarinda melakukan koordinasi program kerja bersama pihak Kelurahan Amborawang Darat.",
      "Salah satu pembahasan utama adalah pengembangan website kelurahan sebagai media pelayanan informasi, dokumentasi kegiatan, publikasi berita, dan akses masyarakat terhadap data publik.",
      "Koordinasi dilakukan agar program yang dilaksanakan sesuai dengan kebutuhan kelurahan serta dapat digunakan secara berkelanjutan setelah kegiatan KKN selesai.",
      "Pengembangan website diharapkan menjadi salah satu kontribusi dalam mendukung transformasi pelayanan informasi publik di Kelurahan Amborawang Darat.",
    ].join("\n\n"),
  },
];

export const staticKknGalleryItems: StaticKknGalleryItem[] = [
  {
    id: "static-kkn-1",
    title: "Koordinasi Program Kerja KKN",
    category: "KKN",
    date: "6 Agustus 2026",
    image: "/images/galeri/koordinasi-kkn.jpg",
    caption:
      "Koordinasi program kerja bersama pihak Kelurahan Amborawang Darat.",
    size: "normal",
  },
  {
    id: "static-kkn-2",
    title: "Dokumentasi KKN",
    category: "KKN",
    date: "Agustus 2026",
    image: "/images/galeri/dokumentasi-kkn.jpg",
    caption:
      "Dokumentasi kegiatan Kelompok KKN di Kelurahan Amborawang Darat.",
    size: "normal",
  },
];

/** Fallback Book Chapter; versi utama dikelola melalui Firestore/Admin. */
export const staticKknBookChapters: KknBookChapter[] = [];

export const staticKknOutputs: KknOutput[] = [
  {
    code: "WEB",
    type: "Luaran Digital",
    title: "Website Kelurahan",
    description:
      "Website kelurahan dikembangkan untuk mendukung informasi publik, berita, dokumentasi kegiatan, data wilayah, layanan, dan pengelolaan konten kelurahan.",
    href: "/",
    linkLabel: "Lihat Website",
    order: 1,
    isActive: true,
  },
  {
    code: "BC",
    type: "Publikasi Tertulis",
    title: "Book Chapter",
    description:
      "Ruang khusus untuk publikasi Book Chapter dan luaran tertulis Tim KKN.",
    href: "/kkn/book-chapter",
    linkLabel: "Buka Book Chapter",
    order: 2,
    isActive: true,
  },
  {
    code: "BR",
    type: "Dokumentasi Naratif",
    title: "Berita KKN",
    description:
      "Arsip naratif aktivitas, koordinasi, perkembangan program, dan kegiatan KKN.",
    href: "/kkn/berita",
    linkLabel: "Lihat Berita KKN",
    order: 3,
    isActive: true,
  },
  {
    code: "GL",
    type: "Dokumentasi Visual",
    title: "Galeri KKN",
    description:
      "Dokumentasi visual kegiatan KKN yang dipisahkan dari galeri resmi kelurahan.",
    href: "/kkn/galeri",
    linkLabel: "Lihat Galeri KKN",
    order: 4,
    isActive: true,
  },
];
