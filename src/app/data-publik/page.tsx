import type { Metadata } from "next";
import Link from "next/link";
import PublicShell from "@/components/public/PublicShell";
import { buildMetadata, getServerCollection, getServerSettings } from "@/lib/seo";
import type {
  FamilyRecord,
  InventoryRecord,
  PopulationMutationRecord,
  RegionLeader,
  ResidentRecord,
  SocialAssistanceRecord,
} from "@/types";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  return buildMetadata({
    settings,
    path: "/data-publik",
    title: "Data Publik Kelurahan",
    description: `Portal statistik publik Kelurahan ${settings.villageName} yang menyajikan data agregat tanpa membuka identitas pribadi.`,
  });
}

function numberValue(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeRt(value: unknown) {
  const numeric = Number(String(value ?? "").replace(/\D/g, ""));
  return Number.isInteger(numeric) && numeric > 0 ? String(numeric).padStart(2, "0") : "-";
}

type PublicRtTotals = {
  population: number;
  families: number;
  male: number;
  female: number;
  houses: number;
  toddlers: number;
  elderly: number;
  facilities: number;
};

function formatFacilities(value: unknown) {
  if (Array.isArray(value)) {
    const values = value.map((item) => String(item ?? "").trim()).filter(Boolean);
    return values.length ? values.join(", ") : "Belum diisi";
  }
  const normalized = String(value ?? "").trim();
  return normalized || "Belum diisi";
}

export default async function Page() {
  const [settings, residents, families, mutations, aid, inventory, rts] = await Promise.all([
    getServerSettings(),
    getServerCollection<ResidentRecord>("residents"),
    getServerCollection<FamilyRecord>("families"),
    getServerCollection<PopulationMutationRecord>("populationMutations"),
    getServerCollection<SocialAssistanceRecord>("socialAssistance"),
    getServerCollection<InventoryRecord>("inventory"),
    getServerCollection<RegionLeader>("rts"),
  ]);

  const activeResidents = residents.filter(
    (item) => !["pindah", "meninggal"].includes(String(item.domicileStatus || "").toLowerCase()),
  );
  const activeRts = rts
    .filter((item) => item.isActive !== false)
    .sort((a, b) => numberValue(a.order) - numberValue(b.order) || normalizeRt(a.number).localeCompare(normalizeRt(b.number)));

  const rtTotals = activeRts.reduce<PublicRtTotals>(
    (totals, item) => ({
      population: totals.population + numberValue(item.populationCount),
      families: totals.families + numberValue(item.familyCount),
      male: totals.male + numberValue(item.maleCount),
      female: totals.female + numberValue(item.femaleCount),
      houses: totals.houses + numberValue(item.houseCount),
      toddlers: totals.toddlers + numberValue(item.toddlerCount),
      elderly: totals.elderly + numberValue(item.elderlyCount),
      facilities: totals.facilities + (Array.isArray(item.facilities) ? item.facilities.filter(Boolean).length : 0),
    }),
    { population: 0, families: 0, male: 0, female: 0, houses: 0, toddlers: 0, elderly: 0, facilities: 0 },
  );

  // Data rinci menjadi sumber utama bila sudah tersedia. Angka yang memang
  // hanya ada di Data RT (rumah, balita, lansia, fasilitas) tetap berasal dari RT.
  const publicPopulation = residents.length ? activeResidents.length : rtTotals.population;
  const publicFamilies = families.length || rtTotals.families;
  const publicMale = residents.length
    ? activeResidents.filter((item) => String(item.gender || "").toLowerCase().includes("laki")).length
    : rtTotals.male;
  const publicFemale = residents.length
    ? activeResidents.filter((item) => String(item.gender || "").toLowerCase().includes("perempuan")).length
    : rtTotals.female;

  const inventoryUnits = inventory.reduce((sum, item) => sum + numberValue(item.quantity), 0);

  const cards = [
    { href: "/penduduk", code: "PD", title: "Penduduk", value: publicPopulation, suffix: "jiwa aktif", text: "Demografi lengkap, KK, rumah, balita, lansia, dan sebaran RT dalam bentuk agregat." },
    { href: "/keluarga", code: "KK", title: "Keluarga / KK", value: publicFamilies, suffix: "keluarga", text: "Jumlah keluarga, anggota keluarga, sebaran RT, dan status rumah tanpa membuka No. KK." },
    { href: "/data-rt", code: "RT", title: "Data RT", value: activeRts.length, suffix: "RT aktif", text: "Ringkasan lengkap tiap RT: warga, KK, laki-laki, perempuan, rumah, balita, lansia, dan fasilitas." },
    { href: "/mutasi", code: "MT", title: "Mutasi Penduduk", value: mutations.length, suffix: "catatan", text: "Tren pindah masuk, pindah keluar, antar-RT, dan perubahan status penduduk." },
    { href: "/bansos", code: "BS", title: "Bantuan Sosial", value: aid.length, suffix: "penerimaan", text: "Ringkasan jenis bantuan, status penyaluran, sumber program, dan sebaran RT." },
    { href: "/inventaris", code: "IV", title: "Inventaris", value: inventoryUnits, suffix: "total kuantitas", text: "Aset/barang kelurahan menurut kategori, kondisi, lokasi, dan sumber perolehan." },
  ];

  const rtStats = [
    { label: "Jumlah Warga", value: publicPopulation, suffix: "jiwa" },
    { label: "Kepala Keluarga", value: publicFamilies, suffix: "KK" },
    { label: "Laki-laki", value: publicMale, suffix: "jiwa" },
    { label: "Perempuan", value: publicFemale, suffix: "jiwa" },
    { label: "Jumlah Rumah", value: rtTotals.houses, suffix: "rumah" },
    { label: "Balita", value: rtTotals.toddlers, suffix: "jiwa" },
    { label: "Lansia", value: rtTotals.elderly, suffix: "jiwa" },
    { label: "RT Aktif", value: activeRts.length, suffix: "RT" },
  ];

  return (
    <PublicShell>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <span>Transparansi & Statistik</span>
            <h1>Data Publik Kelurahan {settings.villageName}</h1>
            <p>
              Portal ini menyajikan ringkasan administrasi kelurahan secara aman. Data identitas pribadi tetap berada pada sistem admin dan tidak dipublikasikan per individu.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.notice}>
              <strong>Prinsip publikasi</strong>
              <span>
                NIK, No. KK, nama penduduk/penerima, alamat pribadi, nomor dokumen, serta data personal lainnya tidak ditampilkan. Angka yang terlihat merupakan agregat dari data administrasi dan Data RT yang tersedia.
              </span>
            </div>

            <div className={styles.grid}>
              {cards.map((card) => (
                <Link href={card.href} className={styles.card} key={card.href}>
                  <span className={styles.code}>{card.code}</span>
                  <div><h2>{card.title}</h2><p>{card.text}</p></div>
                  <div className={styles.metric}><strong>{card.value}</strong><small>{card.suffix}</small></div>
                  <span className={styles.arrow}>Buka data →</span>
                </Link>
              ))}
            </div>

            <section className={styles.rtSection}>
              <div className={styles.rtHeading}>
                <div>
                  <span>Terhubung langsung dengan Data RT</span>
                  <h2>Ringkasan lengkap data kependudukan per wilayah RT</h2>
                  <p>
                    Angka di bawah memakai sumber yang sama dengan halaman Data RT. Jika data RT berubah, ringkasan publik ini ikut berubah saat halaman dimuat ulang.
                  </p>
                </div>
                <Link href="/data-rt">Lihat Detail Data RT →</Link>
              </div>

              <div className={styles.rtStatsGrid}>
                {rtStats.map((stat) => (
                  <article className={styles.rtStatCard} key={stat.label}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <small>{stat.suffix}</small>
                  </article>
                ))}
              </div>

              <article className={styles.rtTablePanel}>
                <div className={styles.rtTableHead}>
                  <div>
                    <span>Rincian per RT</span>
                    <h3>Semua statistik publik yang tersedia pada Data RT</h3>
                  </div>
                  <small>{activeRts.length} RT</small>
                </div>
                <div className={styles.rtTableScroll}>
                  <table>
                    <thead>
                      <tr>
                        <th>RT</th>
                        <th>Ketua RT</th>
                        <th>Jumlah Warga</th>
                        <th>KK</th>
                        <th>Laki-laki</th>
                        <th>Perempuan</th>
                        <th>Rumah</th>
                        <th>Balita</th>
                        <th>Lansia</th>
                        <th>Fasilitas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeRts.length ? activeRts.map((rt) => (
                        <tr key={rt.id || rt.number}>
                          <td><Link href="/data-rt">RT {normalizeRt(rt.number || rt.id)}</Link></td>
                          <td>{String(rt.chairmanName || "Belum diisi")}</td>
                          <td>{numberValue(rt.populationCount)}</td>
                          <td>{numberValue(rt.familyCount)}</td>
                          <td>{numberValue(rt.maleCount)}</td>
                          <td>{numberValue(rt.femaleCount)}</td>
                          <td>{numberValue(rt.houseCount)}</td>
                          <td>{numberValue(rt.toddlerCount)}</td>
                          <td>{numberValue(rt.elderlyCount)}</td>
                          <td>{formatFacilities(rt.facilities)}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={10} className={styles.rtEmpty}>Belum ada Data RT yang dapat ditampilkan.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>

            <section className={styles.connectedSection}>
              <div className={styles.connectedHeading}>
                <span>Informasi terkait</span>
                <h2>Data publik terhubung dengan halaman layanan dan wilayah</h2>
                <p>Gunakan halaman berikut untuk melihat konteks wilayah, RT, fasilitas, potensi usaha, dan layanan yang berkaitan dengan statistik di atas.</p>
              </div>
              <div className={styles.connectedGrid}>
                {[
                  { href: "/data-rt", title: "Data RT", text: "Ketua RT serta ringkasan lengkap warga, KK, rumah, balita, lansia, dan fasilitas." },
                  { href: "/wilayah", title: "Wilayah", text: "Batas administratif, karakter wilayah, dan peta kelurahan." },
                  { href: "/fasilitas", title: "Fasilitas", text: "Sarana dan prasarana publik yang tersedia di wilayah." },
                  { href: "/umkm", title: "UMKM", text: "Potensi ekonomi dan usaha masyarakat yang ditampilkan publik." },
                  { href: "/layanan", title: "Layanan", text: "Informasi pelayanan administrasi yang dapat diakses masyarakat." },
                ].map((item) => (
                  <Link href={item.href} key={item.href} className={styles.connectedCard}>
                    <strong>{item.title}</strong><span>{item.text}</span><small>Buka →</small>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
