import type { Metadata } from "next";
import HomePage from "@/components/public/HomePage";
import JsonLd from "@/components/seo/JsonLd";
import { homeContentFallback, type HomeContent } from "@/data/siteContent";
import {
  buildMetadata,
  getDynamicPublishedPostsServer,
  getServerCollection,
  getServerDocument,
  getServerSettings,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import type {
  AgendaItem,
  Announcement,
  HeroSlide,
  RegionLeader,
  ServiceItem,
  VillageStats,
} from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/",
    title: settings.seoTitle || `Website Resmi Kelurahan ${settings.villageName}`,
    description:
      settings.seoDescription ||
      `Website resmi Kelurahan ${settings.villageName} untuk informasi layanan publik, pemerintahan, berita, data RT, wilayah, dokumen, dan kontak kelurahan.`,
  });
}

export default async function Page() {
  const [settings, home, slides, services, posts, announcements, agendas, rts, stats] =
    await Promise.all([
      getServerSettings(),
      getServerDocument<HomeContent>("pages", "home", homeContentFallback),
      getServerCollection<HeroSlide>("heroSlides"),
      getServerCollection<ServiceItem>("services"),
      getDynamicPublishedPostsServer(),
      getServerCollection<Announcement>("announcements"),
      getServerCollection<AgendaItem>("agendas"),
      getServerCollection<RegionLeader>("rts"),
      getServerDocument<VillageStats>("villageStats", "main", { population: 0, families: 0, male: 0, female: 0, rtCount: 0 }),
    ]);

  return (
    <>
      <JsonLd data={[websiteJsonLd(settings), organizationJsonLd(settings)]} />
      <HomePage
        initialSettings={settings}
        initialHome={home}
        initialSlides={slides}
        initialServices={services}
        initialPosts={posts}
        initialAnnouncements={announcements}
        initialAgendas={agendas}
        initialRts={rts}
        initialStats={stats}
      />
    </>
  );
}
