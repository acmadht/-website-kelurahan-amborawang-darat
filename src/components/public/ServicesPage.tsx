"use client";

import { useState } from "react";
import Link from "next/link";
import { applyAmborawangPublicSettings } from "@/data/amborawang";
import { demoSettings } from "@/data/demo";
import { useCollectionData, useDocumentData } from "@/hooks/useFirestoreData";
import { normalizeWhatsapp } from "@/lib/utils";
import type { ServiceItem, SiteSettings } from "@/types";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./ServicesPage.module.css";

const steps = [
  {
    number: "01",
    title: "Bawa surat pengantar RT",
    text: "Membawa surat pengantar dari RT yang telah dicap dan ditandatangani.",
  },
  {
    number: "02",
    title: "Pemeriksaan kelengkapan",
    text: "Berkas diperiksa kelengkapannya di Kantor Kelurahan Amborawang Darat.",
  },
  {
    number: "03",
    title: "Berkas diproses",
    text: "Berkas yang lengkap diproses oleh petugas pelayanan kelurahan.",
  },
  {
    number: "04",
    title: "Penandatanganan",
    text: "Berkas yang telah diproses dilanjutkan untuk penandatanganan oleh Lurah.",
  },
];

const faq = [
  {
    question: "Apa persyaratan dasar pelayanan administrasi?",
    answer:
      "Berdasarkan SOP yang tersedia, masyarakat menyiapkan fotokopi KTP, fotokopi KK, dan surat pengantar RT. Dokumen tambahan dapat diminta sesuai jenis keperluan.",
  },
  {
    question: "Apa persyaratan dasar pelayanan pertanahan?",
    answer:
      "Siapkan fotokopi KTP dan KK, fotokopi SPPT PBB terakhir, fotokopi akta jual beli/hibah/waris jika ada, surat pernyataan kepemilikan tanah yang diketahui RT, serta dokumen pendukung lain sesuai kebutuhan.",
  },
  {
    question: "Bagaimana alur pelayanan di kantor kelurahan?",
    answer:
      "Masyarakat membawa pengantar RT, petugas mengecek kelengkapan, berkas lengkap diproses, kemudian berkas dilanjutkan untuk penandatanganan oleh Lurah.",
  },
];


const adminRequirements = [
  "Fotokopi KTP",
  "Fotokopi KK",
  "Surat pengantar RT",
];

const landRequirements = [
  "Fotokopi KTP dan KK",
  "Fotokopi SPPT PBB terakhir",
  "Fotokopi akta jual beli/hibah/waris (jika ada)",
  "Surat pernyataan kepemilikan tanah yang diketahui RT",
  "Dokumen pendukung lainnya sesuai kebutuhan",
];

const officialServices: ServiceItem[] = [
  { id: "sop-adm-01", name: "Surat Pengantar KTP/KK", slug: "surat-pengantar-ktp-kk", category: "Administrasi Kelurahan", icon: "01", summary: "Pelayanan surat pengantar untuk keperluan administrasi KTP dan Kartu Keluarga.", requirements: adminRequirements, procedures: [], duration: "", cost: "", order: 1, isFeatured: true, isActive: true },
  { id: "sop-adm-02", name: "Surat Keterangan Pindah Datang/Keluar", slug: "surat-keterangan-pindah-datang-keluar", category: "Administrasi Kelurahan", icon: "02", summary: "Pelayanan keterangan untuk administrasi perpindahan penduduk datang maupun keluar.", requirements: adminRequirements, procedures: [], duration: "", cost: "", order: 2, isFeatured: true, isActive: true },
  { id: "sop-adm-03", name: "Surat Keterangan Domisili", slug: "surat-keterangan-domisili", category: "Administrasi Kelurahan", icon: "03", summary: "Pelayanan surat keterangan domisili bagi warga sesuai kebutuhan administrasi.", requirements: adminRequirements, procedures: [], duration: "", cost: "", order: 3, isFeatured: true, isActive: true },
  { id: "sop-adm-04", name: "Surat Keterangan Usaha", slug: "surat-keterangan-usaha", category: "Administrasi Kelurahan", icon: "04", summary: "Pelayanan surat keterangan usaha bagi warga atau pelaku usaha di wilayah kelurahan.", requirements: adminRequirements, procedures: [], duration: "", cost: "", order: 4, isFeatured: true, isActive: true },
  { id: "sop-adm-05", name: "Surat Keterangan Kematian", slug: "surat-keterangan-kematian", category: "Administrasi Kelurahan", icon: "05", summary: "Pelayanan surat keterangan kematian untuk kebutuhan administrasi keluarga.", requirements: adminRequirements, procedures: [], duration: "", cost: "", order: 5, isFeatured: true, isActive: true },
  { id: "sop-adm-06", name: "Surat Keterangan Kelahiran", slug: "surat-keterangan-kelahiran", category: "Administrasi Kelurahan", icon: "06", summary: "Pelayanan surat keterangan kelahiran sebagai dokumen pendukung administrasi kependudukan.", requirements: adminRequirements, procedures: [], duration: "", cost: "", order: 6, isFeatured: true, isActive: true },
  { id: "sop-adm-07", name: "Surat Keterangan Tidak Mampu", slug: "surat-keterangan-tidak-mampu", category: "Administrasi Kelurahan", icon: "07", summary: "Pelayanan surat keterangan tidak mampu sesuai keperluan administrasi masyarakat.", requirements: adminRequirements, procedures: [], duration: "", cost: "", order: 7, isFeatured: true, isActive: true },
  { id: "sop-adm-08", name: "Surat Pengantar Nikah", slug: "surat-pengantar-nikah", category: "Administrasi Kelurahan", icon: "08", summary: "Pelayanan surat pengantar untuk melengkapi administrasi pengurusan pernikahan.", requirements: adminRequirements, procedures: [], duration: "", cost: "", order: 8, isFeatured: true, isActive: true },
  { id: "sop-tanah-01", name: "Surat Keterangan Tanah", slug: "surat-keterangan-tanah", category: "Pertanahan", icon: "01", summary: "Pelayanan surat keterangan tanah sesuai data dan dokumen pendukung yang diajukan.", requirements: landRequirements, procedures: [], duration: "", cost: "", order: 9, isFeatured: true, isActive: true },
  { id: "sop-tanah-02", name: "Surat Keterangan Riwayat Tanah", slug: "surat-keterangan-riwayat-tanah", category: "Pertanahan", icon: "02", summary: "Pelayanan surat keterangan yang menerangkan riwayat tanah berdasarkan dokumen pendukung.", requirements: landRequirements, procedures: [], duration: "", cost: "", order: 10, isFeatured: true, isActive: true },
  { id: "sop-tanah-03", name: "Surat Keterangan Waris Tanah", slug: "surat-keterangan-waris-tanah", category: "Pertanahan", icon: "03", summary: "Pelayanan surat keterangan waris yang berkaitan dengan administrasi tanah.", requirements: landRequirements, procedures: [], duration: "", cost: "", order: 11, isFeatured: true, isActive: true },
  { id: "sop-tanah-04", name: "Surat Rekomendasi Pendaftaran Sertifikasi Tanah", slug: "surat-rekomendasi-pendaftaran-sertifikasi-tanah", category: "Pertanahan", icon: "04", summary: "Pelayanan rekomendasi kelurahan sebagai dokumen pendukung pendaftaran sertifikasi tanah.", requirements: landRequirements, procedures: [], duration: "", cost: "", order: 12, isFeatured: true, isActive: true },
];

const legacyServiceSlugs = new Set([
  "administrasi-kependudukan",
  "pengaduan-masyarakat",
  "dokumen-publik",
]);

function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ServiceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3h8l3 3v15H5V3h3Z" />
      <path d="M8 10h8M8 14h8M8 18h5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function parseServiceHours(value: string) {
  const rows = value
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const match = item.match(/^(.+?)\s+(\d{1,2}[.:]\d{2}.*|tutup)$/i);
      if (match) return { day: match[1].trim(), time: match[2].trim() };
      return { day: "Jadwal", time: item };
    });

  return rows;
}

export default function ServicesPage({ initialSettings = demoSettings, initialServices = [] }: { initialSettings?: SiteSettings; initialServices?: ServiceItem[] }) {
  const { data: rawSettings } = useDocumentData<SiteSettings>(
    "siteSettings",
    "main",
    initialSettings,
  );
  const settings = applyAmborawangPublicSettings(rawSettings);
  const { data: rawServices } = useCollectionData<ServiceItem>(
    "services",
    initialServices,
  );

  const adminServices = rawServices.filter((item) => item.isActive !== false);
  const officialSlugs = new Set(officialServices.map((item) => item.slug));
  const additionalServices = adminServices.filter(
    (item) => item.slug && !officialSlugs.has(item.slug) && !legacyServiceSlugs.has(item.slug),
  );
  const displayServices = [...officialServices, ...additionalServices].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  const serviceGroups = [
    {
      name: "Administrasi Kelurahan",
      description: "",
      items: displayServices.filter((item) => item.category === "Administrasi Kelurahan"),
    },
    {
      name: "Pertanahan",
      description: "Pelayanan pertanahan yang tercantum pada SOP Pelayanan Pertanahan Kelurahan Amborawang Darat.",
      items: displayServices.filter((item) => item.category === "Pertanahan"),
    },
    {
      name: "Layanan Tambahan",
      description: "Layanan aktif lain yang ditambahkan melalui dashboard admin.",
      items: displayServices.filter((item) => !["Administrasi Kelurahan", "Pertanahan"].includes(item.category)),
    },
  ].filter((group) => group.items.length > 0);
  const [openService, setOpenService] = useState<string | null>(null);
  const serviceHours = parseServiceHours(settings.serviceHours);
  const whatsapp = normalizeWhatsapp(settings.whatsapp);

  const quickInfo = [
    ...serviceHours.slice(0, 2).map((row, index) => ({
      value: row.day,
      label: index === 0 ? "Jam layanan utama" : "Jam layanan",
      note: row.time,
    })),
    ...(settings.address
      ? [{ value: settings.villageName, label: "Lokasi kantor", note: settings.address }]
      : []),
    ...(settings.phone || settings.whatsapp
      ? [{
          value: settings.phone || settings.whatsapp,
          label: "Kontak layanan",
          note: "Informasi & konfirmasi",
        }]
      : []),
  ].slice(0, 4);

  return (
    <PublicShell>
      <main className={styles.page}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroPattern} aria-hidden="true" />

          <div className={`container ${styles.heroGrid}`}>
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.heroCopy}>
                <div className={styles.heroBadge}>
                  <ServiceIcon />
                  <span>Pelayanan Masyarakat</span>
                </div>

                <h1>
                  Layanan
                  <strong>Kelurahan</strong>
                </h1>

                <p>
                  Informasi pelayanan administrasi dan pertanahan Kelurahan {settings.villageName}
                  berdasarkan data SOP pelayanan yang tersedia di kantor kelurahan.
                </p>

                <div className={styles.heroActions}>
                  <a href="#daftar-layanan" className={styles.primaryButton}>
                    Lihat Daftar Layanan
                    <ArrowIcon />
                  </a>

                  <Link href="/kontak" className={styles.secondaryButton}>
                    Hubungi Petugas
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal enabled={settings.animationEnabled} delay={70}>
              <div className={styles.serviceStatus}>
                <div className={styles.statusTop}>
                  <div className={styles.statusIcon}>
                    <ClockIcon />
                  </div>
                  <div>
                    <span>Informasi Pelayanan</span>
                    <strong>Kantor Kelurahan {settings.villageName}</strong>
                  </div>
                </div>

                <div className={styles.statusRows}>
                  {serviceHours.slice(0, 3).map((row) => (
                    <div key={`${row.day}-${row.time}`}>
                      <span>{row.day}</span>
                      <strong>{row.time}</strong>
                    </div>
                  ))}
                </div>

                <Link href="/kontak" className={styles.statusLink}>
                  Lihat Kontak & Lokasi
                  <ArrowIcon size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* QUICK INFO */}
        <section className={styles.quickSection}>
          <div className="container">
            <div className={styles.quickGrid}>
              {quickInfo.map((item, index) => (
                <Reveal key={item.label} enabled={settings.animationEnabled} delay={index * 40}>
                  <div className={styles.quickCard}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <small>{item.note}</small>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="daftar-layanan" className={styles.servicesSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.sectionHeadingDark}>
                <span className={styles.eyebrowLight}>Daftar Layanan</span>
                <h2>Pelayanan Administrasi & Pertanahan</h2>
              </div>
            </Reveal>

            {displayServices.length ? (
              <div className={styles.serviceGroups}>
                {serviceGroups.map((group) => (
                  <section key={group.name} className={styles.serviceGroup}>
                    <div className={styles.serviceGroupHeading}>
                      <div>
                        <span>{String(group.items.length).padStart(2, "0")} layanan</span>
                        <h3>{group.name}</h3>
                      </div>
                      {group.description ? <p>{group.description}</p> : null}
                    </div>

                    <div className={styles.servicesGrid}>
                      {group.items.map((service, index) => {
                        const serviceKey = service.id ?? service.slug ?? service.name;
                        const isOpen = openService === serviceKey;

                        return (
                          <Reveal key={serviceKey} enabled={settings.animationEnabled} delay={index * 35}>
                            <article
                              id={service.slug || undefined}
                              className={`${styles.serviceCard} ${isOpen ? styles.serviceCardOpen : ""}`}
                            >
                              <div className={styles.serviceToggle}>
                                <div className={styles.serviceCardTop}>
                                  <span>{service.icon || String(index + 1).padStart(2, "0")}</span>
                                  <small>{service.category}</small>
                                </div>

                                <h3>{service.name}</h3>
                                <p>{service.summary}</p>

                                <button
                                  type="button"
                                  className={styles.serviceToggleHint}
                                  onClick={() => setOpenService(isOpen ? null : serviceKey)}
                                  aria-expanded={isOpen}
                                  aria-controls={`service-detail-${service.slug || index}`}
                                >
                                  {isOpen ? "Tutup persyaratan" : "Lihat persyaratan"}
                                  <ChevronIcon />
                                </button>
                              </div>

                              <div id={`service-detail-${service.slug || index}`} className={styles.serviceBody}>
                                <span className={styles.serviceSubheading}>Persyaratan</span>
                                <div className={styles.requirements}>
                                  {(service.requirements?.length
                                    ? service.requirements
                                    : ["Konfirmasi persyaratan kepada petugas kelurahan"]
                                  ).map((item) => (
                                    <div key={item}>
                                      <span><CheckIcon /></span>
                                      <p>{item}</p>
                                    </div>
                                  ))}
                                </div>

                                {service.procedures?.length ? (
                                  <>
                                    <span className={styles.serviceSubheading}>Prosedur</span>
                                    <div className={styles.procedureList}>
                                      {service.procedures.map((item, procedureIndex) => (
                                        <div key={`${item}-${procedureIndex}`}>
                                          <span>{String(procedureIndex + 1).padStart(2, "0")}</span>
                                          <p>{item}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                ) : null}

                                {service.duration || service.cost ? (
                                  <div className={styles.serviceMetaLine}>
                                    {service.duration ? <span><small>Waktu</small><strong>{service.duration}</strong></span> : null}
                                    {service.cost ? <span><small>Biaya</small><strong>{service.cost}</strong></span> : null}
                                  </div>
                                ) : null}

                                <div className={styles.serviceActions}>
                                  <Link href="/kontak" className={styles.serviceLink}>
                                    {service.contact ? `Kontak: ${service.contact}` : "Konfirmasi Layanan"}
                                    <ArrowIcon size={16} />
                                  </Link>
                                  {service.documentUrl ? (
                                    <a href={service.documentUrl} target="_blank" rel="noopener noreferrer" className={styles.serviceDocumentLink}>
                                      Dokumen
                                      <ArrowIcon size={15} />
                                    </a>
                                  ) : null}
                                </div>
                              </div>
                            </article>
                          </Reveal>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <strong>Belum ada layanan aktif.</strong>
                <p>Informasi pelayanan akan ditampilkan setelah data tersedia.</p>
              </div>
            )}
          </div>
        </section>

        {/* PROCESS */}
        <section className={styles.processSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.processHeading}>
                <div>
                  <span className={styles.sectionNumber}>02</span>
                  <span className={styles.eyebrow}>Alur Pelayanan</span>
                  <h2>Empat tahap pelayanan kelurahan</h2>
                </div>

              </div>
            </Reveal>

            <div className={styles.processGrid}>
              {steps.map((step, index) => (
                <Reveal key={step.title} enabled={settings.animationEnabled} delay={index * 45}>
                  <article className={styles.processCard}>
                    <span>{step.number}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* DOCUMENT CTA */}
        <section className={styles.documentSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.documentPanel}>
                <div>
                  <span>Dokumen & Formulir</span>
                  <h2>Butuh formulir atau dokumen publik?</h2>
                  <p>
                    Akses halaman dokumen untuk melihat berkas yang tersedia sebelum
                    datang ke kantor kelurahan.
                  </p>
                </div>

                <Link href="/dokumen" className={styles.documentButton}>
                  Buka Dokumen Publik
                  <ArrowIcon />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.faqSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.faqHeading}>
                <span className={styles.eyebrow}>Pertanyaan Umum</span>
                <h2>Informasi yang sering ditanyakan</h2>
              </div>
            </Reveal>

            <div className={styles.faqGrid}>
              {faq.map((item, index) => (
                <Reveal key={item.question} enabled={settings.animationEnabled} delay={index * 45}>
                  <article className={styles.faqCard}>
                    <span>0{index + 1}</span>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className="container">
            <Reveal enabled={settings.animationEnabled}>
              <div className={styles.cta}>
                <div>
                  <span>Butuh Bantuan?</span>
                  <h2>Pastikan berkas sudah lengkap sebelum datang.</h2>
                  <p>
                    Gunakan daftar persyaratan di atas sebagai panduan awal. Untuk kondisi
                    khusus, konfirmasikan kebutuhan berkas kepada petugas kelurahan.
                  </p>
                </div>

                <div className={styles.ctaActions}>
                  <Link href="/permohonan-surat" className={styles.ctaPrimary}>
                    Ajukan Surat Online
                    <ArrowIcon />
                  </Link>

                  <Link href="/pengaduan" className={styles.ctaSecondary}>
                    Pengaduan
                  </Link>

                  {whatsapp ? (
                    <a
                      href={`https://wa.me/${whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.ctaSecondary}
                    >
                      WhatsApp
                    </a>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
