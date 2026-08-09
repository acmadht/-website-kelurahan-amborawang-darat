import type { Metadata } from "next";
import TerritoryPage from "@/components/public/TerritoryPage";

export const metadata: Metadata = {
  title: "Wilayah RT Kelurahan Amborawang Darat | Demografi & Pembagian RT",
  description: "Informasi pembagian wilayah Rukun Tetangga (RT) dan Rukun Warga (RW) serta data kependudukan per wilayah di Kelurahan Amborawang Darat.",
  alternates: {
    canonical: "https://website-kelurahan-amborawang-darat.vercel.app/wilayah",
  },
};

export default function Page(){return <TerritoryPage/>;}
