"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { demoSettings } from "@/data/demo";
import { useDocumentData } from "@/hooks/useFirestoreData";
import { db } from "@/lib/firebase/client";
import type { SiteSettings } from "@/types";
import PageHero from "./PageHero";
import PublicShell from "./PublicShell";

export default function ContactPage() {
  const { data } = useDocumentData<SiteSettings>(
    "siteSettings",
    "main",
    demoSettings,
  );

  const [form, setForm] = useState({
    name: "",
    contact: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  async function submit() {
    if (!form.name || !form.contact || !form.message) {
      setStatus("Lengkapi nama, kontak, dan pesan.");
      return;
    }

    if (!db) {
      setStatus(
        "Firebase belum dikonfigurasi. Gunakan WhatsApp atau email resmi.",
      );
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        ...form,
        status: "baru",
        createdAt: serverTimestamp(),
      });

      setForm({
        name: "",
        contact: "",
        message: "",
      });

      setStatus("Pesan berhasil dikirim.");
    } catch {
      setStatus("Pesan gagal dikirim. Silakan gunakan WhatsApp.");
    }
  }

  return (
    <PublicShell>
      <PageHero
        eyebrow="Kontak"
        title="Hubungi kantor kelurahan"
        description="Kontak resmi, jam pelayanan, lokasi kantor, dan formulir pesan masyarakat."
      />

      <section className="section">
        <div className="container contact-grid">
          <div>
            <div className="contact-list">
              {[
                ["Alamat", data.address],
                ["Telepon", data.phone],
                ["WhatsApp", data.whatsapp],
                ["Email", data.email],
                ["Jam Pelayanan", data.serviceHours],
              ].map(([label, value]) => (
                <div className="contact-item" key={label}>
                  <div className="icon-box">{label.slice(0, 2)}</div>

                  <div>
                    <strong>{label}</strong>
                    <div className="muted">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              alignSelf: "start",
              overflow: "hidden",
              border: "1px solid #d7e3f2",
              borderRadius: 24,
              background: "#ffffff",
              boxShadow: "0 12px 32px rgba(7, 26, 61, 0.08)",
            }}
          >
            <div
              style={{
                padding: "24px 26px 20px",
                borderBottom: "1px solid #dfe9f4",
                background: "#ffffff",
                color: "#071a3d",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 10,
                  color: "#176bce",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 22,
                    height: 2,
                    borderRadius: 999,
                    background: "#176bce",
                  }}
                />

                Peta Lokasi
              </div>

              <h2
                style={{
                  margin: 0,
                  color: "#071a3d",
                  fontSize: "clamp(1.45rem, 2.7vw, 2rem)",
                  lineHeight: 1.2,
                }}
              >
                Lokasi Kantor Kelurahan
              </h2>

              <p
                style={{
                  margin: "9px 0 0",
                  color: "#5b6472",
                  fontSize: 15,
                  lineHeight: 1.65,
                }}
              >
                Temukan Kantor Kelurahan Amborawang Darat melalui peta berikut.
              </p>
            </div>

            <div
              style={{
                padding: 20,
                background: "#eef6ff",
              }}
            >
              {data.mapsEmbedUrl ? (
                <iframe
                  src={data.mapsEmbedUrl}
                  title="Peta Kantor Kelurahan Amborawang Darat"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{
                    display: "block",
                    width: "100%",
                    height: 360,
                    border: 0,
                    borderRadius: 16,
                    background: "#ffffff",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "grid",
                    minHeight: 260,
                    placeItems: "center",
                    padding: 24,
                    borderRadius: 16,
                    background: "#ffffff",
                    color: "#5b6472",
                    textAlign: "center",
                  }}
                >
                  URL embed Google Maps belum dipasang.
                </div>
              )}
            </div>
          </div>

          <div
            className="content-card"
            style={{
              gridColumn: "1 / -1",
            }}
          >
            <h2>Kirim pesan</h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="contact-name">Nama</label>

                <input
                  id="contact-name"
                  className="form-control"
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-address">
                  Nomor HP atau email
                </label>

                <input
                  id="contact-address"
                  className="form-control"
                  value={form.contact}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      contact: event.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Pesan</label>

                <textarea
                  id="contact-message"
                  className="form-control"
                  value={form.message}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      message: event.target.value,
                    })
                  }
                />
              </div>

              {status ? (
                <div className="demo-box" role="status">
                  {status}
                </div>
              ) : null}

              <button
                className="btn btn-primary"
                type="button"
                onClick={submit}
              >
                Kirim Pesan
              </button>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}