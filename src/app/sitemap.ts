import type { MetadataRoute } from "next";
import { staticKknPosts } from "@/data/kknStatic";
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
    { url: `${SITE_URL}/tim-kkn`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/kkn/program-kerja`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/kkn/berita`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/kkn/galeri`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/kkn/book-chapter`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/kkn/luaran`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const dynamicPosts = await getDynamicPublishedPostsServer();

  const villageArticleRoutes: MetadataRoute.Sitemap = dynamicPosts.map((post) => {
    const modified = modifiedDateIso(post);
    return {
      url: `${SITE_URL}/berita/${post.slug}`,
      ...(modified ? { lastModified: new Date(modified) } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  const kknArticleRoutes: MetadataRoute.Sitemap = staticKknPosts
    .filter((post) => post.status === "published")
    .map((post) => ({
      url: `${SITE_URL}/kkn/berita/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...villageArticleRoutes, ...kknArticleRoutes];
}
