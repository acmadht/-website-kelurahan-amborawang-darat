import Link from "next/link";
import type { SiteSettings } from "@/types";
import PublicShell from "./PublicShell";
import styles from "./PublicAdministrativeDataPage.module.css";

type Mode = "penduduk" | "keluarga" | "mutasi" | "bansos" | "inventaris";

type LinkedAdministrativeData = {
  rts?: Record<string, unknown>[];
  residents?: Record<string, unknown>[];
};

type RtTotals = {
  population: number;
  families: number;
  male: number;
  female: number;
  houses: number;
  toddlers: number;
  elderly: number;
  facilities: number;
  umkm: number;
  aid: number;
  inventory: number;
  mutations: number;
};

type Props = {
  mode: Mode;
  settings: SiteSettings;
  records: Record<string, unknown>[];
  linkedData?: LinkedAdministrativeData;
  scopeRt?: string;
};

const MODULES = [
  { mode: "penduduk", label: "Penduduk", href: "/penduduk" },
  { mode: "keluarga", label: "Keluarga / KK", href: "/keluarga" },
  { mode: "mutasi", label: "Mutasi", href: "/mutasi" },
  { mode: "bansos", label: "Bansos", href: "/bansos" },
  { mode: "inventaris", label: "Inventaris", href: "/inventaris" },
] as const;

function text(value: unknown, fallback = "Belum diisi") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function numberValue(value: unknown) {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}

function normalizeRt(value: unknown) {
  const numeric = Number(String(value ?? "").replace(/\D/g, ""));
  return Number.isInteger(numeric) && numeric > 0 ? String(numeric).padStart(2, "0") : "Belum diisi";
}

function countBy(records: Record<string, unknown>[], read: (item: Record<string, unknown>) => string) {
  const counts = new Map<string, number>();
  for (const item of records) {
    const label = read(item).trim() || "Belum diisi";
    counts.set(label, (counts.get(label) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "id"));
}

function titleFor(mode: Mode) {
  if (mode === "penduduk") return "Statistik Penduduk";
  if (mode === "keluarga") return "Statistik Keluarga / KK";
  if (mode === "mutasi") return "Statistik Mutasi Penduduk";
  if (mode === "bansos") return "Statistik Bantuan Sosial";
  return "Ringkasan Inventaris Kelurahan";
}

function descriptionFor(mode: Mode, villageName: string) {
  if (mode === "penduduk") return `Ringkasan demografi Kelurahan ${villageName} yang dihitung dari administrasi penduduk tanpa menampilkan identitas perorangan.`;
  if (mode === "keluarga") return `Ringkasan data keluarga dan kepala keluarga di Kelurahan ${villageName} tanpa menampilkan nomor KK, nama, atau alamat keluarga.`;
  if (mode === "mutasi") return `Ringkasan pergerakan penduduk untuk transparansi data wilayah tanpa membuka NIK, nama, alamat, atau nomor dokumen.`;
  if (mode === "bansos") return `Ringkasan program bantuan sosial tanpa menampilkan nama penerima, NIK, nomor KK, atau identitas penerima lainnya.`;
  return `Ringkasan aset dan barang Kelurahan ${villageName}. Informasi penanggung jawab personal tidak ditampilkan pada website publik.`;
}

function buildData(mode: Mode, records: Record<string, unknown>[], linkedData: LinkedAdministrativeData = {}) {
  if (mode === "penduduk") {
    const active = records.filter((item) => !["pindah", "meninggal"].includes(text(item.domicileStatus, "").toLowerCase()));
    const rts = (linkedData.rts ?? [])
      .filter((item) => item.isActive !== false)
      .sort((a, b) => numberValue(a.order) - numberValue(b.order) || normalizeRt(a.number ?? a.id).localeCompare(normalizeRt(b.number ?? b.id)));

    const rtTotals = rts.reduce<RtTotals>(
      (totals, item) => ({
        population: totals.population + numberValue(item.populationCount),
        families: totals.families + numberValue(item.familyCount),
        male: totals.male + numberValue(item.maleCount),
        female: totals.female + numberValue(item.femaleCount),
        houses: totals.houses + numberValue(item.houseCount),
        toddlers: totals.toddlers + numberValue(item.toddlerCount),
        elderly: totals.elderly + numberValue(item.elderlyCount),
        facilities: totals.facilities + numberValue(item.facilityCount || (Array.isArray(item.facilities) ? item.facilities.length : 0)),
        umkm: totals.umkm + numberValue(item.umkmCount),
        aid: totals.aid + numberValue(item.socialAssistanceCount),
        inventory: totals.inventory + numberValue(item.inventoryItemCount),
        mutations: totals.mutations + numberValue(item.mutationCount),
      }),
      { population: 0, families: 0, male: 0, female: 0, houses: 0, toddlers: 0, elderly: 0, facilities: 0, umkm: 0, aid: 0, inventory: 0, mutations: 0 },
    );

    const maleFromResidents = active.filter((item) => text(item.gender, "").toLowerCase().includes("laki")).length;
    const femaleFromResidents = active.filter((item) => text(item.gender, "").toLowerCase().includes("perempuan")).length;

    // Penduduk rinci menjadi sumber utama untuk jumlah jiwa dan jenis kelamin.
    // Statistik wilayah lain (KK, rumah, balita, lansia) tetap mengambil Data RT
    // agar semua data yang tampil pada halaman RT juga tersedia di Data Publik.
    const population = records.length ? active.length : rtTotals.population;
    const male = records.length ? maleFromResidents : rtTotals.male;
    const female = records.length ? femaleFromResidents : rtTotals.female;

    const rows = rts.map((item) => ({
      RT: `RT ${normalizeRt(item.number ?? item.id)}`,
      "Ketua RT": text(item.chairmanName),
      Warga: numberValue(item.populationCount),
      KK: numberValue(item.familyCount),
      "Laki-laki": numberValue(item.maleCount),
      Perempuan: numberValue(item.femaleCount),
      Rumah: numberValue(item.houseCount),
      Balita: numberValue(item.toddlerCount),
      Lansia: numberValue(item.elderlyCount),
      Fasilitas: Array.isArray(item.facilities) && item.facilities.length
        ? item.facilities.map((value) => String(value)).filter(Boolean).join(", ")
        : "Belum diisi",
      UMKM: numberValue(item.umkmCount),
      Bansos: numberValue(item.socialAssistanceCount),
      Inventaris: numberValue(item.inventoryItemCount),
      Mutasi: numberValue(item.mutationCount),
    }));

    const distribution = rts.length
      ? rts.map((item) => ({ label: `RT ${normalizeRt(item.number ?? item.id)}`, value: numberValue(item.populationCount) }))
      : countBy(active, (item) => `RT ${normalizeRt(item.rt)}`);

    return {
      stats: [
        { label: "Jumlah Warga", value: population, suffix: "jiwa" },
        { label: "Kepala Keluarga", value: rtTotals.families, suffix: "KK" },
        { label: "Laki-laki", value: male, suffix: "jiwa" },
        { label: "Perempuan", value: female, suffix: "jiwa" },
        { label: "Jumlah Rumah", value: rtTotals.houses, suffix: "rumah" },
        { label: "Balita", value: rtTotals.toddlers, suffix: "jiwa" },
        { label: "Lansia", value: rtTotals.elderly, suffix: "jiwa" },
        { label: "RT terdata", value: rts.length || new Set(active.map((item) => normalizeRt(item.rt)).filter((value) => value !== "Belum diisi")).size, suffix: "RT" },
        { label: "Fasilitas Terhubung", value: rtTotals.facilities, suffix: "fasilitas" },
        { label: "UMKM Terhubung", value: rtTotals.umkm, suffix: "usaha" },
        { label: "Bansos Terhubung", value: rtTotals.aid, suffix: "data" },
        { label: "Inventaris Terhubung", value: rtTotals.inventory, suffix: "jenis barang" },
        { label: "Mutasi Terkait", value: rtTotals.mutations, suffix: "catatan" },
      ],
      groups: [
        { title: "Sebaran warga per RT", items: distribution },
        ...(rts.length ? [
          { title: "Sebaran KK per RT", items: rts.map((item) => ({ label: `RT ${normalizeRt(item.number ?? item.id)}`, value: numberValue(item.familyCount) })) },
          { title: "Sebaran rumah per RT", items: rts.map((item) => ({ label: `RT ${normalizeRt(item.number ?? item.id)}`, value: numberValue(item.houseCount) })) },
          { title: "Balita per RT", items: rts.map((item) => ({ label: `RT ${normalizeRt(item.number ?? item.id)}`, value: numberValue(item.toddlerCount) })) },
          { title: "Lansia per RT", items: rts.map((item) => ({ label: `RT ${normalizeRt(item.number ?? item.id)}`, value: numberValue(item.elderlyCount) })) },
          { title: "Fasilitas per RT", items: rts.map((item) => ({ label: `RT ${normalizeRt(item.number ?? item.id)}`, value: numberValue(item.facilityCount || (Array.isArray(item.facilities) ? item.facilities.length : 0)) })) },
          { title: "UMKM per RT", items: rts.map((item) => ({ label: `RT ${normalizeRt(item.number ?? item.id)}`, value: numberValue(item.umkmCount) })) },
          { title: "Bansos per RT", items: rts.map((item) => ({ label: `RT ${normalizeRt(item.number ?? item.id)}`, value: numberValue(item.socialAssistanceCount) })) },
        ] : []),
        ...(records.length ? [
          { title: "Status domisili", items: countBy(records, (item) => text(item.domicileStatus)) },
          { title: "Pendidikan", items: countBy(active, (item) => text(item.education)) },
          { title: "Pekerjaan", items: countBy(active, (item) => text(item.occupation)) },
        ] : []),
      ],
      rows,
    };
  }

  if (mode === "keluarga") {
    const rts = linkedData.rts ?? [];
    const residents = linkedData.residents ?? [];
    const activeResidents = residents.filter((item) => !["pindah", "meninggal"].includes(text(item.domicileStatus, "").toLowerCase()));

    // Rincian keluarga menjadi sumber utama. Bila sheet/koleksi Keluarga belum
    // terisi, jumlah KK dan sebaran RT langsung memakai agregat Data RT.
    const familyCountFromRt = rts
      .filter((item) => item.isActive !== false)
      .reduce((sum, item) => sum + numberValue(item.familyCount), 0);
    const populationFromRt = rts
      .filter((item) => item.isActive !== false)
      .reduce((sum, item) => sum + numberValue(item.populationCount), 0);

    const familyTotal = records.length || familyCountFromRt;
    const memberTotal = activeResidents.length
      ? activeResidents.length
      : records.length
        ? records.reduce((sum, item) => sum + numberValue(item.memberCount), 0)
        : populationFromRt;

    const familyDistribution = records.length
      ? countBy(records, (item) => `RT ${normalizeRt(item.rt)}`)
      : rts
          .filter((item) => item.isActive !== false)
          .map((item) => ({ label: `RT ${normalizeRt(item.number ?? item.id)}`, value: numberValue(item.familyCount) }))
          .filter((item) => item.value > 0);

    const rtTotal = familyDistribution.filter((item) => item.value > 0).length;

    return {
      stats: [
        { label: "Keluarga / KK", value: familyTotal, suffix: "KK" },
        { label: "Anggota keluarga tercatat", value: memberTotal, suffix: "orang" },
        { label: "Rata-rata anggota", value: familyTotal ? (memberTotal / familyTotal).toFixed(1) : "0", suffix: "orang/KK" },
        { label: "RT terdata", value: rtTotal, suffix: "RT" },
      ],
      groups: [
        { title: "Sebaran keluarga per RT", items: familyDistribution },
        ...(records.length ? [{ title: "Status rumah", items: countBy(records, (item) => text(item.housingStatus)) }] : []),
      ],
      rows: [] as Record<string, string | number>[],
    };
  }

  if (mode === "mutasi") {
    const currentYear = String(new Date().getFullYear());
    const thisYear = records.filter((item) => text(item.date, "").startsWith(currentYear));
    return {
      stats: [
        { label: "Total mutasi", value: records.length, suffix: "catatan" },
        { label: `Mutasi ${currentYear}`, value: thisYear.length, suffix: "catatan" },
        { label: "Jenis mutasi", value: new Set(records.map((item) => text(item.mutationType, "")).filter(Boolean)).size, suffix: "jenis" },
        { label: "RT terkait", value: new Set(records.flatMap((item) => [normalizeRt(item.originRt), normalizeRt(item.destinationRt)]).filter((x) => x !== "Belum diisi")).size, suffix: "RT" },
      ],
      groups: [
        { title: "Jenis mutasi", items: countBy(records, (item) => text(item.mutationType)) },
        { title: "Tahun pencatatan", items: countBy(records, (item) => text(item.date, "").slice(0, 4) || "Belum diisi") },
      ],
      rows: [] as Record<string, string | number>[],
    };
  }

  if (mode === "bansos") {
    const distributed = records.filter((item) => /tersalur|diterima/i.test(text(item.receiptStatus, ""))).length;
    return {
      stats: [
        { label: "Data bantuan", value: records.length, suffix: "penerimaan" },
        { label: "Tersalurkan", value: distributed, suffix: "penerimaan" },
        { label: "Jenis bantuan", value: new Set(records.map((item) => text(item.aidType, "")).filter(Boolean)).size, suffix: "program" },
        { label: "RT terjangkau", value: new Set(records.map((item) => normalizeRt(item.rt)).filter((x) => x !== "Belum diisi")).size, suffix: "RT" },
      ],
      groups: [
        { title: "Jenis bantuan", items: countBy(records, (item) => text(item.aidType)) },
        { title: "Status penyaluran", items: countBy(records, (item) => text(item.receiptStatus)) },
        { title: "Sumber program", items: countBy(records, (item) => text(item.programSource)) },
        { title: "Sebaran per RT", items: countBy(records, (item) => `RT ${normalizeRt(item.rt)}`) },
      ],
      rows: [] as Record<string, string | number>[],
    };
  }

  const totalQuantity = records.reduce((sum, item) => sum + numberValue(item.quantity), 0);
  return {
    stats: [
      { label: "Jenis barang", value: records.length, suffix: "data" },
      { label: "Total kuantitas", value: totalQuantity, suffix: "unit/satuan" },
      { label: "Kategori", value: new Set(records.map((item) => text(item.category, "")).filter(Boolean)).size, suffix: "kategori" },
      { label: "Lokasi aset", value: new Set(records.map((item) => text(item.location, "")).filter(Boolean)).size, suffix: "lokasi" },
      { label: "RT terkait", value: new Set(records.map((item) => normalizeRt(item.rt)).filter((value) => value !== "Belum diisi")).size, suffix: "RT" },
    ],
    groups: [
      { title: "Kondisi inventaris", items: countBy(records, (item) => text(item.condition)) },
      { title: "Kategori inventaris", items: countBy(records, (item) => text(item.category)) },
      { title: "Sebaran inventaris per RT", items: countBy(records.filter((item) => normalizeRt(item.rt) !== "Belum diisi"), (item) => `RT ${normalizeRt(item.rt)}`) },
    ],
    rows: records.map((item) => ({
      "Nama Barang": text(item.itemName),
      Kategori: text(item.category),
      Jumlah: numberValue(item.quantity),
      Satuan: text(item.unit),
      Kondisi: text(item.condition),
      Lokasi: text(item.location),
      RT: normalizeRt(item.rt),
      "Tahun Perolehan": text(item.acquisitionYear),
      "Sumber Dana": text(item.fundingSource),
    })),
  };
}


function relatedFor(mode: Mode) {
  const map: Record<Mode, Array<{ href: string; title: string; text: string }>> = {
    penduduk: [
      { href: "/keluarga", title: "Keluarga / KK", text: "Lihat ringkasan keluarga yang terhubung melalui No. KK." },
      { href: "/mutasi", title: "Mutasi Penduduk", text: "Lihat tren perpindahan dan perubahan status penduduk." },
      { href: "/data-rt", title: "Data RT", text: "Bandingkan sebaran penduduk dengan ringkasan masing-masing RT." },
    ],
    keluarga: [
      { href: "/penduduk", title: "Penduduk", text: "Jumlah anggota keluarga diselaraskan dari data penduduk yang memiliki No. KK terkait." },
      { href: "/bansos", title: "Bantuan Sosial", text: "Lihat agregat program bantuan yang dapat terkait dengan keluarga." },
      { href: "/data-rt", title: "Data RT", text: "Jumlah KK per RT ikut membentuk ringkasan wilayah RT." },
    ],
    mutasi: [
      { href: "/penduduk", title: "Penduduk Aktif", text: "Status domisili penduduk menjadi sumber jumlah warga aktif." },
      { href: "/data-rt", title: "Data RT", text: "Perubahan domisili dan RT tercermin pada statistik wilayah setelah data penduduk diperbarui." },
      { href: "/layanan", title: "Layanan Kelurahan", text: "Buka informasi pelayanan administrasi yang berkaitan dengan perpindahan penduduk." },
    ],
    bansos: [
      { href: "/penduduk", title: "Penduduk", text: "NIK dapat digunakan secara internal untuk menghubungkan data bantuan dengan wilayah RT." },
      { href: "/keluarga", title: "Keluarga / KK", text: "No. KK menjadi penghubung internal antara bantuan dan keluarga." },
      { href: "/data-rt", title: "Data RT", text: "Lihat sebaran wilayah RT yang menjadi dasar agregasi bantuan." },
    ],
    inventaris: [
      { href: "/fasilitas", title: "Fasilitas", text: "Lihat sarana publik yang dapat menjadi lokasi penggunaan atau penempatan aset." },
      { href: "/wilayah", title: "Wilayah", text: "Lihat konteks lokasi dan karakter wilayah kelurahan." },
      { href: "/dokumen", title: "Dokumen Publik", text: "Buka dokumen dan arsip publik yang tersedia." },
    ],
  };
  return map[mode];
}

export default function PublicAdministrativeDataPage({ mode, settings, records, linkedData, scopeRt }: Props) {
  const normalizedScopeRt = scopeRt ? normalizeRt(scopeRt) : "";
  const hasRtScope = Boolean(normalizedScopeRt && normalizedScopeRt !== "Belum diisi");
  const scopedRecords = hasRtScope
    ? records.filter((item) => {
        if (mode === "mutasi") {
          return normalizeRt(item.originRt) === normalizedScopeRt || normalizeRt(item.destinationRt) === normalizedScopeRt;
        }
        return normalizeRt(item.rt) === normalizedScopeRt;
      })
    : records;
  const scopedLinkedData = hasRtScope
    ? {
        ...linkedData,
        rts: linkedData?.rts?.filter((item) => normalizeRt(item.number ?? item.id) === normalizedScopeRt),
        residents: linkedData?.residents?.filter((item) => normalizeRt(item.rt) === normalizedScopeRt),
      }
    : linkedData;
  const data = buildData(mode, scopedRecords, scopedLinkedData);
  const isInventory = mode === "inventaris";
  const isPopulation = mode === "penduduk";
  const related = relatedFor(mode);
  const rtAwarePaths = new Set(["/penduduk", "/keluarga", "/mutasi", "/bansos", "/inventaris", "/data-rt", "/umkm", "/fasilitas"]);
  const relatedHref = (href: string) => hasRtScope && rtAwarePaths.has(href) ? `${href}?rt=${normalizedScopeRt}` : href;
  const hasLinkedFallback =
    (mode === "penduduk" || mode === "keluarga") &&
    Boolean(scopedLinkedData?.rts?.some((item) =>
      numberValue(item.populationCount) > 0 || numberValue(item.familyCount) > 0,
    ));

  return (
    <PublicShell>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div>
              <span className={styles.eyebrow}>Data Publik Kelurahan</span>
              <h1>{titleFor(mode)}{hasRtScope ? ` · RT ${normalizedScopeRt}` : ""}</h1>
              <p>{descriptionFor(mode, settings.villageName)}{hasRtScope ? ` Data pada halaman ini sedang difilter untuk RT ${normalizedScopeRt}.` : ""}</p>
              {hasRtScope ? <Link href={MODULES.find((item) => item.mode === mode)?.href || "/data-publik"} className={styles.scopeClear}>Lihat semua RT →</Link> : null}
            </div>
            <Link href="/data-publik" className={styles.heroLink}>Lihat Semua Data Publik →</Link>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <nav className={styles.moduleNav} aria-label="Navigasi data publik">
              {MODULES.map((item) => (
                <Link key={item.href} href={hasRtScope ? `${item.href}?rt=${normalizedScopeRt}` : item.href} className={item.mode === mode ? styles.moduleActive : styles.moduleLink}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className={styles.statsGrid}>
              {data.stats.map((stat) => (
                <article className={styles.statCard} key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                  <small>{stat.suffix}</small>
                </article>
              ))}
            </div>

            <div className={styles.privacyNote}>
              <strong>Perlindungan data pribadi</strong>
              <span>
                Data publik pada halaman ini berasal dari administrasi kelurahan, tetapi identitas seperti NIK, No. KK, nama individu, alamat pribadi, nomor dokumen, dan penanggung jawab personal tidak ditampilkan.
              </span>
            </div>

            {data.groups.length ? (
              <div className={styles.groupsGrid}>
                {data.groups.map((group) => (
                  <article className={styles.panel} key={group.title}>
                    <h2>{group.title}</h2>
                    {group.items.length ? (
                      <div className={styles.barList}>
                        {group.items.map((item) => (
                          <div className={styles.barRow} key={item.label}>
                            <span>{item.label}</span>
                            <strong>{item.value}</strong>
                          </div>
                        ))}
                      </div>
                    ) : <p className={styles.empty}>Belum ada data.</p>}
                  </article>
                ))}
              </div>
            ) : null}

            {(isInventory || isPopulation) && data.rows.length ? (
              <article className={styles.tablePanel}>
                <div className={styles.tableHead}>
                  <div>
                    <span>{isPopulation ? "Data RT Terhubung" : "Transparansi Aset"}</span>
                    <h2>{isPopulation ? "Rincian lengkap statistik publik per RT" : "Daftar inventaris yang aman dipublikasikan"}</h2>
                  </div>
                  <small>{data.rows.length} {isPopulation ? "RT" : "data"}</small>
                </div>
                <div className={styles.tableScroll}>
                  <table>
                    <thead><tr>{Object.keys(data.rows[0]).map((key) => <th key={key}>{key}</th>)}</tr></thead>
                    <tbody>{data.rows.map((row, index) => <tr key={index}>{Object.values(row).map((value, cellIndex) => <td key={cellIndex}>{String(value)}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              </article>
            ) : null}

            {!scopedRecords.length && !hasLinkedFallback ? <div className={styles.emptyState}>Belum ada data administrasi yang tersedia untuk dihitung.</div> : null}

            <section className={styles.relatedSection}>
              <div className={styles.relatedHeading}>
                <div>
                  <span>Data saling terhubung</span>
                  <h2>Lanjutkan ke informasi yang berkaitan</h2>
                </div>
                <Link href="/data-publik">Semua Data Publik →</Link>
              </div>
              <div className={styles.relatedGrid}>
                {related.map((item) => (
                  <Link href={relatedHref(item.href)} className={styles.relatedCard} key={item.href}>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                    <span>Buka halaman →</span>
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
