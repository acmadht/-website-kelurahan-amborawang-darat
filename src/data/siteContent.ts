export interface HomeContent {
  portalStatus: string;
  heroEyebrow: string;
  welcomeEyebrow: string;
  welcomeTitle: string;
  welcomeText: string;
  welcomeSecondText: string;
  complaintText: string;
  servicesEyebrow: string;
  servicesTitle: string;
  infoEyebrow: string;
  infoTitle: string;
  ctaKicker: string;
  ctaTitle: string;
  ctaText: string;
}

export const homeContentFallback: HomeContent = {
  portalStatus: "Portal Informasi Resmi Kelurahan",
  heroEyebrow: "Website Resmi Kelurahan",
  welcomeEyebrow: "Profil Singkat",
  welcomeTitle: "Mengenal Kelurahan Amborawang Darat",
  welcomeText:
    "Selamat datang di Website Resmi Kelurahan Amborawang Darat. Website ini kami hadirkan sebagai pusat informasi layanan, pemerintahan, pembangunan, dan kegiatan masyarakat yang dapat diakses dengan mudah.",
  welcomeSecondText:
    "Kami mengajak seluruh warga untuk memanfaatkan layanan yang tersedia, menyampaikan aspirasi secara bertanggung jawab, dan ikut mendukung pembangunan kelurahan yang tertib, transparan, serta berkelanjutan.",
  complaintText:
    "Sampaikan aspirasi melalui halaman kontak atau WhatsApp kelurahan.",
  servicesEyebrow: "Layanan Utama",
  servicesTitle: "Pelayanan penting untuk masyarakat",
  infoEyebrow: "Informasi Terkini",
  infoTitle: "Informasi penting untuk masyarakat",
  ctaKicker: "Butuh Bantuan?",
  ctaTitle: "Temukan layanan atau hubungi kelurahan.",
  ctaText:
    "Lihat persyaratan pelayanan atau hubungi kantor kelurahan jika membutuhkan informasi lebih lanjut.",
};

export interface RegionContent {
  area: string;
  population: string;
  rtCount: string;
  districtDistance: string;
  areaNote: string;
  populationNote: string;
  rtNote: string;
  districtDistanceNote: string;
  northBoundary: string;
  eastBoundary: string;
  southBoundary: string;
  westBoundary: string;
  geography: string;
  geographyDetail: string;
  connectivity: string;
  boundaryNote: string;
  climateTitle: string;
  climateText: string;
  corridorTitle: string;
  corridorText: string;
  landTitle: string;
  landText: string;
  mapImageUrl: string;
}

export const regionContentFallback: RegionContent = {
  area: "19,47 km²",
  population: "2.921 jiwa",
  rtCount: "Data RT",
  districtDistance: "5,3 km",
  areaNote: "BPS, data 2023",
  populationNote: "BPS, data 2023",
  rtNote: "Data kelurahan",
  districtDistanceNote: "BPS, data 2023",
  northBoundary: "Kelurahan Margomulyo",
  eastBoundary: "Kelurahan Argosari dan Kelurahan Amborawang Laut",
  southBoundary: "Kelurahan Salok Api Laut dan Kelurahan Salok Api Darat",
  westBoundary: "Desa Tani Bhakti",
  geography:
    "Kelurahan Amborawang Darat merupakan bagian dari Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur.",
  geographyDetail:
    "Luas wilayahnya sekitar 19,47 km² atau sekitar 4,68 persen dari luas Kecamatan Samboja Barat. Jarak menuju ibu kota kecamatan sekitar 5,3 km.",
  connectivity:
    "Wilayah ini terhubung dengan koridor Jalan Balikpapan–Handil II serta jaringan jalan lingkungan yang mendukung aktivitas masyarakat, pelayanan, pendidikan, perdagangan, dan mobilitas antarkawasan.",
  boundaryNote:
    "Batas administratif Kelurahan Amborawang Darat ditetapkan melalui Peraturan Bupati Kutai Kartanegara Nomor 43 Tahun 2019.",
  climateTitle: "Kawasan Tropis Basah",
  climateText:
    "Karakter iklim wilayah dipengaruhi kondisi tropis Kalimantan Timur dengan curah hujan dan kelembapan yang relatif tinggi.",
  corridorTitle: "Koridor Balikpapan–Handil II",
  corridorText:
    "Wilayah terhubung dengan koridor Jalan Balikpapan–Handil II yang mendukung mobilitas masyarakat dan aktivitas lokal.",
  landTitle: "Permukiman & Lahan Produktif",
  landText:
    "Karakter wilayah mencakup area permukiman, aktivitas masyarakat, lahan produktif, dan ruang lingkungan kelurahan.",
  mapImageUrl: "/images/peta-amborawang-darat.png",
};
