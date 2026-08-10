import NewsDetailPage from "@/components/public/NewsDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <NewsDetailPage slug={slug} />;
}
