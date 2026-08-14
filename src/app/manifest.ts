import type { MetadataRoute } from "next";
import { demoSettings } from "@/data/demo";
import type { SiteSettings } from "@/types";

async function getPublicSettings(): Promise<SiteSettings> {
  try {
    const { getAdminDb } = await import("@/lib/firebase/admin-db");
    const snapshot = await getAdminDb().collection("siteSettings").doc("main").get();
    if (!snapshot.exists) return demoSettings;
    return { ...demoSettings, ...(snapshot.data() as Partial<SiteSettings>) };
  } catch {
    return demoSettings;
  }
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getPublicSettings();

  return {
    name: settings.siteName || `Kelurahan ${settings.villageName}`,
    short_name: settings.villageName || "Kelurahan",
    description:
      settings.seoDescription ||
      `Website resmi Kelurahan ${settings.villageName}.`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1e3a8a",
    icons: [
      {
        src: settings.faviconUrl || "/icon.png",
        sizes: "any",
      },
    ],
  };
}
