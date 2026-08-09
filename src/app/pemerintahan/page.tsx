import type { Metadata } from "next";
import GovernmentPage from "@/components/public/GovernmentPage";

export const metadata: Metadata = {
  title: "Pemerintahan Kelurahan Amborawang Darat | Struktur Organisasi",
  description: "Struktur organisasi resmi pemerintah kelurahan, jajaran aparatur kelurahan, Lurah, Sekretaris Kelurahan, dan kepala seksi di Kelurahan Amborawang Darat.",
  alternates: {
    canonical: "https://website-kelurahan-amborawang-darat.vercel.app/pemerintahan",
  },
};

export default function Page(){return <GovernmentPage/>;}
