import type { Metadata } from "next";
import type { ReactNode } from "react";
import { demoSettings } from "@/data/demo";
import type { SiteSettings } from "@/types";
import "./globals.css";

const BASE_URL = "https://website-kelurahan-amborawang-darat.vercel.app";

export const dynamic = "force-dynamic";

async function getPublicSettings(): Promise<SiteSettings> {
  try {
    const { getAdminDb } = await import("@/lib/firebase/admin");
    const snapshot = await getAdminDb().collection("siteSettings").doc("main").get();
    if (!snapshot.exists) return demoSettings;
    return { ...demoSettings, ...(snapshot.data() as Partial<SiteSettings>) };
  } catch {
    return demoSettings;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const title = settings.seoTitle || settings.siteName || demoSettings.seoTitle;
  const description = settings.seoDescription || demoSettings.seoDescription;
  const officeImage = settings.officeImageUrl || demoSettings.officeImageUrl || "/images/kantor-kelurahan-amborawang-darat.jpg";

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: `%s | ${settings.villageName || "Kelurahan Amborawang Darat"}`,
    },
    description,
    applicationName: settings.siteName || demoSettings.siteName,
    authors: [{ name: `Pemerintah Kelurahan ${settings.villageName || "Amborawang Darat"}` }],
    creator: `Pemerintah Kelurahan ${settings.villageName || "Amborawang Darat"}`,
    publisher: `Pemerintah Kelurahan ${settings.villageName || "Amborawang Darat"}`,
    keywords: [
      settings.villageName || "Amborawang Darat",
      `Kelurahan ${settings.villageName || "Amborawang Darat"}`,
      "Samboja Barat",
      "Kutai Kartanegara",
      "Kalimantan Timur",
      "Pelayanan Kelurahan",
    ],
    category: "Pemerintahan",
    icons: { icon: settings.faviconUrl || "/icon.png" },
    verification: { google: "q5ReWo_LtIesXBuf1nT7-ETCqNrgxzzg_XSFq6m7er4" },
    alternates: { canonical: "/" },
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
      siteName: settings.siteName || demoSettings.siteName,
      title,
      description,
      images: [{ url: officeImage, width: 1200, height: 630, alt: `Kelurahan ${settings.villageName || "Amborawang Darat"}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [officeImage],
    },
  };
}

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
