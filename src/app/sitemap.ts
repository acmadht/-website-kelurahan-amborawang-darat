import type { MetadataRoute } from "next";
import { demoPosts } from "@/data/demo";
import type { PostItem } from "@/types";

const BASE_URL = "https://website-kelurahan-amborawang-darat.vercel.app";

function parseDate(val: any): Date {
  if (!val) return new Date();
  if (typeof val.toDate === "function") return val.toDate(); // Firestore Timestamp
  if (val instanceof Date) return val;
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date() : d;
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
  ];

  let posts: PostItem[] = [];
  try {
    const { getAdminDb } = await import("@/lib/firebase/admin");
    const db = getAdminDb();
    const snapshot = await db.collection("posts").where("status", "==", "published").get();
    posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PostItem[];
  } catch (error) {
    console.warn("Failed to fetch posts from Firestore for sitemap, using demoPosts fallback", error);
    posts = demoPosts.filter(post => post.status === "published");
  }

  const dynamicRoutes = posts.map((post) => ({
    url: `${BASE_URL}/berita/${post.slug}`,
    lastModified: parseDate(post.updatedAt || post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}