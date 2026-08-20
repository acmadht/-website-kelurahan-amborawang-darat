import { AMBORAWANG_RT_TOTAL } from "@/data/amborawang";
import type { RegionLeader } from "@/types";

export const AMBORAWANG_RT_OPTIONS = Array.from(
  { length: AMBORAWANG_RT_TOTAL },
  (_, index) => String(index + 1).padStart(2, "0"),
);

export function normalizeRtNumber(value: unknown) {
  const numeric = Number(String(value ?? "").replace(/\D/g, ""));
  if (!Number.isInteger(numeric) || numeric < 1 || numeric > AMBORAWANG_RT_TOTAL) {
    return "";
  }
  return String(numeric).padStart(2, "0");
}

/**
 * Amborawang Darat memiliki 13 wilayah RT. Firebase boleh belum terisi lengkap,
 * tetapi halaman publik tetap menampilkan slot RT 01-13 agar struktur wilayah
 * tidak terlihat seolah hanya memiliki RT yang sudah diinput admin.
 */
export function buildAmborawangRtSlots(rawRts: RegionLeader[] = []): RegionLeader[] {
  const byNumber = new Map<string, RegionLeader>();

  for (const item of rawRts) {
    const number = normalizeRtNumber(item.number);
    if (!number) continue;

    // Jika ada duplikasi, prioritaskan record aktif lalu record yang muncul terakhir.
    const existing = byNumber.get(number);
    if (!existing || item.isActive !== false || existing.isActive === false) {
      byNumber.set(number, item);
    }
  }

  return Array.from({ length: AMBORAWANG_RT_TOTAL }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    const existing = byNumber.get(number);

    if (existing) {
      return {
        ...existing,
        number,
        order: index + 1,
        facilities: Array.isArray(existing.facilities) ? existing.facilities : [],
      };
    }

    return {
      id: `rt-slot-${number}`,
      number,
      chairmanName: "",
      photoUrl: "",
      phone: "",
      area: "",
      description: "",
      populationCount: 0,
      familyCount: 0,
      maleCount: 0,
      femaleCount: 0,
      houseCount: 0,
      toddlerCount: 0,
      elderlyCount: 0,
      facilities: [],
      order: index + 1,
      isActive: true,
    } satisfies RegionLeader;
  });
}
