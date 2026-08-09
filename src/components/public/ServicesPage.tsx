"use client";

import Link from "next/link";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./ServicesPage.module.css";

const services = [
  {
    number: "01",
    category: "Administrasi",
    title: "Surat Pengantar",
    description:
      "Informasi persyaratan dan alur pengurusan surat pengantar melalui Kelurahan Amborawang Darat.",
    requirements: [
      "KTP / identitas pemohon",
      "Kartu Keluarga bila diperlukan",
      "Dokumen pendukung sesuai kebutuhan",
    ],
  },
  {
    number: "02",
    category: "Kependudukan",
    title: "Administrasi Kependudukan",
    description:
      "Panduan administrasi kependudukan dan dokumen pendukung sebelum proses dilanjutkan ke instansi terkait.",
    requirements: [
      "Kartu Keluarga",
      "KTP / identitas",
      "Dokumen pendukung sesuai jenis pelayanan",
    ],
  },
  {
    number: "03",
    category: "Dokumen",
    title: "Formulir & Dokumen Publik",
    description:
      "Akses formulir, berkas, dan dokumen informasi publik yang tersedia untuk masyarakat.",
    requirements: [
      "Pilih dokumen yang dibutuhkan",
      "Unduh atau siapkan berkas",
      "Pastikan data telah terisi dengan benar",
    ],
  },
  {
    number: "04",
    category: "Informasi",
    title: "Konsultasi Pelayanan",
    description:
      "Hubungi petugas kelurahan apabila memerlukan penjelasan sebelum mengurus administrasi.",
    requirements: [
      "Sampaikan jenis layanan",
      "Siapkan pertanyaan atau dokumen",
      "Konfirmasi kebutuhan sebelum datang",
    ],
  },
];

const steps = [
  {
    number: "01",
    title: "Pilih jenis layanan",
    text: "Pastikan layanan yang dibutuhkan dan baca persyaratan dasar terlebih dahulu.",
  },
  {
    number: "02",
    title: "Siapkan dokumen",
    text: "Lengkapi identitas dan berkas pendukung sesuai jenis pelayanan.",
  },
  {
    number: "03",
    title: "Datang atau konsultasi",
    text: "Datang ke kantor kelurahan atau hubungi petugas apabila masih ada informasi yang perlu dikonfirmasi.",
  },
  {
    number: "04",
    title: "Proses pelayanan",
    text: "Petugas memeriksa kelengkapan dan membantu proses administrasi sesuai ketentuan.",
  },
];

const quickInfo = [
  { value: "Senin–Kamis", label: "Jam layanan utama", note: "09.00–16.00 WITA" },
  { value: "Jumat", label: "Jam layanan", note: "09.00–11.00 WITA" },
  { value: "RT 12", label: "Lokasi kantor", note: "Jl. Balikpapan–Handil II KM 42" },
  { value: "0812-5800-224", label: "Kontak layanan", note: "Informasi & konfirmasi" },
];

const faq = [
  {
    question: "Apakah semua layanan dapat selesai di kelurahan?",
    answer:
      "Tidak semua. Beberapa layanan menggunakan surat pengantar atau verifikasi dari kelurahan sebelum dilanjutkan ke instansi terkait.",
  },
  {
    question: "Apakah harus membawa dokumen asli?",
    answer:
      "Sebaiknya bawa dokumen asli dan salinan apabila diperlukan untuk pencocokan data.",
  },
  {
    question: "Bagaimana jika belum yakin dengan persyaratan?",
    answer:
      "Hubungi petugas terlebih dahulu agar berkas yang dibawa sesuai dengan jenis layanan yang akan diurus.",
  },
];

function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
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

export default function ServicesPage() {
  return (
    <PublicShell>
      <main className={styles.page}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroPattern} aria-hidden="true" />

          <div className={`container ${styles.heroGrid}`}>
            <Reveal enabled>
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
                  Informasi layanan administrasi masyarakat Kelurahan Amborawang
                  Darat yang disusun lebih jelas agar warga dapat menyiapkan
                  berkas sebelum datang ke kantor.
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

            <Reveal enabled delay={70}>
              <div className={styles.serviceStatus}>
                <div className={styles.statusTop}>
                  <div className={styles.statusIcon}>
                    <ClockIcon />
                  </div>
                  <div>
                    <span>Informasi Pelayanan</span>
                    <strong>Kantor Kelurahan Amborawang Darat</strong>
                  </div>
                </div>

                <div className={styles.statusRows}>
                  <div>
                    <span>Senin–Kamis</span>
                    <strong>09.00–16.00 WITA</strong>
                  </div>
                  <div>
                    <span>Jumat</span>
                    <strong>09.00–11.00 WITA</strong>
                  </div>
                  <div>
                    <span>Sabtu–Minggu</span>
                    <strong>Tutup</strong>
                  </div>
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
                <Reveal key={item.label} enabled delay={index * 40}>
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

        {/* INTRO */}
        <section className={styles.introSection}>
          <div className={`container ${styles.introGrid}`}>
            <Reveal enabled>
              <div className={styles.introAside}>
                <span className={styles.sectionNumber}>01</span>
                <span className={styles.eyebrow}>Panduan Layanan</span>
                <h2>Siapkan kebutuhan sebelum datang</h2>
              </div>
            </Reveal>

            <Reveal enabled delay={60}>
              <div className={styles.introArticle}>
                <p className={styles.lead}>
                  Informasi pelayanan dibuat agar masyarakat dapat memahami
                  jenis layanan, persyaratan dasar, dan langkah pengurusan secara
                  lebih cepat.
                </p>

                <p>
                  Persyaratan dapat berbeda tergantung keperluan administrasi.
                  Karena itu, apabila masih ragu terhadap berkas yang harus
                  dibawa, masyarakat disarankan menghubungi petugas kelurahan
                  terlebih dahulu.
                </p>

                <div className={styles.introCallout}>
                  <span>Catatan</span>
                  <strong>
                    Bawa identitas dan dokumen pendukung asli apabila diperlukan
                    untuk pencocokan data.
                  </strong>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SERVICES */}
        <section id="daftar-layanan" className={styles.servicesSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.sectionHeadingDark}>
                <span className={styles.eyebrowLight}>Daftar Layanan</span>
                <h2>Layanan utama untuk kebutuhan masyarakat</h2>
                <p>
                  Pilih layanan untuk melihat gambaran persyaratan dasar sebelum
                  proses administrasi dilakukan.
                </p>
              </div>
            </Reveal>

            <div className={styles.servicesGrid}>
              {services.map((service, index) => (
                <Reveal key={service.title} enabled delay={index * 50}>
                  <article className={styles.serviceCard}>
                    <div className={styles.serviceCardTop}>
                      <span>{service.number}</span>
                      <small>{service.category}</small>
                    </div>

                    <h3>{service.title}</h3>
                    <p>{service.description}</p>

                    <div className={styles.requirements}>
                      {service.requirements.map((item) => (
                        <div key={item}>
                          <span><CheckIcon /></span>
                          <p>{item}</p>
                        </div>
                      ))}
                    </div>

                    <Link href="/kontak" className={styles.serviceLink}>
                      Konfirmasi Persyaratan
                      <ArrowIcon size={16} />
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className={styles.processSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.processHeading}>
                <div>
                  <span className={styles.sectionNumber}>02</span>
                  <span className={styles.eyebrow}>Alur Pelayanan</span>
                  <h2>Empat langkah sederhana</h2>
                </div>

                <p>
                  Alur ini membantu masyarakat memahami proses dasar pelayanan
                  sebelum berkas diproses oleh petugas.
                </p>
              </div>
            </Reveal>

            <div className={styles.processGrid}>
              {steps.map((step, index) => (
                <Reveal key={step.title} enabled delay={index * 45}>
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
            <Reveal enabled>
              <div className={styles.documentPanel}>
                <div>
                  <span>Dokumen & Formulir</span>
                  <h2>Butuh formulir atau dokumen publik?</h2>
                  <p>
                    Akses halaman dokumen untuk melihat berkas yang tersedia
                    sebelum datang ke kantor kelurahan.
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
            <Reveal enabled>
              <div className={styles.faqHeading}>
                <span className={styles.eyebrow}>Pertanyaan Umum</span>
                <h2>Informasi yang sering ditanyakan</h2>
              </div>
            </Reveal>

            <div className={styles.faqGrid}>
              {faq.map((item, index) => (
                <Reveal key={item.question} enabled delay={index * 45}>
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
            <Reveal enabled>
              <div className={styles.cta}>
                <div>
                  <span>Butuh Bantuan?</span>
                  <h2>Konfirmasi persyaratan sebelum datang.</h2>
                  <p>
                    Petugas kelurahan dapat membantu memastikan dokumen yang
                    perlu disiapkan sesuai kebutuhan pelayanan.
                  </p>
                </div>

                <div className={styles.ctaActions}>
                  <Link href="/kontak" className={styles.ctaPrimary}>
                    Hubungi Kelurahan
                    <ArrowIcon />
                  </Link>

                  <a
                    href="https://wa.me/628125800224"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ctaSecondary}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
