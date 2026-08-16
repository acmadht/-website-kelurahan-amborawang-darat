import type { Metadata } from "next";
import Link from "next/link";
import PublicShell from "@/components/public/PublicShell";
import { buildMetadata, getServerSettings } from "@/lib/seo";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/privasi",
    title: "Kebijakan Privasi",
    description: `Informasi perlindungan data dan batas publikasi data pada website Kelurahan ${settings.villageName}.`,
  });
}

const sections = [
  { code: "01", title: "Data yang ditampilkan kepada publik", text: "Website menampilkan informasi pemerintahan, layanan, berita, kegiatan, fasilitas, UMKM, dokumen, Data RT, dan statistik agregat. Statistik publik tidak dimaksudkan untuk menampilkan identitas penduduk per individu." },
  { code: "02", title: "Data administrasi internal", text: "Data seperti NIK, No. KK, alamat pribadi, data keluarga rinci, mutasi penduduk, penerima bansos, permohonan surat, pengaduan, serta pesan masyarakat dikelola pada area administrasi dan tidak ditampilkan sebagai daftar identitas publik." },
  { code: "03", title: "Tujuan penggunaan data", text: "Data digunakan untuk mendukung pelayanan kelurahan, administrasi penduduk, penyusunan statistik, pengelolaan permohonan dan pengaduan, serta penyediaan informasi publik yang relevan." },
  { code: "04", title: "Akses pengelola", text: "Akses area admin dibatasi berdasarkan akun dan peran. Super Admin, Editor, dan Operator RT memperoleh akses sesuai fungsi yang diberikan dalam sistem." },
  { code: "05", title: "Formulir masyarakat", text: "Informasi yang dikirim melalui formulir surat, pengaduan, atau kontak digunakan untuk menindaklanjuti permintaan masyarakat. Nomor tiket dapat digunakan untuk memeriksa status tanpa mempublikasikan isi data pribadi secara terbuka." },
  { code: "06", title: "Backup dan pengamanan", text: "Cadangan data yang berisi informasi administrasi diperlakukan sebagai data internal. File export atau backup sebaiknya disimpan pada media yang aksesnya terbatas dan tidak dibagikan melalui halaman publik." },
];

export default async function Page() {
  const settings = await getServerSettings();
  return (
    <PublicShell>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <span>Perlindungan Data</span>
            <h1>Kebijakan Privasi Website</h1>
            <p>Penjelasan mengenai pemisahan data publik dan data administrasi internal pada website Kelurahan {settings.villageName}.</p>
          </div>
        </section>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.intro}>
              <strong>Prinsip utama</strong>
              Informasi publik disajikan untuk mempermudah akses masyarakat, sementara data yang dapat mengidentifikasi warga secara langsung dijaga di area administrasi dan hanya digunakan sesuai kebutuhan pelayanan serta pengelolaan kelurahan.
            </div>
            <div className={styles.grid}>
              {sections.map((item) => (
                <article className={styles.card} key={item.code}>
                  <span className={styles.code}>{item.code}</span>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
            <div className={styles.note}>
              Untuk pertanyaan mengenai data atau informasi pada website, gunakan halaman <Link href="/kontak"><strong>Kontak Kelurahan</strong></Link>. Lihat juga <Link href="/transparansi"><strong>Transparansi & Informasi Publik</strong></Link> untuk menemukan data dan dokumen yang tersedia untuk masyarakat.
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
