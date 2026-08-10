"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { FieldConfig } from "./AdminCollectionManager";
import ImageUploader from "./ImageUploader";

type Props = {
  collectionName: string;
  documentId: string;
  title: string;
  description: string;
  fields: FieldConfig[];
  defaults: Record<string, unknown>;
  publicHref?: string;
};

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  async function save() {
    if (!db || saving) return;

    setStatus("");

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
      setStatus("Perubahan berhasil disimpan dan otomatis tampil di website publik.");
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

      <section className="admin-panel">
        <div className="admin-toolbar">
          <div>
            <strong>Terhubung langsung ke website publik</strong>
            <div className="muted">
              Sumber data: {collectionName}/{documentId}
            </div>
          </div>

          {publicHref ? (
            <Link href={publicHref} target="_blank" className="btn btn-outline">
              Lihat Halaman ↗
            </Link>
          ) : null}
        </div>

        {loading ? (
          <div className="empty-state">Memuat data...</div>
        ) : (
          <div className="form-columns" style={{ marginTop: 20 }}>
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
                      <option key={option} value={option}>
                        {option}
                      </option>
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
                    onChange={(event) => {
                      setForm({ ...form, [field.key]: event.target.value });
                      setStatus("");
                    }}
                  />
                )}
              </div>
            ))}

            {status ? (
              <div
                className={`${/berhasil/i.test(status) ? "success-box" : "error-box"} form-span-2`}
              >
                {status}
              </div>
            ) : null}

            <div className="form-span-2 flex gap-12">
              <button
                className="btn btn-primary"
                onClick={() => void save()}
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>

              {publicHref ? (
                <Link href={publicHref} target="_blank" className="btn btn-outline">
                  Preview Website ↗
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
