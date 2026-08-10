import type { Metadata } from "next";
import ProfilePage from "@/components/public/ProfilePage";
import JsonLd from "@/components/seo/JsonLd";
import {
  amborawangProfileFallback,
  type ProfileContent,
} from "@/data/amborawangProfile";
import {
  breadcrumbJsonLd,
  buildMetadata,
  getServerCollection,
  getServerDocument,
  getServerSettings,
} from "@/lib/seo";
import type { RegionLeader } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/profil",
    title: `Profil Kelurahan ${settings.villageName}`,
    description: `Profil Kelurahan ${settings.villageName}, Kecamatan ${settings.subdistrictName}, meliputi sejarah, visi, misi, potensi, kondisi wilayah, dan informasi kelurahan.`,
  });
}

export default async function Page() {
  const [settings, profile, rts] = await Promise.all([
    getServerSettings(),
    getServerDocument<ProfileContent>("pages", "profil", amborawangProfileFallback),
    getServerCollection<RegionLeader>("rts"),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "Profil", path: "/profil" }])} />
      <ProfilePage initialSettings={settings} initialProfile={profile} initialRts={rts} />
    </>
  );
}
