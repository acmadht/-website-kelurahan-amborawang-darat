"use client";

import { useCollectionData } from "@/hooks/useFirestoreData";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import type { Announcement } from "@/types";
import PublicAnnouncementTicker from "./PublicAnnouncementTicker";
import PublicFooter from "./PublicFooter";
import PublicHeader from "./PublicHeader";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const { settings } = usePublicSettings();
  const { data: announcements } = useCollectionData<Announcement>("announcements", []);

  return (
    <>
      <PublicHeader settings={settings} />
      <PublicAnnouncementTicker announcements={announcements} />
      {children}
      <PublicFooter settings={settings} />
    </>
  );
}
