import { staticKknPosts } from "@/data/kknStatic";
import type { PostItem } from "@/types";

export { staticKknPosts } from "@/data/kknStatic";

function uniquePosts(items: PostItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = String(item.slug || item.id || item.title || "").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Berita publik kelurahan sepenuhnya dinamis dari Firestore dan KKN dikecualikan.
export function mergePublicPosts(remotePosts: PostItem[]) {
  const publishedNonKkn = remotePosts.filter(
    (item) =>
      item.status === "published" &&
      String(item.category || "").toUpperCase() !== "KKN",
  );

  return uniquePosts(publishedNonKkn);
}

// Berita KKN dinamis dari Firestore. Data statis hanya menjadi fallback agar
// halaman lama tidak kosong sebelum admin melakukan migrasi pertama.
export function mergeKknPosts(remotePosts: PostItem[] = []) {
  const publishedKkn = remotePosts.filter(
    (item) => item.status === "published" && String(item.category || "").toUpperCase() === "KKN",
  );

  return uniquePosts(
    publishedKkn.length
      ? publishedKkn
      : staticKknPosts.filter((item) => item.status === "published"),
  );
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
