import type { Metadata } from "next";
import Link from "next/link";
import PublicShell from "@/components/public/PublicShell";
import { buildMetadata, getServerSettings } from "@/lib/seo";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/transparansi",
    title: "Transparansi & Informasi Publik",
    description: `Pusat transparansi, data publik, dokumen, layanan, dan informasi Kelurahan ${settings.villageName}.`,
  });
}

const items = [
  { code: "DP", title: "Data Publik", href: "/data-publik", text: "Statistik penduduk, KK, Data RT, mutasi, bansos, inventaris, fasilitas, dan data agregat lain yang aman dipublikasikan." },
  { code: "DK", title: "Dokumen Publik", href: "/dokumen", text: "Dokumen, formulir, laporan, dan arsip yang disediakan kelurahan untuk masyarakat." },
  { code: "LY", title: "Standar & Informasi Layanan", href: "/layanan", text: "Jenis layanan, persyaratan, estimasi waktu, biaya, dan informasi pelayanan administrasi." },
  { code: "SR", title: "Permohonan Surat", href: "/permohonan-surat", text: "Akses pelayanan surat secara daring serta pemeriksaan status permohonan." },
  { code: "AD", title: "Pengaduan Masyarakat", href: "/pengaduan", text: "Saluran penyampaian pengaduan dan tindak lanjut pelayanan masyarakat." },
  { code: "BR", title: "Berita & Kegiatan", href: "/berita", text: "Publikasi kegiatan pemerintahan, pembangunan, pelayanan, dan informasi masyarakat." },
  { code: "RT", title: "Data Wilayah & RT", href: "/data-rt", text: "Informasi ketua RT serta statistik wilayah yang tidak membuka identitas pribadi warga." },
  { code: "KT", title: "Kontak & Jam Pelayanan", href: "/kontak", text: "Alamat kantor, jam pelayanan, kanal komunikasi, dan lokasi kantor kelurahan." },
  { code: "PV", title: "Kebijakan Privasi", href: "/privasi", text: "Penjelasan batas data publik, data administrasi internal, dan perlindungan informasi pribadi." },
];

export default async function Page() {
  const settings = await getServerSettings();
  return (
    <PublicShell>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <span>Informasi Publik</span>
            <h1>Transparansi Kelurahan {settings.villageName}</h1>
            <p>Pusat akses informasi pemerintahan, pelayanan, statistik, dokumen, dan kanal partisipasi masyarakat yang disajikan dalam satu halaman.</p>
          </div>
        </section>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.intro}>
              <strong>Informasi mudah ditemukan, data pribadi tetap dilindungi.</strong>
              Halaman ini menghubungkan seluruh informasi yang layak dipublikasikan. Data identitas seperti NIK, No. KK, alamat pribadi, identitas penerima bantuan, isi pengaduan, dan data administrasi rinci tetap berada di area admin.
            </div>
            <div className={styles.grid}>
              {items.map((item) => (
                <Link href={item.href} className={styles.card} key={item.href}>
                  <span className={styles.code}>{item.code}</span>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                  <small>Buka informasi →</small>
                </Link>
              ))}
            </div>
            <div className={styles.note}>
              <strong>Catatan:</strong> ketersediaan suatu dokumen atau statistik mengikuti data yang telah diinput dan ditetapkan untuk ditampilkan oleh pengelola website Kelurahan {settings.villageName}.
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
