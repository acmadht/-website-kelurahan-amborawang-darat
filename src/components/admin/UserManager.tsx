"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { RegionLeader } from "@/types";
import { useAdminAuth } from "./AuthProvider";

type AdminProfileRow = {
  uid: string;
  name: string;
  email: string;
  role: "superadmin" | "editor" | "operator_rt";
  rtId?: string | null;
  isActive: boolean;
  password?: string;
};

const emptyForm: AdminProfileRow = {
  uid: "",
  name: "",
  email: "",
  role: "editor",
  rtId: null,
  isActive: true,
  password: "",
};

export default function UserManager() {
  const { user: currentUser, profile } = useAdminAuth();
  const [users, setUsers] = useState<AdminProfileRow[]>([]);
  const [rts, setRts] = useState<RegionLeader[]>([]);
  const [form, setForm] = useState<AdminProfileRow>(emptyForm);
  const [editingUid, setEditingUid] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!db || profile?.role !== "superadmin") return;

    const unsubscribeUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const rows = snapshot.docs
          .map(
            (item) =>
              ({
                uid: item.id,
                ...item.data(),
              }) as AdminProfileRow,
          )
          .sort((a, b) => a.name.localeCompare(b.name, "id"));
        setUsers(rows);
      },
      (error) => setStatus(error.message || "Gagal memuat pengguna admin."),
    );

    const unsubscribeRts = onSnapshot(collection(db, "rts"), (snapshot) => {
      const rows = snapshot.docs
        .map(
          (item) => ({ id: item.id, ...item.data() }) as RegionLeader,
        )
        .filter((item) => item.isActive !== false)
        .sort((a, b) => Number(a.number) - Number(b.number));
      setRts(rows);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeRts();
    };
  }, [profile?.role]);

  const rtLabelById = useMemo(
    () =>
      new Map(
        rts
          .filter((item) => item.id)
          .map((item) => [String(item.id), `RT ${item.number}`]),
      ),
    [rts],
  );

  function resetForm() {
    setForm(emptyForm);
    setEditingUid("");
    setStatus("");
  }

  function editUser(item: AdminProfileRow) {
    setEditingUid(item.uid);
    setForm({
      uid: item.uid,
      name: item.name || "",
      email: item.email || "",
      role: item.role || "editor",
      rtId: item.rtId || null,
      isActive: item.isActive !== false,
      password: "",
    });
    setStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save() {
    if (!currentUser || saving) return;

    const uid = form.uid.trim();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = String(form.password || "");

    if (!name || !email) {
      setStatus("Nama dan email wajib diisi.");
      return;
    }

    if (!editingUid && password.length < 6) {
      setStatus("Password akun baru minimal 6 karakter.");
      return;
    }

    if (editingUid && !uid) {
      setStatus("UID pengguna tidak ditemukan.");
      return;
    }

    if (form.role === "operator_rt" && !form.rtId) {
      setStatus("Operator RT wajib dihubungkan ke salah satu RT.");
      return;
    }

    if (editingUid === currentUser.uid && (!form.isActive || form.role !== "superadmin")) {
      setStatus("Akun superadmin yang sedang digunakan harus tetap aktif sebagai superadmin.");
      return;
    }

    setSaving(true);
    setStatus("");

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch("/api/admin/users", {
        method: editingUid ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: editingUid || undefined,
          name,
          email,
          password: password || undefined,
          role: form.role,
          rtId: form.role === "operator_rt" ? form.rtId || null : null,
          isActive: form.isActive,
        }),
      });

      const result = (await response.json()) as { error?: string; uid?: string };
      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan pengguna.");
      }

      const savedUid = result.uid || editingUid;
      setEditingUid(savedUid);
      setForm((current) => ({
        ...current,
        uid: savedUid,
        name,
        email,
        password: "",
      }));
      setStatus(
        editingUid
          ? "Pengguna berhasil diperbarui. Hak akses sudah disinkronkan dengan Firebase Authentication."
          : "Pengguna berhasil dibuat dan langsung dapat digunakan untuk login.",
      );
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan pengguna.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeProfile(item: AdminProfileRow) {
    if (item.uid === currentUser?.uid) {
      setStatus("Akun yang sedang digunakan tidak dapat dihapus.");
      return;
    }

    if (
      !currentUser ||
      !confirm(
        `Hapus akun ${item.name || item.email}? Akun Firebase Authentication dan profil admin akan dihapus.`,
      )
    ) {
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid: item.uid }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Gagal menghapus pengguna.");

      if (editingUid === item.uid) resetForm();
      setStatus("Pengguna berhasil dihapus dari Firebase Authentication dan dashboard.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gagal menghapus pengguna.");
    }
  }

  if (profile?.role !== "superadmin") {
    return (
      <>
        <div className="admin-title">
          <h1>Pengguna Admin</h1>
          <p>Menu ini hanya tersedia untuk Super Admin.</p>
        </div>
        <div className="error-box">Akses ditolak.</div>
      </>
    );
  }

  return (
    <>
      <div className="admin-title">
        <h1>Pengguna Admin</h1>
        <p>
          Kelola profil, peran, status aktif, dan penugasan operator RT yang
          terhubung dengan Firebase Authentication.
        </p>
      </div>

      <section className="admin-panel">
        <div className="demo-box">
          Superadmin dapat membuat, mengubah, menonaktifkan, dan menghapus akun
          langsung dari dashboard. Password hanya dikirim ke Firebase Authentication
          dan tidak disimpan pada dokumen Firestore.
        </div>

        <div className="form-columns" style={{ marginTop: 20 }}>
          {editingUid ? (
            <div className="form-group form-span-2">
              <label>UID Firebase Authentication</label>
              <input
                className="form-control"
                value={form.uid}
                disabled
              />
            </div>
          ) : null}

          <div className="form-group">
            <label>Nama *</label>
            <input
              className="form-control"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              className="form-control"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </div>

          <div className="form-group">
            <label>{editingUid ? "Password Baru (opsional)" : "Password *"}</label>
            <input
              className="form-control"
              type="password"
              value={form.password || ""}
              minLength={6}
              placeholder={editingUid ? "Kosongkan jika tidak diubah" : "Minimal 6 karakter"}
              autoComplete="new-password"
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Peran</label>
            <select
              className="form-control"
              value={form.role}
              onChange={(event) =>
                setForm({
                  ...form,
                  role: event.target.value as AdminProfileRow["role"],
                  rtId:
                    event.target.value === "operator_rt" ? form.rtId : null,
                })
              }
            >
              <option value="superadmin">Super Admin</option>
              <option value="editor">Editor Kelurahan</option>
              <option value="operator_rt">Operator RT</option>
            </select>
          </div>

          <div className="form-group">
            <label>Penugasan RT</label>
            <select
              className="form-control"
              value={form.rtId || ""}
              disabled={form.role !== "operator_rt"}
              onChange={(event) =>
                setForm({ ...form, rtId: event.target.value || null })
              }
            >
              <option value="">Pilih RT</option>
              {rts.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  RT {rt.number} {rt.chairmanName ? `— ${rt.chairmanName}` : ""}
                </option>
              ))}
            </select>
          </div>

          <label className="form-check form-span-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm({ ...form, isActive: event.target.checked })
              }
            />
            <span>Akun aktif</span>
          </label>

          {status ? <div className="demo-box form-span-2">{status}</div> : null}

          <div className="form-span-2 flex gap-12">
            <button
              className="btn btn-primary"
              onClick={() => void save()}
              disabled={saving}
            >
              {saving
                ? "Menyimpan..."
                : editingUid
                  ? "Simpan Perubahan"
                  : "Buat Pengguna"}
            </button>
            {editingUid ? (
              <button className="btn btn-outline" onClick={resetForm}>
                Tambah Pengguna Lain
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-toolbar">
          <div>
            <strong>{users.length} profil pengguna</strong>
            <div className="muted">Data hak akses tersimpan di koleksi users.</div>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">Belum ada profil pengguna.</div>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Peran</th>
                  <th>RT</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.uid}>
                    <td>{item.name || "-"}</td>
                    <td>{item.email || "-"}</td>
                    <td>{item.role}</td>
                    <td>{item.rtId ? rtLabelById.get(item.rtId) || "RT tidak ditemukan" : "-"}</td>
                    <td>{item.isActive !== false ? "Aktif" : "Nonaktif"}</td>
                    <td>
                      <div className="flex gap-8">
                        <button
                          className="btn btn-outline btn-small"
                          onClick={() => editUser(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => void removeProfile(item)}
                          disabled={item.uid === currentUser?.uid}
                          title={item.uid === currentUser?.uid ? "Akun yang sedang digunakan tidak dapat dihapus" : undefined}
                        >
                          Hapus Akun
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
