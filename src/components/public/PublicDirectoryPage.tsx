"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCollectionData, useDocumentData } from "@/hooks/useFirestoreData";
import { demoSettings } from "@/data/demo";
import { applyAmborawangPublicSettings } from "@/data/amborawang";
import type { FacilityItem, SiteSettings, UmkmItem } from "@/types";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./PublicDirectoryPage.module.css";

type Mode = "umkm" | "facilities";

type Props = {
  mode: Mode;
  initialSettings?: SiteSettings;
  initialUmkm?: UmkmItem[];
  initialFacilities?: FacilityItem[];
  scopeRt?: string;
};

function safeLink(value?: string) {
  const text = String(value || "").trim();
  if (!text) return "";
  return /^https?:\/\//i.test(text) ? text : "";
}

export default function PublicDirectoryPage({
  mode,
  initialSettings = demoSettings,
  initialUmkm = [],
  initialFacilities = [],
  scopeRt = "",
}: Props) {
  const { data: rawSettings } = useDocumentData<SiteSettings>("siteSettings", "main", initialSettings);
  const settings = applyAmborawangPublicSettings(rawSettings);
  // Data direktori dipasok oleh Server Component. Listener browser dimatikan agar
  // field internal (mis. NIK pemilik UMKM) tidak pernah dapat dibaca langsung dari Firestore publik.
  const { data: umkm } = useCollectionData<UmkmItem>("umkm", initialUmkm, [], false);
  const { data: facilities } = useCollectionData<FacilityItem>("facilities", initialFacilities, [], false);
  const rtFilterRaw = String(scopeRt ?? "").replace(/\D/g, "");
  const rtFilter = rtFilterRaw ? String(Number(rtFilterRaw)).padStart(2, "0") : "";

  const items = useMemo(() => {
    if (mode === "umkm") {
      return umkm
        .filter((item) => item.isPublic !== false && item.isActive !== false)
        .filter((item) => !rtFilter || String(item.rt || "").replace(/\D/g, "").padStart(2, "0") === rtFilter)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return facilities
      .filter((item) => item.isPublic !== false)
      .filter((item) => !rtFilter || String(item.rt || "").replace(/\D/g, "").padStart(2, "0") === rtFilter)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [mode, umkm, facilities, rtFilter]);

  const isUmkm = mode === "umkm";
  const related = isUmkm
    ? [
        { href: "/data-rt", title: "Data RT", text: "Lihat konteks lingkungan RT tempat usaha berada." },
        { href: "/wilayah", title: "Wilayah", text: "Lihat karakter dan konektivitas wilayah kelurahan." },
        { href: "/fasilitas", title: "Fasilitas", text: "Lihat sarana publik pendukung aktivitas masyarakat." },
      ]
    : [
        { href: "/inventaris", title: "Inventaris", text: "Lihat ringkasan aset/barang kelurahan yang aman dipublikasikan." },
        { href: "/data-rt", title: "Data RT", text: "Lihat fasilitas dan ringkasan wilayah pada masing-masing RT." },
        { href: "/wilayah", title: "Wilayah", text: "Lihat peta dan konteks lokasi fasilitas di kelurahan." },
      ];
  const rtAwareRelated = new Set(["/data-rt", "/fasilitas", "/umkm", "/inventaris"]);
  const relatedHref = (href: string) => rtFilter && rtAwareRelated.has(href) ? `${href}?rt=${rtFilter}` : href;

  return (
    <PublicShell>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div>
              <span className={styles.eyebrow}>{isUmkm ? "Potensi Ekonomi" : "Sarana Prasarana"}</span>
              <h1>{isUmkm ? "UMKM Kelurahan" : "Fasilitas Kelurahan"}</h1>
              <p>
                {isUmkm
                  ? `Direktori usaha dan potensi ekonomi masyarakat Kelurahan ${settings.villageName} yang telah ditandai untuk publikasi.`
                  : `Daftar fasilitas dan sarana prasarana Kelurahan ${settings.villageName} yang dapat ditampilkan kepada masyarakat.`}
              </p>
            </div>
            <div className={styles.count}>
              <strong>{items.length}</strong>
              <span>{isUmkm ? "UMKM aktif" : "fasilitas publik"}</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.toolbar}>
              <div>
                <h2>{isUmkm ? "Daftar UMKM" : "Daftar Fasilitas"}{rtFilter ? ` · RT ${rtFilter}` : ""}</h2>
                <p>Data diperbarui dari sistem administrasi kelurahan.{rtFilter ? ` Menampilkan data yang terhubung ke RT ${rtFilter}.` : ""}</p>
                {rtFilter ? <Link href={isUmkm ? "/umkm" : "/fasilitas"}>Lihat semua RT →</Link> : null}
              </div>
            </div>

            {items.length ? (
              <div className={styles.grid}>
                {items.map((raw, index) => {
                  if (isUmkm) {
                    const item = raw as UmkmItem;
                    const image = safeLink(item.imageUrl);
                    const maps = safeLink(item.mapsUrl);
                    const phone = String(item.phone || "").replace(/[^0-9+]/g, "");
                    const wa = phone ? `https://wa.me/${phone.replace(/^0/, "62").replace(/\+/g, "")}` : "";
                    return (
                      <Reveal key={item.id || item.name || index} enabled={settings.animationEnabled !== false} delay={index * 35}>
                        <article className={styles.card}>
                          <div className={styles.image}>{image ? <img src={image} alt={item.name} /> : null}</div>
                          <div className={styles.body}>
                            <div className={styles.meta}>
                              {item.businessType ? <span className={styles.pill}>{item.businessType}</span> : null}
                              {item.rt ? <Link href={`/data-rt?rt=${item.rt}`} className={styles.pill}>RT {item.rt}</Link> : null}
                            </div>
                            <h3>{item.name}</h3>
                            <p>{item.mainProduct || "Informasi produk belum diisi."}</p>
                            <div className={styles.details}>
                              {item.address ? <div className={styles.detail}><strong>Alamat</strong><span>{item.address}</span></div> : null}
                              {item.phone ? <div className={styles.detail}><strong>Kontak</strong><span>{item.phone}</span></div> : null}
                            </div>
                            <div className={styles.actions}>
                              {wa ? <a className={styles.action} href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a> : null}
                              {maps ? <a className={`${styles.action} ${styles.secondary}`} href={maps} target="_blank" rel="noopener noreferrer">Lokasi</a> : null}
                            </div>
                          </div>
                        </article>
                      </Reveal>
                    );
                  }

                  const item = raw as FacilityItem;
                  const image = safeLink(item.imageUrl);
                  const maps = safeLink(item.mapsUrl);
                  return (
                    <Reveal key={item.id || item.name || index} enabled={settings.animationEnabled !== false} delay={index * 35}>
                      <article className={styles.card}>
                        <div className={styles.image}>{image ? <img src={image} alt={item.name} /> : null}</div>
                        <div className={styles.body}>
                          <div className={styles.meta}>
                            {item.category ? <span className={styles.pill}>{item.category}</span> : null}
                            {item.rt ? <Link href={`/data-rt?rt=${item.rt}`} className={styles.pill}>RT {item.rt}</Link> : null}
                            {item.condition ? <span className={styles.pill}>{item.condition}</span> : null}
                          </div>
                          <h3>{item.name}</h3>
                          <p>{item.address || "Alamat fasilitas belum diisi."}</p>
                          <div className={styles.details}>
                            {item.manager ? <div className={styles.detail}><strong>Pengelola</strong><span>{item.manager}</span></div> : null}
                            {item.status ? <div className={styles.detail}><strong>Status</strong><span>{item.status}</span></div> : null}
                          </div>
                          <div className={styles.actions}>
                            {maps ? <a className={styles.action} href={maps} target="_blank" rel="noopener noreferrer">Buka Lokasi</a> : null}
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            ) : (
              <div className={styles.empty}>Belum ada data yang ditandai untuk ditampilkan ke website.</div>
            )}

            <div className={styles.note}>
              Informasi yang tampil di halaman ini hanya data yang diberi izin publikasi pada spreadsheet. Data identitas pribadi tidak ditampilkan.
            </div>

            <section className={styles.relatedSection}>
              <div className={styles.relatedHeading}>
                <span>Informasi terkait</span>
                <h2>{isUmkm ? "Lihat konteks wilayah dan sarana pendukung" : "Hubungkan fasilitas dengan data wilayah dan aset"}</h2>
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
