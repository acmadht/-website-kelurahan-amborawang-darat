import type { PostItem } from "@/types";

// Satu-satunya berita statis adalah konten KKN. Seluruh berita kelurahan lain
// wajib berasal dari koleksi Firestore `posts` agar dapat dikelola admin.
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
    isFeatured: false,
    content: [
      "Kelompok 2 KKN Reguler UINSI Samarinda melakukan koordinasi program kerja bersama pihak Kelurahan Amborawang Darat.",
      "Salah satu pembahasan utama adalah pengembangan website kelurahan sebagai media pelayanan informasi, dokumentasi kegiatan, publikasi berita, dan akses masyarakat terhadap data publik.",
      "Koordinasi dilakukan agar program yang dilaksanakan sesuai dengan kebutuhan kelurahan serta dapat digunakan secara berkelanjutan setelah kegiatan KKN selesai.",
      "Pengembangan website diharapkan menjadi salah satu kontribusi dalam mendukung transformasi pelayanan informasi publik di Kelurahan Amborawang Darat.",
    ].join("\n\n"),
  },
];

export function mergePublicPosts(remotePosts: PostItem[]) {
  const published = remotePosts.filter((item) => item.status === "published");
  const dynamicNonKkn = published.filter(
    (item) => String(item.category || "").toUpperCase() !== "KKN",
  );
  const merged = [...dynamicNonKkn, ...staticKknPosts];
  const seen = new Set<string>();

  return merged.filter((item) => {
    const key = String(item.slug || item.id || item.title || "").trim();
    if (!key || seen.has(key)) return false;
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
