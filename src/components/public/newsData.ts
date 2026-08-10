import type { PostItem } from "@/types";

export type NewsItem = {
  slug: string;
  category: "Pelayanan" | "Lingkungan" | "KKN";
  title: string;
  excerpt: string;
  image: string;
  date: string;
  time: string;
  author: string;
  featured?: boolean;
  content: string[];
};

export const newsItems: NewsItem[] = [
  {
    slug: "pelayanan-administrasi-kelurahan-semakin-mudah",
    category: "Pelayanan",
    title: "Pelayanan Administrasi Kelurahan Semakin Mudah",
    excerpt: "Kelurahan meningkatkan keterbukaan informasi persyaratan dan alur pelayanan bagi masyarakat.",
    image: "/images/berita/pelayanan-administrasi-kelurahan-semakin-mudah.jpg",
    date: "10 Agustus 2026",
    time: "09.15 WITA",
    author: "Pemerintah Kelurahan Amborawang Darat",
    featured: true,
    content: [
      "Kelurahan Amborawang Darat terus meningkatkan kualitas pelayanan administrasi dengan menyediakan informasi yang lebih jelas mengenai persyaratan, alur pengurusan, dan dokumen pendukung yang perlu disiapkan masyarakat.",
      "Penyampaian informasi pelayanan melalui website diharapkan membantu masyarakat memahami kebutuhan administrasi sebelum datang ke kantor kelurahan. Dengan demikian, proses pelayanan dapat berjalan lebih tertib, efisien, dan mudah dipahami.",
      "Masyarakat tetap disarankan melakukan konfirmasi kepada petugas apabila terdapat persyaratan khusus atau perubahan ketentuan pada jenis pelayanan tertentu.",
      "Website Kelurahan Amborawang Darat akan terus diperbarui sebagai bagian dari keterbukaan informasi publik dan peningkatan akses pelayanan kepada masyarakat.",
    ],
  },
  {
    slug: "kerja-bakti-warga-untuk-lingkungan-bersih",
    category: "Lingkungan",
    title: "Kerja Bakti Warga untuk Lingkungan Bersih",
    excerpt: "Warga bersama perangkat kelurahan melaksanakan kerja bakti di sejumlah titik lingkungan.",
    image: "/images/berita/kerja-bakti-warga-untuk-lingkungan-bersih.jpg",
    date: "8 Agustus 2026",
    time: "07.30 WITA",
    author: "Pemerintah Kelurahan Amborawang Darat",
    content: [
      "Kegiatan kerja bakti menjadi salah satu bentuk partisipasi masyarakat dalam menjaga kebersihan dan kenyamanan lingkungan Kelurahan Amborawang Darat.",
      "Warga bersama perangkat kelurahan melakukan pembersihan pada sejumlah titik lingkungan, termasuk area jalan, drainase, dan fasilitas yang digunakan bersama.",
      "Kegiatan ini juga menjadi ruang koordinasi antarwarga untuk membangun kepedulian terhadap kebersihan, ketertiban, dan kondisi lingkungan sekitar.",
      "Kelurahan mengajak masyarakat untuk terus menjaga lingkungan secara berkelanjutan melalui kebiasaan sederhana yang dilakukan bersama.",
    ],
  },
  {
    slug: "koordinasi-program-kerja-kelompok-kkn",
    category: "KKN",
    title: "Koordinasi Program Kerja Kelompok KKN",
    excerpt: "Kelompok KKN memaparkan program kerja dan rencana pengembangan website kelurahan.",
    image: "/images/berita/koordinasi-program-kerja-kelompok-kkn.jpg",
    date: "6 Agustus 2026",
    time: "14.00 WITA",
    author: "Kelompok 2 KKN Reguler UINSI Samarinda",
    content: [
      "Kelompok 2 KKN Reguler UINSI Samarinda melakukan koordinasi program kerja bersama pihak Kelurahan Amborawang Darat.",
      "Salah satu pembahasan utama adalah pengembangan website kelurahan sebagai media pelayanan informasi, dokumentasi kegiatan, publikasi berita, dan akses masyarakat terhadap data publik.",
      "Koordinasi dilakukan agar program yang dilaksanakan sesuai dengan kebutuhan kelurahan serta dapat digunakan secara berkelanjutan setelah kegiatan KKN selesai.",
      "Pengembangan website diharapkan menjadi salah satu kontribusi dalam mendukung transformasi pelayanan informasi publik di Kelurahan Amborawang Darat.",
    ],
  },
];

function legacyToPost(item: NewsItem): PostItem {
  return {
    id: `static-${item.slug}`,
    title: item.title,
    slug: item.slug,
    summary: item.excerpt,
    content: item.content.join("\n\n"),
    coverImageUrl: item.image,
    category: item.category,
    authorName: item.author,
    publishedDate: item.date,
    publishedTime: item.time,
    status: "published",
    isFeatured: Boolean(item.featured),
  };
}

export const fallbackPublicPosts: PostItem[] = newsItems.map(legacyToPost);
export const staticKknPosts: PostItem[] = newsItems
  .filter((item) => item.category === "KKN")
  .map(legacyToPost);

export function mergePublicPosts(remotePosts: PostItem[]) {
  const published = remotePosts.filter((item) => item.status === "published");

  if (!published.length) {
    return fallbackPublicPosts;
  }

  const withoutKkn = published.filter((item) => item.category !== "KKN");
  const merged = [...withoutKkn, ...staticKknPosts];
  const seen = new Set<string>();

  return merged.filter((item) => {
    const key = item.slug || item.id || item.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function displayPostDate(value?: string) {
  if (!value) return "Tanggal belum diisi";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T00:00:00`);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  return value;
}

export function postParagraphs(content?: string) {
  return String(content || "")
    .split(/\n\s*\n|\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}
