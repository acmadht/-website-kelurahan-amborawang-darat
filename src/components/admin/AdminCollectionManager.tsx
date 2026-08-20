"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { slugify, sortByOrder } from "@/lib/utils";
import ImageUploader from "./ImageUploader";
import styles from "./AdminVisualEditor.module.css";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "select"
  | "date"
  | "image"
  | "list";

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  full?: boolean;
  placeholder?: string;
  readOnly?: boolean;
};

interface AdminCollectionManagerProps {
  collectionName: string;
  title: string;
  description: string;
  fields: FieldConfig[];
  defaults?: Record<string, unknown>;
  displayFields?: string[];
  lockedField?: string;
  lockedValues?: string[];
  publicHref?: string;
  fixedValues?: Record<string, unknown>;
  filterField?: string;
  filterValue?: string;
  filterMode?: "include" | "exclude";
  relatedLinks?: Array<{ label: string; href: string; note?: string }>;
  connectionNote?: string;
  autoRecalculate?: boolean;
}

function normalizeRtNumber(value: unknown) {
  const numeric = Number(String(value ?? "").replace(/\D/g, ""));
  if (!Number.isInteger(numeric) || numeric < 1 || numeric > 13) return "";
  return String(numeric).padStart(2, "0");
}

const RT_LINKED_COLLECTIONS = new Set([
  "residents",
  "families",
  "rts",
  "socialAssistance",
  "umkm",
  "facilities",
  "populationMutations",
  "inventory",
  "serviceRequests",
  "complaints",
]);

function witaNow() {
  const now = new Date();
  const dateParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Makassar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const timeParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Makassar",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const pick = (parts: Intl.DateTimeFormatPart[], type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    date: `${pick(dateParts, "year")}-${pick(dateParts, "month")}-${pick(dateParts, "day")}`,
    time: `${pick(timeParts, "hour")}.${pick(timeParts, "minute")} WITA`,
  };
}

function text(value: unknown, fallback = "Belum diisi") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function excerpt(value: unknown, length = 135) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return "Belum ada deskripsi.";
  return normalized.length > length ? `${normalized.slice(0, length).trim()}…` : normalized;
}

function initials(value: unknown) {
  const words = String(value ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  return words.map((word) => word[0]?.toUpperCase()).join("") || "AD";
}

function monthShort(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return { day: "--", month: "---" };
  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) return { day: raw.slice(-2), month: "" };
  return {
    day: new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat("id-ID", { month: "short" }).format(date),
  };
}

const EXPORTABLE_COLLECTIONS = new Set([
  "residents",
  "families",
  "populationMutations",
  "socialAssistance",
  "inventory",
  "rts",
]);

function exportValue(value: unknown) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map((item) => String(item ?? "")).join("; ");
  if (typeof value === "object") {
    const maybeTimestamp = value as { toDate?: () => Date; seconds?: number };
    if (typeof maybeTimestamp.toDate === "function") {
      try {
        return maybeTimestamp.toDate().toISOString();
      } catch {
        return "";
      }
    }
    if (typeof maybeTimestamp.seconds === "number") {
      return new Date(maybeTimestamp.seconds * 1000).toISOString();
    }
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function csvCell(value: unknown) {
  const normalized = exportValue(value).replace(/"/g, '""');
  return `"${normalized}"`;
}

function downloadCsvFile(filename: string, rows: Record<string, unknown>[], columns: Array<{ key: string; label: string }>) {
  const header = ["ID Firestore", ...columns.map((column) => column.label)].map(csvCell).join(",");
  const body = rows.map((row) =>
    [row.id, ...columns.map((column) => row[column.key])].map(csvCell).join(","),
  );
  const blob = new Blob(["\uFEFF", [header, ...body].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function StatusPill({ active, label }: { active: boolean; label?: string }) {
  return (
    <span className={`${styles.statusPill} ${active ? "" : styles.statusOff}`}>
      {label ?? (active ? "Tampil" : "Tidak tampil")}
    </span>
  );
}

function VisualCardContent({
  collectionName,
  item,
}: {
  collectionName: string;
  item: Record<string, unknown>;
}) {
  if (collectionName === "heroSlides") {
    return (
      <div className={styles.heroCard}>
        <div className={styles.cardMedia}>
          {String(item.imageUrl ?? "") ? <img src={String(item.imageUrl)} alt="" /> : null}
          <div className={styles.cardMediaShade} />
          <div className={styles.cardMediaTitle}>
            <small>Hero Banner #{text(item.order, "-")}</small>
            <strong>{text(item.title, "Judul banner belum diisi")}</strong>
            <div className={styles.heroButtons}>
              <span>{text(item.primaryButtonText, "Lihat Layanan")}</span>
              {String(item.secondaryButtonText ?? "") ? <span>{String(item.secondaryButtonText)}</span> : null}
            </div>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardKicker}>
            <span>Banner Beranda</span>
            <StatusPill active={item.isActive !== false} />
          </div>
          <p>{excerpt(item.subtitle)}</p>
        </div>
      </div>
    );
  }

  if (collectionName === "posts") {
    return (
      <>
        <div className={styles.cardMedia}>
          {String(item.coverImageUrl ?? "") ? <img src={String(item.coverImageUrl)} alt="" /> : null}
          <div className={styles.cardMediaShade} />
          <div className={styles.cardMediaTitle}>
            <small>{text(item.category, "Berita")} · {text(item.publishedDate, "Belum terbit")}</small>
            <strong>{text(item.title, "Judul berita")}</strong>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardKicker}>
            <span>Berita Kelurahan</span>
            <StatusPill active={String(item.status) === "published"} label={text(item.status, "draft")} />
          </div>
          <p>{excerpt(item.summary)}</p>
          <div className={styles.metaRow}>
            <span className={styles.metaChip}>{text(item.authorName, "Admin Kelurahan")}</span>
            {item.isFeatured ? <span className={styles.metaChip}>Unggulan</span> : null}
          </div>
        </div>
      </>
    );
  }

  if (collectionName === "services") {
    return (
      <div className={styles.cardBody}>
        <div className={styles.cardKicker}>
          <span>{text(item.category, "Layanan")}</span>
          <StatusPill active={item.isActive !== false} />
        </div>
        <div className={styles.avatarLayout} style={{ marginTop: 12 }}>
          <div className={styles.documentIcon}>{text(item.icon, "LY").slice(0, 3)}</div>
          <div>
            <h3 style={{ marginTop: 0 }}>{text(item.name, "Nama Layanan")}</h3>
            <p>{excerpt(item.summary, 95)}</p>
          </div>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaChip}>⏱ {text(item.duration, "-")}</span>
          <span className={styles.metaChip}>Biaya: {text(item.cost, "-")}</span>
          {item.isFeatured ? <span className={styles.metaChip}>Tampil di Beranda</span> : null}
        </div>
      </div>
    );
  }

  if (collectionName === "announcements") {
    return (
      <div className={styles.cardBody}>
        <div className={styles.cardKicker}>
          <span>{String(item.priority) === "penting" ? "Pengumuman Penting" : "Pengumuman"}</span>
          <StatusPill active={item.isActive !== false} />
        </div>
        <h3>{text(item.title, "Judul Pengumuman")}</h3>
        <p>{excerpt(item.summary)}</p>
        <div className={styles.metaRow}>
          <span className={styles.metaChip}>Berlaku sampai: {text(item.validUntil, "Tidak dibatasi")}</span>
          {String(item.attachmentUrl ?? "") ? <span className={styles.metaChip}>Ada lampiran</span> : null}
        </div>
      </div>
    );
  }

  if (collectionName === "agendas") {
    const date = monthShort(item.date);
    return (
      <div className={styles.cardBody}>
        <div className={styles.agendaLayout}>
          <div className={styles.dateTile}>
            <strong>{date.day}</strong>
            <span>{date.month}</span>
          </div>
          <div>
            <div className={styles.cardKicker}>
              <span>Agenda</span>
              <StatusPill active={String(item.status) !== "dibatalkan"} label={text(item.status, "akan-datang")} />
            </div>
            <h3>{text(item.title, "Nama Kegiatan")}</h3>
          </div>
        </div>
        <p style={{ marginTop: 10 }}>{excerpt(item.description, 100)}</p>
        <div className={styles.metaRow}>
          <span className={styles.metaChip}>{text(item.time, "Waktu belum diisi")}</span>
          <span className={styles.metaChip}>{text(item.location, "Lokasi belum diisi")}</span>
        </div>
      </div>
    );
  }

  if (collectionName === "officials") {
    return (
      <div className={styles.cardBody}>
        <div className={styles.avatarLayout}>
          {String(item.photoUrl ?? "") ? (
            <img className={styles.avatar} src={String(item.photoUrl)} alt="" />
          ) : (
            <div className={styles.avatarFallback}>{initials(item.name)}</div>
          )}
          <div>
            <div className={styles.cardKicker}>
              <span>{text(item.category, "Pemerintahan")}</span>
              <StatusPill active={item.isActive !== false} />
            </div>
            <h3>{text(item.name, "Nama Aparatur")}</h3>
            <p>{text(item.title, "Jabatan belum diisi")}</p>
          </div>
        </div>
        <div className={styles.metaRow}>
          {String(item.unit ?? "") ? <span className={styles.metaChip}>{String(item.unit)}</span> : null}
          {String(item.phone ?? "") ? <span className={styles.metaChip}>{String(item.phone)}</span> : null}
        </div>
      </div>
    );
  }

  if (collectionName === "galleryAlbums") {
    return (
      <>
        <div className={styles.cardMedia}>
          {String(item.coverImageUrl ?? "") ? <img src={String(item.coverImageUrl)} alt="" /> : null}
          <div className={styles.cardMediaShade} />
          <div className={styles.cardMediaTitle}>
            <small>{text(item.category, "Galeri")} · {text(item.eventDate, "Tanpa tanggal")}</small>
            <strong>{text(item.title, "Judul Album")}</strong>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardKicker}>
            <span>Album Galeri</span>
            <StatusPill active={String(item.status) === "published"} label={text(item.status, "draft")} />
          </div>
          <p>{excerpt(item.description, 95)}</p>
          <div className={styles.metaRow}>
            <span className={styles.metaChip}>{Number(item.photoCount) || 0} foto</span>
            {String(item.location ?? "") ? <span className={styles.metaChip}>{String(item.location)}</span> : null}
          </div>
        </div>
      </>
    );
  }

  if (collectionName === "kknPrograms") {
    const isSupport = String(item.programType ?? "Program Utama") === "Program Pendukung";
    return (
      <div className={styles.cardBody}>
        <div className={styles.cardKicker}>
          <span>{isSupport ? "Program Pendukung" : "Program Utama"}</span>
          <StatusPill active={item.isActive !== false} />
        </div>
        <h3>{text(item.title, "Nama Program KKN")}</h3>
        <p>{excerpt(item.description, 110)}</p>
        <div className={styles.metaRow}>
          <span className={styles.metaChip}>{text(item.code, "PROG")}</span>
          <span className={styles.metaChip}>{text(item.category, "Kategori")}</span>
          <span className={styles.metaChip}>Status: {text(item.status, "Rencana")}</span>
        </div>
      </div>
    );
  }

  if (collectionName === "publicDocuments" || collectionName === "documents") {
    return (
      <div className={styles.cardBody}>
        <div className={styles.avatarLayout}>
          <div className={styles.documentIcon}>DOC</div>
          <div>
            <div className={styles.cardKicker}>
              <span>{text(item.category, "Dokumen")}</span>
              <StatusPill active={item.isActive !== false} />
            </div>
            <h3>{text(item.title ?? item.name, "Nama Dokumen")}</h3>
            <p>{excerpt(item.description ?? item.summary, 90)}</p>
          </div>
        </div>
        <div className={styles.metaRow}>
          {String(item.year ?? "") ? <span className={styles.metaChip}>{String(item.year)}</span> : null}
          {String(item.fileUrl ?? item.url ?? "") ? <span className={styles.metaChip}>File tersedia</span> : null}
        </div>
      </div>
    );
  }

  if (collectionName === "rts") {
    return (
      <div className={styles.cardBody}>
        <div className={styles.avatarLayout}>
          {String(item.photoUrl ?? "") ? (
            <img className={styles.avatar} src={String(item.photoUrl)} alt="" />
          ) : (
            <div className={styles.rtBadge}>RT {text(item.number, "--")}</div>
          )}
          <div>
            <div className={styles.cardKicker}>
              <span>RT {text(item.number, "--")}</span>
              <StatusPill active={item.isActive !== false} />
            </div>
            <h3>{text(item.chairmanName, "Nama Ketua RT")}</h3>
            <p>{excerpt(item.area, 85)}</p>
          </div>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaChip}>{Number(item.populationCount) || 0} penduduk</span>
          <span className={styles.metaChip}>{Number(item.familyCount) || 0} KK</span>
          {String(item.phone ?? "") ? <span className={styles.metaChip}>{String(item.phone)}</span> : null}
        </div>
      </div>
    );
  }


  if (collectionName === "residents") {
    return (
      <div className={styles.cardBody}>
        <div className={styles.cardKicker}><span>Data Penduduk</span><span className={styles.metaChip}>Internal</span></div>
        <h3>{text(item.fullName, "Nama penduduk")}</h3>
        <p>RT {text(item.rt, "--")} · {text(item.gender, "Jenis kelamin belum diisi")} · {text(item.domicileStatus, "Status belum diisi")}</p>
        <div className={styles.metaRow}>
          <span className={styles.metaChip}>NIK {text(item.nik, "-")}</span>
          <span className={styles.metaChip}>KK {text(item.familyCardNumber, "-")}</span>
        </div>
      </div>
    );
  }

  if (collectionName === "families") {
    return (
      <div className={styles.cardBody}>
        <div className={styles.cardKicker}><span>Keluarga / KK</span><span className={styles.metaChip}>Internal</span></div>
        <h3>{text(item.headName, "Kepala keluarga")}</h3>
        <p>RT {text(item.rt, "--")} · {Number(item.memberCount) || 0} anggota · {text(item.housingStatus, "Status rumah belum diisi")}</p>
        <div className={styles.metaRow}><span className={styles.metaChip}>No. KK {text(item.familyCardNumber, "-")}</span></div>
      </div>
    );
  }

  if (collectionName === "populationMutations") {
    return (
      <div className={styles.cardBody}>
        <div className={styles.cardKicker}><span>Mutasi Penduduk</span><span className={styles.metaChip}>Internal</span></div>
        <h3>{text(item.name, "Nama penduduk")}</h3>
        <p>{text(item.mutationType, "Jenis mutasi")} · {text(item.date, "Tanggal belum diisi")}</p>
        <div className={styles.metaRow}>
          {String(item.originRt ?? "") ? <span className={styles.metaChip}>RT asal {String(item.originRt)}</span> : null}
          {String(item.destinationRt ?? "") ? <span className={styles.metaChip}>RT tujuan {String(item.destinationRt)}</span> : null}
        </div>
      </div>
    );
  }

  if (collectionName === "socialAssistance") {
    return (
      <div className={styles.cardBody}>
        <div className={styles.cardKicker}><span>Bansos</span><span className={styles.metaChip}>Internal</span></div>
        <h3>{text(item.recipientName, "Nama penerima")}</h3>
        <p>{text(item.aidType, "Jenis bantuan")} · {text(item.receiptStatus, "Status belum diisi")}</p>
        <div className={styles.metaRow}>
          <span className={styles.metaChip}>RT {text(item.rt, "--")}</span>
          {String(item.period ?? "") ? <span className={styles.metaChip}>{String(item.period)}</span> : null}
        </div>
      </div>
    );
  }

  if (collectionName === "inventory") {
    return (
      <div className={styles.cardBody}>
        <div className={styles.cardKicker}><span>{text(item.category, "Inventaris")}</span><StatusPill active={String(item.condition).toLowerCase() !== "rusak berat"} label={text(item.condition, "Belum dinilai")} /></div>
        <h3>{text(item.itemName, "Nama barang")}</h3>
        <p>{Number(item.quantity) || 0} {text(item.unit, "unit")} · {text(item.location, "Lokasi belum diisi")}</p>
        <div className={styles.metaRow}>
          {String(item.itemCode ?? "") ? <span className={styles.metaChip}>Kode {String(item.itemCode)}</span> : null}
          {String(item.acquisitionYear ?? "") ? <span className={styles.metaChip}>Perolehan {String(item.acquisitionYear)}</span> : null}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cardBody}>
      <div className={styles.cardKicker}>
        <span>{collectionName}</span>
      </div>
      <h3>{text(item.title ?? item.name ?? item.number, "Data")}</h3>
      <p>{excerpt(item.summary ?? item.description ?? item.content, 120)}</p>
    </div>
  );
}

export default function AdminCollectionManager({
  collectionName,
  title,
  description,
  fields,
  defaults = {},
  displayFields: _displayFields = [],
  lockedField,
  lockedValues = [],
  publicHref,
  fixedValues = {},
  filterField,
  filterValue,
  filterMode = "include",
  relatedLinks = [],
  connectionNote,
  autoRecalculate = false,
}: AdminCollectionManagerProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>(defaults);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [notice, setNotice] = useState("");
  const autoRecalculatedRef = useRef(false);

  const isLocked = (item: Record<string, unknown>) =>
    Boolean(lockedField && lockedValues.includes(String(item[lockedField] ?? "")));

  async function refreshLinkedAdministration() {
    if (!RT_LINKED_COLLECTIONS.has(collectionName)) return null;
    const user = auth?.currentUser;
    if (!user) return null;
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/admin/recalculate-administration", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      const json = await response.json() as { result?: { familyMemberCountsUpdated?: number; familyRtLinked?: number; rtStatisticsUpdated?: number; aidRtLinked?: number; umkmRtLinked?: number; inventoryRtLinked?: number; serviceRequestRtLinked?: number } };
      return json.result ?? null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    if (!autoRecalculate || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || autoRecalculatedRef.current) return;
      autoRecalculatedRef.current = true;
      void refreshLinkedAdministration().then((result) => {
        if (result?.rtStatisticsUpdated) {
          setNotice(`Statistik RT otomatis diperbarui pada ${result.rtStatisticsUpdated} RT.`);
        }
      });
    });

    return unsubscribe;
    // Sinkronisasi otomatis cukup sekali ketika halaman dibuka.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRecalculate, collectionName]);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const rows = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Array<Record<string, unknown> & { order?: number }>;

        const scopedRows = filterField && filterValue !== undefined
          ? rows.filter((item) => {
              const matches = String(item[filterField] ?? "").toUpperCase() === String(filterValue).toUpperCase();
              return filterMode === "exclude" ? !matches : matches;
            })
          : rows;

        setItems(sortByOrder(scopedRows));
        setLoading(false);
      },
      (error) => {
        setStatus(error.message || "Gagal memuat data dari Firestore.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [collectionName, filterField, filterValue, filterMode]);

  function exportCsv() {
    if (!EXPORTABLE_COLLECTIONS.has(collectionName)) return;
    const columns = fields.map((field) => ({ key: field.key, label: field.label }));
    const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Makassar" }).format(new Date());
    downloadCsvFile(`${collectionName}-${date}.csv`, items, columns);
    setNotice(`Export ${title} berhasil dibuat (${items.length} data).`);
  }

  function startNew() {
    setEditing(null);
    setForm({ ...defaults, ...fixedValues });
    setStatus("");
    setNotice("");
    setOpen(true);
  }

  function startEdit(item: Record<string, unknown>) {
    setEditing(String(item.id));
    const copy = { ...item, ...fixedValues };

    for (const field of fields) {
      if (field.type === "list" && Array.isArray(copy[field.key])) {
        copy[field.key] = (copy[field.key] as unknown[]).join("\n");
      }
    }

    setForm(copy);
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
      // Field turunan (misalnya statistik RT) dihitung server, bukan disimpan dari form.
      if (field.readOnly) continue;
      let value = form[field.key];

      if (field.type === "number") value = Math.max(0, Number(value) || 0);
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

    Object.assign(payload, fixedValues);

    // Semua field wilayah RT memakai format yang sama (01-13) agar koleksi
    // yang berbeda benar-benar dapat disambungkan dengan Data RT.
    for (const rtField of ["rt", "originRt", "destinationRt"]) {
      if (!(rtField in payload)) continue;
      const raw = String(payload[rtField] ?? "").trim();
      if (!raw) {
        payload[rtField] = "";
        continue;
      }
      const normalized = normalizeRtNumber(raw);
      if (!normalized) {
        setStatus(`${rtField === "rt" ? "RT" : rtField === "originRt" ? "RT Asal" : "RT Tujuan"} harus berada pada RT 01 sampai RT 13.`);
        return;
      }
      payload[rtField] = normalized;
    }

    if (collectionName === "kknPrograms") {
      const startDate = String(payload.startDate ?? "").trim();
      const endDate = String(payload.endDate ?? "").trim();

      if (startDate && endDate && endDate < startDate) {
        setStatus("Tanggal selesai tidak boleh lebih awal dari tanggal mulai.");
        return;
      }

      // Tetap simpan field schedule agar data lama/komponen lain tetap kompatibel.
      if (startDate || endDate) {
        payload.schedule = startDate && endDate ? `${startDate} s.d. ${endDate}` : startDate || endDate;
      }
    }

    if (collectionName === "rts" && "number" in payload) {
      const normalized = normalizeRtNumber(payload.number);

      if (!normalized) {
        setStatus("Nomor RT harus berupa angka positif, contoh 01.");
        return;
      }

      const duplicate = items.find(
        (item) => String(item.id) !== editing && normalizeRtNumber(item.number) === normalized,
      );

      if (duplicate) {
        setStatus(`RT ${normalized} sudah tersedia. Silakan edit data yang sudah ada.`);
        return;
      }

      payload.number = normalized;
      payload.order = Number(normalized);
    }

    if ("slug" in payload) {
      const slugSource = payload.slug || payload.title || payload.name || "";
      const normalizedSlug = slugify(String(slugSource));

      if (!normalizedSlug) {
        setStatus("Slug tidak dapat dibuat. Isi judul atau nama terlebih dahulu.");
        return;
      }

      const duplicateSlug = items.find(
        (item) => String(item.id) !== editing && slugify(String(item.slug ?? "")) === normalizedSlug,
      );

      if (duplicateSlug) {
        setStatus(`Slug “${normalizedSlug}” sudah digunakan. Gunakan judul atau slug lain.`);
        return;
      }

      payload.slug = normalizedSlug;
    }

    if (collectionName === "posts" && payload.status === "published") {
      const now = witaNow();
      if (!String(payload.publishedDate ?? "").trim()) payload.publishedDate = now.date;
      if (!String(payload.publishedTime ?? "").trim()) payload.publishedTime = now.time;
    }

    setSaving(true);

    try {
      if (editing) {
        await updateDoc(doc(db, collectionName, editing), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, collectionName), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      const linked = await refreshLinkedAdministration();
      setOpen(false);
      const linkedMessage = linked
        ? ` Data terkait ikut diselaraskan${linked.familyRtLinked ? `; ${linked.familyRtLinked} KK mengikuti RT penduduk` : ""}${linked.aidRtLinked ? `; ${linked.aidRtLinked} bansos terhubung RT` : ""}${linked.umkmRtLinked ? `; ${linked.umkmRtLinked} UMKM mengikuti NIK pemilik` : ""}${linked.inventoryRtLinked ? `; ${linked.inventoryRtLinked} inventaris mengikuti lokasi fasilitas` : ""}${linked.serviceRequestRtLinked ? `; ${linked.serviceRequestRtLinked} permohonan surat mendapat RT dari NIK` : ""}.`
        : "";
      setNotice((editing ? "Data berhasil diperbarui dan langsung tampil pada website publik." : "Data baru berhasil ditambahkan dan langsung terhubung ke website publik.") + linkedMessage);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!db || !confirm("Hapus data ini? Tindakan ini tidak dapat dibatalkan.")) return;

    setStatus("");
    setNotice("");

    try {
      if (collectionName === "galleryAlbums") {
        const photoSnapshot = await getDocs(
          query(collection(db, "galleryPhotos"), where("albumId", "==", id)),
        );

        const photoDocs = photoSnapshot.docs;
        for (let start = 0; start < photoDocs.length; start += 400) {
          const batch = writeBatch(db);
          photoDocs.slice(start, start + 400).forEach((photoDoc) => batch.delete(photoDoc.ref));
          await batch.commit();
        }
      }

      await deleteDoc(doc(db, collectionName, id));
      const linked = await refreshLinkedAdministration();
      setNotice(
        collectionName === "galleryAlbums"
          ? "Album dan metadata foto terkait berhasil dihapus."
          : `Data berhasil dihapus dari Firestore.${linked ? " Data terkait ikut dihitung ulang." : ""}`,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal menghapus data.");
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
          <span>Data ditampilkan sebagai kartu seperti di website publik. Klik Edit, Hapus, atau Tambah tanpa harus membaca tabel database.</span>
        </div>
        <span>{items.length} data aktif di tampilan admin</span>
      </div>

      {connectionNote || relatedLinks.length ? (
        <div className={styles.connectionBar}>
          <div>
            <strong>Data saling terhubung</strong>
            <span>{connectionNote || "Gunakan halaman terkait untuk melengkapi data yang memiliki hubungan."}</span>
          </div>
          {relatedLinks.length || RT_LINKED_COLLECTIONS.has(collectionName) ? (
            <div className={styles.connectionLinks}>
              {relatedLinks.map((item) => (
                <Link key={item.href} href={item.href} className={styles.connectionLink} title={item.note}>
                  {item.label} →
                </Link>
              ))}
              {RT_LINKED_COLLECTIONS.has(collectionName) ? (
                <button
                  type="button"
                  className={styles.connectionSyncButton}
                  onClick={async () => {
                    setStatus("");
                    const linked = await refreshLinkedAdministration();
                    setNotice(linked ? "Data yang memiliki hubungan RT berhasil diselaraskan: Penduduk, KK, Bansos, UMKM, Fasilitas, Mutasi, Inventaris, Surat, Pengaduan, dan Data RT." : "Sinkronisasi belum dapat dijalankan. Pastikan sesi admin aktif.");
                  }}
                >
                  ↻ Sinkronkan Data
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {notice ? <div className="success-box" style={{ marginTop: 14 }}>{notice}</div> : null}
      {status && !open ? <div className="error-box" style={{ marginTop: 14 }}>{status}</div> : null}

      <section className={styles.previewShell}>
        <div className={styles.previewTopbar}>
          <div className={styles.previewTopbarCopy}>
            <strong>Tampilan konten publik</strong>
            <span>Susunan kartu mengikuti urutan data yang digunakan website.</span>
          </div>
          <div className={styles.previewActions}>
            {EXPORTABLE_COLLECTIONS.has(collectionName) ? (
              <button type="button" className={styles.previewButton} onClick={exportCsv} disabled={loading || items.length === 0}>
                ⇩ Export CSV
              </button>
            ) : null}
            {publicHref ? (
              <Link href={publicHref} target="_blank" className={styles.previewButton}>Lihat Website ↗</Link>
            ) : null}
            <button type="button" className={styles.addButton} onClick={startNew}>＋ Tambah</button>
          </div>
        </div>

        <div className={styles.collectionCanvas}>
          {loading ? (
            <div className={styles.emptyState}><strong>Memuat data…</strong><span>Mengambil data terbaru dari Firestore.</span></div>
          ) : items.length === 0 ? (
            <div className={styles.emptyState}>
              <strong>Belum ada data</strong>
              <span>Klik tombol Tambah untuk membuat konten pertama.</span>
            </div>
          ) : (
            <div className={styles.visualGrid}>
              {items.map((item, index) => (
                <article className={styles.visualCard} key={String(item.id)}>
                  <VisualCardContent collectionName={collectionName} item={item} />
                  <div className={styles.cardActions}>
                    <span className={styles.actionLeft}>Urutan {text(item.order, String(index + 1))}</span>
                    {isLocked(item) ? (
                      <span className={styles.locked}>Dikunci</span>
                    ) : (
                      <div className={styles.actionButtons}>
                        <button type="button" className={styles.editButton} onClick={() => startEdit(item)}>✎ Edit</button>
                        <button type="button" className={styles.deleteButton} onClick={() => void remove(String(item.id))}>Hapus</button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {open ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-label={editing ? `Edit ${title}` : `Tambah ${title}`}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <span>{editing ? "Edit Konten" : "Tambah Konten"}</span>
                <h2>{editing ? "Perbarui Data" : `Tambah ${title}`}</h2>
              </div>
              <button type="button" className={styles.previewButton} onClick={() => setOpen(false)} disabled={saving}>Tutup</button>
            </div>

            <div className={styles.modalBody}>
              <div className="form-columns">
                {fields.map((field) => (
                  <div className={field.full ? "form-group form-span-2" : "form-group"} key={field.key}>
                    <label>
                      {field.label}
                      {field.required ? " *" : ""}
                      {field.readOnly ? " · Otomatis" : ""}
                    </label>

                    {field.type === "textarea" || field.type === "list" ? (
                      <textarea
                        className="form-control"
                        placeholder={field.placeholder}
                        value={String(form[field.key] ?? "")}
                        readOnly={field.readOnly}
                        onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                      />
                    ) : field.type === "select" ? (
                      <select
                        className="form-control"
                        value={String(form[field.key] ?? "")}
                        disabled={field.readOnly}
                        onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                      >
                        <option value="">Pilih</option>
                        {field.options?.map((option) => <option value={option} key={option}>{option}</option>)}
                      </select>
                    ) : field.type === "checkbox" ? (
                      <label className="form-check">
                        <input
                          type="checkbox"
                          checked={Boolean(form[field.key])}
                          disabled={field.readOnly}
                          onChange={(event) => setForm({ ...form, [field.key]: event.target.checked })}
                        />
                        <span>Aktif</span>
                      </label>
                    ) : field.type === "image" ? (
                      <ImageUploader
                        value={String(form[field.key] ?? "")}
                        folder={collectionName}
                        onChange={(url) => setForm({ ...form, [field.key]: url })}
                      />
                    ) : (
                      <input
                        className="form-control"
                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                        min={field.type === "number" ? 0 : undefined}
                        placeholder={field.placeholder}
                        value={String(form[field.key] ?? "")}
                        readOnly={field.readOnly}
                        onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                      />
                    )}
                  </div>
                ))}

                {status ? <div className="error-box form-span-2">{status}</div> : null}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.previewButton} onClick={() => setOpen(false)} disabled={saving}>Batal</button>
              <button type="button" className={styles.addButton} onClick={() => void save()} disabled={saving}>
                {saving ? "Menyimpan…" : editing ? "Simpan Perubahan" : "Tambah Data"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
