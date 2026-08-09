import type { Metadata } from "next";
import ContactPage from "@/components/public/ContactPage";

export const metadata: Metadata = {
  title: "Kontak Kelurahan Amborawang Darat | Hubungi Kami",
  description: "Hubungi Kantor Pemerintah Kelurahan Amborawang Darat. Temukan alamat lengkap, nomor telepon, WhatsApp pengaduan, email, dan peta lokasi kantor.",
  alternates: {
    canonical: "https://website-kelurahan-amborawang-darat.vercel.app/kontak",
  },
};

export default function Page(){return <ContactPage/>;}
