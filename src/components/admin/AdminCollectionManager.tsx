"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { slugify, sortByOrder } from "@/lib/utils";
import ImageUploader from "./ImageUploader";

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
}

function normalizeRtNumber(value: unknown) {
  const numeric = Number(String(value ?? "").replace(/\D/g, ""));
  if (!numeric || numeric < 1 || numeric > 13) return "";
  return String(numeric).padStart(2, "0");
}

export default function AdminCollectionManager({
  collectionName,
  title,
  description,
  fields,
  defaults = {},
  displayFields = [],
  lockedField,
  lockedValues = [],
  publicHref,
}: AdminCollectionManagerProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>(defaults);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [notice, setNotice] = useState("");

  const labels = useMemo(
    () => Object.fromEntries(fields.map((field) => [field.key, field.label])),
    [fields],
  );

  const isLocked = (item: Record<string, unknown>) =>
    Boolean(
      lockedField && lockedValues.includes(String(item[lockedField] ?? "")),
    );

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

        setItems(sortByOrder(rows));
        setLoading(false);
      },
      (error) => {
        setStatus(error.message || "Gagal memuat data dari Firestore.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [collectionName]);

  function startNew() {
    setEditing(null);
    setForm({ ...defaults });
    setStatus("");
    setNotice("");
    setOpen(true);
  }

  function startEdit(item: Record<string, unknown>) {
    setEditing(String(item.id));
    const copy = { ...item };

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
      let value = form[field.key];

      if (field.type === "number") value = Math.max(0, Number(value) || 0);
      if (field.type === "checkbox") value = Boolean(value);
      if (field.type === "list") {
        value = String(value ?? "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      payload[field.key] = value;
    }

    if (collectionName === "rts" && "number" in payload) {
      const normalized = normalizeRtNumber(payload.number);

      if (!normalized) {
        setStatus("Nomor RT harus berada pada rentang RT 01 sampai RT 13.");
        return;
      }

      const duplicate = items.find(
        (item) =>
          String(item.id) !== editing &&
          normalizeRtNumber(item.number) === normalized,
      );

      if (duplicate) {
        setStatus(`RT ${normalized} sudah tersedia. Silakan edit data yang sudah ada.`);
        return;
      }

      payload.number = normalized;
      payload.order = Number(normalized);
    }

    if ("slug" in payload && !payload.slug && payload.title) {
      payload.slug = slugify(String(payload.title));
    }

    if ("slug" in payload && !payload.slug && payload.name) {
      payload.slug = slugify(String(payload.name));
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

      setOpen(false);
      setNotice("Perubahan tersimpan dan otomatis diteruskan ke website publik.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Gagal menyimpan data.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (
      !db ||
      !confirm("Hapus data ini? Tindakan ini tidak dapat dibatalkan.")
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, collectionName, id));
      setNotice("Data berhasil dihapus dari Firestore.");
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

      {notice ? <div className="success-box">{notice}</div> : null}
      {status && !open ? <div className="error-box">{status}</div> : null}

      <section className="admin-panel">
        <div className="admin-toolbar">
          <div>
            <strong>{items.length} data</strong>
            <div className="muted">
              Admin dan website publik membaca koleksi Firestore yang sama.
            </div>
          </div>

          <div className="flex gap-8">
            {publicHref ? (
              <Link href={publicHref} target="_blank" className="btn btn-outline">
                Lihat Halaman ↗
              </Link>
            ) : null}
            <button className="btn btn-primary" onClick={startNew}>
              Tambah Data
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Memuat data...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">Belum ada data.</div>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {displayFields.map((key) => (
                    <th key={key}>{labels[key] ?? key}</th>
                  ))}
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={String(item.id)}>
                    {displayFields.map((key) => (
                      <td key={key}>
                        {typeof item[key] === "boolean"
                          ? item[key]
                            ? "Aktif"
                            : "Tidak"
                          : String(item[key] ?? "-")}
                      </td>
                    ))}

                    <td>
                      {isLocked(item) ? (
                        <span className="badge">Dikunci</span>
                      ) : (
                        <div className="flex gap-8">
                          <button
                            className="btn btn-outline btn-small"
                            onClick={() => startEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-small"
                            onClick={() => void remove(String(item.id))}
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {open ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <h2>{editing ? "Edit Data" : "Tambah Data"}</h2>
              <button
                className="btn btn-outline btn-small"
                onClick={() => setOpen(false)}
              >
                Tutup
              </button>
            </div>

            <div className="form-columns">
              {fields.map((field) => (
                <div
                  className={field.full ? "form-group form-span-2" : "form-group"}
                  key={field.key}
                >
                  <label>
                    {field.label}
                    {field.required ? " *" : ""}
                  </label>

                  {field.type === "textarea" || field.type === "list" ? (
                    <textarea
                      className="form-control"
                      placeholder={field.placeholder}
                      value={String(form[field.key] ?? "")}
                      onChange={(event) =>
                        setForm({ ...form, [field.key]: event.target.value })
                      }
                    />
                  ) : field.type === "select" ? (
                    <select
                      className="form-control"
                      value={String(form[field.key] ?? "")}
                      onChange={(event) =>
                        setForm({ ...form, [field.key]: event.target.value })
                      }
                    >
                      <option value="">Pilih</option>
                      {field.options?.map((option) => (
                        <option value={option} key={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "checkbox" ? (
                    <label className="form-check">
                      <input
                        type="checkbox"
                        checked={Boolean(form[field.key])}
                        onChange={(event) =>
                          setForm({ ...form, [field.key]: event.target.checked })
                        }
                      />
                      <span>Aktif</span>
                    </label>
                  ) : field.type === "image" ? (
                    <ImageUploader
                      value={String(form[field.key] ?? "")}
                      folder={collectionName}
                      onChange={(url) =>
                        setForm({ ...form, [field.key]: url })
                      }
                    />
                  ) : (
                    <input
                      className="form-control"
                      type={
                        field.type === "number"
                          ? "number"
                          : field.type === "date"
                            ? "date"
                            : "text"
                      }
                      min={field.type === "number" ? 0 : undefined}
                      placeholder={field.placeholder}
                      value={String(form[field.key] ?? "")}
                      onChange={(event) =>
                        setForm({ ...form, [field.key]: event.target.value })
                      }
                    />
                  )}
                </div>
              ))}

              {status ? (
                <div className="error-box form-span-2">{status}</div>
              ) : null}

              <div className="form-span-2 flex gap-12">
                <button
                  className="btn btn-primary"
                  onClick={() => void save()}
                  disabled={saving}
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => setOpen(false)}
                  disabled={saving}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
