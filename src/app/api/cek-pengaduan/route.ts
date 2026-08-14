import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = String(url.searchParams.get("id") ?? "").trim().toUpperCase().slice(0, 40);
  if (!/^PG-[A-Z0-9-]+$/.test(id)) return NextResponse.json({ error: "Nomor tiket tidak valid." }, { status: 400 });
  const snap = await getAdminDb().collection("complaints").doc(id).get();
  if (!snap.exists) return NextResponse.json({ error: "Pengaduan tidak ditemukan." }, { status: 404 });
  const data = snap.data() ?? {};
  return NextResponse.json({
    ok: true, ticketId: id,
    category: String(data.category ?? ""),
    status: String(data.status ?? "Baru"),
    publicNote: String(data.publicNote ?? ""),
    completedDate: String(data.completedDate ?? ""),
  });
}
