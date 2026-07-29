"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAdminAuth } from "./AuthProvider";

interface RtForm {
  number: string;
  chairmanName: string;
  phone: string;
  description: string;
  populationCount: number;
  familyCount: number;
}

const empty: RtForm = {
  number: "",
  chairmanName: "",
  phone: "",
  description: "",
  populationCount: 0,
  familyCount: 0,
};

export default function MyRtEditor() {
  const { profile } = useAdminAuth();
  const [form, setForm] = useState<RtForm>(empty);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function load() {
      if (!db || !profile?.rtId) {
        setLoading(false);
        return;
      }
      try {
        const snapshot = await getDoc(doc(db, "rts", profile.rtId));
        if (snapshot.exists()) setForm({ ...empty, ...(snapshot.data() as Partial<RtForm>) });
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [profile?.rtId]);

  async function save() {
    if (!db || !profile?.rtId) return;
    setStatus("");
    try {
      await updateDoc(doc(db, "rts", profile.rtId), {
        chairmanName: form.chairmanName,
        phone: form.phone,
        description: form.description,
        populationCount: Number(form.populationCount) || 0,
        familyCount: Number(form.familyCount) || 0,
        updatedAt: serverTimestamp(),
      });
      setStatus("Data RT berhasil diperbarui.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Data gagal disimpan.");
    }
  }

  if (!profile?.rtId) {
    return <><div className="admin-title"><h1>Data RT Saya</h1><p>Kelola data RT yang ditugaskan kepada akun operator.</p></div><div className="error-box">Akun ini belum memiliki rtId. Superadmin perlu mengisi ID dokumen RT pada menu Pengguna Admin.</div></>;
  }

  return (
    <>
      <div className="admin-title"><h1>Data RT Saya</h1><p>Operator hanya dapat memperbarui data RT yang terhubung dengan akunnya.</p></div>
      <section className="admin-panel">
        {loading ? <div className="empty-state">Memuat data RT...</div> : (
          <div className="form-columns">
            <div className="form-group"><label>Nomor RT</label><input className="form-control" value={form.number} disabled /></div>
            <div className="form-group"><label>Nama Ketua RT</label><input className="form-control" value={form.chairmanName} onChange={(event) => setForm({ ...form, chairmanName: event.target.value })} /></div>
            <div className="form-group"><label>Nomor Kontak</label><input className="form-control" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></div>
            <div className="form-group"><label>Jumlah Penduduk</label><input className="form-control" type="number" value={form.populationCount} onChange={(event) => setForm({ ...form, populationCount: Number(event.target.value) })} /></div>
            <div className="form-group"><label>Jumlah Kepala Keluarga</label><input className="form-control" type="number" value={form.familyCount} onChange={(event) => setForm({ ...form, familyCount: Number(event.target.value) })} /></div>
            <div className="form-group form-span-2"><label>Deskripsi Wilayah</label><textarea className="form-control" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
            {status ? <div className={`${status.includes("berhasil") ? "success-box" : "error-box"} form-span-2`}>{status}</div> : null}
            <div className="form-span-2"><button className="btn btn-primary" onClick={() => void save()}>Simpan Data RT</button></div>
          </div>
        )}
      </section>
    </>
  );
}
