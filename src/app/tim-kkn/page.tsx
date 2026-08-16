import type { Metadata } from "next";
import KknPage from "@/components/public/KknPage";
import JsonLd from "@/components/seo/JsonLd";
import { staticKknMembers, staticKknTeam } from "@/data/kknStatic";
import type { KknMember, KknTeam } from "@/types";
import {
  breadcrumbJsonLd,
  buildMetadata,
  getServerCollection,
  getServerDocument,
  getServerSettings,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/tim-kkn",
    title: `Tim KKN ${settings.villageName}`,
    description: `Informasi Tim KKN Reguler yang melaksanakan program di Kelurahan ${settings.villageName}.`,
  });
}

export default async function Page() {
  const [team, remoteMembers] = await Promise.all([
    getServerDocument<KknTeam>("kknTeam", "main", staticKknTeam),
    getServerCollection<KknMember>("kknMembers"),
  ]);

  const members = remoteMembers.length ? remoteMembers : staticKknMembers;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: "Tim KKN", path: "/tim-kkn" },
        ])}
      />
      <KknPage initialTeam={team} initialMembers={members} />
    </>
  );
}
