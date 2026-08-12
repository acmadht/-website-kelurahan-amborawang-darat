/**
 * Daftar modul yang dapat dikelola melalui dashboard admin.
 * Konten KKN bersifat statis dan sengaja tidak termasuk modul dashboard admin.
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

export const PROTECTED_STATIC_ROUTES: readonly string[] = [];

export function isAdminModule(value: string): value is AdminModule {
  return (ADMIN_MODULES as readonly string[]).includes(value);
}

export function isProtectedStaticRoute(pathname: string) {
  return PROTECTED_STATIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
