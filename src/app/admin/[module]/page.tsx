import { notFound } from "next/navigation";
import AdminModuleEditor from "@/components/admin/AdminModuleEditor";

const allowed = [
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
];

export default async function Page({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;

  // Tim KKN sengaja TIDAK masuk allowed.
  if (!allowed.includes(module)) {
    notFound();
  }

  return <AdminModuleEditor moduleKey={module} />;
}
