import type { MetadataRoute } from "next";
import { staticKknPosts } from "@/components/public/newsData";
import {
  SITE_URL,
  getDynamicPublishedPostsServer,
  modifiedDateIso,
} from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/profil`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/pemerintahan`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/layanan`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/berita`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/wilayah`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/data-rt`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/galeri`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/dokumen`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/kontak`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tim-kkn`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const dynamicPosts = await getDynamicPublishedPostsServer();
  const posts = [...dynamicPosts, ...staticKknPosts];
  const seen = new Set<string>();

  const articleRoutes: MetadataRoute.Sitemap = posts
    .filter((post) => {
      const slug = String(post.slug || "").trim();
      if (!slug || seen.has(slug)) return false;
      seen.add(slug);
      return true;
    })
    .map((post) => {
      const modified = modifiedDateIso(post);
      return {
        url: `${SITE_URL}/berita/${post.slug}`,
        ...(modified ? { lastModified: new Date(modified) } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });

  return [...staticRoutes, ...articleRoutes];
}
