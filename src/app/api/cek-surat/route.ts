import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = String(url.searchParams.get("id") ?? "").trim().toUpperCase().slice(0, 40);
  if (!/^SR-[A-Z0-9-]+$/.test(id)) {
    return NextResponse.json({ error: "Nomor permohonan tidak valid." }, { status: 400 });
  }
  const snap = await getAdminDb().collection("serviceRequests").doc(id).get();
  if (!snap.exists) return NextResponse.json({ error: "Permohonan tidak ditemukan." }, { status: 404 });
  const data = snap.data() ?? {};
  return NextResponse.json({
    ok: true,
    ticketId: id,
    letterType: String(data.letterType ?? ""),
    status: String(data.status ?? "Baru"),
    letterNumber: String(data.letterNumber ?? ""),
    note: String(data.publicNote ?? ""),
    completedDate: String(data.completedDate ?? ""),
    verificationUrl: data.isPublicVerification ? String(data.verificationUrl ?? "") : "",
  });
}
