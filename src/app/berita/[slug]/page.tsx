import type { Metadata } from "next";
import NewsDetailPage from "@/components/public/NewsDetailPage";
import JsonLd from "@/components/seo/JsonLd";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  getPublicPostBySlugServer,
  getServerSettings,
  modifiedDateIso,
  publishedDateIso,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [settings, article] = await Promise.all([
    getServerSettings(),
    getPublicPostBySlugServer(slug),
  ]);

  if (!article) {
    return buildMetadata({
      settings,
      path: `/berita/${slug}`,
      title: `Berita Kelurahan ${settings.villageName}`,
      description: `Informasi dan berita resmi Kelurahan ${settings.villageName}.`,
    });
  }

  return buildMetadata({
    settings,
    path: `/berita/${article.slug}`,
    title: article.title,
    description: article.summary,
    image: article.coverImageUrl,
    type: "article",
    publishedTime: publishedDateIso(article),
    modifiedTime: modifiedDateIso(article),
    authors: [article.authorName || `Pemerintah Kelurahan ${settings.villageName}`],
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const [settings, initialArticle] = await Promise.all([
    getServerSettings(),
    getPublicPostBySlugServer(slug),
  ]);

  const schemas: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: "Beranda", path: "/" },
      { name: "Berita", path: "/berita" },
      { name: initialArticle?.title || "Artikel", path: `/berita/${slug}` },
    ]),
  ];

  if (initialArticle) schemas.push(articleJsonLd(initialArticle, settings));

  return (
    <>
      <JsonLd data={schemas} />
      <NewsDetailPage slug={slug} initialArticle={initialArticle} initialSettings={settings} />
    </>
  );
}
