import type { SiteSettings } from "@/types";

export const AMBORAWANG_LOGO = "/images/logo-amborawang-darat.png";
export const AMBORAWANG_OFFICE_IMAGE =
  "/images/kantor-kelurahan-amborawang-darat.jpg";

const isPlaceholderEmail = (email: string | undefined) =>
  !email || /example|contoh/i.test(email);

function cleanText(value: string | undefined, fallback: string) {
  // Fallback hanya untuk field yang belum pernah ada. String kosong yang memang
  // disimpan admin tetap dihormati agar konten benar-benar dapat dikosongkan.
  return typeof value === "string" ? value.trim() : fallback;
}

export function applyAmborawangPublicSettings(
  settings: SiteSettings,
): SiteSettings {
  return {
    ...settings,
    siteName: cleanText(
      settings.siteName,
      "Website Resmi Kelurahan Amborawang Darat",
    ),
    villageName: cleanText(settings.villageName, "Amborawang Darat"),
    subdistrictName: cleanText(settings.subdistrictName, "Samboja Barat"),
    regencyName: cleanText(settings.regencyName, "Kutai Kartanegara"),
    provinceName: cleanText(settings.provinceName, "Kalimantan Timur"),
    tagline: cleanText(settings.tagline, "Berkarya, Berdaya, Berkelanjutan"),
    logoUrl: cleanText(settings.logoUrl, AMBORAWANG_LOGO),
    officeImageUrl: cleanText(
      settings.officeImageUrl,
      AMBORAWANG_OFFICE_IMAGE,
    ),
    address: cleanText(
      settings.address,
      "Jl. Balikpapan-Handil II KM 42, RT 12, Kelurahan Amborawang Darat, Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur 75274",
    ),
    phone: cleanText(settings.phone, "0812-5800-224"),
    whatsapp: cleanText(settings.whatsapp, "628125800224"),
    email: isPlaceholderEmail(settings.email) ? "" : settings.email.trim(),
    serviceHours: cleanText(
      settings.serviceHours,
      "Senin-Kamis 09.00-16.00 WITA, Jumat 09.00-11.00 WITA, Sabtu-Minggu tutup",
    ),
    mapsEmbedUrl: cleanText(
      settings.mapsEmbedUrl,
      "https://www.google.com/maps?q=Kantor+Kelurahan+Amborawang+Darat,+Samboja+Barat,+Kutai+Kartanegara&output=embed",
    ),
    footerText: cleanText(
      settings.footerText,
      "Pemerintah Kelurahan Amborawang Darat",
    ),
    seoTitle: cleanText(
      settings.seoTitle,
      "Website Resmi Kelurahan Amborawang Darat",
    ),
    seoDescription: cleanText(
      settings.seoDescription,
      "Informasi layanan publik, pemerintahan, berita, agenda, dan kegiatan Kelurahan Amborawang Darat, Kecamatan Samboja Barat.",
    ),
    animationEnabled: settings.animationEnabled !== false,
    heroAutoplay: settings.heroAutoplay !== false,
    heroInterval:
      Number(settings.heroInterval) > 0 ? Number(settings.heroInterval) : 7000,
    whatsappEnabled: settings.whatsappEnabled !== false,
  };
}
