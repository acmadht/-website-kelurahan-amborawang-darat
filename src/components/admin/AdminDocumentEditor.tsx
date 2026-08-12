"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { FieldConfig } from "./AdminCollectionManager";
import ImageUploader from "./ImageUploader";
import styles from "./AdminVisualEditor.module.css";

type Props = {
  collectionName: string;
  documentId: string;
  title: string;
  description: string;
  fields: FieldConfig[];
  defaults: Record<string, unknown>;
  publicHref?: string;
};

function asText(value: unknown, fallback = "Belum diisi") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function truncate(value: unknown, length = 150) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return "Belum ada isi.";
  return normalized.length > length
    ? `${normalized.slice(0, length).trim()}…`
    : normalized;
}

function PublicMockHeader({ villageName = "Amborawang Darat" }: { villageName?: string }) {
  return (
    <div className={styles.publicHeader}>
      <div className={styles.brandMock}>
        <div className={styles.brandMark}>AD</div>
        <div>
          <strong>{villageName}</strong>
          <span>Website Resmi Kelurahan</span>
        </div>
      </div>
      <div className={styles.menuMock} aria-hidden="true">
        <b>Beranda</b>
        <span>Profil</span>
        <span>Pemerintahan</span>
        <span>Layanan</span>
        <span>Berita</span>
        <span>Informasi</span>
      </div>
    </div>
  );
}

function HomePreview({ data }: { data: Record<string, unknown> }) {
  return (
    <div className={styles.publicFrame}>
      <PublicMockHeader />
      <div className={styles.homeHero}>
        <div className={styles.homeHeroCopy}>
          <span className={styles.eyebrow}>{asText(data.heroEyebrow, "Website Resmi Kelurahan")}</span>
          <h2>Selamat Datang di Website Resmi Kelurahan</h2>
          <p>{asText(data.portalStatus, "Portal Informasi Resmi Kelurahan")}</p>
          <div className={styles.heroMiniActions}>
            <span>Lihat Layanan →</span>
            <span>Hubungi Kami</span>
          </div>
        </div>
        <div className={styles.homeMap}>
          <div>
            <strong>Lokasi Wilayah</strong>
            <span>Kelurahan Amborawang Darat</span>
          </div>
        </div>
      </div>
      <div className={styles.publicSections}>
        <div className={styles.sectionMock}>
          <span>{asText(data.welcomeEyebrow, "Profil Singkat")}</span>
          <strong>{asText(data.welcomeTitle, "Kelurahan Amborawang Darat")}</strong>
          <p>{truncate(data.welcomeText, 110)}</p>
        </div>
        <div className={styles.sectionMock}>
          <span>{asText(data.servicesEyebrow, "Layanan")}</span>
          <strong>{asText(data.servicesTitle, "Layanan Masyarakat")}</strong>
          <p>Layanan yang tampil di sini dikelola dari menu Layanan.</p>
        </div>
        <div className={styles.sectionMock}>
          <span>{asText(data.infoEyebrow, "Informasi")}</span>
          <strong>{asText(data.infoTitle, "Informasi Terkini")}</strong>
          <p>{asText(data.ctaTitle, "Butuh bantuan atau informasi?")}</p>
        </div>
      </div>
    </div>
  );
}

function RegionPreview({ data }: { data: Record<string, unknown> }) {
  return (
    <div className={styles.publicFrame}>
      <PublicMockHeader />
      <div className={styles.documentPreview}>
        <div className={styles.documentHero}>
          {String(data.mapImageUrl ?? "") ? (
            <img className={styles.documentHeroImage} src={String(data.mapImageUrl)} alt="" />
          ) : null}
          <div className={styles.documentHeroShade} />
          <div className={styles.documentHeroCopy}>
            <span>Informasi Wilayah</span>
            <h2>Wilayah Kelurahan</h2>
            <p>{truncate(data.geography, 190)}</p>
          </div>
        </div>
        <div className={styles.documentGrid}>
          <div className={styles.documentCard}>
            <small>Luas Wilayah</small>
            <strong>{asText(data.area)}</strong>
            <p>{asText(data.areaNote, "Catatan luas belum diisi")}</p>
          </div>
          <div className={styles.documentCard}>
            <small>Jumlah Penduduk</small>
            <strong>{asText(data.population)}</strong>
            <p>{asText(data.populationNote, "Catatan penduduk belum diisi")}</p>
          </div>
          <div className={styles.documentCard}>
            <small>Jarak Kecamatan</small>
            <strong>{asText(data.districtDistance)}</strong>
            <p>{asText(data.districtDistanceNote, "Catatan jarak belum diisi")}</p>
          </div>
          <div className={styles.documentCard}>
            <small>Batas Utara</small>
            <strong>{asText(data.northBoundary)}</strong>
          </div>
          <div className={styles.documentCard}>
            <small>Batas Timur</small>
            <strong>{asText(data.eastBoundary)}</strong>
          </div>
          <div className={styles.documentCard}>
            <small>Batas Selatan / Barat</small>
            <strong>{asText(data.southBoundary)} / {asText(data.westBoundary)}</strong>
          </div>
        </div>
        <div className={styles.mapPreview}>
          <div>
            <strong>Peta Administratif</strong>
            <span>{String(data.mapImageUrl ?? "") ? "Peta sudah tersedia" : "Belum ada peta yang diunggah"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPreview({ data, contactMode }: { data: Record<string, unknown>; contactMode: boolean }) {
  const villageName = asText(data.villageName, "Amborawang Darat");
  return (
    <div className={styles.publicFrame}>
      <PublicMockHeader villageName={villageName} />
      <div className={styles.documentPreview}>
        <div className={styles.documentHero}>
          {String(data.officeImageUrl ?? "") ? (
            <img className={styles.documentHeroImage} src={String(data.officeImageUrl)} alt="" />
          ) : null}
          <div className={styles.documentHeroShade} />
          <div className={styles.documentHeroCopy}>
            <span>{contactMode ? "Hubungi Kelurahan" : "Identitas Website"}</span>
            <h2>{contactMode ? "Kontak & Pelayanan" : asText(data.siteName, `Kelurahan ${villageName}`)}</h2>
            <p>{contactMode ? asText(data.address) : asText(data.tagline, "Portal informasi dan pelayanan masyarakat")}</p>
          </div>
        </div>
        <div className={styles.documentGrid}>
          {contactMode ? (
            <>
              <div className={styles.documentCard}><small>Telepon</small><strong>{asText(data.phone)}</strong></div>
              <div className={styles.documentCard}><small>WhatsApp</small><strong>{asText(data.whatsapp)}</strong></div>
              <div className={styles.documentCard}><small>Email</small><strong>{asText(data.email)}</strong></div>
              <div className={styles.documentCard}><small>Jam Pelayanan</small><strong>{asText(data.serviceHours)}</strong></div>
              <div className={styles.documentCard}><small>Alamat Kantor</small><strong>{asText(data.address)}</strong></div>
              <div className={styles.documentCard}><small>Tombol WhatsApp</small><strong>{data.whatsappEnabled === false ? "Tidak aktif" : "Aktif"}</strong></div>
            </>
          ) : (
            <>
              <div className={styles.documentCard}><small>Kelurahan</small><strong>{villageName}</strong></div>
              <div className={styles.documentCard}><small>Kecamatan</small><strong>{asText(data.subdistrictName)}</strong></div>
              <div className={styles.documentCard}><small>Kabupaten</small><strong>{asText(data.regencyName)}</strong></div>
              <div className={styles.documentCard}><small>Provinsi</small><strong>{asText(data.provinceName)}</strong></div>
              <div className={styles.documentCard}><small>SEO</small><strong>{asText(data.seoTitle, "Judul SEO belum diisi")}</strong><p>{truncate(data.seoDescription, 90)}</p></div>
              <div className={styles.documentCard}><small>Slider Hero</small><strong>{data.heroAutoplay === false ? "Manual" : "Otomatis"}</strong><p>Interval {asText(data.heroInterval, "7000")} ms</p></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GenericDocumentPreview({ title, fields, data }: { title: string; fields: FieldConfig[]; data: Record<string, unknown> }) {
  const visible = fields.filter((field) => field.type !== "image").slice(0, 9);
  return (
    <div className={styles.publicFrame}>
      <PublicMockHeader />
      <div className={styles.documentPreview}>
        <div className={styles.documentHero}>
          <div className={styles.documentHeroShade} />
          <div className={styles.documentHeroCopy}>
            <span>Pratinjau Halaman Publik</span>
            <h2>{title}</h2>
            <p>Data di bawah adalah isi yang saat ini dibaca website publik.</p>
          </div>
        </div>
        <div className={styles.documentGrid}>
          {visible.map((field) => (
            <div className={styles.documentCard} key={field.key}>
              <small>{field.label}</small>
              <strong>{field.type === "checkbox" ? (Boolean(data[field.key]) ? "Aktif" : "Tidak aktif") : truncate(data[field.key], 90)}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDocumentEditor({
  collectionName,
  documentId,
  title,
  description,
  fields,
  defaults,
  publicHref,
}: Props) {
  const [form, setForm] = useState<Record<string, unknown>>(defaults);
  const [status, setStatus] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!db) {
      setForm(defaults);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      doc(db, collectionName, documentId),
      (snapshot) => {
        const data = snapshot.exists() ? { ...snapshot.data() } : {};

        for (const field of fields) {
          if (field.type === "list" && Array.isArray(data[field.key])) {
            data[field.key] = (data[field.key] as unknown[]).join("\n");
          }
        }

        setForm({ ...defaults, ...data });
        setLoading(false);
      },
      (error) => {
        setStatus(error.message || "Gagal memuat data dari Firestore.");
        setLoading(false);
      },
    );

    return unsubscribe;
    // fields/defaults berasal dari konfigurasi statis halaman admin.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, documentId]);

  const preview = useMemo(() => {
    if (collectionName === "pages" && documentId === "home") return <HomePreview data={form} />;
    if (collectionName === "pages" && documentId === "wilayah") return <RegionPreview data={form} />;
    if (collectionName === "siteSettings" && documentId === "main") {
      return <SettingsPreview data={form} contactMode={/kontak/i.test(title)} />;
    }
    return <GenericDocumentPreview title={title} fields={fields} data={form} />;
  }, [collectionName, documentId, fields, form, title]);

  function startEdit() {
    setStatus("");
    setNotice("");
    setOpen(true);
  }

  async function save() {
    if (!db || saving) return;

    setStatus("");
    setNotice("");

    for (const field of fields) {
      if (field.required && !String(form[field.key] ?? "").trim()) {
        setStatus(`${field.label} wajib diisi.`);
        return;
      }
    }

    const payload: Record<string, unknown> = {};

    for (const field of fields) {
      let value = form[field.key];

      if (field.type === "number") value = Number(value) || 0;
      if (field.type === "checkbox") value = Boolean(value);
      if (field.type === "list") {
        value = String(value ?? "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
      } else if (typeof value === "string") {
        value = value.trim();
      }

      payload[field.key] = value;
    }

    setSaving(true);

    try {
      await setDoc(
        doc(db, collectionName, documentId),
        {
          ...payload,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      setNotice("Perubahan berhasil disimpan dan langsung diteruskan ke website publik.");
      setOpen(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-title">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className={styles.helperBar}>
        <div>
          <strong>Mode visual aktif</strong>
          <span>Tampilan admin dibuat menyerupai website publik. Klik Edit untuk mengubah isi; formulir hanya muncul saat dibutuhkan.</span>
        </div>
        <span>Sumber: {collectionName}/{documentId}</span>
      </div>

      {notice ? <div className="success-box" style={{ marginTop: 14 }}>{notice}</div> : null}
      {status && !open ? <div className="error-box" style={{ marginTop: 14 }}>{status}</div> : null}

      <section className={styles.previewShell}>
        <div className={styles.previewTopbar}>
          <div className={styles.previewTopbarCopy}>
            <strong>Tampilan yang dilihat masyarakat</strong>
            <span>Edit konten tanpa harus membaca formulir panjang terlebih dahulu.</span>
          </div>
          <div className={styles.previewActions}>
            {publicHref ? (
              <Link href={publicHref} target="_blank" className={styles.previewButton}>
                Lihat Website ↗
              </Link>
            ) : null}
            <button type="button" className={styles.editButton} onClick={startEdit} disabled={loading}>
              ✎ Edit Halaman
            </button>
          </div>
        </div>

        <div className={styles.previewCanvas}>
          {loading ? (
            <div className={styles.emptyState}><strong>Memuat tampilan…</strong><span>Mengambil data terbaru dari Firestore.</span></div>
          ) : publicHref ? (
            <>
              <div className={styles.liveFrameWrap}>
                <div className={styles.liveFrameBar}>
                  <span className={styles.browserDots} aria-hidden="true"><i /><i /><i /></span>
                  <span className={styles.liveFrameUrl}>Website publik: {publicHref}</span>
                </div>
                <iframe
                  className={styles.liveIframe}
                  src={publicHref}
                  title={`Pratinjau publik ${title}`}
                />
              </div>
              {collectionName === "pages" && documentId === "home" ? (
                <div className={styles.quickEditBar}>
                  <span>Edit bagian Beranda:</span>
                  <Link href="/admin/hero">Hero Banner</Link>
                  <Link href="/admin/layanan">Layanan</Link>
                  <Link href="/admin/berita">Berita</Link>
                  <Link href="/admin/pengumuman">Pengumuman</Link>
                  <Link href="/admin/agenda">Agenda</Link>
                </div>
              ) : null}
            </>
          ) : preview}
        </div>
      </section>

      {open ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-label={`Edit ${title}`}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <span>Edit Konten</span>
                <h2>{title}</h2>
              </div>
              <button className={styles.previewButton} type="button" onClick={() => setOpen(false)} disabled={saving}>
                Tutup
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className="form-columns">
                {fields.map((field) => (
                  <div className={field.full ? "form-group form-span-2" : "form-group"} key={field.key}>
                    <label>
                      {field.label}
                      {field.required ? " *" : ""}
                    </label>

                    {field.type === "textarea" || field.type === "list" ? (
                      <textarea
                        className="form-control"
                        placeholder={field.placeholder}
                        value={String(form[field.key] ?? "")}
                        onChange={(event) => {
                          setForm({ ...form, [field.key]: event.target.value });
                          setStatus("");
                        }}
                      />
                    ) : field.type === "select" ? (
                      <select
                        className="form-control"
                        value={String(form[field.key] ?? "")}
                        onChange={(event) => {
                          setForm({ ...form, [field.key]: event.target.value });
                          setStatus("");
                        }}
                      >
                        <option value="">Pilih</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : field.type === "checkbox" ? (
                      <label className="form-check">
                        <input
                          type="checkbox"
                          checked={Boolean(form[field.key])}
                          onChange={(event) => {
                            setForm({ ...form, [field.key]: event.target.checked });
                            setStatus("");
                          }}
                        />
                        <span>Aktif</span>
                      </label>
                    ) : field.type === "image" ? (
                      <ImageUploader
                        value={String(form[field.key] ?? "")}
                        folder={collectionName}
                        onChange={(url) => {
                          setForm({ ...form, [field.key]: url });
                          setStatus("");
                        }}
                      />
                    ) : (
                      <input
                        className="form-control"
                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                        min={field.type === "number" ? 0 : undefined}
                        placeholder={field.placeholder}
                        value={String(form[field.key] ?? "")}
                        onChange={(event) => {
                          setForm({ ...form, [field.key]: event.target.value });
                          setStatus("");
                        }}
                      />
                    )}
                  </div>
                ))}

                {status ? <div className="error-box form-span-2">{status}</div> : null}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.previewButton} type="button" onClick={() => setOpen(false)} disabled={saving}>Batal</button>
              <button className={styles.addButton} type="button" onClick={() => void save()} disabled={saving}>
                {saving ? "Menyimpan…" : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
