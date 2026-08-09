import type { Metadata } from "next";
import ProfilePage from "@/components/public/ProfilePage";

export const metadata: Metadata = {
  title: "Profil Kelurahan Amborawang Darat | Kutai Kartanegara",
  description: "Profil lengkap Kelurahan Amborawang Darat, Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara. Sejarah, visi misi, letak geografis, demografi, potensi kelurahan, dan fasilitas.",
  alternates: {
    canonical: "https://website-kelurahan-amborawang-darat.vercel.app/profil",
  },
};

export default function Page(){ return <ProfilePage />; }
