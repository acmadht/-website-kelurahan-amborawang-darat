import type { Metadata } from "next";
import DocumentsPage from "@/components/public/DocumentsPage";

export const metadata: Metadata = {
  title: "Dokumen Publik Kelurahan Amborawang Darat | Unduh Berkas Resmi",
  description: "Pusat unduhan berkas publik resmi Kelurahan Amborawang Darat. Dapatkan formulir permohonan surat keterangan, standar pelayanan, dan dokumen dinas resmi.",
  alternates: {
    canonical: "https://website-kelurahan-amborawang-darat.vercel.app/dokumen",
  },
};

export default function Page(){return <DocumentsPage/>;}
