import { notFound, redirect } from "next/navigation";

const legacyRedirects: Record<string, string> = {
  pemerintahan: "/admin/aparatur",
  profil: "/admin/profil",
  layanan: "/admin/layanan",
  berita: "/admin/berita",
  pengumuman: "/admin/pengumuman",
  galeri: "/admin/galeri",
  dokumen: "/admin/dokumen",
  wilayah: "/admin/wilayah",
  kontak: "/admin/kontak",
  pengaturan: "/admin/pengaturan",
};

export default async function Page({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const target = legacyRedirects[module];

  if (target) redirect(target);

  // Modul yang tidak dikenal tidak membuka editor lama.
  notFound();
}
