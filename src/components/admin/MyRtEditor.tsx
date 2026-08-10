"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAdminAuth } from "./AuthProvider";
import ImageUploader from "./ImageUploader";

interface RtForm {
  number: string;
  chairmanName: string;
  phone: string;
  photoUrl: string;
  area: string;
  description: string;
  populationCount: number;
  familyCount: number;
  maleCount: number;
  femaleCount: number;
  houseCount: number;
  toddlerCount: number;
  elderlyCount: number;
  facilities: string[];
}

const empty: RtForm = {
  number: "",
  chairmanName: "",
  phone: "",
  photoUrl: "",
  area: "",
  description: "",
  populationCount: 0,
  familyCount: 0,
  maleCount: 0,
  femaleCount: 0,
  houseCount: 0,
  toddlerCount: 0,
  elderlyCount: 0,
  facilities: [],
};

export default function MyRtEditor() {
  const { profile } = useAdminAuth();
  const [form, setForm] = useState<RtForm>(empty);
  const [facilitiesText, setFacilitiesText] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!db || !profile?.rtId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      doc(db, "rts", profile.rtId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<RtForm>;
          const nextForm = {
            ...empty,
            ...data,
            facilities: Array.isArray(data.facilities) ? data.facilities : [],
          };

          setForm(nextForm);
          setFacilitiesText(nextForm.facilities.join("\n"));
        }

        setLoading(false);
      },
      (error) => {
        setStatus(error.message || "Gagal memuat data RT.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [profile?.rtId]);

  function updateNumberField(
    key:
      | "populationCount"
      | "familyCount"
      | "maleCount"
      | "femaleCount"
      | "houseCount"
      | "toddlerCount"
      | "elderlyCount",
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [key]: Number(value) || 0,
    }));
  }

  async function save() {
    if (!db || !profile?.rtId) return;

    setStatus("");

    const facilities = facilitiesText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await updateDoc(doc(db, "rts", profile.rtId), {
        chairmanName: form.chairmanName,
        photoUrl: form.photoUrl,
        phone: form.phone,
        area: form.area,
        description: form.description,
        populationCount: Number(form.populationCount) || 0,
        familyCount: Number(form.familyCount) || 0,
        maleCount: Number(form.maleCount) || 0,
        femaleCount: Number(form.femaleCount) || 0,
        houseCount: Number(form.houseCount) || 0,
        toddlerCount: Number(form.toddlerCount) || 0,
        elderlyCount: Number(form.elderlyCount) || 0,
        facilities,
        updatedAt: serverTimestamp(),
      });

      setForm((current) => ({ ...current, facilities }));
      setStatus("Data RT berhasil diperbarui.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Data gagal disimpan.",
      );
    }
  }

  if (!profile?.rtId) {
    return (
      <>
        <div className="admin-title">
          <h1>Data RT Saya</h1>
          <p>Kelola data RT yang ditugaskan kepada akun operator.</p>
        </div>
        <div className="error-box">
          Akun ini belum memiliki rtId. Superadmin perlu mengisi ID dokumen RT
          pada menu Pengguna Admin.
        </div>
      </>
    );
  }

  return (
    <>
      <div className="admin-title">
        <h1>Data RT Saya</h1>
        <p>
          Operator dapat memperbarui data publik RT yang terhubung dengan
          akunnya. Hindari memasukkan data pribadi warga satu per satu.
        </p>
      </div>

      <section className="admin-panel">
        {loading ? (
          <div className="empty-state">Memuat data RT...</div>
        ) : (
          <div className="form-columns">
            <div className="form-group">
              <label>Nomor RT</label>
              <input className="form-control" value={form.number} disabled />
            </div>

            <div className="form-group">
              <label>Nama Ketua RT</label>
              <input
                className="form-control"
                value={form.chairmanName}
                onChange={(event) =>
                  setForm({ ...form, chairmanName: event.target.value })
                }
              />
            </div>

            <div className="form-group form-span-2">
              <label>Foto Ketua RT</label>
              <ImageUploader
                value={form.photoUrl}
                folder="rts"
                onChange={(url) => setForm({ ...form, photoUrl: url })}
              />
            </div>

            <div className="form-group">
              <label>Nomor Kontak</label>
              <input
                className="form-control"
                value={form.phone}
                placeholder="08xxxxxxxxxx"
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
              />
            </div>

            <div className="form-group form-span-2">
              <label>Alamat / Area RT</label>
              <input
                className="form-control"
                value={form.area}
                placeholder="Contoh: Jl. Balikpapan-Handil II dan sekitarnya"
                onChange={(event) =>
                  setForm({ ...form, area: event.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Jumlah Penduduk</label>
              <input
                className="form-control"
                type="number"
                min="0"
                value={form.populationCount}
                onChange={(event) =>
                  updateNumberField("populationCount", event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Jumlah Kepala Keluarga</label>
              <input
                className="form-control"
                type="number"
                min="0"
                value={form.familyCount}
                onChange={(event) =>
                  updateNumberField("familyCount", event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Jumlah Laki-laki</label>
              <input
                className="form-control"
                type="number"
                min="0"
                value={form.maleCount}
                onChange={(event) =>
                  updateNumberField("maleCount", event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Jumlah Perempuan</label>
              <input
                className="form-control"
                type="number"
                min="0"
                value={form.femaleCount}
                onChange={(event) =>
                  updateNumberField("femaleCount", event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Jumlah Rumah</label>
              <input
                className="form-control"
                type="number"
                min="0"
                value={form.houseCount}
                onChange={(event) =>
                  updateNumberField("houseCount", event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Jumlah Balita</label>
              <input
                className="form-control"
                type="number"
                min="0"
                value={form.toddlerCount}
                onChange={(event) =>
                  updateNumberField("toddlerCount", event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Jumlah Lansia</label>
              <input
                className="form-control"
                type="number"
                min="0"
                value={form.elderlyCount}
                onChange={(event) =>
                  updateNumberField("elderlyCount", event.target.value)
                }
              />
            </div>

            <div className="form-group form-span-2">
              <label>Fasilitas Utama RT</label>
              <textarea
                className="form-control"
                value={facilitiesText}
                placeholder={"Tulis satu fasilitas per baris, contoh:\nPosyandu\nMusala\nLapangan"}
                onChange={(event) => setFacilitiesText(event.target.value)}
              />
            </div>

            <div className="form-group form-span-2">
              <label>Keterangan Wilayah</label>
              <textarea
                className="form-control"
                value={form.description}
                placeholder="Tuliskan gambaran singkat wilayah RT."
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              />
            </div>

            {status ? (
              <div
                className={`${
                  status.includes("berhasil") ? "success-box" : "error-box"
                } form-span-2`}
              >
                {status}
              </div>
            ) : null}

            <div className="form-span-2">
              <button
                className="btn btn-primary"
                onClick={() => void save()}
              >
                Simpan Data RT
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
