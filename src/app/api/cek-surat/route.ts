import { NextResponse } from "next/server";
import { getDocument } from "@/lib/firebase/firestore-rest-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = String(url.searchParams.get("id") ?? "").trim().toUpperCase().slice(0, 40);
    if (!/^SR-[A-Z0-9-]+$/.test(id)) {
      return NextResponse.json({ error: "Nomor permohonan tidak valid." }, { status: 400 });
    }
    const data = await getDocument("serviceRequests", id);
    if (!data) return NextResponse.json({ error: "Permohonan tidak ditemukan." }, { status: 404 });
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
  } catch (error) {
    console.error("[cek-surat]", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal membaca permohonan." }, { status: 500 });
  }
}
