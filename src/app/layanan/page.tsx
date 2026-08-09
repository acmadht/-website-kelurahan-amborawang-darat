import type { Metadata } from "next";
import ServicesPage from "@/components/public/ServicesPage";

export const metadata: Metadata = {
  title: "Layanan Kelurahan Amborawang Darat | Pelayanan Masyarakat",
  description: "Informasi dan panduan pelayanan administrasi kependudukan, surat keterangan usaha, pengaduan masyarakat, dan dokumen pelayanan publik Kelurahan Amborawang Darat.",
  alternates: {
    canonical: "https://website-kelurahan-amborawang-darat.vercel.app/layanan",
  },
};

export default function Page(){return <ServicesPage/>;}
