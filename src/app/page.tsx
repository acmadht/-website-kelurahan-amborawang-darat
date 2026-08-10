import type { Metadata } from "next";
import HomePage from "@/components/public/HomePage";
import JsonLd from "@/components/seo/JsonLd";
import { homeContentFallback, type HomeContent } from "@/data/siteContent";
import {
  buildMetadata,
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
  PostItem,
  RegionLeader,
  ServiceItem,
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
  const [settings, home, slides, services, posts, announcements, agendas, rts] =
    await Promise.all([
      getServerSettings(),
      getServerDocument<HomeContent>("pages", "home", homeContentFallback),
      getServerCollection<HeroSlide>("heroSlides"),
      getServerCollection<ServiceItem>("services"),
      getServerCollection<PostItem>("posts"),
      getServerCollection<Announcement>("announcements"),
      getServerCollection<AgendaItem>("agendas"),
      getServerCollection<RegionLeader>("rts"),
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
      />
    </>
  );
}
