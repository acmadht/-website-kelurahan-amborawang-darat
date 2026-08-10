import type { MetadataRoute } from "next";
import { staticKknPosts } from "@/components/public/newsData";
import type { PostItem } from "@/types";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://website-kelurahan-amborawang-darat.vercel.app").replace(/\/$/, "");

function parseDate(value: unknown): Date {
  if (!value) return new Date();
  if (typeof value === "object" && value && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate();
  }
  if (value instanceof Date) return value;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${BASE_URL}/profil`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/layanan`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/berita`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${BASE_URL}/galeri`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/pemerintahan`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/dokumen`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/kontak`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/tim-kkn`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/wilayah`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/data-rt`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  let posts: PostItem[] = [];
  try {
    const { getAdminDb } = await import("@/lib/firebase/admin");
    const snapshot = await getAdminDb().collection("posts").where("status", "==", "published").get();
    posts = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as PostItem[];
  } catch {
    // Jika server admin Firebase belum tersedia, sitemap tetap valid dengan
    // rute statis dan artikel KKN yang memang dikunci di source code.
    posts = [];
  }

  const combined = [...posts.filter((post) => post.category !== "KKN"), ...staticKknPosts];
  const seen = new Set<string>();
  const dynamicRoutes = combined
    .filter((post) => {
      if (!post.slug || seen.has(post.slug)) return false;
      seen.add(post.slug);
      return true;
    })
    .map((post) => ({
      url: `${BASE_URL}/berita/${post.slug}`,
      lastModified: parseDate(post.updatedAt || post.publishedAt || post.publishedDate),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...dynamicRoutes];
}
