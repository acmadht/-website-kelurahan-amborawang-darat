"use client";

import { applyAmborawangPublicSettings } from "@/data/amborawang";
import { demoSettings } from "@/data/demo";
import type { SiteSettings } from "@/types";
import { useDocumentData } from "./useFirestoreData";

export function usePublicSettings() {
  const state = useDocumentData<SiteSettings>("siteSettings", "main", demoSettings);
  return { ...state, settings: applyAmborawangPublicSettings(state.data) };
}
