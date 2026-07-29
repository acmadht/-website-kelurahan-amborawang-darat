import type { Metadata } from "next";
import { getAdminDb } from "@/lib/firebase/admin";
import "./globals.css";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const snapshot = await getAdminDb().collection("siteSettings").doc("main").get();
    const settings = snapshot.data() as
      | { seoTitle?: string; seoDescription?: string; faviconUrl?: string }
      | undefined;

    return {
      title: settings?.seoTitle || "Website Resmi Kelurahan",
      description:
        settings?.seoDescription ||
        "Portal informasi dan layanan masyarakat kelurahan.",
      icons: settings?.faviconUrl ? { icon: settings.faviconUrl } : undefined,
    };
  } catch {
    return {
      title: "Website Resmi Kelurahan",
      description: "Portal informasi dan layanan masyarakat kelurahan.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
