import { AMBORAWANG_OFFICE_IMAGE } from "@/data/amborawang";

export interface ProfileContent {
  history: string;
  vision: string;
  missions: string[];
  geography: string;
  boundaries: string;
  potential: string;
  facilities: string[];
  imageUrl: string;
}

export const amborawangProfileFallback: ProfileContent = {
  history:
    "Amborawang Darat telah menjadi salah satu kelurahan dalam wilayah administratif Kecamatan Samboja, Kabupaten Kutai Kartanegara. Perkembangan permukiman, aktivitas masyarakat, pendidikan, pertanian, perdagangan, dan pelayanan pemerintahan membentuk karakter wilayah ini dari waktu ke waktu.\n\nMelalui Peraturan Daerah Kabupaten Kutai Kartanegara Nomor 6 Tahun 2020, Amborawang Darat ditetapkan sebagai salah satu kelurahan dalam Kecamatan Samboja Barat. Kecamatan baru tersebut mulai menjalankan pemerintahan secara efektif pada 15 Februari 2023. Perubahan administratif ini mendekatkan koordinasi pembangunan dan pelayanan publik kepada masyarakat.\n\nSaat ini, Kelurahan Amborawang Darat terus memperkuat pelayanan administrasi, keterbukaan informasi, partisipasi warga, pengembangan potensi ekonomi lokal, dan pengelolaan lingkungan yang berkelanjutan.",
  vision:
    "Terwujudnya Kelurahan Amborawang Darat yang tertib, responsif, transparan, berdaya, dan berkelanjutan dalam memberikan pelayanan kepada masyarakat.",
  missions: [
    "Meningkatkan pelayanan publik yang cepat, jelas, ramah, dan mudah diakses.",
    "Memperkuat keterbukaan informasi serta pengelolaan data kelurahan yang akurat.",
    "Mendorong partisipasi masyarakat dalam perencanaan, pembangunan, dan pengawasan lingkungan.",
    "Mendukung pengembangan UMKM, pertanian, pendidikan, dan kegiatan produktif masyarakat.",
    "Menjaga kebersihan, ketertiban, keamanan, serta keberlanjutan lingkungan kelurahan.",
  ],
  geography:
    "Kelurahan Amborawang Darat berada di Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur. Luas wilayahnya sekitar 19,47 km² atau 4,68 persen dari luas Kecamatan Samboja Barat. Jarak menuju ibu kota kecamatan sekitar 5,3 km. Wilayah ini berada pada kawasan beriklim tropis basah dan terhubung dengan koridor Jalan Balikpapan–Handil II serta jaringan jalan lingkungan.",
  boundaries:
    "Batas administratif Kelurahan Amborawang Darat ditetapkan melalui Peraturan Bupati Kutai Kartanegara Nomor 43 Tahun 2019. Wilayah yang berbatasan langsung meliputi Kelurahan Margomulyo, Kelurahan Argosari, Kelurahan Amborawang Laut, Kelurahan Salok Api Laut, Kelurahan Salok Api Darat, dan Desa Tani Bhakti.",
  potential:
    "Potensi wilayah mencakup pertanian dan hortikultura, usaha mikro dan perdagangan lokal, pendidikan, kegiatan sosial kemasyarakatan, serta posisi strategis pada koridor pengembangan Samboja Barat. Pengembangan potensi diarahkan pada peningkatan nilai tambah usaha warga, penguatan kapasitas sumber daya manusia, perbaikan infrastruktur dasar, dan pengelolaan lingkungan.",
  facilities: [
    "Kantor Kelurahan Amborawang Darat dan layanan administrasi masyarakat",
    "SD Negeri 005 Samboja",
    "SMP Negeri 2 Samboja",
    "MI Al Fatah Samboja dan satuan pendidikan keagamaan",
    "Layanan kesehatan dalam wilayah kerja Puskesmas Sungai Merdeka",
    "Tempat ibadah dan fasilitas sosial kemasyarakatan",
    "Jalan Balikpapan–Handil II dan jaringan jalan lingkungan",
    "Sarana perdagangan serta ruang usaha masyarakat",
  ],
  imageUrl: AMBORAWANG_OFFICE_IMAGE,
};

const placeholderPatterns = [
  /kelurahan contoh/i,
  /tuliskan/i,
  /dapat diganti/i,
  /dapat ditulis/i,
  /dapat dicantumkan/i,
  /dapat diperbarui/i,
  /informasi luas wilayah/i,
  /batas utara, selatan/i,
  /potensi unggulan kelurahan/i,
  /terwujudnya pelayanan kelurahan yang profesional/i,
  /^meningkatkan kualitas pelayanan publik$/i,
  /^mendorong keterbukaan informasi$/i,
  /^memperkuat partisipasi masyarakat$/i,
  /^kantor kelurahan$/i,
  /^sekolah$/i,
  /^fasilitas kesehatan$/i,
  /^tempat ibadah$/i,
];

function isPlaceholder(value: string | undefined) {
  if (!value?.trim()) return true;
  return placeholderPatterns.some((pattern) => pattern.test(value));
}

function resolveText(value: string | undefined, fallback: string) {
  return isPlaceholder(value) ? fallback : value!.trim();
}

function resolveList(value: string[] | undefined, fallback: string[]) {
  if (!Array.isArray(value) || value.length === 0) return fallback;
  const cleaned = value.map((item) => item?.trim()).filter(Boolean) as string[];
  if (cleaned.length === 0 || cleaned.some((item) => isPlaceholder(item))) return fallback;
  return cleaned;
}

function resolveImage(value: string | undefined) {
  if (!value?.trim() || /office\.svg|placeholder/i.test(value)) return AMBORAWANG_OFFICE_IMAGE;
  return value.trim();
}

export function resolveAmborawangProfile(
  value?: Partial<ProfileContent> | null,
): ProfileContent {
  return {
    history: resolveText(value?.history, amborawangProfileFallback.history),
    vision: resolveText(value?.vision, amborawangProfileFallback.vision),
    missions: resolveList(value?.missions, amborawangProfileFallback.missions),
    geography: resolveText(value?.geography, amborawangProfileFallback.geography),
    boundaries: resolveText(value?.boundaries, amborawangProfileFallback.boundaries),
    potential: resolveText(value?.potential, amborawangProfileFallback.potential),
    facilities: resolveList(value?.facilities, amborawangProfileFallback.facilities),
    imageUrl: resolveImage(value?.imageUrl),
  };
}

export const profileFacts = [
  { value: "19,47 km²", label: "Luas wilayah", note: "BPS, data 2023", icon: "area" },
  { value: "2.921 jiwa", label: "Jumlah penduduk", note: "BPS, data 2023", icon: "people" },
  { value: "13 RT", label: "Wilayah RT", note: "Laporan lokal, Mei 2026", icon: "home" },
  { value: "5,3 km", label: "Ke ibu kota kecamatan", note: "BPS, data 2023", icon: "route" },
] as const;

export const profileTimeline = [
  {
    year: "Sebelum 2020",
    title: "Bagian dari Kecamatan Samboja",
    text: "Amborawang Darat menjalankan pemerintahan kelurahan dalam wilayah Kecamatan Samboja.",
  },
  {
    year: "2020",
    title: "Pembentukan Kecamatan Samboja Barat",
    text: "Perda Kabupaten Kutai Kartanegara Nomor 6 Tahun 2020 memasukkan Amborawang Darat ke wilayah kecamatan baru.",
  },
  {
    year: "2023",
    title: "Pemerintahan kecamatan mulai efektif",
    text: "Kecamatan Samboja Barat mulai berjalan efektif pada 15 Februari 2023 dan memperkuat koordinasi pelayanan kewilayahan.",
  },
  {
    year: "Sekarang",
    title: "Penguatan pelayanan digital",
    text: "Informasi publik, layanan, berita, dan data wilayah dikembangkan agar lebih mudah diakses masyarakat.",
  },
] as const;

export const profileBoundaries = [
  { direction: "Utara", places: "Kelurahan Margomulyo" },
  { direction: "Timur", places: "Kelurahan Argosari dan Kelurahan Amborawang Laut" },
  { direction: "Selatan", places: "Kelurahan Salok Api Laut dan Kelurahan Salok Api Darat" },
  { direction: "Barat", places: "Desa Tani Bhakti" },
] as const;

export const profilePotentials = [
  {
    icon: "plant",
    title: "Pertanian dan Hortikultura",
    text: "Lahan dan aktivitas budidaya dapat dikembangkan melalui peningkatan produktivitas, pengolahan hasil, dan pemasaran.",
  },
  {
    icon: "store",
    title: "UMKM dan Ekonomi Lokal",
    text: "Usaha rumah tangga, perdagangan, kuliner, dan jasa menjadi ruang penguatan pendapatan masyarakat.",
  },
  {
    icon: "education",
    title: "Pendidikan dan SDM",
    text: "Keberadaan satuan pendidikan mendukung peningkatan keterampilan, literasi, dan kapasitas generasi muda.",
  },
  {
    icon: "connect",
    title: "Konektivitas Wilayah",
    text: "Posisi pada koridor Samboja Barat membuka peluang pengembangan layanan, logistik lokal, dan kegiatan produktif.",
  },
] as const;

export const developmentPriorities = [
  "Pelayanan publik berbasis data",
  "Jalan, drainase, dan penerangan",
  "Penguatan UMKM dan usaha warga",
  "Kebersihan dan pengelolaan sampah",
  "Pendidikan serta kegiatan pemuda",
  "Pembaruan data wilayah berkala",
] as const;
