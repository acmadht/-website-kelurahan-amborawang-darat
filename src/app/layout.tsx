import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getAdminDb } from "@/lib/firebase/admin";
import "./globals.css";

export const revalidate = 300;

const WEBSITE_URL =
  "https://website-kelurahan-amborawang-darat.vercel.app";

const GOOGLE_SITE_VERIFICATION =
  "q5ReWo_LtIesXBuf1nT7-ETCqNrgxzzg_XSFq6m7er4";

const DEFAULT_TITLE = "Website Resmi Kelurahan Amborawang Darat";

const DEFAULT_DESCRIPTION =
  "Portal informasi, pelayanan publik, berita, dan kegiatan masyarakat Kelurahan Amborawang Darat.";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const snapshot = await getAdminDb()
      .collection("siteSettings")
      .doc("main")
      .get();

    const settings = snapshot.data() as
      | {
        seoTitle?: string;
        seoDescription?: string;
        faviconUrl?: string;
      }
      | undefined;

    const title = settings?.seoTitle?.trim() || DEFAULT_TITLE;

    const description =
      settings?.seoDescription?.trim() || DEFAULT_DESCRIPTION;

    return {
      metadataBase: new URL(WEBSITE_URL),

      title,
      description,

      verification: {
        google: GOOGLE_SITE_VERIFICATION,
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
        },
      },

      icons: settings?.faviconUrl
        ? {
          icon: settings.faviconUrl,
        }
        : undefined,

      openGraph: {
        title,
        description,
        url: WEBSITE_URL,
        siteName: "Website Resmi Kelurahan Amborawang Darat",
        locale: "id_ID",
        type: "website",
      },
    };
  } catch (error) {
    console.error("Gagal mengambil metadata website:", error);

    return {
      metadataBase: new URL(WEBSITE_URL),

      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,

      verification: {
        google: GOOGLE_SITE_VERIFICATION,
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
        },
      },

      openGraph: {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        url: WEBSITE_URL,
        siteName: "Website Resmi Kelurahan Amborawang Darat",
        locale: "id_ID",
        type: "website",
      },
    };
  }
}

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