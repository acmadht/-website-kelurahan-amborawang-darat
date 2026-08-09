/**
 * Daftar modul yang BOLEH dikelola melalui admin.
 *
 * "tim-kkn" sengaja tidak ada.
 * Gunakan konstanta ini pada sidebar, permission checker, route guard,
 * API handler, atau validasi Firestore Anda.
 */
export const ADMIN_MODULES = [
  "profil",
  "pemerintahan",
  "layanan",
  "berita",
  "pengumuman",
  "galeri",
  "dokumen",
  "wilayah",
  "kontak",
  "pengaturan",
] as const;

export type AdminModule = (typeof ADMIN_MODULES)[number];

export const PROTECTED_STATIC_ROUTES = ["/tim-kkn"] as const;

export function isAdminModule(value: string): value is AdminModule {
  return (ADMIN_MODULES as readonly string[]).includes(value);
}

export function isProtectedStaticRoute(pathname: string) {
  return PROTECTED_STATIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
