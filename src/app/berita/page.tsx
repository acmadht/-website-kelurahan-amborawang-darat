import type { Metadata } from "next";
import NewsPage from "@/components/public/NewsPage";

export const metadata: Metadata = {
  title: "Berita Kelurahan Amborawang Darat | Informasi Terkini",
  description: "Kumpulan berita resmi, pengumuman pelayanan, agenda kegiatan masyarakat, dan perkembangan pembangunan di Kelurahan Amborawang Darat.",
  alternates: {
    canonical: "https://website-kelurahan-amborawang-darat.vercel.app/berita",
  },
};

export default function Page(){return <NewsPage/>;}
