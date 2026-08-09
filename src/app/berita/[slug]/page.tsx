import { notFound } from "next/navigation";
import NewsDetailPage from "@/components/public/NewsDetailPage";
import { getNewsBySlug, newsItems } from "@/components/public/newsData";

export function generateStaticParams() {
  return newsItems.map((item) => ({
    slug: item.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  return <NewsDetailPage article={article} />;
}
