"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import ImageUploader from "./ImageUploader";
import {
  amborawangProfileFallback,
  resolveAmborawangProfile,
  type ProfileBoundaryItem,
  type ProfileContent,
  type ProfilePotentialItem,
  type ProfileRegionFact,
  type ProfileStat,
  type ProfileTimelineItem,
} from "@/data/amborawangProfile";
import styles from "./ProfileAdminEditor.module.css";
import visualStyles from "./AdminVisualEditor.module.css";

const sectionLinks = [
  ["hero", "Hero & Foto"],
  ["ringkasan", "Ringkasan"],
  ["sejarah", "Sejarah"],
  ["statistik", "Statistik"],
  ["timeline", "Timeline"],
  ["visi-misi", "Visi & Misi"],
  ["wilayah", "Wilayah"],
  ["potensi", "Potensi"],
  ["fasilitas", "Fasilitas"],
  ["prioritas", "Prioritas"],
  ["koreksi", "Panel Koreksi"],
] as const;

type SimpleListKey = "missions" | "facilities" | "priorities";

function cloneFallback(): ProfileContent {
  return JSON.parse(JSON.stringify(amborawangProfileFallback)) as ProfileContent;
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <label className={styles.label}>
      <span>{children}</span>
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function SectionTitle({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.sectionTitle}>
      <span>{step}</span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

function RowActions({
  index,
  length,
  onMove,
  onRemove,
}: {
  index: number;
  length: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className={styles.rowActions}>
      <button type="button" onClick={() => onMove(-1)} disabled={index === 0}>
        ↑
      </button>
      <button type="button" onClick={() => onMove(1)} disabled={index === length - 1}>
        ↓
      </button>
      <button type="button" className={styles.removeButton} onClick={onRemove}>
        Hapus
      </button>
    </div>
  );
}

export default function ProfileAdminEditor() {
  const [form, setForm] = useState<ProfileContent>(cloneFallback);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [activeSection, setActiveSection] = useState("hero");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!db) {
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, "pages", "profil"));
        if (!active) return;
        setForm(
          snapshot.exists()
            ? resolveAmborawangProfile(snapshot.data() as Partial<ProfileContent>)
            : cloneFallback(),
        );
      } catch (error) {
        if (active) {
          setStatus(error instanceof Error ? error.message : "Gagal memuat profil.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const completion = useMemo(() => {
    const checks = [
      form.heroTitle,
      form.history,
      form.vision,
      form.geography,
      form.potential,
      form.facilities.length ? "ok" : "",
      form.priorities.length ? "ok" : "",
      form.imageUrl,
    ];
    const filled = checks.filter((item) => String(item).trim()).length;
    return Math.round((filled / checks.length) * 100);
  }, [form]);

  function updateField<K extends keyof ProfileContent>(
    key: K,
    value: ProfileContent[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setStatus("");
  }

  function updateSimpleList(key: SimpleListKey, index: number, value: string) {
    setForm((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
    setStatus("");
  }

  function addSimpleList(key: SimpleListKey, placeholder: string) {
    setForm((current) => ({
      ...current,
      [key]: [...current[key], placeholder],
    }));
  }

  function removeSimpleList(key: SimpleListKey, index: number) {
    setForm((current) => ({
      ...current,
      [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function moveSimpleList(key: SimpleListKey, index: number, direction: -1 | 1) {
    setForm((current) => ({
      ...current,
      [key]: moveItem(current[key], index, direction),
    }));
  }

  async function saveProfile() {
    if (!db || saving) return;
    setSaving(true);
    setStatus("");

    try {
      const cleaned = resolveAmborawangProfile(form);
      await setDoc(
        doc(db, "pages", "profil"),
        {
          ...cleaned,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      setForm(cleaned);
      setStatus("Perubahan profil berhasil disimpan dan siap tampil di website.");
      setEditMode(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal menyimpan profil.");
    } finally {
      setSaving(false);
    }
  }

  function restoreDefaults() {
    const confirmed = window.confirm(
      "Kembalikan semua isian profil pada data bawaan? Perubahan belum tersimpan sampai Anda menekan Simpan Perubahan.",
    );
    if (!confirmed) return;
    setForm(cloneFallback());
    setStatus("Data bawaan dimuat ke formulir. Tekan Simpan Perubahan jika ingin menerapkannya.");
  }

  if (loading) {
    return (
      <>
        <div className="admin-title">
          <h1>Profil Kelurahan</h1>
          <p>Memuat seluruh data profil...</p>
        </div>
        <section className="admin-panel">
          <div className="empty-state">Memuat data dari Firestore...</div>
        </section>
      </>
    );
  }

  if (!editMode) {
    return (
      <>
        <div className="admin-title">
          <h1>Profil Kelurahan</h1>
          <p>Tampilan admin mengikuti halaman Profil publik. Klik Edit Profil hanya saat ingin mengubah isinya.</p>
        </div>

        {status ? (
          <div className={`${/berhasil/i.test(status) ? "success-box" : "error-box"}`} style={{ marginTop: 14 }}>
            {status}
          </div>
        ) : null}

        <section className={visualStyles.previewShell}>
          <div className={visualStyles.previewTopbar}>
            <div className={visualStyles.previewTopbarCopy}>
              <strong>Tampilan yang dilihat masyarakat</strong>
              <span>Pratinjau langsung halaman /profil.</span>
            </div>
            <div className={visualStyles.previewActions}>
              <Link href="/profil" target="_blank" className={visualStyles.previewButton}>Lihat Website ↗</Link>
              <button type="button" className={visualStyles.editButton} onClick={() => setEditMode(true)}>✎ Edit Profil</button>
            </div>
          </div>
          <div className={visualStyles.previewCanvas}>
            <div className={visualStyles.liveFrameWrap}>
              <div className={visualStyles.liveFrameBar}>
                <span className={visualStyles.browserDots} aria-hidden="true"><i /><i /><i /></span>
                <span className={visualStyles.liveFrameUrl}>Website publik: /profil</span>
              </div>
              <iframe className={visualStyles.liveIframe} src="/profil" title="Pratinjau Profil Kelurahan" />
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.kicker}>Manajemen Profil Publik</span>
          <h1>Profil Kelurahan</h1>
          <p>
            Semua data pada halaman Profil dapat diubah dari sini. Setelah disimpan,
            halaman publik akan mengambil data terbaru dari Firestore.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button type="button" className={styles.resetButton} onClick={() => setEditMode(false)}>
            ← Kembali ke Tampilan
          </button>
          <Link href="/profil" target="_blank" className={styles.previewButton}>
            Lihat Halaman Profil ↗
          </Link>
          <button type="button" className={styles.resetButton} onClick={restoreDefaults}>
            Muat Data Bawaan
          </button>
          <button
            type="button"
            className={styles.saveButton}
            onClick={saveProfile}
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </header>

      <div className={styles.summaryBar}>
        <div>
          <span>Status isi profil</span>
          <strong>{completion}% lengkap</strong>
        </div>
        <div className={styles.progressTrack} aria-hidden="true">
          <span style={{ width: `${completion}%` }} />
        </div>
        <p>Dokumen Firestore: <strong>pages/profil</strong></p>
      </div>

      {status ? (
        <div
          className={`${styles.statusBox} ${
            /berhasil|dimuat/i.test(status) ? styles.statusSuccess : styles.statusError
          }`}
        >
          {status}
        </div>
      ) : null}

      <div className={styles.workspace}>
        <aside className={styles.sectionNav}>
          <span>Bagian Profil</span>
          {sectionLinks.map(([id, label], index) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setActiveSection(id)}
              className={activeSection === id ? styles.activeNav : ""}
            >
              <small>{String(index + 1).padStart(2, "0")}</small>
              {label}
            </a>
          ))}
        </aside>

        <div className={styles.editorColumn}>
          <section id="hero" className={styles.editorSection}>
            <SectionTitle
              step="01"
              title="Hero dan foto kantor"
              description="Atur judul utama halaman Profil serta foto kantor yang tampil di bagian paling atas."
            />

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <FieldLabel>Label kecil</FieldLabel>
                <input
                  className={styles.input}
                  value={form.heroEyebrow}
                  onChange={(event) => updateField("heroEyebrow", event.target.value)}
                />
              </div>
              <div className={styles.field}>
                <FieldLabel>Judul hero</FieldLabel>
                <input
                  className={styles.input}
                  value={form.heroTitle}
                  onChange={(event) => updateField("heroTitle", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Deskripsi hero</FieldLabel>
                <textarea
                  className={styles.textarea}
                  value={form.heroDescription}
                  onChange={(event) => updateField("heroDescription", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel hint="Upload foto baru jika ingin mengganti foto kantor saat ini.">
                  Foto kantor
                </FieldLabel>
                <div className={styles.uploadWrap}>
                  <ImageUploader
                    value={form.imageUrl}
                    folder="profil"
                    onChange={(url) => updateField("imageUrl", url)}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <FieldLabel>Judul foto</FieldLabel>
                <input
                  className={styles.input}
                  value={form.heroImageTitle}
                  onChange={(event) => updateField("heroImageTitle", event.target.value)}
                />
              </div>
              <div className={styles.field}>
                <FieldLabel>Keterangan foto</FieldLabel>
                <input
                  className={styles.input}
                  value={form.heroImageCaption}
                  onChange={(event) => updateField("heroImageCaption", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Kredit foto</FieldLabel>
                <input
                  className={styles.input}
                  value={form.heroImageCredit}
                  onChange={(event) => updateField("heroImageCredit", event.target.value)}
                />
              </div>
            </div>
          </section>

          <section id="ringkasan" className={styles.editorSection}>
            <SectionTitle
              step="02"
              title="Ringkasan profil"
              description="Isi bar informasi singkat yang tampil tepat setelah hero."
            />
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <FieldLabel>Label ringkasan</FieldLabel>
                <input
                  className={styles.input}
                  value={form.summaryEyebrow}
                  onChange={(event) => updateField("summaryEyebrow", event.target.value)}
                />
              </div>
              <div className={styles.field}>
                <FieldLabel>Nama kelurahan</FieldLabel>
                <input
                  className={styles.input}
                  value={form.summaryName}
                  onChange={(event) => updateField("summaryName", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Deskripsi singkat</FieldLabel>
                <textarea
                  className={styles.textareaSmall}
                  value={form.summaryDescription}
                  onChange={(event) => updateField("summaryDescription", event.target.value)}
                />
              </div>
            </div>
          </section>

          <section id="sejarah" className={styles.editorSection}>
            <SectionTitle
              step="03"
              title="Sejarah kelurahan"
              description="Pisahkan paragraf dengan satu baris kosong agar tampil rapi pada halaman publik."
            />
            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Judul sejarah</FieldLabel>
                <input
                  className={styles.input}
                  value={form.historyTitle}
                  onChange={(event) => updateField("historyTitle", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Isi sejarah</FieldLabel>
                <textarea
                  className={styles.textareaTall}
                  value={form.history}
                  onChange={(event) => updateField("history", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Catatan penting / callout</FieldLabel>
                <textarea
                  className={styles.textareaSmall}
                  value={form.historyCallout}
                  onChange={(event) => updateField("historyCallout", event.target.value)}
                />
              </div>
            </div>
          </section>

          <section id="statistik" className={styles.editorSection}>
            <SectionTitle
              step="04"
              title="Statistik utama"
              description="Empat data pertama juga dipakai sebagai ringkasan cepat pada bagian atas halaman Profil."
            />

            <div className={styles.repeaterList}>
              {form.stats.map((item, index) => (
                <article key={`stat-${index}`} className={styles.repeaterCard}>
                  <div className={styles.repeaterHead}>
                    <strong>Statistik {String(index + 1).padStart(2, "0")}</strong>
                    <RowActions
                      index={index}
                      length={form.stats.length}
                      onMove={(direction) =>
                        updateField("stats", moveItem(form.stats, index, direction))
                      }
                      onRemove={() =>
                        updateField(
                          "stats",
                          form.stats.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                    />
                  </div>
                  <div className={styles.formGridThree}>
                    <div className={styles.field}>
                      <FieldLabel>Nilai</FieldLabel>
                      <input
                        className={styles.input}
                        value={item.value}
                        onChange={(event) => {
                          const next: ProfileStat[] = form.stats.map((stat, itemIndex) =>
                            itemIndex === index ? { ...stat, value: event.target.value } : stat,
                          );
                          updateField("stats", next);
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <FieldLabel>Label</FieldLabel>
                      <input
                        className={styles.input}
                        value={item.label}
                        onChange={(event) => {
                          const next: ProfileStat[] = form.stats.map((stat, itemIndex) =>
                            itemIndex === index ? { ...stat, label: event.target.value } : stat,
                          );
                          updateField("stats", next);
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <FieldLabel>Sumber / catatan</FieldLabel>
                      <input
                        className={styles.input}
                        value={item.note}
                        onChange={(event) => {
                          const next: ProfileStat[] = form.stats.map((stat, itemIndex) =>
                            itemIndex === index ? { ...stat, note: event.target.value } : stat,
                          );
                          updateField("stats", next);
                        }}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              className={styles.addButton}
              onClick={() =>
                updateField("stats", [
                  ...form.stats,
                  { value: "Data baru", label: "Label statistik", note: "Sumber data" },
                ])
              }
            >
              + Tambah Statistik
            </button>
          </section>

          <section id="timeline" className={styles.editorSection}>
            <SectionTitle
              step="05"
              title="Jejak perkembangan"
              description="Kelola judul, deskripsi, tahun, dan tonggak perkembangan administratif kelurahan."
            />
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <FieldLabel>Label bagian</FieldLabel>
                <input
                  className={styles.input}
                  value={form.timelineEyebrow}
                  onChange={(event) => updateField("timelineEyebrow", event.target.value)}
                />
              </div>
              <div className={styles.field}>
                <FieldLabel>Judul bagian</FieldLabel>
                <input
                  className={styles.input}
                  value={form.timelineTitle}
                  onChange={(event) => updateField("timelineTitle", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Deskripsi bagian</FieldLabel>
                <textarea
                  className={styles.textareaSmall}
                  value={form.timelineDescription}
                  onChange={(event) => updateField("timelineDescription", event.target.value)}
                />
              </div>
            </div>

            <div className={styles.repeaterList}>
              {form.timeline.map((item, index) => (
                <article key={`timeline-${index}`} className={styles.repeaterCard}>
                  <div className={styles.repeaterHead}>
                    <strong>Tonggak {String(index + 1).padStart(2, "0")}</strong>
                    <RowActions
                      index={index}
                      length={form.timeline.length}
                      onMove={(direction) =>
                        updateField("timeline", moveItem(form.timeline, index, direction))
                      }
                      onRemove={() =>
                        updateField(
                          "timeline",
                          form.timeline.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                    />
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <FieldLabel>Tahun / periode</FieldLabel>
                      <input
                        className={styles.input}
                        value={item.year}
                        onChange={(event) => {
                          const next: ProfileTimelineItem[] = form.timeline.map(
                            (timelineItem, itemIndex) =>
                              itemIndex === index
                                ? { ...timelineItem, year: event.target.value }
                                : timelineItem,
                          );
                          updateField("timeline", next);
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <FieldLabel>Judul</FieldLabel>
                      <input
                        className={styles.input}
                        value={item.title}
                        onChange={(event) => {
                          const next: ProfileTimelineItem[] = form.timeline.map(
                            (timelineItem, itemIndex) =>
                              itemIndex === index
                                ? { ...timelineItem, title: event.target.value }
                                : timelineItem,
                          );
                          updateField("timeline", next);
                        }}
                      />
                    </div>
                    <div className={`${styles.field} ${styles.full}`}>
                      <FieldLabel>Penjelasan</FieldLabel>
                      <textarea
                        className={styles.textareaSmall}
                        value={item.text}
                        onChange={(event) => {
                          const next: ProfileTimelineItem[] = form.timeline.map(
                            (timelineItem, itemIndex) =>
                              itemIndex === index
                                ? { ...timelineItem, text: event.target.value }
                                : timelineItem,
                          );
                          updateField("timeline", next);
                        }}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              className={styles.addButton}
              onClick={() =>
                updateField("timeline", [
                  ...form.timeline,
                  { year: "Tahun", title: "Judul perkembangan", text: "Keterangan perkembangan." },
                ])
              }
            >
              + Tambah Tonggak
            </button>
          </section>

          <section id="visi-misi" className={styles.editorSection}>
            <SectionTitle
              step="06"
              title="Visi dan misi"
              description="Visi tampil sebagai kutipan utama, sedangkan setiap misi ditampilkan sebagai daftar bernomor."
            />
            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Visi pelayanan</FieldLabel>
                <textarea
                  className={styles.textarea}
                  value={form.vision}
                  onChange={(event) => updateField("vision", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Catatan di bawah visi</FieldLabel>
                <textarea
                  className={styles.textareaSmall}
                  value={form.visionNote}
                  onChange={(event) => updateField("visionNote", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Judul daftar misi</FieldLabel>
                <input
                  className={styles.input}
                  value={form.missionTitle}
                  onChange={(event) => updateField("missionTitle", event.target.value)}
                />
              </div>
            </div>

            <div className={styles.simpleList}>
              {form.missions.map((item, index) => (
                <div className={styles.simpleRow} key={`mission-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <textarea
                    className={styles.textareaInline}
                    value={item}
                    onChange={(event) => updateSimpleList("missions", index, event.target.value)}
                  />
                  <RowActions
                    index={index}
                    length={form.missions.length}
                    onMove={(direction) => moveSimpleList("missions", index, direction)}
                    onRemove={() => removeSimpleList("missions", index)}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => addSimpleList("missions", "Misi baru kelurahan")}
            >
              + Tambah Misi
            </button>
          </section>

          <section id="wilayah" className={styles.editorSection}>
            <SectionTitle
              step="07"
              title="Kondisi wilayah dan batas administratif"
              description="Kelola narasi geografis, data cepat wilayah, peta, dan batas utara, timur, selatan, serta barat."
            />
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <FieldLabel>Label bagian</FieldLabel>
                <input
                  className={styles.input}
                  value={form.regionEyebrow}
                  onChange={(event) => updateField("regionEyebrow", event.target.value)}
                />
              </div>
              <div className={styles.field}>
                <FieldLabel>Judul bagian</FieldLabel>
                <input
                  className={styles.input}
                  value={form.regionTitle}
                  onChange={(event) => updateField("regionTitle", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Kondisi geografis</FieldLabel>
                <textarea
                  className={styles.textarea}
                  value={form.geography}
                  onChange={(event) => updateField("geography", event.target.value)}
                />
              </div>
            </div>

            <div className={styles.subHeading}>
              <strong>Data cepat wilayah</strong>
              <span>Contoh: 4,68%, 5,3 km, Tropis</span>
            </div>
            <div className={styles.repeaterList}>
              {form.regionFacts.map((item, index) => (
                <article className={styles.repeaterCard} key={`fact-${index}`}>
                  <div className={styles.repeaterHead}>
                    <strong>Data {String(index + 1).padStart(2, "0")}</strong>
                    <RowActions
                      index={index}
                      length={form.regionFacts.length}
                      onMove={(direction) =>
                        updateField("regionFacts", moveItem(form.regionFacts, index, direction))
                      }
                      onRemove={() =>
                        updateField(
                          "regionFacts",
                          form.regionFacts.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                    />
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <FieldLabel>Nilai</FieldLabel>
                      <input
                        className={styles.input}
                        value={item.value}
                        onChange={(event) => {
                          const next: ProfileRegionFact[] = form.regionFacts.map(
                            (fact, itemIndex) =>
                              itemIndex === index ? { ...fact, value: event.target.value } : fact,
                          );
                          updateField("regionFacts", next);
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <FieldLabel>Label</FieldLabel>
                      <input
                        className={styles.input}
                        value={item.label}
                        onChange={(event) => {
                          const next: ProfileRegionFact[] = form.regionFacts.map(
                            (fact, itemIndex) =>
                              itemIndex === index ? { ...fact, label: event.target.value } : fact,
                          );
                          updateField("regionFacts", next);
                        }}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              className={styles.addButton}
              onClick={() =>
                updateField("regionFacts", [
                  ...form.regionFacts,
                  { value: "Nilai", label: "Keterangan data" },
                ])
              }
            >
              + Tambah Data Wilayah
            </button>

            <div className={styles.subHeading}>
              <strong>Peta wilayah</strong>
              <span>Gunakan gambar peta yang jelas dan tidak terlalu kecil.</span>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <FieldLabel>Judul peta</FieldLabel>
                <input
                  className={styles.input}
                  value={form.mapTitle}
                  onChange={(event) => updateField("mapTitle", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Gambar peta</FieldLabel>
                <div className={styles.uploadWrap}>
                  <ImageUploader
                    value={form.mapImageUrl}
                    folder="profil-peta"
                    onChange={(url) => updateField("mapImageUrl", url)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.subHeading}>
              <strong>Batas wilayah</strong>
              <span>Urutan dapat dipindahkan dengan tombol panah.</span>
            </div>
            <div className={styles.repeaterList}>
              {form.boundaryItems.map((item, index) => (
                <article className={styles.repeaterCard} key={`boundary-${index}`}>
                  <div className={styles.repeaterHead}>
                    <strong>Batas {String(index + 1).padStart(2, "0")}</strong>
                    <RowActions
                      index={index}
                      length={form.boundaryItems.length}
                      onMove={(direction) =>
                        updateField(
                          "boundaryItems",
                          moveItem(form.boundaryItems, index, direction),
                        )
                      }
                      onRemove={() =>
                        updateField(
                          "boundaryItems",
                          form.boundaryItems.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                    />
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <FieldLabel>Arah</FieldLabel>
                      <input
                        className={styles.input}
                        value={item.direction}
                        onChange={(event) => {
                          const next: ProfileBoundaryItem[] = form.boundaryItems.map(
                            (boundary, itemIndex) =>
                              itemIndex === index
                                ? { ...boundary, direction: event.target.value }
                                : boundary,
                          );
                          updateField("boundaryItems", next);
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <FieldLabel>Berbatasan dengan</FieldLabel>
                      <input
                        className={styles.input}
                        value={item.places}
                        onChange={(event) => {
                          const next: ProfileBoundaryItem[] = form.boundaryItems.map(
                            (boundary, itemIndex) =>
                              itemIndex === index
                                ? { ...boundary, places: event.target.value }
                                : boundary,
                          );
                          updateField("boundaryItems", next);
                        }}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              className={styles.addButton}
              onClick={() =>
                updateField("boundaryItems", [
                  ...form.boundaryItems,
                  { direction: "Arah", places: "Nama wilayah" },
                ])
              }
            >
              + Tambah Batas Wilayah
            </button>

            <div className={`${styles.field} ${styles.full} ${styles.noteField}`}>
              <FieldLabel>Catatan dasar batas administratif</FieldLabel>
              <textarea
                className={styles.textarea}
                value={form.boundaries}
                onChange={(event) => updateField("boundaries", event.target.value)}
              />
            </div>
          </section>

          <section id="potensi" className={styles.editorSection}>
            <SectionTitle
              step="08"
              title="Potensi kelurahan"
              description="Atur narasi umum dan kartu potensi unggulan yang muncul pada halaman publik."
            />
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <FieldLabel>Label bagian</FieldLabel>
                <input
                  className={styles.input}
                  value={form.potentialEyebrow}
                  onChange={(event) => updateField("potentialEyebrow", event.target.value)}
                />
              </div>
              <div className={styles.field}>
                <FieldLabel>Judul bagian</FieldLabel>
                <input
                  className={styles.input}
                  value={form.potentialTitle}
                  onChange={(event) => updateField("potentialTitle", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Narasi potensi</FieldLabel>
                <textarea
                  className={styles.textarea}
                  value={form.potential}
                  onChange={(event) => updateField("potential", event.target.value)}
                />
              </div>
            </div>

            <div className={styles.repeaterList}>
              {form.potentials.map((item, index) => (
                <article className={styles.repeaterCard} key={`potential-${index}`}>
                  <div className={styles.repeaterHead}>
                    <strong>Potensi {String(index + 1).padStart(2, "0")}</strong>
                    <RowActions
                      index={index}
                      length={form.potentials.length}
                      onMove={(direction) =>
                        updateField("potentials", moveItem(form.potentials, index, direction))
                      }
                      onRemove={() =>
                        updateField(
                          "potentials",
                          form.potentials.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                    />
                  </div>
                  <div className={styles.formGrid}>
                    <div className={`${styles.field} ${styles.full}`}>
                      <FieldLabel>Judul potensi</FieldLabel>
                      <input
                        className={styles.input}
                        value={item.title}
                        onChange={(event) => {
                          const next: ProfilePotentialItem[] = form.potentials.map(
                            (potentialItem, itemIndex) =>
                              itemIndex === index
                                ? { ...potentialItem, title: event.target.value }
                                : potentialItem,
                          );
                          updateField("potentials", next);
                        }}
                      />
                    </div>
                    <div className={`${styles.field} ${styles.full}`}>
                      <FieldLabel>Deskripsi</FieldLabel>
                      <textarea
                        className={styles.textareaSmall}
                        value={item.text}
                        onChange={(event) => {
                          const next: ProfilePotentialItem[] = form.potentials.map(
                            (potentialItem, itemIndex) =>
                              itemIndex === index
                                ? { ...potentialItem, text: event.target.value }
                                : potentialItem,
                          );
                          updateField("potentials", next);
                        }}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              className={styles.addButton}
              onClick={() =>
                updateField("potentials", [
                  ...form.potentials,
                  { title: "Potensi baru", text: "Deskripsi potensi kelurahan." },
                ])
              }
            >
              + Tambah Potensi
            </button>
          </section>

          <section id="fasilitas" className={styles.editorSection}>
            <SectionTitle
              step="09"
              title="Fasilitas umum"
              description="Tambah, ubah, hapus, dan atur urutan fasilitas yang tersedia di wilayah kelurahan."
            />
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <FieldLabel>Label bagian</FieldLabel>
                <input
                  className={styles.input}
                  value={form.facilityEyebrow}
                  onChange={(event) => updateField("facilityEyebrow", event.target.value)}
                />
              </div>
              <div className={styles.field}>
                <FieldLabel>Judul bagian</FieldLabel>
                <input
                  className={styles.input}
                  value={form.facilityTitle}
                  onChange={(event) => updateField("facilityTitle", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Pengantar fasilitas</FieldLabel>
                <textarea
                  className={styles.textareaSmall}
                  value={form.facilityIntro}
                  onChange={(event) => updateField("facilityIntro", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Ringkasan kelompok fasilitas</FieldLabel>
                <textarea
                  className={styles.textareaSmall}
                  value={form.facilityLeadText}
                  onChange={(event) => updateField("facilityLeadText", event.target.value)}
                />
              </div>
            </div>

            <div className={styles.simpleList}>
              {form.facilities.map((item, index) => (
                <div className={styles.simpleRow} key={`facility-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <textarea
                    className={styles.textareaInline}
                    value={item}
                    onChange={(event) => updateSimpleList("facilities", index, event.target.value)}
                  />
                  <RowActions
                    index={index}
                    length={form.facilities.length}
                    onMove={(direction) => moveSimpleList("facilities", index, direction)}
                    onRemove={() => removeSimpleList("facilities", index)}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => addSimpleList("facilities", "Fasilitas baru")}
            >
              + Tambah Fasilitas
            </button>
          </section>

          <section id="prioritas" className={styles.editorSection}>
            <SectionTitle
              step="10"
              title="Prioritas pengembangan"
              description="Kelola fokus pengembangan wilayah yang ditampilkan sebagai kartu ringkas."
            />
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <FieldLabel>Label bagian</FieldLabel>
                <input
                  className={styles.input}
                  value={form.priorityEyebrow}
                  onChange={(event) => updateField("priorityEyebrow", event.target.value)}
                />
              </div>
              <div className={styles.field}>
                <FieldLabel>Judul bagian</FieldLabel>
                <input
                  className={styles.input}
                  value={form.priorityTitle}
                  onChange={(event) => updateField("priorityTitle", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Pengantar prioritas</FieldLabel>
                <textarea
                  className={styles.textareaSmall}
                  value={form.priorityIntro}
                  onChange={(event) => updateField("priorityIntro", event.target.value)}
                />
              </div>
            </div>

            <div className={styles.simpleList}>
              {form.priorities.map((item, index) => (
                <div className={styles.simpleRow} key={`priority-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <textarea
                    className={styles.textareaInline}
                    value={item}
                    onChange={(event) => updateSimpleList("priorities", index, event.target.value)}
                  />
                  <RowActions
                    index={index}
                    length={form.priorities.length}
                    onMove={(direction) => moveSimpleList("priorities", index, direction)}
                    onRemove={() => removeSimpleList("priorities", index)}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => addSimpleList("priorities", "Prioritas pengembangan baru")}
            >
              + Tambah Prioritas
            </button>
          </section>

          <section id="koreksi" className={styles.editorSection}>
            <SectionTitle
              step="11"
              title="Panel koreksi data"
              description="Atur teks ajakan yang muncul di bagian paling bawah halaman Profil."
            />
            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Label kecil</FieldLabel>
                <input
                  className={styles.input}
                  value={form.updateKicker}
                  onChange={(event) => updateField("updateKicker", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Judul</FieldLabel>
                <input
                  className={styles.input}
                  value={form.updateTitle}
                  onChange={(event) => updateField("updateTitle", event.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <FieldLabel>Deskripsi</FieldLabel>
                <textarea
                  className={styles.textareaSmall}
                  value={form.updateText}
                  onChange={(event) => updateField("updateText", event.target.value)}
                />
              </div>
            </div>
          </section>

          <div className={styles.bottomSave}>
            <div>
              <strong>Selesai mengubah profil?</strong>
              <span>Simpan agar perubahan tersedia untuk halaman publik.</span>
            </div>
            <button type="button" onClick={saveProfile} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
