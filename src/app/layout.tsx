import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const BASE_URL =
  "https://website-kelurahan-amborawang-darat.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Kelurahan Amborawang Darat | Website Resmi Pemerintah Kelurahan",
    template: "%s | Kelurahan Amborawang Darat",
  },

  description:
    "Website resmi Kelurahan Amborawang Darat, Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur. Menyediakan informasi pemerintahan, pelayanan masyarakat, berita, pengumuman, galeri, profil kelurahan, dan informasi publik.",

  applicationName: "Website Resmi Kelurahan Amborawang Darat",
  authors: [{ name: "Pemerintah Kelurahan Amborawang Darat" }],
  creator: "Pemerintah Kelurahan Amborawang Darat",
  publisher: "Pemerintah Kelurahan Amborawang Darat",
  keywords: [
    "Kelurahan Amborawang Darat",
    "Website Kelurahan Amborawang Darat",
    "Pemerintah Kelurahan Amborawang Darat",
    "Amborawang Darat Samboja Barat",
    "Kelurahan Amborawang Darat Kutai Kartanegara",
    "Amborawang Darat Kalimantan Timur",
    "Samboja Barat",
    "Kutai Kartanegara",
    "Kalimantan Timur",
    "Pelayanan Kelurahan"
  ],
  category: "Pemerintahan",

  verification: {
    google: "q5ReWo_LtIesXBuf1nT7-ETCqNrgxzzg_XSFq6m7er4",
  },

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    siteName: "Kelurahan Amborawang Darat",
    title: "Kelurahan Amborawang Darat | Website Resmi Pemerintah Kelurahan",
    description:
      "Website resmi Kelurahan Amborawang Darat, Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur. Menyediakan informasi pemerintahan, pelayanan masyarakat, berita, pengumuman, galeri, profil kelurahan, dan informasi publik.",
    images: [
      {
        url: "/images/kantor-kelurahan-amborawang-darat.jpg",
        width: 1200,
        height: 630,
        alt: "Kantor Kelurahan Amborawang Darat",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Kelurahan Amborawang Darat | Website Resmi Pemerintah Kelurahan",
    description:
      "Website resmi Kelurahan Amborawang Darat, Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur. Menyediakan informasi pemerintahan, pelayanan masyarakat, berita, pengumuman, galeri, profil kelurahan, dan informasi publik.",
    images: ["/images/kantor-kelurahan-amborawang-darat.jpg"],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}