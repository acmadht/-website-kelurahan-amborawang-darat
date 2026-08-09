import type { Metadata } from "next";
import GalleryPage from "@/components/public/GalleryPage";

export const metadata: Metadata = {
  title: "Galeri Kelurahan Amborawang Darat | Dokumentasi Kegiatan",
  description: "Dokumentasi foto kegiatan resmi kelurahan, pembangunan sarana publik, gotong royong warga, dan program digitalisasi dari tim KKN di Amborawang Darat.",
  alternates: {
    canonical: "https://website-kelurahan-amborawang-darat.vercel.app/galeri",
  },
};

export default function Page(){return <GalleryPage/>;}
