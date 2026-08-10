"use client";

import { usePublicSettings } from "@/hooks/usePublicSettings";
import PublicFooter from "./PublicFooter";
import PublicHeader from "./PublicHeader";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const { settings } = usePublicSettings();

  return (
    <>
      <PublicHeader settings={settings} />
      {children}
      <PublicFooter settings={settings} />
    </>
  );
}
