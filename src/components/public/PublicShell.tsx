"use client";

import { applyAmborawangPublicSettings } from "@/data/amborawang";
import { demoSettings } from "@/data/demo";
import { useDocumentData } from "@/hooks/useFirestoreData";
import type { SiteSettings } from "@/types";
import PublicFooter from "./PublicFooter";
import PublicHeader from "./PublicHeader";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const { data } = useDocumentData<SiteSettings>("siteSettings", "main", demoSettings);
  const settings = applyAmborawangPublicSettings(data);

  return <><PublicHeader settings={settings} /><main>{children}</main><PublicFooter settings={settings} /></>;
}
