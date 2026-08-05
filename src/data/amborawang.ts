import type { HeroSlide, Official, SiteSettings } from "@/types";

export const AMBORAWANG_LOGO = "/images/logo-amborawang-darat.png";
export const AMBORAWANG_OFFICE_IMAGE = "/images/kantor-kelurahan-amborawang-darat.jpg";

export const amborawangStatistics = {
  population: 2921,
  families: 633,
  rt: 13,
} as const;

export const amborawangOfficials: Official[] = [
  {
    id: "amborawang-lurah",
    name: "A. Achmad Dendi, S.Sos",
    title: "Lurah",
    category: "Pimpinan Kelurahan",
    photoUrl: "/images/official-lurah.svg",
    description: "Memimpin penyelenggaraan pemerintahan, pembangunan, pelayanan publik, dan pemberdayaan masyarakat Kelurahan Amborawang Darat.",
    order: 1,
    termStart: "2026-04-29",
    isActive: true,
  },
  {
    id: "amborawang-sekretaris",
    name: "Akhmad Deni Sopiani, S.P",
    title: "Sekretaris Kelurahan",
    category: "Sekretariat",
    photoUrl: "/images/official-sekretaris.svg",
    description: "Mengoordinasikan administrasi, perencanaan, keuangan, kepegawaian, dan dukungan operasional kelurahan.",
    order: 2,
    termStart: "2026-04-29",
    isActive: true,
  },
  {
    id: "amborawang-kasi-sosial",
    name: "Nurhalis, S.Sos., M.Si",
    title: "Kepala Seksi Sosial",
    category: "Seksi Sosial",
    photoUrl: "/images/official-kasi-sosial.svg",
    description: "Mengoordinasikan urusan sosial, kesejahteraan masyarakat, dan fasilitasi kegiatan kemasyarakatan.",
    order: 3,
    isActive: true,
  },
  {
    id: "amborawang-kasi-pembangunan",
    name: "A. Sofiar, S.H",
    title: "Kepala Seksi Pembangunan",
    category: "Seksi Pembangunan",
    photoUrl: "/images/official-kasi-pembangunan.svg",
    description: "Mengoordinasikan program pembangunan, sarana lingkungan, dan partisipasi masyarakat dalam pembangunan kelurahan.",
    order: 4,
    isActive: true,
  },
];

export const amborawangHeroSlides: HeroSlide[] = [
  {
    id: "amborawang-hero-1",
    title: "Selamat Datang di Website Resmi Kelurahan Amborawang Darat",
    subtitle: "Akses informasi, layanan administrasi, berita, dan kegiatan masyarakat secara mudah dan terbuka.",
    imageUrl: AMBORAWANG_OFFICE_IMAGE,
    primaryButtonText: "Lihat Layanan",
    primaryButtonUrl: "/layanan",
    secondaryButtonText: "Hubungi Kelurahan",
    secondaryButtonUrl: "/kontak",
    order: 1,
    isActive: true,
  },
  {
    id: "amborawang-hero-2",
    title: "Pelayanan Publik yang Jelas dan Mudah Diakses",
    subtitle: "Periksa persyaratan layanan sebelum datang ke kantor agar proses administrasi berjalan lebih cepat.",
    imageUrl: AMBORAWANG_OFFICE_IMAGE,
    primaryButtonText: "Informasi Layanan",
    primaryButtonUrl: "/layanan",
    secondaryButtonText: "Lihat Berita",
    secondaryButtonUrl: "/berita",
    order: 2,
    isActive: true,
  },
];

const isPlaceholderEmail = (email: string | undefined) =>
  !email || /example|contoh|kelurahan@/i.test(email);

export function applyAmborawangPublicSettings(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    siteName: "Website Resmi Kelurahan Amborawang Darat",
    villageName: "Amborawang Darat",
    tagline: "Berkarya, Berdaya, Berkelanjutan",
    logoUrl: AMBORAWANG_LOGO,
    officeImageUrl: AMBORAWANG_OFFICE_IMAGE,
    address: "Jl. Balikpapan-Handil II KM 42, RT 12, Kelurahan Amborawang Darat, Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur 75274",
    phone: "0812-5800-224",
    whatsapp: "628125800224",
    email: isPlaceholderEmail(settings.email) ? "" : settings.email,
    serviceHours: "Senin-Kamis 09.00-16.00 WITA, Jumat 09.00-11.00 WITA, Sabtu-Minggu tutup",
    mapsEmbedUrl: "https://www.google.com/maps?q=Kantor+Kelurahan+Amborawang+Darat,+Samboja+Barat,+Kutai+Kartanegara&output=embed",
    footerText: "Pemerintah Kelurahan Amborawang Darat",
    seoTitle: "Website Resmi Kelurahan Amborawang Darat",
    seoDescription: "Informasi layanan publik, pemerintahan, berita, agenda, dan kegiatan Kelurahan Amborawang Darat, Kecamatan Samboja Barat.",
    whatsappEnabled: true,
  };
}

export function resolveAmborawangOfficials(officials: Official[]): Official[] {
  const active = officials.filter((item) => item.isActive);
  const hasCurrentLurah = active.some((item) => /achmad\s+dendi/i.test(item.name));
  return hasCurrentLurah ? active : amborawangOfficials;
}
