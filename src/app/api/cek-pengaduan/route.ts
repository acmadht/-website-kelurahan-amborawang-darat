import { NextResponse } from "next/server";
import { getDocument } from "@/lib/firebase/firestore-rest-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = String(url.searchParams.get("id") ?? "").trim().toUpperCase().slice(0, 40);
    if (!/^PG-[A-Z0-9-]+$/.test(id)) return NextResponse.json({ error: "Nomor tiket tidak valid." }, { status: 400 });
    const data = await getDocument("complaints", id);
    if (!data) return NextResponse.json({ error: "Pengaduan tidak ditemukan." }, { status: 404 });
    return NextResponse.json({
      ok: true,
      ticketId: id,
      category: String(data.category ?? ""),
      status: String(data.status ?? "Baru"),
      publicNote: String(data.publicNote ?? ""),
      completedDate: String(data.completedDate ?? ""),
    });
  } catch (error) {
    console.error("[cek-pengaduan]", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal membaca pengaduan." }, { status: 500 });
  }
}
