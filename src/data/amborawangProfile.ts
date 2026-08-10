import { AMBORAWANG_OFFICE_IMAGE } from "@/data/amborawang";

export interface ProfileStat {
  value: string;
  label: string;
  note: string;
}

export interface ProfileTimelineItem {
  year: string;
  title: string;
  text: string;
}

export interface ProfileRegionFact {
  value: string;
  label: string;
}

export interface ProfileBoundaryItem {
  direction: string;
  places: string;
}

export interface ProfilePotentialItem {
  title: string;
  text: string;
}

export interface ProfileContent {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  imageUrl: string;
  heroImageTitle: string;
  heroImageCaption: string;
  heroImageCredit: string;

  summaryEyebrow: string;
  summaryName: string;
  summaryDescription: string;

  historyTitle: string;
  history: string;
  historyCallout: string;

  stats: ProfileStat[];

  timelineEyebrow: string;
  timelineTitle: string;
  timelineDescription: string;
  timeline: ProfileTimelineItem[];

  vision: string;
  visionNote: string;
  missionTitle: string;
  missions: string[];

  regionEyebrow: string;
  regionTitle: string;
  geography: string;
  regionFacts: ProfileRegionFact[];
  mapImageUrl: string;
  mapTitle: string;
  boundaryItems: ProfileBoundaryItem[];
  boundaries: string;

  potentialEyebrow: string;
  potentialTitle: string;
  potential: string;
  potentials: ProfilePotentialItem[];

  facilityEyebrow: string;
  facilityTitle: string;
  facilityIntro: string;
  facilityLeadText: string;
  facilities: string[];

  priorityEyebrow: string;
  priorityTitle: string;
  priorityIntro: string;
  priorities: string[];

  updateKicker: string;
  updateTitle: string;
  updateText: string;
}

export const amborawangProfileFallback: ProfileContent = {
  heroEyebrow: "Profil Kelurahan",
  heroTitle: "Mengenal Amborawang Darat",
  heroDescription:
    "Sejarah, arah pelayanan, kondisi wilayah, batas administratif, potensi, dan fasilitas umum dalam satu halaman yang lebih informatif.",
  imageUrl: AMBORAWANG_OFFICE_IMAGE,
  heroImageTitle: "Kantor Kelurahan Amborawang Darat",
  heroImageCaption: "Dokumentasi bangunan kantor, 19 September 2015",
  heroImageCredit: "Foto: Arief R. Sandan (Ezagren)",

  summaryEyebrow: "Ringkasan Profil",
  summaryName: "Amborawang Darat",
  summaryDescription:
    "Kelurahan di Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara.",

  historyTitle: "Dari wilayah Samboja menuju pelayanan Samboja Barat",
  history:
    "Amborawang Darat telah menjadi salah satu kelurahan dalam wilayah administratif Kecamatan Samboja, Kabupaten Kutai Kartanegara. Perkembangan permukiman, aktivitas masyarakat, pendidikan, pertanian, perdagangan, dan pelayanan pemerintahan membentuk karakter wilayah ini dari waktu ke waktu.\n\nMelalui Peraturan Daerah Kabupaten Kutai Kartanegara Nomor 6 Tahun 2020, Amborawang Darat ditetapkan sebagai salah satu kelurahan dalam Kecamatan Samboja Barat. Kecamatan baru tersebut mulai menjalankan pemerintahan secara efektif pada 15 Februari 2023. Perubahan administratif ini mendekatkan koordinasi pembangunan dan pelayanan publik kepada masyarakat.\n\nSaat ini, Kelurahan Amborawang Darat terus memperkuat pelayanan administrasi, keterbukaan informasi, partisipasi warga, pengembangan potensi ekonomi lokal, dan pengelolaan lingkungan yang berkelanjutan.",
  historyCallout:
    "Amborawang Darat menjadi bagian Kecamatan Samboja Barat berdasarkan Perda Kabupaten Kutai Kartanegara Nomor 6 Tahun 2020.",

  stats: [
    { value: "19,47 km²", label: "Luas wilayah", note: "BPS, data 2023" },
    { value: "2.921 jiwa", label: "Jumlah penduduk", note: "BPS, data 2023" },
    { value: "13 RT", label: "Wilayah RT", note: "Laporan lokal, Mei 2026" },
    { value: "5,3 km", label: "Ke ibu kota kecamatan", note: "BPS, data 2023" },
  ],

  timelineEyebrow: "Jejak Perkembangan",
  timelineTitle: "Perubahan administratif dan penguatan pelayanan",
  timelineDescription:
    "Bagian ini menampilkan tonggak yang dapat diverifikasi tanpa menambahkan cerita asal-usul yang belum memiliki dokumen resmi.",
  timeline: [
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
  ],

  vision:
    "Terwujudnya Kelurahan Amborawang Darat yang tertib, responsif, transparan, berdaya, dan berkelanjutan dalam memberikan pelayanan kepada masyarakat.",
  visionNote:
    "Rumusan profil digital ini tetap dapat disesuaikan melalui dashboard apabila dokumen visi kelurahan yang ditetapkan tersedia.",
  missionTitle: "Arah kerja yang dekat dengan kebutuhan warga",
  missions: [
    "Meningkatkan pelayanan publik yang cepat, jelas, ramah, dan mudah diakses.",
    "Memperkuat keterbukaan informasi serta pengelolaan data kelurahan yang akurat.",
    "Mendorong partisipasi masyarakat dalam perencanaan, pembangunan, dan pengawasan lingkungan.",
    "Mendukung pengembangan UMKM, pertanian, pendidikan, dan kegiatan produktif masyarakat.",
    "Menjaga kebersihan, ketertiban, keamanan, serta keberlanjutan lingkungan kelurahan.",
  ],

  regionEyebrow: "Kondisi Wilayah",
  regionTitle: "Geografi dan batas administratif",
  geography:
    "Kelurahan Amborawang Darat berada di Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur. Luas wilayahnya sekitar 19,47 km² atau 4,68 persen dari luas Kecamatan Samboja Barat. Jarak menuju ibu kota kecamatan sekitar 5,3 km. Wilayah ini berada pada kawasan beriklim tropis basah dan terhubung dengan koridor Jalan Balikpapan–Handil II serta jaringan jalan lingkungan.",
  regionFacts: [
    { value: "04,68%", label: "Proporsi luas terhadap Kecamatan Samboja Barat" },
    { value: "5,3 km", label: "Jarak menuju ibu kota kecamatan" },
    { value: "Tropis", label: "Karakter iklim wilayah" },
  ],
  mapImageUrl: "/images/peta-amborawang-darat.png",
  mapTitle: "Amborawang Darat",
  boundaryItems: [
    { direction: "Utara", places: "Kelurahan Margomulyo" },
    {
      direction: "Timur",
      places: "Kelurahan Argosari dan Kelurahan Amborawang Laut",
    },
    {
      direction: "Selatan",
      places: "Kelurahan Salok Api Laut dan Kelurahan Salok Api Darat",
    },
    { direction: "Barat", places: "Desa Tani Bhakti" },
  ],
  boundaries:
    "Batas administratif Kelurahan Amborawang Darat ditetapkan melalui Peraturan Bupati Kutai Kartanegara Nomor 43 Tahun 2019. Wilayah yang berbatasan langsung meliputi Kelurahan Margomulyo, Kelurahan Argosari, Kelurahan Amborawang Laut, Kelurahan Salok Api Laut, Kelurahan Salok Api Darat, dan Desa Tani Bhakti.",

  potentialEyebrow: "Potensi Kelurahan",
  potentialTitle: "Peluang yang dapat dikembangkan bersama",
  potential:
    "Potensi wilayah mencakup pertanian dan hortikultura, usaha mikro dan perdagangan lokal, pendidikan, kegiatan sosial kemasyarakatan, serta posisi strategis pada koridor pengembangan Samboja Barat. Pengembangan potensi diarahkan pada peningkatan nilai tambah usaha warga, penguatan kapasitas sumber daya manusia, perbaikan infrastruktur dasar, dan pengelolaan lingkungan.",
  potentials: [
    {
      title: "Pertanian dan Hortikultura",
      text: "Lahan dan aktivitas budidaya dapat dikembangkan melalui peningkatan produktivitas, pengolahan hasil, dan pemasaran.",
    },
    {
      title: "UMKM dan Ekonomi Lokal",
      text: "Usaha rumah tangga, perdagangan, kuliner, dan jasa menjadi ruang penguatan pendapatan masyarakat.",
    },
    {
      title: "Pendidikan dan SDM",
      text: "Keberadaan satuan pendidikan mendukung peningkatan keterampilan, literasi, dan kapasitas generasi muda.",
    },
    {
      title: "Konektivitas Wilayah",
      text: "Posisi pada koridor Samboja Barat membuka peluang pengembangan layanan, logistik lokal, dan kegiatan produktif.",
    },
  ],

  facilityEyebrow: "Fasilitas Umum",
  facilityTitle: "Sarana yang mendukung aktivitas masyarakat",
  facilityIntro:
    "Daftar dapat diperbarui melalui dashboard ketika terdapat fasilitas baru atau perubahan nama layanan.",
  facilityLeadText:
    "Pelayanan pemerintahan, pendidikan, kesehatan, keagamaan, konektivitas, dan kegiatan ekonomi masyarakat.",
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

  priorityEyebrow: "Tambahan Profil",
  priorityTitle: "Prioritas pengembangan wilayah",
  priorityIntro:
    "Bagian ini membuat halaman profil lebih relevan dengan kebutuhan perencanaan dan menunjukkan fokus perbaikan secara ringkas.",
  priorities: [
    "Pelayanan publik berbasis data",
    "Jalan, drainase, dan penerangan",
    "Penguatan UMKM dan usaha warga",
    "Kebersihan dan pengelolaan sampah",
    "Pendidikan serta kegiatan pemuda",
    "Pembaruan data wilayah berkala",
  ],

  updateKicker: "Data wilayah perlu diperbarui secara berkala",
  updateTitle: "Menemukan data atau fasilitas yang belum tercantum?",
  updateText:
    "Sampaikan koreksi kepada kelurahan agar profil publik tetap akurat.",
};

function cleanText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function cleanStringList(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const cleaned = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  return cleaned.length ? cleaned : fallback;
}

function cleanStats(value: unknown) {
  if (!Array.isArray(value)) return amborawangProfileFallback.stats;
  const cleaned = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const data = item as Record<string, unknown>;
      const valueText = typeof data.value === "string" ? data.value.trim() : "";
      const label = typeof data.label === "string" ? data.label.trim() : "";
      const note = typeof data.note === "string" ? data.note.trim() : "";
      if (!valueText || !label) return null;
      return { value: valueText, label, note };
    })
    .filter((item): item is ProfileStat => Boolean(item));
  return cleaned.length ? cleaned : amborawangProfileFallback.stats;
}

function cleanTimeline(value: unknown) {
  if (!Array.isArray(value)) return amborawangProfileFallback.timeline;
  const cleaned = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const data = item as Record<string, unknown>;
      const year = typeof data.year === "string" ? data.year.trim() : "";
      const title = typeof data.title === "string" ? data.title.trim() : "";
      const text = typeof data.text === "string" ? data.text.trim() : "";
      if (!year || !title || !text) return null;
      return { year, title, text };
    })
    .filter((item): item is ProfileTimelineItem => Boolean(item));
  return cleaned.length ? cleaned : amborawangProfileFallback.timeline;
}

function cleanRegionFacts(value: unknown) {
  if (!Array.isArray(value)) return amborawangProfileFallback.regionFacts;
  const cleaned = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const data = item as Record<string, unknown>;
      const valueText = typeof data.value === "string" ? data.value.trim() : "";
      const label = typeof data.label === "string" ? data.label.trim() : "";
      if (!valueText || !label) return null;
      return { value: valueText, label };
    })
    .filter((item): item is ProfileRegionFact => Boolean(item));
  return cleaned.length ? cleaned : amborawangProfileFallback.regionFacts;
}

function cleanBoundaryItems(value: unknown) {
  if (!Array.isArray(value)) return amborawangProfileFallback.boundaryItems;
  const cleaned = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const data = item as Record<string, unknown>;
      const direction =
        typeof data.direction === "string" ? data.direction.trim() : "";
      const places = typeof data.places === "string" ? data.places.trim() : "";
      if (!direction || !places) return null;
      return { direction, places };
    })
    .filter((item): item is ProfileBoundaryItem => Boolean(item));
  return cleaned.length ? cleaned : amborawangProfileFallback.boundaryItems;
}

function cleanPotentials(value: unknown) {
  if (!Array.isArray(value)) return amborawangProfileFallback.potentials;
  const cleaned = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const data = item as Record<string, unknown>;
      const title = typeof data.title === "string" ? data.title.trim() : "";
      const text = typeof data.text === "string" ? data.text.trim() : "";
      if (!title || !text) return null;
      return { title, text };
    })
    .filter((item): item is ProfilePotentialItem => Boolean(item));
  return cleaned.length ? cleaned : amborawangProfileFallback.potentials;
}

export function resolveAmborawangProfile(
  value?: Partial<ProfileContent> | null,
): ProfileContent {
  const source = (value ?? {}) as Record<string, unknown>;

  return {
    heroEyebrow: cleanText(source.heroEyebrow, amborawangProfileFallback.heroEyebrow),
    heroTitle: cleanText(source.heroTitle, amborawangProfileFallback.heroTitle),
    heroDescription: cleanText(
      source.heroDescription,
      amborawangProfileFallback.heroDescription,
    ),
    imageUrl: cleanText(source.imageUrl, amborawangProfileFallback.imageUrl),
    heroImageTitle: cleanText(
      source.heroImageTitle,
      amborawangProfileFallback.heroImageTitle,
    ),
    heroImageCaption: cleanText(
      source.heroImageCaption,
      amborawangProfileFallback.heroImageCaption,
    ),
    heroImageCredit: cleanText(
      source.heroImageCredit,
      amborawangProfileFallback.heroImageCredit,
    ),

    summaryEyebrow: cleanText(
      source.summaryEyebrow,
      amborawangProfileFallback.summaryEyebrow,
    ),
    summaryName: cleanText(source.summaryName, amborawangProfileFallback.summaryName),
    summaryDescription: cleanText(
      source.summaryDescription,
      amborawangProfileFallback.summaryDescription,
    ),

    historyTitle: cleanText(source.historyTitle, amborawangProfileFallback.historyTitle),
    history: cleanText(source.history, amborawangProfileFallback.history),
    historyCallout: cleanText(
      source.historyCallout,
      amborawangProfileFallback.historyCallout,
    ),

    stats: cleanStats(source.stats),

    timelineEyebrow: cleanText(
      source.timelineEyebrow,
      amborawangProfileFallback.timelineEyebrow,
    ),
    timelineTitle: cleanText(
      source.timelineTitle,
      amborawangProfileFallback.timelineTitle,
    ),
    timelineDescription: cleanText(
      source.timelineDescription,
      amborawangProfileFallback.timelineDescription,
    ),
    timeline: cleanTimeline(source.timeline),

    vision: cleanText(source.vision, amborawangProfileFallback.vision),
    visionNote: cleanText(source.visionNote, amborawangProfileFallback.visionNote),
    missionTitle: cleanText(source.missionTitle, amborawangProfileFallback.missionTitle),
    missions: cleanStringList(source.missions, amborawangProfileFallback.missions),

    regionEyebrow: cleanText(
      source.regionEyebrow,
      amborawangProfileFallback.regionEyebrow,
    ),
    regionTitle: cleanText(source.regionTitle, amborawangProfileFallback.regionTitle),
    geography: cleanText(source.geography, amborawangProfileFallback.geography),
    regionFacts: cleanRegionFacts(source.regionFacts),
    mapImageUrl: cleanText(source.mapImageUrl, amborawangProfileFallback.mapImageUrl),
    mapTitle: cleanText(source.mapTitle, amborawangProfileFallback.mapTitle),
    boundaryItems: cleanBoundaryItems(source.boundaryItems),
    boundaries: cleanText(source.boundaries, amborawangProfileFallback.boundaries),

    potentialEyebrow: cleanText(
      source.potentialEyebrow,
      amborawangProfileFallback.potentialEyebrow,
    ),
    potentialTitle: cleanText(
      source.potentialTitle,
      amborawangProfileFallback.potentialTitle,
    ),
    potential: cleanText(source.potential, amborawangProfileFallback.potential),
    potentials: cleanPotentials(source.potentials),

    facilityEyebrow: cleanText(
      source.facilityEyebrow,
      amborawangProfileFallback.facilityEyebrow,
    ),
    facilityTitle: cleanText(
      source.facilityTitle,
      amborawangProfileFallback.facilityTitle,
    ),
    facilityIntro: cleanText(
      source.facilityIntro,
      amborawangProfileFallback.facilityIntro,
    ),
    facilityLeadText: cleanText(
      source.facilityLeadText,
      amborawangProfileFallback.facilityLeadText,
    ),
    facilities: cleanStringList(source.facilities, amborawangProfileFallback.facilities),

    priorityEyebrow: cleanText(
      source.priorityEyebrow,
      amborawangProfileFallback.priorityEyebrow,
    ),
    priorityTitle: cleanText(
      source.priorityTitle,
      amborawangProfileFallback.priorityTitle,
    ),
    priorityIntro: cleanText(
      source.priorityIntro,
      amborawangProfileFallback.priorityIntro,
    ),
    priorities: cleanStringList(source.priorities, amborawangProfileFallback.priorities),

    updateKicker: cleanText(
      source.updateKicker,
      amborawangProfileFallback.updateKicker,
    ),
    updateTitle: cleanText(source.updateTitle, amborawangProfileFallback.updateTitle),
    updateText: cleanText(source.updateText, amborawangProfileFallback.updateText),
  };
}
