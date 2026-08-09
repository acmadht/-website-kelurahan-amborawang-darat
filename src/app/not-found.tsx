"use client";

import Link from "next/link";
import PublicShell from "@/components/public/PublicShell";
import PageHero from "@/components/public/PageHero";

export default function NotFound() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="404"
        title="Halaman Tidak Ditemukan"
        description="Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan."
      />
      <section className="section section-white">
        <div className="container" style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ marginBottom: "30px", fontSize: "1.1rem", color: "#666" }}>
            Halaman mungkin telah dihapus, berganti nama, atau sedang tidak tersedia untuk sementara waktu.
          </p>
          <Link href="/" className="btn btn-primary">
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
