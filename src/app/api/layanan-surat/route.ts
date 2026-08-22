import { NextResponse } from "next/server";
import { setDocument } from "@/lib/firebase/firestore-rest-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

function ticket(prefix: string) {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (clean(body.website, 120)) return NextResponse.json({ ok: true });

    const name = clean(body.name, 120);
    const nik = clean(body.nik, 24).replace(/\D/g, "");
    const kk = clean(body.kk, 24).replace(/\D/g, "");
    const rtDigits = clean(body.rt, 4).replace(/\D/g, "");
    const rtNumber = Number(rtDigits);
    const rt = rtDigits && Number.isInteger(rtNumber) && rtNumber >= 1 && rtNumber <= 13 ? String(rtNumber).padStart(2, "0") : "";
    const phone = clean(body.phone, 40);
    const letterType = clean(body.letterType, 160);
    const purpose = clean(body.purpose, 700);

    if (!name || nik.length !== 16 || !phone || !letterType || !purpose) {
      return NextResponse.json(
        { error: "Nama, NIK 16 digit, kontak, jenis surat, dan keperluan wajib diisi." },
        { status: 400 },
      );
    }

    const id = ticket("SR");
    const now = new Date().toISOString();
    await setDocument("serviceRequests", id, {
      ticketId: id,
      name,
      nik,
      kk,
      rt,
      phone,
      letterType,
      purpose,
      status: "Baru",
      source: "website",
      createdAt: now,
      updatedAt: now,
    }, false);

    // Jangan menjalankan sinkronisasi seluruh administrasi di request publik.
    // Proses tersebut membaca banyak koleksi Firestore dan dapat membuat
    // Serverless Function Vercel timeout. Sinkronisasi tetap tersedia melalui
    // endpoint admin /api/admin/recalculate-administration.
    return NextResponse.json({ ok: true, ticketId: id });
  } catch (error) {
    console.error("[layanan-surat]", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Permohonan belum dapat dikirim." }, { status: 500 });
  }
}
