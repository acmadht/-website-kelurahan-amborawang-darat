import type { Metadata } from "next";
import { demoPosts } from "@/data/demo";
import type { PostItem } from "@/types";
import NewsDetailPage from "@/components/public/NewsDetailPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let post: PostItem | undefined;
  try {
    const { getAdminDb } = await import("@/lib/firebase/admin");
    const db = getAdminDb();
    const snapshot = await db.collection("posts").where("slug", "==", slug).limit(1).get();
    if (!snapshot.empty) {
      post = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as PostItem;
    }
  } catch (error) {
    console.warn("Failed to fetch post from Firestore for metadata, using demoPosts fallback", error);
  }

  // Fallback to demoPosts if not found in DB or DB fetch failed
  if (!post) {
    post = demoPosts.find((p) => p.slug === slug);
  }

  if (!post || post.status !== "published") {
    return {
      title: "Berita Tidak Ditemukan",
      description: "Halaman berita tidak ditemukan atau telah dihapus.",
    };
  }

  const title = `${post.title} | Kelurahan Amborawang Darat`;
  const description = post.summary || "Berita terkini dari Kelurahan Amborawang Darat.";
  const url = `https://website-kelurahan-amborawang-darat.vercel.app/berita/${slug}`;
  const image = post.coverImageUrl || "https://website-kelurahan-amborawang-darat.vercel.app/images/news-1.svg";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        {
          url: image,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function Page({params}:{params:Promise<{slug:string}>}){ const {slug}=await params; return <NewsDetailPage slug={slug}/>; }
