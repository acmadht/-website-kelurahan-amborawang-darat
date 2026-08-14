import type { Metadata } from "next";
import Link from "next/link";
import { getAdminDb } from "@/lib/firebase/admin";
import styles from "@/components/public/PublicServicePortal.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verifikasi Surat | Kelurahan Amborawang Darat",
  description: "Verifikasi keabsahan status surat Kelurahan Amborawang Darat melalui nomor tiket.",
};

type Props = { params: Promise<{ id: string }> };

export default async function VerificationPage({ params }: Props) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId || "").trim().toUpperCase().slice(0, 40);
  let data: Record<string, unknown> | null = null;
  if (/^SR-[A-Z0-9-]+$/.test(id)) {
    const snap = await getAdminDb().collection("serviceRequests").doc(id).get();
    if (snap.exists) data = (snap.data() || {}) as Record<string, unknown>;
  }

  const publicAllowed = Boolean(data?.isPublicVerification);
  const valid = Boolean(data && publicAllowed);
  const value = (key: string) => String(data?.[key] ?? "");

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div>
            <span className={styles.eyebrow}>Verifikasi Dokumen</span>
            <h1>Verifikasi Surat</h1>
            <p>Halaman ini hanya menampilkan informasi minimum untuk memastikan nomor surat tercatat pada sistem Kelurahan Amborawang Darat.</p>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className="container">
          <div className={styles.card} style={{ maxWidth: 760, margin: "0 auto" }}>
            {!valid ? (
              <>
                <h2>Dokumen tidak dapat diverifikasi</h2>
                <div className={`${styles.notice} ${styles.error}`}>Nomor tiket tidak ditemukan atau dokumen belum diizinkan untuk verifikasi publik.</div>
                <div className={styles.actions} style={{ marginTop: 18 }}>
                  <Link className={styles.button} href="/cek-surat">Cek status permohonan</Link>
                </div>
              </>
            ) : (
              <>
                <h2>Dokumen tercatat</h2>
                <div className={`${styles.notice} ${styles.success}`}>Data surat ditemukan pada sistem administrasi kelurahan.</div>
                <div className={styles.statusBox}>
                  <div className={styles.statusRow}><span>ID verifikasi</span><strong>{id}</strong></div>
                  <div className={styles.statusRow}><span>Jenis surat</span><strong>{value("letterType") || "-"}</strong></div>
                  <div className={styles.statusRow}><span>Nomor surat</span><strong>{value("letterNumber") || "-"}</strong></div>
                  <div className={styles.statusRow}><span>Status</span><strong>{value("status") || "-"}</strong></div>
                  <div className={styles.statusRow}><span>Tanggal selesai</span><strong>{value("completedDate") || "-"}</strong></div>
                </div>
                <p className={styles.privacy}>Halaman verifikasi sengaja tidak menampilkan NIK, No. KK, alamat, nomor telepon, atau data pribadi pemohon.</p>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
