"use client";

import { demoSettings } from "@/data/demo";
import { useDocumentData } from "@/hooks/useFirestoreData";
import PublicFooter from "./PublicFooter";
import PublicHeader from "./PublicHeader";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const { data: settings } = useDocumentData("siteSettings", "main", demoSettings);
  return <><PublicHeader settings={settings} /><main>{children}</main><PublicFooter settings={settings} /></>;
}
