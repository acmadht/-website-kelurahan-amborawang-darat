"use client";

import { applyAmborawangPublicSettings } from "@/data/amborawang";
import { demoSettings } from "@/data/demo";
import type { SiteSettings } from "@/types";
import { useDocumentData } from "./useFirestoreData";

export function usePublicSettings(initialSettings: SiteSettings = demoSettings) {
  const state = useDocumentData<SiteSettings>(
    "siteSettings",
    "main",
    initialSettings,
  );
  return { ...state, settings: applyAmborawangPublicSettings(state.data) };
}
