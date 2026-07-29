import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const BASE_URL =
  "https://website-kelurahan-amborawang-darat.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Website Resmi Kelurahan Amborawang Darat",
    template: "%s | Kelurahan Amborawang Darat",
  },

  description:
    "Portal resmi Kelurahan Amborawang Darat yang menyediakan informasi pemerintahan, pelayanan publik, berita, pengumuman, dan kegiatan masyarakat.",

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
    title: "Website Resmi Kelurahan Amborawang Darat",
    description:
      "Portal informasi dan pelayanan masyarakat Kelurahan Amborawang Darat.",
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