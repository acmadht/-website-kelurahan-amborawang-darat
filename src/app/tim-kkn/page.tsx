import type { Metadata } from "next";
import KknPage from "@/components/public/KknPage";
import JsonLd from "@/components/seo/JsonLd";
import { staticKknMembers, staticKknTeam } from "@/data/kknStatic";
import {
  breadcrumbJsonLd,
  buildMetadata,
  getServerSettings,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/tim-kkn",
    title: `Tim KKN ${settings.villageName}`,
    description: `Informasi Tim KKN Reguler yang melaksanakan program di Kelurahan ${settings.villageName}.`,
  });
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: "Tim KKN", path: "/tim-kkn" },
        ])}
      />
      <KknPage initialTeam={staticKknTeam} initialMembers={staticKknMembers} />
    </>
  );
}
