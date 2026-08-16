import { NextRequest, NextResponse } from "next/server";
import { listDocuments } from "@/lib/firebase/firestore-rest-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeDate(value: unknown) {
  if (typeof value !== "string") return "";
  return value.slice(0, 10);
}

export async function GET(request: NextRequest) {
  try {
    const expected = process.env.SPREADSHEET_SYNC_SECRET?.trim();
    if (!expected || request.headers.get("x-sync-secret") !== expected) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const type = request.nextUrl.searchParams.get("type");

    if (type === "surat") {
      const docs = (await listDocuments("serviceRequests", 500)).filter((d) => d.source === "website");
      const rows = docs.map((d) => ({
        "ID Surat": d.id,
        "Tanggal Permohonan": safeDate(d.createdAt),
        "Nama Pemohon": String(d.name ?? ""),
        "NIK": String(d.nik ?? ""),
        "RT": String(d.rt ?? ""),
        "Jenis Surat": String(d.letterType ?? ""),
        "Keperluan": String(d.purpose ?? ""),
        "Nomor Surat": String(d.letterNumber ?? ""),
        "Status": String(d.status ?? "Baru"),
        "Petugas": String(d.staff ?? ""),
        "Tanggal Selesai": String(d.completedDate ?? ""),
        "Link Dokumen": String(d.documentUrl ?? ""),
        "Keterangan": String(d.publicNote ?? ""),
      }));
      return NextResponse.json({ ok: true, rows });
    }

    if (type === "pengaduan") {
      const docs = (await listDocuments("complaints", 500)).filter((d) => d.source === "website");
      const rows = docs.map((d) => ({
        "ID Pengaduan": d.id,
        "Tanggal": safeDate(d.createdAt),
        "Nama Pelapor": String(d.name ?? ""),
        "Kontak": String(d.phone ?? ""),
        "RT": String(d.rt ?? ""),
        "Kategori": String(d.category ?? ""),
        "Isi Ringkas": String(d.message ?? ""),
        "Lokasi": String(d.location ?? ""),
        "Status": String(d.status ?? "Baru"),
        "Tindak Lanjut": String(d.followUp ?? ""),
        "Petugas": String(d.staff ?? ""),
        "Tanggal Selesai": String(d.completedDate ?? ""),
        "Keterangan": String(d.publicNote ?? ""),
        "Tampil Statistik Publik": d.showInPublicStats === true ? "Ya" : "Tidak",
      }));
      return NextResponse.json({ ok: true, rows });
    }

    return NextResponse.json({ ok: false, error: "Jenis inbox tidak valid." }, { status: 400 });
  } catch (error) {
    console.error("[spreadsheet-inbox]", error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Gagal membaca inbox." }, { status: 500 });
  }
}
