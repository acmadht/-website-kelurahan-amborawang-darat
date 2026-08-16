import type { Metadata } from "next";
import NewsDetailPage from "@/components/public/NewsDetailPage";
import JsonLd from "@/components/seo/JsonLd";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  getKknPostBySlugServer,
  getServerSettings,
  modifiedDateIso,
  publishedDateIso,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [settings, article] = await Promise.all([
    getServerSettings(),
    getKknPostBySlugServer(slug),
  ]);

  if (!article) {
    return buildMetadata({
      settings,
      path: `/kkn/berita/${slug}`,
      title: `Berita KKN ${settings.villageName}`,
      description: `Publikasi kegiatan Tim KKN di Kelurahan ${settings.villageName}.`,
    });
  }

  return buildMetadata({
    settings,
    path: `/kkn/berita/${article.slug}`,
    title: article.title,
    description: article.summary,
    image: article.coverImageUrl,
    type: "article",
    publishedTime: publishedDateIso(article),
    modifiedTime: modifiedDateIso(article),
    authors: [article.authorName || "Tim KKN Amborawang Darat"],
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const [settings, initialArticle] = await Promise.all([
    getServerSettings(),
    getKknPostBySlugServer(slug),
  ]);

  const schemas: Record<string, unknown>[] = [
    breadcrumbJsonLd([
      { name: "Beranda", path: "/" },
      { name: "KKN", path: "/tim-kkn" },
      { name: "Berita KKN", path: "/kkn/berita" },
      { name: initialArticle?.title || "Artikel", path: `/kkn/berita/${slug}` },
    ]),
  ];

  if (initialArticle) schemas.push(articleJsonLd(initialArticle, settings, "/kkn/berita"));

  return (
    <>
      <JsonLd data={schemas} />
      <NewsDetailPage slug={slug} initialArticle={initialArticle} initialSettings={settings} scope="kkn" />
    </>
  );
}
