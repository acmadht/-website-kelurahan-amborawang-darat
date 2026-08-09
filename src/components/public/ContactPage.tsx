"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import PublicShell from "./PublicShell";
import Reveal from "./Reveal";
import styles from "./ContactPage.module.css";

const contactInfo = [
  {
    label: "Telepon / WhatsApp",
    value: "0812-5800-224",
    note: "Informasi dan konfirmasi pelayanan",
    href: "https://wa.me/628125800224",
    type: "phone",
  },
  {
    label: "Alamat Kantor",
    value: "Jl. Balikpapan–Handil II KM 42, RT 12",
    note: "Kelurahan Amborawang Darat, Samboja Barat",
    href: "https://www.google.com/maps/search/?api=1&query=Kelurahan+Amborawang+Darat,+Samboja+Barat,+Kutai+Kartanegara,+Kalimantan+Timur",
    type: "location",
  },
  {
    label: "Senin–Kamis",
    value: "09.00–16.00 WITA",
    note: "Jam pelayanan kantor",
    href: "#jam-layanan",
    type: "clock",
  },
  {
    label: "Jumat",
    value: "09.00–11.00 WITA",
    note: "Jam pelayanan kantor",
    href: "#jam-layanan",
    type: "clock",
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

function PinIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  );
}

function IconByType({ type }: { type: string }) {
  if (type === "phone") return <PhoneIcon />;
  if (type === "location") return <PinIcon />;
  return <ClockIcon />;
}

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);

    window.setTimeout(() => {
      setSent(false);
    }, 2600);
  }

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
                  <MessageIcon />
                  <span>Pusat Kontak Kelurahan</span>
                </div>

                <h1>
                  Kontak
                  <strong>Amborawang Darat</strong>
                </h1>

                <p>
                  Hubungi Kelurahan Amborawang Darat untuk informasi pelayanan,
                  koreksi data, kebutuhan administrasi, dan informasi publik.
                </p>

                <div className={styles.heroActions}>
                  <a
                    href="https://wa.me/628125800224"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.primaryButton}
                  >
                    WhatsApp Kelurahan
                    <ArrowIcon />
                  </a>

                  <a
                    href="tel:+628125800224"
                    className={styles.secondaryButton}
                  >
                    Telepon
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal enabled delay={70}>
              <div className={styles.heroContactCard}>
                <div className={styles.contactCardHead}>
                  <div className={styles.contactCardIcon}>
                    <PinIcon />
                  </div>
                  <div>
                    <span>Kantor Kelurahan</span>
                    <strong>Amborawang Darat</strong>
                  </div>
                </div>

                <div className={styles.officeAddress}>
                  <span>Alamat</span>
                  <p>
                    Jl. Balikpapan–Handil II KM 42, RT 12, Kelurahan
                    Amborawang Darat, Kecamatan Samboja Barat,
                    Kabupaten Kutai Kartanegara, Kalimantan Timur 75274
                  </p>
                </div>

                <div className={styles.officeQuick}>
                  <div>
                    <span>WhatsApp</span>
                    <strong>0812-5800-224</strong>
                  </div>
                  <div>
                    <span>Hari kerja</span>
                    <strong>Senin–Jumat</strong>
                  </div>
                </div>

                <a href="#peta" className={styles.heroCardLink}>
                  Lihat Lokasi
                  <ArrowIcon size={16} />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CONTACT CARDS */}
        <section className={styles.quickSection}>
          <div className="container">
            <div className={styles.quickGrid}>
              {contactInfo.map((item, index) => (
                <Reveal key={`${item.label}-${item.value}`} enabled delay={index * 40}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={styles.quickCard}
                  >
                    <div className={styles.quickIcon}>
                      <IconByType type={item.type} />
                    </div>

                    <div className={styles.quickBody}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                      <small>{item.note}</small>
                    </div>

                    <ArrowIcon size={15} />
                  </a>
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
                <span className={styles.eyebrow}>Pusat Informasi</span>
                <h2>Hubungi melalui kanal yang tersedia</h2>
              </div>
            </Reveal>

            <Reveal enabled delay={60}>
              <div className={styles.introArticle}>
                <p className={styles.lead}>
                  Kontak kelurahan digunakan untuk membantu masyarakat
                  mendapatkan informasi sebelum datang ke kantor.
                </p>

                <p>
                  Untuk pelayanan administrasi, masyarakat disarankan
                  menyampaikan jenis kebutuhan terlebih dahulu agar petugas
                  dapat memberikan informasi mengenai dokumen yang perlu
                  disiapkan.
                </p>

                <div className={styles.introCallout}>
                  <span>Respon Pelayanan</span>
                  <strong>
                    Pesan yang dikirim di luar jam kantor dapat ditanggapi pada
                    jam pelayanan berikutnya.
                  </strong>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* MAP */}
        <section id="peta" className={styles.mapSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.mapHeading}>
                <div>
                  <span className={styles.eyebrowLight}>Lokasi Kantor</span>
                  <h2>Temukan kantor kelurahan</h2>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Kelurahan+Amborawang+Darat,+Samboja+Barat,+Kutai+Kartanegara,+Kalimantan+Timur"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buka Google Maps
                  <ArrowIcon size={16} />
                </a>
              </div>
            </Reveal>

            <Reveal enabled delay={50}>
              <div className={styles.mapPanel}>
                <iframe
                  src="https://www.google.com/maps?q=Kelurahan+Amborawang+Darat,+Samboja+Barat,+Kutai+Kartanegara,+Kalimantan+Timur&z=15&output=embed"
                  title="Lokasi Kantor Kelurahan Amborawang Darat"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* HOURS + FORM */}
        <section id="jam-layanan" className={styles.serviceSection}>
          <div className={`container ${styles.serviceGrid}`}>
            <Reveal enabled>
              <div className={styles.hoursCard}>
                <div className={styles.hoursHead}>
                  <div className={styles.hoursIcon}>
                    <ClockIcon />
                  </div>
                  <div>
                    <span>Jam Pelayanan</span>
                    <h2>Kunjungan kantor</h2>
                  </div>
                </div>

                <div className={styles.hoursList}>
                  <div>
                    <span>Senin</span>
                    <strong>09.00–16.00 WITA</strong>
                  </div>
                  <div>
                    <span>Selasa</span>
                    <strong>09.00–16.00 WITA</strong>
                  </div>
                  <div>
                    <span>Rabu</span>
                    <strong>09.00–16.00 WITA</strong>
                  </div>
                  <div>
                    <span>Kamis</span>
                    <strong>09.00–16.00 WITA</strong>
                  </div>
                  <div>
                    <span>Jumat</span>
                    <strong>09.00–11.00 WITA</strong>
                  </div>
                  <div className={styles.closedRow}>
                    <span>Sabtu–Minggu</span>
                    <strong>Tutup</strong>
                  </div>
                </div>

                <p>
                  Jam pelayanan dapat menyesuaikan hari libur nasional,
                  kegiatan dinas, atau ketentuan kantor.
                </p>
              </div>
            </Reveal>

            <Reveal enabled delay={60}>
              <div className={styles.formCard}>
                <div className={styles.formHead}>
                  <span>Kirim Pesan</span>
                  <h2>Sampaikan kebutuhan Anda</h2>
                  <p>
                    Formulir ini dapat diarahkan ke sistem backend atau email
                    kelurahan ketika integrasi sudah tersedia.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <label>
                      <span>Nama</span>
                      <input type="text" name="name" placeholder="Nama lengkap" required />
                    </label>

                    <label>
                      <span>Nomor WhatsApp</span>
                      <input type="tel" name="phone" placeholder="08xxxxxxxxxx" required />
                    </label>
                  </div>

                  <label>
                    <span>Keperluan</span>
                    <select name="subject" defaultValue="" required>
                      <option value="" disabled>Pilih keperluan</option>
                      <option value="pelayanan">Informasi Pelayanan</option>
                      <option value="data">Koreksi Data Publik</option>
                      <option value="dokumen">Dokumen Publik</option>
                      <option value="berita">Berita / Dokumentasi</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </label>

                  <label>
                    <span>Pesan</span>
                    <textarea
                      name="message"
                      rows={6}
                      placeholder="Tuliskan pesan atau kebutuhan Anda..."
                      required
                    />
                  </label>

                  <button type="submit">
                    {sent ? "Pesan diterima" : "Kirim Pesan"}
                    {!sent && <ArrowIcon />}
                  </button>

                  {sent && (
                    <p className={styles.successMessage}>
                      Tampilan formulir berhasil. Hubungkan submit ini ke backend
                      atau email agar pesan benar-benar terkirim.
                    </p>
                  )}
                </form>
              </div>
            </Reveal>
          </div>
        </section>

        {/* QUICK ACCESS */}
        <section className={styles.accessSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.accessPanel}>
                <div>
                  <span>Akses Cepat</span>
                  <h2>Informasi lain yang mungkin Anda perlukan</h2>
                </div>

                <div className={styles.accessLinks}>
                  <Link href="/layanan">
                    Layanan
                    <ArrowIcon size={15} />
                  </Link>

                  <Link href="/dokumen">
                    Dokumen
                    <ArrowIcon size={15} />
                  </Link>

                  <Link href="/wilayah">
                    Wilayah
                    <ArrowIcon size={15} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className="container">
            <Reveal enabled>
              <div className={styles.cta}>
                <div>
                  <span>Butuh Respon Cepat?</span>
                  <h2>Gunakan WhatsApp untuk konfirmasi pelayanan.</h2>
                  <p>
                    Sampaikan keperluan secara singkat agar petugas dapat
                    memberikan informasi yang sesuai.
                  </p>
                </div>

                <div className={styles.ctaActions}>
                  <a
                    href="https://wa.me/628125800224"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ctaPrimary}
                  >
                    WhatsApp Kelurahan
                    <ArrowIcon />
                  </a>

                  <Link href="/layanan" className={styles.ctaSecondary}>
                    Lihat Layanan
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
