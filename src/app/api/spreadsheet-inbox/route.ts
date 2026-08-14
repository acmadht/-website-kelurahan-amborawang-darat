import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeDate(value: unknown) {
  if (!value || typeof value !== "object") return "";
  const maybe = value as { toDate?: () => Date };
  try { return maybe.toDate?.().toISOString().slice(0, 10) ?? ""; } catch { return ""; }
}

export async function GET(request: NextRequest) {
  const expected = process.env.SPREADSHEET_SYNC_SECRET?.trim();
  if (!expected || request.headers.get("x-sync-secret") !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const type = request.nextUrl.searchParams.get("type");
  const db = getAdminDb();

  if (type === "surat") {
    const snap = await db.collection("serviceRequests").where("source", "==", "website").limit(500).get();
    const rows = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        "ID Surat": doc.id,
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
      };
    });
    return NextResponse.json({ ok: true, rows });
  }

  if (type === "pengaduan") {
    const snap = await db.collection("complaints").where("source", "==", "website").limit(500).get();
    const rows = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        "ID Pengaduan": doc.id,
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
      };
    });
    return NextResponse.json({ ok: true, rows });
  }

  return NextResponse.json({ ok: false, error: "Jenis inbox tidak valid." }, { status: 400 });
}
