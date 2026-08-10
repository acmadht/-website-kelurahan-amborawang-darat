import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getServerSettings, rootMetadata } from "@/lib/seo";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return rootMetadata(settings);
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
